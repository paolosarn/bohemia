/* THE UI BELONGS TO THE WORLD  (UI [the UI the Crashbox way], 10/23/26; rule 130(b), Paolo 10/23: 'the UI kind of still
   sucks, it doesn't look as elevated as the Crashbox style that we're going for'; 121(g): his biggest concern; the 9/20
   rule: ALL THE UI LOOKS 3-D, built with light and form, delivered as pixels)

   Every panel, button, bar and slot the player touches wears a piece of THE KIT: a material modelled in Blender at its
   real thickness and rendered under the world's one sun (tools/bohemia_ui_crashbox_kit.py), cut into nine pictures
   (slices/ui_kit/<piece>/) and laid by the materials (slices/bohemia_ui_materials.js, kit() and KIT_RULES). This holds:
     THE KIT ON DISK
     - the pieces the materials lay are the pieces the cut wrote (slices/ui_kit/kit.json), number for number
     - every piece has its nine pictures at exactly the cut's sizes (its insets and its period, times the texels a point)
     - the middle and the four edges REPEAT WITHOUT A SEAM: the step across the wrap is no bigger than the steps inside
       (a mask that does not repeat would draw a line every period across a bar)
     - every piece was rendered the rig's way: Cycles, the guide's samples, the guide's sky fill, one sun inside the
       guide's calibrated screen angle (155.4, up and to the left)
     ON THE REAL SURFACE, his phone upright, through the one driver
     - the fight's bar is board, END TURN / WAIT / AUTO and the round are tin, the skills sit in pockets, the hint is paper
     - the settlement's header and sheet are board, CREW and LEAVE tin, the slots pockets
     - the crew screen's bar and his page are board, DONE tin, the line's places trays, the stats paper
     - the settings are a sheet of board, its buttons tin, its bars olive
     - the map's bar is board, its tags tin, what you carry in a tray, the speed pad olive
     - NOTHING CHANGES A BOX'S SIZE: every dressed thing is the same size and place with the kit on and off
     - every picture the kit names loads
     - every word on a kit piece reads 4.5 to 1, plain and in the sun (rule 73)
     - THE FRONT SCREEN HE LOVED IS LEFT ALONE (rule 127(b), 130(b)): the start screen is pixel for pixel the same with the
       kit on and off
     - four planted defects are caught by the same checks: a number off by one, a middle that seams, a dressed thing that
       grows, the front screen worn
   node gates/the_ui_belongs_to_the_world_gate.js */
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nTHE UI BELONGS TO THE WORLD: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* ---------------------------------------------------------------------------------------------- THE KIT ON DISK */
const MAT = fs.readFileSync(path.join(ROOT, 'slices/bohemia_ui_materials.js'), 'utf8');
function laid(src) {   /* the KIT table the materials lay, read from the source */
  const out = {}, re = /(\w+): \{ ins: \[(\d+), (\d+), (\d+), (\d+)\], P: (\d+), r: ([\d.]+) \}/g;
  const block = src.slice(src.indexOf('var KIT = {'), src.indexOf('var KIT_BASE'));
  let m; while ((m = re.exec(block))) out[m[1]] = { ins: [+m[2], +m[3], +m[4], +m[5]], P: +m[6], r: +m[7] };
  return out;
}
const PY = String.raw`
import json, sys, os
import numpy as np
from PIL import Image
root, kitp, plant = sys.argv[1], sys.argv[2], sys.argv[3]
kit = json.load(open(kitp)); guide = json.load(open(os.path.join(root, 'records/target/BOHEMIA_STYLE_GUIDE.json')))['rig']
out = {}
def arr(p): return np.asarray(Image.open(p).convert('RGBA')).astype(float)
def step(a, axis):
    """along one axis: the step across the wrap, the median step between neighbours inside, and the median step between
    lines half the picture apart; all on the picture softened by a 3x3 box, so the grain does not hide the structure.
    A picture that repeats steps across its wrap like a neighbour; one that does not steps like two lines far apart."""
    if axis == 1: a = a.transpose(1, 0, 2)
    a = a[..., :3]; p = np.pad(a, ((1, 1), (1, 1), (0, 0)), mode='wrap')
    a = sum(p[1 + dy:p.shape[0] - 1 + dy, 1 + dx:p.shape[1] - 1 + dx] for dy in (-1, 0, 1) for dx in (-1, 0, 1)) / 9.0
    n = a.shape[0]
    inner = np.abs(np.diff(a, axis=0)).mean(axis=(1, 2))
    far = np.abs(a - np.roll(a, n // 2, axis=0)).mean(axis=(1, 2))
    wrap = float(np.abs(a[0] - a[-1]).mean())
    return wrap, float(np.median(inner)), float(np.median(far))
for name, k in kit.items():
    if 'single' in k:
        out[name] = dict(single=os.path.exists(os.path.join(root, 'slices/ui_kit', name, k['single']))); continue
    t, r, b, l = k['ins']; P = k['P']; up = k['up']
    want = dict(tl=(l, t), t=(P, t), tr=(r, t), l=(l, P), c=(P, P), r=(r, P), bl=(l, b), b=(P, b), br=(r, b))
    sizes, seams = {}, {}
    for part, (w, h) in want.items():
        p = os.path.join(root, 'slices/ui_kit', name, part + '.png')
        if not os.path.exists(p): sizes[part] = 'missing'; continue
        im = Image.open(p); sizes[part] = 'ok' if im.size == (w * up, h * up) else '%dx%d not %dx%d' % (im.size + (w * up, h * up))
    try:
        c = arr(os.path.join(root, 'slices/ui_kit', name, 'c.png'))
        if plant == 'seam' and name == 'tin':   # a light that falls off across the piece: the classic picture that does not tile
            c[..., :3] = np.clip(c[..., :3] * np.linspace(0.85, 1.15, c.shape[1])[None, :, None], 0, 255)
        seams['c_x'] = step(c, 1); seams['c_y'] = step(c, 0)
        seams['t_x'] = step(arr(os.path.join(root, 'slices/ui_kit', name, 't.png')), 1)
        seams['b_x'] = step(arr(os.path.join(root, 'slices/ui_kit', name, 'b.png')), 1)
        seams['l_y'] = step(arr(os.path.join(root, 'slices/ui_kit', name, 'l.png')), 0)
        seams['r_y'] = step(arr(os.path.join(root, 'slices/ui_kit', name, 'r.png')), 0)
    except Exception as e:
        seams['error'] = str(e)
    rig = {}
    rp = os.path.join(root, 'records/target/ui_crashbox_kit', name, 'kit.json')
    if os.path.exists(rp):
        m = json.load(open(rp)); cal = guide['calibration']
        rig = dict(engine=m.get('engine') == 'CYCLES', samples=m.get('samples') == guide['samples'],
                   fill=m.get('fill', {}).get('rgb') == guide['fill_rgb'] and m.get('fill', {}).get('strength') == guide['fill_strength'],
                   sun=abs(m.get('sun', {}).get('screen_deg', 0) - cal['screen_light_deg']) <= cal['screen_light_tolerance_deg'])
    out[name] = dict(sizes=sizes, seams=seams, rig=rig)
print(json.dumps(out))
`;
function disk(plant) {
  return JSON.parse(execFileSync('python3', ['-c', PY, ROOT, path.join(ROOT, 'slices/ui_kit/kit.json'), plant || ''], { encoding: 'utf8' }));
}
/* a seam: the step across the wrap is nearer the step between far lines than the step between neighbours, and big
   enough to see (three values in 255: a strip as smooth as a tray's lip steps 0.5 inside and 2 across, which no eye finds) */
