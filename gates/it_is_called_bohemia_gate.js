#!/usr/bin/env node
/* IT IS CALLED BOHEMIA (WORDS 2, 11/3/26, VAMILY rule 362, ask line 386).

   His words, 11/3: 'don't put any writing anywhere that's called Las Vegas. Bohemia is Las Vegas... scour all the lines of any
   text in the game if it's called Las Vegas, no, it's called Bohemia.'

   THE SURFACE (what a player can read): the demo and the alpha it is cut from, every page they open on the way to play (the map,
   the town, the crew, the fight, the spoils, the phone) and the VOTE tab, found by following the pages' own references, not by a
   hand list; and every data file those pages load (records/target/bb/*.json, the feed, the world feed, the region, the bases ...).
   The alpha's dev-tab frames (data-src) are the workshop and are not followed; the VOTE tab is.

   WHAT FAILS: "Vegas" in any case, anywhere a player can read it:
     H  a page's HTML outside <script>/<style>, after its <!-- comments --> are taken out: text, labels, titles, aria-labels, alt
     S  a string or template literal inside a script (comments taken out first)
     J  a data file's string value or key
     V  the VOTE registry: every item still waiting for his vote, and the page it shows (a vote consumes; a judged card never renders again)
   WHAT IS ALLOWED, AND ONLY THIS (rule 362: 'records and code comments may keep the real name'):
     - code comments (// and block comments in scripts, <!-- --> in pages), and the '#' comment lines of the .bq quest format
     - a code name: a string with no space in it that is never written to the screen ('vegasorgan' is a sound's id); and a code
       identifier outside any string
     - a MACHINE NOTE: the value of a field named in MACHINE below, each a note for the machine that no screen draws (checked by
       hand at the time of writing, file by file, and said in the record: records/BOHEMIA_WORDS_IT_IS_CALLED_BOHEMIA_11_3_26.md)
     - in the VOTE registry, `said`: his own words quoted back to him, never rewritten; on a waiting card's page, a retired line
       quoted struck through for a before and after (<div class="was" data-was>)
   PLANTS: a planted line in each of H, S, J and V is caught; a planted comment and a planted machine note pass.
   Run: node gates/it_is_called_bohemia_gate.js   (seconds, node only) */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + String(why).slice(0, 1600) + ']' : '')); };

const VEGAS = /vegas/i;
const ENTRY = ['slices/BOHEMIA_DEMO.html', 'slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_VOTE_TAB.html'];
const REGISTRY = 'records/target/BOHEMIA_VOTE_REGISTRY.json';

/* MACHINE NOTES: fields that carry a lane's research or reasoning, never drawn. Each was read against every page that loads it. */
const MACHINE = new Set([
  '_about', '_why', '_readme', '_note', '_source', '_rule', '_how',  /* a data file's own notes to the next lane            */
  'note', 'notes', 'real', 'research',                              /* the real-world fact a row was built from              */
  'reference', 'ref', 'source', 'sources', 'cite',                  /* citations: a district kit's research, a sprite's photo */
  'summary', 'layout', 'decisions', 'circulation', 'layering',      /* a district kit's NOTES block, read by no screen        */
  'act1',                                                            /* a kit tile's look, read only by the material sorter    */
  'voice', 'teaches',                                                /* the feed's writer's notes on an account and a kind     */
  'hold'                                                             /* belonging.js's dossier: bargain() returns it, no screen draws it */
]);
/* the VOTE registry draws title, why, question, options, show (text) and twin's diffs; it never draws these */
const VOTE_SKIP = new Set(['said', 'id', 'redoOf', 'sha', 'src', 'lane', 'made', 'kind', 'first', 'firstAt']);

