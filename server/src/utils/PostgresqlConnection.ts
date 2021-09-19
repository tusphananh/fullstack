import { createConnection } from "typeorm";
import Item from "../entities/Item";
import User from "../entities/User";

export const postgresqlConnection = async () => {
  try {
    const connection = await createConnection({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      entities: [User, Item],
    });

    return connection;
  } catch (error) {
    console.log(error);
    return null;
  }
};
