import debug from "debug";
import Services from "../../services/Services";
import { DISCORD_OWNER_ID, DISCORD_WEBHOOKS, Colors } from "../../util/constants";
import { webhookUrlToIdAndToken } from "../../util/discord";
import { EventHandler, Event } from "../register.events";
import { EmbedBuilder } from "@discordjs/builders";

const LOG = debug('dodgeball:bot:events:donations:OnDonateUpdate');

export interface OnErrorPayload
{
  error: Error | any;
  stack?: string;
}

export default class OnError implements EventHandler<OnErrorPayload>
{
  public event = "error" as const;

  public services: Services;

  constructor(services: Services)
  {
    this.services = services;
  }

  async handle(event: Event<OnErrorPayload>)
  {
    LOG(`Error: ${event.payload.error}`);

    // Send webhook to discord
    const client = this.services.getDiscordClient();
    const webhookInfoUrl = DISCORD_WEBHOOKS['error'];
    if (!webhookInfoUrl) return LOG('No webhook url found for info');
    const webhookData = webhookUrlToIdAndToken(webhookInfoUrl);
    const webhook = await client.fetchWebhook(webhookData.id, webhookData.token);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: 'Error',
      })
      .setDescription(event.payload.error)
      // @ts-ignore
      .setColor(Colors.RED)
      .setTimestamp()
      .setFields(
        {
          name: 'Error',
          value: event.payload.error,
          inline: true
        },
        {
          name: 'Stack',
          value: event.payload.stack || '',
          inline: true
        },
      )

    await webhook.send({
      content: DISCORD_OWNER_ID.map((id) => `<@${id}>`).join(' '),
      embeds: [
        embed
      ]
    });
  }
}