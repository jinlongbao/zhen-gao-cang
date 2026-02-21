# 任务列表: 织女高仓平台

- [x] **任务 1: 项目基础设置**
  - [x] 初始化项目，创建 `package.json`。
  - [x] 建立清晰的目录结构 (`src`, `public`, `src/routes`, `src/lib`, `src/db` 等)。
  - [x] 定义 D1 数据库的 `schema.sql`，包含 `users`, `roles`, `patterns`, `authorizations`, `blacklist` 表。

- [x] **任务 2: 用户认证系统**
  - [x] 实现用户注册 API (`/api/register`)，包括输入验证、密码哈希和数据库写入。
  - [x] 实现用户登录 API (`/api/login`)，包括凭证验证和会话创建。
  - [x] 创建会话管理模块 (`src/lib/session.js`)，用于在应用中共享会话逻辑。
  - [x] 创建用户认证相关的辅助函数模块 (`src/lib/auth.js`)。

- [x] **任务 3: 前端基础页面**
  - [x] 创建基础 CSS 样式 (`public/styles.css`)。
  - [x] 创建应用的主布局和首页 (`src/routes/_index.js`)。
  - [x] 创建用户注册页面 (`src/routes/register.js`)，并实现与后端 API 的交互。
  - [x] 创建用户登录页面 (`src/routes/login.js`)，并实现与后端 API 的交互。

- [x] **任务 4: 核心功能 - 图解上传**
  - [x] 创建模拟 R2 上传的模块 (`src/lib/r2.js`)。
  - [x] 实现图解上传 API (`/api/patterns/upload`)，处理文件流，并调用模拟的 R2 模块，最后将元数据写入数据库。

- [x] **任务 5: 核心功能 - 水印与下载**
  - [x] 创建模拟添加水印的模块 (`src/lib/watermark.js`)。
  - [x] 实现图解下载 API (`/api/patterns/:patternId/download`)，包含授权检查、文件读取、调用水印模块和触发下载的完整流程。

- [x] **任务 6: 黑名单系统**
  - [x] 实现举报用户的 API (`/api/blacklist/report`)。
  - [x] 实现取消举报的 API (`/api/blacklist/cancel`)。
  - [x] 创建公开的黑名单展示页面 (`/routes/blacklist.js`)，从数据库动态加载数据。

- [x] **任务 7: 管理员后台**
  - [x] 创建管理员仪表盘首页 (`/routes/admin/_index.js`)，并加入严格的权限验证。
  - [x] 创建用户管理页面 (`/routes/admin/users.js`)，以表格形式展示所有用户。

# 任务依赖
- **任务 2** 依赖 **任务 1**
- **任务 3** 依赖 **任务 2** (需要 API 进行交互)
- **任务 4** 依赖 **任务 1** 和 **任务 2** (需要数据库和用户认证)
- **任务 5** 依赖 **任务 4** (需要有已上传的图解)
- **任务 6** 依赖 **任务 2** (需要用户认证)
- **任务 7** 依赖 **任务 2** (需要用户认证和角色系统)
