import { EmbedBuilder } from "discord.js";
import { Colors } from "../../../util/constants";
import { LiveStats } from "../../../mysql/queries/GetLiveStats";

interface LiveStatsEmbedOptions
{
  liveStats?: Array<LiveStats>;
  serverName: string;
  serverIp: string;
  serverPort: number;
}

export default function LiveStatsEmbed(options: LiveStatsEmbedOptions)
{


  return new EmbedBuilder()
    .setTitle(options.serverName.trim())
    .setColor(options?.liveStats?.length ? Colors.GREEN : Colors.RED)
    .setFooter({
      text: `Server: ${options?.serverName}`,
    })
    .setTimestamp()
    .setFields(
      {
        name: 'Join',
        value: `steam://connect/${options.serverIp}:${options.serverPort}`,
        inline: true,
      },
      {
        name: 'Players',
        value: String(options?.liveStats?.length || 0),
        inline: true,
      },
      {
        name: 'Status',
        value: options?.liveStats?.length ? 'Online' : 'Offline',
        inline: true,
      }
    );
}