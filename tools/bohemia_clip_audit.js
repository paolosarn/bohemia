/* BOHEMIA -- THE 63-CLIP AUDIT (ANIMATION lane, 9/5/26)
 *
 * HIS ORDER (8/25 playtest dispatch, item 10, LOCKED): "I KNOW WE NEED TO WORK ON
 * FIXING THE ANIMATIONS AND SHIT, ALOT OF THEM ARE KINDA FUCKED. WE NEED NEW ONES."
 * AUDIT FIRST, COOK SECOND: list every animation, play each on the real surface,
 * mark which are broken and HOW, and show him the list before recooking.
 *
 * *** WHY THIS TOOL HAS TO EXIST WHEN TWO GATES ARE ALREADY GREEN. ***
 * clip_health_gate (8/2) sweeps for frames that THROW, clips that have gone STILL,
 * and frames that render EMPTY. loop_seam_gate (8/18) sweeps for a clip that SNAPS
 * at the wrap. Both are green on every clip, today, measured. He is still looking at
 * the same set and calling it fucked. So the defect he sees is in NEITHER dimension:
 * OUR ANIMATION GATES CAN SAY "CRASHES" OR "MOVES" AND HAVE NO WORD FOR "MOVES WRONG".
 * That is the same shape as day 20's finding that the gates had no word for OWED.
 *
 * WHAT THIS MEASURES, AND WHY EACH ONE IS A WAY A CLIP IS FUCKED WHILE PASSING:
 *
 *  1. READABILITY -- peak per-frame change as a share of the body's own ink.
 *     A clip can move and still be invisible at the size the game draws it. "A dial
 *     that cannot move the pixels is not a dial" (8/27) applied to a whole clip.
 *
 *  2. WHERE THE MOTION IS -- the share of moved pixels landing in head / torso /
 *     arms / legs, off the part-id grid buildFrame already returns (CAND, line 2830:
 *     1-2 head, 3-4 torso, 5-8 arms, 9-12 legs). THIS IS THE ONE THAT ANSWERS HIM.
 *     A clip named `kick` whose motion is 4% legs is a generic sway wearing a name,
 *     and it passes every existing check because it moves, does not throw, and loops.
 *
 *  3. FACING COLLAPSE -- the weakest facing against the strongest. A clip alive
 *     head-on and dead in profile is his oldest complaint about this rig, and no
 *     sweep has ever asked it of the whole set.
 *
 *  4. TWINS -- two named clips whose rendered frames are identical. Two names and
 *     one motion is the ONE ID ONE WHOLE PERSON mistake with a different noun, and
 *     with 64 hand-authored pose functions it is a real risk, never checked.
 *
 * MEASURED ON THE RENDERED FRAME, NEVER ON RIG MATHS -- 8/18 learned that the hard
 * way (hand travel in rig-space invented a 31-clip repo-wide finding that was not
 * real). And sampled at FRAME_CACHE.buckets, the renderer's own frame count, because
 * a coarse sweep INVENTS regressions (8/2 clip_health_gate header, learned twice).
 *
 * SWING IS LEFT WHERE THE GAME SHIPS IT (G.swing = BAKED.swingAmt). The audit reads
 * the clip a player gets, not a clip turned up to be measurable.
 *
 * REFERENCE CHECK (9/4 law, standing duty for this lane): the thresholds are not
 * eyeballed. Compared against standard sprite-animation practice for readable
 * cycles -- the rule that an action must be legible in SILHOUETTE and that the
 * limb carrying an action is the one that reads it (a kick is legs, a wave is
 * arms, a nod is the head). What was taken: only the PRINCIPLE that the acting
 * limb must dominate the frame, and that motion below a few percent of the body
 * does not read at sprite scale. What changed: the numbers are OURS, derived from
 * this rig's own measured distribution, not copied from anywhere.
 *
 * THIS TOOL DECIDES NOTHING. It produces the list. Which clips survive is HIS
 * (backlog ANIMS row: "which survive = HIS").
 */
const path = require('path');
const { settle: SETTLE } = require(path.join(__dirname, '..', 'gates', 'bohemia_settle.js'));
const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');

