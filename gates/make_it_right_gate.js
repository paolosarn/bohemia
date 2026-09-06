/* BOHEMIA MAKE IT RIGHT GATE (9/6/26, PEOPLE lane).
 * VAMILY [make it right] -- row NOTHING-IN-THIS-GAME-CAN-BE-FORGIVEN.
 *
 * THE ROW: "A deed is written, it travels, it fades, and it is never settled.
 * So a player who wronged somebody in hour two can never make it right, and
 * standing is a one-way ratchet toward being hated -- and generation three is
 * the ANGEL, who cannot forgive anything."
 *
 * VERIFIED BEFORE BUILDING RATHER THAN TAKEN ON TRUST: forgive, forgiven,
 * settle, settled, absolve, pardon, spare and redeem appeared ZERO times in
 * bohemia_standing.js and bohemia_deeds.js. The wider engine's hits are all
 * "settlement" the town, one lab note and a wash seam check -- read, none of
 * them this. Every function in the web got a deed INTO the world (witness,
 * gossip, inherit, legendOf) and nothing resolved one.
 *
 * PROVES:
 *   A  the hole is closed, and the module now says the words it never said
 *   B  a deed can be made right, AND THE RECORD SURVIVES -- forgiven is not
 *      forgotten, which is what the literature actually says forgiveness is
 *   C  *** THE PERSON WHO WAS WRONGED IS THE ONE WHO DECIDES *** -- one mind,
 *      and another eyewitness is NOT settled by somebody else's choice
 *   D  it cannot erase a kindness and it cannot clear your own name
 *   E  WOULD THEY is derived from what they saw, not from a dial: the loop runs
 *      bad -> not yet -> one good -> still not yet -> two good -> yes
 *   F  the web learns it: a second-hand grudge dies, a first-hand one does not
 *   G  ON THE REAL DEMO, through the card and the button a player presses
 *
 *   node gates/make_it_right_gate.js
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

var S = require(path.join(ROOT, 'engine/bohemia_standing.js'));
var CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

function mind(o) { return { owner: o, deeds: [], cap: 64 }; }
function withW(tbl, fn) {
  var had = {};
  Object.keys(tbl).forEach(function (k) {
    had[k] = Object.prototype.hasOwnProperty.call(S.DEED_WEIGHT, k) ? S.DEED_WEIGHT[k] : undefined;
    S.DEED_WEIGHT[k] = tbl[k];
  });
  try { return fn(); }
  finally {
    Object.keys(tbl).forEach(function (k) {
      if (had[k] === undefined) delete S.DEED_WEIGHT[k]; else S.DEED_WEIGHT[k] = had[k];
    });
  }
}
function saw(m, kind, turn) {
  S.witness([m], turn, '@', kind, 5, 5, function () { return [5, 5]; }, {});
}

head('A. THE HOLE IS CLOSED');
ok('the module can be asked the question at all',
  typeof S.makeRight === 'function' && typeof S.wouldSquare === 'function'
  && typeof S.carryRight === 'function' && typeof S.madeRightBy === 'function');
/* THE ROW NAMES FOUR STORIES FOR ONE EVENT. They are words, not four mechanics:
   whether they got something, whether they simply let it go, whether you had
   them and did not. */
ok('*** AND IT KNOWS ALL FOUR WORDS THE ROW NAMES ***',
  Object.keys(S.RIGHT_WORDS).sort().join(',') === 'forgiven,paid,settled,spared',
  Object.keys(S.RIGHT_WORDS).join(', '));
ok('every one of them is a real sentence, not a label',
  Object.keys(S.RIGHT_WORDS).every(function (k) {
    return typeof S.RIGHT_WORDS[k] === 'string' && S.RIGHT_WORDS[k].length > 8; }));

