#!/usr/bin/env node
/* ============================================================================
   FIGHT LENGTH -- how long a fight takes, played to its end through the one driver
   (COMBAT lane, [house tiles back]; rule 40a, Paolo 9/29: "tough battles can be 30-40 mins...
   shorter than 30-40 even for tough battles"; defaults: a routine fight 2 to 4 minutes, a tough
   one 8 to 15, never past 15; "measure the length of every test fight through the driver and print
   it in the commit").

   WHAT PLAYS IT: a plain bot that uses only the player's own buttons, the way a thumb does --
   doMove (the ring), doPop (FIRE opens the dial), fire() (FIRE again) -- and nothing the player
   cannot do. Each beat: if a living enemy is inside the gun's reach, open the dial and shoot when
   the needle crosses the kill zone; otherwise step one tile toward the nearest enemy. It never
   uses cover, the companion's orders, grenades, kits or the way out, so it is a CRUDE player, and
   the number it prints is "how long a fight lasts for somebody who only walks and shoots" -- said
   so on every line it prints. Real time, in a real fight on the real board; capped.

     node tools/bohemia_fight_length.js [fights=3] [capSeconds=300] [cover|walk]
   ========================================================================== */
const { open } = require('./bohemia_drive_the_demo.js');
const N = +process.argv[2] || 3, CAP = (+process.argv[3] || 300) * 1000, MODE = process.argv[4] || 'cover';
(async () => {
  const d = await open({ alpha: true });
  const out = [];
  try {
    await d.page.click('[data-p="combat"]').catch(() => {});
    await d.page.waitForTimeout(7000);
    let fr = null;
    for (let i = 0; i < 40 && !fr; i++) { for (const f of d.page.frames()) { try { if (await f.evaluate(() => typeof setupCombat === 'function' && typeof doPop === 'function' && typeof fire === 'function')) { fr = f; break; } } catch (e) {} } if (!fr) await d.page.waitForTimeout(500); }
    if (!fr) { console.log('the fight did not answer'); process.exit(1); }
    for (let k = 0; k < N; k++) {
      const r = await fr.evaluate(async ({ seed, cap, mode }) => {
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        BohemiaArena.set(seed); setupCombat(); await sleep(600);
        const t0 = performance.now(); let shots = 0, steps = 0, pops = 0, holds = 0; const seen = {};
        const DIRS = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
        const live = () => (G.e || []).filter(e => e && !e.dead && !e.downed && !e.fleeing && !e.broken);
        const wpn = () => (G.wpn && (G.wpn.id || G.wpn.k)) || G.weapon || 'pistol';
        while (!G.over && performance.now() - t0 < cap) {
          if (G.phase === 'cover' && !G.inc && !G.ks) {
            const L = live(); if (!L.length) { await sleep(250); continue; }
            let reach = 1; try { reach = houseRange(wpn()).max; } catch (e) {}
            L.sort((a, b) => a.edist - b.edist);
            if (L[0].edist <= reach + 0.5) { try { doPop(); pops++; } catch (e) {} await sleep(120); }
            else { let q = [Math.cos(L[0].ea) * L[0].edist, Math.sin(L[0].ea) * L[0].edist];
              /* MODE cover: follow the game's own lit tiles first (V193's read: the tiles strictly
                 better than standing still), the way a player reads the board; else advance */
              if (mode === 'cover') { let rd = null; try { rd = readGround(); } catch (e) {}
                if (rd && rd.bestTile && (rd.bestTile.dx || rd.bestTile.dy)) q = [rd.bestTile.dx, rd.bestTile.dy];
                else if (rd && rd.bestTile && !rd.bestTile.dx && !rd.bestTile.dy && holds < 2) { holds++; try { if (typeof doWait === 'function') doWait(); } catch (e) {} await sleep(520); continue; } }
              holds = 0;
              /* every direction, nearest-to-him first, never back onto a tile it already stood on */
              const here = ((G.worldOff && G.worldOff.x) || 0) + ',' + ((G.worldOff && G.worldOff.y) || 0); seen[here] = 1;
              const order = DIRS.map((v, i) => ({ i, d: Math.hypot(q[0] - v[0], q[1] - v[1]) })).sort((a, b) => a.d - b.d);
              let moved = false;
              for (const o of order) { const b = JSON.stringify(pXY(L[0]));
                const nk = (((G.worldOff && G.worldOff.x) || 0) + DIRS[o.i][0]) + ',' + (((G.worldOff && G.worldOff.y) || 0) + DIRS[o.i][1]);
                if (seen[nk] && order.length) continue;
                try { doMove(o.i); } catch (e) {} if (JSON.stringify(pXY(L[0])) !== b) { steps++; moved = true; break; } }
              if (!moved) { for (const k in seen) delete seen[k]; try { doMove(order[0].i); } catch (e) {} }
              await sleep(520); }
          } else if (G.phase === 'aim' && !G.ks) {
            const tA = performance.now(); let fired = false;
            while (performance.now() - tA < 3000 && G.phase === 'aim') {
              let hz = 0.12; try { hz = G.W.hZ * ARC_MULT; } catch (e) {}
              if (Math.abs(G.angle) <= hz) { try { fire(); shots++; fired = true; } catch (e) {} break; }
              await sleep(12); }
            if (!fired && G.phase === 'aim') { try { fire(); shots++; } catch (e) {} }
            await sleep(400);
          } else await sleep(100);
        }
        const secs = (performance.now() - t0) / 1000;
        return { seed, secs: +secs.toFixed(1), beats: Math.round(secs * 2), over: !!G.over, won: !!G.won || (live().length === 0),
          hp: G.pHP, how: G._wonByExit ? 'walked out the way out' : (G.win ? 'won' : ((G.pHP|0) <= 0 ? 'he went down' : 'ended')), enemies: (G.e || []).length, left: live().length, shots, steps, pops, capped: !G.over && secs * 1000 >= cap - 50 };
      }, { seed: 3 + k * 7, cap: CAP, mode: MODE });
      out.push(r);
      console.log('  fight ' + (k + 1) + ': ' + (r.capped ? 'NOT OVER at the cap, ' : '') + r.secs + ' s (' + r.beats + ' beats), '
        + (r.left === 0 ? 'all ' + r.enemies + ' down' : r.left + ' of ' + r.enemies + ' still standing') + ', ' + r.how + ', his health ' + r.hp
        + ', ' + r.shots + ' shots, ' + r.steps + ' steps -- ' + (MODE === 'cover' ? 'a bot that follows the lit tiles, then shoots' : 'a bot that only walks and shoots'));
    }
  } finally {
    const done = out.filter(r => !r.capped);
    console.log('=== FIGHT LENGTH: ' + out.length + ' fights, ' + done.length + ' ended; '
      + (done.length ? 'median ' + done.map(r => r.secs).sort((a, b) => a - b)[done.length >> 1] + ' s' : 'none ended inside the cap')
      + ' (defaults: routine 2-4 min, tough 8-15, never past 15) ===');
    await d.close();
  }
})();
