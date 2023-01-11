import Logger from "@dodgeball/logger";
import { Client, Message } from "discord.js";
import Services from "../../../services/Services";
import { CommandHandler } from "../register.command";
import { DISCORD_OWNER_ID } from "../../../util/constants";
import { DonatorUserModel } from "@dodgeball/mongodb";
import { processDate } from "../../../util/donations";
import { OnDonatePayload } from "../../../events/Donations/OnDonateAdd.event";
import { OnDonateUpdatePayload } from "../../../events/Donations/OnDonateUpdate.event";
import { Event } from "../../../events/register.events";

const LOG = new Logger("dodgeball:bot:commands:admin:AddDonatorCommand");

export default class AddDonatorCommand implements CommandHandler {
  name = "add_donator";
  category = "admin";

  private services?: Services;
  private client?: Client;

  init(client: Client, services: Services) {
    LOG.info("Setting up add donator command");
    this.client = client;
    this.services = services;
    // Add commands to client
    client.commands.set(this.name, this);
  }

  private protectCommand(message: Message) {
    // Must owner
    const ownerIds = DISCORD_OWNER_ID;
    if (!ownerIds.includes(message.author.id)) {
      return false;
    }
    return true;
  }

  async on(message: Message, args: string[]) {
    if (!this.protectCommand(message)) {
      return;
    }

    if (!this.services) {
      return;
    }

    // We will assume command is in this order format: {prefix}add_donator steamId amount
    const steamId = args[0];
    // Check if steamId is valid
    if (!steamId) {
      return message.channel.send({
        content: "Steam ID is required"
      });
    }

    const amount = parseInt(args[1], 0);
    // Check if amount is valid
    if (!amount) {
      return message.channel.send({
        content: "Amount is required"
      });
    }

    // Check if steamId is already in the database
    const donator = await DonatorUserModel.findOne({
      steamId
    });

    if (!donator) {
      return message.channel.send({
        content: "Steam ID is not a donator"
      });
    }

    // Update the donator
    const currentTitle = donator.title;
    const wasActive = donator.isActive;
    const date = processDate(amount);
    donator.isActive = true;
    donator.title =
      currentTitle === "patron"
        ? "patron"
        : amount >= 25
        ? "patron"
        : "supporter";
    donator.isPermanent =
      currentTitle === "patron" ? true : amount >= 25 ? true : false;
    donator.expiresAt =
      currentTitle === "patron"
        ? undefined
        : amount >= 25
        ? undefined
        : date.date;
    donator.lastPaidAt = new Date();
    donator.donations.push({
      amount: String(amount),
      currency: "USD",
      createdAt: new Date()
    });

    await donator.save();

    if (!wasActive) {
      this.services
        .getEventRegister()
        ?.emit(new Event<OnDonatePayload>("1", "donator.added", { donator }));
    } else {
      this.services.getEventRegister()?.emit(
        new Event<OnDonateUpdatePayload>("1", "donator.updated", {
          donator,
          beforeAmount: amount,
          beforeTitle: currentTitle
        })
      );
    }
  }
}
