import debug from "debug";
import Services from "../services/Services";
import { Event } from "./register.events";

const LOG = debug("dodgeball:bot:NodeEvents");

export default function NodeEvents(services: Services)
{
  process.on('exit', (code) =>
  {
      LOG(`About to exit with code`, code);
      services.getEventRegister()?.emit(new Event('0', 'error', {
          error: new Error(`About to exit with code ${code}`),
          stack: new Error().stack
      }));
  });
  
  process.on('unhandledRejection', (reason, promise) =>
  {
      LOG('Unhandled Rejection at: ', promise, ' reason: ', reason);
      services.getEventRegister()?.emit(new Event('0', 'error', {
          error: new Error(`Unhandled Rejection at: ${promise} reason: ${reason}`),
          stack: new Error().stack
      }));
  });
  
  process.on('uncaughtExceptionMonitor', (err: any, origin: any) =>
  {
      LOG(`An error`, err, "at ", origin);
      services.getEventRegister()?.emit(new Event('0', 'error', {
          error: new Error(`An error ${err} at ${origin}`),
          stack: new Error().stack
      }));
  });
}