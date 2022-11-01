import { MongoDb } from '@dodgeball/mongodb';
import debug from "debug";
import Services from './Services';
import { CronJob } from "cron";
import fetchServer from './crons/fetchServers.cron';

const LOG = debug("dodgeball:bootstrap");

const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = parseInt(process.env.MONGO_PORT || '27017');
const MONGO_DATABASE = process.env.MONGO_DATABASE || 'dodgeball';
const MONG_USEERNAME = process.env.MONGO_USERNAME || 'root';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'root';

const RUN_ALL_ON_STARTUP = process.env.RUN_ALL_ON_STARTUP || false;

const bootstrap = async () =>
{
  LOG("Starting bootstrap");
  const mongoDB = new MongoDb(MONGO_HOST, MONGO_PORT, MONGO_DATABASE, MONG_USEERNAME, MONGO_PASSWORD);
  LOG(`Connecting to MongoDB: ${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`);
  await mongoDB.connect();

  const services = new Services(mongoDB);

  new CronJob("0 12 * * *", () =>
  {
    LOG(`Running cron jobs`);
    fetchServer(services);
  });

  // Run all crons on startup
  if (RUN_ALL_ON_STARTUP)
  {
    LOG(`Running all crons on startup`);
    fetchServer(services);
  }

}

bootstrap();