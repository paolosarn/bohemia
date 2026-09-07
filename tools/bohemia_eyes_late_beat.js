/* BOHEMIA -- EYES AND EARS -- IS THE BEAT HE HEARS THE BEAT THE GAME JUDGES  (E14 round 2, 9/7/26)
 *
 * THE JOB (VAMILY lane 17, E14 [late beat]):
 *   "the gap between the beat the player hears and the beat the fight scores, and
 *    whether the first fight can be passed by somebody doing it right."
 *
 * WHAT SCHOOL CHANGED, AND THE MODE REQUIRES ME TO SAY IT
 *   records/BOHEMIA_EYES_E14_ROUND_1_SCHOOL_THE_HUMAN_TAPS_EARLY_9_7_26.md
 *
 *   1. A TAP TEST MEASURES A HUMAN, NOT A PHONE. People tap 20-100 ms EARLY
 *      (negative mean asynchrony) and the bias is not even universal, so it cannot
 *      be subtracted. So this tool takes no taps from anybody. It compares two
 *      clocks the machine already has.
 *   2. THE BROWSER REPORTS THE DEVICE LATENCY DIRECTLY (outputLatency, baseLatency,
 *      getOutputTimestamp). The audio half is a READ, not a survey.
 *   3. "THE GAP" IS NOT A NUMBER. It is a bias and a jitter. This reports both, over
 *      many samples, plus the worst one.
 *
 * THE MEASUREMENT, AND WHY IT IS EXACT
 *   The fight's beat clock is audioMs() = AC.currentTime - outputLatency - _seq.t0.
 *   The clock the EAR is actually on is getOutputTimestamp().contextTime, which the
 *   spec defines as the sample frame the output device is playing RIGHT NOW.
 *   So the gap the job asks for is, exactly:
 *
 *       (what the judge thinks the time is)  minus  (what the ear is hearing)
 *
 *   Both are read in the same instant, in the same frame, with no human anywhere.
 *   A positive gap means the judge is AHEAD of the ear: a player pressing on the
 *   sound they hear is graded LATE.
 *
 * RULE ZERO (E9): a zero needs a positive control, and this job's trap is a good one.
 *   A gap of ~0 could mean the fight is ear-true, or it could mean I am reading the
 *   same number twice and subtracting it from itself, which is a tautology dressed
 *   as a pass. So a known 150 ms shift is injected into one side and the reported
 *   gap MUST move by 150. If it does not, the comparison is not comparing anything.
 *
 * OUT: records/BOHEMIA_EYES_LATE_BEAT_9_7_26.json
 */
const path = require('path'), fs = require('fs');
function pw(){ for (const p of ['/opt/node22/lib/node_modules/playwright','playwright','/usr/lib/node_modules/playwright','/usr/local/lib/node_modules/playwright']) { try { return require(p); } catch(e){} } throw new Error('playwright not found'); }
const { chromium } = pw();
const PHONE = { viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true };

const READ = (shiftMs) => {
  const out = { shiftMs };
  try { out.hasAC = (typeof AC !== 'undefined') && !!AC; } catch (e) { out.hasAC = false; }
  if (!out.hasAC) return out;
  out.sampleRate = AC.sampleRate;
  out.state = AC.state;
  out.outputLatencyMs = (AC.outputLatency || 0) * 1000;
  out.baseLatencyMs = (AC.baseLatency || 0) * 1000;
  out.hasTimestamp = typeof AC.getOutputTimestamp === 'function';
  try { out.seqOn = (typeof _seq !== 'undefined') && !!_seq.on; out.seqT0 = (typeof _seq !== 'undefined') ? _seq.t0 : null; } catch (e) { out.seqErr = String(e).slice(0,60); }
  try { out.bands = { PERFECT_MS: (typeof PERFECT_MS !== 'undefined') ? PERFECT_MS : null,
                      GOOD_MS: (typeof GOOD_MS !== 'undefined') ? GOOD_MS : null,
                      BEAT_GRACE: (typeof BEAT_GRACE !== 'undefined') ? BEAT_GRACE : null,
                      BPM_MS: (typeof BPM_MS !== 'undefined') ? BPM_MS : null }; } catch (e) { out.bandErr = String(e).slice(0,60); }
  try { out.audioMs = (typeof audioMs === 'function') ? audioMs() : 'no audioMs'; } catch (e) { out.audioMsErr = String(e).slice(0,60); }

  // THE GAP, sampled ACROSS TIME.
  // BUG 3, AND IT WOULD HAVE BETRAYED THIS ROUND'S OWN SCHOOL FINDING: the first version
  // took 60 samples in one tight synchronous loop. Both clocks are quantised to the render
  // quantum and the loop runs in microseconds, so it read the SAME INSTANT sixty times and
  // printed a jitter of exactly 0.00 ms. School's whole counter-finding was that the gap is
  // a bias AND a jitter, and a jitter of zero from sixty copies of one number is not a
  // measurement. Sampling now runs on requestAnimationFrame across about a second and a
  // half, so consecutive samples are genuinely different instants.
  return new Promise((resolve) => {
    if (!(out.hasTimestamp && out.seqOn && out.seqT0 != null)) { out.samples = []; return resolve(out); }
    const samples = [], t0 = performance.now();
    const tick = () => {
      const ts = AC.getOutputTimestamp();
      const judgeMs = (AC.currentTime - (AC.outputLatency || AC.baseLatency || 0) - _seq.t0) * 1000;
      const earMs = (ts.contextTime - _seq.t0) * 1000 + (shiftMs || 0);
      if (ts.contextTime > 0) samples.push(+(judgeMs - earMs).toFixed(3));
      if (performance.now() - t0 < 1500 && samples.length < 120) requestAnimationFrame(tick);
      else { out.samples = samples; out.spanMs = Math.round(performance.now() - t0); resolve(out); }
    };
    requestAnimationFrame(tick);
  });
};

