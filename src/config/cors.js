import AppError from "../libs/util/app-error.js";

const allowedOrigins = (process.env.CORS_ORIGINS || "").split(",");

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new AppError("Not Allowed By CORS"));
    }
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

export default corsOptions;
