import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import AppError from "../lib/app-error";
import { createJwtToken, getHashedPassword, isCorrectPassword } from "../lib/utils";

type UserAuthPayload = Pick<Prisma.UserCreateInput, "username" | "password">;

export async function login(authCredentials: UserAuthPayload) {
  const user = await prisma.user.findUnique({
    where: {
      username: authCredentials.username,
    },
  });

  let isValid = false;

  if (user) {
    isValid = await isCorrectPassword(authCredentials.password, user.password);
  }

  if (!isValid) throw new AppError("username or password incorrect.", 401);

  const jwtToken = await createJwtToken(user?.id as number);

  return { user, jwtToken };
}

export async function signUp(authCredentials: UserAuthPayload) {
  const isUsernameExist = await prisma.user.count({
    where: {
      username: authCredentials.username,
    },
  });

  if (isUsernameExist) {
    throw new AppError("username is exists", 400);
  }

  const hashedPassword = await getHashedPassword(authCredentials.password);

  const newUser = await prisma.user.create({
    data: {
      username: authCredentials.username,
      password: hashedPassword,
    },
  });

  const jwtToken = await createJwtToken(newUser.id);

  return { newUser, jwtToken };
}
