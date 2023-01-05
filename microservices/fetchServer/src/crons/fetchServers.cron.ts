import { Server } from "@dodgeball/mongodb";
import { MasterServer } from "@fabricio-191/valve-server-query";
import debug from "debug";

// Create a debug logger
const LOG = debug("dodgeball:fetchServer");

/**
 * Fetch servers from the master server and save them to the database.
 *
 */
export default async function fetchServer()
{
  LOG(`Fetching servers`);

  // Create a new master server filter
  const filter = new MasterServer.Filter()
      .add("appid", 440) // Limit results to servers running Team Fortress 2
      // @ts-ignore
      .add("gametype", ["dodgeball"]); // Limit results to servers running the "dodgeball" game type

  LOG(`Using master server filter: ${JSON.stringify(filter)}`);

  // Query the master server for servers
  const servers = await MasterServer({
    quantity: 5000,
    region: 'OTHER',
    timeout: 10000,
    filter,
  });

  LOG(`Found ${servers.length} servers`);

  // Map the list of servers to an array of objects containing the server IP and port
  const mappedServers = servers.map((server) =>
  {
    const [ip, port] = server.split(':');
    return {
      ip,
      port: parseInt(port),
    };
  });

  LOG(`Saving servers to database`);

  // Save the servers to the database
  for (const server of mappedServers)
  {
    const serverExists = await Server.findOne(server);
    if (!serverExists)
    {
      LOG(`Server ${server.ip}:${server.port} does not exist in database, adding it`);
      await new Server({
        ip: server.ip,
        port: server.port,
      }).save();
    }
  }
}
