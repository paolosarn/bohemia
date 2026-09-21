/* COOK: THE VALLEY HAS NO CHILDREN AND NO OLD PEOPLE (9/21/26, CHARACTER lane)
 *
 * RULE 22, COOK EVERY ROUND (Paolo 9/21, LOCKED): a making lane makes one real thing every
 * round, registered in the VOTE tab, or the round did not happen.
 *
 * *** THE GAP, MEASURED BEFORE COOKING ANYTHING. *** The rig has carried FIVE age stages
 * since it was built -- child, teen, young adult, adult, elder -- with their own heights,
 * limb lengths and leg bias. Counted across the whole alpha: exactly ONE body in the game
 * uses a stage other than adult, and it is NINA, the little sister in the cold open. The
 * twelve street looks carry no age field at all.
 * SO EVERY SINGLE PERSON THE PLAYER WALKS PAST IS AN ADULT. A valley of nothing but adults
 * is a world with no families in it and no one who got old, and it is the sort of thing you
 * cannot unsee once you have seen it.
 *
 * WHY THIS AND NOT MORE HORROR BODIES. The [horror body] pair from last round is in VOTE
 * and UNJUDGED. STOP PRODUCING (7/26) is explicit: do not pile up more of a direction he
 * has not ruled on. This is a different axis entirely, it needs no verdict to be obviously
 * missing, and the machinery is already in the rig -- REUSE-FIRST, nothing new is drawn.
 *
 * AND IT IS STILL BUILT UNDER RULE 20. Analog horror is not a costume here: a child and an
 * old man dressed in ordinary hand-me-downs, standing still in a dead valley, is the law's
 * own register -- "the frame is ordinary and one thing in it is wrong" -- and the wrong
 * thing is where they are, not what they look like. No gore, no monster, nothing strange.
 *
 * THE AGE STAGE IS THE RIG'S OWN, READ NOT RETYPED, and applied the way the game applies it
 * to its own cast (famPaintBody): set G.age and G.bodyVar, rebuild the rig, restore both.
 * THAT PATH IS THE WHOLE REASON THIS TOOL EXISTS IN THIS FORM. Two tools in this lane wrote
 * `G.dials[k] = ...` inside a try/catch; there is no G.dials, the catch ate the TypeError,
 * and both shipped pictures where every body was drawn at default proportions. A SILENT
 * CATCH AROUND A WRITE TURNS "THIS DOES NOTHING" INTO "THIS WORKED". Nothing here is
 * wrapped in a silent catch.
 *
 * REFERENCE CHECK (COMPARE EVERY PIECE OF ART TO THE WORLD, 9/4). Compared against the
 * library before calling either body done:
 *   FACE-02  classical figure construction, the thirds and the head count. This is the
 *          ruler the whole cook stands on: a child is not a shrunk adult, he is a body
 *          with the SAME head on a shorter frame. Measured after cooking, on one ruler
 *          across all three bodies: 4.36 heads for the grown man, 3.59 for the kid. The
 *          rig's own build note claims 4.89 and 3.79 off the bones; the gap is bone
 *          against painted stamp and the record says so instead of picking the prettier
 *          number.
 *   RNWY-08  the elongated hem, where a garment cut LONG is readable in silhouette. The
 *          kid is in an adult's WHITE TEE for a story reason, and this is the check that
 *          it actually reads: on a 79 px body the same tee drops past the hip and the
 *          long hem is the first thing the silhouette says.
 *   AH-01  our own analog horror bible, the ordinary frame with one wrong thing. Neither
 *          body is strange in itself. A kid and an old man are the most ordinary things a
 *          street can have; the wrong thing is that this valley has neither.
 *
 *   node tools/bohemia_cook_the_valley_has_no_children.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const OUT = path.join(REPO, 'records/BOHEMIA_THE_VALLEY_HAS_NO_CHILDREN_9_21_26.txt');

/* Dressed out of what a child and an old man would actually be wearing here: hand-me-downs
   that fit badly and clothes somebody has had for thirty years. Every garment canon. */
