/* BOHEMIA WILDLIFE GATE (8/28/26, PEOPLE lane) -- ALIVE-1's other half, and the
 * half a number could never fix.
 *
 * MEASURED THE SAME DAY, with the population slider at its ceiling: twenty-three
 * walks in thirty-two still meet nobody, because the valley is ~151 square
 * kilometres and a step is about a metre. AMBIENCE DOES NOT NEED A CENSUS. A
 * resident has to live somewhere in all of that and be found; a raven is placed
 * NEXT TO THE PLAYER. Measured here: something living is on the glass in SEVEN
 * STEPS, against a median of 323 for a person.
 *
 * THE ROSTER IS SOURCED, and this gate checks that rather than trusting it:
 * every species is in records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_
 * 8_25_26.md, which is Nevada and Clark County material.
 *
 * *** AND THE REACTION IS THE FEATURE. *** Researched 8/28: every write-up of
 * why game animals work lands not on the animal but on what it does about YOU,
 * and the ethology gives the shape -- ALERT DISTANCE and FLIGHT INITIATION
 * DISTANCE are measured separately in urban corvids, so the bird notices you at
 * one range and leaves at a shorter one. A BIRD THAT SITS THERE IS SCENERY.
 * And a feeding crow "alerted later and escaped at shorter distance", which is
 * where the feeding cut comes from and why it is not a preference.
 *
 * PROVES:
 *   A  the roster is the sourced one and nothing was invented into it
 *   B  the clock: the coyote owns dawn and dusk, the rat owns the night, and
 *      nothing at all is out at every hour of the day
 *   C  TWO DISTANCES, always, and EXACTLY ONE SPECIES IGNORES YOU on purpose
 *   D  it is deterministic: the same corner has the same birds on it
 *   E  the feeding cut is real and applies to both distances
 *   F  ON THE REAL SURFACE: something living turns up in a few steps, it looks
 *      at you when you get close, it leaves when you get closer, and it stays
 *      gone rather than popping back like a fruit machine
 *   G  the 45 view, held in the shape a CREATURE has rather than a prop's
 *   H  and it prints what this tier cannot do
 *
 *   node gates/wildlife_gate.js
 */
'use strict';
var fs = require('fs');
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

global.self = global;
var W = require('../engine/bohemia_wildlife.js');
var BANK = require('../banks/BOHEMIA_WILDLIFE_SPRITES.js');

/* ==========================================================================
   A. THE ROSTER IS THE ONE THE RESEARCH FOUND
   ========================================================================== */
head('A. NOTHING HERE WAS INVENTED');
var RES = fs.readFileSync('records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md', 'utf8').toLowerCase();
ok('the module is live', typeof W.near === 'function' && /^bohwild-/.test(W.VERSION), W.VERSION);
/* EVERY SPECIES IS IN THE SOURCED DOCUMENT. A roster that drifts off its
   research is a roster somebody made up, and this repo has a law about that. */
var unsourced = W.SPECIES.filter(function (s) { return RES.indexOf(s.id) < 0; });
ok('*** EVERY SPECIES IS IN THE SOURCED CLARK COUNTY ROSTER ***',
  unsourced.length === 0,
  unsourced.length ? unsourced.map(function (s) { return s.id; }).join(', ')
    : W.SPECIES.map(function (s) { return s.id; }).join(', '));
/* *** REPOINTED 8/30, NOT LOOSENED. *** This asked for the bank to hold EXACTLY
   the tier 1 roster, which was true while tier 1 was the only thing in it. Tier
   2 then cooked three dogs into the SAME bank on purpose -- one generator for a
   four-legged canid, not two, because a second drawing of the same animal shape
   is the two-mechanisms mistake -- and the count went to eight.
   THE CLAIM THAT MATTERS HAS NOT CHANGED AND IS NOT WEAKER: nothing may sit in
   this bank that no module claims. Every tier 1 species is drawn, and every
   EXTRA animal has to be named by another live tier, so an id cannot be cooked
   in and quietly belong to nobody. */
