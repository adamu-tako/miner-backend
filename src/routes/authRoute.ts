import { Router } from "express";
import authController from "../controllers/AuthController";
import UserValidator from "../validators/UserValidator";
import { auth } from "../middlewares/auth";

const router = Router();

const userValidator = new UserValidator();

router.post(
  "/register",
  userValidator.userCreateValidator,
  authController.register
);
router.post(
  "/create",
  auth(),
  userValidator.userCreateValidator,
  authController.createUser
);
router.post("/login", userValidator.userLoginValidator, authController.login);
// router.post("/refresh-token", authController.refreshTokens);
router.post("/logout", authController.logout);
// router.put(
//   "/change-password",
//   auth(),
//   userValidator.changePasswordValidator,
//   authController.changePassword
// );

export default router;
