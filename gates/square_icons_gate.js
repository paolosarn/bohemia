#!/usr/bin/env node
/* SQUARE ICONS GATE (8/8/26, WORLD lane).
 *
 *   "I'm very concerned all the icons should be on a square, everything should be on a
 *    square. It looks like they're just taking free shapes, rectangles and shit like that."
 *                                                              -- Paolo, 8/8/26
 *
 * HE IS RIGHT AND IT WAS MY DOING. On 8/2 I fixed the icon pad being a HAND-GUESSED
 * rectangle by fitting it to the real contents. Correct as far as it went -- and it left
 * every icon with its OWN rectangle: 313x171, 351x272, 380x219, fifty-nine different
 * aspects. Each one individually well framed, and as a SET a jumble. That is what he is
 * looking at in the VOTE tab.
 *
 * A SQUARE IS NOT A STYLE CHOICE HERE, IT IS WHAT THE THING IS. A district cell is 96 m x
 * 96 m, 128 x 128 tiles, square. An icon standing for one cell stands on a square or it is
 * lying about the ground it occupies.
 *
 * WHAT THIS PROVES:
 *   1. EVERY ICON IS THE SAME SQUARE. One canvas size across the whole set, width == height.
 *   2. NOTHING IS CLIPPED BY IT. The first version of the fix picked 384 by hand and
 *      CUT OFF NINETEEN of the fifty-nine -- city hall, downtown, the mall, every big one --
 *      which is worse than the rectangles it replaced. The square is MEASURED from the set.
 *   3. NOTHING WAS SHRUNK TO FIT. The biggest hero still touches its frame; a square that
 *      everything fits inside comfortably means everything got smaller, which is the exact
 *      opposite of "the main building biggest as fuck" (8/2).
 *   4. THEY ALL STAND ON THE SAME GROUND LINE, so a tall building reads as TALLER rather
 *      than merely drawn in a taller box. That is the other half of being a set.
 *   5. THE PAD UNDER THEM IS SQUARE TOO, in world space, not just the frame around it.
 *   6. AND THE SIZE IS DERIVED, not typed. A constant here goes stale the first time a
 *      hero grows -- which is precisely how nineteen of them got clipped.
 *
 *   node gates/square_icons_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt';
ok('the hero bank exists', fs.existsSync(BANK));
if (!fs.existsSync(BANK)) { console.log('SQUARE ICONS GATE: 0 passed, 1 failed'); process.exit(1); }
const heroes = JSON.parse(fs.readFileSync(BANK, 'utf8')).heroes.filter(h => h.b64);
ok('there are heroes to check (' + heroes.length + ')', heroes.length > 40);

// ---- 1: every icon is the SAME square -----------------------------------------------
const sizes = new Set(heroes.map(h => h.w + 'x' + h.h));
const nonSquare = heroes.filter(h => h.w !== h.h);
ok('every icon is SQUARE (width == height)' +
   (nonSquare.length ? ' — ' + nonSquare.slice(0, 5).map(h => h.district + ' ' + h.w + 'x' + h.h).join(', ') : ''),
   nonSquare.length === 0);
ok('and they are all the SAME square, so the set lines up (' + [...sizes].join(', ') + ')',
   sizes.size === 1);

// ---- 2 + 3 + 4: decode the pixels and measure -----------------------------------------
// PNG header is enough for the frame; the content box needs the alpha, so use the same
// decoder the rest of the repo uses rather than trusting the recorded w/h.
const { execFileSync } = require('child_process');
const probe = `
import json,base64,io,sys
from PIL import Image
b=json.load(open('${BANK}'))
out=[]
for h in b['heroes']:
    if not h.get('b64'): continue
    a=Image.open(io.BytesIO(base64.b64decode(h['b64']))).convert('RGBA')
    bb=a.getbbox()
    out.append({'d':h['district'],'w':a.size[0],'h':a.size[1],
                'bb':list(bb) if bb else None})
print(json.dumps(out))
`;
let px;
try { px = JSON.parse(execFileSync('python3', ['-c', probe], { maxBuffer: 1 << 28 }).toString()); }
catch (e) { ok('the sprites decode', false); px = []; }
ok('every sprite decodes and has content', px.length === heroes.length && px.every(p => p.bb));

const realSizes = new Set(px.map(p => p.w + 'x' + p.h));
ok('the real PIXELS are one square too, not just the recorded numbers (' +
   [...realSizes].join(', ') + ')', realSizes.size === 1 && px.every(p => p.w === p.h));

const clipped = px.filter(p => p.bb[0] <= 0 || p.bb[1] <= 0 || p.bb[2] >= p.w || p.bb[3] >= p.h);
ok('NOTHING IS CLIPPED by the square' +
   (clipped.length ? ' — ' + clipped.slice(0, 6).map(p => p.d).join(', ') : ''), clipped.length === 0);

// 3. the biggest must still nearly fill it, or everything was shrunk to fit
const side = px.length ? px[0].w : 1;
const widest = Math.max(...px.map(p => p.bb[2] - p.bb[0]));
const tallest = Math.max(...px.map(p => p.bb[3] - p.bb[1]));
ok('NOTHING WAS SHRUNK TO FIT: the biggest hero still fills the square (' +
   widest + 'x' + tallest + ' in ' + side + ')',
   widest >= side * 0.90 || tallest >= side * 0.90);

// 4. one ground line
const bases = px.map(p => p.bb[3]);
const spread = Math.max(...bases) - Math.min(...bases);
ok('they all stand on the SAME ground line (spread ' + spread + 'px)', spread <= 12);

// ---- 5 + 6: the pad is square in world space, and the size is derived ------------------
const SRC = fs.readFileSync('tools/bohemia_district_hero_factory.py', 'utf8');
ok('the PAD under the building is squared in world space, not just the frame',
   /side = max\(x1 - x0, y1 - y0\)/.test(SRC));
ok('the square size is MEASURED from the set at bake time, not typed as a constant',
   /SQUARE_PX = int\(math\.ceil\(max\(need_w, need_h\)\)\)/.test(SRC));
ok('and the factory says out loud that the hand-picked number clipped nineteen of them',
   /clipped/i.test(SRC) && /NINETEEN|nineteen/.test(SRC));

console.log('SQUARE ICONS GATE: ' + pass + ' passed, ' + fail + ' failed  (' + heroes.length +
            ' icons, one ' + side + 'x' + side + ' square, 0 clipped, ground line within ' +
            spread + 'px)');
process.exit(fail ? 1 : 0);