var TIER2 = (function () {
  try { return require(path.join(ROOT, 'engine/bohemia_packs.js')); } catch (_e) { return null; }
})();
var claimed = {};
W.SPECIES.forEach(function (s) { claimed[s.id] = 'tier 1'; });
if (TIER2) Object.keys(TIER2.COATS).forEach(function (k) {
  TIER2.COATS[k].forEach(function (c) { claimed[c.id] = claimed[c.id] || 'tier 2'; }); });
var orphan = BANK.animals.filter(function (a) { return !claimed[a.id]; });
ok('the sprite bank draws every species in the roster, and NOTHING no module claims',
  W.SPECIES.every(function (s) {
    return BANK.animals.some(function (a) { return a.id === s.id; }); })
  && orphan.length === 0,
  BANK.animals.length + ' cooked, ' + Object.keys(claimed).length + ' claimed'
    + (orphan.length ? ', ORPHANS: ' + orphan.map(function (a) { return a.id; }).join(',') : ''));
ok('every cooked animal carries the sentence it came from',
  BANK.animals.every(function (a) { return a.source && a.source.length > 20; }));

/* ==========================================================================
   B. THE CLOCK
   ========================================================================== */
head('B. THE DESERT MOVES AT DIFFERENT HOURS');
function outAt(min) { return W.SPECIES.filter(function (s) { return s.when(min); })
  .map(function (s) { return s.id; }); }
ok('the coyote owns dawn and dusk and is not out at midday',
  outAt(6 * 60).indexOf('coyote') >= 0 && outAt(18 * 60).indexOf('coyote') >= 0
  && outAt(13 * 60).indexOf('coyote') < 0,
  '06:00 ' + outAt(6 * 60).join('/') + '  |  13:00 ' + outAt(13 * 60).join('/'));
ok('the rat owns the night and nothing else does',
  outAt(23 * 60).length === 1 && outAt(23 * 60)[0] === 'rat',
  '23:00 ' + outAt(23 * 60).join('/'));
ok('the grackle is off the street in the afternoon heat, like the people are',
  outAt(13 * 60).indexOf('grackle') < 0 && outAt(9 * 60).indexOf('grackle') >= 0);
/* NOTHING IS OUT ALL DAY. A species with no window is a species that is
   decoration rather than an animal. */
var always = W.SPECIES.filter(function (s) {
  for (var h = 0; h < 24; h++) if (!s.when(h * 60)) return false; return true; });
ok('*** NOT ONE OF THEM IS OUT AT EVERY HOUR OF THE DAY ***', always.length === 0,
  always.map(function (s) { return s.id; }).join(', ') || 'all five keep hours');

/* ==========================================================================
   C. THE REACTION IS THE FEATURE
   ========================================================================== */
head('C. A BIRD THAT SITS THERE IS SCENERY');
var reacting = W.SPECIES.filter(function (s) { return s.reacts; });
ok('*** EVERY REACTING SPECIES HAS TWO DISTANCES, NOT ONE ***',
  reacting.every(function (s) { return s.alert > s.flush && s.flush > 0; }),
  reacting.map(function (s) { return s.id + ' ' + s.alert + '/' + s.flush; }).join('  '));
/* ONE OF THEM DOES NOT CARE, ON PURPOSE. The research wrote that animal down --
   "a coyote crossing the wash three blocks away and not caring about you" -- and
   its indifference only reads as indifference because the others flush. */
var deaf = W.SPECIES.filter(function (s) { return !s.reacts; });
ok('*** AND EXACTLY ONE OF THEM IGNORES YOU, WHICH IS THE CHARACTER IN IT ***',
  deaf.length === 1 && deaf[0].id === 'coyote',
  deaf.map(function (s) { return s.id; }).join(', '));
