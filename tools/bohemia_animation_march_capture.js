#!/usr/bin/env node
/* THEY MEND ON THE MARCH, THE PROOF ON THE PHONE (ANIMATION, ask line 314). The demo opened on a phone (the driver's real taps and
   real glass), his crew hurt the way a fight leaves them (the company's condition: YOU low with his hard hat dented, DESI cut,
   RAUL's vest torn) and the company's tape in the cart; the party sent walking down the map at the close end. Two things:
     1. THEY DO IT BY THEMSELVES: nothing forced, the party walks for a while and the map's own picker starts acts on the hurt
        (MAP_DREW.march counts each act's drawn frames); nobody acts in the first bars, never more than two at once.
     2. THE PICTURE: DESI bandaging and RAUL taping together (the brief's picture), then YOU knocking his hat and RAUL on the pills,
        a frame a key (three a beat) cut round the party: records/target/animation/march_capture/*.png, a contact sheet and a
        moving webp.
   node tools/bohemia_animation_march_capture.js [phone_portrait|computer] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records/target/animation/march_capture');

(async () => {
  const profile = process.argv[2] || 'phone_portrait';
  fs.mkdirSync(OUT, { recursive: true });
  const d = await open({ profile, fog: false });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.RIG_YOU && RIG_YOU.state >= 2 && typeof MAP_DREW !== 'undefined' && MAP_DREW.you && window.BohemiaMarch && BohemiaMarch.ready()))) break; await page.waitForTimeout(250); }
  await fr.evaluate(() => { try { if (LOOP.frame && LOOP.frame.style.display === 'block') loopClose(); } catch (e) {} });
  /* his crew as a fight leaves them, and tape in the cart */
  await fr.evaluate(() => {
    const s = BohemiaCondition.get();
    s.men.YOU = Object.assign(s.men.YOU || {}, { shown: 'YOU', main: true, look: 'you', hpMax: 60, lostHp: 26, armHMax: 40, lostH: 18, head: 'open_leather_cap', armBMax: 70, lostB: 0, body: 'padded_surcoat' });
    s.men.DESI = Object.assign(s.men.DESI || {}, { shown: 'DESI', main: false, look: 'person_town_0', hpMax: 55, lostHp: 30, armHMax: 20, lostH: 0, head: 'hood', armBMax: 60, lostB: 0, body: 'gambeson' });
    s.men.RAUL = Object.assign(s.men.RAUL || {}, { shown: 'RAUL', main: false, look: 'person_town_1', hpMax: 58, lostHp: 6, armHMax: 15, lostH: 0, head: 'leather_headband', armBMax: 60, lostB: 30, body: 'padded_vest' });
    localStorage.setItem(BohemiaCondition.KEY, JSON.stringify(s));
    let W = {}; try { W = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}') || {}; } catch (e) {}
    W.tape = Math.max(40, W.tape | 0); localStorage.setItem('bohemia.supplies.v1', JSON.stringify(W));
  });
  const zb = await fr.evaluate(() => zoomBounds());
  const walk = async (dx, dy) => fr.evaluate(([dx, dy]) => { try { if (LOOP.frame && LOOP.frame.style.display === 'block') loopClose(); } catch (e) {} try { camLetGo(); } catch (e) {} travelStop(); const r = travelTo(0, 0, [city.x + dx, city.y + dy]); travelGoes(); return r; }, [dx, dy]);
  await fr.evaluate((z) => { setZoomAt(z); render(); }, zb[1]);   /* the close end: his crew at their own size, the street not entered */
  const shots = [];
  /* 2. the picture: forced, so the four are on the glass in the order the brief asked for */
  for (const [pair, tag] of [[[['crew:person_town_0', 'bind'], ['crew:person_town_1', 'tape']], 'bandage_and_tape'], [[['you', 'helmet'], ['crew:person_town_1', 'pills']], 'helmet_and_pills']]) {
    await fr.evaluate(() => { BohemiaMarch.reset(); });
    await walk(tag === 'bandage_and_tape' ? 14 : 16, tag === 'bandage_and_tape' ? 14 : 4);
    await page.waitForTimeout(600);
    await fr.evaluate((pair) => pair.forEach(p => BohemiaMarch.force(p[0], p[1])), pair);
    const fb = await page.evaluate(() => { const f = document.querySelector('iframe'); const r = f ? f.getBoundingClientRect() : { x: 0, y: 0, width: 0 }; return r.width ? { x: r.x, y: r.y } : { x: 0, y: 0 }; });
    const cb = await fr.evaluate(() => { const r = g.canvas.getBoundingClientRect(); return { x: r.x, y: r.y }; });   /* the map's canvas sits under the top bar */
    const box = { x: fb.x + cb.x, y: fb.y + cb.y };
    for (let i = 0; i < 80; i++) {
      const st = await fr.evaluate(() => ({ you: MAP_DREW.you, acting: BohemiaMarch.acting(), last: MAP_DREW.marchLast }));
      if (!st.you) { await page.waitForTimeout(170); continue; }
      const w = 150, h = 110, x = Math.max(0, box.x + st.you.x - w / 2), y = Math.max(0, box.y + st.you.y - 80);   /* MAP_DREW.you is his feet on the canvas */
      const fn = path.join(OUT, `${tag}_${String(i).padStart(2, '0')}.png`);
      await page.screenshot({ path: fn, clip: { x, y, width: w, height: h } });
      shots.push({ fn, acting: st.acting, face: st.you.face });
      if (i > 6 && !Object.keys(st.acting).length) break;
      await page.waitForTimeout(150);
    }
  }
  /* 1. by themselves */
  await fr.evaluate(() => { BohemiaMarch.reset(); MAP_DREW.march = {}; window.__MARCH_SEEN = { most: 0, acts: {}, firstAt: null, t0: performance.now() };
    window.__MARCH_TICK = setInterval(() => { const a = BohemiaMarch.acting(), n = Object.keys(a).length; const S = window.__MARCH_SEEN;
      S.most = Math.max(S.most, n); for (const w in a) S.acts[w + ':' + a[w]] = 1; if (n && S.firstAt == null) S.firstAt = performance.now() - S.t0; }, 100); });
  let natural = null;
  for (const [dx, dy] of [[14, 14], [0, 16], [16, 0], [12, 12], [0, 14], [14, 0]]) {
    await walk(dx, dy);
    for (let i = 0; i < 40; i++) { await page.waitForTimeout(500); if (!(await fr.evaluate(() => { try { return !!TRAVEL || (CITY_GLIDE && CITY_GLIDE.u < 1); } catch (e) { return true; } }))) break; }
    natural = await fr.evaluate(() => Object.assign({}, window.__MARCH_SEEN, { drew: Object.assign({}, MAP_DREW.march || {}), face: mapFaceNow() }));
    if (Object.keys(natural.acts).length >= 3) break;
  }
  await fr.evaluate(() => clearInterval(window.__MARCH_TICK));
  console.log('BY THEMSELVES', JSON.stringify(natural));
  fs.writeFileSync(path.join(OUT, 'capture.json'), JSON.stringify({ profile, natural, shots: shots.map(s => ({ fn: path.relative(ROOT, s.fn), acting: s.acting, face: s.face })), errs }, null, 1));
  console.log('SHOTS', shots.length, 'ERRORS', errs.length, errs.slice(0, 3));
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
