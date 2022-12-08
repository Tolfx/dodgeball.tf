import debug from "debug";
import { ActionRowBuilder, Client, Message, StringSelectMenuBuilder } from "discord.js";
import Services from "../../../services/Services";
import { TOPSPEED_SERVERS_IDS } from "../../../util/constants";
import { CommandHandler } from "../register.command";

const LOG = debug('dodgeball:bot:commands:topspeed');

export default class TopSpeedCommand implements CommandHandler
{
  name = 'topspeed';
  category = 'ranks';

  private services?: Services;
  private client?: Client;

  init(client: Client, services: Services)
  {
    LOG('Setting up topspeed command');
    this.client = client;
    this.services = services;
    // Add commands to client
    client.commands.set(this.name, this);
  }

  async on(message: Message, args: string[])
  {
    if (!this.services) return;
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('topspeed')
          .setPlaceholder('Select a server')
          .addOptions(TOPSPEED_SERVERS_IDS.map((server) => ({
            label: server.name,
            value: server.id
          })))
      )

    // @ts-ignore
    await message.channel.send({ content: 'Select a server', components: [row] });
  }
}