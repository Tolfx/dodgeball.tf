import { LinkedAccountModel } from "@dodgeball/mongodb";
import Logger from "@dodgeball/logger";
import { Client, ChatInputCommandInteraction } from "discord.js";
import SteamID from "steamid";
import Services from "../../../services/Services";
import { InteractionsHandler } from "../register.interactions";

const LOG = new Logger("dodgeball:bot:discord:interactions:ManuallyLink");

export default class ManuallyLinkInteraction implements InteractionsHandler {
  name = "manual-link";
  category = "admin";

  private services?: Services;
  private client?: Client;

  init(client: Client, services: Services) {
    LOG.info("Setting up manual link interaction");
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

    const discordId = interaction.options.data.find(
      (option) => option.name === "discordid"
    )?.value;
    if (!discordId) return;

    const steamid64 = new SteamID(String(steamid)).getSteamID64();

    // Create a new linked account
    await new LinkedAccountModel({
      discordId: String(discordId),
      steamId: steamid64
    }).save();

    return interaction.reply({ content: "Linked account", ephemeral: true });
  }
}
