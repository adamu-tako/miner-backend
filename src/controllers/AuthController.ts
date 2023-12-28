import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/interfaces/IUser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { logger } from "../helpers/logger";
import dotenv from "dotenv";
import { sequelizeTr } from "../config/sequelize";
import { Token } from "../models/Token";
import ApiError from "../helpers/ApiError";
import { Op } from "sequelize";
import { errorHandler } from "../middlewares/error";
dotenv.config();
const SecretKey = process.env.SECRET_KEY;

const register = async (req: Request, res: Response) => {
  const transaction = await sequelizeTr();

  try {
    const { firstName, lastName, email, password, address, phoneNumber, role } =
      req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = await User.create(
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        address,
        phoneNumber,
        role,
      },
      { transaction }
    );

    const token = jwt.sign({ userId: newUser.userId }, SecretKey as string, {
      expiresIn: "7d",
    });

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    const { userId } = newUser;

    const tokenValue = token.split(" ")[1];

    await Token.create(
      {
        token: tokenValue,
        userId: userId as string,
        type: "SIGNUP",
        expires: expirationDate,
        blacklisted: false,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(httpStatus.CREATED).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          userId: newUser.userId,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
      },
      tokens: {
        access: token,
        expires: expirationDate,
      },
    });
  } catch (error) {
    logger.error(error);
    await transaction.rollback();
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal Server Error",
      error: error,
    });
  }
};

const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, address, phoneNumber, role } =
    req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      throw {
        status: httpStatus.BAD_REQUEST,
        message: "Email is already registered",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address,
      phoneNumber,
      role,
    });

    res.status(httpStatus.CREATED).json({
      status: "success",
      message: "User created successfully",
      data: {
        user: {
          userId: newUser.userId,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
          address: newUser.address,
          phoneNumber: newUser.phoneNumber,
          createdAt: newUser.createdAt,
        },
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal Server Error",
      error: error,
    });
  }
};
// const checkEmail = async (req: Request, res: Response) => {
//   try {
//     const isExists = await userService.isEmailExists(
//       req.body.email.toLowerCase()
//     );
//     res.status(isExists.statusCode).send(isExists.response);
//   } catch (e) {
//     logger.error(e);
//     res.status(httpStatus.BAD_GATEWAY).send(e);
//   }
// };

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password: passwordInput, keepSignedIn } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: email as string }],
        // isDisabled: false,
      },
    });

    if (!user) {
      throw new ApiError(401, "Incorrect email or password");
    }

    bcrypt.compare(passwordInput, user.password as string, (err, result) => {
      if (err || !result) {
        throw new ApiError(401, "User not authenticated!");
      }
    });

    const { userId } = user;
    const expiresIn = keepSignedIn ? "300d" : "7d";
    const expirationDays = keepSignedIn ? 300 : 7;

    const token = jwt.sign({ userId: userId }, SecretKey as string, {
      expiresIn: expiresIn,
    });
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);

    const tokenValue = token.split(" ")[1];

    await Token.create({
      token: tokenValue,
      userId: userId as string,
      type: "LOGIN",
      expires: expirationDate,
      blacklisted: false,
    });

    const { password, ...rest } = user.get();

    res.status(httpStatus.OK).send({ rest, token });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

const logout = async (req: Request, res: Response) => {
  res.status(httpStatus.NO_CONTENT).send();
};

// const refreshTokens = async (req: Request, res: Response) => {
//   try {
//     const refreshTokenDoc = await this.tokenService.verifyToken(
//       req.body.refresh_token,
//       tokenTypes.REFRESH
//     );
//     const user = await userService.getUserByUuid(
//       refreshTokenDoc.user_uuid
//     );
//     if (user == null) {
//       res.status(httpStatus.BAD_GATEWAY).send("User Not Found!");
//     }
//     if (refreshTokenDoc.id === undefined) {
//       return res.status(httpStatus.BAD_GATEWAY).send("Bad Request!");
//     }
//     await this.tokenService.removeTokenById(refreshTokenDoc.id);
//     const tokens = await this.tokenService.generateAuthTokens(user);
//     res.send(tokens);
//   } catch (e) {
//     logger.error(e);
//     res.status(httpStatus.BAD_GATEWAY).send(e);
//   }
// };

// const changePassword = async (req: Request, res: Response) => {
//   try {
//     const responseData = await this.userService.changePassword(req);
//     res.status(responseData.statusCode).send(responseData.response);
//   } catch (e) {
//     logger.error(e);
//     res.status(httpStatus.BAD_GATEWAY).send(e);
//   }
// };

export default {
  register,
  logout,
  createUser,
  login,
};
