#!/usr/bin/env node
/* THE STAFF FIGHT TOO (STAFF, 11/21, VAMILY rule 468; Paolo 11/21: 'it's just a little too easy... maybe they are forced to being in combat,
   they're roaming around with you, and the game becomes more about protecting your staff... if your staff permanently dies you gotta get
   new people at different settlements... they're not gonna have the best traits... they try to run away way quicker... the better you want
   your camp to be, that means less people you can run around with, because there's a limit'). The design and its numbers:
   records/BOHEMIA_RESEARCH_THE_STAFF_FIGHT_TOO_11_21_26.md section C; the build: records/BOHEMIA_STAFF_THE_STAFF_FIGHT_TOO_11_21_26.md.
   On the live fight's own rules (tools/bohemia_fight_headless.js, the page's scripts unchanged) and the camp's own book (engine/bohemia_camp.js):
     S1  THE CAP: A NEW CREW with 14 fighters and 3 staff stands 9 fighters and 3 staff, 5 in the reserve, YOU standing; THE BLOCK WATCH 13 and 3
     S2  WHERE THEY STAND: at the bell every staff member is west of his back column, none in the front column, none beside a man of theirs
     S3  THEIR NERVE: every staff member starts Wavering and is never Confident; a staff death checks his fighters exactly when retinue.json's
         staff.shakes_fighters says so, and always the other staff
     S4  THEIR DEATH: 100 staff struck down, 100 dead; BohemiaCamp.lose takes him: has(id) false, the cook's food multiplier back to 1
     S5  THE PULL: in seeded AUTO fights against roaming crews with 3 staff, the share of their blows on staff is higher than with the pull set to 1
     S6  THE ENEMY DOES NOT GROW: the band for 7 fighters and 5 staff is the band for those 7 fighters alone
     S7  RE-HIRE: after the cook dies a town's hall deals a cook again within the measured town-weeks; a new face and name, never the dead one's;
         the dead face is in the camp's dead list and the post never deals it
     S8  THE COMPANY CAP: the hall's Hire and TAKE ON read the company with its camp against the origin's roster cap (the page's own code)
     S9  THE DATA: the engine's staff copy is the file's; ai.json's camp_pull factions are roster.json's families'; the five traits are the file's bad ones
     S10 IT GOT HARDER: a full company (12 fighters) against the same company with 5 staff (7 fighters): the win rate drops, staff die, the fight
         stays short (rounds); printed with the numbers
     S11 THE DOOR: the alpha's fight door hands opts.staff beside the company (never in it), none in the pit; the hand-back carries staff, never in crew
     S12 THEY FIGHT LIKE STAFF (rule 470(a)): their own brain against a fighter's on the same seeds: fewer turns ended beside one of theirs, circled
         or with one round their back, most turns behind the line, fewer blows on the camp; the ground read from ai.json staff_ground
   PLANTED FAILS: --plant patches the fight in memory: staff counted outside the cap (17 on the board) and staff rolling the 20% death: S1 and S4
   must go red, exit 1.
     node gates/the_staff_fight_too_gate.js           the gate
     node gates/the_staff_fight_too_gate.js --plant   the planted fight: S1 and S4 red
     node gates/the_staff_fight_too_gate.js --quick   S10 and S5 on fewer fights */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const PLANT = process.argv.includes('--plant'), QUICK = process.argv.includes('--quick');
let pass = 0, fail = 0;
const red = [];
const ok = (name, cond, why) => { if (cond) pass++; else { fail++; red.push(name.split(' ')[0]); } console.log((cond ? '  ok   ' : '  FAIL ') + name + (why ? '  [' + why + ']' : '')); };

const store = {};
global.window = { localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } } };
require(path.join(ROOT, 'engine/bohemia_people_mix.js'));
require(path.join(ROOT, 'engine/bohemia_names.js'));
const CAMP = require(path.join(ROOT, 'engine/bohemia_camp.js'));
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const patch = PLANT ? rules => rules
  .replace("const capN = Math.max(1, Math.min(fieldCap - staffIn.length, roster.length));", "const capN = Math.max(1, Math.min(fieldCap, roster.length));")
  .replace("else if (t.staff) { t.dead = true;", "else if (t.staff && rng() < 0.2) { t.dead = true;")
  .replace("if (t && t.staff) return 1;   /* __THE_STAFF_FIGHT_TOO__ (C7) */", "if (t && t.staff) return 0.2;") : null;
