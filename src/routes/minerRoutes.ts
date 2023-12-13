import { Router } from "express";
import { auth } from "../middlewares/auth";
import minerController from "../controllers/minerController";
import MinerValidator from "../validators/minerValidator";

const router = Router();

const minerValidator = new MinerValidator();

router.post(
  "/create",
  auth(),
  minerValidator.minerCreateValidator,
  minerController.createMiner
);
// router.post(
//   "/create",
//   auth(),
//   userValidator.userCreateValidator,
//   authController.createUser
// );

export default router;
