import { ApolloServer } from "@apollo/server"
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { expressMiddleware } from '@apollo/server/express4';
import { readFileSync } from "fs";
import resolvers from "./resolvers/resolver.js";
import config from "./config/config.js";
import express from 'express';
import cors from 'cors';
import xssClean from 'xss-clean';

const app = express();
// const httpServer = http.createServer(app);
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
//  app.use(helmet());
 app.use('/graphql', cors<cors.CorsRequest>({origin:config.APP_ORIGINS}), express.json(), expressMiddleware(server));


export default app;
