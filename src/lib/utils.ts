import bcrypt from "bcrypt";
import { sub } from "date-fns";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "./app-error";

// eslint-disable-next-line no-unused-vars
enum FILTER_DATE {
  // eslint-disable-next-line no-unused-vars
  LAST_THREE_MONTH,
  // eslint-disable-next-line no-unused-vars
  LAST_MONTH,
  // eslint-disable-next-line no-unused-vars
  PAST_WEEK,
}

export const catchAsyncError = (handleFunc: AsyncRequestHandler) => (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  Promise.resolve(handleFunc(req, res, next)).catch(next);
};

export async function getHashedPassword(password: string) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

export async function isCorrectPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export function signToken(userId: number) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      {
        expiresIn: "3d",
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      },
    );
  });
}

export async function createJwtToken(userId: number) {
  const token = await signToken(userId);

  return token;
}

export function setTokenCookieOnResponse(res: ExpressResponse, token: string) {
  const secureCookie = process.env.NODE_ENV === "production";

  res.cookie("authToken", token, {
    maxAge: 3 * 24 * 60 * 60 * 1000, // expire 3 days after now
    httpOnly: true,
    secure: secureCookie,
    sameSite: "lax",
  });
}

function verifyToken(token: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as JwtPayload);
      }
    });
  });
}

export async function isValidToken(token: string): Promise<JwtPayload> {
  return await verifyToken(token);
}

export function getPastDateFromFilteredQuery(filteredQuery: FILTER_DATE) {
  let pastDate: Date;
  switch (filteredQuery) {
    case FILTER_DATE.LAST_MONTH:
      pastDate = sub(new Date(), { months: 1 });
      break;
    case FILTER_DATE.LAST_THREE_MONTH:
      pastDate = sub(new Date(), { months: 3 });
      break;
    case FILTER_DATE.PAST_WEEK:
      pastDate = sub(new Date(), { days: 7 });
      break;
    default:
      throw new AppError(`UnSupported Filter: ${filteredQuery}`, 400);
  }
  return pastDate;
}

export function createFilteredQuery(dateQuery: string) {
  let filteredDate: FILTER_DATE;

  switch (dateQuery.toLowerCase().replace(/-/gi, " ")) {
    case "last 3 month":
      filteredDate = FILTER_DATE.LAST_THREE_MONTH;
      break;
    case "last month":
      filteredDate = FILTER_DATE.LAST_MONTH;
      break;
    case "past week":
      filteredDate = FILTER_DATE.PAST_WEEK;
      break;
    default:
      throw new AppError(`UnSupported Filter: ${dateQuery}`, 400);
  }

  return filteredDate;
}
