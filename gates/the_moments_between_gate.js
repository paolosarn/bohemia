/* THE MOMENTS BETWEEN (WORLD round 2, 11/2, ask line 273; Paolo 11/2: 'The transition of the camp to when time passes by and an
   enemy wants to attack you, it's just like sloppy quick bullshit... I want things to look less choppy... less AI slop').
   Drives the demo at phone size (tools/bohemia_drive_the_demo.js, phone_portrait) and samples, every drawn frame, what the eye gets:
   the camp screen's computed opacity and display, the meet card's computed opacity, the veil sheet. Measured before (the record,
   records/BOHEMIA_WORLD_THE_MOMENTS_BETWEEN_11_2_26.md): the camp screen and the card each came on in ONE frame.
     B1 MAKE CAMP: the camp is made at once (CAMP.on, the frame shown to the logic), the camp screen comes up eased over 3 beats
        (1.5 s at 120 BPM), no frame steps more than a fifth of the way, the veil and the clock are up while it does.
     B2 BREAK CAMP: the camp is over at once (CAMP.on false, the frame's own display none, as every reader expects, so the town screen
        lets its pictures go as it always did), its last picture fades over both beats, the moment is 2 beats (the clock runs the hours he rested), no frame steps more than a fifth.
     B3 THEY COME, AT THE CAMP: the crew walks the last block; the card is up for the logic that tick (MEET.up, #meetcard), the camp
        breaks on it, the camp's screen fades over its first two beats, the card comes up eased and is whole by 3 beats, no step over a
        fifth; the dark holds while the card stands.
     B4 FALL BACK opens it in one beat: the card's id is gone at once, the sheet is gone after a beat.
     B5 A TAP SKIPS: camp made, a finger on the map a quarter second in: the camp screen is whole on the next frame, the moment is
        over, and the tap did not walk him.
     B6 ENGAGE closes it in one beat (the card's id gone at once, the 'engage' moment, 1 beat).
     B7 nothing threw.
   Lengths are the moment's own clock (a frame adds at most 100 ms, so a stalled page holds the picture still instead of
   jumping it), checked exact in the moments' own log (3, 2, 3 and 1 beats); on the wall a stall stretches them (measured: the same
   card whole at 1.57 s in one run and 2.11 s in the next), so the wall's ceilings are twice the beats and its floors stay: never a cut. About 60 s. */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const BEAT = 500, STEP = 0.2;   /* a fifth: the old ways stepped the whole way (1.0) in one frame; headless draws at about 12 fps under a camp */
const REST = () => { try { if (typeof loopClose === 'function') loopClose(); } catch (e) {} try { if (MEET.up && typeof meetFallBack === 'function') { const m = MEET.up.msg; try { MEET.up.el.remove(); } catch (e) {} MEET.up = null; meetFallBack(m); } } catch (e) {}
  try { contactClear(); } catch (e) {} try { HUNT = null; } catch (e) {} try { travelStop(); } catch (e) {} try { if (BohemiaMapCamp.on()) BohemiaMapCamp.break(); } catch (e) {}
  try { TOWN_EXIT = null; } catch (e) {} try { BohemiaBetween.finish(); } catch (e) {} };
const SAMPLE = () => { window.__BTW_S = []; window.__BTW_ON = true; const t0 = performance.now();
  (function loop() { const f = LOOP.frame, c = document.getElementById('meetcard'), b = document.getElementById('between'), cs = f ? getComputedStyle(f) : null, sn = document.getElementById('betweensnap');
    const fo = cs ? (cs.display === 'none' ? 0 : +cs.opacity) : 0, so = sn && sn.isConnected ? +sn.style.opacity : 0;
    __BTW_S.push({ t: performance.now() - t0, fo: fo, so: so, pic: Math.max(fo, so), fd: f ? f.style.display : null, co: c ? +getComputedStyle(c).opacity : null,
      bv: b ? b.style.display : null, k: window.__MOMENT_BETWEEN ? __MOMENT_BETWEEN.kind : null });
    if (window.__BTW_ON) requestAnimationFrame(loop); })(); };
