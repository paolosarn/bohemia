#!/usr/bin/env node
/* ============================================================================
   BOHEMIA ONE ENGINE GATE — ONLY ONE THING MAKES MUSIC, AND IT IS WHATEVER TAB
   HE IS LOOKING AT.  (8/26/26, COMBAT lane)

   THE LAW IS OLD AND IT HAD NO MACHINE.
   ONE ENGINE LAW (Paolo 7/3/26, crunch hunt): "the studio and combat never play
   at once; two unsynced drum machines FLAM INTO MUSH."
   It was written down, it was wired, and NOTHING CHECKED IT -- so when the shell
   grew tabs the condition silently aimed at the wrong one for weeks.

   PAOLO 8/26, playing: "when I'm playing the combat, bro, IT'S LIKE TWO SONGS AT
   THE SAME TIME. What the fuck is going on?" and "I can't even begin judging it
   because it sounds like shit."

   HE WAS RIGHT TWICE. Measured before anything was touched:
       on RUN, idle                    0.0 sound starts / s
       COMBAT open, idle               0.0
       IN A FIGHT                     22.9
       AFTER LEAVING COMBAT FOR RUN   19.9      <-- still playing

   THE CAUSE WAS ONE WORD. The shell read `if(t.dataset.p!=='music')` and posted
   mute:FALSE, so going to ANY tab that was not the studio TOLD COMBAT TO START
   PLAYING. Leaving a fight did not leak music, it ORDERED it.

   THIS GATE COUNTS SOUND, NOT CODE. It wraps createOscillator and
   createBufferSource in every frame and measures STARTS PER SECOND, because a
   music loop is fast and steady while a click is a blip -- and because a string
   check would have passed happily on the broken version for weeks, which is
   exactly what happened.

     node gates/one_engine_gate.js
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

let pass = 0, fail = 0;
function ok(claim, cond, detail) {
  if (cond) { pass++; console.log('  ok  ' + claim); }
  else { fail++; console.log('  FAIL ' + claim); if (detail) console.log('       ' + detail); }
}

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 430, height: 932 } });
  await p.addInitScript(() => {
    window.__AUD = { n: 0 };
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    for (const fn of ['createOscillator', 'createBufferSource']) {
      const orig = AC.prototype[fn];
      if (!orig) continue;
      AC.prototype[fn] = function () {
        const node = orig.apply(this, arguments);
        const st = node.start && node.start.bind(node);
        if (st) node.start = function () { window.__AUD.n++; return st.apply(this, arguments); };
        return node; };
    }
  });

  /* PER FRAME, KEYED FROM NODE. The shell and the combat frame are separate
     documents with separate audio engines, and the whole law is about WHICH ONE
     is making noise -- so a single total cannot answer it. An earlier probe read
     window.frameElement.name inside the iframe, got null for a srcdoc frame, and
     silently merged both engines into one column. */
  const perFrame = async () => { const out = { shell: 0, combat: 0 };
    const fs = p.frames();
    for (let i = 0; i < fs.length; i++) { try {
      const n = await fs[i].evaluate(() => (window.__AUD || {}).n || 0);
      out[i === 0 ? 'shell' : 'combat'] += n; } catch (e) {} }
    return out; };
  const rate = async (secs) => { const a = await perFrame();
    await p.waitForTimeout(secs * 1000); const c = await perFrame();
    return { shell: (c.shell - a.shell) / secs, combat: (c.combat - a.combat) / secs,
             both: (c.shell + c.combat - a.shell - a.combat) / secs }; };

  await p.goto(ALPHA); await p.waitForTimeout(9000);
  await p.mouse.click(215, 450); await p.waitForTimeout(2000);
  await p.mouse.click(215, 450); await p.waitForTimeout(3000);

  const idle = await rate(5);
  await p.click('[data-p="combat"]'); await p.waitForTimeout(6000);
  await p.mouse.click(215, 450); await p.waitForTimeout(5000);
  const inFight = await rate(7);
  await p.click('[data-p="run"]'); await p.waitForTimeout(4000);
  const afterLeaving = await rate(7);
  await p.click('[data-p="combat"]'); await p.waitForTimeout(4000);
  await p.mouse.click(215, 450); await p.waitForTimeout(4000);
  const backAgain = await rate(7);

  console.log('  sound starts per second, counted across every frame:'
    + '\n    on RUN, idle                 shell ' + idle.shell.toFixed(1) + '  combat ' + idle.combat.toFixed(1)
    + '\n    IN A FIGHT                   shell ' + inFight.shell.toFixed(1) + '  combat ' + inFight.combat.toFixed(1)
    + '\n    after leaving COMBAT         shell ' + afterLeaving.shell.toFixed(1) + '  combat ' + afterLeaving.combat.toFixed(1)
    + '\n    back in COMBAT               shell ' + backAgain.shell.toFixed(1) + '  combat ' + backAgain.combat.toFixed(1));

  ok('E1 *** COMBAT MUSIC DOES NOT FOLLOW HIM OUT OF THE COMBAT TAB. *** Leaving a fight for RUN measures '
    + afterLeaving.combat.toFixed(1) + ' sound starts a second out of the combat frame against ' + inFight.combat.toFixed(1)
    + ' during the fight. Before the fix this read 19.9 against 22.9, because the shell posted mute:FALSE on every tab that was not the STUDIO -- so leaving a fight did not LEAK music, it ORDERED it. The ONE ENGINE LAW (7/3/26) was written when the only rival engine was the studio and asked "is the studio open?" when it meant "IS COMBAT ON SCREEN?"',
    afterLeaving.combat < Math.max(2.5, inFight.combat * 0.15), 'combat music is still playing on another tab');

  ok('E2 AND THE FIGHT STILL HAS ITS MUSIC, both the first time and on the way back, because silence everywhere is not the fix. In a fight it measures '
    + inFight.combat.toFixed(1) + ' a second, and returning to combat measures ' + backAgain.combat.toFixed(1),
    inFight.combat > 5 && backAgain.combat > 5, 'combat lost its own music');

  ok('E3 *** AND THAT IS THE OTHER HALF OF HIS COMPLAINT: NO SECOND SONG UNDER THE FIGHT. *** "It\'s like TWO SONGS AT THE SAME TIME." While combat is on screen the SHELL measures '
    + inFight.shell.toFixed(1) + ' a second against the combat frame\'s ' + inFight.combat.toFixed(1)
    + '. The second song was the CITY SHUFFLE: the branch that silences it was guarded on MUS.playing, so if the studio was not running the shuffle walked straight into a fight. Opening COMBAT now stops the shuffle. AMENDED SAME DAY: the first cut also called MUS.stop() UNCONDITIONALLY, and MUS.stop() CUTS THE MASTER GAIN TO ZERO -- so opening combat reached into the studio engine even when it was not playing. Only what is actually making noise is stopped now. STOPPING A THING THAT IS NOT PLAYING IS NOT A NO-OP. NOTE THIS GATE DOES NOT ASSERT A SILENT RUN TAB -- RUN IS ALLOWED ITS OWN MUSIC (it measured ' + idle.shell.toFixed(1)
    + ' a second here). The law is ONE ENGINE AT A TIME, never "tabs are quiet", and the first write of this claim got that wrong and went red on correct behaviour',
    inFight.shell < Math.max(2.5, inFight.combat * 0.25));

  /* ---- E4: THE NEW FIGHT HAS ITS OWN DOOR, AND NFOPEN() NEVER WENT THROUGH THE
     CLICK HANDLER THIS WHOLE LAW LIVES IN (SOUNDS, rule 54b, 10/4). Every claim
     above opens combat by clicking the .tab element -- that is the OLD door, and
     its click listener is where V186's stand-down lives. showTabPanel(), the
     function the REBUILT fight's nfOpen() calls instead, only toggles CSS classes.
     MEASURED: calling nfOpen() left CITYMUS.on true and never touched FIGHTMUS at
     all -- the street shuffle rode straight through the rebuilt fight, the exact
     "two songs" complaint, through a door this gate never opened until now. */
  await p.click('[data-p="run"]'); await p.waitForTimeout(2000);
  const nfCheck = await p.evaluate(async () => {
    try { if (window.CITYMUS && !CITYMUS.on) CITYMUS.startShuffle(); } catch (e) {}
    await new Promise(r => setTimeout(r, 300));
    const cityOnBefore = !!(window.CITYMUS && CITYMUS.on);
    let opened = false;
    try { opened = !!(window.nfOpen && nfOpen({ district: 'ruin', at: null, faction: null })); } catch (e) {}
    await new Promise(r => setTimeout(r, 300));
    const cityOnAfter = !!(window.CITYMUS && CITYMUS.on);
    const fightOnAfter = !!(window.FIGHTMUS && FIGHTMUS.on);
    try { window.postMessage({ type: 'BOHEMIA_FIGHT_OVER', result: 'lost', rounds: 1 }, '*'); } catch (e) {}
    return { cityOnBefore, opened, cityOnAfter, fightOnAfter };
  });
  console.log('  nfOpen() door: ' + JSON.stringify(nfCheck));
  ok('E4 *** THE REBUILT FIGHT\'S OWN DOOR STANDS THE STREET DOWN TOO. *** nfOpen() is how a walked-into encounter opens the rebuilt fight. Before the fix this measured CITYMUS.on still true and FIGHTMUS.on still false after opening -- same bug as 8/26, on a door E1-E3 cannot see because it never clicks a .tab',
    nfCheck.opened === true && nfCheck.cityOnBefore === true && nfCheck.cityOnAfter === false && nfCheck.fightOnAfter === true,
    'nfOpen() left the street shuffle running: ' + JSON.stringify(nfCheck));

  /* ---- E5: THE AMBIENCE COMES DOWN (SOUNDS, rule 54b, 10/4). "Quieter please,
     it's loud." sign_alive, power_on and generator are TIER 1 ambience and nothing
     was ever pulling them down the way ROOM's own ratio pulls the room tone down.
     A ratio OVER the approved recipe, never a rewrite of it -- the recipe stays
     frozen and only playSFX's output changes. */
  const ambCheck = await p.evaluate(() => {
    const trim = window.__ambTrim || {};
    const fn = window.__sfxAmbTrim;
    let trimmed = null, untouched = null;
    try { trimmed = fn('power_on', { gain: 1 }); } catch (e) {}
    try { untouched = fn('equip', { gain: 1 }); } catch (e) {}
    return { trim, hasFn: typeof fn === 'function',
      trimmedGain: trimmed && trimmed.gain, untouchedGain: untouched && untouched.gain };
  });
  console.log('  ambience trim: ' + JSON.stringify(ambCheck));
  ok('E5 *** SIGN, BLOCK LIGHTS AND GENERATOR ARE QUIETER, AND NOTHING ELSE MOVED. *** playSFX applies a named ratio to these three ambience events only; power_on at gain 1 renders at ' + ambCheck.trimmedGain + ' (half), equip (not named) renders untouched at ' + ambCheck.untouchedGain,
    ambCheck.hasFn && ambCheck.trim.sign_alive === 0.5 && ambCheck.trim.power_on === 0.5 && ambCheck.trim.generator === 0.5
      && ambCheck.trimmedGain === 0.5 && ambCheck.untouchedGain === 1,
    'ambience trim missing or wrong: ' + JSON.stringify(ambCheck));

  console.log('\nONE ENGINE GATE: ' + pass + ' passed, ' + fail + ' failed');
  await b.close();
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL gate threw: ' + e.message);
  console.log('ONE ENGINE GATE: 0 passed, 1 failed'); process.exit(1); });
