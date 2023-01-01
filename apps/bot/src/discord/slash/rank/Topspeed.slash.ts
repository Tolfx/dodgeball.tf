import { SlashCommandBuilder } from "discord.js";
import { TOPSPEED_SERVERS_IDS } from "../../../util/constants";
import Services from "../../../services/Services";

export default async (service: Services) =>
{
  const topspeedservers = (await TOPSPEED_SERVERS_IDS(service));
  if (!topspeedservers) return;
  return new SlashCommandBuilder()
    .setName('topspeed')
    .setDescription('Get the top10 fastest players')
    .addStringOption(option =>
    {
      option.setName('server')
        .setDescription('The server you want to get the top10 fastest players')
        .addChoices(...topspeedservers.map(server =>
        {
          return {
            name: String(server.name),
            value: String(server.id)
          }
        }))
        .setRequired(true)
      return option;
    });
}