const seamed = s => s[0] > s[1] + 0.35 * Math.max(0.5, s[2] - s[1]) + 0.5 && s[0] - s[1] > 3;

function onDisk() {
  console.log('\nTHE KIT ON DISK');
  const kit = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/ui_kit/kit.json'), 'utf8')), L = laid(MAT);
  const nine = Object.keys(kit).filter(k => !kit[k].single);
  const same = (A, K) => Object.keys(A).length > 0 && Object.keys(A).every(n => K[n] && String(A[n].ins) === String(K[n].ins) && A[n].P === K[n].P && Math.abs(A[n].r - K[n].r) < 0.01)
    && nine.every(n => A[n]);
  ok('the pieces the materials lay are the pieces the cut wrote, number for number', same(L, kit), Object.keys(L).join(' '));
  const D = disk('');
  const sizes = nine.filter(n => Object.values(D[n].sizes).some(v => v !== 'ok'));
  ok('every piece has its nine pictures at the cut\'s sizes', nine.length >= 9 && sizes.length === 0, sizes.map(n => n + ' ' + JSON.stringify(D[n].sizes)).join('; ') || nine.length + ' pieces');
  const seams = [];
  nine.forEach(n => Object.entries(D[n].seams).forEach(([k, s]) => { if (k === 'error' || seamed(s)) seams.push(n + '.' + k + ' ' + JSON.stringify(s)); }));
  ok('the middle and the four edges repeat without a seam', seams.length === 0, seams.join('; ') || 'worst wrap within the inside\'s own steps');
  ok('the tape is one picture', !!(D.tape && D.tape.single));
  const rig = nine.filter(n => !D[n].rig || !['engine', 'samples', 'fill', 'sun'].every(k => D[n].rig[k]));
  ok('every piece was rendered the rig\'s way (Cycles, the guide\'s samples and sky fill, one sun at the calibrated angle)', rig.length === 0, rig.join(' ') || nine.length + ' pieces');
  /* planted: a number off by one, a middle that seams */
  const L2 = JSON.parse(JSON.stringify(L)); L2.tin.ins[0] += 1;
  ok('  PLANTED a number off by one is caught', !same(L2, kit));
  const D2 = disk('seam');
  ok('  PLANTED a middle that seams is caught', ['c_x'].some(k => seamed(D2.tin.seams[k])), JSON.stringify(D2.tin.seams.c_x));
}

