import mysql from 'mysql';

export type TopPlayer = {
  lastName: string;
  kills: number;
  deaths: number;
  skill: number;
}

export default function GetTopPlayers(serverid: string, page = 1)
{

  const query = `SELECT lastName,kills,deaths,skill FROM hlstatsx.hlstats_Players WHERE game = '${serverid}' ORDER BY skill DESC LIMIT 10 OFFSET ${page * 10 - 10}`;

  return (connection: mysql.Connection): Promise<Array<TopPlayer>> => new Promise((resolve, reject) =>
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