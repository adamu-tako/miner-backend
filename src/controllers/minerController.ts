import { NextFunction, Request, Response } from "express";
import { Miners } from "../models/Miners";
import ApiError from "../helpers/ApiError";
import { IUser } from "../models/interfaces/IUser";
import { Op, WhereOptions } from "sequelize";

const createMiner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqInput = req.body;
    const { userId } = req.userInfo as IUser;
    reqInput.createdBy = userId;

    const miner = await Miners.create(reqInput);

    if (miner.get()) {
      res.send(miner.get());
    } else {
      throw new ApiError(500, "Unable to create miner");
    }
  } catch (error) {
    next(error);
  }
};

// const getMiner = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { searchTerm = "" } = req.body;
//     const { userId, role } = req.userInfo as IUser;
//     const getOptions: WhereOptions = {};

//     if (role === ("USER" || "ADMIN")) {
//       getOptions.userId = userId;
//     }

//     const miners = await Miners.findAll({
//       where: {
//         ...getOptions,
//         fullName: {
//           [Op.substring]: searchTerm,
//         },
//       },
//       replacements: {
//         name: searchTerm
//           ?.split(" ")
//           .map((word: string) => `*${word.trim()}*`)
//           .filter((word: string) => word.length > 2)
//           .join(" "),
//       },
//     });

//     if (miners.length) {
//       res.send(miners);
//     } else {
//       throw new ApiError(500, "Unable to fetch miners");
//     }
//   } catch (error) {
//     next(error);
//   }
// };

const getMiner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { searchTerm = "", limit = 10, page = 1 } = req.body;
    const { userId, role } = req.userInfo as IUser;
    const getOptions: WhereOptions = {};

    if (role === "USER" || role === "ADMIN") {
      getOptions.userId = userId;
    }

    const offset = (page - 1) * limit;

    const { rows: miners, count } = await Miners.findAndCountAll({
      where: {
        ...getOptions,
        fullName: {
          [Op.substring]: searchTerm,
        },
      },
      limit: Number(limit),
      offset,
      replacements: {
        name: searchTerm
          ?.split(" ")
          .map((word: string) => `*${word.trim()}*`)
          .filter((word: string) => word.length > 2)
          .join(" "),
      },
    });

    if (miners.length) {
      res.send({ miners, count });
    } else {
      throw new ApiError(500, "Unable to fetch miners");
    }
  } catch (error) {
    next(error);
  }
};

export default { createMiner, getMiner };
