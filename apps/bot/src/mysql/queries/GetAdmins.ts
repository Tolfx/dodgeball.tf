import mysql from "mysql";

export type AdminSourcebans = {
  aid: number;
  user: string;
  /**
   * steamid
   */
  authid: string;
  password: string;
  gid: number;
  email: string;
  validate: string;
  extraflags: number;
  immunity: number;
  srv_group: string;
  srv_flags: number;
  srv_password: string;
  lastvisit: number;
};

export default function GetAdmins(includeDonators = false) {
  // We don't want to query players that has "Donator |"" in their name
  const query = `SELECT * FROM sourcebans.sb_admins${
    includeDonators ? "" : ` WHERE user NOT LIKE '%Donator |%'`
  }`;

  return (connection: mysql.Connection): Promise<Array<AdminSourcebans>> =>
    new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) return reject(err);

        resolve(results);
      });
    });
}
