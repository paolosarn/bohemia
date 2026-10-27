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
    return t;
  }
  function free(name, taken) {
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
    root.__HIRE_LOCK = { at: Date.now(), back: out.back, renamed: out.renamed };
    return out;
  }
  repair();
  root.BohemiaHireLock = { repair: repair, uniqueName: uniqueName, walked: walked, names: names };
})(typeof window !== 'undefined' ? window : this);
