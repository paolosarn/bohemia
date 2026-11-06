#!/usr/bin/env node
/* NO CAP ON HOW MANY FIGHT (COMBAT 7, rule 378, ask line 407; Paolo 11/3: 'make sure there's not a cap on the amount of players on
   screen, enemy and my company... it feels like there's a cap... make sure there's no coded cap').
   MEASURED BEFORE (the coordinator, then this lane): slices/BOHEMIA_FIGHT.html rowsOf put his men in two rows of nine
   (ours.formation.slots_per_row) and centred() wrote a 19th and past at a negative slot: 19 of his left 1 off the board, 24 left 3,
   30 left 6. NOW: past two rows his men take a third row and more behind (deployCrew), their side's columns never drop a man
   (place), anybody with no tile on his side takes the nearest open one (anyOpen), and the board is dealt again a block taller until
   both sides' columns hold their men (setup: dealBoard, S.grown). The road's cap of 8 is WORLD 8's (BOHEMIA_CITY_WORLD.html).
   Legs:
   N1 30 AGAINST 40 (headless, three kinds of ground, three seeds each): all 70 on the board, nobody at -1 or off it, no two on a
      tile, his men on his side of the gap and theirs on theirs; the old rows (the brain before) left men off
   N2 THE BOARD GROWS, NOTHING BLACK (headless): 60 against 100: everyone stands; the board grew by whole blocks and every block of
      it is dealt (no empty block, no black margin)
   N3 A HANDED LINE OF EIGHTEEN AND SIX MORE: a roster's front and back rows full and six men the roster left out: all 24 stand
   N4 AMENDED (rule 378 amended, COMBAT 8): 14 handed with no cap, 12 stand (Battle Brothers' field cap, ours.field_size), 2 named in
      the reserve; N6 the Block Watch's door cap of 16 (origins.json): 20 handed, 16 stand, 4 in the reserve; N7 their side no cap
      (12 against 40, all 52 stand); N8 the reserve is the rest of his line by name
   N5 ON HIS PHONE (upright 390 x 844, the fight page, AUTO): 30 against 40, all 70 on the board; the page's draw stays inside a
      60 fps frame (mean under 16.7 ms) or within 1.6 times a fight of twelve a side on the same board and seed; nothing threw
   Run: node gates/no_cap_on_how_many_fight_gate.js [--headless-only] */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const mk = (nm, nb) => { const company = [], band = []; for (let i = 0; i < nm; i++) company.push(i % 3 === 2 ? { background: 'militia', gear: { main: 'crossbow' } } : {});
  for (let i = 0; i < nb; i++) band.push(i % 4 === 3 ? 'brigand_marksman' : 'brigand_thug'); return { company, band }; };
function stood(F) {
  const S = F.S, off = u => !(Number.isInteger(u.x) && Number.isInteger(u.y) && u.x >= 0 && u.y >= 0 && u.x < S.w && u.y < S.h);
  const seen = {}; let stacked = 0; S.units.forEach(u => { if (off(u)) return; const k = u.x + ',' + u.y; if (seen[k]) stacked++; seen[k] = 1; });
  const mine = S.units.filter(u => u.side === 'you'), th = S.units.filter(u => u.side === 'them');
  return { his: mine.length, theirs: th.length, off: S.units.filter(off).length, stacked, wrongSide: mine.filter(u => !off(u) && u.x >= S.cols[1]).length + th.filter(u => !off(u) && u.x <= S.cols[0]).length, board: S.w + 'x' + S.h, grown: S.grown || 0 };
}
function setup(ctx, nm, nb, sd, kind) { const F = ctx.FIGHT, P = mk(nm, nb); ctx.setSeed(sd);
  F.setup({ kind, formation: null, deploy: false, company: P.company, cap: nm, band: P.band, party: { band: P.band, count: nb, rolled: true } }); return stood(F); }

