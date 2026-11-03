/* THE TOP IS ONLY RESOURCES  (UI 7, rule 368, 11/3/26)

   PAOLO 11/3: 'The sun in the top left corner. I hate the time... and then your location settlement for example and the button at
   the top of the screen, I don't like that we have two crew visuals... the phone doesn't need to be at the top. The only thing that
   really should be at the top of the screen, UI wise, is the resources to be honest. Do you wanna look at the time? Look at your
   phone. If you wanna look at the crew, look at your phone.'

   MEASURED BEFORE (the demo at a5e7eaa6, 390 x 844; records/target/coordinator_11_3/top_bar_now.png): the top band was 108 points
   and carried four things: the DAY plate with the sun's arc, the crew plate (his face, 3/20, the blood ticks), the place's name and
   the resources' pane. The phone already said the place on its first line and had a CREW: two crew buttons on one glass.

   On the DEMO, through the one driver, his phone upright (390 x 844) and on its side (844 x 390), with a finger:
     B  ON THE MAP, IN A TOWN, AT CAMP, AND ON THE FIGHT'S SCREENS (during the fight and the end screen after it):
        B1 everything drawn in the top band is a resource count (an icon and its number in the resources' pane); nothing else
        B2 no DAY, no hour, no sun's dial, no crew face, no head count and no place's name in the band
        B3 the band is slim: under 72 points (it was 108 upright)
        B4 nothing of any screen lies over the band (what the glass shows across it is the band)
        IN THE FIGHT nothing is across the top at all (rule 280 stands); the end screen's band is the resources only
     P  THE PHONE CARRIES WHAT LEFT THE TOP:
        P1 its first line says the game's own day and hour, read the same moment (DAY n  hh:mm) on the map, in a town and at camp
        P2 its first line says the place whole (a town's name, the camp), no letter cut
        P3 the day and the hour are on the phone once (never a second clock on its face)
     C  ONE BUTTON FOR ONE THING:
        C1 on the glass exactly one press opens the company: the phone's CREW (the bar's crew plate and the town's own CREW are off it)
        C2 a finger on the phone's CREW opens the company screen
        C3 the phone's CREW can never be hidden from its settings (it is the one door now)
   PLANTED (upright): the day plate forced back on the band (B1, B2 catch it); a second clock on the phone's face (P3 catches it);
   the bar's crew plate back on the glass (C1 catches two crew buttons).
   node gates/the_top_is_only_resources_gate.js */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const SLIM = 72;

