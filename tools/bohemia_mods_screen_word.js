#!/usr/bin/env node
/* MODS [the screen's word] -- EVERY WORD YOU SEE FINDS ITS LINE (reads only; RESEARCH ONLY, rule 38g).

     node tools/bohemia_mods_screen_word.js [--json] [--walk-only] [--from FILE] [--prove]

   The row (from [a modder's first hour], 10/18: 'easy is the word on the screen finding its line, not the file
   type'): for every NAME a player reads in the demo's first ten minutes (weapons, armour, buildings, people, places,
   perks, the keepers' titles), does a whole-word search of the repo find the line that sets it, and how many hops does
   it take when it does not. Nothing in the game calls this and nothing in the repo changes: the walk runs on a copy
   served from disk, and --prove serves an edited copy of each source file under its real URL (the way the first-hour
   instrument did) and throws it away.

   THREE PARTS.
   (1) THE WALK, on the phone profile, through the one driver (tools/bohemia_drive_the_demo.js, rule 14g), with a hook
       armed in EVERY frame before any page script (the driver's opts.arm): every string the game drew with fillText or
       strokeText, and every text node that was on the glass (inside the viewport, no hidden ancestor), each with the
       frame it was in, the element or the canvas, and the clock. The route is what a stranger meets in ten minutes:
         DOOR   NEW GAME (a real touch), the crew picker swiped card by card, ANOTHER pressed through the ten names,
                BEGIN (the driver's knock)
         MAP    the street view and its phone for 45 s, then pinched out to the map (the driver's toMap) for 20 s
         TOWN   the nearest town opened by the map's own door (loopOpenTown, what arriving calls), every building held
                with a real finger (its name tag) and tapped (its keeper and its wares), then CREW (a real tap) and DONE
         FIGHT  the first road fight opened by the shell's own door (cityEncounterIn, what a road party calls) with the
                party the map sizes (partyMath 'roaming'); every man's name tapped (drawer) and held (weaponCard), the
                fight's own two functions
       Where a door is called rather than tapped, it is said, because the words are what this measures, not the route.
   (2) THE NAMES. Every harvested string cut at the game's separators (' · ', '|', ',') and kept when it reads as a name:
       one to six words, no sentence (no full stop, question or exclamation inside), at least two letters, not a number,
       a clock or a price. Each is tagged with the KIND the screen gives it (the element or the canvas call it came from).
   (3) THE SEARCH a stranger runs: git grep, fixed string, WHOLE WORD, case-insensitive (an editor's default), over
       the tracked files. Each hit is sorted: GAME DATA (a .json the game fetches), GAME CODE (slices/ and engine/ .js and
       .html the game loads), THE DEMO'S COPY (slices/BOHEMIA_DEMO.html, a cut of the alpha: an edit there is undone by
       the next cut), A DATED PAGE (slices/*_M_D_26.html, a judge page), and NOT THE GAME (records, laws, tools, banks).
       FOUND means the exact text (case included, as the screen shows it, or the same letters in the file's own case)
       sits on a line of a file the walk actually loaded. NOT FOUND names are traced by hand, per mechanism, and the hops
       counted: each hop is one more file a stranger must open, following a name the last one showed him.
   --prove: for every FOUND name with exactly one candidate line, that line's text is edited in a served copy (the name
       gets a tag, e.g. THE BAR -> THE BAR~Q12) and the walk runs again: a tag on the glass PROVES that line sets it. A
       tag that does not show proves nothing either way (the game may key on the name), and is reported as unproven. */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');
const WALK_ONLY = args.includes('--walk-only');
const PROVE = args.includes('--prove');
const FROM = (() => { const i = args.indexOf('--from'); return i >= 0 ? args[i + 1] : null; })();
let OUT_DIR_ = null;
const outDir = () => OUT_DIR_ || (OUT_DIR_ = (() => { const i = args.indexOf('--out'); return i >= 0 ? args[i + 1] : fs.mkdtempSync(path.join(os.tmpdir(), 'mods-word-')); })());

/* ---------------------------------------------------------------- the hook, armed in every frame */
const ARM = `(function(){
  if (window.__SW) return;
  /* THE DICE ARE SEEDED (10/19): the fight's enemies and their weapons are rolled with Math.random, so a second walk met
     other men (measured: pass A lost DAGGER, FLAIL and the rest of walk one's enemies). One fixed stream per page, so every
     walk meets the same people and a missing tag means the line did not set the word, not that the word was not there. */
  (function(){ var h = 2166136261, p = String(location.pathname); for (var i = 0; i < p.length; i++) { h ^= p.charCodeAt(i); h = Math.imul(h, 16777619); }
    var st = h >>> 0; Math.random = function(){ st = (st + 0x6D2B79F5) | 0; var t = Math.imul(st ^ (st >>> 15), 1 | st); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; })();
  var seen = {}; window.__SW = { canvas: [], dom: [] };
  var where = function(){ try { return location.pathname.split('/').pop() || '?'; } catch(e){ return '?'; } };
  ['fillText','strokeText'].forEach(function(m){
    var f = CanvasRenderingContext2D.prototype[m];
    CanvasRenderingContext2D.prototype[m] = function(t, x, y){
      try { var s = String(t); if (s.trim()) {
        var cv = this.canvas, on = false;
        try { var tr = this.getTransform(), px = tr.a * x + tr.c * y + tr.e, py = tr.b * x + tr.d * y + tr.f;
              on = !!cv && px > -40 && py > -10 && px < cv.width + 4 && py < cv.height + 30; } catch(e){}
        var k = 'c|' + s + '|' + (cv && cv.isConnected ? 1 : 0);
        if (!seen[k]) { seen[k] = 1;
          var st = (new Error().stack || '').split('\\n').slice(2, 5).map(function(l){ return l.trim().replace(/^at /,'').replace(/https?:\\/\\/[^/]+\\//g,''); }).join(' < ');
          window.__SW.canvas.push({ t: s, at: Date.now(), f: where(), conn: !!(cv && cv.isConnected), cw: cv ? cv.width : 0, on: on, font: this.font, st: st }); } } } catch(e){}
      return f.apply(this, arguments);
    };
  });
  function scan(){
    try {
      if (!document.body) return;
      var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), n;
      while ((n = w.nextNode())) {
        var s = (n.nodeValue || '').replace(/\\s+/g, ' ').trim(); if (!s) continue;
        var el = n.parentElement; if (!el || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') continue;
        var r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
        if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
        var a = el, hid = false;
        while (a && a !== document.documentElement) { var cs = getComputedStyle(a); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) { hid = true; break; } a = a.parentElement; }
        if (hid) continue;
        var k = 'd|' + s; if (seen[k]) continue; seen[k] = 1;
        var p = []; a = el; for (var i = 0; i < 4 && a && a !== document.body; i++) { p.push(a.tagName.toLowerCase() + (a.id ? '#' + a.id : '') + (typeof a.className === 'string' && a.className.trim() ? '.' + a.className.trim().split(/\\s+/)[0] : '')); a = a.parentElement; }
        window.__SW.dom.push({ t: s, at: Date.now(), f: where(), p: p.join('<') });
      }
    } catch(e){}
  }
  setInterval(scan, 300);
  window.__SW.scan = scan;
})();`;

