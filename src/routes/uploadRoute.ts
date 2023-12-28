import { Router } from "express";
import { auth } from "../middlewares/auth";
import upoloadController from "../controllers/UploadController";
import { upload, uploadMultiple } from "../middlewares/upload";

const router = Router();

router.post(
  "/upload-image",
  auth(),
  uploadMultiple,
  upoloadController.uploadImage
);

export default router;
