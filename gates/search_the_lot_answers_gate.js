/* ==========================================================================
   SEARCH THE LOT ANSWERS  (TOWN FIX, 11/9/26, VAMILY rule 438(b), ask line 524)

   PAOLO 11/8: 'I clicked the scavenge button and then I pressed search the lot, it says it'll take four hours, I press it and
   nothing happens.'

   MEASURED BEFORE THE FIX (the demo, phone upright, a fresh game, all 14 places, a real finger on the lot):
     - 8 of 14 places (Church, Blues, Network, Caravans, Cartel, Mob, Remnants, Volunteers) showed 'Search the lot, 4 hours' as a
       GREY button that did nothing: the lot took the map cell's district (a park, a school, a truck stop, storage, a resort, the
       radio, a prison), WORLD's engine searches none of those, so the lot held zero from the first second;
     - every place shared ONE lot count, so one town searched out greyed every town's lot for the rest of the game;
     - the reason never reached the glass: the town's own line ('Nobody out here today... More for me.') stood where 'Nothing left'
       would have, so he read four hours, pressed, and got silence.
   And the open itself showed a blank brown screen until the game's page had loaded and the block's board had baked.

   THE RULE (438(b)): the button answers AT ONCE every time: the game opens with something on the glass from the first frame, or
   YOU says why not in a line. Never a grey button, never silence.

   THE LEGS, per surface (the ALPHA and the DEMO) and phone shape (upright and on its side):
     P   every place on the map: a finger on the lot opens its sheet; 'Search the lot' is live, never grey, and on a fresh game
         every lot holds its six ('4 hours' on its face)
     A1  the press answers at once: the cover is in the town's page the same task as the press (under 50 ms), and from the TOP page
         a finger at the glass's middle lands on it, not on the town (under 400 ms, the frame chain walked)
     A2  the game comes up on the block's board ('play') and LEAVE gives the town back with YOU's line
     A3  a second press at the same lot opens the game again
     A4  a lot searched out says so: its face reads 'nothing left', a press has YOU say 'Nothing left on this lot' at once, no game;
         and the next place's lot is still whole (one town never empties another)
     A5  the dead on the lot: a press searches a body at once (YOU: 'Off one of the dead'), then the lot is the game again
     A6  a slow page (5 s planted on the game's page): the cover is on the glass at once and still there at 3 s, then the game
     A7  PLANTED, the game's page missing (404): the press still answers (the cover, then YOU's line 'The block would not come up,
         so I looked the quick way' and the find), and this gate's own 'the game opened' check goes RED with a line naming the
         missing page, never silence
     S   a SAVED game: reload the link, CONTINUE on the title, walk into a town, press: the game opens and LEAVE answers
   AND ONCE PER BOOT: nothing threw.

   Run: node gates/search_the_lot_answers_gate.js [--only demo|alpha] [--shape phone_portrait|phone_landscape] [--shots DIR]
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle, continueThroughTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + String(x).slice(0, 500) + ']' : '')); return g; };
const done = () => { console.log('SEARCH THE LOT ANSWERS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const ONLY = arg('--only'), SHAPE = arg('--shape'), SHOTS = arg('--shots');
const SURFS = ['demo', 'alpha'].filter(s => !ONLY || s === ONLY);
const SHAPES = ['phone_portrait', 'phone_landscape'].filter(s => !SHAPE || s === SHAPE);
const GAME_PAGE = '**/slices/BOHEMIA_SCAVENGE.html';

async function boot(surf, prof) {
  return drive.open({ profile: prof, alpha: surf === 'alpha', keepCards: true, beforeTap: async (pg) => {
    for (let i = 0; i < 200; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
    await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800);
  } });
}
const cityOf = P => P.frames().find(f => /BOHEMIA_CITY_WORLD/.test(f.url()));
const townOf = P => P.frames().filter(f => /SETTLEMENT_SCREEN/.test(f.url()));

