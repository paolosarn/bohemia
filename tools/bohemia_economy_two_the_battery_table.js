#!/usr/bin/env node
/* ============================================================================
   THE BATTERY TABLE'S HANDS (ECONOMY TWO, 11/18/26; VAMILY rule 459(b)(d), ask line 645).

   PAOLO 11/17: 'some of the quests, it's like 3000 or like 1000 batteries to complete a quest and I'm like bro that's a
   lot... I want people to really feel like they can look at their battery right now and relate it from the game to real
   life.'  PAOLO 9/4: 'for one AA battery a bag of rice.'

   THE ONE TABLE is records/target/bb/battery_table.json. It holds the unit (the AA), the ladder (the big batteries a sum is
   paid in), the bands a price must sit in, and EVERY NUMBER OF BATTERIES THE GAME SHOWS, PAYS OR TAKES, each under the
   place it lives. This tool is the only thing that moves a number between the table and the game:

     node tools/bohemia_economy_two_the_battery_table.js seed     read every registered place INTO the table's rows (first
                                                                  fill, or after a lane adds a place); prints what changed
     node tools/bohemia_economy_two_the_battery_table.js stamp    write the table's rows OUT to every place: the data files,
                                                                  the typed copies in code, the number inside a sentence
                                                                  (never a word of it: rule 454(a)); prints what it moved
     node tools/bohemia_economy_two_the_battery_table.js check    exit 1 with every fault: a place that is not the table's
                                                                  number, a battery number in a live file that no row
                                                                  holds, a typed 'N batteries' in live code no copy holds,
                                                                  a band broken, a worked sum that is not what the table says
     node tools/bohemia_economy_two_the_battery_table.js list     the whole list as markdown (the record's appendix)
     node tools/bohemia_economy_two_the_battery_table.js sums     the worked sums, computed from the live files

   HOW A MODDER OR TUNING MOVES A PRICE: edit the number in the table's rows, run `stamp`, run `check`. Nothing else.
   HOW A LANE ADDS A NEW BATTERY NUMBER: add its place to the table's `where` (a data file) or `copies` (typed in code),
   run `seed`, commit the table with the build. The gate (gates/the_battery_is_real_gate.js) fails the number until then.

   A data file is never re-written whole: `stamp` changes only the digits of the number it moves, in place, so nobody's
   formatting and nobody's rebase is touched.
   ============================================================================ */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const TABLE = path.join(ROOT, 'records/target/bb/battery_table.json');
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const has = f => fs.existsSync(path.join(ROOT, f));

/* ---------------- JSON with places: every leaf with its path and where its text sits ---------------- */
function leaves(text) {
  let i = 0; const out = [];
  const ws = () => { while (i < text.length && /\s/.test(text[i])) i++; };
  function str() { const s = i; i++; while (i < text.length && text[i] !== '"') { if (text[i] === '\\') i++; i++; } i++; return JSON.parse(text.slice(s, i)); }
  function val(p) {
    ws(); const c = text[i];
    if (c === '{') { i++; ws(); if (text[i] === '}') { i++; return; }
      for (;;) { ws(); const k = str(); ws(); i++; val(p.concat([k])); ws(); if (text[i] === ',') { i++; continue; } i++; return; } }
    if (c === '[') { i++; ws(); if (text[i] === ']') { i++; return; }
      const at = out.length; let n = 0; const first = [];
      for (;;) { first.push(out.length); val(p.concat([{ i: n++ }])); ws(); if (text[i] === ',') { i++; continue; } i++; break; }
      /* an array of things that each carry an id reads by the id, so a row keeps its name when a lane adds one above it */
      first.push(out.length); const ids = [];
      for (let k = 0; k < n; k++) { let id = null; for (let j = first[k]; j < first[k + 1]; j++) { const q = out[j].path; if (q.length === p.length + 2 && q[p.length + 1] === 'id' && typeof out[j].v === 'string') { id = out[j].v; break; } } ids.push(id); }
      if (ids.every(x => x != null) && new Set(ids).size === n) for (let j = at; j < out.length; j++) { const q = out[j].path[p.length]; out[j].path[p.length] = { id: ids[q.i] }; }
      return; }
    if (c === '"') { const s = i; const v = str(); out.push({ path: p.slice(), v, s, e: i, str: true }); return; }
    const s = i; while (i < text.length && /[-+0-9.eEa-z]/.test(text[i])) i++;
    const raw = text.slice(s, i), v = raw === 'true' ? true : raw === 'false' ? false : raw === 'null' ? null : Number(raw);
    out.push({ path: p.slice(), v, s, e: i, raw });
  }
  val([]);
  out.forEach(l => { l.key = l.path.map((k, n) => typeof k === 'string' ? (n ? '.' : '') + k : k.id != null ? '[id=' + k.id + ']' : '[' + k.i + ']').join(''); });
  return out;
}
/* a pattern: keys joined by dots, [*] any place in a list, * any one key, ** any run of keys */
function patRe(p) {
  let s = '';
  p.split(/(\[\*\]|\*\*|\*)/).forEach(t => {
    if (t === '[*]') s += '\\[[^\\]]+\\]'; else if (t === '**') s += '.*'; else if (t === '*') s += '[^.\\[]+'; else s += t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  });
  return new RegExp('^' + s + '$');
}
const numEq = (a, b) => typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 1e-9;

