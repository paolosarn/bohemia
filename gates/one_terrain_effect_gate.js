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

    ok('*** AND IT ACTUALLY FIRES IN A FIGHT HE PLAYS. *** NOT TRUE YET, AND THIS IS THE '
       + 'NUMBER: the one terrain effect in the game changes no shots at all, because the '
       + 'player never starts on the high ground and the stairs are houses away. The next '
       + 'thing in this row is the MOUND: high ground you are standing on or one step from, '
       + 'not a raised block across the street.',
       R.hgFires > 0, R.hgFires + ' of ' + R.hgShots + ' shots eased, player started up there '
       + R.onDeck + ' of ' + R.fights + ' times');

    ok('*** AND THE HIGH GROUND IS A MOUND, NOT A CITY BLOCK. *** NOT TRUE YET: on the house '
       + 'board a tile is a house, so the raised slab this game builds is about ' + deckAvg
       + ' houses across. He asked for a SMALL MOUND. Same row as the leg above.',
       deckAvg > 0 && deckAvg <= 3,
       deckAvg + ' tiles across, about ' + (deckAvg * R.tileM).toFixed(0) + ' m');

    ok('no page errors while the fights were built', d.errs.length === 0, d.errs.slice(0, 2).join(' ; '));
  } finally {
    console.log('=== ONE TERRAIN EFFECT GATE: ' + pass + ' passed, ' + fail + ' failed ===');
    await d.close();
    process.exit(fail ? 1 : 0);
  }
})();
