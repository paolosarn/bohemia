#!/usr/bin/env node
/* THE FIGHT HOLDS WHAT IT SHOWS (COMBAT SIX, 11/27/26; VAMILY rule 484 as amended 11/27, built the rule 495 way).
   Paolo 11/27: 'combat keeps crashing, like when I get into combat and then when I finish it, it's insane'; his answer A: the page goes
   white or reloads by itself (Safari on his iPhone killing the tab for memory). The fight held every sheet it ever loaded, whole, to its
   end: the face strips for 6 to 27 faces (12.3 MB for 172), the body sheets of looks worn only by the dead, and every held and melee sheet
   under the end screen, where the board is never drawn again. Now a sheet is cut to the cells the fight still shows (slices/BOHEMIA_FIGHT.html,
   the packed sheets' module: sheetCut, sheetsWanted, sheetsHeldSweep, sheetsRest, sheetMissed). This gate:
     H1 THE FACES (the fight's own page, 11 of his against 16, phone upright): every face strip holds only the faces of the men on the
        board (a strip nobody here wears a face of holds none), and every man's face drawn off the cut is the same pixels as off the
        whole strip, fetched again beside it
     H2 THE DEAD: every look worn only by men on the ground is cut to the cells they lie in, the same pixels as the whole sheet's there,
        and the body sheets' memory comes down
     H3 THE NIGHT: the same fight by night: a dead man's cell through the night's colour off the cut is the same pixels as off the whole,
        and the pick of his moon the same
     H4 A CUT CELL DRAWN BRINGS THE WHOLE BACK: a cell the cut let go, drawn, has the whole sheet back on the board within 5 s, the same
        pixels as the whole
     H5 THE BOARD PLAYS ON: twenty seconds of AUTO after the cuts, no page error, men drawn every second
     H6 THE END SCREEN LETS GO (through the demo: a won fight from the map, the phone slowed 4x): under the end screen every held and
        melee sheet is gone and every body sheet holds only its dead; the men's pictures (body, gun, face, held and melee sheets) at the end
        screen are at most 15% of what they were in the fight; LEAVE takes him home with no page error
     P1 THE OLD WAY (window.__SHEETS_WHOLE): nothing is cut (the gate can tell)
   node gates/the_fight_holds_what_it_shows_gate.js [--nodemo]   About 6 min (2 without the demo). */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { leaveAt } = require(path.join(ROOT, 'tools/bohemia_leave_the_end_screen.js'));
const NODEMO = process.argv.includes('--nodemo');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (name, cond, detail) => { if (cond) pass++; else fail++; console.log((cond ? '  PASS ' : '  FAIL ') + name + (detail !== undefined ? '  -- ' + detail : '')); };

function sides(nm, nb) {
  const company = [], band = [];
  for (let i = 0; i < nm; i++) company.push(i % 3 === 2 ? { background: 'militia', gear: { main: 'crossbow' } } : i % 3 === 1 ? { background: 'militia', gear: { main: 'pipe', off: 'car_door' } } : {});
  for (let i = 0; i < nb; i++) band.push(i % 4 === 3 ? 'brigand_marksman' : 'brigand_thug');
  return { company, band };
}
async function bare(night, whole) {
  const P = sides(11, 16);
  const fo = { seed: 7, kind: 'suburb', night: !!night, deploy: false, formation: null, auto: true, company: P.company, cap: 11, band: P.band, party: { band: P.band, count: 16, rolled: true } };
  const d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait',
    arm: 'try{localStorage.setItem("bohemia.fight.speed","1")}catch(e){};' + (whole ? 'window.__SHEETS_WHOLE=true;' : '') + 'window.FIGHT_OPTS=' + JSON.stringify(fo) + ';' });
  const errs = []; d.page.on('pageerror', e => errs.push(String(e.message || e).slice(0, 200)));
  const f = d.page.mainFrame();
  for (let i = 0; i < 120; i++) { if (await f.evaluate(() => !!(window.FIGHT && FIGHT.S && UI.board && typeof sheetsHeldSweep === 'function')).catch(() => false)) break; await sleep(500); }
  await sleep(1500);
  return { d, f, errs };
}
/* in the page: drive the sweep until nothing more is cut (it cuts one sheet a call) */
const SETTLE = async () => { for (let n = 0; n < 80; n++) { while (UI.sheetCutting) await new Promise(r => setTimeout(r, 20)); const c0 = UI.sheetCuts | 0; UI.sheetsSweptAt = 0; sheetsHeldSweep(performance.now()); while (UI.sheetCutting) await new Promise(r => setTimeout(r, 20)); if ((UI.sheetCuts | 0) === c0) return UI.sheetCuts | 0; } return UI.sheetCuts | 0; };
/* in the page: lay every man of theirs of the first K looks on the ground, dead, his fall long over */
const KILL = (K) => { const looks = []; FIGHT.S.units.forEach(v => { if (v.side !== 'them' || v.beast) return; const f = lookOf(v).file; if (looks.indexOf(f) < 0 && looks.length < K) looks.push(f); });
  const only = looks.filter(f => FIGHT.S.units.every(v => lookOf(v).file !== f || v.side === 'them'));
  FIGHT.S.units.forEach(v => { if (only.indexOf(lookOf(v).file) >= 0) { v.dead = true; v.hp = 0; v._fallAt = performance.now() - beatMs() * 9; v.seenFall = true; } });
  return only; };
