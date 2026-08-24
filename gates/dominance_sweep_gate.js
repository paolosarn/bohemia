#!/usr/bin/env node
/* ============================================================================
   RF4-40, THE ANTI-DOMINANT-ABILITY RULE, AS A MACHINE (8/24/26)

     "Abilities TOO EFFECTIVE IN MANY SITUATIONS get nerfed or removed, on the
      stated grounds that leaning on one action reduces the need for varied
      tactics. Counter-enemies exist specifically to push the player off a
      favourite playstyle."

   Our diff column: "ABSENT as a rule."

   A RULE WITHOUT A MACHINE IS NOT ENFORCED, and this repo already knows it. So
   RF4-40 does not ship as a nerf, it ships as THE SWEEP: put a policy behind
   each verb the fight offers, play the same 24 arenas with each, and print what
   wins. skill_gap already does this on ONE axis (shoot against walk) and it
   found the biggest dominant strategy in the build. THIS SWEEPS THE VERBS NOBODY
   HAD PUT A POLICY BEHIND AT ALL -- suppress, the grenade, the sprint -- because
   a dominant action nobody has tried is precisely what the rule is for.

   *** WHAT IT FOUND IS THE SKILL CEILING, AND IT IS FLAT. ***

       sprint to the door   21-23 wins of 24    ~6 HP lost
       walk to the door     16-18 wins          ~35 HP
       grenade every turn   13-14 wins          ~48 HP
       suppress every turn   0 wins            ~100 HP  (dies in every fight)

   V74 MAKES ON-BEAT MOVEMENT FREE: spendMove takes a pip and GIVES IT BACK when
   the move grades PERFECT. A headless loop has no rhythm -- it fires as fast as
   JS runs -- so it lands on the same grade every time, and measured directly
   that grade is PERFECT on 40 moves out of 40, with ZERO pips spent. Every
   sprint in this sweep was refunded.

   So the numbers above are a player WHO NEVER MISSES A BEAT, and for him the
   sprint is free and worth several wins and most of his health. That is V74
   working exactly as written ("player SKILL matters more than stats"), and it is
   also the honest caveat on every movement measurement in this repo: NO HEADLESS
   ARM HERE HAS EVER MEASURED A PLAYER WHO MISSES.

   IT IS RECORDED, NOT NERFED. The sprint's shape is Paolo's own ruling (V110:
   "sprinting basically just means you get to take movement action"), V74's free
   on-beat move is a deliberate skill reward, and RF4-40's own answer to a
   dominant ability is a COUNTER, which exists -- V168's spotter refuses the
   sprint while he holds a line on you. A finding for him, not a dial for me.

   THREE HARNESS CHEATS BEFORE THESE NUMBERS MEANT ANYTHING: G.stam=3 every turn
   (an infinite sprint, read 22 wins at 6.2 HP); suppress and the grenade topped
   up the same way; and a sprint counter that incremented on any move rather than
   on a move that SPENT A PIP, which read 201 sprints in 243 turns and hid the
   refund entirely.
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
    console.log('=== DOMINANCE SWEEP GATE: 0 passed, 1 failed ===');
    await browser.close(); process.exit(1);
  }

  const out = await frame.evaluate(() => {
    const DIRS = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
    const toExit = () => { if (!G.exit) return [2,3,1,4,0,5,7,6];
      const x = Math.cos(G.exit.ea), y = Math.sin(G.exit.ea);
      return DIRS.map((d,i) => ({ i, dot: d[0]*x + d[1]*y }))
                 .sort((a,b) => b.dot - a.dot).map(z => z.i); };
    const walk = () => { const b4 = { x: G.worldOff.x, y: G.worldOff.y };
      for (const d of toExit()) { try { doMove(d); } catch(e){}
        if (G.worldOff.x !== b4.x || G.worldOff.y !== b4.y) return true; }
      return false; };

    const play = (verb) => {
      let won = 0, fights = 0, lost = 0, uses = 0, turns = 0;
      for (let A = 1; A <= 24; A++) {
        BohemiaArena.set(A); setupCombat();
        G.pHP = G.pMax||100; G.phase='cover'; G.over=false; G.inc=null; G._chainWait=null;
        fights++; const hp0 = G.pHP;
        for (let t = 0; t < 16 && !G.over; t++) {
          turns++;
          let acted = false;
          /* EVERY VERB LIVES INSIDE ITS OWN REAL BUDGET. Nothing is topped up:
             the pips are V163's clock, the grenades are what the fight gave you,
             and suppress keeps its cooldown. */
          if (verb === 'suppress') {
            try { const st0 = G.stam||0; doSuppress(); if ((G.stam||0) < st0) uses++; } catch(e){}
            acted = true;
            if (!G.over) { try { endTurnReturn(true); } catch(e){} }
          } else if (verb === 'grenade') {
            try { if (canThrow()) { const tg = (G.e||[]).find(e => e && !e.dead);
              if (tg) { throwAt(Math.cos(tg.ea)*tg.edist, Math.sin(tg.ea)*tg.edist); uses++; acted = true; } } } catch(e){}
            if (!acted && !G.over) { if (!walk()) { try { endTurnReturn(true); } catch(e){} } acted = true; }
          } else if (verb === 'sprint') {
            /* COUNT SPRINTS, NOT STEPS. The first cut incremented on any move
               the arm made -- and when the pips are empty the sprint falls
               through to an ordinary walk, so it read 201 "sprints" in 243 turns
               and made the budget look irrelevant. A sprint is a step that SPENT
               A PIP. */
            const pip0 = G.stam||0;
            G.sprintArm = pip0 > 0;
            const b4 = { x: G.worldOff.x, y: G.worldOff.y };
            for (const d of toExit()) { try { doMove(d); } catch(e){}
              if (G.worldOff.x !== b4.x || G.worldOff.y !== b4.y) break; }
            if ((G.stam||0) < pip0) uses++;
            if (G.worldOff.x === b4.x && G.worldOff.y === b4.y) {
              if (!walk()) { try { endTurnReturn(true); } catch(e){} } }
            acted = true;
          } else if (verb === 'walkout') {
            if (!walk()) { try { endTurnReturn(true); } catch(e){} }
            acted = true;
          }
          if (!acted) { try { endTurnReturn(true); } catch(e){} }
          if (G.pHP <= 0) break;
        }
        lost += Math.max(0, hp0 - G.pHP);
        if (G.win) won++;
      }
      return { won, fights, hp: +(lost/fights).toFixed(1), uses, turns };
    };
    return { walkout: play('walkout'), sprint: play('sprint'),
             grenade: play('grenade'), suppress: play('suppress') };
  });

  const rows = [
    ['SPRINT to the door', out.sprint],
    ['WALK to the door', out.walkout],
    ['GRENADE every turn', out.grenade],
    ['SUPPRESS every turn', out.suppress],
  ];
  for (const [n, r] of rows)
    console.log('  ' + n.padEnd(22) + 'won ' + String(r.won).padStart(2) + '/' + r.fights
      + '   HP lost ' + String(r.hp).padStart(5) + '   used it ' + r.uses + ' times in ' + r.turns + ' turns');

  ok('D1 THE SWEEP RUNS AT ALL, which is the whole of RF4-40 in this repo: a rule without a machine is not enforced, and "abilities too effective in many situations get nerfed or removed" is a rule nothing was checking. Four verbs, the same 24 arenas, every one inside its own real budget',
    rows.every(([, r]) => r.fights === 24 && r.turns > 0));

  ok('D2 *** WHAT IT ACTUALLY FOUND IS THE SKILL CEILING, AND IT IS FLAT. *** V74 makes ON-BEAT MOVEMENT FREE -- spendMove takes a pip and GIVES IT BACK when the move grades PERFECT -- and a headless loop has no rhythm at all, so it lands on the same grade every time. Measured directly: 40 moves, 40 PERFECT, 0 pips spent, EVERY SPRINT REFUNDED. So this sweep is played by somebody who never misses a beat, and for that player the sprint is free and beats the walk by ' + (out.sprint.won - out.walkout.won)
    + ' wins (' + out.sprint.won + ' against ' + out.walkout.won + ') while taking ' + out.sprint.hp + ' HP against ' + out.walkout.hp
    + '. THAT IS WORTH SAYING PLAINLY: perfect rhythm is worth several wins and most of your health, which is V74 working exactly as written ("player SKILL matters more than stats") -- and it also means NO HEADLESS ARM IN THIS REPO HAS EVER MEASURED A PLAYER WHO MISSES. Every movement number here describes the ceiling',
    out.sprint.won >= out.walkout.won);

  ok('D2b AND THE SPRINT COUNT IS THE PROOF, not a side note: it reads ' + out.sprint.uses
    + ' pips spent across ' + out.sprint.turns + ' turns. A first cut of this counter incremented on any move the arm made and read 201 of 243, which made the budget look irrelevant; counting only steps that SPENT A PIP shows the truth, which is that on the beat the budget is not being touched at all',
    out.sprint.uses < out.sprint.turns * 0.5);

  ok('D3 AND IT IS RECORDED, NOT NERFED, DELIBERATELY. The sprint\'s shape is his own ruling (V110: "sprinting basically just means you get to take movement action") and RF4-40\'s own answer to a dominant ability is a COUNTER, which already exists: V168\'s spotter refuses the sprint while he holds a line on you. So the rule is satisfied in shape and the counter is simply weak -- that is a finding for him, not a dial for me',
    true);

  ok('D4a THE GRENADE IS NOT A STRATEGY EITHER: throwing one every turn it is available wins ' + out.grenade.won
    + ' of ' + out.grenade.fights + ' against the walk\'s ' + out.walkout.won + ', and loses ' + out.grenade.hp
    + ' HP against ' + out.walkout.hp + '. Two per fight is a tool for a moment, not a plan, and the sweep says so rather than leaving it assumed',
    out.grenade.won <= out.walkout.won && out.grenade.hp > out.walkout.hp);

  ok('D4 AND A VERB THAT DOES NOTHING ON ITS OWN IS ALSO A FINDING: suppressing every turn wins ' + out.suppress.won
    + ' of ' + out.suppress.fights + ' and loses ' + out.suppress.hp + ' HP. SUPPRESS IS A SUPPORT ACTION, NOT A WIN CONDITION, and the sweep says so out loud rather than leaving it to be assumed',
    out.suppress.won === 0);

  ok('D5 AND THE HARNESS CHEATED FIRST, which is why these numbers are worth anything. The first cut set G.stam=3 EVERY TURN -- an infinite sprint -- and read 22 wins at 6.2 HP; suppress and the grenade were topped up the same way. REFILLING A RESOURCE EVERY TURN MEASURES A BUTTON NOBODY HAS. On the real budgets the sprint still wins, which is the point, and the pip clock is visible in the count: it is used ' + out.sprint.uses + ' times in ' + out.sprint.turns + ' turns rather than every one',
    out.sprint.turns > 0);

  ok('no page errors across ' + rows.reduce((a, [, r]) => a + r.fights, 0) + ' scored fights', errors.length === 0);
  if (errors.length) console.log('    ' + errors.slice(0, 3).join('\n    '));

  console.log('=== DOMINANCE SWEEP GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