const ctx = engine(patch ? { patch } : {}), F = ctx.FIGHT;
const RET = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/retinue.json'), 'utf8'));
const AI = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ai.json'), 'utf8'));

function freshCamp(ids) { Object.keys(store).forEach(k => delete store[k]); ids.forEach(id => CAMP.hire(id)); return CAMP.staff(); }
function men(n, lv) { const o = []; for (let i = 0; i < n; i++) o.push({ background: 'daytaler', level: lv || 2 }); return o; }
function play(limit) { let g = 0; while (!F.S.over && g < (limit || 20000)) { const u = F.current(); if (!u) break; F.aiStep(u); g++; } return F.S; }
const mineOf = S => S.units.filter(u => u.side === 'you');

/* S1 THE CAP */
{
  const staff = freshCamp(['cook', 'scout', 'surgeon']);
  ctx.setSeed(11); F.setup({ auto: true, formation: null, company: [{ background: 'daytaler' }].concat(men(13)).map((m, i) => i === 0 ? Object.assign({}, m) : m), cap: 12, staff, party: { count: 8, faction: 'brigands', days: 4 } });
  let m = mineOf(F.S); const fighters = m.filter(u => !u.staff).length, st = m.filter(u => u.staff).length, main = m.some(u => u.main);
  ok('S1a A NEW CREW, 14 fighters and 3 staff: 9 fighters, 3 staff, 5 waiting, YOU standing', fighters === 9 && st === 3 && F.S.reserve.length === 5 && main,
    fighters + ' fighters, ' + st + ' staff, ' + F.S.reserve.length + ' in the reserve, YOU ' + (main ? 'stands' : 'missing'));
  ctx.setSeed(12); F.setup({ auto: true, formation: null, company: men(20), cap: 16, staff, party: { count: 8, faction: 'brigands', days: 4 } });
  m = mineOf(F.S);
  ok('S1b THE BLOCK WATCH (16), 20 fighters and 3 staff: 13 and 3', m.filter(u => !u.staff).length === 13 && m.filter(u => u.staff).length === 3,
    m.filter(u => !u.staff).length + ' and ' + m.filter(u => u.staff).length);
  ctx.setSeed(13); F.setup({ auto: true, formation: null, company: men(14), cap: 12, staff, party: { count: 8, faction: 'brigands', days: 4 }, arena: { id: 'pit' } });
  ok('S1c the pit: no staff', !mineOf(F.S).some(u => u.staff), mineOf(F.S).filter(u => u.staff).length + ' staff in the pit');
}

/* S2 WHERE THEY STAND, and S3's first half, over seeded boards */
{
  const staff = freshCamp(['cook', 'scout', 'surgeon', 'blacksmith', 'paymaster']);
  let n = 0, bad = 0, front = 0, beside = 0, wav = 0, why = '';
  for (let i = 0; i < 60; i++) {
    ctx.setSeed(200 + i);
    const fac = ['brigands', 'beasts', 'water', 'house', 'wolves'][i % 5];
    F.setup({ auto: true, formation: null, company: men(7 + (i % 5)), cap: 12, staff, party: { count: 8, faction: fac, days: 3 + i % 9 } });
    const S = F.S, back = S.cols[0] - 1;
    mineOf(S).filter(u => u.staff).forEach(u => { n++;
      if (!(u.x < back)) { bad++; why = why || ('seed ' + (200 + i) + ' ' + u.name + ' at ' + u.x + ' back col ' + back); }
      if (u.x === S.cols[0]) front++;
      if (S.units.some(t => t.side === 'them' && Math.max(Math.abs(t.x - u.x), Math.abs(t.y - u.y)) === 1)) beside++;
      if (u.morale === 'Wavering') wav++; });
  }
  ok('S2a every staff member at the bell west of his back column (' + n + ' over 60 boards)', n > 0 && bad === 0, why || (n + ' of ' + n));
  ok('S2b none in the front column, none beside a man of theirs', front === 0 && beside === 0, front + ' in front, ' + beside + ' beside them');
  ok('S3a every staff member starts Wavering', wav === n, wav + ' of ' + n);
}

