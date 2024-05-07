import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { expressMiddleware } from '@apollo/server/express4';
import { readFileSync } from "fs";
import mongoose from "mongoose";
import resolvers from "./resolvers/resolver.js";
import config from "./config/config.js";
import express from 'express';
import http from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import cors from 'cors';
import xssClean from 'xss-clean';
import helmet from 'helmet';

const app = express();
const httpServer = http.createServer(app);
const typeDefs = readFileSync('./schema.gql', { encoding: 'utf-8' });

const server = new ApolloServer({ typeDefs, resolvers,
   formatError: (formattedError, error) => {
      if (formattedError.extensions.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED) {
        return {
          ...formattedError,
          message: "Your query doesn't match the schema. Try double-checking it!",
        };
      }
      if (formattedError.extensions.code === ApolloServerErrorCode.INTERNAL_SERVER_ERROR) {
         console.log(error)
        return {
          message: "Sorry, something went wrong. Please try again later.",
        };
      }
      return formattedError;
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), ApolloServerPluginLandingPageLocalDefault()],
 });
 await server.start();
 app.use(helmet());
 app.use(xssClean());
 app.disable("x-powered-by");
app.use(
  '/graphql',
  cors<cors.CorsRequest>({ origin: config.APP_ORIGINS }),
  express.json(),
  expressMiddleware(server),
);


(async (resolve) => {
   try {
      const connection = await mongoose.connect(config.DATABASE_URI);
      await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
      console.log(`🚀 Server ready at http://localhost:4000/graphql`);
      // const { url } = await startStandaloneServer(server, {
      //    listen: { port: config.APP_PORT },
      // });
      // console.log(`🚀Server ready`);
   } catch (error) {
      console.log("Unable to start server", error);
   }
})()
