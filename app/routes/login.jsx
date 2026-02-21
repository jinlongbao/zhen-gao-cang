import { Form, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

// This is the server-side action that handles the form submission
export async function action({ request, context }) {
  const body = await request.formData();
  const username = body.get("username");
  const password = body.get("password");

  if (!username || !password) {
    return json({ error: "请输入用户名和密码。" }, { status: 400 });
  }

  // In a real app, you would verify the user against the database
  // For now, we'll use a simple check
  if (password === "password") { // Placeholder check
    // In a real app, you'd create a session here
    return redirect("/dashboard"); // Redirect on success
  }

  return json({ error: "无效的用户名或密码。" }, { status: 401 });
}

// This is the client-side component
export default function Login() {
  const actionData = useActionData();

  return (
    <div className="container">
      <h2>登录</h2>
      <Form method="post" id="login-form">
        <input type="text" name="username" placeholder="用户名" required />
        <input type="password" name="password" placeholder="密码" required />
        <button type="submit">登录</button>
      </Form>
      {actionData?.error && (
        <div id="message" className="error">
          {actionData.error}
        </div>
      )}
    </div>
  );
}
