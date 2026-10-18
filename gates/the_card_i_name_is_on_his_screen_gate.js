/* ============================================================================
   THE CARD I NAME IS ON HIS SCREEN
   (PLUMBER 10/18/26, row [the card I name is on his screen]; rule 118)

   PAOLO 10/18: "A lot of the votes you saying were on a card visible we're not visible for me."
   records/BOHEMIA_PAOLO_THE_CARDS_YOU_NAMED_WERE_NOT_ON_MY_SCREEN_10_18_26.md. The coordinator sent him to the
   VOTE tab for fourteen things and five of them never had a card (the district fight boards, the bare front
   screen, the tuning grid, the freeway as one road, the middle-ground song): it wrote what a lane PLANNED as if
   it were on his screen. Rule 118: a thing is named as in the VOTE tab only when its card id is in the registry,
   unvoted, and on his first screen; a lane that writes IN VOTE writes the id; a lane that pulls a card says so.

   HOW IT KNOWS WHAT IS ON HIS SCREEN: it does not guess and it keeps no copy of the sort. It runs the VOTE tab's
   OWN script (slices/BOHEMIA_VOTE_TAB.html, the file the alpha frames behind the gear) in a sandbox with a small
   stand-in for the page, feeds it the committed registry and triage file the way Pages serves them, and reads
   the rows it drew into #list (his first screen) and, after tapping MORE, into #more. A phone that has voted
   nothing yet. So when RUN TWO or UI change the sort (red first, the untagged next, the cap, a tag only demotes),
   this gate follows the same commit. If the tab ever calls a page feature the stand-in does not have, T0 says so
   in those words, and that is PLUMBER's to fix, never the tab's.

   LEGS
     T0  the tab's own script runs here on the real registry and triage and draws its first screen.
     R1  the coordinator's newest round record (records/BOHEMIA_COORDINATOR_ROUND_<m>_<d>_<yy>[_<sweep>].md, by
         date then sweep letters) carries a section headed ON HIS SCREEN, from sweep AX (10/18) on.
     R2  every line under ON HIS SCREEN is one card id (a line in brackets is a note; nothing else): a plan written
         as prose, 'the district fight boards', is exactly what he could not find.
     R3  every id listed there is on his first screen: in the registry, unvoted, not tagged out, and not behind
         MORE (yellow, or past the first screen's cap). The red says which of those it is.
     B1  every row on the board that says IN VOTE (the status phrase, upper case; 'NOT IN VOTE', 'NOTHING
         REGISTERED IN VOTE' and a quote such as 'says IN VOTE' are not claims) names a card id in the same row.
     B2  the id it names (the first after the phrase, else the last before it) is in the registry.
     P1  a row that says it PULLED, RETRACTED or WITHDREW a card and names its id in the same clause names an id
         that is no longer in the registry's items (rule 118(c)).
     S1-S14  planted cases, every leg caught both ways on copies, never on the real files.
     M1-M5   the real newest record and the real board, broken the way his 10/18 was (the five things written as
             prose, then as ids nobody registered, then voted, the heading gone; COMBAT TWO's 'all four of my
             cards' put back on its row), each caught on a copy.
   GRANDFATHERED: rows that broke B1, B2 or P1 when this landed are listed in BASELINE below with why; the list
   only shrinks (a baseline row that passes now is printed so PLUMBER drops it), and a row not on it is held.

   It reads only. No browser, under a second.
   node gates/the_card_i_name_is_on_his_screen_gate.js [--board VAMILY.md] [--record path]
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const TAB = 'slices/BOHEMIA_VOTE_TAB.html';
const REG = 'records/target/BOHEMIA_VOTE_REGISTRY.json';
const TRI = 'records/target/BOHEMIA_VOTE_TRIAGE.json';
const ROUND_RE = /^BOHEMIA_COORDINATOR_ROUND_(\d{1,2})_(\d{1,2})_(\d{2})(?:_([A-Z]+))?\.md$/;
const FIRST_WITH_SECTION = { m: 10, d: 18, y: 26, s: 'AX' };      /* sweep AX wrote the first ON HIS SCREEN */
const ID_RE = /\b[a-z][a-z0-9]*(?:-[a-z0-9]+)+-\d{1,2}-\d{1,2}\b/g; /* every registry id ends -<month>-<day> */

