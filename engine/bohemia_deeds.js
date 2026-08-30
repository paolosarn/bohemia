// BOHEMIA DEEDS — THE BRIDGE FROM A QUEST OUTCOME TO WHO ACTUALLY SAW IT
// (8/6/26, PEOPLE lane. Reads canon, invents nothing.)
//
// ===== THE HOLE, IN ONE SENTENCE =====
// Paolo's quest corpus ALREADY writes down how big a deed was (`@DO faction REDS +12`)
// AND how loud it was (`#quiet` / `#notable` / `#risky` / `#reckless`), and the loud
// half only ever reached the VANITY FOLLOWER COUNT. The faction standing got applied
// godlike: the number moved, valley-wide, instantly, and NOBODY HAD SEEN ANYTHING.
//
// So today a back-yard handshake and a public humiliation in front of a whole block
// are worth the same to a faction. They are not the same. His own 7/21 law already
// says so — RECKLESS BEATS QUIET — it just never got applied to anything except a
// follower number.
//
// THIS MODULE IS THAT LAW, APPLIED TO REPUTATION.
//   the ±N  ->  HOW MUCH the deed weighs   (already his, already authored)
//   the tag ->  HOW FAR the news carries   (already his, already authored)
// One is the deed. The other is the audience. They were never the same axis, and the
// corpus has always authored them separately (S17 stage 30 is a #quiet +5; stage 33
// is a #reckless -15). Nothing here is a new decision. It is two of his own columns
// finally being read by the same organ.
//
// ===== REUSE CHECK (REUSE-FIRST, Paolo 7/22) =====
// Opened, in code, and used:
//   engine/bohemia_bq.js       — the real .bq parser. Stages, @DO lines, #tags all
//                                come out of HIS parser. This file does not re-parse
//                                the quest format and does not own a second copy of it.
//   engine/bohemia_loop.js     — CLOUT_WEIGHTS {quiet:8,notable:25,risky:55,reckless:110}
//                                and CLOUT_NEUTRAL:15 are READ FROM THERE, never retyped.
//                                If he retunes them (the 7/21 law says the numbers are
//                                tunable and only the ORDERING is locked), reach and
//                                hops retune with them on the next boot, for free.
//   engine/bohemia_standing.js — the witness/gossip/decay organ. Already built, already
//                                gated at 35 claims. This adds NO reputation math.
//   quests/bq/*.bq             — the 82 authored faction deltas and their clout tags.
//                                (Said 59 and 69 until 8/28, when it was counted through
//                                scanQuest itself: 82 deltas across 25 of 27 quests, every
//                                one of them tagged -- notable 28, reckless 23, quiet 16,
//                                risky 15. He kept writing; the banner did not.)
// Nothing was cooked. Every number below is either his, or derived from his with the
// derivation written down.
//
// ===== MECHANISM-MINE / CONTENTS-PAOLO'S, kept to the letter =====
// bohemia_standing.js STILL SHIPS ITS DEED_WEIGHT TABLE EMPTY and its own gate still
// asserts that. This module FILLS it at load — by SCANNING HIS FILES. There is not one
// hand-typed row anywhere in here, and no faction is named in this file either. If the
// corpus is empty the table is empty and the organ stays inert, exactly as before.
(function (root) {
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var BQ   = HASREQ ? require('./bohemia_bq.js')       : (root.BQ || null);
  var S    = HASREQ ? require('./bohemia_standing.js') : (root.BohemiaStanding || null);
  /* THE TABLE, FROM WHEREVER IT IS REACHABLE, AND IT IS THE SAME TABLE.
     (8/21.) This used to demand BohemiaLoop, and the error it threw was right
     about the rule and wrong about the address: bohemia_loop.js is 75 KB and
     throws at load without six other modules, so a surface that wanted four
     numbers had to drag in most of the engine. Three of them retyped the row
     instead, which is exactly the second copy this error was written to prevent.
     The table now lives alone in bohemia_clout.js with no dependencies, and
     bohemia_loop.js READS it rather than declaring it -- so LOOP.cloutWeight and
     CLOUT.cloutWeight are the same four numbers by construction, not by luck.
     Preferring the standalone module is what lets the walked city have loudness
     for 13 KB instead of the whole engine. The throw survives for the case it
     always meant: NEITHER is present, so there is no table at all. */
  var LOOP  = HASREQ ? require('./bohemia_loop.js')  : (root.BohemiaLoop  || null);
  var CLOUT = HASREQ ? require('./bohemia_clout.js') : (root.BohemiaClout || null);

  /* ---- HIS COLUMN 2: HOW LOUD. Read, never retyped. --------------------- */
  function cloutWeight(tag) {
    var src = CLOUT || LOOP;
    if (!src) throw new Error('bohemia_deeds needs the CLOUT scale (bohemia_clout.js, or bohemia_loop.js which reads it); there is no second copy of that table on purpose');
    return src.cloutWeight(tag);
  }
  function neutralWeight() { return cloutWeight(null); }   // his CLOUT_NEUTRAL, 15

  /* WHICH TAG A STAGE CARRIES -- AND THE SAME FALLBACK cloutWeight ALREADY HAD.
     (8/28.) cloutWeight was taught to prefer the standalone bohemia_clout.js on
     8/21, precisely so a surface wanting four numbers would not have to drag in
     75 KB of bohemia_loop.js. scanQuest was not: it went on calling
     LOOP.cloutTagFrom directly.

     THAT IS WHY THIS BRIDGE HAD NEVER RUN ANYWHERE A PLAYER COULD REACH. The
     walked city loads BohemiaClout and NOT BohemiaLoop, so LOOP is null there
     and scanQuest threw `Cannot read properties of null (reading
     'cloutTagFrom')` on its first line -- which means loadCorpus could never
     have filled the table, and publishStage could never have published, on the
     one surface any of it was for. Both modules export the same function; the
     half-applied fix is the whole bug. */
  function cloutTagFrom(tags) {
    var src = CLOUT || LOOP;
    if (!src) throw new Error('bohemia_deeds needs the CLOUT scale (bohemia_clout.js, or bohemia_loop.js which reads it); there is no second copy of that table on purpose');
    return src.cloutTagFrom(tags);
  }

  /* ---- REACH: HOW FAR A THING CARRIES ------------------------------------
     The only genuinely new math in this file, and it is one line with a real
     reason under it.

     A clout weight is, in effect, HOW MANY PEOPLE CARE. A crowd of that many
     people does not stand in a line — it occupies an AREA. Area grows with the
     count, so the RADIUS grows with its SQUARE ROOT. That is not a game-feel
     knob, it is the geometry of people standing outdoors.

     reach = SEE_RANGE * sqrt(cloutWeight / CLOUT_NEUTRAL)

     THREE THINGS FALL OUT OF IT, AND ALL THREE ARE WHY IT IS THE RIGHT CURVE:

     1. AN UNTAGGED DEED LANDS EXACTLY ON SEE_RANGE. sqrt(15/15) = 1. The default
        case is bit-for-bit the behaviour standing.js already had, so the tag can
        only ever move you OFF the old number, never silently redefine it.
     2. RECKLESS IS ~2.7x THE SIGHTLINE, NOT 13.75x. Straight linear scaling on his
        weights would have made one loud act visible across 124 tiles — most of the
        valley — and news would teleport again, which is the exact failure the whole
        witness organ exists to kill. The square root keeps news travelling at the
        speed of PEOPLE.
     3. HIS LOCKED ORDERING SURVIVES. sqrt is monotonic, so reckless > risky >
        notable > quiet holds no matter how he retunes the weights. The gate checks
        this against the live table rather than against numbers baked in here. */
  function reachOf(tag) {
    return Math.round(S.SEE_RANGE * Math.sqrt(cloutWeight(tag) / neutralWeight()));
  }

  /* ---- HOPS: HOW MANY TIMES IT GETS RETOLD --------------------------------
     Same curve, same reason, and this is the half that makes the DYNASTY work.

     standing.js already states the generational law in its own comments:
       "A QUIET GOOD DEED DIES WITH THE WITNESS.
        A NOTORIOUS ONE BECOMES THE THING YOUR CHILD IS JUDGED FOR."
     ...because inherit() only carries a deed forward if hops > 0 — if somebody
     RETOLD it. But until now NOTHING IN THE GAME PRODUCED THE DIFFERENCE: every
     deed got the same hop budget, so "quiet" and "notorious" were the same word.
     The clout tag is the thing that was missing. A #quiet deed gets ONE hop, so
     it usually dies with the people who watched it. A #reckless one gets five,
     so it is still being repeated by someone alive in thirty years.

     Untagged lands exactly on MAX_HOPS, same identity guarantee as reach. */
  function hopsFor(tag) {
    return Math.round(S.MAX_HOPS * Math.sqrt(cloutWeight(tag) / neutralWeight()));
  }

  /* ---- THE UNITS CONVERSION, AND WHY IT IS NOT A KNOB ---------------------
     His quest deltas run on the quest scale (the corpus's biggest single act is
     |20|, measured 8/28; this said |18|). standing.js's rungs run on the opinion scale (HOSTILE/-3, COLD/-1,
     NEUTRAL/1, WARM/3 — boundaries two apart). Something has to convert, and a
     conversion factor picked by feel is an invented constant pretending to be
     mechanism. So it is DERIVED, from a rule you can argue with in English:

       THE BIGGEST THING A QUEST CAN DO, DONE IN FRONT OF THE ENTIRE FACTION,
       MOVES YOU EXACTLY ONE RUNG.

     divisor = (largest |delta| in the corpus) / (rung step)
     Today: 20 / 2 = 10. (This comment said 18 until 8/28, when the corpus was
     measured through this very function and answered 20 -- he wrote a bigger
     deed at some point and the prose did not follow. The number is DERIVED at
     load and was never wrong; only the sentence describing it was, which is the
     exact rot that makes a stale comment worse than no comment.) It is measured from his files at load, so if he ever writes
     a bigger deed the whole scale re-normalises itself and the rule still holds.
     Nothing to retune by hand, ever. */
  var RUNG_STEP = (function () {
    var r = S.RUNGS, best = Infinity;
    for (var i = 1; i < r.length - 1; i++) best = Math.min(best, r[i][1] - r[i - 1][1]);
    return best;
  })();

  /* ---- THE CORPUS SCAN ----------------------------------------------------
     Every faction delta he has ever authored, with the clout tag of the stage it
     sits on. This is the whole contents layer and it is entirely read.

     ONE ACT, TWO MEANINGS — and the corpus was already saying this out loud.
     S17 stage 32 is `faction CARAVANS +12` AND `faction BLUES -6`: taking the
     credit is a good customer to the traders and a betrayal to the growers. It is
     ONE thing that happened. So it is recorded as one event with a per-faction
     face: a Caravanner standing there remembers the version that touched them, a
     Blue remembers theirs, and a Red standing in the same street remembers NOTHING,
     because the Reds genuinely do not care who buys seed. That is zero-sum for
     free, and it is why the deed kind carries the faction in it. */
  function scanQuest(src, fallbackId) {
    var q = BQ.parse(src);
    var out = [];
    for (var i = 0; i < q.stages.length; i++) {
      var st = q.stages[i];
      var tag = cloutTagFrom(st.tags);
      for (var j = 0; j < st.dos.length; j++) {
        var m = /^faction\s+([A-Za-z_]+)\s+([-+]?\d+)\s*$/.exec(st.dos[j].text);
        if (!m) continue;
        out.push({
          quest: q.id || fallbackId || '?',
          stage: st.n,
          faction: m[1],
          delta: parseInt(m[2], 10),
          clout: tag,                       // null = untagged, scores CLOUT_NEUTRAL
          kind: 'q:' + (q.id || fallbackId || '?') + ':' + st.n + '@' + m[1],
          label: st.log || '',
        });
      }
    }
    return out;
  }

  /* Load a whole corpus of already-read sources: [{id, src}, ...]. Kept free of
     any filesystem call so the same function runs in node and in a browser page
     with the quests inlined. */
  function loadCorpus(sources) {
    var deeds = [];
    for (var i = 0; i < sources.length; i++) {
      deeds = deeds.concat(scanQuest(sources[i].src, sources[i].id));
    }
    var maxAbs = 0;
    for (var k = 0; k < deeds.length; k++) maxAbs = Math.max(maxAbs, Math.abs(deeds[k].delta));
    var divisor = maxAbs ? (maxAbs / RUNG_STEP) : 1;

    /* FILL HIS TABLE. standing.js exports DEED_WEIGHT by reference and ships it
       empty; this is the only thing in the codebase that puts rows in it, and
       every row traces to a line number in one of his .bq files. */
    var labels = {};
    for (var d = 0; d < deeds.length; d++) {
      S.DEED_WEIGHT[deeds[d].kind] = deeds[d].delta / divisor;
      labels[deeds[d].kind] = deeds[d].label;
    }
    LABELS = labels;
    return { deeds: deeds, divisor: divisor, maxAbs: maxAbs, rungStep: RUNG_STEP, count: deeds.length };
  }
  var LABELS = {};

  /* ---- PUBLISH: THE ACTUAL BRIDGE ----------------------------------------
     A quest stage resolved at (x,y). Instead of writing a number into a ledger
     nobody witnessed, this puts the event into the heads of the people who were
     standing there — as far as its own loudness carries, with the hop budget its
     own loudness earned. Returns who saw what, which is the honest answer to the
     question the old code could not even ask: DID ANYBODY NOTICE?

     Nothing is stored anywhere else. There is still no faction ledger; a faction's
     view of you remains the average of what its people actually saw. */
  /* WHOSE PEOPLE THIS TOUCHED, AND WHY IT IS NOT `===`.
     MEASURED 8/28 over the whole corpus, before this existed: of the 82 faction
     deltas Paolo has authored across quests/bq, a strict === matched TWENTY-THREE.
     The other FIFTY-NINE named a real faction in a different case -- he writes
     `faction TRADES +8` and the canon id in BOHEMIA_faction_graph.json is
     `Trades` -- so the witness predicate below answered false for every person
     alive and the deed went into nobody's head. Silently: publish() would return
     witnesses:0, which is indistinguishable from "nobody was standing there."
     ZERO of the 82 name a faction that does not exist, so this is a matcher that
     was too strict, never content that was wrong. Folding case rescues 59 lines
     of his writing and invents nothing: the name still has to BE a faction. */
  function sameFaction(a, b) {
    if (a == null || b == null) return false;
    return String(a).toUpperCase() === String(b).toUpperCase();
  }
  function publish(minds, turn, actorId, rows, x, y, where, factionOfOwner) {
    var seen = [], total = 0;
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var faction = r.faction;
      var n = S.witness(minds, turn, actorId, r.kind, x, y, where, {
        range: reachOf(r.clout),
        maxHops: hopsFor(r.clout),
        only: function (owner) { return sameFaction(factionOfOwner(owner), faction); },
      });
      seen.push({ faction: faction, kind: r.kind, clout: r.clout, delta: r.delta,
                  reach: reachOf(r.clout), maxHops: hopsFor(r.clout), witnesses: n });
      total += n;
    }
    return { rows: seen, witnesses: total };
  }

  /* Resolve one stage of one already-parsed quest straight into the world. The
     convenience the run lane will actually call. */
  function publishStage(minds, turn, actorId, questSrc, stageN, x, y, where, factionOfOwner, questId) {
    var rows = scanQuest(questSrc, questId).filter(function (r) { return r.stage === stageN; });
    return publish(minds, turn, actorId, rows, x, y, where, factionOfOwner);
  }

  /* ---- WHY THEY FEEL THAT WAY, IN ENGLISH --------------------------------
     becauseOf() returns deed KINDS, which are machine ids. A standing the player
     cannot read is a standing they cannot play around, so the quest's own @LOG
     line — already written, already in his voice — is what gets shown. */
  function sayWhy(minds, faction, actorId, now, factionOfOwner, limit) {
    return S.becauseOf(minds, faction, actorId, now, factionOfOwner, limit)
      .map(function (b) {
        return { who: b.who, force: b.force, heard: b.heard, hops: b.hops,
                 said: LABELS[b.kind] || b.kind };
      });
  }

  var API = {
    reachOf: reachOf, hopsFor: hopsFor, cloutWeight: cloutWeight,
    scanQuest: scanQuest, loadCorpus: loadCorpus,
    publish: publish, publishStage: publishStage, sayWhy: sayWhy,
    sameFaction: sameFaction,
    RUNG_STEP: RUNG_STEP,
    labels: function () { return LABELS; },
  };
  if (HASREQ) module.exports = API; else root.BohemiaDeeds = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
