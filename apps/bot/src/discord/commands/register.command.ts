import debug from "debug";
import { Client, Message } from "discord.js";
import Services from "../../services/Services";
import HelpCommand from "./information/Help.command";
import TopSpeedCommand from "./ranks/Topspeed.command";

const LOG = debug("dodgeball:bot:commands:register.commands");

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
    new HelpCommand(),
    new TopSpeedCommand()
  ];

  constructor(private services: Services) {
    this.client = services.getDiscordClient();
    this.client.commands = new Map<string, CommandHandler>();
  }

  registerCommands() {
    LOG("Registering commands");
    this.Commands.forEach((command) => {
      command.init(this.client, this.services);
    });
  }
}
