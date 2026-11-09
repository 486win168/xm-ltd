# xm-ltd.com — XM（繁體中文）網站 1:1 鏡像

把 `https://www.xm.com/tw` 官方網站做成 **1:1 鏡像（含互動）**，部署到 `https://xm-ltd.com`，零成本。
保留官方 HTML 與 Angular 應用，站內連結留在自己網域。

## 這是什麼

- 從官方頁面取得「伺服器原始 HTML + 其引用之站內資源」，部署到同名路徑。
- 官方 app 的 JS／CSS／圖片多由官方 CDN（`cloud.xm-cdn.com`）以絕對網址提供，鏡像後仍由該 CDN 載入；
  少數走 `www.xm.com` 根相對路徑的資源則鏡像到本網域。
- 因此頁面是「真的在跑官方 app」：下拉選單、hover、cookie 同意、動態區塊都會動。
- `<base>` 保持官方相對值、移除 CSP、`media="print"→all`、並把 `https://www.xm.com/...` 連結改寫為站內相對路徑。

## 驗證（與官方 `/tw` 逐項比對，全部相同）

- 標題、H1 文字／字級／字色／寬度、`body.scrollHeight`（5481）、圖片數（17）、無破圖
- 頁首連結為站內相對路徑（`/tw/...`、`/goto/...`），留在 `xm-ltd.com`
- Angular 正常啟動（`ng-version` 有值），無應用資源 404（僅第三方分析被封）

> `https://xm-ltd.com/` 會以 302 導向 `/tw/`（與官方行為一致），因官方 app 依網址路徑決定語系。

## 目錄

- `site/` — 部署內容（官方 HTML + 鏡像資源 + `_redirects`）
- `scripts/full-mirror.mjs` — 擷取各頁伺服器 HTML 與站內資源
- `scripts/` 其他：`snapshot.mjs`、`process-mirror.mjs`、`mirror-pages.mjs`（早期純靜態快照）、`cf-*.mjs`（DNS）
- `mirror/` — 早期純靜態快照版（保留供對照）

## 重新產生（需以除錯埠開著的 Opera GX）

```powershell
& "$env:LOCALAPPDATA\Programs\Opera GX\opera.exe" --remote-debugging-port=9222

npm i -D puppeteer-core
node scripts/full-mirror.mjs      # 產生 site/
```

## 部署（Cloudflare Pages，免費）

```bash
npx wrangler pages deploy site --project-name xm-ltd --branch main
```

## 自訂網域（一次性）

Cloudflare DNS（Proxy 選 **DNS only**）：

- `CNAME  @   → xm-ltd.pages.dev`
- `CNAME  www → xm-ltd.pages.dev`

apex 若有 Worker 管理的記錄需先移除；SSL 由 Cloudflare 自動簽發。

## 成本

| 項目 | 方案 | 成本 |
| --- | --- | --- |
| 主機 | Cloudflare Pages | $0 |
| 網域 DNS | Cloudflare | $0 |
| SSL | Cloudflare 自動 | $0 |

## 注意

- 圖片／字型／樣式表／JS 多引用官方 CDN，官方改版需重跑鏡像。
- 開頭注入小腳本預先設定 `XM_AKAMAI_VISITOR_COUNTRY=TW`（語言選單國旗狀態與官方一致）並預先同意 Cookie（`xmck_*`），新訪客不顯示 Cookie 橫幅/modal。
- 註冊頁 `/tw/register/profile-account`（另一個子 app，base `/register/`）已一併鏡像；其無副檔名資源以 `site/_headers` 指定正確 MIME（text/css、text/javascript），「立即開始」指向此頁。
- 官方的跑馬燈（獎項、行情）與數字翻牌為即時動畫，截圖比對時會因相位不同而有差異；暫停動畫後與官方幾近像素一致（頂部差異 0.07%）。
- `/pubapi/*`（促銷卡等資料端點）亦已鏡像，避免首頁「獨家心選」少卡。
- 首頁贈金文案可能因官方 A/B（VWO）而與官方當下不同，已烘焙官方版本。
