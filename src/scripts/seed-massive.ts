import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME || 'radarDatabase';

if (!uri) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

const client = new MongoClient(uri);

// Curated data arrays for generation
const CATEGORIES = ["internship", "scholarship", "competition", "fellowship", "hackathon"];

const ORGS = {
  internship: ["Google", "Microsoft", "Meta", "Amazon", "Netflix", "Apple", "Stripe", "Uber", "Airbnb", "Spotify", "Goldman Sachs", "JPMorgan", "Morgan Stanley", "McKinsey", "BCG", "Bain", "Tesla", "SpaceX", "NASA", "CERN", "DeepMind", "OpenAI", "Anthropic", "Palantir", "Bloomberg"],
  scholarship: ["Gates Foundation", "Ford Foundation", "Rhodes Trust", "Fulbright", "Chevening", "Google Women in Tech", "National Science Foundation", "Erasmus+", "UNICEF", "World Bank", "Rotary International", "Mastercard Foundation", "Coca-Cola Scholars", "Thiel Fellowship"],
  competition: ["Kaggle", "TopCoder", "HackerRank", "LeetCode", "Codeforces", "MIT", "Stanford", "Harvard", "ACM ICPC", "Google HashCode", "Facebook Hacker Cup", "Imagine Cup", "XPRIZE", "Hult Prize", "Global Case Competition", "Designathon"],
  fellowship: ["Y Combinator", "Techstars", "500 Startups", "Sequoia", "Andreessen Horowitz", "Kleiner Perkins", "Schwarzman Scholars", "MacArthur Foundation", "Obama Foundation", "Schmidt Futures", "TED Fellows", "Ashoka", "Echoing Green", "Knight Foundation"],
  hackathon: ["MLH", "Devpost", "EthGlobal", "Solana Foundation", "Polygon", "Chainlink", "AWS", "Google Cloud", "Microsoft Azure", "IBM", "Intel", "NVIDIA", "HackMIT", "PennApps", "TreeHacks", "Cal Hacks", "Hack the North", "ETHWaterloo", "ETHDenver"]
};

const TITLES = {
  internship: ["Software Engineering Intern", "Data Science Intern", "Product Management Intern", "UX/UI Design Intern", "Marketing Intern", "Financial Analyst Intern", "Hardware Engineering Intern", "Machine Learning Intern", "Research Scientist Intern", "Business Operations Intern", "Sales Intern", "Legal Intern", "HR Intern", "Cybersecurity Intern", "Cloud Infrastructure Intern"],
  scholarship: ["Excellence Scholarship", "Women in Tech Scholarship", "Underrepresented Minorities Scholarship", "First-Generation Scholarship", "Merit-Based Grant", "Global Leader Scholarship", "STEM Excellence Award", "Future Innovators Scholarship", "Community Impact Scholarship", "Research Grant", "Study Abroad Scholarship", "Need-Based Financial Aid", "Graduate Research Fellowship"],
  competition: ["Global Hackathon", "Data Science Challenge", "Algorithmic Trading Competition", "Business Case Competition", "Design Sprint", "Capture The Flag (CTF)", "Robotics Challenge", "Innovation Pitch Competition", "Startup Battlefield", "Code Jam", "Math Olympiad", "Climate Change Innovation Challenge", "HealthTech Hackathon", "FinTech Challenge", "Web3 Buildathon"],
  fellowship: ["Research Fellowship", "Entrepreneurship Fellowship", "Public Policy Fellowship", "Global Health Fellowship", "Arts & Culture Fellowship", "Journalism Fellowship", "Climate Action Fellowship", "Social Impact Fellowship", "AI Safety Fellowship", "Quantum Computing Fellowship", "Space Exploration Fellowship", "Urban Planning Fellowship", "Education Reform Fellowship"],
  hackathon: ["Web3 Hackathon", "AI/ML Hackathon", "FinTech Hackathon", "HealthTech Hackathon", "ClimateTech Hackathon", "EdTech Hackathon", "Open Source Hackathon", "Hardware Hackathon", "AR/VR Hackathon", "Gaming Hackathon", "Cybersecurity Hackathon", "SpaceTech Hackathon", "AgriTech Hackathon", "Social Impact Hackathon", "Quantum Hackathon"]
};

const LOCATIONS = ["San Francisco, CA", "New York, NY", "London, UK", "Berlin, Germany", "Bangalore, India", "Singapore", "Toronto, Canada", "Sydney, Australia", "Tokyo, Japan", "Tel Aviv, Israel", "Paris, France", "Amsterdam, Netherlands", "Zurich, Switzerland", "Seattle, WA", "Austin, TX", "Boston, MA", "Chicago, IL", "Remote", "Virtual"];

