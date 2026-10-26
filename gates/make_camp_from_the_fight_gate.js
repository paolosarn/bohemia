/* MAKE CAMP FROM THE FIGHT GATE (RUN FOUR's half of [make camp from the fight], VAMILY rule 267(b), 10/26/26).
   PAOLO 10/26: 'after combat ends there should be a button where you go straight into camp mode to start healing.'
   MEASURED BEFORE: the end-of-fight screen had one way out, LEAVE; camp was a second trip, the map's CAMP button after the clouds part.
     C1 THE SCREEN, phone and computer: MAKE CAMP stands beside LEAVE on the bottom bar, both whole and a thumb's size, clear of the
        loot's buttons and the strip; it is there after a won, a lost and a pulled-out fight, and not after a wipe (nobody is standing)
     C2 THE DEMO, phone and computer: a road fight won through the map's own door; MAKE CAMP (a real tap) takes the counts home like
        LEAVE (the company's tape up by the loot's), the end screen and the fight are gone, and CAMP's camp is made where the party
        stands, the fight's place (BohemiaMapCamp)
     C3 the camp is not broken by the finished fight's own contact flag (measured before the hand-over cleared it: broken on its
        first hour as 'contact', phone and computer); anything else that ends a camp is CAMP's [camp holds until he ends it]
   node gates/make_camp_from_the_fight_gate.js */
'use strict';
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('=== MAKE CAMP FROM THE FIGHT GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2' };

