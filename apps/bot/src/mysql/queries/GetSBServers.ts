import mysql from "mysql";

export interface SourcebansServers {
  sid: number;
  ip: string;
  port: number;
  rcon: string;
  modid: number;
  enabled: number;
}

export default function GetSBServers() {
  const query = `SELECT * FROM sourcebans.sb_servers`;

  return (connection: mysql.Connection): Promise<Array<SourcebansServers>> =>
    new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) return reject(err);

        resolve(results);
      });
    });
}
