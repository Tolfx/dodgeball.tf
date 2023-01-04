import debug from "debug";
import Services from "../Services";

// Create a debug logger
const LOG = debug("dodgeball:purgeTopSpeed:purgeTopSpeed");

/**
 * Purge the topspeed table in the MySQL database.
 *
 * @param services - The Services instance
 */
export default function purgeTopSpeed(services: Services)
{
  // Get the MySQL instance from the Services instance
  const mysql = services.getMysql();

  // If there is no connection to the MySQL database, throw an error
  if (!mysql.connection)
  {
    throw new Error("No connection to MySQL");
  }

  // Get the current month and year
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();

  // Create a new table name using the current month and year
  const newTable = `topspeed.\`topspeed.backup.${month}.${year}\``;

  // Create a new table in the MySQL database using the `CREATE TABLE` statement, if the table does not already exist
  mysql.connection.query(`CREATE TABLE IF NOT EXISTS ${newTable} LIKE topspeed.topspeed`, (err: Error) =>
  {
    // If there was an error, throw it
    if (err)
    {
      throw err;
    }

    LOG("Created backup table");

    // Copy the data from the `topspeed` table to the new table using the `INSERT INTO` statement
    mysql.connection.query(
        `INSERT INTO ${newTable} SELECT * FROM topspeed.topspeed`,
        (err: Error) =>
        {
          // If there was an error, throw it
          if (err)
          {
            throw err;
          }

          // If there is no connection to the MySQL database, return early
          if (!mysql.connection) return;

          // Delete all the data from the `topspeed` table using the `DELETE FROM` statement
          mysql.connection.query("DELETE FROM topspeed.topspeed", (err: Error) =>
          {
            // If there was an error, throw it
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
