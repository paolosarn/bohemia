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
   L5 THE TOWN'S ARRIVAL CARD (UI FOUR 11/17, the sweep; it was a fade from nowhere) comes out of the phone's spot and goes back into
      it: the layer's own record of it starts at the phone's centre within 8 px, in and out, and its own fade no longer runs.
   L6 THE SCAVENGE (ask row 632, EYES 11/17: 'a bare cut') grows out of the lot, the thing he searched: 'Search the lot' pressed with a
      real thumb, the cover's first move starts within 40 px of the lot on the town's picture and it goes back there when it ends; the
      worst gap between two painted frames while it opens measured (rule 441).
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
const DOORS = { '#cv': 'the world itself (the map, the town, the fight)', '#crewdoor': 'phone (its CREW button)', '#settleFrame': 'world (the town or the camp, its place on the map)', '#spoilsdoor': 'phone (the end screen)', '#bohphone': 'the phone itself',
  '#scavgame': 'world (the scavenge\'s board, under its cover: the cover grows out of the lot, the table\'s row scavenge)' };
const SELS = ROWS.map(r => r.sel).concat(Object.keys(DOORS));

(async () => {
  console.log('THE PHONE IS THE DOOR (rule 448, ask row 615)');
  const bad = ROWS.filter(r => !/^(phone|world|finger|piece|top)$/.test(r.from || '') || (r.how === 'card' && !/^(phone|world|finger|top)$/.test(r.from)));
  ok('S1 THE TABLE: ' + ROWS.length + ' pop-ups, each names where it opens from (' + ROWS.map(r => r.id + ':' + r.from).join(', ') + ')', ROWS.length >= 15 && !bad.length, bad.map(r => r.id).join(', '));
  const rowOf = id => ROWS.find(r => r.id === id) || {};
  ok('S1 THE SWEEP: the town\'s arrival card opens from the phone and the scavenge from its own thing, the lot (arrival card:' + rowOf('arrival card').from + ', scavenge:' + rowOf('scavenge').from + ' with its place)',
    rowOf('arrival card').from === 'phone' && rowOf('arrival card').sel === '#arrive' && rowOf('scavenge').from === 'world' && /#scavcover/.test(rowOf('scavenge').sel || '') && /#scavgame/.test(rowOf('scavenge').sel || '') && /id: 'scavenge'[^\n]*at: function \(w\)[^\n]*where\('lot'\)/.test(SRC));
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
        /* RE-AIMED (UI FOUR 11/17; red on main, and it took the rest of the upright walk down with it): with its move off the card opens
           with no move of the layer's at all (its own old way), so 'a row was logged' never came true and the second and third tries
           pressed whatever row of the OPEN card lay under the thumb. Now: one press at a time, 'it opened' is the card on the glass, and
           the card is put away by the page's own close before anything else is pressed */
        const setOn = () => P.evaluate(() => { const w = document.getElementById('setwrap'); return !!w && getComputedStyle(w).display !== 'none' && w.getBoundingClientRect().width > 2; });
        const setShut = async () => { await P.evaluate(() => { try { if (window.BohemiaSettings && BohemiaSettings.close) BohemiaSettings.close(); else BOHEMIA_SETTINGS.close(); } catch (e) { try { BOHEMIA_SETTINGS.close(); } catch (e2) {} } }); await P.waitForTimeout(900); };
        let opened = false;
        for (let t = 0; t < 3 && !opened; t++) { if (await setOn()) await setShut(); if (sb) await P.touchscreen.tap(sb.x, sb.y); await P.waitForTimeout(1000); opened = await setOn(); J = judgeSet(await rows(pn), await mrows(pm), 'in'); }
        ok('PLANT the settings grown from the finger with its move off: it opened, and L1\'s judge turns it away (' + (J.said || 'no move of its own') + ')', opened && !(J.good > 0 && !J.badN));
        await P.evaluate(() => { const r = BohemiaPops.POPS.find(x => x.id === 'settings'); if (r) r.from = 'phone'; window.__MOTION_THREE_OFF = false; try { if (window.BohemiaSettings && BohemiaSettings.close) BohemiaSettings.close(); else BOHEMIA_SETTINGS.close(); } catch (e) {} });
        await P.waitForTimeout(900);
      }
      /* L2 a building's sheet: MOTION moves the real sheet out of the building's box in the town's picture (realMorph 'sheet') */
      /* into a town the way the map opens one (its own door), then the town's page */
      const nA = await nlog();
      await d.fr.evaluate(() => { try { if (LOOP && LOOP.open) return; const bs = ctBases(), n = Object.keys(bs).find(k => /church/i.test(k)) || Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); } catch (e) {} }).catch(() => {});
      let sf = null; for (let i = 0; i < 40 && !sf; i++) { await P.waitForTimeout(400); for (const x of P.frames().filter(f => /SETTLEMENT_SCREEN/.test(f.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place; } catch (e) { return false; } }).catch(() => false)) sf = x; }
      /* L5 the arrival card: it stands two seconds over the town's picture and goes; both moves are the layer's, from and to the phone */
      { let rin = null, rout = null, fbx = null; for (let i = 0; i < 24 && !(rin && rout); i++) { await P.waitForTimeout(400); const rs = (await rows(nA)).filter(r => r.id === 'arrival card'); rin = rs.find(r => r.ev === 'in') || rin; rout = rs.find(r => r.ev === 'out') || rout; }
        try { fbx = sf ? await (await sf.frameElement()).boundingBox() : null; } catch (e) {}
        const top = r => (r && r.at && fbx) ? [r.at[0] + fbx.x, r.at[1] + fbx.y] : null, nearP = r => { const t = top(r); return !!(t && ph && Math.abs(t[0] - ph.cx) <= 8 && Math.abs(t[1] - ph.cy) <= 8); };
        const fade = sf ? await sf.evaluate(() => (window.__settleLog || []).filter(m => m.act === 'arrive').length) : 0;
        ok(prof + ' L5 THE TOWN\'S ARRIVAL CARD comes out of the phone\'s spot and goes back into it (in: ' + (rin ? rin.from + ' ' + top(rin) : 'none') + ', out: ' + (rout ? rout.from + ' ' + top(rout) : 'none') + '; the phone\'s centre ' + (ph && [Math.round(ph.cx), Math.round(ph.cy)]) + '; it arrived ' + fade + ' time)',
          !!rin && rin.from === 'phone' && nearP(rin) && !!rout && rout.from === 'phone' && nearP(rout) && fade >= 1, JSON.stringify([rin, rout]).slice(0, 300)); }
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
      /* L6 the scavenge: the lot's sheet, 'Search the lot' under a real thumb, the cover out of the lot; its end is the page's own (scavGone) */
      if (sf) { let why6 = 'no lot', l6 = false; try {
        const fb6 = await (await sf.frameElement()).boundingBox();
        await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(1300);
        const judge6 = async (wantFrom) => {
          const lw = await sf.evaluate(() => { const w = BohemiaSettlement.where('lot'); return w ? [w.x, w.y] : null; }); if (!lw) return { err: 'no lot in this town' };
          for (let t = 0; t < 3; t++) { await P.touchscreen.tap(fb6.x + lw[0], fb6.y + lw[1]); await P.waitForTimeout(1500); if (await sf.evaluate(() => BohemiaSettlement.state.open === 'lot')) break; }
          const bt = await sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet .act')].find(x => /Search the lot/i.test(x.textContent) && !x.disabled); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
          if (!bt) return { err: 'no Search the lot to press (' + (await sf.evaluate(() => (document.getElementById('sbody') || {}).innerText || '')).slice(0, 80).replace(/\n/g, ' ') + ')' };
          const lot = await sf.evaluate(() => { const w = BohemiaSettlement.where('lot'); return [w.x, w.y]; });
          const n6 = await nlog(); await meter(); await P.touchscreen.tap(fb6.x + bt[0], fb6.y + bt[1]); await P.waitForTimeout(900); const gap6 = await worst(); await watch();
          const rin = (await rows(n6)).find(r => r.id === 'scavenge' && r.ev === 'in') || null, cover = await sf.evaluate(() => !!document.getElementById('scavcover'));
          /* its end is the game's own: LEAVE on the game's page under a real thumb (the page hands the end back, the cover and the board go) */
          const n7 = await nlog(); let left = 'no LEAVE on the game\'s page';
          for (let i = 0; i < 40; i++) { const gf = P.frames().find(f => /BOHEMIA_SCAVENGE/.test(f.url())), lv = gf ? await gf.$('#leave').catch(() => null) : null, bb = lv ? await lv.boundingBox().catch(() => null) : null;
            if (bb && bb.width > 2) { await P.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await P.waitForTimeout(700); if (!(await sf.evaluate(() => !!document.getElementById('scavcover')))) { left = 'LEAVE pressed'; break; } } else await P.waitForTimeout(400); }
          await P.waitForTimeout(700);
          const rout = (await rows(n7)).find(r => r.id === 'scavenge' && r.ev === 'out') || null;
          const nearL = r => !!(r && r.at && Math.abs(r.at[0] - lot[0]) <= 40 && Math.abs(r.at[1] - lot[1]) <= 40);
          return { good: cover && !!rin && rin.from === wantFrom && nearL(rin) && !!rout && nearL(rout) && gap6 <= 100, rin, rout, lot, gap6, cover, left }; };
        const J = await judge6('world');
        if (J.err) why6 = J.err; else { l6 = J.good; why6 = 'the lot at ' + J.lot.map(Math.round) + '; the cover came from ' + (J.rin && J.rin.from + ' ' + J.rin.at) + ' and went back to ' + (J.rout && J.rout.at) + ' (' + J.left + '); the worst frame while it opened ' + J.gap6 + ' ms'; }
        ok(prof + ' L6 THE SCAVENGE grows out of the lot he searched and goes back into it, never a bare cut (' + why6 + ')', l6);
        if (PLANT && prof === 'phone_portrait' && !J.err) {   /* the row told to come from nowhere of its own: L6's judge turns it away */
          await P.evaluate(() => { const r = BohemiaPops.POPS.find(x => x.id === 'scavenge'); if (r) { r.__at = r.at; r.at = null; r.from = 'finger'; } });
          await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(1300);
          const JP = await judge6('world');
          ok('PLANT the scavenge told to open from the finger: L6\'s judge turns it away (' + (JP.err || (JP.rin && JP.rin.from + ' ' + JP.rin.at)) + ')', !JP.err && !JP.good);
          await P.evaluate(() => { const r = BohemiaPops.POPS.find(x => x.id === 'scavenge'); if (r) { r.at = r.__at; r.from = 'world'; } });
        }
        await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(900);
      } catch (e) { ok(prof + ' L6 the scavenge leg ran', false, e && e.message); } }
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
