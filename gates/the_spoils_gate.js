/* THE SPOILS GATE (RUN TWO [the end of the fight, the loot, the stash], VAMILY rule 156, 10/24/26).
   PAOLO 10/24: 'I've been killing enemies all this time, winning battles, but there isn't an end of battle quick summary of
   who got experience, who leveled up, and what loot I'm able to take, with a loot button; and if my inventory is full it
   loots as much as it can and stops, similar to Battle Brothers... there's a whole inventory and bag screen you're just
   missing.'
   WHY THIS WALKS THE DEMO: the fight already had a recap card with XP on it, and every gate that read the fight was green,
   while in the game that card stood two seconds and the door took him home past it. Rule 150(d): win, see it, loot, find it
   in the stash, equip it, fight with it, on the surface he plays.
     L1 the rules are Battle Brothers' own, quoted, and every count that is ours says why (records/target/bb/loot.json)
     S1 the full stash STOPS: the screen on its own sample, the stash one short of the ground, LOOT ALL takes what fits and
        says it is full; a piece put back makes room and a tap takes the last one
     T0 THE DEMO: a town first (its screen's frame stands between visits)
     D1 a road fight through the map's own door; every man of theirs falls; the fight's card comes up
     D2 *** THE SPOILS WAIT FOR HIM *** the spoils screen lies over the fight and the game does NOT go home on its own
     D3 YOUR CREW: every man of his on it with the XP the fight gave him; the one who climbed says LEVEL UP and PICK A PERK
     D4 WHAT THEY LEFT: pieces off the dead through the drop rules (none off the one who ran); LOOT ALL (a real tap) moves
        them into the stash and the batteries into the purse, once
     D5 CHOOSE YOUR LEVEL-UP (a real tap) opens the one crew screen on the man who climbed; he picks three of the eight
        rolled stats and a perk (real taps, rule 162(a)); the looted
        weapon is in the bag there and goes into a man's hand (real taps on his face, his slot, the piece)
     D6 LEAVE (a real tap): the spoils are gone and he is home on the map
     D7 the game's own door hands the next fight that man holding the looted weapon, and in the next road fight he holds it
     D9 the shop sells from the stash: a town visited BEFORE the fight shows the loot in his bag after it, and buys one
     E1 *** ONE END SCREEN *** (rule 164 item 28, Paolo 10/24: 'it goes away way too quickly, I can't read it'): the end
        screen says YOU WON with the fight's own head over it, the rounds, and what each man did (YOUR kills, as the fight
        counted them), and the fight's card never takes him home on a timer
     E2 *** A LOST FIGHT WAITS TOO ***: the next road fight lost; the same one screen comes up at once with YOU LOST and no
        loot, and five beats on he is still on it; LEAVE (a real tap) takes him home
     D8 nothing threw
   node gates/the_spoils_gate.js */
'use strict';
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('=== THE SPOILS GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const L = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/loot.json'), 'utf8'));
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };

