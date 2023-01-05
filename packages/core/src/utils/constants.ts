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

export enum Colors {
  RED = "#F4070D",
  GREEN = "#95F3E3",
  BLUE = "#08C4CD",
  ORANGE = "#FE902E",
  DARK = "#2F3136",
  LIGHTER_DARK = "#36393F",
  DARKER_DARK = "#292B2F",
  WHITE = "#FFFFFF",
  GRAY = "#72767D",
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
