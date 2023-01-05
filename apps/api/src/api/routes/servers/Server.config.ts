import { Application, Router } from "express";
import type Service from "../../../Services";
import ServerController from "./Server.controller";

export default class ServerRouterConfig {
  private server: Application;
  private router = Router();
  private service: Service;

  constructor(server: Application, service: Service) {
    this.server = server;
    this.service = service;
    this.server.use("/servers", this.router);

    const serverController = new ServerController(this.service);

    this.router.get("/", serverController.getServers.bind(serverController));

    this.router.get(
      "/serverinfo/:ip/:port",
      serverController.getServerInfo.bind(serverController)
    );
  }
}
