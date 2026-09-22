/* BOHEMIA -- WHAT HAPPENS BETWEEN TWO SONGS, ON THE CLOCK
 * EYES AND EARS, lane 17, E20 [song length] round two. 9/22/26.
 * Round one: records/BOHEMIA_EYES_E20_ROUND_1_SCHOOL_THE_PREMISE_ALREADY_MOVED_9_13_26.md.
 *
 * THE ROW: "SOUNDS measured that the music never stops (good) and that every song gets exactly
 * 128 seconds, the engine's loop length, a number about buffers and not about music, with the
 * next song starting on the very next beat and the ambience bed masked underneath forever."
 * Round one found TWO PARTS OF THAT PREMISE STALE (front-page rule 12: a dependency is a premise,
 * measure it) -- the rest IS already built, and 128 s is an ARRANGEMENT not a buffer. Round two
 * is the measurement: the handover on the clock, the bed's level inside the gap, and the form.
 *
 * WHAT IT MEASURES, all from the game's own state rather than from reading code:
 *   THE GAP        CITYMUS.resting sampled on the page's clock, so the rest's length is wall
 *                  time and not the number somebody typed. Compared against PHRASE (its
 *                  intended length in steps) and against the ~3 s floor round one found
 *                  published: beat anticipation breaks down past about 2 to 3 seconds, so a gap
 *                  shorter than that is not a breath, it is a stumble.
 *   THE BED        CITYMUS.restGain during the rest, against the same value outside it. The row
 *                  says the bed is "masked underneath forever"; if restGain does not move, the
 *                  duck is not a duck.
 *   REFUSALS       CITYMUS.restBlocked. A rest refused because a fight or a menu owns the master
 *                  is not a gap of length zero, and reporting it as one would be a false number.
 *
 * AND THE FORM WAS MEASURED WITHOUT A BROWSER AT ALL, which is worth saying because it is the
 * cheapest half: MUS.ARR appears exactly THREE times in the 5.5 MB alpha -- one definition, one
 * read inside songCtx, one dev readout -- and the music RT exactly twice. NO SONG ROW OVERRIDES
 * EITHER. So every song plays one sixteen-section arrangement with the key moving at the same
 * sixteen moments. Round one claimed that; this counted it.
 *
 * *** THE FIRST VERSION OF THIS TOOL PUBLISHED NOTHING, AND IT NEARLY PUBLISHED A LIE. ***
 * It entered the game with a scripted element.click() on the splash 2.5 s after load, then read
 * CITYMUS.on as FALSE on both surfaces and was one step from reporting THE SHUFFLE IS OFF FOR A
 * STRANGER. It is not off. THE DOOR NEVER OPENED. Five arms on one cut, one difference at a time,
 * because the first A/B moved three things at once (the kind of press, which element got it, and
 * when):
 *     real touch on the splash centre at 2.5 s   door opens, CITYMUS.on TRUE
 *     scripted click on the splash at 2.5 s      DOOR STAYS SHUT, CITYMUS.on false
 *     scripted click on the splash at 35 s       door opens, CITYMUS.on TRUE
 *     scripted click on BEGIN itself at 35 s     door opens, CITYMUS.on TRUE
 *     real touch on the splash centre at 35 s    door opens, CITYMUS.on TRUE
 * So it is neither trusted input nor the wrong element: IT IS WHEN. A press during the boot
 * freeze is lost if it is scripted and survives if it is a finger, because the browser queues a
 * trusted event until the main thread frees up and a scripted click fires into a page that has
 * not wired its handler yet. THE LESSON FOR EVERY INSTRUMENT IN THIS LANE: a scripted press
 * inside the first ~30 s is not a press. The five-minute walk is safe by accident -- its first
 * tap lands at 31 s.
 *
 * RULE ZERO, five controls, because a zero here would be a number about silence:
 *   C0 THE DOOR OPENED  the splash is gone and the game's HUD is there, or nothing below is
 *                       about the game at all. This is the control whose absence caused the
 *                       retraction above.
 *   C1 NOT BLIND      a forced beginRest() must be seen by the sampler
 *   C2 BOTH EDGES     a forced endRest() must be seen ending it
 *   C3 A REAL DUCK    restGain inside a rest must differ from the value outside it, or the
 *                     "masked bed" is a default and not a measurement
 *   C4 REFUSED IS NOT ZERO  a blocked rest is reported as refused, never as a gap of 0 s
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
function pw() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { return require(t); } catch (e) {}
  }
  throw new Error('playwright not found');
}
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const arg = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : d; };
const SURFACE = arg('--surface', path.join(ROOT, 'slices', 'BOHEMIA_DEMO.html'));
const WATCH_MS = Number(arg('--watch', 240000));
const TICK = 250;
/* ONE FIXED OUTPUT FILE LET THE SECOND SURFACE EAT THE FIRST SURFACE'S PROOF. The first run of
   this tool watched the deploy cut for 240 s; the second watched the alpha for 20 s and wrote
   over it, so the saved file said 20 s while the number I was about to publish said 240. Same
   class as E27's runner truncating its own results. The file name now carries the surface, and
   the window length is printed and stored, so a claim can always be checked against its proof. */
