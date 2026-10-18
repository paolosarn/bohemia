#!/usr/bin/env node
/* THE LINE ON A GROUND: THE CANDIDATES ON THE REAL SCREENS, AND THE SHEET  (UI lane 11, [the line on a ground], 10/18/26)

   The row (rule 88, the twin's difference 2): 'the company screen sits on flat near-black where the opening screen he
   called awesome sits on the painted night valley. Give the roster and the hall a ground from the approved packs, a
   camp at night behind the two lines, never a gradient; the words keep the sun test.'

   COOK ONLY (rule 100): nothing here is in slices/. The painter (tools/bohemia_ui_the_line_on_a_ground_cook.py) makes
   the ground; this lays it under RUN TWO's company screen and the settlement's hall IN THE BROWSER ONLY, through the
   one driver, at his phone's profile, and shoots every candidate at one css pixel a pixel (three on his phone):
     A  THEY STAND IN THE CAMP   the cells become a 1 px line on the ground, the faces stand on the camp with the rig's
                                 contact line under each; the camp: the lamp, the truck, the sandbags, the tyres
     B  THE CAMP BEHIND THEM     the same camp; a man keeps his cardboard backing, an empty place is a line on the ground
     C  THE GROUND ONLY          A's cells on the bare ground: no props, the lamp's pool alone, its source unseen
   and the hall: his cracked slabs at night under the hire cards, under the hall's roof (the moon's ramp only, read low).

     node tools/bohemia_ui_the_line_on_a_ground_sheet.js     # writes records/target/ui_line_on_a_ground/ (shots, sheet, measures)

   It also exports lay() and words() for the gate (gates/the_line_on_a_ground_gate.js), so the gate and the sheet put
   the same thing on the same screen and read it the same way.
   ========================================================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const OUT = process.env.BM_OUT || path.join(ROOT, 'records/target/ui_line_on_a_ground');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const url = f => 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, f)).toString('base64');
const TOP = 66;   /* the bar's foot on every screen class: the camp starts where the cardboard ends */

/* put a candidate under the company screen (runs in the page) */
function layRoster({ src, w, h, top, opt, line }) {
  const b = document.body;
  if (document.getElementById('bm-camp')) return;
  [...b.children].forEach(e => { const cs = getComputedStyle(e); if (cs.position === 'static') { e.style.position = 'relative'; e.style.zIndex = '1'; } });
  const d = document.createElement('div'); d.id = 'bm-camp';
  d.style.cssText = 'position:absolute;left:0;top:' + top + 'px;width:' + w + 'px;height:' + h + 'px;background:url(' + src + ') 0 0/' + w + 'px ' + h + 'px no-repeat;image-rendering:pixelated;z-index:0;pointer-events:none';
  b.insertBefore(d, b.firstChild);
  const st = document.createElement('style'); st.id = 'bm-camp-css';
  const empty = 'html[data-bm-roster] .cell{border-radius:0}html[data-bm-roster] .cell:not(.full){background:transparent;border:1px solid #3a3440;box-shadow:none}';   /* rule 114 D10: radius 0 */
  st.textContent = opt === 'B' ? empty
    : empty + 'html[data-bm-roster] .cell.full{background:transparent;border-color:transparent;box-shadow:none}'
      + '.bm-contact{position:absolute;left:6px;top:42px;width:36px;height:5px;background:url(' + line + ') 0 0/36px 5px;image-rendering:pixelated;pointer-events:none;z-index:-1}';
  document.head.appendChild(st);
  if (opt !== 'B') {
    const mark = () => document.querySelectorAll('.cell.full').forEach(c => {
      if (getComputedStyle(c).position === 'static') c.style.position = 'relative';
      if (!c.querySelector('.bm-contact')) { const k = document.createElement('i'); k.className = 'bm-contact'; c.insertBefore(k, c.firstChild); }
    });
    mark(); new MutationObserver(mark).observe(document.getElementById('lines'), { childList: true, subtree: true });
  }
}
/* the hall's floor under the hire cards (runs in the page) */
function layHall({ src, w, h }) {
  const sh = document.getElementById('sheet');
  if (!sh || document.getElementById('bm-floor')) return;
  if (getComputedStyle(sh).position === 'static') sh.style.position = 'relative';
  [...sh.children].forEach(e => { if (getComputedStyle(e).position === 'static') { e.style.position = 'relative'; e.style.zIndex = '1'; } });
  const d = document.createElement('div'); d.id = 'bm-floor';
  d.style.cssText = 'position:absolute;left:0;top:0;width:' + w + 'px;height:' + h + 'px;background:url(' + src + ') 0 0/' + w + 'px ' + h + 'px no-repeat;image-rendering:pixelated;z-index:0;pointer-events:none';
  sh.insertBefore(d, sh.firstChild);
}

