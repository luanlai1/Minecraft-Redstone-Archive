# 乱来的投影档案馆 · Redstone Archive

![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs&logoColor=white)
![Vue Router](https://img.shields.io/badge/Vue_Router-4-42b883?logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/source-TypeScript-3178C6?logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/status-frontend_prototype-orange)

> 一个用 **Vue 3 + Vite** 写的 Minecraft 红石作品档案馆。
> 图文卡片陈列作品，每个作品配一张图、视频链接与投影下载链接，并公开显示下载量。
>
> 当前是**纯前端原型（MVP）**：数据来自本地 Mock，登录为前端校验，Spring Boot 后端已设计但尚未实现。

## 目录

- [项目简介](#项目简介)
- [核心特性](#核心特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [页面与路由](#页面与路由)
- [管理档案馆登录](#管理档案馆登录)
- [目录结构](#目录结构)
- [数据模型](#数据模型)
- [想改哪里，改哪个文件](#想改哪里改哪个文件)
- [设计规范摘要](#设计规范摘要)
- [接后端要做的事](#接后端要做的事)
- [已知限制与后续方向](#已知限制与后续方向)

## 项目简介

红石作品（机械、投影存档、结构装置）平时散落在视频平台、网盘和本地文件夹里，想找的时候很难翻。
这个档案馆把它们收在一处：**一个作品 = 一张图 + 标题 + 分类 + 标签**，可筛选、可搜索，点进去能看视频、下存档。

目标只有一个：**做得像一个「有质感」的个人档案馆，而不是一个堆功能的工具站**。
所以视觉上刻意克制（暗色 + 红石红点缀），动效统一、过渡平滑，并且有三条不可动摇的规则：

| 规则 | 含义 |
| --- | --- |
| **一个作品 = 一张图** | 没有轮播、没有画廊，卡片与后台上传都只有一张图 |
| **每个作品都显示下载量** | 为 0 也显示，不隐藏、不留空 |
| **列表固定按上传时间倒序** | `createdAt DESC, id DESC`，**不提供任何排序功能** |

## 核心特性

**前台**

- 首页：主文案 + 统计条 + 作者卡片 + 「好玩的投影」（最多 3 个，取 `featured`）
- 更多投影：响应式网格（3 / 2 / 1 列）、关键词搜索（300ms 防抖）、分类筛选、标签筛选、空状态
- 作品详情：单张大图、信息条（分类 · 标签 · 下载量 · 发布时间）、下载存档、相关作品横向滑动
- 关于：作者介绍 + GitHub / Bilibili / KooK 三个链接 + 站点说明
- 下载量三处统一展示：卡片右下角、详情页信息条、后台表格列
  - 数字进入视口时做 `0 → N` 计数动画（600ms、`ease-out`）
  - `≥ 10000` 显示为 `1.3万`，`1000` 显示为 `1,000`
  - 等宽数字（`tabular-nums`）+ 固定宽度容器，`+1` 时卡片不会抖
  - 点击「下载存档」先上报计数再跳转；**计数失败不阻塞下载**，仍然跳转
- 回到顶部、Toast 反馈、空状态插画、骨架屏（不用转圈）

**后台（原型）**

- 登录守卫：未登录访问 `/admin` 自动跳到 `/login?redirect=...`，登录后跳回原页面
- 作品表格：含**下载量列**（仅展示，表头不可排序），顺序与前台一致
- 新增作品：单图上传（本地 `FileReader` 预览）、字段表单、校验与 Toast 反馈

**工程与体验**

- 统一动效规范：页面切换淡入 + 上移 8px（250ms）、卡片悬停 `-4px`、列表滚动错峰入场（`v-reveal`，带 1.5s 兜底）
- 只动 `transform` / `opacity`，不动布局属性；尊重 `prefers-reduced-motion`
- 导航栏滚动后变毛玻璃（`backdrop-filter: blur(12px)`），≤900px 折叠为汉堡菜单
- 图片懒加载：首屏前几张 `eager`，其余原生 `loading="lazy"`
- 响应式断点：1200 / 992 / 768 / 480
- **hash 路由**，构建产物丢到任意静态服务器都能跑，不需要 Nginx 之类的 rewrite 配置

## 技术栈

| 依赖 | 版本 | 说明 |
| --- | --- | --- |
| `vue` | ^3.5 | 框架本体（`<script setup>` + `ref` / `computed`） |
| `vue-router` | ^4.5 | 路由与登录守卫，**hash 模式** |
| `vite` | ^6.0 | 开发服务器 + 打包 |
| `@vitejs/plugin-vue` | ^6.0 | 编译 `.vue` 单文件组件 |

- **没有任何 UI 组件库**（无 Element Plus、无 Naive UI、无 Tailwind）。
  按钮、卡片、输入框、胶囊、表格全部是 `src/styles/global.css` 的类 + 各组件的 `<style scoped>`，
  换一个 CSS 变量就能全站生效，也不会被第三方库的样式权重干扰。
- 状态管理用 Vue 响应式模块（`ref` / `computed` / `reactive`），规模还小，未引入 Pinia。
- 源码是 TypeScript + `tsconfig`，由 Vite（esbuild）转译；当前 npm 脚本里**没有**类型检查命令。

## 快速开始

需要 **Node.js 18+**（开发环境用的是 Node 24）和一个现代浏览器。

```bash
# 安装依赖（npm / pnpm 都可以）
npm install

# 启动开发服务器（热更新）
npm run dev
# → http://127.0.0.1:5199/
```

| 命令 | 干什么 |
| --- | --- |
| `npm run dev` | 开发服务器（HMR），`127.0.0.1:5199` |
| `npm run build` | 生产构建，输出到 `dist/`（`base: './'`，开启 sourcemap） |
| `npm run preview` | 本地预览构建产物（同样是 5199） |
| `npm run serve` | 固定 `127.0.0.1:5199` 且 `strictPort` 的开发服务器 |

> 端口写死在 `vite.config.ts` 的 `server.port` / `preview.port`，并开了 `strictPort`——
> 5199 被占用时进程会直接报错退出，而不是悄悄换端口。

### 调样式时的加速开关

URL 上带 `?mock=fast` 会把模拟接口延迟归零：

```text
http://127.0.0.1:5199/#/works?mock=fast
```

正常访问才有 420ms 的模拟延迟，用来展示骨架屏；做自动化渲染验证时用 `mock=fast` 可以避免依赖定时器时序。

## 页面与路由

路由用 hash 模式，所以实际地址形如 `http://127.0.0.1:5199/#/works`。

| 路由 | 页面 | 内容要点 | 权限 |
| --- | --- | --- | --- |
| `#/` | 首页 | 主文案 + 统计条 + 作者卡片 + 好玩的投影（最多 3 个） | 公开 |
| `#/works` | 更多投影 | 搜索、分类筛选、标签筛选、空状态，无排序控件 | 公开 |
| `#/works/:id` | 作品详情 | 大图、信息条（含下载量）、下载存档、相关作品 | 公开 |
| `#/about` | 关于 | 作者介绍 + GitHub / Bilibili / KooK + 站点说明 | 公开 |
| `#/login` | 管理档案馆登录 | 管理员账户 + 密码（带显示/隐藏切换） | 公开 |
| `#/admin` | 管理档案馆 | 作品表格（含下载量列，按上传时间倒序） | **需登录** |
| `#/admin?panel=new` | 管理档案馆 · 新增作品 | 单个上传框 + 字段表单 | **需登录** |
| 其它任意地址 | — | 重定向回首页 | — |

## 管理档案馆登录

游客访问 `#/admin` 会被路由守卫拦到登录页，凭证在前端 Mock 校验：

```text
地址：http://127.0.0.1:5199/#/admin
账户：admin
密码：admin123
```

登录态存在 `sessionStorage`（关掉标签页即失效），导航栏会出现绿色在线点与「退出」按钮。

> ⚠️ 这只是原型阶段的挡板，**只防普通游客，不是真正的鉴权**。
> 上线时必须换成 `POST /api/admin/login` 签发 JWT，并删除 `config/profile.ts` 里的 `DEMO_ADMIN`。

## 目录结构

```text
frontend/
├── index.html              页面外壳（标题、meta、#app 挂载点）
├── package.json            依赖与脚本
├── vite.config.ts          Vite 配置：别名 @、端口 5199、文件监听忽略规则
├── tsconfig*.json          TypeScript 配置
├── public/img/*.svg        6 张作品占位图（构建时原样拷到 dist/）
└── src/
    ├── main.ts             入口：装路由 → 注册 v-reveal → 引入全局样式 → 挂载
    ├── App.vue             外壳：AppNav + RouterView（页面过渡）+ BackToTop + ToastLayer
    ├── env.d.ts            TypeScript 类型声明
    ├── config/profile.ts   ★ 站点文案、作者信息、社交链接、演示账号
    ├── data/mockWorks.ts   Mock 作品数据（6 条）
    ├── store/
    │   ├── work.ts         ★ 作品数据、固定倒序、下载计数
    │   └── auth.ts         登录态（sessionStorage）
    ├── router/index.ts     路由表 + 登录守卫 + scrollBehavior
    ├── styles/global.css   ★ 设计 token + 全局类
    ├── utils/
    │   ├── format.ts       数字格式化（千分位 / 万位）
    │   └── ui.ts           toast() 与 v-reveal 滚动入场指令
    ├── components/         7 个组件
    └── pages/              6 个页面
```

**组件**：`AppNav`（导航 + 汉堡菜单）、`WorkCard`（作品卡片）、`DownloadCount`（下载量 + 计数动画）、
`SkeletonCard`（卡片骨架）、`EmptyState`（空状态）、`BackToTop`（回到顶部）、`ToastLayer`（提示条容器）。

**页面**：`HomeView`、`WorkListView`、`WorkDetailView`、`AboutView`、`LoginView`、`AdminPreviewView`。

## 数据模型

`src/data/mockWorks.ts` 里的 `Work` 接口与后端表结构一一对应：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | number | ✅ | 主键 |
| `title` | string | ✅ | 作品标题，≤ 200 字符 |
| `image` | string | ✅ | **作品图片（单张）**，值为 URL |
| `description` | string | ❌ | 作品描述，`\n\n` 分段，详情页自动拆成多段 |
| `videoUrl` | string | ❌ | 视频链接（B 站等） |
| `downloadUrl` | string | ❌ | 投影存档下载链接 |
| `category` | string | ❌ | 分类，如「活塞门」「红石机械」 |
| `tags` | string[] | ❌ | 标签数组，如 `['1.20', '静音']` |
| `featured` | boolean | ❌ | 是否精选（首页「好玩的投影」取它） |
| `downloadCount` | number | 系统维护 | 累计下载量，默认 0，**表单里不出现、不可编辑** |
| `createdAt` | string | ✅ | 上传时间，`yyyy-MM-dd HH:mm:ss`，排序依据 |

Mock 数据里 `id=3` 的下载量故意设成 `12840`，用来验证 `1.3万` 的显示格式；
数组顺序不重要，`store/work.ts` 会按 `createdAt` 重新排序。

排序逻辑就这几行：

```ts
function sortedByTimeDesc(list: Work[]): Work[] {
  return [...list].sort((a, b) => {
    if (a.createdAt === b.createdAt) return b.id - a.id // 同一秒用 id 兜底，保证顺序稳定
    return a.createdAt < b.createdAt ? 1 : -1 // 时间越晚越靠前
  })
}
```

## 想改哪里，改哪个文件

| 我想改…… | 去改这个文件 |
| --- | --- |
| 站名、标语、首页简介、关于页正文 | `src/config/profile.ts` → `SITE` |
| 作者昵称、头像、简介 | `src/config/profile.ts` → `AUTHOR`（头像换成图片：放进 `src/assets/`，改 import） |
| GitHub / Bilibili / KooK 链接 | `src/config/profile.ts` → `LINKS` |
| 管理员演示账号 | `src/config/profile.ts` → `DEMO_ADMIN` |
| 配色 / 圆角 / 阴影 / 缓动 / 时长 | `src/styles/global.css` 顶部的 CSS 变量 |
| 作品数据 | `src/data/mockWorks.ts` |
| 导航菜单项 | `src/components/AppNav.vue` |
| 路由、登录拦截范围 | `src/router/index.ts` |
| 下载量显示格式（万位等） | `src/utils/format.ts` |
| 浏览器标签页标题、meta | `index.html` |
| 端口号 | `vite.config.ts`（`server.port` 与 `preview.port`） |
| 首页「好玩的投影」个数 | `src/pages/HomeView.vue`（`slice(0, 3)`） |
| 卡片显示几个标签 | `src/components/WorkCard.vue`（`tags.slice(0, 2)`） |

## 设计规范摘要

**配色**（全部走 CSS 变量，改 `--color-primary` 就能全站换主色）

| 用途 | 颜色 |
| --- | --- |
| 主背景 | `#0F1115` |
| 卡片背景 | `#1A1D24` |
| 主强调色（红石红） | `#FF4B4B` |
| 次强调色（链接/次要按钮） | `#4B9FFF` |
| 主文字 / 次文字 | `#E8EAED` / `#9AA0A6` |
| 分割线 | `#2A2E37` |
| 成功 / 警告 / 错误 | `#4CAF50` / `#FFB020` / `#E63946` |

**动效**：统一缓动 `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`；
悬停 150ms、点击 100ms、卡片浮起 200ms、页面切换 250ms、列表入场 300ms（错峰 30–50ms）、下载量计数 600ms。

**布局**：页面最大宽度 1200px，卡片间距 24px，圆角 12px（卡片）/ 8px（按钮、图片）。

**无障碍**：键盘可操作、对比度达标、`prefers-reduced-motion` 下全站动画降到 0.01ms。

> 下载量的计数动画刻意用 `setInterval` 而不是 `requestAnimationFrame`：
> rAF 在无头浏览器、后台标签页里可能完全不执行，数字会永远停在 0。
> 现在的写法是「初始就渲染真实数字，动画只是从头数一遍的视觉包装」，最坏情况只是少一次动画。

## 接后端要做的事

数据层已经全部集中在 store 里，页面代码一行都不用改，只需要替换这三处：

| 顺序 | 文件 | 做什么 |
| --- | --- | --- |
| 1 | `src/store/work.ts` | 把 `fetchWorks` / `fetchWork` / `countDownload` / `addWork` 里的 Mock 换成真实 `fetch()`；删掉 `setMockSpeed` |
| 2 | `src/store/auth.ts` | `login()` 改调 `POST /api/admin/login` 并保存 JWT，后续请求带 `Authorization: Bearer <token>`；`logout()` 清 token |
| 3 | `src/pages/AdminPreviewView.vue` | 图片上传从 `FileReader` 转 base64，换成 `POST /api/admin/upload`（multipart，字段名 `file`），用返回的 `url` 提交 |

前端字段命名已经按接口设计（`image` / `downloadCount` / `videoUrl` / `downloadUrl`），**不需要改字段名**。
计划的接口清单：

| 接口 | 说明 |
| --- | --- |
| `GET /api/works` | 作品列表（`page` / `size` / `category` / `featured` / `keyword` / `tag`，**没有 `sort` 参数**） |
| `GET /api/works/{id}` | 作品详情 |
| `GET /api/works/featured?limit=3` | 首页「好玩的投影」 |
| `GET /api/works/{id}/related?limit=8` | 相关作品（同分类，排除自身） |
| `GET /api/categories` | 分类列表 |
| `POST /api/works/{id}/download` | 下载计数：原子自增 + 同一 IP 60 秒去重，返回最新值与 `counted` 标记 |
| `POST /api/admin/login` | 登录，签发 JWT |
| `GET/POST/PUT/DELETE /api/admin/works[/{id}]` | 后台作品增删改查 |
| `PATCH /api/admin/works/{id}/featured` | 切换精选 |
| `POST /api/admin/upload` | 单张图片上传（jpg / png / webp / gif，≤ 5MB，UUID 重命名） |
| `PATCH /api/admin/works/{id}/download-count` | 重置下载量（二次确认后调用） |

统一响应体 `{ "code": 0, "message": "ok", "data": {} }`；
`downloadCount` 只读——新增/修改接口的 DTO 里不包含该字段，防止被前端伪造。

> 后端建表照着 `Work` 接口来即可：`work(id, title, image, description, video_url, download_url, category, tags, featured, download_count, created_at, updated_at)`，
> `tags` 存 JSON 数组字符串，`created_at` 建索引（列表固定时间倒序）；**下载量只展示、不参与排序，不需要索引**。

## 已知限制与后续方向

**限制**

- 数据全部是本地 Mock，刷新后下载量会回到初始值
- 登录是前端 Mock 校验，只用于挡住游客；真实鉴权需接后端 JWT
- 后台有「机器投影管理 / 新增机器投影」两个面板，**编辑、删除为占位交互**（删除按钮只弹提示）
- 作品图片是 `public/img/*.svg` 占位图，上线时替换为真实渲染图
- 作者信息与三个社交链接（GitHub / Bilibili / KooK）仍是 `your-...` 占位值，待替换
- 仓库目前**没有自动化测试脚本**，布局与动效请在浏览器里确认
- 未引入 UI 组件库：MVP 用自写组件 + CSS 变量；后台控件变多时可切 Naive UI 并覆盖暗色主题

**后续方向**

- 补齐 Spring Boot 后端（MySQL + JWT + 上传 + 下载计数），前端按上面三处改造接入
- 后台编辑 / 删除 / 精选切换 / 下载量重置的完整交互
- 多图演进：保留 `image` 作封面，新增 `work_image` 表，详情页再加画廊
- 下载明细表 `work_download_log`：支持下载趋势图、IP 去重与防刷
- 标签规范化（独立 `tag` 表）、全文检索、对象存储、亮色主题

---

*如果这个档案馆对你有用，欢迎点个 Star；机器投影都可以直接下载使用。*
