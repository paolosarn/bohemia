/* ==========================================================================
   THE RECEIPT IS GONE  (FIGHT SCREEN THREE, 11/22/26, VAMILY rule 475(a); RE-AIMED IN PLACE from RUN FIVE's THE RECEIPT IS THE END
   SCREEN of 11/6, rule 405(a)(c), which this rule overrides by date)

   PAOLO 11/22, with a screenshot (records/paolo_shots/BOHEMIA_PAOLO_SHOT_THE_RECEIPT_STILL_THERE_11_22_26.jpg): "there are still remnants of
   the old combat screen, like with the casino receipt shit... it's still like hanging around being awkward and goofy as fuck".
   THE LAW NOW: the end screen (slices/BOHEMIA_SPOILS_SCREEN.html) is the one end screen and carries no receipt and no receipt paper, in
   every way a fight ends; the till roll is in the graveyard (gates/bohemia_graveyard.txt); a man's kills are the crew screen's (his vote
   11/2: 'Only in the crew menu not any other menu'). The fight's own end card is never seen in the game, and on its own page it stands on
   the house's dark board, not paper.

   LEGS
     R1 the end screen on its own (its sample, a won fight), a phone upright and on its side: no till (#till, #tillclip, #tillpaper, #tally
        absent) and no receipt paper (no element shown in the kit's receipt or in the till's paper colours); the head, the crew and the
        loot stand
     R2 LOOT ALL, then LEAVE: the game hears 'leave' once, at once (nothing is torn off first)
     R3 a lost fight: no till, no receipt paper
     D1 *** ONE MOMENT, ONE SCREEN *** the demo, a road fight won through the map's own door: the fight's own card seen on 0 frames, and
        the end screen opens with no receipt and no receipt paper on it
     D2 the fight's own card is handed to the game's end screen (won or lost inside the game) and on its own page stands on the board
        (#over .box on #2a2016, overLook() lays the kit's board), never receipt paper
     planted: a strip of receipt paper laid back on the end screen: R1's measure sees it
     Z  nothing threw
   node gates/the_receipt_is_the_end_screen_gate.js
   ========================================================================== */
