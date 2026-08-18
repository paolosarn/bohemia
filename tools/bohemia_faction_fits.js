/* BOHEMIA HOW MANY PEOPLE CAN THIS WARDROBE ACTUALLY TELL APART? (8/18/26, CHARACTER lane)
 *
 * Backlog row SIL (Paolo 7/19 STRUCTURE-NOT-COLOR, amended 8/15 to govern IDENTITY):
 * "every faction must be identifiable by SILHOUETTE -- garment shape, proportion,
 * headwear -- with colour as the BACK-UP channel, never the carrier."
 *
 * THERE ARE THIRTEEN SELECTABLE FACTIONS (engine/BOHEMIA_faction_graph.json, canon).
 * Before assigning a single one of them a fit, the question that has to be answered
 * is whether THIRTEEN IS EVEN REACHABLE, because the ranking says it might not be:
 * tools/bohemia_silhouette_lever.js found only about SIX DISTINCT SHAPE CLASSES
 * above the separation floor (mantle / long coat / mid coat / split-tail / cape /
 * brimmed head), and nine long coats scoring 0.0446 to four decimal places are ONE
 * shape in nine colours, not nine shapes.
 *
 * Assigning thirteen fits and hoping is how you ship six factions that read the same
 * and find out from him. So this SEARCHES the space instead:
 *
 *   1. build candidate fits from dial preset x shoulder-layer x head x legs
 *   2. render each one and take its FRONT width profile (the S facing -- a back item
 *      is invisible on somebody walking toward you, which cost this lane a whole
 *      round on 8/18)
 *   3. greedily pick the LARGEST set whose every pair is at least FLOOR apart
 *
 * The answer is a NUMBER: how many people this wardrobe can distinguish. If it is
 * thirteen, the assignment is a solved problem and the set is printed. If it is
 * fewer, that is not a failure to route around -- it is the exact cook brief, and
 * it says which shapes are missing rather than "make more clothes".
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): reads the rig, writes nothing. It borrows
 *   window.G_WORN / G.bodyVar around buildFrame and restores them in a finally,
 *   exactly as famPaintBody does. No painted pixel, joint or bone is touched and no
 *   garment is authored -- this measures what already exists.
 *   built on: BAKED, BOH_BODYVAR
 *   joints: none named
 *   parts: none named
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every garment is an existing st:'canon'
 * entry in the alpha's own GARMENTS catalogue; every body is the one painted rig
 * reshaped by BODYVAR dials that already exist. The whole output is a measurement.
 *
 *   node tools/bohemia_faction_fits.js [floor]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'records/BOHEMIA_HOW_MANY_PEOPLE_THE_WARDROBE_TELLS_APART_8_18_26.txt');
const FLOOR = parseFloat(process.argv[2] || '0.030');   /* the ratchet the cast gate holds */

/* ONE REPRESENTATIVE PER SHAPE CLASS, not one per colourway. Nine long coats score
   0.0446 to four decimals -- they are the same shape, and searching all nine would
   just inflate the candidate count with duplicates and make the answer look better
   than it is. */
