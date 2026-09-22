/* THE FIT SEARCH, RE-RUN WITH THE RUNWAY IN THE POOL (9/23/26, CHARACTER, [runway redo])
 *
 * CONTINUING THE CLAIMED ROW. Last round I found that COOK had already cut 26 garments to
 * the three houses Paolo named and that TWENTY-TWO WERE WORN BY NOBODY, with ZERO on any of
 * the thirteen factions; I added the 12 missing faction colourways and re-dressed what could
 * legally be re-dressed. Only FIVE of thirteen moved, and my own handoff named why and named
 * this as the next step, verbatim:
 *   "THE REAL ANSWER IS TO RE-RUN THE 880-FIT SEARCH ITSELF with the runway shapes in the
 *    candidate pool and the faction colourways that now exist, and let it find a NEW
 *    mutually-distinct thirteen that is runway from the start rather than a workwear
 *    thirteen with better boots."
 * This is that run.
 *
 * *** WHY THE OLD THIRTEEN ARE WORKWEAR, AND IT IS NOT A TASTE FAILURE. *** Read the
 * original tool's candidate pool: duster, drifter's coat, split-tail, cape, tactical vest,
 * pauldron, bandolier, blanket roll, ruck pack; four legs, all workwear; NO FEET AXIS AT ALL.
 * There is not one runway cut in it. The search did its job perfectly and could only ever
 * return workwear, BECAUSE WORKWEAR WAS THE ONLY THING IN THE BOX. His "they all need to get
 * redone" is a verdict on a pool, not on a search.
 *
 * SAME RULER AS THE ORIGINAL, DELIBERATELY. profileOf, dist and the greedy farthest-point
 * walk are copied from tools/bohemia_faction_fits.js unchanged -- same drawChar on the same
 * 112 board with the outline on it, same 16-sample width profile normalised to the body's own
 * span and width, same separation floor. LAST ROUND I HAD TO DISCLAIM that my metric was only
 * the same KIND as theirs and its absolute number could not be read against their 0.0420.
 * This one CAN, because it is the same function. That is the whole reason to copy rather than
 * improve it.
 *
 * WHAT CHANGED IN THE POOL, and nothing else changed:
 *   SHOULDER  + cocoon, comma, asymmetric, wrap (RNWY-02, 09, 07, 04)
 *   LEGS      + drop-rise, wide pleat, stacked jersey, cropped (RNWY-11, 08, 10)
 *   FEET      A NEW AXIS THE ORIGINAL DID NOT HAVE AT ALL: plain boot, pant-boot, platform,
 *             slouch (RNWY-10, 12). Added because last round measured that BOTH runway poles
 *             are reachable from the feet alone -- a platform widens the base into Rick
 *             Owens, a pant-boot narrows it into Balenciaga -- so a search with no feet axis
 *             was blind to the cheapest lever in the register.
 *   HEAD      DROPPED, and this is a real trade stated rather than hidden. The original ran
 *             heads and masks as axes; I spend that budget on feet instead, because the
 *             original tool's OWN conclusion was that the lever is the SHOULDER LINE ("the
 *             cook brief is therefore exact: N more SHOULDER-LINE shapes") and a hat is worn
 *             on top of any fit without changing it. COST: a set that separates on hats is
 *             not reachable from this run. Naming it so nobody reads this as a strict
 *             superset of the original.
 *
 * THE COLOURWAYS ARE NOT IN THE POOL AND THAT IS ON PURPOSE. STRUCTURE-NOT-COLOR: the search
 * is on SILHOUETTE, so a cocoon coat is one candidate no matter how many ramps it exists in.
 * The 12 faction colourways added last round are what lets the WINNER be dressed in a
 * faction's own colour afterwards; putting them in the pool would just inflate the candidate
 * count with identical shapes and make the answer look better than it is, which is the exact
 * warning written in the original tool's own header.
 *
 * RIG CHECK (RIG IS LAW): reads only. G_WORN, G.bodyVar, G.age, the player's equipped slots
 * and both caches are restored in a finally block, copied from the original.
 * REUSE CHECK: draws nothing. Every garment named already ships as canon.
 * NOT WIRED (rule 18): this proposes a set. It does not edit FACTION_LOOKS.
 *
 * REFERENCE CHECK (COMPARE EVERY PIECE OF ART TO THE WORLD, 9/4):
 *   RNWY-13  the two poles, stated once, and its own failure sentence -- "a figure that mixes
 *          both reads as neither". The reason the pool gains BOTH a platform and a pant-boot
 *          rather than one "better" base: the register wants two extremes, not one average.
 *   RNWY-02 / RNWY-07 / RNWY-09 / RNWY-04  the four shoulder-line cuts added to the pool,
 *          each one a house code the old pool had no entry for: the cocoon that hides the
 *          shoulder point, the asymmetric hem as a diagonal event, the comma that falls
 *          forward, the bias wrap that coils the body.
 *   RNWY-12 / RNWY-10  the two base cuts, and the measured reason the feet axis exists.
 *   AH-01  our own analog horror bible. Stated limit, same as last round: a runway silhouette
 *          is the REGISTER he named, not the wrongness rule 1 asks for. This search cannot
 *          deliver "analog horror meets" and does not claim to; RNWY-16, the garment that is
 *          not what it looks like, is the bridge and it needs new art.
 *
 *   node tools/bohemia_faction_fits_runway.js [floor]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const OUT = path.join(REPO, 'records/BOHEMIA_THE_FIT_SEARCH_WITH_THE_RUNWAY_IN_IT_9_23_26.txt');
const FLOOR = parseFloat(process.argv[2] || '0.040');   /* the original's own floor */

