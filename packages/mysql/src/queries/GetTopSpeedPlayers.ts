import mysql from 'mysql';

export type TopSpeedPlayer = {
  steamid: string,
  name: string;
  topspeed: number;
  topdeflects: number;
  serverid: string;
}

export default function GetTopSpeedPlayers(serverid?: string, steamid?: string)
{
  // we want to select database `topspeed` and table `topspeed`
  // We should also select all columns but where serverid is equal to the serverid

  // Also want to order by the column topspeed

  // If steamid is provided, we want to select where steamid is equal to the steamid

  const serveridQuery = serverid ? `${!steamid ? 'WHERE ' : ''}serverid = '${serverid}'` : '';
  const steamidQuery = steamid ? `${serverid ? 'AND ' : 'WHERE '}steamid = '${steamid}'` : '';

  const query = `SELECT * FROM topspeed.topspeed ${serveridQuery} ${steamidQuery} ORDER BY topspeed DESC`;

  return (connection: mysql.Connection): Promise<Array<TopSpeedPlayer>> => new Promise((resolve, reject) =>
  {
    connection
      .query(query,
        (err, results) =>
        {
          if (err)
            return reject(err);

          resolve(results);
        }
      );
  });


}