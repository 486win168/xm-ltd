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

## 部署到 xm-ltd.com（免費）

### 方式 A：Vercel（推薦）

1. 將本目錄推送到 GitHub：

   ```bash
   git remote add origin https://github.com/<你的帳號>/xm-ltd.git
   git push -u origin main
   ```

2. 前往 [vercel.com](https://vercel.com)，用 GitHub 登入，點 **Add New → Project**，匯入剛才的倉庫。
3. Framework 會自動識別為 **Next.js**，直接按 **Deploy**。
4. 部署完成後，進入 **Project → Settings → Domains**，新增 `xm-ltd.com`。
5. 依 Vercel 指示，在域名商後台設定 DNS：
   - 根域 `xm-ltd.com`：新增 `A` 記錄指向 `76.76.21.21`
   - 子域 `www`：新增 `CNAME` 指向 `cname.vercel-dns.com`
6. 回到 Vercel 等待 DNS 驗證通過，SSL 憑證會自動簽發。

### 方式 B：Netlify

1. 推送到 GitHub 後，於 [netlify.com](https://netlify.com) 匯入倉庫。
2. Build command：`npm run build`，Publish directory：`.next`（安裝 `@netlify/plugin-nextjs`）。
3. 於 **Domain settings** 新增 `xm-ltd.com`，依指示設定 DNS。

## 技術棧成本

| 項目 | 方案 | 成本 |
| --- | --- | --- |
| 框架 | Next.js + Tailwind CSS | $0 |
| 代碼託管 | GitHub | $0 |
| 主機 | Vercel / Netlify | $0 |
| SSL | Let's Encrypt（自動） | $0 |

## 注意

- 頁面圖片直接引用 XM 官方 CDN（`cloud.xm-cdn.com`），若原站更動路徑可能失效。
- 本複刻為獨立重寫，非直接抄襲官方代碼。
