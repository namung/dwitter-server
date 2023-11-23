import { config } from "../config.js";
import SQ from "sequelize";

const { host, user, password, database, port } = config.db;

export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  port,
  dialect: "mysql",
  logging: false,
});
