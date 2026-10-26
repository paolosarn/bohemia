/* ONE HUD EVERYWHERE  (UI [one HUD everywhere], 10/25/26; rule 190, and the gate rule 24 has owed since 9/22)

   PAOLO 10/25: 'why does the UI at the top of the screen on the city map have to be different than the settlement UI... why do
   things have to change locations... why can't the crew on the map be the same as the crew in the settlement... why is there
   not something cohesive?'  Rule 24 (his first votes, 9/21): ONE GAME MODE, same screen, same buttons, same UI every second.

   MEASURED BEFORE (the demo at e195afc8, 390 x 844): the map's top was two rows (DAY, the crew, the gear, NOTES; the batteries
   on glass and where you are), 108 points; the town's top was one row of its own (its name, '290 BATTERIES', CREW, LEAVE),
   61 points; the fight had nothing across the top. Three screens, three tops.

   On the DEMO, through the one driver, on his phone (390 x 844) and a computer (1440 x 900), on the map, in a town (the
   map's own loopOpenTown) and in a road fight (the map's own roadContactFight), this holds:
     ONE BAR
     - every piece of the bar (the bar, DAY, the crew, the gear, NOTES, the glass, the place) stands in the SAME RECTANGLE on
       the map, in the town and in the fight, within a pixel and a half
     - and is the SAME PICTURE: each piece cut out of the glass's own screenshot, the map's against the town's and the
       fight's, fewer than 2 percent of its pixels apart (the place's words are left out where the place is another place)
     - and says the same facts: the day, the crew's count and the batteries (the town's purse in the town), the place is
       the town's name in the town and the map's place in the fight
     - nothing of the screen's own lies over the bar (what the glass shows at each piece's middle is the piece)
     THE TOWN
     - the town's own top row is gone, its frame starts where the bar ends, its LEAVE keeps the bottom-right corner and
       takes him back to the map
     - NO PHONE IN THE TOWN (UI [no phone in the town], rule 211, Paolo 10/26: 'the phone on the settlement screen is so
       ugly... it's covering up other buttons'; EYES line 132: LEAVE and the sheet's X under the phone's held jobs): the old
       phone is not on the town's glass (UI TWO's corner phone, data-phone="corner", rules 212 and 213, is let through)
     NOTHING COVERS A PRESS (rule 211(b)): every press's centre on the map, in the town with its board open (the bar's, the
       town's own, each landing on the town's frame from the map's page first) and in the fight hit-tests to itself
     THE FIGHT
     - the fight's board is measured under the bar (its TOPH is the bar's bottom), the phone is not on the fight's glass
     ONE CREW, ONE GEAR, ONE NOTES
     - the bar's crew opens the same company screen (the roster screen through the one door) on all three, the whole glass
     - in the fight the gear opens the game's settings over the fight, and NOTES opens the notes and a note saved there is
       in the same notes as the map's, marked as written in the fight
     - nothing thrown
   PLANTED (the phone): a fight's gear moved six points, the fight's gear redrawn, the town's own top row back, the old phone
   back in the town, a sheet laid over LEAVE: each turns a leg red.
   node gates/one_hud_everywhere_gate.js */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const TOL = 1.5, PIC = 0.02;
const PIECES = ['bar', 'day', 'crew', 'gear', 'notes', 'glass', 'place'];

