
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('internship','scholarship','competition','fellowship','hackathon')),
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  prize_amount TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  apply_url TEXT,
  participants INT DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  posted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.opportunities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opportunities TO authenticated;
GRANT ALL ON public.opportunities TO service_role;

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Opportunities are viewable by everyone"
  ON public.opportunities FOR SELECT
  USING (true);

CREATE INDEX idx_opportunities_deadline ON public.opportunities(deadline);
CREATE INDEX idx_opportunities_category ON public.opportunities(category);

INSERT INTO public.opportunities (title, organization, category, description, location, deadline, prize_amount, tags, apply_url, participants, featured) VALUES
('Designer Residency', 'Figma', 'internship', 'Three-month immersive product design residency in San Francisco. Focus on next-gen spatial tools and collaborative design systems.', 'San Francisco, CA', now() + interval '4 days', '$8,000/mo', ARRAY['Design','Figma','UX'], 'https://figma.com', 1240, true),
('Future Creatives Grant', 'The Awesome Foundation', 'scholarship', 'Supporting student projects at the intersection of AI and traditional craftsmanship. No strings attached.', 'Global / Remote', now() + interval '4 days', '$10,000', ARRAY['AI','Art','Research'], 'https://awesomefoundation.org', 540, true),
('Vercel Ship Build-a-thon', 'Vercel', 'competition', 'Build the fastest web application using the latest Next.js features. Winners get a trip to HQ and recruiter intros.', 'Online + SF Finals', now() + interval '12 days', '$50,000', ARRAY['Web','Next.js','Frontend'], 'https://vercel.com/ship', 2400, true),
('SWE Summer Intern', 'Stripe', 'internship', 'Build payments infrastructure used by millions. 12-week paid program with mentorship from senior engineers.', 'Seattle / Remote', now() + interval '6 days', '$11,500/mo', ARRAY['Backend','Payments','Go'], 'https://stripe.com/jobs', 4200, false),
('ML Research Fellowship', 'Apple', 'fellowship', 'Work alongside Apple''s ML team on on-device intelligence. PhD students preferred but undergrads welcome.', 'Cupertino, CA', now() + interval '20 days', '$15,000', ARRAY['ML','Research','iOS'], 'https://apple.com/careers', 890, false),
('Thiel Fellowship', 'Thiel Foundation', 'fellowship', 'Two-year grant of $100k for students under 23 who want to skip college and build the future.', 'San Francisco, CA', now() + interval '14 days', '$100,000', ARRAY['Entrepreneurship','Founders'], 'https://thielfellowship.org', 12000, true),
('Google Summer of Code', 'Google', 'internship', 'Get paid to write open-source software for a summer. Mentored by maintainers of major OSS projects.', 'Remote', now() + interval '30 days', '$3,000-$6,600', ARRAY['OSS','SWE','Mentorship'], 'https://summerofcode.withgoogle.com', 35000, false),
('NASA SEES Internship', 'NASA', 'internship', 'High school and undergrad research internship in Earth and space science. Includes virtual + onsite components.', 'Austin, TX + Remote', now() + interval '45 days', 'Stipend', ARRAY['Research','STEM','Space'], 'https://nasa.gov', 1500, false),
('Red Bull Basement', 'Red Bull', 'competition', 'Pitch your tech-for-good idea. Global winners get an all-expenses-paid trip to Tokyo finals.', 'Global / Tokyo Finals', now() + interval '60 days', 'Tokyo Trip + Mentorship', ARRAY['Pitch','Entrepreneurship'], 'https://redbull.com/basement', 8400, false),
('Rhodes Scholarship', 'Rhodes Trust', 'scholarship', 'Postgraduate study at the University of Oxford. The world''s oldest and most celebrated international scholarship.', 'Oxford, UK', now() + interval '70 days', 'Full tuition + stipend', ARRAY['Postgrad','Oxford','Elite'], 'https://rhodeshouse.ox.ac.uk', 4200, true),
('KPCB Engineering Fellow', 'Kleiner Perkins', 'fellowship', 'Spend the summer engineering at a top KP portfolio company. Includes weekly dinners with industry icons.', 'Bay Area, CA', now() + interval '25 days', '$15k + housing', ARRAY['SWE','VC','Portfolio'], 'https://fellows.kleinerperkins.com', 3200, false),
('Goldman Sachs Markets Intern', 'Goldman Sachs', 'internship', '10-week summer program in trading, sales, and structuring. Highly competitive.', 'New York, NY', now() + interval '8 days', '$120k pro-rated', ARRAY['Finance','Markets','Trading'], 'https://goldmansachs.com/careers', 9800, false),
('NeurIPS Paper Competition', 'NeurIPS', 'competition', 'Submit novel research in ML and AI. Best student papers receive travel grants and presentation slots.', 'Vancouver, Canada', now() + interval '50 days', '$5,000 + Travel', ARRAY['ML','Research','Academia'], 'https://neurips.cc', 2300, false),
('Adobe Design Circle', 'Adobe', 'scholarship', 'Scholarship for underrepresented design students. Includes mentorship from Adobe principal designers.', 'Remote', now() + interval '35 days', '$25,000', ARRAY['Design','Diversity','Mentorship'], 'https://adobe.com/designcircle', 670, false),
('HackMIT', 'MIT', 'hackathon', '1000+ students from 30+ countries gather at MIT for 24 hours of building. Travel reimbursed.', 'Cambridge, MA', now() + interval '2 days', 'Prizes + Swag', ARRAY['Hackathon','Travel','MIT'], 'https://hackmit.org', 5400, true),
('Coca-Cola Scholars', 'Coca-Cola Foundation', 'scholarship', 'For high school seniors demonstrating leadership and community service. 150 scholarships annually.', 'United States', now() + interval '90 days', '$20,000', ARRAY['HighSchool','Leadership'], 'https://coca-colascholarsfoundation.org', 95000, false),
('SpaceX Internship', 'SpaceX', 'internship', 'Help build the rockets going to Mars. Roles in propulsion, avionics, software, and structures.', 'Hawthorne, CA', now() + interval '15 days', 'Competitive', ARRAY['Aerospace','Hardware','SWE'], 'https://spacex.com/careers', 7800, true),
('Y Combinator Startup School', 'Y Combinator', 'fellowship', 'Free online course + grant for early-stage founders. Application required for the grant track.', 'Remote', now() + interval '40 days', '$10k equity-free', ARRAY['Founders','Startup','YC'], 'https://startupschool.org', 28000, false),
('Microsoft Imagine Cup', 'Microsoft', 'competition', 'Global student technology competition. Build a project using Microsoft tech that changes the world.', 'Global + Seattle Finals', now() + interval '55 days', '$100,000', ARRAY['Cloud','Azure','Global'], 'https://imaginecup.microsoft.com', 18000, false),
('Truman Scholarship', 'Truman Foundation', 'scholarship', 'For college juniors committed to careers in public service. $30k for graduate school.', 'United States', now() + interval '65 days', '$30,000', ARRAY['PublicService','Grad','Leadership'], 'https://truman.gov', 800, false),
('Palantir Summer Fellowship', 'Palantir', 'fellowship', 'Underclassmen-only software engineering program. Build production systems with real impact.', 'Palo Alto, CA', now() + interval '10 days', '$15k + housing', ARRAY['SWE','Underclass','Backend'], 'https://palantir.com/careers', 2100, false),
('Knight-Hennessy Scholars', 'Stanford', 'scholarship', 'Fully-funded graduate education at Stanford across any discipline. Cohort-based leadership program.', 'Stanford, CA', now() + interval '80 days', 'Full + Stipend', ARRAY['Grad','Stanford','Leadership'], 'https://knight-hennessy.stanford.edu', 8000, true),
('TreeHacks', 'Stanford', 'hackathon', '36-hour hackathon at Stanford with $50k+ in prizes. Travel reimbursed for selected hackers.', 'Stanford, CA', now() + interval '5 days', '$50,000+', ARRAY['Hackathon','Stanford','Travel'], 'https://treehacks.com', 4000, false),
('JP Morgan Code for Good', 'JP Morgan', 'hackathon', '24-hour hackathon solving problems for nonprofits. Top performers get summer internship offers.', 'Multiple Cities', now() + interval '18 days', 'Internship Offers', ARRAY['Hackathon','SocialGood','Internship'], 'https://jpmorgan.com/careers', 6500, false),
('Schwarzman Scholars', 'Tsinghua University', 'scholarship', 'One-year fully-funded master''s in global affairs at Tsinghua. Highly selective cohort program.', 'Beijing, China', now() + interval '100 days', 'Full Funding', ARRAY['Grad','China','International'], 'https://schwarzmanscholars.org', 3500, false),
('Tesla Internship', 'Tesla', 'internship', 'Engineering internships across vehicle, energy, and AI. Hands-on work shipping to production.', 'Multiple Locations', now() + interval '22 days', '$25-45/hr', ARRAY['Hardware','EV','Engineering'], 'https://tesla.com/careers', 12000, false),
('Anthropic Research Fellowship', 'Anthropic', 'fellowship', 'Work on AI safety research alongside leading scientists. Part-time and full-time tracks.', 'SF / Remote', now() + interval '7 days', 'Competitive', ARRAY['AI','Safety','Research'], 'https://anthropic.com/careers', 1900, true),
('Pennapps', 'UPenn', 'hackathon', 'The original college hackathon. 1,000+ hackers, 36 hours, multi-million dollar APIs to play with.', 'Philadelphia, PA', now() + interval '28 days', '$30,000', ARRAY['Hackathon','UPenn','Travel'], 'https://pennapps.com', 3800, false),
('Linear Internship', 'Linear', 'internship', 'Join a 60-person team building the project management tool world-class engineers love.', 'Remote (EU/US)', now() + interval '11 days', '€5-7k/mo', ARRAY['SWE','Product','Remote'], 'https://linear.app/careers', 4600, false),
('Davidson Fellows', 'Davidson Institute', 'scholarship', 'For students 18 and under with a significant work in STEM, literature, music, or philosophy.', 'United States', now() + interval '120 days', '$50,000', ARRAY['HighSchool','STEM','Prodigy'], 'https://davidsongifted.org', 1500, false);
