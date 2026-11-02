#!/usr/bin/env node
/* CLIMB OR ATTACK (COMBAT 5, rule 328, Paolo 11/2; ask line 326): 'New rule: you cannot climb on top of a building and attack
   anything within the same turn. This is for everyone, the same turn.' records/BOHEMIA_COMBAT_CLIMB_OR_ATTACK_11_2_26.md.
   Legs, headless on the live fight's rules:
   C1 THE RULE IS DATA: ours.climb_or_attack on, sourced with his words and the why; every attack kind named in refused;
   C2 A CLIMB MARKS HIM: a man on the street beside a roof walks up onto it: the climb is said ('climbed'), the mark is on, and from
      the street the same blow was his before the climb;
   C3 EVERY ATTACK REFUSED: up there, for a club, a gun, a sweep weapon, a hook, the shove and the net: canStrike, strike, every
      sweep, the hook, the shove, the net all refused, strikeWhy reads 'climbed'; nothing of his lands; reloading, WAIT and the walk
      on are still his;
   C4 THE NEXT TURN HE ATTACKS: the round after, the mark is gone and the same blow is his; a walk along the roof (no climb) keeps
      his blow; a way that climbs is read as climbing (climbsOn) and one that does not is not;
   C5 EVERY SIDE ON AUTO: the brains' own fights (raiders, the robots, the act-one bosses, wolves), both sides on AUTO: no man of
      either side climbs a roof and attacks in the same turn; no shooter of either side climbs while he had a shot where he stood;
      climbs still happen (the rule is exercised);
   C6 THE FIGHTS STAY SHORT: minutes on AUTO (the bench's own sum: 2 beats a turn that acts, half a beat one that passes, 120 a
      minute) under 4 for every kind, nothing threw.
   Run: node gates/climb_or_attack_gate.js [--n 6] [--before]   (--before: the rule's switch off in the memory copy, the brain as it is) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const N = Number(arg('--n', 6)), BEFORE = process.argv.indexOf('--before') > 0;
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const CREW3 = [{ background: 'companion_2hand', name: 'RAUL' }, { background: 'companion_1hand', name: 'DESI' }, { background: 'companion_ranged', name: 'TINA' }];
const off = ctx => { if (BEFORE && ctx.DB.ours.climb_or_attack) ctx.DB.ours.climb_or_attack.value.on = false; return ctx; };

/* C1 */
const O = J('records/target/bb/ours.json'), CA = O.climb_or_attack;
const KINDS = ['strike', 'sweep', 'dial_shot', 'hook', 'line_breaker', 'throw_net', 'lash', 'throw', 'spark'];
leg(!!(CA && CA.value && CA.value.on === true && CA.source && /climb on top of a building and attack/.test(CA.quote || '') && (CA.why || '').length > 200 &&
  KINDS.every(k => CA.value.refused.indexOf(k) >= 0) && Array.isArray(CA.value.attack_skills)),
  'C1 THE RULE IS DATA: ours.climb_or_attack on, his words, every attack kind refused (' + KINDS.join(', ') + ')');

