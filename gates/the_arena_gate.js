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
  console.log('THE ARENA GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
