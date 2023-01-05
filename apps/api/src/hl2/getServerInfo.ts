import debug from "debug";
import gamedig from "gamedig";

// Initialize debug function with namespace
const LOG = debug("dodgeball:api:hl2:getServerInfo");

export interface IServerInfoData {
  name: string;
  map: string;
  maxplayers: number;
  connect: string;
  password: boolean;
  raw: {
    game?: string;
    tags?: string[];
  };
}

/**
 * Retrieves server information for a given IP and port.
 * @param ip - IP address of the server
 * @param port - Port number of the server
 * @returns Promise containing server information
 */
export default function getServerInfo(ip: string, port: number): Promise<IServerInfoData>
{
  return new Promise((resolve, reject) =>
  {
    LOG(`Getting server info for ${ip}:${port}`);
    gamedig.query({
      type: "tf2",
      host: ip,
      port: port,
    }).then((state) =>
    {
      LOG(`Got server info for ${ip}:${port}`);
      resolve(state as IServerInfoData);
    }).catch((error) =>
    {
      reject(error);
    });
  });
}
