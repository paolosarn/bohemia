#!/usr/bin/env node
/* THE MAP'S PEOPLE ARE PACKED: the VOTE card's two pictures (CHARACTER 3, 11/27/26, ask row 769). The demo upright, the map after
   the town, two pinches in; once the way before (window.__MAP_SHEETS_WHOLE) and once now; each with what the map holds for its
   people. Writes records/target/character/the_maps_people_are_packed/{before,now}.png and numbers.json; the card is put together by
   tools/bohemia_character_three_the_map_sheets_packed_card.py. */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/target/character/the_maps_people_are_packed');
const D = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function one(label, arm) {
  const d = await D.open({ profile: 'phone_portrait', door: 180000, engage: true, pages: true, arm: arm || '' });
  try {
    await sleep(2500); await d.fr.evaluate(() => { try { if (LOOP && LOOP.open) loopClose(); } catch (e) {} });
    for (let i = 0; i < 120; i++) { if (await d.fr.evaluate(() => { try { return !rigWaiting() && Object.keys(RIG_MIX.sheets).length >= 5 && Object.values(RIG_MIX.sheets).every(S => S.state >= 2); } catch (e) { return false; } })) break; await sleep(500); }
    await sleep(6000); await d.pinchIn(); await sleep(1500); await d.pinchIn(); await sleep(1500);
    for (let i = 0; i < 40; i++) { if (await d.fr.evaluate(() => { try { return mapFinalLook(); } catch (e) { return true; } })) break; await sleep(500); }
    await sleep(4000);
    await d.shot(path.join(OUT, label + '.png'));
    const you = await d.fr.evaluate(() => { try { const r = document.getElementById('cv').getBoundingClientRect(); return MAP_DREW.you ? { x: MAP_DREW.you.x, y: MAP_DREW.you.y, cw: r.width } : null; } catch (e) { return null; } });
    fs.writeFileSync(path.join(OUT, label + '.you.json'), JSON.stringify(you));
    return await d.fr.evaluate(() => { const sheets = { BOHEMIA_RIG_CAST: RIG_CAST, BOHEMIA_RIG_PEOPLE: RIG_PEOPLE, BOHEMIA_RIG_YOU: RIG_YOU }; for (const n in RIG_MIX.sheets) sheets['rig_mix/' + n] = RIG_MIX.sheets[n];
      let mb = 0, n = 0; for (const k in sheets) { const S = sheets[k]; if (S.state === 2 && S.img) { n++; mb += S.img.width * S.img.height * 4 / 1048576; } }
      return { sheets: n, MB: Math.round(mb), packed: MAP_PACKED.used, whole: MAP_PACKED.whole, drawn: (MAP_DREW && MAP_DREW.art && MAP_DREW.art.rigPeople) | 0 }; });
  } finally { try { await d.close(); } catch (e) {} }
}
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  /* a boot whose camera left him near the glass's edge is shot again (the start rolls a new place each time), up to three boots */
  const good = (l) => { try { const y = JSON.parse(fs.readFileSync(path.join(OUT, l + '.you.json'), 'utf8')); return y && y.y > 844 * 0.25 && y.y < 844 * 0.7; } catch (e) { return false; } };
  let before = null, now = null;
  for (let t = 0; t < 3 && !(before && good('before')); t++) before = await one('before', 'window.__MAP_SHEETS_WHOLE = true;');
  for (let t = 0; t < 3 && !(now && good('now')); t++) now = await one('now', '');
  fs.writeFileSync(path.join(OUT, 'numbers.json'), JSON.stringify({ before, now }, null, 1));
  console.log(JSON.stringify({ before, now }));
})().catch(e => { console.error(e); process.exit(1); });
