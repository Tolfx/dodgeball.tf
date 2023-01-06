import { Application, Response, Request } from "express";
import Services from "../../../services/Services";
import type { ControllerRouter } from "../register.router";
import Logger from "@dodgeball/logger";
import { Client } from "discord.js";
import ErrorTemplate from "../../templates/Error.template";
import { Stripe } from "stripe";
import {
  API_DOMAIN,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET
} from "../../../util/constants";
import SuccessTemplate from "../../templates/Success.template";
import { DonatorUserModel } from "@dodgeball/mongodb";
import { Event } from "../../../events/register.events";
import { OnDonatePayload } from "../../../events/Donations/OnDonateAdd.event";
import { OnDonateUpdatePayload } from "../../../events/Donations/OnDonateUpdate.event";
import { OnErrorPayload } from "../../../events/Errors/OnError.event";

const LOG = new Logger("dodgeball:bot:api:routes:donator:donator.controller");

export default class DonatorController implements ControllerRouter {
  public server: Application;
  public services: Services;
  private client: Client;
  private stripe: Stripe;

  constructor(server: Application, services: Services) {
    this.server = server;
    this.services = services;
    this.client = this.services.getDiscordClient();
    this.stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15"
    });
  }

  private processDate(amount: number) {
    // Since minimum donation is $2.50 which is 1 month
    // so if its 5 dollars, then its 2 months
    // etc
    const months = Math.floor(amount / 2.5);
    const days = Math.floor((amount % 2.5) * 30);

    const date = new Date();
    date.setMonth(date.getMonth() + months);
    date.setDate(date.getDate() + days);

    return {
      months,
      days,
      date
    };
  }

  public async startStripePayment(req: Request, res: Response) {
    const { amount } = req.query;
    const user = req.user;
    if (!user)
      return res.status(401).send(ErrorTemplate("You are not logged in!"));

    if (!amount)
      return res.status(400).send(ErrorTemplate("No amount specified!"));

    const amountNum = parseFloat(String(amount));

    if (amountNum < 2.5)
      return res.status(400).send(ErrorTemplate("Minimum amount is $2.50!"));

    const date = this.processDate(amountNum);

    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name:
                amountNum >= 25
                  ? "Patron"
                  : `Supporter (${date.months} months, ${date.days} days)`
            },
            unit_amount: amountNum * 100
          },
          quantity: 1
        }
      ],
      // Add metadata to the session
      metadata: {
        steamId: user.steamId,
        steamName: user.steamName
      },
      mode: "payment",
      success_url: `${API_DOMAIN}/donator/stripe/success`,
      cancel_url: `${API_DOMAIN}/donator/stripe/cancel`
    });

    if (!session.url)
      return res.status(500).send(ErrorTemplate("Something went wrong!"));

    return res.redirect(303, session.url);
  }

  public async stripeSuccess(req: Request, res: Response) {
    return res.send(
      SuccessTemplate(`Payment successful! </br>
    Takes up to 48 hours to process! </br>
    Please contact us at your <a href="https://forum.dodgeball.tf/category/4/support-suggestions">forum</a> if you have any issues.`)
    );
  }

  public async stripeCancel(req: Request, res: Response) {
    return res.send(ErrorTemplate("Payment cancelled!"));
  }

  public async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers["stripe-signature"] as string;
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(
        // @ts-ignore
        req.rawBody,
        sig,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      // @ts-ignore
      LOG.error(err.message);
      // @ts-ignore
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const paymentIntent = event.data.object as any;
      const metadata = paymentIntent.metadata;
      // Assume we got steamId is in metadata,
      // so lets add the roles to the user
      if (!metadata.steamId) {
        LOG.error("No steamId in metadata!");
        this.services.getEventRegister()?.emit(
          new Event<OnErrorPayload>("1", "error", {
            error: new Error("No steamId in metadata!"),
            reason:
              "We got a payment with no steamid in it, needs manual inspection!"
          })
        );
        return res.json({ received: true });
      }

      const donator = await DonatorUserModel.findOne({
        steamId: metadata.steamId
      });
      // If its 25 it will look like 250 for some reason?
      const amount = parseInt(String(paymentIntent.amount_subtotal)) / 100;
      // Edge case
      if (!donator) {
        const newDonator = new DonatorUserModel({
          steamId: metadata.steamId,
          steamName: metadata.steamName,
          isActive: true,
          title: amount >= 25 ? "patron" : "supporter",
          isPermanent: amount >= 25 ? true : false,
          expiresAt: amount >= 25 ? null : this.processDate(amount).date,
          donations: [
            {
              amount: String(amount),
              currency: "USD",
              createdAt: new Date()
            }
          ],
          lastPaidAt: new Date()
        });

        await newDonator.save();

        this.services.getEventRegister()?.emit(
          new Event<OnDonatePayload>("1", "donator.added", {
            donator: newDonator
          })
        );
      }
      // If they are already a donator, lets update their info
      else {
        let date = this.processDate(amount).date;
        if (donator.expiresAt) {
          // check if date has expired
          if (donator.expiresAt.getTime() < Date.now())
            date = this.processDate(amount).date;
          else
            date = new Date(
              donator.expiresAt.getTime() +
                this.processDate(amount).date.getTime()
            );
        }
        const currentTitle = donator.title;
        const wasActive = donator.isActive;
        donator.isActive = true;
        donator.title =
          currentTitle === "patron"
            ? "patron"
            : amount >= 25
            ? "patron"
            : "supporter";
        donator.isPermanent =
          currentTitle === "patron" ? true : amount >= 25 ? true : false;
        donator.expiresAt =
          currentTitle === "patron"
            ? undefined
            : amount >= 25
            ? undefined
            : date;
        donator.lastPaidAt = new Date();
        donator.donations.push({
          amount: String(amount),
          currency: "USD",
          createdAt: new Date()
        });
        await donator.save();
        if (!wasActive) {
          this.services
            .getEventRegister()
            ?.emit(
              new Event<OnDonatePayload>("1", "donator.added", { donator })
            );
        } else {
          this.services.getEventRegister()?.emit(
            new Event<OnDonateUpdatePayload>("1", "donator.updated", {
              donator,
              beforeAmount: amount,
              beforeTitle: currentTitle
            })
          );
        }
      }
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }

  public async getDonators(req: Request, res: Response) {
    // Lets get donators who has donations, so we can show them in the hall of fame
    const donators = await DonatorUserModel.find({
      donations: { $exists: true, $not: { $size: 0 } }
    });
    // Sort them by the amount of donations they have
    // We want to sort by checking the amount in donators.donations.amount
    // and then sum them up
    const sortedDonators = donators.sort((a, b) => {
      const aAmount = a.donations.reduce(
        (acc, curr) => acc + parseFloat(curr.amount),
        0
      );
      const bAmount = b.donations.reduce(
        (acc, curr) => acc + parseFloat(curr.amount),
        0
      );
      return bAmount - aAmount;
    });

    // Lets also not include everything, we only want name and the amount
    const donatorsToSend = sortedDonators.map((donator) => {
      const amount = donator.donations.reduce(
        (acc, curr) => acc + parseFloat(curr.amount),
        0
      );
      return {
        name: donator.steamName,
        amount,
        steamid: donator.steamId
      };
    });

    return res.send(donatorsToSend);
  }
}
