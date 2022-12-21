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
  const realPlayers = options.liveStats?.filter(player => player.steam_id !== 'BOT');
  const botsPlayers = options.liveStats?.filter(player => player.steam_id === 'BOT');

  return new EmbedBuilder()
    .setTitle(options.serverName.trim())
    .setColor(realPlayers?.length ? Colors.GREEN : Colors.DARK_ORANGE)
    .setFooter({
      text: `Server: ${options?.serverName}`,
    })
    .setTimestamp()
    .setFields(
      {
        name: 'Players',
        value: `${realPlayers?.length ?? 0}/${options.server.max_players}`,
        inline: true,
      },
      {
        name: 'Bots',
        value: `${botsPlayers?.length ?? 0}`,
        inline: true,
      },
      {
        name: 'Current map',
        value: options.server.act_map,
        inline: true,
      },
      {
        name: 'Join',
        value: `[Click to join](steam://connect/${options.serverIp}:${options.serverPort})`,
        inline: true,
      },
      {
        name: 'Stats',
        value: `[View stats](https://stats.dodgeball.tf/hlstats.php?game=${options.server.game})`,
        inline: true,
      }
    );
}