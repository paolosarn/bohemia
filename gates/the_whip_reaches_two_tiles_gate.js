#!/usr/bin/env node
/* THE WHIP REACHES TWO TILES (ARMORY 2, rule 320, ask lines 316 and 317; Paolo 11/2: "Pool pole spear: this is so fire and so funny,
   I love the idea of this, I want this in the game... a two tile weapon... it would be a whip kind of vibe... in Battle Brothers I
   think the range is three... the whip would be a range of two tiles... not going to be the most damage ever, but Battle Brothers
   creates a bleeding effect, and maybe we can do a little more damage... slightly more").

   Holds, through the fight's own rules (tools/bohemia_fight_headless.js, the page's scripts unchanged):
     DATA   the four whips and the pool pole spear are rows; every whip's LASH and DISARM reach ours.whip.reach (2); each whip hits a
            little harder than Battle Brothers' battle whip at one end at least; the pool pole is a one-tile spear; the starters
            (the pool pole, the extension cord) are marked for the camp's shelf
     REACH  a whip strikes the man two tiles off and never three; the pool pole the next tile only
     LASH   a lash that takes 6 or more leaves Battle Brothers' two stacks of bleeding (the barbed wire three), 5 a stack, ticking when
            his turn closes, two turns; the live wire stuns about one lash in four and burns a cell a lash; the barbed wire cuts bare
            hands 1 to 2 and not gloved ones (heavy armour); the bullwhip cracks every lash (a nerve check) and is 10 surer
     DISARM no damage; his next turn he cannot strike; it lasts that one turn
     AUTO   whip men in real fights (AUTO both sides) lash from the second tile
     KEYS   the lash's drawn keys (LASH_KEYS): six a beat, out to the man on the key the blow lands, no point of the cord turning
            more than 120 degrees between two drawn keys (AN ENVELOPE RAMPS SLOWER THAN THE GRID), at one and two tiles
   node gates/the_whip_reaches_two_tiles_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine, playOut, FIGHT_FILE } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (c, n, why) => { c ? pass++ : fail++; console.log('  ' + (c ? 'ok  ' : 'FAIL') + ' ' + n + (why ? '  [' + why + ']' : '')); };
const WHIPS = ['extension_cord', 'live_wire', 'barbed_wire', 'rodeo_bullwhip'];

const ctx = engine({ patch: r => r.replace("emit({ t: 'attack', id: a.id, to: t.id,", "emit({ t: 'attack', ax: a.x, ay: a.y, tx: t.x, ty: t.y, id: a.id, to: t.id,") });
const F = ctx.FIGHT, DB = ctx.DB, R = k => { const p = k.split('.'); const o = DB[p[0]][p[1]]; return o && o.value !== undefined ? o.value : o; };
const row = id => DB.weapons.rows.find(r => r.id === id);
const W = R('ours.whip');

/* DATA */
const bb = row('battle_whip'), rows = WHIPS.map(row), pole = row('pool_pole_spear');
leg(rows.every(Boolean) && !!pole, 'the four whips and the pool pole spear are weapon rows', WHIPS.concat('pool_pole_spear').map(id => id + (row(id) ? '' : ' MISSING')).join(', '));
leg(W.reach === 2 && rows.every(r => r && r.range_max === 2 && r.skills.find(s => s.name === 'Lash' && s.range === 2) && r.skills.find(s => s.name === 'Disarm' && s.range === 2)),
  "every whip's LASH and DISARM reach two tiles (Battle Brothers' three, his two)", rows.map(r => r && r.id + ' ' + r.range).join('; '));
leg(rows.every(r => r && (r.damage_min > bb.damage_min || r.damage_max > bb.damage_max) && r.armor_damage_pct <= 30),
  "a little more damage than Battle Brothers' battle whip (" + bb.damage_min + '-' + bb.damage_max + '), still weak against armour', rows.map(r => r && r.id + ' ' + r.damage_min + '-' + r.damage_max + ' vs armour ' + r.armor_damage_pct + '%').join('; '));
leg(pole && pole['class'] === 'spear' && !F.isWhip(pole) && F.reachOf(pole) === 1 && pole.armory.starter && row('extension_cord').armory.starter,
  'the pool pole spear is a one-tile spear; it and the extension cord are the starters (every camp smith\'s shelf)', pole && (pole.damage_min + '-' + pole.damage_max + ', ' + Math.round(pole.value / 10) + ' batteries'));

/* REACH, through canStrike */
ctx.setSeed(3);
F.setup({ seed: 3, kind: 'strip', auto: true, formation: null, party: { faction: 'brigands', count: 2, days: 1 } });
const S = F.S, a = S.units.find(u => u.side === 'you'), t = S.units.find(u => u.side === 'them');
const fresh = (w, d) => { a.weapon = w; a.ap = 99; a.fat = 0; a.disarmed = false; a.hp = a.hpMax = 60; a.bodyRow = null; t.hp = t.hpMax = 900; t.armB = t.armH = 0; t.immune = []; t.bleed = []; t.stunned = false; t.disarmed = false; t.morale = 'Steady'; t.beast = false;
  t.x = a.x + (d || 2); t.y = a.y; S.order = [a.id, t.id]; S.idx = 0; S.over = false; };
