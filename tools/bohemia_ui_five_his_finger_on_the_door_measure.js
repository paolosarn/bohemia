/* HIS FINGER ON THE DOOR, the card's frames (UI FIVE 11/27). Through the one driver, a fresh demo, the title, NEW GAME, the valley
   loaded, the CPU slowed 4x on the door: three crew picks with a real touch, 2.5 s each, every frame's length recorded.
   node tools/bohemia_ui_five_his_finger_on_the_door_measure.js <phone_portrait|phone_landscape> <now|before>
   writes records/target/ui5_his_finger_on_the_door_11_27/frames_<profile>_<now|before>.json
   'before' is the way it was (window.__PLANS_UNDER_THE_DOOR). */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const TT = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const profile = process.argv[2] || 'phone_portrait', way = process.argv[3] || 'now';
const OUT = path.join(ROOT, 'records/target/ui5_his_finger_on_the_door_11_27');
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const picks = [];
  const d = await drive.open({ profile, noWorker: true,
    beforeGoto: async (c, pg) => { if (way === 'before') await pg.addInitScript(() => { window.__PLANS_UNDER_THE_DOOR = true; }); },
    beforeTap: async (pg) => {
      await TT.throughTheTitle(pg, 120000);
      await pg.waitForFunction(() => window.__LOAD_READY === true, null, { timeout: 240000 }).catch(() => {});
      await pg.waitForTimeout(1500);
      const cdp = await pg.context().newCDPSession(pg); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      try {
        for (let i = 0; i < 3; i++) {
          const at = await pg.evaluate(i => { const e = [...document.querySelectorAll('#front [data-k=origin]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight; })[i];
            if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, i);
          if (!at) continue;
          await pg.evaluate(() => { window.__hfd = []; const f = t => { if (window.__hfd) { window.__hfd.push(t); requestAnimationFrame(f); } }; requestAnimationFrame(f); });
          await pg.touchscreen.tap(at[0], at[1]);
          await pg.waitForTimeout(2500);
          picks.push(await pg.evaluate(() => { const a = window.__hfd || []; window.__hfd = null; const d = []; for (let i = 1; i < a.length; i++) d.push(Math.round(a[i] - a[i - 1])); return d; }));
          await pg.waitForTimeout(300);
        }
      } finally { await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }).catch(() => {}); }
    } });
  await d.close().catch(() => {});
  const f = path.join(OUT, 'frames_' + profile + '_' + way + '.json');
  fs.writeFileSync(f, JSON.stringify({ profile, way, picks }));
  console.log(f, picks.map(p => { const s = p.reduce((a, b) => a + b, 0) || 1; return (p.length * 1000 / s).toFixed(1) + ' fps, worst ' + Math.max(0, ...p); }).join(' | '));
  process.exit(0);
})();
