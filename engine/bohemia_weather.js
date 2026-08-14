// BOHEMIA WEATHER — Vegas weather, which is barely any weather. (8/11/26, WORLD lane.)
//
// RULED 7/28, LOCKED: laws/BOHEMIA_ADDENDUM_VEGAS_WEATHER_7_28_26.md
//
//   "Weather yes please however vegas weather is just mostly sunny then mostly cloudy and
//    maybe it rains once a month fr so. Weather not too diverse but yeah. Plus alot of
//    foliage is going to be dead anyway."  -- Paolo
//
// THE WHOLE VOCABULARY IS THREE WORDS AND THE LAW IS "NOT TOO DIVERSE":
//     SUNNY   the default, most days
//     CLOUDY  the second state, common enough to notice
//     RAIN    RARE -- Vegas-rare, about once a month of game time, and an EVENT precisely
//             because it almost never happens
// The addendum says it outright: "Anyone proposing a fourth weather type is violating this
// addendum, not extending it." There is no snow, no fog, no storm ladder, no seasons. The
// gate holds the list at three so a later session cannot quietly grow one.
//
// GROUNDED IN THE REAL, which is why the ratio is what it is: Las Vegas runs about 300
// sunny days and roughly two dozen rain days a year, and monsoon rain arrives as a short
// loud event rather than a grey afternoon. So rain here is ~1 day in 30, and when it comes
// it is over quickly.
//
// DEAD FOLIAGE IS THE BASELINE, NOT A WEATHER EFFECT (his point 3, and it is the one a
// weather system would get wrong by default): "a lot of foliage is going to be dead
// anyway". Rain on a dead valley WETS THE GROUND. It does not revive anything, it does not
// green a lawn, and there is deliberately no growth, bloom or recovery hook in this file
// for a later session to reach for.
//
// IT COMPOSES WITH THE DAY CYCLE, IT DOES NOT COMPETE WITH IT (his point 5, verbatim: "wire
// together, not as rivals"). bohemia_daycycle.js already owns what colour the light is at a
// given hour and it stays the single source of that. Weather only ever ATTENUATES what the
// day cycle already decided -- cloud flattens and cools it, rain flattens it further -- so
// there is exactly one place that knows what noon looks like. A weather module that
// returned its own absolute light would be a second sun.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: the state machine and the transition timing are the
// fleet's; the DISTRIBUTION is his ruling and ships as this table's contents, tunable only
// while it still feels like "it rains about once a month for real".
(function (root) {
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var DAY = HASREQ ? require('./bohemia_daycycle.js')
    : (root.BOH_DAYCYCLE || (typeof BOH_DAYCYCLE !== 'undefined' ? BOH_DAYCYCLE : null));

  var SUNNY = 'SUNNY', CLOUDY = 'CLOUDY', RAIN = 'RAIN';
  var STATES = [SUNNY, CLOUDY, RAIN];        // THREE. Not four. Ever.

  /* HIS DISTRIBUTION, as contents. Days out of thirty, straight off the real valley and his
     "once a month fr": rain is one day in thirty and short; cloudy is common enough to
     notice; everything else is sun. */
  var DIST = { SUNNY: 22, CLOUDY: 7, RAIN: 1 };

  /* A RAIN DAY IS NOT A RAIN DAY. Monsoon rain in the Mojave is a short loud event, so when
     a day rolls RAIN it rains for a WINDOW inside that day and is otherwise cloudy. This is
     the difference between "it rained today" and "today was rain", and it is the whole
     reason rain reads as an event. */
  var RAIN_WINDOW = 0.10;                    // ~2.4 hours of a day

  function hash(a, b) {
    var h = ((a >>> 0) * 0x9E3779B1 + (b >>> 0) * 0x85EBCA6B) >>> 0;
    h ^= h >>> 16; h = Math.imul(h, 0x85EBCA6B) >>> 0;
    h ^= h >>> 13; h = Math.imul(h, 0xC2B2AE35) >>> 0;
    h ^= h >>> 16;
    return h >>> 0;
  }

  /* THE DAY'S WEATHER IS DERIVED FROM THE DAY, not stored and not rolled live. Same seed
     and same day always gives the same sky, on every device and after any reload, which is
     what lets the resolver fast-forward a week and still agree with what the player saw. */
  function dayState(seed, day) {
    var total = DIST.SUNNY + DIST.CLOUDY + DIST.RAIN;
    var r = hash(seed >>> 0, day >>> 0) % total;
    if (r < DIST.RAIN) return RAIN;
    if (r < DIST.RAIN + DIST.CLOUDY) return CLOUDY;
    return SUNNY;
  }

  /* WHAT IT IS DOING RIGHT NOW. t is the day fraction the day cycle already uses (0..1), so
     both systems read the same clock rather than each keeping their own. */
  function at(seed, day, t) {
    var st = dayState(seed, day);
    if (st !== RAIN) return { state: st, raining: false, day: day };
    /* the window sits where Mojave monsoon rain actually falls: afternoon into evening,
       nudged by the day's own hash so it is not the same hour every time. */
    var start = 0.55 + (hash(seed >>> 0, (day ^ 0xBEEF) >>> 0) % 1000) / 1000 * 0.25;
    var raining = t >= start && t < start + RAIN_WINDOW;
    return { state: st, raining: raining, day: day,
             window: [start, start + RAIN_WINDOW] };
  }

  /* THE LIGHT. ATTENUATION ONLY -- the day cycle decides what colour the hour is and this
     never overrides it. Cloud flattens and cools; rain flattens further. A weather module
     that returned an absolute colour would be a second sun and the two would drift. */
  var CLOUD_MULT = [0.86, 0.88, 0.94];       // cools as it dims: sky light, not lamp light
  var RAIN_MULT = [0.74, 0.77, 0.86];

  function ambient(seed, day, t) {
    if (!DAY) return null;
    var base = DAY.ambientAt(t);
    var w = at(seed, day, t);
    var m = w.raining ? RAIN_MULT : (w.state === CLOUDY ? CLOUD_MULT : null);
    if (!m) return base.slice();
    return [base[0] * m[0], base[1] * m[1], base[2] * m[2]];
  }

  /* GROUND WETNESS, 0..1. Rain wets the ground and the ground dries out again -- in this
     valley, fast. NOTHING ELSE HAPPENS: no growth, no green, no recovery. His point 3 is
     the reason there is no other output on this function. */
  var DRY_HOURS = 3.5;
  function wetness(seed, day, t) {
    var w = at(seed, day, t);
    if (w.state !== RAIN) return 0;
    if (w.raining) return 1;
    var end = w.window[1];
    if (t < end) return 0;                   // before the rain, still dry
    var since = (t - end) * 24;
    return Math.max(0, 1 - since / DRY_HOURS);
  }

  /* A SANITY READOUT FOR A WHOLE MONTH, so "once a month for real" is measurable rather
     than asserted. The gate uses it; so can anybody tuning the table. */
  function census(seed, days) {
    var out = { SUNNY: 0, CLOUDY: 0, RAIN: 0 };
    for (var d = 0; d < days; d++) out[dayState(seed, d)]++;
    return out;
  }

  var API = {
    SUNNY: SUNNY, CLOUDY: CLOUDY, RAIN: RAIN, STATES: STATES, DIST: DIST,
    RAIN_WINDOW: RAIN_WINDOW, CLOUD_MULT: CLOUD_MULT, RAIN_MULT: RAIN_MULT,
    dayState: dayState, at: at, ambient: ambient, wetness: wetness, census: census
  };
  if (HASREQ) module.exports = API;
  root.BohemiaWeather = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
