import multer from "multer";
import ApiError from "../helpers/ApiError";

const storage = multer.memoryStorage();
const Upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5mb
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpe?g)$/i)) {
      cb(
        new ApiError(
          400,
          `${file.originalname} has an invalid format. Allowed formats are png, jpg or jpeg`
        )
      );
    }
    cb(null, true);
  },
});

export const upload = Upload.single("file");
export const uploadMultiple = Upload.array("files", 5);
