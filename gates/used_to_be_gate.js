/* BOHEMIA USED TO BE GATE (9/6/26, PEOPLE lane).
 * VAMILY [former jobs] -- BOHEMIA_BACKLOG.md row BB-WHAT-YOU-WERE.
 *
 * THE ROW: "NOBODY IN THIS VALLEY USED TO BE ANYBODY." Verified before
 * building: no former trade, no "used to be", no history field anywhere in the
 * identity module or the population module. A person was one of four words and
 * had always been that thing.
 *
 * THE ROW'S OWN FINDING, AND IT IS WHY THIS IS A WORD AND NOT A STAT:
 * "A BACKGROUND IS NOT WHAT SOMEBODY CAN DO. IT IS WHAT THEY STILL THINK THEY
 * ARE." The occupational identity outlives the occupation, so ten years on the
 * valley is full of people who still introduce themselves by a job that has not
 * existed for a decade.
 *
 * PROVES:
 *   A  the table is a COVERING SET, not a list -- fifteen, the number SHARED -8
 *      measured, with the front-of-house / back-of-house inversion intact
 *   B  it is DERIVED, not stored, exactly like the name is
 *   C  the mix is the real city's: hospitality ~29%, which is the row's own
 *      figure and not a dial anybody tuned
 *   D  IT INVENTS NO STAT. No wage, no bonus, no number on a person.
 *   E  ON THE REAL DEMO: everybody near the spawn has one, the card says it,
 *      the back of house says what they still know, and the front of house
 *      says nothing -- because the empty half IS the point
 *   F  and it does not write another lane's job
 *
 *   node gates/used_to_be_gate.js
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

var P = require(path.join(ROOT, 'engine/bohemia_people.js'));
var CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
var W = P.WAS_WORDS || [];

head('A. A COVERING SET, NOT A LIST');
/* THE COUNT IS THE MEASURED LESSON. SHARED -8: the sfx ballot grew ~6x while
   his keep rate HALVED (62% -> 32%) and SFX-06 came back 34 of 35 dead.
   "FIFTEEN THAT COVER THE GRID BEATS SIXTY THAT DO NOT." */
ok('*** FIFTEEN, WHICH IS THE NUMBER THE KEEP-RATE MEASUREMENT ENDORSES ***',
  W.length === 15, W.length + ' trades');
var houses = {};
W.forEach(function (w) { houses[w.house] = (houses[w.house] || 0) + 1; });
ok('every cell of the grid is filled: back of house, front of house, off the Strip',
  houses.back > 0 && houses.front > 0 && houses.off > 0,
  'back ' + houses.back + ', front ' + houses.front + ', off ' + houses.off);
/* THE INVERSION IS THE WHOLE IDEA: a dealer's trade died with the money, and a
   boiler tech is the most valuable person alive. */
ok('*** THE BACK OF HOUSE IS THE BIGGER HALF, WHICH IS THE INVERSION ***',
  houses.back > houses.front, houses.back + ' back vs ' + houses.front + ' front');
ok('*** AND EVERY BACK-OF-HOUSE TRADE STILL KNOWS SOMETHING ***',
  W.filter(function (w) { return w.house === 'back'; }).every(function (w) { return !!w.keeps; }));
/* THE EMPTY HALF MUST STAY EMPTY. A consolation sentence under DEALT CARDS
   would delete the joke and the point at the same time. */
ok('*** AND EVERY FRONT-OF-HOUSE TRADE KNOWS NOTHING, BECAUSE THAT IS THE POINT ***',
  W.filter(function (w) { return w.house === 'front'; }).every(function (w) { return w.keeps === null; }),
  W.filter(function (w) { return w.house === 'front' && w.keeps; }).map(function (w) { return w.id; }).join(',')
    || 'all four are empty');
var ids = W.map(function (w) { return w.id; });
ok('no trade is in the table twice', ids.length === new Set(ids).size);
ok('every one is a real sentence a person would say about themselves',
  W.every(function (w) { return typeof w.was === 'string' && w.was.length > 5; }));

