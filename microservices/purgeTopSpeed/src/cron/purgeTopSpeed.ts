import debug from "debug";
import Services from "../Services";

const LOG = debug("dodgeball:purgeTopSpeed:purgeTopSpeed")

export default function purgeTopSpeed(services: Services)
{
  // We want to get mysql, and then just delete everything from the database
  // We will remove from topspeed.topspeed

  const mysql = services.getMysql();

  if (!mysql.connection)
  {
    throw new Error("No connection to MySQL");
  }

  // But before we delete we want a backup of the data

  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();

  mysql.connection.query(`CREATE TABLE IF NOT EXISTS topspeed.backup.${month}.${year} LIKE topspeed.topspeed`, (err) =>
  {
    if (err)
    {
      throw err;
    }

    LOG("Created backup table");
    // Not we can safely delete the data

    // Idk? typescript lol
    if (!mysql.connection) return;

    mysql.connection.query("DELETE FROM topspeed.topspeed", (err) =>
    {
      if (err)
      {
        throw err;
      }
  
      LOG("Purged topspeed");
    });

  });
}
