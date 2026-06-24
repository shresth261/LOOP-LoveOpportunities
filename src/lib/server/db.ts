import { MongoClient } from "mongodb";
import type { Opportunity } from "../opportunities";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DATABASE_NAME || "leap_lounge";

let client: MongoClient | null = null;

export async function getDb() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
  }
  return client.db(dbName);
}

export async function getOpportunitiesCollection() {
  const db = await getDb();
  return db.collection<Opportunity>("opportunities");
}

// User schema for the requested authentication logic
export interface User {
  _id?: import("mongodb").ObjectId; // MongoDB ObjectId
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export async function getUsersCollection() {
  const db = await getDb();
  return db.collection<User>("users");
}
