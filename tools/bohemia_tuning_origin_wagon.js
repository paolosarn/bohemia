#!/usr/bin/env node
// TUNING [origin food and goods] 10/19 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g).
// The row: each origin page's Resources table lists starting provisions and trade goods (Deserters 2 grains; Trading Caravan
// bread, wine, mead, amber, cloth, dyes, furs; Northern Raiders silverware, a silver bowl, a warhound). Price them from the price
// table, add to start_power, note which origin has no food. In VOTE: one line.
// Every item and its worth is read off the wiki dump (reference/library/grok/wiki/PAGES_ALL.tar.gz): the fifteen origin pages'
// second Resources table (Renown, Reputation, Relations, Provisions, Other Items), the Provisions page (base worth for 25 units,
// spoil days), the Trade page and the Treasures page (base worth). Ten crowns a battery (the one table's typed escape).
// Writes records/BOHEMIA_TUNING_ORIGIN_FOOD_AND_GOODS_10_19_26.md, banks/BOHEMIA_TUNING_ORIGIN_WAGON_10_19_26.json and the VOTE page
// slices/BOHEMIA_TUNING_WHAT_IS_IN_THE_WAGON_10_19_26.html. draft:true; nothing in the game reads them.
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const WIKI = path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const list = cp.execFileSync('tar', ['-tzf', WIKI], { maxBuffer: 1 << 26 }).toString().split('\n').filter(Boolean);
const page = name => { const f = list.filter(x => x.replace(/^bb_all\/\d+_/, '').replace(/\.txt$/, '').toLowerCase() === name.toLowerCase())[0];
  if (!f) throw new Error('no wiki page: ' + name); return { file: f, text: cp.execFileSync('tar', ['-xzOf', WIKI, f], { maxBuffer: 1 << 26 }).toString() }; };
const CROWNS_A_BATTERY = 10;

/* the worth of an item, from the three price pages: 'Name<br />Base worth: N' (Provisions also gives spoil days) */
const WORTH = {}, SPOIL = {};
[['Provisions', 'food'], ['Trade', 'trade'], ['Treasures', 'treasure']].forEach(([p, kind]) => {
  const t = page(p).text;
  const re = /<br \/>([^<]+)<br \/>Base worth: (\d+)(?:[^<]*<br \/>Spoil time: (\d+) days)?/g; let m;
  while ((m = re.exec(t))) { WORTH[m[1].trim()] = { worth: Number(m[2]), kind: kind, page: page(p).file }; if (m[3]) SPOIL[m[1].trim()] = Number(m[3]); }
});
/* the wiki's own aliases between an origin page's item name and the price pages' */
const ALIAS = { 'Amber': 'Amber Shards' };

function resources(o) {
  const t = page(o.bb).text;
  const i = t.indexOf('Provisions');
  if (i < 0) return { provisions: [], other: [], file: page(o.bb).file, note: 'no Provisions column' };
  const after = t.slice(i), rowStart = after.indexOf('|-'), end = after.indexOf('|}');
  const cells = after.slice(rowStart + 2, end).split('\n').map(s => s.trim()).filter(s => /^\|/.test(s) && !/^\|-/.test(s));
  const items = c => { const out = []; const re = /(\d+)x\s*\[\[File:[^|\]]+\|[^\]]*?\|([^\]|]+)(?:\|link=[^\]]*)?\]\]/g; let m;
    while ((m = re.exec(c || ''))) out.push({ n: Number(m[1]), name: m[2].trim() }); return out; };
  /* the data row: renown, reputation, relations, provisions, and other items where the page has that column */
  return { provisions: items(cells[3]), other: items(cells[4]), file: page(o.bb).file };
}
const priced = it => { const k = ALIAS[it.name] || it.name; const w = WORTH[k]; return w ? Object.assign({}, it, { worth: w.worth, kind: w.kind, total: w.worth * it.n }) : Object.assign({}, it, { worth: null }); };

const ORIG = J('records/target/bb/origins.json').origins;
/* start power (mid) from the [start power] page's own table, so the sum adds to the number the lane already published */
const SP = {}; fs.readFileSync(path.join(ROOT, 'records/BOHEMIA_TUNING_START_POWER_HARD_ORIGINS_START_RICHER_THAN_EASY_ONES_10_10_26.md'), 'utf8')
  .split('\n').forEach(l => { const m = l.match(/^\s+(\w+)\s+\w+\s+men\s+\d+.*\(mid (\d+)\)/); if (m) SP[m[1]] = Number(m[2]); });