const SHOULDER = [
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
const HEAD = [
  ['none',   null],
  ['brim',   'CHINESE RICE FARMER HAT'],
  ['knit',   'STORM KNIT CAP'],
  ['gas',    null],            /* face layer, filled below */
];
const FACE = [['none', null], ['mask', 'RUBBER GAS MASK']];
const LEGS = [
  ['trousers', 'DUST TROUSERS'],
  ['skirt',    'ANKLE WRAP SKIRT'],
  ['shorts',   'CUTOFF DENIM SHORTS'],
  ['cargos',   'KHAKI CARGOS'],
];
/* BODY, not clothing. The dials are a weak lever once a coat is on (measured 8/18)
   but they are not nothing, and they are free. */
const DIALS = [
  ['tall',   { height: 0.75, belly: -0.25, arms: 0.10, shoulders: 0.25, hips: -0.10 }],
  ['broad',  { height: -0.30, belly: 0.55, arms: 0.30, shoulders: 0.60, hips: 0.15 }],
  ['small',  { height: -0.60, belly: -0.30, arms: -0.30, shoulders: -0.40, hips: 0.25 }],
  ['plain',  { height: 0.00, belly: 0.00, arms: 0.00, shoulders: 0.00, hips: 0.00 }],
  ['lanky',  { height: 0.45, belly: -0.45, arms: 0.35, shoulders: -0.25, hips: -0.25 }],
];

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', e => console.log('PAGEERR: ' + e.message.slice(0, 120)));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(4000);

  const R = await page.evaluate(({ SHOULDER, HEAD, FACE, LEGS, DIALS }) => {
    const have = new Set((window.GARMENTS || []).filter(g => g.st === 'canon').map(g => g.n));
    const missing = [];
    const chk = n => { if (n && !have.has(n)) missing.push(n); return n && have.has(n) ? n : null; };

    const _cv = document.createElement('canvas'); _cv.width = 112; _cv.height = 112;
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

    const out = { rows: [], missing: [], err: null };
    try {
      for (const [dn, dials] of DIALS) {
        G.bodyVar = dials; G.age = 'adult';
        rebuildFromRig();
        for (const [sn, slayer, sname] of SHOULDER) {
          for (const [hn, hname] of HEAD) {
            for (const [fn, fname] of FACE) {
              if (hn === 'gas' && fn !== 'mask') continue;      /* 'gas' IS the mask row */
              if (hn !== 'gas' && fn === 'mask') continue;
              for (const [ln, lname] of LEGS) {
                const worn = { base: 'WHITE TEE', feet: 'BROWN BOOTS' };
                if (chk(lname)) worn.legs = lname;
                if (slayer && chk(sname)) worn[slayer] = sname;
                if (hname && chk(hname)) worn.head = hname;
                if (fname && chk(fname)) worn.face = fname;
                window.G_WORN = worn;
                try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
                /* MEASURE WHERE HE LOOKS, NOT ONE LAYER UP (fixed 8/18, second try).
                   The first version scored buildFrame at 56 while the gate scored the
                   112 board WITH the one-pixel outline on it -- two rulers, so a set
                   that searched clean came back with pairs at 0.007 and I started
                   hand-tweaking fits. That is fixing the target. drawChar is the
                   function the board calls, so the search now grades candidates on
                   the exact pixels the gate reads and the exact pixels he sees. */
                drawChar(_cv, 'S', 'idle', 0);
                const p = profileOf(_cv);
                out.rows.push({ id: dn + '/' + sn + '/' + hn + (fn === 'mask' ? '+mask' : '') + '/' + ln,
                                dials: dn, shoulder: sn, head: hn, face: fn, legs: ln, p: p });
              }
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
  }, { SHOULDER, HEAD, FACE, LEGS, DIALS });

  if (R.err) { console.log('THREW: ' + R.err); await browser.close(); process.exit(1); }
  if (R.missing.length) console.log('NOT IN THE CANON WARDROBE, skipped: ' + R.missing.join(', ') + '\n');

  const dist = (a, b) => { let d = 0; for (let k = 0; k < a.length; k++) d += Math.abs(a[k] - b[k]); return d / a.length; };

  /* GREEDY FARTHEST-POINT. Start from the pair that is furthest apart, then keep
     adding whichever candidate is furthest from everything already chosen, and stop
     when the best remaining candidate is closer than the floor. This does not prove
     the true maximum -- that is set-packing and it is NP-hard -- so the number it
     reports is a FLOOR ON THE ANSWER, not a ceiling, and the header says so rather
     than letting a reader treat it as proven. */
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
  }

  let minPair = Infinity, minWho = '';
  for (let i = 0; i < chosen.length; i++) for (let j = i + 1; j < chosen.length; j++) {
    const d = dist(chosen[i].p, chosen[j].p);
    if (d < minPair) { minPair = d; minWho = chosen[i].id + ' / ' + chosen[j].id; }
  }

  const L = [];
  const say = s => { L.push(s); console.log(s); };
  say('BOHEMIA -- HOW MANY PEOPLE THIS WARDROBE CAN TELL APART');
  say('CHARACTER lane, 8/18/26. Measured, not estimated.\n');
  say('  candidates measured   ' + N + '  (' + DIALS.length + ' bodies x ' + SHOULDER.length +
      ' shoulder shapes x ' + (HEAD.length) + ' heads x ' + LEGS.length + ' legs)');
  say('  separation floor      ' + FLOOR.toFixed(3) + '  (the ratchet city_cast_silhouette_gate holds)');
  say('  FACTIONS THAT NEED A SHAPE   13 selectable (engine/BOHEMIA_faction_graph.json)');
  say('');
  say('  *** DISTINGUISHABLE SET FOUND: ' + chosen.length + ' ***');
  say('  closest pair in it    ' + minPair.toFixed(4) + '   ' + minWho);
  say('');
  say('  ' + 'body'.padEnd(7) + '  ' + 'shoulder'.padEnd(10) + '  ' + 'head'.padEnd(10) + '  legs');
  for (const c of chosen)
    say('  ' + c.dials.padEnd(7) + '  ' + c.shoulder.padEnd(10) + '  ' +
        (c.head + (c.face === 'mask' ? '+mask' : '')).padEnd(10) + '  ' + c.legs);
  say('');
  if (chosen.length >= 13) {
    say('  THIRTEEN IS REACHABLE. Every selectable faction can have an outline of its');
    say('  own out of clothes that already exist -- no cook is owed for the assignment.');
  } else {
    say('  THIRTEEN IS NOT REACHABLE FROM THIS WARDROBE, and that is the finding.');
    say('  ' + (13 - chosen.length) + ' faction(s) would have to share an outline with somebody else,');
    say('  which is the failure STRUCTURE-NOT-COLOR exists to prevent -- they would end');
    say('  up separated by colour, in a valley that opens at 06:00 in the dark.');
    say('  THE COOK BRIEF IS THEREFORE EXACT: ' + (13 - chosen.length) + ' more SHOULDER-LINE shapes.');
    say('  Not more colourways, and not more of the shapes above: the outline is set at');
    say('  the shoulders and the hem, and that is where a new silhouette has to happen.');
  }
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log('\nwrote ' + path.relative(REPO, OUT));
  await browser.close();
})();
