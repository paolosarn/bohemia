/* ONE SCREEN, the shots (UI [one screen], rule 110's swing, 10/17/26). Takes the map (the demo), the settlement screen and the
   rebuilt fight on his phone profile, upright and on its side, through the one driver. Phase NOW: the screen as it is, at 1:1, plus
   AN INVENTORY OF EVERY CODE-DRAWN BOX on it (a visible element that paints a flat colour, a border or a rounded corner with no
   material behind it). Phase CAND: the one HUD laid over the same screen IN THE BROWSER ONLY (nothing written to the game) from
   tools/bohemia_ui_one_screen_hud.js, then the same shot and the same inventory, plus the box of every button the gate reads.
   node tools/bohemia_ui_one_screen_shots.js <out dir> <map|settlement|fight> <phone_portrait|phone_landscape> <now|cand> */
const fs = require('fs'), path = require('path'); const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const [out, screen, profile, phase] = process.argv.slice(2);
const HUD = fs.readFileSync(path.join(ROOT, 'tools/bohemia_ui_one_screen_hud.js'), 'utf8');
const B = path.join(ROOT, 'reference/art_bank/prop/');
/* the six at pack pixels, candidate A of 10/13 (yellow in the tab, his survival packs), the same files */
const SIX = { batteries: 'pack_11_survival_props_045', food: 'pack_11_survival_props_042', meds: 'pack_12_weapons_and_supplies_030',
  rounds: 'pack_12_weapons_and_supplies_018', tape: 'pack_11_survival_props_039', water: 'pack_11_survival_props_004' };

/* every visible element that paints something a player sees, with what it is made of */
const INVENTORY = `(() => {
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    return r.width >= 4 && r.height >= 4 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05
      && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight; };
  const alpha = c => { const m = /rgba?\\(([^)]+)\\)/.exec(c || ''); if (!m) return 0; const p = m[1].split(',').map(parseFloat); return p.length > 3 ? p[3] : 1; };
  const rows = [];
  for (const e of document.querySelectorAll('body *')) {
    if (e.tagName === 'CANVAS' || e.tagName === 'SCRIPT' || e.tagName === 'STYLE' || e.tagName === 'IMG') continue;
    if (e.closest('#bmhud')) { if (e.id !== 'bmhud') continue; }
    if (!vis(e)) continue;
    /* a floor under a picture is not a box he sees: skip an element whose own canvas covers nine tenths of it */
    { const r0 = e.getBoundingClientRect(); const cv = [...e.querySelectorAll('canvas')].find(c => { const q = c.getBoundingClientRect(); return q.width * q.height >= 0.9 * r0.width * r0.height; }); if (cv) continue; }
    const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
    const bgi = cs.backgroundImage || 'none', bga = alpha(cs.backgroundColor), bw = parseFloat(cs.borderTopWidth) || 0, ba = alpha(cs.borderTopColor);
    const material = /url\\(/.test(bgi);
    const flat = !material && (bga > 0.08 || (bw > 0 && ba > 0.08) || /gradient/.test(bgi));
    if (!flat && !material) continue;
    rows.push({ sel: (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\\s+/).join('.') : '') || e.tagName.toLowerCase(),
      text: (e.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 28), box: [r.x, r.y, r.width, r.height].map(v => Math.round(v)),
      made: material ? 'material' : 'code', bg: cs.backgroundColor, bgi: material ? 'url' : bgi.slice(0, 40), border: bw ? bw + 'px ' + cs.borderTopColor : '', radius: cs.borderTopLeftRadius,
      font: cs.fontFamily.split(',')[0].replace(/"/g, ''), size: cs.fontSize });
  }
  return { W: innerWidth, H: innerHeight, dpr: devicePixelRatio, rows };
})()`;

(async () => {
  let d, p, fr;
  if (screen === 'map') { d = await open({ door: 120000, profile }); p = d.page; fr = d.fr; await p.waitForTimeout(7000); }
  else if (screen === 'settlement') { d = await open({ file: 'BOHEMIA_SETTLEMENT_SCREEN.html', bare: true, profile }); p = d.page; fr = p; await p.waitForTimeout(4000); }
  else { d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS={seed:5,speed:1,kind:"suburb"}' }); p = d.page; fr = p;
    const t0 = Date.now(); while (Date.now() - t0 < 40000) { if (await p.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board)) break; await p.waitForTimeout(200); } await p.waitForTimeout(2500); }
  const tag = screen + '_' + profile.replace('phone_', '');
  const res = { screen, profile, phase };
  if (phase === 'now') {
    await p.screenshot({ path: out + '/' + tag + '_now.png' });
    res.inventory = await fr.evaluate(INVENTORY);
  } else {
    const imgs = {}; for (const [s, f] of Object.entries(SIX)) imgs[s] = 'data:image/png;base64,' + fs.readFileSync(B + f + '.png').toString('base64');
    await fr.evaluate(HUD);
    res.laid = await fr.evaluate(({ imgs, screen }) => window.__bmOneScreen(screen, imgs), { imgs, screen });
    if (screen === 'map') {
      /* the demo shell's gear (the settings door) sits in the top page, a code-drawn rounded box: the same cardboard card, under the bar */
      res.gear = await p.evaluate(({ vars, hb }) => { const g = document.getElementById('gearbtn'); if (!g) return null;
        const st = document.createElement('style'); st.id = 'bmgearcss'; st.textContent = '#gearbtn{border:0!important;border-radius:2px!important;color:#f2e4c6!important;'
          + 'background:linear-gradient(rgba(12,8,4,.4),rgba(12,8,4,.4)),#3a2c1e ' + vars.card + ' 0 0/256px 100%!important;box-shadow:inset 0 1px 0 rgba(255,220,170,.22),0 1px 0 #000!important;top:' + Math.round(hb + 8) + 'px!important}';
        document.head.appendChild(st); const r = g.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map(Math.round); }, { vars: res.laid.vars, hb: res.laid.hudBottom });
    }
    delete res.laid.vars;
    await p.waitForTimeout(1500);
    await p.screenshot({ path: out + '/' + tag + '_cand.png' });
    res.inventory = await fr.evaluate(INVENTORY);
    res.hud = await fr.evaluate(() => window.__bmOneScreenMeasure());
  }
  if (screen === 'map') { const shell = await p.evaluate(INVENTORY); res.inventory.rows = res.inventory.rows.concat(shell.rows.filter(r => /gearbtn|notebtn|front|daycard/.test(r.sel)).map(r => Object.assign({ page: 'shell' }, r))); }
  fs.writeFileSync(out + '/' + tag + '_' + phase + '.json', JSON.stringify(res, null, 1));
  console.log(tag, phase, 'rows', res.inventory.rows.length, 'code', res.inventory.rows.filter(r => r.made === 'code').length);
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
