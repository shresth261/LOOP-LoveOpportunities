import { createServerFn } from "@tanstack/react-start";
import { getUsersCollection } from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// @ts-ignore
import { setCookie, deleteCookie, getCookie } from "vinxi/http";

const JWT_SECRET = process.env.JWT_SECRET || "default_development_secret_do_not_use_in_prod";

export const signup = createServerFn({ method: "POST" })
  .validator((data: Record<string, string>) => {
    if (!data.email || !data.password) throw new Error("Email and password required");
    return data;
  })
  .handler(async ({ data }) => {
    const users = await getUsersCollection();
    const existing = await users.findOne({ email: data.email });
    if (existing) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const result = await users.insertOne({
      email: data.email,
      passwordHash,
      createdAt: new Date(),
    });

    const token = jwt.sign(
      { userId: result.insertedId.toString(), email: data.email },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    setCookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, userId: result.insertedId.toString() };
  });

export const login = createServerFn({ method: "POST" })
  .validator((data: Record<string, string>) => {
    if (!data.email || !data.password) throw new Error("Email and password required");
    return data;
  })
  .handler(async ({ data }) => {
    const users = await getUsersCollection();
    const user = await users.findOne({ email: data.email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    setCookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, userId: user._id?.toString() || "" };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie("auth_token");
  return { success: true };
});

export const getCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie("auth_token");
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return { userId: decoded.userId, email: decoded.email };
  } catch (err) {
    return null;
  }
});
