/* ==========================================================================
   EVERY FIGHT HANDS HIM BACK TO THE MAP  (RUN, 10/1/26, VAMILY [fight returns], rule 57)

   PAOLO 10/1, having played the demo: "I entered combat and it was so dog shit and then
   combat didn't end so I couldn't get back into the overworld bro."

   REPRODUCED ON THE DEMO BEFORE ANYTHING WAS WRITTEN (a road party's fight, the game's own
   roadContactFight, the toll crew): 60 s of SHOOT and 60 s of RUN, no end, no end message.
   One GOON at long range in the dark: the first shot misses OUT OF RANGE, SHOOT leaves the
   ring, "he hits you 0%", and he never closes. A road fight has a WAY OUT, and while it has
   one, putting everyone down is not the win; reaching it is. Nothing on the screen says so
   except "WAY OUT 4T". Walking to it with the ring ends the fight in two moves.
   THE RETURN (RUN's half) was never the fault: won, lost or walked out, the shell puts him
   back on the map on the block he left within a second. The end condition (the passive goon,
   the dead SHOOT, the untaught way out) is COMBAT's and is routed there with these numbers.

   LEGS, on the baked demo (which opens on the map):
     F1  a road party's fight opens from the map: the fight is on screen, the map is not
     F2  *** WALKING TO THE WAY OUT ENDS IT ***, with real taps on the ring, as a player
     F3  he is back on the MAP, on the block he left, and the fight is gone
     F3b and the way home takes under 3 s from the fight's own end. IT TOOK 10 TO 11 S: the tab
         re-baked his body and the whole cast on the one thread before anything else ran, so
         every won or lost fight froze on its last frame -- "combat didn't end", seen from the
         chair. Measured, fixed in the shell (__THE_WAY_HOME_IS_INSTANT__), now 0.8 s.
     F4  the result is written down (the shell's outcome and the map's day line)
     F5  a fight he LOSES hands him back too (the fight's own loseGame, said plainly)
     F6  a fight he CLEARS hands him back too (the fight's own winGame, said plainly)
     F7  and the road can bring the next fight: the one-fight-per-step latch opens on the
         next step
     NOTE (printed, routed to COMBAT, not a leg of this lane): 30 s of SHOOT and FIRE only.

   node gates/every_fight_hands_him_back_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('EVERY FIGHT HANDS HIM BACK: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const DIRS = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];

const shell = (d) => d.page.evaluate(() => {
  const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(); const st = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden'; };
  return { inFight: !!CITYFIGHT, fight: vis(document.getElementById('combatFrame')), map: vis(document.getElementById('cityFrame')),
    result: (G.lastEncounter && G.lastEncounter.result) || null };
});
const startRoadFight = (d) => d.fr.evaluate(async () => {
  /* the camera comes back in over about a second after a fight, and the one door refuses a
     fight while it moves; the road just tries again next step. Wait for it, as the road does. */
  for (let i = 0; i < 40 && FZOOMING; i++) await new Promise(r => setTimeout(r, 250));
  try { stepOnce(0); stepOnce(4); } catch (_e) {}   /* a step opens the one-fight latch, as a footfall does */
  return { started: roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 }), at: [city.x, city.y] };
});
const fightFrame = async (d) => { const h = await d.page.$('#combatFrame'); return { f: await h.contentFrame(), box: await h.boundingBox() }; };
const waitHome = async (d, ms, from) => { const t0 = from || Date.now(); let s;
  while (Date.now() - t0 < ms) { s = await shell(d); if (!s.inFight && s.map && !s.fight) return { s, ms: Date.now() - t0 }; await d.page.waitForTimeout(100); }
  return { s, ms: null }; };
/* how long the way home may take, from the fight's own end to the map on screen. It was 10 to
   11 s (the tab re-baked his body and the whole cast on the one thread); it is under one now. */
