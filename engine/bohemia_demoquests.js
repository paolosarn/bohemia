// BOHEMIA DEMO QUESTS (8/11/26) — SCAFFOLDING, AND IT SAYS SO.
//
// Paolo's demo row, verbatim: "close the game day loop end to end (hardcode the
// demo quests, scaffolding is legal)". This is the hardcoding. It is named
// scaffolding in the filename, in this banner, on the marker in the city, and in
// the gate, so nobody six weeks from now mistakes it for the real placement
// system.
//
// WHAT IS REAL HERE AND WHAT IS SCAFFOLD:
//
//   REAL — the quests. Three canon .bq files, parsed by the real BQ parser and
//   played by the real BQRuntime, executing their real @DO verbs (bond, faction,
//   faction_posture, objectives). Not one word of quest content is invented.
//   MECHANISM-MINE / CONTENTS-PAOLO'S: I wired it, he wrote it.
//
//   REAL — the outcomes. A stage that fires really writes bonds and faction
//   standing into quest state, and that state really rides the save.
//
//   SCAFFOLD — the casting. The real system (engine/bohemia_quest_placement.js)
//   casts @ROLE against people who actually exist in the world and places the
//   quest where they are. This binds stages to WORLD EVENTS instead: where you
//   walked, what you walked into, whether the block had power. One quest per day,
//   in a fixed order. That is a demo, not a game, and it is the honest way to
//   have a playable day before the casting layer is wired.
//
// EVERY BUTTON IS THE QUEST'S OWN WORDS. A resolution option's label is the
// verbatim @LOG line of the stage it leads to -- not prose I wrote about it.
// Inventing choice text would be filling in canon Paolo reserved, and it would be
// unverifiable; taking his line makes each button a claim the gate can check
// against the .bq byte for byte, which is what gates/dayloop_gate.js does.
//
// NIGHTFALL IS THE STAKE, AND IT IS HIS STAKE, NOT ONE I INVENTED. Each of these
// quests already ships a FAIL stage its author wrote for exactly this: you did
// not resolve it in time. So when the day ends with the quest unresolved, the
// quest's own FAIL branch fires and its own line goes in the reckoning. The day
// loop gets real teeth without a single invented number, and NO DAMAGE BEFORE
// THE DIAL still holds.
//
// REUSE CHECK: cooks no graphic pixels of any kind. It draws nothing; it binds
// existing canon quest text to existing world events, and opens no bank.
(function (root) {
  'use strict';

  /* THE THREE DEMO DAYS. Chosen because the world can actually satisfy them
     today, which is the only honest reason to pick a quest for a demo:
       day 1  the block browns out       -> the world HAS a 12% clustered power
                                            grid, so an unlit block is real
       day 2  make his place solid       -> the world HAS houses with doors you
                                            can now walk into
       day 3  move the crate by dark     -> the world HAS districts to cross
     Stage numbers, tags and every line of text come from the .bq files. */
  var DAYS = [
    {
      day: 1, id: 'bq_meter_reader', file: 'S01_THE_METER_READER',
      brief: 'The block loses half its light at the same hour every night.',
      open: 10,
      advance: { stage: 20, on: 'enter_building', require: 'dark' },
      choiceAt: 20, choices: [30, 31, 32], fail: 33
    },
    {
      day: 2, id: 'bq_back_door', file: 'S09_THE_BACK_DOOR',
      brief: 'The man behind the fence wants his place solid before dark.',
      open: 10,
      advance: null,
      choiceAt: 10, choiceOn: 'enter_building', choices: [20, 21], fail: 22
    },
    {
      day: 3, id: 'bq_same_crate', file: 'S02_THE_SAME_CRATE_TWICE',
      brief: 'Move a crate of salvaged batteries to the red block by dark.',
      open: 10,
      advance: { stage: 20, on: 'enter_district', require: 'new' },
      choiceAt: 20, choices: [30, 31, 32], fail: 33
    }
  ];

  /* the @LOG line of a stage, verbatim, straight off the parsed quest */
  function stageLog(Q, n) {
    var st = (Q.stages || []).filter(function (s) { return s.n === n; })[0];
    return st ? (st.log || '') : '';
  }
  function stageTags(Q, n) {
    var st = (Q.stages || []).filter(function (s) { return s.n === n; })[0];
    return st ? (st.tags || []).slice() : [];
  }

  function make(cfg) {
    cfg = cfg || {};
    var BQ = cfg.BQ || root.BQ;
    var RT = cfg.BQRuntime || root.BQRuntime;
    var SRC = cfg.sources || {};          // file stem -> raw .bq text
    var loop = cfg.loop || null;
    var shared = cfg.shared || { bonds: {} };

    var D = { V: 1, shared: shared, active: null, spec: null, Q: null, rt: null, pending: null, seenDistricts: {} };

    D.specForDay = function (day) {
      if (!DAYS.length) return null;
      return DAYS[(Math.max(1, day) - 1) % DAYS.length];
    };

    /* open the day's quest. Returns the brief, or null if its text is missing
       (a demo with a quest that will not parse must SAY so, never pretend). */
    D.openDay = function (day) {
      D.pending = null;
      var spec = D.specForDay(day);
      D.spec = spec; D.active = null; D.Q = null; D.rt = null;
      if (!spec) return null;
      var text = SRC[spec.file];
      if (!text || !BQ || !RT) return null;
      var Q;
      try { Q = BQ.parse(text); } catch (e) { return null; }
      D.Q = Q;
      D.rt = new RT.Runtime(Q, null, shared);
      D.rt.start(spec.open);
      D.active = spec.id;
      if (loop) loop.stage(spec.id, spec.open, stageLog(Q, spec.open), null);
      if (spec.choiceAt === spec.open) D.pending = D.choiceCard();
      return { id: spec.id, title: Q.title || spec.id, brief: spec.brief,
               objectives: D.rt.objectives(), log: stageLog(Q, spec.open) };
    };

    /* THE CARD: every option is the destination stage's own @LOG, verbatim. */
    D.choiceCard = function () {
      if (!D.spec || !D.Q) return null;
      var Q = D.Q;
      return {
        id: D.spec.id,
        title: Q.title || D.spec.id,
        options: D.spec.choices.map(function (n) {
          return { stage: n, text: stageLog(Q, n), tags: stageTags(Q, n) };
        })
      };
    };

    /* a world event. `what` carries {district, dark, building}. */
    D.event = function (kind, what) {
      what = what || {};
      if (!D.rt || !D.spec || D.rt.state.done) return null;
      var sp = D.spec;

      if (kind === 'enter_district' && what.district) {
        var isNew = !D.seenDistricts[what.district];
        D.seenDistricts[what.district] = true;
        if (sp.advance && sp.advance.on === 'enter_district' &&
            (sp.advance.require !== 'new' || isNew) && D.rt.state.stage < sp.advance.stage) {
          return D._toStage(sp.advance.stage);
        }
        return null;
      }

      if (kind === 'enter_building') {
        if (sp.choiceOn === 'enter_building' && D.rt.state.stage === sp.choiceAt && !D.pending) {
          D.pending = D.choiceCard();
          return { card: D.pending };
        }
        if (sp.advance && sp.advance.on === 'enter_building' &&
            (sp.advance.require !== 'dark' || what.dark === true) &&
            D.rt.state.stage < sp.advance.stage) {
          return D._toStage(sp.advance.stage);
        }
      }
      return null;
    };

    D._toStage = function (n) {
      D.rt.setStage(n);
      var log = stageLog(D.Q, n);
      if (loop) loop.stage(D.spec.id, n, log, (stageTags(D.Q, n)[0] || null));
      var out = { stage: n, log: log, objectives: D.rt.objectives() };
      if (D.spec.choiceAt === n) { D.pending = D.choiceCard(); out.card = D.pending; }
      return out;
    };

    /* the player picks a resolution */
    D.resolve = function (stageN) {
      if (!D.rt || !D.spec) return null;
      if (D.spec.choices.indexOf(stageN) < 0) return null;
      D.pending = null;
      return D._toStage(stageN);
    };

    /* NIGHTFALL on an unresolved quest fires the quest's OWN fail stage. */
    D.nightfall = function () {
      if (!D.rt || !D.spec || D.rt.state.done) return null;
      D.pending = null;
      return D._toStage(D.spec.fail);
    };

    D.objectives = function () { return D.rt ? D.rt.objectives() : []; };
    D.done = function () { return !!(D.rt && D.rt.state.done); };
    D.outcome = function () { return D.rt ? D.rt.state.outcome : null; };
    D.tags = function () { return D.rt ? (D.rt.state.doneTags || []) : []; };

    /* the one line the HUD shows: the live objective, or the outcome */
    D.hudLine = function () {
      if (!D.rt) return '';
      if (D.rt.state.done) return (D.rt.state.outcome === 'COMPLETE' ? 'DONE · ' : 'FAILED · ') + (D.Q.title || '');
      var objs = D.rt.objectives().filter(function (o) { return o.status === 'active'; });
      if (objs.length) return objs[0].text;
      return D.spec ? D.spec.brief : '';
    };

    D.serialize = function () {
      return { v: 1, day: D.spec ? D.spec.day : 0, id: D.active,
               state: D.rt ? D.rt.state : null, seen: D.seenDistricts, shared: shared };
    };
    D.restore = function (st, day) {
      if (!st || st.v !== 1) return false;
      D.seenDistricts = st.seen || {};
      if (st.shared) { shared = st.shared; D.shared = shared; }
      var spec = D.specForDay(day || 1);
      if (!spec || !SRC[spec.file] || !BQ || !RT) return false;
      D.spec = spec; D.Q = BQ.parse(SRC[spec.file]);
      D.rt = new RT.Runtime(D.Q, st.state || null, shared);
      D.active = spec.id;
      if (!st.state) D.rt.start(spec.open);
      return true;
    };

    return D;
  }

  var API = { make: make, DAYS: DAYS, VERSION: 'demoquests-1.0.0' };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaDemoQuests = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
