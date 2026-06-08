/* ============================================================
 * 站点配置 —— 连接 Supabase 云数据库
 * ------------------------------------------------------------
 * 1. 到 https://supabase.com 创建一个免费项目
 * 2. 在 Project Settings → API 里复制 Project URL 和 anon public key
 * 3. 把下面两行的占位符替换为你的真实值,提交即可
 *
 * 说明:anon(匿名)公钥本就是给前端公开使用的,它受数据库
 *      行级安全策略(RLS)保护,可以安全地提交到 GitHub。
 *      只要保持占位符不变,网站会自动回退到本地 cases-data.js,
 *      因此在你配置完成前,GitHub Pages 上也能正常展示。
 * ============================================================ */
window.SUPABASE_URL = "YOUR_SUPABASE_URL";
window.SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
