import debug from "debug";
import mysql from "mysql";
import { MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER } from "./utils/constants";

const LOG = debug("dodgeball:mysql")

export default class MySQL
{
  public connection?: mysql.Connection;

  constructor(
    private host: string = MYSQL_HOST || '',
    private user: string = MYSQL_USER || 'root',
    private password: string = MYSQL_PASSWORD || '',
    private port: number = parseInt(MYSQL_PORT || '3306'),
  )
  {
    const connection = mysql.createConnection({
      host: this.host,
      user: this.user,
      password: this.password,
      port: this.port
    });

    connection.connect((err) =>
    {
      if (err)
      {
        LOG('Failed to connect to MySQL')
        return;
      }

      LOG('Connected to MySQL');
      this.connection = connection;
    });
  }

  public async connect()
  {
    return new Promise((resolve, reject) =>
    {
      if (this.connection)
        return resolve(this.connection);
      const connection = mysql.createConnection({
        host: this.host,
        user: this.user,
        password: this.password,
        port: this.port
      });
  
      connection.connect((err) =>
      {
        if (err)
        {
          LOG('Failed to connect to MySQL')
          return reject(err);
        }
  
        LOG('Connected to MySQL');
        this.connection = connection;
        return resolve(this.connection);
      });
    })
  }
}