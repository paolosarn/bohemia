/* THE TOP BAR, the shots (UI [the top bar], rule 121, 10/19/26). Boots the demo on his phone profile through the one driver and
   photographs, from the game's own camera, at 1:1 (one css pixel a pixel):
   the map NOW, the map with each of the three bars (A, B, C) laid IN THE BROWSER ONLY by tools/bohemia_ui_the_top_bar_lay.js,
   then a road fight NOW and the same fight with nothing across the top. Every fact on the bar is read from the game first and
   written to the manifest, so the sheet and the gate can hold the bar to the game. A second shot of each bar with its ink made
   transparent gives the ground really under every word, for the contrast read (plain and in the sun) in the sheet tool.
   node tools/bohemia_ui_the_top_bar_shots.js <out dir> <phone_portrait|phone_landscape> */
const fs = require('fs'), path = require('path'); const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const [out, profile] = process.argv.slice(2);
const LAY = fs.readFileSync(path.join(ROOT, 'tools/bohemia_ui_the_top_bar_lay.js'), 'utf8');
const B = path.join(ROOT, 'reference/art_bank/prop/');
/* the six at his packs' pixels: the same files as the 10/13 candidate A and [one screen] (his YES on both) */
const SIX = { batteries: 'pack_11_survival_props_045', food: 'pack_11_survival_props_042', meds: 'pack_12_weapons_and_supplies_030',
  rounds: 'pack_12_weapons_and_supplies_018', water: 'pack_11_survival_props_004' };
