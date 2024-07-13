import "dotenv/config";
import express from "express";
import morgan from "morgan";
import globalErrorHandler from "./lib/global-error-handler";
import cookieParser from "cookie-parser";
import rootRouters from "./routes";

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());

app.use(rootRouters);

app.use(globalErrorHandler);
export default app;
