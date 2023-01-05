require("dotenv").config();
import { MongoDb } from "@dodgeball/mongodb";
import debug from "debug";
import setupAPI from "./api/setupAPI";
import RouterService from "./RouterServices";
import Services from "./Services";
import {
  MONGO_DATABASE,
  MONGO_HOST,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONG_USEERNAME
} from "./util/constants";
import MySQL from "@dodgeball/mysql";

const LOG = debug("dodgeball:api:bootstrap");

const bootstrap = async () => {
  LOG("Starting bootstrap");
  const mongoDB = new MongoDb(
    MONGO_HOST,
    MONGO_PORT,
    MONGO_DATABASE,
    MONG_USEERNAME,
    MONGO_PASSWORD
  );
  LOG(`Connecting to MongoDB: ${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`);
  await mongoDB.connect();

  const mysql = new MySQL();
  await mysql.connect();
  LOG(`Connected to MySQL`);

  const services = new Services(mongoDB, mysql);

  LOG(`Setting up API`);
  const { expressApi, socketIo } = setupAPI();
  services.setExpress(expressApi);
  services.setSocketIo(socketIo);

  LOG(`Setting up router`);
  new RouterService(services);
};

bootstrap();
