/* ==========================================================================
   THE RECEIPT IS THE END SCREEN  (RUN FIVE, 11/6/26, VAMILY rule 405(a)(c), ask line 448; rule 411 opened the round)

   PAOLO 11/4: "we still have that receipt gambling shit, and I actually like the idea of that, the gambling receipt at the end of
   the fight populates, but it's only there for one second before the victory screen appears... why don't we combine this, maybe
   make the receipt look like it's hanging off the edge of the screen a little bit, incorporate it in a fun way".
   MEASURED BEFORE (11/6): a won or lost fight showed TWO screens: the fight's own recap card (receipt paper, WHO KILLS BLOOD TAKEN
   XP filling in) for about a second while the game's end screen loaded, then the end screen over it, carrying the same numbers
   again on each man's card and in the bar.

   LEGS
     R1 the end screen on its own (its sample, a phone): the receipt hangs off the glass's right edge from under the bar; it prints
        a line at a time; once printed it carries the fight's head, its rounds (#tally) and one line a man with his kills, blood
        drawn, blood taken and XP, the fight's own numbers; the crew cards and the bar carry no second copy
     R2 the loot counted onto it: LOOT ALL prints a line for every piece taken and the pay; a piece put back prints VOID
     R3 a tap unrolls it, a second rolls it back
     R4 LEAVE: the TOTAL prints, the roll is torn off, and the game hears 'leave' once, after the tear
     R5 a lost fight: the receipt prints, NOTHING TAKEN, no loot on it
     D1 *** ONE MOMENT, ONE SCREEN *** the demo, a road fight won through the map's own door: from the fight's end until the end
        screen stands, the fight's own card is never seen (sampled every frame), and the end screen carries the receipt
     D2 the bench keeps its card: the fight on its own (no game round it) still shows its recap card (source and page)
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
const done = () => { console.log('=== THE RECEIPT IS THE END SCREEN: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
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
  /* ---- R1 ---- */
  const early = await sp.evaluate(() => { localStorage.setItem('bohemia.bag.v1', '[]'); BohemiaSpoilsScreen.open({ fight: BohemiaSpoilsScreen.SAMPLE, seed: 7 }); return 0; });
  await sp.waitForTimeout(110);
  const n110 = await sp.evaluate(() => document.querySelectorAll('#tillpaper .tl').length);
  await sp.waitForTimeout(2200);
  const r1 = await sp.evaluate(() => {
    const t = document.getElementById('till'), r = t.getBoundingClientRect(), bar = document.getElementById('bar').getBoundingClientRect(), SM = BohemiaSpoilsScreen.SAMPLE.spoils.recap;
    const rows = [...document.querySelectorAll('#tillpaper .tl[data-man]')].map(e => ({ man: e.dataset.man, kills: +e.dataset.kills, dealt: +e.dataset.dealt, taken: +e.dataset.taken, text: e.textContent }));
    const S = BohemiaSpoilsScreen.state, want = SM.men.map(m => { const mm = S.men.find(x => x.name === m.name) || {}; return { man: mm.main ? 'YOU' : m.name, kills: m.kills, dealt: m.dealt, taken: m.taken, xp: mm.gained | 0 }; });
    const same = want.every(w => rows.some(q => q.man === w.man && q.kills === w.kills && q.dealt === w.dealt && q.taken === w.taken && new RegExp('\\b' + w.xp + '$').test(q.text.trim())));
    return { right: Math.round(r.right), W: document.documentElement.clientWidth, sx: document.documentElement.scrollWidth, top: Math.round(r.top), barBottom: Math.round(bar.bottom), lines: document.querySelectorAll('#tillpaper .tl').length,
      head: [...document.querySelectorAll('#tillpaper .tl.big')].map(e => e.textContent).join(' | '), tally: (document.getElementById('tally') || {}).textContent || '',
      inTill: !!(document.getElementById('tally') && document.getElementById('till').contains(document.getElementById('tally'))),
      same, rows: rows.length, men: want.length, nums: document.querySelectorAll('#crew .nums').length, barTally: !!document.querySelector('#bar #tally') };
  });
  ok('R1 the receipt hangs off the glass\'s right edge from under the bar, and prints a line at a time (' + n110 + ' lines at 110 ms, ' + r1.lines + ' printed)',
    r1.right > r1.W + 4 && r1.sx <= r1.W && r1.top <= r1.barBottom && n110 >= 1 && n110 < r1.lines && r1.lines >= 8, 'right ' + r1.right + ' of ' + r1.W + ' (page ' + r1.sx + ' wide, no sideways scroll), top ' + r1.top + ' bar ' + r1.barBottom);
  ok('    it carries the fight\'s head, its rounds and one line a man with the fight\'s own kills, blood, taken and XP; no second copy on the cards or the bar',
    /RAN|DOWN/.test(r1.head) && /^6 ROUNDS/.test(r1.tally) && r1.inTill && r1.same && r1.rows === r1.men && r1.nums === 0 && !r1.barTally, r1.head + ' / ' + r1.tally.replace(/\n/g, ' / ') + ' / ' + r1.rows + ' men, cards ' + r1.nums);
  /* ---- R2 ---- */
  await sp.evaluate(() => document.getElementById('lootall').click()); await sp.waitForTimeout(2000);   /* the press itself is THE SPOILS gate's (its D4, a real tap) */
  const r2a = await sp.evaluate(() => ({ items: document.querySelectorAll('#tillpaper .tl[data-item]:not(.void)').length, took: BohemiaSpoilsScreen.state.stash.filter(i => i.fresh).length,
    pay: [...document.querySelectorAll('#tillpaper .tl')].some(e => /BATTER/.test(e.textContent)) }));
  await sp.evaluate(() => BohemiaSpoilsScreen.putBack(0)); await sp.waitForTimeout(600);
  const r2b = await sp.evaluate(() => document.querySelectorAll('#tillpaper .tl.void').length);
  ok('R2 the loot counted onto it: LOOT ALL prints a line a piece and the pay; a piece put back prints VOID', r2a.items === r2a.took && r2a.took > 0 && r2a.pay && r2b === 1, JSON.stringify(r2a) + ', void ' + r2b);
  /* ---- R3 ---- */
  await sp.evaluate(() => window.scrollTo(0, 0));
  const h0 = await sp.evaluate(() => document.querySelector('#till .paper').getBoundingClientRect().height);
  await sp.evaluate(() => document.getElementById('till').click()); await sp.waitForTimeout(400);
  const h1 = await sp.evaluate(() => document.querySelector('#till .paper').getBoundingClientRect().height);
  await sp.evaluate(() => document.getElementById('till').click()); await sp.waitForTimeout(400);
  const h2 = await sp.evaluate(() => document.querySelector('#till .paper').getBoundingClientRect().height);
  ok('R3 a tap unrolls it, a second rolls it back', h1 > h0 + 60 && Math.abs(h2 - h0) < 4, Math.round(h0) + ' -> ' + Math.round(h1) + ' -> ' + Math.round(h2));
  /* ---- R4 ---- */
  const r4 = await sp.evaluate(async () => {
    const S = BohemiaSpoilsScreen.state, n0 = S.log.filter(m => m.act === 'leave').length, t0 = performance.now();
    BohemiaSpoilsScreen.leave(); BohemiaSpoilsScreen.leave();
    const torn = document.getElementById('till').classList.contains('torn'), atOnce = S.log.filter(m => m.act === 'leave').length - n0;
    const total = [...document.querySelectorAll('#tillpaper .tl')].some(e => /^TOTAL\s+\d+$/.test(e.textContent.trim()));
    await new Promise(r => setTimeout(r, 600));
    const after = S.log.filter(m => m.act === 'leave').length - n0;
    return { torn, atOnce, after, total };
  });
  ok('R4 LEAVE: the TOTAL prints, the roll is torn off, and the game hears leave once, after the tear', r4.torn && r4.total && r4.atOnce === 0 && r4.after === 1, JSON.stringify(r4));
  /* ---- R5 ---- */
  await sp.evaluate(() => { const f = JSON.parse(JSON.stringify(BohemiaSpoilsScreen.SAMPLE)); f.result = 'lost'; f.spoils.recap.head = 'YOUR CREW IS DOWN'; BohemiaSpoilsScreen.open({ fight: f, seed: 7 }); });
  await sp.waitForTimeout(2200);
  const r5 = await sp.evaluate(() => ({ none: [...document.querySelectorAll('#tillpaper .tl')].some(e => e.textContent === 'NOTHING TAKEN'), items: document.querySelectorAll('#tillpaper .tl[data-item]').length,
    torn: document.getElementById('till').classList.contains('torn'), men: document.querySelectorAll('#tillpaper .tl[data-man]').length }));
  ok('R5 a lost fight: a fresh receipt prints, NOTHING TAKEN, no loot on it', r5.none && r5.items === 0 && !r5.torn && r5.men > 0, JSON.stringify(r5));
  await ctx.close();
  /* ---- D2 the bench keeps its card ---- */
  const fsrc = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
  const handedRule = /#over\.handed\{visibility:hidden;pointer-events:none\}/.test(fsrc) && /window\.parent !== window && !!window\.parent\.SPOILS && \(result === 'won' \|\| result === 'lost'\)/.test(fsrc);
  ok('D2 the card is handed only to the game\'s end screen (a won or lost fight inside the game); the bench and a pull-back keep it', handedRule);

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
        st = sf ? await sf.evaluate(() => ({ open: !!(window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened), lines: document.querySelectorAll('#tillpaper .tl').length, men: document.querySelectorAll('#tillpaper .tl[data-man]').length })).catch(() => null) : null;
        if (st && st.open && st.lines >= 6) break; }
      const seen = await f.evaluate(() => ({ seen: (window.__CARD_SEEN || []).length, looks: window.__CARD_LOOKS | 0, display: document.getElementById('over').style.display, handed: document.getElementById('over').classList.contains('handed') })).catch(() => ({ seen: -1 }));
      ok('D1 *** ONE MOMENT, ONE SCREEN *** a road fight won on the demo: the fight\'s card seen on 0 of ' + seen.looks + ' frames, and the end screen carries the receipt (' + (st ? st.lines : 0) + ' lines, ' + (st ? st.men : 0) + ' men)',
        seen.seen === 0 && seen.looks > 5 && seen.handed && !!st && st.open && st.lines >= 6 && st.men > 0, JSON.stringify(seen));
    }
  } catch (e) { ok('D1 ran [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  ok('Z nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 3).join(' | '));
  await d.close(); await b.close(); srv.close();
  done();
})().catch(e => { console.error(e); process.exit(1); });
