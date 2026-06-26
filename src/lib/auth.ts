import { createServerFn } from "@tanstack/react-start";

import { setCookie, deleteCookie, getCookie } from "@tanstack/react-start/server";
const getJwtSecret = () => process.env.JWT_SECRET || "default_development_secret_do_not_use_in_prod";

export const authenticate = createServerFn({ method: "POST" })
  .validator((data: Record<string, string>) => {
    if (!data.name || !data.password) throw new Error("Name and password required");
    return data;
  })
  .handler(async ({ data }) => {
    const { getUsersCollection } = await import("./server/db");
    const users = await getUsersCollection();
    let user = await users.findOne({ name: data.name });

    const bcrypt = await import("bcrypt");
    const jwt = (await import("jsonwebtoken")).default;

    // If user does not exist, sign them up
    if (!user) {
      const { DEFAULT_PROFILE } = await import("./local-store");
      const passwordHash = await bcrypt.hash(data.password, 10);
      const newUser = {
        name: data.name,
        passwordHash,
        createdAt: new Date(),
        profile: { ...DEFAULT_PROFILE, name: data.name },
        saved: [],
        interested: [],
        passed: [],
        applied: []
      };
      const result = await users.insertOne(newUser);
      user = { _id: result.insertedId, ...newUser };
    } else {
      // If user exists, log them in (verify password)
      const isValid = await bcrypt.compare(data.password, user.passwordHash);
      if (!isValid) {
        throw new Error("Invalid password");
      }
    }

    const token = jwt.sign(
      { userId: user._id?.toString(), name: user.name },
      getJwtSecret(),
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
    const jwt = (await import("jsonwebtoken")).default;
    const decoded = jwt.verify(token, getJwtSecret()) as { userId: string; name: string };
    return { userId: decoded.userId, name: decoded.name };
  } catch (err) {
    return null;
  }
});
