#!/usr/bin/env node
/* BOHEMIA -- DIRECTION [four phones]: the phone at each act, rendered LIVE on the game's own phone. The phone already
 * draws every colour, thickness and radius from the skin variables (window.BOHEMIA_SKIN, act one = 'salvage'); this
 * tool sets the card's three sibling skins on the same element in the alpha's city frame and photographs the phone
 * on the map at the phone profile. Nothing is painted by hand: the pixels are the game's CSS reading new values.
 * The values are the card's (records/BOHEMIA_THE_FOUR_PHONES_CARD_10_9_26.md); UI adds them as siblings in SKINS.
 *
 * REFERENCE CHECK (the 9/4 standing duty): AH-01 (R4 the light was in the room: the glass shine is the one light; R10
 * wear is authored), the AI-slop strand (act three rich: the machine is smooth, the world rough), AH-03 (no glow, no
 * pill chrome), the UI three-acts law (laws/BOHEMIA_LAW_THE_UI_HAS_THREE_ACTS_9_6_26.md) and the three eras card.
 * No reference game is cited here (Fallout 1 is the UI law's own act-one interface reference, UI's department).
 *
 * Out: slices/vote/DIRECTION_THE_FOUR_PHONES.png
 */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process'), os = require('os');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'phones-'));
const CARD = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/DIRECTION_FOUR_PHONES_SKINS.json'), 'utf8'));

(async () => {
  const d = await open({ alpha: true }); await d.page.waitForTimeout(3000);
  await d.toMap(); await d.page.waitForTimeout(2000);
  const fb = await (await d.fr.frameElement()).boundingBox();
  const shots = [];
  for (const key of ['salvage', 'repaired', 'slab', 'yellowed']) {
    const sk = CARD.skins[key];
    await d.fr.evaluate((sk) => {
      const r = document.documentElement;
      if (window.__dirSkinKeys) window.__dirSkinKeys.forEach(k => r.style.removeProperty(k));
      try { window.BOHEMIA_SKIN.wear('salvage'); } catch (e) {}
      window.__dirSkinKeys = Object.keys(sk.vars || {});
      for (const k of window.__dirSkinKeys) r.style.setProperty(k, sk.vars[k]);
      document.getElementById('cityfeed').classList.remove('ring');   /* the unread alarm's gold edge hides the casing; the card is about the object */
      const g = document.getElementById('cityfeedglass'); if (g) g.classList.toggle('shattered', !!sk.shattered);
      let t = document.getElementById('dirtape'); if (t) t.remove();
      if (sk.tape) { t = document.createElement('div'); t.id = 'dirtape';
        t.style.cssText = 'position:absolute;z-index:6;pointer-events:none;' + sk.tape;
        document.getElementById('cityfeed').appendChild(t); }
    }, sk);
    await d.page.waitForTimeout(900);
    const r = await d.fr.evaluate(() => { const b = document.getElementById('cityfeed').getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
    const f = path.join(TMP, key + '.png');
    fs.writeFileSync(f, await d.page.screenshot({ clip: { x: fb.x + r.x - 6, y: fb.y + r.y - 6, width: r.w + 12, height: r.h + 12 } }));
    shots.push(key);
  }
  await d.close();
  const out = path.join(ROOT, 'slices/vote/DIRECTION_THE_FOUR_PHONES.png');
  const r = cp.spawnSync('python3', [path.join(ROOT, 'tools/bohemia_direction_four_phones.py'), TMP, out], { encoding: 'utf8' });
  process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || ''); process.exit(r.status || 0);
})().catch(e => { console.error(e); process.exit(1); });