/* rows that already broke a board leg when this gate landed (10/18), keyed LANE [label] / leg; shrink only */
const BASELINE = {
};

let pass = 0, fail = 0;
/* the tab's promise chains end in a .catch that may itself throw on a page feature the stand-in lacks: catch it
   here and say so, never crash */
let stray = null, inTab = false;
process.on('unhandledRejection', (e) => {
  if (inTab) { stray = e; return; }
  console.log('  FAIL the gate itself threw, so nothing after this was checked\n         ' + String(e && e.stack || e));
  process.exit(1);                                          /* a gate that dies quietly must never read as green */
});
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const read = (rel) => fs.readFileSync(path.isAbsolute(rel) ? rel : path.join(ROOT, rel), 'utf8');

/* ---------------------------------------------------------------- THE TAB, RUN AS ITSELF */
/* the smallest page that the VOTE tab's script can draw into; anything it does not know throws loudly */
class El {
  constructor(tag, id) {
    this.tagName = String(tag).toUpperCase(); this.id = id || ''; this.children = []; this.parentNode = null;
    this.attrs = {}; this.dataset = {}; this.style = {}; this.className = ''; this.hidden = false;
    this._text = ''; this._html = ''; this.value = ''; this.listeners = {};
  }
  get classList() {
    const get = () => this.className.split(/\s+/).filter(Boolean), set = (a) => { this.className = a.join(' '); };
    return { add: (...c) => set([...new Set(get().concat(c))]), remove: (...c) => set(get().filter(x => !c.includes(x))),
      contains: (c) => get().includes(c),
      toggle: (c, f) => { const has = get().includes(c), want = f === undefined ? !has : !!f;
        if (want && !has) set(get().concat(c)); if (!want && has) set(get().filter(x => x !== c)); return want; } };
  }
  set textContent(v) { this.children.forEach(c => { c.parentNode = null; }); this.children = []; this._text = String(v); this._html = ''; }
  get textContent() { return this._text + this.children.map(c => c.textContent).join(''); }
  set innerHTML(v) { this.textContent = ''; this._html = String(v); }
  get innerHTML() { return this._html; }
  appendChild(c) { if (c.parentNode) c.parentNode.removeChild(c); this.children.push(c); c.parentNode = this; return c; }
  removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); c.parentNode = null; return c; }
  remove() { if (this.parentNode) this.parentNode.removeChild(this); }
  get childElementCount() { return this.children.length; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attrs, k) ? this.attrs[k] : null; }
  addEventListener(t, f) { (this.listeners[t] = this.listeners[t] || []).push(f); }
  click() { (this.listeners.click || []).forEach(f => f({ preventDefault() {} })); }
  all() { return this.children.reduce((a, c) => a.concat([c], c.all()), []); }
}

function tabScript(html) {
  const s = (html.match(/<script>([\s\S]*?)<\/script>/g) || []).map(x => x.replace(/^<script>|<\/script>$/g, ''));
  return s.find(x => x.includes('BOHEMIA_VOTE_REGISTRY.json')) || null;
}

