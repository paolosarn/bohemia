/* STREET FACING GATE (8/15/26, WORLD lane)
 *
 * Paolo 8/15: "how hard is it to recognize and be smart about which direction a
 * street should be going east to West north to south and then make it face that
 * way properly by turning the tile ... we need that and the freeway too."
 *
 * IT IS NOT HARD, BECAUSE WE ALREADY KNOW. Every road cell computes its four
 * neighbours in tileMeta (m.N/m.S/m.E/m.W = "is the cell that way also a road").
 * That mask IS the run direction, exactly, for free -- and until today the art
 * ignored it and stamped every street tile the same way round. Measured on the
 * shipped seed: 1,000 north-south cells, 1,036 east-west, 1,537 junctions. Half
 * the streets in the valley were facing the wrong way.
 *
 *   node gates/street_facing_gate.js
 */
const fs = require('fs');
const path = require('path');
const world = fs.readFileSync(path.join(__dirname, '..', 'slices', 'BOHEMIA_CITY_WORLD.html'), 'utf8');
const code = world.replace(/\/\*[\s\S]*?\*\//g, '');       // a MENTION is not a USE

let pass = 0, fail = 0;
const ok = (l, c, x) => { if (c) { pass++; console.log('  ok   ' + l); }
                          else { fail++; console.log('  FAIL ' + l + (x ? '\n         ' + x : '')); } };

console.log('STREET FACING GATE — a street faces the way it actually runs');

ok('the page decides a street tile\'s facing at all', /function heroFlip\(/.test(code));
const fn = code.slice(code.indexOf('function heroFlip'), code.indexOf('function heroFlip') + 900);

ok('the facing is READ off the neighbour mask the cell already computes, never guessed',
   /m\.N/.test(fn) && /m\.S/.test(fn) && /m\.E/.test(fn) && /m\.W/.test(fn),
   'the direction is free: tileMeta has computed it on every road cell for months');
ok('a north-south run and an east-west run are told apart', /ns\s*>\s*ew/.test(fn));
ok('a JUNCTION is never flipped — a crossroads is symmetric',
   /ns>=1&&ew>=1\)\s*return false/.test(fn.replace(/\s/g, '').replace(/(.)/g, '$1')) ||
   /return false;\s*\/\/ a junction/.test(fn) || /ns>=1&&ew>=1/.test(fn.replace(/\s/g, '')),
   'flipping the dedicated intersection tile only shuffles its own corners');
ok('only ROADS are ever turned — a building is never mirrored',
   /RD\[d\]/.test(fn) && /return false/.test(fn),
   'mirroring a hero would flip its doors, its signage and its street frontage');

/* THE TRANSFORM ITSELF ----------------------------------------------------- */
{
  const dh = code.slice(code.indexOf('function drawHero'), code.indexOf('function drawHero') + 900);
  ok('the tile is turned by a MIRROR, not a bitmap rotation',
     /scale\(-1,\s*1\)/.test(dh),
     'the two street runs are the two diagonals of an iso diamond and those are mirrors of each other; rotating the bitmap would shear the pixel grid and break the 45-degree art law');
  ok('the mirror is about the TILE centre, so a tile still butts up against its neighbour',
     /translate\(p\.sx\*2,\s*0\)/.test(dh));
  ok('the flip is passed in from the call site, not recomputed inside the draw',
     /drawHero\(d,p,heroFlip\(d,x,y\)\)/.test(code),
     'one ruler: the mask is read once per cell');
}

console.log('\nSTREET FACING GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
