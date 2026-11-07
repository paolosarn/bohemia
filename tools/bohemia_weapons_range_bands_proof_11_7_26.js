#!/usr/bin/env node
/* WEAPONS 11/7: THE RANGE BANDS ON THE TILES, the proof pictures (VAMILY rule 187(c), ask line 108).
   Opens the live fight file on his phone (390 x 844 at 3x), puts the man whose turn it is on an open row with one man of theirs,
   hands him each ranged weapon in turn (the rifle, the scoped deer rifle, the pistol, the shotgun, the bow) and photographs his
   taped ground with its range card; then the shotgun on the board's highest roof, where its extra tiles spread. Writes each
   frame, a log, and one sheet (records/target/weapons_range_bands/sheet.webp, cut by tools/bohemia_weapons_range_bands_sheet.py).
     node tools/bohemia_weapons_range_bands_proof_11_7_26.js [outdir]   */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'records/target/weapons_range_bands/proof');
fs.mkdirSync(OUT, { recursive: true });
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
(async () => {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 5, speed: 1, kind: 'suburb', flat: false, deploy: false, formation: null, band: ['brigand_thug', 'brigand_thug'], teach: false, odds: false }) });
  const p = d.page, errs = [], log = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
  for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : crewControlled(u) && !FIGHT_UI.anim.length ? 'mine' : 'wait'; }); if (st === 'mine') break; await p.waitForTimeout(250); }
  /* everyone but him and two of theirs off the board, so the card is what you see */
  await p.evaluate(() => { const S = FIGHT.S, u = FIGHT.current(); let k = 0; S.units.forEach(v => { if (v === u) return; if (v.side === 'them' && FIGHT.onField(v) && k < 2) { k++; return; } v.fled = true; }); });
  const shoot = async (id, roof) => {
    const r = await p.evaluate(([id, roof]) => {
      const S = FIGHT.S, u = FIGHT.current(), T = FIGHT._t, th = S.units.filter(v => v.side === 'them' && FIGHT.onField(v));
      const w0 = DB.weapons.rows.find(w => w.id === id); u.weapon = T.pistolShot(w0) || w0; u.loaded = true; u.ammo = null; u.ap = u.apTurn; u.fat = 0;
      let at = null;
      if (roof) {   /* the highest roof with open street beside it */
        let bestL = 0;
        for (let y = 1; y < S.h - 1; y++) for (let x = 1; x < S.w - 4; x++) { const L = FIGHT.level(x, y); if (L > bestL && T.passable(x, y) && [1, 2, 3].every(k => T.passable(x + k, y) && !FIGHT.level(x + k, y))) { bestL = L; at = { x, y }; } }
      } else {
        for (let y = 2; y < S.h - 2 && !at; y++) for (let x = 2; x + 6 < S.w - 1 && !at; x++) { let ok = true; for (let k = -1; k <= 6; k++) if (!T.passable(x + k, y) || FIGHT.level(x + k, y)) ok = false; if (ok) at = { x, y }; }
      }
      if (!at) return null;
      u.x = at.x; u.y = at.y; th[0].x = at.x + 4; th[0].y = at.y; if (th[1]) { th[1].x = at.x + 5; th[1].y = Math.min(S.h - 1, at.y + 2); }
      FIGHT_UI.pend = null; FIGHT_UI.glide = null;
      FIGHT_UI.cx = (at.x + 2.5) * FIGHT_UI.tw; FIGHT_UI.cy = (at.y + .5) * FIGHT_UI.th; clampCam(); hud();
      return { x: at.x, y: at.y, level: FIGHT.level(at.x, at.y), words: reachWords(u).trim(), card: FIGHT.bandCard(u).rings.map(r => r.d + (r.weak ? (r.dmg < 1 ? ' x' + r.dmg : ' ' + r.less) : ' best')).join(', ') };
    }, [id, roof]);
    await p.waitForTimeout(700);
    const lit = await p.evaluate(() => FIGHT_UI.bandLit && { tiles: FIGHT_UI.bandLit.tiles, weak: FIGHT_UI.bandLit.weak, labels: FIGHT_UI.bandLit.labels.map(q => q.d + ':' + q.text) });
    const box = r && await p.evaluate(q => ({ x: sx((q.x - 1.5) * FIGHT_UI.tw), y: sy((q.y - 3) * FIGHT_UI.th), w: 9 * FIGHT_UI.tw * FIGHT_UI.zoom, h: 7 * FIGHT_UI.th * FIGHT_UI.zoom, zoom: FIGHT_UI.zoom }), r);
    const name = id + (roof ? '_roof' : '');
    await p.screenshot({ path: path.join(OUT, name + '.png') });
    log.push({ name, id, roof: !!roof, at: r, lit, crop: box });
    console.log(name, JSON.stringify(r), JSON.stringify(lit));
  };
  for (const id of ['light_crossbow', 'scoped_deer_rifle', 'dagger', 'pump_shotgun', 'hunting_bow']) await shoot(id, false);
  await shoot('pump_shotgun', true);
  fs.writeFileSync(path.join(OUT, 'proof.json'), JSON.stringify({ frames: log, errs }, null, 1));
  console.log('errors', errs.length, errs.slice(0, 3));
  await d.close();
})().catch(e => { console.log('crash ' + e.message); process.exit(1); });
