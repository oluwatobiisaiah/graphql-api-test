"use strict";
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';

import app from "../app.js";

export const handler = startServerAndCreateLambdaHandler(
  app,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
);