head('B. A DEED CAN BE MADE RIGHT, AND THE RECORD SURVIVES');
withW({ hurt: -6 }, function () {
  var A = mind('ana');
  saw(A, 'hurt', 10);
  var before = S.opinionOf(A, '@', 12);
  var r = S.makeRight(A, '@', { how: 'forgiven', turn: 12 });
  ok('*** THE GRUDGE STOPS COUNTING ***',
    before < 0 && S.opinionOf(A, '@', 12) === 0,
    before.toFixed(2) + ' -> ' + S.opinionOf(A, '@', 12).toFixed(2));
  ok('and it says what it settled', r.settled === 1 && r.deeds[0] === 'hurt' && r.how === 'forgiven');
  /* FORGIVEN IS NOT FORGOTTEN. The whole literature treats forgiveness as a
     drop in negative motivation, never as amnesia, and becauseOf still has to
     be able to say the thing happened. */
  ok('*** BUT THE DEED IS STILL THERE, BECAUSE FORGIVEN IS NOT FORGOTTEN ***',
    A.deeds.length === 1 && A.deeds[0].kind === 'hurt' && !!A.deeds[0].right);
  var rec = S.madeRightBy(A, '@');
  ok('and the person can still say how it was squared',
    rec.length === 1 && rec[0].how === 'forgiven' && rec[0].sawIt === true
    && rec[0].say === S.RIGHT_WORDS.forgiven && rec[0].draft === true,
    rec.length ? rec[0].say : 'nothing');
  ok('squaring it twice changes nothing', S.makeRight(A, '@', { turn: 13 }).settled === 0);
});

head('C. THE PERSON WHO WAS WRONGED IS THE ONE WHO DECIDES');
withW({ hurt: -6 }, function () {
  var A = mind('ana'), B = mind('beto');
  saw(A, 'hurt', 10); saw(B, 'hurt', 10);
  S.makeRight(A, '@', { how: 'forgiven', turn: 12 });
  ok('*** ANA FORGIVES AND ANA IS SQUARE ***', S.opinionOf(A, '@', 12) === 0);
  /* THIS IS THE CLAIM THAT STOPS IT BEING AN ERASER. Beto watched the same
     thing. It was never ana's to give away on his behalf. */
  ok('*** AND BETO, WHO ALSO SAW IT, IS NOT ***',
    S.opinionOf(B, '@', 12) < 0, S.opinionOf(B, '@', 12).toFixed(2));
  ok('nor does carrying the news settle an eyewitness',
    S.carryRight(A, B) === 0 && S.opinionOf(B, '@', 12) < 0);
});

head('D. IT CANNOT ERASE A KINDNESS, AND IT CANNOT CLEAR YOUR OWN NAME');
withW({ helped: 5 }, function () {
  var D = mind('dee');
  saw(D, 'helped', 10);
  ok('*** NOBODY FORGIVES YOU FOR A KINDNESS ***',
    S.makeRight(D, '@', { turn: 12 }).settled === 0 && S.opinionOf(D, '@', 12) > 0,
    'opinion still ' + S.opinionOf(D, '@', 12).toFixed(2));
});
withW({ hurt: -6 }, function () {
  var A = mind('ana');
  saw(A, 'hurt', 10);
  /* THE ACTOR HOLDS NO DEED ABOUT THEMSELVES -- witness() refuses that -- so
     there is no mind for a player to call this on to clear their own name. */
  var me = mind('@');
  saw(me, 'hurt', 10);
  ok('*** YOU CANNOT HOLD, SO YOU CANNOT FORGIVE, A DEED OF YOUR OWN ***',
    me.deeds.length === 0 && S.makeRight(me, '@', { turn: 12 }).settled === 0);
  ok('and a mind with nobody in it settles nothing',
    S.makeRight(null, '@', {}).settled === 0 && S.makeRight(mind('x'), '@', {}).settled === 0);
});
/* A WEIGHTLESS DEED IS NOT A GRUDGE. Most of the 82 deed kinds are unruled. */
var U = mind('un');
saw(U, 'deed_with_no_ruling', 10);
ok('an unruled deed is not something to forgive',
  U.deeds.length === 1 && S.makeRight(U, '@', { turn: 12 }).settled === 0);

