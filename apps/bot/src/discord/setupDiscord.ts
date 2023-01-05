import debug from "debug";
import { Client, Partials } from "discord.js";
import { DISCORD_TOKEN } from "../util/constants";

const LOG = debug("dodgeball:bot:setupDiscord");

export default () => {
  LOG("Setting up Discord client");
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

  LOG("Logging in to Discord");
  discordClient.login(DISCORD_TOKEN);

  return discordClient;
};