/* C2-C4: a roof with street beside it, a man of his on the street, a man of theirs he can reach from the roof tile */
{
  const ctx = off(engine()), F = ctx.FIGHT, T = F._t;
  let found = null, sd;
  for (sd = 1; sd < 80 && !found; sd++) {
    ctx.setSeed(sd); F.setup({ kind: 'works', company: CREW3, cap: 12, deploy: false, formation: null, band: ['brigand_thug', 'brigand_thug'] });
    const S = F.S;
    for (let y = 1; y < S.h - 1 && !found; y++) for (let x = 1; x < S.w - 1 && !found; x++) {
      if (!F.isRoof(x, y) || F.level(x, y) < 1 || !T.passable(x, y)) continue;
      const nb = [[0, 1], [1, 0], [-1, 0], [0, -1]].map(d => ({ x: x + d[0], y: y + d[1] })).filter(q => T.passable(q.x, q.y));
      const foot = nb.filter(q => !F.isRoof(q.x, q.y) && F.level(q.x, q.y) < F.level(x, y))[0];
      const along = nb.filter(q => F.isRoof(q.x, q.y) && F.level(q.x, q.y) === F.level(x, y))[0];
      const far = foot && [[0, 1], [1, 0], [-1, 0], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].map(d => ({ x: x + d[0], y: y + d[1] }))
        .filter(q => T.passable(q.x, q.y) && (q.x !== foot.x || q.y !== foot.y) && Math.max(Math.abs(q.x - foot.x), Math.abs(q.y - foot.y)) === 1)[0];
      if (foot && along && far) found = { x, y, foot, along, foe: far };
    }
  }
  if (!found) leg(false, 'C2 a roof with street beside it', 'none in 80 seeds of works');
  else {
    const S = F.S, me = S.units.filter(v => v.side === 'you')[0], foe = S.units.filter(v => v.side === 'them')[0];
    S.units.forEach(v => { if (v !== me && v !== foe) { v.x = -50; v.y = -50; } });
    const club = me.weapon;
    const put = () => { me.x = found.foot.x; me.y = found.foot.y; foe.x = found.foe.x; foe.y = found.foe.y; me.ap = 40; me.fat = 0; me.upRound = undefined; me.morale = 'Steady'; S.order = [me.id, foe.id]; S.idx = 0; me.loaded = true; me.ammo = null; };
    put();
    const before = F.canStrike(me, foe);
    const L0 = S.log.length, walked = F.moveTo(me, found.x, found.y);
    const said = S.log.slice(L0).some(e => e.t === 'climbed' && e.id === me.id);
    leg(before && walked && me.x === found.x && me.y === found.y && said && F.climbedNow(me),
      'C2 A CLIMB MARKS HIM: from the street his blow was his; he walks up the roof, the climb is said and marked',
      JSON.stringify({ seed: sd - 1, roof: [found.x, found.y, 'lv' + F.level(found.x, found.y)], foot: found.foot, foe: found.foe, before, walked, said, marked: F.climbedNow(me) }));
    /* C3: every attack kind, up there */
    const rows = ctx.DB.weapons.rows;
    const gun = rows.filter(w => F.isGun(w) && F.reloadSkill(w))[0] || rows.filter(w => F.isGun(w))[0];
    const thrown = rows.filter(w => F.isRanged(w) && !F.isGun(w))[0];
    const sweeper = rows.filter(w => !F.isRanged(w) && F.sweepSkills(w).length)[0];
    const hooker = rows.filter(w => T.hasHook(w))[0];
    const res = {};
    const tryAll = (w, name) => {
      me.weapon = w; me.ammo = w.ammo ? 3 : null; me.loaded = true; me.ap = 40; me.fat = 0;
      const r = { strike: F.canStrike(me, foe), why: (F.strikeWhy(me, foe) || {}).why };
      const L1 = S.log.length; r.struck = !!F.strike(me, foe);
      F.sweepSkills(w).forEach(k => { r['sweep:' + k.name] = F.canSweep(me, foe, k.name) || !!F.sweep(me, foe, null, k.name); });
      if (T.hasHook(w)) { foe.x = found.x + 2 * Math.sign(found.foe.x - found.x || 1); r.hookTarget = !!T.hookTarget(me); r.hook = T.hook(me, foe); foe.x = found.foe.x; }
      r.landed = S.log.slice(L1).some(e => e.t === 'attack' && e.id === me.id);
      res[name] = r;
      return !r.strike && !r.struck && !r.landed && r.why === 'climbed' && !Object.keys(r).some(k => /^sweep:|^hook/.test(k) && r[k]);
    };
    let all = [tryAll(club, 'club:' + club.id)];
    if (gun) all.push(tryAll(gun, 'gun:' + gun.id));
    if (thrown) all.push(tryAll(thrown, 'thrown:' + thrown.id));
    if (sweeper) all.push(tryAll(sweeper, 'sweep weapon:' + sweeper.id));
    if (hooker) all.push(tryAll(hooker, 'hook:' + hooker.id));
    me.weapon = club;
    me.racial = ['line_breaker', 'throw_net']; me.nets = 2; me.ap = 40;
    res.shove = F.canShove(me, foe) || F.shove(me, foe); res.net = F.canNet(me, foe) || F.throwNet(me, foe);
    all.push(!res.shove && !res.net);
    me.racial = [];
    /* still his: the reload, the walk on along the roof, WAIT */
    me.weapon = gun || club; me.loaded = false; me.ammo = gun && gun.ammo ? 0 : null; me.ap = 40;
    const canRe = !gun || !F.reloadSkill(gun) || F.canReload(me);
    me.weapon = club; me.ap = 40; foe.x = -50; foe.y = -50;   /* the walk on with nobody beside him (no free swing to hold him) */
    const walkOn = F.moveTo(me, found.along.x, found.along.y) && me.x === found.along.x;
    F.moveTo(me, found.x, found.y);
    const waits = F.wait(me); foe.x = found.foe.x; foe.y = found.foe.y;
    leg(all.every(Boolean) && canRe && walkOn && waits,
      'C3 EVERY ATTACK REFUSED UP THERE: the blow, the gun, every sweep, the hook, the shove, the net (strikeWhy climbed); the reload, the walk on and WAIT still his',
      JSON.stringify({ res, canReload: canRe, walkOn, waits, kinds: { gun: gun && gun.id, thrown: thrown && thrown.id, sweeper: sweeper && sweeper.id, hooker: hooker && hooker.id } }));
    /* C4: the next round; a walk along the roof; climbsOn */
    S.order = [me.id, foe.id]; S.idx = 0; S.round++; me.ap = 40; me.fat = 0; me.weapon = club; me.x = found.x; me.y = found.y;
    const next = F.canStrike(me, foe);
    const L2 = S.log.length; F.moveTo(me, found.along.x, found.along.y); F.moveTo(me, found.x, found.y);
    const noMark = !F.climbedNow(me) && !S.log.slice(L2).some(e => e.t === 'climbed'), still = F.canStrike(me, foe);
    me.x = found.foot.x; me.y = found.foot.y;
    const up = F.climbsOn(me, [{ x: found.x, y: found.y }]), flat = F.climbsOn(me, [{ x: found.foot.x, y: found.foot.y }]);
    me.x = found.x; me.y = found.y; const along = F.climbsOn(me, [{ x: found.along.x, y: found.along.y }]);
    leg(next && noMark && still && up && !flat && !along,
      'C4 THE NEXT TURN HE ATTACKS: the mark is gone the round after; a walk along the roof is no climb; a way up is read as one',
      JSON.stringify({ next, noMark, still, climbsUp: up, flat, along }));
  }
}

