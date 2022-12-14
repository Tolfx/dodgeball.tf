import Logger from "@dodgeball/logger";
import { Application, Router } from "express";
import Services from "../../services/Services";
import DonatorConfig from "./Donator/Donator.config";
import Oauth2Config from "./Oauth2/Oauth2.config";

const LOG = new Logger("dodgeball:bot:api:routes:register.router");

export interface ConfigRouter {
  server: Application;
  router: Router;
  services: Services;
}

export interface ControllerRouter {
  server: Application;
  services: Services;
}

export default class RegisterRouters {
  private server: Application;
  private services: Services;

  private Routes = [Oauth2Config, DonatorConfig];

  constructor(services: Services) {
    this.services = services;
    this.server = this.services.getServer();
  }

  public registerRouters() {
    LOG.info("Registering Routers");
    this.Routes.forEach((route) => {
      LOG.info("Registering Route: " + route.name);
      new route(this.server, this.services);
    });
  }
}
