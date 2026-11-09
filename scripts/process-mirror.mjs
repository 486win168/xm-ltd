import { readFileSync, writeFileSync } from "node:fs";

const [inFile, outFile] = process.argv.slice(2);
let html = readFileSync(inFile, "utf8");

// 1) 移除所有 script（改為純靜態，避免 Angular 依賴）
html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

// 2) base 指向官方網域，讓相對/根相對資源與連結延續官方行為
if (/<base href="[^"]*">/.test(html)) {
  html = html.replace(/<base href="[^"]*">/, '<base href="https://www.xm.com/ng-public/commits/latest/browser/">');
} else {
  html = html.replace(/<head>/i, '<head>\n    <base href="https://www.xm.com/ng-public/commits/latest/browser/">');
}

// 3) 完整樣式表立即套用
html = html.replace(/media="print"/g, 'media="all"');

// 4) 移除 CSP meta
html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/gi, "");

// 5) 移除 New Relic 殘留 noscript 註解不會影響，保留

writeFileSync(outFile, html);
console.log("processed", outFile, "from", inFile, "len", html.length);
