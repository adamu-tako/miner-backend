import { NextFunction, Request, Response } from "express";
import { Miners } from "../models/Miners";
import ApiError from "../helpers/ApiError";

const createMiner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqInput = req.body;

    const miner = await Miners.create(reqInput);

    if (miner.minerId) {
      res.send(reqInput);
    } else {
      throw new ApiError(500, "Unable to create miner");
    }
  } catch (error) {
    next(error);
  }
};

export default { createMiner };