/* ---------- reading a page ---------- */
function scriptSpans(html) {   /* [start, end) of every <script>...</script> body */
  const out = []; const re = /<script\b[^>]*>/gi; let m;
  while ((m = re.exec(html))) {
    const s = m.index + m[0].length; const e = html.indexOf('</script>', s);
    out.push([s, e < 0 ? html.length : e]); re.lastIndex = e < 0 ? html.length : e;
  }
  return out;
}
/* tokenise a script: comments out, strings kept with their position. Returns the strings. */
function scriptStrings(src, base) {
  const out = []; let i = 0; const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < n && src[j] !== c) { if (src[j] === '\\') j++; else if (src[j] === '\n' && c !== '`') break; j++; }
      out.push({ at: base + i, end: base + j + 1, text: src.slice(i + 1, j), q: c });
      i = j + 1; continue;
    }
    if (c === '/' && src[i + 1] === '*') { const j = src.indexOf('*/', i + 2); i = j < 0 ? n : j + 2; continue; }
    if (c === '/' && src[i + 1] === '/') { const j = src.indexOf('\n', i); i = j < 0 ? n : j; continue; }
    if (c === '<' && src.startsWith('<!--', i)) { const j = src.indexOf('-->', i + 4); i = j < 0 ? n : j + 3; continue; }
    i++;
  }
  return out;
}
/* the field a string belongs to: walk back over the array/concatenation it sits in to the nearest `key:` */
function ownerKey(whole, at, strings, idx) {
  let k = idx, pos = at;
  for (let guard = 0; guard < 400; guard++) {
    let b = pos - 1; while (b >= 0 && /\s/.test(whole[b])) b--;
    const ch = whole[b];
    if (ch === ':') {                                   /* key: '...'  or  "key": "..." */
      let e = b - 1; while (e >= 0 && /\s/.test(whole[e])) e--;
      if (whole[e] === '"' || whole[e] === "'") { const s = whole.lastIndexOf(whole[e], e - 1); return whole.slice(s + 1, e); }
      let s = e; while (s >= 0 && /[A-Za-z0-9_$]/.test(whole[s])) s--;
      return whole.slice(s + 1, e + 1);
    }
    if (ch === ',' || ch === '[' || ch === '+' || ch === '(') {   /* inside a list or a sum: step to the previous string */
      if (ch === '[' || ch === '(') { pos = b; continue; }
      let p = k - 1; if (p < 0 || !strings[p] || strings[p].end < b - 2000) return null;
      if (strings[p].end - 1 > b) return null;
      k = p; pos = strings[p].at; continue;
    }
    return null;
  }
  return null;
}
const isCodeName = t => !/\s/.test(t) && /^[A-Za-z0-9_$.:\-\/]+$/.test(t);
function bqCommentOnly(text) {   /* every line of the string that says vegas is a '#' line of the .bq format */
  const lines = text.split(/\\n|\n/);
  return lines.filter(l => VEGAS.test(l)).every(l => /^\s*#/.test(l));
}
function lineOf(s, at) { let n = 1; for (let i = 0; i < at; i++) if (s.charCodeAt(i) === 10) n++; return n; }

function scanScript(whole, from, to, file, hits) {
  const strs = scriptStrings(whole.slice(from, to), from);
  strs.forEach((st, i) => {
    if (!VEGAS.test(st.text)) return;
    if (isCodeName(st.text)) return;
    if (bqCommentOnly(st.text)) return;
    const key = ownerKey(whole, st.at, strs, i);
    if (key && MACHINE.has(key)) return;
    hits.push({ file, line: lineOf(whole, st.at), key: key || '', text: st.text.slice(Math.max(0, st.text.search(VEGAS) - 60), st.text.search(VEGAS) + 60) });
  });
}
function scanPage(file, text, hits) {
  if (/\.js$/.test(file)) { scanScript(text, 0, text.length, file, hits); return; }
  /* a VOTE card that shows a before and after quotes the retired line struck through: <div class="was" data-was>...</div> */
  if (CARD_PAGES.has(file)) text = text.replace(/<div class="was" data-was>[\s\S]*?<\/div>/g, m => m.replace(/[^\n]/g, ' '));
  const spans = scriptSpans(text);
  spans.forEach(([s, e]) => scanScript(text, s, e, file, hits));
  /* outside scripts and styles: everything but comments is readable */
  let outside = text; const blank = (a, b) => { outside = outside.slice(0, a) + outside.slice(a, b).replace(/[^\n]/g, ' ') + outside.slice(b); };
  spans.slice().reverse().forEach(([s, e]) => blank(s, e));
  outside = outside.replace(/<style\b[\s\S]*?<\/style>/gi, m => m.replace(/[^\n]/g, ' ')).replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, ' '));
  let m; const re = /vegas/gi;
  while ((m = re.exec(outside))) {
    const a = outside.lastIndexOf('\n', m.index) + 1, b = outside.indexOf('\n', m.index);
    hits.push({ file, line: lineOf(outside, m.index), key: '(page)', text: outside.slice(a, b < 0 ? undefined : b).trim().slice(0, 160) });
  }
}
function scanJson(file, data, hits, skip) {
  (function walk(o, key) {
    if (o && typeof o === 'object') {
      for (const k of Object.keys(o)) {
        if (VEGAS.test(k) && !isCodeName(k) && !(skip && skip(k))) hits.push({ file, line: 0, key: '(a key)', text: k });   /* a key with words in it could be drawn; a code name is not */
        if (MACHINE.has(k) || (skip && skip(k))) continue;
        walk(o[k], Array.isArray(o) ? key : k);
      }
    } else if (typeof o === 'string' && VEGAS.test(o)) {
      hits.push({ file, line: 0, key, text: o.slice(Math.max(0, o.search(VEGAS) - 60), o.search(VEGAS) + 60) });
    }
  })(data, '');
}
function scanRegistry(file, R, hits) {
  const judged = new Set((R.verdicts || []).map(v => v.id));
  (R.items || []).forEach(it => { if (!judged.has(it.id)) scanJson(file + ' #' + it.id, it, hits, k => VOTE_SKIP.has(k)); });
}
/* VOTE's two side files (the triage tags and the list of his yeses) carry rows about cards; a row about a JUDGED card is the
   record of what the card was called when he voted, and is left as it was; a row about a card still waiting is checked */
