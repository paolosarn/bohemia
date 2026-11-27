#!/usr/bin/env node
/* LEAVE LIGHTS ON THE GLASS (FIXES 4 11/27, ask row 747 FOUND BY JOBS 2: 'a finger on LEAVE may not reach the end screen'; FIGHT SCREEN
   3's row, FIXES 3's open measurement; rules 480(b), 441). records/BOHEMIA_FIXES_FOUR_LEAVE_LIGHTS_ON_THE_GLASS_11_27_26.md.
   MEASURED BEFORE (tools/bohemia_fixes_four_leave_mid_grow.js, the demo upright, a real tap at LEAVE's drawn middle the first frame it
   lit): LEAVE lit while the end screen's door was still invisible or growing out of the phone's corner, and the tap pressed what was
   under that spot (the phone's fight-row button, or the bare page): 6 of 8 first taps missed, 1x and 4x.
   Legs:
   L1 THE PAGE: the end screen lights LEAVE through lightOnTheGlass (the frame at its full box, its door opaque, nothing under the door
      moving, two frames running, 3 s at most, a timer behind it); LEAVE's own rule is FIXES 3's, unchanged (open is enough);
   L2 THE DEMO, UPRIGHT, 1x, two road fights on AUTO: the first frame LEAVE is lit the screen stands on the glass (its full box, its
      door opaque), and one real tap at LEAVE's drawn middle that frame goes home;
   L3 THE SLOWED PHONE (CPU 4x), one fight: the same.
   --plant: LEAVE lights the moment the screen opens (window.__LEAVE_LIGHTS_AT_ONCE, the way before): L2 must go red (lit off the glass).
   node gates/leave_lights_on_the_glass_gate.js [--fast] [--plant] */
'use strict';
const path = require('path'), fs = require('fs');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const PLANT = process.argv.includes('--plant'), FAST = process.argv.includes('--fast');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('LEAVE LIGHTS ON THE GLASS' + (PLANT ? ' (PLANTED)' : '') + ': ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const SP = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SPOILS_SCREEN.html'), 'utf8');
const l1 = /lightOnTheGlass\(S\.seq\);/.test(SP) && /function onTheGlass\(\)/.test(SP) && /var LIT_MAX_MS = 3000;/.test(SP) && /still >= 2/.test(SP)
  && /setTimeout\(light, LIT_MAX_MS \+ 100\)/.test(SP) && /if\(!S\.seq && !S\.failed\)\{ S\.asked = /.test(SP) && /keptTap\(\); \};/.test(SP)
  && !/classList\.add\('sp-live'\); \}catch\(_e\)\{\}   \/\* __LEAVE_WAITS_FOR_THE_SCREEN__: open, LEAVE lights \*\//.test(SP);
leg(l1, '*** L1 THE PAGE ***: LEAVE lights when the screen stands on the glass (full box, opaque, still two frames, 3 s at most, a timer behind); a faint tap kept for the light', l1);
if (FAST) return done();

function walk(throttle, fights) {
  const args = [path.join(ROOT, 'tools/bohemia_fixes_four_leave_mid_grow.js'), '--throttle', String(throttle), '--fights', String(fights)].concat(PLANT ? ['--before'] : []);
  let out = '';
  try { out = execFileSync('node', args, { encoding: 'utf8', timeout: 560000, maxBuffer: 64 << 20 }); } catch (e) { out = String(e.stdout || '') + String(e.message || ''); }
  const i = out.indexOf('\n[');
  try { return JSON.parse(out.slice(i + 1)); } catch (e) { return [{ error: 'no JSON: ' + out.slice(-200) }]; }
}
const say = r => r.error ? r.error : 'lit at ' + r.firstLitMs + ' ms, on the glass ' + r.onGlassAtLit + ' ' + JSON.stringify(r.atLit && r.atLit.frame) + ', the first tap home ' + r.homeFirst + (r.homeFirst ? '' : ' (pressed ' + r.firstTapPressed + ')');

const A = walk(1, 2);
leg(A.length === 2 && A.every(r => !r.error && r.onGlassAtLit && r.homeFirst === true && !(r.errors || []).length),
  '*** L2 THE DEMO UPRIGHT ***: two road fights on AUTO: the first frame LEAVE is lit the screen stands on the glass, and a real tap at LEAVE that frame goes home',
  A.map(say).join(' | '));
if (PLANT) return done();
const B = walk(4, 1);
leg(B.length === 1 && B.every(r => !r.error && r.onGlassAtLit && r.homeFirst === true && !(r.errors || []).length),
  '*** L3 THE SLOWED PHONE (CPU 4x) ***: the same, one fight', B.map(say).join(' | '));
done();
