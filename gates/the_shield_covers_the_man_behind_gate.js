#!/usr/bin/env node
/* THE SHIELD COVERS THE MAN BEHIND IT (COMBAT [the shield covers the man behind], rule 230(b)(c), Paolo 10/26: 'there's obviously a
   defensive bonus when you are at the rear of your teammate that has a shield against enemy ranged attacks';
   records/BOHEMIA_PAOLO_THE_FIGHT_CAMERA_FOLLOWS_THE_FIGHT_AND_THE_SHIELD_COVERS_THE_MAN_BEHIND_10_26_26.md).
   MEASURED BEFORE: the fight had Battle Brothers' blocked line (-75, 'in the way') since rule 63, but a blocked shot that missed
   went nowhere, nothing on the board showed the cover, and the shot square said only its chance.
   Battle Brothers (rules.json hit_chance.ranged.cover_hit_chance_page, astray_damage_multiplier): 'If this fails the shot goes
   astray. One among the intended target obstacles is randomly chosen and targeted instead. If the shot goes astray a -15% penalty
   to hit chance is applied'; Damage: 'Shot goes astray 0.75'.
   Legs:
   S1 ASTRAY, OVER 1,500 BLOCKED SHOTS (headless, the live rules): his crossbowman at a man of theirs behind a shield man of
      theirs: every miss flies on into the man in the way, at the chance -15 (each roll's chance read back), the astray hits land
      within three standard deviations of the sum of their chances; a hit never goes astray;
   S2 THE DAMAGE: an astray hit of the same base damage is three quarters of a straight one, to the point;
   S3 THE SHOTGUN STILL IGNORES THE LINE: the man in the way takes nothing off its chance and nothing goes astray;
   S4 THE MARK AND THE CUT (the real page, his phone and his computer): his crossbowman's turn, a man of theirs behind a man and
      one in the clear: the covered one wears the shield mark, the clear one none; picked, the covered one's shot square shows a
      red down arrow and the cut (the chance without the man in the way less the chance with him), the clear one's none;
   S5 nothing threw.
   Run: node gates/the_shield_covers_the_man_behind_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== THE SHIELD COVERS THE MAN BEHIND GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  const errs = [];
  const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
  const ctx = engine(), F = ctx.FIGHT, vm = require('vm');
  const R = k => vm.runInContext("R('" + k + "')", ctx);
  const PEN = R('hit_chance.ranged.cover_hit_chance_page').astray_penalty, MULT = R('hit_chance.ranged.astray_damage_multiplier');
  /* the scene: his crossbowman on (3,7), a man of theirs on (9,7), a man of theirs with a car door on (8,7) between */
  const scene = (main, seed, near) => {
    ctx.setSeed(seed);
    F.setup({ seed, kind: 'suburb', flat: true, auto: true, formation: null, deploy: false, cap: 1, company: [{ background: 'companion_ranged', gear: { main: main, off: null, body: null, head: null, bag: [] } }], band: ['brigand_thug', 'brigand_thug'] });
    const S = F.S; S.deploy = false;
    const me = S.units.find(v => v.side === 'you'), th = S.units.filter(v => v.side === 'them');
    me.x = 3; me.y = 7; th[0].x = near ? 5 : 9; th[0].y = 7; th[1].x = near ? 4 : 8; th[1].y = 7;   /* near: the shotgun's two tiles, the man in the way between */
    [me].concat(th).forEach(v => { v.hp = v.hpMax = 9999; });
    S.order = [me.id, th[0].id, th[1].id]; S.idx = 0; me.begun = true;
    return { S, me, t: th[0], way: th[1] };
  };
  /* S1, S2 */
  {
    const M = { shots: 0, hits: 0, misses: 0, astray: 0, astrayHits: 0, expect: 0, varSum: 0, wrongChance: 0, hitWent: 0, noWay: 0 };
    let c = null;
    try {
      c = scene('light_crossbow', 501);
      const snap = F.freeze();
      const cut = F.coverCut(c.me, c.t);
      for (let k = 0; k < 1500; k++) {
        F.thaw(snap, true); ctx.setSeed(9000 + k);
        const me = F.S.units.find(v => v.side === 'you'), t = F.byId(c.t.id), way = F.byId(c.way.id);
        me.ap = me.apTurn; me.fat = 0; me.loaded = true; F.S.order = [me.id, t.id, way.id]; F.S.idx = 0;
        const want = F.hitChance(me, way).chance + PEN, n0 = F.S.log.length;
        const q = F.strike(me, t); if (!q) { M.noWay++; continue; }
        M.shots++; if (q.hit) { M.hits++; if (q.astray) M.hitWent++; continue; }
        M.misses++;
        if (q.astray) {
          M.astray++; const p = Math.max(R('hit_chance.cap').min, want) / 100; M.expect += p; M.varSum += p * (1 - p);
          if (q.astray.chance !== Math.max(R('hit_chance.cap').min, want)) M.wrongChance++;
          if (q.astray.hit) M.astrayHits++;
        }
        F.S.events = [];
      }
      const sd = Math.sqrt(M.varSum), within = Math.abs(M.astrayHits - M.expect) <= 3 * sd + 1;
      leg(M.shots >= 1400 && M.misses > 500 && M.astray === M.misses && M.hitWent === 0 && M.wrongChance === 0 && within,
        '*** S1 A BLOCKED SHOT THAT MISSES GOES ASTRAY INTO THE MAN IN THE WAY, AT -15 *** (rule 230(b), the wiki\'s Hit Chance page)',
        M.shots + ' shots through the man in the way (the cut on the shot ' + (cut ? cut.cut : '?') + ' points): ' + M.hits + ' hit, ' + M.misses + ' missed, ' + M.astray + ' of those flew on; astray hits ' + M.astrayHits + ' against ' + M.expect.toFixed(1) + ' expected (3 sd ' + (3 * sd).toFixed(1) + '); a chance off by the -15 ' + M.wrongChance + '; a hit that went astray ' + M.hitWent);
      /* S2: the same base damage, straight and astray, on the man in the way */
      F.thaw(snap, true);
      const me = F.S.units.find(v => v.side === 'you'), way = F.byId(c.way.id);
      const straight = F.resolveAttack(me, way, null, { roll: 1, head: false, base: 40 }), astr = F.resolveAttack(me, way, null, { roll: 1, head: false, base: 40, astray: true });
      const sDmg = straight.armour + straight.hp, aDmg = astr.armour + astr.hp, aWant = F.resolveAttack(me, way, null, { roll: 1, head: false, base: 40 * MULT });
      leg(straight.hit && astr.hit && aDmg === aWant.armour + aWant.hp && aDmg < sDmg,
        '*** S2 AN ASTRAY HIT IS THREE QUARTERS OF THE SHOT *** (the wiki\'s Damage page: \'Shot goes astray 0.75\')',
        'base 40: straight ' + sDmg + ' (armour ' + straight.armour + ', health ' + straight.hp + '), astray ' + aDmg + ', the shot of base ' + (40 * MULT) + ' ' + (aWant.armour + aWant.hp));
    } catch (e) { leg(false, 'S1/S2 ran', String(e.message).slice(0, 200)); }
  }
  /* S3: the shotgun */
  try {
    const c = scene('handgonne', 502, true);
    const cut = F.coverCut(c.me, c.t);
    let astray = 0, shots = 0;
    const snap = F.freeze();
    for (let k = 0; k < 200; k++) {
      F.thaw(snap, true); ctx.setSeed(7000 + k);
      const me = F.S.units.find(v => v.side === 'you'), t = F.byId(c.t.id);
      me.ap = me.apTurn; me.fat = 0; me.loaded = true; me.ammo = 99; F.S.order = [me.id, t.id, c.way.id]; F.S.idx = 0;
      const q = F.strike(me, t); if (!q) continue; shots++; if (q.astray) astray++; F.S.events = [];
    }
    leg(cut === null && shots > 100 && astray === 0, '*** S3 THE SHOTGUN STILL IGNORES THE LINE *** (rule 230(b); the wiki: \'unaffected by objects or characters in the line of fire\')', 'cut ' + JSON.stringify(cut) + ', ' + shots + ' shots, ' + astray + ' astray');
  } catch (e) { leg(false, 'S3 ran', String(e.message).slice(0, 200)); }
  /* S4: the page */
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const ARM = "window.__fe=[];addEventListener('error',function(e){try{window.__fe.push(String(e.message||e).slice(0,160))}catch(_){}});";
  for (const profile of ['phone_portrait', 'computer']) {
    const tag = profile === 'computer' ? 'COMPUTER' : 'PHONE';
    let d = null;
    try {
      const o = { seed: 503, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, teach: false, odds: false, cap: 1, company: [{ background: 'companion_ranged', gear: { main: 'light_crossbow', off: null, body: null, head: null, bag: [] } }], band: ['brigand_thug', 'brigand_thug', 'brigand_thug'] };
      d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: ARM + 'window.FIGHT_OPTS=' + JSON.stringify(o) + ';' });
      const p = d.page;
      await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
      let mine = false; for (let i = 0; i < 300 && !mine; i++) { mine = await p.evaluate(() => { const u = FIGHT.current(); return !FIGHT.S.over && crewControlled(u) && !FIGHT_UI.anim.length; }); if (!mine) await p.waitForTimeout(100); }
      const ids = await p.evaluate(() => { const S = FIGHT.S, me = FIGHT.current(), th = S.units.filter(v => v.side === 'them' && FIGHT.onField(v));
        me.x = 4; me.y = 6; th[0].x = 9; th[0].y = 6; th[1].x = 8; th[1].y = 6; th[2].x = 8; th[2].y = 9; me.ap = me.apTurn; me.loaded = true;
        [me].concat(th).forEach(v => { v._at = undefined; });
        FIGHT_UI.pinched = false; FIGHT_UI.coverC = {}; hud(); return { covered: th[0].id, way: th[1].id, clear: th[2].id }; });
      await p.waitForTimeout(400);
      const marks = await p.evaluate(ids => { const now = performance.now(), m = id => { const v = FIGHT.byId(id); return !!(v._cover && now - v._cover.at < 300); };
        return { covered: m(ids.covered), way: m(ids.way), clear: m(ids.clear), cut: FIGHT.coverCut(FIGHT.current(), FIGHT.byId(ids.covered)), clearCut: FIGHT.coverCut(FIGHT.current(), FIGHT.byId(ids.clear)) }; }, ids);
      const sq = async id => p.evaluate(id => { const u = FIGHT.current(), t = FIGHT.byId(id); FIGHT_UI.pend = { target: t, kind: 'strike' }; document.getElementById('skills').dataset.key = ''; hud();
        const bt = document.querySelector('#bstrike b'), c = bt && bt.querySelector('.cut');   /* UI's arrow (rule 224): red, down, and how much */
        return bt ? { text: bt.textContent, cut: c ? (c.classList.contains('dn') && c.querySelector('i.bst-arw') && +c.dataset.delta === -c.dataset.cut ? c.dataset.cut : 'not the kit\'s red arrow') : '' } : null; }, id);
      const sc = await sq(ids.covered), sf = await sq(ids.clear);
      const want = marks.cut ? String(marks.cut.cut) : null;
      leg(marks.covered && !marks.clear && marks.cut && !marks.clearCut && sc && sc.cut === want && sf && !sf.cut,
        '*** S4 ' + tag + ': THE SHIELD-COVER MARK EXACTLY WHEN BLOCKED, AND THE CUT ON THE SHOT *** (rule 230(c))',
        'covered marked ' + marks.covered + ' (cut ' + (marks.cut && marks.cut.cut) + '), clear marked ' + marks.clear + '; the shot square on the covered "' + (sc && sc.text) + '", on the clear "' + (sf && sf.text) + '"');
      errs.push.apply(errs, (await p.evaluate(() => window.__fe || [])).map(e => tag + ': ' + e));
    } catch (e) { leg(false, 'S4 ' + tag + ' ran', String(e.message).slice(0, 200)); }
    finally { if (d) await d.close().catch(() => {}); }
  }
  leg(errs.length === 0, 'S5 nothing threw', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
