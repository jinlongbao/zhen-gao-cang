import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

// Fetch data on the server
export async function loader({ context }) {
  // const { results } = await context.env.DB.prepare("SELECT * FROM blacklist").all();
  // For now, using mock data
  const mockBlacklist = [
    { reported_username: 'scammer123', reporter_username: 'original_creator', reason: '盗图倒卖', created_at: new Date().toISOString() },
    { reported_username: 'thief456', reporter_username: 'another_creator', reason: '二次修改后出售', created_at: new Date().toISOString() },
  ];
  return json({ blacklist: mockBlacklist });
}

export default function Blacklist() {
  const { blacklist } = useLoaderData();

  return (
    <div className="container">
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
          {blacklist.length > 0 ? (
            blacklist.map((entry, index) => (
              <tr key={index}>
                <td>{entry.reported_username}</td>
                <td>{entry.reporter_username}</td>
                <td>{entry.reason || 'N/A'}</td>
                <td>{new Date(entry.created_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">当前黑名单为空。</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
