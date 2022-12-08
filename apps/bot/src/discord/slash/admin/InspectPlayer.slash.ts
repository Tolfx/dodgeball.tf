import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName('inspect')
  .setDescription('Inspect a player from our hlstats database, includes IP')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption(option =>
  {
    option.setName('steamid')
      .setDescription('The player steamID you want to inspect')
      .setRequired(true)
    return option;
  });