/* files: { 'records/target/...json': object | null (a 404) }; anything not given is read from disk */
async function screen(files) {
  files = files || {};
  const html = files[TAB] !== undefined ? files[TAB] : read(TAB);
  const src = tabScript(html);
  if (!src) throw new Error('the tab has no script that reads the registry');
  const byId = {};
  const doc = {
    documentElement: new El('html'), body: new El('body'),
    createElement: (t) => new El(t),
    createTextNode: (t) => { const n = new El('#text'); n.textContent = t; return n; },
    getElementById: (id) => byId[id] || (byId[id] = new El('div', id)),
    querySelectorAll: (sel) => {
      const m = /^#([\w-]+)\s+\.([\w-]+)(?::not\(\.([\w-]+)\))?$/.exec(sel.trim());
      if (!m) throw new Error('the stand-in page cannot answer the selector ' + JSON.stringify(sel) + ' (PLUMBER: teach it)');
      return doc.getElementById(m[1]).all().filter(e => e.classList.contains(m[2]) && !(m[3] && e.classList.contains(m[3])));
    },
  };
  const mem = {};
  const fetch = (url) => {
    const rel = path.posix.normalize(path.posix.join('slices', String(url).split('?')[0]));
    let body;
    if (Object.prototype.hasOwnProperty.call(files, rel)) body = files[rel];
    else { try { body = JSON.parse(read(rel)); } catch (e) { body = null; } }
    const res = body === null || body === undefined
      ? { ok: false, status: 404, json: () => Promise.reject(new Error('404')) }
      : { ok: true, status: 200, json: () => Promise.resolve(JSON.parse(JSON.stringify(body))) };
    return Promise.resolve(res);
  };
  const ctx = {
    document: doc, fetch, console: { log() {}, warn() {}, error() {} },
    localStorage: { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: (k) => { delete mem[k]; } },
    navigator: { clipboard: { writeText() { return Promise.resolve(); } } },
    URL: { createObjectURL: () => '', revokeObjectURL() {} }, Blob: function Blob() {},
    setTimeout: (f, ms) => setTimeout(f, Math.min(+ms || 0, 5)), clearTimeout,
  };
  ctx.window = ctx; ctx.self = ctx;
  vm.createContext(ctx);
  stray = null; inTab = true;
  try {
    vm.runInContext(src, ctx, { filename: TAB, timeout: 2000 });
    for (let i = 0; i < 400 && !ctx.__voteReady && !stray; i++) await new Promise(r => setImmediate(r));
  } finally { inTab = false; }
  if (stray) throw new Error('the tab threw inside the stand-in page: ' + (stray && stray.message || stray) + ' (PLUMBER: teach the stand-in)');
  if (!ctx.__voteReady) throw new Error('the tab never said it was ready (window.__voteReady)');
  const ids = (el) => el.children.map(c => c.getAttribute('data-id')).filter(Boolean);
  const list = doc.getElementById('list'), fold = doc.getElementById('fold');
  const empty = doc.getElementById('empty');
  const out = { first: ids(list), behind: [], foldShown: !fold.hidden, failed: /DID NOT LOAD/.test(empty.textContent) };
  if (!fold.hidden) { fold.click(); out.behind = ids(doc.getElementById('more')); }
  return out;
}

/* why an id is not on his first screen, in his words where it can be */
function whyNot(id, reg, tri, scr) {
  const it = (reg.items || []).find(x => x && x.id === id);
  if (!it) return 'NOT IN THE REGISTRY: no card was ever registered under this id, or a lane pulled it';
  const v = (reg.verdicts || []).find(x => x && x.id === id);
  if (v) return 'ALREADY VOTED: ' + (v.vote === 'up' ? 'YES' : 'NO') + (v.when ? ' on ' + v.when : '') + '; he will not see it again';
  const t = tri && tri.tags && tri.tags[id] && String(tri.tags[id].tag || '').toLowerCase();
  if (t === 'green' || t === 'gray' || t === 'grey') return 'NEVER SHOWN: the triage tags it ' + t.toUpperCase();
  if (scr.behind.includes(id)) return 'BEHIND MORE: ' + (t === 'yellow' ? 'the triage tags it YELLOW'
    : 'past the first screen\'s ' + ((tri && tri.cap) || 12) + ' (number ' + (scr.behind.indexOf(id) + 1) + ' behind the fold)');
  return 'NOT DRAWN by the tab (read slices/BOHEMIA_VOTE_TAB.html draw())';
}

