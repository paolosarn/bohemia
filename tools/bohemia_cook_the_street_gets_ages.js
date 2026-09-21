/* COOK: THE STREET IN THE SHARES THE COUNTY HAS (9/22/26, CHARACTER lane, [ages])
 *
 * THE ROW, IN THE COORDINATOR'S WORDS (VAMILY 05, HELD [ages], off this lane's e357361):
 * "the rig carries five age stages and exactly one body in the alpha uses one (Nina); the
 * twelve street looks carry no age field, so every person he walks past is a grown adult.
 * THE COORDINATOR'S DEFAULT: the street gets ages in the shares the real county has, at one
 * scale with feet on one line. HELD under rule 18; ships the round the hold lifts."
 * So this is that picture, and NOTHING IS WIRED.
 *
 * THE TWELVE ARE THE GAME'S OWN. CITY_CAST_LOOKS, read out of the alpha at run time, not
 * retyped here -- the same twelve people he actually walks past, in the same clothes, with
 * the same build dials. The ONLY thing this changes is one field per person. That is the
 * point: if he likes it, [ages] is twelve `age:` fields and nothing else moves.
 *
 * GROUNDED IN THE REAL, WHICH IS THE HOUSE RULE, and the repo's own precedent is the model.
 * engine/bohemia_people.js grounded the NAME pool in Clark County's real ethnic shares and
 * said so in its own comment: "This valley is the corpse of Clark County, Nevada... A name
 * pool that is all Anglo would be a lie about the city the game is set in." Ages get the
 * same treatment, from the same county.
 *   SOURCE, AND THE LIMIT ON IT, SAID PLAINLY: US Census QuickFacts and ACS figures for
 *   Clark County, Nevada -- under 18 21.9%, 65 and over 16.3% (QuickFacts), and the band
 *   breakdown under 15 18.2%, 15-24 12.0%, 25-44 28.9%, 45-64 25.0%, 65+ 15.9% (ACS),
 *   median age 39. I COULD NOT OPEN census.gov FROM THIS CONTAINER -- the network policy
 *   blocks it -- so these came from two independent search summaries that agreed with each
 *   other (16.3 against 15.9 for the same 65+ figure, which is QuickFacts vintage against
 *   ACS vintage, not a contradiction). That is weaker than reading the table myself and it
 *   is written down rather than smoothed over. Anybody who can reach census.gov should
 *   check the two numbers this leans on.
 *
 * THE MAPPING FROM CENSUS BANDS TO THE RIG'S FIVE STAGES, shown so it can be argued with:
 *   child 0-12, teen 13-19, youngadult 20-29, adult 30-64, elder 65+, split proportionally
 *   inside each census band. Whole population: child 15.8, teen 8.4, youngadult 13.2,
 *   adult 46.7, elder 15.9.
 *
 * AND THEN ONE CORRECTION THAT IS NOT IN THE CENSUS: THE STREET IS WALKERS. Under-fives are
 * carried, not walking, and the rig HAS NO INFANT BODY -- its child stage is built at about
 * eight years old (h 0.77, from the rig's own note "~8yr is 6.0/7.75 of adult head-count").
 * So the 5.5% under five comes out and the rest is renormalised. Walking shares:
 *   child 10.9   teen 8.9   youngadult 14.0   adult 49.4   elder 16.8
 * On twelve people that deals as 1 child, 1 teen, 2 young adults, 6 adults, 2 elders.
 *
 * *** THE FINDING, AND IT IS ARITHMETIC RATHER THAN ART. *** There is an obvious objection
 * to using the LIVE county's shares for a valley that is TEN YEARS COLD (7/31): a decade
 * without power in the Mojave kills the old first -- heat, insulin, dialysis, air
 * conditioning -- and births collapse, so anybody now under ten was born after the crash.
 * Halve the children and cut the elders to a third and the shares become child 6.5, teen
 * 10.7, youngadult 16.8, adult 59.3, elder 6.7.
 *   ON TWELVE PEOPLE THOSE TWO ANSWERS DIFFER BY ONE PERSON. On the 183 bodies his phone
 *   actually draws they differ by 19 elders and 8 children. So the choice is INVISIBLE on
 *   any vote sheet and LOUD on the street, which means a picture cannot settle it and a
 *   crowd can. That is why this cook ships ONE row of shares and not two nearly identical
 *   ones pretending to be a choice.
 *   THE MULTIPLIERS ARE REASONING, NOT MEASUREMENT, and they are labelled that way
 *   everywhere they appear. No canon is invented: nothing here says what the valley's
 *   shares ARE, only what the two candidate rules produce.
 *
 * RIG CHECK (RIG IS LAW): reads only. G_WORN, G.equipped, G.bodyVar, G.age and both caches
 * are restored. Nothing is written into the game.
 * REUSE CHECK: nothing is drawn. Twelve existing looks, existing garments, the existing age
 * machinery. The diff a yes-vote would produce is twelve `age:` fields.
 * NOT SHIPPED (rule 18). The row is HELD. Rule 22(b): the making goes to VOTE.
 *
 * REFERENCE CHECK (COMPARE EVERY PIECE OF ART TO THE WORLD, 9/4):
 *   FACE-02  classical figure construction and the head count, the ruler this lane now uses
 *          for every age claim: the head is a rigid stamp, so a shorter body carries the
 *          same head and heads-tall falls. Measured here on one ruler across all 24 bodies
 *          and printed, so "that child looks like a small adult" is a number, not a taste.
 *   AH-01  our own analog horror bible, the ordinary frame with one wrong thing. A street
 *          with a kid and two old people on it is the ORDINARY frame -- and the bible's own
 *          line is "a crowd thin where the census says full". This cook is the census half
 *          of that sentence: you cannot feel a crowd is wrong until it is right first.
 *   GARM-03  the wardrobe's locked laws, the cut belongs to the register. Every garment is
 *          untouched from the twelve looks, so a body that changed age did not change
 *          class, and any read of "poorer" or "older" comes from the BODY alone.
 *
 *   node tools/bohemia_cook_the_street_gets_ages.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const OUT = path.join(REPO, 'records/BOHEMIA_THE_STREET_IN_THE_SHARES_THE_COUNTY_HAS_9_22_26.txt');

/* THE WALKING SHARES, derived above from the census bands. Kept as data so the deal is
   reproducible and so the next lane can change ONE line if the county figures are refreshed. */
