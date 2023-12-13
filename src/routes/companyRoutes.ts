import { Router } from "express";
import { auth } from "../middlewares/auth";
import companyController from "../controllers/companyController";
import CompanyValidator from "../validators/companyValidator";

const router = Router();

const companyValidator = new CompanyValidator();

router.post(
  "/create",
  auth(),
  companyValidator.companyCreateValidator,
  companyController.createCompany
);
// router.post(
//   "/create",
//   auth(),
//   userValidator.userCreateValidator,
//   authController.createUser
// );

export default router;
