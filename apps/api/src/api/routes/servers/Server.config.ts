import { Application, Router } from 'express';
import type Service from '../../../Services';
import ServerController from './Server.controller';


/**
 * This class is responsible for setting up the server routes and handling
 * requests to those routes.
 */
export default class ServerRouterConfig
{
  /**
   * The express application instance.
   */
  private server: Application;

  /**
   * The express router instance.
   */
  private router = Router();

  /**
   * The service instance, which holds the shared dependencies between
   * different parts of the application.
   */
  private service: Service;

  /**
   * Initializes a new instance of the ServerRouterConfig class.
   *
   * @param server The express application instance.
   * @param service The service instance.
   */
  constructor(server: Application, service: Service)
  {
    this.server = server;
    this.service = service;
    this.server.use('/servers', this.router);

    const serverController = new ServerController(this.service);

    // Set up the route for retrieving a list of servers.
    this.router.get('/', serverController.getServers.bind(serverController));

    // Set up the route for retrieving server information for a specific IP address and port.
    this.router.get('/serverinfo/:ip/:port', serverController.getServerInfo.bind(serverController));
  }
}