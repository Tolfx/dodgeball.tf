/* eslint-disable max-len */
import { DonatorUser } from "@dodgeball/mongodb";
import mysql from "mysql";
import SteamID from "steamid";

export default function AddDonator(donator: DonatorUser, serverAmounts = 3) {
  // We gonna do some multiple inserts here...
  const superRandompassword =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const srvGroupSupporter = 5;
  const srvGroupPatron = 6;
  const srvGroupBooster = 7;

  const getGroupId = (donator: DonatorUser) => {
    if (donator.title === "supporter") {
      return srvGroupSupporter;
    }

    if (donator.title === "patron") {
      return srvGroupPatron;
    }

    if (donator.title === "booster") {
      return srvGroupBooster;
    }
  };

  const getGroupName = (donator: DonatorUser) => {
    if (donator.title === "supporter") {
      return "Supporter";
    }

    if (donator.title === "patron") {
      return "Patron";
    }

    if (donator.title === "booster") {
      return "Booster";
    }
  };

  // first we gonna add the donator to the sourcebans.sb_admins
  // Table looks like the following: user,authid,password,gid,email,validate,extraflags,immunity,srv_group,srv_flags,srv_password,lastvisit
  const queryCreateAdmin = `INSERT INTO sourcebans.sb_admins (user,authid,password,gid,email,validate,extraflags,immunity,srv_group,srv_flags,srv_password,lastvisit) VALUES ('Donator | ${
    donator.steamName
  }', '${new SteamID(
    donator.steamId
  ).steam2()}', '${superRandompassword}', ${getGroupId(donator)}, '${
    donator.steamName
  }@dodgeball.tf', NULL, 0, 0, '${getGroupName(donator)}', NULL, NULL, NULL);`;

  return (connection: mysql.Connection): Promise<Array<any>> =>
    new Promise((resolve, reject) => {
      connection.query(queryCreateAdmin, (err, results) => {
        if (err) return reject(err);

        const adminId = results.insertId;
        // Then when created, we will get a admin id which we need for in sourcebans.sb_admins_servers_groups
        // Table looks like: admin_id,group_id,srv_group_id,server_id
        // We gonna do some multiple inserts here...

        // We want to have the serverAmounts added in the server_id column
        // We want to have the adminId in the admin_id column

        const serverValues: string[] = [];
        for (let i = 0; i < serverAmounts; i++) {
          serverValues.push(
            `(${adminId}, ${getGroupId(donator)}, -1, ${i + 1})`
          );
        }

        const queryCreateAdminServerGroups = `INSERT INTO sourcebans.sb_admins_servers_groups (admin_id,group_id,srv_group_id,server_id) VALUES ${serverValues.join(
          ","
        )};`;

        connection.query(queryCreateAdminServerGroups, (err, results) => {
          if (err) return reject(err);

          resolve(results);
        });
      });
    });
}