/* every word that sits on the new ground, read against what is really under it: the word's own box shot with its ink
   made clear, the ground's 75th percentile (a dark ground under light ink), plain and in the sun (rule 73) */
async function words(page, sels) {
  const boxes = await page.evaluate((sels) => {
    const out = [];
    for (const [k, s, i] of sels) {
      const e = [...document.querySelectorAll(s)][i || 0]; if (!e) { out.push({ k, missing: true }); continue; }
      const rg = document.createRange(); rg.selectNodeContents(e); const r = rg.getBoundingClientRect();
      e.dataset.bmInk = getComputedStyle(e).color; out.push({ k, s, i: i || 0, box: [r.x, r.y, r.width, r.height], ink: getComputedStyle(e).color });
    }
    return out;
  }, sels);
  await page.evaluate((sels) => { for (const [k, s, i] of sels) { const e = [...document.querySelectorAll(s)][i || 0]; if (e) e.style.setProperty('color', 'transparent', 'important'); } }, sels);
  const png = (await page.screenshot()).toString('base64');
  await page.evaluate((sels) => { for (const [k, s, i] of sels) { const e = [...document.querySelectorAll(s)][i || 0]; if (e) e.style.removeProperty('color'); } }, sels);
  return page.evaluate(async ({ png, boxes }) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const sc = im.width / innerWidth;
    const LUM = (r, gg, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
    const CR = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), SUN = q => q.map(v => v + (255 - v) * 0.25);
    return boxes.map(j => {
      if (j.missing) return j;
      const b = j.box, x = Math.max(0, Math.round(b[0] * sc)), y = Math.max(0, Math.round(b[1] * sc));
      const w = Math.max(1, Math.min(im.width - x, Math.round(b[2] * sc))), h = Math.max(1, Math.min(im.height - y, Math.round(b[3] * sc)));
      if (y >= im.height) return Object.assign(j, { off: true });
      const d = g.getImageData(x, y, w, h).data, S = [];
      for (let i = 0; i < d.length; i += 4) S.push([d[i], d[i + 1], d[i + 2]]);
      S.sort((p, q) => LUM(...p) - LUM(...q));
      const t = j.ink.match(/\d+/g).slice(0, 3).map(Number), dark = LUM(...t) > 0.4;
      const bg = S[Math.floor(S.length * (dark ? 0.75 : 0.25))];
      return Object.assign(j, { bg, plain: +CR(LUM(...t), LUM(...bg)).toFixed(2), sun: +CR(LUM(...SUN(t)), LUM(...SUN(bg))).toFixed(2) });
    });
  }, { png, boxes });
}
const ROSTER_WORDS = [['the line', '.h', 0], ['FRONT', '.ln', 0], ['BACK', '.ln', 1], ['who is wearing what', '.h', 1], ['YOUR COMPANY', '#bar .t', 0]];
const HALL_WORDS = [['who speaks', '#sbody .say .nm', 0], ['the line said', '#sbody .say p', 0]];

async function roster(profile, opt) {
  const d = await open({ file: 'BOHEMIA_ROSTER_SCREEN.html', bare: true, profile });
  const p = d.page;
  const t0 = Date.now(); while (Date.now() - t0 < 20000) { if (await p.evaluate(() => document.querySelectorAll('.cell.full').length > 0 && !!document.querySelector('#card .stats'))) break; await p.waitForTimeout(250); }
  await p.waitForTimeout(1200);
  if (opt) {
    const view = profile === 'phone_portrait' ? 'upright' : 'sideways', w = view === 'upright' ? 390 : 844;
    await p.evaluate(layRoster, { src: url((opt === 'C' ? 'ground_' : 'camp_') + view + '.png'), w, h: 264, top: TOP, opt, line: url('contact_line.png') });
    await p.waitForTimeout(400);
  }
  return { d, p };
}
async function hallPage(opt) {
  const d = await open({ file: 'BOHEMIA_SETTLEMENT_SCREEN.html', bare: true });
  const q = d.page;
  const t0 = Date.now(); while (Date.now() - t0 < 20000) { if (await q.evaluate(() => window.BohemiaSettlement && BohemiaSettlement.where('hall'))) break; await q.waitForTimeout(200); }
  await q.waitForTimeout(1200);
  await q.evaluate(() => BohemiaSettlement.open({ place: { name: 'Church', tier: 'town', district: 'commercial' }, traits: [], batteries: 200, day: 3 })); await q.waitForTimeout(1200);
  const xy = await q.evaluate(() => BohemiaSettlement.where('hall')); await q.mouse.click(xy.x, xy.y); await q.waitForTimeout(1500);
  if (opt) { await q.evaluate(layHall, { src: url('hall_floor.png'), w: 390, h: 1200 }); await q.waitForTimeout(300); }
  return { d, q };
}

