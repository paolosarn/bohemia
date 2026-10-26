#!/usr/bin/env node
// TUNING [the recruit's ceiling] 10/26 -- RESEARCH INSTRUMENT, NOT A GATE (rule 216, the coordinator's NOTE; rule 38g).
// Paolo 10/26: 'in the recruiting pitstop just put the best at the absolute top... the more stars, the more expensive... when we
// level them up as much as we can, their stars and default good stats lead the way... you might have to make a calculator...
// that's one failure of Battle Brothers, no proper filter to quickly see who's the fire one.'
// RUN THREE ranks the post by a CEILING (a man's expected stats at level 11 from his base and stars through the game's level-up
// function). The NOTE asks TUNING: which stats count for a melee man and a gunman, how the stars widen the roll, the BARGAIN line.
//
//   --weights   WHAT A POINT IS WORTH, on the live fight: a company of six at level 5 in the town shelf (TUNING's whole-grid
//               company) against brigands sized near an even fight; +10 on ONE stat of every man of ONE kind (his melee men, or
//               his gunmen), 100 seeded fights a cell, the same fights for every cell; the win gained per point is the weight
//   --halls     THE HALL, rolled the way the settlement screen rolls it (engine/bohemia_goodbros.js's six, the hall's three
//               stars, the hall's price formula as gates/the_hire_price_is_the_formula_gate.js reads it): each man's ceiling for
//               both kinds through the expected level-up (rules.json stat_gains_by_stars, four picks a level, ten levels), the
//               BARGAIN line tried several ways
//   node tools/bohemia_tuning_the_recruit_ceiling.js --weights [--n 100] [--jobs 4] | --halls [--posts 2000] [--weights-from <json>]
// Every number it prints is DRAFT.
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const CACHE = process.env.TUNING_CACHE || '/tmp';
const STATS = ['hp', 'fatigue', 'resolve', 'initiative', 'melee_skill', 'ranged_skill', 'melee_defense', 'ranged_defense'];
const FIELD = { hp: 'hp', fatigue: 'fatigue', resolve: 'resolve', initiative: 'initiative', melee_skill: 'mskill', ranged_skill: 'rskill', melee_defense: 'mdef', ranged_defense: 'rdef' };
const KEYNAME = { hp: 'HP', fatigue: 'Fatigue', resolve: 'Resolve', initiative: 'Initiative', melee_skill: 'Melee Skill', ranged_skill: 'Ranged Skill', melee_defense: 'Melee Defense', ranged_defense: 'Ranged Defense' };
/* the four picks a level by kind: TUNING's killer company plan (records/BOHEMIA_TUNING_THE_KILLER_COMPANY_STATS_AND_LEVEL_UPS_10_25_26.md s5),
   the plan the measured weights below are checked against */
const PLAN = { melee: ['melee_skill', 'melee_defense', 'fatigue', 'ranged_defense'], gun: ['ranged_skill', 'fatigue', 'hp', 'ranged_defense'] };
const COUNT = Number(arg('--count', 9)), BUMP = 10;

/* ---------- the weights: one fight cell ---------- */
async function weightCell(kind, stat, n) {
  const B = require('./bohemia_tuning_auto_brain.js'), G = require('./bohemia_tuning_the_whole_grid.js');
  const ctx = await B.engineFor('today'), F = ctx.FIGHT, districts = ctx.DB.boardKinds.districts;
  const company = G.companyOf(6, 'middle');
  let won = 0, clean = 0, down = 0;
  for (let k = 0; k < n; k++) {
    const W = B.fightOf(k, districts);
    ctx.setSeed(7000 + k);
    F.setup({ auto: true, formation: null, company: company, cap: 6, party: { faction: 'brigands', count: COUNT, days: 30 }, days: 30, district: W.district, cell: W.cell, act: 1 });
    F.S.deploy = false;
    if (stat) F.S.units.forEach(u => { if (u.side !== 'you') return; const gun = F.isRanged(u.weapon); if ((kind === 'gun') !== gun) return;
      const f = FIELD[stat]; u[f] += BUMP; if (stat === 'hp') u.hpMax += BUMP; });
    const idle = G.idleWatch(F); let g = 0;
    while (!F.S.over && g++ < 400000) { const v = F.current(); if (!v) break; F.aiStep(v); if (idle()) break; }
    const mine = F.S.units.filter(u => u.side === 'you');
    if (F.S.result === 'won') { won++; if (!mine.some(u => u.down || u.dead)) clean++; }
    down += mine.filter(u => u.down || u.dead).length;
  }
  return { kind, stat, n, won, clean, down };
}

