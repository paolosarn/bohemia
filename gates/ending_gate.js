/* BOHEMIA ENDING GATE (8/27/26, PEOPLE lane) -- the last thirty seconds of the
 * demo, which nobody had built, and it ends on a thing you are not allowed to say.
 *
 * THE ROW IT CLOSES, in the handoff's own words: "BUILD -> DOOR -> ENDING ->
 * INSTRUMENT -> INVITE ... DEMO-END (the last thirty seconds, which nobody has
 * designed and which peak-end says is half of what anybody keeps). NOBODY IS
 * HANDED THE DEMO LINK UNTIL ALL FOUR EXIST."
 *
 * THE RESEARCH IT IS BUILT ON: Kahneman and Fredrickson's PEAK-END RULE -- what
 * a person keeps of an episode is predicted almost entirely by the most intense
 * moment and THE LAST ONE -- plus DURATION NEGLECT, plus Zukowski's finding from
 * the other direction that a demo's ending is not neutral and ending without a
 * reason to come back actively hurts it. The coordinator's reading of his own
 * ruled cut: BOTH PEAKS SIT IN THE FIRST FIVE MINUTES AND THE LAST THING THE
 * PLAYER FEELS IS GOING TO BED.
 *
 * PROVES:
 *   A  five endings, one per outcome the quest already classifies, and an
 *      unknown tag lands somewhere honest instead of crashing
 *   B  the words hold up to the voice card's own rulers, measured live
 *   C  NOT ONE LINE ASSUMES A GENDER, because the cast is procedural
 *   D  the workshop never ends and the demo does
 *   E  ON THE REAL SURFACE: the message lands, the reply is greyed and dead,
 *      there is nothing to press, and day two does not come
 *   F  and the header is the person's NAME only if the player asked for it
 *
 *   node gates/ending_gate.js
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

var E = require('../engine/bohemia_ending.js');

/* ==========================================================================
   A. FIVE WAYS ONE GOOD DAY CAN END
   ========================================================================== */
head('A. FIVE WAYS ONE GOOD DAY CAN END');
ok('the ending module exists', typeof E.endingFor === 'function' && typeof E.pick === 'function');
ok('*** THE LAST BEAT IS DIFFERENT FOR EVERY WAY THE DAY CAN GO ***',
  E.keys().length === 5, E.keys().join(', '));
ok('the phone ringing and nobody answering is its own ending',
  E.pick({ taken: false }) === 'untaken'
  && E.pick({ taken: false, outcome: 'COMPLETE', tags: ['quiet'] }) === 'untaken',
  'a quest that never started has no outcome to read');
ok('the quest\'s own FAIL branch is its own ending',
  E.pick({ taken: true, outcome: 'FAIL', tags: ['quiet'] }) === 'failed');
ok('and the three resolutions are the quest\'s own hashtags',
  E.pick({ taken: true, outcome: 'COMPLETE', tags: ['quiet'] }) === 'quiet'
  && E.pick({ taken: true, outcome: 'COMPLETE', tags: ['notable'] }) === 'notable'
  && E.pick({ taken: true, outcome: 'COMPLETE', tags: ['reckless'] }) === 'reckless');
/* A TAG NOBODY WROTE AN ENDING FOR IS NOT A CRASH, and it is not a blank
   screen either: it reads as the quietest version, which is the truthful
   default for a finished job the valley did not hear about. */
ok('a resolution tag nobody wrote an ending for still lands somewhere honest',
  E.pick({ taken: true, outcome: 'COMPLETE', tags: ['some_new_tag'] }) === 'quiet'
  && !!E.endingFor({ taken: true, outcome: 'COMPLETE', tags: ['some_new_tag'] }));
ok('every ending carries a message AND a reply he cannot send',
  E.keys().every(function (k) {
    var e = E.ENDINGS[k];
    return e.says && e.says.length >= 3 && typeof e.noverb === 'string' && e.noverb.length > 2;
  }));
ok('and every word of it is tagged as his to retype',
  E.endingFor({ taken: false }).draft === true);

/* ==========================================================================
   B. THE WORDS, AGAINST THE VOICE CARD'S OWN RULERS
   ========================================================================== */
head('B. THE VOICE CARD, MEASURED RATHER THAN CLAIMED');
function sentences(l) { return String(l).split(/(?<=[.!?])\s+/).filter(Boolean); }
function words(s) { return String(s).trim().split(/\s+/).filter(Boolean); }
/* THE SAME RULERS gates/voice_gate.js uses, read off that file rather than
   re-typed here: a checker that re-types the rule it is checking is how
   o'clock got read as the Spanish word "o" in one place and not the other. */
