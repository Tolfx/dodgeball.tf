import mongoose from "mongoose";

export default class MongoDb
{
  private host: string;
  private port: number;
  private database: string;

  private username: string;
  private password: string;

  public mongoose?: mongoose.Mongoose;

  constructor(host: string, port: number, database: string, username: string, password: string)
  {
    this.host = host;
    this.port = port;
    this.database = database;

    this.username = username;
    this.password = password;
  }

  public async connect()
  {
    try
    {
      this.mongoose = await mongoose.connect(`mongodb://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}?authSource=admin`);
    }
    catch (error)
    {
      throw new Error(`Error connecting to database: ${error}`);
    }
  }

}
