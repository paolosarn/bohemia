/* ONE HUD EVERYWHERE  (UI [one HUD everywhere], 10/25/26; rule 190, and the gate rule 24 has owed since 9/22)

   PAOLO 10/25: 'why does the UI at the top of the screen on the city map have to be different than the settlement UI... why do
   things have to change locations... why can't the crew on the map be the same as the crew in the settlement... why is there
   not something cohesive?'  Rule 24 (his first votes, 9/21): ONE GAME MODE, same screen, same buttons, same UI every second.

   MEASURED BEFORE (the demo at e195afc8, 390 x 844): the map's top was two rows (DAY, the crew, the gear, NOTES; the batteries
   on glass and where you are), 108 points; the town's top was one row of its own (its name, '290 BATTERIES', CREW, LEAVE),
   61 points; the fight had nothing across the top. Three screens, three tops.

   On the DEMO, through the one driver, on his phone (390 x 844) and a computer (1440 x 900), on the map, in a town (the
   map's own loopOpenTown) and in a road fight (the map's own roadContactFight), this holds:
     NO TILE NAME ON THE BAR (UI [no tile name on the bar], rule 262(a), Paolo 10/26: 'on the top of the UI I don't need to see
       that I'm on a freeway... the character sees it visually'): on the map and in the fight the bar writes no ground or tile
       name (the code keeps it); in a town the town's name is said once
     ONE BAR
     - every piece of the bar (the bar, DAY, the crew, the gear, NOTES, the glass) stands in the SAME RECTANGLE on
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
     THE FIGHT, RE-AIMED 10/26 BY UI (rule 280: 'in combat it can completely go away'; it amends 190 for the fight only)
     - NO bar on the fight's glass; its board is measured from the top (TOPH 0); the phone stands where it stands on the map
     - (the bar's legs above, 'the same rectangle, picture and facts', are the map and the town's; the fight's are struck)
     ONE CREW, ONE GEAR, ONE NOTES
     - the bar's crew opens the same company screen (the roster screen through the one door) on the map and in the town; in
       the fight the phone's CREW does (rule 280: the bar is off the fight's glass, its buttons still there for the phone)
     - in the fight the phone's SETTINGS opens the game's settings over the fight, and its NOTES opens the notes and a note
       saved there is in the same notes as the map's, marked as written in the fight
     - nothing thrown
   PLANTED (the phone): the bar forced back across the fight's top (rule 280), the town's own top row back, the old phone
   back in the town, a sheet laid over LEAVE: each turns a leg red.
   node gates/one_hud_everywhere_gate.js */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const TOL = 1.5, PIC = 0.02;
const ALL_PIECES = ['bar', 'day', 'crew', 'gear', 'notes', 'glass'];   /* the place is said only where it is a place (rule 262(a)) */
/* RE-AIMED 10/26 BY UI TWO (rules 238(a), 286(b): every press on the phone, no button twice): with the phone up the bar's gear and
   NOTES are the phone's SETTINGS and NOTES (their copies off the glass) and the bar's crew chip is a readout (his lead's face, the
   head count, their blood; its press is the phone's CREW). The bar's pieces read are then the bar, the day, the crew chip and the
   glass; the phone's three are held below. Without the phone (an older build) all six, as before. */
let PIECES = ALL_PIECES.slice();

