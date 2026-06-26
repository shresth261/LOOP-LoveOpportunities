import { createServerFn } from "@tanstack/react-start";
import { getMasterSkillsCollection, getMasterInterestsCollection } from "./server/db";
import { queryOptions } from "@tanstack/react-query";

export const fetchMasterSkills = createServerFn({ method: "GET" }).handler(async () => {
  const coll = await getMasterSkillsCollection();
  const docs = await coll.find().toArray();
  return docs.map(d => d.name);
});

export const fetchMasterInterests = createServerFn({ method: "GET" }).handler(async () => {
  const coll = await getMasterInterestsCollection();
  const docs = await coll.find().toArray();
  return docs.map(d => d.name);
});

export const addMasterSkill = createServerFn({ method: "POST" })
  .validator((name: string) => name)
  .handler(async ({ data: name }) => {
    const coll = await getMasterSkillsCollection();
    try {
      await coll.insertOne({ name });
      return { success: true };
    } catch (e: any) {
      if (e.code === 11000) return { success: true }; // Duplicate key, ignore
      throw e;
    }
  });

export const addMasterInterest = createServerFn({ method: "POST" })
  .validator((name: string) => name)
  .handler(async ({ data: name }) => {
    const coll = await getMasterInterestsCollection();
    try {
      await coll.insertOne({ name });
      return { success: true };
    } catch (e: any) {
      if (e.code === 11000) return { success: true }; // Duplicate key, ignore
      throw e;
    }
  });

export const masterSkillsQuery = () => queryOptions({
  queryKey: ["master-skills"],
  queryFn: () => fetchMasterSkills(),
});

export const masterInterestsQuery = () => queryOptions({
  queryKey: ["master-interests"],
  queryFn: () => fetchMasterInterests(),
});
