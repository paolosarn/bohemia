// BOHEMIA KNOWN -- WHAT YOU HEARD, AND WHAT IT LEAVES OPEN (8/17/26, PEOPLE lane)
//
// *** THE HALF OF "REWARD THE LISTENER" THAT WAS STILL MISSING. ***
// The street exchanges shipped this morning with eleven conversations marked
// `leaks:true` -- each one saying something TRUE about this valley that is said
// nowhere else. And the fact went nowhere. You overheard it, the bubble faded,
// and the game forgot. That is atmosphere wearing a mechanic's coat, and the
// corpus is explicit that it is not what it asked for:
//
//   Q001.P8 "W8 (reward the listener" (ports) -- "gate a solution behind a
//     detail only an attentive player caught." A detail that is caught and then
//     dropped gates nothing. Standing still has to BUY something.
//
//   Q018.W3 THE RUMOR WEB (curiosity as the quest log) (craft) -- "a growing map
//     of known-vs-implied that always gives a thread to pull, with NO waypoints
//     -- the player follows their own questions (cf. our unrecorded ledger as a
//     living log)." The corpus names the shape: KNOWN versus IMPLIED, and NO
//     WAYPOINT. So this records two things per fact and never a location: the
//     line you actually heard, and the question it leaves open.
//
//   Q014.W3 SOCIAL DEDUCTION VIA DIEGETIC MEANS (craft) -- "the investigation
//     happens through the party's social fabric, not a quest-log clue." Which is
//     why this is filled by standing near two people and by nothing else.
//
// RESEARCHED 8/17, and the design that already solved this is Outer Wilds' ship
// log: progression is knowledge, and "the only things that are LOCKED to you are
// locked because you are IGNORANT of them." Its rumour mode lays entries out by
// how they relate, differently for every player, because the ORDER you learned
// things in is part of what you know. No marker is ever placed in the world.
// That is the same instrument this is, at the scale Bohemia can honestly carry
// today: a list of what you overheard, in the words you overheard it in.
//
// WHAT IT DELIBERATELY DOES NOT DO: point at anything. No coordinate, no cell,
// no arrow, no "go here". MAP LAW says Claude never designs map layouts, and
// Q018.W3 says no waypoints, and those agree. A fact names a SUBJECT (water,
// power, salvage, work, the hill, names, strangers) and asks a question. Where
// the answer is, if it is anywhere yet, is his.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: this module stores and returns. It writes
// no words -- every line in it came from an exchange he can edit in the WORDS
// tab, and it never invents a fact of its own.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  var MAX = 200;          /* a log, not a landfill: oldest falls off the end */

  function make(data) {
    /* id -> { id, subject, line, implies, day, min, times, first } */
    var m = {}, order = [];
    if (data && typeof data === 'object' && data.rows) {
      for (var i = 0; i < data.rows.length; i++) {
        var r = data.rows[i];
        if (!r || !r.id) continue;
        m[r.id] = {
          id: String(r.id), subject: String(r.subject || ''),
          line: String(r.line || ''), implies: String(r.implies || ''),
          day: r.day | 0, min: r.min | 0,
          times: (r.times | 0) || 1, first: (r.first | 0) || (r.day | 0)
        };
        order.push(r.id);
      }
    }

    function note(fact) {
      /* A FACT WITH NOTHING BEHIND IT IS NOT A FACT. An exchange that claims to
         leak and names no subject or question would otherwise fill the log with
         rows that say nothing, which is worse than an empty log because it looks
         like content. The factory refuses to build one; this refuses to store
         one, because two independent refusals is what makes it true. */
      if (!fact || !fact.id || !fact.subject || !fact.implies) return null;
      var id = String(fact.id);
      var r = m[id];
      if (r) {
        /* HEARING IT AGAIN IS NOT LEARNING IT AGAIN. It counts, because how
           often a thing is said on a street is itself information, but it never
           reorders the log: the ORDER YOU LEARNED THINGS IN is part of what you
           know (the ship-log lesson), so a rediscovery must not shuffle it. */
        r.times++;
        return r;
      }
      r = m[id] = {
        id: id, subject: String(fact.subject), line: String(fact.line || ''),
        implies: String(fact.implies), day: fact.day | 0, min: fact.min | 0,
        times: 1, first: fact.day | 0
      };
      order.push(id);
      while (order.length > MAX) { delete m[order[0]]; order.shift(); }
      return r;
    }

    function get(id) { return m[id] || null; }
    function has(id) { return !!m[id]; }
    function count() { return order.length; }

    /* WHAT YOU KNOW ABOUT ONE SUBJECT. This is the whole query the surface
       needs: you are standing in front of somebody, what have you heard that
       bears on them? */
    function about(subject) {
      var out = [];
      if (!subject) return out;
      var s = String(subject).toLowerCase();
      for (var i = 0; i < order.length; i++) {
        var r = m[order[i]];
        if (r && r.subject.toLowerCase() === s) out.push(r);
      }
      return out;
    }
    function knows(subject) { return about(subject).length > 0; }

    /* EVERY SUBJECT YOU HAVE HEARD ANYTHING ABOUT, with how much. The map of
       known-vs-implied Q018.W3 asks for: it shows what you have a thread on and
       says nothing about where the thread goes. */
    function subjects() {
      var seen = {}, out = [];
      for (var i = 0; i < order.length; i++) {
        var r = m[order[i]];
        if (!r) continue;
        if (!seen[r.subject]) { seen[r.subject] = { subject: r.subject, n: 0 }; out.push(seen[r.subject]); }
        seen[r.subject].n++;
      }
      return out;
    }

    /* NEWEST FIRST for reading, but `order` is kept oldest-first because that
       is the record of how you came to know it. */
    function all() {
      var out = [];
      for (var i = order.length - 1; i >= 0; i--) if (m[order[i]]) out.push(m[order[i]]);
      return out;
    }

    function serialize() {
      var rows = [];
      for (var i = 0; i < order.length; i++) if (m[order[i]]) rows.push(m[order[i]]);
      return { v: 1, rows: rows };
    }

    return { note: note, get: get, has: has, count: count, about: about,
             knows: knows, subjects: subjects, all: all, serialize: serialize };
  }

  var API = { VERSION: '8.17.26', make: make, MAX: MAX };
  if (HASREQ) module.exports = API;
  root.BohemiaKnown = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
