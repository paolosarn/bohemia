/* BOHEMIA FEEDBACK GATE (8/27/26, PEOPLE lane) -- row 0f, the instrument the
 * friends round runs on, and the row's own spec contradicts the protocol's.
 *
 * THE ROW: "three taps (fun? / confusing? / play again?) + an optional text box,
 * exported exactly like the save blob so a tester can paste it into a chat",
 * amended 8/25 to stamp THE BUILD AND THE SEED into every paste.
 *
 * THE PROTOCOL, STANDING RULE: "A tester who stops playing is a FINDING, never a
 * failure -- where and why is the whole point of the instrument."
 *
 * A CARD AT THE END IS FILLED IN ONLY BY PEOPLE WHO REACHED THE END. So the
 * paste is written while they play and the card only adds the words, and there
 * is a door into it that is not the ending.
 *
 * MEASURED ON THE REAL DEMO BEFORE ANY OF IT WAS DESIGNED: a session that stops
 * leaves four localStorage keys and 1,638 bytes behind, none of it about how the
 * session went, and the city did not know which build it was running.
 *
 * PROVES:
 *   A  the recorder: a beat is stamped once, the furthest beat is the answer to
 *      "how far did they get", and an older sitting is never thrown away
 *   B  THE QUESTIONS ARE NOT THE VAGUE ONES. Researched 8/27: people are nice
 *      and they will lie, so the first tap asks about a BEHAVIOUR, and "did you
 *      have fun" and "would you play again" are named and banned by name
 *   C  the taps are about THEIR OWN session, so nobody is asked about a part of
 *      the day they never reached
 *   D  a session that stops halfway still renders a complete paste, which is the
 *      whole reason this is not an end-of-day card
 *   E  ON THE REAL SURFACE: the city learns its build without this gate telling
 *      it, the recorder marks beats from PLAY rather than from a probe, the card
 *      renders their own day, an answer can be taken back, and the paste lands
 *      in the shell's export modal
 *   F  the quit that came back: a reload keeps every beat and both doors work
 *   G  and the ending keeps its silence, because peak-end is why it is silent
 *
 *   node gates/feedback_gate.js
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

var B = require('../engine/bohemia_blackbox.js');

/* ==========================================================================
   A. THE RECORDER
   ========================================================================== */
head('A. THE FLIGHT RECORDER');
ok('the module exists and has a version',
  typeof B.mark === 'function' && typeof B.render === 'function' && /^bohbb-/.test(B.VERSION),
  B.VERSION);
ok('one good day has eleven beats and six of them a player can name',
  B.BEATS.length === 11 && B.BUCKETS.length === 6,
  B.BUCKETS.map(function (b) { return b.label; }).join(' / '));
ok('every beat belongs to a bucket a player would recognise',
  B.BEATS.every(function (b) {
    return B.BUCKETS.some(function (k) { return k.key === b.bucket; }); }));

/* A BEAT IS A RECORD, NOT A CLOCK. Stamping it twice would turn "when did they
   get there" into "when did the ticker last look". */
var r1 = B.blank();
B.mark(r1, 'took', { ms: 5000, day: 1, min: 400 });
B.mark(r1, 'took', { ms: 9000, day: 1, min: 460 });
ok('*** A BEAT KEEPS THE FIRST TIME IT HAPPENED, NOT THE LAST TIME IT WAS TRUE ***',
  r1.beats.took.ms === 5000, r1.beats.took.ms + 'ms');
B.mark(r1, 'not_a_real_beat', { ms: 1 });
ok('a beat nobody defined is refused rather than written',
  !r1.beats.not_a_real_beat && Object.keys(r1.beats).length === 1);

/* HOW FAR THEY GOT IS THE FURTHEST BEAT IN DAY ORDER, not the last one stamped:
   a player can talk to somebody before they take the job. */
var r2 = B.blank();
B.mark(r2, 'finished', { ms: 900 });
B.mark(r2, 'talked', { ms: 100 });
ok('*** HOW FAR THEY GOT IS HOW DEEP INTO THE DAY, NOT WHAT THEY DID LAST ***',
  B.lastBeat(r2) === 'finished', B.lastBeat(r2));
ok('and a session that did nothing at all says so instead of throwing',
  B.lastBeat(B.blank()) === null && typeof B.render(B.blank()) === 'string');

/* AND HOW LONG THEY SAT THERE, which is the difference between a tester who was
   stuck and a tester who closed the tab. */
