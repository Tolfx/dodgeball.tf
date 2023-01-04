import { Server } from '@dodgeball/mongodb';
import debug from 'debug';
import { Request, Response } from 'express';
import getServerInfo from '../../../hl2/getServerInfo';
import Services from '../../../Services';

// Debug logger for logging messages related to server controller
const LOG = debug('dodgeball:api:routes:servers:Server.controller');

/**
 * Controller class for handling server-related routes.
 *
 * @param service - An instance of the Services class
 */
export default class ServerController 
{
  private service: Services;
  private formattedServers: any[] = [];

  constructor(service: Services) 
  {
    this.service = service;
  }

  /**
   * Route handler for retrieving a list of servers.
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  async getServers(req: Request, res: Response) 
  {
    // Log that we are getting the servers
    LOG(`Getting servers`);
    // Array of IP addresses of servers we own
    const ODB_SERVER = ['185.107.96.145'];
    // Get all servers sorted by IP address
    const servers = await Server.find().sort({ ip: 1 });
    // Log the number of servers we have
    LOG(`Got servers ${servers.length}`);
    // Iterate over each server
    for await (const server of servers) 
    {
      try 
      {
        // Get the formatted server information
        const formattedServer = await getServerInfo(server.ip, server.port);
        // If the map does not start with 'tfdb_', skip this server
        if (!formattedServer.map.startsWith('tfdb_')) continue;
        // If the server is owned by our company, add it to the beginning of the array
        // Otherwise, add it to the end of the array
        if (ODB_SERVER.includes(server.ip)) 
        {
          this.formattedServers.unshift(formattedServer);
        }
        else
        {
          this.formattedServers.push(formattedServer);
        }
      }
      catch (err)
      {
        // Log the error and continue to the next server
        LOG(`Error getting server info for ${server.ip}:${server.port}`);
        LOG(err);
      }
    }

    // Return the formatted server information as a JSON array
    return res.status(200).json(this.formattedServers);
  }

  /**
   * Route handler for retrieving information about a specific server.
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  async getServerInfo(req: Request, res: Response)
  {
    // Destructure the IP and port from the request params
    const { ip, port } = req.params;
    // Log that we are getting the server information
    LOG(`Getting server info for ${ip}:${port}`);
    // Find the formatted server information in the array
    const server = this.formattedServers.find(s => s.ip === ip && s.port === port);
    // If we cannot find the server, return a 404 error
    if (!server)
    {
      LOG(`Server info for ${ip}:${port} does not exist`);
      return res.status(404).json({ error: 'Server not found' });
    }

    try
    {
      // Split the connection string into an IP and port
      const [ip, port] = server.connect.split(':');
      // Get the updated formatted server information
      const formattedServer = await getServerInfo(ip, port);
      // Find the index of the server in the array
      const index = this.formattedServers.findIndex(s => s.ip === server.ip && s.port === server.port);
      // Update the array with the updated formatted server information
      this.formattedServers[index] = formattedServer;
      // Return the updated formatted server information as a JSON object
      return res.status(200).json(formattedServer);
    }
    catch (err)
    {
      // Log the error and return a 500 error
      LOG(`Error getting server info for ${server.ip}:${server.port}`);
      LOG(err);
      return res.status(500).json({ error: 'Error getting server info' });
    }
  }
}
