import { json } from "@remix-run/cloudflare";
import { getUserByUsername } from "~/lib/db"; // Assuming db functions are in lib
import { createSession } from "~/lib/session"; // Assuming session functions are in lib

export async function action({ request, context }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const { username, password } = await request.json();

  if (!username || !password) {
    return json({ error: "Username and password are required" }, 400);
  }

  // In a real app, you'd have password hashing. This is simplified.
  const user = await getUserByUsername(context.env.DB, username);

  if (!user || user.password_hash !== password) { // Simplified password check
    return json({ error: "Invalid credentials" }, 401);
  }

  return await createSession(context, user.id, user.role_name);
}
