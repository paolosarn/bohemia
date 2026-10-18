/* THE BAR NAMES THE NEWS (RUN TWO [the bar names the news], 10/18/26).
   ECONOMY day 75: the next town has news 94 percent of the time and the bar had never told one (it read eleven fixed
   lines, no other town). Battle Brothers: 'each time you visit the Tavern you get 1 free rumor' and, since 1.4, the
   rumours tell 'situations of nearby settlements' (wiki 1931 Tavern Rumors, Dev Blog 138). END STATE on the board: the
   keeper says one line naming one real piece of nearby news on each visit, from a mouth with a fresh portrait, the line
   drawn from the rumour data, nothing on a card. Rule 117: no new button, no number.
     THE PLACES  records/target/BOHEMIA_BAR_NEWS_PLACES.json is what tools/bohemia_run2_bar_news_places.py bakes, byte for
                 byte; every place is a seat the map's loop arrives at (CT_BASES_BAKED); the player's own slot is never told
     THE WORDS   settlement_rumours.json 'news' has a way to say every card the map's dice roll and every card FACTIONS'
                 ledger writes, each naming the town, draft:true, no digit in a mouth
     TRUE        over every seat and a year of weeks, every piece of news is exactly the map's own dice for that town on
                 that day (engine/bohemia_livingmap.js traitsFor, the roll the map hands the screen when you arrive), never
                 here, never a town the bar may not name; what really happened (the ledger) is told before the dice, the
                 nearest town before the far. CONTROL: a planted lie is caught by the same check.
     THE LEDGER  the Reds raid the Mob on day 2: at the Church on day 4 the first news is the Mob, the Reds, two nights back;
                 on day 9 it is over and not told
     LIVE        on his phone's profile with real taps: the bar's first line is the free one under the keeper's FRESH talking
                 face, nothing spent; the second time it is the round's offer; a round tells the NEXT town; no 'Marked on
                 your map'; a new visit brings a new free one; a raid handed by the map is told first; with the places
                 file blocked the bar still works
   Run: node gates/the_bar_names_the_news_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.dirname(__dirname), PORT = 8893;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const PLACES_F = path.join(ROOT, 'records/target/BOHEMIA_BAR_NEWS_PLACES.json');

/* ---------- THE PLACES ---------- */
const before = fs.readFileSync(PLACES_F, 'utf8');
const bake = cp.spawnSync('python3', [path.join(ROOT, 'tools/bohemia_run2_bar_news_places.py')], { cwd: ROOT, encoding: 'utf8' });
const after = fs.readFileSync(PLACES_F, 'utf8');
if (after !== before) fs.writeFileSync(PLACES_F, before);
ok('the places are what the bake makes from the city page, byte for byte', bake.status === 0 && after === before, (bake.stderr || '').trim().slice(0, 120) || (after === before ? 'same' : 'DRIFTED'));
const PL = JSON.parse(before), places = PL.places || [];
const bases = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8').match(/var CT_BASES_BAKED = (\{.*?\});/)[1]);
ok('every place is a seat the map\'s loop arrives at, where the map has it (' + places.length + ')', places.length === Object.keys(bases).length && places.every(p => bases[p.id] && bases[p.id].x === p.x && bases[p.id].y === p.y));
ok('  the player\'s own slot is a place you stand in, never a town the keeper talks about', places.filter(p => p.told === false).map(p => p.id).join() === 'Custom');

/* ---------- THE WORDS ---------- */
const RUM = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/settlement_rumours.json'), 'utf8'));
const TR = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/settlement_traits.json'), 'utf8'));
const N = require(path.join(ROOT, 'slices/bohemia_bar_news.js'));
const LM = require(path.join(ROOT, 'engine/bohemia_livingmap.js'));
const NEWS = RUM.news || {}, LINES = NEWS.lines || {};
const rolledIds = TR.traits.filter(t => !t.caused_by).map(t => t.id), causedIds = N.CAUSED;
const wordBad = [];
rolledIds.concat(causedIds).forEach(id => { if (!(LINES[id] || []).length) wordBad.push(id + ': no line'); (LINES[id] || []).forEach(l => {
  if (!/\{at\}|\{of\}|\{of_cap\}/.test(l)) wordBad.push(id + ': names no town'); if (/\d/.test(l)) wordBad.push(id + ': a digit'); }); });
