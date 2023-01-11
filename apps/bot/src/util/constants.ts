/* eslint-disable prettier/prettier */
import GetSBServers from "../mysql/queries/GetSBServers";
import Services from "../services/Services";
import getEnv from "./getEnv";

export const DISCORD_TOKEN = getEnv("DISCORD_TOKEN");
export const DISCORD_PREFIX = getEnv("DISCORD_PREFIX", "odb!");
export const DISCORD_OWNER_ID = JSON.parse(
  getEnv("DISCORD_OWNER_ID", "[]")
) as string[];
export const DISCORD_BOT_ID = getEnv("DISCORD_BOT_ID", "1049982109571371078");
export const DISCORD_CLIENT_SECRET = getEnv("DISCORD_CLIENT_SECRET", "secret");
export const DISCORD_GUILD_ID = getEnv(
  "DISCORD_GUILD_ID",
  "1014257373688369304"
);

export const STEAM_API_KEY = getEnv("STEAM_API_KEY", "secret");

export const MYSQL_HOST = getEnv("MYSQL_HOST", "localhost");
export const MYSQL_USER = getEnv("MYSQL_USER", "root");
export const MYSQL_PASSWORD = getEnv("MYSQL_PASSWORD");
export const MYSQL_PORT = getEnv("MYSQL_PORT", "3306");

export const API_PORT = process.env.API_PORT;
export const API_HOST = getEnv("API_HOST", "localhost");
export const API_PROTOCOL = getEnv("API_PROTOCOL", "http");
export const API_DOMAIN = `${API_PROTOCOL}://${API_HOST}${
  API_PROTOCOL === "http" ? `:${API_PORT}` : ""
}`;

export const STRIPE_SECRET_KEY = getEnv("STRIPE_SECRET_KEY", "secret");
export const STRIPE_WEBHOOK_SECRET = getEnv("STRIPE_WEBHOOK_SECRET", "secret");

export const IS_PROD = process.env.NODE_ENV === "production";

export const PAYPAL_CLIENT_ID = getEnv("PAYPAL_CLIENT_ID", "secret");
export const PAYPAL_CLIENT_SECRET = getEnv("PAYPAL_CLIENT_SECRET", "secret");

/**
 * @deprecated This was a stupid idea, when I can fetch from the database on bootstrap, but since when
 * I created the whole system I didn't really plan ahead, one next purge I'll remove it and fix the problem
 * in the database instead.
 */
export const DEFAULT_VALUE_SERVER_IDS = [
  {
    id: "tf2",
    name: "Dodgeball.tf | Advanced | EU"
  },
  {
    id: "tf4",
    name: "Dodgeball.tf | EU"
  }
];

export const TOPSPEED_SERVERS_IDS = async (services: Services) => {
  return new Promise<{ id?: string; name?: string }[]>(
    async (resolve, reject) => {
      const servers = await GetSBServers()(services.getMysqlConnection());
      const cachedServers = services.getCacheService()?.getAllCachedServers();
      if (!cachedServers) return reject("No cached servers found");

      let mapped = [];
      for (const server of servers) {
        const cachedServer = cachedServers.find((cachedServer) => {
          return (
            cachedServer.server.address === server.ip &&
            cachedServer.server.port === server.port
          );
        });
        if (!cachedServer) continue;

        mapped.push({
          id: String(server.sid),
          name: cachedServer.server.name
        });
      }
      // I don't want to include servers that is not tfdb, and currently only 1 server is tfdb, so I'll just hardcode it
      // and remove it when I have more servers.
      const blacklistIds = ["6"];
      mapped = mapped.filter((server) => !blacklistIds.includes(server.id));
      return resolve(mapped);
    }
  );
};

export enum Colors {
  RED = "#F4070D",
  GREEN = "#95F3E3",
  BlUE = "#08C4CD",
  ORANGE = "#FE902E",
  DARK_RED = "#D22426",
  DARK_GREEN = "#71CFB7",
  DARK_BLUE = "#27939D",
  DARK_ORANGE = "#EE6B35"
}

export const DISCORD_WEBHOOKS = {
  error: getEnv("DISCORD_WEBHOOK_ERROR", "secret"),
  info: getEnv("DISCORD_WEBHOOK_INFO", "secret"),
  warn: getEnv("DISCORD_WEBHOOK_WARN", "secret"),
  debug: getEnv("DISCORD_WEBHOOK_DEBUG", "secret")
};
