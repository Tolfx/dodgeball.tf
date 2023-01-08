import { EmbedBuilder } from "discord.js";
import { Colors } from "../../../util/constants";

export default function HelpEmbed() {
  return new EmbedBuilder()
    .setTitle("Help")
    .setDescription("Here is a list of all my commands")
    .setAuthor({
      name: "Dodgeball Bot"
    })
    .setColor(Colors.DARK_BLUE)
    .setFooter({
      text: "Dodgeball Bot"
    })
    .setTimestamp()
    .addFields([
      {
        name: "Information",
        value: "</help:1050445803816243221>",
        inline: true
      },
      {
        name: "Ranks",
        value: "</topspeed:1050364752666312745>",
        inline: true
      },
      {
        name: "Top10",
        value: "</top10:1050518682264154132>",
        inline: true
      },
      {
        name: "Link",
        value: "</link:1051257579109629993>",
        inline: true
      }
    ]);
}
