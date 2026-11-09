# xm-ltd.com — XM（繁體中文）網站 1:1 靜態鏡像

把 `https://www.xm.com/tw` 官方網站做 **1:1 靜態鏡像**，部署到 `https://xm-ltd.com`，全程零成本。
站內連結**留在自己的網域**（`xm-ltd.com`），不再跳回官方。

## 驗證（與官方逐項比對）

- 首頁 `document.body.innerText`：1259 字元（與官方相同）、逐行差異：0（僅多出官方 lazy-load 未顯示的 6 行獎項名稱）
- H1 位置／字級／字色、`body.scrollHeight`（5481）：與官方相同
- 標題、字型、樣式表媒體（`all`）、圖片數、無破圖：與官方相同

## 做法

用真實瀏覽器（Opera GX 遠端除錯 CDP）載入官方頁、等 Angular 渲染出**最終中文 DOM**，擷取快照後處理：

- 移除 `<script>`（純靜態）、移除 `<base>`、`media="print"` → `all`、移除 CSP meta
- 將所有 `https://www.xm.com/...` 的 `href/src` 改寫為根相對路徑（留在本網域）

## 目錄

- `mirror/` — 部署內容
  - `index.html` — 首頁
  - `tw/...`、`goto/...` — 已鏡像的站內頁面（含開戶 / 登入 / 代理）
- `scripts/snapshot.mjs` — 擷取單頁渲染後 DOM
- `scripts/process-mirror.mjs` — 單頁後處理
- `scripts/mirror-pages.mjs` — 批次鏡像全站並改寫連結
- `scripts/list-links.mjs` — 列出頁面內站內連結
- `scripts/cf-*.mjs` — Cloudflare 儀表板 API（DNS）輔助

## 重新產生鏡像（需以除錯埠開著的 Opera GX）

```bash
# Windows：以遠端除錯埠啟動 Opera GX
& "$env:LOCALAPPDATA\Programs\Opera GX\opera.exe" --remote-debugging-port=9222

npm i -D puppeteer-core
node scripts/mirror-pages.mjs        # 會跳過已存在的頁面；要全重抓請先刪 mirror/
```

## 部署（Cloudflare Pages，免費）

```bash
npx wrangler pages deploy mirror --project-name xm-ltd --branch main
```

## 自訂網域（一次性）

Cloudflare DNS（Proxy 選 **DNS only**）：

- `CNAME  @   → xm-ltd.pages.dev`
- `CNAME  www → xm-ltd.pages.dev`

apex 上若有 Worker 管理的記錄需先移除；SSL 由 Cloudflare 自動簽發。

## 成本

| 項目 | 方案 | 成本 |
| --- | --- | --- |
| 主機 | Cloudflare Pages | $0 |
| 網域 DNS | Cloudflare | $0 |
| SSL | Cloudflare 自動 | $0 |

## 注意

- 圖片／字型／樣式表引用官方 CDN（`cloud.xm-cdn.com`），若官方改路徑可能失效。
- 純靜態快照不含官方 Angular 互動 JS（下拉選單展開等）；版面與文字與官方一致。
- 開戶/登入為官方 SPA 的快照，其內部再跳轉的下一層路徑不一定已鏡像（其餘一律留站內或到官方）。