head('E. WOULD THEY? DERIVED FROM WHAT THEY SAW, NOT FROM A DIAL');
withW({ hurt: -6, kind1: 5, kind2: 5 }, function () {
  var M = mind('ana');
  saw(M, 'hurt', 10);
  var w0 = S.wouldSquare(M, '@', 12);
  ok('*** WITH ONLY THE BAD THING, THEY WILL NOT ***',
    w0.would === false && w0.kinds.length === 1 && w0.rest === 0,
    'grudge ' + w0.grudge.toFixed(2) + ', rest ' + w0.rest.toFixed(2));
  saw(M, 'kind1', 11);
  var w1 = S.wouldSquare(M, '@', 12);
  ok('*** ONE GOOD TURN IS NOT ENOUGH TO OUTWEIGH IT ***', w1.would === false,
    'grudge ' + w1.grudge.toFixed(2) + ', rest ' + w1.rest.toFixed(2));
  saw(M, 'kind2', 11);
  var w2 = S.wouldSquare(M, '@', 12);
  ok('*** TWO IS, AND THAT IS THE WHOLE LOOP: GO AND DO SOMETHING FOR THEM ***',
    w2.would === true, 'grudge ' + w2.grudge.toFixed(2) + ', rest ' + w2.rest.toFixed(2));
  /* AND SQUARING IT KEEPS WHAT YOU EARNED. Forgiveness removes the grudge; it
     does not reset you to a stranger. */
  S.makeRight(M, '@', { how: 'paid', turn: 12 });
  ok('and squaring it leaves the good standing you earned',
    S.opinionOf(M, '@', 12) > 0, S.opinionOf(M, '@', 12).toFixed(2));
});
withW({ kind1: 5 }, function () {
  var M = mind('ana'); saw(M, 'kind1', 10);
  ok('somebody who holds nothing against you is not offered a fix',
    S.wouldSquare(M, '@', 12).would === false && S.wouldSquare(M, '@', 12).kinds.length === 0);
});

head('F. AND THE WEB LEARNS IT HAPPENED');
withW({ hurt: -6 }, function () {
  var A = mind('ana'), C = mind('caro');
  saw(A, 'hurt', 10);
  S.gossip(A, C, 12);
  ok('caro heard it second hand and holds it',
    S.opinionOf(C, '@', 12) < 0 && C.deeds[0].hops === 1,
    S.opinionOf(C, '@', 12).toFixed(2) + ' at ' + C.deeds[0].hops + ' hop');
  S.makeRight(A, '@', { how: 'settled', turn: 12 });
  var moved = S.carryRight(A, C);
  ok('*** A SECOND-HAND GRUDGE DIES WHEN THE PERSON IT BELONGS TO SQUARES IT ***',
    moved === 1 && S.opinionOf(C, '@', 13) === 0);
  ok('and caro can say it was settled, and that they only heard it',
    S.madeRightBy(C, '@').length === 1 && S.madeRightBy(C, '@')[0].sawIt === false);
});
/* THE ASYMMETRY IS THE FEATURE, NOT AN OVERSIGHT: news of a settlement travels
   the paths the grudge travelled, and stops at anybody who saw it themselves. */
withW({ hurt: -6 }, function () {
  var A = mind('ana'), B = mind('beto');
  saw(A, 'hurt', 10); saw(B, 'hurt', 10);
  S.makeRight(A, '@', { turn: 12 });
  ok('*** AND IT STOPS DEAD AT ANYBODY WHO SAW IT WITH THEIR OWN EYES ***',
    S.carryRight(A, B) === 0 && S.opinionOf(B, '@', 12) < 0);
});

