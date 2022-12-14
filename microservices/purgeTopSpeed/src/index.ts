import { MongoDb } from '@dodgeball/mongodb';
import debug from "debug";
import Services from './Services';
import { CronJob } from "cron";
import MySQL from '@dodgeball/mysql';
import purgeTopSpeed from './cron/purgeTopSpeed';

const LOG = debug("dodgeball:purgeTopSpeed:bootstrap");

const bootstrap = async () =>
{
  LOG("Starting bootstrap");
  const mongoDB = new MongoDb();
  await mongoDB.connect();

  const mysql = new MySQL();

  const services = new Services(mysql, mongoDB);

  // Runs on the first of the month
  new CronJob("0 0 1 * *", () =>
  {
    LOG(`Running cron jobs`);
    purgeTopSpeed(services);
  }, null, true, "Europe/Stockholm");

}

bootstrap();