import { SlashCommandBuilder } from "discord.js";
import Services from "../../../services/Services"

export default async (service: Services) =>
{
  const servers = service.getCacheService()?.cachedServers.values();
  if (!servers) return;

  const serversArray = Array.from(servers);

  return new SlashCommandBuilder()
    .setName('top10')
    .setDescription('Get the top10 players of a server')
    .addStringOption(option =>
    {
      option.setName('server')
        .setDescription('The server you want to get the top10 players')
        .addChoices(...serversArray.map(server =>
        {
          return {
            name: server.server.name,
            value: String(server.server.game)
          }
        }))
        .setRequired(true)
      return option;
    });
}