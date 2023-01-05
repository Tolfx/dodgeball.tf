import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
  .setName("manual-link")
  .setDescription("Links a discord account to a steam account")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) => {
    option
      .setName("steamid")
      .setDescription("The player steamID64")
      .setRequired(true);
    return option;
  })
  .addStringOption((option) => {
    option
      .setName("discordid")
      .setDescription("The player discordID")
      .setRequired(true);
    return option;
  });
