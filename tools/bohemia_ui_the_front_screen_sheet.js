#!/usr/bin/env node
/* THE FRONT SCREEN, JUST THE FONT: THE BEFORE AND AFTER SHEET  (UI lane 11, [the front screen, just the font], 10/18/26)

   PAOLO 10/18: 'the loading screen, the Bohemia title card, I don't want the card behind it, I just want the crazy
   font... the whole front screen looks like dog shit.'

   SHOT FROM THE DEMO'S CAMERA, through the one driver, at his phone's profile: the demo as it is (the door's switch
   says classic) and the same demo with the switch on (data-look="just-the-font", put on the door before its scripts
   read it, which is exactly what RUN's flip does). Four moments each: the title upright, the picks while the valley
   loads upright (once BEGIN is lit), the title sideways, the picks sideways. Every shot is brought down from his
   phone's three pixels to one css pixel by NEAREST, which loses nothing here: every pixel on these screens is a 3 x 3
   block on the phone. The sheet is laid in the browser with the game's own faces (casing, ROM) so its labels are the
   game's letters too.

     node tools/bohemia_ui_the_front_screen_sheet.js            # writes records/target/ui_front_screen/
   ========================================================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records/target/ui_front_screen');
const FORCE = () => { new MutationObserver((m, o) => { const f = document.getElementById('front'); if (f) { f.setAttribute('data-look', 'just-the-font'); o.disconnect(); } }).observe(document, { childList: true, subtree: true }); };

/* one css pixel a pixel, by nearest, done in the page's own canvas */
async function shot(page, file) {
  const png = (await page.screenshot()).toString('base64');
  const url = await page.evaluate(async (png) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
    const w = innerWidth, h = innerHeight, c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
    const k = im.width / w;   /* sample each block's middle pixel */
    const s = document.createElement('canvas'); s.width = im.width; s.height = im.height; const sg = s.getContext('2d'); sg.drawImage(im, 0, 0);
    const S = sg.getImageData(0, 0, im.width, im.height).data, D = g.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const sx = Math.min(im.width - 1, Math.floor((x + 0.5) * k)), sy = Math.min(im.height - 1, Math.floor((y + 0.5) * k)), i = (sy * im.width + sx) * 4, j = (y * w + x) * 4; D.data[j] = S[i]; D.data[j + 1] = S[i + 1]; D.data[j + 2] = S[i + 2]; D.data[j + 3] = 255; }
    g.putImageData(D, 0, 0); return c.toDataURL('image/png');
  }, png);
  fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
  return path.relative(ROOT, file);
}

