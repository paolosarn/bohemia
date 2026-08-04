/* ============================================================================
   STREET SOURCE GATE (7/31/26) -- clause 5 of the STREETS ARE THE HARMONIZED
   POOL law, which requires a gate the same turn the law lands.

   Paolo 7/31: "all the street tiles you have to change back to how they were
   when I like them, not when you..."

   THE FAILURE THIS EXISTS TO CATCH IS NOT A MISSING CITATION. IT IS A CITATION
   THAT IS A LIE. The city's street-art block already carried this comment:

       [quote] ==== STREET ART (7/20): the approved V11/V12 street pools, on the ground.
          Source: banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt ... Gate-locked. [end]

   and then drew a 6-tile, 16-pixel re-cook. Measured on the surface he plays:

       pool     his bank      what was drawn      byte-identical
       street   18 @ 44x44    6 @ 16x16           0
       side     36 @ 44x44    6 @ 16x16           0

   Not one tile he approved was on the screen, under a comment that named the
   bank. So this gate does not grep for the bank's NAME anywhere. It compares
   BYTES, and it checks the size, because a re-cook at a different resolution is
   the exact way this drifted.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const POOL = path.join(ROOT, 'banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt');
const DOC = path.join(ROOT, 'records/BOHEMIA_WHERE_THE_GOOD_STREET_PIXELS_ARE_7_31_26.md');
const LAW = path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_STREETS_ARE_THE_HARMONIZED_POOL_7_31_26.md');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* WHERE the city app lives and WHAT SHAPE it is in are not this gate's business
   (8/4). One resolver knows; this asks it. The argument is ignored and kept only
   so the call sites below read the same as they did. */
const CITY = require('./bohemia_city_app.js');
function cityBlob(_alpha) { const a = CITY.read(); return a ? a.src : null; }
const sizeOf = b64 => {
  const b = Buffer.from(b64, 'base64');
  return b.readUInt32BE(16) + 'x' + b.readUInt32BE(20);
};

ok('the finder doc his law points at exists', fs.existsSync(DOC));
ok('the streets law exists', fs.existsSync(LAW));
ok('the harmonized bank exists', fs.existsSync(POOL));

const pools = JSON.parse(fs.readFileSync(POOL, 'utf8')).pools;
const alpha = fs.readFileSync(ALPHA, 'utf8');
const city = cityBlob(alpha);
ok('the alpha carries a readable CITY blob', !!city && city.length > 100000);

if (city) {
  /* BYTES, NOT NAMES. Every tile in each street-family pool must literally be in
     the shipped renderer. */
  const FAMILIES = ['street', 'side', 'lane_div', 'median', 'cross'];
  let totalMissing = 0;
  for (const p of FAMILIES) {
    const tiles = (pools[p] || []).filter(t => typeof t === 'string');
    if (!tiles.length) { ok('bank pool ' + p + ' is non-empty', false); continue; }
    const present = tiles.filter(t => city.indexOf(t) >= 0).length;
    totalMissing += tiles.length - present;
    ok('HIS approved "' + p + '" tiles are on the street, byte for byte ('
       + present + '/' + tiles.length + ')', present === tiles.length);
    /* the size check is the one that would have caught the 16px re-cook */
    const sizes = [...new Set(tiles.map(sizeOf))];
    ok('"' + p + '" is 44x44, the corpus cell, so it never resamples ('
       + sizes.join(', ') + ')', sizes.length === 1 && sizes[0] === '44x44');
  }
  ok('NOT ONE approved street tile is missing from the surface he plays',
     totalMissing === 0);

  /* clause 3: the bank's own rulings travel with the tiles */
  ok('weather_rarity_law is applied where the tile is PICKED, not just quoted',
     city.indexOf('__HARMONIZED_STREETS__') >= 0 && /__wr\s*=\s*0\.12/.test(city));

  /* the exact drift that happened: a smaller re-cook under a citation */
  const i = city.indexOf('const SA_TILES=');
  if (i >= 0) {
    const lit = city.slice(i + 'const SA_TILES='.length, city.indexOf('\n', i)).replace(/;$/, '');
    let sa = null;
    try { sa = JSON.parse(lit); } catch (e) {}
    ok('the city street table parses', !!sa);
    if (sa) {
      ok('the city draws the FULL pool, not a trimmed re-cook (street '
         + (sa.street || []).length + ', side ' + (sa.side || []).length + ')',
         (sa.street || []).length === pools.street.length &&
         (sa.side || []).length === pools.side.length);
    }
  }
}

console.log('STREET SOURCE GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
