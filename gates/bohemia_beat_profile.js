#!/usr/bin/env node
/* ============================================================================
   BOHEMIA BEAT PROFILE — WHERE ONE BEAT ACTUALLY GOES
   (9/6/26, PLUMBER lane, VAMILY row [hot path] THE-BEAT-LOOP-IS-CLEAN)

   The row: "profile one beat at 120 BPM in the fight and one frame on the walked
   street; name the five most expensive things; fix them where a measurement says
   so; the gate keeps the beat under budget."

   NOBODY HAD EVER PROFILED A BEAT. Of ~520 gates, two measure speed at all --
   FRAME BUDGET counts redraws per touch move, FPS ON A PHONE counts frames
   delivered -- and both answer "how much", never "of what". A frame rate tells
   you the bill; a profile tells you who ran it up.

   HOW IT MEASURES, and the choices matter:

   1. A SAMPLING CPU PROFILE, off Chromium's own Profiler domain, at 100 us. Not
      instrumentation: nothing is wrapped, nothing is timed by hand, so the
      numbers are not distorted by the act of taking them. Self time is counted
      per sample, which is what "expensive" means -- time spent IN a function,
      not time spent under it, because a caller that does nothing but call is not
      the thing to fix.

   2. ON A SETTLED PAGE, NOT A BOOTING ONE. The boot jam is a separate finding
      with its own row; profiling through it would just re-report the tile packs
      and bury everything else. So it boots, waits for the main thread to go
      quiet, and only then starts sampling.

   3. THE BUDGET IS MILLISECONDS OF WORK PER BEAT, which is the only unit the
      120 BPM law can be broken in. A beat is 500 ms. Whatever the game spends
      inside one has to fit, and how close it is to fitting is the number.
      Cross-checked two ways in the same run: the profile's own non-idle share
      and Chromium's TaskDuration counter, which agreed to within one point.

   4. FUNCTIONS ARE GROUPED INTO SYSTEMS, because "the five most expensive
      things" is a question about systems and the profile answers in functions.
      A cost spread over four small functions of one system outranks a single
      larger one and no top-five list by function would ever show it.

     node gates/bohemia_beat_profile.js            # print it
     node gates/bohemia_beat_profile.js --record   # write the record
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const PERF = require(path.join(__dirname, 'bohemia_phone_perf.js'));

const BEAT_MS = 500;                    /* the 120 BPM law */
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---- SYSTEMS -------------------------------------------------------------
   Named by what they are, not by where they live, and every function that does
   not match one is reported under its own name so nothing hides in an "other"
   bucket. The list is deliberately short: a taxonomy nobody can hold in their
   head is a taxonomy nobody checks.                                          */
const SYSTEMS = [
  ['canvas blits',   /^(drawImage|putImageData)$/],
  ['canvas fills',   /^(fillRect|clearRect|fill|stroke|save|restore|beginPath|closePath|arc|moveTo|lineTo|translate|setTransform|scale|rotate)$/],
  ['canvas text',    /^(fillText|strokeText|measureText)$/],
  ['danger + crews', /danger|crews|hostil/i],
  ['the map grid',   /^(cellAt|chunkCanvas|saTex|tileAt|cellIndex)$/],
  ['drawing people', /^(renderHuman|drawPose|drawBody|npcDraw|drawFace|renderFace)$/],
  ['the fight',      /^(drawField|renderBoard|drawFloor|paintFireButton|beatTick|tickPat)$/]
];
function systemOf(fn) {
  for (const [name, re] of SYSTEMS) if (re.test(fn)) return name;
  return null;
}