head('G. IT IS ON THE CARD, AND THE PERSON DECIDES THERE TOO');
ok('the row is in the walked city', CITY.indexOf('__CITY_MAKEITRIGHT__') > 0);
ok('*** THE CARD ASKS THE MODULE WHETHER THEY WOULD, RATHER THAN ALWAYS OFFERING ***',
  CITY.indexOf('BohemiaStanding.wouldSquare(ctMR') > 0
  && CITY.indexOf("body += '<button id=\"ctright\">Make it right</button>'") > 0);
ok('and when they would not, it says what is still owed rather than greying out',
  CITY.indexOf('NOTHING YOU HAVE DONE FOR THEM OUTWEIGHS IT YET') > 0
  && CITY.indexOf('Do something for this person, where they can see it') > 0);
/* A STALE CARD MUST NOT SETTLE SOMETHING THEY WOULD NO LONGER SETTLE. */
ok('*** AND THE BUTTON ASKS AGAIN WHEN IT IS PRESSED ***',
  /right\.addEventListener[\s\S]{0,400}wouldSquare\(m,'@',ctMinuteNow\(\)\)\.would/.test(CITY));
ok('pressing it also tells the people who only heard about it',
  /right\.addEventListener[\s\S]{0,900}carryRight\(m,o\)/.test(CITY));
ok('and the city carries the version of the module that can do this',
  CITY.indexOf('function makeRight') > 0 && CITY.indexOf('function wouldSquare') > 0
  && CITY.indexOf('function carryRight') > 0);

/* ---------------------------------------------------------------------------
   H. ON THE REAL DEMO.
   --------------------------------------------------------------------------- */
