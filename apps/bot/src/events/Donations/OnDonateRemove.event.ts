import { EmbedBuilder } from "discord.js";
import { DonatorUser, DonatorUserModel } from "@dodgeball/mongodb";
import debug from "debug";
import SteamID from "steamid";
import DeleteDonator from "../../mysql/queries/DeleteDonator";
import GetAdmins from "../../mysql/queries/GetAdmins";
import Services from "../../services/Services";
import {
  Colors,
  DISCORD_OWNER_ID,
  DISCORD_WEBHOOKS
} from "../../util/constants";
import { webhookUrlToIdAndToken } from "../../util/discord";
import { EventHandler, Event } from "../register.events";
import DeleteCCCM from "../../mysql/queries/DeleteCCCM";

const LOG = debug("dodgeball:bot:events:donations:OnDonateUpdate");

export interface OnDonateRemovePayload {
  donator: DonatorUser;
}

export default class OnDonateRemove
  implements EventHandler<OnDonateRemovePayload>
{
  public event = "donator.removed" as const;

  public services: Services;

  constructor(services: Services) {
    this.services = services;
  }

  async handle(event: Event<OnDonateRemovePayload>) {
    const { donator } = event.payload;

    const admins = await GetAdmins()(this.services.getMysqlConnection());
    const admin = admins.find(
      (admin) => admin.authid === new SteamID(donator.steamId).steam2()
    );

    // Lets make a safety check that this donator is not a patron or permanent
    if (donator.title === "patron" || donator.isPermanent || admin) return;

    LOG(
      `Deleting donator: ${event.payload.donator.steamName}, steamid: ${event.payload.donator.steamId}`
    );

    const mysql = this.services.getMysqlConnection();
    await DeleteDonator(donator)(mysql);
    await DeleteCCCM(donator)(mysql);

    // We also want to remove from cccm.cccm_users
    const steamid = new SteamID(donator.steamId).steam2();

    const query = `DELETE FROM cccm.cccm_users WHERE auth = ${steamid}`;

    mysql.query(query, (err, results) => {
      if (err) LOG(`Error deleting donator from cccm.cccm_users: ${err}`);
      else LOG(`Deleted donator from cccm.cccm_users: ${results}`);
    });

    const servers = this.services.getServerRegisterService()?.getAllServers();

    if (servers)
      for await (const server of servers) {
        await server.rcon("sm_rehash");
        await server.rcon(`sm_joinmsgoffid "${steamid}"`);
      }

    // Send webhook to discord
    const embed = new EmbedBuilder()
      .setTitle("Donator Removed")
      .setDescription(
        `Donator ${donator.steamName} has been removed from the database.`
      )
      .setColor(Colors.DARK_RED)
      .addFields(
        {
          name: "Donator",
          value: donator.steamName,
          inline: true
        },
        {
          name: "SteamID",
          value: donator.steamId,
          inline: true
        },
        {
          name: "Title",
          value: donator.title,
          inline: true
        },
        {
          name: "Donations",
          value: donator.donations
            .map((donation) => `${donation.amount} ${donation.currency}`)
            .join(", "),
          inline: true
        }
      )
      .setTimestamp();

    const client = this.services.getDiscordClient();
    const webhookInfoWarn = DISCORD_WEBHOOKS["warn"];

    const webhookData = webhookUrlToIdAndToken(webhookInfoWarn);
    const webhook = await client.fetchWebhook(
      webhookData.id,
      webhookData.token
    );
    await webhook.send({
      // Include owners ids ping
      content: DISCORD_OWNER_ID.map((id) => `<@${id}>`).join(" "),
      embeds: [embed]
    });

    LOG(`Donator ${donator.steamName} has been removed from the database.`);

    // We should also set donator inactive in the database
    await DonatorUserModel.updateOne(
      { steamId: donator.steamId },
      { isActive: false, title: "none" }
    );
  }
}
