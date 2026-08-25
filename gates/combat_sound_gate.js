#!/usr/bin/env node
/* ============================================================================
   WHAT A FIGHT SOUNDS LIKE (8/25/26, SOUND lane)

   THE DEMO CLIMAXES IN A FIGHT (the 7/24 demo-climax ruling), and combat is
   where most of this lane's approved sounds actually live: seventeen of them are
   reachable ONLY from that module. Not one has ever been listened to.

   gates/demo_sound_gate.js walks the day and proved the fight takes the MUSIC
   the instant a door starts one. That is the floor of the scene, not the scene.
   This drives the fight itself -- cover, pop into AIM, fire until the killshot,
   freeze -- and records every sound the combat module asks the shell for.

   IT DRIVES THE REAL PHASES, borrowed from gates/combat_runs_smoke.js, which
   proved that sequence works: setupCombat, doPop, fireNow. Calling the sound
   functions directly would prove nothing -- the question is whether FIGHTING
   makes the sounds, not whether the sounds exist.

   WHAT IT ASSERTS is narrow on purpose. Combat sounds are approved and wired;
   what has never been checked is that a fight REACHES them. So: firing has to
   be audible, and a kill has to be audible. Everything else is REPORTED, since
   a quiet beat in a fight can be design (the valley is meant to be sparse) and
   this gate should not invent policy about it.

   node gates/combat_sound_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const ROOT = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const BEATS = [];

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));

  /* THE RECORDER, in the SHELL. Combat is an iframe and asks for its sounds by
     posting BOHEMIA_SFX up the bus (sfxAsk), so the shell is where they land.
     Every hook calls through and returns the real value: a probe that swallows
     a sound would be measuring its own interference. */
  await page.addInitScript(() => {
    window.__HEARD = [];
    const note = (ev, how) => { try { window.__HEARD.push(how + ':' + ev); } catch (_e) { } };
    window.addEventListener('message', function (e) {
      try {
        const d = e && e.data; if (!d) return;
        if (d.type === 'BOHEMIA_SFX' && d.ev) note(d.ev, 'ask');
      } catch (_e) { }
    });
    let w = { sfx: false, sting: false }, musWas = null, fightWas = null;
    setInterval(() => {
      try {
        if (!w.sfx && typeof window.playSFX === 'function') {
          const real = window.playSFX;
          window.playSFX = function (ev) { note(ev, 'play'); return real.apply(this, arguments); };
          w.sfx = true;
        }
        if (!w.sting && window.STING && typeof window.STING.play === 'function') {
          const real = window.STING.play.bind(window.STING);
          window.STING.play = function (f) { note(f, 'sting'); return real.apply(null, arguments); };
          w.sting = true;
        }
        const playing = !!(typeof MUS !== 'undefined' && MUS.playing);
        const fighting = !!(window.FIGHTMUS && FIGHTMUS.on);
        if (musWas !== null && playing !== musWas) note(playing ? 'starts' : 'stops', 'music');
        if (fightWas !== null && fighting !== fightWas)
          note(fighting ? 'takes over for the fight' : 'hands back', 'music');
        musWas = playing; fightWas = fighting;
      } catch (_e) { }
    }, 140);
  });

  const drain = async (beat) => {
    const heard = await page.evaluate(() => {
      const h = window.__HEARD || []; window.__HEARD = []; return h.slice();
    });
    BEATS.push({ beat, heard });
    return heard;
  };

  try {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 3000);
    await page.click('#front').catch(() => { });
    await SETTLE(page, 3000);
    await drain('the shell, before combat is opened');

    await page.evaluate(() => {
      const t = document.querySelector('[data-p="combat"]');
      if (!t) throw new Error('the COMBAT tab is not in the bar');
      t.click();
    });
    await SETTLE(page, 4000);
    const f = page.frames().find(x => x.name() === 'combatFrame');
    ok('the COMBAT tab opens its frame (the surface his thumb reaches)', !!f);
    if (!f) { report(); await browser.close(); return; }
    const box = await (await page.$('#combatFrame')).boundingBox();
    if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await SETTLE(page, 5000);
    await drain('COMBAT opens');

    /* ---- the fight itself, phase by phase ------------------------------ */
    const setup = await f.evaluate(async () => {
      if (typeof setupCombat !== 'function') return { no: 'setupCombat missing' };
      setupCombat();
      if (G.e[0]) { G.e[0].ea = 0; G.e[0].edist = 6; G.e[0].gcov = 0; }
      G.phase = 'cover'; G.fireTarget = 0; G.popTarget = 0;
      await new Promise(r => setTimeout(r, 900));
      return { phase: G.phase, men: (G.e || []).length };
    });
    ok('a real fight is set up, with men in it (' + JSON.stringify(setup) + ')',
       !setup.no && setup.men > 0);
    await SETTLE(page, 600);
    await drain('HE IS IN COVER (' + (setup.men || 0) + ' of them out there)');

    await f.evaluate(async () => { doPop(); await new Promise(r => setTimeout(r, 900)); });
    await SETTLE(page, 600);
    await drain('HE POPS OUT AND AIMS');

    const shot = await f.evaluate(async () => {
      let t = 0;
      while (!G.ks && t++ < 10) {
        /* HOLD THE DIAL STILL. combat_runs_smoke leaves it moving at
           _angVel=0.01 and never reaches a killshot -- measured, ks=false there
           too, so this was never my gate being wrong. The kill zone is hZ=0.05
           wide, and a dial still travelling has drifted out of it by the time
           fireNow reads the angle. Zero velocity is dead centre, which is what
           a player is aiming for anyway, and it kills on the first shot. */
        G.angle = 0; G._angVel = 0; fireNow();
        if (!G.ks) await new Promise(r => setTimeout(r, 140));
      }
      return { ks: !!G.ks, shots: t };
    });
    await SETTLE(page, 900);
    const fireHeard = await drain('HE FIRES (' + shot.shots + ' shot(s) to the killshot)');
    /* THE TWO THAT CANNOT BE SILENT. A gun that makes no noise and a man who
       dies in silence are the two things a player would notice in the first
       ten seconds of the demo's climax. */
    ok('FIRING MAKES A SOUND (' + (fireHeard.join(', ') || 'SILENCE') + ')',
       fireHeard.length > 0);

    ok('the fight actually reached a killshot, so these lines are measurements '
      + 'and not untried beats', shot.ks === true);
    /* A MAN GOING DOWN IS HEARD ON THE SHOT THAT DOES IT, not after. The first
       version asserted this on the freeze beat below and went red on a build
       where `kill` had already played -- my beat boundary was wrong, not the
       game. You hear the kill as you fire; what follows is the held moment. */
    ok('AND A MAN GOING DOWN MAKES A SOUND, on the shot that does it ('
      + (fireHeard.join(', ') || 'SILENCE') + ')',
      fireHeard.some(h => /:kill\b/.test(h)));

    await SETTLE(page, 2600);
    await drain('THE KILLSHOT FREEZE (a held beat -- quiet is the point)');

    ok('and the page threw nothing while being listened to ('
      + (errs.slice(0, 2).join(' | ') || 'clean') + ')', errs.length === 0);
  } catch (e) {
    ok('the fight ran without throwing (' + String(e.message).slice(0, 120) + ')', false);
  }
  await browser.close();
  report();
})();

function report() {
  console.log('\n=== WHAT A FIGHT SOUNDS LIKE ===');
  let silent = 0;
  for (const b of BEATS) {
    const uniq = [...new Set(b.heard)];
    if (!uniq.length) silent++;
    console.log('  ' + (uniq.length ? '♪' : ' ') + ' ' + b.beat);
    console.log('      ' + (uniq.join(', ') || '-- silent --'));
  }
  console.log('\n  ' + (BEATS.length - silent) + ' of ' + BEATS.length
    + ' fight beats make a sound.');
  console.log('=== COMBAT SOUND: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
}
