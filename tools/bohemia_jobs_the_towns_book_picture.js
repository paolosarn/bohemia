#!/usr/bin/env node
// JOBS [the town's book] 11/17 -- a VOTE card's picture: a phone photograph beside rows of what changed, numbers first (rule 454(a): no
// prose; the words are the fewest labels). node tools/bohemia_jobs_the_towns_book_picture.js --shot <png> --rows <json: [[label, before, after]]>
//   --title <words> --out records/target/<NAME>.jpg
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const SHOT = arg('--shot'), OUT = path.join(ROOT, arg('--out')), ROWS = JSON.parse(fs.readFileSync(arg('--rows'), 'utf8')), TITLE = arg('--title', '');
const shot = 'data:image/png;base64,' + fs.readFileSync(SHOT).toString('base64');
const esc = t => String(t == null ? '' : t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const body = '<table><tr><th></th><th>BEFORE</th><th>NOW</th></tr>' + ROWS.map(r => '<tr><td class="k">' + esc(r[0]) + '</td><td class="b">' + esc(r[1]) + '</td><td class="a">' + esc(r[2]) + '</td></tr>').join('') + '</table>';
const html = '<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#16130f;color:#e8dcc4;font:15px ui-monospace,Menlo,monospace;width:1240px;display:flex}' +
  '.l{width:430px;padding:20px}.l img{width:390px;border:2px solid #3a2f22}.r{flex:1;padding:24px 26px}h1{font-size:24px;margin:0 0 18px;color:#f0e2c2;letter-spacing:1px}' +
  'table{border-collapse:collapse;width:100%}th{color:#9c8c70;text-align:left;font-weight:normal;padding:4px 8px;letter-spacing:2px}td{padding:9px 8px;border-top:1px solid #2c241b;vertical-align:top}' +
  '.k{color:#d9a441;letter-spacing:1px;width:44%}.b{color:#a04a3a}.a{color:#f0e2c2}</style>' +
  '<div class="l"><img src="' + shot + '"></div><div class="r"><h1>' + esc(TITLE) + '</h1>' + body + '</div>';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1240, height: 900 }, deviceScaleFactor: 1 });
  await p.setContent(html); await p.waitForTimeout(300);
  const h = await p.evaluate(() => document.body.scrollHeight); await p.setViewportSize({ width: 1240, height: h });
  await p.screenshot({ path: OUT, type: 'jpeg', quality: 76, fullPage: true }); await b.close();
  console.log('wrote ' + path.relative(ROOT, OUT) + ' ' + fs.statSync(OUT).size + ' bytes');
})();