(async () => {
  const srv = http.createServer((rq, rs) => {
    const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
    rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const b = await chromium.launch(), serrs = [];
  for (const [w, h, mob, name] of [[390, 844, true, 'PHONE'], [1280, 800, false, 'COMPUTER']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mob, hasTouch: mob });
    const shown = {};
    for (const q of ['', '?lost', '?ran', '?wipe']) {
      const p = await ctx.newPage(); p.on('pageerror', e => serrs.push(name + ': ' + e.message));
      await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_SPOILS_SCREEN.html' + q);
      await p.waitForFunction(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened, null, { timeout: 30000 });
      await p.waitForTimeout(300);
      const r = await p.evaluate(() => { const box = id => { const e = document.getElementById(id); if (!e || e.hidden || getComputedStyle(e).display === 'none') return null; const q = e.getBoundingClientRect(); return { x: q.left, y: q.top, w: q.width, h: q.height }; };
        return { camp: box('camp'), leave: box('leave'), all: box('lootall'), opt: box('optimize'), said: box('said'), vw: innerWidth, vh: innerHeight }; });
      shown[q || 'won'] = r;
      await p.close();
    }
    const r = shown.won, whole = q => q && q.x >= 0 && q.y >= 0 && q.x + q.w <= r.vw + 0.5 && q.y + q.h <= r.vh + 0.5;
    const apart = (a, c) => !a || !c || a.x + a.w <= c.x + 0.5 || c.x + c.w <= a.x + 0.5 || a.y + a.h <= c.y + 0.5 || c.y + c.h <= a.y + 0.5;
    ok('C1 ' + name + ': MAKE CAMP beside LEAVE on the bottom bar, both whole and a thumb\'s size, clear of the loot\'s buttons and the strip',
      !!r.camp && !!r.leave && Math.abs((r.camp.y + r.camp.h / 2) - (r.leave.y + r.leave.h / 2)) < 4 && r.camp.x < r.leave.x && whole(r.camp) && whole(r.leave) && r.camp.h >= 44 && r.camp.w >= 88
        && apart(r.camp, r.leave) && apart(r.camp, r.all) && apart(r.camp, r.opt) && apart(r.camp, r.said) && apart(r.leave, r.all) && (mob ? apart(r.all, r.said) : true),
      r.camp ? Math.round(r.camp.w) + 'x' + Math.round(r.camp.h) + ' at ' + Math.round(r.camp.x) + ',' + Math.round(r.camp.y) + ', LEAVE at ' + Math.round(r.leave.x) + ',' + Math.round(r.leave.y) : 'no MAKE CAMP');
    ok('    ' + name + ': there after a won, a lost and a pulled-out fight; not after a wipe', !!shown.won.camp && !!shown['?lost'].camp && !!shown['?ran'].camp && !shown['?wipe'].camp,
      ['won', '?lost', '?ran', '?wipe'].map(k => k + ':' + (shown[k].camp ? 'yes' : 'no')).join(' '));
    await ctx.close();
  }
  await b.close(); srv.close();
  ok('    nothing threw on the screen', serrs.length === 0, serrs.slice(0, 2).join(' | '));

  /* ---- C2 the demo ---- */
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  for (const prof of ['phone_portrait', 'computer']) {
    const name = prof === 'computer' ? 'COMPUTER' : 'PHONE';
    let d;
    try { d = await drive.open({ profile: prof, keepCards: true, engage: true, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
    catch (e) { ok('C2 ' + name + ' the demo boots [' + String(e.message).slice(0, 160) + ']', false); continue; }
    const p = d.page, fr = d.fr, errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      await p.waitForTimeout(2500);
      const where = await fr.evaluate(() => { try { stepOnce(0); stepOnce(4); } catch (_e) {} return [city.x | 0, city.y | 0]; });
      const tape0 = await p.evaluate(() => (JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}') || {}).tape | 0);
      await fr.evaluate(() => { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 91 }); });
      let f = null;
      for (let i = 0; i < 200 && !f; i++) { const hh = await p.$('#fightFrame'); if (hh) { const c = await hh.contentFrame();
        if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
      if (!f) { ok('C2 ' + name + ': a road fight through the map\'s own door', false); }
      else {
        await f.evaluate(() => { const S = FIGHT.S; S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; u.armB = 0; u.armH = 0; }); S.over = true; S.result = 'won'; showOver('won'); });
        const SF = () => p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
        for (let i = 0; i < 100 && !(SF() && await SF().evaluate(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened).catch(() => false)); i++) await p.waitForTimeout(200);
        const counts = await SF().evaluate(() => BohemiaSpoilsScreen.state.counts);
        const L2 = p.frameLocator('#spoilsdoor iframe').locator('#camp');
        if (prof === 'computer') await L2.click(); else await L2.tap();
        let st = null;
        for (let i = 0; i < 40; i++) {
          const sh = await p.evaluate(() => ({ home: !CITYFIGHT && !document.getElementById('spoilsdoor') && !document.getElementById('fightFrame'), camped: window.SPOILS && SPOILS.camped }));
          const cm = await fr.evaluate(() => { const C = window.BohemiaMapCamp; return { camp: !!(C && C.on()), at: C && C.state ? C.state().at : null, city: [city.x | 0, city.y | 0] }; });
          st = Object.assign(sh, cm); if (st.home && st.camp) break; await p.waitForTimeout(250); }
        const tape1 = await p.evaluate(() => (JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}') || {}).tape | 0);
        ok('C2 ' + name + ': MAKE CAMP (a real tap): the counts go home like LEAVE (tape ' + tape0 + ' -> ' + tape1 + '), the end screen and the fight are gone, and the camp is made where the party stands, the fight\'s place',
          st.home && st.camp && !!st.at && st.at[0] === st.city[0] && st.at[1] === st.city[1] && st.city[0] === where[0] && st.city[1] === where[1] && tape1 === tape0 + (counts.tape | 0),
          JSON.stringify({ home: st.home, camp: st.camp, at: st.at, fight: where, camped: st.camped }));
        await p.waitForTimeout(3000);
        const hold = await fr.evaluate(() => { const C = window.BohemiaMapCamp; return { on: C.on(), state: C.state ? { hours: C.state().hours, why: C.state().why } : null }; });
        ok('    ' + name + ': the camp the fight hands over is not broken by the fight\'s own contact (it broke on its first hour as \'contact\' before the hand-over cleared the finished fight\'s flag)',
          hold.on || (hold.state && hold.state.why !== 'contact'), (hold.on ? 'still up' : 'broken: ' + JSON.stringify(hold.state)) + ' three seconds on');
      }
      ok('    ' + name + ': nothing threw on the demo', errs.length === 0, errs.slice(0, 3).join(' | '));
    } catch (e) { ok('C2 ' + name + ' ran to the end [' + String(e && e.message).slice(0, 200) + ']', false); }
    try { await d.close(); } catch (_e) {}
  }
  done();
})();
