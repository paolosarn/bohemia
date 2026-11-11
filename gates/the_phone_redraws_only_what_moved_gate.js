#!/usr/bin/env node
/* THE PHONE REDRAWS ONLY WHAT MOVED (PLUMBER 8, 11/11/26; ask row 560 and MOTION 3's hand-off, rule 441: no freeze over half a second).
   MEASURED (the demo, phone upright, CPU 4x, gates/the_camp_lets_go_when_he_leaves_gate.js, main 11/11 against this tree, one run each):
   the way out of camp drew the whole map twice in its first second: the leave's own render() inside loopClose, then the map's listener
   on the phone's 'bohemia-phone' event, which drew it again though nothing on the map had moved (200 to 400 ms each at 4x). Before ->
   after, the worst gap between frames in the 6 s after the leave: his tap 933 -> 667 ms, the census's way 1,783 -> 1,033 ms; the frames
   drawn in those 6 s 41 -> 171 and 7 -> 74; the camp gate's L3 red on main, green after.
   __THE_PHONE_REDRAWS_ONLY_WHAT_MOVED__ (slices/BOHEMIA_CITY_WORLD.html): on the phone's event the map is drawn again only when its
   frame moved (the focus round the phone, the glass's size) or the phone's own box did (the land's names step aside from it).
     K1 the phone's event five times, nothing moved: the map is not drawn again (kept five times)
     K2 the phone's margin moved (its padding shifted 120 px): the map is drawn again
     K3 the phone's box changed (taller by 80 px, the margin the same): the map is drawn again
     P1 PLANTED: the old way (window.__MF_EVENT_EACH) draws it on every one of the five events
   node gates/the_phone_redraws_only_what_moved_gate.js   (about 1 min) */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined && x !== '' ? '  [' + x + ']' : '')); };

(async () => {
  console.log('\nTHE PHONE REDRAWS ONLY WHAT MOVED (ask row 560)\n');
  let d;
  try {
    d = await drive.open({ profile: 'phone_portrait', door: 180000 });
    await d.page.waitForTimeout(2500);
    const R = await d.fr.evaluate(async () => {
      const wait = (ms) => new Promise(r => setTimeout(r, ms));
      const inner = window.render; let n = 0;
      window.render = function () { n++; return inner.apply(this, arguments); };
      const fire = async (k) => { const n0 = n; for (let i = 0; i < k; i++) { window.dispatchEvent(new CustomEvent('bohemia-phone')); await wait(30); } await wait(80); return n - n0; };
      const out = { mode: typeof MODE !== 'undefined' ? MODE : null };
      try {
        await fire(1);   /* the first event learns the phone's box */
        const k0 = MAP_FOCUS.phoneKept | 0;
        out.k1 = { drawn: await fire(5), kept: (MAP_FOCUS.phoneKept | 0) - k0 };
        /* K2: the phone's margin moves (BohemiaPhone.padding, the map's own source for it, shifted 120 px on its left) */
        const BP = window.BohemiaPhone, padOld = BP && BP.padding;
        if (BP && typeof padOld === 'function') {
          BP.padding = function () { const p = Object.assign({ top: 0, right: 0, bottom: 0, left: 0 }, padOld.apply(BP, arguments) || {}); p.left = (+p.left || 0) + 120; return p; };
          out.k2 = { drawn: await fire(1) };
          BP.padding = padOld; await fire(1);
        } else out.k2 = { err: 'no BohemiaPhone.padding in the map frame' };
        /* K3: the phone's box taller, the margin left as it was */
        const rectOld = window.BOH_PHONE_RECT;
        if (typeof rectOld === 'function') {
          window.BOH_PHONE_RECT = function () { const r = rectOld.apply(this, arguments); if (!r) return { on: true, left: 0, top: 0, width: 100, height: 180 }; const q = {}; for (const k in r) q[k] = r[k]; q.on = true; q.height = (+r.height || 0) + 80; return q; };
          out.k3 = { drawn: await fire(1) };
          window.BOH_PHONE_RECT = rectOld; await fire(1);
        } else out.k3 = { err: 'no BOH_PHONE_RECT in the map frame' };
        window.__MF_EVENT_EACH = true; out.p1 = { drawn: await fire(5) }; window.__MF_EVENT_EACH = false;
      } catch (e) { out.err = String(e && e.message).slice(0, 160); }
      window.render = inner;
      return out;
    });
    if (R.err) ok('the map frame answered', false, R.err);
    ok('K1 the phone\'s event five times, nothing moved: the map is not drawn again (kept five times)', R.mode === 'city' && R.k1 && R.k1.drawn === 0 && R.k1.kept === 5, JSON.stringify({ mode: R.mode, k1: R.k1 }));
    ok('K2 the phone\'s margin moved (its padding shifted 120 px): the map is drawn again', R.k2 && !R.k2.err && R.k2.drawn >= 1, JSON.stringify(R.k2));
    ok('K3 the phone\'s box changed (taller by 80 px, the margin the same): the map is drawn again', R.k3 && !R.k3.err && R.k3.drawn >= 1, JSON.stringify(R.k3));
    ok('P1 PLANTED: the old way (window.__MF_EVENT_EACH) draws it on every one of the five events', R.p1 && R.p1.drawn >= 5, JSON.stringify(R.p1));
  } catch (e) { ok('the walk ran to the end [' + String(e && e.message).slice(0, 200) + ']', false); }
  try { if (d && d.close) await d.close(); } catch (_e) {}
  console.log('\nTHE PHONE REDRAWS ONLY WHAT MOVED: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
