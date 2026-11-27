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
  return { n: all, day: di ? di.textContent.trim() : '', hour: hb ? hb.textContent.trim() : '', night: c.classList.contains('night'), aria: c.getAttribute('aria-label'),
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
    const good1 = k1.n === 1 && k1.day === want1 && k1.hour === wantH && k1.dial && k1.whole && k1.px >= 14;
    const ph = await P.evaluate(PHONE);
    if (plant) { ok(tag + ' PLANTED: the clock taken off the bar, K1 red (' + JSON.stringify({ n: k1.n, day: k1.day }) + ')', !good1);
      ok(tag + ' PLANTED: the day and the hour back on the phone, K3 red (' + JSON.stringify(ph) + ')', !!ph && (ph.days > 0 || ph.hours > 0)); return; }
    ok('K1 ' + tag + ' THE CLOCK AT THE TOP: "' + k1.day + ' ' + k1.hour + '" (the game ' + want1 + ' ' + wantH + '), the dial ' + k1.dial + ', whole ' + k1.whole + ', the hour ' + k1.px + ' px', good1);
    /* K2 the game's own clock moved, then night, then day */
    const m0 = k1.game.min;
    await fr.evaluate(m => { T.min = m; }, m0 + 125); await P.waitForTimeout(1100);
    const k2 = await fr.evaluate(CLOCK);
    await fr.evaluate(() => { T.min = 22 * 60 + 15; }); await P.waitForTimeout(1100);
    const kn = await fr.evaluate(CLOCK);
    await fr.evaluate(() => { T.min = 9 * 60 + 40; }); await P.waitForTimeout(1100);
    const kd = await fr.evaluate(CLOCK);
    await fr.evaluate(m => { T.min = m; }, m0);
    ok('K2 ' + tag + ' IT MOVES AS TIME MOVES: ' + hm(m0) + ' + 2 h 5 min says ' + k2.hour + '; 22:15 says ' + kn.hour + (kn.night ? ' at night' : ' NOT NIGHT') + ' ("' + kn.aria + '"); 09:40 says ' + kd.hour + (kd.night ? ' NIGHT' : ' by day'),
      k2.hour === hm(m0 + 125) && kn.hour === '22:15' && kn.night && /night/.test(kn.aria || '') && kd.hour === '09:40' && !kd.night);
    ok('K3 ' + tag + ' THE PHONE CARRIES NO TIME: ' + (ph ? ph.days + ' DAY, ' + ph.hours + ' hour(s) drawn on its face ("' + ph.own + '")' : 'no phone up'), !!ph && ph.days === 0 && ph.hours === 0);
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