/* N1 */
{
  const ctx = engine(), rows = [];
  for (const kind of ['suburb', 'street', 'desert']) for (const sd of [1, 2, 3]) rows.push(Object.assign({ kind, sd }, setup(ctx, 30, 40, sd, kind)));
  const bad = rows.filter(r => r.his !== 30 || r.theirs !== 40 || r.off || r.stacked || r.wrongSide);
  /* the brain before: the old rows (two of nine, the spill written at a negative slot) */
  const before = engine({ patch: r => r.replace("    const more = fr.slice(n); fr = fr.slice(0, n);   /* up to eighteen the rows are what they always were; past them, behind */",
    "    return { front: centred(fr), back: centred(bk) };") });
  const was = setup(before, 30, 40, 1, 'suburb');
  leg(bad.length === 0 && rows.length === 9 && was.off > 0, '*** N1 30 AGAINST 40 ***: all 70 stand on the board, nobody off it or stacked, each side on its own side (the rows before: ' + was.off + ' of his left off)',
    bad.length ? JSON.stringify(bad.slice(0, 3)) : rows.map(r => r.kind + '/' + r.sd + ' ' + r.board).join(', '));
}

/* N2 */
{
  const ctx = engine(), F = ctx.FIGHT, bt = ctx.DB.ground.block_tiles, out = [];
  for (const sd of [1, 2, 3]) { const r = setup(ctx, 60, 100, sd, 'suburb'); const B = F.S.boardDef.blocks || [];
    const whole = F.S.h % bt === 0 && F.S.w % bt === 0 && B.length === F.S.h / bt && B.every(row => row.length === F.S.w / bt && row.every(Boolean));
    out.push(Object.assign(r, { whole })); }
  leg(out.every(r => r.his === 60 && r.theirs === 100 && !r.off && !r.stacked && !r.wrongSide && r.whole) && out.some(r => r.grown > 0),
    '*** N2 THE BOARD GROWS, NOTHING BLACK ***: 60 against 100, everyone stands, the board a block taller or more, every block dealt', JSON.stringify(out));
}

/* N3 */
{
  const ctx = engine(), F = ctx.FIGHT, P = mk(24, 10), front = [], back = [];
  for (let i = 0; i < 9; i++) { front.push(i); back.push(9 + i); }
  ctx.setSeed(4); F.setup({ kind: 'suburb', formation: { front, back }, deploy: false, company: P.company, cap: 24, band: P.band });
  const r = stood(F);
  leg(r.his === 24 && !r.off && !r.stacked && !r.wrongSide, '*** N3 A HANDED LINE OF EIGHTEEN AND SIX MORE ***: the roster\'s two rows full, six left out: all 24 stand', JSON.stringify(r));
}

/* N4 AMENDED (COMBAT 8, rule 378 amended 11/3, ask line 413: 'there is a 12 man cap in our game bro! Could be 14 with a certain
   origin, how Battle Brothers does it?'): HIS COMPANY TAKES BATTLE BROTHERS' CAP, THE ENEMY DOES NOT. Measured before (main 7889d375):
   14 handed with no cap, 14 on the board (COMBAT 7's no-cap reading); a 20-man Block Watch at its door's 16, the four past it gone
   without a word. */
{
  const ctx = engine(), F = ctx.FIGHT, P = mk(14, 6); ctx.setSeed(5);
  F.setup({ kind: 'suburb', formation: null, deploy: false, company: P.company, band: P.band });
  const r = stood(F), rs = F.S.reserve || [];
  leg(r.his === 12 && !r.off && rs.length === 2 && rs.every(m => m && m.name),
    '*** N4 HIS COMPANY TAKES BATTLE BROTHERS\' CAP *** (rule 378 amended): 14 handed with no cap, 12 on the board (ours.field_size), the 2 past it named in the reserve, nobody off the board',
    JSON.stringify(r) + '; reserve ' + rs.map(m => m.name).join(', '));
}
/* N6: the Block Watch (origins.json 'watch', field_cap 16, the door hands it as cap) */
{
  const ctx = engine(), F = ctx.FIGHT, OG = require(path.join(ROOT, 'records/target/bb/origins.json'));
  const watch = OG.origins.filter(o => o.id === 'watch')[0], P = mk(20, 10); ctx.setSeed(6);
  F.setup({ kind: 'suburb', formation: null, deploy: false, company: P.company, cap: watch.field_cap, band: P.band });
  const r = stood(F), rs = F.S.reserve || [];
  leg(watch.field_cap === 16 && watch.roster_cap === 25 && r.his === 16 && rs.length === 4 && !r.off,
    '*** N6 THE BLOCK WATCH TAKES SIXTEEN *** (Battle Brothers\' Peasant Militia, bb_all/1533: 16 into a fight, 25 kept): 20 handed at its door\'s cap, 16 stand, 4 in the reserve',
    'origins.json watch ' + watch.field_cap + '/' + watch.roster_cap + '; ' + JSON.stringify(r) + '; reserve ' + rs.length);
}
/* N7: the enemy keeps no cap; N8: YOU always stands */
{
  const ctx = engine(), F = ctx.FIGHT, P = mk(14, 40); ctx.setSeed(7);
  F.setup({ kind: 'suburb', formation: null, deploy: false, company: P.company, band: P.band, party: { band: P.band, count: 40, rolled: true } });
  const r = stood(F);
  leg(r.his === 12 && r.theirs === 40 && !r.off && !r.stacked, '  N7 their side keeps no cap: 12 of his against 40 of theirs, all 52 on the board', JSON.stringify(r));
  const Q = mk(14, 6); Q.company.forEach((m, i) => { m.name = 'M' + i; }); ctx.setSeed(8);
  const base = ctx.DB.ours.crew.value; Q.company = Q.company.map((m, i) => Object.assign({}, m));
  F.setup({ kind: 'suburb', formation: null, deploy: false, company: Q.company, band: Q.band });
  const mains = F.S.units.filter(u => u.side === 'you' && u.main).length, rs = F.S.reserve || [];
  leg(F.S.units.filter(u => u.side === 'you').length === 12 && rs.length === 2, '  N8 the cap picks the first twelve of his line, and the reserve is the rest by name', 'on the board ' + F.S.units.filter(u => u.side === 'you').length + ', reserve ' + rs.map(m => m.name).join(', ') + ', mains ' + mains + ' (ours.crew ' + base.length + ')');
}

