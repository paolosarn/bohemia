/* ==========================================================================
   THE SHOP SAYS WHAT IT DOES TO YOUR MAN  (RUN TWO, 10/25/26, VAMILY [the shop says what it does to your man], rule 202)

   PAOLO 10/25: "in the shop you cannot just say how many batteries it costs without saying the stat it does, how much it helps
   your stats... when you wear the shield it reflects in your stats."
   MEASURED BEFORE: a shield's card said 'holds 16 weight 4' and never its melee or ranged defence; every shield under 40 was
   'a car door'; nothing said what a thing would do to a man; the crew screen showed his numbers without what he wears.
   NOW (__THE_SHOP_SAYS_WHAT_IT_DOES__): the card shows the thing's own numbers with UI's stat icons, then what it does ON ONE OF
   HIS MEN (before and after, green and red, his face in a strip, a tap shows another man), read by engine/bohemia_roster.js
   worn(), the one source the crew screen and the fight's makeUnit share; every shield, armour and helmet row its own name.

   LEGS, on the demo through Church's own door, real taps:
     N1 every shield, armour and helmet row its own name (records/target/bb/armour_names.json), no two alike, each with the
        object it is drawn as (the market's bucket, COOK's model, UI's icon); the shop, the crew screen's items and UI's icons
        agree on every row
     C1 a shield's card: MELEE DEF, RANGED DEF, HOLDS, FATIGUE with UI's stat icons, each equal to armor.json's row
     C2 *** ON A MAN ***: the card names one of his men and his numbers before and after, each equal to a sum done here from the
        files (his own numbers, the shield's, Shield Expert's quarter, the fight's two-hander rule), green better, red worse
     C3 a tap on another face in the strip shows it on that man
     C4 an armour card (ARMOUR, FATIGUE, INITIATIVE from the row) and a weapon card (DAMAGE the fight's own row: a pistol's shot)
     W1 *** WORN *** bought onto that man by a real tap (rule 210, BUY wears it; re-aimed 10/26): his MELEE DEF and RANGED DEF on the crew
        screen are exactly the shop's numbers
     F1 *** THE FIGHT AGREES ***: the fight the game hands that company stands him with the same melee and ranged defence, fatigue
        and initiative
     K1 the computer: the card's numbers and the man, a face clicked
     Z  nothing threw
   node gates/the_shop_says_what_it_does_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const { openCrew } = require(path.join(ROOT, 'tools/bohemia_open_the_crew.js'));
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb', f), 'utf8'));
const A = J('armor.json'), W = J('weapons.json'), PERKS = J('perks.json'), NAMES = J('armour_names.json');
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('THE SHOP SAYS WHAT IT DOES TO YOUR MAN: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* the oracle, written here from the files and the fight's own rules (slices/BOHEMIA_FIGHT.html shieldDef, gearFat, bagFat,
   fatMax, curIni at rest, the two-hander putting the shield on his back), never read from the screen it checks */
const row = (k, id) => (k === 'weapon' ? W.rows : k === 'shield' ? A.shields : A[k]).find(r => r.id === id) || null;
const perkN = (perks, id) => (perks || []).indexOf(id) >= 0 ? (PERKS.rows.find(r => r.id === id) || {}).numbers || {} : null;
const twoH = r => !!r && (r.hands === 2 || (r.hands == null && ['bow', 'crossbow', 'firearm'].indexOf(r['class']) >= 0));
function oracle(man, OURS) {
  const g = man.gear || {}, P = OURS.pistol_shot.value;
  const wpn = id => { const w = row('weapon', id); if (!w) return null; const r = w['class'] === P['class'] && P.by_row[w.id] ? row('weapon', P.by_row[w.id]) : null; return r ? Object.assign({}, r, { fatigue: w.fatigue, of: w }) : w; };
  const w = wpn(g.main); let sh = row('shield', g.off); const body = row('body', g.body), head = row('head', g.head);
  if (sh && w && twoH(w.of || w)) sh = null;
  const se = perkN(man.perks, 'shield_expert'), sx = se ? 1 + se.shield_defense_bonus_increase_pct / 100 : 1;
  const br = perkN(man.perks, 'brawny'), bb = perkN(man.perks, 'bags_and_belts');
  const f = [w, sh].reduce((t, x) => t + (x && typeof x.fatigue === 'number' ? x.fatigue : 0), 0), wo = [body, head].reduce((t, x) => t + (x && typeof x.fatigue === 'number' ? x.fatigue : 0), 0);
  const gf = f + (br ? wo * (1 - br.armor_fatigue_initiative_penalty_reduction_pct / 100) : wo);
  const bag = (Array.isArray(g.bag) ? g.bag : []).reduce((t, id) => { const x = wpn(id) || row('shield', id); return !x || typeof x.fatigue !== 'number' ? t : t + x.fatigue * (bb && !twoH(x.of || x) ? 0 : 0.5); }, 0);
  const s = man.stats;
  return { melee_defense: Math.round(s.melee_defense + (sh ? sh.melee_defense * sx : 0)), ranged_defense: Math.round(s.ranged_defense + (sh ? sh.ranged_defense * sx : 0)),
    fatigue: Math.max(0, Math.round(s.fatigue + gf + bag)), initiative: Math.round(s.initiative + gf) };
}
const bucket = (k, d) => k === 'head' ? (d < 40 ? 'rag hood' : d < 100 ? 'hard hat' : d < 180 ? 'riot helmet' : 'full riot helm')
  : k === 'shields' ? (d < 40 ? 'car door' : 'riot shield') : (d < 40 ? 'work jacket' : d < 100 ? 'padded vest' : d < 180 ? 'plate carrier' : 'full riot armour');
