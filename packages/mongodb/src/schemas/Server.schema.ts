import { model, Model, Schema, Document } from "mongoose";

export interface IServer {
  ip: string;
  port: number;
}

export interface IServerModel extends IServer, Document {}

export const ServerSchema: Schema = new Schema({
  ip: { type: String, required: true },
  port: { type: Number, required: true }
});

export const Server: Model<IServerModel> = model<IServerModel>(
  "server",
  ServerSchema
);
