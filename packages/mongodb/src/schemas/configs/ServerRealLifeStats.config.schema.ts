import { model, Schema, Document } from "mongoose";

export interface ServerRealLifeStats {
  serverId: string;
  discordChannelId: string;
  discordGuildId: string;
  discordMessageId: string;
}

export const ServerRealLifeStatsSchema: Schema = new Schema({
  serverId: { type: String, required: true },
  discordChannelId: { type: String, required: true },
  discordGuildId: { type: String, required: true },
  discordMessageId: { type: String, required: true }
});

export const ServerRealLifeStatsModel = model<ServerRealLifeStats & Document>(
  "configs",
  ServerRealLifeStatsSchema
);
