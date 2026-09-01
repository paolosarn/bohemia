/* BOHEMIA WALK ENCOUNTER GATE (8/31/26, PEOPLE lane) -- ALIVE-3.
 *
 * *** HE APPROVED TWELVE STREET ENCOUNTERS ON 7/26 WITH A PLAIN "Approve all"
 * AND NOT ONE HAD EVER FIRED FOR A PLAYER ON FOOT. *** The director that owns
 * them was pulled from exactly one place, stepOnce's `MODE==='city'` branch,
 * which is overmap travel at ten minutes a cell. The walked surface -- the one
 * he actually plays -- had never called it. That is his own approved content
 * never reaching him, the same shape as the seventeen invisible hats and the
 * four bright garments nobody wore.
 *
 * AND ITEM ONE IS `feral_dog_pack`, ITEM TWO IS `coyote_shadow`, which are the
 * two animals ALIVE-2 shipped the day before. So the binding is not a nicety:
 * two mechanisms that both mean "dogs" do not make variety, they make two
 * different sets of dogs, which is the mistake ONE ID ONE WHOLE PERSON was
 * written about. THE DIRECTOR NEVER INVENTS AN ANIMAL. IT POINTS AT THE ONE
 * THAT IS THERE.
 *
 * PROVES:
 *   A  the table only ever names ids out of HIS approved roster
 *   B  NO GLOBAL SPAWNS EVER: a district with no row spawns nothing
 *   C  ONE OPINION PER PLACE: a road class keeps ROAD_TABLE's own row
 *   D  ON THE REAL SURFACE, THROUGH REAL MOVEMENT: walking fires encounters,
 *      and the two animal tokens point at an animal actually on the glass
 *   E  and it never announces an animal that is not there
 *
 *   node gates/walk_encounter_gate.js
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

var ENC = require(path.join(ROOT, 'engine/bohemia_encounters.js'));
var CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

head('A. NOTHING IN THE TABLE IS INVENTED');
var approved = ENC.ROSTER.map(function (t) { return t.id; });
ok('his approved roster is loadable and has twelve rows', approved.length === 12, approved.length + ' rows');
ok('*** ITEM ONE IS THE FERAL DOG PACK AND ITEM TWO IS THE COYOTE ***',
  approved[0] === 'feral_dog_pack' && approved[1] === 'coyote_shadow',
  approved.slice(0, 2).join(', '));
/* the table lives in the city, so it is read out of the city rather than a copy */
var tbl = CITY.match(/var WALK_TABLE = \{[\s\S]*?\n\};/);
ok('the walk table is in the city', !!tbl);
var named = tbl ? (tbl[0].match(/'[a-z_]+'/g) || []).map(function (s) { return s.slice(1, -1); }) : [];
var ids = named.filter(function (n) { return n.indexOf('_') > 0 || approved.indexOf(n) >= 0; })
               .filter(function (n) { return ['day', 'night'].indexOf(n) < 0; });
var invented = ids.filter(function (n) {
  return approved.indexOf(n) < 0 && ['suburb','town','desert','park','downtown','industrial',
    'commercial','gated','estate'].indexOf(n) < 0; });
ok('*** EVERY ENCOUNTER THE TABLE NAMES IS ONE HE APPROVED ***',
  invented.length === 0, invented.length ? 'INVENTED: ' + invented.join(', ') : ids.length + ' names, all his');

