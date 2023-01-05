import PostRouterConfig from "./api/routes/posts/Posts.config";
import ServerRouterConfig from "./api/routes/servers/Server.config";
import type Service from "./Services";

export default class RouterService {
  private service: Service;

  private configs = [ServerRouterConfig, PostRouterConfig];

  constructor(service: Service) {
    this.service = service;

    this.configs.forEach((Config) => {
      const express = this.service.getExpress();
      if (!express) {
        throw new Error("Express API not initialized");
      }
      new Config(express, this.service);
    });
  }
}