/* ------------------------------------------------------------------------------------------- ON THE REAL SURFACE */
/* in the page: for each [selector, piece], whether it wears the piece, and its box with the kit on and off */
const WEAR = (list) => {
  const box = e => { const r = e.getBoundingClientRect(); return [Math.round(r.x * 10) / 10, Math.round(r.y * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10]; };
  const root = document.documentElement, out = [];
  const on = list.map(([s, p]) => { const e = document.querySelector(s); return e ? { s, p, worn: getComputedStyle(e).backgroundImage.indexOf('ui_kit/' + p + '/tl.png') >= 0, box: box(e) } : { s, p, missing: true }; });
  root.removeAttribute('data-kit');
  const off = list.map(([s]) => { const e = document.querySelector(s); return e ? box(e) : null; });
  root.setAttribute('data-kit', '1');
  on.forEach((o, i) => out.push(Object.assign(o, { off: off[i] })));
  return out;
};
const URLS = () => { const s = document.getElementById('bm-kit'); const u = s ? [...new Set((s.textContent.match(/url\(([^)]+)\)/g) || []).map(x => x.slice(4, -1)))] : [];
  return Promise.all(u.map(x => fetch(x).then(r => [x, r.status]).catch(() => [x, 0]))); };
/* a word's ground, read off the screenshot: just right of the word inside its own box, the 20th percentile for dark ink */
const READ = async ({ png, words }) => {
  const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
  const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
  const sc = im.width / innerWidth, LUM = (r, gg, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
  const CR = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), SUN = q => q.map(v => v + (255 - v) * 0.25);
  return words.map(w => { const [x, y, ww, hh] = w.box;
    const d = g.getImageData(Math.round((x + ww + 2) * sc), Math.round((y + 2) * sc), Math.max(1, Math.round(3 * sc)), Math.max(1, Math.round((hh - 4) * sc))).data, S = [];
    for (let i = 0; i < d.length; i += 4) S.push([d[i], d[i + 1], d[i + 2]]); S.sort((p, q) => LUM(...p) - LUM(...q));
    const t = w.col.match(/\d+/g).slice(0, 3).map(Number), tl = LUM(...t), bg = S[Math.floor(S.length * (tl > 0.3 ? 0.8 : 0.2))];
    return { k: w.k, plain: +CR(tl, LUM(...bg)).toFixed(2), sun: +CR(LUM(...SUN(t)), LUM(...SUN(bg))).toFixed(2) }; });
};
/* the words' own boxes (a text node's range) and their ink, inside the element, in page coordinates */
const WORDS = (list) => list.map(([k, s]) => { const e = document.querySelector(s); if (!e || e.disabled) return null;   /* a press the fight has not opened yet is greyed on purpose */
  const tw = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let n, best = null;
  while ((n = tw.nextNode())) if (n.textContent.trim().length > 1 && (!best || n.textContent.trim().length > best.textContent.trim().length)) best = n;
  if (!best) return null; const r = document.createRange(); r.selectNodeContents(best); const b = r.getBoundingClientRect(), eb = e.getBoundingClientRect();
  const fe = window.frameElement ? window.frameElement.getBoundingClientRect() : { x: 0, y: 0 };
  /* the ground beside the word must be inside the element: if the word runs to the edge, read left of it instead */
  const right = b.right + 5 < eb.right - 6;
  return { k, col: getComputedStyle(best.parentElement).color, box: [(right ? b.x : b.x - b.width - 8) + fe.x, b.y + fe.y, b.width, b.height] };
}).filter(Boolean);