var r3 = B.blank();
B.mark(r3, 'took', { ms: 60000 });
r3.ms = 400000;
ok('the paste says how long they sat at the place they stopped',
  B.stalledMs(r3) === 340000, B.mmss(B.stalledMs(r3)));

/* AN OLDER SITTING IS NEVER THROWN AWAY: on a phone the reload is a WHEN. */
var older = B.blank();
B.mark(older, 'rang', { ms: 3000 });
older.ms = 120000; older.words = 'the map confused me';
var merged = B.merge(older, B.mark(B.blank(), 'walked', { ms: 2000 }));
merged.ms = 120000 + 2000;
ok('*** A RELOAD IS A SECOND SITTING, NEVER A SECOND TESTER ***',
  merged.sessions === 2 && merged.beats.rang.ms === 3000 && merged.beats.walked.ms === 2000
  && merged.words === 'the map confused me',
  merged.sessions + ' sittings, ' + Object.keys(merged.beats).length + ' beats kept');
ok('and a blob from an older version is discarded whole rather than half applied',
  B.merge({ v: 999, beats: { rang: { ms: 1 } } }, B.blank()).beats.rang === undefined);

/* ==========================================================================
   B. THE QUESTIONS, AND WHY THEY ARE NOT THE ROW'S LITERAL THREE
   ========================================================================== */
head('B. PEOPLE ARE NICE AND THEY WILL LIE TO YOU');
ok('three taps and one box, which is the shape the row asks for',
  B.QUESTIONS.length === 3 && !!B.WORDS.ask);

/* THE RESEARCHED FIX, MADE CHECKABLE. Every source lands on the same place:
   "did you have fun" is the textbook vague question and "would you play again"
   is the textbook polite one. Named here so a later session that reaches for
   them has to argue with the reason rather than rediscover it. */
var asked = B.QUESTIONS.map(function (q) { return q.ask.toLowerCase(); }).join(' | ')
  + ' | ' + B.WORDS.ask.toLowerCase();
var VAGUE = ['did you have fun', 'was it fun', 'did you like', 'play again',
  'was it confusing', 'did you enjoy', 'rate '];
var hitVague = VAGUE.filter(function (v) { return asked.indexOf(v) >= 0; });
ok('*** NOT ONE OF THE QUESTIONS PEOPLE ARE POLITE ABOUT ***',
  hitVague.length === 0, hitVague.join(', ') || 'none of the seven');

/* THE FIRST TAP IS THE ONLY ONE THAT IS NOT ABOUT FEELINGS. People who love a
   thing send it to somebody; people who are being kind say they had fun. */
var send = B.QUESTIONS[0];
ok('*** THE FIRST TAP ASKS ABOUT A THING THEY WOULD DO, NOT A THING THEY FELT ***',
  /send this to somebody/i.test(send.ask), send.ask);
ok('and it has three answers, because the middle one is not a pass',
  send.options.length === 3
  && /already/i.test(send.options[0]) && /^no$/i.test(send.options[2]),
  send.options.join(' / '));
ok('no question is a yes or a no',
  B.QUESTIONS.every(function (q) {
    var o = (q.options || []).map(function (s) { return s.toLowerCase(); });
    return !(o.length === 2 && o.indexOf('yes') >= 0 && o.indexOf('no') >= 0); }));
ok('the box asks for one change rather than for thoughts',
  /change one thing/i.test(B.WORDS.ask), B.WORDS.ask);
ok('and every word of it is his to retype',
  B.QUESTIONS.every(function (q) { return q.draft === true; }) && B.WORDS.draft === true);

/* NO EM DASHES ANYWHERE, in a file whose whole content is copy. */
var COPY = asked + ' ' + B.QUESTIONS.map(function (q) {
  return (q.options || []).concat(q.extra || []).join(' '); }).join(' ')
  + ' ' + B.WORDS.hint + ' ' + B.BEATS.map(function (b) { return b.said; }).join(' ')
  + ' ' + B.BUCKETS.map(function (b) { return b.label; }).join(' ');
ok('not one em dash in any of it', COPY.indexOf('—') < 0);

/* ==========================================================================
   C. THE TAPS ARE ABOUT THEIR OWN DAY
   ========================================================================== */
