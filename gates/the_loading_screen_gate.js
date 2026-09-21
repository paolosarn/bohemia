/* ============================================================================
   THE LOADING SCREEN  (UI lane 11, 9/22) -- row [cook panels] item 1.
   *** PAOLO 9/21: "there's no loading screen yet, bro I wanna cool loading
   screen... maybe even a loading bar if you're smart enough for." ***
   records/BOHEMIA_PAOLO_I_WANT_A_COOL_LOADING_SCREEN_9_21_26.md, ruling 3:
   "A bar that reads REAL progress, never a fake timer; it reaches the end
   exactly when the pad works. A bar that lies is rule 14(d) in a new coat."

   THE HARD LEG IS THE ONE THAT MATTERS: A BAR THAT LIES IS THE DEFAULT.
   Nearly every loading bar ever shipped is a timer, because a timer always
   looks good and never blocks a release. So this gate does not ask whether the
   bar CAN show real progress; it proves the bar CANNOT move without it. Two
   ways, because either alone is cheatable:
     1. IN THE SOURCE: the file contains no setTimeout, setInterval or
        requestAnimationFrame at all. A timer that exists can be pointed at the
        fill later by somebody in a hurry.
     2. ON THE GLASS: mount it, report nothing, wait three real seconds, and the
        fraction and the painted width are both still zero. Reading the source
        is not proof; this lane has been wrong about a file it had read twice.

   AND THE BIBLE IS MEASURED, NOT ASSERTED (rule 20, records/..._BIBLE_9_20_26):
     rule 1, ONE WRONG THING: exactly one line of the boot log is the wrong one.
       This leg is here because I SHIPPED TWO on the first cut of this screen --
       the residents line and a footer reading THIS TERMINAL IS UNATTENDED --
       and two wrong things is a haunted house. Caught by rendering it and
       looking, which is why the leg now exists in the machine.
     rule 5, THE DEAD INSTITUTION'S TYPE: only the game's own two registers, no
       third family anywhere, nothing decorative.
     rule 8, DIEGETIC OR DEAD: the tape drop-out lives INSIDE the in-world
       screen and nothing draws over the whole frame.

   Run: node gates/the_loading_screen_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const FILE = 'slices/bohemia_loading_screen.js';
const SRC = fs.readFileSync(path.join(ROOT, FILE), 'utf8');

let pass = 0, fail = 0;
const ok = (m, g, extra) => {
  if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
  g ? pass++ : fail++;
  console.log((g ? '  ok   ' : '  FAIL ') + m + (extra ? '  [' + extra + ']' : ''));
};
function pw() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (e) {}
  }
  return require('playwright');
}

(async () => {
  console.log('\nTHE LOADING SCREEN  (rule 22 item 1, ruling 3: the bar cannot lie)\n');

  /* ---- 1. the source carries no timer at all ---- */
  const timers = (SRC.match(/\b(setTimeout|setInterval|requestAnimationFrame)\s*\(/g) || []);
  ok('THE SOURCE HAS NO TIMER IN IT AT ALL', timers.length === 0,
     timers.join(' ') || 'none');

  /* ---- 2. the bible, read off the source it is written in ---- */
  const lines = SRC.slice(SRC.indexOf('var LINES = ['), SRC.indexOf('];', SRC.indexOf('var LINES = [')));
  const flagged = (lines.match(/,\s*1\]/g) || []).length;
  const total = (lines.match(/\[\s*'/g) || []).length;
  ok('bible rule 1: the boot log has exactly ONE wrong thing in it',
     flagged === 1, flagged + ' flagged of ' + total + ' lines');
  const fams = (SRC.match(/font-family:[^;']+/g) || [])
    .map(s => s.replace('font-family:', '').trim());
  const bad = fams.filter(f => !/var\(--face-(casing|screen)/.test(f));
  ok('bible rule 5: only the two registers, no third family anywhere',
     bad.length === 0, bad.join(' | ') || fams.length + ' declarations, all ours');
  ok('bible rule 8: the drop-out is a child of the in-world screen',
     /<div id="blsglass"><div id="blsband">/.test(SRC));
  ok('  and nothing is drawn over the whole frame',
     !/#bls::(before|after)/.test(SRC));

  /* ---- 2b. THE TWO CONDITIONS WORDS Q28 SENT WITH THEIR LINES, and both are
     promises rather than style notes (records/BOHEMIA_WORDS_Q28_WHAT_THE_LOADING
     _SCREEN_SAYS_9_23_26.md): a line that says it is counting while nothing is
     counting is the worst bug in the game by his own ruling, and the count in the
     slow line is the real file count or it does not ship. ---- */
  ok('every state line names the stage it is wired to',
     /\['boot',/.test(SRC) && /\['world',/.test(SRC) && /\['block',/.test(SRC));
  ok('  and a line is skipped when its stage has not reported',
     /if \(key !== '\*' && !SRC\.hasOwnProperty\(key\)\) continue;/.test(SRC));
  ok('the slow line is printed from the bar\'s own numbers, not a made-up count',
     /'STILL WORKING\. ' \+ c\.done \+ ' OF ' \+ c\.total/.test(SRC));

  /* ---- 3. on the glass ---- */
  const probe = path.join(ROOT, 'slices', '__loading_gate_probe.html');
  fs.writeFileSync(probe,
    '<!doctype html><meta charset=utf-8><link rel="stylesheet" href="bohemia_ui_3d.css">'
    + '<style>html,body{margin:0;background:#000}#stage{position:relative;width:390px;height:844px}</style>'
    + '<div id="stage"></div><script src="bohemia_loading_screen.js"></script>'
    + '<script>BohemiaLoading.mount(document.getElementById("stage"));</script>');
  const { chromium } = pw();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 90)));
  await p.goto('file://' + probe, { waitUntil: 'networkidle' });

  const mounted = await p.evaluate(() => !!document.getElementById('blsunit'));
  ok('it mounts', mounted);

  /* THE LEG THE WHOLE FILE EXISTS FOR. Three real seconds, nothing reported. */
  const before = await p.evaluate(() => ({
    f: BohemiaLoading.fraction(),
    w: document.getElementById('blsfill').style.width,
    t: document.getElementById('blspct').textContent.trim()
  }));
  await p.waitForTimeout(3000);
  const after = await p.evaluate(() => ({
    f: BohemiaLoading.fraction(),
    w: document.getElementById('blsfill').style.width,
    t: document.getElementById('blspct').textContent.trim()
  }));
  ok('THREE REAL SECONDS WITH NOTHING REPORTED AND THE BAR HAS NOT MOVED',
     after.f === 0 && before.f === 0 && after.w === before.w,
     'fraction ' + before.f + ' -> ' + after.f + ', width ' + before.w + ' -> ' + after.w);
  ok('  and it says zero rather than inventing a number', after.t === '0%' || after.t === '0%'.trim(),
     JSON.stringify(after.t));

  /* THE PROMISE RULE, ON THE GLASS: a stage nobody reported does not get to say it
     is working. Reading the source for the `continue` is not enough -- this lane has
     been wrong about a file it had read twice. */
  const said = await p.evaluate(() => {
    const t = document.getElementById('blslog').textContent;
    return { valley: t.indexOf('READING THE VALLEY') >= 0,
             block:  t.indexOf('FINDING YOUR BLOCK') >= 0,
             operator: t.indexOf('NO OPERATOR ON DUTY') >= 0 };
  });
  ok('with nothing reported, no stage claims to be working',
     !said.valley && !said.block, JSON.stringify(said));
  ok('  and the standing line is there from the moment the machine is on', said.operator);
  const wired = await p.evaluate(() => {
    BohemiaLoading.report('boot', 2, 4);
    const t = document.getElementById('blslog').textContent;
    return { valley: t.indexOf('READING THE VALLEY') >= 0,
             block:  t.indexOf('FINDING YOUR BLOCK') >= 0,
             slow:   /STILL WORKING\. 2 OF 4\./.test(t) };
  });
  ok('the stage that reported says its line', wired.valley);
  ok('  and the stage that did not is still silent', !wired.block);
  ok('  and the slow line prints the real count', wired.slow);

  /* the fraction is arithmetic on what was reported, and nothing else */
  const math = await p.evaluate(() => {
    BohemiaLoading.report('world', 3, 12);
    BohemiaLoading.report('art', 1, 8);
    const s = BohemiaLoading.sources();
    let d = 0, t = 0;
    for (const k in s) { d += s[k].done; t += s[k].total; }
    return { f: BohemiaLoading.fraction(), w: document.getElementById('blsfill').style.width,
             d: d, t: t };
  });
  ok('the bar is exactly the arithmetic of what was reported',
     Math.abs(math.f - (math.d / math.t)) < 1e-9,
     'reported ' + math.d + ' of ' + math.t + ', bar says ' + math.f.toFixed(4));
  ok('  and the paint agrees with the arithmetic',
     math.w === Math.round(math.f * 100) + '%', math.w);

  /* ready() refuses while something promised has not finished, and names it */
  const refuse = await p.evaluate(() => {
    BohemiaLoading.expect(['world', 'art', 'sound']);
    const r = BohemiaLoading.ready();
    return { ok: r.ok, waiting: r.waitingOn, isReady: BohemiaLoading.isReady() };
  });
  ok('ready() REFUSES while a promised source is unfinished', refuse.ok === false);
  ok('  and it names which ones', refuse.waiting.length === 3, refuse.waiting.join(','));
  ok('  and the screen does not pretend it is done', refuse.isReady === false);

  /* BEGIN is dead until the game really is in */
  const early = await p.evaluate(() => {
    window.__began = 0; BohemiaLoading.onBegin(() => window.__began++);
    document.querySelector('#blsgo button').click();
    return { began: window.__began, says: document.querySelector('#blsgo button').textContent.trim() };
  });
  ok('BEGIN does nothing while the game is still loading', early.began === 0);
  ok('  and it says WAIT rather than looking pressable', early.says === 'WAIT', early.says);

  const done = await p.evaluate(() => {
    /* finish every source that exists, including the one the promise-rule leg above
       reported -- a leg that only finishes the sources it happens to remember leaves
       the bar short and blames the module for its own bookkeeping. */
    const s = BohemiaLoading.sources();
    for (const k in s) BohemiaLoading.report(k, s[k].total, s[k].total);
    BohemiaLoading.report('sound', 4, 4);
    const r = BohemiaLoading.ready();
    const btn = document.querySelector('#blsgo button');
    const rect = btn.getBoundingClientRect();
    btn.click(); btn.click();
    return { ok: r.ok, began: window.__began, says: btn.textContent.trim(),
             lit: btn.classList.contains('on'),
             w: Math.round(rect.width), h: Math.round(rect.height),
             fill: document.getElementById('blsfill').style.width,
             pct: document.getElementById('blspct').textContent.trim() };
  });
  ok('ready() lets go once every promised source is in', done.ok === true);
  ok('  the bar is at the end exactly then', done.fill === '100%' && done.pct === '100%',
     done.fill + ' / ' + done.pct);
  ok('  BEGIN lights up and says so', done.lit && done.says === 'BEGIN', done.says);
  ok('  one tap fires it, and a second tap does not fire it twice', done.began === 1,
     'fired ' + done.began);
  ok('  and a whole thumb reaches it', done.w >= 44 && done.h >= 44, done.w + 'x' + done.h);

  ok('nothing threw anywhere in this', errs.length === 0, errs.join(' | ') || 'clean');

  await b.close();
  fs.unlinkSync(probe);
  console.log('\nTHE LOADING SCREEN: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(String(e && e.stack || e)); process.exit(1); });
