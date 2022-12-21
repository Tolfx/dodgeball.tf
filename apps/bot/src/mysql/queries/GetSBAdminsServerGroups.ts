import mysql from 'mysql';

export interface SourcebansAdminServersGroups
{
  admin_id: number;
  group_id: number;
  /**
   * Should always be -1
   */
  srv_group_id: number;
  server_id: number;
}

export default function GetSBAdminsServerGroups()
{
  const query = `SELECT * FROM sourcebans.sb_admins_servers_groups`;

  return (connection: mysql.Connection): Promise<Array<SourcebansAdminServersGroups>> => new Promise((resolve, reject) =>
  {
    connection
      .query(query,
        (err, results) =>
        {
          if (err)
            return reject(err);

          resolve(results);
        }
      );
  });
}