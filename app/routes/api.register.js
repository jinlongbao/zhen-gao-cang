import { json } from "@remix-run/node";
import { hashPassword, createUser } from "../lib/auth";

export async function action({ request, context }) {
  try {
    const body = await request.formData();
    const username = body.get("username");
    const password = body.get("password");
    const role = body.get("role"); // 'buyer' or 'creator'

    if (!username || !password || !role) {
      return json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    if (password.length < 6) {
        return json({ success: false, message: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    // In a real app, you'd have a more robust way to map roles to IDs.
    const roleId = role === 'creator' ? 2 : 1;

    await createUser(context.env.DB, { username, passwordHash, roleId });

    return json({ success: true });
  } catch (error) {
    console.error(error);
    // Check for unique constraint violation
    if (error.message.includes("UNIQUE constraint failed")) {
        return json({ success: false, message: "Username already exists." }, { status: 409 });
    }
    return json({ success: false, message: "An unexpected error occurred." }, { status: 500 });
  }
}
