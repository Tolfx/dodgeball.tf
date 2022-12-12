import mysql from 'mysql';

export type Server = {
  serverId: number;
  address: string;
  port: number;
  name: string;
  game: string;
  rcon_password: string;
}

export default function GetServers()
{
  const query = `SELECT serverId,address,port,name,game,rcon_password FROM hlstatsx.hlstats_Servers`;

  return (connection: mysql.Connection): Promise<Array<Server>> => new Promise((resolve, reject) =>
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