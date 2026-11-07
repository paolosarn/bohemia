/* ==========================================================================
   EACH ORIGIN ITS OWN  (ORIGINS, 11/7/26, VAMILY rule 427(c), asks 103 and 233; RUN THREE's [each origin its own], RUN TWO's
   [eyes: the god is too heavy])

   PAOLO (10/26 and 11/7): "what makes each origin unique, unique shit you can buy, how their shit looks... it all looks the same
   right now"; "every origin starts like itself and gets personal: its own look, things only it can buy, its own way of playing...
   the Lone Wolf a gilded god... really felt in the fight."
   MEASURED BEFORE (RUN THREE's step 1, records/BOHEMIA_RUN3_EACH_ORIGIN_ITS_OWN_HOW_BATTLE_BROTHERS_DOES_IT_10_26_26.md): every
   origin's men wore the same clothes, its start town sold what every town sells, and none of its Battle Brothers rules ran. The Lone
   Wolf's kit left him 53 of 117 breath; he won 16 of 30 against six thugs and 14 of 30 against three dire wolves (the live fight,
   AUTO, seeded).

   LEGS
     O1 THE FILE: all fifteen origins carry a 'personal' block in records/target/bb/origins.json (look, shelf, rule with Battle
        Brothers' words and source, 'does' only in the known levers); every piece is a real armour row of that origin
     O2 *** THEIR OWN ART *** (rule 337): every origin piece has its own model on the wear sheet, eight facings (a helmet also dropped
        and at portrait size), rendered by the rig, not its class's placeholder
     O3 THE NUMBERS: each piece is the armory's mean of its two Battle Brothers rows (the Lone Wolf's two Battle Brothers' own golden
        named pieces); every man of every origin walks in wearing his origin's own (the rolled door, 20 games each)
     O4 *** THE RULES RUN, AND ONLY WITH THE ORIGIN *** (the live fight headless, each against its control without the rule): the
        deserters act first in round one; the lab rats never reach confident; the faithful never flee; a debtor near a collector stops
        at wavering; the promise keepers' standard lends nerve near its bearer; the raiders' second look finds more; the hunters'
        kill gives an extra hide half the time
     O5 *** THE GILDED GOD, FELT IN THE FIGHT *** (rolled as the door rolls him, alone on the live fight, AUTO): Battle Brothers' Lone
        Wolf and Fearsome on top of his levels, his Player Character resolve, the gilded kit; breath never stops a swing; he wins the
        day-one fights the old kit lost
     O6 *** ON THE DEMO, PHONE ***: a new game as THE WATER TRUCK opens in its home town, whose armourer sells its two pieces first
        at the Trader's price; another town sells neither; its men walk into a fight wearing them, drawn as their own; the scavengers'
        map counts, the Block Watch's post deals no rare man (each against its control)
     O7 ON THE DEMO, COMPUTER: THE LONE WOLF in his gilded kit with his gifts in the fight; the door says the true line
     O8 nothing threw
   PLANTED FAIL: ORIGINS_PLANT=1 takes the deserters' rule and one piece's model out of the gate's copy of the files; O1, O2 and O4 go
   red and the gate exits 1 (run it: the gate is not a mirror).
   node gates/each_origin_its_own_gate.js     (GATE_ONLY=node runs the file, art, numbers, rules and the wolf; no browser)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('EACH ORIGIN ITS OWN: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const PLANT = !!process.env.ORIGINS_PLANT, ONLY = process.env.GATE_ONLY || '';
const SHOTS = process.env.BOHEMIA_SHOT_DIR || null;

const FILE = J('records/target/bb/origins.json'), ARM = J('records/target/bb/armor.json'), ARMORY = J('records/target/bb/armory.json');
const LOOKS = J('records/target/bb/armour_looks.json'), WEAR = J('slices/wear/wear.json');
if (PLANT) {   /* the planted fail: the deserters' rule gone, the hi-vis vest's model gone */
  FILE.origins.find(o => o.id === 'desert').personal.rule.does = {};
  delete WEAR.pieces.own_truck_hi_vis_vest;
}
const KNOWN = ['buy_mult', 'sell_mult', 'no_rare_hires', 'first_round', 'never_confident', 'never_flees', 'standard', 'whip', 'loot_second_look', 'trophy_extra_pct', 'exact_count', 'start', 'wage', 'gifts', 'resolve_add'];
const rowOf = id => { for (const k of ['body', 'head']) { const r = ARM[k].find(x => x.id === id); if (r) return [k, r]; } return [null, null]; };
const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];