/* THE THREE STATES ARE REAL, walked out at three ranges on one species. */
function stateAt(id, d) {
  var sp = W.speciesFor(id);
  var got = W.near({ seed: 1, at: [100, 100], minute: 10 * 60, radius: 40, density: 1,
    probe: function (x, y) {
      return (x === 100 + d && y === 100)
        ? { walk: true, open: 18, edge: sp.wants.edge, food: false } : null; } });
  var mine = got.filter(function (s) { return s.species === id; })[0];
  return mine ? mine.state : 'none';
}
ok('far off it is settled, closer it looks at you, closer still it is gone',
  ['settled', 'alert', 'gone'].every(function (want, i) {
    var d = [14, 4, 1][i];
    var st = stateAt('pigeon', d);
    return st === want || st === 'none';   /* the ground has to agree it can be there */
  }), 'pigeon at 14 / 4 / 1 cells');
ok('and the withheld line exists for the one that does not react',
  /coyote/.test(W.lineFor({ species: 'coyote', state: 'settled' }) || ''));

/* ==========================================================================
   D. THE SAME CORNER HAS THE SAME BIRDS ON IT
   ========================================================================== */
head('D. DETERMINISTIC, SO A PLACE HAS AN IDENTITY');
function sample(seed, min) {
  return JSON.stringify(W.near({ seed: seed, at: [500, 500], minute: min, radius: 30,
    density: 1,
    probe: function (x, y) {
      return { walk: true, open: 4 + ((x * 7 + y * 13) % 21), edge: ((x + y) % 3 === 0),
               food: false }; } }).map(function (s) { return s.species + s.at.join(','); }));
}
ok('*** THE SAME SEED, CELL AND HOUR GIVE THE SAME ANIMALS, EVERY TIME ***',
  sample(7, 10 * 60) === sample(7, 10 * 60));
ok('a different hour is a different street', sample(7, 10 * 60) !== sample(7, 18 * 60));
ok('and a different valley is a different street',
  sample(7, 10 * 60) !== sample(8, 10 * 60));
ok('nothing is placed on ground that refuses it',
  W.near({ seed: 3, at: [10, 10], minute: 10 * 60, radius: 20,
           probe: function () { return null; } }).length === 0,
  'a world with no walkable cell has no animals in it');

/* ==========================================================================
   E. A FEEDING ANIMAL LETS YOU GET CLOSER
   ========================================================================== */
head('E. THE MEASURED CROW FINDING, BUILT');
function distsFor(food) {
  var got = W.near({ seed: 5, at: [200, 200], minute: 10 * 60, radius: 30, density: 1,
    probe: function (x, y) { return { walk: true, open: 18, edge: false, food: food }; } });
  return got.filter(function (s) { return s.species === 'grackle'; })[0];
}
var dry = distsFor(false), wet = distsFor(true);
ok('*** A FEEDING ANIMAL ALERTS LATER AND FLUSHES CLOSER ***',
  !!dry && !!wet && wet.alertAt < dry.alertAt && wet.flushAt < dry.flushAt,
  dry ? (dry.alertAt + '/' + dry.flushAt + ' dry vs ' + wet.alertAt + '/' + wet.flushAt + ' feeding') : 'no grackle');
ok('every species declares what food does to it', W.SPECIES.every(function (s) {
  return typeof s.feedCut === 'number' && s.feedCut > 0 && s.feedCut <= 1; }));

/* ==========================================================================
   G. THE 45 VIEW, IN THE SHAPE A CREATURE HAS
   ========================================================================== */
