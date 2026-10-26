/* WHO YOU HIRE FIGHTS GATE (RUN TWO [who you hire fights, one crew screen], rule 147(a), 10/24/26).
   PAOLO 10/24: 'I hired new people and put them in my crew and they were on the line, but when it was battle time they
   weren't there; also I bought a weapon and put it in my crew slot.'
   WHY THE OLD GATES WERE GREEN WHILE THE GAME WAS BROKEN: equip_from_the_stash_gate handed the fight the crew screen's
   company BY HAND (FIGHT_OPTS = the saved company), so it proved the fight could read a company and never that the GAME
   hands it one. The game's door (nfOpts in the demo) handed the origin's men and nothing else.
   THIS GATE WALKS HIS WHOLE PATH with the real screens and the game's own door, cut from the demo he plays:
     W1 hire two men at the post (the settlement screen's own HIRE button)
     W2 buy a weapon at the smith
     W3 CREW opens the company screen; the hires stand on the line; drag the weapon onto a hire's main hand, drag the other
        hire to the back line; never tap DONE (he may not)
     W4 the game's own door (BOH_START + nfOpts, read out of slices/BOHEMIA_DEMO.html) hands the fight the company and the line
     W5 the fight: every man on the line stands on the board, the armed hire holding the weapon he bought, the moved man in
        the back line
     W6 AFTER A RELOAD: the crew screen opens with the hire still holding it, and the door and the fight do the same again
     W8 AFTER A FIGHT where the armed hire died and the other was struck down (the fight's own rows, kept by the shell's
        nfAfterKeep): the next fight has the fallen one and never the dead; the crew screen opens with the dead man gone, the
        fallen one in the line with his wound's days on his card and YOU climbed; he stands in every fight after, the crew
        screen never reopened. RE-AIMED 10/26 (CAMP [struck down, he still fights], rule 234, Paolo 10/26: 'they're still
        active... that's why I restarted hella runs'): the old leg proved he stayed home until healed, the bench rule 234 struck
     W7 a new game is a new company: the door's NEW GAME wipes the old hires out of the hand-over
   Run: node gates/who_you_hire_fights_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8893;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const DEMO = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'), 'utf8');
const cut = (re, what) => { const m = DEMO.match(re); if (!m) { console.log('  FAIL the demo has no ' + what); process.exit(1); } return m[0]; };
const DOOR = [cut(/var BOH_START = \(function\(\)\{[\s\S]*?\nwindow\.BOH_START = BOH_START;/, 'BOH_START'),
  cut(/function nfKind\(district\)\{[\s\S]*?\n\}/, 'nfKind'), cut(/function nfOpts\(d\)\{[\s\S]*?\n\}/, 'nfOpts'), 'window.nfOpts = nfOpts;'].join('\n');
/* NEW GAME's own wipe, read out of the demo too (the title's forget()) */
const FORGET = cut(/function forget\(\)\{[\s\S]*?\n  \}/, 'forget');
/* the shell's keeper of the fight's rows (nfOverIn calls it with the fight's one message) */
const AFTER = cut(/function nfAfterKeep\(d\)\{[\s\S]*?\n\}/, 'nfAfterKeep');
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (u === '/slices/__door.html') { rs.setHeader('content-type', 'text/html'); return rs.end('<!doctype html><meta charset="utf-8"><body><div id="newco"></div></body>'); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const B = 'http://127.0.0.1:' + PORT;
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = [];
  /* a wiped phone that picked A NEW CREW at the door */
  const w0 = await ctx.newPage(); await w0.goto(B + '/slices/__door.html');
  await w0.evaluate(() => { localStorage.clear(); localStorage.setItem('bohemia.start', JSON.stringify({ combat: 'new', econ: 'full', origin: 'newcrew', name: 0 })); }); await w0.close();
  /* the settlement page sits under the shell in the game, and the crew door finds BOH_START up the frames; here the door's
     own BOH_START is put on the page (the same text the demo carries) */
  const door = async (p) => { await p.evaluate(src => { (0, eval)(src); }, DOOR); await p.waitForFunction(() => window.BOH_START && BOH_START.data(), null, { timeout: 20000 }); };
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push('settlement: ' + e.message));
  await p.goto(B + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await door(p);
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.traitsIn(), null, { timeout: 30000 });
  const openAt = async (k) => {
    for (let i = 0; i < 6; i++) {
      await p.waitForTimeout(400);
      if (await p.evaluate(k => BohemiaSettlement.state.open === k, k)) return true;
      const w = await p.evaluate(k => BohemiaSettlement.where(k), k); if (w) await p.mouse.click(w.x, w.y + (k === 'smith' ? 30 : 0));
    }
    return p.evaluate(k => BohemiaSettlement.state.open === k, k);
  };
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: [], night: false, batteries: 9999 }));
  /* ---- W1 hire two at the post ---- */
  await openAt('hall');
  for (let k = 0; k < 2; k++) {
    await p.evaluate(() => { const c = [...document.querySelectorAll('#sbody .hire')].find(c => [...c.querySelectorAll('button')].some(x => /Hire/.test(x.textContent) && !x.disabled));
      const btn = c && [...c.querySelectorAll('button')].find(x => /Hire/.test(x.textContent)); if (btn) btn.click(); });
    await p.waitForTimeout(400);
    if (k === 0) await openAt('hall');
  }
  const hired = await p.evaluate(() => JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]').map(h => h.name));
  ok('W1 two men hired at the post with its own HIRE button', hired.length === 2, hired.join(', '));
  /* ---- W2 buy a weapon at the smith ---- */
  await p.evaluate(() => { const c = document.getElementById('close'); if (c && c.offsetParent) c.click(); }); await p.waitForTimeout(300);
  await openAt('smith'); await p.waitForTimeout(300);
  const before = await p.evaluate(() => JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]').map(i => i.id));
  await p.click('#shelfgrid .slot.full'); await p.waitForTimeout(300);
  await p.click('#sbody .act:has-text("Buy it")'); await p.waitForTimeout(400);
  const bag = await p.evaluate(() => JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]'));
  const bought = bag.filter(i => i.kind === 'weapon').find(i => before.indexOf(i.id) < 0 || bag.filter(x => x.id === i.id).length > before.filter(x => x === i.id).length);
  ok('W2 a weapon bought at the smith lands in the stash', !!bought, bought && bought.name + ' (' + bought.id + ')');
  /* ---- W3 the company screen: the hires on the line, a weapon in a hire's hand, the other hire to the back ---- */
  await p.click('#crew'); await p.waitForTimeout(300);
  const F = () => p.frames().find(f => /ROSTER_SCREEN/.test(f.url()));
  for (let i = 0; i < 80 && !(F() && await F().evaluate(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready).catch(() => false)); i++) await p.waitForTimeout(250);
  const R = F(); await p.waitForTimeout(500);
  const line0 = await R.evaluate(() => { const s = BohemiaRosterScreen.state; const on = s.front.concat(s.back).filter(i => i != null).map(i => s.crew[i].name); return { on, crew: s.crew.map(m => m.name) }; });
  ok('W3 the company screen: the origin\'s three and both hires stand on the line', line0.crew.length === 5 && hired.every(n => line0.on.indexOf(n) >= 0), line0.on.join(', '));
  /* ONE CREW SCREEN (rule 147(b)): each man once, one face, on the line; no second list of the same crew */
  const once = await R.evaluate(() => { const S = BohemiaRosterScreen.state, ids = [].slice.call(document.querySelectorAll('#lines .cell[data-man]')).map(c => +c.dataset.man);
    return { faces: document.querySelectorAll('canvas.head, canvas.wface, #card canvas.face').length, men: S.crew.length, once: S.crew.every((m, i) => ids.filter(x => x === i).length === 1), list: !!document.getElementById('wear') || !!document.querySelector('.wrow') }; });
  ok('  ONE CREW SCREEN: each man once, one face on the line, no second list', once.once && once.faces === once.men && !once.list, once.faces + ' faces for ' + once.men + ' men');
  const fr = p.frameLocator('#crewdoor iframe');
  const centre = async (loc) => { await loc.scrollIntoViewIfNeeded(); const q = await loc.boundingBox(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; };
  const drag = async (a, z) => { await p.mouse.move(a.x, a.y); await p.mouse.down(); await p.mouse.move(a.x + 10, a.y - 10, { steps: 3 }); await p.mouse.move(z.x, z.y, { steps: 14 }); await p.mouse.up(); await p.waitForTimeout(400); };
  /* tap the first hire's face on the line: his page opens */
  const armed = hired[0], moved = hired[1];
  const cellOf = async (name) => fr.locator('#lines .cell.full[aria-label="' + name + '"]').first();
  await (await cellOf(armed)).click(); await p.waitForTimeout(400);
  const sel = await R.evaluate(() => { const s = BohemiaRosterScreen.state; return s.crew[s.sel].name; });
  /* drag the bought weapon from the bag onto his main hand */
  const bagSlot = fr.locator('#bag .slot.full[aria-label="' + bought.name + '"]').first();
  await drag(await centre(bagSlot), await centre(fr.locator('#card .gslot[data-slot="main"]').first()));
  const worn = await R.evaluate(n => { const m = BohemiaRosterScreen.state.crew.find(x => x.name === n); return m && m.gear.main && m.gear.main.id; }, armed);
  ok('  a tap on his face opens his page; the weapon dragged from the bag is in his hand', sel === armed && worn === bought.id, sel + ' holds ' + worn);
  /* drag the other hire onto an empty place in the back line */
  const emptyBack = await R.evaluate(() => BohemiaRosterScreen.state.back.findIndex(i => i == null));
  await drag(await centre(await cellOf(moved)), await centre(fr.locator('#back .cell[data-drop="back:' + emptyBack + '"]').first()));
  const at = await R.evaluate(n => { const s = BohemiaRosterScreen.state, i = s.crew.findIndex(m => m.name === n); return { back: s.back.indexOf(i), front: s.front.indexOf(i) }; }, moved);
  ok('  the other hire dragged to the back line', at.back === emptyBack && at.front < 0, moved + ' back:' + at.back);
  const onLine = await R.evaluate(() => { const s = BohemiaRosterScreen.state; return s.front.concat(s.back).filter(i => i != null).map(i => s.crew[i].name); });
  /* ---- W4 the game's own door, never DONE tapped ---- */
  const theDoor = async (day) => { const d = await ctx.newPage(); d.on('pageerror', e => errs.push('door: ' + e.message)); await d.goto(B + '/slices/__door.html'); await d.evaluate(() => { window.NF = {}; }); await door(d);
    const o = await d.evaluate(day => { const o = nfOpts({ district: 'downtown', world: { night: false, day: day || 2 }, at: { gx: 4, gy: 4 } }); return JSON.parse(JSON.stringify(o)); }, day); await d.close(); return o; };
  const fight = async (o) => { const f = await ctx.newPage(); f.on('pageerror', e => errs.push('fight: ' + e.message));
    await f.addInitScript(o => { window.FIGHT_OPTS = Object.assign({ seed: 5, speed: 1 }, o); }, o);
    await f.goto(B + '/slices/BOHEMIA_FIGHT.html');
    await f.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length, null, { timeout: 60000 });
    const r = await f.evaluate(() => FIGHT.S.units.filter(u => u.side === 'you').map(u => ({ name: u.name, x: u.x, y: u.y, slot: u.slot, weapon: u.weapon && u.weapon.id, main: u.main })));
    await f.close(); return r; };
  const check = async (tag) => {
    const o = await theDoor();
    const names = (o.company || []).map((m, i) => i === 0 ? 'YOU' : m.name);
    const armedRow = (o.company || []).find(m => m.name === armed);
    ok(tag + ' the game\'s own door hands the fight the crew screen\'s company: both hires, the bought weapon in his slot, and the line',
      hired.every(n => names.indexOf(n) >= 0) && armedRow && armedRow.gear && armedRow.gear.main === bought.id && o.formation && Array.isArray(o.formation.back),
      names.join(', ') + (o.formation ? '; line handed' : '; NO LINE'));
    const us = await fight(o);
    const stand = onLine.filter(n => n === line0.crew[0] ? us.some(u => u.main && u.x >= 0) : us.some(u => u.name === n && u.x >= 0));
    ok(tag + ' THE FIGHT: every man on his line stands on the board', stand.length === onLine.length && us.length === onLine.length, stand.length + ' of ' + onLine.length + ' (' + us.map(u => u.name + '@' + u.x + ',' + u.y).join(' ') + ')');
    const a = us.find(u => u.name === armed), m = us.find(u => u.name === moved);
    ok(tag + '   the hire he armed holds the weapon he bought', a && a.weapon === bought.id, a ? a.name + ' holds ' + a.weapon : 'not there');
    ok(tag + '   the hire he moved stands in the back line', m && /^back/.test(String(m.slot)), m ? m.name + ' ' + m.slot : 'not there');
  };
  await check('W4-W5');
  /* ---- W6 after a reload ---- */
  await p.reload({ waitUntil: 'load' }); await door(p);
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: [], night: false, batteries: 9999 })); await p.waitForTimeout(600);
  await p.evaluate(() => { const c = document.getElementById('close'); if (c && c.offsetParent) c.click(); });
  await p.click('#crew'); await p.waitForTimeout(300);
  for (let i = 0; i < 80 && !(F() && await F().evaluate(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready).catch(() => false)); i++) await p.waitForTimeout(250);
  const back = await F().evaluate(n => { const s = BohemiaRosterScreen.state, m = s.crew.find(x => x.name === n); return { held: m && m.gear.main && m.gear.main.id, bag: s.bag.filter(i => i.kind === 'weapon').length }; }, armed);
  ok('W6 AFTER A RELOAD the crew screen opens with the hire still holding the weapon he bought (it used to vanish)', back.held === bought.id, armed + ' holds ' + back.held);
  await check('W6');
  /* ---- W8 after a fight ---- */
  const k8 = await ctx.newPage(); await k8.goto(B + '/slices/__door.html');
  const rows = [{ name: line0.crew[0], main: true, level: 1, xpGained: 1300, dead: false, down: false, laidUpDays: 0, injury: null },
    { name: armed, main: false, level: 1, xpGained: 40, dead: true, down: true, laidUpDays: 0, injury: null },
    { name: moved, main: false, level: 1, xpGained: 60, dead: false, down: true, laidUpDays: 3, injury: { id: 'brain_damage', name: 'Brain Damage', line: 'he forgets things' } }];
  const kept8 = await k8.evaluate(a => { window.NF = { day: 2 }; (0, eval)(a.src + '\nwindow.__k = nfAfterKeep;'); return window.__k({ type: 'BOHEMIA_FIGHT_OVER', result: 'won', crew: a.rows }); }, { src: AFTER, rows });
  await k8.close();
  const o8 = await theDoor(2), n8 = (o8.company || []).map(m => m && m.name);
  ok('W8 the shell kept the fight\'s rows, and the next fight has the fallen one (rule 234) and never the dead hire', kept8 === 1 && n8.indexOf(armed) < 0 && n8.indexOf(moved) >= 0 && n8.length === 4, n8.join(', '));
  const us8 = await fight(o8);
  ok('  THE FIGHT after it: four men, the fallen one among them, never the dead', us8.length === 4 && us8.some(u => u.name === moved) && !us8.some(u => u.name === armed), us8.map(u => u.name).join(', '));
  /* the crew screen opens on the map's day 2 */
  await p.evaluate(() => { window.mapState = () => ({ day: 2 }); const c = document.getElementById('crewdoor'); if (c) BohemiaCrewDoor.close(); });
  await p.click('#crew'); await p.waitForTimeout(300);
  for (let i = 0; i < 80 && !(F() && await F().evaluate(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready).catch(() => false)); i++) await p.waitForTimeout(250);
  await p.waitForTimeout(400);
  const cs = await F().evaluate(a => { const S = BohemiaRosterScreen.state, f = n => S.crew.find(m => m.name === n), you = S.crew.find(m => m.main);
    return { dead: !!(f(a.armed) && f(a.armed).dead), laid: f(a.moved) && f(a.moved).hurt ? f(a.moved).hurt.days : 0, strip: [...document.querySelectorAll('#hurt .cell')].length,
      onLine: S.front.concat(S.back).filter(i => i != null).map(i => S.crew[i].name), youLevel: you.level, queue: localStorage.getItem('bohemia.fight.after.v1') }; }, { armed, moved });
  ok('  the crew screen read it: the dead hire is gone from the line, the fallen one IN the line with his wound\'s 3 days, no strip, YOU climbed, the queue empty',
     cs.dead && cs.laid === 3 && cs.strip === 0 && cs.onLine.indexOf(armed) < 0 && cs.onLine.indexOf(moved) >= 0 && cs.youLevel > 1 && !cs.queue, JSON.stringify(cs).slice(0, 160));
  await p.evaluate(() => { try { BohemiaCrewDoor.close(); } catch (e) {} });
  const o9 = await theDoor(4), o10 = await theDoor(5);
  ok('  the fallen hire stands in the fight on day 4 and on day 5, never held home, the dead never (the crew screen never reopened)', (o9.company || []).some(m => m.name === moved) && (o10.company || []).some(m => m.name === moved) && !(o9.company || []).concat(o10.company || []).some(m => m.name === armed),
     'day 4: ' + (o9.company || []).length + ' men; day 5: ' + (o10.company || []).map(m => m.name).join(', '));
  /* ---- W7 NEW GAME is a new company ---- */
  const w7 = await ctx.newPage(); await w7.goto(B + '/slices/__door.html');
  await w7.evaluate(src => { const T = { forgets: 0 }, KEY_SAVE = 'bohemia_city_save', DEADMARK = '{"bohemia":"DEAD"}'; (0, eval)('(function(T, KEY_SAVE, DEADMARK){ ' + src + '; forget(); })')(T, KEY_SAVE, DEADMARK); }, FORGET);
  await w7.close();
  const o7 = await theDoor();
  ok('W7 NEW GAME: the old hires never walk into the new company', (o7.company || []).every(m => hired.indexOf(m.name) < 0) && !o7.formation, (o7.company || []).length + ' men from the origin');
  ok('nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close(); srv.close();
  console.log('\nWHO YOU HIRE FIGHTS GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
