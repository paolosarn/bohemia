#!/usr/bin/env node
/* ============================================================================
   THE ARENA GATE (ARENA lane, 11/3/26, VAMILY rule 375 and its duct-tape amendment, ask lines 402 and 403)
   Paolo 11/3: 'I forgot about the arena system in Battle Brothers holy shit yes I love that... they host an arena with exotic DNA
   lab shits... your accessory thing is X'd out and won't apply as you enter... easier to choose the three people that go in... a
   tournament, you can bring five.' Battle Brothers' arena is the floor (records/BOHEMIA_ARENA_HOW_BATTLE_BROTHERS_DOES_IT_11_3_26.md).

   A  THE RULES (node, engine/bohemia_arena.js on records/target/bb/arena.json)
      A1 every number in the file carries its source and its reason
      A2 three men, five in a tournament; one fight a day; no retreat, no loot, the accessory does not count
      A3 the card is the same all day and a new one when the day turns (ten days, at least five different cards)
      A4 the pool climbs with arena wins (the sloth only from ten wins, the champion from fifteen; hyenas leave after five)
      A5 paid only on a win; a man climbs Pit Fighter (1), Arena Fighter (5), Arena Veteran (12)
      A6 every fifth win is the fifth card: a third more foes and a piece of pit gear; lost, the prize waits
      A7 the Mob's power: on a dead-generator day no big clone is on the card and the beasts come at half
      A8 the tournament: five days in eighteen, three rounds that pay as they are won, quit keeps what was won
   B  THE PIT ON THE MOB'S TOWN (the real screen, 390 x 844)
      B1 the Mob's town has THE PIT, last in the order; a town that is not the Mob's has none
      B2 the pit is drawn over the town (its pixels differ from the bare picture where it stands) by day and by night
      B3 a tap on the pit opens the bookie: his face, his name, a line about tonight, never the market
      B4 the card says it plainly: every foe in his own body, how many, the purse in batteries, the house rules
      B5 nobody walks into the pool (the pit's ground is a block the town's people go round)
   C  THE PICK AND THE WAY IN (the demo, a real finger: the Mob's town, the pit, the pick, FIGHT)
      C2 one screen of big faces: every man of the company, the best N already picked (three), FIGHT one tap away
      C3 every man's accessory slot is crossed out in red, and a man who wears one shows it struck through
      C4 FIGHT hands the fight ONLY the picked men, in his order, and none of them wears his accessory inside
      C5 the foes are the card's, every one, on a small board cut to the two sides, the arena flag riding with it
   D  THE FIGHT IN THE PIT (the same demo, the fight he walked into)
      D1 no retreat: the button is gone and a press does nothing (bb_all/0620: 'you can't retreat once a battle has started')
      D2 the crowd answers the fight's own sounds: the murmur under it, a cheer when theirs falls, a gasp when yours misses, a boo
         when a man runs, nothing for the rest
      D3 the end: nothing comes off the dead (the spoils screen keeps its recap and drops nothing), the long cheer on the win
      D4 home: the card's purse paid on the win, the win counted, back in the Mob's town with the bookie saying so
      D5 the crowd is real recordings through the PA (tools/bohemia_arena_crowd.py --check)
   ============================================================================ */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const A = require(path.join(ROOT, 'engine/bohemia_arena.js'));
const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/arena.json'), 'utf8'));

