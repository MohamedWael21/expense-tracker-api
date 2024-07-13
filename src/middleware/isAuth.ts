import { JwtPayload } from "jsonwebtoken";
import prisma from "../config/database";
import AppError from "../lib/app-error";
import { catchAsyncError, isValidToken } from "../lib/utils";

const isAuth = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) return next(new AppError("You must log in first", 401));

  const tokenPayload: JwtPayload = await isValidToken(token);

  const user = await prisma.user.findUnique({
    where: {
      id: tokenPayload.userId as number,
    },
  });

  if (!user) {
    return next(new AppError("You are not auth", 401));
  }
  req.userId = user.id;

  next();
});

export default isAuth;
