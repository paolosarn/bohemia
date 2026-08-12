// BOHEMIA DAY LOOP (8/11/26) — the day has a SHAPE. Canonical body; the city
// inlines it, gates/dayloop_gate.js drives it in Node and on the real surface.
//
// WHAT WAS MISSING. The city had a clock -- T={day,min}, advance(mins) rolling
// past midnight into day+1 -- and that is a TIMER, not a day. Nothing woke you,
// nothing ended, nothing was accounted for, and day 2 was indistinguishable from
// day 1 except for a number in the corner. Paolo's demo row is "close the game
// day loop end to end", and a loop has to CLOSE: you wake, you act, the light
// goes, something is reckoned, you wake again carrying it.
//
// THE SHAPE, and every number here is MECHANISM, which is mine to set:
//
//   WAKE 06:00 ---- 16 waking hours ---- NIGHTFALL 22:00 ---- THE RECKONING
//     ^                                                              |
//     +------------------ day + 1, everything carried ---------------+
//
//   * you wake at 06:00 because the world is a desert and the light is the
//     resource -- the sun is the thing you are racing, which is the whole point
//     of LIGHT=TERRITORY and of nobody patrolling the dark.
//   * NIGHTFALL at 22:00 ends the day whether you like it or not. It is not a
//     punishment, it is the clock: sixteen hours is what a day is.
//   * you may SLEEP early and give the hours back. The loop records that you
//     chose to, because choosing to end a day early is a decision worth seeing
//     in the ledger later.
//   * THE RECKONING is a card that tells you what the day was: where you went,
//     what you went into, what moved on your quests, and what did not.
//
// WHAT THIS DELIBERATELY DOES NOT DO, and it is not an oversight:
//   NO DAMAGE BEFORE THE DIAL. The reckoning REPORTS; it does not starve you,
//   drain you, or kill you. Hunger, exhaustion, rent, a debt clock and every
//   other stake are CONTENTS, and contents are Paolo's. The loop is built so
//   that any of them drops in as one entry in a STAKES table that is empty on
//   purpose. MECHANISM-MINE / CONTENTS-PAOLO'S: I built the day, he sets what
//   it costs to live one.
//
// THE LEDGER is the honest part. It counts only things that actually happened in
// the world -- steps taken, districts stood in, buildings entered, quest stages
// that really fired -- so the card can never congratulate you for a day you did
// not have.
//
// REUSE CHECK: cooks no graphic pixels of any kind. This is loop plumbing; it
// opens no bank because there is nothing to draw.
(function (root) {
  'use strict';

  var WAKE_MIN = 6 * 60;         // 06:00
  var NIGHT_MIN = 22 * 60;       // 22:00
  var DAY_MIN = 24 * 60;

  function hhmm(min) {
    min = ((min % DAY_MIN) + DAY_MIN) % DAY_MIN;
    var h = Math.floor(min / 60), m = Math.floor(min % 60);
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  function freshLedger() {
    return {
      steps: 0,
      districts: {},        // name -> minutes stood in it
      entered: [],          // buildings gone INTO
      stages: [],           // quest stages that actually fired
      notes: [],            // @LOG lines the quest itself wrote
      sleptEarly: false,
      endedAt: null,
      reason: null
    };
  }

  function make(opts) {
    opts = opts || {};

    var L = {
      V: 1,
      day: 1,
      min: WAKE_MIN,
      phase: 'wake',                 // 'wake' | 'awake' | 'ended'
      WAKE_MIN: WAKE_MIN,
      NIGHT_MIN: NIGHT_MIN,
      ledger: freshLedger(),
      history: [],                   // one closed ledger per day lived
      /* THE STAKES TABLE. Empty ON PURPOSE and it is not a stub to fill in:
         what a day costs to live is Paolo's ruling, not mine. Each entry would
         be {name, apply(ledger, state)} and the reckoning would list it. Until
         he rules, a day costs nothing but the light. */
      STAKES: []
    };

    var hooks = { wake: [], end: [], stage: [] };
    function fire(k, a, b) { for (var i = 0; i < hooks[k].length; i++) { try { hooks[k][i](a, b); } catch (e) {} } }

    L.on = function (k, fn) { if (hooks[k]) hooks[k].push(fn); return L; };

    /* ---- WAKE ------------------------------------------------------------ */
    L.wake = function () {
      L.phase = 'awake';
      L.min = WAKE_MIN;
      L.ledger = freshLedger();
      fire('wake', L.day);
      return L;
    };

    /* ---- THE DAY RUNS ----------------------------------------------------
       Called by whatever moves time. Returns 'ended' the tick nightfall lands,
       so the caller can put the reckoning up without polling for it.
       The clamp matters: a single expensive action must never SKIP nightfall
       and silently spend hours of a day that already ended. */
    L.tick = function (mins, where) {
      if (L.phase !== 'awake') return L.phase;
      mins = Math.max(0, mins | 0);
      if (L.min + mins >= NIGHT_MIN) {
        var spent = NIGHT_MIN - L.min;
        if (where) L.ledger.districts[where] = (L.ledger.districts[where] || 0) + spent;
        L.min = NIGHT_MIN;
        return L.endDay('nightfall');
      }
      L.min += mins;
      if (where) L.ledger.districts[where] = (L.ledger.districts[where] || 0) + mins;
      return L.phase;
    };

    L.step = function (where) { if (L.phase === 'awake') L.ledger.steps++; return L.tick(0, where); };
    L.entered = function (what) {
      if (L.phase !== 'awake' || !what) return L;
      if (L.ledger.entered.indexOf(what) < 0) L.ledger.entered.push(what);
      return L;
    };
    /* a quest stage that ACTUALLY fired, with the quest's own @LOG line.
       ACCEPTED WHILE THE DAY IS CLOSING TOO, and that is not a loophole -- it is
       the whole point of nightfall having teeth. Measured 8/12: an unresolved job
       takes the quest author's own FAIL stage AT nightfall, which happens after
       endDay() has already set phase='ended', so an 'awake'-only guard silently
       dropped the one line the reckoning existed to show. The consequence of a day
       belongs to that day. After nextDay() the ledger is fresh, so a late stage can
       only ever belong to the day that just ended. */
    L.stage = function (questId, stageN, log, tag) {
      if (L.phase !== 'awake' && L.phase !== 'ended') return L;
      L.ledger.stages.push({ q: questId, n: stageN, tag: tag || null });
      if (log) L.ledger.notes.push(log);
      fire('stage', questId, stageN);
      return L;
    };

    /* ---- THE RECKONING --------------------------------------------------- */
    L.endDay = function (reason) {
      if (L.phase === 'ended') return L.phase;
      L.phase = 'ended';
      L.ledger.reason = reason || 'nightfall';
      L.ledger.sleptEarly = (reason === 'slept');
      L.ledger.endedAt = L.min;
      for (var i = 0; i < L.STAKES.length; i++) {         // empty until he rules
        try { L.STAKES[i].apply(L.ledger, L); } catch (e) {}
      }
      fire('end', L.summary());
      return L.phase;
    };

    L.sleep = function () {
      if (L.phase !== 'awake') return L.phase;
      return L.endDay('slept');
    };

    /* ---- THE NEXT DAY, CARRYING EVERYTHING ------------------------------- */
    L.nextDay = function () {
      if (L.phase !== 'ended') L.endDay('nightfall');
      L.history.push(L.ledger);
      if (L.history.length > 30) L.history.shift();   // a month of nights is plenty
      L.day++;
      L.wake();
      return L.day;
    };

    /* ---- what the card reads --------------------------------------------- */
    L.summary = function () {
      var d = [], k;
      for (k in L.ledger.districts) d.push({ name: k, mins: L.ledger.districts[k] });
      d.sort(function (a, b) { return b.mins - a.mins; });
      return {
        day: L.day,
        /* while the day is still running there IS no reason yet. Defaulting it
           to 'nightfall' made a mid-day summary claim the day had ended, which
           is a report telling a small lie about the world. */
        reason: L.ledger.reason || (L.phase === 'ended' ? 'nightfall' : null),
        sleptEarly: !!L.ledger.sleptEarly,
        endedAt: hhmm(L.ledger.endedAt == null ? L.min : L.ledger.endedAt),
        hoursLived: Math.round(((L.ledger.endedAt == null ? L.min : L.ledger.endedAt) - WAKE_MIN) / 6) / 10,
        hoursGivenBack: L.ledger.sleptEarly
          ? Math.round((NIGHT_MIN - (L.ledger.endedAt == null ? L.min : L.ledger.endedAt)) / 6) / 10 : 0,
        steps: L.ledger.steps,
        districts: d,
        entered: L.ledger.entered.slice(),
        stages: L.ledger.stages.slice(),
        notes: L.ledger.notes.slice(),
        stakes: L.STAKES.map(function (s) { return s.name; })   // [] until he rules
      };
    };

    L.clock = function () { return 'DAY ' + L.day + ' · ' + hhmm(L.min); };
    L.hhmm = hhmm;
    L.isNight = function () { return L.min >= 19 * 60 || L.min < 6 * 60; };
    L.left = function () { return Math.max(0, NIGHT_MIN - L.min); };

    /* ---- persistence: plain JSON, so it rides the existing save ---------- */
    L.serialize = function () {
      return { v: 1, day: L.day, min: L.min, phase: L.phase, ledger: L.ledger, history: L.history };
    };
    L.restore = function (st) {
      if (!st || st.v !== 1) return false;
      L.day = st.day || 1;
      L.min = (typeof st.min === 'number') ? st.min : WAKE_MIN;
      L.phase = st.phase || 'awake';
      L.ledger = st.ledger || freshLedger();
      L.history = st.history || [];
      return true;
    };

    if (opts.onWake) L.on('wake', opts.onWake);
    if (opts.onEnd) L.on('end', opts.onEnd);
    return L;
  }

  var API = { make: make, WAKE_MIN: WAKE_MIN, NIGHT_MIN: NIGHT_MIN, hhmm: hhmm, VERSION: 'dayloop-1.0.0' };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaDayLoop = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