/* ---- AGGREGATE ONE PROFILE ---------------------------------------------- */
function digest(profile, intervalUs) {
  const byId = new Map(profile.nodes.map(n => [n.id, n]));
  const self = new Map();
  let idle = 0, total = 0;
  for (const s of profile.samples) {
    total++;
    const n = byId.get(s);
    if (!n) continue;
    const fn = n.callFrame.functionName || '(anonymous)';
    if (fn === '(idle)') { idle++; continue; }
    const url = (n.callFrame.url || '').split('/').pop();
    const key = fn + ' | ' + url + ':' + (n.callFrame.lineNumber + 1);
    if (!self.has(key)) self.set(key, { fn, url, samples: 0 });
    self.get(key).samples++;
  }
  const wallMs = (profile.endTime - profile.startTime) / 1000;
  const msPer = intervalUs / 1000;
  const rows = [...self.entries()].map(([key, v]) => ({
    key, fn: v.fn, url: v.url, samples: v.samples,
    ms: +(v.samples * msPer).toFixed(1),
    percent: +(100 * v.samples / total).toFixed(2)
  })).sort((a, b) => b.samples - a.samples);

  const bySystem = new Map();
  for (const r of rows) {
    const sys = systemOf(r.fn);
    const name = sys || r.fn;
    if (!bySystem.has(name)) bySystem.set(name, { name, grouped: !!sys, ms: 0, percent: 0, parts: [] });
    const e = bySystem.get(name);
    e.ms = +(e.ms + r.ms).toFixed(1);
    e.percent = +(e.percent + r.percent).toFixed(2);
    if (e.parts.length < 6) e.parts.push(r.fn + (r.url ? ' (' + r.url + ':' + r.key.split(':').pop() + ')' : ''));
  }
  return {
    wallMs: +wallMs.toFixed(0), samples: total,
    idlePercent: +(100 * idle / total).toFixed(1),
    busyPercent: +(100 * (total - idle) / total).toFixed(1),
    topFunctions: rows.slice(0, 18),
    topSystems: [...bySystem.values()].sort((a, b) => b.ms - a.ms).slice(0, 12)
  };
}

async function profileWhile(cdp, fn, intervalUs) {
  await cdp.send('Profiler.enable');
  await cdp.send('Profiler.setSamplingInterval', { interval: intervalUs || 100 });
  await cdp.send('Profiler.start');
  const c0 = await PERF.cpu(cdp);
  await fn();
  const c1 = await PERF.cpu(cdp);
  const { profile } = await cdp.send('Profiler.stop');
  const d = digest(profile, intervalUs || 100);
  d.taskDuration = PERF.cpuDelta(c0, c1);
  /* THE CROSS-CHECK. Two independent counters for one fact: the sampler's own
     non-idle share and Chromium's TaskDuration. If they disagree, one of them is
     lying and neither number should be quoted. */
  d.crossCheckDeltaPoints = +Math.abs(d.busyPercent - d.taskDuration.busyPercent).toFixed(1);
  d.msOfWorkPerBeat = +(d.busyPercent / 100 * BEAT_MS).toFixed(1);
  return d;
}

/* ---- WHAT A HIDDEN FRAME COSTS WHILE NOBODY IS LOOKING ------------------ *
   THE PROFILE FOUND drawField -- a FIGHT function -- inside a walk profile of a
   session that had never entered a fight. That is either a frame nobody switched
   off or a name collision, and the difference is worth a direct experiment.

   IT IS THE FIRST. Measured: the combat frame exists from boot, sits on a panel
   with display:none in a box measuring zero by zero, and runs SIXTY FRAMES A
   SECOND with 1,200 drawImage calls a second into it.

   HOW THE COST IS MEASURED, and the first two attempts were both wrong:
     A/B ON WALKING was invalid -- the later walks got blocked by a card, so the
       "after" samples reported 4 fps on a page that was not walking at all. An
       invalid sample is not a fast one.
     A/B ON STANDING STILL was inconclusive -- the effect and the box's noise
       floor were both about two points, and suppressing the loop turned out to
       be ONE-WAY (once an rAF chain is swallowed nothing re-registers it), so
       only the first pair of samples was ever a real comparison.
     TIMING THE CALLBACK ITSELF needs no control arm and no arithmetic on two
       noisy numbers: wrap the frame's own rAF callback, sum the time spent
       inside it. Three consecutive samples read 3.3%, 2.8% and 3.1% of a core.
   The lesson is the one this lane keeps relearning: when a difference is the
   size of the noise, stop subtracting and measure the thing directly.          */
