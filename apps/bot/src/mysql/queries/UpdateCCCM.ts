import mysql from 'mysql';
import SteamID from 'steamid';

interface UpdateCCCMOptions
{
  steamid: string;
  tag: string;
  chatcolor?: string;
  namecolor?: string;
  tagcolor?: string;
}

export default function UpdateCCCM(options: UpdateCCCMOptions)
{

  // We want a query in database cccm in table cccm_users,
  // table looks like: id, auth, hidetag, tagcolor, namecolor, chatcolor, tag
  // Id probably should be autoincrement
  // auth is the steamid2
  // hidetag is 0
  // We have different colors and stuff for different donator levels
  const queryUpdateCCCM = `UPDATE cccm.cccm_users SET tag = '${options.tag}', chatcolor = '${options.chatcolor}', namecolor = '${options.namecolor}', tagcolor = '${options.tagcolor}' WHERE auth = '${(new SteamID(options.steamid).steam2())}';`;

  return (connection: mysql.Connection): Promise<Array<any>> => new Promise((resolve, reject) =>
  {
    connection
      .query(queryUpdateCCCM,
        (err, results) =>
        {
          if (err)
            return reject(err);

          return resolve(results);
        }
      );
  });
}