import { json, redirect } from "@remix-run/node";
import { getSession } from "../lib/session";

// A simple admin authorization check
async function requireAdmin(request, context) {
    const session = await getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");

    if (!userId) {
        throw redirect("/login");
    }

    const user = await context.env.DB.prepare('SELECT role_id FROM users WHERE id = ?').bind(userId).first();

    // 3 = admin role
    if (user.role_id !== 3) {
        // You might want to redirect to a generic "not found" or "unauthorized" page
        throw redirect("/");
    }

    return userId;
}

function renderAdminPage(body) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>管理员后台</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <div class="container">
                <header>
                    <h1>管理员后台</h1>
                    <nav>
                        <a href="/">返回主站</a>
                    </nav>
                </header>
                <main>
                    ${body}
                </main>
            </div>
        </body>
        </html>
    `;
}

export async function loader({ request, context }) {
    await requireAdmin(request, context);

    const dashboardBody = `
        <h2>欢迎, 管理员!</h2>
        <p>这是您的管理仪表盘。请从这里开始管理您的网站。</p>
        <ul>
            <li><a href="/admin/users">用户管理</a></li>
            <li><a href="/admin/authorizations">原创织女授权管理</a></li>
            <li><a href="/admin/reports">举报管理</a></li>
        </ul>
    `;

    const html = renderAdminPage(dashboardBody);
    return new Response(html, { headers: { "Content-Type": "text/html" } });
}
