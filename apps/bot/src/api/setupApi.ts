import debug from "debug";
import express from "express";
import session from "express-session";
import { API_PORT } from "../util/constants";

const LOG = debug('dodgeball:bot:api:setupApi')

export default function setupApi()
{
  LOG('Setting up API')
  const server = express();

  // Setup cors
  server.use((req, res, next) =>
  {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('X-Powered-By', 'Dodgeball.tf');
    next();
  });

  // Setup body parser
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  const sessionMiddleWare = session({
    secret: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    resave: false,
    saveUninitialized: true,
    cookie: {
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    }
  });

  server.use(sessionMiddleWare);

  server.listen(API_PORT, () => LOG(`API listening on port ${API_PORT}`));

  return server;
}