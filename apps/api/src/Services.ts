import type { MongoDb } from '@dodgeball/mongodb';
import MySQL from '@dodgeball/mysql';
import { Express } from 'express';
import { Server as SocketServer } from 'socket.io';

export default class Services
{
  // Create a static property to hold the singleton instance
  static instance: Services | undefined;

  private mongoDB?: MongoDb;
  private mysql: MySQL;
  private express?: Express;
  private socketIo?: SocketServer;
  public formattedServers: Map<string, any>;

  // Make the constructor private to prevent instantiation outside of this class
  private constructor(mongoDB: MongoDb, mysql: MySQL)
  {
    this.mongoDB = mongoDB;
    this.mysql = mysql;
    this.formattedServers = new Map();
  }

  // Create a static method to get the singleton instance
  static getInstance(mongoDB: MongoDb, mysql: MySQL): Services
  {
    if (!Services.instance)
    {
      // If there is no instance, create a new one
      Services.instance = new Services(mongoDB, mysql);
    }

    // Return the instance
    return Services.instance;
  }

  setMongoDB(mongoDB: MongoDb)
  {
    this.mongoDB = mongoDB;
  }

  getMongoDB()
  {
    return this.mongoDB;
  }

  setExpress(express: Express)
  {
    this.express = express;
  }

  getExpress()
  {
    return this.express;
  }

  setSocketIo(socketIo: SocketServer)
  {
    this.socketIo = socketIo;
  }

  getSocketIo()
  {
    return this.socketIo;
  }

  getMySQL()
  {
    return this.mysql;
  }
}