async function check(label, frame, page, list, words) {
  const w = await frame.evaluate(WEAR, list);
  const miss = w.filter(o => o.missing), bare = w.filter(o => !o.missing && !o.worn), grew = w.filter(o => !o.missing && String(o.box) !== String(o.off));
  ok(label + ': every dressed thing is on the glass', miss.length === 0, miss.map(o => o.s).join(' ') || w.length + ' things');
  ok(label + ': every one wears its piece of the kit', bare.length === 0, bare.map(o => o.s + ' (' + o.p + ')').join(' ') || w.map(o => o.p).filter((x, i, a) => a.indexOf(x) === i).join(' '));
  ok(label + ': nothing changes a box\'s size or place', grew.length === 0, grew.map(o => o.s + ' ' + o.box + ' vs ' + o.off).join('; '));
  const urls = await frame.evaluate(URLS);
  const bad = urls.filter(u => u[1] !== 200);
  ok(label + ': every picture the kit names loads', urls.length >= 20 && bad.length === 0, bad.map(u => u[0] + ' ' + u[1]).join(' ') || urls.length + ' pictures');
  if (words && words.length) {
    const ws = await frame.evaluate(WORDS, words);
    const png = (await page.screenshot()).toString('base64');
    const cr = await page.evaluate(READ, { png, words: ws });
    ok(label + ': every word on a kit piece reads 4.5 to 1, plain and in the sun', cr.length >= Math.min(2, words.length) && cr.every(c => c.plain >= 4.5 && c.sun >= 4.5), cr.map(c => c.k + ' ' + c.plain + '/' + c.sun).join(', '));
  }
  return w;
}

