#!/usr/bin/env node
/* SEE EVERY HIT, FAIR STAMINA, ZONE OF CONTROL (COMBAT 3, rules 312 to 314, Paolo 11/2; ask lines 305 to 307, 223, 225):
   'when I click the round swing and I have a two-handed axe, I should see where the other swings will take damage... this is
   for everything'; 'when I was fighting the wolves, they had an attack that took stamina away from me... then I do the stamina
   thing and it still didn't work... check out how Battle Brothers does it'; 'if they hit you but it does zero damage, then it's
   a mess... I'm still able to move to the tile that I want'.
   records/BOHEMIA_COMBAT_SEE_EVERY_HIT_FAIR_STAMINA_ZONE_OF_CONTROL_11_2_26.md.
   Legs, headless on the live fight's rules:
   S1 THE AUDIT: every skill in the fight's data sorted into what the fight does with it (the strike, a sweep with a shape, a
      reload, a perk's skill, a beast's or a faction's own, or not in the fight); every one he can press has a preview leg below;
   S2 NO HIT IS ZERO: 30 rolled AUTO fights (wolves, brigands, heavies): every blow that landed took at least ours.hit_floor_hp,
      and the preview of a knife on the heaviest armour says at least 1;
   S3 THE PACK'S CAP, AND EVERY BIT SAID: in those fights no man took more than ours.fatigue_from_them_between_turns from the other
      side between two of his turns, and every rise in a man's fatigue outside his own action came with a 'fat' event of that size
      (a fall, an injury that shrinks his most, only ever lowers it);
   S4 ZONE OF CONTROL: his man beside a man of theirs walks away 40 times: every free swing that landed held him on his tile, took
      at least 1 and said 'held'; every one that missed let him go;
   and on his phone (390 x 844, the real page, real taps; pictures in records/combat_see_every_hit_11_2/):
   P1 THE ROUND SWING, ARMED, BEFORE ANY AIM: his axe man with two of theirs in front (east, north-east), one behind (south-west)
      and one of his own front-right (south-east): the square armed lights every tile one of its aims reaches (AMENDED 11/2, COMBAT 6,
      rule 333: the round swing strikes the three in front of the aim, so the seven tiles its three aims reach, not the eight round
      him), a hurt tag (chance, -health, never 0) over each of the three it could catch, none over his own man;
   P2 AIMED, THEN SWUNG: a tap on the man east keeps two tags (him and the man north-east, the three in front; the man behind none);
      the second tap swings and the two are heard;
   P3 A STRIKE: a plain blow picked on one man shows his one tag;
   P4 THE WALK OUT OF THEIR REACH: the walk's line says the free swing and what a landed one does, the tile ringed; walked with
      their man sure to land: HELD over him, he stands where he stood, the blow took at least 1, and the breath it cost said
      over him (-N HIT);
   P5 A SKILL WITH NO TARGET IS TWO TAPS: ADRENALINE's first tap fires nothing and lights him; the second fires it;
   P6 nothing threw.
   Run: node gates/see_every_hit_gate.js [--shots] [--before <an old copy of the fight page, served as BOHEMIA_FIGHT.html, for the before pictures>] */
'use strict';
const fs = require('fs'), path = require('path');
const { proofShot } = require(path.join(__dirname, '..', 'tools', 'bohemia_proof_shot.js'));   /* PLUMBER 8 11/10: a gate run changes nothing git tracks (PROOF SHOTS STAY PUT); BOHEMIA_SHOOT=1 or --shoot writes the tracked picture on purpose */
const ROOT = path.resolve(__dirname, '..');
const G = require(path.join(ROOT, 'tools/bohemia_tuning_the_whole_grid.js'));
const SHOTS = process.argv.indexOf('--shots') > 0, BI = process.argv.indexOf('--before'), BEFORE = BI > 0 ? process.argv[BI + 1] : null;
const PICS = path.join(ROOT, 'records/combat_see_every_hit_11_2');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== SEE EVERY HIT GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));