const SKILLS = ["Python", "JavaScript", "React", "Node.js", "Java", "C++", "C#", "Go", "Rust", "Swift", "Kotlin", "Ruby", "PHP", "SQL", "NoSQL", "Machine Learning", "Deep Learning", "Data Analysis", "Data Visualization", "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Agile", "Scrum", "Product Management", "UI/UX Design", "Figma", "Marketing", "Sales", "Finance", "Accounting", "Legal", "HR", "Cybersecurity", "Blockchain", "Web3", "Smart Contracts", "IoT", "Robotics", "Hardware", "AR/VR", "Game Development", "Unity", "Unreal Engine"];

const TAGS = ["Summer", "Winter", "Paid", "Unpaid", "Remote", "Onsite", "Hybrid", "Full-time", "Part-time", "Undergrad", "Grad", "PhD", "Startup", "Enterprise", "Non-profit", "Government", "Research", "Open Source", "Diversity", "Women", "Minorities", "First-Gen", "International", "Mentorship", "Networking", "Travel", "Housing", "Relocation", "Visa Sponsorship"];

const generateDescription = (category: string, title: string, organization: string, skill: string) => {
  const templates = {
    internship: [
      `Join ${organization} as a ${title} and work on real-world projects that impact millions of users. You'll collaborate closely with senior engineers and designers, leveraging your skills in ${skill} to build innovative solutions. This role is perfect for self-starters who thrive in a fast-paced environment.`,
      `Kickstart your career with our highly sought-after ${title} program at ${organization}. We are seeking ambitious students with a strong foundation in ${skill}. Expect comprehensive mentorship, challenging assignments, and a deep dive into our tech stack.`,
      `As a ${title} at ${organization}, you'll be at the forefront of cutting-edge technology. Bring your passion for ${skill} and help us solve complex problems. We offer a dynamic workplace where your ideas can truly make a difference.`
    ],
    scholarship: [
      `The ${title} provided by ${organization} aims to support exceptional students demonstrating excellence in their field. We recognize the importance of diversity and innovation, particularly for those passionate about ${skill}. Apply now to receive financial support and join our global alumni network.`,
      `${organization} is proud to offer the ${title} for future leaders. This scholarship not only provides funding but also exclusive networking opportunities and mentorship. If you have a demonstrated interest in ${skill}, we encourage you to apply.`,
      `Empowering the next generation of innovators, the ${title} from ${organization} provides comprehensive financial aid. We are looking for candidates who show immense potential and dedication, especially in areas like ${skill}.`
    ],
    competition: [
      `Compete in the premier ${title} hosted by ${organization}. Test your limits against top talent from around the world. Whether you excel in ${skill} or just love a good challenge, this is your chance to win prizes and gain international recognition.`,
      `Welcome to the annual ${title} by ${organization}! Gather your team or compete solo to solve real-world problems. Show off your expertise in ${skill} and pitch your solutions to a panel of expert judges. Huge rewards await the winners!`,
      `Are you ready to showcase your talent? The ${title} brought to you by ${organization} is looking for the brightest minds. Use your knowledge of ${skill} to outsmart the competition, claim the top spot on the leaderboard, and win exclusive prizes.`
    ],
    fellowship: [
      `The ${title} at ${organization} is a prestigious program designed for emerging leaders. Over the course of the fellowship, you'll receive funding, access to our vast network, and specialized training in ${skill}. Build your vision with our support.`,
      `${organization} invites visionary individuals to apply for the ${title}. We provide resources and mentorship to help you scale your impact. Candidates with a strong background or interest in ${skill} will find this program particularly beneficial.`,
      `Join an elite cohort of changemakers in the ${title} by ${organization}. This immersive experience accelerates your growth and provides a platform to launch your ideas. Bring your expertise in ${skill} and collaborate with world-class mentors.`
    ],
    hackathon: [
      `Get ready to build at the ${title} organized by ${organization}! Over 48 hours of intense coding, collaboration, and fun, you'll create projects from scratch. Perfect for developers who love ${skill}. Free food, swag, and massive prizes included!`,
      `Join us for the ultimate ${title} by ${organization}. Collaborate with fellow tech enthusiasts, attend exclusive workshops, and build the future. If you are passionate about ${skill}, you won't want to miss this buildathon.`,
      `${organization} presents the ${title} — a global event for hackers, designers, and innovators. Push the boundaries of technology using ${skill} and present your prototype to top investors and tech leaders.`
    ]
  };

  const categoryTemplates = templates[category as keyof typeof templates] || templates.internship;
  return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
};

