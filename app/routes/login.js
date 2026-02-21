export function get(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>登录</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <div class="container">
                <h1>登录</h1>
                <form id="login-form">
                    <label for="username">用户名</label>
                    <input type="text" id="username" name="username" required>
                    <label for="password">密码</label>
                    <input type="password" id="password" name="password" required>
                    <button type="submit">登录</button>
                    <p id="error-message" class="error"></p>
                </form>
                <p>没有账户？ <a href="/register">注册</a></p>
            </div>
            <script>
                const form = document.getElementById('login-form');
                const errorMessage = document.getElementById('error-message');

                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    errorMessage.textContent = '';

                    const username = form.username.value;
                    const password = form.password.value;

                    try {
                        const response = await fetch('/api/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, password })
                        });

                        if (response.ok) {
                            window.location.href = '/'; // Redirect to home or a dashboard
                        } else {
                            const data = await response.json();
                            errorMessage.textContent = data.message || '登录失败';
                        }
                    } catch (error) {
                        errorMessage.textContent = '发生错误，请重试';
                    }
                });
            </script>
        </body>
        </html>
    `);
}