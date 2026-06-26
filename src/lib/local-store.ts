import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUserData, 
  updateProfile as apiUpdateProfile, 
  toggleSaved as apiToggleSaved, 
  toggleInterested as apiToggleInterested, 
  addInterested as apiAddInterested, 
  addPassed as apiAddPassed, 
  toggleApplied as apiToggleApplied 
} from './user-data';

export interface Profile {
  name: string;
  onboarded: boolean;
  field: string;
  interests: string[];
  skills: string[];
  categories: string[];
  avatar?: string;
  goal?: string;
  future_you?: string;
  preferred_locations?: string[];
  portfolio_url?: string;
  github_url?: string;
  leetcode_url?: string;
  email?: string;
}

export const DEFAULT_PROFILE: Profile = {
  name: '',
  onboarded: false,
  field: '',
  interests: [],
  skills: [],
  categories: [],
  preferred_locations: [],
};

export function useUserData() {
  return useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const data = await getUserData();
      return data || {
        profile: DEFAULT_PROFILE,
        saved: [],
        interested: [],
        passed: [],
        applied: []
      };
    }
  });
}

function useListToggle(listKey: 'saved' | 'interested' | 'passed' | 'applied', apiFn: any) {
  const { data } = useUserData();
  const queryClient = useQueryClient();
  const list = data?.[listKey] || [];

  const mutation = useMutation({
    mutationFn: (data: any) => apiFn({ data }),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['userData'] });
      const previous = queryClient.getQueryData(['userData']);
      queryClient.setQueryData(['userData'], (old: any) => {
        if (!old) return old;
        const current = old[listKey] || [];
        const next = current.includes(id) ? current.filter((x: string) => x !== id) : [...current, id];
        return { ...old, [listKey]: next };
      });
      return { previous };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['userData'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    }
  });

  return { list, toggle: (id: string) => mutation.mutate(id) };
}

function useListAdd(listKey: 'saved' | 'interested' | 'passed' | 'applied', apiFn: any) {
  const { data } = useUserData();
  const queryClient = useQueryClient();
  const list = data?.[listKey] || [];

  const mutation = useMutation({
    mutationFn: (data: any) => apiFn({ data }),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['userData'] });
      const previous = queryClient.getQueryData(['userData']);
      queryClient.setQueryData(['userData'], (old: any) => {
        if (!old) return old;
        const current = old[listKey] || [];
        if (current.includes(id)) return old;
        return { ...old, [listKey]: [...current, id] };
      });
      return { previous };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['userData'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    }
  });

  return { list, add: (id: string) => mutation.mutate(id) };
}

export function useSaved() {
  const { list, toggle } = useListToggle('saved', apiToggleSaved);
  return { saved: list, isSaved: (id: string) => list.includes(id), toggle };
}

export function useInterested() {
  const { list, toggle } = useListToggle('interested', apiToggleInterested);
  const { add } = useListAdd('interested', apiAddInterested);
  return { interested: list, isInterested: (id: string) => list.includes(id), toggle, add };
}

export function usePassed() {
  const { list, add } = useListAdd('passed', apiAddPassed);
  return { passed: list, isPassed: (id: string) => list.includes(id), add };
}

export function useApplied() {
  const { list, toggle } = useListToggle('applied', apiToggleApplied);
  return { applied: list, isApplied: (id: string) => list.includes(id), toggle };
}

