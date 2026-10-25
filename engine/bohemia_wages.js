/* BOHEMIA WAGES -- what a hired man is paid a night (RUN TWO [money teaches], rule 151(b), 10/25/26).
   PAOLO 10/24: 'if the first thing I did was I hired a full squad 12 people from three... a lot of people would be dying, I'd be
   wasting money... keep a squad fed and paid... it would hurt my ability to hire better people or get better weapons and armor'.
   TUNING measured it (records/BOHEMIA_TUNING_WHAT_YOU_SEE_IN_A_CITY_AND_MONEY_TEACHES_10_25_26.md s2): THE MEN AT THE POST WERE
   NEVER PAID (engine/bohemia_goodbros.js wageChargedHere: 0 stretched the retinue's 'bought once' onto the men who fight), so a
   level-11 killer ate the same as a recruit and a big company cost no more than its food. TUNING's numbers, here:
     a hired man's wage is his background's wiki wage / 10 (batteries are crowns at ten to one), rounded, never under one,
     x 1.1 a level to level 11 (the wiki's own rule; past 11 it stays: our act is a year); paid at nightfall beside his food;
     the founding crew eats and is not paid ('three of you and nothing owed').
   records/target/bb/backgrounds.json daily_wage is the wiki's crowns; until it lands a man is ten crowns, one battery.
     BohemiaWages.wage(bgId, level)       one man's pay a night, in batteries
     BohemiaWages.ready()                 the backgrounds are in */
(function (root) {
  'use strict';
  var BG = null;
  try {
    if (typeof fetch !== 'undefined') fetch((root.BOHEMIA_WAGES_BASE || '../records/target/bb/') + 'backgrounds.json').then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (!j || !j.rows) return; BG = {}; j.rows.forEach(function (r) { BG[r.id] = +r.daily_wage || 0; }); }).catch(function () {});
  } catch (e) {}
  function key(bg) { return String(bg || '').toLowerCase().replace(/[\s-]+/g, '_'); }
  function wage(bgId, level) {
    var w = BG ? BG[key(bgId)] : null; if (w == null) w = 10;
    if (w === 0) return 0;   /* the wiki's ruled zero (a man who owes you), never floored up */
    var lv = Math.max(1, Math.min(11, (level | 0) || 1));
    return Math.max(1, Math.round(w / 10 * Math.pow(1.1, lv - 1)));
  }
  root.BohemiaWages = { wage: wage, ready: function () { return !!BG; } };
})(typeof window !== 'undefined' ? window : this);
