/* BOHEMIA PACK GATE (8/30/26, PEOPLE lane) -- ALIVE-2, tier 2.
 *
 * *** THE PACK DOES NOT WANT TO FIGHT YOU. IT WANTS THE THING. *** Every claim
 * below is that sentence checked from a different side, and every number in it
 * came out of a study rather than out of a difficulty setting.
 *
 * THE BACKLOG ROW SAID "pack AI that flanks and breaks off", WHICH IS A WOLF.
 * A city dog forages singly most of the time, forms "random uncorrelated
 * groups", cooperates LESS than a wild canid, holds ranges that "overlap
 * substantially" with other packs, and fights that "rarely result in lethal
 * aggression". So this gate checks that the dogs are dogs and not wolves.
 *
 * THE NUMBER THAT INVERTS THE CONVENTION, Edmonton, 1,598 patrols: coyotes
 * "retreated immediately from 22 (96%) of the hazing events". ONE IN
 * TWENTY-THREE DID NOT BACK DOWN. That is the encounter, and section C measures
 * it over thousands of groups rather than asserting it.
 *
 * PROVES:
 *   A  two kinds, and their SOCIALITY is opposite in code, not in a comment:
 *      dogs common and close together, coyotes rare and far apart
 *   B  three states that are actually different, not one state with a bigger
 *      number on it
 *   C  the assert: about 96 in 100 back down, and AT A DEN NOT ONE DOES
 *   D  THE ALLEY: a pack will not follow you into a narrow place, and it will
 *      not be found living in one either
 *   E  the den is a PLACE that gets looked for, not a leftover of a search for
 *      something else (the first cut of this returned zero dens over 60 seeds)
 *   F  determinism: the pack you met yesterday is the pack you meet today
 *   G  NO DAMAGE BEFORE THE DIAL: not one health, damage or armour number, and
 *      the den's contents ship EMPTY because who died is his
 *   H  the coats are WEIGHTED, because a list is not a distribution
 *   I  ON THE REAL SURFACE: it is in the city, it draws, and nothing throws
 *   J  and it prints what this tier cannot do
 *
 *   node gates/pack_gate.js
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

var P = require(path.join(ROOT, 'engine/bohemia_packs.js'));
var SRC = fs.readFileSync(path.join(ROOT, 'engine/bohemia_packs.js'), 'utf8');

/* THE GROUND THE CLAIMS ARE MEASURED ON. A spread of openness rather than two
 * values, because the first harness for this used a probe with exactly two
 * openness numbers in it and could not have detected a den if one existed.
 * A HARNESS THAT CANNOT PRODUCE THE THING IT IS LOOKING FOR IS NOT A HARNESS. */
function city(opts) {
  opts = opts || {};
  var alleyAt = opts.alleyAt == null ? 30 : opts.alleyAt;
  return function (x, y) {
    if (x < 0 || y < 0 || x > 6000 || y > 6000) return null;
    var alley = (x % 97 >= alleyAt && x % 97 <= alleyAt + 2);
    var o = alley ? 6 : 10 + ((x * 7 + y * 13) % 15);      /* 10..24 */
    return { walk: true, open: o, edge: ((x + y) % 5 === 0), food: ((x * 13 + y * 7) % 11 === 0) };
  };
}
var probe = city();
function sweep(seeds, fn) {
  for (var s = 1; s <= seeds; s++) {
    P.near({ seed: s, at: [2000, 2000], radius: 60, probe: probe }).forEach(fn);
  }
}

head('A. TWO ANIMALS, AND THEIR SOCIALITY IS THE OPPOSITE OF EACH OTHER');
var dogs = P.kindFor('dogs'), coys = P.kindFor('coyotes');
ok('there are exactly two kinds and they are the two canids', P.KINDS.length === 2 && !!dogs && !!coys);
/* "territories overlap substantially" against "very little overlap" */
ok('*** COYOTES ARE SPACED FAR FURTHER APART THAN DOGS ***',
  coys.spacing >= dogs.spacing * 4,
  'dogs every ' + dogs.spacing + ' cells, coyotes every ' + coys.spacing);
