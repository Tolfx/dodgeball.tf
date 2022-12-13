import { DonatorUser } from "@dodgeball/mongodb";
import { Server } from "../mysql/queries/GetServers";
import Services from "./Services";
import Rcon from 'rcon-srcds';
import SteamID from "steamid";

export default class ServerService
{
  public services: Services;
  private server: Server;
  private Rcon: Rcon;

  constructor(services: Services, server: Server)
  {
    this.services = services;
    this.server = server;
    this.Rcon = new Rcon({
      host: server.address,
      port: server.port,
    });
  }

  async rcon(command: string)
  {
    try
    {
      await this.Rcon.authenticate(this.server.rcon_password);
      const response = await this.Rcon.execute(command);
      this.Rcon.disconnect();
      return response;
    }
    catch (e)
    {
      console.error(e);
    }
  }

  async addDonator(donator: DonatorUser)
  {
    // First add to database
    // RCON rehash
    await this.rcon('sm_rehash');
    const steamid = new SteamID(donator.steamId);
    await this.rcon(`sm_joinmsgonid "${steamid.steam2()}" "${donator.steamName}"`);
  }

  async updateDonator(donator: DonatorUser)
  {
    await this.rcon('sm_rehash');
    const steamid = new SteamID(donator.steamId);
    await this.rcon(`sm_joinmsgonid "${steamid.steam2()}" "${donator.steamName}"`);
  }

  async removeDonator(donator: DonatorUser)
  {
    await this.rcon('sm_rehash');
    const steamid = new SteamID(donator.steamId)
    await this.rcon(`sm_joinmsgoffid "${steamid.steam2()}"`);
  }

}