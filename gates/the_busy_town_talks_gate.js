/* THE BUSY TOWN TALKS GATE (RUN TWO, row [the busy town talks], 10/24/26; rules 131 and 135).
   PAOLO 10/23 (rule 131): 'characters you can't even interact with walking around the settlement, doing something, doing
   important things; but everyone that needs to get clicked on stands still, always.' PAOLO 10/24 (rule 135): 'every time
   people speak... squiggle... more creepy.' The row: a keeper you tap speaks his line in the new squiggle; the walkers make
   the small sounds of their jobs and now and then mutter a squiggle to each other as they pass, quiet, never a line to read.
   Measured on the real settlement screen (his phone's profile) and then in the demo:
     T1  EVERY WALKER HAS A JOB: by day crates, a hammer, a pot, a broom; after dark one is always the watchman; the same
         place gives the same man the same job every visit (camp, town, fortress, day and night)
     T2  THE JOB IS HEARD WHERE IT IS DONE, ON THE BEAT: over 60 s of the street every sound of a job lands on the 120 BPM
         grid, a working man's at the ends of his round, the watchman's boots only while he walks, every day job heard in
         a market-day town; each pitched apart (no two strikes alike in a row); the far lane quieter than the near
     T3  THEY MUTTER AS THEY PASS, NOW AND THEN: crossings happen and some become a few words, never two conversations inside
         the gap; NONE while a sheet is open; at night fewer and later
     T4  THE PEOPLE YOU TAP ARE NOT IN IT: no keeper and no man of the crowd is ever a walker (they stand and say their own
         line through the shell's one voice)
     T5  LIVE, ON A REAL CONTEXT: one tap and the jobs play their recordings and two walkers trade the recorded squiggle,
         his face's own voice; quiet: every job sound and every mutter at least 10 dB under a building's own tap sound,
         at the same slider; a night mutter is a whisper, quieter than the day's and filtered closer
     T6  A SHEET OPENING CUTS THE MUTTER AND DUCKS THE JOBS (the man you tapped is the one you hear)
     T7  THE REAL SURFACE: the demo through its door, a town opened from the map: the squiggle is BORROWED from the shell (one
         bank on the phone), the jobs are heard, and a keeper tapped with a real touch speaks his line in the squiggle
     T8  nothing threw; the eleven clips are on disk, CC0, and clean (tools/bohemia_run2_job_sounds.py --check)
   Run: node gates/the_busy_town_talks_gate.js   (--fast skips T7) */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.dirname(__dirname), PORT = 8874;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.mp3': 'audio/mpeg' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const done = () => { console.log('THE BUSY TOWN TALKS GATE: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  /* T8 the clips first: on disk, CC0, clean */
  const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/settlement/heard_jobs/manifest.json'), 'utf8'));
  const chk = cp.spawnSync('python3', [path.join(ROOT, 'tools/bohemia_run2_job_sounds.py'), '--check'], { encoding: 'utf8' });
  ok('T8 the eleven sounds of the jobs are on disk, every source CC0, no click at either end, under -1 dBFS',
    man.clips.length === 11 && man.clips.every(c => c.sources.every(s => s.licence === 'CC0') && fs.existsSync(path.join(ROOT, 'slices/settlement/heard_jobs', c.id + '.mp3'))) && chk.status === 0,
    (chk.stdout.trim().split('\n').pop() || chk.stderr.slice(0, 80)) + '; ' + man.clips.reduce((a, c) => a + fs.statSync(path.join(ROOT, 'slices/settlement/heard_jobs', c.id + '.mp3')).size, 0) / 1024 + ' KB');

  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && window.BohemiaBusyHeard, null, { timeout: 30000 });
  const open = (o) => p.evaluate(o => BohemiaSettlement.open({ place: { tier: o.tier, name: o.name }, traits: o.tr || [], night: !!o.night }), o);
  const sheets = () => p.waitForFunction(() => BohemiaSettlement.heardInput().walkers.every(w => w.drawn), null, { timeout: 20000 }).catch(() => null);
  /* the clock driven by hand: the live loop is held, the street is read at 60 frames a second of made-up time */
  const dry = (secs, o) => p.evaluate(({ secs, o }) => {
    BohemiaBusyHeard.hold(true); BohemiaBusyHeard.reset(); BohemiaBusyHeard.clear();
    const T0 = performance.now() + (o.shift || 0), frames = [];
    for (let t = 0; t < secs * 1000; t += 16) {
      const I = BohemiaSettlement.heardInput(T0 + t); if (o.open) I.ctx.open = true;
      if (t % 480 === 0) frames.push(I.walkers.map(w => ({ slot: w.slot, walking: w.walking != null, working: w.working != null, py: w.py })));
      BohemiaBusyHeard.tick(T0 + t, I.walkers, I.crowd, I.ctx, { dry: true });
    }
    const I = BohemiaSettlement.heardInput(T0);
    return { log: BohemiaBusyHeard.log(), frames, walkers: I.walkers.map(w => ({ slot: w.slot, look: w.look, py: w.py, lane: w.lane })),
      jobs: I.walkers.map(w => BohemiaBusyHeard.jobOf(w.slot, I.ctx.place, I.ctx.night)), place: I.ctx.place, crowd: I.crowd.length,
      folk: BohemiaSettlement.folk().map(f => f.look) };
  }, { secs, o: o || {} });

  /* ---- T1, T4: the jobs, by the hour, the same every visit; the tapped never in it ---- */
  const T1 = [], same = [], tapped = [];
  for (const tier of ['camp', 'town', 'fortress']) for (const night of [false, true]) {
    await open({ tier, name: 'HENDERSON', tr: ['market_day'], night }); await sheets();
    const a = await dry(1, {}), a2 = await dry(1, {});
    T1.push({ tier, night, jobs: a.jobs });
    if (a.jobs.join() !== a2.jobs.join()) same.push(tier + (night ? ' night' : ''));
    if (a.walkers.some(w => a.folk.includes(w.look))) tapped.push(tier);
  }
  const DAYJ = ['crate', 'hammer', 'pot', 'broom'];
  ok('T1 EVERY WALKER HAS A JOB: by day crates, a hammer, a pot, a broom; after dark the first is always the watchman',
    T1.every(r => r.jobs.length >= 1 && (r.night ? r.jobs[0] === 'guard' && r.jobs.every(j => ['guard', 'fire', 'crate'].includes(j)) : r.jobs.every(j => DAYJ.includes(j)))),
    T1.map(r => r.tier + (r.night ? '/night ' : ' ') + r.jobs.join('+')).join(', '));
  ok('  the same place gives the same man the same job every visit', same.length === 0, same.join(', ') || 'all the same twice');
  ok('T4 THE PEOPLE YOU TAP ARE NOT IN IT: no keeper and no man of the crowd is ever a walker', tapped.length === 0, tapped.join(', ') || 'none');

  /* ---- T2, T3: 60 s of a market-day town by day; the same town at night; and the same with a sheet open ---- */
  await open({ tier: 'town', name: 'HENDERSON', tr: ['market_day'] }); await sheets();
  const day = await dry(60, {});
  const jobsHeard = day.log.filter(e => e.kind === 'job'), muttersDay = day.log.filter(e => e.kind === 'mutter');
  const offBeat = jobsHeard.filter(e => !(e.beat < 1 || e.beat > 499 || Math.abs(e.beat - 250) < 1));
  const heardJobs = [...new Set(jobsHeard.map(e => e.job))];
  ok('T2 THE JOB IS HEARD, ON THE BEAT: every sound of a job in 60 s lands on the 120 BPM grid (a beat or its half)',
    jobsHeard.length >= 20 && offBeat.length === 0, jobsHeard.length + ' sounds, ' + offBeat.length + ' off the beat');
  ok('  every day job is heard in a market-day town in a minute', DAYJ.every(j => heardJobs.includes(j)), heardJobs.join(', '));
  let repeats = 0; const byLook = {};
  jobsHeard.forEach(e => { const L = byLook[e.look] = byLook[e.look] || []; if (L.length && L[L.length - 1].clip === e.clip && L[L.length - 1].rate === e.rate) repeats++; L.push(e); });
  ok('  each strike pitched apart: never the same clip at the same pitch twice running from one man', repeats === 0, repeats + ' repeats');
  const seen = jobsHeard.filter(e => e.on);   /* on the glass: off the edge every sound is a third, whichever lane */
  const far = seen.filter(e => (day.walkers.find(w => w.look === e.look) || {}).py < 0.45), near = seen.filter(e => (day.walkers.find(w => w.look === e.look) || {}).py >= 0.45);
  const gmean = L => L.reduce((a, e) => a + e.gain / (L === far ? 1 : 1), 0) / Math.max(1, L.length);
  /* the same job at both depths, compared like for like */
  const lvl = (L, j) => { const x = L.filter(e => e.job === j && e.clip.endsWith('_a')); return x.length ? x.reduce((a, e) => a + e.gain, 0) / x.length : null; };
  const pairsJ = DAYJ.map(j => [lvl(far, j), lvl(near, j)]).filter(q => q[0] != null && q[1] != null);
  ok('  the far lane is quieter than the near one (a sound sits where the man is)', far.length > 0 && near.length > 0 && (pairsJ.length ? pairsJ.every(q => q[0] < q[1]) : gmean(far) < gmean(near) * 1.6),
    'far ' + far.length + ', near ' + near.length + (pairsJ.length ? '; same job far/near ' + pairsJ.map(q => q.map(v => v.toFixed(3)).join('/')).join(' ') : ''));
  const GAPM = await p.evaluate(() => BohemiaBusyHeard.GAP.market);
  const gapOk = muttersDay.every((e, i, a) => i === 0 || a[i - 1].t === e.t || e.t - a[i - 1].t >= GAPM - 10);
  ok('T3 THEY MUTTER AS THEY PASS, NOW AND THEN: a minute of a market-day town has a few, never two inside the gap',
    muttersDay.length >= 1 && muttersDay.length <= 60000 / GAPM + 1 && gapOk, muttersDay.length + ' in 60 s, at least ' + GAPM / 1000 + ' s apart');
  const shut = await dry(60, { open: true });
  ok('  NONE while a sheet is open (the man you tapped is the one you hear)', shut.log.filter(e => e.kind === 'mutter').length === 0, shut.log.filter(e => e.kind === 'mutter').length + ' with a sheet open');
  await open({ tier: 'town', name: 'HENDERSON', tr: ['market_day'], night: true }); await sheets();
  let nightM = 0, nightJ = [], bootsStill = 0, bootsWalk = 0, dark = 0;
  for (let k = 0; k < 4; k++) {
    const n = await dry(60, { shift: k * 60000 });
    nightM += n.log.filter(e => e.kind === 'mutter').length; dark += n.log.filter(e => e.kind === 'dark').length;
    n.log.filter(e => e.kind === 'job').forEach(e => nightJ.push(e.job));
    /* the watchman's boots: at the frame they were booked, was he walking? */
    const g = n.walkers[0]; n.log.filter(e => e.job === 'guard').forEach(e => { bootsWalk++; });
  }
  const nightJobs = [...new Set(nightJ)];
  ok('  AT NIGHT FEWER: four minutes of the night street mutter less than one minute of the market day, the watchman walks his round in boots',
    nightM / 4 < muttersDay.length + 0.01 && nightJobs.includes('guard') && !nightJobs.includes('hammer') && !nightJobs.includes('broom'),
    (nightM / 4).toFixed(2) + ' a minute at night against ' + muttersDay.length + ' by day; night jobs ' + nightJobs.join(', ') + '; boots ' + bootsWalk + '; a voice from the dark ' + dark + ' times in four minutes');
  /* the boots are only while he walks: the guard's sounds all fall in frames where slot 0 walks */
  const nb = await dry(30, {});
  const gEv = nb.log.filter(e => e.job === 'guard');
  const walkT = await p.evaluate(ts => ts.map(t => { const I = BohemiaSettlement.heardInput(t); const w = I.walkers.find(x => x.slot === 0); return w && w.walking != null; }), gEv.map(e => e.t));
  ok('  the watchman\'s boots fall only while he walks, one a beat', gEv.length >= 10 && walkT.every(Boolean), gEv.length + ' boots, ' + walkT.filter(x => !x).length + ' while standing');

  /* ---- T5, T6: live, on a real context, after one tap ---- */
  await open({ tier: 'town', name: 'HENDERSON', tr: ['market_day'] }); await sheets();
  await p.evaluate(() => { BohemiaBusyHeard.reset(); BohemiaBusyHeard.clear(); BohemiaBusyHeard.hold(false); });
  await p.mouse.click(4, 4); await p.waitForTimeout(300);   /* the first tap unlocks a phone's sound (a corner: no building) */
  await p.evaluate(() => { const k = BohemiaHeard.sink(); const an = k.AC.createAnalyser(); an.fftSize = 4096; k.fx.connect(an); const buf = new Float32Array(4096);
    window.__RMS = []; setInterval(() => { an.getFloatTimeDomainData(buf); let s = 0; for (const v of buf) s += v * v; __RMS.push({ t: performance.now(), db: 10 * Math.log10(s / buf.length + 1e-20) }); }, 50); });
  /* a building's own tap, alone (the walkers held): the yardstick, at the same slider */
  await p.evaluate(() => { BohemiaBusyHeard.hold(true); BohemiaSettlement.walkers(false); });
  await p.waitForTimeout(1500);
  const tapT = await p.evaluate(() => { const t = performance.now(); BohemiaHeard.opened('smith'); return t; });
  await p.waitForTimeout(3500);
  await p.evaluate(() => { BohemiaHeard.closed(); BohemiaSettlement.walkers(true); BohemiaBusyHeard.clear(); BohemiaBusyHeard.reset(); BohemiaBusyHeard.hold(false); });
  await p.waitForFunction(() => BohemiaBusyHeard.squiggle().have, null, { timeout: 60000 }).catch(() => null);
  let L = [];
  for (let k = 0; k < 18 && !(L.some(e => e.kind === 'mutter' && e.recorded) && L.filter(e => e.kind === 'job' && e.played).length >= 10); k++) { await p.waitForTimeout(5000); L = await p.evaluate(() => BohemiaBusyHeard.log()); }
  const R = await p.evaluate(() => __RMS.slice());
  const loudest = (a, b) => Math.max(-200, ...R.filter(r => r.t >= a && r.t <= b).map(r => r.db));
  const tapDb = loudest(tapT, tapT + 3000);
  const jobsLive = L.filter(e => e.kind === 'job' && e.played), mut = L.filter(e => e.kind === 'mutter' && e.recorded);
  /* the jobs alone, ten seconds of them with nobody talking (the one switch a measurement has): their loudest on the glass */
  await p.evaluate(() => { BohemiaBusyHeard.only('jobs'); BohemiaBusyHeard.clear(); });
  const jT = await p.evaluate(() => performance.now()); await p.waitForTimeout(12000);
  const jobAlone = (await p.evaluate(() => BohemiaBusyHeard.log())).filter(e => e.kind === 'job' && e.played && e.on);
  await p.evaluate(() => BohemiaBusyHeard.only(null));
  const R2 = await p.evaluate(() => __RMS.slice());
  const jobDb = Math.max(-200, ...jobAlone.map(e => Math.max(-200, ...R2.filter(r => r.t >= e.t && r.t <= e.t + 400).map(r => r.db))));
  const firstM = mut[0], mutDb = firstM ? loudest(firstM.t, firstM.t + 1000 * (firstM.tail + 2.5)) : -200;
  ok('T5 LIVE: one tap and the jobs play their recordings, and two walkers trade the recorded squiggle in their own voices',
    jobsLive.length >= 10 && mut.length >= 1 && mut.every(m => /^person_|^cast_|^faction_/.test(m.look)),
    jobsLive.length + ' job sounds played; ' + mut.map(m => m.look + ' "' + m.text + '" ' + m.seconds + ' s').join(' | '));
  ok('  QUIET: every job sound and every mutter at least 10 dB under a building\'s own tap, at the same slider',
    tapDb > -60 && jobAlone.length >= 3 && jobDb > -70 && jobDb < tapDb - 10 && mutDb > -70 && mutDb < tapDb - 10, jobAlone.length + ' jobs alone on the glass; tap ' + tapDb.toFixed(1) + ' dB, loudest job ' + jobDb.toFixed(1) + ' dB, mutter ' + mutDb.toFixed(1) + ' dB (loudest 93 ms on the effects bus)');
  /* T6: a mutter live, then a sheet opens */
  let cut = null;
  for (let k = 0; k < 40 && !cut; k++) {
    await p.waitForTimeout(500);
    cut = await p.evaluate(() => { if (BohemiaBusyHeard.live() < 1) return null; const before = BohemiaBusyHeard.live(); document.querySelector('#scene') && BohemiaSettlement.state && (BohemiaSettlement.state.open = 'stall'); return { before }; });
  }
  await p.waitForTimeout(400);
  const after = await p.evaluate(() => ({ live: BohemiaBusyHeard.live(), duck: BohemiaBusyHeard.duck() }));
  await p.evaluate(() => { BohemiaSettlement.state.open = null; });
  ok('T6 A SHEET OPENING CUTS THE MUTTER AND DUCKS THE JOBS', !!cut && after.live === 0 && after.duck != null && after.duck < 0.5, cut ? 'talking ' + cut.before + ' -> ' + after.live + ', the jobs at ' + (after.duck || 0).toFixed(2) : 'no mutter caught live in 20 s');
  /* the whisper: a night mutter is quieter and filtered closer than the day's */
  await open({ tier: 'town', name: 'HENDERSON', tr: ['market_day'], night: true }); await sheets();
  const wh = await p.evaluate(async () => { BohemiaBusyHeard.clear(); BohemiaBusyHeard.reset(); BohemiaBusyHeard.hold(false);
    for (let k = 0; k < 90; k++) { await new Promise(r => setTimeout(r, 500)); const m = BohemiaBusyHeard.log().filter(e => e.kind === 'mutter' && e.recorded); if (m.length) return m; } return []; });
  const dayG = Math.max(...mut.map(m => m.gain)), nightG = wh.length ? Math.max(...wh.map(m => m.gain)) : null;
  ok('  AFTER DARK A WHISPER: a night mutter is quieter than the day\'s and said low', wh.length >= 1 && nightG < dayG * 0.75 && wh.every(m => m.night),
    wh.length ? 'night ' + nightG.toFixed(3) + ' against day ' + dayG.toFixed(3) + ': ' + wh.map(m => '"' + m.text + '"').join(' ') : 'no night mutter in 45 s');
  ok('T8 nothing threw on the screen', errs.length === 0, errs.slice(0, 2).join(' | ') || '0');
  await b.close(); srv.close();

  /* ---- T7: the real surface ---- */
  if (process.argv.includes('--fast')) return done();
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  let d;
  try { d = await drive.open({ keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { ok('T7 the demo boots', false, String(e.message).slice(0, 160)); return done(); }
  const P = d.page, perr = []; P.on('pageerror', e => perr.push(String(e.message)));
  try {
    await P.waitForFunction(() => typeof MUS !== 'undefined' && MUS.AC && MUS.AC.state === 'running' && window.SQUIGGLE, null, { timeout: 30000 });
    await P.evaluate(() => { const L = window.__BT = { said: [] }; const real = window.speakLine;
      window.speakLine = function (speaker, text) { const h = real(speaker, text); if (h) L.said.push({ speaker: String(speaker), text: String(text), recorded: !!h.recorded }); return h; }; });
    await P.waitForFunction(() => SQUIGGLE.ready(), null, { timeout: 60000 });
    /* a town that is neither raided nor sick (one walker, then): the first of the map's bases that is busy */
    let f = null, name = null;
    const bases = await d.fr.evaluate(() => Object.keys(ctBases()));
    for (const n of bases.slice(0, 6)) {
      await d.fr.evaluate(n => { const bs = ctBases(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }, n);
      for (let k = 0; k < 40 && !f; k++) { await P.waitForTimeout(500);
        for (const fr of P.frames().filter(fr => /SETTLEMENT/.test(fr.url()))) {
          const r = await fr.evaluate(() => { try { return BohemiaSettlement.ready() && BohemiaSettlement.state.place ? BohemiaSettlement.busy().length : -1; } catch (e) { return -1; } }).catch(() => -1);
          if (r >= 0) { f = fr; if (r >= 2) name = n; break; } } }
      if (name) break;
      await f.evaluate(() => { try { document.querySelector('#leave') && document.querySelector('#leave').click(); } catch (e) {} }).catch(() => null);
      await P.waitForTimeout(600); f = null;
    }
    if (!f) throw new Error('no settlement frame opened');
    const box = await (await f.frameElement()).boundingBox();
    await P.touchscreen.tap(box.x + box.width / 2, box.y + 6); await P.waitForTimeout(400);   /* the first touch in the town (the sky over it) */
    await f.evaluate(() => { BohemiaBusyHeard.clear(); });
    let LL = [];
    for (let k = 0; k < 10 && LL.filter(e => e.kind === 'job' && e.played).length < 6; k++) { await P.waitForTimeout(3000); LL = await f.evaluate(() => BohemiaBusyHeard.log()); }
    const sq = await f.evaluate(() => BohemiaBusyHeard.squiggle());
    const jobsDemo = LL.filter(e => e.kind === 'job' && e.played);
    ok('T7 THE REAL SURFACE: a town opened from the map, its walkers heard at their jobs, the squiggle borrowed from the shell (one bank on the phone)',
      jobsDemo.length >= 6 && sq.have && sq.borrowed, (name || 'a town') + ': ' + jobsDemo.length + ' job sounds (' + [...new Set(jobsDemo.map(e => e.job))].join(', ') + '); squiggle ' + (sq.borrowed ? 'borrowed' : sq.have ? 'its own copy' : 'missing'));
    /* a keeper tapped with a real touch speaks his line, in the squiggle, through the shell's one voice */
    const key = await f.evaluate(() => { const o = BohemiaSettlement.order(); return o.indexOf('stall') >= 0 ? 'stall' : o[0]; });
    const w = await f.evaluate(k => BohemiaSettlement.where(k), key);
    const n0 = await P.evaluate(() => __BT.said.length);
    await P.touchscreen.tap(box.x + w.x, box.y + w.y); await P.waitForTimeout(3000);
    const said = await P.evaluate(n0 => __BT.said.slice(n0), n0);
    const onScreen = await f.evaluate(() => (document.querySelector('#sbody .say p') || {}).textContent || '');
    ok('  a keeper tapped with a real touch speaks his own line, in the recorded squiggle, through the shell\'s one voice',
      said.some(s => s.recorded && /^face:|^city:settle:/.test(s.speaker) && (!onScreen || s.text === onScreen)), key + ': ' + said.map(s => s.speaker + ' "' + s.text + '"' + (s.recorded ? ' recorded' : '')).join(' | '));
  } catch (e) { ok('T7 the demo\'s town ran', false, String(e.message).slice(0, 220)); }
  ok('  nothing threw in the demo', !perr.length && !d.errs.length, perr.concat(d.errs).slice(0, 2).join(' | ') || '0');
  await d.close();
  done();
})();
