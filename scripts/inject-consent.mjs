import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MARK = "data-xm-consent";
const SNIP =
  `<script ${MARK}>(function(){try{var n=["xmck_functional","xmck_analytical","xmck_promotional","xmck_preferences","xmck_popupShown"],c=document.cookie;for(var i=0;i<n.length;i++){if(c.indexOf(n[i]+"=")<0){document.cookie=n[i]+"=1; path=/; max-age=31536000; SameSite=Lax";}}}catch(e){}})();</script>`;

let n = 0;
function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (p.endsWith(".html")) {
      let c = readFileSync(p, "utf8");
      if (c.includes(MARK)) continue;
      c = c.replace(/<head>/i, "<head>" + SNIP);
      writeFileSync(p, c);
      n++;
    }
  }
}
walk(process.argv[2] || "site");
console.log("injected:", n);