const STOP = () => { window.__BTW_ON = false; return window.__BTW_S; };
const maxStep = (s, key) => { let m = 0; for (let i = 1; i < s.length; i++) if (s[i][key] != null && s[i - 1][key] != null) m = Math.max(m, Math.abs(s[i][key] - s[i - 1][key])); return Math.round(m * 1000) / 1000; };
const firstAt = (s, fn) => { const r = s.find(fn); return r ? Math.round(r.t) : null; };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, profile: 'phone_portrait' }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); console.log('THE MOMENTS BETWEEN: ' + pass + ' passed, ' + fail + ' failed'); process.exit(1); }
  const { page, fr } = d;
  try {
    await page.waitForTimeout(2500);
    try { await d.toMap(); } catch (e) {}
    await fr.evaluate(REST); await page.waitForTimeout(900);
    /* B1 make camp */
    const b1a = await fr.evaluate((S) => { eval('(' + S + ')')(); const made = BohemiaMapCamp.make(); return { made, on: BohemiaMapCamp.on(), fd: LOOP.frame && LOOP.frame.style.display, dur: ((window.__BETWEEN || {}).log || []).slice(-1).map(x => x.dur)[0] }; }, SAMPLE.toString());
    await page.waitForTimeout(2000);
    const s1 = await fr.evaluate(STOP);
    const full1 = firstAt(s1, r => r.fo >= 0.999), st1 = maxStep(s1, 'fo'), veil1 = s1.filter(r => r.bv === 'block' && r.t < 1400).length;
    ok('B1 MAKE CAMP: made at once, the camp screen eased up over 3 beats, no frame steps over a fifth, the veil up while it does',
      b1a.made && b1a.on && b1a.fd === 'block' && b1a.dur === 3 * BEAT && s1[0].fo <= 0.05 && full1 >= 3 * BEAT - 120 && full1 <= 2 * 3 * BEAT && st1 <= STEP && veil1 >= 10,
      JSON.stringify({ made: b1a.made, beats: b1a.dur / BEAT, first: s1[0].fo, wholeAt: full1, largestStep: st1, veilFrames: veil1, frames: s1.length }));
    /* B2 break camp, after some hours */
    await page.waitForTimeout(1500);
    const b2a = await fr.evaluate((S) => { eval('(' + S + ')')(); const h = BohemiaMapCamp.state().hours; BohemiaMapCamp.break(); return { h, on: BohemiaMapCamp.on(), fd: LOOP.frame.style.display, k: window.__MOMENT_BETWEEN && __MOMENT_BETWEEN.kind, dur: ((window.__BETWEEN || {}).log || []).slice(-1).map(x => x.dur)[0] }; }, SAMPLE.toString());
    await page.waitForTimeout(1400);
    const s2 = await fr.evaluate(STOP);
    const gone2 = firstAt(s2, r => r.t > 50 && r.pic === 0), st2 = maxStep(s2, 'pic'), end2 = firstAt(s2, r => r.t > 50 && r.bv !== 'block');
    ok('B2 BREAK CAMP: over at once (the frame\'s own display none), its last picture fades over the 2 beats of the moment, no step over a fifth',
      !b2a.on && b2a.fd === 'none' && b2a.k === 'campOut' && b2a.dur === 2 * BEAT && s2[0].fo > 0.85 && gone2 >= 2 * BEAT - 150 && gone2 <= 2 * 2 * BEAT && end2 >= 2 * BEAT - 120 && end2 <= 2 * 2 * BEAT && st2 <= STEP,
      JSON.stringify({ hours: b2a.h, beats: b2a.dur / BEAT, first: s2[0].fo, screenGoneAt: gone2, momentEndsAt: end2, largestStep: st2 }));
    /* B3 they come, at the camp */
    await fr.evaluate(REST); await page.waitForTimeout(700);
    await fr.evaluate(() => BohemiaMapCamp.make()); await page.waitForTimeout(1900);
    await fr.evaluate((S) => { eval('(' + S + ')')(); let at = null;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (cityWalkable(city.x + dx, city.y + dy)) { at = [city.x + dx, city.y + dy]; break; }
      HUNT = { id: 'hunt:between', ev: null, name: 'The Between Crew', arch: 'human', count: 3, at: at || [city.x + 1, city.y], steps: 0, made: performance.now() }; }, SAMPLE.toString());
    let b3 = null; for (let k = 0; k < 16; k++) { await page.waitForTimeout(250); b3 = await fr.evaluate(() => ({ meet: !!MEET.up, card: !!document.getElementById('meetcard'), on: BohemiaMapCamp.on(), why: (window.__CAMP || {}).why })); if (b3.meet) break; }
    await page.waitForTimeout(2000);
    const s3 = await fr.evaluate(STOP);
    const c3 = s3.findIndex(r => r.co !== null), sc = c3 >= 0 ? s3.slice(c3) : [], t3 = sc.length ? sc[0].t : 0;
    const cardWhole = sc.find(r => r.co >= 0.999), camGone = sc.find(r => r.pic === 0), held = sc.length ? sc[sc.length - 1] : {};
    const log3 = await fr.evaluate(() => (window.__BETWEEN || {}).log || []);
    const come = log3.filter(x => x.kind === 'come').slice(-1)[0] || {};
    ok('B3 THEY COME AT THE CAMP: the card is up for the logic that tick and the camp breaks on it; the camp\'s screen goes over two beats, the card comes up eased, whole by 3 beats, no step over a fifth; the dark holds while it stands',
      b3 && b3.meet && b3.card && !b3.on && b3.why === 'contact' && come.fromCamp && sc.length && sc[0].co <= 0.05 && cardWhole && cardWhole.t - t3 >= 2 * BEAT && cardWhole.t - t3 <= 2 * 3 * BEAT && come.dur === 3 * BEAT
        && camGone && camGone.t - t3 <= 2 * 1.8 * BEAT && maxStep(sc, 'co') <= STEP && maxStep(sc, 'pic') <= STEP && held.bv === 'block' && held.co >= 0.999,
      JSON.stringify({ b3, fromCamp: come.fromCamp, beats: come.dur / BEAT, cardFirst: sc.length ? sc[0].co : null, cardWholeAt: cardWhole ? Math.round(cardWhole.t - t3) : null, campScreenGoneAt: camGone ? Math.round(camGone.t - t3) : null,
        cardStep: maxStep(sc, 'co'), screenStep: maxStep(sc, 'pic'), heldVeil: held.bv }));
    /* B4 fall back opens it */
    const b4a = await fr.evaluate(() => { MEET_DONE(false); return { card: !!document.getElementById('meetcard'), k: window.__MOMENT_BETWEEN && __MOMENT_BETWEEN.kind }; });
    await page.waitForTimeout(800);
    const b4 = await fr.evaluate(() => ({ veil: document.getElementById('between').style.display, going: !!document.getElementById('meetcard-going') }));
    ok('B4 FALL BACK opens the dark in a beat: the card\'s id gone at once, the sheet and the card gone after it', !b4a.card && b4a.k === 'release' && b4.veil === 'none' && !b4.going, JSON.stringify(Object.assign(b4a, b4)));
    /* B5 a tap skips, and does not walk him */
    await fr.evaluate(REST); await page.waitForTimeout(700);
    const at5 = await fr.evaluate((S) => { eval('(' + S + ')')(); BohemiaMapCamp.make(); return [city.x, city.y]; }, SAMPLE.toString());
    await page.waitForTimeout(250);
    const vp = page.viewportSize();
    await page.touchscreen.tap(Math.round(vp.width / 2), Math.round(vp.height * 0.42));
    await page.waitForTimeout(500);
    const s5 = await fr.evaluate(STOP);
    const b5 = await fr.evaluate(() => ({ at: [city.x, city.y], skipped: (window.__BETWEEN || {}).skipped || null, travel: !!(typeof TRAVEL !== 'undefined' && TRAVEL && TRAVEL.path && TRAVEL.i < TRAVEL.path.length), on: BohemiaMapCamp.on() }));
    const tapFrame = s5.findIndex(r => r.k === null && r.t > 150), whole5 = tapFrame >= 0 ? s5[tapFrame].fo : null;
    ok('B5 A TAP SKIPS: a finger on the map a quarter second in, the camp screen is whole on the next frame, the moment over, and he did not move',
      b5.skipped === 'campIn' && whole5 >= 0.999 && b5.at[0] === at5[0] && b5.at[1] === at5[1] && !b5.travel && b5.on,
      JSON.stringify({ skipped: b5.skipped, screenAfterTap: whole5, skippedAtMs: tapFrame >= 0 ? Math.round(s5[tapFrame].t) : null, moved: b5.at[0] !== at5[0] || b5.at[1] !== at5[1], travel: b5.travel }));
    /* B6 engage closes it */
    await fr.evaluate(REST); await page.waitForTimeout(500);
    await fr.evaluate(() => { let at = null; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (cityWalkable(city.x + dx, city.y + dy)) { at = [city.x + dx, city.y + dy]; break; }
      BohemiaMapCamp.make(); HUNT = { id: 'hunt:between2', ev: null, name: 'The Between Crew', arch: 'human', count: 3, at: at || [city.x + 1, city.y], steps: 0, made: performance.now() }; });
    let up6 = false; for (let k = 0; k < 16 && !up6; k++) { await page.waitForTimeout(250); up6 = await fr.evaluate(() => !!MEET.up); }
    const b6 = up6 ? await fr.evaluate(() => { MEET_DONE(true); const L = (window.__BETWEEN || {}).log || []; const e = L.slice(-1)[0] || {}; return { card: !!document.getElementById('meetcard'), kind: e.kind, dur: e.dur }; }) : null;
    ok('B6 ENGAGE closes the dark in one beat: the card\'s id gone at once, the engage moment, 1 beat', !!b6 && !b6.card && b6.kind === 'engage' && b6.dur === BEAT, JSON.stringify(b6));
    await page.waitForTimeout(1200);
    ok('B7 nothing threw', d.errs.length === 0, d.errs.length ? String(d.errs[0]).slice(0, 200) : 'no errors');
  } catch (e) { ok('the run [' + String(e && e.message).slice(0, 200) + ']', false); }
  try { await d.close(); } catch (e) {}
  console.log('THE MOMENTS BETWEEN: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
