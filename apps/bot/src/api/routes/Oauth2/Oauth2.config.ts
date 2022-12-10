import { Application, Router } from "express";
import Services from "../../../services/Services";
import { ConfigRouter } from "../register.router";
import Oauth2Controller from "./Oauth2.controller";

export default class Oauth2Config implements ConfigRouter
{
  private controller: Oauth2Controller;
  public router = Router();

  constructor(public server: Application, public services: Services)
  {
    this.controller = new Oauth2Controller(server, services);
    this.server.use('/oauth2', this.router);
    this.router.get('/link', this.controller.linkAccounts.bind(this.controller));
    this.router.get('/discord', this.controller.discord.bind(this.controller));
    this.router.get('/discord/callback', this.controller.discordCallback.bind(this.controller));
    this.router.get('/steam', this.controller.steam.bind(this.controller));
    this.router.get('/steam/callback', [this.controller.steamCallback.bind(this.controller)]);
  }
}