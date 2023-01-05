import debug from "debug";
import { Client, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import GetTopPlayers from "../../../mysql/queries/GetTopPlayers";
import Services from "../../../services/Services";
import { Colors } from "../../../util/constants";
import { InteractionsHandler } from "../register.interactions";

const LOG = debug("dodgeball:bot:interactions:top10");

export default class Top10Interactions implements InteractionsHandler {
  name = "top10";
  category = "ranks";

  private services?: Services;
  private client?: Client;

  init(client: Client, services: Services) {
    LOG("Setting up top10 interactions");
    this.client = client;
    this.services = services;
    this.client.interactions.set(this.name, this);
  }

  async command(interaction: ChatInputCommandInteraction) {
    if (!this.services) return;
    const serverid = interaction.options.data.find(
      (option) => option.name === "server"
    )?.value;
    if (!serverid) return;
    const top10 = await GetTopPlayers(String(serverid))(
      this.services.getMysqlConnection()
    );
    const embed = new EmbedBuilder()
      .addFields(
        top10.map((player, index) => ({
          name: `#${index + 1}. ${player.lastName}`,
          value: `
        **Points:** ${player.skill}
        **Kills:** ${player.kills}
        **Deaths:** ${player.deaths}`,
          inline: true
        }))
      )
      .setColor(Colors.GREEN)
      .setTimestamp()
      .setDescription("Top 10 players")
      .setURL("https://dodgeball.tf");

    await interaction.reply({
      embeds: [embed.toJSON()],
      ephemeral: true
    });
  }
}
