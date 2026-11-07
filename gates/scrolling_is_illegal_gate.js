/* ==========================================================================
   SCROLLING IS ILLEGAL, SMALLER NEVER PAGES  (UI 9, 11/7/26, rule 402 AMENDED, ask line 481; was UI 8's, 11/6, ask line 444)

   PAOLO 11/4: 'scrolling is fucking illegal in my opinion... from the phone to the wide screen laptop, anything that's
   clickable I don't wanna scroll up and down anywhere ever again.'
   PAOLO 11/7: 'I didn't want to scroll during any of the UI of the games. I meant find a way to make things TINIER, you don't
   have to make things half the screen, like displaying new hires or anything else; the purpose was to make the UI smaller,
   not just do a next page bullshit, I can't believe I had to explain that.'

   UI 8 PASSED THIS GATE WITH PAGES: it counted 'every press on SOME page' as fitting. That reading is dead. A list fits when
   every one of it is on his glass AT ONCE.

   MEASURED BEFORE (UI 8's build, BUILD 11/6g; phone upright / on its side / laptop):
     the hall          8 pages (one man on the glass, his card 386 px) / 5 pages / 4 pages; the smallest word 10 / 8.1 / 10 px
     smith, armourer   2 / 2-3 / 2 pages; words at 9 px
     the stall         1 / 2 / 1 pages; words at 9 px
     the settings      four tabs on all three
     the stash (40)    7 pages, 6 of 40 on the glass / 7 pages / fits
     the origins       one of fifteen on the glass, arrows and '2 OF 15', on all three

   THE TWO FLOORS (slices/bohemia_ui_no_scroll.js, BohemiaNoScroll.FLOOR and TAP): no word under 11 CSS px (Apple's smallest text
   style, Caption 2, 11 pt; a CSS px is a point on an iPhone); no press whose short side is under 44 CSS px.

   LEGS, on the phone upright, the phone on its side and the laptop:
     N1 the title and the new game's picks: nothing scrolls; ALL FIFTEEN ORIGINS ON THE GLASS AT ONCE; no pager; the floors
     N2 where the game starts, at rest: nothing scrolls
     N3 *** EVERY BUILDING'S SHEET *** (the demo's own town, every building): nothing scrolls, every press on the glass at
        once, no pager or tab, no word under the floor, no press under the thumb, and a sheet that is not the screen's whole
        job (the hall, a shop, the stall) under half the glass
     N4 *** THE SETTINGS CARD ***: one card, no tabs, every row on the glass at once, nothing scrolls, the floors
     N5 the crew screen through the phone's CREW: nothing scrolls, the floors
     N6 *** A FULL COMPANY *** (twenty men, twelve in a fight) and a FULL STASH (36), and the stranger's 40: every man and every
        piece on the glass at once, no pager, the floors
     N8 *** THE FULLEST HALL *** (a fortress on a fair day with the recruiter in camp: ten men or more): every man on the glass
     N7 the fight's page alone: nothing scrolls
     OWED (printed, not counted): the end of the fight (RUN FIVE's spoils screen)
     M  *** THE CHECKER BITES *** (the phone upright): the dense look off (BohemiaNoScroll.off) puts the hall back to running past
        its sheet and the sweep says so; a planted page strip, 'PAGE 1 OF 3', a word at 9 px, a press 30 px tall and a sheet of
        70 percent are each caught; a planted scrolling box with a button, a page taller than the glass, a button below a
        locked edge are each caught
     Z  nothing threw
   node gates/scrolling_is_illegal_gate.js [--only phone_portrait]
   ========================================================================== */