/* the band, read in the page that wears it */
const BAND = (place) => {
  const root = document.getElementById('bmtb'); if (!root) return { on: false };
  const host = root.parentElement, hr = host.getBoundingClientRect();
  const drawn = e => { const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false;
    for (let q = e; q && q !== document.documentElement; q = q.parentElement) { const cs = getComputedStyle(q); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) return false; } return true; };
  const leaves = [...root.querySelectorAll('*')].filter(e => (e.tagName === 'IMG' || (e.childElementCount === 0 && e.textContent.trim())) && drawn(e));
  const stray = leaves.filter(e => !e.closest('[data-tb=g] .s.six, [data-tb=g] .s.days'));
  const words = leaves.map(e => e.tagName === 'IMG' ? '[' + (e.getAttribute('alt') || 'picture') + ']' : e.textContent.trim());
  const res = [...root.querySelectorAll('[data-tb=g] .s.six')].filter(drawn).map(e => e.dataset.f);
  const said = words.join(' ');
  const bad = [];
  if (/\bDAY\b/.test(said)) bad.push('DAY'); if (/\b\d{1,2}:\d{2}\b/.test(said)) bad.push('an hour'); if (/\b\d+\s*\/\s*\d+\b/.test(said)) bad.push('a head count');
  if (/\[(YOUR COMPANY|CREW)\]/.test(said)) bad.push('the crew'); if (place && said.toUpperCase().indexOf(String(place).toUpperCase()) >= 0) bad.push('the place ' + place);
  if (leaves.some(e => e.tagName === 'IMG' && /^data:/.test(e.getAttribute('src') || '') && e.closest('[data-f=day]'))) bad.push('the sun\'s dial');
  /* over the band: what the glass shows across it, from this page down */
  let over = 0, pts = 0; for (let x = hr.left + 6; x < hr.right - 2; x += 24) for (let y = hr.top + 4; y < hr.bottom - 2; y += 10) { pts++; const e = document.elementFromPoint(x, y); if (!e || !e.closest('.bmhost')) over++; }
  return { on: drawn(root), h: Math.round(hr.height), top: Math.round(hr.top), stray: stray.map(e => e.tagName === 'IMG' ? '[' + (e.getAttribute('alt') || 'picture') + ']' : e.textContent.trim()).slice(0, 6), words: said, res, bad, over, pts };
};
/* the phone's first line and what its face says (drawn things only) */
const PHONE = () => {
  const e = document.getElementById('bohphone'); if (!e || !e.classList.contains('on')) return null;
  const drawn = x => { const r = x.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; for (let q = x; q && q !== e.parentElement; q = q.parentElement) { const cs = getComputedStyle(q); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) return false; } return true; };
  const wh = e.querySelector('.stat .wh'), dt = e.querySelector('.stat .dt');
  const own = [...e.querySelectorAll('.stat *, .home .bpctx *, .home .bptwo *, .home .bprow *')].filter(x => x.childElementCount === 0 && drawn(x)).map(x => x.textContent.trim()).filter(Boolean).join(' ');
  return { dt: dt && drawn(dt) ? dt.textContent : null, wh: wh && drawn(wh) ? wh.textContent.trim() : null, whole: !!wh && wh.scrollWidth <= wh.clientWidth + 0.5,
    hours: (own.match(/\b\d{1,2}:\d{2}\b/g) || []).length, days: (own.match(/\bDAY\b/g) || []).length, own };
};
/* every press on the glass that opens the company, hit-tested through the frames (what a finger would land on) */
const CREWS = () => {
  const out = [];
  const hit = (x, y) => { let e = document.elementFromPoint(x, y), X = x, Y = y;
    while (e && e.tagName === 'IFRAME') { const q = e.getBoundingClientRect(); X -= q.left; Y -= q.top; let e2 = null; try { e2 = e.contentDocument.elementFromPoint(X, Y); } catch (_e) {} if (!e2) break; e = e2; } return e; };
  const frames = (w, acc) => { acc.push(w); try { [...w.document.querySelectorAll('iframe')].forEach(f => { try { if (f.contentWindow && f.contentWindow.document) frames(f.contentWindow, acc); } catch (_e) {} }); } catch (_e) {} return acc; };
  frames(window, []).forEach(w => { let ox = 0, oy = 0; try { for (let v = w; v.frameElement; v = v.parent) { const r = v.frameElement.getBoundingClientRect(); ox += r.left; oy += r.top; } } catch (_e) {}
    const d = w.document;
    [['#bohphone.on .bprow .app[data-app=crew]', 'the phone\'s CREW'], ['#bmtb .t.crew', 'the bar\'s crew plate'], ['body:has(#sbody) #crew', 'the town\'s CREW']].forEach(([sel, name]) => {
      [...d.querySelectorAll(sel)].forEach(b => { const r = b.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return; const cs = w.getComputedStyle(b); if (cs.display === 'none' || cs.visibility === 'hidden') return;
        const h = hit(ox + r.left + r.width / 2, oy + r.top + r.height / 2); if (h && (h === b || b.contains(h))) out.push(name); }); }); });
  return out;
};
const pad = n => (n < 10 ? '0' : '') + n;

