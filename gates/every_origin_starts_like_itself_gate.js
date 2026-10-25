/* ==========================================================================
   EVERY ORIGIN STARTS LIKE ITSELF  (RUN TWO, 10/25/26, VAMILY [every origin starts like itself], rule 184)

   PAOLO 10/25: "in Battle Brothers Lone Wolf you get a gilded god with three stars in the stats that actually
   matter... I don't even see that on this wolf guy. It's just one regular guy... definitely not a lone wolf."
   MEASURED BEFORE (TUNING 10/25, records/BOHEMIA_TUNING_EVERY_ORIGIN_STARTS_LIKE_ITSELF_10_25_26.md s1a): the
   door handed {background: hedge_knight, level: 4} and nothing else; the Lone Wolf was a level-4 label on a
   level-1 body in YOU's rags (90 armour, a pistol and a car door), rolled from his name: the same man every game.
   NOW: origins.json's door block, rolled once a game by engine/bohemia_origin_start.js and handed by the door.

   LEGS:
     W1 the file: the Lone Wolf's door block is TUNING's god3 (three stars each on ranged defence, melee skill,
        melee defence; four picks a level; the hedge knight's kit in real rows; the pistol in his bag; real perks)
     W2 *** THE GAME ROLLS TUNING'S MEASURED MAN ***: the engine's rolls over seeds 1 to 200 have exactly the
        lowest, median and highest of every stat TUNING's bench measured (banks/BOHEMIA_TUNING_EVERY_ORIGIN_10_25_26.json
        wolf_spread.god3), and no two of the 200 are the same man
     W3 on the phone, THE LONE WOLF picked by a real tap: the door hands the rolled man (level 4, three three-star
        stats, his kit), and the same man on every ask through the game
     W4 *** THE CREW SCREEN READS AS A GOD *** (opened by a real tap on the bar's crew chip): YOU at LEVEL 4, his
        rolled numbers, three ★★★ drawn on the stats that matter, his kit in his slots (a machete or a fire axe, a
        riot shield, full riot armour, a full riot helm), the pistol in his bag, his three perks, his own line
     W5 *** THE FIGHT FIELDS HIM AS ROLLED ***: his skills and defences, his weapon, shield, armour and perks
     W6 A NEW GAME IS A NEW MAN: NEW GAME forgets the roll (the start screen's list names it), and the next ask
        rolls another man; a fresh phone rolls its own
     W7 on the computer, picked by a mouse: the same god on the crew screen
     W8 the other fourteen start like themselves (TUNING's bank lifted: real levels, three talents, their own kit, new each game)
     W10 THE FIGHT PIT on the crew screen and in the fight, a new game
     W9 nothing threw
   node gates/every_origin_starts_like_itself_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('EVERY ORIGIN STARTS LIKE ITSELF: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));

const FILE = J('records/target/bb/origins.json'), BANK = J('banks/BOHEMIA_TUNING_EVERY_ORIGIN_10_25_26.json');
const W = FILE.origins.find(o => o.id === 'wolf'), GOD = BANK.gods.god3;
const WROWS = J('records/target/bb/weapons.json').rows, ARM = J('records/target/bb/armor.json'), PERKS = J('records/target/bb/perks.json').rows;
const has = (list, id) => list.some(r => r.id === id);
const STATS = ['hp', 'fatigue', 'resolve', 'initiative', 'melee_skill', 'ranged_skill', 'melee_defense', 'ranged_defense'];
const GOD_STARS = ['melee_skill', 'melee_defense', 'ranged_defense'];

/* the wolf, picked by a real touch or click on the door, then BEGIN */
async function pickWolf(page, mouse) {
  await throughTheTitle(page);
  for (let i = 0; i < 60; i++) { if (await page.evaluate(() => !!(window.BOH_START && BOH_START.data && BOH_START.data()))) break; await page.waitForTimeout(250); }
  const r = await page.evaluate(() => { const e = document.querySelector('#newco [data-k=origin][data-v=wolf]'); if (!e) return null; e.scrollIntoView({ block: 'center', inline: 'center' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
  if (r) { if (mouse) await page.mouse.click(r.x, r.y); else await page.touchscreen.tap(r.x, r.y); }
  await page.waitForTimeout(400);
  for (let i = 0; i < 60; i++) { if (await page.evaluate(() => !!(window.BohemiaOriginStart && BohemiaOriginStart.data.ready))) break; await page.waitForTimeout(250); }
  return !!r;
}
/* the bar's crew chip, a real tap; then the crew screen's own state and what it drew */
async function crewScreen(d, mouse) {
  const p = d.page; let tapped = false;
  for (const f of p.frames()) { const h = await f.$('.crew[role=button]').catch(() => null); if (!h) continue; const b = await h.boundingBox().catch(() => null); if (!b || b.width < 4) continue;
    if (mouse) await p.mouse.click(b.x + b.width / 2, b.y + b.height / 2); else await p.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); tapped = true; break; }
  let rf = null; for (let k = 0; k < 50 && !rf; k++) { await p.waitForTimeout(300); rf = p.frames().find(x => /ROSTER_SCREEN/.test(x.url())); }
  if (!rf) return { tapped, man: null };
  await rf.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready && BohemiaRosterScreen.state.crew.length > 0, null, { timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(1200);
  const man = await rf.evaluate(() => { const m = BohemiaRosterScreen.state.crew[0]; if (!m) return null; const id = it => it ? it.id : null, nm = it => it ? it.name : null;
    const txt = document.body.innerText, rows = [...document.querySelectorAll('.stats [data-stat], .stats > *')];
    /* a star is UI's drawn icon (.bmstar, BohemiaMaterials.stars) or the plain glyph before the materials load */
    const starsDrawn = [...document.querySelectorAll('.stats .stars')].filter(e => e.offsetWidth > 0 && (e.querySelectorAll('.bmstar').length === 3 || /★★★/.test(e.textContent))).length;
    return { name: m.name, level: m.level, stats: m.stats, stars: m.stars, perks: m.perks, points: m.points, pain: m.pain, crew: BohemiaRosterScreen.state.crew.length,
      gear: { main: id(m.gear.main), off: id(m.gear.off), body: id(m.gear.body), head: id(m.gear.head), bag1: id(m.gear.bag1) },
      names: { main: nm(m.gear.main), off: nm(m.gear.off), body: nm(m.gear.body), head: nm(m.gear.head), bag1: nm(m.gear.bag1) },
      levelShown: /LEVEL 4\b/.test(txt), lineShown: txt.indexOf((m.pain || '').slice(0, 30)) >= 0, starsDrawn, perksShown: /BUILT LIKE A DOOR/.test(txt) && /HARD HEAD/.test(txt) && /CARRIES THE WEIGHT/.test(txt), rows: rows.length }; });
  return { tapped, man, rf };
}

(async () => {
  /* ---- W1 the file ---- */
  const dm = (W.door && W.door.men && W.door.men[0]) || {}, kit = dm.kit || {};
  const kitReal = (kit.main || []).every(id => has(WROWS, id)) && (kit.off || []).every(id => has(ARM.shields, id)) && (kit.body || []).every(id => has(ARM.body, id))
    && (kit.head || []).every(id => has(ARM.head, id)) && (kit.bag || []).every(id => has(WROWS, id));
  const sameAsGod = JSON.stringify(dm.stars) === JSON.stringify(GOD.stars) && JSON.stringify(dm.plan) === JSON.stringify(GOD.plan)
    && ['main', 'off', 'body', 'head'].every(k => JSON.stringify(kit[k]) === JSON.stringify(GOD.kit[k]));
  ok('W1 the file: the Lone Wolf\'s door block is TUNING\'s god3 (three stars each on ranged defence, melee skill, melee defence; four picks a level; the hedge knight\'s kit in real rows; the pistol in his bag; real perks)',
    !!W.door && W.men.length === 1 && W.men[0].level === 4 && sameAsGod && kitReal && (dm.modifiers || {}).melee_defense === -2 && kit.bag && kit.bag[0] === 'rondel_dagger'
    && (dm.perks || []).length === 3 && dm.perks.every(id => has(PERKS, id)) && dm.levels_taken === true,
    JSON.stringify({ stars: dm.stars, plan: dm.plan, kitReal, perks: dm.perks }));

  /* ---- the phone ---- */
  let d, pre = {};
  try {
    d = await drive.open({ keepCards: true, engage: true, beforeTap: async (page) => {
      pre.tapped = await pickWolf(page, false);
      pre.picks = await page.evaluate(() => BOH_START.picks());
      /* ---- W2: the engine's rolls against TUNING's bench, seeds 1..200 ---- */
      pre.spread = await page.evaluate((STATS) => { const all = [];
        for (let s = 1; s <= 200; s++) all.push(BohemiaOriginStart.roll('wolf', s)[0]);
        const med = a => { const x = a.slice().sort((p, q) => p - q); return x[Math.floor(x.length / 2)]; };
        const out = {}; STATS.forEach(k => { const v = all.map(m => m.stats[k]); out[k] = [Math.min.apply(null, v), med(v), Math.max.apply(null, v)]; });
        const keys = new Set(all.map(m => JSON.stringify([m.stats, m.gear])));
        const kits = new Set(all.map(m => m.gear.main + '/' + m.gear.body + '/' + m.gear.head));
        return { out, distinct: keys.size, kits: kits.size }; }, STATS);
      /* W8: every one of the fifteen rolls its own men (the engine, pure, twenty seeds each: the door's stored roll is not touched) */
      pre.others = await page.evaluate((FILE) => { const out = [];
        FILE.origins.forEach(o => { if (o.id === 'wolf') return; const rolls = []; for (let s = 1; s <= 20; s++) rolls.push(BohemiaOriginStart.roll(o.id, s));
          out.push({ id: o.id, men: o.men.length, rolls: rolls.map(r => r.map(m => ({ bg: m.background, level: m.level, rolled: !!m.rolled, stars: m.stars, stats: m.stats, gear: m.gear, perks: m.perks }))) }); });
        return out; }, FILE);
    } });
  } catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  try {
    const want = BANK.wolf_spread.god3, off = STATS.filter(k => JSON.stringify(pre.spread.out[k]) !== JSON.stringify(want[k]));
    ok('*** W2 THE GAME ROLLS TUNING\'S MEASURED MAN *** (200 seeds: every stat\'s lowest, median and highest are the bench\'s exactly; ' + pre.spread.distinct + ' different men, ' + pre.spread.kits + ' different kits)',
      off.length === 0 && pre.spread.distinct === 200 && pre.spread.kits >= 12,
      off.length ? 'off: ' + off.map(k => k + ' ' + JSON.stringify(pre.spread.out[k]) + ' vs ' + JSON.stringify(want[k])).join('; ') : 'melee skill ' + JSON.stringify(pre.spread.out.melee_skill) + ', ranged def ' + JSON.stringify(pre.spread.out.ranged_defense) + ', melee def ' + JSON.stringify(pre.spread.out.melee_defense));

    const c0 = (pre.picks.company || [])[0] || {};
    const threeThree = c0.stars && GOD_STARS.every(k => c0.stars[k] === 3) && Object.keys(c0.stars).length === 3;
    await d.page.waitForTimeout(2500);
    const again = await d.page.evaluate(() => { const a = []; for (let i = 0; i < 10; i++) a.push(JSON.stringify(BOH_START.picks().company)); return a; });
    ok('W3 on the phone, THE LONE WOLF picked by a real tap: the door hands the rolled man (level 4, three three-star stats, his kit), the same man on ten more asks',
      pre.tapped && pre.picks.origin === 'wolf' && pre.picks.company.length === 1 && c0.rolled && c0.level === 4 && threeThree && c0.gear && kit.main.indexOf(c0.gear.main) >= 0
      && again.every(x => x === JSON.stringify(pre.picks.company)),
      JSON.stringify({ level: c0.level, stars: c0.stars, ms: c0.stats && c0.stats.melee_skill, md: c0.stats && c0.stats.melee_defense, rd: c0.stats && c0.stats.ranged_defense, gear: c0.gear }));

    /* ---- W4 the crew screen ---- */
    const cs = await crewScreen(d, false), m = cs.man || {};
    if (process.env.BOHEMIA_SHOT_DIR) await d.page.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'wolf_crew_phone.png') });
    const kitOk = m.gear && m.gear.main === c0.gear.main && m.gear.off === c0.gear.off && m.gear.body === c0.gear.body && m.gear.head === c0.gear.head && m.gear.bag1 === 'rondel_dagger'
      && /^(machete|fire axe)$/.test(m.names.main) && /riot shield$/.test(m.names.off) && /full riot armour$/.test(m.names.body) && /full riot helm$/.test(m.names.head)   /* RE-AIMED RUN TWO rule 202(d): each row its own name, the object it is drawn as at its end */ && m.names.bag1 === 'pistol';
    ok('*** W4 THE CREW SCREEN READS AS A GOD *** (a real tap on the chip: YOU at LEVEL 4, his rolled numbers, ★★★ drawn on the three stats, his kit, the pistol in his bag, his three perks, his own line)',
      cs.tapped && m.name === 'YOU' && m.level === 4 && m.levelShown && JSON.stringify(m.stats) === JSON.stringify(c0.stats) && m.starsDrawn === 3 && kitOk
      && JSON.stringify(m.perks) === JSON.stringify(dm.perks) && m.points === 0 && m.perksShown && m.pain === dm.line && m.lineShown && m.crew === 1,
      JSON.stringify({ level: m.level, starsDrawn: m.starsDrawn, names: m.names, perks: m.perks, points: m.points, line: m.lineShown }));
    if (cs.rf) await cs.rf.evaluate(() => { const b = document.getElementById('done'); if (b) b.click(); }).catch(() => {});
    await d.page.waitForTimeout(800);

    /* ---- W5 the fight ---- */
    await d.fr.evaluate(() => { try { stepOnce(0); stepOnce(4); } catch (_e) {} roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: Date.now() % 1000 }); });
    let f = null; for (let i = 0; i < 150 && !f; i++) { const h = await d.page.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f = c; } if (!f) await d.page.waitForTimeout(200); }
    const u = f ? await f.evaluate(() => { const u = FIGHT.S.units.filter(x => x.side === 'you'); return u.map(x => ({ main: !!x.main, level: x.level, mskill: x.mskill, mdef: x.mdef, rdef: x.rdef, rskill: x.rskill, resolve: x.resolve,
      weapon: x.weapon && (x.weapon.id || x.weapon.name), shield: x.shield && x.shield.id, body: x.bodyRow && x.bodyRow.id, head: x.headRow && x.headRow.id, perks: x.perks, armB: x.armB, armH: x.armH })); }) : null;
    const y = (u || [])[0] || {}, s0 = c0.stats || {};
    ok('*** W5 THE FIGHT FIELDS HIM AS ROLLED *** (his skills and defences, his weapon, shield, armour and perks)',
      !!u && u.length === 1 && y.main && y.level === 4 && y.mskill === s0.melee_skill && y.mdef === s0.melee_defense && y.rdef === s0.ranged_defense && y.rskill === s0.ranged_skill
      && y.weapon === c0.gear.main && y.shield === c0.gear.off && y.body === c0.gear.body && y.head === c0.gear.head && dm.perks.every(k => (y.perks || []).indexOf(k) >= 0),
      JSON.stringify(y));
    if (f) { await f.evaluate(() => { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {}); }
    for (let i = 0; i < 40; i++) { if (await d.page.evaluate(() => !CITYFIGHT || !!(window.SPOILS && SPOILS.frame))) break; await d.page.waitForTimeout(250); }
    try { await d.page.evaluate(() => { try { if (typeof spoilsLeave === 'function') spoilsLeave(); else nfHome(); } catch (_e) {} }); } catch (_e) {}
    await d.page.waitForTimeout(800);

    /* ---- W6 a new game is a new man ---- */
    const demoSrc = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'), 'utf8');
    const listed = /'bohemia\.origin\.roll\.v1'[^\]]*\]\.forEach\(function\(k\)\{ try\{ localStorage\.removeItem\(k\)/.test(demoSrc);   /* RE-AIMED 10/25: the wagon's count is forgotten beside it (THE WAGON AND THE SIX) */
    const next = await d.page.evaluate(() => { const before = localStorage.getItem(BohemiaOriginStart.KEY); BohemiaOriginStart.forget(); const gone = localStorage.getItem(BohemiaOriginStart.KEY) === null;
      return { had: !!before, gone, man: JSON.stringify(BOH_START.picks().company) }; });
    pre.man1 = JSON.stringify(pre.picks.company);
    ok('W6a NEW GAME forgets the roll (the start screen\'s forget list names it in the demo) and the next ask rolls another man', listed && next.had && next.gone && next.man !== pre.man1 && /"rolled":true/.test(next.man));
    ok('W9a nothing threw on the phone', d.errs.length === 0, d.errs.slice(0, 2).join(' | '));
    /* W8: the fourteen, lifted from TUNING's bank (banks/BOHEMIA_TUNING_ORIGIN_STARTS_PROPOSED_10_25_26.json) and rolled */
    const BGR = {}; J('records/target/bb/backgrounds.json').rows.forEach(r => { BGR[r.id] = r; });
    const PROP = {}; J('banks/BOHEMIA_TUNING_ORIGIN_STARTS_PROPOSED_10_25_26.json').origins.forEach(o => { PROP[o.id] = o; });
    const w8 = pre.others.map(o => { const f = FILE.origins.find(x => x.id === o.id), want = PROP[o.id].men, bad = [];
      if (f.men.length !== want.length || f.men.some((m, i) => m.background !== want[i].background || m.level !== want[i].level)) bad.push('men not the bank\'s');
      o.rolls.forEach((r, s) => r.forEach((m, i) => { const W0 = want[i], R = BGR[m.bg], g = W0.gear;
        if (!m.rolled || m.level !== W0.level) bad.push('level ' + i);
        const st = Object.keys(m.stars || {}); if (st.length !== 3 || st.some(k => !(m.stars[k] >= 1 && m.stars[k] <= 3))) bad.push('stars ' + i);
        if (m.gear.main !== g.main || (m.gear.off || null) !== (g.off || null) || m.gear.body !== g.body || m.gear.head !== g.head) bad.push('kit ' + i);
        if (m.perks) bad.push('perks taken ' + i);
        STATS.forEach(k => { if (m.stats[k] < R.stats[k][0]) bad.push('under range ' + i + ' ' + k); if (W0.level === 1 && m.stats[k] > R.stats[k][R.stats[k].length - 1]) bad.push('over range ' + i + ' ' + k); }); }));
      /* a stated level is real: over twenty games a level-2+ man's levels lift him past his background's top somewhere */
      want.forEach((W0, i) => { if (W0.level > 1 && !o.rolls.some(r => STATS.some(k => r[i].stats[k] > BGR[W0.background].stats[k][BGR[W0.background].stats[k].length - 1]))) bad.push('level ' + W0.level + ' gave nothing ' + i); });
      const distinct = new Set(o.rolls.map(r => JSON.stringify(r.map(m => [m.stats, m.stars])))).size;
      if (distinct < 20) bad.push('only ' + distinct + ' different crews in 20 games');
      return { id: o.id, bad: [...new Set(bad)] }; });
    const w8bad = w8.filter(o => o.bad.length);
    ok('*** W8 THE OTHER FOURTEEN START LIKE THEMSELVES *** (TUNING\'s bank lifted: each origin\'s men at their stated levels, made real; three talents each; the origin\'s own kit; a new crew every game; 20 games each)',
      pre.others.length === 14 && w8bad.length === 0, w8bad.length ? w8bad.map(o => o.id + ': ' + o.bad.slice(0, 3).join(', ')).join('; ') : '14 of 14');
    /* W10: THE FIGHT PIT, a new game: three level-3 pit fighters on the crew screen, three stars each, their own kit; the fight fields them */
    await d.page.evaluate(() => { ['bohemia.company.v1', 'bohemia.company.line.v1', 'bohemia.climb.v1', 'bohemia.formation.v1', 'bohemia.origin.roll.v1'].forEach(k => { try { localStorage.removeItem(k); } catch (e) {} }); BOH_START.state.origin = 'pit'; });
    const pit = await d.page.evaluate(() => BOH_START.picks().company);
    const cs2 = await crewScreen(d, false);
    const pitScreen = cs2.rf ? await cs2.rf.evaluate(() => BohemiaRosterScreen.state.crew.map(m => ({ name: m.name, level: m.level, stars: Object.keys(m.stars || {}).length, stats: m.stats, main: m.gear.main && m.gear.main.id, off: m.gear.off && m.gear.off.id, body: m.gear.body && m.gear.body.id, head: m.gear.head && m.gear.head.id, points: m.points }))) : [];
    if (process.env.BOHEMIA_SHOT_DIR) await d.page.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'pit_crew_phone.png') });
    if (cs2.rf) await cs2.rf.evaluate(() => { const b = document.getElementById('done'); if (b) b.click(); }).catch(() => {});
    await d.page.waitForTimeout(800);
    ok('W10 THE FIGHT PIT, a new game, on the crew screen: three pit fighters at level 3, their rolled numbers, three stars each, their own kit, two perk points each to spend',
      pit.length === 3 && pitScreen.length === 3 && pitScreen.every((m, i) => m.level === 3 && m.stars === 3 && JSON.stringify(m.stats) === JSON.stringify(pit[i].stats) && m.main === pit[i].gear.main && (m.off || null) === (pit[i].gear.off || null) && m.body === pit[i].gear.body && m.head === pit[i].gear.head && m.points === 2),
      JSON.stringify(pitScreen.map(m => [m.name, m.level, m.stars, m.main, m.body, m.points])));
    await d.fr.evaluate(() => { try { stepOnce(0); stepOnce(4); } catch (_e) {} roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: (Date.now() + 7) % 1000 }); });
    let f2 = null; for (let i = 0; i < 150 && !f2; i++) { const h = await d.page.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f2 = c; } if (!f2) await d.page.waitForTimeout(200); }
    const pu = f2 ? await f2.evaluate(() => FIGHT.S.units.filter(x => x.side === 'you').map(x => ({ kind: x.kind, level: x.level, mskill: x.mskill, weapon: x.weapon && (x.weapon.id || x.weapon.name), body: x.bodyRow && x.bodyRow.id }))) : [];
    ok('W10b the fight fields the pit as rolled (level 3, their melee skill, their weapons and armour)', pu.length === 3 && pu.every((u, i) => u.kind === 'gladiator' && u.level === 3 && u.mskill === pit[i].stats.melee_skill && u.body === pit[i].gear.body),
      JSON.stringify(pu));
    if (f2) { await f2.evaluate(() => { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {}); }
  } catch (e) { ok('the phone legs ran without throwing [' + String(e.message).slice(0, 200) + ']', false); }
  await d.close();

  /* ---- W7 the computer (a fresh machine: its own roll) ---- */
  let c, pc = {};
  try {
    c = await drive.open({ profile: 'computer', keepCards: true, beforeTap: async (page) => { pc.tapped = await pickWolf(page, true); pc.picks = await page.evaluate(() => BOH_START.picks()); } });
    await c.page.waitForTimeout(2500);
    const cs = await crewScreen(c, true), m = cs.man || {}, c1 = (pc.picks.company || [])[0] || {};
    if (process.env.BOHEMIA_SHOT_DIR) await c.page.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'wolf_crew_computer.png') });
    ok('W7 on the computer, picked by a mouse: the same god on the crew screen (LEVEL 4, ★★★ on three stats, his kit, his perks)',
      pc.tapped && cs.tapped && m.level === 4 && m.levelShown && m.starsDrawn === 3 && JSON.stringify(m.stats) === JSON.stringify(c1.stats) && m.gear && m.gear.main === c1.gear.main && m.perksShown,
      JSON.stringify({ level: m.level, starsDrawn: m.starsDrawn, main: m.names && m.names.main, body: m.names && m.names.body }));
    ok('W6b a fresh machine rolls its own man', !!pre.man1 && JSON.stringify(pc.picks.company) !== pre.man1);
    ok('W9b nothing threw on the computer', c.errs.length === 0, c.errs.slice(0, 2).join(' | '));
  } catch (e) { ok('the computer legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  if (c) await c.close();
  done();
})();