function requirePlaywright() {
  for (var i = 0, g = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']; i < g.length; i++) {
    try { return require(path.join(g[i], 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
var SETTLE_PAGE = require(__dirname + '/bohemia_settle.js').settle;
var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

(async function () {
  var browser = null;
  try {
    browser = await requirePlaywright().chromium.launch({ args: ['--no-sandbox'] });
    var page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    var errs = [];
    page.on('pageerror', function (e) { errs.push(String(e.message).slice(0, 160)); });
    await page.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_DEMO.html'));
    await SETTLE_PAGE(page, 15000);
    await page.evaluate(function () {
      var f = document.getElementById('fronttap') || document.getElementById('front');
      if (f) f.click(); });
    await SETTLE_PAGE(page, 12000);
    await wait(4000);
    var fr = page.frames().filter(function (x) { return /BOHEMIA_CITY_WORLD/.test(x.url()); })[0];

    head('H. ON THE REAL DEMO: WRONG SOMEBODY, THEN PUT IT RIGHT');
    ok('the demo opens and the city is in it', !!fr);
    if (!fr) throw new Error('no city frame');

    var m = await fr.evaluate(function () {
      var o = {};
      for (var q = 0; q < 6; q++) { var gb = document.querySelector('#daycardIn .dcgo'); if (gb) gb.click(); }
      try { cardHide(); } catch (e) {}
      T.min = 13 * 60;
      o.wired = typeof BohemiaStanding.makeRight === 'function';
      /* HIS DIAL, THE REAL ONE the DIRECT tab posts. Nothing here writes a
         weight by hand, and a street deed has to be worth something before
         anybody can hold it against you. */
      ctDialApply({ 'commit': -6, 'favour': 4 }, false);
      try { render(); } catch (e) { o.threw = String(e.message).slice(0, 140); }
      if (!BARK_DREW.length) { o.err = 'nobody drawn'; return o; }
      var t = BARK_DREW[0], at = t.at;
      for (var v = 0; v < 8; v++) {
        var d = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]][v];
        if (pplStandable(at[0]+d[0], at[1]+d[1])) { hx = at[0]+d[0]; hy = at[1]+d[1]; break; }
      }
      function card() { var x = document.getElementById('ctcard'); return x ? String(x.textContent||'') : ''; }
      function opinion() { var op = ctOpinionOf(t.p.id); return op ? op.value : 0; }

      /* 1. WRONG THEM, in front of them, through the real deed pass. */
      try { render(); } catch (e) {}
      ctDeed('commit', CT_DEED_CLOUT['commit'], 'Cartel');
      try { ctAgainstBump(); } catch (e) {}
      try { render(); ctOpen(); } catch (e) { o.openThrew = String(e.message).slice(0, 120); }
      o.bad = { opinion: opinion(), holds: card().indexOf('THEY HOLD SOMETHING AGAINST YOU') >= 0,
                notYet: card().indexOf('OUTWEIGHS IT YET') >= 0,
                button: !!document.getElementById('ctright') };

      /* 2. ONE GOOD TURN: still not enough. */
      try { cardHide(); } catch (e) {}
      ctDeed('favour', CT_DEED_CLOUT['favour'], 'Cartel');
      try { render(); ctOpen(); } catch (e) {}
      o.one = { opinion: opinion(), button: !!document.getElementById('ctright') };

      /* 3. TWO: now they would. */
      try { cardHide(); } catch (e) {}
      ctDeed('favour', CT_DEED_CLOUT['favour'], 'Blues');
      try { render(); ctOpen(); } catch (e) {}
      o.two = { opinion: opinion(), wouldLetGo: card().indexOf('AND THEY WOULD LET IT GO') >= 0,
                button: !!document.getElementById('ctright') };

      /* 4. PRESS IT, the way a player does. */
      var b = document.getElementById('ctright');
      if (b) {
        b.click();
        o.after = { opinion: opinion(),
                    squared: BohemiaStanding.madeRightBy(CT_MINDS[t.p.id], '@').length,
                    saysSquared: card().indexOf('YOU SQUARED IT') >= 0,
                    saysHow: card().indexOf(BohemiaStanding.RIGHT_WORDS.paid) >= 0,
                    buttonGone: !document.getElementById('ctright') };
      }
      return o;
    });

    ok('the module reached the demo', m.wired);
    ok('nothing threw', !m.threw && !m.openThrew && !m.err,
      m.threw || m.openThrew || m.err || '');
    ok('*** WRONG SOMEBODY AND THEY HOLD IT AGAINST YOU ***',
      m.bad.opinion < 0 && m.bad.holds, 'opinion ' + m.bad.opinion.toFixed(2));
    ok('*** AND THERE IS NO BUTTON, BECAUSE YOU HAVE NOT EARNED ONE ***',
      m.bad.button === false && m.bad.notYet);
    ok('*** ONE GOOD TURN MOVES IT AND STILL DOES NOT BUY IT ***',
      m.one.opinion > m.bad.opinion && m.one.button === false,
      m.bad.opinion.toFixed(2) + ' -> ' + m.one.opinion.toFixed(2));
    ok('*** TWO, AND NOW THEY WOULD LET IT GO ***',
      m.two.button === true && m.two.wouldLetGo,
      'opinion ' + m.two.opinion.toFixed(2));
    ok('*** PRESS IT AND THE THING IS SQUARED ***',
      m.after && m.after.squared === 1 && m.after.saysSquared && m.after.buttonGone);
    ok('*** AND THE CARD SAYS HOW, AND YOU KEEP WHAT YOU EARNED ***',
      m.after.saysHow && m.after.opinion > m.two.opinion,
      m.two.opinion.toFixed(2) + ' -> ' + m.after.opinion.toFixed(2));
    ok('and the page threw nothing the whole time', errs.length === 0, errs.slice(0, 3).join(' | '));
  } catch (e) {
    fail++; console.log('  FAIL the real surface   ' + String(e.message).slice(0, 200));
  } finally { if (browser) await browser.close(); }

  console.log('\n' + (fail ? 'MAKE IT RIGHT GATE: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'MAKE IT RIGHT GATE: ' + pass + ' ok, 0 failed'));
  process.exit(fail ? 1 : 0);
})();
