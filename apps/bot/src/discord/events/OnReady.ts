import debug from "debug";
import { ActivityType, Client } from "discord.js";
import Services from "../../services/Services";
import { EventHandler } from "./register.events";

const LOG = debug('dodgeball:bot:events:onReady');

export default class OnReady implements EventHandler
{
  private services?: Services;

  setup(client: Client, services: Services)
  {
    LOG('Setting up OnReady event');
    this.setupListeners(client);
    this.services = services;
  }

  setupListeners(client: Client)
  {
    client.on('ready', async () =>
    {
      LOG('Bot is ready');
      // Set activity
      client.user?.setActivity('Dodgeball', { type: ActivityType.Competing });
    });
  }
}