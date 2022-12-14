import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName('add-donator')
  .setDescription('Adds a donator to our system')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption(option =>
  {
    option.setName('steamid')
      .setDescription('The player steamID')
      .setRequired(true)
    return option;
  })
  .addStringOption(option =>
  {
    option.setName('title')
      .setDescription('The player discordID')
      .setRequired(true)
    return option;
  })