/* S3 THEIR NERVE: never Confident over seeded fights; a staff death checks no fighter */
{
  const staff = freshCamp(['cook', 'scout', 'surgeon']);
  let conf = 0, fights = 0, stMorale = 0;
  for (let i = 0; i < (QUICK ? 40 : 100); i++) {
    ctx.setSeed(400 + i); fights++;
    F.setup({ auto: true, formation: null, company: men(8, 3), cap: 12, staff, party: { count: 9, faction: i % 2 ? 'brigands' : 'beasts', days: 6 } });
    play();
    const ids = new Set(F.S.units.filter(u => u.staff).map(u => u.id));
    F.S.log.forEach(e => { if (e.t === 'morale' && ids.has(e.id)) { stMorale++; if (e.to === 'Confident') conf++; } });
    F.S.units.forEach(u => { if (u.staff && u.morale === 'Confident') conf++; });
  }
  ok('S3b over ' + fights + ' fights no staff member is ever Confident', conf === 0, conf + ' times Confident, ' + stMorale + ' staff morale moves');
  /* one fall, read alone: the checks it sets off */
  ctx.setSeed(77); F.setup({ auto: true, formation: null, company: men(8), cap: 12, staff, party: { count: 6, faction: 'brigands', days: 4 } });
  const S = F.S, cook = S.units.filter(u => u.staff)[0];
  /* a passed check emits nothing, so every man of his is set to fail certain: a check that runs moves him a rung */
  S.units.filter(u => u.side === 'you').forEach(u => { u.resolve = -999; if (u.morale === 'Fleeing') u.morale = 'Steady'; });
  const others = S.units.filter(u => u.staff && u !== cook);
  F._t.fall(cook, null);
  const fightersMoved = S.units.filter(u => u.side === 'you' && !u.staff && u.morale !== 'Steady' && u.morale !== 'Confident').length;
  const SHAKE = !!RET.staff.value.shakes_fighters;   /* retinue.json staff.shakes_fighters: the Indebted's rule (no) or the camp's (yes) */
  ok('S3c a staff death checks his fighters exactly when the file says so (shakes_fighters ' + SHAKE + '; ' + S.units.filter(u => u.side === 'you' && !u.staff).length + ' fighters at a certain fail)', SHAKE ? fightersMoved > 0 : fightersMoved === 0, fightersMoved + ' fighters moved');
  ok('S3d a staff death checks the other staff', others.some(o => o.morale !== 'Wavering'), others.map(o => o.name + ' ' + o.morale).join(', '));
}

/* S4 THEIR DEATH */
{
  const staff = freshCamp(['cook', 'scout', 'surgeon', 'blacksmith', 'paymaster']);
  let dead = 0, n = 0;
  for (let i = 0; i < 20; i++) {
    ctx.setSeed(900 + i); F.setup({ auto: true, formation: null, company: men(6), cap: 12, staff, party: { count: 5, faction: 'brigands', days: 3 } });
    F.S.units.filter(u => u.staff).forEach(u => { n++; F._t.fall(u, null); if (u.dead) dead++; });
  }
  ok('S4a ' + n + ' staff struck down, ' + dead + ' dead', n === 100 && dead === 100, dead + ' of ' + n);
  const out = F.staffOut('won');
  ok('S4b the hand-back names them dead, in its own list', out.length === 5 && out.every(r => r.dead && r.id), JSON.stringify(out.map(r => r.id + ':' + r.dead)));
  freshCamp(['cook', 'scout']);
  const food0 = CAMP.mult('food');
  CAMP.lose('cook', 'dead', { day: 3 });
  ok('S4c the cook lost: has false, the food bill back to 1 (' + food0 + ' with her)', !CAMP.has('cook') && CAMP.mult('food') === 1 && food0 < 1, 'has ' + CAMP.has('cook') + ', food ' + CAMP.mult('food'));
  ok('S4d her face on the dead list for good', !!CAMP.deadLooks()[(RET.followers.value.filter(r => r.id === 'cook')[0] || {}).look], JSON.stringify(CAMP.deadLooks()));
}

/* S5 THE PULL */
{
  const staff = freshCamp(['cook', 'scout', 'surgeon']);
  const share = pull => {
    F.setPull(pull); let on = 0, all = 0;
    for (let i = 0; i < (QUICK ? 40 : 100); i++) {
      ctx.setSeed(3000 + i);
      F.setup({ auto: true, formation: null, company: men(8, 3), cap: 12, staff, party: { count: 9, faction: 'brigands', days: 8 } });
      play();
      const S = F.S, by = {}; S.units.forEach(u => { by[u.id] = u; });
      S.log.forEach(e => { if (e.t === 'attack' && by[e.id] && by[e.id].side === 'them' && by[e.to] && by[e.to].side === 'you') { all++; if (by[e.to].staff) on++; } });
    }
    F.setPull(null); return { on, all, share: all ? on / all : 0 };
  };
  const one = share(1), file = share(null);
  ok('S5 against roaming crews the share of their blows on his camp is higher with the file\'s pull than at 1', file.share > one.share,
    'pull 1: ' + (100 * one.share).toFixed(1) + '% of ' + one.all + ', the file\'s x' + AI.camp_pull.value.families.roaming_crews + ': ' + (100 * file.share).toFixed(1) + '% of ' + file.all);
}

