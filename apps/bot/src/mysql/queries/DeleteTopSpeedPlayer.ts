import mysql from "mysql";

export default function DeleteTopSpeedPlayer(
  steamid: string,
  serverid?: string
) {
  // We want to delete from the database `topspeed` and table `topspeed`
  // We want to delete where steamid is equal to the steamid
  // If serverid is provided, we want to delete where serverid is equal to the serverid

  const query = `DELETE FROM topspeed.topspeed WHERE steamid = '${steamid}' ${
    serverid ? ` AND serverid = '${serverid}'` : ""
  }`;

  return (connection: mysql.Connection): Promise<Array<any>> =>
    new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) return reject(err);

        resolve(results);
      });
    });
}