/* in the page: one cell of s drawn off what the board holds now and off the whole sheet fetched again, the night's colour or not: same? */
const SAME = async (a) => { const s = a.s, cells = a.cells, night = a.night;
  const Q = UI.imgs[s]; if (!Q) return { err: 'no sheet ' + s };
  let W = await sheetAgain(s); if (!W) return { err: 'no whole ' + s };
  if (!sheetIsPacked(W)) W = gridSheet(W, Q.cw, Q.ch, W.src);
  const px = (img, i) => { const col = i % Q.cols, row = Math.floor(i / Q.cols), c = document.createElement('canvas'); c.width = Q.cw; c.height = Q.ch;
    const g = c.getContext('2d'), im = night ? nightSheet(img, night) : img; sheetDraw(g, [im, col * Q.cw, row * Q.ch, Q.cw, Q.ch, 0, 0, Q.cw, Q.ch]);
    const d = g.getImageData(0, 0, c.width, c.height).data; c.width = 0; return d; };
  let diff = 0, lit = 0;
  cells.forEach(i => { const p = px(Q, i), q = px(W, i); for (let k = 0; k < p.length; k++) { if (p[k] !== q[k]) diff++; if (k % 4 === 3 && q[k]) lit++; } });
  sheetGo(W); return { diff, lit, n: cells.length }; };

