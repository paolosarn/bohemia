/* SETTINGS IN OUR MATERIALS, WITH BRIGHTNESS  (UI lane 11, [settings and the slider], 10/4/26)

   RULE 73 (Paolo 10/4): BRIGHTNESS with the calibration picture, raising the night floor; words 4.5 to 1,
   and again with a flat 25 percent white added (the sun test). RULE 66: SETTINGS is a door of the start
   screen RUN builds, wired to BohemiaSettings.open(). RULE 67/71: no flat rounded card, no centred words,
   no default fonts, no soft shadows. One settings card in the game, dressed, not a second one.

   WHAT THIS HOLDS, on the ALPHA at his phone's profile through the one driver:
     - before BEGIN, BohemiaSettings.open({atStart:true}) shows the card OVER the front door (a finger at
       its centre reaches it), with SAVE and QUIT hidden and the way out reading BACK; closing it leaves
       the door as it was
     - in the game, the gear opens the card with ALL, MUSIC, SOUNDS, MUTE, TEXT, BRIGHT rows
     - every control is a thumb (44 x 44 or more)
     - the card is drawn from the materials (cardboard, receipt, glass pictures), its words are the game's
       CASING face (loaded), labels and buttons read from the left, buttons cast no soft shadow
     - every label passes 4.5 to 1 on the card, and again in the sun
     - MUSIC and SOUNDS move the mix's own knobs (getMix) and light their steps
     - BRIGHT keeps its step, publishes BOH_BRIGHTNESS, TELLS THE CITY FRAME, and the calibration picture's
       man comes up out of the street with it; step 0 is the game as drawn (lift 0)
     - no page error

   node gates/settings_in_our_materials_gate.js */
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nSETTINGS IN OUR MATERIALS: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

async function beforeBegin(page) {
  await page.waitForTimeout(1500);
  const a = await page.evaluate(() => {
    if (!window.BohemiaSettings) return { missing: true };
    BohemiaSettings.open({ atStart: true });
    const card = document.getElementById('setcard'), r = card.getBoundingClientRect(), hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    const vis = id => { const e = document.getElementById(id); return !!(e && e.offsetParent !== null && getComputedStyle(e).display !== 'none'); };
    return { reach: !!(hit && card.contains(hit)), save: vis('setsave'), quit: vis('setquit'), back: document.getElementById('setclose').textContent };
  });
  ok('BEFORE BEGIN, BohemiaSettings.open() SHOWS THE CARD OVER THE FRONT DOOR (a finger reaches it)', a.reach, JSON.stringify(a));
  ok('  with SAVE and QUIT hidden and the way out reading BACK', !a.save && !a.quit && a.back === 'BACK', JSON.stringify(a));
  await page.evaluate(() => { document.getElementById('setclose').click(); document.body.classList.remove('setatstart');
    const cb = document.getElementById('setclose'); if (cb.__was) { cb.textContent = cb.__was; cb.__was = null; } });
  await page.waitForTimeout(300);
  ok('  and closing it leaves the door as it was', await page.evaluate(() => !document.getElementById('setwrap').classList.contains('on') && getComputedStyle(document.getElementById('front')).display !== 'none'));
}

