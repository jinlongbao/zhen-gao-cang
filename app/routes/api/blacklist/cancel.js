import { json } from "@remix-run/cloudflare";
import { requireUser } from "~/lib/session";
import { getBlacklistEntry, deleteBlacklistEntry } from "~/lib/db";

export async function action({ request, context }) {
  const { userId, userRole } = await requireUser(request);
  const { report_id } = await request.json();

  if (!report_id) {
    return json({ error: "Report ID is required" }, 400);
  }

  const entry = await getBlacklistEntry(context.env.DB, report_id);
  if (!entry) {
    return json({ error: "Report not found" }, 404);
  }

  // Allow admin or original reporter to cancel
  if (userRole !== 'admin' && entry.reporter_id !== userId) {
    return json({ error: "Forbidden" }, 403);
  }

  await deleteBlacklistEntry(context.env.DB, report_id);

  return json({ success: true, message: "Report cancelled successfully." });
}