async function headless() {
  const ctx = await G.engine(true), F = ctx.FIGHT, DB = ctx.DB, districts = DB.boardKinds.districts;
  const R = k => require('vm').runInContext("R('" + k + "')", ctx);
  const FLOOR = R('ours.hit_floor_hp'), CAP = R('ours.fatigue_from_them_between_turns');
  /* S1 the audit */
  const WP = J('records/target/bb/weapons.json'), SH = J('records/target/bb/weapon_shapes.json'), shaped = new Set(SH.rows.map(r => r.skill));
  const kinds = {}, add = (n, k) => { kinds[n] = kinds[n] || new Set(); kinds[n].add(k); };
  WP.rows.forEach(w => { const st = w.skills.filter(s => !/^Reload/.test(s.name))[0];
    w.skills.forEach(s => add(s.name, /^Reload/.test(s.name) ? 'reload' : shaped.has(s.name) ? (s === st ? 'strike with a shape' : 'sweep') : s === st ? 'strike' : 'not in the fight')); });
  const tally = {}; Object.keys(kinds).forEach(n => { const k = [...kinds[n]].sort().join(' / '); tally[k] = (tally[k] || []).concat(n); });
  const active = F.ACTIVE.slice();
  /* PLUMBER 8 11/10: re-aimed to rule 367 (THE DECOY, 11/3): the cutout is the eighth perk skill he can press, so the census is eight, decoy named */
  leg(Object.keys(kinds).length >= 60 && active.length === 8 && active.indexOf('decoy') >= 0 && [...shaped].every(n => kinds[n]),
    '*** S1 THE AUDIT: EVERY SKILL IN THE FIGHT\'S DATA SORTED *** (rule 312)',
    Object.keys(tally).map(k => k + ' ' + tally[k].length).join('; ') + '; perk skills ' + active.join(','));
  if (process.argv.indexOf('--table') > 0) console.log(JSON.stringify({ tally: Object.fromEntries(Object.entries(tally).map(([k, v]) => [k, v.sort()])), active }, null, 1));
  /* S2, S3 rolled fights */
  let hits = 0, zero = [], over = [], unsaid = [], windows = 0, said = 0;
  for (let k = 0; k < 30; k++) {
    const faction = ['beasts', 'brigands', 'heavies'][k % 3], size = [3, 6][k % 2], stage = ['early', 'middle'][Math.floor(k / 2) % 2];
    const d = districts[(k * 7 + 3) % districts.length]; ctx.setSeed(7700 + k);
    F.setup({ auto: true, formation: null, company: G.companyOf(size, stage), cap: size, party: { faction, count: Math.round(size * 1.4), days: 30 },
      days: 30, district: d.district, cell: { x: 11 + k, y: 7 + k }, act: 1 });
    const S = F.S; S.deploy = false;
    const all = S.units.slice(), took = {};
    for (let g = 0; g < 100000 && !S.over && S.round < 40; g++) {
      const u = F.current(); if (!u) break;
      const f0 = {}; all.forEach(v => { f0[v.id] = v.fat; });
      const L0 = S.log.length; F.aiStep(u); const ev = S.log.slice(L0);
      ev.forEach(e => {
        if (e.t === 'attack' && e.hit) { hits++; if (!(e.hp >= FLOOR)) zero.push(faction + ' ' + e.id + '->' + e.to + ' ' + e.hp); }
        if (e.t === 'fat') { said++; took[e.id] = (took[e.id] || 0) + e.n; if (took[e.id] > CAP) over.push(e.id + ' ' + took[e.id]); }
        if (e.t === 'turn') { windows++; took[e.id] = 0; }
      });
      all.forEach(v => { if (v === u) return;
        const n = ev.filter(e => e.t === 'fat' && e.id === v.id).reduce((t, e) => t + e.n, 0), back = ev.some(e => e.t === 'turn' && e.id === v.id) ? (v.fatBack || 0) : 0;
        if ((v.fat - f0[v.id]) - (n - back) > 0.5) unsaid.push(v.id + ' ' + Math.round(f0[v.id]) + '->' + Math.round(v.fat) + ' said ' + n + ' back ' + back); });
    }
  }
  const knife = DB.weapons.rows.filter(r => r.id === 'knife')[0], stick = DB.weapons.rows.filter(r => r.id === 'wooden_stick')[0];
  ctx.setSeed(3); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, band: ['brigand_thug'] });
  const a = F.S.units.find(v => v.side === 'them'), t = F.S.units.find(v => v.side === 'you');
  a.weapon = Object.assign({}, knife); t.armB = t.armBMax = 320; t.armH = t.armHMax = 300;
  const pv = F.preview(a, t);
  leg(hits > 500 && !zero.length && pv.hp >= FLOOR && pv.blows < Infinity,
    '*** S2 NO HIT IS ZERO *** (rule 314): every blow that landed in 30 rolled fights took ' + FLOOR + ' or more; a knife on 320 armour previews ' + pv.hp,
    hits + ' hits, ' + zero.length + ' under ' + FLOOR + (zero.length ? ' (' + zero.slice(0, 3).join('; ') + ')' : '') + '; the knife: -' + pv.hp + ', ' + pv.blows + ' blows to drop him');
  leg(said > 200 && !over.length && !unsaid.length,
    '*** S3 THE PACK\'S CAP, AND EVERY BIT SAID *** (rule 313): no man took over ' + CAP + ' from the other side between two of his turns; every rise outside his own action was said',
    said + ' breath events over ' + windows + ' turns; over the cap ' + over.length + (over.length ? ' (' + over.slice(0, 3).join('; ') + ')' : '') + '; unsaid changes ' + unsaid.length + (unsaid.length ? ' (' + unsaid.slice(0, 3).join('; ') + ')' : ''));
  /* S4 zone of control */
  let landed = 0, held = 0, heldOk = 0, missed = 0, walked = 0, bad = [];
  for (let k = 0; k < 40; k++) {
    ctx.setSeed(900 + k); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, band: ['brigand_thug'] });
    const S = F.S, me = S.units.find(v => v.side === 'you'), foe = S.units.find(v => v.side === 'them');
    S.units.forEach(v => { if (v.side === 'you' && v !== me) v.fled = true; });
    let c = null; for (let y = 2; y < S.h - 2 && !c; y++) for (let x = 2; x < S.w - 5 && !c; x++) { let ok = true; for (let yy = y - 1; yy <= y + 1; yy++) for (let xx = x - 1; xx <= x + 4; xx++) if (!F._t.passable(xx, yy)) ok = false; if (ok) c = { x, y }; }
    me.x = c.x + 1; me.y = c.y; foe.x = c.x; foe.y = c.y; me.ap = me.apTurn; me.hp = me.hpMax = 999; me.armB = me.armBMax = 320; me.armH = me.armHMax = 300;
    foe.mskill = k % 2 ? 999 : -999; foe.weapon = Object.assign({}, stick);
    S.order = [me.id, foe.id]; S.idx = 0; me.begun = true; S.deploy = false;
    const hp0 = me.hp, L0 = S.log.length;
    F.moveTo(me, c.x + 3, c.y, true);
    const ev = S.log.slice(L0), sw = ev.filter(e => e.t === 'attack' && e.free && e.to === me.id)[0];
    if (!sw) { bad.push('no free swing (seed ' + (900 + k) + ')'); continue; }
    if (sw.hit) { landed++; if (me.x === c.x + 1 && me.y === c.y) held++; if (ev.some(e => e.t === 'held' && e.id === me.id && e.by === foe.id) && hp0 - me.hp >= FLOOR && sw.hp >= FLOOR) heldOk++; }
    else { missed++; if (me.x !== c.x + 1) walked++; }
  }
  leg(landed >= 10 && missed >= 10 && held === landed && heldOk === landed && walked === missed && !bad.length,
    '*** S4 ZONE OF CONTROL: A FREE SWING THAT LANDS HOLDS HIM, AND NEVER FOR 0 *** (rule 314; Battle Brothers: \'if any of these attacks hit, the move fails\')',
    landed + ' landed: ' + held + ' held on his tile, ' + heldOk + ' said HELD and took ' + FLOOR + '+ through 320 armour; ' + missed + ' missed: ' + walked + ' walked on' + (bad.length ? '; ' + bad.slice(0, 2).join('; ') : ''));
}

