# xm-ltd.com — XM（繁體中文）首頁 1:1 靜態複刻

將 `https://www.xm.com/tw` 官方首頁做 **1:1 靜態鏡像**，部署到 `https://xm-ltd.com`，全程零成本。

驗證方式為與官方頁面比對「可見文字、DOM、關鍵版面尺寸」，結果完全一致：

- `document.body.innerText`：1259 字元（與官方相同）
- 可見文字逐行差��：0
- H1 位置／字級／字色、`body.scrollHeight`（5481）：與官方相同
- 標題、字型、樣式表媒體（`all`）、圖片數、無破圖：與官方相同

## 這是什麼

- 以真實瀏覽器載入官方頁面、等 Angular 完成渲染後，**擷取最終 DOM 快照**，再去除 `<script>`、把 `media="print"` 改為 `all`、`<base>` 指向官方網域、移除 CSP。
- 產物為單一 `mirror/index.html`，純靜態、可獨立託管。
- 因 `<base href="https://www.xm.com/...">`，頁內資源與所有連結仍指向官方網域；點「立即開始」會前往官方 `https://www.xm.com/goto/profile/tw`。

## 目錄

- `mirror/index.html` — 部署用首頁（1:1 靜態鏡像）
- `mirror/render.html` — 瀏覽器渲染後的原始快照
- `scripts/snapshot.mjs` — 用 Opera GX（CDP 9222）擷取官方頁面渲染後 DOM
- `scripts/process-mirror.mjs` — 後處理成可託管的靜態頁
- `scripts/cf-*.mjs` — 透過 Cloudflare 儀表板 API 管理 DNS 的輔助腳本
- `src/`, `next.config.mjs` 等 — 早期 Next.js 版本（保留，非目前部署來源）

## 重新產生鏡像（需先以除錯埠開著的 Opera GX）

```bash
# 以遠端除錯埠啟動 Opera GX
& "$env:LOCALAPPDATA\Programs\Opera GX\opera.exe" --remote-debugging-port=9222

npm i -D puppeteer-core
node scripts/snapshot.mjs mirror/render.html
node scripts/process-mirror.mjs mirror/render.html mirror/index.html
```

## 部署（Cloudflare Pages，免費）

```bash
npx wrangler pages deploy mirror --project-name xm-ltd --branch main
```

## 自訂網域（一次性）

Cloudflare DNS（Proxy 選 **DNS only**）：

- `CNAME  @   → xm-ltd.pages.dev`
- `CNAME  www → xm-ltd.pages.dev`

SSL 由 Cloudflare 自動簽發。apex 上若有 Worker 管理的記錄需先移除。

## 成本

| 項目 | 方案 | 成本 |
| --- | --- | --- |
| 主機 | Cloudflare Pages | $0 |
| 網域 DNS | Cloudflare | $0 |
| SSL | Cloudflare 自動 | $0 |

## 注意

- 圖片／字型／樣式表引用官方 CDN（`cloud.xm-cdn.com`），若官方改路徑可能失效。
- 純靜態快照不含官方 Angular 的互動 JS（下拉選單展開等）；版面與文字與官方一致。
- 頁內連結指向官方網域（白標鏡像）；如需全部留在 `xm-ltd.com` 需另做路由鏡像。