const VOTE_SIDE = new Set(['records/target/BOHEMIA_VOTE_TRIAGE.json', 'records/target/BOHEMIA_YES_IN_THE_DEMO.json']);
function judgedIds() {
  try { return new Set((JSON.parse(fs.readFileSync(path.join(ROOT, REGISTRY), 'utf8')).verdicts || []).map(v => v.id)); } catch (e) { return new Set(); }
}
function scanVoteSide(file, data, judged, hits) {
  (function walk(o, key) {
    if (o && typeof o === 'object') {
      if (!Array.isArray(o) && judged.has(o.id)) return;
      for (const k of Object.keys(o)) {
        if (judged.has(k)) continue;
        if (VEGAS.test(k) && !isCodeName(k)) hits.push({ file: file + ' #side', line: 0, key: '(a key)', text: k });
        if (MACHINE.has(k) || k === 'id') continue;
        walk(o[k], Array.isArray(o) ? key : k);
      }
    } else if (typeof o === 'string' && VEGAS.test(o)) hits.push({ file: file + ' #side', line: 0, key, text: o.slice(0, 160) });
  })(data, '');
}

/* ---------- the surface, found by following the pages ---------- */
const REF = /['"`(]((?:\.\.?\/)?[A-Za-z0-9_.\/-]+\.(?:html|json|js|txt|bq))(?:[?#][^'"`)]*)?['"`)]/g;
function surface() {
  const seen = new Map(); const todo = ENTRY.slice();
  while (todo.length) {
    const f = todo.pop(); if (seen.has(f)) continue;
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p) || !fs.statSync(p).isFile()) { seen.set(f, null); continue; }
    const s = fs.readFileSync(p, 'utf8'); seen.set(f, s);
    if (!/\.(html|js)$/.test(f)) continue;
    const devTabs = new Set(); let d; const dre = /data-src=["']([^"']+)["']/g;
    if (/BOHEMIA_(DEMO|ALPHA_0_9)\.html$/.test(f)) while ((d = dre.exec(s))) if (!/VOTE_TAB/.test(d[1])) devTabs.add(d[1]);
    let m; REF.lastIndex = 0;
    while ((m = REF.exec(s))) {
      const r = m[1]; if (devTabs.has(r) || /^https?:/.test(r)) continue;
      const q = path.normalize(path.join(path.dirname(f), r));
      if (!/^(slices|engine|records\/target)\//.test(q)) continue;   /* the three folders the site publishes (_config.yml) */
      if (!seen.has(q)) todo.push(q);
    }
  }
  /* the page each card still waiting in VOTE shows (show.src, relative to slices/): read as a page, its own references not followed */
  try {
    const R = JSON.parse(fs.readFileSync(path.join(ROOT, REGISTRY), 'utf8')); const judged = new Set((R.verdicts || []).map(v => v.id));
    (R.items || []).forEach(it => {
      const src = it.show && it.show.src; if (judged.has(it.id) || typeof src !== 'string' || !/\.html$/.test(src)) return;
      const q = path.normalize(path.join('slices', src)); const p = path.join(ROOT, q);
      if (!seen.has(q) && /^slices\//.test(q) && fs.existsSync(p)) { seen.set(q, fs.readFileSync(p, 'utf8')); CARD_PAGES.add(q); }
    });
  } catch (e) {}
  return [...seen.entries()].filter(([, s]) => s !== null);
}
const CARD_PAGES = new Set();

function scanAll(files) {
  const hits = []; let judged = null;
  for (const [f, s] of files) {
    if (!VEGAS.test(s)) continue;
    if (f === REGISTRY) { scanRegistry(f, JSON.parse(s), hits); continue; }
    if (VOTE_SIDE.has(f)) { scanVoteSide(f, JSON.parse(s), judged || (judged = judgedIds()), hits); continue; }
    if (/\.json$/.test(f)) { let data; try { data = JSON.parse(s); } catch (e) { scanPage(f.replace(/json$/, 'js'), s, hits); continue; } scanJson(f, data, hits); continue; }
    if (/\.(txt|bq)$/.test(f)) { s.split('\n').forEach((l, i) => { if (VEGAS.test(l) && !/^\s*#/.test(l)) hits.push({ file: f, line: i + 1, key: '(text)', text: l.slice(0, 160) }); }); continue; }
    scanPage(f, s, hits);
  }
  return hits;
}

console.log('='.repeat(74));
console.log('IT IS CALLED BOHEMIA: no line a player can read says Las Vegas or Vegas (rule 362)');
console.log('='.repeat(74));

const files = surface();
const pages = files.filter(([f]) => /\.html$/.test(f)).map(([f]) => f);
const data = files.filter(([f]) => /\.(json|txt|bq)$/.test(f)).map(([f]) => f);

/* F: the surface is the game, not a guess */
{
  const must = ['slices/BOHEMIA_CITY_WORLD.html', 'slices/BOHEMIA_FIGHT.html', 'slices/BOHEMIA_SPOILS_SCREEN.html',
    'slices/BOHEMIA_SETTLEMENT_SCREEN.html', 'slices/BOHEMIA_CURRENT_SLICE.html', 'slices/BOHEMIA_VOTE_TAB.html',
    'records/target/bb/feed_kinds.json', 'records/target/bb/feed_world.json', 'records/target/bb/region_bases.json',
    'engine/BOHEMIA_REGION_LAND.json', REGISTRY];
  const missing = must.filter(m => !files.some(([f]) => f === m));
  const dev = ['slices/BOHEMIA_WORDS_CURRENT.html', 'slices/BOHEMIA_MAP_CURRENT.html', 'slices/BOHEMIA_RUN_CURRENT.html'].filter(m => files.some(([f]) => f === m));
  leg(!missing.length && !dev.length && pages.length >= 8 && data.length >= 40,
    'F   THE SURFACE IS FOUND FROM THE PAGES: the map, the town, the fight, the spoils, the phone and VOTE, and their data; no dev tab',
    pages.length + ' pages, ' + data.length + ' data files, ' + files.length + ' files in all; missing ' + (missing.join(', ') || 'none') + '; dev tabs followed ' + (dev.join(', ') || 'none'));
}

const hits = scanAll(files);
const byFile = {}; hits.forEach(h => { const f = h.file.replace(/ #.*/, ''); byFile[f] = (byFile[f] || 0) + 1; });
const show = hs => hs.slice(0, 40).map(h => h.file.replace(/^slices\/|^records\/target\//, '') + (h.line ? ':' + h.line : '') + (h.key ? ' <' + h.key + '>' : '') + ' "' + h.text.replace(/\s+/g, ' ') + '"').join(' | ');
const card = h => CARD_PAGES.has(h.file);
const H = hits.filter(h => h.key === '(page)' && !card(h)), S = hits.filter(h => /\.(html|js)$/.test(h.file) && h.key !== '(page)' && !card(h)),
  J = hits.filter(h => /\.(json|txt|bq)$/.test(h.file) && !/ #/.test(h.file)), V = hits.filter(h => / #/.test(h.file) || card(h));
leg(!H.length, 'H   NO PAGE SAYS VEGAS: text, labels, titles, aria-labels and alt outside scripts and comments', H.length + ' ' + show(H));
leg(!S.length, 'S   NO SCRIPT WRITES VEGAS: every string a page can draw (comments, code names and machine notes aside)', S.length + ' ' + show(S));
leg(!J.length, 'J   NO DATA FILE THE GAME LOADS SAYS VEGAS: every value and key a screen can draw', J.length + ' ' + show(J));
leg(!V.length, 'V   NO VOTE CARD STILL WAITING SAYS VEGAS: title, why, question, options, the twin, the page it shows (his own words quoted back aside)', V.length + ' ' + show(V));
console.log('  COUNT BY FILE: ' + (Object.keys(byFile).length ? Object.entries(byFile).sort((a, b) => b[1] - a[1]).map(([f, n]) => n + ' ' + f).join(', ') : 'none'));

/* P: plants. Each leg must bite on a planted line and let a planted comment and machine note through. */
{
  const plant = (f, s) => scanAll([[f, s]]);
  const pH = plant('slices/P.html', '<div id="frontsub">POST-ECONOMIC APOCALYPSE - LAS VEGAS</div><!-- Las Vegas in a comment --><img alt="vegas">');
  const pS = plant('slices/P.html', "<script>/* Las Vegas */ // vegas\nvar a={name:'NORTH LAS VEGAS', reference:['Las Vegas Blvd'], id:'vegasorgan'}; el.textContent=`Have a great day, Vegas!`;</script>");
  const pJ = plant('records/target/bb/p.json', JSON.stringify({ _about: 'the real Las Vegas', kinds: [{ words: [{ en: 'tell vegas to say thank you' }] }], real: 'Lake Las Vegas' }));
  const pV = plant(REGISTRY, JSON.stringify({ items: [{ id: 'a', title: 'A VEGAS RANCH', said: 'in the desert of Vegas' }, { id: 'b', title: 'old Vegas' }], verdicts: [{ id: 'b', vote: 'up' }] }));
  const pB = plant('slices/P.html', '<script>var Q={"S1":"# BOHEMIA SIDE QUEST\\n# Las Vegas tap water is hard\\nSAY: hello"};</script>');
  CARD_PAGES.add('slices/vote/P.html');
  const pC = plant('slices/vote/P.html', '<div class="was" data-was><b>WAS</b><span>LAS VEGAS 6 MI</span></div><div class="now"><span>old Vegas</span></div>');
  CARD_PAGES.delete('slices/vote/P.html');
  leg(pH.length === 2 && pS.length === 2 && pJ.length === 1 && pV.length === 1 && pB.length === 0 && pC.length === 1,
    'P   THE PLANTS: the start line and an alt caught, a comment passes; a name and a template caught, a citation and a code name pass; a post caught, its notes pass; a waiting card caught, his quote and a judged card pass; a .bq comment passes; on a card the struck-through old line passes and a new one is caught',
    'H ' + pH.length + '/2, S ' + pS.length + '/2, J ' + pJ.length + '/1, V ' + pV.length + '/1, bq ' + pB.length + '/0');
}

console.log('\n=== IT IS CALLED BOHEMIA: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
