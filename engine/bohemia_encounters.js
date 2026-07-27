/* ============================================================================
   BOHEMIA — THE AMBIENT ENCOUNTER DIRECTOR   (bohemia_encounters.js, 7/27/26)

   APPROVED WORK. records/BOHEMIA_VERDICT_ACT1_ROSTER_7_26_26.txt — Paolo, on the
   12-candidate act-1 roster presented with the anti-boredom pacing package:
   "Approve all". The verdict also says APPROVAL UNLOCKS VOLUME: design build may
   begin. This is that build. Enemy ART is explicitly NOT this item (the verdict
   files it as a separate fresh-look judge under approved-assets-first).

   It was commissioned off one worry of his: "this game could be very boring if
   not done right."

   ----------------------------------------------------------------------------
   THE PACING LAWS HE APPROVED, AND HOW EACH ONE IS HELD
   ----------------------------------------------------------------------------
   70/20/10 — about 70% ambient/vignette, 20% interactive, only 10% forced
     combat. Held by a DEFICIT CHOOSER: the next encounter is drawn from whichever
     class is furthest below its share of what has happened so far. That converges
     on the ratio exactly and it is not dice, which is the next law.

   STORYTELLER BUDGET, NOT DICE — tension spends big when the player is healthy
     and it has been quiet, small after hard fights. Held by a real meter that
     accrues on spent time and drains when it spends. Nothing here rolls: given
     the same world and the same walk you get the same night, every time.

   ~90 SECOND MINIMUM GAP — held as a hard floor before anything may fire.

   DISTRICT + DAY/NIGHT KEY THE TABLE, NO GLOBAL SPAWNS EVER — held by
     construction: there is no global table to fall back to. A district with no
     table spawns NOTHING, and says so.

   RARE IS SACRED — spice tokens carry a hard session cap and cannot repeat.

   ----------------------------------------------------------------------------
   NO BACKGROUND TICKING (Paolo, pacing, recorded in the backlog)
   ----------------------------------------------------------------------------
   This director has NO CLOCK. No timer, no interval, no Date.now, nothing that
   advances while the player stands still. It is PULLED: the world asks it what
   happens as part of a block of time the player actually spent, through the
   encounters socket in engine/bohemia_world_resolve.js. A world that keeps
   rolling at an idle player is the thing the ruling forbids, and the only way to
   be sure is to own no clock at all.

   ----------------------------------------------------------------------------
   MECHANISM-MINE / CONTENTS-PAOLO'S
   ----------------------------------------------------------------------------
   The 12 tokens and the pacing numbers above are APPROVED and therefore real.
   WHICH tokens appear in WHICH district, and how heavily, is NOT ruled anywhere,
   so there is no such table in here: the caller supplies it and an absent one
   means silence. The reserved act-2 roster (mountain lion, the named casino cat,
   cannibal crew, micro-drone swarm, construction-bot siege, toxic zones) is
   foreshadow-only in act 1 and appears nowhere in this file.

   HEADLESS. Runs in node. Deterministic. Gate: gates/encounter_gate.js
   ========================================================================== */
