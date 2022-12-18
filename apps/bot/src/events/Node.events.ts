import Services from "../services/Services";
import { Event } from "./register.events";

export default function NodeEvents(services: Services)
{
  process.on('exit', (code) =>
  {
      services.getEventRegister()?.emit(new Event('0', 'error', {
          error: new Error(`About to exit with code ${code}`),
      }));
  });
  
  process.on('unhandledRejection', (reason, promise) =>
  {
      services.getEventRegister()?.emit(new Event('0', 'error', {
          error: promise,
          reason: reason,
    }));
  });
  
  process.on('uncaughtExceptionMonitor', (err: any, origin: any) =>
  {
      services.getEventRegister()?.emit(new Event('0', 'error', {
          error: err,
          origin: origin,
      }));
  });
}