import debug from "debug";
import { Request, Response } from "express";
import getServerInfo from "../../../hl2/getServerInfo";
import Services from "../../../Services";
import GetServers from "@dodgeball/mysql/dist/queries/GetServers";

const LOG = debug("dodgeball:api:routes:servers:Server.controller");

export default class ServerController {
  private service: Services;

  constructor(service: Services) {
    this.service = service;
  }

  async getServers(req: Request, res: Response) {
    LOG(`Getting servers`);
    // We will be a bit biased and add put our servers on the top
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const servers = await GetServers()(this.service.getMySQL().connection!);

    LOG(`Got servers ${servers.length}`);
    // Go through each server and format it
    for await (const server of servers) {
      const hasBeenFormatted = this.service.formattedServers.has(
        `${server.address}:${server.port}`
      );
      if (hasBeenFormatted) continue;

      try {
        const formattedServer = await getServerInfo(
          server.address,
          server.port
        );
        // Filter if map isn't tfdb_ in the beginning
        if (!formattedServer.map.startsWith("tfdb_")) continue;
        this.service.formattedServers.set(
          `${server.address}:${server.port}`,
          formattedServer
        );
      } catch (err) {
        LOG(`Error getting server info for ${server.address}:${server.port}`);
        LOG(err);
        continue;
      }
    }

    return res.status(200).json([...this.service.formattedServers.values()]);
  }

  async getServerInfo(req: Request, res: Response) {
    const { ip, port } = req.params;
    LOG(`Getting server info for ${ip}:${port}`);
    const exists = this.service.formattedServers.has(`${ip}:${port}`);
    if (!exists) {
      LOG(`Server info for ${ip}:${port} does not exist`);
      return res.status(404).json({ error: "Server not found" });
    }

    const server = this.service.formattedServers.get(`${ip}:${port}`);
    try {
      const [ip, port] = server.connect.split(":");
      const formattedServer = await getServerInfo(ip, port);
      this.service.formattedServers.set(
        `${server.ip}:${server.port}`,
        formattedServer
      );
      return res.status(200).json(formattedServer);
    } catch (err) {
      LOG(`Error getting server info for ${server.ip}:${server.port}`);
      LOG(err);
      return res.status(500).json({ error: "Error getting server info" });
    }
  }
}