let reachBad = [];
rows.concat([bb, row('thorned_whip')]).forEach(w => { fresh(w, 1); const one = F.canStrike(a, t); t.x = a.x + 2; const two = F.canStrike(a, t); t.x = a.x + 3; const three = F.canStrike(a, t); if (!one || !two || three) reachBad.push(w.id); });
fresh(pole, 1); const p1 = F.canStrike(a, t); t.x = a.x + 2; const p2 = F.canStrike(a, t);
leg(!reachBad.length && p1 && !p2, 'a whip strikes one and two tiles off, never three; the pool pole spear the next tile only', reachBad.length ? 'wrong: ' + reachBad.join(', ') : '6 whips, the pole ' + p1 + '/' + p2);

/* LASH: bleeding, its tick, the barbed wire's third stack */
const ev = (k, from) => S.log.slice(from).filter(e => e.t === k);
fresh(row('extension_cord')); let n0 = S.log.length; F.strike(a, t, { roll: 1, head: false, base: 30 });
const st = (t.bleed || []).length, hp0 = t.hp; F._t.turnOver(t); const tick1 = hp0 - t.hp; F._t.turnOver(t); const tick2 = hp0 - tick1 - t.hp; F._t.turnOver(t);
leg(st === W.bleed.stacks && tick1 === W.bleed.stacks * W.bleed.per_turn && tick2 === tick1 && !(t.bleed || []).length,
  "a lash that takes 6 or more bleeds him: two stacks of 5 a turn for two turns (Battle Brothers' Whip page)", st + ' stacks, -' + tick1 + ' then -' + tick2 + ', then none');
fresh(row('barbed_wire')); F.strike(a, t, { roll: 1, head: false, base: 30 });
const bst = (t.bleed || []).length;
fresh(row('extension_cord')); F.strike(a, t, { roll: 1, head: false, base: 1 });
leg(bst === 3 && !(t.bleed || []).length, 'the barbed wire bleeds the most (three stacks); a lash under 6 health draws none', 'barbed ' + bst + ' stacks; a 1-health lash ' + (t.bleed || []).length);

/* the live wire: the stun, the cell */
let stuns = 0, cells0 = S.cellsBurned | 0; const N = 400;
for (let i = 0; i < N; i++) { fresh(row('live_wire')); n0 = S.log.length; F.strike(a, t, { roll: 1, head: false, base: 30 }); if (t.stunned) stuns++; }
const cells = (S.cellsBurned | 0) - cells0;
fresh(row('live_wire')); F.strike(a, t, { roll: 1, head: false, base: 30 }); t.stunned = true; S.order = [t.id, a.id]; S.idx = 0; t.ap = t.apTurn; t.begun = false; t.backRound = -1; F._t.beginTurn(t); const stunAp = t.ap; F._t.turnOver(t);
leg(stuns > N * .15 && stuns < N * .35 && cells === N && stunAp === 0 && !t.stunned,
  'the live wire stuns about one lash in four (he loses his next turn) and burns a cell from the purse every lash', stuns + ' stuns in ' + N + ' lashes (' + Math.round(stuns / N * 100) + '%), ' + cells + ' cells; a stunned man starts his turn with ' + stunAp + ' AP');

/* the barbed wire's hands */
fresh(row('barbed_wire')); F.strike(a, t, { roll: 50, head: false, base: 30 }); const bare = 60 - a.hp;
fresh(row('barbed_wire')); a.bodyRow = { durability: 160 }; F.strike(a, t, { roll: 50, head: false, base: 30 }); const gloved = 60 - a.hp;
leg(bare >= 1 && bare <= 2 && gloved === 0, 'the barbed wire cuts his own bare hands 1 to 2 a lash, hit or miss; gloves (heavy armour, 150 and up) stop it', 'bare -' + bare + ', gloved -' + gloved);

/* the bullwhip: the crack, the aim */
fresh(row('rodeo_bullwhip')); n0 = S.log.length; F.strike(a, t, { roll: 99, head: false, base: 30 }); const cracks = ev('crack', n0).length;
fresh(row('rodeo_bullwhip')); const cB = F.hitChance(a, t, F.strikeSkill(a.weapon)).chance; fresh(row('extension_cord')); const cC = F.hitChance(a, t, F.strikeSkill(a.weapon)).chance;
leg(cracks === 1 && cB - cC === 10, 'the rodeo bullwhip cracks every lash, landed or not (a nerve check), and is the most accurate (+10)', cracks + ' crack on a miss; ' + cB + '% against the cord\'s ' + cC + '%');

