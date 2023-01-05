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
        value: "`/help`",
        inline: true
      },
      {
        name: "Ranks",
        value: "`/topspeed`",
        inline: true
      },
      {
        name: "Top10",
        value: "`/top10`",
        inline: true
      }
    ]);
}
