/* ==========================================================================
   THE FIGHT IS CLOSE  (TUNING 2 [the fight is close], 11/3/26, VAMILY rule 370, ask line 396)

   PAOLO 11/3: 'right now I'm just killing, I'm unstoppable... rare men in cheap gear, I just buy them [gear for] 21 and nothing can stop
   me... even Battle Brothers' easiest difficulty felt like I had difficulty... I don't even feel like I get one shot anywhere... for all
   difficulties the tuning is so important, the numbers, how close things can get, but you still feel good.'
   MEASURED BY CLOSENESS, NOT WINS (370(6)). Every band is a row in TUNING's one table (records/target/bb/party_math.json
   closeness_bands), never a number typed here; the fights are the live fight's own (tools/bohemia_difficulty_the_curve.js --close:
   slices/BOHEMIA_FIGHT.html's rules and data headless, AUTO both sides, seeded, the map's job math line for line).
     P1  PRICE IS POWER (370(3)): on the armourer's shelf no piece costs more than a piece of its slot that holds at least as much and
         weighs no more (records/target/bb/armor.json; tools/bohemia_tuning_price_is_power.py keeps it so)
     P2  THE GOOD PIECE COSTS WHAT IT IS WORTH: the dearest body and helmet the shelf sells cost at least closeness_bands.price_ladder
         times the cheapest piece that holds a third of them (Battle Brothers' own curve, kept)
     O1  ONE-SHOT FEAR IS REAL (370(2)): in every phase of every human faction the fight dresses, some kind's best blow takes half or
         more of an unarmoured man (closeness_bands.one_shot.health), and the same blow on a man in mail (one_shot.mail_body) takes under half: armour saves you
     B1  THE BANDS, ON THE LIVE FIGHT: per level, the routine job and the tough job, pooled over the Lone Wolf, a fresh company and his
         way (rare men in the cheapest kit) at the sample days (20 fights a cell, the bank's seeds): won, men struck down a fight, fights where nobody went under half, the
         share of enemy hits that took half a man, inside closeness_bands.levels
     B2  THE HARDEST START IS NOT HELL (351(c)): the hardest level's routine job in the first week is won at least
         closeness_bands.not_hell in 100 by every company, the Lone Wolf alone included
     B3  THE GATE BITES: the numbers as they stood before this round (banks/BOHEMIA_TUNING_THE_FIGHT_IS_CLOSE_BEFORE_11_3_26.json, the
         same tool and seeds) fail B1 on the easiest level (the walk he played) and the committed AFTER bank meets it
     B4  nothing threw
   node gates/the_fight_is_close_gate.js             FIGHT_CLOSE_N=<fights a cell> (20: the bank's own seeds, so the live fight must reproduce the committed after bank)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const N = +(process.env.FIGHT_CLOSE_N || 20);
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE FIGHT IS CLOSE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const PM = J('records/target/bb/party_math.json'), CB = (PM.closeness_bands || {}).value;
const A = J('records/target/bb/armor.json'), W = J('records/target/bb/weapons.json').rows, E = J('records/target/bb/enemies.json').rows;
const OURS = J('records/target/bb/ours.json'), NEWE = J('records/target/bb/bohemia_enemies.json');

/* ---- P1 / P2: the shelf ---- */
const weight = r => Math.abs(r.fatigue || 0);
function outProtects(q, r, slot) {
  if (!(q.durability >= r.durability && weight(q) <= weight(r))) return false;
  if (slot === 'shields') {
    const qm = q.melee_defense || 0, qr = q.ranged_defense || 0, rm = r.melee_defense || 0, rr = r.ranged_defense || 0;
    if (!(qm >= rm && qr >= rr)) return false;
    return q.durability > r.durability || weight(q) < weight(r) || qm > rm || qr > rr;
  }
  return q.durability > r.durability || weight(q) < weight(r);
}
function priceBreaks() {
  const out = [];
  ['body', 'head', 'shields'].forEach(slot => {
    const rows = (A[slot] || []).filter(r => r.value != null && r.durability != null);
    rows.forEach(r => { const q = rows.filter(x => x !== r && x.value < r.value && outProtects(x, r, slot)).sort((a, b) => a.value - b.value)[0];
      if (q) out.push(slot + ' ' + r.id + ' (' + r.durability + ', ' + r.value + ') costs more than ' + q.id + ' (' + q.durability + ', ' + q.value + ')'); });
  });
  return out;
}
function ladder(slot) {
  const rows = (A[slot] || []).filter(r => r.value != null && r.durability != null && !r.armory);
  const top = rows.slice().sort((a, b) => b.value - a.value)[0];
  const third = rows.filter(r => r.durability >= top.durability / 3).sort((a, b) => a.value - b.value)[0];
  return { top, third, x: top.value / Math.max(1, third.value) };
}

