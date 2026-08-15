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

/* THESE THREE WERE WRITTEN FOR THE NEIGHBOUR-MASK VERSION AND ARE NOW UPDATED,
   NOT DELETED. Paolo caught that the mask version excluded the whole freeway, so
   the rule changed from "count my neighbours" to "measure how far the road
   actually runs". The checks have to follow the RULING (a street faces the way
   it runs), never the first implementation of it. */
ok('the facing is DERIVED from the map, never guessed from a district name',
   /roadAxis\(d,x,y\)/.test(fn),
   'the direction is free: the map already knows which cells are road');
ok('a north-south run and an east-west run are told apart',
   /ax==='ns'/.test(fn) && /'ew'/.test(code));
ok('a true crossing is never flipped — it is symmetric',
   /if\(!ax\) return false/.test(fn),
   'flipping a dedicated intersection tile only shuffles its own corners');

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

/* ---- THE FREEWAY: A TWO-WIDE RIBBON, AND WHAT IT DOES AT A STREET (8/15) --
   Paolo caught that the first pass did nothing for the freeway. He was right and
   the reason was structural: a freeway is TWO CELLS WIDE, so every cell always
   has a partner beside it AND a continuation ahead, and a neighbour-count test
   calls that a junction. Measured on the shipped seed: 968 freeway cells, 942
   classified as junctions, zero turned. Run length fixes it: 461 north-south,
   487 east-west, 20 genuine crossings. */
{
  ok('direction is measured by RUN LENGTH, not by counting neighbours',
     /function roadRun\(/.test(code) && /function roadAxis\(/.test(code),
     'a two-wide ribbon always has a lateral neighbour, so neighbour-count calls the whole freeway a junction and excludes it from its own fix');
  ok('the run walk stays inside the road FAMILY, so a freeway is not continued by a side street',
     /fam&&!fam\(t\.district\)/.test(code));
  ok('the two halves of a wide road are told apart, so the pair works together',
     /function ribbonHalf\(/.test(code),
     'without this the same tile prints twice and the ribbon has two near shoulders and no far one');
  ok('the halves are flipped against each other', /ribbonHalf\(d,x,y,ax\)/.test(code));

  ok('a freeway meeting a street is GRADE SEPARATED, not painted flat over it',
     /function overpassAt\(/.test(code));
  ok('the FREEWAY carries the deck (in this valley the freeway is the thing on structure)',
     /return 1;\s*$|return 1;/m.test(code) && /_op===1/.test(code));
  ok('the cross street DIPS on its way in, as he asked',
     /_op===2/.test(code) && /_lift=-/.test(code),
     'lifting one road without sinking the other reads as two roads painted on top of each other');
  ok('the deck throws a shadow onto what it crosses',
     /globalAlpha\*=0\.42/.test(code),
     'height on screen alone does not say OVER; the shadow is what says it');
  ok('there is GROUND under the bridge, drawn before the deck is lifted',
     /dia\(p,'#6a655c'\)/.test(code),
     'a lifted deck with nothing painted under it punches through to the background');
}

console.log('\nSTREET FACING GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
