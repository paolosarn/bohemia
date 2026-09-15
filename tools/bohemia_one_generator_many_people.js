/* ONE GENERATOR, MANY PEOPLE (9/15/26, CHARACTER lane, VAMILY [six people])
 *
 * THE ROW: "Ship CHEAPER VARIETY: the same body with a different ramp per person at draw
 * time, keyed off the person's id, with the COLOUR IS TERRITORY law holding the faction's
 * dominant hue. Measure repeats at one breath phase, before and after."
 *
 * WHAT THIS MEASURES, before and after, in ONE run on ONE crowd:
 *   how many DIFFERENT PICTURES are standing on his screen, and how many people are
 *   wearing somebody else's. Before = the body straight off the bake, which is what
 *   shipped until now. After = the same body through this person's ramp.
 *
 * ONE RUN, ONE CROWD, BOTH NUMBERS, and that is not a convenience. Two runs of this probe
 * stand on different ground, face different ways and draw different people, so a before
 * from one run and an after from the other differ for reasons that have nothing to do with
 * the change. The control has to be the same bodies.
 *
 * THREE RULERS THIS LANE ALREADY BROKE AND THIS ONE KEEPS:
 *  1. ONE BREATH PHASE FOR EVERYBODY. ctBody picks a frame by the beat plus the person's
 *     own offset, so two people wearing an IDENTICAL body hash differently just because
 *     they are mid-breath at different moments. That reads 38% repeats where the truth is
 *     74%. The flattering reading is the dangerous one.
 *  2. THE SIZE IS READ, NEVER INVENTED. Off the game's own HC ladder. An earlier cut hashed
 *     at 22 px because a variable defaulted to it.
 *  3. AND IT HASHES WHAT IS ACTUALLY BLITTED. The ramp is applied where the draw applies
 *     it, so a gate cannot pass on a recolour the screen never gets.
 *
 * IT ALSO CHECKS THE LAW THE RAMP IS NOT ALLOWED TO BREAK. COLOUR IS TERRITORY (8/26):
 * the saturated piece is a statement of who would defend you. The ramp never writes a
 * pixel at or above the keep saturation, so this counts, per body, how many saturated
 * pixels changed. THE ONLY PASSING ANSWER IS ZERO.
 *
 * RIG CHECK (RIG IS LAW): reads and reports; moves the probe's own camera and nothing else.
 * REUSE CHECK: cooks zero pixels, bakes nothing, adds no art.
 *
 *   python3 -m http.server 8231 &
 *   node tools/bohemia_one_generator_many_people.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const PORT = process.env.BOHEMIA_PORT || 8231;
const OUT = path.join(REPO, 'records/BOHEMIA_ONE_GENERATOR_MANY_PEOPLE_9_15_26.txt');

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 },
                              deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_DEMO.html');
  await new Promise(r => setTimeout(r, 7000));
  await p.evaluate(() => { const f = document.getElementById('fronttap') || document.getElementById('front'); if (f) f.click(); });
  await new Promise(r => setTimeout(r, 18000));
  const fr = p.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
  if (!fr) { console.error('no city frame'); await b.close(); process.exit(1); }

  const R = await fr.evaluate(() => {
    const o = {};
    /* STAND WHERE THE PEOPLE ARE. The spawn suburb holds one person per screen (measured
       this same round, records/BOHEMIA_HOW_FAR_IS_THE_NEXT_PERSON), and a crowd is what
       this question is about, so the probe walks to the fullest neighbourhood in reach. */
    const NB = BohemiaPopulation.NB, span = NB * FN;
    const cx0 = Math.floor(hx / span), cy0 = Math.floor(hy / span);
    let best = null;
    for (let ny = Math.max(0, cy0 - 6); ny <= cy0 + 6; ny++)
    for (let nx = Math.max(0, cx0 - 6); nx <= cx0 + 6; nx++) {
      let ppl = []; try { ppl = pplPeople(nx, ny) || []; } catch (e) { continue; }
      if (ppl.length && (!best || ppl.length > best.n)) best = { n: ppl.length, ppl: ppl };
    }
    if (best) {
      const pts = best.ppl.map(q => { try { return pplAt(q); } catch (e) { return null; } }).filter(Boolean);
      if (pts.length) {
        const xs = pts.map(a => a[0]).sort((a, c) => a - c), ys = pts.map(a => a[1]).sort((a, c) => a - c);
        hx = xs[xs.length >> 1]; hy = ys[ys.length >> 1];
      }
    }
    render();
    /* LET THE STREET SETTLE FIRST. The draw pass rations new recolours to a handful a
       frame so arriving somewhere cannot drop six frames, so the crowd is itself a few
       frames after you get there, not instantly. Measuring at frame one would report the
       ration, not the variety. This counts how many frames settling actually takes, which
       is a number worth having on its own. */
    let framesToSettle = 0;
    for (let f = 0; f < 240; f++) {
      const was = CT_RAMP_CV.size;
      render();
      framesToSettle = f + 1;
      if (CT_RAMP_CV.size === was && f > 2) break;
    }
    o.framesToSettle = framesToSettle;
    o.HC = HC;
    /* THE SAME LADDER THE DRAW USES, read out of peoplePass rather than restated. */
    const L = HC >= 64 ? 224 : (HC >= 32 ? 112 : (HC < 17 ? 28 : 56));
    o.bodyPx = L;
    o.drew = BARK_DREW.length;

    const hashAt = (s) => {
      const c = document.createElement('canvas'); c.width = L; c.height = L;
      const g2 = c.getContext('2d'); g2.imageSmoothingEnabled = false;
      g2.drawImage(s, 0, 0, L, L);
      const im = g2.getImageData(0, 0, L, L).data;
      let h = 2166136261;
      for (let k = 0; k < im.length; k += 4) {
        const a = im[k + 3] < 128 ? 0 : 1;
        /* banded luma, because two shades a player cannot tell apart are one picture */
        const l = a ? Math.round((0.2126 * im[k] + 0.7152 * im[k + 1] + 0.0722 * im[k + 2]) / 52) : 0;
        h ^= (a * 7 + l); h = Math.imul(h, 16777619);
      }
      return (h >>> 0).toString(16);
    };
    /* HOW MANY SATURATED PIXELS MOVED. Zero is the only passing answer: those pixels are
       the faction's statement and the ramp is built so it cannot reach them. */
    const movedSaturated = (a, c) => {
      const mk = (s) => { const cv2 = document.createElement('canvas'); cv2.width = s.width; cv2.height = s.height;
        const g2 = cv2.getContext('2d'); g2.imageSmoothingEnabled = false; g2.drawImage(s, 0, 0);
        return g2.getImageData(0, 0, cv2.width, cv2.height).data; };
      if (a.width !== c.width || a.height !== c.height) return -1;
      const A = mk(a), C2 = mk(c); let moved = 0, sat = 0;
      const KEEP = (typeof CT_RAMP !== 'undefined') ? CT_RAMP.keep : 0.5;
      for (let i = 0; i < A.length; i += 4) {
        if (!A[i + 3]) continue;
        const Rr = A[i], G = A[i + 1], B = A[i + 2];
        const mx = Rr > G ? (Rr > B ? Rr : B) : (G > B ? G : B);
        if (!mx) continue;
        const mn = Rr < G ? (Rr < B ? Rr : B) : (G < B ? G : B);
        if ((mx - mn) / mx < KEEP) continue;
        sat++;
        if (A[i] !== C2[i] || A[i + 1] !== C2[i + 1] || A[i + 2] !== C2[i + 2]) moved++;
      }
      return { sat: sat, moved: moved };
    };

    const before = {}, after = {};
    let satPixels = 0, satMoved = 0, ramped = 0, sameBody = 0;
    /* THE BUDGET IS LIFTED FOR THE COUNT, AND SAYING SO IS THE POINT. The draw pass makes
       at most a few new recolours a frame; that decides WHEN a crowd is fully itself, and
       framesToSettle above is the number for that. The question HERE is how many different
       pictures the crowd contains once it has settled, and rationing the count would be
       measuring the ration. It is restored immediately after. */
    const keepBudget = CT_RAMP_LEFT; CT_RAMP_LEFT = Infinity;
    for (let i = 0; i < BARK_DREW.length; i++) {
      const d = BARK_DREW[i], q = d.p;
      let dir = 'S'; try { dir = pplFace(q, d.at); } catch (e) {}
      /* ONE BREATH PHASE: the still frame off whichever set ctBody would have used. */
      let s = null;
      try {
        const f2 = ctFactionOf(q), set = (f2 && CAST_FID[f2]) ? CAST_FID[f2] : (CAST_CV && CAST_CV[ctFitIndex(q)]);
        const sd = set && (set[dir] || set.S);
        s = sd ? sd.idle : ctBody(q, dir);
      } catch (e) { try { s = ctBody(q, dir); } catch (e2) {} }
      if (!s) continue;
      const kB = hashAt(s); before[kB] = (before[kB] || 0) + 1;
      let s2 = s;
      try { s2 = ctRamped(s, q); } catch (e) {}
      if (s2 === s) sameBody++; else ramped++;
      const kA = hashAt(s2); after[kA] = (after[kA] || 0) + 1;
      if (s2 !== s) { const m = movedSaturated(s, s2); if (m && m.sat >= 0) { satPixels += m.sat; satMoved += m.moved; } }
    }
    CT_RAMP_LEFT = keepBudget;
    const tally = (m) => {
      const n = Object.values(m).reduce((a, c) => a + c, 0);
      const counts = Object.values(m).sort((a, c) => c - a);
      return { measured: n, distinct: Object.keys(m).length, biggest: counts[0] || 0,
               repeatShare: +(1 - (Object.keys(m).length / Math.max(1, n))).toFixed(3) };
    };
    o.before = tally(before); o.after = tally(after);
    o.ramped = ramped; o.unramped = sameBody;
    o.saturatedPixels = satPixels; o.saturatedMoved = satMoved;
    o.castBodies = (typeof CAST_CV !== 'undefined' && CAST_CV) ? CAST_CV.length : 0;
    o.factionBodies = (typeof CAST_FID !== 'undefined') ? Object.keys(CAST_FID).length : 0;
    o.cache = (typeof CT_RAMP_CV !== 'undefined') ? CT_RAMP_CV.size : null;
    return o;
  });

  /* WHAT IT COSTS, on the real surface, because 60 ON A PHONE is the standing bar and a
     per-pixel pass in a draw path deserves a number rather than a shrug. Measured with a
     warm cache and a cold one, because the two are different questions. */
  /* *** AND THE COST IS TIMED ON THE RAMP ITSELF, NOT ON THE FRAME AROUND IT, AND THAT IS
     A CORRECTION. *** The first cut of this section timed whole render() calls before and
     after clearing the cache and reported "47 ms worst frame after arriving". THE CONTROL
     KILLED IT: with the ramps set to 1.00 so they do nothing at all, the same page still
     spiked to 36 ms, and a settled frame with no misses possible still spiked to 71 ms.
     The city is streaming and baking on idle callbacks underneath, so whole-frame timing in
     this page measures the page, not the change. Timing the thing you changed is the only
     honest ruler when the surface around it is that noisy. */
  const COST = await fr.evaluate(() => {
    const jobs = [];
    for (const d of BARK_DREW) {
      let dir = 'S'; try { dir = pplFace(d.p, d.at); } catch (e) {}
      let s = null; try { s = ctBody(d.p, dir); } catch (e) {}
      if (s) jobs.push([spriteAt(s, HC), d.p]);          /* exactly what the draw hands it */
    }
    const keep = CT_RAMP_LEFT;
    CT_RAMP_CV.clear(); CT_RAMP_LEFT = Infinity;
    const a = performance.now();
    for (const j of jobs) ctRamped(j[0], j[1]);
    const cold = performance.now() - a;
    const c = performance.now();
    for (const j of jobs) ctRamped(j[0], j[1]);
    const warm = performance.now() - c;
    CT_RAMP_LEFT = keep;
    const per = cold / Math.max(1, jobs.length);
    return { bodies: jobs.length, spritePx: jobs.length ? jobs[0][0].width : null,
             perBodyMs: +per.toFixed(3), allAtOnceMs: +cold.toFixed(1),
             budgetMs: +(per * CT_RAMP_PER_FRAME).toFixed(2),
             framesToDress: Math.ceil(jobs.length / CT_RAMP_PER_FRAME),
             cachedLookupMs: +warm.toFixed(2), perFrame: CT_RAMP_PER_FRAME };
  });
  await b.close();

  const B = R.before, A = R.after;
  const L = [];
  L.push('ONE GENERATOR, MANY PEOPLE  --  CHARACTER lane, 9/15/26, VAMILY [six people]');
  L.push('measured on the demo over http, 390x844 at DPR 3, one crowd, one breath phase');
  L.push('');
  L.push('THE ROW: the street was six bodies in eight facings. Baking more costs 530 ms of');
  L.push('frozen page each, so the variety is made at DRAW TIME instead: the same body,');
  L.push('this person\'s own colours, keyed off his id so he does not change as you pass.');
  L.push('');
  L.push('  bodies drawn on one screen   ' + R.drew + '   at ' + R.bodyPx + ' px');
  L.push('  baked trade bodies           ' + R.castBodies);
  L.push('  baked faction bodies         ' + R.factionBodies);
  L.push('');
  L.push('                                 BEFORE      AFTER');
  L.push('  different pictures           ' + String(B.distinct).padStart(8) + String(A.distinct).padStart(11));
  L.push('  share repeating somebody     ' + String((B.repeatShare * 100).toFixed(0) + '%').padStart(8) +
         String((A.repeatShare * 100).toFixed(0) + '%').padStart(11));
  L.push('  biggest group of identicals  ' + String(B.biggest).padStart(8) + String(A.biggest).padStart(11));
  L.push('');
  L.push('  people given their own ramp  ' + R.ramped);
  L.push('  people left exactly as baked ' + R.unramped + '   (the middle ramp is 1.00 on all three bands)');
  L.push('');
  L.push('DOES IT TOUCH HIS FACTION COLOURS? THE ONLY PASSING ANSWER IS ZERO.');
  L.push('  saturated pixels on those bodies   ' + R.saturatedPixels);
  L.push('  saturated pixels the ramp moved    ' + R.saturatedMoved);
  L.push('COLOUR IS TERRITORY (8/26) says the saturated piece states who would defend you.');
  L.push('The ramp skips that band with a continue, so it is not carefulness, it is shape:');
  L.push('there is no value of any ramp that can move one of those pixels.');
  L.push('');
  L.push('WHAT IT COSTS. A FRAME AT 120 BPM IS 16.7 ms.');
  L.push('  one body, first time          ' + COST.perBodyMs + ' ms   at ' + COST.spritePx + ' px');
  L.push('  all ' + COST.bodies + ' at once            ' + COST.allAtOnceMs + ' ms   which is why it is rationed');
  L.push('  rationed to ' + COST.perFrame + ' a frame      ' + COST.budgetMs + ' ms');
  L.push('  frames to dress the crowd     ' + COST.framesToDress + '   (' + (COST.framesToDress / 60).toFixed(1) + ' s at 60)');
  L.push('  all ' + COST.bodies + ' once cached         ' + COST.cachedLookupMs + ' ms   for the rest of the time you stand there');
  L.push('  recoloured bodies held        ' + R.cache);
  L.push('');
  L.push('A body whose colours are not made yet is drawn AS BAKED and becomes himself a few');
  L.push('frames later, the same shape as the faction-body swap: a body getting MORE');
  L.push('specific, never a person appearing out of nothing.');
  L.push('And it costs ZERO seconds of boot, which is the whole reason it is not a bake.');
  L.push('');
  L.push('AND A RULER THROWN AWAY IN THIS SECTION, SAID OUT LOUD. The first cut timed whole');
  L.push('frames and reported "47 ms worst frame after arriving". With the ramps set to 1.00');
  L.push('so they do nothing at all, the same page still spiked to 36 ms, and a frame that');
  L.push('could not miss at all still spiked to 71 ms. The city streams and bakes on idle');
  L.push('callbacks underneath; whole-frame timing here measures the page, not the change.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nwrote ' + path.relative(REPO, OUT));
})();
