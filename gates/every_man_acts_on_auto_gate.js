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
     M4, M5 (rule 435(c)) no man stands a whole fight; every man starts with a walk to the other side. Planted, red.
     M6 (rule 435(d)) TURN BY TURN: every turn of his he moves, strikes, shoots, reloads or swaps, or the turn says why (shown over
         him); never a wait for a shot that may not come. Planted: a turn that ends with nothing said, red.
     M7 (rule 435(d)) THE PAGE: real fights on the fight's page, phone upright, AUTO at 1x, 2x and 4x; every turn of his has a
         motion of his played on the glass. Planted: the page's runner drops one man's motions, red. (--no-page skips it)
     M8 (rule 435(e), ask line 556; Paolo 11/10: 'one of my guys keeps saying he's winded and he doesn't move and he doesn't attack, but
         I can move him myself') THE WINDED MAN ACTS: his men in the heaviest kits (the coat of plates and a two-hander, the Lone Wolf
         in gold, the lamellar with a mace and a kite) over the place boards, both sides on AUTO up to 30 rounds: no man of his rests
         winded two turns running, and a turn he starts winded and does not rest he walks, strikes or shoots (or a ring of theirs
         holds him). Planted: the old rule (a rest whenever winded, no breath floor), red.
     M9 NEVER WINDED FOR LIFE: every origin's men (12 rolls each) and the heaviest kits: no man's own blow costs more than his breath,
         and every man holds at least two of his blows from fresh (TUNING's ours.armour_weight.breath_floor). Planted: the floor off, red.
     M7 also carries a man in the coat of plates with the two-handed hammer: no man of his shows WINDED two turns running on the page.
         Planted: the page served with the old rule, red.
   Run: node gates/every_man_acts_on_auto_gate.js [--json out.json] [--no-page]     (about six minutes) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), H = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--json', null);
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const J = (f, base) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, base || 'slices/fight_ground/street_board', f), 'utf8')); } catch (e) { return null; } };
function eng(patch) {
  const ctx = H.engine(Object.assign({ extra: { window: null } }, patch ? { patch: patch } : {})); ctx.window = ctx;
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'slices/bohemia_street_board.js'), 'utf8'), ctx);
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/bohemia_fight_kinds.js'), 'utf8'), ctx); } catch (e) {}
  ctx.DB.streetKit = J('street_board.json'); ctx.DB.streetDress = J('dressing.json'); ctx.DB.streetStoreys = J('storeys.json');
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'slices/bohemia_freeway_boards.js'), 'utf8'), ctx);
    const fb = J('freeway_boards.json', 'slices/fight_ground/freeway'), fk = J('freeway.json', 'slices/fight_ground/freeway'); ctx.DB.freeway = fb && fk ? { boards: fb, kit: fk } : null; } catch (e) {}
  /* rule 435(c): the casino floor and the pool pit as the page loads them, so the whole-fight leg stands on every board kind */
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'slices/bohemia_casino_floor.js'), 'utf8'), ctx);
    const cd = J('casino_floor.json', 'slices/fight_ground/casino'), cz = J('sizes.json', 'slices/fight_ground/casino') || {}, ck = {};
    Object.keys(cd.kit).forEach(k => { const z = cz[k.replace(/^casino_/, '')]; ck[k] = Object.assign({}, cd.kit[k], z ? { src: z.src } : {}); }); ctx.DB.casino = { data: cd, sizes: cz, kit: ck }; } catch (e) {}
  /* rule 440(a): the flood tunnels under the wash, as the page loads them */
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'slices/bohemia_flood_tunnels.js'), 'utf8'), ctx);
    const td = J('tunnels.json', 'slices/fight_ground/tunnels'), tz = J('sizes.json', 'slices/fight_ground/tunnels') || {}, tk = {};
    Object.keys(td.kit).forEach(k => { const z = tz[k.replace(/^tunnel_/, '')]; tk[k] = Object.assign({}, td.kit[k], z ? { src: z.src } : {}); }); ctx.DB.tunnels = { data: td, sizes: tz, kit: tk }; } catch (e) {}
  /* rule 440(a): the parking garage, as the page loads it (COMBAT THREE 11/11) */
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'slices/bohemia_parking_garage.js'), 'utf8'), ctx);
    const gd = J('garage.json', 'slices/fight_ground/garage'), ga = J('garage_art.json', 'slices/fight_ground/garage'), gk = {};
    Object.keys(ga.kit).forEach(k => { gk[k] = Object.assign({}, ga.kit[k], (gd.rules || {})[k] || {}); });
    Object.keys(gd.kit).forEach(k => { const q = (gd.sizes || {})[gd.kit[k].like || k.replace(/^garage_/, '')]; gk[k] = Object.assign({}, q ? { src: q.src } : {}, gd.kit[k]); });
    ctx.DB.garage = { data: gd, art: ga, sizes: gd.sizes || {}, kit: gk }; } catch (e) {}
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
     on every board kind (the place boards, the towns, the casino floor, the flood tunnels, the parking garage, the freeway, the graveyard, the pool pit), both sides on
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
    BD.push({ tag: 'casino', o: { district: 'casino', inside: 'casino' } }, { tag: 'tunnels', o: { district: 'wash', inside: 'tunnels' } }, { tag: 'garage', o: { district: 'mall', inside: 'garage' } }, { tag: 'freeway', o: { district: 'freeway' } }, { tag: 'graveyard', o: { district: 'cemetery' } });
    if (ctx.DB.arenaPit) BD.push({ tag: 'pit', o: { district: 'strip', arena: { pool: 3 } } });
    return { KIT, SH, BGS, KN, BD };
  })();
  const whole = function (holdOne, NF, mute) {
    let sd = 1; const rnd = () => { sd = (sd * 1103515245 + 12345) >>> 0; return sd / 4294967296; }, pick = a => a[Math.floor(rnd() * a.length)];
    const r = { fights: 0, men: 0, kinds: {}, boards: {}, never: [], cut: [], pairs: 0, held: null, turns: 0, empty: 0, why: {}, unsaid: [] };
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
      const close = () => { if (!cur || !snap) return; const u = cur, L = S.log.slice(snap.n).filter(e => e.id === u.id);
        const did = u.x !== snap.x || u.y !== snap.y || L.some(e => /^(attack|step|skill|reload|swap|wall|rally|shot|sweep|hook|net|throw)$/.test(e.t));
        if (did) acted[u.id] = true;
        /* M6 (rule 435(d)): every turn of his, one at a time: he did something, or the turn says why (an 'idle' event the page shows) */
        if (snap.able && !snap.fled && !(u.morale === 'Fleeing' || u.fled || u.dead || u.down) && L.some(e => e.t === 'end')) { r.turns++;
          if (!did) { r.empty++; const idle = L.find(e => e.t === 'idle'); if (idle) r.why[idle.why] = (r.why[idle.why] || 0) + 1; else r.unsaid.push(b.tag + ' f' + f + ' r' + S.round + ' ' + u.id + ' ' + (u.weapon && u.weapon.id)); } } };
      while (!S.over && S.round <= 30 && g < 80000) { const u = F.current(); if (!u) break;
        if (u !== cur) { close(); cur = u.side === 'you' ? u : null; snap = cur ? { x: u.x, y: u.y, n: S.log.length, able: F.onField(u) && u.morale !== 'Fleeing' } : null; if (cur && F.onField(u) && u.morale !== 'Fleeing') able[u.id] = (able[u.id] || 0) + 1; }
        if (snap && u === cur && u.morale === 'Fleeing') snap.fled = true;
        if (victim && u === victim) { const n0 = S.log.length; F.endTurn(u); if (mute) for (let j = S.log.length - 1; j >= n0; j--) if (S.log[j].t === 'idle') S.log.splice(j, 1); g++; continue; }   /* planted: his AUTO brain answers 'hold' every turn (mute: and says nothing; COMBAT THREE 11/11, row 555: a turn closed by hand says its word now too, so the mute plant takes the word out of the log itself) */
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
  /* M6 (rule 435(d), ask line 541; Paolo 11/9: 'the auto combat is not fixed... one of the guys, it skips him'): TURN BY TURN. Measured
     on the real page, his gunman stood three rounds running waiting for 'a shot next turn' that needed them to walk in while they dug
     in, and the page passed each of those turns in one frame. Every turn of a man of his who is able (on the field, not running):
     he moves, strikes, shoots, reloads, swaps or uses a skill, or the turn says why (an 'idle' event with its reason, which the page
     shows over him for half a beat); never a wait for a shot that may not come; empty turns under 2% */
  const why = Object.keys(wh.why).map(k => k + ' ' + wh.why[k]).join(', ');
  check(wh.unsaid.length === 0 && !(wh.why.shot_next_turn_here > 0) && wh.turns >= 2000 && wh.empty / wh.turns < 0.02, 'M6', 'EVERY TURN OF HIS DOES SOMETHING OR SAYS WHY: ' + (wh.turns - wh.empty) + ' of ' + wh.turns + ' of his turns over ' + wh.fights + ' fights he moved, struck, shot, reloaded or swapped; ' + wh.empty + ' (' + (100 * wh.empty / Math.max(1, wh.turns)).toFixed(2) + '%) held, every one shown with its reason (' + (why || 'none') + '); ' + wh.unsaid.length + ' passed unsaid' + (wh.unsaid.length ? ': ' + wh.unsaid.slice(0, 3).join('; ') : '') + '; waiting for a shot next turn: ' + (wh.why.shot_next_turn_here || 0));
  { const mp = whole(true, 6, true);
    check(mp.unsaid.length > 0, 'M6p', 'planted: one man\'s turn ended with nothing and nothing said (the old skip) is caught (' + mp.unsaid.length + ' turns, ' + mp.unsaid.slice(0, 1).join('') + ')'); }
  check(wh.cut.length === 0 && wh.pairs > 2000, 'M5', 'EVERY MAN STARTS WITH A WALK TO THE OTHER SIDE: ' + (wh.pairs - wh.cut.length) + ' of ' + wh.pairs + ' men of both sides' + (wh.cut.length ? ': ' + wh.cut.slice(0, 4).join('; ') : ' (Fremont\'s canopy, the lab\'s pens: the fight\'s ground is one piece)'));
  /* M5 planted: a man of his put in a pocket cut off from them (north of Fremont's canopy) */
  { ctx.setSeed(3054); F.setup({ kind: 'suburb', district: 'downtown', cell: { gx: 7, gy: 3 }, night: false, auto: true, formation: null, deploy: false });
    const S = F.S, u = S.units.find(x => x.side === 'you'); let spot = null;
    const seen = new Uint8Array(S.w * S.h), q = []; S.units.filter(t => t.side === 'them').forEach(t => { seen[t.y * S.w + t.x] = 1; q.push([t.x, t.y]); });
    while (q.length) { const [x, y] = q.shift(); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const a = x + dx, c = y + dy; if ((!dx && !dy) || a < 0 || c < 0 || a >= S.w || c >= S.h || seen[c * S.w + a]) continue; if (!T.passable(a, c) || T.squeezes(x, y, a, c)) continue; seen[c * S.w + a] = 1; q.push([a, c]); } }
    for (let y = 0; y < S.h && !spot; y++) for (let x = 0; x < S.w; x++) if (T.passable(x, y) && !seen[y * S.w + x] && !T.unitAt(x, y)) { spot = [x, y]; break; }
    if (spot && u) { u.x = spot[0]; u.y = spot[1]; }
    check(!!spot && !seen[u.y * S.w + u.x], 'M5p', 'planted: a man of his put at ' + (spot ? spot.join(',') : '?') + ', north of the canopy with no walk to them, is caught'); }
  /* M7 THE PAGE (rule 435(d): 'a fix is proven ONLY on the real page... every man's turn logged from the page's own events'): the
     fight's page in a browser, phone upright (390 x 844), both sides on AUTO at 1x, 2x and 4x, his crew with a gun, a bow and clubs;
     every motion the page really plays is logged (startAnim), and every turn the rules gave a man of his (an 'end' for him in a
     round) must have motions of his played in that round, half a beat at least on the clock (EYES 11/9, ask line 542: the quiet
     turn, a reload or a swap drawn as a quarter beat with no word, looked skipped): a step, a blow, a shot, or the reload, swap, rest
     or hold shown over him with its word. A turn the page passes with nothing of his shown, or under half a beat, is the skip. M7p planted: the page's runner drops one man's motions
     (his turn passes unseen), caught. */
  /* rule 435(e): the old rule, for the plants (a rest whenever winded, no breath floor) */
  const OLD435E = r => r.replace("if (restBuys(u)) { u.btWhy = 'winded'; endTurn(u); return false; }", "{ u.btWhy = 'winded'; endTurn(u); return false; }").replace("const m = rawFatMax(u), fl = breathFloor(u); return Math.max(m, fl);", "return rawFatMax(u);");
  if (!process.argv.includes('--no-page')) {
    const http = require('http'), { chromium } = require('playwright');
    const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.css': 'text/css', '.mp3': 'audio/mpeg' };
    const srv = http.createServer((q, rs) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.writeHead(404); return rs.end(); }
      if (/old435e/.test(q.url) && /BOHEMIA_FIGHT\.html$/.test(f)) { rs.writeHead(200, { 'content-type': 'text/html' }); return rs.end(OLD435E(fs.readFileSync(f, 'utf8'))); }   /* M7w: the page with the old rule */ rs.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(rs); }).listen(0);
    const br = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
    const LOGGER = function () { var P = window.__P435 = { anims: [], hooked: false };
      (function hook() { if (typeof window.startAnim === 'function' && typeof window.take === 'function' && !P.hooked) { P.hooked = true; var sa = window.startAnim;
          window.startAnim = function (a) { try { P.anims.push({ k: a.k, id: a.e && a.e.id, et: a.e && a.e.t, r: a.e && a.e.round, dur: a.dur || 0, b: beatMs() }); } catch (e) {} return sa.apply(this, arguments); };
          var tk = window.take; window.take = function () { try { if (window.__DROP435) FIGHT.S.events = FIGHT.S.events.filter(function (e) { return e.id !== window.__DROP435; }); } catch (e) {} return tk.apply(this, arguments); }; }
        if (!P.hooked) setTimeout(hook, 20); })(); };
    const crew = [{ background: 'apprentice', level: 3, gear: { main: 'handgonne' } }, { background: 'hunter', level: 3, gear: { main: 'short_bow' } }, { background: 'butcher', level: 3, gear: { main: 'crude_axe' } },
      { background: 'brawler', level: 3, gear: { main: 'two_handed_mallet' } }, { background: 'messenger', level: 2, gear: { main: 'snub_revolver' } }, { background: 'daytaler', level: 2, gear: { main: 'dagger' } },
      { background: 'sellsword', level: 3, gear: { main: 'two_handed_hammer', body: 'coat_of_plates', head: 'decorated_full_helm' } }];   /* rule 435(e): the heaviest kit on the page */
    const pageFight = async (o, drop, old) => {
      const c = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
      const p = await c.newPage(), errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 120)));
      await p.addInitScript(LOGGER); await p.addInitScript(o => { window.FIGHT_OPTS = o; try { localStorage.clear(); } catch (e) {} }, o);
      await p.goto('http://localhost:' + srv.address().port + '/slices/BOHEMIA_FIGHT.html' + (old ? '?old435e' : ''), { waitUntil: 'load' });
      await p.waitForFunction(() => { try { return !!(FIGHT.S.board && UI.board && window.__P435 && __P435.hooked); } catch (e) { return false; } }, null, { timeout: 120000 });
      if (drop) await p.evaluate(() => { const v = FIGHT.S.units.filter(u => u.side === 'you' && !u.main)[0]; window.__DROP435 = v && v.id; });
      const t0 = Date.now(); while (Date.now() - t0 < 150000) { const ov = await p.evaluate(() => FIGHT.S.over).catch(() => true); if (ov) break; await p.waitForTimeout(1000); }
      await p.waitForFunction(() => { try { return !UI.anim.length; } catch (e) { return true; } }, null, { timeout: 20000 }).catch(() => {});   /* the last blow played: the rules end the fight before the page shows it */
      const res = await p.evaluate(() => { const S = FIGHT.S, A = __P435.anims, bad = [], seen = []; let turns = 0, held = 0;
        const lastR = S.over ? S.round : S.round - 1;
        S.units.filter(u => u.side === 'you').forEach(u => { for (let r = 1; r <= lastR; r++) {
          const L = S.log.filter(e => e.id === u.id && e.round === r); if (!L.some(e => e.t === 'end')) continue;
          if (L.some(e => e.t === 'morale' && e.to === 'Fleeing') || S.log.some(e => e.id === u.id && e.round < r && (e.t === 'fled' || (e.t === 'morale' && e.to === 'Fleeing')))) continue;
          turns++; const mine = A.filter(a => a.id === u.id && a.r === r), seen = mine.reduce((m, a) => m + a.dur, 0), half = mine.length ? mine[0].b / 2 : 0;
          if (mine.some(a => a.et === 'idle')) held++;
          if (!mine.length) bad.push(u.name + ' (' + (u.weapon && u.weapon.id) + ') round ' + r + ': nothing shown');
          else if (seen < half - 1) bad.push(u.name + ' (' + (u.weapon && u.weapon.id) + ') round ' + r + ': ' + Math.round(seen) + ' ms shown, under half a beat (' + mine.map(a => a.et).join(',') + ')'); } });
        /* rule 435(e): WINDED shown over a man of his two of his turns running */
        const twice = []; S.units.filter(u => u.side === 'you').forEach(u => { let lastR = -9; S.log.filter(e => e.id === u.id && e.t === 'idle' && e.why === 'winded').forEach(e => { if (e.round === lastR + 1) twice.push(u.name + ' rounds ' + lastR + ',' + e.round); lastR = e.round; }); });
        const heavy = S.units.find(u => u.side === 'you' && u.bodyRow && u.bodyRow.id === 'coat_of_plates'), hv = heavy ? S.log.filter(e => e.id === heavy.id && /attack|step|move|shot/.test(e.t)).length : null;
        return { over: S.over, rounds: S.round, board: S.boardDef && S.boardDef.name, hand: UI.hand, auto: UI.auto, turns, held, bad, drop: window.__DROP435 || null, anims: A.length, twice, heavyActs: hv, heavyFloored: heavy ? FIGHT.kitFloored(heavy) : null }; });
      res.errs = errs.slice(0, 2); await c.close(); return res;
    };
    const runs = []; let PG = [];
    for (const [i, sp, d] of [[0, 1, 'industrial'], [1, 2, 'wash'], [2, 4, 'downtown']]) runs.push(await pageFight({ district: d, cell: { gx: 20 + i * 13, gy: 31 + i * 7 }, seed: 4350 + i, night: false, auto: true, deploy: false, formation: null, hand: sp, company: crew }, false));
    const turns = runs.reduce((m, x) => m + x.turns, 0), bad = [].concat.apply([], runs.map(x => x.bad)), held = runs.reduce((m, x) => m + x.held, 0);
    check(bad.length === 0 && turns >= 30 && runs.every(x => x.auto && x.anims > 0) && runs.map(x => x.hand).join() === '1,2,4', 'M7', 'ON THE PAGE: ' + runs.length + ' fights on the fight\'s page, phone upright, AUTO at ' + runs.map(x => x.hand + 'x').join(', ') + ' (' + runs.map(x => x.board + ' ' + x.rounds + ' rounds' + (x.over ? '' : ' (cut at 150 s)')).join('; ') + '): ' + (turns - bad.length) + ' of ' + turns + ' turns of his played on the glass, each half a beat or more (' + held + ' of them a quiet turn shown with its word: a reload, a swap, a rest, a hold); ' + bad.length + ' passed with nothing of his shown' + (bad.length ? ': ' + bad.slice(0, 3).join('; ') : '') + (runs.some(x => x.errs.length) ? '; page errors: ' + runs.map(x => x.errs.join(' ')).join(' ') : ''));
    const pl = await pageFight({ district: 'industrial', cell: { gx: 20, gy: 31 }, seed: 4350, night: false, auto: true, deploy: false, formation: null, hand: 4, company: crew }, true);
    const tw = [].concat.apply([], runs.map(x => x.twice));
    check(tw.length === 0 && runs.every(x => x.heavyActs > 0), 'M7w', 'ON THE PAGE, THE WINDED MAN ACTS (rule 435(e)): the man in the coat of plates with the two-handed hammer walked or struck ' + runs.map(x => x.heavyActs).join(', ') + ' times in the three fights (his breath held up by the floor: ' + runs.map(x => x.heavyFloored).join(',') + '); WINDED two turns running over any man of his: ' + tw.length + (tw.length ? ' (' + tw.slice(0, 2).join('; ') + ')' : ''));
    const ow = await pageFight({ district: 'industrial', cell: { gx: 20, gy: 31 }, seed: 4350, night: false, auto: true, deploy: false, formation: null, hand: 4, company: crew }, false, true);
    check(ow.twice.length > 0, 'M7wp', 'planted: the page served with the old rule (a rest whenever winded, no floor): WINDED two turns running ' + ow.twice.length + ' times (' + ow.twice.slice(0, 1).join('') + '), the heavy man acted ' + ow.heavyActs + ' times, caught');
    check(pl.bad.length > 0, 'M7p', 'planted: the page\'s runner drops one man\'s motions (' + pl.drop + '), caught: ' + pl.bad.length + ' of his turns passed unseen (' + pl.bad.slice(0, 2).join('; ') + ')');
    R.page = { runs, plant: pl };
    await br.close(); srv.close();
  }
  /* M8 / M9 (rule 435(e)): THE WINDED MAN ACTS; NEVER WINDED FOR LIFE */
  const HEAVY = [{ tag: 'the coat of plates and a two-handed hammer', m: { background: 'sellsword', level: 3, gear: { main: 'two_handed_hammer', body: 'coat_of_plates', head: 'decorated_full_helm' } } },
    { tag: 'the coat of plates and the man-splitter', m: { background: 'militia', level: 2, gear: { main: 'man_splitter', body: 'coat_of_plates', head: 'heavy_horned_plate_helmet' } } },
    { tag: 'the Lone Wolf in gold', m: { background: 'hedge_knight', level: 4, gear: { main: 'fighting_axe', off: 'kite_shield', body: 'wolf_gilded_riot_armour', head: 'wolf_gilded_riot_helm' } } },
    { tag: 'heavy lamellar, a mace and a kite', m: { background: 'squire', level: 3, gear: { main: 'winged_mace', off: 'kite_shield', body: 'heavy_lamellar_armor', head: 'decayed_great_helm' } } },
    { tag: 'the gladiator', m: { background: 'gladiator', level: 4, gear: { main: 'crude_axe', off: 'heater_shield', body: 'pit_fight_robe_carrier', head: 'pit_sparring_riot_helmet' } } }];
  const winded = function (E, NF, force, jam) {
    const F2 = E.FIGHT, P2 = E.DB.ours.place_boards.value.places, pl = Object.keys(P2), o = { turns: 0, wStart: 0, wRest: 0, wActs: 0, wStill: [], twice: [], fights: 0, holds2: [], jamTurns: 0, jamActs: 0, noSafer: 0, jamWhy: {} };
    for (let f = 0; f < NF; f++) {
      const k = jam ? { tag: 'a handgonne that cannot reload', m: { background: 'apprentice', level: 3, gear: { main: 'handgonne' } } } : HEAVY[f % HEAVY.length], crew = [k.m, HEAVY[(f + 2) % HEAVY.length].m, { background: 'hunter', level: 3, gear: { main: 'short_bow' } }];
      E.setSeed(7100 + f); try { F2.setup({ kind: 'suburb', district: P2[pl[f % pl.length]].districts[0], cell: { gx: (f * 37 + 11) % 90, gy: (f * 53 + 7) % 90 }, night: false, auto: true, formation: null, deploy: false, company: crew }); } catch (e) { continue; }
      const S = F2.S; S.deploy = false; o.fights++; try { F2.startFight && F2.startFight(); } catch (e) {}
      const mine = S.units.filter(u => u.side === 'you').slice(0, 2), last = {}; let g = 0, cur = null;
      const close = () => { if (!cur) return; const u = cur.u, L = S.log.slice(cur.l0).filter(e => e.id === u.id), act = u.x !== cur.x || u.y !== cur.y || L.some(e => /attack|shot|sweep|throw|net|hook|step|move/.test(e.t));
        const rest = !act && u.btWhy === 'winded'; o.turns++;
        if (cur.w) { o.wStart++; if (rest) o.wRest++; else if (act) o.wActs++; else if (u.btWhy === 'safest_here' || u.btWhy === 'no_safer') o.wSafe = (o.wSafe || 0) + 1; else if (u.btWhy !== 'ring' && !u.dead) o.wStill.push(k.tag + ' s' + f + ' r' + cur.r + ' ' + u.name + ' (' + (u.btWhy || 'none') + ')'); }
        if (jam && u === mine[0] && !act && u.btWhy === 'unable_near') { if (o.lastHold === cur.r - 1) o.holds2.push(k.tag + ' s' + f + ' r' + cur.r); o.lastHold = cur.r; }
        if (jam && u === mine[0]) { o.jamTurns++; if (act) o.jamActs++; if (u.btWhy === 'no_safer') o.noSafer++; if (!act) o.jamWhy[u.btWhy || 'none'] = (o.jamWhy[u.btWhy || 'none'] || 0) + 1; }
        if (rest && last[u.id] === cur.r - 1) o.twice.push(k.tag + ' s' + f + ' r' + cur.r + ' ' + u.name); if (rest) last[u.id] = cur.r; cur = null; };
      while (!S.over && S.round <= 30 && g < 60000) { const u = F2.current(); if (!u) break;
        if (mine.indexOf(u) >= 0 && (!cur || cur.u !== u || cur.r !== S.round)) { close(); if (force && u === mine[0] && u.ap >= u.apTurn) u.fat = F2.fatMax(u); if (jam && u === mine[0] && u.ap >= u.apTurn) { u.loaded = false; u.fat = Math.max(0, F2.fatMax(u) - 10); u.poison = Math.max(u.poison || 0, 1);
          /* the fight on him, as on the real page: the nearest man of theirs two tiles off (near, not yet his reach on him) */
          const th = S.units.filter(t => t.side !== 'you' && !t.dead && !t.fled && t.hp > 0).sort((a, b) => (Math.abs(a.x - u.x) + Math.abs(a.y - u.y)) - (Math.abs(b.x - u.x) + Math.abs(b.y - u.y)))[0];
          if (th && Math.max(Math.abs(th.x - u.x), Math.abs(th.y - u.y)) > 2) { for (const d of [[2, 0], [-2, 0], [0, 2], [0, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]) { const x = u.x + d[0], y = u.y + d[1]; if (x >= 0 && y >= 0 && x < S.w && y < S.h && F2._t.passable(x, y) && !F2._t.unitAt(x, y) && !(F2.level(x, y) > 0)) { th.x = x; th.y = y; break; } } } } cur = { u, r: S.round, l0: S.log.length, x: u.x, y: u.y, w: F2.winded(u) }; }
        else if (mine.indexOf(u) < 0 && cur) close();
        F2.aiStep(u); g++; }
      close(); }
    return o; };
  { const w8 = winded(ctx, 40);
    check(w8.fights >= 35 && w8.twice.length === 0 && w8.wStill.length === 0, 'M8', 'THE WINDED MAN ACTS: ' + w8.fights + ' fights of his men in the heaviest kits, ' + w8.turns + ' of their turns, ' + w8.wStart + ' started winded: ' + w8.wRest + ' a rest that buys his blow, ' + w8.wActs + ' walked, struck or shot; ' + w8.twice.length + ' rested winded two turns running, ' + w8.wStill.length + ' stood with nothing' + (w8.twice.length + w8.wStill.length ? ': ' + w8.twice.concat(w8.wStill).slice(0, 3).join('; ') : ''));
    /* the man winded at the start of every turn of his (his breath put at its most, the hardest case): he still acts every other turn */
    const w8b = winded(ctx, 20, true);
    check(w8b.wStart >= 60 && w8b.twice.length === 0 && w8b.wStill.length === 0 && w8b.wActs > 0, 'M8b', 'A MAN WINDED AT EVERY TURN\'S START (his breath put at its most): ' + w8b.wStart + ' winded turns, ' + w8b.wRest + ' rests that buy his blow, ' + w8b.wActs + ' walked, struck or shot, ' + (w8b.wSafe || 0) + ' held the safest tile of his walk (said over him); ' + w8b.twice.length + ' rested two turns running, ' + w8b.wStill.length + ' stood with nothing' + (w8b.twice.length + w8b.wStill.length ? ': ' + w8b.twice.concat(w8b.wStill).slice(0, 3).join('; ') : ''));
    /* a gunman who cannot fire or reload where he stands (unloaded, his reload's breath out of reach: the handgonne struck and poisoned
       on the real page, NO SHOT fourteen turns running): never NO SHOT two turns running while a safer tile is in his walk */
    const w8c = winded(ctx, 20, false, true);
    check(w8c.jamTurns >= 40 && w8c.holds2.length === 0, 'M8c', 'A GUNMAN WHO CANNOT RELOAD WHERE HE STANDS: ' + w8c.jamTurns + ' of his turns, ' + w8c.jamActs + ' a walk or a shot, ' + w8c.noSafer + ' held with nowhere safer in his walk (said); NO SHOT two turns running ' + w8c.holds2.length + (w8c.holds2.length ? ': ' + w8c.holds2.slice(0, 3).join('; ') : ''));
    const w8cp = winded(eng(r => (r).replace("if (!ring && !able && near && u.restedBack && !actedNow(u)) {", "if (false) {")), 20, false, true);
    check(w8cp.holds2.length > 0, 'M8cp', 'planted: the fall back taken out: NO SHOT two turns running ' + w8cp.holds2.length + ' times, caught (' + JSON.stringify(w8cp.jamWhy) + ' / now ' + JSON.stringify(w8c.jamWhy) + ')');
    const w8p = winded(eng(OLD435E), 20, true);
    check(w8p.twice.length > 0, 'M8p', 'planted: the old rule (a rest whenever winded, no breath floor), the same man winded at every turn\'s start: ' + w8p.wStart + ' of ' + w8p.turns + ' turns winded, ' + w8p.twice.length + ' winded rests two turns running, caught (' + w8p.twice.slice(0, 1).join('') + ')');
    R.winded = { now: { turns: w8.turns, wStart: w8.wStart, wRest: w8.wRest, wActs: w8.wActs }, old: { turns: w8p.turns, wStart: w8p.wStart, twice: w8p.twice.length } }; }
  { const life = function (E) { const F2 = E.FIGHT, out = { men: 0, heavy: [], thin: [], floored: 0 };
      const OSB = {}, sb = { window: OSB, fetch: u => Promise.resolve({ json: () => JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb', path.basename(u)), 'utf8')) }), localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }, console };
      vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'engine/bohemia_origin_start.js'), 'utf8'), sb);
      return (OSB.BohemiaOriginStart || sb.BohemiaOriginStart).load(ROOT + '/records/target/bb/').then(() => { const BOS = OSB.BohemiaOriginStart || sb.BohemiaOriginStart, crews = [];
        BOS.data.origins.origins.forEach(og => { for (let s = 0; s < 12; s++) { const c = BOS.roll(og.id, 2000 + s); if (c) crews.push({ tag: og.id, c }); } });
        HEAVY.forEach(h => crews.push({ tag: h.tag, c: [h.m] }));
        crews.forEach(q => { E.setSeed(77); try { F2.setup({ kind: 'desert', district: 'desert', night: false, auto: true, formation: null, deploy: false, company: q.c }); } catch (e) { return; }
          F2.S.units.filter(u => u.side === 'you').forEach(u => { out.men++; const M = F2.fatMax(u); let c = null; const f0 = u.fat; for (let fv = M; fv >= -400; fv--) { u.fat = fv; if (!F2.winded(u)) { c = M - fv; break; } } u.fat = f0;
            if (F2.tooHeavy(u)) out.heavy.push(q.tag + ' ' + u.kind + ' ' + (u.weapon && u.weapon.id)); else if (c !== null && M < 2 * c) out.thin.push(q.tag + ' ' + u.kind + ' ' + M + '/' + c);
            if (F2.kitFloored && F2.kitFloored(u)) out.floored++; }); });
        return out; }); };
    const l9 = await life(ctx), l9p = await life(eng(r => r.replace("const m = rawFatMax(u), fl = breathFloor(u); return Math.max(m, fl);", "return rawFatMax(u);")));
    check(l9.men >= 150 && l9.heavy.length === 0 && l9.thin.length === 0, 'M9', 'NEVER WINDED FOR LIFE: ' + l9.men + ' men (every origin\'s crew, 12 rolls, and the heaviest kits): none whose blow costs more than his breath, every one holds two of his blows from fresh (' + l9.floored + ' held up by TUNING\'s breath floor, his card says so)' + (l9.heavy.length + l9.thin.length ? ': ' + l9.heavy.concat(l9.thin).slice(0, 3).join('; ') : ''));
    check(l9p.heavy.length > 0, 'M9p', 'planted: the breath floor off: ' + l9p.heavy.length + ' men can never swing (' + l9p.heavy.slice(0, 2).join('; ') + '), caught'); }
  check(now.fights >= 20 && Object.keys(now.kinds).length >= 15 && now.turns >= 1000, 'M3', now.fights + ' fights over ' + Object.keys(now.kinds).length + ' board kinds, ' + now.turns + ' of his turns weighed');
  R.whole = { fights: wh.fights, men: wh.men, never: wh.never, cut: wh.cut };
  R.now = { fights: now.fights, kinds: Object.keys(now.kinds), turns: now.turns, acted: now.acted, held: now.held, stalls: now.stalls, behind: now.behind };
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  console.log('\nEVERY MAN ACTS ON AUTO: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
