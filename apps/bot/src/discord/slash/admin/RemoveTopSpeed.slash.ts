import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import Services from "../../../services/Services";
import { TOPSPEED_SERVERS_IDS } from "../../../util/constants";

export default async (service: Services) => {
  // const servers = service.getCacheService()?.cachedServers.values();
  // if (!servers) return;

  // const serversArray = Array.from(servers);

  const topspeedservers = await TOPSPEED_SERVERS_IDS(service);
  if (!topspeedservers) return;

  return new SlashCommandBuilder()
    .setName("remove-top-speed")
    .setDescription(
      "Remove top speed from a server, not including the server id will remove it from all servers"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) => {
      option
        .setName("steamid")
        .setDescription(
          "SteamID of the player you want to remove the top speed from"
        )
        .setRequired(true);
      return option;
    })
    .addStringOption((option) => {
      option
        .setName("server")
        .setDescription("Server you want to remove the top speed from")
        .addChoices(
          ...topspeedservers.map((server) => {
            return {
              name: String(server.name),
              value: String(server.id)
            };
          })
        )
        .setRequired(false);
      return option;
    });
};
