/* ==========================================================================
   A FEW, NOT TWELVE  (RUN, 10/5/26, VAMILY [a few, not twelve], rule 75b)

   PAOLO 10/5: "for demo purposes just one enemy attacking... 12 vs 12 is cool but that can't be the flow... a lot
   of math on the type of enemies, the difficulty, the equipment as you progress."
   MEASURED BEFORE: every fight dealt COMBAT's fixed nine brigands; the map's own crew list never reached the fight.
   NOW (__A_FEW_NOT_TWELVE__): records/target/bb/party_math.json sizes every party from Battle Brothers' inputs (roster
   strength, skulls, days to 100, distance from a town, the combat difficulty) and its count words; the party goes to
   the fight and COMBAT's enemy math dresses it by tier.

   LEGS, on the demo:
     P1 the file: every input carries its Battle Brothers source; every coefficient that is ours says so
     P2 a fresh crew's first one-skull job is A FEW; the Lone Wolf's is the floor; the Block Watch's is MANY
     P3 *** DAY ONE AND DAY ONE HUNDRED DIFFER *** on the road: a few early thugs against lots, late tier, in the fight
     P4 *** THE FIGHT DEALS THE PARTY, NOT ITS OWN NINE *** (the enemy count in the fight is the party's)
     P5 the combat difficulty raises the count (OUTLIVED IT over NEW HERE, the same day and road)
     P6 a job's fight carries the job's party
     P7 nothing threw
   node gates/a_few_not_twelve_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('A FEW, NOT TWELVE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const PM = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/party_math.json'), 'utf8'));

(async () => {
  const rows = Object.keys(PM).filter(k => k[0] !== '_');
  const unsourced = rows.filter(k => !PM[k].source || !(PM[k].ours || /wiki|bb_all|GROK|Game Mechanics/.test(PM[k].source)));
  const oursOk = ['job', 'roaming', 'difficulty_count_mult'].every(k => PM[k].ours === true && /ours/.test(PM[k].source));
  ok('P1 the file: every input sourced, every coefficient that is ours says so (' + rows.length + ' rows' + (unsourced.length ? '; unsourced: ' + unsourced.join(' ') : '') + ')',
    unsourced.length === 0 && oursOk && PM.roster_strength.value.per_man === 10 && PM.roster_strength.value.per_level === 2 && PM.count_words.value[0].word === 'A FEW');

  let d;
  try { d = await drive.open({ keepCards: true, beforeTap: async (p) => { await throughTheTitle(p); } }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  const fr = d.fr;
  try {
    await d.page.waitForTimeout(2500);
    for (let i = 0; i < 40; i++) { if (await fr.evaluate(() => PARTY_MATH.loaded === true)) break; await d.page.waitForTimeout(250); }
    /* P2: jobs, computed the way a taken job computes them, for three companies the door can build */
    const jobs = await d.page.evaluate(() => {
      const out = {}; const keep = Object.assign({}, BOH_START.state);
      ['newcrew', 'wolf', 'watch'].forEach(o => { BOH_START.state.origin = o; BOH_START.state.combat = 'seen'; out[o] = BOH_START.picks(); });
      Object.assign(BOH_START.state, keep); return out; });
    const job = await fr.evaluate((J) => { const keep = LOOP.start, r = {};
      for (const k in J) { LOOP.start = J[k]; r[k] = partyMath('job', { skulls: 1 }); }
      LOOP.start = keep; return r; }, jobs);
    ok('P2 a fresh crew\'s first one-skull job is A FEW, the Lone Wolf\'s the floor, the Block Watch\'s MANY (' + ['newcrew', 'wolf', 'watch'].map(k => k + ' ' + job[k].count + ' ' + job[k].word + ' from strength ' + job[k].strength).join('; ') + ')',
      job.newcrew.word === 'A FEW' && job.wolf.count === PM.job.value.min && job.watch.word === 'MANY');

    /* P3, P4, P5: road fights through the one door, counted on the fight's own board */
    const road = async (day, combat) => {
      await fr.evaluate(([day, combat]) => { DAY.day = day; if (LOOP.start) LOOP.start.combat = combat; }, [day, combat]);
      /* read at the moment of the fight, where he stands: the two steps onto the road change the distance from town */
      const want = await fr.evaluate(() => { try { stepOnce(0); stepOnce(4); } catch (_e) {} const w = partyMath('roaming', { x: city.x, y: city.y }); roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: Date.now() % 1000 }); return w; });
      let f = null; for (let i = 0; i < 150 && !f; i++) { const h = await d.page.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f = c; } if (!f) await d.page.waitForTimeout(200); }
      const them = f ? await f.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them').map(u => u.kind)) : null;
      if (f) await f.evaluate(() => { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); });
      for (let i = 0; i < 60; i++) { if (await d.page.evaluate(() => !CITYFIGHT)) break; await d.page.waitForTimeout(250); }
      try { await d.page.evaluate(() => { try { nfHome(); } catch (_e) {} }); } catch (_e) {}
      await d.page.waitForTimeout(1500);
      await fr.evaluate(() => { try { contactClear(); } catch (_e) {} });
      return { want, them };
    };
    const early = await road(1, 'seen'), late = await road(100, 'seen');
    const lateTier = late.them && late.them.some(k => /leader|marauder|marksman/.test(k)), earlyTier = early.them && early.them.every(k => /thug|lower_brigand/.test(k));
    ok('*** P3 DAY ONE AND DAY ONE HUNDRED DIFFER *** (day 1: ' + early.want.count + ' ' + early.want.word + ' -> ' + (early.them ? early.them.join(' ') : 'no fight') + '; day 100: ' + late.want.count + ' ' + late.want.word + ' -> ' + (late.them ? [...new Set(late.them)].join(' ') : 'no fight') + ')',
      early.want.word === 'A FEW' && late.want.count >= 11 && earlyTier && lateTier);
    ok('*** P4 THE FIGHT DEALS THE PARTY, NOT ITS OWN NINE *** (' + (early.them ? early.them.length : '?') + ' for ' + early.want.count + ', ' + (late.them ? late.them.length : '?') + ' for ' + late.want.count + ')',
      !!early.them && !!late.them && early.them.length === early.want.count && late.them.length === late.want.count);
    const easy = await fr.evaluate(() => { DAY.day = 60; LOOP.start.combat = 'new'; const a = partyMath('roaming', { x: city.x, y: city.y }); LOOP.start.combat = 'out'; const b = partyMath('roaming', { x: city.x, y: city.y }); LOOP.start.combat = 'seen'; return { a, b }; });
    ok('P5 the combat difficulty raises the count (day 60: NEW HERE ' + easy.a.count + ', OUTLIVED IT ' + easy.b.count + ')', easy.b.count > easy.a.count && easy.a.difficulty === 0 && easy.b.difficulty === 2);

    /* P6: a job, taken and reached, hands its own party over */
    await fr.evaluate(() => { DAY.day = 1; });
    const p6 = await (async () => {
      const wait = d.page.evaluate(() => new Promise(res => { const h = (ev) => { const m = ev.data; if (m && m.type === 'BOHEMIA_CITY_ENCOUNTER') { removeEventListener('message', h, true); res({ party: m.party || null, roster: (m.roster || []).length, why: m.why }); } };
        addEventListener('message', h, true); setTimeout(() => res(null), 15000); }));
      await fr.evaluate(() => { LOOP.held = []; loopTakeContract({ id: 'gate_job', title: 'the gate job', pay: 1, skulls: 1 }); const j = LOOP.held[0]; city.x = j.target.x; city.y = j.target.y; loopArrived(); });
      return wait; })();
    ok('P6 a job\'s fight carries the job\'s party (' + JSON.stringify(p6) + ')', !!p6 && /^contract:gate_job/.test(p6.why) && !!p6.party && p6.party.kind === 'job' && p6.party.count === p6.roster && p6.party.word === 'A FEW');
    ok('P7 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 120) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 200) + ']', false);
  }
  await d.close();
  done();
})();
