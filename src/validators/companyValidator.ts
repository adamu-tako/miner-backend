/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import httpStatus from "http-status";
import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import ApiError from "../helpers/ApiError";

export default class CompanyValidator {
  async companyCreateValidator(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // create schema object
    const schema = Joi.object({
      companyName: Joi.string().required(),
      companyType: Joi.string().required(),
      companyAddress: Joi.string().required(),
    });

    // schema options
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);

    if (error) {
      // on fail return comma separated errors
      const errorMessage = error.details
        .map((details) => details.message)
        .join(", ");
      next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    } else {
      // on success replace req.body with validated value and trigger next middleware function
      req.body = value;
      return next();
    }
  }
}
