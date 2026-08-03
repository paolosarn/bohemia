// BOHEMIA — PERSON LOOK GATE (7/31/26). FACTORY LAW: new machinery, own gate, same turn.
//
// Paolo 7/31: "WE HAVE 11 months of forward motion work we need to complete. Do
// what you have to do next and know what comes after."
//
// THE GAP THIS CLOSED, measured before anything was built: the lane owned one
// painted rig, six body dials, 221 approved garments and 102 clips, and NOTHING
// that turned them into a population. Nothing in the repo varied a person's
// appearance -- no seed, no per-agent body, no per-agent outfit. A city shipping
// 296 lives was shipping 296 copies of the same man.
//
// WHAT THIS GATE HOLDS, and every one of them is a law this could have broken:
//   DETERMINISM   same id -> same person, always. An NPC must look the same when
//                 you walk away and come back, and across a save. Guaranteed by
//                 never rolling dice, so this is checked, not hoped.
//   ORDER-PROOF   adding a garment must not reshuffle everyone already alive.
//                 The pick sorts its pool first; a shuffled GARMENTS array must
//                 produce the identical outfit.
//   ONE RIG       every body is his painted body plus DIAL VALUES. The look
//                 object may carry only the six known dials -- a new key here
//                 would be new anatomy, which is the woman-rig v1-v4 mistake.
//   NO SEX TERM   "nah when i put fat its like your fat fuck that woman belly
//                 shit... more unisex vibes" (7/29). No sex/gender term may
//                 appear in the module at all.
//   HIS PALETTE   it must NOT vary skin tone. Complexion across a population is
//                 a canon ruling of his, not a mechanism decision of mine.
//   REUSE-FIRST   it may only ever name garments already approved. The module
//                 holds no garment names at all -- it reads the canon pool live,
//                 so anything he kills leaves the streets automatically.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const MOD = path.join(ROOT, 'engine', 'bohemia_personlook.js');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== PERSON LOOK GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the module is checked in', fs.existsSync(MOD));
if (!fs.existsSync(MOD)) done();
const src = fs.readFileSync(MOD, 'utf8');
/* EVERY WORD CHECK BELOW READS CODE, NOT COMMENTS. Three of them failed on the
   first run against this module's own header -- it QUOTES Paolo ("that woman
   belly shit", "unisex vibes"), NAMES skin tone as a thing it refuses to touch,
   and says "no Math.random". Documenting a rule is not breaking it. A checker
   that cannot tell a rule from its description is the broken one. */
const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
const L = require(MOD);

/* ---- DETERMINISM ------------------------------------------------------- */
const g = [{ n: 'A TOP', st: 'canon', layer: 'base' }, { n: 'B TOP', st: 'canon', layer: 'base' },
           { n: 'C LEG', st: 'canon', layer: 'legs' }, { n: 'D LEG', st: 'canon', layer: 'legs' },
           { n: 'E FOOT', st: 'canon', layer: 'feet' }, { n: 'F COAT', st: 'canon', layer: 'outer' }];
ok('same id gives the same person, twice',
  JSON.stringify(L.lookFor('npc-42', g)) === JSON.stringify(L.lookFor('npc-42', g)));
ok('same id gives the same person after 1000 other lookups',
  (() => { const a = JSON.stringify(L.lookFor('npc-7', g));
    for (let i = 0; i < 1000; i++) L.lookFor('x' + i, g);
    return a === JSON.stringify(L.lookFor('npc-7', g)); })());
ok('there is no Math.random anywhere in it (a rolled look cannot be stable)',
  !/Math\.random/.test(code));

/* ---- ORDER-PROOF: a new garment must not restyle the whole city --------- */
ok('shuffling the garment list does not change anyone\'s outfit',
  (() => { const a = JSON.stringify(L.outfitFor('npc-9', g));
    return a === JSON.stringify(L.outfitFor('npc-9', g.slice().reverse())); })());

/* ---- VARIETY: it has to actually make a crowd -------------------------- */
const bodies = new Set(), outfits = new Set();
for (let i = 0; i < 200; i++) {
  bodies.add(JSON.stringify(L.bodyFor('c' + i)));
  outfits.add(JSON.stringify(L.outfitFor('c' + i, g)));
}
ok(`200 people give 150+ distinct bodies (${bodies.size})`, bodies.size >= 150);
/* THE CHECK ABOVE PASSED THROUGH A REAL BUG, so this one exists. It read 188/200
   the whole time plain FNV-1a was handing back correlated dials: two of the first
   twelve crowd citizens had BYTE-IDENTICAL bodies, and 64 sequential ids produced
   only 24 distinct arm values and 17 distinct hip values. Distinct-as-a-tuple
   hides a dial that barely moves -- six dials only have to disagree in ONE place
   to look "distinct". So measure EVERY DIAL SEPARATELY, and measure it on
   SEQUENTIAL ids (npc-0, npc-1, npc-2 ...), because that is what real ids are and
   it is the exact worst case for a hash with a weak final byte. Allowance is for
   3-decimal rounding collisions, nothing more. */