/* walk into a place the way the map does (its own door), and wait for its picture */
async function town(P, b) {
  const fr = cityOf(P); if (!fr) return null;
  await fr.evaluate(b => { city.x = b.x; city.y = b.y; loopOpenTown({ name: b.n, x: b.x, y: b.y, tier: b.t }); }, b).catch(() => {});
  for (let i = 0; i < 120; i++) { await P.waitForTimeout(250);
    for (const x of townOf(P))
      if (await x.evaluate(n => { try { const S = BohemiaSettlement; return S.ready() && S.state.place && S.state.place.name === n && !document.getElementById('arrive') && S.picIn(); } catch (e) { return false; } }, b.n).catch(() => false)) return x;
    if (i === 40) await fr.evaluate(() => { try { btwFrameRest(); } catch (e) {} }).catch(() => {}); }
  return null;
}
async function leaveTown(P, sf) {
  await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); const l = document.getElementById('leave'); if (l) l.click(); }).catch(() => {});
  await P.waitForTimeout(1800);
}
/* a real finger on the lot until its sheet is up; returns the button as he sees it */
async function lotSheet(P, sf) {
  const fb = await (await sf.frameElement()).boundingBox();
  await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }).catch(() => {});   /* the sheet drawn fresh, as a new tap draws it */
  await P.waitForTimeout(350);
  for (let k = 0; k < 6; k++) {
    const q = await sf.evaluate(() => BohemiaSettlement.where('lot')).catch(() => null);
    if (q) await P.touchscreen.tap(fb.x + q.x, fb.y + q.y);
    await P.waitForTimeout(700);
    const b = await sf.evaluate(() => { if (BohemiaSettlement.state.open !== 'lot') return null;
      const e = [...document.querySelectorAll('#sbody .act')].find(x => /Search the lot/.test(x.textContent || '')); if (!e) return { none: true };
      const r = e.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, grey: e.disabled, face: (e.querySelector('em') || {}).textContent || '', say: ((document.querySelector('#sbody .say p') || {}).textContent || '').slice(0, 90),
        lot: BohemiaSettlement.lot(), dist: BohemiaSettlement.state.place.district }; }).catch(() => null);
    if (b) return Object.assign(b, { fx: fb.x, fy: fb.y });
  }
  return null;
}
/* the press, with a real finger, timed in the town's own page: the click, then the cover or the game frame, then any answer */
async function press(P, sf, b) {
  await sf.evaluate(() => { window.__lotT = { click: null, cover: null, n0: (window.__settleLog || []).length };
    document.addEventListener('click', function f(e) { if (e.target.closest && e.target.closest('.act')) { window.__lotT.click = performance.now(); document.removeEventListener('click', f, true); } }, true);
    const mo = new MutationObserver(() => { if (window.__lotT.cover == null && (document.getElementById('scavcover') || document.getElementById('scavgame'))) { window.__lotT.cover = performance.now(); mo.disconnect(); } });
    mo.observe(document.body, { childList: true }); window.__lotT.mo = 1; });
  await P.touchscreen.tap(b.fx + b.x, b.fy + b.y);
}
/* what answered, read from the town's page */
const answer = sf => sf.evaluate(() => { const T = window.__lotT || {}, nw = (window.__settleLog || []).slice(T.n0 || 0).map(m => m.act);
  return { acts: nw, coverMs: T.click != null && T.cover != null ? Math.round(T.cover - T.click) : null, clicked: T.click != null,
    say: ((document.querySelector('#sbody .say p') || {}).textContent || '').slice(0, 120), lot: BohemiaSettlement.lot() }; }).catch(e => ({ err: e.message }));