var nD = 0, nC = 0, nDen = 0, nDenC = 0;
sweep(300, function (p) {
  if (p.kind === 'dogs') nD++; else nC++;
  if (p.den) { nDen++; if (p.kind === 'coyotes') nDenC++; }
});
ok('*** AND SO YOU MEET DOGS OFTEN AND COYOTES SELDOM, WITHOUT A RARITY DIAL ***',
  nD > nC * 8 && nC > 0, nD + ' dog groups against ' + nC + ' coyote groups over 300 seeds');
/* a group of 2 to 6 adults, which is the low end of the 2-15 that was observed
 * and the five-to-six an urban coyote group actually runs */
var sizesOk = true;
sweep(60, function (p) { if (p.count < 2 || p.count > 6) sizesOk = false; });
ok('every group is between two and six adults', sizesOk);

head('B. THREE STATES, AND THEY ARE ACTUALLY DIFFERENT');
var one = null;
sweep(40, function (p) { if (!one && p.kind === 'dogs') one = p; });
ok('there is a group to look at', !!one);
var far = P.stateOf(one, [one.at[0] + one.noticeAt + 5, one.at[1]]);
var mid = P.stateOf(one, [one.at[0] + one.warnAt + 2, one.at[1]]);
var close = P.stateOf(one, [one.at[0] + 1, one.at[1]]);
ok('*** FAR: SETTLED. NEARER: IT HAS SEEN YOU. CLOSE: IT IS WARNING YOU ***',
  far === 'settled' && mid === 'notice' && close === 'warn',
  far + ' -> ' + mid + ' -> ' + close);
ok('the three are three different words, not one word with a number on it',
  new Set([far, mid, close]).size === 3);
/* the coyote sees you a long way off, because it is in the open and it is the
 * animal that would rather be somewhere you are not */
ok('the coyote notices you far further out than a dog does', coys.notice > dogs.notice * 2,
  'coyote ' + coys.notice + ' cells, dog ' + dogs.notice);

head('C. YOU PUSH AND IT DECIDES, AND ONE IN TWENTY-THREE DOES NOT BACK DOWN');
var back = 0, hold = 0, denBack = 0, denHold = 0;
for (var s = 1; s <= 4000; s++) {
  P.near({ seed: s, at: [2000, 2000], radius: 60, probe: probe }).forEach(function (p) {
    var r = P.assert(p);
    if (p.den) { if (r === 'holds') denHold++; else denBack++; }
    else if (r === 'backs-off') back++; else hold++;
  });
}
var rate = back / (back + hold);
ok('*** ABOUT 96 IN 100 BACK DOWN, WHICH IS THE MEASURED 22 OF 23 ***',
  rate > 0.93 && rate < 0.98, (rate * 100).toFixed(1) + '% over ' + (back + hold) + ' groups');
ok('*** AND SOME OF THEM DO NOT, SO PUSHING IS A REAL DECISION ***', hold > 0,
  hold + ' groups held their ground');
ok('*** AT A DEN, NOT ONE BACKS DOWN ***', denHold > 0 && denBack === 0,
  denHold + ' den groups, ' + denBack + ' of them backed down');

head('D. THE ALLEY, WHICH IS THE WHOLE TACTICAL LAYER');
var ringOpen = P.ring(one, [2000, 2000], probe);
var ax = 2000 - (2000 % 97) + 31;                    /* a cell inside the alley */
var ringAlley = P.ring(one, [ax, 2000], probe);
ok('in the open, the pack has cells to take around you', ringOpen.length > 0,
  ringOpen.length + ' cells');
ok('*** AND IT WILL NOT FOLLOW YOU INTO A NARROW PLACE ***', ringAlley.length === 0,
  'the ring is ' + ringAlley.length + ' cells wide in the alley');
ok('the ring never puts more animals down than there are in the group',
  ringOpen.length <= one.count);
var inAlley = false;
sweep(120, function (p) { var g = probe(p.at[0], p.at[1]); if (g && g.open < P.CORRIDOR) inAlley = true; });
ok('and no pack LIVES in one either, so the rule is one number both ways', !inAlley);

