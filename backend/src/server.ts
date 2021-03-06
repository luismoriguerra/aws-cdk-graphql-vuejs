import express from "express";
import { ApolloServer, PlaygroundConfig } from "apollo-server-express";
import cors from "cors";
import schema from "./schema";
import serverlessExpress from "aws-serverless-express";

const isInLambda = !!process.env.LAMBDA_TASK_ROOT;

const app = express();

let playground: PlaygroundConfig = true;

if (isInLambda) {
  playground = {
    endpoint: "/dev/graphql",
  };
}

const server = new ApolloServer({
  schema,
  playground,
});

app.use("*", cors());

server.applyMiddleware({ app });

const lambdaServer = serverlessExpress.createServer(app);
export const main = (event: any, context: any) => {
  serverlessExpress.proxy(lambdaServer, event, context);
};

if (!isInLambda) {
  app.listen({ port: 8000 }, () => {
    console.log("Apollo Server on http://localhost:8000/graphql");
  });
}
