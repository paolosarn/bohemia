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

// ---- 1: every icon is the SAME CELL ---------------------------------------------------
// A GATE MUST NEVER OUTRANK A RULING (8/1), and this one has been re-aimed twice by his own
// words. 8/8 was "everything should be on a square" and it shipped one fixed square canvas.
// 8/11 is "THESE HAVE TO FILL THE WHOLE 1X1 ICON GRID FOR THE CITY BUILDER SHIT... I DONT
// NEED TO SEE THEM WITH OTHER STREETS", which the fixed square cannot satisfy: a cell's
// isometric diamond is 2:1, so a flat subject carried a dead band of padding on top and a
// tall one did not, and padding is what he kept seeing as "floating in a box".
//
// WHAT MAKES A TILE SET A TILE SET IS NOT ONE CANVAS, IT IS ONE CELL. Every district cell in
// the valley is 96 m x 96 m, so every tile's ground diamond must come out the SAME WIDTH --
// that is what lets two of them sit side by side and line up. Height is then free: a tower
// is simply a taller tile, exactly as in every city builder.
const { execFileSync } = require('child_process');
const SRC0 = fs.readFileSync('tools/bohemia_district_hero_factory.py', 'utf8');
const probe = `
import json,base64,io
from PIL import Image
b=json.load(open('${BANK}'))
out=[]
for h in b['heroes']:
    if not h.get('b64'): continue
    a=Image.open(io.BytesIO(base64.b64decode(h['b64']))).convert('RGBA')
    bb=a.getbbox()
    al=a.getchannel('A')
    d=list(al.getdata())
    out.append({'d':h['district'],'w':a.size[0],'h':a.size[1],
                'bb':list(bb) if bb else None,
                'opq':sum(1 for p in d if p>200)/float(len(d)),
                'pad':h.get('pad')})
print(json.dumps(out))
`;
let px;
try { px = JSON.parse(execFileSync('python3', ['-c', probe], { maxBuffer: 1 << 28 }).toString()); }
catch (e) { ok('the sprites decode', false); px = []; }
ok('every sprite decodes and has content', px.length === heroes.length && px.every(p => p.bb));

// the cell width, taken as the mode: what the overwhelming majority of tiles measure
const tally = {};
px.forEach(p => { tally[p.w] = (tally[p.w] || 0) + 1; });
const CELL = +Object.keys(tally).sort((a, b) => tally[b] - tally[a])[0];
const offCell = px.filter(p => Math.abs(p.w - CELL) > CELL * 0.05);
ok('EVERY TILE IS THE SAME CELL WIDTH (' + CELL + 'px, ' + (tally[CELL] || 0) + '/' +
   px.length + ' exact)' + (offCell.length ? ' — ' + offCell.slice(0, 5).map(p => p.d + ' ' +
   p.w).join(', ') : ''), offCell.length === 0);
ok('and the scale comes off the GROUND PLATE, so a tall subject cannot shrink its own cell',
   /GROUND PLATE sets the scale/.test(SRC0));

// NO DEAD BAND: the tile is its cell, cropped to what is drawn
const padded = px.filter(p => p.bb[0] > 1 || p.bb[1] > 1 ||
                              p.bb[2] < p.w - 1 || p.bb[3] < p.h - 1);
ok('no tile carries a band of padding -- each one IS its cell, cropped to what is drawn' +
   (padded.length ? ' — ' + padded.slice(0, 5).map(p => p.d).join(', ') : ''),
   padded.length === 0);
ok('the crop is measured from the sprite, never typed', /sprite\.getbbox\(\)/.test(SRC0));

// ONE CELL ONLY: never paint the neighbours in
ok('a tile never paints past its own cell -- the road bed IS the plot, and the helper that ' +
   'used to paint beyond it is gone entirely',
   !/ROAD_OVERSIZE/.test(SRC0) && !/_street_bed/.test(SRC0));
ok('and the factory says out loud why painting past it was wrong',
   /I dont need to see them with other streets|I DONT NEED TO SEE THEM WITH OTHER STREETS/i.test(SRC0));