head('B. IT IS DERIVED, NOT STORED');
ok('the module answers the question at all', typeof P.wasOf === 'function');
ok('*** THE SAME PERSON IS THE SAME PERSON, ALWAYS ***',
  P.wasOf({ key: 'P:7:H3-1' }).id === P.wasOf({ key: 'P:7:H3-1' }).id
  && P.wasOf({ key: 'P:7:H3-1' }).id === P.wasOf({ key: 'P:7:H3-1' }).id,
  'P:7:H3-1 -> ' + P.wasOf({ key: 'P:7:H3-1' }).id);
ok('different people are different', (function () {
  var seen = {};
  for (var i = 0; i < 200; i++) seen[P.wasOf({ key: 'P:7:H' + i + '-1' }).id] = 1;
  return Object.keys(seen).length >= 10;
})());
/* *** ONE HUMAN, ONE ANSWER, AND THE FIRST CUT FAILED THIS. *** wasOf used to
   fall back to person.id when there was no key. That looks generous and is a
   SECOND IDENTITY: the walked city's roster object carries id '12:12:900' while
   the card's person carries key 'P:city:12:12:900', so the same human came back
   with two different former trades depending on which object asked. Found by
   this gate finding a water-plant worker in the roster and opening a card that
   said something else entirely. No key, no answer -- exactly as nameOf refuses
   to answer without one. */
ok('*** WITHOUT A KEY IT REFUSES, SO ONE HUMAN CANNOT HAVE TWO PASTS ***',
  P.wasOf({ id: '12:12:900' }) === null && P.wasOf({ id: 'anything' }) === null);
ok('and a key is all it ever reads', !!P.wasOf({ key: 'P:city:12:12:900' }));
ok('*** NOBODY IN, NOTHING OUT ***', P.wasOf(null) === null && P.wasOf({}) === null);
/* DERIVED MEANS NOTHING WRITES IT. If a `was` field ever gets stored on a
   person this claim goes red and the storage promise is broken. */
var POP = fs.readFileSync(path.join(ROOT, 'engine/bohemia_population.js'), 'utf8');
ok('*** AND NOTHING STORES IT ON A PERSON, SO IT COSTS NO SAVE ***',
  !/\bwas\s*:/.test(POP) && !/person\.was\s*=/.test(CITY));

head('C. THE MIX IS THE REAL CITY\'S, NOT A DIAL');
ok('the share is the row\'s own real figure, named in the code',
  P.WAS_HOSPITALITY_SHARE === 0.29, String(P.WAS_HOSPITALITY_SHARE));
var N = 60000, hh = { back: 0, front: 0, off: 0 }, perId = {};
for (var i = 0; i < N; i++) {
  var w = P.wasOf({ key: 'P:11:H' + (i % 401) + '-' + (i % 17) + ':' + i });
  hh[w.house]++; perId[w.id] = (perId[w.id] || 0) + 1;
}
var hospShare = (hh.back + hh.front) / N;
ok('*** HOSPITALITY IS ~29% OF THE ROSTER, MEASURED OVER 60,000 PEOPLE ***',
  Math.abs(hospShare - 0.29) < 0.01, (hospShare * 100).toFixed(1) + '% (target 29%)');
ok('every one of the fifteen actually comes up', Object.keys(perId).length === 15,
  Object.keys(perId).length + ' of 15 seen');
/* TWO INDEPENDENT STREAMS. bohemia_agents paid a whole round for this lesson:
   "one hash was doing both jobs ... one faction took 63% of a three-way split.
   Correlated draws out of one hash is a classic and it is invisible until you
   count." So inside each half the spread must be even. */
