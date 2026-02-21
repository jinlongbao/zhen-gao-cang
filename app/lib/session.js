import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare";

// This should be a secret in your environment variables
const sessionSecret = process.env.SESSION_SECRET || "SUPER_SECRET_DEV_STRING";

const storage = createCookieSessionStorage({
  cookie: {
    name: "ZG_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

export async function createSession(context, userId, role) {
  const session = await storage.getSession();
  session.set("userId", userId);
  session.set("role", role);
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getUserSession(request) {
    return storage.getSession(request.headers.get("Cookie"));
}

export async function requireUser(request, roles = []) {
    const session = await getUserSession(request);
    const userId = session.get("userId");
    const userRole = session.get("role");

    if (!userId) {
        throw redirect("/login");
    }

    if (roles.length > 0 && !roles.includes(userRole)) {
        throw new Response("Forbidden", { status: 403 });
    }

    return { userId, userRole };
}
