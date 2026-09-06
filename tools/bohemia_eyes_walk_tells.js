/* BOHEMIA -- EYES AND EARS: THE WALK TELLS (lane 17, E6, 9/5/26)
 *
 * REUSE CHECK FIRST, because E1 proved how much that saves. Three gates already
 * watch animation from three different angles: anim_fabrication_gate (a moving limb
 * cannot gain painted pixels), frozen_poses_gate (a hold is the SAME frame, not a
 * recomputation), motion_visible_gate (the clip moves enough pixels to be seen).
 * None of them asks the two questions a walk cycle is judged by:
 *
 *   1. DOES IT CLOSE? A cycle that does not end where it began pops once per loop,
 *      forever. This is the cheapest, hardest test in animation and nothing here
 *      was asking it: compare the pose at phase 0 with the pose an instant before
 *      phase 1, in the same direction.
 *   2. DOES ANYTHING SNAP? A joint that jumps in one frame while everything else
 *      moves smoothly. Measured as the biggest single step against the typical
 *      step of the same clip, so a fast clip is not punished for being fast.
 *
 * IT READS THE POSE FUNCTIONS THE GAME ACTUALLY USES, in the real page, at real
 * phases, in all eight directions -- never a copy of them.
 *
 * USAGE:  node tools/bohemia_eyes_walk_tells.js [--port 8099] [--json OUT.json]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
const arg = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const PORT = arg('--port', '8099');
const OUT = arg('--json', null);

function pw() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
    '/usr/local/lib/node_modules']) {
    try { return require(require('path').join(g, 'playwright')); } catch (e) { }
  }
  return require('playwright');
}
const { chromium } = pw();

const SAMPLE = `(() => {
  const DIRS = ['S','SE','E','NE','N','NW','W','SW'];
  const STEPS = 48;
  const flat = o => {                      /* joints out, numbers only */
    const v = [];
    const walk = x => {
      if (typeof x === 'number') { v.push(x); return; }
      if (Array.isArray(x)) { x.forEach(walk); return; }
      if (x && typeof x === 'object') { Object.keys(x).sort().forEach(k => walk(x[k])); }
    };
    Object.keys(o || {}).sort().forEach(k => walk(o[k]));
    return v;
  };
  const dist = (a, b) => {
    if (!a || !b || a.length !== b.length) return null;
    let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
    return s;
  };
  const rows = [];
  for (const name of (typeof CLIPS !== 'undefined' ? CLIPS : [])) {
    const fn = (typeof POSE !== 'undefined') ? POSE[name] : null;
    if (typeof fn !== 'function') { rows.push({ clip: name, error: 'no pose function' }); continue; }
    const perDir = [];
    for (const d of DIRS) {
      let frames = [];
      try {
        for (let i = 0; i < STEPS; i++) frames.push(flat(fn(d, i / STEPS)));
      } catch (e) { perDir.push({ dir: d, error: String(e).slice(0, 80) }); continue; }
      if (frames.some(f => !f || !f.length)) { perDir.push({ dir: d, error: 'empty pose' }); continue; }
      const steps = [];
      for (let i = 1; i < frames.length; i++) {
        const v = dist(frames[i - 1], frames[i]);
        if (v === null) { steps.length = 0; break; }
        steps.push(v);
      }
      if (!steps.length) { perDir.push({ dir: d, error: 'pose shape changes between frames' }); continue; }
      const loop = dist(frames[frames.length - 1], frames[0]);
      const sorted = steps.slice().sort((a, b) => a - b);
      const med = sorted[Math.floor(sorted.length / 2)] || 0;
      const max = sorted[sorted.length - 1];
      const range = Math.max(...frames.map(f => Math.max(...f.map(Math.abs))));
      perDir.push({ dir: d,
        loop_gap: +(loop || 0).toFixed(4),
        median_step: +med.toFixed(4),
        max_step: +max.toFixed(4),
        snap_ratio: med > 1e-6 ? +(max / med).toFixed(2) : null,
        amplitude: +range.toFixed(3) });
    }
    const ok = perDir.filter(p => !p.error);
    rows.push({ clip: name,
      beats: (typeof ANIMBEATS !== 'undefined' ? (ANIMBEATS[name] || null) : null),
      dirs: perDir,
      worst_loop_gap: ok.length ? +Math.max(...ok.map(p => p.loop_gap)).toFixed(4) : null,
      worst_snap: ok.length ? Math.max(...ok.map(p => p.snap_ratio || 0)) : null,
      median_step: ok.length ? +(ok.reduce((s, p) => s + p.median_step, 0) / ok.length).toFixed(4) : null });
  }
  return rows;
})()`;

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:${PORT}/slices/BOHEMIA_ALPHA_0_9.html`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(3000);
  await p.locator('#front').click({ timeout: 30000 });
  await p.waitForTimeout(6000);
  const rows = await p.evaluate(SAMPLE);
  await b.close();

  const good = rows.filter(r => !r.error && r.worst_loop_gap !== null);
  console.log('clips read:', rows.length, '| measured:', good.length);

  /* A CYCLE THAT DOES NOT CLOSE POPS ONCE PER LOOP, FOREVER. The gap is compared
     against the clip's own typical step, because a big clip moves in big steps. */
  const open = good.map(r => ({ clip: r.clip, gap: r.worst_loop_gap, med: r.median_step,
      ratio: r.median_step > 1e-6 ? +(r.worst_loop_gap / r.median_step).toFixed(1) : null }))
    .filter(x => x.ratio !== null && x.ratio > 3).sort((a, b2) => b2.ratio - a.ratio);
  console.log('\nCYCLES THAT DO NOT CLOSE (loop gap over 3x the clip\'s own typical step): ' + open.length);
  for (const o of open.slice(0, 14)) console.log('   ' + String(o.ratio).padStart(7) + 'x   ' + o.clip);

  const snap = good.map(r => ({ clip: r.clip, snap: r.worst_snap }))
    .filter(x => x.snap && x.snap > 6).sort((a, b2) => b2.snap - a.snap);
  console.log('\nA LIMB THAT SNAPS (one step over 6x the clip\'s typical step): ' + snap.length);
  for (const s of snap.slice(0, 14)) console.log('   ' + String(s.snap.toFixed(1)).padStart(7) + 'x   ' + s.clip);

  const offbeat = rows.filter(r => r.beats && ![2, 4].includes(r.beats));
  console.log('\nCLIPS NOT ON A 2 OR 4 BEAT COUNT: ' + offbeat.length
    + (offbeat.length ? ' (' + offbeat.map(r => r.clip + ':' + r.beats).join(', ') + ')' : ''));

  const broken = rows.filter(r => r.error || (r.dirs || []).some(d => d.error));
  console.log('CLIPS THAT COULD NOT BE READ IN EVERY DIRECTION: ' + broken.length
    + (broken.length ? ' (' + broken.slice(0, 6).map(r => r.clip).join(', ') + ')' : ''));

  if (OUT) { fs.writeFileSync(OUT, JSON.stringify({ what: 'the walk tells, read off the real pose functions', rows }, null, 1)); console.log('\nwrote ' + OUT); }
})().catch(e => { console.error(e); process.exit(1); });
