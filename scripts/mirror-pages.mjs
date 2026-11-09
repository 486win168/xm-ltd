import puppeteer from "puppeteer-core";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";

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
  "/goto/profile/tw",
  "/goto/members/tw",
  "/goto/partners/tw",
];

function process(html) {
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<base href="[^"]*">/i, "");
  html = html.replace(/media="print"/g, 'media="all"');
  html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/gi, "");
  html = html.replace(/\b(href|src)="https:\/\/(www\.)?xm\.com\//g, '$1="/');
  html = html.replace(/\b(href|src)="https:\/\/(www\.)?xm\.com"/g, '$1="/');
  html = html.replace(
    /href="apple-touch-icon-180\.png"/,
    'href="https://www.xm.com/ng-public/commits/latest/browser/apple-touch-icon-180.png"'
  );
  return html;
}

const browser = await puppeteer.connect({
  browserURL: "http://127.0.0.1:9222",
  defaultViewport: { width: 1440, height: 900 },
});

for (const p of paths) {
  const out = p === "/" ? "mirror/index.html" : "mirror" + p + "/index.html";
  if (existsSync(out)) {
    console.log("SKIP", p, "->", out);
    continue;
  }
  const page = await browser.newPage();
  const errs = [];
  try {
    await page.goto("https://www.xm.com" + p, { waitUntil: "domcontentloaded", timeout: 45000 });
  } catch (e) {
    errs.push(e.message.slice(0, 80));
  }
  await new Promise((r) => setTimeout(r, 5000));
  try {
    await page.evaluate(async () => {
      await new Promise((res) => {
        let y = 0;
        const t = setInterval(() => {
          window.scrollBy(0, 700);
          y += 700;
          if (y > document.body.scrollHeight + 800) {
            clearInterval(t);
            res();
          }
        }, 70);
      });
    });
  } catch {}
  await new Promise((r) => setTimeout(r, 1200));
  let finalUrl = "";
  let html = "";
  try {
    finalUrl = page.url();
  } catch {}
  try {
    html = await page.evaluate(() => "<!DOCTYPE html>\n" + document.documentElement.outerHTML);
  } catch (e) {
    errs.push("eval:" + e.message.slice(0, 60));
  }
  try {
    await page.close();
  } catch {}
  if (!html) {
    console.log("FAIL", p, errs.join(";"));
    continue;
  }

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, process(html));
  console.log(
    "OK",
    p,
    "->",
    out,
    "len",
    html.length,
    "final",
    finalUrl.replace("https://www.xm.com", ""),
    errs.length ? "ERR:" + errs.join(";") : ""
  );
}
await browser.disconnect();
console.log("DONE");