/* ---------------------------------------------------------------- the walk */
const STAGES = [];
const stage = (name, how) => { STAGES.push({ name, how, at: Date.now() }); console.error('  [walk] ' + name + ' -- ' + how); };
/* every harvest is KEPT as it is taken: a screen that closes (the crew screen's frame is removed on DONE) takes its
   words with it, so the final read alone would miss them (measured: the first walk lost the whole crew screen) */
const KEPT = new Map();
async function harvest(page) {
  for (const f of page.frames()) {
    const r = await f.evaluate(() => { try { window.__SW && window.__SW.scan(); } catch (e) {} return window.__SW ? { c: window.__SW.canvas, d: window.__SW.dom } : null; }).catch(() => null);
    if (!r) continue;
    r.c.forEach(x => { const k = x.f + '|c|' + x.t + '|' + x.conn; if (!KEPT.has(k)) KEPT.set(k, Object.assign({ via: 'canvas' }, x)); });
    r.d.forEach(x => { const k = x.f + '|d|' + x.t; if (!KEPT.has(k)) KEPT.set(k, Object.assign({ via: 'dom' }, x)); });
  }
  return Array.from(KEPT.values());
}
/* a frame's box on the top page: nested frames add up */
async function frameOffset(frame) {
  let x = 0, y = 0, f = frame;
  while (f.parentFrame()) {
    const el = await f.frameElement();
    const b = await el.boundingBox();
    if (!b) return null;
    x = b.x; y = b.y;          /* boundingBox is already relative to the main frame's viewport */
    break;
  }
  return { x, y };
}
async function hold(page, x, y, ms) { await page.mouse.move(x, y); await page.mouse.down(); await page.waitForTimeout(ms); await page.mouse.up(); }