/* from the TOP page, the finger at the glass's middle walked down the frame chain: what it lands on in the town */
async function glassMiddle(P, sf) {
  const W = await P.evaluate(() => [innerWidth, innerHeight]); const pt = [W[0] / 2, W[1] / 2];
  const chain = []; for (let c = sf; c; c = c.parentFrame()) chain.unshift(c);
  let x = pt[0], y = pt[1];
  for (let i = 0; i < chain.length; i++) {
    const hit = await chain[i].evaluate(([x, y]) => { const h = document.elementFromPoint(x, y); if (!h) return { what: 'nothing' };
      if (h.tagName === 'IFRAME') { const r = h.getBoundingClientRect(); return { what: 'IFRAME#' + h.id, src: (h.src || '').split('/').pop(), dx: r.x, dy: r.y }; }
      return { what: h.tagName + '#' + h.id }; }, [x, y]).catch(e => ({ what: 'err ' + e.message }));
    if (i === chain.length - 1) return hit.what;
    if (!/^IFRAME/.test(hit.what) || !chain[i + 1].url().split('?')[0].endsWith(hit.src)) return 'covered at ' + chain[i].url().split('/').pop() + ' by ' + hit.what;
    x -= hit.dx; y -= hit.dy;
  }
  return 'nothing';
}
/* THE CHECK THE PLANT MUST TURN RED: did the game come up after a press? Returns {ok, why} so a red always says what went wrong */
async function gameOpened(P, sf, ms) {
  let last = null;
  for (let t = 0; t < ms; t += 400) {
    last = await sf.evaluate(() => { const f = document.getElementById('scavgame'); let g = null, e = null;
      try { g = f && f.contentWindow && f.contentWindow.SCAV ? f.contentWindow.SCAV.state() : null; } catch (x) { e = x.message; }
      const nw = (window.__settleLog || []).slice((window.__lotT || {}).n0 || 0);
      const fb = nw.filter(m => m.act === 'scavenge-fallback').pop();
      return { frame: !!f, phase: g ? g.phase : null, board: g && g.board ? g.board.name : null, spots: g ? g.spots.length : 0, bakeMs: g ? g.bakeMs : null, fallback: fb ? fb.why : null, err: e }; }).catch(e => ({ err: e.message }));
    if (last.phase === 'play' || last.phase === 'empty') return { ok: true, why: 'the game is up on ' + last.board + ', ' + last.spots + ' spots, the board baked in ' + last.bakeMs + ' ms', st: last };
    if (last.fallback) return { ok: false, why: 'the game never came up: ' + last.fallback, st: last };
    if (last.phase === 'failed' || last.phase === 'closed') return { ok: false, why: 'the game failed: ' + JSON.stringify(last), st: last };
    await P.waitForTimeout(400);
  }
  return { ok: false, why: 'no game in ' + ms + ' ms: ' + JSON.stringify(last), st: last };
}
/* LEAVE with a real finger on the game's own button; the town answers with YOU's line */
async function leaveGame(P, sf) {
  const r = await sf.evaluate(() => { const f = document.getElementById('scavgame'); if (!f) return null; const b = f.contentWindow.document.getElementById('leave'), fr = f.getBoundingClientRect(), q = b.getBoundingClientRect();
    return { x: fr.x + q.x + q.width / 2, y: fr.y + q.y + q.height / 2 }; }).catch(() => null);
  if (!r) return { left: false };
  const fb = await (await sf.frameElement()).boundingBox();
  await P.touchscreen.tap(fb.x + r.x, fb.y + r.y); await P.waitForTimeout(900);
  return sf.evaluate(() => ({ left: !document.getElementById('scavgame') && !document.getElementById('scavcover'), say: ((document.querySelector('#sbody .say p') || {}).textContent || '').slice(0, 120),
    done: (window.__settleLog || []).slice((window.__lotT || {}).n0 || 0).filter(m => m.act === 'scavenge-done').length })).catch(e => ({ err: e.message }));
}
const shot = async (P, name) => { if (SHOTS) await P.screenshot({ path: path.join(SHOTS, name + '.png') }).catch(() => {}); };

