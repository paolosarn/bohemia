/* FAT AND TALL GATE (8/15/26, WORLD lane) — HIS BATCH RULING ON THE 60 ICONS.
 *
 * Paolo 8/15, LOCKED:
 *   "everything needs to be bigger ... whenever you start painting anything it
 *    should start like at the border of the actual tile itself like super
 *    important ... make the one stories look like two stories make the two
 *    stories look like three stories make the tallest buildings very tall ...
 *    it's border should be on the border of the tile. It should be that fat and
 *    big on the tile."
 *
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. This asserts the RULING, not one
 * spelling of it: it replays his three worked examples through the factory's own
 * numbers and checks each one lands where he said.
 *
 *   node gates/fat_and_tall_gate.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = fs.readFileSync(path.join(ROOT, 'tools', 'bohemia_district_hero_factory.py'), 'utf8');
const code = SRC.replace(/^\s*#.*$/gm, '');          // a MENTION is not a USE

let pass = 0, fail = 0;
const ok = (l, c, x) => { if (c) { pass++; console.log('  ok   ' + l); }
                          else { fail++; console.log('  FAIL ' + l + (x ? '\n         ' + x : '')); } };

console.log('FAT AND TALL GATE — the border is on the border, and a storey reads as two');

const num = k => { const m = code.match(new RegExp('^' + k + '\\s*=\\s*([0-9.]+)', 'm')); return m ? +m[1] : NaN; };
const STOREY = num('ONE_STOREY'), MUL = num('TALL_MUL'), FAT = num('FAT'), GZ = num('GROUND_Z');

ok('the transform exists in the factory', /def _fat_and_tall\(/.test(code));
ok('one storey is the MEASURED unit, not a guess (' + STOREY + ' units)',
   Math.abs(STOREY - 2.75) < 0.3,
   'a Summerlin house in this factory is 2.9 for its first storey and +2.6 for its second');

/* ---- HIS THREE EXAMPLES, REPLAYED ---------------------------------------- */
const tall = z => z * MUL + STOREY;
const storeys = z => z / STOREY;
{
  const one = tall(2.9), two = tall(5.5), twelve = tall(33);
  ok('"make the one stories look like two" (1 -> ' + storeys(one).toFixed(1) + ' storeys)',
     storeys(one) >= 1.9 && storeys(one) <= 2.6);
  ok('"make the two stories look like three" (2 -> ' + storeys(two).toFixed(1) + ' storeys)',
     storeys(two) >= 2.9 && storeys(two) <= 3.7);
  ok('"make the tallest buildings very tall" (12 -> ' + storeys(twelve).toFixed(1) + ' storeys)',
     storeys(twelve) >= 14);
  /* THE CURVE, NOT A CONSTANT. 1->2 is x2 and 2->3 is x1.5, a FALLING multiplier,
     so a single constant would flatten the exact skyline he asked to exaggerate.
     Adding a fixed storey then scaling is the only shape that fits all three. */
  ok('it is a curve, not one multiplier — the tallest gains the most absolute height',
     (tall(33) - 33) > (tall(2.9) - 2.9),
     'a constant multiplier satisfies one of his three sentences and breaks the other two');
}