/* THE OLD POOL, verbatim from tools/bohemia_faction_fits.js, so the comparison is real. */
const SHOULDER_OLD = [
  ['bare',      null,    null],
  ['mantle',    'back',  'SHOULDER MANTLE'],
  ['longcoat',  'outer', 'WASTELAND DUSTER'],
  ['midcoat',   'outer', "DRIFTER'S COAT"],
  ['splittail', 'outer', 'SPLIT-TAIL DUSTER'],
  ['cape',      'back',  'ROAD CAPE'],
  ['vest',      'outer', 'TACTICAL VEST'],
  ['pauldron',  'gear',  'STEEL PAULDRON'],
  ['bandolier', 'gear',  'SHELL BANDOLIER'],
  ['roll',      'gear',  'BLANKET SHOULDER ROLL'],
  ['pack',      'back',  'RUCK PACK'],
];
/* THE FOUR SHOULDER-LINE CUTS THE OLD POOL HAD NO ENTRY FOR. */
const SHOULDER_NEW = [
  ['cocoon',    'outer', 'COCOON COAT'],
  ['comma',     'outer', 'COMMA COAT'],
  ['asym',      'outer', 'ASYMMETRIC COAT'],
  ['wrap',      'outer', 'WRAP COAT'],
];
const LEGS_OLD = [
  ['trousers', 'DUST TROUSERS'],
  ['skirt',    'ANKLE WRAP SKIRT'],
  ['shorts',   'CUTOFF DENIM SHORTS'],
  ['cargos',   'KHAKI CARGOS'],
];
const LEGS_NEW = [
  ['drop',   'DROP RISE TROUSER'],
  ['widepl', 'WIDE PLEAT TROUSER'],
  ['stack',  'STACKED JERSEY PANT'],
  ['crop',   'CROPPED WORK TROUSER'],
];
/* THE AXIS THE ORIGINAL DID NOT HAVE. */
const FEET = [
  ['boot',     'BROWN BOOTS'],
  ['column',   'COLUMN PANT-BOOT'],
  ['platform', 'STACKED SOLE BOOT'],
  ['slouch',   'SLOUCH BOOT'],
];
const DIALS = [
  ['tall',   { height: 0.75, belly: -0.25, arms: 0.10, shoulders: 0.25, hips: -0.10 }],
  ['broad',  { height: -0.30, belly: 0.55, arms: 0.30, shoulders: 0.60, hips: 0.15 }],
  ['small',  { height: -0.60, belly: -0.30, arms: -0.30, shoulders: -0.40, hips: 0.25 }],
  ['plain',  { height: 0.00, belly: 0.00, arms: 0.00, shoulders: 0.00, hips: 0.00 }],
  ['lanky',  { height: 0.45, belly: -0.45, arms: 0.35, shoulders: -0.25, hips: -0.25 }],
];