/* the bar's pieces and facts, read in whichever page carries the bar */
const READ = () => {
  /* the place is said once where it has room: upright in the presses' row, wide at the glass's end (the visible one is read) */
  const S = { bar: '#bmtb', day: '#bmtb .t.day', crew: '#bmtb .t.crew', gear: '#bmtb .t.gear', notes: '#bmtb #notebtn', glass: '#bmtb .g', place: '#bmtb [data-f=place]' };
  const vis = sel => [...document.querySelectorAll(sel)].find(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }) || null;
  const out = { rect: {}, at: {} };
  for (const k in S) { const e = vis(S[k]); if (!e) { out.rect[k] = null; continue; }
    const r = e.getBoundingClientRect(); out.rect[k] = [r.x, r.y, r.width, r.height];
    const h = document.elementFromPoint(r.x + r.width / 2, r.y + Math.min(r.height / 2, 14)); out.at[k] = !!h && (h === e || e.contains(h)); }
  const t = s => { const e = vis(s); return e ? e.textContent.replace(/\s+/g, ' ').trim() : null; };
  out.facts = { day: t('#bmtb [data-f=day] b'), crew: t('#bmtb [data-f=crew] b'), batteries: t('#bmtb [data-f=batteries] b'), place: t('#bmtb [data-f=place]') };
  /* said ONCE: never at the glass's end and in the presses' row both */
  out.placeOnce = [...document.querySelectorAll('#bmtb [data-f=place]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).length === 1;
  return out;
};
const PHONE = () => { const e = document.getElementById('cityfeed'); if (!e) return null; const r = e.getBoundingClientRect();
  const h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { rect: [r.x, r.y, r.width, r.height], onTop: !!h && e.contains(h), shown: r.width > 0 && getComputedStyle(e).display !== 'none' }; };
/* every press on this page: visible, inside the glass, and its centre hit-tests to itself (rule 211(b)) */
const PRESS = (sel) => { const out = []; const vis = e => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && +cs.opacity > 0.05 && cs.pointerEvents !== 'none'
  && r.x + r.width / 2 >= 0 && r.y + r.height / 2 >= 0 && r.x + r.width / 2 <= innerWidth && r.y + r.height / 2 <= innerHeight; };
  [...document.querySelectorAll(sel)].filter(vis).forEach(e => { const r = e.getBoundingClientRect(), h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    out.push({ id: (e.id || e.className.toString().slice(0, 16) || e.tagName) + ' ' + (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 14), ok: !!h && (h === e || e.contains(h)), on: h ? (h.id || h.tagName) : null, r: [r.x, r.y, r.width, r.height] }); });
  return out; };
const PRESS_SEL = 'button:not([disabled]), [role=button], #bmtb .t, #bmtb #notebtn, #speedpad .sp';
const pressSay = L => L.filter(x => !x.ok).map(x => x.id + ' under ' + x.on).join(', ');
const near = (a, b) => !!a && !!b && a.every((v, i) => Math.abs(v - b[i]) <= TOL);
const fmt = r => r ? r.map(v => Math.round(v * 10) / 10).join(',') : 'none';

/* the same piece in two screenshots: the share of its pixels more than 40 apart in any channel (mask: a rect left out) */
async function picDiff(cmp, a, b, rect, dpr, mask) {
  return cmp.evaluate(async ({ a, b, rect, dpr, mask }) => {
    const dec = async s => { const im = new Image(); im.src = 'data:image/png;base64,' + s; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0); return g; };
    const A = await dec(a), B = await dec(b), x = Math.round(rect[0] * dpr), y = Math.round(rect[1] * dpr), w = Math.max(1, Math.round(rect[2] * dpr)), h = Math.max(1, Math.round(rect[3] * dpr));
    const da = A.getImageData(x, y, w, h).data, db = B.getImageData(x, y, w, h).data;
    let n = 0, off = 0;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const X = (x + i) / dpr, Y = (y + j) / dpr;
      if (mask && X >= mask[0] - 2 && X <= mask[0] + mask[2] + 2 && Y >= mask[1] - 2 && Y <= mask[1] + mask[3] + 2) continue;
      const k = (j * w + i) * 4; n++;
      if (Math.max(Math.abs(da[k] - db[k]), Math.abs(da[k + 1] - db[k + 1]), Math.abs(da[k + 2] - db[k + 2])) > 40) off++;
    }
    return n ? off / n : 1;
  }, { a, b, rect, dpr, mask });
}

