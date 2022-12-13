import { DonatorUser } from "@dodgeball/mongodb";
import { EmbedBuilder } from "discord.js";
import { Colors } from "../../../util/constants";

export default function OnDonateEmbed(donator: DonatorUser, isNew: boolean)
{
  const title = isNew ? 'New Donator' : 'Donator Updated';
  const description = isNew ?
    `A new donation from ${donator.steamName} (${donator.steamId})`
    :
    `Donator ${donator.steamName} (${donator.steamId}) has donated again!`;
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setAuthor({
      name: 'Dodgeball Bot',
    })
    .setColor(donator.title === 'patron' ? Colors.DARK_ORANGE : Colors.ORANGE)
    .setFooter({
      text: 'Dodgeball Bot',
    })
    .setTimestamp();

  const fields = [
    {
      name: 'Donator',
      value: donator.steamName,
      inline: true,
    },
    {
      name: 'SteamID',
      value: donator.steamId,
      inline: true,
    },
    {
      name: 'Title',
      value: donator.title,
      inline: true,
    },
    {
      name: 'Donations',
      value: donator.donations.map(donation => `${donation.amount} ${donation.currency}`).join(', '),
      inline: true,
    },
  ];

  if (donator.isPermanent)
  {
    fields.push({
      name: 'Expires',
      value: 'Never',
      inline: true,
    });
  }

  if (donator.expiresAt)
  {
    fields.push({
      name: 'Expires',
      value: donator.expiresAt.toDateString(),
      inline: true,
    });
  }

  if (donator.lastPaidAt)
  {
    fields.push({
      name: 'Last Paid',
      value: donator.lastPaidAt.toDateString(),
      inline: true,
    });
  }

  embed.addFields(fields);

  return embed;
}