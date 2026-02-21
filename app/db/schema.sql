-- 用户角色表
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- 初始化角色 (忽略已存在)
INSERT OR IGNORE INTO roles (name) VALUES ('buyer'), ('creator'), ('admin');

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  wechat_id TEXT,
  xiaohongshu_id TEXT,
  role_id INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 图解表
CREATE TABLE IF NOT EXISTS patterns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creator_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price REAL,
  file_path TEXT NOT NULL, -- 在 R2 中的路径/键
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- 授权表
CREATE TABLE IF NOT EXISTS authorizations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pattern_id INTEGER NOT NULL,
  buyer_id INTEGER NOT NULL,
  authorized_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  download_count INTEGER DEFAULT 0,
  FOREIGN KEY (pattern_id) REFERENCES patterns(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id)
);

-- 黑名单表
CREATE TABLE IF NOT EXISTS blacklist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reported_user_id INTEGER NOT NULL,
  reporter_id INTEGER NOT NULL, -- 举报人，必须是原创织女
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reported_user_id) REFERENCES users(id),
  FOREIGN KEY (reporter_id) REFERENCES users(id)
);