(async () => {
  if (process.argv.indexOf('--headless-only') > 0) { console.log('\n=== NO CAP ON HOW MANY FIGHT: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); }
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const errs = [];
  /* the same board and seed, a fight of twelve a side and one of 30 against 40, back to back: the page's own draw timed */
  const run = async (nm, nb, shot) => {
    const P = mk(nm, nb);
    const d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 7, speed: 1, kind: 'suburb', deploy: false, formation: null, auto: true, company: P.company, cap: nm, band: P.band, party: { band: P.band, count: nb, rolled: true } }) });
    const p = d.page; p.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
    try {
      await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 60000 });
      const at = await p.evaluate(() => { const S = FIGHT.S, off = u => !(u.x >= 0 && u.y >= 0 && u.x < S.w && u.y < S.h);
        window.__DR = []; const od = window.draw; window.draw = function (now) { const t = performance.now(); od(now); window.__DR.push(performance.now() - t); };
        return { his: S.units.filter(u => u.side === 'you').length, theirs: S.units.filter(u => u.side === 'them').length, off: S.units.filter(off).length, board: S.w + 'x' + S.h }; });
      await p.waitForTimeout(8000);
      if (shot) await p.screenshot({ path: shot, scale: 'css' });
      const fr = await p.evaluate(() => { const a = window.__DR.slice(5); return { n: a.length, mean: a.reduce((s, x) => s + x, 0) / Math.max(1, a.length), p95: a.slice().sort((x, y) => x - y)[Math.floor(a.length * 0.95)] || 0 }; });
      return { at, frames: fr.n, mean: +fr.mean.toFixed(1), p95: +fr.p95.toFixed(1) };
    } finally { await d.close(); }
  };
  try {
    const small = await run(12, 12), big = await run(30, 40, process.env.NOCAP_SHOT);
    leg(big.at.his === 30 && big.at.theirs === 40 && big.at.off === 0 && big.frames > 50 && small.frames > 50 && (big.mean < 16.7 || big.mean <= small.mean * 1.6),
      '*** N5 ON HIS PHONE *** [upright 390 x 844, AUTO]: 30 against 40, all 70 on the board; the draw inside a 60 fps frame or within 1.6 times twelve a side on the same board',
      JSON.stringify({ twelve_a_side: small, thirty_against_forty: big }));
  } catch (e) { leg(false, 'N5 ran', String(e.message).slice(0, 200)); }
  leg(errs.length === 0, '  nothing threw', errs.slice(0, 2).join(' | ') || 'none');
  console.log('\n=== NO CAP ON HOW MANY FIGHT: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
