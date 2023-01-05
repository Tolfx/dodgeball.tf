import { DonatorUser } from "@dodgeball/mongodb";
import mysql from "mysql";
import SteamID from "steamid";

export default function DeleteDonator(donator: DonatorUser) {
  const queryGetDonator = `SELECT * FROM sourcebans.sb_admins WHERE authid = '${new SteamID(
    donator.steamId
  ).steam2()}';`;

  return (connection: mysql.Connection): Promise<Array<any>> =>
    new Promise((resolve, reject) => {
      connection.query(queryGetDonator, (err, results) => {
        if (err) return reject(err);

        const adminId = results[0]["aid"];

        // Now we got their adminid, we can start by deleting them from the sb_admins table
        const queryDeleteDonator = `DELETE FROM sourcebans.sb_admins WHERE aid = ${adminId};`;

        connection.query(queryDeleteDonator, (err) => {
          if (err) return reject(err);

          // Now we deleted them from the sb_admins table, we can delete them from the sb_admins_servers_groups table
          const queryDeleteDonatorServerGroups = `DELETE FROM sourcebans.sb_admins_servers_groups WHERE admin_id = ${adminId};`;

          connection.query(queryDeleteDonatorServerGroups, (err, results) => {
            if (err) return reject(err);

            resolve(results);
          });
        });
      });
    });
}
