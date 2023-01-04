import debug from 'debug';
import { Request, Response } from 'express';
import getServerInfo from '../../../hl2/getServerInfo';
import Services from '../../../Services';
import GetServers from '@dodgeball/mysql/dist/queries/GetServers';

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
    // We will be a bit biased and add put our servers on the top
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const servers = await GetServers()(this.service.getMySQL().connection!);

    LOG(`Got servers ${servers.length}`);
    // Iterate over each server
    for await (const server of servers)
    {
      const hasBeenFormatted = this.service.formattedServers.has(`${server.address}:${server.port}`);
      if (hasBeenFormatted)
        continue;

      try
      {
        const formattedServer = await getServerInfo(server.address, server.port);
        // Filter if map isn't tfdb_ in the beginning
        if (!formattedServer.map.startsWith('tfdb_'))
          continue;
        this.service.formattedServers.set(`${server.address}:${server.port}`, formattedServer);
      }
      catch (err)
      {
        // Log the error and continue to the next server
        LOG(`Error getting server info for ${server.address}:${server.port}`);
        LOG(err);
      }
    }

    // Return the formatted server information as a JSON array
    return res.status(200).json([...this.service.formattedServers.values()]);
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
    const exists = this.service.formattedServers.has(`${ip}:${port}`);
    if (!exists)
    {
      LOG(`Server info for ${ip}:${port} does not exist`);
      return res.status(404).json({ error: 'Server not found' });
    }

    const server = this.service.formattedServers.get(`${ip}:${port}`);
    try
    {
      // Split the connection string into an IP and port
      const [ip, port] = server.connect.split(':');
      // Get the updated formatted server information
      const formattedServer = await getServerInfo(ip, port);
      this.service.formattedServers.set(`${server.ip}:${server.port}`, formattedServer);
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