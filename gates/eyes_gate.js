/* ============================================================================
   EYES GATE (9/5/26) -- EYES AND EARS lane 17, E3. THE PLAYER'S SCREEN IS
   MEASURED, NOT EYEBALLED.

   WHY THIS EXISTS, AND IT IS AN EMBARRASSING REASON. Round one of this lane
   photographed every tab and its LOUDEST finding was "the demo's SLEEP button and
   the bottom arrow run off the bottom of an iPhone." It was FALSE. Dark chips on a
   dark ground above a black band, read at page scale, called clipped without
   measuring. Measured properly: the demo's game frame is top 0 height 844 and
   SLEEP's box is 788-832, twelve pixels clear of the glass; the workshop's frame is
   top 42 height 802 and the same chip lands at 801-832 in the phone's coordinates.
   A pair of human eyes at 3am is not an instrument. This gate is the instrument.

   WHY NOT A GOLDEN IMAGE, WHICH IS WHAT E3 ASKED FOR. Measured 9/5 in this repo:
   two IDENTICAL runs of the screenshot pass, same build, nothing changed, disagree
   on 12 of 27 screens -- the character bench by 5.95% with whole 64px blocks 100%
   different, because it shuffles a citizen and a fit on every load. A pixel diff
   wired to a red light would cry wolf on nearly half the game every single run, and
   a checker that cries wolf gets muted, which is how teams lose visual testing
   entirely. So the RED light in the suite is only for questions with no baseline
   and no noise floor at all:

     1. THE GAME IS THERE          the front door opens onto a live canvas
     2. OFF THE GLASS              nothing sits below or right of the phone's edge
                                   in the PHONE's coordinates (the game is in an
                                   iframe; the frame's own bottom is not the glass)
     3. CUT TEXT                   no line is wider than the box it is printed in
     4. NOTHING THREW              no uncaught error on either surface
     5. AND THE CHECKER STILL BITES a deliberately broken copy is probed every run,
                                   and a green that does not catch it is not a green

   The picture diff stays in the lane's own tool, where a number is a routing signal
   for the next round rather than a light that stops the fleet.

   node gates/eyes_gate.js
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const { ASK, probeSurface, PHONE } = require(path.join(ROOT, 'tools/bohemia_eyes_probe.js'));

let pass = 0, fail = 0;
function ok(claim, cond, detail) {
  if (cond) { pass++; console.log('  ok  ' + claim); }
  else { fail++; console.log('  FAIL ' + claim + (detail ? '\n       ' + detail : '')); }
}

function pw() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
    '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (e) { }
  }
  return require('playwright');
}

/* THE SAME WALK AS THE DEMO BUILD GATE: file://, the splash TAPPED like a finger
   taps it, then the game gets its nine seconds to build inside that click. */
