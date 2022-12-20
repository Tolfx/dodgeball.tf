import debug from "debug";
import { Client, REST, Routes } from "discord.js";
import Services from "../../services/Services";
import { DISCORD_BOT_ID, DISCORD_GUILD_ID, DISCORD_TOKEN } from "../../util/constants";
import InspectPlayerSlash from "./admin/InspectPlayer.slash";
import ManuallyLinkSlash from "./admin/ManuallyLink.slash";
import RemoveTopSpeedSlash from "./admin/RemoveTopSpeed.slash";
import HelpSlash from "./information/Help.slash";
import LinkSlash from "./information/Link.slash";
import Top10Slash from "./rank/Top10.slash";
import TopspeedSlash from "./rank/Topspeed.slash";
import AddTagSlash from "./admin/AddTag.slash";

const LOG = debug('dodgeball:bot:slash:register.slash');

export default class SlashRegister
{
  private client: Client;

  private SlashCommands: Array<any> = [
    TopspeedSlash,
    HelpSlash,
    Top10Slash,
    InspectPlayerSlash,
    RemoveTopSpeedSlash,
    LinkSlash,
    ManuallyLinkSlash,
    AddTagSlash
  ];

  constructor(private services: Services)
  {
    this.client = services.getDiscordClient();
  }

  async registerSlash()
  {
    const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
    // Before registering slash commands, we need to make sure not any of them is a method
    this.SlashCommands = await Promise.all(this.SlashCommands.map(async (command) =>
    {
      if (typeof command === 'function')
      {
        return await command(this.services);
      }
      return command;
    }));
    await rest.put(
      Routes.applicationGuildCommands(DISCORD_BOT_ID, DISCORD_GUILD_ID),
      { body: this.SlashCommands },
    );
    LOG('Registered all slash commands');
  }
}