/* THE FOUR THAT DO NOT WEAR HIS COLOUR (9/12/26, CHARACTER lane,
 * VAMILY [one colour table] round 2)
 *
 * Round 1 measured the gap between the colour Paolo CHOSE per faction (the alpha's own
 * MFACTIONS table, his answer, given twice) and the colour the built outfit actually
 * RENDERS. It reported five misses. This round fixes what can be fixed and proves the
 * silhouettes did not move -- and corrects one of those five.
 *
 * *** FIRST, A CORRECTION TO ROUND 1: COLORFUL WAS NEVER A MISS. ***
 * I measured a faction that deliberately wears FIVE colours against ONE hue. The alpha's
 * own entry says it in its first sentence: "THE ONLY FACTION THAT REFUSES A SINGLE FLAG.
 * Everybody else in the valley picks one colour so you know at fifty yards who would
 * defend them. These wear five, which is its own answer to the same question."
 * So the dominant-hue ruler is the wrong instrument for exactly one faction in the game,
 * and I pointed it at them and wrote down the reading. FIVE MISSES IS FOUR.
 * That is the fifth ruler this lane has thrown away in two rounds and it is the same
 * shape as the other four: THE INSTRUMENT COULD NOT REPRESENT THE THING.
 *
 * WHY EACH OF THE FOUR MISSES, measured off the wardrobe bank rather than guessed:
 *   NETWORK    he chose teal #1fbf9c. The outfit's base is STEEL WORK SHIRT #4c5a6a, a
 *              slate. TEAL WORK SHIRT #28bea0 already exists, same layer, same shirt, ONE
 *              DEGREE off his teal. Nobody ever wired it. Pure wiring.
 *   MOB        he chose gold #caa83a and the outfit ALREADY WEARS IT -- MOB PINSTRIPE
 *              SHIRT #b08a2a, 3 degrees off, saturation 0.61. It loses the vote: ROAD CAPE,
 *              ANKLE WRAP SKIRT and OXBLOOD BOOTS are three oxblood pieces at saturation
 *              0.33-0.37, which is not dun, so the body wears two colours and the bigger
 *              area wins. The style card allows ONE saturated piece and lists dust, ash,
 *              bone and lead as the rest. Neutral variants of all three already exist
 *              (CHARCOAL ROAD CAPE, CHARCOAL WRAP SKIRT, CHARCOAL BOOTS). Pure wiring, and
 *              it serves the style card and his colour with the same change.
 *   TRADES     he chose orange #d07a2a. The outfit's base is COPPER WORK SHIRT, and
 *              COPPER WORK SHIRT IS #506e60, WHICH IS GREEN. A garment named copper that
 *              renders green, worn by the faction whose colour is copper-orange. That is
 *              why Trades measured 121 degrees off.
 *   ANARCHISTS he chose magenta #c026a0. THE WARDROBE CONTAINS ZERO GARMENTS IN THAT
 *              FAMILY -- 317 canon garments, none within 30 degrees of his magenta at any
 *              usable saturation. Nothing to wire. This one is a cook and cannot be
 *              anything else.
 *
 * WHAT THIS TOOL PROVES, because a colour fix that moves a silhouette is a worse bug than
 * the one it fixes (STRUCTURE-NOT-COLOR, and the 880-fit silhouette set behind these
 * thirteen): it renders all thirteen faction looks, hashes each body's FOOTPRINT with
 * colour discarded, and compares against the baseline. The shapes must be byte-identical.
 * The precedent is the Colorful fix already in the alpha: "THE SHAPE IS UNTOUCHED. Every
 * garment below is the same generator with the same options as the bone one it replaces
 * ... Only the ramps moved, which is the half of identity his 8/26 ruling adds."
 *
 * RIG CHECK (RIG IS LAW): reads only; no joint, bone or BAKED value touched.
 * REUSE CHECK: cooks ZERO pixels. Every garment named here already ships.
 *
 *   node tools/bohemia_the_four_that_do_not_wear_his_colour.js          measure
 *   node tools/bohemia_the_four_that_do_not_wear_his_colour.js --save   write the baseline
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const BASE = path.join(REPO, 'records/BOHEMIA_FACTION_SILHOUETTES_BASELINE_9_12_26.json');
const OUT = path.join(REPO, 'records/BOHEMIA_THE_FOUR_THAT_DO_NOT_WEAR_HIS_COLOUR_9_12_26.txt');
const SAVE = process.argv.indexOf('--save') > 0;

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS, { timeout: 30000 });

  const R = await p.evaluate(() => {
    /* THE SHAPE, WITH COLOUR DISCARDED AND POSITION REMOVED. Round 1 of [more clothes]
       learned this the hard way: hashing raw pixel indices measures WHERE a thing sits,
       not what shape it is, so every footprint is translated to its own bounding box
       before it is hashed. */
    const shapeOf = (f) => {
      const on = [];
      let minx = 1e9, miny = 1e9;
      for (let i = 0; i < f.px.length; i++) {
        if (!f.px[i]) continue;
        const x = i % f.CW, y = (i / f.CW) | 0;
        on.push([x, y]); if (x < minx) minx = x; if (y < miny) miny = y;
      }
      let h = 2166136261;
      for (const [x, y] of on) {
        const v = ((x - minx) << 12) ^ (y - miny);
        h ^= v; h = Math.imul(h, 16777619);
      }
      return { hash: (h >>> 0).toString(16), px: on.length };
    };
    /* THE HUE OF THE CLOTH AS DRAWN. Grey does not vote -- a correctly dressed body is
       mostly dun by the style card, so counting it would elect "no colour" every time.
       *** THIRTY-DEGREE BUCKETS, AND THE FIRST CUT OF THIS USED FIVE, WHICH ANSWERED A
       DIFFERENT QUESTION AND CONTRADICTED THE PUBLISHED FILE. *** On MOB the two readers
       disagreed by 42 degrees: one gold shirt at hue 43, saturation 0.61, against THREE
       oxblood pieces spread over hues 7-8. Five-degree bins elect the shirt, because its
       hue is concentrated in one bin and the oxblood is split across two. Thirty-degree
       bins elect the oxblood, because there is more of it.
       BOTH ARE TRUE AND ONLY ONE ANSWERS THE LAW. COLOUR IS TERRITORY is about what you
       read across a street -- "people get shot in Los Angeles for wearing the wrong color"
       -- and across a street you read AREA, not the modal exact hue. So this uses the same
       thirty-degree buckets the published colour file uses, which also makes every number
       here comparable to that file instead of quietly incomparable.
       I had this backwards for one run and it told me MOB was already fine. It is not. */
    const hueOf = (f) => {
      const B5 = new Array(72).fill(0); let col = 0, tot = 0;
      for (let i = 0; i < f.px.length; i++) {
        const q = f.px[i]; if (!q) continue;
        const g = f.grid[i]; if (g === 1 || g === 2) continue;      /* skin and face */
        const R = q[0], G = q[1], B = q[2];
        tot++;
        const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
        if ((mx ? (mx - mn) / mx : 0) < 0.25 || mx < 40) continue;
        col++;
        let h;
        if (mx === mn) h = 0;
        else if (mx === R) h = 60 * (((G - B) / (mx - mn)) % 6);
        else if (mx === G) h = 60 * (((B - R) / (mx - mn)) + 2);
        else h = 60 * (((R - G) / (mx - mn)) + 4);
        if (h < 0) h += 360;
        B5[Math.round(h / 30) % 12]++;
      }
      let bi = 0; for (let i = 1; i < 12; i++) if (B5[i] > B5[bi]) bi = i;
      return { hue: B5[bi] ? (bi * 30) % 360 : null, coloured: tot ? col / tot : 0,
               share: col ? B5[bi] / col : 0 };
    };
    const PD = ['shirt', 'jacket', 'pants', 'shoes', 'hat', 'glasses', 'hair'];
    const kW = window.G_WORN, kD = G.bodyVar, kA = G.age, kE = {};
    PD.forEach(s => { if (s in G.equipped) { kE[s] = G.equipped[s]; G.equipped[s] = ''; } });
    const out = {};
    try {
      for (const L of window.FACTION_LOOKS) {
        window.G_WORN = L.worn; G.bodyVar = L.dials; G.age = L.age || 'adult';
        rebuildFromRig();
        const f = buildFrame('S', 'idle', 0.25, true);
        out[L.faction] = Object.assign(shapeOf(f), hueOf(f));
      }
    } finally {
      window.G_WORN = kW; G.bodyVar = kD; G.age = kA;
      for (const s in kE) G.equipped[s] = kE[s];
      try { rebuildFromRig(); } catch (e) {}
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    }
    return out;
  });
  await b.close();

  if (SAVE) {
    fs.writeFileSync(BASE, JSON.stringify(R, null, 1));
    console.log('baseline written: ' + Object.keys(R).length + ' faction silhouettes');
    return;
  }

  /* his chosen colours, read live out of the alpha and never retyped */
  const src = fs.readFileSync(ALPHA, 'utf8');
  const mf = src.slice(src.indexOf('const MFACTIONS=['));
  const HIS = {};
  for (const chunk of mf.slice(0, mf.indexOf('\n];')).split(/\n\s*\{n:'/).slice(1)) {
    const n = chunk.match(/^([A-Z ]+)'/), a = chunk.match(/acc:'(#[0-9a-fA-F]{6})'/);
    if (n && a) HIS[n[1]] = a[1];
  }
  const hueHex = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    const R = (n >> 16) & 255, G = (n >> 8) & 255, B = n & 255;
    const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
    if (mx === mn) return null;
    let h;
    if (mx === R) h = 60 * (((G - B) / (mx - mn)) % 6);
    else if (mx === G) h = 60 * (((B - R) / (mx - mn)) + 2);
    else h = 60 * (((R - G) / (mx - mn)) + 4);
    return (h + 360) % 360;
  };
  const dH = (a, b) => { const d = Math.abs(((a - b) % 360 + 360) % 360); return d > 180 ? 360 - d : d; };
  const NEAR = 30;
  /* THE ONE FACTION THIS RULER CANNOT MEASURE, named rather than quietly skipped. */
  const REFUSES_ONE_FLAG = 'Colorful';
  const DRAB = ['Volunteers', 'Homeless', 'Cartel'];

  const old = fs.existsSync(BASE) ? JSON.parse(fs.readFileSync(BASE, 'utf8')) : null;
  const L = [];
  L.push('THE FOUR THAT DO NOT WEAR HIS COLOUR -- CHARACTER lane, 9/12/26');
  L.push('VAMILY row [one colour table], round 2');
  L.push('');
  L.push('*** A CORRECTION TO ROUND 1 FIRST: COLORFUL WAS NEVER A MISS. ***');
  L.push('I measured a faction that deliberately wears FIVE colours against ONE hue. The');
  L.push('alpha\'s own entry says so in its first sentence: "THE ONLY FACTION THAT REFUSES A');
  L.push('SINGLE FLAG ... These wear five, which is its own answer to the same question."');
  L.push('The dominant-hue ruler is the wrong instrument for exactly one faction in this');
  L.push('game and I pointed it at them. FIVE MISSES IS FOUR.');
  L.push('');
  L.push('FACTION       HE CHOSE     HIS HUE   WORN HUE    GAP  WEARS IT?   SHAPE');
  let hit = 0, n = 0;
  const moved = [];
  for (const f of Object.keys(R)) {
    const key = f.toUpperCase(), his = HIS[key], r = R[f];
    const hh = his ? hueHex(his) : null;
    const gap = (hh == null || r.hue == null) ? null : dH(hh, r.hue);
    let verdict;
    if (f === REFUSES_ONE_FLAG) verdict = 'n/a (five)';
    else if (DRAB.indexOf(f) >= 0 || r.coloured < 0.35) verdict = 'drab';
    else { n++; if (gap != null && gap <= NEAR) { verdict = 'YES'; hit++; } else verdict = 'NO'; }
    let shape = 'no baseline';
    if (old && old[f]) {
      shape = old[f].hash === r.hash ? 'same' : 'MOVED';
      if (shape === 'MOVED') moved.push(f + ' ' + old[f].px + 'px -> ' + r.px + 'px');
    }
    L.push(f.padEnd(12) + String(his || '-').padEnd(10)
      + String(hh == null ? '-' : hh.toFixed(0)).padStart(8)
      + String(r.hue == null ? '-' : r.hue).padStart(11)
      + String(gap == null ? '-' : gap.toFixed(0)).padStart(7)
      + verdict.padStart(12) + shape.padStart(13));
  }
  L.push('');
  L.push('WEARS THE COLOUR HE CHOSE: ' + hit + ' of ' + n
    + ' (Colorful is excluded by design, the drab ones by the law).');
  L.push('');
  L.push('*** AND THE SILHOUETTES DID NOT MOVE: ' + (moved.length ? 'THEY DID -- ' + moved.join('; ')
    : 'all ' + Object.keys(R).length + ' byte-identical to the baseline') + ' ***');
  L.push('A colour fix that moves a silhouette is a worse bug than the one it fixes');
  L.push('(STRUCTURE-NOT-COLOR, and the 880-fit silhouette set behind these thirteen). Every');
  L.push('swap here is the same garment generator with a different ramp -- the precedent the');
  L.push('Colorful fix set in the alpha: "THE SHAPE IS UNTOUCHED ... Only the ramps moved."');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
})();
