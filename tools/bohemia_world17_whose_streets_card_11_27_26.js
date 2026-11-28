#!/usr/bin/env node
/* WORLD 17's VOTE card pictures (11/27/26, VAMILY rule 485(a)(b)): WHOSE STREETS, AND WHAT THE MONEY LOOKS LIKE.
   Boots the demo on his phone upright (390 x 844 at 3), valley VEGAS7, and shoots the map's own picture, the camera still, BEFORE (main's
   way: only a road's own wire has power, no gang's marks, every town as it always looked) and AFTER (engine/bohemia_district_look.js):
     1. a gang's streets by day and at night: the block the most of one saturated faction's marks sit round (its tags at the foot of
        the walls facing its lit street; at night the towers on lit streets light their floors);
     2. after ten map days of ECONOMY FOUR's book: a BROKE town and a WELL-OFF town by day and at night.
   Writes the shots to records/target/world17_whose_streets/ (PNG, the frame cut round the spot) and the card's sheet
   records/target/WORLD17_WHOSE_STREETS_11_27.webp (rows: before | after) plus its first picture (the gang's street by day, after).
   Run: node tools/bohemia_world17_whose_streets_card_11_27_26.js */
'use strict';
const path = require('path'), fs = require('fs'), { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'records', 'target', 'world17_whose_streets');
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const d = await open({ profile: 'phone_portrait', fog: false, arm: "try { localStorage.setItem('bohemia.world.next.v1', 'vegas7'); } catch (e) {}" });
  const fr = d.fr, pg = d.page, errs = [], rows = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  try {
    for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => typeof MODE !== 'undefined' && MODE === 'city' && !!window.VBC)) break; await pg.waitForTimeout(500); }
    try { await d.toMap(); } catch (e) { console.log('toMap', e.message); }
    await pg.waitForTimeout(1500);
    /* the camera on block (x, y) at zoom z; mode 'before' | 'after'; returns where the block sits on the frame */
    const aim = (x, y, z, min, mode, off, pan) => fr.evaluate(async (a) => {
      try { loopClose(); } catch (e) {} try { travelStop(); } catch (e) {}
      if (!window.__W17) window.__W17 = { g: vbDistrictGrids, w: vbTownWealth };
      vbDistrictGrids = a.mode === 'before' ? () => null : window.__W17.g; if (a.mode === 'before') VB_DL = null;
      vbTownWealth = a.mode === 'before' ? () => null : window.__W17.w;
      DAY.min = a.min; try { T.min = a.min; } catch (e) {}
      if (a.move) { city.x = a.x + (a.off | 0); city.y = a.y; setZoomAt(a.z, CVW / 2, CVH / 2); panX = 0; panY = 0; }
      VBC.checked = 0; try { VBT.tiles.clear(); } catch (e) {}
      const want = a.mode !== 'before';
      for (let i = 0; i < 80; i++) { MAP_GROUND.key = ''; vbCityReady(); render(); await new Promise(r => setTimeout(r, 200)); if (VBC.key && (VBC.key.indexOf(':d1:') >= 0) === want && !VBC.busy && i > 6) break; }
      for (let w = 0, last = '', still = 0; w < 120; w++) { await new Promise(r => setTimeout(r, 150)); render(); const now = MAP_DEPTH.ox + ',' + MAP_DEPTH.oy + ':' + (VBT.fly | 0) + ':' + VBT.queue.length;
        still = (now === last && !(VBT.fly | 0) && !VBT.queue.length) ? still + 1 : 0; if (still >= 4) break; last = now; }   /* every close tile landed, the camera still */
      for (let i = 0; i < 6; i++) { render(); await new Promise(r => setTimeout(r, 150)); }
      if (a.pan) for (let t = 0; t < 4; t++) { const q = iso(a.x + 0.5, a.y + 0.5, MAP_DEPTH.ox, MAP_DEPTH.oy); panX -= q.sx - CVW / 2; panY -= q.sy - CVH * 0.42; try { clampPan(); } catch (e) {} render(); await new Promise(r => setTimeout(r, 120)); }   /* the camera panned onto the spot, the crew off the frame */
      for (let i = 0; i < 6; i++) { render(); await new Promise(r => setTimeout(r, 150)); }
      const p = iso(a.x + 0.5, a.y + 0.5, MAP_DEPTH.ox, MAP_DEPTH.oy);
      return { sx: p.sx, sy: p.sy, CVW, CVH, TW: Math.round(TW), key: (VBC.key || '').slice(-24) };
    }, { x, y, z, min, mode, move: mode === 'before', off, pan: !!pan });
    const shot = async (name, at) => {
      const el = await pg.$('iframe'), bb = el ? await el.boundingBox() : null, b = bb || { x: 0, y: 0, width: 390, height: 844 };
      const k = b.width / at.CVW, w = 380, h = 330;
      const cx = Math.max(w / 2, Math.min(at.CVW - w / 2, at.sx)), cy = Math.max(h / 2 + 40, Math.min(at.CVH - h / 2 - 220, at.sy));
      const file = path.join(OUT, name + '.png');
      await pg.screenshot({ path: file, clip: { x: b.x + (cx - w / 2) * k, y: b.y + (cy - h / 2) * k, width: w * k, height: h * k } });
      return file;
    };
    const pair = async (label, x, y, z, min, off, pan) => {
      const a0 = await aim(x, y, z, min, 'before', off, pan); const f0 = await shot(label + '_before', a0);
      const a1 = await aim(x, y, z, min, 'after', off, pan); const f1 = await shot(label + '_after', a1);
      rows.push({ label, before: f0, after: f1, at: [x, y], drift: [Math.round(a1.sx - a0.sx), Math.round(a1.sy - a0.sy)], keys: [a0.key, a1.key] });
      console.log(label, JSON.stringify(rows[rows.length - 1].drift), a1.key);
    };
    /* 1. the gang's street: the built block with the most of one saturated faction's marks round it */
    const spot = await fr.evaluate(() => {
      const G = vbDistrictGrids(), P = G.pal, n = om.n, best = {};
      const built = (x, y) => { const c = vbClassOf((om.at(x, y) || {}).district); return c === VB_CLASS.houses || c === VB_CLASS.tower || c === VB_CLASS.casino || c === VB_CLASS.roof; };
      for (let y = 3; y < n - 3; y++) for (let x = 3; x < n - 3; x++) { const m = G.turf[y * n + x]; if (!m || !built(x, y) || P.drab[m]) continue; let c = 0;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (G.turf[(y + dy) * n + x + dx] === m && built(x + dx, y + dy)) c++;
        const f = P.names[m - 1]; if (!best[f] || c > best[f].c) best[f] = { x, y, c, lit: G.live[y * n + x] }; }
      return best;
    });
    console.log('spots', JSON.stringify(spot));
    const gang = Object.keys(spot).sort((a, b) => spot[b].c - spot[a].c)[0];
    await pair('streets_' + gang + '_day', spot[gang].x, spot[gang].y, 3, 12 * 60);
    await pair('streets_' + gang + '_night', spot[gang].x, spot[gang].y, 3, 23 * 60);
    /* 2. ten map days of the book, then a broke town and a well-off one */
    const v = await fr.evaluate(() => { const d0 = DAY.day; let k = 0; while (DAY.day < d0 + 10 && k++ < 3000) advance(60);
      const out = {}; for (const f in PLACE_BOOK.st) out[f] = PLACE_BOOK.st[f].verdict;
      return { day: DAY.day, v: out, towns: (vbTownsInput() || []).map(t => ({ name: t.name, x: t.bx, y: t.by, wl: t.wl, tier: t.tier })) }; });
    console.log('book', JSON.stringify(v.v));
    /* the nearest broke town and well-off town, framed together: a place going dark beside a place growing */
    let bp = null; for (const b0 of v.towns.filter(t => t.wl === 0)) for (const r0 of v.towns.filter(t => t.wl === 2)) { const dd = Math.max(Math.abs(b0.x - r0.x), Math.abs(b0.y - r0.y)); if (!bp || dd < bp.dd) bp = { b0, r0, dd }; }
    if (bp) { const mx = Math.round((bp.b0.x + bp.r0.x) / 2), my = Math.round((bp.b0.y + bp.r0.y) / 2), lab = 'towns_' + bp.b0.name + '_broke_' + bp.r0.name + '_well_off';
      await pair(lab + '_day', mx, my, 4, 12 * 60, 5);   /* the crew five blocks off, the two towns in the frame with him */
      await pair(lab + '_night', mx, my, 4, 23 * 60, 5); } else console.log('no broke town beside a well-off one');
    fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify({ rows, book: v.v, day: v.day, errors: errs }, null, 1));
  } finally { await d.close(); }
  /* the sheet: a row a pair, before | after, its label on top; the first picture is the gang's street by day, after */
  const py = `
import json, sys
from PIL import Image, ImageDraw, ImageFont
a = json.loads(sys.argv[1]); rows = a['rows']
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 30)
except Exception: F = ImageFont.load_default()
ims = [(r, Image.open(r['before']).convert('RGB'), Image.open(r['after']).convert('RGB')) for r in rows]
W = max(i[1].width for i in ims); H = max(i[1].height for i in ims); G = 16; T = 48
sheet = Image.new('RGB', (W * 2 + G, len(ims) * (H + T + G)), (14, 12, 10)); d = ImageDraw.Draw(sheet)
for k, (r, b, f) in enumerate(ims):
    y = k * (H + T + G)
    d.text((8, y + 8), 'BEFORE  ' + r['label'].upper().replace('_', ' '), fill=(216, 182, 87), font=F)
    d.text((W + G + 8, y + 8), 'AFTER', fill=(216, 182, 87), font=F)
    sheet.paste(b, (0, y + T)); sheet.paste(f, (W + G, y + T))
sheet.save(a['out'], 'WEBP', quality=78, method=6)
first = ims[0][2]; first.save(a['first'], 'WEBP', quality=90, method=6)
print(json.dumps({'sheet': [sheet.width, sheet.height], 'firstAt': [W + G, T, first.width, first.height]}))
`;
  const shots = JSON.parse(fs.readFileSync(path.join(OUT, 'shots.json'), 'utf8'));
  const r = spawnSync('python3', ['-c', py, JSON.stringify({ rows: shots.rows, out: path.join(ROOT, 'records', 'target', 'WORLD17_WHOSE_STREETS_11_27.webp'),
    first: path.join(ROOT, 'records', 'target', 'vote_first', 'world17-whose-streets-and-what-the-money-looks-like-11-27.webp') })], { encoding: 'utf8' });
  console.log(r.stdout.trim(), r.stderr.trim().slice(0, 400));
  /* the raw shots are in the sheet: they go (31 MB of PNG nobody loads); shots.json keeps what each row was */
  for (const row of shots.rows) for (const k of ['before', 'after']) { try { fs.unlinkSync(row[k]); } catch (e) {} row[k] = path.basename(row[k]); }
  for (const f of fs.readdirSync(OUT)) if (/\.png$/.test(f)) { try { fs.unlinkSync(path.join(OUT, f)); } catch (e) {} }
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(shots, null, 1));
  console.log('errors', JSON.stringify(shots.errors));
})();