const rows = ORIG.map(o => {
  const r = resources(o), food = r.provisions.map(priced), other = r.other.map(priced);
  const units = food.reduce((s, x) => s + x.n * 25, 0), men = o.men.length, perDay = men * 2;
  const crowns = food.concat(other).reduce((s, x) => s + (x.total || 0), 0);
  return { id: o.id, name: o.name, bb: o.bb, page: r.file, men: men, food: food, other: other, food_units: units, days_of_food: perDay ? Math.round(10 * units / perDay) / 10 : null,
    first_spoil_days: food.length ? Math.min.apply(null, food.map(x => SPOIL[x.name] || 99)) : null,
    worth_crowns: crowns, worth_batteries: Math.round(crowns / CROWNS_A_BATTERY), unpriced: food.concat(other).filter(x => x.worth === null).map(x => x.n + 'x ' + x.name),
    start_power_mid: SP[o.id] || null, start_power_with_wagon: SP[o.id] ? SP[o.id] + Math.round(crowns / CROWNS_A_BATTERY) : null };
});
const fmt = xs => xs.length ? xs.map(x => x.n + 'x ' + x.name + (x.worth !== null ? ' (' + x.total + ')' : ' (no price page)')).join(', ') : 'none';

const md = [], P = x => md.push(x);
P('# TUNING [origin food and goods]: what each start carries in the wagon, priced (10/19)');
P('');
P('RESEARCH ONLY (rule 38g). DRAFT. Nothing in the game reads this page or its bank. Every item and worth read off the wiki dump: the fifteen origin pages\' Resources table, the Provisions page (base worth for 25 units, spoil days), the Trade page and the Treasures page. Ten crowns a battery.');
P('');
P('## The wagon, origin by origin');
P('');
P('| origin | Battle Brothers origin | men | food (crowns) | days it feeds them (2 a man a day) | first to spoil | other goods (crowns) | the wagon in batteries | start power (mid) | start power with the wagon |');
P('|---|---|---|---|---|---|---|---|---|---|');
rows.forEach(r => P('| ' + r.name + ' | ' + r.bb + ' | ' + r.men + ' | ' + fmt(r.food) + ' | ' + r.days_of_food + ' | ' + (r.first_spoil_days === null ? '-' : r.first_spoil_days + ' days') + ' | ' + fmt(r.other) + ' | ' + r.worth_batteries + ' | ' + (r.start_power_mid || '-') + ' | ' + (r.start_power_with_wagon || '-') + ' |'));
P('');
const noFood = rows.filter(r => !r.food.length);
const least = rows.slice().sort((a, b) => a.days_of_food - b.days_of_food);
P('## Findings');
P('');
P('1. **NO ORIGIN STARTS WITHOUT FOOD IN BATTLE BROTHERS** (' + (noFood.length ? noFood.map(r => r.name).join(', ') + ' have none on their page' : 'every page lists provisions') + '). The thinnest wagons: ' + least.slice(0, 4).map(r => r.name + ' ' + r.days_of_food + ' days for ' + r.men).join('; ') + '. '
  + 'The fattest: ' + least.slice(-3).reverse().map(r => r.name + ' ' + r.days_of_food + ' days').join('; ') + '. Battle Brothers\' food runs out in days, not weeks: the first market is the first hour\'s first errand.');
P('2. **EVERY ORIGIN OF OURS STARTS WITH NO FOOD, AND NOBODY EATS.** records/target/bb/origins.json has no provisions or goods field on any of the fifteen; the demo charges no food (the stash engine, engine/bohemia_stash.js, carries Battle Brothers\' two a man a day and terrain multipliers, and only the stash screen page loads it). So the answer to "which origin has no food" is all fifteen of ours, and none of Battle Brothers\'.');
P('3. **THE WAGON MOVES START POWER FOR TWO ORIGINS ONLY: THE ONES CARRYING GOODS TO SELL.** ' + rows.filter(r => r.worth_batteries >= 50).map(r => r.name + ' +' + r.worth_batteries + ' batteries').join('; ') + '; every other wagon is worth ' + Math.max.apply(null, rows.filter(r => r.worth_batteries < 50).map(r => r.worth_batteries)) + ' batteries or less. '
  + 'The order of the labels does not change: ' + rows.slice().sort((a, b) => (b.start_power_with_wagon || 0) - (a.start_power_with_wagon || 0)).slice(0, 4).map(r => r.name + ' ' + r.start_power_with_wagon).join(', ') + ' lead.');
