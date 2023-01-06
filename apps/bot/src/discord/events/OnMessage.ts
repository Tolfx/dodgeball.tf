import Logger from "@dodgeball/logger";
import { Client } from "discord.js";
import Services from "../../services/Services";
import { DISCORD_PREFIX } from "../../util/constants";
import { EventHandler } from "./register.events";

const LOG = new Logger("dodgeball:bot:events:onMessage");

export default class OnMessage implements EventHandler {
  private services?: Services;

  setup(client: Client, services: Services) {
    LOG.info("Setting up OnMessage event");
    this.setupListeners(client);
    this.services = services;
  }

  setupListeners(client: Client) {
    LOG.info("Listening for messages");
    client.on("messageCreate", async (message) => {
      if (message.author.bot) return;
      if (!message.content.startsWith(DISCORD_PREFIX)) return;
      if (!message.guild) return;

      const args = message.content
        .slice(DISCORD_PREFIX.length)
        .trim()
        .split(/ +/g);
      const cmd = args.shift()?.toLowerCase();

      if (!cmd) return;
      if (cmd.length === 0) return;

      const command = client.commands.get(cmd);
      if (!command) return;

      return command.on(message, args);
    });
  }
}