async function run(surf, prof) {
  const tag = surf + ' ' + prof;
  console.log('-- ' + tag);
  const d = await boot(surf, prof), P = d.page;
  const url = P.url();
  try {
    await P.waitForTimeout(3000); await d.clearCards().catch(() => {}); await P.waitForTimeout(1200);
    const bases = await cityOf(P).evaluate(() => { const bs = ctBases(); return Object.keys(bs).map(n => ({ n, t: mapTierOf(n), x: bs[n].x, y: bs[n].y })); });
    /* P: every place, on the upright phone (the shape he played); the side gets the first two */
    const walk = prof === 'phone_portrait' ? bases : bases.slice(0, 2);
    const dead = [], seen = [];
    for (const b of walk) {
      const sf = await town(P, b); if (!sf) { dead.push(b.n + ' (no town)'); continue; }
      const btn = await lotSheet(P, sf);
      if (!btn || btn.none || btn.grey || btn.face !== '4 hours' || !btn.lot || btn.lot.left !== 6) dead.push(b.n + ' ' + (btn ? (btn.grey ? 'GREY' : '') + ' face "' + btn.face + '" ' + (btn.lot ? btn.lot.left + ' left' : '') + ' on ' + btn.dist : 'no sheet'));
      else seen.push(b.n + ':' + btn.dist);
      await leaveTown(P, sf);
    }
    ok(tag + ' P every place\'s lot is live and holds its six on a fresh game (' + seen.length + ' of ' + walk.length + ')', dead.length === 0, dead.length ? dead.join('; ') : seen.join(' '));

    /* A1-A3 at Church (a school town: dead before the fix) or the first town */
    const at = bases.find(b => b.n === 'Church') || bases.find(b => b.t === 'town') || bases[0];
    let sf = await town(P, at);
    if (!ok(tag + ' the town ' + at.n + ' came up', !!sf)) return;
    let btn = await lotSheet(P, sf);
    ok(tag + ' ' + at.n + ': the lot\'s button is live (' + (btn && btn.face) + ', ' + (btn && btn.lot && btn.lot.left) + ' left, on ' + (btn && btn.dist) + ')', btn && !btn.grey && btn.lot && btn.lot.left > 0, JSON.stringify(btn));
    await shot(P, surf + '_' + prof + '_the_lot');
    await press(P, sf, btn);
    await P.waitForTimeout(250);
    const mid = await glassMiddle(P, sf), a1 = await answer(sf);
    ok(tag + ' A1 the press answers at once: the cover is in the page ' + a1.coverMs + ' ms after the click, and the glass\'s middle is ' + mid,
      a1.clicked && a1.coverMs != null && a1.coverMs < 50 && /scavcover|scavgame/.test(mid) && a1.acts.includes('scavenge-open'), JSON.stringify(a1) + ' | ' + mid);
    await shot(P, surf + '_' + prof + '_the_first_frame');
    const g1 = await gameOpened(P, sf, 90000);
    await shot(P, surf + '_' + prof + '_the_game');
    ok(tag + ' A2 the game comes up on the block\'s board (' + g1.why + ')', g1.ok, g1.why);
    const l1 = await leaveGame(P, sf);
    ok(tag + ' A2 LEAVE gives the town back and YOU says what came back ("' + (l1.say || '') + '")', l1.left && l1.done === 1 && (l1.say || '').length > 8, JSON.stringify(l1));
    btn = await lotSheet(P, sf);
    await press(P, sf, btn); await P.waitForTimeout(250);
    const a3 = await answer(sf), g3 = await gameOpened(P, sf, 90000);
    ok(tag + ' A3 a second press at the same lot answers at once and opens the game again (' + a3.lot.left + ' left; ' + g3.why + ')', a3.coverMs != null && a3.coverMs < 50 && g3.ok, JSON.stringify(a3) + ' | ' + g3.why);
    await leaveGame(P, sf);

    /* A4 this lot searched out: it says so, and the next place is untouched */
    await sf.evaluate(() => { const S = BohemiaSettlement.state; S.scav.taken[BohemiaSettlement.lot().key] = 99; });
    btn = await lotSheet(P, sf);
    await press(P, sf, btn); await P.waitForTimeout(300);
    const a4 = await answer(sf);
    ok(tag + ' A4 a searched-out lot says "' + btn.face + '" on the button, a press has YOU say "' + a4.say.slice(0, 40) + '" at once, no game',
      btn && !btn.grey && btn.face === 'nothing left' && a4.acts.includes('scavenge-no') && /Nothing left/.test(a4.say) && !a4.lot.open && !a4.lot.cover, JSON.stringify(a4));
    await leaveTown(P, sf);
    const other = bases.find(b => b.n !== at.n && b.t === 'town') || bases.find(b => b.n !== at.n);
    sf = await town(P, other);
    btn = sf ? await lotSheet(P, sf) : null;
    ok(tag + ' A4 and ' + other.n + '\'s lot is still whole (' + (btn && btn.lot && btn.lot.left) + ' left): one town never empties another', btn && btn.lot && btn.lot.left === 6 && btn.face === '4 hours', JSON.stringify(btn));

    /* A5 the dead on the lot */
    if (sf) {
      await sf.evaluate(() => { BohemiaSettlement.state.fights = [{ day: 0, fallen: 1 }]; });
      await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }); await P.waitForTimeout(400);
      btn = await lotSheet(P, sf);
      await press(P, sf, btn); await P.waitForTimeout(300);
      const a5 = await answer(sf);
      ok(tag + ' A5 a body on the lot: the press searches it at once ("' + a5.say.slice(0, 60) + '")', a5.acts.includes('scavenge') && /Off one of the dead/.test(a5.say) && !a5.lot.open, JSON.stringify(a5));
      btn = await lotSheet(P, sf);
      await press(P, sf, btn); await P.waitForTimeout(250);
      const a5b = await answer(sf), g5 = await gameOpened(P, sf, 90000);
      ok(tag + ' A5 then the lot is the game again (' + g5.why + ')', a5b.coverMs != null && a5b.coverMs < 50 && g5.ok, g5.why);
      await leaveGame(P, sf);

      /* A6 a slow page: 5 s planted on the game's page */
      await d.ctx.route(GAME_PAGE, async r => { await new Promise(z => setTimeout(z, 5000)); await r.continue(); });
      btn = await lotSheet(P, sf);
      await press(P, sf, btn); await P.waitForTimeout(250);
      const m0 = await glassMiddle(P, sf); await P.waitForTimeout(2750);
      const m3 = await glassMiddle(P, sf), a6 = await answer(sf);
      await shot(P, surf + '_' + prof + '_slow_page_at_3s');
      const g6 = await gameOpened(P, sf, 90000);
      await d.ctx.unroute(GAME_PAGE);
      ok(tag + ' A6 a slow page (5 s planted): the cover is on the glass at once (' + m0 + ') and still at 3 s (' + m3 + '), then the game (' + g6.why + ')',
        /scavcover|scavgame/.test(m0) && /scavcover|scavgame/.test(m3) && a6.coverMs != null && a6.coverMs < 50 && g6.ok, m0 + ' | ' + m3 + ' | ' + g6.why);
      await leaveGame(P, sf);

      /* A7 PLANTED: the game's page missing */
      await d.ctx.route(GAME_PAGE, r => r.fulfill({ status: 404, contentType: 'text/html', body: '<!doctype html><title>404</title>not found' }));
      btn = await lotSheet(P, sf);
      const day0 = await sf.evaluate(() => BohemiaSettlement.state.day);
      await press(P, sf, btn); await P.waitForTimeout(250);
      const m7 = await glassMiddle(P, sf);
      const g7 = await gameOpened(P, sf, 30000);
      const a7 = await answer(sf), day1 = await sf.evaluate(() => BohemiaSettlement.state.day);
      await shot(P, surf + '_' + prof + '_planted_missing_page');
      await d.ctx.unroute(GAME_PAGE);
      ok(tag + ' A7 PLANTED the game\'s page missing: this gate\'s game check goes RED with a line ("' + g7.why + '")', !g7.ok && /did not load|did not answer/.test(g7.why), g7.why);
      ok(tag + ' A7 and the press still answered: the cover ' + a7.coverMs + ' ms after the click (at 250 ms the glass\'s middle: ' + m7 + '), then YOU: "' + a7.say.slice(0, 70) + '", the four hours spent once (day ' + day0 + ' -> ' + day1 + ')',
        a7.coverMs != null && a7.coverMs < 50 && a7.acts.includes('scavenge-fallback') && /would not come up/.test(a7.say) && !a7.lot.open && !a7.lot.cover && day1 === day0 + 1, JSON.stringify(a7));
      await leaveTown(P, sf);
    }

    /* S a SAVED game: the link again, CONTINUE, a town, the press */
    await cityOf(P).evaluate(() => { try { reportState(); } catch (e) {} }).catch(() => {});
    await P.waitForTimeout(1500);
    const saved = await P.evaluate(() => { try { const s = CITYSAVE.load(); return !!(s && s.data); } catch (e) { return 'ERR ' + e.message; } });
    await P.goto(url, { waitUntil: 'load', timeout: 300000 });
    /* the title on a slow boot can take minutes (the alpha, four phones at once): wait for it, then press CONTINUE until it is gone */
    for (let i = 0; i < 1200; i++) { if (await P.evaluate(() => { const t = document.getElementById('title'); return (window.BOH_TITLE && window.BOH_TITLE.skipped) || (!!window.__LOAD_READY && !!t && !t.classList.contains('gone')); }).catch(() => false)) break; await P.waitForTimeout(250); }
    await P.waitForTimeout(1500);
    let cont = false;
    for (let i = 0; i < 30 && !cont; i++) { cont = await continueThroughTitle(P); if (!cont) await P.waitForTimeout(1000); }
    /* the ALPHA over a save can open on its door with no title (the title skipped): the door's own BEGIN is its one way in, and the save
       is already restored behind it (the alpha's title note: CONTINUE goes 'straight in through the door's own BEGIN') */
    let way = cont ? 'CONTINUE' : null;
    if (!cont) for (let i = 0; i < 40 && !way; i++) {
      const fbtn = await P.evaluate(() => { const e = document.getElementById('fronttap'), f = document.getElementById('front'); if (!e || !f || getComputedStyle(f).display === 'none') return null;
        const r = e.getBoundingClientRect(); return r.width > 4 && r.height > 4 ? { x: r.x + r.width / 2, y: r.y + r.height / 2, t: (e.textContent || '').trim() } : null; }).catch(() => null);
      if (fbtn) { await P.touchscreen.tap(fbtn.x, fbtn.y); way = 'the door\'s ' + fbtn.t; } else await P.waitForTimeout(1000); }
    await P.waitForTimeout(2000);
    if (surf === 'alpha') {   /* the alpha lands on VOTE after the door (rule 15g); the town lives in RUN, as the driver's TRAP 7 walks to it */
      for (let i = 0; i < 80; i++) { await P.evaluate(() => { const t = document.querySelector('.tab[data-p="run"]'); if (t) t.click(); }).catch(() => {});
        await P.waitForTimeout(500); const c = cityOf(P); if (c && await (await c.frameElement()).boundingBox()) break; } }
    let up = false;
    for (let i = 0; i < 360 && !up; i++) { await P.waitForTimeout(250); const c = cityOf(P); up = !!c && await c.evaluate(() => typeof ctBases === 'function' && typeof loopOpenTown === 'function' && typeof DAY !== 'undefined' && DAY.day >= 1 && (window.__RESTORE_OK | 0) >= 1).catch(() => false); }
    await d.clearCards().catch(() => {});
    sf = up ? await town(P, at) : null;
    btn = sf ? await lotSheet(P, sf) : null;
    if (!btn) await shot(P, surf + '_' + prof + '_saved_game_no_lot');
    if (btn) { await press(P, sf, btn); await P.waitForTimeout(250); }
    const aS = btn ? await answer(sf) : null, gS = btn ? await gameOpened(P, sf, 90000) : { ok: false, why: !up ? 'the game did not come back' : !sf ? 'the town ' + at.n + ' did not come up' : 'no lot sheet' };
    await shot(P, surf + '_' + prof + '_saved_game');
    const lS = btn ? await leaveGame(P, sf) : {};
    ok(tag + ' S a saved game (saved ' + saved + ', in by ' + way + ', restored ' + up + '): the press answers at once and the game opens (' + gS.why + '), LEAVE answers',
      saved === true && !!way && up && aS && aS.coverMs != null && aS.coverMs < 50 && gS.ok && lS.left, JSON.stringify(aS) + ' | ' + gS.why + ' | ' + JSON.stringify(lS));
    const errs = (d.errs || []).filter(e => !/favicon|net::ERR|404|Failed to load resource/.test(String(e)));
    ok(tag + ' nothing threw', !errs.length, errs.slice(0, 3).join(' | '));
  } catch (e) { ok(tag + ' the walk itself threw', false, e.message); await shot(P, surf + '_' + prof + '_threw'); }
  finally { await d.browser.close().catch(() => {}); try { d.server.close(); } catch (e) {} }
}
(async () => { for (const s of SURFS) for (const p of SHAPES) await run(s, p); done(); })().catch(e => { console.log('  FAIL the gate itself threw: ' + e.message); fail++; done(); });
