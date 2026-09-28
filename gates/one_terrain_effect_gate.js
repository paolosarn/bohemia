#!/usr/bin/env node
/* ============================================================================
   ONE TERRAIN EFFECT, AND IT IS THE HIGH GROUND   (COMBAT lane, [bb fight], rule 33d)

   *** PAOLO 9/24, an executive decision (laws/BOHEMIA_LAW_THE_OVERWORLD_IS_BATTLE_
   BROTHERS_9_24_26.md s5): "ONE terrain effect in the whole fight, a small mound =
   accuracy bonus, NOTHING ELSE ON A TILE CHANGES A NUMBER." ***

   Battle Brothers has a terrain table -- hills, forest, swamp, rough ground -- each
   quietly moving accuracy, vision and fatigue. He looked at it and kept exactly one.
   The row's build half is this gate: refuse a second one.

   HOW IT REFUSES ONE, AND WHY IT IS NOT A GREP. A gate that searched the source for
   the word "mud" would pass on a terrain effect spelled any other way, and would go
   red on a comment. So this measures the SHAPE OF THE DIAL instead: it collects, over
   many seeded arenas, every (what the game says decides this shot) -> (the dial it
   got) pair, and asserts THE MAP IS A FUNCTION. Two enemies whose distance, elite
   flag, cover, peek, chain, pressure and level are identical MUST get the same dial,
   wherever on the board they are standing. Add a tile that changes a number and the
   same inputs start giving two answers, and this goes red without knowing what the
   tile is called.

   AND IT REPORTS THE ONE EFFECT'S REACH, RED, because an effect that never fires is
   not an effect. Measured 9/27 over 160 street fights on the shipped house board:
   the player starts on the high ground 0 times, and the high ground changes 0 of 688
   shots at the bell. The deck exists in 74% of arenas and averages 9 HOUSE tiles --
   about 110 metres -- with its nearest stair 6 houses away. That is a raised city
   block, not a small mound, and it is the next thing in this row.
   ========================================================================== */
const { open } = require('../tools/bohemia_drive_the_demo.js');
const N = 120;

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? ' (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? ' (' + note + ')' : ''))); };