const WALK_SHARES = { child: 10.9, teen: 8.9, youngadult: 14.0, adult: 49.4, elder: 16.8 };

/* THE DEAL IS A RULE, NOT A CASTING SESSION. Largest-remainder over the twelve looks IN
   THEIR OWN ORDER, so nobody can accuse the picture of putting the kid in the cutest outfit.
   Whoever wires [ages] can ship this exact function and get this exact street. */
function dealAges(shares, names) {
  const n = names.length;
  const base = {}, rem = [];
  let used = 0;
  for (const k in shares) { base[k] = Math.floor(shares[k] * n / 100); used += base[k]; }
  for (const k in shares) rem.push([k, shares[k] * n / 100 - base[k]]);
  rem.sort((a, b) => b[1] - a[1]);
  for (let i = 0; i < n - used; i++) base[rem[i][0]]++;
  /* ORDER: the big stage must not occupy one contiguous block, or the row reads
     old-old-old-young-young and that is an artefact of the loop rather than of the shares.
     So the stages are interleaved largest-first, round robin, until the row is full. */
  const byStage = {};
  for (const k in base) if (base[k] > 0) byStage[k] = base[k];
  const stages = Object.keys(byStage).sort((a, b) => byStage[b] - byStage[a]);
  const seq = [];
  while (seq.length < n) for (const s of stages) if (byStage[s] > 0 && seq.length < n) { seq.push(s); byStage[s]--; }
  return { counts: base, seq: seq };
}

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.CITY_CAST_LOOKS
    && typeof rebuildFromRig === 'function' && window.BOH_AGE, { timeout: 90000 });

  const names = await p.evaluate(() => CITY_CAST_LOOKS.map(l => l.id));
  const deal = dealAges(WALK_SHARES, names);

  const R = await p.evaluate(({ seq, counts }) => {
    const o = { made: [], errs: [] };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };

    const draw = (look, stage) => {
      G.equipped = bare(); window.G_WORN = look.worn;
      G.bodyVar = JSON.parse(JSON.stringify(look.dials || {})); G.age = stage;
      rebuildFromRig(); clear();
      const fr = buildFrame('S', 'idle', 0);
      const W = fr.CW, H = fr.CH;
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const g2 = c.getContext('2d'); g2.imageSmoothingEnabled = false;
      const im = g2.createImageData(W, H), d = im.data;
      let row0 = 0;
      for (let i = 0; i < fr.px.length; i++) {
        const q = fr.px[i]; if (!q) continue;
        d[i * 4] = q[0]; d[i * 4 + 1] = q[1]; d[i * 4 + 2] = q[2]; d[i * 4 + 3] = 255;
        if (i < W) row0++;
      }
      g2.putImageData(im, 0, 0);
      /* HEADS TALL OFF THE RIG PART GRID (1,2 head; 0 is hair and cloth on no bone), the
         ruler this lane settled on after measuring a child from the top of her hair and
         landing six points off the stage's own number. */
      let bt = 1e9, bb = -1, ht = 1e9, hb = -1;
      for (let i = 0; i < fr.grid.length; i++) {
        const id = fr.grid[i]; if (!id) continue;
        const y = (i / W) | 0;
        if (y < bt) bt = y; if (y > bb) bb = y;
        if (id === 1 || id === 2) { if (y < ht) ht = y; if (y > hb) hb = y; }
      }
      const headPx = hb - ht + 1, bodyPx = bb - bt + 1;
      return { cv: c, H: H, W: W, bodyPx: bodyPx, row0: row0,
               heads: headPx > 0 ? +(bodyPx / headPx).toFixed(2) : null };
    };

    let today = null, aged = null, strip = null;
    const STAGE_ORDER = ['child', 'teen', 'youngadult', 'adult', 'elder'];
    try {
      today = CITY_CAST_LOOKS.map(l => draw(l, 'adult'));
      aged  = CITY_CAST_LOOKS.map((l, i) => draw(l, seq[i]));
      /* THE PROOF STRIP: ONE look, all five stages, so the question "can you tell?" is
         asked with everything else held still. Added after the twelve came out and four of
         the six changed bodies were indistinguishable from the adults beside them. */
      strip = STAGE_ORDER.map(s => draw(CITY_CAST_LOOKS[0], s));
    } catch (e) { o.errs.push(String(e && e.message || e)); }

    if (today && aged && strip) {
      const N = today.length, CELL = 104, PAD = 18, HEAD = 56, ROWLAB = 20, LAB = 40, GAP = 30;
      const BODY = 176, SBODY = 150, SCELL = 118, SLAB = 40;
      const cv = document.createElement('canvas');
      cv.width = N * CELL + PAD * 2;
      cv.height = HEAD + ROWLAB + SBODY + SLAB + GAP
                + (ROWLAB + BODY) * 2 + 14 + LAB + GAP + PAD;
      const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
      g.fillStyle = '#b9a373'; g.fillRect(0, 0, cv.width, cv.height);
      g.fillStyle = '#3a2f1c'; g.textBaseline = 'top';
      g.font = 'bold 20px ui-monospace, monospace';
      g.fillText('THE TWELVE PEOPLE ON YOUR STREET, IF THE STREET HAD AGES', PAD, PAD);
      g.font = '13px ui-monospace, monospace';
      g.fillText('same twelve people, same clothes, same build. one field changes. one scale, feet on one line.',
                 PAD, PAD + 24);

      /* ---- THE PROOF STRIP ------------------------------------------------------- */
      const sScale = SBODY / strip[0].H;
      g.fillStyle = '#3a2f1c'; g.font = 'bold 13px ui-monospace, monospace';
      g.fillText('FIRST, THE SAME MAN AT ALL FIVE AGES THE GAME HAS. CAN YOU TELL THE LAST THREE APART?',
                 PAD, HEAD);
      const sFloor = HEAD + ROWLAB + SBODY;
      g.strokeStyle = 'rgba(58,47,28,0.30)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(PAD, sFloor + 0.5); g.lineTo(PAD + 5 * SCELL, sFloor + 0.5); g.stroke();
      strip.forEach((m, i) => {
        const x = PAD + i * SCELL;
        const w = Math.round(m.W * sScale), h = Math.round(m.H * sScale);
        g.drawImage(m.cv, x + (SCELL - w) / 2, sFloor - h, w, h);
        const dead = i >= 2;              /* youngadult, adult, elder: within 3% of each other */
        g.fillStyle = dead ? '#6b2f1c' : '#3a2f1c';
        g.font = 'bold 12px ui-monospace, monospace';
        g.fillText(STAGE_ORDER[i] === 'youngadult' ? 'young adult' : STAGE_ORDER[i], x + 3, sFloor + 6);
        g.font = '11px ui-monospace, monospace';
        g.fillText(m.bodyPx + ' px, ' + m.heads + ' heads', x + 3, sFloor + 21);
      });
      g.fillStyle = '#6b2f1c'; g.font = 'bold 12px ui-monospace, monospace';
      g.fillText('THE LAST THREE ARE ONE MAN, THREE TIMES. THE GAME HAS NO OLD PEOPLE.',
                 PAD + 5 * SCELL + 16, sFloor + 6);
      g.fillStyle = '#3a2f1c'; g.font = '11px ui-monospace, monospace';
      g.fillText('and the 3% is CORRECT: real people barely shrink with age.',
                 PAD + 5 * SCELL + 16, sFloor + 22);
      g.fillText('an old man reads by his back, his hair and his face, never his height.',
                 PAD + 5 * SCELL + 16, sFloor + 36);

      const scale = BODY / today[0].H;
      const rowAt = (y0, label, shots, tags) => {
        g.fillStyle = '#3a2f1c'; g.font = 'bold 13px ui-monospace, monospace';
        g.fillText(label, PAD, y0);
        const floor = y0 + ROWLAB + BODY;
        g.strokeStyle = 'rgba(58,47,28,0.30)'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(PAD, floor + 0.5); g.lineTo(cv.width - PAD, floor + 0.5); g.stroke();
        shots.forEach((m, i) => {
          const x = PAD + i * CELL;
          const w = Math.round(m.W * scale), h = Math.round(m.H * scale);
          g.drawImage(m.cv, x + (CELL - w) / 2, floor - h, w, h);
          if (tags) {
            const t = tags[i];
            /* THE LABELS THAT DO NOT READ ARE MARKED AS SUCH. A caption claiming an age the
               pixels do not show is this lane's own [names lie] defect, one screen further
               out, and it is the thing that must never reach the tab he judges in. */
            const dead = (t === 'elder' || t === 'youngadult');
            g.fillStyle = t === 'adult' ? 'rgba(58,47,28,0.45)' : (dead ? '#6b2f1c' : '#3a2f1c');
            g.font = (t === 'adult' ? '' : 'bold ') + '11px ui-monospace, monospace';
            g.fillText(t === 'youngadult' ? 'young adult' : t, x + 3, floor + 6);
            if (dead) { g.font = '10px ui-monospace, monospace';
                        g.fillText('(you cannot tell)', x + 3, floor + 20); }
          }
        });
      };
      const yTop = HEAD + ROWLAB + SBODY + SLAB + GAP;
      rowAt(yTop, 'TODAY -- every single one of them is a grown adult', today, null);
      /* THE TOP ROW CARRIES NO TAGS, so it does not need the label band the bottom row
         needs. Leaving it in printed a blank strip that reads as a rendering fault. */
      const y2 = yTop + ROWLAB + BODY + 14 + GAP;
      rowAt(y2, 'WITH AGES -- ' + counts.child + ' child, ' + counts.teen + ' teen, '
        + counts.youngadult + ' young adults, ' + counts.adult + ' adults, ' + counts.elder
        + ' elders, the shares Clark County actually has. THE CHILD AND THE TEEN READ. THE REST DO NOT.',
        aged, seq);
      o.sheet = cv.toDataURL('image/png');
      o.strip = STAGE_ORDER.map((s, i) => ({ stage: s, bodyPx: strip[i].bodyPx, heads: strip[i].heads }));
      o.made = CITY_CAST_LOOKS.map((l, i) => ({
        id: l.id, stage: seq[i],
        todayPx: today[i].bodyPx, agedPx: aged[i].bodyPx,
        todayHeads: today[i].heads, agedHeads: aged[i].heads,
        row0: aged[i].row0 }));
    }

    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    return o;
  }, { seq: deal.seq, counts: deal.counts });
  await b.close();

  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  if (R.errs && R.errs.length) { console.error('THE RENDER THREW: ' + R.errs.join(' | ')); process.exit(3); }
  fs.mkdirSync(VOTE, { recursive: true });
  const f = path.join(VOTE, 'CHARACTER_THE_STREET_GETS_AGES.png');
  fs.writeFileSync(f, Buffer.from(R.sheet.split(',')[1], 'base64'));

  const clipped = R.made.filter(m => m.row0 > 0);
  const changed = R.made.filter(m => m.stage !== 'adult');
  const L = [];
  L.push('THE STREET IN THE SHARES THE COUNTY HAS  --  CHARACTER lane, 9/22/26, [ages]');
  L.push('');
  L.push('THE ROW: the rig has carried five age stages since it was built and exactly ONE body');
  L.push('in the alpha uses one. The twelve street looks carry no age field, so every person he');
  L.push('walks past is a grown adult. The coordinator\'s default is that the street gets ages in');
  L.push('the shares the real county has. This is that street. NOTHING IS WIRED: HELD, rule 18.');
  L.push('');
  L.push('THE TWELVE ARE THE GAME\'S OWN, read out of the alpha at run time. Same clothes, same');
  L.push('build dials, same order. ONE FIELD CHANGES PER PERSON, and ' + changed.length + ' of 12 change at all.');
  L.push('');
  L.push('  WALKING SHARES (census bands, minus the under-fives, renormalised)');
  L.push('    child 10.9   teen 8.9   young adult 14.0   adult 49.4   elder 16.8');
  L.push('  DEALT OVER TWELVE, largest remainder, in the looks\' own order');
  L.push('    ' + JSON.stringify(deal.counts));
  L.push('');
  for (const m of R.made)
    L.push('  ' + m.id.padEnd(10) + (m.stage === 'adult' ? '(unchanged)' : '-> ' + m.stage).padEnd(18)
      + String(m.todayPx).padStart(3) + ' px -> ' + String(m.agedPx).padStart(3) + ' px   '
      + m.todayHeads + ' -> ' + m.agedHeads + ' heads tall');
  L.push('');
  L.push('*** AND THEN THE PICTURE TOLD ME THE ROW IS ONLY HALF POSSIBLE. ***');
  L.push('I dealt the shares, rendered the twelve, AND LOOKED AT IT. Four of the six changed');
  L.push('bodies are indistinguishable from the adults standing next to them. So I measured the');
  L.push('five stages on ONE look with everything else held still:');
  L.push('');
  for (const s of R.strip)
    L.push('    ' + (s.stage === 'youngadult' ? 'young adult' : s.stage).padEnd(12)
      + String(s.bodyPx).padStart(3) + ' px   ' + s.heads + ' heads tall');
  L.push('');
  L.push('  CHILD AND TEEN ARE REAL PEOPLE. YOUNG ADULT, ADULT AND ELDER ARE ONE MAN, THREE');
  L.push('  TIMES: 0.97, 1.00, 0.97 of the skeleton, all three inside three per cent.');
  L.push('  *** THE GAME HAS NO OLD PEOPLE. IT HAS A SLIGHTLY SHORTER MAN. ***');
  L.push('');
  L.push('AND THE THREE PER CENT IS NOT A BUG, WHICH IS WHY THIS IS WORTH WRITING DOWN. Real');
  L.push('people lose about two to five centimetres of height over a lifetime -- on 175 cm that');
  L.push('is one to three per cent -- and the rig\'s own note says exactly why it does nothing');
  L.push('else: "The ELDER narrows nothing: old age compresses the spine, it does not narrow the');
  L.push('shoulders." THE STAGE IS ANATOMICALLY CORRECT AND VISUALLY USELESS. You cannot reach');
  L.push('an old man through height, because old men are not short. He reads by his BACK (a');
  L.push('stoop), his HAIR and his FACE, and the rig does not bend a spine today.');
  L.push('');
  L.push('I CORRECT MY OWN PREVIOUS CLAIM. Two rounds ago this lane cooked "SOMEBODY WHO GOT OLD');
  L.push('HERE" and registered it in the VOTE tab as an elder. He is a 97% adult in a long coat.');
  L.push('The coat and the bone knit cap do the work; the BODY does none of it. Anyone reading');
  L.push('that sheet should read this line with it.');
  L.push('');
  L.push('SO THE ROW SPLITS IN TWO, and only one half can ship:');
  L.push('  CHILDREN AND TEENS: buildable now, today, with one field per person. The picture');
  L.push('    shows it working.');
  L.push('  OLD PEOPLE: NOT BUILDABLE TODAY. Needs a stoop in the rig, and probably grey hair,');
  L.push('    before the word elder means anything. That is a rig job, not a table edit, and it');
  L.push('    is bigger than this round. NAMED AND ROUTED RATHER THAN FAKED: I could have made');
  L.push('    the elder stage 0.90 and called it done, and it would have shipped an old man who');
  L.push('    is really a teenager.');
  L.push('');
  L.push('THE LABELS THAT DO NOT READ ARE MARKED ON THE PICTURE ITSELF, in a different colour,');
  L.push('saying "you cannot tell". A caption claiming an age the pixels do not show is this');
  L.push('lane\'s own [names lie] defect one screen further out, and the tab he judges in is the');
  L.push('last place it may ever appear.');
  L.push('');
  L.push('WHERE THE NUMBERS COME FROM, AND THE LIMIT ON THEM. US Census QuickFacts and ACS for');
  L.push('Clark County, Nevada: under 18 21.9%, 65 and over 16.3%; bands under 15 18.2, 15-24');
  L.push('12.0, 25-44 28.9, 45-64 25.0, 65+ 15.9; median age 39. I COULD NOT OPEN census.gov');
  L.push('FROM THIS CONTAINER -- the network policy blocks it -- so these came from two search');
  L.push('summaries that agreed with each other. That is weaker than reading the table and it is');
  L.push('said here rather than smoothed over. Anybody who can reach census.gov should check the');
  L.push('two figures this leans on.');
  L.push('THE PRECEDENT IS THE REPO\'S OWN: bohemia_people.js grounded the NAME pool in the same');
  L.push('county\'s real ethnic shares, for the same reason, in its own comment.');
  L.push('');
  L.push('*** THE FINDING, AND IT IS ARITHMETIC RATHER THAN ART. *** There is a real objection to');
  L.push('using the LIVE county\'s shares for a valley TEN YEARS COLD: a decade without power in');
  L.push('the Mojave kills the old first, and anybody now under ten was born after the crash.');
  L.push('Halve the children, cut the elders to a third, and the shares become child 6.5, teen');
  L.push('10.7, young adult 16.8, adult 59.3, elder 6.7. Then:');
  L.push('    on TWELVE people        county 1/1/2/6/2   ten years cold 1/1/2/7/1   ONE PERSON APART');
  L.push('    on the 183 his phone draws   county 20/16/26/90/31   cold 12/20/31/108/12');
  L.push('                                 NINETEEN FEWER ELDERS AND EIGHT FEWER CHILDREN');
  L.push('SO THE CHOICE IS INVISIBLE ON ANY VOTE SHEET AND LOUD ON THE STREET. A picture cannot');
  L.push('settle it; a crowd can. That is why this ships ONE row of shares instead of two nearly');
  L.push('identical ones dressed up as a choice. The halving and the third are REASONING, not');
  L.push('measurement, and they are labelled that way everywhere they appear. No canon is');
  L.push('invented here: nothing says what the valley\'s shares ARE, only what two rules produce.');
  L.push('');
  if (clipped.length) {
    L.push('AND THE FRAME CUTS ' + clipped.length + ' OF THEM: ' + clipped.map(m => m.id + ' (' + m.row0 + ' px)').join(', '));
    L.push('paints row 0 of the sprite box. Same ceiling this lane found on the tall body last');
    L.push('round. Ages only ever shrink, so this is a look\'s own height dial reaching the top,');
    L.push('not the age stage -- but it is in the picture, so it is named here.');
  } else {
    L.push('THE FRAME HOLDS. No body paints row 0, so nothing is cut off at the top. Ages only');
    L.push('ever shrink a body, so unlike last round\'s tall man there was nothing to run out of');
    L.push('frame -- checked rather than assumed.');
  }
  L.push('');
  L.push('WHAT A YES-VOTE COSTS: twelve `age:` fields on CITY_CAST_LOOKS and the deal function in');
  L.push('this tool. No new art, no new garment, no new code path. The age machinery has been in');
  L.push('the rig the whole time with one body using it.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\n  wrote slices/vote/CHARACTER_THE_STREET_GETS_AGES.png  '
    + (fs.statSync(f).size / 1024).toFixed(0) + ' KB');
})();
