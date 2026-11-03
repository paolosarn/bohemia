#!/usr/bin/env node
/* COMBAT 7 [auto never leaves a man] 11/3 -- THE PROBE (a measuring instrument; EYES' broken item 1, rows 96, 109, 319, 331).
   EYES, fight three: one RUNNER stood beside RAUL's roof stabbing him for three rounds; YOU (splitting maul, AUTO on, 'Wavering')
   walked away east, climbed an empty roof, walked back, and swung only after RAUL was struck down.
   It plays the LIVE fight headless on AUTO for both sides, the best-turn probe's kinds and seeds (wolves, raiders, robots, the
   act-one bosses; companies of 3 and 6), and watches every turn of HIS men who swing (no gun, no bow, no throw in the hands):
     pressed     the turn opened with a man of theirs on the field, seen, not running, standing beside a friend of his (hurting him),
                 and the walk to beside that man open (the hunt field finite)
     left        of those, he did not strike and ended the turn farther from every such man than he began (by the hunt's steps)
     idle        of those, he did not strike and did not come nearer (no blow, no step in)
     by_morale   the same two counted by his nerve when the turn opened (Steady, Wavering, Breaking...)
     examples    the first few, with what the brain weighed (u.btLast) and said (u.btSay)
     node tools/bohemia_combat_auto_never_leaves_a_man_probe_11_3_26.js [--n 30] [--kinds wolves,raiders] [--json out.json] */
