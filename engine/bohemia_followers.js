// BOHEMIA FOLLOWERS -- THE RETINUE (10/1/26, PEOPLE lane, VAMILY [followers])
//
// Battle Brothers hires non-fighting staff at a settlement (scout, surgeon,
// negotiator, blacksmith) for a daily wage, each turning one dial on the
// whole company. Translated per the board row and the 62-row translation
// table: the driver (scout), the fixer (negotiator), the medic (surgeon),
// the mechanic (blacksmith). The beast-handler is [keepers], a separate row.
//
// EVERY NUMBER HERE IS tuned:false. The real Battle Brothers wage and effect
// sizes are Grok ask #9 (reference/BOHEMIA_GROK_ASKS.md), unanswered as of
// this round -- our own machines cannot reach the wiki. What ships is the
// MECHANISM (mechanism-mine, contents-Paolo's): one slot per role, a nightly
// wage in batteries (the real locked currency electricity, since this game's
// three currencies are LOCKED and the six-resource vision is RESEARCH ONLY,
// not code -- records/BOHEMIA_ECONOMY_DAY_55_SIX_THINGS_TWO_LEDGERS_THAT_HAVE_NEVER_MET_9_30_26.md),
// and a declared effect per role. Two of the four effects are wired into a
// real, already-shipped mechanic this round (the driver's travel time, the
// fixer's wage relief on the rest of the crew); the medic and the mechanic's
// effects are declared honestly and left UNWIRED, because the systems they
// would speed up (a wound/injury clock, a repair meter) do not exist in code
// yet -- rule 36b (long injury) is a law, not code, and the economy's own
// 9/30 research found tape is "a flat yes/no switch", not a meter.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  var WAGE = 1; // batteries/night, flat, matching the house style (every upkeep verb debits exactly 1)

  var FOLLOWERS = [
    { id: 'mechanic', bb: 'blacksmith', wage: WAGE, tuned: false,
      ask: "I used to keep machines running for a living. A mechanic, if you want one. A battery a night.",
      hireSays: "The mechanic falls in.",
      unpaidSays: "The mechanic says the batteries dried up, and leaves.",
      changes: { kind: 'repair', mult: null, tuned: false,
        note: "not yet live: this game has a flat plate-spent switch (fight:plate), not a repair meter, so there is nothing yet to make cheaper" } },
    { id: 'medic', bb: 'surgeon', wage: WAGE, tuned: false,
      ask: "I patched people up for a living. A medic, if you want one. A battery a night.",
      hireSays: "The medic falls in.",
      unpaidSays: "The medic says the batteries dried up, and leaves.",
      changes: { kind: 'healing', mult: null, tuned: false,
        note: "not yet live: this game has no wound/injury clock to speed up yet (rule 36b, long injury, is a ruling, not code)" } },
    { id: 'fixer', bb: 'negotiator', wage: WAGE, tuned: false,
      ask: "I can talk a price down, for a cut. A fixer, if you want one. A battery a night.",
      hireSays: "The fixer falls in. The rest of the crew gets paid a little less often now.",
      unpaidSays: "The fixer says the batteries dried up, and leaves.",
      changes: { kind: 'wageRelief', everyNights: 2, tuned: false,
        note: "every OTHER hired follower is only charged every second night instead of every night" } },
    { id: 'driver', bb: 'scout', wage: WAGE, tuned: false,
      ask: "I used to run routes before the roads got bad. A driver, if you want one. A battery a night.",
      hireSays: "The driver falls in. The roads go by quicker now.",
      unpaidSays: "The driver says the batteries dried up, and leaves.",
      changes: { kind: 'travel', mult: 0.85, tuned: false,
        note: "every block crossed on the map costs 15% less time" } }
  ];

  function byId(id) { for (var i = 0; i < FOLLOWERS.length; i++) if (FOLLOWERS[i].id === id) return FOLLOWERS[i]; return null; }

  // which role to offer next, in the board row's own listed order, skipping
  // any already hired AND any already asked (a decline is a free no, never
  // asked twice -- without skipping `asked` too, a single decline on the
  // first role would block every later role forever, since the first unfilled
  // slot would stay the same slot forever). Deterministic: the same
  // (hired, asked) pair always offers the same role.
  function offerFor(hired, asked) {
    hired = hired || {}; asked = asked || {};
    for (var i = 0; i < FOLLOWERS.length; i++) {
      var f = FOLLOWERS[i];
      if (!hired[f.id] && !asked[f.id]) return f.id;
    }
    return null;
  }

  function askLine(id) { var f = byId(id); return f ? f.ask : null; }
  function hireLine(id) { var f = byId(id); return f ? f.hireSays : null; }
  function unpaidLine(id) { var f = byId(id); return f ? f.unpaidSays : null; }

  // a fixer is cheap to keep AROUND -- it never discounts its OWN wage, only
  // every other hired follower's. `tick` is a plain count of how many times
  // wages have been collected (0, 1, 2, ...), NOT the game's own day number:
  // this mechanism owns its own counter so the relief is provable on demand,
  // never dependent on another lane's clock semantics. Returns true the
  // night a wage is actually due.
  function wageDueTonight(id, hired, tick) {
    hired = hired || {}; tick = tick | 0;
    if (id === 'fixer' || !hired.fixer) return true;
    var every = (byId('fixer').changes.everyNights) | 0 || 2;
    return (tick % every) === 0;
  }

  // the real, live effect: the driver's cut on time-per-block. 1 when no
  // driver is hired, so the hook this plugs into is a no-op by default.
  function travelMultiplier(hired) {
    if (hired && hired.driver) { var f = byId('driver'); return (f && typeof f.changes.mult === 'number') ? f.changes.mult : 1; }
    return 1;
  }

  var API = { FOLLOWERS: FOLLOWERS, WAGE: WAGE, byId: byId, offerFor: offerFor,
    askLine: askLine, hireLine: hireLine, unpaidLine: unpaidLine,
    wageDueTonight: wageDueTonight, travelMultiplier: travelMultiplier };
  if (HASREQ) module.exports = API;
  root.BohemiaFollowers = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