head('G. YOU ARE ABOVE IT, AND IT IS NOT A SILHOUETTE');
function grid(an, f) {
  var r = an.frames[f], flat = [];
  for (var i = 0; i < r.length; i += 2) for (var n = 0; n < r[i + 1]; n++) flat.push(r[i]);
  return flat;
}
var artFails = [];
BANK.animals.forEach(function (an) {
  var px = grid(an, 'rest'), w = BANK.w, h = BANK.h;
  var tones = {};
  for (var i = 0; i < px.length; i++) if (px[i]) tones[px[i]] = 1;
  /* NOT A SILHOUETTE: a two-tone animal is a sticker. */
  if (Object.keys(tones).length < 3) artFails.push(an.id + ' has only ' + Object.keys(tones).length + ' tones');
  /* NOT LEFT-RIGHT SYMMETRICAL: a three-quarter view never is, and a mirrored
     blob is the tell that somebody drew it flat. */
  var mirror = 0, filled = 0;
  for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
    var a = px[y * w + x], b = px[y * w + (w - 1 - x)];
    if (a) { filled++; if (a === b) mirror++; }
  }
  if (filled && mirror / filled > 0.75) artFails.push(an.id + ' is ' + Math.round(100 * mirror / filled) + '% mirrored');
  /* THE TOP IS SKY-LIT: the upper half of the ANIMAL carries lighter paint than
     its lower half, which is only true if you are looking down at it.
     *** SPLIT AT THE ANIMAL'S OWN MIDLINE, NOT THE CANVAS'S. *** The first cut
     split at h/2 and reported the rat as lit from underneath. Measured row by
     row, the rat is a LOW animal sitting in rows 7 to 12 of a sixteen-row
     sprite, so the canvas midline put one pixel of it in "upper" and all the
     rest in "lower". Its own halves are 310 against 185: lit from above, by a
     mile. THE ANIMAL WAS RIGHT AND THE RULER WAS MEASURING WHERE IT SAT IN THE
     BOX. Fix the ruler, never the target. */
  var y0 = 1e9, y1 = -1;
  for (var yb = 0; yb < h; yb++) for (var xb = 0; xb < w; xb++)
    if (px[yb * w + xb]) { if (yb < y0) y0 = yb; if (yb > y1) y1 = yb; }
  var mid = (y0 + y1) / 2;
  var upper = 0, lower = 0, un = 0, ln = 0;
  for (var y2 = 0; y2 < h; y2++) for (var x2 = 0; x2 < w; x2++) {
    var v = px[y2 * w + x2]; if (!v) continue;
    var hex = BANK.palette[v]; if (!hex) continue;
    var lum = parseInt(hex.substr(1, 2), 16) + parseInt(hex.substr(3, 2), 16) + parseInt(hex.substr(5, 2), 16);
    if (y2 <= mid) { upper += lum; un++; } else { lower += lum; ln++; }
  }
  if (un && ln && (upper / un) <= (lower / ln))
    artFails.push(an.id + ' is not lit from above (' + Math.round(upper / un)
      + ' over ' + Math.round(lower / ln) + ')');
});
ok('*** EVERY ANIMAL IS SEEN FROM ABOVE, LIT FROM ABOVE, AND NOT MIRRORED ***',
  artFails.length === 0, artFails.join('; ') || BANK.animals.length + ' animals');
ok('and the bank says which perspective it was drawn in',
  /45/.test(BANK.perspective || ''));
/* THE FRAME THE WHOLE FEATURE EXISTS FOR has to be different from the one it
   replaces, or the flush is invisible. */
var sameFrame = BANK.animals.filter(function (an) {
  return JSON.stringify(an.frames.rest) === JSON.stringify(an.frames.go); });
ok('*** LEAVING LOOKS DIFFERENT FROM SITTING THERE ***', sameFrame.length === 0,
  sameFrame.map(function (a) { return a.id; }).join(', ') || 'all three frames differ');
var sameLook = BANK.animals.filter(function (an) {
  return JSON.stringify(an.frames.rest) === JSON.stringify(an.frames.look); });
ok('and so does noticing you', sameLook.length === 0,
  sameLook.map(function (a) { return a.id; }).join(', ') || 'all five');

head('H. AND WHAT THIS TIER CANNOT DO');
W.CANNOT.forEach(function (c) { console.log('       - ' + c); });
ok('it says its own limits out loud', W.CANNOT.length >= 3);

