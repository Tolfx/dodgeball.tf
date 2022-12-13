import { DonatorUser } from "@dodgeball/mongodb";
import debug from "debug";
import OnDonateEmbed from "../../discord/embeds/information/OnDonate.embed";
import Services from "../../services/Services";
import { DISCORD_OWNER_ID, DISCORD_WEBHOOKS } from "../../util/constants";
import { webhookUrlToIdAndToken } from "../../util/discord";
import { EventHandler, Event } from "../register.events";

const LOG = debug('dodgeball:bot:events:donations:onDonateAdd');

export interface OnDonatePayload
{
  donator: DonatorUser;
}

export default class OnDonateAdd implements EventHandler<OnDonatePayload>
{
  public event = "donator.added" as const;

  public services: Services;

  constructor(services: Services)
  {
    this.services = services;
  }

  async handle(event: Event<OnDonatePayload>)
  {
    LOG(`Donator added: ${event.payload.donator.steamName}, steamid: ${event.payload.donator.steamId}`)
    const { donator } = event.payload;
    this.services.getServerRegisterService()?.addDonator(donator);

    // Send webhook to discord
    const client = this.services.getDiscordClient();
    const webhookInfoUrl = DISCORD_WEBHOOKS['info'];

    const webhookData = webhookUrlToIdAndToken(webhookInfoUrl);
    const webhook = await client.fetchWebhook(webhookData.id, webhookData.token);
    await webhook.send({
      // Include owners ids ping
      content: DISCORD_OWNER_ID.map((id) => `<@${id}>`).join(' '),
      embeds: [
        OnDonateEmbed(donator, true)
      ]
    });
  }
}