/* C5 + C6: the brains' own fights, both sides on AUTO */
{
  const ctx = off(engine()), F = ctx.FIGHT;
  const districts = (ctx.DB.boardKinds && ctx.DB.boardKinds.districts) || [];
  const BOSSES = J('records/target/bb/boss_act_one.json').bosses;
  const companyOf = size => size === 3 ? CREW3 : CREW3.concat([{ background: 'companion_ranged', name: 'NENA' }, { background: 'companion_2hand', name: 'BETO' }, { background: 'companion_ranged', name: 'LUZ' }]);
  const KINDS2 = [
    { id: 'raiders', opts: size => ({ party: { faction: 'brigands', count: Math.round(size * 1.2), days: 30 } }) },
    { id: 'robots', opts: size => { const band = ['necromancer']; for (let i = 0; i < Math.round(size * 1.2); i++) band.push(i % 3 === 2 ? 'armored_wiederganger' : 'wiederganger'); return { party: { band, count: band.length, rolled: true, days: 30 } }; } },
    { id: 'bosses', opts: (size, k) => { const B = BOSSES[k % BOSSES.length], band = [B.boss.kind].concat(B.crew || []);
      return { party: { band, count: band.length, rolled: true, boss: true, days: 30 }, boss: { n: B.n, kind: B.boss.kind, name: B.boss.name, hp_x: +B.boss.hp_x || 1, weapon: B.boss.weapon, shield: B.boss.shield } }; } },
    { id: 'wolves', opts: size => ({ party: { faction: 'beasts', count: Math.round(size * 1.5), days: 30 } }) }
  ];
  const T = { climbs: { you: 0, them: 0 }, climbThenAttack: 0, climbPastAShot: 0, errs: [], ex: [] }, mins = {};
  for (const K of KINDS2) {
    let beats = 0, fights = 0;
    for (let k = 0; k < N; k++) {
      try {
        const size = [3, 6][k % 2], d = districts.length ? districts[(k * 7 + 3) % districts.length] : null;
        ctx.setSeed(7300 + k);
        F.setup(Object.assign({ auto: true, formation: null, company: companyOf(size), cap: size, days: 30, act: 1, district: d && d.district, cell: { x: 11 + (k % 29), y: 7 + (k % 31) } }, K.opts(size, k)));
        const S = F.S; S.deploy = false; if (F.startFight) try { F.startFight(); } catch (e) { /* starts on its own */ }
        let g = 0;
        const upAt = {};   /* id -> the round he climbed in (this turn) */
        while (!S.over && g < 200000) {
          const u = F.current(); if (!u) break;
          const ranged = F.isRanged(u.weapon), hadShot = ranged && !F.climbedNow(u) && S.units.some(t => t.side !== u.side && F.onField(t) && F.canStrike(u, t) && F.sideSees(u.side, t));
          const L0 = S.log.length; F.aiStep(u); g++;
          S.log.slice(L0).forEach(e => {
            if (e.t === 'turn') { if (upAt[e.id] !== e.round) delete upAt[e.id]; }   /* each event carries its own round (a climb that ends a round is stamped with that round) */
            const climbedStep = e.t === 'climbed' || (BEFORE && e.t === 'step' && !e.shoved && e.fx !== undefined && F.climbsUp(e.fx, e.fy, e.x, e.y));
            if (climbedStep && e.id === u.id) { const v = F.byId(e.id); T.climbs[v.side]++; upAt[v.id] = e.round; if (hadShot) T.climbPastAShot++; }
            if (e.t === 'attack' && !e.free && e.id === u.id && upAt[u.id] === e.round) { T.climbThenAttack++; if (T.ex.length < 4) T.ex.push({ kind: K.id, k, id: u.id, side: u.side, round: S.round }); }
          });
        }
        fights++;
        let op = false, acted = false;
        S.log.forEach(e => { if (e.t === 'turn') { if (op) beats += acted ? 2 : 0.5; op = true; acted = false; } else if (/^(step|attack|reload|skill)$/.test(e.t)) acted = true; });
        if (op) beats += acted ? 2 : 0.5;
      } catch (e) { T.errs.push(K.id + ': ' + String(e && e.message).slice(0, 160)); }
    }
    mins[K.id] = Math.round(beats / Math.max(1, fights) / 120 * 10) / 10;
  }
  const climbs = T.climbs.you + T.climbs.them;
  leg(T.climbThenAttack === 0 && T.climbPastAShot === 0 && climbs > 0,
    'C5 EVERY SIDE ON AUTO: nobody climbs a roof and attacks in the same turn; no shooter climbs past a shot he had; climbs still happen (' + 4 * N + ' fights)',
    JSON.stringify({ climbs: T.climbs, climbThenAttack: T.climbThenAttack, climbPastAShot: T.climbPastAShot, examples: T.ex }));
  leg(T.errs.length === 0 && Object.keys(mins).every(k => mins[k] > 0 && mins[k] < 4),
    'C6 THE FIGHTS STAY SHORT: minutes on AUTO under 4 for every kind, nothing threw', JSON.stringify({ minutes_on_auto: mins, errs: T.errs.slice(0, 3) }));
}
console.log('\nCLIMB OR ATTACK: ' + pass + '/' + (pass + fail) + (BEFORE ? ' (--before: the rule off in the memory copy; C2, C3 and C5 fail on it)' : ''));
process.exit(fail && !BEFORE ? 1 : 0);
