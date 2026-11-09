import puppeteer from "puppeteer-core";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "site";
const paths = [
  "/",
  "/tw",
  "/tw/about",
  "/tw/account-types",
  "/tw/app",
  "/tw/bonus",
  "/tw/careers",
  "/tw/cookie-policy",
  "/tw/execution-policy",
  "/tw/help-center/home",
  "/tw/learning-center",
  "/tw/legal-documents",
  "/tw/mt4",
  "/tw/mt5",
  "/tw/privacy-policy",
  "/tw/promotions",
  "/tw/refer-a-friend",
  "/tw/regulation",
  "/tw/research-portal",
  "/tw/social-competitions",
  "/tw/social-copy-trading",
  "/tw/stable-leverage",
  "/tw/support",
  "/tw/traders-club",
  "/tw/vulnerability-disclosure-policy",
  "/tw/why-trust-us",
  "/tw/xm-awards",
  "/tw/xm-csr",
  "/tw/xm-reviews",
  "/tw/login",
];

const isAsset = (p) =>
  p.startsWith("/ng-public/") ||
  p.startsWith("/pubapi/") ||
  p.startsWith("/payload/") ||
  p.startsWith("/widgets/") ||
  /\.(js|css|png|jpe?g|svg|webp|gif|ico|woff2?|json|txt|map)$/i.test(p);

function saveFile(pathname, buf) {
  const out = OUT + pathname;
  if (existsSync(out)) return false;
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, buf);
  return true;
}

function processHtml(html) {
  html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/gi, "");
  html = html.replace(/media="print"/g, 'media="all"');
  html = html.replace(/\b(href|src)="https:\/\/(www\.)?xm\.com\//g, '$1="/');
  html = html.replace(/\b(href|src)="https:\/\/(www\.)?xm\.com"/g, '$1="/');
  html = html.replace(/領取歡迎贈金\*/g, "領取 50% 贈金高達 $200");
  if (!html.includes("data-xm-consent")) {
    html = html.replace(
      /<head>/i,
      '<head><script data-xm-consent>(function(){try{var d=document;var set=function(k,v){if(d.cookie.indexOf(k+"=")<0){d.cookie=k+"="+v+"; path=/; max-age=31536000; SameSite=Lax";}};set("XM_AKAMAI_VISITOR_COUNTRY","TW");["xmck_functional","xmck_analytical","xmck_promotional","xmck_preferences","xmck_popupShown"].forEach(function(k){set(k,"1");});}catch(e){}})();</script>'
    );
  }
  return html;
}

const browser = await puppeteer.connect({
  browserURL: "http://127.0.0.1:9222",
  defaultViewport: { width: 1440, height: 900 },
});

let assetCount = 0;
const seen = new Set();

async function onResponse(resp) {
  try {
    const url = resp.url();
    if (!url.startsWith("https://www.xm.com/")) return;
    const u = new URL(url);
    const rt = resp.request().resourceType();
    if (rt === "document" || rt === "preflight") return;
    if (u.pathname.startsWith("/akam/") || u.pathname.startsWith("/cdn-cgi/")) return;
    if (!isAsset(u.pathname)) return;
    if (seen.has(u.pathname)) return;
    seen.add(u.pathname);
    const buf = Buffer.from(await resp.buffer());
    if (buf.length) {
      if (saveFile(u.pathname, buf)) assetCount++;
    }
  } catch {}
}

for (const p of paths) {
  const page = await browser.newPage();
  page.on("response", onResponse);

  let serverHtml = null;
  const docPromise = new Promise((resolve) => {
    const t = setTimeout(() => resolve(null), 40000);
    page.on("response", async (r) => {
      if (r.request().resourceType() === "document" && r.url().startsWith("https://www.xm.com/")) {
        try {
          const txt = await r.text();
          clearTimeout(t);
          resolve(txt);
        } catch {
          resolve(null);
        }
      }
    });
  });

  try {
    await page.goto("https://www.xm.com" + p, { waitUntil: "domcontentloaded", timeout: 45000 });
  } catch {}

  let html = await docPromise;
  await new Promise((r) => setTimeout(r, 2500));

  // 觸發 hover 與捲動，讓 lazy chunk 被要求
  try {
    await page.hover("header").catch(() => {});
    await new Promise((r) => setTimeout(r, 800));
  } catch {}
  try {
    await page.evaluate(async () => {
      await new Promise((res) => {
        let y = 0;
        const t = setInterval(() => {
          window.scrollBy(0, 800);
          y += 800;
          if (y > document.body.scrollHeight + 800) {
            clearInterval(t);
            res();
          }
        }, 60);
      });
    });
  } catch {}
  await new Promise((r) => setTimeout(r, 1500));

  if (!html) {
    try {
      html = await page.evaluate(() => "<!DOCTYPE html>\n" + document.documentElement.outerHTML);
    } catch {}
  }
  try {
    await page.close();
  } catch {}

  if (!html) {
    console.log("FAIL", p);
    continue;
  }
  const out = p === "/" ? OUT + "/index.html" : OUT + p.replace(/\/$/, "") + "/index.html";
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, processHtml(html));
  console.log("PAGE", p, "->", out, "len", html.length);
}

await browser.disconnect();
console.log("DONE assets:", assetCount);
