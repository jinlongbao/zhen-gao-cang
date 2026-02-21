import { json } from "@remix-run/node";
import { verifyUser, createSession } from "../lib/auth";
// In a real Remix app, you'd import this from a central session management file.
import { createCookieSessionStorage } from "@remix-run/node";

// This is a placeholder. In a real app, the secret would be in an environment variable.
const { getSession, commitSession } = createCookieSessionStorage({
    cookie: {
        name: "__session",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
        sameSite: "lax",
        secrets: ["s3cret1"],
        secure: process.env.NODE_ENV === "production",
    },
});

export async function action({ request, context }) {
    try {
        const body = await request.formData();
        const username = body.get("username");
        const password = body.get("password");

        if (!username || !password) {
            return json({ success: false, message: "Missing username or password." }, { status: 400 });
        }

        const user = await verifyUser(context.env.DB, { username, password });

        const session = await getSession(request.headers.get("Cookie"));
        const headers = await createSession(session, user.id);

        // In a real app, you'd use commitSession and pass the headers to the json response.
        return json({ success: true, user: { id: user.id, username: user.username } }, { headers });

    } catch (error) {
        console.error(error);
        return json({ success: false, message: error.message }, { status: 401 });
    }
}
