/* THE PHONE  (UI TWO, 10/26/26: rows [the phone overhaul] and [one phone, one place]; rules 212 and 213)

   PAOLO 10/26: 'the phone should be at the bottom left or bottom right depending on the setting I choose, whether I flip my
   screen too... one button for play and pause... it reflects the street tile you're on and shows you the camp... I give up
   on the phone displaying the top two jobs... your company, quick edit the name... the crew button... looks like the social
   media button'; and 'it stays in the same place... in combat the exact same, our abilities, but small... an animation to
   let you know it's combat time... the phone placement permanent... the same size.'

   On the DEMO, through the one driver, by real taps (a finger on a phone, a mouse on a computer), on his phone upright, on
   its side and on a computer, in his right corner and then flipped to the left, this holds:
     ONE PHONE, ONE PLACE, ONE SIZE
     - the phone is on the map, in a town, at camp and in a fight, and its rectangle is the same on all four within 0.6
       points; the page draws it exactly where BOH_PHONE_RECT() says, and the map's, the town's and the fight's own pages
       answer the same rectangle in their own pixels
     - it sits in the chosen bottom corner, inside the glass
     - no press of the map, the town or the fight lies under it (every reachable press's centre, hit-tested from the top)
     - the map's old phone, its speed pad and its CAMP plate are gone from the glass
     THE FIVE APPS
     - five apps at most, each one's centre hit-tests to itself
     - PLAY/PAUSE: one tap stops the clock and the march (the hour and the crew stand still), one tap starts them again; its
       picture says which; the last speed is its mark; a held mouse opens the speeds (computer)
     - CREW opens the company screen; HEAL (rule 226: CAMP is the heal button) is a cross over the company's one bar (its
       hitpoints red and armour grey over their maxima), makes camp (the phone's screen says so, the wallpaper is the camp's
       own picture) and BREAK CAMP breaks it; FEED opens the company's page and the city's posts in one tap, and the company's name
       renames there (a tap, the name, Enter: the game's one name, and the feed says so); RELATIONS lists every town with
       how it takes you
     - no offer on the phone (rule 148 dead): no pay, no job card while he holds no job
     THE JOB COLUMN (rules 227 and 228)
     - the main quest's slot first and kept with no job, one and two jobs; each job he is on a card with its red stars and
       its time, nothing cut off; a tap on a card makes it PLAY's job and PLAY alone sets off toward it by the map's own
       path finder; X asks once with the board's own cost in one line; a tap elsewhere keeps it; DROP drops it
     - the wallpaper is the block he stands on: the phone's picture is the map's own pixels around the crew (25 points)
     IN A FIGHT
     - the combat animation plays at the fight's start (seen on the glass) and the abilities page opens from it with the
       man's name; the fight's own ability squares are off its bar and on the phone; a press on the phone presses the
       fight's own button (a planted ability); END TURN, AUTO and RETREAT stay on the fight's bar and are not under it
     - when the fight ends the phone strikes back to its apps
     THE SETTINGS
     - the game's SETTINGS card carries THE PHONE; LEFT mirrors the phone at once (no reload), every frame's variables
       and its 'bohemia-phone' event with it; an app moved up takes the big slot; HIDE takes it off the phone
     - nothing thrown
   PLANTED (on the phone upright): the phone nudged six points off its rectangle, a press planted under it, the old phone
   shown again, the wallpaper painted over: each turns its leg red.
   node gates/the_phone_gate.js            (PHONE_PROFILES=phone_portrait,computer to run fewer) */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const PROFILES = (process.env.PHONE_PROFILES || 'phone_portrait,phone_landscape,computer').split(',').filter(Boolean);
const TOL = 0.6;
const K = ['left', 'top', 'width', 'height'];
const same = (a, b, t) => !!a && !!b && K.every(k => Math.abs(a[k] - b[k]) <= (t || TOL));
const fmt = r => r ? K.map(k => Math.round(r[k] * 10) / 10).join(',') : 'none';
/* rule 232(b): PLAY/PAUSE and HEAL on the phone at one size on every screen: their boxes, read off each screen's snapshot */
let SIZES = {};
const two = S => { const o = {}; ((S && S.apps) || []).forEach(a => { if (a.app === 'play' || a.app === 'heal') o[a.app] = [Math.round(a.w * 10) / 10, Math.round(a.h * 10) / 10]; }); return o; };

/* ---- in the shell ---- */
const PHONE = () => {
  const e = document.getElementById('bohphone'); if (!e) return null;
  const R = window.BOH_PHONE_RECT(), b = e.getBoundingClientRect();
  const apps = [...e.querySelectorAll('.home .app')].map(a => { const r = a.getBoundingClientRect(), cx = r.x + r.width / 2, cy = r.y + r.height / 2, h = document.elementFromPoint(cx, cy);
    return { app: a.dataset.app, cx, cy, w: r.width, h: r.height, self: !!h && (h === a || a.contains(h)), big: a.classList.contains('big'), off: a.classList.contains('off'), img: (a.querySelector('img') || {}).getAttribute ? a.querySelector('img').getAttribute('src') : '' }; });
  return { R, dom: { left: b.x, top: b.y, width: b.width, height: b.height }, on: e.classList.contains('on') && getComputedStyle(e).display !== 'none', screen: e.dataset.screen,
    apps, text: e.innerText, page: (e.querySelector('.page.on') || {}).dataset ? (e.querySelector('.page.on') ? e.querySelector('.page.on').dataset.page : '') : '',
    fight: !!e.querySelector('.fight.on'), cmb: !!e.querySelector('.cmb.on'), home: getComputedStyle(e.querySelector('.home')).visibility !== 'hidden', W: innerWidth, H: innerHeight };
};
/* every reachable press of this page, in the top page's pixels */
const PRESSES = () => {
  let x = 0, y = 0; try { let w = window; while (w.frameElement) { const r = w.frameElement.getBoundingClientRect(); x += r.left; y += r.top; w = w.parent; } } catch (e) {}
  const out = [];
  for (const e of document.querySelectorAll('button,[role=button],input,select,textarea,a[href],#leave')) {
    if (e.closest('#bohphone')) continue;
    const r = e.getBoundingClientRect(); if (r.width < 8 || r.height < 8) continue;
    const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || +cs.opacity < 0.1 || cs.pointerEvents === 'none') continue;
    const cx = r.x + r.width / 2, cy = r.y + r.height / 2; if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) continue;
    const h = document.elementFromPoint(cx, cy); if (!h || !(h === e || e.contains(h))) continue;   /* covered on its own page: not reachable anyway */
    out.push({ n: (e.id || e.getAttribute('aria-label') || e.textContent || e.tagName).replace(/\s+/g, ' ').trim().slice(0, 24), x: cx + x, y: cy + y });
  }
  return out;
};
const UNDER = (pts) => pts.filter(p => { const h = document.elementFromPoint(p.x, p.y); return !!h && !!h.closest && !!h.closest('#bohphone'); }).map(p => p.n);