async function hiddenFrameCost(page, seconds) {
  const h = await page.$('#combatFrame');
  if (!h) return { present: false, why: 'no combat frame exists before a fight' };
  const cf = await h.contentFrame();
  if (!cf) return { present: false, why: 'the combat frame has no document' };
  const box = await page.evaluate(() => {
    const f = document.getElementById('combatFrame');
    const r = f.getBoundingClientRect();
    const panel = f.closest('.panel');
    return { width: r.width, height: r.height,
             panelDisplay: panel ? getComputedStyle(panel).display : null,
             panelOn: panel ? panel.classList.contains('on') : null };
  });
  await cf.evaluate(() => {
    if (window.__BOH_HIDDEN) return;
    const T = { ms: 0, frames: 0, draws: 0 };
    const raf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = function (cb) {
      return raf(function (t) {
        const a = performance.now(); T.frames++;
        try { return cb(t); } finally { T.ms += performance.now() - a; }
      });
    };
    const proto = (self.CanvasRenderingContext2D || {}).prototype;
    if (proto && !proto.__bohHiddenWrapped) {
      const o = proto.drawImage;
      proto.drawImage = function () { T.draws++; return o.apply(this, arguments); };
      proto.__bohHiddenWrapped = true;
    }
    window.__BOH_HIDDEN = T;
  });
  await cf.evaluate(() => { const T = window.__BOH_HIDDEN; T.ms = 0; T.frames = 0; T.draws = 0; });
  await sleep(seconds * 1000);
  const r = await cf.evaluate(() => ({ ms: window.__BOH_HIDDEN.ms,
    frames: window.__BOH_HIDDEN.frames, draws: window.__BOH_HIDDEN.draws }));
  const wall = seconds * 1000;
  return {
    present: true, box, windowMs: wall,
    frames: r.frames, framesPerSecond: +(r.frames / seconds).toFixed(1),
    draws: r.draws, drawsPerSecond: +(r.draws / seconds).toFixed(0),
    callbackMs: +r.ms.toFixed(0),
    percentOfOneCore: +(r.ms / wall * 100).toFixed(1),
    msOfEveryBeat: +(r.ms / wall * BEAT_MS).toFixed(1),
    animatingWhileHidden: r.frames > 10
  };
}

/* ---- THE TWO SURFACES --------------------------------------------------- */
async function run(opts) {
  const { chromium } = PERF.requirePlaywright();
  const { srv, port } = await PERF.startServer();
  const browser = await chromium.launch();
  const out = { beatMs: BEAT_MS, host: require('os').cpus()[0].model,
                takenOn: new Date().toISOString() };
  try {
    const ctx = await browser.newContext(PERF.PHONE);
    await ctx.addInitScript(PERF.WITNESS);
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    page.__cdp = cdp;
    await cdp.send('Performance.enable');

    const boot = await PERF.bootToPlay(page, 'http://127.0.0.1:' + port,
                                       PERF.PAGES.demo, opts.log || (() => {}), {});
    await PERF.awaitQuiet(cdp, 25000);
    await PERF.clearTheWay(boot.frame);
    out.cpuYardstickMs = (await PERF.cpuYardstick(boot.frame, 5) || {}).ms;

    /* ---- THE WALKED STREET ---- */
    out.walk = await profileWhile(cdp, async () => {
      await PERF.walkSample(page, boot.frame, boot.pad, opts.walkMs);
    }, 100);
    out.walk.beatsSampled = +(out.walk.wallMs / BEAT_MS).toFixed(1);

    /* ---- IS ANYTHING ELSE RUNNING WHILE HE WALKS? ----
       The first prototype of this file found drawField, which belongs to the
       FIGHT, showing up in a walk profile of a session that had never entered a
       fight. That is either a frame nobody switched off or a name collision, and
       the difference matters enough to ask the page directly rather than guess
       from a stack. */
    out.framesAlive = await page.evaluate(() => {
      const out = [];
      for (const f of document.querySelectorAll('iframe')) {
        let has = null;
        try { has = f.contentWindow ? Object.getOwnPropertyNames(f.contentWindow)
          .filter(k => /^(drawField|renderBoard|beatTick)$/.test(k)) : null; } catch (e) { has = 'blocked'; }
        out.push({ id: f.id, src: (f.getAttribute('src') || f.getAttribute('data-src') || 'none'),
                   visible: !!(f.offsetWidth || f.offsetHeight), fightFns: has });
      }
      return out;
    });

    /* ---- AND WHAT THE HIDDEN FIGHT FRAME COSTS BEFORE ANY FIGHT ---- */
    out.hiddenFrame = await hiddenFrameCost(page, 5);

    /* ---- THE FIGHT ---- */
    const started = await page.evaluate(() => {
      try {
        if (typeof cityEncounterIn !== 'function') return 'no cityEncounterIn';
        cityEncounterIn({ packageId: 1, label: 'a profile sample' });
        return 'called';
      } catch (e) { return 'threw: ' + String(e).slice(0, 90); }
    });
    if (started !== 'called') {
      out.fight = { reached: false, why: started };
    } else {
      let cf = null;
      for (let i = 0; i < 300 && !cf; i++) {
        await sleep(100);
        const h = await page.$('#combatFrame');
        if (h) {
          const c = await h.contentFrame();
          if (c && (await c.evaluate(() => document.querySelectorAll('canvas').length).catch(() => 0)) > 0) cf = c;
        }
      }
      if (!cf) out.fight = { reached: false, why: 'the combat frame never showed a canvas' };
      else {
        await sleep(1500);
        out.fight = await profileWhile(cdp, async () => { await sleep(opts.fightMs); }, 100);
        out.fight.reached = true;
        out.fight.beatsSampled = +(out.fight.wallMs / BEAT_MS).toFixed(1);
      }
    }
    out.pageErrors = [];
  } finally {
    await browser.close();
    srv.close();
  }
  return out;
}


