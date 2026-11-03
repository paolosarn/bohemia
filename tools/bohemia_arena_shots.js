#!/usr/bin/env node
/* ARENA (rule 375): the VOTE cards' pictures, taken on his phone's glass (390 x 844, two pixels a point) from the real screens,
   never a mock-up. One mode per piece:
     node tools/bohemia_arena_shots.js pit      -> slices/vote/arena/pit_*.webp   (piece a: the pit on the Mob's town, day, night, the bookie's sheet)
     node tools/bohemia_arena_shots.js pick     -> slices/vote/arena/pick_*.webp  (piece b: the card and the pick, the collar crossed out)
   The pictures are written as webp through the python PIL (python3 -I, nothing imported from the repo). */
const fs = require('fs'), path = require('path'), http = require('http'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'slices/vote/arena'), TMP = path.join(require('os').tmpdir(), 'arena_shots');
const TYPE = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.glb': 'model/gltf-binary', '.css': 'text/css' };
const srv = http.createServer((rq, rs) => { const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); } rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs); });
function webp(src, dst, q) { execFileSync('python3', ['-I', '-c', 'import sys\nfrom PIL import Image\nim=Image.open(sys.argv[1]).convert("RGB")\nim.save(sys.argv[2],"WEBP",quality=int(sys.argv[3]),method=6)', src, dst, String(q || 82)]); }
const MODE = process.argv[2] || 'pit';
(async () => {
  fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(TMP, { recursive: true });
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const PORT = srv.address().port;
  const { chromium } = require('playwright'); const b = await chromium.launch();
  const page = async (W, H) => { const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); return p; };
  const town = async (p, o) => {
    await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
    await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && window.BohemiaArena && BohemiaArena.ready(), null, { timeout: 30000 });
    await p.waitForTimeout(600);
    await p.evaluate(o => { try { localStorage.setItem('bohemia.company.v1', JSON.stringify(o.company || [])); } catch (e) {} BohemiaArena.reset(); BohemiaSettlement.open({ traits: [], place: { name: 'Mob', tier: 'fortress' }, batteries: 300, day: o.day, night: !!o.night }); }, o);
    await p.waitForTimeout(2600);
  };
  const shot = async (p, name) => { const f = path.join(TMP, name + '.png'); await p.screenshot({ path: f }); webp(f, path.join(OUT, name + '.webp')); console.log('wrote slices/vote/arena/' + name + '.webp'); };
  if (MODE === 'pit') {
    const p = await page(390, 844);
    await town(p, { day: 40 }); await shot(p, 'pit_town_day');
    const xy = await p.evaluate(() => BohemiaSettlement.where('arena')); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(1600); await shot(p, 'pit_sheet');
    const n = await page(390, 844); await town(n, { day: 40, night: true }); await shot(n, 'pit_town_night');
    const w = await page(844, 390); await town(w, { day: 40 }); await shot(w, 'pit_town_wide');
    /* the twin: the Mob's plaza as COOK drew it, and the same ground with the pit on it, at the picture's own pixels */
    execFileSync('python3', ['-I', '-c', [
      'import sys, json', 'from PIL import Image', 'R=sys.argv[1]', 'm=json.load(open(R+"/slices/arena/pit.json")); t=json.load(open(R+"/slices/arena/arena_town.json"))',
      'bg=Image.open(R+"/slices/settlement_ground_towns/mob_tall_right.webp").convert("RGBA"); at=t["pictures"]["mob_tall_right.webp"]["at"]',
      'x=int(round(at[0]-m["anchor"][0])); y=int(round(at[1]-m["anchor"][1])); box=(max(0,x-60),max(0,y-40),x+m["px"][0]+60,y+m["px"][1]+40)',
      'bg.crop(box).convert("RGB").save(R+"/slices/vote/arena/pit_before.webp","WEBP",quality=86)',
      'pit=Image.open(R+"/slices/arena/pit_day.webp").convert("RGBA"); bg.alpha_composite(pit,(x,y)); bg.crop(box).convert("RGB").save(R+"/slices/vote/arena/pit_after.webp","WEBP",quality=86)'].join('\n'), ROOT]);
    console.log('wrote slices/vote/arena/pit_before.webp, pit_after.webp');
  }
  if (MODE === 'pick') {
    const crew = [
      { name: 'Ruben Okafor', level: 3, look: 'cast_longcoat', gear: { main: 'pistol', body: 'leather_jacket', acc: 'cell_vest_scrap' } },
      { name: 'Lupe Varga', level: 2, look: 'cast_poncho', gear: { main: 'rifle', body: 'padded_vest' } },
      { name: 'Teo Salas', level: 2, look: 'cast_barearms', gear: { main: 'machete', off: 'shield_door', acc: 'cell_vest_yard' } },
      { name: 'Marisol Ortiz', level: 1, look: 'cast_apron', gear: { main: 'shotgun' } },
      { name: 'Dax Pruitt', level: 1, look: 'cast_widebrim', gear: { main: 'pistol' } }];
    const p = await page(390, 844);
    await town(p, { day: 43, company: crew });
    const xy = await p.evaluate(() => BohemiaSettlement.where('arena')); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(1600); await shot(p, 'pick_card');
    await p.evaluate(() => { const b = [...document.querySelectorAll('#sbody .act')].find(x => /pick/i.test(x.textContent)); b && b.click(); }); await p.waitForTimeout(1200); await shot(p, 'pick_empty');
    for (const i of [0, 2, 1]) { await p.evaluate(i => { const c = document.querySelectorAll('#ar-pick .ar-man')[i]; c && c.click(); }, i); await p.waitForTimeout(300); }
    await p.waitForTimeout(600); await shot(p, 'pick_three');
  }
  await b.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