if (!(LINES.quiet || []).length) wordBad.push('quiet: no line');
ok('a way to say every card the dice roll (' + rolledIds.join(', ') + ') and the ledger writes (' + causedIds.join(', ') + '), each naming the town, no digit', wordBad.length === 0, wordBad.slice(0, 3).join(' | '));
ok('  the words are draft (the attempt law) and the eleven old rumours are still there', NEWS.draft === true && (RUM.rumours || []).length === 11);

/* ---------- TRUE ---------- */
N.set(PL, NEWS);
const truth = (it, here, day) => {   /* the one check: the town is real, not here, and what is said is what the map's dice (or the ledger) hold */
  const p = places.find(q => q.name === it.place);
  if (!p || p.told === false || p.name === here) return 'not a town the bar may name: ' + it.place;
  if (it.caused) return null;
  const dice = LM.traitsFor(TR, p.name, day).map(t => t.id);
  if (dice[0] !== it.trait && !(dice.length > 1 && !LINES[dice[0]] && dice[1] === it.trait)) return it.place + ' told ' + it.trait + ', the dice say ' + (dice.join('+') || 'nothing');
  const words = [p.at, p.of, p.of.charAt(0).toUpperCase() + p.of.slice(1)];
  if (!words.some(w => it.says.indexOf(w) >= 0)) return it.place + ' not named in the line';
  return null;
};
let visits = 0, withNews = 0, told = 0, lies = [], order = [];
places.forEach(h => { for (let w = 0; w < 52; w++) {
  const day = w * 7 + (w % 7), L = N.list({ here: { name: h.name }, day, traits: TR });
  visits++; if (L.length) withNews++; told += L.length;
  L.forEach(it => { const e = truth(it, h.name, day); if (e) lies.push(h.name + ' d' + day + ': ' + e); });
  for (let i = 1; i < L.length; i++) if (L[i].dist < L[i - 1].dist) order.push(h.name + ' d' + day);
} });
ok('over ' + places.length + ' seats and 52 weeks every piece of news is the map\'s own dice for that town that day, never here, the town named', told > 0 && lies.length === 0, told + ' told' + (lies.length ? ', ' + lies.slice(0, 2).join(' | ') : ''));
ok('  a free one on (nearly) every visit, as Battle Brothers gives one every time', withNews / visits >= 0.9, withNews + ' of ' + visits + ' visits (' + (100 * withNews / visits).toFixed(1) + '%)');
ok('  the nearest town first', order.length === 0, order.slice(0, 3).join(' '));
const L0 = N.list({ here: { name: 'Church' }, day: 4, traits: TR })[0];
const lie = Object.assign({}, L0, { trait: L0.trait === 'sickness' ? 'market_day' : 'sickness' });
ok('CONTROL: a planted lie (the other card for the same town) is caught by the same check', !truth(L0, 'Church', 4) && !!truth(lie, 'Church', 4), truth(lie, 'Church', 4));

/* ---------- THE LEDGER ---------- */
const RAID = { marks: [{ place: 'Mob', trait: 'raided', by: 'Reds', party: 'p1', from: 2, until: 9 }] };
const r4 = N.list({ here: { name: 'Church' }, day: 4, traits: TR, ledger: RAID }), r9 = N.list({ here: { name: 'Church' }, day: 9, traits: TR, ledger: RAID });
ok('the Reds raid the Mob on day 2: at the Church on day 4 the first news is that raid, the Reds named, two nights back', r4[0] && r4[0].place === 'Mob' && r4[0].trait === 'raided' && /Reds/.test(r4[0].says) && /two nights back/.test(r4[0].says), r4[0] && r4[0].says);
ok('  on day 9 the raid is over and not told', !r9.some(it => it.trait === 'raided'));
const self = N.list({ here: { name: 'Mob' }, day: 4, traits: TR, ledger: RAID });
ok('  at the Mob itself the keeper does not tell the Mob its own raid as news from down the road', !self.some(it => it.place === 'Mob'));

