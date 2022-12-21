import { EmbedBuilder } from "discord.js";
import { Colors } from "../../../util/constants";
import { LiveStats } from "../../../mysql/queries/GetLiveStats";

interface LiveStatsEmbedOptions
{
  liveStats?: Array<LiveStats>;
  serverName: string;
}

export default function LiveStatsEmbed(options: LiveStatsEmbedOptions)
{
  const fields: any = [];

  // if we got no liveStats we can assume is empty

  if (options?.liveStats?.length)
  {
    options.liveStats.forEach((liveStats, index) =>
    {
      fields.push({
        name: `Player ${index + 1}`,
        value: `Name: ${liveStats.name} | Ping: ${liveStats.ping}`,
      });
    });
  }

  return new EmbedBuilder()
    .setTitle(options.serverName)
    .setDescription(`{${options?.liveStats?.length ? '✅' : '❌'}} Live Stats} | ${options?.liveStats?.length || 0} players} | ${options?.liveStats?.length ? 'Online' : 'Offline'}`)
    .setColor(options?.liveStats?.length ? Colors.GREEN : Colors.RED)
    .setFooter({
      text: `Server: ${options?.serverName}`,
    })
    .setTimestamp()
    .addFields(...fields);
}