async function walk(serve) {
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const T = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  const notes = [];
  STAGES.length = 0; KEPT.clear();
  const t0 = Date.now();
  let d;
  try {
    d = await D.open({ arm: ARM, serve: serve || {}, door: 120000,
      beforeTap: async (page) => {
        stage('DOOR', 'NEW GAME with a real touch');
        await T.throughTheTitle(page, 240000);
        await page.waitForTimeout(1200);
        stage('DOOR', 'the crew picker swiped card by card (scrollLeft, what a swipe does), ANOTHER pressed through the names');
        const n = await page.evaluate(() => { const s = document.getElementById('newcostrip'); return s ? s.querySelectorAll('.org').length : 0; });
        for (let i = 0; i < n; i++) {
          await page.evaluate((i) => { const s = document.getElementById('newcostrip'); const c = s && s.querySelectorAll('.org')[i]; if (c) s.scrollLeft = Math.max(0, c.offsetLeft - 10); }, i);
          await page.waitForTimeout(700);
        }
        await page.evaluate(() => { const s = document.getElementById('newcostrip'); if (s) s.scrollLeft = 0; });
        for (let i = 0; i < 10; i++) {
          const b = await page.evaluate(() => { const e = document.querySelector('#newco [data-k=name]'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
          if (!b) break;
          await page.touchscreen.tap(b.x, b.y); await page.waitForTimeout(500);
        }
        /* and back to the default name a stranger who never pressed it would keep: ten presses go round once */
        notes.push('door: ' + n + ' origin cards swiped; ANOTHER pressed 10 times (all ten names, back to the first)');
      } });
    const page = d.page;
    stage('MAP', 'the first view and its phone, 45 s on the game clock as it runs');
    await page.waitForTimeout(45000);
    await harvest(page);
    stage('MAP', 'pinched out to the map (driver toMap), 20 s');
    try { await d.toMap(); } catch (e) { notes.push('map: ' + String(e).slice(0, 160)); }
    await page.waitForTimeout(20000);
    await harvest(page);
    const city = page.frames().find(f => /BOHEMIA_CITY_WORLD/.test(f.url()));
    /* THE TOWN: the nearest town to where he stands, opened by the map's own arrival door */
    stage('TOWN', 'the nearest town, opened by the map\'s own door (loopOpenTown, what arriving calls)');
    const town = await city.evaluate(() => {
      const bs = (typeof ctBases === 'function' && ctBases()) || {}; const px = city.x, py = city.y;   /* the party's block, what loopTownAt reads on arrival */
      let best = null, bd = 1e9;
      for (const n in bs) { const b = bs[n]; const dd = Math.max(Math.abs(b.x - px), Math.abs(b.y - py)); if (dd < bd) { bd = dd; best = { name: n, x: b.x | 0, y: b.y | 0, tier: mapTierOf(n) }; } }
      if (best) loopOpenTown(best);
      return best ? Object.assign(best, { blocksAway: bd, from: [px, py] }) : null;
    }).catch(e => ({ err: String(e).slice(0, 200) }));
    notes.push('town: ' + JSON.stringify(town));
    let set = null;
    for (let i = 0; i < 120 && !set; i++) {
      await page.waitForTimeout(500);
      set = page.frames().find(f => /BOHEMIA_SETTLEMENT_SCREEN/.test(f.url()));
      if (set) { const ok = await set.evaluate(() => !!(window.BohemiaSettlement && BohemiaSettlement.order && BohemiaSettlement.where && BohemiaSettlement.order().length)).catch(() => false); if (!ok) set = null; }
    }
    if (set) {
      await page.waitForTimeout(6000);   /* the arrival plays */
      const off = await frameOffset(set);
      const order = await set.evaluate(() => BohemiaSettlement.order());
      notes.push('town buildings: ' + order.join(', '));
      for (const k of order) {
        const p = await set.evaluate((k) => { const w = BohemiaSettlement.where(k); return w ? { x: w.x !== undefined ? w.x : w[0], y: w.y !== undefined ? w.y : w[1] } : null; }, k);
        if (!p || !off) continue;
        await hold(page, off.x + p.x, off.y + p.y, 1000);          /* the name tag while the finger is down */
        await page.waitForTimeout(400);
        await page.touchscreen.tap(off.x + p.x, off.y + p.y);      /* the building: its keeper and its wares */
        await page.waitForTimeout(2200);
        await harvest(page);
        await set.evaluate(() => { const c = document.getElementById('close'); if (c && c.offsetParent) c.click(); });
        await page.waitForTimeout(600);
      }
      stage('TOWN', 'CREW with a real tap, then DONE');
      const cb = await set.evaluate(() => { const e = document.getElementById('crew'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; });
      if (cb && off) {
        await page.touchscreen.tap(off.x + cb.x, off.y + cb.y); await page.waitForTimeout(5000);
        const ros = page.frames().find(f => /BOHEMIA_ROSTER_SCREEN/.test(f.url()));
        if (ros) {
          /* every man's card: the roster's own list, a real tap on each name */
          const roff = await frameOffset(ros);
          /* every man: his row scrolled into view (what a thumb does) and tapped for his card; the bag scrolled through */
          const n = await ros.evaluate(() => document.querySelectorAll('.wrow[data-man]').length);
          for (let i = 0; i < n; i++) {
            const m = await ros.evaluate((i) => { const e = document.querySelectorAll('.wrow[data-man]')[i]; if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return { x: r.x + Math.min(40, r.width / 2), y: r.y + r.height / 2 }; }, i);
            if (m) { await page.waitForTimeout(250); await page.touchscreen.tap(roff.x + m.x, roff.y + m.y); await page.waitForTimeout(800); await harvest(page); }
          }
          await ros.evaluate(() => { const b = document.getElementById('bagh'); if (b) b.scrollIntoView({ block: 'start' }); }); await page.waitForTimeout(600);
          notes.push('crew screen: ' + n + ' men, each row tapped');
          await harvest(page);
          await ros.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(x => /^\s*DONE\s*$/i.test(x.textContent)); if (b) b.click(); });
          await page.waitForTimeout(800);
        } else notes.push('crew screen: did not open');
      }
      await set.evaluate(() => { const l = document.getElementById('leave'); if (l) l.click(); });
      await page.waitForTimeout(1500);
      await city.evaluate(() => { try { loopClose(); } catch (e) {} });
    } else notes.push('town: the settlement screen did not come up');
    /* THE FIGHT: the first road party, through the shell's own door */
    stage('FIGHT', 'the first road fight, through the shell\'s door (cityEncounterIn) with the party the map sizes');
    const ctx = await city.evaluate(() => { const px = city.x, py = city.y; let dist = null; try { const c = om.at(px, py); dist = c && c.district; } catch (e) {}
      let party = null; try { party = partyMath('roaming', { x: px, y: py }); } catch (e) {} return { district: dist, party, at: [px, py] }; });
    notes.push('fight: ' + JSON.stringify(ctx));
    await page.evaluate((c) => cityEncounterIn({ district: c.district, party: c.party, world: { night: false }, at: c.at }), ctx);
    let fight = null;
    for (let i = 0; i < 160 && !fight; i++) {
      await page.waitForTimeout(500);
      fight = page.frames().find(f => /BOHEMIA_FIGHT\.html/.test(f.url()));
      if (fight) { const ok = await fight.evaluate(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && window.FIGHT_UI && FIGHT_UI.t0 > 0).catch(() => false); if (!ok) fight = null; }
    }
    if (fight) {
      await page.waitForTimeout(3000);
      const n = await fight.evaluate(() => FIGHT.S.units.length);
      for (let i = 0; i < n; i++) {
        await fight.evaluate((i) => { const v = FIGHT.S.units[i]; if (v) drawer(v); }, i); await page.waitForTimeout(450); await harvest(page);
        await fight.evaluate((i) => { const v = FIGHT.S.units[i]; if (v && v.weapon) weaponCard(v); }, i); await page.waitForTimeout(450); await harvest(page);
      }
      notes.push('fight: ' + n + ' men, each tapped (drawer) and held (weaponCard)');
      await fight.evaluate(() => { const d = document.getElementById('drawer'); if (d) d.style.display = 'none'; });
      await page.waitForTimeout(8000);   /* the board as it plays */
    } else notes.push('fight: the board did not come up');
    stage('END', 'harvested');
    const items = await harvest(page);
    const loaded = Array.from(new Set(d.loads.map(l => l.url.replace(/^\//, ''))));
    return { t0, ms: Date.now() - t0, stages: STAGES.slice(), notes, items, loaded, errs: d.errs.slice(0, 12), title: d.title };
  } finally { if (d) await d.close(); }
}

/* ---------------------------------------------------------------- the names */
const NOT_A_NAME = /^[\d\s.,:;%+\-–—x×/()#~$·]*$|^\d{1,2}:\d{2}$|^\d+\s*(BATT|BATTERIES|AP|HP|DAYS?|BLOCKS?|KM|M|S|MS|PX|%)\b/i;
function cut(s) {
  s = String(s);
  /* the map spaces its capitals out (B L A C K   M O U N T A I N S): a stranger reads, and searches, BLACK MOUNTAINS */
  if (/^(?:[A-Z0-9'.] ){2,}[A-Z0-9'.](?:   (?:[A-Z0-9'.] )*[A-Z0-9'.])*$/.test(s)) s = s.split('   ').map(w => w.replace(/ /g, '')).join(' ');
  /* the weapon card's small print: 'Battle Brothers: Bludgeon, a mace' names a row and a class */
  const bb = /^Battle Brothers: (.+?)(?:, an? ([a-z ]+))?$/.exec(s);
  if (bb) return [bb[1]].concat(bb[2] ? [bb[2]] : []);
  /* the armourer's line: 'holds 90 weight 10 (was Patched Mail Shirt)' names the row it was */
  const was = /\(was ([^)]+)\)/.exec(s);
  if (was) return [was[1]];
  /* a keeper or a job giver: 'WADE KESSLER, AT THE HALL', 'ABUELA TONA, WHO RUNS THE COUNT': a name and a title, two words
     a stranger searches apart (the whole is put together in code, so it is in no file) */
  const nt = /^([A-Z][A-Z'.\- ]+), ((?:AT|BEHIND|THE|WHO|IN|FROM|OF)\b[A-Z'.\- ]+)$/.exec(s);
  if (nt) return [nt[1], nt[2]];
  return s.split(/\s+·\s+|\s*\|\s*|\s*•\s*/).map(x => x.trim()).filter(Boolean).filter(x => !/^LEVEL \d+$/.test(x));
}
/* A piece with a digit in it is a READOUT (HP 67, START 6 BATTERIES, 15 to 35, holds 24 weight 10): the number comes from a
   row and the words around it from a template, so it is not a name a stranger searches; counted apart, never as a name */
const READOUT = /[0-9]/;
function looksLikeName(s) {
  if (s.length < 2 || s.length > 48) return false;
  if (READOUT.test(s)) return false;
  if (NOT_A_NAME.test(s)) return false;
  if (!/[A-Za-zÀ-ÿ]{2}/.test(s)) return false;
  const w = s.split(/\s+/);
  if (w.length > 6) return false;
  if (/[.!?]\s|[.!?]$/.test(s) && !/^[A-Z][a-z]?\.$/.test(s) && !/\b(DR|ST|MR|MRS|JR)\.$/i.test(s)) return false;  /* a sentence */
  return true;
}
function stageOf(at, stages) { let s = stages[0] ? stages[0].name : '?'; for (const x of stages) if (at >= x.at) s = x.name; return s; }

/* ---------------------------------------------------------------- the search */
const gitFiles = (() => { let c = null; return () => c || (c = execFileSync('git', ['-C', ROOT, 'ls-files'], { encoding: 'utf8', maxBuffer: 1 << 27 }).split('\n').filter(Boolean)); })();
function where(file) {
  if (/^slices\/BOHEMIA_DEMO\.html$/.test(file)) return 'DEMO COPY';
  if (/^slices\/.*_\d+_\d+_26\.html$/.test(file)) return 'DATED PAGE';
  if (/^(slices|engine|records\/target)\/.*\.json$/.test(file)) return 'GAME DATA';
  if (/^(slices|engine)\/.*\.(js|html)$/.test(file)) return 'GAME CODE';
  return 'NOT THE GAME';
}
/* a stranger's search: fixed string, whole word, case-insensitive (an editor's default), over the tracked files.
   TWO READS. (1) THE LINES, in the folders the game is made of (slices/, engine/, records/target/): ONE git grep for
   every name at once (-f), each output line handed to the names it matches by git grep -w's own rule (a word character
   is a letter, a digit or an underscore, on neither side), case folded. (2) THE NOISE, over the whole repo: a count of
   matching lines per name (git grep -c, eight at a time), which is what a stranger's search box shows him. */
const GREP = new Map(), TOTAL = new Map();
const GAME_DIRS = ['slices', 'engine', 'records/target'];
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wordRe = w => new RegExp('(?<![\\p{L}\\p{N}_])' + esc(w) + '(?![\\p{L}\\p{N}_])', 'iu');
/* MEASURED 10/19: ONE git grep -f over the three game folders printed every matching line WHOLE, and the cut alpha and
   the demo carry lines megabytes long (inlined data and pictures), so 294 names never finished (killed after ten
   minutes, no output). ripgrep, one name at a time with -o (the matched words only, never the line), does one name in
   about 0.1 s; the context a candidate shows is then read from the file itself, 120 characters each side. ripgrep reads
   .gitignore, so the search covers what a clone has, which is what a stranger searches. */
const RG = (args) => new Promise(res => require('child_process').execFile('rg', args, { cwd: ROOT, maxBuffer: 1 << 28 }, (err, so) => res(String(so || ''))));
const LINES = new Map();
function lineOf(file, n) {
  if (!LINES.has(file)) { try { LINES.set(file, fs.readFileSync(path.join(ROOT, file), 'utf8').split('\n')); } catch (e) { LINES.set(file, []); } }
  return LINES.get(file)[n - 1] || '';
}
async function pool(todo, fn, width) { let i = 0; const lane = async () => { while (i < todo.length) await fn(todo[i++]); }; await Promise.all(Array.from({ length: width }, lane)); }
async function grepAll(words) {
  const todo = words.filter(w => !GREP.has(w));
  await pool(todo, async (w) => {
    const out = await RG(['-o', '-n', '-F', '-w', '-i', '--no-heading', '--with-filename', '-e', w, '--'].concat(GAME_DIRS));
    const by = new Map();
    for (const l of out.split('\n')) {
      const m = /^(.+?):(\d+):(.*)$/.exec(l); if (!m) continue;
      const k = m[1] + ':' + m[2];
      if (!by.has(k)) by.set(k, { file: m[1], line: +m[2], exact: false });
      if (m[3] === w) by.get(k).exact = true;
    }
    const hits = Array.from(by.values());
    hits.forEach(h => { if (where(h.file) === 'NOT THE GAME') return;
      const L = lineOf(h.file, h.line); const at = Math.max(0, L.search(wordRe(w)));
      h.text = L.length > 400 ? L.slice(Math.max(0, at - 120), at + w.length + 120) : L; });
    GREP.set(w, hits);
  }, 8);
}
async function totalsAll(words) {
  const todo = words.filter(w => !TOTAL.has(w));
  await pool(todo, async (w) => {
    const so = await RG(['-c', '-F', '-w', '-i', '--with-filename', '-e', w, '--', '.']);   /* a path, or ripgrep reads its stdin */
    const files = so.split('\n').filter(Boolean).map(l => { const k = l.lastIndexOf(':'); return { file: l.slice(0, k).replace(/^\.\//, ''), n: +l.slice(k + 1) }; });
    TOTAL.set(w, { lines: files.reduce((a, b) => a + b.n, 0), files: files.length, notGameLines: files.filter(f => where(f.file) === 'NOT THE GAME').reduce((a, b) => a + b.n, 0) });
  }, 8);
}
function grep(word) { return GREP.get(word) || []; }
/* ---------------------------------------------------------------- the reading of the search */
function lettersOf(s) { return String(s).toLowerCase(); }
function judge(name, loaded) {
  const hits = grep(name), tot = TOTAL.get(name) || null;
  const L = new Set(loaded);
  const by = {}; hits.forEach(h => { const w = where(h.file); by[w] = (by[w] || 0) + 1; });
  const game = hits.filter(h => where(h.file) !== 'NOT THE GAME');
  const inLoaded = game.filter(h => L.has(h.file));
  const exact = inLoaded.filter(h => h.exact);
  const files = Array.from(new Set(game.map(h => h.file)));
  const loadedFiles = Array.from(new Set(inLoaded.map(h => h.file)));
  const copies = game.filter(h => !L.has(h.file));
  return {
    found: inLoaded.length > 0,
    exactCase: exact.length > 0,
    lines: { all: tot ? tot.lines : null, notTheGame: tot ? tot.notGameLines : null, game: game.length, loaded: inLoaded.length, copiesNotLoaded: copies.length },
    files: { game: files.length, loaded: loadedFiles },
    by,
    candidates: inLoaded.slice(0, 12).map(h => ({ file: h.file, line: h.line, exact: h.exact, text: h.text.trim().slice(0, 240) })),
    firstCopies: copies.slice(0, 4).map(h => ({ file: h.file, line: h.line }))
  };
}

/* ---------------------------------------------------------------- one name per row, with the screen that showed it */
async function analyse(W) {
  const names = new Map();
  for (const it of W.items) {
    if (it.via === 'canvas' && !it.on) continue;                         /* drawn outside its canvas: not on the glass */
    if (it.via === 'canvas' && !it.conn && it.cw < 48) continue;         /* a tiny scratch canvas: an icon's letter, a cache */
    const st = stageOf(it.at, W.stages);
    for (const piece of cut(it.t)) {
      const nm = piece.replace(/^[\s"'“(\[]+|[\s"'”)\],:;]+$/g, '');
      if (!looksLikeName(nm)) continue;
      const k = nm;
      if (!names.has(k)) names.set(k, { name: nm, stage: st, frame: it.f, via: it.via, ctx: it.via === 'dom' ? it.p : (it.font || '') + ' ' + (it.st || ''), whole: it.t.slice(0, 120), seen: 0 });
      names.get(k).seen++;
    }
  }
  const readouts = new Map();
  for (const it of W.items) {
    if (it.via === 'canvas' && (!it.on || (!it.conn && it.cw < 48))) continue;
    for (const piece of cut(it.t)) { const nm = piece.trim(); if (nm.length >= 2 && nm.length <= 48 && READOUT.test(nm) && /[A-Za-z]{2}/.test(nm)) readouts.set(nm, it.f); }
  }
  const rows = [];
  await grepAll(Array.from(names.keys()));
  await totalsAll(Array.from(names.keys()));
  for (const r of names.values()) { r.kind = kindOf(r); r.search = judge(r.name, W.loaded); rows.push(r); }
  /* A MISSED NAME, IN PIECES: the words a stranger tries next, one at a time, and where each one lives */
  const words = new Set();
  rows.filter(r => !r.search.found).forEach(r => r.name.split(/\s+/).forEach(w => { w = w.replace(/^[^\p{L}\p{N}@]+|[^\p{L}\p{N}]+$/gu, ''); if (w.length >= 2) words.add(w); }));
  await grepAll(Array.from(words)); await totalsAll(Array.from(words));
  rows.filter(r => !r.search.found).forEach(r => {
    r.pieces = r.name.split(/\s+/).map(w => w.replace(/^[^\p{L}\p{N}@]+|[^\p{L}\p{N}]+$/gu, '')).filter(w => w.length >= 2).map(w => {
      const j = judge(w, W.loaded); return { word: w, found: j.found, loadedLines: j.lines.loaded, files: j.files.loaded.slice(0, 6) }; });
  });
  return { walk: { ms: W.ms, stages: W.stages.map(s => ({ name: s.name, atMs: s.at - W.t0, how: s.how })), notes: W.notes, items: W.items.length, loaded: W.loaded, errs: W.errs },
    readouts: Array.from(readouts, ([t, f]) => ({ t, f })), rows };
}
/* THE KIND, read off the screen that showed the word: its frame, its element path (the page) or the function that drew it
   (the canvas). The row's seven are weapon, armour, building, person, place, perk and keeper; the rest are named too. */
const STAT_LABELS = /^(Health|Armour, head|Armour, body|Fatigue|Nerve|Melee skill \/ defence|Ranged skill \/ defence|Initiative|Resolve|Damage|Against armour|Straight through armour|Reach|Hands|Throws left|Loaded|Hurt|Melee \/ ranged defence|HP|FAT|RES|INI|MSK|RSK|MDF|RDF)$/;
function kindOf(r) {
  const f = r.frame, c = String(r.ctx || ''), n = r.name, w = r.whole || '';
  if (/^@/.test(n)) return 'handle';
  if (/DEMO/.test(f)) {
    if (/button\.org/.test(c) && /^b</.test(c)) return 'origin';
    if (/newconame/.test(c)) return 'company name';
    if (/^em\.d\d/.test(c) || /div\.row<div#newco/.test(c)) return 'setting';
    return 'ui';
  }
  if (/CITY_WORLD/.test(f)) {
    if (/mapPlatesDraw|vbLabels|Label|Plate/.test(c)) return /^\d+$/.test(n) ? 'road' : 'place';
    if (/barread/.test(c)) return 'district';
    if (/div\.afn/.test(c)) return 'person';
    if (/div\.txt<div\.fp<div#bmboard/.test(c)) return 'contract';
    return 'ui';
  }
  if (/SETTLEMENT/.test(f)) {
    if (/arrivalTag/.test(c) || /span#pname/.test(c)) return /FORTRESS|TOWN|CAMP|MARKET|DAY/.test(n) && !/#pname/.test(c) ? 'place trait' : 'place';
    if (/Object\.sett|settle|drawTag|tag/i.test(c) && r.via === 'canvas') return /^[A-Z][A-Z ,'.]+$/.test(n) ? 'building' : 'building line';
    if (/div\.nm<div\.say/.test(c)) return /, /.test(w) && w.indexOf(n) === 0 ? 'person' : 'keeper title';
    if (/div\.nm<div\.hiret/.test(c)) return /^[A-Z][a-z]/.test(n) ? 'person' : 'background';
    if (/i\.cn<div\.cl/.test(c)) return /, /.test(w) && w.indexOf(n) !== 0 ? 'giver title' : 'person';
    if (/span<div\.cl/.test(c)) return 'contract';
    if (/button\.slot/.test(c)) return /vest|carrier|armour|helm|helmet|hat|hood|shield|door|jacket/.test(n) ? 'armour' : 'weapon';
    if (/div\.slots/.test(c) && /\(was /.test(w)) return /holds/.test(w) ? 'armour' : 'weapon';
    if (/span\.bandw/.test(c)) return 'standing';
    if (/span<button\.act/.test(c)) return /^(Hire|Buy it|Not this one|Sit in the chair|Search the lot|Buy the crew a round|Sell it|Take it)$/.test(n) ? 'ui' : 'ware';
    return 'ui';
  }
  if (/ROSTER/.test(f)) {
    if (/div\.cell<div#(front|back)\.line/.test(c)) return 'person';
    if (/wname|\.nm|\.sub/.test(c)) return /^[A-Z][a-z]/.test(n) || /^[A-Z]+$/.test(n) && /wname|\.nm/.test(c) ? 'person' : 'background';
    if (/wslot|gslot|slot/.test(c)) return /vest|carrier|armour|helm|helmet|hat|hood|shield|door|jacket|coat|cap/.test(n) ? 'armour' : 'weapon';
    if (/\.p\b|perk/.test(c)) return 'perk';
    return 'ui';
  }
  if (/FIGHT/.test(f)) {
    if (/div#cnm/.test(c)) return 'person';
    if (/div\.wb/.test(c)) return /^[a-z ]+$/.test(n) ? 'weapon class' : 'weapon row';
    if (/div\.wt/.test(c)) { const parts = w.split(' · '); return parts[0] === n ? 'weapon' : 'person'; }
    if (/div<div#drawer/.test(c)) { const parts = w.split(' · '); return parts[0] === n ? 'person' : parts[parts.length - 1] === n ? 'weapon' : 'ui'; }
    if (/span<div\.p|div\.p/.test(c)) return 'perk';
    if (/span<div\.r<div#drawer/.test(c)) return STAT_LABELS.test(n) || /^(Steady|Wavering|Breaking|Fleeing|Confident|one|two|yes|no)$/.test(n) ? 'ui' : 'skill';
    return 'ui';
  }
  return 'ui';
}
function report(R) {
  const rows = R.rows;
  const f = rows.filter(r => r.search.found).length;
  console.log('MODS [the screen\'s word] -- ' + rows.length + ' names on the glass in ' + Math.round(R.walk.ms / 1000) + ' s; a whole-word search finds a line in a loaded game file for ' + f + ', not for ' + (rows.length - f));
  for (const r of rows) console.log((r.search.found ? 'FOUND ' : 'MISS  ') + r.stage.padEnd(6) + ' ' + r.kind.padEnd(10) + ' ' + JSON.stringify(r.name) + '  game lines ' + r.search.lines.game + ', loaded ' + r.search.lines.loaded + ', copies ' + r.search.lines.copiesNotLoaded + '  [' + r.frame + ' ' + String(r.ctx).slice(0, 60) + ']');
}

/* ---------------------------------------------------------------- --prove: the tag on the glass
   The search lands a stranger on lines; which one SETS the word is proved, not guessed. Every candidate occurrence gets
   its own tag (~Q and a number) in a copy of its file served under the file's real URL, the walk runs again, and a tag
   read back off the glass PROVES that occurrence sets the word on the screen. TWO PASSES, one walk each, so a pass that
   breaks a screen does not take the other's answers with it:
     A  every name whose search lands on 15 lines or fewer of the loaded game files: every occurrence inside a string
        (or an HTML text node) is tagged.
     B  the row's own kinds (weapons, armour, buildings, people, places, perks, titles, origins) with more than 15
        lines: only occurrences where the WHOLE string is the word in the screen's own letter case ('PISTOL', "THE BAR").
   Never tagged: a word in code, a JSON key, and a value that names a thing to the code (after id:, key:, class:, job:,
   weapon:, kind:, type:, slot:), because a tag there breaks a lookup and would measure the breakage, not the word. The
   tag has no letters to lose to toUpperCase and no word a game would key on. What breaks anyway is reported: the names
   walk one saw that a pass's walk does not see (tags stripped) are listed with the pass. */
function inString(line, at) {
  let q = null;
  for (let i = 0; i < at; i++) {
    const ch = line[i];
    if (q) { if (ch === '\\') { i++; continue; } if (ch === q) q = null; }
    else if (ch === '"' || ch === "'" || ch === '`') q = ch;
  }
  return q;
}
function taggable(file, line, at, len) {
  const q = inString(line, at);
  if (q && /\b(id|key|class|job|weapon|kind|type|slot)\s*["']?\s*:\s*["'`]?$/i.test(line.slice(Math.max(0, at - 24), at))) return null;
  if (/\.json$/.test(file)) {
    if (q !== '"') return null;
    const rest = line.slice(at + len); const close = rest.indexOf('"');
    return close >= 0 && /^\s*:/.test(rest.slice(close + 1)) ? null : 'a json value';
  }
  if (q) return 'a string';
  if (/\.html$/.test(file)) { const before = line.slice(0, at), after = line.slice(at + len);
    if (before.lastIndexOf('>') > before.lastIndexOf('<') && (after.indexOf('<') >= 0 ? after.indexOf('<') < (after.indexOf('>') < 0 ? 1e9 : after.indexOf('>')) : true)) return 'a text node'; }
  return null;
}
const FOCUS = /^(weapon|armour|building|weapon row|weapon class|skill|background|place|keeper title|giver title|person|perk|origin)$/;
const NOT_FOCUS_WORDS = /^(YOU|MAIN|OFF|BODY|HEAD)$/;
function planTags(rows, loaded, pass) {
  const L = new Set(loaded), spots = new Map(); let n = 0;
  for (const r of rows) {
    if (!r.search.found) continue;
    const hits = grep(r.name).filter(h => L.has(h.file) && where(h.file) !== 'NOT THE GAME');
    const small = hits.length <= 15;
    if (pass === 'A' && !small) continue;
    if (pass === 'B' && (small || !FOCUS.test(r.kind) || NOT_FOCUS_WORDS.test(r.name))) continue;
    const re = new RegExp('(?<![\\p{L}\\p{N}_])' + esc(r.name) + '(?![\\p{L}\\p{N}_])', 'giu');
    for (const h of hits) {
      const line = lineOf(h.file, h.line); let m; re.lastIndex = 0;
      while ((m = re.exec(line))) {
        const how = taggable(h.file, line, m.index, m[0].length); if (!how) continue;
        if (pass === 'B') { const pre = line[m.index - 1], post = line[m.index + m[0].length];
          if (m[0] !== r.name || !((pre === post && /["'`]/.test(pre)) || (pre === '>' && post === '<'))) continue; }
        const k = h.file + ':' + h.line + ':' + m.index;
        if (!spots.has(k)) spots.set(k, { file: h.file, line: h.line, at: m.index, len: m[0].length, how, tag: '~Q' + (++n), names: [] });
        if (spots.get(k).names.indexOf(r.name) < 0) spots.get(k).names.push(r.name);
      }
    }
  }
  return Array.from(spots.values());
}
/* PASS C, THE TABLES TRACED BY HAND: the weapon and armour words did not prove in A (too many lines to tag them all) and
   B broke the screens it meant to measure, so C tags only the places the hand trace named, every display value in them:
   the fight's weapon names (weapon_lines.json "name"), the three class-to-word tables (the crew screen's engine file, the
   settlement screen, the item icons), and the armour words, which are written per durability band in three functions. */
const HYP = [
  { file: 'records/target/bb/weapon_lines.json', lines: /^\s*"name": "/, value: /"name": "([^"]+)"/g },
  { file: 'engine/bohemia_roster.js', block: /var CLASSNAME = \{/, lines: /dur < 40 \?/, value: /'([a-z][a-z ]*)'/g },
  { file: 'slices/BOHEMIA_SETTLEMENT_SCREEN.html', block: /var CLASSNAME = \{/, lines: /dur < 40 \?/, value: /'([a-z][a-z ]*)'/g },
  { file: 'slices/bohemia_ui_materials.js', block: /var OBJ_CLASS = \{/, lines: /dur < 40 \?/, value: /'([a-z][a-z ]*)'/g },
];
/* PASS D, THE BUILDINGS: the settlement's B table (a building's name and its short line), its keepers' titles and the
   BUILD tile; their names sit on 18 to 124 lines, so A could not tag them and C does not name them */
const HYP_D = [
  { file: 'slices/BOHEMIA_SETTLEMENT_SCREEN.html', block: /^var B = \{/, lines: /^\s*name:'BUILD'|lbl:'BUILD'|'BUILD'/, value: /(?:name|short|role|lbl):'([^']+)'/g },
  { file: 'slices/BOHEMIA_SETTLEMENT_SCREEN.html', block: /^var KEEPERS = \{/, value: /(?:name|role):'([^']+)'/g },
];
function planTablesC(which) {
  const spots = []; let n = which === 'D' ? 2000 : 1000;
  for (const H of (which === 'D' ? HYP_D : HYP)) {
    const all = fs.readFileSync(path.join(ROOT, H.file), 'utf8').split('\n');
    const pick = new Set();
    if (H.lines) all.forEach((l, i) => { if (H.lines.test(l)) pick.add(i); });
    if (H.block) { const b = all.findIndex(l => H.block.test(l)); if (b >= 0) for (let i = b; i < all.length; i++) { pick.add(i); if (/\};\s*$/.test(all[i])) break; } }
    for (const i of Array.from(pick).sort((a, b) => a - b)) {
      const l = all[i]; let m; H.value.lastIndex = 0;
      while ((m = H.value.exec(l))) {
        const at = m.index + m[0].indexOf(m[1]);
        /* a class key on the left of a colon is the code's word, not the screen's: only the value is tagged */
        if (/\.json$/.test(H.file) || /:\s*'$/.test(l.slice(0, at)) || /[?:]\s*'$/.test(l.slice(0, at)))
          spots.push({ file: H.file, line: i + 1, at, len: m[1].length, how: 'a table value', tag: '~Q' + (++n), names: [m[1]] });
      }
    }
  }
  return spots;
}
const strip = t => String(t).replace(/~Q[0-9]+/gi, '');
async function provePass(R, pass) {
  const spots = (pass === 'C' || pass === 'D') ? planTablesC(pass) : planTags(R.rows, R.walk.loaded, pass);
  const dir = path.join(outDir(), 'prove-' + pass); const serve = {}; const byFile = new Map();
  spots.forEach(s => { if (!byFile.has(s.file)) byFile.set(s.file, []); byFile.get(s.file).push(s); });
  for (const [file, edits] of byFile) {
    const lines = fs.readFileSync(path.join(ROOT, file), 'utf8').split('\n');
    /* right to left on one line, so an earlier column is not shifted by a later tag */
    edits.slice().sort((a, b) => a.line - b.line || b.at - a.at).forEach(e => { const T = lines[e.line - 1]; lines[e.line - 1] = T.slice(0, e.at + e.len) + e.tag + T.slice(e.at + e.len); });
    const out = path.join(dir, file); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, lines.join('\n'));
    serve['/' + file] = out;
  }
  console.error('  [prove ' + pass + '] ' + spots.length + ' tags in ' + byFile.size + ' files; walking again');
  const W2 = await walk(serve);
  /* A TAG PROVES A LINE ON THE SCREEN IT SHOWS ON: each tag is read per frame, and a name counts it only when the tag shows
     in the frame the name was read in (a tag read on the settlement screen proves nothing about the fight's word) */
  const glass = W2.items.filter(it => it.via !== 'canvas' || it.on).map(it => ({ f: it.f, t: String(it.t).toUpperCase(), raw: String(it.t) }));
  spots.forEach(s => { const re = new RegExp(esc(s.tag.toUpperCase()) + '(?![0-9])');
    const hit = glass.filter(g => re.test(g.t)); s.frames = Array.from(new Set(hit.map(g => g.f))); s.shown = hit.length > 0; s.seenAs = hit.slice(0, 3).map(g => g.raw.slice(0, 80)); });
  /* what the pass broke: names walk one read that this walk does not, the tags taken off */
  const seen2 = new Set(); W2.items.forEach(it => cut(strip(it.t)).forEach(p => seen2.add(p.replace(/^[\s"'“(\[]+|[\s"'”)\],:;]+$/g, ''))));
  const lost = R.rows.filter(r => !seen2.has(r.name)).map(r => r.name);
  console.error('  [prove ' + pass + '] ' + spots.filter(s => s.shown).length + ' of ' + spots.length + ' tags read back off the glass; ' + lost.length + ' names walk one saw are gone');
  return { pass, tags: spots.length, files: byFile.size, spots, lost, walk: { ms: W2.ms, notes: W2.notes, errs: W2.errs, items: W2.items.length } };
}
/* --passes A,C (the default); B is kept for the record: measured 10/19, it renamed the town (Church~Q17 is no faction, so
   mapTierOf fell back to camp), the buildings changed and the fight never came up, so its misses measure the breakage */
const PASSES = (() => { const i = args.indexOf('--passes'); return (i >= 0 ? args[i + 1] : 'A,C').split(',').map(x => x.trim().toUpperCase()).filter(Boolean); })();
async function prove(R) {
  const out = [];
  for (const pass of PASSES) out.push(await provePass(R, pass));
  /* per name: the occurrences proved to set it, on the screen that showed it */
  R.rows.forEach(r => { r.proved = []; r.tagged = 0;
    out.forEach(P => P.spots.forEach(s => {
      const mine = s.names.indexOf(r.name) >= 0 || ((P.pass === 'C' || P.pass === 'D') && s.names.some(n => n.toLowerCase() === r.name.toLowerCase() || n.toLowerCase().split(' ').slice(-1)[0] === r.name.toLowerCase()));
      if (!mine) return; r.tagged++;
      if (s.shown && s.frames.indexOf(r.frame) >= 0) r.proved.push({ file: s.file, line: s.line, pass: P.pass, how: s.how, as: s.names[0] }); })); });
  return out.map(P => ({ pass: P.pass, tags: P.tags, files: P.files, shown: P.spots.filter(s => s.shown).length, lost: P.lost, walk: P.walk,
    spots: (P.pass === 'C' || P.pass === 'D') ? P.spots.map(s => ({ file: s.file, line: s.line, word: s.names[0], shown: s.shown, frames: s.frames, seenAs: s.seenAs })) : undefined }));
}

module.exports = { ARM, walk, cut, looksLikeName, grep, grepAll, where, judge, analyse, taggable, planTags, planTablesC, prove };

if (require.main === module) {
  (async function main() {
    let W;
    if (FROM) W = JSON.parse(fs.readFileSync(FROM, 'utf8'));
    else { W = await walk({}); fs.writeFileSync(path.join(outDir(), 'walk.json'), JSON.stringify(W)); console.error('  [walk] written ' + path.join(outDir(), 'walk.json')); }
    if (WALK_ONLY) { console.log(JSON.stringify({ ms: W.ms, stages: W.stages.map(s => [s.name, s.at - W.t0, s.how]), notes: W.notes, items: W.items.length, loaded: W.loaded.length, errs: W.errs }, null, 1)); return; }
    const R = await analyse(W);
    if (PROVE) R.prove = await prove(R);
    fs.writeFileSync(path.join(outDir(), 'names.json'), JSON.stringify(R, null, 1));
    if (JSON_OUT) { console.log(JSON.stringify(R, null, 1)); return; }
    report(R);
  })().catch(e => { console.error(e); process.exit(1); });
}
