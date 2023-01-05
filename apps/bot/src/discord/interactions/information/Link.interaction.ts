import { LinkedAccountModel } from "@dodgeball/mongodb";
import debug from "debug";
import { ChatInputCommandInteraction, Client, EmbedBuilder } from "discord.js";
import Services from "../../../services/Services";
import { Colors } from "../../../util/constants";
import { InteractionsHandler } from "../register.interactions";

const LOG = debug("dodgeball:bot:interactions:link");

export default class LinkInteraction implements InteractionsHandler {
  name = "link";
  category = "information";

  private services?: Services;
  private client?: Client;

  init(client: Client, services: Services) {
    LOG("Setting up link interaction");
    this.client = client;
    this.services = services;
    // Add interactions to client
    client.interactions.set(this.name, this);
  }

  async command(interaction: ChatInputCommandInteraction) {
    if (!this.services) return;

    const isLinked = await LinkedAccountModel.findOne({
      discordId: interaction.user.id
    });

    if (isLinked)
      return interaction.reply({
        content: "You already have a linked account",
        ephemeral: true
      });

    const embed = new EmbedBuilder()
      .setTitle("Link your account")
      .setDescription(
        "Link your account to your discord account to get access to more features."
      )
      .addFields([
        {
          name: "Linking your account with steam",
          value: `To link your account, please click [here](https://api.discord.dodgeball.tf/oauth2/link) to link your account with steam and discord.`,
          inline: false
        }
      ])
      .setColor(Colors.GREEN)
      .setTimestamp();

    return interaction.reply({
      embeds: [embed.toJSON()],
      ephemeral: true
    });
  }
}
