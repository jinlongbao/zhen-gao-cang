import { json } from "@remix-run/cloudflare";
import { requireUser } from "~/lib/session";
import { createPattern } from "~/lib/db";

export async function action({ request, context }) {
  const { userId, userRole } = await requireUser(request, ["creator"]);

  const formData = await request.formData();
  const file = formData.get("file");
  const title = formData.get("title");
  const description = formData.get("description");
  const price = formData.get("price");

  if (!file || !title) {
    return json({ error: "File and title are required" }, 400);
  }

  const filePath = `patterns/${userId}/${Date.now()}_${file.name}`;

  await context.env.R2_BUCKET.put(filePath, await file.arrayBuffer());

  const pattern = await createPattern(context.env.DB, {
    creator_id: userId,
    title,
    description,
    price: parseFloat(price) || 0,
    file_path: filePath,
  });

  return json({ success: true, message: "Pattern uploaded successfully." }, 201);
}
