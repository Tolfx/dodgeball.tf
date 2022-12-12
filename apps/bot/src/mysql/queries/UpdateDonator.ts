import { DonatorUser } from '@dodgeball/mongodb';
import mysql from 'mysql';
import SteamID from 'steamid';

export default function UpdateDonator(donator: DonatorUser, serverAmounts = 3)
{
  // We gonna do some multiple inserts here...
  const srvGroupSupporter = 5;
  const srvGroupPatron = 6;
  const srvGroupBooster = 7;

  const getGroupId = (donator: DonatorUser) =>
  {
    if (donator.title === 'supporter')
    {
      return srvGroupSupporter;
    }

    if (donator.title === 'patron')
    {
      return srvGroupPatron;
    }

    if (donator.title === 'booster')
    {
      return srvGroupBooster;
    }
  }

  const getGroupName = (donator: DonatorUser) =>
  {
    if (donator.title === 'supporter')
    {
      return 'Supporter';
    }

    if (donator.title === 'patron')
    {
      return 'Patron';
    }

    if (donator.title === 'booster')
    {
      return 'Booster';
    }

  };

  const queryGetDonator = `SELECT * FROM sourcebans.sb_admins WHERE authid = '${new SteamID(donator.steamId).steam2()}';`;

  return (connection: mysql.Connection): Promise<Array<any>> => new Promise((resolve, reject) =>
  {
    connection
      .query(queryGetDonator,
        (err, results) =>
        {
          if (err)
            return reject(err);

          const adminId = results[0]['aid'];

          // first we gonna add the donator to the sourcebans.sb_admins
          // Table looks like the following: user,authid,password,gid,email,validate,extraflags,immunity,srv_group,srv_flags,srv_password,lastvisit
          const queryUpateDonator = `UPDATE sourcebans.sb_admins SET gid = ${getGroupId(donator)}, srv_group = '${getGroupName(donator)}' WHERE authid = '${new SteamID(donator.steamId).steam2()}';`;

          connection
            .query(queryUpateDonator,
              (err, results) =>
              {
                if (err)
                  return reject(err);

                // Then when created, we will get a admin id which we need for in sourcebans.sb_admins_servers_groups
                // Table looks like: admin_id,group_id,srv_group_id,server_id
                // We gonna do some multiple inserts here...

                // We want to have the serverAmounts added in the server_id column
                // We want to have the adminId in the admin_id column

                const queryUpdateAdminServerGroups = `UPDATE sourcebans.sb_admins_servers_groups SET group_id = ${getGroupId(donator)} WHERE admin_id = ${adminId};`;

                console.log(queryUpdateAdminServerGroups)

                connection
                  .query(queryUpdateAdminServerGroups,
                    (err, results) =>
                    {
                      if (err)
                        return reject(err);

                      resolve(results);
                    }
                  );
              }
            );

        }
      );
  });


}