/* ---------------- the table ---------------- */
function load() {
  const T = JSON.parse(fs.readFileSync(TABLE, 'utf8'));
  /* EVERY data file in records/target/bb is swept, named in the table or not: a lane's new file is held the day it lands */
  try { fs.readdirSync(path.join(ROOT, 'records/target/bb')).filter(f => /\.json$/.test(f) && f !== 'battery_table.json').forEach(f => { const r = 'records/target/bb/' + f; if ((T.live_data || []).indexOf(r) < 0) (T.live_data = T.live_data || []).push(r); }); } catch (e) {}
  return T;
}
function save(T) { const W = JSON.parse(JSON.stringify(T)); try { const hand = JSON.parse(fs.readFileSync(TABLE, 'utf8')).live_data; if (hand) W.live_data = hand; } catch (e) {} fs.writeFileSync(TABLE, JSON.stringify(W, null, 1) + '\n'); }   /* the swept folder is read fresh each time, never baked */
const FILES = {};
function file(f) { if (!FILES[f]) { const text = rd(f); FILES[f] = { text, leaves: /\.json$/.test(f) ? leaves(text) : null, edits: [] }; } return FILES[f]; }
function placed(T) {   /* every leaf a place names: [{ place, file, leaf }] */
  const out = [];
  (T.where || []).forEach(pl => { if (!has(pl.file)) { out.push({ place: pl, file: pl.file, missing: true }); return; }
    const F = file(pl.file), res = pl.paths.map(patRe); let n = 0;
    F.leaves.forEach(l => { if (typeof l.v === 'number' && res.some(r => r.test(l.key))) { out.push({ place: pl, file: pl.file, leaf: l }); n++; } });
    if (!n) out.push({ place: pl, file: pl.file, empty: true }); });
  return out;
}
function rowOf(T, ref) { const k = ref.indexOf('#'); const f = ref.slice(0, k), p = ref.slice(k + 1); const r = (T.rows || {})[f]; return r && Object.prototype.hasOwnProperty.call(r, p) ? r[p] : undefined; }
function want(T, c) {   /* the number a copy must say */
  if (c.row) { let v = rowOf(T, c.row); if (v === undefined) return undefined; if (c.times != null) v = v * c.times; return v; }
  if (c.ladder) { const k = (T.ladder.value || []).filter(x => x.id === c.ladder)[0]; return k ? k.worth : undefined; }
  if (c.rule) { let n = T; c.rule.split('.').forEach(k => { n = n == null ? n : n[k]; }); return n; }
  if (c.leaf) { const k = c.leaf.indexOf('#'), f = c.leaf.slice(0, k), p = c.leaf.slice(k + 1); if (!has(f)) return undefined; const l = file(f).leaves.filter(x => x.key === p)[0]; return l && typeof l.v === 'number' ? l.v : undefined; }   /* a worth in a catalog (crowns): the code's copy is that file's number */
  return c.is;
}

