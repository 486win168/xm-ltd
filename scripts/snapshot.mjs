import puppeteer from "puppeteer-core";
import { writeFileSync } from "node:fs";

const out = process.argv[2];
const browser = await puppeteer.connect({
  browserURL: "http://127.0.0.1:9222",
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.goto("https://www.xm.com/tw", { waitUntil: "networkidle2", timeout: 60000 }).catch(() => {});
await new Promise((r) => setTimeout(r, 6000));
await page.evaluate(async () => {
  await new Promise((res) => {
    let y = 0;
    const t = setInterval(() => {
      window.scrollBy(0, 500);
      y += 500;
      if (y > document.body.scrollHeight + 1000) {
        clearInterval(t);
        res();
      }
    }, 80);
  });
});
await new Promise((r) => setTimeout(r, 3000));
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 1000));
const html = await page.evaluate(() => "<!DOCTYPE html>\n" + document.documentElement.outerHTML);
writeFileSync(out, html);
console.log("saved", out, "len", html.length);
await page.close();
await browser.disconnect();
