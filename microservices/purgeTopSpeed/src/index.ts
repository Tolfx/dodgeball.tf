// Load environment variables from a .env file
require('dotenv').config();

import { MongoDb } from '@dodgeball/mongodb';
import debug from "debug";
import Services from './Services';
import { CronJob } from "cron";
import MySQL from '@dodgeball/mysql';
import purgeTopSpeed from './cron/purgeTopSpeed';

// Create a debug logger
const LOG = debug("dodgeball:purgeTopSpeed:bootstrap");

/**
 * Bootstrap the server application.
 * Connect to the MongoDB and MySQL databases and start the cron job.
 */
const bootstrap = async () =>
{
  LOG("Starting bootstrap");

  // Connect to the MongoDB database
  const mongoDB = new MongoDb();
  await mongoDB.connect();

  // Connect to the MySQL database
  const mysql = new MySQL();
  await mysql.connect();

  // Create a new Services instance
  const services = Services.getInstance(mysql, mongoDB);

  // Create a new cron job that runs on the first day of every month at midnight
  new CronJob("0 0 1 * *", () =>
  {
    LOG(`Running cron jobs`);
    purgeTopSpeed(services);
  }, null, true, "Europe/Stockholm");
};

// Start the application
bootstrap();
