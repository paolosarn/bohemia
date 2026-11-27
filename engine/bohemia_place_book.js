// BOHEMIA PLACE BOOK -- WHAT A PLACE TAKES IN, WHAT IT SPENDS, AND WHETHER ITS LIGHTS STAY ON (11/27/26, ECONOMY FOUR)
// VAMILY rule 485(b) (Paolo 11/26: 'their world has a running economy vibes'): '... a place that stops earning goes dark and a
// place that earns grows'. ECONOMY THREE's handoff, job 2: 'give WORLD 15 and WORLD 16 a daily take per place (a pure function
// over the pockets and the rent) and the thresholds (dark under N nights of upkeep, growing over M), cited'.
// records/BOHEMIA_ECONOMY_FOUR_A_PLACE_EARNS_OR_GOES_DARK_11_27_26.md
//
// MEASURED FIRST (the demo, valley K7QM9X, 30 map days): every faction's treasury (engine/bohemia_pockets.js) only ever grew
// (Network 652 -> 2,092, Cartel 244 -> 1,354) and not one light in the valley changed: a faction's live wires pay it one a night
// (ruling 9/16) and nothing it holds ever cost it a battery. Six of them (Blues, Homeless, Colorful, Trades, Reds, Volunteers)
// take in nothing at all.
//
// BATTLE BROTHERS' OWN LOOP (reference/library/grok/wiki PAGES_ALL bb_all/0626_Developer Posts.txt): a place gathers resources
// from its business and its caravans and SPENDS them on the parties it sends out ('a raiding party worth 30 points. Now the
// location is down to 70... You can effectively bleed them dry'); 'once a spawnpoint has gathered enough resources it will send
// out a party that will found a new location'; 'villages stop spawning caravans when out of resources'; 'locations restock ...
// with quality and quantity based on their current resources'; 'a really wealthy town will have top tier equip'.
//
// OURS, IN FOUR LINES (every number in records/target/bb/place_book.json, sourced):
//   1. A PLACE'S MEN ON THE ROAD: its parties (engine/bohemia_parties.js), each sized by the days alone (party_math.json roaming
//      base + per_day; a caravan one less, a crew one more), never by his company (a place's costs are its own).
//   2. IT FEEDS THEM: every man out eats a night at the bill's price (nightly_bill.json per_man_per_night), out of its pocket.
//   3. A NIGHT IT CANNOT PAY THEM IN FULL, ONE OF ITS LIVE WIRES GOES DARK (nobody guards it, the copper walks).
//   4. A PLACE WITH A MONTH OF ITS MEN'S KEEP IN THE BANK AND A WEEK THAT PAID FOR ITSELF RELIGHTS ONE WIRE IT LOST, a night;
//      a broke place puts out less, a well-off one more (Battle Brothers' resources setting a town's stock).
//
// Pure functions, no DOM, nothing stored: the caller (the map's nightfall) hands in the pockets' numbers and applies the answer
// to the grid (POWER.douse / relight, which ride the save). node: require('./bohemia_place_book.js')
// Gate: gates/a_place_earns_or_goes_dark_gate.js
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  function num(row, dflt) { return row && typeof row.value === 'number' ? row.value : dflt; }

  /* one party's men on a map day, by the days alone (the roaming table's base and per_day, its min and max); a caravan one less
     (never under two), a crew one more: the map's own partySizeOf without his company's strength or the distance */
  function partyMen(roaming, agenda, day) {
    var R = roaming || {}, base = +R.base || 2, per = +R.per_day || 0, lo = +R.min || 1, hi = +R.max || 99;
    var n = Math.max(lo, Math.min(hi, Math.floor(base + per * Math.max(0, (day | 0) - 1) + 0.5)));
    if (agenda === 'caravan') n = Math.max(2, n - 1); else if (agenda === 'crew') n = n + 1;
    return n;
  }
  /* every place's men on the road tonight: { faction: men } from the map's parties */
  function menOut(roaming, parties, day) {
    var out = {};
    for (var i = 0; i < (parties || []).length; i++) { var p = parties[i]; if (!p || !p.from || !p.from.faction) continue;
      out[p.from.faction] = (out[p.from.faction] || 0) + partyMen(roaming, p.agenda, day); }
    return out;
  }
  /* what its men eat tonight: the night's bill a man (nightly_bill.json per_man_per_night, handed in by the caller: one price for the
     same night everywhere it is bought, so this file types none) */
  function spendOf(perMan, men) { return Math.max(0, Math.round((men | 0) * (+perMan > 0 ? +perMan : 0))); }

  /* ONE PLACE'S NIGHT. p = { reserve (its pocket after tonight's income), take (what came in since last night), men (the days ask
     for), kept (the men it could feed when it last ran short; null: all), perMan (the night's bill a man), lit (its live wires), lost (its wires gone dark by this book), week: [{take, spend}] (the nights before, newest last) }
     Returns { men, want, kept (store it for tomorrow), walked, spend, paid, short, reserve, verdict ('broke' | 'getting_by' | 'well_off'), douse (0 or 1), relight (0 or 1),
               shelf (the town's stock multiplier), nights (its reserve in nights of its men's keep) } */
  function night(file, p) {
    p = p || {};
    /* the men it keeps out: what the days ask for, held to what it could feed when it last ran short (Battle Brothers: 'villages
       stop spawning caravans when out of resources'); a place whose week paid for itself takes one man back on a night */
    var want = Math.max(0, p.men | 0), men = (p.kept != null && p.kept >= 0) ? Math.min(want, p.kept | 0) : want;
    var spend = spendOf(p.perMan, men), have = Math.max(0, +p.reserve || 0), paid = Math.min(spend, Math.floor(have)), short = spend - paid;
    var after = have - paid, nights = spend > 0 ? after / spend : Infinity;
    var wk = (p.week || []).slice(-(num(file && file.week_nights, 7) - 1)).concat([{ take: +p.take || 0, spend: spend }]);
    var wTake = 0, wSpend = 0; for (var i = 0; i < wk.length; i++) { wTake += +wk[i].take || 0; wSpend += +wk[i].spend || 0; }
    var grow = num(file && file.well_off_nights, 30);
    var per = +p.perMan > 0 ? +p.perMan : 1, floorSpend = Math.max(spend, per);   /* a place with nobody out still needs a month of one man in hand */
    var held = (p.kept != null && p.kept >= 0 && (p.kept | 0) < want);   /* it keeps fewer men than the days ask for: still broke */
    /* READY: a month of its men's keep in the bank and a week that paid for itself; it takes a man back on, and relights a wire
       it lost, even while it is still short of men (else a place that let its men go could never take one back) */
    var ready = short === 0 && after >= grow * floorSpend && wTake >= wSpend && wk.length >= num(file && file.week_nights, 7);
    var verdict = short > 0 || (held && !ready) ? 'broke' : (ready && !held ? 'well_off' : 'getting_by');   /* money in hand while it takes its men back: getting by */
    var douse = short > 0 && (p.lit | 0) > 0 ? 1 : 0;
    /* short tonight: it keeps the men its nightly take can feed, the rest walk; well off: it takes one back on */
    var kept = short > 0 ? Math.floor(Math.max(0, +p.take || 0) / per) : (p.kept == null ? null : (ready ? (men + 1 >= want ? null : men + 1) : men));
    var relight = ready && (p.lost | 0) > 0 ? 1 : 0;
    var S = (file && file.shelf && file.shelf.value) || {};
    var shelf = verdict === 'broke' ? (+S.broke || 1) : verdict === 'well_off' ? (+S.well_off || 1) : 1;
    return { men: men, want: want, kept: kept, walked: want - (kept == null ? want : Math.min(want, kept)),
             spend: spend, paid: paid, short: short, reserve: after, verdict: verdict, douse: douse, relight: relight, shelf: shelf,
             nights: isFinite(nights) ? Math.round(nights * 10) / 10 : null, week: wk };
  }

  /* WHICH WIRE GOES FIRST: the one farthest from its seat (the edge of its ground, the last place its men walk), then the
     highest id, so the same valley loses the same wire; WHICH COMES BACK: the nearest it lost */
  function pickDouse(wires, seat) {
    var best = null, bd = -1;
    for (var i = 0; i < (wires || []).length; i++) { var w = wires[i], d = seat ? Math.max(Math.abs(w.x - seat.x), Math.abs(w.y - seat.y)) : 0;
      if (d > bd || (d === bd && w.id > best.id)) { bd = d; best = w; } }
    return best;
  }
  function pickRelight(wires, seat) {
    var best = null, bd = Infinity;
    for (var i = 0; i < (wires || []).length; i++) { var w = wires[i], d = seat ? Math.max(Math.abs(w.x - seat.x), Math.abs(w.y - seat.y)) : 0;
      if (d < bd || (d === bd && w.id < best.id)) { bd = d; best = w; } }
    return best;
  }

  var API = { partyMen: partyMen, menOut: menOut, spendOf: spendOf, night: night, pickDouse: pickDouse, pickRelight: pickRelight };
  if (HASREQ) module.exports = API;
  root.BohemiaPlaceBook = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