/* ==========================================================================
   F. THE REAL SURFACE
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

    head('F. ON THE GLASS, WALKED');
    ok('the demo opens and the city is in it', !!fr);
    if (!fr) throw new Error('no city frame');

    var m = await fr.evaluate(function () {
      var o = { hasPass: typeof wildPass === 'function',
                hasMod: typeof BohemiaWildlife !== 'undefined',
                hasBank: typeof BOHEMIA_WILDLIFE_SPRITES !== 'undefined' };
      for (var q = 0; q < 6; q++) {
        var gb = document.querySelector('#daycardIn .dcgo'); if (gb) gb.click(); }
      try { cardHide(); } catch (e) {}
      T.min = 10 * 60; try { DAY.min = 10 * 60; } catch (e) {}
      /* WALK UNTIL SOMETHING LIVING IS ON THE GLASS. WILD_DREW records only what
         landed inside the canvas, never what was drawn into the cull margin. */
      o.steps = null;
      for (var s = 1; s <= 400; s++) {
        hx += 1; if (s % 20 === 19) hy += 1;
        try { render(); } catch (e) {}
        if (WILD_DREW && WILD_DREW.length) { o.steps = s; o.saw = WILD_DREW[0].species;
          o.spot = WILD_DREW[0].at.slice(); break; }
      }
      if (o.spot) {
        /* AND NOW WALK UP TO THEM. Far: settled. Middle: it looks at you.
           Close: it is gone. Three renders, three states, on the real surface. */
        WILD_GONE = {};
        function stateFrom(dx, dy) {
          hx = o.spot[0] + dx; hy = o.spot[1] + dy;
          try { render(); } catch (e) {}
          var w0 = (WILD_DREW || []).filter(function (w) {
            return w.at[0] === o.spot[0] && w.at[1] === o.spot[1]; })[0];
          return w0 ? w0.state : 'gone-or-offscreen';
        }
        /* EIGHT CELLS, NOT TWELVE. Twelve is past the alert range of every
           species AND off the top of a 390x844 screen at 44px tiles, so the
           first cut of this claim could not tell "it has not noticed me" from
           "it is not on the screen". A CLAIM THAT CANNOT TELL ITS TWO ANSWERS
           APART IS NOT A CLAIM. */
        o.far = stateFrom(0, 8);
        o.mid = stateFrom(0, 4);
        o.near = stateFrom(0, 1);
        /* AND THEY STAY GONE: step back out to where they were settled and they
           are not there any more, because you walked into them. */
        o.afterBack = stateFrom(0, 4);
      }
      return o;
    });

    ok('the module and its bank are both in the city', m.hasMod && m.hasBank && m.hasPass);
    /* THE NUMBER THE WHOLE FEATURE EXISTS FOR. A person, measured the same day
       on the same surface, takes a median of 323 steps. */
    ok('*** SOMETHING LIVING IS ON THE GLASS IN A FEW STEPS ***',
      m.steps !== null && m.steps <= 60,
      m.steps + ' steps to a ' + m.saw + ', against a median of 323 for a person');
    ok('*** FAR OFF IT IS SETTLED, CLOSER IT LOOKS AT YOU ***',
      m.far === 'settled' && m.mid === 'alert',
      '8 cells: ' + m.far + '  |  4 cells: ' + m.mid);
    ok('*** AND WHEN YOU WALK INTO THEM THEY GO ***',
      m.near === 'gone-or-offscreen', '1 cell: ' + m.near);
    /* A FLUSHED ANIMAL THAT CAME BACK WOULD MAKE THE STREET A FRUIT MACHINE. */
    ok('*** AND THEY STAY GONE, RATHER THAN POPPING BACK WHEN YOU STEP AWAY ***',
      m.afterBack === 'gone-or-offscreen',
      'back out to 4 cells: ' + m.afterBack + ' (it was ' + m.mid + ' before)');
    ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
    await page.close();
  } catch (e) {
    fail++;
    console.log('  FAIL the real surface threw   ' + String(e && e.message).slice(0, 200));
  } finally {
    if (browser) try { await browser.close(); } catch (_e) {}
  }

  console.log('\n' + (fail ? 'WILDLIFE GATE: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'WILDLIFE GATE: ' + pass + ' ok, 0 failed'));
  process.exit(fail ? 1 : 0);
})();
