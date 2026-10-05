/* ==========================================================================
   THE START SCREEN  (RUN, 10/4/26, VAMILY [the start screen], rule 66)

   PAOLO 10/2: "the UI sucks... there should be a start screen: new game, continue game, settings."
   MEASURED BEFORE: the demo opened on the loading terminal with the picks laid over it; one save and no
   way to start over; no settings until he was in; and every CONTINUE paid the start batteries again
   (the 'paid once' flag lived in memory only).
   NOW (__THE_START_SCREEN__ in the shell): Battle Brothers' own door -- the title over the valley's far
   stop seen by the power authority's last camera, his logo, NEW GAME / CONTINUE / SETTINGS and NOTES.

   LEGS, driven on the demo with real touches, at the phone's profile:
     T1 the demo opens on the title, over the whole glass: the camera's picture, his logo, three choices
     T2 the menu is clear of the door's BEGIN, upright and on its side (a finger aimed at BEGIN never
        lands on a title button)
     T3 a stray tap on the picture does not skip the title
     T4 with no save, CONTINUE is off and does nothing
     T5 SETTINGS opens the game's one settings card OVER the title, without its save/quit row, and
        closing it is the title again
     T6 NOTES keeps a note in the game's own notes list, marked as written on the start screen
     T7 NEW GAME is the door's picks, and BEGIN is the game, paid its start once
     T8 *** CONTINUE ***: back on the title after a reload, it names the saved day, and a tap is the game
        with the SAME purse (the start batteries are not paid again)
     T8b the start is paid once per GAME: the picks arriving again never pay a paid crew twice
     T9 *** NEW GAME OVER A SAVE ***: it asks first; asked twice it starts over -- the picks, no title, a
        new game with nothing in the purse until BEGIN pays its start, and the notes kept
     T10 the door's own way in still works with the title up (a click on BEGIN enters, for every driver)
     T11 nothing threw
   node gates/the_start_screen_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE START SCREEN: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const titleState = () => {
  const t = document.getElementById('title'), vis = el => { if (!el) return false; const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden'; };
  /* whichever look the title wears: RUN's fallback plates (cont, set; a span) or UI's piece (continue, settings; an i) */
  const ui = !!(t && t.classList.contains('ui') && t.querySelector('.bm-start'));
  const it = k => { const kk = ui ? ({ cont: 'continue', set: 'settings' })[k] || k : k; const e = t && (ui && k !== 'notes' ? t.querySelector('.bm-start [data-k=' + kk + ']') : t.querySelector('[data-k=' + kk + ']'));   /* NOTES is RUN's, on top of either look */ if (!e) return null; const r = e.getBoundingClientRect(); const sub = e.querySelector('i') || e.querySelector('span');
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, top: r.top, bottom: r.bottom, left: r.left, right: r.right, off: e.classList.contains('off') || !!e.disabled, b: e.querySelector('b') ? e.querySelector('b').textContent : '', sub: sub ? sub.textContent : '', vis: vis(e) }; };
  const ft = document.getElementById('fronttap'), fr = ft ? ft.getBoundingClientRect() : null, front = document.getElementById('front');
  const tr = t ? t.getBoundingClientRect() : null, logo = t && t.querySelector('.logo img'), mark = t && t.querySelector('.bm-start .t canvas, .bm-start .t .word');
  const feed = t && t.querySelector('.feed'), bg = feed ? getComputedStyle(feed).backgroundImage : '', gr = t && t.querySelector('.bm-start>canvas.gr');
  return { ui, up: vis(t) && !t.classList.contains('gone'), cover: !!tr && tr.width >= innerWidth - 1 && tr.height >= innerHeight - 1, logo: ui ? !!mark : !!(logo && logo.naturalWidth), bg, ground: gr ? gr.width : 0,
    new: it('new'), cont: it('cont'), set: it('set'), notes: it('notes'), tap: fr && fr.height > 0 ? { top: fr.top, bottom: fr.bottom, left: fr.left, right: fr.right, x: fr.x + fr.width / 2, y: fr.y + fr.height / 2 } : null,
    front: !!front && getComputedStyle(front).display !== 'none', began: !!window.__PLAY_BEGAN, ready: !!window.__LOAD_READY, iw: innerWidth, ih: innerHeight };
};
const hits = (a, b) => !!a && !!b && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

