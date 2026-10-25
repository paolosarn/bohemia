/* BOHEMIA RENOWN -- CLOUT, the company's name in the valley (RUN TWO [the camp and the retinue], rule 151(d), and
   [money teaches], rule 151(b); 10/25/26).
   Battle Brothers keeps one number for how known your company is, Renown: contracts and won fights raise it, a dropped or
   failed job lowers it, and it does two things: it opens the retinue's five slots (250, 750, 1,400, 2,250 and 3,350, the
   wiki's own table) and 'the crowns reward increases with your company's Renown' (the wiki's Contracts page). Bohemia had
   no such number (WORLD, slices/bohemia_job_kinds.js: 'renown has no Bohemia number'). This is it, under our own word,
   CLOUT. Every number is in records/target/bb/renown.json (TUNING's to move; the copy below is the same numbers, so the
   first frame before the file lands reads right).
     BohemiaRenown.score()             the company's clout (0 for a new company)
     BohemiaRenown.add(n, why, key)    raise or lower it; a key is counted once (a job settled, a fight won), for ever
     BohemiaRenown.fromAct(act, id)    a settled job's act (civilian_contract_done, _poor, fail_civilian_contract,
                                       cancel_contract), keyed by the job, the way the towns' bars are moved
     BohemiaRenown.fightWon(n, key)    a fight won against n men
     BohemiaRenown.band()              { word, at, next } the band the score is in, in our words
     BohemiaRenown.slots()             how many retinue slots the score opens (0 to 5)
     BohemiaRenown.nextSlot()          { at, n } the score the next slot opens at, or null when all five are open
     BohemiaRenown.payMult()           what a job's pay is multiplied by at this score (x1 at 0 to x4.5 at 4,000)
     BohemiaRenown.WORD                'CLOUT'
   Kept in localStorage bohemia.renown.v1 (a new game clears it, the start screen's forget list). */
(function (root) {
  'use strict';
  var KEY = 'bohemia.renown.v1';
  var D = {
    word: 'CLOUT',
    slots: [[250, 1], [750, 2], [1400, 3], [2250, 4], [3350, 5]],
    bands: [[0, 'NOBODY'], [250, 'SEEN AROUND'], [500, 'GOOD FOR IT'], [750, 'GETS IT DONE'], [1050, 'PROFESSIONALS'], [1400, 'PEOPLE ASK FOR YOU'],
      [1800, 'A NAME IN THE VALLEY'], [2250, 'THE CREW EVERYBODY KNOWS'], [2750, 'THEY TELL STORIES'], [3350, 'STREET LEGEND'], [4000, 'THE LEGEND'],
      [8000, 'NOBODY TOUCHES YOU'], [14000, 'FOREVER']],
    gains: { civilian_contract_done: 100, civilian_contract_poor: 50, fail_civilian_contract: -75, cancel_contract: -100, fight_won_per_enemy: 5, ambition: 100 },
    pay: { from: 1, to: 4.5, at: 4000 }
  };
  try {
    if (typeof fetch !== 'undefined') {
      var base = root.BOHEMIA_RENOWN_BASE || '../records/target/bb/';
      fetch(base + 'renown.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        if (!j) return;
        if (j.word && j.word.value) D.word = j.word.value;
        if (j.slots && j.slots.value) D.slots = j.slots.value;
        if (j.bands && j.bands.value) D.bands = j.bands.value.map(function (b) { return [b.at, b.word]; });
        if (j.gains && j.gains.value) D.gains = j.gains.value;
        if (j.pay_mult && j.pay_mult.value) D.pay = j.pay_mult.value;
      }).catch(function () {});
    }
  } catch (e) {}
  function rec() {
    var r = null; try { r = JSON.parse(root.localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!r || typeof r !== 'object') r = { score: 0, keys: [], log: [] };
    if (typeof r.score !== 'number') r.score = 0; if (!Array.isArray(r.keys)) r.keys = []; if (!Array.isArray(r.log)) r.log = [];
    return r;
  }
  function save(r) { try { root.localStorage.setItem(KEY, JSON.stringify(r)); } catch (e) {} }
  function score() { return Math.max(0, Math.round(rec().score)); }
  function add(n, why, key) {
    n = +n || 0; if (!n) return score();
    var r = rec();
    if (key) { if (r.keys.indexOf(String(key)) >= 0) return score(); r.keys.push(String(key)); r.keys = r.keys.slice(-300); }
    r.score = Math.max(0, r.score + n);
    r.log.push({ n: n, why: String(why || ''), at: Date.now() }); r.log = r.log.slice(-40);
    save(r);
    try { root.__RENOWN_LAST = { n: n, why: why, score: r.score }; } catch (e) {}
    return Math.round(r.score);
  }
  function fromAct(act, id) { var g = D.gains[act]; return typeof g === 'number' ? add(g, act, id ? 'job:' + id + ':' + act : null) : score(); }
  function fightWon(n, key) { return add((+n || 0) * (D.gains.fight_won_per_enemy || 0), 'a fight won', key ? 'fight:' + key : null); }
  function band() {
    var s = score(), b = D.bands[0], nx = null;
    for (var i = 0; i < D.bands.length; i++) { if (s >= D.bands[i][0]) b = D.bands[i]; else { nx = D.bands[i]; break; } }
    return { word: b[1], at: b[0], next: nx ? { at: nx[0], word: nx[1] } : null };
  }
  function slots() { var s = score(), n = 0; D.slots.forEach(function (t) { if (s >= t[0]) n = Math.max(n, t[1]); }); return n; }
  function nextSlot() { var s = score(); for (var i = 0; i < D.slots.length; i++) if (s < D.slots[i][0]) return { at: D.slots[i][0], n: D.slots[i][1] }; return null; }
  function payMult() { var s = score(), P = D.pay; return Math.round((P.from + (P.to - P.from) * Math.min(1, s / P.at)) * 100) / 100; }
  root.BohemiaRenown = { score: score, add: add, fromAct: fromAct, fightWon: fightWon, band: band, slots: slots, nextSlot: nextSlot, payMult: payMult,
    KEY: KEY, get WORD() { return D.word; }, data: function () { return D; } };
})(typeof window !== 'undefined' ? window : this);
