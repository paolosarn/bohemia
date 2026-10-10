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

  /* ---- E6: THE REBUILT FIGHT'S OWN SOUNDS ARE REAL MATERIAL NOW, NOT SAND (SOUNDS,
     rule 54b, 10/4). slices/BOHEMIA_FIGHT.html had its own placeholder tone()/noise()
     for a shot, a hit, a fall, a miss and the recap -- a second, unapproved sound
     system sitting inside the rebuilt fight. Each of those is now a postMessage to
     the parent's one real engine, carrying an event this lane already shipped
     elsewhere (shot, swing_air, hit, melee_hit, vital, hurt, miss, kill, went_down,
     clear). Exercised through the fight's own exported sfx(), the same function its
     game code calls, not a copy of it. */
  const fightSfxCheck = await p.evaluate(async () => {
    /* self-sufficient: opens its own fight rather than trusting E4's frame still to
       be alive, since nfHome() removes fightFrame on a timer E4's own cleanup starts. */
    try { if (window.nfOpen) nfOpen({ district: 'ruin', at: null, faction: null }); } catch (e) {}
    await new Promise(r => setTimeout(r, 300));
    const fr = document.getElementById('fightFrame');
    if (!fr || !fr.contentWindow || typeof fr.contentWindow.sfx !== 'function')
      return { ready: false };
    const calls = [];
    const orig = window.playSFX;
    window.playSFX = function (ev, when) { calls.push(ev); return orig(ev, when); };
    const want = ['shot', 'swing_air', 'hit', 'melee_hit', 'vital', 'hurt', 'miss', 'kill', 'went_down', 'clear'];
    want.forEach(ev => fr.contentWindow.sfx(ev));
    await new Promise(r => setTimeout(r, 200));
    window.playSFX = orig;
    return { ready: true, want: want, got: calls };
  });
  console.log('  rebuilt fight sfx bridge: ' + JSON.stringify(fightSfxCheck));
  ok('E6 *** THE REBUILT FIGHT TALKS TO THE ONE REAL ENGINE, EVERY NAMED EVENT. *** a shot, a hit (ranged and melee), a vital hit, hurt (your own side taking it), a miss, a kill, a struck-down and the recap all reach window.playSFX through the fight\'s own iframe boundary, which is how every other approved sound in this game already gets heard',
    fightSfxCheck.ready === true && fightSfxCheck.want && fightSfxCheck.got
      && fightSfxCheck.want.every(ev => fightSfxCheck.got.includes(ev)),
    'the fight\'s own sfx bridge is missing or incomplete: ' + JSON.stringify(fightSfxCheck));

  /* ---- E7: THE VALLEY SPEAKS ON THE MAP TOO (SOUNDS, row [the map's sounds], 10/5).
     AMB.tick() has checked only the RUN tab since before the MAP tab existed, so the
     wind, the generator and somebody's dog have never once played while he is actually
     travelling. MEASURED first: the city/run frame's heartbeat (BOHEMIA_WHERE) keeps
     arriving every ~4 s whichever tab is on screen, worst gap 11 s, always inside the
     12 s cutoff this bed already uses -- so the data was fresh the whole time and only
     the tab check was blind to the new tab. */
  const ambMapCheck = await p.evaluate(async () => {
    try { if (window.__AMB && !window.__AMB.seen) return { ready: false }; } catch (e) {}
    const AMB = window.__AMB;
    const mapTab = document.querySelector('.tab[data-p="map"]');
    if (mapTab) mapTab.click();
    await new Promise(r => setTimeout(r, 300));
    let renderCount = 0;
    const origRender = window.BOH_SFX && window.BOH_SFX.render;
    if (origRender) window.BOH_SFX.render = function () { renderCount++; return origRender.apply(this, arguments); };
    const origPick = AMB.pick;
    AMB.pick = function () { return this.kind; };
    AMB.next = Date.now() - 1;
    const runOn = !!document.querySelector('.tab[data-p="run"].on');
    const mapOn = !!document.querySelector('.tab[data-p="map"].on');
    const ageMs = Date.now() - AMB.seen;
    AMB.tick();
    if (origRender) window.BOH_SFX.render = origRender;
    AMB.pick = origPick;
    return { ready: true, runOn, mapOn, ageMs, renderCount };
  });
  console.log('  ambience on the map tab: ' + JSON.stringify(ambMapCheck));
  ok('E7 *** THE WIND, THE GENERATOR AND THE DOG NOW REACH THE MAP TAB TOO. *** AMB.tick() used to return before rendering anything unless the RUN tab carried class \'on\'; with only the MAP tab on screen and the city frame\'s report well inside its own 12 s freshness window, a due tick now renders',
    ambMapCheck.ready === true && ambMapCheck.mapOn === true && ambMapCheck.runOn === false
      && ambMapCheck.ageMs < 12000 && ambMapCheck.renderCount > 0,
    'the ambience bed is still blind to the map tab: ' + JSON.stringify(ambMapCheck));

  /* ---- E8: THE SETTLEMENT'S DOOR IS QUIETER AFTER DARK, AND NOTHING ELSE MOVED
     (SOUNDS, row [the settlement's sounds], 10/9). His sixth votes already asked for
     the valley's ambience turned down (AMB_TRIM, E5); this is the same shape for a
     sound that is only quieter in ONE CALLING CONTEXT, so the multiplier travels
     with the CALL (playSFX's third argument) and not with the event name -- the same
     door_open walking into any other building, in daylight, anywhere else in the
     valley, is untouched. */
  const nightTrimCheck = await p.evaluate(() => {
    const fn = window.__sfxMul;
    let night = null, day = null;
    try { night = fn({ gain: 1 }, 0.5); } catch (e) {}
    try { day = fn({ gain: 1 }, null); } catch (e) {}
    return { hasFn: typeof fn === 'function', nightGain: night && night.gain, dayGain: day && day.gain };
  });
  console.log('  night trim: ' + JSON.stringify(nightTrimCheck));
  ok('E8 *** A SOUND CAN BE QUIETER FOR ONE CALLER WITHOUT CHANGING FOR EVERY OTHER ONE. *** door_open at gain 1 with a 0.5 night multiplier renders at '
    + nightTrimCheck.nightGain + ' (half), the same call with no multiplier renders untouched at ' + nightTrimCheck.dayGain,
    nightTrimCheck.hasFn && nightTrimCheck.nightGain === 0.5 && nightTrimCheck.dayGain === 1,
    'the per-call night trim is missing or wrong: ' + JSON.stringify(nightTrimCheck));

  /* ---- E9: THE MAP SAYS WHEN A TOWN IS REACHED, AND THE VALLEY ANSWERS ONCE
     (SOUNDS, row [the map's sounds], round three 10/9). RUN's [the map hears]
     (10/9) now posts `arriving` on the real BOHEMIA_MAP_STATE bridge; before this
     round nothing listened, so the row's own "arriving at a settlement" line had
     never fired on a real arrival, only on AMB.tick()'s random clock. CHECKED FRESH
     BEFORE WIRING ANYTHING: dog_far is DOWN on all five candidates (records/
     BOHEMIA_SFX_VERDICT_8_12_26.txt, GRAVEYARD IS FINAL), so only generator plays
     here -- the row named two sounds, his own vote already killed one of them. */
  const arriveCheck = await p.evaluate(async () => {
    const calls = [];
    let origRender = null;
    try { origRender = BOH_SFX.render;
      BOH_SFX.render = function (v) { calls.push(v && v.ev); return origRender.apply(this, arguments); }; } catch (e) {}
    window.postMessage({ type: 'BOHEMIA_MAP_STATE', seq: 1, arriving: { name: 'Town A', seq: 42, ago: 10 } }, '*');
    await new Promise(r => setTimeout(r, 300));
    window.postMessage({ type: 'BOHEMIA_MAP_STATE', seq: 2, arriving: { name: 'Town A', seq: 42, ago: 20 } }, '*');
    await new Promise(r => setTimeout(r, 300));
    const afterRepeat = calls.length;
    window.postMessage({ type: 'BOHEMIA_MAP_STATE', seq: 3, arriving: { name: 'Town B', seq: 43, ago: 0 } }, '*');
    await new Promise(r => setTimeout(r, 300));
    try { BOH_SFX.render = origRender; } catch (e) {}
    return { calls, afterRepeat, arrivedSeq: window.__AMB && window.__AMB.arrivedSeq,
      arriveLog: window.__ambArriveLog, dogPool: window.__sfxPool ? window.__sfxPool('dog_far') : null };
  });
  console.log('  arrival sting: ' + JSON.stringify(arriveCheck));
  ok('E9 *** REACHING A NEW TOWN PLAYS THE GENERATOR ONCE, A REPEAT OF THE SAME ARRIVAL PLAYS NOTHING, AND THE DEAD DOG STAYS DEAD. *** '
    + arriveCheck.calls.length + ' render call(s) across two real arrivals (' + arriveCheck.calls.join(',') + '), '
    + arriveCheck.afterRepeat + ' call(s) survive a repeated seq, dog_far\'s own pool is ' + JSON.stringify(arriveCheck.dogPool),
    arriveCheck.calls.length === 2 && arriveCheck.calls.every(c => c === 'generator') && arriveCheck.afterRepeat === 1
      && arriveCheck.arrivedSeq === 43 && Array.isArray(arriveCheck.arriveLog) && arriveCheck.arriveLog.length === 2
      && Array.isArray(arriveCheck.dogPool) && arriveCheck.dogPool.length === 0,
    'the arrival sting is missing, double-fires, or reaches for the graveyarded dog: ' + JSON.stringify(arriveCheck));

  /* ---- E10: A PICKED BROADCAST REALLY PLAYS THROUGH THE REAL AMBIENCE PATH
     (SOUNDS, row [one song and the volumes], round three, 10/10). The constants
     and the filter order are checked against the module in cooked_sounds_gate.js;
     this is the half that gate cannot reach, because it renders offline and has
     no running page: does AMB.tick(), when pick() really returns
     'valley_broadcast', really call the real play function on the real page,
     through the real ambience bus. AMB.pick is swapped for the span of one tick
     only and restored immediately after, the same shape E9's postMessage probe
     already uses to drive a real decision without waiting on real chance.
     THE AMBIENCE OBJECT IS window.__AMB, NEVER THE BARE AMB (found standalone,
     not this gate's own fault): a second, unrelated `var AMB=[67,61,56]`
     further down the same file shadows the ambience object's own `var AMB={...}`
     by the time the page finishes loading, so the bare identifier is a palette
     array by the time any test can reach it. __AMB is the reference captured at
     the object's own construction, before the later var can shadow it, the
     exact reason onArrive's own E9 claim above already reads __AMB and not AMB.
     Named here as a bounce-back, not touched: a rename risks another lane's
     own array and is not this row's job. */
  const bcCheck = await p.evaluate(async () => {
    try { MUS.audio(); } catch (e) {}
    /* satisfy tick()'s own two gates without walking the title screen: a kind
       must be set (where() does this for real play) and some tab[data-p=run|map]
       must carry class 'on', the same state tick() itself reads off the DOM. */
    window.__AMB.where({ inside: false, night: false, district: null });
    let fakeTab = document.querySelector('.tab[data-p="run"]');
    let addedTab = false;
    if (!fakeTab) {
      fakeTab = document.createElement('div');
      fakeTab.className = 'tab on'; fakeTab.setAttribute('data-p', 'run');
      document.body.appendChild(fakeTab); addedTab = true;
    } else fakeTab.classList.add('on');
    const before = window.__broadcastPlayCount || 0;
    const origPick = window.__AMB.pick, origNext = window.__AMB.next, origSeen = window.__AMB.seen;
    window.__AMB.pick = function () { return 'valley_broadcast'; };
    window.__AMB.seen = Date.now();
    window.__AMB.next = 1;  /* truthy and in the past: the next tick fires at once */
    try { window.__AMB.tick(); } catch (e) {}
    await new Promise(r => setTimeout(r, 80));
    window.__AMB.pick = origPick; window.__AMB.next = origNext; window.__AMB.seen = origSeen;
    if (addedTab) fakeTab.remove();
    return { before, after: window.__broadcastPlayCount || 0,
      bandOrder: window.__BROADCAST && window.__BROADCAST.bandOrder,
      hasBuf: !!(window.__BROADCAST && window.__BROADCAST.buf) };
  });
  console.log('  broadcast dispatch: ' + JSON.stringify(bcCheck));
  ok('E10 *** A PICKED BROADCAST REALLY PLAYS, THROUGH THE REAL AMBIENCE PATH, ON THE REAL PAGE. *** '
    + (bcCheck.after - bcCheck.before) + ' play call(s) from one forced tick, filter order ' + bcCheck.bandOrder,
    bcCheck.after === bcCheck.before + 1 && bcCheck.bandOrder === 8 && bcCheck.hasBuf === true,
    'the dispatch from AMB.tick() to the real play function is missing or wrong: ' + JSON.stringify(bcCheck));

  /* ---- E11: THE BAR'S GLASS REALLY PLAYS THROUGH window.playSFX (SOUNDS,
     row [the soundscape], 10/10). settlement_screen_gate.js proves the bar's
     "Buy the crew a round" button posts {type:'BOHEMIA_SFX', ev:'bar_glass'}
     across the iframe boundary; cooked_sounds_gate.js proves the alpha's own
     BARGLASS object matches the module's constants. Neither proves the one
     thing that connects them: that window.playSFX('bar_glass'), the single
     entry point the postMessage bridge calls into (line ~23830), actually
     reaches the live object rather than falling through to the sample bank
     and returning nothing. Called directly, the same shape every other
     SFX-bank event already reaches playSFX through. */
  const bgCheck = await p.evaluate(() => {
    const before = window.__barGlassPlayCount || 0;
    try { window.playSFX('bar_glass'); } catch (e) {}
    return { before, after: window.__barGlassPlayCount || 0,
      hasBuf: !!(window.__BARGLASS && window.__BARGLASS.WOOD_E) };
  });
  console.log('  bar glass dispatch: ' + JSON.stringify(bgCheck));
  ok('E11 *** THE BAR\'S GLASS REALLY PLAYS, THROUGH window.playSFX, ON THE REAL PAGE. *** '
    + (bgCheck.after - bgCheck.before) + ' play call(s) from one direct dispatch',
    bgCheck.after === bgCheck.before + 1 && bgCheck.hasBuf === true,
    'playSFX(\'bar_glass\') did not reach the live object: ' + JSON.stringify(bgCheck));

  console.log('\nONE ENGINE GATE: ' + pass + ' passed, ' + fail + ' failed');
  await b.close();
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL gate threw: ' + e.message);
  console.log('ONE ENGINE GATE: 0 passed, 1 failed'); process.exit(1); });