/* S6 THE ENEMY DOES NOT GROW */
{
  const staff = freshCamp(['cook', 'scout', 'surgeon', 'blacksmith', 'paymaster']);
  ctx.setSeed(55); F.setup({ auto: true, formation: null, company: men(7), cap: 12, staff, raid: false });
  const a = F.S.units.filter(u => u.side === 'them').map(u => u.kind).join();
  ctx.setSeed(55); F.setup({ auto: true, formation: null, company: men(7), cap: 12, raid: false });
  const b = F.S.units.filter(u => u.side === 'them').map(u => u.kind).join();
  ok('S6 the band for 7 fighters and 5 staff is the band for 7 fighters', a === b && a.length > 0, a.split(',').length + ' against ' + b.split(',').length);
}

/* S7 RE-HIRE */
{
  freshCamp(['cook']);
  const dead = CAMP.lose('cook', 'dead', { day: 5 });
  let found = null;
  const towns = ['Network', 'Mob', 'Church', 'Trades', 'Caravans', 'Blues', 'Reds', 'Remnants'];
  for (let w = 1; w <= 12 && !found; w++) for (const t of towns) if (CAMP.inTown(t, w).indexOf('cook') >= 0) { found = { t, w }; break; }
  const p = CAMP.person('cook');
  ok('S7a after the cook dies a hall deals a cook again (' + (found ? found.t + ', week ' + found.w : 'never') + ')', !!found, found ? '' : 'twelve weeks, eight towns, no cook');
  ok('S7b a new person: a new face and name, never the dead one\'s', p && p.look && p.look !== dead.look && p.name !== dead.name && !p.own, dead.name + ' ' + dead.look + ' -> ' + (p && p.name) + ' ' + (p && p.look));
  CAMP.hire('cook');
  const s0 = CAMP.staff()[0];
  ok('S7c hired again, she is the new person in the fight (her own numbers)', s0 && s0.name === p.name && s0.look === p.look && s0.person === 1, JSON.stringify(s0 && { name: s0.name, look: s0.look, n: s0.person }));
  const SET = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');
  ok('S7d the post never deals his camp\'s faces or the dead\'s', /BohemiaCamp\.looks\(\), dl = BohemiaCamp\.deadLooks/.test(SET), 'recruitLooks reads the camp');
}

/* S8 THE COMPANY CAP (the page's own code) */
{
  const SET = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');
  const hire = SET.indexOf("c.appendChild(act('Hire'"), take = SET.indexOf('function retinueTake(');
  ok('S8a the hall\'s Hire refuses at the cap, the words why', hire > 0 && /var full1 = companyFull\(\); if\(full1\) return openB\('hall', staffWords\('full', full1\)\)/.test(SET.slice(hire, hire + 600)) && /bats\(\) < price \|\| !!companyFull\(\)\)\);/.test(SET));
  ok('S8b TAKE ON refuses at the cap', take > 0 && /var full0 = companyFull\(\); if\(full0\)/.test(SET.slice(take, take + 500)) && /bats\(\) < f\.price \|\| !!companyFull\(\)\);/.test(SET));
  ok('S8c the count is his fighters and his camp against the origin\'s roster cap', /return \{ fighters: n, staff: staff, all: n \+ staff, cap: \(pk && pk\.roster\) \|\| 20/.test(SET));
}

