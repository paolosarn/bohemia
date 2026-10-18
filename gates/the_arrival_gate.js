/* THE ARRIVAL (RUN TWO, row [the arrival], 10/18/26).
   THE OVERWORLD IS BATTLE BROTHERS: a place is a settlement screen, and Battle Brothers tells you where you are and what the
   town thinks of you before you touch it. Played on his phone's profile (390x844 at 3x) through the screen's own door
   (BOHEMIA_SETTLEMENT_OPEN, the message the game sends): three arrivals, a raided camp that hates you, a town on market day
   held by a faction that likes you, a fortress with no trait the game never named an opinion for. For each: the torn tag
   carries the town's name and its tier and its traits; the place's elder speaks ONE line under a face that is drawn (never
   blank), the trait's own line when one stands, the tier's when none; the opinion bar sits on the wiki's band for the number
   handed (records/target/bb/relations.json; no number is the wiki's start, Neutral); the faction's name and colour when the
   game names one, nothing when it does not; all of it inside the glass; gone by itself after two seconds, the picture
   untouched; a tap skips it and opens no building; the same place again plays nothing; arrival:false plays nothing.
   Shot (with --shoot) in slices/vote/RUN2_THE_ARRIVAL_10_18.png, the three side by side.
   Run: node gates/the_arrival_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8879;
const { proofShot } = require(path.join(__dirname, '..', 'tools', 'bohemia_proof_shot.js'));
const SHOT = proofShot(path.join(ROOT, 'slices/vote/RUN2_THE_ARRIVAL_10_18.png'));
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const REL = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/relations.json'), 'utf8'));
const TR = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/settlement_traits.json'), 'utf8'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const bandOf = v => REL.bands.value.find(b => v >= b.lo && v <= b.hi + 0.999).id;
const traitSays = id => { const t = TR.traits.find(x => x.id === id); return t.says.board || t.says.any; };
const ARRIVALS = [
  { place: { name: 'Cactus Springs', tier: 'camp' }, traits: ['raided'], opinion: 15, faction: null, shot: 'camp' },
  { place: { name: 'The Wash, North Las Vegas', tier: 'town' }, traits: ['market_day'], opinion: 72, faction: { name: 'the Caravans', hex: '#6d5c42' }, shot: 'town' },
  { place: { name: 'Fort Apache Yard', tier: 'fortress' }, traits: [], shot: 'fortress' }];
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = [], missing = [];
  p.on('pageerror', e => errs.push(String(e.message)));
  p.on('response', r => { if (r.status() >= 400) missing.push(r.url()); });
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForTimeout(1200);
  ok('the page\'s own first open plays no arrival (the screen at rest)', await p.evaluate(() => !document.getElementById('arrive')));
  const send = o => p.evaluate(o => { window.__settleLog = []; window.postMessage(Object.assign({ type: 'BOHEMIA_SETTLEMENT_OPEN' }, o), '*'); }, o);
  const read = () => p.evaluate(() => {
    const a = document.getElementById('arrive'); if (!a) return null;
    const tag = a.querySelector('canvas.tag'), f = a.querySelector('.who canvas.face'), r = a.getBoundingClientRect();
    let ink = 0; if (f) { const d = f.getContext('2d').getImageData(0, 0, 64, 64).data; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) ink++; }
    const kids = [].slice.call(a.children).map(e => e.getBoundingClientRect());
    return { title: tag && tag.dataset.title, line: tag && tag.dataset.line, said: a.querySelector('.who p') && a.querySelector('.who p').textContent,
      who: a.querySelector('.who .nm') && a.querySelector('.who .nm').textContent, ink, band: a.dataset.band,
      bandWord: a.querySelector('.op .bandw').textContent, mark: parseFloat(a.querySelector('.op .rail b').style.left),
      fac: a.querySelector('.fac') ? a.querySelector('.fac').textContent : null,
      inside: kids.every(k => k.left >= 0 && k.right <= window.innerWidth + 0.5 && k.top >= r.top && k.bottom <= r.bottom + 0.5),
      sheet: document.getElementById('sheet').classList.contains('on'),
      posted: (window.__settleLog || []).filter(m => m.act === 'arrive').length };
  });
  const shots = [];
  for (const A of ARRIVALS) {
    const o = { place: Object.assign({ district: 'commercial' }, A.place), traits: A.traits };
    if (A.opinion !== undefined) o.opinion = A.opinion; if (A.faction) o.faction = A.faction;
    await send(o); await p.waitForTimeout(600);
    const r = await read();
    const nm = A.place.tier.toUpperCase() + ' ' + A.place.name;
    ok(nm + ': the arrival is over the picture', !!r);
    if (!r) continue;
    const tierWord = { camp: 'A CAMP', town: 'A TOWN', fortress: 'A FORTRESS' }[A.place.tier];
    ok('  the torn tag carries the town\'s name and its tier', r.title === A.place.name.toUpperCase() && r.line.indexOf(tierWord) === 0, r.title + ' / ' + r.line);
    ok('  and its traits, when one stands', A.traits.every(id => r.line.indexOf(TR.traits.find(x => x.id === id).name.toUpperCase()) >= 0) && (A.traits.length || r.line === tierWord), r.line);
    ok('  the elder speaks ONE line under a drawn face (never blank)', r.who === 'THE ELDER' && r.ink > 400 && r.said && r.said.split(/[.!?](\s|$)/).filter(s => s && s.trim()).length <= 2, r.ink + ' px of face: ' + r.said);
    ok('  the line is the trait\'s own when one stands, the tier\'s when none', A.traits.length ? r.said === traitSays(A.traits[0]) : (r.said && !TR.traits.some(t => Object.values(t.says).indexOf(r.said) >= 0)), r.said);
    const v = A.opinion === undefined ? REL.start.value : A.opinion;
    ok('  the opinion bar sits on the wiki\'s band for ' + v, r.band === bandOf(v) && r.bandWord === bandOf(v).replace(/_/g, ' ').toUpperCase() && Math.abs(r.mark - v) < 0.01, r.bandWord + ' at ' + r.mark);
    ok('  the faction shows only when the game names one', A.faction ? (r.fac && r.fac.indexOf(A.faction.name.toUpperCase()) >= 0) : r.fac === null, r.fac || 'none');
    ok('  everything sits inside the glass, and it told the game once', r.inside && r.posted === 1, 'posted ' + r.posted);
    const file = path.join(require('os').tmpdir(), 'run2_arrival_' + A.shot + '.png'); await p.screenshot({ path: file }); shots.push(file);
    await p.waitForTimeout(1800);
    const gone = await p.evaluate(() => ({ a: !!document.getElementById('arrive'), how: (window.__settleLog || []).filter(m => m.act === 'arrived').map(m => m.how) }));
    ok('  gone by itself at two seconds, the picture untouched', !gone.a && gone.how.join() === 'time', gone.how.join() || 'still up');
  }
  /* a tap skips, and opens no building */
  await send({ place: { name: 'Indian Springs', tier: 'town', district: 'commercial' }, traits: [] }); await p.waitForTimeout(400);
  const up = await p.evaluate(() => !!document.getElementById('arrive'));
  await p.touchscreen.tap(195, 420); await p.waitForTimeout(350);
  const sk = await p.evaluate(() => ({ a: !!document.getElementById('arrive'), sheet: document.getElementById('sheet').classList.contains('on'),
    how: (window.__settleLog || []).filter(m => m.act === 'arrived').map(m => m.how) }));
  ok('a tap skips it at once, and the tap opens no building', up && !sk.a && !sk.sheet && sk.how.join() === 'tap', sk.how.join());
  await send({ place: { name: 'Indian Springs', tier: 'town', district: 'commercial' } }); await p.waitForTimeout(300);
  ok('the same place again plays nothing', await p.evaluate(() => !document.getElementById('arrive')));
  await send({ place: { name: 'Goodsprings', tier: 'camp', district: 'commercial' }, arrival: false }); await p.waitForTimeout(300);
  ok('arrival:false plays nothing', await p.evaluate(() => !document.getElementById('arrive')));
  ok('every file the screen loads is there', missing.length === 0, missing.slice(0, 2).join(' '));
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  if (SHOT && shots.length === 3) {
    const c2 = await b.newContext({ viewport: { width: 1194, height: 844 }, deviceScaleFactor: 2 }); const sp = await c2.newPage();
    await sp.setContent('<body style="margin:0;background:#0b0907;display:flex;gap:12px">' + shots.map(f => '<img style="width:390px;height:844px" src="data:image/png;base64,' + fs.readFileSync(f).toString('base64') + '">').join('') + '</body>');
    await sp.waitForTimeout(200); await sp.screenshot({ path: SHOT }); console.log('  shot ' + path.relative(ROOT, SHOT));
  }
  await b.close(); srv.close();
  console.log('\n=== THE ARRIVAL: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
