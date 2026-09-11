/* DOES THE CROWD REPEAT? (9/11/26, CHARACTER lane, VAMILY [more clothes] WARDROBE-VOLUME)
 *
 * THE ROW: "new garment shapes behind the structure law."
 *
 * WHY THIS IS A MEASUREMENT BEFORE IT IS A COOK, and the reasoning is on the record so
 * the next session can disagree with it on purpose rather than by accident:
 *   - COOK owns cooking. Its [runway clothes] WARDROBE-REMAKE shipped batches 1 to 6 with
 *     22 new SHAPES, and this lane's own STATE line says "This lane WIRES what COOK
 *     cooks". Adding garments on top of six fresh batches without checking whether the
 *     wardrobe is short is producing for its own sake, which STOP PRODUCING (7/26) names
 *     as the failure, not the work.
 *   - The wire is not the question either: wardrobe_wired_gate is 15/15, every canon
 *     garment is worn by somebody over 4000 citizens and reachable on a bench.
 * SO THE OPEN QUESTION IS THE ONE NOBODY HAS ASKED: with everything wired and everything
 * worn, HOW MANY GENUINELY DIFFERENT PEOPLE CAN THE PICKER ACTUALLY MAKE? "Volume" in a
 * wardrobe is not the size of the rail. It is how far you can walk before you meet
 * somebody wearing your outfit.
 *
 * THREE THINGS IT MEASURES, and each one names a different repair:
 *   Q1 REPEATS. Over a crowd, how often does an outfit come back? Reported as the
 *      distinct-outfit count and, more usefully, as THE FIRST COLLISION -- how many
 *      people you can see before two of them match. A number a player would feel.
 *   Q2 WHERE THE WARDROBE IS THIN, per layer. A category with three shapes behind a high
 *      wear chance is a uniform; one with forty behind a 12% chance is almost never seen.
 *      Both are volume problems and they need opposite fixes, so they are told apart:
 *      SHAPES OFFERED against TIMES ACTUALLY WORN in the sample.
 *   Q3 WHAT A CROWD LOOKS LIKE FROM ACROSS THE STREET. Two outfits that differ only in a
 *      hat nobody can see at 56px are one outfit to a player. So the SILHOUETTE is hashed
 *      too -- the body's painted shape with colour discarded -- and counted separately.
 *      A wardrobe can be rich on paper and uniform on the street.
 *
 * IT ASKS THE REAL PICKER, NOT A MODEL OF IT: BOH_PERSONLOOK.lookFor is the function the
 * game dresses everybody with, and the garment pool is read live off GARMENTS. Nothing
 * here re-implements the odds table; a copy of it would drift the day somebody tunes it.
 *
 * RIG CHECK (RIG IS LAW, 7/26): reads and reports. Never touches BAKED, a joint, a bone
 * or a painted pixel; restores G_WORN, G.equipped and the caches it clears.
 *
 *   node tools/bohemia_does_the_crowd_repeat.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = process.env.ALPHA || path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'records/BOHEMIA_DOES_THE_CROWD_REPEAT_9_11_26.txt');
const N = +(process.env.N || 3000);
const SIL = +(process.env.SIL || 300);

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 500, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 150)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS && window.BOH_PERSONLOOK,
    { timeout: 60000 });

  const r = await p.evaluate(({ N, SIL }) => {
    const canon = GARMENTS.filter(g => g && g.st === 'canon' && g.layer);
    const offered = {};
    for (const g of canon) offered[g.layer] = (offered[g.layer] || 0) + 1;

    /* Q1 + Q2: ask the real picker for a crowd. */
    const seen = new Map();          /* outfit key -> first index that wore it */
    const worn = {};                 /* layer -> { garment -> times } */
    let firstCollision = null, repeats = 0;
    const people = [];
    for (let i = 0; i < N; i++) {
      const look = BOH_PERSONLOOK.lookFor('crowd:' + i, GARMENTS);
      const w = (look && look.worn) || {};
      const keys = Object.keys(w).sort();
      const key = keys.map(k => k + '=' + w[k]).join('|');
      for (const k of keys) {
        (worn[k] = worn[k] || {});
        worn[k][w[k]] = (worn[k][w[k]] || 0) + 1;
      }
      if (seen.has(key)) { repeats++; if (firstCollision === null) firstCollision = i + 1; }
      else seen.set(key, i);
      if (i < SIL) people.push({ id: 'crowd:' + i, worn: w });
    }

    /* Q3: THE SILHOUETTE, which is what a player actually sees from across a street.
       The painted shape with colour thrown away -- two outfits that differ only in tone
       are one outfit at this distance, and that is the point of asking. */
    const keepW = window.G_WORN, keepE = G.equipped;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const sil = new Map(), lookAlike = new Map();
    let silErr = 0;
    for (const person of people) {
      const eq = {}; for (const k in keepE) eq[k] = keepE[k];
      for (const s of ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes']) eq[s] = '';
      G.equipped = eq; window.G_WORN = person.worn; clear();
      let fr; try { fr = buildFrame('S', 'idle', 0); } catch (e) { silErr++; continue; }
      let h = 2166136261 >>> 0, h2 = 2166136261 >>> 0;
      for (let i = 0; i < fr.px.length; i++) {
        const c = fr.px[i];
        if (c) { h ^= i; h = Math.imul(h, 16777619) >>> 0; }          /* shape only */
        if (c) { h2 ^= (i ^ (c[0] << 16 ^ c[1] << 8 ^ c[2])); h2 = Math.imul(h2, 16777619) >>> 0; }
      }
      const ks = h.toString(36);
      sil.set(ks, (sil.get(ks) || 0) + 1);
      const kc = h2.toString(36);
      lookAlike.set(kc, (lookAlike.get(kc) || 0) + 1);
    }
    window.G_WORN = keepW; G.equipped = keepE; clear();

    return { canon: canon.length, offered: offered, distinct: seen.size, repeats: repeats,
             firstCollision: firstCollision, worn: worn, N: N,
             silN: people.length - silErr,
             silDistinct: sil.size, silTop: Math.max(0, ...sil.values()),
             fullDistinct: lookAlike.size, fullTop: Math.max(0, ...lookAlike.values()) };
  }, { N, SIL });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 2).join(' | '));

  const L = [];
  L.push('DOES THE CROWD REPEAT? -- how many genuinely different people the wardrobe can');
  L.push('actually make, asked of the real picker');
  L.push('9/11/26, CHARACTER lane. VAMILY [more clothes] WARDROBE-VOLUME.');
  L.push('');
  L.push('WHY A MEASUREMENT AND NOT A COOK. COOK owns cooking and its WARDROBE-REMAKE just');
  L.push('shipped batches 1-6 with 22 new shapes; this lane\'s job is to make them WORN, and');
  L.push('the wire is already green (every canon garment worn by somebody over 4000');
  L.push('citizens, all reachable on a bench). Adding garments on top of six fresh batches');
  L.push('without checking whether the wardrobe is short is producing for its own sake.');
  L.push('VOLUME IS NOT THE SIZE OF THE RAIL. It is how far you walk before you meet');
  L.push('somebody wearing your outfit.');
  L.push('');
  L.push('  canon garments on the rail      ' + r.canon);
  L.push('  people asked of the picker      ' + r.N);
  L.push('');
  L.push('Q1. HOW OFTEN DOES AN OUTFIT COME BACK?');
  L.push('');
  L.push('  different outfits in ' + r.N + '        ' + r.distinct +
    '   (' + (r.distinct / r.N * 100).toFixed(1) + '%)');
  L.push('  people wearing a repeat          ' + r.repeats);
  L.push('  FIRST TIME TWO PEOPLE MATCHED    ' +
    (r.firstCollision === null ? 'never, in ' + r.N : 'person ' + r.firstCollision));
  L.push('');
  L.push('  The last line is the one a player would feel: it is how many people can walk');
  L.push('  past before two of them are wearing the same thing.');
  L.push('');
  L.push('Q2. WHERE IS THE WARDROBE THIN? (shapes offered against times actually worn)');
  L.push('');
  L.push('  ' + 'layer'.padEnd(10) + 'offered'.padStart(9) + 'used'.padStart(7) +
    'worn'.padStart(9) + '   share of the crowd');
  const layers = Object.keys(r.offered).sort((a, c) =>
    (r.offered[c] || 0) - (r.offered[a] || 0));
  for (const lay of layers) {
    const w = r.worn[lay] || {};
    const used = Object.keys(w).length;
    const times = Object.values(w).reduce((a, c) => a + c, 0);
    L.push('  ' + lay.padEnd(10) + String(r.offered[lay]).padStart(9) + String(used).padStart(7) +
      String(times).padStart(9) + '   ' + (times / r.N * 100).toFixed(1) + '%');
  }
  L.push('');
  L.push('  READ BOTH COLUMNS TOGETHER OR NEITHER. A layer with three shapes behind a high');
  L.push('  wear chance is a UNIFORM -- everybody has one and there are only three. A layer');
  L.push('  with forty shapes behind a 12% chance is a wardrobe nobody sees. Those are');
  L.push('  opposite problems and cooking is only the answer to the first.');
  L.push('');
  L.push('Q3. AND WHAT DOES IT LOOK LIKE FROM ACROSS THE STREET?');
  L.push('');
  L.push('  Two outfits that differ only in a hat nobody can make out at 56 px are ONE');
  L.push('  outfit to a player. So the body is rendered and hashed two ways: by SHAPE alone');
  L.push('  (colour thrown away) and by shape AND colour.');
  L.push('');
  L.push('  bodies rendered                 ' + r.silN);
  L.push('  different SILHOUETTES            ' + r.silDistinct +
    '   (' + (r.silDistinct / Math.max(1, r.silN) * 100).toFixed(1) + '%)');
  L.push('  the commonest silhouette worn by ' + r.silTop + ' of them');
  L.push('  different once colour counts     ' + r.fullDistinct +
    '   (' + (r.fullDistinct / Math.max(1, r.silN) * 100).toFixed(1) + '%)');
  L.push('  the commonest whole look worn by ' + r.fullTop + ' of them');
  L.push('');
  L.push('  A WARDROBE CAN BE RICH ON PAPER AND A UNIFORM ON THE STREET. If the outfit');
  L.push('  count is high and the silhouette count is low, the rail is not short -- the');
  L.push('  SHAPES are, and that is what "behind the structure law" means: progress is new');
  L.push('  SHAPES, never recolours (STRUCTURE-NOT-COLOR, 7/19).');
  L.push('');
  L.push('READ THIS BEFORE DRAWING A CONCLUSION. A NUMBER IS NOT A FINDING UNTIL YOU KNOW');
  L.push('WHAT IT IS COUNTING. These are counts of what the PICKER produces, which is the');
  L.push('honest question for this lane; whether any single garment is good art is DIRECTION');
  L.push('judging COOK against the card, and nothing here touches that.');
  L.push('');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nWROTE ' + path.relative(REPO, OUT));
})();
