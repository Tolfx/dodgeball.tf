import debug from "debug";

export enum LogLevel {
  Debug,
  Info,
  Warn,
  Error
}

const IS_PROD = process.env.NODE_ENV === "production";

let logLevel: LogLevel = IS_PROD ? LogLevel.Info : LogLevel.Debug;

export function setGlobalLogLevel(level: LogLevel): void {
  // Set the global log level
  logLevel = level;
}

export default class Logger {
  private name: string;
  private log: ReturnType<typeof debug>;

  constructor(name: string) {
    this.name = name;
    this.log = debug(name || "dodgeball:logger");
  }

  private static isBelowLogLevel(levelKey: keyof typeof LogLevel): boolean {
    return logLevel > LogLevel[levelKey];
  }

  public static log<T extends any[]>(...body: T): void {
    if (this.isBelowLogLevel("Info")) return;
    this.log("LOG:", ...body);
  }

  public debug<T extends any[]>(...body: T): void {
    if (Logger.isBelowLogLevel("Debug")) return;
    this.log(`DEBUG:`, ...body);
  }

  public info<T extends any[]>(...body: T): void {
    if (Logger.isBelowLogLevel("Info")) return;
    this.log(`INFO:`, ...body);
  }

  public warn<T extends any[]>(...body: T): void {
    if (Logger.isBelowLogLevel("Warn")) return;
    this.log(`WARN:`, ...body);
  }

  public error<T extends any[]>(...body: T): void {
    if (Logger.isBelowLogLevel("Error")) return;
    this.log(`ERROR:`, ...body);
  }
}
