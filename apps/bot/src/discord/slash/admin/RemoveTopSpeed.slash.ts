import { SlashCommandBuilder } from "discord.js";
import Services from "../../../services/Services"
import { TOPSPEED_SERVERS_IDS } from "../../../util/constants";

export default async (service: Services) =>
{
  // const servers = service.getCacheService()?.cachedServers.values();
  // if (!servers) return;

  // const serversArray = Array.from(servers);

  return new SlashCommandBuilder()
    .setName('remove-top-speed')
    .setDescription('Remove top speed from a server, not including the server id will remove it from all servers')
    .addStringOption(option =>
    {
      option.setName('steamid')
        .setDescription('SteamID of the player you want to remove the top speed from')
        .setRequired(true)
      return option;
    })
    .addStringOption(option =>
    {
      option.setName('server')
        .setDescription('Server you want to remove the top speed from')
        .addChoices(...TOPSPEED_SERVERS_IDS.map(server =>
        {
          return {
            name: server.name,
            value: String(server.id)
          }
        }))
        .setRequired(false)
      return option;
    });
}