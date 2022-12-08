require('dotenv').config();
import debug from "debug";
import CommandRegister from "./discord/commands/register.command";
import EventRegister from "./discord/events/register.events";
import InteractionsRegister from "./discord/interactions/register.interactions";
import setupDiscord from "./discord/setupDiscord";
import SlashRegister from "./discord/slash/register.slash";
import setupMysql from "./mysql/setupMysql";
import CacheService from "./services/CacheService";
import Services from "./services/Services";

const LOG = debug('dodgeball:bot:bootstrap')

const bootstrap = async () =>
{
  LOG('Starting bot');

  const mysql = await setupMysql();

  const discordClient = setupDiscord();
  const services = new Services(discordClient, mysql);

  const cacheService = new CacheService(services);
  await cacheService.startCache();
  services.setCaches(cacheService);

  const eventRegister = new EventRegister(services);
  eventRegister.registerEvents();

  const commandRegister = new CommandRegister(services);
  commandRegister.registerCommands();

  const interactionsRegister = new InteractionsRegister(services);
  interactionsRegister.registerInteractions();

  const slashRegister = new SlashRegister(services);
  await slashRegister.registerSlash();

  LOG('Bot started');
};

bootstrap();