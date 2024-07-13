import AppError from "../lib/app-error";
import { catchAsyncError, setTokenCookieOnResponse } from "../lib/utils";
import * as authService from "../services/auth.service";

export const login = catchAsyncError(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) return next(new AppError("You must specify username and password", 400));

  const { user, jwtToken } = await authService.login({ username, password });

  setTokenCookieOnResponse(res, jwtToken as string);

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user?.id,
        username: user?.username,
      },
      token: jwtToken,
    },
  });
});

export const signup = catchAsyncError(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) return next(new AppError("You must specify username and password", 400));

  const { newUser, jwtToken } = await authService.signUp({ username, password });

  setTokenCookieOnResponse(res, jwtToken as string);

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: newUser.id,
        username: newUser.username,
      },
      token: jwtToken,
    },
  });
});