/* ---------------- code: comments are not the game ---------------- */
function inComment(text, at) {
  const a = text.lastIndexOf('/*', at), b = text.lastIndexOf('*/', at);
  if (a >= 0 && a > b) return true;
  const h = text.lastIndexOf('<!--', at), g = text.lastIndexOf('-->', at);
  if (h >= 0 && h > g) return true;
  let ls = text.lastIndexOf('\n', at) + 1, q = null;
  for (let i = ls; i < at; i++) { const c = text[i];
    if (q) { if (c === '\\') i++; else if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '/' && text[i + 1] === '/' && text[i - 1] !== ':') return true; }
  return false;
}
function copyHits(T) {   /* every typed copy: where it matched and what it says */
  const out = [];
  (T.copies || []).forEach((c, n) => {
    if (!has(c.file)) { out.push({ c, n, missing: true }); return; }
    const F = file(c.file), re = new RegExp(c.find, 'gd'); let m, k = 0;
    while ((m = re.exec(F.text))) { if (m[0] === '') { re.lastIndex++; continue; }
      if (!c.comments && inComment(F.text, m.index)) continue;
      const g = m[1], gs = g == null ? -1 : m.indices[1][0];   /* the group's own place (never the first look-alike digit before it) */
      out.push({ c, n, at: m.index, end: m.index + m[0].length, says: g == null ? null : Number(g), gs, ge: gs + (g || '').length, raw: g }); k++; }
    if (!k) out.push({ c, n, none: true });
  });
  return out;
}
const TYPED = [   /* the ways a number of batteries is typed into code */
  { re: /(?<![\/\d.:,] ?)(\d{1,3}(?:,\d{3})+|\d+) ?batter(?:y|ies)\b/gi, what: "a string that says 'N batteries'" },
  { re: /'electricity',\s*(\d+)\b/g, what: 'a purse line with a typed number' },
  { re: /\bbats\s*:\s*[-+]?(\d+)\b/g, what: 'a bats field with a typed number' }
];
function typedInCode(T) {
  const out = [];
  (T.live_code || []).forEach(f => { if (!has(f)) return; const text = file(f).text;
    TYPED.forEach(t => { t.re.lastIndex = 0; let m;
      while ((m = t.re.exec(text))) { if (inComment(text, m.index)) continue;
        out.push({ file: f, at: m.index, end: m.index + m[0].length, says: m[1], what: t.what, near: text.slice(Math.max(0, m.index - 50), m.index + m[0].length + 30).replace(/\s+/g, ' ') }); } }); });
  return out;
}
const lineOf = (text, at) => text.slice(0, at).split('\n').length;

/* ---------------- the prose: the number inside a sentence in a data file ---------------- */
function proseHits(T) {
  const out = [];
  (T.prose || []).forEach(p => { if (!has(p.file)) { out.push({ p, missing: true }); return; }
    const F = file(p.file), l = F.leaves.filter(x => x.str && x.key === p.path)[0];
    if (!l) { out.push({ p, gone: true }); return; }
    const raw = F.text.slice(l.s, l.e), nums = []; const re = /\d+/g; let m;
    while ((m = re.exec(raw))) nums.push({ says: Number(m[0]), s: l.s + m.index, e: l.s + m.index + m[0].length });
    out.push({ p, l, nums }); });
  return out;
}
function proseInData(T) {   /* every sentence in a live data file that says 'N batteries' with digits */
  const out = [], re = /\d+ ?batter(?:y|ies)\b/i, hold = {};
  (T.prose || []).forEach(p => { hold[p.file + '#' + p.path] = 1; });
  const skip = (T.prose_not_shown || []).map(x => ({ file: x.file, re: patRe(x.path) }));
  (T.live_data || []).forEach(f => { if (!has(f)) return; file(f).leaves.forEach(l => { if (!l.str || !re.test(l.v)) return;
    if (hold[f + '#' + l.key] || skip.some(s => (s.file === f || s.file === '*') && s.re.test(l.key))) return;
    out.push({ file: f, key: l.key, v: l.v.slice(0, 110) }); }); });
  return out;
}

