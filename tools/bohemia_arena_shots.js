#!/usr/bin/env node
/* ARENA (rule 375): the VOTE cards' pictures, taken on his phone's glass (390 x 844, two pixels a point) from the real screens,
   never a mock-up. One mode per piece:
     node tools/bohemia_arena_shots.js pit      -> slices/vote/arena/pit_*.webp   (piece a: the pit on the Mob's town, day, night, the bookie's sheet)
     node tools/bohemia_arena_shots.js pick     -> slices/vote/arena/pick_*.webp
     node tools/bohemia_arena_shots.js ranks    -> slices/vote/arena/ranks_*.webp (piece d: the fifth night, the ranks on the faces, the purse and the prize paid)
     node tools/bohemia_arena_shots.js tourney  -> slices/vote/arena/tourney_*.webp (piece e: the post on the phone, the bookie's box, the five, round one, round two waiting)
     node tools/bohemia_arena_shots.js fight    -> slices/vote/arena/fight_*.webp (piece c: the demo driven like a player: the card, the lineup, mid-fight, the end, home)  (piece b: the card, the pick ready, one tap swaps a man in)
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
      { name: 'YOU', level: 2, look: 'you', gear: { main: 'pistol' } },
      { name: 'DESI', level: 2, look: 'person_town_0', gear: { main: 'rifle', acc: 'cell_vest_scrap' } },
      { name: 'RAUL', level: 2, look: 'person_town_1', gear: { main: 'machete' } },
      { name: 'TEO', level: 1, look: 'person_town_5', gear: { main: 'shotgun', acc: 'cell_vest_yard' } },
      { name: 'MARCOS', level: 1, look: 'person_town_2', gear: { main: 'pistol' } }];
    const p = await page(390, 844);
    await town(p, { day: 43, company: crew });
    const xy = await p.evaluate(() => BohemiaSettlement.where('arena')); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(1600); await shot(p, 'pick_card');
    await p.evaluate(() => { const b = [...document.querySelectorAll('#sbody .act')].find(x => /pick/i.test(x.textContent)); b && b.click(); }); await p.waitForTimeout(1500); await shot(p, 'pick_ready');
    /* one tap on a fourth face swaps him in for the first pick */
    await p.evaluate(() => { const c = document.querySelectorAll('#ar-pick .ar-man')[3]; c && c.click(); }); await p.waitForTimeout(700); await shot(p, 'pick_swap');
  }
  if (MODE === 'ranks') {
    /* piece d: the fifth night on the card, the ranks on the faces, and the bookie paying the purse and the prize */
    const crew = [
      { name: 'YOU', level: 3, look: 'you', gear: { main: 'pistol' } },
      { name: 'DESI', level: 3, look: 'person_town_0', gear: { main: 'rifle' } },
      { name: 'RAUL', level: 2, look: 'person_town_1', gear: { main: 'machete' } },
      { name: 'TEO', level: 2, look: 'person_town_5', gear: { main: 'shotgun' } }];
    const p = await page(390, 844);
    await town(p, { day: 30, company: crew });
    await p.evaluate(() => { const st = BohemiaArena.state(); st.wins = 9; st.fights = 11; st.prizes = 1; st.men = { YOU: { fights: 9, wins: 8 }, DESI: { fights: 13, wins: 12 }, RAUL: { fights: 2, wins: 1 } }; BohemiaArena.save(st); });
    const xy = await p.evaluate(() => BohemiaSettlement.where('arena')); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(1600); await shot(p, 'ranks_card');
    await p.evaluate(() => { const b = [...document.querySelectorAll('#sbody .act')].find(x => /pick/i.test(x.textContent)); b && b.click(); }); await p.waitForTimeout(1500); await shot(p, 'ranks_pick');
    await p.evaluate(() => { document.getElementById('close').click(); });
    await p.waitForTimeout(500);
    await p.evaluate(() => window.postMessage({ type: 'BOHEMIA_ARENA_RESULT', result: { won: true, paid: 65, prize: 'gladiator_helmet', card: 'x', men: [{ name: 'YOU' }, { name: 'DESI' }, { name: 'RAUL' }],
      ranks: [{ name: 'YOU', rank: 'arena_fighter', rank_name: 'ARENA FIGHTER' }] } }, '*'));
    await p.waitForTimeout(2200); await shot(p, 'ranks_paid');
  }
  if (MODE === 'tourney') {
    /* piece e: the demo, tournament week: the Strip's post on the phone, the bookie's tournament box, the pick of five, round two waiting */
    await b.close(); srv.close();
    const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
    const d = await open({ fog: true }); const fr = d.fr, pg = d.page;
    const shotD = async (name) => { const f = path.join(TMP, name + '.png'); await pg.screenshot({ path: f }); webp(f, path.join(OUT, name + '.webp')); console.log('wrote slices/vote/arena/' + name + '.webp'); };
    for (let i = 0; i < 80; i++) { await pg.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && typeof loopOpenTown === 'function' && !!window.BohemiaArena && BohemiaArena.ready()).catch(() => false)) break; }
    for (let i = 0; i < 40; i++) { const g = await pg.evaluate(() => { const w = document.getElementById('mainmaker'); if (!w) return 'gone'; if (w.dataset.armed !== '1') return null; const k = w.querySelector('.go'), r = k && k.getBoundingClientRect(); return r && r.width > 4 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; }).catch(() => null); if (g === 'gone') break; if (g) await pg.touchscreen.tap(g.x, g.y); await pg.waitForTimeout(500); }
    await pg.waitForTimeout(2500);
    await pg.evaluate(() => { const p = window.BOH_START && BOH_START.picks(); const co = JSON.parse(JSON.stringify((p && p.company) || [])); co.forEach((m, i) => { m.name = m.name || (i === 0 ? 'YOU' : 'MAN' + i); m.gear = m.gear || {}; });
      const extra = ['TEO', 'MARCOS', 'NENO'].map((n, k) => Object.assign(JSON.parse(JSON.stringify(co[1 + (k % Math.max(1, co.length - 1))] || co[0])), { name: n })); localStorage.setItem('bohemia.company.v1', JSON.stringify(co.concat(extra).slice(0, 6))); });
    const T = await fr.evaluate(() => BohemiaArena.V('tournament'));
    /* leave the start town for the map, then the morning the tournament opens: the post on his phone's feed */
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
    await pg.waitForTimeout(1500);
    await fr.evaluate((day) => { BohemiaArena.reset(); DAY.day = day; arenaWake(day); }, T.first_day);
    await pg.waitForTimeout(4000); await shotD('tourney_feed');
    await fr.evaluate(() => { const b = ctBases().Mob; loopOpenTown({ name: 'Mob', x: b.x, y: b.y, tier: mapTierOf('Mob') }); });
    let sf = null; for (let i = 0; i < 40 && !sf; i++) { await pg.waitForTimeout(500); sf = pg.frames().find(f => /SETTLEMENT/.test(f.url())); }
    for (let i = 0; i < 40; i++) { await pg.waitForTimeout(400); if (await sf.evaluate(() => window.BohemiaSettlement && BohemiaSettlement.order().indexOf('arena') >= 0).catch(() => false)) break; }
    await pg.waitForTimeout(1200);
    const sb = await (await fr.$('#settleFrame')).boundingBox();
    for (let k = 0; k < 5; k++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('arena')); await pg.touchscreen.tap(sb.x + xy.x, sb.y + xy.y); await pg.waitForTimeout(1600); if (await sf.evaluate(() => !!document.querySelector('#sheet.on .ar-card')).catch(() => false)) break; }
    await sf.evaluate(() => { const b = document.querySelector('#sheet .ar-tourney'); b && b.scrollIntoView({ block: 'end' }); }); await pg.waitForTimeout(600); await shotD('tourney_box');
    await sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet .ar-tourney .act')].find(x => /Enter/.test(x.textContent)); b && b.click(); }); await pg.waitForTimeout(1500); await shotD('tourney_pick');
    await sf.evaluate(() => { const b = document.querySelector('#ar-pick .ar-fight'); b && b.click(); });
    let ff = null; for (let i = 0; i < 60 && !ff; i++) { await pg.waitForTimeout(500); const h = await pg.$('#fightFrame'); if (h) { const x = await h.contentFrame(); if (x && await x.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) ff = x; } }
    await pg.waitForTimeout(3000); await shotD('tourney_round1');
    await ff.evaluate(() => { try { if (!UI.auto) document.getElementById('bauto').click(); } catch (e) {} });
    let natural = false; for (let i = 0; i < 160; i++) { await pg.waitForTimeout(500); if (await ff.evaluate(() => FIGHT.S.over).catch(() => true)) { natural = true; break; } }
    console.log('round one ended by itself', natural, await ff.evaluate(() => FIGHT.S.result).catch(() => null));
    await ff.evaluate(() => { if (!FIGHT.S.over) { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); } }).catch(() => {});
    for (let i = 0; i < 40; i++) { await pg.waitForTimeout(500); if (await pg.evaluate(() => !!(window.SPOILS && SPOILS.frame)).catch(() => false)) break; }
    await pg.waitForTimeout(1500); await pg.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
    for (let i = 0; i < 40; i++) { await pg.waitForTimeout(500); const s2 = pg.frames().find(f => /SETTLEMENT/.test(f.url())); const ln = s2 ? await s2.evaluate(() => { const s = document.getElementById('sheet'); const p = s && s.classList.contains('on') && s.querySelector('.say p'); return p ? p.textContent : null; }).catch(() => null) : null; if (ln && /Round|Out in/.test(ln)) break; }
    await pg.waitForTimeout(1200); await shotD('tourney_round2');
    try { await d.browser.close(); } catch (e) {} try { d.server && d.server.close(); } catch (e) {}
    return;
  }
  if (MODE === 'fight') {
    /* piece c: the real demo, driven like a player: the Mob's town, the pit, the pick, FIGHT, the fight, the end, home */
    await b.close(); srv.close();
    const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
    const d = await open({ fog: true }); const fr = d.fr, pg = d.page;
    const shotD = async (name) => { const f = path.join(TMP, name + '.png'); await pg.screenshot({ path: f }); webp(f, path.join(OUT, name + '.webp')); console.log('wrote slices/vote/arena/' + name + '.webp'); };
    for (let i = 0; i < 80; i++) { await pg.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && typeof loopOpenTown === 'function' && !!window.BohemiaArena && BohemiaArena.ready()).catch(() => false)) break; }
    for (let i = 0; i < 40; i++) { const g = await pg.evaluate(() => { const w = document.getElementById('mainmaker'); if (!w) return 'gone'; if (w.dataset.armed !== '1') return null; const k = w.querySelector('.go'), r = k && k.getBoundingClientRect(); return r && r.width > 4 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; }).catch(() => null); if (g === 'gone') break; if (g) await pg.touchscreen.tap(g.x, g.y); await pg.waitForTimeout(500); }
    await pg.waitForTimeout(2500);
    await fr.evaluate(() => { BohemiaArena.reset(); const s = BohemiaArena.state(); s.wins = 6; BohemiaArena.save(s); const b = ctBases().Mob; loopOpenTown({ name: 'Mob', x: b.x, y: b.y, tier: mapTierOf('Mob') }); });
    let sf = null; for (let i = 0; i < 40 && !sf; i++) { await pg.waitForTimeout(500); sf = pg.frames().find(f => /SETTLEMENT/.test(f.url())); }
    for (let i = 0; i < 40; i++) { await pg.waitForTimeout(400); if (await sf.evaluate(() => window.BohemiaSettlement && BohemiaSettlement.order().indexOf('arena') >= 0).catch(() => false)) break; }
    await pg.waitForTimeout(1200);
    const sb = await (await fr.$('#settleFrame')).boundingBox(), xy = await sf.evaluate(() => BohemiaSettlement.where('arena'));
    for (let k = 0; k < 5; k++) { const xy2 = await sf.evaluate(() => BohemiaSettlement.where('arena')); await pg.touchscreen.tap(sb.x + xy2.x, sb.y + xy2.y); await pg.waitForTimeout(1800);
      if (await sf.evaluate(() => !!document.querySelector('#sheet.on .ar-card')).catch(() => false)) break; }
    await shotD('fight_card');
    await sf.evaluate(() => { const b = [...document.querySelectorAll('#sbody .act')].find(x => /pick/i.test(x.textContent)); b && b.click(); }); await pg.waitForTimeout(1200);
    await sf.evaluate(() => { const b = document.querySelector('#ar-pick .ar-fight'); b && b.click(); });
    let ff = null; for (let i = 0; i < 60 && !ff; i++) { await pg.waitForTimeout(500); const h = await pg.$('#fightFrame'); if (h) { const x = await h.contentFrame(); if (x && await x.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) ff = x; } }
    await pg.waitForTimeout(3000); await shotD('fight_lineup');
    await ff.evaluate(() => { try { if (!UI.auto) document.getElementById('bauto').click(); } catch (e) {} });
    await pg.waitForTimeout(9000); await shotD('fight_mid');
    let natural = false; for (let i = 0; i < 160; i++) { await pg.waitForTimeout(500); if (await ff.evaluate(() => FIGHT.S.over).catch(() => true)) { natural = true; break; } }
    console.log('ended by itself', natural);
    await ff.evaluate(() => { if (!FIGHT.S.over) { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); } }).catch(() => {});
    for (let i = 0; i < 40; i++) { await pg.waitForTimeout(500); if (await pg.evaluate(() => !!(window.SPOILS && SPOILS.frame)).catch(() => false)) break; }
    await pg.waitForTimeout(2500); await shotD('fight_spoils');
    const res = await ff.evaluate(() => ({ result: FIGHT.S.result, rounds: FIGHT.S.round, them: FIGHT.S.units.filter(u => u.side === 'them').map(u => ({ k: u.kind || u.id, dead: !!u.dead, fled: !!u.fled, edge: !!u.atEdge, m: u.morale })) })).catch(() => null); console.log('result', JSON.stringify(res), JSON.stringify(await pg.evaluate(() => window.BohemiaArenaCrowd ? BohemiaArenaCrowd.heard() : null)));
    await pg.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
    for (let i = 0; i < 40; i++) { await pg.waitForTimeout(500); const s2 = pg.frames().find(f => /SETTLEMENT/.test(f.url())); const ln = s2 ? await s2.evaluate(() => { const s = document.getElementById('sheet'); const p = s && s.classList.contains('on') && s.querySelector('.say p'); return p ? p.textContent : null; }).catch(() => null) : null; if (ln && /won|lost/i.test(ln)) break; }
    await pg.waitForTimeout(1200); await shotD('fight_home');
    try { await d.browser.close(); } catch (e) {} try { d.server && d.server.close(); } catch (e) {}
    return;
  }
  await b.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
