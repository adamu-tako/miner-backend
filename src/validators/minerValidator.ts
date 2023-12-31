/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import httpStatus from "http-status";
import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import ApiError from "../helpers/ApiError";

// firstName: string;
//   lastName: string;
//   address?: string;
//   companyName?: string;
//   companyId?: string;
//   jobTitle?: string;
//   phoneNumber?: string;

export default class MinerValidator {
  async minerCreateValidator(req: Request, res: Response, next: NextFunction) {
    // create schema object
    const schema = Joi.object({
      fullName: Joi.string().required(),
      phoneNumber: Joi.string()
        .regex(/^[0-9]{10}$/)
        .messages({
          "string.pattern.base": `Phone number must have 10 digits.`,
        })
        .required(),
      state: Joi.string().required(),
      lga: Joi.string().required(),
      ward: Joi.string().required(),
      address: Joi.string().required(),
      experience: Joi.string().required(),
      companyName: Joi.string().required(),
      guarantor: Joi.string(),
      guarantorPhone: Joi.string()
        .regex(/^[0-9]{10}$/)
        .messages({
          "string.pattern.base": `Guarantor's phone number must have 10 digits.`,
        }),
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