(async () => {
  let d, pre = {};
  try {
    d = await drive.open({ keepCards: true, beforeTap: async (page) => {
      /* everything before the game, on the title the way a person meets it */
      for (let i = 0; i < 60; i++) { const s = await page.evaluate(titleState); if (s.up && s.ready) break; await page.waitForTimeout(250); }
      pre.t1 = await page.evaluate(titleState);
      /* the picture behind: UI's painted ground when their look is worn, else the camera feed's image, loaded */
      pre.bgOk = pre.t1.ui ? pre.t1.ground : await page.evaluate(() => new Promise(res => { const m = /url\("?([^")]+)"?\)/.exec(getComputedStyle(document.querySelector('#title .feed')).backgroundImage); if (!m) return res(0); const i = new Image(); i.onload = () => res(i.naturalWidth); i.onerror = () => res(0); i.src = m[1]; }));
      await page.setViewportSize({ width: 844, height: 390 }); await page.waitForTimeout(900);
      pre.side = await page.evaluate(titleState);
      await page.setViewportSize({ width: pre.t1.iw, height: pre.t1.ih }); await page.waitForTimeout(900);
      pre.up = await page.evaluate(titleState);
      /* T3: a tap on the picture, above the menu and away from everything */
      await page.touchscreen.tap(pre.up.iw / 2, Math.max(60, pre.up.new.top - 40)); await page.waitForTimeout(600);
      pre.t3 = await page.evaluate(titleState);
      /* T4 */
      await page.touchscreen.tap(pre.up.cont.x, pre.up.cont.y); await page.waitForTimeout(600);
      pre.t4 = await page.evaluate(titleState);
      /* T5 */
      await page.touchscreen.tap(pre.up.set.x, pre.up.set.y); await page.waitForTimeout(600);
      pre.t5 = await page.evaluate(() => { const w = document.getElementById('setwrap'), c = document.getElementById('setcard'); const r = c ? c.getBoundingClientRect() : null;
        const top = r ? document.elementFromPoint(r.x + r.width / 2, r.y + 20) : null; const v = el => !!el && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 0;
        return { open: !!w && w.classList.contains('on'), onTop: !!top && !!c && c.contains(top), save: v(document.getElementById('setsave')), quit: v(document.getElementById('setquit')) }; });
      await page.evaluate(() => { try { BOHEMIA_SETTINGS.close(); } catch (_e) {} }); await page.waitForTimeout(700);
      pre.t5b = await page.evaluate(titleState);
      /* T6 */
      await page.touchscreen.tap(pre.up.notes.x, pre.up.notes.y); await page.waitForTimeout(400);
      await page.fill('#title .sheet textarea', 'the start screen gate wrote this');
      const ks = await page.evaluate(() => { const r = document.querySelector('#title [data-k=nsave]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      await page.touchscreen.tap(ks.x, ks.y); await page.waitForTimeout(300);
      pre.t6 = await page.evaluate(() => { const a = JSON.parse(localStorage.getItem('bohemia.notes.v1') || '[]'); const n = a[a.length - 1] || {}; return { n: a.length, text: n.text, where: n.ctx && n.ctx.where }; });
      const kc = await page.evaluate(() => { const r = document.querySelector('#title [data-k=nclose]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      await page.touchscreen.tap(kc.x, kc.y); await page.waitForTimeout(300);
      /* T7: NEW GAME is the picks */
      await page.touchscreen.tap(pre.up.new.x, pre.up.new.y); await page.waitForTimeout(600);
      pre.t7 = await page.evaluate(() => ({ title: !document.getElementById('title').classList.contains('gone'), picks: [...document.querySelectorAll('#newco button')].filter(b => b.getBoundingClientRect().width > 0).length,
        front: getComputedStyle(document.getElementById('front')).display !== 'none' }));
    } });
  } catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  const page = d.page;
  try {
    const t1 = pre.t1;
    ok('T1 the demo opens on the title, over the whole glass (' + (t1.ui ? 'UI\'s look' : 'the fallback look') + ', ' + (t1.up ? 'up' : 'not up') + ', covers ' + t1.cover + ', the picture behind ' + pre.bgOk + ' px wide, his logo ' + t1.logo + ', ' + [t1.new, t1.cont, t1.set].filter(x => x && x.vis).map(x => x.b).join(' / ') + ')',
      t1.up && t1.cover && (t1.ui ? pre.bgOk >= Math.floor(t1.iw / 2) - 1 : pre.bgOk > 300) &&   /* UI paints its ground at half the screen's pixels on purpose */
      t1.logo && [t1.new, t1.cont, t1.set].every(x => x && x.vis) && t1.new.b === 'NEW GAME' && t1.cont.b === 'CONTINUE' && t1.set.b === 'SETTINGS');
    const clear = s => ['new', 'cont', 'set', 'notes'].every(k => !hits(s[k], s.tap));
    ok('T2 the menu is clear of the door\'s BEGIN, upright and on its side (upright ' + clear(pre.up) + ', BEGIN at ' + (pre.up.tap ? Math.round(pre.up.tap.top) : '?') + ', the menu ends at ' + Math.round(pre.up.set.bottom) + '; on its side ' + clear(pre.side) + ')',
      !!pre.up.tap && !!pre.side.tap && clear(pre.up) && clear(pre.side) && pre.side.set.vis);
    ok('T3 a stray tap on the picture does not skip the title (still up ' + pre.t3.up + ', the game began ' + pre.t3.began + ')', pre.t3.up && !pre.t3.began && pre.t3.front);
    ok('T4 with no save, CONTINUE is off and does nothing ("' + pre.t1.cont.sub + '", off ' + pre.t1.cont.off + '; after a tap the title is up ' + pre.t4.up + ')', pre.t1.cont.off && pre.t4.up && !pre.t4.began);
    ok('T5 SETTINGS opens the settings card over the title, without save and quit, and closing it is the title again (' + JSON.stringify(pre.t5) + ', after: title ' + pre.t5b.up + ')',
      pre.t5.open && pre.t5.onTop && !pre.t5.save && !pre.t5.quit && pre.t5b.up && !pre.t5b.began);
    ok('T6 NOTES keeps a note in the game\'s notes list (' + JSON.stringify(pre.t6) + ')', pre.t6.text === 'the start screen gate wrote this' && pre.t6.where === 'the start screen');
    /* the driver knocked BEGIN after the picks: in the game now */
    await page.waitForTimeout(3000);
    const g7 = await d.fr.evaluate(() => ({ bats: loopBats(), start: LOOP.start ? LOOP.start.start : null }));
    ok('T7 NEW GAME is the door\'s picks, and BEGIN is the game, paid its start once (' + pre.t7.picks + ' picks showing, title gone ' + !pre.t7.title + '; in the game with ' + g7.bats + ' batteries for a start of ' + g7.start + ')',
      !pre.t7.title && pre.t7.front && pre.t7.picks >= 6 && g7.start > 0 && g7.bats === g7.start);

    /* T8: a save exists once the city has written one; reload, CONTINUE */
    /* the game saves the way it does when he leaves it: the map's own state flush (pagehide calls the same) */
    await d.fr.evaluate(() => { try { flushState(); } catch (_e) {} });
    let saved = 0; for (let i = 0; i < 30; i++) { saved = await page.evaluate(() => { try { const x = CITYSAVE.load(); return x && x.data ? x.data.day | 0 : 0; } catch (_e) { return 0; } }); if (saved >= 1) break; await page.waitForTimeout(500); }
    const purse0 = g7.bats;
    const back = async () => { await page.reload(); for (let i = 0; i < 120; i++) { const s = await page.evaluate(titleState).catch(() => null); if (s && s.up && s.ready) return s; await page.waitForTimeout(500); } return page.evaluate(titleState).catch(() => null); };
    const cityFrame = async () => { for (let i = 0; i < 60; i++) { const f = page.frames().find(f => /BOHEMIA_CITY_WORLD/.test(f.url())); if (f && await f.evaluate(() => typeof loopBats === 'function' && typeof LOOP !== 'undefined').catch(() => false)) return f; await page.waitForTimeout(500); } return null; };
    const s8 = await back();
    await page.touchscreen.tap(s8.cont.x, s8.cont.y);
    let in8 = false; for (let i = 0; i < 30 && !in8; i++) { await page.waitForTimeout(400); in8 = await page.evaluate(() => !!window.__PLAY_BEGAN && getComputedStyle(document.getElementById('front')).display === 'none'); }
    await page.waitForTimeout(2500);
    const f8 = await cityFrame(); const b8 = f8 ? await f8.evaluate(() => loopBats()) : null;
    ok('*** T8 CONTINUE *** (saved on day ' + saved + '; "' + (s8 && s8.cont.sub) + '", off ' + (s8 && s8.cont.off) + '; a tap: in the game ' + in8 + ' with ' + b8 + ' batteries, ' + purse0 + ' when it was saved)',
      !!s8 && !s8.cont.off && /^DAY \d+/.test(s8.cont.sub) && in8 && b8 === purse0);

    /* T8b: the start is paid once per GAME. Measured: after CONTINUE the map restores the save a second time,
       which happens to put the saved purse back over a second start payment, so the double pay hid behind timing.
       The guard is the purse's own ledger; asked directly (the in-memory flag cleared, the picks sent again),
       a crew that was paid is not paid twice. */
    const g8b = f8 ? await f8.evaluate(() => new Promise(res => { const n0 = (purseGet().entries || []).filter(e => e.ref && String(e.ref).indexOf('start:') === 0).length, b0 = loopBats();
      LOOP.startPaid = false; window.postMessage({ type: 'BOHEMIA_START', picks: LOOP.start }, '*');
      setTimeout(() => res({ n0, b0, n1: (purseGet().entries || []).filter(e => e.ref && String(e.ref).indexOf('start:') === 0).length, b1: loopBats() }), 600); })) : null;
    ok('T8b the start is paid once per game, not per sitting (start payments ' + (g8b && g8b.n0) + ' -> ' + (g8b && g8b.n1) + ', batteries ' + (g8b && g8b.b0) + ' -> ' + (g8b && g8b.b1) + ' when the picks arrive again)',
      !!g8b && g8b.n0 === 1 && g8b.n1 === 1 && g8b.b1 === g8b.b0);

    /* T9: NEW GAME over the save: asks, then starts over */
    const s9 = await back();
    await page.touchscreen.tap(s9.new.x, s9.new.y); await page.waitForTimeout(400);
    const ask = await page.evaluate(titleState);
    await Promise.all([page.waitForNavigation({ timeout: 30000 }).catch(() => null), page.touchscreen.tap(s9.new.x, s9.new.y)]);
    let s9b = null; for (let i = 0; i < 120; i++) { s9b = await page.evaluate(() => ({ title: !!document.getElementById('title') && !document.getElementById('title').classList.contains('gone'), titleBuilt: !!document.getElementById('title'),
        picks: [...document.querySelectorAll('#newco button')].filter(b => b.getBoundingClientRect().width > 0).length, ready: !!window.__LOAD_READY, notes: JSON.parse(localStorage.getItem('bohemia.notes.v1') || '[]').length })).catch(() => null); if (s9b && s9b.ready) break; await page.waitForTimeout(500); }
    const f9 = await cityFrame(); const b9a = f9 ? await f9.evaluate(() => loopBats()) : null;
    await page.evaluate(() => document.getElementById('front').click()); await page.waitForTimeout(2500);
    const b9b = f9 ? await f9.evaluate(() => ({ bats: loopBats(), start: LOOP.start ? LOOP.start.start : null })) : null;
    ok('*** T9 NEW GAME OVER A SAVE *** (first tap: "' + ask.new.b + ' / ' + ask.new.sub + '"; second: the picks ' + (s9b && s9b.picks) + ', title ' + (s9b && s9b.title) + '; the purse ' + b9a + ' before BEGIN, ' + (b9b && b9b.bats) + ' after for a start of ' + (b9b && b9b.start) + '; notes ' + (s9b && s9b.notes) + ')',
      ask.up && /START OVER\?|TAP AGAIN/.test(ask.new.b) && /ends day \d+/i.test(ask.new.sub) && !!s9b && !s9b.title && s9b.picks >= 6 && b9a === 0 && !!b9b && b9b.start > 0 && b9b.bats === b9b.start && s9b.notes >= pre.t6.n);

    /* T10: with the title up, the door's own BEGIN is still the way in (every driver and gate goes this way) */
    const s10 = await back();
    await page.evaluate(() => document.getElementById('fronttap').click()); await page.waitForTimeout(1200);
    const in10 = await page.evaluate(() => ({ began: !!window.__PLAY_BEGAN, front: getComputedStyle(document.getElementById('front')).display !== 'none' }));
    ok('T10 the door\'s own way in still works with the title up (title up ' + (s10 && s10.up) + '; a click on BEGIN: the game began ' + in10.began + ', the door gone ' + !in10.front + ')', !!s10 && s10.up && in10.began && !in10.front);
    ok('T11 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 120) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 200) + ']', false);
  }
  await d.close();
  done();
})();
