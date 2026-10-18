// BOHEMIA ACT STATE -- HOW MUCH OF THE VALLEY WORKS IN EACH ACT, AS DATA
// (10/9/26, DYNASTY lane, board row [the act's power and ruin]).
// The second votes (9/24): the game starts in the ruin and the future gets better;
// rule 73: lights only where the block has power. This is the one table the three
// acts' valley reads: how much of the grid is lit, how many places stand, and what
// the market stocks (act one medieval, act three techy). LIFE+CITY and WORLD READ
// it; this file draws nothing and owns no ledger.
//
// MECHANISM IS MINE, NUMBERS ARE HIS (draft:true on every row, a modder edits ROWS
// and nothing else moves). ACT 1 IS THE MEASURED FLOOR, NOT A GUESS: litFraction
// 0.12 is bohemia_powergrid's own default, so the demo (act one) is unchanged.
// Acts 2 and 3 are drafts that only ever ADD to the floor and are then SCALED BY
// WHAT THE FAMILY DID: bohemia_future.derive() says how many places the ledgers
// raised or tore down (signed), and a ruin the family caused stays a ruin.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* draft:true. lit = the share of the valley's circuits with power if the family
     did nothing; reach = how much of the gap to full a great past can close;
     market = what the stalls stock, cheapest first. */
  var ROWS = {
    1: { era: 'medieval', litFraction: 0.12, reach: 0,    draft: true,
         market: ['grain', 'water', 'rope', 'iron tools', 'lamp oil', 'salt'] },
    2: { era: 'rebuilt',  litFraction: 0.20, reach: 0.35, draft: true,
         market: ['grain', 'water', 'cells', 'wire', 'solar film', 'medicine', 'iron tools'] },
    3: { era: 'techy',    litFraction: 0.30, reach: 0.55, draft: true,
         market: ['cells', 'chips', 'solar film', 'medicine', 'printed parts', 'grain', 'water'] }
  };
  /* places standing that count as "a great past" (one more than this and reach is
     fully used). A draft, TUNING's to replace. */
  var FULL_PAST = 40;

  function num(x, d) { x = +x; return (x === x && isFinite(x)) ? x : d; }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function row(act) {
    act = num(act, 1) | 0;
    return ROWS[act < 1 ? 1 : act > 3 ? 3 : act];
  }

  /* the share of circuits lit in this act. `net` is the signed places the family
     raised minus tore down THROUGH this act (bohemia_future's `went.standing`).
     A past that only tore down pulls it BELOW the act's own base, never below the
     act-one floor of 0, and act one itself never moves (the demo is act one). */
  function litFraction(act, net) {
    var r = row(act);
    if (r === ROWS[1]) return r.litFraction;
    var f = num(net, 0) / FULL_PAST;
    var lit = f >= 0 ? r.litFraction + (1 - r.litFraction) * r.reach * clamp01(f)
                     : r.litFraction * (1 + Math.max(-1, f));
    return Math.round(clamp01(lit) * 1000) / 1000;
  }

  /* one answer per act for a surface: era, lit share, the market, and a valley with
     its lit count scaled. layout = {cells, lit, standing, people} from the seed. */
  function stateOf(act, layout, net) {
    var r = row(act), a = act | 0 || 1;
    var cells = layout ? num(layout.cells, 0) | 0 : 0;
    var base = layout ? num(layout.lit, 0) : 0;
    var frac = litFraction(a, net);
    var out = { act: a < 1 ? 1 : a > 3 ? 3 : a, era: r.era, litFraction: frac,
                market: r.market.slice(), draft: true };
    if (layout) {
      var floorFrac = ROWS[1].litFraction;
      out.lit = Math.round(base * (floorFrac > 0 ? frac / floorFrac : 1));
      if (out.lit > cells) out.lit = cells;
      out.standing = (num(layout.standing, 0) | 0) + (num(net, 0) | 0);
    }
    return out;
  }

  /* is this good on the stalls in this act (a modder-facing question) */
  function stocks(act, good) { return row(act).market.indexOf(String(good)) >= 0; }

  var API = { ROWS: ROWS, FULL_PAST: FULL_PAST, litFraction: litFraction, stateOf: stateOf, stocks: stocks };
  if (HASREQ) module.exports = API;
  root.BohemiaActState = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
