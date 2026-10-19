/* THE HIT CHANCE LOOK  (UI gate, 10/19/26, row [the hit chance look]; rule 120(b))
   PAOLO 10/18: 'the combat is still so fucking ass... the game doesn't explain to you at all that your weapon sucks.'
   The look COMBAT hands the numbers to (slices/bohemia_ui_materials.js, THE HIT READ). Holds:
     H1  the block is in the materials and exported (hitRead, hitReadPlace, hitChanceOnButton); its CSS has no gradient,
         blur, glow, round corner or phone font (rule 114 D10)
     H2  its ink and its red read 4.5 to 1 on its paper, plain and under a flat 25% white (the sun, rule 73)
     H3  on the real fight (his phone, upright): the numbers are the fight's own (the chance is hitChance(), the dent is
         resolveAttack() at the mean roll), the weak line only on the weak read
     H4  every word on every laid slip reads 4.5 to 1 against the paper really under it, plain and in the sun
     H5  the slip: whole css pixels, inside the glass, no radius, shadow, filter or gradient; the game's two faces only, at
         10, 20 or 30 px (the faces' ten dots on whole pixels)
     H6  A: the slip never covers the man it is about
     H7  B: the slip never covers a button in the bar
     H8  C: the chance on the STRIKE square at 20 px, the square 96 wide, the meters inside the bar's width
     H9  the meters are honest: the red cells are the dent rounded to tenths (one at least), none after the swing
     H10 on its side the slip stays on the glass and off the buttons
     H11 the card is in the registry with its picture and its twin's three differences
   and SIX PLANTED DEFECTS are caught every run (a round corner, a gradient, a pale red, the tag on the man, a weak line on
   a good read, an 13 px word), each undone before the next. */
const fs = require('fs'), path = require('path'); const ROOT = path.dirname(__dirname);
const { SETUP, LAY, words, ready } = require(path.join(ROOT, 'tools/bohemia_ui_the_hit_chance_look_shots.js'));
let pass = 0, fail = 0;
const ok = (name, cond, why) => { if (cond) { pass++; console.log('  PASS ' + name); } else { fail++; console.log('  FAIL ' + name + (why ? '  -- ' + why : '')); } };

const SRC = fs.readFileSync(path.join(ROOT, 'slices/bohemia_ui_materials.js'), 'utf8');
const LUM = (r, g, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const CR = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), SUN = q => q.map(v => v + (255 - v) * 0.25);
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));

