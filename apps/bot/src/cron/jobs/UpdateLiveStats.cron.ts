import debug from "debug";
import { CronJob } from "cron";
import Services from "../../services/Services";
import { ServerRealLifeStatsModel } from "@dodgeball/mongodb";
import { DISCORD_GUILD_ID } from "../../util/constants";
import { TextChannel } from "discord.js";
import LiveStatsEmbed from "../../discord/embeds/stats/Livestats.embed";
import GetLiveStats from "../../mysql/queries/GetLiveStats";

const LOG = debug("dodgeball:bot:cron:jobs:UpdateLiveStatsCron");

export default class UpdateLiveStatsCron {
  constructor(private services: Services) {
    // Every 1 minute
    new CronJob(
      "* * * * *",
      async () => {
        await this.run();
      },
      null,
      true,
      "Europe/Stockholm"
    );
  }

  private async run() {
    // For now we will make a little dirty hack, because you know me
    // I don't have time to do this properly

    // We will every min discord messages and update the live stats from hlstatsx.hlstats_Livestats
    // And update the discord message with the new stats

    // And because I don't have time I will have hardcoded channel id and guild id
    const CHANNEL_ID = "1055108869669519420"; // #game-servers-live-stats

    const client = this.services.getDiscordClient();

    // Lets first get all of the messages from our database
    const serverRealLifeStats = await ServerRealLifeStatsModel.find({
      discordChannelId: CHANNEL_ID,
      discordGuildId: DISCORD_GUILD_ID
    });

    const cacheService = this.services.getCacheService();
    if (cacheService) {
      await cacheService.startCache();
    }

    const cachedServers = cacheService?.getAllCachedServers();

    if (!cachedServers) return; // We don't have any servers cached, so we can't do anything

    // We need to ensure that we have a message for every server
    // We can check by looking into serverRealLifeStats and check if we have a message for is serverId

    // Lets first check what messages we have

    serverRealLifeStats.forEach(async (serverRealLifeStat) => {
      const server = cachedServers.find(
        (server) =>
          String(server.server.serverId) === serverRealLifeStat.serverId
      );
      if (!server) return; // We don't have a server for this message, so we can't do anything

      // We have a server for this message, so we can update the message
      // We need to get the message from discord
      // And update the message with the new stats

      // We need to get the message from discord
      const channel = (await client.channels.fetch(CHANNEL_ID)) as TextChannel;
      if (!channel) return; // We don't have a channel, so we can't do anything
      const message = await channel.messages.fetch(
        serverRealLifeStat.discordMessageId
      );
      if (!message) return; // We don't have a message, so we can't do anything

      const liveStats = await GetLiveStats()(
        this.services.getMysqlConnection()
      );

      // Lets filter it to only have the stats for this server
      const filteredLiveStats = liveStats.filter(
        (liveStat) => liveStat.server_id === server.server.serverId
      );

      // And update the message with the new stats
      const embed = LiveStatsEmbed({
        liveStats: filteredLiveStats,
        serverName: server.server.name,
        serverIp: server.server.address,
        serverPort: server.server.port,
        server: server.server
      });

      await message.edit({
        embeds: [embed]
      });
    });

    // Lets now check what servers we have left that we don't have a message for
    const serversWithoutMessage = cachedServers.filter((server) => {
      return !serverRealLifeStats.find(
        (serverRealLifeStat) =>
          String(serverRealLifeStat.serverId) === String(server.server.serverId)
      );
    });

    // We have a list of servers that we don't have a message for
    // So we need to create a message for them
    serversWithoutMessage.forEach(async (server) => {
      const channel = (await client.channels.fetch(CHANNEL_ID)) as TextChannel;
      if (!channel) return; // We don't have a channel, so we can't do anything

      const liveStats = await GetLiveStats()(
        this.services.getMysqlConnection()
      );

      const filteredLiveStats = liveStats.filter(
        (liveStat) => liveStat.server_id === server.server.serverId
      );

      // And update the message with the new stats
      const embed = LiveStatsEmbed({
        liveStats: filteredLiveStats,
        serverName: server.server.name,
        serverIp: server.server.address,
        serverPort: server.server.port,
        server: server.server
      });

      const message = await channel.send({
        embeds: [embed]
      });

      LOG(
        `Created message for server ${server.server.name} (${server.server.serverId})`
      );

      await ServerRealLifeStatsModel.create({
        serverId: server.server.serverId,
        discordGuildId: DISCORD_GUILD_ID,
        discordChannelId: CHANNEL_ID,
        discordMessageId: message.id
      });
    });

    // We have now updated all of the messages
    // And we have created a message for all of the servers that we didn't have a message for
  }
}