(async () => {
  console.log('\nTHE FIGHT HOLDS WHAT IT SHOWS\n');
  /* ---- the day: H1, H2, H4, H5 ---- */
  {
    const { d, f, errs } = await bare(false);
    const before = await f.evaluate(() => FIGHT_PICS());
    const dead = await f.evaluate(KILL, 4);
    const cuts = await f.evaluate(SETTLE);
    const R = await f.evaluate(() => { const F = DB.rig.faces, out = { strips: [], looks: [] };
      const W = sheetsWanted(performance.now(), false);
      [F.file].concat((F.more || []).map(M => M.file)).forEach(fl => { const s = 'fight_rig/' + fl, P = UI.imgs[s]; if (!P) return;
        const held = []; if (P.t) for (let i = 0, k = 0; k < P.t.length; i++, k += 6) if (P.t[k + 4]) held.push(i);
        out.strips.push({ s, cut: !!P.whole, held, want: W[s] === 'all' ? 'all' : (W[s] || []).slice().sort((a, b) => a - b) }); });
      return out; });
    const facesOk = R.strips.length > 0 && R.strips.every(x => x.want !== 'all' && x.cut && JSON.stringify(x.held) === JSON.stringify(x.want));
    ok('H1 THE FACES: every face strip holds only the faces of the men on the board', facesOk,
      R.strips.map(x => x.s.replace('fight_rig/', '') + ' ' + x.held.length + ' of ' + (x.want === 'all' ? 'all' : x.want.length)).join(', ') + '; ' + cuts + ' cuts');
    let fsame = { diff: 0, lit: 0, n: 0 };
    for (const x of R.strips) { if (!x.held.length) continue; const r = await f.evaluate(SAME, { s: x.s, cells: x.held, night: 0 }); if (r.err) { fsame = r; break; } fsame.diff += r.diff; fsame.lit += r.lit; fsame.n += r.n; }
    ok('H1 THE FACES: every face drawn off the cut is the same pixels as off the whole strip', !fsame.err && fsame.n > 0 && fsame.lit > 0 && fsame.diff === 0,
      fsame.err || (fsame.n + ' faces, ' + fsame.lit + ' lit pixels, ' + fsame.diff + ' channels differ'));
    const L = await f.evaluate((dead) => dead.map(fl => { const s = 'fight_rig/' + fl, P = UI.imgs[s]; const held = []; for (let i = 0, k = 0; k < P.t.length; i++, k += 6) if (P.t[k + 4]) held.push(i);
      const want = FIGHT.S.units.filter(v => lookOf(v).file === fl).map(v => (v._face || 0) * P.cols + clipCol('fall', 1e6, lookOf(v))).filter((x, i, a) => a.indexOf(x) === i).sort((a, b) => a - b);
      return { s, cut: !!P.whole, held, want, mb: +(P.atlas.width * P.atlas.height * 4 / 1048576).toFixed(2) }; }), dead);
    ok('H2 THE DEAD: every look worn only by the dead is cut to the cells they lie in', L.length >= 2 && L.every(x => x.cut && JSON.stringify(x.held) === JSON.stringify(x.want)),
      L.map(x => x.s.replace('fight_rig/', '') + ' ' + x.held.length + ' cells ' + x.mb + ' MB').join(', '));
    let dsame = { diff: 0, lit: 0, n: 0 };
    for (const x of L) { const r = await f.evaluate(SAME, { s: x.s, cells: x.held, night: 0 }); if (r.err) { dsame = r; break; } dsame.diff += r.diff; dsame.lit += r.lit; dsame.n += r.n; }
    ok('H2 THE DEAD: every body on the ground off the cut is the same pixels as off the whole sheet', !dsame.err && dsame.n > 0 && dsame.lit > 0 && dsame.diff === 0,
      dsame.err || (dsame.n + ' cells, ' + dsame.lit + ' lit pixels, ' + dsame.diff + ' channels differ'));
    const after = await f.evaluate(() => FIGHT_PICS());
    ok('H2 THE DEAD: the body sheets\' memory comes down (faces and the dead\'s looks)', after.body < before.body - 10, before.body + ' -> ' + after.body + ' MB');
    /* H4: a cell the cut let go, drawn */
    const s4 = L[0] && L[0].s;
    const back = s4 ? await f.evaluate(async (s) => { const Q = UI.imgs[s]; let j = -1; for (let i = 0, k = 0; k < Q.whole.length; i++, k += 6) if (Q.whole[k + 4] && !Q.t[k + 4]) { j = i; break; }
      if (j < 0) return { err: 'no let-go cell' };
      const c = document.createElement('canvas'); c.width = Q.cw; c.height = Q.ch; const t0 = performance.now();
      sheetDraw(c.getContext('2d'), [Q, (j % Q.cols) * Q.cw, Math.floor(j / Q.cols) * Q.ch, Q.cw, Q.ch, 0, 0, Q.cw, Q.ch]); c.width = 0;
      while (UI.imgs[s] === Q && performance.now() - t0 < 5000) await new Promise(r => setTimeout(r, 50));
      const P = UI.imgs[s]; return { j, ms: Math.round(performance.now() - t0), whole: P !== Q && !P.whole && !!(P.t && P.t[j * 6 + 4]) }; }, s4) : { err: 'no cut look' };
    let bsame = back.err ? back : await f.evaluate(SAME, { s: s4, cells: [back.j], night: 0 });
    ok('H4 A CUT CELL DRAWN BRINGS THE WHOLE BACK: within 5 s, the same pixels as the whole', !back.err && back.whole && !bsame.err && bsame.diff === 0 && bsame.lit > 0,
      back.err || ('cell ' + back.j + ' asked, the whole back in ' + back.ms + ' ms, ' + bsame.diff + ' channels differ'));
    /* H5: AUTO plays on */
    const drawn = []; for (let i = 0; i < 20; i++) { await sleep(1000); drawn.push(await f.evaluate(() => { const n = UI.clipSeen ? Object.values(UI.clipSeen).reduce((a, b) => a + b, 0) : 0; return n; })); }
    ok('H5 THE BOARD PLAYS ON: twenty seconds of AUTO after the cuts, men drawn every second, no page error', errs.length === 0 && drawn[drawn.length - 1] > drawn[0] && drawn.filter((n, i) => i > 0 && n > drawn[i - 1]).length >= 15,
      (errs[0] || 'no error') + '; men drawn ' + drawn[0] + ' -> ' + drawn[drawn.length - 1]);
    await d.close();
  }
  /* ---- the night: H3 ---- */
  {
    const { d, f, errs } = await bare(true);
    const dead = await f.evaluate(KILL, 3);
    const lifts0 = await f.evaluate((dead) => FIGHT.S.units.filter(v => dead.indexOf(lookOf(v).file) >= 0).map(v => moonFor(UI.imgs['fight_rig/' + lookOf(v).file], Math.round(v.x), Math.round(v.y))), dead);
    await f.evaluate(SETTLE);
    const lifts1 = await f.evaluate((dead) => FIGHT.S.units.filter(v => dead.indexOf(lookOf(v).file) >= 0).map(v => moonFor(UI.imgs['fight_rig/' + lookOf(v).file], Math.round(v.x), Math.round(v.y))), dead);
    let nsame = { diff: 0, lit: 0, n: 0 };
    for (const fl of dead) { const s = 'fight_rig/' + fl; const cells = await f.evaluate((s) => { const P = UI.imgs[s]; const h = []; if (!P.whole) return h; for (let i = 0, k = 0; k < P.t.length; i++, k += 6) if (P.t[k + 4]) h.push(i); return h; }, s);
      if (!cells.length) { nsame.err = 'not cut: ' + fl; break; }
      for (const lift of [0.5, 0.8]) { const r = await f.evaluate(SAME, { s, cells, night: lift }); if (r.err) { nsame = r; break; } nsame.diff += r.diff; nsame.lit += r.lit; nsame.n += r.n; } }
    ok('H3 THE NIGHT: a dead man in the night\'s colour off the cut is the same pixels as off the whole, his moon the same', !nsame.err && nsame.n > 0 && nsame.diff === 0 && JSON.stringify(lifts0) === JSON.stringify(lifts1) && errs.length === 0,
      nsame.err || (nsame.n + ' cells at two moons, ' + nsame.diff + ' channels differ; moons ' + lifts0.join(',') + (JSON.stringify(lifts0) === JSON.stringify(lifts1) ? ' the same' : ' -> ' + lifts1.join(',')) + (errs[0] ? '; ' + errs[0] : '')));
    await d.close();
  }
  /* ---- P1 the old way ---- */
  {
    const { d, f } = await bare(false, true);
    await f.evaluate(KILL, 4); await sleep(4500);
    const r = await f.evaluate(() => ({ cuts: UI.sheetCuts | 0, cut: Object.keys(UI.imgs).filter(k => UI.imgs[k] && UI.imgs[k].whole).length }));
    ok('P1 THE OLD WAY (window.__SHEETS_WHOLE): nothing is cut, so H1 and H2 read the change', r.cuts === 0 && r.cut === 0, r.cuts + ' cuts');
    await d.close();
  }
  /* ---- H6 through the demo ---- */
  if (!NODEMO) {
    const d = await D.open({ profile: 'phone_portrait' });
    const errs = []; d.page.on('pageerror', e => errs.push(String(e.message || e).slice(0, 200))); d.page.on('crash', () => errs.push('THE PAGE CRASHED'));
    for (let i = 0; i < 200; i++) { if (await d.fr.evaluate(() => typeof MODE !== 'undefined' && MODE === 'city' && typeof cityHandOver === 'function' && !!(window.om && om.n)).catch(() => false)) break; await sleep(500); }
    await sleep(3000);
    await d.fr.evaluate(D.offTheTown).catch(() => null);
    await d.fr.evaluate(() => { try { if (typeof loopClose === 'function') loopClose(); } catch (e) {} }).catch(() => null);
    await sleep(2000);
    await d.cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const z0 = await d.fr.evaluate(() => ({ city: [city.x, city.y] }));
    const at = { gx: z0.city[0] + 2, gy: z0.city[1] + 1 };
    await d.fr.evaluate((at) => { const pm = partyMath('job', { skulls: 2 }), roster = []; for (let i = 0; i < pm.count; i++) roster.push({ arch: 'human' });
      const go = () => cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'A road crew', faction: null, draft: true, roster, party: pm, street: true, why: 'party:holds', at });
      if (typeof meetWalk === 'function') meetWalk(go); else go(); }, at);
    await sleep(3000);
    await d.fr.evaluate(() => { try { MEET_DONE(true); } catch (e) {} });
    for (let i = 0; i < 300; i++) { const ok_ = await d.page.evaluate(() => { try { return !!document.getElementById('fightFrame') && BohemiaMotion.dive.state() === 'off'; } catch (e) { return false; } }); if (ok_) break; await sleep(200); }
    await sleep(6000);
    const fr = await (await d.page.$('#fightFrame')).contentFrame();
    /* the men's pictures: their body, gun and face sheets and every held and melee sheet (the ground stays for MAKE CAMP's board) */
    const pics = () => fr.evaluate(() => { const px = b => !b ? 0 : b.atlas ? b.atlas.width * b.atlas.height : (b.width || 0) * (b.height || 0); let t = 0;
      Object.keys(UI.imgs).forEach(k => { if (/^fight_rig\//.test(k)) t += px(UI.imgs[k]); }); Object.keys(HOLD.ims).forEach(k => t += px(HOLD.ims[k].b)); return +(t * 4 / 1048576).toFixed(1); });
    const inFight = await pics();
    await fr.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') { u.dead = true; u._fallAt = performance.now() - beatMs() * 9; } }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} });
    let lv = null, last = null; const tW = Date.now();
    while (Date.now() - tW < 60000) { const a = await leaveAt(d.page); if (!a.why) { if (last && Math.abs(last.x - a.x) < 1) { lv = a; break; } last = a; } else last = null; await sleep(150); }
    await sleep(1500);
    const REST = () => { const held = Object.keys(HOLD.ims).length;
      const live = FIGHT.S.units.filter(v => !v.dead && !v.down).map(v => 'fight_rig/' + lookOf(v).file), deadOnly = [];
      const bad = Object.keys(UI.imgs).filter(k => /^fight_rig\//.test(k) && !/faces/.test(k)).filter(k => { const P = UI.imgs[k]; if (!P || !P.t) return false; if (!P.whole) return true;
        const n = []; for (let i = 0, j = 0; j < P.t.length; i++, j += 6) if (P.t[j + 4]) n.push(i);
        const want = FIGHT.S.units.filter(v => 'fight_rig/' + lookOf(v).file === k && (v.dead || v.down) && v._fallAt !== undefined).map(v => (v._face || 0) * P.cols + clipCol('fall', 1e6, lookOf(v)));
        return n.some(i => want.indexOf(i) < 0); });
      return { held, bad, rested: UI.restedUnderEnd | 0, letGo: !!UI.restLetGo }; };
    let rest = null; const tR = Date.now(); while (Date.now() - tR < 15000) { rest = await fr.evaluate(REST); if (rest.letGo && !rest.held && !rest.bad.length) break; await sleep(500); }
    const atEnd = await pics();
    ok('H6 THE END SCREEN LETS GO: no held or melee sheet, every body sheet only its dead', rest.letGo && rest.held === 0 && rest.bad.length === 0,
      'rested ' + rest.rested + ' frames; held sheets ' + rest.held + '; whole still ' + (rest.bad.join(', ') || 'none'));
    ok('H6 THE END SCREEN LETS GO: the men\'s pictures under the end screen at most 15% of the fight\'s', inFight > 0 && atEnd <= inFight * 0.15, inFight + ' MB in the fight -> ' + atEnd + ' MB under the end screen');
    if (lv) await d.page.touchscreen.tap(lv.x, lv.y); else await d.page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
    let home = false; const t1 = Date.now();
    while (Date.now() - t1 < 40000) { home = await d.page.evaluate(() => { try { return !document.getElementById('fightFrame') && BohemiaMotion.dive.state() === 'off'; } catch (e) { return false; } }); if (home) break; await sleep(250); }
    await sleep(1500);
    ok('H6 LEAVE takes him home, no page error', home && errs.length === 0, (home ? 'home' : 'NOT HOME') + (errs.length ? '; ' + errs.slice(0, 2).join(' | ') : ''));
    await d.cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }).catch(() => {});
    await d.close();
  }
  console.log('\nTHE FIGHT HOLDS WHAT IT SHOWS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); console.log('\nTHE FIGHT HOLDS WHAT IT SHOWS: ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1); });
