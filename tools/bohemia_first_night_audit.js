/* THE FIRST NIGHT, PLAYED AS A SEQUENCE (8/19, RUN lane).

   Not a gate. An AUDIT. Nine beats now land in the player's first twenty
   minutes and each was built by a different turn against its own gate; nobody
   has ever sat and played them in a row. This drives the real alpha, taps only
   what a player can tap, and records EVERY interruption in order: what it said,
   how many taps it cost, and what was underneath it.

   Output: a JSON ledger + a screenshot per beat.
*/
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const CITY_APP = require(path.join(ROOT, 'gates/bohemia_city_app.js'));
const OUT = process.env.OUT || '/tmp/claude-0/-home-user-bohemia/33199825-1736-501f-9707-b1f1acd52ba8/scratchpad/firstnight';
fs.mkdirSync(OUT, { recursive: true });

function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}
async function worldFrame(page) {
  for (let i = 0; i < 80; i++) {
    const f = page.frames().find(fr => CITY_APP.isFrame(fr, page));
    if (f) return f;
    await page.waitForTimeout(250);
  }
  return null;
}

const LEDGER = [];
let shot = 0;

/* WHAT IS ON SCREEN RIGHT NOW, and is it blocking? */
async function readScreen(f) {
  return await f.evaluate(() => {
    const vis = el => {
      if (!el) return false;
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 8 && r.height > 8;
    };
    const out = { blockers: [], text: '', taps: 0 };
    /* every full-screen-ish overlay currently up */
    for (const el of document.querySelectorAll('body *')) {
      const s = getComputedStyle(el);
      if (s.position !== 'fixed' && s.position !== 'absolute') continue;
      if (!vis(el)) continue;
      const r = el.getBoundingClientRect();
      const cover = (r.width * r.height) / (innerWidth * innerHeight);
      if (cover < 0.12) continue;                       /* not big enough to block */
      if (el.querySelector('canvas')) continue;          /* the world itself */
      if (el.id === 'wrap' || el.tagName === 'CANVAS') continue;
      out.blockers.push({ id: el.id || null, cls: (el.className || '').toString().slice(0, 40),
                          cover: +cover.toFixed(2),
                          txt: (el.innerText || '').trim().slice(0, 400) });
    }
    /* dedupe nested: keep the outermost only */
    const card = document.getElementById('daycard');
    const cardUp = vis(card);
    const inner = document.getElementById('daycardIn');
    out.card = cardUp ? {
      text: inner ? inner.innerText.trim() : '',
      buttons: inner ? [...inner.querySelectorAll('.dcgo')].map(b => b.innerText.trim()) : [],
    } : null;
    try { out.day = (typeof DAY !== 'undefined') ? DAY.day : null; } catch (e) { out.day = null; }
    try { out.phase = (typeof DAY !== 'undefined') ? DAY.phase : null; } catch (e) {}
    try { out.min = (typeof T !== 'undefined') ? T.min : null; } catch (e) {}
    try { out.mode = (typeof MODE !== 'undefined') ? MODE : null; } catch (e) {}
    return out;
  });
}

