#!/usr/bin/env node
/* COOK [eyes: the night board] (10/25/26), rule 179 and rule 167(a) (Paolo 10/25: 'the combat map like went completely like almost
   like black and white... I was like how it was previously'); EYES 10/25 on BUILD 10/25o (records/eyes_every_ask_10_25/q39,
   q43): 'by day the boards are back in colour; both night fights read almost black and white, grey-blue with pools of light
   blown out to white'. DONE WHEN (the row): a night board keeps the day's hues, darker and cooler, no blown white, side by side
   with the same board by day.
   THE MEASURE: the fight page itself (slices/BOHEMIA_FIGHT.html, the one driver, his phone held upright and a computer), the same
   board dealt by day and by night (FIGHT_OPTS seed and kind), pinched to the gate's own stop (FIGHT_UI.far * 1.8). On the baked
   board (the ground and its cover, before any man is drawn on it): its median chroma (CIELAB C*), the night's chroma as a share
   of the day's on the SAME texels, how far the hue turned, the share of texels blown white (every channel over 245), and the
   share that went grey (C* under 3). Then the fight gate's own legs for a night you can read (gates/the_rebuilt_fight_plays_gate.js,
   rule 73): the dark ground keeps over 0.55 of the day's light, a lit tile three to one over a dark one.
     node tools/bohemia_cook_the_night_board_10_25_26.js <out dir> [phone_portrait|computer] [kind,kind...] [seed]
   -> <out>/<kind>_<day|night>_<profile>.png, <out>/side_by_side_<profile>.jpg, <out>/night_<profile>.json
   REFERENCE CHECK: his own 'how it was previously' by day (the board at 9cae20af's parent, put back byte for byte in bc076ba3)
   beside the same board at night; and the world: a city street at night under sodium lamps keeps its brick and its paint, darker
   and bluer in the shade, warm under the lamp, never a white disc (any night photograph of a lit street). */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'records/target/cook_night_board/look'));
const PROFILE = process.argv[3] || 'phone_portrait';
const KINDS = (process.argv[4] || 'strip,freeway,suburb').split(',');
const SEED = +(process.argv[5] || 31);

