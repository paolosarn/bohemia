#!/usr/bin/env node
/* NO LINE UNDER ANOTHER (FIXES 4 11/27, ask row 777 FOUND BY EYES: 'after a buy at the stall upright, "Bought. You have 22 nights of
   food." shows its top half only, the price line's box drawn over its foot'; rules 482, 441). records/BOHEMIA_FIXES_FOUR_NO_LINE_UNDER_ANOTHER_11_27_26.md.
   MEASURED BEFORE (tools/bohemia_fixes_four_the_stall_strip.js, the demo, Caravans' stall at ten, one food bought by two real taps):
   upright the said line needed 16 px and was given 7 under the 49 px price line; on its side it was given 0 (never seen), the price
   line over it and cut at the box's foot.
   Legs (the demo, a phone upright and on its side):
     S1 upright: after the buy the said line is whole, no line in the strip is squeezed, none starts over another, none runs past its box
     S2 on its side: the same
     S3 the page: SETTLEMENT's __NO_LINE_UNDER_ANOTHER__ rules are in
   AMENDED the same round: the box keeps its 58 px (a box that grew while the said line showed moved the list under his next tap:
   THE WAGON AND THE SIX C4, two quick taps on SIX ROUNDS bought tape); S1 and S2 hold the box's height before and after the buy.
   --plant: the box the way it was (58 px fixed, lines free to shrink): S1 and S2 must go red.
   node gates/no_line_under_another_gate.js [--plant] */
'use strict';
const path = require('path'), fs = require('fs');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const PLANT = process.argv.includes('--plant');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const PG = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');
leg(/\.stallstrip \.ss-facts>\*\{flex-shrink:0\}/.test(PG) && /\.stallstrip \.ss-facts\{height:58px;gap:2px\}/.test(PG) && /\.stallstrip \.ss-facts:has\(>\.ss-said\)>\.st-what\{display:none\}/.test(PG) && /__NO_LINE_UNDER_ANOTHER__/.test(PG),
  'S3 the page: no line in the stall\'s strip shrinks; the box keeps its 58 px; a said line stands alone in it', true);
function probe(shape) {
  let out = '';
  try { out = execFileSync('node', [path.join(ROOT, 'tools/bohemia_fixes_four_the_stall_strip.js'), shape].concat(PLANT ? ['--plant'] : []), { encoding: 'utf8', timeout: 560000, maxBuffer: 32 << 20 }); } catch (e) { out = String(e.stdout || '') + String(e.message || ''); }
  const line = out.split('\n').find(l => /^\{/.test(l)); try { return JSON.parse(line); } catch (e) { return { error: 'no JSON: ' + out.slice(-200) }; }
}
for (const [n, shape] of [['S1 upright', 'phone_portrait'], ['S2 on its side', 'phone_landscape']]) {
  const r = probe(shape), s = r.strip || {}, said = (s.kids || []).find(k => k.cls === 'ss-said');
  leg(!r.error && r.tapped && /^Bought\./.test(r.strip && r.strip.said || '') && said && said.given >= said.need && !(s.squeezed || []).length && !(s.over || []).length && !(s.cutAtTheFoot || []).length && !(r.errors || []).length && r.boxSelected === (s.box || [])[2],
    '*** ' + n + ' ***: after a buy at the stall the said line is whole; no line squeezed, none over another, none past the box; the box the same height before and after the buy (nothing under his finger moves: THE WAGON AND THE SIX C4)',
    r.error || JSON.stringify({ boxSelected: r.boxSelected, box: s.box, kids: (s.kids || []).map(k => k.cls + ' ' + k.given + '/' + k.need), squeezed: s.squeezed, over: s.over, cut: s.cutAtTheFoot }));
}
console.log('NO LINE UNDER ANOTHER' + (PLANT ? ' (PLANTED)' : '') + ': ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