/* ---------- LIVE ---------- */
let block = false;
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (block && /BOHEMIA_BAR_NEWS_PLACES\.json$/.test(u)) { rs.statusCode = 404; return rs.end(); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const READ = () => new Promise(res => {
  const w = document.querySelector('#sheet.on .who'), c = w && w.querySelector('canvas.face'), seen = new Set(), t0 = performance.now();
  const iv = setInterval(() => { if (c && c.dataset.mouth) seen.add(c.dataset.mouth); if (performance.now() - t0 > 1500) { clearInterval(iv);
    res({ line: w ? (w.querySelector('.say p') || {}).textContent : null, news: w ? w.dataset.news || null : null, face: c ? c.dataset.face : 'NOFACE',
          mouths: [...seen].filter(m => m !== 'rest').length, sheet: document.getElementById('sheet').textContent }); } }, 40);
});
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
  const tapBar = async () => { await close(); const xy = await p.evaluate(() => BohemiaSettlement.where('bar')); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(150); return p.evaluate(READ); };
  const visit = async o => { await close(); await p.evaluate(o => BohemiaSettlement.open(o), o); await p.waitForTimeout(300); };
  const want = N.list({ here: { name: 'Church' }, day: 4, traits: TR });
  await visit({ place: { name: 'Church', tier: 'town' }, day: 4, traits: [], batteries: 9 });
  const first = await tapBar();
  const posted = await p.evaluate(() => (window.__settleLog || []).filter(m => m.act === 'news').slice(-1)[0] || null);
  ok('the bar\'s first line this visit is the free news: the nearest town\'s true situation', first.line === want[0].says && first.news === want[0].id, first.line);
  ok('  under the keeper\'s FRESH portrait, the mouth moving while it is said', first.face === 'fresh' && first.mouths >= 2, first.face + ', ' + first.mouths + ' mouths');
  ok('  free: nothing spent, and the game hears it (act news, free)', posted && posted.free === true && posted.about === want[0].place && posted.batteries === 9, JSON.stringify(posted && { about: posted.about, batteries: posted.batteries }));
  const second = await tapBar();
  ok('the second time the bar opens it is the round\'s offer, the free one is not said twice', !second.news && /round/i.test(second.line), second.line);
  await p.click('#sheet .acts .act'); await p.waitForTimeout(250);
  const round = await p.evaluate(() => ({ line: (document.querySelector('#sheet.on .who .say p') || {}).textContent, sheet: document.getElementById('sheet').textContent }));
  ok('a round tells the NEXT town, a different place, before any of the old eleven', round.line === want[1].says && want[1].place !== want[0].place, round.line);
  ok('  and nothing promises a mark on the map that nobody draws', !/Marked on your map/i.test(round.sheet + first.sheet));
  await visit({ place: { name: 'Church', tier: 'town' }, day: 4, traits: [] });
  const again = await tapBar();
  ok('a new visit brings a new free one', again.news === want[0].id, again.line);
  await visit({ place: { name: 'Church', tier: 'town' }, day: 4, traits: [], ledger: RAID });
  const raid = await tapBar();
  ok('the raid the map hands in its ledger is told first, the Reds named', raid.news === 'news:Mob:raided' && /Reds/.test(raid.line), raid.line);
  await b.close();
  /* the places file blocked: the bar is the bar it was */
  block = true;
  const b2 = await chromium.launch(); const c2 = await b2.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const q = await c2.newPage(); q.on('pageerror', e => errs.push(e.message));
  await q.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await q.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await q.waitForTimeout(900);
  await q.evaluate(() => BohemiaSettlement.open({ place: { name: 'Church', tier: 'town' }, day: 4, traits: [] })); await q.waitForTimeout(300);
  const xy = await q.evaluate(() => BohemiaSettlement.where('bar')); await q.mouse.click(xy.x, xy.y); await q.waitForTimeout(200);
  const bare = await q.evaluate(() => ({ line: (document.querySelector('#sheet.on .who .say p') || {}).textContent, buy: !!document.querySelector('#sheet.on .acts .act') }));
  ok('with the places file blocked the bar still pours: the round\'s offer and its button', /round/i.test(bare.line || '') && bare.buy, bare.line);
  block = false;
  ok('no page errors', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b2.close(); srv.close();
  console.log('\nTHE BAR NAMES THE NEWS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