/* ---------------- the sweep: a battery number in a live data file that no row holds ---------------- */
function sweep(T) {
  const out = [], S = T.sweep || {}, key = new RegExp(S.keys || 'bats', 'i');
  const not = (S.not_batteries || []).map(x => ({ file: x.file, re: patRe(x.path) }));
  ((T.catalogs || {}).files || []).forEach(c => c.paths.forEach(p => not.push({ file: c.file, re: patRe(p) })));   /* a worth in crowns: the catalog rule turns it */
  const held = {}; placed(T).forEach(x => { if (x.leaf) held[x.file + '#' + x.leaf.key] = 1; });
  (T.live_data || []).forEach(f => { if (!has(f)) return; file(f).leaves.forEach(l => {
    if (typeof l.v !== 'number' || held[f + '#' + l.key]) return;
    const names = l.path.filter(k => typeof k === 'string').slice(-3);
    if (!names.some(k => key.test(k))) return;
    if (not.some(n => (n.file === f || n.file === '*') && n.re.test(l.key))) return;
    out.push({ file: f, key: l.key, v: l.v }); }); });
  return out;
}

/* ---------------- the split (the same rule the page draws with) ---------------- */
function split(T, n) {
  n = Math.max(0, Math.round(+n || 0)); const out = [], L = T.ladder.value.slice().sort((a, b) => b.worth - a.worth);
  L.forEach(k => { if (k.only_whole) { if (n > 0 && n % k.worth === 0) { out.push({ id: k.id, n: n / k.worth }); n = 0; } return; }
    const c = Math.floor(n / k.worth); if (c > 0) { out.push({ id: k.id, n: c }); n -= c * k.worth; } });
  return out;
}
const words = (T, n) => { const s = split(T, n), by = {}; T.ladder.value.forEach(k => { by[k.id] = k; }); return s.length ? s.map(p => p.n + ' ' + (p.n === 1 ? by[p.id].name : by[p.id].many)).join(', ') : '0 AA'; };

