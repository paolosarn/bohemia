/* BOHEMIA ALIVE GATE (8/28/26, PEOPLE lane) -- backlog row ALIVE-1, the loudest
 * complaint on his 8/25 playtest dispatch, and the slider was never the answer.
 *
 * HIS WORDS: "I THINK I SAW ONE WATCH PERSON ON ACCIDENT ... THE CITY SEEMS DEAD
 * ASF AND I DONT LIKE THIS BEING THE DEFAULT I KNOW WE HAVE A SLIDER AND SHIT
 * BUT YEAH MAN."
 *
 * THE METRIC IS HIS ROW'S OWN SENTENCE, not a head count: "he walks one block
 * and sees somebody WITHOUT HUNTING FOR IT." So this gate WALKS. Eight starting
 * points around the spawn, four directions each, up to 800 steps per walk,
 * counting every body the surface actually blitted, and excluding the one
 * authored neighbour who is pinned to the spawn and would otherwise answer every
 * question before it is asked.
 *
 * MEASURED BEFORE ANY OF IT CHANGED:
 *     dial  1 (what shipped)   0 of 32 walks met a single stranger
 *     dial 20 (this)           6 of 32,  median 323 steps
 *     dial 32 (the ceiling)    9 of 32,  median 261 steps
 *     frame cost, 1 -> 32      0.5 ms -> 0.8 ms
 *
 * AND IT WAS NONE OF THE THINGS IT LOOKED LIKE, each checked on its own: not the
 * draw path (stand two cells from anybody and they are drawn), not the census
 * (the dial scales it exactly), not the hour, not the draw budget, and not
 * performance.
 *
 * PROVES:
 *   A  the default is one of the module's OWN landmarks, never a typed number,
 *      and the bottom of the slider still reaches a ghost valley
 *   B  the day has a real shape: nobody outdoors at night, two thirds outdoors
 *      mid-morning, and the valley empties in the afternoon heat
 *   C  ON THE REAL SURFACE: a walk meets a stranger, which it did not before
 *   D  and it costs the frame nothing
 *   E  AND THE GATE SAYS WHAT IT CANNOT FIX, out loud, so the next session does
 *      not turn this knob again and call the job done
 *
 *   node gates/alive_gate.js
 */
'use strict';
var path = require('path');
var ROOT = path.dirname(__dirname);
process.chdir(ROOT);

var pass = 0, fail = 0;
function ok(name, cond, detail) {
  if (typeof cond === 'string') throw new Error('GATE BUG: ok() got a STRING as its condition.');
  if (cond) { pass++; console.log('  ok   ' + name + (detail ? '   ' + detail : '')); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '   ' + detail : '')); }
}
function head(s) { console.log('\n' + s); }

global.window = global;
var POP = require('../engine/bohemia_population.js');

/* ==========================================================================
   A. THE NUMBER IS HIS, AND IT IS ONE OF HIS OWN ANSWERS
   ========================================================================== */
head('A. THE DEFAULT');
ok('*** THE SHIPPED DEFAULT IS ONE OF THE MODULE\'S OWN LANDMARKS ***',
  POP.dial() === POP.LANDMARK.story,
  'dial ' + POP.dial() + ' = the story landmark, GDD v5\'s ~69,000');
/* THE OLD DEFAULT IS STILL ON THE TABLE, by name, because he may want it back
   and a landmark he cannot name is a landmark he cannot choose. */
ok('and the four answers are all still there to move it to',
  POP.LANDMARK.nobody === 0 && POP.LANDMARK.today === 1
  && POP.LANDMARK.scale === 1.1 && POP.LANDMARK.story === 20,
  'nobody 0 / today 1 / scale 1.1 / story 20');
ok('the bottom of the slider still reaches a ghost valley',
  POP.DIAL_MIN === 0 && POP.dialForAct !== undefined);
/* NEVER RETYPED. This file's own dial note once said 19 when the truth was 1.1. */
var src = require('fs').readFileSync('engine/bohemia_population.js', 'utf8');
ok('*** AND IT IS TIED TO THE TABLE, NOT TYPED IN TWICE ***',
  /DIAL = LANDMARK\.story;/.test(src));

/* ==========================================================================
   B..E  THE REAL SURFACE
   ========================================================================== */
