import { Resend } from "resend";
import { getUsersCollection, getOpportunitiesCollection } from "./db";
import type { Opportunity } from "../opportunities";
import type { User } from "./db";
import { differenceInCalendarDays, format } from "date-fns";

let resendClient: Resend | null = null;
const EMAIL_FROM = process.env.EMAIL_FROM || "LOOP <onboarding@resend.dev>";

// Basic matchScore to render in email since we don't have the React component here
function getMatchPercentage(profile: any, oppTags: string[]): number {
  if (!oppTags || !oppTags.length) return 0;
  const set = new Set([
    ...(profile.skills || []).map((s: string) => s.toLowerCase()),
    ...(profile.interests || []).map((s: string) => s.toLowerCase()),
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
  const base = 15;
  const scaled = Math.round((hits / oppTags.length) * 85);
  return Math.min(100, base + scaled);
}

function generateEmailHTML(user: User, reminders: { opp: Opportunity, timeframe: string, daysLeft: number }[]) {
  const oppsHtml = reminders.map(({ opp, timeframe, daysLeft }) => {
    const score = getMatchPercentage(user.profile, opp.tags || []);
    const timeText = daysLeft === 0 ? "Today" : "Tomorrow";
    const color = daysLeft === 0 ? "#ef4444" : "#eab308";
    
    return `
      <div style="background-color: #ffffff; border: 2px solid #000000; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
        <div style="font-family: monospace; font-size: 12px; color: ${color}; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">
          Deadline: ${timeText}
        </div>
        <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; background-color: #000; color: #fff; display: inline-block; padding: 4px 10px; border-radius: 4px; margin-bottom: 12px;">
          ${opp.category} &middot; ${opp.organization}
        </div>
        <h2 style="font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; margin: 0 0 12px 0; color: #000; line-height: 1.2;">
          ${opp.title}
        </h2>
        <p style="font-family: Arial, sans-serif; font-size: 14px; color: #4b5563; margin: 0 0 16px 0; line-height: 1.5;">
          ${opp.description || 'No description provided.'}
        </p>
        <div style="font-family: Arial, sans-serif; font-size: 14px; color: #111827; margin-bottom: 20px; line-height: 1.5;">
          <strong>Location:</strong> ${opp.location || 'N/A'}<br/>
          <strong>Match:</strong> ${score}%<br/>
          <strong>Deadline:</strong> ${format(new Date(opp.deadline), "MMMM do, yyyy")}<br/>
          <strong>Required Skills:</strong> ${(opp.tags || []).slice(0, 5).join(", ")}
        </div>
        <div style="display: flex; gap: 12px;">
          ${opp.apply_url ? `
            <a href="${opp.apply_url}" style="background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-family: monospace; font-weight: bold; text-transform: uppercase; font-size: 12px; display: inline-block;">
              Apply Now
            </a>
          ` : ''}
          <a href="https://leap-lounge.vercel.app/opportunity/${opp.id}" style="background-color: #ffffff; color: #000000; border: 2px solid #000000; padding: 10px 24px; text-decoration: none; border-radius: 8px; font-family: monospace; font-weight: bold; text-transform: uppercase; font-size: 12px; display: inline-block;">
            View in LOOP
          </a>
        </div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 40px 20px; background-color: #f3f4f6; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h1 style="font-family: monospace; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; color: #000; margin-bottom: 24px; text-align: center;">
            LOOP Deadlines
          </h1>
          <div style="background-color: #ffffff; border: 2px solid #000000; border-radius: 24px; padding: 32px; margin-bottom: 24px; box-shadow: 4px 4px 0px #000000;">
            <h2 style="font-size: 28px; margin: 0 0 16px 0; color: #000;">
              Hey ${(user.profile?.name || "Student").split(" ")[0]},
            </h2>
            <p style="font-size: 16px; color: #374151; margin: 0 0 24px 0; line-height: 1.5;">
              You have <strong>${reminders.length}</strong> saved opportunit${reminders.length > 1 ? 'ies' : 'y'} closing soon. Don't miss out on your chance to apply!
            </p>
            ${oppsHtml}
          </div>
          <p style="text-align: center; font-size: 12px; color: #6b7280; font-family: monospace;">
            You are receiving this because these opportunities are saved in your LOOP profile.
          </p>
        </div>
      </body>
    </html>
  `;
}

export async function sendDeadlineReminders() {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing. Skipping reminders.");
    return { success: false, reason: "No API Key" };
  }
  
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  const usersCollection = await getUsersCollection();
  const oppsCollection = await getOpportunitiesCollection();
  
  // Find users who have an email in profile and at least one saved opportunity
  const users = await usersCollection.find({
    "profile.email": { $exists: true, $ne: "" },
    "saved.0": { $exists: true }
  }).toArray();

  let emailsSent = 0;

  for (const user of users) {
    if (!user.profile?.email || !user.saved || user.saved.length === 0) continue;

    // Fetch the user's saved opportunities
    const savedOpps = await oppsCollection.find({
      id: { $in: user.saved }
    }).toArray();

    if (!savedOpps.length) continue;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const remindersToProcess: { opp: Opportunity, timeframe: string, daysLeft: number }[] = [];

    for (const opp of savedOpps) {
      if (!opp.deadline) continue;
      
      const deadlineDate = new Date(opp.deadline);
      deadlineDate.setHours(0, 0, 0, 0);

      const daysLeft = differenceInCalendarDays(deadlineDate, today);

      // We only care about 1 day before or ON the deadline
      if (daysLeft === 1 || daysLeft === 0) {
        const timeframe = `${daysLeft}d`;
        
        const userReminders = user.remindersSent || {};
        const oppReminders = userReminders[opp.id] || [];

        // Check if we already sent this specific reminder
        if (!oppReminders.includes(timeframe)) {
          remindersToProcess.push({ opp, timeframe, daysLeft });
        }
      }
    }

    if (remindersToProcess.length > 0) {
      // Sort by nearest deadline
      remindersToProcess.sort((a, b) => a.daysLeft - b.daysLeft);

      const html = generateEmailHTML(user, remindersToProcess);

      try {
        await resendClient.emails.send({
          from: EMAIL_FROM,
          to: user.profile.email,
          subject: `⏳ ${remindersToProcess.length} Deadline${remindersToProcess.length > 1 ? 's' : ''} Approaching - LOOP`,
          html,
        });

        // Update MongoDB state to mark these reminders as sent
        const updateDoc: any = {};
        for (const rem of remindersToProcess) {
          const field = `remindersSent.${rem.opp.id}`;
          updateDoc[field] = rem.timeframe; // We'll use $push to append
        }

        await usersCollection.updateOne(
          { _id: user._id },
          { 
            $push: updateDoc 
          }
        );

        emailsSent++;
      } catch (err) {
        console.error(`Failed to send email to ${user.profile.email}:`, err);
      }
    }
  }

  return { success: true, emailsSent };
}
