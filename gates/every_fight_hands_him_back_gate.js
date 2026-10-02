/* ==========================================================================
   EVERY FIGHT HANDS HIM BACK TO THE MAP  (RUN, 10/1/26, VAMILY [fight returns], rule 57;
   RE-AIMED 10/2 to the REBUILT fight, rule 63, [fold the loop])

   PAOLO 10/1, having played the demo: "I entered combat and it was so dog shit and then
   combat didn't end so I couldn't get back into the overworld bro."
   PAOLO 10/2: "start combat over from the ground up... re-create Battle Brothers combat."

   10/1 (the frozen fight): a road fight never ended for a player who only shot, and every fight
   that did end froze 10 to 11 s on its last frame (the tab re-baked his body and the cast on
   the one thread). The way home was fixed in the shell (__THE_WAY_HOME_IS_INSTANT__).
   10/2: COMBAT rebuilt the fight in one file (slices/BOHEMIA_FIGHT.html) and the shell now opens
   THAT for every fight the map starts (__THE_NEW_FIGHT_IS_THE_FIGHT__). It has no way out:
   it ends when one side is down or broken, and it says so on a card for four beats. So the
   walk-out legs became a whole fight played to its end.

   LEGS, on the baked demo (which opens on the map):
     F1  a road party's fight opens THE REBUILT FIGHT from the map (it is on screen, the map is
         not, the frozen fight is not opened), on a board the fight deals led by the KIND of the
         block he is standing on
     F2  *** A WHOLE FIGHT PLAYS TO ITS END *** with a real tap on AUTO (the beat run six times
         fast so a gate fits, the way COMBAT's own gate runs it)
     F3  he is back on the MAP, on the block he left, and the fight is gone
     F3b and the way home takes under 3 s from the fight's own end (its card is up four beats;
         the frozen fight's way home took 10 to 11 s until 10/1)
     F4  the result is written down (won or lost, who fell, the board)
     F5  a fight he LOSES hands him back too (the fight's own ending, said plainly)
     F6  a fight he CLEARS hands him back too, and a TAP ON THE CARD takes him home at once
     F7  and the road can bring the next fight: the one-fight-per-step latch opens on the
         next step
   node gates/every_fight_hands_him_back_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('EVERY FIGHT HANDS HIM BACK: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const SPEED = 6;   /* the fight's own fast-forward, as THE REBUILT FIGHT PLAYS runs it */

const shell = (d) => d.page.evaluate(() => {
  const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(); const st = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden'; };
  const p = document.getElementById('p-combat');
  return { inFight: !!CITYFIGHT, fight: vis(document.getElementById('fightFrame')) && !!(p && p.classList.contains('on')),
    old: vis(document.getElementById('combatFrame')), map: vis(document.getElementById('cityFrame')),
    result: (G.lastEncounter && G.lastEncounter.result) || null, last: G.lastEncounter || null };
});
const startRoadFight = (d) => d.fr.evaluate(async () => {
  /* the camera comes back in over about a second after a fight, and the one door refuses a
     fight while it moves; the road just tries again next step. Wait for it, as the road does. */
  for (let i = 0; i < 40 && FZOOMING; i++) await new Promise(r => setTimeout(r, 250));
  try { stepOnce(0); stepOnce(4); } catch (_e) {}   /* a step opens the one-fight latch, as a footfall does */
  const t = om.at(city.x, city.y);
  return { started: roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 }), at: [city.x, city.y], district: t ? t.district : null };
});
/* the rebuilt fight's frame, once its ground has loaded */
const fightFrame = async (d) => {
  for (let i = 0; i < 100; i++) {
    const h = await d.page.$('#fightFrame');
    if (h) { const f = await h.contentFrame();
      if (f) { const ready = await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && typeof FIGHT !== 'undefined' && !!FIGHT.S.board).catch(() => false);
        if (ready) return { f, box: await h.boundingBox() }; } }
    await d.page.waitForTimeout(200);
  }
  return { f: null, box: null };
};
const waitHome = async (d, ms, from) => { const t0 = from || Date.now(); let s;
  while (Date.now() - t0 < ms) { s = await shell(d); if (!s.inFight && s.map && !s.fight) return { s, ms: Date.now() - t0, homeWall: await d.page.evaluate(() => NF.homeWall || Date.now()) }; await d.page.waitForTimeout(100); }
  return { s, ms: null }; };
