import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getOpportunitiesCollection } from "./server/db";

export type Category = "internship" | "scholarship" | "competition" | "fellowship" | "hackathon";

export interface Opportunity {
  id: string; // Keep as id for frontend compatibility, though MongoDB has _id
  _id?: string;
  title: string;
  organization: string;
  category: Category;
  description: string;
  location: string;
  deadline: string;
  prize_amount: string | null;
  tags: string[];
  apply_url: string | null;
  participants: number | null;
  featured: boolean;
  posted_at: string;
}

export const categoryColor: Record<Category, string> = {
  internship: "bg-primary text-primary-foreground",
  scholarship: "bg-secondary text-secondary-foreground",
  competition: "bg-foreground text-background",
  fellowship: "bg-indigo text-foreground",
  hackathon: "bg-lime text-foreground",
};

export const fetchOpportunities = createServerFn({ method: "GET" })
  .validator((filters: { category?: Category; tag?: string; q?: string } = {}) => filters)
  .handler(async ({ data: filters }) => {
    const coll = await getOpportunitiesCollection();
    const query: Record<string, unknown> = {};
    if (filters?.category) query.category = filters.category;
    if (filters?.tag) query.tags = filters.tag; // MongoDB $in logic natively handles array checks
    if (filters?.q) query.title = { $regex: filters.q, $options: "i" };

    const docs = await coll.find(query).sort({ deadline: 1 }).toArray();
    // Map _id to string or map id field
    return docs.map((doc) => ({
      ...doc,
      _id: String(doc._id),
      // Use existing 'id' if populated, otherwise use stringified _id
      id: doc.id ? String(doc.id) : String(doc._id),
    })) as Opportunity[];
  });

export const fetchOpportunityById = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const coll = await getOpportunitiesCollection();
    // Try to find by string ID (assuming the Supabase IDs were strings)
    const doc = await coll.findOne({ id });
    if (!doc) return null;
    return {
      ...doc,
      _id: String(doc._id),
      id: doc.id ? String(doc.id) : String(doc._id),
    } as Opportunity;
  });

export const fetchTickerOpportunities = createServerFn({ method: "GET" }).handler(async () => {
  const coll = await getOpportunitiesCollection();
  const docs = await coll
    .find({ deadline: { $gte: new Date().toISOString() } })
    .project({ title: 1, organization: 1, deadline: 1, _id: 0 })
    .sort({ deadline: 1 })
    .limit(8)
    .toArray();
  return docs;
});

export const opportunitiesQuery = (filters?: { category?: Category; tag?: string; q?: string }) =>
  queryOptions({
    queryKey: ["opportunities", filters],
    queryFn: () => fetchOpportunities({ data: filters }),
  });

export const opportunityByIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["opportunity", id],
    queryFn: () => fetchOpportunityById({ data: id }),
  });
