import type { MongoDb } from '@dodgeball/mongodb';
import { Express } from 'express';
import { Server as SocketServer } from 'socket.io';

export default class Services
{
  private mongoDB?: MongoDb;
  private express?: Express;
  private socketIo?: SocketServer;

  public formattedServers: Map<string, any>;

  constructor(mongoDB: MongoDb)
  {
    this.mongoDB = mongoDB;
    this.formattedServers = new Map();
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
}