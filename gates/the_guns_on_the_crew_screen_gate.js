/* THE GUNS ON THE CREW SCREEN GATE (RUN TWO, row [the guns on the crew screen], 10/22/26; rule 120(a): the company starts with
   guns; rule 83, Paolo 10/10: 'melee weapons work on one tile away, all guns 2+ minimum... the pistol is a two-tile gun, or a
   club at one'; rule 117: one look). Each man's gun in his slot with its reach in tiles and the rounds it holds going in,
   read the fight's way (BohemiaRoster.armOf over ours.json and weapons.json, the fight's own data):
     THE READING  every weapon row: a gun never reaches under ours.gun_min_range and strikes as a club at one; the pistol is
                  its shot's two to four with the shot's rounds; a one-shot gun holds one; a melee arm reaches from one
     THE SCREEN   on 390 x 844 every man's main slot with a weapon shows its reach (and its rounds when it has them), inside
                  the slot; his card says it long; the card never shows a second, contradicting reach
   Run: node gates/the_guns_on_the_crew_screen_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), vm = require('vm');
const ROOT = path.dirname(__dirname), PORT = 8873;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));

/* THE READING */
{
  const box = { window: {} }; box.window = box; vm.createContext(box);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/bohemia_roster.js'), 'utf8'), box);
  const C = box.BohemiaRoster, W = J('records/target/bb/weapons.json'), O = J('records/target/bb/ours.json');
  C.data.weapons = W; C.data.ours = O;
  const floor = O.gun_min_range.value, P = O.pistol_shot.value, guns = O.gun_classes.value, bad = [];
  W.rows.forEach(r => {
    const it = C.itemOf('weapon', r.id), a = C.armOf(it); if (!a) { bad.push(r.id + ' none'); return; }
    if (a.gun && (a.lo < floor || !a.club)) bad.push(r.id + ' gun under ' + floor + ' or no club');
    if (a.lo > a.hi) bad.push(r.id + ' lo over hi');
    if (r.class === P.class && P.by_row[r.id]) {
      const s = W.rows.find(x => x.id === P.by_row[r.id]), mag = Number(String(s.ammo).match(/\d+/)[0]);
      if (!(a.lo === 2 && a.hi === 4 && a.rounds === mag)) bad.push(r.id + ' pistol ' + JSON.stringify(a));
    } else if (guns.indexOf(r.class) >= 0 && (r.skills || []).some(k => /^Reload/.test(k.name)) && a.rounds !== 1) bad.push(r.id + ' one-shot ' + a.rounds);
    if (['bow', 'crossbow', 'firearm', 'throwing'].indexOf(r.class) < 0 && !(r.class === P.class && P.by_row[r.id]) && a.lo !== 1) bad.push(r.id + ' melee from ' + a.lo);
  });
  ok('every weapon reads the fight\'s way (' + W.rows.length + ' rows)', bad.length === 0, bad.slice(0, 4).join('; '));
}

const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
  await p.waitForTimeout(800);
  /* ONE CREW SCREEN (RUN TWO, rule 147(b), 10/24): the rows are gone; a tap on each man's face on the line opens his page,
     and his main slot there says his gun the long way (REACH 2 TO 4 TILES, A CLUB AT 1; 5 ROUNDS, THEN RELOAD) */
  const men = await p.evaluate(() => [].slice.call(document.querySelectorAll('#lines .cell[data-man]')).map(c => +c.dataset.man));
  const rows = [];
  for (const i of men) {
    await p.locator('#lines .cell[data-man="' + i + '"]').first().click(); await p.waitForTimeout(120);
    rows.push(await p.evaluate(i => {
      const S = BohemiaRosterScreen.state, m = S.crew[i], it = m && m.gear.main, a = it && BohemiaRoster.armOf(it), e = document.querySelector('#card .gslot[data-slot=main]'), am = document.querySelector('#card .gslot[data-slot=ammo]');
      const arm = e && e.querySelector('b.arm:not(.rd)'), rd = am && am.querySelector('b.arm.rd');
      const inBox = (x, el) => { const box = el.getBoundingClientRect(), q = x.getBoundingClientRect(); return q.left >= box.left - 0.5 && q.right <= box.right + 0.5 && q.bottom <= box.bottom + 0.5 && x.scrollWidth <= x.clientWidth + 1; };
      const inside = (!arm || inBox(arm, e)) && (!rd || inBox(rd, am));
      return { name: m && m.name, weapon: !!a, reach: arm && arm.textContent, rounds: rd && rd.textContent, wantRounds: !!(a && a.rounds), inside, text: document.getElementById('card').innerText };
    }, i));
    /* his gun the long way: a tap on his main hand says it in the line */
    if (rows[rows.length - 1].weapon) { await p.click('#card .gslot[data-slot="main"]'); await p.waitForTimeout(120);
      rows[rows.length - 1].said = await p.evaluate(() => document.getElementById('said').textContent);
      await p.evaluate(() => BohemiaRosterScreen.cancel()); await p.waitForTimeout(80); }   /* Escape's own take-back: a second tap would take the gun off */
  }
  const armed = rows.filter(x => x.weapon);
  /* RE-AIMED UI 10/25 ([the company screen, Battle Brothers simple], rule 172): Battle Brothers' slots around him; the main hand
     shows the reach short, the AMMO slot what the gun holds going in, and a tap on the main hand says it the long way in the
     line (REACH 2 TO 4 TILES, A CLUB AT 1; 5 ROUNDS, THEN RELOAD) */
  ok('every armed man\'s main slot, on his page, shows his reach in tiles', armed.length > 0 && armed.every(x => /^\d+(-\d+)? TILES?$/.test(x.reach || '')), armed.map(x => x.reach).join(' | '));
  ok('and his AMMO slot the rounds his gun holds, when it holds any', armed.every(x => !!x.rounds === x.wantRounds), armed.map(x => x.rounds).join(','));
  ok('a pistol reads 2-4 TILES and 5 RDS, and a tap says REACH 2 TO 4 TILES, A CLUB AT 1 and 5 ROUNDS, THEN RELOAD', armed.some(x => x.reach === '2-4 TILES' && x.rounds === '5 RDS' && /REACH 2 TO 4 TILES, A CLUB AT 1/.test(x.said || '') && /5 ROUNDS, THEN RELOAD/.test(x.said || '')), armed.map(x => x.said).filter(Boolean)[0]);
  ok('every line inside its slot on 390 x 844', armed.every(x => x.inside), armed.filter(x => !x.inside).map(x => x.name).join(','));
  ok('his page and the line say it with no second reach', armed.every(x => !/reach \d/.test(x.text) && !/reach \d/.test(x.said || '')), armed.filter(x => /reach \d/.test(x.text + (x.said || ''))).map(x => x.name).join(','));
  ok('nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE GUNS ON THE CREW SCREEN: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate itself threw  [' + e.message + ']'); process.exit(1); });
