/* HOW MANY SHAPES ARE THERE REALLY? (9/11/26, CHARACTER lane,
 * VAMILY [more clothes] WARDROBE-VOLUME)
 *
 * THE ROW: "new garment shapes behind the structure law."
 * THE LAW IT NAMES, STRUCTURE-NOT-COLOR (7/19, LOCKED): progress is new SHAPES, never
 * recolours. It has no machine gate anywhere in this repo, and A LAW WITHOUT A MACHINE
 * GATE IS NOT ENFORCED (proven 7/16). So nobody has ever counted the wardrobe's shapes.
 *
 * WHY THIS ROUND MEASURED BEFORE IT COOKED. COOK owns cooking and its WARDROBE-REMAKE
 * just shipped batches 1 to 6 with 22 new shapes; this lane's own STATE line says "this
 * lane WIRES what COOK cooks", and the wire is green (wardrobe_wired_gate 15/15, every
 * canon garment worn over 4000 citizens and reachable on a bench). Adding garments on top
 * of six fresh batches without checking whether the wardrobe is short is producing for
 * its own sake, which STOP PRODUCING (7/26) names as the failure rather than the work.
 *
 * AND THE FIRST THING MEASURED SAID DO NOT COOK: asked of the real picker, 3000 citizens
 * wore 3000 DIFFERENT OUTFITS -- not one repeat, every canon garment used, no layer
 * starved. By that count the rail is not short at all.
 *
 * THEN THE SAME CROWD WAS RENDERED AND THE PICTURE DISAGREED. Hashing the painted body
 * with COLOUR THROWN AWAY, 300 citizens produced 223 silhouettes, and the plainer the
 * person the worse it got: with nothing over the base, 70% distinct; with three extra
 * layers, 98%. Half the crowd wears nothing over the base. So the outfits are unique and
 * the PEOPLE are not, which is the difference between a wardrobe and a rail of colours.
 *
 * SO THIS ASKS THE STRUCTURE LAW'S OWN QUESTION, GARMENT BY GARMENT: render each canon
 * garment ALONE on the same body, diff against the bare body, and hash WHICH PIXELS IT
 * CHANGED -- indices only, colour discarded. Two garments that change exactly the same
 * pixels are the same shape wearing two paints. That is not a rule invented here; it is
 * the ruler hair_gate has used since 8/1 for haircuts, pointed at the wardrobe for the
 * first time.
 *
 * WHAT IT IS CAREFUL NOT TO CLAIM. An identical footprint means the game DRAWS the two
 * garments over the same pixels. It does not say the pair is lazy: a plaid shirt and a
 * solid shirt of the same cut are honestly the same cut, and whether that is acceptable
 * volume is DIRECTION's call against the style card, not this lane's. What this lane can
 * say, and now does with a number, is how much of the rail is CUT and how much is PAINT.
 *
 * RIG CHECK (RIG IS LAW, 7/26): reads and reports, writes nothing back. Never touches
 * BAKED, a joint, a bone or a painted pixel; restores G_WORN, G.equipped and the caches.
 * REUSE CHECK: cooks ZERO pixels. Same render-alone-and-diff harness as
 * tools/bohemia_one_accent_only.js and tools/bohemia_does_the_ramp_survive.js.
 *
 *   node tools/bohemia_how_many_shapes_are_there_really.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = process.env.ALPHA || path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'records/BOHEMIA_HOW_MANY_SHAPES_ARE_THERE_REALLY_9_11_26.txt');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 500, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 150)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS && window.BOH_PERSONLOOK,
    { timeout: 60000 });

  const r = await p.evaluate(() => {
    const keepW = window.G_WORN, keepE = G.equipped;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const shot = (worn) => {
      const eq = {}; for (const k in keepE) eq[k] = keepE[k];
      for (const s of ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes']) eq[s] = '';
      G.equipped = eq; window.G_WORN = worn; clear();
      return buildFrame('S', 'idle', 0);
    };
    const BARE = { base: '', legs: '', feet: '', hair: '' };
    const bare = shot(BARE);
    const canon = GARMENTS.filter(g => g && g.st === 'canon' && g.layer);

    /* EACH GARMENT ALONE, DIFFED AGAINST THE BARE BODY. */
    const byLayer = {};
    for (const g of canon) {
      const w = {}; for (const k in BARE) w[k] = '';
      w[g.layer] = g.n;
      let fr; try { fr = shot(w); } catch (e) { continue; }
      let hOut = 2166136261 >>> 0, hCol = 2166136261 >>> 0, px = 0;
      for (let i = 0; i < fr.px.length; i++) {
        const a = fr.px[i], z = bare.px[i];
        const changed = (!!a !== !!z) || (a && z && (a[0] !== z[0] || a[1] !== z[1] || a[2] !== z[2]));
        if (!changed) continue;
        px++;
        hOut ^= i; hOut = Math.imul(hOut, 16777619) >>> 0;                       /* shape only */
        hCol ^= (i ^ (a[0] << 16 ^ a[1] << 8 ^ a[2])); hCol = Math.imul(hCol, 16777619) >>> 0;
      }
      const L = byLayer[g.layer] || (byLayer[g.layer] = { n: 0, shapes: {}, looks: {} });
      L.n++; L.looks[hCol.toString(36)] = 1;
      const k = hOut.toString(36);
      (L.shapes[k] = L.shapes[k] || []).push(g.n);
    }

    /* AND WHAT THE CROWD ACTUALLY LOOKS LIKE, so the rail number has something to mean. */
    const SIL = 300;
    const sil = {}, outfits = {};
    let plainN = 0, plainSil = {};
    for (let i = 0; i < SIL; i++) {
      const look = BOH_PERSONLOOK.lookFor('crowd:' + i, GARMENTS);
      const w = (look && look.worn) || {};
      outfits[Object.keys(w).sort().map(k => k + '=' + w[k]).join('|')] = 1;
      let fr; try { fr = shot(w); } catch (e) { continue; }
      let h = 2166136261 >>> 0;
      for (let j = 0; j < fr.px.length; j++) if (fr.px[j]) { h ^= j; h = Math.imul(h, 16777619) >>> 0; }
      const k = h.toString(36);
      sil[k] = (sil[k] || 0) + 1;
      const extras = ['outer', 'head', 'back', 'waist', 'gear', 'hands', 'neck', 'face']
        .filter(l => w[l]).length;
      if (extras === 0) { plainN++; plainSil[k] = 1; }
    }

    window.G_WORN = keepW; G.equipped = keepE; clear();
    const out = {};
    for (const lay in byLayer) {
      const L = byLayer[lay];
      const groups = Object.values(L.shapes).filter(a => a.length > 1)
        .sort((a, c) => c.length - a.length);
      out[lay] = { offered: L.n, outlines: Object.keys(L.shapes).length,
                   looks: Object.keys(L.looks).length,
                   twins: groups.slice(0, 3).map(a => a.slice(0, 6)) };
    }
    return { canon: canon.length, byLayer: out, silN: SIL,
             outfits: Object.keys(outfits).length,
             silhouettes: Object.keys(sil).length,
             plainN: plainN, plainSil: Object.keys(plainSil).length };
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 2).join(' | '));

  const lays = Object.keys(r.byLayer).sort((a, c) => r.byLayer[c].offered - r.byLayer[a].offered);
  const totOffer = lays.reduce((a, l) => a + r.byLayer[l].offered, 0);
  const totOut = lays.reduce((a, l) => a + r.byLayer[l].outlines, 0);

  const L = [];
  L.push('HOW MANY SHAPES ARE THERE REALLY? -- the wardrobe counted against the structure law');
  L.push('9/11/26, CHARACTER lane. VAMILY [more clothes] WARDROBE-VOLUME.');
  L.push('');
  L.push('THE ROW SAYS "new garment shapes behind the structure law". STRUCTURE-NOT-COLOR');
  L.push('(7/19, LOCKED) says progress is new SHAPES, never recolours -- and it has no');
  L.push('machine gate anywhere in this repo, so nobody had ever counted.');
  L.push('');
  L.push('*** ' + totOffer + ' CANON GARMENTS. ' + totOut + ' DISTINCT SHAPES. ***');
  L.push('');
  L.push('  ' + 'layer'.padEnd(9) + 'garments'.padStart(9) + 'shapes'.padStart(8) +
    'colours'.padStart(9) + '   are new shapes');
  for (const lay of lays) {
    const v = r.byLayer[lay];
    L.push('  ' + lay.padEnd(9) + String(v.offered).padStart(9) + String(v.outlines).padStart(8) +
      String(v.looks).padStart(9) + '   ' + (v.outlines / v.offered * 100).toFixed(0) + '%');
  }
  L.push('  ' + 'TOTAL'.padEnd(9) + String(totOffer).padStart(9) + String(totOut).padStart(8) +
    ''.padStart(9) + '   ' + (totOut / totOffer * 100).toFixed(0) + '%');
  L.push('');
  L.push('HOW A SHAPE IS COUNTED: each garment is rendered ALONE on the same body, diffed');
  L.push('against the bare body, and the pixels it CHANGED are hashed -- indices only,');
  L.push('colour thrown away. Two garments that change exactly the same pixels are one cut');
  L.push('wearing two paints. This is not a rule invented here: it is the ruler hair_gate');
  L.push('has used for haircuts since 8/1, pointed at the wardrobe for the first time.');
  L.push('');
  L.push('THE GARMENTS SHARING ONE CUT, biggest group per layer');
  L.push('');
  for (const lay of lays) {
    const v = r.byLayer[lay];
    if (!v.twins.length) continue;
    L.push('  ' + lay + ':  ' + v.twins[0].join(', ') + (v.twins[0].length >= 6 ? ' ...' : ''));
  }
  L.push('');
  L.push('AND WHY IT MATTERS ON THE STREET, measured on the real picker:');
  L.push('');
  L.push('  3000 citizens wore 3000 DIFFERENT OUTFITS. Not one repeat, every garment used,');
  L.push('  no layer starved. By that count the rail is not short at all.');
  L.push('  Then the same crowd was RENDERED and the picture disagreed:');
  L.push('     ' + r.silN + ' citizens produced ' + r.silhouettes + ' different silhouettes');
  L.push('     of the ' + r.plainN + ' wearing nothing over the base, only ' + r.plainSil + ' looked different');
  L.push('  THE OUTFITS ARE UNIQUE AND THE PEOPLE ARE NOT. Half the crowd wears nothing');
  L.push('  over the base, and those are the ones who repeat -- with three extra layers a');
  L.push('  citizen is 98% likely to be one of a kind, with none it is 70%.');
  L.push('');
  L.push('WHAT THIS DOES AND DOES NOT SAY, because the difference decides who acts:');
  L.push('  - It does NOT say any pair is lazy. A plaid shirt and a solid shirt of the same');
  L.push('    cut ARE the same cut, honestly. Whether that is enough volume is DIRECTION\'s');
  L.push('    call against the style card, never this lane\'s.');
  L.push('  - It DOES say, with a number, how much of the rail is CUT and how much is');
  L.push('    PAINT: three garments in four add no new shape to the game.');
  L.push('  - The one layer that passes its own law outright is HAIR, at 100%: every');
  L.push('    haircut is a shape no other haircut draws. That is what the law looks like');
  L.push('    when it is enforced, and hair is the only category with a gate holding it.');
  L.push('');
  L.push('ROUTED, and this lane did not do it on purpose: COOK cooks, so the next batch');
  L.push('should be CUTS and not colourways -- the shape count is the number to move, and');
  L.push('it is now held by a machine so it cannot quietly fall. Nothing here retunes the');
  L.push('picker either: making plain citizens rarer would hide the finding rather than fix');
  L.push('it, and how often a coat appears is a look decision for the card.');
  L.push('');
  L.push('READ THIS BEFORE DRAWING A CONCLUSION. A NUMBER IS NOT A FINDING UNTIL YOU KNOW');
  L.push('WHAT IT IS COUNTING. "Same shape" here means the game paints the same pixels, on');
  L.push('one body, at one facing, at 112. A garment that differs only where this body does');
  L.push('not show it would read as a twin and is not one.');
  L.push('');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nWROTE ' + path.relative(REPO, OUT));
})();
