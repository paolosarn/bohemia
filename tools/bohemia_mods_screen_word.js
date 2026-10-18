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
  return s.split(/\s+·\s+|\s*\|\s*|\s*•\s*/).map(x => x.trim()).filter(Boolean).filter(x => !/^LEVEL \d+$/.test(x));
}
function looksLikeName(s) {
  if (s.length < 2 || s.length > 48) return false;
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
function grepAll(words) {
  const todo = words.filter(w => !GREP.has(w));
  if (!todo.length) return;
  const pf = path.join(os.tmpdir(), 'mods-word-patterns-' + process.pid + '.txt');
  fs.writeFileSync(pf, todo.join('\n') + '\n');
  let out = '';
  try { out = execFileSync('git', ['-C', ROOT, 'grep', '-n', '-I', '-F', '-w', '-i', '-f', pf, '--'].concat(GAME_DIRS), { encoding: 'utf8', maxBuffer: 1 << 30 }); } catch (e) { out = (e.stdout || '').toString(); }
  fs.unlinkSync(pf);
  const res = todo.map(w => ({ w, lw: w.toLowerCase(), re: wordRe(w), hits: [] }));
  for (const l of out.split('\n')) {
    if (!l) continue; const m = /^([^:]+):(\d+):(.*)$/.exec(l); if (!m) continue;
    const low = m[3].toLowerCase();
    for (const r of res) { if (low.indexOf(r.lw) < 0) continue; const at = m[3].search(r.re); if (at < 0) continue;
      r.hits.push({ file: m[1], line: +m[2], text: m[3].length > 400 ? m[3].slice(Math.max(0, at - 120), at + 200) : m[3] }); }
  }
  res.forEach(r => GREP.set(r.w, r.hits));
}
async function totalsAll(words) {
  const { execFile } = require('child_process');
  const todo = words.filter(w => !TOTAL.has(w));
  let i = 0;
  const one = () => new Promise(res => {
    if (i >= todo.length) return res(false);
    const w = todo[i++];
    execFile('git', ['-C', ROOT, 'grep', '-c', '-I', '-F', '-w', '-i', '-e', w], { maxBuffer: 1 << 26 }, (err, so) => {
      const files = String(so || '').split('\n').filter(Boolean).map(l => { const k = l.lastIndexOf(':'); return { file: l.slice(0, k), n: +l.slice(k + 1) }; });
      TOTAL.set(w, { lines: files.reduce((a, b) => a + b.n, 0), files: files.length, notGameLines: files.filter(f => where(f.file) === 'NOT THE GAME').reduce((a, b) => a + b.n, 0) });
      res(true);
    });
  });
  const lane = async () => { while (await one()); };
  await Promise.all(Array.from({ length: 8 }, lane));
}
function grep(word) { grepAll([word]); return GREP.get(word); }
/* ---------------------------------------------------------------- the reading of the search */
function lettersOf(s) { return String(s).toLowerCase(); }
function judge(name, loaded) {
  const hits = grep(name), tot = TOTAL.get(name) || null;
  const L = new Set(loaded);
  const by = {}; hits.forEach(h => { const w = where(h.file); by[w] = (by[w] || 0) + 1; });
  const game = hits.filter(h => where(h.file) !== 'NOT THE GAME');
  const inLoaded = game.filter(h => L.has(h.file));
  const exact = inLoaded.filter(h => h.text.indexOf(name) >= 0);
  const files = Array.from(new Set(game.map(h => h.file)));
  const loadedFiles = Array.from(new Set(inLoaded.map(h => h.file)));
  const copies = game.filter(h => !L.has(h.file));
  return {
    found: inLoaded.length > 0,
    exactCase: exact.length > 0,
    lines: { all: tot ? tot.lines : null, notTheGame: tot ? tot.notGameLines : null, game: game.length, loaded: inLoaded.length, copiesNotLoaded: copies.length },
    files: { game: files.length, loaded: loadedFiles },
    by,
    candidates: inLoaded.slice(0, 12).map(h => ({ file: h.file, line: h.line, text: h.text.trim().slice(0, 160) })),
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
  const rows = [];
  grepAll(Array.from(names.keys()));
  await totalsAll(Array.from(names.keys()));
  for (const r of names.values()) { r.kind = kindOf(r); r.search = judge(r.name, W.loaded); rows.push(r); }
  return { walk: { ms: W.ms, stages: W.stages.map(s => ({ name: s.name, atMs: s.at - W.t0, how: s.how })), notes: W.notes, items: W.items.length, loaded: W.loaded, errs: W.errs }, rows };
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
    if (/div\.nm<div\.say/.test(c)) return 'keeper';
    if (/div\.nm<div\.hiret/.test(c)) return /^[A-Z][a-z]/.test(n) ? 'person' : 'background';
    if (/i\.cn<div\.cl/.test(c)) return 'person';
    if (/span<div\.cl/.test(c)) return 'contract';
    if (/button\.slot/.test(c)) return /vest|carrier|armour|helm|helmet|hat|hood|shield|door|jacket/.test(n) ? 'armour' : 'weapon';
    if (/div\.slots/.test(c) && /\(was /.test(w)) return /holds/.test(w) ? 'armour' : 'weapon';
    if (/span\.bandw/.test(c)) return 'standing';
    if (/span<button\.act/.test(c)) return /^(Hire|Buy it|Not this one|Sit in the chair|Search the lot|Buy the crew a round|Sell it|Take it)$/.test(n) ? 'ui' : 'ware';
    return 'ui';
  }
  if (/ROSTER/.test(f)) {
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

module.exports = { ARM, walk, cut, looksLikeName, grep, where, judge, analyse };

if (require.main === module) {
  (async function main() {
    let W;
    if (FROM) W = JSON.parse(fs.readFileSync(FROM, 'utf8'));
    else { W = await walk({}); fs.writeFileSync(path.join(outDir(), 'walk.json'), JSON.stringify(W)); console.error('  [walk] written ' + path.join(outDir(), 'walk.json')); }
    if (WALK_ONLY) { console.log(JSON.stringify({ ms: W.ms, stages: W.stages.map(s => [s.name, s.at - W.t0, s.how]), notes: W.notes, items: W.items.length, loaded: W.loaded.length, errs: W.errs }, null, 1)); return; }
    const R = await analyse(W);
    fs.writeFileSync(path.join(outDir(), 'names.json'), JSON.stringify(R, null, 1));
    if (JSON_OUT) { console.log(JSON.stringify(R, null, 1)); return; }
    report(R);
  })().catch(e => { console.error(e); process.exit(1); });
}
