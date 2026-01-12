import HTTP_STATUS from "../libs/constants/http-status.constant.js";
import AppError from "../libs/util/app-error.js";

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      process.env.ENVIRONMENT_MODE === "development" &&
      (origin.includes("localhost") || origin.includes("127.0.0.1"))
    ) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new AppError(403, HTTP_STATUS.FAIL, "Not Allowed By CORS"));
    }
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],

  exposedHeaders: ["set-cookie"],
};

export default corsOptions;
