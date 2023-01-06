import Logger from "@dodgeball/logger";
import { Client, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import GetPlayer from "../../../mysql/queries/GetPlayer";
import GetPlayerUniqueId from "../../../mysql/queries/GetPlayerUniqueId";
import Services from "../../../services/Services";
import { Colors } from "../../../util/constants";
import { InteractionsHandler } from "../register.interactions";

const LOG = new Logger("dodgeball:bot:interactions:InspectPlayer");

export default class InspectPlayerInteractions implements InteractionsHandler {
  name = "inspect";
  category = "admin";

  private services?: Services;
  private client?: Client;

  init(client: Client, services: Services) {
    LOG.info("Setting up inspect player interactions");
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

    const uSteamid = String(steamid).replace("STEAM_0:", "");

    const [uniqueId] = await GetPlayerUniqueId(uSteamid)(
      this.services.getMysqlConnection()
    );

    if (!uniqueId)
      return interaction.reply({
        content: "Player not found",
        ephemeral: true
      });

    const [player] = await GetPlayer(String(uniqueId.playerId))(
      this.services.getMysqlConnection()
    );

    if (!player)
      return interaction.reply({
        content: "Player not found",
        ephemeral: true
      });

    const embed = new EmbedBuilder()
      .addFields([
        {
          name: "Name",
          value: player.lastName,
          inline: true
        },
        {
          name: "SteamID",
          value: String(steamid),
          inline: true
        },
        {
          name: "IP",
          value: player.lastAddress,
          inline: true
        },
        {
          name: "Bans",
          value: `[Bans](https://bans.dodgeball.tf/index.php?p=banlist&advSearch=${steamid}&advType=steamid)`,
          inline: true
        },
        {
          name: "Comms",
          value: `[Comms](https://bans.dodgeball.tf/index.php?p=commslist&advSearch=${steamid}&advType=steamid)`,
          inline: true
        },
        {
          name: "Stats",
          value: `[Stats](https://stats.dodgeball.tf/hlstats.php?mode=search&q=${encodeURIComponent(
            steamid
          )}&st=uniqueid&game=)`,
          inline: true
        }
      ])
      .setColor(Colors.GREEN)
      .setTimestamp()
      .setDescription("Player info")
      .setURL("https://dodgeball.tf");

    await interaction.reply({
      embeds: [embed.toJSON()],
      ephemeral: true
    });
  }
}
