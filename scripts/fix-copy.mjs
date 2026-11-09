import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FROM = "領取歡迎贈金*";
const TO = "領取 50% 贈金高達 $200";
let n = 0;
function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (p.endsWith(".html")) {
      const c = readFileSync(p, "utf8");
      const c2 = c.split(FROM).join(TO);
      if (c2 !== c) {
        writeFileSync(p, c2);
        n++;
      }
    }
  }
}
walk(process.argv[2] || "site");
console.log("files changed:", n);
