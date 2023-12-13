import { NextFunction, Request, Response } from "express";
import { Miners } from "../models/Miners";
import { Company } from "../models/Company";
import ApiError from "../helpers/ApiError";

const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqInput = req.body;

    const company = await Company.create(reqInput);

    if (company.companyName) {
      res.send(reqInput);
    } else {
      throw new ApiError(500, "Unable to create company");
    }
  } catch (error) {
    next(error);
  }
};

export default { createCompany };