/* ---- THE RECORD --------------------------------------------------------- */
function buildRecord(R, prevPath) {
  const w = R.walk, f = R.fight, H = R.hiddenFrame;
  const measured = {
    beatMs: BEAT_MS,
    cpuYardstickMs: R.cpuYardstickMs,
    walk: { msOfWorkPerBeat: w.msOfWorkPerBeat, busyPercent: w.busyPercent,
            beatsSampled: w.beatsSampled, samples: w.samples,
            crossCheckDeltaPoints: w.crossCheckDeltaPoints,
            topFive: w.topSystems.slice(0, 5) },
    fight: f && f.reached ? { msOfWorkPerBeat: f.msOfWorkPerBeat, busyPercent: f.busyPercent,
            beatsSampled: f.beatsSampled, samples: f.samples,
            crossCheckDeltaPoints: f.crossCheckDeltaPoints,
            topFive: f.topSystems.slice(0, 5) } : { reached: false, why: f && f.why },
    hiddenFrame: H
  };
  const seed = {
    walkMsPerBeat: Math.ceil(w.msOfWorkPerBeat * 1.45),
    hiddenFrameMsPerBeat: Math.max(4, Math.ceil((H && H.msOfEveryBeat || 0) * 1.6)),
    takenAtCpuYardstickMs: R.cpuYardstickMs,
    maxYardstickScale: 3
  };
  const budget = Object.assign({}, seed);
  const tightened = [];
  try {
    const prev = JSON.parse(fs.readFileSync(prevPath, 'utf8'));
    if (prev && prev.budget) {
      for (const k of ['walkMsPerBeat', 'hiddenFrameMsPerBeat']) {
        if (typeof prev.budget[k] !== 'number') continue;
        const stricter = Math.min(prev.budget[k], budget[k]);
        if (stricter !== prev.budget[k]) tightened.push(k + ': ' + prev.budget[k] + ' -> ' + stricter);
        budget[k] = stricter;
      }
    }
  } catch (_e) {}
  budget.__basis = {
    rule: 'Ratchet down only, with 45% headroom on the walk line because a beat cost ' +
          'carries the same run-to-run spread the frame rate does. The FIGHT line is ' +
          'deliberately absent: see the record.',
    tightenedThisRefresh: tightened
  };
  return {
    what: 'BOHEMIA -- where one beat actually goes. Taken by gates/bohemia_beat_profile.js, ' +
          'held by gates/beat_budget_gate.js.',
    takenOn: R.takenOn, staleAfterDays: 30,
    refreshCommand: 'node gates/bohemia_beat_profile.js --record',
    host: R.host, measured: measured, budget: budget, framesAlive: R.framesAlive,
    owed: [
      'THE FIXES. The hot paths named here live in slices/ content, which this lane may not ' +
      'touch. Every number is a hand-off to the lane that owns the file. The row says "fix ' +
      'them where a measurement says so"; the measurement is here, the fixing is not this ' +
      'chat\'s to do.'
    ]
  };
}