(async () => {
  /* ---- L1 the file ---- */
  const q = L.school.drop_conditions.quote, dr = L.drop;
  ok('L1 the drop rules are Battle Brothers\' own, quoted from the library, and the file reads them as written',
    /0827_Game Guide/.test(L.school.drop_conditions.source) && /Weapon: > 11/.test(q) && /Helmet: 70%/.test(q) &&
    dr.weapon.min_durability_over === 11 && dr.weapon.roll_pct === 90 && dr.shield.roll_pct === 90 && dr.head.roll_pct === 70 &&
    dr.body.min_pct === 25 && dr.head.min_durability_over === 30 && dr.nothing_from.indexOf('beast') >= 0,
    'weapon >' + dr.weapon.min_durability_over + ' ' + dr.weapon.roll_pct + '%, helmet ' + dr.head.roll_pct + '%');
  ok('    every count that is ours says so and why', ['rounds', 'scrap', 'batteries'].every(k => L.counts[k].ours === true && L.counts[k].why && L.counts[k].to));

  /* ---- S1 the full stash stops (the screen on its own) ---- */
  const srv = http.createServer((rq, rs) => {
    const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
    rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
  });
  await new Promise(r => srv.listen(8894, '127.0.0.1', r));
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const b = await chromium.launch();
  const sp = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  const serrs = []; sp.on('pageerror', e => serrs.push(e.message));
  await sp.goto('http://127.0.0.1:8894/slices/BOHEMIA_SPOILS_SCREEN.html');
  await sp.waitForFunction(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened, null, { timeout: 30000 });
  const n = await sp.evaluate(() => { const S = BohemiaSpoilsScreen.state, fill = BohemiaRoster.itemOf('weapon', 'wooden_stick');
    localStorage.setItem('bohemia.bag.v1', JSON.stringify(Array.from({ length: S.cap - (S.ground.length - 1) }, () => fill)));
    BohemiaSpoilsScreen.open({ fight: BohemiaSpoilsScreen.SAMPLE, seed: 7 }); return { ground: S.ground.length, cap: S.cap, stash: S.stash.length }; });
  await sp.tap('#lootall'); await sp.waitForTimeout(200);
  const full = await sp.evaluate(() => { const S = BohemiaSpoilsScreen.state; return { stash: S.stash.length, left: S.ground.length, said: document.getElementById('said').textContent, red: document.getElementById('said').className }; });
  ok('S1 the stash one short of the ground: LOOT ALL takes what fits, STOPS, and says it is full',
    n.ground >= 2 && full.stash === n.cap && full.left === 1 && /full/i.test(full.said) && full.red === 'full', n.ground + ' on the ground, ' + n.stash + ' in the stash: ' + full.said);
  await sp.tap('#stash .slot.full >> nth=0'); await sp.waitForTimeout(150);
  await sp.tap('#ground .slot.full >> nth=0'); await sp.waitForTimeout(150);
  const after = await sp.evaluate(() => { const S = BohemiaSpoilsScreen.state; return { stash: S.stash.length, left: S.ground.length, kept: JSON.parse(localStorage.getItem('bohemia.bag.v1')).length }; });
  ok('    a piece put back makes room, and a tap takes one from the ground; the stash is kept', after.stash === n.cap && after.left === 1 && after.kept === n.cap, JSON.stringify(after));
  await sp.close(); await b.close(); srv.close();

  /* ---- THE DEMO ---- */
  let d;
  try { d = await drive.open({ keepCards: true, beforeTap: async (p) => { await throughTheTitle(p); } }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  const p = d.page, fr = d.fr, errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const fightFrame = async () => { for (let i = 0; i < 200; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
    if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) return c; } await p.waitForTimeout(150); } return null; };
  const roadFight = async (seq) => { await fr.evaluate((seq) => { try { stepOnce(0); stepOnce(4); } catch (_e) {} roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: seq }); }, seq); return fightFrame(); };
  /* a town on the map, the map's own way in (loopOpenTown), and its screen once it stands; the same frame every visit */
  const town = async () => {
    const n = await fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return n; });
    for (let k = 0; k < 60; k++) { await p.waitForTimeout(400);
      for (const x of p.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) {
        const r = await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place; } catch (e) { return false; } }).catch(() => false);
        if (r) return { sf: x, name: n }; } }
    return { sf: null, name: n };
  };
  const leaveTown = async (sf) => { try { await sf.locator('#leave').first().tap({ timeout: 3000 }); } catch (_e) { await sf.evaluate(() => { const l = document.querySelector('#leave'); if (l) l.click(); }).catch(() => null); } await p.waitForTimeout(800); };
  try {
    await p.waitForTimeout(2500);
    await p.evaluate(() => { localStorage.setItem('bohemia.bag.v1', '[]'); });
    /* T0: he has been to a town before the fight (the screen's frame stands from then on, between visits) */
    const t0 = await town();
    ok('T0 a town before the fight, through the map\'s own door', !!t0.sf, t0.name);
    if (t0.sf) await leaveTown(t0.sf);
    const bat0 = await fr.evaluate(() => BohemiaPurse.balance(purseGet(), 'electricity')), res0 = await fr.evaluate(() => BohemiaPurse.balance(purseGet(), 'resources'));
    const f = await roadFight(11);
    ok('D1 a road fight through the map\'s own door', !!f);
    if (!f) return done();
    const ours = await f.evaluate(() => {
      const S = FIGHT.S, them = S.units.filter(u => u.side === 'them'), you = S.units.filter(u => u.side === 'you');
      them.forEach((u, i) => { if (i === them.length - 1 && them.length > 2) { u.fled = true; return; } u.dead = true; u.armB = Math.round(u.armBMax * 0.8); u.armH = u.armHMax; });
      you.forEach((u, i) => { u.xpGained = (u.xpGained || 0) + (i === 0 ? 600 : 120); u.kills = i === 0 ? them.length - 1 : 0; });
      S.over = true; S.result = 'won'; showOver('won');
      return { men: you.map(u => u.name), dead: them.filter(u => u.dead).length, ran: them.filter(u => u.fled).map(u => u.name) }; });
    ok('    every man of theirs falls (one runs) and the fight\'s card comes up', ours.dead >= 2, ours.dead + ' dead, ' + ours.ran.length + ' ran');
    /* ---- D2 the spoils wait ---- */
    let open = false; for (let i = 0; i < 40 && !open; i++) { open = await p.evaluate(() => !!(window.SPOILS && SPOILS.frame)); if (!open) await p.waitForTimeout(150); }
    await p.waitForTimeout(3000);
    const still = await p.evaluate(() => ({ fight: CITYFIGHT, spoils: !!document.getElementById('spoilsdoor'), home: !!(NF && NF.homeAt) }));
    ok('D2 *** THE SPOILS WAIT FOR HIM *** the screen lies over the fight, and five beats on the game has not gone home', open && still.fight && still.spoils && !still.home, JSON.stringify(still));
    const SF = () => p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
    for (let i = 0; i < 80 && !(SF() && await SF().evaluate(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened).catch(() => false)); i++) await p.waitForTimeout(200);
    /* ---- E1 one end screen: the result, the fight's own head and numbers ---- */
    const fh = await f.evaluate(() => ({ head: document.getElementById('oh').textContent, rounds: FIGHT.S.round, kills: (FIGHT.S.units.find(u => u.side === 'you' && u.main) || {}).kills | 0 }));
    const e1 = await SF().evaluate(() => ({ word: document.getElementById('word').textContent, head: document.getElementById('head').textContent, tally: document.getElementById('tally').textContent,
      you: ((document.querySelector('#crew .man[data-man="YOU"] .nums') || document.querySelector('#crew .man .nums')) || {}).textContent || '', loot: getComputedStyle(document.getElementById('loot')).display }));
    ok('E1 *** ONE END SCREEN *** YOU WON, the fight\'s own head, its rounds, and what YOU did in it, all on the one screen that waits',
      e1.word === 'YOU WON' && e1.head === fh.head && fh.head.length > 0 && new RegExp('^' + fh.rounds + ' ROUND').test(e1.tally) && new RegExp('^' + fh.kills + ' KILL').test(e1.you) && e1.loot !== 'none',
      e1.word + ' / ' + e1.head + ' / ' + e1.tally + ' / YOU: ' + e1.you);
    const s0 = await SF().evaluate(() => { const S = BohemiaSpoilsScreen.state; return { men: S.men.map(m => ({ name: m.name, main: m.main, gained: m.gained, up: m.up, to: m.to })), ground: S.ground.map(i => ({ id: i.id, kind: i.kind, from: i.from })), counts: S.counts, from: S.found.from,
      rows: document.querySelectorAll('#crew .man').length, perk: document.querySelectorAll('#crew button.perk').length, heads: document.querySelectorAll('#crew .man canvas').length }; });
    /* ---- D3 your crew ---- */
    const youRow = s0.men.find(m => m.main);
    ok('D3 YOUR CREW: every man of his, each with a face and the XP the fight gave him', s0.rows === ours.men.length && s0.heads === s0.rows && s0.men.every(m => m.gained > 0), s0.men.map(m => m.name + ' +' + m.gained).join(', '));
    ok('    the one who climbed says LEVEL UP and CHOOSE YOUR LEVEL-UP', !!youRow && youRow.up && s0.perk >= 1, youRow ? 'YOU to level ' + youRow.to : 'no YOU');
    /* ---- D4 what they left, LOOT ALL ---- */
    const weapon = s0.ground.find(i => i.kind === 'weapon');
    ok('D4 WHAT THEY LEFT: pieces off the dead through the drop rules, none off the man who ran', s0.ground.length > 0 && !!weapon && s0.from === ours.dead,
      'off ' + s0.from + ' of ' + (ours.dead + ours.ran.length) + ': ' + s0.ground.map(i => i.id).join(', ') + '; counts ' + JSON.stringify(s0.counts));
    const SFL = p.frameLocator('#spoilsdoor iframe');
    /* --shoot (or BOHEMIA_SHOOT=1): the screen as he sees it, before and after LOOT ALL, into records/target/spoils/ */
    const SHOOT = process.argv.indexOf('--shoot') >= 0 || process.env.BOHEMIA_SHOOT === '1', SHOTS = path.join(ROOT, 'records/target/spoils');
    if (SHOOT) { fs.mkdirSync(SHOTS, { recursive: true }); await p.screenshot({ path: path.join(SHOTS, 'the_spoils_on_the_demo_before.png') }); }
    await SFL.locator('#lootall').tap(); await p.waitForTimeout(500);
    if (SHOOT) await p.screenshot({ path: path.join(SHOTS, 'the_spoils_on_the_demo_after_loot_all.png') });
    const s1 = await SF().evaluate(() => ({ ground: BohemiaSpoilsScreen.state.ground.length, stash: JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]').map(i => i.id), stashn: document.getElementById('stashn').textContent }));
    const bat1 = await fr.evaluate(() => BohemiaPurse.balance(purseGet(), 'electricity')), res1 = await fr.evaluate(() => BohemiaPurse.balance(purseGet(), 'resources'));
    ok('    LOOT ALL (a real tap): every piece is in the stash, the screen counts it', s1.ground === 0 && s0.ground.every(i => s1.stash.indexOf(i.id) >= 0) && /^\d+ \/ 36$/.test(s1.stashn), s1.stash.join(', ') + ' (' + s1.stashn + ')');
    ok('    the counts take no room: the batteries are in the purse, the rounds and scrap in its resources, once', bat1 - bat0 === (s0.counts.batteries | 0) && res1 - res0 === (s0.counts.rounds | 0) + (s0.counts.scrap | 0),
      'batteries ' + bat0 + ' -> ' + bat1 + ', resources ' + res0 + ' -> ' + res1 + ' for ' + JSON.stringify(s0.counts));
    /* ---- D5 PICK A PERK, then equip the loot on the one crew screen ---- */
    await SFL.locator('#crew button.perk').first().tap(); await p.waitForTimeout(500);
    const RF = () => p.frames().find(x => /ROSTER_SCREEN/.test(x.url()));
    for (let i = 0; i < 80 && !(RF() && await RF().evaluate(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready).catch(() => false)); i++) await p.waitForTimeout(250);
    const R = RF(), RL = SFL.frameLocator('#crewdoor iframe');
    await p.waitForTimeout(600);
    const r0 = R ? await R.evaluate(() => { const S = BohemiaRosterScreen.state, m = S.crew[S.sel]; return { sel: m && m.name, main: m && m.main, points: m && m.points, level: m && m.level }; }) : null;
    ok('D5 CHOOSE YOUR LEVEL-UP (a real tap) opens the one crew screen on the man who climbed, with his levels and points waiting', !!r0 && r0.main && r0.points > 0, r0 && (r0.sel + ' level ' + r0.level + ', ' + r0.points + ' to spend'));
    /* rule 162(a): his level-up is his choice: three of the eight rolled stats, real taps */
    const rolls = R ? await R.evaluate(() => [].map.call(document.querySelectorAll('#levelup [data-raise]'), b => b.dataset.raise)) : [];
    const st0 = R ? await R.evaluate(() => Object.assign({}, BohemiaRosterScreen.state.crew.find(x => x.main).stats)) : {};
    for (const k of ['ranged_defense', 'melee_skill', 'hp']) { await RL.locator('#levelup [data-raise="' + k + '"]').first().tap(); await p.waitForTimeout(80); }
    await RL.locator('#raise').tap(); await p.waitForTimeout(250);
    const st1 = R ? await R.evaluate(() => { const m = BohemiaRosterScreen.state.crew.find(x => x.main); return { st: Object.assign({}, m.stats), left: (m.rolls || []).length }; }) : { st: {} };
    const rose = Object.keys(st1.st).filter(k => st1.st[k] > st0[k]);
    ok('    he chooses his level-up: of the eight rolled stats he taps RANGED DEF, MELEE SKILL and HITPOINTS, and only those rise', rolls.length === 8 && rose.length === 3 && ['ranged_defense', 'melee_skill', 'hp'].every(k => rose.indexOf(k) >= 0),
      rose.map(k => k + ' ' + st0[k] + '->' + st1.st[k]).join(', ') + '; ' + st1.left + ' more levels waiting');
    let perk = null;
    if (r0 && r0.points > 0) {
      await RL.locator('#pick').tap(); await p.waitForTimeout(250);
      const first = RL.locator('#card [data-perk]').first(); perk = await first.getAttribute('data-perk'); await first.tap(); await p.waitForTimeout(300);
    }
    const took = R ? await R.evaluate(() => { const S = BohemiaRosterScreen.state, m = S.crew.find(x => x.main); return m.perks.slice(); }) : [];
    ok('    he takes a perk (a real tap), and it is kept', !!perk && took.indexOf(perk) >= 0 && (JSON.parse(await p.evaluate(() => localStorage.getItem('bohemia.climb.v1')) || '{}')[(await R.evaluate(() => BohemiaRosterScreen.state.crew.find(x => x.main).name))] || {}).perks.indexOf(perk) >= 0, perk);
    const man = await R.evaluate(() => { const S = BohemiaRosterScreen.state, on = S.front.concat(S.back).filter(i => i != null).map(i => S.crew[i]); const m = on.find(x => !x.main) || on[0]; return m.name; });
    const inBag = await R.evaluate((id) => BohemiaRosterScreen.state.bag.some(i => i.id === id), weapon.id);
    await RL.locator('#lines .cell.full[aria-label="' + man + '"]').first().tap(); await p.waitForTimeout(300);
    await RL.locator('#card .gslot[data-slot="main"]').first().tap(); await p.waitForTimeout(300);
    const idx = await R.evaluate((id) => { const S = BohemiaRosterScreen.state; return S.bag.findIndex(i => i.id === id); }, weapon.id);
    await RL.locator('#picker [data-pick="' + idx + '"]').first().tap(); await p.waitForTimeout(400);
    const worn = await R.evaluate((n) => { const m = BohemiaRosterScreen.state.crew.find(x => x.name === n); return m && m.gear.main && m.gear.main.id; }, man);
    ok('    the looted weapon is in the bag there and goes into a man\'s hand (real taps on his face, his slot, the piece)', inBag && worn === weapon.id, man + ' holds ' + worn);
    await RL.locator('#done').tap(); await p.waitForTimeout(400);
    /* ---- D6 LEAVE ---- */
    await SFL.locator('#leave').tap();
    let home = false; for (let i = 0; i < 40 && !home; i++) { home = await p.evaluate(() => !CITYFIGHT && !document.getElementById('spoilsdoor')); if (!home) await p.waitForTimeout(200); }
    ok('D6 LEAVE (a real tap): the spoils are gone and he is home on the map', home);
    /* ---- D9 the shop sells from the stash: the town he visited before the fight has the loot in his bag, and buys it ---- */
    const t1 = await town();
    const shop = t1.sf ? await t1.sf.evaluate(() => BohemiaSettlement.state.stash.map(i => ({ id: i.id, name: i.name, looted: !!i.looted, cond: i.cond, condMax: i.condMax }))) : [];
    const kept = JSON.parse(await p.evaluate(() => localStorage.getItem('bohemia.bag.v1') || '[]')).map(i => i.id);
    ok('D9 *** THE SHOP SEES THE LOOT *** the town he visited before the fight has the stash as it is now, loot and all (it kept its first look, and its next sale wrote that over the stash)',
      !!t1.sf && shop.length === kept.length && kept.every((id, i) => shop[i] && shop[i].id === id) && shop.some(i => i.looted), shop.map(i => i.id).join(', '));
    const sell = shop.find(i => i.looted);
    if (t1.sf && sell) {
      const box = await (await t1.sf.frameElement()).boundingBox();
      for (let i = 0; i < 6; i++) { if (await t1.sf.evaluate(() => BohemiaSettlement.state.open === 'smith')) break;
        const w = await t1.sf.evaluate(() => BohemiaSettlement.where('smith')); if (w) await p.mouse.click(box.x + w.x, box.y + w.y + 30); await p.waitForTimeout(500); }
      const before = await t1.sf.evaluate(() => ({ n: BohemiaSettlement.state.stash.length, b: BohemiaPurse.balance(BohemiaSettlement.state.purse, 'electricity') }));
      await t1.sf.locator('#baggrid .slot.full[aria-label="' + sell.name + '"]').first().tap(); await p.waitForTimeout(300);
      const offer = await t1.sf.evaluate(() => (document.getElementById('sbody') || {}).textContent || '');
      await t1.sf.locator('#sbody .act:has-text("Sell it")').first().tap(); await p.waitForTimeout(400);
      const afterS = await t1.sf.evaluate(() => ({ n: BohemiaSettlement.state.stash.length, b: BohemiaPurse.balance(BohemiaSettlement.state.purse, 'electricity') }));
      const stash2 = JSON.parse(await p.evaluate(() => localStorage.getItem('bohemia.bag.v1') || '[]'));
      ok('    the smith buys a looted piece out of the stash (real taps), worn pieces for what is left of them', afterS.n === before.n - 1 && afterS.b > before.b && stash2.length === before.n - 1,
        sell.name + (sell.condMax ? ' at ' + Math.round(100 * sell.cond / sell.condMax) + '%' : '') + ': ' + (afterS.b - before.b) + ' batteries; ' + offer.replace(/\s+/g, ' ').slice(0, 80));
    } else ok('    the smith buys a looted piece out of the stash', false, 'no town or no looted piece');
    if (t1.sf) await leaveTown(t1.sf);
    /* ---- D7 the next fight ---- */
    const o = await p.evaluate(() => JSON.parse(JSON.stringify(nfOpts({ district: 'downtown', world: { night: false, day: 2 } }))));
    const row = (o.company || []).find(m => m.name === man) || (o.company || [])[0];
    ok('D7 the game\'s own door hands the next fight that man holding the looted weapon', !!row && row.gear && row.gear.main === weapon.id, row && (row.name + ' -> ' + (row.gear && row.gear.main)));
    await p.waitForTimeout(1500);
    const f2 = await roadFight(12);
    const holds = f2 ? await f2.evaluate((n) => { const u = FIGHT.S.units.find(x => x.side === 'you' && x.name === n) || FIGHT.S.units.find(x => x.side === 'you' && x.main); return u && { name: u.name, weapon: u.weapon && u.weapon.id }; }, man) : null;
    ok('    *** AND IN THE NEXT ROAD FIGHT HE HOLDS IT ***', !!holds && holds.weapon === weapon.id, holds && (holds.name + ' holds ' + holds.weapon));
    /* ---- E2 a lost fight waits on the same one screen ---- */
    if (f2) {
      await f2.evaluate(() => { const S = FIGHT.S; S.units.filter(u => u.side === 'you').forEach(u => { if (!u.main) u.dead = true; }); S.over = true; S.result = 'lost'; showOver('lost'); });
      let up = false; for (let i = 0; i < 40 && !up; i++) { up = await p.evaluate(() => !!(window.SPOILS && SPOILS.frame)); if (!up) await p.waitForTimeout(100); }
      for (let i = 0; i < 80 && !(SF() && await SF().evaluate(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened && BohemiaSpoilsScreen.state.won === false).catch(() => false)); i++) await p.waitForTimeout(200);
      await p.waitForTimeout(2500);
      const e2 = await SF().evaluate(() => ({ word: document.getElementById('word').textContent, loot: getComputedStyle(document.getElementById('loot')).display, ground: BohemiaSpoilsScreen.state.ground.length,
        nothing: document.getElementById('nothing').hidden ? '' : document.getElementById('nothing').textContent })).catch(() => ({}));
      const st2 = await p.evaluate(() => ({ fight: CITYFIGHT, door: !!document.getElementById('spoilsdoor'), home: !!(NF && NF.homeAt) }));
      ok('E2 *** A LOST FIGHT WAITS TOO *** the same one screen at once, YOU LOST, no loot, and five beats on he is still on it',
        up && e2.word === 'YOU LOST' && e2.loot === 'none' && e2.ground === 0 && !!e2.nothing && st2.fight && st2.door && !st2.home, JSON.stringify(e2) + ' ' + JSON.stringify(st2));
      await SFL.locator('#leave').tap();
      let home2 = false; for (let i = 0; i < 40 && !home2; i++) { home2 = await p.evaluate(() => !CITYFIGHT && !document.getElementById('spoilsdoor')); if (!home2) await p.waitForTimeout(200); }
      ok('    LEAVE (a real tap) takes him home from a loss', home2);
    } else ok('E2 a lost fight waits too', false, 'no second fight');
    ok('D8 nothing threw', errs.length === 0 && serrs.length === 0, errs.concat(serrs).slice(0, 3).join(' | '));
  } catch (e) { ok('the walk ran to the end [' + String(e && e.message).slice(0, 200) + ']', false); }
  try { await d.close(); } catch (_e) {}
  done();
})();
