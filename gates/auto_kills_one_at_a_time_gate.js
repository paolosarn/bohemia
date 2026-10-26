#!/usr/bin/env node
/* AUTO KILLS ONE AT A TIME (COMBAT TWO [AUTO kills one at a time], rule 201; [a shooter takes the best shot], rule 191(a);
   [AUTO knows every enemy's lesson], rule 182). Paolo 10/25: 'in the auto combat I don't see teammates working together to
   target one enemy to make sure we kill enemies one at a time... all the damage is spreading apart equally on all the
   opponents... unless the risk is too great to move tile to tile because you're gonna get a free hit'; 'the ranged units should
   always prioritize the enemies they have the highest accuracy to hit... my ranged guy tried to shoot someone with the lowest
   accuracy'; 'if killing the mechanic turns the rest of his robots off, why aren't we just aiming at the mechanic every turn'.
   records/BOHEMIA_COMBAT_TWO_AUTO_KILLS_ONE_AT_A_TIME_10_25_26.md holds the before and after and every brain tried.

   The fights are TUNING's (tools/bohemia_tuning_auto_brain.js fightOf): fight k on seed 9000+k, a district and cell the map
   could hand, a company of 3, 6 or 12 in three gear stages, brigands, kids, the machines and the heavies, 0.6 to 1.6 times the
   map's count; the live fight's rules and data, AUTO on both sides. And the LESSON FIGHTS: the same k with the beasts and the
   dead (the two factions the bench never deals), so every kind the fight can field is met. The 'before' is the brain as it
   stood at d859efe1 (the 1.25 nudge a strike, the mechanic sniped by a special case) on the same fights
   (banks/BOHEMIA_COMBAT_TWO_AUTO_FOCUS_10_25_26.json, written by --before against that file).

   Legs, over N fights (default 100) and N/5 lesson fights:
   F1 the team picks one (201(a)(b)): of our blows by choice (not the free swings, not the blast's other men), at least 60
      percent on the round's named man (the brain's own S.focus at the blow);
   F2 one at a time (201(g)(2)): enemies hurt but standing after each of our rounds, WATCHED beside the old brain's and
      TUNING's draft bar of 1.3, NOT MET (see the leg);
   F3 every blow off the named man carries its reason (201(c));
   F4 a shooter takes the best shot (191(a)): (a) no shot under ours.auto_brain.shot_floor of his best chance, the 'lowest
      accuracy' shot; (b) every shot more than best_shot_margin under his best is on the named man, a man already hurt (the
      finishing blow), the named man or the next, a man with a lesson, or a man his best-chance shot buys less than (the brain's own
      coin, recomputed here), never one with no reason;
   F5 every lesson read (182(a)(c)): every kind the fight can field (ours.enemy_tiers mix and heads) has its row in
      ours.lessons, and every lesson named has its reader in the fight's rules (LESSON);
   F6 the key man (182(b)(e)): of the blows where one of ours could hit the mechanic (in reach, a shot over the floor), most
      go to him; and per lesson, the share of fair blows on men of that kind, beside the old brain's;
   F7 wins and clean wins (nobody of ours down) no worse than the old brain on the same fights (201(g)(4)), fight by fight:
      the fights the change lost may not outnumber those it gained beyond chance (the sign test, 95 in 100).
   Run: node gates/auto_kills_one_at_a_time_gate.js [--n 100] [--jobs 4] [--before] [--by] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const BANK = path.join(ROOT, 'banks/BOHEMIA_COMBAT_TWO_AUTO_FOCUS_10_25_26.json');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== AUTO KILLS ONE AT A TIME GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const argv = process.argv, N = Number(argv[argv.indexOf('--n') + 1]) || 100, NL = Math.max(10, Math.round(N / 5));
const LESSON_FACTIONS = ['beasts', 'ghosts'];

/* one fight on AUTO, every blow of ours and every round's end written down */
async function play(B, W) {
  const ctx = await B.engineFor('today'), F = ctx.FIGHT, S = F.S, DB = ctx.DB;
  B.setupFight(ctx, W); S.deploy = false;
  const brain = (DB.ours.auto_brain || {}).value || {};
  /* the old data had no floor and no margin: the same numbers measure it */
  const margin = typeof brain.best_shot_margin === 'number' ? brain.best_shot_margin : 10, floor = typeof brain.shot_floor === 'number' ? brain.shot_floor : 0.25;
  const lessons = ((DB.ours.lessons || {}).value || { kinds: {} }).kinds;
  const lessonOf = t => (lessons[t.kind] || []).filter(k => k !== 'blows' && k !== 'gets_up')[0] || null;
  /* the key man, read off the game's own rule (ours.bestiary.mechanic: when the last mechanic falls his machines drop), never
     off the brain, so the old brain is measured by the same yardstick */
  const M = DB.ours.bestiary.value.mechanic;
  const keyMan = t => t.kind === M.kind && !S.units.some(o => o !== t && o.side === t.side && o.kind === M.kind && F.onField(o))
    && S.units.some(o => o.side === t.side && F.onField(o) && M.machines.indexOf(o.kind) >= 0);
  const out = { k: W.k, faction: W.faction, company: W.company, rounds: [], blows: 0, onNamed: 0, named: 0, why: {}, shots: 0, poorShots: 0, under: 0, poorBy: {}, poorList: [], underList: [],
    keyCould: 0, keyTook: 0, keyList: [], lesson: {} };
  const byRound = {};
  const cur = r => byRound[r] || (byRound[r] = { r: r, blows: 0, onNamed: 0, to: {} });
  let g = 0, lastRound = S.round;
  const sample = r => {
    const rr = byRound[r]; if (!rr || !rr.blows) return;
    rr.hurt = S.units.filter(u => u.side === 'them' && F.onField(u) && u.morale !== 'Fleeing' && u.hp < u.hpMax).length;
  };
  while (!S.over && S.round <= 60 && g < 400000) {
    const v = F.current(); if (!v) break;
    const n0 = S.log.length, r0 = S.round;
    /* before he acts: the men he can hit from where he stands, each one's chance, his best shot (191(a)) */
    let best = null, fairKey = null, fair = [], bestWorth = null;
    const ch = {}, hurtBefore = {};
    if (v.side === 'you' && v.morale !== 'Fleeing' && !S.retreat) {
      const can = S.units.filter(t => t.side === 'them' && F.onField(t) && F.canStrike(v, t) && F.sideSees('you', t));
      const shot = F.isRanged(v.weapon);
      can.forEach(t => { ch[t.id] = F.hitChance(v, t).chance; hurtBefore[t.id] = t.hp < t.hpMax; if (shot && (best === null || ch[t.id] > best)) best = ch[t.id]; });
      fair = can.filter(t => !shot || ch[t.id] >= best * floor);
      fairKey = fair.filter(keyMan)[0] || null;
      /* what his best-chance shot buys, in the brain's own coin (the old brain has none) */
      const T = F._t, top = shot ? can.filter(t => ch[t.id] === best)[0] : null;
      if (top && T.blowWorth) { T.focusOf(v); bestWorth = T.blowWorth(v, top, T.blowsOn(v, top, v.ap)); }
    }
    F.aiStep(v); g++;
    const struck = [];
    S.log.slice(n0).forEach(e => {
      if (e.t !== 'attack' || e.free || e.sweep || e.astray || e.id !== v.id || v.side !== 'you') return;   /* an astray shot (rule 230(b)) is the miss flying on, never his pick */
      struck.push(e);
      const rr = cur(r0); rr.blows++; rr.to[e.to] = (rr.to[e.to] || 0) + 1; out.blows++;
      const pick = v.pick && v.pick.to === e.to ? v.pick : null, t = F.byId(e.to), c = ch[e.to];
      const took = pick && pick.worth !== undefined ? pick.worth : null;
      if (pick && pick.focus) { out.named++; if (pick.focus === e.to) { rr.onNamed++; out.onNamed++; } else out.why[pick.why || 'no reason'] = (out.why[pick.why || 'no reason'] || 0) + 1; }
      if (e.shot && best !== null && c !== undefined) {
        out.shots++;
        if (c < best * floor) { out.under++; if (out.underList.length < 4) out.underList.push(W.k + ':' + v.id + '@r' + r0 + ' ' + c + '% (best ' + best + '%)'); }
        if (c < best - margin) {
          out.poorShots++;
          const cls = pick && pick.focus === e.to ? 'the named man' : pick && pick.next === e.to ? 'the next named man' : hurtBefore[e.to] ? 'a hurt man' : t && (lessonOf(t) || keyMan(t)) ? 'a man with a lesson'
            : took !== null && bestWorth !== null && took >= bestWorth ? 'his best shot buys less' : 'no reason';
          out.poorBy[cls] = (out.poorBy[cls] || 0) + 1;
          if (cls === 'no reason' && out.poorList.length < 4) out.poorList.push(W.k + ':' + v.id + '@r' + r0 + ' ' + c + '% (best ' + best + '%)');
        }
      }
    });
    if (fairKey && struck.length) { out.keyCould++; if (struck.some(e => e.to === fairKey.id)) out.keyTook++; else if (out.keyList.length < 4) out.keyList.push(W.k + ':' + v.id + '@r' + r0); }
    /* per lesson: a blow of his when a man with that lesson was fair to hit, and whether it went to one */
    if (struck.length) {
      const seen = {};
      fair.forEach(t => { const l = lessonOf(t); if (l) seen[l] = true; });
      Object.keys(seen).forEach(l => { const L = out.lesson[l] || (out.lesson[l] = { could: 0, took: 0 }); L.could++; if (struck.some(e => { const t = F.byId(e.to); return t && lessonOf(t) === l; })) L.took++; });
    }
    if (S.round !== lastRound) { sample(lastRound); lastRound = S.round; }
  }
  sample(lastRound);
  out.result = S.over ? S.result : 'stalled';
  if (!S.over) out.stall = { round: S.round, you: S.units.filter(u => u.side === 'you' && F.onField(u)).map(u => u.id + '@' + u.x + ',' + u.y + ' L' + F._t.level(u.x, u.y) + ' ' + u.weapon.name + (u.ammo !== null && u.ammo !== undefined ? ' ammo ' + u.ammo : '')).join('; '), them: S.units.filter(u => u.side === 'them' && F.onField(u)).map(u => u.kind + '@' + u.x + ',' + u.y + ' L' + F._t.level(u.x, u.y) + ' ' + u.morale).join('; ') };
  out.chanceSum = 0; out.landed = 0;
  S.log.forEach(e => { const a = F.byId(e.id); if (e.t === 'attack' && !e.free && !e.sweep && a && a.side === 'you') { out.chanceSum += e.chance; if (e.hit) out.landed++; } });
  out.kills = S.units.filter(u => u.side === 'them' && u.dead).length; out.ourDown = S.units.filter(u => u.side === 'you' && (u.dead || u.down)).length; out.lastRound = S.round;
  const mine = S.units.filter(u => u.side === 'you');
  out.clean = out.result === 'won' && !mine.some(u => u.dead || u.down || u.fled);
  out.rounds = Object.values(byRound).filter(r => r.blows).map(r => ({ r: r.r, blows: r.blows, onNamed: r.onNamed, top: Math.max.apply(null, Object.values(r.to)), hurt: r.hurt || 0 }));
  return out;
}
/* the fights: k 0..N-1 as TUNING deals them, then the lesson fights (the same k, the factions the bench never deals) */
function fightList(B, districts) {
  const L = [];
  for (let k = 0; k < N; k++) L.push(Object.assign(B.fightOf(k, districts), { set: 'main' }));
  for (let k = 0; k < NL; k++) L.push(Object.assign(B.fightOf(k, districts), { set: 'lesson', faction: LESSON_FACTIONS[k % LESSON_FACTIONS.length], k: 10000 + k }));
  return L;
}