/* one css pixel a pixel, by nearest (each phone pixel block's middle), as the front screen's sheet does */
async function shot(page, file, crop) {
  const png = (await page.screenshot()).toString('base64');
  const u = await page.evaluate(async ({ png, crop }) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
    const w = innerWidth, h = Math.min(innerHeight, crop || innerHeight), k = im.width / innerWidth;
    const s = document.createElement('canvas'); s.width = im.width; s.height = im.height; const sg = s.getContext('2d'); sg.drawImage(im, 0, 0);
    const S = sg.getImageData(0, 0, im.width, im.height).data, c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'), D = g.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const sx = Math.min(im.width - 1, Math.floor((x + 0.5) * k)), sy = Math.min(im.height - 1, Math.floor((y + 0.5) * k)), i = (sy * im.width + sx) * 4, j = (y * w + x) * 4; D.data[j] = S[i]; D.data[j + 1] = S[i + 1]; D.data[j + 2] = S[i + 2]; D.data[j + 3] = 255; }
    g.putImageData(D, 0, 0); return c.toDataURL('image/png');
  }, { png, crop });
  fs.writeFileSync(file, Buffer.from(u.split(',')[1], 'base64'));
  return path.basename(file);
}

module.exports = { layRoster, layHall, words, roster, hallPage, ROSTER_WORDS, HALL_WORDS, TOP, url };

