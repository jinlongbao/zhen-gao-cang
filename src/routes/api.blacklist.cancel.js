import { json } from "@remix-run/node";
import { getSession } from "../lib/session";

async function cancelReport(d1, { reporterId, reportedUserId }) {
    const result = await d1.prepare(
        'DELETE FROM blacklist WHERE reporter_id = ? AND reported_user_id = ?'
    ).bind(reporterId, reportedUserId).run();

    if (result.meta.changes === 0) {
        throw new Error("Report not found or you do not have permission to cancel it.");
    }

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

        if (!reportedUserId) {
            return json({ success: false, message: "Missing reported user ID." }, { status: 400 });
        }

        await cancelReport(context.env.DB, { reporterId: userId, reportedUserId });

        return json({ success: true });

    } catch (error) {
        console.error(error);
        return json({ success: false, message: error.message }, { status: 400 });
    }
}