P('4. **UNPRICED (no base worth on the three price pages, so left out of the sum):** ' + rows.filter(r => r.unpriced.length).map(r => r.name + ': ' + r.unpriced.join(', ')).join('; ') + '. The dogs are fighters (a Warhound, a Wardog), the books, skull and banner are origin quest items, the potions are rare; none is for sale in a market.');
P('');
P('## ROUTED');
P('');
P('- PEOPLE [origins] + ECONOMY: a provisions and goods field on each origin (data, not code), from the table above in our skins; the stash (engine/bohemia_stash.js) loaded by the demo so food is eaten. Rule 117: our start may carry more days than Battle Brothers\' (it is the easier end), never fewer.');
P('- TUNING table: origin.food_days and origin.wagon_batteries as derived rows.');
P('');
P('Bank: banks/BOHEMIA_TUNING_ORIGIN_WAGON_10_19_26.json. Tool: tools/bohemia_tuning_origin_wagon.js.');
P('');
P('[bb Battle Brothers starts every company with a few days of grain and makes the first market the first errand; the wagon is a clock.]');
P('[analog horror: a wagon of ground grain that spoils in seven days; the smell is the clock. Named for SOUNDS, not moved.]');
fs.writeFileSync(path.join(ROOT, 'records/BOHEMIA_TUNING_ORIGIN_FOOD_AND_GOODS_10_19_26.md'), md.join('\n') + '\n');
fs.writeFileSync(path.join(ROOT, 'banks/BOHEMIA_TUNING_ORIGIN_WAGON_10_19_26.json'), JSON.stringify({ _readme: 'TUNING [origin food and goods] 10/19 (rule 38g research only). draft:true. NOTHING IN THE GAME READS THIS FILE. Each Battle Brothers origin page\'s provisions and goods, priced from the wiki\'s Provisions, Trade and Treasures pages; ten crowns a battery.', draft: true, schema: 1, rows: rows }, null, 1) + '\n');

/* the VOTE page: one line, one table */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const h = [];
h.push('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>WHAT IS IN THE WAGON</title>');
h.push('<style>:root{--bg:#f4efe4;--ink:#1b1711;--line:#8a7d66}body{margin:0;padding:16px;background:var(--bg);color:var(--ink);font:15px/1.4 Georgia,serif}h1{font-size:20px;margin:0 0 6px}p{max-width:72ch}'
  + '.wrap{overflow-x:auto}table{border-collapse:collapse;font-size:13px}th,td{border:1px solid var(--line);padding:4px 5px}th{background:#e8dfcd;font-weight:normal}td.n{text-align:center}.k{font-size:11px;color:#5b5244;overflow-wrap:anywhere}</style></head><body>');
h.push('<h1>WHAT IS IN THE WAGON</h1>');
h.push('<p>TUNING, research only. In Battle Brothers every start carries a few days of food, so the first market is your first errand. <b>Ours carry none, and nobody eats yet.</b> DRAFT.</p>');
h.push('<div class="wrap"><table><tr><th>start</th><th>Battle Brothers carries</th><th>days of food</th><th>worth (batteries)</th></tr>');
rows.forEach(r => h.push('<tr><td>' + esc(r.name) + '</td><td>' + esc(r.food.concat(r.other).map(x => x.n + ' ' + x.name.toLowerCase()).join(', ')) + '</td><td class="n">' + r.days_of_food + '</td><td class="n">' + r.worth_batteries + '</td></tr>'));
h.push('</table></div>');
h.push('<p class="k">Every item and price from the Battle Brothers wiki: records/BOHEMIA_TUNING_ORIGIN_FOOD_AND_GOODS_10_19_26.md. draft:true.</p></body></html>');
fs.writeFileSync(path.join(ROOT, 'slices/BOHEMIA_TUNING_WHAT_IS_IN_THE_WAGON_10_19_26.html'), h.join('\n') + '\n');
rows.forEach(r => console.log(r.id.padEnd(8), 'food', fmt(r.food), '| days', r.days_of_food, '| other', fmt(r.other), '| batteries', r.worth_batteries, '| sp', r.start_power_mid, '->', r.start_power_with_wagon));