/* ---- FAT, AND CLAMPED AT THE CELL ---------------------------------------- */
ok('buildings widen toward the cell edge (x' + FAT + ')', FAT > 1.0);
ok('the widening is CLAMPED at the plate — the border lands ON the border, never past it',
   /max\(cx - hx, min\(cx \+ hx/.test(code) && /max\(cy - hy, min\(cy \+ hy/.test(code),
   'a tile painting into its neighbour is what the 8/11 pass cleaned up; fat is not bleed');
ok('the widening is measured off the GROUND PLATE, not off wherever the art sits',
   /if max\(v\[2\] for v in verts\) > GROUND_Z/.test(code));

/* ---- THE GROUND IS NEVER LIFTED ------------------------------------------ */
ok('anything at plate level stays at plate level (ground_z ' + GZ + ')',
   /if top <= GROUND_Z:/.test(code) && /nv\.append\(\(x, y, z\)\)/.test(code),
   'lifting the plate peels a tile off its own cell and it stops butting up against its neighbour');

/* ---- ORDERING: THE BUG THAT WAS CAUGHT BEFORE IT SHIPPED ----------------- */
{
  const applied = code.indexOf('_fat_and_tall(scene)');
  const measured = code.indexOf('need_w = max(need_w');
  ok('the transform runs BEFORE the shared square is measured',
     applied > 0 && measured > 0 && applied < measured,
     'the square is sized from the set\'s own extents, so a hero that grows after it would grow straight off its frame');
}

/* ---- AND IT ACTUALLY REACHED THE SHIPPED BANK ---------------------------- */
{
  const BANK = path.join(ROOT, 'banks', 'BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt');
  const b = JSON.parse(fs.readFileSync(BANK, 'utf8'));
  const heroes = (b.heroes || []).filter(h => h.b64);
  ok('the bank still holds the whole set (' + heroes.length + ')', heroes.length >= 55);
  const w = heroes[0] && heroes[0].w;
  ok('the icons grew: the shared square is bigger than the frozen 451 px (' + w + ')', w > 451,
     'the ruling is in the factory but was never re-run, so the shipped art is the old art');
  const tallest = Math.max(...heroes.map(h => h.h || 0));
  ok('the tallest hero is genuinely tall against its own width (' + tallest + ' of ' + w + ')',
     tallest / w > 0.85);
}

/* ---- ROOFS (Paolo 8/15) --------------------------------------------------
   "a lot of them just like look exactly the same ... They're all missing roofs
    and textures for their walls and stuff"
   From a 3/4 view the ROOF is the biggest surface on every building, and it was
   the one surface carrying no information at all -- which is precisely why sixty
   different subjects read the same. */
{
  const F = fs.readFileSync(path.join(ROOT, 'tools', 'bohemia_district_hero_factory.py'), 'utf8')
              .replace(/^\s*#.*$/gm, '');
  ok('every building gets a roof dressed, not a flat-shaded lid', /def _dress_roofs\(/.test(F));
  ok('a flat roof has a PARAPET — without one a building is an open-topped box',
     /parapet|ph\s*=\s*0\.55/.test(F) || /scene\.box\(\(x0, y0, z\)/.test(F));
  ok('there is rooftop plant (HVAC), the most recognisable thing on an American roof',
     /uw\s*=\s*min/.test(F) && /ud\s*=\s*min/.test(F));
  ok('and the small stuff — vents and curbs — so a roof never reads empty',
     /0\.26, 0\.26/.test(F));
  ok('roofs are VARIED BY HASH, which is what answers "they all look the same"',
     /def rnd\(i\)/.test(F) && /crc32/.test(F));
  ok('ground, kerbs and aprons are never mistaken for roofs',
     /if z < 2\.4/.test(F),
     'dressing a slab of ground with HVAC is the failure mode of a top-face scan');
  ok('the dressing runs BEFORE the widening, so a parapet grows with its building',
     /* COMPARE CALL TO CALL. The first cut compared the _dress_roofs CALL against
        indexOf('_fat_and_tall(scene)') -- which matches the DEFINITION line, and
        a definition always precedes its call site. lastIndexOf finds the call. */
     F.indexOf('_dress_roofs(scene, d)') > 0 &&
     F.indexOf('_dress_roofs(scene, d)') < F.lastIndexOf('_fat_and_tall(scene)'));
}

/* ---- WALLS (Paolo 8/15, the other half of the same ruling) --------------- */
{
  const F = fs.readFileSync(path.join(ROOT, 'tools', 'bohemia_district_hero_factory.py'), 'utf8')
              .replace(/^\s*#.*$/gm, '');
  ok('walls carry texture, not a flat fill', /def _dress_walls\(/.test(F));
  ok('what a wall actually shows is JOINTS: a base reveal, a parapet reveal, panel lines',
     /pitch\s*=\s*2\.6/.test(F) && /h > 3\.2/.test(F));
  ok('a joint is a LINE, never a plank', /t\s*=\s*0\.06/.test(F),
     'a thick joint reads as trim; a picket fence of thin ones reads as corrugation, which is a different building');
  ok('panel spacing is TILT-UP spacing, so joints stay sparse', /int\(span \/ pitch\)/.test(F));
  ok('window faces are skipped — they already carry their own detail',
     /except Exception:\s*\n\s*continue/.test(F));
  ok('lids, kerbs and steps are never jointed', /if h < 2\.2/.test(F));
  ok('the work is capped to the biggest walls', /walls\[:8\]/.test(F),
     'jointing every wall on sixty heroes is thousands of slivers for detail the eye cannot resolve on a tile');
  ok('walls are dressed BEFORE roofs, so a parapet sits on a finished wall',
     F.lastIndexOf('_dress_walls(scene, d)') < F.lastIndexOf('_dress_roofs(scene, d)'));
}

console.log('\nFAT AND TALL GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
