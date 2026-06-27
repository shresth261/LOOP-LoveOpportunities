import { MongoClient } from "mongodb";
import type { Opportunity } from "../opportunities";
import type { Profile } from "../local-store";

const getUri = () => process.env.MONGODB_URI || "mongodb://localhost:27017";
const getDbName = () => process.env.DATABASE_NAME || "leap_lounge";

let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getDb() {
  const uri = getUri();
  
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect().then(async (c) => {
        console.log("Connected to MongoDB (Dev)");
        await setupIndexes(c.db(getDbName()));
        return c;
      });
    }
    clientPromise = global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      const client = new MongoClient(uri);
      clientPromise = client.connect().then(async (c) => {
        console.log("Connected to MongoDB (Prod)");
        await setupIndexes(c.db(getDbName()));
        return c;
      }).catch(err => {
        clientPromise = null;
        throw err;
      });
    }
  }

  const connectedClient = await clientPromise!;
  return connectedClient.db(getDbName());
}

export async function getOpportunitiesCollection() {
  const db = await getDb();
  return db.collection<Opportunity>("opportunities");
}

// User schema for the requested authentication logic
export interface User {
  _id?: import("mongodb").ObjectId; // MongoDB ObjectId
  name: string;
  passwordHash: string;
  createdAt: Date;
  profile: Profile;
  saved: string[];
  interested: string[];
  passed: string[];
  applied: string[];
  remindersSent?: Record<string, string[]>;
}

export async function getUsersCollection() {
  const db = await getDb();
  return db.collection<User>("users");
}

export interface MasterTag {
  _id?: import("mongodb").ObjectId;
  name: string;
}

export async function getMasterSkillsCollection() {
  const db = await getDb();
  return db.collection<MasterTag>("master_skills");
}

export async function getMasterInterestsCollection() {
  const db = await getDb();
  return db.collection<MasterTag>("master_interests");
}

async function setupIndexes(db: import("mongodb").Db) {
  try {
    const opps = db.collection("opportunities");
    // Text index for search
    await opps.createIndex(
      { title: "text", organization: "text", tags: "text" },
      { name: "search_text_idx" }
    );
    // Compound index for category and deadline
    await opps.createIndex({ category: 1, deadline: 1 });
    // Standard indexes
    await opps.createIndex({ deadline: 1 });
    await opps.createIndex({ location: 1 });
    await opps.createIndex({ application_start_date: 1 });
    await opps.createIndex({ tags: 1 });
    await opps.createIndex({ active: 1 });

    const mSkills = db.collection("master_skills");
    await mSkills.createIndex({ name: 1 }, { unique: true });

    const mInterests = db.collection("master_interests");
    await mInterests.createIndex({ name: 1 }, { unique: true });

    console.log("MongoDB Indexes ensured");
  } catch (error) {
    console.error("Failed to setup indexes:", error);
  }
}
