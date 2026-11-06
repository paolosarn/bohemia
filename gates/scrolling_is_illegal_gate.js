/* ==========================================================================
   SCROLLING IS ILLEGAL  (UI 8, 11/6/26, rule 402, ask line 444)

   PAOLO 11/4: 'a lot of the UI is not intuitive enough... you want me to scroll, I never wanna scroll, scrolling is
   fucking illegal in my opinion... from the phone to the wide screen laptop, anything that's clickable I don't wanna
   scroll up and down anywhere ever again.'

   MEASURED BEFORE (the demo at 0019d67b, tools/bohemia_no_scroll.js, the phone upright / on its side / the laptop):
     the settings card     36 presses in a box that scrolled 820 of 1,282 (upright), 366 of 1,282 (on its side), 876 (laptop)
     the hall              10 presses in a sheet of 546 holding 2,286 (upright), 221 holding 2,058 (on its side)
     the smith, armourer   546 holding 1,047 and 1,063; 221 holding 1,218 on its side; 588 holding 990 on the laptop
     the stall, the board, the bar   221 holding 459, 236, 245 on its side
     the origins           15 cards in a strip that scrolled sideways, on all three
     the crew screen       the page ran 1.05 screens on its side; with the stranger's bag of forty, 1.31 upright, 1.71 on
                           its side, the bag itself a scrolling box of 40 presses
   NOW (slices/bohemia_ui_no_scroll.js): every one fits the glass; what does not fit is PAGES he taps (the strip's arrows,
   its numbers, a swipe across); the settings card is four tabs (SOUND, SCREEN, PLAY, GAME); the origins turn one card
   at a time; the crew's stash turns pages of whole rows. The phone's feed strip stepping a post line by line (rule 363)
   is not his scrolling and is never counted (it has nothing to press inside it).

   LEGS, on the demo with real presses, on the phone upright, the phone on its side, and the laptop:
     N1 the title and the new game's picks: nothing scrolls, nothing to press off the glass; the origins turn by the arrow
     N2 the town he starts in, at rest
     N3 *** EVERY BUILDING'S SHEET *** (all ten): nothing scrolls on any page; every page reached by the strip's next
        arrow; every thing to press that the sheet holds is on one of its pages
     N4 *** THE SETTINGS CARD *** each of the four tabs (and each of its pages): nothing scrolls, every row on a tab
     N5 the crew screen through the phone's CREW
     N6 the crew screen on the stranger's state with a bag of FORTY (the company screen's own host): nothing scrolls with
        the level waiting man picked; every piece in the bag on one of the stash's pages
     N7 the fight's page alone
     OWED (printed, not counted): the end of the fight (RUN FIVE's spoils screen, being drawn whole this round), measured
        1.83 screens upright and 1.85 on its side
     M  *** THE CHECKER BITES *** (the phone upright): the pager switched off (BohemiaNoScroll.off) puts the hall's sheet
        back to scrolling and the sweep says so; a planted box with a button that scrolls, a page made taller than the
        glass, and a button standing below a locked edge are each caught
     Z  nothing threw
   node gates/scrolling_is_illegal_gate.js [--only phone_portrait]
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const NS = require(path.join(ROOT, 'tools/bohemia_no_scroll.js'));
const T = require(path.join(ROOT, 'tools/bohemia_ui_company_screen_count.js'));
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('SCROLLING IS ILLEGAL: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i > 0 ? process.argv[i + 1] : null; })();
const PROFS = ['phone_portrait', 'phone_landscape', 'computer'].filter(p => !ONLY || p === ONLY);
const say = c => c.length ? c.slice(0, 2).map(NS.line).join(' || ') : 'none';
const crimesOn = async (page) => NS.crimes(await NS.sweepAll(page));

async function press(P, prof, x, y) { if (prof === 'computer') await P.mouse.click(x, y); else await P.touchscreen.tap(x, y); }
/* a box's pages, every one: the crimes on each, and every press seen on any page */
async function everyPage(P, frame, prof, boxSel) {
  const seen = new Set(), bad = [];
  const st0 = await frame.evaluate(s => { const b = document.querySelector(s); return b && window.BohemiaNoScroll ? BohemiaNoScroll.state(b) : null; }, boxSel);
  const n = st0 ? Math.max(1, st0.pages) : 1;
  const file = frame.url().split('/').pop().split('?')[0];
  for (let i = 0; i < n; i++) {
    const rows = await NS.sweepAll(P), c = NS.crimes(rows); if (c.length) bad.push('page ' + (i + 1) + ': ' + say(c));
    /* a frame that is not on his glass is not a pass: the sweep must have seen it */
    if (!rows.some(r => r.url === file)) bad.push('page ' + (i + 1) + ': ' + file + ' was not on the glass (swept ' + rows.map(r => r.url).join(' ') + ')');
    (await frame.evaluate(s => { const b = document.querySelector(s); if (!b) return [];
      return [...b.querySelectorAll('button,[role=button],.slot,.act,input')].filter(e => !e.matches('.slot:not(.full)')).filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
        .map(e => (e.getAttribute('aria-label') || e.textContent || e.className || '').replace(/\s+/g, ' ').trim().slice(0, 40) + '#' + [...e.parentNode.children].indexOf(e)); }, boxSel)).forEach(k => seen.add(k));
    if (i < n - 1) {
      const nx = await frame.evaluate(s => { const b = document.querySelector(s); const bar = b && (b.querySelector(':scope > .ns-bar') || (b.nextElementSibling && b.nextElementSibling.classList.contains('ns-bar') ? b.nextElementSibling : null));
        const q = bar && bar.querySelector('.ns-next'); if (!q) return null; const r = q.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, boxSel);
      if (!nx) { bad.push('no next arrow on page ' + (i + 1)); break; }
      const fb = frame.parentFrame() ? await (await frame.frameElement()).boundingBox() : { x: 0, y: 0 };
      await press(P, prof, fb.x + nx.x, fb.y + nx.y); await P.waitForTimeout(450);
      const at = await frame.evaluate(s => BohemiaNoScroll.state(document.querySelector(s)).at, boxSel);
      if (at !== i + 1) { bad.push('the next arrow did not turn page ' + (i + 1) + ' (at ' + at + ')'); break; }
    }
  }
  /* every press the box holds, shown all at once with the pager off, must have been on some page */
  await frame.evaluate(() => BohemiaNoScroll.off(true)); await P.waitForTimeout(300);
  const all = await frame.evaluate(s => { const b = document.querySelector(s); if (!b) return [];
    return [...b.querySelectorAll('button,[role=button],.slot,.act,input')].filter(e => !e.matches('.slot:not(.full)')).filter(e => !e.closest('.ns-bar') && !e.closest('.ns-taboff')).filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
      .map(e => (e.getAttribute('aria-label') || e.textContent || e.className || '').replace(/\s+/g, ' ').trim().slice(0, 40) + '#' + [...e.parentNode.children].indexOf(e)); }, boxSel);
  await frame.evaluate(() => BohemiaNoScroll.off(false)); await P.waitForTimeout(400);
  const missed = all.filter(k => !seen.has(k));
  return { pages: n, bad, missed, all: all.length };
}

async function demoLegs(prof) {
  console.log('-- ' + prof);
  let t1 = null, t1b = null;
  const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => {
    for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
    await pg.waitForTimeout(1500);
    t1 = await crimesOn(pg);
    await throughTheTitle(pg); await pg.waitForTimeout(1500);
    const before = await pg.evaluate(() => { const s = document.getElementById('newcostrip'); return s ? { on: (s.querySelector('.org.on') || {}).dataset ? s.querySelector('.org.on').getAttribute('data-v') : null, ov: getComputedStyle(s).overflowX } : null; });
    const nx = await pg.evaluate(() => { const b = document.querySelector('#newco .cbxnext'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (nx) { await press(pg, prof, nx.x, nx.y); await pg.waitForTimeout(900); }
    const after = await pg.evaluate(() => { const s = document.getElementById('newcostrip'); return s ? (s.querySelector('.org.on') || { getAttribute: () => null }).getAttribute('data-v') : null; });
    t1b = { crimes: await crimesOn(pg), before, after };
    if (nx) { const pv = await pg.evaluate(() => { const b = document.querySelector('#newco .cbxprev'); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }); await press(pg, prof, pv.x, pv.y); await pg.waitForTimeout(700); }
  } });
  const P = d.page;
  try {
    ok('N1 ' + prof + ' the title and the picks: nothing scrolls (title ' + say(t1 || []) + '; picks ' + say(t1b.crimes) + '); the origins locked (' + (t1b.before && t1b.before.ov) + ') and the arrow turned ' + (t1b.before && t1b.before.on) + ' -> ' + t1b.after,
      !!t1 && !t1.length && !t1b.crimes.length && !!t1b.before && /hidden|clip/.test(t1b.before.ov) && !!t1b.after && t1b.after !== t1b.before.on);
    await P.waitForTimeout(3000); await d.clearCards().catch(() => {}); await P.waitForTimeout(1500);
    const c2 = await crimesOn(P);
    ok('N2 ' + prof + ' where the game starts (the map, or the town on an older cut), at rest: nothing scrolls', !c2.length, say(c2));
    /* N3 every building */
    /* the town he stands in (the map's own door when the crew screen took him off it) */
    /* a town ON THE GLASS (the town's frame waits invisible over the map between visits: a tap there is no town of his) */
    const townUp = async () => { for (const x of P.frames().filter(f => /SETTLEMENT_SCREEN/.test(f.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp && !document.getElementById('arrive'); } catch (e) { return false; } }).catch(() => false) && await NS.frameShown(x)) return x; return null; };
    let stuck = false, sf = await townUp();
    if (!sf) { await d.fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs).find(k => /church/i.test(k)) || Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }).catch(() => {});
      for (let i = 0; i < 60 && !sf; i++) { await P.waitForTimeout(400); sf = await townUp();
        /* 11/6 MAIN'S OWN BUG, NAMED (not this gate's to fix): the town's frame stays at opacity 0 after its door (the map's camp
           fade-in, btwCampIn, never finishes); after 6 s the game's own rest (btwFrameRest) is called and the leg says so */
        if (!sf && i === 15) { stuck = true; await d.fr.evaluate(() => { try { btwFrameRest(); } catch (e) {} }).catch(() => {}); } }
      await P.waitForTimeout(1200); }
    const keys = sf ? await sf.evaluate(() => BohemiaSettlement.order()) : [];
    const s3 = [];
    for (const k of keys) {
      await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(500);
      let opened = null;
      for (let i = 0; i < 3 && opened !== k; i++) { const w = await sf.evaluate(k => BohemiaSettlement.where(k), k), fb = await (await sf.frameElement()).boundingBox();
        if (w) await press(P, prof, fb.x + w.x, fb.y + w.y); await P.waitForTimeout(1600); opened = await sf.evaluate(() => BohemiaSettlement.state.open); }
      await P.waitForTimeout(700);
      if (opened !== k) { s3.push({ k, bad: ['did not open'], missed: [], pages: 0 }); continue; }
      s3.push(Object.assign({ k }, await everyPage(P, sf, prof, '#sheet')));
    }
    await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }).catch(() => {});
    const bad3 = s3.filter(x => x.bad.length || x.missed.length);
    ok('N3 ' + prof + ' *** EVERY BUILDING\'S SHEET *** ' + (stuck ? '(the town needed the game\'s own rest to show: main\'s fade bug) ' : '') + '(' + s3.map(x => x.k + ' ' + x.pages).join(', ') + '): nothing scrolls on any page, every press on a page'
      + (bad3.length ? '; ' + bad3.slice(0, 2).map(x => x.k + ': ' + (x.bad[0] || 'missed ' + x.missed.slice(0, 2).join(', '))).join(' | ') : ''),
      keys.length >= 8 && !bad3.length);
    /* M: the checker bites (upright only) */
    if (prof === 'phone_portrait' && sf) {
      let hallUp = null;
      for (let i = 0; i < 4 && hallUp !== 'hall'; i++) { const w = await sf.evaluate(() => BohemiaSettlement.where('hall')), fb = await (await sf.frameElement()).boundingBox();
        if (w) await press(P, prof, fb.x + w.x, fb.y + w.y); await P.waitForTimeout(1800); hallUp = await sf.evaluate(() => BohemiaSettlement.state.open); }
      await P.waitForTimeout(800);
      await sf.evaluate(() => BohemiaNoScroll.off(true)); await P.waitForTimeout(500);
      const m1 = await crimesOn(P);
      await sf.evaluate(() => BohemiaNoScroll.off(false)); await P.waitForTimeout(500);
      const m1b = await crimesOn(P);
      await P.evaluate(() => { const d = document.createElement('div'); d.id = 'ns-plant'; d.style.cssText = 'position:fixed;left:10px;top:120px;width:160px;height:90px;overflow:auto;z-index:2147483000;background:#000';
        d.innerHTML = '<div style="height:400px"><button style="width:80px;height:44px">PLANT</button></div>'; document.body.appendChild(d); });
      const m2 = await crimesOn(P); await P.evaluate(() => document.getElementById('ns-plant').remove());
      await sf.evaluate(() => { document.documentElement.style.setProperty('overflow', 'auto', 'important'); document.body.style.setProperty('overflow', 'visible', 'important'); const d = document.createElement('div'); d.id = 'ns-tall'; d.style.cssText = 'height:3000px;width:10px'; document.body.appendChild(d); });
      const m3 = await crimesOn(P);
      await sf.evaluate(() => { document.getElementById('ns-tall').remove(); document.documentElement.style.removeProperty('overflow'); document.body.style.removeProperty('overflow'); });
      await P.evaluate(() => { const d = document.createElement('div'); d.id = 'ns-cut'; d.style.cssText = 'position:fixed;left:10px;top:120px;width:160px;height:60px;overflow:hidden;z-index:2147483000';
        d.innerHTML = '<div style="height:60px"></div><button style="width:80px;height:44px">BELOW</button>'; document.body.appendChild(d); });
      const m4 = await crimesOn(P); await P.evaluate(() => document.getElementById('ns-cut').remove());
      const has = (c, what, re) => c.some(x => x.what === what && re.test(NS.line(x)));
      ok('M *** THE CHECKER BITES *** the hall (' + hallUp + ') with the pager off scrolls again (' + say(m1) + '), on again: clean (' + m1b.length + '); a planted scrolling box with a button (' + m2.length + '), a page taller than the glass (' + m3.length + '), a button below a locked edge (' + m4.length + ') each caught',
        hallUp === 'hall' && has(m1, 'box', /#sheet/) && !m1b.length && has(m2, 'box', /ns-plant/) && has(m3, 'page', /SETTLEMENT/) && has(m4, 'off', /BELOW/));
    }
    /* N4 THE SETTINGS CARD, each tab */
    await P.evaluate(() => { const b = document.querySelector('#bohphone .app[data-app=settings]'); if (b) b.click(); else if (window.BohemiaSettings) BohemiaSettings.open(); }); await P.waitForTimeout(1500);
    const tabs = await P.evaluate(() => [...document.querySelectorAll('#setcard .ns-tabs [data-tab]')].map(b => b.textContent));
    const s4 = [];
    for (let t = 0; t < tabs.length; t++) {
      const b = await P.evaluate(t => { const e = document.querySelector('#setcard .ns-tabs [data-tab="' + t + '"]'); const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, t);
      await press(P, prof, b.x, b.y); await P.waitForTimeout(600);
      s4.push(Object.assign({ tab: tabs[t] }, await everyPage(P, P.mainFrame(), prof, '#setcard')));
    }
    const rowsAll = await P.evaluate(() => [...document.querySelectorAll('#setcard > *')].filter(r => !r.matches('.seth, .ns-tabs, .ns-bar, #setclose')).length);
    const rowsTabbed = await P.evaluate(() => { const T = BohemiaNoScroll.TABS.length, seen = new Set(); for (let t = 0; t < T; t++) { BohemiaNoScroll.settingsTab(t); [...document.querySelectorAll('#setcard > *')].forEach((r, i) => { if (!r.classList.contains('ns-taboff') && !r.matches('.seth, .ns-tabs, .ns-bar, #setclose')) seen.add(i); }); } BohemiaNoScroll.settingsTab(0); return seen.size; });
    ok('N4 ' + prof + ' *** THE SETTINGS CARD *** ' + tabs.join(', ') + ': ' + s4.map(x => x.tab + ' ' + x.pages + (x.pages > 1 ? ' pages' : ' page')).join(', ') + '; nothing scrolls on any (' + (s4.flatMap(x => x.bad).slice(0, 2).join(' | ') || 'none') + '), every press on a page (missed ' + s4.reduce((a, x) => a + x.missed.length, 0) + '), ' + rowsTabbed + ' of ' + rowsAll + ' rows on a tab',
      tabs.length === 4 && s4.every(x => !x.bad.length && !x.missed.length) && rowsTabbed === rowsAll);
    await P.evaluate(() => { const c = document.getElementById('setclose'); if (c) c.click(); }); await P.waitForTimeout(900);
    /* N5 the crew screen through the phone */
    const crew = await P.evaluate(() => { const b = document.querySelector('#bohphone .app[data-app=crew]'); if (b) { b.click(); return true; } return false; });
    await P.waitForTimeout(4500);
    const c5 = await crimesOn(P), rosterUp = P.frames().some(f => /ROSTER_SCREEN/.test(f.url()));
    ok('N5 ' + prof + ' the crew screen through the phone\'s CREW: nothing scrolls', crew && rosterUp && !c5.length, say(c5));
    await P.evaluate(() => { try { if (window.BohemiaCrewDoor) BohemiaCrewDoor.close(); } catch (e) {} }); await P.waitForTimeout(1500);
    ok('Z ' + prof + ' nothing threw', !d.errs.length, d.errs.slice(0, 2).join(' | ') || 'none');
  } catch (e) { ok(prof + ' ran to the end', false, String(e.stack).slice(0, 300)); }
  await d.close();
}

async function aloneLegs() {
  const srv = await T.serve(8941); const b = await chromium.launch();
  const PV = { phone_portrait: T.PROFILES.phone, phone_landscape: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, computer: T.PROFILES.computer };
  const big = T.STASH.concat(T.STASH, T.STASH, T.STASH);
  try {
    for (const k of PROFS) {
      const ctx = await b.newContext(PV[k]), page = await ctx.newPage();
      const fr = await T.openCrew(page, 8941, { stash: big });
      await fr.evaluate(() => { const S = BohemiaRosterScreen.state, i = S.crew.findIndex(m => m.name === 'BOOKIE'); const el = document.querySelector('[data-man="' + i + '"]'); if (el) el.click(); });
      await page.waitForTimeout(1200);
      const r = await everyPage(page, fr, k, '#bag');
      const pieces = r.all;
      ok('N6 ' + k + ' the crew screen, a bag of forty, BOOKIE (a level waiting) picked: nothing scrolls on any of the stash\'s ' + r.pages + ' pages, all ' + pieces + ' places in the bag reached (missed ' + r.missed.length + ')',
        !r.bad.length && !r.missed.length && pieces >= 40, r.bad.slice(0, 2).join(' | ') || undefined);
      await ctx.close();
      const ctx2 = await b.newContext(PV[k]), p2 = await ctx2.newPage();
      await p2.goto('http://127.0.0.1:8941/slices/BOHEMIA_FIGHT.html', { waitUntil: 'load', timeout: 60000 }).catch(() => {}); await p2.waitForTimeout(6000);
      const c7 = await crimesOn(p2);
      ok('N7 ' + k + ' the fight\'s page alone: nothing scrolls', !c7.length, say(c7));
      await p2.goto('http://127.0.0.1:8941/slices/BOHEMIA_SPOILS_SCREEN.html', { waitUntil: 'load', timeout: 60000 }).catch(() => {}); await p2.waitForTimeout(5000);
      const c8 = await crimesOn(p2);
      console.log('  OWED ' + k + ' the end of the fight (RUN FIVE\'s spoils screen, being drawn whole this round; not counted): ' + (c8.length ? say(c8) : 'nothing scrolls'));
      await ctx2.close();
    }
  } finally { await b.close(); srv.close(); }
}

(async () => {
  try { await aloneLegs(); } catch (e) { ok('the crew and fight pages', false, String(e.stack).slice(0, 300)); }
  for (const p of PROFS) await demoLegs(p);
  done();
})();