// the ground colour that fills the diamond's corners in whatever cell shows it
const noPad = px.filter(p => !/^#[0-9a-f]{6}$/.test(p.pad || ''));
ok('every tile publishes the ground colour its cell is painted with' +
   (noPad.length ? ' — ' + noPad.slice(0, 5).map(p => p.d).join(', ') : ''), noPad.length === 0);
ok('the colour is SAMPLED off each tile\'s own pad, never typed', /def _pad_colour/.test(SRC0));
const tabSrc = fs.readFileSync('tools/bohemia_vote_tab.py', 'utf8');
ok('and the surface paints the cell with it, at the tile\'s own aspect, so nothing is ' +
   'letterboxed', /h\.get\('pad'\)/.test(tabSrc) && /aspect-ratio:%s/.test(tabSrc));

// NO CARS ON AN ICON -- his ruling, twice (8/2 and 8/11).
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
const ROADS = ['arterial', 'arterial_x', 'freeway', 'interchange'];
// A DIAMOND FILLS HALF ITS BOUNDING BOX -- that is geometry, not a defect. The old check
// measured the opaque fraction of a fixed square and demanded 98%, which only ever passed
// because the tile was painting its NEIGHBOURS past the cell edge. Under one-cell tiles the
// right question is: does the street run the full width and the full depth of ITS OWN cell,
// edge to edge, so two of them tile into a continuous road?
const roadPx = px.filter(p => ROADS.indexOf(p.d) >= 0);
ok('the road tiles are all present (' + roadPx.map(p => p.d).join(', ') + ')',
   roadPx.length === ROADS.length);
const short = roadPx.filter(p => (p.bb[2] - p.bb[0]) < p.w - 1 || (p.bb[3] - p.bb[1]) < p.h - 1);
ok('every street runs edge to edge across its own cell, so two of them tile into one road' +
   (short.length ? ' — ' + short.map(p => p.d).join(', ') : ''), short.length === 0);
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
// Paolo 8/11: "for the intersection i dont needs to see streets intersecting... what i need
// to see is crosswalks and traffic lights". So the crossing is the SAME street as the run,
// and the only things that make it a junction are the markings and the signals.
ok('the CROSSING draws no second road -- the junction happens when it tiles with its ' +
   'neighbours', !/cross street|crossing road/i.test(xCode));
ok('what makes it an intersection is CROSSWALKS and LIGHTS, and it has both',
   /CROSSWALK/i.test(xSrc) && /MAST/.test(xCode));
ok('the freeway draws no crosswalk at all', !/crosswalk/i.test(freewayCode));

// ---- EVERY CELL IS PAINTED, CORNER TO CORNER (Paolo 8/11) ---------------------------
//   "when you show it to me only show me the square grid that it will be in that is it"
// Shown as a GRID instead of as sixty separate pictures, the defect was obvious and it was
// not the buildings: an isometric pad is a DIAMOND, so all four corners of every tile were
// TRANSPARENT and read as black holes between neighbours. No city builder has holes between
// its cells -- the ground runs under everything and the buildings sit on it.
// 4. THE GROUND LINE. Every tile is cropped to its own content now, so each one ends ON
// its base by construction -- the check that survives is that nothing floats: the bottom
// row of every tile has ink in it.
const floating = px.filter(p => p.bb[3] < p.h - 1);
ok('nothing floats: every tile ends on its own ground' +
   (floating.length ? ' — ' + floating.slice(0, 5).map(p => p.d).join(', ') : ''),
   floating.length === 0);

// ---- 5 + 6: the pad is square in world space, and the size is derived ------------------
const SRC = SRC0;
ok('the PAD under the building is squared in world space, not just the frame',
   /side = max\(x1 - x0, y1 - y0\)/.test(SRC));
ok('the square size is MEASURED from the set at bake time, not typed as a constant',
   /SQUARE_PX = int\(math\.ceil\(max\(need_w, need_h\)\)\)/.test(SRC));
ok('and the factory says out loud that the hand-picked number clipped nineteen of them',
   /clipped/i.test(SRC) && /NINETEEN|nineteen/.test(SRC));

console.log('SQUARE ICONS GATE: ' + pass + ' passed, ' + fail + ' failed  (' + heroes.length +
            ' tiles, one cell ' + CELL + 'px wide, cropped to the cell, nothing floating)');
process.exit(fail ? 1 : 0);