(async () => {
  /* ---------------- O1 the file ---------------- */
  {
    const bad = [];
    FILE.origins.forEach(o => {
      const P = o.personal; if (!P) { bad.push(o.id + ': no personal'); return; }
      const w = P.look && P.look.wears, s = P.shelf, r = P.rule;
      if (!w || !w.body) bad.push(o.id + ': no look');
      if (!s || s.where !== 'home' || !Array.isArray(s.pieces) || s.pieces.length < 2) bad.push(o.id + ': shelf under two');
      (s && s.pieces || []).forEach(id => { const [k, row] = rowOf(id); if (!row || !row.armory || row.armory.origin !== o.id) bad.push(o.id + ': ' + id + ' not its own row'); });
      if (!r || !r.id || !r.name || !r.says || !r.bb || !r.source || typeof r.does !== 'object') bad.push(o.id + ': rule incomplete');
      Object.keys((r && r.does) || {}).forEach(k => { if (KNOWN.indexOf(k) < 0) bad.push(o.id + ': unknown lever ' + k); });
      if (r && r.says && r.says.split(/[.!?](\s|$)/).filter(x => x && x.trim()).length > 3) bad.push(o.id + ': says too long');
      if (/vegas/i.test(JSON.stringify(P))) bad.push(o.id + ': says Vegas (rule 362)');
    });
    const ruled = FILE.origins.filter(o => Object.keys(o.personal && o.personal.rule && o.personal.rule.does || {}).length > 0).map(o => o.id);
    ok('O1 THE FILE: all fifteen origins carry their look, their home shelf (two or more of their own pieces) and their rule (Battle Brothers\' words and source; ' + ruled.length + ' of 15 with a lever that runs, the plain start and the dead crew\'s owed named)',
      bad.length === 0 && FILE.origins.length === 15 && ruled.length >= 13 && (!PLANT || ruled.indexOf('desert') >= 0), bad.slice(0, 5).join('; ') || ruled.join(' '));
  }
  /* ---------------- O2 their own art ---------------- */
  {
    const { PNG } = (() => { try { return { PNG: null }; } catch (e) { return {}; } })();
    const pieces = [];
    FILE.origins.forEach(o => (o.personal.shelf.pieces || []).forEach(id => pieces.push(id)));
    const bad = [];
    pieces.forEach(id => {
      const [k] = rowOf(id), L = (LOOKS[k] || {})[id] || {}, key = 'own_' + id, cells = WEAR.pieces[key];
      if (L.own !== key) bad.push(id + ' draws no own model');
      if (!cells) { bad.push(id + ' not on the sheet'); return; }
      const need = DIRS.concat(k === 'head' ? ['drop', 'portrait'] : []);
      need.forEach(f => { const c = cells[f]; if (!c || c[2] < 4 || c[3] < 4) bad.push(id + ' ' + f); });
    });
    /* not the placeholder: the S cell of each own piece is not the class's S cell (a different place on the sheet, a different size) */
    const same = pieces.filter(id => { const [k] = rowOf(id), cls = (LOOKS[k] || {})[id] && LOOKS[k][id]['class'], a = (WEAR.pieces['own_' + id] || {}).S, b = (WEAR.pieces[cls] || {}).S;
      return a && b && a[0] === b[0] && a[1] === b[1]; });
    const P = J('records/target/cook_armour_rig/pieces.json'), unrun = pieces.filter(id => !(P['own_' + id] && P['own_' + id].rig === 'master rig light_and_film + source_pass' && (P['own_' + id].own_art || []).length >= 2));
    ok('*** O2 THEIR OWN ART *** (rule 337): ' + pieces.length + ' origin pieces, each its own model on the wear sheet (eight facings, a helmet also dropped and at portrait size), rendered by the master rig with its own parts named, never its class\'s placeholder',
      pieces.length >= 30 && !bad.length && !same.length && !unrun.length, (bad.concat(same.map(x => x + ' is the placeholder'), unrun.map(x => x + ' no rig run'))).slice(0, 5).join('; ') || pieces.length + ' pieces');
  }
  /* ---------------- O3 the numbers and the door ---------------- */
  const AY = (() => { const r5 = x => x >= 0 ? Math.floor(x / 5 + 0.5) * 5 : -Math.floor(-x / 5 + 0.5) * 5, ri = x => x >= 0 ? Math.floor(x + 0.5) : -Math.floor(-x + 0.5);
    const mean = (a, b, f) => (a == null || b == null) ? (a == null ? b : a) : f((a + b) / 2); return { r5, ri, mean }; })();
  {
    const bad = [];
    ['body', 'head'].forEach(k => ARMORY[k].filter(s => s.origin).forEach(s => {
      const row = ARM[k].find(r => r.id === s.id), a = ARM[k].find(r => r.id === s.between[0]), b = ARM[k].find(r => r.id === s.between[1]);
      if (!row || !a || !b) { bad.push(s.id + ' missing'); return; }
      const set = (s.tune && s.tune.set) || {};
      const want = { durability: set.durability != null ? set.durability : AY.mean(a.durability, b.durability, AY.r5), fatigue: set.fatigue != null ? set.fatigue : AY.mean(a.fatigue, b.fatigue, AY.ri) };
      if (row.durability !== want.durability || row.fatigue !== want.fatigue) bad.push(s.id + ' ' + row.durability + '/' + row.fatigue + ' vs ' + want.durability + '/' + want.fatigue);
    }));
    /* the rolled door: every man wears his origin's own, 20 games each */
    const box = { console, Math, JSON, Date, Object, Array, String, Number, Uint32Array, setTimeout: () => {}, localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} } };
    box.window = box; vm.createContext(box); vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/bohemia_origin_start.js'), 'utf8'), box);
    const O = box.BohemiaOriginStart, D = O.data; D.origins = FILE; D.bgs = J('records/target/bb/backgrounds.json'); D.xp = J('records/target/bb/rules.json').experience; D.tiers = {};
    J('records/target/bb/perks.json').rows.forEach(r => { D.tiers[r.id] = r.tier; }); D.crew = J('records/target/bb/ours.json').crew.value.map(m => m.name); D.ready = true;
    global.__ROLL = O;
    let men = 0, wearing = 0; const off = [];
    FILE.origins.forEach(o => { const own = o.personal.shelf.pieces;
      for (let s = 1; s <= 20; s++) O.roll(o.id, s).forEach((m, i) => { men++; const g = m.gear || {};
        if (own.indexOf(g.body) >= 0) wearing++; else if (!(o.id === 'raid' && m.background === 'monk')) off.push(o.id + ':' + i + ' ' + g.body); }); });
    ok('O3 THE NUMBERS AND THE DOOR: every origin piece is the armory\'s mean of its two Battle Brothers rows (the Lone Wolf\'s Battle Brothers\' own golden named pieces), and every man of every origin walks in wearing his origin\'s own (the raiders\' monk keeps his tunic), 20 games each',
      !bad.length && !off.length && wearing > 0, (bad.concat([...new Set(off)])).slice(0, 5).join('; ') || wearing + ' of ' + men + ' men in their own');
  }

  /* ---------------- O4 the rules run, and only with the origin ---------------- */
  const G = require(path.join(ROOT, 'tools/bohemia_tuning_the_whole_grid.js'));
  const ctx = await G.engine(true), F = ctx.FIGHT;
  const way = id => { const d = (FILE.origins.find(o => o.id === id).personal.rule.does) || {}, out = {}; ['first_round', 'never_confident', 'never_flees', 'standard', 'whip'].forEach(k => { if (d[k]) out[k] = d[k]; }); return Object.keys(out).length ? out : null; };
  const company = id => global.__ROLL.roll(id, 7);
  {
    /* first to act: round one's order, ten seeds, with and without */
    const firsts = (w) => { let all = 0; for (let s = 0; s < 10; s++) { ctx.setSeed(300 + s); F.setup({ auto: true, company: company('desert'), cap: 3, party: { faction: 'brigands', count: 6, days: 1 }, days: 1, originWay: w });
      const ord = F.S.order.map(id => F.byId(id)), k = ord.findIndex(u => u.side !== 'you'); if (k === 3) all++; } return all; };
    const withW = firsts(way('desert')), without = firsts(null);
    /* the nerve: force checks on one man of each, with and without (F._t.nerve is the fight's own check) */
    const nerve = (id, kind, mod, w, n) => { ctx.setSeed(41); F.setup({ auto: true, company: company(id), cap: 12, party: { faction: 'brigands', count: 3, days: 1 }, days: 1, originWay: w });
      return F.S.units.filter(u => u.side === 'you'); };
    const climbs = (w) => { const us = nerve('lab', 'pos', 0, w); let conf = 0; us.forEach(u => { for (let i = 0; i < 60; i++) { F._t.nerve(u, 'pos', 1000, true); if (u.morale === 'Confident') conf++; } }); return conf; };
    const breaks = (w) => { const us = nerve('faith', 'neg', 0, w); let fled = 0; us.forEach(u => { for (let i = 0; i < 30; i++) { F._t.nerve(u, 'neg', -1000); if (u.morale === 'Fleeing') { fled++; u.morale = 'Steady'; } } }); return fled; };
    const whip = (w) => { const us = nerve('debt', 'neg', 0, w), col = us.find(u => u.kind === 'manhunter'), debtor = us.find(u => u.kind === 'indebted' || u.kind === 'southern_indebted');
      if (!col || !debtor) return null; debtor.x = col.x + 1; debtor.y = col.y; let low = 0; for (let i = 0; i < 30; i++) { F._t.nerve(debtor, 'neg', -1000); if (debtor.morale === 'Breaking' || debtor.morale === 'Fleeing') { low++; debtor.morale = 'Steady'; } } return low; };
    const standard = (w) => { const us = nerve('promise', 'neg', 0, w), b = us.find(u => u.main) || us[0], m = us.find(u => u !== b); if (!m) return null; m.x = b.x + 1; m.y = b.y; let held = 0;
      for (let i = 0; i < 4000; i++) { m.morale = 'Steady'; if (F._t.nerve(m, 'neg', -30)) held++; } return held / 40; };
    const W1 = way('desert'), lab = way('lab'), faith = way('faith'), debt = way('debt'), prom = way('promise');
    const cWith = climbs(lab), cWithout = climbs(null), fWith = breaks(faith), fWithout = breaks(null), wWith = debt ? whip(debt) : null, wWithout = whip(null), sWith = prom ? standard(prom) : null, sWithout = standard(null);
    ok('*** O4a FIRST TO ACT *** (the deserters, bb_all/0571): round one\'s order puts all three of his men before any of theirs in ' + withW + ' of 10 fights; without the rule ' + without + ' of 10', withW === 10 && without < 10, withW + ' / ' + without);
    ok('O4b NOT FIGHTERS (the lab rats, bb_all/0080): forced good news never lifts them to confident (' + cWith + ' times), against ' + cWithout + ' without the rule', cWith === 0 && cWithout > 0, cWith + ' / ' + cWithout);
    ok('O4c THE FAITH HOLDS (the faithful): forced bad news never puts one to flight (' + fWith + ' times), against ' + fWithout + ' without', fWith === 0 && fWithout > 0, fWith + ' / ' + fWithout);
    ok('O4d THE WHIP (the debt collectors, bb_all/0449): a debtor beside a collector never breaks past wavering (' + wWith + ' times), against ' + wWithout + ' without', wWith === 0 && wWithout > 0, wWith + ' / ' + wWithout);
    ok('O4e THE STANDARD (the promise keepers, bb_all/0214): a man beside the bearer holds his nerve ' + sWith + '% of the time, against ' + sWithout + '% without (a tenth of the bearer\'s resolve lent)', sWith != null && sWithout != null && sWith - sWithout >= 3, sWith + ' / ' + sWithout);
    /* the raiders' second look: the spoils engine, the same dice, with and without */
    const SP = require(path.join(ROOT, 'engine/bohemia_spoils.js')), L = J('records/target/bb/loot.json');
    const bodies = []; for (let i = 0; i < 400; i++) bodies.push({ name: 'm' + i, dead: true, weapon: { id: 'dagger', cls: 'dagger', durability: 40 }, shield: { id: 'wooden_shield', durability: 30 }, head: { id: 'hood', now: 40, max: 40 }, body: { id: 'thick_tunic', now: 35, max: 35 } });
    const seeded = () => { let a = 7; return () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; }; };
    const raidDoes = FILE.origins.find(o => o.id === 'raid').personal.rule.does;
    const fW = SP.found({ bodies }, Object.assign({}, L, { way: raidDoes }), seeded()).items.length, fN = SP.found({ bodies }, Object.assign({}, L, { way: null }), seeded()).items.length;
    ok('O4f STRIP THE DEAD (the raiders, bb_all/1459): 400 dead men leave ' + fW + ' pieces with the second look, ' + fN + ' without (the same dice)', fW > fN * 1.05, fW + ' / ' + fN);
    /* the hunters' trophies: the carcass's kill reads the rule (its own line), and the rule says half the time (Battle Brothers' 50) */
    const car = fs.readFileSync(path.join(ROOT, 'slices/bohemia_carcass.js'), 'utf8'), hunt = FILE.origins.find(o => o.id === 'hunt').personal.rule.does;
    ok('O4g BEAST SLAYERS (the hunters, bb_all/0220): a kill gives an extra hide ' + hunt.trophy_extra_pct + ' times in 100 (the carcass\'s goodsOf reads the rule), towns 10% dearer to them',
      hunt.trophy_extra_pct === 50 && hunt.buy_mult === 1.1 && hunt.sell_mult === 0.9 && /xp = owTrophy\(\); if \(xp > 0 && Math\.random\(\) \* 100 < xp\) hides\+\+/.test(car) && /trophy_extra_pct/.test(car));
  }

  /* ---------------- O5 the gilded god ---------------- */
  {
    const rolls = []; for (let s = 1; s <= 200; s++) rolls.push(global.__ROLL.roll('wolf', s)[0]);
    const hk = J('records/target/bb/backgrounds.json').rows.find(r => r.id === 'hedge_knight');
    const gifts = rolls.every(m => ['lone_wolf', 'fearsome', 'recover'].every(p => (m.perks || []).indexOf(p) >= 0));
    const res = rolls.map(m => m.stats.resolve), lo = Math.min(...res), hi = Math.max(...res);
    const gilded = rolls.every(m => m.gear.body === 'wolf_gilded_riot_armour' && m.gear.head === 'wolf_gilded_riot_helm');
    let won = 0, fights = 0, winded = 0, turns = 0, fat = 0;
    for (const P of [['direwolf', 2], ['direwolf', 3]]) for (let k = 0; k < 10; k++) {
      ctx.setSeed(9000 + k); const men = global.__ROLL.roll('wolf', 1000 + k);
      F.setup({ auto: true, formation: null, company: men, cap: 1, party: Array.from({ length: P[1] }, () => P[0]), days: 1 });
      const me = F.S.units.find(u => u.side === 'you'); fat = F.fatMax(me);
      let g = 0, T = null; const idle = G.idleWatch(F);
      while (!F.S.over && g < 400000) { const u = F.current(); if (!u) break;
        if (u === me && !T) T = { f0: me.fat, fm: F.fatMax(me), n0: F.S.log.filter(e => e.t === 'attack' && e.id === me.id).length };
        F.aiStep(u); g++;
        if (T && F.current() !== me) { turns++; if (F.S.log.filter(e => e.t === 'attack' && e.id === me.id).length === T.n0 && T.fm - T.f0 < 15) winded++; T = null; }
        if (idle()) break; }
      fights++; if (F.S.result === 'won') won++;
    }
    ok('*** O5 THE GILDED GOD, FELT IN THE FIGHT ***: 200 rolls all carry Battle Brothers\' Lone Wolf, Fearsome and Recover on top of his levels, the gilded suit and helm, his resolve ' + lo + ' to ' + hi + ' (the Player Character\'s +10 over the hedge knight\'s ' + hk.stats.resolve.join('-') + ' and his levels); alone on the live fight against two and three dire wolves he wins ' + won + ' of ' + fights + ', his breath ' + fat + ', winded on ' + winded + ' of ' + turns + ' turns',
      gifts && gilded && lo >= hk.stats.resolve[0] + 10 && won >= 17 && fat >= 58 && winded === 0, JSON.stringify({ gifts, gilded, lo, won, fat, winded }));
  }
  if (ONLY === 'node') return done();

  /* ---------------- O6 / O7 the demo ---------------- */
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const ARMS = (origin) => "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = '" + origin + "'; s.reveal = 0; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.removeItem('bohemia.fog.off'); localStorage.removeItem('bohemia.laststart.v1'); } catch (e) {}";
  const settleFrame = (P) => P.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url()));
  const { leaveTown } = require(path.join(ROOT, 'tools/bohemia_leave_the_town.js'));
  /* a road fight: out of the town by a real tap on LEAVE, off its ground (CAMP __A_TOWN_IS_SAFE__, __A_TOWN_IS_ALWAYS_A_DOOR__: a road crew met on a town's ground is met at its door), then the road's crew */
  const fightIn = async (d, seq, mouse) => { const sf = settleFrame(d.page); if (sf) { await leaveTown(d.page, sf, { ms: 4000, mouse: !!mouse }).catch(() => {}); await d.page.waitForTimeout(1500); }
    await d.fr.evaluate(() => { const x0 = city.x, y0 = city.y; for (let r = 4; r < 30; r++) for (let a = -r; a <= r; a++) for (const [x, y] of [[x0 + a, y0 - r], [x0 + a, y0 + r], [x0 - r, y0 + a], [x0 + r, y0 + a]]) { try { if (cityWalkable(x, y) && !townSafeAt(x, y) && !townGround(x, y)) { city.x = x; city.y = y; return; } } catch (e) {} } });
    await d.fr.evaluate((q) => { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: q }); }, seq);
    let f = null; for (let i = 0; i < 150 && !f; i++) { const h = await d.page.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f = c; } if (!f) await d.page.waitForTimeout(200); }
    return f; };
  const townUp = async (d) => { for (let i = 0; i < 100; i++) { if (await d.fr.evaluate(() => !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened)).catch(() => false)) break; await d.page.waitForTimeout(250); }
    await d.page.waitForTimeout(1500); const sf = settleFrame(d.page);
    if (sf) await sf.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.state.stock && (BohemiaSettlement.state.stock.armourer || []).length > 0, null, { timeout: 20000 }).catch(() => {});
    return sf; };
  let d = null;
  try {
    d = await drive.open({ profile: 'phone_portrait', fog: true, engage: true, arm: ARMS('truck') });
    const sf = await townUp(d);
    const t = sf ? await sf.evaluate(() => { const S = BohemiaSettlement.state, A = S.stock.armourer || [], W = window.top.BohemiaOriginWays;
      return { place: S.place && S.place.name, home: W && W.home(), first: A.slice(0, 2).map(it => ({ id: it.id, own: !!it.own, price: it.price, base: it.base })), ids: A.map(it => it.id) }; }) : null;
    /* the control: the same shelf with the origin's rule taken off the page's copy, the prices without the Trader */
    const ctl = sf ? await sf.evaluate(() => { const W = window.top.BohemiaOriginWays, keep = W.does; W.does = function () { return {}; };
      BohemiaSettlement.restock(); const A = BohemiaSettlement.state.stock.armourer || [], out = A.filter(it => it.own).map(it => ({ id: it.id, price: it.price })); W.does = keep; BohemiaSettlement.restock(); return out; }) : null;
    if (SHOTS && sf) { await sf.evaluate(() => { try { BohemiaSettlement.open && 0; } catch (e) {} }); await d.page.screenshot({ path: path.join(SHOTS, 'truck_home_town.png') }); }
    const homeOk = t && t.home && t.home.town === t.place && t.first.length === 2 && t.first.every(x => x.own) && ['truck_hi_vis_vest', 'truck_hi_vis_hard_hat'].every(id => t.first.some(x => x.id === id));
    const trader = t && ctl && t.first.every(x => { const c = ctl.find(y => y.id === x.id); return c && x.price < c.price; });
    ok('*** O6a THE WATER TRUCK\'S HOME *** (a new game on the phone): it opens in ' + (t && t.place) + ', its home; the armourer\'s first two are its own hi-vis vest and hard hat at the Trader\'s price (' + (t ? t.first.map(x => x.price).join(', ') : '?') + ' batteries, ' + (ctl ? ctl.map(x => x.price).join(', ') : '?') + ' without the rule)',
      homeOk && trader, JSON.stringify({ t, ctl }).slice(0, 300));
    /* another town: none of its pieces */
    const other = await d.fr.evaluate(() => { const bs = ctBases(), here = window.__START_IN_TOWN && window.__START_IN_TOWN.town; for (const n in bs) if (n !== here && (mapTierOf(n) || 'camp') !== 'camp') return { name: n, x: bs[n].x | 0, y: bs[n].y | 0, tier: mapTierOf(n) }; return null; });
    let elsewhere = null;
    if (other) { await d.fr.evaluate((o) => { try { loopOpenTown(o); } catch (e) {} }, other); await d.page.waitForTimeout(2500);
      const sf2 = settleFrame(d.page); if (sf2) { await sf2.waitForFunction((n) => window.BohemiaSettlement && BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n && (BohemiaSettlement.state.stock.armourer || []).length > 0, other.name, { timeout: 15000 }).catch(() => {});
        elsewhere = await sf2.evaluate(() => { const W = window.top.BohemiaOriginWays, res = W.reserved(); const all = [].concat(...Object.values(BohemiaSettlement.state.stock || {})); return { place: BohemiaSettlement.state.place.name, own: all.filter(it => res.indexOf(it.id) >= 0).map(it => it.id), n: all.length }; }); } }
    ok('O6b ONLY AT HOME: ' + (elsewhere && elsewhere.place) + ' (another town) sells none of any origin\'s pieces (' + (elsewhere ? elsewhere.n : '?') + ' things on its shelves)', !!elsewhere && elsewhere.own.length === 0 && elsewhere.n > 0, JSON.stringify(elsewhere));
    /* the look in the fight */
    const f = await fightIn(d, 11, false);
    const look = f ? await f.evaluate(() => { const us = FIGHT.S.units.filter(u => u.side === 'you'); const W = window.BohemiaWear;
      return { bodies: us.map(u => u.bodyRow && u.bodyRow.id), heads: us.map(u => u.headRow && u.headRow.id), key: W && W.piece('body', 'truck_hi_vis_vest') && W.piece('body', 'truck_hi_vis_vest').key, hkey: W && W.piece('head', 'truck_hi_vis_hard_hat') && W.piece('head', 'truck_hi_vis_hard_hat').key }; }) : null;
    if (f) await d.page.waitForTimeout(2500);
    if (SHOTS && f) await d.page.screenshot({ path: path.join(SHOTS, 'truck_fight.png') });
    ok('*** O6c THE LOOK IN THE FIGHT ***: the water truck\'s men walk in wearing the hi-vis vest (' + (look ? look.bodies.filter(b => b === 'truck_hi_vis_vest').length : 0) + ' of ' + (look ? look.bodies.length : 0) + '), drawn as their own model (' + (look && look.key) + ', ' + (look && look.hkey) + ')',
      !!look && look.bodies.length >= 3 && look.bodies.every(b => b === 'truck_hi_vis_vest') && look.key === 'own_truck_hi_vis_vest' && look.hkey === 'own_truck_hi_vis_hard_hat', JSON.stringify(look));
    if (f) { await f.evaluate(() => { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {}); await d.page.waitForTimeout(800); try { await d.page.evaluate(() => { try { if (typeof spoilsLeave === 'function') spoilsLeave(); else nfHome(); } catch (_e) {} }); } catch (_e) {} await d.page.waitForTimeout(800); }
    /* the scavengers count, the Block Watch hires lowborn only: the same game with the door's origin switched, each against the plain start */
    const words = await d.fr.evaluate(() => { const B = window.top.BOH_START, was = B.state.origin, out = {}; B.state.origin = 'scav'; out.scav = partyWord(5); B.state.origin = 'newcrew'; out.plain = partyWord(5); B.state.origin = was; return out; });
    ok('O6d THEY COUNT (the scavengers, bb_all/0172): a crew of five on the map reads "' + words.scav + '" to them, "' + words.plain + '" to the plain start', words.scav === 'EXACTLY 5' && words.plain !== words.scav, JSON.stringify(words));
    const sf3 = settleFrame(d.page);
    const rare = sf3 ? await sf3.evaluate(() => { const B = window.top.BOH_START, was = B.state.origin, out = {}; B.state.origin = 'watch'; out.watch = BohemiaSettlement.rareChance(); B.state.origin = 'newcrew'; out.plain = BohemiaSettlement.rareChance(); B.state.origin = was; return out; }) : null;
    ok('O6e LOWBORN ONLY (the Block Watch, bb_all/1533): the post\'s rare chance is ' + (rare && rare.watch) + ' for them, ' + (rare && rare.plain) + ' for the plain start', !!rare && rare.watch === 0 && rare.plain > 0, JSON.stringify(rare));
    ok('O8a nothing threw on the phone', d.errs.length === 0, d.errs.slice(0, 2).join(' | '));
  } catch (e) { ok('the phone legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  if (d) await d.close();

  let c = null;
  try {
    c = await drive.open({ profile: 'computer', fog: true, engage: true, arm: ARMS('wolf') });
    await townUp(c);
    const door = await c.page.evaluate(() => { const p = window.BOH_START && BOH_START.picks(); const o = (window.BohemiaOriginWays && BohemiaOriginWays.data.file && BohemiaOriginWays.data.file.origins || []).find(x => x.id === 'wolf'); return { origin: p && p.origin, line: o && o.line, says: o && o.personal.rule.says }; });
    const f = await fightIn(c, 21, true);
    const u = f ? await f.evaluate(() => { const me = FIGHT.S.units.find(x => x.side === 'you' && x.main) || FIGHT.S.units.find(x => x.side === 'you'); const W = window.BohemiaWear;
      return { perks: me.perks, body: me.bodyRow && me.bodyRow.id, head: me.headRow && me.headRow.id, key: W && W.piece('body', me.bodyRow && me.bodyRow.id) && W.piece('body', me.bodyRow.id).key, n: FIGHT.S.units.filter(x => x.side === 'you').length, fat: FIGHT.fatMax(me), resolve: me.resolve, next: WIPE_SAYS.nextAlone }; }) : null;
    if (f) await c.page.waitForTimeout(2500);
    if (SHOTS && f) await c.page.screenshot({ path: path.join(SHOTS, 'wolf_fight.png') });
    ok('*** O7 THE LONE WOLF ON THE DEMO *** (computer): one man in the gilded suit and helm (' + (u && u.key) + '), Lone Wolf, Fearsome and Recover on him, breath ' + (u && u.fat) + ', resolve ' + (u && u.resolve) + '; the door says "' + (door && door.line) + '" and a lost fight says "' + (u && u.next) + '"',
      !!u && u.n === 1 && u.body === 'wolf_gilded_riot_armour' && u.head === 'wolf_gilded_riot_helm' && u.key === 'own_wolf_gilded_riot_armour' && ['lone_wolf', 'fearsome', 'recover'].every(p => (u.perks || []).indexOf(p) >= 0)
      && door.origin === 'wolf' && /wake up in the nearest town/.test(door.line || '') && !/it ends/.test(door.line || '') && /drags you to the nearest town/.test(u.next || ''), JSON.stringify({ u, door }).slice(0, 300));
    ok('O8b nothing threw on the computer', c.errs.length === 0, c.errs.slice(0, 2).join(' | '));
  } catch (e) { ok('the computer legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  if (c) await c.close();
  done();
})().catch(e => { ok('the gate ran [' + String(e && e.stack || e).slice(0, 300) + ']', false); done(); });