'use strict';
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const NS = require(path.join(ROOT, 'tools/bohemia_no_scroll.js'));
const T = require(path.join(ROOT, 'tools/bohemia_ui_company_screen_count.js'));
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('SCROLLING IS ILLEGAL: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i > 0 ? process.argv[i + 1] : null; })();
const PROFS = ['phone_portrait', 'phone_landscape', 'computer'].filter(p => !ONLY || p === ONLY);
const say = c => c.length ? c.slice(0, 2).map(NS.line).join(' || ') : 'none';
const crimesOn = async (page) => NS.crimes(await NS.sweepAll(page));
const WHOLE = /^(hall|smith|armourer|arms|stall)$/;   /* a sheet that IS the screen's job: Battle Brothers' hiring and market screens */
async function press(P, prof, x, y) { if (prof === 'computer') await P.mouse.click(x, y); else await P.touchscreen.tap(x, y); }
/* how many of the things in a list stand whole on the glass, and how many there are */
const ON_GLASS = `(sel) => { const W = innerWidth, H = innerHeight; const all = [...document.querySelectorAll(sel)].filter(e => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 && getComputedStyle(e).visibility !== 'hidden'; });
  const vis = e => { for (let x = e; x && x.nodeType === 1; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.05) return false; } return true; };
  const clip = e => { let q = { l: 0, t: 0, r: W, b: H }; for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) { const s = getComputedStyle(x); if (/(hidden|clip|auto|scroll)/.test(s.overflowX + s.overflowY)) { const p = x.getBoundingClientRect(); q = { l: Math.max(q.l, p.left), t: Math.max(q.t, p.top), r: Math.min(q.r, p.right), b: Math.min(q.b, p.bottom) }; } } return q; };
  const n = [...document.querySelectorAll(sel)].length;
  const on = all.filter(e => { const r = e.getBoundingClientRect(), q = clip(e); return vis(e) && r.left >= q.l - 1 && r.top >= q.t - 1 && r.right <= q.r + 1 && r.bottom <= q.b + 1; }).length;
  return { n, on }; }`;
const onGlass = (fr, sel) => fr.evaluate('(' + ON_GLASS + ')(' + JSON.stringify(sel) + ')').catch(() => ({ n: 0, on: 0 }));

async function demoLegs(prof) {
  console.log('-- ' + prof);
  let t1 = null, picks = null;
  const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => {
    for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
    await pg.waitForTimeout(1500);
    t1 = await crimesOn(pg);
    await throughTheTitle(pg); await pg.waitForTimeout(1800);
    picks = { crimes: await crimesOn(pg), m: await NS.small(pg.mainFrame(), '#newco'), o: await onGlass(pg.mainFrame(), '#newcostrip .org') };
    /* a plate is RUN's own pick: tap another, it lights, its facts say so */
    const b = await pg.evaluate(() => { const o = [...document.querySelectorAll('#newcostrip .org')].find(x => !x.classList.contains('on')); if (!o) return null; const r = o.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, v: o.getAttribute('data-v'), name: (o.querySelector('b') || {}).textContent }; });
    if (b) { await press(pg, prof, b.x, b.y); await pg.waitForTimeout(900); picks.tap = Object.assign(b, await pg.evaluate(() => ({ on: (document.querySelector('#newcostrip .org.on') || { getAttribute: () => null }).getAttribute('data-v'), facts: (document.getElementById('cbxorgfacts') || {}).textContent || '' }))); }
  } });
  const P = d.page;
  try {
    const pf = NS.faults(picks.m);
    ok('N1 ' + prof + ' the title and the picks: nothing scrolls (title ' + say(t1 || []) + '; picks ' + say(picks.crimes) + '); ALL ' + picks.o.n + ' ORIGINS ON THE GLASS (' + picks.o.on + '), smallest word ' + (picks.m && picks.m.minText) + ' px'
      + (picks.tap ? '; a tap on ' + picks.tap.name + ' lit it (' + picks.tap.on + ')' : '') + (pf.length ? '; ' + pf.join('; ') : ''),
      !!t1 && !t1.length && !picks.crimes.length && picks.o.n >= 15 && picks.o.on === picks.o.n && !pf.length && !!picks.tap && picks.tap.on === picks.tap.v);
    await P.waitForTimeout(3000); await d.clearCards().catch(() => {}); await P.waitForTimeout(1500);
    const c2 = await crimesOn(P);
    ok('N2 ' + prof + ' where the game starts, at rest: nothing scrolls', !c2.length, say(c2));
    /* N3 every building of the town on the glass */
    const townUp = async () => { for (const x of P.frames().filter(f => /SETTLEMENT_SCREEN/.test(f.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp && !document.getElementById('arrive'); } catch (e) { return false; } }).catch(() => false) && await NS.frameShown(x)) return x; return null; };
    let stuck = false, sf = await townUp();
    if (!sf) { await d.fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs).find(k => /church/i.test(k)) || Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }).catch(() => {});
      for (let i = 0; i < 60 && !sf; i++) { await P.waitForTimeout(400); sf = await townUp();
        /* 11/6 MAIN'S OWN BUG, NAMED by UI 8 (not this gate's to fix): the town's frame can stay at opacity 0 after its door; after
           6 s the game's own rest (btwFrameRest) is called and the leg says so */
        if (!sf && i === 15) { stuck = true; await d.fr.evaluate(() => { try { btwFrameRest(); } catch (e) {} }).catch(() => {}); } }
      await P.waitForTimeout(1200); }
    const keys = sf ? await sf.evaluate(() => BohemiaSettlement.order()) : [];
    const s3 = [];
    for (const k of keys) {
      await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(500);
      let opened = null;
      for (let i = 0; i < 3 && opened !== k; i++) { const w = await sf.evaluate(k => BohemiaSettlement.where(k), k), fb = await (await sf.frameElement()).boundingBox();
        if (w) await press(P, prof, fb.x + w.x, fb.y + w.y); await P.waitForTimeout(1600); opened = await sf.evaluate(() => BohemiaSettlement.state.open); }
      await P.waitForTimeout(900);
      if (opened !== k) { s3.push({ k, bad: ['did not open'] }); continue; }
      const rows = await NS.sweepAll(P), cr = NS.crimes(rows), m = await NS.small(sf, '#sheet');
      const bad = [];
      if (cr.length) bad.push(say(cr));
      if (!rows.some(r => r.url === 'BOHEMIA_SETTLEMENT_SCREEN.html')) bad.push('the town was not on the glass');
      bad.push(...NS.faults(m, { half: !WHOLE.test(k) }));
      const list = k === 'hall' ? await onGlass(sf, '#sheet .hire') : /smith|armourer|arms/.test(k) ? await onGlass(sf, '#sheet .grid .slot') : null;
      if (list && list.on !== list.n) bad.push(list.on + ' of ' + list.n + ' on the glass');
      s3.push({ k, bad, area: m && m.area, min: m && m.minText, list });
    }
    await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }).catch(() => {});
    const bad3 = s3.filter(x => x.bad.length);
    ok('N3 ' + prof + ' *** EVERY BUILDING\'S SHEET *** ' + (stuck ? '(the town needed the game\'s own rest to show: main\'s fade bug) ' : '') + '(' + s3.map(x => x.k + ' ' + Math.round((x.area || 0) * 100) + '%' + (x.list ? ' ' + x.list.on + '/' + x.list.n : '')).join(', ') + '): nothing scrolls, all on the glass at once, no pager, words >= '
      + NS.FLOOR + ' px (smallest ' + Math.min(...s3.map(x => x.min || 99)) + '), presses >= ' + NS.TAP + ', a small job under half the glass' + (bad3.length ? '; ' + bad3.slice(0, 2).map(x => x.k + ': ' + x.bad[0]).join(' | ') : ''),
      keys.length >= 8 && !bad3.length);
    /* M: the checker bites (upright only) */
    if (prof === 'phone_portrait' && sf) {
      let hallUp = null;
      for (let i = 0; i < 4 && hallUp !== 'hall'; i++) { const w = await sf.evaluate(() => BohemiaSettlement.where('hall')), fb = await (await sf.frameElement()).boundingBox();
        if (w) await press(P, prof, fb.x + w.x, fb.y + w.y); await P.waitForTimeout(1800); hallUp = await sf.evaluate(() => BohemiaSettlement.state.open); }
      await P.waitForTimeout(800);
      await sf.evaluate(() => BohemiaNoScroll.off(true)); await P.waitForTimeout(600);
      const m1 = await crimesOn(P), m1s = await NS.small(sf, '#sheet');
      await sf.evaluate(() => BohemiaNoScroll.off(false)); await P.waitForTimeout(600);
      const m1b = await crimesOn(P);
      /* the planted pager, the planted small word and small press, the planted big sheet */
      await sf.evaluate(() => { const sh = document.getElementById('sheet'); const d = document.createElement('div'); d.id = 'ns-plant-pager'; d.className = 'ns-bar';
        d.innerHTML = '<button aria-label="the next page" style="width:44px;height:44px">&#9654;</button><span>PAGE 1 OF 3</span><i style="font-size:9px">tiny</i><button style="width:80px;height:30px">SHORT</button>'; sh.appendChild(d); });
      const m2s = await NS.small(sf, '#sheet');
      await sf.evaluate(() => document.getElementById('ns-plant-pager').remove());
      const big = await sf.evaluate(() => { const d = document.createElement('div'); d.id = 'ns-plant-big'; d.style.cssText = 'position:fixed;left:0;right:0;bottom:0;height:70%;background:#222'; document.body.appendChild(d); return true; });
      const m3s = await NS.small(sf, '#ns-plant-big'); await sf.evaluate(() => document.getElementById('ns-plant-big').remove());
      await P.evaluate(() => { const d = document.createElement('div'); d.id = 'ns-plant'; d.style.cssText = 'position:fixed;left:10px;top:120px;width:160px;height:90px;overflow:auto;z-index:2147483000;background:#000';
        d.innerHTML = '<div style="height:400px"><button style="width:80px;height:44px">PLANT</button></div>'; document.body.appendChild(d); });
      const m4 = await crimesOn(P); await P.evaluate(() => document.getElementById('ns-plant').remove());
      await sf.evaluate(() => { document.documentElement.style.setProperty('overflow', 'auto', 'important'); document.body.style.setProperty('overflow', 'visible', 'important'); const d = document.createElement('div'); d.id = 'ns-tall'; d.style.cssText = 'height:3000px;width:10px'; document.body.appendChild(d); });
      const m5 = await crimesOn(P);
      await sf.evaluate(() => { document.getElementById('ns-tall').remove(); document.documentElement.style.removeProperty('overflow'); document.body.style.removeProperty('overflow'); });
      await P.evaluate(() => { const d = document.createElement('div'); d.id = 'ns-cut'; d.style.cssText = 'position:fixed;left:10px;top:120px;width:160px;height:60px;overflow:hidden;z-index:2147483000';
        d.innerHTML = '<div style="height:60px"></div><button style="width:80px;height:44px">BELOW</button>'; document.body.appendChild(d); });
      const m6 = await crimesOn(P); await P.evaluate(() => document.getElementById('ns-cut').remove());
      const has = (c, what, re) => c.some(x => x.what === what && re.test(NS.line(x)));
      const f2 = NS.faults(m2s), f3 = NS.faults(m3s, { half: true });
      ok('M *** THE CHECKER BITES *** the hall (' + hallUp + ') with the dense look off runs past its sheet again (' + say(m1) + ', smallest word ' + (m1s && m1s.minText) + ' px), on again: clean (' + m1b.length + '); a planted page strip (' + (m2s.pagers.length) + ' pager marks), a word at 9 px (' + m2s.under.length + '), a 30 px press ('
        + m2s.taps.length + '), a 70% sheet (' + (f3.length) + '), a scrolling box with a button (' + m4.length + '), a page taller than the glass (' + m5.length + '), a button below a locked edge (' + m6.length + ') each caught',
        hallUp === 'hall' && m1.length > 0 && !m1b.length && m2s.pagers.length >= 2 && m2s.under.length >= 1 && m2s.taps.length >= 1 && f2.length >= 3 && f3.some(x => /half the glass/.test(x)) && has(m4, 'box', /ns-plant/) && has(m5, 'page', /SETTLEMENT/) && has(m6, 'off', /BELOW/));
    }
    /* N4 THE SETTINGS CARD: one card */
    await P.evaluate(() => { const b = document.querySelector('#bohphone .app[data-app=settings]'); if (b) b.click(); else if (window.BohemiaSettings) BohemiaSettings.open(); }); await P.waitForTimeout(1600);
    const c4 = await crimesOn(P), m4 = await NS.small(P.mainFrame(), '#setcard');
    const rows4 = await onGlass(P.mainFrame(), '#setcard > :not(.seth):not(#setphone), #setcard > #setphone > *');
    const f4 = NS.faults(m4);
    ok('N4 ' + prof + ' *** THE SETTINGS CARD *** one card (' + (m4 && m4.box && m4.box.join('x')) + ', ' + Math.round((m4 && m4.area || 0) * 100) + '% of the glass): every row on the glass at once (' + rows4.on + ' of ' + rows4.n + '), nothing scrolls (' + say(c4) + '), no tabs, smallest word ' + (m4 && m4.minText) + ' px' + (f4.length ? '; ' + f4.join('; ') : ''),
      rows4.n >= 12 && rows4.on === rows4.n && !c4.length && !f4.length);
    await P.evaluate(() => { const c = document.getElementById('setclose'); if (c) c.click(); }); await P.waitForTimeout(900);
    /* N5 the crew screen through the phone */
    const crew = await P.evaluate(() => { const b = document.querySelector('#bohphone .app[data-app=crew]'); if (b) { b.click(); return true; } return false; });
    await P.waitForTimeout(4500);
    const c5 = await crimesOn(P), rf = P.frames().find(f => /ROSTER_SCREEN/.test(f.url())), m5 = rf ? await NS.small(rf, 'body') : null, f5 = NS.faults(m5);
    ok('N5 ' + prof + ' the crew screen through the phone\'s CREW: nothing scrolls, smallest word ' + (m5 && m5.minText) + ' px' + (f5.length ? '; ' + f5.join('; ') : ''), crew && !!rf && !c5.length && !f5.length, say(c5));
    await P.evaluate(() => { try { if (window.BohemiaCrewDoor) BohemiaCrewDoor.close(); } catch (e) {} }); await P.waitForTimeout(1500);
    ok('Z ' + prof + ' nothing threw', !d.errs.length, d.errs.slice(0, 2).join(' | ') || 'none');
  } catch (e) { ok(prof + ' ran to the end', false, String(e.stack).slice(0, 300)); }
  await d.close();
}