var VOICE = fs.readFileSync(path.join(ROOT, 'gates/voice_gate.js'), 'utf8');
var BANNED = [];
(VOICE.match(/\[\s*'[^']*'\s*,\s*\/.*?\/[a-z]*\s*\]/g) || []).forEach(function (row) {
  var m = row.match(/\/(.*)\/([a-z]*)\]$/);
  if (m) { try { BANNED.push([row.match(/'([^']*)'/)[1], new RegExp(m[1], m[2])]); } catch (_e) {} }
});
ok('the banned list was read off the voice gate, not re-typed here',
  BANNED.length >= 8, BANNED.length + ' patterns');
var worstCv = 99, flat = [], hits = [];
E.keys().forEach(function (k) {
  var e = E.ENDINGS[k], w = [];
  e.says.forEach(function (l) { sentences(l).forEach(function (s) { var n = words(s).length; if (n) w.push(n); }); });
  var mean = w.reduce(function (a, b) { return a + b; }, 0) / w.length;
  var sd = Math.sqrt(w.reduce(function (a, b) { return a + (b - mean) * (b - mean); }, 0) / w.length);
  var cv = sd / mean;
  if (cv < worstCv) worstCv = cv;
  if (cv < 0.6) flat.push(k + ' ' + cv.toFixed(2));
  var all = e.says.concat([e.noverb]).join(' ');
  BANNED.forEach(function (b) { if (b[1].test(all)) hits.push(k + ': ' + b[0]); });
});
/* 0.57 IS THE NUMBER THE CARD CALLS FLAT and 0.74 is its own fixed example.
   THE FIRST DRAFT OF THESE LINES MEASURED 0.27 AND I HAD TO REWRITE ALL FIVE. */
ok('*** NOT ONE OF THEM IS FLAT: every sentence a different size to the others ***',
  flat.length === 0 && worstCv >= 0.74,
  'worst rhythm ' + worstCv.toFixed(2) + ' (the card calls 0.57 flat, 0.74 fixed)'
  + (flat.length ? '  FLAT: ' + flat.join(', ') : ''));
ok('and not one banned phrase anywhere in the ending',
  hits.length === 0, hits.join(' | ') || 'none of ' + BANNED.length + ' patterns');
/* RULE 1: THE DEFAULT IS FAST. */
var contracted = 0, total = 0;
E.keys().forEach(function (k) {
  E.ENDINGS[k].says.forEach(function (l) { total++; if (/['’](s|t|re|ll|ve|d|m)\b/i.test(l)) contracted++; });
});
ok('they talk like they are in a hurry', contracted / total >= 0.4,
  contracted + ' of ' + total + ' lines contract');
/* RULE 3: SOMEBODY HAS TO ASK. And here the question is the whole ending. */
ok('*** AND FOUR OF THE FIVE END ON A QUESTION HE IS NOT ALLOWED TO ANSWER ***',
  E.keys().filter(function (k) {
    return /\?/.test(E.ENDINGS[k].says.join(' ')); }).length >= 4,
  E.keys().filter(function (k) { return /\?/.test(E.ENDINGS[k].says.join(' ')); }).join(', '));

head('C. THE CAST IS PROCEDURAL, SO NOTHING MAY ASSUME A GENDER');
/* THIS WENT RED ON MY OWN FIRST DRAFT: the withheld verbs said "Tell him it was
   you" and the probe printed it under the header LOURDES IBARRA. */
var GENDERED = /\b(he|him|his|she|her|hers|himself|herself)\b/i;
var bad = [];
E.keys().forEach(function (k) {
  var e = E.ENDINGS[k];
  e.says.concat([e.noverb]).forEach(function (l) { if (GENDERED.test(l)) bad.push(k + ': ' + l); });
});
ok('*** NOT ONE LINE NAMES A PRONOUN, BECAUSE THE PERSON IS WHOEVER STANDS THERE ***',
  bad.length === 0, bad.join(' | ') || 'they/them, for everybody');

/* ==========================================================================
   D..F  THE REAL SURFACE
   ========================================================================== */
function requirePlaywright() {
  for (var i = 0, g = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']; i < g.length; i++) {
    try { return require(path.join(g[i], 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
var SETTLE = require(__dirname + '/bohemia_settle.js').settle;

/* *** THIS GATE DRIVES THE SHELL, NOT THE CITY PAGE. ***
   The first cut loaded slices/BOHEMIA_CITY_WORLD.html on its own and POSTED THE
   DEMO FLAG ITSELF, which made every claim below pass over a chain that did not
   work: measured on the real demo build, the flag never arrived at all. The
   shell had been pushing it on the city frame's `load` event, and that frame's
   document.readyState is still "interactive" while the player is walking around
   in it -- a four megabyte page whose load event is not a thing to wait on.
   A PROBE THAT SENDS THE MESSAGE THE REAL SENDER IS SUPPOSED TO SEND IS STILL A
   SIDE DOOR. So this opens the real page, taps the real splash, and reaches into
   the frame the player is actually looking at. */
async function playShell(browser, file) {
  var page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  var errs = [];
  page.on('pageerror', function (e) { errs.push(String(e.message).slice(0, 140)); });
  await page.goto('file://' + path.join(ROOT, file));
  await SETTLE(page, 12000);
  await page.evaluate(function () {
    var f = document.getElementById('fronttap') || document.getElementById('front');
    if (f) f.click();
  });
  await SETTLE(page, 10000);
  await new Promise(function (r) { setTimeout(r, 2200); });   /* the ask retries */
  var fr = page.frames().filter(function (x) { return /BOHEMIA_CITY_WORLD/.test(x.url()); })[0];
  if (!fr) { await page.close(); return { errs: errs, noFrame: true }; }
  var out = await fr.evaluate(function () {
    return new Promise(function (res) {
      setTimeout(function () {
        var o = { isDemo: CT_IS_DEMO };
        for (var i = 0; i < 3; i++) {
          var g = document.querySelector('#daycardIn .dcgo') || document.querySelector('#daycardIn .dcbtn');
          if (g) g.click();
        }
        try { offerAccept(); } catch (e) {}
        o.taken = OFFER_TAKEN;
        var d = null; try { d = ctDayCast(); } catch (e) {}
        o.cast = (d && d.cast) ? Object.keys(d.cast) : null;
        if (d && d.cast) {
          var role = Object.keys(d.cast)[0], blk = d.cast[role].block;
          var nb = BohemiaPopulation.NB, span = nb * FN;
          hx = blk[0] * span + 8; hy = blk[1] * span + 8; CT_SPAWN = null;
          try { ctSpawn(); render(); } catch (e) {}
          var R = ctEveryone(), hit = null;
          for (var q = 0; q < R.length; q++) if ('P:city:' + R[q].id === d.cast[role].key) hit = R[q];
          o.nameBeforeAsking = ctEndingFrom();
          if (hit) {
            var at = ctAt(hit), dd = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            for (var k = 0; k < dd.length; k++) {
              hx = at[0] + dd[k][0]; hy = at[1] + dd[k][1];
              try { render(); } catch (e) {}
              if (ctAdjacent()) break;
            }
            var vb = document.getElementById('cttalk');
            if (vb && getComputedStyle(vb).display !== 'none') {
              vb.click();
              var ask = document.getElementById('ctask');
              o.couldAsk = !!ask;
              if (ask) ask.click();
              try { ctClose(); } catch (e) {}
            }
          }
          o.nameAfterAsking = ctEndingFrom();
        }
        try { DQ.rt.setStage(30); } catch (e) {}
        o.outcome = (function () { try { return DQ.outcome(); } catch (e) { return null; } })();
        o.tags = (function () { try { return DQ.tags(); } catch (e) { return []; } })();
        var dayBefore = DAY.day;
        try { showReckoning(); } catch (e) { o.threw = String(e).slice(0, 120); }
        var sleep = document.querySelector('#daycardIn .dcgo');
        if (sleep) sleep.click();
        var inn = document.getElementById('daycardIn');
        o.dayAfter = DAY.day;
        o.rolledOver = DAY.day !== dayBefore;
        o.header = (inn.querySelector('h2') || {}).textContent;
        o.says = [].map.call(inn.querySelectorAll('.endsay'), function (e) { return e.textContent; });
        o.noverbs = [].map.call(inn.querySelectorAll('.endnoverb'), function (e) { return e.textContent; });
        o.noverbIsButton = [].some.call(inn.querySelectorAll('.endnoverb'), function (e) {
          return e.tagName === 'BUTTON' || !!e.querySelector('button'); });
        o.pressables = [].map.call(inn.querySelectorAll('.dcgo,.dcbtn'), function (e) { return e.textContent; });
        o.key = window.__ENDING && window.__ENDING.key;
        res(o);
      }, 300);
    });
  });
  out.errs = errs;
  await page.close();
  return out;
}

(async function () {
  var browser = null;
  try {
    browser = await requirePlaywright().chromium.launch({ args: ['--no-sandbox'] });
    var demo = await playShell(browser, 'slices/BOHEMIA_DEMO.html');
    var shop = await playShell(browser, 'slices/BOHEMIA_ALPHA_0_9.html');
    var errs = (demo.errs || []).concat(shop.errs || []);

    head('D. THE WORKSHOP NEVER ENDS. THE DEMO DOES.');
    ok('nothing threw on either surface', errs.length === 0, errs.slice(0, 2).join(' | '));
    /* *** AND IT LEARNED IT THROUGH THE REAL CHAIN. *** Nothing in this gate
       posts the flag: the demo page is opened, its splash is tapped, and the
       city inside it is asked what it thinks it is. That is the claim that went
       red and found the load-event bug. */
    ok('*** THE DEMO KNOWS IT IS THE DEMO, WITHOUT THIS GATE TELLING IT ***',
      demo.isDemo === true && shop.isDemo === false,
      'demo ' + demo.isDemo + ', workshop ' + shop.isDemo);
    ok('*** IN THE WORKSHOP, SLEEP STILL ROLLS INTO THE NEXT DAY ***',
      shop.rolledOver === true && shop.says.length === 0,
      'day ' + shop.dayAfter + ', and no ending on his bench');
    ok('*** IN THE DEMO, DAY TWO DOES NOT COME ***',
      demo.rolledOver === false, 'still day ' + demo.dayAfter);

    head('E. THE LAST THIRTY SECONDS, ON THE GLASS');
    ok('the job was really taken and really finished',
      demo.taken === true && demo.outcome === 'COMPLETE',
      demo.outcome + ' ' + JSON.stringify(demo.tags));
    ok('*** A MESSAGE LANDS, AND IT IS ABOUT THE DAY HE ACTUALLY HAD ***',
      demo.says.length >= 3 && demo.key === 'quiet',
      demo.key + ': ' + JSON.stringify(demo.says[0] || ''));
    /* AND IT IS THE MODULE'S WORDS, checked against the file rather than against
       whatever the page happened to render. */
    ok('and every line of it is the module\'s, word for word',
      demo.says.length > 0 && demo.says.every(function (s) {
        return E.ENDINGS[demo.key].says.indexOf(s) >= 0; }),
      demo.says.filter(function (s) { return E.ENDINGS[demo.key].says.indexOf(s) < 0; }).join(' | ')
        || 'all ' + demo.says.length);
    /* *** AND IT IS THE MODULE'S WORDS, NOT JUST A COUNT. *** The first cut of
       this claim checked that ONE refusal was on screen and that it was not a
       button, and it went green over a city carrying a stale inlined copy that
       still read "Tell him it was you" after the module had been fixed to
       "them". A claim that counts the thing instead of reading it is a claim
       that cannot see the bug it is named after. */
    ok('*** THE REPLY HE WANTS TO SEND IS RIGHT THERE, AND IT IS DEAD ***',
      demo.noverbs.length === 1 && demo.noverbIsButton === false
      && demo.noverbs[0] === E.ENDINGS[demo.key].noverb,
      JSON.stringify(demo.noverbs) + ' vs the module\'s '
      + JSON.stringify(E.ENDINGS[demo.key] && E.ENDINGS[demo.key].noverb));
    /* THE ENDING IS A DOOR, NOT A BUTTON. Nothing to press means the day never
       comes, which is the whole shape peak-end asks for. */
    ok('*** AND THERE IS NOTHING TO PRESS, BECAUSE THE DAY DOES NOT COME ***',
      demo.pressables.length === 0, JSON.stringify(demo.pressables));

    head('F. AND WHETHER IT SAYS THEIR NAME IS UP TO HIM');
    ok('the day really cast somebody to send it',
      !!demo.cast && demo.cast.length > 0, JSON.stringify(demo.cast));
    /* PRECISE ON PURPOSE: "all caps with a space in it" matches LOURDES IBARRA
       as happily as it matches LINEMAN, so the first version of this claim could
       not tell the two states apart at all. It has to be the ROLE, by name. */
    ok('*** BEFORE HE ASKS, IT IS A JOB TITLE ***',
      !!demo.cast && demo.cast.indexOf(
        String(demo.nameBeforeAsking || '').toLowerCase().replace(/ /g, '_')) >= 0,
      String(demo.nameBeforeAsking) + '  (one of ' + JSON.stringify(demo.cast) + ')');
    ok('*** AFTER HE ASKS, A PERSON TEXTS HIM ***',
      demo.couldAsk === true && !!demo.nameAfterAsking
      && demo.nameAfterAsking !== demo.nameBeforeAsking
      && /\S\s+\S/.test(String(demo.nameAfterAsking))
      && demo.header === demo.nameAfterAsking,
      String(demo.nameBeforeAsking) + '  ->  ' + String(demo.nameAfterAsking));
  } catch (e) {
    ok('the ending could be played at all', false, String(e && e.message || e));
  } finally {
    if (browser) try { await browser.close(); } catch (_e) {}
  }

  console.log('\nENDING GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
