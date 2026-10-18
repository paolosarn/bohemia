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
     L4  the BOARD (a building since RUN TWO's rebuild: a finger on it) offers work, and "Take it" gives him the contract
     L5  LEAVE closes the screen, and the JOB is drawn on the map
     L6  a touch on the JOB sets a journey, and reaching it opens THE REBUILT FIGHT (rule 63,
         10/2: the shell opens COMBAT's one-file fight for every fight the map starts)
     L7  *** THE FIGHT PLAYS OUT AND THE LOOP KEEPS ITS WORD ***: a real tap on AUTO plays it to
         its end (fast-forwarded, as COMBAT's gate runs it), he is home, and the contract
         settles by the result: won pays it, lost loses it (the frozen fight's walk-out leg went
         with the frozen fight: the rebuilt one has no way out)
     L8  back to the BOARD for a second contract, to the JOB, and a fight he CLEARS (the fight's
         own end, said plainly) pays: the batteries in the purse, on the bar, the contract done
     L8b the phone carries the news (the contract taken, the pay), because
     L8c nothing sits over the map: the quest line is off it (rule 61b, Paolo 10/1: 'the quest you
         put on the forefront telling me how far it is away... so fucking bad')
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

    /* L2..L5 as one walk, so L8 can take a second contract the same way */
    const contract = async (first) => {
    const bats0 = await fr.evaluate(() => loopBats());
    /* L2: the nearest town that is not under his feet */
    const town = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null;
      for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y));
        if (dd >= 2 && (!best || dd < best.d)) best = { n, x: b.x, y: b.y, d: dd }; } return best; });
    if (!town) { ok('L2 there is a town to go to', false); return null; }
    await touchCell(town.x, town.y);
    await d.page.waitForTimeout(150);
    const set = await fr.evaluate(() => TRAVEL ? TRAVEL.to : [city.x, city.y]);   /* a short trip can be over already */
    if (first) ok('L2 a touch on ' + town.n + ' (' + town.d + ' blocks) sets a journey there (' + JSON.stringify(set) + ')',
      !!set && Math.max(Math.abs(set[0] - town.x), Math.abs(set[1] - town.y)) <= 2);

    /* L3 */
    const opened = await waitFor(() => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)), 20000);
    await d.page.waitForTimeout(1500);
    const fh = await fr.$('#settleFrame');
    const sf = fh ? await fh.contentFrame() : null;
    const head = sf ? await sf.evaluate(() => ({ name: ((document.querySelector('#bar .name') || {}).textContent || '').trim(),
      bat: ((document.querySelector('#bar .bat') || {}).textContent || '').trim() })) : {};
    if (first) ok('*** L3 ARRIVING OPENS THE SETTLEMENT SCREEN *** ("' + head.name + '", "' + head.bat + '")',
      opened && head.name && head.name.toUpperCase() === town.n.toUpperCase() && head.bat.indexOf(String(bats0)) === 0);

    /* L4: the board, an offer, Take it */
    const fb = fh ? await fh.boundingBox() : null;
    const tapText = async (re) => { const p = await sf.evaluate((src) => { const re = new RegExp(src, 'i');
        const els = [...document.querySelectorAll('button,.pl,.hot,a,div')].filter(e => { const r = e.getBoundingClientRect(); const st = getComputedStyle(e); return r.width > 20 && r.height > 20 && st.display !== 'none' && re.test((e.textContent || '').trim()); });
        els.sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height);
        const e = els[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, t: e.textContent.trim() }; }, re.source);
      if (p) await d.page.touchscreen.tap(fb.x + p.x, fb.y + p.y); return p; };
    /* the board is a BUILDING since RUN TWO's rebuild (rule 67: the buildings are the buttons): a finger on its own pixels */
    let bp = null; for (let i = 0; i < 20 && !bp; i++) { bp = await sf.evaluate(() => (window.BohemiaSettlement && BohemiaSettlement.where) ? BohemiaSettlement.where('board') : null); if (!bp) await d.page.waitForTimeout(250); }
    if (bp) await d.page.touchscreen.tap(fb.x + bp.x, fb.y + bp.y);
    else await tapText(/^BOARD/);
    await d.page.waitForTimeout(1000);
    const offer = await sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet button, #sheet .act, #sheet div')].filter(e => /battery$/i.test((e.textContent || '').trim()) && e.getBoundingClientRect().height > 20)
        .sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height)[0];
      return b ? b.textContent.trim().replace(/\d+ battery$/i, '').trim() : null; });
    if (offer) { await tapText(new RegExp('^' + offer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))); await d.page.waitForTimeout(800); await tapText(/^Take it/); await d.page.waitForTimeout(800); }
    const held = await fr.evaluate(() => LOOP.held.map(h => ({ id: h.id, title: h.title, t: h.target, pay: h.pay })));
    if (first) ok('*** L4 THE BOARD GIVES HIM A CONTRACT *** ("' + offer + '" -> ' + JSON.stringify(held.map(h => h.title)) + ')', held.length === 1 && held[0].title === offer);

    /* L5 */
    await tapText(/^LEAVE$/); await d.page.waitForTimeout(800);
    const map5 = await fr.evaluate(() => { render(); return { shut: !LOOP.frame || LOOP.frame.style.display === 'none', jobs: MAP_DREW.jobs | 0 }; });
    if (first) ok('L5 LEAVE closes the screen and the JOB is drawn on the map (' + map5.jobs + ')', map5.shut && map5.jobs === 1);
    return { held, bats0, offer, ok: held.length === 1 && map5.shut && map5.jobs === 1 };
    };
    const c1 = await contract(true);
    if (!c1 || !c1.held.length) { await d.close(); return done(); }
    const held = c1.held, bats0 = c1.bats0;

    /* L6 */
    let job = held[0];
    const goJob = async () => {
      await touchCell(job.t.x, job.t.y);
      return waitFor(async () => (await shell()).fight, 20000);
    };
    const fightFrame = async () => { for (let i = 0; i < 100; i++) { const h = await d.page.$('#fightFrame');
        if (h) { const f = await h.contentFrame(); if (f && await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && typeof FIGHT !== 'undefined' && !!FIGHT.S.board).catch(() => false)) return { f, box: await h.boundingBox() }; }
        await d.page.waitForTimeout(200); } return { f: null, box: null }; };
    const f1 = await goJob();
    const why = await fr.evaluate(() => LOOP.fighting);
    const ff1 = f1 ? await fightFrame() : { f: null };
    ok('*** L6 REACHING THE JOB OPENS THE REBUILT FIGHT *** (' + why + (ff1.f ? ', ' + await ff1.f.evaluate(() => FIGHT.S.board) + ' board' : ', no rebuilt fight') + ')', f1 && why === job.id && !!ff1.f);

    /* L7: the fight plays out, and the contract settles by its result */
    let res = null;
    if (ff1.f) {
      const { f: cf, box } = ff1;
      await cf.evaluate(() => { FIGHT_UI.speed = 6; });
      const b = await cf.evaluate(() => { const r = document.getElementById('bauto').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
      await d.page.touchscreen.tap(box.x + b[0], box.y + b[1]);
      const t0 = Date.now();
      while (Date.now() - t0 < 150000) { if (await cf.evaluate(() => FIGHT.S.over).catch(() => true)) break; await d.page.waitForTimeout(500); }
      res = await cf.evaluate(() => FIGHT.S.result).catch(() => null);
      await waitFor(async () => !(await shell()).fight, 15000);
      await d.page.waitForTimeout(1500);
    }
    const s7 = await fr.evaluate(() => { render(); return { held: LOOP.held.length, done: LOOP.done, jobs: MAP_DREW.jobs | 0, bats: loopBats() }; });
    const kept = res === 'won' ? (s7.held === 0 && s7.done === 1 && s7.bats === bats0 + job.pay) : res === 'lost' ? (s7.held === 0 && s7.done === 0 && s7.bats === bats0) : false;
    ok('*** L7 THE FIGHT PLAYS OUT AND THE LOOP KEEPS ITS WORD *** (' + res + ' on AUTO; home; contract held ' + s7.held + ', done ' + s7.done + ', batteries ' + bats0 + ' -> ' + s7.bats + ')',
      !(await shell()).fight && kept && s7.jobs === 0);

    /* L8: a second contract, the same way, and clear it */
    await fr.evaluate(async () => { for (let i = 0; i < 40 && FZOOMING; i++) await new Promise(r => setTimeout(r, 250)); });
    /* a fight leaves the map PAUSED (Battle Brothers does too): a finger on 1X starts the clock again */
    const one = await fr.evaluate(() => { const e = [...document.querySelectorAll('button,div')].filter(x => /^1X$/i.test((x.textContent || '').trim()) && x.getBoundingClientRect().width > 10)
      .sort((a, b) => a.getBoundingClientRect().width - b.getBoundingClientRect().width)[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (one) { const fb0 = await (await d.page.$('#cityFrame')).boundingBox(); await d.page.touchscreen.tap(fb0.x + one.x, fb0.y + one.y); await d.page.waitForTimeout(300); }
    const c2 = await contract(false);
    const bats1 = await fr.evaluate(() => loopBats()), done1 = await fr.evaluate(() => LOOP.done);
    let f2 = false;
    if (c2 && c2.held.length) {
      job = c2.held[0];
      f2 = await goJob();
      const ff2 = f2 ? await fightFrame() : { f: null };
      if (ff2.f) {
        await ff2.f.evaluate(() => { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); });   /* the card and message a cleared fight shows */
        await waitFor(async () => !(await shell()).fight, 15000);
        await d.page.waitForTimeout(1500);
      } else f2 = false;
    }
    const s8 = await fr.evaluate(() => { render(); try { window.__barPaintRead && window.__barPaintRead(); } catch (_e) {}
      return { held: LOOP.held.length, done: LOOP.done, bats: loopBats(), bar: window.__BAR_READ ? window.__BAR_READ.batteries : null, jobs: MAP_DREW.jobs | 0,
        q: ((document.getElementById('qline') || {}).textContent || '') }; });
    ok('*** L8 A CLEARED JOB PAYS *** (a second contract ' + !!(c2 && c2.ok) + ', back to it ' + f2 + '; batteries ' + bats1 + ' -> ' + s8.bats + ', the bar says ' + s8.bar + ')',
      !!(c2 && c2.ok) && f2 && s8.bats === bats1 + job.pay && s8.held === 0 && s8.done === done1 + 1 && s8.jobs === 0 && String(s8.bar) === String(s8.bats));

    /* L8b: the news is on the phone, and nothing sits over the map (rule 61b) */
    await d.page.waitForTimeout(1500);
    const ph = await fr.evaluate(() => { const f = document.getElementById('cityfeed'); const q = document.getElementById('qline');
      return { feed: f ? f.innerText : '', qShown: !!(q && getComputedStyle(q).display !== 'none' && q.getBoundingClientRect().width > 0) }; });
    ok('*** L8b THE PHONE SAYS IT *** (' + (/Paid 1 battery/.test(ph.feed) ? 'a post: Paid 1 battery' : 'no post') + ')', /Paid \d+ battery/.test(ph.feed) && /Contract from/.test(ph.feed));
    ok('L8c nothing sits over the map: the quest line is not on the map (rule 61b)', !ph.qShown);

    /* L9 */
    const s9 = await d.page.evaluate(() => { const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(); const st = getComputedStyle(el); return r.width > 0 && st.display !== 'none' && st.visibility !== 'hidden'; };
      return { map: vis(document.getElementById('cityFrame')), fight: vis(document.getElementById('fightFrame')) || vis(document.getElementById('combatFrame')), inFight: CITYFIGHT }; });
    const shut = await fr.evaluate(() => MODE === 'city' && (!LOOP.frame || LOOP.frame.style.display === 'none'));
    ok('L9 no dead end: the map is on screen, the screen and the fight are gone', s9.map && !s9.fight && !s9.inFight && shut);
    ok('nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 100) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
  }
  await d.close();
  done();
})();
