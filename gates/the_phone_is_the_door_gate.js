/* THE PHONE IS THE DOOR (UI THREE 11/14, VAMILY rule 448, ask row 615).
   PAOLO 11/14: 'when in doubt and you don't know what to do with the UI transitions, just do it from where the phone screen would be
   at all times... if you don't have an artistic thing to combine something with, just do it from the phone, where the phone is at,
   just have it come out from there.'
   S1 THE TABLE: every pop-up the house's layer moves (slices/bohemia_ui_nothing_pops.js, POPS) names where it opens from: 'phone',
      'world' (its own thing: at), 'finger' (a tooltip), 'piece' (inside a screen) or 'top' (the fight's own glass, FIGHT SCREEN's,
      rule 449); every card that is not the world's, a finger's or the fight's opens from the phone. MOTION's doors (bohemia_motion.js)
      keep their own things: the town and the camp from their place on the map, the fight from its ground, the crew screen from its
      button on the phone.
   ON THE DEMO, the phone upright and sideways (rule 441), with real taps:
   L1 SETTINGS (no thing of its own) opens out of the phone and goes back into it: every move of it (the pop-up layer on its card, at
      the phone's centre within 6 px; MOTION on the whole of it, at the phone's own SETTINGS) starts on the phone, none anywhere else;
      the worst gap between two painted frames while it opens measured.
   L2 A BUILDING'S SHEET grows out of the building he tapped (MOTION's real move, its origin within 70 px of the tap) and goes back
      into it, no slide from an edge; the move adds no frame to what the sheet costs with it off (the middle of several opens).
   L3 THE CREW SCREEN grows out of the CREW button, which sits on the phone.
   L4 NO SCREEN WITHOUT AN ANSWER: every screen that appeared on the walk (a positioned piece over 12% of the glass, in any page) is one
      the table or MOTION's doors names; a new one turns this red with its name.
   --plant: the settings' card told to grow from the finger and MOTION's move switched off, opened again upright: L1's judge turns it away.
   Run: node gates/the_phone_is_the_door_gate.js [--plant] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x ? '  [' + String(x).slice(0, 420) + ']' : '')); return g; };
const PLANT = process.argv.includes('--plant');

/* S1, read from the file */
const SRC = fs.readFileSync(path.join(ROOT, 'slices/bohemia_ui_nothing_pops.js'), 'utf8');
const TABLE = (SRC.match(/var POPS = \[([\s\S]*?)\n  \];/) || [])[1] || '';
const ROWS = TABLE.split('\n').filter(l => /\{ id: '/.test(l)).map(l => ({ id: (l.match(/id: '([^']+)'/) || [])[1], sel: (l.match(/sel: '([^']+)'/) || [])[1], how: (l.match(/how: '([^']+)'/) || [])[1], from: (l.match(/from: '([^']+)'/) || [])[1], page: (l.match(/page: \/([^/]+)\//) || [])[1] }));
const DOORS = { '#cv': 'the world itself (the map, the town, the fight)', '#crewdoor': 'phone (its CREW button)', '#settleFrame': 'world (the town or the camp, its place on the map)', '#spoilsdoor': 'phone (the end screen)', '#bohphone': 'the phone itself' };
const SELS = ROWS.map(r => r.sel).concat(Object.keys(DOORS));

(async () => {
  console.log('THE PHONE IS THE DOOR (rule 448, ask row 615)');
  const bad = ROWS.filter(r => !/^(phone|world|finger|piece|top)$/.test(r.from || '') || (r.how === 'card' && !/^(phone|world|finger|top)$/.test(r.from)));
  ok('S1 THE TABLE: ' + ROWS.length + ' pop-ups, each names where it opens from (' + ROWS.map(r => r.id + ':' + r.from).join(', ') + ')', ROWS.length >= 15 && !bad.length, bad.map(r => r.id).join(', '));
  const motionSrc = fs.readFileSync(path.join(ROOT, 'slices/bohemia_motion.js'), 'utf8');
  ok('S2 MOTION\'s doors keep their things: the town from its place (townSpot), the camp from its (campSpot), the crew screen from its button on the phone (crewButton)',
    /grow\(\{ id: 'town'[^\n]*from: sp \? sp\.top/.test(motionSrc) && /grow\(\{ id: 'camp'[^\n]*from: from/.test(motionSrc) && /var from = crewButton\(\)/.test(motionSrc));

  for (const prof of ['phone_portrait', 'phone_landscape']) {
    let d; try { d = await open({ profile: prof, door: 120000, engage: true }); } catch (e) { ok(prof + ' the demo opened', false, e.message); continue; }
    const P = d.page, seen = new Set(), errs = [];
    P.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
    const BIG = (sels) => { const out = []; const A = innerWidth * innerHeight; document.querySelectorAll('body *').forEach(e => { const cs = getComputedStyle(e); if (!/fixed|absolute/.test(cs.position)) return; if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) return;
        if (e.closest('[data-pops-ghost],#bmotion')) return;
        const r = e.getBoundingClientRect(); if (r.width * r.height < A * 0.12 || r.width * r.height > A * 0.995) return;
        let p = e.parentElement; while (p && p !== document.body) { if (/fixed|absolute/.test(getComputedStyle(p).position)) { const q = p.getBoundingClientRect(); if (q.width * q.height >= A * 0.12) return; } p = p.parentElement; }
        const named = sels.some(s => { try { return e.matches(s) || !!e.closest(s) || !!e.querySelector(s); } catch (x) { return false; } });
        out.push({ k: e.id ? '#' + e.id : e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0], named }); }); return out; };
    const watch = async () => { for (const f of P.frames()) { try { (await f.evaluate(BIG, SELS)).forEach(x => seen.add(JSON.stringify(Object.assign({ page: (f.url().split('/').pop() || 'top').replace(/\.html.*$/, '') }, x)))); } catch (e) {} } };
    const meter = () => P.evaluate(() => { window.__PD_GAPS = []; let last = performance.now(); const t0 = last; const f = (t) => { window.__PD_GAPS.push(t - last); last = t; if (t - t0 < 700) requestAnimationFrame(f); }; requestAnimationFrame(f); });
    const worst = () => P.evaluate(() => Math.round(Math.max.apply(null, (window.__PD_GAPS || [0]).slice(1))));
    const phone = () => P.evaluate(() => { const p = document.getElementById('bohphone'), r = p && p.getBoundingClientRect(); return r && r.width > 3 ? { cx: r.left + r.width / 2, cy: r.top + r.height / 2, box: [r.left, r.top, r.width, r.height].map(Math.round) } : null; });
    const rows = (n) => P.evaluate(n => BohemiaPops.log.slice(n), n), nlog = () => P.evaluate(() => BohemiaPops.log.length);
    try {
      await P.waitForTimeout(5000); await watch();
      const ph = await phone();
      /* L1 settings */
      const sb = await P.evaluate(() => { const b = [...document.querySelectorAll('#bohphone [data-app=settings]')].find(x => x.getBoundingClientRect().width > 3); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
      const near = (r, c, tol) => !!(r && r.at && c && Math.abs(r.at[0] - c[0]) <= tol && Math.abs(r.at[1] - c[1]) <= tol);
      let n0 = await nlog(); const m00 = await P.evaluate(() => (BohemiaMotion.log || []).length); await meter(); if (sb) await P.touchscreen.tap(sb.x, sb.y); await P.waitForTimeout(900); const gap1 = await worst(); await watch();
      const mlog = () => P.evaluate(() => (BohemiaMotion.log || []).length), mrows = (n) => P.evaluate(n => (BohemiaMotion.log || []).slice(n), n);
      const inPhone = (at) => !!(at && ph && at[0] >= ph.box[0] - 2 && at[0] <= ph.box[0] + ph.box[2] + 2 && at[1] >= ph.box[1] - 2 && at[1] <= ph.box[1] + ph.box[3] + 2);
      /* every move of the settings (the house's pop-up layer on its card, MOTION's on the whole of it: either may run first) starts on
         the phone (the pop-up layer at the phone's centre; MOTION at the phone's own SETTINGS), none anywhere else */
      const judgeSet = (pr, mr, ev) => { const p1 = pr.filter(r => r.id === 'settings' && r.ev === ev), m1 = mr.filter(r => r.id === 'settings' && r.how === 'real' && r.dir === (ev === 'in' ? 'in' : 'out'));
        const good = p1.filter(r => r.from === 'phone' && near(r, [ph.cx, ph.cy], 6)).length + m1.filter(r => inPhone(r.at)).length, badN = p1.filter(r => !(r.from === 'phone' && near(r, [ph.cx, ph.cy], 6))).length + m1.filter(r => !inPhone(r.at)).length;
        return { good, badN, said: ev + ': ' + p1.map(r => 'card ' + r.from + ' ' + r.at).concat(m1.map(r => 'screen ' + r.at)).join(', ') }; };
      const S_IN = judgeSet(await rows(n0), await mrows(m00), 'in');
      n0 = await nlog(); const m01 = await mlog();
      await P.evaluate(() => { try { if (window.BohemiaSettings && BohemiaSettings.close) BohemiaSettings.close(); else BOHEMIA_SETTINGS.close(); } catch (e) { try { BOHEMIA_SETTINGS.close(); } catch (e2) {} } }); await P.waitForTimeout(900);
      const S_OUT = judgeSet(await rows(n0), await mrows(m01), 'out');
      ok(prof + ' L1 SETTINGS opens out of the phone and goes back into it (' + S_IN.said + '; ' + S_OUT.said + '; the phone ' + (ph && ph.box) + '; the worst frame while it opened ' + gap1 + ' ms)',
        !!ph && S_IN.good > 0 && !S_IN.badN && S_OUT.good > 0 && !S_OUT.badN && gap1 <= 50);
      /* --plant: the settings' card told to grow from the finger and MOTION's real move put back to the old way (no move of its own),
         opened again: L1's own judge must turn it away */
      if (PLANT && prof === 'phone_portrait') {
        await P.evaluate(() => { const r = BohemiaPops.POPS.find(x => x.id === 'settings'); if (r) r.from = 'finger'; window.__MOTION_THREE_OFF = true; });
        const pn = await nlog(), pm = await mlog(); let J = null;
        for (let t = 0; t < 3; t++) { if (sb) await P.touchscreen.tap(sb.x, sb.y); await P.waitForTimeout(1000); J = judgeSet(await rows(pn), await mrows(pm), 'in'); if (J.good + J.badN > 0) break; }
        ok('PLANT the settings grown from the finger: it opened, and L1\'s judge turns it away (' + J.said + ')', J.good + J.badN > 0 && !(J.good > 0 && !J.badN));
        await P.evaluate(() => { const r = BohemiaPops.POPS.find(x => x.id === 'settings'); if (r) r.from = 'phone'; window.__MOTION_THREE_OFF = false; try { if (window.BohemiaSettings && BohemiaSettings.close) BohemiaSettings.close(); else BOHEMIA_SETTINGS.close(); } catch (e) {} });
        await P.waitForTimeout(900);
      }
      /* L2 a building's sheet: MOTION moves the real sheet out of the building's box in the town's picture (realMorph 'sheet') */
      /* into a town the way the map opens one (its own door), then the town's page */
      await d.fr.evaluate(() => { try { if (LOOP && LOOP.open) return; const bs = ctBases(), n = Object.keys(bs).find(k => /church/i.test(k)) || Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); } catch (e) {} }).catch(() => {});
      let sf = null; for (let i = 0; i < 40 && !sf; i++) { await P.waitForTimeout(400); for (const x of P.frames().filter(f => /SETTLEMENT_SCREEN/.test(f.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place; } catch (e) { return false; } }).catch(() => false)) sf = x; }
      await P.waitForTimeout(1500);
      let l2 = false, why2 = 'no town';
      if (sf) {
        const k = await sf.evaluate(() => ['board', 'hall', 'smith'].find(k => BohemiaSettlement.where(k)));
        const w = await sf.evaluate(k => BohemiaSettlement.where(k), k), fb = await (await sf.frameElement()).boundingBox(), tap = [fb.x + w.x, fb.y + w.y];
        const sheetOn = () => sf.evaluate(() => document.getElementById('sheet').classList.contains('on'));
        /* a town still settling takes the first tap for itself (measured: the hall needed a second tap on the demo): up to four */
        let m0 = await mlog(), gap2 = 0;
        for (let t = 0; t < 4; t++) { await meter(); await P.touchscreen.tap(tap[0], tap[1]); await P.waitForTimeout(1200); gap2 = await worst(); if (await sheetOn()) break; await P.waitForTimeout(1200); }
        await watch();
        const inB = (await mrows(m0)).filter(r => r.id === 'sheet' && r.how === 'real' && r.dir === 'in').pop() || null;
        m0 = await mlog(); await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }); await P.waitForTimeout(1300);
        const outB = (await mrows(m0)).filter(r => r.id === 'sheet' && r.how === 'real' && r.dir === 'out').pop() || null;
        /* THE SAME SHEET WITH ITS MOVE OFF (MOTION's old way): what the sheet's own building of itself costs (UI 9's fit, the town's
           rows); the move must add no frame of its own to that. Three opens each way, the middle one counted (one open's worst frame
           swings 17 to 33 ms on its own) */
        const opens = async () => { const g = []; for (let t = 0; t < 3; t++) { await meter(); await P.touchscreen.tap(tap[0], tap[1]); await P.waitForTimeout(1100);
            if (await sheetOn()) g.push(await worst()); await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }); await P.waitForTimeout(900); } g.sort((a, b) => a - b); return g; };
        const gOn = await opens(); await P.evaluate(() => { window.__MOTION_THREE_OFF = true; }); const gOff = await opens(); await P.evaluate(() => { window.__MOTION_THREE_OFF = false; });
        const mid = g => g.length ? g[Math.floor(g.length / 2)] : 999, gap0 = mid(gOff); gap2 = mid(gOn.concat([gap2]).sort((a, b) => a - b));
        const nearT = (r) => !!(r && r.at && Math.abs(r.at[0] - tap[0]) <= 70 && Math.abs(r.at[1] - tap[1]) <= 70);
        l2 = nearT(inB) && nearT(outB) && gap2 <= Math.max(50, gap0 + 17);
        why2 = k + ' tapped at ' + tap.map(Math.round) + '; the sheet came from ' + (inB && inB.at) + ' (' + (inB && inB.ms) + ' ms) and went back to ' + (outB && outB.at) + '; the worst frame ' + gap2 + ' ms in the middle of four opens (the same sheet with its move off ' + gap0 + ' ms)';
      }
      ok(prof + ' L2 A BUILDING\'S SHEET grows out of the building he tapped and goes back into it, no slide from an edge (' + why2 + ')', l2);
      /* L3 the crew screen */
      const cb = await P.evaluate(() => { const b = [...document.querySelectorAll('#bohphone [data-app=crew]')].find(x => x.getBoundingClientRect().width > 3); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
      const m0 = await P.evaluate(() => (BohemiaMotion.log || []).length);
      if (cb) await P.touchscreen.tap(cb.x, cb.y); await P.waitForTimeout(3500); await watch();
      const crewRow = await P.evaluate(m0 => (BohemiaMotion.log || []).slice(m0).find(r => r.id === 'crew' && r.how === 'grow') || null, m0);
      const onPhone = !!(cb && ph && cb.x >= ph.box[0] && cb.x <= ph.box[0] + ph.box[2] && cb.y >= ph.box[1] && cb.y <= ph.box[1] + ph.box[3]);
      ok(prof + ' L3 THE CREW SCREEN grows out of its CREW button, on the phone (' + (crewRow ? 'grow ' + crewRow.ms + ' ms' : 'no grow') + ')', !!crewRow && onPhone, JSON.stringify(crewRow || {}).slice(0, 200));
      /* L4 */
      const all = [...seen].map(s => JSON.parse(s)), un = all.filter(x => !x.named);
      ok(prof + ' L4 NO SCREEN WITHOUT AN ANSWER: ' + all.length + ' screens seen on the walk, each named by the table or MOTION\'s doors', !un.length, un.map(x => x.page + ' ' + x.k).join(', '));
      ok(prof + ' E nothing thrown', !errs.length, errs.slice(0, 2).join(' | '));
    } catch (e) { ok(prof + ' the walk ran', false, e && e.stack); }
    await d.close();
  }
  console.log('THE PHONE IS THE DOOR: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
