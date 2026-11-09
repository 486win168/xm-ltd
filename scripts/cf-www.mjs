import puppeteer from "puppeteer-core";

const zone = "xm-ltd.com";
const zoneId = "3283fef6dea9ee2f8e28a18d996d11b8";
const TARGET = "xm-ltd.pages.dev";
const name = "www." + zone;

const browser = await puppeteer.connect({ browserURL: "http://127.0.0.1:9222", defaultViewport: null });
const pages = await browser.pages();
let page = pages.find((p) => p.url().startsWith("https://dash.cloudflare.com"));
if (!page) {
  page = await browser.newPage();
  await page.goto("https://dash.cloudflare.com/", { waitUntil: "domcontentloaded" });
}
await page.bringToFront();

const out = await page.evaluate(
  async (zoneId, name, TARGET) => {
    const base = "https://dash.cloudflare.com/api/v4";
    const H = { "Content-Type": "application/json", "x-cross-site-security": "dash" };
    async function api(path, method = "GET", body) {
      const r = await fetch(base + path, { method, headers: H, credentials: "include", body: body ? JSON.stringify(body) : undefined });
      let j = null; try { j = await r.json(); } catch {}
      return { status: r.status, ok: r.ok, json: j };
    }
    const recs = await api(`/zones/${zoneId}/dns_records?per_page=100`);
    const has = (recs.json?.result || []).some((r) => r.name === name);
    if (has) return { exists: true };
    const c = await api(`/zones/${zoneId}/dns_records`, "POST", { type: "CNAME", name, content: TARGET, proxied: false, ttl: 1, comment: "pages clone www" });
    return { status: c.status, ok: c.ok, errors: c.json?.errors, result: c.json?.result };
  },
  zoneId,
  name,
  TARGET
);

console.log(JSON.stringify(out, null, 2));
await browser.disconnect();
