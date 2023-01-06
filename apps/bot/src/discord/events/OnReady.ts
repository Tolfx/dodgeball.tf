import Logger from "@dodgeball/logger";
import { ActivityType, Client } from "discord.js";
import Services from "../../services/Services";
import { EventHandler } from "./register.events";

const LOG = new Logger("dodgeball:bot:discord:events:onReady");

export default class OnReady implements EventHandler {
  private services?: Services;

  setup(client: Client, services: Services) {
    LOG.info("Setting up OnReady event");
    this.setupListeners(client);
    this.services = services;
  }

  setupListeners(client: Client) {
    client.on("ready", async () => {
      LOG.info("Bot is ready");
      // Set activity
      client.user?.setActivity("Dodgeball", { type: ActivityType.Competing });
    });
  }
}
