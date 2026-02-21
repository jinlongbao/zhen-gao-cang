import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";

export async function action({ request, context }) {
  const body = await request.formData();
  const username = body.get("username");
  const password = body.get("password");
  const role = body.get("role");

  if (!username || !password || !role) {
    return json({ error: "缺少必要信息。" }, { status: 400 });
  }
  if (password.length < 6) {
    return json({ error: "密码长度不能少于6位。" }, { status: 400 });
  }

  // TODO: Connect to D1 to create user
  console.log("Creating user (in D1):", { username, role });

  return json({ success: "注册成功！现在您可以登录了。" });
}

export default function Register() {
  const actionData = useActionData();

  return (
    <div className="container">
      <h2>创建新账户</h2>
      <Form method="post" id="register-form">
        <input type="text" name="username" placeholder="用户名" required />
        <input type="password" name="password" placeholder="密码 (最少6位)" required />
        <label>注册为:</label>
        <select name="role">
          <option value="buyer">买家</option>
          <option value="creator">原创织女</option>
        </select>
        <br />
        <button type="submit">注册</button>
      </Form>
      {actionData?.error && (
        <div id="message" className="error">{actionData.error}</div>
      )}
      {actionData?.success && (
        <div id="message" className="success">{actionData.success}</div>
      )}
    </div>
  );
}