head('C. NOBODY IS ASKED ABOUT A PART OF THE DAY THEY NEVER REACHED');
var early = B.blank();
B.mark(early, 'open', { ms: 100 });
B.mark(early, 'rang', { ms: 200 });
var earlyOpts = B.optionsFor(B.QUESTIONS[1], early);
ok('*** A TESTER WHO STOPPED AT THE PHONE IS NEVER ASKED ABOUT THE ENDING ***',
  earlyOpts.indexOf('the end') < 0 && earlyOpts.indexOf('the phone') >= 0,
  earlyOpts.join(' / '));
var whole = B.blank();
B.beatKeys().forEach(function (k, i) { B.mark(whole, k, { ms: (i + 1) * 1000 }); });
var wholeOpts = B.optionsFor(B.QUESTIONS[1], whole);
ok('and a tester who played the whole day is asked about the whole day',
  wholeOpts.length === B.BUCKETS.length + 1, wholeOpts.join(' / '));
ok('every one of them still gets a way to say no part of it was work',
  B.optionsFor(B.QUESTIONS[1], B.blank()).indexOf('none of it did') >= 0
  && B.optionsFor(B.QUESTIONS[2], B.blank()).indexOf('I always knew') >= 0);

/* ==========================================================================
   D. THE HALF-PLAYED SESSION, WHICH IS THE WHOLE REASON THIS EXISTS
   ========================================================================== */
head('D. A SESSION THAT STOPS STILL WRITES A PASTE');
var quit = B.blank();
quit.build = 'BUILD 8/27z - SOMETHING'; quit.seed = 2691674296; quit.seedText = 'bohemia';
quit.device = 'iPhone'; quit.ms = 260000; quit.day = 1; quit.min = 545;
B.mark(quit, 'open', { ms: 2000 });
B.mark(quit, 'rang', { ms: 9000 });
B.mark(quit, 'took', { ms: 41000 });
var pasteQ = B.render(quit, { send: 'no' }, 'i could not work out where to go');
ok('*** IT SAYS WHERE THEY STOPPED AND HOW LONG THEY SAT THERE ***',
  /GOT AS FAR AS: took the job/.test(pasteQ) && /STOPPED THERE FOR: 3m 39s/.test(pasteQ),
  (pasteQ.match(/STOPPED THERE FOR: .*/) || [])[0]);
ok('the build and the seed are in it, which is what turns a paste into a report',
  /BUILD: BUILD 8\/27z/.test(pasteQ) && /SEED: bohemia \/ 2691674296/.test(pasteQ));
ok('it never claims a beat that did not happen',
  pasteQ.indexOf('finished the job') > pasteQ.indexOf('NEVER GOT TO:'),
  (pasteQ.match(/NEVER GOT TO:\n.*/) || [])[0]);
/* THE FIRST PASTE OFF THE REAL DEMO READ "the phone rang" ABOVE "got out of
   bed" and looked like a bug. It was the game telling the truth: the phone is
   already ringing while he is still in bed. A list that claims to be
   chronological and is not makes a reader distrust the whole page. */
var jumbled = B.blank();
B.mark(jumbled, 'up', { ms: 14000 });
B.mark(jumbled, 'rang', { ms: 10000 });
var jp = B.render(jumbled);
ok('*** AND IT IS IN THE ORDER IT ACTUALLY HAPPENED, NOT THE ORDER A DAY GOES ***',
  jp.indexOf('the phone rang') < jp.indexOf('got out of bed'),
  'the phone rings while he is still in bed, and the paste says so');
ok('a tester who never opened it is a hole the paste admits to',
  B.CANNOT.some(function (s) { return /never opens the card/.test(s); })
  && B.CANNOT.length >= 3, B.CANNOT.length + ' things it says it cannot answer');

/* ==========================================================================
   E..G  THE REAL SURFACE
   ========================================================================== */
