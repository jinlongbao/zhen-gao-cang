export function get(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>注册</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <div class="container">
                <h1>创建账户</h1>
                <form id="register-form">
                    <label for="username">用户名</label>
                    <input type="text" id="username" name="username" required>
                    <label for="password">密码</label>
                    <input type="password" id="password" name="password" required>
                    <button type="submit">注册</button>
                    <p id="error-message" class="error"></p>
                </form>
                <p>已有账户？ <a href="/login">登录</a></p>
            </div>
            <script>
                const form = document.getElementById('register-form');
                const errorMessage = document.getElementById('error-message');

                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    errorMessage.textContent = '';

                    const username = form.username.value;
                    const password = form.password.value;

                    try {
                        const response = await fetch('/api/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, password })
                        });

                        if (response.ok) {
                            window.location.href = '/login';
                        } else {
                            const data = await response.json();
                            errorMessage.textContent = data.message || '注册失败';
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