/* ---------------- the worked sums: what multiplies a number, and how big it gets ---------------- */
function sums(T) {
  const J = f => JSON.parse(rd(f)), R = (a, b) => rowOf(T, a + '#' + b);
  const pays = Object.values(J('records/target/bb/job_pay.json').pays).map(x => x.pay), top = Math.max.apply(null, pays), low = Math.min.apply(null, pays);
  const stand = Object.values(J('records/target/bb/job_pay.json').standing.value).map(x => x.mult), ren = J('records/target/bb/renown.json').pay_mult.value;
  const hag = J('records/target/bb/relations.json').haggle, hv = (hag && hag.value) || hag || {};
  const step = +hv.step || 0.07, lands = +hv.lands || 2;
  const econ = (T.ratios && T.ratios.shelves) || { full: 1.5, thin: 1, bare: 0.75 };
  const org = J('records/target/bb/origins.json').origins, opay = Math.max.apply(null, org.map(o => +o.pay || 0));
  const cpb = T.catalogs.crowns_per_battery, fl = T.catalogs.floor, conv = c => Math.max(fl, Math.round(c / cpb));
  const W = J('records/target/bb/weapons.json').rows, A = J('records/target/bb/armor.json'), B = J('records/target/bb/backgrounds.json').rows;
  const maxOf = (rows) => rows.reduce((a, r) => (+r.value || 0) > (+a.value || 0) ? r : a, rows[0]);
  const w = maxOf(W), b = maxOf(A.body), h = maxOf(A.head), s = maxOf(A.shields), wage = Math.max.apply(null, B.map(r => +r.daily_wage || 0));
  const night = R('records/target/bb/nightly_bill.json', 'per_man_per_night.value');
  const topWage = Math.max(1, Math.round(wage / cpb * Math.pow(1.1, 10))), firstWage = Math.max(1, Math.round(wage / cpb));
  const haggled = Math.round(top * Math.pow(1 + step, lands));
  const purse = [].concat.apply([], org.map(o => Object.values(o.batteries || {})));
  const ret = J('records/target/bb/retinue.json').followers.value.map(f => f.price);
  const out = {
    job_day_one: { is: Math.round((top + opay) * econ.full), how: 'the dearest board job (' + top + ') + the origin\'s bonus (' + opay + '), on FULL SHELVES (x' + econ.full + '), nobody knows you yet (x' + ren.from + '), a town that does not know you (x1)' },
    job_at_the_top: { is: Math.round((top + opay) * econ.full * ren.to * Math.max.apply(null, stand)), how: 'the same job at the top of CLOUT (x' + ren.to + ' at ' + ren.at + ') in a town that calls you family (x' + Math.max.apply(null, stand) + ')' },
    job_pushed_twice: { is: Math.round((haggled + opay) * econ.full * ren.to * Math.max.apply(null, stand)), how: 'and the pay pushed ' + lands + ' times (+' + Math.round(step * 100) + '% each): the most one job can ever pay' },
    job_smallest: { is: Math.max(1, Math.round(low * econ.bare * Math.min.apply(null, stand))), how: 'the smallest board job (' + low + ') on BARE SHELVES (x' + econ.bare + ') in a town that hates you (x' + Math.min.apply(null, stand) + ')' },
    a_mans_night_fed: { is: night, how: 'food and water for one man for one night' },
    a_hired_mans_night_first: { is: night + firstWage, how: 'fed (' + night + ') and paid, the best-paid kind of man at level 1 (' + firstWage + ')' },
    a_hired_mans_night_top: { is: night + topWage, how: 'fed (' + night + ') and paid, the best-paid kind of man at level 11 (' + topWage + ')' },
    dearest_weapon: { is: conv(w.value), how: w.id + ', ' + w.value + ' crowns of worth at ' + cpb + ' to one' },
    dearest_body_armour: { is: conv(b.value), how: b.id + ', ' + b.value + ' crowns of worth' },
    dearest_helmet: { is: conv(h.value), how: h.id + ', ' + h.value + ' crowns of worth' },
    dearest_shield: { is: conv(s.value), how: s.id + ', ' + s.value + ' crowns of worth' },
    start_purse_least: { is: Math.min.apply(null, purse), how: 'the poorest start (the fight pit, bare shelves)' },
    start_purse_most: { is: Math.max.apply(null, purse), how: 'the richest start (the lab rats, full shelves)' },
    retinue_least: { is: Math.min.apply(null, ret), how: 'the cheapest of the eighteen who join the camp' },
    retinue_most: { is: Math.max.apply(null, ret), how: 'the dearest of the eighteen' }
  };
  Object.keys(out).forEach(k => { out[k].paid = words(T, out[k].is); });
  return out;
}

