/* THE PHONE'S CRACK, the shots (UI [the phone's crack], 10/16/26). The demo's map on his phone profile through the one driver:
   the phone as it is, then each cut from his pack laid on its glass IN THE BROWSER ONLY (nothing written to the game), one art
   pixel to one phone pixel, the city file's hairline crack hidden for the picture. Also measures how much of the phone's words
   each cut covers. node tools/bohemia_ui_the_phones_crack_shots.js <out dir> */
const fs = require('fs'), path = require('path'); const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const cuts = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/ui_the_phones_crack/cuts.json')));
/* where each lands on the glass: the corner the phone was dropped on */
const AT = { A: { right: 6, top: 30 }, B: { left: 0, bottom: 0 }, C: { right: 0, bottom: 40 },
  D1: { left: 118, top: 22 }, D2: { left: 100, top: 52 }, D3: { left: 82, top: 84 }, D4: { left: 62, top: 116 }, D5: { left: 44, top: 150 },
  E: { right: -14, top: -9 }, F1: { right: -14, top: -9 }, F2: { right: 0, top: 12 }, G1: { right: -14, top: -9 }, G2: { right: 0, top: 12 }, G3: { right: -3, top: 42 } };
const SETS = { A: ['A'], B: ['B'], C: ['C'], D: ['D1', 'D2', 'D3', 'D4', 'D5'], E: ['E'], F: ['F1', 'F2'], G: ['G1', 'G2', 'G3'] };
const out = process.argv[2];
(async () => {
  const d = await open({ door: 120000 }); const p = d.page, fr = d.fr;
  await p.waitForTimeout(7000);
  const fb = await (await fr.frameElement()).boundingBox();
  const clip = await fr.evaluate(() => { const r = document.getElementById('cityfeed').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  const C = { x: fb.x + clip.x - 4, y: fb.y + clip.y - 4, width: clip.w + 8, height: clip.h + 8 };
  await p.screenshot({ path: out + '/phone_now.png', clip: C });
  const res = { clip: C, dpr: 3 };
  for (const k of Object.keys(SETS)) {
    const parts = SETS[k].map(j => ({ src: 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, cuts[j].out)).toString('base64'), w: cuts[j].w, h: cuts[j].h, at: AT[j] }));
    res[k] = await fr.evaluate(({ parts }) => {
      document.querySelectorAll('.bmcrackcand').forEach(e => e.remove());
      let st = document.getElementById('bmcrackcss'); if (!st) { st = document.createElement('style'); st.id = 'bmcrackcss'; document.head.appendChild(st); }
      st.textContent = '#cityfeedglass svg,#cityfeedglass .second{visibility:hidden!important}';
      const scr = document.getElementById('cityfeedscreen'); if (getComputedStyle(scr).position === 'static') scr.style.position = 'relative';
      const ims = parts.map(({ src, w, h, at }) => { const im = document.createElement('img'); im.className = 'bmcrackcand'; im.src = src; im.alt = '';
        Object.assign(im.style, { position: 'absolute', zIndex: 3, pointerEvents: 'none', imageRendering: 'pixelated', width: (w / 3) + 'px', height: (h / 3) + 'px' });
        Object.keys(at).forEach(s => im.style[s] = at[s] + 'px'); scr.appendChild(im); return im; });
      return new Promise(r => setTimeout(() => { const all = ims.map(im => {
        const q = im.getBoundingClientRect();
        /* the words it lies on: every text box on the screen it overlaps, as a share of that box */
        const hits = [...scr.querySelectorAll('*')].filter(e => e.children.length === 0 && (e.textContent || '').trim() && e.offsetParent)
          .map(e => { const t = e.getBoundingClientRect(); const ix = Math.max(0, Math.min(t.right, q.right) - Math.max(t.left, q.left)), iy = Math.max(0, Math.min(t.bottom, q.bottom) - Math.max(t.top, q.top));
            return { t: e.textContent.trim().slice(0, 20), share: +(ix * iy / (t.width * t.height)).toFixed(2) }; }).filter(o => o.share > 0);
        return { box: [q.x, q.y, q.width, q.height].map(v => +v.toFixed(2)), nat: [im.naturalWidth, im.naturalHeight], hits }; });
        r(all); }, 500));
    }, { parts });
    await p.waitForTimeout(800);
    await p.screenshot({ path: out + '/phone_' + k + '.png', clip: C });
  }
  fs.writeFileSync(out + '/phone_shots.json', JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res));
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
