import authRouter from "./auth.route";
import express from "express";
import expnesesRouter from "./expenses.route";

const rootRouter = express.Router();

rootRouter.use(authRouter);
rootRouter.use("/api/expenses", expnesesRouter);
export default rootRouter;
