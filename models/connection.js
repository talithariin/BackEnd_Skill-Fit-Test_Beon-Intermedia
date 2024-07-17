import mysql from "mysql2";
import dbConfig from "../configs/db.config.js";

const connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DATABASE,
  port: dbConfig.PORT,
});

export default connection;
