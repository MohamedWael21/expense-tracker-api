import { NextFunction } from "express";
import AppError from "./app-error";

export default function (err: AppError, req: ExpressRequest, res: ExpressResponse, _: NextFunction) {
  err.statusCode = err.statusCode || 500;
  return res.status(err.statusCode).json({
    status: "error",
    error: {
      message: err.message,
    },
  });
}