function requirePlaywright() {
  for (var i = 0, g = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']; i < g.length; i++) {
    try { return require(path.join(g[i], 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
var SETTLE = require(__dirname + '/bohemia_settle.js').settle;
var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

/* *** THIS GATE PLAYS. IT DOES NOT CALL mark(). ***
   The ending gate learned this the hard way one day ago: a probe that sends the
   message the real sender is supposed to send is still a side door, and it went
   green over a chain that did not work. So nothing below stamps a beat, tells
   the city its build, or writes the record. It taps the splash, gets out of
   bed, takes the job and walks, and then reads what the ticker wrote. */
async function openDemo(browser, file) {
  var page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.__errs = [];
  page.on('pageerror', function (e) { page.__errs.push(String(e.message).slice(0, 140)); });
  await page.goto('file://' + path.join(ROOT, file));
  await SETTLE(page, 12000);
  await page.evaluate(function () {
    var f = document.getElementById('fronttap') || document.getElementById('front');
    if (f) f.click();
  });
  await SETTLE(page, 10000);
  await wait(3000);
  return page;
}
function cityOf(page) {
  return page.frames().filter(function (x) { return /BOHEMIA_CITY_WORLD/.test(x.url()); })[0];
}

(async function () {
  var browser = null;
  try {
    browser = await requirePlaywright().chromium.launch({ args: ['--no-sandbox'] });
    var page = await openDemo(browser, 'slices/BOHEMIA_DEMO.html');
    var fr = cityOf(page);

    head('E. ON THE GLASS, PLAYED RATHER THAN POSTED');
    ok('the demo opens and the city is in it', !!fr);
    if (!fr) throw new Error('no city frame');

    var boot = await fr.evaluate(function () {
      return { mod: typeof BohemiaBlackBox !== 'undefined', build: CT_BUILD,
               demo: CT_IS_DEMO,
               stored: (localStorage.getItem('boh.demo.card') || '').length }; });
    ok('the recorder is in the city', boot.mod === true);
    /* NOTHING HERE TOLD IT. The shell answers the same question the ending
       already asks, so a build id rides a handshake that is proved rather than
       a second channel that can rot on its own. */
    ok('*** THE CITY KNOWS WHICH BUILD IT IS, AND THIS GATE DID NOT TELL IT ***',
      typeof boot.build === 'string' && /BUILD /.test(boot.build), boot.build);
    ok('and it is stamped DEMO, so a tester\'s paste says which surface they were on',
      /^DEMO/.test(boot.build || ''), boot.build);
    ok('the record is already being written before anybody has been asked anything',
      boot.stored > 0, boot.stored + ' bytes at boot');

    /* GET UP, AND GET UP FAST. This is the claim that went red and found a real
       hole: a two second ticker cannot see a card that opens and closes between
       two of its looks, so a player who dismissed the wake card quickly got a
       paste saying he never got out of bed. A DURABLE FACT CAN BE SAMPLED; A
       TRANSIENT ONE NEEDS A WITNESS, and the witness is an observer on the card
       rather than a hook in anybody's day loop. */
    await fr.evaluate(function () {
      var g = document.querySelector('#daycardIn .dcgo') || document.querySelector('#daycardIn .dcbtn');
      if (g) g.click(); });
    ok('*** THE CARD IS WATCHED, NOT SAMPLED, BECAUSE A TAP IS A TRANSITION ***',
      await fr.evaluate(function () { return FB_WATCHED === true; }));
    await wait(2600);
    /* TAKE THE JOB AND WALK OFF THE BLOCK. */
    await fr.evaluate(function () {
      for (var i = 0; i < 3; i++) {
        var g = document.querySelector('#daycardIn .dcgo') || document.querySelector('#daycardIn .dcbtn');
        if (g) g.click(); }
      try { offerAccept(); } catch (e) {}
      try { cardHide(); } catch (e) {}
      try { hx += 600; hy += 200; render(); } catch (e) {} });
    await wait(2600);
    var played = await fr.evaluate(function () {
      return { beats: BohemiaBlackBox.reached(FB), last: BohemiaBlackBox.lastBeat(FB),
               ms: FB.ms, seed: FB.seed, device: FB.device }; });
    ok('*** THE TICKER WROTE THE DAY DOWN WHILE IT WAS BEING PLAYED ***',
      played.beats.indexOf('up') >= 0 && played.beats.indexOf('took') >= 0
      && played.beats.indexOf('walked') >= 0,
      played.beats.join(' -> '));
    ok('and it carries the seed and the device without being handed them',
      played.seed === 2691674296 && /\d+x\d+ @/.test(played.device || ''),
      String(played.device || '').slice(-24));

    head('F. THE CARD, AND THE DOOR A QUIT CAN FIND');
    var card = await fr.evaluate(function () {
      var out = {};
      try { fbShow(); } catch (e) { out.threw = String(e).slice(0, 140); }
      var inn = document.getElementById('daycardIn');
      out.qs = [].map.call(inn.querySelectorAll('.fbq'), function (e) { return e.textContent; });
      out.opts = [].map.call(inn.querySelectorAll('.fbopt'), function (e) { return e.textContent; });
      out.box = !!document.getElementById('fbwords');
      inn.querySelector('.fbopt').click();
      out.lit = [].map.call(document.querySelectorAll('#daycardIn .fbopt.on'),
        function (e) { return e.textContent; });
      document.querySelector('#daycardIn .fbopt').click();
      out.untapped = document.querySelectorAll('#daycardIn .fbopt.on').length;
      document.querySelector('#daycardIn .fbopt').click();
      var all = document.querySelectorAll('#daycardIn .fbopt');
      for (var i = 0; i < all.length; i++)
        if (all[i].textContent === 'the phone') { all[i].click(); break; }
      document.getElementById('fbwords').value = 'the phone took me ages to find';
      document.querySelector('#daycardIn .fbgo').click();
      return out; });
    ok('three questions and a box are on the glass', card.qs.length === 4 && card.box === true,
      card.qs.join(' | '));
    ok('*** THE CHOICES ARE HIS OWN DAY: HE NEVER TALKED TO ANYBODY, SO NOBODY ASKS ***',
      card.opts.indexOf('talking to people') < 0 && card.opts.indexOf('the phone') >= 0,
      card.opts.join(' / '));
    ok('an answer lights up', card.lit.length === 1, card.lit.join(''));
    ok('and tapping it again takes it back, because a thumb misses',
      card.untapped === 0);

    await wait(500);
    var shell = await page.evaluate(function () {
      var m = document.getElementById('exportModal'), t = document.getElementById('expText');
      return { open: m ? getComputedStyle(m).display : 'none', text: t ? t.value : '' }; });
    ok('*** THE PASTE COMES OUT THE SAVE BLOB\'S OWN DOOR, IN THE SHELL ***',
      shell.open === 'block' && shell.text.length > 200,
      shell.text.length + ' characters in the share box');
    ok('and it carries the build, the seed, the device and their words',
      /BUILD: DEMO/.test(shell.text) && /SEED: bohemia/.test(shell.text)
      && /DEVICE: /.test(shell.text) && /the phone took me ages to find/.test(shell.text));
    ok('and the answers they actually gave',
      /WHAT PART FELT LIKE WORK\?\n  the phone/.test(shell.text),
      (shell.text.match(/WHAT PART FELT LIKE WORK\?\n.*/) || [])[0]);

    /* THE QUIT THAT CAME BACK. On a phone the reload is a WHEN, not an if. */
    await page.reload();
    await SETTLE(page, 12000);
    await page.evaluate(function () {
      var f = document.getElementById('fronttap') || document.getElementById('front');
      if (f) f.click(); });
    await SETTLE(page, 10000);
    await wait(3000);
    var fr2 = cityOf(page);
    var back = await fr2.evaluate(function () {
      return { beats: BohemiaBlackBox.reached(FB), sessions: FB.sessions,
               words: FB.words, answers: FB.answers }; });
    ok('*** A RELOAD KEEPS EVERY BEAT, EVERY ANSWER AND EVERY WORD ***',
      back.sessions === 2 && back.beats.indexOf('took') >= 0
      && /the phone took me ages/.test(back.words || '')
      && back.answers && back.answers.work === 'the phone',
      back.sessions + ' sittings, ' + back.beats.length + ' beats');

    var drawer = await fr2.evaluate(function () {
      document.getElementById('savebtn').click();
      var b = document.getElementById('sv-fb');
      var label = b ? b.textContent : null;
      if (b) b.click();
      return { label: label,
               up: document.getElementById('daycard').classList.contains('on'),
               qs: document.querySelectorAll('#daycardIn .fbq').length }; });
    ok('*** AND THERE IS A DOOR THAT IS NOT THE ENDING, WHICH IS THE WHOLE POINT ***',
      !!drawer.label && drawer.up === true && drawer.qs === 4,
      '"' + drawer.label + '" in the drawer a tester already opens for text');

    head('G. AND THE ENDING KEEPS ITS SILENCE');
    /* PEAK-END IS WHY THERE IS NOTHING TO PRESS ON THE LAST CARD, so the door
       does not exist at the moment the message lands. It arrives after. */
    var end = await fr2.evaluate(function () {
      return new Promise(function (res) {
        try { cardHide(); } catch (e) {}
        try { offerAccept(); } catch (e) {}
        try { DQ.rt.setStage(30); } catch (e) {}
        try { showEnding(); } catch (e) {}
        var o = { pressAtOnce: document.querySelectorAll('#daycardIn .dcgo,#daycardIn .dcbtn').length,
                  says: document.querySelectorAll('#daycardIn .endsay').length };
        /* *** MEASURED AT A MOMENT A PERSON COULD ACTUALLY BE AT. *** The first
           cut of this read the door in the same synchronous block as showEnding,
           which is trivially empty for ANY setTimeout: mutating the pause to
           zero left the claim green. A CLAIM THAT PASSES BECAUSE OF WHEN IT
           LOOKED, NOT BECAUSE OF WHAT IS TRUE. A second and a half in is a real
           instant, and at that instant the message still has the screen. */
        setTimeout(function () {
          o.atOneAndAHalf = !!document.getElementById('fbdoorbtn');
          setTimeout(function () {
            o.after = !!document.getElementById('fbdoorbtn');
            o.doorText = (document.getElementById('fbdoorbtn') || {}).textContent || null;
            o.pressAfter = document.querySelectorAll('#daycardIn .dcgo,#daycardIn .dcbtn').length;
            var d = document.getElementById('fbdoorbtn'); if (d) d.click();
            o.opened = document.querySelectorAll('#daycardIn .fbq').length;
            res(o);
          }, 4200);
        }, 1500); }); });
    ok('the message really lands', end.says >= 3, end.says + ' lines');
    ok('*** A SECOND AND A HALF IN, THE MESSAGE STILL HAS THE SCREEN TO ITSELF ***',
      end.atOneAndAHalf === false && end.pressAtOnce === 0,
      'nothing to press, and nobody asking for a score');
    ok('*** THE DOOR ARRIVES AFTER THE MESSAGE HAS BEEN ALLOWED TO SIT ***',
      end.after === true && end.pressAfter === 0,
      '"' + String(end.doorText || '').trim() + '"');
    ok('and it opens the card', end.opened === 4, end.opened + ' questions');

    var errs = page.__errs;
    ok('nothing threw on the demo, start to finish', errs.length === 0, errs.slice(0, 2).join(' | '));
    await page.close();

    /* AND THE WORKSHOP IS NOT COLLATERAL. His bench records too (he playtests,
       and the 8/25 dispatch was him playing), but it never ends, so it never
       shows the door under an ending it does not have. */
    var shop = await openDemo(browser, 'slices/BOHEMIA_ALPHA_0_9.html');
    var sfr = cityOf(shop);
    var sb = await sfr.evaluate(function () {
      return { mod: typeof BohemiaBlackBox !== 'undefined', demo: CT_IS_DEMO,
               build: CT_BUILD, stored: (localStorage.getItem('boh.demo.card') || '').length }; });
    ok('his bench records too, and knows it is not the demo',
      sb.mod === true && sb.demo === false && sb.stored > 0
      && !/^DEMO/.test(sb.build || ''), sb.build);
    ok('and nothing threw on his bench either', shop.__errs.length === 0,
      shop.__errs.slice(0, 2).join(' | '));
    await shop.close();
  } catch (e) {
    fail++;
    console.log('  FAIL the real surface threw   ' + String(e && e.message).slice(0, 200));
  } finally {
    if (browser) try { await browser.close(); } catch (_e) {}
  }

  /* ==========================================================================
     H. AND THE PIECES ARE WHERE THE TOOL PUT THEM
     ========================================================================== */
  head('H. THE SEAMS');
  var city = fs.readFileSync('slices/BOHEMIA_CITY_WORLD.html', 'utf8');
  var alpha = fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8');
  ok('the recorder is inlined in the city, and it closes its own banner',
    (city.match(/\/\* ==== engine\/bohemia_blackbox\.js ==== \*\//g) || []).length === 2,
    'a module that does not close itself is the one that gets cut out');
  ok('the city holds the module\'s current text, not an older copy of it',
    city.indexOf(fs.readFileSync('engine/bohemia_blackbox.js', 'utf8').trim()) > 0,
    'run tools/bohemia_city_module_resync.py if this goes red');
  ok('the shell answers with the stamp it is actually showing, never a retyped one',
    /bohemiaBuild:__bs\?String\(__bs\.textContent/.test(alpha));
  ok('the paste rides the export path the save blob already uses',
    /bohemiaFeedbackExport/.test(alpha) && /bohemiaFeedbackExport/.test(city));

  console.log('\n' + (fail ? 'FEEDBACK GATE: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'FEEDBACK GATE: ' + pass + ' ok, 0 failed'));
  process.exit(fail ? 1 : 0);
})();
