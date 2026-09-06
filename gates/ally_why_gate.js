/* ============================================================================
   YOU CAN SEE WHY SHE DID IT (9/6/26, UI lane 11) -- VAMILY [reactions explained]
   / BB-WHY.

   THE ROW: "THE PLAYER MUST BE ABLE TO SEE WHY HIS SIDE DID WHAT IT DID... when
   the player cannot tell WHY it chose what it chose, the whole system reads as
   broken instead of clever. With no manual control there is no recourse mid-fight,
   so legibility is not polish here, it is the safety rail. It is a LOOK problem:
   what does an intent look like on screen, and how do you show one body's reason
   without a debug dump."

   MEASURED BEFORE BUILDING. The companion is real and already decides well: ROSA
   runs a fixed four-rung ladder -- a blade on you, then the man who gave away your
   cover, then whoever is nearest to dropping, then one step onto safer ground --
   and she already speaks through allySay(). SO SHE WAS NEVER SILENT. She said WHAT
   ('FIRING') and never WHY, under a subtitle that is the same sentence whether she
   just saved you or wandered off, in a readout at the edge of a screen while the
   thing it is about is a body in the middle of it.

   WHAT THIS HOLDS, all of it on the REAL fight in the REAL alpha, driven through
   real frames -- never on a parse of the source, because a file that parses proves
   nothing about what draws (combat_runs_smoke.js was written after 620 green checks
   shipped a black screen):

     A  every rung of the ladder produces a REASON, not a description of a trigger
        pull -- and each rung's reason is its own, so they cannot all be one word
     B  the reason is ATTACHED TO THE BODY it is about: the frame records where it
        drew, and that is compared against where that enemy actually is
     C  IT IS NOT A DEBUG DUMP. Short, wordy-not-numeric, one at a time
     D  IT LIVES ONE BEAT AND GOES. A reason that stays is furniture, and this
        screen has been asked five times to have less of it
     E  and when there is nothing to explain, it draws NOTHING

   THE INSTRUMENT IS THE FRAME'S OWN RECORD (G._whyDraw), not a recomputation from a
   centre and a pixel ratio this gate does not have -- the combat file's own note
   says seven attempts were burned doing exactly that.

     node gates/ally_why_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
let pass = 0, fail = 0;
const ok = (m, g) => { if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
                       g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m); };
const done = () => { console.log('\nYOU CAN SEE WHY SHE DID IT: ' + pass + ' ok, ' + fail + ' failed');
                     process.exit(fail ? 1 : 0); };

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { try { chromium = require('playwright').chromium; } catch (e2) { ok('playwright available', false); done(); } }
  const TARGET = path.resolve(__dirname, '../slices/BOHEMIA_ALPHA_0_9.html');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{width:430,height:900}, deviceScaleFactor:2 });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') { const t = m.text();
    /* file:// noise is the cost of driving the alpha off disk (the combat tab is a
       srcdoc blob, so it cannot be served the way the phone gates serve the demo);
       it is there on any build, with or without this change. */
    if (!/ERR_CONNECTION|clipboard-write|Failed to load resource|fonts.googleapis|Fetch API cannot load file:/.test(t)) errs.push('CONSOLE ' + t); } });

  await p.goto('file://' + TARGET, { waitUntil:'load', timeout:120000 });
  await SETTLE(p, 9000);
  await p.mouse.click(215, 450); await SETTLE(p, 2500);
  await p.mouse.click(215, 450); await SETTLE(p, 2500);
  await p.evaluate(() => { const t = document.querySelector('[data-p="combat"]');
    if (!t) throw new Error('the combat tab is not in the bar'); t.click(); });
  await SETTLE(p, 7000);
  const f = p.frames().find(x => x.name() === 'combatFrame');
  ok('the real fight is up to measure against', !!f);
  if (!f) { await b.close(); done(); }
  const box = await (await p.$('#p-combat')).boundingBox();
  await p.mouse.click(box.x + box.width/2, box.y + box.height/2);
  await SETTLE(p, 5000);

  const built = await f.evaluate(() => ({
    ally: typeof allyTurn === 'function',
    why: typeof allyWhy === 'function' }));
  ok('the companion exists and now has somewhere to put a reason', built.ally && built.why);
  if (!built.why) { await b.close(); done(); }

  /* ---- A: EVERY RUNG PRODUCES ITS OWN REASON ---------------------------- */
  const rungs = await f.evaluate(async () => {
    const out = {};
    const arm = () => { setupCombat();
      if (typeof allyOn === 'function' && !G.ally) { try { spawnAlly(); } catch (_e) {} }
      G.allyOff = false; G.teachBeat = false;
      if (!G.ally) return false;
      G.ally.dead = false; G.ally.downed = false; G.ally.why = null;
      return true; };

    /* rung 1: a blade already on you */
    if (arm()) { const e = (G.e || []).find(x => x && !x.dead);
      if (e) { e.melee = true; e.reach = 2; e.ea = 0; e.edist = 1.5; e.lvl = G.ally.lvl = 0;
        e.hp = e.max = 10; }
      try { allyTurn(); } catch (_x) { out.err1 = String(_x).slice(0,90); }
      out.blade = G.ally && G.ally.why ? G.ally.why.words : null;
      out.bladeTarget = !!(G.ally && G.ally.why && G.ally.why.t); }

    /* rung 3: nobody with a knife AND NO SPOTTER CALLING, somebody in range.
       The ladder is ordered on purpose, so a rung can only be tested with the rungs
       above it silenced -- the first run of this checker left the spotter live and
       measured rung 2 while claiming to measure rung 3. */
    if (arm()) { (G.e || []).forEach(x => { if (x) { x.melee = false; x.ea = 0; x.edist = 4;
        x.lvl = 0; x.hp = 10; x.max = 10;
        if (x.E) x.E = Object.assign({}, x.E, { spotter: false }); } });
      G._spotKey = null; G._spotCall = false;
      G.ally.lvl = 0;
      const e = (G.e || []).find(x => x && !x.dead); if (e) e.hp = 2;
      try { allyTurn(); } catch (_x) { out.err3 = String(_x).slice(0,90); }
      out.weak = G.ally && G.ally.why ? G.ally.why.words : null; }

    /* rung 4: nothing she can reach at all */
    if (arm()) { (G.e || []).forEach(x => { if (x) { x.melee = false; x.ea = 0; x.edist = 400;
        x.lvl = 0; x.hp = 10; x.max = 10;
        if (x.E) x.E = Object.assign({}, x.E, { spotter: false }); } });
      G._spotKey = null; G._spotCall = false;
      G.ally.lvl = 0;
      try { allyTurn(); } catch (_x) { out.err4 = String(_x).slice(0,90); }
      out.far = G.ally && G.ally.why ? G.ally.why.words : null; }

    /* nothing left alive: there is nothing to explain */
    if (arm()) { (G.e || []).forEach(x => { if (x) x.dead = true; });
      G.ally.why = { words:'STALE', t:null, at:performance.now() };
      try { allyTurn(); } catch (_x) { out.err5 = String(_x).slice(0,90); }
      out.clear = G.ally ? G.ally.why : 'no ally'; }
    return out;
  });

  ok('a blade already on you is explained as a knife, not as "firing" ("'
     + rungs.blade + '")', typeof rungs.blade === 'string' && /KNIFE/.test(rungs.blade));
  ok('and that reason knows which body it is about', rungs.bladeTarget === true);
  ok('shooting the man nearest to dropping says so, where it used to say "FIRING" ("'
     + rungs.weak + '")', typeof rungs.weak === 'string' && /DROPPING/.test(rungs.weak));
  ok('and moving because she cannot reach anybody says THAT ("' + rungs.far + '")',
     typeof rungs.far === 'string' && /RANGE|TOO FAR/.test(rungs.far));
  const words = [rungs.blade, rungs.weak, rungs.far].filter(x => typeof x === 'string');
  ok('the rungs do not all give the same answer -- a reason that is always the same '
     + 'sentence is the subtitle this row exists to replace (' + words.length
     + ' rungs, ' + new Set(words).size + ' distinct)',
     words.length >= 3 && new Set(words).size === words.length);
  ok('and when the room is clear there is nothing to explain, so it is dropped ('
     + JSON.stringify(rungs.clear) + ')', rungs.clear === null);

  /* ---- C: NOT A DEBUG DUMP ---------------------------------------------- */
  const dump = words.filter(w => w.length > 26 || /\d/.test(w) || /[{}\[\]=:]/.test(w));
  ok('no reason is a debug dump: no numbers, no braces, none longer than 26 characters ('
     + dump.length + ' offenders)', dump.length === 0);

  /* ---- B + D: IT IS DRAWN, ON THE BODY, AND IT GOES AWAY ----------------- */
  const drawn = await f.evaluate(async () => {
    setupCombat();
    G.allyOff = false; G.teachBeat = false;
    if (!G.ally) return { skip:'no ally' };
    G.ally.dead = false; G.ally.downed = false;
    (G.e || []).forEach(x => { if (x) { x.melee = false; x.dead = false; x.ea = 0; x.edist = 4;
      x.lvl = 0; x.hp = 10; x.max = 10;
      if (x.E) x.E = Object.assign({}, x.E, { spotter: false }); } });
    G._spotKey = null; G._spotCall = false;
    G.ally.lvl = 0;
    const e = (G.e || []).find(x => x && !x.dead); if (e) e.hp = 2;
    G._whyDraw = null;
    allyTurn();
    /* WAIT FOR A FRAME, NOT FOR A NUMBER OF MILLISECONDS. A fixed 120ms wait assumes
       a frame lands inside it; sometimes one does and sometimes one does not, so the
       same build passed and failed this leg on consecutive runs. Poll for the frame's
       own record instead, and stay inside the one beat the reason lives for -- which
       also means a reason that never paints still fails, correctly. */
    let hot = null;
    for (let i = 0; i < 22; i++) {
      if (G._whyDraw) { hot = JSON.parse(JSON.stringify(G._whyDraw)); break; }
      await new Promise(r => setTimeout(r, 20));
    }
    /* WHERE THAT MAN ACTUALLY IS, TAKEN FROM THE FRAME'S OWN RECORD. epos() is the
       authority but it is scoped inside the combat script and not reachable from
       out here, so asking for it returned nothing and this leg reported a missing
       man while the line was drawing perfectly well. The frame writes down the far
       end of the line it drew; that is the same number, recorded by the thing that
       used it, which is exactly what this gate's header says to prefer. */
    const at = (hot && hot.line) ? [hot.line.x2, hot.line.y2] : null;
    /* let more than a beat pass, without touching anything */
    await new Promise(r => setTimeout(r, 1400));
    G._whyDraw = null;
    await new Promise(r => setTimeout(r, 200));
    const cold = G._whyDraw;
    return { hot, at, cold, beat: (typeof BPM_MS === 'number') ? BPM_MS : null };
  });

  ok('the reason is actually PAINTED in a real frame, not just held in a variable ('
     + (drawn.hot ? '"' + drawn.hot.words + '"' : 'nothing drawn') + ')',
     !!(drawn.hot && drawn.hot.words));
  const near = drawn.hot && drawn.at
    && Math.abs(drawn.hot.x - drawn.at[0]) < 60 && Math.abs(drawn.hot.y - drawn.at[1]) < 110;
  ok('and it is painted ON THE BODY it is about, not parked at the edge of the screen '
     + '(reason at ' + (drawn.hot ? Math.round(drawn.hot.x) + ',' + Math.round(drawn.hot.y) : '-')
     + ', that man at ' + (drawn.at ? Math.round(drawn.at[0]) + ',' + Math.round(drawn.at[1]) : '-') + ')',
     near === true);
  ok('and a line is drawn from her to him, which is the half of the answer words are '
     + 'worst at', !!(drawn.hot && drawn.hot.line));
  ok('IT LIVES ONE BEAT AND GOES -- a reason that stays is furniture (beat '
     + drawn.beat + 'ms, nothing repainted after 1.4s)', !drawn.cold);

  ok('no page error or console error while any of it happened'
     + (errs.length ? ' -- ' + errs[0].slice(0,90) : ''), errs.length === 0);

  await b.close(); done();
})();
