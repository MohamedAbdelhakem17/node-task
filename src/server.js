import path from "node:path";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import morgan from "morgan";

import corsOptions from "./config/cors.js";
import databaseConnect from "./config/database-connection.js";
import { schema } from "./graphql/schema.js";
import HTTP_STATUS from "./libs/constants/http-status.constant.js";
import AppError from "./libs/util/app-error.js";
import globalErrorHandler from "./middlewares/global-error.middlewares.js";
import protect from "./middlewares/protect.middleware.js";
import amountRoutes from "./routes/index.js";

// ====== Load Environment Variables ======
dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

// ====== Express instants  ======
const app = express();

// ====== Database Connection ======
databaseConnect();

// ====== Middleware ======
if (process.env.ENVIRONMENT_MODE === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

//  CORS
app.use(cors(corsOptions));

// API  Routes
await amountRoutes(app);

// Graphql
app.use(
  "/graphql",
  protect,
  cors({
    origin: true,
    credentials: true,
  }),
  graphqlHTTP(async (req) => {
    return {
      schema,
      context: { user: req.user },
      graphiql: true,
    };
  })
);

//  Not Found Handler
app.use((req, res, next) => {
  next(
    new AppError(
      404,
      HTTP_STATUS.ERROR,
      `This route ${req.originalUrl} not found.`
    )
  );
});

//  Global Error Handler
app.use(globalErrorHandler);

// ====== Start Server ======
const PORT = process.env.PORT || 7000;
const server = app.listen(PORT, () => {
  console.log(
    `Server running on port: ${PORT} in ${process.env.ENVIRONMENT_MODE} mode`
  );
});

// ====== Handle Unhandled Promise Rejections ======
process.on("unhandledRejection", (error) => {
  console.error(`Unhandled Rejection: ${error.name} | ${error.message}`);
  server.close(() => process.exit(1));
});
