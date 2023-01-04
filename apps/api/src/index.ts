require("dotenv").config();
import { MongoDb } from "@dodgeball/mongodb";
import debug from "debug";
import setupAPI from "./api/setupAPI";
import RouterService from "./RouterServices";
import Services from "./Services";
import { MONGO_DATABASE, MONGO_HOST, MONGO_PASSWORD, MONGO_PORT, MONG_USEERNAME } from "./util/constants";
import MySQL from "@dodgeball/mysql";

const LOG = debug("dodgeball:api:bootstrap");

/**
 * Initializes the server by connecting to the MongoDB database, setting up the express API, and setting up the router.
 */
const bootstrap = async () =>
{
  LOG("Starting bootstrap");

  // Connect to the MongoDB database
  const mongoDB = new MongoDb(MONGO_HOST, MONGO_PORT, MONGO_DATABASE, MONG_USEERNAME, MONGO_PASSWORD);
  LOG(`Connecting to MongoDB: ${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`);
  await mongoDB.connect();

  const mysql = new MySQL();
  await mysql.connect();
  LOG(`Connected to MySQL`)

  // Create an instance of the Services class and store it in the services variable
  const services = Services.getInstance(mongoDB, mysql);


  // Set up the express API and socket.io server
  LOG(`Setting up API`);
  const { expressApi, socketIo } = setupAPI();
  services.setExpress(expressApi);
  services.setSocketIo(socketIo);

  // Set up the router
  LOG(`Setting up router`);
  RouterService.getInstance(services);
};

// Run the bootstrap function and log any errors that may occur
bootstrap().catch(err =>
{
  console.error(err);
});
