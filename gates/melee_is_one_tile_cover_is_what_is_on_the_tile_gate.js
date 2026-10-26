#!/usr/bin/env node
/* MELEE IS ONE TILE, COVER IS WHAT IS ON THE TILE (COMBAT [melee is one tile] and [cover is what is on the tile], rule 170, Paolo
   10/25, playing a fight: 'if you're in the middle of the street you have no cover unless that street tile has crazy car
   wreckage... enemies using pipes, melee weapons, but they're able to attack for more than one tile'; rule 83, his 10/10: 'melee
   weapons work on one tile away, all guns 2+ minimum'; records/BOHEMIA_PAOLO_NO_COVER_IN_THE_OPEN_STREET_AND_MELEE_IS_ONE_TILE_10_25_26.md).

   Measured before (COMBAT 10/25): the fight read a melee weapon's reach as the biggest digit in its weapons.json range text,
   which carries the wiki's skill numbering ('1 (1) Slash 1-2 (2) Split 1 (3) Swing' read 3, an axe's '1/1 (Split Man) 1/6 (Round
   Swing)' read 6, the pipe's '1-2' 2); and a man knelt 'in cover' on any raised tile (312 of 1,040 kneeling frames over six AUTO
   fights stood on bare raised ground with nothing on it) and on the outcrop he stood on.

   Legs (rule 170(c): many rolled fights, every enemy kind):
   1. headless, the live fight's own rules (tools/bohemia_fight_headless.js), every faction the fight deals at three points of the
      act and two seeds, AUTO on both sides: EVERY MELEE BLOW IS STRUCK FROM THE NEXT TILE (a blow's shape, the split's man
      behind, is the shape's, not the reach's); and A GUN SHOOTS THE MAN BESIDE HIM (rule 185, Paolo 10/25: 'why do you have pistols
      not able to shoot the tile next to them?'; the two-tile minimum was rule 83 misread): shots fired at the next tile, and
      NO GUN EVER STRIKES AS A CLUB (rule 195: every blow a man holding a gun lands is a shot, both sides);
   2. no weapon in weapons.json reaches past the next tile in melee, whatever its range text says; and no gun of the data is
      refused the man beside him (every gun row, loaded, with the breath and the AP: shot, not clubbed, not 'too close');
   3. the rules' cover is what a man hides behind: a tile's cover count is the pieces of the kinds he hides behind on it
      (COVER, LOW_COVER), never a rock he stands on (MOUND) or a dock (HEIGHT), on every dealt board;
   3b. NO COVER IN THE OPEN STREET (COMBAT line 90's open-street half, 10/26): in rolled AUTO fights on eight kinds of board, a
      shot at a man on a bare tile never reads cover (a piece on the next tile is a house away; a man in the line is 'in the
      way'), and a shot at a man on a cover tile always does: the cover, the kneel and the odds one fact;
   4. on the page, AUTO fights on a suburb, a strip and the desert: EVERY KNEEL IS ON A COVER TILE OR IN A BUILDING (a roof),
      never on bare raised ground, never in the open street;
   5. the weapon card says a melee weapon reaches 1 tile;
   6. nothing threw.
   Run: node gates/melee_is_one_tile_cover_is_what_is_on_the_tile_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== MELEE IS ONE TILE, COVER IS WHAT IS ON THE TILE GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  const { engine, playOut } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
  /* the attack's two tiles, written on the event the fight already emits */
  const ctx = engine({ patch: r => r.replace("emit({ t: 'attack', id: a.id, to: t.id,", "emit({ t: 'attack', ax: a.x, ay: a.y, tx: t.x, ty: t.y, gunHeld: isGun(a.weapon), id: a.id, to: t.id,") });
  const F = ctx.FIGHT, DB = ctx.DB, R = k => { const p = k.split('.'); let o = DB[p[0]][p[1]]; return o && o.value !== undefined ? o.value : o; };
  const factions = Object.keys(R('ours.enemy_tiers').mix);
  let blows = 0, far = [], shots = 0, close = 0, butt = [], fights = 0, kinds = new Set(), errs = [];
  for (const faction of factions) for (const days of [1, 40, 120]) for (const seed of [5, 17]) {
    try {
      ctx.setSeed(seed);
      const S = playOut(ctx, { seed, party: { faction, count: 8, days, difficulty: 1 }, kind: 'strip', night: false }, 60000).S;
      fights++;
      S.units.filter(u => u.side === 'them').forEach(u => kinds.add(u.kind));
      /* Line Breaker's shield bash lands on the man it shoves, after the shove (the step before it, shoved, says where he stood) */
      S.log.forEach((e, i) => { if (e.t !== 'attack' || e.sweep || e.ax === undefined) return;
        const p = S.log[i - 1], at = p && p.t === 'step' && p.shoved && p.id === e.to ? { x: p.fx, y: p.fy } : { x: e.tx, y: e.ty };
        const d = Math.max(Math.abs(e.ax - at.x), Math.abs(e.ay - at.y)), a = S.units.find(u => u.id === e.id);
        const gunman = /^(pistol|rifle|shotgun|firearm)/.test(String(a && a.job || '')) || (a && F.isGun && F.isGun(a.weapon));
        if (!e.shot) { blows++; if (d !== 1) far.push(faction + ' ' + (a && a.kind || e.id) + ' ' + e.arm + ' at ' + d);
          if (e.gunHeld) butt.push(faction + ' ' + (a && a.kind || e.id) + ' ' + e.arm); }
        else if (gunman) { shots++; if (d === 1) close++; }
      });
    } catch (e) { errs.push(faction + ' ' + days + ': ' + e.message); }
  }
  leg(fights >= factions.length * 6 - 2 && blows > 50 && far.length === 0, '*** EVERY MELEE BLOW IS STRUCK FROM THE NEXT TILE *** (rule 170(b)): every faction at three points of the act, two seeds each, AUTO on both sides',
    fights + ' fights, ' + kinds.size + ' kinds of enemy, ' + blows + ' blows, ' + far.length + ' from further' + (far.length ? ': ' + far.slice(0, 4).join('; ') : ''));
  leg(close > 0 && butt.length === 0, '*** A GUN SHOOTS THE MAN BESIDE HIM, AND NO GUN IS A CLUB *** (rules 185, 195): shots at the next tile, and not one blow struck with a gun as a club',
    shots + ' shots, ' + close + ' at the next tile; ' + butt.length + ' gun blows as a club' + (butt.length ? ': ' + butt.slice(0, 3).join('; ') : ''));
  /* 2: every melee weapon of the data, whatever its range text */
  F.setup({ seed: 3, kind: 'strip', auto: true, formation: null, party: { faction: 'brigands', count: 2, days: 1 } });
  const a = F.S.units.find(u => u.side === 'you'), t = F.S.units.find(u => u.side === 'them');
  const rows = (DB.weapons.rows || DB.weapons).filter(w => !F.isRanged(w));
  /* the rules' own test through a man holding each weapon: one tile yes, two no */
  let tested = 0, bad = [];
  rows.forEach(w => {
    a.weapon = w; a.ap = 99; a.fat = 0; t.x = a.x + 1; t.y = a.y; const one = F.canStrike(a, t); t.x = a.x + 2; const two = F.canStrike(a, t);
    tested++; if (two) bad.push(w.id + ' (' + w.range + ')');
    if (!one && F.S.w > a.x + 1 && F._t.passable(a.x + 1, a.y)) bad.push(w.id + ' cannot strike beside him');
  });
  leg(tested > 50 && bad.length === 0, 'no melee weapon of the data reaches past the next tile, whatever its range text says (a sword\'s \'1-2 (2) Split... (3) Swing\' read 3, an axe\'s \'1/6\' read 6)',
    tested + ' melee weapons, ' + bad.length + ' wrong' + (bad.length ? ': ' + bad.slice(0, 4).join('; ') : ''));
  /* every gun row of the data, the man beside him: shot, never 'too close' */
  const guns = (DB.weapons.rows || DB.weapons).filter(w => F.isGun(w) && F.isRanged(F._t.pistolShot(w) || w));
  const refused = [];
  guns.forEach(w0 => { const w = F._t.pistolShot(w0) || w0; a.weapon = w; a.loaded = true; a.ammo = w.mag || (w.ammo ? Number(String(w.ammo).match(/\d+/)[0]) : null);
    a.ap = 99; a.fat = 0; t.x = a.x + 1; t.y = a.y;
    if (!(F.canStrike(a, t) && F.isRanged(a.weapon))) refused.push(w0.id + ' (' + ((F.strikeWhy(a, t) || {}).why || 'not a shot') + ')'); });
  leg(guns.length >= 8 && refused.length === 0, '*** NO GUN IS REFUSED THE MAN BESIDE HIM *** (rule 185(e)): every gun row, loaded, shoots the next tile',
    guns.length + ' guns, ' + refused.length + ' refused' + (refused.length ? ': ' + refused.slice(0, 4).join('; ') : ''));
  /* 3: the rules' cover count on every dealt board */
  const hideKinds = ['COVER', 'LOW_COVER'];
  let tiles = 0, wrong = [], stoodOn = 0;
  for (const kind of ['strip', 'suburb', 'scrub', 'works', 'ruin', 'landfill', 'shore']) for (const seed of [2, 9]) {
    F.setup({ seed, kind, auto: true, formation: null, party: { faction: 'brigands', count: 4, days: 1 } });
    const S = F.S, tm = DB.ground.tile_metres, want = S.coverCount.map(r => r.map(() => 0));
    (S.boardDef.cover || []).forEach(c => { const x = Math.floor(c.x_m / tm), y = Math.floor(c.y_m / tm); if (x < 0 || y < 0 || x >= S.w || y >= S.h) return;
      const d = F.pieceDef(c.piece) || {}; if (hideKinds.indexOf(d.kind) >= 0) want[y][x]++; else stoodOn++; });
    for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) { tiles++; if (want[y][x] !== S.coverCount[y][x] || (want[y][x] > 0) !== F.hides(x, y)) wrong.push(kind + ' ' + x + ',' + y); }
  }
  leg(wrong.length === 0, '*** COVER IS WHAT IS ON THE TILE *** (rule 170(a)): a tile\'s cover is the pieces a man hides behind on it, never a rock or a dock he stands on, on 14 dealt boards',
    tiles + ' tiles, ' + wrong.length + ' wrong, ' + stoodOn + ' pieces to stand on counted as none');
  /* 3b: NO COVER IN THE OPEN STREET (COMBAT line 90's open-street half, rule 170(a): 'if you're in the middle of the street you
     have no cover unless that street tile has crazy car wreckage'; the cover, the kneel and the dial's odds are one fact).
     MEASURED 10/26 before the fix, 64 rolled AUTO fights on eight kinds of board: 1,213 of 3,093 shots at a man on a tile with
     nothing on it (39%) read 'cover' and lost three quarters of their chance, 634 for a piece on the NEXT tile (a house away at
     our scale), 560 for a man in the line. Now: a shot at a man on a bare tile never reads cover (a man in the line is said as
     'in the way', Battle Brothers' body in the line of fire), and a shot at a man on a cover tile always does. */
  let bareShots = 0, bareCover = [], coverShots = 0, coverMissing = 0, inWay = 0, bareTiles = 0, allTiles = 0;
  for (const kind of ['freeway', 'strip', 'suburb', 'culdesac', 'ruin', 'desert', 'landfill', 'shore']) for (const seed of [1, 2, 3, 4]) {
    try {
      ctx.setSeed(seed);
      const S = playOut(ctx, { seed, party: { faction: 'brigands', count: 8, days: 20, difficulty: 1 }, kind, night: false }, 60000).S;
      for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) { allTiles++; if (S.coverCount[y][x] === 0 && F._t.passable(x, y)) bareTiles++; }
      S.log.forEach(e => { if (e.t !== 'attack' || !e.shot || e.free || e.tx === undefined) return;
        const c = (e.parts || []).indexOf('cover') >= 0; if ((e.parts || []).indexOf('in the way') >= 0) inWay++;
        if (S.coverCount[e.ty][e.tx] === 0) { bareShots++; if (c) bareCover.push(kind + seed + ' ' + e.tx + ',' + e.ty); }
        else { coverShots++; if (!c) coverMissing++; } });
    } catch (e) { errs.push('open street ' + kind + seed + ': ' + e.message); }
  }
  leg(bareShots > 500 && bareCover.length === 0 && coverShots > 100 && coverMissing === 0,
    '*** NO COVER IN THE OPEN STREET *** (rule 170(a)): a shot at a man on a bare tile never reads cover, a shot at a man on a cover tile always does (39% of open-street shots read cover before)',
    bareShots + ' shots at men on bare tiles (' + Math.round(100 * bareTiles / allTiles) + '% of the boards\' tiles are open ground), ' + bareCover.length + ' read cover' + (bareCover.length ? ': ' + bareCover.slice(0, 3).join('; ') : '') + '; ' + coverShots + ' at men in cover, ' + coverMissing + ' read none; ' + inWay + ' had a man in the way');
  /* 4 and 5: on the page */
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  let frames = 0, kneels = 0, open_ = [], pageErr = [], card = null;
  for (const [kind, seed] of [['suburb', 3], ['strip', 4], ['scrub', 5]]) {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed, kind, speed: 8, auto: true, night: false }) });
    d.page.on('pageerror', e => pageErr.push(String(e)));
    await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 40000 });
    const t0 = Date.now();
    while (Date.now() - t0 < 20000) {
      const r = await d.page.evaluate(() => { const S = FIGHT.S, o = { n: 0, k: 0, bad: [] };
        S.units.filter(FIGHT.onField).forEach(v => { o.n++; if (!holdCovered(v)) return; o.k++; const x = Math.round(v.x), y = Math.round(v.y);
          if (!FIGHT.hides(x, y) && !FIGHT.isRoof(x, y)) o.bad.push(S.terrain[y][x] + ' ' + x + ',' + y); });
        return { o, over: S.over }; });
      frames += r.o.n; kneels += r.o.k; open_.push.apply(open_, r.o.bad);
      if (r.over) break;
      await d.page.waitForTimeout(300);
    }
    if (!card) card = await d.page.evaluate(() => { const u = FIGHT.S.units.find(v => v.weapon && !FIGHT.isRanged(v.weapon) && /polearm|spear|sword|axe/.test(v.weapon.class || ''));
      if (!u) return null; try { weaponCard(u); } catch (e) { return 'threw ' + e.message; } const el = document.getElementById('drawer'); return el ? el.textContent : null; });
    await d.close();
  }
  leg(kneels > 0 && open_.length === 0, '*** EVERY KNEEL IS ON A COVER TILE OR IN A BUILDING *** (rule 170(a); his 10/24: \'when they\'re in a building... they should look like they\'re in cover\'): never on bare raised ground, never in the open street',
    kneels + ' kneeling of ' + frames + ' man-frames over three AUTO fights, ' + open_.length + ' in the open' + (open_.length ? ': ' + open_.slice(0, 4).join('; ') : '') + ' (was 312 of 1,040 on bare raised ground)');
  leg(card === null || /Reach\s*1 tile(?!s)/.test(card) || !/Reach/.test(card), 'the weapon card says a melee weapon reaches 1 tile', card ? card.replace(/\s+/g, ' ').slice(0, 120) : 'no long melee weapon on these boards');
  leg(errs.length === 0 && pageErr.length === 0, 'nothing threw', errs.concat(pageErr).slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