/* in the page: the baked board's pixels, as Lab per texel sampled on a grid, and the gate's readability numbers */
const READ = function () {
  const B = FIGHT_UI.board, x = B.getContext('2d'), W = B.width, H = B.height, d = x.getImageData(0, 0, W, H).data, step = Math.max(1, Math.floor(Math.sqrt(W * H / 60000)));
  const lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
  const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  const px = [];
  for (let y = 0; y < H; y += step) for (let X = 0; X < W; X += step) { const o = (y * W + X) * 4; if (d[o + 3] < 200) { px.push(null); continue; }
    const r = lin(d[o]), g = lin(d[o + 1]), b = lin(d[o + 2]);
    const XX = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047, YY = 0.2126 * r + 0.7152 * g + 0.0722 * b, ZZ = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
    const L = 116 * f(YY) - 16, A = 500 * (f(XX) - f(YY)), Bb = 200 * (f(YY) - f(ZZ));
    px.push([+L.toFixed(1), +A.toFixed(1), +Bb.toFixed(1), d[o] > 245 && d[o + 1] > 245 && d[o + 2] > 245 ? 1 : 0]); }
  /* the gate's SUN, plain: the dark and lit tiles' median light on the baked board */
  const S = FIGHT.S, T = FIGHT._t, Yof = (i) => .2126 * lin(d[i]) + .7152 * lin(d[i + 1]) + .0722 * lin(d[i + 2]);
  const med = a => { a = a.slice().sort((p, q) => p - q); return a.length ? a[Math.floor(a.length / 2)] : 0; };
  const tw = W / S.w, th = H / S.h, occ = {}; S.units.forEach(u => { if (FIGHT.onField(u)) occ[u.x + ',' + u.y] = 1; });
  const lit = [], dark = [];
  for (let y = 0; y < S.h; y++) for (let X = 0; X < S.w; X++) { if (!T.passable(X, y) || occ[X + ',' + y]) continue;
    const v = []; for (let i = 1; i < 6; i++) for (let j = 1; j < 6; j++) v.push(Yof((Math.floor((y + j / 6) * th) * W + Math.floor((X + i / 6) * tw)) * 4));
    (T.litAt(X, y) ? lit : dark).push(med(v)); }
  return { W, H, step, px, dark: med(dark), lit: med(lit), nLit: lit.length, pools: FIGHT_UI.poolsDrawn || 0, night: !!S.night, board: S.board };
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const res = { profile: PROFILE, seed: SEED, kinds: {} };
  const shots = [];
  for (const kind of KINDS) {
    const got = {};
    for (const night of [false, true]) {
      const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: PROFILE, arm: 'window.FIGHT_OPTS={seed:' + SEED + ',speed:1,kind:"' + kind + '",night:' + night + '}' });
      try {
        await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 30000 });
        await d.page.waitForTimeout(3000);
        await d.page.evaluate(() => { FIGHT_UI.glide = null; FIGHT_UI.zoom = FIGHT_UI.far * 1.8; });
        await d.page.waitForTimeout(500);
        got[night ? 'night' : 'day'] = await d.page.evaluate(READ);
        const fn = path.join(OUT, kind + '_' + (night ? 'night' : 'day') + '_' + PROFILE + '.png');
        await d.page.screenshot({ path: fn }); shots.push({ kind, night, fn });
        if (d.errs && d.errs.length) got[night ? 'nightErr' : 'dayErr'] = d.errs[0];
      } finally { await d.close(); }
    }
    /* the same texels by day and by night */
    const D0 = got.day, N0 = got.night, cd = [], cn = [], dh = [], share = []; let blown = 0, grey = 0, all = 0;
    for (let i = 0; i < Math.min(D0.px.length, N0.px.length); i++) { const a = D0.px[i], b = N0.px[i]; if (!a || !b) continue; all++;
      const Ca = Math.hypot(a[1], a[2]), Cb = Math.hypot(b[1], b[2]); cd.push(Ca); cn.push(Cb); if (b[3]) blown++; if (Cb < 3) grey++;
      if (Ca > 6) { share.push(Cb / Ca); let h = Math.atan2(b[2], b[1]) - Math.atan2(a[2], a[1]); while (h > Math.PI) h -= 2 * Math.PI; while (h < -Math.PI) h += 2 * Math.PI; dh.push(Math.abs(h) * 180 / Math.PI); } }
    const med = a => { a = a.slice().sort((p, q) => p - q); return a.length ? a[Math.floor(a.length / 2)] : 0; };
    const cr = (p, q) => (Math.max(p, q) + .05) / (Math.min(p, q) + .05);
    res.kinds[kind] = { board: D0.board, chromaDay: +med(cd).toFixed(2), chromaNight: +med(cn).toFixed(2), chromaKept: +med(share).toFixed(3),
      hueTurn: +med(dh).toFixed(1), blownWhite: +(blown / all).toFixed(4), wentGrey: +(grey / all).toFixed(3), dayGrey: +(cd.filter(c => c < 3).length / all).toFixed(3),
      darkDay: +D0.dark.toFixed(4), darkNight: +N0.dark.toFixed(4), darkKept: +(N0.dark / D0.dark).toFixed(3), litVsDark: +cr(N0.lit, N0.dark).toFixed(2), nLit: N0.nLit, pools: N0.pools,
      errs: [got.dayErr, got.nightErr].filter(Boolean) };
    console.log(kind, JSON.stringify(res.kinds[kind]));
  }
  fs.writeFileSync(path.join(OUT, 'night_' + PROFILE + '.json'), JSON.stringify(res, null, 1));
  /* side by side: each kind by day and by night */
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'computer', arm: 'window.FIGHT_OPTS={seed:1,speed:1}' });
  try {
    const imgs = shots.map(s => ({ t: s.kind + (s.night ? ' NIGHT' : ' day'), src: 'data:image/png;base64,' + fs.readFileSync(s.fn).toString('base64') }));
    const b64 = await d.page.evaluate(async (a) => {
      const ims = await Promise.all(a.imgs.map(o => new Promise(r => { const i = new Image(); i.onload = () => r({ i, t: o.t }); i.src = o.src; })));
      const sc = 420 / ims[0].i.width, w = 420, h = Math.round(ims[0].i.height * sc), c = document.createElement('canvas'); c.width = 2 * (w + 6); c.height = (ims.length / 2) * (h + 36) + 10;
      const x = c.getContext('2d'); x.fillStyle = '#111'; x.fillRect(0, 0, c.width, c.height);
      ims.forEach((o, k) => { const X = (k % 2) * (w + 6), Y = Math.floor(k / 2) * (h + 36); x.drawImage(o.i, X, Y + 30, w, h); x.fillStyle = '#ddd'; x.font = 'bold 22px monospace'; x.fillText(o.t, X + 6, Y + 24); });
      return c.toDataURL('image/jpeg', 0.84).split(',')[1];
    }, { imgs });
    fs.writeFileSync(path.join(OUT, 'side_by_side_' + PROFILE + '.jpg'), Buffer.from(b64, 'base64'));
  } finally { await d.close(); }
})().catch(e => { console.error(e); process.exit(1); });
