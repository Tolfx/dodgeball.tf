import { DonatorUser } from "@dodgeball/mongodb";
import debug from "debug";
import SteamID from "steamid";
import OnDonateEmbed from "../../discord/embeds/information/OnDonate.embed";
import GetAdmins from "../../mysql/queries/GetAdmins";
import Services from "../../services/Services";
import { DISCORD_OWNER_ID, DISCORD_WEBHOOKS } from "../../util/constants";
import { webhookUrlToIdAndToken } from "../../util/discord";
import { EventHandler, Event } from "../register.events";

const LOG = debug('dodgeball:bot:events:donations:OnDonateUpdate');

export interface OnDonateUpdatePayload
{
  donator: DonatorUser;
  beforeTitle: string;
  beforeAmount: number;
}

export default class OnDonateUpdate implements EventHandler<OnDonateUpdatePayload>
{
  public event = "donator.updated" as const;

  public services: Services;

  constructor(services: Services)
  {
    this.services = services;
  }

  async handle(event: Event<OnDonateUpdatePayload>)
  {
    LOG(`Donator updated: ${event.payload.donator.steamName}, steamid: ${event.payload.donator.steamId}`)
    const { donator, beforeAmount, beforeTitle } = event.payload;

    const admins = await GetAdmins()(this.services.getMysqlConnection());
    const admin = admins.find((admin) => admin.authid === (new SteamID(donator.steamId)).steam2());

    if (beforeTitle !== 'patron' && beforeAmount >= 25 && !admin)
    {
      this.services.getServerRegisterService()?.updateDonator(donator);
    }

    // Send webhook to discord
    const client = this.services.getDiscordClient();
    const webhookInfoUrl = DISCORD_WEBHOOKS['info'];
    if (!webhookInfoUrl) return LOG('No webhook url found for info');
    const webhookData = webhookUrlToIdAndToken(webhookInfoUrl);
    const webhook = await client.fetchWebhook(webhookData.id, webhookData.token);
    await webhook.send({
      content: DISCORD_OWNER_ID.map((id) => `<@${id}>`).join(' '),
      embeds: [
        OnDonateEmbed(donator, false)
      ]
    });
  }
}