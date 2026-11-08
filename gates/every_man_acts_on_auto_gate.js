#!/usr/bin/env node
/* EVERY MAN ACTS ON AUTO (COMBAT TWO 11/8/26, VAMILY rule 435, ask line 520; Paolo 11/8: 'not all my characters are moving and
   attacking on the auto combat mode now, I don't know why').
   A REGRESSION HE PLAYED. MEASURED (both sides on AUTO, the fifteen place boards and three towns): his men stood through 11.1% of
   their turns, 168 of them on THE STRIP, every turn there (its board pins two rows of casinos back to back, a wall from edge to
   edge on their start column, and their line was placed behind it: nobody could reach anybody); then, the rest: a fresh man
   'resting' for nothing (a rest that bought next turn 0 beat a weapon swap worth less than 0), and the older holds (the line he
   waits for, rule 70b; the long walk into their clubs, rule 332; a thrower who sees them far off).
   THE LEGS (the live fight's own rules, headless; every place board's districts, three towns, two seeds each, the freeway's when
   its data is there; both sides on AUTO, up to 8 rounds):
     M1  every turn of a man of his who is on the field, not running, not held in a man's reach (the free swings), with the AP and
         the breath for a step, and able to reach the fight at all (the walk to the nearest man of theirs is not cut off): he moves
         or strikes (or uses a skill); a shooter in cover with no man of theirs in his reach may hold (rule 435(b)'s own exception).
         planted: one man's AUTO turn skipped, red
     M2  THE SIDES MEET: on every board dealt, every man of theirs starts on ground his line can walk to (the Strip's wall).
         planted: one man of theirs put behind a wall, red
     M3  enough: at least 20 fights over at least 15 board kinds, and at least 1,000 of his turns weighed
   Run: node gates/every_man_acts_on_auto_gate.js [--json out.json]     (about a minute) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), H = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--json', null);
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const J = (f, base) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, base || 'slices/fight_ground/street_board', f), 'utf8')); } catch (e) { return null; } };
function eng() {
  const ctx = H.engine({ extra: { window: null } }); ctx.window = ctx;
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'slices/bohemia_street_board.js'), 'utf8'), ctx);
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/bohemia_fight_kinds.js'), 'utf8'), ctx); } catch (e) {}
  ctx.DB.streetKit = J('street_board.json'); ctx.DB.streetDress = J('dressing.json'); ctx.DB.streetStoreys = J('storeys.json');
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'slices/bohemia_freeway_boards.js'), 'utf8'), ctx);
    const fb = J('freeway_boards.json', 'slices/fight_ground/freeway'), fk = J('freeway.json', 'slices/fight_ground/freeway'); ctx.DB.freeway = fb && fk ? { boards: fb, kit: fk } : null; } catch (e) {}
  return ctx;
}
(async () => {
  const t0 = Date.now(), ctx = eng(), F = ctx.FIGHT, T = F._t, P = ctx.DB.ours.place_boards.value.places, R = {};
  const KINDS = []; Object.keys(P).forEach(k => KINDS.push(P[k].districts[0])); ['town', 'estate', 'arterial'].forEach(d => KINDS.push(d));
  if (ctx.DB.freeway && ctx.BohemiaFreewayBoards) KINDS.push('freeway');
  const able = u => {   /* the turn a man could act: the AP and breath for a step, not held, the fight within his walk */
    if (u.dead || u.down || u.fled || u.morale === 'Fleeing' || u.netted) return false;
    if (F.S.units.some(t => t.side !== u.side && F.onField(t) && !F.isRanged(t.weapon) && Math.max(Math.abs(t.x - u.x), Math.abs(t.y - u.y)) === 1)) return false;   /* held in a man's reach */
    try { const sk = F.strikeSkill(u.weapon); if (u.fat + T.skillFat(u, sk) > F.fatMax(u) && u.fat > 0) return false; } catch (e) {}
    try { if (!(T.huntField(u)(u.x, u.y) < Infinity)) return false; } catch (e) {}
    return true;
  };
  const run = function (skipOne) {
    const r = { fights: 0, kinds: {}, turns: 0, acted: 0, held: 0, stalls: [], behind: [], sides: 0 };
    let skipped = false;
    KINDS.forEach((d, di) => { for (let s = 0; s < 2; s++) {
      ctx.setSeed(700 + di * 31 + s);
      try { F.setup({ kind: 'suburb', district: d, cell: { gx: (di * 37 + s * 13 + 11) % 90, gy: (di * 53 + s * 7 + 5) % 90 }, night: false, auto: true, formation: null, deploy: false }); } catch (e) { continue; }
      const S = F.S; S.deploy = false; r.fights++; r.kinds[d] = 1;
      /* M2: every man of theirs on ground his line walks to */
      const cols = S.cols, seen = new Uint8Array(S.w * S.h), q = [];
      for (let y = 0; y < S.h; y++) if (T.passable(cols[0], y)) { seen[y * S.w + cols[0]] = 1; q.push([cols[0], y]); }
      while (q.length) { const [x, y] = q.shift(); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const a = x + dx, b = y + dy;
        if ((dx || dy) && a >= 0 && b >= 0 && a < S.w && b < S.h && !seen[b * S.w + a] && T.passable(a, b) && !T.squeezes(x, y, a, b)) { seen[b * S.w + a] = 1; q.push([a, b]); } } }
      S.units.filter(u => u.side === 'them' && !u.dead && !u.fled).forEach(u => { r.sides++; if (!seen[u.y * S.w + u.x]) r.behind.push(d + ':' + u.id + '@' + u.x + ',' + u.y); });
      /* M1 */
      let cur = null, snap = null, g = 0;
      const close = () => { if (!cur || !snap || !snap.able) return; const u = cur; if (u.dead || u.down || u.fled || u.morale === 'Fleeing') return;
        r.turns++;
        const moved = u.x !== snap.x || u.y !== snap.y, did = S.log.slice(snap.n).some(e => e.id === u.id && /^(attack|step|skill|reload|swap|wall|rally|shot|sweep|hook|net|throw)$/.test(e.t));
        if (moved || did) { r.acted++; return; }
        if (snap.ranged && snap.cover && !snap.target) { r.held++; return; }
        r.stalls.push(d + ' r' + snap.round + ' ' + u.id + ' ' + (u.weapon && u.weapon.name) + ' @' + snap.x + ',' + snap.y + (snap.target ? ' (a man in reach)' : '') + ' why ' + (u.btWhy || '?')); };
      while (!S.over && S.round <= 8 && g < 60000) { const u = F.current(); if (!u) break;
        if (u !== cur) { close(); cur = u.side === 'you' ? u : null;
          snap = cur ? { x: u.x, y: u.y, n: S.log.length, round: S.round, ranged: F.isRanged(u.weapon), cover: F.goodGround(u.x, u.y), able: able(u),
            target: S.units.some(t => t.side !== u.side && F.onField(t) && F.canStrike(u, t) && F.sideSees('you', t)) } : null;
          if (skipOne && !skipped && cur && S.round === 2 && snap.able) { skipped = true; F.endTurn(u); g++; continue; } }
        F.aiStep(u); g++; }
      close();
    } });
    return r;
  };
  const now = run(false), planted = run(true);
  check(now.stalls.length === 0 && now.turns >= 1000, 'M1', 'every man of his acts on AUTO: ' + now.acted + ' of ' + now.turns + ' turns he moved or struck, ' + now.held + ' held a shot in cover with no man in reach, ' + now.stalls.length + ' stood' + (now.stalls.length ? ': ' + now.stalls.slice(0, 4).join('; ') : ''));
  check(planted.stalls.length > 0, 'M1p', 'planted: one man\'s AUTO turn skipped is caught (' + planted.stalls.slice(0, 1).join('') + ')');
  check(now.behind.length === 0 && now.sides > 0, 'M2', 'THE SIDES MEET: ' + (now.sides - now.behind.length) + ' of ' + now.sides + ' men of theirs start on ground his line walks to' + (now.behind.length ? ': ' + now.behind.slice(0, 4).join(', ') : ''));
  /* M2 planted: a man of theirs put behind a wall (the Strip's) */
  {
    ctx.setSeed(700 + 11 * 31); F.setup({ kind: 'suburb', district: 'strip', cell: { gx: 11, gy: 5 }, night: false, auto: true, formation: null, deploy: false });
    const S = F.S, cols = S.cols, seen = new Uint8Array(S.w * S.h), q = [];
    for (let y = 0; y < S.h; y++) if (T.passable(cols[0], y)) { seen[y * S.w + cols[0]] = 1; q.push([cols[0], y]); }
    while (q.length) { const [x, y] = q.shift(); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const a = x + dx, b = y + dy;
      if ((dx || dy) && a >= 0 && b >= 0 && a < S.w && b < S.h && !seen[b * S.w + a] && T.passable(a, b) && !T.squeezes(x, y, a, b)) { seen[b * S.w + a] = 1; q.push([a, b]); } } }
    let spot = null; for (let x = S.w - 1; x >= 0 && !spot; x--) for (let y = 0; y < S.h; y++) if (T.passable(x, y) && !seen[y * S.w + x] && !T.unitAt(x, y)) { spot = [x, y]; break; }
    const t = S.units.find(u => u.side === 'them' && !u.dead); let caught = false;
    if (spot && t) { t.x = spot[0]; t.y = spot[1]; caught = !seen[t.y * S.w + t.x]; }
    check(caught, 'M2p', 'planted: a man of theirs behind the Strip\'s wall at ' + (spot ? spot.join(',') : 'no tile behind a wall on this board') + ' is caught');
  }
  check(now.fights >= 20 && Object.keys(now.kinds).length >= 15 && now.turns >= 1000, 'M3', now.fights + ' fights over ' + Object.keys(now.kinds).length + ' board kinds, ' + now.turns + ' of his turns weighed');
  R.now = { fights: now.fights, kinds: Object.keys(now.kinds), turns: now.turns, acted: now.acted, held: now.held, stalls: now.stalls, behind: now.behind };
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  console.log('\nEVERY MAN ACTS ON AUTO: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
