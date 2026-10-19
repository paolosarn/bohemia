/* ONE MAN, ONE LOOK (RUN TWO [eyes: one man, one look], 10/19/26; EYES AND EARS [every face beside its body], rule 120(d);
   his 10/18: 'the portraits don't look like the people').
   EYES measured 10 of 11 crew men wearing another man's face: the crew screen (engine/bohemia_roster.js manOf) walked
   fight_people.json's cast order, the fight walked ours.json people_looks.crew, and the two orders differ. On his phone's
   profile, with the real pages:
     - CONTROL: the old rule, read off the same two files, disagrees for 10 of 11 (so this gate can go red)
     - the crew screen and the fight, each left to itself, dress the twelve alike (12 of 12), and the crew screen draws
       each man's face from that look
     - the company the crew screen hands (bohemia.company.v1, company()) carries each man's look, and the fight dresses
       him in it: in the same order, in a new order (a man never moves into another body), and for a man hired at the
       hall in the look he had there
   Run: node gates/one_man_one_look_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8879;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
(async () => {
  /* CONTROL: the old rule off the files */
  const ours = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8'));
  const fp = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_people/fight_people.json'), 'utf8'));
  const crewDefs = ours.crew.value, fightList = (ours.people_looks.value || ours.people_looks).crew;
  const casts = Object.keys(fp.looks).filter(l => /^cast_/.test(l));
  const oldOff = crewDefs.filter((c, i) => !c.main && casts[i % casts.length] !== fightList[i % fightList.length]).length;
  ok('CONTROL: the old crew-screen rule disagrees with the fight for most of the crew (the defect EYES read)', oldOff >= 8, oldOff + ' of ' + crewDefs.filter(c => !c.main).length + ' men');

  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  let chromium; try { chromium = require('playwright').chromium; } catch (e) { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = [];
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push('roster: ' + e.message));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready && BohemiaRosterScreen.state.crew.length > 0, null, { timeout: 30000 });
  await p.waitForTimeout(400);
  const screen = await p.evaluate(() => BohemiaRosterScreen.state.crew.map(m => ({ name: m.name, look: m.look })));
  const drawn = await p.evaluate(() => Array.from(document.querySelectorAll('canvas[data-face][data-look]')).map(c => c.dataset.look));
  const company = await p.evaluate(() => BohemiaRosterScreen.company());
  /* a man hired at the hall, in the look he had there */
  const hired = await p.evaluate(() => { const m = BohemiaRoster.manOf({ name: 'GATE HIRED', background: 'farmhand', jobs: [], look: 'cast_cape' }, BohemiaRosterScreen.state.crew.length);
    return BohemiaRoster.company([m])[0]; });

  const fight = async (co) => {
    const f = await ctx.newPage(); f.on('pageerror', e => errs.push('fight: ' + e.message));
    await f.addInitScript(c => { window.FIGHT_OPTS = c ? { seed: 3, speed: 1, company: c } : { seed: 3, speed: 1 }; }, co || null);
    await f.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_FIGHT.html');
    await f.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length, null, { timeout: 60000 });
    const u = await f.evaluate(() => FIGHT.S.units.filter(x => x.side === 'you').map(x => ({ name: x.name, look: x.look })));
    await f.close(); return u;
  };
  const byName = list => { const o = {}; list.forEach(x => { o[x.name] = x.look; }); return o; };
  const lone = await fight(null), L = byName(lone);
  const same = screen.filter(m => L[m.name] && L[m.name] === m.look);
  ok('the crew screen and the fight, each left to itself, dress every man alike', screen.length >= 12 && same.length === screen.length,
     same.length + ' of ' + screen.length + (same.length < screen.length ? ': ' + screen.filter(m => L[m.name] !== m.look).slice(0, 3).map(m => m.name + ' ' + m.look + '/' + L[m.name]).join(', ') : ''));
  ok('  and the crew screen draws each man\'s face from his own look', drawn.length >= 12 && drawn.every(l => screen.some(m => m.look === l)) && screen.every(m => drawn.indexOf(m.look) >= 0), drawn.length + ' faces on the screen');
  ok('the company the crew screen hands carries every man\'s look', company.length >= 12 && company.every(m => !!m.look) && company.every(m => screen.some(s => s.name === m.name && s.look === m.look)), company.length + ' men');
  const handed = byName(await fight(company));
  const kept = company.filter(m => handed[m.name] === m.look);
  ok('  the fight dresses each man the company hands in his look', kept.length === company.length, kept.length + ' of ' + company.length);
  const shuffled = [company[0]].concat(company.slice(1).reverse());
  const re = byName(await fight(shuffled));
  const still = shuffled.filter(m => re[m.name] === m.look);
  ok('  in a new order no man moves into another body', still.length === shuffled.length, still.length + ' of ' + shuffled.length);
  const withHire = byName(await fight(company.slice(0, 5).concat([hired])));
  ok('  a man hired at the hall fights in the look he had there', hired.look === 'cast_cape' && withHire['GATE HIRED'] === 'cast_cape', 'GATE HIRED -> ' + withHire['GATE HIRED']);
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nONE MAN, ONE LOOK: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
