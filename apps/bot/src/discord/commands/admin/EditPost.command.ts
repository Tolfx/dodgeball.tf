import Logger from "@dodgeball/logger";
import { Client, Message } from "discord.js";
import Services from "../../../services/Services";
import { CommandHandler } from "../register.command";
import { DISCORD_OWNER_ID } from "../../../util/constants";
import { PostsModel } from "@dodgeball/mongodb";

const LOG = new Logger("dodgeball:bot:commands:admin:EditPostCommand");

export default class EditPostCommand implements CommandHandler {
  name = "editpost";
  category = "admin";

  private services?: Services;
  private client?: Client;

  init(client: Client, services: Services) {
    LOG.info("Setting up edit post command");
    this.client = client;
    this.services = services;
    // Add commands to client
    client.commands.set(this.name, this);
  }

  private protectCommand(message: Message) {
    // Must owner
    const ownerIds = DISCORD_OWNER_ID;
    if (!ownerIds.includes(message.author.id)) {
      return false;
    }
    return true;
  }

  async on(message: Message, args: string[]) {
    if (!this.protectCommand(message)) {
      return;
    }
    // We will assume command is in this order format: {prefix}createpost category isHome markdown
    // We can assume we use ```md to wrap the markdown
    // We can assume we end it with ``` too
    const id = args[0];
    const post = await PostsModel.findById(id);
    if (!post) {
      return message.channel.send({
        content: "Post not found"
      });
    }
    const category = args[1];
    // Check if category is valid
    if (!["news", "updates"].includes(category)) {
      return message.channel.send({
        content: "Category must be either news or updates"
      });
    }
    const isHome = args[2] === "true";
    const markdown = args.slice(3).join(" ");

    // Check if markdown is valid
    if (!markdown.startsWith("```html") || !markdown.endsWith("```")) {
      return message.channel.send({
        content: "Markdown must be wrapped in ```html and ```"
      });
    }

    // Lets clean it up a bit
    // By removing the ```html and ```
    const cleanedMarkdown = markdown.slice(7, -3);

    post.category = category as "news" | "updates";
    post.homePrint = isHome;
    post.markdown = cleanedMarkdown;
    post.rawMarkdown = cleanedMarkdown;
    await post.save();

    return message.channel.send({
      content: `Updated post with id ${post._id}`
    });
  }
}