async function phone() {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const base = { seed: 5, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, band: ['brigand_thug', 'brigand_thug', 'brigand_thug', 'brigand_thug'] };
  const o = { file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(base) };
  if (BEFORE) o.serve = { '/slices/BOHEMIA_FIGHT.html': path.resolve(BEFORE) };
  const d = await open(o), p = d.page, tag = BEFORE ? 'before' : 'after';
  if (SHOTS) fs.mkdirSync(PICS, { recursive: true });
  const shot = async n => { if (SHOTS) await p.screenshot({ path: proofShot(path.join(PICS, n + '_' + tag + '.png')), scale: 'css' }); };
  try {
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
    await p.evaluate(() => { window.FIGHT_DB_ROW = id => DB.weapons.rows.filter(r => r.id === id)[0]; });
    const mineNow = async () => { for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : u.side === 'you' && !FIGHT_UI.anim.length ? 'mine' : u.side === 'you' ? 'busy' : 'theirs'; });
      if (st === 'mine') return; if (st === 'theirs') await p.touchscreen.tap(200, 420); await p.waitForTimeout(150); } };
    /* his man, the men of theirs at spots, his own men at friends, in a clear patch, his man holding the weapon asked for */
    const stage = async (wid, spots, friends, extra) => { await mineNow();
      return p.evaluate(([wid, spots, friends, extra]) => {
        const S = FIGHT.S, u = FIGHT.current(), them = S.units.filter(v => v.side === 'them'), mine = S.units.filter(v => v.side === 'you' && v !== u);
        let c = null;
        for (let y = 3; y < S.h - 3 && !c; y++) for (let x = 3; x < S.w - 6 && !c; x++) {
          let ok = true; for (let yy = y - 2; yy <= y + 2; yy++) for (let xx = x - 2; xx <= x + 5; xx++) if (!FIGHT._t.passable(xx, yy)) ok = false;
          if (ok) c = { x: x, y: y }; }
        mine.forEach((v, i) => { if (i < friends.length) { v.x = c.x + friends[i][0]; v.y = c.y + friends[i][1]; v.fled = false; } else { v.x = 0; v.y = i % S.h; } });
        them.forEach((v, i) => { if (i >= spots.length) v.fled = true; else { v.x = c.x + spots[i][0]; v.y = c.y + spots[i][1]; v.hp = v.hpMax = 999; v.fled = false; } });
        const w = Object.assign({}, FIGHT_DB_ROW(wid)); u.weapon = w; u.shield = null; u.loaded = true; u.ammo = null;
        u.x = c.x; u.y = c.y; u.ap = u.apTurn; u.fat = 0; u.hp = u.hpMax = 999; S.order = [u.id].concat(them.filter(v => !v.fled).map(v => v.id)); S.idx = 0; u.begun = true;
        if (extra && extra.armour) { u.armB = u.armBMax = 320; u.armH = u.armHMax = 300; }
        if (extra && extra.sure) them.forEach(v => { v.mskill = 999; v.weapon = Object.assign({}, FIGHT_DB_ROW('wooden_stick')); });
        if (extra && extra.perk) { if (u.perks.indexOf(extra.perk) < 0) u.perks.push(extra.perk); u.adrenaline = false; }
        say(''); FIGHT_UI.anim = []; FIGHT_UI.glide = null; FIGHT_UI.pend = null; FIGHT_UI.sweep = null; FIGHT_UI.skillMode = null; FIGHT_UI.pinched = false;
        fitNow(); UI.zoom = Math.max(UI.zoom, 0.6); const q = aimAt(c.x + .5, c.y); UI.cx = q[0]; UI.cy = q[1]; clampCam(); camLeft(); FIGHT_UI.pinched = true;   /* the patch on the glass, held there */
        hud(); return { u: u.id, c: c, them: them.filter(v => !v.fled).map(v => v.id), mine: mine.slice(0, friends.length).map(v => v.id) };
      }, [wid, spots, friends || [], extra || null]); };
    const at = id => p.evaluate(i => { const v = FIGHT.byId(i); return { x: sx((v.x + .5) * FIGHT_UI.tw), y: sy((v.y + .5) * FIGHT_UI.th) }; }, id);
    const tile = (x, y) => p.evaluate(([x, y]) => ({ x: sx((x + .5) * FIGHT_UI.tw), y: sy((y + .5) * FIGHT_UI.th) }), [x, y]);
    const heard = () => p.evaluate(() => (FIGHT_UI.heard || []).slice());
    const hurts = () => p.evaluate(() => [...document.querySelectorAll('#hurts .hurt')].filter(e => e.offsetParent || e.getClientRects().length).map(e => ({ id: e.dataset.id, t: e.textContent, maybe: e.classList.contains('maybe') })));
    const settle = async () => { for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !FIGHT_UI.anim.length)) break; await p.waitForTimeout(100); } await p.waitForTimeout(1200); };
    const sq = sel => p.evaluate(s => { const b = document.querySelector(s); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel);
    const tagOk = t => /^\d+% -[1-9]\d*$/.test(t);

    /* P1, P2: the round swing */
    const a = await stage('greataxe', [[1, 0], [1, -1], [-1, 1]], [[1, 1]]);   /* rule 333: two in front of the east aim, one behind, his own front-right */
    await p.waitForTimeout(300);
    const rs = await sq('#skills button[data-sweep="Round Swing"]');
    if (rs) await p.touchscreen.tap(rs.x, rs.y);
    await p.waitForTimeout(500);
    const armed = await p.evaluate(() => ({ lit: FIGHT_UI.shapeLit, say: document.getElementById('say').innerText }));
    const h1 = await hurts();
    await shot('round_swing_armed');
    leg(!!rs && !!armed.lit && armed.lit.armed && armed.lit.tiles.length === 7 && armed.lit.struck.length === 3 && h1.length === 3 && h1.every(h => tagOk(h.t) && a.them.indexOf(h.id) >= 0),
      '*** P1 THE ROUND SWING, ARMED, BEFORE ANY AIM: THE TILES ITS AIMS REACH LIT (SEVEN, THE THREE IN FRONT OF EACH, rule 333), A HURT TAG OVER EACH OF THE THREE IT COULD CATCH, NONE OVER HIS OWN MAN *** (rule 312)',
      (armed.lit ? armed.lit.tiles.length + ' tiles lit, ' + armed.lit.struck.length + ' struck' : 'nothing lit') + '; tags ' + JSON.stringify(h1.map(h => h.t)));
    let q = await at(a.them[0]); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(400);
    const h2 = await hurts(), k0 = (await heard()).length;
    await shot('round_swing_aimed');
    q = await at(a.them[0]); await p.touchscreen.tap(q.x, q.y); await settle();
    const swung = (await heard()).slice(k0).filter(e => /^(hit|vital|melee_hit|hurt|miss)$/.test(e)).length;
    leg(h2.length === 2 && h2.every(h => tagOk(h.t) && h.id !== a.them[2]) && swung === 2,
      '*** P2 AIMED EAST, THEN SWUNG: TWO TAGS (THE THREE IN FRONT: HIM AND THE MAN NORTH-EAST, HIS OWN MAN PASSED OVER, THE MAN BEHIND NONE), THE SWING CATCHES THE TWO *** (rule 333)', 'tags ' + JSON.stringify(h2.map(h => h.t)) + '; ' + swung + ' sounds after the swing');
    /* P3 a plain blow */
    const b = await stage('knife', [[1, 0], [3, 0]]);
    await p.waitForTimeout(300);
    q = await at(b.them[0]); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(400);
    const h3 = await hurts();
    leg(h3.length === 1 && h3[0].id === b.them[0] && tagOk(h3[0].t), '*** P3 A STRIKE PICKED ON ONE MAN SHOWS HIS ONE TAG ***', JSON.stringify(h3));
    await p.evaluate(() => { FIGHT_UI.pend = null; hud(); });
    /* P4 the walk out of their reach */
    const z = await stage('knife', [[-1, 0]], [], { armour: true, sure: true });
    await p.waitForTimeout(300);
    const to = await tile(z.c.x + 2, z.c.y); await p.touchscreen.tap(to.x, to.y); await p.waitForTimeout(400);
    const warn = await p.evaluate(() => ({ say: document.getElementById('say').innerText, held: (FIGHT_UI.pend && FIGHT_UI.pend.heldAt) || null }));
    await shot('zone_walk_warned');
    const hp0 = await p.evaluate(i => FIGHT.byId(i).hp, z.u);
    await p.touchscreen.tap(to.x, to.y);
    let stopped = null;
    for (let i = 0; i < 120 && !stopped; i++) { await p.waitForTimeout(40);
      stopped = await p.evaluate(() => { const w = [...document.querySelectorAll('#winds .wind')].map(e => e.textContent); return w.some(t => /HELD/.test(t)) ? w : null; }); }
    await shot('zone_stop');
    await settle();
    const after = await p.evaluate(([i, c]) => { const u = FIGHT.byId(i); const sw = FIGHT.S.log.filter(e => e.t === 'attack' && e.free && e.to === i).slice(-1)[0];
      return { x: u.x, y: u.y, hp: u.hp, sw: sw ? { hit: sw.hit, hp: sw.hp } : null, held: FIGHT.S.log.some(e => e.t === 'held' && e.id === i), winds: (FIGHT_UI.winds || []).filter(w => w.id === i).map(w => w.n + w.why) }; }, [z.u, z.c]);
    leg(/free swing/.test(warn.say) && /held/.test(warn.say) && warn.held && warn.held.length === 1 && !!stopped && after.held && after.x === z.c.x && after.y === z.c.y
      && after.sw && after.sw.hit && after.sw.hp >= 1 && hp0 - after.hp >= 1 && after.winds.length >= 1,
      '*** P4 THE WALK OUT OF THEIR REACH: WARNED, RINGED, HELD WHEN IT LANDS, NEVER FOR 0, THE BREATH IT COST SAID *** (rules 313, 314)',
      '"' + warn.say.replace(/\s+/g, ' ').slice(0, 140) + '"; ringed ' + (warn.held ? warn.held.length : 0) + '; tags ' + JSON.stringify(stopped) + '; he stands ' + (after.x - z.c.x) + ',' + (after.y - z.c.y) + ' from where he was; the blow -' + (after.sw ? after.sw.hp : '?') + ', breath ' + JSON.stringify(after.winds));
    /* P5 a skill with no target */
    const s = await stage('knife', [[3, 0]], [], { perk: 'adrenaline' });
    await p.waitForTimeout(400);
    const ad = await sq('#skills button[data-skill="adrenaline"]');
    if (ad) await p.touchscreen.tap(ad.x, ad.y);
    await p.waitForTimeout(300);
    const one = await p.evaluate(i => ({ on: FIGHT.byId(i).adrenaline, mode: FIGHT_UI.skillMode, say: document.getElementById('say').innerText }), s.u);
    const ad2 = await sq('#skills button[data-skill="adrenaline"]');
    if (ad2) await p.touchscreen.tap(ad2.x, ad2.y);
    await p.waitForTimeout(300);
    const two = await p.evaluate(i => !!FIGHT.byId(i).adrenaline, s.u);
    leg(!!ad && !one.on && one.mode === 'adrenaline' && /again/i.test(one.say) && two,
      '*** P5 A SKILL WITH NO TARGET IS TWO TAPS: THE FIRST LIGHTS IT, THE SECOND DOES IT *** (rule 312)', JSON.stringify(one) + ' then ' + two);
    leg(d.errs.length === 0, 'P6 nothing threw', d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 160) : ''));
  } catch (e) { leg(false, 'the phone legs ran', String(e.stack || e.message).slice(0, 300)); }
  await d.close();
}

(async () => {
  if (!BEFORE) await headless();
  await phone();
  done();
})();