const HOME_MS = 3000;

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  try {
    await d.page.waitForTimeout(1500);
    /* ---- the walk-out, as a player ---- */
    const st = await startRoadFight(d);
    await d.page.waitForTimeout(4000);
    const s1 = await shell(d);
    ok('F1 a road party\'s fight opens from the map (fight on screen ' + s1.fight + ', map ' + s1.map + ')', st.started && s1.inFight && s1.fight && !s1.map);

    const { f: cf, box } = await fightFrame(d);
    await cf.evaluate(() => { const w = window.winGame; window.winGame = function () { window.__T_END = Date.now(); return w.apply(this, arguments); }; });
    let last = null, bad = new Set(), moves = 0, ended = false;
    for (let k = 0; k < 30 && !ended; k++) {
      const s = await cf.evaluate(() => ({ over: G.over, ea: G.exit ? G.exit.ea : null, ed: G.exit ? G.exit.edist : null,
        segs: [...document.querySelectorAll('#padring g.pb')].map(g => { const r = g.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }) }));
      if (s.over || !(await shell(d)).inFight) { ended = true; break; }
      if (s.ea == null || s.segs.length !== 8) { await d.page.waitForTimeout(600); continue; }
      if (last && s.ed >= last.ed - 0.01) bad.add(last.i); else bad = new Set();
      const ex = Math.cos(s.ea), ey = Math.sin(s.ea);
      const i = DIRS.map((v, j) => [j, (v[0] * ex + v[1] * ey) / Math.hypot(v[0], v[1])])
        .filter(x => !bad.has(x[0])).sort((a, b) => b[1] - a[1])[0][0];
      await d.page.touchscreen.tap(box.x + s.segs[i][0], box.y + s.segs[i][1]);
      moves++; last = { i, ed: s.ed };
      await d.page.waitForTimeout(900);
    }
    const h0 = await waitHome(d, 15000);
    const tEnd = await cf.evaluate(() => window.__T_END || null).catch(() => null);
    const h1 = { s: h0.s, ms: (h0.ms !== null && tEnd) ? Math.max(0, Date.now() - tEnd) : null };
    ok('*** F2 WALKING TO THE WAY OUT ENDS THE FIGHT *** (' + moves + ' taps on the ring)', moves > 0 && h0.ms !== null && !!tEnd);
    const back = await d.fr.evaluate(() => ({ at: [city.x, city.y], mode: MODE, q: ((document.getElementById('qline') || {}).textContent || '').slice(0, 60) }));
    ok('*** F3 HE IS BACK ON THE MAP, ON THE BLOCK HE LEFT *** (' + JSON.stringify(st.at) + ' -> ' + JSON.stringify(back.at) + ', '
      + back.mode + ')', back.mode === 'city' && back.at[0] === st.at[0] && back.at[1] === st.at[1] && h1.s && h1.s.map && !h1.s.fight);
    ok('*** F3b AND THE WAY HOME TAKES UNDER ' + (HOME_MS / 1000) + ' S *** (' + h1.ms + ' ms from the fight\'s end to the map; it was 10 to 11 s)', h1.ms !== null && h1.ms <= HOME_MS);
    ok('F4 the result is written down (' + (h1.s && h1.s.result) + '; the map says "' + back.q + '")', h1.s && h1.s.result === 'win' && /walked out/i.test(back.q));

    /* ---- F7: the next step can meet the next fight ---- */
    const latch = await d.fr.evaluate(() => { const a = contactPosted(); try { stepOnce(0); } catch (_e) {} return [a, contactPosted()]; });
    ok('F7 the road can bring the next fight (the latch ' + (latch[0] ? 'set' : 'open') + ' after the fight, ' + (latch[1] ? 'still set' : 'open') + ' after one step)', latch[1] === false);

    /* ---- F5, F6: lose and clear, through the fight's own endings ---- */
    for (const [leg, how, want] of [['F5', 'loseGame', 'loss'], ['F6', 'winGame', 'win']]) {
      const s0 = await startRoadFight(d);
      await d.page.waitForTimeout(4000);
      const { f } = await fightFrame(d);
      const was = await shell(d);
      const tCall = Date.now();
      await f.evaluate((how) => { window[how](); }, how);   /* the fight's own ending, the one a lost or cleared fight calls */
      const h = await waitHome(d, 15000, tCall);
      const at = await d.fr.evaluate(() => [city.x, city.y]);
      ok(leg + ' a fight he ' + (want === 'loss' ? 'LOSES' : 'CLEARS') + ' hands him back to the map too, in under ' + (HOME_MS / 1000) + ' s (through the fight\'s own ' + how
        + '; back in ' + h.ms + ' ms, ' + (h.s && h.s.result) + ')', s0.started && was.inFight && h.ms !== null && h.ms <= HOME_MS && h.s.result === want && at[0] === s0.at[0] && at[1] === s0.at[1]);
    }

    /* ---- NOTE for COMBAT: a player who only shoots ---- */
    const s3 = await startRoadFight(d);
    await d.page.waitForTimeout(4000);
    const { f: cf3, box: b3 } = await fightFrame(d);
    let ends = false, shots = 0;
    for (let k = 0; k < 30 && !ends; k++) {
      const b = await cf3.evaluate(() => { for (const re of [/^FIRE$/i, /^SHOOT$/i]) { const e = [...document.querySelectorAll('button,div,span')].find(x => { const r = x.getBoundingClientRect(); return r.width > 10 && re.test((x.textContent || '').trim()); });
        if (e) { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; } } return null; });
      if (b) { await d.page.touchscreen.tap(b3.x + b[0], b3.y + b[1]); shots++; }
      await d.page.waitForTimeout(1000);
      ends = !(await shell(d)).inFight;
    }
    const why = await cf3.evaluate(() => ({ hp: (G.e || []).map(e => e.hp).join(','), turn: G.mTurn, read: ((document.body.innerText || '').match(/OUT OF RANGE|he hits you \d+%/g) || []).join(' / ') }));
    console.log('  NOTE for COMBAT (not this lane\'s leg): a player who only shoots, 30 s: ' + (ends ? 'the fight ENDED' : 'the fight did NOT end')
      + ' (' + shots + ' taps; enemy hp ' + why.hp + '; turn ' + why.turn + '; ' + why.read + ')' + (s3.started ? '' : ' [the fight did not start]'));

    ok('nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 100) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
  }
  await d.close();
  done();
})();
