/* ============================================================================
   DOOR JAMB GATE (8/2/26)

   Paolo 8/2: "if there is a door i need you to have it stick out slightly on the
   next tile that its supposed to be on... assigned to tile 0 it will have a slight
   appearance in tile -1 or 1."

   His own art: banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt, 184 doors x {W,E} = 368
   frame-edge strips, 0 of which had ever shipped. Measured, the W tile is opaque in
   columns 0..6 and the E tile in columns 37..43 -- a 7px jamb for the cell NEXT
   DOOR, exactly what he described.

   This gate ends by DRAWING a door in a real browser and counting jamb blits,
   because "the strips are in the file" is not the same as "the door sticks out".
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const BANK = path.join(ROOT, 'banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
function pw(){ try{ return require('/opt/node22/lib/node_modules/playwright'); }
  catch(e){ return require('playwright'); } }
function cityBlob(a){
  for (let ci = a.indexOf('CITY_B64'); ci >= 0; ci = a.indexOf('CITY_B64', ci + 1)) {
    const t = a.slice(ci + 8, ci + 20), eq = t.indexOf('='); if (eq < 0) continue;
    const qi = t.slice(eq).search(/['"`]/); if (qi < 0) continue;
    const st = ci + 8 + eq + qi + 1, en = a.indexOf(a[st - 1], st);
    if (en - st < 100000) continue;
    return Buffer.from(a.slice(st, en), 'base64').toString('utf8');
  }
  return '';
}

(async () => {
  const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
  ok('his jamb bank is still there (' + bank.doors.length + ' doors)', bank.doors.length > 100);

  const alpha = fs.readFileSync(ALPHA, 'utf8');
  const city = cityBlob(alpha);
  ok('the alpha carries a readable CITY renderer', city.length > 100000);

  /* BYTES: his strips, in the shipped renderer */
  let hit = 0, tot = 0;
  for (const d of bank.doors.slice(0, 40)) for (const v of d.variants) {
    tot++; if (city.indexOf(v.b64.slice(0, 160)) >= 0) hit++;
  }
  ok('HIS OWN jamb strips are in the renderer, byte for byte (' + hit + '/' + tot + ' sampled)',
     hit === tot && tot > 0);

  /* his note bans both of these, so the code must do neither */
  ok('the jamb is NEVER mirrored (his note: "never squished/mirrored")',
     !/scale\(-1/.test(city.slice(city.indexOf('function doorJamb('),
                                  city.indexOf('function doorJamb(') + 700)));
  ok('the jamb blits 1:1 into a cell, never stretched',
     /drawImage\(wi,dx-C,ry,C,C\)/.test(city) && /drawImage\(ei,dx\+C,ry,C,C\)/.test(city));
  ok('it lands on BOTH sides -- tile -1 and tile +1',
     /dx-C/.test(city) && /dx\+C/.test(city));
  ok('and on both rows, because the opening is two tiles tall', /for\(let r=0;r<2;r\+\+\)/.test(city));

  const { chromium } = pw();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
    await page.waitForTimeout(3000);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(1500);
    await page.evaluate(() => { const t = document.querySelector('[data-p="run"]'); if (t) t.click(); });
    let f = null;
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(3000);
      f = page.frames().find(fr => /srcdoc/.test(fr.url()) && fr !== page.mainFrame());
      if (!f) continue;
      const up = await f.evaluate(() => typeof fit === 'function' &&
        document.getElementById('cv').width > 300).catch(() => false);
      if (up) break;
    }
    ok('the world frame booted', !!f);
    if (f) {
      const r = await f.evaluate(() => {
        const out = { loaded: 0, total: 0, jambDraws: 0 };
        if (typeof JAMB_WI === 'undefined') return out;
        out.total = JAMB_WI.length;
        for (const im of JAMB_WI) if (im.complete && im.naturalWidth) out.loaded++;
        try { if (MODE !== 'human' && typeof swapMode === 'function') swapMode(); } catch (e) {}
        /* stand at a real door so the facade actually draws one */
        const t0x = city.x, t0y = city.y;
        for (let ly = 2; ly < FN - 2; ly++) for (let lx = 2; lx < FN - 2; lx++) {
          const c = cellAt(t0x * FN + lx, t0y * FN + ly);
          if (c && c.face && c.artPool_face === 'hdoor') {
            hx = t0x * FN + lx; hy = t0y * FN + ly + 1; ly = FN; break;
          }
        }
        window.__JAMB_DRAWS = 0;
        try { render(); } catch (e) {}
        out.jambDraws = window.__JAMB_DRAWS || 0;
        return out;
      });
      ok('his strips are LOADED in the browser (' + r.loaded + '/' + r.total + ')',
         r.total > 0 && r.loaded === r.total);
      ok('THE DOOR ACTUALLY STICKS OUT: jambs drawn into the neighbouring tiles ('
         + r.jambDraws + ' doors framed on screen)', r.jambDraws > 0);
    }
  } finally { await browser.close(); }
  console.log('DOOR JAMB GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('DOOR JAMB GATE CRASHED: ' + e.message); process.exit(1); });