async function moments(profile, bare, tag) {
  const files = {};
  const d = await open({ profile, keepCards: true,
    beforeGoto: async (cdp, page) => { if (bare) await page.addInitScript(FORCE); },
    beforeTap: async (page) => {
      for (let i = 0; i < 160; i++) { if (await page.evaluate(() => !!window.__LOAD_READY && !!document.querySelector('#title .bm-start'))) break; await page.waitForTimeout(250); }
      await page.waitForTimeout(1500);
      files.title = await shot(page, path.join(OUT, tag + '_title.png'));
      const nb = await page.evaluate(() => { const r = document.querySelector('#title .bm-start [data-k=new]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      await page.touchscreen.tap(nb.x, nb.y);
      for (let i = 0; i < 120; i++) { if (await page.evaluate(() => document.getElementById('front').classList.contains('ready'))) break; await page.waitForTimeout(250); }
      await page.waitForTimeout(900);
      files.picks = await shot(page, path.join(OUT, tag + '_picks.png'));
    } });
  await d.close();
  return files;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const S = {
    up_before: await moments('phone_portrait', false, 'before_upright'), up_after: await moments('phone_portrait', true, 'after_upright'),
    side_before: await moments('phone_landscape', false, 'before_sideways'), side_after: await moments('phone_landscape', true, 'after_sideways')
  };
  /* the sheet, laid with the game's own faces */
  const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const face = fam => { const m = alpha.match(new RegExp("@font-face\\{ font-family:'" + fam + "'[\\s\\S]*?src:url\\((data:font/woff2;base64,[A-Za-z0-9+/=]+)\\)")); return m ? m[1] : ''; };
  const img = rel => 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, rel)).toString('base64');
  const html = '<!doctype html><meta charset="utf-8"><style>'
    + "@font-face{font-family:C;src:url(" + face('BohemiaCasing') + ")}@font-face{font-family:R;src:url(" + face('BohemiaROM') + ")}"
    + 'body{margin:0;background:#141210;color:#e7dcc6}#s{display:inline-block;padding:24px 24px 18px;background:#141210}'
    + 'h1{margin:0 0 4px;font:400 20px C;letter-spacing:4px;color:#e6c475}p{margin:0 0 18px;font:10px/16px R;color:#b3a993;max-width:1690px}'
    + '.row{display:flex;gap:24px;margin-bottom:22px}.cell{display:flex;flex-direction:column;gap:8px}.lab{font:400 10px C;letter-spacing:3px;color:#b3a993}.lab.a{color:#e6c475}'
    + 'img{display:block;image-rendering:pixelated;outline:1px solid #3a3226}</style><div id="s">'
    + '<h1>THE FRONT SCREEN, JUST THE FONT</h1>'
    + '<p>From the demo\'s camera on his phone, shown at one css pixel a pixel (three on the phone). BEFORE: the demo as it is. AFTER: the same demo with the door\'s switch on, which is all RUN\'s cut does. '
    + 'His wordmark with the grey card keyed out (5,731 of his gold pixels kept, every one his, 46,248 card pixels gone); a cold dark ground; gold only for what matters (the name, your picks, the one next thing); '
    + 'casing and ROM at 10 and 20 px; no gradient, glow, blur or round corner; nothing blinks. Pixel size 1 css px; palette: the wordmark\'s own gold (#e6c475, #c8ab63, #a78949) and the terminal\'s green; light from the top.</p>'
    + '<div class="row">'
    + [['up_before', 'title', 'BEFORE . THE TITLE', ''], ['up_after', 'title', 'AFTER . THE TITLE', 'a'], ['up_before', 'picks', 'BEFORE . THE PICKS', ''], ['up_after', 'picks', 'AFTER . THE PICKS', 'a']]
      .map(c => '<div class="cell"><div class="lab ' + c[3] + '">' + c[2] + '</div><img src="' + img(S[c[0]][c[1]]) + '"></div>').join('')
    + '</div><div class="row">'
    + [['side_before', 'title', 'BEFORE . SIDEWAYS', ''], ['side_after', 'title', 'AFTER . SIDEWAYS', 'a']].map(c => '<div class="cell"><div class="lab ' + c[3] + '">' + c[2] + '</div><img src="' + img(S[c[0]][c[1]]) + '"></div>').join('')
    + '</div><div class="row">'
    + [['side_before', 'picks', 'BEFORE . THE PICKS SIDEWAYS (THEY RAN OFF THE GLASS)', ''], ['side_after', 'picks', 'AFTER . THE PICKS SIDEWAYS', 'a']].map(c => '<div class="cell"><div class="lab ' + c[3] + '">' + c[2] + '</div><img src="' + img(S[c[0]][c[1]]) + '"></div>').join('')
    + '</div></div>';
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 1 });
  await pg.setContent(html); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(300);
  const sheet = path.join(OUT, 'UI_THE_FRONT_SCREEN_JUST_THE_FONT.png');
  await (await pg.$('#s')).screenshot({ path: sheet });
  await b.close();
  fs.writeFileSync(path.join(OUT, 'UI_THE_FRONT_SCREEN_JUST_THE_FONT.json'), JSON.stringify({ sheet: path.relative(ROOT, sheet), shots: S, made: '10/18', lane: 'ui', row: '[the front screen, just the font]' }, null, 1) + '\n');
  console.log('sheet: ' + path.relative(ROOT, sheet));
})().catch(e => { console.error(e); process.exit(1); });