/* ---------------- check: every fault, in plain words ---------------- */
function check(T, opts) {
  opts = opts || {}; const bad = [], rows = T.rows || {};
  /* 1 every place is the table's number */
  const seen = {};
  placed(T).forEach(x => {
    if (x.missing) return bad.push('PLACE: ' + x.file + ' is not on disk (a place the table names)');
    if (x.empty) return bad.push('PLACE: ' + x.file + ' ' + x.place.paths.join(' | ') + ' matches nothing (the place moved: fix the path, then seed)');
    const v = (rows[x.file] || {})[x.leaf.key]; seen[x.file + '#' + x.leaf.key] = 1;
    if (v === undefined) return bad.push('NOT IN THE TABLE: ' + x.file + ' ' + x.leaf.key + ' = ' + x.leaf.v + ' (run seed, or it is a new number: give it a row)');
    if (!numEq(v, x.leaf.v)) bad.push('NOT THE TABLE\'S NUMBER: ' + x.file + ' ' + x.leaf.key + ' says ' + x.leaf.v + ', the table says ' + v + ' (run stamp)');
  });
  Object.keys(rows).forEach(f => Object.keys(rows[f]).forEach(k => { if (!seen[f + '#' + k]) bad.push('A ROW WITH NO PLACE: ' + f + ' ' + k + ' = ' + rows[f][k] + ' (the place is gone: take the row out, or fix the path)'); }));
  /* 2 every typed copy in code says the table's number */
  const hits = copyHits(T), spans = {};
  hits.forEach(h => {
    if (h.missing) return bad.push('COPY: ' + h.c.file + ' is not on disk');
    if (h.none) return bad.push('COPY GONE: ' + h.c.file + ' /' + h.c.find + '/ matches nothing (' + h.c.what + ')');
    (spans[h.c.file] = spans[h.c.file] || []).push([h.at, h.end]);
    const w = want(T, h.c); if (h.c.find.indexOf('(') < 0 || h.raw == null) return;
    if (w === undefined) return bad.push('COPY WITH NO NUMBER: ' + h.c.file + ' /' + h.c.find + '/ names ' + (h.c.row || h.c.ladder || h.c.rule || h.c.leaf) + ', which the table does not hold');
    if (!numEq(w, h.says)) bad.push('A TYPED COPY IS NOT THE TABLE\'S NUMBER: ' + h.c.file + ':' + lineOf(file(h.c.file).text, h.at) + ' says ' + h.raw + ', the table says ' + w + ' (' + h.c.what + '; run stamp)');
  });
  (T.copies || []).forEach((c, n) => { if (c.n != null) { const k = hits.filter(h => h.n === n && !h.none && !h.missing).length; if (k !== c.n) bad.push('COPY COUNT: ' + c.file + ' /' + c.find + '/ matched ' + k + ' times, the table expects ' + c.n + ' (' + c.what + ')'); } });
  /* 3 a number typed into live code that no copy holds */
  typedInCode(T).forEach(t => { if (!(spans[t.file] || []).some(s => t.at >= s[0] && t.end <= s[1])) bad.push('TYPED IN CODE, NOT FROM THE TABLE: ' + t.file + ':' + lineOf(file(t.file).text, t.at) + ' ' + t.what + ' [' + t.near + ']'); });
  /* 4 the number inside a sentence */
  proseHits(T).forEach(h => {
    if (h.missing) return bad.push('PROSE: ' + h.p.file + ' is not on disk');
    if (h.gone) return bad.push('PROSE GONE: ' + h.p.file + ' ' + h.p.path + ' is not a sentence any more');
    const w = (h.p.nums || []).map(x => typeof x === 'number' ? x : want(T, { row: x }));
    if (w.length !== h.nums.length) return bad.push('PROSE: ' + h.p.file + ' ' + h.p.path + ' holds ' + h.nums.length + ' numbers, the table names ' + w.length);
    h.nums.forEach((n, i) => { if (w[i] === undefined) bad.push('PROSE WITH NO ROW: ' + h.p.file + ' ' + h.p.path + ' names ' + h.p.nums[i]); else if (!numEq(Math.abs(w[i]), n.says)) bad.push('THE NUMBER IN A SENTENCE IS NOT THE TABLE\'S: ' + h.p.file + ' ' + h.p.path + ' says ' + n.says + ', the table says ' + Math.abs(w[i]) + ' (run stamp: it moves the number, never a word)'); });
  });
  proseInData(T).forEach(p => bad.push('A SENTENCE WITH A TYPED NUMBER OF BATTERIES, NOT TIED TO A ROW: ' + p.file + ' ' + p.key + ' [' + p.v + ']'));
  /* 5 the sweep */
  sweep(T).forEach(s => bad.push('A BATTERY NUMBER OUTSIDE THE TABLE: ' + s.file + ' ' + s.key + ' = ' + s.v + ' (give it a place in the table\'s where, or name it in sweep.not_batteries with why)'));
  /* 6 the bands */
  const B = T.bands || {};
  placed(T).forEach(x => { if (!x.leaf) return; const b = B[x.place.band]; if (!b) { if (x.place.band) bad.push('NO SUCH BAND: ' + x.place.band + ' (' + x.file + ')'); return; }
    const v = Math.abs((rows[x.file] || {})[x.leaf.key]); if (v === 0 && b.zero_ok) return;
    if (!(v >= b.min && v <= b.max)) bad.push('OUT OF ITS BAND: ' + x.file + ' ' + x.leaf.key + ' = ' + v + ', ' + x.place.band + ' is ' + b.min + ' to ' + b.max + ' (' + b.say + ')'); });
  /* 7 the ladder: the unit is there, every sum is paid in small counts */
  const L = (T.ladder.value || []).slice().sort((a, b) => a.worth - b.worth);
  if (!L.length || L[0].worth !== 1 || L[0].id !== T.unit.id) bad.push('THE LADDER: its smallest is not the unit (one ' + T.unit.id + ')');
  L.forEach(k => { ['icon', 'small'].forEach(q => { if (!k[q] || !has('slices/' + k[q])) bad.push('THE LADDER: ' + k.id + ' has no picture on disk (' + k[q] + ')'); }); });
  let worst = 0; for (let n = 0; n <= 6000; n++) { const s = split(T, n); if (s.reduce((a, p) => a + p.n * L.filter(k => k.id === p.id)[0].worth, 0) !== n) { bad.push('THE LADDER: ' + n + ' is not paid exactly'); break; } if (s.length > worst) worst = s.length; }
  if (worst > (T.ladder.most_kinds || 3)) bad.push('THE LADDER: a sum is drawn in ' + worst + ' kinds of battery, the table allows ' + (T.ladder.most_kinds || 3));
  /* 8 the worked sums are what the table says */
  let S = null; try { S = sums(T); } catch (e) { bad.push('THE WORKED SUMS could not be worked: ' + e.message); }
  if (S) { Object.keys(T.sums || {}).forEach(k => { if (!S[k]) return bad.push('A WORKED SUM NOBODY WORKS: ' + k); if (!numEq(S[k].is, T.sums[k].is)) bad.push('A WORKED SUM MOVED: ' + k + ' is ' + S[k].is + ' now, the table says ' + T.sums[k].is + ' (run seed and read what changed)'); });
    Object.keys(S).forEach(k => { if (!(T.sums || {})[k]) bad.push('A WORKED SUM NOT IN THE TABLE: ' + k + ' = ' + S[k].is + ' (run seed)'); });
    const cap = (T.bands.one_job || {}).max; if (cap && S.job_pushed_twice.is > cap) bad.push('THE BIGGEST JOB pays ' + S.job_pushed_twice.is + ', over the table\'s ' + cap); }
  return bad;
}

