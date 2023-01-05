import debug from "debug";
import Services from "../services/Services";
import AddBoostersCron from "./jobs/AddBoosters.cron";
import RemoveExpiredDonatorsCron from "./jobs/RemoveExpiredDonators.cron";
import RemoveNoneBoosterCron from "./jobs/RemoveNoneBoosters.cron";
import UpdateServersCron from "./jobs/UpdateServers.cron";
import UpdateLiveStatsCron from "./jobs/UpdateLiveStats.cron";
import { IS_PROD } from "../util/constants";

const LOG = debug("dodgeball:bot:cron");

export default class CronJobs {
  private static crons = [
    AddBoostersCron,
    RemoveExpiredDonatorsCron,
    RemoveNoneBoosterCron,
    UpdateServersCron,
    UpdateLiveStatsCron
  ];

  public static async init(services: Services) {
    LOG("Initializing cron jobs");
    if (!IS_PROD) {
      LOG("Not running cron jobs in development");
      return;
    }
    for (const cron of this.crons) {
      LOG(`Initializing ${cron.name}`);
      new cron(services);
    }
  }
}