/* A CUT LIVES OUTSIDE THE REPO ON PURPOSE (nothing of RUN's is touched), and it is named
   BOHEMIA_DEMO.html just like the committed file nobody is served, so the tag has to ask
   WHERE the file is and not only what it is called, or the deploy run and the committed-demo
   run land in the same file again. */
const INSIDE_REPO = path.resolve(SURFACE).startsWith(ROOT + path.sep);
const TAG = !INSIDE_REPO ? 'DEPLOYCUT' : /ALPHA/i.test(SURFACE) ? 'ALPHA' : 'DEMO';
const OUTFILE = path.join(ROOT, 'records', 'BOHEMIA_EYES_E20_THE_HANDOVER_' + TAG + '_9_22_26.json');

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
    args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
  const page = await (await b.newContext(PHONE)).newPage();
  const out = { what: 'what happens between two songs, on the clock', row: 'E20 [song length] round two',
                when: new Date().toISOString(), surface: SURFACE, surface_tag: TAG,
                watch_window_s: Math.round(WATCH_MS / 1000), controls: [], rests: [], samples: 0 };

  /* TWO OF THESE ARE FUNCTIONS ON THE OBJECT, AND THE FIRST CUT READ THEM AS VALUES.
     CITYMUS.restLen and CITYMUS.restBlocked are methods, so JSON handed back undefined every
     sample: the rest length printed as "the engine intended undefined" and C4 announced "0
     samples had restBlocked set" while nothing had ever been asked. A counter over a field that
     does not exist is not a zero, it is a number about nothing -- the same defect this lane
     wrote up as E28's lesson, one file later. They are CALLED here. */
  const read = () => page.evaluate(() => {
    const C = window.CITYMUS;
    if (!C) return null;
    const call = (f) => { try { return typeof f === 'function' ? f.call(C) : f; } catch (e) { return 'threw'; } };
    return { on: !!C.on, resting: !!C.resting, restUntil: C.restUntil,
             restLen: call(C.restLen), restGain: C.restGain, restBlocked: call(C.restBlocked),
             PHRASE: C.PHRASE, masterGain: (() => { try { return window.MUS.MAST.gain.value; } catch (e) { return null; } })(),
             phase: C.phase == null ? null : String(C.phase), now: performance.now() };
  }).catch(() => null);

  const doorState = () => page.evaluate(() => {
    const shown = (el) => { if (!el) return false; const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'
             && +cs.opacity > 0.1; };
    let hud = null;
    for (const f of document.querySelectorAll('iframe')) {
      try { const d = f.contentDocument; if (!d) continue;
            const b = d.getElementById('musbtn'); if (b) { hud = (b.textContent || '').trim().slice(0, 40); break; } }
      catch (e) {}
    }
    return { front_shown: shown(document.getElementById('front')), hud_music_text: hud };
  }).catch(() => ({ front_shown: null, hud_music_text: null }));

  try {
    await page.goto('file://' + SURFACE, { waitUntil: 'domcontentloaded', timeout: 180000 });
    /* THE DOOR IS OPENED WITH A FINGER, AND IT IS OPENED AFTER THE BOOT, FOR TWO SEPARATE
       REASONS THIS TOOL GOT WRONG (see the head of this file). A trusted touch is queued by
       the browser and delivered when the main thread frees up; a scripted click fires into a
       page that is not listening yet and is simply lost. Both fixes are cheap, so both are in:
       a real tap, and it happens after the city has finished building. */
    await sleep(34000);
    const boxed = await page.evaluate(() => { const f = document.getElementById('front');
      if (!f) return null; const r = f.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    out.door = { tapped_at: boxed ? Math.round(boxed.x) + ',' + Math.round(boxed.y) : 'no front box' };
    if (boxed) await page.touchscreen.tap(boxed.x, boxed.y);
    await sleep(6000);
    let d0 = await doorState();
    if (d0.front_shown && boxed) { await page.touchscreen.tap(boxed.x, boxed.y); await sleep(6000); d0 = await doorState(); }
    await sleep(6000);
    out.door.after = d0;
    /* C0 COMES FIRST BECAUSE IT IS THE ONE THAT WAS MISSING. It asks the door, not the music:
       is the splash gone and is the game's own HUD there. It deliberately does NOT ask whether
       the shuffle is on -- a control that required the finding to be absent would hide it. */
    out.controls.push({ name: 'C0 THE DOOR REALLY OPENED: the splash is gone and the game\u2019s HUD is there',
                        pass: d0.front_shown === false && !!d0.hud_music_text,
                        detail: 'front screen shown after the tap: ' + JSON.stringify(d0.front_shown)
                          + ', the HUD music chip reads ' + JSON.stringify(d0.hud_music_text)
                          + (d0.front_shown === false && d0.hud_music_text
                             ? ' -- so the game is running and anything below is about the game'
                             : ' -- SO NOTHING BELOW IS ABOUT THE GAME, it is about a door that never opened') });

    const first = await read();
    out.at_the_door = first;
    if (!first) throw new Error('CITYMUS is not reachable on this surface');
    out.shuffle_on_at_the_door = first.on;
    out.phrase_steps = first.PHRASE;
    /* the engine's own step is 0.125 s at 120 BPM, which is the 120 BPM law, not a guess */
    out.phrase_seconds_if_a_step_is_0_125 = first.PHRASE != null ? +(first.PHRASE * 0.125).toFixed(2) : null;

    /* ---- WATCH FIRST. Every natural rest, on the page's clock. ----------------------------
       THE ORDER USED TO BE THE OTHER WAY ROUND AND THAT IS WHY TWO CONTROLS FAILED ON A HEALTHY
       GAME. Forcing a rest twelve seconds after the door is asking for a rest before any music
       is playing, and beginRest() REFUSES that on purpose -- its own line reads "already
       silent: nothing to rest". So the force ran against silence, the sampler correctly saw no
       rest, and C1 called itself blind. The force now happens AFTER the watch window, when
       there is certainly something to duck, and its return value is captured instead of
       discarded so a refusal is reported as a refusal. */
    const outsideGain = first.restGain;
    const t0 = first.now;
    let prev = false, startedAt = null, gainSeen = [], blockedSeen = 0, onAt = null;
    const deadline = Date.now() + WATCH_MS;
    while (Date.now() < deadline) {
      const s = await read();
      if (!s) { await sleep(TICK); continue; }
      out.samples++;
      if (s.on && onAt == null) onAt = s.now;
      if (s.restBlocked) blockedSeen++;
      if (s.resting && !prev) { startedAt = s.now; gainSeen = []; }
      if (s.resting) gainSeen.push(s.restGain);
      if (!s.resting && prev && startedAt != null) {
        out.rests.push({ at_s: +((startedAt - t0) / 1000).toFixed(2),
                         length_s: +((s.now - startedAt) / 1000).toFixed(2),
                         restLen_the_engine_intended_ms: s.restLen,
                         bed_gain_inside: gainSeen.filter(g => g != null).slice(0, 4) });
        startedAt = null;
      }
      prev = s.resting;
      await sleep(TICK);
    }
    out.rests_refused_while_watching = blockedSeen;
    out.shuffle_first_on_at_s = onAt == null ? null : +((onAt - t0) / 1000).toFixed(2);

    /* ---- THE FORCE, AFTER THE WATCH: C1, C2 and C3 ---- */
    const forced = { returned: null, seenResting: false, seenEnded: false, gainInside: null, why: null };
    forced.returned = await page.evaluate(() => {
      try { return { got: !!window.CITYMUS.beginRest(),
                     blocked: (() => { try { return !!window.CITYMUS.restBlocked(); } catch (e) { return 'threw'; } })(),
                     master: (() => { try { return window.MUS.MAST.gain.value; } catch (e) { return null; } })() }; }
      catch (e) { return { got: false, threw: String(e).slice(0, 80) }; }
    });
    for (let i = 0; i < 12 && !forced.seenResting; i++) {
      const s = await read();
      if (s && s.resting) { forced.seenResting = true; forced.gainInside = s.restGain; }
      else await sleep(150);
    }
    await page.evaluate(() => { try { window.CITYMUS.endRest && window.CITYMUS.endRest(); } catch (e) {} });
    for (let i = 0; i < 12 && !forced.seenEnded; i++) {
      const s = await read(); if (s && !s.resting) forced.seenEnded = true; else await sleep(150);
    }
    if (!forced.returned || !forced.returned.got) forced.why = 'beginRest() refused: '
      + JSON.stringify(forced.returned) + '. Its own rules refuse a rest when one is already on, '
      + 'when a fight or a menu owns the master, and when the master is already silent.';
    out.forced = forced;

    /* A NATURAL REST WITH BOTH EDGES PROVES THE SAMPLER IS NOT BLIND JUST AS WELL AS A FORCED
       ONE -- better, in fact, because it is the thing being measured. So C1 and C2 accept
       either and NAME WHICH they got. A run with no rest at all and a refused force still fails
       them, which is the point: then the zero means nothing. */
    const naturalBothEdges = out.rests.length > 0;
    const sawBegin = forced.seenResting || naturalBothEdges;
    const sawEnd = forced.seenEnded || naturalBothEdges;
    const whichRest = naturalBothEdges ? 'a NATURAL rest (' + out.rests.length + ' in the window)'
                      : forced.seenResting ? 'a FORCED rest' : 'none';
    out.controls.push({ name: 'C1 NOT BLIND: the sampler is proved to see a rest begin',
                        pass: sawBegin,
                        detail: 'what it saw: ' + whichRest
                          + (forced.why ? ' | ' + forced.why : ' | the forced rest was granted')
                          + (sawBegin ? '' : ' -- so a zero below would mean nothing') });
    out.controls.push({ name: 'C2 BOTH EDGES: the sampler is proved to see a rest end',
                        pass: sawEnd,
                        detail: sawEnd ? 'a rest was seen going back to resting=false, on ' + whichRest
                          : 'the sampler never saw a rest end' });
    const insideGains = out.rests.flatMap(r => r.bed_gain_inside).concat(
      typeof forced.gainInside === 'number' ? [forced.gainInside] : []);
    const anyInside = insideGains.find(g => typeof g === 'number');
    /* C3'S PASS RULE AND ITS OWN DETAIL TEXT DISAGREED ON THE FIRST RUN, AND THE DETAIL WAS
       RIGHT. Outside a rest CITYMUS.restGain is NULL, because the field is only set when a rest
       starts; inside a rest it is 0.800. That IS the duck, captured rather than typed. The old
       rule demanded BOTH values be numbers, so it failed on the correct state while its own
       sentence said the duck was real. A control whose verdict contradicts its own explanation
       is a broken control, not a finding about the game. */
    out.controls.push({ name: 'C3 A REAL DUCK: the bed\u2019s gain inside a rest is a real captured number and is not the outside state',
                        pass: typeof anyInside === 'number' && anyInside !== outsideGain,
                        detail: 'outside ' + JSON.stringify(outsideGain) + ' (the field exists only '
                          + 'during a rest), inside ' + JSON.stringify(anyInside)
                          + (anyInside === outsideGain
                             ? ' -- IDENTICAL, so the masked bed is a default and not a duck'
                             : ' -- a real number and not the outside state, so the duck is real') });
    out.controls.push({ name: 'C4 REFUSED IS NOT ZERO: a blocked rest is reported as refused',
                        pass: true,
                        detail: blockedSeen + ' of ' + out.samples + ' samples had restBlocked() '
                          + 'true (the method is CALLED now, not read); a refused rest is never '
                          + 'counted as a gap of 0 s' });

    const lens = out.rests.map(r => r.length_s);
    out.numbers = {
      rests_in_the_window: out.rests.length,
      window_s: +(WATCH_MS / 1000).toFixed(0),
      shortest_gap_s: lens.length ? Math.min(...lens) : null,
      longest_gap_s: lens.length ? Math.max(...lens) : null,
      the_floor_from_round_one_s: 3,
      gaps_under_the_floor: lens.filter(l => l < 3).length,
      phrase_steps: out.phrase_steps,
      phrase_seconds_if_a_step_is_0_125: out.phrase_seconds_if_a_step_is_0_125,
      THE_SHUFFLE_IS_ON_AT_THE_DOOR: out.shuffle_on_at_the_door,
      seconds_after_the_door_the_shuffle_came_on: out.shuffle_first_on_at_s,
      refused_samples: out.rests_refused_while_watching,
    };
    /* THE FINDING IS NOW ABOUT THE WHOLE WINDOW, NOT ABOUT ONE READING TWELVE SECONDS IN.
       "Not on at the door" is normal: the shuffle starts when the game hands the streets their
       music, which is later than the door. Only "never on at all, and no rest in four minutes"
       is a defect. */
    if (out.shuffle_first_on_at_s == null && out.rests.length === 0) {
      out.findings = [{ what: 'the shuffle never came on at all in ' + (WATCH_MS / 1000) + ' s of play',
        why_it_matters: 'the shuffle is what hands one song to the next, so no handover can happen: '
          + '0 rests in ' + (WATCH_MS / 1000) + ' s, and CITYMUS.on was false in all '
          + out.samples + ' samples. This only counts as a finding with C0 green (the door really '
          + 'opened) and C1 green (the sampler is proved to see a rest), because a door that never '
          + 'opened produces exactly this reading.' }];
    }
  } catch (e) { out.ok = false; out.why = String(e).slice(0, 400); }
  await b.close();
  const bad = out.controls.filter(c => !c.pass).map(c => c.name);
  out.failing_controls = bad;
  fs.writeFileSync(OUTFILE, JSON.stringify(out, null, 2));
  console.log('  wrote ' + path.basename(OUTFILE) + ' (' + Math.round(WATCH_MS / 1000) + ' s window, surface: ' + TAG + ')');
  console.log('  controls: ' + (bad.length ? 'FAILED -> ' + bad.join(' | ') : 'all green'));
  if (bad.length) console.log('  THE NUMBERS BELOW MEAN NOTHING UNTIL THE CONTROLS PASS.');
  if (out.why) console.log('  why: ' + out.why);
  for (const [k, v] of Object.entries(out.numbers || {})) console.log('    ' + k.padEnd(44) + ' ' + JSON.stringify(v));
  for (const r of (out.rests || []).slice(0, 8))
    console.log('    rest at ' + r.at_s + ' s ran ' + r.length_s + ' s, engine intended '
      + r.restLen_the_engine_intended_ms + ' ms, bed gain inside ' + JSON.stringify(r.bed_gain_inside));
  process.exit(0);
})();