/* ---------------- seed and stamp ---------------- */
function seed(T) {
  const rows = {}, moved = [];
  placed(T).forEach(x => { if (!x.leaf) return; (rows[x.file] = rows[x.file] || {})[x.leaf.key] = x.leaf.v;
    const was = ((T.rows || {})[x.file] || {})[x.leaf.key]; if (was === undefined) moved.push('+ ' + x.file + ' ' + x.leaf.key + ' = ' + x.leaf.v); else if (!numEq(was, x.leaf.v)) moved.push('~ ' + x.file + ' ' + x.leaf.key + ' ' + was + ' -> ' + x.leaf.v); });
  Object.keys(T.rows || {}).forEach(f => Object.keys(T.rows[f]).forEach(k => { if (!rows[f] || rows[f][k] === undefined) moved.push('- ' + f + ' ' + k); }));
  T.rows = rows; const S = sums(T); T.sums = {}; Object.keys(S).forEach(k => { T.sums[k] = S[k]; });
  T.count = { rows: Object.keys(rows).reduce((a, f) => a + Object.keys(rows[f]).length, 0), files: Object.keys(rows).length, copies: (T.copies || []).length, prose: (T.prose || []).length };
  return moved;
}
function stamp(T) {
  const moved = [], put = (f, s, e, txt) => file(f).edits.push([s, e, txt]);
  placed(T).forEach(x => { if (!x.leaf) return; const v = (T.rows[x.file] || {})[x.leaf.key]; if (v === undefined || numEq(v, x.leaf.v)) return; put(x.file, x.leaf.s, x.leaf.e, String(v)); moved.push(x.file + ' ' + x.leaf.key + ' ' + x.leaf.v + ' -> ' + v); });
  copyHits(T).forEach(h => { if (h.none || h.missing || h.raw == null) return; const w = want(T, h.c); if (w === undefined || numEq(w, h.says)) return; put(h.c.file, h.gs, h.ge, String(w)); moved.push(h.c.file + ':' + lineOf(file(h.c.file).text, h.at) + ' ' + h.raw + ' -> ' + w + ' (' + h.c.what + ')'); });
  proseHits(T).forEach(h => { if (!h.nums) return; const w = (h.p.nums || []).map(x => typeof x === 'number' ? x : want(T, { row: x })); if (w.length !== h.nums.length) return;
    h.nums.forEach((n, i) => { if (w[i] === undefined || numEq(Math.abs(w[i]), n.says)) return; put(h.p.file, n.s, n.e, String(Math.abs(w[i]))); moved.push(h.p.file + ' ' + h.p.path + ' ' + n.says + ' -> ' + Math.abs(w[i]) + ' (the number in the sentence)'); }); });
  Object.keys(FILES).forEach(f => { const F = FILES[f]; if (!F.edits.length) return; F.edits.sort((a, b) => b[0] - a[0]); let t = F.text; F.edits.forEach(e => { t = t.slice(0, e[0]) + e[2] + t.slice(e[1]); }); fs.writeFileSync(path.join(ROOT, f), t); delete FILES[f]; });
  return moved;
}

