import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

export async function loader({ request, context }) {
    // await requireAdmin(request, context);
    // const { results } = await context.env.DB.prepare("SELECT * FROM users").all();
    const mockUsers = [
        { id: 1, username: 'testuser', role_name: 'buyer', created_at: new Date().toISOString() },
        { id: 2, username: 'creator1', role_name: 'creator', created_at: new Date().toISOString() },
    ];
    return json({ users: mockUsers });
}

export default function AdminUsers() {
  const { users } = useLoaderData();

  return (
    <div>
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
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.role_name}</td>
                        <td>{new Date(user.created_at).toLocaleString()}</td>
                        <td><button disabled>编辑</button> <button disabled>删除</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}