if (require.main === module) (async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const shots = {}, measures = {};
  for (const prof of ['phone_portrait', 'phone_landscape']) {
    for (const opt of ['', 'A', 'B', 'C']) {
      const { d, p } = await roster(prof, opt);
      const tag = (prof === 'phone_portrait' ? 'upright' : 'sideways') + '_' + (opt || 'before');
      shots[tag] = await shot(p, path.join(OUT, 'shot_' + tag + '.png'), prof === 'phone_portrait' ? 400 : 0);
      measures[tag] = await words(p, ROSTER_WORDS);
      await d.close();
    }
  }
  for (const opt of ['', 'A']) {
    const { d, q } = await hallPage(opt);
    const tag = 'hall_' + (opt ? 'after' : 'before');
    shots[tag] = await shot(q, path.join(OUT, 'shot_' + tag + '.png'));
    measures[tag] = await words(q, HALL_WORDS);
    await d.close();
  }
  /* the sheet, laid with the game's own faces */
  const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const face = fam => { const m = alpha.match(new RegExp("@font-face\\{ font-family:'" + fam + "'[\\s\\S]*?src:url\\((data:font/woff2;base64,[A-Za-z0-9+/=]+)\\)")); return m ? m[1] : ''; };
  const man = JSON.parse(fs.readFileSync(path.join(OUT, 'manifest.json'), 'utf8'));
  const twin = path.join(ROOT, 'records/target/ui_front_screen/before_upright_title.png');
  const cell = (src, lab, a) => '<div class="cell"><div class="lab' + (a ? ' a' : '') + '">' + lab + '</div><img src="' + src + '"></div>';
  const S = f => url(f);
  const worst = tag => { const m = measures[tag].filter(x => x.plain); return m.length ? Math.min(...m.map(x => x.sun)).toFixed(1) : '-'; };
  const html = '<!doctype html><meta charset="utf-8"><style>'
    + "@font-face{font-family:C;src:url(" + face('BohemiaCasing') + ")}@font-face{font-family:R;src:url(" + face('BohemiaROM') + ")}"
    + 'body{margin:0;background:#141210;color:#e7dcc6}#s{display:inline-block;padding:24px 24px 18px;background:#141210}'
    + 'h1{margin:0 0 4px;font:400 20px C;letter-spacing:4px;color:#e6c475}h2{margin:6px 0 10px;font:400 10px C;letter-spacing:3px;color:#b3a993}p{margin:0 0 18px;font:10px/16px R;color:#b3a993;max-width:1780px}'
    + '.row{display:flex;gap:24px;margin-bottom:22px;align-items:flex-start}.cell{display:flex;flex-direction:column;gap:8px}.lab{font:400 10px C;letter-spacing:3px;color:#b3a993}.lab.a{color:#e6c475}'
    + 'img{display:block;image-rendering:pixelated;outline:1px solid #3a3226}</style><div id="s">'
    + '<h1>THE LINE ON A GROUND</h1>'
    + '<p>Your company screen sat on flat near-black. These put it on a ground: his own dirt tiles from the packs, re-lit for night (never darkened: every pixel read through two hue-shifted ramps, the moon\'s and the lamp\'s, the light in five stepped rings), '
    + 'and the rig\'s own truck, lamp, sandbags and tyres standing on it at one pixel to one pixel. One light: the lamp (the block still has power). Shown from the game\'s camera on his phone at one css pixel a pixel (three on the phone). '
    + 'Pick A, B or C, or NO. Words on the ground, worst in the sun: A ' + worst('upright_A') + ', B ' + worst('upright_B') + ', C ' + worst('upright_C') + ' (4.5 to 1 is the bar).</p>'
    + '<h2>ON HIS PHONE UPRIGHT (THE TOP OF THE SCREEN)</h2><div class="row">'
    + cell(S(shots.upright_before), 'NOW') + cell(S(shots.upright_A), 'A . THEY STAND IN THE CAMP', 1) + cell(S(shots.upright_B), 'B . THE CAMP BEHIND THEM', 1) + cell(S(shots.upright_C), 'C . THE GROUND ONLY', 1)
    + '</div><h2>ON ITS SIDE</h2><div class="row">' + cell(S(shots.sideways_before), 'NOW') + cell(S(shots.sideways_A), 'A . THEY STAND IN THE CAMP', 1) + '</div>'
    + '<div class="row">' + cell(S(shots.sideways_B), 'B . THE CAMP BEHIND THEM', 1) + cell(S(shots.sideways_C), 'C . THE GROUND ONLY', 1) + '</div>'
    + '<h2>THE HALL (THE SAME FOR A, B AND C): HIS CRACKED SLABS AT NIGHT UNDER THE HIRE CARDS, UNDER A ROOF</h2><div class="row">'
    + cell(S(shots.hall_before), 'NOW') + cell(S(shots.hall_after), 'AFTER', 1)
    + (fs.existsSync(twin) ? cell('data:image/png;base64,' + fs.readFileSync(twin).toString('base64'), 'THE TWIN . THE OPENING SCREEN YOU CALLED AWESOME') : '')
    + '</div><h2>WHAT IT IS MADE OF, AT 1:1: HIS DIRT AND HIS SLABS AS THEY ARE, THEN AT NIGHT; THE RIG\'S PROPS AS RENDERED</h2><div class="row">'
    + cell(S('src_tiles.png'), 'HIS TILES AS THEY ARE') + cell(S('src_night.png'), 'THE SAME AT NIGHT: MOON . LAMP', 1) + cell(S('src_props.png'), 'THE RIG\'S PROPS AS RENDERED') + '</div>'
    + '<p>Pixel size 1 css px. Palette: the moon (' + man.moon_hues.join(', ') + ' degrees, dark to light) and the lamp (' + man.lamp_hues.join(', ') + '). Light: one, the lamp, from its head. '
    + 'The words, the faces, the cards, the buttons and every place a finger goes are RUN TWO\'s, unchanged. Nothing here is in the game until you pick.</p></div>';
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1900, height: 1000 }, deviceScaleFactor: 1 });
  await pg.setContent(html); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(300);
  const sheet = path.join(OUT, 'UI_THE_LINE_ON_A_GROUND.png');
  await (await pg.$('#s')).screenshot({ path: sheet });
  await b.close();
  fs.writeFileSync(path.join(OUT, 'measures.json'), JSON.stringify({ made: '10/18', lane: 'ui', row: '[the line on a ground]', shots, measures }, null, 1) + '\n');
  console.log('sheet: ' + path.relative(ROOT, sheet));
  for (const [k, v] of Object.entries(measures)) console.log('  ' + k + ': ' + v.map(x => x.k + ' ' + (x.plain ? x.plain + '/' + x.sun : (x.missing ? 'missing' : 'off'))).join(', '));
})().catch(e => { console.error(e); process.exit(1); });