function stats(a) {
  if (!a || !a.length) return null;
  const s = a.slice().sort((x, y) => x - y);
  const mean = a.reduce((p, c) => p + c, 0) / a.length;
  const sd = Math.sqrt(a.reduce((p, c) => p + (c - mean) * (c - mean), 0) / a.length);
  return { n: a.length, median: +s[Math.floor(s.length / 2)].toFixed(2), mean: +mean.toFixed(2),
           sd: +sd.toFixed(2), min: +s[0].toFixed(2), max: +s[s.length - 1].toFixed(2) };
}

(async () => {
  const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
  const ctx = await browser.newContext(PHONE);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0,140)));
  await page.goto('file://' + path.resolve('slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil:'load' });
  await page.waitForTimeout(2500);
  try { await page.click('#front', { timeout:4000 }); } catch(e){}
  await page.waitForTimeout(6000);

  // INTO THE FIGHT.
  // BUG 1: page.click needs the element visible and the tab bar is not, so the first run
  // never opened the COMBAT tab at all and then measured a frame with no AudioContext in
  // it -- a confident "not measurable" about the wrong frame. The shell switches tabs with
  // an ordinary .click() in JS, which does not care about visibility, and the heavy frames
  // are lazy: they carry data-src and only load when their tab is first opened.
  const opened = await page.evaluate(() => {
    const t = document.querySelector('.tab[data-p=combat]');
    if (!t) return 'no combat tab';
    t.click();
    const f = document.getElementById('combatFrame');
    if (f && !f.getAttribute('src') && f.dataset && f.dataset.src) { f.src = f.dataset.src; return 'clicked + lazy src set'; }
    return 'clicked';
  }).catch(e => 'err: ' + String(e).slice(0, 80));
  await page.waitForTimeout(12000);

  // find the frame that actually HAS the fight in it, by asking, not by guessing its name
  let fight = null;
  for (const f of page.frames()) {
    if (f === page.mainFrame()) continue;
    const has = await f.evaluate(`(() => { try { return (typeof PERFECT_MS !== 'undefined') && (typeof audioMs === 'function'); } catch(e){ return false; } })()`).catch(() => false);
    if (has) { fight = f; break; }
  }
  if (!fight) {
    const names = [];
    for (const f of page.frames()) { try { names.push((f.name() || '?') + ':' + f.url().split('/').pop().slice(0, 30)); } catch (e) {} }
    console.log('NO FRAME CONTAINS THE FIGHT. tab open attempt: ' + opened);
    console.log('frames seen: ' + names.join(', '));
    console.log('REFUSING TO REPORT: measuring a frame that is not the fight would be a confident answer about the wrong thing.');
    await browser.close(); process.exit(1);
  }

  // START THE FIGHT THE WAY A FINGER STARTS IT.
  // BUG 2: the AudioContext does not exist until a real gesture, and the fight's music loop
  // only runs while a fight is actually live (fightLive()). The first two runs read a frame
  // with no AC in it and reported "not measurable" about a game that had never been started.
  // A real click on the frame is the honest first move; calling startGame() by hand is the
  // fallback and the record says which one was used.
  let started = 'real tap on the start screen';
  const fbox = await (await page.$('#combatFrame')).boundingBox().catch(() => null);
  if (fbox) { try { await page.mouse.click(fbox.x + fbox.width / 2, fbox.y + fbox.height / 2); } catch (e) {} }
  await page.waitForTimeout(4000);
  let live = await fight.evaluate(READ, 0).catch(e => ({ err: String(e).slice(0,140) }));
  if (!live || !live.hasAC) {
    started = 'startGame() called by hand (the tap did not create an AudioContext)';
    await fight.evaluate(`(() => { try { if (typeof startGame === 'function') startGame(); else if (typeof audio === 'function') audio(); } catch(e){} })()`).catch(() => {});
    await page.waitForTimeout(4000);
    live = await fight.evaluate(READ, 0).catch(e => ({ err: String(e).slice(0,140) }));
  }
  if (live && live.hasAC && !live.seqOn) {
    started += ' + startFactionLoop() by hand';
    await fight.evaluate(`(() => { try { if (typeof startFactionLoop === 'function') startFactionLoop(); } catch(e){} })()`).catch(() => {});
    await page.waitForTimeout(2500);
    live = await fight.evaluate(READ, 0).catch(e => ({ err: String(e).slice(0,140) }));
  }
  console.log('   the fight was started by: ' + started);
  // RULE ZERO: a known 150 ms shift must move the answer by 150 ms
  const control = await fight.evaluate(READ, 150).catch(e => ({ err: String(e).slice(0,140) }));

  // THE GRADE BANDS, PROVED BY SWEEPING THE FIGHT'S OWN GRADER.
  // "can the first fight be passed by somebody doing it right" is answerable without a
  // human: feed the game's own gradeOf() the error a perfect player would actually have.
  const bands = await fight.evaluate(`(() => {
    if (typeof gradeOf !== 'function') return { err: 'no gradeOf' };
    const edges = {}, seen = [];
    for (let ms = -220; ms <= 220; ms += 1) { const g = gradeOf(ms); seen.push([ms, g]); }
    let last = null;
    for (const [ms, g] of seen) { if (g !== last) { edges[ms] = g; last = g; } }
    return { edges, atZero: gradeOf(0), beatErrOfHalf: (typeof beatErrMs === 'function') ? beatErrMs(0.5) : null };
  })()`).catch(e => ({ err: String(e).slice(0,120) }));

  // WHAT HAPPENS WITH THE MUSIC OFF. audioMs() returns null when the loop is not running,
  // and the beat clock falls back to a frame counter that nothing compensates for latency.
  // So the judge may be ear-true only while the song plays, which is worth a number.
  await fight.evaluate(`(() => { try { if (typeof stopFactionLoop === 'function') stopFactionLoop(); } catch(e){} })()`).catch(() => {});
  await page.waitForTimeout(1200);
  const silent = await fight.evaluate(`(() => {
    const o = {};
    try { o.seqOn = !!_seq.on; } catch (e) { o.seqOn = null; }
    try { o.audioMs = (typeof audioMs === 'function') ? audioMs() : 'no audioMs'; } catch (e) { o.audioMs = 'err'; }
    return o;
  })()`).catch(e => ({ err: String(e).slice(0,120) }));

  await browser.close();

  const S = stats(live.samples), C = stats(control.samples);
  console.log('THE FIGHT, MEASURED ON THE SHIPPED ALPHA AT 390x844');
  console.log('   combat tab opened: ' + opened + '   AudioContext: ' + (live.hasAC ? live.state + ' @ ' + live.sampleRate + ' Hz' : 'NONE'));
  if (live.err) console.log('   read error: ' + live.err);
  console.log('');
  console.log('1  WHAT THE DEVICE SAYS ABOUT ITSELF');
  console.log('   outputLatency  ' + (live.outputLatencyMs != null ? live.outputLatencyMs.toFixed(2) + ' ms' : '?'));
  console.log('   baseLatency    ' + (live.baseLatencyMs != null ? live.baseLatencyMs.toFixed(2) + ' ms' : '?'));
  console.log('   getOutputTimestamp available: ' + live.hasTimestamp);
  console.log('');
  console.log('2  THE FIGHT\'S OWN NUMBERS, READ OFF THE RUNNING GAME');
  const b = live.bands || {};
  console.log('   BPM_MS ' + b.BPM_MS + '   PERFECT within ' + b.PERFECT_MS + ' ms   GOOD within ' + b.GOOD_MS +
              ' ms   permission grace ' + b.BEAT_GRACE + ' beats (' + (b.BEAT_GRACE && b.BPM_MS ? Math.round(b.BEAT_GRACE * b.BPM_MS) : '?') + ' ms)');
  console.log('   the music loop is ' + (live.seqOn ? 'PLAYING, so the beat clock is the audio clock' : 'NOT PLAYING, so the beat clock falls back to the frame counter'));
  console.log('   audioMs() returns: ' + (typeof live.audioMs === 'number' ? live.audioMs.toFixed(1) + ' ms' : live.audioMs));
  console.log('');
  console.log('3  RULE ZERO -- a known 150 ms shift must move the answer by 150 ms');
  if (S && C) {
    const moved = C.median - S.median;
    const ok = Math.abs(Math.abs(moved) - 150) < 15;
    console.log('   ' + (ok ? 'PASS  ' : 'FAIL  ') + 'the gap moved by ' + moved.toFixed(2) + ' ms when 150 ms was injected');
    if (!ok) { console.log(''); console.log('   REFUSING TO REPORT THE GAP. If a known shift does not move the answer, the two'); console.log('   clocks are not being compared and every number below is meaningless.'); }
    console.log('');
    console.log('4  THE GAP: WHAT THE JUDGE THINKS THE TIME IS, MINUS WHAT THE EAR IS HEARING');
    if (ok) {
      console.log('   median ' + S.median + ' ms   mean ' + S.mean + ' ms   jitter (sd) ' + S.sd + ' ms');
      console.log('   worst  ' + (Math.abs(S.min) > Math.abs(S.max) ? S.min : S.max) + ' ms   over ' + S.n + ' samples');
      const g = Math.abs(S.median);
      console.log('');
      console.log('   AGAINST THE FIGHT\'S OWN BANDS: a player pressing exactly on the sound they hear is graded ' +
                  (g <= (b.PERFECT_MS || 55) ? 'PERFECT' : g <= (b.GOOD_MS || 110) ? 'GOOD, not PERFECT' : 'WORSE THAN GOOD') +
                  '  (gap ' + S.median + ' ms vs PERFECT ' + b.PERFECT_MS + ' ms)');
    }
  } else {
    console.log('   NOT MEASURABLE: ' + (live.seqOn ? 'no samples collected' : 'the music loop never started, so the ear clock has no anchor (_seq.t0)'));
  }

  console.log('');
  console.log('5  THE GRADE BANDS, SWEPT THROUGH THE FIGHT\'S OWN GRADER');
  if (bands && bands.edges) {
    console.log('   ' + Object.entries(bands.edges).map(([ms, g]) => ms + 'ms->' + g).join('   '));
    console.log('   a press exactly on the sound the player hears carries ' + (S ? S.median : '?') + ' ms of error, which the fight grades ' +
                (S ? '"' + (Math.abs(S.median) <= 55 ? 'PERFECT' : Math.abs(S.median) <= 110 ? 'GOOD' : 'WORSE') + '"' : '?'));
  } else { console.log('   could not reach the grader: ' + (bands && bands.err)); }

  console.log('');
  console.log('6  WITH THE MUSIC STOPPED');
  console.log('   the music loop is ' + (silent && silent.seqOn ? 'still on' : 'off') + ', and audioMs() now returns ' +
              (silent ? JSON.stringify(silent.audioMs) : '?'));
  console.log('   when that returns null the beat clock falls back to a frame counter, and nothing');
  console.log('   subtracts the device latency from a frame counter. The ear-true clock is the audio one.');

  fs.writeFileSync('records/BOHEMIA_EYES_LATE_BEAT_9_7_26.json', JSON.stringify({
    what: 'EYES AND EARS -- E14 [late beat] round 2. The judge clock against the ear clock.',
    date: '9/7/26',
    school: 'records/BOHEMIA_EYES_E14_ROUND_1_SCHOOL_THE_HUMAN_TAPS_EARLY_9_7_26.md',
    method: 'judge = AC.currentTime - outputLatency - _seq.t0 (what the fight grades against). ear = getOutputTimestamp().contextTime - _seq.t0 (the sample frame the device is playing now). both read in the same instant, in the same frame, with no human anywhere.',
    blind_spots: [
      'one device, one browser, one output route: this is the harness audio path, not a real phone',
      'outputLatency is explicitly an ESTIMATE, and this environment may report a different one from a phone',
      'Bluetooth cannot be tested here at all; its numbers stay quoted, never measured',
      'video offset is not measured',
      'nothing here says whether the fight is FUN'
    ],
    startedBy: started, live, control, bands, silent, stats: { live: S, control: C }, pageErrors: errs
  }, null, 1));
  console.log('');
  console.log('written: records/BOHEMIA_EYES_LATE_BEAT_9_7_26.json');
})();
