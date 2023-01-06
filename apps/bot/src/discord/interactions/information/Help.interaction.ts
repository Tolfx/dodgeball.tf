import Logger from "@dodgeball/logger";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Services from "../../../services/Services";
import HelpEmbed from "../../embeds/information/Help.embed";
import { InteractionsHandler } from "../register.interactions";

const LOG = new Logger("dodgeball:bot:discord:interactions:help");

export default class HelpInteraction implements InteractionsHandler {
  name = "help";
  category = "information";

  private services?: Services;
  private client?: Client;

  init(client: Client, services: Services) {
    LOG.info("Setting up help interaction");
    this.client = client;
    this.services = services;
    // Add interactions to client
    client.interactions.set(this.name, this);
  }

  command(interaction: ChatInputCommandInteraction) {
    return interaction.reply({
      embeds: [HelpEmbed().toJSON()],
      ephemeral: true
    });
  }
}
