#!/usr/bin/env node
/* ICONS, NOT NUMBERS, IN THE FIGHT (COMBAT, rule 224 on the fight's screens; Paolo 10/26: 'this is a universal thing... I'm tired
   of it just being numbers numbers numbers... more icons, more green up arrow, down red arrow, and the only number that matters is
   by how much... universally across the board for all the UI'; records/BOHEMIA_PAOLO_ICONS_NOT_NUMBERS_EVERYWHERE_AND_EVERYTHING_IN_THE_LAST_THREE_DAYS_10_26_26.md).
   UI owns the kit (engine/bohemia_stats.js: the mark, the arrow and the amount); COMBAT's fight uses it on its own lines.
   MEASURED BEFORE (the fight at 10bfd6a9, seed 3 on a strip, his turn, his pistol man with a car door, two rounds gone): his bar
   said '9/9 AP 0/74 FAT +30' (the fatigue twice: its bar said 0/74 too, the wind back a pale '+30'); his card 'Armour, head 30 / 30',
   'Armour, body 30 / 30', 'Rounds left 3 / 5'; the weapon card 'Reach 1 to 4 tiles', 'Rounds 5, then Reload 4 AP', the car door
   'Melee / ranged defence +15 / +15'; the shot square's cover cut a text arrow. The numerals counted (a run of digits in shown text,
   UI THREE's counter): BEFORE below, phone and computer.
   Legs (the real page, his phone and his computer):
   P1 HIS BAR: the AP he spends said once ('N AP', its pips the picture), no fatigue figure (the bar's own number says the wind
      left, once), and what comes back next turn is UI's mark: the lungs, a green up arrow and the amount (+30 unspent), inside the
      line's own 12 px (a 16 px line grew the bar 4 px and the wide screens lost the one-row bar: measured 10/26);
   P2 HIS CARD: armour head and body are bars filled to what is left with the number once; the rounds left are rounds, lit as
      many as are left of the magazine;
   P3 THE WEAPON CARD: the reach as tiles (the gun's point-blank dark, the rest lit), the magazine as rounds, the two armour
      numbers filled against the most any weapon in the table carries, the car door's two defences UI's marks (the icon, a green
      up arrow and how much);
   P4 FEWER NUMBERS: the numerals on his bar, his card and the weapon card each under the before;
   P5 nothing threw.
   Run: node gates/icons_not_numbers_in_the_fight_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== ICONS, NOT NUMBERS, IN THE FIGHT GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const BEFORE = { PHONE: { bar: 16, card: 15, weapon: 12 }, COMPUTER: { bar: 16, card: 15, weapon: 12 } };
const COUNT = root => {   /* UI THREE's counter (tools/bohemia_ui_three_numeral_count.js): digit runs in shown text */
  const shown = el => { const r = el.getBoundingClientRect(); if (!(r.width > 1 && r.height > 1)) return false;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; }
    return true; };
  const el = root ? document.getElementById(root) : document.body, w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), list = []; let t;
  while ((t = w.nextNode())) { const m = t.nodeValue.match(/\d+/g); if (!m || !t.parentElement || !shown(t.parentElement)) continue; list.push(...m); }
  return list;
};
(async () => {
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const ARM = "window.__fe=[];addEventListener('error',function(e){try{window.__fe.push(String(e.message||e).slice(0,160))}catch(_){}});";
  const errs = [], counts = {};
  for (const profile of ['phone_portrait', 'computer']) {
    const tag = profile === 'computer' ? 'COMPUTER' : 'PHONE';
    let d = null;
    try {
      d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: ARM + 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 3, kind: 'strip', speed: 1, auto: false, night: false, deploy: false, teach: false, odds: false }) + ';' });
      const p = d.page;
      await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
      let mine = false; for (let i = 0; i < 300 && !mine; i++) { mine = await p.evaluate(() => { const u = FIGHT.current(); return !FIGHT.S.over && crewControlled(u) && !FIGHT_UI.anim.length; }); if (!mine) await p.waitForTimeout(100); }
      /* the pistol man with the car door has the turn, two rounds gone, nothing spent */
      const me = await p.evaluate(() => { const S = FIGHT.S, cur = FIGHT.current();
        const m = S.units.find(v => v.side === 'you' && FIGHT.onField(v) && v.weapon && v.weapon.mag && v.shield) || S.units.find(v => v.side === 'you' && FIGHT.onField(v) && v.weapon && v.weapon.mag);
        if (!m) return null;
        const i = S.order.indexOf(m.id), j = S.order.indexOf(cur.id); if (i >= 0 && j >= 0) { S.order[j] = m.id; S.order[i] = cur.id; } m.begun = true;
        m.ap = m.apTurn; m.ammo = Math.max(0, m.weapon.mag - 2); m.loaded = true; FIGHT_UI.pend = null; FIGHT_UI.drawer = false;
        document.getElementById('drawer').style.display = 'none'; hud();
        return { id: m.id, ap: m.ap, fat: Math.round(m.fat), fm: FIGHT.fatMax(m), mag: m.weapon.mag, ammo: m.ammo, shield: m.shield ? { md: m.shield.melee_defense || 0, rd: m.shield.ranged_defense || 0 } : null,
          armH: m.armH, armHMax: m.armHMax, armB: m.armB, armBMax: m.armBMax, back: FIGHT_UI && 0, rest: (function () { try { return R('ours.rest_recovery'); } catch (e) { return null; } })() }; });
      if (!me) { leg(false, 'P0 ' + tag + ': a man of his with a magazine', 'none'); continue; }
      await p.waitForTimeout(200);
      /* P1 his bar */
      const bar = await p.evaluate(() => { const a = document.getElementById('apn'), bk = a.querySelector('.back'), mk = bk && bk.querySelector('i.bst-mark');
        const ch = mk && mk.querySelector('b.bst-chg'), fn = document.querySelector('#stats .bar.bm-fat b.bm-num');
        return { text: a.textContent, h: Math.round(a.getBoundingClientRect().height), back: bk ? bk.textContent : null, stat: mk ? mk.dataset.stat : null, up: !!(ch && ch.classList.contains('up') && ch.querySelector('i.bst-arw')), fatNum: fn ? fn.textContent : null }; });
      counts[tag] = { bar: (await p.evaluate(COUNT, null)).length };
      leg(bar.text.indexOf(me.ap + ' AP') === 0 && bar.h <= 12 && !/FAT/.test(bar.text) && !/\d+\/\d+/.test(bar.text) && bar.stat === 'fatigue' && bar.up && bar.back === '+' + me.rest && (bar.fatNum === null || bar.fatNum === me.fat + '/' + me.fm),
        '*** P1 ' + tag + ': HIS BAR SAYS THE AP ONCE, THE WIND ON ITS BAR, AND WHAT COMES BACK AS THE LUNGS, A GREEN UP ARROW AND HOW MUCH *** (rule 224)',
        '"' + bar.text + '" on a line ' + bar.h + ' px (12 before: a taller line grows the bar and breaks the wide one-row bar); the mark ' + bar.stat + ' up ' + bar.up + ' "' + bar.back + '" (unspent: +' + me.rest + '); the fatigue bar says "' + bar.fatNum + '"');
      /* P2 his card */
      const card = await p.evaluate(id => { const v = FIGHT.byId(id); FIGHT_UI.drawer = true; drawer(v); const d = document.getElementById('drawer');
        const row = w => [...d.querySelectorAll('.r')].find(r => (r.querySelector('span') || {}).textContent === w);
        const cb = r => { const b = r && r.querySelector('i.cbar'); if (!b) return null; const f = b.querySelector('i'); return { n: +b.dataset.n, of: +b.dataset.of, fill: parseFloat(f.style.width), txt: b.textContent }; };
        const pp = r => { const b = r && r.querySelector('i.pips'); return b ? { lit: b.querySelectorAll('i:not(.off)').length, all: b.querySelectorAll('i').length } : null; };
        return { head: cb(row('Armour, head')), body: cb(row('Armour, body')), rounds: pp(row('Rounds left')) }; }, me.id);
      counts[tag].card = (await p.evaluate(COUNT, 'drawer')).length;
      const barOk = (b, n, of) => b && b.n === n && b.of === of && Math.abs(b.fill - 100 * n / Math.max(1, of)) < 0.2 && b.txt === String(n);
      leg(barOk(card.head, me.armH, me.armHMax) && barOk(card.body, me.armB, me.armBMax) && card.rounds && card.rounds.lit === me.ammo && card.rounds.all === me.mag,
        '*** P2 ' + tag + ': HIS CARD: THE ARMOUR TWO BARS WITH THE NUMBER ONCE, THE ROUNDS LEFT AS ROUNDS *** (rule 224)',
        'head ' + JSON.stringify(card.head) + ', body ' + JSON.stringify(card.body) + ' (want ' + me.armH + ' of ' + me.armHMax + ', ' + me.armB + ' of ' + me.armBMax + '); rounds ' + JSON.stringify(card.rounds) + ' (want ' + me.ammo + ' of ' + me.mag + ')');
      /* P3 the weapon card */
      const wc = await p.evaluate(id => { const v = FIGHT.byId(id); weaponCard(v); const d = document.getElementById('drawer');
        const row = w => [...d.querySelectorAll('.r')].find(r => (r.querySelector('span') || {}).textContent === w);
        const rr = row('Reach'), tp = rr && rr.querySelector('i.pips.tiles'), rd = row('Rounds'), rp = rd && rd.querySelector('i.pips'), df = row('Defence');
        const most = k => DB.weapons.rows.reduce((m, x) => Math.max(m, x[k] || 0), 1), w = v.weapon, gun = FIGHT.isGun(w) && FIGHT.isRanged(w), lo = gun ? FIGHT._t.rangeLo(w) : 1;
        const pc = (lab, k) => { const r = row(lab); if (!r || w[k] === null || w[k] === undefined || !w[k]) return { none: true }; const b = r.querySelector('i.cbar'); if (!b) return { bar: false };
          return { bar: true, ok: +b.dataset.n === w[k] && +b.dataset.of === most(k) && Math.abs(parseFloat(b.querySelector('i').style.width) - 100 * w[k] / most(k)) < 0.2 }; };
        const marks = df ? [...df.querySelectorAll('i.bst-mark')].map(m => ({ stat: m.dataset.stat, d: +m.dataset.delta, up: !!m.querySelector('b.bst-chg.up i.bst-arw') })) : null;
        return { tiles: tp ? { off: tp.querySelectorAll('i.off').length, all: tp.querySelectorAll('i').length } : null, lo: lo, hi: w.range_max,
          rounds: rp ? { lit: rp.querySelectorAll('i:not(.off)').length, all: rp.querySelectorAll('i').length, words: rd.textContent } : null,
          armour: pc('Against armour', 'armor_damage_pct'), through: pc('Straight through armour', 'armor_ignore_pct'), marks: marks }; }, me.id);
      counts[tag].weapon = (await p.evaluate(COUNT, 'drawer')).length;
      const pctOk = x => x && (x.none || (x.bar && x.ok));
      const markOk = !me.shield || (wc.marks && wc.marks.length === 2 && wc.marks[0].stat === 'melee_defense' && wc.marks[0].d === me.shield.md && wc.marks[1].stat === 'ranged_defense' && wc.marks[1].d === me.shield.rd && wc.marks.every(m => m.up || m.d <= 0));
      leg(wc.tiles && wc.tiles.all === wc.hi && wc.tiles.off === wc.lo - 1 && wc.rounds && wc.rounds.lit === me.mag && wc.rounds.all === me.mag && /RELOAD|Reload/.test(wc.rounds.words) && pctOk(wc.armour) && pctOk(wc.through) && markOk,
        '*** P3 ' + tag + ': THE WEAPON CARD: THE REACH AS TILES, THE MAGAZINE AS ROUNDS, THE ARMOUR NUMBERS FILLED, THE CAR DOOR\'S DEFENCES AS UI\'S MARKS *** (rule 224)',
        'tiles ' + JSON.stringify(wc.tiles) + ' (reach ' + wc.lo + ' to ' + wc.hi + '); rounds ' + JSON.stringify(wc.rounds && { lit: wc.rounds.lit, all: wc.rounds.all }) + '; armour ' + JSON.stringify(wc.armour) + ', through ' + JSON.stringify(wc.through) + '; the door ' + JSON.stringify(wc.marks) + (me.shield ? ' (want +' + me.shield.md + ' / +' + me.shield.rd + ')' : ' (no door)'));
      errs.push.apply(errs, (await p.evaluate(() => window.__fe || [])).map(e => tag + ': ' + e));
    } catch (e) { leg(false, tag + ' ran', String(e.message).slice(0, 200)); }
    finally { if (d) await d.close().catch(() => {}); }
  }
  if (process.argv.includes('--count')) console.log('  COUNTS ' + JSON.stringify(counts));
  const fewer = Object.keys(BEFORE).every(t => counts[t] && ['bar', 'card', 'weapon'].every(k => counts[t][k] < BEFORE[t][k]));
  leg(fewer, '*** P4 FEWER NUMBERS: HIS BAR, HIS CARD AND THE WEAPON CARD EACH UNDER THE BEFORE, PHONE AND COMPUTER *** (rule 224(c))',
    Object.keys(BEFORE).map(t => t + ' bar ' + BEFORE[t].bar + ' -> ' + (counts[t] || {}).bar + ', card ' + BEFORE[t].card + ' -> ' + (counts[t] || {}).card + ', weapon card ' + BEFORE[t].weapon + ' -> ' + (counts[t] || {}).weapon).join('; '));
  leg(errs.length === 0, 'P5 nothing threw', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
