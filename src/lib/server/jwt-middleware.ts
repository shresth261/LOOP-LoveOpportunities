import { createMiddleware } from "@tanstack/react-start";
// @ts-ignore
import { getCookie } from "vinxi/http";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_development_secret_do_not_use_in_prod";

export const jwtAuthMiddleware = createMiddleware().server(async ({ next }) => {
  const token = getCookie("auth_token");

  let user = null;
  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // invalid token
    }
  }

  return await next({
    context: {
      user,
    },
  });
});

export const requireAuth = createMiddleware().server(async ({ next }) => {
  const token = getCookie("auth_token");
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    return await next({
      context: {
        user,
      },
    });
  } catch (err) {
    throw new Error("Unauthorized");
  }
});
