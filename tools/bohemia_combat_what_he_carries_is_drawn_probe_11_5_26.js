#!/usr/bin/env node
/* COMBAT 8 [shields and two weapons] 11/5 -- THE PROBE (a measuring instrument; the gate leg is in
   gates/the_fight_draws_what_he_wears_gate.js, P5). Rule 408, ask line 456, Paolo 11/4: 'the shields were disappearing recently,
   I can't see the shields... the two weapons, it's just all fucked up'.
   It opens the REAL fight (slices/BOHEMIA_FIGHT.html, a computer) on AUTO, several fights against parties that carry shields,
   his company carrying shields, one-handers, two-handers and guns, and counts, over every frame each man is drawn on the glass:
     shield     a man with a shield ON HIS ARM: the frames it was drawn on him, of the frames he was drawn standing (not falling)
     two        a man with a two-handed melee weapon in his hands: the frames it was drawn in his hands (his model's own counts)
     one        a one-handed melee weapon: the frames it was drawn in his fist
     double     a man with a GUN in his hands whose own model carries a melee weapon (the thug's pipe, the poacher's hatchet):
                frames drawn with both (two weapons where he holds one)
     wrongthing a melee weapon drawn as his model's own thing when it is another (a thug's sword drawn as his pipe)
   and WHY a frame missed (the look has no keys for it, the layer is held back on his look, the draw fell to the old picture).
     node tools/bohemia_combat_what_he_carries_is_drawn_probe_11_5_26.js [--secs 14] [--json out.json]   */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const SECS = Number(arg('--secs', 14)), OUT = arg('--json', null);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const g = (main, off, bag) => ({ main, off, body: null, head: null, bag: bag || [] });
/* his company: shields with one-handers and pistols, two-handers, guns */
const crew = [
  { background: 'companion_1hand', name: 'YOU', main: true, gear: g('bludgeon', 'wooden_shield') },
  { background: 'companion_1hand', name: 'RAUL', gear: g('bludgeon', 'wooden_shield') },
  { background: 'messenger', name: 'JAMAL', gear: g('shortsword', 'heavy_metal_shield') },
  { background: 'companion_1hand', name: 'LUZ', gear: g('dagger', 'buckler') },
  { background: 'companion_1hand', name: 'NENA', gear: g('handaxe', 'kite_shield') },
  { background: 'companion_2hand', name: 'TINA', gear: g('two_handed_mallet', null) },
  { background: 'companion_2hand', name: 'BETO', gear: g('woodcutter_s_axe', null) },
  { background: 'companion_2hand', name: 'CHUY', gear: g('pitchfork', null) },
  { background: 'companion_ranged', name: 'DANTE', gear: g('light_crossbow', null) },
  { background: 'companion_1hand', name: 'PACO', gear: g('bludgeon', null) },
  { background: 'companion_1hand', name: 'LALO', gear: g('hatchet', 'wooden_shield') },
  { background: 'companion_1hand', name: 'RITA', gear: g('shortsword', 'wooden_shield') }];
const FIGHTS = [
  { seed: 7, kind: 'desert', faction: 'brigands' }, { seed: 11, kind: 'works', faction: 'brigands' },
  { seed: 13, kind: 'suburb', faction: 'noble_houses' }, { seed: 17, kind: 'works', faction: 'mob' },
  { seed: 19, kind: 'desert', faction: 'cartel' }, { seed: 23, kind: 'suburb', faction: 'cultists' }];
