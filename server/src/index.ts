// Start Express Server

require("dotenv").config();
require("reflect-metadata");
const express = require("express");
import { createConnection } from "typeorm";
import Item from "./entities/Item";
import User from "./entities/User";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { UserResolver } from "./resolvers/User";
import { ItemResolver } from "./resolvers/Item";

/**
 * TypeScript need main asysnc function
 */

const main = async () => {
  const app = express();

  /**
   * Database Connection
   */
    await createConnection({
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
  console.log("Database Connected");

  /**
   * Apollo Server
   */
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver,ItemResolver],
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  /**
   * Start Express Server
   */
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is on http://localhost:${PORT} and graphql at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
};

main().catch((error) => console.log(error));
