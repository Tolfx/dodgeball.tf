import mysql from "mysql";

export interface LiveStats {
  player_id: number;
  server_id: number;
  cli_address: string;
  cli_city: string;
  cli_country: string;
  cli_flag: string;
  cli_state: string;
  cli_lat: number;
  cli_lng: number;
  steam_id: string;
  name: string;
  team: string;
  kills: number;
  deaths: number;
  suicides: number;
  headshots: number;
  shots: number;
  hits: number;
  is_dead: number;
  has_bomb: number;
  ping: number;
  connected: number;
  skill_change: number;
  skill: number;
}

export default function GetLiveStats() {
  const query = `SELECT * FROM hlstatsx.hlstats_Livestats`;

  return (connection: mysql.Connection): Promise<Array<LiveStats>> =>
    new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) return reject(err);

        resolve(results);
      });
    });
}