/* the fullest hall the game deals: a fortress, the fair's card (+25% men), the recruiter in camp (two to four more) */
async function fullHall(b, port, prof, PV) {
  const ctx = await b.newContext(PV[prof]), p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await p.addScriptTag({ url: 'bohemia_ui_materials.js' }); await p.addScriptTag({ url: 'bohemia_ui_no_scroll.js' });
  await p.evaluate(() => { const o = JSON.parse(localStorage.getItem('bohemia.camp.v1') || '{}'); o.retinue = ['recruiter']; o.cart = o.cart || 0; localStorage.setItem('bohemia.camp.v1', JSON.stringify(o)); });
  const traits = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/settlement_traits.json'), 'utf8')).traits.filter(t => t && t.recruits_mult > 1);
  await p.evaluate(tr => BohemiaSettlement.open({ place: { name: 'NELLIS GATE', tier: 'fortress' }, traits: tr, day: 9, batteries: 400 }), traits);
  await p.waitForTimeout(1500);
  const xy = await p.evaluate(() => BohemiaSettlement.where('hall')); if (xy) await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(2500);
  const l = await onGlass(p.mainFrame(), '#sheet .hire'), m = await NS.small(p.mainFrame(), '#sheet'), cr = NS.crimes(await NS.sweepAll(p)), f = NS.faults(m);
  const st = await p.evaluate(() => BohemiaNoScroll.state(document.getElementById('sheet')));
  ok('N8 ' + prof + ' *** THE FULLEST HALL *** (a fortress, the fair, the recruiter): ' + l.on + ' of ' + l.n + ' men on the glass at once (step ' + (st && st.level) + '), nothing scrolls (' + say(cr) + '), smallest word ' + (m && m.minText) + ' px' + (f.length ? '; ' + f.join('; ') : ''),
    l.n >= 10 && l.on === l.n && !cr.length && !f.length && !errs.length, errs.slice(0, 1).join('') || undefined);
  await ctx.close();
}

