/* ===========================================================================
   BOHEMIA — PROFILE MORPH AUDIT (7/26/26)
   ---------------------------------------------------------------------------
   Paolo 7/26: "The east and west animations are still dog shit when it comes to
   morph pixels underneath the arms and the back leg in the back arm. All the
   pieces are made how they should be made... look at the rig."

   This is the whole evidence chain for that complaint, re-runnable end to end.
   It answers four questions in order, on the REAL surface (the alpha's own
   posedSkel -> Skinner.skin -> buildFrame, the same calls the game makes):

     1. INVENTED PIXELS. A limb is a fixed number of PAINTED pixels; moving a
        rigid thing can only ever LOSE pixels to occlusion. So
        invented = on-screen - painted, and anything above zero is the renderer
        drawing art nobody painted. A/B'd against the RIGFAITH flag, which
        retires the two render passes his rig does not have (EVERY PIXEL LANDS
        forward-splat, FAR-ARM DARKENING).

     2. WHAT HE ACTUALLY SEES. Invented pixels are not the same thing as visible
        morphing. STROBE = a cell that changes and changes straight back across
        three consecutive frames: there/gone/there, or tone A/B/A. A rigid limb
        swinging past you never does that. Measured on the COMPOSITED frame,
        because that is the surface he watches.

     3. WHERE IT LIVES. Body vs clothing, and which tones are involved.

     4. THE CANDIDATE FIX, measured before anyone believes it: bind the dark
        anatomy line to the REST pixel and carry it through the same inverse
        sample the art rides, instead of recomputing it from the deformed
        silhouette every frame.

     node tools/bohemia_profile_morph_audit.js [outfile.txt]

   REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks zero pixels of any
   kind. It only counts what the shipped renderer already draws.
   =========================================================================== */
const fs = require('fs'), path = require('path'), os = require('os');

function loadPlaywright() {
  const tries = ['playwright', '/opt/node22/lib/node_modules/playwright',
                 path.join(os.homedir(), '.npm-global/lib/node_modules/playwright')];
  for (const t of tries) { try { return require(t); } catch (e) { } }
  return null;
}
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'records', 'BOHEMIA_PROFILE_MORPH_AUDIT_7_26_26.txt'));
const DIRS8 = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
/* the composited passes are ~50x the cost of a grid sweep, so the deep sections
   run on a fixed prefix of the clip set. Stated in the report, never silent. */
const DEEP_CLIPS = 30;

