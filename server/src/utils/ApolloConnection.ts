import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { UserResolver } from "../resolvers/UserResolver";
import { ItemResolver } from "../resolvers/ItemResolver";
import { Context } from "../types/Context";

export const ApolloConnection = async () => {
  try {
    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [UserResolver, ItemResolver],
        validate: false,
      }),
      context: ({ req, res }): Context => ({ req, res }),
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });
    return apolloServer;
  } catch (error) {
    console.log(error);
    return null;
  }
};