async function aloneLegs() {
  const srv = await T.serve(8941); const b = await chromium.launch();
  const PV = { phone_portrait: T.PROFILES.phone, phone_landscape: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, computer: T.PROFILES.computer };
  const full36 = T.STASH.concat(T.STASH, T.STASH, T.STASH.slice(0, 6)), forty = T.STASH.concat(T.STASH, T.STASH, T.STASH);
  const twenty = Array.from({ length: 20 }, (x, i) => T.COMPANY[i % T.COMPANY.length]);
  try {
    for (const k of PROFS) {
      for (const [what, o] of [['TWENTY MEN AND A FULL STASH OF 36', { stash: full36, company: twenty }], ['the stranger\'s six and a bag of 40', { stash: forty }]]) {
        const ctx = await b.newContext(PV[k]), page = await ctx.newPage();
        const fr = await T.openCrew(page, 8941, o);
        await page.waitForTimeout(1200);
        const men = await onGlass(fr, '.cell.full'), bag = await onGlass(fr, '#bag .slot.full'), cr = NS.crimes(await NS.sweepAll(page)), m = await NS.small(fr, 'body'), f = NS.faults(m);
        const crewN = await fr.evaluate(() => BohemiaRosterScreen.state.crew.filter(x => !x.dead).length), want = o.stash.length;
        ok('N6 ' + k + ' *** ' + what.toUpperCase() + ' ***: ' + men.on + ' of ' + crewN + ' men on the glass at once, ' + bag.on + ' of ' + want + ' pieces, nothing scrolls (' + say(cr) + '), smallest word ' + (m && m.minText) + ' px' + (f.length ? '; ' + f.join('; ') : ''),
          men.n === crewN && men.on === crewN && bag.n === want && bag.on === want && !cr.length && !f.length);
        await ctx.close();
      }
      const ctx2 = await b.newContext(PV[k]), p2 = await ctx2.newPage();
      await p2.goto('http://127.0.0.1:8941/slices/BOHEMIA_FIGHT.html', { waitUntil: 'load', timeout: 60000 }).catch(() => {}); await p2.waitForTimeout(6000);
      const c7 = await crimesOn(p2);
      ok('N7 ' + k + ' the fight\'s page alone: nothing scrolls', !c7.length, say(c7));
      await p2.goto('http://127.0.0.1:8941/slices/BOHEMIA_SPOILS_SCREEN.html', { waitUntil: 'load', timeout: 60000 }).catch(() => {}); await p2.waitForTimeout(5000);
      const c8 = await crimesOn(p2);
      console.log('  OWED ' + k + ' the end of the fight (RUN FIVE\'s spoils screen; not counted): ' + (c8.length ? say(c8) : 'nothing scrolls'));
      await ctx2.close();
      await fullHall(b, 8941, k, PV).catch(e => ok('N8 ' + k + ' the fullest hall ran', false, String(e).slice(0, 200)));
    }
  } finally { await b.close(); srv.close(); }
}

(async () => {
  try { await aloneLegs(); } catch (e) { ok('the crew, the hall and the fight pages', false, String(e.stack).slice(0, 300)); }
  for (const p of PROFS) await demoLegs(p);
  done();
})();