/* ---------------------------------------------------------------- THE COORDINATOR'S RECORD */
function roundKey(name) {
  const m = ROUND_RE.exec(name);
  if (!m) return null;
  const s = m[4] || '';
  return { name, y: +m[3], m: +m[1], d: +m[2], s, k: [+m[3], +m[1], +m[2], s.length, s] };
}
function cmp(a, b) { for (let i = 0; i < a.k.length; i++) { if (a.k[i] < b.k[i]) return -1; if (a.k[i] > b.k[i]) return 1; } return 0; }
function newestRecord(names) {
  return names.map(roundKey).filter(Boolean).sort(cmp).pop() || null;
}
function needsSection(r) {
  const f = FIRST_WITH_SECTION;
  return cmp(r, { k: [f.y, f.m, f.d, f.s.length, f.s] }) >= 0;
}
/* the ON HIS SCREEN section: null if absent, else { ids, prose } */
function onHisScreen(text) {
  const L = text.split('\n');
  const h = L.findIndex(l => /^#{2,3}\s+ON HIS SCREEN\b/i.test(l.trim()));
  if (h < 0) return null;
  const ids = [], prose = [];
  for (let i = h + 1; i < L.length && !/^#{1,3}\s/.test(L[i]); i++) {
    const l = L[i].trim().replace(/^[-*]\s+/, '').replace(/^`|`$/g, '');
    if (!l || /^\(.*\)$/.test(l)) continue;
    if (/^[a-z][a-z0-9]*(?:-[a-z0-9]+)+-\d{1,2}-\d{1,2}$/.test(l)) ids.push(l); else prose.push(l);
  }
  return { ids, prose };
}

/* what is wrong with one record against one screen: { sec, R1, R2: [prose], R3: [{id, why}] } */
function recordFaults(rec, text, scr, reg, tri) {
  const sec = onHisScreen(text);
  return { sec, R1: needsSection(rec) && !sec, R2: sec ? sec.prose : [],
    R3: sec ? sec.ids.filter(id => !scr || !scr.first.includes(id)).map(id => ({ id, why: scr ? whyNot(id, reg, tri, scr) : 'the tab did not run' })) : [] };
}

/* ---------------------------------------------------------------- THE BOARD */
function rows(text) {
  const L = text.split('\n'), out = [];
  let lane = null, isLane = false;
  for (let i = 0; i < L.length; i++) {
    const l = L[i];
    if (l.startsWith('## ')) {
      lane = l.slice(3).split('  (')[0].trim();
      let j = i + 1; isLane = false;
      for (; j < L.length && !L[j].startsWith('## '); j++) if (L[j].startsWith('MODE:')) { isLane = true; break; }
      if (/^SHARED\b/.test(lane)) isLane = true;
      continue;
    }
    if (isLane && l.startsWith('- ')) {
      const lab = /\[([^\]]+)\]/.exec(l);
      out.push({ lane, label: lab ? lab[1] : l.slice(2, 40), text: l, line: i + 1 });
    }
  }
  return out;
}
const NOT_A_CLAIM = /(\bNOT|\bNOTHING(?:\s+(?:WAS\s+)?REGISTERED)?|\bNEVER|\bNO|\bsays?|\bwrites?|\bwritten)\s*['"]?$/i;
function claims(t) {
  const out = [];
  const ids = [...t.matchAll(ID_RE)].map(m => ({ id: m[0], at: m.index }));
  for (const m of t.matchAll(/IN VOTE\b/g)) {
    if (NOT_A_CLAIM.test(t.slice(Math.max(0, m.index - 30), m.index))) continue;
    const after = ids.find(x => x.at > m.index), before = ids.filter(x => x.at < m.index).pop();
    out.push({ at: m.index, id: (after || before || {}).id || null });
  }
  return out;
}
function pulls(t) {
  const out = [];
  for (const m of t.matchAll(/\b(PULLED|RETRACTED|WITHDRAWN|WITHDREW)\b/gi)) {
    const clause = t.slice(m.index, m.index + 160).split(/[.;]\s/)[0];
    const id = (clause.match(ID_RE) || [])[0];
    if (id) out.push({ at: m.index, id, word: m[1] });
  }
  return out;
}
function boardFaults(text, items) {
  const have = new Set(items.map(x => x && x.id));
  const f = [];
  for (const r of rows(text)) {
    const key = r.lane + ' [' + r.label + ']';
    for (const c of claims(r.text)) {
      if (!c.id) f.push({ key, leg: 'B1', line: r.line, why: 'says IN VOTE and names no card id' });
      else if (!have.has(c.id)) f.push({ key, leg: 'B2', line: r.line, why: 'says IN VOTE and names ' + c.id + ', which is not in the registry' });
    }
    for (const p of pulls(r.text)) {
      if (have.has(p.id)) f.push({ key, leg: 'P1', line: r.line, why: 'says ' + p.word + ' ' + p.id + ', which is still in the registry' });
    }
  }
  const seen = new Set();
  return f.filter(x => { const k = x.key + '/' + x.leg + '/' + x.why; if (seen.has(k)) return false; seen.add(k); return true; });
}

/* ---------------------------------------------------------------- RUN */
(async () => {
  const boardPath = arg('--board') || 'VAMILY.md';
  const reg = JSON.parse(read(REG));
  let tri = null; try { tri = JSON.parse(read(TRI)); } catch (e) { tri = null; }

  /* T0 */
  let scr = null, t0why = '';
  try { scr = await screen(); } catch (e) { t0why = 'THE TAB\'S OWN SCRIPT DID NOT RUN HERE: ' + (e && e.message || e); }
  ok('T0 the VOTE tab\'s own script runs on the committed registry and triage and draws his first screen'
    + (scr ? ' (' + scr.first.length + ' on it, ' + scr.behind.length + ' behind MORE)' : ''),
    !!scr && !scr.failed, t0why || (scr && scr.failed ? 'the tab says THE LIST DID NOT LOAD' : ''));

  /* R1 R2 R3 */
  const recDir = path.join(ROOT, 'records');
  const recArg = arg('--record');
  const newest = recArg ? Object.assign(roundKey(path.basename(recArg)) || { name: path.basename(recArg), k: [99] }, { file: recArg })
    : (() => { const r = newestRecord(fs.readdirSync(recDir)); return r && Object.assign(r, { file: path.join('records', r.name) }); })();
  const recText = newest ? read(newest.file) : '';
  if (!newest) ok('R1 a coordinator round record exists', false, 'no records/BOHEMIA_COORDINATOR_ROUND_* file');
  else {
    const rf = recordFaults(newest, recText, scr, reg, tri);
    ok('R1 the newest round record (' + newest.name + ') carries ON HIS SCREEN', !rf.R1,
      'the coordinator writes a section headed ## ON HIS SCREEN, one card id per line (rule 118(a)); empty is allowed, absent is not');
    if (rf.sec) {
      ok('R2 every line under ON HIS SCREEN is a card id (' + rf.sec.ids.length + ' ids)', !rf.R2.length,
        'not a card id, so he cannot find it: ' + rf.R2.map(x => JSON.stringify(x.slice(0, 80))).join('; ')
        + ' -- write it under COMING, NOT IN A TAB YET');
      ok('R3 every id the coordinator names is on his first screen (' + (rf.sec.ids.length - rf.R3.length) + ' of ' + rf.sec.ids.length + ')',
        !!scr && !rf.R3.length, rf.R3.map(x => x.id + ': ' + x.why).join('\n         ')
        + (rf.R3.length ? '\n         (the coordinator\'s: name it as coming, NOT IN A TAB YET, or tag it red; rule 118(a))' : ''));
    }
  }

  /* B1 B2 P1 */
  const faults = boardFaults(read(boardPath), reg.items || []);
  const held = faults.filter(x => !(BASELINE[x.key] || []).includes(x.leg));
  const legs = { B1: 'every row that says IN VOTE names a card id', B2: 'the id a row says is IN VOTE is in the registry',
    P1: 'a row that says it pulled a card names an id that is out of the registry' };
  for (const leg of ['B1', 'B2', 'P1']) {
    const h = held.filter(x => x.leg === leg);
    ok(leg + ' ' + legs[leg] + (faults.some(x => x.leg === leg) ? ' (' + (faults.filter(x => x.leg === leg).length - h.length) + ' grandfathered)' : ''),
      !h.length, h.map(x => x.key + ' (line ' + x.line + '): ' + x.why).join('\n         ')
      + (!h.length ? '' : leg === 'P1' ? '\n         (the lane\'s: take the card out of the registry\'s items in the same push, or do not say it was pulled; rule 118(c))'
        : '\n         (the lane\'s: write the card id and register it in the same push, rule 118(b); or say it is coming)'));
  }
  for (const k of Object.keys(BASELINE)) for (const leg of BASELINE[k])
    if (!faults.some(x => x.key === k && x.leg === leg)) console.log('  note ' + k + ' / ' + leg + ' passes now: PLUMBER drops it from BASELINE');

  /* S1-S14: planted, on copies */
  const plantedReg = JSON.parse(JSON.stringify(reg));
  const P = 'plumber-the-planted-card-12-31', Q = 'plumber-the-other-planted-card-12-30';
  plantedReg.items.push({ id: P, kind: 'test', lane: 'plumber', made: '12/31', title: 'PLANTED', show: { how: 'text', src: 'x' } });
  plantedReg.items.push({ id: Q, kind: 'test', lane: 'plumber', made: '12/30', title: 'PLANTED', show: { how: 'text', src: 'x' } });
  const plantedTri = JSON.parse(JSON.stringify(tri || { tags: {}, cap: 12 }));
  const files = (r, t) => ({ [REG]: r, [TRI]: t });
  const on = async (r, t) => (await screen(files(r, t))).first.includes(P);
  try {
    ok('S1 a card registered newest and untagged is on his first screen', await on(plantedReg, plantedTri));
    const r2 = JSON.parse(JSON.stringify(plantedReg)); r2.items = r2.items.filter(x => x.id !== P);
    ok('S2 the same id never registered is caught: ' + whyNot(P, r2, plantedTri, await screen(files(r2, plantedTri))).split(':')[0],
      !(await on(r2, plantedTri)) && /^NOT IN THE REGISTRY/.test(whyNot(P, r2, plantedTri, await screen(files(r2, plantedTri)))));
    const r3 = JSON.parse(JSON.stringify(plantedReg)); r3.verdicts.push({ id: P, vote: 'up', said: '', when: '12/31' });
    ok('S3 the same card once he voted it is caught: ALREADY VOTED',
      !(await on(r3, plantedTri)) && /^ALREADY VOTED/.test(whyNot(P, r3, plantedTri, await screen(files(r3, plantedTri)))));
    const t4 = JSON.parse(JSON.stringify(plantedTri)); t4.tags[P] = { tag: 'yellow', why: 'planted' };
    const s4 = await screen(files(plantedReg, t4));
    ok('S4 tagged yellow is caught: BEHIND MORE', !s4.first.includes(P) && s4.behind.includes(P) && /YELLOW/.test(whyNot(P, plantedReg, t4, s4)));
    const t5 = JSON.parse(JSON.stringify(plantedTri)); t5.tags[P] = { tag: 'gray', why: 'planted' };
    ok('S5 tagged gray is caught: NEVER SHOWN', !(await on(plantedReg, t5)) && /^NEVER SHOWN/.test(whyNot(P, plantedReg, t5, await screen(files(plantedReg, t5)))));
    const t6 = JSON.parse(JSON.stringify(plantedTri)), r6 = JSON.parse(JSON.stringify(plantedReg));
    const cap = (t6 && t6.cap) || 12;
    for (let i = 0; i < cap; i++) { const id = 'plumber-a-newer-card-' + i + '-12-31'; r6.items.push({ id, kind: 'test', lane: 'plumber', made: '12/31', title: 'NEWER' }); t6.tags[id] = { tag: 'red', why: 'planted' }; }
    const s6 = await screen(files(r6, t6));
    ok('S6 pushed past the first screen\'s ' + cap + ' by red cards is caught: BEHIND MORE', !s6.first.includes(P) && s6.behind.includes(P) && /past the first screen/.test(whyNot(P, r6, t6, s6)));
    const t7 = JSON.parse(JSON.stringify(plantedTri)); t7.tags[Q] = { tag: 'red', why: 'planted' };
    const s7 = await screen(files(plantedReg, t7));
    ok('S7 a red card leads the screen over a newer untagged one (the tab\'s order, read from the tab)', s7.first[0] === Q && s7.first.includes(P));
    ok('S8 a tab whose registry will not load shows nothing on his screen, and T0 would say so', (await screen({ [REG]: null, [TRI]: plantedTri })).failed);

    const sec = onHisScreen('# X\n\n## ON HIS SCREEN\n(rule 118(a): a note)\n' + P + '\n- the district fight boards\n\n## COMING, NOT IN A TAB YET\n- the song\n');
    ok('S9 a plan written as prose under ON HIS SCREEN is caught, the id beside it read, the next section ignored',
      sec && sec.ids.join() === P && sec.prose.length === 1 && /district/.test(sec.prose[0]));
    ok('S10 a record with no ON HIS SCREEN section is caught; an empty one is allowed',
      onHisScreen('# X\n## What changed\n- ' + P + '\n') === null && onHisScreen('## ON HIS SCREEN\n(none)\n').ids.length === 0);
    const names = ['BOHEMIA_COORDINATOR_ROUND_10_18_26_AX.md', 'BOHEMIA_COORDINATOR_ROUND_10_18_26_B.md', 'BOHEMIA_COORDINATOR_ROUND_10_9_26_AZ.md',
      'BOHEMIA_COORDINATOR_ROUND_10_18_26_AW.md', 'BOHEMIA_COORDINATOR_ROUND_9_30_26.md'];
    ok('S11 the newest record is by date then sweep letters (10/18 AX over AW and B over 10/9 AZ; BA over AZ; 10/19 over 10/18 AX)',
      newestRecord(names).name.endsWith('10_18_26_AX.md') && newestRecord(names.concat('BOHEMIA_COORDINATOR_ROUND_10_18_26_BA.md')).s === 'BA'
      && newestRecord(names.concat('BOHEMIA_COORDINATOR_ROUND_10_19_26.md')).name.endsWith('10_19_26.md')
      && !needsSection(roundKey('BOHEMIA_COORDINATOR_ROUND_10_18_26_AW.md')) && needsSection(roundKey('BOHEMIA_COORDINATOR_ROUND_10_19_26.md')));

    const items = plantedReg.items;
    const board = (row) => '## PLUMBER  (18.)\nMODE: RUN\n' + row + '\n## HISTORY\n- IN VOTE but not a lane\n';
    const f = (row) => boardFaults(board(row), items).map(x => x.leg).join(',');
    ok('S12 IN VOTE with no id is B1; with an unregistered id B2; with the registered id green',
      f('- SHIPPED 12/31 [a]  my cards IN VOTE, all four') === 'B1'
      && f('- SHIPPED 12/31 [a]  IN VOTE as combat2-the-district-boards-12-31') === 'B2'
      && f('- SHIPPED 12/31 [a]  IN VOTE as ' + P) === '');
    ok('S13 NOT IN VOTE, NOTHING REGISTERED IN VOTE and a quote (says IN VOTE) are not claims; HISTORY is not a lane',
      f('- SHIPPED 12/31 [a]  TAB: NOT IN VOTE; NOTHING REGISTERED IN VOTE; a row that says IN VOTE names an id') === '');
    ok('S14 PULLED with a registered id is P1; with an id out of the registry green',
      f('- SHIPPED 12/31 [a]  the card PULLED from the registry (' + P + ')') === 'P1'
      && f('- SHIPPED 12/31 [a]  the card PULLED from the registry (combat2-the-district-boards-12-31)') === '');

    /* M1-M4: the REAL files, broken the way his 10/18 was, caught on copies */
    if (newest && scr) {
      const five = ['the district fight boards', 'the bare front screen', 'the tuning grid', 'the freeway as one road', 'the middle-ground song'];
      const asProse = recText.replace(/(^#{2,3}\s+ON HIS SCREEN[^\n]*\n)/m, '$1' + five.join('\n') + '\n');
      const m1 = recordFaults(newest, asProse, scr, reg, tri);
      ok('M1 the real newest record with his five missing things written under ON HIS SCREEN: R2 names all five (' + m1.R2.length + ')',
        five.every(x => m1.R2.includes(x)));
      const guess = ['combat2-the-district-boards-10-18', 'ui-the-bare-front-screen-10-18', 'tuning-the-whole-grid-10-18',
        'world-the-freeway-is-one-road-10-18', 'sounds-the-middle-ground-10-18'].filter(id => !(reg.items || []).some(x => x.id === id));
      const asIds = recText.replace(/(^#{2,3}\s+ON HIS SCREEN[^\n]*\n)/m, '$1' + guess.join('\n') + '\n');
      const m2 = recordFaults(newest, asIds, scr, reg, tri);
      ok('M2 the same five as ids no lane registered: R3 says NOT IN THE REGISTRY for each (' + guess.length + ')',
        guess.length > 0 && guess.every(id => m2.R3.some(x => x.id === id && /^NOT IN THE REGISTRY/.test(x.why))));
      const named = ((onHisScreen(recText) || {}).ids || []).filter(id => scr.first.includes(id));   /* the ones true now */
      if (named.length) {
        const rv = JSON.parse(JSON.stringify(reg));
        named.forEach(id => rv.verdicts.push({ id, vote: 'up', said: '', when: '12/31' }));
        const m3 = recordFaults(newest, recText, await screen(files(rv, tri)), rv, tri);
        ok('M3 the real record once he has voted the ' + named.length + ' card(s) it truly names: R3 says ALREADY VOTED for each',
          named.every(id => m3.R3.some(x => x.id === id && /^ALREADY VOTED/.test(x.why))));
      } else ok('M3 the real record names no card on his screen this sweep (nothing to vote; R3 is vacuous)', true);
      const noSec = recText.replace(/^#{2,3}\s+ON HIS SCREEN[^\n]*\n/m, '## WHAT HE CAN SEE\n');
      ok('M4 the real record with its ON HIS SCREEN heading gone: R1 red', recordFaults(Object.assign({}, newest, roundKey('BOHEMIA_COORDINATOR_ROUND_10_18_26_AX.md') || {}), noSec, scr, reg, tri).R1);
    }
    const realBoard = read(boardPath);
    const lines = realBoard.split('\n'), at = lines.findIndex(l => /^## COMBAT TWO\b/.test(l));
    if (at >= 0) {
      const mut = lines.slice(); mut.splice(at + 2, 0, '- SHIPPED 10/18 combat2 (1e24171e)  [the district boards]  sprites for all four of my cards IN VOTE');
      const mf = boardFaults(mut.join('\n'), reg.items || []).filter(x => x.leg === 'B1' && /^COMBAT TWO \[the district boards\]/.test(x.key));
      ok('M5 the real board with COMBAT TWO\'s 10/18 promise put back (IN VOTE, no id): B1 names COMBAT TWO [the district boards]', mf.length === 1);
    } else ok('M5 the real board has a COMBAT TWO section to plant in', false, 'no ## COMBAT TWO heading');
  } catch (e) {
    ok('S the planted cases ran', false, String(e && e.stack || e));
  }

  console.log('\nTHE CARD I NAME IS ON HIS SCREEN: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