/* S9 THE DATA */
{
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_camp.js'), 'utf8'), m = src.match(/\/\* __STAFF_RULES__ \*\/ ([\s\S]*?) \/\* \/__STAFF_RULES__ \*\//);
  ok('S9a the engine\'s staff copy is the file\'s', !!m && JSON.stringify(JSON.parse(m[1])) === JSON.stringify(RET.staff.value), m ? '' : 'no copy');
  const R = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/roster.json'), 'utf8'));
  const fam = {}; R.families.forEach(f => { fam[f.family] = Array.from(new Set((f.in_the_fight || []).concat(f.bb_factions || []))).sort(); });
  const P = AI.camp_pull.value, same = Object.keys(P.families).every(k => JSON.stringify(P.factions[k]) === JSON.stringify(fam[k]));
  ok('S9b ai.json camp_pull\'s factions are roster.json\'s families\'', same, Object.keys(P.families).join(', '));
  const T = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/traits.json'), 'utf8')).traits;
  const bad = RET.staff.value.traits.every(id => { const r = T.filter(t => t.id === id)[0]; return r && r.at_the_post && r.effects.every(e => e.n < 0); });
  ok('S9c the staff\'s five traits are Battle Brothers\' bad ones a recruit can carry', bad && RET.staff.value.traits.length === 5, RET.staff.value.traits.join(', '));
}

/* S10 IT GOT HARDER */
{
  const staff5 = freshCamp(['cook', 'scout', 'surgeon', 'blacksmith', 'paymaster']);
  const N = QUICK ? 60 : 120, run = staff => {
    let won = 0, rounds = 0, dead = 0, n = 0, fell = 0;
    for (let i = 0; i < N; i++) {
      ctx.setSeed(5000 + i);
      F.setup({ auto: true, formation: null, company: men(12, 3), cap: 12, staff, party: { count: 12, faction: ['brigands', 'water', 'house', 'beasts'][i % 4], days: 10 } });
      const S = play();
      if (S.result === 'won') won++; rounds += S.round;
      S.units.forEach(u => { if (u.staff) { n++; if (u.dead) dead++; } else if (u.side === 'you' && (u.dead || u.down)) fell++; });
    }
    return { win: won / N, rounds: rounds / N, staffDead: n ? dead / n : 0, fell: fell / N };
  };
  const none = run([]), five = run(staff5);
  console.log('       12 fighters, no camp: won ' + (100 * none.win).toFixed(1) + '%, ' + none.rounds.toFixed(1) + ' rounds, ' + none.fell.toFixed(2) + ' fighters down a fight');
  console.log('       7 fighters + 5 staff: won ' + (100 * five.win).toFixed(1) + '%, ' + five.rounds.toFixed(1) + ' rounds, ' + five.fell.toFixed(2) + ' fighters down, ' + (100 * five.staffDead).toFixed(1) + '% of staff dead a fight');
  ok('S10a a full company with its camp wins less than without it (' + N + ' fights each)', five.win < none.win, (100 * none.win).toFixed(1) + '% -> ' + (100 * five.win).toFixed(1) + '%');
  ok('S10b his camp dies when it is not kept', five.staffDead > 0, (100 * five.staffDead).toFixed(1) + '% a fight');
  ok('S10c the fight stays short (rounds within one and a half times)', five.rounds <= none.rounds * 1.5, none.rounds.toFixed(1) + ' -> ' + five.rounds.toFixed(1));
}

