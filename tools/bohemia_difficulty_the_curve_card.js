#!/usr/bin/env node
// DIFFICULTY [the curve] 11/3 -- the VOTE card: the three levels side by side, what each changes in plain words, and the before-and-
// after curve of a Lone Wolf and a full crew to day 30 (won in 100 on the day's hardest job, the live fight, AUTO both sides), read
// from the two banks tools/bohemia_difficulty_the_curve.js wrote. Writes the page and a phone-shaped picture of it.
//   node tools/bohemia_difficulty_the_curve_card.js
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const B = J('banks/BOHEMIA_DIFFICULTY_THE_CURVE_BEFORE_11_3_26.json'), A = J('banks/BOHEMIA_DIFFICULTY_THE_CURVE_AFTER_11_3_26.json');
const PM = J('records/target/bb/party_math.json'), LV = PM.difficulty_levels.value;
const skullsOn = d => d <= 3 ? 1 : d <= 7 ? 2 : 3;
const series = (bank, key, level) => bank.cells.filter(c => c.key === key && c.level === level && c.skulls === skullsOn(c.day)).sort((a, b) => a.day - b.day);
const W = 120, H = 70, X = d => 22 + (d - 1) / 29 * (W - 30), Y = v => 8 + (100 - v) / 100 * (H - 26);
function chart(key, level, label) {
  const b = series(B, key, level), a = series(A, key, level);
  const line = (s, cls) => '<polyline class="' + cls + '" points="' + s.map(c => X(c.day).toFixed(1) + ',' + Y(c.won).toFixed(1)).join(' ') + '"/>';
  const at = (s, d) => { const c = s.filter(x => x.day === d)[0]; return c ? c.won : '-'; };
  let g = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="ch">';
  [0, 50, 100].forEach(v => { g += '<line class="grid" x1="14" x2="' + (W - 2) + '" y1="' + Y(v) + '" y2="' + Y(v) + '"/><text class="ax" x="0" y="' + (Y(v) + 2.5) + '">' + v + '</text>'; });
  g += '<line class="seventy" x1="14" x2="' + (W - 2) + '" y1="' + Y(70) + '" y2="' + Y(70) + '"/>';
  [1, 10, 20, 30].forEach(d => { g += '<text class="ax" x="' + (X(d) - 4) + '" y="' + (H - 2) + '">D' + d + '</text>'; });
  g += line(b, 'bef') + line(a, 'aft') + '</svg>';
  return '<div class="cell"><div class="cl">' + label + '</div>' + g + '<div class="nums">D20 ' + at(b, 20) + '&rarr;<b>' + at(a, 20) + '</b> D30 ' + at(b, 30) + '&rarr;<b>' + at(a, 30) + '</b></div></div>';
}
const rows = '<div class="cols">' + LV.map(l => '<section><h2>' + l.name + '</h2><ul>' + (l.changes || []).map(x => '<li>' + x + '</li>').join('') + '</ul>'
  + chart('wolf', l.id, 'LONE WOLF') + chart('crew', l.id, 'FULL CREW') + '</section>').join('') + '</div>';
const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
  + '<title>Three Difficulties</title><style>'
  + ':root{--bg:#0d0b09;--ink:#e9dcc2;--dim:#9a8d78;--amber:#e8b85e;--grey:#6d665c;--red:#b2483a}'
  + 'body{margin:0;background:var(--bg);color:var(--ink);font:11px/1.35 ui-monospace,Menlo,monospace}'
  + '.wrap{width:390px;box-sizing:border-box;padding:14px 10px 14px}'
  + 'h1{font-size:15px;letter-spacing:2px;margin:0 0 4px}.sub{color:var(--dim);font-size:10px;margin:0 0 8px}'
  + '.key{display:flex;gap:12px;font-size:9.5px;color:var(--dim);margin:0 0 8px}.key i{display:inline-block;width:16px;height:2px;vertical-align:middle;margin-right:4px}'
  + '.cols{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}section{border-top:2px solid #3a3025;padding-top:6px}'
  + 'h2{font-size:11.5px;letter-spacing:1px;margin:0 0 4px;color:var(--amber)}'
  + 'ul{margin:0 0 6px;padding-left:10px;font-size:9.5px;line-height:1.3;color:var(--ink);min-height:118px}li{margin-bottom:3px}'
  + '.cell{margin:2px 0 8px}.cl{font-size:9px;letter-spacing:1px;color:var(--dim)}.nums{font-size:9px;color:var(--dim)}.nums b{color:var(--amber)}'
  + '.ch{width:100%;height:auto;display:block}.grid{stroke:#2a241d;stroke-width:.6}.seventy{stroke:var(--red);stroke-width:.7;stroke-dasharray:2 2;opacity:.8}'
  + '.ax{fill:var(--dim);font-size:6px}.bef{fill:none;stroke:var(--grey);stroke-width:1.2;stroke-dasharray:3 2}.aft{fill:none;stroke:var(--amber);stroke-width:1.6}'
  + '</style></head><body><div class="wrap"><h1>THREE DIFFICULTIES</h1>'
  + '<p class="sub">Behind the gear: SETTINGS, FIGHTS. Change it any time; it holds from the next fight. Lines: won in 100 on the day\'s hardest job, the real fight, ' + A.n + ' fights a point.</p>'
  + '<div class="key"><span><i style="background:var(--grey)"></i>BEFORE</span><span><i style="background:var(--amber)"></i>NOW</span><span><i style="background:var(--red)"></i>70 IN 100</span></div>'
  + rows + '</div></body></html>';
const page = path.join(ROOT, 'slices/BOHEMIA_DIFFICULTY_THE_CURVE_11_3_26.html');
fs.writeFileSync(page, html);
(async () => {
  const { chromium } = require('playwright');
  const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await pg.goto('file://' + page); const h = await pg.evaluate(() => document.body.scrollHeight);
  await pg.setViewportSize({ width: 390, height: h });
  const dir = path.join(ROOT, 'records/target/difficulty_curve_11_3'); fs.mkdirSync(dir, { recursive: true });
  const png = path.join(dir, 'card.png'); await pg.screenshot({ path: png, fullPage: true }); await br.close();
  require('child_process').execFileSync('python3', ['-c', 'import sys;from PIL import Image;Image.open(sys.argv[1]).save(sys.argv[2],"WEBP",quality=82)', png, path.join(dir, 'card.webp')]);
  fs.unlinkSync(png);
  console.log('wrote', path.relative(ROOT, page), 'and records/target/difficulty_curve_11_3/card.*');
})();
