import mongoose from "mongoose";

/**
 * Connect to the MongoDB database using Mongoose.
 *
 * Reads the connection string from `process.env.DATABASE_CONNECTION_STRING`.
 * Logs a success message on successful connection and rethrows errors when connection fails.
 *
 * @async
 * @function databaseConnect
 * @returns {Promise<void>} Resolves when database connection is established.
 */

const databaseConnect = async () => {
  const connection = await mongoose.connect(
    process.env.DATABASE_CONNECTION_STRING
  );
  console.log(`Database connected successfully: ${connection.connection.host}`);
};

export default databaseConnect;
