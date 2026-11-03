#!/usr/bin/env node
// TUNING 2 [difficulty fine-tuned] 11/3 -- the VOTE card for rule 380 (ask line 409; Paolo: 'Battle Brothers from easy to hard just tweaked
// the numbers tiny, so slightly, to make it harder'). THE SAME FIGHT ON THE THREE LEVELS: the fresh company (A New Crew's three grown to nine)
// on day 20, the everyday job and the hardest job, each level said the way he meets it (how many of them, won, men down), read from the
// committed after bank of tools/bohemia_difficulty_the_curve.js --close (the live fight, AUTO both sides, 20 fights a cell), and what each
// level moves in plain words (records/target/bb/party_math.json difficulty_levels).
//   node tools/bohemia_tuning_three_levels_card.js
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const A = J('banks/BOHEMIA_TUNING_THE_FIGHT_IS_CLOSE_AFTER_11_3_26.json'), LV = J('records/target/bb/party_math.json').difficulty_levels.value;
const KEY = 'fresh', DAY = 20;
const cell = (level, job) => A.cells.filter(c => c.key === KEY && c.level === level && c.day === DAY && c.job === job)[0];
function words(c) {
  const them = Math.round(c.enemies), won = Math.round(c.won / 5), d = c.struckPerFight;
  const down = d < 0.15 ? 'nobody goes down' : d < 0.8 ? 'a man goes down every ' + (d < 0.4 ? 'third' : 'other') + ' fight' : d < 1.5 ? 'about a man goes down' : 'about ' + Math.round(d) + ' men go down';
  return them + ' of them. You win ' + won + ' of 20; ' + down + '.';
}
const JOBS = [['routine', 'EVERYDAY JOB'], ['tough', 'HARDEST JOB']];
const rows = LV.map(l => '<section><h2>' + l.name + '</h2><div class="ch">' + (l.changes || []).join(' · ') + '</div>'
  + JOBS.map(([j, n]) => '<div class="ln"><b>' + n + '</b> ' + words(cell(l.id, j)) + '</div>').join('') + '</section>').join('');
const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
  + '<title>Same Fight, Three Levels</title><style>'
  + ':root{--bg:#0d0b09;--ink:#e9dcc2;--dim:#9a8d78;--amber:#e8b85e;--line:#3a3025}'
  + 'body{margin:0;background:var(--bg);color:var(--ink);font:11px/1.35 ui-monospace,Menlo,monospace}'
  + '.wrap{width:390px;box-sizing:border-box;padding:12px 12px 12px}h1{font-size:15px;letter-spacing:2px;margin:0 0 4px}'
  + '.sub{color:var(--dim);font-size:10px;margin:0 0 8px}section{border-top:2px solid var(--line);padding:6px 0 4px}'
  + 'h2{font-size:12.5px;letter-spacing:1.5px;margin:0 0 2px;color:var(--amber)}.ch{color:var(--dim);font-size:9.5px;margin:0 0 4px}'
  + '.ln{font-size:11px;margin:0 0 3px;padding-left:6px;border-left:2px solid var(--amber)}.ln b{font-size:9px;letter-spacing:1px;margin-right:4px;color:var(--amber)}'
  + '.note{color:var(--dim);font-size:10px;margin:8px 0 0;border-top:1px solid var(--line);padding-top:6px}'
  + '</style></head><body><div class="wrap"><h1>THE SAME FIGHT, THREE LEVELS</h1>'
  + '<p class="sub">The same nine men on day ' + DAY + ', the real fight on AUTO, ' + A.n + ' fights each. Change the level any time behind the gear: SETTINGS, FIGHTS.</p>'
  + rows
  + '<p class="note">Battle Brothers steps its aim between its easy and middle levels, and its harder groups between middle and hard. Ours puts the aim and the harder men together between SEEN IT and OUTLIVED IT, so that is the big step; spreading it out is next.</p>'
  + '</div></body></html>';
const page = path.join(ROOT, 'slices/BOHEMIA_TUNING_THE_SAME_FIGHT_THREE_LEVELS_11_3_26.html');
fs.writeFileSync(page, html);
(async () => {
  const { chromium } = require('playwright');
  const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await pg.goto('file://' + page); const h = await pg.evaluate(() => document.body.scrollHeight);
  await pg.setViewportSize({ width: 390, height: h });
  const dir = path.join(ROOT, 'records/target/three_levels_11_3'); fs.mkdirSync(dir, { recursive: true });
  const png = path.join(dir, 'card.png'); await pg.screenshot({ path: png, fullPage: true }); await br.close();
  require('child_process').execFileSync('python3', ['-c', 'import sys;from PIL import Image;Image.open(sys.argv[1]).save(sys.argv[2],"WEBP",quality=82)', png, path.join(dir, 'card.webp')]);
  fs.unlinkSync(png);
  console.log('wrote', path.relative(ROOT, page), 'and records/target/three_levels_11_3/card.webp');
  LV.forEach(l => JOBS.forEach(([j]) => console.log(l.id, j, words(cell(l.id, j)))));
})();
