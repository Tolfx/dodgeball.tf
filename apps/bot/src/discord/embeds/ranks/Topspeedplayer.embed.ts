import { EmbedBuilder } from "discord.js";
import { TopSpeedPlayer } from "../../../mysql/queries/GetTopSpeedPlayers";
import { Colors } from "../../../util/constants";

export default function TopSpeedPlayerEmbed(topPlayers: TopSpeedPlayer[]) {
  return new EmbedBuilder()
    .addFields(
      topPlayers.map((player, index) => ({
        name: `#${index + 1}. ${player.name}`,
        value: `**Speed:** ${player.topspeed} MpH\n**Deflects:** ${player.topdeflects}`,
        inline: false
      }))
    )
    .setColor(Colors.DARK_ORANGE)
    .setTimestamp()
    .setURL("https://dodgeball.tf");
}