async function beat(page, f, label) {
  const s = await readScreen(f);
  shot++;
  const file = path.join(OUT, String(shot).padStart(2, '0') + '_' + label.replace(/\W+/g, '_') + '.png');
  await page.screenshot({ path: file });
  const rec = { n: shot, label, day: s.day, phase: s.phase, min: s.min, mode: s.mode,
                blocking: s.blockers.length, card: s.card, shot: path.basename(file) };
  LEDGER.push(rec);
  const cardTxt = s.card ? s.card.text.replace(/\n/g, ' | ').slice(0, 110) : '(no card)';
  console.log(String(shot).padStart(2) + '. ' + label.padEnd(26)
    + ' day' + s.day + ' ' + String(s.phase).padEnd(8)
    + ' blockers=' + s.blockers.length
    + (s.card ? '  BTN[' + s.card.buttons.join('/') + ']' : '')
    + '\n    ' + cardTxt);
  return s;
}

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.route(/^https?:/, r => r.abort());

  console.log('=== THE FIRST NIGHT, ON THE REAL SURFACE ===\n');
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);

  /* BEAT 0: what he sees before he touches anything */
  shot++;
  await page.screenshot({ path: path.join(OUT, '01_splash.png') });
  const splashTxt = await page.evaluate(() => {
    const fr = document.getElementById('front');
    return fr ? (fr.innerText || '').trim().slice(0, 300) : '(NO SPLASH)';
  });
  LEDGER.push({ n: 1, label: 'splash', text: splashTxt, shot: '01_splash.png' });
  console.log(' 1. splash\n    ' + splashTxt.replace(/\n/g, ' | ').slice(0, 140));

  await page.evaluate(() => document.getElementById('front').click());
  await page.waitForTimeout(3000);

  const f = await worldFrame(page);
  if (!f) { console.log('NO WORLD FRAME'); await b.close(); return; }
  for (let i = 0; i < 80; i++) { if (await f.$('#daycardIn .dcgo')) break; await page.waitForTimeout(250); }

  let taps = 0;
  await beat(page, f, 'landed (wake card up)');

  /* CAN HE ACTUALLY GET TO ANY OF IT? The demo gate proves the job, the payout
     and the market all WORK, but it teleports to reach them (`city.x = h.x`) and
     calls offerAccept() instead of tapping it -- so "the market opens" was
     proven and "he can get to the market" never was. This is that half.
     It found his house 38 cells from his feet on 8/19. */
  const reach = await f.evaluate(() => {
    const cell = p => p ? { x: (p.x / FN) | 0, y: (p.y / FN) | 0 } : null;
    const body = { x: (hx / FN) | 0, y: (hy / FN) | 0 };
    let hub = null; try { hub = mktHub(); } catch (e) { }
    let home = null; try { home = homeFind(); } catch (e) { }
    const st = (() => { try { return phoneState(); } catch (e) { return {}; } })();
    const man = (a, b) => a && b ? Math.abs(a.x - b.x) + Math.abs(a.y - b.y) : null;
    return {
      body: body, marker: { x: city.x, y: city.y },
      houseCell: cell(home), houseCellsAway: man(cell(home), body),
      hubCell: hub ? { x: hub.x, y: hub.y } : null, hubCellsAway: man(hub, body),
      phoneSaysHub: st.market ? st.market.dist : null,
      phoneSaysVista: st.vista ? st.vista.dist : null,
      objective: (document.getElementById('qline') || {}).textContent || '',
      offerWhere: (typeof OFFER !== 'undefined' && OFFER) ? (OFFER.where || null) : null,
    };
  });
  console.log('\n--- CAN HE GET THERE? ---');
  console.log('  body        ' + JSON.stringify(reach.body)
            + '   marker ' + JSON.stringify(reach.marker)
            + (reach.body.x === reach.marker.x && reach.body.y === reach.marker.y
               ? '  (agree)' : '  << MARKER DISAGREES WITH HIS FEET'));
  console.log('  his house   ' + JSON.stringify(reach.houseCell)
            + '   ' + reach.houseCellsAway + ' cells from him'
            + (reach.houseCellsAway === 0 ? '  (same cell)' : '  << NOT WHERE HE IS'));
  console.log('  the market  ' + JSON.stringify(reach.hubCell)
            + '   ' + reach.hubCellsAway + ' cells away, phone says "'
            + reach.phoneSaysHub + '"');
  console.log('  the job     ' + (reach.objective.trim() || '(no objective yet)')
            + '   where: ' + reach.offerWhere);
  LEDGER.push({ n: ++shot, label: 'reachability', reach: reach });

  /* Tap through everything the game puts in front of him, in order, until it
     stops handing him cards. THIS IS THE MEASUREMENT: how many taps before he
     is allowed to simply be in the world. */
  for (let i = 0; i < 12; i++) {
    /* VISIBLE, not merely present. The button stays in the DOM after the card
       hides, so `$()` alone keeps "finding" a control nobody can tap and the
       tap count comes out wildly too high. */
    const has = await f.evaluate(() => {
      const c = document.getElementById('daycard');
      if (!c || getComputedStyle(c).display === 'none') return false;
      return !!document.querySelector('#daycardIn .dcgo');
    });
    if (!has) break;
    await f.$eval('#daycardIn .dcgo', el => el.click());
    taps++;
    await page.waitForTimeout(900);
    await beat(page, f, 'after tap ' + taps);
  }
  console.log('\n>>> TAPS BEFORE HE CAN PLAY: ' + taps + '\n');

  /* Now play the day: sleep, and walk the whole reckoning -> day 2 -> vista chain */
  await f.evaluate(() => { const b = document.getElementById('sleepbtn'); if (b) b.click(); });
  await page.waitForTimeout(900);
  await beat(page, f, 'nightfall (reckoning)');

  let nightTaps = 0;
  for (let i = 0; i < 12; i++) {
    /* VISIBLE, not merely present. The button stays in the DOM after the card
       hides, so `$()` alone keeps "finding" a control nobody can tap and the
       tap count comes out wildly too high. */
    const has = await f.evaluate(() => {
      const c = document.getElementById('daycard');
      if (!c || getComputedStyle(c).display === 'none') return false;
      return !!document.querySelector('#daycardIn .dcgo');
    });
    if (!has) break;
    await f.$eval('#daycardIn .dcgo', el => el.click());
    nightTaps++;
    await page.waitForTimeout(1400);
    await beat(page, f, 'night tap ' + nightTaps);
  }
  console.log('\n>>> TAPS FROM SLEEP TO PLAYING DAY 2: ' + nightTaps + '\n');

  /* is the vista up, and is anything on top of it? */
  const v = await f.evaluate(() => {
    const o = window.__VISTA;
    const c = document.getElementById('daycard');
    return { open: o ? o.isOpen() : null,
             card: !!(c && getComputedStyle(c).display !== 'none'),
             vcard: !!document.getElementById('vistaCard') };
  });
  console.log('VISTA: open=' + v.open + ' its card=' + v.vcard + ' day-card on top=' + v.card);
  LEDGER.push({ n: ++shot, label: 'vista state', vista: v });

  fs.writeFileSync(path.join(OUT, 'ledger.json'),
    JSON.stringify({ tapsBeforePlay: taps, tapsSleepToDay2: nightTaps, vista: v,
                     errors: errs, beats: LEDGER }, null, 1));
  console.log('\npage errors: ' + errs.length + (errs.length ? ' -- ' + errs[0] : ''));
  console.log('ledger -> ' + OUT + '/ledger.json');
  await b.close();
})().catch(e => { console.log('AUDIT CRASHED: ' + e.message); process.exit(1); });