// Helper functions
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomChoices = <T>(arr: readonly T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

// Date generation
const generateDates = () => {
  const now = new Date();
  
  // Decide if this is a future opportunity or currently open
  const isFuture = Math.random() < 0.25; // 25% chance of being in the future
  
  let appStartDate = new Date(now);
  if (isFuture) {
    appStartDate.setDate(now.getDate() + randomInt(1, 45)); // Opens in 1-45 days
  } else {
    appStartDate.setDate(now.getDate() - randomInt(1, 60)); // Opened 1-60 days ago
  }

  const appEndDate = new Date(appStartDate);
  appEndDate.setDate(appStartDate.getDate() + randomInt(14, 90)); // Open for 14-90 days

  const eventStartDate = new Date(appEndDate);
  eventStartDate.setDate(appEndDate.getDate() + randomInt(7, 180)); // Event starts 7-180 days after deadline

  const postedAt = new Date(appStartDate);
  postedAt.setDate(appStartDate.getDate() - randomInt(1, 14)); // Posted 1-14 days before it opens

  return {
    application_start_date: appStartDate.toISOString(),
    deadline: appEndDate.toISOString(),
    event_start_date: eventStartDate.toISOString(),
    posted_at: postedAt.toISOString(),
  };
};

function generateOpportunity(index: number) {
  const category = randomChoice(CATEGORIES) as keyof typeof ORGS;
  const organization = randomChoice(ORGS[category]);
  const title = randomChoice(TITLES[category]);
  const loc = randomChoice(LOCATIONS);
  
  let work_mode = randomChoice(["remote", "hybrid", "onsite", null]);
  let location = loc;
  
  if (loc === "Remote" || loc === "Virtual") {
    work_mode = "remote";
  } else if (work_mode === "remote") {
    location = "Remote";
  }

  const { application_start_date, deadline, event_start_date, posted_at } = generateDates();
  
  const tags = Array.from(new Set([...randomChoices(TAGS, randomInt(2, 5)), ...randomChoices(SKILLS, randomInt(1, 3))]));
  const primarySkill = randomChoice(SKILLS);

  return {
    id: `opp_gen_${index}_${Date.now()}`,
    title: `${organization} ${title}`,
    organization,
    category,
    description: generateDescription(category, title, organization, primarySkill),
    eligibility: "Open to all students and recent graduates.",
    required_skills: randomChoices(SKILLS, randomInt(2, 5)),
    preferred_skills: randomChoices(SKILLS, randomInt(1, 3)),
    education_level: randomChoice(["High School", "Undergraduate", "Graduate", "PhD", "Any"]),
    branch_field: randomChoice(["Computer Science", "Electrical Engineering", "Business", "Marketing", "Data Science", "Any"]),
    experience_level: randomChoice(["Beginner", "Intermediate", "Advanced", "Any"]),
    location,
    city: location !== "Remote" && location !== "Virtual" ? location.split(",")[0] : undefined,
    country: location !== "Remote" && location !== "Virtual" ? location.split(",")[1]?.trim() : undefined,
    work_mode,
    application_start_date,
    deadline,
    event_start_date,
    duration: randomChoice(["1 month", "3 months", "6 months", "1 year", "48 hours", "1 week"]),
    prize_amount: randomChoice(["$1,000", "$5,000", "$10,000", "Swag", "Mentorship", null]),
    currency: "USD",
    apply_url: `https://example.com/apply/${organization.toLowerCase().replace(/\s+/g, '-')}`,
    official_website: `https://${organization.toLowerCase().replace(/\s+/g, '')}.com`,
    tags,
    difficulty_level: randomChoice(["beginner", "intermediate", "advanced"]),
    participants: Math.random() > 0.3 ? randomInt(10, 10000) : null,
    bookmark_count: randomInt(0, 500),
    view_count: randomInt(100, 50000),
    match_score_placeholder: randomInt(10, 99),
    featured: Math.random() > 0.9, // 10% featured
    verified: Math.random() > 0.2, // 80% verified
    active: true,
    posted_at,
    updated_at: new Date().toISOString()
  };
}

async function seedMassive() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const db = client.db(dbName);
    const collection = db.collection('opportunities');

    console.log("Generating 500 realistic opportunities...");
    
    await collection.deleteMany({});
    console.log(`Cleared existing collection.`);

    const opportunities = Array.from({ length: 500 }, (_, i) => generateOpportunity(i));

    const result = await collection.insertMany(opportunities);
    
    console.log(`Successfully inserted ${result.insertedCount} opportunities.`);
  } catch (err) {
    console.error("Failed to seed database:", err);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

seedMassive();