/* ---------- the hall, rolled the settlement screen's way ---------- */
function hallMen(GB, place, week, nMen) {
  const key = place + ':' + week, six = GB.sixAtThePost(key), more = nMen > 6 ? GB.sixAtThePost(key + ':more') : [];
  return six.concat(more).slice(0, nMen).map((r, i) => {
    r.id = 'rc' + i;
    /* hireTalents: the post's starred stat leads; the two where his roll sits highest in his background's range take the next */
    const gb = GB.byId(r.backgroundId), at = k => { const g = gb.stats[k]; return g[1] > g[0] ? (r.stats[k] - g[0]) / (g[1] - g[0]) : 0; };
    const rest = GB.STAT_KEYS.filter(k => k !== r.starredStat).sort((a, b) => at(b) - at(a) || GB.STAT_KEYS.indexOf(a) - GB.STAT_KEYS.indexOf(b));
    r.talents = [{ k: r.starredStat, n: r.starCount }].concat(rest.slice(0, 2).map((k, j) => ({ k, n: GB.starCountFor(place + ':' + r.id + ':' + k + '|star-count-' + (j + 2)) })));
    return r;
  });
}
function expectedGain(XP, stat, stars) { const t = XP.stat_gains_by_stars.value[KEYNAME[stat]][stars || 0]; const m = String(t).split('-').map(Number); return (m[0] + m[m.length - 1]) / 2; }
function level11(XP, r, kind) {
  const st = {}; r.talents.forEach(t => { st[t.k] = t.n; });
  const out = {}; STATS.forEach(k => { out[k] = r.stats[k] + (PLAN[kind].indexOf(k) >= 0 ? 10 * expectedGain(XP, k, st[k]) : 0); });
  return out;
}
function ceilingOf(L, w) { return STATS.reduce((t, k) => t + (w[k] || 0) * L[k], 0); }