export function useProfile() {
  const { data } = useUserData();
  const queryClient = useQueryClient();
  const profile = data?.profile || DEFAULT_PROFILE;

  const mutation = useMutation({
    mutationFn: (data: any) => apiUpdateProfile({ data }),
    onMutate: async (updates: Partial<Profile>) => {
      await queryClient.cancelQueries({ queryKey: ['userData'] });
      const previous = queryClient.getQueryData(['userData']);
      queryClient.setQueryData(['userData'], (old: any) => {
        if (!old) return old;
        return { ...old, profile: { ...old.profile, ...updates } };
      });
      return { previous };
    },
    onError: (err, updates, context) => {
      queryClient.setQueryData(['userData'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    }
  });

  return { profile, update: (updates: Partial<Profile>) => mutation.mutate(updates) };
}

// ===== Resume analyser =====
// Lightweight keyword extraction — no AI needed. Matches a curated skill dictionary.
export const SKILL_DICTIONARY = [
  // tech
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "React",
  "Vue",
  "Angular",
  "Next.js",
  "Node.js",
  "Django",
  "Flask",
  "FastAPI",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "Firebase",
  "Supabase",
  "GraphQL",
  "REST",
  "AWS",
  "GCP",
  "Azure",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "Git",
  "Linux",
  "Machine Learning",
  "Deep Learning",
  "AI",
  "TensorFlow",
  "PyTorch",
  "NLP",
  "Computer Vision",
  "Data Science",
  // design
  "Figma",
  "Sketch",
  "Adobe XD",
  "Photoshop",
  "Illustrator",
  "UI",
  "UX",
  "Product Design",
  "Branding",
  "Typography",
  "Motion",
  "After Effects",
  "Webflow",
  // business
  "Marketing",
  "SEO",
  "Content",
  "Copywriting",
  "Strategy",
  "Finance",
  "Accounting",
  "Consulting",
  "Sales",
  "Operations",
  "Product Management",
  "Analytics",
  "Excel",
  // research / science
  "Research",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Statistics",
  "Economics",
  // creative
  "Writing",
  "Video",
  "Photography",
  "Music",
  "Illustration",
  // domains
  "Hackathon",
  "Open Source",
  "Startup",
  "Entrepreneurship",
  "Leadership",
  "Public Speaking",
];

export function analyseResume(text: string): { skills: string[]; field: string } {
  const lower = text.toLowerCase();
  const skills = SKILL_DICTIONARY.filter((s) => {
    const needle = s.toLowerCase();
    return lower.includes(needle);
  });

  // Infer field heuristically
  const buckets: Record<string, string[]> = {
    "Software Engineering": [
      "javascript",
      "typescript",
      "react",
      "node",
      "python",
      "java",
      "backend",
      "frontend",
      "developer",
      "engineer",
    ],
    Design: ["figma", "design", "ui", "ux", "branding", "illustrator", "photoshop"],
    "Data & AI": [
      "machine learning",
      "data",
      "python",
      "tensorflow",
      "pytorch",
      "analytics",
      "statistics",
    ],
    Product: ["product manager", "product management", "roadmap", "stakeholder"],
    Business: ["marketing", "finance", "consulting", "sales", "strategy", "mba"],
    Research: ["research", "phd", "publication", "biology", "chemistry", "physics"],
  };
  let bestField = "Software Engineering";
  let bestScore = 0;
  for (const [field, kws] of Object.entries(buckets)) {
    const score = kws.reduce((acc, k) => acc + (lower.includes(k) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestField = field;
    }
  }
  return { skills, field: bestField };
}

// Match score 0..100 — overlap between profile tokens and opp tags
export function matchScore(profile: Profile, oppTags: string[]): number {
  if (!oppTags.length) return 0;
  const set = new Set([
    ...(profile.skills || []).map((s) => s.toLowerCase()),
    ...(profile.interests || []).map((s) => s.toLowerCase()),
    (profile.field || "").toLowerCase(),
  ]);
  const hits = oppTags.filter((t) => {
    const lower = t.toLowerCase();
    for (const item of set) {
      if (!item) continue;
      if (item === lower || item.includes(lower) || lower.includes(item)) return true;
    }
    return false;
  }).length;
  // Base 15% so something always shows, scaled overlap up to 100
  const base = 15;
  const scaled = Math.round((hits / oppTags.length) * 85);
  return Math.min(100, base + scaled);
}
