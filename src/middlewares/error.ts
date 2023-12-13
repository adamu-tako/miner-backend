import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import ApiError from "../helpers/ApiError";
import { logger } from "../helpers/logger";
import dotenv from "dotenv";
dotenv.config();
const nodeEnv = process.env.NODE_ENV || "development";

// eslint-disable-next-line no-unused-vars
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let { statusCode, message } = err;

  //   if (nodeEnv === "production" && !err.isOperational) {
  //     statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  //     message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  //   }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(nodeEnv === "development" && { stack: err.stack }),
  };

  if (nodeEnv === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode
      ? httpStatus.BAD_REQUEST
      : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  errorHandler(error, req, res, next);
  next(error);
};