/* ---- O1: one-shot fear, the fight's own damage formula (hitDamage at the weapon's best roll) ---- */
const RULES = J('records/target/bb/rules.json'), RAR = RULES.damage.remaining_armor_reduction.value;
function blow(w, armour) {
  const base = w.damage_max, ig = Math.min(1, w.armor_ignore_pct / 100), armourHit = Math.min(armour, base * w.armor_damage_pct / 100);
  let hp = Math.max(0, base * ig - armour * RAR);
  if (armour - armourHit <= 0) hp += Math.max(0, base * (1 - ig) - armourHit);
  return hp;
}
function hitters(faction, phase) {
  const mix = (OURS.enemy_tiers.value.mix[faction] || NEWE.mix[faction] || {})[phase] || {};
  const rows = Object.keys(mix).filter(k => mix[k] > 0).map(k => E.filter(e => e.id === k)[0] || NEWE.rows.filter(e => e.id === k).map(o => Object.assign({}, E.filter(e => e.id === o.from)[0] || {}, { id: o.id, gear: o.gear || (E.filter(e => e.id === o.from)[0] || {}).gear }))[0]).filter(Boolean);
  let best = null;
  rows.forEach(r => (r.gear || []).forEach(g => { const w = W.filter(x => x.name === g)[0]; if (!w || !w.damage_max) return;
    const O = CB.one_shot, bare = blow(w, 0) / O.health, mail = blow(w, O.mail_body) / O.health;
    if (!best || bare > best.bare) best = { kind: r.id, weapon: w.name, bare, mail }; }));
  return best;
}

/* ---- B1 / B2: the live fight ---- */
function measure(args, tag) {
  const out = path.join(os.tmpdir(), 'fight_close_' + tag + '_' + process.pid + '.json');
  cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_difficulty_the_curve.js'), '--close', '--n', String(N), '--out', out].concat(args),
    { stdio: ['ignore', 'ignore', 'inherit'], timeout: 1800000 });
  const r = JSON.parse(fs.readFileSync(out, 'utf8')); try { fs.unlinkSync(out); } catch (_e) {}
  return r;
}
/* pooled over the cells of one level and one job (each cell weighed by its fights) */
function pool(cells, level, job, days) {
  const cs = cells.filter(c => c.level === level && c.job === job && (!days || days.indexOf(c.day) >= 0));
  const n = cs.reduce((t, c) => t + c.n, 0) || 1, w = f => cs.reduce((t, c) => t + c[f] * c.n, 0) / n;
  const hits = cs.reduce((t, c) => t + c.theirHitsPerFight * c.n, 0), big = cs.reduce((t, c) => t + c.bigHitShare / 100 * c.theirHitsPerFight * c.n, 0);
  return { n, won: Math.round(w('won')), struck: +w('struckPerFight').toFixed(2), clean: Math.round(w('nobodyHurt')), hp: Math.round(w('hpLeft')), big: Math.round(100 * big / Math.max(1, hits)) };
}
function inBand(p, b) {
  const why = [];
  if (b.won && (p.won < b.won[0] || p.won > b.won[1])) why.push('won ' + p.won + ' outside ' + b.won.join('-'));
  if (b.struck && (p.struck < b.struck[0] || p.struck > b.struck[1])) why.push('struck ' + p.struck + ' outside ' + b.struck.join('-'));
  if (b.clean_at_most != null && p.clean > b.clean_at_most) why.push('nobody under half in ' + p.clean + ' of 100 (at most ' + b.clean_at_most + ')');
  if (b.hp_at_most != null && p.hp > b.hp_at_most) why.push('health left ' + p.hp + '% (at most ' + b.hp_at_most + ')');
  if (b.big_at_least != null && p.big < b.big_at_least) why.push('big hits ' + p.big + '% (at least ' + b.big_at_least + ')');
  return why;
}
const say = p => 'won ' + p.won + ', struck ' + p.struck + ' a fight, nobody under half ' + p.clean + '/100, health left ' + p.hp + '%, big hits ' + p.big + '% (' + p.n + ' fights)';

