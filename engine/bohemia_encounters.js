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

  AND THE SAME THING DOES NOT KEEP HAPPENING TO YOU (Paolo, 9/5, through the
    coordinator): "the same encounter does not repeat for the same player inside
    THREE in-game days, and never twice on the same street in one day. Put it on
    a dial in DEMO SETTINGS with that default."
    TWO RULES, NOT ONE, and both are load-bearing. The three days is on a dial and
    can be turned all the way down to nothing; the street rule is the floor that
    survives when it is. Held by two memories keyed off numbers THE CALLER GIVES,
    `world.day` and `world.place`, because this file owns no clock and does not
    know what a street is, and inventing either here would be a second opinion
    about where the player is standing.

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
  /* HIS NUMBER, 9/5, and the dial in SETTINGS opens on it. Three IN-GAME DAYS,
     counted on the day the caller reports, never converted into seconds of
     walking, because a day of game time and a minute of spent time are two
     different rulers and the ruling named the day. */
  var REPEAT_DAYS = 3;

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
       repeatAfterS : how long in SPENT SECONDS before a token may come round
                 again. Still here and still unruled, so still no default. It is
                 the only cooldown a caller with no calendar can offer, which is
                 every headless caller and the gate.
       repeatDays : how many IN-GAME DAYS before a token may come round again.
                 RULED 9/5 and defaults to three. A number, or a function read at
                 the moment the question is asked, so a dial the player moves
                 mid-session is obeyed mid-session instead of at page load.
                 IT DOES NOTHING UNLESS THE CALLER REPORTS A DAY. No day means no
                 calendar, and a director that guessed one would be the clock this
                 file is forbidden to own.

     WHAT THE CALLER PUTS IN `world`
       district, phase : the table key. No global table, ever.
       health, heat, can : the budget and the preconditions.
       day   : the in-game day number, if the caller has one. Drives the repeat.
       place : where the player is standing, at whatever grain the CALLER calls a
               street — a block on foot, a map cell on the road. Any stable key.
               Drives "never twice on the same street in one day".
     ------------------------------------------------------------------------ */
  function makeDirector(opts) {
    opts = opts || {};
    var seed = (opts.seed >>> 0) || 0;
    var tableFor = typeof opts.tableFor === 'function' ? opts.tableFor : null;
    var gapS = (opts.gapS != null) ? opts.gapS : MIN_GAP_S;
    var repeatAfterS = (opts.repeatAfterS != null) ? opts.repeatAfterS : null;
    var repeatDays = (opts.repeatDays != null) ? opts.repeatDays : REPEAT_DAYS;

    /* LATE, NEVER AT LOAD. The dial lives in a settings screen the player can open
       in the middle of a walk, and a number copied at construction would be the
       one that was true when the page opened. Same lesson the grid owner cost. */
    function daysNow() {
      var v = (typeof repeatDays === 'function') ? repeatDays() : repeatDays;
      v = (v == null || v !== v) ? REPEAT_DAYS : (v | 0);
      return v < 0 ? 0 : v;
    }

    var state = {
      tension: 0, elapsedS: 0, lastFireS: -1e9, seq: 0,
      counts: { ambient: 0, interactive: 0, forced: 0 }, total: 0,
      /* THREE MEMORIES, BECAUSE THEY ANSWER THREE DIFFERENT QUESTIONS.
         fired     : how long ago, in spent seconds  (the unruled cooldown)
         firedDay  : which in-game day it last happened at all   (his three days)
         firedHere : which day it last happened ON THIS STREET   (his second rule) */
      fired: {}, firedDay: {}, firedHere: {}, day: null, spice: 0, log: []
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
      /* WHO GETS TO ANSWER "HAS THIS ALREADY HAPPENED" -- ONE OF THEM, NEVER BOTH,
         and this is the whole row. MEASURED with both in: the seconds memory said
         no first, so his three days was never even asked. Twenty in-game days of
         walking gave FIVE encounters, every one of them on day one, and the dial
         in SETTINGS moved nothing wherever it was set. Two rules answering one
         question do not add up; the stricter one silently eats the other, and
         here that is a control that does nothing, which the settings screen's own
         rule calls worse than no control at all.
         A CALENDAR WINS. The seconds cooldown is what a caller with no days has,
         which is every headless caller and the gate, and they are untouched. */
      var day = world && world.day;
      if (day == null) {
        if (state.fired[tok.id]) return false;                      // no repeat-spam
      } else {
        var was = state.firedDay[tok.id];
        if (was != null && (day - was) < daysNow()) return false;   // not inside three days
        var place = world.place;
        if (place != null && state.firedHere[place + '|' + tok.id] === day)
          return false;                                             // not twice on this street today
      }
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
      /* THE DAY TURNS OVER AND TODAY'S STREETS ARE FORGOTTEN. A hundred-hour game
         over three generations would otherwise carry one entry per street per
         token for the life of the save, to answer a question that only ever asks
         about today. Once per day change, not once per step. */
      var dnow = world && world.day;
      if (dnow != null && dnow !== state.day) {
        state.day = dnow;
        Object.keys(state.firedHere).forEach(function (k) {
          if (state.firedHere[k] !== dnow) delete state.firedHere[k];
        });
      }
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
      if (world && world.day != null) {
        state.firedDay[pick.id] = world.day;
        if (world.place != null) state.firedHere[world.place + '|' + pick.id] = world.day;
      }
      if (pick.spice) state.spice++;
      var out = { fired: true, id: pick.id, name: pick.name, kind: pick.kind,
                  verb: pick.verb, telegraph: pick.telegraph || null, ends: pick.ends,
                  at: { district: district, phase: phase }, atS: state.elapsedS, seq: state.seq };
      state.log.push(out);
      return out;
    }

    /* A token may come round again once it is no longer the freshest thing that
       happened. Spice never does. AND THIS DOES NOT TOUCH THE DAY MEMORIES: they
       are counted in days, so letting a seconds cooldown clear them would be one
       ruler wiping another's answer. */
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
              MIN_GAP_S: MIN_GAP_S, SPICE_CAP: SPICE_CAP, REPEAT_DAYS: REPEAT_DAYS,
              KINDS: KINDS.slice(), byId: byId };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaEncounters = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