'use strict';
const fs = require('fs'), path = require('path');
const G = require('./bohemia_tuning_the_whole_grid.js');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const N = Number(arg('--n', 30)), OUT = arg('--json', null), ONLY = arg('--kinds', null);
const BOSSES = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/boss_act_one.json'), 'utf8')).bosses;
const KINDS = [
  { id: 'wolves', party: size => ({ faction: 'beasts', count: Math.round(size * 1.5) }) },
  { id: 'raiders', party: size => ({ faction: 'brigands', count: Math.round(size * 1.2) }) },
  { id: 'robots', party: size => { const band = ['necromancer']; for (let i = 0; i < Math.round(size * 1.2); i++) band.push(i % 3 === 2 ? 'armored_wiederganger' : 'wiederganger'); return { band: band, count: band.length, rolled: true }; } },
  { id: 'boss', boss: true }
];
const dist = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
(async () => {
  const ctx = await G.engine(true), F = ctx.FIGHT, T_ = F._t, districts = ctx.DB.boardKinds.districts;
  const out = { at: new Date().toISOString(), n: N, kinds: {}, total: { won: 0, fights: 0, pressed: 0, left: 0, idle: 0 } };
  for (const K of KINDS) {
    if (ONLY && ONLY.split(',').indexOf(K.id) < 0) continue;
    const C = { fights: 0, won: 0, pressed: 0, left: 0, idle: 0, by_morale: {}, examples: [], lefts: [], errs: [] };
    for (let k = 0; k < N; k++) {
      try {
        const size = [3, 6][k % 2], stage = ['early', 'middle'][Math.floor(k / 2) % 2];
        const d = districts[(k * 7 + 3) % districts.length];
        ctx.setSeed(6100 + k);
        let opts;
        if (K.boss) {
          const B = BOSSES[k % BOSSES.length], band = [B.boss.kind].concat(B.crew || []);
          opts = { auto: true, formation: null, company: G.companyOf(size, stage), cap: size,
            party: { band: band, count: band.length, rolled: true, boss: true, days: stage === 'early' ? 1 : 30 },
            boss: { n: B.n, kind: B.boss.kind, name: B.boss.name, hp_x: +B.boss.hp_x || 1, weapon: B.boss.weapon, shield: B.boss.shield },
            days: stage === 'early' ? 1 : 30, district: d.district, cell: { x: 11 + (k % 29), y: 7 + (k % 31) }, act: 1 };
        } else {
          opts = { auto: true, formation: null, company: G.companyOf(size, stage), cap: size,
            party: Object.assign({ days: stage === 'early' ? 1 : 30 }, K.party(size)),
            days: stage === 'early' ? 1 : 30, district: d.district, cell: { x: 11 + (k % 29), y: 7 + (k % 31) }, act: 1 };
        }
        F.setup(opts);
        const S = F.S; S.deploy = false;
        if (F.startFight) try { F.startFight(); } catch (e) { /* the bench's own setups start on their own */ }
        const idle = G.idleWatch(F);
        let g = 0, open = null;
        /* the men of theirs pressing a friend of u: on the field, seen, not running, beside a man of his who is not u */
        const pressing = u => S.units.filter(t => t.side !== u.side && F.onField(t) && t.morale !== 'Fleeing' && F.sideSees(u.side, t) &&
          S.units.some(m => m !== u && m.side === u.side && F.onField(m) && dist(m, t) === 1));
        const close = () => {
          if (!open) return;
          const r = open; open = null;
          const u = F.byId(r.id); if (!u || !F.onField(u)) return;
          const evs = S.log.slice(r.L0).filter(e => e.id === r.id);
          const struck = evs.some(e => (e.t === 'attack' && !e.free) || (e.t === 'skill'));
          if (struck) return;
          const hf = T_.huntField(u, true);
          /* distance to the nearest of the men who were pressing when the turn opened, by the hunt's steps from each */
          const near = (x, y) => Math.min.apply(null, r.targets.map(id => { const t = F.byId(id); return t && F.onField(t) ? dist({ x, y }, t) : Infinity; }));
          const d0 = near(r.x, r.y), d1 = near(u.x, u.y);
          if (!isFinite(d0) || !isFinite(d1)) return;
          const left = d1 > d0, still = d1 >= d0 && d1 > 1;
          const bm = C.by_morale[r.morale] = C.by_morale[r.morale] || { pressed: 0, left: 0, idle: 0 };
          if (left) { C.left++; bm.left++; } else if (still) { C.idle++; bm.idle++; }
          if ((left || still) && (left ? C.lefts.length < 6 : C.examples.length < 6)) (left ? C.lefts : C.examples).push({ fight: k, round: r.round, man: u.name, weapon: u.weapon && u.weapon.name, morale: r.morale,
            from: [r.x, r.y], to: [u.x, u.y], d0, d1, did: evs.map(e => e.t).join('/'), why: r.why, said: r.said, weighed: r.weighed });
        };
        while (!S.over && g < 200000) {
          const u = F.current(); if (!u) break;
          if (!open || open.id !== u.id || open.round !== S.round) {
            close();
            if (u.side === 'you' && !F.isRanged(u.weapon) && u.morale !== 'Fleeing' && !u.netted && u.ap > 0 && !F.winded(u)) {
              const ps = pressing(u), hf = ps.length ? T_.huntField(u) : null;
              if (ps.length && isFinite(hf(u.x, u.y))) {
                open = { id: u.id, round: S.round, L0: S.log.length, x: u.x, y: u.y, morale: u.morale, targets: ps.map(t => t.id) };
                C.pressed++; const bm = C.by_morale[u.morale] = C.by_morale[u.morale] || { pressed: 0, left: 0, idle: 0 }; bm.pressed++;
              }
            }
          }
          u.btWhy = null; u.btSay = null; F.aiStep(u); g++;
          if (open && open.id === u.id) { if (u.btWhy) open.why = u.btWhy; if (u.btSay) open.said = u.btSay; if (u.btLast) open.weighed = u.btLast; }
          if (idle()) break;
        }
        close();
        C.fights++; if (S.result === 'won') C.won++;
      } catch (e) { C.errs.push(String(e && e.stack || e).slice(0, 300)); }
    }
    out.kinds[K.id] = C;
    ['won', 'fights', 'pressed', 'left', 'idle'].forEach(k2 => { out.total[k2] += C[k2]; });
    console.log(K.id.toUpperCase(), JSON.stringify({ fights: C.fights, won: C.won, pressed: C.pressed, left: C.left, idle: C.idle, by_morale: C.by_morale, errs: C.errs.slice(0, 2) }));
  }
  console.log('TOTAL', JSON.stringify(out.total));
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
