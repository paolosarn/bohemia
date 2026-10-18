#!/usr/bin/env node
/* BOHEMIA -- ANIMATION [ragdoll hits] (10/17, rule 110's swing: 'the ragdoll's hit variety (a shot, a club, a fall from a roof)
   in eight'). THE BAKE: opens the real alpha through the one driver, sets RAGDOLL.kind to each of blow (the 10/13 push, the
   one in VOTE), shot, club and roof, and films the rig's OWN frames (buildFrame, the twelve drawn keys and the last) for the
   player and the Reds in all eight facings, with each key's LIFT (how far the body is above the floor: the roof fall is in
   the air and the picture is set on the ground by fallPlace, so the page lifts it back). Writes the PNGs to a scratch dir
   and a table; tools/bohemia_animation_ragdoll_hits_bake.py packs them into slices/vote/ANIMATION_RAGDOLL_HITS.webp
   (lossless) + _TABLE.js. Nothing in the fight reads RAGDOLL.kind (rule 100).
   REFERENCE CHECK (the 9/4 standing duty): the frames are the alpha's own; the before is the 10/13 blow on the same bones.
   usage: NODE_PATH=$(npm root -g) node tools/bohemia_animation_ragdoll_hits_bake.js <out dir> */
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const OUT = process.argv[2]; if (!OUT) { console.error('usage: ... <out dir>'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
const KINDS = ['blow', 'shot', 'club', 'roof'], LOOKS = ['you', 'faction_reds'], DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
(async () => {
  const t0 = Date.now(); const d = await open({ alpha: true }); let ready = false;
  for (let i = 0; i < 360 && !ready; i++) { ready = await d.page.evaluate(() => typeof ragdollSim === 'function' && typeof buildFrame === 'function' && !!window.FACTION_LOOKS).catch(() => false); if (!ready) await d.page.waitForTimeout(500); }
  if (!ready) { console.error('the alpha did not boot'); process.exit(1); }
  console.error('booted in ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s');
  const table = { kinds: KINDS, looks: LOOKS, dirs: DIRS, keys: 13, beats: 4, cell: null, lifts: {}, files: [] };
  for (const L of LOOKS) {
    await d.page.evaluate((id) => { const m = id === 'you' ? null : FACTION_LOOKS.filter(x => 'faction_' + x.faction.toLowerCase() === id)[0];
      if (m) { window.G_WORN = m.worn; G.bodyVar = m.dials; G.age = m.age || 'adult'; } rebuildFromRig(); FRAME_CACHE.map.clear(); }, L);
    for (const kind of KINDS) {
      const r = await d.page.evaluate(([kind, DIRS]) => {
        RAGDOLL.kind = kind; FRAME_CACHE.map.clear(); const out = { cell: null, pics: [], lifts: {} };
        const cv = document.createElement('canvas');
        for (const dir of DIRS) { out.lifts[dir] = [];
          for (let k = 0; k < 13; k++) { const ph = k < 12 ? (k + 0.5) / 12 : 1; const f = buildFrame(dir, 'ragdoll', ph);
            out.lifts[dir].push(ragdollPose(dir, ph).present._lift || 0);
            cv.width = f.CW; cv.height = f.CH; const g = cv.getContext('2d'); const im = g.createImageData(f.CW, f.CH);
            for (let i = 0; i < f.px.length; i++) { const p = f.px[i]; if (!p) continue; im.data[i * 4] = p[0]; im.data[i * 4 + 1] = p[1]; im.data[i * 4 + 2] = p[2]; im.data[i * 4 + 3] = 255; }
            g.putImageData(im, 0, 0); out.cell = [f.CW, f.CH]; out.pics.push(cv.toDataURL('image/png').split(',')[1]); } }
        return out; }, [kind, DIRS]);
      table.cell = r.cell; table.lifts[L + '|' + kind] = r.lifts;
      r.pics.forEach((b64, i) => { const dir = DIRS[(i / 13) | 0], k = i % 13; const fn = L + '_' + kind + '_' + dir + '_k' + String(k).padStart(2, '0') + '.png';
        fs.writeFileSync(path.join(OUT, fn), Buffer.from(b64, 'base64')); table.files.push(fn); });
      console.error(L + ' ' + kind + ': ' + r.pics.length + ' pictures');
    }
  }
  await d.page.evaluate(() => { RAGDOLL.kind = 'blow'; FRAME_CACHE.map.clear(); });
  fs.writeFileSync(path.join(OUT, 'table.json'), JSON.stringify(table));
  console.log(JSON.stringify({ out: OUT, pictures: table.files.length, cell: table.cell }));
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  process.exit(0);   /* the driver's server keeps node alive after the work (measured 10/17: the bake hung to its timeout with every picture written) */
})().catch(e => { console.error('ERR ' + e.message); process.exit(1); });
