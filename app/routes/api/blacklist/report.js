import { json } from "@remix-run/cloudflare";
import { requireUser } from "~/lib/session";
import { createBlacklistEntry } from "~/lib/db";

export async function action({ request, context }) {
  const { userId } = await requireUser(request, ["creator"]);

  const { reported_user_id, reason } = await request.json();

  if (!reported_user_id) {
    return json({ error: "Reported user ID is required" }, 400);
  }

  await createBlacklistEntry(context.env.DB, {
    reported_user_id,
    reporter_id: userId,
    reason,
  });

  return json({ success: true, message: "User reported successfully." }, 201);
}
