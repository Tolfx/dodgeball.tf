import { MongoDb } from "@dodgeball/mongodb";
import MySQL from "@dodgeball/mysql";

/**
 * Services is a singleton class that provides access to the MySQL and MongoDB
 * databases.
 */
class Services
{
  private static instance: Services;

  private constructor(private mysql: MySQL, private mongodb: MongoDb) {}

  /**
   * Get the Services instance. If it does not exist, create it.
   *
   * @param mysql - The MySQL instance
   * @param mongodb - The MongoDB instance
   * @returns The Services instance
   */
  static getInstance(mysql: MySQL, mongodb: MongoDb)
  {
    if (!Services.instance)
    {
      Services.instance = new Services(mysql, mongodb);
    }
    return Services.instance;
  }

  /**
   * Get the MySQL instance.
   *
   * @returns The MySQL instance
   */
  getMysql()
  {
    return this.mysql;
  }

  /**
   * Get the MongoDB instance.
   *
   * @returns The MongoDB instance
   */
  getMongodb()
  {
    return this.mongodb;
  }
}

export default Services;
