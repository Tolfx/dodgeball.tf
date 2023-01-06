import Logger from "@dodgeball/logger";
import { Client } from "discord.js";
import Services from "../../services/Services";
import { EventHandler } from "./register.events";

const LOG = new Logger("dodgeball:bot:discord:events:OnInteractions");

export default class OnInteractions implements EventHandler {
  private services?: Services;

  setup(client: Client, services: Services) {
    LOG.info("Setting up OnInteractions event");
    this.setupListeners(client);
    this.services = services;
  }

  setupListeners(client: Client) {
    LOG.info("Listening for Interactions");
    client.on("interactionCreate", async (interaction) => {
      if (interaction.isStringSelectMenu()) {
        const { customId } = interaction;
        const inter = client.interactions.get(customId);
        if (!inter) return;
        inter.stringmenu?.(interaction);
      }

      if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;
        const inter = client.interactions.get(commandName);
        if (!inter) return;
        inter.command?.(interaction);
      }
    });
  }
}
