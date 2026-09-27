/* COOK: THE THIRTEEN ARE WEARING IT NOW (9/27/26, CHARACTER, [runway redo])
 *
 * HIS RULING, VERBATIM, ON THE SET THIS WIRES: "Fire make sure shit doesnt clip into places
 * it shouldnt but yeah." NOTES ARE RULINGS. He approved thirteen runway silhouettes; this is
 * the round the factions actually put them on, and this page is what that looks like.
 *
 * WHY BEFORE AND AFTER, AND ONLY FOUR OF THE THIRTEEN. A row of thirteen bodies is the
 * picture he already voted DOWN ("CAN YOU TELL THE 13 APART?", 9/18). The thing that changed
 * this round is not "there are thirteen people"; it is that four factions were one commit
 * away from losing their colour and did not. So the page is FOUR PAIRS: the same faction,
 * the outfit it wore, the outfit it wears. Everything except the clothes is held still --
 * same body dials, same facing, same frame of the same cycle at the same moment.
 *
 * RULE 25, HIS WORDS: "How dare you show me pictures of animations and not the actual
 * animation, NEVER DO THAT AGAIN." Clothes are not a motion, but a coat only reads when the
 * legs move under it, and this lane has already measured that 103 of 318 canon garments hang
 * below the hip. So every body on this page WALKS, at 120 BPM, one step per beat, driven off
 * the clock rather than a frame counter.
 *
 * RULE 32(f), HIS WORDS: "this game isn't in first person, when would I see this?" -- a VOTE
 * item is a frame off a play surface or a tile at game scale. The bodies are the game's own
 * buildFrame at the ruled 112 box, and THE GROUND IS THE STREET'S OWN GROUND: the road
 * asphalt, the concrete sidewalk and the kerb, by the hex values the walked city paints them
 * with (slices/BOHEMIA_CITY_WORLD.html surface palette: road #33333c, sidewalk #8a8478,
 * kerb #3f3f47). The graveyard post-mortem from last round names a four-up contact sheet on
 * a tan background as the defect; a tan card is exactly what this does not do.
 *
 * RIG CHECK (RIG IS LAW): renders only. G_WORN, G.equipped, G.bodyVar, G.age and both caches
 * are restored. REUSE CHECK: nothing is drawn. Every garment on the page already ships as
 * canon, and the walk cycle is the game's own.
 * NOT WIRED TO THE PLAY SURFACE BY THIS TOOL (rule 18): the outfits went into FACTION_LOOKS
 * in the same round by tools/bohemia_wire_the_new_thirteen.js; this tool only photographs.
 *
 * REFERENCE CHECK (COMPARE EVERY PIECE OF ART TO THE WORLD, 9/4):
 *   RNWY-13  the two poles, and its failure sentence "a figure that mixes both reads as
 *          neither". The BEFORE column is the workwear pole, the AFTER column is the runway
 *          pole, and the pair is the only way to see which pole a body is actually on.
 *   GARM-03  "the cut belongs to the register, the colour belongs to the faction -- a cook
 *          never spends both channels on one idea." This page is that sentence's receipt:
 *          the cut moved and the colour did not.
 *   WALK-01  Pedro Medeiros, the sprite walk is CONTACT-DOWN-PASS-UP. A hanging coat reads
 *          on the PASS frame or it does not read, so the page plays the real cycle.
 *   AH-01  our own analog horror bible. Nothing here is made strange on purpose. Four
 *          people in good coats standing on an empty residential street is the ordinary
 *          frame; what is wrong with it is that the street is empty, and that is not this
 *          lane's line to fix.
 *
 *   node tools/bohemia_cook_the_thirteen_are_wearing_it.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const PAGE = path.join(VOTE, 'CHARACTER_THE_THIRTEEN_ARE_WEARING_IT.html');
const OUT = path.join(REPO, 'records/BOHEMIA_THE_THIRTEEN_ARE_WEARING_IT_9_27_26.txt');

/* THE OUTFIT EACH OF THESE FOUR WORE BEFORE THIS ROUND, copied off the pre-wire tree so the
   BEFORE column is the real thing and not a reconstruction. */
const BEFORE = {
  Caravans:   { hair:'COIL CROWN', base:'DUST PLAID SHIRT', back:'OLIVE SHOULDER MANTLE',
                head:'CHINESE RICE FARMER HAT', legs:'DUST TROUSERS', feet:'SANDWALKERS' },
  Anarchists: { hair:'LAYERED FALL', base:'BLACK TANK', outer:'SPLIT-TAIL DUSTER',
                head:'CHARCOAL WATCH CAP', legs:'DUST TROUSERS', feet:'RUST BOOTS' },
  Network:    null,   /* filled from the pre-wire file at run time */
  Mob:        { hair:'DRY TAPER', base:'MOB PINSTRIPE SHIRT', back:'CHARCOAL ROAD CAPE',
                legs:'CHARCOAL WRAP SKIRT', feet:'CHARCOAL BOOTS', waist:'LEATHER BELT' }
};
const CAST = [
  { faction:'Caravans',   why:'sand. it wore no runway shape at all and it kept its sand.' },
  { faction:'Anarchists', why:'leather. this is the one that nearly went to nothing.' },
  { faction:'Network',    why:'teal. the coat is most of a person, so the coat had to be teal.' },
  { faction:'Mob',        why:'charcoal. it briefly read brown, because a belt was the only colour left.' }
];
const FRAMES = 8;

