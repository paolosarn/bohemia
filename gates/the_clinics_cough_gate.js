/* THE CLINIC'S COUGH (RUN TWO [the clinic's cough], 10/18/26).
   The row: the wiki's Sickness card makes medicine the dear thing, but the clinic still treated a laid-up man at the same
   price and speed while its keeper said 'no room'; Battle Brothers' temple has no queue, so the words and the numbers
   disagreed. END STATE: in a sick town the clinic's keeper turns the treatment down in words, or treats at the card's
   price, one or the other, the words and the price agreeing; a gate opens the clinic sick and well and reads both. The
   temple formula stays the wiki's (injuries.json).
   HOW BATTLE BROTHERS DOES IT: the temple's price is 20 x the treatment multiplier x the SETTLEMENT'S prices multiplier x
   the days x (1 + 0.2 a level) (injuries.json, from the wiki), and the Sickness card moves food and medicine prices and the
   recruits, not the settlement's multiplier: the temple treats you at the usual price, no queue. So the keeper's words move
   to the numbers, never the other way, and no new number is made (TUNING owns them).
     THE CARD    settlement_traits.json sickness equals the library's own page 1792: +100% food, +200% medicine buying,
                 -25% recruits (ECONOMY day 71 read 'the card's only price is medicine' and missed the food line)
     THE CLINIC  on his phone's profile, the same hurt man at the same place and day, sick and well: the treatment costs the
                 same and halves the days the same; the sick keeper speaks first under a fresh talking face, says the cots
                 are full of the cough and that yours still come first, and never says there is no room; treating works
     THE STALL   sick: the ration two batteries, the dose three (the card), well: one and one
   Run: node gates/the_clinics_cough_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process'), os = require('os');
const ROOT = path.dirname(__dirname), PORT = 8897;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const NO_ROOM = /no room|no space|can(no|')t take|not taking|turn(ing)? (you|them) (away|down)|full up/i;

/* ---------- THE CARD ---------- */
const TR = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/settlement_traits.json'), 'utf8'));
const sick = TR.traits.find(t => t.id === 'sickness') || {};
let page = '';
try {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wiki-'));
  cp.execFileSync('tar', ['-xzf', path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz'), '-C', tmp, 'bb_all/1792_Sickness (Settlement Situation).txt']);
  page = fs.readFileSync(path.join(tmp, 'bb_all/1792_Sickness (Settlement Situation).txt'), 'utf8'); fs.rmSync(tmp, { recursive: true, force: true });
} catch (e) {}
const pct = re => { const m = page.match(re); return m ? +m[1].replace('−', '-') : null; };
const card = { food: pct(/\+?(\d+)%<\/span> food prices/), meds: pct(/\+?(\d+)%<\/span> medicine buying/), men: pct(/([−-]?\d+)%<\/span> recruits/) };
ok('the sickness card is the library\'s page 1792: food +100%, medicine buying +200%, recruits -25%', page.length > 0 && card.food === 100 && card.meds === 200 && card.men === -25
   && sick.food_buy_mult === 1 + card.food / 100 && sick.medicine_buy_mult === 1 + card.meds / 100 && sick.recruits_mult === 1 + card.men / 100 && !('price_mult' in sick) && !('buy_mult' in sick),
   JSON.stringify(card) + ' vs ' + [sick.food_buy_mult, sick.medicine_buy_mult, sick.recruits_mult].join('/'));
ok('  and the sick clinic keeper\'s own line never says there is no room', !!(sick.says && sick.says.clinic) && !NO_ROOM.test(sick.says.clinic), sick.says && sick.says.clinic);
ok('CONTROL: the no-room reader catches the old line', NO_ROOM.test('Half the block is on my cots already. I have no room for anything new.'));

/* ---------- LIVE ---------- */
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = [];
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await p.waitForTimeout(900);
  const close = async () => { if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(220); } };
  const MAN = { name: 'Tavo', injury: 'broken_arm', days: 12, level: 3 };
  const visit = async traits => { await close(); await p.evaluate(t => BohemiaSettlement.open({ place: { name: 'CLINIC TOWN', tier: 'town' }, day: 4, traits: t, batteries: 400, wounded: [Object.assign({}, { name: 'Tavo', injury: 'broken_arm', days: 12, level: 3 })] }), traits); await p.waitForTimeout(300); };
  const tap = async k => { await close(); const xy = await p.evaluate(k => BohemiaSettlement.where(k), k); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(150);
    return p.evaluate(() => new Promise(res => { const w = document.querySelector('#sheet.on .who'), c = w && w.querySelector('canvas.face'), seen = new Set(), t0 = performance.now();
      const iv = setInterval(() => { if (c && c.dataset.mouth) seen.add(c.dataset.mouth); if (performance.now() - t0 > 1200) { clearInterval(iv);
        res({ line: w ? (w.querySelector('.say p') || {}).textContent : '', face: c ? c.dataset.face : 'NOFACE', mouths: [...seen].filter(m => m !== 'rest').length,
              acts: [...document.querySelectorAll('#sheet.on .acts .act')].map(x => ({ t: x.textContent.replace(/\s+/g, ' ').trim(), l: (x.querySelector('span') || {}).textContent || '', r: (x.querySelector('em') || {}).textContent || '', off: x.disabled })) }); } }, 40); })); };
  const treat = r => r.acts.find(a => /^Treat Tavo/.test(a.t)) || null;
  const priceOf = a => a ? +((a.r.match(/(\d+) batt/) || [])[1]) : null, daysTo = a => a ? +((a.l.match(/days to (\d+)/) || [])[1]) : null;
  await visit([]); const well = await tap('clinic'); const wellStall = await tap('stall');
  await visit(['sickness']); const ill = await tap('clinic'); const illStall = await tap('stall');
  const tw = treat(well), ts = treat(ill);
  ok('the same hurt man costs the same and heals the same, sick or well (the temple formula on the settlement\'s prices)', !!tw && !!ts && priceOf(tw) === priceOf(ts) && daysTo(tw) === daysTo(ts) && priceOf(tw) > 0,
     (tw && tw.l + ' = ' + tw.r) + ' | ' + (ts && ts.l + ' = ' + ts.r));
  ok('  in the sick town the keeper says it first, under a fresh talking face: the cots are full of the cough, yours still come first', /cough/i.test(ill.line) && /first/i.test(ill.line) && ill.face === 'fresh' && ill.mouths >= 2, ill.line + ' | ' + ill.face);
  ok('  and never that there is no room, while the treat button stands open', !NO_ROOM.test(ill.line) && ts && !ts.off, ill.line);
  await tap('clinic');
  await p.evaluate(() => { const b = [...document.querySelectorAll('#sheet.on .acts .act')].find(x => /^Treat Tavo/.test(x.textContent.trim())); if (b) b.click(); }); await p.waitForTimeout(250);
  const after = await p.evaluate(() => (document.querySelector('#sheet.on .who .say p') || {}).textContent || '');
  ok('  and treating works: he stays, the days halved', /Tavo stays with me/.test(after) && /6 days instead of 12/.test(after), after);
  const food = s => +((s.acts.find(a => /ration of food/i.test(a.t)) || { t: '' }).t.match(/(\d+) batter/) || [])[1], meds = s => +((s.acts.find(a => /dose of meds/i.test(a.t)) || { t: '' }).t.match(/(\d+) batter/) || [])[1];
  ok('the stall reads the card: sick, the ration 2 and the dose 3; well, 1 and 1', food(illStall) === 2 && meds(illStall) === 3 && food(wellStall) === 1 && meds(wellStall) === 1,
     'sick ' + food(illStall) + '/' + meds(illStall) + ', well ' + food(wellStall) + '/' + meds(wellStall));
  ok('no page errors', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE CLINIC\'S COUGH: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
