import debug from "debug";
import { CronJob } from "cron";
import Services from "../../services/Services";
import { DonatorUserModel } from "@dodgeball/mongodb";
import { Event } from "../../events/register.events";
import { OnDonateRemovePayload } from "../../events/Donations/OnDonateRemove.event";
import GetAdmins from "../../mysql/queries/GetAdmins";
import SteamID from "steamid";

const LOG = debug("dodgeball:bot:cron:RemoveExpiredDonatorsCron");

export default class RemoveExpiredDonatorsCron
{
  constructor(private services: Services)
  {
    // Every day at 01:00 in midnight
    // in Europe/Stockholm
    new CronJob("0 0 1 * * *", () =>
    {
      LOG(`Running cron job`);
      this.run();
    }, null, true, "Europe/Stockholm");
  }

  public async run()
  {
    // We want to get all donators who is not Permanent and has expired
    // We then want to make them inActive and remove them from our system "aka remove them from the donator table"

    // Get all donators
    const donators = await DonatorUserModel.find({
      isActive: true,
      isPermanent: false,
      expiresAt: {
        $lte: new Date()
      }
    });

    const admins = await GetAdmins()(this.services.getMysqlConnection());

    // Lets do a sanity check that expiresAt is today or was any day before today
    // If not, we should not remove them
    const donatorsToRemove = [];
    for await (const donator of donators)
    {
      if (!donator.expiresAt)
      {
        LOG(`Donator ${donator.id} has no expiresAt date`);
        continue;
      }

      if (donator.expiresAt > new Date())
      {
        LOG(`Donator ${donator.id} has not expired yet, but is in the expired donator list`);
        continue;
      }

      if (admins.find(admin => admin.authid === (new SteamID(donator.steamId).steam2())))
      {
        LOG(`Donator ${donator.id} is an admin, skipping`);
        continue;
      }

      donatorsToRemove.push(donator);
    }

    LOG(`Found ${donatorsToRemove.length} donators to remove`);

    // Loop through all donators
    for await (const donator of donatorsToRemove)
    {
      // Send event
      this.services.getEventRegister()?.emit(new Event<OnDonateRemovePayload>(donator.id, "donator.removed", { donator }));
    }
  }
}