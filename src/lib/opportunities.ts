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
  eligibility?: string;
  required_skills?: string[];
  preferred_skills?: string[];
  education_level?: string;
  branch_field?: string;
  experience_level?: string;
  city?: string;
  country?: string;
  work_mode?: "remote" | "hybrid" | "onsite";
  application_start_date?: string; // ISO
  event_start_date?: string; // ISO
  duration?: string;
  currency?: string;
  official_website?: string;
  difficulty_level?: "beginner" | "intermediate" | "advanced";
  bookmark_count?: number;
  view_count?: number;
  verified?: boolean;
  active?: boolean;
  match_score_placeholder?: number;
  updated_at?: string; // ISO
}

export const categoryColor: Record<Category, string> = {
  internship: "bg-primary text-primary-foreground",
  scholarship: "bg-secondary text-secondary-foreground",
  competition: "bg-foreground text-background",
  fellowship: "bg-indigo text-foreground",
  hackathon: "bg-lime text-foreground",
};

export const fetchOpportunities = createServerFn({ method: "POST" })
  .validator((filters: { category?: Category | "all"; tag?: string; q?: string; page?: number; limit?: number; profileTokens?: string[] } = {}) => filters)
  .handler(async ({ data: filters }) => {
    const coll = await getOpportunitiesCollection();
    
    const pipeline: any[] = [];
    const match: any = {};
    
    if (filters?.category && filters.category !== "all") match.category = filters.category;
    if (filters?.tag) match.tags = filters.tag;
    if (filters?.q) {
      match.$or = [
        { title: { $regex: filters.q, $options: "i" } },
        { organization: { $regex: filters.q, $options: "i" } },
        { tags: { $regex: filters.q, $options: "i" } }
      ];
    }
    
    // Only show upcoming or ongoing opportunities (deadline >= now)
    match.deadline = { $gte: new Date().toISOString() };
    
    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    if (filters?.profileTokens && filters.profileTokens.length > 0) {
      pipeline.push({
        $addFields: {
          matchScore: {
            $cond: {
              if: { $gt: [{ $size: { $ifNull: ["$tags", []] } }, 0] },
              then: {
                $divide: [
                  {
                    $size: {
                      $setIntersection: [
                        { $map: { input: { $ifNull: ["$tags", []] }, as: "t", in: { $toLower: "$$t" } } },
                        filters.profileTokens.map(t => t.toLowerCase())
                      ]
                    }
                  },
                  { $size: { $ifNull: ["$tags", []] } }
                ]
              },
              else: 0
            }
          }
        }
      });
      pipeline.push({ $sort: { matchScore: -1, deadline: 1 } });
    } else {
      pipeline.push({ $sort: { deadline: 1 } });
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;
    
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    pipeline.push({
      $project: {
        id: 1,
        _id: 1,
        title: 1,
        organization: 1,
        category: 1,
        location: 1,
        deadline: 1,
        tags: 1,
        prize_amount: 1,
        work_mode: 1,
        verified: 1,
        application_start_date: 1,
        posted_at: 1,
        matchScore: 1
      }
    });

    const docs = await coll.aggregate(pipeline).toArray();
    
    return docs.map((doc) => ({
      ...doc,
      _id: String(doc._id),
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

export const fetchOpportunitiesByIds = createServerFn({ method: "POST" })
  .validator((ids: string[]) => ids)
  .handler(async ({ data: ids }) => {
    if (!ids || ids.length === 0) return [];
    const coll = await getOpportunitiesCollection();
    const docs = await coll.find({ id: { $in: ids } }).toArray();
    return docs.map((doc) => ({
      ...doc,
      _id: String(doc._id),
      id: doc.id ? String(doc.id) : String(doc._id),
    })) as Opportunity[];
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

export const opportunitiesQuery = (filters?: { category?: Category | "all"; tag?: string; q?: string; page?: number; limit?: number; profileTokens?: string[] }) =>
  queryOptions({
    queryKey: ["opportunities", filters],
    queryFn: () => fetchOpportunities({ data: filters }),
  });

export const opportunityByIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["opportunity", id],
    queryFn: () => fetchOpportunityById({ data: id }),
  });

export const opportunitiesByIdsQuery = (ids: string[]) =>
  queryOptions({
    queryKey: ["opportunities", "byIds", ids],
    queryFn: () => fetchOpportunitiesByIds({ data: ids }),
  });