async function walk(chromium, file) {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const ctx = await b.newContext(PHONE);
  const p = await ctx.newPage();
  const thrown = [];
  p.on('pageerror', e => thrown.push(String(e).slice(0, 160)));
  await p.goto('file://' + path.join(ROOT, 'slices', file), { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  try { await p.locator('#front').click({ timeout: 20000 }); } catch (e) { thrown.push('the splash did not take a tap'); }
  await p.waitForTimeout(9000);
  const canvas = await p.evaluate(() => {
    let best = { w: 0, h: 0 };
    for (const f of document.querySelectorAll('iframe')) {
      try {
        const d = f.contentDocument; if (!d) continue;
        for (const cv of d.querySelectorAll('canvas')) {
          const r = cv.getBoundingClientRect();
          if (r.width * r.height > best.w * best.h) best = { w: Math.round(r.width), h: Math.round(r.height) };
        }
      } catch (_e) { }
    }
    return best;
  });
  const found = [];
  await probeSurface(p, file, found);
  await b.close();
  return { thrown, canvas, screen: found[0] || { offGlass: [], cutText: [] } };
}

function say(list, kind) {
  return list.slice(0, 6).map(x => '  ' + (kind === 'off'
    ? ((x.belowBy ? 'below the glass by ' + x.belowBy + 'px' : 'off the right by ' + x.rightBy + 'px') + ': ' + x.el)
    : ('cut by ' + x.by + 'px: ' + x.el))).join('\n       ');
}

(async () => {
  console.log('\n=== EYES GATE -- the player\'s screen, measured ===\n');
  const { chromium } = pw();

  for (const [name, file] of [['THE DEMO', 'BOHEMIA_DEMO.html'], ['THE WORKSHOP', 'BOHEMIA_ALPHA_0_9.html']]) {
    const r = await walk(chromium, file);
    console.log('  ' + name);
    ok(name + ': the front door opens onto a live canvas (' + r.canvas.w + 'x' + r.canvas.h + ')',
      r.canvas.w > 200 && r.canvas.h > 400,
      'a screen with no canvas is a black rectangle, which is the classic false success');
    ok(name + ': nothing hangs off the glass at 390x844',
      r.screen.offGlass.length === 0, say(r.screen.offGlass, 'off'));
    ok(name + ': no text is wider than the box it is printed in',
      r.screen.cutText.length === 0, say(r.screen.cutText, 'cut'));
    ok(name + ': nothing threw', r.thrown.length === 0, r.thrown.slice(0, 3).join(' | '));
  }

  /* AND THE TEXT HE CANNOT READ, ON A RATCHET. The contrast of a finished picture
     is not a style question -- a scrim drawn OVER the words leaves every style saying
     gold on black while the player sees a grey smudge -- so the picture is measured,
     by the lane's own tool, and the COUNT is held. 38 boxes are under the readable
     floor today (worst: the OUTFIT chip at 1.03:1, where 1.00 means the ink and the
     paper are the same brightness). The 38 are history and this gate exists so a
     39th cannot be added quietly. Population baseline, the pixel-craft precedent. */
  try {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eyes-read-'));
    const probeJson = path.join(dir, 'probe.json');
    execFileSync('node', [path.join(ROOT, 'tools/bohemia_eyes_probe.js'), '--out', probeJson],
      { env: { ...process.env, EYES_SHOT_DIR: dir }, cwd: ROOT, stdio: 'pipe', timeout: 240000 });
    const outp = execFileSync('python3', [path.join(ROOT, 'tools/bohemia_eyes_readable.py'), probeJson, dir],
      { cwd: ROOT, encoding: 'utf8', timeout: 120000 });
    const m = outp.match(/CANNOT READ:\s*(\d+)/);
    const now = m ? parseInt(m[1], 10) : -1;
    const base = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/BOHEMIA_EYES_READABLE_BASELINE_9_5_26.json'), 'utf8'));
    ok('the count of text nobody can read has not gone up (' + now + ' against a frozen ' + base.baseline_under_floor + ')',
      now >= 0 && now <= base.baseline_under_floor,
      now < 0 ? 'the readability tool printed no count'
              : 'a new unreadable label was added. Lower the baseline when a lane fixes some, never raise it');
    if (now >= 0 && now < base.baseline_under_floor)
      console.log('       (it went DOWN to ' + now + '. Lower the frozen number in the same commit as the fix.)');
  } catch (e) {
    ok('the readability ratchet ran', false, String(e).split('\n')[0].slice(0, 160));
  }

  /* AND THE CHECKER STILL BITES. Round one taught this lane the same lesson twice
     in one afternoon: a probe that asked only the main document reported a clean
     demo while the game sat in an iframe, and a note that "every letter is a
     fallback font" was global and wrong. A green from a blind instrument is worse
     than a red. So every run, a copy of the demo with one control parked 80px
     below the phone is probed, and if that is not caught, this gate fails. */
  const bite = path.join(ROOT, 'slices', '__eyes_bite_' + process.pid + '.html');
  try {
    const src = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_DEMO.html'), 'utf8');
    const inj = '<div id="__bite" style="position:fixed;left:8px;top:880px;width:120px;height:44px;'
      + 'background:#222;color:#eee">BITE TEST</div>';
    const i = src.lastIndexOf('</body>');
    fs.writeFileSync(bite, i > 0 ? src.slice(0, i) + inj + src.slice(i) : src + inj);
    const r = await walk(chromium, path.basename(bite));
    const caught = r.screen.offGlass.some(x => /__bite/.test(x.el));
    ok('and the checker still bites: a control parked 80px below the phone IS caught',
      caught, 'the probe came back clean on a surface that is deliberately broken, so every '
      + 'green above is worthless until this is fixed');
  } finally {
    try { fs.unlinkSync(bite); } catch (_e) { }
  }

  console.log('\nEYES GATE: ' + pass + ' passed, ' + fail + ' failed\n');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
