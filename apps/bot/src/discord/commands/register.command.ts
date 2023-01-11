import Logger from "@dodgeball/logger";
import { Client, Message } from "discord.js";
import Services from "../../services/Services";
import HelpCommand from "./information/Help.command";
import TopSpeedCommand from "./ranks/Topspeed.command";
import CreatePostCommand from "./admin/CreatePost.command";
import EditPostCommand from "./admin/EditPost.command";
import AddDonatorCommand from "./admin/AddDonator.command";

const LOG = new Logger("dodgeball:bot:discord:commands:register.commands");

declare module "discord.js" {
  interface Client {
    commands: Map<string, CommandHandler>;
  }
}

export interface CommandHandler {
  name: string;
  category: string;
  init: (client: Client, services: Services) => void;
  on: (message: Message, args: string[]) => void;
}

export default class CommandRegister {
  private client: Client;

  private Commands: CommandHandler[] = [
    new TopSpeedCommand(),
    new CreatePostCommand(),
    new EditPostCommand(),
    new AddDonatorCommand(),
    new HelpCommand()
  ];

  constructor(private services: Services) {
    this.client = services.getDiscordClient();
    this.client.commands = new Map<string, CommandHandler>();
  }

  registerCommands() {
    LOG.info("Registering commands");
    this.Commands.forEach((command) => {
      command.init(this.client, this.services);
    });
  }
}
