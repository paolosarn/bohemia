#!/usr/bin/env node
/* BOHEMIA -- RUN [the districts connect on the map] (10/18): the picture for the VOTE tab.
   The demo's own map from the game's camera, the same moment twice: BEFORE (the old grey carpet, both
   switches off) and AFTER (__THE_STREETS_JOIN__ and __THE_DISTRICTS_READ_APART__ on), at the middle zoom
   and one step closer on the phone, pulled out to the roads out of town (__THE_ROADS_OUT_JOIN__), and the
   middle zoom on a laptop. Prints the paint cost of each.
     node tools/bohemia_run_the_streets_join_shot.js
   -> slices/vote/RUN_THE_STREETS_JOIN_10_18.png */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'slices/vote/RUN_THE_STREETS_JOIN_10_18.png');

async function pair(d, z, clip) {
  const out = [];
  for (const off of [1, 0]) {
    const ms = await d.fr.evaluate(([z, off]) => {
      try { moversAdvance = function(){}; } catch (_e) {}
      window.__STREETS_OFF = !!off; window.__DISTRICTS_OFF = !!off;
      CZOOM = z === 'far' ? zoomBounds()[0] : z; TW = TW0 * CZOOM; TH = TH0 * CZOOM; panX = 0; panY = 0;
      try { clampPan(); } catch (_e) {}
      MAP_GROUND.key = ''; const t = performance.now(); render();
      return [Math.round(performance.now() - t), STREETS_JOIN.drew];
    }, [z, off]);
    await d.page.waitForTimeout(600);
    out.push((await d.page.screenshot({ clip })).toString('base64'));
    console.log('zoom ' + z + (off ? ' before' : ' after ') + ': paint ' + ms[0] + ' ms, ' + ms[1] + ' street blocks');
  }
  return out;
}

(async () => {
  process.chdir(ROOT);
  const shots = [];
  let d = await D.open({});
  shots.push(['PHONE, MIDDLE ZOOM'].concat(await pair(d, 1.21, { x: 0, y: 330, width: 390, height: 440 })));
  shots.push(['PHONE, ONE STEP CLOSER'].concat(await pair(d, 2.4, { x: 0, y: 330, width: 390, height: 440 })));
  shots.push(['PHONE, PULLED OUT: THE ROADS OUT'].concat(await pair(d, 0.3, { x: 0, y: 330, width: 390, height: 440 })));
  await d.close();
  d = await D.open({ profile: 'computer' });
  shots.push(['LAPTOP, MIDDLE ZOOM'].concat(await pair(d, 1.21, { x: 120, y: 120, width: 900, height: 560 })));
  await d.close();
  const page = await (await require('/opt/node22/lib/node_modules/playwright').chromium.launch()).newPage();
  const sheet = await page.evaluate(async (rows) => {
    const load = (s) => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + s; });
    const imgs = [];
    for (const r of rows) imgs.push([r[0], await load(r[1]), await load(r[2])]);
    const W = Math.max(...imgs.map(r => r[1].width * 2 + 30)), H = imgs.reduce((a, r) => a + r[1].height + 44, 10);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
    g.fillStyle = '#14110d'; g.fillRect(0, 0, W, H);
    let y = 10;
    for (const [lab, b, a] of imgs) {
      g.fillStyle = '#e8dcc0'; g.font = 'bold 22px monospace';
      g.fillText(lab + ' -- BEFORE', 6, y + 24); g.fillText('AFTER', b.width + 20, y + 24);
      g.drawImage(b, 6, y + 34); g.drawImage(a, b.width + 20, y + 34);
      y += b.height + 44;
    }
    return c.toDataURL('image/png').split(',')[1];
  }, shots);
  fs.writeFileSync(OUT, Buffer.from(sheet, 'base64'));
  /* 8.5 MB raw at the phone's 3x: halved and held to 256 colours (about 1 MB), the size a VOTE card can carry */
  require('child_process').execFileSync('python3', ['-c', "from PIL import Image\nimport sys\np=sys.argv[1]\nim=Image.open(p).convert('RGB')\nim=im.resize((im.width//2,im.height//2),Image.LANCZOS)\nim.quantize(256,method=Image.MEDIANCUT,dither=Image.NONE).save(p,optimize=True)", OUT]);
  console.log('-> ' + path.relative(ROOT, OUT));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
