import Logger from "@dodgeball/logger";
import Services from "../../services/Services";
import {
  DISCORD_OWNER_ID,
  DISCORD_WEBHOOKS,
  Colors
} from "../../util/constants";
import { webhookUrlToIdAndToken } from "../../util/discord";
import { EventHandler, Event } from "../register.events";
import { EmbedBuilder } from "discord.js";

const LOG = new Logger("dodgeball:bot:events:errors:OnError");

export interface OnErrorPayload {
  error: any;
  origin?: any;
  reason?: any;
}

export default class OnError implements EventHandler<OnErrorPayload> {
  public event = "error" as const;

  public services: Services;

  constructor(services: Services) {
    this.services = services;
  }

  private isPromise<T>(obj: any): obj is Promise<T> {
    return (
      !!obj &&
      (typeof obj === "object" || typeof obj === "function") &&
      typeof obj.then === "function"
    );
  }

  async handle(event: Event<OnErrorPayload>) {
    LOG.error(event.payload.error);
    // Send webhook to discord
    const client = this.services.getDiscordClient();
    const webhookInfoUrl = DISCORD_WEBHOOKS["error"];
    if (!webhookInfoUrl) return LOG.warn("No webhook url found for info");
    const webhookData = webhookUrlToIdAndToken(webhookInfoUrl);
    const webhook = await client.fetchWebhook(
      webhookData.id,
      webhookData.token
    );

    const embed = new EmbedBuilder()
      .setTitle("Error")
      .setDescription("An error has occurred")
      .setColor(Colors.RED)
      .setTimestamp();

    const fields = [
      {
        name: "Error",
        value: `\`\`\`
${
  this.isPromise(event.payload.error)
    ? `Unhandled promise, unable to log as string`
    : event.payload.error
}
\`\`\``,
        inline: true
      }
    ];

    if (event.payload.origin) {
      fields.push({
        name: "Origin",
        value: `${event.payload.origin}`,
        inline: true
      });
    }

    if (event.payload.reason) {
      fields.push({
        name: "Reason",
        value: `${event.payload.reason}`,
        inline: true
      });
    }

    embed.addFields(fields);

    await webhook.send({
      content: DISCORD_OWNER_ID.map((id) => `<@${id}>`).join(" "),
      embeds: [embed]
    });
  }
}