/* WHAT THE NAME PROMISES. Mechanism-mine: this is ANATOMY, not canon -- which limb
 * performs a kick is not a ruling Paolo reserved. A clip absent from this table is
 * measured and reported but never judged against a name, because a table that
 * guesses is worse than a table that abstains (MECHANISM-MINE / CONTENTS-PAOLO'S).
 * `any` = a whole-body action with no single limb that must carry it. */
const PROMISE = {
  idle:'any', walk:'legs', run:'legs', 'tired-walk':'legs', sneak:'legs', wander:'legs',
  jump:'legs', kick:'legs', stomp:'legs', dance:'any', balance:'any', swagger:'legs',
  dodge:'any', stumble:'any', drunk:'any', dig:'arms', push:'arms', shove:'arms',
  throw:'arms', pickup:'arms', carry:'arms', beckon:'arms', point:'arms', shrug:'arms',
  'hands-up':'arms', fistpump:'arms', cheer:'arms', shadowbox:'arms', pour:'arms',
  inject:'arms', tweeze:'arms', search:'arms', stretch:'arms', bow:'any', pray:'arms',
  greet:'arms', wave:'arms', preach:'arms', argue:'arms', taunt:'arms', rage:'any',
  nod:'head', 'look-around':'head', 'crack-neck':'head', shout:'head', laugh:'head',
  cough:'head', whistle:'head', talk:'head', sigh:'any', eat:'arms', drink:'arms',
  smoke:'arms', startle:'any', shiver:'any', brace:'any', lean:'any', sleep:'any',
  'sit-ground':'any', 'sit-chair':'any', pistol:'arms', 'two-hand':'arms', deadeye:'arms',
  headshot:'any', 'headshot-2':'any', salute:'arms'
};

