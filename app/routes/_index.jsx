export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>欢迎来到织女高仓</h1>
      <p>这是一个为原创织女设计的图解保护和分发平台。</p>
      <p>原创织女可以上传自己的作品，并授权给购买方下载。下载时，系统会自动为图解添加购买方的社交账号水印，有效防止盗图和二次销售。</p>
      <nav>
        <a href="/login">登录</a> | <a href="/register">注册</a> | <a href="/blacklist">黑名单</a>
      </nav>
    </div>
  );
}
