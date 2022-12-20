import { DonatorUser } from '@dodgeball/mongodb';
import mysql from 'mysql';
import SteamID from 'steamid';

export function getDonatorCCC(donator: DonatorUser)
{
  switch (donator.title)
  {
    case 'supporter':
      {
        return {
          tagcolor: "FF8C00",
          tag: "[Supporter] "
        } as const;
      }

    case 'patron':
      {
        return {
          tagcolor: "FF4500",
          tag: "[Patron] "
        } as const;
      }

    case 'booster':
      {
        return {
          tagcolor: "FFD700",
          tag: "[Booster] "
        } as const;
      }

    default:
      {
        return {
          tagcolor: "",
          tag: ""
        } as const;
      }
  }
}

export default function AddCCCM(donator: DonatorUser)
{
  // Check first if we have a donator in the cccm table already
  const queryCheckCCCM = `SELECT * FROM cccm.cccm WHERE auth = '${(new SteamID(donator.steamId).steam2())}';`;

  return (connection: mysql.Connection): Promise<boolean> => new Promise((resolve, reject) =>
  {
    connection
      .query(queryCheckCCCM,
        (err, results) =>
        {
          if (err)
            return reject(err);

          const exists = results.length > 0;

          if (exists) return resolve(false);

          // We want a query in database cccm in table cccm,
          // table looks like: id, auth, hidetag, tagcolor, namecolor, chatcolor, tag
          // Id probably should be autoincrement
          // auth is the steamid2
          // hidetag is 0
          // We have different colors and stuff for different donator levels
          const cccm = getDonatorCCC(donator);
          const queryCreateCCCM = `INSERT INTO cccm.cccm_users (auth, hidetag, tagcolor, namecolor, chatcolor, tag) VALUES ('${(new SteamID(donator.steamId).steam2())}', 0, '${cccm.tagcolor}', '', '', '${cccm.tag}');`;

          connection
            .query(queryCreateCCCM,
              (err) =>
              {
                if (err)
                  return reject(err);

                resolve(true);
              }
            );
        }
      );
  });
}