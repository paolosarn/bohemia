/* ==========================================================================
   THE ROSTER SCALES THE ENEMY, AND THE GAME SAYS SO  (WORLD [the roster scales the enemy], 10/25/26, rule 179)

   PAOLO 10/24 on his PC (rule 164 item 26): 'Battle Brothers matches you with opponents by the amount of people on your
   roster... if I fill up my roster, the opponents go up too.'
   The math shipped (fce1fc7a, gates/the_jobs_part_gate.js R: 3 men to 12, a two-skull job 3 to 10) and EYES could not see it in
   the game (records/BOHEMIA_EYES_EVERY_ASK_CHECKED_ON_THE_LIVE_DEMO_10_25_26.md, line 79: 'a full roster, not met'): nothing said
   the enemy came heavier BECAUSE his company is big. This checker plays it the way he would and reads what he would read.

   ON HIS COMPUTER (he played on his PC; ROSTER_PROFILE=phone_portrait for the phone), the meet card answered by a hand, not the
   driver's auto-ENGAGE:
     S1  with the origin's three men, a crew job's take line and its meet card say nothing about the roster (it changed nothing)
     S2  nine men hired at the hall by a finger on HIRE (the batteries put in the purse by the gate, said)
     S3  a crew job taken: the line says how many and why ('They will be about 10, sized to your 12 men. With 3 you would meet 3.')
     S4  walking into it, the meet card stands and says it on the card ('SIZED TO YOUR 12 MEN. WITH 3 YOU WOULD MEET 3.'),
         its count is the job's, and the 3-man number is the map's own math for three recruits
     S5  ENGAGE by a hand: the fight has that many of them
     S6  nothing threw
   node gates/the_roster_scales_the_enemy_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const SHOTS = process.env.ROSTER_SHOTS || null;
const PROFILE = process.env.ROSTER_PROFILE || 'computer';

let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE ROSTER SCALES THE ENEMY: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, profile: PROFILE }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  const TOUCH = PROFILE !== 'computer';
  const tapAt = async (x, y) => { if (TOUCH) return d.tapAt(x, y); const h = await page.$('#cityFrame'), fb = h ? await h.boundingBox() : null; if (!fb) return null; return page.mouse.click(fb.x + x, fb.y + y); };
  const shot = async (n) => { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, PROFILE + '_' + n + '.png') }); };
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  const shell = () => page.evaluate(() => ({ fight: !!CITYFIGHT }));
  const meetUp = () => fr.evaluate(() => !!(window.MEET && MEET.up));
  const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready));
  const settleFrame = async () => { const fh = await fr.$('#settleFrame'); return fh ? fh.contentFrame() : null; };
  const leave = async () => { await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(500); };
  /* the meet card answered by a hand: ENGAGE or FALL BACK, a click (or a touch) on its own button */
  const meetPress = async (which) => {
    const b = await fr.evaluate((w) => { const e = document.querySelector('#meetcard [data-meet="' + w + '"]'); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, which);
    if (b) await tapAt(b[0], b[1]); else await fr.evaluate((w) => { try { MEET_DONE(w === 'go'); } catch (e) {} }, which);
    await page.waitForTimeout(400);
  };
  const goCell = async (x, y) => {
    const p = await fr.evaluate(([x, y]) => { const r = document.getElementById('cv').getBoundingClientRect(); const q = __CITY.isoAt(x, y);
      return { x: r.left + q.sx, y: r.top + q.sy + TH / 2, on: mapOnGlass(x, y) }; }, [x, y]);
    if (p.on) { await tapAt(p.x, p.y); await page.waitForTimeout(150);
      const set = await fr.evaluate(([x, y]) => (TRAVEL && TRAVEL.to && Math.max(Math.abs(TRAVEL.to[0] - x), Math.abs(TRAVEL.to[1] - y)) <= 2) || Math.max(Math.abs(city.x - x), Math.abs(city.y - y)) <= 1 || !!LOOP.fighting || (window.MEET && !!MEET.up), [x, y]);
      if (set) return 'touch'; }
    await fr.evaluate(([x, y]) => { travelStop(); travelTo(0, 0, [x, y]); }, [x, y]); return 'travelTo';
  };
  const fightFrame = async () => { for (let i = 0; i < 120; i++) { const h = await page.$('#fightFrame');
      if (h) { const f = await h.contentFrame(); if (f && await f.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S.board).catch(() => false)) return f; }
      await page.waitForTimeout(200); } return null; };
  const spoilsLeave = async () => {
    await waitFor(() => page.evaluate(() => !!(window.SPOILS && SPOILS.frame) || !CITYFIGHT), 15000);
    await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
  };
  /* a roaming party met on the road (not the fight measured): engaged by a hand and ended by the gate as a cleared fight, said */
  const roadFight = async () => { await meetPress('go'); const f = await fightFrame(); if (!f) return;
    await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); });
    await spoilsLeave(); await waitFor(async () => !(await shell()).fight, 20000); await page.waitForTimeout(1500);
    await fr.evaluate(() => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); }); };
  const toTown = async () => {
    const t = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null;
      for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd >= 2 && (!best || dd < best.d)) best = { n, x: b.x, y: b.y, d: dd }; }
      if (!best) return null; return Object.assign(best, { g: townDoor(best.x, best.y) }); });
    if (!t) return null;
    for (let k = 0; k < 4 && !(await settleOpen()); k++) {
      if (await meetUp()) { await roadFight(); continue; }
      await goCell(t.g[0], t.g[1]);
      await waitFor(async () => await settleOpen() || await meetUp(), 90000);
    }
    await page.waitForTimeout(1200);
    return (await settleOpen()) ? t : null;
  };
  /* the board's own 'Take it' message from the settlement's own window, the way the jobs' checkers take a job */
  const take = async (id) => {
    if (!(await settleOpen())) return null;
    const sf = await settleFrame(); if (!sf) return null;
    await sf.waitForFunction(() => window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 15000 }).catch(() => {});
    const t = await sf.evaluate((id) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0] || BohemiaBoardShelf.shelf().offers.filter(x => !/qd-a[r]/.test(x.id))[0]; if (!o) return null;
      const c = Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) }), S = BohemiaSettlement.state; S.held.push(o.id);
      window.parent.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'contract', place: S.place.name, batteries: null, contract: c }, '*'); return { id: o.id, title: o.title }; }, id);
    await page.waitForTimeout(800);
    return t;
  };
  const said = () => fr.evaluate(() => (LOOP.said || []).slice());
  /* walk to a held job's crew until the meet card for THAT job stands (a roaming party met first is answered and ended) */
  const meetTheJob = async (id) => {
    for (let leg = 0; leg < 5; leg++) {
      const j = await fr.evaluate((id) => { const h = LOOP.held.filter(x => x.id === id)[0]; return h ? { x: h.target.x, y: h.target.y } : null; }, id);
      if (!j) return null;
      await goCell(j.x, j.y);
      await waitFor(() => meetUp(), 90000);
      const why = await fr.evaluate(() => (window.__MEET_UP && window.__MEET_UP.why) || '');
      if (new RegExp('^contract:' + id).test(why)) return fr.evaluate(() => { const c = document.getElementById('meetcard'); const t = c ? c.querySelector('.mcwhy') : null, s = c ? c.querySelector('.mcs') : null;
        return { up: JSON.parse(JSON.stringify(window.__MEET_UP)), why: t ? t.textContent : null, whyShown: !!(t && t.getBoundingClientRect().height > 0), count: s ? s.textContent : null }; });
      if (await meetUp()) await roadFight();
    }
    return null;
  };

  try {
    await page.waitForTimeout(2500);
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready(), null, { timeout: 20000 }).catch(() => {});
    /* past the first game day, so the day-one cap (no party bigger than the company plus one, RUN 10/23) is not what is measured */
    await fr.evaluate(() => { try { if (typeof DAY !== 'undefined' && DAY.day < 2) DAY.day = 2; } catch (e) {} });

    /* ---------------- S1: three men, nothing to say ---------------- */
    const t0 = await toTown();
    const j0 = t0 ? await take('qd-s10') : null;
    await leave();
    const said0 = (await said()).filter(l => /sized to your/i.test(l));
    const m0 = j0 ? await meetTheJob(j0.id) : null;
    await shot('s1_three_men_card');
    ok('S1 with the origin\'s three men the job and the card say nothing about the roster', !!m0 && said0.length === 0 && !m0.why,
      j0 ? '"' + j0.title + '": card "' + (m0 && m0.count) + '"' + (m0 && m0.why ? ' + "' + m0.why + '"' : ', no roster line') + (said0.length ? '; said: ' + said0[0] : '') : 'no job taken');
    if (m0) await meetPress('back');
    await fr.evaluate(() => { LOOP.held = []; LOOP.fighting = null; try { saveNow('gate'); } catch (e) {} render(); });

    /* ---------------- S2: nine men hired by a finger ---------------- */
    await fr.evaluate(() => { BohemiaPurse.credit(purseGet(), 'electricity', 3000, 'the gate: batteries to hire with', 'gate:hire', loopDay()); });
    if (!(await settleOpen())) await toTown();
    const sf = await settleFrame();
    let hired = 0;
    if (sf) {
      const hb = await (await fr.$('#settleFrame')).boundingBox();
      const click = async (x, y) => TOUCH ? page.touchscreen.tap(hb.x + x, hb.y + y) : page.mouse.click(hb.x + x, hb.y + y);
      const openHall = async () => {
        if (await sf.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { const c = await sf.evaluate(() => { const r = document.getElementById('close').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }); await click(c[0], c[1]); await page.waitForTimeout(300); }
        const xy = await sf.evaluate(() => BohemiaSettlement.where('hall'));
        if (xy) await click(xy.x, xy.y);
        await waitFor(() => sf.evaluate(() => document.getElementById('sheet').classList.contains('on') && [...document.querySelectorAll('#sheet button.act')].some(x => /^Hire/.test(x.textContent))), 6000);
      };
      for (let k = 0; k < 14 && hired < 9; k++) {
        await openHall();
        const b = await sf.evaluate(() => { const e = [...document.querySelectorAll('#sheet button.act')].filter(x => /^Hire/.test(x.textContent) && !x.disabled)[0];
          if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
        if (!b) { const more = await sf.evaluate(() => { try { const S = BohemiaSettlement.state; S.mapDay = (S.mapDay | 0) + 7; return true; } catch (e) { return false; } }); if (!more) break; continue; }   /* the post's next week of men */
        const n0 = await fr.evaluate(() => { try { return JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]').length; } catch (e) { return 0; } });
        await click(b[0], b[1]); await page.waitForTimeout(500);
        const n1 = await fr.evaluate(() => { try { return JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]').length; } catch (e) { return 0; } });
        if (n1 > n0) hired++;
      }
    }
    const men = await fr.evaluate(() => BohemiaJobKinds.roster().men.length);
    ok('S2 nine men hired at the hall by a finger on HIRE', hired >= 9 && men >= 12, hired + ' hired, ' + men + ' men on the roster');

    /* ---------------- S3: the job says how many and why ---------------- */
    const j1 = await take('qd-s10');
    await leave();
    const jj = j1 ? await fr.evaluate((id) => { const h = LOOP.held.filter(x => x.id === id)[0]; return h ? { crew: h.crew, skulls: h.skulls, three: partyMath('job', { skulls: h.skulls, strength: 30 }).count } : null; }, j1.id) : null;
    await page.waitForTimeout(5200);
    const said1 = (await said()).filter(l => /sized to your/i.test(l));
    ok('S3 the job taken says how many and why', !!jj && said1.length >= 1 && new RegExp('about ' + jj.crew + ', sized to your ' + men + ' men').test(said1[said1.length - 1]),
      j1 ? '"' + j1.title + '" ' + (jj && jj.crew) + ' of them (' + (jj && jj.skulls) + ' skulls; three recruits would draw ' + (jj && jj.three) + '): ' + (said1[said1.length - 1] || 'NOTHING SAID') : 'no job');
    await shot('s3_the_take_line');

    /* ---------------- S4: the meet card says it ---------------- */
    const m1 = j1 ? await meetTheJob(j1.id) : null;
    await shot('s4_the_meet_card');
    ok('S4 the meet card says the enemy is sized to his roster, on the card', !!m1 && m1.whyShown && new RegExp('SIZED TO YOUR ' + men + ' MEN\\. WITH 3 YOU WOULD MEET ' + (jj && jj.three) + '\\.').test(m1.why || '') && m1.up.n === jj.crew,
      m1 ? 'card: "' + m1.count + '" / "' + m1.why + '"' : 'no card');

    /* ---------------- S5: ENGAGE, and the fight has them ---------------- */
    if (m1) {
      await meetPress('go');
      const f = await fightFrame();
      const fx = f ? await f.evaluate(() => { const T = R('ours.enemy_tiers'), fa = FIGHT.S.roadFaction || 'brigands';
        return { n: FIGHT.S.units.filter(u => u.side === 'them').length, mine: FIGHT.S.units.filter(u => u.side !== 'them').length, faction: fa, scale: (T.count_scale || {})[fa] || 1 }; }).catch(() => null) : null;
      await shot('s5_the_fight');
      ok('S5 ENGAGE by a hand: the fight has that many of them', !!fx && fx.n === Math.max(1, Math.round(m1.up.n * fx.scale)),
        fx ? fx.n + ' of them against ' + fx.mine + ' (the card said ' + m1.up.n + (fx.scale !== 1 ? ', dressed as ' + fx.faction + ' x' + fx.scale : '') + ')' : 'no fight');
    }
    ok('S6 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  } catch (e) { ok('the gate ran', false, e.message); }
  await d.close();
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
