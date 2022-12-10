import getEnv from "./getEnv";

export const DISCORD_TOKEN = getEnv("DISCORD_TOKEN");
export const DISCORD_PREFIX = getEnv("DISCORD_PREFIX", "odb!");
export const DISCORD_OWNER_ID = getEnv("DISCORD_OWNER_ID", "[]");
export const DISCORD_BOT_ID = getEnv("DISCORD_BOT_ID", "1049982109571371078");
export const DISCORD_CLIENT_SECRET = getEnv("DISCORD_CLIENT_SECRET", "secret");
export const DISCORD_GUILD_ID = getEnv("DISCORD_GUILD_ID", "1014257373688369304");

export const STEAM_API_KEY = getEnv("STEAM_API_KEY", "secret");

export const MYSQL_HOST = getEnv("MYSQL_HOST", "localhost");
export const MYSQL_USER = getEnv("MYSQL_USER", "root");
export const MYSQL_PASSWORD = getEnv("MYSQL_PASSWORD");
export const MYSQL_PORT = getEnv("MYSQL_PORT", "3306");

export const API_PORT = process.env.API_PORT;
export const API_HOST = getEnv("API_HOST", "localhost");
export const API_PROTOCOL = getEnv("API_PROTOCOL", "http");
export const API_DOMAIN = `${API_PROTOCOL}://${API_HOST}${API_PROTOCOL === 'http' ? `:${API_PORT}` : ""}`;

/**
 * @deprecated This was a stupid idea, when I can fetch from the database on bootstrap, but since when
 * I created the whole system I didn't really plan ahead, one next purge I'll remove it and fix the problem
 * in the database instead.
 */
export const DEFAULT_VALUE_SERVER_IDS = [
  {
    "id": "tf2",
    "name": "Dodgeball.tf | Advanced | EU",
  },
  {
    "id": "tf4",
    "name": "Dodgeball.tf | EU",
  },
];

export const TOPSPEED_SERVERS_IDS: Array<{
  id: string;
  name: string;
}> = JSON.parse(getEnv("TOPSPEED_SERVERS_IDS", JSON.stringify(DEFAULT_VALUE_SERVER_IDS)));

export enum Colors
{
  RED = '#F4070D',
  GREEN = '#95F3E3',
  BlUE = '#08C4CD',
  ORANGE = '#FE902E',
  DARK_RED = '#D22426',
  DARK_GREEN = '#71CFB7',
  DARK_BLUE = '#27939D',
  DARK_ORANGE = '#EE6B35',
}