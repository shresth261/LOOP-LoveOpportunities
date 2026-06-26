import * as dotenv from 'dotenv';
import { sendDeadlineReminders } from '../lib/server/email';

dotenv.config();

async function main() {
  console.log("Starting deadline reminders job...");
  const startTime = Date.now();

  try {
    const result = await sendDeadlineReminders();
    console.log(`Reminders completed successfully in ${Date.now() - startTime}ms`);
    console.log(`Result:`, result);
    process.exit(0);
  } catch (err) {
    console.error("Failed to run deadline reminders:", err);
    process.exit(1);
  }
}

main();