head('E. A DEN IS LOOKED FOR, NOT LEFT OVER');
/* THE FIRST CUT OF THIS RETURNED ZERO DENS OVER SIXTY SEEDS. It searched for
 * any legal spot and then asked whether that spot happened to be den ground,
 * and ordinary open ground won every search. A FEATURE THAT ONLY HAPPENS WHEN A
 * SEARCH FOR SOMETHING ELSE LANDS ON IT BY ACCIDENT IS NOT A FEATURE. */
ok('*** DENS EXIST AT ALL ***', nDen > 0, nDen + ' den groups over 300 seeds');
ok('and they are a minority, not the normal case', nDen < (nD + nC) * 0.4,
  (100 * nDen / (nD + nC)).toFixed(1) + '% of groups');
/* "human disturbance did not affect the choice of den sites in free-ranging
 * dogs", and coyotes avoid us: one flag, two behaviours */
ok('a coyote will not den on our rubbish and a dog will not care',
  P.denGround({ walk: true, open: 12, edge: true, food: true }, dogs) === true &&
  P.denGround({ walk: true, open: 12, edge: true, food: true }, coys) === false);
ok('a den is under something, never out in the open',
  P.denGround({ walk: true, open: 24, edge: true, food: false }, dogs) === false);
ok('and it needs something solid to be under',
  P.denGround({ walk: true, open: 12, edge: false, food: false }, dogs) === false);

head('F. THE SAME PLACE IS THE SAME PACK');
var a = JSON.stringify(P.near({ seed: 9, at: [2000, 2000], radius: 60, probe: probe }));
var b = JSON.stringify(P.near({ seed: 9, at: [2000, 2000], radius: 60, probe: probe }));
ok('two reads of the same corner give the same groups', a === b && a.length > 2);
var c1 = JSON.stringify(P.near({ seed: 10, at: [2000, 2000], radius: 60, probe: probe }));
ok('and a different valley gives different ones', a !== c1);
/* a pack that blinks in and out on the hour is a spawner, not a resident */
var h1 = P.near({ seed: 9, at: [2000, 2000], radius: 60, probe: probe, minute: 2 * 60 });
var h2 = P.near({ seed: 9, at: [2000, 2000], radius: 60, probe: probe, minute: 14 * 60 });
ok('*** AND IT LIVES THERE: IT DOES NOT BLINK IN AND OUT ON THE HOUR ***',
  JSON.stringify(h1) === JSON.stringify(h2));

head('G. NO DAMAGE BEFORE THE DIAL, AND THE DEN IS EMPTY');
/* THE RULER BROKE FIRST AND IT BROKE FLATTERINGLY. Its first cut skipped a
 * line only when THAT LINE started with a comment mark, so every line in the
 * middle of the module's own header block -- the one that says "there is not
 * one health, damage or armour number on this page" -- counted as code, and the
 * gate went red over its own sentence. A COMMENT IS A BLOCK, NOT A LINE.
 * So the comments are stripped before anything is grepped, which is the only
 * way to ask this question of the code rather than of the prose. */
/* AND THEN IT BROKE A SECOND TIME, THE SAME WAY ONE LEVEL DOWN: with the
 * comments gone it flagged the module's own CANNOT string, the sentence that
 * says out loud "nothing here does damage and nothing here has health". Both
 * cuts were asking "does the word appear", and the claim is "IS THERE A DAMAGE
 * NUMBER". A word is not a number. So the strings go too, and what is grepped
 * for is a FIELD OR AN ASSIGNMENT -- hp:, damage =, armour: -- which is the
 * only shape a damage dial can actually take. */
var CODE = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
              .replace(/'[^'\n]*'/g, "''").replace(/"[^"\n]*"/g, '""');
var banned = /\b(hp|health|damage|dmg|armou?r|attackPower|hitPoints)\s*[:=]/i;
var offending = CODE.split('\n').filter(function (L) { return banned.test(L); });
ok('*** NOT ONE DAMAGE OR HEALTH NUMBER IN THE MODULE ***', offending.length === 0,
  offending.slice(0, 2).join(' | '));
