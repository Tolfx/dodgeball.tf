import mysql from 'mysql';

export type HlstatsPlayers = {
  playerId: number;
  lastName: string;
  /**
   * Actually IP address
   */
  lastAddress: string;
  city: string;
  country: string;
  flag: string;
  lat: number;
  lng: number;
}

export default function GetPlayer(playerId: string)
{
  const query = `SELECT * FROM hlstatsx.hlstats_Players WHERE playerId = '${playerId}'`;

  return (connection: mysql.Connection): Promise<Array<HlstatsPlayers>> => new Promise((resolve, reject) =>
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