async function fight() {
  console.log('\nTHE FIGHT');
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:5,speed:1,kind:"suburb"}' });
  const p = d.page;
  try {
    const t0 = Date.now(); while (Date.now() - t0 < 30000) { if (await p.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board)) break; await p.waitForTimeout(200); }
    await p.waitForTimeout(4000);
    await check('the fight', p, p, [['#bot', 'board'], ['#bend', 'tin'], ['#bwait', 'tin'], ['#bauto', 'tin'], ['#round', 'tin'], ['#bot .sq:not(.big)', 'well'], ['#order', 'tray'], ['#say', 'receipt']],
      [['END TURN on tin', '#bend'], ['WAIT on tin', '#bwait'], ['AUTO on tin', '#bauto']]);
    /* PLANTED: a dressed thing that grows */
    const grew = await p.evaluate(() => { const s = document.createElement('style'); s.textContent = 'html[data-kit] body #bend{padding:0 14px!important;width:90px!important}'; document.head.appendChild(s);
      const r = document.getElementById('bend').getBoundingClientRect(); document.documentElement.removeAttribute('data-kit'); const r2 = document.getElementById('bend').getBoundingClientRect();
      document.documentElement.setAttribute('data-kit', '1'); s.remove(); return [r.width, r2.width]; });
    ok('  PLANTED a dressed thing that grows is caught', grew[0] !== grew[1], grew.join(' vs '));
    ok('the fight: no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 1).join(''));
  } finally { await d.close(); }
}
async function settlement() {
  console.log('\nTHE SETTLEMENT');
  const d = await open({ file: 'BOHEMIA_SETTLEMENT_SCREEN.html', bare: true });
  try {
    await d.page.waitForTimeout(2500);
    const at = await d.page.evaluate(() => { const B = window.BohemiaSettlement, o = B.order(), k = o.indexOf('armourer') >= 0 ? 'armourer' : o.find(x => /stall|arms|smith/.test(x)); const w = k && B.where(k); return w && [w.x, w.y]; });
    if (!at) { ok('the settlement opened a shop', false); return; }
    await d.page.touchscreen.tap(at[0], at[1]); await d.page.waitForTimeout(1200);
    await check('the settlement', d.page, d.page, [['#bar', 'board_plain'], ['#crew', 'tin'], ['#leave', 'tin'], ['#sheet', 'board_plain'], ['#sheet .slot:not(.full)', 'well'], ['#sheet .slot.full', 'well_full']],
      [['CREW on tin', '#crew'], ['LEAVE on tin', '#leave']]);
  } finally { await d.close(); }
}
async function roster() {
  console.log('\nTHE CREW SCREEN');
  /* RE-AIMED UI 10/25 ([the company screen, Battle Brothers simple]): the stash shows only the pieces there are (the 26 empty
     slots left the screen, rule 172(c)), so the crew screen opens on a stash of two for its wells to be on the glass */
  const d = await open({ file: 'BOHEMIA_ROSTER_SCREEN.html', bare: true, arm: "try{localStorage.setItem('bohemia.bag.v1', JSON.stringify([{id:'gambeson',kind:'body',name:'a padded vest',was:'Gambeson',price:15,nums:'holds 65  weight 6'},{id:'knife',kind:'weapon',cls:'dagger',name:'pistol',was:'Knife',price:3,nums:'dmg 15-25'}]))}catch(e){}" });
  try {
    await d.page.waitForTimeout(3000);
    await check('the crew screen', d.page, d.page, [['#bar', 'board_plain'], ['#done', 'tin'], ['#card', 'board_plain'], ['.cell:not(.full)', 'tray'], ['.stats', 'receipt'], ['#bag .slot.full', 'well_full'], ['.gslot:not(.full)', 'well']],   /* RE-AIMED UI 10/25: the stash holds only full pieces; an empty well is his empty slot */
      [['DONE on tin', '#done']]);
  } finally { await d.close(); }
}
async function door() {
  console.log('\nTHE START SCREEN AND THE SETTINGS');
  const d = await open({ bare: true, file: 'BOHEMIA_DEMO.html' });
  const p = d.page;
  try {
    for (let i = 0; i < 60 && !(await p.evaluate(() => !!document.querySelector('.bm-start .b'))); i++) await p.waitForTimeout(500);
    await p.waitForTimeout(2500);
    /* the front screen he loved: the same pixels with the kit on and off (the stamp's clock and the lamps' flicker held still) */
    const still = async () => { await p.evaluate(() => { const s = document.createElement('style'); s.id = 'gate-still'; s.textContent = '*{animation:none!important;transition:none!important}'; document.head.appendChild(s); }); await p.waitForTimeout(300); };
    await still();
    const jtf = await p.evaluate(() => !!document.querySelector('.bm-start.jtf'));
    const a = await p.screenshot(); await p.evaluate(() => document.documentElement.removeAttribute('data-kit')); await p.waitForTimeout(300);
    const b = await p.screenshot(); await p.evaluate(() => document.documentElement.setAttribute('data-kit', '1')); await p.waitForTimeout(300);
    ok('the front screen he loved is left alone: the start screen is the same with the kit on and off', jtf && a.equals(b), jtf ? (a.equals(b) ? 'pixel for pixel' : 'differs') : 'not the just-the-font screen');
    /* PLANTED: the front screen worn */
    const worn = await p.evaluate(() => { const s = document.createElement('style'); s.id = 'gate-plant'; s.textContent = 'html[data-kit] body .bm-start.jtf .b.card{background-image:url(ui_kit/tin/c.png)!important}'; document.head.appendChild(s); return true; });
    await p.waitForTimeout(400); const c = await p.screenshot(); await p.evaluate(() => document.getElementById('gate-plant').remove());
    ok('  PLANTED the front screen worn is caught', worn && !c.equals(b));
    await p.evaluate(() => document.getElementById('gate-still').remove());
    const s = await p.evaluate(() => { const e = [...document.querySelectorAll('.bm-start .b')].find(x => /SETTINGS/.test(x.textContent)); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    if (!s) { ok('the settings open from the start screen', false); return; }
    await p.mouse.click(s[0], s[1]); await p.waitForTimeout(1200);
    await check('the settings', p, p, [['#setcard', 'board_plain'], ['#setcard .setbtn', 'tin'], ['#setcard .setbars .vb:not(.lit)', 'tin_dark'], ['#setcard .setbars .vb.lit', 'tin_amber'], ['#setcard .seth', 'receipt']],
      [['a settings button on tin', '#setcard .setbtn'], ['SETTINGS on paper', '#setcard .seth']]);
  } finally { await d.close(); }
}
async function map() {
  console.log('\nTHE MAP');
  let d; try { d = await open({ door: 120000 }); } catch (e) { ok('the demo opened onto the map', false, String(e.message).slice(0, 120)); return; }
  const p = d.page, fr = d.fr;
  try {
    for (let i = 0; i < 40 && !(await fr.evaluate(() => !!document.getElementById('bmtb'))); i++) await p.waitForTimeout(250);
    await p.waitForTimeout(1500);
    /* RE-AIMED 10/26 BY UI TWO (rules 238(a), 286(b)): with the phone up the bar's NOTES is the phone's NOTES (its copy off the glass),
       so the words read on the bar's tin are the day's; the phone's icons carry no words (238(c): a button reads by its shape) */
    const ON = await fr.evaluate(() => document.documentElement.classList.contains('boh-phone-on'));
    await check('the map', fr, p, [['#menubar.bmtb', 'board_plain'], ['#bmtb .t.day', 'tin'], ['#bmtb .t.gear', 'tin'], ['#menubar #bmtb #notebtn', 'tin'], ['#bmtb .g', 'tray'],
      ['#speedpad', 'board_plain'], ['#speedpad .sp:not(.now)', 'tin_dark'], ['#speedpad .sp.now', 'tin_amber']],
      ON ? [['the day on tin', '#bmtb .t.day']] : [['the day on tin', '#bmtb .t.day'], ['NOTES on tin', '#menubar #bmtb #notebtn']]);
  } finally { await d.close(); }
}

(async () => {
  console.log('\nTHE UI BELONGS TO THE WORLD  (UI [the UI the Crashbox way])');
  onDisk();
  for (const f of [fight, settlement, roster, door, map]) { try { await f(); } catch (e) { ok(f.name + ' ran', false, String(e && e.message).slice(0, 160)); } }
  done();
})();
