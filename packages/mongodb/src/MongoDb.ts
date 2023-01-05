import mongoose from "mongoose";
import {
  MONGO_DATABASE,
  MONGO_HOST,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_USERNAME
} from "./utils/constants";

export default class MongoDb {
  private host: string;
  private port: number;
  private database: string;

  private username: string;
  private password: string;

  public mongoose?: mongoose.Mongoose;

  constructor(
    host: string = MONGO_HOST,
    port: number = MONGO_PORT,
    database: string = MONGO_DATABASE,
    username: string = MONGO_USERNAME,
    password: string = MONGO_PASSWORD
  ) {
    this.host = host;
    this.port = port;
    this.database = database;

    this.username = username;
    this.password = password;
  }

  public async connect() {
    try {
      this.mongoose = await mongoose.connect(
        `mongodb://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}?authSource=admin`
      );
    } catch (error) {
      throw new Error(`Error connecting to database: ${error}`);
    }
  }
}
