import Logger from "@dodgeball/logger";
import {
  CacheType,
  ChatInputCommandInteraction,
  Client,
  StringSelectMenuInteraction
} from "discord.js";
import Services from "../../services/Services";
import InspectPlayerInteractions from "./admin/InspectPlayer.interaction";
import ManuallyLinkInteraction from "./admin/ManuallyLink.interaction";
import RemoveTopSpeedInteractions from "./admin/RemoveTopSpeed.interaction";
import HelpInteraction from "./information/Help.interaction";
import LinkInteraction from "./information/Link.interaction";
import Top10Interactions from "./ranks/Top10.interactions";
import TopSpeedInteractions from "./ranks/Topspeed.interactions";
import AddTagInteraction from "./admin/AddTag.interaction";

const LOG = new Logger(
  "dodgeball:bot:discord:interactions:register.interactions"
);

declare module "discord.js" {
  interface Client {
    interactions: Map<string, InteractionsHandler>;
  }
}

export interface InteractionsHandler {
  name: string;
  category: string;
  init: (client: Client, services: Services) => void;
  stringmenu?: (interaction: StringSelectMenuInteraction) => void;
  command?: (interaction: ChatInputCommandInteraction<CacheType>) => void;
}

export default class InteractionsRegister {
  private client: Client;

  private Interactions: InteractionsHandler[] = [
    new TopSpeedInteractions(),
    new HelpInteraction(),
    new Top10Interactions(),
    new InspectPlayerInteractions(),
    new RemoveTopSpeedInteractions(),
    new LinkInteraction(),
    new ManuallyLinkInteraction(),
    new AddTagInteraction()
  ];

  constructor(private services: Services) {
    this.client = services.getDiscordClient();
    this.client.interactions = new Map<string, InteractionsHandler>();
  }

  registerInteractions() {
    LOG.info("Registering interactions");
    this.Interactions.forEach((inter) => {
      inter.init(this.client, this.services);
    });
  }
}