(function () {
  const PREFIXES = ['npc-', 'c', 'crowd:0:', ''];
  let worst = 64, worstName = '';
  for (const pre of PREFIXES) for (const k of Object.keys(L.RANGE)) {
    const vals = new Set();
    for (let i = 0; i < 64; i++) vals.add(L.bodyFor(pre + i)[k]);
    if (vals.size < worst) { worst = vals.size; worstName = k + ' @ "' + pre + '"'; }
  }
  ok(`every dial moves on SEQUENTIAL ids (worst: ${worst}/64 on ${worstName})`, worst >= 55);
})();
ok('2000 sequential ids give 2000 distinct bodies (no clustering at scale)',
  (() => { const s = new Set();
    for (let i = 0; i < 2000; i++) s.add(JSON.stringify(L.bodyFor('npc-' + i)));
    return s.size === 2000; })());
ok(`200 people give 8+ distinct outfits from a 6-garment pool (${outfits.size})`, outfits.size >= 8);

/* ---- ONE RIG: dial values only, never new anatomy ---------------------- */
const DIALS = ['height', 'belly', 'arms', 'shoulders', 'armLength', 'hips'];
const body = L.bodyFor('anyone');
ok('a body is ONLY the six known dials -- no new anatomy',
  Object.keys(body).sort().join(',') === DIALS.slice().sort().join(','));
let out = 0;
for (let i = 0; i < 500; i++) { const b = L.bodyFor('p' + i);
  for (const k in b) if (Math.abs(b[k]) > L.RANGE[k] + 1e-9) out++; }
ok('every dial stays inside the declared crowd range (' + out + ' out of bounds)', out === 0);
ok('the crowd range is NARROWER than the editor range (a street, not a carnival)',
  Object.values(L.RANGE).every(v => v <= 0.6));

/* ---- HIS RULINGS ------------------------------------------------------- */
ok('no sex/gender term in the CODE (FAT IS FAT, 7/29)',
  !/\b(female|male|woman|gender|bust|gynoid)\b/i.test(code));
ok('the CODE never varies skin tone (his palette, his ruling)',
  !/skinTone|skinRamp|complexion/i.test(code));
ok('it holds NO garment names -- the pool is read live from what he approved',
  !/'[A-Z][A-Z ]{3,}'/.test(code));
ok('only CANON garments are ever worn',
  (() => { const withDead = g.concat([{ n: 'DEAD THING', st: 'dead', layer: 'base' }]);
    let seen = false;
    for (let i = 0; i < 300; i++) { const o = L.outfitFor('d' + i, withDead);
      if (o.base === 'DEAD THING') seen = true; }
    return !seen; })());

/* ---- not everyone wears everything ------------------------------------ */
let coats = 0;
for (let i = 0; i < 300; i++) if (L.outfitFor('w' + i, g).outer) coats++;
ok(`not everyone owns a coat (${coats}/300 wear one)`, coats > 30 && coats < 250);

/* A HAIRCUT IS A LUXURY (Paolo 8/1, LOCKED) -- now with a machine behind it.
   His law says unmaintained hair is the DEFAULT and a machine taper is a wealth
   signal, "a luxury reserved for Rich people". The pick was UNIFORM, so a sharp
   fade was as common on the street as unkempt long hair and the law was words
   only. MEASURED before: 6 of 23 styles carry a fade, so 26% of citizens wore one
   by pure chance. After: 7%. Every style still reaches the street -- rarity, not
   exclusion.
   The UNLOCK mechanism is still [PENDING, HIS CALL] and is deliberately NOT built. */
(function () {
  const H = [];
  for (let i = 0; i < 14; i++) H.push({ n: 'PLAIN ' + i, st: 'canon', layer: 'hair' });
  for (let i = 0; i < 6; i++) H.push({ n: 'LUX ' + i, st: 'canon', layer: 'hair', lux: true });
  let lux = 0, worn = 0; const seen = new Set();
  for (let i = 0; i < 800; i++) {
    const o = L.outfitFor('npc-' + i, H);
    if (!o.hair) continue;
    worn++; seen.add(o.hair);
    if (o.hair.indexOf('LUX') === 0) lux++;
  }
  const pct = Math.round(lux * 100 / worn);
  ok(`a luxury cut is RARE, not one-in-four (${pct}% wear one; uniform would be 30%)`,
    pct > 0 && pct <= 15);
  ok(`but no approved style is excluded from the street (${seen.size}/20 seen)`,
    seen.size === 20);
  ok('the module still holds NO garment names -- luxury is a FLAG on the garment',
    /x\.lux/.test(code) && !/'[A-Z][A-Z ]{3,}'/.test(code));
})();

/* ---- ENGINE SYNC LAW: one canonical body ------------------------------- */
const alpha = fs.readFileSync(ALPHA, 'utf8');
ok('the module is inlined in the ONE alpha', alpha.indexOf('BOH_PERSONLOOK') >= 0);
/* EVERY BYTE, not the first 400. The old check compared a 400-character PREFIX,
   which is this module's header comment -- so when the hash function at the
   BOTTOM of the file was fixed, the engine module changed, the alpha kept the old
   broken copy, and this check stayed green. A prefix comparison is not a
   comparison. tools/bohemia_personlook_sync.py does the re-inline. */
ok('the inlined copy is byte-identical to the engine module, ALL ' + src.trim().length +
   ' bytes (ENGINE SYNC LAW)', alpha.indexOf(src.trim()) >= 0);

done();