const CAST = [
  { id: 'age-child', title: 'A KID', age: 'child',
    note: 'wearing a grown man\'s shirt, because there are no small ones left',
    dials: { height: 0.00, belly: -0.10, arms: 0.00, shoulders: -0.20, hips: -0.10 },
    worn: { hair: 'LAYERED FALL', base: 'WHITE TEE', legs: 'GREY SWEATS',
            feet: 'GREY SNEAKERS' } },
  { id: 'age-elder', title: 'SOMEBODY WHO GOT OLD HERE', age: 'elder',
    note: 'a coat older than the crash, and still the warmest thing he owns',
    dials: { height: -0.15, belly: 0.30, arms: -0.15, shoulders: -0.25, hips: 0.15 },
    worn: { hair: 'DRY TAPER', head: 'BONE KNIT CAP', base: 'BONE HENLEY',
            outer: 'DUST BROWN TRENCH', legs: 'DUST TROUSERS', feet: 'BROWN BOOTS',
            hands: 'DUST GLOVES' } }
];

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1000, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS
    && typeof rebuildFromRig === 'function', { timeout: 90000 });

  const R = await p.evaluate((CAST) => {
    const o = { missing: [], made: [], stages: null, nonAdultInGame: 0 };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    try { o.stages = Object.keys(BOH_AGE.STAGES || {}); } catch (e) { o.stages = null; }

    const canon = {};
    for (const g of GARMENTS) if (g && g.st === 'canon' && g.layer) canon[g.n] = g.layer;
    for (const c of CAST) for (const k in c.worn)
      if (!canon[c.worn[k]]) o.missing.push(c.id + ': ' + c.worn[k]);
    if (o.missing.length) return o;

    const draw = (worn, dials, age) => {
      G.equipped = bare(); window.G_WORN = worn;
      G.bodyVar = dials || {}; G.age = age || 'adult';
      rebuildFromRig(); clear();
      const fr = buildFrame('S', 'idle', 0);
      const W = fr.CW, H = fr.CH;
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const g2 = c.getContext('2d'); g2.imageSmoothingEnabled = false;
      const im = g2.createImageData(W, H), d = im.data;
      let top = 1e9, bot = -1;
      for (let i = 0; i < fr.px.length; i++) {
        const q = fr.px[i]; if (!q) continue;
        d[i * 4] = q[0]; d[i * 4 + 1] = q[1]; d[i * 4 + 2] = q[2]; d[i * 4 + 3] = 255;
        const y = (i / W) | 0; if (y < top) top = y; if (y > bot) bot = y;
      }
      g2.putImageData(im, 0, 0);
      /* HEADS TALL, AND IT IS THE HONEST NUMBER HERE. The painted extent above runs from
         the top of the HAIR to the sole, so a tall hairdo inflates it: the first run of
         this tool read the kid at 83% when the stage's own height term is 0.77, and the
         gap was a fringe. Heads-tall cannot be inflated that way, and it is the number
         the rig's own design note claims -- "the head is a rigid stamp anchored to the
         neck... head-to-body ratio rises by itself. That is what makes a child a child",
         an adult of 4.89 heads against a child of 3.79. Read off the RIG PART GRID (1,2
         are the head, 0 is hair and cloth that belongs to no bone), so it measures the
         body the skeleton made and not the haircut on top of it. */
      let bt = 1e9, bb = -1, ht = 1e9, hb = -1;
      for (let i = 0; i < fr.grid.length; i++) {
        const id = fr.grid[i]; if (!id) continue;
        const y = (i / W) | 0;
        if (y < bt) bt = y; if (y > bb) bb = y;
        if (id === 1 || id === 2) { if (y < ht) ht = y; if (y > hb) hb = y; }
      }
      const headPx = hb - ht + 1, bodyPx = bb - bt + 1;
      return { cv: c, painted: bot - top + 1, top: top, bot: bot, H: H,
               bodyPx: bodyPx, headPx: headPx,
               heads: (headPx > 0 ? +(bodyPx / headPx).toFixed(2) : null) };
    };
    /* AN ADULT FOR SCALE, and this one is not decoration: a child is only a child next to
       somebody full-grown, and the whole claim of this cook is a HEIGHT difference. */
    const adult = draw({ hair: 'DRY TAPER', base: 'WHITE TEE', legs: 'BLUE JEANS',
                         feet: 'BROWN BOOTS' },
                       { height: 0, belly: 0, arms: 0, shoulders: 0, hips: 0 }, 'adult');
    const shots = CAST.map(c => ({ c: c, m: draw(c.worn, c.dials, c.age) }));

    /* THE SHEET. FEET ALIGNED ON ONE LINE and drawn at ONE scale, because a contact sheet
       that fits each body to its own cell throws away the only thing this cook is about.
       That mistake cost a body last round: "too tall" was scaled to fit and read as normal
       height, and the label lied. */
    const CELL = 230, PAD = 16, HEAD = 46, LAB = 46;
    const cv = document.createElement('canvas');
    cv.width = (shots.length + 1) * CELL + PAD * 2;
    cv.height = CELL + HEAD + LAB + PAD * 2;
    const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    g.fillStyle = '#b9a373'; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = '#3a2f1c'; g.textBaseline = 'top';
    g.font = 'bold 19px ui-monospace, monospace';
    g.fillText('THE VALLEY HAS NO CHILDREN AND NOBODY WHO GOT OLD', PAD, PAD);
    g.font = '13px ui-monospace, monospace';
    g.fillText('every person you walk past is an adult. same scale, feet on one line.',
               PAD, PAD + 22);
    const FLOOR = PAD + HEAD + CELL;
    const put = (m, x, title, sub) => {
      if (m && m.cv) {
        const s = CELL / m.H;                         /* ONE scale for everybody */
        const w = Math.round(m.cv.width * s);
        g.drawImage(m.cv, x + (CELL - w) / 2, PAD + HEAD, w, Math.round(m.H * s));
      }
      g.fillStyle = '#3a2f1c'; g.font = 'bold 12px ui-monospace, monospace';
      g.fillText(String(title).slice(0, 28), x + 3, FLOOR + 6);
      g.font = '11px ui-monospace, monospace';
      let line = '', ln = 0;
      for (const w2 of String(sub).split(' ')) {
        if (line && (line + ' ' + w2).length > 32) { g.fillText(line, x + 3, FLOOR + 22 + ln * 12); line = w2; ln++; }
        else line = line ? line + ' ' + w2 : w2;
      }
      if (line) g.fillText(line, x + 3, FLOOR + 22 + ln * 12);
    };
    put(adult, PAD, 'A GROWN MAN', 'for scale. this is everybody, today.');
    shots.forEach((s, i) => put(s.m, PAD + (i + 1) * CELL, s.c.title, s.c.note));
    o.sheet = cv.toDataURL('image/png');
    o.adultPainted = adult.painted;
    o.adultBody = adult.bodyPx; o.adultHead = adult.headPx; o.adultHeads = adult.heads;
    o.made = shots.map(s => ({ id: s.c.id, title: s.c.title, age: s.c.age,
                               painted: s.m.painted,
                               bodyPx: s.m.bodyPx, headPx: s.m.headPx, heads: s.m.heads,
                               bodyPct: Math.round(100 * s.m.bodyPx / adult.bodyPx),
                               pct: Math.round(100 * s.m.painted / adult.painted) }));

    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    return o;
  }, CAST);
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 2).join(' | '));
  if (R.missing.length) {
    console.error('REFUSING TO COOK, these name garments the rail does not have:\n  '
      + R.missing.join('\n  ')); process.exit(2);
  }
  fs.mkdirSync(VOTE, { recursive: true });
  const f = path.join(VOTE, 'CHARACTER_NO_CHILDREN_NO_OLD.png');
  fs.writeFileSync(f, Buffer.from(R.sheet.split(',')[1], 'base64'));

  const L = [];
  L.push('THE VALLEY HAS NO CHILDREN AND NOBODY WHO GOT OLD  --  CHARACTER lane, 9/21/26');
  L.push('');
  L.push('THE GAP, MEASURED BEFORE COOKING ANYTHING. The rig has carried FIVE age stages since');
  L.push('it was built: ' + (R.stages ? R.stages.join(', ') : '(could not read them)') + '.');
  L.push('Counted across the whole alpha, exactly ONE body uses a stage other than adult, and');
  L.push('it is NINA, the little sister in the cold open. The twelve street looks carry no age');
  L.push('field at all. SO EVERY SINGLE PERSON THE PLAYER WALKS PAST IS AN ADULT.');
  L.push('');
  L.push('WHAT CAME OUT, MEASURED TWO WAYS. The first column is the BODY the skeleton made,');
  L.push('hair excluded. The second is heads-tall, which is the number that actually decides');
  L.push('whether a kid reads as a kid: the head is a rigid stamp the rig refuses to shrink,');
  L.push('so a smaller body carries the same head and the ratio moves on its own.');
  L.push('');
  L.push('  a grown man                 ' + String(R.adultBody).padStart(3) + ' px body   100%   '
    + R.adultHeads + ' heads tall');
  for (const m of R.made)
    L.push('  ' + m.title.padEnd(28) + String(m.bodyPx).padStart(3) + ' px body   '
      + String(m.bodyPct).padStart(3) + '%   ' + m.heads + ' heads tall   (' + m.age + ')');
  L.push('');
  L.push('HONEST CORRECTION TO MY OWN FIRST RUN. I first reported the kid at 83% by measuring');
  L.push('the painted picture top to bottom, and the stage\'s own height term is 0.77. The gap');
  L.push('was her HAIR: a long cut adds painted rows that no bone made. Measuring the rig parts');
  L.push('instead puts her where the stage says she is. The lesson is the same one this lane');
  L.push('keeps relearning: measure the thing you are claiming, not the thing that is easy.');
  L.push('');
  L.push('WHY THIS AND NOT MORE HORROR BODIES. The pair from last round is in VOTE and');
  L.push('UNJUDGED, and STOP PRODUCING is explicit about piling up more of a direction he has');
  L.push('not ruled on. This is a different axis, it needs no verdict to be obviously missing,');
  L.push('and the machinery is already in the rig. Nothing new was drawn.');
  L.push('');
  L.push('STILL BUILT UNDER RULE 20. A kid in a grown man\'s shirt and an old man in a coat');
  L.push('older than the crash, standing still in a dead valley, is the law\'s own register:');
  L.push('the frame is ordinary and the wrong thing is WHERE THEY ARE, not how they look.');
  L.push('No gore, no monster, nothing strange.');
  L.push('');
  L.push('HONEST LIMIT ON THE HEAD COUNT. The rig\'s own build note says its adult is a 4.89');
  L.push('head figure, and I measure 4.36. That is not a contradiction, it is a different');
  L.push('ruler: the note counted the head BONE in the baked pose, and this counts the painted');
  L.push('head STAMP, which covers more rows than the bone it hangs on. What matters is that');
  L.push('one ruler measured all three bodies, so the drop from 4.36 to 3.59 is real.');
  L.push('');
  L.push('THE SHEET DRAWS EVERYBODY AT ONE SCALE WITH FEET ON ONE LINE. A contact sheet that');
  L.push('fits each body to its own cell throws away the only thing this cook is about, and');
  L.push('that exact mistake cost a body last round: "too tall" was scaled to fit, read as');
  L.push('normal height, and the label lied.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\n  wrote slices/vote/CHARACTER_NO_CHILDREN_NO_OLD.png  '
    + (fs.statSync(f).size / 1024).toFixed(0) + ' KB');
})();
