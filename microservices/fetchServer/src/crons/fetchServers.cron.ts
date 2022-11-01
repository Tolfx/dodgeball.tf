import { Server } from "@dodgeball/mongodb";
import { MasterServer } from "@fabricio-191/valve-server-query";
import debug from "debug";
import Services from "../Services";

const LOG = debug("dodgeball:fetchServer");

export default function fetchServer(services: Services)
{
  LOG(`Fetching servers`);
  const filter = new MasterServer.Filter()
    .add("appid", 440)
    // @ts-ignore
    .add("gametype", ["dodgeball"]);

  LOG(`Using master server filter: ${JSON.stringify(filter)}`);
  MasterServer({
    quantity: 5000,
    region: 'OTHER',
    timeout: 10000,
    filter,
  }).then(async (servers) =>
  {
    LOG(`Found ${servers.length} servers`);
    const mappedServers = servers.map((server) =>
    {
      const [ip, port] = server.split(':')
      return {
        ip,
        port: parseInt(port),
      }
    });

    LOG(`Saving servers to database`);

    for await (const server of mappedServers)
    {
      const serverExists = await Server.findOne(server);
      if (!serverExists)
      {
        LOG(`Server ${server.ip}:${server.port} does not exist in database, adding it`);
        const serverModel = new Server({
          ip: server.ip,
          port: server.port,
        }).save();
      }
    }
  });
}