function spread(list) {
  var c = list.map(function (id) { return perId[id] || 0; });
  return Math.max.apply(null, c) / Math.min.apply(null, c);
}
var hospIds = W.filter(function (w) { return w.house !== 'off'; }).map(function (w) { return w.id; });
var offIds = W.filter(function (w) { return w.house === 'off'; }).map(function (w) { return w.id; });
ok('*** AND INSIDE A HALF THE DRAW IS EVEN, NOT A BIASED SLICE OF THE FIRST ROLL ***',
  spread(hospIds) < 1.25 && spread(offIds) < 1.25,
  'hospitality worst ratio ' + spread(hospIds).toFixed(2)
    + ', off-Strip ' + spread(offIds).toFixed(2));

head('D. IT INVENTS NO STAT, WHICH IS THE ROW\'S OWN REFUSAL');
/* "REFUSE: a background as a stat package ... a trade that makes somebody
   mechanically better at fighting -- that is the dial and it is his." */
var numeric = [];
W.forEach(function (w) {
  Object.keys(w).forEach(function (k) { if (typeof w[k] === 'number') numeric.push(w.id + '.' + k); });
});
ok('*** NOT ONE NUMBER ON ANY TRADE: no wage, no bonus, no stat ***',
  numeric.length === 0, numeric.length ? numeric.join(', ') : 'fifteen trades, zero numbers');
var SRC = fs.readFileSync(path.join(ROOT, 'engine/bohemia_people.js'), 'utf8');
var TABLE = SRC.slice(SRC.indexOf('var WAS_WORDS'), SRC.indexOf('var WAS_HOSPITALITY_SHARE'));
ok('and the table carries no damage, health or combat word anywhere',
  !/\b(hp|damage|armour|armor|attack|defen[cs]e|melee|dmg)\b/i.test(TABLE));

head('E. IT IS ON THE CARD, BESIDE THE TRADE IT ALREADY SAYS');
ok('the row is in the walked city', CITY.indexOf('__CITY_USEDTOBE__') > 0);
ok('*** IT ASKS THE MODULE RATHER THAN KEEPING ITS OWN TABLE ***',
  CITY.indexOf('BohemiaPeople.wasOf(who)') > 0
  && CITY.indexOf("ctRow('USED TO BE'") > 0);
ok('and the second line only prints when there is something still worth knowing',
  /if \(ctWas\.keeps\) body \+= ctNote\(ctWas\.keeps\);/.test(CITY));

head('F. AND IT DOES NOT DO ANOTHER LANE\'S JOB');
/* The study routed the LINES a former trade opens to WORDS ([trade slang]
   BB-STILL-SAYS-IT), which is still OPEN on the board. A trade must not grow
   dialogue here. */
