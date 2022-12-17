import debug from "debug";
import { CronJob } from "cron";
import Services from "../../services/Services";
import { DonatorUserModel, LinkedAccountModel } from "@dodgeball/mongodb";
import { DISCORD_GUILD_ID } from "../../util/constants";
import { Event } from "../../events/register.events";
import { OnDonatePayload } from "../../events/Donations/OnDonateAdd.event";

const LOG = debug("dodgeball:bot:cron:AddBoosters");

export default class AddBoostersCron
{
  constructor(private services: Services)
  {
    // Every day at 03:00 in midnight
    // in Europe/Stockholm
    new CronJob("0 3 * * *", async () =>
    {
      LOG("Running cron job");
      await this.run();
    }, null, true, "Europe/Stockholm");
  }

  private async run()
  {
    // Get linked accounts, check if any of their discord id and check if they are server boosters
    // If they are boosters, add them to the donator table and send event

    // Get all linked accounts
    const linkedAccounts = await LinkedAccountModel.find();

    // Get all boosters
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

    // loop through all boosters
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (const [_,booster] of boosters)
    {
      // find the linked account
      const linkedAccount = linkedAccounts.find(account => account.discordId === booster.id);

      if (!linkedAccount)
      {
        LOG(`No linked account found for ${booster.displayName}`);
        continue;
      }

      // Assuming we found one, lets check if they are already a donator
      const isDonator = await DonatorUserModel.findOne({ steamId: linkedAccount.steamId });
      if (isDonator)
      {
        LOG(`Donator already exists for ${booster.displayName}`);
        continue;
      }

      const donator = await (new DonatorUserModel({
        steamId: linkedAccount.steamId,
        steamName: booster.displayName,
        title: "booster",
        isActive: true,
        donations: [],
        isPermanent: true,
      }).save());

      // Send event
      this.services.getEventRegister()?.emit(new Event<OnDonatePayload>('1', 'donator.added', {
        donator
      }));
    }

  }
}
