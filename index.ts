import express, { type Application, type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import http from "http";
import cors from "cors"
import { initDB } from "./app/common/services/database.service";
import { initPassport } from "./app/common/services/passport-jwt.service";
import { loadConfig } from "./app/common/helper/config.hepler";
import errorHandler from "./app/common/middleware/error-handler.middleware";
import routes from "./app/routes";
import limiter from "./app/common/middleware/rate-limiter.middleware";
import { ApolloServer } from '@apollo/server';
import { typeDefs } from './app/graphql';
import { resolvers } from './app/graphql/resolvers';
import { prisma } from './app/graphql/prismaClient';
import {expressMiddleware} from "@apollo/server/express4"
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PubSub } from 'graphql-subscriptions';
import { ApolloServerExpressConfig } from 'apollo-server-express/dist/ApolloServer';


loadConfig();

declare global {
  namespace Express {
  }
}

const port = Number(process.env.PORT) ?? 5000;


const app: Application = express();



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());




const initApp = async (): Promise<void> => {


const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({ schema });
await server.start(); // Start Apollo Server before using it in Express
app.use(
  "/graphql",
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }: { req: Request }) => {
      return { user: req.user ?? null };
    },
  })
);
  // init mongodb
  //await initDB();
  //await server.start();
  // passport init
  //initPassport();
  //Rate Limiter
  app.use(limiter);
  // set base path to /api
  //app.use("/api", routes);

  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });



  // error handler
  app.use(errorHandler);
  http.createServer(app).listen(port, () => {
    console.log("Server is runnuing on port", port);
  });
};

void initApp();
