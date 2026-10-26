/* CHARACTER [the armour he wears shows] (rule 272): the VOTE cards, drawn by the game's own player (engine/bohemia_wear.js) on the
   game's own pictures of him (slices/fight_rig, his portrait), so the card is what the screens draw.
     node tools/bohemia_character_the_armour_shows_cards.js
   writes records/target/character/the_armour_shows/CHARACTER_THE_ARMOUR_SHOWS.png (every class: him bare, then wearing it in
   the eight facings at 2:1, then his portrait bare and wearing it) and its _FIRST.png (the police riot helmet and the police vest). */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records/target/character/the_armour_shows');
const PAGE = `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#2a2520">
<canvas id="c"></canvas><script src="../engine/bohemia_wear.js"></script><script>
function img(u){ return new Promise(function(res){ var i = new Image(); i.onload = function(){ res(i); }; i.onerror = function(){ res(null); }; i.src = u; }); }
async function card(rows){
  await new Promise(function(r){ BohemiaWear.load(r); }); BohemiaWear.BUDGET = 100000;
  var M = BohemiaWear.meta(); await new Promise(function(r){ var t = setInterval(function(){ if (BohemiaWear.sheet(M.sheet) && BohemiaWear.sheet(M.face_sheet)) { clearInterval(t); r(); } }, 50); });
  var j = await (await fetch('fight_rig/fight_rig.json')).json(), L = j.looks.you, sh = await img('fight_rig/' + L.file), face = await img('../records/target/portrait/crew/you/rest_128.png');
  var Z = 2, CW = 64, CH = 116, LW = 360, PW = 132, RH = CH * Z + 10, W = LW + CW * Z * 9 + PW * 2 + 30;
  var c = document.getElementById('c'); c.width = W; c.height = 46 + rows.length * RH; var x = c.getContext('2d');
  x.fillStyle = '#2a2520'; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingEnabled = false;
  x.fillStyle = '#d8ccb0'; x.font = 'bold 15px ui-monospace,monospace';
  x.fillText('BEFORE', LW, 26); x.fillText('AFTER: WEARING IT, ALL EIGHT TURNS (2:1)', LW + CW * Z + 10, 26); x.fillText('HIS FACE: BEFORE, AFTER', LW + CW * Z * 9 + 20, 26);
  var cell = document.createElement('canvas'); cell.width = L.w; cell.height = L.h; var g = cell.getContext('2d');
  rows.forEach(function(r, i){
    var y0 = 46 + i * RH;
    x.fillStyle = '#d8ccb0'; x.font = 'bold 13px ui-monospace,monospace'; x.fillText(r.title, 10, y0 + 30);
    x.fillStyle = '#a89a7c'; x.font = '11px ui-monospace,monospace'; (r.lines || []).forEach(function(t, k){ x.fillText(t, 10, y0 + 52 + k * 17); });
    for (var f = -1; f < 8; f++) {
      var ff = f < 0 ? 0 : f; g.clearRect(0, 0, L.w, L.h);
      g.drawImage(sh, 0, ff * L.h, L.w, L.h, 0, 0, L.w, L.h);
      if (f >= 0) BohemiaWear.on(g, { img: sh, x: 0, y: ff * L.h, w: L.w, h: L.h, dx: 0, dy: 0 }, 0, 0, 1, ff, r.wear, { where: 'card' });
      var bx = LW + (f + 1) * CW * Z + (f >= 0 ? 10 : 0);
      x.fillStyle = f < 0 ? '#3a332b' : '#4a4236'; x.fillRect(bx, y0, CW * Z - 4, CH * Z);
      x.drawImage(cell, L.foot[0] - CW / 2, 0, CW, CH, bx, y0, CW * Z, CH * Z);
    }
    var px = LW + CW * Z * 9 + 20;
    [false, true].forEach(function(on, k){
      var t = document.createElement('canvas'); t.width = t.height = 128; var q = t.getContext('2d'); q.drawImage(face, 0, 0, 128, 128);
      if (on) BohemiaWear.face(q, face, 128, null, { head: r.wear.head });
      x.fillStyle = '#4a4236'; x.fillRect(px + k * PW, y0, 128, 128); x.drawImage(t, px + k * PW, y0);
    });
  });
  return c.toDataURL('image/png');
}
</script></body></html>`;
(async () => {
  const looks = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/armour_looks.json')));
  const first = (slot, cls, feat) => Object.keys(looks[slot]).find(id => looks[slot][id]['class'] === cls && (feat ? (looks[slot][id].feats || []).includes(feat) : !(looks[slot][id].feats || []).length));
  const count = (slot, cls) => Object.values(looks[slot]).filter(e => e['class'] === cls).length;
  const bodies = Object.keys(looks.body_classes);
  const rows = Object.keys(looks.head_classes).map((h, i) => {
    const b = bodies[i % bodies.length], hid = first('head', h), bid = first('body', b);
    return { title: h.replace(/_/g, ' ').toUpperCase() + ' + ' + b.replace(/_/g, ' ').toUpperCase(),
      lines: ['HEAD: ' + looks.head[hid].name + ' (' + count('head', h) + ' rows)', 'BODY: ' + looks.body[bid].name + ' (' + count('body', b) + ' rows)'], wear: { head: hid, body: bid } };
  });
  [['riot_helmet', 'spike'], ['moto_helmet', 'horns'], ['riot_helmet', 'chain'], ['moto_helmet', 'chain_closed']].forEach(([h, f]) => {
    const hid = first('head', h, f); if (!hid) return;
    rows.push({ title: (h + ' + ' + f).replace(/_/g, ' ').toUpperCase(), lines: ['HEAD: ' + looks.head[hid].name], wear: { head: hid, body: null } });
  });
  /* the police riot helmet and the police vest first: his words */
  rows.sort((a, b) => (b.wear.head === first('head', 'riot_helmet') ? 1 : 0) - (a.wear.head === first('head', 'riot_helmet') ? 1 : 0));
  rows[0] = { title: 'POLICE RIOT HELMET + POLICE VEST', lines: ['HEAD: ' + looks.head.nasal_helmet.name, 'BODY: ' + looks.body.basic_mail_shirt.name, 'his words: "like a police helmet"'],
    wear: { head: 'nasal_helmet', body: 'basic_mail_shirt' } };
  const tmp = path.join(os.tmpdir(), 'bohemia_wear_cards_' + process.pid + '.html'); fs.writeFileSync(tmp, PAGE);
  const d = await D.open({ file: 'WEAR_CARDS.html', serve: { '/slices/WEAR_CARDS.html': tmp }, profile: 'computer', bare: true });
  try {
    await d.page.waitForFunction(() => window.BohemiaWear, null, { timeout: 20000 });
    const url = await d.page.evaluate(r => card(r), rows);
    fs.mkdirSync(OUT, { recursive: true });
    const png = path.join(OUT, 'CHARACTER_THE_ARMOUR_SHOWS.png');
    fs.writeFileSync(png, Buffer.from(url.split(',')[1], 'base64'));
    const firstUrl = await d.page.evaluate(() => { const c = document.getElementById('c'), t = document.createElement('canvas'); t.width = c.width; t.height = 46 + 242; t.getContext('2d').drawImage(c, 0, 0); return t.toDataURL('image/png'); });
    fs.writeFileSync(path.join(OUT, 'CHARACTER_THE_ARMOUR_SHOWS_FIRST.png'), Buffer.from(firstUrl.split(',')[1], 'base64'));
    console.log('cards', rows.length, 'rows ->', path.relative(ROOT, png), d.errs.length ? 'ERRORS ' + d.errs.join(' | ') : '');
  } finally { await d.close(); fs.unlinkSync(tmp); }
})().catch(e => { console.error(e); process.exit(1); });
