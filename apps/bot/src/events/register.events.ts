import Logger from "@dodgeball/logger";
import NodeEvents from "./Node.events";
import Services from "../services/Services";
import OnDonateAdd from "./Donations/OnDonateAdd.event";
import OnDonateRemove from "./Donations/OnDonateRemove.event";
import OnDonateUpdate from "./Donations/OnDonateUpdate.event";
import OnError from "./Errors/OnError.event";

const LOG = new Logger("dodgeball:bot:discord:events:register.events");

export type Events =
  | "donator.added"
  | "donator.updated"
  | "donator.removed"
  | "error";

export interface EventHandler<Payload> {
  event: Events;
  services: Services;
  handle: (event: Event<Payload>) => Promise<void>;
}

export class Event<Payload> {
  public id: string;
  public event: Events;
  public payload: Payload;

  constructor(id: string, event: Events, payload: Payload) {
    this.id = id;
    this.event = event;
    this.payload = payload;
  }
}

export default class RegisterEvents {
  private services: Services;

  private Events = new Map<Events, EventHandler<any>>();

  private OnEvents = [OnDonateAdd, OnDonateUpdate, OnDonateRemove, OnError];

  constructor(services: Services) {
    LOG.info("Registering events");
    this.services = services;
    NodeEvents(services);
  }

  public async register() {
    for (const event of this.OnEvents) {
      LOG.info(`Registering event: ${event.name}`);
      const instance = new event(this.services);
      this.Events.set(instance.event, instance);
    }
  }

  public async emit<Payload>(event: Event<Payload>) {
    const handler = this.Events.get(event.event);
    if (handler) {
      await handler.handle(event);
    }
  }
}
