/* COOK: THE KID WALKS, AND SO DOES THE TEEN (9/24/26, CHARACTER, [ages])
 *
 * THE ROW IS UN-HELD FOR THE MAKING AND THE INSTRUCTION IS EXACT (coordinator note 9/23 on
 * [ages]): "HIS VOTE IS THE RULING, yes to ages... the child and teen are real and go to
 * VOTE this round as BODIES THAT MOVE (rule 25)."
 * HIS VOTE WAS "Both nigga" on THE STREET GETS KIDS -- he answered both halves of the
 * question at once, yes to kids on the street and yes to building a proper old man.
 *
 * RULE 25, IN HIS OWN WORDS, IS WHY THIS IS A PAGE AND NOT A PICTURE: "How dare you show me
 * pictures of animations and not the actual animation, NEVER DO THAT AGAIN." Every age item
 * this lane has put in front of him so far has been a still. This one plays.
 *
 * WHAT IT PLAYS. A child, a teen and a grown man walking, side by side, ONE SCALE, FEET ON
 * ONE LINE, on the beat. Everything except age is held still: same clothes, same build
 * dials, same facing, same frame of the same cycle at the same moment. So the only thing
 * that can differ is what age does to a walk.
 *
 * ON THE BEAT AT 120 BPM, WHICH IS THE LAW AND NOT A STYLE CHOICE. One step is one beat,
 * 500 ms, and the cycle is driven off that rather than off a frame counter, so what he sees
 * is the tempo the game runs at. A body that only looks right at the wrong speed is not
 * right.
 *
 * WHAT THIS DOES NOT DO, SAID BEFORE HE ASKS. The ELDER is not in this. Two rounds ago this
 * lane measured that the rig's young adult, adult and elder are ONE BODY within three per
 * cent, and that the three per cent is anatomically CORRECT -- real people barely shrink
 * with age. An old man reads by his BACK, and bending a spine is ANIMATION [spine bend],
 * which is theirs and in flight. Putting an "elder" in this page would be putting a
 * slightly shorter man in it and calling him old, which is the [names lie] defect this lane
 * has already been burned by. CHILD AND TEEN ARE REAL AND THEY ARE WHAT SHIPS.
 *
 * RIG CHECK (RIG IS LAW): reads only; G_WORN, G.equipped, G.bodyVar, G.age and both caches
 * restored. REUSE CHECK: nothing drawn. The age stages have been in the rig since it was
 * built and the walk cycle is the game's own; this renders frames that already exist.
 * NOT WIRED (rule 18): the street is not changed. The page goes to VOTE.
 *
 * REFERENCE CHECK (COMPARE EVERY PIECE OF ART TO THE WORLD, 9/4):
 *   WALK-01  Pedro Medeiros, the sprite walk is CONTACT-DOWN-PASS-UP and "the head bobs one
 *          pixel on pass; losing the bob kills the weight before anything else does". This
 *          is the reason the page plays the real cycle at the real tempo instead of two
 *          poses swapped: a walk judged from stills cannot be judged at all.
 *   WALK-03  the Animator's Survival Kit, "the walk is a controlled fall". The check that
 *          matters for a CHILD is whether a shorter body still reads as falling and
 *          catching rather than gliding, and that only shows at speed.
 *   FACE-02  the head count. The child's whole read is a big head on a short body, and this
 *          tool prints the measured heads-tall beside each one so the picture and the
 *          number agree.
 *   AH-01  our own analog horror bible. Nothing here is made strange on purpose. A kid
 *          walking down a street is the most ordinary thing a street can have, and the
 *          bible's own line is that the dread is a crowd thin where the census says full.
 *
 *   node tools/bohemia_cook_the_kid_walks.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const PAGE = path.join(VOTE, 'CHARACTER_THE_KID_WALKS.html');
const OUT = path.join(REPO, 'records/BOHEMIA_THE_KID_WALKS_9_24_26.txt');

/* THE SAME PERSON AT THREE AGES. Same clothes, same dials, same facing. */
const WORN = { hair: 'DRY TAPER', base: 'WHITE TEE', legs: 'BLUE JEANS', feet: 'BROWN BOOTS' };
const CAST = [
  { stage: 'child', title: 'A KID' },
  { stage: 'teen',  title: 'A TEENAGER' },
  { stage: 'adult', title: 'A GROWN MAN' }
];
const FRAMES = 8;   /* one full cycle; the page runs it at one step per beat */

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 900, height: 700 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS
    && typeof rebuildFromRig === 'function' && window.BOH_AGE, { timeout: 90000 });

  const R = await p.evaluate(({ WORN, CAST, FRAMES }) => {
    const o = { bodies: [], err: null };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    try {
      for (const c of CAST) {
        G.equipped = bare(); window.G_WORN = WORN;
        G.bodyVar = {}; G.age = c.stage;
        rebuildFromRig(); clear();
        const shots = [], sigs = [], side = [];
        let bodyPx = 0, headPx = 0;
        for (let i = 0; i < FRAMES; i++) {
          /* *** ph IS A PHASE FROM 0 TO 1, NOT A FRAME INDEX. *** My first version passed
             the index and every body came back as the same pose eight times -- the tool's
             own refusal caught it, which is the whole reason that check exists. The game's
             own caller is buildFrame(d, clip, (q+0.5)/b), a fraction of the cycle. */
          const fr = buildFrame('S', 'walk', i / FRAMES);
          const W = fr.CW, H = fr.CH;
          const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
          const g2 = cv.getContext('2d'); g2.imageSmoothingEnabled = false;
          const im = g2.createImageData(W, H), d = im.data;
          let sig = 0;
          for (let k = 0; k < fr.px.length; k++) {
            const q = fr.px[k]; if (!q) continue;
            d[k * 4] = q[0]; d[k * 4 + 1] = q[1]; d[k * 4 + 2] = q[2]; d[k * 4 + 3] = 255;
            sig = (sig * 31 + q[0] + k) >>> 0;
          }
          g2.putImageData(im, 0, 0);
          shots.push(cv.toDataURL('image/png')); sigs.push(sig);
          /* AND THE SAME PHASE FROM THE SIDE. Head-on, a walk reads as a bob: the stride is
             along the axis you are looking down. Rule 25 asks him to see the ACTUAL
             animation, and a walk you cannot see is not one, so the page carries both and
             the side row is where the step is actually legible. */
          const fe = buildFrame('E', 'walk', i / FRAMES);
          const cw = document.createElement('canvas'); cw.width = fe.CW; cw.height = fe.CH;
          const ge = cw.getContext('2d'); ge.imageSmoothingEnabled = false;
          const ie = ge.createImageData(fe.CW, fe.CH), de = ie.data;
          for (let k = 0; k < fe.px.length; k++) { const q2 = fe.px[k]; if (!q2) continue;
            de[k*4] = q2[0]; de[k*4+1] = q2[1]; de[k*4+2] = q2[2]; de[k*4+3] = 255; }
          ge.putImageData(ie, 0, 0); side.push(cw.toDataURL('image/png'));
          if (i === 0) {
            /* HEADS TALL OFF THE RIG PART GRID, the ruler this lane settled on after
               measuring a child from the top of her hair and landing six points out. */
            let bt = 1e9, bb = -1, ht = 1e9, hb = -1;
            for (let k = 0; k < fr.grid.length; k++) {
              const id = fr.grid[k]; if (!id) continue;
              const y = (k / W) | 0;
              if (y < bt) bt = y; if (y > bb) bb = y;
              if (id === 1 || id === 2) { if (y < ht) ht = y; if (y > hb) hb = y; }
            }
            bodyPx = bb - bt + 1; headPx = hb - ht + 1;
          }
        }
        /* HOW MANY OF THE FRAMES ARE ACTUALLY DIFFERENT. A cycle that is one pose eight
           times is a still pretending to be an animation, which is the exact thing rule 25
           was written about, so it is counted rather than assumed. */
        const distinct = new Set(sigs).size;
        o.bodies.push({ stage: c.stage, title: c.title, shots: shots, side: side,
                        distinct: distinct, frames: FRAMES,
                        bodyPx: bodyPx, headPx: headPx,
                        heads: headPx > 0 ? +(bodyPx / headPx).toFixed(2) : null });
      }
    } catch (e) { o.err = String(e && e.message || e); }
    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    return o;
  }, { WORN, CAST, FRAMES });
  await b.close();

  if (R.err) { console.error('THREW: ' + R.err); process.exit(3); }
  const flat = R.bodies.filter(x => x.distinct < 2);
  if (flat.length) {
    console.error('REFUSING TO WRITE: ' + flat.map(x => x.title).join(', ') + ' rendered the same');
    console.error('frame every time, so the "animation" would be a still. Rule 25 exists because');
    console.error('he was shown exactly that once already.');
    process.exit(4);
  }

  const adult = R.bodies.filter(x => x.stage === 'adult')[0];
  fs.mkdirSync(VOTE, { recursive: true });

  /* THE PAGE. Self-contained: the frames are baked in, so it plays with no network and no
     dependency on the alpha being loaded beside it. */
  const cells = R.bodies.map((bd, i) => `
    <figure>
      <canvas id="c${i}" width="112" height="112"></canvas>
      <figcaption><b>${bd.title}</b>
        <span>${bd.bodyPx} px tall, ${bd.heads} heads</span>
        <span>${Math.round(100 * bd.bodyPx / adult.bodyPx)}% of the grown man</span>
      </figcaption>
    </figure>`).join('');
  const html = `<!doctype html><meta charset="utf-8">
<title>THE KID WALKS</title>
<style>
  :root{ --tan:#b9a373; --ink:#3a2f1c; }
  html,body{ margin:0; background:var(--tan); color:var(--ink);
    font:13px ui-monospace,SFMono-Regular,Menlo,monospace; }
  .wrap{ padding:18px; }
  h1{ font-size:20px; margin:0 0 6px; letter-spacing:.5px; }
  p.sub{ margin:0 0 4px; }
  .row{ display:flex; gap:22px; align-items:flex-end; margin:22px 0 10px;
    border-bottom:1px solid rgba(58,47,28,.3); padding-bottom:0; }
  figure{ margin:0; text-align:left; }
  canvas{ width:224px; height:224px; image-rendering:pixelated; display:block; }
  figcaption{ padding:7px 0 12px; }
  figcaption b{ display:block; font-size:12px; }
  figcaption span{ display:block; font-size:11px; opacity:.85; }
  .beat{ margin-top:14px; font-size:11px; opacity:.8; }
  button{ font:inherit; background:#3a2f1c; color:#e8dcc0; border:0; padding:7px 13px;
    cursor:pointer; margin-right:8px; }
</style>
<div class="wrap">
  <h1>THE KID WALKS</h1>
  <p class="sub">same clothes, same build, same scale, feet on one line. only the age changes.</p>
  <p class="sub">playing at 120 beats a minute, one step per beat, which is the speed the game runs at.</p>
  <div class="row">${cells}</div>
  <p class="sub" style="margin-top:16px">and from the side, where you can actually see the step:</p>
  <div class="row">${R.bodies.map((bd, i) => `
    <figure><canvas id="s${i}" width="112" height="112"></canvas>
      <figcaption><b>${bd.title}</b></figcaption></figure>`).join('')}</div>
  <div class="beat">
    <button id="slow">HALF SPEED</button><button id="norm">GAME SPEED</button><button id="stop">HOLD STILL</button>
    <span id="rate"></span>
  </div>
  <p class="beat">the old man is not here on purpose: this lane measured that the rig's
  young adult, adult and elder are one body within three per cent, and that the three per
  cent is right, because real people barely shrink with age. an old man reads by his back,
  and bending a spine is the animation chat's job and in flight. the kid and the teen are
  real, so they are what you are looking at.</p>
</div>
<script>
const SHOTS = ${JSON.stringify(R.bodies.map(b2 => b2.shots))};
const SIDE = ${JSON.stringify(R.bodies.map(b2 => b2.side))};
const simgs = SIDE.map(set => set.map(u => { const i = new Image(); i.src = u; return i; }));
const sctxs = SIDE.map((_, i) => document.getElementById('s' + i).getContext('2d'));
sctxs.forEach(c => c.imageSmoothingEnabled = false);
const imgs = SHOTS.map(set => set.map(u => { const i = new Image(); i.src = u; return i; }));
const ctxs = SHOTS.map((_, i) => document.getElementById('c' + i).getContext('2d'));
ctxs.forEach(c => c.imageSmoothingEnabled = false);
/* ONE STEP IS ONE BEAT AT 120 BPM = 500 ms, and a cycle is ${FRAMES} frames, so a frame is
   500/${FRAMES} ms. Driven off the clock, not a frame counter, so it plays at the tempo the
   game actually runs at however slow the device is. */
let msPerBeat = 500, playing = true, t0 = performance.now();
const FR = ${FRAMES};
function tick(now){
  if (playing) {
    const f = Math.floor((now - t0) / (msPerBeat / FR)) % FR;
    ctxs.forEach((c, i) => { const im = imgs[i][f]; if (im && im.complete) {
      c.clearRect(0,0,112,112); c.drawImage(im, 0, 0); } });
    sctxs.forEach((c, i) => { const im = simgs[i][f]; if (im && im.complete) {
      c.clearRect(0,0,112,112); c.drawImage(im, 0, 0); } });
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
const rate = document.getElementById('rate');
const say = () => rate.textContent = playing ? (Math.round(60000/msPerBeat) + ' bpm') : 'held';
document.getElementById('slow').onclick = () => { msPerBeat = 1000; playing = true; say(); };
document.getElementById('norm').onclick = () => { msPerBeat = 500; playing = true; say(); };
document.getElementById('stop').onclick = () => { playing = !playing; say(); };
say();
</script>`;
  fs.writeFileSync(PAGE, html);

  const L = [];
  L.push('THE KID WALKS  --  CHARACTER lane, 9/24/26, [ages]');
  L.push('');
  L.push('THE ROW IS UN-HELD FOR THE MAKING and the instruction is exact: "the child and teen');
  L.push('are real and go to VOTE this round as BODIES THAT MOVE (rule 25)." His vote on the ages');
  L.push('item was "Both nigga" -- yes to kids on the street AND yes to building a proper old man.');
  L.push('');
  L.push('RULE 25 IS WHY THIS IS A PAGE AND NOT A PICTURE, in his words: "How dare you show me');
  L.push('pictures of animations and not the actual animation, never do that again." Every age');
  L.push('item this lane has shown him so far was a still. This one plays, at 120 beats a minute,');
  L.push('one step per beat, driven off the clock rather than a frame counter so it runs at the');
  L.push('tempo the game runs at on any device.');
  L.push('');
  L.push('  ' + 'WHO'.padEnd(14) + 'TALL'.padEnd(9) + 'HEADS'.padEnd(8) + 'OF THE ADULT'.padEnd(14) + 'FRAMES THAT DIFFER');
  for (const bd of R.bodies)
    L.push('  ' + bd.title.padEnd(14) + (bd.bodyPx + ' px').padEnd(9)
      + String(bd.heads).padEnd(8)
      + (Math.round(100 * bd.bodyPx / adult.bodyPx) + '%').padEnd(14)
      + bd.distinct + ' of ' + bd.frames);
  L.push('');
  L.push('THE LAST COLUMN IS THE ONE THAT MATTERS AND IT IS WHY THE TOOL CAN REFUSE. A cycle that');
  L.push('renders the same pose eight times is a STILL PRETENDING TO BE AN ANIMATION, which is');
  L.push('precisely the thing rule 25 was written about. So the frames are hashed and the tool');
  L.push('refuses to write the page if any body comes back with fewer than two distinct ones.');
  L.push('Nobody has to take my word that it moves.');
  L.push('');
  L.push('THE OLD MAN IS NOT IN IT, ON PURPOSE, and the page says so where he will read it. This');
  L.push('lane measured two rounds ago that the rig\'s young adult, adult and elder are ONE BODY');
  L.push('within three per cent, and that the three per cent is anatomically RIGHT -- real people');
  L.push('lose two to five centimetres over a lifetime. An old man reads by his BACK, and bending');
  L.push('a spine is ANIMATION [spine bend], which is theirs and in flight. Putting an "elder" in');
  L.push('this page would be putting a slightly shorter man in it and calling him old, which is');
  L.push('this lane\'s own [names lie] defect one screen further out.');
  L.push('');
  L.push('NOTHING NEW WAS DRAWN. The age stages have been in the rig since it was built and the');
  L.push('walk cycle is the game\'s own; this renders frames that already existed and nobody had');
  L.push('ever put next to each other at one scale.');
  L.push('');
  L.push('NOT WIRED (rule 18): the street is unchanged. The page is in VOTE.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  if (errs.length) console.log('\n  page errors: ' + errs.slice(0, 2).join(' | '));
  console.log('\n  wrote slices/vote/CHARACTER_THE_KID_WALKS.html  '
    + (fs.statSync(PAGE).size / 1024).toFixed(0) + ' KB');
})();
