import debug from 'debug';
import mysql from 'mysql';
import { MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER } from '../util/constants';

const LOG = debug('dodgeball:bot:setupMysql');

export default async function setupMysql(): Promise<mysql.Connection>
{
  return new Promise((resolve, reject) =>
  {
    LOG('Setting up MySQL connection');
    const connection = mysql.createConnection({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      port: parseInt(MYSQL_PORT)
    });

    connection.connect((err) =>
    {
      if (err)
      {
        reject(err);
        LOG('Failed to connect to MySQL')
        return;
      }

      LOG('Connected to MySQL');
      resolve(connection);
    });
  })
}