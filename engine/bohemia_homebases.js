// BOHEMIA — THE FOURTEEN HOME BASES
//
// FACTIONS lane, VAMILY rows [home bases] (the map's marker list) and
// [territory ledger] (RE-AIMED 9/28: the ledger records who holds which HOME BASE).
// 9/28/26. Paolo 9/27 in the tab, rule 37e, laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md s5:
//
//   "Territory colour on the ground is not a mechanic; nobody fights over lines.
//    What the factions ARE on the map: FOURTEEN HOME BASES ... and MANY ROAMING
//    PARTIES ... you meet, fight, raid, trade with or watch pass. A home base can
//    be attacked: taken or ruined; the hard ones late in an act."
//
// THIS IS NOT THE TERRITORY LEDGER COMING BACK UNDER A NEW NAME. That shape was
// 9,216 cells, painted, fought over one lot at a time (engine/bohemia_turfledger.js,
// marked SUPERSEDED 9/28). This is FOURTEEN ENTITIES that are each whole, and a
// base is taken or ruined as a whole. There is no cell here and nothing to paint.
//
// WHAT WAS MEASURED BEFORE THIS FILE, live on the alpha, 9/28:
//   - the 14 seats already carry a real district kind and a tier (Mob a resort,
//     Cartel storage, Church a chapel, Homeless a pump station), off
//     BohemiaTowns.derive(). The bases are those seats; nothing is placed here.
//   - 28 parties roam (14 patrol, 10 caravan, 4 crew), and they are a FIXED
//     ROSTER: bohemia_parties.all() runs once, every party walks to its
//     destination and back for ever, and nothing ever buys one, loses one or
//     replaces one. In Battle Brothers a location BUYS parties out of what it has,
//     sends them out, and is weaker until they return (dev blog #66, and players
//     report a camp sending a group every one to two days). So in ours a base that
//     falls would keep sending its patrols for ever. This module is the missing
//     link: a party exists because its home base still holds it.
//
// WHAT THIS FILE DECIDES, AND WHAT IT DOES NOT.
//   It decides ONE thing the rows name: a base that is not held by its own people
//   sends nobody. Everything else is handed in or read off a module that owns it:
//     the seats and tiers      BohemiaTowns.derive()   (WORLD's, his power column)
//     the parties              BohemiaParties.all()    (WORLD's [parties move])
//     the thirds a hard base   BohemiaTowns.DEPTH      (his own DEPTH thirds)
//     how far through an act   THE CALLER'S. The act's length is not this file's.
//   It does NOT decide what an attack costs or how a fight ends. That is COMBAT's
//   [bb fight] and a ruling of his. The moment the game has a raid it calls took()
//   or ruined(), and a base is a thing that persists per act, which is what rule
//   31's derive reads.
//   AMENDED 10/1 (round 50, the coordinator's note on this row: "a crew arriving at a
//   base you hold is a RAID"): it also keeps the RAID AT YOUR GATE, the one chain QUESTS'
//   QR-R found a siege to be (warning, preparation days, one fight, an outcome), the part
//   that is a LEDGER and not a screen or a fight: when a crew's arrival opens a raid, how
//   many map days the base has, and what the WORLD does if nobody comes (QR-R: "the world
//   may take a base whether the player engages or not, but only after a warning in stated
//   map days"). The two numbers it needs, and the one comparison, are DEFAULTS marked for
//   TUNING's table, not rulings. The offer, the preparation and the fight are RUN's,
//   LIFE+CITY's and COMBAT's; the fight calls closeRaid() with how it ended.
//
// NO TEXT. A marker is ids and classes and numbers. "No text on screen he did not
// ask for" (37e) is enforced at the source: nothing here carries a sentence.
//
// AN OLDER SAVE IS A PLAYABLE SAVE. A blob written before this file existed has no
// ledger and reads as act 1 with every base held by its own faction, which is rule
// 32(b): the game starts in the ruin and act 1 is the floor.
//
// REUSE CHECK. The record shape is bohemia_century's ({V, act, entries[]}, a setAct
// that refuses to run backwards, an entry stamped with its act, day and sequence),
// taken once more, for the same reason it gives: four systems, one idea of a record.
//
// node: require('./bohemia_homebases.js')   Gate: gates/homebases_gate.js
(function (root) {
  'use strict';

  var V = 1;
  var ACT_MIN = 1, ACT_MAX = 3;                 /* three generations, always (37d) */
  var YOU = 'you';                              /* the company: not a faction, and not a node */
  /* THE WAYS A PART CHANGES HANDS, HIS WORDS (rule 43, Paolo 9/29): "raid, contract, boss verb, deal". A
     frozen list, the way the parties module freezes its three agendas: an undeclared fifth way is a design
     change and design changes are Paolo's. `by` is optional (a write with none records null), but a `by`
     that is not one of these is refused by name. */
  var WAYS = ['raid', 'contract', 'boss', 'deal'];
  /* THE RAID CHAIN'S NUMBERS ARE DEFAULTS, NOT RULINGS (QR-R rule 2 suggests four map days of warning; its NOT A FARM
     finding says a base is besieged at most once per act). They are the manager's until TUNING's one table holds them
     (fight-gets-deep law, TUNING: "every number a player feels in ONE table"), and every function that reads one takes
     an `opts` that can replace it, so moving them later changes no code here. */
  var RAID_DEFAULTS = Object.freeze({ prepDays: 4, perAct: 1 });
  /* HOW A RAID CAN END. HELD: the base stood. TAKEN: it changed hands to the crew. RUINED: it fell for good, and in QR-R
     that is the player's own choice on a take contract, never what the world does to a base nobody came to. */
  var OUTCOMES = ['held', 'taken', 'ruined'];

  function clampAct(a) {
    a = a | 0;
    if (a < ACT_MIN) return ACT_MIN;
    if (a > ACT_MAX) return ACT_MAX;
    return a;
  }

  function make(o) {
    o = o || {};
    return { V: V, act: clampAct(o.act == null ? 1 : o.act), entries: [], raids: [] };
  }

  /* THE ACT NEVER RUNS BACKWARDS. Same refusal the century module makes. */
  function setAct(rec, act) {
    var a = clampAct(act);
    if (a > rec.act) rec.act = a;
    return rec.act;
  }

  /* ---- reading -------------------------------------------------------------
     The newest entry at or before `act` says who holds it now. With no entry the
     base is its own faction's, which is what the seed says. */
  function lastOf(rec, base, act) {
    var a = clampAct(act == null ? (rec && rec.act) : act), hit = null;
    var list = (rec && rec.entries) || [];
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (e.base === base && e.act <= a) hit = e;   /* entries are in the order they happened */
    }
    return hit;
  }

  /* who holds it: a faction id, 'you', or null when it is a ruin */
  function heldBy(rec, base, act) {
    var e = lastOf(rec, base, act);
    return e ? e.to : base;
  }

  function isRuin(rec, base, act) {
    var e = lastOf(rec, base, act);
    return !!e && e.how === 'ruined';
  }

  /* WHICH BASES A HOLDER HAS RIGHT NOW, for a rule that reads "a home base you own":
     the flip that unlocks the second generation (rule 39c, default the first home
     base) and building inside a settlement you own (rule 40b). A ruin is nobody's. */
  function ownedBy(rec, seats, who, act) {
    var a = clampAct(act == null ? (rec && rec.act) : act), out = [];
    for (var i = 0; i < (seats || []).length; i++) {
      var f = seats[i] && seats[i].faction;
      if (f && !isRuin(rec, f, a) && heldBy(rec, f, a) === who) out.push(f);
    }
    return out;
  }

  /* ---- writing --------------------------------------------------------------
     `from` is READ, never handed in: unlike a derived grid, the ledger IS the
     source of who holds a base, so a caller that says otherwise is wrong, not a
     second opinion. The one thing a caller must supply is WHICH base and WHO.
     Refused, and told why, never thrown: */
  function put(rec, how, r) {
    r = r || {};
    if (!rec || !r.base) return { applied: false, reason: 'NO_BASE' };
    if (r.by != null && WAYS.indexOf(r.by) < 0) return { applied: false, reason: 'UNKNOWN_WAY' };
    var now = lastOf(rec, r.base, rec.act);
    var ruinAct = (now && now.how === 'ruined') ? now.act : 0;
    var holder = now ? now.to : r.base;
    if (how === 'taken') {
      if (!r.to) return { applied: false, reason: 'NO_TAKER' };
      /* a ruin can be moved into, but only a generation later: the future goes both
         ways (37c), and rebuilding is not something done in the act it fell in */
      if (ruinAct && rec.act <= ruinAct) return { applied: false, reason: 'RUIN_THIS_ACT' };
      if (holder === r.to) return { applied: false, reason: 'NOT_A_CHANGE' };
    } else {
      if (ruinAct) return { applied: false, reason: 'ALREADY_RUIN' };
    }
    var e = {
      n: rec.entries.length + 1,
      act: rec.act,
      day: (typeof r.day === 'number') ? r.day : null,
      base: r.base,
      how: how,
      from: holder,
      to: how === 'ruined' ? null : r.to,
      by: r.by || null,
      why: r.why || null
    };
    rec.entries.push(e);
    return { applied: true, entry: e };
  }
  function took(rec, r) { return put(rec, 'taken', r); }
  function ruined(rec, r) { return put(rec, 'ruined', r); }

  /* ---- what the future reads (rule 31, and 37c "raided falls") ---------------
     Per act, signed and in whole bases: a base you took is +1 to you and -1 to
     whoever held it; a base that fell is -1 to its holder and +1 nowhere. This is
     the arithmetic turfledger.netFor answered for cells, at fourteen. */
  function netFor(rec, act) {
    var out = {}, list = (rec && rec.entries) || [], a = clampAct(act);
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (e.act !== a) continue;
      if (e.to) out[e.to] = (out[e.to] || 0) + 1;
      if (e.from) out[e.from] = (out[e.from] || 0) - 1;
    }
    return out;
  }

  /* how many bases stand as ruins by the end of an act */
  function ruinsThrough(rec, act) {
    var seen = {}, n = 0, list = (rec && rec.entries) || [], a = clampAct(act);
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (e.act > a) continue;
      seen[e.base] = (e.how === 'ruined');
    }
    for (var k in seen) if (Object.prototype.hasOwnProperty.call(seen, k) && seen[k]) n++;
    return n;
  }

  /* ---- THE HARD ONES LATE IN AN ACT -------------------------------------------
     His sentence, as a threshold, off his own DEPTH thirds: a camp can be attacked
     from the start, a town a third of the way through, a fortress two thirds. The
     cut is DEPTH minus the camp's depth, so it moves with the table it comes from
     and nothing is typed here. `progress` is how far through the act the game is,
     0 to 1, and it is the CALLER'S: the length of an act is not this file's to
     invent. Without it the answer is null, never a guess. */
  function TOWNS() {
    if (typeof module !== 'undefined' && module.exports) {
      try { return require('./bohemia_towns.js'); } catch (_e) {}
    }
    return (typeof root !== 'undefined' && root.BohemiaTowns) || null;
  }
  function PARTIES() {
    if (typeof module !== 'undefined' && module.exports) {
      try { return require('./bohemia_parties.js'); } catch (_e) {}
    }
    return (typeof root !== 'undefined' && root.BohemiaParties) || null;
  }
  function openAt(tier) {
    var T = TOWNS(); if (!T || !T.DEPTH) return null;
    var d = Object.prototype.hasOwnProperty.call(T.DEPTH, tier) ? T.DEPTH[tier] : T.DEPTH.camp;
    return d - T.DEPTH.camp;
  }
  function raidable(tier, progress, ruin) {
    if (ruin) return false;                      /* nobody raids a ruin, they move into it */
    if (typeof progress !== 'number') return null;
    var g = openAt(tier);
    return g == null ? null : progress >= g - 1e-9;
  }

  /* ---- THE FOURTEEN --------------------------------------------------------- */
  function stateOf(faction, holder, ruin) {
    if (ruin) return 'ruined';
    if (holder === faction) return 'held';
    if (holder === YOU) return 'yours';
    return 'taken';
  }

  /* seats: BohemiaTowns.derive() rows. One base per seat, in the seats' own order. */
  function bases(seats, rec, act, opts) {
    opts = opts || {};
    var a = clampAct(act == null ? (rec && rec.act) : act), out = [];
    for (var i = 0; i < (seats || []).length; i++) {
      var s = seats[i]; if (!s) continue;
      var ruin = isRuin(rec, s.faction, a);
      var holder = ruin ? null : heldBy(rec, s.faction, a);
      out.push({
        id: 'base:' + s.faction, faction: s.faction, x: s.x, y: s.y,
        kind: s.kind || null, tier: s.tier, power: s.power,
        holder: holder, state: stateOf(s.faction, holder, ruin),
        raidable: raidable(s.tier, opts.progress, ruin)
      });
    }
    return out;
  }

  /* WHO HOLDS A BLOCK, DERIVED, NEVER STORED (rule 43: "you build on the lots of the parts you HOLD"). A block
     belongs to a PART by geography, and a part is held by whoever the ledger says, so a block's holder is those
     two answers laid together. The geography is handed in as `partAt(bx, by)`, which answers {faction} for the
     part a block lies in (the city's turfAt, the node gate's turf grid): THIS MODULE TAKES DATA, NOT A MODULE,
     and it stores nothing per block, so a taking flips a whole part at once and the fought-over painted lot of
     the dead shape stays dead. With an empty ledger a block's holder is its part's own crew, every block. */
  function blockHolder(partAt, rec, bx, by, act) {
    var a = clampAct(act == null ? (rec && rec.act) : act);
    var p = (typeof partAt === 'function') ? partAt(bx, by) : null;
    if (!p || !p.faction) return null;
    var ruin = isRuin(rec, p.faction, a);
    var holder = ruin ? null : heldBy(rec, p.faction, a);
    return { part: p.faction, holder: holder, state: stateOf(p.faction, holder, ruin) };
  }

  /* HOW MANY BLOCKS A HOLDER HOLDS ("a base is every block you hold and can be half the city by act 3"). A
     count over the valley's n by n blocks, asked of the two answers above; nothing is kept. */
  function heldBlocks(partAt, rec, who, n, act) {
    var count = 0, gx, gy, b;
    for (gy = 0; gy < (n | 0); gy++) for (gx = 0; gx < (n | 0); gx++) {
      b = blockHolder(partAt, rec, gx, gy, act);
      if (b && b.holder === who) count++;
    }
    return count;
  }

  /* A PARTY EXISTS BECAUSE ITS BASE STILL HOLDS IT. A base that is a ruin, or held
     by anybody but its own people, sends nobody; what it had out is gone from the
     map. Everything else is untouched, so with an empty ledger this returns the
     parties it was given, unchanged and in order. */
  function partiesLeft(parties, baseList) {
    var byFaction = {}, i;
    for (i = 0; i < (baseList || []).length; i++) byFaction[baseList[i].faction] = baseList[i];
    var kept = [], silenced = [];
    for (i = 0; i < (parties || []).length; i++) {
      var p = parties[i]; if (!p) continue;
      var b = p.from && byFaction[p.from.faction];
      if (b && b.state !== 'held') silenced.push(p); else kept.push(p);
    }
    return { kept: kept, silenced: silenced };
  }

  /* WHERE A PARTY IS WALKING TO RIGHT NOW: out to its destination, or home. */
  function headingOf(p) {
    if (!p || !p.from || !p.to) return null;
    return p.arrived ? { x: p.from.x, y: p.from.y } : { x: p.to.x, y: p.to.y };
  }

  /* WHO IS COMING FOR A BASE. Battle Brothers shows a party's banner and its
     destination line, so a player reads the danger before it arrives. Ours: a crew
     that is out (not on its way home), heading at a base's own cell, and does not
     belong to whoever holds that base. Ids only, sorted, derived from the parties
     that still exist, never stored. This is the "warning on the map" that opens a
     siege (QUESTS QR-R) and it changes nothing by itself. */
  function threatsTo(baseList, keptParties) {
    var out = {}, i, j;
    for (i = 0; i < (baseList || []).length; i++) out[baseList[i].id] = [];
    for (j = 0; j < (keptParties || []).length; j++) {
      var p = keptParties[j];
      if (!p || p.agenda !== 'crew' || p.arrived || !p.to || !p.from) continue;
      for (i = 0; i < baseList.length; i++) {
        var b = baseList[i];
        if (b.state === 'ruined' || b.x !== p.to.x || b.y !== p.to.y) continue;
        if (p.from.faction === b.holder) continue;
        if (out[b.id].indexOf(p.from.faction) < 0) out[b.id].push(p.from.faction);
      }
    }
    for (var k in out) if (Object.prototype.hasOwnProperty.call(out, k)) out[k].sort();
    return out;
  }

  /* ---- THE RAID AT YOUR GATE (rule 43; the coordinator's 10/1 note on this row) ---------------------------------
     QUESTS' QR-R is the research, and its answer is that a siege is no mode: it is a short chain on one base. WARNING (a
     crew walking at it: `threat`, above), then the crew is AT THE GATE and the preparation days run, then ONE FIGHT if the
     company comes, then an OUTCOME written to the base. What follows is the part of that chain which is a LEDGER. It is
     stored, because a raid is history (the next siege of the same base reads it), but it is small: who came, from which
     day, due which day, against whom, and how it ended. The offer, the preparation and the fight are not here. */

  /* ADVANCE THE PARTIES AND SAY WHO GOT WHERE. The parties module sets `arrived` in the step that arrives and turns the
     crew round on the very next step, so a caller that walks many steps in one call (a night's sleep is dozens) can see
     a crew arrive AND leave inside that call and never learn it came. This takes the same steps one at a time, ends in
     EXACTLY the state BohemiaParties.advance would have (the gate compares the two), and returns every arrival in the
     order it happened. It is a drop-in for the call the clock already makes. */
  function advanceWatching(parties, cellsPerDay, days) {
    var P = PARTIES(), out = [];
    if (!P || typeof P.advance !== 'function') return out;
    var steps = Math.max(0, Math.floor((cellsPerDay || 0) * (days == null ? 1 : days)));
    for (var s = 0; s < steps; s++) {
      for (var i = 0; i < (parties || []).length; i++) {
        var p = parties[i]; if (!p) continue;
        var was = !!p.arrived;
        P.advance([p], 1, 1);
        if (!was && p.arrived && p.from && p.to)
          out.push({ id: p.id, agenda: p.agenda, faction: p.from.faction,
                     power: (typeof p.from.power === 'number') ? p.from.power : null,
                     to: { x: p.to.x, y: p.to.y }, step: s });
      }
    }
    return out;
  }

  function ruleOf(opts, key) {
    return (opts && typeof opts[key] === 'number' && opts[key] >= 0) ? opts[key] : RAID_DEFAULTS[key];
  }

  /* how many raids a base has had in an act, open or closed */
  function raidsOn(rec, base, act) {
    var n = 0, list = (rec && rec.raids) || [], a = clampAct(act == null ? (rec && rec.act) : act);
    for (var i = 0; i < list.length; i++) if (list[i].base === base && list[i].act === a) n++;
    return n;
  }

  /* the raid that is open on a base right now, or null; the oldest if a table ever allows two */
  function raidOf(rec, base) {
    var list = (rec && rec.raids) || [];
    for (var i = 0; i < list.length; i++) if (list[i].base === base && list[i].state === 'open') return list[i];
    return null;
  }

  function raidsOpen(rec) {
    var out = [], list = (rec && rec.raids) || [];
    for (var i = 0; i < list.length; i++) if (list[i].state === 'open') out.push(list[i]);
    return out;
  }

  /* WHICH ARRIVALS ARE RAIDS ON A BASE YOU HOLD. A CREW (the agenda that comes to take something; a caravan trades and a
     patrol walks a border) reaching the cell of a base that `who` holds, that is not a ruin, whose own people still hold
     THEIR base (a crew whose home fell is gone, the same rule that silences its party), that can be attacked yet (the
     hard ones late in an act: `progress` is the CALLER's, and none given means the start of an act, camps only), and that
     has not had its raid this act. Derived from the arrivals it is handed, in the order they came; it stores nothing. */
  function raidsFrom(events, seats, rec, who, opts) {
    opts = opts || {};
    var holder = (who == null) ? YOU : who, a = clampAct(rec && rec.act), per = ruleOf(opts, 'perAct');
    var progress = (typeof opts.progress === 'number') ? opts.progress : 0;
    var out = [], seen = {}, i, j;
    for (i = 0; i < (events || []).length; i++) {
      var e = events[i];
      if (!e || e.agenda !== 'crew' || !e.to) continue;
      if (heldBy(rec, e.faction, a) !== e.faction) continue;      /* a ruin answers null, so a fallen home sends nobody */
      for (j = 0; j < (seats || []).length; j++) {
        var s = seats[j];
        if (!s || s.x !== e.to.x || s.y !== e.to.y || s.faction === e.faction) continue;
        if (heldBy(rec, s.faction, a) !== holder) continue;         /* and a ruin is nobody's, so it is never yours to defend */
        if (raidable(s.tier, progress, false) !== true) continue;
        if (raidsOn(rec, s.faction, a) + (seen[s.faction] || 0) >= per) continue;
        seen[s.faction] = (seen[s.faction] || 0) + 1;
        out.push({ base: s.faction, by: e.faction, party: e.id, power: e.power, step: e.step });
      }
    }
    return out;
  }

  /* A CREW IS AT THE GATE: the raid opens and its clock starts. `day` is the caller's map day, and the base is due
     `prepDays` after it. Refused, and told why, never thrown. */
  function openRaid(rec, r, opts) {
    r = r || {};
    if (!rec || !r.base) return { applied: false, reason: 'NO_BASE' };
    if (!r.by) return { applied: false, reason: 'NO_RAIDER' };
    if (typeof r.day !== 'number') return { applied: false, reason: 'NO_DAY' };
    if (!rec.raids) rec.raids = [];
    var a = clampAct(rec.act);
    if (isRuin(rec, r.base, a)) return { applied: false, reason: 'RUIN' };
    var holder = heldBy(rec, r.base, a);
    if (holder === r.by) return { applied: false, reason: 'NOT_A_CHANGE' };
    if (raidsOn(rec, r.base, a) >= ruleOf(opts, 'perAct')) return { applied: false, reason: 'ALREADY_RAIDED' };
    var raid = { n: rec.raids.length + 1, act: a, base: r.base, by: r.by, party: r.party || null,
                 power: (typeof r.power === 'number') ? r.power : null,
                 day: r.day, due: r.day + ruleOf(opts, 'prepDays'), against: holder, state: 'open', end: null };
    rec.raids.push(raid);
    return { applied: true, raid: raid };
  }

  /* HOW A RAID ENDED. The fight calls this with what happened; the world calls it through settle() when nobody came.
     TAKEN writes the base to the crew and RUINED writes the fall, both through the same two writes the rest of the game
     uses, by 'raid'; HELD writes nothing to the bases and only closes the raid. */
  function closeRaid(rec, r) {
    r = r || {};
    if (!rec || !r.base) return { applied: false, reason: 'NO_BASE' };
    if (OUTCOMES.indexOf(r.outcome) < 0) return { applied: false, reason: 'UNKNOWN_OUTCOME' };
    var raid = raidOf(rec, r.base);
    if (!raid) return { applied: false, reason: 'NO_RAID' };
    var day = (typeof r.day === 'number') ? r.day : null, how = r.how || 'fought', wrote = null;
    if (r.outcome === 'taken') {
      wrote = took(rec, { base: raid.base, to: raid.by, by: 'raid', day: day, why: how });
      if (!wrote.applied) return wrote;
    } else if (r.outcome === 'ruined') {
      wrote = ruined(rec, { base: raid.base, by: 'raid', day: day, why: how });
      if (!wrote.applied) return wrote;
    }
    raid.state = r.outcome;
    raid.end = { day: day, how: how };
    return { applied: true, raid: raid, entry: wrote ? wrote.entry : null };
  }

  /* WHAT THE WORLD DOES WHEN NOBODY CAME: the only comparison in the chain, and it is a default for TUNING. A base holds
     if it is at least as strong as the crew, and strength is the number the game already ranks every faction by (the
     act power column, which the parties module hands out unchanged). A tie holds. With no number on either side nothing
     falls: a base is never lost on a guess. */
  function holdsUnattended(basePower, crewPower) {
    if (typeof basePower !== 'number' || typeof crewPower !== 'number') return true;
    return basePower >= crewPower;
  }

  /* THE WORLD'S ANSWER, ON THE DAY IT IS DUE. Every open raid whose day has come and which nobody answered: the base
     holds, or the crew takes it (never a ruin: that is somebody's choice). A raid whose base changed hands or fell in the
     meantime is moot and closes as held. Idempotent: a second call the same day finds nothing open and returns []. */
  function settle(rec, seats, day, opts) {
    opts = opts || {};
    var out = [], list = (rec && rec.raids) || [], bySeat = {}, i;
    for (i = 0; i < (seats || []).length; i++) if (seats[i]) bySeat[seats[i].faction] = seats[i];
    if (typeof day !== 'number') return out;
    for (i = 0; i < list.length; i++) {
      var r = list[i];
      if (r.state !== 'open' || day < r.due) continue;
      var a = clampAct(rec.act), outcome, how;
      if (heldBy(rec, r.base, a) !== r.against) { outcome = 'held'; how = 'moot'; }   /* changed hands or fell: nobody to answer to */
      else {
        var seat = bySeat[r.base] || null;
        var holds = (typeof opts.holds === 'function') ? !!opts.holds(seat, r) : holdsUnattended(seat ? seat.power : null, r.power);
        outcome = holds ? 'held' : 'taken'; how = 'unattended';
      }
      var res = closeRaid(rec, { base: r.base, outcome: outcome, day: day, how: how });
      if (res.applied) out.push({ base: r.base, by: r.by, outcome: outcome, how: how, day: day });
    }
    return out;
  }

  /* THE MAP'S MARKER LIST. Ids, classes and numbers, never a sentence.
       base   : where, whose, what kind of place, how big (tier), its state, whether
                it can be attacked yet, and which crews are heading at it
       party  : where it is now, whose, what it is doing, how strong it looks, where
                it is walking to (the destination line) and which leg it is on
     Drawing is the map's (RUN [bb map], COOK [bb map art]); how big a tier draws is
     theirs. This says what is there. */
  function markers(seats, parties, rec, act, opts) {
    var bl = bases(seats, rec, act, opts), out = [], i;
    var pl = partiesLeft(parties, bl);
    var threats = threatsTo(bl, pl.kept);
    var P = PARTIES();
    for (i = 0; i < bl.length; i++) {
      var b = bl[i];
      var rd = raidOf(rec, b.faction);
      out.push({ kind: 'base', id: b.id, x: b.x, y: b.y, faction: b.faction, holder: b.holder,
                 state: b.state, tier: b.tier, glyph: b.kind, raidable: b.raidable,
                 threat: threats[b.id], raid: rd ? { by: rd.by, due: rd.due } : null });
    }
    for (i = 0; i < pl.kept.length; i++) {
      var p = pl.kept[i];
      out.push({ kind: 'party', id: p.id, x: p.at.x, y: p.at.y, faction: p.from.faction,
                 agenda: p.agenda, strength: (typeof p.from.power === 'number') ? p.from.power : null,
                 to: headingOf(p), leg: (P && P.legOf) ? P.legOf(p) : null });
    }
    return out;
  }

  /* ---- the save ---------------------------------------------------------------- */
  function toJSON(rec) {
    if (!rec) return null;
    return { V: V, act: clampAct(rec.act), entries: (rec.entries || []).slice(),
             raids: (rec.raids || []).map(function (r) { return Object.assign({}, r, { end: r.end ? Object.assign({}, r.end) : null }); }) };
  }
  function load(blob) {
    if (!blob || typeof blob !== 'object') return make();
    var rec = make({ act: blob.act });
    /* the raids first: a blob written before 10/1 has none and reads as no raid ever came */
    var rs = blob.raids;
    if (Object.prototype.toString.call(rs) === '[object Array]') {
      for (var k = 0; k < rs.length; k++) {
        var r = rs[k];
        if (!r || !r.base || !r.by || typeof r.day !== 'number' || typeof r.due !== 'number') continue;
        if (!(r.state === 'open' || OUTCOMES.indexOf(r.state) >= 0)) continue;   /* a state we do not know is junk, never an open raid */
        var st = r.state;
        rec.raids.push({ n: rec.raids.length + 1, act: clampAct(r.act), base: r.base, by: r.by, party: r.party || null,
                         power: (typeof r.power === 'number') ? r.power : null, day: r.day, due: r.due,
                         against: r.against == null ? null : r.against, state: st,
                         end: (st !== 'open' && r.end && typeof r.end === 'object')
                           ? { day: (typeof r.end.day === 'number') ? r.end.day : null, how: r.end.how || null } : null });
      }
    }
    var src = blob.entries;
    if (Object.prototype.toString.call(src) !== '[object Array]') return rec;
    for (var i = 0; i < src.length; i++) {
      var e = src[i];
      if (!e || !e.base || (e.how !== 'taken' && e.how !== 'ruined')) continue;
      rec.entries.push({ n: rec.entries.length + 1, act: clampAct(e.act), day: (typeof e.day === 'number') ? e.day : null,
                         base: e.base, how: e.how, from: e.from == null ? null : e.from,
                         to: e.how === 'ruined' ? null : (e.to == null ? null : e.to),
                         by: (WAYS.indexOf(e.by) >= 0) ? e.by : null, why: e.why || null });
    }
    return rec;
  }

  var API = {
    V: V, YOU: YOU, WAYS: WAYS.slice(), ACT_MIN: ACT_MIN, ACT_MAX: ACT_MAX,
    clampAct: clampAct, make: make, setAct: setAct,
    heldBy: heldBy, isRuin: isRuin, took: took, ruined: ruined,
    netFor: netFor, ruinsThrough: ruinsThrough,
    openAt: openAt, raidable: raidable,
    ownedBy: ownedBy, blockHolder: blockHolder, heldBlocks: heldBlocks, bases: bases, partiesLeft: partiesLeft, threatsTo: threatsTo, markers: markers,
    RAID_DEFAULTS: RAID_DEFAULTS, OUTCOMES: OUTCOMES.slice(),
    advanceWatching: advanceWatching, raidsFrom: raidsFrom, openRaid: openRaid, closeRaid: closeRaid,
    raidsOpen: raidsOpen, raidsOn: raidsOn, holdsUnattended: holdsUnattended, settle: settle,
    toJSON: toJSON, load: load
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaHomeBases = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
