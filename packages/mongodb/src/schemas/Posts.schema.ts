import { model, Schema, Document } from "mongoose";

export interface Posts {
  markdown: string;
  rawMarkdown: string;
  category: "news" | "updates";
  homePrint: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const PostsSchema: Schema = new Schema(
  {
    markdown: { type: String, required: true },
    rawMarkdown: { type: String, required: true },
    category: {
      type: String,
      enum: ["news", "updates"],
      default: "news"
    },
    homePrint: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

export const PostsModel = model<Posts & Document>("posts", PostsSchema);
