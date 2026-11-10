#!/usr/bin/env node
// JOBS [jobs that fit] 11/10 -- the VOTE card's picture: the board on his phone (the demo, a new crew of three, day 50, after) beside
// the measurement in bars (of every job the valley's boards deal, how many the crew loses more often than it wins, before and after,
// days 1, 20 and 50, over 20 campaign seeds). Reads tools/bohemia_jobs_fit_the_company_sum.py --json files.
// node tools/bohemia_jobs_the_card_picture.js --wolf-before a.json --wolf-after b.json --crew-before c.json --crew-after d.json --out records/target/JOBS_JOBS_THAT_FIT.jpg
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const S = k => JSON.parse(fs.readFileSync(arg(k), 'utf8')).summary;
const rows = { wolf: [S('--wolf-before'), S('--wolf-after')], crew: [S('--crew-before'), S('--crew-after')] };
const OUT = path.join(ROOT, arg('--out', 'records/target/JOBS_JOBS_THAT_FIT.jpg'));
const board = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'records/target/jobs_11_8/board_after_upright.png')).toString('base64');
const bar = (pct, kind) => '<div class="bar ' + kind + '"><i style="width:' + Math.max(1, pct * 2.4) + 'px"></i><b>' + pct + '</b></div>';
const block = (name, B) => '<h2>' + name + '</h2>' + [1, 20, 50].map(day => {
  const b = B[0].find(r => r.day === day), a = B[1].find(r => r.day === day);
  return '<div class="row"><span>DAY ' + day + '</span><div>' + bar(b ? b.dealt_lost_pct : 0, 'b') + bar(a ? a.dealt_lost_pct : 0, 'a') + '</div></div>';
}).join('');
const html = '<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#16130f;color:#e8dcc4;font:16px ui-monospace,Menlo,monospace;width:1200px;display:flex}' +
  '.l{width:470px;padding:20px}.l img{width:430px;border:2px solid #3a2f22}.r{flex:1;padding:28px 30px}h1{font-size:26px;margin:0 0 6px;color:#f0e2c2;letter-spacing:1px}' +
  'p{color:#b8a888;margin:0 0 18px;line-height:1.4}h2{font-size:18px;margin:22px 0 8px;color:#d9a441;letter-spacing:2px}.row{display:flex;align-items:center;margin:6px 0}.row span{width:80px;color:#9c8c70}' +
  '.bar{display:flex;align-items:center;height:22px;margin:3px 0}.bar i{display:block;height:18px}.bar b{margin-left:8px;font-weight:normal}.b i{background:#8a1d14}.a i{background:#c9b994}' +
  '.key{margin-top:26px;color:#9c8c70}.key em{display:inline-block;width:14px;height:14px;vertical-align:-2px;margin:0 6px 0 14px}</style>' +
  '<div class="l"><img src="' + board + '"></div><div class="r"><h1>JOBS THAT FIT THE CREW</h1>' +
  '<p>Out of every 100 jobs the valley\'s boards deal, how many the crew LOSES more often than it wins. 20 different valleys, played on AUTO.</p>' +
  block('THE LONE WOLF, ALONE', rows.wolf) + block('A NEW CREW OF THREE', rows.crew) +
  '<div class="key"><em style="background:#8a1d14"></em>BEFORE (a dire wolf counted as one man; hunts a fixed size)<br><em style="background:#c9b994"></em>NOW (a wolf costs two men, a hunt fits the crew)</div></div>';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 960 }, deviceScaleFactor: 2 });
  await p.setContent(html); await p.waitForTimeout(300);
  const h = await p.evaluate(() => document.body.scrollHeight); await p.setViewportSize({ width: 1200, height: h });
  await p.screenshot({ path: OUT, type: 'jpeg', quality: 86, fullPage: true }); await b.close();
  console.log('wrote ' + path.relative(ROOT, OUT));
})();
