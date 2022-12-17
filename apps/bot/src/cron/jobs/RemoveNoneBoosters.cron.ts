import debug from "debug";
import { CronJob } from "cron";
import Services from "../../services/Services";
import { DonatorUserModel, LinkedAccountModel } from "@dodgeball/mongodb";
import { Event } from "../../events/register.events";
import { OnDonateRemovePayload } from "../../events/Donations/OnDonateRemove.event";
import GetAdmins from "../../mysql/queries/GetAdmins";
import SteamID from "steamid";
import { DISCORD_GUILD_ID } from "../../util/constants";

const LOG = debug("dodgeball:bot:cron:jobs:RemoveNoneBoosterCron");

export default class RemoveNoneBoosterCron
{
  constructor(private services: Services)
  {
    // Every day at 01:00 in midnight
    // in Europe/Stockholm
    new CronJob("0 1 * * *", () =>
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
      title: 'booster'
    });

    const linkedAccounts = await LinkedAccountModel.find({
      // Add all steamIds from donators
      steamId: {
        $in: donators.map(donator => donator.steamId)
      }
    });

    const admins = await GetAdmins()(this.services.getMysqlConnection());

    const client = this.services.getDiscordClient();

    // get our guild
    const guild = client.guilds.cache.get(DISCORD_GUILD_ID);

    if (!guild)
    {
      LOG("Failed to find guild");
      return;
    }

    // get all boosters
    const boosters = (await guild.members.fetch()).filter(member => member.premiumSince !== null);

    if (!boosters)
    {
      LOG("No boosters found");
      return;
    }

    // Lets do a sanity check that expiresAt is today or was any day before today
    // If not, we should not remove them
    const donatorsToRemove = [];
    for await (const donator of donators)
    {

      const linkedAccount = linkedAccounts.find(account => account.steamId === donator.steamId);

      if (!linkedAccount)
      {
        LOG(`Donator ${donator.id} has no linked account, skipping, possible way to remove boosters`);
        continue;
      }

      if (admins.find(admin => admin.authid === (new SteamID(donator.steamId).steam2())))
      {
        LOG(`Donator ${donator.id} is an admin, skipping`);
        continue;
      }

      if (boosters.find(booster => booster.id === linkedAccount.discordId))
      {
        LOG(`Donator ${donator.id} is a booster, skipping`);
        continue;
      }

      donatorsToRemove.push(donator);
    }

    LOG(`Found ${donatorsToRemove.length} donators to remove`);

    if (donatorsToRemove.length === 0)
    {
      return;
    }

    // Loop through all donators
    for await (const donator of donatorsToRemove)
    {
      // Send event
      this.services.getEventRegister()?.emit(new Event<OnDonateRemovePayload>(donator.id, "donator.removed", { donator }));
    }
  }
}