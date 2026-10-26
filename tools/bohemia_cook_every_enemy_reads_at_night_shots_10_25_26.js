#!/usr/bin/env node
/* COOK [every enemy reads at night] (10/25/26): THE PICTURE beside the numbers. The fight page at night (the one driver, his phone
   upright and a computer), each board on one seed, the camera close on the enemy's line: the page as it draws now (each man picks
   moonlit or silhouette for his tile, moonFor) beside the old pick (the tile's light alone, moonOf before), the same frame. And
   every enemy look (the Kids and Runners, the Mechanic, the Heavy, the beasts) stood on the board's darkest open tile, so EYES
   meets the Kid's look at night (his list, line 3: 'the Kid's look... not met').
     node tools/bohemia_cook_every_enemy_reads_at_night_shots_10_25_26.js <out dir> [kind,kind] [profile]
   -> <out>/<kind>_<profile>_before.png, _after.png, _cast.png (each look on the dark tile), side_by_side_<profile>.jpg */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'records/target/cook_enemy_night/shots'));
const KINDS = (process.argv[3] || 'strip,suburb').split(',');
const PROFILE = process.argv[4] || 'phone_portrait';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const shots = [];
  for (const kind of KINDS) {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: PROFILE, arm: 'window.FIGHT_OPTS={seed:31,speed:1,kind:"' + kind + '",night:true}' });
    try {
      await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 40000 });
      await d.page.waitForTimeout(2500);
      /* the camera on their line, close */
      await d.page.evaluate(() => {
        const them = FIGHT.S.units.filter(u => u.side === 'them' && FIGHT.onField(u));
        const mx = them.reduce((s, u) => s + u.x, 0) / them.length, my = them.reduce((s, u) => s + u.y, 0) / them.length;
        FIGHT_UI.glide = null; FIGHT_UI.zoom = FIGHT_UI.far * 2.6; FIGHT_UI.cx = (mx + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (my + .5) * FIGHT_UI.th;
        FIGHT.shown = function () { return true; };   /* the picture is of the art: every man drawn, whatever his crew can see */
      });
      await d.page.waitForTimeout(4000);   /* the night sheets and the props a man holds are built on first sight */
      const after = path.join(OUT, kind + '_' + PROFILE + '_after.png'); await d.page.screenshot({ path: after });
      /* the old pick, the same frame */
      await d.page.evaluate(() => { window.__moonFor = moonFor; moonFor = function (img, x, y) { UI.moonAt = {}; const L = UI.groundLum, S = FIGHT.S; return L && L[y * S.w + x] > MOON_SILHOUETTE ? MOON_SHADE : MAN_MOON; }; UI.moonAt = {}; });
      await d.page.waitForTimeout(600);
      const before = path.join(OUT, kind + '_' + PROFILE + '_before.png'); await d.page.screenshot({ path: before });
      await d.page.evaluate(() => { moonFor = window.__moonFor; UI.moonAt = {}; });
      /* every enemy look on the board's darkest open tile near their line: the Kid's look at night */
      const cast = await d.page.evaluate(async () => {
        const S = FIGHT.S, T = FIGHT._t, G = FIGHT_UI.groundLum, L = DB.rig.looks;
        const them = S.units.filter(u => u.side === 'them' && FIGHT.onField(u) && !u.beast && !u.machine && !u.ghost);
        const free = [];
        for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (T.passable(x, y) && !T.litAt(x, y) && !S.units.some(u => FIGHT.onField(u) && u.x === x && u.y === y)) free.push({ x, y, g: G[y * S.w + x] });
        free.sort((a, b) => a.g - b.g);
        const looks = Object.keys(L).filter(k => L[k].kind === 'enemy').filter((k, i, a) => a.findIndex(q => L[q].type === L[k].type) === i).concat(['enemy_runner_1', 'enemy_runner_3']);
        const out = [];
        them.slice(0, looks.length).forEach((u, i) => { const t = free[i]; if (!t) return; u.x = t.x; u.y = t.y; u.look = looks[i]; out.push({ look: looks[i], x: t.x, y: t.y, g: +t.g.toFixed(4) }); });
        const xs = out.map(o => o.x), ys = out.map(o => o.y);
        FIGHT_UI.cx = ((Math.min(...xs) + Math.max(...xs)) / 2 + .5) * FIGHT_UI.tw; FIGHT_UI.cy = ((Math.min(...ys) + Math.max(...ys)) / 2 + .5) * FIGHT_UI.th;
        FIGHT_UI.zoom = FIGHT_UI.far * 2.2;
        return out;
      });
      await d.page.waitForTimeout(900);
      const castFn = path.join(OUT, kind + '_' + PROFILE + '_cast.png'); await d.page.screenshot({ path: castFn });
      console.log(kind, 'cast on the darkest tiles', JSON.stringify(cast));
      shots.push({ kind, before, after, cast: castFn });
    } finally { await d.close(); }
  }
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'computer', arm: 'window.FIGHT_OPTS={seed:1,speed:1}' });
  try {
    const imgs = []; shots.forEach(s => { [['before', 'THE OLD PICK'], ['after', 'NOW'], ['cast', 'EVERY ENEMY ON THE DARKEST TILES']].forEach(([k, t]) => imgs.push({ t: s.kind + ' NIGHT: ' + t, src: 'data:image/png;base64,' + fs.readFileSync(s[k]).toString('base64') })); });
    const b64 = await d.page.evaluate(async (a) => {
      const ims = await Promise.all(a.imgs.map(o => new Promise(r => { const i = new Image(); i.onload = () => r({ i, t: o.t }); i.src = o.src; })));
      const w = 360, h = Math.round(ims[0].i.height * w / ims[0].i.width), c = document.createElement('canvas'); c.width = 3 * (w + 6); c.height = Math.ceil(ims.length / 3) * (h + 34) + 6;
      const x = c.getContext('2d'); x.fillStyle = '#111'; x.fillRect(0, 0, c.width, c.height);
      ims.forEach((o, k) => { const X = (k % 3) * (w + 6), Y = Math.floor(k / 3) * (h + 34); x.drawImage(o.i, X, Y + 28, w, h); x.fillStyle = '#ddd'; x.font = 'bold 15px monospace'; x.fillText(o.t, X + 6, Y + 20); });
      return c.toDataURL('image/jpeg', 0.85).split(',')[1];
    }, { imgs });
    fs.writeFileSync(path.join(OUT, 'side_by_side_' + PROFILE + '.jpg'), Buffer.from(b64, 'base64'));
  } finally { await d.close(); }
})().catch(e => { console.error(e); process.exit(1); });
