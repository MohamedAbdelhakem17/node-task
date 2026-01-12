import asyncHandler from "express-async-handler";

import HTTP_STATUS from "../libs/constants/http-status.constant.js";
import tokenManager from "../libs/util/mange-token.js";
import UserModel from "../models/user/user.schema.js";
import AppError from "./../libs/util/app-error.js";

const protect = asyncHandler(async (req, res, next) => {
  const authorizationHeader =
    req.header("authorization") || req.header("Authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new AppError(
      401,
      HTTP_STATUS.ERROR,
      "You are not logged in. Please log in to access this route."
    );
  }

  const token = authorizationHeader.split(" ")[1];
  console.log(token);

  const tokenDecoded = tokenManager.verifyToken(token);

  const user = await UserModel.findById(tokenDecoded._id);

  if (!user)
    throw new AppError(
      404,
      HTTP_STATUS.ERROR,
      "The user that belongs to this token no longer exists."
    );

  // const passChangedTimestamp = Math.floor(user.updatedAt.getTime() / 1000);

  // if (passChangedTimestamp > tokenDecoded.iat)
  //   throw new AppError(
  //     401,
  //     HTTP_STATUS.ERROR,
  //     "User recently changed their password. Please log in again."
  //   );

  req.user = user;
  next();
});

export default protect;
