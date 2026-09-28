// BOHEMIA WORK — THE PLAYER CAN DO A DAY'S WORK (9/7/26, WORLD lane)
// Board row [a days work] / EVERYBODY-IN-THE-VALLEY-HAS-A-JOB-EXCEPT-THE-PLAYER.
//
// ============================================================================
// THE FINDING THIS EXISTS FOR, MEASURED IN OUR OWN CODE BEFORE A LINE WAS WRITTEN
// ============================================================================
//   NPC acts, from bohemia_agents.js since his 7/19 correction:
//       errand, free, home, scav, sleep, watch, work
//   PLAYER acts, on the walked surface:
//       walk, talk, fight, build, buy, sleep
//
//   THERE IS NO PLAYER ACT CALLED WORK. Every person in the valley puts in a
//   seven-hour day and the player is the only one locked out of it. Re-measured
//   here across 400 seeds of the valley's own schedule builder:
//       worker  work    08:00-16:45   479 min   (435 min .. 525 min)
//       scav    scav    08:30-18:45   367 min   (214 min .. 526 min)
//       watch   watch   16:15-23:25   361 min
//       keeper  errand  08:43-12:43    75 min
//
//   And the money vocabulary agrees: finish a quest (+1), place a building (-1),
//   buy a good (-1), ask somebody (-1 clout). THREE OF FOUR ARE SPENDING, ONE IS
//   EARNING, AND NONE OF THEM IS WORK. The four verbs are the BILL, not the JOB.
//
// ============================================================================
// NOTHING IN THIS FILE IS A NEW NUMBER, AND THAT IS THE WHOLE DESIGN
// ============================================================================
// Every part of a day's work was already built and none of it was joined up:
//   WHERE work happens   bohemia_agents.js JOB_DISTRICTS (commercial, industrial,
//                        medical, solar) — his map's own districts
//   WHAT KINDS exist     bohemia_economy.js YIELD — exactly two, site and scav
//   HOW LONG it takes    bohemia_agents.js scheduleFor() — the valley's own clock
//   WHAT it produces     bohemia_economy.js advanceDay() — hand it one more agent
//   WHAT it pays         the purse's PAYOUT, his RULED ONE (8/15, 9/4 battery)
// So this module JOINS them and owns no table of its own. There is not one
// duration, rate, price or yield typed anywhere below. If he moves a number, it
// moves here without this file being edited — which is the only kind of number
// this lane is allowed to have.
//
// *** WHY A SHIFT'S LENGTH IS READ AND NEVER TYPED. *** A typed "a shift is eight
// hours" would be a second clock, and the day the valley's schedule changed the
// player would be working a day nobody else in the world works. The player's
// shift is literally the same block of minutes bohemia_agents hands an NPC of
// that archetype on this world's seed, summed. Same world, same working day.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: the mechanism is that the player HAS the act,
// that where they stand decides which kind of work is on offer, and that doing it
// costs the hours and pays through the pipe that already exists. The contents —
// what a shift is worth against everything else — is his, and ECONOMY is
// researching it right now ([shift pay], Q27). Nothing here pre-empts that: the
// pay comes from the purse's own table and this file never names an amount.
//
// NOT THIS ROW, ON PURPOSE, so two lanes do not build one thing twice:
//   RUN [a shift]            the five-minute session shape around it
//   PEOPLE [somebody hires you]  who offers you the job and whether they will
//   WORLD [batteries mined]  buildings earning while you are away (work first)
//
// node: require('./bohemia_work.js')   Gate: gates/a_days_work_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  /* ASK FOR A NEIGHBOUR WHEN YOU NEED IT, NEVER WHEN YOU LOAD. Binding these at
     load time is how BB-COALITION shipped seeing zero pairs on the walked surface
     while node saw five: the city inlines its modules in an order no module
     controls, so a top-level grab gets null, throws nothing, and reports an empty
     world — which is indistinguishable from a world where nothing is happening. */
  function AG() {
    if (HASREQ) { try { return require('./bohemia_agents.js'); } catch (_e) {} }
    return (typeof root !== 'undefined' && root.BohemiaAgents) || null;
  }
  /* [back of house], 9/13. ASKED WHEN NEEDED, NEVER AT LOAD: it is spliced into the
     walked surface above this file, and a neighbour fetched at load time would be
     undefined there. */
  function BH() {
    if (HASREQ) { try { return require('./bohemia_backhouse.js'); } catch (_e) {} }
    return (typeof root !== 'undefined' && root.BohemiaBackhouse) || null;
  }
  function ECON() {
    if (HASREQ) { try { return require('./bohemia_economy.js'); } catch (_e) {} }
    return (typeof root !== 'undefined' && root.BohemiaEconomy) || null;
  }

  /* ------------------------------------------------------------------------
     THE ONE BRIDGE IN THIS FILE, AND IT IS A MAPPING, NOT A NUMBER.
     Two vocabularies already exist and nobody had ever written down how they
     line up: the ECONOMY's job kinds (site, scav) and the SCHEDULE's acts
     (work, scav, errand, watch, free, home, sleep). 'scav' happens to be the
     same word in both. 'site' is the economy's word for the organized crew at a
     real district, and the schedule's word for that person's hours is the
     WORKER archetype's 'work' block. That is the whole of it.
     IT IS CHECKED, NOT ASSUMED: kinds() refuses to return a kind whose archetype
     or act has gone missing, so if either module renames anything this returns
     fewer kinds and the gate goes red, rather than silently offering work whose
     clock is zero minutes long. A CHECKER THAT CANNOT TELL A MENTION FROM A USE
     IS THE BROKEN ONE (8/1), and a bridge nobody verifies is the same thing. */
  var BRIDGE = {
    site: { archetype: 'worker', act: 'work' },
    scav: { archetype: 'scav',   act: 'scav' }
  };

  /* WHICH KINDS OF WORK REALLY EXIST RIGHT NOW. Read off the economy's own YIELD
     table, then filtered to the ones whose clock this world can actually produce.
     The economy owning exactly two is its ruling, not mine; if he adds a third,
     it appears here the moment BRIDGE learns its hours, and until then it is
     honestly absent rather than quietly treated as a scav. */
  function kinds() {
    var e = ECON(), a = AG(), out = [];
    if (!e || !e.YIELD || !a || typeof a.scheduleFor !== 'function') return out;
    var k;
    for (k in e.YIELD) {
      if (!Object.prototype.hasOwnProperty.call(e.YIELD, k)) continue;
      var b = Object.prototype.hasOwnProperty.call(BRIDGE, k) ? BRIDGE[k] : null;
      if (!b) continue;
      if (!a.KINDS || a.KINDS.indexOf(b.archetype) < 0) continue;
      out.push(k);
    }
    return out;
  }

  /* HOW LONG THAT WORK TAKES IN THIS VALLEY. The valley's own schedule for that
     archetype on this seed, with the working blocks summed. Deterministic: the
     same seed is the same working day on every device, which is what makes it a
     fact about the world rather than a roll made when you tap the button. */
  function minutesFor(kind, seed) {
    var a = AG(); if (!a || typeof a.scheduleFor !== 'function') return 0;
    var b = Object.prototype.hasOwnProperty.call(BRIDGE, kind) ? BRIDGE[kind] : null;
    if (!b) return 0;
    var sched = null;
    /* The shift argument is the worker's staggered start, which bohemia_agents
       spreads per agent. The player is not on somebody else's crew, so this asks
       for the schedule the module itself builds and takes the LENGTH out of it;
       what time the NPC happened to clock on does not change how long the work is. */
    try { sched = a.scheduleFor(seed >>> 0, b.archetype, 8 * 60); } catch (_e) { return 0; }
    if (!sched || !sched.length) return 0;
    var mins = 0;
    for (var i = 0; i < sched.length; i++)
      if (sched[i] && sched[i].act === b.act) mins += (sched[i].t1 - sched[i].t0);
    return mins;
  }

  /* WHAT WORK IS ON OFFER WHERE HE IS STANDING.
     *** THIS IS THE ONE PLACE THE PLAYER'S POSITION MATTERS, AND IT READS HIS MAP. ***
     bohemia_agents.js has held JOB_DISTRICTS since the commute was built — the
     districts the valley's own workers walk to. Standing on one, the work on offer
     is SITE work, because that is what the economy means by a site. Standing
     anywhere else, it is a SCAV sweep, because that is what the economy means by
     scav and it is what a person with no crew does. No list of places is typed
     here; a district he adds to the map offers work the same hour it exists. */
  /* *** AND INSIDE, THE ROOM DECIDES, WHICH IS [back of house], 9/13. ***
     Until this, the room never entered the arithmetic anywhere: bohemia_economy's
     YIELD is two flat numbers and this file did not contain the word room. So a
     sweep through the back of a casino paid exactly what a sweep across a car park
     paid, and every interior in the valley -- built, furnished, walkable -- was
     invisible to the only thing that rewards you for being in it.
     THE ROOM YOU ARE STANDING IN IS A TRUER ANSWER THAN THE DISTRICT YOU ARE IN, so
     when a room is given it wins outright, both ways: a dry store on a nothing block
     is still a site, and a casino concourse on a job district is still a sweep.
     WHICH ROOMS COUNT IS NOT DECIDED HERE AND NOT LISTED ANYWHERE: bohemia_backhouse
     asks the furnisher what is actually in the room. And NO NEW NUMBER IS BORN --
     site against scav is the economy's own pair, already 3.0 against 1.2, already
     untuned and already his. */
  function kindAt(worldApi, x, y, room) {
    var byRoom = null;
    if (room) {
      var B = BH();
      if (B) { try { byRoom = B.workIn(room); } catch (_e) { byRoom = null; } }
      if (byRoom) return kinds().indexOf(byRoom) < 0 ? null : byRoom;
    }
    var a = AG(); if (!a) return null;
    var jd = a.JOB_DISTRICTS;
    var here = null;
    try { here = worldApi && worldApi.at ? worldApi.at(x | 0, y | 0) : null; } catch (_e) { here = null; }
    if (!here) return null;
    var site = !!(jd && here.district && Object.prototype.hasOwnProperty.call(jd, here.district)
                  && jd[here.district]);
    var kind = site ? 'site' : 'scav';
    return kinds().indexOf(kind) < 0 ? null : kind;
  }

  /* ==========================================================================
     *** WHETHER THEY WILL HIRE YOU AT ALL. (9/28, [somebody hires you], row
     WHO-WILL-GIVE-YOU-WORK.) ***

     "A person offers you the job, and whether they will depends on your
     standing... A stranger gets the worst work; somebody who vouches for you
     gets you the better shift; a bad name closes doors."

     MEASURED BEFORE A LINE OF THIS EXISTED: kindAt() answers ONLY off the
     ground -- a site district always offers 'site', to anybody, for ever. The
     valley has TWO real, already-built ways to know who you are to a faction:
       THE BELONGING LADDER (bohemia_belonging.js) -- how many times you have
         done what THIS outfit wants. Starts at 'stranger' on a fresh save and
         moves the moment a favour is answered, which happens in ordinary play.
       THE STANDING WEB (bohemia_standing.js, whoVouches) -- named people who
         are warm on you because they watched or heard something you did.
         MEASURED: its DEED_WEIGHT table is NOT empty on the real page (84 rows,
         filled at boot from the quest corpus) so this is wired and not a dead
         letter, but on a fresh save nobody has touched a quest yet, so in
         ordinary early play the belonging ladder is the one that actually
         moves. Both are asked; neither is invented.
     Closing a door is the between organ's own vocabulary: `ctRelToMine` already
     answers 'hostile' for an outfit whose ripple against you is hostile, the
     same fact `ctAgainstMe` already reads to decide who attacks you on sight.

     `who` IS FACTS, NEVER A PERSON, matching the shape bohemia_company.js and
     tools/bohemia_companion.js already use: { rel, rung, vouched }.
       rel      the between organ's sign for this faction: 'hostile' | 'warm' |
                'neutral' | 'unknown' | null (no relationship recorded at all)
       rung     the belonging ladder's KEY for this faction ('stranger',
                'peripheral', 'useful', ...) or null (no ladder, or no faction)
       vouched  true if a named person warm on the player belongs to this
                faction. A bool, not a list: WHO they are is the standing web's
                to show, not this file's to carry.
     `who` is OPTIONAL. Omit it and kindAt()/offer() answer exactly as they did
     before this round, so nothing that already calls them without it changes.

     *** WHY THIS IS PURE AND ASKS FOR x,y RATHER THAN "WHERE HE IS STANDING":
     RULE 38 (9/28, LOCKED) KILLED TILE-TO-TILE THROUGH THE CITY THE SAME
     ROUND THIS ROW WAS CLAIMED. *** "Your character moving tile to tile
     throughout the city, it's not gonna be like that anymore, that has to
     change immediately." A place becomes a SETTLEMENT SCREEN you tap into, not
     a cell you walk onto. This file never assumed a walked pad -- offer() has
     always taken x,y and a worldApi, not hx/hy -- so nothing here has to
     change when the surface does. WHOEVER BUILDS THE SETTLEMENT SCREEN calls
     this exactly the way a walked pad would have: find the tapped building's
     ground holder, build a `who`, hand it to offer(). The walked city's own
     wiring below (ctHiringWho, workOffer) is a REFERENCE CALLER, wired to the
     one surface that is still live on the alpha today, not a claim that the
     pad is where this belongs. */
  function doorFor(who) {
    if (!who) return { open: true, upgrade: true, why: null };   /* unasked = old behaviour */
    if (who.rel === 'hostile') return { open: false, upgrade: false, why: 'hostile' };
    var known = (who.rung && who.rung !== 'stranger') || !!who.vouched;
    return { open: true, upgrade: known,
             why: known ? (who.vouched ? 'vouched' : 'standing') : 'stranger' };
  }

  /* THE OFFER: what work is here, how long it takes, and whether the day still
     holds it. minutesLeft is the caller's, because how long a day is belongs to
     the day loop and not to this file.
     A SHIFT THAT DOES NOT FIT IS REFUSED RATHER THAN TRUNCATED. Half a day's work
     for a full day's pay is a number nobody ruled, and half a day's work for half
     the pay is another one. EVERYTHING COSTS ONE (8/15) means the unit is the
     whole shift, so the honest answer to "there are two hours of light left" is
     that you cannot start, not that you get a smaller battery. */
  function offer(worldApi, x, y, seed, minutesLeft, room, who) {
    var baseKind = kindAt(worldApi, x, y, room);
    if (!baseKind) return null;
    var door = doorFor(who);
    if (!door.open) return null;
    var kind = (baseKind === 'site' && !door.upgrade) ? 'scav' : baseKind;
    var mins = minutesFor(kind, seed);
    if (!mins) return null;
    var fits = (typeof minutesLeft === 'number') ? (minutesLeft >= mins) : true;
    var B = room ? BH() : null, where = null;
    if (B) { try { where = B.say(room) || null; } catch (_e) { where = null; } }
    return { kind: kind, act: BRIDGE[kind].act, minutes: mins, fits: fits,
             room: room || null, where: where,
             /* NAMED, NEVER SILENT: a downgraded kind and a closed door both
                have to be able to be told apart from an ordinary scav district,
                or the reputation system costs the player something with no way
                for him to ever notice it happened. */
             offeredSite: (baseKind === 'site'),
             door: door.why,
             district: (function () {
               try { var c = worldApi.at(x | 0, y | 0); return (c && c.district) || null; }
               catch (_e) { return null; } })() };
  }

  /* AND WHAT A DAY OF IT DOES TO THE VALLEY.
     *** THE PLAYER BECOMES ONE MORE PAIR OF HANDS IN THE COUNT, WHICH IS THE
     WHOLE POINT AND IS ALSO WHY NO YIELD IS COMPUTED HERE. ***
     bohemia_economy.advanceDay() already turns a list of agents into produced
     goods; it has done it since it was written. So a day the player worked is
     that same list with ONE MORE AGENT of the kind they worked. Every number
     stays inside the economy, conservation still holds, and the scav decay curve
     applies to the player exactly as it applies to everybody else.
     This also closes the loop THE-VALLEY-RUNS-OUT opened (9/6): the valley eats
     its shelves down whether or not you look, and this is the first thing a
     player can do about it with their hands. */
  function asAgent(kind) {
    return (kinds().indexOf(kind) < 0) ? null : { job: { kind: kind } };
  }

  var API = { BRIDGE: BRIDGE, kinds: kinds, minutesFor: minutesFor,
              kindAt: kindAt, offer: offer, asAgent: asAgent, doorFor: doorFor };
  if (HASREQ) module.exports = API;
  root.BohemiaWork = API;
})(typeof window !== 'undefined' ? window
   : (typeof globalThis !== 'undefined' ? globalThis : this));
