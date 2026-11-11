#!/usr/bin/env node
// JOBS [the months of jobs] 11/11 -- the VOTE card's picture: a job's card on his phone (the demo, upright: WHAT IT ASKS under the
// client's own words) beside the five new kinds, each with what its card said and who the fights turned out to be, read off
// records/target/jobs_11_11/new_kinds_demo.json (tools/bohemia_jobs_the_new_kinds_on_the_phone.js, the gate's own walk, copied).
// node tools/bohemia_jobs_the_new_kinds_card_picture.js [--shot records/target/jobs_11_11/demo_upright_root-out_card.webp] [--out records/target/JOBS_THE_NEW_KINDS.jpg]
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const W = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/jobs_11_11/new_kinds_demo.json'), 'utf8'));
const SHOT = arg('--shot', 'records/target/jobs_11_11/demo_upright_root-out_card.webp'), shot = 'data:image/' + (/\.webp$/.test(SHOT) ? 'webp' : 'png') + ';base64,' + fs.readFileSync(path.join(ROOT, arg('--shot', 'records/target/jobs_11_11/demo_upright_root-out_card.webp'))).toString('base64');
const OUT = path.join(ROOT, arg('--out', 'records/target/JOBS_THE_NEW_KINDS.jpg'));
const rows = ((W.walks.filter(w => w.shape === 'phone_portrait')[0] || W.walks[0]).rows || []).filter(r => !r.err);
const esc = t => String(t || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const body = rows.map(r => '<div class="k">' + esc(r.word) + ' <span>' + esc(r.town) + (r.paid ? ', PAID ' + r.paid.paid + ' BATTERIES, +' + r.clout + ' CLOUT' : '') + '</span></div>' +
  '<div class="a">' + esc(String(r.asks || '').replace(/^What it asks: /, '')) + '</div>' +
  (r.fights.length ? '<div class="f">' + r.fights.map(f => esc(f.head)).join('<br>') + '</div>' : '<div class="f">NO FIGHT: FOUND, WALKED HOME</div>')).join('');
const html = '<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#16130f;color:#e8dcc4;font:15px ui-monospace,Menlo,monospace;width:1240px;display:flex}' +
  '.l{width:430px;padding:20px}.l img{width:390px;border:2px solid #3a2f22}.r{flex:1;padding:24px 26px}h1{font-size:24px;margin:0 0 6px;color:#f0e2c2;letter-spacing:1px}' +
  'p{color:#b8a888;margin:0 0 12px;line-height:1.4}.k{color:#d9a441;letter-spacing:2px;margin:14px 0 3px;font-size:15px}.k span{color:#9c8c70;letter-spacing:0;font-size:13px}' +
  '.a{color:#f0e2c2;line-height:1.4}.f{color:#b06a50;margin-top:3px;font-size:13px;line-height:1.35}</style>' +
  '<div class="l"><img src="' + shot + '"></div><div class="r"><h1>THE BOARD SAYS WHAT THE JOB ASKS</h1>' +
  '<p>Four kinds of Battle Brothers job we did not have, and find a person, each taken off its own town\'s board on a phone and played to the end. Gold: what the card said before the yes. Red: who the fights turned out to be.</p>' +
  body + '</div>';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1240, height: 900 }, deviceScaleFactor: 2 });
  await p.setContent(html); await p.waitForTimeout(300);
  const h = await p.evaluate(() => document.body.scrollHeight); await p.setViewportSize({ width: 1240, height: h });
  await p.screenshot({ path: OUT, type: 'jpeg', quality: 86, fullPage: true }); await b.close();
  console.log('wrote ' + path.relative(ROOT, OUT));
})();
