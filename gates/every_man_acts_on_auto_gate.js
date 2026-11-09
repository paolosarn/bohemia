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
  /* rule 435(c): the casino floor and the pool pit as the page loads them, so the whole-fight leg stands on every board kind */
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'slices/bohemia_casino_floor.js'), 'utf8'), ctx);
    const cd = J('casino_floor.json', 'slices/fight_ground/casino'), cz = J('sizes.json', 'slices/fight_ground/casino') || {}, ck = {};
    Object.keys(cd.kit).forEach(k => { const z = cz[k.replace(/^casino_/, '')]; ck[k] = Object.assign({}, cd.kit[k], z ? { src: z.src } : {}); }); ctx.DB.casino = { data: cd, sizes: cz, kit: ck }; } catch (e) {}
  ctx.DB.arenaPit = J('pit_board.json', 'slices/arena');
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
  /* M4 / M5 (rule 435(c), ask line 540; Paolo 11/9: 'one of my guys is still not doing anything on auto combat'): the WHOLE FIGHT.
     Crews of every kind he can have (two-handers, a one-hander and a shield, the pistol, the javelin, the bow, the crossbow, the
     gun, the throwables, the sling, the new one-handers; a man wounded; a man with a second weapon in his bag; the Lone Wolf alone)
     on every board kind (the place boards, the towns, the casino floor, the freeway, the graveyard, the pool pit), both sides on
     AUTO up to 30 rounds. M4: no man of his who is on the field two of his turns or more stands the whole fight without moving or
     striking; no excuse (out of reach is a failure now: M5 makes it impossible). M5: every man of either side starts with a walk on
     foot to a man of the other (the root of 435(c): a man dealt north of Fremont's canopy or into a lab pen never had one). */
  const WH = (function () {
    const W0 = ctx.DB.weapons, Wr = Array.isArray(W0) ? W0 : (W0.rows || []), wid = re => Wr.filter(re).map(r => r.id);
    const KIT = { two: wid(r => r.hands === 2 && !/throwing/.test(r.class)), one: wid(r => r.hands === 1 && !/throw/.test(r.class)), pistol: ['snub_revolver', 'zip_gun'],
      javelin: wid(r => /javelin|throwing_axe|throwing_spear|bolas/.test(r.id)), bow: wid(r => r.class === 'bow'), xbow: wid(r => r.class === 'crossbow'),
      gun: wid(r => r.class === 'firearm'), item: wid(r => r.class === 'throwable_item'), sling: ['staff_sling', 'nomad_sling'],
      fresh1: ['pipe_wrench', 'bike_lock_chain', 'pool_pole_spear', 'broom_bayonet', 'framing_hammer', 'tomahawk'].filter(id => Wr.some(r => r.id === id)) };
    const SH = (ctx.DB.armor.shields.rows || ctx.DB.armor.shields).map(r => r.id), BGS = ctx.DB.backgrounds.rows.map(r => r.id), KN = Object.keys(KIT);
    const PL = ctx.DB.ours.place_boards.value.places, BD = [];
    Object.keys(PL).forEach(p => BD.push({ tag: p, o: { district: PL[p].districts[0] } }));
    ['town', 'arterial'].forEach(d => BD.push({ tag: d, o: { district: d } }));
    BD.push({ tag: 'casino', o: { district: 'casino' } }, { tag: 'freeway', o: { district: 'freeway' } }, { tag: 'graveyard', o: { district: 'cemetery' } });
    if (ctx.DB.arenaPit) BD.push({ tag: 'pit', o: { district: 'strip', arena: { pool: 3 } } });
    return { KIT, SH, BGS, KN, BD };
  })();
  const whole = function (holdOne, NF) {
    let sd = 1; const rnd = () => { sd = (sd * 1103515245 + 12345) >>> 0; return sd / 4294967296; }, pick = a => a[Math.floor(rnd() * a.length)];
    const r = { fights: 0, men: 0, kinds: {}, boards: {}, never: [], cut: [], pairs: 0, held: null };
    for (let f = 0; f < NF; f++) {
      const b = WH.BD[f % WH.BD.length], n = rnd() < 0.12 ? 1 : 2 + Math.floor(rnd() * 11), company = [];
      for (let i = 0; i < n; i++) { const k = pick(WH.KN), m = { background: pick(WH.BGS), level: 1 + Math.floor(rnd() * 6), gear: { main: pick(WH.KIT[k]), off: null }, kind: k };
        if ((k === 'one' || k === 'fresh1' || k === 'pistol') && rnd() < 0.5) m.gear.off = pick(WH.SH);
        if (rnd() < 0.3) m.gear.bag1 = pick(WH.KIT[pick(WH.KN)]); if (rnd() < 0.25) m.cond = { lostHp: 10 + Math.floor(rnd() * 40) }; company.push(m); }
      const night = rnd() < 0.3; ctx.setSeed(3000 + f);
      try { F.setup(Object.assign({ kind: 'suburb', cell: { gx: (f * 37 + 11) % 90, gy: (f * 53 + 7) % 90 }, night: night, auto: true, formation: null, deploy: false, company: company, cap: n === 1 ? 1 : 12 }, b.o)); } catch (e) { continue; }
      const S = F.S; S.deploy = false; r.fights++; r.boards[b.tag] = 1;
      /* M5: every man of either side has a walk on foot to a man of the other */
      const walkTo = (u) => { const seen = new Uint8Array(S.w * S.h), q = [[u.x, u.y]]; seen[u.y * S.w + u.x] = 1;
        while (q.length) { const [x, y] = q.shift(); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const a = x + dx, c = y + dy; if ((!dx && !dy) || a < 0 || c < 0 || a >= S.w || c >= S.h || seen[c * S.w + a]) continue;
          if (S.units.some(t => t.side !== u.side && F.onField(t) && t.x === a && t.y === c)) return true;
          if (!T.passable(a, c) || T.squeezes(x, y, a, c)) continue; seen[c * S.w + a] = 1; q.push([a, c]); } } return false; };
      S.units.filter(u => (u.side === 'you' || u.side === 'them') && F.onField(u)).forEach(u => { r.pairs++; if (!walkTo(u)) r.cut.push(b.tag + ' f' + f + ' ' + u.id + '@' + u.x + ',' + u.y); });
      /* M4 */
      const mine = S.units.filter(u => u.side === 'you'), acted = {}, able = {};
      const victim = holdOne ? mine.find(u => !u.main) || mine[0] : null; if (victim) r.held = victim.id;
      let cur = null, snap = null, g = 0;
      const close = () => { if (!cur || !snap) return; const u = cur;
        if (u.x !== snap.x || u.y !== snap.y || S.log.slice(snap.n).some(e => e.id === u.id && /^(attack|step|skill|reload|swap|wall|rally|shot|sweep|hook|net|throw)$/.test(e.t))) acted[u.id] = true; };
      while (!S.over && S.round <= 30 && g < 80000) { const u = F.current(); if (!u) break;
        if (u !== cur) { close(); cur = u.side === 'you' ? u : null; snap = cur ? { x: u.x, y: u.y, n: S.log.length } : null; if (cur && F.onField(u) && u.morale !== 'Fleeing') able[u.id] = (able[u.id] || 0) + 1; }
        if (victim && u === victim) { F.endTurn(u); g++; continue; }   /* planted: his AUTO brain answers 'hold' every turn */
        F.aiStep(u); g++; }
      close();
      mine.forEach((u, i) => { r.men++; const k = company[i] ? company[i].kind : 'base'; r.kinds[k] = 1;
        if (!acted[u.id] && (able[u.id] || 0) >= 2) r.never.push(b.tag + ' f' + f + ' ' + u.id + ' ' + (u.weapon && u.weapon.id) + ' able ' + able[u.id]); });
    }
    return r;
  };
  const wh = whole(false, 200), whp = whole(true, 6);
  check(wh.never.length === 0 && wh.men >= 1000 && Object.keys(wh.boards).length >= 18, 'M4', 'NO MAN STANDS A WHOLE FIGHT: ' + (wh.men - wh.never.length) + ' of ' + wh.men + ' men of his over ' + wh.fights + ' fights (' + Object.keys(wh.kinds).length + ' kinds of man, ' + Object.keys(wh.boards).length + ' kinds of board) moved or struck before the fight ended; ' + wh.never.length + ' stood it out' + (wh.never.length ? ': ' + wh.never.slice(0, 4).join('; ') : ''));
  check(whp.never.length > 0, 'M4p', 'planted: one man\'s AUTO brain answers \'hold\' every turn, caught (' + whp.never.slice(0, 1).join('') + ')');
  check(wh.cut.length === 0 && wh.pairs > 2000, 'M5', 'EVERY MAN STARTS WITH A WALK TO THE OTHER SIDE: ' + (wh.pairs - wh.cut.length) + ' of ' + wh.pairs + ' men of both sides' + (wh.cut.length ? ': ' + wh.cut.slice(0, 4).join('; ') : ' (Fremont\'s canopy, the lab\'s pens: the fight\'s ground is one piece)'));
  /* M5 planted: a man of his put in a pocket cut off from them (north of Fremont's canopy) */
  { ctx.setSeed(3054); F.setup({ kind: 'suburb', district: 'downtown', cell: { gx: 7, gy: 3 }, night: false, auto: true, formation: null, deploy: false });
    const S = F.S, u = S.units.find(x => x.side === 'you'); let spot = null;
    const seen = new Uint8Array(S.w * S.h), q = []; S.units.filter(t => t.side === 'them').forEach(t => { seen[t.y * S.w + t.x] = 1; q.push([t.x, t.y]); });
    while (q.length) { const [x, y] = q.shift(); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const a = x + dx, c = y + dy; if ((!dx && !dy) || a < 0 || c < 0 || a >= S.w || c >= S.h || seen[c * S.w + a]) continue; if (!T.passable(a, c) || T.squeezes(x, y, a, c)) continue; seen[c * S.w + a] = 1; q.push([a, c]); } }
    for (let y = 0; y < S.h && !spot; y++) for (let x = 0; x < S.w; x++) if (T.passable(x, y) && !seen[y * S.w + x] && !T.unitAt(x, y)) { spot = [x, y]; break; }
    if (spot && u) { u.x = spot[0]; u.y = spot[1]; }
    check(!!spot && !seen[u.y * S.w + u.x], 'M5p', 'planted: a man of his put at ' + (spot ? spot.join(',') : '?') + ', north of the canopy with no walk to them, is caught'); }
  check(now.fights >= 20 && Object.keys(now.kinds).length >= 15 && now.turns >= 1000, 'M3', now.fights + ' fights over ' + Object.keys(now.kinds).length + ' board kinds, ' + now.turns + ' of his turns weighed');
  R.whole = { fights: wh.fights, men: wh.men, never: wh.never, cut: wh.cut };
  R.now = { fights: now.fights, kinds: Object.keys(now.kinds), turns: now.turns, acted: now.acted, held: now.held, stalls: now.stalls, behind: now.behind };
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  console.log('\nEVERY MAN ACTS ON AUTO: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
