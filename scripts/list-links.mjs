import { readFileSync } from "node:fs";

const html = readFileSync(process.argv[2], "utf8");
const set = new Set();
for (const m of html.matchAll(/href="([^"]+)"/g)) {
  const x = m[1];
  if (/^(#|mailto:|tel:|javascript:)/.test(x)) continue;
  let u;
  try {
    u = new URL(x, "https://www.xm.com/");
  } catch {
    continue;
  }
  if (/(^|\.)xm\.com$/.test(u.hostname)) set.add(u.pathname);
}
const a = [...set].sort();
console.log(a.join("\n"));
console.log("COUNT", a.length);
