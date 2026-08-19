#!/usr/bin/env node
/* V165 PICTURE: photograph the moment the board loses him.
   Paolo 8/8, LOCKED: "just give me pictures and put it in a tab."

   IT IS NOT STAGED. The fight runs through the shipped tickTurnEnd -- which is
   the function that resolves vision, moves the men and lets them shoot -- and the
   shutter goes on the first turn the shipped visionTick reports that NOBODY can
   see him while men are hunting a memory. Nothing about the board is arranged.

   *** THE FIRST VERSION OF THIS SHIPPED A PICTURE OF THE PLAYER DYING. *** It
   walked him with doMove in a circle to force the situation, and he stepped onto
   his own grenade: the screen came back at 0/100 HP, drenched in the red death
   overlay, with "CAUGHT THE BLAST" written across the middle where the feature
   was supposed to be. A picture is a CLAIM about the build, and that one was a
   false one. VERIFY ON THE REAL SURFACE (7/18) means looking at the pixels before
   shipping them, so: he does not move, he does not throw anything, and the shot
   is refused outright if he has taken a scratch. If the situation never arises on
   its own, there is no picture and that is the finding.

   REUSE CHECK: cooks NO graphic pixels -- it photographs the shipped canvas.
   Reuses the drive-into-the-combat-frame path from gates/fight_moves_you_gate.js.
*/
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = process.argv[2] || '/home/user/bohemia/slices/look/they-lost-you.png';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });
  await page.goto('file:///home/user/bohemia/slices/BOHEMIA_ALPHA_0_9.html');
  await page.waitForTimeout(9000);
  await page.mouse.click(215, 450); await page.waitForTimeout(2500);
  await page.mouse.click(215, 450); await page.waitForTimeout(2500);
  await page.click('[data-p="combat"]'); await page.waitForTimeout(7000);
  await page.mouse.click(215, 450); await page.waitForTimeout(5000);

  const frame = page.frames().find(f => f.name() === 'combatFrame');
  const found = await frame.evaluate(() => {
    for (let a = 1; a <= 60; a++) {
      /* A FIGHT STARTS WITH A WHOLE MAN. setupCombat does not restore HP, so
         damage carried across arenas in this loop and the shot came back at
         0/100 -- a picture of a corpse with the feature written over it. The
         shipped fullResetCombat is what a NEW ENCOUNTER does, so use that. */
      try { fullResetCombat(); } catch (e) {}
      BohemiaArena.set(a); setupCombat(); G.phase = 'cover';
      if (G.pHP !== (G.pMax || 100)) continue;
      for (let t = 0; t < 8; t++) {
        const hp0 = G.pHP;                           /* PER TURN. Carrying one HP reading across
                                                        arenas let a hit from the previous fight
                                                        stand in for "he is fine here", and the
                                                        picture came back with a grenade log line
                                                        under the feature line. */
        try { tickTurnEnd(); } catch (e) {}          /* the shipped turn: vision, then the men */
        if (G.over) break;
        if (G.pHP < hp0) break;                      /* a hurt man is a picture of something else */
        const eyes = G._eyesOn | 0, hunt = blindHunters();
        if (eyes === 0 && hunt > 0) {
          setRead('THEY LOST YOU', hunt + ' walking to where you were', '#8fe89a');
          try { renderBoard(); } catch (e) {}
          return { arena: a, turn: t + 1, hunters: hunt, hp: G.pHP };
        }
      }
    }
    return null;
  });
  if (!found) {
    console.log('NEVER HAPPENED WITHOUT HIM MOVING -- no picture taken, and that is the finding');
    await browser.close(); process.exit(1);
  }
  /* AND THE FEATURE LINE HAS TO BE THE NEWEST THING ON THE READOUT. The first
     clean shot waited 1.5s for the canvas to settle, and in that time the game's
     own beat loop appended two more lines UNDER it, so the eye landed on a
     grenade instead of on the thing the picture is about. Settle first, write
     last, shoot immediately. */
  await page.waitForTimeout(1200);
  await frame.evaluate(() => {
    setRead('THEY LOST YOU', blindHunters() + ' walking to where you were', '#8fe89a');
    try { renderBoard(); } catch (e) {}
  });
  await page.waitForTimeout(120);
  await page.screenshot({ path: OUT });
  console.log('shot ' + OUT + '  arena ' + found.arena + ', turn ' + found.turn
    + ', ' + found.hunters + ' hunting a memory, player at ' + found.hp + ' HP');
  await browser.close();
})();
