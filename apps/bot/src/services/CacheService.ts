import debug from "debug";
import GetServers, { Server } from "../mysql/queries/GetServers";
import Services from "./Services";

const LOG = debug('dodgeball:bot:CacheService')

export type CachedServer = {
  server: Server;
  lastTimeUpdated: Date;
}

export default class CacheService
{
  public cachedServers = new Map<Server['serverId'], CachedServer>()

  constructor(private services: Services)
  {
    // Each 5 minutes, we want to re-cache the servers
    setInterval(async () =>
    {
      this.reCacheServers();
    }, 1000 * 60 * 5);

    this.reCacheServers();
  }

  public async startCache()
  {
    await this.reCacheServers();
  }

  public getCachedServer(serverId: Server['serverId']): CachedServer | undefined
  {
    return this.cachedServers.get(serverId);
  }

  public getAllCachedServers(): CachedServer[]
  {
    return Array.from(this.cachedServers.values());
  }

  private updateCachedServer(server: Server): void
  {
    const cachedServer = this.getCachedServer(server.serverId);
    if (cachedServer)
    {
      cachedServer.server = server;
      cachedServer.lastTimeUpdated = new Date();
    }
    else
    {
      this.cachedServers.set(server.serverId, {
        server,
        lastTimeUpdated: new Date()
      });
    }
  }

  private async reCacheServers()
  {
    LOG('Re-caching servers');
    const servers = await GetServers()(this.services.getMysqlConnection());
    servers.forEach((server) => this.updateCachedServer(server));
  }
}