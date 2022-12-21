import { EmbedBuilder } from "discord.js";
import { Colors } from "../../../util/constants";
import { LiveStats } from "../../../mysql/queries/GetLiveStats";
import { Server } from "../../../mysql/queries/GetServers";

interface LiveStatsEmbedOptions
{
  liveStats?: Array<LiveStats>;
  server: Server;
  serverName: string;
  serverIp: string;
  serverPort: number;
}

export default function LiveStatsEmbed(options: LiveStatsEmbedOptions)
{


  return new EmbedBuilder()
    .setTitle(options.serverName.trim())
    .setColor(options?.liveStats?.length ? Colors.GREEN : Colors.DARK_ORANGE)
    .setFooter({
      text: `Server: ${options?.serverName}`,
    })
    .setTimestamp()
    .setFields(
      {
        name: 'Players',
        value: `${options?.liveStats?.length ?? 0}/${options.server.max_players}`,
        inline: true,
      },
      {
        name: 'Current map',
        value: options.server.act_map,
        inline: true,
      },
      {
        name: 'Join',
        value: `steam://connect/${options.serverIp}:${options.serverPort}`,
        inline: true,
      }
    );
}