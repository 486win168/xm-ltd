import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SNIP =
  `<script data-xm-consent>(function(){try{var d=document;var set=function(k,v){if(d.cookie.indexOf(k+"=")<0){d.cookie=k+"="+v+"; path=/; max-age=31536000; SameSite=Lax";}};set("XM_AKAMAI_VISITOR_COUNTRY","TW");["xmck_functional","xmck_analytical","xmck_promotional","xmck_preferences","xmck_popupShown"].forEach(function(k){set(k,"1");});}catch(e){}})();</script>`;

let n = 0;
function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (p.endsWith(".html")) {
      let c = readFileSync(p, "utf8");
      if (/<script data-xm-consent>[\s\S]*?<\/script>/.test(c)) {
        const c2 = c.replace(/<script data-xm-consent>[\s\S]*?<\/script>/, SNIP);
        if (c2 !== c) { writeFileSync(p, c2); n++; }
      } else {
        writeFileSync(p, c.replace(/<head>/i, "<head>" + SNIP));
        n++;
      }
    }
  }
}
walk(process.argv[2] || "site");
console.log("processed:", n);
