import { Application, Router } from "express";
import type Service from "../../../Services";
import PostsController from "./Posts.controller";

export default class PostRouterConfig {
  private server: Application;
  private router = Router();
  private service: Service;

  constructor(server: Application, service: Service) {
    this.server = server;
    this.service = service;
    this.server.use("/posts", this.router);
    const controller = new PostsController(this.service);
    this.router.get("/", controller.getPosts.bind(controller));
  }
}
