/* ==========================================================================
   THE LOOP PLAYS ON THE MAP  (RUN, 10/1/26, VAMILY [fold the loop], rules 52, 58; release line 2)

   PAOLO 10/1: "I want the demo." RUN TWO built the whole Battle Brothers loop in one file
   with a placeholder map and a placeholder fight, and the settlement screen as a file this
   map plugs in. The fold keeps the real map and the real fight and brings the loop onto
   them (__THE_LOOP_ON_THE_MAP__ in the city file).

   ONE DRIVER PLAYS IT END TO END ON THE DEMO, WITH REAL TOUCHES:
     L1  the demo opens on the map
     L2  a touch on the town next to him sets a journey there
     L3  arriving opens the SETTLEMENT SCREEN over the map, named for the town, with his batteries
     L4  the BOARD offers work, and "Take it" gives him the contract
     L5  LEAVE closes the screen, and the JOB is drawn on the map
     L6  a touch on the JOB sets a journey, and reaching it opens the real fight
     L7  WALKING OUT (real taps on the ring to the way out) brings him home, and the job is
         STILL HIS and still on the map, unpaid: leaving is not doing the job
     L8  back to the JOB, and a fight he CLEARS (the fight's own winGame, said plainly) pays:
         one battery in the purse, on the bar, and the contract is done
     L9  no dead end: the map is on screen, the screen and the fight are gone

   node gates/the_loop_plays_on_the_map_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE LOOP PLAYS ON THE MAP: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const DIRS = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr;
  const shell = () => d.page.evaluate(() => ({ fight: !!CITYFIGHT }));
  /* a touch on a block, where it is ON THE GLASS (the canvas sits below the bar) */
  const touchCell = async (x, y) => {
    const p = await fr.evaluate(([x, y]) => { const r = document.getElementById('cv').getBoundingClientRect(); const q = __CITY.isoAt(x, y); return { x: r.left + q.sx, y: r.top + q.sy + TH / 2 }; }, [x, y]);
    await d.tapAt(p.x, p.y);
  };
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await d.page.waitForTimeout(300); } return false; };
  try {
    await d.page.waitForTimeout(2500);
    ok('L1 the demo opens on the map', await fr.evaluate(() => MODE === 'city'));
    const bats0 = await fr.evaluate(() => loopBats());

    /* L2: the nearest town that is not under his feet */
    const town = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null;
      for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y));
        if (dd >= 2 && (!best || dd < best.d)) best = { n, x: b.x, y: b.y, d: dd }; } return best; });
    if (!town) { ok('L2 there is a town to go to', false); await d.close(); return done(); }
    await touchCell(town.x, town.y);
    await d.page.waitForTimeout(150);
    const set = await fr.evaluate(() => TRAVEL ? TRAVEL.to : [city.x, city.y]);   /* a short trip can be over already */
    ok('L2 a touch on ' + town.n + ' (' + town.d + ' blocks) sets a journey there (' + JSON.stringify(set) + ')',
      !!set && Math.max(Math.abs(set[0] - town.x), Math.abs(set[1] - town.y)) <= 2);

    /* L3 */
    const opened = await waitFor(() => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)), 20000);
    await d.page.waitForTimeout(1500);
    const fh = await fr.$('#settleFrame');
    const sf = fh ? await fh.contentFrame() : null;
    const head = sf ? await sf.evaluate(() => ({ name: ((document.querySelector('#bar .name') || {}).textContent || '').trim(),
      bat: ((document.querySelector('#bar .bat') || {}).textContent || '').trim() })) : {};
    ok('*** L3 ARRIVING OPENS THE SETTLEMENT SCREEN *** ("' + head.name + '", "' + head.bat + '")',
      opened && head.name && head.name.toUpperCase() === town.n.toUpperCase() && head.bat.indexOf(String(bats0)) === 0);

    /* L4: the board, an offer, Take it */
    const fb = fh ? await fh.boundingBox() : null;
    const tapText = async (re) => { const p = await sf.evaluate((src) => { const re = new RegExp(src, 'i');
        const els = [...document.querySelectorAll('button,.pl,.hot,a,div')].filter(e => { const r = e.getBoundingClientRect(); const st = getComputedStyle(e); return r.width > 20 && r.height > 20 && st.display !== 'none' && re.test((e.textContent || '').trim()); });
        els.sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height);
        const e = els[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, t: e.textContent.trim() }; }, re.source);
      if (p) await d.page.touchscreen.tap(fb.x + p.x, fb.y + p.y); return p; };
    await tapText(/^BOARD/); await d.page.waitForTimeout(1000);
    const offer = await sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet button, #sheet .act, #sheet div')].filter(e => /battery$/i.test((e.textContent || '').trim()) && e.getBoundingClientRect().height > 20)
        .sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height)[0];
      return b ? b.textContent.trim().replace(/\d+ battery$/i, '').trim() : null; });
    if (offer) { await tapText(new RegExp('^' + offer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))); await d.page.waitForTimeout(800); await tapText(/^Take it/); await d.page.waitForTimeout(800); }
    const held = await fr.evaluate(() => LOOP.held.map(h => ({ id: h.id, title: h.title, t: h.target, pay: h.pay })));
    ok('*** L4 THE BOARD GIVES HIM A CONTRACT *** ("' + offer + '" -> ' + JSON.stringify(held.map(h => h.title)) + ')', held.length === 1 && held[0].title === offer);

    /* L5 */
    await tapText(/^LEAVE$/); await d.page.waitForTimeout(800);
    const map5 = await fr.evaluate(() => { render(); return { shut: !LOOP.frame || LOOP.frame.style.display === 'none', jobs: MAP_DREW.jobs | 0 }; });
    ok('L5 LEAVE closes the screen and the JOB is drawn on the map (' + map5.jobs + ')', map5.shut && map5.jobs === 1);
    if (!held.length) { await d.close(); return done(); }

    /* L6 */
    const job = held[0];
    const goJob = async () => {
      await touchCell(job.t.x, job.t.y);
      return waitFor(async () => (await shell()).fight, 20000);
    };
    const f1 = await goJob();
    const why = await fr.evaluate(() => LOOP.fighting);
    ok('*** L6 REACHING THE JOB OPENS THE REAL FIGHT *** (' + why + ')', f1 && why === job.id);

    /* L7: walk out with the ring */
    if (f1) {
      await d.page.waitForTimeout(4000);
      const ch = await d.page.$('#combatFrame'); const cf = await ch.contentFrame(); const box = await ch.boundingBox();
      let last = null, bad = new Set();
      for (let k = 0; k < 30; k++) {
        const s = await cf.evaluate(() => ({ over: G.over, ea: G.exit ? G.exit.ea : null, ed: G.exit ? G.exit.edist : null,
          segs: [...document.querySelectorAll('#padring g.pb')].map(g => { const r = g.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }) }));
        if (s.over || !(await shell()).fight) break;
        if (s.ea == null || s.segs.length !== 8) { await d.page.waitForTimeout(600); continue; }
        if (last && s.ed >= last.ed - 0.01) bad.add(last.i); else bad = new Set();
        const ex = Math.cos(s.ea), ey = Math.sin(s.ea);
        const i = DIRS.map((v, j) => [j, (v[0] * ex + v[1] * ey) / Math.hypot(v[0], v[1])]).filter(x => !bad.has(x[0])).sort((a, b) => b[1] - a[1])[0][0];
        await d.page.touchscreen.tap(box.x + s.segs[i][0], box.y + s.segs[i][1]); last = { i, ed: s.ed };
        await d.page.waitForTimeout(900);
      }
      await waitFor(async () => !(await shell()).fight, 15000);
      await d.page.waitForTimeout(1500);
    }
    const s7 = await fr.evaluate(() => { render(); return { held: LOOP.held.length, jobs: MAP_DREW.jobs | 0, bats: loopBats(), q: ((document.getElementById('qline') || {}).textContent || '') }; });
    ok('*** L7 WALKING OUT IS NOT THE JOB *** (home; contract still held ' + s7.held + ', JOB on the map ' + s7.jobs + ', batteries ' + s7.bats + ' of ' + bats0 + '; "' + s7.q.slice(0, 60) + '")',
      !(await shell()).fight && s7.held === 1 && s7.jobs === 1 && s7.bats === bats0);

    /* L8: back, and clear it */
    await fr.evaluate(async () => { for (let i = 0; i < 40 && FZOOMING; i++) await new Promise(r => setTimeout(r, 250)); try { stepOnce(4); } catch (_e) {} });
    await d.page.waitForTimeout(1200);
    const f2 = await goJob();
    if (f2) {
      await d.page.waitForTimeout(4000);
      const ch = await d.page.$('#combatFrame'); const cf = await ch.contentFrame();
      await cf.evaluate(() => { for (const e of (G.e || [])) { e.dead = true; e.hp = 0; } winGame(); });   /* the fight's own ending, the one a cleared board calls */
      await waitFor(async () => !(await shell()).fight, 15000);
      await d.page.waitForTimeout(1500);
    }
    const s8 = await fr.evaluate(() => { render(); try { window.__barPaintRead && window.__barPaintRead(); } catch (_e) {}
      return { held: LOOP.held.length, done: LOOP.done, bats: loopBats(), bar: window.__BAR_READ ? window.__BAR_READ.batteries : null, jobs: MAP_DREW.jobs | 0,
        q: ((document.getElementById('qline') || {}).textContent || '') }; });
    ok('*** L8 A CLEARED JOB PAYS *** (back to it ' + f2 + '; batteries ' + bats0 + ' -> ' + s8.bats + ', the bar says ' + s8.bar + '; "' + s8.q.slice(0, 60) + '")',
      f2 && s8.bats === bats0 + job.pay && s8.held === 0 && s8.done === 1 && s8.jobs === 0 && String(s8.bar) === String(s8.bats));

    /* L9 */
    const s9 = await d.page.evaluate(() => { const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(); const st = getComputedStyle(el); return r.width > 0 && st.display !== 'none' && st.visibility !== 'hidden'; };
      return { map: vis(document.getElementById('cityFrame')), fight: vis(document.getElementById('combatFrame')), inFight: CITYFIGHT }; });
    const shut = await fr.evaluate(() => MODE === 'city' && (!LOOP.frame || LOOP.frame.style.display === 'none'));
    ok('L9 no dead end: the map is on screen, the screen and the fight are gone', s9.map && !s9.fight && !s9.inFight && shut);
    ok('nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 100) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
  }
  await d.close();
  done();
})();