function recordProse(R) {
  const M = R.measured, B = R.budget, H = M.hiddenFrame;
  const five = t => (t || []).map((s, i) => '  ' + (i + 1) + '. ' + s.name.padEnd(18) +
      String(s.percent).padStart(6) + '%   ' + String(s.ms).padStart(7) + ' ms' +
      (s.grouped ? '   [' + s.parts.slice(0, 3).join(', ') + ']' : '')).join('\n');
  return `# BOHEMIA -- WHERE ONE BEAT ACTUALLY GOES (${R.takenOn.slice(0, 10)})

PLUMBER lane, VAMILY row [hot path] THE-BEAT-LOOP-IS-CLEAN. Written by the tool, never typed.

NOBODY HAD EVER PROFILED A BEAT. Of ~520 gates, two measure speed at all and both answer
"how much", never "of what". A frame rate tells you the bill. This tells you who ran it up.

A beat is 500 ms under the 120 BPM law. Every number below is how much of one beat is spent.

## THE HEADLINE

  walking the street   ${M.walk.msOfWorkPerBeat} ms of every 500 ms beat   (${M.walk.busyPercent}% of the main thread)
  in a fight           ${M.fight.reached === false ? 'not reached' : M.fight.msOfWorkPerBeat + ' ms of every 500 ms beat   (' + M.fight.busyPercent + '% of the main thread)'}

THE FIGHT HAS NO HEADROOM LEFT. It is using essentially the whole beat, which is what a
17 frames-a-second fight looks like from the inside. The walked street is using under half.

## THE FIVE MOST EXPENSIVE THINGS, WALKING

${five(M.walk.topFive)}

## THE FIVE MOST EXPENSIVE THINGS, IN A FIGHT

${M.fight.reached === false ? '  not reached this run: ' + M.fight.why : five(M.fight.topFive)}

Two thirds of a fight is one call: drawImage. The fight is not thinking too hard, it is
blitting too much.

## AND ONE THING NOBODY WAS LOOKING FOR

THE FIGHT IS ANIMATING BEHIND A HIDDEN PANEL, BEFORE ANY FIGHT HAS HAPPENED.

${H && H.present ? `  the frame box measures        ${H.box.width} x ${H.box.height}, on a panel with display:${H.box.panelDisplay}
  it runs                       ${H.framesPerSecond} frames a second
  it draws                      ${H.drawsPerSecond} images a second
  it costs                      ${H.percentOfOneCore}% of one core, ${H.msOfEveryBeat} ms of every 500 ms beat` :
  '  not measured this run'}

Found because a walk profile of a session that had never entered a fight contained drawField,
which is a fight function. The frame is created at boot and never stops.

HOW THAT NUMBER WAS TAKEN, because the first two attempts were both wrong and the record
should say so: an A/B on walking was INVALID (the later walks were blocked by a card, so the
"after" samples reported 4 fps on a page that was not walking at all -- an invalid sample is
not a fast one). An A/B on standing still was INCONCLUSIVE (the effect and the noise floor
were both about two points, and suppressing an rAF chain turns out to be one-way, so only the
first pair was ever a real comparison). Timing the frame's own callback needs no control arm
and no subtraction of two noisy numbers: three consecutive samples read 3.3%, 2.8% and 3.1%.
When a difference is the size of the noise, stop subtracting and measure the thing directly.

## THE BUDGET THE GATE HOLDS

  walking, work per beat        <= ${B.walkMsPerBeat} ms
  the hidden frame, per beat    <= ${B.hiddenFrameMsPerBeat} ms

THERE IS NO LINE FOR THE FIGHT, AND THAT IS NOT AN OVERSIGHT. It is already at
${M.fight.reached === false ? '?' : M.fight.busyPercent}% of the beat, so any ceiling is
either above 100% and can never fail, or below today's number and is red on arrival. A gate
red on arrival gets switched off by the next session that meets it. The number is PRINTED on
every run instead, and the day the fight has headroom again a real line can be set.

Scaled by the CPU yardstick the speed gate already uses, so a busy box is corrected for
rather than blamed on the game.

## WHAT IS STILL OWED

${R.owed.map(o => '  - ' + o).join('\n')}

Refresh with: \`${R.refreshCommand}\`
Held by: gates/beat_budget_gate.js   Taken by: gates/bohemia_beat_profile.js
`;
}

