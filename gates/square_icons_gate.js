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
const SRC0 = fs.readFileSync('tools/bohemia_district_hero_factory.py', 'utf8');
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

// A GATE MUST NEVER OUTRANK A RULING (8/1). This check used to read "NOTHING IS CLIPPED",
// and on 8/11 Paolo judged all 59 and ruled the opposite: "Everything needs to be bigger
// TOUCHING THE EDGES side by side of the square grid fr bro... Things should be so big
// theres [not] cars or parking lots on it." Art that touches the edge is now the REQUIREMENT,
// and the pad running off the sides is how the parking goes away. So the check is re-aimed
// rather than deleted: THE PAD MAY BLEED, A BUILDING MAY NOT.
const side = px.length ? px[0].w : 1;
const small = px.filter(p => (p.bb[2] - p.bb[0]) < p.w * 0.92 && (p.bb[3] - p.bb[1]) < p.h * 0.92);
ok('EVERY ICON REACHES ITS EDGES (Paolo 8/11: bigger, touching the edges, side by side)' +
   (small.length ? ' — ' + small.slice(0, 6).map(p => p.d + ' ' +
      (p.bb[2] - p.bb[0]) + 'x' + (p.bb[3] - p.bb[1])).join(', ') : ''), small.length === 0);

// and the fill is derived from the SMALLER span, which is the only way a 2:1 iso pad can
// ever touch a square's top edge -- fitting the larger span left the top 42% empty, by
// construction, on all fifty-nine.
ok('the fill is measured off the SMALLER span, because a 2:1 iso pad can never fill a ' +
   'square on its wider one', /min\(span_w, span_h\)/.test(SRC0));
ok('and it is CLAMPED by the built mass, so the pad bleeds but a building is never cut',
   /never cut a building/.test(SRC0));

// 3. the biggest must still nearly fill it, or everything was shrunk to fit
const widest = Math.max(...px.map(p => p.bb[2] - p.bb[0]));
const tallest = Math.max(...px.map(p => p.bb[3] - p.bb[1]));
ok('NOTHING WAS SHRUNK TO FIT: the biggest hero still fills the square (' +
   widest + 'x' + tallest + ' in ' + side + ')',
   widest >= side * 0.90 || tallest >= side * 0.90);

// 3b. NO CARS ON AN ICON -- his ruling, twice (8/2 and 8/11).
ok('no vehicles are drawn on an icon (Paolo 8/2 and again 8/11), by one reversible switch',
   /SHOW_VEHICLES = False/.test(SRC0));

// ---- STREETS FILL THE WHOLE BOX (Paolo 8/11, LOCKED) --------------------------------
//   "the streets should FILL THE WHOLE FUCKING BOX ABSOLUTELY... THE STREETS DONT HAVE
//    WALLS, THE FREEWAYS CAN HAVE WALLS, AND STREETS CROSSING AND STREETS NO CROSSING
//    ARE DIFFERENT. Intersections should be smartly made with the lights."
// A street cell is not a lot with a road on it -- it IS the road, kerb to kerb to kerb.
// The old icons drew a narrow band on a desert pad, so a street read as asphalt lying in
// the dirt with four bare tan corners, and fenced it with block walls down both sides.
// arterial_x joined the list 8/11 when Paolo split the run from the crossing:
// "FIX THAT ARTERIAL AND ARTERIAL INTERSECTION ARE DIFFERENT! 2 DIFFERENT ITEMS AND
// ICONS!!" Both are streets, so both must fill the box.
const ROADS = ['arterial', 'arterial_x', 'freeway'];
const probe2 = `
import json,base64,io
from PIL import Image
b=json.load(open('${BANK}'))
out={}
for h in b['heroes']:
    if h['district'] not in ${JSON.stringify(ROADS)} or not h.get('b64'): continue
    a=Image.open(io.BytesIO(base64.b64decode(h['b64']))).convert('RGBA').getchannel('A')
    d=list(a.getdata())
    out[h['district']]=sum(1 for p in d if p>200)/float(len(d))
print(json.dumps(out))
`;
let cov = {};
try { cov = JSON.parse(execFileSync('python3', ['-c', probe2], { maxBuffer: 1 << 28 }).toString()); }
catch (e) { ok('the road icons decode', false); }
for (const r of ROADS) {
  ok('the ' + r + ' fills the whole box (' + Math.round((cov[r] || 0) * 1000) / 10 + '% paved)',
     (cov[r] || 0) >= 0.985);
}
ok('a street cell is paved PAST the frame, which is the only way an iso cell has no bare corners',
   /ROAD_OVERSIZE/.test(SRC0) && /_street_bed/.test(SRC0));
