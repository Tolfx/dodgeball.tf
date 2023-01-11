import { Application, Router } from "express";
import passport from "passport";
import Services from "../../../services/Services";
import DonateTemplate from "../../templates/Donate.template";
import { ConfigRouter } from "../register.router";
import DonatorController from "./Donator.controller";

declare module "express-session" {
  interface SessionData {
    amount?: string;
  }
}

export default class DonatorConfig implements ConfigRouter {
  private controller: DonatorController;
  public router = Router();

  constructor(public server: Application, public services: Services) {
    this.controller = new DonatorController(server, services);
    this.server.use("/donator", this.router);
    this.router.get("/", async (req, res) => {
      const query = req.query;
      if (!req.isAuthenticated()) return res.redirect("/donator/auth/steam");
      res.send(DonateTemplate(parseFloat(String(query.amount ?? 2.5))));
    });
    this.router.get(
      "/auth/steam",
      passport.authenticate("steam", { failureRedirect: "/donator" })
    );
    this.router.get(
      "/auth/steam/callback",
      passport.authenticate("steam", { failureRedirect: "/auth/steam" }),
      (req, res) => {
        res.redirect("/donator");
      }
    );

    this.router.get(
      "/stripe",
      this.controller.startStripePayment.bind(this.controller)
    );
    this.router.get(
      "/stripe/success",
      this.controller.stripeSuccess.bind(this.controller)
    );
    this.router.get(
      "/stripe/cancel",
      this.controller.stripeCancel.bind(this.controller)
    );
    this.router.post(
      "/stripe/webhook",
      this.controller.stripeWebhook.bind(this.controller)
    );
    this.router.get(
      "/paypal",
      this.controller.startPaypalPayment.bind(this.controller)
    );
    this.router.get(
      "/paypal/success",
      this.controller.paypalPaymentSuccess.bind(this.controller)
    );
    this.router.get(
      "/paypal/cancel",
      this.controller.paypalPaymentCancel.bind(this.controller)
    );

    this.router.get(
      "/hall-of-fame",
      this.controller.getDonators.bind(this.controller)
    );
  }
}
