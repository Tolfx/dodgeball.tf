import { MongoDb } from "@dodgeball/mongodb";
import MySQL from "@dodgeball/mysql";

export default class Services
{
  constructor(private mysql: MySQL, private mongodb: MongoDb) {}

  getMysql()
  {
    return this.mysql;
  }

  getMongodb()
  {
    return this.mongodb;
  }
}