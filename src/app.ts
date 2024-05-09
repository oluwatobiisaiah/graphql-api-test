import { ApolloServer } from "@apollo/server"
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { expressMiddleware } from '@apollo/server/express4';
import { readFileSync } from "fs";
import resolvers from "./resolvers/resolver.js";
import config from "./config/config.js";
import express from 'express';
import cors from 'cors';
import xssClean from 'xss-clean';

import mongoose from "mongoose";

const app = express();
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
 });
 await server.start();
 app.use(xssClean());
 app.use('/graphql', cors<cors.CorsRequest>({origin:config.APP_ORIGINS}), express.json(), expressMiddleware(server));

 (async () => {
     try {
        const connection = await mongoose.connect(config.DATABASE_URI);
        // app.listen(config.APP_PORT, () => {
        //    console.log(`🚀 Server ready at ${config.APP_PORT}`);
        // });
     } catch (error) {
        console.log("Unable to start server", error);
     }
  })()
export default app;
