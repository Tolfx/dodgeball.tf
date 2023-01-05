import type { MongoDb } from '@dodgeball/mongodb';

/**
 * Services is a singleton class that provides access to the MongoDB database.
 */
class Services
{
  private static instance: Services;

  /**
   * Get the Services instance. If it does not exist, create it.
   *
   * @param mongoDB - The MongoDB instance
   * @returns The Services instance
   */
  static getInstance(mongoDB: MongoDb)
  {
    if (!Services.instance)
    {
      Services.instance = new Services(mongoDB);
    }
    return Services.instance;
  }

  private constructor(private mongoDB: MongoDb) {}

  /**
   * Set the MongoDB instance.
   *
   * @param mongoDB - The MongoDB instance
   */
  setMongoDB(mongoDB: MongoDb)
  {
    this.mongoDB = mongoDB;
  }

  /**
   * Get the MongoDB instance.
   *
   * @returns The MongoDB instance
   */
  getMongoDB()
  {
    return this.mongoDB;
  }
}

export default Services;