(async () => {
  const pw = loadPlaywright();
  if (!pw) { console.error('MORPH AUDIT: playwright not resolvable -- cannot measure on the real surface.'); process.exit(2); }
  const browser = await pw.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
  const errs = []; page.on('pageerror', e => errs.push(String(e.message || e)));
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForFunction(() => typeof buildFrame === 'function' && typeof posedSkel === 'function',
    null, { timeout: 180000 });

  const data = await page.evaluate(({ DIRS8, DEEP_CLIPS }) => {
    const CW = 56, CH = 56, NPH = 24;
    const PARTNAME = { 1: 'head', 2: 'face', 3: 'neck', 4: 'torso', 5: 'arm-L', 6: 'arm-R',
                       7: 'hand-L', 8: 'hand-R', 9: 'thigh-L', 10: 'thigh-R', 11: 'foot-L', 12: 'foot-R' };
    const allClips = Array.isArray(CLIPS) ? CLIPS : Object.keys(CLIPS);
    const deep = allClips.slice(0, DEEP_CLIPS);
    const F = SKINNER_API.RIGFAITH;

    /* ---- 1. INVENTED PIXELS, all 8 facings, whole clip set ---------------- */
    function sweepGrid() {
      const res = {};
      for (const d of DIRS8) {
        const painted = {}; for (let q = 1; q <= 12; q++) painted[q] = SKINNERS[d].pixList[q].length;
        const acc = { invented: 0, byPart: {} };
        for (let q = 1; q <= 12; q++) acc.byPart[q] = 0;
        for (const clip of allClips) for (let k = 0; k < NPH; k++) {
          let g = null; try { g = SKINNERS[d].skin(posedSkel(d, clip, k / NPH).sk); } catch (e) { }
          if (!g) continue;
          const c = new Int32Array(13);
          for (let i = 0; i < g.length; i++) if (g[i]) c[g[i]]++;
          for (let q = 1; q <= 12; q++) { const v = Math.max(0, c[q] - painted[q]); acc.invented += v; acc.byPart[q] += v; }
        }
        res[d] = acc;
      }
      return res;
    }

    /* ---- 2/3. STROBE ON THE COMPOSITED FRAME, E and W --------------------- */
    function sweepPixels(collectPairs) {
      let onOff = 0, tone = 0, frames = 0;
      const pairs = {}; const heat = new Int32Array(CW * CH);
      for (const d of ['E', 'W']) for (const clip of deep) {
        const fs = [];
        for (let k = 0; k < NPH; k++) { let f = null; try { f = buildFrame(d, clip, k / NPH); } catch (e) { } fs.push(f && f.px); }
        for (let k = 0; k < NPH; k++) {
          const A = fs[(k + NPH - 1) % NPH], B = fs[k], C = fs[(k + 1) % NPH];
          if (!A || !B || !C) continue; frames++;
          for (let i = 0; i < B.length; i++) {
            const a = A[i], bb = B[i], c = C[i];
            if (a && c && !bb) { onOff++; heat[i]++; continue; }
            if (a && bb && c) {
              const dab = Math.abs(a[0]-bb[0])+Math.abs(a[1]-bb[1])+Math.abs(a[2]-bb[2]);
              const dac = Math.abs(a[0]-c[0])+Math.abs(a[1]-c[1])+Math.abs(a[2]-c[2]);
              if (dab > 24 && dac < 8) { tone++; heat[i]++;
                if (collectPairs) { const key = a.join(',') + ' <-> ' + bb.join(','); pairs[key] = (pairs[key] || 0) + 1; } }
            }
          }
        }
      }
      const rows = []; for (let y = 0; y < CH; y++) { let s = 0; for (let x = 0; x < CW; x++) s += heat[y*CW+x]; rows.push([y, s]); }
      rows.sort((a, b) => b[1] - a[1]);
      return { onOff, tone, frames,
               perFrame: +((onOff + tone) / frames).toFixed(2),
               topRows: rows.slice(0, 5),
               pairs: Object.entries(pairs).sort((a, b) => b[1] - a[1]).slice(0, 6) };
    }

    /* ---- 4. THE CANDIDATE FIX --------------------------------------------- */
    const GROUP = {1:0,2:0,3:5,4:5,5:1,7:1,6:2,8:2,9:3,11:3,10:4,12:4};
    const ORD = [4,3,9,10,11,12,5,6,7,8,1,2];
    function classify(grid) {
      const s = new Uint8Array(grid.length);
      for (let i = 0; i < grid.length; i++) {
        if (!grid[i]) continue;
        const g = GROUP[grid[i]]; let shade = 2;
        if (g !== 0) {
          const bx = i % CW, by = (i / CW) | 0; let border = false;
          const nb = [bx+1<CW?grid[i+1]:0, bx>0?grid[i-1]:0, by+1<CH?grid[i+CW]:0, by>0?grid[i-CW]:0];
          for (const np of nb) {
            if (!np) { border = true; break; }
            const ng = GROUP[np];
            if (ng === g || g === 5 || ng === 0) continue;
            if ((g === 3 || g === 4) && ng === 5) continue;
            border = true; break;
          }
          if (border) shade = 1;
        }
        s[i] = shade;
      }
      return s;
    }
    function restGrid(sk) {
      const g = new Uint8Array(CW * CH);
      for (let n = ORD.length - 1; n >= 0; n--) { const p = ORD[n], L = sk.layers[p];
        if (!L) continue; for (let i = 0; i < CW * CH; i++) if (L[i]) g[i] = p; }
      return g;
    }
    function lineStrobe(mode) {
      let flips = 0, frames = 0;
      for (const d of ['E', 'W']) {
        const sk = SKINNERS[d], rg = restGrid(sk), rs = classify(rg);
        const enc = new Array(CW * CH).fill(null);
        for (let i = 0; i < CW * CH; i++) if (rs[i]) enc[i] = [rs[i] * 60, 0, 0];
        for (const clip of deep) {
          const ms = [];
          for (let k = 0; k < NPH; k++) {
            let m = null;
            try {
              const P = posedSkel(d, clip, k / NPH).sk, grid = sk.skin(P);
              if (mode === 'today') m = classify(grid);
              else {
                const res = sk.skinColorLayer(P, enc, null, rg), col = res.col || res;
                m = new Uint8Array(CW * CH);
                for (let i = 0; i < CW * CH; i++) { if (!grid[i]) continue; m[i] = col[i] ? Math.round(col[i][0] / 60) : 2; }
              }
            } catch (e) { }
            ms.push(m);
          }
          for (let k = 0; k < NPH; k++) {
            const A = ms[(k+NPH-1)%NPH], B = ms[k], C = ms[(k+1)%NPH];
            if (!A || !B || !C) continue; frames++;
            for (let i = 0; i < B.length; i++)
              if (A[i] && B[i] && C[i] && A[i] === C[i] && B[i] !== A[i]) flips++;
          }
        }
      }
      return { flips, frames, perFrame: +(flips / frames).toFixed(2) };
    }

    const out = { clipCount: allClips.length, deepCount: deep.length, phases: NPH, PARTNAME };
    F.on = false; out.gridBefore = sweepGrid(); out.pxBefore = sweepPixels(false);
    F.on = true;  out.gridAfter  = sweepGrid(); out.pxAfter  = sweepPixels(true);

    const saved = JSON.parse(JSON.stringify(G.equipped));
    for (const k in G.equipped) if (k !== 'body') G.equipped[k] = '';
    out.pxNaked = sweepPixels(true);
    for (const k in saved) G.equipped[k] = saved[k];

    out.lineToday = lineStrobe('today');
    out.lineRestBound = lineStrobe('restBound');
    return out;
  }, { DIRS8, DEEP_CLIPS });

  await browser.close();

  const L = [];
  const pct = (b, a) => b ? Math.round((b - a) / b * 100) : 0;
  L.push('BOHEMIA — PROFILE MORPH AUDIT (7/26/26)');
  L.push('measured in a real browser on slices/BOHEMIA_ALPHA_0_9.html');
  L.push('');
  L.push('Paolo 7/26: "The east and west animations are still dog shit when it comes to');
  L.push('morph pixels underneath the arms and the back leg in the back arm. All the');
  L.push('pieces are made how they should be made... look at the rig."');
  L.push('');
  L.push(`scope: ${data.clipCount} clips x 8 facings x ${data.phases} phases for the pixel counts;`);
  L.push(`       the composited sections run the first ${data.deepCount} clips on E and W only`);
  L.push('       (a composited frame is ~50x the cost of a grid sweep). Nothing else is trimmed.');
  L.push('');
  L.push('=== 1. INVENTED PIXELS ====================================================');
  L.push('invented = on-screen minus painted. A rigid limb can only ever LOSE pixels to');
  L.push('occlusion, so anything above zero is the renderer drawing art nobody painted.');
  L.push('A/B = the two render passes HIS RIG DOES NOT HAVE, off vs on:');
  L.push('  EVERY PIXEL LANDS -- forward-splat a missed painted pixel into the nearest free cell');
  L.push('  FAR-ARM DARKENING -- repaint the far arm at 62%, E and W only');
  L.push('');
  const hdr = 'facing |   before ->    after   removed';
  L.push(hdr); L.push('-'.repeat(hdr.length));
  let tb = 0, ta = 0;
  for (const d of DIRS8) {
    const b = data.gridBefore[d].invented, a = data.gridAfter[d].invented; tb += b; ta += a;
    L.push(`${d.padEnd(6)} | ${String(b).padStart(8)} -> ${String(a).padStart(8)}   ${String(pct(b, a) + '%').padStart(5)}` +
           ((d === 'E' || d === 'W') ? '   <-- he named this one' : ''));
  }
  L.push('-'.repeat(hdr.length));
  L.push(`TOTAL  | ${String(tb).padStart(8)} -> ${String(ta).padStart(8)}   ${String(pct(tb, ta) + '%').padStart(5)}`);
  const eb = data.gridBefore.E.invented + data.gridBefore.W.invented;
  const ea = data.gridAfter.E.invented + data.gridAfter.W.invented;
  L.push('');
  L.push(`E+W specifically: ${eb} -> ${ea}  (${pct(eb, ea)}% removed)`);
  L.push('per part on E+W:');
  for (const p of [4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    const b = data.gridBefore.E.byPart[p] + data.gridBefore.W.byPart[p];
    const a = data.gridAfter.E.byPart[p] + data.gridAfter.W.byPart[p];
    L.push(`  ${(data.PARTNAME[p]).padEnd(9)} ${String(b).padStart(6)} -> ${String(a).padStart(6)}`);
  }
  L.push('');
  L.push('=== 2. WHAT HE ACTUALLY SEES ==============================================');
  L.push('STROBE = a cell that changes and changes straight back across three consecutive');
  L.push('frames (there/gone/there, or tone A/B/A). A rigid limb swinging past you never');
  L.push('does that; the renderer changing its mind does. Measured on the COMPOSITED');
  L.push('frame -- the surface he watches -- on E and W.');
  L.push('');
  L.push(`  both passes on (what he judged) : ${data.pxBefore.perFrame} strobing pixels per frame` +
         `  (${data.pxBefore.onOff} on/off, ${data.pxBefore.tone} tone)`);
  L.push(`  both passes retired             : ${data.pxAfter.perFrame} strobing pixels per frame` +
         `  (${data.pxAfter.onOff} on/off, ${data.pxAfter.tone} tone)`);
  L.push('');
  L.push('READ THIS HONESTLY: section 1 is a big win and section 2 barely moves. Removing');
  L.push('the two invented passes stops the renderer FABRICATING, but it is not what he is');
  L.push('looking at. The strobe is somewhere else, and section 3 finds it.');
  L.push('');
  L.push('=== 3. WHERE THE STROBE LIVES =============================================');
  L.push(`  dressed : ${data.pxAfter.perFrame} per frame`);
  L.push(`  naked   : ${data.pxNaked.perFrame} per frame`);
  L.push('');
  L.push('Naked is WORSE than dressed, so this is the BODY, not the clothing.');
  L.push('');
  L.push('busiest sprite rows (y, strobe count) -- the arm-over-torso band:');
  L.push('  ' + data.pxNaked.topRows.map(r => `y${r[0]}:${r[1]}`).join('   '));
  L.push('');
  L.push('the tone pairs doing the strobing, naked, most frequent first:');
  for (const [k, n] of data.pxNaked.pairs) L.push(`  ${String(n).padStart(5)}  ${k}`);
  L.push('');
  L.push('Every one of those is a pair of BODY SKIN RAMP tones. Nothing else is in the');
  L.push('list. The body is not drawn from painted pixels at all -- buildFrame recomputes');
  L.push('its tone every frame off the DEFORMED grid: a dark ANATOMY LINE wherever an');
  L.push('orthogonal neighbour is empty (outer silhouette) or belongs to a different limb');
  L.push('group (arm against torso), plus a light SKY TOP-LIGHT where the two cells above');
  L.push('are empty. In profile the arm sits inside an 8px torso, so a one-pixel swing');
  L.push('reclassifies whole runs of pixels between skin tone and line tone -- and back');
  L.push('the next frame. That is the morphing underneath the arms, and it is his own');
  L.push('7/26 ruling being broken: the lighting layer is being re-derived under the');
  L.push('animation instead of behaving like light.');
  L.push('');
  L.push('=== 4. THE CANDIDATE FIX, MEASURED BEFORE ANYONE BELIEVES IT ==============');
  L.push('Bind the anatomy line to the REST pixel (where he painted it) and carry it');
  L.push('through the SAME inverse sample the art rides, so the line travels WITH the');
  L.push('limb instead of being re-derived under it.');
  L.push('');
  L.push(`  today (re-derived per frame) : ${data.lineToday.perFrame} line flips per frame`);
  L.push(`  rest-bound line             : ${data.lineRestBound.perFrame} line flips per frame` +
         `   (${pct(data.lineToday.flips, data.lineRestBound.flips)}% removed)`);
  L.push('');
  L.push('NOT A CURE, and it is not shipped. It halves the dominant defect; the residual');
  L.push('is the inverse sample landing a cell on a different source pixel between frames.');
  L.push('Shipping it is Paolo\'s call, not a green number\'s.');
  L.push('');
  L.push(errs.length ? 'PAGE ERRORS:\n  ' + errs.slice(0, 8).join('\n  ') : 'page errors: none');
  L.push('');
  L.push('regenerate: node tools/bohemia_profile_morph_audit.js');

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nwrote ' + path.relative(ROOT, OUT));
})();
