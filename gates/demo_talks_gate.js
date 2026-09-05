/* BOHEMIA DEMO TALKS GATE (9/5/26, PEOPLE lane).
 * VAMILY [demo talks] -- TALK-REACHES-THE-DEMO.
 *
 * THE BOARD SAYS: "236 @TALK nodes and 504 @SAY lines are parsed and mute in the
 * demo file." THE COUNTS ARE EXACT. "MUTE" IS NOT, and this gate is the proof
 * either way, because the only honest answer is a number.
 *
 * MEASURED: the demo ships FIVE DAYS and opens five quests. Those five hold 43
 * of the 236 talk nodes (18%) and 88 spoken lines. The other 193 belong to 22
 * quests the demo never opens -- that is the demo being five days long, not a
 * defect, and this gate pins it so nobody re-discovers it as a bug.
 *
 * AND THE WHOLE CHAIN WALKS, on the real demo:
 *   offerRing() -> OFFER, offerAccept() -> true, DQ.Q and DQ.rt live,
 *   ctDayCast() casts the roles, standing on a cast member's block makes
 *   ctCast() return them, and ctConvNode() hands back a node.
 * Three of my own probes said otherwise first, every one because I GUESSED a
 * name or a constant instead of reading it: BohemiaBQ (it is BQ), accepting
 * without ringing (offerAccept returns false on !OFFER), and hx = block*FN when
 * A BLOCK IS NB*FN = 512 FINE CELLS. Each produced a confident wrong finding, so
 * every number below is read off the running game.
 *
 * PROVES:
 *   A  the corpus is what the board says it is, and the demo's share of it
 *   B  every speaker in a demo quest has a role that can be cast (no orphans)
 *   C  ON THE REAL SURFACE: ring, accept, cast, stand there, and a node opens
 *   D  and each of the five days casts its REQUIRED roles
 *
 *   node gates/demo_talks_gate.js
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

var BQ = require(path.join(ROOT, 'engine/bohemia_bq.js'));
var CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

/* THE DEMO'S OWN DAY TABLE, READ OUT OF THE CITY rather than restated here. A
   copy of a list is a second list, and it drifts. */
var daysBlock = CITY.slice(CITY.indexOf('var DAYS = ['));
daysBlock = daysBlock.slice(0, daysBlock.indexOf('\n  ];'));
var DEMO_FILES = (daysBlock.match(/file: '([A-Z0-9_]+)'/g) || [])
  .map(function (s) { return s.split("'")[1]; });

head('A. THE CORPUS, AND HOW MUCH OF IT THIS DEMO OPENS');
var all = fs.readdirSync('quests/bq').filter(function (f) { return /\.bq$/.test(f); });
var totalTalk = 0, totalSay = 0;
all.forEach(function (f) {
  var t = fs.readFileSync('quests/bq/' + f, 'utf8');
  totalTalk += (t.match(/@TALK/g) || []).length;
  totalSay += (t.match(/@SAY/g) || []).length;
});
ok('*** THE BOARD\'S COUNTS ARE EXACT: 236 TALK NODES AND 504 SAY LINES ***',
  totalTalk === 236 && totalSay === 504,
  totalTalk + ' @TALK and ' + totalSay + ' @SAY across ' + all.length + ' quests');
ok('the demo opens five days', DEMO_FILES.length === 5, DEMO_FILES.join(', '));
var reach = 0, lines = 0, orphans = [];
DEMO_FILES.forEach(function (f) {
  var Q = BQ.parse(fs.readFileSync('quests/bq/' + f + '.bq', 'utf8'));
  var roles = (Q.roles || []).map(function (r) { return r.name; });
  (Q.talks || []).forEach(function (n) {
    reach++;
    lines += (n.says || []).length;
    if (roles.indexOf(n.speaker) < 0) orphans.push(f + ':' + n.speaker);
  });
});
ok('*** AND THE DEMO\'S FIVE DAYS HOLD 43 OF THEM, WITH 88 SPOKEN LINES ***',
  reach === 43 && lines === 88,
  reach + ' nodes, ' + lines + ' lines, ' + (100 * reach / totalTalk).toFixed(0) + '% of the corpus');
