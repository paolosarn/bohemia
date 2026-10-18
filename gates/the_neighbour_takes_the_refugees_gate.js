/* THE NEIGHBOUR TAKES THE REFUGEES (RUN TWO [the neighbour takes the refugees], 10/18/26).
   ECONOMY day 70 (4a): 'the raided town is not dearer, it is EMPTY... the dear town is the one NEXT to it, where the people
   went' (South Africa 2021, Los Angeles 1992). END STATE on the board: while a place stands RAIDED in the ledger, the
   nearest held place on the map's own distance reads the wiki's Refugees card (page 1660) on the same days, its elder
   saying where they came from; a gate raids one place and reads the neighbour. The card's numbers only; the neighbour from
   the map, never typed; FACTIONS' ledger read, never written.
     THE CARD    settlement_traits.json 'refugees' carries exactly the wiki page's numbers (read from the library's own
                 page): food available -25%, food prices +25%, items -10%; it is never rolled by the dice (the screen's and
                 the map's, 14 seats x 52 weeks)
     THE MAP     every town's nearest is the closest other seat on the map's own cells (the baked places, the map's
                 table); a raid on each seat in turn sends its people to exactly that one town, for exactly the raid's
                 days, never to itself, never to a second town
     LIVE        on his phone's profile: the Reds raid the Mob, and at the Network (the Mob's nearest) on day 4 the arrival
                 reads REFUGEES and the elder names the Mob's place and the Reds under a fresh face; the shelves are a
                 tenth thinner than the same visit calm; the hall's keeper says where the men walked from; on day 9 it is
                 over; the Reds' own town (not the nearest) reads nothing; the map handing its dice as traits beside the
                 ledger no longer switches the ledger off; the bar at the Church tells the Network's refugees after the raid
   Run: node gates/the_neighbour_takes_the_refugees_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process'), os = require('os');
const ROOT = path.dirname(__dirname), PORT = 8895;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };

/* ---------- THE CARD ---------- */
const TR = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/settlement_traits.json'), 'utf8'));
const card = TR.traits.find(t => t.id === 'refugees') || {};
let page = '';
try {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wiki-'));
  cp.execFileSync('tar', ['-xzf', path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz'), '-C', tmp, 'bb_all/1660_Refugees (Settlement Situation).txt']);
  page = fs.readFileSync(path.join(tmp, 'bb_all/1660_Refugees (Settlement Situation).txt'), 'utf8'); fs.rmSync(tmp, { recursive: true, force: true });
} catch (e) {}
const pct = re => { const m = page.match(re); return m ? +m[1].replace('−', '-') : null; };
const wiki = { foodAvail: pct(/([−-]?\d+)%<\/span> food available/), foodPrice: pct(/\+?(\d+)%<\/span> food prices/), items: pct(/([−-]?\d+)%<\/span> items available/) };
ok('the card is the wiki\'s Refugees page, read from the library: food available, food prices, items', page.length > 0 && wiki.foodAvail === -25 && wiki.foodPrice === 25 && wiki.items === -10
   && card.food_stock_mult === 1 + wiki.foodAvail / 100 && card.food_buy_mult === 1 + wiki.foodPrice / 100 && card.stock_mult === 1 + wiki.items / 100, JSON.stringify(wiki) + ' vs ' + [card.food_stock_mult, card.food_buy_mult, card.stock_mult].join('/'));
ok('  it is caused, never rolled, and its people say where they came from (every line carries {from})', card.caused_by === 'ledger_neighbour' && card.draft === true && Object.values(card.says || {}).length >= 5 && Object.values(card.says).every(l => /\{from\}/.test(l)));
const LM = require(path.join(ROOT, 'engine/bohemia_livingmap.js'));
const PL = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_BAR_NEWS_PLACES.json'), 'utf8')), places = PL.places;
let rolled = 0; places.forEach(p => { for (let w = 0; w < 52; w++) if (LM.traitsFor(TR, p.name, w * 7).some(t => t.id === 'refugees')) rolled++; });
ok('  the map\'s dice never roll it (14 seats x 52 weeks)', rolled === 0, rolled);

/* ---------- THE MAP ---------- */
const N = require(path.join(ROOT, 'slices/bohemia_bar_news.js'));
N.set(PL, JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/settlement_rumours.json'), 'utf8')).news);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const nearBad = places.filter(p => { const n = N.nearestTo(p); return !n || n === p || places.some(q => q !== p && dist(q, p) < dist(n, p)); }).map(p => p.id);
ok('every town\'s nearest is the closest other seat on the map\'s own cells', nearBad.length === 0, nearBad.join(' '));
const sendBad = [];
places.forEach(P => {
  const L = { marks: [{ place: P.id, trait: 'raided', by: 'Reds', party: 'p', from: 10, until: 13 }] }, near = N.nearestTo(P);
  places.forEach(Q => {
    for (const d of [9, 10, 12, 13]) {
      const r = N.refugeesAt({ here: { name: Q.name }, day: d, ledger: L }), want = Q === near && d >= 10 && d < 13;
      if (!!r !== want) sendBad.push(P.id + '->' + Q.id + '@' + d);
      if (r && (r.place !== P.name || r.by !== 'Reds')) sendBad.push(P.id + ' named ' + r.place);
    }
  });
});
ok('a raid on each seat in turn sends its people to exactly its nearest town, for exactly the raid\'s days, never itself', sendBad.length === 0, sendBad.slice(0, 4).join(' '));

/* ---------- LIVE ---------- */
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const RAID = { marks: [{ place: 'Mob', trait: 'raided', by: 'Reds', party: 'p1', from: 2, until: 9 }] };
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = [];
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && window.BohemiaBarNews && BohemiaBarNews.ready(), null, { timeout: 30000 });
  await p.waitForTimeout(400);
  const close = async () => { if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(220); } };
  /* the game's own door: the message the map posts, the arrival on */
  const arrive = async (name, day, ledger, traits) => {
    await close();
    await p.evaluate(([n, d, l, t]) => { const o = document.getElementById('arrive'); if (o) o.remove(); BohemiaSettlement.state.arrivedAt = null;
      const m = { type: 'BOHEMIA_SETTLEMENT_OPEN', place: { name: n, tier: 'town' }, day: d, ledger: l, ledgerPlace: n, traits: t }; window.postMessage(m, '*'); }, [name, day, ledger, traits]);
    await p.waitForFunction(() => !!document.querySelector('#arrive .who canvas.face'), null, { timeout: 8000 }).catch(() => {});
    await p.waitForTimeout(700);
    return p.evaluate(() => { const c = document.querySelector('#arrive .who canvas.face');
      return { tag: (document.querySelector('#arrive canvas.tag') || { dataset: {} }).dataset.line || '', elder: (document.querySelector('#arrive .say p') || {}).textContent || '',
               face: c ? c.dataset.face : 'NOFACE', ids: BohemiaSettlement.traitsNow(), stock: Object.values(BohemiaSettlement.state.stock || {}).reduce((a, x) => a + x.length, 0) }; });
  };
  const keeper = async k => { await p.evaluate(() => { const o = document.getElementById('arrive'); if (o) o.remove(); }); await close();
    const xy = await p.evaluate(k => BohemiaSettlement.where(k), k); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(200);
    return p.evaluate(() => ({ line: (document.querySelector('#sheet.on .who .say p') || {}).textContent || '', acts: [...document.querySelectorAll('#sheet.on .acts .act')].map(b => b.textContent.replace(/\s+/g, ' ').trim()) })); };
  const near = N.nearestTo(places.find(q => q.id === 'Mob')).name;
  const ref = await arrive(near, 4, RAID, []);
  ok('the Reds raid the Mob: at ' + near + ' (its nearest) on day 4 the arrival reads REFUGEES', /REFUGEES/.test(ref.tag) && ref.ids.indexOf('refugees') >= 0, ref.tag);
  ok('  and the elder names the Mob\'s place and the Reds, under a fresh face', /the Mob's place/.test(ref.elder) && /Reds/.test(ref.elder) && ref.face === 'fresh', ref.elder + ' | ' + ref.face);
  const hall = await keeper('hall');
  ok('  the hall\'s keeper says where the men walked from', /the Mob's place/.test(hall.line), hall.line);
  const calm = await arrive(near, 4, null, []);
  ok('  the shelves are a tenth thinner than the same visit calm (the card\'s -10% items)', ref.stock < calm.stock && calm.ids.indexOf('refugees') < 0, ref.stock + ' vs ' + calm.stock);
  /* the food price: one battery rounds a quarter away, so read it on a market day (x1.25 twice is 1.56, two batteries) */
  const food = s => +((s.acts.find(a => /ration of food/i.test(a)) || '').match(/(\d+) batter/) || [])[1];
  await arrive(near, 4, null, ['market_day']); const calmStall = await keeper('stall');
  await arrive(near, 4, RAID, ['market_day']); const stall = await keeper('stall');
  ok('  the stall\'s food is priced by the card, +25% on top of the day (a market day: 1 calm, 2 with the refugees)', food(calmStall) === 1 && food(stall) === 2, food(stall) + ' vs calm ' + food(calmStall));
  const over = await arrive(near, 9, RAID, []);
  ok('on day 9 the raid is over and so are the refugees', over.ids.indexOf('refugees') < 0 && !/REFUGEES/.test(over.tag), over.tag);
  const reds = await arrive('Reds', 4, RAID, []);
  ok('the Reds\' own town is not the Mob\'s nearest and reads nothing of it', reds.ids.indexOf('refugees') < 0, reds.ids.join(','));
  const mob = await arrive('Mob', 4, RAID, ['market_day']);
  ok('the map handing its dice beside the ledger no longer switches the ledger off: the Mob reads RAIDED and its market day', mob.ids.indexOf('raided') >= 0 && mob.ids.indexOf('market_day') >= 0 && mob.ids.indexOf('raided') < mob.ids.indexOf('market_day'), mob.ids.join(','));
  await arrive('Church', 4, RAID, []);
  const news = await p.evaluate(() => BohemiaBarNews.list({ here: { name: 'Church' }, day: 4, traits: null, ledger: { marks: [{ place: 'Mob', trait: 'raided', by: 'Reds', from: 2, until: 9 }] } }).slice(0, 2).map(i => i.place + ':' + i.trait + ':' + i.says));
  ok('the bar at the Church tells the raid, then where its people went', /^Mob:raided/.test(news[0] || '') && new RegExp('^' + near + ':refugees:.*the Mob\'s place').test(news[1] || ''), news.join(' || ').slice(0, 220));
  ok('no page errors', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE NEIGHBOUR TAKES THE REFUGEES: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
