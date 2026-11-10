#!/usr/bin/env node
// JOBS [jobs that fit] 11/8 -- WHAT A BEAST COSTS IN MEN (VAMILY rule 436(c), asks 102 and 114; COMBAT's rule 133 method).
// Battle Brothers sizes a contract as a budget and spends it on the enemy's own cost (the wiki's Game Guide: 'Each type of contract has
// a base value... multiplied by the other variables'; 'the maximum number and type of enemies is limited by the spawn list used'), so a
// pack of wolves for a contract is fewer wolves than a band of thugs. Ours counts a party in brigands and a tougher kind fields fewer
// (ours.enemy_tiers.count_scale, bohemia_enemies.json count_scale: COMBAT 10/24 for machines, kids and heavies, measured exactly this
// way: 'at 0.6 of it 22/30'). This tool measures, on the demo's own fight (the reader's engine, the shell's door, AUTO both sides),
// a company against N of a kind for N = 1..7, and prints for each kind the share of a brigand count at which the kind's worth matches
// the brigands' (the count_scale the kind earns).
// node tools/bohemia_jobs_beast_cost.js [--origins newcrew,wolf] [--kinds brigands,wolves,hyenas,dogs,coyotes] [--runs 24] [--days 5] [--hires 0] [--json out.json]
'use strict';
const fs = require('fs'), path = require('path');
const drive = require(path.join(__dirname, 'bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ORIGINS = arg('--origins', 'newcrew,wolf').split(','), KINDS = arg('--kinds', 'brigands,wolves,hyenas,dogs,coyotes').split(',');
const RUNS = +arg('--runs', 24), DAYS = +arg('--days', 5), HIRES = +arg('--hires', 0), OUT = arg('--json', null), MAXN = +arg('--max', 7);
(async () => {
  const all = [];
  for (const origin of ORIGINS) {
    const d = await drive.open({ profile: 'computer', fog: false, engage: false, keepCards: true,
      arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = '" + origin + "'; localStorage.setItem('bohemia.start', JSON.stringify(s)); } catch (e) {}" });
    const fr = d.fr;
    await fr.waitForFunction(() => window.BohemiaJobDanger && BohemiaJobDanger.ready() && window.LOOP && LOOP.start && LOOP.start.company, null, { timeout: 120000 });
    await fr.evaluate((k) => { const H = []; for (let i = 0; i < k; i++) H.push({ name: 'HIRE ' + (i + 1), background: ['daytaler', 'farmhand', 'militia', 'miller', 'poacher', 'vagabond'][i % 6], level: 1 });
      ['bohemia.company.v1', 'bohemia.company.line.v1'].forEach(x => localStorage.removeItem(x)); localStorage.setItem('bohemia.hired.v1', JSON.stringify(H)); DAY.day = 10; }, HIRES);
    for (const kind of KINDS) {
      const row = await fr.evaluate(([kind, runs, days, maxn]) => {
        const out = [];
        for (let n = 1; n <= maxn; n++) {
          /* the party exactly as the map hands one to the roll: the count, the kind, the dress day, the level */
          const r = BohemiaJobDanger.roll({ count: n, faction: kind, days: days, difficulty: 1 }, { key: 'jobs-cost:' + kind + ':' + n });
          if (!r) { out.push({ n, band: 0 }); continue; }
          const opts = BohemiaJobDanger.doorOpts({ count: r.band.length, band: r.band, faction: r.faction, days: days, difficulty: 1 }, null);
          const E = BohemiaJobDanger.fresh(); let sum = 0, won = 0;
          for (let k = 0; k < runs; k++) { E.seed((0x51ed27 + n * 7919 + k * 104729) >>> 0); E.F.setup(JSON.parse(JSON.stringify(opts)));
            let g = 0; while (!E.F.S.over && g <= 6000) { const v = E.F.current(); if (!v) break; E.F.aiStep(v); E.F.S.events = []; g++; }
            sum += E.F.S.over ? E.run(E.F) : 0; if (E.F.S.result === 'won') won++; }
          out.push({ n, band: r.band.length, kinds: r.band.slice(0, 3), worth: +(sum / runs).toFixed(3), won: +(won / runs).toFixed(3) });
        }
        return out;
      }, [kind, RUNS, DAYS, MAXN]);
      all.push({ origin, hires: HIRES, kind, row, men: await fr.evaluate(() => crewCount()) });
      console.log(origin + (HIRES ? '+' + HIRES : '') + ' ' + kind.padEnd(9) + row.map(c => c.n + ':' + c.band + ' ' + (c.worth != null ? c.worth.toFixed(2) : '-') + '/' + (c.won != null ? c.won.toFixed(2) : '-')).join('  '));
    }
    await d.close();
  }
  /* the count_scale each kind earns against the brigands, per company: the brigand count whose worth the kind's band matches */
  const interp = (row, w) => { for (let i = 1; i < row.length; i++) { const a = row[i - 1], b = row[i]; if (a.worth >= w && b.worth <= w) return a.band + (b.band - a.band) * (a.worth - w) / Math.max(1e-6, a.worth - b.worth); } return null; };
  const earn = [];
  ORIGINS.forEach(o => { const B = all.find(x => x.origin === o && x.kind === 'brigands'); if (!B) return;
    all.filter(x => x.origin === o && x.kind !== 'brigands').forEach(K => {
      const pts = K.row.filter(c => c.band > 0 && c.worth != null && c.worth < 0.97 && c.worth > 0.03).map(c => { const nb = interp(B.row, c.worth); return nb ? c.band / nb : null; }).filter(v => v != null);
      const v = pts.length ? pts.slice().sort((a, b) => a - b)[pts.length >> 1] : null;
      earn.push({ origin: o, kind: K.kind, scale: v != null ? +v.toFixed(2) : null, points: pts.map(p => +p.toFixed(2)) });
      console.log('  ' + o + ' ' + K.kind + ': a band of these matches the brigands at ' + (v != null ? v.toFixed(2) : '-') + ' of the count (points ' + pts.map(p => p.toFixed(2)).join(', ') + ')'); }); });
  if (OUT) fs.writeFileSync(OUT, JSON.stringify({ draft: true, tool: 'tools/bohemia_jobs_beast_cost.js', at: new Date().toISOString(), runs: RUNS, days: DAYS, cells: all, earn }, null, 1));
})();
