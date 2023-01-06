import Logger from "@dodgeball/logger";
import { Client, Message } from "discord.js";
import Services from "../../../services/Services";
import HelpEmbed from "../../embeds/information/Help.embed";
import { CommandHandler } from "../register.command";

const LOG = new Logger("dodgeball:bot:commands:help");

export default class HelpCommand implements CommandHandler {
  name = "help";
  category = "information";

  private services?: Services;
  private client?: Client;

  init(client: Client, services: Services) {
    LOG.info("Setting up help command");
    this.client = client;
    this.services = services;
    // Add commands to client
    client.commands.set(this.name, this);
  }

  async on(message: Message, args: string[]) {
    return message.channel.send({
      embeds: [HelpEmbed().toJSON()]
    });
  }
}
