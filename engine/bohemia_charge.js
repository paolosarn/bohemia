// BOHEMIA CHARGE — MFS CHARGE BATTERIES (9/22/26, WORLD lane)
// Board row [people charge] / MFS-CHARGE-BATTERIES.
//
// ============================================================================
// HIS RULING, IN HIS WORDS, KILLING AN ITEM OF MINE
// ============================================================================
//   "Mfs charge batteries bro. i know buildings can help in our game but jesus
//    christ mfs can charge batteries"
//                               -- Paolo 9/21, voting THE RULES RUN WITH THE DIRT down
//
// He is right and the build was wrong. MEASURED, in the walked city, before
// changing anything:
//
//     cellsNightlyCharge() is the ONLY thing in this game that makes a battery.
//     It walks the lit circuits, finds the FACTION that holds that ground, and
//     credits that faction one battery, with the reason string 'a day on a live
//     wire'. A PERSON NEVER MAKES ONE. THE PLAYER NEVER MAKES ONE.
//
// So the valley's entire money supply was minted by fourteen outfits holding
// wire, and every human being in Las Vegas was locked out of the one act that
// creates money. That is not an economy, it is a faucet with a guest list.
//
// ============================================================================
// AND IT CORRECTS SOMETHING THIS LANE SHIPPED LAST ROUND
// ============================================================================
// [full shelves] built THE DAY THE MONEY DIES on the premise that the valley can
// be spent down to no batteries. It can -- every purchase destroys the cell --
// but the reason it stays dead was "only a building can put one back". WITH HIS
// RULING THAT IS FALSE. The valley cannot run out of CELLS while anybody has a
// rig and a source.
//
// THE BEAT SURVIVES AND GETS BETTER: the money dies when THE CHARGE dies, not
// when the cells do. A valley with no sun on the panels and no lit wire is a
// valley with no money, and that is a thing the player can see coming and act
// on. The correction is written into bohemia_aftermoney's own head this round
// rather than left to contradict him quietly.
//
// ============================================================================
// THE PHYSICS IS MINE AND IT IS NOT TUNABLE. THE RIGS ARE HIS.
// ============================================================================
// Every number below is a real-world measurement or arithmetic on one. None of
// it is a balance dial, which is why none of it is his:
//
//   a cell holds            3.75 Wh    (a AA at 1.2 V, 2500 mAh -- the number
//                                       this lane already measured for
//                                       [battery worth], YOU-ARE-BUYING-THE-
//                                       CONTAINER)
//   charger efficiency      0.70       (a cheap trickle charger, wall to cell)
//   peak sun in the Mojave  5 h/day    (Las Vegas is among the sunniest places
//                                       in the United States; peak-sun-hours is
//                                       the standard way that is stated)
//
// *** AND A NUMBER I AM FLAGGING RATHER THAN BURYING. *** Run that arithmetic on
// an ordinary 10 W folding panel and you get 10 x 5 x 0.7 = 35 Wh a day, which is
// NINE AND A THIRD CELLS. A day's work pays ONE. Nine a day from a panel would
// end EVERYTHING COSTS ONE inside a week.
//
// THE SUN IS NOT THE BOTTLENECK AND PRETENDING IT IS WOULD BE THE LIE. The real
// limit on charging AA cells has never been daylight, it is THE CHARGER: a bay
// holds one cell, a cheap four-bay charger does four at a time, and a full slow
// charge takes most of a day. So a rig's output is ITS BAYS, and the sun only
// decides whether the bays run at all. That is both the honest physics and the
// answer that keeps his pillar, and it is the manager's call under correct-after
// rather than a question in his queue.
//
// THE RIG TABLE SHIPS EMPTY except what has a ruling (8/15). His ruling is "mfs
// can charge batteries", not "a rig makes four a day", so WHO OWNS A RIG is
// content and this module refuses rather than inventing an owner.
(function (root) {
  'use strict';

  var DRAFT = true;

  /* ---- THE REAL WORLD, SOURCED, NOT TUNED -------------------------------- */
  var WH_PER_CELL = 3.75;      /* a AA at 1.2 V, 2500 mAh */
  var EFFICIENCY  = 0.70;      /* cheap charger, wall to cell */
  var PEAK_SUN_H  = 5;         /* Mojave peak-sun-hours a day */
  var SOURCE_OF   = 'AA cell capacity, charger efficiency, and Las Vegas peak-sun-hours';

  /* ---- WHERE THE POWER CAN COME FROM ------------------------------------
     Three, and all three already exist in this game. Nothing invented:
       grid   a lit circuit you can reach. bohemia_powergrid decides lit.
       own    a power building you placed. [own power], 9/12, took you off the
              block's line; this is the same building doing the other half.
       sun    a panel. The Mojave's own number.
     A source that is not one of these is REFUSED, because "I charged it
     somehow" is how a faucet gets into an economy by accident. */
  var SOURCES = {
    grid: { id: 'grid', needs: 'a lit circuit you can reach', steady: true },
    own:  { id: 'own',  needs: 'a power building you placed', steady: true },
    sun:  { id: 'sun',  needs: 'a panel and daylight',        steady: false,
            hoursPerDay: PEAK_SUN_H }
  };

  /* ---- THE RIGS. EMPTY, AND IT SAYS WHY ----------------------------------
     A rig is BAYS and WATTS. Who owns one is content and he has not ruled it,
     so nothing is in here and rigFor() answers NO_RULING rather than handing
     somebody a charger the game never gave them. */
  var RIGS = {};

  function wattsToCells(watts, hours) {
    var wh = (watts || 0) * (hours || 0) * EFFICIENCY;
    return wh / WH_PER_CELL;
  }

  /* --------------------------------------------------------------------------
     WHAT A RIG MAKES IN A DAY.

     *** THE BAYS ARE THE CEILING, NOT THE SUN. *** A bay holds one cell and a
     slow charge is most of a day, so a four-bay rig makes four cells a day no
     matter how much power is pushed at it. The watts only decide whether the
     bays are fed at all: a rig that cannot even fill its bays makes fewer.

     This is the line that keeps EVERYTHING COSTS ONE alive, and it is the real
     constraint rather than a dial, which is why it is written as arithmetic on
     bays and not as a number somebody picked.
     -------------------------------------------------------------------------- */
  function perDay(rig, source) {
    if (!rig || !(rig.bays > 0)) return { known: false, why: 'NO_RIG' };
    var s = SOURCES[source && source.id ? source.id : source];
    if (!s) return { known: false, why: 'NO_SOURCE' };

    var hours = s.steady ? 24 : (s.hoursPerDay || 0);
    var couldFeed = wattsToCells(rig.watts, hours);
    /* what the bays can turn over in a day: one cell per bay per slow charge,
       and a slow charge is most of a day, so one turn. */
    var bays = rig.bays;
    var cells = Math.min(bays, Math.floor(couldFeed));
    return {
      known: true, cells: cells, bays: bays, couldFeed: +couldFeed.toFixed(2),
      limitedBy: (couldFeed < bays) ? 'POWER' : 'BAYS',
      source: s.id, draft: DRAFT
    };
  }

  /* WHOSE RIG. Empty by ruling; this refuses rather than inventing an owner. */
  function rigFor(who) {
    if (!who) return { known: false, why: 'NOBODY_ASKED_ABOUT' };
    if (Object.prototype.hasOwnProperty.call(RIGS, who)) {
      return { known: true, rig: RIGS[who], draft: DRAFT };
    }
    return { known: false, why: 'NO_RULING', table: 'RIGS',
             note: 'who owns a charging rig is content and has not been ruled' };
  }

  /* --------------------------------------------------------------------------
     *** A BUILDING HELPS. IT DOES NOT OWN THE ACT. ***
     That sentence is his, almost word for word, and it is the whole row. So a
     building is expressed as WHAT IT ADDS to a person's own charging, never as
     the thing that permits it: take every building in the valley away and a
     person with a rig and a source still charges.

     A building's help is BAYS, because bays are the ceiling. A charging shed
     is a room full of bays; that is what a building is FOR here.
     -------------------------------------------------------------------------- */
  function withBuilding(rig, building) {
    if (!rig || !(rig.bays > 0)) return { known: false, why: 'NO_RIG' };
    var add = (building && building.bays > 0) ? building.bays : 0;
    return { known: true, bays: rig.bays + add, watts: (rig.watts || 0) +
             ((building && building.watts) || 0),
             helped: add > 0, draft: DRAFT };
  }

  /* --------------------------------------------------------------------------
     CAN THIS PERSON CHARGE AT ALL. The row in one question.

     A PERSON, not a faction. The whole defect this row names is that the act
     was a faction's, so nothing here takes a faction and nothing here asks who
     holds the ground.
     -------------------------------------------------------------------------- */
  function canCharge(opts) {
    opts = opts || {};
    var r = opts.rig || null;
    if (!r) {
      var got = rigFor(opts.who);
      if (!got.known) return { can: false, why: got.why, table: got.table || null };
      r = got.rig;
    }
    if (!(r.bays > 0)) return { can: false, why: 'A_RIG_WITH_NO_BAYS_IS_NOT_A_RIG' };
    var s = SOURCES[opts.source && opts.source.id ? opts.source.id : opts.source];
    if (!s) return { can: false, why: 'NO_SOURCE',
                     sources: Object.keys(SOURCES) };
    var day = perDay(opts.building ? withBuilding(r, opts.building) : r, s);
    if (!day.known) return { can: false, why: day.why };
    return { can: day.cells > 0, cells: day.cells, limitedBy: day.limitedBy,
             source: s.id, needs: s.needs,
             helped: !!opts.building, draft: DRAFT };
  }

  /* what the physics says, for a record or a gate that wants to show its work */
  function physics() {
    return { whPerCell: WH_PER_CELL, efficiency: EFFICIENCY,
             peakSunHours: PEAK_SUN_H, source: SOURCE_OF, draft: DRAFT };
  }

  var API = {
    SOURCES: SOURCES, RIGS: RIGS,
    WH_PER_CELL: WH_PER_CELL, EFFICIENCY: EFFICIENCY, PEAK_SUN_H: PEAK_SUN_H,
    wattsToCells: wattsToCells,
    perDay: perDay, rigFor: rigFor, withBuilding: withBuilding,
    canCharge: canCharge, physics: physics,
    draft: DRAFT
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (root) root.BohemiaCharge = API;
  return API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
