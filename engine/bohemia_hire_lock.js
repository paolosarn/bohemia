/* A HIRE IS LOCKED IN (Paolo 10/27, rule 295: 'I just hired someone and it says four out of 12 but when I go into crew... I'm on
   day 13... I got my fourth member fully kicked out... make sure every time you hire someone it's locked in and it's not some
   ghost mystery accidental bullshit... make sure it doesn't happen again').
   MEASURED, two ways a man he paid for went missing while the bar still counted him:
   1. THE NIGHT'S BILL WALKED HIM. A night the batteries could not cover, the map wrote the newest hire into bohemia.walked.v1
      (nightly_bill.json walks_when_short 1). Nothing asked; one line on the phone; gone.
   2. TWO MEN, ONE NAME. The hall names its men from the county's mix, so a name comes back. The crew screen merges the hired
      list BY NAME (a second JOE was skipped as 'already here'), hides the walked and the let-go BY NAME (a new JOE vanished
      with the old one), and keeps every man's level, gear and wounds under his name (two JOEs shared one record). The bar
      counts the list's length. So the bar said four and the screen showed three.
   NOW: the bill never walks a man (walks_when_short 0; the purse may run dry, the men stay); a hire's name is his own in the
   whole company, a second JOE is JOE II; and an old game is mended where it is read: a man the bill walked comes back (only a
   man HE let go stays gone, dismissed:true) and a hired man who shares a name with one before him is renamed, so the screen
   that hid him shows him. One file, read by the shell, the map, the town and the crew screen. */
