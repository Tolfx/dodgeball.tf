import { MongoDb } from '@dodgeball/mongodb';
import debug from "debug";
import Services from './Services';
import { CronJob } from "cron";
import fetchServer from './crons/fetchServers.cron';
import { MONGO_DATABASE, MONGO_HOST, MONGO_PASSWORD, MONGO_PORT, MONGO_USERNAME, RUN_ALL_ON_STARTUP } from './utils/constants';

// Create a debug logger
const LOG = debug("dodgeball:bootstrap");

/**
 * Bootstrap the server application.
 * Connect to the MongoDB database and start the cron jobs.
 */
const bootstrap = async () => 
{
  LOG("Starting bootstrap");

  // Connect to the MongoDB database
  const mongoDB = new MongoDb(MONGO_HOST, MONGO_PORT, MONGO_DATABASE, MONGO_USERNAME, MONGO_PASSWORD);
  LOG(`Connecting to MongoDB: ${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`);
  await mongoDB.connect();

  // Create a new Services instance
  Services.getInstance(mongoDB);

  // Create a new cron job that runs every day at 12:00pm
  new CronJob("0 12 * * *", () => 
  {
    LOG(`Running cron jobs`);
    fetchServer();
  }, null, true, "Europe/Stockholm");

  // If the RUN_ALL_ON_STARTUP constant is true, run all cron jobs immediately
  if (RUN_ALL_ON_STARTUP) 
  {
    LOG(`Running all crons on startup`);
    await fetchServer();
  }
};

// Start the application
bootstrap();
