/* BOHEMIA -- EYES AND EARS: WHAT THE GAME ACTUALLY ASKS FOR (lane 17, E4, 9/5/26)
 *
 * WHY THIS EXISTS. "Which of his 65 approved sounds does the game ever play?" cannot
 * be answered by reading the code, and this lane proved that the expensive way: a
 * text search said 50 events are never asked for, a better search said 56, and BOTH
 * ARE WRONG -- the footstep caller builds its event name by string concatenation
 * ('step_' + surface) and three call sites pass a variable. A name that is assembled
 * at run time is invisible to every grep ever written.
 *
 * So the game is RUN, playSFX is wrapped, and the sounds it asks for are counted.
 * One walk is not "everything that can ever fire", and this tool never says it is:
 * it reports what was asked for in N seconds of walking, and that is a floor, not a
 * census.
 *
 * USAGE:  node tools/bohemia_eyes_ears_live.js [--seconds 60] [--port 8099]
 */
'use strict';
const path = require('path');
const args = process.argv.slice(2);
const arg = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const SECONDS = parseInt(arg('--seconds', '60'), 10);
const PORT = arg('--port', '8099');

function pw() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
    '/usr/local/lib/node_modules']) {
    try { return require(require('path').join(g, 'playwright')); } catch (e) { }
  }
  return require('playwright');
}
const { chromium } = pw();

