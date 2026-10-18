/* NO BROWSER DEFAULTS ON THE HUD, the shots (UI [no browser defaults on the HUD], rule 114 D10, 10/18). Opens each game screen on his
   phone through the one driver, photographs it at 1:1 and reads what the browser resolves on it (NOW), then lays the strip IN THE
   BROWSER ONLY (tools/bohemia_ui_no_defaults_strip.js), photographs it again and reads it again (AFTER). Nothing is written to the game.
   Screens: map (the demo's HUD), phone (the cracked phone opened), fight (the rebuilt fight's bar), vote (the VOTE tab), settlement.
   node tools/bohemia_ui_no_defaults_shots.js <out dir> <map|phone|fight|vote|settlement> <phone_portrait|phone_landscape> */
const fs = require('fs'), path = require('path'); const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const [out, screen, profile] = process.argv.slice(2);
const STRIP = fs.readFileSync(path.join(ROOT, 'tools/bohemia_ui_no_defaults_strip.js'), 'utf8');
/* the game's own faces, from slices/fonts, for a page that never loaded them (relative to slices/, where every page lives) */
const FONTS = ['ROM', 'Casing', 'Body'].map(k => "@font-face{font-family:'Bohemia" + k + "';font-display:block;src:url(fonts/Bohemia" + k + "-Regular.woff2) format('woff2')}").join('\n');
(async () => {
  let d, p, fr;
  if (screen === 'map' || screen === 'phone') { d = await open({ door: 120000, profile }); p = d.page; fr = d.fr; await p.waitForTimeout(7000);
    if (screen === 'phone') { await fr.evaluate(() => phoneOpen()); await p.waitForTimeout(6000); } }
  else if (screen === 'vote') { d = await open({ file: 'BOHEMIA_VOTE_TAB.html', bare: true, profile }); p = d.page; fr = p; await p.waitForTimeout(5000); }
  else if (screen === 'settlement') { d = await open({ file: 'BOHEMIA_SETTLEMENT_SCREEN.html', bare: true, profile }); p = d.page; fr = p; await p.waitForTimeout(4000); }
  else { d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS={seed:5,speed:1,kind:"suburb"}' }); p = d.page; fr = p;
    const t0 = Date.now(); while (Date.now() - t0 < 40000) { if (await p.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board)) break; await p.waitForTimeout(200); } await p.waitForTimeout(2500); }
  const tag = screen + '_' + profile.replace('phone_', '');
  /* read and strip from the top page only: it walks down into every same-origin frame (the game frame, the phone's inside), so the
     demo shell's gear and the game under it are one read; stripping the frame a second time from inside would overwrite the first */
  const pages = [p];
  for (const q of pages) await q.evaluate(STRIP);
  const read = async () => { const r = []; for (const q of pages) r.push(await q.evaluate(() => window.__bmD10Read())); return r; };
  const res = { screen, profile };
  await p.screenshot({ path: out + '/' + tag + '_now.png' });
  res.now = await read(); res.boxes_now = await p.evaluate(() => window.__bmD10Boxes());
  res.strip = [];
  /* two passes a beat apart: the phone fades its inside in, so a panel can arrive after the first */
  for (let pass = 0; pass < 2; pass++) { for (const q of pages) res.strip.push(await q.evaluate(f => window.__bmD10Strip(f), FONTS)); await p.waitForTimeout(1500); }
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1800);
  await p.screenshot({ path: out + '/' + tag + '_after.png' });
  res.after = await read(); res.boxes_after = await p.evaluate(() => window.__bmD10Boxes());
  res.moved = Object.keys(res.boxes_now).filter(k => res.boxes_after[k] && res.boxes_now[k].some((v, i) => Math.abs(v - res.boxes_after[k][i]) > 2)).map(k => [k, res.boxes_now[k], res.boxes_after[k]]);
  fs.writeFileSync(out + '/' + tag + '.json', JSON.stringify(res, null, 1));
  const sum = k => res[k].reduce((a, r) => a + Object.values(r.total).reduce((x, y) => x + y, 0), 0);
  console.log(tag, 'now', sum('now'), JSON.stringify(res.now.map(r => r.total)), 'after', sum('after'), JSON.stringify(res.after.map(r => r.total)), 'moved', res.moved.length, '/', Object.keys(res.boxes_now).length, JSON.stringify(res.moved.slice(0, 6)));
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