(async () => {
  try {
    if (!CB) { ok('closeness_bands in records/target/bb/party_math.json', false, 'missing'); return done(); }
    const pb = priceBreaks();
    ok('P1 PRICE IS POWER: no piece on the shelf costs more than a piece of its slot that holds as much and weighs no more', pb.length === 0, pb.length + ' break it' + (pb.length ? ': ' + pb.slice(0, 4).join('; ') : ''));
    const lb = ladder('body'), lh = ladder('head');
    ok('P2 THE GOOD PIECE COSTS WHAT IT IS WORTH: the dearest body and helmet cost ' + CB.price_ladder + 'x or more the cheapest piece that holds a third of them',
      lb.x >= CB.price_ladder && lh.x >= CB.price_ladder,
      'body ' + lb.top.id + ' ' + lb.top.value + ' v ' + lb.third.id + ' ' + lb.third.value + ' (' + lb.x.toFixed(1) + 'x); head ' + lh.top.id + ' ' + lh.top.value + ' v ' + lh.third.id + ' ' + lh.third.value + ' (' + lh.x.toFixed(1) + 'x)');
    const bad = [], seen = [];
    CB.one_shot_factions.forEach(f => ['first', 'early', 'middle', 'late'].forEach(ph => {
      const h = hitters(f, ph); if (!h) { bad.push(f + '/' + ph + ' no weapon'); return; }
      seen.push(f + '/' + ph + ' ' + h.weapon + ' ' + Math.round(100 * h.bare) + '%>' + Math.round(100 * h.mail) + '%');
      if (h.bare < 0.5 || h.mail >= 0.5) bad.push(f + '/' + ph + ' ' + h.kind + ' ' + h.weapon + ' bare ' + Math.round(100 * h.bare) + '% mail ' + Math.round(100 * h.mail) + '%');
    }));
    ok('O1 ONE-SHOT FEAR: every phase of ' + CB.one_shot_factions.join(', ') + ' has a blow that takes half an unarmoured man, and mail holds it under half', bad.length === 0, bad.length ? bad.slice(0, 4).join('; ') : seen.slice(0, 6).join('; ') + '...');

    /* B3 first (static): the before bank fails, the after bank holds */
    const before = J('banks/BOHEMIA_TUNING_THE_FIGHT_IS_CLOSE_BEFORE_11_3_26.json'), after = J('banks/BOHEMIA_TUNING_THE_FIGHT_IS_CLOSE_AFTER_11_3_26.json');
    const bandsFail = (bank, days) => { const out = []; Object.keys(CB.levels).forEach(lv => ['routine', 'tough'].forEach(jb => {
      const p = pool(bank.cells, lv, jb, days), why = inBand(p, CB.levels[lv][jb]); if (why.length) out.push(lv + ' ' + jb + ': ' + why.join(', ')); })); return out; };
    const bNew = bandsFail({ cells: before.cells.filter(c => c.level === 'new') }, CB.sample_days).filter(x => /^new/.test(x)), aAll = bandsFail(after, CB.sample_days);
    ok('B3 THE GATE BITES: the numbers before this round fail the easiest level\'s bands (the walk he played); the committed after bank holds every band',
      bNew.length > 0 && aAll.length === 0, 'before: ' + (bNew.join('; ') || 'passes (the gate would not bite)') + ' | after: ' + (aAll.join('; ') || 'holds'));

    /* B1 / B2: live */
    const days = Array.from(new Set(CB.not_hell_days.concat(CB.sample_days))).sort((a, b) => a - b);
    const live = measure(['--days', days.join(','), '--companies', 'wolf,fresh,mine'], 'live');
    Object.keys(CB.levels).forEach(lv => ['routine', 'tough'].forEach(jb => {
      const p = pool(live.cells, lv, jb, CB.sample_days), why = inBand(p, CB.levels[lv][jb]);
      ok('B1 ' + lv.toUpperCase() + ' ' + jb.toUpperCase() + ' (' + CB.levels[lv][jb].say + ')', why.length === 0, say(p) + (why.length ? ' -- ' + why.join(', ') : ''));
    }));
    const early = { cells: live.cells.filter(c => CB.not_hell_days.indexOf(c.day) >= 0) };
    const hell = early.cells.filter(c => c.level === 'out' && c.job === 'routine' && c.won < CB.not_hell);
    ok('B2 THE HARDEST START IS NOT HELL: OUTLIVED IT\'s routine job, days ' + CB.not_hell_days.join(' and ') + ', won ' + CB.not_hell + ' in 100 or more by every company',
      hell.length === 0, early.cells.filter(c => c.level === 'out' && c.job === 'routine').map(c => c.key + ' d' + c.day + ' ' + c.won).join(', '));
    ok('B4 nothing threw', true);
  } catch (e) { ok('B4 nothing threw', false, String(e && e.stack || e).slice(0, 400)); }
  done();
})();
