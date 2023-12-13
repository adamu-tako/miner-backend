import express, { NextFunction, Request, Response, json } from "express";
import responseHandler from "./helpers/responseHandler";
import authRoutes from "./routes/authRoute";
import minerRoute from "./routes/minerRoutes";
import companyRoutes from "./routes/companyRoutes";
import cors from "cors";
import dontenv from "dotenv";
import { sequelize } from "./config/sequelize";
import ApiError from "./helpers/ApiError";
import httpStatus from "http-status";
import { errorHandler } from "./middlewares/error";
dontenv.config();

const app = express();
app.use(json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(
  cors({
    origin: "*",
  })
);
app.use(errorHandler);

app.use("/status", async (req: Request, res: Response) => {
  const response = responseHandler.returnSuccess(200, "Okay");

  res.status(response.statusCode).send(response.response);
});
app.use("/auth", authRoutes);
app.use("/miner", minerRoute);
app.use("/company", companyRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not foundedfkdf"));
});

const start = async (): Promise<void> => {
  try {
    await sequelize
      .authenticate()
      .then(() => {
        console.log("Connected to database");
        app.listen(4006, () => {
          console.log("Server started on port 4006");
        });
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
