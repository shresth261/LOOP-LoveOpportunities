import { useEffect, useState, useCallback } from "react";

const SAVED_KEY = "loop.saved";
const PROFILE_KEY = "loop.profile";
const INTERESTED_KEY = "loop.interested";
const PASSED_KEY = "loop.passed";
const APPLIED_KEY = "loop.applied";

export interface Profile {
  name: string;
  onboarded: boolean;
  field: string; // primary field of interest
  interests: string[]; // tags
  skills: string[]; // extracted/typed skills
  categories: string[];
}

const DEFAULT_PROFILE: Profile = {
  name: "",
  onboarded: false,
  field: "",
  interests: [],
  skills: [],
  categories: [],
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function useStringSet(key: string, eventName: string) {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    setList(read<string[]>(key, []));
  }, [key]);

  const toggle = useCallback(
    (id: string) => {
      setList((prev) => {
        const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
        localStorage.setItem(key, JSON.stringify(next));
        window.dispatchEvent(new Event(eventName));
        return next;
      });
    },
    [key, eventName],
  );

  const add = useCallback(
    (id: string) => {
      setList((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        localStorage.setItem(key, JSON.stringify(next));
        window.dispatchEvent(new Event(eventName));
        return next;
      });
    },
    [key, eventName],
  );

  useEffect(() => {
    const h = () => setList(read<string[]>(key, []));
    window.addEventListener(eventName, h);
    return () => window.removeEventListener(eventName, h);
  }, [key, eventName]);

  return { list, has: (id: string) => list.includes(id), toggle, add };
}

export function useSaved() {
  const { list, has, toggle } = useStringSet(SAVED_KEY, "loop:saved");
  return { saved: list, isSaved: has, toggle };
}

export function useInterested() {
  const { list, has, toggle, add } = useStringSet(INTERESTED_KEY, "loop:interested");
  return { interested: list, isInterested: has, toggle, add };
}

export function usePassed() {
  const { list, has, add } = useStringSet(PASSED_KEY, "loop:passed");
  return { passed: list, isPassed: has, add };
}

export function useApplied() {
  const { list, has, toggle } = useStringSet(APPLIED_KEY, "loop:applied");
  return { applied: list, isApplied: has, toggle };
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  useEffect(() => {
    setProfile(read<Profile>(PROFILE_KEY, DEFAULT_PROFILE));
    const h = () => setProfile(read<Profile>(PROFILE_KEY, DEFAULT_PROFILE));
    window.addEventListener("loop:profile", h);
    return () => window.removeEventListener("loop:profile", h);
  }, []);

  const update = useCallback((next: Partial<Profile>) => {
    setProfile((prev) => {
      const merged = { ...prev, ...next };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event("loop:profile"));
      return merged;
    });
  }, []);

  return { profile, update };
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
    ...profile.skills.map((s) => s.toLowerCase()),
    ...profile.interests.map((s) => s.toLowerCase()),
    profile.field.toLowerCase(),
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