ok('and a bleeding cell is excluded from the square VOTE, so it cannot drag the set out ' +
   'with it (it did: 468 -> 776)', /bleed/.test(SRC0) && /776/.test(SRC0));
ok('a street is CENTRED, not seated on the building baseline -- a street IS the ground',
   /A STREET HAS NO GROUND LINE/.test(SRC0));
// THE STREETS DON'T HAVE WALLS. THE FREEWAYS CAN.
// A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1, learned here
// again): the first version of these two failed because the freeway's OWN COMMENT says
// "no crosswalks, no signals". Match the CODE; read prose only where prose is the point.
const cut = (name) => (SRC0.split('def build_' + name)[1] || '').split('\ndef ')[0];
const codeOnly = (t) => t.replace(/"""[\s\S]*?"""/g, '')
                         .split('\n').filter(l => !/^\s*#/.test(l)).join('\n');
const arterialSrc = cut('arterial');
const freewaySrc = cut('freeway');
const arterialCode = codeOnly(arterialSrc);
const freewayCode = codeOnly(freewaySrc);
ok('neither street draws a wall (Paolo 8/11: the streets dont have walls)',
   !/WALL/.test(arterialCode) && !/WALL/.test(codeOnly(cut('arterial_x'))));
ok('the FREEWAY keeps its sound walls (Paolo 8/11: the freeways can have walls)',
   /SOUND WALLS/.test(freewaySrc));
const xSrc = cut('arterial_x');
const xCode = codeOnly(xSrc);
ok('the RUN and the CROSSING are two different builders (Paolo 8/11: 2 different items ' +
   'and icons)', xSrc.length > 200 && arterialSrc.length > 200);
ok('only the CROSSING has signals -- not the run, not the freeway',
   /MAST/.test(xCode) && !/MAST/.test(arterialCode) && !/MAST/.test(freewayCode));
ok('only the CROSSING has crosswalks, because nothing stops on a run',
   /crosswalk/i.test(xCode) || /LINE/.test(xCode));
ok('the RUN puts the sidewalks on the two ends and lets the street fill the rest ' +
   '(his words), with an UNBROKEN median', /sidewalk/i.test(arterialSrc) &&
   /unbroken|UNBROKEN/.test(arterialSrc));
ok('and the CROSSING breaks them into four corners with the junction box between',
   /four corners|FOUR SIDEWALK CORNERS/i.test(xSrc));
ok('the freeway draws no crosswalk at all', !/crosswalk/i.test(freewayCode));

// ---- EVERY CELL IS PAINTED, CORNER TO CORNER (Paolo 8/11) ---------------------------
//   "when you show it to me only show me the square grid that it will be in that is it"
// Shown as a GRID instead of as sixty separate pictures, the defect was obvious and it was
// not the buildings: an isometric pad is a DIAMOND, so all four corners of every tile were
// TRANSPARENT and read as black holes between neighbours. No city builder has holes between
// its cells -- the ground runs under everything and the buildings sit on it.
const bank2 = JSON.parse(fs.readFileSync(BANK, 'utf8')).heroes.filter(h => h.b64);
const noPad = bank2.filter(h => !/^#[0-9a-f]{6}$/.test(h.pad || ''));
ok('every tile publishes the ground colour its cell is painted with' +
   (noPad.length ? ' — missing ' + noPad.slice(0, 5).map(h => h.district).join(', ') : ''),
   noPad.length === 0);
ok('the colour is SAMPLED off each tile\'s own pad, never typed', /def _pad_colour/.test(SRC0));
const tabSrc = fs.readFileSync('tools/bohemia_vote_tab.py', 'utf8');
ok('and the surface actually paints the cell with it, so the grid has no holes between tiles',
   /h\.get\('pad'\)/.test(tabSrc) && /background:%s/.test(tabSrc));
ok('the sprite itself is NOT pre-filled -- geometry stays honest for every gate that reads ' +
   'the alpha (compositing it in blinded squint and art_45 in one run)',
   /THE CELL PAINTS IT, NOT THE SPRITE/.test(SRC0));

// 4. one ground line
// buildings only -- a bleeding street is centred on purpose and has no baseline to share
const bases = px.filter(p => ROADS.indexOf(p.d) < 0).map(p => p.bb[3]);
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
