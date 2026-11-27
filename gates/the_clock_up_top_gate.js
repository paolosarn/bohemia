/* THE CLOCK UP TOP  (UI FIVE, 11/27/26; VAMILY rule 487, amends rule 368; rules 441, 480)

   PAOLO 11/27: 'I feel like the players aren't connected to the time in the day, so... take it off the phone and put it at the top of
   the screen cause I feel like people aren't connecting'.

   THE FIX (slices/bohemia_ui_materials.js __THE_CLOCK_UP_TOP__): the one bar every screen wears (the map, a town, camp, the end screen)
   carries the clock at its resources' pane's right end: the sun's dial (the sun on its arc by day, the bitten moon by night), the hour
   big, DAY n small over it, the hour moonlit at night; read from the map's own clock every time the bar repaints. The phone's first line
   no longer says the day and the hour (slices/bohemia_phone.js).

   On the DEMO and the ALPHA, through the one driver, a phone upright (390 x 844) and on its side (844 x 390):
     K1 THE CLOCK AT THE TOP: on the map's bar, once, whole inside the bar and the glass, the game's own day and hour, the dial drawn, the
        hour at 14 px or more
     K2 IT MOVES AS TIME MOVES: the game's clock put on 2 h 5 min, the bar says the new hour within a second; at 22:15 it says night (the
        moon, the moonlit hour); at 09:40 day again
     K3 THE PHONE CARRIES NO TIME: no DAY and no hour drawn anywhere on the phone's face
     K4 nothing threw
     K5 K1 and K2 again with the game's clock running fast (a game minute every 100 ms)
   Every read is the bar against its own painted reading (data-day, data-min), at most an hour of game time behind the game's clock,
   and waited for after a change (UI FIVE 11/27, after CAMP FOUR saw a leg red on main: a fixed one-second read raced the repaint).
   PLANTED (the demo upright, the service worker off): the clock taken off the bar, K1 red; the day and the hour put back on the phone, K3 red.
   (The town's and camp's bars, the band's one height and its other contents: THE TOP IS ONLY RESOURCES B1-B5; the day and the hour drawn
   once each: THE DAYS ONCE.)
   node gates/the_clock_up_top_gate.js [demo|alpha] [phone_portrait|phone_landscape] [--no-plant] */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && x !== '' ? '  [' + String(x).slice(0, 500) + ']' : '')); return g; };
const ARGS = process.argv.slice(2);
const PAGES = ['demo', 'alpha'].filter(p => !ARGS.some(a => a === 'demo' || a === 'alpha') || ARGS.includes(p));
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !ARGS.some(a => /^phone_/.test(a)) || ARGS.includes(p));
const pad = n => (n < 10 ? '0' : '') + n;

/* in the map's frame: the bar's clock as drawn */
const CLOCK = () => {
  const b = document.getElementById('bmtb'), c = b && b.querySelector('[data-tb=g] [data-f=clock]');
  const all = b ? [...b.querySelectorAll('[data-f=clock]')].filter(e => e.getBoundingClientRect().width > 0).length : 0;
  if (!c) return { n: all, game: { day: T.day, min: T.min } };
  const q = c.getBoundingClientRect(), br = b.getBoundingClientRect(), hb = c.querySelector('.ct b'), di = c.querySelector('.ct i'), dial = c.querySelector('img.dial');
  return { n: all, day: di ? di.textContent.trim() : '', hour: hb ? hb.textContent.trim() : '', night: c.classList.contains('night'), aria: c.getAttribute('aria-label'), dday: +c.dataset.day, dmin: +c.dataset.min,
    dial: !!dial && dial.complete && dial.naturalWidth > 0 && dial.getBoundingClientRect().width >= 20, px: hb ? parseFloat(getComputedStyle(hb).fontSize) : 0,
    whole: q.left >= br.left - 0.5 && q.right <= br.right + 0.5 && q.right <= innerWidth + 0.5 && q.top >= br.top - 0.5 && q.bottom <= br.bottom + 0.5 && c.scrollWidth <= c.clientWidth + 1,
    game: { day: T.day, min: T.min } };
};
/* the phone's drawn words (its face only) */
const PHONE = () => {
  const e = document.getElementById('bohphone'); if (!e || !e.classList.contains('on')) return null;
  const drawn = x => { const r = x.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; for (let q = x; q && q !== e.parentElement; q = q.parentElement) { const cs = getComputedStyle(q); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) return false; } return true; };
  const own = [...e.querySelectorAll('.stat *, .home .bpctx *, .home .bptwo *, .home .bprow *')].filter(x => x.childElementCount === 0 && drawn(x)).map(x => x.textContent.trim()).filter(Boolean).join(' ');
  return { hours: (own.match(/\b\d{1,2}:\d{2}\b/g) || []).length, days: (own.match(/\bDAY\b/g) || []).length, own: own.slice(0, 120) };
};
const hm = min => pad(((min / 60) | 0) % 24) + ':' + pad(Math.floor(min % 60));
/* UI FIVE 11/27, after CAMP FOUR saw one leg red on main: the bar repaints twice a second and the game's clock can run between a
   repaint and this read (a machine busy with other lanes' browsers, or time moving), so the bar is read against ITS OWN reading
   (data-day, data-min: what it painted from) and that reading must be the game's clock or at most an hour of game time behind it;
   and after the clock is put on a new time the bar is WAITED FOR (up to 4 s), never read after a fixed second. */
