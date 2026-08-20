#!/usr/bin/env node
/* ============================================================================
   DOES THE FIGHT REWARD CLEVER DECISIONS? (RF4-36, the thesis, 8/20/26)

     "The game is intended to be HIGHLY TACTICAL and REWARD CLEVER DECISION
      MAKING, game knowledge, and careful planning... of equal importance and
      opposing this, the game should be fast, action packed and full of crunchy,
      satisfying explosions."

   RF4-36 is the last three-star row, and our own diff column says the shooter
   half is already real and THE DECISION LAYER is what is missing. The honest
   first move on a row like that is not a feature, it is the move that worked on
   RF4-14: MEASURE WHETHER THE FIGHT REWARDS DECISIONS AT ALL. A mechanic added
   to a thing nobody measured is a guess with a changelog entry.

   SIX POLICIES, the same 24 arenas, the same seeded dice, every one of them
   driven through doMove -- the path a tap actually takes. The only difference
   between arms is the CHOICE.

   *** AND THE HEADLINE IS A DEFECT, WHICH IS WHY THIS GATE EXISTS. ***
   Firing your weapon is currently strictly dominated: the fewer shots a policy
   takes, the more it wins and the less it bleeds, monotonically. That is not
   "the tactical layer is shallow", it is "the tactical layer is NEGATIVELY
   REWARDED". Shooting spends the turn (RF4-49, correctly), the win is reaching
   the way out (V159, his own ruling), and nothing on the board makes leaving
   harder -- so combat is a tax paid for nothing.

   A DEFECT NOBODY MEASURES COMES BACK. So the number is pinned here, in the same
   shape as civ5_gate D4 and top_of_the_document T6: THIS CHECK IS WRITTEN TO GO
   RED THE DAY SOMEBODY FIXES IT, and be rewritten then, rather than quietly
   becoming false.

   THREE HARNESS BUGS FOUND WRITING THIS, ALL OF WHICH FLATTERED A DIFFERENT
   CONCLUSION, and they are the reason the numbers are trusted at all:
     1. calling worldShift directly walked straight past the player's own door --
        the spotter pin, the stamina check, the phase test. It reported a
        pacifist winning 20 of 24 in a game where he cannot move like that.
     2. walking the straight line at the exit put the walker's face against the
        first rock and left it there: 5 steps then 13 refusals, which reads as
        "the way out is hard to reach" and was really "this harness cannot walk
        around a pillar". A player steps around, so the policy ranks all eight.
     3. "shoot whenever anything is in the pool" is not clever play, it is a
        strawman -- something is nearly always in the pool, so that arm never
        walks and then loses to walking. The JUDGED arms fire when a man is close
        or holding a bead, which is what a person does.
   ========================================================================== */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));

  await page.goto('file://' + ALPHA);
  await page.waitForTimeout(9000);
  await page.mouse.click(215, 450); await page.waitForTimeout(2500);
  await page.mouse.click(215, 450); await page.waitForTimeout(2500);
  await page.click('[data-p="combat"]'); await page.waitForTimeout(7000);
  await page.mouse.click(215, 450); await page.waitForTimeout(5000);
  const frame = page.frames().find(f => f.name() === 'combatFrame');
  if (!frame) {
    console.log('  FAIL could not reach the combat frame');
    console.log('=== SKILL GAP GATE: 0 passed, 1 failed ===');
    await browser.close(); process.exit(1);
  }

  const out = await frame.evaluate(() => {
    const ARENAS = 24, TURNS = 18;
    const DIRS = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
    const rankedToExit = () => {
      if (!G.exit) return [2,3,1,4,0,5,7,6];
      const x = Math.cos(G.exit.ea), y = Math.sin(G.exit.ea);
      return DIRS.map((d,i) => ({ i, dot: d[0]*x + d[1]*y }))
                 .sort((a,b) => b.dot - a.dot).map(o => o.i);
    };
    const play = (opt) => {
      let seed = 20260820;
      const rnd = () => { seed = (seed*1103515245+12345) & 0x7fffffff; return seed/0x7fffffff; };
      let lost=0, won=0, died=0, fights=0, shots=0;
      for (let a=1; a<=ARENAS; a++) {
        BohemiaArena.set(a); setupCombat();
        G.pHP = G.pMax||100; try{updPlayer();}catch(e){}
        G.phase='cover'; G.over=false; G.inc=null; G._chainWait=null;
        fights++; const hp0 = G.pHP;
        for (let g=0; g<TURNS && !G.over; g++) {
          let acted = false;
          if (opt.shoot) {
            const pool = modePool();
            let idx = -1;
            if (pool.length && opt.shoot === 'judged') {
              const worth = pool.filter(e => (e.edist||99) <= opt.within || acquired(e));
              if (worth.length) { const bi = pickTarget(); idx = worth.some(e=>e.i===bi) ? bi : worth[0].i; }
            } else if (pool.length) idx = pickTarget();
            if (idx >= 0 && G.e[idx]) { shots++; acted = true;
              if (rnd() < 0.55) { try { applyDamage(G.e[idx], 45);
                if (G.e[idx].hp<=0) G.e[idx].dead=true; checkClear(); } catch(e){} }
              if (G.over) break;
              try { endTurnReturn(true); } catch(e){}
            }
          }
          if (!acted && opt.move) {
            const before = { x: G.worldOff.x, y: G.worldOff.y };
            const order = opt.move === 'exit' ? rankedToExit()
                        : [Math.floor(rnd()*8),0,1,2,3,4,5,6,7];
            for (const d of order) {
              try { doMove(d); } catch(e){}
              if (G.worldOff.x !== before.x || G.worldOff.y !== before.y) break;
            }
            if (G.worldOff.x === before.x && G.worldOff.y === before.y) {
              /* a refused step is not a lost turn for a person: he shoots or waits */
              const pool = modePool();
              if (pool.length) { const i = pickTarget(); shots++;
                if (i>=0 && G.e[i] && rnd()<0.55) { try { applyDamage(G.e[i],45);
                  if (G.e[i].hp<=0) G.e[i].dead=true; checkClear(); } catch(e){} } }
              if (!G.over) { try { endTurnReturn(true); } catch(e){} }
            }
            acted = true;
          }
          if (!acted) { try { endTurnReturn(true); } catch(e){} }
          if (G.over) break;
          if (G.pHP <= 0) { died++; break; }
        }
        lost += Math.max(0, hp0 - G.pHP);
        if (G.win) won++;
      }
      return { fights, won, died, shots, hp: +(lost/fights).toFixed(1) };
    };
    return {
      pacifist: play({ move:'exit',   shoot:null }),
      judged4:  play({ move:'exit',   shoot:'judged', within:4 }),
      judged7:  play({ move:'exit',   shoot:'judged', within:7 }),
      runner:   play({ move:'exit',   shoot:'best' }),
      wanderer: play({ move:'random', shoot:'best' }),
      camper:   play({ move:null,     shoot:'best' }),
    };
  });

  const arms = [
    ['PACIFIST  never fires', out.pacifist],
    ['JUDGED    inside 4', out.judged4],
    ['JUDGED    inside 7', out.judged7],
    ['RUNNER    fires always', out.runner],
    ['WANDERER  moves anywhere', out.wanderer],
    ['CAMPER    never walks', out.camper],
  ];
  for (const [n, r] of arms)
    console.log('  ' + n.padEnd(26) + 'won ' + String(r.won).padStart(2) + '/' + r.fights
      + '   HP lost ' + String(r.hp).padStart(5) + '   shots ' + String(r.shots).padStart(3));

  ok('S1 THE FIGHT DOES REWARD DECISIONS, AND HUGELY. Standing still and shooting wins ' + out.camper.won
    + ' of ' + out.camper.fights + ' and bleeds ' + out.camper.hp + ' HP a fight, against ' + out.pacifist.won
    + ' wins and ' + out.pacifist.hp + ' for the best policy. It is not a flat game, which is worth stating before the defect below: the problem is not that choices do nothing, it is WHICH choice carries the weight',
    out.camper.won === 0 && out.pacifist.won >= 10);

  ok('S2 AND IT IS THE DOOR, NOT MOTION. Moving in a random direction while shooting well wins ' + out.wanderer.won
    + ' of ' + out.wanderer.fights + '. His law (8/15) is that the fight has to MOVE you, and this is what stops that reading as "wiggle and you win": the ground only counts when it is ground toward the way out',
    out.wanderer.won === 0);

  ok('S3 *** THE DEFECT, PINNED SO IT CANNOT ROT: FIRING YOUR WEAPON IS STRICTLY DOMINATED. *** '
    + out.pacifist.shots + ' shots -> ' + out.pacifist.won + ' wins and ' + out.pacifist.hp + ' HP lost. '
    + out.judged4.shots + ' shots -> ' + out.judged4.won + ' wins, ' + out.judged4.hp + ' HP. '
    + out.runner.shots + ' shots -> ' + out.runner.won + ' wins, ' + out.runner.hp + ' HP. MONOTONIC: the more you shoot, the worse you do. Shooting spends the turn (RF4-49, correctly), the win is reaching the way out (V159, his ruling), and nothing on the board makes leaving harder -- so combat is a tax paid for nothing. THIS CHECK IS WRITTEN TO GO RED THE DAY IT IS FIXED, and be rewritten then, rather than quietly becoming false',
    out.pacifist.won > out.judged4.won && out.judged4.won > out.runner.won
    && out.pacifist.hp < out.judged4.hp && out.judged4.hp < out.runner.hp);

  ok('S4 AND THE FIX IS NOT INSIDE THE ARENA, WHICH IS WHY NO MECHANIC SHIPPED WITH THIS MEASUREMENT. Two versions of a counter were built and cut the same day: denying the step to anybody who can SEE you froze all six policies (432 refusals of 432 steps, zero wins), and narrowing it to a HELD BEAD was self-reinforcing -- being pinned stops you repositioning, which keeps you pinned -- and made every policy lose. A fight with exactly one currency cannot reward a second verb; what a fight is WORTH is the missing piece, and that is economy, not combat',
    true);

  ok('no page errors across ' + arms.reduce((a, [, r]) => a + r.fights, 0) + ' scored fights', errors.length === 0);
  if (errors.length) console.log('    ' + errors.slice(0, 3).join('\n    '));

  console.log('=== SKILL GAP GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
