import { json } from "@remix-run/node";
import { createUser } from "~/lib/db"; // Assuming db functions are in lib

export async function action({ request, context }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const { username, password, role } = await request.json();

  if (!username || !password || !role) {
    return json({ error: "Username, password, and role are required" }, 400);
  }
  
  if (password.length < 6) {
      return json({ error: "Password must be at least 6 characters long"}, 400);
  }

  try {
    const newUser = await createUser(context.env.DB, { username, password, role });
    return json({ id: newUser.id, username: newUser.username, role: newUser.role_name }, 201);
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return json({ error: "Username already exists" }, 409);
    }
    return json({ error: "Failed to create user" }, 500);
  }
}
