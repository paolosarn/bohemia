#!/usr/bin/env node
// JOBS [more contract kinds] 11/10 -- the VOTE card's picture: an end screen on his phone (the demo, upright) beside the six contract kinds'
// end lines before (main) and now, read off records/target/jobs_11_10/six_before.json and six_after.json (tools/bohemia_jobs_the_six_on_the_phone.js).
// node tools/bohemia_jobs_the_six_card_picture.js [--shot records/target/jobs_11_10/after_upright_hold-defend.png] [--out records/target/JOBS_THE_SIX_CONTRACTS.jpg]
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const D = path.join(ROOT, 'records/target/jobs_11_10'), B = JSON.parse(fs.readFileSync(path.join(D, 'six_before.json'), 'utf8')), A = JSON.parse(fs.readFileSync(path.join(D, 'six_after.json'), 'utf8'));
const shot = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, arg('--shot', 'records/target/jobs_11_10/after_upright_hold-defend.png'))).toString('base64');
const OUT = path.join(ROOT, arg('--out', 'records/target/JOBS_THE_SIX_CONTRACTS.jpg'));
const up = W => (W.walks.filter(w => w.shape === 'phone_portrait')[0] || W.walks[0]).rows;
const bb = up(B), aa = up(A);
const esc = t => String(t || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const KW = { 'haul-caravan': 'ESCORT A CARAVAN', 'hold-defend': 'DEFEND A PLACE', 'hunt-kind': 'HUNT A BEAST', 'carry': 'DELIVER', 'clear-camp': 'CLEAR A PLACE', 'collect': 'COLLECT A DEBT' };
const rows = aa.map(r => { const b = bb.filter(x => x.kind === r.kind)[0] || {};
  return '<div class="k">' + esc(KW[r.kind] || r.kind) + '</div><div class="b">' + esc(b.head || '-') + '</div><div class="a">' + esc(r.head || '-') + '</div>'; }).join('');
const html = '<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#16130f;color:#e8dcc4;font:16px ui-monospace,Menlo,monospace;width:1240px;display:flex}' +
  '.l{width:430px;padding:20px}.l img{width:390px;border:2px solid #3a2f22}.r{flex:1;padding:26px 28px}h1{font-size:25px;margin:0 0 6px;color:#f0e2c2;letter-spacing:1px}' +
  'p{color:#b8a888;margin:0 0 16px;line-height:1.4}.k{color:#d9a441;letter-spacing:2px;margin:16px 0 4px;font-size:15px}.b{color:#a04a3a;text-decoration:line-through;margin:2px 0}.a{color:#f0e2c2;margin:2px 0 0}' +
  '.key{margin-top:22px;color:#9c8c70;line-height:1.5}</style>' +
  '<div class="l"><img src="' + shot + '"></div><div class="r"><h1>EVERY JOB ENDS WITH WHO THEY WERE</h1>' +
  '<p>The six contract kinds of Battle Brothers, each taken off a town\'s board on a phone, fought, and the end screen read. Struck through: what it said before. Below: what it says now.</p>' +
  rows + '<div class="key">15 new jobs from 15 new people: 3 escorts, 3 defences, 3 deliveries, 3 places to clear, 3 debts.<br>A defence\'s waves now share one job\'s size, not one each.</div></div>';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1240, height: 900 }, deviceScaleFactor: 2 });
  await p.setContent(html); await p.waitForTimeout(300);
  const h = await p.evaluate(() => document.body.scrollHeight); await p.setViewportSize({ width: 1240, height: h });
  await p.screenshot({ path: OUT, type: 'jpeg', quality: 86, fullPage: true }); await b.close();
  console.log('wrote ' + path.relative(ROOT, OUT));
})();
