import puppeteer from "puppeteer-core";

const zone = "xm-ltd.com";
const acc = "d464242750c83f73dfc764e570bedc0d";
const domId = "8e861a27cc303e09910af6c1c1dc6a80c4c6bd62"; // workers/domains id for xm-ltd.com
const TARGET = "xm-ltd.pages.dev";

const browser = await puppeteer.connect({ browserURL: "http://127.0.0.1:9222", defaultViewport: null });
const pages = await browser.pages();
let page = pages.find((p) => p.url().startsWith("https://dash.cloudflare.com"));
if (!page) {
  page = await browser.newPage();
  await page.goto("https://dash.cloudflare.com/", { waitUntil: "domcontentloaded" });
}
await page.bringToFront();

const out = await page.evaluate(
  async (zone, acc, domId, TARGET) => {
    const base = "https://dash.cloudflare.com/api/v4";
    const H = { "Content-Type": "application/json", "x-cross-site-security": "dash" };
    async function api(path, method = "GET", body) {
      const r = await fetch(base + path, {
        method,
        headers: H,
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
      });
      let j = null;
      try { j = await r.json(); } catch {}
      return { status: r.status, ok: r.ok, json: j };
    }
    const res = {};

    const del = await api(`/accounts/${acc}/workers/domains/${domId}`, "DELETE");
    res.deleteWorkerDomain = { status: del.status, ok: del.ok, errors: del.json?.errors };

    await new Promise((r) => setTimeout(r, 5000));

    const z = await api("/zones?name=" + zone);
    const zid = z.json?.result?.[0]?.id;
    res.zoneId = zid;

    const recs = await api(`/zones/${zid}/dns_records?per_page=100`);
    res.afterDelete = (recs.json?.result || []).map((r) => ({ id: r.id, type: r.type, name: r.name, content: r.content, proxied: r.proxied }));

    res.deletions = [];
    for (const r of (recs.json?.result || []).filter((r) => r.name === zone)) {
      const d = await api(`/zones/${zid}/dns_records/${r.id}`, "DELETE");
      res.deletions.push({ deleted: r.type + " " + r.content, status: d.status });
    }

    const c = await api(`/zones/${zid}/dns_records`, "POST", {
      type: "CNAME",
      name: zone,
      content: TARGET,
      proxied: false,
      ttl: 1,
      comment: "pages clone",
    });
    res.createCname = { status: c.status, ok: c.ok, errors: c.json?.errors, result: c.json?.result };

    const final = await api(`/zones/${zid}/dns_records?per_page=100`);
    res.final = (final.json?.result || []).map((r) => ({ type: r.type, name: r.name, content: r.content, proxied: r.proxied }));
    return res;
  },
  zone,
  acc,
  domId,
  TARGET
);

console.log(JSON.stringify(out, null, 2));
await browser.disconnect();