const side = profile.replace('phone_', '');
const shot = (p, name) => p.screenshot({ path: path.join(out, name + '_' + side + '.png'), scale: 'css' });
const INK_OFF = `(() => { const s = document.createElement('style'); s.id = 'bminkoff'; s.textContent = '#bmtb *,#bmtb{color:transparent!important}#bmtb img,#bmtb canvas,#bmtb .ticks,#bmtb .hp{visibility:hidden!important}'; document.head.appendChild(s); })()`;
const INK_ON = `(() => { const s = document.getElementById('bminkoff'); if (s) s.remove(); })()`;

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const d = await open({ keepCards: true, profile }); const p = d.page, fr = d.fr;
  const res = { profile, made: '10/19', stamp: null, map: {}, fight: {} };
  try {
    await p.waitForTimeout(6000);
    res.stamp = await p.evaluate(() => { const b = document.getElementById('buildstamp'); return b ? b.textContent.trim() : null; });
    await fr.evaluate(LAY);
    const imgs = {}; for (const [s, f] of Object.entries(SIX)) imgs[s] = 'data:image/png;base64,' + fs.readFileSync(B + f + '.png').toString('base64');
    res.facts = await fr.evaluate(() => window.__bmTopBarFacts());
    res.map.now = await fr.evaluate(() => { const b = document.getElementById('menubar').getBoundingClientRect(); return { bottom: Math.round(b.bottom), text: document.getElementById('menubar').innerText.replace(/\s+/g, ' ').trim() }; });
    await shot(p, 'map_now');
    const receipt = await fr.evaluate(() => 'url(' + BohemiaMaterials.receipt().toDataURL('image/png') + ')');
    const gearMark = await fr.evaluate(() => window.__bmGearMark());
    for (const v of ['A', 'B', 'C']) {
      const laid = await fr.evaluate(({ v, f, imgs }) => window.__bmTopBar(v, f, imgs), { v, f: res.facts, imgs });
      /* the shell's gear onto its slot in the bar, dressed as a receipt tag (the real button, moved, its handler kept) */
      const gbox = await fr.evaluate(() => { const g = document.querySelector('#bmtb [data-f=gear]'); if (!g) return null; const r = g.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; });
      if (gbox) await p.evaluate(({ b, receipt, gearMark }) => { let s = document.getElementById('bmgearcss'); if (!s) { s = document.createElement('style'); s.id = 'bmgearcss'; document.head.appendChild(s); }
        s.textContent = '#gearbtn{position:fixed!important;left:' + b[0] + 'px!important;top:' + b[1] + 'px!important;width:' + b[2] + 'px!important;height:' + b[3] + 'px!important;border:0!important;border-radius:0!important;'
          + 'font-size:0!important;color:transparent!important;background:url(' + gearMark + ') center/20px 20px no-repeat,#e2dac6 ' + receipt + ' center/100% 100%!important;image-rendering:pixelated;box-shadow:0 1px 0 #000!important;filter:none!important}'; }, { b: gbox, receipt, gearMark });
      await p.waitForTimeout(900);
      await shot(p, 'map_' + v);
      const m = await fr.evaluate(() => window.__bmTopBarMeasure());
      m.gear = await p.evaluate(() => { const g = document.getElementById('gearbtn'); if (!g) return null; const r = g.getBoundingClientRect(), cs = getComputedStyle(g);
        return { box: [r.x, r.y, r.width, r.height].map(Math.round), radius: cs.borderTopLeftRadius, bgi: (cs.backgroundImage || '').slice(0, 12) }; });
      await fr.evaluate(INK_OFF); await p.waitForTimeout(300); await shot(p, 'map_' + v + '_ground'); await fr.evaluate(INK_ON);
      res.map[v] = { laid, measure: m };
      console.log(side, v, 'bar', laid.height, 'items', m.items.length);
    }
    /* put the map back as it was before the fight, so the fight is the game's own */
    await fr.evaluate(() => { const b = document.getElementById('menubar'); b.classList.remove('bmtb'); const r = document.getElementById('bmtb'); if (r) r.remove(); });
    await p.evaluate(() => { const s = document.getElementById('bmgearcss'); if (s) s.remove(); });
    const st = await fr.evaluate(async () => { for (let i = 0; i < 40 && FZOOMING; i++) await new Promise(r => setTimeout(r, 250)); try { stepOnce(0); stepOnce(4); } catch (_e) {}
      return roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 }); });
    let f = null; for (let i = 0; i < 150; i++) { const h = await p.$('#fightFrame'); if (h) { f = await h.contentFrame();
      if (f && await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board).catch(() => false)) break; } await p.waitForTimeout(200); }
    res.fight.started = st && !!f;
    if (f) {
      await p.waitForTimeout(3500);
      await shot(p, 'fight_now');
      res.fight.now = await f.evaluate(() => { const t = document.getElementById('top').getBoundingClientRect(), b = document.getElementById('bot').getBoundingClientRect();
        return { topBottom: Math.round(t.bottom), botTop: Math.round(b.top), H: innerHeight, mapBarShown: false }; });
      res.fight.now.shellBar = await p.evaluate(() => { const c = document.getElementById('cityFrame'); if (!c) return false; const r = c.getBoundingClientRect(), cs = getComputedStyle(c);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && r.height > 0 && document.getElementById('fightFrame').getBoundingClientRect().top > 0; });
      await f.evaluate(LAY);
      res.fight.after = await f.evaluate(() => window.__bmFightNoTop());
      await p.waitForTimeout(1500);
      await shot(p, 'fight_after');
      res.fight.after.measure = await f.evaluate(() => window.__bmTopBarMeasure());
      res.fight.after.edges = await f.evaluate(() => ({ TOPH: typeof TOPH !== 'undefined' ? TOPH : null, BOTH: typeof BOTH !== 'undefined' ? BOTH : null, autoOnBar: !!document.querySelector('#bot #bauto'),
        orderOnBar: !!document.querySelector('#bot #order'), faces: document.querySelectorAll('#bot #order canvas').length }));
      res.fight.after.autoTap = await f.evaluate(() => { const b = document.getElementById('bauto'); const was = FIGHT_UI.auto; b.click(); const now = FIGHT_UI.auto; b.click(); return { was, now }; });
    }
  } finally {
    fs.writeFileSync(path.join(out, 'shots_' + side + '.json'), JSON.stringify(res, null, 1));
    await d.close();
  }
  console.log('done', side, JSON.stringify(res.facts));
})().catch(e => { console.error(e); process.exit(1); });