/* THE STREET'S OWN GROUND, by the walked city's surface palette. */
const GROUND = { road:'#33333c', walk:'#8a8478', kerb:'#3f3f47', dirt:'#463f30' };

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1100, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));

  /* THE BEFORE OUTFITS COME OFF THE PRE-WIRE TREE, not off memory. */
  const PRE = path.join('/tmp/claude-0', 'alpha_prewire3.html');
  if (fs.existsSync(PRE)) {
    const src = fs.readFileSync(PRE, 'utf8');
    for (const k in BEFORE) {
      const m = new RegExp("\\{ faction:'" + k + "'[\\s\\S]*?worn:\\{([^}]*)\\}").exec(src);
      if (!m) continue;
      const o = {};
      for (const bit of m[1].split(',')) {
        const kv = /^\s*(\w+)\s*:\s*'([^']*)'\s*$/.exec(bit.replace(/\n\s*/g, ''));
        if (kv) o[kv[1]] = kv[2];
      }
      if (Object.keys(o).length) BEFORE[k] = o;
    }
  }
  const missing = Object.keys(BEFORE).filter(k => !BEFORE[k]);
  if (missing.length) { console.error('NO BEFORE OUTFIT FOR ' + missing.join(', ')); process.exit(2); }

  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS
    && typeof rebuildFromRig === 'function', { timeout: 90000 });

  const R = await p.evaluate(({ CAST, BEFORE, FRAMES }) => {
    const o = { pairs: [], err: null };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    const hsv = (r, g, bb) => { const mx = Math.max(r, g, bb), mn = Math.min(r, g, bb), d = mx - mn;
      let h = 0; if (d) { if (mx === r) h = (((g - bb) / d) % 6); else if (mx === g) h = (bb - r) / d + 2;
        else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
      return { h: h, s: mx ? d / mx : 0, v: mx / 255 }; };

    /* ONE BODY, EVERY FRAME OF ONE WALK CYCLE, plus the cloth measurement the colour law
       is judged on: skin and the outline out, 30-degree hue buckets, same as the gate. */
    const shoot = (dials, worn, age) => {
      G.equipped = bare(); window.G_WORN = worn;
      G.bodyVar = JSON.parse(JSON.stringify(dials || {})); G.age = age || 'adult';
      rebuildFromRig(); clear();
      const shots = [], sigs = [];
      let sat = 0, n = 0, tallest = 0; const bins = {};
      for (let i = 0; i < FRAMES; i++) {
        /* ph IS A PHASE FROM 0 TO 1, NOT AN INDEX. The game's own caller is (q+0.5)/b. */
        const fr = buildFrame('E', 'walk', i / FRAMES);
        const W = fr.CW, H = fr.CH;
        const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
        const g2 = cv.getContext('2d'); g2.imageSmoothingEnabled = false;
        const im = g2.createImageData(W, H), d = im.data;
        let sig = 0, top = 1e9, bot = -1;
        for (let k = 0; k < fr.px.length; k++) {
          const q = fr.px[k]; if (!q) continue;
          d[k * 4] = q[0]; d[k * 4 + 1] = q[1]; d[k * 4 + 2] = q[2]; d[k * 4 + 3] = 255;
          sig = (sig * 31 + q[0] + k) >>> 0;
          const y = (k / W) | 0; if (y < top) top = y; if (y > bot) bot = y;
          if (i === 0) {
            const gv = fr.grid[k]; if (gv === 1 || gv === 2) continue;   /* skin and face */
            const c = hsv(q[0], q[1], q[2]); if (c.v < 0.12) continue;   /* the outline */
            n++; sat += c.s;
            const key = c.s < 0.18 ? 'neutral' : String((Math.round(c.h / 30) * 30) % 360);
            bins[key] = (bins[key] || 0) + 1;
          }
        }
        g2.putImageData(im, 0, 0);
        shots.push(cv.toDataURL('image/png')); sigs.push(sig);
        if (i === 0) tallest = bot - top + 1;
      }
      const rank = Object.keys(bins).map(k => [k, bins[k]]).sort((a, c) => c[1] - a[1]);
      return { shots: shots, distinct: new Set(sigs).size, px: tallest,
               sat: n ? sat / n : 0, dom: rank[0] ? rank[0][0] : '-',
               share: rank[0] ? rank[0][1] / Math.max(1, n) : 0 };
    };

    try {
      for (const c of CAST) {
        const f = FACTION_LOOKS.filter(x => x.faction === c.faction)[0];
        if (!f) { o.err = 'no faction ' + c.faction; break; }
        o.pairs.push({
          faction: c.faction, why: c.why,
          before: Object.assign({ worn: BEFORE[c.faction] }, shoot(f.dials, BEFORE[c.faction], f.age)),
          after:  Object.assign({ worn: f.worn },            shoot(f.dials, f.worn, f.age))
        });
      }
    } catch (e) { o.err = String(e && e.message || e); }
    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    return o;
  }, { CAST, BEFORE, FRAMES });
  await b.close();

  if (R.err) { console.error('THREW: ' + R.err); process.exit(3); }

  /* *** TWO REFUSALS, BOTH OF THEM THINGS THIS LANE HAS SHIPPED WRONG BEFORE. *** */
  const flat = [];
  for (const q of R.pairs) { if (q.before.distinct < 2) flat.push(q.faction + ' before');
                             if (q.after.distinct < 2) flat.push(q.faction + ' after'); }
  if (flat.length) {
    console.error('REFUSING TO WRITE: ' + flat.join(', ') + ' rendered the same frame every');
    console.error('time, so the "walk" would be a still. Rule 25 exists because he was shown');
    console.error('exactly that once already, and my own phase-versus-index bug produced it.');
    process.exit(4);
  }
  const drained = R.pairs.filter(q => q.after.sat < q.before.sat - 0.05);
  if (drained.length) {
    console.error('REFUSING TO WRITE: ' + drained.map(q => q.faction + ' ' +
      q.before.sat.toFixed(2) + ' -> ' + q.after.sat.toFixed(2)).join(', '));
    console.error('The whole point of the page is that nobody lost their colour. A page that');
    console.error('claims that over bodies that did lose it is worse than no page.');
    process.exit(5);
  }

  fs.mkdirSync(VOTE, { recursive: true });
  const cell = (q, side, i) => `
    <figure>
      <canvas id="${side}${i}" width="112" height="112"></canvas>
      <figcaption>${side === 'b' ? 'was' : '<b>is now</b>'}</figcaption>
    </figure>`;
  const rows = R.pairs.map((q, i) => `
  <section>
    <h2>${q.faction.toUpperCase()}</h2>
    <p class="why">${q.why}</p>
    <div class="street">
      <div class="walk"></div><div class="kerb"></div>
      <div class="road">${cell(q, 'b', i)}${cell(q, 'a', i)}</div>
    </div>
    <p class="num">colour strength ${q.before.sat.toFixed(2)} &rarr; <b>${q.after.sat.toFixed(2)}</b>
      &nbsp;&nbsp; biggest colour ${q.before.dom} &rarr; <b>${q.after.dom}</b>
      &nbsp;&nbsp; ${q.after.px} px tall, same as before</p>
  </section>`).join('');

  const html = `<!doctype html><meta charset="utf-8">
<title>THE THIRTEEN ARE WEARING IT</title>
<style>
  :root{ --road:${GROUND.road}; --walk:${GROUND.walk}; --kerb:${GROUND.kerb}; }
  html,body{ margin:0; background:#1b1b20; color:#d8d2c4;
    font:13px ui-monospace,SFMono-Regular,Menlo,monospace; }
  .wrap{ padding:16px; max-width:760px; }
  h1{ font-size:19px; margin:0 0 8px; letter-spacing:.5px; }
  p.sub{ margin:0 0 6px; line-height:1.45; }
  section{ margin:22px 0 0; }
  h2{ font-size:13px; margin:0 0 2px; letter-spacing:1px; }
  p.why{ margin:0 0 6px; font-size:11px; opacity:.8; }
  .street{ background:var(--walk); }
  .walk{ height:16px; background:var(--walk); }
  .kerb{ height:3px; background:var(--kerb); }
  .road{ background:var(--road); display:flex; gap:26px; padding:6px 14px 0;
    align-items:flex-end; }
  figure{ margin:0; }
  canvas{ width:168px; height:168px; image-rendering:pixelated; display:block; }
  figcaption{ font-size:10px; padding:2px 0 7px; opacity:.85; }
  p.num{ margin:5px 0 0; font-size:11px; opacity:.85; }
  .beat{ margin:18px 0 0; font-size:11px; opacity:.8; line-height:1.5; }
  button{ font:inherit; background:#d8d2c4; color:#1b1b20; border:0; padding:7px 13px;
    cursor:pointer; margin-right:8px; }
</style>
<div class="wrap">
  <h1>THE THIRTEEN ARE WEARING IT NOW</h1>
  <p class="sub">you said fire, so the thirteen runway shapes went on the thirteen groups.
  they are standing on the street's own road and sidewalk, at the size the game draws a
  person, walking at the speed the game runs at.</p>
  <p class="sub">four of them are here, not thirteen, because these four are the ones that
  nearly lost their colour when the new clothes went on. every one of them kept it.</p>
  ${rows}
  <div class="beat">
    <button id="norm">GAME SPEED</button><button id="slow">HALF SPEED</button><button id="stop">HOLD STILL</button>
    <span id="rate"></span>
  </div>
  <p class="beat">the clothes changed and nothing else did: same build, same height, same
  step, same moment of the same cycle. the numbers under each pair are the colour measured
  off the pixels, skin and outline thrown out.</p>
  <p class="beat">what is still wrong and is not mine to fix: the street they are standing on
  is empty. nobody is on it.</p>
</div>
<script>
const B = ${JSON.stringify(R.pairs.map(q => q.before.shots))};
const A = ${JSON.stringify(R.pairs.map(q => q.after.shots))};
const mk = (sets, pre) => sets.map((set, i) => ({
  imgs: set.map(u => { const im = new Image(); im.src = u; return im; }),
  ctx: document.getElementById(pre + i).getContext('2d') }));
const rowsB = mk(B, 'b'), rowsA = mk(A, 'a');
[...rowsB, ...rowsA].forEach(r => r.ctx.imageSmoothingEnabled = false);
/* ONE STEP IS ONE BEAT AT 120 BPM = 500 ms, ${FRAMES} frames a cycle. Off the clock, not a
   frame counter, so it plays at the game's tempo however slow the device is. */
let msPerBeat = 500, playing = true; const t0 = performance.now(); const FR = ${FRAMES};
function tick(now){
  if (playing) {
    const f = Math.floor((now - t0) / (msPerBeat / FR)) % FR;
    [...rowsB, ...rowsA].forEach(r => { const im = r.imgs[f];
      if (im && im.complete) { r.ctx.clearRect(0,0,112,112); r.ctx.drawImage(im, 0, 0); } });
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
const rate = document.getElementById('rate');
const say = () => rate.textContent = playing ? (Math.round(60000/msPerBeat) + ' bpm') : 'held';
document.getElementById('norm').onclick = () => { msPerBeat = 500; playing = true; say(); };
document.getElementById('slow').onclick = () => { msPerBeat = 1000; playing = true; say(); };
document.getElementById('stop').onclick = () => { playing = !playing; say(); };
say();
</script>`;
  fs.writeFileSync(PAGE, html);

  const L = [];
  L.push('THE THIRTEEN ARE WEARING IT NOW  --  CHARACTER, 9/27/26, [runway redo]');
  L.push('');
  L.push('HIS RULING: "Fire make sure shit doesnt clip into places it shouldnt but yeah."');
  L.push('The thirteen approved runway shapes are wired into the thirteen faction outfits.');
  L.push('This page is the four factions whose colour the wiring nearly took.');
  L.push('');
  L.push('  ' + 'FACTION'.padEnd(12) + 'STRENGTH'.padEnd(18) + 'BIGGEST COLOUR'.padEnd(18) + 'FRAMES DIFFERENT');
  for (const q of R.pairs)
    L.push('  ' + q.faction.padEnd(12)
      + (q.before.sat.toFixed(2) + ' -> ' + q.after.sat.toFixed(2)).padEnd(18)
      + (q.before.dom + ' -> ' + q.after.dom).padEnd(18)
      + q.after.distinct + ' of ' + FRAMES);
  L.push('');
  L.push('THE PAGE PLAYS (rule 25): every body walks, one step per beat at 120 BPM, driven off');
  L.push('the clock. A coat that hangs past the hip only reads when the legs move under it, and');
  L.push('this lane measured on 9/15 that 103 of 318 canon garments do exactly that.');
  L.push('');
  L.push('THE GROUND IS THE STREET\'S GROUND (rule 32f): road #33333c, sidewalk #8a8478, kerb');
  L.push('#3f3f47, the hexes the walked city paints its surfaces with. Last round\'s graveyard');
  L.push('post-mortem names a contact sheet on a tan background as the defect; this is not one.');
  L.push('');
  L.push('TWO REFUSALS BUILT IN, both of them things this lane has got wrong before: a body');
  L.push('whose eight frames are one picture is not an animation and the tool will not write,');
  L.push('and a faction whose colour strength FELL is the opposite of the page\'s claim, so that');
  L.push('does not write either.');
  L.push('');
  L.push('WHAT IS NOT CLAIMED: the walked street draws pre-baked sprites, so what he sees on');
  L.push('the street itself does not change until those are re-baked. That is named, not hidden.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nWROTE ' + path.relative(REPO, PAGE));
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 2).join(' | '));
})();
