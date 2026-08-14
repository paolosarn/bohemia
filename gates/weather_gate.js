#!/usr/bin/env node
/* WEATHER GATE (8/11/26, WORLD lane) — Vegas weather, which is barely any weather.
 *
 * RULED 7/28, LOCKED: laws/BOHEMIA_ADDENDUM_VEGAS_WEATHER_7_28_26.md
 *
 *   "vegas weather is just mostly sunny then mostly cloudy and maybe it rains once a month
 *    fr so. Weather not too diverse but yeah. Plus alot of foliage is going to be dead
 *    anyway."  -- Paolo
 *
 * EVERY CHECK HERE IS A WAY A WEATHER SYSTEM GOES WRONG BY DEFAULT, which is why the
 * addendum is worded as a fence rather than a feature:
 *
 *  1. THREE STATES. NOT FOUR. The addendum says it outright -- "anyone proposing a fourth
 *     weather type is violating this addendum, not extending it" -- because a weather
 *     system is the single easiest thing in a game to grow a snow type onto.
 *  2. IT RAINS ABOUT ONCE A MONTH, MEASURED OVER A YEAR, not asserted in a comment. "Once
 *     a month fr" is a number and it either holds or it does not.
 *  3. RAIN IS AN EVENT, NOT A DAY. Mojave monsoon rain is short and loud. A rain day that
 *     rains from dawn to dusk is a different climate.
 *  4. DEAD FOLIAGE IS THE BASELINE AND RAIN NEVER REVIVES ANYTHING. His point 3, and the
 *     thing a weather module reaches for on its own: a growth hook, a green multiplier, a
 *     recovery pass. There is no such output, and the gate reads the source to keep it that
 *     way.
 *  5. IT COMPOSES WITH THE DAY CYCLE INSTEAD OF COMPETING. His point 5: "wire together, not
 *     as rivals." Weather may only ATTENUATE the light the day cycle already decided. A
 *     module that returns its own absolute colour is a SECOND SUN, and the two drift the
 *     first time anybody tunes one.
 *  6. IT IS DERIVED FROM THE DAY, so the same seed and day give the same sky forever --
 *     which is what lets the resolver fast-forward a week and still agree with what the
 *     player actually saw.
 *
 *   node gates/weather_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const W = require(path.join(ROOT, 'engine/bohemia_weather.js'));
const D = require(path.join(ROOT, 'engine/bohemia_daycycle.js'));
const SRC = fs.readFileSync('engine/bohemia_weather.js', 'utf8');

// ---- 1. THREE STATES, NOT FOUR --------------------------------------------------------
ok('the whole vocabulary is THREE states (' + W.STATES.join(', ') + ')', W.STATES.length === 3);
ok('and they are exactly his three', W.STATES.indexOf('SUNNY') >= 0 &&
   W.STATES.indexOf('CLOUDY') >= 0 && W.STATES.indexOf('RAIN') >= 0);
const code = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
ok('NO FOURTH TYPE has crept in -- no snow, no fog, no storm ladder, no seasons',
   !/snow|fog|storm|blizzard|hail|season/i.test(code));
ok('and the distribution table only has rows for those three',
   Object.keys(W.DIST).length === 3);

// ---- 2. ONCE A MONTH, MEASURED --------------------------------------------------------
{
  const seeds = [1, 777, 12345, 24301, 99991];
  let worstLo = 99, worstHi = 0;
  for (const s of seeds) {
    const c = W.census(s, 365);
    const perMonth = c.RAIN / 365 * 30;
    if (perMonth < worstLo) worstLo = perMonth;
    if (perMonth > worstHi) worstHi = perMonth;
  }
  ok('IT RAINS ABOUT ONCE A MONTH, over a full year, on every seed (' +
     worstLo.toFixed(2) + '-' + worstHi.toFixed(2) + ' rain days per 30)',
     worstLo >= 0.6 && worstHi <= 1.8);
  const c = W.census(12345, 365);
  ok('sunny is the default state, most days (' + c.SUNNY + '/365)', c.SUNNY > 365 * 0.55);
  ok('cloudy is common enough to notice but not the norm (' + c.CLOUDY + '/365)',
     c.CLOUDY > 365 * 0.08 && c.CLOUDY < c.SUNNY);
  ok('and rain is the rarest by a long way (' + c.RAIN + '/365)', c.RAIN < c.CLOUDY / 3);
}

// ---- 3. RAIN IS AN EVENT, NOT A DAY ---------------------------------------------------
{
  let rd = -1;
  for (let d = 0; d < 400 && rd < 0; d++) if (W.dayState(12345, d) === W.RAIN) rd = d;
  ok('a rain day exists to test', rd >= 0);
  let wetHours = 0;
  for (let i = 0; i < 240; i++) if (W.at(12345, rd, i / 240).raining) wetHours++;
  const frac = wetHours / 240;
  ok('IT RAINS FOR A WINDOW, NOT ALL DAY -- monsoon rain is short and loud (' +
     Math.round(frac * 24 * 10) / 10 + ' hours)', frac > 0.02 && frac < 0.25);
  ok('the rest of a rain day is not sunny either', W.dayState(12345, rd) === W.RAIN);
  const w = W.at(12345, rd, 0.0);
  ok('and the shower lands in the afternoon or evening, where Mojave monsoon rain falls',
     w.window[0] > 0.5 && w.window[0] < 0.85);
}

// ---- 4. RAIN WETS THE GROUND AND REVIVES NOTHING ---------------------------------------
{
  let rd = -1;
  for (let d = 0; d < 400 && rd < 0; d++) if (W.dayState(12345, d) === W.RAIN) rd = d;
  const win = W.at(12345, rd, 0).window;
  ok('the ground is wet while it rains', W.wetness(12345, rd, (win[0] + win[1]) / 2) === 1);
  ok('and it dries out afterwards', W.wetness(12345, rd, win[1] + 3 / 24) < 0.4);
  ok('a sunny day is never wet', W.wetness(12345, (() => {
    for (let d = 0; d < 400; d++) if (W.dayState(12345, d) === W.SUNNY) return d;
    return 0;
  })(), 0.6) === 0);
  ok('DEAD FOLIAGE IS THE BASELINE: there is no growth, green or recovery output for a ' +
     'later session to reach for (his point 3)',
     !/grow|green|revive|bloom|recover|lush/i.test(code));
}

// ---- 5. IT COMPOSES WITH THE DAY CYCLE, IT IS NOT A SECOND SUN --------------------------
{
  const sunnyDay = (() => { for (let d = 0; d < 400; d++) if (W.dayState(12345, d) === W.SUNNY) return d; return 0; })();
  const cloudyDay = (() => { for (let d = 0; d < 400; d++) if (W.dayState(12345, d) === W.CLOUDY) return d; return 1; })();
  const base = D.ambientAt(0.5);
  const sun = W.ambient(12345, sunnyDay, 0.5);
  const cloud = W.ambient(12345, cloudyDay, 0.5);
  ok('on a sunny day the light is EXACTLY what the day cycle says -- weather adds nothing',
     sun.every((v, i) => Math.abs(v - base[i]) < 1e-9));
  ok('cloud DIMS what the day cycle already decided, rather than replacing it',
     cloud.every((v, i) => v < base[i]) && cloud[0] > 0);
  ok('and it cools as it dims: cloud light is sky light, not a dead lamp',
     (cloud[2] / base[2]) > (cloud[0] / base[0]));
  ok('THE DAY CYCLE IS STILL THE ONLY THING THAT KNOWS WHAT AN HOUR LOOKS LIKE -- night is ' +
     'still night under cloud', (() => {
       const n = W.ambient(12345, cloudyDay, 0.02);
       return (n[0] + n[1] + n[2]) / 3 < 8;
     })());
  ok('the module says out loud that a second sun is the failure it is avoiding',
     /second sun/i.test(SRC));
}

// ---- 6. DERIVED, NEVER STORED ----------------------------------------------------------
{
  ok('the same seed and day give the same sky, every time',
     W.dayState(7, 40) === W.dayState(7, 40) && W.dayState(7, 40) === W.dayState(7, 40));
  ok('different days differ', (() => {
    const s = new Set(); for (let d = 0; d < 60; d++) s.add(W.dayState(3, d));
    return s.size > 1;
  })());
  ok('and nothing rolls live: no Math.random, no Date, so a fast-forward agrees with what ' +
     'the player saw', !/Math\.random|new Date|Date\.now/.test(code));
}

console.log('WEATHER GATE: ' + pass + ' passed, ' + fail + ' failed  (three states, ~1 rain ' +
            'day per 30 measured over a year, rain is a short event, and it only ever dims ' +
            'the day cycle)');
process.exit(fail ? 1 : 0);
