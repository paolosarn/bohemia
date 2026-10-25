/* ==========================================================================
   A TWO-HANDER WEARS ITS OWN NAME, AND THE PISTOL IS NEVER A CLUB
   (RUN TWO, 10/25/26, VAMILY [a two-hander wears its own name] rule 194 + [the pistol is never a club, the words] rule 195)

   PAOLO 10/25: "I can't make a spear shield wall anymore... I tried to put the spear in the shield and it kept saying this shield
   was like both hands." MEASURED (the coordinator): nobody made the shield two-handed; every spear row was a 'rebar spear' and the
   class holds the two-handed Warfork and Spetum; nine classes mixed hands under one name.
   PAOLO 10/25: "the game still says the pistol is a club at one tile I never asked for that shit." MEASURED: the crew screen said
   every pistol 'REACH 2 TO 4 TILES, A CLUB AT 1', the shop 'a club up close'; the fight shoots from the tile beside him (rule 185).

   LEGS:
     T1 *** NO NAME IS SHARED ACROSS HANDS *** (every row of weapons.json, read through the shop's own naming and the crew
        screen's): a two-hander in a class that holds both is a 'two-hand' one; UI's icon mirror names every row as the shop does
     T2 a two-hander's card at the smith says TWO HANDS in big letters before he buys it (a real tap); a one-hander's does not
     T3 *** THE SPEAR AND THE CAR DOOR ON ONE MAN *** (the demo, the phone): a one-handed spear and a car door from the stash,
        put on with real taps, are both in his hands on the crew screen and in the next fight
     T4 the words blame the weapon: a two-hander and a shield meet and the line says the weapon takes both hands
     T5 *** THE PISTOL IS NEVER A CLUB ***: every gun's reach line starts where the fight's does (rangeLo, 1 for a gun), no 'club'
        word on the crew screen's, the hall's or the shop's lines; a pistol reads 1-4 TILES
     T6 nothing threw
   node gates/a_two_hander_wears_its_own_name_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('A TWO-HANDER WEARS ITS OWN NAME: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const J = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const W = J('records/target/bb/weapons.json').rows, OURS = J('records/target/bb/ours.json');
const hands = r => r.hands ? r.hands | 0 : (/^(bow|crossbow|firearm)$/.test(r['class']) ? 2 : 1);
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
const srv = http.createServer((rq, rs) => { const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); } rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs); });

(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const { chromium } = require('playwright'); const b = await chromium.launch(), errs = [];
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true })).newPage();
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.weaponsReady() && window.BohemiaRoster, null, { timeout: 30000 });
  await p.evaluate(() => BohemiaRoster.load()); await p.waitForFunction(() => BohemiaRoster.data && BohemiaRoster.data.weapons && BohemiaRoster.data.ours, null, { timeout: 30000 });
  /* ---- T1 ---- */
  const names = await p.evaluate((ids) => ids.map(id => ({ id, shop: BohemiaSettlement.weaponName(id), crew: BohemiaRoster.itemOf('weapon', id).name,
    icon: (window.BohemiaMaterials && BohemiaMaterials.itemFromRow) ? BohemiaMaterials.itemFromRow('weapon', BohemiaRoster.data.weapons.rows.find(r => r.id === id), BohemiaRoster.data.weapons.rows).name : null })), W.map(r => r.id));
  const byName = (k) => { const m = {}; names.forEach(n => { const r = W.find(x => x.id === n.id); (m[n[k]] = m[n[k]] || new Set()).add(hands(r)); }); return Object.keys(m).filter(x => m[x].size > 1); };
  const sharedShop = byName('shop'), sharedCrew = byName('crew'), iconOff = names.filter(n => n.icon !== null && n.icon !== n.shop);
  const warfork = names.find(n => n.id === 'warfork'), boar = names.find(n => n.id === 'boar_spear');
  ok('*** T1 NO NAME IS SHARED ACROSS HANDS *** (' + W.length + ' rows through the shop\'s naming and the crew screen\'s; the warfork is "' + (warfork && warfork.shop) + '", the boar spear "' + (boar && boar.shop) + '")',
    sharedShop.length === 0 && sharedCrew.length === 0 && /two-hand/.test(warfork.shop) && !/two-hand/.test(boar.shop) && /two-hand/.test(warfork.crew),
    'shared at the shop: ' + (sharedShop.join(', ') || 'none') + '; on the crew screen: ' + (sharedCrew.join(', ') || 'none'));
  ok('T1b UI\'s icon mirror names every row as the shop does', iconOff.length === 0 && names.every(n => n.icon !== null), iconOff.slice(0, 3).map(n => n.id + ' ' + n.icon + ' / ' + n.shop).join('; ') || W.length + ' of ' + W.length);
  /* ---- T2 a two-hander's card at the smith ---- */
  let t2 = null;
  for (const [name, tier] of [['NELLIS GATE', 'fortress'], ['BLUE DIAMOND', 'town'], ['PRIMM', 'fortress'], ['HENDERSON', 'town'], ['THE WASH', 'fortress'], ['BOULDER', 'town'], ['MESQUITE', 'fortress'], ['JEAN', 'town']]) {
    await p.evaluate(o => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); BohemiaSettlement.open({ place: { name: o.name, tier: o.tier }, traits: [], day: 4, batteries: 3000 }); }, { name, tier });
    await p.waitForTimeout(500);
    for (const k of ['smith', 'arms']) {
      const xy = await p.evaluate((k) => BohemiaSettlement.where(k), k); if (!xy) continue;
      await p.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await p.waitForTimeout(200);
      await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(500);
      const tiles = await p.evaluate(() => [...document.querySelectorAll('#shelfgrid > *')].map((t, i) => ({ i, label: t.getAttribute('aria-label') || t.textContent })));
      for (const t of tiles) {
        const isTwo = /two-hand/i.test(t.label);
        if (!isTwo && t2 && t2.one !== undefined) continue;
        const r = await p.evaluate((i) => { const e = document.querySelectorAll('#shelfgrid > *')[i]; if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, t.i);
        if (!r) continue; await p.mouse.click(r.x, r.y); await p.waitForTimeout(300);
        const card = await p.evaluate(() => { const th = document.querySelector('#sbody .twoh'); const said = (document.querySelector('#sbody .say, #sbody p, #sbody .line') || {}).textContent || document.getElementById('sbody').innerText; return { two: !!(th && th.offsetHeight > 0 && /TWO HANDS/.test(th.textContent)), big: th ? parseFloat(getComputedStyle(th).fontSize) : 0, said: said.slice(0, 160) }; });
        t2 = t2 || {}; if (isTwo && !t2.twoCard) t2.twoCard = Object.assign({ label: t.label }, card); if (!isTwo && t2.one === undefined) t2.one = Object.assign({ label: t.label }, card);
        await p.evaluate((k) => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }, k); await p.waitForTimeout(150); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(400);
        if (t2.twoCard && t2.one) break;
      }
      if (t2 && t2.twoCard && t2.one) break;
    }
    if (t2 && t2.twoCard && t2.one) break;
  }
  ok('T2 a two-hander\'s card at the smith says TWO HANDS in big letters before he buys (a real tap); a one-hander\'s does not',
    !!t2 && !!t2.twoCard && t2.twoCard.two && t2.twoCard.big >= 18 && /both hands/i.test(t2.twoCard.said) && !!t2.one && !t2.one.two, JSON.stringify(t2));
  /* ---- T5 the words ---- */
  const guns = W.filter(r => (OURS.gun_classes.value || []).indexOf(r['class']) >= 0);
  const lines = await p.evaluate((ids) => ids.map(id => { const it = BohemiaRoster.itemOf('weapon', id), a = BohemiaRoster.armOf(it), l = BohemiaRoster.armLine(it, true), s = BohemiaRoster.armLine(it, false); return { id, lo: a && a.lo, club: a && a.club, long: l && l.reach, short: s && s.reach }; }), guns.map(r => r.id));
  const bad5 = lines.filter(l => l.lo !== OURS.gun_min_range.value || l.club || /club/i.test(l.long || ''));
  const shopPistol = await p.evaluate(() => { const r = BohemiaRoster.data.weapons.rows.find(x => x.id === 'dagger'); return r ? BohemiaSettlement.weaponName('dagger') : null; });
  const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8'), plain = (html.match(/var PLAIN = \{pistol:'([^']*)'/) || [])[1] || '';
  const pistol = lines.find(l => l.id === 'dagger');
  ok('*** T5 THE PISTOL IS NEVER A CLUB *** (' + guns.length + ' guns: every reach starts at the fight\'s ' + OURS.gun_min_range.value + ', no club; the pistol "' + (pistol && pistol.long) + '", the shop "' + plain + '")',
    bad5.length === 0 && pistol && pistol.short === '1-4 TILES' && pistol.long === 'REACH 1 TO 4 TILES' && !/club/i.test(plain) && !!shopPistol, bad5.slice(0, 3).map(l => l.id + ' ' + l.lo + ' ' + l.long).join('; ') || 'all');
  ok('T6a nothing threw on the settlement screen', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();

  /* ---- T3, T4 on the demo ---- */
  let d;
  try { d = await drive.open({ keepCards: true, engage: true, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  const P = d.page, fr = d.fr;
  try {
    await P.waitForTimeout(3000);
    /* the stash holds a one-handed spear, a car door and the two-handed warfork, as the shop sells them */
    const A = J('records/target/bb/armor.json'), nm = id => (names.find(n => n.id === id) || {}).shop, wr = id => W.find(r => r.id === id), door = A.shields.find(r => r.id === 'wooden_shield');
    const items = [{ id: 'militia_spear', kind: 'weapon', cls: 'spear', name: nm('militia_spear'), hands: 1, price: Math.max(1, Math.round(wr('militia_spear').value / 10)), nums: '' },
      { id: 'wooden_shield', kind: 'shield', name: 'a car door', price: Math.max(1, Math.round(door.value / 10)), nums: 'holds ' + door.durability },
      { id: 'warfork', kind: 'weapon', cls: 'spear', name: nm('warfork'), hands: 2, price: Math.max(1, Math.round(wr('warfork').value / 10)), nums: '' }];
    await fr.evaluate((items) => { localStorage.setItem('bohemia.bag.v1', JSON.stringify(items)); }, items);   /* as the shop sells them (its names, T1) */
    let tapped = false;
    for (const f of P.frames()) { const h = await f.$('.crew[role=button]').catch(() => null); if (!h) continue; const bx = await h.boundingBox().catch(() => null); if (!bx) continue; await P.touchscreen.tap(bx.x + bx.width / 2, bx.y + bx.height / 2); tapped = true; break; }
    let rf = null; for (let k = 0; k < 50 && !rf; k++) { await P.waitForTimeout(300); rf = P.frames().find(x => /ROSTER_SCREEN/.test(x.url())); }
    await rf.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready && BohemiaRosterScreen.state.bag.length >= 3, null, { timeout: 20000 }).catch(() => {});
    await P.waitForTimeout(800);
    const tapBag = async (id) => { for (let t = 0; t < 2; t++) { const r = await rf.evaluate((id) => { const S = BohemiaRosterScreen.state, i = S.bag.findIndex(x => x && x.id === id); if (i < 0) return null; const e = document.querySelector('#bag [data-bag="' + i + '"]'); if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, id);
      if (!r) return false; const fb = await (await rf.frameElement()).boundingBox(); await P.touchscreen.tap(fb.x + r.x, fb.y + r.y); await P.waitForTimeout(350); } return true; };
    /* T4 first: the warfork in his hands, then the car door: the line blames the warfork */
    await tapBag('warfork');
    const t4a = await rf.evaluate(() => (BohemiaRosterScreen.state.crew[BohemiaRosterScreen.state.sel].gear.main || {}).id);
    await tapBag('wooden_shield');
    const t4 = await rf.evaluate(() => ({ said: document.getElementById('said') ? document.getElementById('said').textContent : document.body.innerText.slice(0, 300), main: (BohemiaRosterScreen.state.crew[BohemiaRosterScreen.state.sel].gear.main || {}).id, off: (BohemiaRosterScreen.state.crew[BohemiaRosterScreen.state.sel].gear.off || {}).id }));
    ok('T4 the words blame the weapon: the two-hand rebar spear in his hands, then a car door: "' + String(t4.said).replace(/\s+/g, ' ').slice(0, 140) + '"',
      t4a === 'warfork' && /two-hand rebar spear takes both hands/i.test(t4.said) && !/shield (is|takes) both/i.test(t4.said), JSON.stringify({ first: t4a, then: { main: t4.main, off: t4.off } }));
    /* T3: the one-handed spear and the car door on the same man */
    await tapBag('militia_spear'); await tapBag('wooden_shield');
    const man = await rf.evaluate(() => { const S = BohemiaRosterScreen.state, m = S.crew[S.sel]; return { name: m.name, main: (m.gear.main || {}).id, mainName: (m.gear.main || {}).name, off: (m.gear.off || {}).id }; });
    if (process.env.BOHEMIA_SHOT_DIR) await P.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'spear_and_door.png') });
    await rf.evaluate(() => { const b = document.getElementById('done'); if (b) b.click(); }).catch(() => {}); await P.waitForTimeout(800);
    await fr.evaluate(() => { try { stepOnce(0); stepOnce(4); } catch (_e) {} roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: Date.now() % 1000 }); });
    let f = null; for (let i = 0; i < 150 && !f; i++) { const h = await P.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f = c; } if (!f) await P.waitForTimeout(200); }
    const u = f ? await f.evaluate((n) => { const u = FIGHT.S.units.find(x => x.side === 'you' && x.name === n); return u ? { weapon: u.weapon && (u.weapon.id || u.weapon.name), cls: u.weapon && u.weapon['class'], shield: u.shield && u.shield.id, back: !!u.shieldBack } : null; }, man.name) : null;
    ok('*** T3 THE SPEAR AND THE CAR DOOR ON ONE MAN *** (real taps on the crew screen: ' + man.name + ' holds the ' + man.mainName + ' and the car door; in the fight: ' + JSON.stringify(u) + ')',
      tapped && man.main === 'militia_spear' && man.off === 'wooden_shield' && !!u && u.cls === 'spear' && u.shield === 'wooden_shield' && !u.back);
    if (f) { await f.evaluate(() => { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {}); }
    ok('T6b nothing threw on the demo', d.errs.length === 0, d.errs.slice(0, 2).join(' | '));
  } catch (e) { ok('the demo legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  await d.close();
  done();
})();
