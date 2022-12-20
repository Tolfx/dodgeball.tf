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

  // Just ensure not to update data that is null, aka don't add it in the query, we also need to ensure that we don't add a comma at the end of the query if we don't have any data to update

  let queryUpdateCCCM = `UPDATE cccm.cccm_users SET ${options.tag ? `tag = '${options.tag}', ` : ''}${options.chatcolor ? `chatcolor = '${options.chatcolor}', ` : ''}${options.namecolor ? `namecolor = '${options.namecolor}', ` : ''}${options.tagcolor ? `tagcolor = '${options.tagcolor}', ` : ''}WHERE auth = '${(new SteamID(options.steamid).steam2())}';`;

  // Clean it by removing the last comma and space where it is ", WHERE auth"
  queryUpdateCCCM = queryUpdateCCCM.replace(/, WHERE auth/g, ' WHERE auth');

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