async function side(profile) {
  console.log('\n' + profile);
  let d;
  try { d = await open({ profile, door: 120000, engage: true }); } catch (e) { ok('the demo opened', false, String(e.message).slice(0, 120)); return; }
  const p = d.page, fr = d.fr, touch = profile !== 'computer', PLANT = profile === 'phone_portrait';
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const tap = async (x, y) => { if (touch) await p.touchscreen.tap(x, y); else await p.mouse.click(x, y); };
  const tapApp = async (a) => { const P = await p.evaluate('(' + PHONE + ')()'); const t = P && P.apps.find(z => z.app === a); if (!t) return false; await tap(t.cx, t.cy); return true; };
  const tapIn = async (frame, sel) => { const h = await frame.$(sel); if (!h) return false; const b = await h.boundingBox(); if (!b) return false; await tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
  const under = async (frames) => { let pts = []; for (const f of frames) { try { pts = pts.concat(await f.evaluate('(' + PRESSES + ')()')); } catch (e) {} } return p.evaluate('(' + UNDER + ')(' + JSON.stringify(pts) + ')'); };
  const until = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await p.waitForTimeout(100); } return false; };
  try {
    /* RUN THREE (rule 236): a new game opens on his squad up close and then the closest town's settlement screen; the phone stands
       in that first town already (213(a)), and this walk starts on the map, so it leaves the town the way a player does: a real
       tap on LEAVE */
    if (await until(() => fr.evaluate(() => !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened)), 20000)) {
      await until(() => p.evaluate(() => { const e = document.getElementById('bohphone'); return !!e && e.classList.contains('on') && e.dataset.screen === 'town'; }), 8000);
      const st = await p.evaluate(() => (document.getElementById('bohphone') || { dataset: {} }).dataset.screen);
      ok('the first screen is the closest town (rule 236), and the phone already stands in it', st === 'town', st);
      await p.waitForTimeout(800);
      const sf0 = p.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url()));
      if (sf0) await tapIn(sf0, '#leave');
      await until(() => fr.evaluate(() => !LOOP.open), 8000); await p.waitForTimeout(600);
    }
    await until(() => p.evaluate(() => !!document.getElementById('bohphone') && document.getElementById('bohphone').classList.contains('on')), 30000);
    await p.evaluate(() => { try { localStorage.removeItem('bohemia.phone.v1'); BohemiaPhone.setSide('right'); } catch (e) {} });
    await fr.evaluate(() => { window.__phoneEv = 0; window.addEventListener('bohemia-phone', () => { window.__phoneEv++; }); });
    await p.waitForTimeout(1500);
    const RECTS = {};
    for (const sd of ['right', 'left']) {
      if (sd === 'left') {
        /* ---- THE FLIP, from the game's own settings card, by real taps ---- */
        const ev0 = await fr.evaluate(() => window.__phoneEv);
        await tapIn(fr, '#bmtb .t.gear'); await p.waitForTimeout(700);
        const card = await p.evaluate(() => { const b = document.getElementById('setphone'); if (!b) return null; b.scrollIntoView({ block: 'center' });
          return { h: b.querySelector('.seth') && b.querySelector('.seth').textContent, apps: b.querySelectorAll('.pa').length }; });
        ok('the game\'s SETTINGS card carries THE PHONE (the corner and every app)', !!card && /PHONE/.test(card.h) && card.apps === 5, JSON.stringify(card));
        await p.waitForTimeout(300);
        const before = await p.evaluate('(' + PHONE + ')()');
        await tapIn(p.mainFrame(), '#setphone [data-side=left]');
        const now = await p.evaluate('(' + PHONE + ')()');   /* no wait: at once */
        const cityR = await fr.evaluate(() => BOH_PHONE_RECT()), ev1 = await fr.evaluate(() => window.__phoneEv);
        ok('LEFT mirrors the phone at once (no reload, no wait)', now.R.side === 'left' && Math.abs(now.R.left - (now.W - before.R.left - before.R.width)) <= 1 && Math.abs(now.R.top - before.R.top) <= TOL,
          fmt(before.R) + ' -> ' + fmt(now.R));
        ok('  every frame hears it at once: the map\'s rectangle, its variables and its \'bohemia-phone\' event', cityR.side === 'left' && Math.abs(cityR.left - now.R.left) <= 1 && ev1 > ev0
          && await fr.evaluate(() => document.documentElement.classList.contains('boh-phone-left')), 'events ' + ev0 + ' -> ' + ev1);
        /* an app moved up takes the big slot; HIDE takes it off; then back as it was */
        await tapIn(p.mainFrame(), '#setphone .pa[data-a=crew] [data-do=up]'); await p.waitForTimeout(200);
        await tapIn(p.mainFrame(), '#setphone .pa[data-a=relations] [data-do=hide]'); await p.waitForTimeout(200);
        const re = await p.evaluate('(' + PHONE + ')()');
        ok('  CREW moved up takes the big slot; RELATIONS hidden leaves four apps', re.apps.length === 4 && re.apps[0].app === 'crew' && re.apps[0].big && !re.apps.some(a => a.app === 'relations'),
          re.apps.map(a => a.app + (a.big ? '*' : '')).join(' '));
        await tapIn(p.mainFrame(), '#setphone .pa[data-a=crew] [data-do=down]'); await p.waitForTimeout(200);
        await tapIn(p.mainFrame(), '#setphone .pa[data-a=relations] [data-do=hide]'); await p.waitForTimeout(200);
        const back = await p.evaluate('(' + PHONE + ')()');
        ok('  and back as it was by the same presses', back.apps.map(a => a.app).join() === 'play,crew,heal,feed,relations', back.apps.map(a => a.app).join(' '));
        await p.evaluate(() => { const c = document.getElementById('setclose'); if (c) c.click(); else document.getElementById('setwrap').classList.remove('on'); });
        await p.waitForTimeout(600);
      }
      /* ---- THE MAP ---- */
      const M = await p.evaluate('(' + PHONE + ')()');
      SIZES = { map: two(M) };
      RECTS[sd] = M.R;
      ok('[' + sd + '] the map: the phone is on, in the ' + sd + ' bottom corner, inside the glass', M.on && M.screen === 'map' && M.R.side === sd && M.R.bottom <= M.H && M.R.bottom >= M.H - 60
        && (sd === 'right' ? M.R.right <= M.W && M.R.right >= M.W - 60 : M.R.left >= 0 && M.R.left <= 60), fmt(M.R) + ' of ' + M.W + 'x' + M.H);
      ok('  the page draws it where BOH_PHONE_RECT says, and the map\'s own page answers the same', same(M.R, M.dom) && same(M.R, await fr.evaluate(() => BOH_PHONE_RECT())), fmt(M.dom));
      ok('  five apps at most, every one\'s centre hit-tests to itself', M.apps.length >= 1 && M.apps.length <= 5 && M.apps.every(a => a.self), M.apps.map(a => a.app + (a.self ? '' : '!')).join(' '));
      if (sd === 'right') {
        const old = await fr.evaluate(() => ['cityfeed', 'speedpad', 'campbtn'].map(id => { const e = document.getElementById(id); return e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0 ? id : null; }).filter(Boolean));
        ok('  the map\'s old phone, its speed pad and its CAMP plate are gone from the glass', !old.length, old.join(' ') || 'none');
        const homeText = await p.evaluate(() => document.querySelector('#bohphone .home').innerText);
        ok('  no offer on the phone (rule 148 dead): no pay, no stars, no job card while he holds no job', !/\bPAYS?\b|\u2605|BATTERIES|TAKE IT|\bJOBS?\b/i.test(homeText) && !(await p.evaluate(() => !!document.querySelector('#bohphone .jc,#bohphone [data-job]'))), homeText.replace(/\s+/g, ' ').slice(0, 80));
      }
      let U = await under([fr]);
      ok('  no press of the map lies under the phone', !U.length, U.join(' | ') || 'none');
      if (PLANT && sd === 'right') {
        await fr.evaluate((R) => { const b = document.createElement('button'); b.id = 'plantpress'; b.textContent = 'X'; b.setAttribute('style', 'position:fixed;z-index:99;width:40px;height:40px;left:' + (R.left + 30) + 'px;top:' + (R.top + 60) + 'px'); document.body.appendChild(b); }, M.R);
        const U2 = await under([fr]); await fr.evaluate(() => document.getElementById('plantpress').remove());
        ok('  PLANT: a press under the phone is caught', U2.indexOf('plantpress') >= 0, U2.join(' '));
        await p.evaluate(() => { document.getElementById('bohphone').style.marginLeft = '6px'; });
        const Pl = await p.evaluate('(' + PHONE + ')()'); await p.evaluate(() => { document.getElementById('bohphone').style.marginLeft = ''; });
        ok('  PLANT: the phone nudged six points off its rectangle is caught', !same(Pl.R, Pl.dom), fmt(Pl.dom));
        await fr.evaluate(() => { const s = document.getElementById('bohphone-local'); s.disabled = true; });
        const oldP = await fr.evaluate(() => { const e = document.getElementById('cityfeed'); return !!e && getComputedStyle(e).display !== 'none'; });
        await fr.evaluate(() => { document.getElementById('bohphone-local').disabled = false; });
        ok('  PLANT: the old phone shown again is caught', oldP);
      }
      if (sd === 'right') {
        /* ---- PLAY / PAUSE ---- */
        await fr.evaluate(() => { const bs = ctBases(); let best = null, bd = 1e9; for (const n in bs) { const b = bs[n]; const dd = Math.abs(b.x - city.x) + Math.abs(b.y - city.y); if (dd > 4 && dd < bd) { bd = dd; best = b; } }
          if (best) travelTo(0, 0, [best.x, best.y]); });
        await p.waitForTimeout(400);
        const s0 = await fr.evaluate(() => ({ v: window.__TRAVEL_SPEED, t: T.day * 1440 + T.min, at: [city.x, city.y] }));
        if (s0.v > 0) { await tapApp('play'); await p.waitForTimeout(300); }
        const a = await fr.evaluate(() => ({ v: window.__TRAVEL_SPEED, t: T.day * 1440 + T.min, at: [city.x, city.y] }));
        await p.waitForTimeout(2500);
        const b = await fr.evaluate(() => ({ v: window.__TRAVEL_SPEED, t: T.day * 1440 + T.min, at: [city.x, city.y] }));
        const pic0 = (await p.evaluate('(' + PHONE + ')()')).apps.find(z => z.app === 'play');
        ok('PLAY/PAUSE: a tap stops the clock and the march (paused: the hour and the crew stand still 2.5 s)', a.v === 0 && b.v === 0 && a.t === b.t && a.at.join() === b.at.join() && /app_play/.test(pic0.img),
          'speed ' + s0.v + ' -> ' + a.v + ', hour ' + a.t + ' -> ' + b.t + ', picture ' + pic0.img.split('/').pop());
        await tapApp('play'); await p.waitForTimeout(3000);
        const c = await fr.evaluate(() => ({ v: window.__TRAVEL_SPEED, t: T.day * 1440 + T.min, at: [city.x, city.y] }));
        const P2 = await p.evaluate('(' + PHONE + ')()'), pic1 = P2.apps.find(z => z.app === 'play');
        ok('  a tap starts them again (the hour moves, the crew walks), the picture is PAUSE, the last speed its mark', c.v > 0 && c.t > b.t && c.at.join() !== b.at.join() && /app_pause/.test(pic1.img)
          && await p.evaluate(() => /\d/.test(document.querySelector('#bohphone .app[data-app=play] .mark').textContent)),
          'speed ' + c.v + ', hour ' + b.t + ' -> ' + c.t + ', ' + b.at + ' -> ' + c.at);
        /* the one door every fight and road event comes through drops the clock to PAUSE, and the phone says so */
        const it0 = await fr.evaluate(() => window.__TRAVEL_SPEED);   /* running, from the leg above */
        const it = await fr.evaluate(() => { travelInterrupt('gate'); return window.__TRAVEL_SPEED; }); await p.waitForTimeout(450);
        const pi = (await p.evaluate('(' + PHONE + ')()')).apps.find(z => z.app === 'play');
        ok('  an interrupt (a road event, a fight) drops it to PAUSE and the phone shows PLAY', it0 > 0 && it === 0 && /app_play/.test(pi.img), 'speed ' + it0 + ' -> ' + it + ', picture ' + pi.img.split('/').pop());
        await fr.evaluate(() => { try { travelStop(); } catch (e) {} });
        if (!touch) {
          const t = (await p.evaluate('(' + PHONE + ')()')).apps.find(z => z.app === 'play');
          await p.mouse.move(t.cx, t.cy); await p.mouse.down(); await p.waitForTimeout(800); await p.mouse.up(); await p.waitForTimeout(200);
          const pg = (await p.evaluate('(' + PHONE + ')()')).page;
          ok('  a held press opens the speeds', pg === 'speeds', pg);
          await p.evaluate(() => document.querySelector('#bohphone .page .ph').click()); await p.waitForTimeout(200);
          const v = await fr.evaluate(() => window.__TRAVEL_SPEED);
          ok('  and the hold did not start the clock', v === 0, v);
        }
        /* ---- THE WALLPAPER ---- */
        const W = await p.evaluate(() => {
          const info = BohemiaPhone.wall(), ph = document.querySelector('#bohphone .wall'), cd = document.getElementById('cityFrame').contentWindow, cv = cd.document.getElementById('cv'), C = cd.__PHONE_WALL;
          if (!info || !C) return { info, C: !!C };
          const a = ph.getContext('2d'), b = cv.getContext('2d'); let n = 0, off = 0;
          for (let j = 1; j <= 5; j++) for (let i = 1; i <= 5; i++) {
            const x = Math.floor(ph.width * i / 6), y = Math.floor(ph.height * j / 6);
            const mx = Math.floor(C.sx + C.sw * (x + 0.5) / ph.width), my = Math.floor(C.sy + C.sh * (y + 0.5) / ph.height);
            if (mx < 0 || my < 0 || mx >= cv.width || my >= cv.height) continue;
            /* the nearest of the map's pixel and its eight neighbours: a drawImage at a fractional source lands a pixel either side */
            const pa = a.getImageData(x, y, 1, 1).data, nb = b.getImageData(Math.max(0, mx - 1), Math.max(0, my - 1), 3, 3).data; n++;
            let best = 1e9; for (let k = 0; k < nb.length; k += 4) best = Math.min(best, Math.max(Math.abs(pa[0] - nb[k]), Math.abs(pa[1] - nb[k + 1]), Math.abs(pa[2] - nb[k + 2])));
            if (best > 24) off++;
          }
          const cx = C.sx + C.sw / 2, cy = C.sy + C.sh / 2, at = cd.BohemiaPhone.P.state();
          return { info, n, off, centre: Math.hypot(cx - C.party[0], cy - C.party[1]), tile: (cd.__CITY.state().TH) * (cv.width / cv.clientWidth), at: C.at };
        });
        ok('the wallpaper is the block he stands on: the map\'s own pixels around the crew', !!W && W.info && W.info.what === 'block' && W.n >= 20 && W.off <= 2 && W.centre <= W.tile + 1,
          W && (W.off + ' of ' + W.n + ' points off, centred ' + (W.centre || 0).toFixed(1) + ' px from the crew (a half tile is ' + (W.tile || 0).toFixed(1) + ')'));
        if (PLANT) {
          const pl = await p.evaluate(() => { BohemiaPhone.wall(); const ph = document.querySelector('#bohphone .wall'), g = ph.getContext('2d'); g.fillStyle = '#ff00ff'; g.fillRect(0, 0, ph.width, ph.height);
            const cd = document.getElementById('cityFrame').contentWindow, cv = cd.document.getElementById('cv'), C = cd.__PHONE_WALL, b = cv.getContext('2d'); let off = 0, n = 0;
            for (let j = 1; j <= 5; j++) for (let i = 1; i <= 5; i++) { const x = Math.floor(ph.width * i / 6), y = Math.floor(ph.height * j / 6), mx = Math.floor(C.sx + C.sw * (x + 0.5) / ph.width), my = Math.floor(C.sy + C.sh * (y + 0.5) / ph.height);
              const pa = g.getImageData(x, y, 1, 1).data, pb = b.getImageData(mx, my, 1, 1).data; n++; if (Math.max(Math.abs(pa[0] - pb[0]), Math.abs(pa[1] - pb[1]), Math.abs(pa[2] - pb[2])) > 24) off++; }
            BohemiaPhone.wall(); return off; });
          ok('  PLANT: a painted-over wallpaper is caught', pl > 10, pl + ' points off');
        }
        /* ---- FEED: the company's page, renamed there ---- */
        await tapApp('feed'); await p.waitForTimeout(500);
        const F = await p.evaluate(() => { const pg = document.querySelector('#bohphone .page.on'); return pg ? { page: pg.dataset.page, name: (pg.querySelector('.co .nm') || {}).textContent, posts: pg.querySelectorAll('.po').length } : null; });
        ok('FEED opens in one tap: his company\'s page on top, the city\'s posts under it', !!F && F.page === 'feed' && !!F.name && F.posts >= 1, JSON.stringify(F));
        await tapIn(p.mainFrame(), '#bohphone .co .nm'); await p.waitForTimeout(250);
        const inp = await p.evaluate(() => !!document.querySelector('#bohphone .co input'));
        await p.evaluate(() => { const i = document.querySelector('#bohphone .co input'); if (i) { i.select(); } });
        await p.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A'); await p.keyboard.type('the dust lot'); await p.keyboard.press('Enter'); await p.waitForTimeout(600);
        const RN = await p.evaluate(() => ({ name: BohemiaCompanyName.get(), shown: (document.querySelector('#bohphone .co .nm') || {}).textContent || '' }));
        const said = await fr.evaluate(() => BOHEMIA_FEED.posts().some(x => /THE DUST LOT/.test(x.txt) && x.kind === 'mine'));
        ok('  the company renames right there (a tap on its name, the name, Enter): the game\'s one name, and the feed says so', inp && RN.name === 'THE DUST LOT' && /THE DUST LOT/.test(RN.shown) && said, JSON.stringify(RN) + ' post ' + said);
        await tapIn(p.mainFrame(), '#bohphone .page .ph'); await p.waitForTimeout(250);
        /* ---- RELATIONS ---- */
        await tapApp('relations'); await p.waitForTimeout(400);
        const RL = await p.evaluate(() => { const pg = document.querySelector('#bohphone .page.on'); return pg ? { page: pg.dataset.page, rows: [...pg.querySelectorAll('.rel')].map(r => r.innerText.replace(/\s+/g, ' ')) } : null; });
        ok('RELATIONS opens in one tap: every town, how it takes you, and why', !!RL && RL.page === 'relations' && RL.rows.length >= 10 && RL.rows.every(r => /(HOSTILE|THREATENING|UNFRIENDLY|COLD|NEUTRAL|OPEN|FRIENDLY|ALLIED) \d+/.test(r)),
          RL && (RL.rows.length + ' towns: ' + RL.rows.slice(0, 2).join(' / ')));
        await tapIn(p.mainFrame(), '#bohphone .page .ph'); await p.waitForTimeout(250);
        /* ---- THE JOB COLUMN (rules 227, 228): the main quest's slot first, then the jobs he is on, X and DROP, PLAY to the job ---- */
        const COL = () => p.evaluate(() => { const jb = document.querySelector('#bohphone .home .jobs'); if (!jb) return null; const sc = document.querySelector('#bohphone .scr').getBoundingClientRect();
          const kids = [...jb.children].filter(k => k.getBoundingClientRect().height > 0);
          return { first: kids[0] && kids[0].className, empty: kids.filter(k => k.classList.contains('je') && !k.textContent.trim()).length, others: kids.filter(k => !/\b(mq|jc|je)\b/.test(k.className)).length, cards: kids.filter(k => k.classList.contains('jc')).map(k => { const r = k.getBoundingClientRect(); const wh = k.querySelector('.wh'), st = k.querySelector('.st'), pl = k.querySelector('.pl');
            return { id: k.dataset.job, sel: k.classList.contains('sel'), arm: k.classList.contains('arm'), inside: r.top >= sc.top - 0.5 && r.bottom <= sc.bottom + 0.5 && r.left >= sc.left - 0.5 && r.right <= sc.right + 0.5,
              text: k.innerText.replace(/\s+/g, ' '), stars: st ? st.textContent.length : 0, starInk: st ? getComputedStyle(st).color : '', time: pl ? pl.textContent : '', timeWhole: pl ? pl.scrollWidth <= pl.clientWidth + 1 : true }; }) }; });
        const c0 = await COL();
        ok('the job column: the main quest\'s slot first and kept; no job held: no card, both slots EMPTY, READY TO GO (232(a))', !!c0 && /\bmq\b/.test(c0.first) && c0.cards.length === 0 && c0.empty === 2 && c0.others === 0, JSON.stringify(c0 && { first: c0.first, empty: c0.empty, others: c0.others }));
        await fr.waitForFunction(() => window.BohemiaPhoneBoard && BohemiaPhoneBoard.asks().length > 1, null, { timeout: 60000 }).catch(() => {});
        const took = await fr.evaluate(() => { const A = BohemiaPhoneBoard.asks(), out = []; for (const o of A) { if (out.length >= 2) break; LOOP.open = { name: o.place, x: o.x, y: o.y, tier: o.tier };
          if (loopTakeContract({ id: o.id, title: o.title, pay: o.pay, skulls: o.skulls })) out.push(o.id); LOOP.open = null; } return out; });
        await p.waitForTimeout(1500);
        const c2 = await COL();
        ok('  two jobs on: the main slot first, then both jobs (no empty slot left), each with its red stars and its time, nothing cut off', took.length === 2 && /\bmq\b/.test(c2.first) && c2.cards.length === 2 && c2.empty === 0
          && c2.cards.every(c => c.inside && c.stars >= 1 && /rgb\((1[4-9]\d|2\d\d), ?\d{1,2}, ?\d{1,2}\)/.test(c.starInk) && c.timeWhole) && c2.cards.map(c => c.id).join() === took.join(),
          c2.cards.map(c => c.text + (c.inside ? '' : ' CUT') + ' ' + c.starInk).join(' | '));
        ok('  no offer on the phone: only the jobs he is on', !(await p.evaluate(() => /\bPAYS?\b|TAKE IT/i.test(document.getElementById('bohphone').innerText))));
        /* rule 238(d): each card points at its job: the arrow's turn equals the bearing of the job's next place from his block as the
           map draws it (the diamond: a grid step east is right and down on the glass), within 23 degrees; the time says how far */
        { const want = await fr.evaluate(() => LOOP.held.map(j => { const n = BohemiaJobKinds.nextOf(j); if (!n || n.x == null) return { id: j.id, deg: null };
            const g = __CITY.state(), dx = n.x - city.x, dy = n.y - city.y, vx = (dx - dy) * g.TW / 2, vy = (dx + dy) * g.TH / 2;
            return { id: j.id, deg: (dx || dy) ? (Math.atan2(vx, -vy) * 180 / Math.PI + 360) % 360 : null, to: [n.x, n.y] }; }));
          const got = await p.evaluate(() => [...document.querySelectorAll('#bohphone .jc')].map(c => { const a = c.querySelector('.dir'), r = a ? a.getBoundingClientRect() : null;
            return { id: c.dataset.job, deg: a && a.dataset.deg != null ? +a.dataset.deg : null, here: !!a && a.classList.contains('here'), shown: !!r && r.width >= 8, time: (c.querySelector('.pl') || {}).textContent || '' }; }));
          const off = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
          const each = want.map(w => { const g = got.find(x => x.id === w.id); return { id: w.id, ok: !!g && g.shown && (w.deg == null ? g.here : g.deg != null && off(g.deg, w.deg) <= 23) && /\d/.test(g.time), want: w.deg == null ? 'here' : Math.round(w.deg), got: g ? (g.here ? 'here' : g.deg) : 'no card', time: g && g.time }; });
          ok('  each job card points at its job (which way, as the map shows it) and says how far (238(d))', each.length === 2 && each.every(e => e.ok), JSON.stringify(each)); }
        /* PLAY with nothing picked goes to the job he picked on the phone */
        await fr.evaluate(() => { try { travelStop(); travelSpeedSet(0); } catch (e) {} });
        const second = await p.evaluate(() => { const b = document.querySelectorAll('#bohphone .jc')[1]; const r = b.getBoundingClientRect(); return [r.x + r.width * 0.3, r.y + r.height / 2]; });
        await tap(second[0], second[1]); await p.waitForTimeout(300);
        const selOk = (await COL()).cards[1].sel;
        await tapApp('play'); await p.waitForTimeout(500);
        const go = await fr.evaluate(() => ({ go: window.__PHONE_JOB_GO || null, v: window.__TRAVEL_SPEED, route: !!TRAVEL }));
        ok('  a tap on a card makes it PLAY\'s job; PLAY alone sets off toward it by the map\'s own path finder', selOk && !!go.go && go.go.id === took[1] && go.go.ok && go.route && go.v > 0, JSON.stringify(go));
        await tapApp('play'); await p.waitForTimeout(300); await fr.evaluate(() => { try { travelStop(); } catch (e) {} });
        /* X asks once with the board's own cost; a tap on the card keeps it; DROP drops it */
        const cost = await fr.evaluate((id) => BohemiaJobKinds.dropCost(id), took[0]);
        const xs = await p.evaluate(() => { const b = document.querySelector('#bohphone .jc .x'); const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
        await tap(xs[0], xs[1]); await p.waitForTimeout(300);
        const armed = await p.evaluate(() => { const c = document.querySelector('#bohphone .jc.arm'); return c ? { text: c.innerText.replace(/\s+/g, ' '), drop: !!c.querySelector('.dr') } : null; });
        const plw = cost && cost.place ? String(cost.place).toLowerCase() : '';
        ok('  X asks once, with the board\'s own cost in one line, and a DROP', !!armed && armed.drop && (!plw || armed.text.toLowerCase().indexOf(plw) >= 0) && /like you less|nobody pays/i.test(armed.text), armed && armed.text);
        const body = await p.evaluate(() => { const c = document.querySelector('#bohphone .jc.arm .tx'); const r = c.getBoundingClientRect(); return [r.x + 8, r.y + r.height / 2]; });
        await tap(body[0], body[1]); await p.waitForTimeout(300);
        const kept = await fr.evaluate((id) => LOOP.held.some(j => j.id === id), took[0]), unarmed = !(await p.evaluate(() => !!document.querySelector('#bohphone .jc.arm')));
        ok('  a tap anywhere else on the card keeps it', kept && unarmed);
        await tap(xs[0], xs[1]); await p.waitForTimeout(300);
        const dr = await p.evaluate(() => { const b = document.querySelector('#bohphone .jc.arm .dr'); const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
        await tap(dr[0], dr[1]); await p.waitForTimeout(500);
        const after = await fr.evaluate((id) => ({ held: LOOP.held.map(j => j.id), settled: (BohemiaJobKinds.settledPeek ? BohemiaJobKinds.settledPeek() : []) }), took[0]);
        const c1 = await COL();
        ok('  DROP drops it through the board\'s own drop (its cost waits for the town), and the card goes: one job held, one card, one slot EMPTY, READY TO GO', after.held.indexOf(took[0]) < 0 && c1.cards.length === 1 && c1.cards[0].id === took[1] && /\bmq\b/.test(c1.first) && c1.empty === 1
          && JSON.stringify(after.settled || []).indexOf(took[0].split('-')[0]) >= -1, 'held ' + after.held.join(',') + ' settled ' + JSON.stringify(after.settled).slice(0, 80));
        await fr.evaluate(() => { try { LOOP.held.slice().forEach(j => BohemiaJobKinds.drop(j.id)); } catch (e) {} });
        await p.waitForTimeout(400);
        /* ---- HEAL (rule 226): the cross over the company's one bar ---- */
        /* HEAL (rules 226(c), 232(b): 'a medical icon maybe in a circle'): the cross inside a ring, the ring filled with the company's
           blood and armour from CAMP's numbers (BohemiaMapCamp.condition()), no word on it; read back off the ring's own pixels at
           72 angles from the top, clockwise: red over the blood's share, then what blood is missing (dark), grey over the armour's, then
           what armour is missing */
        const cond = await fr.evaluate(() => BohemiaPhone.P.condition());
        const HB = await p.evaluate(() => { const b = document.querySelector('#bohphone .app[data-app=heal]'); if (!b) return null; const cv = b.querySelector('canvas.rg'), lab = b.querySelector('.lab');
          const on = !!cv && getComputedStyle(cv).display !== 'none' && cv.getBoundingClientRect().width > 0;
          return { img: b.querySelector('img').getAttribute('src'), word: lab && getComputedStyle(lab).display !== 'none' ? lab.textContent : '', on, cw: cv ? cv.width : 0, ch: cv ? cv.height : 0,
            ring: BohemiaPhone.ring ? BohemiaPhone.ring() : null, blood: +b.dataset.blood, armour: +b.dataset.armour,
            px: on ? Array.from(cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data) : null }; });
        let miss = 0, reds = 0, greys = 0, seen = [];
        if (HB && HB.px && HB.ring) {
          const tot = cond.hpMax + cond.armMax, cut = [cond.hp / tot, cond.hpMax / tot, (cond.hpMax + cond.arm) / tot], want = t => t < cut[0] ? 'r' : t < cut[1] ? '.' : t < cut[2] ? 'g' : '.';
          const cx = HB.ring.cx * HB.cw, cy = HB.ring.cy * HB.ch, rr = (HB.ring.ro + HB.ring.ri) / 2 * HB.cw;
          for (let i = 0; i < 72; i++) { const t = (i + 0.5) / 72, th = 2 * Math.PI * t, x = Math.round(cx + rr * Math.sin(th)), y = Math.round(cy - rr * Math.cos(th)), q = (y * HB.cw + x) * 4;
            const r = HB.px[q], g = HB.px[q + 1], al = HB.px[q + 3], got = al < 40 ? '.' : r > 1.6 * g ? 'r' : 'g'; seen.push(got);
            if (got === 'r') reds++; if (got === 'g') greys++;
            if (cut.some(c => Math.abs(c - t) < 0.02)) continue; if (got !== want(t)) miss++; } }
        ok('HEAL: a medical cross inside a ring, no word on it; the ring is the company: red over the blood\'s share, grey over the armour\'s, the dark what is missing (CAMP\'s numbers)',
          !!HB && /app_heal/.test(HB.img) && !HB.word && HB.on && miss <= 2 && reds > 0 && greys > 0 && Math.abs(HB.blood - cond.blood) < 0.002 && Math.abs(HB.armour - cond.armour) < 0.002,
          HB && ('ring ' + seen.join('') + ', ' + miss + ' off; blood ' + HB.blood + ' / ' + (cond.blood != null ? cond.blood.toFixed(3) : '-') + ' armour ' + HB.armour + ' (' + cond.from + ')' + (HB.word ? ', a word: ' + HB.word : '')));
        /* ---- CREW ---- */
        await tapApp('crew'); await p.waitForTimeout(1800);
        const CR = await fr.evaluate(() => { const w = document.getElementById('crewdoor'); const f = w && w.querySelector('iframe'); return f ? f.getAttribute('src') : null; });
        ok('CREW opens the company screen in one tap', /ROSTER_SCREEN/.test(CR || ''), CR);
        const rf = p.frames().find(f => /ROSTER_SCREEN/.test(f.url()));
        if (rf) { await rf.waitForLoadState().catch(() => {}); await p.waitForTimeout(800); U = await under([rf]); ok('  no press of the company screen lies under the phone', !U.length, U.join(' | ') || 'none'); }
        await fr.evaluate(() => { try { BohemiaCrewDoor.close(); } catch (e) {} }); await p.waitForTimeout(500);
        /* ---- CAMP ---- */
        /* a crew in sight refuses a camp (the map's campOnMap, Battle Brothers' risk): the walk to the job above can raise one, so the
           road is quiet first, the way CAMP's own gate does it (contact, hunt and meet cleared); the press below is the real one */
        const quiet = await fr.evaluate(() => { try { contactClear(); } catch (e) {} try { HUNT = null; HUNT_FLEE = null; } catch (e) {} const met = !!(window.MEET && MEET.up); try { const b = document.querySelector('[data-meet="back"]'); if (MEET.up && b) b.click(); } catch (e) {}   /* a crew met: FALL BACK, his own button */
          try { travelStop(); } catch (e) {} return { met, meet: !!(window.MEET && MEET.up), fighting: !!LOOP.fighting, mode: MODE }; });
        await p.waitForTimeout(400);
        const pr0 = await p.evaluate(() => window.__PHONE_PRESSES | 0);
        await tapApp('heal'); await p.waitForTimeout(2500);
        const pr1 = await p.evaluate(() => window.__PHONE_PRESSES | 0);
        /* the harness loses the first touch after a screen it closed by hand (the crew screen above, closed by code, never a finger):
           a lost press is retried ONCE before it is called a dead button, and the retry is said */
        let healTries = 1;
        if (!(await fr.evaluate(() => BohemiaMapCamp.on())) && await fr.evaluate(() => campOnMap())) { healTries = 2; await tapApp('heal'); await p.waitForTimeout(2500); }
        const CA = await p.evaluate('(' + PHONE + ')()'), campOn = await fr.evaluate(() => BohemiaMapCamp.on());
        const CW = await p.evaluate(() => BohemiaPhone.wall());
        SIZES.camp = two(CA);
        const caLab = await p.evaluate(() => (document.querySelector('#bohphone .app[data-app=heal]') || { getAttribute: () => '' }).getAttribute('aria-label'));
        ok('HEAL makes camp in one tap: the phone says so, the same rectangle, the camp\'s own picture behind it', campOn && CA.screen === 'camp' && same(CA.R, M.R) && /break camp/i.test(caLab) && CW && CW.what === 'place',
          'camp ' + campOn + ', ' + CA.screen + ' ' + fmt(CA.R) + ', wall ' + (CW && CW.what) + ', before: ' + JSON.stringify(quiet) + (healTries > 1 ? ', the second touch (the first ' + (pr1 > pr0 ? 'reached the phone' : 'never reached the phone') + ')' : ''));
        const sfC = p.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url()));
        if (sfC) { U = await under([sfC]); ok('  no press of the camp lies under the phone', !U.length, U.join(' | ') || 'none'); }
        await tapApp('heal'); await p.waitForTimeout(1200);
        ok('  BREAK CAMP breaks it', !(await fr.evaluate(() => BohemiaMapCamp.on())) && (await p.evaluate('(' + PHONE + ')()')).screen === 'map');
      }
      /* ---- THE TOWN ---- */
      await fr.evaluate(() => { const bs = ctBases(); let best = null; for (const n in bs) { if (bs[n]) { best = { name: n, x: bs[n].x | 0, y: bs[n].y | 0, tier: mapTierOf(n) }; break; } } if (best) loopOpenTown(best); });
      const sf = await (await fr.waitForSelector('#settleFrame')).contentFrame();
      await sf.waitForFunction(() => !!document.getElementById('bmcorner'), null, { timeout: 30000 }).catch(() => {});
      await p.waitForTimeout(2200);
      const T = await p.evaluate('(' + PHONE + ')()');
      const TR = await sf.evaluate(() => { const r = BOH_PHONE_RECT(); let x = 0, y = 0, w = window; while (w.frameElement) { const q = w.frameElement.getBoundingClientRect(); x += q.left; y += q.top; w = w.parent; } return { left: r.left + x, top: r.top + y, width: r.width, height: r.height }; });
      ok('[' + sd + '] the town: the phone in the map\'s rectangle, the same size; the town\'s own page answers it', T.on && T.screen === 'town' && same(T.R, M.R) && same(T.dom, M.R) && same(TR, M.R), fmt(T.R) + ' town ' + fmt(TR));
      U = await under([fr, sf]);
      ok('  no press of the town lies under the phone (LEAVE stands over it)', !U.length, U.join(' | ') || 'none');
      SIZES.town = two(T);
      /* rule 279(b): the town re-lays in the same beat when the side changes, so the town's own page hears it at once: one source
         (BOH_PHONE_RECT, BohemiaPhone.side() in its own frame) and one event ('bohemia-phone', detail.side) */
      if (sd === 'right') {
        await sf.evaluate(() => { window.__sideEv = []; window.addEventListener('bohemia-phone', e => { window.__sideEv.push({ side: e.detail && e.detail.side, t: performance.now() }); }); });
        const t0 = await sf.evaluate(() => performance.now());
        await p.evaluate(() => BohemiaPhone.setSide('left'));
        const flip = await sf.evaluate((t0) => { const r = BOH_PHONE_RECT(), ev = window.__sideEv.filter(e => e.side === 'left')[0];
          return { side: r.side, sideCall: BohemiaPhone.side(), left: r.left, W: innerWidth, ev: !!ev, ms: ev ? Math.round(ev.t - t0) : null }; }, t0);
        await p.evaluate(() => BohemiaPhone.setSide('right')); await p.waitForTimeout(300);
        const back = await sf.evaluate(() => ({ side: BOH_PHONE_RECT().side, n: window.__sideEv.length }));
        ok('  the side changed in a town: the town\'s own page hears it in the same beat (one event, one rectangle, one side)', flip.ev && flip.ms !== null && flip.ms <= 500 && flip.side === 'left' && flip.sideCall === 'left' && flip.left < flip.W / 2 && back.side === 'right',
          JSON.stringify(flip) + ' back ' + back.side);
      }
      { const ks = Object.keys(SIZES), base = SIZES.map || {}, eq = (a, b) => !!a && !!b && Math.abs(a[0] - b[0]) <= TOL && Math.abs(a[1] - b[1]) <= TOL;
        ok('  PLAY/PAUSE and HEAL are on the phone at one size on every screen (232(b): ' + ks.join(', ') + ')', !!base.play && !!base.heal && ks.every(k => eq(SIZES[k].play, base.play) && eq(SIZES[k].heal, base.heal)),
          ks.map(k => k + ' ' + JSON.stringify(SIZES[k])).join(' | ')); }
      await tapIn(sf, '#leave'); await p.waitForTimeout(1500);
      /* ---- THE FIGHT ---- */
      const c0 = await p.evaluate(() => window.__PHONE_COMBAT | 0);
      await fr.evaluate((n) => { try { CITY_CONTACT_POSTED = false; } catch (e) {} return roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: n }); }, sd === 'right' ? 1 : 2);   /* the last fight's contact let go, as the next step would */
      let sawStrike = false, f = null;
      await p.waitForTimeout(100);
      for (let i = 0; i < 200; i++) {
        if (!sawStrike) sawStrike = await p.evaluate(() => { const c = document.querySelector('#bohphone .cmb.on'), e = document.getElementById('bohphone'); if (!c || !e.classList.contains('on')) return false;
          const r = c.getBoundingClientRect(), h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return !!h && !!h.closest('#bohphone'); }).catch(() => false);
        const h = await p.$('#fightFrame'); if (h) { f = await h.contentFrame(); if (f && sawStrike && await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board).catch(() => false)) break; }
        await p.waitForTimeout(60);
      }
      await p.waitForTimeout(2600);
      const FT = await p.evaluate('(' + PHONE + ')()');
      ok('[' + sd + '] the fight: combat time plays on the phone at the start (seen on the glass)', sawStrike && (await p.evaluate(() => window.__PHONE_COMBAT | 0)) > c0, 'strike seen ' + sawStrike);
      ok('  the phone in the same rectangle, the same size', FT.on && FT.screen === 'fight' && same(FT.R, M.R) && same(FT.dom, M.R) && same(await f.evaluate(() => BOH_PHONE_RECT()), M.R), fmt(FT.R));
      const AB = await f.evaluate(() => { const vis = e => e.getBoundingClientRect().width > 0 && getComputedStyle(e).display !== 'none';
        return { name: (document.getElementById('cnm') || {}).textContent, onBar: [...document.querySelectorAll('#skills .sq')].filter(b => (b.classList.contains('bag') || b.dataset.sweep || b.dataset.skill) && vis(b)).length,
          all: [...document.querySelectorAll('#skills .sq')].filter(b => b.classList.contains('bag') || b.dataset.sweep || b.dataset.skill).length,
          keep: ['bend', 'bauto', 'bflee'].map(id => { const e = document.getElementById(id); return e && vis(e) ? id : null; }).filter(Boolean) }; });
      const PF = await p.evaluate(() => ({ head: (document.querySelector('#bohphone .fh b') || {}).textContent, n: document.querySelectorAll('#bohphone .ab .sk:not([aria-label=empty])').length }));
      ok('  the abilities open from it: his name, his abilities on the phone and off the fight\'s bar', FT.fight && !FT.home && String(AB.name || '').replace(/\s*\*$/, '').indexOf(PF.head) === 0 && PF.head && AB.onBar === 0 && PF.n === Math.min(12, AB.all),
          'head ' + PF.head + ', phone ' + PF.n + ', fight ' + AB.all + ' (on its bar ' + AB.onBar + ')');
      ok('  END TURN, AUTO and RETREAT stay on the fight\'s bar', AB.keep.length === 3, AB.keep.join(' '));
      U = await under([f]);
      ok('  no press of the fight lies under the phone', !U.length, U.join(' | ') || 'none');
      if (sd === 'right') {
        /* a planted ability: the fight's own square, pressed from the phone */
        await f.evaluate(() => { const sk = document.getElementById('skills'), b = document.createElement('button'); b.className = 'sq'; b.dataset.skill = 'plant'; b.title = 'PLANTED';
          const c = document.createElement('canvas'); c.width = c.height = 30; b.appendChild(c); const t = document.createElement('b'); t.textContent = '4'; b.appendChild(t);
          b.onclick = function () { window.__plantPressed = (window.__plantPressed | 0) + 1; }; sk.appendChild(b); });
        await p.waitForTimeout(600);
        const pb = await p.evaluate(() => { const b = [...document.querySelectorAll('#bohphone .ab .sk')].find(x => x.title === 'PLANTED'); if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
        if (pb) await tap(pb[0], pb[1]);
        await p.waitForTimeout(300);
        const pressed = await f.evaluate(() => window.__plantPressed | 0);
        ok('  a press on the phone presses the fight\'s own ability button', !!pb && pressed === 1, 'pressed ' + pressed);
        await f.evaluate(() => { const b = document.querySelector('#skills .sq[data-skill=plant]'); if (b) b.remove(); });
      }
      /* the fight ends (won, as the spoils gate wins it): the phone strikes back to its apps; the spoils wait; LEAVE goes home */
      const o0 = await p.evaluate(() => window.__PHONE_COMBAT_OUT | 0);
      await f.evaluate(() => { const S = FIGHT.S; S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; }); S.over = true; S.result = 'won'; showOver('won'); });
      await until(() => p.evaluate(() => (window.__PHONE_COMBAT_OUT | 0) > 0 && !!(window.SPOILS && SPOILS.frame)), 20000);
      await p.waitForTimeout(2500);
      const EN = await p.evaluate('(' + PHONE + ')()');
      ok('  the moment the fight is won the phone strikes back to its apps, in the same rectangle', EN.home && !EN.fight && (await p.evaluate(() => window.__PHONE_COMBAT_OUT | 0)) > o0 && same(EN.R, M.R), EN.screen + ' home ' + EN.home);
      const sh = await p.$('#spoilsdoor iframe'), spf = sh && await sh.contentFrame();
      if (spf) {
        await spf.waitForFunction(() => { const e = document.getElementById('leave'); return !!e && e.getBoundingClientRect().width > 0; }, null, { timeout: 15000 }).catch(() => {});
        U = await under([spf]); ok('  no press of the spoils lies under the phone', !U.length, U.join(' | ') || 'none');
        await tapIn(spf, '#leave');
      }
      await until(() => p.evaluate(() => { const e = document.getElementById('bohphone'); return e.dataset.screen === 'map'; }), 25000);
      await p.waitForTimeout(800);
      const BK = await p.evaluate('(' + PHONE + ')()');
      ok('  home on the map, the same phone, its apps', BK.screen === 'map' && BK.home && !BK.fight && same(BK.R, M.R), BK.screen + ' ' + fmt(BK.R));
    }
    ok('nothing thrown', !errs.length, errs.slice(0, 3).join(' | '));
  } catch (e) { ok('the walk finished', false, String(e && e.stack || e).slice(0, 300)); }
  await p.evaluate(() => { try { localStorage.removeItem('bohemia.phone.v1'); localStorage.removeItem('bohemia.company.name.v1'); } catch (e) {} }).catch(() => {});
  await d.close();
}

(async () => {
  for (const pr of PROFILES) await side(pr);
  console.log('\nTHE PHONE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
