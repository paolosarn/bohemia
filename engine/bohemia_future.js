// BOHEMIA FUTURE — the valley at act 2 and act 3, computed and never authored.
// (9/27/26, WORLD lane, row [future city] ACT-TWO-AND-ACT-THREE-ARE-COMPUTED.)
//
// THE LAW THIS SERVES IS RULE 31 (Paolo 9/23, LOCKED): "play all three at the
// same time and flip through them... see the progress in the future from your
// past action... the city is built like shit because you're not making enough of
// an impact in your earlier act." The future is DERIVED from the earlier acts'
// ledgers on every flip, never hand-placed.
//
// AND RULE 32(b) (Paolo 9/23, on his DOWN vote of THE SAME CORNER, which is the
// sentence that decides the SHAPE of this file): "the future gets better. The
// right side is what the BEGINNING of the game is supposed to look like, and it
// gets better... reclaims parts of cities for economic purposes, more techy and
// modern." ACT 1 IS THE FLOOR. Act 2 and 3 are the floor plus what was reclaimed.
// NOTHING DECAYS BELOW THE START.
//
// *** SO THE ONLY OPERATION IN THIS FILE IS ADD, AND THAT IS ENFORCED RATHER
// THAN INTENDED. *** derive() builds an act by laying reclaim on top of the
// floor and then CHECKS that nothing came out below it, refusing with a name if
// it did. A future that can subtract is a future that can get worse, and he
// ruled it cannot. Writing that as a comment and trusting it is exactly how the
// "nothing decays" clause would rot in six rounds.
//
// ---------------------------------------------------------------------------
// TWO THINGS THIS FILE IS NOT.
//
// IT IS NOT A MAP GENERATOR. The LAYOUT -- the streets, the lot lines, the
// mountains -- is built once from the seed and is the SAME OBJECT in all three
// acts. This file never writes to it, and pins it so nothing downstream can
// (DYNASTY school round two, section 4: "a lot that exists in act 1 exists in
// act 3, always; the derive changes what STANDS on lots and who owns them, never
// where the lots are"). Real cities behave the same way and so does our engine
// already: the street plan is the most persistent thing a town has.
//
// IT IS NOT A CONTENT TABLE. What counts as a poor valley or a rebuilt one is
// his, exactly as bohemia_century's TIERS is his, and LOOKS below ships EMPTY
// and says so. The mechanism is mine; the numbers are his.
// ---------------------------------------------------------------------------
//
// THE READER, AND WHY IT NAMES RATHER THAN ZEROES. DYNASTY round two measured
// that six of the thirteen carry fields are not in the running game at all, and
// ruled that the derive "ships on seven and NAMES a silent field rather than
// zeroing it". A field with no source that contributes 0 is indistinguishable
// from a field with a source that happens to be 0, and the first is a hole while
// the second is a fact. So report() answers UNREAD, by name, with the reason --
// the same three-answer discipline bohemia_strike already uses for HELD /
// BROKEN / NOT_KNOWN.
//
// WHAT IS ACTUALLY ACT-AWARE TODAY, measured rather than assumed (this lane
// 9/23, and it has moved twice since):
//   built      bohemia_century      per-act from the day it was written
//   batteries  bohemia_purse        per-act since WORLD [act stamp] 9/24
//   territory  bohemia_turfledger   per-act since FACTIONS 9/24
//   lived      -- nothing carries an act. UNREAD, by name.
//
// REUSE CHECK: invents no ledger. It asks the three that exist through their own
// per-act readers (through / balanceIn / netFor) and holds the layout by
// reference. The holder-on-top-of-the-seed shape is bohemia_turfledger's
// holderThrough(), taken rather than re-derived, because two answers to "who
// holds this cell" is the drift this repo keeps paying for.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  function DEP(name, global) {
    if (HASREQ) { try { return require('./' + name + '.js'); } catch (e) { return null; } }
    return root[global] || (typeof global !== 'undefined' ? root[global] : null);
  }
  function CENTURY() { return DEP('bohemia_century', 'BohemiaCentury'); }
  function PURSE() { return DEP('bohemia_purse', 'BohemiaPurse'); }
  function TURF() { return DEP('bohemia_turfledger', 'BohemiaTurfLedger'); }

  var ACT_MIN = 1, ACT_MAX = 3;
  var UNREAD = 'UNREAD';

  function clampAct(a) {
    a = a | 0;
    if (a < ACT_MIN) return ACT_MIN;
    if (a > ACT_MAX) return ACT_MAX;
    return a;
  }

  /* WHAT A POOR VALLEY AND A REBUILT ONE LOOK LIKE IS HIS, AND THIS SHIPS EMPTY.
     A row would be {act, need:{built:N, held:N, power:N}, look:'...'}. The moment
     he rules one, looksOf() starts answering instead of refusing. A sensible
     default here would be canon nobody wrote, which is the one thing the
     mechanism/contents split exists to stop. */
  var LOOKS = {};

  /* ---------------------------------------------------------------------------
     THE REPORT CARD. What each act's ledgers say, and what nothing can say.
     --------------------------------------------------------------------------- */

  /* one row per field: either a number with the source that gave it, or UNREAD
     with the reason. Never a bare 0 standing in for "nobody asked". */
  function field(name, source, read) {
    try {
      var v = read();
      if (v == null) return { field: name, why: UNREAD, because: 'the source answered nothing', source: source };
      return { field: name, value: v, source: source };
    } catch (e) {
      return { field: name, why: UNREAD, because: 'the source threw: ' + (e && e.message), source: source };
    }
  }
  function silent(name, because) {
    return { field: name, why: UNREAD, because: because, source: null };
  }

  function report(ledgers, act) {
    ledgers = ledgers || {};
    var a = clampAct(act);
    var C = CENTURY(), P = PURSE(), T = TURF();
    var out = { act: a, fields: [], unread: [] };

    /* BUILT -- the one ledger that has always known its act */
    if (ledgers.century && C) {
      out.fields.push(field('built', 'bohemia_century', function () {
        return C.through(ledgers.century, a).built;
      }));
      out.fields.push(field('housing', 'bohemia_century', function () {
        return C.through(ledgers.century, a).housing;
      }));
    } else {
      out.fields.push(silent('built', 'no century record was handed in'));
      out.fields.push(silent('housing', 'no century record was handed in'));
    }

    /* BATTERIES -- per-act since WORLD [act stamp] */
    if (ledgers.purse && P) {
      out.fields.push(field('batteries', 'bohemia_purse', function () {
        return P.through(ledgers.purse, P.CURRENCIES[0], a);
      }));
    } else {
      out.fields.push(silent('batteries', 'no purse was handed in'));
    }

    /* TERRITORY -- per-act since FACTIONS shipped the turf ledger */
    if (ledgers.turf && T) {
      out.fields.push(field('territory', 'bohemia_turfledger', function () {
        var n = T.netFor(ledgers.turf, a), total = 0, k;
        for (k in n) if (Object.prototype.hasOwnProperty.call(n, k)) total += (n[k] > 0 ? n[k] : 0);
        return total;
      }));
    } else {
      out.fields.push(silent('territory', 'no turf ledger was handed in'));
    }

    /* WHO LIVED -- and this one is silent because NOTHING carries an act, which
       is a measurement this lane made on 9/23 and not a missing argument. */
    out.fields.push(silent('lived',
      'no source in the game stamps who lived with an act (WORLD measured it 9/23)'));

    for (var i = 0; i < out.fields.length; i++)
      if (out.fields[i].why === UNREAD) out.unread.push(out.fields[i].field);
    return out;
  }

  /* ---------------------------------------------------------------------------
     THE DERIVE. The floor, plus what was reclaimed, and never less.
     --------------------------------------------------------------------------- */

  /* THE FLOOR IS ACT 1 AND IT IS NOT MINE TO INVENT. It is whatever the seed's
     own valley gives: streets, the people on them, the cells the grid lights.
     The caller hands it in because the map belongs to the surface, not to this
     file, and inventing one here would make the floor a thing I authored. */
  function floorOf(layout) {
    if (!layout) return null;
    return {
      cells: layout.cells | 0,
      lit: layout.lit | 0,
      standing: layout.standing | 0,
      people: layout.people | 0
    };
  }

  function derive(layout, ledgers, act) {
    if (!layout) return { ok: false, why: 'NO_LAYOUT' };
    var a = clampAct(act);
    var floor = floorOf(layout);
    if (!floor) return { ok: false, why: 'NO_FLOOR' };

    var card = report(ledgers, a);
    var by = {};
    for (var i = 0; i < card.fields.length; i++) {
      var f = card.fields[i];
      if (f.why !== UNREAD) by[f.field] = f.value;
    }

    /* *** THE ONLY OPERATION: ADD. *** Reclaim is what the ledgers say the family
       did THROUGH this act, laid on the floor. A field nobody can read adds
       nothing AND SAYS SO -- it is in card.unread, not folded in as a zero. */
    var reclaimed = {
      standing: (by.built | 0),
      people: (by.housing > 0 ? by.housing : 0),
      lit: 0,          /* what relights a circuit is a price and prices are his */
      cells: 0         /* THE LINES DO NOT MOVE. An act never adds a cell. */
    };

    var out = {
      ok: true, act: a,
      /* THE SAME OBJECT, BY REFERENCE, NEVER A COPY AND NEVER A WRITE. If this
         file returned a clone, a caller could edit "the layout" of one act and
         the lines would quietly differ between them, which is the one thing
         section 4 of DYNASTY's round two forbids. */
      layout: layout,
      floor: floor,
      reclaimed: reclaimed,
      valley: {
        cells: floor.cells + reclaimed.cells,
        lit: floor.lit + reclaimed.lit,
        standing: floor.standing + reclaimed.standing,
        people: floor.people + reclaimed.people
      },
      unread: card.unread.slice(),
      card: card
    };

    /* *** AND THE RULE IS CHECKED, NOT TRUSTED. *** Rule 32(b): nothing decays
       below the start. If any number came out under the floor, this is refused by
       name rather than returned, because a derive that can go down is a future
       that can get worse. */
    var k;
    for (k in out.valley) {
      if (!Object.prototype.hasOwnProperty.call(out.valley, k)) continue;
      if (out.valley[k] < floor[k]) {
        return { ok: false, why: 'WOULD_DECAY_BELOW_THE_FLOOR', field: k,
                 floor: floor[k], would_be: out.valley[k],
                 rule: 'rule 32(b), Paolo 9/23: the game starts in the ruin and the future gets better' };
      }
    }
    /* AND THE LINES REALLY DID NOT MOVE. */
    if (out.valley.cells !== floor.cells) {
      return { ok: false, why: 'THE_LINES_MOVED', floor: floor.cells, would_be: out.valley.cells,
               rule: 'the layout is built once from the seed and no act may write to it' };
    }
    return out;
  }

  /* WHAT AN ACT LOOKS LIKE, and this is the valve that is his. Asked, it answers
     NO_RULING by name and hands back the numbers, so the pipe is finished and
     carries nothing. */
  function looksOf(layout, ledgers, act) {
    var d = derive(layout, ledgers, act);
    if (!d.ok) return d;
    var key = String(d.act);
    if (!Object.prototype.hasOwnProperty.call(LOOKS, key))
      return { reason: 'NO_RULING', table: 'LOOKS', key: key, valley: d.valley,
               about: 'what a poor valley and a rebuilt one look like is Paolo\'s ruling' };
    return { look: LOOKS[key], valley: d.valley };
  }

  /* ONE ROW PER ACT, for a surface that wants to show the whole century, and for
     the flip to compare against. */
  function acts(layout, ledgers) {
    var out = [];
    for (var a = ACT_MIN; a <= ACT_MAX; a++) {
      var d = derive(layout, ledgers, a);
      out.push(d.ok ? { act: a, valley: d.valley, unread: d.unread }
                    : { act: a, why: d.why });
    }
    return out;
  }

  var API = { ACT_MIN: ACT_MIN, ACT_MAX: ACT_MAX, UNREAD: UNREAD, LOOKS: LOOKS,
              clampAct: clampAct, report: report, derive: derive,
              looksOf: looksOf, acts: acts };
  if (HASREQ) module.exports = API;
  root.BohemiaFuture = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
