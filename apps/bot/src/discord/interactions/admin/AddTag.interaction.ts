import Logger from "@dodgeball/logger";
import { Client, ChatInputCommandInteraction } from "discord.js";
import Services from "../../../services/Services";
import { InteractionsHandler } from "../register.interactions";
import SteamID from "steamid";
import UpdateCCCM from "../../../mysql/queries/UpdateCCCM";

const LOG = new Logger(
  "dodgeball:bot:discord:interactions:admin:AddTagInteraction"
);

export default class AddTagInteraction implements InteractionsHandler {
  name = "add-tag";
  category = "admin";

  private services?: Services;
  private client?: Client;

  init(client: Client, services: Services) {
    LOG.info("Setting up add-tag interactions");
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
    const tag = interaction.options.data.find(
      (option) => option.name === "tag"
    )?.value;
    if (!tag) return;

    const steamid2 = new SteamID(String(steamid)).steam2();

    const tagged = String(tag);

    await UpdateCCCM({
      steamid: steamid2,
      // Ensure there is a space at the end of the tag if there isn't one
      tag: tagged === "blank" ? "" : tagged.endsWith(" ") ? tagged : `${tag} `
    })(this.services.getMysqlConnection());

    interaction.reply({ content: "Tag updated", ephemeral: true });
  }
}
