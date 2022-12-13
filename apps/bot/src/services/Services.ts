import { MongoDb } from "@dodgeball/mongodb";
import { Client } from "discord.js";
import { Application } from "express";
import mysql from 'mysql';
import RegisterEvents from "../events/register.events";
import CacheService from "./CacheService";
import ServerRegisterService from "./ServerRegisterService";

export default class Services
{
  public discordClient: Client;
  private mysqlConnection: mysql.Connection
  private mongodb: MongoDb;
  private server: Application;
  private cacheService?: CacheService;
  private serverRegisterService?: ServerRegisterService;
  private eventRegister?: RegisterEvents;

  constructor(discordClient: Client, mysqlConnection: mysql.Connection, mongodb: MongoDb, server: Application)
  {
    this.discordClient = discordClient;
    this.mysqlConnection = mysqlConnection;
    this.mongodb = mongodb;
    this.server = server;
  }

  getDiscordClient()
  {
    return this.discordClient;
  }

  getMysqlConnection()
  {
    return this.mysqlConnection;
  }

  getMongoDB()
  {
    return this.mongodb;
  }

  getServer()
  {
    return this.server;
  }

  setCaches(cacheService: CacheService)
  {
    this.cacheService = cacheService;
  }

  getCacheService()
  {
    return this.cacheService;
  }

  setServerRegisterService(serverRegisterService: ServerRegisterService)
  {
    this.serverRegisterService = serverRegisterService;
  }

  getServerRegisterService()
  {
    return this.serverRegisterService;
  }

  setEventRegister(eventRegister: RegisterEvents)
  {
    this.eventRegister = eventRegister;
  }

  getEventRegister()
  {
    return this.eventRegister;
  }
}