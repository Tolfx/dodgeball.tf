import Logger from "@dodgeball/logger";
import { Client } from "discord.js";
import Services from "../../services/Services";
import OnInteractions from "./OnInteractions";
import OnMessage from "./OnMessage";
import OnReady from "./OnReady";

const LOG = new Logger("dodgeball:bot:discord:events:register.events");

export interface EventHandler {
  setup: (client: Client, services: Services) => void;
}

export default class EventRegister {
  private client: Client;

  private Events: EventHandler[] = [
    new OnMessage(),
    new OnReady(),
    new OnInteractions()
  ];

  constructor(private services: Services) {
    this.client = services.getDiscordClient();
  }

  registerEvents() {
    LOG.info("Registering events");
    this.Events.forEach((event) => {
      event.setup(this.client, this.services);
    });
  }
}
