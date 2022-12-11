import { Application, Response, Request } from "express";
import Services from "../../../services/Services";
import type { ControllerRouter } from "../register.router";
import debug from "debug";
import { Client } from "discord.js";
import ErrorTemplate from "../../templates/Error.template";
import { Stripe } from "stripe";
import { API_DOMAIN, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "../../../util/constants";
import SuccessTemplate from "../../templates/Success.template";
import { DonatorUser, DonatorUserModel, DonatorUserSchema } from "@dodgeball/mongodb";

const LOG = debug('dodgeball:bot:api:routes:donator:donator.controller');

export default class DonatorController implements ControllerRouter
{
  public server: Application;
  public services: Services;
  private client: Client;
  private stripe: Stripe;

  constructor(server: Application, services: Services)
  {
    this.server = server;
    this.services = services;
    this.client = this.services.getDiscordClient();
    this.stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15",
    });
  }

  public async startStripePayment(req: Request, res: Response)
  {
    const { amount } = req.query;
    const user = req.user;
    if (!user)
      return res.status(401).send(ErrorTemplate("You are not logged in!"));

    if (!amount)
      return res.status(400).send(ErrorTemplate("No amount specified!"));

    const amountNum = parseFloat(String(amount));

    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: amountNum >= 25 ? 'Patron' : 'Supporter',
            },
            unit_amount: amountNum * 100,
          },
          quantity: 1,
        },
      ],
      // Add metadata to the session
      metadata: {
        // @ts-ignore
        steamId: user.steamId,
      },
      mode: 'payment',
      success_url: `${API_DOMAIN}/donator/stripe/success`,
      cancel_url: `${API_DOMAIN}/donator/stripe/cancel`,
    });

    return res.redirect(303, session.url!);
  }

  public async stripeSuccess(req: Request, res: Response)
  {
    return res.send(SuccessTemplate(`Payment successful! </br>
    Takes up to 48 hours to process! </br>
    Please contact us at your <a href="https://forum.dodgeball.tf/category/4/support-suggestions">forum</a> if you have any issues.`));
  }

  public async stripeCancel(req: Request, res: Response)
  {
    return res.send(ErrorTemplate("Payment cancelled!"));
  }

  public async stripeWebhook(req: Request, res: Response)
  {
    const sig = req.headers["stripe-signature"] as string;
    let event;
    try
    {
      // @ts-ignore
      event = this.stripe.webhooks.constructEvent(req.rawBody, sig, STRIPE_WEBHOOK_SECRET);
    }
    catch (err)
    {
      // @ts-ignore
      LOG(err.message)
      // @ts-ignore
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed')
    {
      const paymentIntent = event.data.object as any;
      const metadata = paymentIntent.metadata;
      // Assume we got steamId is in metadata,
      // so lets add the roles to the user
      if (!metadata.steamId)
        return res.json({ received: true });

      const donator = await DonatorUserModel.findOne({ steamId: metadata.steamId });
      // If its 25 it will look like 250 for some reason?
      const amount = parseInt(String(paymentIntent.amount_subtotal)) / 100;
      // Edge case
      if (!donator)
      {
        const newDonator = new DonatorUserModel({
          steamId: metadata.steamId,
          isActive: true,
          title: amount >= 25 ? 'patron' : 'supporter',
          isPermanent: amount >= 25 ? true : false,
          expiresAt: amount >= 25 ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          lastPaidAt: new Date(),
        });

        await newDonator.save();
      }
      // If they are already a donator, lets update their info
      else
      {
        const currentTitle = donator.title;
        donator.isActive = true;
        donator.title = currentTitle === 'patron' ? 'patron' : amount >= 25 ? 'patron' : 'supporter';
        donator.isPermanent = currentTitle === 'patron' ? true : amount >= 25 ? true : false;
        donator.expiresAt = currentTitle === 'patron' ? undefined : amount >= 25 ? undefined : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        donator.lastPaidAt = new Date();
        await donator.save();
      }
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }

}