head('B. NO GLOBAL SPAWNS EVER');
ok('a district with no row returns null rather than a fallback',
  /if \(!row\) return null;\s*\/\* NO GLOBAL SPAWNS EVER \*\//.test(CITY));
ok('and there is no default row anywhere in the table',
  !/WALK_TABLE\s*\[\s*['"]?(default|any|\*)/.test(CITY));

head('C. ONE OPINION PER PLACE');
/* A road class a player can walk on keeps the row ROAD_TABLE already authored,
   rather than getting a second one that quietly disagrees with it. */
ok('*** A ROAD CLASS KEEPS THE ROW THE ROAD TABLE ALREADY AUTHORED ***',
  /ROAD_TABLE\[district\]\s*\)?\s*\n?\s*\?\s*ROAD_TABLE\[district\]\s*:\s*WALK_TABLE\[district\]/.test(
    CITY.replace(/\s+/g, ' ').replace(/ROAD_TABLE\[district\] \) \? ROAD_TABLE\[district\] : WALK_TABLE\[district\]/,
      'ROAD_TABLE[district])\n? ROAD_TABLE[district] : WALK_TABLE[district]'))
  || CITY.indexOf('? ROAD_TABLE[district] : WALK_TABLE[district]') >= 0);
var walkKeys = tbl ? (tbl[0].match(/^\s{2}([a-z]+):/gm) || []).map(function (s) { return s.trim().slice(0, -1); }) : [];
var roadClasses = ['arterial', 'strip', 'freeway', 'beltway', 'interchange', 'rail', 'wash'];
var doubled = walkKeys.filter(function (k) { return roadClasses.indexOf(k) >= 0; });
ok('and the walk table does not restate a road class', doubled.length === 0,
  doubled.length ? 'DOUBLED: ' + doubled.join(', ') : walkKeys.join(', '));

/* ---------------------------------------------------------------------------
   D + E. ON THE REAL SURFACE, THROUGH REAL MOVEMENT.
   A probe that calls walkInterrupt itself is testing the function, not the
   game: the claim is that WALKING fires these, so it walks through stepOnce,
   which is what a d-pad press runs.
   --------------------------------------------------------------------------- */
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

    head('D. WALKED, THROUGH THE SAME FUNCTION A D-PAD PRESS RUNS');
    ok('the demo opens and the city is in it', !!fr);
    if (!fr) throw new Error('no city frame');

    var m = await fr.evaluate(function () {
      var o = { wired: typeof walkInterrupt === 'function' && typeof WALK_TABLE !== 'undefined',
                fires: [], liar: null };
      for (var q = 0; q < 6; q++) {
        var gb = document.querySelector('#daycardIn .dcgo'); if (gb) gb.click(); }
      try { cardHide(); } catch (e) {}
      T.min = 10 * 60;
      var before = WALK_LOG.length;
      /* REAL MOVEMENT. stepOnce is the function the d-pad runs; nothing here
         touches hx or walkInterrupt directly, because a probe that moves the
         player by hand is not walking.
         AND IT HAS TO NAVIGATE. The first cut hammered ONE direction 1400 times
         and the player walked SIX CELLS before a wall stopped him, so the gate
         reported the feature dead while it worked. A WALKER THAT CANNOT TURN IS
         NOT MEASURING WALKING, IT IS MEASURING A WALL. It turns when it is
         blocked, which is what a person does. */
      var dir = 2, blocked = 0, cells = 0;
      for (var s = 0; s < 4000; s++) {
        var went = false;
        try { went = stepOnce(dir); } catch (e) { o.threw = String(e.message).slice(0, 90); break; }
        if (went) { cells++; blocked = 0; }
        else { blocked++; dir = (dir + (blocked > 3 ? 3 : 1)) % 8; }
        if (s % 7 === 6) { try { render(); } catch (e) {} }
        while (WALK_LOG.length > before) {
          var g = WALK_LOG[before++];
          o.fires.push({ id: g.id, kind: g.kind,
                         pointsAt: g.pack ? (g.pack.kind + '@' + g.pack.at.join(',')) : null });
        }
        if (o.fires.length >= 3) break;
      }
      o.steps = s; o.cells = cells;
      /* E. AND IT NEVER ANNOUNCES AN ANIMAL THAT IS NOT THERE.
         THE FIRST VERSION OF THIS CLAIM WAS NONSENSE I WROTE AND IT PASSED:
         it built an array, never called the director's tableFor at all, and
         reported 0 because 0 was what an empty loop produced. A CHECK THAT
         CANNOT FAIL IS NOT A CHECK. This one empties what is drawn, builds a
         FRESH director so no token is held back as already-fired, and pushes
         time through it until it has fired plenty -- then asserts that not one
         of them is an animal, because there is no animal to point at. */
      var drew = PACK_DREW; PACK_DREW = [];
      try {
        /* AND ASK THE DIRECTOR DIRECTLY, WITH A DISTRICT THIS GATE CHOOSES.
           The first version leaned on walkInterrupt, which reads dayWhere() --
           so it was really asking "where did the walker happen to stop", and it
           stopped somewhere with no row, so nothing fired and the claim went red
           for a reason that had nothing to do with animals.
           A CHECK THAT DEPENDS ON WHERE THE TEST ENDED IS MEASURING THE TEST. */
        WALK_DIR = null;
        var d = walkDirector();
        var got = [];
        for (var k = 0; k < 300 && got.length < 30; k++) {
          var ph = (k % 2) ? 'night' : 'day';
          var dd = ['suburb', 'town', 'park', 'industrial'][k % 4];
          var r = d.consider({ district: dd, phase: ph, health: 1, heat: 0,
                               can: function () { return false; } }, 600);
          if (r && r.fired) got.push(r.id);
        }
        o.blindFires = got.length;
        o.blindAnimals = got.filter(function (id) {
          return id === 'feral_dog_pack' || id === 'coyote_shadow'; }).length;
        o.blindSaw = got.slice(0, 6).join(',');
      } catch (e) { o.blindAnimals = -1; o.blindErr = String(e.message).slice(0, 80); }
      WALK_DIR = null;
      PACK_DREW = drew;
      return o;
    });

    ok('the walk director and its table are in the city', m.wired);
    ok('nothing threw while walking', !m.threw, m.threw || '');
    ok('*** WALKING FIRES HIS APPROVED ENCOUNTERS, WHICH IT NEVER DID BEFORE ***',
      m.fires.length > 0,
      m.fires.length + ' in ' + m.cells + ' cells walked: ' + m.fires.map(function (f) { return f.id; }).join(', '));
    var animal = m.fires.filter(function (f) {
      return f.id === 'feral_dog_pack' || f.id === 'coyote_shadow'; });
    ok('*** AND WHEN IT NAMES AN ANIMAL IT POINTS AT ONE ON THE GLASS ***',
      animal.length === 0 || animal.every(function (f) { return !!f.pointsAt; }),
      animal.length ? animal.map(function (f) { return f.id + ' -> ' + f.pointsAt; }).join(' | ')
                    : 'no animal token fired in this walk');

    head('E. AND IT CANNOT ANNOUNCE AN ANIMAL THAT IS NOT THERE');
    ok('*** WITH NOTHING DRAWN, NOT ONE ANIMAL ENCOUNTER IS ANNOUNCED ***',
      m.blindAnimals === 0 && m.blindFires > 0,
      m.blindFires + ' fired with nothing drawn (' + (m.blindSaw || '') + '), '
        + m.blindAnimals + ' of them animals'
        + (m.blindErr ? ' | ' + m.blindErr : ''));
    ok('nothing threw on the page', errs.length === 0, errs.slice(0, 2).join(' | '));
    await page.close();
  } catch (e) {
    fail++;
    console.log('  FAIL the real surface threw   ' + String(e && e.message).slice(0, 200));
  } finally {
    if (browser) try { await browser.close(); } catch (_e) {}
  }

  console.log('\n' + (fail ? 'WALK ENCOUNTER GATE: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'WALK ENCOUNTER GATE: ' + pass + ' ok, 0 failed'));
  process.exit(fail ? 1 : 0);
})();
