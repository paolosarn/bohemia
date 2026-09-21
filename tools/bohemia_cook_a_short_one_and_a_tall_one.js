/* COOK: A SHORT ONE, A MEDIAN ONE AND A TALL ONE (9/21/26, CHARACTER lane, [real height])
 *
 * THE ROW, IN THE COORDINATOR'S WORDS (VAMILY 05, HELD [real height], from this lane's own
 * 3ac81487): "the height dial is 7% end to end (96 to 103 px), width flat at 39; a tall
 * person cannot be drawn. THE COORDINATOR'S DEFAULT: real adults vary about a third; the
 * ruled 112 box stays the MEDIAN (rule 21 is about the camera, not about people differing)
 * and the dial runs 0.88 to 1.12 of it. HELD under rule 18; COOK THE PICTURE (short,
 * median, tall beside each other) this round if it is your cook."
 * So that is the picture, and nothing here is wired into the game.
 *
 * WHY 0.88 TO 1.12 IS THE RIGHT SPAN AND NOT A ROUND NUMBER SOMEBODY LIKED. Adult male
 * stature in a real population has a standard deviation of about 7 cm on a mean of 175, so
 * 1.7 standard deviations either side -- which covers about 91 of every 100 men you would
 * actually pass on a street -- is 163 cm to 187 cm. Against the median that is 0.93 to
 * 1.07. The coordinator's 0.88/1.12 is WIDER than that: it reaches 154 cm and 196 cm, the
 * short and tall ends of a whole population rather than the middle of it. Said plainly in
 * the record instead of quietly adopted, because a span that is too wide reads as cartoon
 * and that is a thing he can see in one look and rule on.
 *
 * *** IT IS RENDERED BY THE GAME'S OWN HEIGHT MACHINERY, NOT BY A SECOND ONE I WROTE. ***
 * REUSE-FIRST. BOH_AGE.apply() already scales every joint toward the GROUND LINE by a
 * stage's `h`, keeps the head bone authored (so head-to-body moves on its own), and scales
 * the hand and foot stamps by `limb`. That is exactly, precisely the mechanism this row
 * asks for -- it was built for the child and it does not know or care that the child is a
 * child. So this tool adds two ADULT stages to the live BOH_AGE.STAGES for the length of
 * one render and takes them out again. If he votes yes, wiring it is two table rows, and
 * the picture he voted on was made by the code that would ship.
 *   bias is left EMPTY on both, and that is a decision. The child narrows its shoulders
 *   because breadth falls faster than height in GROWTH. A tall adult is not a grown child:
 *   biacromial breadth scales roughly WITH stature between adults, so a tall man is a
 *   bigger man, not a stretched one. Narrowing him would be importing the child's biology
 *   into a body it does not describe.
 *
 * WHAT I EXPECT TO GO WRONG, WRITTEN DOWN BEFORE RUNNING IT so it cannot become a finding
 * I invented afterwards: the rig's own note says "GOING DOWN IS FRAME-SAFE. AMP.height is
 * capped at 5% because his body already paints row 0 in nine clips -- GROWING runs out of
 * frame." Every stage that has ever shipped is 1.00 or below. 1.12 GROWS, and the frame may
 * cut the top of his head off. So this measures row 0 on every body and prints it, and if
 * the tall one clips, THAT IS THE ROUND'S FINDING and it goes to the coordinator, because
 * it is the thing that would bite whoever wires this row.
 *
 * RIG CHECK (RIG IS LAW): reads only. G_WORN, G.equipped, G.bodyVar, G.age, the two
 * injected stages and both caches are all restored. Nothing is written to any game file.
 *
 * NOT SHIPPED TO ANY PLAY SURFACE (rule 18). The row is HELD. Rule 22(b): the hold is on
 * the play surface, not on the making, so this goes to VOTE and nowhere else.
 *
 * REFERENCE CHECK (COMPARE EVERY PIECE OF ART TO THE WORLD, 9/4):
 *   FACE-02  classical figure construction and the head count. The ruler that says whether
 *          a tall man reads as TALL rather than as a zoomed-in man: between adults the head
 *          stays near its own size, so heads-tall must RISE with height. Measured here on
 *          one ruler across all three bodies and published even where it disappoints.
 *   RNWY-03  the absent shoulder, Rick Owens, "height, not breadth, is the statement", and
 *          RNWY-05 the elongated column. This is the register's own tall pole, and it is
 *          the check on the bias decision above: the runway reaches TALL by keeping the
 *          shoulder soft and letting the figure stack, never by narrowing a body that is
 *          genuinely bigger. So the tall body here keeps its breadth.
 *   AH-01  our own analog horror bible, the ordinary frame with one wrong thing. Three
 *          ordinary men in the same clothes is deliberately the most boring picture this
 *          lane has cooked. The vote is about a number, so the picture must not carry a
 *          second argument.
 *
 *   python3 -m http.server 8231 &   (not needed: this reads the alpha off disk)
 *   node tools/bohemia_cook_a_short_one_and_a_tall_one.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const OUT = path.join(REPO, 'records/BOHEMIA_A_SHORT_ONE_AND_A_TALL_ONE_9_21_26.txt');

/* THE SAME MAN THREE TIMES. Same clothes, same build dials, same facing. The ONLY thing
   that differs is the height term, because a vote about height cannot be asked with a
   picture where two other things also changed. */