(async () => {
  console.log('\nSETTINGS IN OUR MATERIALS  (UI [settings and the slider], rules 73, 66)\n');
  let d;
  try { d = await open({ file: 'BOHEMIA_ALPHA_0_9.html', door: 150000, beforeTap: beforeBegin }); }
  catch (e) { ok('the alpha opened', false, String(e.message).slice(0, 160)); return done(); }
  const p = d.page;
  if (!d.doorIsBehindUs()) { ok('REFUSING TO REPORT: the door never opened', false); await d.close(); return done(); }
  await p.waitForTimeout(2500);
  /* the city frame listens for the brightness, before anything is pressed */
  await d.fr.evaluate(() => { window.__gotB = null; window.addEventListener('message', e => { if (e.data && e.data.type === 'BOHEMIA_BRIGHTNESS') window.__gotB = e.data; }); });
  const g = await p.evaluate(() => { const b = document.getElementById('gearbtn').getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; });
  await p.touchscreen.tap(g[0], g[1]); await p.waitForTimeout(700);
  const a = await p.evaluate(() => {
    const card = document.getElementById('setcard');
    const labs = Array.from(card.querySelectorAll('.setrow .setlab')).map(l => l.textContent.trim());
    const ctrls = Array.from(card.querySelectorAll('.vb, .setbtn')).filter(e => e.offsetParent !== null).map(e => { const r = e.getBoundingClientRect(); return { t: (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 14), w: r.width, h: r.height }; });
    const btns = Array.from(card.querySelectorAll('.setbtn')).filter(e => e.offsetParent !== null && e.textContent.trim()).map(e => { const r = e.getBoundingClientRect(), rg = document.createRange(); rg.selectNodeContents(e); const tr = rg.getBoundingClientRect();
      return { t: e.textContent.trim(), tx: Math.round(tr.left - r.left), slack: Math.round(r.width - tr.width), sh: getComputedStyle(e).boxShadow, fam: getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '') }; });
    const cs = getComputedStyle(card);
    const casing = Array.from(document.fonts).some(f => f.family.replace(/["']/g, '') === 'BohemiaCasing' && f.status === 'loaded');
    const lab = card.querySelector('.setlab'), lr = lab.getBoundingClientRect();
    return { labs, ctrls, btns, bg: cs.backgroundImage, casing, labFam: getComputedStyle(lab).fontFamily.split(',')[0].replace(/["']/g, ''), labCol: getComputedStyle(lab).color,
      labBox: [lr.x, lr.y, lr.width, lr.height], open: document.getElementById('setwrap').classList.contains('on'), mix: window.getMix ? window.getMix() : null };
  });
  ok('IN THE GAME THE GEAR OPENS THE CARD WITH ALL, MUSIC, SOUNDS, MUTE, TEXT, BRIGHT', a.open && ['ALL', 'MUSIC', 'SOUNDS', 'MUTE', 'TEXT', 'BRIGHT'].every(k => a.labs.indexOf(k) >= 0), a.labs.join(' '));
  const small = a.ctrls.filter(c => c.w < 44 || c.h < 44);
  ok('EVERY CONTROL IS A THUMB (44 x 44 or more)', a.ctrls.length >= 20 && small.length === 0, a.ctrls.length + ' controls, small: ' + small.map(c => c.t + ' ' + Math.round(c.w) + 'x' + Math.round(c.h)).join(', '));
  ok('THE CARD IS DRAWN FROM THE MATERIALS (a cardboard picture, not a flat fill)', /url\("?data:image/.test(a.bg), a.bg.slice(0, 40));
  ok('  its words are the game\'s CASING face, loaded', a.casing && a.labFam === 'BohemiaCasing' && a.btns.every(b => b.fam === 'BohemiaCasing'), a.labFam + ' / ' + a.btns.map(b => b.fam).join(','));
  ok('  buttons read from the left (no centred words) and cast no soft shadow', a.btns.length >= 5 && a.btns.every(b => b.tx <= 14 && b.sh === 'none'),
     a.btns.map(b => b.t + ' +' + b.tx + ' ' + (b.sh === 'none' ? '' : b.sh)).join(', '));

  /* contrast of a label on the card, plain and in the sun, decoded in the page */
  const png = (await p.screenshot()).toString('base64');
  const cr = await p.evaluate(async ({ png, box, col }) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const sc = im.width / innerWidth, LUM = (r, gg, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
    const CR = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), SUN = q => q.map(v => v + (255 - v) * 0.25);
    /* the ground beside the label: a strip to its right, inside the row, before the controls start */
    const d = g.getImageData(Math.round((box[0]) * sc), Math.round((box[1] - 6) * sc), Math.round(box[2] * sc), Math.round(4 * sc)).data, S = [];
    for (let i = 0; i < d.length; i += 4 * 5) S.push([d[i], d[i + 1], d[i + 2]]);
    S.sort((x, y) => LUM(...x) - LUM(...y)); const bg = S[Math.floor(S.length * 0.8)];   /* the lighter end of the board: the worst case */
    const t = col.match(/\d+/g).slice(0, 3).map(Number);
    return { plain: +CR(LUM(...t), LUM(...bg)).toFixed(2), sun: +CR(LUM(...SUN(t)), LUM(...SUN(bg))).toFixed(2) };
  }, { png, box: a.labBox, col: a.labCol });
  ok('A LABEL ON THE CARDBOARD PASSES 4.5 TO 1, AND AGAIN IN THE SUN', cr.plain >= 4.5 && cr.sun >= 4.5, JSON.stringify(cr));

  /* MUSIC and SOUNDS: the mix's own knobs */
  const tapIn = async (id, k) => { const b = await p.evaluate(({ id, k }) => { const v = document.querySelectorAll('#' + id + ' .vb')[k].getBoundingClientRect(); return [v.x + v.width / 2, v.y + v.height / 2]; }, { id, k });
    await p.touchscreen.tap(b[0], b[1]); await p.waitForTimeout(300); };
  await tapIn('setmusic', 1); await tapIn('setsfx', 2);
  const m = await p.evaluate(() => ({ mix: getMix(), mlit: document.querySelectorAll('#setmusic .vb.lit').length, slit: document.querySelectorAll('#setsfx .vb.lit').length, saved: localStorage.getItem('bohemia_mix') }));
  ok('MUSIC AND SOUNDS MOVE THE MIX\'S OWN KNOBS and light their steps', m.mix.music === 0.25 && m.mix.sfx === 0.5 && m.mlit === 2 && m.slit === 3, JSON.stringify(m));

  /* BRIGHT */
  const before = await p.evaluate(() => { const d = document.querySelector('#setcalib canvas').getContext('2d').getImageData(48, 20, 1, 1).data; return { fig: d[0] + d[1] + d[2], pub: window.BOH_BRIGHTNESS }; });
  await tapIn('setbright', 3);
  const b = await p.evaluate(() => { const d = document.querySelector('#setcalib canvas').getContext('2d').getImageData(48, 20, 1, 1).data;
    return { kept: localStorage.getItem('boh.brightness'), pub: window.BOH_BRIGHTNESS, fig: d[0] + d[1] + d[2], lit: document.querySelectorAll('#setbright .vb.lit').length }; });
  const city = await d.fr.evaluate(() => window.__gotB);
  ok('STEP 0 IS THE GAME AS DRAWN (no lift)', before.pub && before.pub.step === 0 && before.pub.lift === 0, JSON.stringify(before.pub));
  ok('BRIGHT KEEPS ITS STEP AND PUBLISHES THE LIFT', b.kept === '3' && b.lit === 4 && b.pub && b.pub.step === 3 && b.pub.lift > 0, JSON.stringify(b));
  ok('  and THE CITY FRAME IS TOLD (the night pass can read it)', city && city.step === 3 && city.lift === b.pub.lift, JSON.stringify(city));
  ok('  and the calibration picture\'s man comes up out of the street', b.fig > before.fig + 30, before.fig + ' -> ' + b.fig);
  ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  await d.close();
  done();
})().catch(e => { console.error(e); process.exit(1); });
