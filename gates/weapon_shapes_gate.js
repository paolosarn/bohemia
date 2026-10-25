#!/usr/bin/env node
/* WEAPON SHAPES (COMBAT [weapon shapes], rules 33i and 46d, Paolo 9/24: 'in Battle Brothers some weapons hit multiple tiles at the
   same time, six or three; a machine gun is comparable to a greatsword or a battle axe'). Battle Brothers' sweeps as shapes on our
   squares, from records/target/bb/weapon_shapes.json, each row its wiki page.

   Legs, headless on the live fight's rules (tools/bohemia_fight_headless.js):
   1. THE TABLE IS BATTLE BROTHERS': every weapon skill whose words strike more than one tile has a row, the row's quote is that
      skill's own words in weapons.json, its page is in the library, and its count is the number in those words (a line and an arc
      exactly; 'all around' our whole ring of eight for their six; the cone the wedge's slope is the tangent of half its angle);
   2. THE SHAPES ON OUR BOARD: Split the man and the one behind; Swing the man and the next two counterclockwise as he sees it;
      Round Swing all eight; the shotgun's cone the man shot and four behind on every one of the eight headings;
   3. FOE ONLY, EACH HIS OWN BLOW: an axe's Round Swing ringed by three of his and one of its own strikes the three, each his own
      roll, and passes its own man over;
   4. THE SHOTGUN'S BLAST: one shot at a man with two behind him in the cone strikes all three, spends one round and one AP cost,
      and never his own man standing in it;
   5. THE SLEDGE SWEEPS ON HIS WORD: its blow is Smite (one man), its sweep Shatter (three); the greatsword carries Split and Swing;
   6. THE BRAINS SWEEP WHEN IT PAYS: an axe man of theirs with two of ours beside him swings Round Swing, with one a plain blow;
   and on his phone (390 x 844), the real page, real taps:
   7. LIT BEFORE THE SWING: his shotgun man taps a man of theirs: the cone's tiles are lit, the men it strikes marked, the line
      says how many; the second tap fires it and every man it caught is heard;
   8. THE SWEEP SQUARE: his sledge man has a SHATTER square with its AP; a tap arms it, a tap on a man lights the arc and the big
      button says SHATTER; the second tap swings it and every man it caught is heard;
   9. nothing threw.
   Run: node gates/weapon_shapes_gate.js */
