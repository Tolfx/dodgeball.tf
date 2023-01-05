import mysql from "mysql";

export interface SourcebansGroups {
  id: number;
  flags: string;
  immunity: number;
  name: string;
}

export default function GetSBGroups() {
  const query = `SELECT * FROM sourcebans.sb_srvgroups`;

  return (connection: mysql.Connection): Promise<Array<SourcebansGroups>> =>
    new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) return reject(err);

        resolve(results);
      });
    });
}
