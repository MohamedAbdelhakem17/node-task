/**
 * Application route definitions.
 * Each route contains a base path and a dynamic import path for its router module.
 *
 * @type {Array<{
 *   path: string,
 *   routerPath: string
 * }>}
 */
const routes = [
  { path: "/api/v1/auth", routerPath: "./auth-routes/auth.route.js" },
];

/**
 * Registers application routes using dynamic imports.
 *
 * This function dynamically imports each router module defined in the routes array
 * and attaches it to the Express application instance.
 *
 * @async
 * @function amountRoutes
 * @param {import("express").Express} app - The Express application instance.
 * @returns {Promise<void>} Resolves when all routes are registered.
 *
 * @example
 * import express from "express";
 * import amountRoutes from "./routes.js";
 *
 * const app = express();
 * await amountRoutes(app);
 */

const amountRoutes = async (app) => {
  for (const { path, routerPath } of routes) {
    const module = await import(routerPath);

    app.use(path, module.default);
  }
};

export default amountRoutes;
