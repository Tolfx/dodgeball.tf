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

  const newTable = `topspeed.\`topspeed.backup.${month}.${year}\``

  mysql.connection.query(`CREATE TABLE IF NOT EXISTS ${newTable} LIKE topspeed.topspeed`, (err) =>
  {
    if (err)
    {
      throw err;
    }

    LOG("Created backup table");
    // Lets copy the data
    if (!mysql.connection) return;
    mysql.connection
    .query(
      `INSERT INTO ${newTable} SELECT * FROM topspeed.topspeed`,
      (err) =>
        {
          if (err)
            throw err;
          if (!mysql.connection) return;
          // Idk? typescript lol
          mysql.connection.query("DELETE FROM topspeed.topspeed", (err) =>
          {
            if (err)
            {
              throw err;
            }
        
            LOG("Purged topspeed");
          });
        }
      );

  });
}