(async () => {
  const SHOULDER = SHOULDER_OLD.concat(SHOULDER_NEW);
  const LEGS = LEGS_OLD.concat(LEGS_NEW);
  const RUNWAY_SH = SHOULDER_NEW.map(s => s[0]);
  const RUNWAY_LG = LEGS_NEW.map(l => l[0]);
  const RUNWAY_FT = ['column', 'platform', 'slouch'];

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', e => console.log('PAGEERR: ' + e.message.slice(0, 120)));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForFunction(() => typeof drawChar === 'function' && window.GARMENTS
    && typeof rebuildFromRig === 'function' && window.FACTION_LOOKS, { timeout: 180000 });

  const R = await page.evaluate(({ SHOULDER, LEGS, FEET, DIALS }) => {
    const have = new Set((window.GARMENTS || []).filter(g => g.st === 'canon').map(g => g.n));
    const missing = [];
    const chk = n => { if (n && !have.has(n)) missing.push(n); return n && have.has(n) ? n : null; };

    const _cv = document.createElement('canvas'); _cv.width = 112; _cv.height = 112;
    /* COPIED UNCHANGED from tools/bohemia_faction_fits.js so the floor means the same thing. */
    const profileOf = (cv) => {
      const W = cv.width, H = cv.height, rows = [];
      const d = cv.getContext('2d').getImageData(0, 0, W, H).data;
      for (let y = 0; y < H; y++) {
        let lo = -1, hi = -1;
        for (let x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3] > 8) { if (lo < 0) lo = x; hi = x; }
        rows.push(hi < 0 ? 0 : (hi - lo + 1));
      }
      let top = 0; while (top < rows.length && !rows[top]) top++;
      let bot = rows.length - 1; while (bot > top && !rows[bot]) bot--;
      const span = Math.max(1, bot - top), wide = Math.max.apply(null, rows) || 1;
      const N = 16, p = [];
      for (let k = 0; k < N; k++) {
        const y = top + Math.round(span * k / (N - 1));
        p.push(rows[Math.min(rows.length - 1, y)] / wide);
      }
      return p;
    };

    const keepW = window.G_WORN, keepD = G.bodyVar, keepA = G.age, keepEq = {};
    const PD = ['shirt', 'jacket', 'pants', 'shoes', 'hat', 'glasses', 'hair'];
    PD.forEach(s => { if (s in G.equipped) { keepEq[s] = G.equipped[s]; G.equipped[s] = ''; } });

    const out = { rows: [], missing: [], err: null, today: [] };
    try {
      /* TODAY'S THIRTEEN ON THE SAME RULER, so "is the new set more distinct" is a
         measurement and not a claim. */
      for (const f of FACTION_LOOKS) {
        G.bodyVar = f.dials || {}; G.age = f.age || 'adult'; rebuildFromRig();
        window.G_WORN = f.worn;
        try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
        drawChar(_cv, 'S', 'idle', 0);
        out.today.push({ id: f.faction, p: profileOf(_cv) });
      }
      for (const [dn, dials] of DIALS) {
        G.bodyVar = dials; G.age = 'adult';
        rebuildFromRig();
        for (const [sn, slayer, sname] of SHOULDER) {
          for (const [ln, lname] of LEGS) {
            for (const [fn, fname] of FEET) {
              const worn = { base: 'WHITE TEE' };
              if (chk(fname)) worn.feet = fname;
              if (chk(lname)) worn.legs = lname;
              if (slayer && chk(sname)) worn[slayer] = sname;
              window.G_WORN = worn;
              try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
              drawChar(_cv, 'S', 'idle', 0);
              out.rows.push({ id: dn + '/' + sn + '/' + ln + '/' + fn,
                              dials: dn, shoulder: sn, legs: ln, feet: fn,
                              worn: worn, p: profileOf(_cv) });
            }
          }
        }
      }
    } catch (e) { out.err = e.message + ' @ ' + (e.stack || '').split('\n')[1]; }
    finally {
      window.G_WORN = keepW; G.bodyVar = keepD; G.age = keepA;
      for (const s in keepEq) G.equipped[s] = keepEq[s];
      try { rebuildFromRig(); } catch (e) {}
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    }
    out.missing = Array.from(new Set(missing));
    return out;
  }, { SHOULDER, LEGS, FEET, DIALS });

  if (R.err) { console.log('THREW: ' + R.err); await browser.close(); process.exit(1); }
  if (R.missing.length) console.log('NOT IN THE CANON WARDROBE, skipped: ' + R.missing.join(', ') + '\n');

  const dist = (a, b) => { let d = 0; for (let k = 0; k < a.length; k++) d += Math.abs(a[k] - b[k]); return d / a.length; };
  const closest = (set) => { let m = Infinity, who = null;
    for (let i = 0; i < set.length; i++) for (let j = i + 1; j < set.length; j++) {
      const d = dist(set[i].p, set[j].p); if (d < m) { m = d; who = [set[i].id, set[j].id]; } }
    return { d: m, who: who }; };

  /* GREEDY FARTHEST-POINT, copied from the original, including its honesty: this does not
     prove the true maximum (that is set-packing, NP-hard), so the count is a FLOOR ON THE
     ANSWER and never a ceiling. */
  const N = R.rows.length;
  let bi = 0, bj = 1, bd = -1;
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
    const d = dist(R.rows[i].p, R.rows[j].p);
    if (d > bd) { bd = d; bi = i; bj = j; }
  }
  const chosen = [R.rows[bi], R.rows[bj]];
  for (;;) {
    let best = null, bestD = -1;
    for (const c of R.rows) {
      if (chosen.indexOf(c) >= 0) continue;
      let near = Infinity;
      for (const s of chosen) near = Math.min(near, dist(c.p, s.p));
      if (near > bestD) { bestD = near; best = c; }
    }
    if (!best || bestD < FLOOR) break;
    chosen.push(best);
    if (chosen.length >= 40) break;
  }

  const todayClose = closest(R.today);
  const newClose = closest(chosen.slice(0, 13));
  const runwayCount = chosen.slice(0, 13).filter(c =>
    RUNWAY_SH.indexOf(c.shoulder) >= 0 || RUNWAY_LG.indexOf(c.legs) >= 0 || RUNWAY_FT.indexOf(c.feet) >= 0).length;

  /* THE PICTURE: the thirteen the search chose, one scale, feet on one line. */
  /* *** THE PICTURE GETS HAIR; THE MEASUREMENT DOES NOT. *** The search renders a bare head
     because the original did, and the ruler has to stay identical for the floor to mean what
     their floor meant. But a sheet of thirteen bald heads is not a thing to put in front of
     him -- he has just said "keep cooking up hairstyles and faces" in the same breath as the
     down-vote. So the SHEET adds a haircut per body, varied, purely for looking at. The
     separation numbers in the record are the bare-head ones and the record says so; nothing
     is measured off the picture. */
  const HAIRS = ['DRY TAPER', 'SHAG', 'COIL CROWN', 'TEMPLE TAPER', 'LAYERED FALL',
                 'CURTAIN CUT', 'DEEP TAPER', 'HEAVY FRINGE'];
  const sheet = await page.evaluate(({ picks, HAIRS }) => {
    const keepW = window.G_WORN, keepD = G.bodyVar, keepA = G.age;
    const cvs = [];
    for (const c of picks) {
      const one = document.createElement('canvas'); one.width = 112; one.height = 112;
      const D = { tall: { height: 0.75, belly: -0.25, arms: 0.10, shoulders: 0.25, hips: -0.10 },
                  broad: { height: -0.30, belly: 0.55, arms: 0.30, shoulders: 0.60, hips: 0.15 },
                  small: { height: -0.60, belly: -0.30, arms: -0.30, shoulders: -0.40, hips: 0.25 },
                  plain: { height: 0, belly: 0, arms: 0, shoulders: 0, hips: 0 },
                  lanky: { height: 0.45, belly: -0.45, arms: 0.35, shoulders: -0.25, hips: -0.25 } };
      G.bodyVar = D[c.dials]; G.age = 'adult'; rebuildFromRig();
      const worn = {}; for (const k in c.worn) worn[k] = c.worn[k];
      worn.hair = HAIRS[cvs.length % HAIRS.length];
      window.G_WORN = worn;
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      drawChar(one, 'S', 'idle', 0);
      cvs.push(one);
    }
    const N = cvs.length, CELL = 106, PAD = 18, HEAD = 74, LAB = 54, BODY = 196;
    const cv = document.createElement('canvas');
    cv.width = N * CELL + PAD * 2; cv.height = HEAD + BODY + LAB + PAD;
    const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    g.fillStyle = '#b9a373'; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = '#3a2f1c'; g.textBaseline = 'top';
    g.font = 'bold 20px ui-monospace, monospace';
    g.fillText('A NEW THIRTEEN, FOUND BY THE SEARCH WITH THE RUNWAY IN THE BOX', PAD, PAD);
    g.font = '13px ui-monospace, monospace';
    g.fillText('nobody picked these by eye. same search that built the old thirteen, same ruler, runway cuts added to the pool.',
               PAD, PAD + 24);
    g.fillText('shapes only. colour and faces come after you rule on the shapes.', PAD, PAD + 40);
    const floor = HEAD + BODY;
    g.strokeStyle = 'rgba(58,47,28,0.30)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(PAD, floor + 0.5); g.lineTo(cv.width - PAD, floor + 0.5); g.stroke();
    const s = BODY / 112;
    cvs.forEach((one, i) => {
      const x = PAD + i * CELL;
      g.drawImage(one, x + (CELL - 112 * s) / 2, floor - 112 * s, 112 * s, 112 * s);
      g.fillStyle = '#3a2f1c'; g.font = '10px ui-monospace, monospace';
      const bits = [picks[i].dials, picks[i].shoulder, picks[i].legs, picks[i].feet];
      bits.forEach((b, k) => g.fillText(b, x + 3, floor + 6 + k * 11));
    });
    window.G_WORN = keepW; G.bodyVar = keepD; G.age = keepA;
    try { rebuildFromRig(); HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    return cv.toDataURL('image/png');
  }, { picks: chosen.slice(0, 13).map(c => ({ dials: c.dials, shoulder: c.shoulder, legs: c.legs, feet: c.feet, worn: c.worn })), HAIRS });
  await browser.close();

  fs.mkdirSync(VOTE, { recursive: true });
  const f = path.join(VOTE, 'CHARACTER_A_NEW_THIRTEEN.png');
  fs.writeFileSync(f, Buffer.from(sheet.split(',')[1], 'base64'));

  const L = [];
  L.push('THE FIT SEARCH, RE-RUN WITH THE RUNWAY IN THE POOL  --  CHARACTER, 9/23/26, [runway redo]');
  L.push('');
  L.push('*** WHY THE OLD THIRTEEN ARE WORKWEAR, AND IT IS NOT A TASTE FAILURE. *** The original');
  L.push('search\'s candidate pool is duster, drifter\'s coat, split-tail, cape, tactical vest,');
  L.push('pauldron, bandolier, blanket roll, ruck pack; four legs, all workwear; and NO FEET AXIS');
  L.push('AT ALL. There is not one runway cut in it. The search did its job perfectly and could');
  L.push('only ever return workwear, BECAUSE WORKWEAR WAS THE ONLY THING IN THE BOX. His "they');
  L.push('all need to get redone" is a verdict on a pool, not on a search.');
  L.push('');
  L.push('SAME RULER AS THE ORIGINAL, ON PURPOSE. profileOf, dist and the greedy walk are copied');
  L.push('unchanged, so this floor means what their floor meant. Last round I had to disclaim');
  L.push('that my metric was only the same KIND as theirs; this one is the same function.');
  L.push('');
  L.push('  candidates measured    ' + N + '   (' + DIALS.length + ' bodies x ' + SHOULDER.length
    + ' shoulder shapes x ' + LEGS.length + ' legs x ' + FEET.length + ' feet)');
  L.push('  separation floor       ' + FLOOR.toFixed(3));
  L.push('  mutually distinct set  ' + chosen.length + ' found at that floor');
  L.push('');
  L.push('  (every number here is measured on a BARE HEAD, as the original search did, so the');
  L.push('   floor means what their floor meant. The sheet adds a haircut per body for LOOKING');
  L.push('   at, because thirteen bald heads is not a thing to put in front of him. Nothing is');
  L.push('   measured off the picture.)');
  L.push('');
  L.push('  TODAY\'S THIRTEEN, same ruler   closest pair ' + todayClose.d.toFixed(4)
    + '   (' + (todayClose.who || []).join(' / ') + ')');
  L.push('  THE NEW THIRTEEN               closest pair ' + newClose.d.toFixed(4)
    + '   (' + (newClose.who || []).join(' / ') + ')');
  L.push('  ' + (newClose.d > todayClose.d
    ? '*** THE NEW SET IS ' + (newClose.d / todayClose.d).toFixed(1) + ' TIMES MORE SEPARATED THAN THE ONE HE VOTED DOWN. ***'
    : 'THE NEW SET IS NOT MORE SEPARATED, and that is reported rather than buried.'));
  L.push('  carrying a runway cut          ' + runwayCount + ' of 13');
  L.push('');
  L.push('  THE SET THE SEARCH CHOSE (nobody picked these by eye):');
  chosen.slice(0, 13).forEach((c, i) => L.push('    ' + String(i + 1).padStart(2) + '  ' + c.id));
  L.push('');
  L.push('HONEST LIMITS, all three stated rather than discovered later.');
  L.push('  1. THE HEAD AXIS IS GONE. The original ran heads and masks; I spent that budget on');
  L.push('     a FEET axis instead, because last round measured that both runway poles are');
  L.push('     reachable from the feet alone and the original was blind to that lever. COST: a');
  L.push('     set that separates on hats is not reachable from this run, so this is NOT a');
  L.push('     strict superset of the original.');
  L.push('  2. GREEDY IS A FLOOR, NOT A CEILING. Farthest-point does not prove the true maximum');
  L.push('     -- that is set-packing and NP-hard -- so the count is a floor on the answer. The');
  L.push('     original says the same about itself and it is repeated here rather than dropped.');
  L.push('  3. THIS IS THE REGISTER, NOT THE HORROR. A runway silhouette answers "Rick Owens');
  L.push('     meets Balenciaga". It does NOT answer "analog horror meets", because the bible\'s');
  L.push('     rule 1 wants one wrong thing and a better-cut coat is not one. RNWY-16, the');
  L.push('     garment that is not what it looks like, is the bridge and it needs new art.');
  L.push('');
  L.push('COLOURWAYS ARE DELIBERATELY NOT IN THE POOL. STRUCTURE-NOT-COLOR: the search is on');
  L.push('SILHOUETTE, so a cocoon coat is ONE candidate however many ramps it exists in. The 12');
  L.push('faction colourways added last round are what lets the winner be dressed in a faction\'s');
  L.push('own colour afterwards. Putting them in the pool would inflate the count with identical');
  L.push('shapes and make the answer look better than it is -- the original tool\'s own warning.');
  L.push('');
  L.push('NOT WIRED (rule 18): this proposes a set and edits no faction. Which shape belongs to');
  L.push('which faction is HIS, exactly as the original said: "WHICH SHAPE BELONGS TO WHOM IS');
  L.push('HIS." The picture is in VOTE.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\n  wrote slices/vote/CHARACTER_A_NEW_THIRTEEN.png  '
    + (fs.statSync(f).size / 1024).toFixed(0) + ' KB');
})();
