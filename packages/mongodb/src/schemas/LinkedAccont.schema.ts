import { model, Schema, Document } from "mongoose";

export interface LinkedAccount
{
  steamId: string;
  discordId: string;
}

export const LinkedAccountSchema: Schema = new Schema({
  steamId: { type: String, required: true },
  discordId: { type: String, required: true },
});

export const LinkedAccountModel = model<LinkedAccount & Document>("linkedaccount", LinkedAccountSchema);
