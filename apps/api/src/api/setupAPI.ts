import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import debug from 'debug';
import { PORT } from '../util/constants';

const LOG = debug('dodgeball:api:setupAPI');

// Initialize Express and Socket.io servers
const expressApi = express();
const server = http.createServer(expressApi);
const socketIo = new Server(server, { cors: { origin: '*' } });

// Enable JSON parsing and URL encoding on Express server
expressApi.use(express.json());
expressApi.use(express.urlencoded({ extended: true }));

// Set CORS headers on Express server
expressApi.use((req, res, next) =>
{
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Start the server
server.listen(PORT, () =>
{
  LOG(`Listening on port ${PORT}`);
});

// Return the initialized servers
export default () => ({ socketIo, expressApi });
