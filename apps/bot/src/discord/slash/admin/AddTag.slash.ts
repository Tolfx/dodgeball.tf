import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName('add-tag')
  .setDescription('Adds a tag to a player')
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
    option.setName('tag')
      .setDescription('Tag you want to add to the player')
      .setRequired(true)
    return option;
  })