async function side(profile) {
  console.log('\n' + profile);
  let d;
  try { d = await open({ profile, door: 120000, engage: true }); } catch (e) { ok('the demo opened', false, String(e.message).slice(0, 120)); return; }
  const p = d.page, fr = d.fr, dpr = profile === 'computer' ? 1 : 3, PLANT = profile === 'phone_portrait';
  const cmp = await p.context().newPage();
  const shot = async () => (await p.screenshot()).toString('base64');
  try {
    for (let i = 0; i < 40 && !(await fr.evaluate(() => !!document.getElementById('bmtb'))); i++) await p.waitForTimeout(250);
    await fr.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
    /* ---- THE MAP ---- */
    const M = await fr.evaluate('(' + READ + ')()'), MP = await fr.evaluate('(' + PHONE + ')()'), Ms = await shot();
    ok('the map: the bar and its pieces are on the glass', PIECES.every(k => M.rect[k] && M.rect[k][2] > 0), PIECES.filter(k => !M.rect[k]).join(' '));
    ok('  nothing of the map lies over the bar', PIECES.every(k => M.at[k]), PIECES.filter(k => !M.at[k]).join(' '));
    ok('  where you are is said once, whole (upright in the presses\' row, wide at the glass\'s end)', M.placeOnce && !!M.facts.place, M.facts.place + ' at ' + fmt(M.rect.place));
    ok('  the phone is on the map', !!MP && MP.shown && MP.onTop, MP && fmt(MP.rect));
    { const L = await fr.evaluate('(' + PRESS + ')(' + JSON.stringify(PRESS_SEL) + ')');
      ok('  nothing covers a press on the map (every press\'s centre is the press)', L.length >= 6 && L.every(x => x.ok), L.length + ' presses' + (pressSay(L) ? ': ' + pressSay(L) : '')); }
    {
      await fr.evaluate(() => document.querySelector('#bmtb .t.crew').click()); await p.waitForTimeout(1800);
      const c = await fr.evaluate(() => { const w = document.getElementById('crewdoor'); if (!w) return null; const r = w.getBoundingClientRect(), f = w.querySelector('iframe');
        return { rect: [r.x, r.y, r.width, r.height], src: f ? f.getAttribute('src') : '' }; });
      ok('the map\'s crew opens the company screen, the whole glass', !!c && /ROSTER_SCREEN/.test(c.src) && c.rect[0] <= 0 && c.rect[1] <= 0 && c.rect[2] >= p.viewportSize().width && c.rect[3] >= p.viewportSize().height, c && (c.src + ' ' + fmt(c.rect)));
      await fr.evaluate(() => { try { BohemiaCrewDoor.close(); } catch (_e) {} }); await p.waitForTimeout(500);
    }
    /* ---- THE TOWN ---- */
    const town = await fr.evaluate(() => { const bs = ctBases(); let best = null; for (const n in bs) { if (bs[n]) { best = { name: n, x: bs[n].x | 0, y: bs[n].y | 0, tier: mapTierOf(n) }; break; } } if (best) loopOpenTown(best); return best && best.name; });
    const sf = await (await fr.waitForSelector('#settleFrame')).contentFrame();
    await sf.waitForFunction(() => document.getElementById('leave') && document.getElementById('pname') && document.getElementById('pname').textContent !== 'THE PLACE', null, { timeout: 30000 }).catch(() => {});
    await sf.waitForFunction(() => !!document.getElementById('bmcorner'), null, { timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(2500);
    const TOWNCHK = async () => {
      const T = await fr.evaluate('(' + READ + ')()'), TP = await fr.evaluate('(' + PHONE + ')()');
      const own = await sf.evaluate(() => { const b = document.getElementById('bar'), r = b ? b.getBoundingClientRect() : null; const c = document.getElementById('crew'), cr = c ? c.getBoundingClientRect() : null;
        const l = document.getElementById('leave'), lr = l ? l.getBoundingClientRect() : null;
        const F = BohemiaSettlement.fit ? BohemiaSettlement.fit() : null, ph = F && F.phone;   /* RUN TWO [the town frames around the phone] (rule 213): where the phone stands in the town */
        return { bar: !!r && r.height > 0 && getComputedStyle(b).display !== 'none', crew: !!cr && cr.width > 0, leave: lr && [lr.x, lr.y, lr.width, lr.height], W: innerWidth, H: innerHeight, phone: ph ? [ph.left, ph.top, ph.width, ph.height] : null,
          name: (document.getElementById('pname') || {}).textContent, bats: parseInt(String((document.getElementById('bat') || {}).textContent || '').replace(/[^0-9-]/g, ''), 10) }; });
      const fb = await fr.evaluate(() => { const r = document.getElementById('settleFrame').getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; });
      return { T, TP, own, fb };
    };
    const t1 = await TOWNCHK(), Ts = await shot();
    ok('the town (' + town + '): every piece of the bar in the map\'s rectangle', PIECES.every(k => k === 'place' || near(M.rect[k], t1.T.rect[k])) && !!t1.T.rect.place,
      PIECES.filter(k => k !== 'place' && !near(M.rect[k], t1.T.rect[k])).map(k => k + ' ' + fmt(M.rect[k]) + ' vs ' + fmt(t1.T.rect[k])).join(' | '));
    ok('  nothing of the town lies over the bar', PIECES.every(k => t1.T.at[k]), PIECES.filter(k => !t1.T.at[k]).join(' '));
    ok('  the town\'s own top row is gone (its name, its batteries, its CREW)', !t1.own.bar && !t1.own.crew, 'bar ' + t1.own.bar + ', crew ' + t1.own.crew);
    ok('  the town is laid under the bar (its frame starts where the bar ends)', Math.abs(t1.fb[1] - (M.rect.bar[1] + M.rect.bar[3])) <= TOL && t1.fb[3] > 200, 'frame top ' + Math.round(t1.fb[1]) + ', bar bottom ' + Math.round(M.rect.bar[1] + M.rect.bar[3]));
    ok('  the place is the town\'s name, the batteries the town\'s purse, the day and the crew the map\'s',
      t1.T.facts.place === String(t1.own.name).trim().toUpperCase() && t1.T.facts.batteries === String(t1.own.bats) && t1.T.facts.day === M.facts.day && t1.T.facts.crew === M.facts.crew,
      JSON.stringify(t1.T.facts) + ' town ' + t1.own.name + ' ' + t1.own.bats);
    const oldPhone = () => fr.evaluate(() => { const e = document.getElementById('cityfeed'); if (!e || e.getAttribute('data-phone') === 'corner') return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; });
    ok('  no phone in the town (the old phone is off the town\'s glass; the jobs and DROP are on its board)', !(await oldPhone()), t1.TP && fmt(t1.TP.rect));
    /* nothing covers a press in the town, its board open (EYES' case: the tall sheet lifts LEAVE; the held jobs sat over it) */
    {
      const sbox = await (await sf.frameElement()).boundingBox(), TOUCH = profile !== 'computer';
      for (let i = 0; i < 6; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'board' && !!document.querySelector('#sbody .acts'))) break;
        const w = await sf.evaluate(() => BohemiaSettlement.where('board')); if (w) { if (TOUCH) await p.touchscreen.tap(sbox.x + w.x, sbox.y + w.y); else await p.mouse.click(sbox.x + w.x, sbox.y + w.y); } await p.waitForTimeout(900); }
      await p.waitForTimeout(800);
      const TP = async () => { const B = await fr.evaluate('(' + PRESS + ')(' + JSON.stringify('#bmtb .t, #bmtb #notebtn, #bmtb button, #cityfeed button, #cityfeed [role=button]') + ')');
        const T = await sf.evaluate('(' + PRESS + ')(' + JSON.stringify(PRESS_SEL) + ')');
        const up = await fr.evaluate((pts) => { const f = document.getElementById('settleFrame').getBoundingClientRect(); return pts.map(q => { const h = document.elementFromPoint(f.x + q.r[0] + q.r[2] / 2, f.y + q.r[1] + q.r[3] / 2); return h ? (h.id || h.tagName) : null; }); }, T);
        T.forEach((q, i) => { if (up[i] !== 'settleFrame') { q.ok = false; q.on = 'the map page\'s ' + up[i]; } });
        return B.concat(T); };
      const L = await TP();
      /* RUN TWO 10/26 (rule 213): the board's sheet stands above the phone's band now and scrolls, so fewer of its rows are on the glass at
         once; the floor counts the bar's five, LEAVE and the X with a job (it was eight with the sheet over the phone's corner) */
      ok('  nothing covers a press in the town with its board open (the bar\'s, LEAVE, the sheet\'s X, every job)', L.length >= 7 && L.every(x => x.ok), L.length + ' presses' + (pressSay(L) ? ': ' + pressSay(L) : ''));
      if (PLANT) {
        await sf.evaluate(() => { const l = document.getElementById('leave'), r = l.getBoundingClientRect(), d = document.createElement('div'); d.id = 'plantcover';
          d.style.cssText = 'position:fixed;z-index:99999;left:' + r.x + 'px;top:' + r.y + 'px;width:' + r.width + 'px;height:' + r.height + 'px'; document.body.appendChild(d); });
        const L2 = await TP(); await sf.evaluate(() => document.getElementById('plantcover').remove());
        ok('PLANTED: a sheet laid over LEAVE is caught', L2.some(x => !x.ok && /leave/i.test(x.id)), pressSay(L2).slice(0, 80));
      }
      await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await p.waitForTimeout(400);
    }
    const L = t1.own.leave, LW = t1.own.W, LH = t1.own.H;
    /* RE-AIMED 10/26 by RUN TWO ([the town frames around the phone], rule 213(a): 'every screen lays its buttons out of its corner'; NOTE
       on UI's board): LEAVE was held to the bottom-right corner, the phone's own corner (EYES 10/26m q10, q11: under the phone, a tap
       on it opened DROP IT). Now LEAVE stands in the phone's band, out of its corner: at the bottom beside the phone upright, over it on
       its side; never on the phone, 44 points */
    const PH = t1.own.phone, apart = (a, b) => !a || !b || a[0] + a[2] <= b[0] || b[0] + b[2] <= a[0] || a[1] + a[3] <= b[1] || b[1] + b[3] <= a[1];
    ok('  LEAVE stands out of the phone\'s corner (in its band, never on it), 44 points', !!L && !!PH && apart(L, PH) && L[2] >= 44 && L[3] >= 44 && (LH > LW ? L[1] + L[3] >= LH - 60 : L[1] + L[3] <= PH[1] + 4),
      L && fmt(L) + ' of ' + LW + 'x' + LH + ', the phone ' + (PH && fmt(PH)));
    {
      const diffs = {};
      for (const k of ['day', 'crew', 'gear', 'notes', 'glass']) diffs[k] = await picDiff(cmp, Ms, Ts, M.rect[k], dpr, k === 'glass' ? (t1.T.rect.place || M.rect.place) : null);
      ok('  the same picture as the map\'s, piece by piece (the place\'s words left out)', Object.values(diffs).every(v => v < PIC), Object.entries(diffs).map(([k, v]) => k + ' ' + (v * 100).toFixed(2) + '%').join(', '));
    }
    {
      await fr.evaluate(() => document.querySelector('#bmtb .t.crew').click()); await p.waitForTimeout(1800);
      const c = await sf.evaluate(() => { const w = document.getElementById('crewdoor'); if (!w) return null; const r = w.getBoundingClientRect(), f = w.querySelector('iframe'); return { rect: [r.x, r.y, r.width, r.height], src: f ? f.getAttribute('src') : '' }; });
      const fb = await fr.evaluate(() => { const r = document.getElementById('settleFrame').getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; });
      const V = p.viewportSize();
      ok('  the bar\'s crew in the town opens the same company screen, the whole glass', !!c && /ROSTER_SCREEN/.test(c.src) && fb[1] <= 0 && fb[3] >= V.height && c.rect[3] >= V.height, c && (c.src + ' frame ' + fmt(fb)));
      await sf.evaluate(() => { try { BohemiaCrewDoor.close(); } catch (_e) {} }); await p.waitForTimeout(700);
      const back = await fr.evaluate(() => Math.round(document.getElementById('settleFrame').getBoundingClientRect().top));
      ok('  and closed, the town is under the bar again', Math.abs(back - (M.rect.bar[1] + M.rect.bar[3])) <= TOL, back);
    }
    if (PLANT) {
      await sf.evaluate(() => { const s = document.createElement('style'); s.id = 'plant'; s.textContent = 'html.bm-in-hud body #bar{display:flex!important}'; document.head.appendChild(s); });
      await p.waitForTimeout(300); const a = await TOWNCHK(); await sf.evaluate(() => document.getElementById('plant').remove());
      ok('PLANTED: the town\'s own top row back is caught', a.own.bar);
      await fr.evaluate(() => { const s = document.createElement('style'); s.id = 'plant'; s.textContent = 'html.bm-town body #cityfeed#cityfeed{display:block!important}'; document.head.appendChild(s); });
      await p.waitForTimeout(300); const b = await oldPhone(); await fr.evaluate(() => document.getElementById('plant').remove());
      ok('PLANTED: the old phone back in the town is caught', b);
    }
    /* LEAVE takes him back to the map */
    await sf.evaluate(() => document.getElementById('leave').click()); await p.waitForTimeout(1500);
    const gone = await fr.evaluate(() => { const f = document.getElementById('settleFrame'); return !f || f.style.display === 'none'; });
    ok('  LEAVE takes him back to the map', gone);
    /* ---- THE FIGHT ---- */
    /* the map is stepped off the town first, then read and photographed the moment before the fight: the fight's bar is
       compared with the map's bar of the same moment (the place and the hour are the map's own, and they move with him) */
    await fr.evaluate(async () => { for (let i = 0; i < 40 && FZOOMING; i++) await new Promise(r => setTimeout(r, 250)); try { stepOnce(0); stepOnce(4); } catch (_e) {} });
    await p.waitForTimeout(1200);
    const MB = await fr.evaluate('(' + READ + ')()'), MBs = await shot();
    const st = await fr.evaluate(() => roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 }));
    let f = null; for (let i = 0; i < 150; i++) { const h = await p.$('#fightFrame'); if (h) { f = await h.contentFrame();
      if (f && await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && !!document.querySelector('#bmtb .where')).catch(() => false)) break; } await p.waitForTimeout(200); }
    if (!f) { ok('a road fight opened with the bar', false, String(st)); }
    else {
      await f.evaluate(() => document.fonts.ready); await p.waitForTimeout(2500);
      const FCHK = async () => f.evaluate('(' + READ + ')()');
      const F = await FCHK(), Fs = await shot();
      ok('the fight: every piece of the bar in the map\'s rectangle', PIECES.every(k => near(MB.rect[k], F.rect[k])),
        PIECES.filter(k => !near(MB.rect[k], F.rect[k])).map(k => k + ' ' + fmt(MB.rect[k]) + ' vs ' + fmt(F.rect[k])).join(' | '));
      ok('  nothing of the fight lies over the bar', PIECES.every(k => F.at[k]), PIECES.filter(k => !F.at[k]).join(' '));
      { const L = await f.evaluate('(' + PRESS + ')(' + JSON.stringify(PRESS_SEL) + ')');
        ok('  nothing covers a press in the fight', L.length >= 4 && L.every(x => x.ok), L.length + ' presses' + (pressSay(L) ? ': ' + pressSay(L) : '')); }
      ok('  the same facts as the map\'s (the day, the crew, the batteries, the place)', ['day', 'crew', 'batteries', 'place'].every(k => F.facts[k] && F.facts[k] === MB.facts[k]), JSON.stringify(F.facts) + ' vs ' + JSON.stringify(MB.facts));
      {
        const diffs = {};
        for (const k of ['day', 'crew', 'gear', 'notes', 'glass']) diffs[k] = await picDiff(cmp, MBs, Fs, MB.rect[k], dpr, k === 'glass' ? MB.rect.place : null);
        diffs.place = await picDiff(cmp, MBs, Fs, MB.rect.place, dpr, null);
        ok('  the same picture as the map\'s, piece by piece', Object.values(diffs).every(v => v < PIC), Object.entries(diffs).map(([k, v]) => k + ' ' + (v * 100).toFixed(2) + '%').join(', '));
      }
      const toph = await f.evaluate(() => TOPH);
      ok('  the fight\'s board is measured under the bar (TOPH is the bar\'s bottom)', Math.abs(toph - Math.round(M.rect.bar[1] + M.rect.bar[3])) <= 1, 'TOPH ' + toph);
      /* THE BAR'S COST, MEASURED AND HELD: the board's share of the glass in the game with the one bar on top (the fight's own
         two-thirds leg measures the bench fight, which has no map and no bar); a floor of half, so the cost can only be seen */
      const share = await f.evaluate(() => Math.round(100 * (innerHeight - TOPH - BOTH) / innerHeight));
      ok('  the fight\'s board keeps at least half the glass under the one bar', share >= 50, share + '% (TOPH ' + toph + ')');
      const ph = await p.evaluate(r => { const h = document.elementFromPoint(r[0] + r[2] / 2, r[1] + r[3] / 2); return h ? (h.id || h.tagName) : null; }, MP.rect);
      ok('  the phone is not on the fight\'s glass (his vote: the phone is in the city view only)', ph === 'fightFrame', 'at the phone\'s place: ' + ph);
      /* CREW, the gear and NOTES in the fight */
      await f.evaluate(() => document.querySelector('#bmtb .t.crew').click()); await p.waitForTimeout(2000);
      const c = await f.evaluate(() => { const w = document.getElementById('crewdoor'); if (!w) return null; const r = w.getBoundingClientRect(), fe = w.querySelector('iframe'); return { rect: [r.x, r.y, r.width, r.height], src: fe ? fe.getAttribute('src') : '' }; });
      const V = p.viewportSize();
      ok('  the bar\'s crew in the fight opens the same company screen, the whole glass', !!c && /ROSTER_SCREEN/.test(c.src) && c.rect[0] <= 0 && c.rect[1] <= 0 && c.rect[2] >= V.width && c.rect[3] >= V.height, c && (c.src + ' ' + fmt(c.rect)));
      await f.evaluate(() => { try { BohemiaCrewDoor.close(); } catch (_e) {} }); await p.waitForTimeout(500);
      await f.evaluate(() => document.querySelector('#bmtb .t.gear').click()); await p.waitForTimeout(800);
      const set = await p.evaluate(() => { const w = document.getElementById('setwrap'); if (!w) return null; const c = document.getElementById('setcard') || w, r = c.getBoundingClientRect(), h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        return { on: w.classList.contains('on'), top: !!h && w.contains(h) }; });
      ok('  the bar\'s gear in the fight opens the game\'s settings, over the fight', !!set && set.on && set.top, JSON.stringify(set));
      await p.evaluate(() => { const w = document.getElementById('setwrap'); if (w) w.classList.remove('on'); }); await p.waitForTimeout(300);
      const before = await p.evaluate(() => { try { return (JSON.parse(localStorage.getItem('bohemia.notes.v1') || '[]') || []).length; } catch (e) { return -1; } });
      await f.evaluate(() => document.querySelector('#bmtb #notebtn').click()); await p.waitForTimeout(500);
      const box = await f.evaluate(() => { const w = document.getElementById('notewrap'); if (!w) return null; const c = document.getElementById('notecard'), r = c.getBoundingClientRect(), h = document.elementFromPoint(r.x + r.width / 2, r.y + 20);
        return { on: w.classList.contains('on'), top: !!h && w.contains(h), styled: !!document.getElementById('notecss') }; });
      ok('  NOTES in the fight opens the notes, in the map\'s look, over the fight', !!box && box.on && box.top && box.styled, JSON.stringify(box));
      const fbx = await (await p.$('#fightFrame')).boundingBox();
      const ta = await f.evaluate(() => { const r = document.getElementById('notetext').getBoundingClientRect(); return [r.x + 20, r.y + 10]; });
      await p.mouse.click(fbx.x + ta[0], fbx.y + ta[1]); await p.keyboard.type('the bar is the same in the fight'); await p.waitForTimeout(200);
      await f.evaluate(() => document.getElementById('notesave').click()); await p.waitForTimeout(1200);
      const after = await p.evaluate(() => { try { return JSON.parse(localStorage.getItem('bohemia.notes.v1') || '[]') || []; } catch (e) { return []; } });
      const last = after[after.length - 1] || {};
      const plates = { fight: await f.evaluate(() => document.getElementById('noteplate').textContent), map: await fr.evaluate(() => document.getElementById('noteplate').textContent) };
      ok('  a note saved in the fight is in the same notes as the map\'s, marked as the fight, and both NOTES count it',
        after.length === before + 1 && last.text === 'the bar is the same in the fight' && last.ctx && last.ctx.mode === 'fight' && plates.fight === 'NOTES ' + after.length && plates.map === 'NOTES ' + after.length,
        before + ' -> ' + after.length + ', mode ' + (last.ctx && last.ctx.mode) + ', plates ' + JSON.stringify(plates));
      const shut = await f.evaluate(() => !document.getElementById('notewrap').classList.contains('on'));
      ok('  and SAVE closes the notes', shut);
      if (PLANT) {
        await f.evaluate(() => { const s = document.createElement('style'); s.id = 'plant'; s.textContent = '#bmtb .t.gear{position:relative!important;left:6px!important}'; document.head.appendChild(s); });
        await p.waitForTimeout(300); const a = await FCHK(); await f.evaluate(() => document.getElementById('plant').remove());
        ok('PLANTED: the fight\'s gear moved six points is caught', !near(MB.rect.gear, a.rect.gear), fmt(a.rect.gear));
        await f.evaluate(() => { document.querySelector('#bmtb .t.gear img').style.filter = 'invert(1)'; }); await p.waitForTimeout(300);
        const s2 = await shot(); const dv = await picDiff(cmp, MBs, s2, MB.rect.gear, dpr, null);
        await f.evaluate(() => { document.querySelector('#bmtb .t.gear img').style.filter = ''; });
        ok('PLANTED: the fight\'s gear redrawn is caught', dv >= PIC, (dv * 100).toFixed(2) + '%');
      }
    }
    ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  } finally { await cmp.close().catch(() => {}); await d.close(); }
}

(async () => {
  await side('phone_portrait');
  await side('computer');
  console.log('\nONE HUD EVERYWHERE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
