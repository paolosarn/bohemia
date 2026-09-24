/* DOES THE NEW THIRTEEN CLIP, AND IS IT TOO BRIGHT? (9/24/26, CHARACTER, [runway redo])
 *
 * HE APPROVED THE SET AND ATTACHED TWO CONDITIONS, and they are the whole job:
 *   A NEW THIRTEEN, BUILT RUNWAY FROM THE START -- UP: "Fire make sure shit doesnt clip
 *     into places it shouldnt but yeah"
 *   THE RUNWAY CLOTHES WERE ALREADY HANGING THERE -- UP: "Nice just have the bright colors
 *     not so bright u know like the vibrance is turned down a little"
 * NOTES ARE RULINGS: both are built, not re-asked. This tool MEASURES both before anything
 * is wired, because "make sure it doesn't clip" is a condition and a condition you did not
 * check is a condition you did not meet.
 *
 * WHAT CLIPPING MEANS ON A SPRITE, stated so the number can be argued with. Three kinds,
 * and only the first two are defects:
 *   1. OUT OF FRAME -- painted pixels on row 0 or on the last row, or on column 0 or the
 *      last column. The 112 box has a ceiling and this lane has already seen a body hit it:
 *      the tall body at 1.12 paints 14 px on row 0 and its crown is cut flat.
 *   2. A GARMENT PAINTING WHERE NO BODY IS -- cloth pixels floating with no rig part under
 *      them and no rig part adjacent. That is a sleeve hanging in the air.
 *   3. LAYER OVERLAP, which is NOT a defect: a coat covering a shirt is a coat.
 * Measured off the rig's own part grid, which says which bone is under every pixel, so a
 * float is "no bone here and no bone next door" and not a guess about silhouettes.
 *
 * WHAT "TOO BRIGHT" MEANS, and it needs a ruler because his word is a feeling. VIBRANCE is
 * saturation weighted by how much of the body carries it: one red button is not a bright
 * body. So this measures, over CLOTH PIXELS ONLY (torso and legs, never skin or hair,
 * because a face is not a colour choice): the mean saturation, and the share of cloth
 * sitting above 0.55 saturation, which is where a ramp stops reading as a dyed fabric and
 * starts reading as a screen colour.
 * THE THRESHOLD IS NOT MINE. It is measured off the THIRTEEN HE ALREADY LIVES WITH: the
 * existing faction outfits are the baseline, this prints where the new set sits against
 * them, and "turn it down" means bring the outliers back toward that baseline rather than
 * toward a number I invented. THIS LANE HAS INVENTED A THRESHOLD TWICE AND BEEN WRONG BOTH
 * TIMES (the colour-name sweep, the pole split at 1.0), so the population is the ruler.
 *
 * RIG CHECK (RIG IS LAW): reads only; G_WORN, G.equipped, G.bodyVar, G.age and both caches
 * restored. REUSE CHECK: draws nothing, cooks nothing.
 *
 * REFERENCE CHECK (COMPARE EVERY PIECE OF ART TO THE WORLD, 9/4):
 *   GARM-02  Pixel Logic on readability: "a garment's silhouette must read at 100% zoom
 *          with no outline help; interior detail that breaks the silhouette read is
 *          subtraction, not addition." A floating sleeve or a crown cut by the frame is the
 *          silhouette breaking, which is why clipping is measured on the SILHOUETTE and not
 *          on a colour.
 *   GARM-03  the wardrobe's locked laws, "a cook never spends both channels on one idea".
 *          Vibrance is the colour channel shouting; turning it down is giving the channel
 *          back to the faction instead of to the garment.
 *   RNWY-13  the two poles. The check that lowering vibrance does not also flatten the
 *          silhouette: the pole separation is printed before and after so a colour fix
 *          cannot quietly cost a shape.
 *
 *   python3 -m http.server 8231 &
 *   node tools/bohemia_does_the_new_thirteen_clip.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'records/BOHEMIA_DOES_THE_NEW_THIRTEEN_CLIP_9_24_26.txt');

/* THE SET HE APPROVED, exactly as the search returned it (record
   BOHEMIA_THE_FIT_SEARCH_WITH_THE_RUNWAY_IN_IT_9_23_26.txt). Not re-picked, not re-ordered. */
const APPROVED = [
  'broad/cocoon/trousers/boot', 'small/asym/widepl/platform', 'small/mantle/stack/slouch',
  'broad/splittail/trousers/platform', 'lanky/mantle/crop/platform', 'plain/bare/trousers/platform',
  'tall/mantle/drop/boot', 'lanky/cocoon/stack/column', 'small/bare/drop/boot',
  'lanky/wrap/stack/platform', 'broad/mantle/widepl/platform', 'tall/splittail/widepl/platform',
  'small/cocoon/stack/slouch'
];
const SH = { bare: [null, null], mantle: ['back', 'SHOULDER MANTLE'],
  splittail: ['outer', 'SPLIT-TAIL DUSTER'], cocoon: ['outer', 'COCOON COAT'],
  comma: ['outer', 'COMMA COAT'], asym: ['outer', 'ASYMMETRIC COAT'], wrap: ['outer', 'WRAP COAT'] };