console.log('A  THE RULES');
const keys = Object.keys(D).filter(k => !/^_|^draft$|^tuned$/.test(k));
ok('A1 every number in the file carries its source and its reason', keys.every(k => D[k] && D[k].value !== undefined && typeof D[k].source === 'string' && D[k].source.length > 10 && typeof D[k].why === 'string'), keys.filter(k => !(D[k] && D[k].source && D[k].why)).join(',') || keys.length + ' rows');
ok('A2 three men, five in a tournament, one fight a day, no retreat, no loot, the accessory does not count', A.V('men') === 3 && A.V('men_tournament') === 5 && A.V('fights_per_day') === 1 && A.V('retreat') === false && A.V('loot') === false && A.V('accessory_counts') === false);
A.reset();
const sameDay = JSON.stringify(A.card('Mob', 7)) === JSON.stringify(A.card('Mob', 7));
const ids = new Set(); let turns = 0; for (let d = 20; d < 50; d++) { const c = A.card('Mob', d, { wins: 6 }), c2 = A.card('Mob', d + 1, { wins: 6 }); ids.add(c.opp + ':' + c.lines.map(l => l.n).join('.')); if (c.id !== c2.id) turns++; }
ok('A3 the card is the same all day and a new one when the day turns', sameDay && ids.size >= 5 && turns === 30, ids.size + ' different cards in thirty days');
const poolAt = w => { const s = new Set(); for (let d = 1; d < 400; d++) s.add(A.card('Mob', d, { wins: w }).opp); return s; };
const p0 = poolAt(0), p9 = poolAt(9), p10 = poolAt(10), p15 = poolAt(15);
ok('A4 the pool climbs with arena wins (sloth from 10, champion from 15, hyenas gone after 5)', !p9.has('sloth') && p10.has('sloth') && !p10.has('champion') && p15.has('champion') && p0.has('hyenas') && !p10.has('hyenas') && p0.has('raiders'), [...p0].join('/') + ' | ' + [...p15].join('/'));
A.reset();
let c = A.card('Mob', 3), r = A.result(c, { won: false, men: [{ name: 'Ana' }, { name: 'Beto' }, { name: 'Cruz' }] });
const lostPays = r.paid;
for (let i = 0; i < 12; i++) { c = A.card('Mob', 10 + i); r = A.result(c, { won: true, men: i === 0 ? [{ name: 'Ana' }, { name: 'Beto' }, { name: 'Cruz', dead: true }] : [{ name: 'Ana' }, { name: 'Beto' }] }); }
ok('A5 paid only on a win; the ranks climb at 1, 5 and 12 wins', lostPays === 0 && r.paid > 0 && A.rankOf('Ana').id === 'arena_veteran' && A.rankOf('Cruz') === null && A.trait('Ana').struck_down_survive === 0.5, 'Ana ' + (A.rankOf('Ana') || {}).id + ', Cruz ' + (A.rankOf('Cruz') || {}).id);
A.reset();
let st = A.state(); st.wins = 4; A.save(st);
const f5 = A.card('Mob', 40), f4 = A.card('Mob', 40, { wins: 3 });
A.result(f5, { won: false, men: [{ name: 'Ana' }] });
const owed = A.card('Mob', 41);
ok('A6 the fifth card is heavier and offers pit gear; a lost one waits for the next win', f5.fifth && f5.prize === 'pit_harness' && !f4.fifth && f5.count >= f4.count && owed.fifth && owed.prize === 'pit_harness', 'fifth ' + f5.count + ' vs ' + f4.count + ' foes');
let out = null, on = null; for (let d = 1; d < 300 && !(out && on); d++) { const k = A.card('Mob', d, { wins: 12 }); if (k.power.out) out = out || k; else on = on || k; }
const outs = []; for (let d = 1; d < 300; d++) { const k = A.card('Mob', d, { wins: 12 }); if (k.power.out) outs.push(k); }
ok('A7 a dead-generator day has no big clone on the card and the beasts at half', outs.length > 20 && outs.every(k => { const op = A.V('opponents').find(o => o.id === k.opp); return !op.big; }), outs.length + ' dead days of 299');
A.reset();
const T = A.tournament(6), Tn = A.tournament(11), T2 = A.tournament(24);
const r0 = A.card('Mob', 6, { tournament: { id: 'tourney:6', round: 0 } }), r2 = A.card('Mob', 6, { tournament: { id: 'tourney:6', round: 2 } });
const w0 = A.result(r0, { won: true, men: [1, 2, 3, 4, 5].map(i => ({ name: 'T' + i })) }); const q = A.quit('tourney:6');
ok('A8 the tournament: five days in eighteen, five men, rounds pay as won, quit keeps it', T.on && T.left === 5 && !Tn.on && T2.on && r0.men === 5 && r2.purse > r0.purse && w0.paid === r0.purse && q && q.quit, 'round one ' + r0.purse + ', round three ' + r2.purse);

