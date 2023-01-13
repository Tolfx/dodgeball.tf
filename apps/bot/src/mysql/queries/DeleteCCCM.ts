import { DonatorUser } from "@dodgeball/mongodb";
import mysql from "mysql";
import SteamID from "steamid";

export default function DeleteCCCM(donator: DonatorUser) {
  // Delete auth from cccm table
  const steamid = new SteamID(donator.steamId).steam2();
  const queryDeleteCCCM = `DELETE FROM cccm.cccm_users WHERE auth = '${steamid}'`;

  return (connection: mysql.Connection): Promise<Array<any>> =>
    new Promise((resolve, reject) => {
      connection.query(queryDeleteCCCM, (err, results) => {
        if (err) return reject(err);

        return resolve(results);
      });
    });
}