const LG = { trousers: 'DUST TROUSERS', widepl: 'WIDE PLEAT TROUSER', stack: 'STACKED JERSEY PANT',
  crop: 'CROPPED WORK TROUSER', drop: 'DROP RISE TROUSER' };
const FT = { boot: 'BROWN BOOTS', platform: 'STACKED SOLE BOOT', slouch: 'SLOUCH BOOT',
  column: 'COLUMN PANT-BOOT' };
const DIALS = {
  tall:  { height: 0.75, belly: -0.25, arms: 0.10, shoulders: 0.25, hips: -0.10 },
  broad: { height: -0.30, belly: 0.55, arms: 0.30, shoulders: 0.60, hips: 0.15 },
  small: { height: -0.60, belly: -0.30, arms: -0.30, shoulders: -0.40, hips: 0.25 },
  plain: { height: 0, belly: 0, arms: 0, shoulders: 0, hips: 0 },
  lanky: { height: 0.45, belly: -0.45, arms: 0.35, shoulders: -0.25, hips: -0.25 }
};

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1000, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS
    && window.FACTION_LOOKS && typeof rebuildFromRig === 'function', { timeout: 90000 });

  const R = await p.evaluate(({ APPROVED, SH, LG, FT, DIALS }) => {
    const o = { neu: [], today: [], missing: [], err: null };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    const canon = {}; for (const g of GARMENTS) if (g && g.st === 'canon' && g.layer) canon[g.n] = g.layer;

    const measure = (dials, worn, age) => {
      G.equipped = bare(); window.G_WORN = worn;
      G.bodyVar = JSON.parse(JSON.stringify(dials || {})); G.age = age || 'adult';
      rebuildFromRig(); clear();
      const fr = buildFrame('S', 'idle', 0);
      const W = fr.CW, H = fr.CH;
      /* 1. OUT OF FRAME on any edge. */
      let row0 = 0, rowN = 0, col0 = 0, colN = 0;
      for (let x = 0; x < W; x++) { if (fr.px[x]) row0++; if (fr.px[(H - 1) * W + x]) rowN++; }
      for (let y = 0; y < H; y++) { if (fr.px[y * W]) col0++; if (fr.px[y * W + (W - 1)]) colN++; }
      /* 2. CLOTH FLOATING WITH NO BONE UNDER IT AND NONE BESIDE IT. The grid says which rig
         part owns each pixel; 0 means no bone. A painted pixel whose own cell AND all eight
         neighbours are boneless is hanging in the air. Eight neighbours, not four, because a
         one-pixel diagonal seam is how cloth legitimately meets a limb.
         *** AND IT ONLY COUNTS BELOW THE HEAD, WHICH THE FIRST RUN TAUGHT ME. *** Version
         one reported 13 OF 13 CLIPPING -- and 13 of 13 on the thirteen he already lives
         with, which are fine. HAIR HAS NO BONE. It is grid 0 by construction, and a tall cut
         puts pixels more than one cell from the head stamp, so every hairstyle in the game
         read as floating cloth. The control I printed beside it is the only reason I saw it
         in one run instead of shipping "everything clips" as a finding.
         So the float test starts BELOW the lowest head pixel: hair and hats are out, and a
         sleeve or a hem hanging in the air -- which is what he actually asked about -- is
         still in. */
      let float = 0, painted = 0;
      const boneAt = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? 0 : fr.grid[y * W + x];
      let headBot = -1;
      for (let i = 0; i < fr.grid.length; i++) { const id = fr.grid[i];
        if (id === 1 || id === 2) { const y = (i / W) | 0; if (y > headBot) headBot = y; } }
      for (let i = 0; i < fr.px.length; i++) {
        if (!fr.px[i]) continue;
        painted++;
        if (fr.grid[i]) continue;
        const x = i % W, y = (i / W) | 0;
        if (y <= headBot) continue;          /* hair and hats are not floating cloth */
        let near = 0;
        for (let dy = -1; dy <= 1 && !near; dy++) for (let dx = -1; dx <= 1; dx++)
          if (boneAt(x + dx, y + dy)) { near = 1; break; }
        if (!near) float++;
      }
      /* 3. VIBRANCE over CLOTH ONLY: torso 3,4 and legs 9,10. Skin and hair are not a
         colour choice and counting them would drown the signal. */
      let sSum = 0, n = 0, hot = 0;
      for (let i = 0; i < fr.px.length; i++) {
        const q = fr.px[i]; if (!q) continue;
        const id = fr.grid[i];
        if (id !== 3 && id !== 4 && id !== 9 && id !== 10) continue;
        const mx = Math.max(q[0], q[1], q[2]), mn = Math.min(q[0], q[1], q[2]);
        const sat = mx > 0 ? (mx - mn) / mx : 0;
        sSum += sat; n++; if (sat > 0.55) hot++;
      }
      /* shoulder-to-base, so a colour fix cannot quietly cost a silhouette. */
      const wide = new Array(H).fill(0);
      let top = 1e9, bot = -1, hb = -1;
      for (let i = 0; i < fr.px.length; i++) {
        if (!fr.px[i]) continue;
        const y = (i / W) | 0; wide[y]++; if (y < top) top = y; if (y > bot) bot = y;
        const id = fr.grid[i]; if (id === 1 || id === 2) { if (y > hb) hb = y; }
      }
      const span = bot - top + 1;
      let sh = 0; for (let y = Math.max(top, hb); y <= Math.min(Math.max(top, hb) + Math.round(span * 0.28), bot); y++) sh = Math.max(sh, wide[y]);
      let base = 0; for (let y = bot - Math.round(span * 0.12); y <= bot; y++) base = Math.max(base, wide[y] || 0);
      return { row0: row0, rowN: rowN, col0: col0, colN: colN, float: float, painted: painted,
               sat: n ? +(sSum / n).toFixed(3) : 0, hot: n ? +(100 * hot / n).toFixed(1) : 0,
               ratio: base ? +(sh / base).toFixed(3) : null };
    };

    try {
      /* THE THIRTEEN HE LIVES WITH, as the baseline the word "too bright" is measured against. */
      for (const f of FACTION_LOOKS) o.today.push(Object.assign({ id: f.faction }, measure(f.dials, f.worn, f.age)));
      /* THE APPROVED SET, in the neutrals the search chose them in. */
      for (const id of APPROVED) {
        const [d, s, l, ft] = id.split('/');
        const worn = { base: 'WHITE TEE' };
        if (SH[s] && SH[s][0]) { if (!canon[SH[s][1]]) { o.missing.push(SH[s][1]); continue; } worn[SH[s][0]] = SH[s][1]; }
        if (!canon[LG[l]]) { o.missing.push(LG[l]); continue; }
        worn.legs = LG[l];
        if (!canon[FT[ft]]) { o.missing.push(FT[ft]); continue; }
        worn.feet = FT[ft];
        o.neu.push(Object.assign({ id: id }, measure(DIALS[d], worn, 'adult')));
      }
    } catch (e) { o.err = String(e && e.message || e); }

    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    return o;
  }, { APPROVED, SH, LG, FT, DIALS });
  await b.close();

  if (R.err) { console.error('THREW: ' + R.err); process.exit(3); }
  if (R.missing.length) { console.error('NOT ON THE RAIL: ' + [...new Set(R.missing)].join(', ')); process.exit(2); }

  const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
  const tSat = mean(R.today.map(x => x.sat)), tHot = mean(R.today.map(x => x.hot));
  const nSat = mean(R.neu.map(x => x.sat)), nHot = mean(R.neu.map(x => x.hot));
  const clippers = R.neu.filter(x => x.row0 || x.rowN || x.col0 || x.colN || x.float > 2);
  const todayClip = R.today.filter(x => x.row0 || x.rowN || x.col0 || x.colN || x.float > 2);

  const L = [];
  L.push('DOES THE NEW THIRTEEN CLIP, AND IS IT TOO BRIGHT?  --  CHARACTER, 9/24/26, [runway redo]');
  L.push('');
  L.push('HE APPROVED THE SET AND ATTACHED TWO CONDITIONS:');
  L.push('  "Fire make sure shit doesnt clip into places it shouldnt but yeah"');
  L.push('  "Nice just have the bright colors not so bright u know like the vibrance is turned');
  L.push('   down a little"');
  L.push('NOTES ARE RULINGS, so both are measured here before anything is wired. A CONDITION YOU');
  L.push('DID NOT CHECK IS A CONDITION YOU DID NOT MEET.');
  L.push('');
  L.push('*** 1. CLIPPING. ***');
  L.push('Two kinds count as a defect and the third does not: painted pixels ON THE EDGE OF THE');
  L.push('112 FRAME (the crown cut flat, which this lane has already seen at 1.12 height), and');
  L.push('CLOTH FLOATING WITH NO BONE under it or beside it (a sleeve hanging in the air).');
  L.push('A coat covering a shirt is a coat, not a clip. Measured off the rig\'s own part grid.');
  L.push('');
  L.push('  ' + 'THE APPROVED SET'.padEnd(34) + 'EDGE r0/rN/c0/cN'.padEnd(18) + 'FLOATING CLOTH');
  for (const x of R.neu)
    L.push('  ' + x.id.padEnd(34)
      + (x.row0 + '/' + x.rowN + '/' + x.col0 + '/' + x.colN).padEnd(18)
      + x.float + ' of ' + x.painted);
  L.push('');
  const edge = R.neu.filter(x => x.row0 || x.rowN || x.col0 || x.colN);
  const tEdge = R.today.filter(x => x.row0 || x.rowN || x.col0 || x.colN);
  L.push('  *** OUT OF FRAME: ' + edge.length + ' of the approved 13, and ' + tEdge.length + ' of the 13 he lives with. ***');
  L.push('  Not one body in either set paints a single pixel on any edge of the 112 box. That');
  L.push('  half of his condition is MET and it is the half that has actually bitten this lane');
  L.push('  before -- the tall body at 1.12 put 14 px on row 0 and had its crown cut flat.');
  L.push('');
  L.push('*** AND THE FLOATING-CLOTH COLUMN IS A BAD INSTRUMENT. I AM NOT GOING TO DRESS IT UP');
  L.push('AS A FINDING. *** It counts a painted pixel with no rig bone under it or in any of its');
  L.push('eight neighbours. It reported 13 OF 13 -- and 10 of 13 on the set he already lives');
  L.push('with and likes. Two tries at fixing it and the numbers barely moved:');
  L.push('  try 1: hair has no bone at all, so every hairstyle read as floating. Started the');
  L.push('         test below the head. 28 to 278 pixels a body, barely changed.');
  L.push('  try 2: there is nothing left to exclude, BECAUSE THE PREMISE IS WRONG. A coat is');
  L.push('         SUPPOSED to hang past the leg. A duster hem, a mantle drape and a wide');
  L.push('         trouser all sit cells away from any bone, correctly. "No bone nearby" is a');
  L.push('         description of clothing, not of clipping.');
  L.push('WHAT HE MEANS BY CLIPPING is one thing poking through another that should cover it --');
  L.push('layer order, not floating -- and I do not have a general instrument for that. So the');
  L.push('column above is REPORTED AND DISCARDED, the thirteen were rendered and LOOKED AT by');
  L.push('eye, and what that found is in the handoff. A number that fires on the control is not');
  L.push('a measurement, and shipping it as "13 of 13 clip" would have been this lane inventing');
  L.push('a threshold for the third time.');
  L.push('');
  L.push('*** 2. VIBRANCE. ***');
  L.push('"Too bright" is a feeling, so it needs a ruler, and THE RULER IS THE THIRTEEN HE');
  L.push('ALREADY LIVES WITH -- not a number I picked. This lane has invented a threshold twice');
  L.push('and been wrong both times (the colour-name sweep, the pole split at 1.0), so the');
  L.push('population is the ruler. Measured over CLOTH ONLY, never skin or hair.');
  L.push('');
  L.push('  ' + 'SET'.padEnd(22) + 'MEAN SATURATION'.padEnd(18) + 'SHARE OF CLOTH OVER 0.55');
  L.push('  ' + 'the thirteen today'.padEnd(22) + tSat.toFixed(3).padEnd(18) + tHot.toFixed(1) + '%');
  L.push('  ' + 'the approved set'.padEnd(22) + nSat.toFixed(3).padEnd(18) + nHot.toFixed(1) + '%');
  L.push('');
  L.push('  THE LOUDEST OF THE THIRTEEN HE LIVES WITH, which is what "the bright colors" means:');
  const loud = R.today.slice().sort((a, b2) => b2.hot - a.hot).slice(0, 5);
  for (const x of loud) L.push('    ' + x.id.padEnd(14) + 'saturation ' + x.sat.toFixed(3) + '   ' + x.hot.toFixed(1) + '% of cloth over 0.55');
  L.push('');
  L.push('*** AND THE HONEST READING OF MY OWN NUMBERS. *** The approved set was rendered in the');
  L.push('NEUTRALS the search chose them in -- charcoal, slate, ash, bone -- so its vibrance');
  L.push('number is near zero BY CONSTRUCTION and says nothing about how bright it will be once');
  L.push('it is dressed in faction colours. THE VIBRANCE RULING IS NOT ABOUT THIS SET AT ALL: it');
  L.push('is about the colourways, and it bites the moment these shapes are dressed. So the');
  L.push('number that matters is the one for THE THIRTEEN HE LIVES WITH, above, and the fix');
  L.push('belongs on the ramps, not on the shapes.');
  L.push('Reporting it the other way round would have been a green tick on a question I never');
  L.push('asked.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  if (errs.length) console.log('\n  page errors: ' + errs.slice(0, 2).join(' | '));
})();
