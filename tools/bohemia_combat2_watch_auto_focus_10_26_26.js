#!/usr/bin/env node
/* COMBAT TWO [AUTO kills one at a time] (rule 201), on the real surface (rule 179: done means he can see it): the fight page itself,
   in Chromium at the phone's profile (390 x 844 at 3x, touch) and the computer's (1440 x 900), AUTO on, five seeds each. For every
   round it reads what the page's own fight did: the named man (FIGHT.S.focus), our blows on him and off him with the reason the
   brain kept, the men of theirs who fell; and it photographs the board the moment a named man falls with three or more of our
   blows on him that round (the team met on one man and put him down), one picture a profile, into
   records/target/COMBAT2_AUTO_KILLS_ONE_AT_A_TIME_<profile>.jpg.
   Run: node tools/bohemia_combat2_watch_auto_focus_10_26_26.js [--seeds 5] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const argv = process.argv, SEEDS = Number(argv[argv.indexOf('--seeds') + 1]) || 5;
(async () => {
  const out = {};
  for (const profile of ['phone_portrait', 'computer']) {
    const P = out[profile] = { fights: [], blows: 0, onNamed: 0, rounds: 0, kills: 0, shot: null };
    for (let i = 0; i < SEEDS; i++) {
      const seed = 61 + i;
      const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: profile, arm: 'window.FIGHT_OPTS={seed:' + seed + ',speed:8,auto:true}' });
      await d.page.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.round, null, { timeout: 60000 });
      let seen = 0, last = -1, shotTaken = !!P.shot;
      const rounds = {};
      const t0 = Date.now();
      while (Date.now() - t0 < 150000) {
        const r = await d.page.evaluate((from) => {
          const S = FIGHT.S, L = S.log.slice(from), rows = [];
          L.forEach(e => {
            const a = FIGHT.byId(e.id);
            if (e.t === 'attack' && !e.free && !e.sweep && a && a.side === 'you') rows.push({ t: 'blow', r: e.round, to: e.to, named: a.pick && a.pick.to === e.to ? a.pick.focus : null, why: a.pick && a.pick.to === e.to ? a.pick.why : null, hit: e.hit });
            if (e.t === 'dead' && FIGHT.byId(e.id) && FIGHT.byId(e.id).side === 'them') rows.push({ t: 'dead', r: e.round, id: e.id, named: S.focus && S.focus.id === e.id });
          });
          return { n: S.log.length, rows: rows, over: S.over, result: S.result, round: S.round };
        }, seen);
        seen = r.n;
        for (const x of r.rows) {
          const R = rounds[x.r] || (rounds[x.r] = { blows: 0, onNamed: 0, off: {}, dead: 0 });
          if (x.t === 'blow') { R.blows++; if (x.named && x.named === x.to) { R.onNamed++; R.on = R.on || {}; R.on[x.to] = (R.on[x.to] || 0) + 1; } else if (x.named) R.off[x.why || 'no reason'] = (R.off[x.why || 'no reason'] || 0) + 1; continue; }
          R.dead++;
          if (!shotTaken && (R.on || {})[x.id] >= 1 + 1 + 1) {
            const file = path.join(ROOT, 'records/target/COMBAT2_AUTO_KILLS_ONE_AT_A_TIME_' + profile + '.jpg');
            await d.page.screenshot({ path: file, type: 'jpeg', quality: 80 });
            P.shot = { file: path.relative(ROOT, file), seed: seed, round: x.r };
            shotTaken = true;
          }
        }
        if (r.over || r.round !== last) last = r.round;
        if (r.over) { P.fights.push({ seed: seed, result: r.result, rounds: r.round }); break; }
        await d.page.waitForTimeout(250);
      }
      Object.values(rounds).forEach(R => { P.blows += R.blows; P.onNamed += R.onNamed; P.kills += R.dead; if (R.blows) P.rounds++; });
      P.fights[P.fights.length - 1] = Object.assign(P.fights[P.fights.length - 1] || { seed: seed, result: 'running' }, { rounds_struck: Object.keys(rounds).length, by_round: rounds });
      await d.close();
    }
    console.log(profile + ': ' + P.fights.map(f => 'seed ' + f.seed + ' ' + f.result).join(', ') + '; ' + P.onNamed + ' of ' + P.blows + ' blows on the named man over ' + P.rounds + ' rounds, ' + P.kills + ' of theirs dead' + (P.shot ? '; picture ' + P.shot.file + ' (seed ' + P.shot.seed + ', round ' + P.shot.round + ')' : ''));
  }
  fs.writeFileSync(path.join(ROOT, 'records/target/COMBAT2_AUTO_KILLS_ONE_AT_A_TIME_WATCH.json'), JSON.stringify(out, null, 1) + '\n');
})().catch(e => { console.error(e); process.exit(1); });