function requirePlaywright() {
  for (var i = 0, g = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']; i < g.length; i++) {
    try { return require(path.join(g[i], 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
var SETTLE = require(__dirname + '/bohemia_settle.js').settle;
var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

(async function () {
  var browser = null;
  try {
    browser = await requirePlaywright().chromium.launch({ args: ['--no-sandbox'] });
    var page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    var errs = [];
    page.on('pageerror', function (e) { errs.push(String(e.message).slice(0, 140)); });
    await page.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_DEMO.html'));
    await SETTLE(page, 15000);
    await page.evaluate(function () {
      var f = document.getElementById('fronttap') || document.getElementById('front');
      if (f) f.click(); });
    await SETTLE(page, 12000);
    await wait(3000);
    var fr = page.frames().filter(function (x) { return /BOHEMIA_CITY_WORLD/.test(x.url()); })[0];
    ok('the demo opens and the city is in it', !!fr);
    if (!fr) throw new Error('no city frame');

    var m = await fr.evaluate(function () {
      var x0 = hx, y0 = hy, m0 = T.min;
      var o = { dialOnTheSurface: BohemiaPopulation.dial() };

      /* ---- B. THE SHAPE OF A DAY ---------------------------------------- */
      var here = ctBlockOf(x0, y0), pool = [];
      for (var dx = -1; dx <= 1; dx++) for (var dy = -1; dy <= 1; dy++) {
        var L = pplPeople(here[0] + dx, here[1] + dy) || [];
        for (var i = 0; i < L.length; i++) pool.push(L[i]);
      }
      o.pool = pool.length;
      o.outPct = {};
      [2, 10, 13, 17, 22].forEach(function (h) {
        T.min = h * 60; try { DAY.min = h * 60; } catch (e) {}
        var out = 0;
        for (var i = 0; i < pool.length; i++) {
          var p = pool[i], at = pplAt(p);
          if (at[0] !== p.home[0] || at[1] !== p.home[1]) out++;
        }
        o.outPct[h] = Math.round(100 * out / Math.max(1, pool.length));
      });

      /* ---- C + D. THE WALK, WHICH IS THE ROW'S OWN SENTENCE -------------- */
      T.min = 10 * 60; try { DAY.min = 10 * 60; } catch (e) {}
      hx = x0; hy = y0;
      try { render(); } catch (e) {}
      /* WHOEVER IS ON SCREEN BEFORE A SINGLE STEP IS THE AUTHORED NEIGHBOUR, and
         counting them would answer the question before it is asked. */
      var pinned = {};
      (BARK_DREW || []).forEach(function (d) {
        var q = d && d.p ? d.p : d; if (q && q.id != null) pinned[q.id] = 1; });
      o.pinned = Object.keys(pinned).length;

      var STARTS = [[0,0],[300,0],[-300,0],[0,300],[0,-300],[220,220],[-220,220],[220,-220]];
      var DIRS = [[1,0],[0,1],[-1,0],[0,-1]];
      var met = 0, walks = 0, steps = [], seen = {}, ft = [];
      for (var a = 0; a < STARTS.length; a++) for (var d2 = 0; d2 < DIRS.length; d2++) {
        hx = x0 + STARTS[a][0]; hy = y0 + STARTS[a][1];
        walks++;
        var at = null;
        for (var s = 1; s <= 800; s++) {
          hx += DIRS[d2][0]; hy += DIRS[d2][1];
          var t0 = performance.now();
          try { render(); } catch (e) {}
          ft.push(performance.now() - t0);
          var dr = (typeof BARK_DREW !== 'undefined' && BARK_DREW) ? BARK_DREW : [];
          for (var j = 0; j < dr.length; j++) {
            var q = dr[j] && dr[j].p ? dr[j].p : dr[j];
            if (!q || q.id == null || pinned[q.id]) continue;
            seen[q.id] = 1; if (at === null) at = s;
          }
          if (at !== null) break;
        }
        if (at !== null) { met++; steps.push(at); }
      }
      steps.sort(function (p, q) { return p - q; });
      ft.sort(function (p, q) { return p - q; });
      o.walks = walks; o.met = met;
      o.medianSteps = steps.length ? steps[Math.floor(steps.length / 2)] : null;
      o.bestCase = steps.length ? steps[0] : null;
      o.strangers = Object.keys(seen).length;
      o.medianFrameMs = +ft[Math.floor(ft.length / 2)].toFixed(2);
      o.p95FrameMs = +ft[Math.floor(ft.length * 0.95)].toFixed(2);
      o.censusPerBlock = (pplPeople(here[0], here[1]) || []).length;

      BohemiaPopulation.setDial(o.dialOnTheSurface);
      hx = x0; hy = y0; T.min = m0;
      return o;
    });

    head('B. A DAY HAS A SHAPE, AND IT ALWAYS DID');
    ok('the surface runs at the module\'s default, not something the page reset',
      m.dialOnTheSurface === POP.LANDMARK.story, 'dial ' + m.dialOnTheSurface);
    ok('the neighbourhood the player wakes up in has people in it',
      m.pool >= 30 && m.censusPerBlock >= 15,
      m.pool + ' in the 3x3, ' + m.censusPerBlock + ' in his own block');
    /* THE SCHEDULE WAS NEVER THE BUG. This is here so the next session does not
       go looking for one: at 02:00 the valley is indoors, mid-morning two
       thirds of it is outdoors, and the afternoon heat empties it again. */
    ok('*** NOBODY IS OUTDOORS AT TWO IN THE MORNING ***', m.outPct[2] === 0,
      m.outPct[2] + '%');
    ok('*** AND MID-MORNING MOST OF THE VALLEY IS OUTSIDE ***', m.outPct[10] >= 50,
      m.outPct[10] + '% at 10:00, ' + m.outPct[17] + '% at 17:00');
    ok('and the afternoon heat drives them back in, which is the point of that rule',
      m.outPct[13] < m.outPct[10] / 2, m.outPct[13] + '% at 13:00');

    head('C. THE ROW\'S OWN SENTENCE: HE SEES SOMEBODY WITHOUT HUNTING');
    ok('the authored neighbour is excluded, so this measures strangers only',
      m.pinned === 1, m.pinned + ' body on screen before a single step');
    /* THE CLAIM THAT WAS RED BEFORE THIS SHIPPED. At the old default this number
       was ZERO: thirty-two walks, up to twenty-five thousand steps, nobody. */
    ok('*** A WALK MEETS A STRANGER, WHICH IT DID NOT BEFORE ***',
      m.met > 0 && m.strangers > 0,
      m.met + ' of ' + m.walks + ' walks, ' + m.strangers + ' different people');
    ok('and it can happen inside a block, not only at the far end of one',
      m.bestCase !== null && m.bestCase <= 60, 'closest meeting: ' + m.bestCase + ' steps');

    head('D. AND IT COSTS THE FRAME NOTHING');
    ok('*** A FULLER VALLEY IS NOT PAID FOR WITH THE FRAME ***',
      m.medianFrameMs < 4, 'median ' + m.medianFrameMs + ' ms, p95 ' + m.p95FrameMs + ' ms');
    ok('nothing threw across the whole sweep', errs.length === 0, errs.slice(0, 2).join(' | '));

    head('E. AND WHAT THIS DOES NOT FIX, SAID OUT LOUD');
    console.log('       Measured at the TOP of the slider (dial 32, ~96,885 people):');
    console.log('       9 of 32 walks met somebody, median 261 steps. TWENTY-THREE');
    console.log('       WALKS IN THIRTY-TWO STILL MEET NOBODY at the ceiling.');
    console.log('       The valley is ~151 square km and a step is about a metre, so');
    console.log('       no value of this number makes a street feel inhabited.');
    console.log('       WHAT IS LEFT IS NOT A COUNT, IT IS WHERE: this module already');
    console.log('       sorts people cluster / spread / loner, and the demo walks a');
    console.log('       SPREAD suburb. And the 7/27 ambient encounter director is');
    console.log('       APPROVED, has a coyote in it, and is wired ONLY to overmap');
    console.log('       travel -- it has never fired for somebody on foot.');
    ok('this gate does not pretend the row is closed',
      m.met < m.walks, m.walks - m.met + ' of ' + m.walks + ' walks still meet nobody');

    await page.close();
  } catch (e) {
    fail++;
    console.log('  FAIL the real surface threw   ' + String(e && e.message).slice(0, 200));
  } finally {
    if (browser) try { await browser.close(); } catch (_e) {}
  }

  console.log('\n' + (fail ? 'ALIVE GATE: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'ALIVE GATE: ' + pass + ' ok, 0 failed'));
  process.exit(fail ? 1 : 0);
})();
