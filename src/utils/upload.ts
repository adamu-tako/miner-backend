import { promisify } from "util";
import fs from "fs";
import path from "path";
import {
  extractExtension,
  makeDirRecursive,
  relativeToAbsolutePath,
} from "./file";
import { Images } from "../models/Images";
import ApiError from "../helpers/ApiError";

// const cloudinary = require("cloudinary").v2;
// const streamifier = require("streamifier");

const writeToFile = promisify(fs.writeFile);

interface ISave {
  key?: "minerId" | "compnayId";
  minerId?: string;
  companyId?: string;
}

// export const uploadImagesToCloud = async (files) => {
//   let result;

//   // if files is not an array
//   if (null == files.length) {
//     result = await streamUpload(files.buffer);
//     return result;
//   }

//   result = [];
//   for (let i = 0; i < files.length; i++) {
//     const current = files[i];
//     const res = await streamUpload(current.buffer);

//     if (res) {
//       result.push(res);
//     }
//   }

//   return result;
// };

// const streamUpload = (buffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream((err, result) => {
//       if (result) {
//         resolve(result);
//       } else {
//         reject(err);
//       }
//     });

//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };

export const saveImage = async (data: ISave, image: any) => {
  try {
    const ext = extractExtension(image.originalname);

    let filePath;
    const fileName = `${Date.now()}.${ext}`;

    if (data.minerId) {
      filePath = `uploads/miners/${data.minerId}_${fileName}`;
    } else if (data.companyId) {
      filePath = `uploads/companyId/${data.companyId}_${fileName}`;
    }

    const absoluteDestFileName = relativeToAbsolutePath(filePath as string);
    await makeDirRecursive(path.dirname(absoluteDestFileName));

    await writeToFile(absoluteDestFileName, image.buffer);

    return await Images.create({
      localURL: filePath as string,
      ...data,
    });
  } catch (error: any) {
    throw error.message;
  }
};

export const saveMultipleImages = async (data: ISave, images: any) => {
  const savedImages: any = [];
  for (let i = 0; i < images.length; i++) {
    const savedImage = await saveImage(data, images[i]);
    savedImages.push(savedImage);
  }

  return savedImages;
};
