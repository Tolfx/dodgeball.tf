import http from "http";
import express from "express";
import { Server } from "socket.io";
import debug from "debug";
import { PORT } from "../util/constants";

const LOG = debug("dodgeball:api:setupAPI");

const expressApi = express();
const server = http.createServer(expressApi);

export default () => {
  LOG(`Creating socket.io server`);
  const socketIo = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  expressApi.use(express.json());
  expressApi.use(express.urlencoded({ extended: true }));

  // Set cors on express
  expressApi.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
  });

  server.listen(PORT, () => {
    LOG("listening on port: %s", PORT);
  });
  return { socketIo, expressApi };
};
