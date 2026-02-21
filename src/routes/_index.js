export function get(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>首页</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <div class="container">
                <h1>欢迎</h1>
                <p><a href="/login">登录</a> 或 <a href="/register">注册</a></p>
            </div>
        </body>
        </html>
    `);
}