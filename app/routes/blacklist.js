// Since we can't use JSX, we'll manually construct HTML strings.

function renderPage(body) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>黑名单 - 织女高仓</title>
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
                    <h1>织女高仓 · 黑名单</h1>
                    <nav>
                        <a href="/">首页</a> | 
                        <a href="/login">登录</a> | 
                        <a href="/register">注册</a>
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

async function getBlacklist(d1) {
    const results = await d1.prepare(`
        SELECT
            b.id,
            u_reported.username AS reported_username,
            u_reporter.username AS reporter_username,
            b.reason,
            b.created_at
        FROM blacklist AS b
        JOIN users AS u_reported ON b.reported_user_id = u_reported.id
        JOIN users AS u_reporter ON b.reporter_id = u_reporter.id
        ORDER BY b.created_at DESC
    `).all();
    return results.results;
}

export async function loader({ context }) {
    try {
        const blacklist = await getBlacklist(context.env.DB);

        let tableRows = blacklist.map(entry => `
            <tr>
                <td>${entry.reported_username}</td>
                <td>${entry.reporter_username}</td>
                <td>${entry.reason || 'N/A'}</td>
                <td>${new Date(entry.created_at).toLocaleString()}</td>
            </tr>
        `).join('');

        if (blacklist.length === 0) {
            tableRows = '<tr><td colspan="4">当前黑名单为空。</td></tr>';
        }

        const blacklistBody = `
            <h2>公开黑名单</h2>
            <p>以下用户因涉嫌盗图倒卖等行为被举报。请在交易时保持警惕。</p>
            <table>
                <thead>
                    <tr>
                        <th>被举报用户</th>
                        <th>举报人 (原创织女)</th>
                        <th>原因</th>
                        <th>举报时间</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;
        const html = renderPage(blacklistBody);
        return new Response(html, { headers: { "Content-Type": "text/html" } });
    } catch (error) {
        console.error(error);
        const html = renderPage(`<h2>加载失败</h2><p>无法加载黑名单信息，请稍后再试。</p>`);
        return new Response(html, { headers: { "Content-Type": "text/html" }, status: 500 });
    }
}
