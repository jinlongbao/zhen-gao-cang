import { json } from "@remix-run/node";
import { getSession } from "../lib/session";

async function reportUser(d1, { reporterId, reportedUserId, reason }) {
    // First, check if the reporter is a creator.
    const reporter = await d1.prepare('SELECT role_id FROM users WHERE id = ?').bind(reporterId).first();
    if (reporter.role_id !== 2) { // 2 = creator
        throw new Error("Only creators can report users.");
    }

    // Prevent reporting oneself.
    if (reporterId === reportedUserId) {
        throw new Error("You cannot report yourself.");
    }

    // Check if this report already exists.
    const existingReport = await d1.prepare(
        'SELECT id FROM blacklist WHERE reporter_id = ? AND reported_user_id = ?'
    ).bind(reporterId, reportedUserId).first();

    if (existingReport) {
        throw new Error("You have already reported this user.");
    }

    const result = await d1.prepare(
        'INSERT INTO blacklist (reporter_id, reported_user_id, reason) VALUES (?, ?, ?)'
    ).bind(reporterId, reportedUserId, reason).run();

    return result;
}

export async function action({ request, context }) {
    try {
        const session = await getSession(request.headers.get("Cookie"));
        const userId = session.get("userId");

        if (!userId) {
            return json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.formData();
        const reportedUserId = parseInt(body.get("reportedUserId"));
        const reason = body.get("reason");

        if (!reportedUserId) {
            return json({ success: false, message: "Missing reported user ID." }, { status: 400 });
        }

        await reportUser(context.env.DB, { reporterId: userId, reportedUserId, reason });

        return json({ success: true });

    } catch (error) {
        console.error(error);
        return json({ success: false, message: error.message }, { status: 400 });
    }
}
