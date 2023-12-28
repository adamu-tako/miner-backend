import { NextFunction, Request, Response } from "express";
import ApiError from "../helpers/ApiError";
import { saveMultipleImages } from "../utils/upload";

declare module "express" {
  interface Request {
    files?: any;
  }
}

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { files, body } = req;

    if (!files || files.length < 1) {
      throw new ApiError(400, "No Image Selected");
    }

    const images = await saveMultipleImages(body, files);

    res.status(200).json({ success: true, images });
  } catch (error) {
    next(error);
  }
};

export default { uploadImage };
