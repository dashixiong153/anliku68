# 智慧课程案例库智能体

面向职业教育与应用型本科「智慧课程建设」的案例检索 — 研判 — 方案生成 — 客户展示一体化助手。
前端为单页应用,数据托管于 **Supabase 云数据库**,通过 **GitHub Pages** 发布;附带管理后台,支持案例的在线增删改与多人协作。

> 数据来自真实知识库,覆盖 **200 个案例、143 所院校、27 个省级行政区**。
> 严格遵守诚实原则:**不杜撰**,缺失字段统一标「待核实」;可信度为系统自动评估,非人工核验。

---

## ✨ 功能

- 真 3D 可旋转中国地图(three.js,含南海诸岛),点击省份聚焦查看案例分布
- 加权智能推荐引擎(六种策略 + 可解释拆解)
- 决策报告式案例详情、案例对标对比
- 一键生成建设方案(快速 / 申报书 / 汇报型)与分对象汇报话术
- 数据洞察看板(专业 / 层次 / 区域)
- **管理后台**(`admin.html`):登录后在线维护案例数据

---

## 🏗️ 架构

```
浏览器(GitHub Pages 静态托管)
   │  前台 index.html  ──┐
   │  后台 admin.html  ──┤── 通过 @supabase/supabase-js 直连 ──▶  Supabase 云数据库(PostgreSQL)
   └─ 离线回退 ──────────┘                                         · 行级安全:匿名只读,登录可写
```

- 未配置 Supabase 时,前台自动回退到本地 `assets/cases-data.js`,因此**部署后即使没填数据库也能正常展示**。
- 配好 `config.js` 后,前台自动改为从云数据库读取,后台即可登录维护。

---

## 🚀 部署步骤

### 一、创建 Supabase 数据库

1. 打开 [supabase.com](https://supabase.com),用 GitHub 账号登录,**New project**(选离你最近的区域,免费档即可)。
2. 项目就绪后,进入左侧 **SQL Editor**,新建查询:
   - 把 `supabase/schema.sql` 全部内容粘贴进去 → **Run**(建表 + 安全策略)。
   - 再把 `supabase/seed.sql` 全部内容粘贴进去 → **Run**(导入 200 条案例)。
3. 进入 **Project Settings → API**,复制两项备用:
   - `Project URL`
   - `Project API keys` 里的 **anon public** key。
4. 创建管理员账号:进入 **Authentication → Users → Add user**,填写邮箱和密码(供 `admin.html` 登录)。
   - 如提示需要邮箱验证,可在 **Authentication → Providers → Email** 关闭 “Confirm email”,或直接在 Add user 时勾选 Auto Confirm。

### 二、填写站点配置

编辑根目录的 `config.js`,把占位符替换为第 3 步复制的值:

```js
window.SUPABASE_URL = "https://xxxxxxxx.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGci....(很长的一串)";
```

> anon 公钥本就是给前端公开使用的,受 RLS 策略保护,可以安全地提交到 GitHub。

### 三、发布到 GitHub Pages

```bash
# 在本目录执行(已 git init 并完成首次提交)
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git branch -M main
git push -u origin main
```

然后在 GitHub 仓库页面:**Settings → Pages → Build and deployment → Source 选 “Deploy from a branch”**,
Branch 选 `main` / `/ (root)`,保存。约 1 分钟后即可通过
`https://<你的用户名>.github.io/<仓库名>/` 访问前台,
`https://<你的用户名>.github.io/<仓库名>/admin.html` 访问管理后台。

---

## 🗂️ 目录结构

```
.
├── index.html              # 前台(单页应用)
├── admin.html              # 管理后台(登录 + 增删改)
├── config.js               # Supabase 连接配置(填你的 URL / anon key)
├── assets/
│   ├── data-layer.js       # 数据层:封装 Supabase 读写 + 字段映射
│   ├── cases-data.js       # 本地回退数据(也是 seed 来源)
│   ├── china-map.js        # 中国地图几何数据
│   ├── three.min.js        # three.js
│   └── OrbitControls.js    # 相机控制器
├── supabase/
│   ├── schema.sql          # 建表 + RLS 安全策略
│   └── seed.sql            # 200 条案例种子数据
└── README.md
```

---

## 🔒 安全说明

- 数据库启用了**行级安全(RLS)**:匿名访客**只能读**;**只有登录用户能增删改**。
- `config.js` 中的 anon key 是公开密钥,**不要**把 `service_role` 密钥放进前端或仓库。
- 管理员账号通过 Supabase Authentication 管理,可随时增删、改密。

---

## 🛠️ 本地预览

```bash
# 任选其一启动静态服务器,然后浏览器打开 http://localhost:8000
python3 -m http.server 8000
# 或
npx serve .
```

---

## 📄 数据诚实原则

本项目所有数据来源于真实知识库。新增 / 编辑案例时,**请勿编造**教师、职称、荣誉、链接等信息;
不确定的字段请留空或填「待核实」。案例可信度由系统依据“链接可访问性 + 字段完整度”自动评估,**非人工核验**。
