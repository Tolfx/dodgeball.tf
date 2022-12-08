import { SlashCommandBuilder } from "discord.js";
import { TOPSPEED_SERVERS_IDS } from "../../../util/constants";

export default new SlashCommandBuilder()
  .setName('topspeed')
  .setDescription('Get the top10 fastest players')
  .addStringOption(option =>
  {
    option.setName('server')
      .setDescription('The server you want to get the top10 fastest players')
      .addChoices(...TOPSPEED_SERVERS_IDS.map(server =>
      {
        return {
          name: server.name,
          value: server.id
        }
      }))
      .setRequired(true)
    return option;
  });
