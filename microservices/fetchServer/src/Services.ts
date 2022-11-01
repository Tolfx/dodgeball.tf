import type { MongoDb } from '@dodgeball/mongodb';

export default class Services
{
  private mongoDB?: MongoDb;

  constructor(mongoDB: MongoDb)
  {
    this.mongoDB = mongoDB;
  }

  setMongoDB(mongoDB: MongoDb)
  {
    this.mongoDB = mongoDB;
  }

  getMongoDB()
  {
    return this.mongoDB;
  }
}