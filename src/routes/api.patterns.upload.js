import { json, unstable_parseMultipartFormData, unstable_createFileUploadHandler } from "@remix-run/node";
import { uploadStreamToR2 } from "../lib/r2";
import { getSession } from "../lib/session"; // We will create this helper

async function r2UploadHandler({ name, contentType, data }) {
    if (name !== 'file') {
        return undefined;
    }
    const uploadedFileKey = await uploadStreamToR2(data, contentType);
    return uploadedFileKey;
}

async function createPattern(d1, { title, description, price, filePath, creatorId }) {
    const result = await d1.prepare(
        'INSERT INTO patterns (title, description, price, file_path, creator_id) VALUES (?, ?, ?, ?, ?)'
    ).bind(title, description, price, filePath, creatorId).run();
    return result;
}

export async function action({ request, context }) {
    try {
        const session = await getSession(request.headers.get("Cookie"));
        const userId = session.get("userId");

        if (!userId) {
            return json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const formData = await unstable_parseMultipartFormData(request, r2UploadHandler);

        const title = formData.get("title");
        const description = formData.get("description");
        const price = parseFloat(formData.get("price"));
        const filePath = formData.get("file");

        if (!title || !price || !filePath) {
            return json({ success: false, message: "Missing required fields." }, { status: 400 });
        }

        const result = await createPattern(context.env.DB, {
            title,
            description,
            price,
            filePath,
            creatorId: userId
        });

        return json({ success: true, pattern: { id: result.meta.last_row_id, title } });

    } catch (error) {
        console.error(error);
        return json({ success: false, message: "An unexpected error occurred during upload." }, { status: 500 });
    }
}
