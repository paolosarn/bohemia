/* COOK [every armour its own] 11/3 (rule 337, ask line 345): the VOTE sheets, drawn by the game's own player (engine/bohemia_wear.js)
   on the game's own pictures of him (slices/fight_rig, his portrait), CHARACTER's card's way
   (tools/bohemia_character_the_armour_shows_cards.js), so the sheet is what the screens draw.
     node tools/bohemia_cook_every_armour_its_own_cards_11_3_26.js
   writes records/target/cook_every_armour/COOK_EVERY_ARMOUR_<SHEET>.png and _FIRST.png for each sheet in SHEETS: per row the piece's
   name, BEFORE (him wearing the placeholder the row drew as last round), AFTER (him wearing its own model, all eight turns, 2:1), the
   crew card's size (1:1, the fight's), and for a helmet his portrait before and after. */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records/target/cook_every_armour');
const SHEETS = JSON.parse(process.argv[2] || 'null') || {
  HELMETS_AND_PADS: [['head', 'goalie_mask'], ['head', 'football_helmet'], ['head', 'welding_mask'], ['head', 'riot_gas_helmet'], ['body', 'football_pads'], ['body', 'riot_gear_jacket']],
  BODY_ARMOUR: [['body', 'carpet_coat'], ['body', 'licence_plate_vest'], ['body', 'road_sign_cuirass'], ['body', 'football_pads'], ['body', 'riot_gear_jacket'], ['head', 'goalie_mask']],
};
const PAGE = `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#2a2520">
<canvas id="c"></canvas><script>window.BOHEMIA_WEAR_BASE = 'wear_old/';</script><script src="../engine/bohemia_wear.js"></script>
<script>window.OldWear = window.BohemiaWear; window.BOHEMIA_WEAR_BASE = 'wear/';</script><script src="../engine/bohemia_wear.js"></script><script>
function img(u){ return new Promise(function(res){ var i = new Image(); i.onload = function(){ res(i); }; i.onerror = function(){ res(null); }; i.src = u; }); }
async function card(rows){
  for (const W of [OldWear, BohemiaWear]) {   /* last round's sheets (out of git) for BEFORE, this round's for AFTER: the same player */
    await new Promise(function(r){ W.load(r); }); W.BUDGET = 100000;
    var M = W.meta(); await new Promise(function(r){ var t = setInterval(function(){ if (W.sheet(M.sheet) && W.sheet(M.face_sheet)) { clearInterval(t); r(); } }, 50); });
  }
  var j = await (await fetch('fight_rig/fight_rig.json')).json(), L = j.looks.you, sh = await img('fight_rig/' + L.file), face = await img('../records/target/portrait/crew/you/rest_128.png');
  var Z = 2, CW = 64, CH = 116, LW = 330, PW = 132, RH = CH * Z + 14, W = LW + CW * Z * 9 + CW + 30 + PW * 2 + 20;
  var c = document.getElementById('c'); c.width = W; c.height = 46 + rows.length * RH; var x = c.getContext('2d');
  x.fillStyle = '#2a2520'; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingEnabled = false;
  x.fillStyle = '#d8ccb0'; x.font = 'bold 15px ui-monospace,monospace';
  x.fillText('BEFORE', LW, 26); x.fillText('AFTER: ITS OWN MODEL ON HIM, ALL EIGHT TURNS (2:1)', LW + CW * Z + 10, 26);
  x.fillText('1:1', LW + CW * Z * 9 + 20, 26); x.fillText('HIS FACE: BEFORE, AFTER', LW + CW * Z * 9 + CW + 40, 26);
  var cell = document.createElement('canvas'); cell.width = L.w; cell.height = L.h; var g = cell.getContext('2d');
  rows.forEach(function(r, i){
    var y0 = 46 + i * RH;
    x.fillStyle = '#d8ccb0'; x.font = 'bold 13px ui-monospace,monospace'; x.fillText(r.title, 10, y0 + 30);
    x.fillStyle = '#a89a7c'; x.font = '11px ui-monospace,monospace'; (r.lines || []).forEach(function(t, k){ x.fillText(t, 10, y0 + 52 + k * 16); });
    var draw = function (ff, wear, bx, by, z, W) {
      g.clearRect(0, 0, L.w, L.h); g.drawImage(sh, 0, ff * L.h, L.w, L.h, 0, 0, L.w, L.h);
      if (wear) (W || BohemiaWear).on(g, { img: sh, x: 0, y: ff * L.h, w: L.w, h: L.h, dx: 0, dy: 0 }, 0, 0, 1, ff, wear, { where: 'card' });
      x.drawImage(cell, L.foot[0] - CW / 2, 0, CW, CH, bx, by, CW * z, CH * z);
    };
    for (var f = -1; f < 8; f++) {
      var bx = LW + (f + 1) * CW * Z + (f >= 0 ? 10 : 0);
      x.fillStyle = f < 0 ? '#3a332b' : '#4a4236'; x.fillRect(bx, y0, CW * Z - 4, CH * Z);
      draw(f < 0 ? 1 : f, r.after, bx, y0, Z, f < 0 ? OldWear : BohemiaWear);
    }
    var sx = LW + CW * Z * 9 + 20; x.fillStyle = '#4a4236'; x.fillRect(sx, y0, CW, CH); draw(1, r.after, sx, y0, 1);
    if (r.slot === 'head') {
      var px = sx + CW + 20;
      [OldWear, BohemiaWear].forEach(function(W, k){
        var t = document.createElement('canvas'); t.width = t.height = 128; var q = t.getContext('2d'); q.drawImage(face, 0, 0, 128, 128);
        W.face(q, face, 128, null, { head: r.after.head });
        x.fillStyle = '#4a4236'; x.fillRect(px + k * PW, y0, 128, 128); x.drawImage(t, px + k * PW, y0);
      });
    }
  });
  return c.toDataURL('image/png');
}
</script></body></html>`;
(async () => {
  const looks = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/armour_looks.json')));
  /* BEFORE: another row of the same class with no model of its own, so the player draws the placeholder this row drew last round */
  const placeholder = (slot, id) => Object.keys(looks[slot]).find(k => k !== id && looks[slot][k]['class'] === looks[slot][id]['class'] && !looks[slot][k].own && !(looks[slot][k].feats || []).length);
  const A = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/armory.json')));
  const line = (slot, id) => ((A[slot] || []).find(r => r.id === id) || {}).line || '';
  const tmp = path.join(os.tmpdir(), 'bohemia_own_armour_cards_' + process.pid + '.html'); fs.writeFileSync(tmp, PAGE);
  /* BEFORE: last round's sheets, out of git (the same player draws them, so BEFORE is exactly what the row drew) */
  const old = path.join(os.tmpdir(), 'bohemia_wear_old_' + process.pid); fs.mkdirSync(old, { recursive: true });
  const serve = { '/slices/OWN_ARMOUR_CARDS.html': tmp };
  for (const f of ['wear.json', 'wear.webp', 'wear_face.webp']) {
    fs.writeFileSync(path.join(old, f), require('child_process').execFileSync('git', ['show', (process.env.OLD_SHA || 'HEAD') + ':slices/wear/' + f], { cwd: ROOT, maxBuffer: 1 << 26 }));
    serve['/slices/wear_old/' + f] = path.join(old, f);
  }
  const d = await D.open({ file: 'OWN_ARMOUR_CARDS.html', serve, profile: 'computer', bare: true });
  try {
    await d.page.waitForFunction(() => window.BohemiaWear, null, { timeout: 20000 });
    fs.mkdirSync(OUT, { recursive: true });
    for (const [name, list] of Object.entries(SHEETS)) {
      const rows = list.map(([slot, id]) => {
        const e = looks[slot][id], ph = placeholder(slot, id), wrap = w => slot === 'head' ? { head: w, body: null } : { head: null, body: w };
        return { slot, title: e.name.toUpperCase(), lines: ['last round: ' + (e.own ? 'drawn as the ' + e['class'].replace(/_/g, ' ') : 'CHARACTER\'s ' + e['class'].replace(/_/g, ' ') + ' shape'), 'now: ' + (e.own ? 'its own model' : 'the ' + e['class'].replace(/_/g, ' ') + '\'s own model, every row of it'),
          ...(line(slot, id) ? ['"' + line(slot, id).slice(0, 44) + '"'] : [])], before: wrap(ph), after: wrap(id) };
      });
      const url = await d.page.evaluate(r => card(r), rows);
      const png = path.join(OUT, 'COOK_EVERY_ARMOUR_' + name + '.png');
      fs.writeFileSync(png, Buffer.from(url.split(',')[1], 'base64'));
      const firstUrl = await d.page.evaluate(() => { const c = document.getElementById('c'), t = document.createElement('canvas'); t.width = c.width; t.height = 46 + 246; t.getContext('2d').drawImage(c, 0, 0); return t.toDataURL('image/png'); });
      fs.writeFileSync(path.join(OUT, 'COOK_EVERY_ARMOUR_' + name + '_FIRST.png'), Buffer.from(firstUrl.split(',')[1], 'base64'));
      console.log('sheet', name, rows.length, 'rows ->', path.relative(ROOT, png));
    }
    console.log(d.errs.length ? 'ERRORS ' + d.errs.join(' | ') : 'no page errors');
  } finally { await d.close(); fs.unlinkSync(tmp); }
})().catch(e => { console.error(e); process.exit(1); });
