/* THE ROSTER SCREEN GATE (RUN TWO, row [the roster screen], 10/9/26).
   Drives slices/BOHEMIA_ROSTER_SCREEN.html on his phone's profile (390x844 at 3x) with real drags
   and taps: the company in two lines of nine from the fight's starting crew, each drawn from the
   fight's own people sheets; a man's card (face, background, level, wage, eight stats with stars,
   four gear slots, perks, one pain line); drag a man from the front line to the back and the
   formation the fight reads changes; drag an item from the bag onto his main hand and he wears it,
   his old one goes back in the bag; tap a worn slot and it comes off. Shots in slices/vote/.
   Run: node gates/roster_screen_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8861;
/* PROOF SHOTS GO TO A SCRATCH FOLDER UNLESS ASKED (PLUMBER 10/9, [proof shots churn]): `--shoot` or BOHEMIA_SHOOT=1 writes the VOTE picture */
const { proofShot } = require(path.join(__dirname, '..', 'tools', 'bohemia_proof_shot.js'));
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const SHOT = proofShot(path.join(ROOT, 'slices/vote/RUN2_THE_ROSTER_10_9.png'));
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
  const p = await ctx.newPage();
  const errs = [], missing = [];
  p.on('pageerror', e => errs.push(String(e.message)));
  p.on('response', r => { if (r.status() >= 400) missing.push(r.url()); });
  /* a bag with one rifle in it, the way the market leaves it */
  await p.addInitScript(() => { try { localStorage.setItem('bohemia.formation.v1', 'null');
    localStorage.setItem('bohemia.bag.v1', JSON.stringify([{ id: 'light_crossbow', kind: 'weapon', name: 'solid rifle', was: 'Light Crossbow', price: 30, nums: 'dmg 30-50' }])); } catch (e) {} });
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
  await p.waitForTimeout(800);
  ok('every file the roster loads is there', missing.length === 0, missing.slice(0, 2).join(' '));
  const st = await p.evaluate(() => ({ n: BohemiaRosterScreen.state.crew.length, f: document.querySelectorAll('#front .cell').length, bk: document.querySelectorAll('#back .cell').length,
    full: document.querySelectorAll('.cell.full').length, names: BohemiaRosterScreen.state.crew.map(m => m.name).join(',') }));
  ok('the company stands in two lines of nine (Battle Brothers\' front and back)', st.f === 9 && st.bk === 9, st.f + ' + ' + st.bk);
  ok('  every man of the starting crew is on the line', st.full === st.n && st.n >= 3, st.n + ' men: ' + st.names);
  const drawn = await p.evaluate(() => [].slice.call(document.querySelectorAll('.cell.full canvas')).every(c => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n > 200; }));
  ok('  each is drawn from the fight\'s own people sheets, not a box', drawn);
  /* PORTRAITS ON THE ROSTER (his YES with a note, 104h): the line shows faces, never the tiny full body */
  const heads = await p.evaluate(() => { const cs = [].slice.call(document.querySelectorAll('.cell.full canvas')); return { n: cs.length, head: cs.filter(c => c.classList.contains('head') && c.width === c.height && c.width >= 64).length,   /* 64 the sheet's face, 128 PORTRAIT's fresh one (RUN TWO 10/18) */
    big: cs.every(c => c.getBoundingClientRect().width >= 44) }; });
  ok('  every man on the line is his face, not his full body, the face the width of his slot', heads.n > 0 && heads.head === heads.n && heads.big, heads.head + ' of ' + heads.n + ' faces');
  /* THE FRESH PORTRAITS (RUN TWO [the fresh portraits wired in], 10/18, rule 115(h) amended; his 'I liked it when it was
     the portrait, not when you zoom in on the creepy model's face'): every face on the line, the wear rows and the card is
     PORTRAIT's fresh portrait, drawn, never a crop of a body (gates/no_face_from_a_body_gate.js reads every pixel) */
  await p.waitForTimeout(600);
  /* ONE CREW SCREEN (rule 147(b), 10/24): each man once, one face: the line's faces and the laid-up strip's, never a second list */
  const rig = await p.evaluate(() => { const cs = [].slice.call(document.querySelectorAll('canvas.head, canvas.wface, #card canvas.face'));
    const drawn = c => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n > c.width * c.height * 0.5; };
    const men = BohemiaRosterScreen.state.crew.filter(m => !m.dead).length;
    return { n: cs.length, men: men, rig: cs.filter(c => c.dataset.face === 'fresh').length, drawn: cs.filter(drawn).length }; });
  ok('  every face on the screen is PORTRAIT\'s fresh portrait and drawn, never a crop of a body; each man\'s face once', rig.n === rig.men && rig.rig === rig.n && rig.drawn === rig.n, rig.rig + ' fresh of ' + rig.n + ' for ' + rig.men + ' men, ' + rig.drawn + ' drawn');
  const card = await p.evaluate(() => { const c = document.getElementById('card'); return { stats: c.querySelectorAll('.stats > div').length, stars: c.querySelectorAll('.stars').length, gear: c.querySelectorAll('.gear:not(.bags) .gslot').length, bags: c.querySelectorAll('#bags .gslot').length,
    pain: (c.querySelector('.pain') || {}).textContent || '', sub: (c.querySelector('.sub') || {}).textContent || '', face: (() => { const f = c.querySelector('canvas.rbody, canvas.face'); if (!f) return 0; const d = f.getContext('2d').getImageData(0, 0, f.width, f.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n; })() }; });
  /* RE-AIMED UI 10/25 ([the company screen, Battle Brothers simple], rule 172): his slots are Battle Brothers' six around his body
     (head, main hand, body; accessory, off hand, ammo), his two bag slots under him */
  ok('a man\'s card: his whole body (his face is the one on the line), background, level, wage, eight stats, stars, six slots around him and his two bag slots (rule 164 item 15), one pain line',
     card.face > 400 && card.stats === 8 && card.stars >= 1 && card.gear === 6 && card.bags === 2 && card.pain.length > 10 && /LEVEL 1/.test(card.sub) && /THE LEADER|BATTER(Y|IES) A NIGHT/.test(card.sub) && !/\(\dHAND\)/.test(card.sub),   /* the money spelled one way (UI [eyes: four spellings]); YOU the leader, the others the map's nightly bill (EYES [eyes: you the companion], [eyes: two cards disagree]) */
     card.sub + ' | stars on ' + card.stars + ' | ' + card.pain.slice(0, 40));
  /* drag a man from the front line to an empty back slot */
  const fr = await p.evaluate(() => { const s = BohemiaRosterScreen.state; return { i: s.front.findIndex(x => x != null), j: s.back.findIndex(x => x == null) }; });
  const before = await p.evaluate(() => JSON.stringify(BohemiaRosterScreen.formation()));
  const box = async sel => { const r = await p.locator(sel).boundingBox(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };
  const a = await box('#front .cell:nth-child(' + (fr.i + 1) + ')'), z = await box('#back .cell:nth-child(' + (fr.j + 1) + ')');
  await p.mouse.move(a.x, a.y); await p.mouse.down(); await p.mouse.move(a.x + 10, a.y + 10, { steps: 3 }); await p.mouse.move(z.x, z.y, { steps: 8 }); await p.mouse.up();
  await p.waitForTimeout(300);
  const after = await p.evaluate(() => BohemiaRosterScreen.formation());
  const posted = await p.evaluate(() => { const m = (window.__rosterLog || []).filter(x => x.act === 'formation').pop(); return m && m.formation; });
  ok('drag a man from the front to the back and he moves', JSON.stringify(after) !== before && after.front[fr.i] == null && after.back[fr.j] != null, JSON.stringify(after).slice(0, 80));
  ok('  and the game gets the formation the fight reads ({front, back} of nine crew indices)', posted && posted.front.length === 9 && posted.back.length === 9 && JSON.stringify(posted) === JSON.stringify(after));
  /* drag the rifle from the bag onto the selected man's main hand */
  const who = await p.evaluate(() => { const s = BohemiaRosterScreen.state; const m = s.crew[s.sel]; return { name: m.name, old: m.gear.main && m.gear.main.name }; });
  /* bring the gear row to the top so the bag's first row is on the glass with it */
  await p.evaluate(() => document.querySelector('#card .gear').scrollIntoView({ block: 'start' })); await p.waitForTimeout(150);
  const bagA = await box('#bag .slot.full'), mainZ = await box('#card .gslot[data-slot="main"]');
  await p.mouse.move(bagA.x, bagA.y); await p.mouse.down(); await p.mouse.move(bagA.x + 10, bagA.y - 10, { steps: 3 }); await p.mouse.move(mainZ.x, mainZ.y, { steps: 10 }); await p.mouse.up();
  await p.waitForTimeout(300);
  const eq = await p.evaluate(() => { const s = BohemiaRosterScreen.state; const m = s.crew[s.sel]; return { main: m.gear.main && m.gear.main.name, bag: s.bag.map(i => i.name), post: (window.__rosterLog || []).filter(x => x.act === 'equip').length }; });
  ok('drag the rifle from the bag onto his main hand and he wears it', eq.main === 'solid rifle' && eq.post >= 1, who.name + ' now ' + eq.main);
  ok('  and what he carried goes back in the bag', !who.old || eq.bag.indexOf(who.old) >= 0, 'bag: ' + eq.bag.join(', '));
  await p.screenshot({ path: SHOT });
  /* ONE CREW SCREEN (rule 147(b)): a tap on a slot cuts the stash beside him to what fits it, TAKE OFF first among them
     (RE-AIMED UI 10/25, rule 172: the stash is beside him, no picker inside his page) */
  await p.click('#card .gslot[data-slot="main"]'); await p.waitForTimeout(250);
  await p.click('#bag .slot.off'); await p.waitForTimeout(250);
  const off = await p.evaluate(() => { const s = BohemiaRosterScreen.state; return { main: s.crew[s.sel].gear.main, bag: s.bag.length }; });
  ok('tap a worn slot, then TAKE OFF, and it comes off into the bag', !off.main && off.bag >= 1, 'bag ' + off.bag);
  /* THE WARDROBE MAKES A SOUND (row [the soundscape], 10/9): 'equip' is already an approved,
     frozen bank event ("CLOTHES GO ON") that nothing on this screen ever posted. Both the drag-on
     above and the tap-off just above should each have posted it once, zero new content. */
  const sfxLog = await p.evaluate(() => (window.__rosterLog || []).filter(x => x.act === 'sfx' && x.ev === 'equip').length);
  ok('wearing gear and taking it off both play the already-approved equip sound', sfxLog === 2, sfxLog + ' equip sfx posts');
  const sizes = await p.evaluate(() => [].slice.call(document.querySelectorAll('.cell.full, .gslot, #bag .slot, #done'))   /* an empty place in the line is a drop spot, narrower, never a tap (UI 10/25) */.map(e => { const r = e.getBoundingClientRect(); return Math.min(r.width, r.height); }).filter(v => v < 44).length);
  ok('every target is 44 on his phone', sizes === 0, sizes + ' small');
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE ROSTER SCREEN GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