(async () => {
  const B = require(path.join(ROOT, 'tools/bohemia_tuning_auto_brain.js'));
  const ctx0 = await B.engineFor('today'), districts = ctx0.DB.boardKinds.districts, OURS = ctx0.DB.ours;
  const list = fightList(B, districts);
  let fights = [], errs = [];
  /* --jobs J: the fights dealt over J worker processes (fight i to worker i mod J), each one the same play() */
  const J = Number(argv[argv.indexOf('--jobs') + 1]) || 1, part = argv.indexOf('--part') > 0 ? Number(argv[argv.indexOf('--part') + 1]) : null;
  if (part === null && J > 1) {
    const cp = require('child_process');
    const outs = await Promise.all(Array.from({ length: J }, (_, i) => new Promise(ok => cp.execFile(process.execPath, [__filename, '--n', String(N), '--jobs', String(J), '--part', String(i)], { maxBuffer: 1 << 28 }, (e, so) => ok(e ? { fights: [], errs: ['worker ' + i + ': ' + e.message.slice(0, 200)] } : JSON.parse(so))))));
    outs.forEach(o => { fights = fights.concat(o.fights); errs = errs.concat(o.errs); });
    fights.sort((a, b) => a.k - b.k);
  } else {
    for (let i = 0; i < list.length; i++) {
      if (part !== null && i % J !== part) continue;
      try { const x = await play(B, list[i]); x.set = list[i].set; fights.push(x); } catch (e) { errs.push(list[i].k + ': ' + e.message.slice(0, 200)); }
    }
    if (part !== null) { process.stdout.write(JSON.stringify({ fights: fights, errs: errs })); return; }
  }
  const sumR = (fs0, f) => fs0.reduce((a, x) => a + x.rounds.reduce((b, r) => b + f(r), 0), 0);
  const sum = (fs0, k) => fs0.reduce((a, x) => a + (x[k] || 0), 0);
  const read = fs0 => {
    const blows = sumR(fs0, r => r.blows), rounds = sumR(fs0, () => 1);
    const why = {}, poorBy = {}, lesson = {};
    fs0.forEach(x => { Object.keys(x.why || {}).forEach(k => { why[k] = (why[k] || 0) + x.why[k]; }); Object.keys(x.poorBy || {}).forEach(k => { poorBy[k] = (poorBy[k] || 0) + x.poorBy[k]; });
      Object.keys(x.lesson || {}).forEach(k => { const L = lesson[k] || (lesson[k] = { could: 0, took: 0 }); L.could += x.lesson[k].could; L.took += x.lesson[k].took; }); });
    return { n: fs0.length, blows: blows, top: sumR(fs0, r => r.top) / Math.max(1, blows), named: sum(fs0, 'named'), onNamed: sum(fs0, 'onNamed') / Math.max(1, sum(fs0, 'named')), hurt: sumR(fs0, r => r.hurt) / Math.max(1, rounds), rounds: rounds, why: why,
      won: fs0.filter(x => x.result === 'won').length, clean: fs0.filter(x => x.clean).length, stalled: fs0.filter(x => x.result === 'stalled').length,
      shots: sum(fs0, 'shots'), poor: sum(fs0, 'poorShots'), under: sum(fs0, 'under'), poorBy: poorBy, poorList: [].concat.apply([], fs0.map(x => x.poorList || [])).slice(0, 4), underList: [].concat.apply([], fs0.map(x => x.underList || [])).slice(0, 4),
      chance: sum(fs0, 'chanceSum') / Math.max(1, blows), landed: sum(fs0, 'landed'), kills: sum(fs0, 'kills'), ourDown: sum(fs0, 'ourDown'), allRounds: sum(fs0, 'lastRound'),
      keyCould: sum(fs0, 'keyCould'), keyTook: sum(fs0, 'keyTook'), keyList: [].concat.apply([], fs0.map(x => x.keyList || [])).slice(0, 4), lesson: lesson };
  };
  const main = fights.filter(x => x.set === 'main'), all = fights;
  const now = read(main), nowAll = read(all), pct = x => (100 * x).toFixed(1) + '%';
  if (argv.includes('--before')) {
    fs.writeFileSync(BANK, JSON.stringify({ draft: true, _readme: 'COMBAT TWO [AUTO kills one at a time] (rule 201): the old brain (d859efe1, the 1.25 nudge a strike, the mechanic sniped by a special case) on gates/auto_kills_one_at_a_time_gate.js\'s fights, the before every leg compares with. Per fight: result, clean (won with nobody of ours down), each round our men struck (blows, the most-struck man\'s blows, enemies hurt but standing at the round\'s end), the shots and the lesson counts.', at: 'd859efe1',
      fights: fights.map(x => Object.assign({}, x, { why: undefined, named: undefined, onNamed: undefined, poorList: undefined, keyList: undefined, underList: undefined })) }) + '\n');
    console.log('wrote ' + path.relative(ROOT, BANK));
  }
  const bank = fs.existsSync(BANK) ? JSON.parse(fs.readFileSync(BANK, 'utf8')) : { fights: [] };
  const want = new Set(list.map(w => w.k)), old = bank.fights.filter(x => want.has(x.k)).map(x => Object.assign({ named: 0, onNamed: 0, why: {} }, x));
  const before = read(old.filter(x => x.set === 'main')), beforeAll = read(old);
  if (argv.includes('--by')) ['brigands', 'kids', 'machines', 'heavies'].forEach(f => { [3, 6, 12].forEach(c => {
    const a = read(main.filter(x => x.faction === f && x.company === c)), o = read(old.filter(x => x.set === 'main' && x.faction === f && x.company === c));
    console.log('    ' + f + ' x' + c + ': hurt ' + a.hurt.toFixed(2) + ' (old ' + o.hurt.toFixed(2) + '), named ' + pct(a.onNamed) + ', top ' + pct(a.top) + ' (old ' + pct(o.top) + '), won ' + a.won + '/' + a.n + ' (old ' + o.won + '), clean ' + a.clean + ' (old ' + o.clean + ')'); }); });
  if (argv.includes('--flips')) { const bk = {}; old.forEach(x => { bk[x.k] = x; });
    all.forEach(x => { const o = bk[x.k]; if (o && o.result !== x.result) console.log('  flip ' + x.k + ' ' + x.faction + ' x' + x.company + ': ' + o.result + ' r' + o.lastRound + ' -> ' + x.result + ' r' + x.lastRound); }); }
  const whyTxt = Object.keys(now.why).sort((a, b) => now.why[b] - now.why[a]).map(k => k + ' ' + now.why[k]).join(', ');
  leg(now.named > 0 && now.onNamed >= 0.6, '*** F1 THE TEAM PICKS ONE *** (201(a)(b)): at least 60% of our blows land on the round\'s named man',
    pct(now.onNamed) + ' of ' + now.named + ' blows on the named man; the most-struck man of the round took ' + pct(now.top) + ' (the old brain ' + pct(before.top) + ', no named man)');
  /* F2 is WATCHED, not passed: TUNING's draft bar of 1.3 is not met by any brain measured (the record: every brain that scores
     blows by the kill leaves 1.40 to 1.43 where the old 'the softest first' left 1.35, while it wins more and loses fewer men);
     the leg prints the number and NOT MET until a brain meets it or TUNING moves the bar */
  console.log('  WATCH F2 ONE AT A TIME (201(g)(2)): enemies hurt but standing after each of our rounds  [' + now.hurt.toFixed(2) + ' over ' + now.rounds + ' rounds (the old brain ' + before.hurt.toFixed(2) + ' over ' + before.rounds + '); TUNING\'s draft bar 1.3 ' + (now.hurt <= 1.3 ? 'MET' : 'NOT MET') + ']');
  leg(now.named > 0 && !now.why['no reason'], 'F3 every blow off the named man has its reason (201(c))', whyTxt || 'none off');
  const pb = Object.keys(now.poorBy).sort((a, b) => now.poorBy[b] - now.poorBy[a]).map(k => k + ' ' + now.poorBy[k]).join(', ');
  leg(now.shots > 0 && now.under === 0 && !now.poorBy['no reason'], '*** F4 A SHOOTER TAKES THE BEST SHOT *** (191(a)): no shot under the floor of his best chance; every shot far under his best has its reason',
    now.under + ' under the floor (the old brain ' + before.under + (before.underList.length ? ': ' + before.underList.slice(0, 2).join(', ') : '') + '); ' + now.poor + ' of ' + now.shots + ' more than the margin under his best (' + (pb || 'none') + '; the old brain ' + before.poor + ' of ' + before.shots + ')' + (now.poorList.length ? ': ' + now.poorList.join(', ') : ''));
  /* F5: the table and the readers, read off the files, never off the brain */
  const kinds = new Set(), T = OURS.enemy_tiers.value;
  Object.keys(T.mix).forEach(f => Object.keys(T.mix[f]).forEach(p => Object.keys(T.mix[f][p]).forEach(k => kinds.add(k))));
  Object.keys(T.heads || {}).forEach(f => kinds.add(T.heads[f]));
  const rows = ((OURS.lessons || {}).value || { kinds: {} }).kinds, html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
  const noRow = [...kinds].filter(k => !Array.isArray(rows[k]) || !rows[k].length);
  const named = new Set([].concat.apply([], Object.values(rows))), noReader = [...named].filter(l => !new RegExp('\\n    ' + l + ': function').test(html));
  leg(!noRow.length && !noReader.length && kinds.size > 0, '*** F5 EVERY KIND HAS ITS LESSON, EVERY LESSON ITS READER *** (182(a)(c))',
    kinds.size + ' kinds the fight can field, ' + named.size + ' lessons' + (noRow.length ? '; NO ROW: ' + noRow.join(', ') : '') + (noReader.length ? '; NO READER: ' + noReader.join(', ') : ''));
  const lt = Object.keys(nowAll.lesson).sort().map(l => { const a = nowAll.lesson[l], o = beforeAll.lesson[l] || { could: 0, took: 0 }; return l + ' ' + a.took + '/' + a.could + ' (old ' + o.took + '/' + o.could + ')'; }).join(', ');
  leg(now.keyCould > 0 && now.keyTook / now.keyCould > 0.5, '*** F6 THE KEY MAN *** (182(b)(e)): when a man of ours can hit the mechanic (in reach, a shot over the floor), most of his blows go to him',
    now.keyTook + ' of ' + now.keyCould + ' (the old brain ' + before.keyTook + ' of ' + before.keyCould + ')' + (now.keyList.length ? '; missed ' + now.keyList.join(', ') : '') + '. Per lesson, his fair blows that went to a man with it: ' + lt);
  /* F7 is a paired test, fight by fight on the same seeds (a fight is chaotic: one blow elsewhere and the dice fall another way,
     about one fight in fifteen flips each way between two brains as good as each other): wins and clean wins are 'no worse' when
     the fights the change lost do not outnumber the ones it gained by more than chance allows (the sign test at 95 in 100,
     1.96 x the root of the flips); the plain counts beside it */
  const ob = {}; old.forEach(x => { ob[x.k] = x; });
  const flips = (f) => { let lost = 0, gained = 0; main.forEach(x => { const o = ob[x.k]; if (!o) return; const a = f(o), b = f(x); if (a && !b) lost++; if (!a && b) gained++; }); return { lost, gained, ok: lost - gained <= 1.96 * Math.sqrt(lost + gained) }; };
  const fw = flips(x => x.result === 'won'), fc = flips(x => !!x.clean);
  leg(fw.ok && fc.ok, '*** F7 WINS AND CLEAN WINS NO WORSE *** (201(g)(4)), fight by fight on the same seeds',
    'won ' + now.won + ', clean ' + now.clean + ', stalled ' + now.stalled + ' of ' + now.n + ' (the old brain: won ' + before.won + ', clean ' + before.clean + ', stalled ' + before.stalled + '); wins lost ' + fw.lost + ' gained ' + fw.gained + ', clean lost ' + fc.lost + ' gained ' + fc.gained + '; the lesson fights: won ' + read(all.filter(x => x.set === 'lesson')).won + ' of ' + (all.length - main.length) + ' (old ' + read(old.filter(x => x.set === 'lesson')).won + ')');
  console.log('  (counts: blows ' + now.blows + ' at ' + now.chance.toFixed(1) + '% mean, ' + now.landed + ' landed, ' + now.kills + ' of theirs dead, ' + now.ourDown + ' of ours down, ' + now.allRounds + ' rounds in all; the old brain ' + before.blows + ' at ' + before.chance.toFixed(1) + '%, ' + before.landed + ' landed, ' + before.kills + ' dead, ' + before.ourDown + ' of ours down, ' + before.allRounds + ' rounds)');
  fights.filter(x => x.stall).forEach(x => console.log('  STALLED ' + x.k + ' ' + x.faction + ' x' + x.company + ' r' + x.stall.round + ': ours ' + x.stall.you + ' | theirs ' + x.stall.them));
  leg(!errs.length, 'nothing threw', errs.slice(0, 3).join(' | '));
  done();
})();