(function (root) {
  'use strict';

  /* THE APPROVED TWELVE, in the verdict's own order and its own names. `kind` is
     the 70/20/10 class. `verb` is the thing that makes it different, because
     VARIETY IS A DIFFERENT VERB, NEVER A BIGGER HP BAR. `telegraph` is in BEATS
     (120 BPM law) and only where the roster actually specified one. `needs` is a
     precondition the roster states outright, never one invented here. */
  var ROSTER = [
    { id: 'feral_dog_pack', n: 1, name: 'feral dog pack', kind: 'forced',
      verb: 'swarms and circles, darts on off-beats; rout the alpha and the pack flees',
      ends: 'morale', spice: false },
    { id: 'coyote_shadow', n: 2, name: 'coyote shadow', kind: 'ambient',
      verb: 'follows you a block and commits only if you are hurt or loaded, bolts when hit',
      ends: 'mostly never a fight', spice: false },
    { id: 'rattlesnake', n: 3, name: 'rattlesnake', kind: 'interactive',
      verb: 'a static tile trap with a venom timer', telegraph: 2, ends: 'timer', spice: false },
    { id: 'scavenger_shakedown', n: 4, name: 'desperate scavenger shakedown', kind: 'interactive',
      verb: 'pipe-armed and can be paid, scared or dropped — the moral mirror of attack-anyone',
      ends: 'pay / scare / drop', spice: false },
    { id: 'toll_crew', n: 5, name: 'toll crew', kind: 'interactive',
      verb: 'raiders at a legible chokepoint who want a cut, not a corpse',
      ends: 'pay / fight / detour', spice: false },
    { id: 'the_snatcher', n: 6, name: 'the snatcher', kind: 'interactive',
      verb: 'grabs an item and RUNS — a beat-timed chase', ends: 'loss without death', spice: false },
    { id: 'crazed_wanderer', n: 7, name: 'crazed wanderer', kind: 'forced',
      verb: 'attacks off-grid and syncopated, immune to intimidation, might just scream past',
      ends: 'incentives do not work on him', spice: false },
    { id: 'bounty_squad', n: 8, name: 'bounty squad', kind: 'forced',
      verb: 'competent and escalating — the systemic price of attack-anyone',
      ends: 'escalates', spice: true, needs: 'murders' },
    { id: 'casino_security_bot', n: 9, name: 'dead casino security bot', kind: 'forced',
      verb: 'still enforcing 2020s trespass rules on its old property: slow, lethal, perfectly learnable',
      ends: 'alarm summons the district owners', spice: true },
    { id: 'spotter_drone', n: 10, name: 'faction spotter drone', kind: 'interactive',
      verb: 'patrols owned light and pings your position unless downed first',
      telegraph: 2, ends: 'cut the light, ground the drones', spice: false, needs: 'lit' },
    { id: 'ghost_robotaxi', n: 11, name: 'ghost robotaxi', kind: 'ambient',
      verb: 'empty cabs still crawling pickup loops; an intact one is a spoofable ride',
      ends: 'ride or rush', spice: false },
    { id: 'patrols_collide', n: 12, name: 'patrols collide', kind: 'ambient',
      verb: 'two squads fight EACH OTHER at a territory seam — join, third-party, loot after, or walk on',
      ends: 'world on world', spice: true, needs: 'seam' }
  ];

  /* THE APPROVED PACING PACKAGE. These four numbers are his, out of the verdict. */
  var MIX = { ambient: 0.70, interactive: 0.20, forced: 0.10 };
  var MIN_GAP_S = 90;                 // "~90s min gap"
  var SPICE_CAP = 1;                  // "rare is sacred: never twice a session"
  var KINDS = ['ambient', 'interactive', 'forced'];

  function byId(id) { for (var i = 0; i < ROSTER.length; i++) if (ROSTER[i].id === id) return ROSTER[i]; return null; }

  /* Deterministic, and deliberately not a random number generator: it is a stable
     hash used only to BREAK TIES between equally-eligible tokens, never to decide
     whether something happens. What happens is decided by the budget and the
     deficit, which is what "storyteller, not dice" means. */
  function hash(a, b, c) {
    var h = (a >>> 0) ^ Math.imul(b >>> 0, 374761393) ^ Math.imul(c >>> 0, 668265263);
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  /* --------------------------------------------------------------------------
     makeDirector(opts)
       seed    : world seed. Same seed + same walk => the same night, forever.
       tableFor: (district, phase) -> [tokenId, ...] | null      CALLER'S.
                 There is NO fallback and no global table: a district with no
                 entry spawns nothing. That is the "no global spawns ever" law
                 held by construction rather than by discipline.
       gapS    : override the approved 90s floor (the gate uses this; canon does not)
       repeatAfterS : how long before a token may come round again. NOT RULED, so
                 there is no default: without one, a token fires at most once in a
                 session, which is the strictest reading of "no repeat-spam" and
                 invents nothing.
     ------------------------------------------------------------------------ */
  function makeDirector(opts) {
    opts = opts || {};
    var seed = (opts.seed >>> 0) || 0;
    var tableFor = typeof opts.tableFor === 'function' ? opts.tableFor : null;
    var gapS = (opts.gapS != null) ? opts.gapS : MIN_GAP_S;
    var repeatAfterS = (opts.repeatAfterS != null) ? opts.repeatAfterS : null;

    var state = {
      tension: 0, elapsedS: 0, lastFireS: -1e9, seq: 0,
      counts: { ambient: 0, interactive: 0, forced: 0 }, total: 0,
      fired: {}, spice: 0, log: []
    };

    /* THE STORYTELLER BUDGET. Spends big when the player is healthy and it has
       been quiet; small after hard fights. `world.health` is 0..1 and `world.heat`
       is how rough the recent past was, both supplied by the caller — this file
       does not decide what a hard fight is. */
    function budgetNow(world) {
      var health = (world && world.health != null) ? world.health : 1;
      var heat = (world && world.heat != null) ? world.heat : 0;
      var quiet = Math.min(1, (state.elapsedS - state.lastFireS) / (gapS * 4));
      return state.tension * health * quiet * (1 - Math.min(0.9, heat));
    }

    /* Which class is furthest below its approved share. Not dice: over a long
       walk this lands ON 70/20/10 instead of near it. */
    function neediestKind() {
      var best = null, worst = -Infinity;
      for (var i = 0; i < KINDS.length; i++) {
        var k = KINDS[i];
        var have = state.total ? state.counts[k] / state.total : 0;
        var deficit = MIX[k] - have;
        if (deficit > worst) { worst = deficit; best = k; }
      }
      return best;
    }

    function eligible(tok, world) {
      if (!tok) return false;
      if (tok.spice && state.spice >= SPICE_CAP) return false;      // rare is sacred
      if (state.fired[tok.id]) return false;                        // no repeat-spam
      if (!tok.needs) return true;
      var f = world && world.can;
      return typeof f === 'function' ? !!f(tok.needs, tok) : false; // unproven need = no spawn
    }

    /* --------------------------------------------------------------------
       consider(world, spentSeconds)
       The ONLY way this director advances. Called from the world resolver's
       encounters socket with the time the player actually spent. Returns an
       encounter or a reason it did not fire — never null-and-silent, because a
       director that cannot explain itself cannot be tuned.
       ------------------------------------------------------------------ */
    function consider(world, spentSeconds) {
      var spent = (spentSeconds > 0) ? spentSeconds : 0;
      state.elapsedS += spent;
      state.tension += spent;
      if (repeatAfterS != null) refresh(repeatAfterS);
      var since = state.elapsedS - state.lastFireS;
      if (since < gapS) return { fired: false, reason: 'GAP', since: since, need: gapS };

      var district = world && world.district, phase = world && world.phase;
      if (!district || !phase) return { fired: false, reason: 'NO_PLACE' };
      if (!tableFor) return { fired: false, reason: 'NO_TABLE' };
      var ids = tableFor(district, phase);
      /* NO GLOBAL SPAWNS EVER: nothing to fall back on, on purpose. */
      if (!ids || !ids.length) return { fired: false, reason: 'NO_TABLE', district: district, phase: phase };

      var budget = budgetNow(world);
      if (budget < gapS) return { fired: false, reason: 'NO_BUDGET', budget: budget };

      var want = neediestKind();
      var pool = ids.map(byId).filter(function (t) { return t && eligible(t, world); });
      if (!pool.length) return { fired: false, reason: 'NOTHING_ELIGIBLE', district: district, phase: phase };
      /* THE CLASS IS NOT NEGOTIABLE, and getting this wrong is what made the first
         run come out 40/42/18 instead of 70/20/10. If the story wants an ambient
         beat and no ambient token is available here, the answer is that NOTHING
         HAPPENS — not a forced fight standing in for it. 70/20/10 is a promise
         about what the player actually experiences, and a substitution breaks the
         promise while keeping the arithmetic looking fine. */
      var use = pool.filter(function (t) { return t.kind === want; });
      if (!use.length) return { fired: false, reason: 'NONE_OF_KIND', want: want,
                                district: district, phase: phase };
      // stable tie-break only — which of the equally-valid ones, never whether
      var pick = use[Math.floor(hash(seed, state.seq, use.length) * use.length) % use.length];

      state.seq++;
      state.lastFireS = state.elapsedS;
      state.tension = 0;
      state.counts[pick.kind]++;
      state.total++;
      state.fired[pick.id] = state.elapsedS;
      if (pick.spice) state.spice++;
      var out = { fired: true, id: pick.id, name: pick.name, kind: pick.kind,
                  verb: pick.verb, telegraph: pick.telegraph || null, ends: pick.ends,
                  at: { district: district, phase: phase }, atS: state.elapsedS, seq: state.seq };
      state.log.push(out);
      return out;
    }

    /* A token may come round again once it is no longer the freshest thing that
       happened. Spice never does. */
    function refresh(afterS) {
      Object.keys(state.fired).forEach(function (id) {
        var t = byId(id);
        if (t && t.spice) return;
        if (state.elapsedS - state.fired[id] >= afterS) delete state.fired[id];
      });
    }

    function mix() {
      var out = {};
      KINDS.forEach(function (k) { out[k] = state.total ? state.counts[k] / state.total : 0; });
      out.total = state.total;
      return out;
    }

    return { consider: consider, refresh: refresh, mix: mix,
             get state() { return state; },
             get log() { return state.log.slice(); } };
  }

  var API = { makeDirector: makeDirector, ROSTER: ROSTER.slice(), MIX: MIX,
              MIN_GAP_S: MIN_GAP_S, SPICE_CAP: SPICE_CAP, KINDS: KINDS.slice(), byId: byId };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaEncounters = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
