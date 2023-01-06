import Logger from "@dodgeball/logger";
import { Client, ChatInputCommandInteraction } from "discord.js";
import DeleteTopSpeedPlayer from "../../../mysql/queries/DeleteTopSpeedPlayer";
import GetTopSpeedPlayers from "../../../mysql/queries/GetTopSpeedPlayers";
import Services from "../../../services/Services";
import { InteractionsHandler } from "../register.interactions";

const LOG = new Logger("dodgeball:bot:interactions:admin:RemoveTopSpeed");

export default class RemoveTopSpeedInteractions implements InteractionsHandler {
  name = "remove-top-speed";
  category = "admin";

  private services?: Services;
  private client?: Client;

  init(client: Client, services: Services) {
    LOG.info("Setting up remove top speed interactions");
    this.client = client;
    this.services = services;
    this.client.interactions.set(this.name, this);
  }

  async command(interaction: ChatInputCommandInteraction) {
    if (!this.services) return;
    const steamid = interaction.options.data.find(
      (option) => option.name === "steamid"
    )?.value;
    if (!steamid) return;

    // Can also check if we had server
    const server = interaction.options.data.find(
      (option) => option.name === "server"
    )?.value;

    // Check if we steamid in server
    const Player = await GetTopSpeedPlayers(
      undefined,
      String(steamid)
    )(this.services.getMysqlConnection());

    if (!Player)
      return interaction.reply({
        content: "Player not found",
        ephemeral: true
      });

    // Remove player from server
    await DeleteTopSpeedPlayer(
      String(steamid),
      server ? String(server) : undefined
    )(this.services.getMysqlConnection());

    LOG.info("Player removed from top speed", steamid, server);

    interaction.reply({
      content: "Player removed from top speed",
      ephemeral: true
    });
  }
}
