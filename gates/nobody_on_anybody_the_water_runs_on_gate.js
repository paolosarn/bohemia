#!/usr/bin/env node
/* NOBODY ON ANYBODY, THE WATER RUNS ON (COMBAT, this lane's round of 10/25 on EYES' playtest rows, rule 150 and rule 164 item 13;
   Paolo's first votes 9/21: 'why are so many people on top of each other... looks like complete dogshit'; 9/28: 'for the
   combat a tile is as big as a house'; 10/24 evening, item 13: 'the best it's ever been... a little glitching... more organic';
   records/BOHEMIA_EYES_THE_PLAYTEST_ROUND_2_10_25_26.md, rows 9, 10 and 22; records/BOHEMIA_COMBAT_NOBODY_ON_ANYBODY_THE_WATER_RUNS_ON_10_25_26.md).

   Legs, on the real fight page (slices/BOHEMIA_FIGHT.html) the way the demo opens it:
   1. [eyes: men on men], EYES' own case: four of his in one column, the upright phone's open: no man's body covers more than a
      fifth of another's (it was 62%: a 98 px man on 37 px rows, each over the two behind);
   2. the man there is never taller than 1.8 rows of his ground, never under half his size, and pinched in to the near stop he
      is 1.8 rows of his ground there too, a man and more (RE-AIMED 10/26 by COMBAT TWO, rule 288(b): the zoom scales the man and
      his ground together; rule 21's 'his size again where the ground holds him' was the dead walk's, newest wins);
   3. the file stands STAGGERED: two men of one column stand half a tile apart sideways on the glass, each inside his own tile;
   4. the rules never see it: every man on a whole tile, the line dealt the way it was (a man touching the next in his column);
   5. the same on the flipped phone and the computer: nobody over a fifth of anybody, never under half his size;
   6. [eyes: toy town], the men's side: at the upright open a man stands at most 1.8 rows, so a one-storey house tile is never
      drawn under a man four times its height again (measured: the man over the row);
   7. [eyes: board seams], THE WATER RUNS ON: a board dealt with the shore has it on its top row end to end and nowhere else,
      each shore block beside its own mirror, the mirror's terrain mirrored with it; no dry block's row is cut by a canal;
   8. and on the glass: at every join of the canal the bank meets itself (the mud's top edge on the two sides of the join within
      a few pixels), and the map above the board is the canal's far bank (the shore mirrored top to bottom), never a straight
      line where water meets sand;
   9. the map around the board comes in softly: the step of shade at the board's edge is gone (the row of glass just outside the
      board against the row just inside: under a third of the old 22% step); and THE GROUND RUNS ON: where two blocks of open
      ground meet the seam is no harder a line than the ground's own texture (rule 164 item 13, 'more organic');
   10. nothing threw.
   Run: node gates/nobody_on_anybody_the_water_runs_on_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== NOBODY ON ANYBODY, THE WATER RUNS ON GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const CREW4 = [{ background: 'companion_2hand', name: 'YOU' }, { background: 'companion_1hand', name: 'RAUL' }, { background: 'messenger', name: 'JAMAL' }, { background: 'companion_ranged', name: 'DANTE' }];
const IDLE = Number(require('fs').readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8').match(/MAN_DEFAULT = (\d+)/)[1]);

/* every man's body on the glass: his feet where the page draws them, his head a man's height up, 0.3 of his height across */
const BODIES = () => {
  const on = FIGHT.S.units.filter(FIGHT.onField), h = manH();
  const b = on.map(v => { const X = sx((dx(v) + .5) * FIGHT_UI.tw), feet = sy((dy(v) + .9) * FIGHT_UI.th); return { n: v.name, x: v.x, y: v.y, X, l: X - h * .15, r: X + h * .15, t: feet - h, b: feet }; });
  let worst = 0, pair = '';
  b.forEach(a => b.forEach(c => { if (c === a || c.b <= a.b) return;
    const ox = Math.max(0, Math.min(a.r, c.r) - Math.max(a.l, c.l)), oy = Math.max(0, Math.min(a.b, c.b) - Math.max(a.t, c.t)), f = ox * oy / ((a.r - a.l) * (a.b - a.t));
    if (f > worst) { worst = f; pair = c.n + ' over ' + a.n; } }));
  const row = FIGHT_UI.th * FIGHT_UI.zoom, tile = FIGHT_UI.tw * FIGHT_UI.zoom;
  /* two of his in one column, one row apart: how far apart sideways they stand, in tiles */
  const mine = b.filter(q => FIGHT.S.units.find(u => u.name === q.n).side === 'you');
  const pairs = []; mine.forEach(a => mine.forEach(c => { if (a.x === c.x && c.y === a.y + 1) pairs.push(Math.abs(a.X - c.X) / tile); }));
  const inTile = b.every(q => Math.abs(q.X - sx((q.x + .5) * FIGHT_UI.tw)) <= tile / 2 - h * .15 + 1);
  return { worst, pair, man: h, row, tile, pairs, inTile, whole: FIGHT.S.units.every(u => !FIGHT.onField(u) || (u.x === Math.round(u.x) && u.y === Math.round(u.y))) };
};

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const errs = [];
  const boot = async (o, profile) => { const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: profile || 'phone_portrait', arm: 'window.FIGHT_OPTS=' + JSON.stringify(o) });
    d.page.on('pageerror', e => errs.push(String(e)));
    await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && !FIGHT_UI.glide, null, { timeout: 40000 });
    await d.page.waitForTimeout(1500); return d; };
  const ev = (d, f, a) => d.page.evaluate(f, a);

  /* 1 to 4, 6: EYES' own case on his phone */
  {
    const d = await boot({ seed: 7, kind: 'suburb', company: CREW4, cap: 12, formation: null, party: { count: 4, days: 2, difficulty: 1, faction: 'brigands' }, teach: false });
    const m = await ev(d, '(' + BODIES.toString() + ')()');
    const near = await ev(d, () => { const z = FIGHT_UI.zoom; FIGHT_UI.zoom = FIGHT_UI.near; const h = Math.round(manH()), row = FIGHT_UI.th * FIGHT_UI.zoom; FIGHT_UI.zoom = z; return { h, row }; });
    const col = await ev(d, () => { const ys = FIGHT.S.units.filter(u => u.side === 'you' && FIGHT.onField(u)).map(u => u.x + ',' + u.y); return ys.join(' '); });
    leg(m.worst <= 0.2, '*** NOBODY STANDS ON ANYBODY *** (his first votes; EYES [eyes: men on men]): at the upright phone\'s open, four of his in a column, no man\'s body covers more than a fifth of another\'s',
      Math.round(100 * m.worst) + '% the worst' + (m.pair ? ' (' + m.pair + ')' : '') + ', was 62% (DANTE over JAMAL)');
    leg(m.man <= Math.max(1.8 * m.row * 1.06, IDLE / 2) + 1 && m.man >= IDLE / 2 - 1 && Math.abs(near.h - 1.8 * near.row) <= 1.8 * near.row * 0.06 + 1 && near.h >= IDLE,
      'the man is never taller than 1.8 rows of his ground nor under half his size, and at the near stop 1.8 rows of his ground too, a man and more (rule 288(b): the zoom scales him with his ground)',
      Math.round(m.man) + ' px on ' + Math.round(m.row) + ' px rows (' + (m.man / m.row).toFixed(2) + ' rows), ' + near.h + ' px on ' + Math.round(near.row) + ' px rows at the near stop');
    leg(m.pairs.length > 0 && m.pairs.every(p => p >= 0.45) && m.inTile, '*** THE FILE STANDS STAGGERED ***: two of his in one column stand half a tile apart sideways, each inside his own tile',
      m.pairs.map(p => p.toFixed(2)).join(', ') + ' of a tile' + (m.inTile ? ', every man inside his tile' : ', A MAN OUT OF HIS TILE'));
    leg(m.whole && /(\d+),(\d+).*\1,(\d+)/.test(col), 'the rules never see it: every man on a whole tile, the line dealt as before (men of one column side by side)', col);
    leg(m.man / m.row <= 1.8 * 1.06 + 0.01, '[eyes: toy town], the men\'s side: at the open a man stands at most 1.8 rows of the ground and the hair of a whole size (he stood 2.65 rows, four houses tall)', (m.man / m.row).toFixed(2) + ' rows');
    await d.close();
  }
  /* 5: the flipped phone and the computer */
  for (const pr of ['phone_landscape', 'computer']) {
    const d = await boot({ seed: 7, kind: 'suburb', company: CREW4, cap: 12, formation: null, party: { count: 4, days: 2, difficulty: 1, faction: 'brigands' }, teach: false }, pr);
    const m = await ev(d, '(' + BODIES.toString() + ')()');
    leg(m.worst <= 0.2 && m.man >= IDLE / 2 - 1, pr + ': nobody over a fifth of anybody, never under half his size', Math.round(100 * m.worst) + '% the worst, the man ' + Math.round(m.man) + ' px on ' + Math.round(m.row) + ' px rows');
    await d.close();
  }
  /* 7 to 9: THE WATER RUNS ON, on the computer (where EYES saw the seam at x 807 of 1440) */
  {
    let d = null, deal = null;
    for (const seed of [3, 11, 19, 27, 35]) {
      d = await boot({ seed, kind: 'shore', night: false, company: CREW4, cap: 12, formation: null, party: { count: 4, days: 2, difficulty: 1, faction: 'brigands' }, teach: false }, 'computer');
      deal = await ev(d, () => ({ blocks: FIGHT.S.boardDef.blocks, crop: !!FIGHT.S.crop, w: FIGHT.S.w, h: FIGHT.S.h,
        water: FIGHT.S.terrain.map(r => r.map(t => t === 'blocked' || t === 'water' ? 1 : 0).join('')) }));
      if (!deal.crop && deal.blocks.some(r => r.some(n => /^shore/.test(n)))) break;
      await d.close(); d = null;
    }
    if (!d) { leg(false, 'a shore board is dealt in five seeds', 'none'); done(); return; }
    const top = deal.blocks[0], rest = deal.blocks.slice(1);
    const pairs = top.every((n, i) => /^shore\.\d$/.test(n.split('|')[0]) && n.split('|')[0] === top[0].split('|')[0] && (n.indexOf('|h') >= 0) === (i % 2 === 1));
    leg(pairs && rest.every(r => r.every(n => !/^shore/.test(n))), '*** THE WATER RUNS ON *** ([eyes: board seams]): the shore takes the top row end to end, each block beside its own mirror, and nowhere else',
      deal.blocks.map(r => r.join(' ')).join(' / '));
    const bt = 5, mir = deal.water.slice(0, bt).every(r => { let ok = true; for (let b = 0; b + 1 < r.length / bt; b += 2) ok = ok && r.slice(b * bt, b * bt + bt) === r.slice((b + 1) * bt, (b + 1) * bt + bt).split('').reverse().join(''); return ok; });
    leg(mir, 'the mirror\'s water is the mirror\'s: the canal\'s tiles across the top row read the same both ways at every pair', deal.water.slice(0, 2).join(' | '));
    /* the glass: the camera on the canal's joins, the bank on each side of every join, and the far bank above */
    const g = await ev(d, async () => {
      FIGHT_UI.glide = null; FIGHT_UI.pinched = true; FIGHT_UI.openUntil = 1e12;
      const bt = DB.ground.block_tiles, out = { joins: [], ring: null, step: null };
      FIGHT_UI.zoom = FIGHT_UI.near * 0.6; FIGHT_UI.cx = FIGHT.S.w * FIGHT_UI.tw / 2; FIGHT_UI.cy = bt * FIGHT_UI.th * 0.4; clampCam();
      await new Promise(r => setTimeout(r, 400));
      const c = document.getElementById('cv'), D = c.width / innerWidth, g = c.getContext('2d');
      const lum = (x, y) => { const p = g.getImageData(Math.round(x * D), Math.round(y * D), 1, 1).data; return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]; };
      /* the mud's top edge under a column of glass: the first point down from the water where it stays bright */
      const bank = (x, y0, y1) => { for (let y = y0; y < y1; y++) { let ok = true; for (let k = 0; k < 6; k++) if (lum(x, y + k) < 115) { ok = false; break; } if (ok) return y; } return -1; };
      const y0 = Math.max(TOPH, sy(0)), y1 = Math.min(H - BOTH, sy(bt * FIGHT_UI.th));
      for (let bx = 1; bx < FIGHT.S.w / bt; bx++) {
        const X = sx(bx * bt * FIGHT_UI.tw); if (X < 20 || X > innerWidth - 20) continue;
        out.joins.push({ at: Math.round(X), l: bank(X - 6, y0, y1), r: bank(X + 6, y0, y1) });
      }
      out.ring = (surround().filter(q => q.by === -1 && q.bx >= 0 && q.bx < FIGHT.S.w / bt).map(q => q.n));
      /* THE GROUND RUNS ON: the seam under the canal's bank (the shore row over a dry row): how hard a line it is, the change from
         the row of glass just above it to the row just below, against the same change one and two tiles further down (the ground's
         own texture); a straight cut stands far above its neighbours */
      const rowL = (y) => { const d = g.getImageData(0, Math.round(y * D), c.width, 1).data, o = []; for (let i = 0; i < d.length; i += 4) o.push(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]); return o; };
      const mean = (r) => r.reduce((t, v) => t + v, 0) / r.length, step = (y) => Math.abs(mean(rowL(y - 3)) - mean(rowL(y + 3)));   /* a straight seam is a shift in the whole row's brightness; texture is not */
      FIGHT_UI.cy = bt * FIGHT_UI.th; clampCam(); await new Promise(r => setTimeout(r, 400));
      const Ys = sy(bt * FIGHT_UI.th), th = FIGHT_UI.th * FIGHT_UI.zoom;
      out.seam = { at: step(Ys), near: [step(Ys + th * 0.8), step(Ys + th * 1.6), step(Ys + th * 2.4)], soft: (FIGHT_UI.feather || []).length };
      /* the shade's step at the board's top edge: a row of glass just outside against one just inside, on dry ground */
      return out;
    });
    leg(g.joins.length > 0 && g.joins.every(j => j.l > 0 && j.r > 0 && Math.abs(j.l - j.r) <= 4), 'on the glass the bank meets itself at every join of the canal (the mud\'s top edge either side of the join within 4 px; EYES saw it jump at x 807)',
      g.joins.map(j => 'x ' + j.at + ': ' + j.l + ' | ' + j.r).join(', '));
    const nearMax = Math.max.apply(null, g.seam.near);
    leg(g.seam.soft > 0 && g.seam.at <= Math.max(2, nearMax * 2), '*** THE GROUND RUNS ON *** (rule 164 item 13, \'more organic\'): the seam under the canal\'s bank shifts the row\'s brightness no more than twice the ground\'s own does a tile further on (a straight cut shifted it 19.7 against 2.4)',
      'the row\'s brightness shifts ' + g.seam.at.toFixed(1) + ' across the seam against ' + g.seam.near.map(v => v.toFixed(1)).join(', ') + ' across the rows further on, ' + g.seam.soft + ' soft joins on the board');
    leg(g.ring.length > 0 && g.ring.every(n => /^shore\.\d\|.*v/.test(n)), 'the map above the canal is its far bank: the shore mirrored top to bottom over every block of the top row', g.ring.join(' '));
    await d.close();
  }
  /* 9: the shade comes in softly, on the desert (the strip above Church's board, EYES 10/25 q16) */
  {
    const d = await boot({ seed: 7, kind: 'scrub', night: false, company: CREW4, cap: 12, formation: null, party: { count: 4, days: 2, difficulty: 1, faction: 'brigands' }, teach: false }, 'computer');
    const s = await ev(d, async () => {
      FIGHT_UI.glide = null; FIGHT_UI.pinched = true; FIGHT_UI.openUntil = 1e12; FIGHT_UI.zoom = FIGHT_UI.near * 0.6; FIGHT_UI.cx = FIGHT.S.w * FIGHT_UI.tw / 2; FIGHT_UI.cy = 0; clampCam();
      await new Promise(r => setTimeout(r, 400));
      const c = document.getElementById('cv'), D = c.width / innerWidth, g = c.getContext('2d'), Y = sy(0);
      const band = (y) => { const d = g.getImageData(0, Math.round(y * D), c.width, 2).data; let t = 0, n = 0; for (let i = 0; i < d.length; i += 4) { t += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; n++; } return t / n; };
      return { outside: band(Y - 3), inside: band(Y + 3), Y };
    });
    const step = (s.inside - s.outside) / Math.max(1, s.inside);
    leg(Y_OK(s) && step < 0.22 / 3, '*** THE MAP AROUND THE BOARD COMES IN SOFTLY ***: no step of shade along the board\'s top edge (the row just outside against the row just inside, under a third of the old 22%)',
      (100 * step).toFixed(1) + '% darker just outside, at y ' + Math.round(s.Y));
    await d.close();
  }
  leg(errs.length === 0, 'nothing threw', errs.slice(0, 2).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
function Y_OK(s) { return s.Y > 0; }