(function (root) {
  'use strict';
  var HK = 'bohemia.hired.v1', WK = 'bohemia.walked.v1';
  var ROMAN = ['', '', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  function ls(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function up(n) { return String(n || '').trim().toUpperCase(); }
  function stem(n) { return up(n).replace(/ (II|III|IV|V|VI|VII|VIII|IX|X|\d+)$/, ''); }
  /* only a man he let go stays gone; the bill's walks are undone */
  function walked() { var w = ls(WK, []); return Array.isArray(w) ? w.filter(function (x) { return x && x.name && x.dismissed; }) : []; }
  /* every name the company has carried: the crew screen's records (every man it ever showed, the dead too), the line, the hired,
     the let-go, the fights' rows */
  function names() {
    var t = {};
    try { var c = ls('bohemia.climb.v1', {}); for (var k in (c || {})) t[up(k)] = 1; } catch (e) {}
    (ls('bohemia.company.v1', []) || []).forEach(function (m) { if (m && m.name) t[up(m.name)] = 1; });
    (ls(HK, []) || []).forEach(function (m) { if (m && m.name) t[up(m.name)] = 1; });
    (ls(WK, []) || []).forEach(function (m) { if (m && m.name) t[up(m.name)] = 1; });
    (ls('bohemia.fight.after.v1', []) || []).forEach(function (f) { ((f && f.rows) || []).forEach(function (r) { if (r && r.name) t[up(r.name)] = 1; }); });
    try { var me = ls('bohemia.main.v1', null); if (me && me.name) t[up(me.name)] = 1; } catch (e) {}   /* and YOUR name (FIXES item 10) */
    return t;
  }
  function free(name, taken) {
    /* FIXES item 10 (rule 351(b), ask line 362; Paolo 11/3: 'I think three of them are named the same thing in my company'):
       MEASURED: a town's post rolls its names off the place and the week, so the same man's name stood there visit after visit, and
       a number made him 'unique': TOMAS REYES, TOMAS REYES II, TOMAS REYES III, three men with one name to the man reading the roster.
       Now a taken name keeps its first name and gets another surname off the names engine (a nickname when they run dry), and a
       name and the same name with a number count as one (engine/bohemia_unique_name.js); the number below is only the fallback
       for a page without the engine */
    try { var U = root.BohemiaUniqueName; if (U && U.unique) return up(U.unique(name, taken, { seed: up(name) + ':' + Object.keys(taken).length })); } catch (e) {}
    var base = stem(name) || 'MAN';
    if (!taken[up(name)]) return up(name);
    for (var k = 2; k < 100; k++) { var n = base + ' ' + (ROMAN[k] || k); if (!taken[n]) return n; }
    return base + ' ' + Date.now();
  }
  /* the name a new man is hired under: his own, or his own with a number when the company already has one */
  function uniqueName(name) { return free(name, names()); }
  /* mend a game saved before this: the bill's walks undone; a hired man whose name a man before him already wore renamed */
  function repair() {
    var out = { back: [], renamed: [] };
    try {
      var w = ls(WK, []);
      if (Array.isArray(w)) { var keep = w.filter(function (x) { return x && x.dismissed; });
        if (keep.length !== w.length) { w.forEach(function (x) { if (x && !x.dismissed && x.name) out.back.push(String(x.name)); }); put(WK, keep); } }
    } catch (e) {}
    try {
      var h = ls(HK, []);
      if (Array.isArray(h) && h.length) {
        var all = names(), seen = {}, moved = false;
        h.forEach(function (d) {
          if (!d || !d.name) return;
          var n = up(d.name);
          if (seen[n]) { var to = free(n, Object.assign({}, all, seen)); out.renamed.push({ from: d.name, to: to }); d.was = d.was || d.name; d.name = to; n = to; all[to] = 1; moved = true; }
          seen[n] = 1;
          if (!d.hid) { d.hid = 'h' + Math.random().toString(36).slice(2, 9); moved = true; }
        });
        if (moved) put(HK, h);
      }
    } catch (e) {}
    /* FIXES item 10: twins across the whole company (the crew screen's company and the hired), a number counting as no new name:
       the first keeps it, every later twin is renamed, his face his own (engine/bohemia_unique_name.js fixSaved) */
    try { var U = root.BohemiaUniqueName; if (U && U.fixSaved) U.fixSaved().forEach(function (r) { out.renamed.push({ from: r.from, to: r.to }); }); } catch (e) {}
    root.__HIRE_LOCK = { at: Date.now(), back: out.back, renamed: out.renamed };
    return out;
  }
  /* ==== ONE COMPANY (PLUMBER 2, rule 327, ask 325, Paolo 11/2: 'when I dismiss someone from my group, they have to be gone from
     all my [menus]... it's supposed to be this universal code thing, come on... I dismiss someone in the camp, in the settlements,
     when I'm in the menu trying to buy items, it still thinks they're part of my squad').
     MEASURED: the crew screen's DISMISS wrote the man into bohemia.walked.v1 and rewrote its own hand-over without him, but a HIRED
     man stayed in bohemia.hired.v1; the shop's list (the green 'on him' mark, and his men in the town's picture) merges the hired
     back in and never read the let-go list, so the man he dismissed came back in every shop. The map's count was sums and
     differences of four lists (the origin's length plus the hired, less the let-go, the taken, the dead), right only while every
     list agreed. NOW ONE TRUTH, read by every screen that lists his men:
       BohemiaHireLock.company(origin, originId)  the men in the company now (the crew screen's line, its bench, the men it knows,
                                                  the hired; the origin's men only before the crew screen ever kept a company),
                                                  never a man he let go, never the dead, never the taken; YOU first
       BohemiaHireLock.count(origin, originId)    its length (the bar, the bill, the fight's size, the phone)
       BohemiaHireLock.isGone(name)               a man let go, dead or taken
       BohemiaHireLock.dismiss(man, why)          THE ONE WRITE: into the let-go list once, and out of every other list he sits in
                                                  (the hired, the hand-over, the line); every open screen hears it
       BohemiaHireLock.onChange(fn)               a screen that is open when it happens (a storage event from the crew screen's
                                                  frame, or this page's own 'bohemia:company')
     AN OLD GAME IS MENDED WHERE IT IS READ: a man marked let go who still sits in another list is taken out of it (scrub, at load
     and on every change). ==== */
  var CO = 'bohemia.company.v1', LINE = 'bohemia.company.line.v1', TK = 'bohemia.taken.v1', FA = 'bohemia.fight.after.v1', CL = 'bohemia.climb.v1';
  var KEYS = [CO, LINE, HK, WK, TK, FA, CL];
  function key(n) { try { if (root.BohemiaCondition && root.BohemiaCondition.canon) return root.BohemiaCondition.canon(n); } catch (e) {} return up(n); }
  function letGo() { var g = {}; walked().forEach(function (x) { var k = key(x.name); if (k) g[k] = 1; }); return g; }
  function gone() {
    var g = letGo(), add = function (n) { var k = key(n); if (k) g[k] = 1; };
    (ls(TK, []) || []).forEach(function (t) { ((t && t.names) || []).forEach(add); });
    (ls(FA, []) || []).forEach(function (f) { ((f && f.rows) || []).forEach(function (r) { if (r && r.dead && !r.main) add(r.name); }); });
    (ls(CO, []) || []).forEach(function (m) { if (m && m.dead && !m.main) add(m.name); });
    try { var c = ls(CL, {}) || {}; for (var n in c) if (c[n] && c[n].dead) add(n); } catch (e) {}
    try { if (root.BohemiaCondition && root.BohemiaCondition.dead) root.BohemiaCondition.dead().forEach(function (d) { if (d) add(d.shown || d.name); }); } catch (e) {}
    delete g.YOU; return g;
  }
  function isGone(name) { var k = key(name); return !!k && k !== 'YOU' && !!gone()[k]; }
  function picks() { try { for (var w = root, i = 0; w && i < 6; i++) { if (w.BOH_START && w.BOH_START.picks) return w.BOH_START.picks(); if (w.parent === w) break; w = w.parent; } } catch (e) {} return null; }
  function company(origin, originId) {
    var co = ls(CO, null), line = ls(LINE, null), g = gone(), out = [], seen = {};
    if (originId == null) { var p = picks(); originId = p && p.origin; }
    var same = !(line && line.origin && originId && line.origin !== originId);
    var add = function (m, extra) {
      if (!m || !m.name) return; var k = key(m.name), main = !!(extra && extra.main); if (!k || seen[k] || (!main && g[k])) return;
      seen[k] = 1; var c = {}; for (var f in m) c[f] = m[f]; if (extra) for (var e in extra) c[e] = extra[e]; out.push(c);
    };
    var kept = Array.isArray(co) && co.length > 0 && same;
    if (kept) {
      co.forEach(function (m, i) { add(m, i === 0 ? { main: true, from: 'line' } : { main: false, from: 'line' }); });
      if (line && Array.isArray(line.bench)) line.bench.forEach(function (b) { if (b && b.man) add(b.man, { main: false, from: 'bench' }); });
    } else if (Array.isArray(origin)) origin.forEach(function (m, i) { add(m, { main: i === 0, from: 'origin' }); });
    (ls(HK, []) || []).forEach(function (h) { if (h && !h.dead) add(h, { main: false, hired: true, from: 'hired' }); });
    if (kept && line && Array.isArray(line.known)) line.known.forEach(function (n) { if (n) add({ name: String(n) }, { main: false, from: 'known' }); });   /* a man the crew screen keeps off the line */
    return out;
  }
  function count(origin, originId) { return Math.max(1, company(origin, originId).length); }
  /* every list a man he let go still sits in, emptied of him; true when anything changed */
  function scrub() {
    var g = letGo(), moved = false; if (!Object.keys(g).length) return false;
    try {
      var h = ls(HK, []);
      if (Array.isArray(h)) { var hk = h.filter(function (x) { return !(x && x.name && g[key(x.name)]); });
        if (hk.length !== h.length) { put(HK, hk); moved = true;
          var gw = ls(WK, []), hn = {}; h.forEach(function (x) { if (x && x.name) hn[key(x.name)] = 1; });
          if (Array.isArray(gw)) { gw.forEach(function (x) { if (x && x.dismissed && hn[key(x.name)]) x.hired = true; }); put(WK, gw); } } }
    } catch (e) {}
    try {
      var co = ls(CO, null), line = ls(LINE, null), drop = [];
      if (Array.isArray(co)) co.forEach(function (m, i) { if (i > 0 && m && m.name && g[key(m.name)]) drop.push(i); });
      if (drop.length) {
        var nco = co.filter(function (m, i) { return drop.indexOf(i) < 0; }); put(CO, nco); moved = true;
        if (line && typeof line === 'object') {
          var re = function (row) { return Array.isArray(row) ? row.map(function (ix) { if (ix == null || drop.indexOf(ix) >= 0) return null; var d = 0; drop.forEach(function (x) { if (x < ix) d++; }); return ix - d; }) : row; };
          line.front = re(line.front); line.back = re(line.back);
        }
      }
      if (line && typeof line === 'object') {
        var lm = false, out = function (n) { var o = !(n && g[key(n)]); if (!o) lm = true; return o; };
        if (Array.isArray(line.men)) line.men = line.men.filter(out);
        if (Array.isArray(line.known)) line.known = line.known.filter(out);
        if (Array.isArray(line.bench)) line.bench = line.bench.filter(function (b) { return out(b && b.man && b.man.name); });
        if (lm || drop.length) { put(LINE, line); moved = true; }
      }
    } catch (e) {}
    return moved;
  }
  var HEARD = [];
  function notify(what, name) {
    try { root.__ONE_COMPANY = { at: Date.now(), what: what, name: name || null, n: ((root.__ONE_COMPANY && root.__ONE_COMPANY.n) || 0) + 1 }; } catch (e) {}
    try { root.dispatchEvent(new CustomEvent('bohemia:company', { detail: { what: what, name: name || null } })); } catch (e) {}
  }
  function dismiss(m, why) {
    if (!m || !m.name || m.main) return false;
    var name = String(m.name), k = key(name), h = ls(HK, []), w = ls(WK, []); if (!Array.isArray(w)) w = [];
    var hired = !!m.hired || (Array.isArray(h) && h.some(function (x) { return x && x.name && key(x.name) === k; }));
    if (!w.some(function (x) { return x && x.dismissed && key(x.name) === k; })) {
      var row = { name: name, look: m.look || null, hired: hired, dismissed: true, day: m.day == null ? null : m.day };
      if (why) row.why = why; w.push(row); put(WK, w);
    }
    scrub(); notify('dismiss', name); return true;
  }
  function onChange(fn) {
    if (typeof fn !== 'function') return; HEARD.push(fn);
    if (HEARD.length > 1) return;
    var t = null, fire = function (k) { clearTimeout(t); t = setTimeout(function () { if (k === WK || k == null) scrub(); HEARD.forEach(function (f) { try { f(k); } catch (e) {} }); }, 30); };
    try { root.addEventListener('storage', function (e) { if (!e.key || KEYS.indexOf(e.key) >= 0) fire(e.key); }); } catch (e) {}
    try { root.addEventListener('bohemia:company', function () { fire('bohemia:company'); }); } catch (e) {}
  }
  repair();
  scrub();
  root.BohemiaHireLock = { repair: repair, uniqueName: uniqueName, walked: walked, names: names,
    company: company, count: count, isGone: isGone, gone: gone, key: key, dismiss: dismiss, scrub: scrub, onChange: onChange, KEYS: KEYS };
})(typeof window !== 'undefined' ? window : this);
