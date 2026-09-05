/* THE ART FAMILY SHEET (8/30/26, ART lane — his word: "ART DIRECTION FAMILY").
 *
 * One picture holding EVERY migrated tile family exactly as the walked page
 * decodes it — not the bank files, the live SA_IMG/PROP_IMG the game draws
 * from (VERIFY ON THE REAL SURFACE). Grouped by what a family IS (flat
 * ground / banded ground / structure / overlays / the solar rack / rolling
 * stock), each labeled, every tile at 2x because judging art below the size
 * it ships at is judging a thumbnail (8/28).
 *
 * WHY: art direction is a FAMILY question — 47 pools cooked over three weeks
 * by many passes can drift apart, and the only way to see drift is to put
 * every member in one frame. This is the frame. It lands in the LOOK tab
 * through the same manifest every other picture uses.
 *
 *   node tools/bohemia_family_sheet.js
 *     -> slices/look/the-art-family.png + manifest entry + LOOK page rebuild
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'))}catch(e){}}return require('playwright')}

const GROUPS = [
  ['FLAT GROUND', ['tf_wf','tf_bed','tf_qf','tf_pz','tf_tp','tf_ls','tf_tr','tf_rip','tf_bp','tf_fp','tf_fw','tf_fb','tf_di']],
  ['BANDED GROUND (axis pieces)', ['tf_iv','tf_ivh','tf_ivv','tf_bk','tf_bew','tf_bns','tf_brh','tf_brv']],
  ['STRUCTURE', ['tf_dh','tf_gr','tf_cu','tf_pt','tf_ibh','tf_ibv','tf_pp','tf_pps']],
  ['THE SOLAR RACK (four rows + caps)', ['tf_s0','tf_s1','tf_s2','tf_s3','tf_sew','tf_see']],
  ['OVERLAYS (drawn over a base)', ['tf_gw0','tf_gw1','tf_gw2','tf_gw3','tf_gw4','tf_gw5','tf_gw6','tf_gw7','tf_ppn','tf_pps_','tf_ppe','tf_ppw']],
];

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  p.on('pageerror', e => console.log('PAGEERROR:', String(e).slice(0, 200)));
  await p.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'));
  await p.waitForTimeout(9000);
  const dataUrl = await p.evaluate((GROUPS) => {
    const S = 44, Z = 2, PAD = 8, LABEL = 16, GHEAD = 22;
    // measure
    let w = 0, h = PAD;
    for (const [, fams] of GROUPS) {
      h += GHEAD;
      let rowW = PAD;
      let rowH = 0;
      for (const f of fams) {
        const arr = TF_POOL_B64[f]; if (!arr) continue;
        const cw = Math.max(arr.length * (S * Z + 2), 68) + 10;
        rowW += cw; rowH = Math.max(rowH, S * Z + LABEL + 8);
        if (rowW > 1100) { w = Math.max(w, rowW); h += rowH; rowW = PAD + cw; }
      }
      w = Math.max(w, rowW); h += rowH + 6;
    }
    h += GHEAD + S * Z + LABEL + 20;         // the prop row
    w = Math.max(w, 900); h += PAD;
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const x = cv.getContext('2d'); x.imageSmoothingEnabled = false;
    x.fillStyle = '#161310'; x.fillRect(0, 0, w, h);
    x.textBaseline = 'top';
    let cy = PAD;
    const drawFam = (label, imgs, cx) => {
      x.fillStyle = '#8d8069'; x.font = '10px monospace';
      x.fillText(label, cx, cy + S * Z + 2);
      for (let i = 0; i < imgs.length; i++) {
        const im = imgs[i];
        if (im && im.complete && im.naturalWidth) x.drawImage(im, cx + i * (S * Z + 2), cy, S * Z, S * Z);
        else { x.strokeStyle = '#a33'; x.strokeRect(cx + i * (S * Z + 2), cy, S * Z, S * Z); }
      }
      return Math.max(imgs.length * (S * Z + 2), 68) + 10;
    };
    const decoded = {};
    for (const k in TF_POOL_B64) decoded[k] = SA_IMG[k] || null;
    for (const [gname, fams] of GROUPS) {
      x.fillStyle = '#c8a848'; x.font = 'bold 12px monospace';
      x.fillText(gname, PAD, cy); cy += GHEAD;
      let cx = PAD;
      for (const f of fams) {
        const arr = decoded[f]; if (!arr) continue;
        const cw = Math.max(arr.length * (S * Z + 2), 68) + 10;
        if (cx + cw > w - PAD) { cx = PAD; cy += S * Z + LABEL + 8; }
        drawFam(f.replace('tf_', ''), arr, cx); cx += cw;
      }
      cy += S * Z + LABEL + 14;
    }
    x.fillStyle = '#c8a848'; x.font = 'bold 12px monospace';
    x.fillText('ROLLING STOCK (posts)', PAD, cy); cy += GHEAD;
    let cx2 = PAD;
    for (const fam in PROP_IMG) {
      if (fam !== 'boxcar' && fam !== 'loco') continue;
      cx2 += drawFam(fam, PROP_IMG[fam], cx2);
    }
    return cv.toDataURL('image/png');
  }, GROUPS);
  const png = Buffer.from(dataUrl.split(',')[1], 'base64');
  const out = path.join(ROOT, 'slices/look/the-art-family.png');
  fs.writeFileSync(out, png);
  console.log('WROTE', out, (png.length / 1024).toFixed(1) + ' KB');

  // the manifest entry, same grammar as every other picture
  const MF = path.join(ROOT, 'records/BOHEMIA_LOOK_MANIFEST.json');
  const mf = JSON.parse(fs.readFileSync(MF, 'utf8'));
  const entry = {
    id: 'the-art-family',
    title: 'EVERY TILE FAMILY IN ONE FRAME',
    caption: 'This is the whole migrated tile wardrobe, exactly as the game decodes it: the flat grounds, the banded grounds that follow their own axis, the structures, the solar rack rows, the overlays, and the trains. One frame so drift between families has nowhere to hide. Every one of these is already under your feet. RUN tab, walk anywhere.',
    file: 'look/the-art-family.png',
    at: null,
    kb: Math.round(png.length / 102.4) / 10,
    stamp: '8/30/26',
    surface: 'slices/BOHEMIA_CITY_TILEFORMS.js',
    shooter: 'node tools/bohemia_family_sheet.js',
  };
  const i = mf.shots.findIndex(s => s.id === entry.id);
  if (i >= 0) mf.shots[i] = entry; else mf.shots.push(entry);
  fs.writeFileSync(MF, JSON.stringify(mf, null, 1));
  console.log('MANIFEST', i >= 0 ? 'updated' : 'added', entry.id);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