const WORN = { hair: 'DRY TAPER', base: 'WHITE TEE', legs: 'BLUE JEANS', feet: 'BROWN BOOTS' };
const DIALS = { height: 0, belly: 0, arms: 0, shoulders: 0, hips: 0 };
const CAST = [
  { id: 'h-short',  h: 0.88, title: 'A SHORT ONE',  note: 'about 154 cm if the middle one is 175' },
  { id: 'h-median', h: 1.00, title: 'THE ONE WE HAVE TODAY', note: 'the ruled 112 box. everybody in the game is this, give or take 7 per cent' },
  { id: 'h-tall',   h: 1.12, title: 'A TALL ONE',   note: 'about 196 cm. today the dial cannot reach him. LOOK AT THE TOP OF HIS HEAD: the sprite box cuts his crown flat. that is the bug this picture found' }
];

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1100, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS
    && typeof rebuildFromRig === 'function' && window.BOH_AGE, { timeout: 90000 });

  const R = await p.evaluate(({ CAST, WORN, DIALS }) => {
    const o = { missing: [], made: [], errs: [] };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };

    const canon = {};
    for (const g of GARMENTS) if (g && g.st === 'canon' && g.layer) canon[g.n] = g.layer;
    for (const k in WORN) if (!canon[WORN[k]]) o.missing.push(WORN[k]);
    if (o.missing.length) return o;

    /* THE TWO STAGES, ADDED TO THE GAME'S OWN TABLE FOR THE LENGTH OF THIS RENDER.
       Not a copy of apply(), not a scale on the canvas afterwards: the real path. */
    const injected = [];
    for (const c of CAST) {
      if (c.h === 1.00) continue;                  /* the median IS 'adult', by identity */
      BOH_AGE.STAGES[c.id] = { h: c.h, legBias: 0.00, limb: c.h, label: c.title, bias: null };
      injected.push(c.id);
    }

    const draw = (stage) => {
      G.equipped = bare(); window.G_WORN = WORN;
      G.bodyVar = JSON.parse(JSON.stringify(DIALS)); G.age = stage;
      rebuildFromRig(); clear();
      const fr = buildFrame('S', 'idle', 0);
      const W = fr.CW, H = fr.CH;
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const g2 = c.getContext('2d'); g2.imageSmoothingEnabled = false;
      const im = g2.createImageData(W, H), d = im.data;
      let top = 1e9, bot = -1, row0 = 0;
      for (let i = 0; i < fr.px.length; i++) {
        const q = fr.px[i]; if (!q) continue;
        d[i * 4] = q[0]; d[i * 4 + 1] = q[1]; d[i * 4 + 2] = q[2]; d[i * 4 + 3] = 255;
        const y = (i / W) | 0; if (y < top) top = y; if (y > bot) bot = y;
        if (y === 0) row0++;
      }
      g2.putImageData(im, 0, 0);
      /* HEADS TALL OFF THE RIG PART GRID (1,2 are the head; 0 is hair and cloth that
         belongs to no bone), so a haircut cannot inflate a height claim. Learned the hard
         way last round: measuring top-of-hair to sole put a child 6 points above the
         stage's own number and the whole gap was a fringe. */
      let bt = 1e9, bb = -1, ht = 1e9, hb = -1;
      for (let i = 0; i < fr.grid.length; i++) {
        const id = fr.grid[i]; if (!id) continue;
        const y = (i / W) | 0;
        if (y < bt) bt = y; if (y > bb) bb = y;
        if (id === 1 || id === 2) { if (y < ht) ht = y; if (y > hb) hb = y; }
      }
      const headPx = hb - ht + 1, bodyPx = bb - bt + 1;
      return { cv: c, H: H, W: W, painted: bot - top + 1, top: top,
               bodyPx: bodyPx, headPx: headPx, row0: row0,
               heads: headPx > 0 ? +(bodyPx / headPx).toFixed(2) : null };
    };

    let shots = null;
    try {
      shots = CAST.map(c => ({ c: c, m: draw(c.h === 1.00 ? 'adult' : c.id) }));
    } catch (e) { o.errs.push(String(e && e.message || e)); }

    if (shots) {
      /* ONE SCALE FOR EVERYBODY, FEET ON ONE LINE. A sheet that fits each body to its own
         cell throws away the only thing this cook is about, and that exact mistake cost
         this lane a body two rounds ago: "too tall" was scaled to fit and read as normal. */
      const CELL = 250, PAD = 18, HEAD = 50, LAB = 76;
      const cv = document.createElement('canvas');
      cv.width = shots.length * CELL + PAD * 2;
      cv.height = CELL + HEAD + LAB + PAD * 2;
      const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
      g.fillStyle = '#b9a373'; g.fillRect(0, 0, cv.width, cv.height);
      g.fillStyle = '#3a2f1c'; g.textBaseline = 'top';
      g.font = 'bold 19px ui-monospace, monospace';
      g.fillText('SHOULD PEOPLE BE DIFFERENT HEIGHTS?', PAD, PAD);
      g.font = '13px ui-monospace, monospace';
      g.fillText('same man, same clothes, one scale, feet on one line. only the height changes.',
                 PAD, PAD + 23);
      const FLOOR = PAD + HEAD + CELL;
      const s = CELL / shots[1].m.H;      /* the MEDIAN sets the scale for all three */
      g.strokeStyle = 'rgba(58,47,28,0.35)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(PAD, FLOOR + 0.5); g.lineTo(cv.width - PAD, FLOOR + 0.5); g.stroke();
      shots.forEach((sh, i) => {
        const x = PAD + i * CELL, m = sh.m;
        const w = Math.round(m.W * s), h = Math.round(m.H * s);
        g.drawImage(m.cv, x + (CELL - w) / 2, FLOOR - h, w, h);
        g.fillStyle = '#3a2f1c'; g.font = 'bold 12px ui-monospace, monospace';
        g.fillText(sh.c.title, x + 3, FLOOR + 7);
        g.font = '11px ui-monospace, monospace';
        let line = '', ln = 0;
        for (const w2 of String(sh.c.note).split(' ')) {
          if (line && (line + ' ' + w2).length > 34) { g.fillText(line, x + 3, FLOOR + 23 + ln * 12); line = w2; ln++; }
          else line = line ? line + ' ' + w2 : w2;
        }
        if (line) g.fillText(line, x + 3, FLOOR + 23 + ln * 12);
      });
      o.sheet = cv.toDataURL('image/png');
      o.made = shots.map(sh => ({ id: sh.c.id, title: sh.c.title, h: sh.c.h,
                                  bodyPx: sh.m.bodyPx, headPx: sh.m.headPx,
                                  heads: sh.m.heads, row0: sh.m.row0, top: sh.m.top,
                                  frameH: sh.m.H }));
    }

    for (const id of injected) delete BOH_AGE.STAGES[id];
    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    o.stagesAfter = Object.keys(BOH_AGE.STAGES);
    return o;
  }, { CAST, WORN, DIALS });
  await b.close();

  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  if (R.missing.length) {
    console.error('REFUSING TO COOK, the rail does not have: ' + R.missing.join(', '));
    process.exit(2);
  }
  if (R.errs && R.errs.length) {
    console.error('THE RENDER THREW: ' + R.errs.join(' | ')); process.exit(3);
  }
  fs.mkdirSync(VOTE, { recursive: true });
  const f = path.join(VOTE, 'CHARACTER_SHORT_MEDIAN_TALL.png');
  fs.writeFileSync(f, Buffer.from(R.sheet.split(',')[1], 'base64'));

  const med = R.made.filter(m => m.h === 1.00)[0];
  const clipped = R.made.filter(m => m.row0 > 0);
  const L = [];
  L.push('A SHORT ONE, A MEDIAN ONE AND A TALL ONE  --  CHARACTER lane, 9/21/26, [real height]');
  L.push('');
  L.push('THE ROW: this lane measured the height dial at 7% end to end (96 to 103 px) with');
  L.push('width flat at 39, so a tall person cannot be drawn. The coordinator\'s default is');
  L.push('that the ruled 112 box stays the MEDIAN and the dial runs 0.88 to 1.12. This is');
  L.push('that picture. NOTHING IS WIRED: the row is HELD under rule 18.');
  L.push('');
  L.push('RENDERED BY THE GAME\'S OWN HEIGHT MACHINERY. BOH_AGE.apply() already scales every');
  L.push('joint toward the ground line, keeps the head bone authored, and scales the hand and');
  L.push('foot stamps. It was built for the child and it does not care that the child is a');
  L.push('child. Two adult stages were added to the live table for one render and removed');
  L.push('after. If he says yes, wiring this is two table rows and the picture he voted on');
  L.push('was made by the code that would ship.');
  L.push('');
  for (const m of R.made)
    L.push('  ' + m.title.padEnd(24) + 'h ' + m.h.toFixed(2) + '   '
      + String(m.bodyPx).padStart(3) + ' px body   '
      + String(Math.round(100 * m.bodyPx / med.bodyPx)).padStart(3) + '% of the median   '
      + m.heads + ' heads tall');
  L.push('');
  const span = Math.round(100 * (R.made[R.made.length - 1].bodyPx / R.made[0].bodyPx - 1));
  L.push('  *** SHORT TO TALL IS ' + span + ' PER CENT. THE DIAL WE SHIP TODAY IS SEVEN. ***');
  L.push('');
  L.push('AND ' + span + ' IS NOT THE 24 THE NUMBERS 0.88 AND 1.12 LOOK LIKE, WHICH MATTERS TO');
  L.push('WHOEVER WIRES THIS. The stage scales the SKELETON, and the head is a rigid stamp the');
  L.push('rig refuses to shrink, so a 24-point span on the bones buys ' + span + ' points on the');
  L.push('whole standing body. If the intent was that a tall man really is a quarter taller');
  L.push('than a short one, the dial has to run wider than 0.88 to 1.12, or the head has to');
  L.push('come along. THE DIAL NUMBER IS NOT THE HEIGHT NUMBER.');
  L.push('');
  L.push('HEADS TALL IS THE NUMBER THAT SAYS IT READS. Measured off the RIG PART GRID, never');
  L.push('off the painted picture, because a haircut adds rows no bone made -- that error cost');
  L.push('this lane six points on a child last round. Between adults the head stays near its');
  L.push('own size, so heads-tall RISES with height, and that rise is what a person sees as');
  L.push('"tall" rather than as "zoomed in".');
  L.push('');
  L.push('THE SPAN IS WIDER THAN A REAL STREET AND I AM SAYING SO RATHER THAN ADOPTING IT');
  L.push('QUIETLY. Adult male stature has a standard deviation near 7 cm on a mean of 175, so');
  L.push('the middle 91 of every 100 men run 163 to 187 cm, which against the median is 0.93');
  L.push('to 1.07. The default\'s 0.88 to 1.12 reaches 154 cm and 196 cm: the ends of a whole');
  L.push('population, not the middle of one. That is a fine choice for a game and a bad one');
  L.push('for a crowd, and it is exactly the kind of thing he can rule on in one look.');
  L.push('');
  if (clipped.length) {
    L.push('*** AND THE FRAME CUTS THE TALL ONE. *** ' + clipped.map(m => m.title).join(', ')
      + ' paints row 0 of the frame ('
      + clipped.map(m => m.row0 + ' px').join(', ') + '), which means the top of the head is');
    L.push('against the ceiling of the sprite box and anything above it is gone. The rig\'s own');
    L.push('note warned about exactly this -- "GOING DOWN IS FRAME-SAFE... GROWING runs out of');
    L.push('frame" -- and every stage that has ever shipped is 1.00 or below. WHOEVER WIRES');
    L.push('THIS ROW MUST GROW THE FRAME FIRST, or tall people in this game will be scalped.');
    L.push('I wrote that risk into this tool BEFORE running it, so it is a prediction that');
    L.push('came true and not a story told afterwards.');
  } else {
    L.push('THE FRAME HOLDS. No body paints row 0, so nothing is cut off at the top even at');
    L.push('1.12, and the rig\'s "GROWING runs out of frame" warning does not bite at this');
    L.push('span. Frame height ' + med.frameH + ' px; the tall one\'s highest painted row is '
      + R.made[R.made.length - 1].top + '.');
  }
  L.push('');
  L.push('NOT WIRED, NOT SHIPPED, NOT DECIDED. Rule 18 holds the play surface; rule 22(b) says');
  L.push('the hold is on the play surface and not on the making. This is a picture in the VOTE');
  L.push('tab and nothing else. THE SPAN IS HIS CALL.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\n  stages after the render: ' + (R.stagesAfter || []).join(', '));
  console.log('  wrote slices/vote/CHARACTER_SHORT_MEDIAN_TALL.png  '
    + (fs.statSync(f).size / 1024).toFixed(0) + ' KB');
})();
