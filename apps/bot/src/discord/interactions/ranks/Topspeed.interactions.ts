import debug from "debug";
import { Client, StringSelectMenuInteraction, ChatInputCommandInteraction } from "discord.js";
import GetTopSpeedPlayers from "../../../mysql/queries/GetTopSpeedPlayers";
import Services from "../../../services/Services";
import TopSpeedPlayerEmbed from "../../embeds/ranks/Topspeedplayer.embed";
import { InteractionsHandler } from "../register.interactions";

const LOG = debug('dodgeball:bot:interactions:topspeed');

export default class TopSpeedInteractions implements InteractionsHandler
{
  name = 'topspeed';
  category = 'ranks';

  private services?: Services;
  private client?: Client;

  init(client: Client, services: Services)
  {
    LOG('Setting up topspeed interactions');
    this.client = client;
    this.services = services;
    this.client.interactions.set(this.name, this);
  }

  async stringmenu(interaction: StringSelectMenuInteraction)
  {
    if (!this.services) return;
    const serverid = interaction.values[0];

    const players = await GetTopSpeedPlayers(serverid)(this.services.getMysqlConnection());

    // Take only the first 10 players
    const topPlayers = players.slice(0, 10);

    await interaction.reply({
      embeds: [
        TopSpeedPlayerEmbed(topPlayers).toJSON()
      ], ephemeral: true
    });
  }

  async command(interaction: ChatInputCommandInteraction)
  {
    if (!this.services) return;
    const server = interaction.options.data.find((option) => option.name === 'server');
    if (!server) return;
    if (!server.value) return;

    const players = await GetTopSpeedPlayers(String(server.value))(this.services.getMysqlConnection());

    // Take only the first 10 players
    const topPlayers = players.slice(0, 10);

    await interaction.reply({ embeds: [TopSpeedPlayerEmbed(topPlayers).toJSON()], ephemeral: true });
  }
}