const LAG = 60;
const fresh = c => !!c && c.dmin === c.dmin && c.hour === hm(c.dmin) && c.day === 'DAY ' + c.dday && c.game.day === c.dday && c.game.min - c.dmin >= 0 && c.game.min - c.dmin <= LAG;
async function seen(P, fr, m) {
  await fr.evaluate(x => { T.min = x; }, m);
  let c = null;
  for (let i = 0; i < 27; i++) { await P.waitForTimeout(150); c = await fr.evaluate(CLOCK); if (c.dmin >= m && c.dmin - m <= LAG && fresh(c)) break; }
  return c;
}

async function walk(page, profile, plant) {
  const tag = page + ' ' + (profile === 'phone_portrait' ? 'upright' : 'on its side');
  console.log('\n' + tag + (plant ? ' PLANTED' : ''));
  let d; const errs = [];
  try {
    d = await drive.open({ profile, alpha: page === 'alpha', noWorker: !!plant, beforeGoto: plant ? async (cdp, pg) => {
      await pg.route(/bohemia_ui_materials\.js/, async route => { const r = await route.fetch(); const b = (await r.text()).replace('if (f.day != null && f.min != null) {', 'if (false) {'); await route.fulfill({ response: r, body: b }); });
      await pg.route(/bohemia_phone\.js/, async route => { const r = await route.fetch(); const b = (await r.text()).replace("if (stD && stD.textContent) stD.textContent = '';", "if (stD && s) stD.textContent = 'DAY ' + s.day + '  ' + s.clock;").replace("'#bohphone .stat .dt{display:none!important}'", "''"); await route.fulfill({ response: r, body: b }); }); } : undefined });
  } catch (e) { ok(tag + ': the page boots', false, String(e.message).slice(0, 160)); return; }
  const P = d.page; P.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  try {
    await P.waitForTimeout(3000);
    const fr = d.fr;
    const k1 = await fr.evaluate(CLOCK), want1 = 'DAY ' + k1.game.day, wantH = hm(k1.game.min);
    const good1 = k1.n === 1 && fresh(k1) && k1.dial && k1.whole && k1.px >= 14;
    const ph = await P.evaluate(PHONE);
    if (plant) { ok(tag + ' PLANTED: the clock taken off the bar, K1 red (' + JSON.stringify({ n: k1.n, day: k1.day }) + ')', !good1);
      ok(tag + ' PLANTED: the day and the hour back on the phone, K3 red (' + JSON.stringify(ph) + ')', !!ph && (ph.days > 0 || ph.hours > 0)); return; }
    ok('K1 ' + tag + ' THE CLOCK AT THE TOP: "' + k1.day + ' ' + k1.hour + '" (painted from ' + k1.dday + '/' + hm(k1.dmin) + ', the game ' + want1 + ' ' + wantH + '), the dial ' + k1.dial + ', whole ' + k1.whole + ', the hour ' + k1.px + ' px', good1);
    /* K2 the game's own clock moved, then night, then day */
    const m0 = k1.game.min;
    const k2 = await seen(P, fr, m0 + 125);
    const kn = await seen(P, fr, 22 * 60 + 15);
    const kd = await seen(P, fr, 9 * 60 + 40);
    await fr.evaluate(m => { T.min = m; }, m0);
    ok('K2 ' + tag + ' IT MOVES AS TIME MOVES: ' + hm(m0) + ' + 2 h 5 min says ' + k2.hour + '; 22:15 says ' + kn.hour + (kn.night ? ' at night' : ' NOT NIGHT') + ' ("' + kn.aria + '"); 09:40 says ' + kd.hour + (kd.night ? ' NIGHT' : ' by day'),
      fresh(k2) && k2.dmin >= m0 + 125 && fresh(kn) && kn.dmin >= 22 * 60 + 15 && kn.night && /night/.test(kn.aria || '') && fresh(kd) && kd.dmin >= 9 * 60 + 40 && kd.dmin < 19 * 60 && !kd.night);
    ok('K3 ' + tag + ' THE PHONE CARRIES NO TIME: ' + (ph ? ph.days + ' DAY, ' + ph.hours + ' hour(s) drawn on its face ("' + ph.own + '")' : 'no phone up'), !!ph && ph.days === 0 && ph.hours === 0);
    /* K5 THE SAME WITH TIME RUNNING: a game minute every 100 ms (a game hour in six seconds, faster than camp's rest), the bar read
       against its own reading and waited for, as above */
    await fr.evaluate(() => { window.__CLOCK_RUN = setInterval(() => { T.min += 1; }, 100); });
    await P.waitForTimeout(1200);
    const r1 = await fr.evaluate(CLOCK), rn = await seen(P, fr, 21 * 60 + 30), rd = await seen(P, fr, 10 * 60);
    await fr.evaluate(m => { clearInterval(window.__CLOCK_RUN); T.min = m; }, m0);
    ok('K5 ' + tag + ' WITH TIME RUNNING (a game minute every 100 ms): the bar says ' + r1.hour + ' painted from ' + hm(r1.dmin) + ' with the game at ' + hm(r1.game.min) + '; 21:30 then says ' + rn.hour + (rn.night ? ' at night' : ' NOT NIGHT') + ', 10:00 says ' + rd.hour + (rd.night ? ' NIGHT' : ' by day'),
      fresh(r1) && fresh(rn) && rn.dmin >= 21 * 60 + 30 && rn.night && fresh(rd) && rd.dmin >= 10 * 60 && !rd.night);
    ok('K4 ' + tag + ' nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  } catch (e) { ok(tag + ' ran', false, String(e.stack).slice(0, 300)); }
  finally { await d.close().catch(() => {}); }
}

(async () => {
  for (const page of PAGES) for (const prof of PROFS) await walk(page, prof, false);
  if (!ARGS.includes('--no-plant')) await walk('demo', 'phone_portrait', true);
  console.log('\nTHE CLOCK UP TOP: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