/* ---------------- list: the whole inventory as a page ---------------- */
function list(T) {
  const o = [], rows = T.rows || {}, by = {};
  placed(T).forEach(x => { if (!x.leaf) return; const k = (T.where.indexOf(x.place)); (by[k] = by[k] || []).push(x); });
  o.push('| # | where it lives | what it is | how many | from | to | band |', '|---|---|---|---|---|---|---|');
  T.where.forEach((pl, k) => { const xs = by[k] || [], vs = xs.map(x => rows[x.file][x.leaf.key]);
    o.push('| ' + (k + 1) + ' | `' + pl.file.replace('records/target/', '') + '` ' + pl.paths.map(p => '`' + p + '`').join(' ') + ' | ' + pl.what + ' | ' + vs.length + ' | ' + (vs.length ? Math.min.apply(null, vs) : '') + ' | ' + (vs.length ? Math.max.apply(null, vs) : '') + ' | ' + (pl.band || (pl.unit === 'ratio' ? 'a ratio' : '')) + ' |'); });
  return o.join('\n');
}

module.exports = { load, save, check, seed, stamp, sums, split, words, list, placed, copyHits, typedInCode, sweep, proseHits, leaves, TABLE, ROOT, reset: () => { Object.keys(FILES).forEach(k => delete FILES[k]); } };
if (require.main === module) {
  const cmd = process.argv[2] || 'check', T = load();
  if (cmd === 'seed') { const m = seed(T); save(T); console.log(m.join('\n') || 'nothing moved'); console.log('THE TABLE: ' + T.count.rows + ' numbers in ' + T.count.files + ' files, ' + T.count.copies + ' typed copies, ' + T.count.prose + ' sentences'); }
  else if (cmd === 'stamp') { const m = stamp(T); console.log(m.join('\n') || 'nothing to move: every place is the table\'s number'); }
  else if (cmd === 'list') console.log(list(T));
  else if (cmd === 'sums') { const S = sums(T); Object.keys(S).forEach(k => console.log(k.padEnd(28) + String(S[k].is).padStart(6) + '  ' + S[k].paid.padEnd(52) + S[k].how)); }
  else { const bad = check(T); bad.forEach(b => console.log('  FAULT ' + b)); console.log('THE BATTERY TABLE: ' + (bad.length ? bad.length + ' faults' : 'every number is the table\'s')); process.exit(bad.length ? 1 : 0); }
}
