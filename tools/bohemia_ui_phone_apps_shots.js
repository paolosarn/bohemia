/* THE PHONE'S APPS, the shots (UI [the phone's apps], 10/18/26). Opens the demo on his phone, opens the cracked phone the way the
   map's own phone door does, and photographs it at 1:1: NOW (the opened phone as it is, plus a D10 read of its inside: the fonts,
   gradients, blurs and rounded corners it resolves), then the home screen laid IN THE BROWSER ONLY from
   tools/bohemia_ui_phone_apps_home.js: look A and look B after the first crisis (six apps), and look A before it (five; the
   timeline does not exist yet). Nothing is written to the game.
   node tools/bohemia_ui_phone_apps_shots.js <out dir> <phone_portrait|phone_landscape> */
const fs = require('fs'), path = require('path'); const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const [out, profile] = process.argv.slice(2);
const HOME = fs.readFileSync(path.join(ROOT, 'tools/bohemia_ui_phone_apps_home.js'), 'utf8');
const B = path.join(ROOT, 'reference/art_bank/prop/');
/* his pack props, cut whole at their own 96 pixels: two per app, look A takes the first, look B the second */
const PICK = {
  A: { feed: 'pack_11_survival_props_021', jobs: 'pack_11_survival_props_033', stash: 'pack_16_loot_and_survival_props_000',
       crew: 'pack_miscellaneous_043', settings: 'pack_15_workbenches_and_tools_023', timeline: 'pack_11_gauges_and_meters_005' },
  B: { feed: 'pack_11_survival_props_038', jobs: 'pack_miscellaneous_044', stash: 'pack_16_loot_and_survival_props_016',
       crew: 'pack_11_survival_props_024', settings: 'pack_11_gauges_and_meters_001', timeline: 'pack_11_gauges_and_meters_000' } };
const D10 = `(() => { const rows = []; const walk = (doc, where) => { for (const e of doc.querySelectorAll('body *')) { const r = e.getBoundingClientRect();
  if (r.width < 4 || r.height < 4) continue; const cs = doc.defaultView.getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
  const t = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  rows.push({ where, sel: (e.id ? '#' + e.id : e.tagName.toLowerCase()) + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\\s+/)[0] : ''),
    grad: /gradient/.test(cs.backgroundImage), radius: parseFloat(cs.borderTopLeftRadius) || 0, blur: /blur/.test(cs.filter + cs.backdropFilter),
    glow: /\\d+px \\d+px [1-9]\\d*px/.test(cs.boxShadow + ' ' + cs.textShadow), font: t ? cs.fontFamily.split(',')[0].replace(/"/g, '').trim() : '' }); } };
  walk(document.querySelector('#phonewrap') ? document : document, 'bar');
  const f = document.querySelector('#phoneslot iframe'); try { if (f && f.contentDocument) walk(f.contentDocument, 'inside'); } catch (e) {}
  return rows.filter(r => r.where === 'inside' || r.sel.startsWith('#phone')); })()`;
(async () => {
  const d = await open({ door: 120000, profile }); const p = d.page, fr = d.fr; await p.waitForTimeout(7000);
  await fr.evaluate(() => phoneOpen()); await p.waitForTimeout(6000);
  const tag = profile.replace('phone_', ''); const res = { profile };
  await p.screenshot({ path: out + '/' + tag + '_now.png' });
  res.now = await fr.evaluate(D10);
  await fr.evaluate(HOME);
  for (const [look, crisis, name] of [['A', true, 'A'], ['B', true, 'B'], ['A', false, 'A_before']]) {
    const imgs = {}; for (const [k, f] of Object.entries(PICK[look])) imgs[k] = 'data:image/png;base64,' + fs.readFileSync(B + f + '.png').toString('base64');
    res[name] = { laid: await fr.evaluate(({ look, imgs, crisis }) => window.__bmPhoneHome(look, imgs, crisis), { look, imgs, crisis }), pick: PICK[look] };
    await p.waitForTimeout(1200);
    await p.screenshot({ path: out + '/' + tag + '_' + name + '.png' });
    res[name].measure = await fr.evaluate(() => window.__bmPhoneHomeMeasure());
    res[name].frame = await p.evaluate(() => { const f = document.querySelector('iframe'); if (!f) return [0, 0]; const q = f.getBoundingClientRect(); return [q.x, q.y]; });
  }
  fs.writeFileSync(out + '/' + tag + '.json', JSON.stringify(res, null, 1));
  console.log(tag, 'now rows', res.now.length, 'A apps', res.A.laid.apps, 'before apps', res.A_before.laid.apps);
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