ok('assert can only answer backs-off or holds, never attacks',
  ['backs-off', 'holds'].indexOf(P.assert(one)) >= 0);
/* MECHANISM MINE, CONTENTS HIS: who died and what was in their pockets is canon */
ok('*** WHAT A DEN HOLDS SHIPS EMPTY, BECAUSE WHO DIED IS HIS ***',
  Array.isArray(P.DEN_HOLDS) && P.DEN_HOLDS.length === 0);

head('H. THE COATS ARE WEIGHTED, BECAUSE A LIST IS NOT A DISTRIBUTION');
var cnt = {};
for (var x = 0; x < 500; x++) for (var i = 0; i < 4; i++) {
  var id = P.coatFor({ kind: 'dogs', at: [x, x * 3] }, i);
  cnt[id] = (cnt[id] || 0) + 1;
}
var tot = Object.keys(cnt).reduce(function (a, k) { return a + cnt[k]; }, 0);
var shares = Object.keys(cnt).sort().map(function (k) {
  return k + ' ' + (100 * cnt[k] / tot).toFixed(0) + '%'; });
ok('three street dogs and all three turn up', Object.keys(cnt).length === 3, shares.join(', '));
/* uniform over three would be 33% each: this must NOT be that */
ok('*** AND THEY ARE NOT UNIFORM: THE COMMON DOG IS COMMON ***',
  cnt.dogsandy / tot > 0.45 && cnt.dogpale / tot < 0.25);
/* REUSE-FIRST: tier 1 already cooked a coyote and this tier uses that one */
ok('*** THE COYOTE REUSES THE SPRITE TIER 1 ALREADY COOKED ***',
  P.COATS.coyotes.length === 1 && P.COATS.coyotes[0].id === 'coyote' &&
  /coyote/.test(fs.readFileSync(path.join(ROOT, 'banks/BOHEMIA_WILDLIFE_SPRITES.js'), 'utf8')));
var bank = fs.readFileSync(path.join(ROOT, 'banks/BOHEMIA_WILDLIFE_SPRITES.js'), 'utf8');
ok('and the three dogs were actually cooked into the bank',
  /dogsandy/.test(bank) && /dogblack/.test(bank) && /dogpale/.test(bank));

head('K. NOTHING HERE IS AN ORGAN NOTHING CALLS');
/* *** ORGAN REACH CAUGHT THIS FEATURE WITH ITS HEADLINE DEAD. *** packAssert()
   was defined and never called, so the player could not push a pack and the
   22-in-23 finding the whole tier is built on had no way to happen; and
   BohemiaPacks.ring was never called, so the alley rule ran nowhere. THE
   MECHANISM EXISTED AND NOTHING COULD REACH IT -- the invisible-hats shape, in
   the same turn as a record about the invisible-hats shape. So this tier now
   asks the question of itself, close to the code, instead of waiting for a
   whole-repo sweep to notice. */
var CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
var exported = ['near', 'stateOf', 'assert', 'ring', 'coatFor', 'lineFor', 'hash'];
var unreached = exported.filter(function (fn) {
  return CITY.indexOf('BohemiaPacks.' + fn) < 0;
});
ok('*** EVERY FUNCTION THIS MODULE EXPORTS IS CALLED BY THE GAME ***',
  unreached.length === 0,
  unreached.length ? 'NOBODY CALLS: ' + unreached.join(', ') : exported.join(', '));
/* and the two the city defines for itself */
['packPass', 'packAssert', 'packButton'].forEach(function (fn) {
  var calls = CITY.split(fn + '(').length - 1;   /* one is the definition */
  ok(fn + ' is called, not just defined', calls >= 2, calls + ' occurrences');
});

head('J. WHAT THIS TIER CANNOT DO, SAID OUT LOUD');
ok('it prints its own limits rather than implying them', P.CANNOT.length >= 3);
P.CANNOT.forEach(function (c) { console.log('       - ' + c); });

