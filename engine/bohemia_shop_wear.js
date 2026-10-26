/* ==== WHAT YOU BUY GOES ON THE MAN (RUN TWO [what you buy goes on the man], rule 210, Paolo 10/26: 'I love the idea of
   shopping for something and seeing where it's best ranked for your company, but then if I buy it, depending on whichever
   person I select it looks best on, it auto-equips to them'; records/BOHEMIA_PAOLO_WHAT_YOU_BUY_GOES_ON_THE_MAN_10_26_26.md).
   MEASURED: a bought piece went to the stash every time and he had to open the crew screen and drag it onto the man the card
   had just shown it on. AND: a new game has no crew-screen files at all (no bohemia.company.v1, no bohemia.climb.v1) until the
   crew screen is opened once, so the shop has nothing of the crew screen's to write a man's new gear into.
   NOW the shop puts it on him and writes WHAT HE NOW WEARS here, one line a man and a slot; every reader lays the lines over
   the company it has: the shop's next card (it shows on him), the game's door into the fight (__WHO_YOU_HIRE_FIGHTS__ in the
   alpha) and the crew screen, which takes the lines into its own files the next time it opens and empties this one. The old
   piece is already in the stash (the shop put it there); a reader that finds a man in some other piece than the shop saw
   hands that piece back as displaced, so nothing is ever lost.
   A line: {name, main, slot, item:{id, kind, name, ...}, was:id|null, dropOff:bool, offWas:id|null, at} ==== */
(function (root) {
  'use strict';
  var KEY = 'bohemia.wear.v1';
  function read() { try { var a = JSON.parse(root.localStorage.getItem(KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function write(a) { try { if (a.length) root.localStorage.setItem(KEY, JSON.stringify(a)); else root.localStorage.removeItem(KEY); } catch (e) {} }
  /* the same man: YOU by his flag, or first in a list that carries no flags (the hand-over and the door put YOU first and the
     door's YOU has no name); anyone else by his name or the name a save knew him by */
  function same(line, m, i, flagged) {
    if (!m) return false;
    if (line.main) return flagged ? !!m.main : i === 0;
    return !m.main && !!m.name && (m.name === line.name || (m.was && m.was === line.name));
  }
  function idOf(x) { return x ? (x.id || x) : null; }
  /* one more line: the man's older line for the same slot goes (the last buy wins) */
  function add(line) {
    if (!line || !line.slot || !line.item) return;
    var a = read().filter(function (x) { return !((x.main ? line.main : (!line.main && x.name === line.name)) && x.slot === line.slot); });
    line.at = line.at || Date.now(); a.push(line); write(a);
  }
  /* lay the lines over a company: men = [{name, main, gear}], asIds: the gear holds ids (the hand-over, the door), else items
     (the crew screen). A man handed no gear keeps none: the fight deals his kit and a half-dressed man would fight naked.
     Returns what each line displaced that the shop did not see (the reader puts it in the stash) */
  function apply(men, asIds, lines) {
    var out = [];
    if (!Array.isArray(men)) return out;
    var flagged = men.some(function (m) { return m && m.main; });
    (lines || read()).forEach(function (line) {
      for (var i = 0; i < men.length; i++) {
        var m = men[i]; if (!same(line, m, i, flagged) || !m.gear) continue;
        var g = {}; for (var k in m.gear) g[k] = m.gear[k];
        var cur = g[line.slot], want = asIds ? line.item.id : line.item;
        if (cur && idOf(cur) !== line.item.id && idOf(cur) !== line.was) out.push({ man: m, slot: line.slot, it: cur });
        g[line.slot] = want;
        if (line.dropOff && g.off) { if (idOf(g.off) !== line.offWas) out.push({ man: m, slot: 'off', it: g.off }); g.off = null; }
        m.gear = g; break;
      }
    });
    return out;
  }
  /* the crew screen's: the lines, and the file emptied (its own files hold them from here) */
  function take() { var a = read(); write([]); return a; }
  root.BohemiaShopWear = { KEY: KEY, read: read, add: add, apply: apply, take: take, same: same };
})(typeof window !== 'undefined' ? window : this);
