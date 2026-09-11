// BOHEMIA POWER BUILDINGS — THE ONES THAT MAKE BATTERIES (9/11/26, WORLD lane)
// Board row [batteries mined] / BUILDINGS-MAKE-BATTERIES.
//
// ============================================================================
// HIS RULING, 9/5, LOCKED, WORD FOR WORD
// ============================================================================
//   "there could be ways where you auto-mine batteries, set up certain buildings
//    wherever you're doing and that's just more batteries."
//   and, on what money is for: "do you need batteries to turn a laptop on? no."
//
// NOBODY SELLS CURRENCY. Batteries are MADE, by buildings you put down.
//
// ============================================================================
// THIS CLOSES A PENDING THAT THE PIPE ITSELF LEFT OPEN, AND NAMED
// ============================================================================
// engine/bohemia_production.js (9/5, LIFE+CITY) wired every placed building to
// pay on the wake beat, and wrote in its own header:
//
//   "WHICH buildings make electricity or clout INSTEAD is canon nobody has ruled
//    and this file does not guess it: install() never overwrites a row that is
//    already there, so the moment he names one it wins and nothing else changes.
//    [PENDING Paolo: which building types produce electricity or clout.]"
//
//   "DELIBERATELY NOT ELECTRICITY ... making every placed building mint
//    electricity would turn the build button into a printing press."
//
// BOTH OF THOSE WERE RIGHT AND THE SECOND ONE IS STILL RIGHT. He did not rule
// that every building mints batteries; he ruled that CERTAIN buildings do. So
// this names those and leaves the other fifty-six on resources, which is exactly
// the door that module built and the reason it wrote install() to yield.
// A GATE MUST NEVER OUTRANK A RULING (Paolo 8/1): the caution was correct on the
// morning it was written and is answered by the ruling made the same day.
//
// ============================================================================
// WHICH BUILDINGS, AND WHY IT IS NOT A LIST I MADE UP
// ============================================================================
// His words name the kind of thing: "a generator, a solar rack, a wind rig; real
// things that make electricity in a desert". MAP LAW says Claude never designs
// map layouts, so no district is invented here. These are the three electrical
// districts HIS OWN overmap enum already has AND the BUILD button can already
// place, and the map's own comments say what each one is for:
//
//   solar        the field that makes it. His "solar rack".
//   battery      "Battery farm (H): solar without storage dies every night"
//   substation   "SUBSTATIONS: solar -> city distribution nodes"
//
// MAKE IT, HOLD IT, MOVE IT. That is the whole chain a desert grid needs and the
// map already draws all three. Every row below quotes the map's own line for
// itself, so if the map changes its mind the quote stops matching and the gate
// says so.
//
// *** MEASURED AND WRITTEN DOWN RATHER THAN GLOSSED: TWO OF HIS THREE EXAMPLES
// HAVE NO DISTRICT. *** There is no `generator` and no `wind` in the enum's 79
// kinds. Adding either is MAP CONTENT, which is his and DIRECTION's, not this
// lane's, so this ships the three that exist and names the gap instead of
// quietly inventing two districts to match a sentence.
//
// ============================================================================
// WHAT EACH ONE YIELDS, AND THE ONE IS HIS
// ============================================================================
// 8/15, LOCKED: "just make everything cost one." 9/4, LOCKED: the one is
// denominated in a battery. So a power building makes ONE battery a day. The
// amount is not passed in and cannot be: a caller that could pass 2 would be a
// place for a number nobody ruled to enter the game. When he tunes, he tunes the
// purse's own table.
//
// AND NOTHING HERE CAPS ANYTHING, BECAUSE THERE IS NOTHING TO CAP. The
// coordinator's 9/6 amendment asks that what a building earns while the player is
// away be capped, so coming back is worth something instead of collecting a
// timer. MEASURED: the production tick is keyed on the day and refuses a day it
// has already paid, and this game owns no wall clock at all (NO BACKGROUND
// TICKING, his pacing ruling). Ten in-game days can pass and exactly one day is
// ever paid. The cap the amendment asks for is already the architecture; the gate
// holds it so it cannot regress.
//
// node: require('./bohemia_powerbuild.js')   Gate: gates/batteries_mined_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  function PURSE() {
    if (HASREQ) { try { return require('./bohemia_purse.js'); } catch (e) { return null; } }
    return root.BohemiaPurse || (typeof BohemiaPurse !== 'undefined' ? BohemiaPurse : null);
  }
  function EDIT() {
    if (HASREQ) { try { return require('./bohemia_cityedit.js'); } catch (e) { return null; } }
    return root.BohemiaCityEdit || (typeof BohemiaCityEdit !== 'undefined' ? BohemiaCityEdit : null);
  }

  var RULING = '9/5 BUILDINGS MAKE BATTERIES + 8/15 EVERYTHING COSTS ONE';
  var CURRENCY = 'electricity';
  var AMOUNT = 1;

  /* THE CHAIN, IN THE MAP'S OWN WORDS. `why` is quoted from the overmap so a
     reader can check it, and the gate checks it too -- a quotation that is not
     verbatim is the same defect as a number that is not measured. */
  var POWER = {
    solar:      { makes: 'generates',   why: 'the solar field' },
    battery:    { makes: 'stores',      why: 'solar without storage dies every night' },
    substation: { makes: 'distributes', why: 'solar -> city distribution nodes' }
  };

  /* HIS EXAMPLES THAT THE MAP HAS NO DISTRICT FOR. Kept as data rather than as a
     comment so the gate can assert they are still absent, and so the day somebody
     adds one the list stops being true out loud. */
  var NO_DISTRICT_YET = ['generator', 'wind'];

  function has(o, k) { return o && Object.prototype.hasOwnProperty.call(o, k); }

  /* WHICH OF THE POWER KINDS THE BUILD BUTTON CAN ACTUALLY PLACE. Read off
     buildableTypes, never typed: a power district he makes unbuildable stops
     minting the same hour, and one he makes buildable starts. */
  function kinds(DISTRICT) {
    var CE = EDIT(); if (!CE || typeof CE.buildableTypes !== 'function') return [];
    var t = CE.buildableTypes(DISTRICT) || [], out = [];
    for (var i = 0; i < t.length; i++) if (has(POWER, t[i])) out.push(t[i]);
    return out.sort();
  }

  /* ------------------------------------------------------------------------
     PUT THE YIELD IN THE PURSE'S OWN TABLE.
     *** THIS MUST RUN BEFORE BohemiaProduction.install(). *** That function
     fills every buildable type with the default resources row and never
     overwrites a row that is already there -- which is precisely the door it
     wrote for this ruling. Installed after it, every row would already exist and
     this would silently do nothing: a no-op that looks exactly like a feature.
     The caller's order is load-bearing and the gate proves it both ways.
     ------------------------------------------------------------------------ */
  function install(DISTRICT) {
    var P = PURSE();
    if (!P || !P.PRODUCTION) return { installed: 0, kept: 0, kinds: [] };
    var ks = kinds(DISTRICT), added = 0, kept = 0;
    for (var i = 0; i < ks.length; i++) {
      /* SKIP A KIND WITH NO ROW RATHER THAN THROW. Measured while mutation-testing
         this file: if kinds() and POWER ever disagree, reading POWER[k].makes
         throws -- and the walked surface calls install() inside a try/catch, so
         the whole table would silently go uninstalled and every building would
         quietly fall back to resources. A silent catch around a real error is a
         bug that looks exactly like a feature not being there. */
      if (!has(POWER, ks[i])) continue;
      if (has(P.PRODUCTION, ks[i])) { kept++; continue; }   /* his ruling always wins */
      var row = { ruling: RULING, tuned: false, draft: true,
                  power: POWER[ks[i]].makes, why: POWER[ks[i]].why };
      row[CURRENCY] = AMOUNT;
      P.PRODUCTION[ks[i]] = row;
      added++;
    }
    return { installed: added, kept: kept, kinds: ks };
  }

  /* WHETHER A PLACED BUILDING IS ONE OF THEM, for anything that wants to say so
     to the player. */
  function isPower(type) { return has(POWER, type); }

  /* WHAT HE HAS PUT DOWN THAT MAKES BATTERIES. Reads the builder's own delta
     through the production module's own idea of a building, so a 4-lot span is
     one building here exactly as it is there. */
  function mine(edits) {
    var PR = (HASREQ ? (function () { try { return require('./bohemia_production.js'); }
                                      catch (e) { return null; } })()
                     : (root.BohemiaProduction || null));
    if (!PR || typeof PR.placed !== 'function') return [];
    var b = PR.placed(edits) || [], out = [];
    for (var i = 0; i < b.length; i++) if (isPower(b[i].type)) out.push(b[i]);
    return out;
  }

  /* THE SENTENCE A PLAYER IS TOLD. draft:true. */
  function say(n) {
    if (!n) return '';
    return n === 1 ? 'one of your buildings made a battery'
                   : (n + ' of your buildings made batteries');
  }

  var API = { POWER: POWER, NO_DISTRICT_YET: NO_DISTRICT_YET, RULING: RULING,
              CURRENCY: CURRENCY, AMOUNT: AMOUNT,
              kinds: kinds, install: install, isPower: isPower, mine: mine, say: say };
  if (HASREQ) module.exports = API;
  root.BohemiaPowerBuild = API;
})(typeof window !== 'undefined' ? window
   : (typeof globalThis !== 'undefined' ? globalThis : this));
