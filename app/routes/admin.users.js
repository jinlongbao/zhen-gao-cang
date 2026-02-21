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

    if (user.role_id !== 3) { // 3 = admin
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
            <title>用户管理 - 管理员后台</title>
            <link rel="stylesheet" href="/styles.css">
            <style>
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <h1><a href="/admin">管理员后台</a> &gt; 用户管理</h1>
                </header>
                <main>
                    ${body}
                </main>
            </div>
        </body>
        </html>
    `;
}

async function getUsers(d1) {
    const results = await d1.prepare(`
        SELECT u.id, u.username, r.name as role_name, u.created_at
        FROM users u
        JOIN roles r ON u.role_id = r.id
        ORDER BY u.created_at DESC
    `).all();
    return results.results;
}

export async function loader({ request, context }) {
    await requireAdmin(request, context);
    const users = await getUsers(context.env.DB);

    let tableRows = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.role_name}</td>
            <td>${new Date(user.created_at).toLocaleString()}</td>
            <td><button disabled>编辑</button> <button disabled>删除</button></td>
        </tr>
    `).join('');

    const userManagementBody = `
        <h2>所有用户</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>用户名</th>
                    <th>角色</th>
                    <th>注册时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;

    const html = renderAdminPage(userManagementBody);
    return new Response(html, { headers: { "Content-Type": "text/html" } });
}
