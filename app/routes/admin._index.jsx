import { Link } from "@remix-run/react";
import { redirect } from "@remix-run/node";

// TODO: Implement real admin check
export async function loader({ request, context }) {
    // const userId = await requireAdmin(request, context);
    return {};
}

export default function AdminIndex() {
  return (
    <div>
        <h2>欢迎, 管理员!</h2>
        <p>这是您的管理仪表盘。请从这里开始管理您的网站。</p>
        <ul>
            <li><Link to="/admin/users">用户管理</Link></li>
            <li><Link to="/admin/authorizations">原创织女授权管理</Link></li>
            <li><Link to="/admin/reports">举报管理</Link></li>
        </ul>
    </div>
  );
}
