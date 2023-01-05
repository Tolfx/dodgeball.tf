import mysql from "mysql";

export type Server = {
  serverId: number;
  address: string;
  port: number;
  name: string;
  game: string;
  rcon_password: string;
  kills: number;
  players: number;
  act_players: number;
  max_players: number;
  act_map: string;
};

export default function GetServers() {
  const query = `SELECT serverId,address,port,name,game,rcon_password,kills,players,act_players,max_players,act_map FROM hlstatsx.hlstats_Servers`;

  return (connection: mysql.Connection): Promise<Array<Server>> =>
    new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) return reject(err);

        resolve(results);
      });
    });
}