(async () => {
  const tot = {}, why = {}, looks = {}, per = [];
  const add = (o, k, n) => { o[k] = (o[k] || 0) + (n || 1); };
  for (const fx of FIGHTS) {
    const o = { seed: fx.seed, kind: fx.kind, company: crew, cap: 12, formation: null, party: { count: 10, days: 30, difficulty: 2, faction: fx.faction }, teach: false, deploy: false, auto: true };
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'computer', arm: 'window.FIGHT_OPTS=' + JSON.stringify(o) });
    const errs = []; d.page.on('pageerror', e => errs.push(String(e)));
    try { await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 60000 }); }
    catch (e) { console.log('  fight ' + fx.faction + '/' + fx.seed + ': did not open (' + (errs[0] || e.message).slice(0, 160) + ')'); await d.close(); continue; }
    await d.page.evaluate(() => {
      const W = window.__CARRY = { men: {} };
      const M = () => typeof MELEE !== 'undefined' && MELEE.meta;
      const propOf = v => { const m = M(), w = v.weapon && (v.weapon.of || v.weapon); if (!m || !w || FIGHT.isGun(v.weapon)) return null;
        if (FIGHT._t.bothHands(v.weapon)) return (m.two_by_row || {})[w.id] || (m.two_by_class || {})[w.class] || null;
        return m.by_row[w.id] || m.by_class[w.class] || null; };
      /* why his shield cannot be drawn on his own keys (the draw's own preconditions, in its order) */
      const whyNot = v => { const m = M(), L = lookOf(v); if (!m) return 'no melee meta';
        if (!holdLook(L)) return 'no held look (rig_hold)';
        const e = meleeLook(L._key); if (!e) return m.looks[L.ref] ? 'rolled man, no keys of his own' : 'no melee look';
        if (!e.clips || !e.clips.SIdle) return 'his look has no shield keys';
        const sh = m.shield_by_row[(v.shield.of || v.shield).id], wh = e.withhold || [];
        const r1 = meleeLook(e.ref || e.props_ref), srcs = [e.props ? e : null, r1].filter(q => q && q.props);
        const any = srcs.some(x => { const by = x.props.by[sh]; return by && Object.keys(by).some(c => by[c] && wh.indexOf(by[c].l) < 0); });
        if (!any) return 'the shield layer is held back on his look (' + wh.join(',') + ')';
        return 'drawable'; };
      W.whyNot = whyNot;
      const bm = window.blitMan; window.blitMan = function (v) {
        const b = Object.assign({}, FIGHT_UI.clipSeen || {}), gs = v.weapon && FIGHT.isGun(v.weapon);
        const out = bm.apply(this, arguments);
        if (v.machine || v.ghost || v.beast || v._fallAt !== undefined || !FIGHT.onField(v)) return out;
        const cs = FIGHT_UI.clipSeen || {}, nw = Object.keys(cs).filter(k => (cs[k] || 0) > (b[k] || 0));
        const L = lookOf(v), e = MELEE.looks[L._key] && MELEE.looks[L._key].d;
        const r = W.men[v.id] = W.men[v.id] || { side: v.side, look: L._key, weapon: v.weapon && (v.weapon.of || v.weapon).id, two: !!(v.weapon && !gs && FIGHT._t.bothHands(v.weapon)),
          gun: !!gs, shield: v.shield ? (v.shield.of || v.shield).id : null, held: e && e.held ? e.held.join('/') : null, ownKit: !!L.own_kit, prop: propOf(v), f: 0, sh: 0, thing: 0, heldF: 0, why: {} };
        r.f++;
        const shD = nw.some(k => /^shield:/.test(k)), thD = nw.some(k => /^prop:/.test(k)), hD = nw.some(k => /^held:/.test(k));
        if (shD) r.sh++; if (thD) r.thing++; if (hD) r.heldF++;
        if (v.shield && !shD) { const y = whyNot(v); r.why[y] = (r.why[y] || 0) + 1; }
        return out; };
    });
    await d.page.waitForTimeout(SECS * 1000);
    const men = await d.page.evaluate(() => Object.values(window.__CARRY.men));
    await d.close();
    men.forEach(m => {
      per.push(Object.assign({ fight: fx.faction + '/' + fx.seed }, m));
      if (m.shield && !m.ownKit) { add(tot, 'shield_frames', m.f); add(tot, 'shield_drawn', m.sh); add(tot, 'shield_men'); if (m.sh < m.f * 0.5) { add(tot, 'shield_men_mostly_bare'); add(looks, m.look); }
        Object.keys(m.why).forEach(k => add(why, k, m.why[k])); }
      if (m.two && !m.ownKit) { add(tot, 'two_frames', m.f); add(tot, 'two_drawn', m.thing + m.heldF); add(tot, 'two_men'); }
      if (!m.two && !m.gun && m.weapon && m.prop && !m.ownKit) { add(tot, 'one_frames', m.f); add(tot, 'one_drawn', m.thing + m.heldF); add(tot, 'one_men'); }
      if (m.gun && m.held) { add(tot, 'double_men'); add(tot, 'double_frames', m.f); }
      if (!m.gun && m.held && m.prop && m.held.indexOf(m.prop) < 0 && m.heldF) { add(tot, 'wrongthing_men'); add(tot, 'wrongthing_frames', m.heldF); }
    });
    console.log('  fight ' + fx.faction + '/' + fx.seed + ': ' + men.length + ' men drawn, ' + errs.length + ' page errors');
  }
  const pc = (a, b) => b ? (100 * a / b).toFixed(1) + '%' : 'n/a';
  console.log('\nSHIELD ON THE ARM: drawn on ' + pc(tot.shield_drawn || 0, tot.shield_frames) + ' of ' + (tot.shield_frames || 0) + ' frames, ' + (tot.shield_men || 0) + ' men, ' + (tot.shield_men_mostly_bare || 0) + ' bare most of the time');
  Object.keys(why).sort((a, b) => why[b] - why[a]).forEach(k => console.log('   missed: ' + why[k] + ' frames  ' + k));
  console.log('   looks bare of their shield: ' + JSON.stringify(looks));
  console.log('TWO-HANDER IN HIS HANDS: drawn on ' + pc(tot.two_drawn || 0, tot.two_frames) + ' of ' + (tot.two_frames || 0) + ' frames, ' + (tot.two_men || 0) + ' men');
  console.log('ONE-HANDER IN HIS FIST: drawn on ' + pc(tot.one_drawn || 0, tot.one_frames) + ' of ' + (tot.one_frames || 0) + ' frames, ' + (tot.one_men || 0) + ' men');
  console.log('TWO WEAPONS (a gun in his hands, his model\'s own club too): ' + (tot.double_men || 0) + ' men, ' + (tot.double_frames || 0) + ' frames');
  console.log('THE WRONG THING (his model\'s own club drawn for another weapon): ' + (tot.wrongthing_men || 0) + ' men, ' + (tot.wrongthing_frames || 0) + ' frames');
  if (OUT) fs.writeFileSync(OUT, JSON.stringify({ at: new Date().toISOString(), tot, why, looks, per }, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