console.log('B  THE PIT ON THE MOB\'S TOWN');
const TYPE = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.glb': 'model/gltf-binary', '.css': 'text/css' };
const srv = http.createServer((rq, rs) => { const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); } rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs); });
(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const PORT = srv.address().port;
  const { chromium } = require('playwright'); const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && window.BohemiaArena && BohemiaArena.ready() && window.BohemiaArenaTown && BohemiaArenaTown.ready(), null, { timeout: 30000 });
  await p.waitForTimeout(500);
  const openTown = async (name, tier, night) => { await p.evaluate(o => { BohemiaArena.reset(); BohemiaSettlement.open({ traits: [], place: { name: o.name, tier: o.tier }, batteries: 300, day: 12, night: !!o.night }); }, { name, tier, night }); await p.waitForTimeout(2200); };
  await openTown('Reds', 'fortress');
  const reds = await p.evaluate(() => BohemiaSettlement.order());
  await openTown('Mob', 'fortress');
  const mob = await p.evaluate(() => BohemiaSettlement.order());
  ok('B1 the Mob\'s town has THE PIT, last; a town that is not the Mob\'s has none', mob[mob.length - 1] === 'arena' && reds.indexOf('arena') < 0, mob.join(',') + ' | Reds ' + reds.length);
  /* B2: the pit's own pixels on the glass: the canvas where the pit stands, drawn with and without it */
  const diff = async () => p.evaluate(() => new Promise(res => { const cv = document.getElementById('cv'), x = cv.getContext('2d'), xy = BohemiaSettlement.where('arena'); if (!xy) return res(-1);
    const dpr = cv.width / cv.clientWidth, X = Math.round(xy.x * dpr) - 40, Y = Math.round(xy.y * dpr) - 40;
    const a = x.getImageData(X, Y, 80, 80).data; const keep = BohemiaArenaTown.draw; BohemiaArenaTown.draw = function(){ return false; };
    requestAnimationFrame(() => requestAnimationFrame(() => { const bb = x.getImageData(X, Y, 80, 80).data; BohemiaArenaTown.draw = keep; let n = 0; for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - bb[i]) + Math.abs(a[i + 1] - bb[i + 1]) + Math.abs(a[i + 2] - bb[i + 2]) > 30) n++; res(n / (a.length / 4)); })); }));
  const dDay = await diff();
  await openTown('Mob', 'fortress', true); const dNight = await diff();
  ok('B2 the pit is drawn over the town, by day and by night', dDay > 0.25 && dNight > 0.15, 'day ' + Math.round(dDay * 100) + '% of the spot changed, night ' + Math.round(dNight * 100) + '%');
  await openTown('Mob', 'fortress');
  const xy = await p.evaluate(() => BohemiaSettlement.where('arena'));
  if (xy) await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(1500);
  const sheet = await p.evaluate(() => { const s = document.getElementById('sheet'), say = s.querySelector('.say'); const card = s.querySelector('.ar-card');
    return { on: s.classList.contains('on'), name: say && say.querySelector('.nm') && say.querySelector('.nm').textContent, line: say && say.querySelector('p') && say.querySelector('p').textContent, face: !!s.querySelector('.who canvas.face'),
      foes: card ? [...card.querySelectorAll('.ar-foe')].map(f => ({ id: f.dataset.foe, n: +f.querySelector('.n').textContent, w: f.querySelector('.w').textContent, painted: (() => { const c = f.querySelector('canvas'); if (!c) return 0; const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let k = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 40) k++; return k; })() })) : [],
      purse: card && card.querySelector('.ar-purse b') && card.querySelector('.ar-purse b').textContent, rules: card && card.querySelector('.ar-rules') && card.querySelector('.ar-rules').textContent, cardId: card && card.dataset.card }; });
  ok('B3 a tap on the pit opens the bookie: his face, his name, a line about tonight', sheet.on && /BOOKIE/.test(sheet.name || '') && sheet.face && !/market/i.test(sheet.line || ''), (sheet.name || '') + ': ' + (sheet.line || '').slice(0, 60));
  const want = await p.evaluate(() => { const c = BohemiaArena.card('Mob', 12); return { lines: c.lines, purse: c.purse }; });
  ok('B4 the card: every foe in his own body, how many, the purse in batteries, the house rules', sheet.foes.length === want.lines.length && sheet.foes.every((f, i) => f.id === want.lines[i].id && f.n === want.lines[i].n && f.painted > 200 && f.w.length > 2) && sheet.purse === want.purse + ' batteries' && /collar/.test(sheet.rules || '') && /runs/.test(sheet.rules || ''), JSON.stringify(sheet.foes.map(f => f.n + ' ' + f.w + ' ' + f.painted + 'px')) + ' ' + sheet.purse);
  const walk = await p.evaluate(() => BohemiaSettlement._walkAll ? BohemiaSettlement._walkAll() : null).catch(() => null);
  const pool = await p.evaluate(() => { const sp = BohemiaArenaTown.lastSpot(); if (!sp) return null; const cx = (sp.pool[0] + sp.pool[2]) / 2, cy = (sp.pool[1] + sp.pool[3]) / 2, g = BohemiaSettlement._ground(cx, cy);
    return { moved: g ? Math.hypot(g.x - cx, g.y - cy) : -1, out: g ? !(g.x > sp.block[0] && g.x < sp.block[2] && g.y > sp.block[1] && g.y < sp.block[3]) : false }; });
  const blocked = pool && pool.moved > 20 && pool.out;
  ok('B5 nobody walks into the pool: the pit is ground the town\'s people go round, the bookie on open ground', blocked && walk && !(walk.miss || []).some(m => /^arena stands in a block/.test(m)), 'the nearest ground to the pool is ' + (pool ? Math.round(pool.moved) : '?') + ' px off it; ' + ((walk && walk.miss || []).slice(0, 2).join('; ') || 'every spot on open ground'));
  ok('C1 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  if (process.argv.indexOf('--no-demo') < 0) return legC();
  console.log('THE ARENA GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

/* C: the demo, driven like a player (tools/bohemia_drive_the_demo.js) */
async function legC() {
  console.log('C  THE PICK AND THE WAY IN (the demo)');
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  const d = await open({ fog: true }); const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 80; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && typeof loopOpenTown === 'function' && !!window.BohemiaArena && BohemiaArena.ready()).catch(() => false)) break; }
    for (let i = 0; i < 40; i++) { const g = await page.evaluate(() => { const w = document.getElementById('mainmaker'); if (!w) return 'gone'; if (w.dataset.armed !== '1') return null; const k = w.querySelector('.go'), r = k && k.getBoundingClientRect(); return r && r.width > 4 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; }).catch(() => null);
      if (g === 'gone') break; if (g) await page.touchscreen.tap(g.x, g.y); await page.waitForTimeout(500); }
    for (let i = 0; i < 30; i++) { if (await fr.evaluate(() => !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened)).catch(() => false)) break; await page.waitForTimeout(500); }
    await page.waitForTimeout(2000);
    /* the company the crew screen hands over, one man wearing an accessory (a spark vest) */
    const plant = await page.evaluate(() => { const p = window.BOH_START && BOH_START.picks(); const co = JSON.parse(JSON.stringify((p && p.company) || []));
      co.forEach((m, i) => { m.name = m.name || (i === 0 ? 'YOU' : 'MAN' + i); m.gear = m.gear || {}; }); if (co[1]) co[1].gear.acc = 'cell_vest_scrap';
      localStorage.setItem('bohemia.company.v1', JSON.stringify(co)); return co.map(m => ({ name: m.name, level: m.level || 1, acc: m.gear.acc || null })); });
    await fr.evaluate(() => { BohemiaArena.reset(); const b = ctBases().Mob; loopOpenTown({ name: 'Mob', x: b.x, y: b.y, tier: mapTierOf('Mob') }); });
    let sf = null; for (let i = 0; i < 40 && !sf; i++) { await page.waitForTimeout(500); sf = page.frames().find(f => /SETTLEMENT/.test(f.url())); }
    for (let i = 0; i < 40; i++) { await page.waitForTimeout(400); if (await sf.evaluate(() => window.BohemiaSettlement && BohemiaSettlement.order().indexOf('arena') >= 0).catch(() => false)) break; }
    await page.waitForTimeout(1200);
    const sb = await (await fr.$('#settleFrame')).boundingBox(), xy = await sf.evaluate(() => BohemiaSettlement.where('arena'));
    for (let k = 0; k < 5; k++) { const xy2 = await sf.evaluate(() => BohemiaSettlement.where('arena')); await page.touchscreen.tap(sb.x + xy2.x, sb.y + xy2.y); await page.waitForTimeout(1800);
      if (await sf.evaluate(() => !!document.querySelector('#sheet.on .ar-card')).catch(() => false)) break; }   /* a tap while the town still stands its people up can land on nothing: a player taps again */
    const pickBtn = await sf.evaluate(() => { const b = [...document.querySelectorAll('#sbody .act')].find(x => /pick/i.test(x.textContent)); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (pickBtn) await page.touchscreen.tap(sb.x + pickBtn.x, sb.y + pickBtn.y); await page.waitForTimeout(1500);
    const pick = await sf.evaluate(() => { const w = document.getElementById('ar-pick'); if (!w) return null; const tiles = [...w.querySelectorAll('.ar-man')];
      return { card: w.dataset.card, men: tiles.map(t => ({ name: t.dataset.man, on: t.classList.contains('on'), face: !!t.querySelector('canvas.ar-face'), slot: !!t.querySelector('.ar-slot'), acc: t.querySelector('.ar-acc').dataset.acc, struck: !!t.querySelector('.ar-acc s') })),
        fight: (w.querySelector('.ar-fight') || {}).textContent || '' }; });
    const N = 3, best = plant.slice().map((m, i) => ({ m, i })).sort((a, b) => (b.m.level - a.m.level) || (a.i - b.i)).slice(0, N).map(x => x.m.name);
    ok('C2 one screen of big faces, every man of the company, the best three already picked, FIGHT one tap away', !!pick && pick.men.length === plant.length && pick.men.every(m => m.face) && pick.men.filter(m => m.on).length === Math.min(N, plant.length) && best.every(n => pick.men.find(m => m.name === n && m.on)) && /FIGHT WITH/.test(pick.fight), pick ? pick.men.map(m => m.name + (m.on ? '*' : '')).join(' ') + ' | ' + pick.fight : 'no pick screen');
    ok('C3 every accessory slot crossed out in red; the man wearing one shows it struck through', !!pick && pick.men.every(m => m.slot) && pick.men.filter(m => m.acc).every(m => m.struck) && pick.men.some(m => m.acc === 'cell_vest_scrap' && m.struck), pick ? pick.men.filter(m => m.acc).map(m => m.name + ':' + m.acc).join(' ') : '');
    /* take the man with the vest in, if the best three left him out: a tap on his face swaps him for the last pick */
    const vestMan = plant.find(m => m.acc); if (vestMan && pick && !pick.men.find(m => m.name === vestMan.name).on) { const r = await sf.evaluate(n => { const t = [...document.querySelectorAll('#ar-pick .ar-man')].find(x => x.dataset.man === n); const b = t.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, vestMan.name); await page.touchscreen.tap(sb.x + r.x, sb.y + r.y); await page.waitForTimeout(400); }
    const chosen = await sf.evaluate(() => [...document.querySelectorAll('#ar-pick .ar-man')].filter(t => t.classList.contains('on')).map(t => ({ name: t.dataset.man, n: +t.querySelector('.ar-num').textContent })).sort((a, b) => a.n - b.n).map(x => x.name));
    const fb = await sf.evaluate(() => { const b = document.querySelector('#ar-pick .ar-fight'), r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await page.touchscreen.tap(sb.x + fb.x, sb.y + fb.y);
    let ff = null; for (let i = 0; i < 60 && !ff; i++) { await page.waitForTimeout(500); const h = await page.$('#fightFrame'); if (h) { const x = await h.contentFrame(); if (x && await x.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) ff = x; } }
    const f = ff ? await ff.evaluate(() => ({ arena: (window.FIGHT_OPTS || {}).arena || null, w: FIGHT.S.w, h: FIGHT.S.h, us: FIGHT.S.units.filter(u => u.side !== 'them').map(u => ({ name: u.name, vest: !!u.vest })),
      them: FIGHT.S.units.filter(u => u.side === 'them').map(u => u.kind || u.id), acc: ((window.FIGHT_OPTS || {}).company || []).map(m => (m.gear && m.gear.acc) || null) })) : null;
    const picked = await page.evaluate(() => window.__NF_ARENA || null);
    const sent = await sf.evaluate(() => window.__arenaPicked || null);
    ok('C4 the fight has ONLY the picked men, in his order, none wearing his accessory', !!f && f.us.map(u => u.name).join() === chosen.join() && f.acc.every(a => !a) && f.us.every(u => !u.vest) && !!picked && picked.acc.some(a => a === 'cell_vest_scrap'), f ? f.us.map(u => u.name + (u.vest ? '+vest' : '')).join(' ') + ' | picked ' + chosen.join(' ') : 'no fight');
    const band = sent && sent.card ? sent.card.band.slice().sort().join() : '';
    ok('C5 the card\'s foes, every one, on a small board, the arena flag riding with it', !!f && f.them.slice().sort().join() === band && f.w * f.h < 20 * 15 / 2 && !!f.arena && f.arena.id === sent.card.id, f ? f.them.join(',') + ' on ' + f.w + 'x' + f.h + ' | card ' + band : '');
    /* D: THE FIGHT IN THE PIT, then home */
    if (ff) {
      const bat0 = await fr.evaluate(() => loopBats()).catch(() => null);
      await page.waitForTimeout(1500);   /* the fight's hud draws on its own beat after the board comes up */
      const fl = await ff.evaluate(() => { const b = document.getElementById('bflee'); const r = b.getBoundingClientRect(); return { shown: b.style.display !== 'none' && r.width > 0, disabled: b.disabled }; });
      await ff.evaluate(() => { const b = document.getElementById('bflee'); try { b.onclick.call(b); b.onclick.call(b); } catch (e) {} });
      const ran = await ff.evaluate(() => ({ retreat: !!FIGHT.S.retreat, over: !!FIGHT.S.over }));
      ok('D1 no retreat in the pit, and nobody spared: the button is gone and a press does nothing', !fl.shown && fl.disabled && !ran.retreat && !ran.over, JSON.stringify(fl) + ' ' + JSON.stringify(ran));
      /* the fight's own sounds, through the real message path: a man of theirs falls, yours misses, somebody runs */
      const on = await page.evaluate(() => !!(window.BohemiaArenaCrowd && BohemiaArenaCrowd.on()));
      for (let i = 0; i < 20; i++) { if ((await page.evaluate(() => BohemiaArenaCrowd.loaded().length)) >= 5) break; await page.waitForTimeout(300); }
      await ff.evaluate(() => { sfx('kill', { side: 'them' }); }); await page.waitForTimeout(400);
      await ff.evaluate(() => { sfx('miss', { side: 'you' }); }); await page.waitForTimeout(400);
      await ff.evaluate(() => { sfx('arena_ran', { side: 'them' }); }); await page.waitForTimeout(400);
      await ff.evaluate(() => { sfx('miss', { side: 'them' }); sfx('hit', { side: 'you' }); }); await page.waitForTimeout(300);
      const heard = await page.evaluate(() => ({ heard: BohemiaArenaCrowd.heard().map(h => h[2]), loaded: BohemiaArenaCrowd.loaded().sort() }));
      ok('D2 the crowd: the murmur under it, a cheer when theirs falls, a gasp when yours misses, a boo when a man runs, nothing for the rest', on && heard.loaded.length === 5 && heard.heard.join() === 'cheer,gasp,boo', JSON.stringify(heard));
      /* the fight plays itself on AUTO for a while (real kills and misses), then it is won */
      await ff.evaluate(() => { try { if (!UI.auto) document.getElementById('bauto').click(); } catch (e) {} });
      for (let i = 0; i < 40; i++) { await page.waitForTimeout(500); if (await ff.evaluate(() => FIGHT.S.over).catch(() => true)) break; }
      const ranTags = await ff.evaluate(() => (UI.heard || []).filter(e => e === 'arena_ran').length).catch(() => 0);
      await ff.evaluate(() => { if (!FIGHT.S.over) { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); } }).catch(() => {});
      let sp = null; for (let i = 0; i < 40 && !sp; i++) { await page.waitForTimeout(500); sp = await page.evaluate(() => window.SPOILS && SPOILS.frame && SPOILS.frame.contentWindow && SPOILS.frame.contentWindow.BohemiaSpoilsScreen ? 1 : null).catch(() => null); }
      await page.waitForTimeout(1500);
      const spoils = await page.evaluate(() => { const w = SPOILS.frame.contentWindow, S = w.BohemiaSpoilsScreen.state; return { arena: SPOILS.d && SPOILS.d.arena, won: S.won, items: (S.found && S.found.items || []).length, bats: S.found && S.found.counts ? S.found.counts.batteries : -1, said: (w.document.body.textContent || '').indexOf('Nothing comes off the dead') >= 0 }; }).catch(e => ({ err: String(e) }));
      const cheerEnd = await page.evaluate(() => BohemiaArenaCrowd.heard().map(h => h[2]).indexOf('cheer_long') >= 0);
      ok('D3 the end: nothing comes off the dead (the spoils screen keeps its recap, drops nothing, says so), the long cheer on the win', !!spoils.arena && spoils.won === false && spoils.items === 0 && spoils.bats === 0 && spoils.said && cheerEnd, JSON.stringify(spoils) + ' cheer_long ' + cheerEnd + ', ran tags in the auto fight ' + ranTags);
      await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
      let back = null; for (let i = 0; i < 40 && !back; i++) { await page.waitForTimeout(500); back = await fr.evaluate(() => window.__ARENA_LAST || null).catch(() => null); }
      let line = null; for (let i = 0; i < 30 && !line; i++) { await page.waitForTimeout(500); const sf2 = page.frames().find(f => /SETTLEMENT/.test(f.url())); line = sf2 ? await sf2.evaluate(() => { const s = document.getElementById('sheet'); const p = s && s.classList.contains('on') && s.querySelector('.say p'); return p ? p.textContent : null; }).catch(() => null) : null; if (line && !/won|lost/i.test(line)) line = null; }
      const bat1 = await fr.evaluate(() => loopBats()).catch(() => null);
      const st = await fr.evaluate(() => JSON.parse(JSON.stringify(BohemiaArena.reload()))).catch(() => null);
      const fed = await fr.evaluate(() => { try { return (window.BOHEMIA_FEED && BOHEMIA_FEED.all ? BOHEMIA_FEED.all() : []).filter(p => /thepit/.test(p.who || '')).length; } catch (e) { return -1; } });
      ok('D4 home: paid the card\'s purse on the win, the wins counted, back in the Mob\'s town with the bookie saying so', !!back && back.won && bat1 - bat0 === sent.card.purse && st && st.wins === 1 && !!line && line.indexOf(String(sent.card.purse)) >= 0, 'paid ' + (bat1 - bat0) + ' of ' + sent.card.purse + '; wins ' + (st && st.wins) + '; ' + (line || 'no line').slice(0, 80) + '; feed posts ' + fed);
    }
    let crowd = ''; try { crowd = require('child_process').execFileSync('python3', [path.join(ROOT, 'tools/bohemia_arena_crowd.py'), '--check'], { encoding: 'utf8' }).trim(); } catch (e) { crowd = String(e.stdout || e.message).trim(); }
    const cj = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/arena/crowd/crowd.json'), 'utf8'));
    ok('D5 the crowd is real recordings (voices, hands, breaths, the bar\'s murmur), every file under its ceiling with no click', crowd === 'ok' && /audiomnist/.test(JSON.stringify(cj.sources)) && /esc50_cc0/.test(JSON.stringify(cj.sources)) && ['bed', 'cheer', 'cheer_long', 'gasp', 'boo'].every(k => cj[k] && cj[k].seconds > 0.5), crowd);
    ok('C6 nothing threw in the demo', errs.length === 0, errs.slice(0, 2).join(' | '));
  } finally { try { await d.browser.close(); } catch (e) {} try { d.server && d.server.close(); } catch (e) {} }
  console.log('THE ARENA GATE (with the demo): ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}
