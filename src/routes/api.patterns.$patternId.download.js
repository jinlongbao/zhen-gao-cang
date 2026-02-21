import { json } from "@remix-run/node";
import { getSession } from "../lib/session";
import { addWatermark } from "../lib/watermark";
import fs from "fs/promises";
import path from "path";

async function getPatternAndAuthorization(d1, patternId, userId) {
    const pattern = await d1.prepare('SELECT * FROM patterns WHERE id = ?').bind(patternId).first();
    if (!pattern) {
        throw new Error("Pattern not found");
    }

    const authorization = await d1.prepare(
        'SELECT * FROM authorizations WHERE pattern_id = ? AND buyer_id = ?'
    ).bind(patternId, userId).first();

    return { pattern, authorization };
}

export async function loader({ request, context, params }) {
    try {
        const session = await getSession(request.headers.get("Cookie"));
        const userId = session.get("userId");

        if (!userId) {
            return json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { pattern, authorization } = await getPatternAndAuthorization(context.env.DB, params.patternId, userId);

        if (!authorization) {
            return json({ success: false, message: "Not authorized to download this pattern." }, { status: 403 });
        }

        // Mock R2: Read the file from the local tmp directory
        const localPath = path.join('tmp', pattern.file_path);
        const fileBuffer = await fs.readFile(localPath);

        // Get watermark text from the user's profile
        const user = await context.env.DB.prepare('SELECT wechat_id, xiaohongshu_id FROM users WHERE id = ?').bind(userId).first();
        const watermarkText = user.wechat_id || user.xiaohongshu_id || `user:${userId}`;

        const watermarkedFileBuffer = await addWatermark(fileBuffer, watermarkText);

        // In a real app, you might want to update the download count here.

        return new Response(watermarkedFileBuffer, {
            headers: {
                "Content-Type": "application/octet-stream", // or the actual file type
                "Content-Disposition": `attachment; filename="${pattern.title}-watermarked.jpg"`, // Adjust filename and extension
            },
        });

    } catch (error) {
        console.error(error);
        if (error.message.includes("Pattern not found")) {
            return json({ success: false, message: error.message }, { status: 404 });
        }
        return json({ success: false, message: "An unexpected error occurred." }, { status: 500 });
    }
}
