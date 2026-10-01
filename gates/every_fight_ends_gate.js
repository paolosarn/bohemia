#!/usr/bin/env node
/* ============================================================================
   EVERY FIGHT ENDS   (COMBAT lane, V239, rule 57)

   *** PAOLO 10/1, he played the demo: "I entered combat and it was so dog shit and then combat didn't
   end so I couldn't get back into the overworld." ***
   *** RULE 57: EVERY FIGHT ENDS AND RETURNS TO THE MAP: all down / all fled / your side down, then the
   map where you were. COMBAT owns the end condition; RUN [fight returns] owns the way back. ***

   On the one driver, in real fights on the house board, each ending is MADE and then the game's own end
   check is asked (the same checkClear every turn ends with):
     1. every man down -> the fight is over and won, with the way out still on the board;
     2. every man broke and ran out of his reach -> over and won;
     3. men running INSIDE his reach -> not over at once (V212's chase), but over within ROUT_TURNS turns;
     4. his side down -> over and lost;
     5. and the end goes out through the one door RUN listens on (one message per fight, win or loss).
   The control: on the build before V239, leg 1 is the bug he hit (over: false, the way out waiting).
   ========================================================================== */
const { open } = require('../tools/bohemia_drive_the_demo.js');

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? ' (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? ' (' + note + ')' : ''))); };

(async () => {
  const d = await open({ alpha: true });
  try {
    await d.page.evaluate(() => { window.__ends = []; window.addEventListener('message', ev => {
      try { const m = ev.data; if (m && typeof m === 'object' && /end|combat/i.test(JSON.stringify(m).slice(0, 200))) window.__ends.push(m); } catch (e) {} }); });
    await d.page.click('[data-p="combat"]').catch(() => {});
    await d.page.waitForTimeout(7000);
    let fr = null;
    for (let i = 0; i < 40 && !fr; i++) {
      for (const f of d.page.frames()) {
        try { if (await f.evaluate(() => typeof setupCombat === 'function' && typeof checkClear === 'function')) { fr = f; break; } } catch (e) {}
      }
      if (!fr) await d.page.waitForTimeout(500);
    }
    if (!fr) { ok('the fight answers', false); return; }
    ok('the fight answers', true);

    const R = await fr.evaluate(() => {
      const out = { v239: typeof ROUT_TURNS !== 'undefined', sent: { won: 0, lost: 0 } };
      const _send = sendCombatEnd; sendCombatEnd = function (win) { out.sent[win ? 'won' : 'lost']++; return _send.apply(this, arguments); };
      const fresh = s => { BohemiaArena.set(s); setupCombat(); G.phase = 'cover'; return G.e.filter(e => e && !e.dead).length; };
      /* 1. every man down */
      out.n1 = fresh(3); out.exit1 = !!G.exit;
      G.e.forEach(e => { if (e) { e.dead = true; e.hp = 0; } });
      try { checkClear(); } catch (e) { out.err1 = String(e); }
      out.all_down = { over: !!G.over, win: !!G.win };
      /* 2. every man broke and is out of his reach */
      fresh(4);
      G.e.forEach(e => { if (e) { e.fleeing = true; e.edist = 60; } });
      try { checkClear(); } catch (e) { out.err2 = String(e); }
      out.all_fled = { over: !!G.over, win: !!G.win };
      /* 3. running, inside his reach: the chase, then the end */
      fresh(5);
      let inReach = 0;
      G.e.forEach(e => { if (e) { e.fleeing = true; e.edist = 1.2; } });
      try { inReach = chaseable().length; } catch (e) {}
      try { checkClear(); } catch (e) { out.err3 = String(e); }
      out.chase_first = { over: !!G.over, inReach: inReach };
      let turns = 0;
      for (; turns < 12 && !G.over; turns++) { G.mTurn = (G.mTurn || 0) + 1; G.e.forEach(e => { if (e) e.edist = 1.2; }); try { checkClear(); } catch (e) {} }
      out.chase_end = { over: !!G.over, win: !!G.win, turns: turns };
      /* 4. his side down */
      fresh(6);
      try { loseGame(); } catch (e) { out.err4 = String(e); }
      out.down = { over: !!G.over, win: !!G.win };
      /* 5. his health at 0 and NOTHING called the loss (a damage path threw first): the next frame ends it */
      fresh(7);
      G.pHP = 0; try { draw(); } catch (e) { out.err5 = String(e); }
      out.silent = { over: !!G.over, win: !!G.win };
      sendCombatEnd = _send;
      return out;
    });
    await d.page.waitForTimeout(600);
    const ends = await d.page.evaluate(() => window.__ends.length);
    console.log('  ' + JSON.stringify(R) + ' messages ' + ends);

    ok('V239 is in the fight (the chase has a limit)', R.v239);
    ok('*** EVERY MAN DOWN ENDS THE FIGHT, AND HE WINS, even with the way out still on the board (the bug he hit: the board went quiet and waited) ***',
       R.all_down.over && R.all_down.win && R.exit1, JSON.stringify(R.all_down) + ', ' + R.n1 + ' men, way out on the board: ' + R.exit1);
    ok('*** EVERY MAN BROKE AND RAN OUT OF REACH: over, and won ***', R.all_fled.over && R.all_fled.win, JSON.stringify(R.all_fled));
    ok('men running inside his reach get the chase first (V212), not an instant end',
       R.chase_first.inReach > 0 && !R.chase_first.over, JSON.stringify(R.chase_first));
    ok('*** AND THE CHASE ENDS: within ROUT_TURNS turns the fight is over and won, never a quiet board forever ***',
       R.chase_end.over && R.chase_end.win && R.chase_end.turns <= 4, JSON.stringify(R.chase_end));
    ok('his side down: over, and lost', R.down.over && !R.down.win, JSON.stringify(R.down));
    ok('*** AND HIS SIDE DOWN IS A LOSS EVEN WHEN NOTHING CALLED IT: health 0 with the fight not over is ended by the next frame (V240; one fight in three sat 300 s like that) ***',
       R.silent.over && !R.silent.win, JSON.stringify(R.silent));
    ok('and every end goes out through the one door RUN listens on (sendCombatEnd, the V59 handoff): three wins and two losses sent',
       R.sent.won === 3 && R.sent.lost === 2, JSON.stringify(R.sent) + ', ' + ends + ' messages reached the page');
    ok('no page errors', d.errs.length === 0 && !R.err1 && !R.err2 && !R.err3 && !R.err4, d.errs.slice(0, 2).join(' ; '));
  } finally {
    console.log('=== EVERY FIGHT ENDS GATE: ' + pass + ' passed, ' + fail + ' failed ===');
    await d.close();
    process.exit(fail ? 1 : 0);
  }
})();
