#!/usr/bin/env node
/* THE RADIO LIVES IN THE FEED, THE PICTURES (WORDS 2, 11/3/26; rule 371, ask line 397).
   Opens the real demo on an upright phone (tools/bohemia_drive_the_demo.js), lets the Church fall, and takes the phone's own
   glass at three moments of it (its strip in the feed's format, nothing else between the lines), for the VOTE card
   slices/vote/WORDS2_THE_RADIO_LIVES_IN_THE_FEED_11_3.html. Writes slices/vote/words2_radio/fall_1..3.webp.
     node tools/bohemia_words2_radio_in_the_feed_shots.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'slices/vote/words2_radio');
(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await open({ profile: 'phone_portrait', door: 120000, engage: true }); const p = d.page, fr = d.fr;
  fs.mkdirSync(OUT, { recursive: true });
  const got = [];
  try {
    await p.waitForTimeout(2500); try { await d.clearCards(); } catch (_e) {}
    await fr.evaluate(() => BohemiaRadio.fall('Church', 'Mob'));
    await fr.waitForFunction(() => BohemiaRadio.state().playing && BohemiaRadio.live().length > 0, null, { timeout: 120000 });
    const at = [1500, 22000, 46000]; let t0 = Date.now();
    for (let i = 0; i < at.length; i++) {
      await p.waitForTimeout(Math.max(0, at[i] - (Date.now() - t0)));
      const box = await p.evaluate(() => { const e = document.querySelector('#bohphone'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
      const words = await p.evaluate(() => { const f = document.querySelector('#bohphone .home .bpfd .fp'); return f ? f.innerText : ''; });
      const png = path.join(OUT, 'fall_' + (i + 1) + '.png');
      await p.screenshot({ path: png, clip: box ? { x: Math.max(0, box.x), y: Math.max(0, box.y), width: box.w, height: box.h } : undefined });
      got.push({ png, words });
    }
  } finally { try { await d.browser.close(); } catch (_e) {} try { d.server.close(); } catch (_e) {} }
  const { execFileSync } = require('child_process');
  got.forEach(g => { const w = g.png.replace(/\.png$/, '.webp'); execFileSync('python3', ['-c', 'import sys;from PIL import Image;Image.open(sys.argv[1]).save(sys.argv[2],"WEBP",quality=86)', g.png, w]); fs.unlinkSync(g.png); console.log(path.relative(ROOT, w) + '  ' + JSON.stringify(g.words)); });
})().catch(e => { console.error(e); process.exit(1); });
