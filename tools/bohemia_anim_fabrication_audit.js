/* ===========================================================================
   BOHEMIA — ANIMATION FABRICATION AUDIT (7/26/26)
   ---------------------------------------------------------------------------
   Paolo 7/26, on the real thing: "the biggest problem is where the torso is and
   the arm was sitting, and then the arm moves and then it's just like morphing
   and glitching and PROVIDING EXTRA PIXELS and it's looking like dog shit."

   This measures exactly that claim, on the shipped alpha, in a real browser.

   THE METRIC, and why it cannot be argued with:
   A limb is a fixed number of PAINTED pixels. Rotating or moving a rigid thing
   can never make it bigger -- occlusion can only ever take pixels AWAY. So for
   every part, in every frame:

       invented = max(0, pixels_on_screen - pixels_painted)

   Any positive number is the renderer drawing pixels Paolo never painted. Zero
   is the bar the LIMB RIGID STAMP law sets
   (laws/BOHEMIA_ADDENDUM_ANIMATION_REJECTED_7_26_26.md).

   It runs the REAL path: the alpha's own posedSkel() -> the alpha's own
   Skinner.skin(), the same two calls buildFrame makes. No reimplementation.

     node tools/bohemia_anim_fabrication_audit.js [outfile.txt]

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
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'records', 'BOHEMIA_ANIM_FABRICATION_AUDIT_7_26_26.txt'));
const DIRS8 = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];

(async () => {
  const pw = loadPlaywright();
  if (!pw) { console.error('AUDIT: playwright not resolvable -- cannot measure on the real surface.'); process.exit(2); }
  const browser = await pw.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
  const errs = []; page.on('pageerror', e => errs.push(String(e.message || e)));
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 120000 });
  await page.waitForFunction(() => typeof drawChar === 'function' && typeof posedSkel === 'function', null, { timeout: 120000 });

  const data = await page.evaluate(({ DIRS8 }) => {
    const CW = 56, CH = 56, PH = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875];
    const PARTNAME = { 1: 'head', 2: 'face', 3: 'neck', 4: 'torso', 5: 'arm-L', 6: 'arm-R',
                       7: 'hand-L', 8: 'hand-R', 9: 'thigh-L', 10: 'thigh-R', 11: 'foot-L', 12: 'foot-R' };
    /* painted pixel count per (dir, part) straight off the live skinner */
    const painted = {};
    for (const d of DIRS8) { painted[d] = {}; for (let p = 1; p <= 12; p++) painted[d][p] = SKINNERS[d].pixList[p].length; }

    /* A/B: the same sweep with the JOINT WELD + HAND SLIVER on (the renderer
       Paolo called dog shit) and off (this turn's change). Same frames, same
       code path, one switch between them. */
    function sweepTotal(rigidOn) {
      G.rigidLimbs = rigidOn; SKINNER_API.RIGID.on = rigidOn;
      let inv = 0, dirty = 0, fr = 0;
      for (const clip of CLIPS) for (const d of DIRS8) for (const ph of PH) {
        let P, g; try { P = posedSkel(d, clip, ph).sk; g = SKINNERS[d].skin(P); } catch (e) { continue; }
        const c = {}; for (let i = 0; i < g.length; i++) if (g[i]) c[g[i]] = (c[g[i]] || 0) + 1;
        let fi = 0; for (let q = 1; q <= 12; q++) fi += Math.max(0, (c[q] || 0) - painted[d][q]);
        inv += fi; if (fi) dirty++; fr++;
      }
      return { invented: inv, dirty: dirty, frames: fr };
    }
    const AB = { withWeld: sweepTotal(false), withoutWeld: sweepTotal(true) };
    G.rigidLimbs = true; SKINNER_API.RIGID.on = true;

    const perClip = {}, perPart = {};
    for (let p = 1; p <= 12; p++) perPart[p] = { invented: 0, frames: 0, worst: 0 };
    let frames = 0, totalInvented = 0, framesDirty = 0, worstFrame = null;

    for (const clip of CLIPS) {
      let cInv = 0, cFrames = 0, cDirty = 0, cWorst = 0, cWorstAt = '';
      for (const d of DIRS8) for (const ph of PH) {
        let P; try { P = posedSkel(d, clip, ph).sk; } catch (e) { continue; }
        let g; try { g = SKINNERS[d].skin(P); } catch (e) { continue; }
        const cnt = {};
        for (let i = 0; i < g.length; i++) if (g[i]) cnt[g[i]] = (cnt[g[i]] || 0) + 1;
        let fInv = 0;
        for (let p = 1; p <= 12; p++) {
          const inv = Math.max(0, (cnt[p] || 0) - painted[d][p]);
          if (inv) { fInv += inv; perPart[p].invented += inv; perPart[p].frames++;
                     if (inv > perPart[p].worst) perPart[p].worst = inv; }
        }
        frames++; cFrames++;
        if (fInv) { cInv += fInv; totalInvented += fInv; cDirty++; framesDirty++;
          if (fInv > cWorst) { cWorst = fInv; cWorstAt = d + '@' + ph; }
          if (!worstFrame || fInv > worstFrame.n) worstFrame = { n: fInv, clip: clip, at: d + '@' + ph }; }
      }
      perClip[clip] = { invented: cInv, frames: cFrames, dirty: cDirty, worst: cWorst, worstAt: cWorstAt };
    }
    return { AB: AB, painted: painted, perClip: perClip, perPart: perPart, frames: frames,
             totalInvented: totalInvented, framesDirty: framesDirty, worstFrame: worstFrame,
             partName: PARTNAME, clipCount: CLIPS.length };
  }, { DIRS8 });

  const L = [];
  L.push('=== BOHEMIA — ANIMATION FABRICATION AUDIT (7/26/26) ===');
  L.push('');
  L.push('Paolo 7/26: "the arm moves and then it\'s just like morphing and glitching');
  L.push('and providing extra pixels and it\'s looking like dog shit."');
  L.push('');
  L.push('THE METRIC: a limb is a fixed number of PAINTED pixels. Moving a rigid');
  L.push('thing can never make it bigger -- occlusion only ever takes pixels away.');
  L.push('So for every part in every frame:  invented = on-screen minus painted.');
  L.push('Anything above zero is the renderer drawing pixels he never painted.');
  L.push('Measured through the shipped alpha in a real browser: posedSkel() ->');
  L.push('Skinner.skin(), the same two calls the game itself makes.');
  L.push('');
  L.push('SCOPE: ' + data.clipCount + ' clips x 8 facings x 8 phases = ' + data.frames + ' frames.');
  L.push('');
  L.push('--- THE A/B: WHAT THIS TURN REMOVED -------------------------------------');
  L.push('  Same frames, same code path, one switch. The JOINT WELD stamped limb');
  L.push('  pixels a SECOND time under the parent bone near the shoulder/elbow --');
  L.push('  duplicates, sprayed exactly at the torso/arm junction Paolo named.');
  L.push('');
  L.push('    renderer he called dog shit : ' + data.AB.withWeld.invented + ' invented pixels, ' +
         data.AB.withWeld.dirty + ' dirty frames');
  L.push('    with the weld retired       : ' + data.AB.withoutWeld.invented + ' invented pixels, ' +
         data.AB.withoutWeld.dirty + ' dirty frames');
  const cut = data.AB.withWeld.invented ? (1 - data.AB.withoutWeld.invented / data.AB.withWeld.invented) : 0;
  L.push('    REMOVED                     : ' + (data.AB.withWeld.invented - data.AB.withoutWeld.invented) +
         ' pixels  (' + (100 * cut).toFixed(1) + '%)');
  L.push('');
  L.push('  NOT A FULL FIX, and this report is where that is said out loud. The');
  L.push('  remaining invention is inherent to resampling pixel art through a');
  L.push('  continuous bone transform, and it only reaches zero when limbs stop');
  L.push('  being resampled. Two ways to force zero were built and MEASURED at');
  L.push('  exactly 0 invented pixels this turn, and BOTH were rejected on the');
  L.push('  render because they shredded the silhouette:');
  L.push('    - ONE SOURCE, ONE PIXEL (veto a painted pixel landing twice)');
  L.push('    - PIXEL CONSERVATION (forward-splat each painted pixel to one cell)');
  L.push('  The real answer is a quantised angle atlas or painted frames. See the');
  L.push('  addendum\'s order of work.');
  L.push('');
  L.push('--- THE HEADLINE (current renderer) -------------------------------------');
  L.push('  frames containing invented pixels : ' + data.framesDirty + ' of ' + data.frames +
         '  (' + (100 * data.framesDirty / data.frames).toFixed(1) + '%)');
  L.push('  invented pixels, total            : ' + data.totalInvented);
  L.push('  worst single frame                : ' + (data.worstFrame ? data.worstFrame.n + ' invented pixels in ' + data.worstFrame.clip + ' ' + data.worstFrame.at : 'none'));
  L.push('');
  L.push('--- WHICH BODY PART GETS WRECKED ----------------------------------------');
  const parts = Object.keys(data.perPart).map(Number)
    .sort((a, b) => data.perPart[b].invented - data.perPart[a].invented);
  for (const p of parts) {
    const r = data.perPart[p];
    if (!r.invented) continue;
    L.push('  ' + data.partName[p].padEnd(8) + ' invented=' + String(r.invented).padStart(6) +
           '  in ' + String(r.frames).padStart(5) + ' frames   worst frame +' + r.worst + 'px');
  }
  const clean = parts.filter(p => !data.perPart[p].invented).map(p => data.partName[p]);
  L.push('  CLEAN (never invents a pixel): ' + (clean.join(', ') || '(none)'));
  L.push('');
  L.push('--- EVERY CLIP, WORST FIRST ---------------------------------------------');
  L.push('  clip                  invented   dirty frames        worst frame');
  const clips = Object.keys(data.perClip).sort((a, b) => data.perClip[b].invented - data.perClip[a].invented);
  for (const c of clips) {
    const r = data.perClip[c];
    L.push('  ' + c.padEnd(20) + String(r.invented).padStart(8) + '   ' +
           String(r.dirty).padStart(3) + '/' + String(r.frames).padEnd(4) +
           '           ' + (r.worst ? '+' + r.worst + 'px ' + r.worstAt : '-'));
  }
  L.push('');
  const spotless = clips.filter(c => !data.perClip[c].invented);
  L.push('--- THE CLIPS THAT ARE ALREADY CLEAN ------------------------------------');
  L.push('  ' + (spotless.length ? spotless.join(', ') : '(none — every clip invents pixels)'));
  L.push('');
  L.push('--- WHERE THE INVENTED PIXELS COME FROM (named in the source) -----------');
  L.push('  JOINT WELD        stamps limb pixels a SECOND time under the parent');
  L.push('                    frame near the shoulder/elbow. Duplicates, exactly at');
  L.push('                    the torso/arm junction Paolo named.');
  L.push('  refineSkin        invents pixels with no rest source at all (src=-1) to');
  L.push('                    close pinholes the resample opened.');
  L.push('  EVERY PIXEL LANDS forward-splats painted sources the inverse sample');
  L.push('                    missed -- necessary only BECAUSE the resample misses.');
  L.push('  MIN HAND SLIVER   stamps a 2x4 rectangle of hand pixels when a head-on');
  L.push('                    pose buries a hand. Draws a hand the pose does not put');
  L.push('                    there. This is the hand "feature" he says clips wrong.');
  L.push('');
  L.push('  All four exist to paper over damage from ONE root cause: limb pixels are');
  L.push('  RESAMPLED through a continuous bone transform. At any angle that is not a');
  L.push('  multiple of 90 degrees that resample cannot be lossless. On pixel art,');
  L.push('  lossy resampling IS morphing. The HEAD is exempt by law (HEAD RIGID STAMP,');
  L.push('  Paolo 7/2/26) and the head is the part nobody complains about.');
  if (errs.length) { L.push(''); L.push('PAGE ERRORS: ' + errs.slice(0, 5).join(' | ')); }
  L.push('');
  const txt = L.join('\n') + '\n';
  fs.writeFileSync(OUT, txt);
  console.log(txt.split('\n').slice(0, 40).join('\n'));
  console.log('...full report: ' + path.relative(ROOT, OUT));
  await browser.close();
})();
