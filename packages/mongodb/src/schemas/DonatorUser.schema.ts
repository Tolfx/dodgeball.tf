import { model, Schema, Document } from "mongoose";

export interface DonatorUser
{
  steamId: string;
  steamName: string;
  /**
   * Title of the donator, none is the default value
   */
  title: 'supporter' | 'patron' | 'booster' | 'none';
  isActive: boolean;
  isPermanent?: boolean;
  expiresAt?: Date;
  lastPaidAt?: Date;
}

export const DonatorUserSchema: Schema = new Schema({
  steamId: { type: String, required: true },
  steamName: { type: String, required: true },
  title: { type: String, enum: ['supporter', 'patron', ' booster', 'none'], default: 'none' },
  isActive: { type: Boolean, default: false },
  isPermanent: { type: Boolean, required: false },
  expiresAt: { type: Date, required: false },
  lastPaidAt: { type: Date, required: false },
});

export const DonatorUserModel = model<DonatorUser & Document>("donators", DonatorUserSchema);
