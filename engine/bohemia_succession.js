// BOHEMIA SUCCESSION — the world routes around the body. (8/11/26, WORLD lane.)
//
// THE SIGNATURE MECHANIC, locked in architecture 7/1 and never built:
// laws/BOHEMIA_ADDENDUM_SUCCESSION_AND_BUNKERGUY_7_1_26.md
//
//   "you can kill or remove anyone. When you do, the world does NOT freeze or silently
//    reassign, it runs a POWER STRUGGLE to fill the vacancy, and the struggle plays out
//    over REAL TIME (turns, even decades)... Society survived the apocalypse but CHANGED,
//    and it keeps changing around the holes you tear in it."
//
// Kill-anyone was already ruled. This is what makes it mean something: nothing here decides
// WHO anybody is, it decides what happens to a job when the person doing it stops.
//
// THE THREE PIECES, straight out of the addendum, and each one is here because leaving it
// out is a known failure mode:
//
//  1. ROLES, NOT NPC-POINTERS (the Bethesda alias model). A role stores REQUIREMENTS and
//     conditions, never a hardcoded person. Actors are matched in at runtime, so killing a
//     holder writes a delta and the role simply re-queries. A system that stores the person
//     IS the soft-lock: the pointer dangles and the thread dies with the body.
//
//  2. A VACANCY IS A CONTESTED EVENT WITH A WINNER, not silent reassignment. Kill the
//     moderate and the vacuum can be filled by a hardliner who now hates you, or the
//     faction can fracture, or a rival can absorb the seat. Silent reassignment is the
//     version of this that teaches the player nothing.
//
//  3. IT TAKES TIME, ON A FUSE. Paolo, LOCKED: "the struggle PLAYS OUT over time, not
//     instant... the crazy story consequences intentionally bloom in decade 2 and 3." So a
//     vacancy opens, warns, and RESOLVES LATER -- resolvable on the forward-compute while
//     the player is elsewhere, which is what lets a hole you tore in gen 1 still be shaping
//     who your grandchild deals with in gen 3.
//
// ANTI-SOFT-LOCK IS THE HARD REQUIREMENT AND IT NEEDS BOTH HALVES (the addendum names
// Skyrim's radiant quests as the counterexample that ships the bug):
//     a FALLBACK PATH  -- living claimants first, then a replacement the faction sends, but
//                         only if the faction still has bodies to send; and
//     a GRACEFUL CLOSE -- when nobody can fill it, the thread CLOSES with a consequence
//                         ripple, never an error. That closure IS the kill-everything
//                         endpoint expressed locally.
// A role with neither is a soft-lock generator. This module cannot produce one: `tick`
// either fills, waits, or closes, and every path is a state the world can carry forever.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S, held exactly:
//   ROLES ships EMPTY. Who holds power in this valley, what the seats are called, which
//   factions contest them -- all his, and PEOPLE's dossiers supply the bodies. This file
//   knows how a seat empties and refills. It does not know one seat's name.
//
// THE TWO OPEN FORKS ARE HIS AND ARE NOT DECIDED HERE (they are named as forks in the
// addendum's own OPEN FORKS section, so answering one by picking a default would be canon
// nobody ruled):
//   REOPEN_CLOSED -- does a closed thread ever reopen if a faction recovers over a
//     generation? Default null = PERMANENT, because permanence is the behaviour the locked
//     text already describes ("never an error", the endpoint expressed locally) and
//     reopening is the speculative addition. The switch exists so his answer is one line.
//   SPAWN_REPLACEMENTS -- may a role pull a spawned replacement, or only NPCs already
//     alive? Default null = LIVING ONLY. His recorded leaning is "both", but a leaning is
//     not a ruling, and the difference is exactly how fast the valley refills itself.
// Both are asked out loud by `pending()` rather than silently assumed.
(function (root) {
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  var NO_RULING = 'NO_RULING';

  /* THE REGISTRY. Empty, and it stays empty until he names a seat. */
  var ROLES = {};              // roleId -> {faction, requires:[], weight:{}}  [PENDING Paolo]

  /* HIS TWO FORKS. Null means unruled; the safe behaviour is used and said out loud. */
  var REOPEN_CLOSED = null;    // [PENDING Paolo, fork 1]
  var SPAWN_REPLACEMENTS = null; // [PENDING Paolo, fork 2]

  var VACANT = 'VACANT', CONTESTED = 'CONTESTED', HELD = 'HELD', CLOSED = 'CLOSED';

  /* A FUSE, NOT AN INSTANT. The addendum locks that a struggle takes time; the LENGTH of a
     struggle is a tuning number, not canon, so it is derived from how contested the seat is
     rather than typed: one claimant settles fast, five fight for a long time. */
  function fuseFor(nClaimants) {
    return nClaimants <= 1 ? 2 : 2 + nClaimants * 3;
  }

  function hash(a, b) {
    var h = ((a >>> 0) * 0x9E3779B1 + (b >>> 0) * 0x85EBCA6B) >>> 0;
    h ^= h >>> 16; h = Math.imul(h, 0x85EBCA6B) >>> 0;
    h ^= h >>> 13; h = Math.imul(h, 0xC2B2AE35) >>> 0;
    h ^= h >>> 16;
    return h >>> 0;
  }

  function create(opts) {
    opts = opts || {};
    return { day: opts.day || 0, seats: {}, log: [] };
  }

  /* Open a seat. `spec` is the ROLE (requirements), never a person. A caller may pass a
     spec inline -- that is how PEOPLE's dossiers supply canon without this file holding
     any -- and if it names a registered role the registry wins. */
  function seat(state, roleId, spec) {
    var reg = Object.prototype.hasOwnProperty.call(ROLES, roleId) ? ROLES[roleId] : null;
    var s = {
      role: roleId, spec: reg || spec || null, status: VACANT,
      holder: null, since: state.day, fuse: null, claimants: [], closedWhy: null
    };
    state.seats[roleId] = s;
    return s;
  }

  /* THE HOLE. A holder dies, leaves, or is removed -- the world does not freeze and does
     not silently reassign. It opens a contest. */
  function vacate(state, roleId, why) {
    var s = state.seats[roleId];
    if (!s) return { applied: false, reason: 'NO_SEAT' };
    if (s.status === CLOSED) return { applied: false, reason: 'CLOSED' };
    var was = s.holder;
    s.holder = null;
    s.status = VACANT;
    s.since = state.day;
    s.claimants = [];
    s.fuse = null;
    state.log.push({ day: state.day, role: roleId, event: 'vacated', who: was, why: why || null });
    return { applied: true, was: was, status: s.status };
  }

  /* Somebody puts themselves forward. A claim carries the WEIGHT the world already
     computed -- faction standing, economics, everything the player did -- and this module
     does not invent any of it. */
  function claim(state, roleId, who, weight) {
    var s = state.seats[roleId];
    if (!s || s.status === CLOSED || s.status === HELD) return { applied: false };
    if (s.claimants.some(function (c) { return c.who === who; })) return { applied: false, reason: 'ALREADY' };
    s.claimants.push({ who: who, weight: +weight || 0 });
    if (s.status === VACANT) {
      s.status = CONTESTED;
      s.fuse = state.day + fuseFor(s.claimants.length);
      state.log.push({ day: state.day, role: roleId, event: 'contested', fuse: s.fuse });
    } else {
      s.fuse = state.day + fuseFor(s.claimants.length);   // a new challenger extends it
    }
    return { applied: true, claimants: s.claimants.length, resolvesOn: s.fuse };
  }

  /* THE FORWARD COMPUTE. Advance to a day; every fuse that has burned down resolves.
     This is what lets a struggle finish while the player is a hundred miles away. */
  function tick(state, toDay) {
    var out = [];
    var day = Math.max(state.day, toDay || state.day);
    for (var id in state.seats) {
      if (!Object.prototype.hasOwnProperty.call(state.seats, id)) continue;
      var s = state.seats[id];
      if (s.status !== CONTESTED || s.fuse == null || day < s.fuse) continue;
      out.push(resolve(state, id, day));
    }
    state.day = day;
    return out;
  }

  /* THE STRUGGLE RESOLVES, AND SOMEBODY WINS. Weight decides it; the hash only breaks ties,
     so the outcome is a consequence of what the player did and not of a dice roll. */
  function resolve(state, roleId, day) {
    var s = state.seats[roleId];
    if (!s || s.status === CLOSED) return { role: roleId, applied: false };
    var live = s.claimants.slice();
    if (!live.length) return close(state, roleId, 'NOBODY_LEFT_TO_SEND', day);
    live.sort(function (a, b) {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return hash(a.who ? String(a.who).length : 0, 1) - hash(b.who ? String(b.who).length : 0, 1);
    });
    var winner = live[0];
    s.holder = winner.who;
    s.status = HELD;
    s.since = day;
    s.fuse = null;
    var beaten = live.slice(1).map(function (c) { return c.who; });
    s.claimants = [];
    state.log.push({ day: day, role: roleId, event: 'filled', who: winner.who, beat: beaten });
    /* THE RIPPLE. Who LOST is the interesting half -- a hardliner who was passed over is
       exactly the person the addendum says fills the next vacuum hating you. It is reported,
       never acted on here: what a loser DOES is faction canon and not this file's business. */
    return { role: roleId, applied: true, filled: winner.who, passedOver: beaten, day: day };
  }

  /* GRACEFUL CLOSE -- never an error. When a faction is bled dry enough that nobody can
     fill a seat, the thread closes and the world carries that closure forever. The
     addendum: "that closure IS the kill-everything endpoint expressed locally." */
  function close(state, roleId, why, day) {
    var s = state.seats[roleId];
    if (!s) return { role: roleId, applied: false };
    s.status = CLOSED;
    s.holder = null;
    s.fuse = null;
    s.closedWhy = why || 'NOBODY_LEFT_TO_SEND';
    s.since = day == null ? state.day : day;
    state.log.push({ day: s.since, role: roleId, event: 'closed', why: s.closedWhy });
    return { role: roleId, applied: true, closed: true, why: s.closedWhy };
  }

  /* Can a closed seat come back? HIS FORK, and unruled, so the answer is the permanent one
     and it says why rather than pretending it decided. */
  function reopen(state, roleId) {
    if (REOPEN_CLOSED !== true) {
      return { applied: false, reason: NO_RULING, fork: 'REOPEN_CLOSED',
               about: 'whether a closed thread reopens when a faction recovers is Paolo\'s '
                    + 'call (succession addendum, OPEN FORKS); permanent until he rules' };
    }
    var s = state.seats[roleId];
    if (!s || s.status !== CLOSED) return { applied: false };
    s.status = VACANT; s.closedWhy = null; s.since = state.day;
    state.log.push({ day: state.day, role: roleId, event: 'reopened' });
    return { applied: true };
  }

  /* THE ANTI-SOFT-LOCK PROOF, callable. Every seat is in a state the world can carry
     forever: held, waiting on a fuse that will fire, or closed. A seat that is VACANT with
     no claimants and no fuse is the soft-lock shape, and it cannot survive a tick. */
  function stuck(state) {
    var bad = [];
    for (var id in state.seats) {
      if (!Object.prototype.hasOwnProperty.call(state.seats, id)) continue;
      var s = state.seats[id];
      if (s.status === VACANT && !s.claimants.length && s.fuse == null) bad.push(id);
      if (s.status === CONTESTED && s.fuse == null) bad.push(id);
    }
    return bad;
  }

  /* Nobody came forward and the fuse never got lit: the world must still move on. Called by
     the host when a vacancy has gone unclaimed long enough that the faction has visibly
     failed to produce anyone -- which is the fallback half of the anti-soft-lock rule. */
  function sweep(state, patienceDays) {
    var p = patienceDays == null ? 30 : patienceDays;
    var out = [];
    for (var id in state.seats) {
      if (!Object.prototype.hasOwnProperty.call(state.seats, id)) continue;
      var s = state.seats[id];
      if (s.status !== VACANT) continue;
      if (state.day - s.since < p) continue;
      if (SPAWN_REPLACEMENTS === true) {
        // his fork 2, if he ever rules it: the faction sends somebody new
        out.push({ role: id, wouldSpawn: true, reason: NO_RULING, fork: 'SPAWN_REPLACEMENTS' });
        continue;
      }
      out.push(close(state, id, 'NOBODY_LEFT_TO_SEND'));
    }
    return out;
  }

  /* What is still his. Named, so it can never be quietly defaulted. */
  function pending() {
    return [
      { key: 'ROLES', empty: Object.keys(ROLES).length === 0,
        about: 'which seats of power exist and who holds them is Paolo\'s canon; PEOPLE\'s '
             + 'dossiers supply the bodies' },
      { key: 'REOPEN_CLOSED', value: REOPEN_CLOSED,
        about: 'does a closed thread reopen if a faction recovers over a generation? '
             + '(succession addendum, OPEN FORKS). Permanent until ruled.' },
      { key: 'SPAWN_REPLACEMENTS', value: SPAWN_REPLACEMENTS,
        about: 'may a role pull a spawned replacement, or only NPCs already alive? '
             + 'His recorded leaning is "both", but a leaning is not a ruling. Living only '
             + 'until ruled.' }
    ];
  }

  var API = {
    ROLES: ROLES, VACANT: VACANT, CONTESTED: CONTESTED, HELD: HELD, CLOSED: CLOSED,
    REOPEN_CLOSED: REOPEN_CLOSED, SPAWN_REPLACEMENTS: SPAWN_REPLACEMENTS,
    NO_RULING: NO_RULING, fuseFor: fuseFor,
    create: create, seat: seat, vacate: vacate, claim: claim, tick: tick,
    resolve: resolve, close: close, reopen: reopen, stuck: stuck, sweep: sweep,
    pending: pending
  };
  if (HASREQ) module.exports = API;
  root.BohemiaSuccession = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
