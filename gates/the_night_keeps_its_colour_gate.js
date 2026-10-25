#!/usr/bin/env node
/* THE NIGHT KEEPS ITS COLOUR (COOK [eyes: the night board], 10/25/26). Rule 179 (done means he can see it) and rule 167(a)
   (Paolo 10/25: 'the combat map like went completely like almost like black and white... I was like how it was previously');
   EYES 10/25 on BUILD 10/25o (records/eyes_every_ask_10_25/q39, q43): 'both night fights read almost black and white, grey-blue
   with pools of light blown out to white'. The row's DONE WHEN: a night board keeps the day's hues, darker and cooler, no blown
   white, side by side with the same board by day.
   The fight page (slices/BOHEMIA_FIGHT.html) on his phone, the strip and the suburb dealt by day and by night on the same seed
   (tools/bohemia_cook_the_night_board_10_25_26.js measures; this reads its numbers), the same texels compared:
     1. THE HUE HOLDS: the night turns a coloured texel's hue a median of at most 25 degrees (it turned 161: a tan went blue-grey).
     2. THE COLOUR STAYS: the night keeps at least 0.6 of a texel's colour (CIELAB chroma, median; it kept 0.45).
     3. NOTHING BLOWN WHITE: under 0.2% of the board's texels white (every channel over 245; it was 3 to 6%).
     4. NOT GREY: at most a tenth more of the board goes grey (chroma under 3) at night than by day (it was 0.31 against 0.39
        by day on the strip only because the strip's asphalt is grey by day; on the suburb 0.19 against 0.11).
     5. AND STILL NIGHT: the dark ground is darker than the day's on the suburb (its tiles all dark by day and by night), and a
        lit tile still stands over the dark ground (the fight gate's own three-to-one leg holds the number, rule 73).
   Run on main's fight before the fix (10/25): 1 FAIL (strip 161.3, suburb 161.7), 2 FAIL (0.454, 0.452), 3 FAIL (5.6%, 3.1%); 4, 5, 6 ok.
   After: 3.4 and 2.8 degrees, 0.75 and 0.79 kept, nothing white; the strip's lit tile 3.41 to 1.
   Run: node gates/the_night_keeps_its_colour_gate.js */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const out = fs.mkdtempSync(path.join(os.tmpdir(), 'night_colour_'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
try {
  execFileSync('node', [path.join(ROOT, 'tools/bohemia_cook_the_night_board_10_25_26.js'), out, 'phone_portrait', 'strip,suburb', '31'], { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'], timeout: 900000 });
} catch (e) { leg(false, 'the night board measure ran', String(e.message || e).slice(0, 200)); }
let R = null; try { R = JSON.parse(fs.readFileSync(path.join(out, 'night_phone_portrait.json'), 'utf8')); } catch (_e) {}
if (R) {
  const K = R.kinds, ks = Object.keys(K), f = (k, v) => ks.map(x => x + ' ' + K[x][k]).join(', ');
  leg(ks.every(k => K[k].hueTurn <= 25), '*** THE HUE HOLDS AT NIGHT *** (a tan street stays a tan street, cooler; it turned 161 degrees to a blue-grey)', f('hueTurn'));
  leg(ks.every(k => K[k].chromaKept >= 0.6), '*** THE COLOUR STAYS *** (the night keeps at least 0.6 of the day\'s colour on the same texels; it kept 0.45)', f('chromaKept'));
  leg(ks.every(k => K[k].blownWhite < 0.002), '*** NOTHING BLOWN WHITE *** (under the lamps a warm cream at most; it was 3 to 6 percent pure white)', f('blownWhite'));
  leg(ks.every(k => K[k].wentGrey <= K[k].dayGrey + 0.1), 'the night is not grey: at most a tenth more of the board goes grey than by day', ks.map(k => k + ' ' + K[k].dayGrey + ' -> ' + K[k].wentGrey).join(', '));
  leg(K.suburb && K.suburb.darkNight < K.suburb.darkDay && K.strip && K.strip.litVsDark >= 3, 'and it is still night: the suburb\'s dark ground darker than by day, a lit tile three to one over the dark on the strip',
    'suburb ' + (K.suburb && K.suburb.darkDay) + ' -> ' + (K.suburb && K.suburb.darkNight) + ', strip lit ' + (K.strip && K.strip.litVsDark) + ' to 1');
  leg(ks.every(k => !K[k].errs.length), 'no page error', ks.map(k => k + ' ' + (K[k].errs[0] || 'none')).join(', '));
}
try { fs.rmSync(out, { recursive: true, force: true }); } catch (_e) {}
console.log('=== THE NIGHT KEEPS ITS COLOUR: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
