#!/usr/bin/env node
/* COOK [every enemy reads at night] (10/25/26), line 3 of records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md (EYES 10/25, q43: 'the one
   Kid stood on a dark tile at night and was never drawn'; EYES' round two: 'the Kid's look in light: not met'). THE ROW: every
   enemy kind reads on every board at night.
   THE MEASURE: the fight page itself (slices/BOHEMIA_FIGHT.html through the one driver), each board kind dealt by day and by
   night on one seed. On each board, every look an enemy can wear (the three enemies' 17 looks: the Mechanic, the Kids and
   Runners, the Heavy; the 13 gangs' looks; the 3 beasts; the 51 rolled people; the tiers) is put through the page's OWN night
   for a man (nightSheet's pass, the lift the page picks for that tile: sheetOf -> moonOf) and read standing, facing the camera:
   its figure's middle light against the ground's middle light under every unlit tile a man can stand on (UI.groundLum, the
   page's own read of its night board), WCAG's contrast, light on dark or dark on light. By day the same look against the day
   board's ground. A kind READS when, on the board's worst tenth of its dark tiles, it stands off its ground at night as well
   as by day within a tenth, and never under 1.5 to 1.
     node tools/bohemia_cook_every_enemy_reads_at_night_10_25_26.js <out dir> [kind,kind...] [seed] [profile]
   -> <out>/reads_<profile>.json, <out>/sheet_<profile>.jpg (every enemy kind on every board by night, beside the day)
   REFERENCE CHECK: Battle Brothers at night darkens the ground and keeps every figure readable by its outline and its own light;
   the world: a figure under moonlight reads as a silhouette on a pale road and as a lit shape on dark ground (the same rule the
   page's own comment names). */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'records/target/cook_enemy_night/look'));
const KINDS = (process.argv[3] || 'strip,freeway,suburb,scrub,ruin,works').split(',');
const SEED = +(process.argv[4] || 31);
const PROFILE = process.argv[5] || 'phone_portrait';

/* in the page: every enemy-wearable look, standing, through the page's own pass for the tile, against every dark tile */
const READ = async function (night) {
  const lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
  const cr = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  const med = a => { a = a.slice().sort((p, q) => p - q); return a.length ? a[Math.floor(a.length / 2)] : 0; };
  const pct = (a, p) => { a = a.slice().sort((x, y) => x - y); return a.length ? a[Math.min(a.length - 1, Math.floor(a.length * p))] : 0; };
  const S = FIGHT.S, T = FIGHT._t, L = DB.rig.looks;
  /* the ground: by night the page's own read (UI.groundLum, the night board's light under each tile); by day the same read off the day board */
  let G = FIGHT_UI.groundLum;
  if (!G) { G = (typeof groundLums === 'function') ? groundLums(FIGHT_UI.board) : null; }
  const tiles = [];
  for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) { if (!T.passable(x, y)) continue; if (night && T.litAt(x, y)) continue; tiles.push({ x, y, g: G[y * S.w + x] }); }
  const want = Object.keys(L).filter(k => /^(enemy|beast|faction|person|tier)$/.test(L[k].kind));
  const out = {};
  const loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
  const figure = (c, lk) => {   /* the stand pose facing the camera: the median light of its opaque pixels */
    const col = (lk.clips || DB.rig.clips).stand[0], g = c.getContext('2d'), d = g.getImageData(col * lk.w, 0, lk.w, lk.h).data, v = [];
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200) v.push(.2126 * lin(d[i]) + .7152 * lin(d[i + 1]) + .0722 * lin(d[i + 2]));
    return { med: med(v), n: v.length };
  };
  const cache = {};
  for (const k of want) {
    const lk = L[k], img = await loadImg('fight_rig/' + lk.file); if (!img) { out[k] = { err: 'no sheet' }; continue; }
    const NEW = typeof MAN_MOONLIT !== 'undefined', lifts = night ? (NEW ? [MAN_MOONLIT, MAN_MOONLIT2, MOON_SHADE, MAN_MOON] : [MAN_MOON, MOON_SHADE]) : [null], fig = {};
    for (const lift of lifts) {
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
      if (lift !== null) nightPass(g, c.width, c.height, img, lift);
      fig[lift === null ? 'day' : lift] = figure(c, lk);
    }
    /* the page's own pick: the old rule by the tile's light alone; COOK's by the man and his tile (the larger stand-off) */
    const cs = tiles.map(t => { if (!night) return cr(fig.day.med, t.g); if (!NEW) return cr(fig[t.g > MOON_SILHOUETTE ? MOON_SHADE : MAN_MOON].med, t.g);
      const base = t.g > MOON_SILHOUETTE ? MOON_SHADE : MAN_MOON, order = [base, base === MOON_SHADE ? MAN_MOON : MOON_SHADE, MAN_MOONLIT, MAN_MOONLIT2];   /* the page's own order (moonFor) */
      const cs_ = order.map(l => cr(fig[l].med, t.g)), i = cs_.findIndex(c => c >= MOON_ENOUGH); return i >= 0 ? cs_[i] : Math.max(...cs_); });
    const old = night ? tiles.map(t => cr(fig[t.g > MOON_SILHOUETTE ? MOON_SHADE : MAN_MOON].med, t.g)) : cs;   /* the pick before: the tile's light alone */
    out[k] = { kind: lk.kind, type: lk.type || null, med: +med(cs).toFixed(3), worst10: +pct(cs, 0.1).toFixed(3), worst: +pct(cs, 0).toFixed(3), oldWorst10: +pct(old, 0.1).toFixed(3),
      fig: Object.fromEntries(Object.entries(fig).map(([a, b]) => [a, +b.med.toFixed(4)])) };
  }
  return { tiles: tiles.length, groundMed: +med(tiles.map(t => t.g)).toFixed(4), looks: out, board: S.board };
};

