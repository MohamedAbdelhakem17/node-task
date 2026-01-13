/**
 * Token management utilities using JSON Web Tokens (JWT).
 *
 * Provides methods to create, verify, and decode tokens.
 * Reads secret from `process.env.JWT_SECRET`; methods will throw if the secret is not configured.
 *
 * @module libs/util/mange-token
 */
import jwt from "jsonwebtoken";

class TokenManager {
  constructor(secret = "JWT_SECRET") {
    this._jwtSecret = process.env.JWT_SECRET || secret;
  }

  /**
   * Create a signed JWT.
   *
   * @param {object} payload - The payload to sign into the token.
   * @param {import('jsonwebtoken').SignOptions} [options] - Optional sign options (expiresIn, audience, issuer, etc.).
   * @returns {string} Signed JWT.
   * @throws {Error|TypeError} If secret is missing or payload is invalid.
   */
  createToken(payload, options = {}) {
    if (!this._jwtSecret) {
      throw new Error("JWT secret is not configured (process.env.JWT_SECRET)");
    }

    if (!payload || typeof payload !== "object") {
      throw new TypeError("Payload must be a non-empty object");
    }

    if (!options.expiresIn) options.expiresIn = "8h";

    return jwt.sign(payload, this._jwtSecret, options);
  }

  /**
   * Verify and decode a JWT, throwing on invalid or expired tokens.
   *
   * @param {string} token - The JWT string to verify.
   * @returns {object|string} Decoded token payload.
   * @throws {Error} When verification fails or token is malformed.
   */
  verifyToken(token) {
    if (!this._jwtSecret) {
      throw new Error("JWT secret is not configured (process.env.JWT_SECRET)");
    }

    if (!token || typeof token !== "string") {
      throw new TypeError("Token must be a string");
    }

    try {
      return jwt.verify(token, this._jwtSecret);
    } catch (err) {
      const message =
        err && err.message ? err.message : "Token verification failed";
      const error = new Error(message);
      error.name = err && err.name ? err.name : "JsonWebTokenError";
      throw error;
    }
  }

  /**
   * Decode a JWT without verification. Useful for reading untrusted payloads.
   *
   * @param {string} token - The JWT string to decode.
   * @returns {object|null} Decoded payload or null if decoding fails.
   */
  decodeToken(token) {
    if (!token || typeof token !== "string") return null;
    return jwt.decode(token);
  }
}

const tokenManager = new TokenManager();

export default tokenManager;