ok('*** NO DIALOGUE LINES ARE KEYED OFF A FORMER TRADE ***',
  !/LINES\s*\[\s*['"]?was/.test(SRC) && !/linesFor\([^)]*was/.test(SRC));

/* ---------------------------------------------------------------------------
   G. ON THE REAL DEMO.
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
    page.on('pageerror', function (e) { errs.push(String(e.message).slice(0, 160)); });
    await page.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_DEMO.html'));
    await SETTLE(page, 15000);
    await page.evaluate(function () {
      var f = document.getElementById('fronttap') || document.getElementById('front');
      if (f) f.click(); });
    await SETTLE(page, 12000);
    await wait(4000);
    var fr = page.frames().filter(function (x) { return /BOHEMIA_CITY_WORLD/.test(x.url()); })[0];

    head('G. ON THE REAL DEMO, WITHIN SIX CELLS OF WHERE HE STARTS');
    ok('the demo opens and the city is in it', !!fr);
    if (!fr) throw new Error('no city frame');

    var m = await fr.evaluate(function () {
      var o = {};
      for (var q = 0; q < 6; q++) { var gb = document.querySelector('#daycardIn .dcgo'); if (gb) gb.click(); }
      try { cardHide(); } catch (e) {}
      T.min = 13 * 60;
      try { render(); } catch (e) { o.threw = String(e.message).slice(0, 140); }
      o.wired = typeof BohemiaPeople.wasOf === 'function';

      var NB = BohemiaPopulation.NB, span = NB * FN;
      var cx = Math.floor(hx / span), cy = Math.floor(hy / span), cell = ctCell();
      var near = 0, got = 0, byHouse = {}, distinct = {};
      for (var ny = Math.max(0, cy - 1); ny <= cy + 1; ny++)
      for (var nx = Math.max(0, cx - 1); nx <= cx + 1; nx++) {
        var ppl = pplPeople(nx, ny);
        for (var j = 0; j < ppl.length; j++) {
          var p = ppl[j];
          var d = Math.max(Math.abs(Math.floor(p.home[0] / FN) - cell[0]),
                           Math.abs(Math.floor(p.home[1] / FN) - cell[1]));
          if (d > 6) continue;
          near++;
          /* ASK THE WAY THE CARD ASKS. ctPerson is what ctDraw builds before it
             says anything about somebody, so this is the same human the player
             meets -- not a roster row that happens to sit at the same index. */
          var w = null;
          try { w = BohemiaPeople.wasOf(ctPerson(p)); } catch (e) {}
          if (w) { got++; byHouse[w.house] = (byHouse[w.house] || 0) + 1; distinct[w.id] = 1; }
        }
      }
      o.near = near; o.got = got; o.byHouse = byHouse; o.distinct = Object.keys(distinct).length;

      /* THE CARD, OPENED THE WAY THE GAME OPENS IT: ctOpen takes nobody, it
         asks ctAdjacent, so this stands beside a body rather than handing the
         card a person.
         *** AND IT HAS TO BE A BODY ON THE GLASS. *** The first version of this
         picked people out of the loaded roster and teleported to where pplAt
         said they were, and all three card claims went red while the feature
         worked -- ctAdjacent answers about DRAWN bodies, and most of a
         three-neighbourhood roster is nowhere near the screen. So this sweeps
         the clock the way the day really moves and takes whoever is actually
         standing there, which is also the only way a player ever meets one. */
      /* WHERE SOMEBODY OF THAT HOUSE ACTUALLY LIVES. Near the spawn the screen
         holds about ONE body at a time, and sweeping the clock there only ever
         found the same off-Strip cab driver -- so the second version of this
         went red saying "no back-of-house body found" while both cards worked.
         MOVED BY HAND ONLY TO GET THERE, and nothing else is: the clock sweep,
         the draw, standing beside them and opening the card are all the real
         thing a player does. */
      function goToHouse(want) {
        for (var ny3 = Math.max(0, cy - 1); ny3 <= cy + 1; ny3++)
        for (var nx3 = Math.max(0, cx - 1); nx3 <= cx + 1; nx3++) {
          var pp3 = pplPeople(nx3, ny3);
          for (var k3 = 0; k3 < pp3.length; k3++) {
            var w3 = null; try { w3 = BohemiaPeople.wasOf(ctPerson(pp3[k3])); } catch (e) {}
            if (!w3 || w3.house !== want) continue;
            var hm = pp3[k3].home;
            for (var rr = 1; rr < 10; rr++)
              for (var dy3 = -rr; dy3 <= rr; dy3++)
                for (var dx3 = -rr; dx3 <= rr; dx3++) {
                  if (Math.max(Math.abs(dx3), Math.abs(dy3)) !== rr) continue;
                  if (pplStandable(hm[0] + dx3, hm[1] + dy3)) {
                    hx = hm[0] + dx3; hy = hm[1] + dy3; return true;
                  }
                }
          }
        }
        return false;
      }
      function openBesideDrawn(want) {
        if (!goToHouse(want)) return null;
        for (var mm = 0; mm < 1440; mm += 20) {
          T.min = mm;
          try { render(); } catch (e) { continue; }
          for (var b = 0; b < BARK_DREW.length; b++) {
            var pd = BARK_DREW[b].p, at2 = BARK_DREW[b].at;
            var w2 = null; try { w2 = BohemiaPeople.wasOf(ctPerson(pd)); } catch (e) {}
            if (!w2 || w2.house !== want) continue;
            for (var v = 0; v < 8; v++) {
              var d2 = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]][v];
              if (!pplStandable(at2[0] + d2[0], at2[1] + d2[1])) continue;
              hx = at2[0] + d2[0]; hy = at2[1] + d2[1];
              try { render(); ctOpen(); } catch (e) { continue; }
              if (!CT_OPEN || CT_OPEN.id !== pd.id) continue;
              var el = document.getElementById('ctcard');
              return { w: w2, txt: el ? String(el.textContent || '') : '' };
            }
          }
        }
        return null;
      }
      var gotBack = openBesideDrawn('back');
      if (gotBack) {
        o.backWas = gotBack.w.was; o.backKeeps = gotBack.w.keeps;
        o.backSaysWas = gotBack.txt.indexOf('USED TO BE') >= 0
                     && gotBack.txt.indexOf(gotBack.w.was) >= 0;
        o.backSaysKeeps = gotBack.txt.indexOf(gotBack.w.keeps) >= 0;
      }
      try { cardHide(); } catch (e) {}
      var gotFront = openBesideDrawn('front');
      if (gotFront) {
        o.frontWas = gotFront.w.was;
        o.frontSaysWas = gotFront.txt.indexOf('USED TO BE') >= 0
                      && gotFront.txt.indexOf(gotFront.w.was) >= 0;
        /* AND THE EMPTY HALF STAYS EMPTY ON THE GLASS: a front-of-house card
           must not carry any of the back-of-house "still knows" sentences. */
        o.frontLeaked = BohemiaPeople.WAS_WORDS
          .filter(function (x) { return x.keeps; })
          .some(function (x) { return gotFront.txt.indexOf(x.keeps) >= 0; });
      }
      return o;
    });

    ok('the module is in the walked city', m.wired);
    ok('nothing threw on the first draw', !m.threw, m.threw || '');
    ok('there are people within six cells to look at', m.near > 0, m.near + ' people');
    /* THE ROW'S OWN SENTENCE, TURNED ROUND. */
    ok('*** EVERY ONE OF THEM USED TO BE SOMEBODY, WHICH WAS NONE OF THEM ***',
      m.got === m.near && m.near > 0, m.got + ' of ' + m.near);
    ok('and the covering set really covers: most of the fifteen show up in one crowd',
      m.distinct >= 10, m.distinct + ' of 15 distinct trades near the spawn');
    ok('all three houses are on the street',
      m.byHouse.back > 0 && m.byHouse.front > 0 && m.byHouse.off > 0,
      JSON.stringify(m.byHouse));
    ok('*** THE CARD SAYS WHAT THEY USED TO BE ***', !!m.backSaysWas,
      m.backWas || 'no back-of-house body found');
    ok('*** AND FOR THE BACK OF HOUSE IT SAYS WHAT THEY STILL KNOW ***',
      !!m.backSaysKeeps, m.backKeeps || '');
    ok('*** THE FRONT OF HOUSE SAYS WHAT THEY WERE ***', !!m.frontSaysWas,
      m.frontWas || 'no front-of-house body found');
    /* THE EMPTY HALF HAS TO BE EMPTY ON THE GLASS, not just in the table. */
    ok('*** AND NOTHING IS OFFERED UNDER IT, BECAUSE THE MONEY IS GONE ***',
      m.frontSaysWas && m.frontLeaked === false,
      m.frontLeaked ? 'a back-of-house line leaked onto a front-of-house card' : 'nothing under it');
    ok('and the page threw nothing the whole time', errs.length === 0, errs.slice(0, 3).join(' | '));
  } catch (e) {
    fail++; console.log('  FAIL the real surface   ' + String(e.message).slice(0, 200));
  } finally { if (browser) await browser.close(); }

  console.log('\n' + (fail ? 'USED TO BE GATE: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'USED TO BE GATE: ' + pass + ' ok, 0 failed'));
  process.exit(fail ? 1 : 0);
})();
