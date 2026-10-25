/* ==========================================================================
   MOST JOBS FIT THE COMPANY  (WORLD [most jobs fit the company], 10/25/26, rule 192)

   PAOLO 10/25: 'I don't know why the game is so in love with throwing overpowered enemies in like 75% of the quests that I take...
   look how Battle Brothers does it.'
   The live fight (tools/bohemia_world_most_jobs_fit.js on TUNING's engine: slices/BOHEMIA_FIGHT.html's own rules, AUTO both
   sides, seeded) plays each star of job against his company at day 1, 20, 50 and 90:
     M1  THE STARS TELL THE TRUTH (192(b)): at every point one star is won 85 in 100 or more, two stars 60 or more, three stars is a
         real risk (30 to 90): never a slaughter, never a walk
     M2  MOST JOBS FIT (192(a)): of the jobs a town's board offers (the shelf's skulls), at most 15 in 100 are lost more often than won,
         at every point
     M3  THE GATE BITES: the math before rule 192 (one enemy a man, dressed for the calendar) fails M1 (measured: a one-star job at
         day 20 won 33 in 100)
     M4  THE GAME USES IT (the demo, his computer): partyMath('job') is the file's Battle Brothers multiplier on the skulls' base,
         a job's party is dressed for his company's strength (day 40 on the calendar, a new crew's job dressed for day 1; a roaming
         party for day 40), and the stars are the skulls (loopJobStars)
     M5  nothing threw
   node gates/most_jobs_fit_the_company_gate.js            MOST_JOBS_N=<fights a cell> (20)
   ========================================================================== */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const N = +(process.env.MOST_JOBS_N || 20);
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nMOST JOBS FIT THE COMPANY: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const TMP = require('os').tmpdir();

function measure(args, tag) {
  const out = path.join(TMP, 'most_jobs_' + tag + '_' + process.pid + '.json');
  cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_world_most_jobs_fit.js'), '--n', String(N), '--json', out].concat(args), { stdio: ['ignore', 'ignore', 'inherit'], timeout: 1200000 });
  const r = JSON.parse(fs.readFileSync(out, 'utf8')); try { fs.unlinkSync(out); } catch (_e) {}
  return r;
}
const floorOk = rows => rows.every(r => r.skulls === 1 ? r.won_in_100 >= 85 : r.skulls === 2 ? r.won_in_100 >= 60 : r.won_in_100 >= 30 && r.won_in_100 <= 90);
const line = rows => [1, 20, 50, 90].map(d => 'day ' + d + ': ' + rows.filter(r => r.day === d).map(r => r.skulls + '★ ' + r.enemies + ' men won ' + r.won_in_100).join(', ')).join(' | ');

(async () => {
  try {
    const now = measure([], 'now');
    ok('M1 the stars tell the truth: 1★ won 85+, 2★ 60+, 3★ 30 to 90, at day 1, 20, 50 and 90 (' + now.n + ' fights a cell)', now.math === 'bb' && floorOk(now.rows), line(now.rows));
    const over = [1, 20, 50, 90].map(d => ({ d, v: now.rows.filter(r => r.day === d && r.won_in_100 < 50).reduce((t, r) => t + r.board_share, 0) }));
    ok('M2 most jobs on a board fit him: at most 15 in 100 lost more often than won', over.every(o => o.v <= 15), over.map(o => 'day ' + o.d + ' ' + o.v + ' in 100').join(', '));
    const before = measure(['--math', 'old', '--dress', 'calendar'], 'before');
    ok('M3 the gate bites: the math before rule 192 fails M1', !floorOk(before.rows), line(before.rows));
  } catch (e) { ok('the measurement ran', false, String(e.message).slice(0, 200)); }

  /* M4: the game itself */
  let d = null;
  try {
    const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    d = await drive.open({ profile: 'computer' });
    const fr = d.fr, errs = [];
    d.page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
    await d.page.waitForTimeout(3000);
    await fr.waitForFunction(() => typeof PARTY_MATH !== 'undefined' && PARTY_MATH.loaded, null, { timeout: 20000 }).catch(() => {});
    const g = await fr.evaluate(() => {
      const B = partyV('job_bb'), str = partyRosterStrength(), m = Math.max(B.mult_min, Math.min(B.mult_max, B.k * Math.pow(str / 100, B.exp)));
      const was = DAY.day; DAY.day = 40;
      const jobs = [1, 2, 3].map(sk => { const p = partyMath('job', { skulls: sk }); return { sk, n: p.count, want: Math.max(partyV('job').min, Math.min(partyV('job').max, Math.floor(B.base_men[String(sk)] * m * ((partyV('difficulty_count_mult') || [])[partyDifficulty()] || 1) + 0.5))), days: p.days, stars: loopJobStars({ skulls: sk }) }; });
      const roam = partyMath('roaming', { x: city.x, y: city.y });
      DAY.day = was;
      return { loaded: PARTY_MATH.loaded, str, jobs, roamDays: roam.days, dress: partyDressDay(str, B.dress) };
    });
    ok('M4 the game uses it: the job count is the multiplier on the skulls\' base, dressed for his strength, the stars the skulls',
      g.loaded && g.jobs.every(j => j.n === j.want && j.days === g.dress && j.stars === j.sk) && g.roamDays === 40 && g.dress < 40,
      'strength ' + g.str + ' (a new crew): ' + g.jobs.map(j => j.sk + '★ ' + j.n + ' men dressed for day ' + j.days).join(', ') + '; on day 40 a roaming party is dressed for day ' + g.roamDays);
    ok('M5 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  } catch (e) { ok('the game ran', false, String(e.message).slice(0, 160)); }
  if (d) await d.close();
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
