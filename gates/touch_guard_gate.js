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
  for (const key of ['CITY_B64', 'COMBAT_B64', 'RIG_B64']) {
    const k = "const " + key + "='";
    if (src.indexOf(k) < 0) continue;
    const a0 = src.indexOf(k) + k.length, a1 = src.indexOf("'", a0);
    const d = Buffer.from(src.slice(a0, a1), 'base64').toString('utf8');
    ok(key.replace('_B64', '') + ' FRAME SOURCE: its universal reset declares -webkit-touch-callout:none', universal(d));
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
  await page.click('.tab[data-p="city"]').catch(() => {});
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
  console.log('TOUCH GUARD GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