async function main() {
  const argv = process.argv;
  if (argv[2] === '--cell') { process.stdout.write(JSON.stringify(await weightCell(argv[3], argv[4] === '-' ? null : argv[4], Number(argv[5])))); return; }
  if (argv.includes('--weights')) {
    const N = Number(arg('--n', 100)), JOBS = Number(arg('--jobs', 4)), out = arg('--json', null);
    const cells = [['melee', '-']].concat(['melee', 'gun'].reduce((a, kd) => a.concat(STATS.map(s => [kd, s])), []));
    const res = []; let next = 0, running = 0;
    await new Promise(done => { const pump = () => { while (running < JOBS && next < cells.length) { const c = cells[next++]; running++;
      cp.execFile(process.execPath, [__filename, '--cell', c[0], c[1], String(N), '--count', String(COUNT)], { maxBuffer: 1 << 24 }, (err, so) => { running--;
        if (err) console.error('cell failed', c, err.message.slice(0, 200)); else res.push(JSON.parse(so));
        if (next >= cells.length && running === 0) done(); else pump(); }); } }; pump(); });
    const base = res.filter(r => !r.stat)[0];
    console.log('THE BASE: six at level 5 in the town shelf against ' + COUNT + ' brigands, ' + N + ' fights: won ' + base.won + ', clean ' + base.clean + ', men down ' + base.down);
    const w = { melee: {}, gun: {} };
    ['melee', 'gun'].forEach(kd => { console.log('\n+' + BUMP + ' on every ' + kd + ' man:');
      res.filter(r => r.kind === kd && r.stat).sort((a, b) => (b.won - a.won) || (b.clean - a.clean)).forEach(r => { w[kd][r.stat] = (r.won - base.won) / BUMP;
        console.log('  ' + r.stat.padEnd(15) + ' won ' + String(r.won).padStart(3) + ' (' + (r.won - base.won >= 0 ? '+' : '') + (r.won - base.won) + ')  clean ' + String(r.clean).padStart(3) + ' (' + (r.clean - base.clean >= 0 ? '+' : '') + (r.clean - base.clean) + ')  down ' + r.down); }); });
    if (out) fs.writeFileSync(out, JSON.stringify({ draft: true, n: N, count: COUNT, bump: BUMP, base, cells: res, win_per_point: w }) + '\n');
    return;
  }
  if (argv.includes('--halls')) {
    const GB = require(path.join(ROOT, 'engine/bohemia_goodbros.js')), XP = J('records/target/bb/rules.json').experience;
    const PT = J('records/target/bb/price_table.json').wageAndHire, Wr = J('records/target/bb/weapons.json').rows, A = J('records/target/bb/armor.json'), HALL = J('records/target/BOHEMIA_HALL_PRICE.json');
    const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');
    const KIT = (() => { const m = html.match(/var KIT = (\{[^;]+\});/); return m ? Function('return ' + m[1])() : {}; })();
    const kitCrowns = bg => (KIT[bg] || []).reduce((v, id) => { if (!id) return v; const x = Wr.find(r => r.id === id); if (x) return v + (x.value || 0);
      for (const k of ['body', 'head', 'shields']) { const a = (A[k] || []).find(r => r.id === id); if (a) return v + (a.value || 0); } return v; }, 0);
    const price = r => { const g = GB.byId(r.backgroundId); const f = g.hireMax > g.hireMin ? Math.max(0, Math.min(1, (r.priceCrowns - g.hireMin) / (g.hireMax - g.hireMin))) : 0.5;
      const c = PT.hiringBaseRange.min + f * (PT.hiringBaseRange.maxApprox - PT.hiringBaseRange.min) + 500 * Math.pow(Math.max(0, (r.level || 1) - 1), 1.5) + PT.equipmentCostMultiplier * kitCrowns(r.backgroundId);
      return Math.max(1, Math.floor(c * HALL.easier / 10)); };
    const WF = arg('--weights-from', null), WJ = WF ? JSON.parse(fs.readFileSync(WF, 'utf8')) : null;
    /* the weights: measured (win per point, the plan's four only, negative read as none) or, without a file, one per point on the plan */
    const wOf = kd => { const o = {}; PLAN[kd].forEach(k => { o[k] = WJ ? Math.max(0, WJ.win_per_point[kd][k] || 0) : 1; }); return o; };
    const W = { melee: wOf('melee'), gun: wOf('gun') };
    const POSTS = Number(arg('--posts', 2000)), men = [];
    const halls = [];
    for (let p = 0; p < POSTS; p++) {
      const hall = hallMen(GB, 'Town' + (p % 40), Math.floor(p / 40), 7).map(r => {
        const Lm = level11(XP, r, 'melee'), Lg = level11(XP, r, 'gun'), cm = ceilingOf(Lm, W.melee), cg = ceilingOf(Lg, W.gun);
        const pr = price(r), stars = r.talents.reduce((t, x) => t + x.n, 0);
        return { bg: r.backgroundId, price: pr, stars, starsOnPlan: { melee: r.talents.filter(t => PLAN.melee.indexOf(t.k) >= 0).reduce((t, x) => t + x.n, 0), gun: r.talents.filter(t => PLAN.gun.indexOf(t.k) >= 0).reduce((t, x) => t + x.n, 0) },
          ceil: { melee: cm, gun: cg }, kind: cm / Math.max(1e-9, sumW(W.melee)) >= cg / Math.max(1e-9, sumW(W.gun)) ? 'melee' : 'gun', L: { melee: Lm, gun: Lg } };
      });
      halls.push(hall); men.push.apply(men, hall);
    }
    function sumW(w) { return Object.values(w).reduce((a, b) => a + b, 0); }
    /* one number per man: his best kind's ceiling, read on a 0-100 scale against all men rolled (the share of men he beats) */
    const all = men.map(m => Math.max(m.ceil.melee / sumW(W.melee), m.ceil.gun / sumW(W.gun))).sort((a, b) => a - b);
    const pctOf = v => { let lo = 0, hi = all.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (all[mid] < v) lo = mid + 1; else hi = mid; } return Math.round(100 * lo / all.length); };
    men.forEach(m => { m.best = Math.max(m.ceil.melee / sumW(W.melee), m.ceil.gun / sumW(W.gun)); m.score = pctOf(m.best); });
    const corr = (xs, ys) => { const mx = xs.reduce((a, b) => a + b, 0) / xs.length, my = ys.reduce((a, b) => a + b, 0) / ys.length;
      let sxy = 0, sx = 0, sy = 0; xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sx += (x - mx) ** 2; sy += (ys[i] - my) ** 2; }); return sxy / Math.sqrt(sx * sy); };
    console.log(men.length + ' men in ' + POSTS + ' halls of seven; weights ' + (WJ ? 'measured (' + WF + ')' : 'one a point on the plan') + ': ' + JSON.stringify(W));
    console.log('price against ceiling: correlation ' + corr(men.map(m => m.price), men.map(m => m.best)).toFixed(2) + '; stars against price ' + corr(men.map(m => m.stars), men.map(m => m.price)).toFixed(2) + '; stars on his plan against ceiling ' + corr(men.map(m => Math.max(m.starsOnPlan.melee, m.starsOnPlan.gun)), men.map(m => m.best)).toFixed(2));
    /* the star's widening: a 3-star melee skill over ten levels against none */
    console.log('the stars widen: ten levels on melee skill 0/1/2/3 stars ' + [0, 1, 2, 3].map(s => 10 * expectedGain(XP, 'melee_skill', s)).join(' / ') + '; ranged skill ' + [0, 1, 2, 3].map(s => 10 * expectedGain(XP, 'ranged_skill', s)).join(' / '));
    /* BARGAIN lines */
    const lines = {
      'above the hall median worth per battery (rule 216(f) as written)': h => { const wpb = h.map(m => m.score / m.price), med = wpb.slice().sort((a, b) => a - b)[Math.floor(wpb.length / 2)]; return h.map((m, i) => wpb[i] > med); },
      'worth per battery 1.5x the hall median': h => { const wpb = h.map(m => m.score / m.price), med = wpb.slice().sort((a, b) => a - b)[Math.floor(wpb.length / 2)]; return h.map((m, i) => wpb[i] >= 1.5 * med); },
      'the hall\'s best worth per battery AND a ceiling over the hall\'s median': h => { const wpb = h.map(m => m.score / m.price), top = Math.max.apply(null, wpb), mc = h.map(m => m.score).sort((a, b) => a - b)[Math.floor(h.length / 2)]; return h.map((m, i) => wpb[i] === top && m.score > mc); },
      'a ceiling in the top fifth of all men AND a price under the hall\'s median': h => { const mp = h.map(m => m.price).sort((a, b) => a - b)[Math.floor(h.length / 2)]; return h.map(m => m.score >= 80 && m.price < mp); }
    };
    Object.keys(lines).forEach(k => { let marked = 0, hallsWith = 0, scoreSum = 0;
      halls.forEach(h => { const f = lines[k](h); const c = f.filter(Boolean).length; marked += c; if (c) hallsWith++; h.forEach((m, i) => { if (f[i]) scoreSum += m.score; }); });
      console.log('  BARGAIN ' + k + ': ' + (marked / halls.length).toFixed(2) + ' men a hall, a hall has one ' + Math.round(100 * hallsWith / halls.length) + ' in 100, their ceiling ' + Math.round(scoreSum / Math.max(1, marked)) + ' of 100'); });
    /* the order: how often the hall's top by ceiling is also its top by stars (the order a player reads today) */
    let agree = 0; halls.forEach(h => { const byC = h.slice().sort((a, b) => b.best - a.best)[0], byS = h.slice().sort((a, b) => b.stars - a.stars || b.best - a.best)[0]; if (byC === byS) agree++; });
    console.log('the hall\'s top man by ceiling is also its top by stars ' + Math.round(100 * agree / halls.length) + ' in 100');
    const out = arg('--json', null);
    if (out) fs.writeFileSync(out, JSON.stringify({ draft: true, posts: POSTS, weights: W, plan: PLAN, sample: halls.slice(0, 5) }) + '\n');
  }
}
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