/* everything a laid slip shows the gate, read in the page */
const MEASURE = () => {
  const el = document.querySelector('.bm-hit'); if (!el) return null;
  const R = e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, r: r.right, b: r.bottom }; };
  const s = getComputedStyle(el), mode = el.getAttribute('data-hit-read'), t = FIGHT.byId(window.__hrT), mb = manBox(t.x, t.y);
  const cv = Array.from(el.querySelectorAll('.bm-hit-m canvas')).filter((c, i) => i % 2 === 1);   /* mark, meter, mark, meter */
  const reds = cv.map(c => { const g = c.getContext('2d'), k = c.width / parseFloat(c.style.width), n = 0; let red = 0;
    for (let i = 0; i < 10; i++) { const d = g.getImageData(Math.round((i * 8 + 3.5) * k), Math.round(6 * k), 1, 1).data; if (d[0] === 150 && d[1] === 34 && d[2] === 22) red++; } return red; });
  const texts = Array.from(el.querySelectorAll('*')).concat([el]).filter(e => Array.from(e.childNodes).some(n => n.nodeType === 3 && n.textContent.trim()))
    .map(e => ({ t: e.textContent.trim().slice(0, 20), px: parseFloat(getComputedStyle(e).fontSize), font: getComputedStyle(e).fontFamily.split(',')[0].replace(/['"]/g, '') }));
  const bs = document.getElementById('bstrike'), bb = bs.querySelector('b');
  return { mode, box: R(el), W: innerWidth, H: innerHeight, top: R(document.getElementById('top')).b, bar: R(document.getElementById('bot')), stats: R(document.getElementById('stats')),
    man: { x: mb.x, head: mb.head, feet: mb.feet, half: Math.max(8, manH() * 0.22) },
    css: { radius: s.borderTopLeftRadius, shadow: s.boxShadow, filter: s.filter, bgi: s.backgroundImage.slice(0, 30) },
    styleText: Array.from(document.querySelectorAll('style')).filter(x => /bm-hit/.test(x.textContent)).map(x => x.textContent).join(''),
    texts, reds, line: !!el.querySelector('.bm-hit-w'), ch: (el.querySelector('.bm-hit-ch') || {}).firstChild ? el.querySelector('.bm-hit-ch').firstChild.textContent : null,
    buttons: Array.from(document.querySelectorAll('#bot button')).filter(x => x.offsetParent && getComputedStyle(x).visibility !== 'hidden').map(x => ({ id: x.id || x.dataset.skill, r: R(x) })),
    strike: { w: R(bs).w, sq: bs.classList.contains('bm-hit-sq'), t: bb ? bb.textContent : '', px: bb ? parseFloat(getComputedStyle(bb).fontSize) : 0, font: bb ? getComputedStyle(bb).fontFamily.split(',')[0].replace(/['"]/g, '') : '' } };
};
const over = (a, b) => a.x < b.r - 0.5 && b.x < a.r - 0.5 && a.y < b.b - 0.5 && b.y < a.b - 0.5;
const expectCells = (now, max, take) => { let have = max > 0 ? Math.round(10 * Math.max(0, now) / max) : 0; if (now > 0 && !have) have = 1;
  return Math.min(have, max > 0 && take > 0 ? Math.max(1, Math.round(10 * Math.min(now, take) / max)) : 0); };

/* the checks every laid slip answers to; returns the list of what is wrong */
function wrong(m, ws, read, after) {
  const out = [];
  if (!m) return ['no slip'];
  const b = m.box;
  if ([b.x, b.y, b.w, b.h].some(v => Math.abs(v - Math.round(v)) > 0.01)) out.push('off whole pixels ' + [b.x, b.y, b.w, b.h].join(','));
  if (b.x < 0 || b.r > m.W || b.y < m.top || b.b > m.H) out.push('off the glass');
  if (m.css.radius !== '0px') out.push('radius ' + m.css.radius);
  if (m.css.shadow !== 'none') out.push('shadow ' + m.css.shadow);
  if (m.css.filter !== 'none') out.push('filter ' + m.css.filter);
  if (!/^url\(/.test(m.css.bgi) || /gradient/.test(m.styleText)) out.push('not flat paper');
  const bad = m.texts.filter(t => !/^Bohemia(Casing|ROM)$/.test(t.font) || [10, 20, 30].indexOf(t.px) < 0);
  if (bad.length) out.push('type ' + bad.map(t => t.t + ' ' + t.font + ' ' + t.px).join('; '));
  const dim = (ws || []).filter(w => w.plain < 4.5 || w.sun < 4.5);
  if (dim.length) out.push('dim ' + dim.map(w => w.k + ' ' + w.plain + '/' + w.sun).join('; '));
  if (m.mode === 'tag') { const hit = { x: m.man.x - m.man.half, r: m.man.x + m.man.half, y: m.man.head, b: m.man.feet }; if (over(b, hit)) out.push('the slip covers the man'); }
  if (m.mode !== 'tag') { const hid = m.buttons.filter(x => over(b, x.r)); if (hid.length) out.push('covers ' + hid.map(x => x.id).join(',')); }
  if (m.mode === 'bar') { if (!m.strike.sq || m.strike.w !== 96 || m.strike.px !== 20 || m.strike.font !== 'BohemiaCasing') out.push('the square ' + JSON.stringify(m.strike)); if (b.x < m.stats.x - 0.5 || b.r > m.stats.r + 0.5) out.push('wider than the readout'); }
  if (read) {
    const want = after ? [0, 0] : [expectCells(read.armour.now, read.armour.max, read.armour.take), expectCells(read.body.now, read.body.max, read.body.take)];
    if (m.reds.join() !== want.join()) out.push('cells ' + m.reds.join() + ' want ' + want.join());
    if (m.line !== (!!read.weak && !after)) out.push('weak line ' + m.line + ' on a ' + (read.weak ? 'weak' : 'good') + ' read');
    if (m.mode !== 'bar' && m.ch !== (after ? 'HIT' : read.chance + '%')) out.push('chance ' + m.ch);
  }
  return out;
}

(async () => {
  console.log('THE HIT CHANCE LOOK');
  /* H1, H2: the source */
  const blk = (SRC.split('THE HIT READ  (UI [the hit chance look]')[1] || '').split('the moment the door is parsed')[0];
  ok('H1 the hit read is in the materials and exported', /function hitRead\(/.test(blk) && /function hitReadPlace\(/.test(blk) && /function hitChanceOnButton\(/.test(blk)
    && /hitRead: hitRead, hitReadPlace: hitReadPlace, hitChanceOnButton: hitChanceOnButton/.test(SRC));
  const css = (blk.match(/var HIT_CSS = [\s\S]*?;\n/) || [''])[0];
  ok('H1 its CSS has no gradient, blur, glow, round corner or phone font', css.length > 200 && !/gradient|blur\(|drop-shadow|text-shadow:[^n]|box-shadow:[^n]|border-radius:[1-9]|system-ui|Inter|Arial|Helvetica|Roboto/.test(css), css.slice(0, 120));
  const H = (blk.match(/var HIT = \{[\s\S]*?\};/) || [''])[0], paper = (H.match(/paper: \[(\d+), (\d+), (\d+)\]/) || []).slice(1).map(Number);
  const ink = hex((H.match(/ink: '(#[0-9a-f]{6})'/) || [])[1] || '#ffffff'), red = hex((H.match(/red: '(#[0-9a-f]{6})'/) || [])[1] || '#ffffff');
  const two = [['ink', ink], ['red', red]].map(([k, c]) => ({ k, plain: CR(LUM(...c), LUM(...paper)), sun: CR(LUM(...SUN(c)), LUM(...SUN(paper))) }));
  ok('H2 the ink and the red read on the paper, plain and in the sun', paper.length === 3 && two.every(x => x.plain >= 4.5 && x.sun >= 4.5), two.map(x => x.k + ' ' + x.plain.toFixed(2) + '/' + x.sun.toFixed(2)).join(', '));

  /* H3 to H9: the real fight, upright */
  let d = await ready('phone_portrait'), p = d.page;
  const weak = await p.evaluate(SETUP, 'weak'); await p.evaluate(t => { window.__hrT = t; }, weak.t); await p.waitForTimeout(900);
  const own = await p.evaluate(() => { const u = FIGHT.current(), t = FIGHT.byId(window.__hrT), w = u.weapon, sk = FIGHT.strikeSkill(w);
    const r = FIGHT.resolveAttack(u, t, sk, { roll: 0, head: false, base: (w.damage_min + w.damage_max) / 2 }); return { chance: FIGHT.hitChance(u, t, sk).chance, armour: r.armour, hp: r.hp }; });
  ok('H3 the numbers are the fight\'s own (chance, dent at the mean roll)', weak.can && own.chance === weak.read.chance && own.armour === weak.read.armour.take && own.hp === weak.read.body.take, JSON.stringify(own) + ' vs ' + JSON.stringify(weak.read));
  ok('H3 his pistol on the raider\'s plate is read weak, with its line', weak.read.weak && /barely dents his plate/.test(weak.read.line), weak.read.line);
  const lay = async (mode, read, after) => { await p.evaluate(LAY, { mode, read, after }); await p.waitForTimeout(350); const m = await p.evaluate(MEASURE); const ws = await words(p); return { m, ws, w: wrong(m, ws, read, after) }; };
  const L = {};
  for (const [mode, after] of [['tag', false], ['tag', true], ['slip', false], ['slip', true], ['bar', false], ['bar', true]]) {
    const r = await lay(mode, weak.read, after); L[mode + (after ? '_after' : '')] = r;
    ok('H4-H9 ' + ({ tag: 'A on the man', slip: 'B out of the bar', bar: 'C in the bar' })[mode] + (after ? ', after the swing' : '') + ': ' + r.ws.length + ' words read, honest cells, in place',
      !r.w.length && r.ws.length >= (after ? 3 : 4), r.w.join(' | '));
  }
  ok('H4 the worst word on any slip, plain and in the sun', Object.values(L).every(r => r.ws.every(w => w.plain >= 4.5 && w.sun >= 4.5)),
    Object.values(L).map(r => Math.min(...r.ws.map(w => w.sun)).toFixed(2)).join(','));
  ok('H8 C puts the chance on the STRIKE square', L.bar.m.strike.t === weak.read.chance + '%' && L.bar_after.m.strike.t === 'HIT', L.bar.m.strike.t + ' / ' + L.bar_after.m.strike.t);
  const good = await p.evaluate(SETUP, 'good'); await p.evaluate(t => { window.__hrT = t; }, good.t); await p.waitForTimeout(900);
  const g = await lay('slip', good.read, false);
  ok('H3 a rifle on a thug in a jacket is not weak and prints no line', good.can && !good.read.weak && !g.m.line && !g.w.length, g.w.join(' | '));

  /* THE PLANTS: each must be caught, each undone */
  const plant = async (label, fn, mode, read, re, laid, arg) => {
    await p.evaluate(LAY, { mode, read: laid || read, after: false });
    await p.evaluate(fn, arg === undefined ? null : arg); await p.waitForTimeout(300);
    const m = await p.evaluate(MEASURE), ws = await words(p), w = wrong(m, ws, read, false);
    await p.evaluate(() => { const s = document.getElementById('hr-plant'); if (s) s.remove(); });
    ok('PLANTED: ' + label + ' is caught', w.some(x => re.test(x)), w.join(' | ') || 'nothing caught');
  };
  await p.evaluate(SETUP, 'weak'); await p.evaluate(t => { window.__hrT = t; }, weak.t); await p.waitForTimeout(600);
  const CSS = c => { const s = document.createElement('style'); s.id = 'hr-plant'; s.textContent = c; document.head.appendChild(s); };
  await plant('a round corner', CSS, 'slip', weak.read, /radius/, null, '.bm-hit{border-radius:6px!important}');
  await plant('a gradient', CSS, 'slip', weak.read, /flat paper/, null, '.bm-hit{background-image:linear-gradient(#eee,#ccc)!important}');
  await plant('a pale red', CSS, 'slip', weak.read, /dim/, null, '.bm-hit .bm-hit-n,.bm-hit .bm-hit-w{color:#c0604c!important}');
  await plant('the tag on the man', () => { const el = document.querySelector('.bm-hit'), t = FIGHT.byId(window.__hrT), b = manBox(t.x, t.y); el.style.top = Math.round(b.head + 6) + 'px'; el.style.left = Math.round(b.x - 40) + 'px'; }, 'tag', weak.read, /covers the man/);
  await p.evaluate(SETUP, 'good'); await p.evaluate(t => { window.__hrT = t; }, good.t); await p.waitForTimeout(600);
  await plant('a weak line on a good read', () => {}, 'slip', good.read, /weak line/, Object.assign({}, good.read, { weak: true, line: 'Your rifle barely dents his jacket.' }));
  await p.evaluate(SETUP, 'weak'); await p.evaluate(t => { window.__hrT = t; }, weak.t); await p.waitForTimeout(600);
  await plant('a 13 px word', CSS, 'slip', weak.read, /type/, null, '.bm-hit .bm-hit-w{font-size:13px!important}');
  await p.evaluate(LAY, { mode: null });
  await d.close();

  /* H10: on its side */
  d = await ready('phone_landscape'); p = d.page;
  const ws2 = await p.evaluate(SETUP, 'weak'); await p.evaluate(t => { window.__hrT = t; }, ws2.t); await p.waitForTimeout(900);
  for (const mode of ['tag', 'slip', 'bar']) {
    await p.evaluate(LAY, { mode, read: ws2.read, after: false }); await p.waitForTimeout(350);
    const m = await p.evaluate(MEASURE), w = wrong(m, await words(p), ws2.read, false);
    ok('H10 on its side, ' + mode + ': on the glass, off the buttons, every word reads', !w.length, w.join(' | '));
  }
  await d.close();

  /* H11: the card */
  const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
  const card = (reg.items || reg).filter(i => i.id === 'ui-the-hit-chance-look-10-19')[0];
  ok('H11 the card is in the registry with its picture', !!card && card.show && fs.existsSync(path.join(ROOT, 'slices', card.show.src)), card ? card.show.src : 'no card');
  ok('H11 the twin names three differences and the options are A, B, C or NO', !!card && card.twin && card.twin.diffs.length === 3 && fs.existsSync(path.join(ROOT, card.twin.src)) && card.options.join() === 'A,B,C,NO');
  console.log('THE HIT CHANCE LOOK: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
