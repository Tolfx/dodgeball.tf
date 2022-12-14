require('dotenv').config();
import debug from "debug";
import { MongoDb } from "@dodgeball/mongodb";
import CommandRegister from "./discord/commands/register.command";
import EventRegister from "./discord/events/register.events";
import InteractionsRegister from "./discord/interactions/register.interactions";
import setupDiscord from "./discord/setupDiscord";
import SlashRegister from "./discord/slash/register.slash";
import setupMysql from "./mysql/setupMysql";
import CacheService from "./services/CacheService";
import Services from "./services/Services";
import setupApi from "./api/setupApi";
import RegisterRouters from "./api/routes/register.router";
import ServerRegisterService from "./services/ServerRegisterService";
import RegisterEvents from "./events/register.events";
import CronJobs from "./cron/cron";

const LOG = debug('dodgeball:bot:bootstrap')

const bootstrap = async () =>
{
  LOG('Starting bot');

  const mysql = await setupMysql();
  const mongodb = new MongoDb();
  await mongodb.connect();

  const server = setupApi();

  const discordClient = setupDiscord();
  const services = new Services(discordClient, mysql, mongodb, server);

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

  const routerRegister = new RegisterRouters(services);
  routerRegister.registerRouters();

  const serverRegisterService = new ServerRegisterService(services);
  await serverRegisterService.start();
  services.setServerRegisterService(serverRegisterService);

  const registerEvents = new RegisterEvents(services);
  registerEvents.register();
  services.setEventRegister(registerEvents);

  CronJobs.init(services);


  LOG('Bot started');
};

bootstrap();