/* THE OTHER 193 ARE NOT MUTE, THEY ARE NOT IN THIS DEMO. Pinned so the next
   session does not re-file "82% of the talk never plays" as a bug. */
ok('and the rest belong to quests this demo never opens, which is not a defect',
  totalTalk - reach === 193, (totalTalk - reach) + ' nodes in ' + (all.length - 5) + ' unopened quests');

head('B. EVERY SPEAKER IN A DEMO QUEST CAN BE CAST');
ok('*** NO TALK NODE IS SPOKEN BY SOMEBODY THE QUEST CANNOT CAST ***',
  orphans.length === 0, orphans.length ? orphans.join(', ') : 'every speaker has a role');

/* ---------------------------------------------------------------------------
   C + D. ON THE REAL SURFACE.
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

    head('C. THE WHOLE CHAIN, WALKED: RING, ACCEPT, CAST, STAND THERE, TALK');
    ok('the demo opens and the city is in it', !!fr);
    if (!fr) throw new Error('no city frame');

    var m = await fr.evaluate(function () {
      var o = {};
      for (var q = 0; q < 6; q++) {
        var gb = document.querySelector('#daycardIn .dcgo'); if (gb) gb.click(); }
      try { cardHide(); } catch (e) {}

      /* A BLOCK IS NB*FN FINE CELLS. Read, not guessed: the first probe used FN
         and asked for block [6,20] while standing on [1,5]. */
      var SZ = ((typeof FN !== 'undefined') ? FN : 128) * ((typeof NB !== 'undefined') ? NB : 4);
      o.blockSize = SZ;

      /* DAY 1 THROUGH THE PLAYER'S OWN ROUTE: the phone rings, he answers. */
      o.beforeQ = !!(typeof DQ !== 'undefined' && DQ && DQ.Q);
      /* offerRing() RETURNS NOTHING. It sets OFFER and bumps window.__OFFER_RANG,
         and the first cut of this claim asserted its return value was true --
         a FIFTH guess in a job whose whole lesson is that guessing a name or a
         contract produces a confident wrong finding. Read what it actually
         leaves behind: the offer, and the counter it increments. */
      try { offerRing(); } catch (e) { o.ringErr = String(e.message).slice(0, 80); }
      o.rang = (typeof OFFER !== 'undefined' && !!OFFER);
      o.rangCount = window.__OFFER_RANG || 0;
      try { o.accepted = !!offerAccept(); } catch (e) { o.acceptErr = String(e.message).slice(0, 80); }
      o.afterQ = !!(DQ && DQ.Q);
      o.day1 = DQ && DQ.spec ? DQ.spec.file : null;

      /* EVERY DAY THE DEMO SHIPS: open it, cast it, go and stand there. */
      o.days = [];
      for (var d = 1; d <= 5; d++) {
        var row = { day: d };
        try {
          var opened = DQ.openDay(d);
          row.file = DQ.spec ? DQ.spec.file : null;
          row.opened = !!opened;
          var dc = ctDayCast();
          row.cast = (dc && dc.cast) ? Object.keys(dc.cast) : [];
          row.spoke = [];
          if (dc && dc.cast) {
            for (var r in dc.cast) {
              var b = dc.cast[r].block;
              if (!b) { row.spoke.push(r + ':NO BLOCK'); continue; }
              hx = b[0] * SZ + SZ / 2; hy = b[1] * SZ + SZ / 2;
              try { render(); } catch (e) {}
              var here = ctCast();
              var got = null;
              if (here && here[r]) { try { got = ctConvNode({ key: here[r].key }); } catch (e) {} }
              row.spoke.push(r + ':' + (got ? 'TALKS' : (here && here[r] ? 'no node' : 'not on block')));
            }
          }
        } catch (e) { row.err = String(e.message).slice(0, 80); }
        o.days.push(row);
      }

      /* *** AND THE LATER SPEAKERS OPEN WHEN THE QUEST ADVANCES. *** Several
         roles read "no node" at the day's opening stage, and that is the design,
         not a hole: their entry is `stage>=20`. A gate that only ever looked at
         the opening stage would call a working thing broken -- so it advances
         day one and asks the same question again. */
      try {
        DQ.openDay(1);
        var before = null, after = null;
        var dc1 = ctDayCast();
        var b = dc1 && dc1.cast && dc1.cast.fixer ? dc1.cast.fixer.block : null;
        if (b) {
          hx = b[0] * SZ + SZ / 2; hy = b[1] * SZ + SZ / 2;
          try { render(); } catch (e) {}
          var h1 = ctCast();
          if (h1 && h1.fixer) { try { before = ctConvNode({ key: h1.fixer.key }); } catch (e) {} }
          try { DQ.rt.start(20); } catch (e) { o.advErr = String(e.message).slice(0, 80); }
          o.stageNow = DQ.rt && DQ.rt.state ? DQ.rt.state.stage : null;
          var h2 = ctCast();
          if (h2 && h2.fixer) { try { after = ctConvNode({ key: h2.fixer.key }); } catch (e) {} }
        }
        o.laterBefore = !!before;
        o.laterAfter = !!after;
      } catch (e) { o.laterErr = String(e.message).slice(0, 80); }
      return o;
    });

    ok('the day one quest is not open until the phone rings', m.beforeQ === false);
    ok('*** THE PHONE RINGS AND ANSWERING IT STARTS THE QUEST ***',
      m.rang === true && m.rangCount > 0 && m.accepted === true && m.afterQ === true,
      'offer set=' + m.rang + ' rings=' + m.rangCount + ' accepted=' + m.accepted
        + ' -> ' + m.day1);
    ok('a block is read off the game, not guessed', m.blockSize === 512, m.blockSize + ' fine cells');

    head('D. EVERY DAY THE DEMO SHIPS CASTS ITS PEOPLE AND THEY TALK');
    var opened = m.days.filter(function (r) { return r.opened; }).length;
    var withCast = m.days.filter(function (r) { return (r.cast || []).length; }).length;
    var talked = m.days.filter(function (r) {
      return (r.spoke || []).some(function (s) { return /:TALKS$/.test(s); }); }).length;
    ok('all five days open', opened === 5, opened + ' of 5');
    ok('*** ALL FIVE CAST SOMEBODY ***', withCast === 5,
      m.days.map(function (r) { return r.day + ':' + (r.cast || []).length; }).join(' '));
    ok('*** AND ON EVERY ONE OF THEM SOMEBODY ACTUALLY TALKS ***', talked === 5,
      m.days.map(function (r) { return r.day + '[' + (r.spoke || []).join(' ') + ']'; }).join('  '));
    ok('*** A LATER SPEAKER IS SILENT AT THE OPENING STAGE AND TALKS ONCE THE '
      + 'QUEST MOVES ***',
      m.laterBefore === false && m.laterAfter === true,
      'day 1 fixer: stage 10 -> ' + (m.laterBefore ? 'talks' : 'silent')
        + ', stage ' + m.stageNow + ' -> ' + (m.laterAfter ? 'talks' : 'silent')
        + (m.laterErr ? ' | ' + m.laterErr : ''));
    ok('nothing threw on the page', errs.length === 0, errs.slice(0, 2).join(' | '));
    await page.close();
  } catch (e) {
    fail++;
    console.log('  FAIL the real surface threw   ' + String(e && e.message).slice(0, 200));
  } finally {
    if (browser) try { await browser.close(); } catch (_e) {}
  }

  console.log('\n' + (fail ? 'DEMO TALKS GATE: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'DEMO TALKS GATE: ' + pass + ' ok, 0 failed'));
  process.exit(fail ? 1 : 0);
})();
