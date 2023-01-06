import Logger from "@dodgeball/logger";
import { Client, Partials } from "discord.js";
import { DISCORD_TOKEN } from "../util/constants";

const LOG = new Logger("dodgeball:bot:discord:setupDiscord");

export default () => {
  LOG.info("Setting up Discord client");
  const discordClient = new Client({
    partials: [
      Partials.Channel,
      Partials.User,
      Partials.GuildMember,
      Partials.Message
    ],
    intents: [
      "DirectMessages",
      "Guilds",
      "GuildMessageReactions",
      "GuildMessages",
      "MessageContent",
      "GuildMembers"
    ]
  });

  LOG.info("Logging in to Discord");
  discordClient.login(DISCORD_TOKEN);

  return discordClient;
};
