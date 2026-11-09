import puppeteer from "puppeteer-core";

const zone = "xm-ltd.com";

const browser = await puppeteer.connect({
  browserURL: "http://127.0.0.1:9222",
  defaultViewport: null,
});
const pages = await browser.pages();
let page = pages.find((p) => p.url().startsWith("https://dash.cloudflare.com"));
if (!page) {
  page = await browser.newPage();
  await page.goto("https://dash.cloudflare.com/", { waitUntil: "domcontentloaded" });
}
await page.bringToFront();

const info = await page.evaluate(async (zone) => {
  const base = "https://dash.cloudflare.com/api/v4";
  const H = { "Content-Type": "application/json", "x-cross-site-security": "dash" };
  async function api(path) {
    const r = await fetch(base + path, { headers: H, credentials: "include" });
    let j = null;
    try { j = await r.json(); } catch {}
    return { status: r.status, json: j };
  }
  const out = {};
  const z = await api("/zones?name=" + zone);
  const zr = z.json?.result?.[0];
  out.zoneId = zr?.id;
  out.accountId = zr?.account?.id;
  if (!out.accountId) return out;
  const acc = out.accountId;
  const zd = out.zoneId;

  const dom = await api(`/accounts/${acc}/workers/domains`);
  out.workerDomains = (dom.json?.result || []).map((d) => ({
    hostname: d.hostname, service: d.service, id: d.id, environment: d.environment,
  }));

  const scr = await api(`/accounts/${acc}/workers/scripts`);
  out.workers = (scr.json?.result || []).map((s) => s.id);

  const rou = await api(`/zones/${zd}/workers/routes`);
  out.routes = (rou.json?.result || []).map((r) => ({ pattern: r.pattern, script: r.script }));

  const pg = await api(`/accounts/${acc}/pages/projects`);
  out.pages = (pg.json?.result || []).map((p) => ({ name: p.name, subdomain: p.subdomain, domains: p.domains }));

  return out;
}, zone);

console.log(JSON.stringify(info, null, 2));
await browser.disconnect();
