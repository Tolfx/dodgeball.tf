import ServerRouterConfig from './api/routes/servers/Server.config';
import type Service from './Services';

export default class RouterService
{
  // Singleton instance
  static instance: RouterService | undefined;

  private service: Service;
  private configs = [ServerRouterConfig];

  // Make the constructor private to prevent instantiation outside of this class
  private constructor(service: Service)
  {
    this.service = service;

    this.configs.forEach((Config) =>
    {
      const express = this.service.getExpress();
      if (!express)
      {
        throw new Error('Express API not initialized');
      }
      new Config(express, this.service);
    });
  }

  // Create a static method to get the singleton instance
  static getInstance(service: Service): RouterService
  {
    if (!RouterService.instance)
    {
      // If there is no instance, create a new one
      RouterService.instance = new RouterService(service);
    }

    // Return the instance
    return RouterService.instance;
  }
}
