/* ==========================================================================
   THE DANGER RAMPS TO DAY FIFTY  (WORLD [the danger ramps to day fifty], 10/26/26, rule 255(e))

   PAOLO 10/26: 'up to 50 days is when shit starts getting difficult, but I don't even want you to have jobs available like six
   wolves; I played as the Lone Wolf, you have to understand how dangerous some of this is.'

   THE DEMO ON HIS PHONE (JOB_PROFILE=computer for his computer): three origins as they start (THE LONE WOLF alone, A NEW CREW of
   three, THE RAIDERS' four), each on days 1, 10, 25, 50 and 80 (and the Lone Wolf on day 20): every board in the valley dealt by
   the shelf's own pick (the one the town's board and the phone both make), the dealing run until every job it posts is read
   (slices/bohemia_job_danger.js: the job's number on AUTO's count for that crew, rule 254), then counted. The floor and the reds'
   share are TUNING's curve (job_danger.json ramp_*: 0.5 through day 10, a straight line to nothing at day 50).
     D1  through day 10, every origin: no job posted worth under the floor (0.5), at most one red job (under the AUTO turn) on a
         board, and in the whole valley at most one job at the deepest blood
     D2  day 25: no job under the day's floor (0.31), no board past the day's share of red
     D3  by day 50 the full range is posted: the deepest blood and jobs worth under a quarter stand on the Lone Wolf's boards
     D4  THE LONE WOLF'S FIRST 20 DAYS: no job his runs lose outright (worth under 0.25) and no pack of six beasts, on any board
     D5  THROUGH THE REAL DOOR: the town's board he walks into on day one as the Lone Wolf shows only jobs the day lets it post
     D6  nothing threw
   node gates/the_danger_ramps_to_day_fifty_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const PROFILE = process.env.JOB_PROFILE || 'phone_portrait';
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE DANGER RAMPS TO DAY FIFTY: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const O = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/origins.json'), 'utf8')).origins;
const man = (m, i) => ({ name: m.name || ['YOU', 'DESI', 'RAUL', 'TINA', 'OSCAR', 'LUPE'][i], background: m.background, level: m.level || 1, main: i === 0 });
const crew = id => O.filter(o => o.id === id)[0].men.map(man);
const ORIGINS = [{ id: 'wolf', men: crew('wolf'), days: [1, 10, 20, 25, 50, 80] }, { id: 'newcrew', men: crew('newcrew'), days: [1, 10, 25, 50, 80] }, { id: 'raid', men: crew('raid'), days: [1, 10, 25, 50, 80] }];

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, profile: PROFILE, engage: false }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(400); } return false; };
  const seen = {};
  try {
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 40000 }).catch(() => {});
    const eng = await waitFor(() => fr.evaluate(() => !!(window.BohemiaJobDanger && BohemiaJobDanger.ready() && BohemiaJobDanger.fits)), 60000);
    if (!eng) { ok('the reader and its ramp load in the map', false); await d.close(); return done(); }
    const CFG = await fr.evaluate(() => JSON.parse(JSON.stringify(BohemiaJobDanger.cfg())));
    /* a checker's own crews and days (gates switch settings on for themselves only, rule 192(c)) */
    const setCrew = (men, day) => fr.evaluate(([men, day]) => {
      localStorage.setItem('bohemia.company.v1', JSON.stringify(men)); localStorage.removeItem('bohemia.company.line.v1');
      ['bohemia.hired.v1', 'bohemia.walked.v1', 'bohemia.taken.v1', 'bohemia.fight.after.v1'].forEach(k => localStorage.setItem(k, '[]'));
      localStorage.setItem('bohemia.fight.met.v1', '3');
      try { LOOP.start = Object.assign({}, LOOP.start || {}, { company: men.map(m => ({ background: m.background, level: m.level })) }); } catch (e) {}
      try { DAY.day = day; } catch (e) {}
    }, [men, day]);
    /* the valley's boards as the shelf deals them, with each posted job's read */
    const deal = (day) => fr.evaluate((day) => {
      const P = BohemiaBoardShelf.mapPlaces(day) || [], out = {}; let unread = 0, posted = 0;
      P.forEach(p => { const L = BohemiaBoardShelf.pick({ name: p.name, tier: p.tier }, day, { traits: p.traits || [], held: [], places: P }) || [];
        out[p.name] = L.map(o => { posted++; const R = BohemiaJobDanger.peek(o, p.name); if (!R || (R.state !== 'read' && R.state !== 'broke')) unread++;
          return { id: o.id, state: R ? R.state : null, clean: R && R.clean, stars: R && R.stars, blood: R && R.blood,
            beasts: R && R.fights ? Math.max(0, ...R.fights.filter(f => f.faction === 'beasts').map(f => f.band.length)) : 0 }; }); });
      return { unread, posted, boards: out, places: P.length };
    }, day);
    for (const C of ORIGINS) for (const day of C.days) {
      const t0 = Date.now(); await setCrew(C.men, day);
      let st = null, rounds = 0;
      for (; rounds < 60; rounds++) {
        st = await deal(day); if (!st.unread) break;
        await waitFor(() => fr.evaluate(() => { const s = BohemiaJobDanger.state(); return !s.busy && !s.queue; }), 240000);
        await page.waitForTimeout(300);
      }
      const all = [].concat(...Object.values(st.boards)), reds = Object.values(st.boards).map(L => L.filter(j => j.state === 'read' && j.clean < CFG.cut_one).length);
      seen[C.id + ':' + day] = { day, st, all, reds, rounds };
      console.log('  ...' + C.id + ' day ' + day + ' (' + Math.round((Date.now() - t0) / 1000) + ' s, ' + rounds + ' deals): ' + st.places + ' boards, ' + st.posted + ' jobs posted, ' + st.unread + ' unread; ' +
        [1, 2, 3].map(s => all.filter(j => j.stars === s).length + ' at ' + s).join(', ') + '; worst ' + Math.min(...all.filter(j => j.clean != null).map(j => j.clean)).toFixed(2) + '; empty boards ' + Object.values(st.boards).filter(L => !L.length).length);
    }
    const floorOf = day => day <= CFG.ramp_calm_until ? CFG.ramp_floor : day >= CFG.ramp_full_at ? 0 : CFG.ramp_floor * (CFG.ramp_full_at - day) / (CFG.ramp_full_at - CFG.ramp_calm_until);
    const redsOf = (day, n) => day <= CFG.ramp_calm_until ? Math.min(n, CFG.ramp_reds_calm) : day >= CFG.ramp_full_at ? n : Math.max(CFG.ramp_reds_calm, Math.min(n, Math.round(n * (day - CFG.ramp_calm_until) / (CFG.ramp_full_at - CFG.ramp_calm_until))));
    const under = S => S.all.filter(j => j.state === 'read' && j.clean < floorOf(S.day) - 1e-9);
    const tooRed = S => Object.values(S.st.boards).filter(L => L.filter(j => j.state === 'read' && j.clean < CFG.cut_one).length > redsOf(S.day, Math.max(L.length, 1)));
    const deep = S => S.all.filter(j => j.state === 'read' && j.clean <= CFG.cut_three);
    const say = k => { const S = seen[k]; return k + ': ' + under(S).length + ' under ' + floorOf(S.day).toFixed(2) + ', ' + tooRed(S).length + ' boards too red, ' + deep(S).length + ' deepest, unread ' + S.st.unread; };
    const early = Object.keys(seen).filter(k => seen[k].day <= 10);
    ok('D1 through day 10: nothing under 0.5, at most one red job a board, at most one deepest in the valley', early.length === 6 && early.every(k => { const S = seen[k]; return !S.st.unread && !under(S).length && !tooRed(S).length && deep(S).length <= 1; }), early.map(say).join(' | '));
    const mid = Object.keys(seen).filter(k => seen[k].day === 25);
    ok('D2 day 25: nothing under the day\'s floor (' + floorOf(25).toFixed(2) + '), no board past the day\'s share of red', mid.length === 3 && mid.every(k => { const S = seen[k]; return !S.st.unread && !under(S).length && !tooRed(S).length; }), mid.map(say).join(' | '));
    const w50 = seen['wolf:50'], w80 = seen['wolf:80'];
    const full = S => S && deep(S).length > 0 && S.all.some(j => j.state === 'read' && j.clean < 0.25);
    ok('D3 by day 50 the full range is posted: the deepest blood and jobs under a quarter on the Lone Wolf\'s boards', full(w50) && full(w80),
      ['wolf:50', 'wolf:80'].map(k => k + ': ' + deep(seen[k]).length + ' deepest, ' + seen[k].all.filter(j => j.state === 'read' && j.clean < 0.25).length + ' under a quarter, ' + seen[k].all.filter(j => j.beasts >= 6).length + ' packs of six').join(' | '));
    const wolfEarly = ['wolf:1', 'wolf:10', 'wolf:20'].map(k => seen[k]);
    const lose = wolfEarly.map(S => S.all.filter(j => (j.state === 'read' && j.clean < 0.25) || j.beasts >= 6));
    ok('D4 the Lone Wolf\'s first 20 days: no job his runs lose outright, no pack of six beasts', lose.every(L => !L.length) && wolfEarly.every(S => !S.st.unread),
      wolfEarly.map((S, i) => 'day ' + S.day + ': ' + S.st.posted + ' posted, worst ' + Math.min(...S.all.filter(j => j.clean != null).map(j => j.clean)).toFixed(2) + ', most beasts ' + Math.max(0, ...S.all.map(j => j.beasts)) + (lose[i].length ? ' BAD ' + lose[i].slice(0, 3).map(j => j.id + ' ' + (j.clean != null ? j.clean.toFixed(2) : '-') + ' beasts ' + j.beasts).join(', ') : '')).join(' | '));

    /* D5: the real door, the Lone Wolf on day one */
    await setCrew(ORIGINS[0].men, 1);
    for (let r = 0; r < 40; r++) { const st = await deal(1); if (!st.unread) break; await waitFor(() => fr.evaluate(() => { const s = BohemiaJobDanger.state(); return !s.busy && !s.queue; }), 120000); }
    const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready));
    const t = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null; for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (!best || dd < best.d) best = { n, x: b.x, y: b.y, d: dd }; } return best; });
    for (let k = 0; k < 4 && !(await settleOpen()); k++) { await fr.evaluate((t) => { travelStop(); townTap({ name: t.n, x: t.x, y: t.y }); }, t); await waitFor(settleOpen, 60000);
      if (await fr.evaluate(() => !!MEET.up)) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); }); }
    let rows = null;
    if (await settleOpen()) {
      const sf = await (await fr.$('#settleFrame')).contentFrame();
      const TOUCH = PROFILE !== 'computer';
      for (let k = 0; k < 4; k++) {
        const xy = await sf.evaluate(() => BohemiaSettlement.where('board')); const hb = await (await fr.$('#settleFrame')).boundingBox();
        if (xy) { if (TOUCH) await page.touchscreen.tap(hb.x + xy.x, hb.y + xy.y); else await page.mouse.click(hb.x + xy.x, hb.y + xy.y); }
        if (await waitFor(() => sf.evaluate(() => document.getElementById('sheet').classList.contains('on') && document.querySelectorAll('#sheet button.act.client').length > 0), 6000)) break;
      }
      const ids = await sf.evaluate(() => [...document.querySelectorAll('#sheet button.act.client')].map(b => b.dataset.id));
      rows = await fr.evaluate(([ids, place]) => { const all = BohemiaBoardShelf.shelf().offers; return ids.map(id => { const o = all.filter(x => x.id === id)[0]; const R = o && BohemiaJobDanger.peek(o, place);
        return { id, state: R ? R.state : null, clean: R && R.clean, stars: R && R.stars }; }); }, [ids, t.n]);
      await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
    }
    ok('D5 through the real door: the town\'s board the Lone Wolf walks into on day one shows only what day one lets it post', !!rows && rows.length > 0 && rows.every(r => r.state === 'read' && r.clean >= CFG.ramp_floor) && rows.filter(r => r.clean < CFG.cut_one).length <= CFG.ramp_reds_calm,
      t && t.n + ': ' + JSON.stringify(rows));
    ok('D6 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  } catch (e) { ok('the gate ran [' + String(e && e.stack || e).slice(0, 300) + ']', false); }
  await d.close();
  done();
})();
