import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const OUT = process.argv[2];
const script = JSON.parse(readFileSync(OUT + "/../script.json", "utf8"));
const base = `<style>*{margin:0;box-sizing:border-box}html,body{width:1920px;height:1080px;background:transparent;font-family:-apple-system,"SF Pro Display","Inter",sans-serif;-webkit-font-smoothing:antialiased}</style>`;
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const shot = async (html, file, transparent = true) => { await p.setContent(base + html); await p.waitForTimeout(150); await p.screenshot({ path: `${OUT}/${file}`, omitBackground: transparent }); };
for (const s of script) {
  await shot(`<div style="position:absolute;left:0;right:0;bottom:64px;display:flex;justify-content:center">
    <div style="max-width:1560px;padding:18px 34px;border-radius:16px;background:rgba(9,13,30,.84);color:#f2f3fb;font-size:42px;line-height:1.3;font-weight:500;text-align:center;letter-spacing:-.2px;box-shadow:0 8px 30px rgba(0,0,0,.35)">${s.text}</div></div>`, `cap-${s.id}.png`);
}
await shot(`<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,8,20,.0) 30%,rgba(5,8,20,.65));"></div>
  <div style="position:absolute;left:120px;bottom:250px;color:#fff">
    <div style="font-size:150px;font-weight:700;letter-spacing:-4px;line-height:1">Keelson</div>
    <div style="margin-top:22px;font-size:46px;font-weight:500;color:#c9c2ff">Your first workflow, in under a minute.</div></div>`, "title.png");
await shot(`<div style="position:absolute;inset:0;background:radial-gradient(1200px 700px at 30% 30%,#1b2350,#0d1429 70%);"></div>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding-left:160px;color:#fff">
    <div style="font-size:140px;font-weight:700;letter-spacing:-4px;color:#9b8eff;line-height:1">Keelson</div>
    <div style="margin-top:18px;font-size:48px;color:#d8dcf0;font-weight:500">A local agent harness.</div>
    <div style="margin-top:70px;display:inline-block;align-self:flex-start;padding:26px 36px;border-radius:14px;background:#0a0f22;border:1px solid #2a3352;font:500 27px 'JetBrains Mono',monospace;color:#d8dcf0;white-space:nowrap">
      <span style="color:#9b8eff">$</span> curl -fsSL https://github.com/danielscholl/keelson/releases/latest/download/install.sh | sh</div>
    <div style="margin-top:44px;font-size:40px;color:#9aa3c7">github.com/danielscholl/keelson</div></div>`, "outro.png", false);
await b.close(); console.log("cards ok");
