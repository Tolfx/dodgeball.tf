import debug from "debug";
import { Client, ChatInputCommandInteraction } from "discord.js";
import Services from "../../../services/Services";
import { InteractionsHandler } from "../register.interactions";
import SteamID from "steamid";
import UpdateCCCM from "../../../mysql/queries/UpdateCCCM";

const LOG = debug('dodgeball:bot:interactions:admin:AddTagInteraction');

export default class AddTagInteraction implements InteractionsHandler
{
  name = 'add-tag';
  category = 'admin';

  private services?: Services;
  private client?: Client;

  init(client: Client, services: Services)
  {
    LOG('Setting up add-tag interactions');
    this.client = client;
    this.services = services;
    this.client.interactions.set(this.name, this);
  }

  async command(interaction: ChatInputCommandInteraction)
  {
    if (!this.services) return;
    const steamid = interaction.options.data.find((option) => option.name === 'steamid')?.value;
    if (!steamid) return;
    const tag = interaction.options.data.find((option) => option.name === 'tag')?.value;
    if (!tag) return;

    const steamid2 = new SteamID(String(steamid)).steam2();

    await UpdateCCCM({
      steamid: steamid2,
      tag: String(tag)
    })(this.services.getMysqlConnection());

    interaction.reply({ content: 'Tag updated', ephemeral: true });
  }

}