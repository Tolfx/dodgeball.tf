import { MongoDb } from '@dodgeball/mongodb';
import debug from "debug";
import Services from './Services';
import { CronJob } from "cron";
import fetchServer from './crons/fetchServers.cron';
import { MONGO_DATABASE, MONGO_HOST, MONGO_PASSWORD, MONGO_PORT, MONG_USEERNAME, RUN_ALL_ON_STARTUP } from './utils/constants';

const LOG = debug("dodgeball:bootstrap");



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