/* DISARM */
fresh(row('extension_cord')); const hpD = t.hp; n0 = S.log.length; F.sweep(a, t, { roll: 1 }, 'Disarm');
const dis = t.disarmed, took = hpD - t.hp; t.x = a.x + 1; t.weapon = row('militia_spear'); t.ap = 99; t.fat = 0; S.order = [t.id, a.id]; S.idx = 0;
const tCan = F.canStrike(t, a), why = (F.strikeWhy(t, a) || {}).why; F._t.turnOver(t); const after = F.canStrike(t, a);
leg(dis && took === 0 && !tCan && why === 'disarmed' && after && F.sweepSkills(row('live_wire')).some(s => s.name === 'Disarm'),
  "DISARM takes no health and his weapon is out of play for his next turn, then back (Battle Brothers' Disarm page); it rides the sweep's button", 'disarmed ' + dis + ', -' + took + ' health, his strike ' + tCan + ' (' + why + '), after his turn ' + after);

/* AUTO: whip men in real fights lash from the second tile */
let from2 = 0, from1 = 0, lashes = 0, fights = 0, errs = [];
for (const seed of [4, 11, 19, 27]) {
  try {
    const company = WHIPS.map((id, i) => ({ name: i ? 'M' + i : 'YOU', main: i === 0, background: 'sellsword', level: 3, perks: [], marks: [], gear: { main: id, off: null, body: null, head: null, bag: [null, null] } }));
    ctx.setSeed(seed);
    const Sx = playOut(ctx, { seed, company, party: { faction: 'brigands', count: 5, days: 20, difficulty: 1 }, kind: 'suburb', night: false }, 60000).S;
    fights++;
    Sx.log.forEach(e => { if (e.t !== 'attack' || e.ax === undefined) return; const u = Sx.units.find(x => x.id === e.id); if (!u || u.side !== 'you' || !F.isWhip(u.weapon)) return;
      lashes++; const d = Math.max(Math.abs(e.ax - e.tx), Math.abs(e.ay - e.ty)); if (d === 2) from2++; else if (d === 1) from1++; });
  } catch (e) { errs.push(seed + ': ' + e.message); }
}
leg(fights === 4 && lashes > 10 && from2 > 0 && !errs.length, 'AUTO uses a whip from the second tile (four real fights, his four men each holding one whip)',
  fights + ' fights, ' + lashes + ' lashes: ' + from2 + ' from the second tile, ' + from1 + ' from the next' + (errs.length ? '; ' + errs.join('; ') : ''));

/* KEYS: the lash's drawn keys */
const html = fs.readFileSync(FIGHT_FILE, 'utf8'), m = html.match(/const LASH_KEYS = (\[[\s\S]*?\]);\nconst LASH_CRACK_KEY = (\d+);/);
let K = null; try { K = JSON.parse(m[1]); } catch (e) {}
let worst = 0, rev = [];
if (K) for (const ratio of [1, 1.5, 2.5]) for (let i = 0; i < K[0].length; i++) {
  const seq = K.map(k => [k[i][0] * ratio, k[i][1]]);
  for (let j = 1; j < seq.length - 1; j++) {
    const ax = seq[j][0] - seq[j - 1][0], ay = seq[j][1] - seq[j - 1][1], bx = seq[j + 1][0] - seq[j][0], by = seq[j + 1][1] - seq[j][1];
    if (Math.hypot(ax, ay) < 1e-6 || Math.hypot(bx, by) < 1e-6) continue;
    const ang = Math.abs(Math.atan2(ax * by - ay * bx, ax * bx + ay * by)) * 180 / Math.PI; worst = Math.max(worst, ang); if (ang > 120) rev.push(ratio + 'x point ' + i + ' key ' + j + ' ' + Math.round(ang));
  }
}
const crack = K && m ? K[Number(m[2])] : null, landKey = K ? Math.floor(0.45 * K.length) : -1;
leg(!!K && K.length === 6 && crack && Math.abs(crack[crack.length - 1][0] - 1) < 1e-9 && Math.abs(crack[crack.length - 1][1]) < 1e-9 && landKey === Number(m[2]) && !rev.length && /drawLash\(now\);/.test(html),
  'THE LASH, six drawn keys a beat: out to the man on the key the blow lands (0.45 of the beat), no point of the cord turning past 120 degrees between two drawn keys (AN ENVELOPE RAMPS SLOWER THAN THE GRID), at one and two tiles',
  K ? K.length + ' keys, crack key ' + (m && m[2]) + ' (the landing\'s ' + landKey + '), worst turn ' + Math.round(worst) + ' degrees' + (rev.length ? '; ' + rev.slice(0, 3).join('; ') : '') : 'no LASH_KEYS');

console.log('\nTHE WHIP REACHES TWO TILES GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
