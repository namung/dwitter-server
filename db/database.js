import { config } from "../config.js";
import SQ from "sequelize";

const { host, user, database } = config.db;

export const sequelize = new SQ.Sequelize(database, user, null, {
  host,
  dialect: "mysql",
  logging: false,
});
