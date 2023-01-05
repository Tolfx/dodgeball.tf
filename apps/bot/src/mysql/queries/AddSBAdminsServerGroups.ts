import mysql from "mysql";
import { SourcebansAdminServersGroups } from "./GetSBAdminsServerGroups";

export default function AddSBAdminsServerGroups(
  options: SourcebansAdminServersGroups
) {
  // eslint-disable-next-line max-len
  const query = `INSERT INTO sourcebans.sb_admins_servers_groups (admin_id, group_id, srv_group_id, server_id) VALUES (${options.admin_id}, ${options.group_id}, -1, ${options.server_id})`;

  return (
    connection: mysql.Connection
  ): Promise<Array<SourcebansAdminServersGroups>> =>
    new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) return reject(err);

        resolve(results);
      });
    });
}