/* S12 THEY FIGHT LIKE STAFF (rule 470(a), Paolo 11/22: 'They will stay behind. They will take defensive positions and they will attempt to not
   be flanked and circled.'): the same camp on the same seeds, once with its own brain (ai.json staff_ground) and once with a fighter's (the
   control: the staff's turn handed to the line's AUTO). At the end of every turn a camp person takes: one of theirs beside him, two or more
   (circled), one of theirs round his back (west of him, within three); behind the middle of his line; and their blows on the camp a fight */
{
  const staff = freshCamp(['cook', 'scout', 'surgeon']);
  const ctl = engine({ patch: rules => (patch ? patch(rules) : rules).replace('if (u.staff) return staffStep(u);', 'if (false) return staffStep(u);') });
  const d = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  const run = (C) => { const FF = C.FIGHT; let n = 0, beside = 0, circled = 0, behind = 0, line = 0, blows = 0, read = false;
    for (let i = 0; i < (QUICK ? 30 : 60); i++) {
      C.setSeed(12000 + i);
      FF.setup({ auto: true, formation: null, company: men(8, 3), cap: 12, staff, party: { count: 8, faction: ['brigands', 'water', 'house', 'beasts'][i % 4], days: 8 } });
      let g = 0; while (!FF.S.over && g < 20000) { const u = FF.current(); if (!u) break; FF.aiStep(u); g++;
        if (u.staff && FF.current() !== u && FF.onField(u) && u.morale !== 'Fleeing') {
          const S = FF.S, th = S.units.filter(v => v.side === 'them' && FF.onField(v) && v.morale !== 'Fleeing'), mine = S.units.filter(v => v.side === 'you' && !v.staff && FF.onField(v) && v.morale !== 'Fleeing');
          if (!th.length) continue; n++;
          const b = th.filter(t => d(t, u) === 1).length; if (b) beside++; if (b > 1) circled++; if (th.some(t => t.x < u.x && d(t, u) <= 3)) behind++;
          const xs = mine.map(m => m.x).sort((p, q) => p - q); if (xs.length && u.x < xs[Math.floor((xs.length - 1) / 2)]) line++; } }
      const by = {}; FF.S.units.forEach(v => { by[v.id] = v; }); FF.S.log.forEach(e => { if (e.t === 'attack' && by[e.to] && by[e.to].staff && by[e.id] && by[e.id].side === 'them') blows++; });
      read = read || !!C.DB.read['ai.staff_ground'];
    }
    return { n, beside: 100 * beside / n, circled: 100 * circled / n, behind: 100 * behind / n, line: 100 * line / n, blows: blows / (QUICK ? 30 : 60), read }; };
  const mine2 = run(ctx), asF = run(ctl), f1 = x => x.toFixed(1);
  console.log('       his camp\'s own way: ' + mine2.n + ' turns, beside one of theirs ' + f1(mine2.beside) + '%, circled ' + f1(mine2.circled) + '%, one round his back ' + f1(mine2.behind) + '%, behind the line ' + f1(mine2.line) + '%, ' + f1(mine2.blows) + ' blows on the camp a fight');
  console.log('       a fighter\'s way (the control): ' + asF.n + ' turns, beside ' + f1(asF.beside) + '%, circled ' + f1(asF.circled) + '%, round his back ' + f1(asF.behind) + '%, behind the line ' + f1(asF.line) + '%, ' + f1(asF.blows) + ' blows');
  ok('S12a they end fewer turns beside one of theirs and circled than a fighter would', mine2.beside < asF.beside && mine2.circled <= asF.circled, f1(mine2.beside) + '% / ' + f1(mine2.circled) + '% against ' + f1(asF.beside) + '% / ' + f1(asF.circled) + '%');
  ok('S12b they end fewer turns with one of theirs round their back', mine2.behind < asF.behind, f1(mine2.behind) + '% against ' + f1(asF.behind) + '%');
  ok('S12c they stay behind the line (most of their turns west of the middle of his fighters)', mine2.line >= 75 && mine2.line > asF.line, f1(mine2.line) + '% against ' + f1(asF.line) + '%');
  ok('S12d the camp takes fewer blows a fight', mine2.blows < asF.blows, f1(mine2.blows) + ' against ' + f1(asF.blows));
  ok('S12e their ground is the file\'s (ai.json staff_ground read)', mine2.read);
}

/* S11 THE DOOR */
{
  const A = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8'), FI = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
  ok('S11a the door hands opts.staff beside the company, none in the pit', /if\(!o\.arena && !window\.__STAFF_OFF\)\{ var BCs = nfCamp\(\); if\(BCs && BCs\.staff\)\{ var sf = BCs\.staff\(\); if\(sf && sf\.length\) o\.staff = sf; \} \}/.test(A));
  ok('S11b after the fight the dead and the taken leave the camp', /BCl\.lose\(r\.id, r\.dead \? 'dead' : 'taken'/.test(A));
  ok('S11c the hand-back: staff in their own list, never in crew', /staff: FIGHT\.staffOut\(result\)/.test(FI) && /crew: S\.units\.filter\(function \(v\) \{ return v\.side === 'you' && !v\.staff; \}\)/.test(FI));
  ok('S11d the camp is never his hand\'s', /function crewControlled\(u\) \{ return u && u\.side === 'you' && !u\.staff/.test(FI));
}

console.log('THE STAFF FIGHT TOO: ' + pass + ' passed, ' + fail + ' failed' + (PLANT ? ' (PLANTED: ' + red.join(' ') + ')' : ''));
if (PLANT) { const want = ['S1a', 'S4a'].every(k => red.indexOf(k) >= 0); console.log(want ? 'the plant went red where it must (S1a, S4a)' : 'THE PLANT DID NOT GO RED: ' + red.join(' ')); process.exit(want ? 1 : 2); }
process.exit(fail ? 1 : 0);