'use strict';
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('=== THE RECEIPT IS GONE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
/* the measure: no till, and no element on the glass dressed as receipt paper (the kit's receipt piece, or the till's own paper colours) */
const PAPER = () => { const tones = ['rgb(228, 218, 194)', 'rgb(221, 212, 189)', 'rgb(226, 218, 198)', 'rgb(230, 220, 196)'];
  const vis = e => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 2 && r.height > 2 && cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.05 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const paper = [...document.querySelectorAll('body *')].filter(vis).filter(e => { const cs = getComputedStyle(e); return /ui_kit\/receipt\//.test(cs.backgroundImage) || tones.indexOf(cs.backgroundColor) >= 0; })
    .map(e => (e.id ? '#' + e.id : e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : '')));
  return { till: ['till', 'tillclip', 'tillpaper', 'tally'].filter(id => !!document.getElementById(id)), paper: paper.slice(0, 8), papers: paper.length,
    head: (document.getElementById('word') || {}).textContent || '', crew: document.querySelectorAll('#crew .man').length, loot: !!document.getElementById('loot') && getComputedStyle(document.getElementById('loot')).display !== 'none' };
};
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2' };

(async () => {
  const srv = http.createServer((rq, rs) => {
    const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
    rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + srv.address().port;
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const sp = await ctx.newPage(); sp.on('pageerror', e => errs.push('spoils: ' + e.message));
  await sp.goto(base + '/slices/BOHEMIA_SPOILS_SCREEN.html');
  await sp.waitForFunction(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened, null, { timeout: 30000 });
  /* ---- R1, both shapes ---- */
  const r1 = {};
  for (const shape of [['upright', 390, 844], ['on its side', 844, 390]]) {
    await sp.setViewportSize({ width: shape[1], height: shape[2] });
    await sp.evaluate(() => { localStorage.setItem('bohemia.bag.v1', '[]'); BohemiaSpoilsScreen.open({ fight: BohemiaSpoilsScreen.SAMPLE, seed: 7 }); });
    await sp.waitForTimeout(2400);
    r1[shape[0]] = await sp.evaluate('(' + PAPER.toString() + ')()');
    await sp.screenshot({ path: path.join(require('os').tmpdir(), 'receipt_gone_' + shape[1] + '.png') }).catch(() => {});
  }
  const clean = (m) => !!m && m.till.length === 0 && m.papers === 0 && m.head.length > 0 && m.crew > 0 && m.loot;
  ok('R1 the end screen on its own, a won fight: no till and no receipt paper, the head, the crew and the loot stand',
    clean(r1['upright']) && clean(r1['on its side']), JSON.stringify(r1));
  /* ---- R2 ---- */
  await sp.setViewportSize({ width: 390, height: 844 });
  await sp.evaluate(() => { localStorage.setItem('bohemia.bag.v1', '[]'); BohemiaSpoilsScreen.open({ fight: BohemiaSpoilsScreen.SAMPLE, seed: 7 }); }); await sp.waitForTimeout(1500);
  await sp.evaluate(() => document.getElementById('lootall').click()); await sp.waitForTimeout(1200);   /* the press itself is THE SPOILS gate's (its D4, a real tap) */
  const r2 = await sp.evaluate(async () => { const S = BohemiaSpoilsScreen.state, n0 = S.log.filter(m => m.act === 'leave').length, took = S.stash.filter(i => i.fresh).length; BohemiaSpoilsScreen.leave(); BohemiaSpoilsScreen.leave();
    const atOnce = S.log.filter(m => m.act === 'leave').length - n0; await new Promise(r => setTimeout(r, 600)); return { atOnce, after: S.log.filter(m => m.act === 'leave').length - n0, took: took }; });   /* took is read before LEAVE: leaving clears the fresh marks */
  ok('R2 LOOT ALL, then LEAVE: the game hears leave once, at once (nothing torn off first)', r2.atOnce === 1 && r2.after === 1 && r2.took > 0, JSON.stringify(r2));
  /* ---- R3 ---- */
  await sp.evaluate(() => { const f = JSON.parse(JSON.stringify(BohemiaSpoilsScreen.SAMPLE)); f.result = 'lost'; f.spoils.recap.head = 'YOUR CREW IS DOWN'; BohemiaSpoilsScreen.open({ fight: f, seed: 7 }); });
  await sp.waitForTimeout(2200);
  const r3 = await sp.evaluate('(' + PAPER.toString() + ')()');
  ok('R3 a lost fight: no till and no receipt paper', r3.till.length === 0 && r3.papers === 0 && r3.crew > 0, JSON.stringify(r3));
  /* ---- planted: a strip of receipt paper laid back ---- */
  await sp.evaluate(() => { const t = document.createElement('div'); t.style.cssText = 'position:fixed;right:0;top:120px;width:160px;height:46px;background:#e4dac2;z-index:9'; document.body.appendChild(t); });
  const pl = await sp.evaluate('(' + PAPER.toString() + ')()');
  ok('planted: a strip of receipt paper laid back on the end screen: the measure sees it', pl.papers >= 1, JSON.stringify(pl));
  await ctx.close();
  /* ---- D2 the fight's own card ---- */
  const fsrc = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
  const handedRule = /#over\.handed\{visibility:hidden;pointer-events:none\}/.test(fsrc) && /window\.parent !== window && !!window\.parent\.SPOILS && \(result === 'won' \|\| result === 'lost'\)/.test(fsrc);
  const boardCard = /#over \.box\{color:#f2e4c6!important;background:#2a2016!important/.test(fsrc) && /function overLook\(\)/.test(fsrc) && /overLook\(\);\s+\/\* __THE_RECEIPT_IS_GONE__ \*\/\n\s+o\.classList\.toggle\('handed', handed\);/.test(fsrc);
  ok('D2 the fight\'s own card is handed to the game\'s end screen in the game, and on its own page stands on the board, never receipt paper', handedRule && boardCard, 'handed ' + handedRule + ', board ' + boardCard);

  /* ---- D1 the demo ---- */
  let d;
  try { d = await drive.open({ keepCards: true, engage: true, beforeTap: async (p) => { await throughTheTitle(p); } }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); await b.close(); srv.close(); return done(); }
  const p = d.page, fr = d.fr;
  try {
    await p.waitForTimeout(2500);
    const fightFrame = async () => { for (let i = 0; i < 600; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
      if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) return c; } await p.waitForTimeout(150); } return null; };
    /* off any town's ground first (a town is a door and safe: no fight starts on it, rule 273(b)), the nearest cell out */
    const off = await fr.evaluate(() => { try { stepOnce(0); stepOnce(4); } catch (_e) {}
      const free = (x, y) => { try { return !townGround(x, y) && !townSafeAt(x, y); } catch (_e) { return true; } };
      if (free(city.x, city.y)) return [city.x, city.y];
      for (let r = 1; r < 60; r++) for (let a = 0; a < 16; a++) { const x = Math.round(city.x + Math.cos(a * Math.PI / 8) * r), y = Math.round(city.y + Math.sin(a * Math.PI / 8) * r); if (free(x, y)) { city.x = x; city.y = y; return [x, y]; } }
      return null; });
    /* the map's road parties load after the door on a busy box: ask again each second until the map hands the fight over */
    let handed = false; for (let i = 0; i < 60 && !handed; i++) { handed = await fr.evaluate(() => { try { return !!roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 31 }); } catch (_e) { return false; } }).catch(() => false); if (!handed) await p.waitForTimeout(1000); }
    const f = await fightFrame();
    if (!f) { ok('D1 a road fight through the map\'s own door', false); }
    else {
      /* watch the card on every frame from the moment the fight ends until the end screen has printed */
      await f.evaluate(() => { window.__CARD_SEEN = []; const o = document.getElementById('over');
        const look = () => { const cs = getComputedStyle(o); if (cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0) window.__CARD_SEEN.push(performance.now()); window.__CARD_LOOKS = (window.__CARD_LOOKS | 0) + 1; requestAnimationFrame(look); };
        requestAnimationFrame(look);
        const S = FIGHT.S; S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; }); S.over = true; S.result = 'won'; showOver('won'); });
      let st = null;
      for (let i = 0; i < 60; i++) { await p.waitForTimeout(150);
        const sf = p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
        st = sf ? await sf.evaluate('(' + PAPER.toString() + ')()').then(m => sf.evaluate(() => !!(window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened)).then(o => Object.assign(m, { open: o }))).catch(() => null) : null;
        if (st && st.open && st.crew > 0) { await p.waitForTimeout(1200); st = await sf.evaluate('(' + PAPER.toString() + ')()').catch(() => st); st.open = true; break; } }
      const seen = await f.evaluate(() => ({ seen: (window.__CARD_SEEN || []).length, looks: window.__CARD_LOOKS | 0, display: document.getElementById('over').style.display, handed: document.getElementById('over').classList.contains('handed') })).catch(() => ({ seen: -1 }));
      ok('D1 *** ONE MOMENT, ONE SCREEN *** a road fight won on the demo: the fight\'s card seen on 0 of ' + seen.looks + ' frames, and the end screen opens with no receipt and no receipt paper (' + (st ? st.till.length + ' till nodes, ' + st.papers + ' paper' : 'not open') + ')',
        seen.seen === 0 && seen.looks > 5 && seen.handed && !!st && st.open && st.till.length === 0 && st.papers === 0, JSON.stringify(seen) + ' ' + JSON.stringify(st));
    }
  } catch (e) { ok('D1 ran [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  ok('Z nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 3).join(' | '));
  await d.close(); await b.close(); srv.close();
  done();
})().catch(e => { console.error(e); process.exit(1); });
