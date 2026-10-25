/* THE FIRST ASK ON THE MAP (RUN, 10/25/26), for the coordinator's NOTE [the first person at the door, still] (rule 19(d) read
   back by Grok page 135; rule 32(a), Paolo 9/23: 'dont force interactions on the player'). On the demo, as a stranger, with
   the one driver: (a) does anything speak at him unasked in his first N seconds (default 60), and (b) when he taps the nearest
   town, how soon a NAMED FACE at its board speaks an ask (the town opens, the elder's arrival line, a real tap on the board,
   the first client, his tap on her: her words under her drawn face).
   node tools/bohemia_run_the_first_ask_on_the_map.js <phone_portrait|computer> [seconds before the tap]
   Prints the JSON; writes records/run/THE_FIRST_ASK_ON_THE_MAP_<profile>.json. */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const PROFILE = process.argv[2] || 'phone_portrait';
(async () => {
  const d = await D.open({ profile: PROFILE });
  const fr = d.fr, t0 = Date.now(), out = { profile: PROFILE, passive: [], spokeUnasked: null };
  const sec = () => Math.round((Date.now() - t0) / 100) / 10;
  const WAIT = +(process.argv[3] || 60);
  for (let i = 0; i < WAIT; i++) {
    const st = await fr.evaluate(() => ({ ask: window.__ASK_SPOKEN ? (window.__ASK_SPOKEN.head || window.__ASK_SPOKEN.who) : null,
      town: (typeof LOOP !== 'undefined' && LOOP.open) ? LOOP.open.name : null,
      travel: typeof TRAVEL !== 'undefined' && !!TRAVEL })).catch(() => ({}));
    if ((st.ask || st.town) && out.spokeUnasked == null) out.spokeUnasked = { at: sec(), st };
    if (i % 15 === 0) out.passive.push({ at: sec(), st });
    await d.page.waitForTimeout(1000);
  }
  const go = await fr.evaluate(() => {
    const bs = ctBases(); let best = null, bd = 1e9;
    for (const n in bs) { const b = bs[n]; if (!b) continue; const dd = Math.max(Math.abs((b.x | 0) - city.x), Math.abs((b.y | 0) - city.y)); if (dd < bd) { bd = dd; best = { name: n, x: b.x | 0, y: b.y | 0, d: dd }; } }
    const ok = best ? travelTo(null, null, [best.x, best.y]) : false;
    return { best, ok, from: [city.x, city.y], said: (document.querySelector('#travelSay') || {}).textContent || null };
  });
  out.tapAt = sec(); out.go = go;
  let opened = null, client = null;
  for (let i = 0; i < 360 && !client; i++) {
    const st = await fr.evaluate(() => {
      const town = (typeof LOOP !== 'undefined' && LOOP.open) ? LOOP.open.name : null;
      let c = null;
      try {
        const f = document.getElementById('settleFrame'); const doc = f && f.style.display !== 'none' && f.contentDocument;
        const el = doc && [...doc.querySelectorAll('.act.client')].find((e) => e.offsetParent !== null);
        if (el) {
          const cv = el.querySelector('canvas'); let lit = 0;
          if (cv && cv.width) { const px = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; for (let k = 3; k < px.length; k += 4) if (px[k] > 0) lit++; }
          c = { name: (el.querySelector('.cn') || {}).textContent || null, text: el.textContent.replace(/\s+/g, ' ').slice(0, 220), faceLit: lit, img: !!el.querySelector('img') };
        }
      } catch (e) { c = { err: String(e) }; }
      return { town, c, travel: typeof TRAVEL !== 'undefined' && !!TRAVEL, day: (typeof T !== 'undefined') ? T.day : null };
    }).catch(() => ({}));
    if (st.town && !opened) opened = { at: sec(), town: st.town };
    if (st.c && !st.c.err) client = Object.assign({ at: sec() }, st.c);
    if (st.town && !client && !out.arrival) {
      out.arrival = await fr.evaluate(() => { const f = document.getElementById('settleFrame'), doc = f.contentDocument, w = doc.querySelector('#arrive .who');
        return w ? { text: w.textContent.replace(/\s+/g, ' ').slice(0, 200), face: !!w.querySelector('canvas,img') } : null; }).catch(() => null);
      if (out.arrival) out.arrival.at = sec();
    }
    if (st.town && !client && out.arrival && !out.boardAt) {
      /* his tap on the board building */
      await d.page.waitForTimeout(400);
      out.boardAt = sec();
      const sf = (await (await fr.$('#settleFrame')).contentFrame());
      const box = await (await fr.frameElement()).boundingBox();
      for (let k = 0; k < 8; k++) {
        if (await sf.evaluate(() => BohemiaSettlement.state.open === 'board').catch(() => false)) break;
        const w = await sf.evaluate(() => BohemiaSettlement.where('board')).catch(() => null);
        if (w) await d.page.mouse.click(box.x + w.x, box.y + w.y + (k % 2 ? 30 : 0));
        await d.page.waitForTimeout(700);
      }
      out.boardOpen = await sf.evaluate(() => BohemiaSettlement.state.open).catch((e) => String(e));
      out.boardOpenAt = sec();
    }
    if (!opened && i > 0 && i % 20 === 0 && !st.travel) {
      /* arrived beside it and nothing opened: a second tap on the town is the arrival (travelTo's own rule) */
      await fr.evaluate((b) => travelTo(null, null, [b.x, b.y]), go.best).catch(() => {});
    }
    await d.page.waitForTimeout(500);
  }
  if (client) {
    await fr.evaluate(() => { const doc = document.getElementById('settleFrame').contentDocument; const el = [...doc.querySelectorAll('.act.client')].find((e) => e.offsetParent !== null); el.click(); });
    await d.page.waitForTimeout(600);
    out.ask = await fr.evaluate(() => { const doc = document.getElementById('settleFrame').contentDocument; const w = doc.querySelector('#sbody .who');
      if (!w) return null; const cv = w.querySelector('canvas'); let lit = 0;
      if (cv && cv.width) { const px = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; for (let k = 3; k < px.length; k += 4) if (px[k] > 0) lit++; }
      return { name: (w.querySelector('.nm') || {}).textContent, said: (w.querySelector('.say p') || {}).textContent, faceLit: lit, img: !!w.querySelector('img') }; }).catch((e) => String(e));
    out.askAt = sec();
  }
  out.opened = opened; out.client = client; out.errors = (d.errs || []).slice(0, 5);
  console.log(JSON.stringify(out, null, 1));
  require('fs').writeFileSync(path.join(ROOT, 'records/run/THE_FIRST_ASK_ON_THE_MAP_' + PROFILE + '.json'), JSON.stringify(out, null, 1) + '\n');
  await d.close();
  process.exit(0);
})().catch((e) => { console.log('PROBE THREW ' + e.stack); process.exit(1); });
