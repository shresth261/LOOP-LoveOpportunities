import { createAPIFileRoute } from "@tanstack/react-start/api";
import { sendDeadlineReminders } from "@/lib/server/email";

export const APIRoute = createAPIFileRoute("/api/cron/reminders")({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");

    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret) {
      console.warn("CRON_SECRET is not configured in environment variables");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (secret !== expectedSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    try {
      const result = await sendDeadlineReminders();
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("Cron Error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
});