async function measure(kinds, seed, profile) {
  const res = { profile, seed, kinds: {} };
  for (const kind of kinds) {
    const got = {};
    for (const night of [false, true]) {
      const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS={seed:' + seed + ',speed:1,kind:"' + kind + '",night:' + night + '}' });
      try {
        await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 40000 });
        await d.page.waitForTimeout(2500);
        got[night ? 'night' : 'day'] = await d.page.evaluate(READ, night); got.err = got.err || d.errs[0];
      } finally { await d.close(); }
    }
    const D0 = got.day, N0 = got.night, rows = {};
    for (const k of Object.keys(N0.looks)) {
      const a = D0.looks[k], b = N0.looks[k]; if (!a || !b || a.err || b.err) continue;
      rows[k] = { kind: b.kind, type: b.type, day: a.worst10, night: b.worst10, kept: +(b.worst10 / a.worst10).toFixed(3), oldNight: b.oldWorst10, oldKept: +(b.oldWorst10 / a.worst10).toFixed(3), nightWorst: b.worst, nightMed: b.med, fig: b.fig };
    }
    res.kinds[kind] = { board: N0.board, tilesDark: N0.tiles, groundDay: D0.groundMed, groundNight: N0.groundMed, looks: rows, err: got.err || null };
  }
  return res;
}
module.exports = { READ, measure };

if (require.main === module) (async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const res = { profile: PROFILE, seed: SEED, kinds: {} };
  for (const kind of KINDS) {
    const got = {};
    for (const night of [false, true]) {
      const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: PROFILE, arm: 'window.FIGHT_OPTS={seed:' + SEED + ',speed:1,kind:"' + kind + '",night:' + night + '}' });
      try {
        await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 40000 });
        await d.page.waitForTimeout(2500);
        got[night ? 'night' : 'day'] = await d.page.evaluate(READ, night);
      } finally { await d.close(); }
    }
    const D0 = got.day, N0 = got.night, rows = {};
    for (const k of Object.keys(N0.looks)) {
      const a = D0.looks[k], b = N0.looks[k]; if (!a || !b || a.err || b.err) continue;
      rows[k] = { kind: b.kind, type: b.type, day: a.worst10, night: b.worst10, kept: +(b.worst10 / a.worst10).toFixed(3), oldNight: b.oldWorst10, oldKept: +(b.oldWorst10 / a.worst10).toFixed(3), nightWorst: b.worst, nightMed: b.med, fig: b.fig };
    }
    const w = Object.entries(rows).sort((p, q) => p[1].kept - q[1].kept);
    res.kinds[kind] = { board: N0.board, tilesDark: N0.tiles, groundDay: D0.groundMed, groundNight: N0.groundMed, looks: rows, weakest: w.slice(0, 6).map(([k, r]) => k + ' ' + r.night + '/' + r.day) };
    console.log(kind, 'ground', D0.groundMed, '->', N0.groundMed, '| weakest', res.kinds[kind].weakest.join(', '));
  }
  fs.writeFileSync(path.join(OUT, 'reads_' + PROFILE + '.json'), JSON.stringify(res, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