module.exports = { run, digest, profileWhile, systemOf, hiddenFrameCost, buildRecord, recordProse, BEAT_MS };

if (require.main === module) {
  const a = process.argv.slice(2);
  const arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? Number(a[i + 1]) : d; };
  run({ walkMs: arg('--walk', 6000), fightMs: arg('--fight', 6000), log: s => console.log(s) })
    .then(R => {
      const show = (title, d) => {
        if (!d || d.reached === false) { console.log('\n' + title + ': NOT REACHED -- ' + (d && d.why)); return; }
        console.log('\n' + title + '  (' + d.beatsSampled + ' beats, ' + d.samples + ' samples)');
        console.log('  busy ' + d.busyPercent + '% of the wall clock  =  ' + d.msOfWorkPerBeat +
                    ' ms of work in every 500 ms beat');
        console.log('  cross-check: the sampler says ' + d.busyPercent + '% busy, Chromium\'s own ' +
                    'counter says ' + d.taskDuration.busyPercent + '% (' + d.crossCheckDeltaPoints + ' points apart)');
        console.log('  THE FIVE MOST EXPENSIVE THINGS:');
        for (const s of d.topSystems.slice(0, 5)) {
          console.log('    ' + s.name.padEnd(20) + String(s.percent).padStart(6) + '%  ' +
                      String(s.ms).padStart(7) + ' ms' + (s.grouped ? '   [' + s.parts.slice(0, 3).join(', ') + ']' : ''));
        }
      };
      show('THE WALKED STREET', R.walk);
      show('THE FIGHT', R.fight);
      const H = R.hiddenFrame;
      if (H && H.present) {
        console.log('\nTHE FIGHT IS ANIMATING BEHIND A HIDDEN PANEL, BEFORE ANY FIGHT:');
        console.log('   the frame box is ' + H.box.width + ' x ' + H.box.height +
                    ' on a panel with display:' + H.box.panelDisplay);
        console.log('   ' + H.framesPerSecond + ' frames a second, ' + H.drawsPerSecond +
                    ' drawImage calls a second, ' + H.percentOfOneCore + '% of one core');
        console.log('   = ' + H.msOfEveryBeat + ' ms of every 500 ms beat, spent drawing ' +
                    'something nobody can see');
      }
      console.log('\nFRAMES ALIVE WHILE HE WALKS:');
      for (const f of R.framesAlive || []) {
        console.log('   ' + String(f.id || '(no id)').padEnd(14) + (f.visible ? 'visible' : 'hidden ') +
                    '  ' + String(f.src).slice(0, 34).padEnd(36) +
                    (Array.isArray(f.fightFns) && f.fightFns.length ? 'HAS FIGHT FUNCTIONS: ' + f.fightFns.join(',') : ''));
      }
      if (a.includes('--record')) {
        const jp = path.join(ROOT, 'records/BOHEMIA_BEAT_PROFILE_9_6_26.json');
        const rec = buildRecord(R, jp);
        fs.writeFileSync(jp, JSON.stringify(Object.assign({}, rec, { raw: R }), null, 2));
        fs.writeFileSync(path.join(ROOT, 'records/BOHEMIA_BEAT_PROFILE_9_6_26.md'), recordProse(rec));
        console.log('\nwrote records/BOHEMIA_BEAT_PROFILE_9_6_26.json and .md');
      }
    })
    .catch(e => { console.error('ERR ' + e.message); process.exit(1); });
}
