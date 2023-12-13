/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import ApiError from "../helpers/ApiError";
import { IUser } from "../models/interfaces/IUser";
import dontenv from "dotenv";
import jwt, { verify } from "jsonwebtoken";
import { User } from "../models/User";
import { Token } from "../models/Token";
dontenv.config();
const SecretKey = process.env.SECRET_KEY;

declare global {
  namespace Express {
    interface Request {
      userInfo?: IUser;
    }
  }
}

export const verifyToken = async (token: string): Promise<any> => {
  try {
    const payload: any = await jwt.verify(token, SecretKey as string);
    return payload;
  } catch (error) {
    throw new Error("Token not found");
  }
};

export const auth =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mainToken = req.headers.authorization;

      if (!mainToken) {
        throw new ApiError(403, "Malformed Request: Token not provided");
      }

      console.log("mainToken:", mainToken);
      const authToken = mainToken ? mainToken.split(" ")[1] : "";
      console.log("authToken:", authToken);
      const secret = `${process.env.SECRET_KEY}`;
      const userData = verify(authToken, secret) as IUser;
      const { userId } = userData;

      const user = await User.findByPk(userId);

      if (!user) {
        throw new ApiError(403, "User not authorized");
      }

      // const authenticatedUser = await Token.findOne({
      //   where: {
      //     userId,
      //     token: authToken,
      //   },
      // });

      const payload = verifyToken(authToken);

      if (!payload) {
        throw new ApiError(403, "User not authenticated");
      }

      req.userInfo = user;

      next();
    } catch (err) {
      next(err);
    }
  };
