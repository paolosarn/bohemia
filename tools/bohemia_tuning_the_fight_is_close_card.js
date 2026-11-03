#!/usr/bin/env node
// TUNING 2 [the fight is close] 11/3 -- the VOTE card (rule 370, ask line 396). Per level, the routine job and the tough job, before and
// now, said the way he meets a fight after the bell (won, men down, somebody badly hurt), pooled exactly as the gate pools them (the Lone
// Wolf, a fresh company and his way at closeness_bands.sample_days) from the two banks the curve tool wrote
// (banks/BOHEMIA_TUNING_THE_FIGHT_IS_CLOSE_BEFORE/AFTER_11_3_26.json: the live fight, AUTO both sides, 20 fights a cell).
//   node tools/bohemia_tuning_the_fight_is_close_card.js
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const B = J('banks/BOHEMIA_TUNING_THE_FIGHT_IS_CLOSE_BEFORE_11_3_26.json'), A = J('banks/BOHEMIA_TUNING_THE_FIGHT_IS_CLOSE_AFTER_11_3_26.json');
const LV = J('records/target/bb/party_math.json').difficulty_levels.value;
const CB = J('records/target/bb/party_math.json').closeness_bands.value, DAYS = CB.sample_days;
/* the gate's own pool: the three companies at the sample days, each cell weighed by its fights */
function pool(bank, level, job) {
  const cs = bank.cells.filter(c => c.level === level && c.job === job && DAYS.indexOf(c.day) >= 0), n = cs.reduce((t, c) => t + c.n, 0);
  const w = f => cs.reduce((t, c) => t + c[f] * c.n, 0) / n;
  return { won: Math.round(w('won')), down: w('struckPerFight'), hurt: 100 - Math.round(w('nobodyHurt')) };
}
/* a fight as he would see it, in his words: won, men down, somebody badly hurt */
function words(c) {
  const d = c.down < 0.15 ? 'nobody down' : c.down < 0.8 ? 'a man down every ' + (c.down < 0.4 ? 'third' : 'other') + ' fight' : c.down < 1.5 ? 'about a man down a fight' : 'about ' + Math.round(c.down) + ' men down a fight';
  return 'Won ' + c.won + ' in 100 · ' + d + ' · somebody under half health in ' + c.hurt + ' of 100.';
}
const JOBS = [['routine', 'THE EVERYDAY JOB'], ['tough', 'THE HARDEST JOB ON THE BOARD']];
const blocks = LV.map(l => '<section><h2>' + l.name + '</h2>' + JOBS.map(([j, name]) => {
  const b = pool(B, l.id, j), a = pool(A, l.id, j), same = Math.abs(b.won - a.won) <= 3 && Math.abs(b.down - a.down) < 0.1 && Math.abs(b.hurt - a.hurt) < 4;
  return '<div class="co"><div class="cn">' + name + '</div><div class="ln bef"><b>BEFORE</b> ' + words(b) + '</div><div class="ln aft"><b>NOW</b> ' + (same ? 'Same. ' : '') + words(a) + '</div></div>';
}).join('') + '</section>').join('');
const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
  + '<title>The Fight Is Close</title><style>'
  + ':root{--bg:#0d0b09;--ink:#e9dcc2;--dim:#9a8d78;--amber:#e8b85e;--grey:#7d766c;--line:#3a3025}'
  + 'body{margin:0;background:var(--bg);color:var(--ink);font:11px/1.3 ui-monospace,Menlo,monospace}'
  + '.wrap{width:390px;box-sizing:border-box;padding:10px 10px 10px}'
  + 'h1{font-size:15px;letter-spacing:2px;margin:0 0 3px}.sub{color:var(--dim);font-size:10px;margin:0 0 5px;line-height:1.3}'
  + 'section{border-top:2px solid var(--line);padding:5px 0 2px}h2{font-size:12px;letter-spacing:1.5px;margin:0 0 3px;color:var(--amber)}'
  + '.co{margin:0 0 5px}.cn{font-size:9px;letter-spacing:1px;color:var(--dim);margin:0 0 2px}'
  + '.ln{font-size:10.5px;margin:0 0 2px;padding-left:6px;border-left:2px solid var(--grey)}.ln b{font-size:9px;letter-spacing:1px;margin-right:4px}'
  + '.bef{color:var(--grey)}.aft{border-left-color:var(--amber)}.aft b{color:var(--amber)}'
  + '</style></head><body><div class="wrap"><h1>THE FIGHT IS CLOSE</h1>'
  + '<p class="sub">The real fight on AUTO, days ' + DAYS.join(' and ') + ', a Lone Wolf, a new crew and rare men in cheap gear, ' + (A.n * 6) + ' fights a line. Before: the game you played. Now: this round.</p>'
  + '<p class="sub">Still a walk: twelve men in the city\'s armour on NEW HERE (their blows spread thin, no armour breaks; the enemy picking a target is the fix). SEEN IT\'s hardest job got easier this hour from the fight\'s new enemy that runs when losing, not these numbers.</p>'
  + blocks + '</div></body></html>';
const page = path.join(ROOT, 'slices/BOHEMIA_TUNING_THE_FIGHT_IS_CLOSE_11_3_26.html');
fs.writeFileSync(page, html);
(async () => {
  const { chromium } = require('playwright');
  const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await pg.goto('file://' + page); const h = await pg.evaluate(() => document.body.scrollHeight);
  await pg.setViewportSize({ width: 390, height: h });
  const dir = path.join(ROOT, 'records/target/fight_is_close_11_3'); fs.mkdirSync(dir, { recursive: true });
  const png = path.join(dir, 'card.png'); await pg.screenshot({ path: png, fullPage: true }); await br.close();
  require('child_process').execFileSync('python3', ['-c', 'import sys;from PIL import Image;Image.open(sys.argv[1]).save(sys.argv[2],"WEBP",quality=82)', png, path.join(dir, 'card.webp')]);
  fs.unlinkSync(png);
  console.log('wrote', path.relative(ROOT, page), 'and records/target/fight_is_close_11_3/card.webp');
  LV.forEach(l => JOBS.forEach(([j]) => console.log(l.id, j, '| before:', words(pool(B, l.id, j)), '| now:', words(pool(A, l.id, j)))));
})();