const OBJ = ['work jacket', 'padded vest', 'plate carrier', 'full riot armour', 'rag hood', 'hard hat', 'riot helmet', 'full riot helm', 'car door', 'riot shield'];
const objOf = n => OBJ.filter(o => n.toLowerCase().indexOf(o) >= 0).sort((a, b) => b.length - a.length)[0] || null;

async function town(d) {
  const P = d.page, fr = d.fr;
  await P.waitForTimeout(3000);
  await fr.evaluate(() => { loopSettleBats(Math.max(loopBats(), 3000), 'the gate'); const bs = ctBases(), names = Object.keys(bs), t0 = names.find(k => /church/i.test(k)) || names[0], t = { name: t0, x: bs[t0].x, y: bs[t0].y, tier: mapTierOf(t0) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
  let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp && BohemiaSettlement.namesIn() && BohemiaSettlement.weaponsReady(); } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
  if (sf) await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {});
  return sf;
}
function taps(d, sf, mouse) {
  const P = d.page;
  const tapAt = async (x, y) => { if (mouse) await P.mouse.click(x, y); else await P.touchscreen.tap(x, y); };
  const box = async () => (await sf.frameElement()).boundingBox();
  const tapSel = async (sel) => { const r = await sf.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, sel); if (!r) return false; const b = await box(); await tapAt(b.x + r.x, b.y + r.y); await P.waitForTimeout(700); return true; };
  const openShop = async (k) => { await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(300);
    for (let i = 0; i < 8; i++) { if (await sf.evaluate(k => BohemiaSettlement.state.open === k && !!document.querySelector('#shelfgrid'), k)) return true; const w = await sf.evaluate(k => BohemiaSettlement.where(k), k); const b = await box(); if (w) await tapAt(b.x + w.x, b.y + w.y); await P.waitForTimeout(900); } return false; };
  /* RE-AIMED 10/26 (RUN TWO [one tap selects, two taps buy]): a tile is found by its own id (a piece bought leaves its place empty) */
  const tapItem = async (k, id) => tapSel('#shelfgrid .slot[data-id="' + id + '"]');
  const card = () => sf.evaluate(() => { const q = s => [...document.querySelectorAll(s)];
    const chips = q('#sbody .inums .ch').map(c => ({ stat: c.dataset.stat || null, icon: !!(c.querySelector('img') && c.querySelector('img').complete && c.querySelector('img').naturalWidth > 0 && /stat_icons\//.test(c.querySelector('img').src)), text: c.textContent.replace(/\s+/g, ' ').trim() }));
    const om = document.querySelector('#sbody .onman');
    const lines = q('#sbody .onman .ln').map(l => ({ k: l.dataset.k, before: l.dataset.before, after: l.dataset.after, delta: +l.dataset.delta, cls: (l.querySelector('.d') || {}).className, text: l.textContent.replace(/\s+/g, ' ').trim() }));
    /* RE-AIMED 10/26: the numbers come before the price in the page's own order (the strip: the piece's numbers, then the button with its price) */
    const nEl = document.querySelector('#sbody .inums'), bEl = q('#sbody .act').find(a => /Buy it/.test(a.textContent)), iNums = nEl ? 0 : -1, iBuy = nEl && bEl && (nEl.compareDocumentPosition(bEl) & Node.DOCUMENT_POSITION_FOLLOWING) ? 1 : -1;
    return { chips, man: om ? om.dataset.man : null, who: om ? (om.querySelector('.onwho') || om.querySelector('.who') || {}).textContent || '' : '', lines, faces: q('#shopfaces button').map(b => b.dataset.man), on: (document.querySelector('#shopfaces button.on') || {}).dataset ? document.querySelector('#shopfaces button.on').dataset.man : null,
      stop: q('#sbody .onman .stop').map(e => e.textContent).join(' '), numsBeforeBuy: iNums >= 0 && iBuy > iNums, shown: BohemiaSettlement.state.shopShown }; });
  return { tapAt, tapSel, openShop, tapItem, card, box };
}

(async () => {
  const OURS = J('ours.json');
  /* ---------------- the phone ---------------- */
  let d = await drive.open({ profile: 'phone_portrait', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  try {
    const sf = await town(d); if (!sf) { ok('a town through the map\'s door', false); return done(); }
    const T = taps(d, sf, false);
    if (!(await T.openShop('armourer'))) { ok('the armourer opens', false); return done(); }   /* a shop reads the roster's files (hireLoad) */
    await sf.waitForFunction(() => window.BohemiaRoster && BohemiaRoster.data && BohemiaRoster.data.armor && BohemiaRoster.data.names !== undefined && BohemiaRoster.worn, null, { timeout: 30000 }).catch(() => {});
    /* N1 */
    const n1 = await sf.evaluate((A) => { const out = [], C = BohemiaRoster;
      [['shields', 'shield'], ['body', 'body'], ['head', 'head']].forEach(([k, ck]) => A[k].forEach(r => out.push({ k, id: r.id, dur: r.durability, shop: BohemiaSettlement.itemName(k, r.id), crew: (C.itemOf(ck, r.id) || {}).name, icon: BohemiaMaterials.itemFromRow(k, r).name })));
      return out; }, { shields: A.shields, body: A.body, head: A.head });
    const names = n1.map(x => x.shop), dup = names.filter((n, i) => names.indexOf(n) !== i), off = n1.filter(x => objOf(x.shop || '') !== bucket(x.k, x.dur)), dis = n1.filter(x => x.shop !== x.crew || x.shop !== x.icon), nofile = n1.filter(x => !NAMES[x.k] || NAMES[x.k][x.id] !== x.shop);
    ok('N1 every shield, armour and helmet row its own name (' + n1.length + '), none alike, each the object it is drawn as; the shop, the crew screen and UI\'s icons agree',
      n1.length === A.shields.length + A.body.length + A.head.length && !dup.length && !off.length && !dis.length && !nofile.length,
      dup.length ? 'alike: ' + dup.slice(0, 3) : off.length ? 'object: ' + off.slice(0, 3).map(x => x.id + '=' + x.shop).join(', ') : dis.length ? 'disagree: ' + JSON.stringify(dis.slice(0, 2)) : nofile.length ? 'not the file: ' + nofile.slice(0, 3).map(x => x.id) : n1.filter(x => x.k === 'shields').map(x => x.shop).slice(0, 5).join(', ') + '...');
    /* the pair to try: a shield on the shelf and a man it changes */
    await T.openShop('armourer');
    const pair = await sf.evaluate(() => { const C = BohemiaRoster, crew = BohemiaSettlement.shopCrew(), sh = (BohemiaSettlement.state.stock.armourer || []).filter(i => i.kind === 'shield');
      for (const it of sh) for (const m of crew) { const w = C.wearing(m, it); if (!w.stops && w.after.melee_defense !== w.before.melee_defense) return { item: it.id, man: m.name, crew: crew.map(c => c.name) }; }
      return { item: sh[0] && sh[0].id, man: null, crew: crew.map(c => c.name), shields: sh.map(i => i.id) }; });
    if (!pair.item) { ok('the armourer has a shield on the shelf', false, JSON.stringify(pair)); return done(); }
    await T.tapItem('armourer', pair.item);
    const sr = row('shield', pair.item), c1 = await T.card();
    const chip = (st) => c1.chips.find(c => c.stat === st);
    const num = c => c ? +String(c.text).replace(/^[^+\-\d]*/, '').replace(/[^\d+\-]/g, '') : NaN;
    ok('C1 a shield\'s card: MELEE DEF, RANGED DEF, HOLDS, FATIGUE with UI\'s stat icons, each the row\'s own, before the price (' + c1.chips.map(c => c.text).join(' | ') + ')',
      !!chip('melee_defense') && chip('melee_defense').icon && num(chip('melee_defense')) === sr.melee_defense && !!chip('ranged_defense') && chip('ranged_defense').icon && num(chip('ranged_defense')) === sr.ranged_defense
      && c1.chips.some(c => c.text === 'HOLDS ' + sr.durability) && !!chip('fatigue') && chip('fatigue').icon && num(chip('fatigue')) === (sr.fatigue || 0) && c1.numsBeforeBuy);
    /* C2: tap the man it changes (or keep the one shown) and check every line against the oracle */
    if (pair.man && c1.man !== pair.man) await T.tapSel('#shopfaces button[data-man="' + pair.man + '"]');
    const c2 = await T.card();
    const crew = await sf.evaluate(() => BohemiaSettlement.shopCrew());
    const him = crew.find(m => m.name === c2.man), lines = {};
    c2.lines.forEach(l => lines[l.k] = l);
    let o0 = null, o1 = null, bad2 = [];
    if (him) { o0 = oracle(him, OURS); const g2 = Object.assign({}, him.gear, { off: pair.item }); o1 = oracle(Object.assign({}, him, { gear: g2 }), OURS);
      ['melee_defense', 'ranged_defense', 'fatigue', 'initiative'].forEach(k => { const l = lines[k];
        if (!l || +l.before !== o0[k] || +l.after !== o1[k] || l.delta !== o1[k] - o0[k] || (l.delta > 0 && !/up/.test(l.cls)) || (l.delta < 0 && !/dn/.test(l.cls))) bad2.push(k + ' ' + (l ? l.before + '->' + l.after : 'none') + ' want ' + o0[k] + '->' + o1[k]); }); }
    ok('*** C2 ON A MAN *** (' + c2.who + ': ' + c2.lines.map(l => l.text).join(' / ') + ')', !!him && !!pair.man && !bad2.length && c2.faces.length === crew.length && c2.on === c2.man, bad2.join('; ') || (pair.man ? '' : 'no man this shelf changes: ' + JSON.stringify(pair)));
    /* C3 */
    const other = c2.faces.find(n => n !== c2.man);
    if (other) await T.tapSel('#shopfaces button[data-man="' + other + '"]');
    const c3 = await T.card(), o3m = crew.find(m => m.name === other);
    const o3 = o3m ? oracle(Object.assign({}, o3m, { gear: Object.assign({}, o3m.gear, { off: pair.item }) }), OURS) : null, l3 = (c3.lines.find(l => l.k === 'melee_defense') || {});
    const o3stops = o3m && (() => { const w = row('weapon', o3m.gear.main); return twoH(w); })();
    ok('C3 a tap on ' + other + '\'s face shows it on him (' + c3.who + ': ' + (c3.lines.map(l => l.text).join(' / ') || c3.stop) + ')', !!other && c3.man === other && c3.on === other && (o3stops ? /both hands/.test(c3.stop) : (l3.k ? +l3.after === o3.melee_defense : !!c3.shown && !!c3.shown.after && c3.shown.after.melee_defense === o3.melee_defense)));   /* RE-AIMED 10/26 (rule 251(a)): a stat that does not change has no line; the strip's own numbers say it */
    /* C4: an armour card and a weapon card */
    const arm = await sf.evaluate(() => (BohemiaSettlement.state.stock.armourer || []).find(i => i.kind === 'body' || i.kind === 'head'));
    let c4a = null; if (arm) { await T.openShop('armourer'); await T.tapItem('armourer', arm.id); c4a = await T.card(); }
    const ar = arm && row(arm.kind, arm.id), fA = ar && (ar.fatigue || 0);
    const a4 = !!c4a && c4a.chips.some(c => c.text === 'ARMOUR ' + ar.durability) && c4a.chips.some(c => c.stat === 'fatigue' && c.icon && num(c) === fA) && c4a.chips.some(c => c.stat === 'initiative' && c.icon && num(c) === fA)
      && c4a.lines.some(l => l.k === (arm.kind === 'head' ? 'armour_head' : 'armour_body'));
    await T.openShop('smith');
    const gun = await sf.evaluate(() => { const P = BohemiaRoster.data.ours.pistol_shot.value, sh = BohemiaSettlement.state.stock.smith || []; return sh.find(i => i.cls === P['class'] && P.by_row[i.id]) || sh[0]; });
    await T.tapItem('smith', gun.id); const c4w = await T.card();
    const wr = row('weapon', gun.id), P = OURS.pistol_shot.value, fr0 = wr['class'] === P['class'] && P.by_row[wr.id] ? row('weapon', P.by_row[wr.id]) : wr;
    const w4 = c4w.chips.some(c => c.text === 'DAMAGE ' + fr0.damage_min + '-' + fr0.damage_max) && c4w.lines.some(l => l.k === 'damage' && l.after === fr0.damage_min + '-' + fr0.damage_max);
    ok('C4 an armour card (' + (c4a ? c4a.chips.map(c => c.text).join(' | ') : 'none on the shelf') + ') and a weapon card, the fight\'s own damage (' + c4w.chips.map(c => c.text).join(' | ') + ')', a4 && w4);
    /* W1: buy the shield, put it on him on the crew screen by real taps */
    const target = pair.man;
    await T.openShop('armourer'); await T.tapItem('armourer', pair.item);
    if (target) { const cc = await T.card(); if (cc.man !== target) await T.tapSel('#shopfaces button[data-man="' + target + '"]'); }
    const promised = (await T.card()).shown;
    /* RE-AIMED 10/26 (RUN TWO [what you buy goes on the man], rule 210): BUY puts it straight on the man the card shows, so W1
       buys it on him and reads the crew screen with no drag (THE BUY-AND-WEAR legs are WHAT YOU BUY GOES ON THE MAN's) */
    const bought = await T.tapSel('#buywear');
    const inBag = await sf.evaluate(([id, n]) => !BohemiaSettlement.state.stash.some(i => i.id === id) && BohemiaSettlement.shopCrew().some(m => m.name === n && m.gear && (m.gear.off && (m.gear.off.id || m.gear.off)) === id), [pair.item, target]);
    await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await d.page.waitForTimeout(300);
    /* the crew: the one CREW on screen, the phone's since UI TWO 52741663 (the bar's crew chip a readout), else the bar's crew tag
       over a town (UI's [one HUD everywhere] presses the town's own CREW), else the town's CREW */
    if (!(await openCrew(d.page, d.fr))) await T.tapSel('#crew');
    let rf = null; for (let k = 0; k < 60 && !rf; k++) { await d.page.waitForTimeout(300); rf = d.page.frames().find(x => /ROSTER_SCREEN/.test(x.url())); }
    let crewRead = null;
    if (rf) {
      await rf.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready && BohemiaRosterScreen.state.crew.length > 0, null, { timeout: 30000 }).catch(() => {});
      await d.page.waitForTimeout(1000);
      const rbox = async () => (await rf.frameElement()).boundingBox();
      const rtap = async (sel) => { const r = await rf.evaluate(sel => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, sel); if (!r) return false; const b = await rbox(); await d.page.touchscreen.tap(b.x + r.x, b.y + r.y); await d.page.waitForTimeout(500); return true; };
      const mi = await rf.evaluate(n => BohemiaRosterScreen.state.crew.findIndex(m => m.name === n), target);
      await rtap('#lines .cell[data-man="' + mi + '"]');
      crewRead = await rf.evaluate(n => { const S = BohemiaRosterScreen.state, m = S.crew.find(x => x.name === n), v = {};
        document.querySelectorAll('#card .stats [data-stat]').forEach(r => v[r.dataset.stat] = +r.dataset.shown);
        const co = JSON.parse(localStorage.getItem('bohemia.company.v1') || 'null') || [];
        return { sel: S.crew[S.sel] && S.crew[S.sel].name, off: m && m.gear.off && m.gear.off.id, shown: v, handed: (co.find(x => x.name === n) || {}).gear }; }, target);
    }
    ok('*** W1 WORN *** (bought onto him ' + (bought && inBag) + '; on ' + target + ' on the crew screen: MELEE DEF ' + (crewRead && crewRead.shown.melee_defense) + ', RANGED DEF ' + (crewRead && crewRead.shown.ranged_defense) + '; the shop said ' + (promised && promised.after.melee_defense) + ', ' + (promised && promised.after.ranged_defense) + ')',
      !!target && bought && inBag && !!crewRead && crewRead.sel === target && crewRead.off === pair.item && !!promised && promised.man === target
      && crewRead.shown.melee_defense === promised.after.melee_defense && crewRead.shown.ranged_defense === promised.after.ranged_defense
      && crewRead.shown.fatigue === promised.after.fatigue && crewRead.shown.initiative === promised.after.initiative && !!crewRead.handed && crewRead.handed.off === pair.item, JSON.stringify(crewRead && crewRead.shown));
    /* F1: the fight the game hands that company */
    const opts = await d.page.evaluate(() => JSON.parse(JSON.stringify(nfOpts({ district: 'downtown', world: { night: false, day: 3 }, at: { gx: 4, gy: 4 }, party: { count: 2, days: 1, faction: 'brigands', difficulty: 0 } }))));
    const base = d.page.url().replace(/slices\/.*$/, '');
    const f = await d.ctx.newPage(); const ferr = []; f.on('pageerror', e => ferr.push(e.message));
    await f.addInitScript(o => { window.FIGHT_OPTS = Object.assign({ seed: 41, speed: 1, auto: false }, o); }, opts);
    await f.goto(base + 'slices/BOHEMIA_FIGHT.html');
    await f.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length, null, { timeout: 60000 }).catch(() => {});
    const fu = await f.evaluate(n => { if (typeof FIGHT === 'undefined' || !FIGHT.S) return null; const u = FIGHT.S.units.find(v => v.side === 'you' && v.name === n); if (!u) return null;
      const se = FIGHT._t.PK(u, 'shield_expert'), sx = se ? 1 + se.shield_defense_bonus_increase_pct / 100 : 1;
      return { shield: u.shield && u.shield.id, melee_defense: Math.round(u.mdef + (u.shield ? u.shield.melee_defense * sx : 0)), ranged_defense: Math.round(u.rdef + (u.shield ? u.shield.ranged_defense * sx : 0)),
        fatigue: FIGHT.fatMax(u), initiative: Math.round(u.initiative + FIGHT._t.gearFat(u)) }; }, target);
    await f.close();
    ok('*** F1 THE FIGHT AGREES *** (' + target + ' in the fight: ' + JSON.stringify(fu) + ')', !!fu && !!promised && fu.shield === pair.item && ['melee_defense', 'ranged_defense', 'fatigue', 'initiative'].every(k => fu[k] === promised.after[k]) && !ferr.length, ferr.slice(0, 2).join(' | '));
    if (process.env.BOHEMIA_SHOT_DIR) { await T.openShop('armourer'); await d.page.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'shop_says_phone.png') }); }
  } catch (e) { ok('the phone legs ran [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  ok('Z1 nothing threw on the phone', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  /* ---------------- the computer ---------------- */
  d = await drive.open({ profile: 'computer', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  try {
    const sf = await town(d); if (!sf) { ok('K1 a town through the map\'s door on the computer', false); }
    else {
      const T = taps(d, sf, true);
      await T.openShop('armourer');
      await sf.waitForFunction(() => window.BohemiaRoster && BohemiaRoster.data && BohemiaRoster.data.armor && BohemiaRoster.worn, null, { timeout: 30000 }).catch(() => {});
      const sh = await sf.evaluate(() => (BohemiaSettlement.state.stock.armourer || []).find(i => i.kind === 'shield'));
      await T.tapItem('armourer', sh.id); const k1 = await T.card();
      const other = k1.faces.find(n => n !== k1.man); if (other) await T.tapSel('#shopfaces button[data-man="' + other + '"]');
      const k2 = await T.card(), r = row('shield', sh.id);
      ok('K1 the computer: the shield\'s numbers (' + k1.chips.map(c => c.text).join(' | ') + '), on ' + k1.man + ', a face clicked shows ' + k2.man,
        k1.chips.some(c => c.stat === 'melee_defense' && c.icon && c.text === 'MELEE DEF +' + r.melee_defense) && !!k1.man && (k1.lines.length > 0 || /both hands/.test(k1.stop)) && !!other && k2.man === other);
    }
  } catch (e) { ok('the computer legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  ok('Z2 nothing threw on the computer', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  done();
})();
