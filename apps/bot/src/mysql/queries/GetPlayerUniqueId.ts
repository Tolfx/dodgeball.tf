import mysql from "mysql";

export type UniquePlayerId = {
  playerId: number;
};

export default function GetPlayerUniqueId(steamid: string) {
  const query = `SELECT * FROM hlstatsx.hlstats_PlayerUniqueIds WHERE uniqueId = '${steamid}'`;
  return (connection: mysql.Connection): Promise<Array<UniquePlayerId>> =>
    new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) return reject(err);

        resolve(results);
      });
    });
}
