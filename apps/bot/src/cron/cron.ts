import debug from "debug";
import Services from "../services/Services";
import AddBoostersCron from "./jobs/AddBoosters.cron";
import RemoveExpiredDonatorsCron from "./jobs/RemoveExpiredDonators.cron";
import RemoveNoneBoosterCron from "./jobs/RemoveNoneBoosters.cron";
import UpdateServersCron from "./jobs/UpdateServers.cron";

const LOG = debug("dodgeball:bot:cron");

export default class CronJobs
{
  private static crons = [
    AddBoostersCron,
    RemoveExpiredDonatorsCron,
    RemoveNoneBoosterCron,
    UpdateServersCron
  ];

  public static async init(services: Services)
  {
    LOG("Initializing cron jobs");
    for (const cron of this.crons)
    {
      LOG(`Initializing ${cron.name}`)
      new cron(services);
    }
  }
}