'use strict';
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('WEAPON SHAPES: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const show = r => r.map(q => q.x + ',' + q.y).join(' ');
const same = (a, b) => a.length === b.length && a.every(q => b.some(p => p.x === q.x && p.y === q.y));

const SH = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/weapon_shapes.json'), 'utf8'));
const WP = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/weapons.json'), 'utf8'));
const ctx = engine(), F = ctx.FIGHT, T = F._t;
const row = id => WP.rows.filter(r => r.id === id)[0];

/* ---------------- 1. the table ---------------- */
const many = {};
WP.rows.forEach(r => r.skills.forEach(s => { if (/Hits (up to )?\d+ targets|tiles? behind the target/i.test(s.effect || '')) (many[s.name] = many[s.name] || []).push(s.effect); }));
let tar = '';
try { tar = execSync('tar -tzf ' + JSON.stringify(path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz')), { maxBuffer: 1 << 26 }).toString(); } catch (_e) {}
const bad = [];
Object.keys(many).forEach(n => {
  const r = SH.rows.filter(x => x.skill === n)[0];
  if (!r) return bad.push(n + ': no row');
  if (!many[n].every(e => e.indexOf(r.bb_says) >= 0)) bad.push(n + ': the quote is not its words');
  const member = String(r.source).split(':')[1];
  if (!member || tar.indexOf(member) < 0) bad.push(n + ': page not in the library');
  const num = Number((r.bb_says.match(/\d+/) || [])[0]);
  if (r.kind === 'line' || r.kind === 'arc') { if (r.count !== num) bad.push(n + ': count ' + r.count + ' against ' + num); }
  if (r.kind === 'ring') { if (r.bb_count !== num || r.count !== 8) bad.push(n + ': ring ' + r.count + '/' + r.bb_count); }
  if (r.kind === 'cone') {
    if (r.bb_count - 1 !== num) bad.push(n + ': cone ' + r.bb_count + ' against ' + num + ' behind');
    if (Math.abs(Math.tan(r.wedge_degrees / 2 * Math.PI / 180) - r.wedge_half_slope) > 0.001) bad.push(n + ': slope is not tan(' + r.wedge_degrees + '/2)');
  }
});
SH.rows.forEach(r => { if (!many[r.skill]) bad.push(r.skill + ': a row with no skill behind it'); });
leg(bad.length === 0 && Object.keys(many).length >= 7,
  '*** THE TABLE IS BATTLE BROTHERS\' ***: every skill that strikes more than one tile has its row, its own words, its page, its count',
  Object.keys(many).length + ' sweeps in weapons.json (' + Object.keys(many).join(', ') + ')' + (bad.length ? '; ' + bad.join('; ') : ''));

/* ---------------- 2. the shapes ---------------- */
ctx.setSeed(5); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, band: ['brigand_thug', 'brigand_thug', 'brigand_thug', 'brigand_thug'] });
const sk = n => ({ name: n }), A = { x: 10, y: 6 }, P = (x, y) => ({ x, y });
const split = F.shapeTiles(A, P(11, 6), sk('Split')), swing = F.shapeTiles(A, P(11, 6), sk('Swing')), round = F.shapeTiles(A, P(11, 6), sk('Round Swing'));
const heads = [[1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1]];
const cones = heads.map(h => F.shapeTiles(A, P(A.x + h[0] * 2, A.y + h[1] * 2), sk('Fire Handgonne')).length);
const coneE = F.shapeTiles(A, P(12, 6), sk('Fire Handgonne'));
leg(same(split, [P(11, 6), P(12, 6)]) && same(swing, [P(11, 6), P(11, 5), P(10, 5)]) && round.length === 8 && cones.every(n => n === 5) && same(coneE, [P(12, 6), P(13, 6), P(14, 5), P(14, 6), P(14, 7)]),
  '*** THE SHAPES ON OUR BOARD ***: Split the man and the one behind; Swing the next two counterclockwise; Round Swing all eight; the cone the man and four behind on every heading',
  'split ' + show(split) + '; swing ' + show(swing) + '; round ' + round.length + '; cone east ' + show(coneE) + '; the eight headings ' + cones.join(' '));

/* the field for the next legs: one man of each side picked, everybody else off it */
const S = F.S;
function field(keep) { S.units.forEach(u => { u.fled = keep.indexOf(u) < 0; u.dead = false; u.down = false; }); S.events = []; S.over = false; }
function arm(u, id) { const w = Object.assign({}, row(id)); u.weapon = w; const am = w.ammo ? String(w.ammo).match(/\d+/) : null; u.ammo = am ? Number(am[0]) : null; u.ammoMax = u.ammo; u.loaded = true; }
function turn(u) { S.order = [u.id]; S.idx = 0; u.ap = u.apTurn; u.fat = 0; u.begun = true; u.morale = 'Steady'; }
const mine = S.units.filter(u => u.side === 'you'), theirs = S.units.filter(u => u.side === 'them');
const atks = () => S.events.filter(e => e.t === 'attack');

/* 3: an axe of theirs, three of ours round him and one of his own */
{
  const ax = theirs[0], pal = theirs[1], v = mine.slice(1, 4);
  field([ax, pal].concat(v)); arm(ax, 'woodcutter_s_axe'); turn(ax);
  ax.x = 10; ax.y = 6; v[0].x = 11; v[0].y = 6; v[1].x = 11; v[1].y = 5; v[2].x = 9; v[2].y = 7; pal.x = 10; pal.y = 5;
  v.forEach(u => { u.hp = u.hpMax = 999; }); pal.hp = pal.hpMax = 999;
  F.sweep(ax, v[0], null, 'Round Swing');
  const a = atks(), to = a.map(e => e.to);
  leg(a.length === 3 && v.every(u => to.indexOf(u.id) >= 0) && to.indexOf(pal.id) < 0 && a.every(e => e.skill === 'Round Swing') && a.filter(e => e.sweep).length === 2,
    '*** FOE ONLY, EACH HIS OWN BLOW ***: Round Swing ringed by three of ours and one of its own strikes the three, each his own roll',
    a.length + ' blows: ' + a.map(e => (e.hit ? 'hit ' : 'miss ') + e.chance + '% (rolled)').join(', ') + '; its own man struck: ' + (to.indexOf(pal.id) >= 0));
}
/* 4: the shotgun's blast */
{
  const g = mine[0], t = theirs.slice(0, 3), own = mine[1];
  field([g, own].concat(t)); arm(g, 'handgonne'); turn(g);
  g.x = 10; g.y = 6; t[0].x = 12; t[0].y = 6; t[1].x = 13; t[1].y = 6; t[2].x = 14; t[2].y = 5; own.x = 14; own.y = 7;
  t.forEach(u => { u.hp = u.hpMax = 999; }); own.hp = own.hpMax = 999;
  const ap0 = g.ap, cost = T.skillAP(g.weapon, F.strikeSkill(g.weapon), g);
  F.strike(g, t[0]);
  const a = atks(), to = a.map(e => e.to);
  leg(a.length === 3 && t.every(u => to.indexOf(u.id) >= 0) && to.indexOf(own.id) < 0 && g.loaded === false && g.ap === ap0 - cost,
    '*** THE SHOTGUN\'S BLAST ***: one shot strikes the man and the two behind him in the cone, one round, one cost, never his own man in it',
    a.length + ' blows from one shot; loaded after: ' + g.loaded + '; AP ' + ap0 + ' -> ' + g.ap + ' (the shot ' + cost + '); his own man struck: ' + (to.indexOf(own.id) >= 0));
}
/* 5: the sledge and the greatsword */
{
  const m = mine[0], t = theirs.slice(0, 3);
  field([m].concat(t)); arm(m, 'two_handed_mallet'); turn(m);
  m.x = 10; m.y = 6; t[0].x = 11; t[0].y = 6; t[1].x = 11; t[1].y = 5; t[2].x = 10; t[2].y = 5;
  t.forEach(u => { u.hp = u.hpMax = 999; });
  F.strike(m, t[0]); const one = atks().length;
  turn(m); S.events = []; F.sweep(m, t[0], null, 'Shatter'); const three = atks().length;
  const gs = F.sweepSkills(row('greatsword')).map(s => s.name);
  leg(F.strikeSkill(m.weapon).name === 'Smite' && one === 1 && F.sweepSkill(m.weapon).name === 'Shatter' && three === 3 && gs.join() === 'Split,Swing' && !F.sweepSkill(row('handgonne')),
    '*** THE SLEDGE SWEEPS ON HIS WORD ***: its blow Smite strikes one, its sweep Shatter three; the greatsword carries Split and Swing; the shotgun\'s blast is its own blow',
    'Smite ' + one + ', Shatter ' + three + '; greatsword: ' + gs.join(', '));
}
/* 6: the brains */
{
  const ax = theirs[0], v = mine.slice(1, 3);
  field([ax].concat(v)); arm(ax, 'woodcutter_s_axe'); turn(ax);
  ax.x = 10; ax.y = 6; v[0].x = 11; v[0].y = 6; v[1].x = 9; v[1].y = 6; v.forEach(u => { u.hp = u.hpMax = 999; });
  F.aiStep(ax); const two = atks()[0];
  field([ax, v[0]]); turn(ax); ax.x = 10; ax.y = 6; v[0].x = 11; v[0].y = 6;
  F.aiStep(ax); const lone = atks()[0];
  leg(!!two && two.skill === 'Round Swing' && !!lone && lone.skill !== 'Round Swing',
    '*** THE BRAINS SWEEP WHEN IT PAYS ***: an axe of theirs beside two of ours swings Round Swing, beside one a plain blow',
    'two beside him: ' + (two ? two.skill || 'a plain blow' : 'nothing') + '; one: ' + (lone ? lone.skill || 'a plain blow' : 'nothing'));
}

/* ---------------- the phone ---------------- */
(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const base = { seed: 5, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, band: ['brigand_thug', 'brigand_thug', 'brigand_thug', 'brigand_thug'] };
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(base) });
  const p = d.page;
  try {
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
    const mineNow = async () => { for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : u.side === 'you' && !FIGHT_UI.anim.length ? 'mine' : u.side === 'you' ? 'busy' : 'theirs'; });
      if (st === 'mine') return; if (st === 'theirs') await p.touchscreen.tap(200, 420); await p.waitForTimeout(150); } };
    /* his man and three of theirs in a clear patch, the man he controls holding the weapon asked for */
    const stage = async (wid, spots) => { await mineNow();
      return p.evaluate(([wid, spots]) => {
        const S = FIGHT.S, u = FIGHT.current(), them = S.units.filter(v => v.side === 'them');
        let c = null;
        for (let y = 3; y < S.h - 3 && !c; y++) for (let x = 3; x < S.w - 6 && !c; x++) {
          let ok = true; for (let yy = y - 2; yy <= y + 2; yy++) for (let xx = x - 1; xx <= x + 5; xx++) if (!FIGHT._t.passable(xx, yy)) ok = false;
          if (ok) c = { x: x, y: y }; }
        S.units.forEach(v => { if (v !== u && v.side === 'you') { v.x = 0; v.y = S.units.indexOf(v) % S.h; } });
        them.forEach((v, i) => { if (i >= spots.length) v.fled = true; else { v.x = c.x + spots[i][0]; v.y = c.y + spots[i][1]; v.hp = v.hpMax = 999; v.fled = false; } });
        const w = Object.assign({}, FIGHT_DB_ROW(wid)); u.weapon = w; u.loaded = true; const am = w.ammo ? String(w.ammo).match(/\d+/) : null; u.ammo = am ? Number(am[0]) : null; u.ammoMax = u.ammo;
        u.x = c.x; u.y = c.y; u.ap = u.apTurn; u.fat = 0; S.order = [u.id].concat(them.filter(v => !v.fled).map(v => v.id)); S.idx = 0; u.begun = true;
        FIGHT_UI.anim = []; FIGHT_UI.glide = null; FIGHT_UI.pend = null; FIGHT_UI.sweep = null; FIGHT_UI.pinched = false;
        fitNow(); hud(); return { u: u.id, them: them.filter(v => !v.fled).map(v => v.id) };
      }, [wid, spots]); };
    await p.evaluate(() => { window.FIGHT_DB_ROW = id => DB.weapons.rows.filter(r => r.id === id)[0]; });
    /* his own tile's middle: a man of theirs standing behind covers the tile above with his body (the tile wins, rule 104a) */
    const at = id => p.evaluate(i => { const v = FIGHT.byId(i); return { x: sx((v.x + .5) * FIGHT_UI.tw), y: sy((v.y + .5) * FIGHT_UI.th) }; }, id);
    const heard = () => p.evaluate(() => (FIGHT_UI.heard || []).slice());
    const settle = async () => { for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !FIGHT_UI.anim.length)) break; await p.waitForTimeout(100); } await p.waitForTimeout(1500); };

    /* 7: the shotgun */
    const g = await stage('handgonne', [[2, 0], [3, 0], [4, -1]]);
    await p.waitForTimeout(300);
    let q = await at(g.them[0]); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(400);
    const lit = await p.evaluate(() => ({ lit: FIGHT_UI.shapeLit, say: document.getElementById('say').innerText, want: FIGHT.shapeTiles(FIGHT.current(), FIGHT_UI.pend.target, FIGHT.blowSkill(FIGHT.current(), FIGHT_UI.pend.target)) }));
    const h0 = (await heard()).length;
    q = await at(g.them[0]); await p.touchscreen.tap(q.x, q.y); await settle();
    const h1 = await heard(), shot = h1.slice(h0).filter(e => /^(hit|vital|melee_hit|hurt|miss)$/.test(e)).length;
    leg(!!lit.lit && lit.lit.skill === 'Fire Handgonne' && lit.lit.tiles.length === lit.want.length && lit.lit.struck.length === 3 && /strikes 3 of theirs/.test(lit.say) && shot === 3,
      '*** LIT BEFORE THE SWING ***: the shotgun\'s cone lit on the tiles with the three it strikes, the line says so, and the shot is heard on every man it caught',
      lit.lit ? lit.lit.tiles.length + ' tiles lit, ' + lit.lit.struck.length + ' struck; "' + lit.say.split('\n')[1] + '"; ' + shot + ' hit or miss sounds after the shot' : 'nothing lit');

    /* 8: the sledge's square */
    const m = await stage('two_handed_mallet', [[1, 0], [1, -1], [0, -1]]);
    await p.waitForTimeout(400);
    const sq = await p.evaluate(() => { const b = document.querySelector('#skills button[data-sweep="Shatter"]'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, ap: b.querySelector('b').textContent, w: r.width }; });
    if (sq) await p.touchscreen.tap(sq.x, sq.y);
    await p.waitForTimeout(300);
    q = await at(m.them[0]); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(400);
    const armed = await p.evaluate(() => ({ lit: FIGHT_UI.shapeLit, big: document.getElementById('bend').childNodes[0].textContent.trim(), say: document.getElementById('say').innerText }));
    const k0 = (await heard()).length;
    q = await at(m.them[0]); await p.touchscreen.tap(q.x, q.y); await settle();
    const k1 = await heard(), swung = k1.slice(k0).filter(e => /^(hit|vital|melee_hit|hurt|miss)$/.test(e)).length;
    leg(!!sq && sq.w >= 44 && !!armed.lit && armed.lit.skill === 'Shatter' && armed.lit.struck.length === 3 && /SHATTER/.test(armed.big) && swung === 3,
      '*** THE SWEEP SQUARE ***: the sledge\'s SHATTER square with its AP, armed, the arc lit with the three it strikes, the big button says SHATTER, the swing heard on all three',
      sq ? 'square ' + Math.round(sq.w) + ' pt, ' + sq.ap + ' AP; lit ' + (armed.lit ? armed.lit.tiles.length + ' tiles, ' + armed.lit.struck.length + ' struck' : 'nothing') + '; big button "' + armed.big + '"; ' + swung + ' sounds after the swing' : 'no SHATTER square');
    leg(d.errs.length === 0, 'nothing threw', d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 160) : ''));
  } catch (e) { leg(false, 'the phone legs ran', String(e.message).slice(0, 200)); }
  await d.close();
  done();
})();