/* the bar's pieces and facts, read in whichever page carries the bar */
const READ = () => {
  /* the place is said once where it has room: upright in the presses' row, wide at the glass's end (the visible one is read) */
  const S = { bar: '#bmtb', day: '#bmtb .t.day', crew: '#bmtb .t.crew', gear: '#bmtb .t.gear', notes: '#bmtb #notebtn', glass: '#bmtb .g', place: '#bmtb [data-f=place]' };
  const vis = sel => [...document.querySelectorAll(sel)].find(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }) || null;
  const out = { rect: {}, at: {} };
  for (const k in S) { const e = vis(S[k]); if (!e) { out.rect[k] = null; continue; }
    const r = e.getBoundingClientRect(); out.rect[k] = [r.x, r.y, r.width, r.height];
    const h = document.elementFromPoint(r.x + r.width / 2, r.y + Math.min(r.height / 2, 14)), ro = getComputedStyle(e).pointerEvents === 'none', bar = document.getElementById('bmtb');
    out.at[k] = !!h && (h === e || e.contains(h) || (ro && !!bar && bar.contains(h))); }   /* a readout lets a finger through to the bar under it */
  const t = s => { const e = vis(s); return e ? e.textContent.replace(/\s+/g, ' ').trim() : null; };
  out.facts = { day: t('#bmtb [data-f=day] b'), crew: t('#bmtb [data-f=crew] b'), batteries: t('#bmtb [data-f=batteries] b'), place: t('#bmtb [data-f=place]') };
  /* said ONCE: never at the glass's end and in the presses' row both */
  out.placeOnce = [...document.querySelectorAll('#bmtb [data-f=place]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).length === 1;
  out.placeShown = [...document.querySelectorAll('#bmtb [data-f=place]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && e.textContent.trim(); }).length;
  /* UI [no tile name on the bar] (rule 262(a)): the ground he stands on, which the code keeps, is nowhere in the bar's words */
  const bt = (document.getElementById('bmtb') || {}).innerText || '';
  let g = null; try { g = (window.BohemiaMaterials && BohemiaMaterials.topBarFacts && BohemiaMaterials.topBarFacts().ground) || (parent && parent.BohemiaMaterials && parent.BohemiaMaterials.topBarFacts().ground) || null; } catch (_e) {}
  out.ground = g; out.groundOnBar = !!g && bt.toUpperCase().replace(/\s+/g, '').indexOf(String(g).toUpperCase().replace(/\s+/g, '')) >= 0;
  return out;
};
/* RE-AIMED 10/26 BY UI TWO (rules 212, 213): the phone on the map is the one the shell draws once over every screen (#bohphone,
   read in the shell's own pixels); the map's old #cityfeed is read only while there is no new phone */
const PHONE = () => { let D = document; try { if (window.top.document.getElementById('bohphone')) D = window.top.document; } catch (_e) {}
  const n = D.getElementById('bohphone'); if (n) { const r = n.getBoundingClientRect(), h = D.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return { rect: [r.x, r.y, r.width, r.height], onTop: !!h && n.contains(h), shown: r.width > 0 && n.classList.contains('on'), corner: true }; }
  const e = document.getElementById('cityfeed'); if (!e) return null; const r = e.getBoundingClientRect();
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
    const ON = await fr.evaluate(() => document.documentElement.classList.contains('boh-phone-on'));
    PIECES = ON ? ['bar', 'day', 'crew', 'glass'] : ALL_PIECES.slice();
    const PH3 = () => p.evaluate(() => ['crew', 'notes', 'settings'].map(a => { const e = document.querySelector('#bohphone.on .bprow .app[data-app=' + a + ']'); if (!e) return a + ' missing';
      const r = e.getBoundingClientRect(), h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return r.width > 0 && h && e.contains(h) ? null : a + ' covered'; }).filter(Boolean));
    if (ON) { const miss = await PH3(), copies = await fr.evaluate(() => ['#bmtb .t.gear', '#bmtb #notebtn'].filter(q => { const e = document.querySelector(q); return !!e && e.getBoundingClientRect().width > 0; }));
      const ro = await fr.evaluate(() => { const e = document.querySelector('#bmtb .t.crew'); return !!e && getComputedStyle(e).pointerEvents === 'none'; });
      ok('the map: CREW, NOTES and SETTINGS are on the phone, on top; the bar has no gear or NOTES, its crew chip a readout (238(a), 286(b))', !miss.length && !copies.length && ro, (miss.join(' ') || 'all three on the phone') + '; on the bar ' + (copies.join(' ') || 'none') + ', crew chip readout ' + ro); }
    ok('the map: the bar and its pieces are on the glass', PIECES.every(k => M.rect[k] && M.rect[k][2] > 0), PIECES.filter(k => !M.rect[k]).join(' '));
    ok('  nothing of the map lies over the bar', PIECES.every(k => M.at[k]), PIECES.filter(k => !M.at[k]).join(' '));
    ok('  no ground or tile name on the map\'s bar (rule 262(a): \'the character sees it visually\')', M.placeShown === 0 && !M.groundOnBar && !!M.ground, 'the ground ' + M.ground + ' kept in the code; on the bar: ' + (M.placeShown ? M.facts.place : 'nothing'));
    ok('  the phone is on the map', !!MP && MP.shown && MP.onTop, MP && fmt(MP.rect));
    { /* RE-AIMED 10/26 BY UI TWO (rules 212, 213): the speed pad's plates stepped off the map into the phone's PLAY, so the presses
         on the map are the map's own and the one phone's apps (the shell's page), every centre the press */
      const L = (await fr.evaluate('(' + PRESS + ')(' + JSON.stringify(PRESS_SEL) + ')')).concat(MP && MP.corner ? await p.evaluate('(' + PRESS + ')(' + JSON.stringify('#bohphone .app') + ')') : []);
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
        return { bar: !!r && r.height > 0 && getComputedStyle(b).display !== 'none', crew: !!cr && cr.width > 0, leave: lr && [lr.x, lr.y, lr.width, lr.height], W: innerWidth, H: innerHeight,
          name: (document.getElementById('pname') || {}).textContent, bats: parseInt(String((document.getElementById('bat') || {}).textContent || '').replace(/[^0-9-]/g, ''), 10) }; });
      const fb = await fr.evaluate(() => { const r = document.getElementById('settleFrame').getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; });
      return { T, TP, own, fb };
    };
    const t1 = await TOWNCHK(), Ts = await shot();
    ok('the town (' + town + '): every piece of the bar in the map\'s rectangle, and the town\'s name said once', PIECES.every(k => near(M.rect[k], t1.T.rect[k])) && !!t1.T.rect.place && t1.T.placeOnce,
      PIECES.filter(k => !near(M.rect[k], t1.T.rect[k])).map(k => k + ' ' + fmt(M.rect[k]) + ' vs ' + fmt(t1.T.rect[k])).join(' | ') + ' place ' + fmt(t1.T.rect.place));
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
      /* with the phone up its presses are the town's too (LEAVE, CREW, NOTES, SETTINGS, PLAY, HEAL: rule 238(a)) */
      const TPP = async () => (await TP()).concat(ON ? await p.evaluate('(' + PRESS + ')(' + JSON.stringify('#bohphone .app, #bohphone .bpctx .lv') + ')') : []);
      const L = await TPP();
      ok('  nothing covers a press in the town with its board open (the bar\'s, LEAVE, the sheet\'s X, every job' + (ON ? ', the phone\'s' : '') + ')', L.length >= 8 && L.every(x => x.ok), L.length + ' presses' + (pressSay(L) ? ': ' + pressSay(L) : ''));
      if (PLANT) {
        if (ON) await p.evaluate(() => { const l = document.querySelector('#bohphone .bpctx .lv'), r = l.getBoundingClientRect(), d = document.createElement('div'); d.id = 'plantcover';
          d.style.cssText = 'position:fixed;z-index:99999;left:' + r.x + 'px;top:' + r.y + 'px;width:' + r.width + 'px;height:' + r.height + 'px'; document.body.appendChild(d); });
        else await sf.evaluate(() => { const l = document.getElementById('leave'), r = l.getBoundingClientRect(), d = document.createElement('div'); d.id = 'plantcover';
          d.style.cssText = 'position:fixed;z-index:99999;left:' + r.x + 'px;top:' + r.y + 'px;width:' + r.width + 'px;height:' + r.height + 'px'; document.body.appendChild(d); });
        const L2 = await TPP(); if (ON) await p.evaluate(() => document.getElementById('plantcover').remove()); else await sf.evaluate(() => document.getElementById('plantcover').remove());
        ok('PLANTED: a sheet laid over LEAVE is caught', L2.some(x => !x.ok && /leave/i.test(x.id)), pressSay(L2).slice(0, 80));
      }
      await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await p.waitForTimeout(400);
    }
    const L = t1.own.leave, LW = t1.own.W, LH = t1.own.H;
    /* RE-AIMED 10/26 BY UI TWO (rule 213; the marked line in the TOWN lift): when the one phone holds the right corner, LEAVE keeps
       that corner standing right over the phone (its bottom within 30 points over the phone's top, its right at the phone's) */
    const PR = await sf.evaluate(() => { try { const r = BOH_PHONE_RECT(); return r && r.on && r.side === 'right' ? r : null; } catch (e) { return null; } });
    /* rules 238(a), 286(b): with the phone up LEAVE is the phone's (the band under PLAY and HEAL, a door with an arrow), on top, inside
       the phone; the town's own LEAVE is off the glass */
    if (ON) { const PL = await p.evaluate(() => { const e = document.querySelector('#bohphone.on .bpctx.town .lv'), ph = document.getElementById('bohphone'); if (!e) return null;
        const r = e.getBoundingClientRect(), q = ph.getBoundingClientRect(), h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        return { r: [r.x, r.y, r.width, r.height], inside: r.left >= q.left && r.right <= q.right && r.top >= q.top && r.bottom <= q.bottom, top: !!h && e.contains(h) }; });
      ok('  LEAVE is the phone\'s in the town, inside it and on top; the town\'s own is off the glass', !!PL && PL.inside && PL.top && !(L && L[2] > 0), PL ? fmt(PL.r) + ' on the phone, the town\'s ' + (L && L[2] > 0 ? fmt(L) : 'off') : 'no LEAVE on the phone'); }
    else ok(PR ? '  LEAVE keeps the big action\'s corner, right over the phone in it, 44 points' : '  LEAVE keeps the big action\'s corner (bottom right, where the map\'s speed pad is), 44 points',
      !!L && L[2] >= 44 && L[3] >= 44 && (PR ? L[0] + L[2] >= PR.right - 30 && L[1] + L[3] <= PR.top + 0.5 && L[1] + L[3] >= PR.top - 30 : L[0] + L[2] >= LW - 30 && L[1] + L[3] >= LH - 40),
      L && fmt(L) + ' of ' + LW + 'x' + LH + (PR ? ', the phone from ' + Math.round(PR.top) + ' down' : ''));
    {
      const diffs = {};
      for (const k of PIECES.filter(k => k !== 'bar')) diffs[k] = await picDiff(cmp, Ms, Ts, M.rect[k], dpr, k === 'glass' ? t1.T.rect.place : null);
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
    /* RE-AIMED 10/26 BY UI (rule 280, Paolo 10/26: 'when it's combat mode I don't need to see my batteries and the time of day...
       in combat it can completely go away'; amends rule 190's one HUD FOR THE FIGHT ONLY): the fight wears NO bar while it is on;
       what it needs is on the phone (CREW, NOTES, SETTINGS press the bar's own buttons, built off the glass) and the board gets
       the room (TOPH 0). The bar's return on the loot screen and the map, the clouds' door and two rolled fights on three screens
       are gates/no_top_bar_in_the_fight_gate.js; this keeps the one-HUD side: the map's bar the moment before, and the fight's
       presses. */
    await fr.evaluate(async () => { for (let i = 0; i < 40 && FZOOMING; i++) await new Promise(r => setTimeout(r, 250)); try { stepOnce(0); stepOnce(4); } catch (_e) {} });
    await p.waitForTimeout(1200);
    const MB = await fr.evaluate('(' + READ + ')()');
    const st = await fr.evaluate(() => roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 }));
    let f = null; for (let i = 0; i < 150; i++) { const h = await p.$('#fightFrame'); if (h) { f = await h.contentFrame();
      if (f && await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && !!document.getElementById('bmtb')).catch(() => false)) break; } f = null; await p.waitForTimeout(200); }
    if (!f) { ok('a road fight opened', false, String(st)); }
    else {
      await f.evaluate(() => document.fonts.ready); await p.waitForTimeout(2500);
      const FCHK = async () => f.evaluate('(' + READ + ')()');
      const F = await FCHK();
      ok('the fight: no bar on its glass (rule 280), none of its pieces drawn', ALL_PIECES.every(k => !F.rect[k]), ALL_PIECES.filter(k => F.rect[k]).map(k => k + ' ' + fmt(F.rect[k])).join(' | ') || 'none drawn; the map\'s was ' + fmt(MB.rect.bar));
      /* UI TWO (rule 238(a)): with the phone up the fight's presses are the phone's (the big button, WAIT, RETREAT, AUTO, the speed, his
         abilities, CREW, NOTES, SETTINGS), so they are counted with the fight page's own */
      { const L = (await f.evaluate('(' + PRESS + ')(' + JSON.stringify(PRESS_SEL) + ')')).concat(await p.evaluate('(' + PRESS + ')(' + JSON.stringify('#bohphone .fight.on [data-c], #bohphone .fight.on .sk:not([disabled]), #bohphone .fight.on .app') + ')'));
        ok('  nothing covers a press in the fight', L.length >= 4 && L.every(x => x.ok), L.length + ' presses' + (pressSay(L) ? ': ' + pressSay(L) : '')); }
      const toph = await f.evaluate(() => TOPH);
      ok('  the fight\'s board is measured from the top of the glass (TOPH 0: the board gets the bar\'s room)', toph === 0, 'TOPH ' + toph + ' (under the bar it was ' + Math.round(M.rect.bar[1] + M.rect.bar[3]) + ')');
      const share = await f.evaluate(() => Math.round(100 * (innerHeight - TOPH - BOTH) / innerHeight));
      ok('  the fight\'s board keeps at least half the glass', share >= 50, share + '% (TOPH ' + toph + ')');
      const ph = await p.evaluate(r => { const h = document.elementFromPoint(r[0] + r[2] / 2, r[1] + r[3] / 2); return h ? (h.closest && h.closest('#bohphone') ? 'bohphone' : (h.id || h.tagName)) : null; }, MP.rect);
      /* RE-AIMED 10/26 BY UI TWO: rule 213(a) ('in combat the exact same... the same place') amends his 9/23 vote for the new phone: it
         stands in the fight where it stands on the map; the old phone is still never on the fight's glass */
      ok(MP && MP.corner ? '  the phone stands in the fight where it stands on the map (rule 213(a))' : '  the phone is not on the fight\'s glass (his vote: the phone is in the city view only)',
        MP && MP.corner ? ph === 'bohphone' : ph === 'fightFrame', 'at the phone\'s place: ' + ph);
      /* CREW, the settings and NOTES in the fight: the phone's apps (they press the bar's own buttons, off the glass); without the
         phone (an older build) there is no way to them in the fight, which rule 280 accepts for that build only */
      const app = (a) => p.evaluate((a) => { const e = document.querySelector('#bohphone.on .fight.on .frow .app[data-app=' + a + ']'); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, a);
      const press = async (a, sel) => { const at = ON ? await app(a) : null; if (at) { if (profile === 'computer') await p.mouse.click(at[0], at[1]); else await p.touchscreen.tap(at[0], at[1]); return true; }
        return f.evaluate((q) => { const e = document.querySelector(q); if (!e) return false; e.click(); return true; }, sel); };
      await press('crew', '#bmtb .t.crew'); await p.waitForTimeout(2000);
      const c = await f.evaluate(() => { const w = document.getElementById('crewdoor'); if (!w) return null; const r = w.getBoundingClientRect(), fe = w.querySelector('iframe'); return { rect: [r.x, r.y, r.width, r.height], src: fe ? fe.getAttribute('src') : '' }; });
      const V = p.viewportSize();
      ok('  CREW in the fight (the phone\'s) opens the same company screen, the whole glass', !!c && /ROSTER_SCREEN/.test(c.src) && c.rect[0] <= 0 && c.rect[1] <= 0 && c.rect[2] >= V.width && c.rect[3] >= V.height, c && (c.src + ' ' + fmt(c.rect)));
      await f.evaluate(() => { try { BohemiaCrewDoor.close(); } catch (_e) {} }); await p.waitForTimeout(500);
      await press('settings', '#bmtb .t.gear'); await p.waitForTimeout(800);
      const set = await p.evaluate(() => { const w = document.getElementById('setwrap'); if (!w) return null; const c = document.getElementById('setcard') || w, r = c.getBoundingClientRect(), h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        return { on: w.classList.contains('on'), top: !!h && w.contains(h) }; });
      ok('  SETTINGS in the fight (the phone\'s) opens the game\'s settings, over the fight', !!set && set.on && set.top, JSON.stringify(set));
      await p.evaluate(() => { const w = document.getElementById('setwrap'); if (w) w.classList.remove('on'); }); await p.waitForTimeout(300);
      const before = await p.evaluate(() => { try { return (JSON.parse(localStorage.getItem('bohemia.notes.v1') || '[]') || []).length; } catch (e) { return -1; } });
      await press('notes', '#bmtb #notebtn'); await p.waitForTimeout(500);
      const box = await f.evaluate(() => { const w = document.getElementById('notewrap'); if (!w) return null; const c = document.getElementById('notecard'), r = c.getBoundingClientRect(), h = document.elementFromPoint(r.x + r.width / 2, r.y + 20);
        return { on: w.classList.contains('on'), top: !!h && w.contains(h), styled: !!document.getElementById('notecss') }; });
      ok('  NOTES in the fight (the phone\'s) opens the notes, in the map\'s look, over the fight', !!box && box.on && box.top && box.styled, JSON.stringify(box));
      const fbx = await (await p.$('#fightFrame')).boundingBox();
      const ta = await f.evaluate(() => { const r = document.getElementById('notetext').getBoundingClientRect(); return [r.x + 20, r.y + 10]; });
      await p.mouse.click(fbx.x + ta[0], fbx.y + ta[1]); await p.keyboard.type('no bar in the fight'); await p.waitForTimeout(200);
      await f.evaluate(() => document.getElementById('notesave').click()); await p.waitForTimeout(1200);
      const after = await p.evaluate(() => { try { return JSON.parse(localStorage.getItem('bohemia.notes.v1') || '[]') || []; } catch (e) { return []; } });
      const last = after[after.length - 1] || {};
      const plates = { fight: await f.evaluate(() => document.getElementById('noteplate').textContent), map: await fr.evaluate(() => document.getElementById('noteplate').textContent) };
      ok('  a note saved in the fight is in the same notes as the map\'s, marked as the fight, and both NOTES count it',
        after.length === before + 1 && last.text === 'no bar in the fight' && last.ctx && last.ctx.mode === 'fight' && plates.fight === 'NOTES ' + after.length && plates.map === 'NOTES ' + after.length,
        before + ' -> ' + after.length + ', mode ' + (last.ctx && last.ctx.mode) + ', plates ' + JSON.stringify(plates));
      const shut = await f.evaluate(() => !document.getElementById('notewrap').classList.contains('on'));
      ok('  and SAVE closes the notes', shut);
      if (PLANT) {
        await f.evaluate(() => { const s = document.createElement('style'); s.id = 'plant'; s.textContent = 'html.bm-nobar body #top.bmhost#top{display:block!important}'; document.head.appendChild(s); });
        await p.waitForTimeout(300); const a = await FCHK(); await f.evaluate(() => document.getElementById('plant').remove());
        ok('PLANTED: the bar forced back across the fight\'s top is caught', !!a.rect.bar, fmt(a.rect.bar));
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
