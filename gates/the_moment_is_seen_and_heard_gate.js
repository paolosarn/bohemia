/* ==========================================================================
   THE MOMENT IS SEEN AND HEARD  (JOBS 2, 11/26/26, VAMILY rule 482, rules 480, 441, the 120 BPM law)

   The coordinator (rule 482): 'the arrival at a job looks and sounds better'. MEASURED: the moment he reaches a job's thing
   ('FOUND IT', 'GOT SIX CELLS', 'POST 1 WALKED') was its plate alone, drawn in one frame and gone 3.5 s later, with no sound; the
   map draws only when something moves, so nothing about it moved. NOW (slices/bohemia_job_kinds.js __THE_MOMENT_IS_SEEN_AND_HEARD__):
   the plate comes in like a tape that catches (on, a 70 ms dropout, on), two green rings go out from his feet a beat apart, it drops
   out once more before it goes, and the board's own tack (SOUNDS' 'THE BOARD: A TACK GOES IN') is heard once on the effects bus.

     M1  the file: the moment is drawn in steps on a timer (never a frame loop), a ring at 0 and at 500 ms (a beat at 120 BPM), at
         most ten more draws of the map in its 3.5 s; the tack goes through the game's own effects bus (__sfxOut), and its
         recording is in the published folder
     M1p PLANTED: the old moment (one frame, no steps, no sound) fails M1
     M2  the demo and the alpha, a phone upright and sideways, a new crew on the map: the moment said, sampled through its life:
         the plate drawn, the dropout seen, both rings drawn, the tack heard (the map's draws in that time reported: on a map
         already drawing every frame the moment's eight timed draws are lost among them)
     M3  nothing threw
   node gates/the_moment_is_seen_and_heard_gate.js        MOMENT_FILES=1 the file only
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 500) + ']' : '')); };
const done = () => { console.log('\nTHE MOMENT IS SEEN AND HEARD: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const SRC = fs.readFileSync(path.join(ROOT, 'slices/bohemia_job_kinds.js'), 'utf8');

function readFile(src) {
  const bad = [], a = src.indexOf('function flash('), b = src.indexOf('function settleWait(');
  if (a < 0 || b < a) return ['no flash()'];
  const body = src.slice(a, b), steps = (body.match(/FLASH_STEPS = \[([^\]]*)\]/) || src.match(/FLASH_STEPS = \[([^\]]*)\]/) || [])[1];
  const ms = steps ? steps.split(',').map(Number) : [];
  if (!ms.length) bad.push('no steps');
  if (ms.length > 10) bad.push(ms.length + ' draws');
  if (/requestAnimationFrame/.test(body)) bad.push('a frame loop');
  let seq = []; try { seq = JSON.parse((src.match(/FLASH_SEQ = (\[\[[^;]*\]\]);/) || [])[1] || '[]'); } catch (e) { seq = []; }
  const ringAt = k => (seq.find(x => x[2] === k && x[3] === 0) || [])[0];
  if (!(ringAt(0) === 0 && ringAt(1) === 500)) bad.push('no ring a beat apart');   /* the first ring at once, the second a beat (500 ms at 120 BPM) later */
  if (!seq.some(x => x[1] === 0)) bad.push('no dropout step');
  if (!/__JOB_FLASH_DROP/.test(body)) bad.push('no dropout');
  if (!/tackHeard\(\)/.test(body.slice(0, body.indexOf('function flashDraw')))) bad.push('flash() makes no sound');
  if (!/__sfxOut/.test(body) || !/gn\.connect\(o\.bus\)/.test(body)) bad.push('the sound is not on the effects bus');
  const url = (body.match(/url: '([^']+)'/) || [])[1];
  if (!url || !fs.existsSync(path.join(ROOT, 'slices', url))) bad.push('the recording is missing: ' + url);
  return bad;
}
{ const bad = readFile(SRC);
  ok('M1 the moment is drawn in steps on a timer (never a frame loop), a ring at 0 and 500 ms, at most ten more draws, the tack on the effects bus, the recording published', !bad.length, bad.join(' | ') || 'steps, rings, dropout, the tack');
  const a = SRC.indexOf('function flash('), b = SRC.indexOf('function settleWait(');
  const old = SRC.slice(0, a) + "function flash(t) { FLASH = { t: String(t).toUpperCase(), until: Date.now() + 3500 }; root.__JOB_FLASH = FLASH.t;\n    try { render(); } catch (e) {} setTimeout(function () { try { render(); } catch (e) {} }, 3600); }\n  function flashDraw() { if (!FLASH) return; plate(FLASH.t, 0, 0, '#9fe08a', 12); }\n  " + SRC.slice(b);
  const pb = readFile(old);
  ok('M1p planted: the old moment (one frame, no steps, no sound) fails M1', pb.length >= 3, pb.join(' | '));
}
if (process.env.MOMENT_FILES) done();

(async () => {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js')), rows = [], errs = [];
  for (const alpha of [false, true]) for (const shape of ['phone_portrait', 'phone_landscape']) {
    const tag = (alpha ? 'alpha' : 'demo') + ' ' + (shape === 'phone_portrait' ? 'upright' : 'sideways');
    let d = null;
    try {
      d = await drive.open({ profile: shape, alpha, fog: false, keepCards: true, engage: true,
        arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
      const fr = d.fr, page = d.page; page.on('pageerror', e => errs.push(tag + ': ' + String(e).slice(0, 160)));
      await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.LOOP && LOOP.start, null, { timeout: 300000 });
      await page.waitForTimeout(3000);
      /* a finger on the glass first: a phone plays no sound before one */
      const vp = page.viewportSize(); await page.touchscreen.tap(Math.round(vp.width / 2), Math.round(vp.height / 2)); await page.waitForTimeout(800);
      const r = await fr.evaluate(async () => {
        const out = { drawn: 0, drop: 0, rings: 0, heard: 0, renders: 0, plateAt: [] };
        const R0 = window.render; let n = 0; window.render = function () { n++; return R0.apply(this, arguments); };
        const d0 = window.__JOB_FLASH_DRAWN | 0, p0 = window.__JOB_FLASH_DROP | 0, h0 = window.__JOB_MOMENT_HEARD | 0; window.__JOB_FLASH_RING_AT = [];
        BohemiaJobKinds.flash('found it');
        await new Promise(res => setTimeout(res, 3900));
        window.render = R0;
        out.drawn = (window.__JOB_FLASH_DRAWN | 0) - d0; out.drop = (window.__JOB_FLASH_DROP | 0) - p0; out.rings = [...new Set(window.__JOB_FLASH_RING_AT || [])].length; out.heard = (window.__JOB_MOMENT_HEARD | 0) - h0; out.renders = n;
        out.said = window.__JOB_FLASH || null;
        return out;
      });
      r.tag = tag; rows.push(r);
    } catch (e) { errs.push(tag + ': ' + String(e && e.message || e).slice(0, 200)); }
    if (d) await d.close();
  }
  const bad = rows.filter(r => !(r.said === 'FOUND IT' && r.drawn >= 2 && r.drop >= 1 && r.rings === 2 && r.heard >= 1));
  ok('M2 the demo and the alpha, upright and sideways: the moment said, its plate drawn, its dropout seen, both rings drawn (0 and 500 ms), the tack heard (the map\'s draws in those 3.9 s, its own and the moment\'s, reported)',
    rows.length === 4 && !bad.length, rows.map(r => r.tag + ': drawn ' + r.drawn + ', dropout ' + r.drop + ', rings ' + r.rings + ' of 2, heard ' + r.heard + ', map draws ' + r.renders).join(' | '));
  ok('M3 nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  done();
})();
