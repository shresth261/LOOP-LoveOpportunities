import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

// Load environment variables
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME || 'radarDatabase';

if (!uri) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

const client = new MongoClient(uri);

const rawSamples = [
  {
    id: "opp_1",
    title: "Software Engineering Intern - Summer 2027",
    organization: "TechNova Solutions",
    category: "internship",
    location: "San Francisco, CA",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days from now
    tags: ["Software Engineering", "React", "Node.js", "Summer"],
    description: "Join our core product team for a 12-week summer internship. You will work on cutting-edge features using React and Node.js. Mentorship provided by senior engineers.",
    apply_url: "https://example.com/internship-technova",
    posted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    participants: 120,
    featured: true,
    prize_amount: null
  },
  {
    id: "opp_2",
    title: "Women in STEM Excellence Scholarship",
    organization: "Global STEM Foundation",
    category: "scholarship",
    location: "Remote",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    tags: ["STEM", "Women", "Undergraduate", "$5000"],
    description: "A $5,000 scholarship awarded to outstanding women pursuing undergraduate degrees in Science, Technology, Engineering, or Mathematics. Requires an essay and two letters of recommendation.",
    apply_url: "https://example.com/women-stem-scholarship",
    posted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    participants: 45,
    featured: false,
    prize_amount: "$5,000"
  },
  {
    id: "opp_3",
    title: "Global AI Hackathon 2026",
    organization: "AI Innovators Network",
    category: "hackathon",
    location: "Virtual",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
    tags: ["AI", "Machine Learning", "Virtual", "Prizes"],
    description: "A 48-hour global virtual hackathon focused on building AI solutions for climate change. Over $50,000 in prizes to be won. Open to all skill levels.",
    url: "https://example.com/ai-hackathon"
  },
  {
    id: "opp_4",
    title: "National Business Case Competition",
    organization: "Future Leaders Hub",
    category: "competition",
    location: "New York, NY",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    tags: ["Business", "Strategy", "Team", "Undergraduate"],
    description: "Form a team of 4 and solve a real-world business case for a Fortune 500 company. The final round will be held in NYC with networking opportunities with top executives.",
    url: "https://example.com/business-case"
  },
  {
    id: "opp_5",
    title: "Public Policy Research Fellowship",
    organization: "Institute for Urban Progress",
    category: "fellowship",
    location: "Washington, D.C.",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString(),
    tags: ["Policy", "Research", "Post-grad", "Stipend"],
    description: "A 1-year fully funded fellowship for recent graduates passionate about urban policy reform. Fellows will publish research papers and present to state legislators.",
    url: "https://example.com/policy-fellowship"
  },
  {
    id: "opp_6",
    title: "Product Design Intern",
    organization: "CreativeMinds Co.",
    category: "internship",
    location: "Austin, TX / Hybrid",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
    tags: ["Design", "UI/UX", "Figma", "Portfolio"],
    description: "Help design the next generation of productivity tools. Must have a strong portfolio demonstrating user-centric design principles and proficiency in Figma.",
    url: "https://example.com/design-intern"
  },
  {
    id: "opp_7",
    title: "First-Generation College Student Grant",
    organization: "Education Access Alliance",
    category: "scholarship",
    location: "Remote",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    tags: ["First-Gen", "Need-based", "$2000"],
    description: "Provides financial support ($2,000) for textbooks and living expenses to first-generation college students currently enrolled in a 4-year university.",
    url: "https://example.com/first-gen-grant"
  },
  {
    id: "opp_8",
    title: "CyberSecurity Capture The Flag (CTF)",
    organization: "SecureNet Defend",
    category: "hackathon",
    location: "Virtual",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    tags: ["Cybersecurity", "CTF", "Security", "Virtual"],
    description: "Test your penetration testing and defensive skills in this intensive 24-hour CTF. Network with security professionals and win tech gear.",
    url: "https://example.com/cyber-ctf"
  },
  {
    id: "opp_9",
    title: "Clean Energy Innovation Challenge",
    organization: "EcoVentures",
    category: "competition",
    location: "Boston, MA",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120).toISOString(),
    tags: ["Sustainability", "Engineering", "Pitch"],
    description: "Pitch your innovative clean energy startup idea to a panel of venture capitalists. Winner receives $100k in seed funding and a spot in our incubator.",
    url: "https://example.com/clean-energy-challenge"
  },
  {
    id: "opp_10",
    title: "Data Science Fellowship",
    organization: "Data for Good Labs",
    category: "fellowship",
    location: "London, UK",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40).toISOString(),
    tags: ["Data Science", "Python", "Social Impact", "6-months"],
    description: "Spend 6 months working on data science projects for non-profits. Requires strong skills in Python, Pandas, and machine learning models.",
    url: "https://example.com/data-science-fellowship"
  },
  {
    id: "opp_11",
    title: "Marketing & Communications Intern",
    organization: "GrowthWave Agency",
    category: "internship",
    location: "Remote",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
    tags: ["Marketing", "Social Media", "Content"],
    description: "Manage social media campaigns, write blog posts, and assist with market research for our diverse portfolio of clients.",
    url: "https://example.com/marketing-intern"
  },
  {
    id: "opp_12",
    title: "Future Leaders of Color Scholarship",
    organization: "Diversity in Leadership",
    category: "scholarship",
    location: "Remote",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 50).toISOString(),
    tags: ["Diversity", "Leadership", "Undergraduate"],
    description: "A scholarship program supporting students of color who have demonstrated exceptional leadership in their local communities.",
    url: "https://example.com/leaders-color"
  },
  {
    id: "opp_13",
    title: "Web3 & Blockchain Buildathon",
    organization: "Decentralize Now",
    category: "hackathon",
    location: "Miami, FL",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 70).toISOString(),
    tags: ["Web3", "Blockchain", "Crypto", "Solidity"],
    description: "Build decentralized applications (dApps) on Ethereum or Solana. Network with founders and win crypto bounties.",
    url: "https://example.com/web3-buildathon"
  },
  {
    id: "opp_14",
    title: "Algorithmic Trading Competition",
    organization: "Quant Capital",
    category: "competition",
    location: "Virtual",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).toISOString(),
    tags: ["Finance", "Algorithms", "C++", "Python"],
    description: "Develop the most profitable trading algorithm using our historical market data. Top 3 competitors receive full-time return offers.",
    url: "https://example.com/algo-trading"
  },
  {
    id: "opp_15",
    title: "Global Health Postdoctoral Fellowship",
    organization: "World Health Initiative",
    category: "fellowship",
    location: "Geneva, Switzerland",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 80).toISOString(),
    tags: ["Health", "Post-doc", "Research", "International"],
    description: "Research infectious disease trends globally. Candidates must have a Ph.D. in Epidemiology or a related field.",
    url: "https://example.com/health-fellowship"
  },
  {
    id: "opp_16",
    title: "Financial Analyst Intern",
    organization: "Apex Capital Group",
    category: "internship",
    location: "Chicago, IL",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28).toISOString(),
    tags: ["Finance", "Excel", "Modeling", "Summer"],
    description: "Work with senior analysts to build financial models and analyze market trends. Strong Excel skills required.",
    url: "https://example.com/finance-intern"
  },
  {
    id: "opp_17",
    title: "Arts & Humanities Excellence Award",
    organization: "National Arts Council",
    category: "scholarship",
    location: "Remote",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 65).toISOString(),
    tags: ["Arts", "Humanities", "Creative", "$3000"],
    description: "A $3,000 award for students majoring in literature, philosophy, history, or fine arts. Requires submitting a portfolio or writing sample.",
    url: "https://example.com/arts-award"
  },
  {
    id: "opp_18",
    title: "FinTech Hackathon: Future of Payments",
    organization: "NextGen Banking",
    category: "hackathon",
    location: "Toronto, ON",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 55).toISOString(),
    tags: ["FinTech", "API", "Payments"],
    description: "Use our payment APIs to build innovative consumer banking solutions. Travel stipends available for top-tier university students.",
    url: "https://example.com/fintech-hackathon"
  },
  {
    id: "opp_19",
    title: "Robotics Design Challenge",
    organization: "RoboTech Industries",
    category: "competition",
    location: "Tokyo, Japan (Finals)",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 100).toISOString(),
    tags: ["Robotics", "Hardware", "Engineering", "Travel"],
    description: "Design an autonomous delivery robot. Initial submissions are virtual; finalists will be flown to Tokyo to test their prototypes.",
    url: "https://example.com/robotics-challenge"
  },
  {
    id: "opp_20",
    title: "Investigative Journalism Fellowship",
    organization: "The Truth Media Group",
    category: "fellowship",
    location: "New York, NY",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 75).toISOString(),
    tags: ["Journalism", "Writing", "Media"],
    description: "A 9-month program for aspiring journalists. Pitch, investigate, and publish feature stories alongside Pulitzer-winning editors.",
    url: "https://example.com/journalism-fellowship"
  }
];

const sampleOpportunities = rawSamples.map(opp => ({
  ...opp,
  posted_at: opp.posted_at || new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 10)).toISOString(),
  apply_url: opp.apply_url || "https://example.com/apply",
  participants: opp.participants || Math.floor(Math.random() * 500),
  featured: opp.featured || Math.random() > 0.8,
  prize_amount: opp.prize_amount || null
}));

async function seed() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const db = client.db(dbName);
    const collection = db.collection('opportunities');

    // Clear existing collection
    await collection.deleteMany({});
    console.log(`Cleared existing collection.`);

    console.log("Inserting 20 sample opportunities...");
    const result = await collection.insertMany(sampleOpportunities);
    
    console.log(`Successfully inserted ${result.insertedCount} opportunities.`);
  } catch (err) {
    console.error("Failed to seed database:", err);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

seed();