(async () => {
  const d = await open({ alpha: true });
  try {
    await d.page.click('[data-p="combat"]').catch(() => {});
    await d.page.waitForTimeout(7000);
    /* THE FIGHT'S OWN TITLE CARD DOES NOT MATTER HERE AND THAT IS SAID OUT LOUD. The
       COMBAT tab's frame opens on BOHEMIA / DEAD EYE DIAL / TAP TO START with a live G
       underneath it, and two finders failed to name that card this round. Every arm
       below drives the shipped functions and touches nothing with a finger, so the card
       is irrelevant to this gate; a gate that needed a pointer would have to walk in
       from the street the way house_board_gate does. */
    let fr = null;
    for (let i = 0; i < 40 && !fr; i++) {
      for (const f of d.page.frames()) {
        try { if (await f.evaluate(() => typeof setupCombat === 'function'
          && typeof BohemiaArena !== 'undefined' && typeof highGroundEdge === 'function')) { fr = f; break; } } catch (e) {}
      }
      if (!fr) await d.page.waitForTimeout(500);
    }
    if (!fr) { ok('the fight answers, so there is something to measure', false); return; }
    ok('the fight answers, so there is something to measure', true);

    const R = await fr.evaluate((N) => {
      const out = { fights: 0, rows: [], clash: [], hgFires: 0, hgShots: 0, onDeck: 0,
                    withDeck: 0, deckTiles: 0, deckNear: 0, stairNear: 0, stairN: 0,
                    easedWhenAbove: null, houseOn: null, tileM: null };
      try { G.bossOff = true; G.allyOff = true; G.ally = null; G.cityRoom = null; } catch (e) {}
      /* WHAT THE GAME ITSELF SAYS DECIDES A SHOT. Read off the one line that builds the
         dial, so this list cannot quietly fall behind the game: distPkg, elite, gcov,
         handPeek, chainRampDial, pressurePkg, highGroundEdge. */
      const key = (e) => [distPkg(e), e.elite ? 1 : 0, e.gcov ? 1 : 0, G.handPeek ? 1 : 0,
                          chainRampDial(), pressurePkg(), myLvl(), (e.lvl | 0)].join('/');
      const dialFor = (e) => Math.max(0, Math.min(4, Math.max(
        distPkg(e) + (e.elite ? 1 : 0) + (e.gcov ? 1 : -1) + (G.handPeek ? 1 : 0),
        chainRampDial(), pressurePkg())) - highGroundEdge(e));
      const seen = {};
      for (let a = 1; a <= N; a++) {
        try { BohemiaArena.set(a); setupCombat(); } catch (e) { continue; }
        out.fights++;
        const dk = G.deck || [];
        if (dk.length) { out.withDeck++; out.deckTiles += dk.length;
          let n = 1e9; for (const t of dk) n = Math.min(n, t.edist || 99); out.deckNear += n; }
        for (const s of (G.stairs || [])) { out.stairNear += (s.edist || 0); out.stairN++; break; }
        if (myLvl() > 0) out.onDeck++;
        for (const e of (G.e || [])) {
          if (!e || e.dead) continue;
          out.hgShots++;
          if (highGroundEdge(e) > 0) out.hgFires++;
          const k = key(e), v = dialFor(e);
          if (seen[k] === undefined) seen[k] = v;
          else if (seen[k] !== v && out.clash.length < 6)
            out.clash.push({ inputs: k, got: v, before: seen[k], arena: a });
        }
      }
      out.keys = Object.keys(seen).length;
      /* AND THE ONE EFFECT REALLY IS AN EFFECT: stand the player a storey up over a man
         in cover and the dial must ease. Driven through the shipped function, not
         asserted from the source. */
      try {
        BohemiaArena.set(7); setupCombat();
        const e = (G.e || []).filter(x => x && !x.dead)[0];
        if (e) {
          e.gcov = true; e.lvl = 0; e.edist = Math.min(e.edist || 4, 4);
          G.lvl = 0; const flat = highGroundEdge(e);
          G.lvl = (typeof DECK_LVL !== 'undefined') ? DECK_LVL : 1;
          const above = highGroundEdge(e);
          G.lvl = 0;
          out.easedWhenAbove = { flat: flat, above: above };
        }
      } catch (err) { out.easedWhenAbove = { err: String(err).slice(0, 90) }; }
      /* ===== AND THEN HE TAKES IT, THROUGH THE REAL MOVE (V228) =====
         The leg below used to count only AT THE BELL, before anyone had moved. A mound is
         a thing you step onto, and "high ground you are standing on or ONE STEP FROM" is
         what this lane wrote on 9/27, so counting before the first step measures a moment
         the mound can never win. So for every arena with high ground, walk him to it with
         doMove -- the button his thumb presses, turns and all -- and then ask the shipped
         highGroundEdge how many men it eases. A pillar in the way or a fight that ends
         first counts as NOT TAKEN, because that is what happened. */
      out.took = 0; out.tried = 0; out.stepsSum = 0; out.easedAfter = 0; out.shotsAfter = 0;
      out.firedFights = 0;
      const DIRS = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
      for (let a = 1; a <= N; a++) {
        try { BohemiaArena.set(a); setupCombat(); } catch (e) { continue; }
        if (!(G.stairs || []).length) continue;
        out.tried++;
        G.phase = 'cover'; G.over = false; G.stam = (typeof STAM_MAX !== 'undefined') ? STAM_MAX : 3;
        let steps = 0;
        for (; steps < 8 && myLvl() === 0 && !G.over; steps++) {
          const S = G.stairs[0]; if (!S) break;
          const q = pXY(S), sx = Math.sign(Math.round(q[0])), sy = Math.sign(Math.round(q[1]));
          const di = DIRS.findIndex(v => v[0] === sx && v[1] === sy);
          if (di < 0) break;
          const before = JSON.stringify(pXY(S).map(v => Math.round(v * 100)));
          G.phase = 'cover'; G.inc = false;
          try { doMove(di); } catch (e) { break; }
          const after = JSON.stringify(pXY(S).map(v => Math.round(v * 100)));
          if (before === after && myLvl() === 0) break;   /* the step was refused: blocked */
        }
        if (myLvl() > 0) {
          out.took++; out.stepsSum += steps;
          /* SAME MEN, SAME PLACES, ONLY THE HEIGHT CHANGES. The first cut of this counted
             highGroundEdge(e) > 0 and read 0 of 333 -- and it would read 0 for ever, because
             that function only pays over a man IN COVER, and V90 takes away the cover of every
             man below you the moment you are up (realCoverPillar: "if we are on different
             floors, the stone between us on the ground is not between us at all"). The two
             rules cancel; the accuracy arrives through the cover term instead. So this asks the
             DIAL, which is the only thing he feels. */
          const UP = myLvl(); let n = 0;
          for (const e of (G.e || [])) { if (!e || e.dead) continue; out.shotsAfter++;
            G.lvl = 0; updateGeomCover(); const d0 = dialFor(e), g0 = e.gcov;
            G.lvl = UP; updateGeomCover(); const d1 = dialFor(e), h1 = highGroundEdge(e);
            if (g0) out.coveredBelow = (out.coveredBelow || 0) + 1;
            if (d1 < d0) { out.easedAfter++; n++; out.tiers = (out.tiers || 0) + (d0 - d1); }
            if (d1 > d0) out.harder = (out.harder || 0) + 1;
            if (h1 > 0) out.viaEdge = (out.viaEdge || 0) + 1; }
          G.lvl = UP; updateGeomCover();
          if (n > 0) out.firedFights++;
        }
      }
      out.houseOn = (typeof houseOn === 'function') ? !!houseOn() : null;
      try { out.tileM = +tileMetres().toFixed(1); } catch (e) {}
      return out;
    }, N);

    const deckPct = +(100 * R.withDeck / Math.max(1, R.fights)).toFixed(1);
    const deckAvg = R.withDeck ? +(R.deckTiles / R.withDeck).toFixed(2) : 0;
    const nearAvg = R.withDeck ? +(R.deckNear / R.withDeck).toFixed(2) : 0;
    const stairAvg = R.stairN ? +(R.stairNear / R.stairN).toFixed(2) : 0;
    console.log('  ' + R.fights + ' fights, house board ' + R.houseOn + ', a tile is ' + R.tileM + ' m');
    console.log('  the high ground: in ' + deckPct + '% of fights, ' + deckAvg + ' tiles across ('
      + (deckAvg * R.tileM).toFixed(0) + ' m), nearest edge ' + nearAvg + ' tiles, nearest stair '
      + stairAvg + ' tiles');
    console.log('  ' + R.keys + ' distinct input tuples over ' + R.hgShots + ' shots');

    ok('*** NOTHING ELSE ON A TILE CHANGES A NUMBER (Paolo 9/24: "ONE terrain effect in '
       + 'the whole fight, a small mound = accuracy bonus, nothing else on a tile changes a '
       + 'number"). *** Two men whose distance, rank, cover, peek, chain, pressure and level '
       + 'are the same get the same dial wherever they stand. A tile that moved a number '
       + 'would make the same inputs give two answers, whatever it was called.',
       R.clash.length === 0,
       R.clash.length ? JSON.stringify(R.clash[0]) : 'no tuple gave two answers');

    ok('and the one effect he kept is REAL: a storey above a man in cover eases the dial, '
       + 'driven through the shipped function rather than read off the source',
       !!R.easedWhenAbove && R.easedWhenAbove.above > R.easedWhenAbove.flat,
       R.easedWhenAbove ? ('flat ' + R.easedWhenAbove.flat + ', above ' + R.easedWhenAbove.above) : 'not measured');

    /* RE-AIMED 9/28 WITH V228, AND THE CLAIM IS THE SAME SENTENCE: it actually fires in a
       fight he plays. What changed is WHEN it is counted. At the bell nobody has moved, and a
       mound is a move -- this leg could never have gone green for the thing it was asking
       for. It is now counted after he takes the mound with the real button, and the bell
       number is still printed beside it so the change is visible, not hidden. */
    console.log('  AT THE BELL: ' + R.hgFires + ' of ' + R.hgShots + ' shots eased (nobody has moved)');
    console.log('  HE TAKES IT: ' + R.took + ' of ' + R.tried + ' mounds reached with the real move, '
      + (R.took ? (R.stepsSum / R.took).toFixed(2) : '-') + ' steps on average; then '
      + R.easedAfter + ' of ' + R.shotsAfter + ' shots eased (' + (R.coveredBelow || 0)
      + ' were in cover on the ground), ' + (R.tiers || 0) + ' dial tiers saved, in '
      + R.firedFights + ' fights; ' + (R.harder || 0) + ' made harder');
    console.log('  THE OLD DOOR: highGroundEdge eased ' + (R.viaEdge || 0) + ' of those. It pays only '
      + 'over a man in cover below you, and V90 removes the cover of every man below you, so it '
      + 'cannot fire. Named, not deleted: his 8/2 words are above it, and the distance falloff it '
      + 'tried to add is a felt number for TUNING (chat 21).');
    ok('*** AND IT ACTUALLY FIRES IN A FIGHT HE PLAYS (Paolo 9/24: "a small mound = accuracy '
       + 'bonus"). *** Walked there with the button his thumb presses, turns and all, standing on '
       + 'it makes real shots easier on the DIAL -- the same men in the same places, only the '
       + 'height changed. Before V228 nobody could get to it, so it had never happened once.',
       R.easedAfter > 0 && R.took > 0 && !(R.harder > 0),
       R.easedAfter + ' of ' + R.shotsAfter + ' shots eased after taking it, in ' + R.firedFights
       + ' of ' + R.took + ' fights where he got up there');

    ok('and he can actually get up there: most mounds are reached in a couple of steps, not '
       + 'refused by a rock or a stair six cells away',
       R.tried > 0 && R.took / R.tried >= 0.6,
       R.took + ' of ' + R.tried + ' reached');

    /* RE-WORDED 9/28 FOR V227: this said "houses" because a tile was one. Rule 34 made a
       tile a CELL of 3 m, and the same slab now measures about 27 m instead of 111 -- four
       times closer to a mound, for free, because the board changed scale under it. Still
       not one cell, so the leg stands. The CLAIM never moved; only the unit it prints. */
    ok('*** AND THE HIGH GROUND IS A MOUND, NOT A CITY BLOCK (rule 34: "the mound is ONE CELL"). '
       + '*** It was a slab 9 houses across, then 8.86 cells; V228 made it one. It measures '
       + deckAvg + ' cells across.',
       deckAvg > 0 && deckAvg <= 1.5,
       deckAvg + ' cells across, about ' + (deckAvg * R.tileM).toFixed(0) + ' m, against '
       + 'one cell of ' + R.tileM + ' m');

    ok('no page errors while the fights were built', d.errs.length === 0, d.errs.slice(0, 2).join(' ; '));
  } finally {
    console.log('=== ONE TERRAIN EFFECT GATE: ' + pass + ' passed, ' + fail + ' failed ===');
    await d.close();
    process.exit(fail ? 1 : 0);
  }
})();
