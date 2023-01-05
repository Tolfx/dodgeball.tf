import mysql from "mysql";

export interface CCCMUser {
  id: number;
  /**
   * SteamID2
   */
  auth: string;
  hidetag: number;
  tagcolor: string;
  namecolor: string;
  chatcolor: string;
  tag: string;
}

export default function GetCCCM() {
  // Delete auth from cccm table
  const queryGetCCCM = `SELECT * FROM cccm.cccm_users;`;

  return (connection: mysql.Connection): Promise<Array<CCCMUser>> =>
    new Promise((resolve, reject) => {
      connection.query(queryGetCCCM, (err, results) => {
        if (err) return reject(err);

        return resolve(results);
      });
    });
}
