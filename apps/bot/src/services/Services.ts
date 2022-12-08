import { Client } from "discord.js";
import mysql from 'mysql';
import CacheService from "./CacheService";

export default class Services
{
  public discordClient: Client;
  private mysqlConnection: mysql.Connection
  private cacheService?: CacheService;

  constructor(discordClient: Client, mysqlConnection: mysql.Connection)
  {
    this.discordClient = discordClient;
    this.mysqlConnection = mysqlConnection;
  }

  getDiscordClient()
  {
    return this.discordClient;
  }

  getMysqlConnection()
  {
    return this.mysqlConnection;
  }

  setCaches(cacheService: CacheService)
  {
    this.cacheService = cacheService;
  }

  getCacheService()
  {
    return this.cacheService;
  }
}