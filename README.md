# XM Taiwan 首頁 & 開戶頁複刻

以 **Next.js 14 (App Router) + Tailwind CSS** 打造的 `xm.com/tw` 首頁與「立即開始」跳轉頁複刻，
專為部署至 **`xm-ltd.com`** 而設計，全程零成本。

## 頁面

- `/` — 首頁（導航列、英雄區大圖、CTA 按鈕）
- `/open-account` — 「立即開始」跳轉後的開戶表單頁

## 本地開發

```bash
npm install
npm run dev      # http://localhost:3000
```

## 生產構建

```bash
npm run build
npm start
```

## 部署到 xm-ltd.com（Cloudflare Pages，免費）

本站以靜態匯出（`next.config.mjs` 的 `output: "export"`）產出 `out/`，直接託管於 Cloudflare Pages。

### 首次部署

```bash
npm run build
npx wrangler pages project create xm-ltd --production-branch main --force
npx wrangler pages deploy out --project-name xm-ltd --branch main
```

### 更新網站

```bash
npm run build
npx wrangler pages deploy out --project-name xm-ltd --branch main
```

### 自訂網域

於 Cloudflare Pages 專案加入自訂網域 `xm-ltd.com` 與 `www.xm-ltd.com`，
並在該網域的 Cloudflare DNS 新增（Proxy 選 **DNS only**）：

- `CNAME  @   → xm-ltd.pages.dev`
- `CNAME  www → xm-ltd.pages.dev`

SSL 由 Cloudflare 自動簽發。務必先移除 apex 上任何由 Worker 管理的記錄。

## 技術棧成本

| 項目 | 方案 | 成本 |
| --- | --- | --- |
| 框架 | Next.js + Tailwind CSS | $0 |
| 代碼託管 | GitHub | $0 |
| 主機 | Cloudflare Pages | $0 |
| SSL | Cloudflare 自動 | $0 |

## 注意

- 頁面圖片直接引用 XM 官方 CDN（`cloud.xm-cdn.com`），若原站更動路徑可能失效。
- 本複刻為獨立重寫，非直接抄襲官方代碼。