const REGION_OF = { 1:'head',2:'head', 3:'torso',4:'torso',
                    5:'arms',6:'arms',7:'arms',8:'arms',
                    9:'legs',10:'legs',11:'legs',12:'legs' };

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { console.log('playwright unavailable: ' + e.message); process.exit(1); }
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);
  if (errs.length) { console.log('ALPHA THREW ON LOAD: ' + errs[0]); await b.close(); process.exit(1); }

  const R = await pg.evaluate((REGION_OF) => {
    const D = ['S','SE','E','NE','N','NW','W','SW'];
    const N = (typeof FRAME_CACHE !== 'undefined' && FRAME_CACHE.buckets) || 24;
    const TERM = (typeof TERMINAL !== 'undefined') ? TERMINAL : {};
    const out = [];
    const sigs = {};                       /* clip -> S-facing frame signature chain */

    for (const c of CLIPS) {
      const rec = { clip: c, beats: (typeof ANIMBEATS!=='undefined' && ANIMBEATS[c]) || 2,
                    terminal: !!TERM[c], perDir: {}, threw: 0 };
      let regTot = { head:0, torso:0, arms:0, legs:0 };
      let areaTot = { head:0, torso:0, arms:0, legs:0 };
      let bestPeakShare = 0, worstPeakShare = 1e9, bestDir = null, worstDir = null;

      for (const d of D) {
        const frames = [];
        let ok = true;
        for (let k = 0; k < N; k++) {
          let fr;
          try { fr = buildFrame(d, c, k / N); }
          catch (e) { rec.threw++; ok = false; break; }
          frames.push(fr.grid);
        }
        if (!ok) continue;

        /* ink = the body's own size, so a share is comparable across clips */
        let ink = 0;
        const area = { head:0, torso:0, arms:0, legs:0 };
        for (let i = 0; i < frames[0].length; i++) {
          if (frames[0][i]) ink++;
          const r = REGION_OF[frames[0][i]]; if (r) area[r]++;
        }

        /* per-frame change, and where each changed pixel lives. A pixel that
           changed is attributed to whichever part occupies it in EITHER frame --
           a limb arriving and a limb leaving are both that limb's motion. */
        let peak = 0, travel = 0;
        const reg = { head:0, torso:0, arms:0, legs:0 };
        const last = rec.terminal ? frames.length - 1 : frames.length;   /* terminal clips do not wrap */
        for (let k = 0; k < last; k++) {
          const A = frames[k], B = frames[(k + 1) % frames.length];
          let ch = 0;
          for (let i = 0; i < A.length; i++) {
            if (A[i] === B[i]) continue;
            ch++;
            const ra = REGION_OF[A[i]], rb = REGION_OF[B[i]];
            if (ra) reg[ra] += 1; if (rb && rb !== ra) reg[rb] += 1;
          }
          if (ch > peak) peak = ch;
          travel += ch;
        }
        const peakShare = ink ? peak / ink : 0;
        rec.perDir[d] = { ink, peak, peakShare: +peakShare.toFixed(4),
                          travel, regions: reg, area };
        if (peakShare > bestPeakShare) { bestPeakShare = peakShare; bestDir = d; }
        if (peakShare < worstPeakShare) { worstPeakShare = peakShare; worstDir = d; }
        for (const k2 in reg) regTot[k2] += reg[k2];
        for (const k2 in area) areaTot[k2] += area[k2];

        if (d === 'S') {
          /* a signature chain over the whole S cycle, for the twin test */
          let chain = '';
          for (const f of frames) {
            let s = 2166136261 >>> 0;
            for (let i = 0; i < f.length; i++) if (f[i]) { s ^= (i * 31 + f[i]); s = Math.imul(s, 16777619) >>> 0; }
            chain += s.toString(36) + '.';
          }
          sigs[c] = chain;
        }
      }

      const sum = regTot.head + regTot.torso + regTot.arms + regTot.legs;
      const asum = areaTot.head + areaTot.torso + areaTot.arms + areaTot.legs;
      rec.areaShare = asum ? { head:+(areaTot.head/asum).toFixed(3), torso:+(areaTot.torso/asum).toFixed(3),
                               arms:+(areaTot.arms/asum).toFixed(3), legs:+(areaTot.legs/asum).toFixed(3) } : null;
      rec.regionShare = sum ? { head:+(regTot.head/sum).toFixed(3), torso:+(regTot.torso/sum).toFixed(3),
                                arms:+(regTot.arms/sum).toFixed(3), legs:+(regTot.legs/sum).toFixed(3) } : null;
      rec.bestPeakShare = +bestPeakShare.toFixed(4); rec.bestDir = bestDir;
      rec.worstPeakShare = +(worstPeakShare===1e9?0:worstPeakShare).toFixed(4); rec.worstDir = worstDir;
      out.push(rec);
    }

    /* TWINS: identical rendered S-cycles under two names */
    const twins = [], keys = Object.keys(sigs);
    for (let i = 0; i < keys.length; i++)
      for (let j = i + 1; j < keys.length; j++)
        if (sigs[keys[i]] === sigs[keys[j]]) twins.push([keys[i], keys[j]]);

    return { buckets: N, nClips: CLIPS.length, clips: out, twins };
  }, REGION_OF);

  await b.close();

  /* ---- report ---- */
  const L = [];
  const say = s => { L.push(s); console.log(s); };
  say('BOHEMIA -- THE 63-CLIP AUDIT. Every clip, 8 facings, ' + R.buckets + ' rendered frames.');
  say('Measured on the real surface through buildFrame, the path the game draws.');
  say('');
  say('CLIPS FOUND: ' + R.nClips + '   (CLIPS array + candidates pushed at load)');
  say('');

  const rows = R.clips.slice();
  /* 1. READABILITY */
  rows.sort((a, b2) => a.bestPeakShare - b2.bestPeakShare);
  say('=== 1. HOW MUCH IT MOVES (peak frame-to-frame change / the body\'s own ink) ===');
  say('    A clip below a few percent does not read at the size the game draws it.');
  say('    best% = its strongest facing. worst% = its weakest.');
  say('');
  say('     best%  worst%  bestDir worstDir  clip');
  for (const r of rows)
    say('    ' + (r.bestPeakShare*100).toFixed(2).padStart(6) + '  ' +
        (r.worstPeakShare*100).toFixed(2).padStart(6) + '   ' +
        String(r.bestDir).padEnd(7) + ' ' + String(r.worstDir).padEnd(8) + '  ' + r.clip);
  say('');

  /* 2. WHERE THE MOTION IS vs WHAT THE NAME PROMISES */
  /* *** THE FIRST RULER HERE WAS WRONG AND IT IS WORTH THE WORDS (9/5). *** It ranked
     regions by their RAW share of changed pixels, and called a clip's name broken when
     some other region led. That made `taunt` a failure on 33.0% head against 32.9% arms
     -- a coin flip reported as a defect -- because a raw share is really a question about
     AREA. Measured on the rig: head 16.4% of the body, torso 24.3%, arms 26.8%, legs 32.6%.
     So the honest question is not "which region moved the most pixels" but "which region
     moved MORE THAN ITS OWN SIZE", which is what a person reads as a limb doing the acting.
     WORK INDEX = a region's share of the motion / its share of the body. 1.00 = it moved
     exactly its own weight; above 1 it is carrying the clip.
     THE RAW RULER WAS NOT MERELY NOISY, IT INVERTED THREE CLIPS (smoke, pickup, carry).
     Fix the ruler, never the target (8/1). */
  say('=== 2. WHICH LIMB IS DOING THE ACTING ===');
  say('    WORK INDEX = a region\'s share of the motion / its share of the body.');
  say('    1.00 = it moved exactly its own weight. Above 1 it is carrying the clip.');
  say('    Region sizes measured on this rig, not assumed.');
  say('');
  say('     head torso  arms  legs   promise  carries?  clip');
  const nameFails = [];
  const REG4 = ['head','torso','arms','legs'];
  for (const r of R.clips) {
    if (!r.regionShare || !r.areaShare) continue;
    const w = {};
    for (const k of REG4) w[k] = r.areaShare[k] ? r.regionShare[k] / r.areaShare[k] : 0;
    r.work = w;
    const top = REG4.slice().sort((a,b2)=>w[b2]-w[a])[0];
    const p = PROMISE[r.clip];
    let verdict = '-';
    if (p && p !== 'any') {
      if (top === p) verdict = 'yes';
      else { verdict = 'NO(' + top + ')'; nameFails.push({ clip:r.clip, want:p, wantW:w[p], got:top, gotW:w[top] }); }
    }
    say('    ' + w.head.toFixed(2).padStart(5) + ' ' + w.torso.toFixed(2).padStart(5) + ' ' +
        w.arms.toFixed(2).padStart(5) + ' ' + w.legs.toFixed(2).padStart(5) + '   ' +
        String(p||'?').padEnd(8) + ' ' + verdict.padEnd(9) + ' ' + r.clip);
  }
  say('');
  say('    THE NAME DOES NOT CARRY: ' + nameFails.length + ' of ' +
      R.clips.filter(r=>PROMISE[r.clip] && PROMISE[r.clip]!=='any').length + ' clips with a named limb.');
  for (const f of nameFails)
    say('      ' + f.clip.padEnd(14) + ' promises ' + f.want.padEnd(6) + ' (work ' + f.wantW.toFixed(2) +
        ') but ' + f.got + ' carries it (work ' + f.gotW.toFixed(2) + ')');
  say('');
  say('    *** READ THAT LIST AS A LIST OF QUESTIONS, NOT VERDICTS. *** Looking at the');
  say('    strips settled several of them AGAINST THE TABLE, not against the clip: a');
  say('    whistle really is fingers to the mouth (arms), a push really is driven from');
  say('    the legs, people really do talk with their hands. The table above is a claim');
  say('    about anatomy and the picture outranks it. What survived looking is listed in');
  say('    the record; everything else here is the table being naive.');
  say('');
  /* WHO CARRIES THE WHOLE SET -- the structural question, asked once over 105 clips */
  const carry = { head:0, torso:0, arms:0, legs:0 };
  const med = { head:[], torso:[], arms:[], legs:[] };
  for (const r of R.clips) {
    if (!r.work) continue;
    const top = REG4.slice().sort((a,b2)=>r.work[b2]-r.work[a])[0];
    carry[top]++;
    for (const k of REG4) med[k].push(r.work[k]);
  }
  const median = a => { const b2 = a.slice().sort((x,y)=>x-y); return b2.length ? b2[b2.length>>1] : 0; };
  say('    ACROSS THE WHOLE SET -- which region carries the clip, counted over ' + R.clips.length + ':');
  say('      ' + REG4.map(k=>k+' '+carry[k]).join('   '));
  say('    median work index:  ' + REG4.map(k=>k+' '+median(med[k]).toFixed(2)).join('   '));
  say('');

  /* 3. FACING COLLAPSE */
  say('=== 3. FACING COLLAPSE (a clip alive one way and dead another) ===');
  say('    ratio = weakest facing / strongest facing. 1.00 = the same everywhere.');
  say('');
  const col = R.clips.map(r => ({ clip:r.clip, ratio: r.bestPeakShare ? r.worstPeakShare/r.bestPeakShare : 1,
                                  best:r.bestDir, worst:r.worstDir }))
                     .sort((a,b2)=>a.ratio-b2.ratio);
  /* HEAD-ON AGAINST PROFILE -- the question the weakest-facing column hides.
     The weakest facing is N for 77 of 105 clips, which reads like "the back view is
     dead" and IS NOT WHAT IS HAPPENING: S is nearly as quiet as N (1.1-1.7x apart on
     the clips a player sees most) and BOTH sit far below E/W. So this is not a back
     view bug, it is head-on against profile, and reporting it the other way would
     have sent a recook at the wrong half of the rig. */
  const HEADON = ['N','S'], PROFILE = ['E','W'];
  const hp = [];
  for (const r of R.clips) {
    const g = ds => { let m = 0; for (const d of ds) { const v = r.perDir[d]; if (v && v.peakShare > m) m = v.peakShare; } return m; };
    const h = g(HEADON), pr = g(PROFILE);
    if (pr > 0) hp.push({ clip: r.clip, h, pr, ratio: h / pr });
  }
  hp.sort((a,b2)=>a.ratio-b2.ratio);
  const medr = hp.length ? hp[hp.length>>1].ratio : 0;
  say('    HEAD-ON (best of N,S) AGAINST PROFILE (best of E,W):');
  say('      median head-on carries ' + (medr*100).toFixed(0) + '% of the pixel motion its profile carries.');
  say('      quietest head-on relative to its own profile:');
  for (const x of hp.slice(0, 12))
    say('        ' + (x.ratio*100).toFixed(0).padStart(3) + '%   ' + x.clip +
        '  (head-on ' + (x.h*100).toFixed(1) + '% vs profile ' + (x.pr*100).toFixed(1) + '%)');
  say('');
  say('     ratio  strongest weakest  clip');
  for (const c of col)
    say('    ' + c.ratio.toFixed(2).padStart(6) + '  ' + String(c.best).padEnd(9) + ' ' +
        String(c.worst).padEnd(8) + ' ' + c.clip);
  say('');

  /* 4. TWINS */
  say('=== 4. TWINS (two names, one motion) ===');
  if (!R.twins.length) say('    none. every clip renders a cycle no other clip renders.');
  else for (const t of R.twins) say('    IDENTICAL: ' + t[0] + ' == ' + t[1]);
  say('');

  const threw = R.clips.filter(r=>r.threw);
  say('=== FRAMES THAT THREW === ' + (threw.length ? threw.map(r=>r.clip).join(', ') : 'none'));

  require('fs').writeFileSync(path.join(__dirname,'..','records','BOHEMIA_THE_63_CLIP_AUDIT_RAW_9_5_26.txt'), L.join('\n') + '\n');
  require('fs').writeFileSync(path.join(__dirname,'..','records','.clip_audit.json'), JSON.stringify(R));
  console.log('\nwrote records/BOHEMIA_THE_63_CLIP_AUDIT_RAW_9_5_26.txt');
})();
