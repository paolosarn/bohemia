// BOHEMIA LADDER WALK -- THE SIXTY-BOSS LADDER AS A STORY YOU CAN WALK
// (9/6/26, QUESTS lane, [spine first] THE-LADDER-IS-THE-MAIN-LINE)
//
// THE PILLAR: 60 mini bosses, each handing you a VERB. 53 are written and all 53
// are in the running game, parsed verbatim from his record. So the VERB half is
// done and it is good.
//
// WHAT IS NOT DONE, AND IT IS THE WHOLE ROW:
//
//   1. *** THERE IS NO WALK. *** The fight picks a boss UNIFORMLY AT RANDOM out
//      of every man you do not already hold. A 38-edge prerequisite graph exists,
//      approved 8/13, with a one-sentence physical reason on every edge -- and it
//      is read by two gates and two tools and BY NOTHING THE PLAYER TOUCHES. So
//      in play, the fifty-third man can be the first man you meet, and a ladder
//      that can be climbed in any order is not a ladder, it is a lottery.
//   2. *** NO BOSS HAS A PLACE. *** Not one row, not one field, nowhere.
//   3. *** NO BOSS HAS A PERSON. *** He is an archetype body picked by trait.
//
// AND THE ANSWER TO THE PLACE WAS ALREADY IN HIS OWN WRITING. Read his HOLDS
// column: the last kennel, the last clinic, the golf courses, the cemetery, the
// railyard, the dam, the airfield, the lights on the Strip, the pyrolysis plant.
// HE ALREADY WROTE WHERE EVERY ONE OF THEM STANDS. And this city already builds
// most of those places by name. So the place is not a design decision anybody has
// to make: THE MAN WHO HOLDS THE AIRFIELD IS AT THE AIRFIELD. This module reads
// his words against the city's own place names and says which word matched, so
// every placement can be argued with by pointing at the two texts that produced
// it. NOT ONE PAIRING IS HAND-WRITTEN HERE.
//
// WHAT IS DELIBERATELY NOT HERE
// - NO LADDER DATA. Not one boss, not one edge. His record and his graph are the
//   only rulers and this module carries no copy of either; everything is handed
//   in. That is why it cannot drift from his files: it has nothing to drift with.
// - NO INVENTED PLACE. If his words do not name a place the city builds, the boss
//   has no place and the module says so with a reason. Guessing would be worse
//   than nothing, because a wrong place reads as canon.
// - NO INVENTED PERSON. The man is somebody the world already put there.
// - NO WRITING INTO THE FIGHT. rollBoss belongs to COMBAT. This produces the walk
//   and never reaches into anybody else's system (ONE SYSTEM, ONE SESSION).
// - NO PACING. The graph holds PHYSICALLY NECESSARY edges only, by its own rule,
//   and the tool that measures its fan already reported that physics alone opens
//   20 doors against his 4-to-6 band and that closing 14 of them needs a quest
//   gate which is HIS call. That measurement is not re-derived here. ONE RULER.
//
// REUSE CHECK: cooks no pixels, opens no bank, writes no save. It is arithmetic
// over two files he already wrote and one list the city already has.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  function arr(x) { return Object.prototype.toString.call(x) === '[object Array]' ? x : []; }
  function low(s) { return String(s == null ? '' : s).toLowerCase(); }

  /* ==================================================================== */
  /*  1. THE WALK -- the order the game does not have                      */
  /* ==================================================================== */

  /* gatesOf(edges) -- for each boss, the men who must fall first. */
  function gatesOf(edges) {
    var g = {};
    arr(edges).forEach(function (e) {
      if (!e || !e.to || !e.from) return;
      (g[e.to] = g[e.to] || []).push({ from: e.from, why: e.why || '' });
    });
    return g;
  }

  /* openNow(bosses, edges, held) -- THE LIVE MENU. Every man whose gates have
     all fallen and who is not already yours. This is the one function the fight
     does not have: it filters by what you HOLD only, and never by what you
     have EARNED. */
  function openNow(bosses, edges, held) {
    var g = gatesOf(edges), have = {};
    arr(held).forEach(function (h) { have[h] = true; });
    return arr(bosses).filter(function (b) {
      if (!b || have[b.n] || have[b.id]) return false;
      var need = g[b.n] || [];
      for (var i = 0; i < need.length; i++) {
        if (!have[need[i].from]) return false;
      }
      return true;
    });
  }

  /* behind(bosses, edges, held) -- and the men who are NOT open, each with the
     one sentence from his own graph saying why. A door you cannot open yet is
     only interesting if it tells you what it is waiting for. */
  function behind(bosses, edges, held) {
    var g = gatesOf(edges), have = {}, open = {};
    arr(held).forEach(function (h) { have[h] = true; });
    openNow(bosses, edges, held).forEach(function (b) { open[b.n] = true; });
    return arr(bosses).filter(function (b) {
      return b && !open[b.n] && !have[b.n] && !have[b.id];
    }).map(function (b) {
      var need = (g[b.n] || []).filter(function (x) { return !have[x.from]; });
      return { boss: b.n, waitingOn: need.map(function (x) { return x.from; }),
               why: need.length ? need[0].why : '' };
    });
  }

  /* roots(bosses, edges) -- what physics alone opens with nothing done. The
     tool that measures the fan curve owns that measurement; this only needs the
     set so a walk can start somewhere. */
  function roots(bosses, edges) { return openNow(bosses, edges, []); }

  /* ==================================================================== */
  /*  2. THE PLACE -- read out of his own words, never authored            */
  /* ==================================================================== */

  /* His HOLDS column is written in place names. The city builds places under
     names of its own. Where the two texts share a word, that is where the man
     stands, and the matched word is carried out so the placement can be argued
     with rather than believed. */
  /* THREE, NOT FOUR. Four dropped THE DAM, whose whole holds column is "the
     dam, running at a fraction of its 2GW" against a district this city
     literally calls DAM. Three is safe here only because the vocabulary is a
     closed list of specific place names and the match is whole-word. */
  var TOO_SMALL = 3;
  var SKIP = { 'last':1, 'that':1, 'what':1, 'still':1, 'every':1, 'whole':1,
               'their':1, 'where':1, 'which':1, 'works':1, 'working':1,
               'anybody':1, 'somebody':1, 'valley':1, 'before':1, 'thing':1,
               'things':1, 'first':1, 'only':1, 'left':1, 'from':1, 'with':1,
               'them':1, 'this':1, 'takes':1, 'runs':1, 'gets':1, 'anything':1 };

  function wordsOf(text) {
    return low(text).replace(/[^a-z ]+/g, ' ').split(/\s+/)
      .filter(function (w) { return w.length >= TOO_SMALL && !SKIP[w]; });
  }

  /* placeOf(boss, places) -- places is the list of place names the city
     actually builds. Returns {place, because} or null with a reason. */
  function placeOf(boss, places) {
    if (!boss) return null;
    var have = arr(places).map(low).filter(Boolean);
    if (!have.length) return null;
    var say = wordsOf((boss.holds || '') + ' ' + (boss.n || boss.name || ''));
    for (var i = 0; i < say.length; i++) {
      var w = say[i];
      for (var j = 0; j < have.length; j++) {
        /* *** WHOLE WORD ONLY. *** The first cut matched substrings in both
           directions and produced confident nonsense: THE LOCKSMITH went to
           "blockgen" because block contains lock, THE CHEMIST went to "agents"
           because reagents contains agents, THE WALL went to "standing". Every
           one of those would have read as canon. A place that is merely spelled
           near the word is not the place. */
        if (have[j] === w) {
          return { place: arr(places)[j], because: w,
                   from: boss.holds ? 'holds' : 'name' };
        }
      }
    }
    return null;
  }

  /* placed(bosses, places) -- the whole ladder sorted into men who have a place
     and men who do not, because the second list is the work. */
  function placed(bosses, places) {
    var yes = [], no = [];
    arr(bosses).forEach(function (b) {
      var p = placeOf(b, places);
      if (p) yes.push({ boss: b.n || b.name, place: p.place, because: p.because });
      else no.push({ boss: b.n || b.name, holds: b.holds || '' });
    });
    return { placed: yes, placeless: no };
  }

  /* ==================================================================== */
  /*  3. THE PERSON -- somebody the world already put there                */
  /* ==================================================================== */

  /* personOf(boss, peopleThere) -- the man is drawn from the people standing at
     his place. Nobody is invented, and an empty place has no man, which is the
     correct answer and not a gap to fill with a stranger. */
  function personOf(boss, peopleThere) {
    var p = arr(peopleThere);
    if (!boss || !p.length) return null;
    /* Deterministic by the boss's own name so the same man is the same man on
       every load. No seed of our own: his ladder number IS the index. */
    var i = (boss.i != null ? boss.i : hash(boss.n || boss.name || '')) % p.length;
    return p[i < 0 ? 0 : i];
  }
  function hash(s) {
    var h = 0; s = String(s);
    for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; }
    return h;
  }

  /* ==================================================================== */
  /*  4. THE WALK, ASSEMBLED                                               */
  /* ==================================================================== */

  /* walk(world) -- the row's actual deliverable: every man who is open to you
     right now, as a place, a person and the verb you take from him. A man with
     no place is NOT dropped: he is returned with place null, because pretending
     the ladder is complete is the failure this row exists to end. */
  function walk(world) {
    world = world || {};
    var bosses = arr(world.bosses), edges = arr(world.edges),
        held = arr(world.held), places = arr(world.places),
        peopleAt = world.peopleAt || function () { return []; };
    return openNow(bosses, edges, held).map(function (b) {
      var p = placeOf(b, places);
      var who = p ? personOf(b, peopleAt(p.place)) : null;
      return {
        boss: b.n || b.name,
        act: b.act,
        place: p ? p.place : null,
        because: p ? p.because : null,
        person: who,
        verb: b.grant || null,      /* THE VERB YOU TAKE FROM HIM. His words. */
        lock: b.lock || null,
        draft: true
      };
    });
  }

  /* ready(world) -- how much of the walk is actually walkable, as a number
     rather than an opinion. */
  function ready(world) {
    var w = walk(world);
    return { open: w.length,
             withPlace:  w.filter(function (x) { return !!x.place; }).length,
             withPerson: w.filter(function (x) { return !!x.person; }).length,
             withVerb:   w.filter(function (x) { return !!x.verb; }).length };
  }

  var API = { gatesOf: gatesOf, openNow: openNow, behind: behind, roots: roots,
              placeOf: placeOf, placed: placed, personOf: personOf,
              walk: walk, ready: ready, wordsOf: wordsOf };
  if (HASREQ) module.exports = API; else root.BohemiaLadderWalk = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
