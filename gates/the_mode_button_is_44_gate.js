#!/usr/bin/env node
/* THE MODE BUTTON IS 44 (UI [eyes: mode button], EYES E23 round two: the button named 'mode' measured 40 x 40 on both screens it
   reached from the street, four points under the 44-point floor). slices/bohemia_ui_materials.js MODE_44_CSS. Legs, on the demo:
   M1  the pad at its half size (90): the round button is at least 44 x 44 and still centred in the pad;
   M2  the pad at its full size (180): the button keeps its share (80), the floor never shrinks it;
   M3  on the demo's map the pad itself is off (rule 38b, no pad outside the fight), said, not hidden from the reader.
   Run: node gates/the_mode_button_is_44_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await open({ profile: 'phone_portrait' });
  await d.page.waitForTimeout(2000);
  const off = await d.fr.evaluate(() => getComputedStyle(document.getElementById('nav')).display);
  const at = (px) => d.fr.evaluate((px) => { const n = document.getElementById('nav'), m = document.getElementById('mode'); n.style.setProperty('display', 'block', 'important'); n.style.setProperty('width', px + 'px', 'important'); n.style.setProperty('height', px + 'px', 'important');
    const a = n.getBoundingClientRect(), b = m.getBoundingClientRect(); return { nav: Math.round(a.width), w: Math.round(b.width), h: Math.round(b.height), dx: Math.round((b.x + b.width / 2) - (a.x + a.width / 2)), dy: Math.round((b.y + b.height / 2) - (a.y + a.height / 2)) }; }, px);
  const h = await at(90), f = await at(180);
  leg(h.w >= 44 && h.h >= 44 && Math.abs(h.dx) <= 1 && Math.abs(h.dy) <= 1, 'M1  THE PAD AT HALF SIZE: THE ROUND BUTTON IS 44 OR MORE, STILL CENTRED', JSON.stringify(h));
  leg(f.w === 80 && f.h === 80, 'M2  THE PAD AT FULL SIZE: THE BUTTON KEEPS ITS SHARE (80)', JSON.stringify(f));
  leg(off === 'none', 'M3  ON THE DEMO\'S MAP THE PAD IS OFF (RULE 38b), SAID', 'nav ' + off);
  await d.close();
  console.log('=== THE MODE BUTTON IS 44 GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate threw: ' + (e && e.stack || e)); process.exit(1); });