const HOME_MS = 3000;

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  try {
    await d.page.waitForTimeout(1500);
    /* ---- F1, F2: a whole fight, as a player ---- */
    const st = await startRoadFight(d);
    const { f: cf, box } = await fightFrame(d);
    const s1 = await shell(d);
    const want = await d.page.evaluate((dd) => nfKind(dd), st.district);
    const bd = cf ? await cf.evaluate(() => ({ name: FIGHT.S.board, kinds: (FIGHT.S.boardDef && FIGHT.S.boardDef.kinds) || [] })) : { name: null, kinds: [] };
    const board = bd.name;
    ok('F1 a road party\'s fight opens THE REBUILT FIGHT (on screen ' + s1.fight + ', map ' + s1.map + ', frozen fight ' + s1.old + '), dealt "' + board
      + '", led by the ' + want + ' kind of the ' + st.district + ' block he stands on', st.started && s1.inFight && s1.fight && !s1.map && !s1.old && !!cf && bd.kinds.indexOf(want) >= 0);

    let tEnd = null, played = null;
    if (cf) {
      await cf.evaluate((sp) => { FIGHT_UI.speed = sp; }, SPEED);
      const b = await cf.evaluate(() => { const r = document.getElementById('bauto').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
      await d.page.touchscreen.tap(box.x + b[0], box.y + b[1]);   /* a real finger on AUTO */
      const auto = await cf.evaluate(() => FIGHT_UI.auto);
      const t0 = Date.now();
      while (Date.now() - t0 < 150000) { const o = await cf.evaluate(() => FIGHT.S.over).catch(() => true); if (o) break; await d.page.waitForTimeout(500); }
      played = await cf.evaluate(() => ({ over: FIGHT.S.over, result: FIGHT.S.result, rounds: FIGHT.S.round })).catch(() => null);
      ok('*** F2 A WHOLE FIGHT PLAYS TO ITS END *** (AUTO by a real tap ' + auto + '; ' + (played ? played.result + ' in ' + played.rounds + ' rounds' : 'no end') + ')', auto && played && played.over);
    } else ok('*** F2 A WHOLE FIGHT PLAYS TO ITS END *** (no fight frame)', false);

    const h0 = await waitHome(d, 15000);
    tEnd = await d.page.evaluate(() => NF.overWall || null);   /* the shell heard the fight's end then */
    const ms = (h0.ms !== null && tEnd) ? Math.max(0, h0.homeWall - tEnd) : null;
    const back = await d.fr.evaluate(() => ({ at: [city.x, city.y], mode: MODE }));
    ok('*** F3 HE IS BACK ON THE MAP, ON THE BLOCK HE LEFT *** (' + JSON.stringify(st.at) + ' -> ' + JSON.stringify(back.at) + ', ' + back.mode + ')',
      back.mode === 'city' && back.at[0] === st.at[0] && back.at[1] === st.at[1] && h0.s && h0.s.map && !h0.s.fight);
    ok('*** F3b AND THE WAY HOME TAKES UNDER ' + (HOME_MS / 1000) + ' S *** (' + ms + ' ms from the fight\'s end to the map, its card up four beats of that)', ms !== null && ms <= HOME_MS);
    const le = h0.s && h0.s.last;
    ok('F4 the result is written down (' + JSON.stringify(le && { result: le.result, fell: le.fellOfYours, dead: le.dead, ran: le.fled, board: le.board }) + ')',
      !!le && le.newFight && le.result === (played && played.result === 'won' ? 'win' : 'loss') && le.board === board);

    /* ---- F7: the next step can meet the next fight ---- */
    const latch = await d.fr.evaluate(() => { const a = contactPosted(); try { stepOnce(0); } catch (_e) {} return [a, contactPosted()]; });
    ok('F7 the road can bring the next fight (the latch ' + (latch[0] ? 'set' : 'open') + ' after the fight, ' + (latch[1] ? 'still set' : 'open') + ' after one step)', latch[1] === false);

    /* ---- F5, F6: lose and clear, through the fight's own ending ---- */
    for (const [leg, how, wantR] of [['F5', 'lost', 'loss'], ['F6', 'won', 'win']]) {
      const s0 = await startRoadFight(d);
      const { f, box: b2 } = await fightFrame(d);
      const was = await shell(d);
      if (!f) { ok(leg + ' the fight opened', false); continue; }
      const tCall = Date.now();
      await f.evaluate((how) => { FIGHT.S.over = true; FIGHT.S.result = how; showOver(how); }, how);   /* the card and message a finished fight shows */
      if (leg === 'F6') {   /* a finger on the card goes home at once */
        await d.page.waitForTimeout(300);
        const c = await f.evaluate(() => { const r = document.getElementById('over').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height * 0.3]; });
        await d.page.touchscreen.tap(b2.x + c[0], b2.y + c[1]);
      }
      const h = await waitHome(d, 15000, tCall);
      const at = await d.fr.evaluate(() => [city.x, city.y]);
      const lim = leg === 'F6' ? 1200 : HOME_MS;
      ok(leg + ' a fight he ' + (wantR === 'loss' ? 'LOSES' : 'CLEARS') + ' hands him back to the map too, in under ' + (lim / 1000) + ' s'
        + (leg === 'F6' ? ' WITH A TAP ON THE CARD' : '') + ' (back in ' + h.ms + ' ms, ' + (h.s && h.s.result) + ')',
        s0.started && was.inFight && h.ms !== null && h.ms <= lim && h.s.result === wantR && at[0] === s0.at[0] && at[1] === s0.at[1]);
    }

    ok('nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 100) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
  }
  await d.close();
  done();
})();
