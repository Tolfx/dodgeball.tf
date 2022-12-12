import { DonatorUser } from "@dodgeball/mongodb";
import AddDonator from "../mysql/queries/AddDonator";
import GetServers, { Server } from "../mysql/queries/GetServers";
import UpdateDonator from "../mysql/queries/UpdateDonator";
import ServerService from "./ServerService";
import Services from "./Services";

export default class ServerRegisterService
{
  public services: Services;
  private servers: Map<Server["address"], ServerService>;

  constructor(services: Services)
  {
    this.services = services;
    this.servers = new Map();
  }

  public async start()
  {
    const servers = await GetServers()(this.services.getMysqlConnection());
    servers.forEach((server) => this.servers.set(`${server.address}:${server.port}`, new ServerService(this.services, server)));
  }

  public getServer(address: Server["address"], port: Server['port']): ServerService | undefined
  {
    return this.servers.get(`${address}:${port}`);
  }

  public getAllServers(): ServerService[]
  {
    return Array.from(this.servers.values());
  }

  public async addDonator(donator: DonatorUser)
  {
    await AddDonator(donator, this.services.getCacheService()?.getAllCachedServers()?.length)(this.services.getMysqlConnection());
    const servers = this.getAllServers();
    for (const server of servers)
    {
      await server.addDonator(donator);
    }
  }

  public async updateDonator(donator: DonatorUser)
  {
    await UpdateDonator(donator, this.services.getCacheService()?.getAllCachedServers()?.length)(this.services.getMysqlConnection());
    const servers = this.getAllServers();
    for (const server of servers)
    {
      await server.updateDonator(donator);
    }
  }

}