const PHONE = { viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext(PHONE);
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:${PORT}/slices/BOHEMIA_ALPHA_0_9.html`, { waitUntil:'domcontentloaded', timeout:120000 });
  await p.waitForTimeout(2500);
  await p.locator('#front').click({ timeout:30000 });
  await p.waitForTimeout(9000);

  const acNow = async (where) => {
    /* BARE NAME, NOT window.MUS. The music studio is declared with `const`, and a
       const at the top of a classic script is a GLOBAL BINDING BUT NOT A WINDOW
       PROPERTY. Reading window.MUS returns undefined while MUS works perfectly --
       which is how this harness reported "no AudioContext" through a whole walk and
       nearly turned a bug in itself into a finding about the game. */
    const st = await p.evaluate(() => { try { return (typeof MUS !== 'undefined' && MUS.AC) ? MUS.AC.state : 'no AudioContext'; } catch (e) { return 'MUS threw'; } });
    marks.push(where + ': ' + st); return st;
  };
  const marks = [];
  await acNow('right after the splash tap');

  /* GET UP FIRST. The first screen holds a card and a walk taken underneath it is a
     walk nobody takes: measured once without this and the game asked for ONE sound in
     45 seconds, because the player was still in bed. */
  for (const label of ['GET UP', 'NOT NOW']) {
    try { const el = await p.getByText(label, { exact:false }).first(); await el.click({ timeout:4000 }); await p.waitForTimeout(1200); } catch (_e) {}
    for (const fr of p.frames()) {
      try { const el = await fr.getByText(label, { exact:false }).first(); await el.click({ timeout:2500 }); await p.waitForTimeout(1200); } catch (_e) {}
    }
  }
  await p.waitForTimeout(2000);
  await acNow('after the cards are dismissed');

  /* WRAP, DO NOT REPLACE. The real function still runs, so the walk is the walk a
     player takes and not a walk with the sound removed. */
  await p.evaluate(() => {
    window.__SFX_ASKED = {};
    window.__SFX_RENDERS = 0; window.__STEP_CALLS = 0; window.__HOOKS = [];
    /* EVERY HOOK BY ITS BARE NAME, AND EVERY HOOK RECORDED. Two zeros in this tool's
       output were never measurements at all: the render counter and the footstep
       counter were read from variables NOTHING INCREMENTED, because the wraps that
       were supposed to set them had quietly stopped being in this file. A counter
       nobody increments reads zero forever and looks exactly like silence. */
    try { if (typeof BOH_SFX !== 'undefined' && BOH_SFX.render && !BOH_SFX.render.__w) {
      const real = BOH_SFX.render;
      const w = function () { window.__SFX_RENDERS++; return real.apply(this, arguments); };
      w.__w = true; BOH_SFX.render = w; window.__HOOKS.push('the audio bus'); } } catch (_e) {}
    try { if (typeof stepSfx === 'function' && !stepSfx.__w) {
      const realS = stepSfx;
      const w2 = function (surface) { window.__STEP_CALLS++;
        const ev = 'step_' + surface; window.__SFX_ASKED[ev] = (window.__SFX_ASKED[ev] || 0) + 1;
        return realS.apply(this, arguments); };
      w2.__w = true; window.stepSfx = w2; window.__HOOKS.push('the footsteps'); } } catch (_e) {}
    /* COUNT THE MESSAGE, NOT THE HANDLER. The city posts {type:'BOHEMIA_STEP'} on
       every walked cell and the shell decides what to do with it. Listening for the
       message answers "did he walk" without trusting any of the shell's own wiring. */
    window.__STEP_MSGS = 0;
    window.addEventListener('message', e => {
      try { const d = e.data; if (d && d.type === 'BOHEMIA_STEP') window.__STEP_MSGS++;
            if (d && d.bohemiaCitySfx) window.__CITY_SFX_MSGS = (window.__CITY_SFX_MSGS || 0) + 1; } catch (_e) {}
    });
    const wrap = () => {
      if (typeof window.playSFX !== 'function' || window.playSFX.__wrapped) return false;
      const real = window.playSFX;
      const w = function (ev, when) { try { window.__SFX_ASKED[ev] = (window.__SFX_ASKED[ev] || 0) + 1; } catch (_e) {} return real.apply(this, arguments); };
      w.__wrapped = true; window.playSFX = w; return true;
    };
    window.__SFX_WRAPPED = wrap();
  });

  /* AND PROVE HE MOVED, WITH THE OTHER INSTRUMENT. "Zero sounds" means nothing
     unless the walk was a walk: a picture before and a picture after, and the pixel
     count between them, so "the game is silent" cannot be confused with "my harness
     did not press anything". */
  await acNow('at the start of the walk');
  const before = await p.screenshot({ path: process.env.EARS_SHOT_A || undefined });

  /* WALK. Arrows plus taps on the movement ring, because the ring is what a thumb
     uses and the keyboard is what a laptop uses, and only one of them is the game. */
  const keys = ['ArrowUp','ArrowRight','ArrowDown','ArrowLeft'];
  const t0 = Date.now();
  let i = 0;
  while ((Date.now() - t0) / 1000 < SECONDS) {
    const k = keys[i++ % keys.length];
    try { await p.keyboard.press(k); } catch (_e) {}
    const fr = p.frames().find(f => /CITY_WORLD/.test(f.url()));
    if (fr) {
      try { const pads = await fr.$$('.pb'); if (pads.length) await pads[i % pads.length].click({ timeout:1500 }); } catch (_e) {}
    }
    await p.waitForTimeout(220);                    /* a step every fifth of a second */
  }
  await acNow('at the end of the walk');
  const after = await p.screenshot({ path: process.env.EARS_SHOT_B || undefined });
  const moved = (() => {                                  /* share of bytes that differ, cheap and honest */
    const n = Math.min(before.length, after.length);
    let d = 0; for (let k = 0; k < n; k += 7) if (before[k] !== after[k]) d++;
    return +(100 * d / (n / 7)).toFixed(1);
  })();
  /* THE POSITIVE CONTROL, AND NO ZERO FROM THIS TOOL MEANS ANYTHING WITHOUT IT.
     After the walk, one sound is fired by hand. If the counters do not move, they were
     blind, and the tool says so instead of reporting silence. */
  const control = await p.evaluate(async () => {
    const before = { r: window.__SFX_RENDERS, s: window.__STEP_CALLS };
    try { if (typeof stepSfx === 'function') stepSfx('asphalt'); } catch (_e) {}
    await new Promise(r => setTimeout(r, 400));
    return { movedRender: window.__SFX_RENDERS > before.r, movedStep: window.__STEP_CALLS > before.s,
             before, after: { r: window.__SFX_RENDERS, s: window.__STEP_CALLS } };
  });

  const asked = await p.evaluate(() => {
    /* WHY IT WAS SILENT MATTERS MORE THAN THAT IT WAS. Three different worlds look
       identical from outside: nobody asked for a sound; somebody asked and the bank
       was empty; somebody asked and the audio engine was never started. */
    let acState = 'no MUS', steps = null;
    try { acState = (typeof MUS !== 'undefined' && MUS.AC) ? MUS.AC.state : 'MUS with no AudioContext'; } catch (_e) {}
    try { steps = (typeof STEP_BANK !== 'undefined' && STEP_BANK) ? Object.keys(STEP_BANK).length : null; } catch (_e) {}
    return { wrapped: window.__SFX_WRAPPED, asked: window.__SFX_ASKED,
      renders: window.__SFX_RENDERS || 0, stepCalls: window.__STEP_CALLS || 0,
      audio: acState, stepBankEvents: steps,
      stepMsgs: window.__STEP_MSGS || 0, citySfxMsgs: window.__CITY_SFX_MSGS || 0,
      hooks: window.__HOOKS || [],
      approvedEvents: Object.keys((typeof __SFX_APPROVED !== 'undefined' && __SFX_APPROVED) || window.__SFX_APPROVED || {}).length };
  });
  await b.close();

  const names = Object.keys(asked.asked || {});
  console.log('playSFX wrapped:', asked.wrapped, '| approved events in the build:', asked.approvedEvents);
  console.log('THE AUDIO ENGINE, THROUGH THE RUN:');
  for (const m of marks) console.log('   ' + m);
  console.log('the screen changed by ' + moved + '% between the first frame and the last, so the walk '
    + (moved > 5 ? 'MOVED HIM' : 'may not have moved him at all'));
  console.log('hooks installed: ' + (asked.hooks || []).join(', ') || 'NONE');
  /* A CONTROL IS ONLY NEEDED WHEN THE ANSWER IS ZERO. And the render half of it can
     legitimately not move: stepSfx rate-limits itself to one footfall every 120 ms, so
     a control fired right after the last step of a walk is refused BY DESIGN. The
     footstep counter moving is what proves the chain is hooked. */
  const blind = (control.before.r === 0 && !control.movedRender) || (control.before.s === 0 && !control.movedStep);
  console.log('the control: firing one footstep by hand moved the footstep counter -- ' + control.movedStep
    + (control.movedRender ? ', and the bus counter too' : ', the bus counter was rate-limited (one footfall per 120 ms)')
    + (blind ? '\n   *** THE COUNTERS ARE BLIND, SO EVERY ZERO BELOW IS BLINDNESS AND NOT SILENCE ***' : ''));
  console.log('sounds actually rendered at the bus in that time: ' + (control.before.r)
    + '  | the audio engine was: ' + asked.audio
    + '  | the footstep bank holds ' + asked.stepBankEvents + ' events'
    + '  | the footstep function was called ' + control.before.s + ' times');
  console.log('the city told the shell he took a step ' + asked.stepMsgs + ' times, and asked it for a sound '
    + asked.citySfxMsgs + ' times');
  console.log('IN ' + SECONDS + ' SECONDS OF WALKING, THE GAME ASKED FOR ' + names.length + ' DIFFERENT SOUNDS:');
  for (const n of names.sort((a, b2) => asked.asked[b2] - asked.asked[a]))
    console.log('   ' + String(asked.asked[n]).padStart(4) + ' x ' + n);
  if (!names.length) console.log('   (nothing. either the walk did not move him, or the game asks for no sound at all)');
})().catch(e => { console.error(e); process.exit(1); });
