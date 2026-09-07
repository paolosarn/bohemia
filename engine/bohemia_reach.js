// BOHEMIA REACH -- HOW LONG THAT JOB IS, BEFORE YOU TAKE IT
// (9/7/26, QUESTS lane, [distance shown] BB-INSIDE-A-DAY)
//
// THE ROW: day one's quest requires a TRADES role, the nearest TRADES person is
// five blocks away, and at the valley's own measured walking speed that is about
// three and a half hours each way. SEVEN HOURS THERE AND BACK, forty-four percent
// of the first day anybody ever plays, walking to the person the first job is
// about. Nobody had multiplied the two numbers together.
//
// *** THIS IS DISCLOSURE, NOT RELOCATION. *** Where people are is HIS and MAP LAW
// holds: nothing here moves anybody, shortens anything, or touches a layout. The
// walk stays exactly as long as it is. The only thing that changes is that THE
// JOB SAYS SO BEFORE YOU TAKE IT.
//
// THE STANDARD IS THE ROW'S OWN, and it is a real one: the City of London
// controlled markets within six and two thirds miles, "the distance a person
// could be expected to walk to market, sell his produce and return in a day".
// A DAY THERE AND BACK IS THE REACHABLE SET, and an offer outside it announces
// itself. That is the ONE threshold in this file, and it is his, not mine.
//
// EVERY NUMBER BELOW IS MEASURED, NOT PICKED, and the gate re-derives the row's
// own three published figures from them so the arithmetic can be argued with:
//   0.084 minutes per fine cell, which the walked surface calls "12 cells a
//     minute, about nine metres a minute"
//   a block is NB(4) x FN x the fine cell, which comes out at 384 m -- and 5
//     blocks is the 1.9 km the row measured, 7 blocks its 2.7 km
//   a 16-hour day therefore walks about 8.6 km across a 9.2 km valley, which is
//     the row's own "the whole valley is one market town's catchment"
//
// WHAT IS DELIBERATELY NOT HERE
// - NO SECOND THRESHOLD. "Most of a day", "a fair walk", "quite far" are all
//   numbers nobody ruled. The file states the minutes and answers one yes-or-no
//   question, and everything else is left to the player's own arithmetic.
// - NO ROUTING. This is straight-line block distance, the same unit the address
//   line already speaks in, because a router that disagreed with the address
//   would give the player two answers to one question.
// - NO SPEED-UP. BB-ROADS-ARE-FAST is a different row and a different lane's
//   ruling; the baseline here is the baseline as measured today.
//
// REUSE CHECK: cooks no pixels, opens no bank, writes no save, moves nothing.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* ---- THE MEASURED WORLD. Defaults, overridable, never invented. -------- */
  var METRES_PER_MINUTE = 9;      /* 12 fine cells a minute at 0.75 m a cell   */
  var METRES_PER_BLOCK  = 384;    /* NB 4 x FN x the fine cell                 */
  var WAKING_HOURS      = 16;     /* the day loop wakes you at 06:00 and spends
                                     sixteen of them; the row's 8.6 km is this  */

  function day(o) { return ((o && o.wakingHours) || WAKING_HOURS) * 60; }
  function mpm(o) { return (o && o.metresPerMinute) || METRES_PER_MINUTE; }
  function mpb(o) { return (o && o.metresPerBlock)  || METRES_PER_BLOCK; }

  /* metresFor(blocks) -- the address line counts blocks the same way, as the
     longer of the two axes, so this takes what it already has. */
  function metresFor(blocks, o) { return Math.max(0, blocks || 0) * mpb(o); }

  /* minutesFor(blocks) -- one way, on foot, at the valley's own clock. */
  function minutesFor(blocks, o) { return metresFor(blocks, o) / mpm(o); }

  /* thereAndBack(blocks) -- the number the row is actually about. */
  function thereAndBack(blocks, o) { return 2 * minutesFor(blocks, o); }

  /* insideADay(blocks) -- HIS standard, and the only judgement in this file.
     Returns the whole answer rather than a bare boolean, because a caller that
     wants to say WHY needs the parts. */
  function insideADay(blocks, o) {
    var one = minutesFor(blocks, o), both = 2 * one, have = day(o);
    return { blocks: blocks, oneWay: one, roundTrip: both, dayMinutes: have,
             fits: both <= have, leftOver: have - both };
  }

  /* ---- THE WORDS. Every one an attempt, none of them approved. ---------- */
  /* hoursWord(minutes) -- plain English for a length of time, and never a
     decimal: nobody says "3.6 hours" out loud. */
  function hoursWord(min) {
    min = Math.round(min);
    if (min < 1)  return 'no time at all';
    /* Anything an hour or more speaks in hours: "about 85 minutes there and
       back" is arithmetic, not speech. A formatting choice, not a threshold. */
    if (min < 60) return 'about ' + min + ' minutes';
    var h = min / 60, whole = Math.floor(h), rest = h - whole;
    var half = (rest >= 0.25 && rest < 0.75);
    if (rest >= 0.75) { whole += 1; half = false; }
    return 'about ' + whole + (half ? ' and a half' : '') + ' hours';
  }

  /* sayIt(blocks) -- the line the offer wears. Two sentences at most: how long
     the walk is, and whether the day can hold it. draft:true. */
  function sayIt(blocks, o) {
    var r = insideADay(blocks, o);
    if (!blocks) return null;                       /* right here: say nothing */
    var s = hoursWord(r.oneWay) + ' on foot, ' + hoursWord(r.roundTrip) + ' there and back';
    if (!r.fits) s += '. You will not be back inside a day';
    return s;                                                    /* draft:true */
  }

  var API = {
    METRES_PER_MINUTE: METRES_PER_MINUTE, METRES_PER_BLOCK: METRES_PER_BLOCK,
    WAKING_HOURS: WAKING_HOURS,
    metresFor: metresFor, minutesFor: minutesFor, thereAndBack: thereAndBack,
    insideADay: insideADay, hoursWord: hoursWord, sayIt: sayIt
  };
  if (HASREQ) module.exports = API; else root.BohemiaReach = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
