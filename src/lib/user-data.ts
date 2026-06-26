import { createServerFn } from "@tanstack/react-start";
import { getCurrentUser } from "./auth";
import type { Profile } from "./local-store";
import { DEFAULT_PROFILE } from "./local-store";

// Helper to get authenticated user from DB
async function requireUserDb() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  
  const { getUsersCollection } = await import("./server/db");
  const { ObjectId } = await import("mongodb");
  
  const users = await getUsersCollection();
  const dbUser = await users.findOne({ _id: new ObjectId(user.userId) });
  if (!dbUser) throw new Error("User not found in DB");
  
  return { users, dbUser, userId: new ObjectId(user.userId) };
}

export const getUserData = createServerFn({ method: "GET" }).handler(async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  
  const { getUsersCollection } = await import("./server/db");
  const { ObjectId } = await import("mongodb");
  const users = await getUsersCollection();
  const dbUser = await users.findOne({ _id: new ObjectId(user.userId) });
  
  if (!dbUser) return null;
  
  return {
    profile: { ...DEFAULT_PROFILE, ...(dbUser.profile || {}) },
    saved: dbUser.saved || [],
    interested: dbUser.interested || [],
    passed: dbUser.passed || [],
    applied: dbUser.applied || []
  };
});

export const updateProfile = createServerFn({ method: "POST" })
  .validator((data: Partial<Profile>) => data)
  .handler(async ({ data }) => {
    const { users, userId } = await requireUserDb();
    
    // Merge existing profile with new data
    const updateQuery = Object.keys(data).reduce((acc, key) => {
      acc[`profile.${key}`] = (data as any)[key];
      return acc;
    }, {} as Record<string, any>);
    
    await users.updateOne({ _id: userId }, { $set: updateQuery });
    return { success: true };
  });

export const toggleSaved = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { users, dbUser, userId } = await requireUserDb();
    const list = dbUser.saved || [];
    const isSaved = list.includes(id);
    
    if (isSaved) {
      await users.updateOne({ _id: userId }, { $pull: { saved: id } });
    } else {
      await users.updateOne({ _id: userId }, { $addToSet: { saved: id } });
    }
    return { success: true, saved: !isSaved };
  });

export const toggleInterested = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { users, dbUser, userId } = await requireUserDb();
    const list = dbUser.interested || [];
    const isInterested = list.includes(id);
    
    if (isInterested) {
      await users.updateOne({ _id: userId }, { $pull: { interested: id } });
    } else {
      await users.updateOne({ _id: userId }, { $addToSet: { interested: id } });
    }
    return { success: true, interested: !isInterested };
  });

export const addInterested = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { users, userId } = await requireUserDb();
    await users.updateOne({ _id: userId }, { $addToSet: { interested: id } });
    return { success: true };
  });

export const addPassed = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { users, userId } = await requireUserDb();
    await users.updateOne({ _id: userId }, { $addToSet: { passed: id } });
    return { success: true };
  });

export const toggleApplied = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { users, dbUser, userId } = await requireUserDb();
    const list = dbUser.applied || [];
    const isApplied = list.includes(id);
    
    if (isApplied) {
      await users.updateOne({ _id: userId }, { $pull: { applied: id } });
    } else {
      await users.updateOne({ _id: userId }, { $addToSet: { applied: id } });
    }
    return { success: true, applied: !isApplied };
  });