async function side(profile) {
  console.log('\n' + profile);
  let d;
  try { d = await open({ profile, door: 120000, engage: true }); } catch (e) { ok('the demo opened', false, String(e.message).slice(0, 120)); return; }
  const p = d.page, fr = d.fr, PLANT = profile === 'phone_portrait';
  const clock = () => fr.evaluate(() => ({ day: T.day, min: T.min }));
  const phoneSays = async (tag, place) => {
    const c = await clock(), want = 'DAY ' + c.day + '  ' + pad((c.min / 60) | 0) + ':' + pad(Math.floor(c.min % 60));
    await p.waitForTimeout(250);
    const P = await p.evaluate('(' + PHONE + ')()'), c2 = await clock(), want2 = 'DAY ' + c2.day + '  ' + pad((c2.min / 60) | 0) + ':' + pad(Math.floor(c2.min % 60));
    if (!P) { ok(tag + ' P the phone is up', false); return; }
    ok(tag + ' P1 the phone\'s first line says the game\'s day and hour', P.dt === want || P.dt === want2, JSON.stringify(P.dt) + ' vs ' + JSON.stringify(want));
    if (place !== undefined) ok(tag + ' P2 the phone\'s first line says the place whole', !!P.wh && (place === null || P.wh === place) && P.whole, JSON.stringify(P.wh) + (place ? ' vs ' + place : '') + (P.whole ? ', whole' : ', CUT'));
    ok(tag + ' P3 the day and the hour on the phone once', P.days === 1 && P.hours === 1, P.days + ' DAY, ' + P.hours + ' hour(s): ' + P.own.slice(0, 80));
  };
  const band = async (tag, frame, place) => {
    const B = await frame.evaluate('(' + BAND + ')(' + JSON.stringify(place || null) + ')');
    if (!B.on) { ok(tag + ' the band is on the glass', false); return B; }
    ok(tag + ' B1 everything in the top band is a resource count', B.stray.length === 0 && B.res.indexOf('batteries') === 0, 'resources ' + B.res.join(' ') + (B.stray.length ? '; ALSO ' + B.stray.join(' | ') : ''));
    ok(tag + ' B2 no day, hour, sun, crew, head count or place in the band', B.bad.length === 0, B.bad.length ? B.bad.join(', ') : B.words.slice(0, 60));
    ok(tag + ' B3 the band is slim (under ' + SLIM + ' points; it was 108)', B.h < SLIM, B.h + ' points');
    ok(tag + ' B4 nothing lies over the band', B.over === 0, B.over + ' of ' + B.pts + ' points under something else');
    return B;
  };
  const crews = async (tag, open_) => {
    const C = await p.evaluate('(' + CREWS + ')()');
    ok(tag + ' C1 one press on the glass opens the company: the phone\'s CREW', C.length === 1 && C[0] === 'the phone\'s CREW', C.join(', ') || 'none');
    if (!open_) return;
    const at = await p.evaluate(() => { const b = document.querySelector('#bohphone.on .bprow .app[data-app=crew]'); if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    if (at) await p.touchscreen.tap(at[0], at[1]);
    let up = false; for (let i = 0; i < 30 && !(up = p.frames().some(f => /ROSTER_SCREEN/.test(f.url()))); i++) await p.waitForTimeout(200);
    ok(tag + ' C2 a finger on the phone\'s CREW opens the company screen', !!at && up, at ? (up ? 'opened' : 'nothing opened') : 'no CREW');
    for (const f of p.frames()) await f.evaluate(() => { try { if (window.BohemiaCrewDoor && BohemiaCrewDoor.isOpen()) BohemiaCrewDoor.close(); } catch (_e) {} }).catch(() => {});
    await p.waitForTimeout(900);
  };
  try {
    for (let i = 0; i < 40 && !(await fr.evaluate(() => !!document.getElementById('bmtb'))); i++) await p.waitForTimeout(250);
    await fr.evaluate(() => document.fonts.ready); await p.waitForTimeout(2500);
    /* the demo opens in a town: THE TOWN */
    const sfr = () => p.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url()));
    const townName = async () => { const s = sfr(); return s ? s.evaluate(() => { const n = document.getElementById('pname'); return n ? String(n.textContent || '').trim().toUpperCase() : null; }).catch(() => null) : null; };
    let inTown = await fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display !== 'none'; });
    if (!inTown) { await fr.evaluate(() => { const t = loopTownAt(city.x, city.y, 30); if (t) loopOpenTown(t); }); await p.waitForTimeout(7000);
      inTown = await fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display !== 'none'; }); }
    if (inTown) {
      const tn = await townName();
      await band('TOWN', fr, tn); await phoneSays('TOWN', tn); await crews('TOWN', true);
      if (PLANT) {
        await fr.evaluate(() => { const s = document.createElement('style'); s.id = 'plant'; s.textContent = 'html.boh-phone-on body #bmtb .r1.r1{display:flex!important} html body #bmtb .t.day.day{display:inline-flex!important}'; document.head.appendChild(s); });
        await p.waitForTimeout(400); const pb = await fr.evaluate('(' + BAND + ')(null)'); await fr.evaluate(() => document.getElementById('plant').remove());
        ok('PLANTED: the day plate back on the band is caught (B1, B2)', pb.stray.length > 0 && pb.bad.indexOf('DAY') >= 0, pb.stray.join(' | ') + '; ' + pb.bad.join(', '));
        await fr.evaluate(() => { const s = document.createElement('style'); s.id = 'plant'; s.textContent = 'html.boh-phone-on body #bmtb .r1.r1{display:flex!important} html.boh-phone-on body #bmtb .t.crew.crew{display:inline-flex!important;pointer-events:auto!important}'; document.head.appendChild(s); });
        await p.waitForTimeout(400); const pc = await p.evaluate('(' + CREWS + ')()'); await fr.evaluate(() => document.getElementById('plant').remove());
        ok('PLANTED: the bar\'s crew plate back on the glass is caught (C1: two crew buttons)', pc.length >= 2, pc.join(', '));
        await p.evaluate(() => { const b = document.querySelector('#bohphone .bprow'); const x = document.createElement('span'); x.id = 'plantclk'; x.textContent = '14:05'; x.style.cssText = 'position:absolute;left:4px;top:-10px;font-size:8px;color:#fff'; b.appendChild(x); });
        await p.waitForTimeout(100); const pp = await p.evaluate('(' + PHONE + ')()'); await p.evaluate(() => document.getElementById('plantclk').remove());
        ok('PLANTED: a second clock on the phone\'s face is caught (P3)', pp && pp.hours >= 2, pp && pp.hours + ' hours');
      }
      const s = sfr(); if (s) await s.evaluate(() => { const b = document.getElementById('leave'); if (b) b.click(); }).catch(() => {});
      for (let i = 0; i < 40 && await fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display !== 'none'; }); i++) await p.waitForTimeout(250);
      await p.waitForTimeout(2000);
    } else ok('a town to stand in', false);
    /* THE MAP */
    const M = await band('MAP', fr, null);
    await phoneSays('MAP'); await crews('MAP', true);
    const fill = await fr.evaluate(() => { const cv = document.querySelector('#stage canvas') || document.querySelector('canvas'), r = cv.getBoundingClientRect(); return { bottom: Math.round(r.bottom), H: innerHeight }; });
    ok('MAP the map fills the glass under the slimmer band (no strip left at the foot)', fill.bottom >= fill.H - 1, 'the map\'s picture ends at ' + fill.bottom + ' of ' + fill.H);
    /* AT CAMP */
    await fr.evaluate(() => { try { BohemiaMapCamp.toggle(); } catch (_e) {} }); await p.waitForTimeout(6000);
    const campOn = await fr.evaluate(() => { try { return !!BohemiaMapCamp.on(); } catch (_e) { return false; } });
    if (campOn) { await band('CAMP', fr, null); await phoneSays('CAMP', null); await crews('CAMP', false); await fr.evaluate(() => { try { BohemiaMapCamp.toggle(); } catch (_e) {} }); await p.waitForTimeout(4000); }
    else ok('CAMP camp made on the map', false);
    /* THE FIGHT, and the screen after it */
    await fr.evaluate(async () => { for (let i = 0; i < 40 && typeof FZOOMING !== 'undefined' && FZOOMING; i++) await new Promise(r => setTimeout(r, 250)); try { stepOnce(0); stepOnce(4); } catch (_e) {} });
    await p.waitForTimeout(1000);
    await fr.evaluate(() => roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 61 }));
    let f = null;
    for (let i = 0; i < 150; i++) { const h = await p.$('#fightFrame'); if (h) { f = await h.contentFrame();
      if (f && await f.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !FIGHT.S.over && typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board).catch(() => false)) break; } f = null; await p.waitForTimeout(200); }
    if (f) {
      for (let i = 0; i < 40 && await p.evaluate(() => !!(window.NFC && NFC.state !== 'off')); i++) await p.waitForTimeout(250);
      await p.waitForTimeout(1500);
      const FB = await f.evaluate('(' + BAND + ')(null)');
      const top = await p.evaluate(() => { let n = 0; for (let x = 10; x < innerWidth; x += 30) { let e = document.elementFromPoint(x, 20), X = x, Y = 20;
        while (e && e.tagName === 'IFRAME') { const q = e.getBoundingClientRect(); X -= q.left; Y -= q.top; let e2 = null; try { e2 = e.contentDocument.elementFromPoint(X, Y); } catch (_e) {} if (!e2) break; e = e2; }
        if (e && e.closest && (e.closest('#bmtb') || e.closest('#top'))) n++; } return n; });
      ok('FIGHT nothing across the fight\'s top (rule 280 stands)', !FB.on && top === 0, 'band ' + (FB.on ? 'ON' : 'off') + ', bar hit ' + top + ' times across the top');
      await f.evaluate(() => { const S = FIGHT.S; S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; u.armB = 0; u.armH = 0; }); S.over = true; S.result = 'won'; showOver('won'); });
      const SF = () => p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
      for (let i = 0; i < 100 && !(SF() && await SF().evaluate(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened && !!document.getElementById('bmtb')).catch(() => false)); i++) await p.waitForTimeout(200);
      if (SF()) { await p.waitForTimeout(1500); await band('AFTER THE FIGHT', SF(), null);
        await SF().evaluate(() => document.getElementById('leave').click()).catch(() => {});
        for (let i = 0; i < 60 && await p.evaluate(() => !!document.getElementById('fightFrame') || !!(window.NFC && NFC.state !== 'off')); i++) await p.waitForTimeout(250);
        await p.waitForTimeout(800); }
      else ok('AFTER THE FIGHT the end screen opened', false);
    } else ok('FIGHT a road fight opened through the map\'s own door', false);
    /* C3: CREW is always on the phone */
    { const at = await p.evaluate(() => { const b = document.querySelector('#bohphone.on .bprow .app[data-app=settings]'); if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
      if (at) await p.touchscreen.tap(at[0], at[1]); else await p.evaluate(() => { try { window.BohemiaPhone.open('settings'); } catch (_e) {} }); }   /* the phone's own SETTINGS, by a finger */
    await p.waitForTimeout(700);
    const row = await p.evaluate(() => { const box = document.getElementById('setphone'); if (!box) return null; const rows = [...box.querySelectorAll('.pa[data-a=crew]')];
      return rows.map(r => r.textContent.replace(/\s+/g, ' ').trim()).join(' | '); });
    ok('C3 the phone\'s CREW can never be hidden from its settings (it says ALWAYS)', !!row && /CREW/.test(row) && /ALWAYS/.test(row), row || 'no settings card');
    await p.evaluate(() => { const w = document.getElementById('setwrap'); if (w) w.classList.remove('on'); });
    ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  } finally { await d.close(); }
}

(async () => {
  const only = process.argv[2];
  for (const pr of ['phone_portrait', 'phone_landscape']) if (!only || only === pr) await side(pr);
  console.log('\nTHE TOP IS ONLY RESOURCES: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
