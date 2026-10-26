#!/usr/bin/env node
// TUNING [healing on our clock] 10/26 -- RESEARCH INSTRUMENT, NOT A GATE (rule 264, rule 38g). Paolo 10/26: 'the timing that's natural
// in Battle Brothers is not the same as in Bohemia... one day of action felt like three or four days in Battle Brothers, the quests are
// so close to the settlements... some things have to be a lot quicker for us'
// (records/BOHEMIA_PAOLO_YOUR_MAIN_GUY_LEADS_YOU_MAKE_HIM_FIRST_AND_HEALING_ON_OUR_CLOCK_10_26_26.md).
// OUR GAP BETWEEN FIGHTS, ON OUR REAL TRIPS: the live demo (tools/bohemia_drive_the_demo.js), every job the valley knows (the 44 in
// records/target/BOHEMIA_JOB_KINDS.json and the town board's four), offered at every home base, costed by the game's own trip
// (BohemiaJobKinds.trip: the map's road, the map's clock, the carts' pace, the way back when he is paid at home, rule 222) and the
// fights it brings (BohemiaJobKinds.fightsOf on the same dry-run job, each fight weighted by its chance). The gap is the trip's game
// hours over its fights. The party is set at the town only for the dry run (trip() asks where he stands) and put back.
//   node tools/bohemia_tuning_healing_on_our_clock.js [--out file]
// Every number it prints is DRAFT; the bank (draft:true, nothing in the game reads it) is written by the caller.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };

(async () => {
  const d = await drive.open({ keepCards: true, profile: 'computer' });
  try {
    const fr = d.fr || d.page.frames().find(f => /CITY_WORLD/.test(f.url())) || d.page.mainFrame();
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && typeof ctBases === 'function', null, { timeout: 60000 });
    const res = await fr.evaluate(() => {
      const JK = window.BohemiaJobKinds, D = JK.data(), bases = ctBases() || {};
      const offers = Object.keys(D.offers || {}).map(id => ({ id, title: id, pay: 30, skulls: 1 }));
      [['ct-escort-water', 'Walk the water cart to the pump', 1], ['ct-road-crew', 'Run the road crew off the corner', 2],
       ['ct-find-the-kid', 'Find the Ortiz kid', 2], ['ct-dogs', 'Clear the dog lot', 3]].forEach(o => offers.push({ id: o[0], title: o[1], pay: 30 * o[2], skulls: o[2] }));
      const ox = city.x, oy = city.y, out = [];
      let step = null; try { step = { here: cityStepMins(city.x, city.y), pace: JK.pace() }; } catch (e) {}
      Object.keys(bases).forEach(name => {
        const b = bases[name];
        city.x = b.x; city.y = b.y;
        offers.forEach(c => {
          let T = null, job = null, fights = null;
          try { T = JK.trip(c, name); } catch (e) { T = { err: String(e) }; }
          try { job = JK.plan(c, { name, x: b.x, y: b.y }); } catch (e) {}
          try { const f = job ? JK.fightsOf(job, { offer: true }) : null; fights = f ? f.reduce((a, x) => a + (x.p || 0), 0) : null; } catch (e) {}
          const J = T && T.job;
          out.push({ town: name, id: c.id, kind: JK.kindOf(c), exact: !!(J && J.exact), mins: J ? (J.mins != null ? J.mins : null) : null,
            back: J ? !!J.back : null, backMins: J && J.backMins != null ? J.backMins : 0, total: J ? (J.total != null ? J.total : (J.totalHi != null ? J.totalHi : null)) : null,
            lo: J && J.totalLo != null ? J.totalLo : null, blocks: J ? J.blocks : null, fights, err: T && T.err });
        });
      });
      city.x = ox; city.y = oy;
      return { towns: Object.keys(bases).length, offers: offers.length, step, rows: out };
    });
    const s = JSON.stringify(res);
    const o = arg('--out', null); if (o) fs.writeFileSync(o, s); else console.log(s.slice(0, 3000));
    console.log('towns', res.towns, 'offers', res.offers, 'rows', res.rows.length, 'step', JSON.stringify(res.step));
  } finally { await d.close(); }
})().catch(e => { console.error(e); process.exit(1); });
