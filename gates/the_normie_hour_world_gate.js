/* ==========================================================================
   THE NORMIE HOUR, WORLD'S PART  (WORLD [eyes: the normie hour, world], 10/26/26; EYES round four, rule 225(d))

   EYES, a stranger's first hour on the phone (BUILD 10/26m), seven frictions on the jobs (records/
   BOHEMIA_EYES_DOUBLE_SURE_AND_THE_NORMIE_HOUR_ROUND_FOUR_10_26_26.md): F10 a tap on the job's label walked three cells short, the
   pickup came with no word; F11 a tap on 'GET PAID · CARAVANS' walked one cell and stopped, and on the computer the mark's hit box
   sat on the crew, not on the drawn plate; F30 the patrol's 'POST 1' walked onto and nothing; F29 two 'POST 1' labels; F5 one job,
   two times (the board and the phone); F21 '4 MANS', and blocks that disagreed; F28 every star cream on cream for 40 s after a hire.
   DONE WHEN: the next normie hour counts none of the seven.

   THE DEMO, his phone (JOB_PROFILE=computer for his computer), the board's own 'Take it', real taps on what the map draws:
     N1  F11: every job plate the map steps off his crew takes its tap box with it (box and drawn plate agree, every plate)
     N2  F11: a tap on the drawn 'GET PAID' of a job beside his crew walks to the client's town, never one cell off
     N3  F10: a tap on the drawn label of a recover job walks onto it, and the pickup says so on the map ('GOT ...' over the crew)
     N4  F29 + F30: the patrol's next post is labelled once; a tap on that label walks onto it and it is walked ('POST 1 WALKED')
     N5  F5: a job at a town away from him says the same time on the phone as on that town's board (the job's part, to the hour)
     N6  F21: 'men' never 'mans' (the escort's cargo plate and the plural for every unit), and no take line counts blocks
     N7  F28: after the crew changes, a job being read again keeps its last red stars and blood, pulsing, never cream on cream
     Z   nothing threw
   node gates/the_normie_hour_world_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const PROFILE = process.env.JOB_PROFILE || 'phone_portrait', TOUCH = PROFILE !== 'computer';

let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE NORMIE HOUR, WORLD: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, profile: PROFILE, engage: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  const cityBox = async () => (await page.$('#cityFrame')).boundingBox();
  const tapAt = async (x, y) => { if (TOUCH) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y); };
  const unpause = () => fr.evaluate(() => { try { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); } catch (e) {} });
  const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready));
  const leave = async () => { await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(600); };
  const shellFight = () => page.evaluate(() => !!window.CITYFIGHT);
  const goCell = async (x, y) => { await fr.evaluate(([x, y]) => { travelStop(); travelTo(0, 0, [x, y]); }, [x, y]); };
  const toTown = async () => {
    const t = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null;
      for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd >= 2 && (!best || dd < best.d)) best = { n, x: b.x, y: b.y, d: dd }; }
      return best ? Object.assign(best, { g: townDoor(best.x, best.y) }) : null; });
    if (!t) return null;
    for (let k = 0; k < 3 && !(await settleOpen()); k++) { await unpause(); await goCell(t.g[0], t.g[1]); await waitFor(settleOpen, 60000); }
    await page.waitForTimeout(1000);
    return (await settleOpen()) ? t : null;
  };
  const take = async (id) => {
    const h = await fr.$('#settleFrame'); const sf = h ? await h.contentFrame() : null; if (!sf) return null;
    await sf.waitForFunction(() => window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 15000 }).catch(() => {});
    const t = await sf.evaluate((id) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0]; if (!o) return null;
      const c = Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) }), S = BohemiaSettlement.state; S.held.push(o.id);
      window.parent.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'contract', place: S.place.name, batteries: null, contract: c }, '*'); return o.title; }, id);
    await page.waitForTimeout(900);
    return t;
  };
  const job = (id) => fr.evaluate((id) => { const j = LOOP.held.filter(h => h.id === id)[0]; return j ? JSON.parse(JSON.stringify(j)) : null; }, id);
  /* the plates this file draws for a job, as drawn (after the map stepped them), with the tap box each carries */
  const plates = (id) => fr.evaluate((id) => { render(); const H = BohemiaJobKinds.hits().filter(h => id == null || h.job === id);
    return BohemiaJobKinds.plates().filter(p => p.box && !p.moment).map(p => ({ t: p.t, lx: p.lx, ly: p.ly, w: p.w, box: { x: p.box.x, y: p.box.y, w: p.box.w, h: p.box.h },
      hit: H.some(h => Math.abs(h.x - p.box.x) < 0.5 && Math.abs(h.y - p.box.y) < 0.5) })); }, id);
  /* a real tap on the middle of a drawn plate */
  const tapPlate = async (P) => { const r = await fr.evaluate(() => { const c = document.getElementById('cv').getBoundingClientRect(); return { x: c.left, y: c.top }; });
    const fb = await cityBox(); await tapAt(fb.x + r.x + P.lx + (P.w + 6) / 2, fb.y + r.y + P.ly + 5.5); await page.waitForTimeout(300); };
  /* the checker stands him a few blocks from a cell (its own setting, rule 192(c)); what follows is his */
  const standNear = (x, y, r) => fr.evaluate(([x, y, r]) => { for (let k = r; k <= r + 4; k++) for (const [a, b] of [[k, 0], [-k, 0], [0, k], [0, -k], [k, k], [-k, -k], [k, -k], [-k, k]]) {
      const cx = x + a, cy = y + b; if (cityWalkable(cx, cy) && (typeof cityRoute !== 'function' || cityRoute(cx, cy, x, y))) { travelStop(); city.x = cx; city.y = cy; try { camHold(); } catch (e) {} render(); return [cx, cy]; } } return null; }, [x, y, r]);
  const reset = () => fr.evaluate(() => { LOOP.held = []; LOOP.fighting = null; render(); });

  try {
    await page.waitForTimeout(2500);
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 40000 }).catch(() => {});
    await fr.evaluate(() => { localStorage.setItem('bohemia.fight.met.v1', '3'); });
    const t0 = await toTown();
    if (!t0) { ok('a town opens', false); await d.close(); return done(); }

    /* ---- N3 (F10) and N2, N1 (F11): the recover job with nobody on it ---- */
    const title = await take('qd-ap09'); await leave();
    let j = await job('qd-ap09');
    let n3 = null, n2 = null, n1 = null;
    if (j) {
      await standNear(j.spot.x, j.spot.y, 2);   /* close, as EYES stood: its label lands near his crew and is stepped */
      const P = (await plates('qd-ap09')).filter(p => /^(GET |THE WHITE)/.test(p.t));
      const lab = P.filter(p => p.hit)[0] || P[0];
      if (lab) { await tapPlate(lab); await waitFor(() => fr.evaluate(() => !TRAVEL), 30000); await page.waitForTimeout(800); }
      j = await job('qd-ap09');
      const fl = await fr.evaluate(() => ({ flash: window.__JOB_FLASH || null, drew: (render(), window.__JOB_FLASH_DRAWN | 0) }));
      /* N1's sample: the job held, its GET PAID and every other plate this file drew, after the map's steps */
      n1 = await plates(null);
      n3 = { lab: lab && lab.t, stage: j && j.stage, flash: fl.flash, drew: fl.drew, at: await fr.evaluate(() => [city.x, city.y]) };
      ok('N3 F10: a tap on the recover job\'s drawn label walks onto it, and the pickup says so on the map, over the crew',
        !!lab && !!j && j.stage === 'back' && /^GOT /.test(fl.flash || '') && fl.drew >= 1, JSON.stringify(n3));
      /* N2: the job now says GET PAID; he stands beside where it was; a tap on its drawn words walks to the client */
      const P2 = (await plates('qd-ap09')).filter(p => /GET PAID/.test(p.t));
      const gp = P2.filter(p => p.hit)[0] || P2[0];
      if (gp) { await tapPlate(gp); await page.waitForTimeout(400); }
      const tr = await fr.evaluate(([fx, fy]) => { const g = townDoor(fx, fy); const to = TRAVEL && TRAVEL.to; return { to: to ? [to[0], to[1]] : null, door: g, opened: !!(LOOP.frame && LOOP.frame.style.display === 'block'),
        nearTown: to ? !!loopTownAt(to[0], to[1], 2) || (typeof townAtDoor === 'function' && !!townAtDoor(to[0], to[1])) : false }; }, [j.fromAt.x, j.fromAt.y]);
      n2 = tr;
      ok('N2 F11: a tap on the drawn GET PAID walks to the client\'s town, never one cell off', !!gp && (tr.opened || tr.nearTown), JSON.stringify(tr) + ' plate ' + (gp && gp.t));
      await waitFor(async () => (await settleOpen()) || !(await job('qd-ap09')), 60000);
      if (await settleOpen()) await leave();
    } else ok('N3 F10: the recover job taken', false, 'no job (' + title + ')');
    /* N1: every plate of every job agrees with its tap box (after the map's steps) */
    const all = n1 || [];
    const bad = all.filter(p => Math.abs(p.box.y - p.ly) > 0.5 || Math.abs(p.box.x - p.lx) > 0.5 || !p.hit);
    ok('N1 F11 (k36): every job plate the map steps carries its tap box with it', all.length >= 1 && bad.length === 0, all.length + ' plates, ' + bad.length + ' off: ' + bad.slice(0, 3).map(p => p.t + ' ' + p.ly + '/' + p.box.y).join(', '));

    /* ---- N4 (F29 + F30): the patrol ---- */
    await reset();
    if (!(await settleOpen())) await toTown();
    const pt = await take('jk-patrol-wash') || await take('jk-patrol-dam'); await leave();
    const pid = (await fr.evaluate(() => (LOOP.held.filter(h => h.plays === 'patrol')[0] || {}).id)) || null;
    /* the post he goes to first is one with no town (a town names itself; the two labels were the road posts'): a checker's order */
    await fr.evaluate((id) => { const j = LOOP.held.filter(h => h.id === id)[0]; if (!j) return; j.posts.sort((a, b) => (a.name ? 1 : 0) - (b.name ? 1 : 0)); const n = j.posts.filter(p => !p.done)[0]; if (n) j.target = { x: n.x, y: n.y }; window.__JOB_FLASH = null; render(); }, pid);
    let pj = pid ? await job(pid) : null;
    if (pj && pj.posts.filter(p => !p.done)[0].name) { ok('N4 F29 + F30: the patrol has a road post', false, 'both posts are towns: ' + pj.posts.map(p => p.name).join(', ')); pj = null; }
    if (pj) {
      const p0 = pj.posts.filter(p => !p.done)[0];
      await standNear(p0.x, p0.y, 3);
      const P = await plates(pid), name = p0.name ? String(p0.name).toUpperCase() : 'POST ' + (pj.posts.indexOf(pj.posts.filter(p => p.x === p0.x && p.y === p0.y)[0]) + 1);
      const same = P.filter(p => p.t === name), lab = same[0];
      if (lab) { await tapPlate(lab); await waitFor(() => fr.evaluate(() => !TRAVEL), 30000); await page.waitForTimeout(800); }
      if (await shellFight()) { await waitFor(async () => !(await shellFight()), 120000); }
      pj = await job(pid);
      const fl = await fr.evaluate(() => window.__JOB_FLASH || null);
      ok('N4 F29 + F30: the patrol\'s next post is labelled once, a tap on it walks onto it, and it is walked',
        same.length === 1 && !!pj && pj.posts.some(p => p.x === p0.x && p.y === p0.y && p.done) && /WALKED$/.test(fl || ''),
        '"' + pt + '": ' + same.length + ' label(s) "' + name + '" of ' + P.map(p => p.t).join('/') + '; done ' + (pj ? pj.posts.map(p => p.done).join(',') : '-') + ', said ' + fl);
    } else ok('N4 a patrol taken', false, String(pt));

    /* ---- N5 (F5): one job, one time ---- */
    const n5 = await fr.evaluate(() => {
      const bs = ctBases() || {}, names = Object.keys(bs), offers = BohemiaBoardShelf.shelf().offers || [], out = [];
      const sx = city.x, sy = city.y;
      for (const n of names) { if (out.length >= 6) break; const b = bs[n]; if (Math.max(Math.abs(b.x - sx), Math.abs(b.y - sy)) < 6) continue;
        let list = null; try { list = BohemiaBoardShelf.pick({ name: n, tier: mapTierOf(n) || 'camp' }, loopDay(), { traits: [], held: [] }); } catch (e) {}
        (list || []).slice(0, 1).forEach(o => {
          const away = BohemiaJobKinds.trip(o, n);
          travelStop(); const g = townDoor(b.x, b.y); city.x = g[0]; city.y = g[1];
          const here = BohemiaJobKinds.trip(o, n);
          city.x = sx; city.y = sy;
          const tt = T => T && T.job ? (T.job.exact ? (T.job.total != null ? T.job.total : T.job.mins) : null) : null;
          out.push({ id: o.id, town: n, kind: away && away.job && away.job.plays, away: tt(away), here: tt(here), short: away && away.short });
        }); }
      try { render(); } catch (e) {}
      return out; });
    const sh = m => { if (m == null) return null; const h = m / 60; return h < 1 ? 'U1' : h < 22 ? Math.round(h) : 'D' + Math.round(h / 24 * 2) / 2; };
    ok('N5 F5: a job at a town away from him says the same time on the phone as on that town\'s board', n5.length >= 3 && n5.every(x => x.away != null && sh(x.away) === sh(x.here)),
      n5.map(x => x.id + '@' + x.town + ' ' + x.kind + ': phone ' + (x.away != null ? Math.round(x.away) + ' min' : 'a range') + ', board ' + (x.here != null ? Math.round(x.here) + ' min' : '-') + ' ("' + x.short + '")').join(' | '));

    /* ---- N6 (F21): men, and no counted blocks ---- */
    const n6 = await fr.evaluate(() => {
      const units = {}; const K = (BohemiaJobKinds.data && BohemiaJobKinds.data()) || null;
      const offers = (BohemiaBoardShelf.shelf().offers || []); const lines = [];
      ['qd-ae09', 'qd-s03', 'qd-ap05', 'qd-ap09', 'qd-s01'].forEach(id => { const o = offers.filter(x => x.id === id)[0]; if (!o) return;
        const bs = ctBases() || {}, n = Object.keys(bs)[0], b = bs[n]; const J = BohemiaJobKinds.plan(o, { name: n, x: b.x, y: b.y }); if (J) lines.push({ id, take: J.sayTake || '', unit: J.cargo ? J.cargo.unit : null, plate: J.cargo ? J.cargo.of + ' ' + (J.cargo.of === 1 ? J.cargo.unit : '') : null }); });
      return { lines, men: BohemiaJobKinds.plural ? BohemiaJobKinds.plural('man', 4) : null };
    });
    const mans = n6.lines.filter(l => /\bmans\b/i.test(l.take));
    const counted = n6.lines.filter(l => /\d+ blocks?/.test(l.take));
    ok('N6 F21: men, never mans, and no take line counts blocks', n6.men === 'men' && mans.length === 0 && counted.length === 0 && n6.lines.length >= 3,
      'plural(man, 4) = ' + n6.men + '; ' + n6.lines.map(l => l.id + ': "' + l.take.slice(0, 90) + '"').join(' | '));

    /* ---- N7 (F28): the stars while a job is read again ---- */
    const O = JSON.parse(require('fs').readFileSync(path.join(ROOT, 'records/target/bb/origins.json'), 'utf8')).origins;
    const crewA = O.filter(o => o.id === 'newcrew')[0].men.map((m, i) => ({ name: ['YOU', 'DESI', 'RAUL'][i] || 'M' + i, background: m.background, level: m.level || 1, main: i === 0 }));
    const crewB = crewA.concat([Object.assign({}, crewA[1], { name: 'TITO', main: false })]);   /* a man hired on */
    const n7 = await fr.evaluate(async ([crewA, crewB]) => {
      const setCrew = C => { localStorage.setItem('bohemia.company.v1', JSON.stringify(C)); try { LOOP.start.company = C.map(m => ({ background: m.background, level: m.level })); } catch (e) {} };
      setCrew(crewA);
      const bs = ctBases() || {}, n = Object.keys(bs)[0], offers = BohemiaBoardShelf.pick({ name: n, tier: mapTierOf(n) || 'camp' }, loopDay(), { traits: [], held: [] }) || [];
      const o = offers[0]; if (!o) return null;
      let R = BohemiaJobDanger.read(o, n);
      for (let i = 0; i < 240 && !(R && R.state === 'read'); i++) { await new Promise(r => setTimeout(r, 250)); R = BohemiaJobDanger.read(o, n); }
      if (!R || R.state !== 'read') return { first: R && R.state };
      const first = { stars: R.stars, danger: R.danger };
      /* the crew changes (a man hired on): the read is played again */
      setCrew(crewB);
      const R2 = BohemiaJobDanger.read(o, n);
      const b = document.createElement('button'); b.className = 'act client'; b.innerHTML = '<span>' + o.title + '</span><em><span data-job-stars="' + (o.skulls || 1) + '">\u2605</span> 45 batteries</em>';   /* the board's row: the skulls' stars until the read */ b.style.cssText = 'position:fixed;left:10px;top:200px;width:240px;height:44px;z-index:99';
      document.body.appendChild(b);
      BohemiaJobDanger.bleed(b, o, n, b.querySelector('em'));
      /* at once, while the new read is still playing (a small job's read can land in a few hundred milliseconds) */
      const st = b.querySelector('[data-job-stars]'), cs = st ? getComputedStyle(st) : null;
      const out = { first, state: R2 && R2.state, prev: !!(R2 && R2.prev), stars: st ? +st.dataset.jobStars : 0, red: !!(st && st.dataset.red), danger: b.dataset.danger || null,
        anim: cs ? cs.animationName : null, opacity: cs ? +cs.opacity : null, reading: b.querySelector('.jdreading') ? true : b.classList.contains('jdreading') || !!b.querySelector('em.jdreading') };
      await new Promise(r => setTimeout(r, 600));
      const st2 = b.querySelector('[data-job-stars]'); out.after = { state: R2 && R2.state, stars: st2 ? +st2.dataset.jobStars : 0, red: !!(st2 && st2.dataset.red) };
      b.remove();
      return out;
    }, [crewA, crewB]);
    ok('N7 F28: after the crew changes, a job being read again keeps its last red stars and blood, pulsing', !!n7 && n7.state === 'reading' && n7.prev && n7.stars === n7.first.stars && n7.red && n7.danger != null && /jdread/.test(n7.anim || '') && n7.after.stars >= 1 && n7.after.red,
      JSON.stringify(n7));
    ok('Z nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  } catch (e) { ok('the gate ran [' + String(e && e.stack || e).slice(0, 300) + ']', false); }
  await d.close();
  done();
})();
