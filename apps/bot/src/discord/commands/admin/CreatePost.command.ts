import Logger from "@dodgeball/logger";
import { Client, Message } from "discord.js";
import marked from "marked";
import Services from "../../../services/Services";
import { CommandHandler } from "../register.command";
import { DISCORD_OWNER_ID } from "../../../util/constants";
import { PostsModel } from "@dodgeball/mongodb";
import { stripIndent } from "common-tags";

const LOG = new Logger("dodgeball:bot:commands:admin:CreatePostCommand");

export default class CreatePostCommand implements CommandHandler {
  name = "createpost";
  category = "admin";

  private services?: Services;
  private client?: Client;

  init(client: Client, services: Services) {
    LOG.info("Setting up create post command");
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
    const category = args[0];
    // Check if category is valid
    if (!["news", "updates"].includes(category)) {
      return message.channel.send({
        content: "Category must be either news or updates"
      });
    }
    const isHome = args[1] === "true";
    const markdown = args.slice(2).join(" ");

    // Check if markdown is valid
    if (!markdown.startsWith("```md") || !markdown.endsWith("```")) {
      return message.channel.send({
        content: "Markdown must be wrapped in ```md and ```"
      });
    }

    // Lets clean it up a bit
    // By removing the ```md and ```
    const cleanedMarkdown = markdown.slice(5, -3);

    const rawMarkdown = marked.marked.parse(stripIndent(cleanedMarkdown));

    // Create post
    const post = await new PostsModel({
      category,
      markdown: cleanedMarkdown,
      rawMarkdown,
      homePrint: isHome
    }).save();

    return message.channel.send({
      content: `Created post with id ${post._id}`
    });
  }
}
