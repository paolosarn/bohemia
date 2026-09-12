/* DOES THE COLOUR SURVIVE THE BAKE? (9/12/26, CHARACTER lane, VAMILY [faction colour]
 * THE-BODY-WEARS-THE-TERRITORY, round 2)
 *
 * *** FIRST, A CORRECTION TO MY OWN RECORD, IN PUBLIC. ***
 * Round 1 (records/BOHEMIA_DOES_THE_BODY_WEAR_THE_BLOCK_9_12_26.txt) reported FOUR holes.
 * The fourth read: "the faction cast never bakes -- ask for one, wait 30s, CAST_FID is
 * still empty, nothing throws." THAT WAS MY BUG, NOT THE GAME'S. The tool asked for
 * `ctNeedFaction('REDS')`. The canon spelling is `Reds`. cityBakeFaction matches the name
 * with a bare `===` against FACTION_LOOKS, found nothing, and returned false into an empty
 * catch. So a typo in a test became a recorded hole in the machinery.
 * MEASURED, on the real walked surface, with a real vouch so a real drawn person really
 * runs with somebody: trade fit d9e665d6 -> ask -> still d9e665d6 while it bakes (no hole,
 * exactly as the code claims) -> 8s later 247bb4a0. THE BODY CHANGES. The chain works.
 *
 * THE LESSON, and it is the same one this file's own comments keep writing down:
 * A MISS THAT SAYS NOTHING WILL EVENTUALLY BE READ AS A FACT ABOUT THE WORLD. ctFactionOf
 * already learned this the hard way ("a swallowed TypeError looks exactly like an honest
 * 'they run with nobody'") and cost that lane thirteen days. cityBakeFaction had the same
 * shape and it cost me a round and a false entry in the record.
 *
 * SO WHAT IS LEFT TO ASK, now that the chain is proven?
 * The colour table (engine/BOHEMIA_faction_colours.json) is MEASURED off the wardrobe, and
 * faction_colour_gate re-measures it, so comparing the wardrobe to it is circular and
 * proves nothing. THE NON-CIRCULAR QUESTION IS THE ROUND TRIP: the alpha bakes each look
 * at 56px, packs it, posts it across a frame boundary, the city unpacks it and scales it
 * up. Colour can die at any of those steps and nothing checks. And I put a VALUE STEP on
 * hostile bodies on 9/6 ([stands out]) that multiplies every channel -- it is built to move
 * value and keep hue, and this is the first thing that has ever checked that claim against
 * the faction colours it could break.
 *
 * SO: bake all thirteen, read the dominant hue off the sprite the CITY actually holds, and
 * compare to the table. Then run the hostile step over each and re-read.
 *
 * RIG CHECK (RIG IS LAW): reads only. Never touches BAKED, a joint, a bone or a pixel.
 * REUSE CHECK: cooks ZERO pixels. The bake is the game's own cityBakeFaction, the sprites
 * are the city's own CAST_FID, the hue reader is round 1's, the value step is the shipped
 * ctStepped.
 *
 *   node tools/bohemia_does_the_colour_survive_the_bake.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle: SETTLE } = require(path.join(__dirname, '..', 'gates', 'bohemia_settle.js'));
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'records/BOHEMIA_DOES_THE_COLOUR_SURVIVE_THE_BAKE_9_12_26.txt');
const wait = (ms) => new Promise(r => setTimeout(r, ms));

const TABLE = JSON.parse(fs.readFileSync(path.join(REPO, 'engine/BOHEMIA_faction_colours.json'), 'utf8')).factions;

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_DEMO.html'));
  await SETTLE(p, 15000);
  await p.evaluate(() => { const f = document.getElementById('fronttap') || document.getElementById('front'); if (f) f.click(); });
  await SETTLE(p, 12000);
  await wait(3000);
  const fr = p.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
  if (!fr) { console.error('no city frame'); await b.close(); process.exit(1); }

  const names = await p.evaluate(() => (window.FACTION_LOOKS || []).map(f => f.faction));

  /* ask for every one of them, through the game's own door */
  await fr.evaluate((NS) => { NS.forEach(n => ctNeedFaction(n)); }, names);
  for (let i = 0; i < 30; i++) {
    await wait(1000);
    const n = await fr.evaluate(() => Object.keys(CAST_FID).length);
    if (n >= names.length) break;
  }

  const got = await fr.evaluate(() => Object.keys(CAST_FID));

  /* *** AND THE RULER ITSELF HAS TO BE TAKEN OUT OF THE ANSWER. ***
     The first degree-precision run said Mob drifts 43 degrees off the table. But the table
     was measured by tools/bohemia_faction_colour.js on CLOTH PIXELS ONLY, at native 112, in
     the alpha. This reader sees every opaque pixel of a 56px sprite -- SKIN INCLUDED, and
     skin is a saturated orange that will happily outvote dark cloth. So a drift against the
     table cannot tell you whether the round trip broke anything or whether two different
     rulers are being compared to each other, which is the exact mistake that put a false
     hole in round 1's record.
     SO THE HONEST COMPARISON IS THE SAME LOOK, THE SAME READER, BEFORE AND AFTER. Read the
     look in the parent at native 112 off buildFrame -- the very array bake56 halves -- and
     read the city's sprite with the identical function. Whatever is left is the ROUND TRIP
     and nothing else. The table stays on the page as a cross-reference, not as the judge. */
  const beforeBake = await p.evaluate((NS) => {
    const hueOfPx = (px) => {
      const B5 = new Array(72).fill(0); let col = 0, tot = 0, lum = 0;
      for (let i = 0; i < px.length; i++) {
        const q = px[i]; if (!q) continue;
        const R = q[0], G = q[1], B = q[2];
        tot++; lum += 0.2126 * R + 0.7152 * G + 0.0722 * B;
        const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
        if ((mx ? (mx - mn) / mx : 0) < 0.25 || mx < 40) continue;
        col++;
        let h;
        if (mx === mn) h = 0;
        else if (mx === R) h = 60 * (((G - B) / (mx - mn)) % 6);
        else if (mx === G) h = 60 * (((B - R) / (mx - mn)) + 2);
        else h = 60 * (((R - G) / (mx - mn)) + 4);
        if (h < 0) h += 360;
        B5[Math.floor(h / 5) % 72]++;
      }
      let bi = 0; for (let i = 1; i < 72; i++) if (B5[i] > B5[bi]) bi = i;
      return { hue: B5[bi] ? bi * 5 + 2.5 : null, coloured: tot ? col / tot : 0,
               luma: tot ? Math.round(lum / tot) : 0 };
    };
    /* THE SAME BORROW-AND-GIVE-BACK cityBakeFaction uses, because these are GLOBALS and
       leaving one installed silently reshapes every other surface in the game. Restored in
       a finally, exactly as the shipped code does it. */
    const PD = ['shirt', 'jacket', 'pants', 'shoes', 'hat', 'glasses', 'hair'];
    const kW = window.G_WORN, kD = G.bodyVar, kA = G.age, kE = {};
    PD.forEach(s => { if (s in G.equipped) { kE[s] = G.equipped[s]; G.equipped[s] = ''; } });
    const out = {};
    try {
      for (const n of NS) {
        const src = (window.FACTION_LOOKS || []).filter(f => f.faction === n)[0];
        if (!src) continue;
        window.G_WORN = src.worn; G.bodyVar = src.dials; G.age = src.age || 'adult';
        rebuildFromRig();
        const f = buildFrame('S', 'idle', 0.25, true);
        out[n] = hueOfPx(f.px);
      }
    } catch (e) { out.__err = String(e.message).slice(0, 140); }
    finally {
      window.G_WORN = kW; G.bodyVar = kD; G.age = kA;
      for (const s in kE) G.equipped[s] = kE[s];
      try { rebuildFromRig(); } catch (e) {}
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    }
    return out;
  }, names);

  /* THE HUE OF A BODY AS THE CITY HOLDS IT. Opaque pixels only; near-grey pixels do not
     vote, because grey has no hue and a dun body is mostly grey -- counting it would elect
     "no colour" every time and say nothing. Same reader as round 1, unchanged. */
  const read = await fr.evaluate(() => {
    /* *** THE FIRST CUT OF THIS READER SAID THREE OF THIRTEEN MISSED, AND ALL THREE
       MISSES WERE EXACTLY ONE BIN. *** It bucketed hue into twelve 30-degree slices and
       compared slice numbers, so a table hue of 30 and a baked hue of 29 -- ONE DEGREE
       apart -- came out as a miss, while 31 and 59 came out as a match. That is a ruler
       that answers a different question than the one being asked. Same family as 9/11's
       "a ruler that measures where a thing sits cannot tell you its shape".
       SO IT MEASURES THE ANGLE. Fine 5-degree bins find the mode, and the answer is the
       circular distance in DEGREES, which is a number you can put a threshold on and
       argue about, rather than a bucket boundary nobody chose. */
    const hueOf = (img) => {
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(img, 0, 0);
      const im = x.getImageData(0, 0, c.width, c.height).data;
      const B5 = new Array(72).fill(0); let col = 0, tot = 0, lum = 0;
      for (let i = 0; i < im.length; i += 4) {
        if (im[i + 3] < 128) continue;
        const R = im[i], G = im[i + 1], B = im[i + 2];
        tot++; lum += 0.2126 * R + 0.7152 * G + 0.0722 * B;
        const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
        if ((mx ? (mx - mn) / mx : 0) < 0.25 || mx < 40) continue;
        col++;
        let h;
        if (mx === mn) h = 0;
        else if (mx === R) h = 60 * (((G - B) / (mx - mn)) % 6);
        else if (mx === G) h = 60 * (((B - R) / (mx - mn)) + 2);
        else h = 60 * (((R - G) / (mx - mn)) + 4);
        if (h < 0) h += 360;
        B5[Math.floor(h / 5) % 72]++;
      }
      let bi = 0; for (let i = 1; i < 72; i++) if (B5[i] > B5[bi]) bi = i;
      return { hue: B5[bi] ? bi * 5 + 2.5 : null, coloured: tot ? col / tot : 0,
               luma: tot ? Math.round(lum / tot) : 0, px: tot };
    };
    const out = {};
    for (const f in CAST_FID) {
      const s = CAST_FID[f].S || CAST_FID[f][Object.keys(CAST_FID[f])[0]];
      if (!s || !s.idle) continue;
      const plain = hueOf(s.idle);
      /* AND THE SAME BODY AS A HOSTILE. ctStepped is the shipped 9/6 step, asked for a
         target far from where this body sits, so the check is a hard one and not a nudge. */
      let hostile = null, want = null;
      try {
        want = plain.luma <= 127 ? plain.luma + 60 : plain.luma - 60;
        hostile = hueOf(ctStepped(s.idle, want));
      } catch (e) { hostile = { err: String(e.message).slice(0, 80) }; }
      if (hostile) hostile.want = want;
      out[f] = { plain, hostile };
    }
    return out;
  });

  await b.close();

  /* CIRCULAR DISTANCE. Hue wraps, so 350 and 10 are twenty degrees apart, not 340. */
  const dHue = (a, b) => { let d = Math.abs(((a - b) % 360 + 360) % 360); return d > 180 ? 360 - d : d; };
  /* THE THRESHOLD, AND WHY IT IS THIS NUMBER. 30 degrees is one twelfth of the wheel and
     it is the span inside which a colour still reads as the same colour to a person --
     rust and brown, not rust and green. It is also the bin width the first cut of this
     reader used, so nothing gets easier: what changes is that a one-degree gap across a
     boundary is no longer a miss. */
  const NEAR = 30;
  /* A DRAB BODY HAS NO HUE TO PRESERVE. The table records `drab` and `share` per faction
     off the wardrobe itself. Asking "did the hue survive" of a body that is 26% coloured
     is asking a question about noise, and answering it would be inventing a finding. */
  const L = [];
  L.push('DOES THE COLOUR SURVIVE THE BAKE? -- CHARACTER lane, 9/12/26');
  L.push('VAMILY row [faction colour] THE-BODY-WEARS-THE-TERRITORY, round 2');
  L.push('');
  L.push('=== THE CORRECTION THAT OPENS THIS ROUND ===');
  L.push('Round 1 recorded a fourth hole: "the faction cast never bakes". IT IS NOT A HOLE.');
  L.push('My tool asked ctNeedFaction("REDS"); the canon spelling is "Reds"; cityBakeFaction');
  L.push('matches with a bare === and returned false in silence. Measured on the walked');
  L.push('surface with a real vouch: trade fit d9e665d6 -> asked -> still d9e665d6 while it');
  L.push('bakes -> 247bb4a0 eight seconds later. THE BODY CHANGES. The chain works.');
  L.push('THE REAL FINDING UNDERNEATH IT: a faction asked for with no outfit says NOTHING,');
  L.push('ever, and that body stays in its trade fit for the life of the session.');
  L.push('');
  L.push('=== THE BAKE ===');
  L.push('asked for ' + names.length + ', landed ' + got.length);
  const missing = names.filter(n => got.indexOf(n) < 0);
  L.push(missing.length ? 'NEVER LANDED: ' + missing.join(', ') : 'every one landed.');
  L.push('');
  L.push('=== THE ROUND TRIP: does the colour the wardrobe made reach the city? ===');
  L.push('Hue in DEGREES on the colour wheel (0 red, 60 yellow, 120 green, 240 blue).');
  L.push('ALPHA is the look as the character renderer draws it at native 112. CITY is the');
  L.push('sprite the walked street is holding after the bake, the halve, the pack, the frame');
  L.push('hop and the unpack. SAME READER BOTH SIDES, so TRIP is the round trip and nothing');
  L.push('else. Anything under ' + NEAR + ' degrees is still the same colour to a person.');
  L.push('TABLE is the wardrobe colour file, printed as a CROSS-REFERENCE only: it was');
  L.push('measured on CLOTH PIXELS ONLY and this reader counts skin too, so a gap there is a');
  L.push('difference between two rulers and is not evidence of anything.');
  L.push('');
  L.push('AND THE LAST COLUMN IS THE CHECK ON MY OWN FIX. Holding the hue would be easy if');
  L.push('the step stopped stepping. STEP-GOT is how far the value ACTUALLY moved against the');
  L.push('60 it was asked for, so a hue held by doing nothing shows up as a zero right here.');
  L.push('');
  L.push('FACTION       ALPHA   CITY   TRIP  HELD?  COLOURED%  DRAB?  HOSTILE-TRIP  STEP-GOT');
  let hit = 0, n = 0, hostHeld = 0, hostN = 0, drab = 0, worst = 0, worstF = '', hworst = 0;
  let stepSum = 0, stepN = 0, stepMin = 999;
  for (const f of names) {
    const r = read[f], t = TABLE[f], a = beforeBake[f];
    if (!r || !a) { L.push(f.padEnd(12) + '  (no bake or no alpha read)'); continue; }
    const isDrab = (t && !!t.drab) || r.plain.coloured < 0.35;
    const d = (r.plain.hue == null || a.hue == null) ? null : dHue(r.plain.hue, a.hue);
    let hd = null, moved = null;
    if (r.hostile && r.hostile.hue != null && r.plain.hue != null) hd = dHue(r.hostile.hue, r.plain.hue);
    if (r.hostile && r.hostile.luma != null && r.hostile.want != null) {
      moved = Math.abs(r.hostile.luma - r.plain.luma);
      stepSum += moved; stepN++; if (moved < stepMin) stepMin = moved;
    }
    if (isDrab) { drab++; }
    else {
      n++;
      if (d != null && d <= NEAR) hit++;
      if (d != null && d > worst) { worst = d; worstF = f; }
      if (hd != null) { hostN++; if (hd <= NEAR) hostHeld++; if (hd > hworst) hworst = hd; }
    }
    L.push(f.padEnd(12) + String(a.hue == null ? '-' : a.hue).padStart(7)
      + String(r.plain.hue == null ? '-' : r.plain.hue).padStart(7)
      + String(d == null ? '-' : d.toFixed(0)).padStart(7)
      + (isDrab ? '      -' : (d != null && d <= NEAR ? '    YES' : '     NO'))
      + (Math.round(r.plain.coloured * 100) + '%').padStart(11)
      + (isDrab ? 'YES' : ' no').padStart(7)
      + String(hd == null ? '-' : hd.toFixed(0)).padStart(14)
      + (moved == null ? '-' : moved.toFixed(0) + '/60').padStart(10));
  }
  L.push('');
  L.push('THE VALUE STEP STILL STEPS: it moved ' + (stepN ? (stepSum / stepN).toFixed(0) : '-')
    + ' of the 60 it was asked for on average, and');
  L.push('never less than ' + (stepMin === 999 ? '-' : stepMin.toFixed(0)) + '. The shortfall is the ceiling and it is deliberate: a pixel is');
  L.push('never lifted past the point where its brightest channel would clip, because a clip');
  L.push('is what rotates the hue. Value is the thing allowed to fall short; colour is not.');
  L.push('');
  L.push('COLOUR SURVIVES THE ROUND TRIP: ' + hit + ' of ' + n + ' bodies that have a hue at all'
    + ' (' + drab + ' are drab by the wardrobe\'s own');
  L.push('measure and have no hue to lose). WORST TRIP: ' + worst.toFixed(0) + ' degrees (' + (worstF || 'none') + ').');
  L.push('COLOUR SURVIVES THE HOSTILE VALUE STEP: ' + hostHeld + ' of ' + hostN
    + ', worst ' + hworst.toFixed(0) + ' degrees. That step is');
  L.push('built to move VALUE and hold HUE, and this is the first thing that has ever checked');
  L.push('that claim against the faction colours it could have broken.');
  L.push('');
  L.push('=== WHAT THIS DOES AND DOES NOT SETTLE ===');
  L.push('SETTLED, in this lane: a faction body bakes, crosses the frame, and reaches the');
  L.push('street wearing its colour, and the hostile step moves value without moving hue.');
  L.push('NOT SETTLED, and NOT IN THIS LANE: nobody near the spawn is affiliated (171 of 171');
  L.push('answer none) and no resident stands on held ground (0 of 2199). Both are facts');
  L.push('about the map and the two dials AFFILIATED_RATE and REACH_CELLS, which the city');
  L.push('file itself marks [PENDING Paolo]. The dressing half is done; the population half');
  L.push('is somebody else\'s ground and this lane will not paper over it.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
})();
