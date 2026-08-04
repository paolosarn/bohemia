/* BOHEMIA TOUCH GUARD GATE (7/27/26) — the phone must not be allowed to eat the
 * controls.
 *
 * Paolo, on his phone: "There is no [selec]tion when I'm pressing the button,
 * I'm trying to search shit and then it's like typing. I'm trying to copy and
 * paste the arrow of move. It's very strange." And, in the same breath, "I
 * can't get outside the suburb."
 *
 * THOSE ARE ONE BUG. This game's only movement input is press-and-HOLD on an
 * arrow button. iOS Safari's default response to a long press on text is the
 * selection magnifier and the Copy / Look Up / Search callout. The whole 33MB
 * alpha contained ZERO occurrences of `-webkit-touch-callout`, and the shell's
 * reset never set user-select at all — so holding the d-pad raised the OS menu
 * instead of walking him anywhere. He was not stuck in the suburb because of
 * level design (measured: every suburb sample is 16-50 steps from a different
 * district, and 7,645 of 7,649 built cells can be walked out of). He was stuck
 * because the button did not work on the only device this game ships on.
 *
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and CSS resets are exactly the
 * kind of thing a later refactor quietly drops.
 *
 * HALF OF THIS IS MEASURED AND HALF CANNOT BE, AND THE GATE SAYS SO INSTEAD OF
 * PRETENDING. `-webkit-touch-callout` is a WebKit-only property; the Chromium
 * we drive here does not implement it, drops it from computed style AND strips
 * it from cssText, so no headless check on this machine can observe it. What
 * IS observable is user-select, which is the other half of the same failure
 * (the magnifier and the text selection). So:
 *   MEASURED  — boot the real alpha, read the COMPUTED user-select of the
 *               actual controls Paolo touches (tab bar, walk d-pad, mode
 *               button) and confirm text fields still allow paste.
 *   SOURCE    — assert every stylesheet reset in the alpha and each embedded
 *               frame declares -webkit-touch-callout:none on the universal
 *               selector, so it reaches every control including ones nobody
 *               has written yet. Verified on Paolo's phone is the real proof;
 *               this stops the regression.
 *
 *   node gates/touch_guard_gate.js
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ALPHA = path.join(path.dirname(__dirname), 'slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const READ = sel => {
  const el = document.querySelector(sel);
  if (!el) return null;
  return { select: getComputedStyle(el).webkitUserSelect || getComputedStyle(el).userSelect };
};

/* ---- SOURCE HALF: the declaration Chromium refuses to show us ------------- */
{
  const src = fs.readFileSync(ALPHA, 'utf8');
  const shell = src.replace(/const [A-Z_]+_B64='[^']*'/g, "B64=''");
  const universal = s => (s.match(/\*\{[^}]*\}/g) || []).some(r => /-webkit-touch-callout\s*:\s*none/.test(r));
  ok('SHELL SOURCE: the universal reset declares -webkit-touch-callout:none, so every control — ' +
    'including ones not written yet — inherits the guard', universal(shell));
  /* MIGRATED 8/4: THIS LOOP WAS SILENTLY DROPPING THE CITY.
     The walked world used to be a base64 constant in the alpha; the CITY lane
     moved it out to slices/BOHEMIA_CITY_WORLD.html so the alpha opens 29x
     faster. The `continue` below then did exactly the wrong thing - no key, no
     failure, no claim, the biggest frame in the game just quietly stopped being
     checked. That is the same shape as the fifty checks CITY TAB was stepping
     over (records/BOHEMIA_THE_GATES_COULD_NOT_SEE_THE_CITY_8_4_26.md): a gate
     that skips is worse than a gate that fails, because it reports GREEN.
     The city is asked for by name now (gates/bohemia_city_app.js, the one place
     that knows where the world lives) and a MISSING payload is a FAILURE, never
     a skip.
     TWO SESSIONS BUILT THAT RESOLVER THE SAME DAY. The WORLD lane's landed on
     main first, so it is the one; a second resolver for the same fact would be
     the very thing both of them exist to stop. */
  const _app = require('./bohemia_city_app.js').read();
  const cityTxt = _app ? _app.src : null;
  ok('CITY FRAME SOURCE: the walked world is findable at all (it left the alpha on 8/4; a gate that cannot find it must FAIL, never skip)',
    !!cityTxt && cityTxt.length > 100000);
  if (cityTxt) ok('CITY FRAME SOURCE: its universal reset declares -webkit-touch-callout:none', universal(cityTxt));
  for (const key of ['COMBAT_B64', 'RIG_B64']) {
    const k = "const " + key + "='";
    ok(key.replace('_B64', '') + ' FRAME SOURCE: the payload is still in the alpha to check', src.indexOf(k) >= 0);
    if (src.indexOf(k) < 0) continue;
    const a0 = src.indexOf(k) + k.length, a1 = src.indexOf("'", a0);
    const d = Buffer.from(src.slice(a0, a1), 'base64').toString('utf8');
    ok(key.replace('_B64', '') + ' FRAME SOURCE: its universal reset declares -webkit-touch-callout:none', universal(d));
  }
  /* ------------------------------------------------------------------------
     THE RUN, WHICH THIS GATE MISSED ENTIRELY THE FIRST TIME.
     Paolo, 7/28: "when I'm playing it and I press the direction button keys it
     tries to like copy and paste it like it's text or something."
     The 7/27 fix covered the shell and the three BASE64 frames. The RUN is not
     one of those: the alpha loads it by iframe SRC from its own file, so the
     patch tool never touched it and this gate never looked at it. Green gate,
     broken controls, on the ONE surface he actually plays - which is backlog
     0O's standing rule ("HE PLAYS THE RUN. THE RUN IS A SEPARATE RENDERER")
     arriving a second time in a week.
     BOTH FILES ARE CHECKED. The generated run is what ships, but the guard has
     to live in the DEV SOURCE or the next `node tools/build_run_slice.js`
     erases it - which is exactly how a patch applied to a generated file
     silently disappears.
     ------------------------------------------------------------------------ */
  for (const [label, file] of [
    ['RUN DEV SOURCE (where the guard must LIVE)', 'slices/BOHEMIA_RUN_SLICE_7_26_26.html'],
    ['RUN AS SHIPPED (what the alpha loads)',      'slices/BOHEMIA_RUN_CURRENT.html'],
  ]) {
    const p = path.join(path.dirname(__dirname), file);
    if (!fs.existsSync(p)) { ok(label + ': the file exists', false); continue; }
    const s = fs.readFileSync(p, 'utf8');
    ok(label + ': the universal reset declares -webkit-touch-callout:none', universal(s));
    ok(label + ': the universal reset also kills user-select (the magnifier half)',
      (s.match(/\*\{[^}]*\}/g) || []).some(r => /user-select\s*:\s*none/.test(r)));
    ok(label + ': text fields are given copy/paste BACK (the save code is meant to be copied)',
      /input\s*,\s*textarea\s*\{[^}]*user-select\s*:\s*text/.test(s));
  }
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1500);

  // the shell: the tab bar he taps to change surface
  const tab = await page.evaluate(READ, '.tab');
  ok('the shell exposes a tab to check', !!tab);
  if (tab) ok('SHELL MEASURED: a tab is not selectable text (user-select: ' + tab.select + ') — ' +
    'selectable chrome is what raises the magnifier on a long press', tab.select === 'none');
  // text fields must KEEP copy/paste — the guard is aimed at controls, not typing
  const ta = await page.evaluate(() => {
    const el = document.querySelector('textarea, input');
    if (!el) return 'none-present';
    const s = getComputedStyle(el);
    return s.webkitUserSelect || s.userSelect;
  });
  ok('SHELL: text fields still allow selection and paste (user-select: ' + ta + ') — ' +
    'copy/paste is correct in a text field and wrong on a d-pad', ta === 'text' || ta === 'auto' || ta === 'none-present');

  // the walk d-pad, which is the actual thing that was broken
  /* THE CITY TAB IS GONE (Paolo 8/2): "there's no point in having a city tab
     anymore". Both buttons opened the same panel since 7/28, so the world is
     reached through RUN now. Navigating by a button the user does not have is
     a gate testing a surface nobody can reach. */
  await page.click('.tab[data-p="run"]');
  await page.waitForTimeout(14000);
  const f = page.frames().find(fr => fr.name() === 'cityFrame');
  ok('the CITY frame is reachable', !!f);
  if (f) {
    const pb = await f.evaluate(READ, '.pb');
    const mode = await f.evaluate(READ, '#mode');
    ok('the walk d-pad exists', !!pb);
    if (pb) ok('D-PAD MEASURED: the arrow you HOLD to walk is not selectable text (user-select: ' + pb.select +
      ') — this is the control he could not use', pb.select === 'none');
    if (mode) ok('DROP IN button MEASURED: not selectable text (user-select: ' + mode.select + ')',
      mode.select === 'none');
  }
  /* THE RUN'S OWN DIRECTION BUTTONS, MEASURED IN THE REAL ALPHA. Source checks
     stop the regression; this is the control he actually had in his thumb. */
  await page.click('.tab[data-p="run"]');
  /* THE RUN TAB OPENS THE CITY NOW (Paolo 7/28: "Kill"). The run slice is dead as a
     TAB, but it is still wired into the shell and what this gate measures is still
     alive in it - so the harness shows that panel directly instead of tapping a tab
     that no longer leads there. Stated rather than hidden: the only synthetic step
     is opening a surface the UI no longer exposes; everything measured below is
     measured on a real rendered panel. If the shell ever stops wiring runFrame,
     delete this section outright rather than prop it up. */
  await page.evaluate(() => {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
    const r = document.getElementById('p-run'); if (r) r.classList.add('on');
  }).catch(() => {});
  const rh = await page.waitForSelector('#runFrame', { timeout: 60000 }).catch(() => null);
  const rf = rh ? await rh.contentFrame() : null;
  ok('the RUN frame is reachable', !!rf);
  if (rf) {
    await rf.waitForFunction(() => window.__RUN_READY === true, null, { timeout: 180000 }).catch(() => {});
    const pb = await rf.evaluate(READ, '.pb');
    const act = await rf.evaluate(READ, '#act');
    ok('the run\'s direction buttons exist', !!pb);
    if (pb) ok('RUN D-PAD MEASURED: the direction button he presses is not selectable text ' +
      '(user-select: ' + pb.select + ') — this is the exact control that was "trying to copy and paste"',
      pb.select === 'none');
    if (act) ok('RUN ACTION BUTTON MEASURED: not selectable text (user-select: ' + act.select + ')',
      act.select === 'none');
    /* a d-pad must not double-tap-zoom or steal a scroll either */
    const ta2 = await rf.evaluate(() => {
      const el = document.querySelector('.pb'); if (!el) return null;
      return getComputedStyle(el).touchAction;
    });
    if (ta2) ok('RUN D-PAD MEASURED: touch-action is a gesture surface, not a document (' + ta2 + ')',
      ta2 === 'manipulation' || ta2 === 'none');
  }

  console.log('TOUCH GUARD GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