/* ---------------------------------------------------------------------------
   I. ON THE REAL SURFACE. A side-door probe is a lie (7/18).
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

    head('I. ON THE GLASS, WALKED');
    ok('the demo opens and the city is in it', !!fr);
    if (!fr) throw new Error('no city frame');

    var m = await fr.evaluate(function () {
      var o = { hasMod: typeof BohemiaPacks !== 'undefined',
                hasPass: typeof packPass === 'function' };
      for (var q = 0; q < 6; q++) {
        var gb = document.querySelector('#daycardIn .dcgo'); if (gb) gb.click(); }
      try { cardHide(); } catch (e) {}
      T.min = 10 * 60; try { DAY.min = 10 * 60; } catch (e) {}
      o.steps = null;
      for (var st = 1; st <= 600; st++) {
        hx += 1; if (st % 20 === 19) hy += 1;
        try { render(); } catch (e) { o.threw = String(e.message).slice(0, 90); break; }
        if (typeof PACK_DREW !== 'undefined' && PACK_DREW && PACK_DREW.length) {
          o.steps = st; o.saw = PACK_DREW[0].kind; o.count = PACK_DREW[0].count;
          o.spot = PACK_DREW[0].at.slice(); break;
        }
      }
      if (o.spot) {
        function stateFrom(dx, dy) {
          hx = o.spot[0] + dx; hy = o.spot[1] + dy;
          try { render(); } catch (e) {}
          var w0 = (PACK_DREW || []).filter(function (w) {
            return w.at[0] === o.spot[0] && w.at[1] === o.spot[1]; })[0];
          return w0 ? w0.state : 'offscreen';
        }
        /* *** DISTANCES THE CAMERA CAN ACTUALLY CONTAIN. *** The first cut read
           20 and 10 cells, which on a 378x785 canvas at 44 pixel tiles is off
           the top of the screen, so it came back 'offscreen' twice and the
           claim PASSED anyway because 'offscreen' is not equal to 'warn'.
           A CLAIM THAT PASSES ON A FAILED MEASUREMENT IS NOT A CLAIM -- the
           same broken shape tier 1 had two days ago, in a gate I wrote after
           fixing it there. So it walks the whole ladder and records every
           state, and 'offscreen' is now a FAILURE rather than an answer. */
        o.ladder = [];
        for (var d = 9; d >= 1; d--) o.ladder.push(d + ':' + stateFrom(0, d));
        o.far = stateFrom(0, 8);
        o.mid = stateFrom(0, 5);
        o.near = stateFrom(0, 2);
        /* THE BUTTON. It must be ABSENT when nothing is warning you and PRESENT
           when something is, because a control that is always there is another
           bullshit button and a control that is never there is a dead organ. */
        function disp(id) {
          var e = document.getElementById(id);
          return e ? getComputedStyle(e).display : 'NO ELEMENT';
        }
        stateFrom(0, 8);  o.btnFar = disp('packbtn');
        stateFrom(0, 2);  o.btnNear = disp('packbtn');
        o.warnLine = (document.getElementById('packline') || {}).textContent || '';
        /* NINE POINTS, INSET BY THE CORNER RADIUS, plus a box-overlap test.
           A CONTROL IS REACHABLE WHEN EVERY PART OF IT IS, NOT WHEN ITS MIDDLE
           HAPPENS TO BE -- the first placement passed on its middle row while
           its top row sat under the caption and its bottom row under STANDING.
           The exact corners of a rounded button are outside the shape ON
           PURPOSE, so sampling them measures border-radius, not reach. */
        o.reach = (function () {
          var e = document.getElementById('packbtn');
          if (!e) return 'NO ELEMENT';
          var r = e.getBoundingClientRect();
          if (!r.width) return 'ZERO SIZE';
          var pad = (parseFloat(getComputedStyle(e).borderRadius) || 0) + 1, bad = [];
          for (var iy = 0; iy < 3; iy++) for (var ix = 0; ix < 3; ix++) {
            var x = r.left + pad + (r.width - 2 * pad) * ix / 2;
            var y = r.top + pad + (r.height - 2 * pad) * iy / 2;
            var t = document.elementFromPoint(x, y);
            if (!t || !(t === e || e.contains(t))) bad.push(ix + ',' + iy);
          }
          var hits = [];
          ['note', 'sleepbtn', 'rungbtn', 'mktbtn', 'bikebtn', 'fitbtn', 'footing', 'packline']
            .forEach(function (id) {
              var o2 = document.getElementById(id);
              if (!o2 || o2 === e || getComputedStyle(o2).display === 'none') return;
              var q = o2.getBoundingClientRect();
              if (r.left < q.right && q.left < r.right && r.top < q.bottom && q.top < r.bottom) hits.push(id);
            });
          var pd = document.querySelector('#pad,#dpad,.pad');
          if (pd) { var q2 = pd.getBoundingClientRect();
            if (r.left < q2.right && q2.left < r.right && r.top < q2.bottom && q2.top < r.bottom) hits.push('dpad'); }
          return (bad.length ? 'BLOCKED ' + bad.join(' ') : 'ok9')
               + (hits.length ? ' OVERLAPS ' + hits.join(',') : '');
        })();
        /* AND PRESSING IT DOES THE THING. */
        var bt = document.getElementById('packbtn');
        if (bt) bt.click();
        try { render(); } catch (e) {}
        o.afterLine = (document.getElementById('packline') || {}).textContent || '';
        o.left = (typeof PACK_LEFT !== 'undefined') ? Object.keys(PACK_LEFT).length : -1;
        o.btnAfter = disp('packbtn');
      }
      return o;
    });

    ok('the pack module is in the city', m.hasMod && m.hasPass);
    ok('nothing threw while walking', !m.threw, m.threw || '');
    ok('*** A PACK TURNS UP ON A WALK ***', m.steps !== null,
      m.steps + ' steps to ' + m.count + ' ' + m.saw);
    /* THE STATES ON THE GLASS, not in a unit test: it has to change as you
       approach or the whole feature is a static sprite. And every reading has
       to be a STATE -- an 'offscreen' anywhere in the ladder means the gate did
       not see the thing it is making a claim about. */
    ok('the pack is on the glass at every step of the walk in',
      !!m.ladder && m.ladder.filter(function (r) { return /offscreen/.test(r); }).length === 0,
      (m.ladder || []).join('  '));
    ok('*** SETTLED FAR OFF, HEADS UP CLOSER, POSTURING WHEN YOU ARE ON THEM ***',
      m.far === 'settled' && m.mid === 'notice' && m.near === 'warn',
      '8 cells: ' + m.far + '  |  5: ' + m.mid + '  |  2: ' + m.near);
    ok('*** THE BUTTON IS NOT THERE UNTIL SOMETHING IS WARNING YOU ***',
      m.btnFar === 'none' && m.btnNear === 'block',
      '8 cells: ' + m.btnFar + '  |  2 cells: ' + m.btnNear);
    ok('*** AND EVERY PART OF IT IS REACHABLE, NOT JUST ITS MIDDLE ***',
      m.reach === 'ok9', String(m.reach));
    ok('it says what is in front of you before you press it', !!m.warnLine, m.warnLine);
    ok('*** PRESSING IT RESOLVES THE STANDOFF ON THE REAL SURFACE ***',
      !!m.afterLine && m.afterLine !== m.warnLine, m.warnLine + '  ->  ' + m.afterLine);
    ok('and a pack that backed off is remembered as gone',
      m.left >= 0, m.left + ' group(s) left');
    ok('nothing threw on the page', errs.length === 0, errs.slice(0, 2).join(' | '));
    await page.close();
  } catch (e) {
    fail++;
    console.log('  FAIL the real surface threw   ' + String(e && e.message).slice(0, 200));
  } finally {
    if (browser) try { await browser.close(); } catch (_e) {}
  }

  console.log('\n' + (fail ? 'PACK GATE: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'PACK GATE: ' + pass + ' ok, 0 failed'));
  process.exit(fail ? 1 : 0);
})();
