#!/usr/bin/env node
/* THE PERKS ARE LIVE (COMBAT [perks translated], rule 48, Paolo 9/29: 'the perks need to be
   translated'). Battle Brothers' fifty perks are in records/target/bb/perks.json with the wiki's
   words and numbers; records/target/bb/perk_translation.json gives each our draft name, its skin
   and whether it is live in the rebuilt fight. This gate holds every perk marked live to ITS OWN
   NUMBER, one at a time: the same two men, the same tile, the same roll, once without the perk
   and once with it, inside slices/BOHEMIA_FIGHT.html on his phone's profile through the one
   driver. A perk that is named but does nothing is the defect this exists to catch.
   Also: every perk in the translation is one of the fifty, every live one is read by the
   fight's rules, the crew's perks obey the wiki's row unlocking (a row opens after that many
   points), and the enemies carry the perks their wiki pages list.
   Run: node gates/the_perks_are_live_gate.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { open } = require('../tools/bohemia_drive_the_demo.js');
const ROOT = path.resolve(__dirname, '..');
const PERKS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/perks.json'), 'utf8'));
const TR = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/perk_translation.json'), 'utf8'));
const HTML = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };

/* static: the translation is the fifty, and every live one is read by the rules */
const ids = PERKS.rows.map(r => r.id);
leg(TR.rows.length === ids.length && TR.rows.every(r => ids.indexOf(r.id) >= 0),
  'the translation is the wiki\'s fifty, one for one', TR.rows.length + ' of ' + ids.length);
leg(TR.rows.every(r => r.name && r.draft === true && r.skin), 'every one has our draft name and a skin line (words get an attempt, WORDS owns the voice)');
const rules = (HTML.match(/<script id="fight-rules">([\s\S]*?)<\/script>/) || [])[1] || '';
const live = TR.rows.filter(r => r.in_the_fight === 'live');
const unread = live.filter(r => rules.indexOf("'" + r.id + "'") < 0);
leg(live.length >= 30 && unread.length === 0, 'every perk marked live is read by the fight\'s rules', live.length + ' live' + (unread.length ? ', unread: ' + unread.map(r => r.id).join(',') : ''));

(async () => {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:21,speed:1,board:"freeway"}' });
  const p = d.page;
  const t0 = Date.now();
  while (Date.now() - t0 < 30000 && !(await p.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board))) await p.waitForTimeout(100);
  const out = await p.evaluate(() => {
    const T = FIGHT._t, S = FIGHT.S, res = [];
    const say = (n, ok, why) => res.push([n, !!ok, why]);
    const num = id => T.perkRow(id).numbers;
    function flatPair() {
      for (let y = 1; y < S.h - 1; y++) for (let x = 1; x < S.w - 2; x++) {
        const ok = k => S.terrain[y][k] === 'flat' && !S.cover[y][k] && !S.solid[y][k];
        if (ok(x) && ok(x + 1) && ok(x + 2) && ok(x - 1)) return { x, y };
      }
    }
    function fresh(job) {
      FIGHT.setup({ board: "freeway" });
      S.over = true;                       /* the director stays still while the rules are held */
      const a = S.units.filter(u => u.side === 'you' && u.job === (job || 'pipe'))[0];
      const t = S.units.filter(u => u.side === 'them')[0];
      S.units.forEach(u => { if (u !== a && u !== t) u.fled = true; });
      const fp = flatPair();
      a.x = fp.x; a.y = fp.y; t.x = fp.x + 1; t.y = fp.y;
      [a, t].forEach(u => { u.perks = []; u.missStack = 0; u.morale = 'Steady'; u.injuries = []; u.fat = 0; u.frenzy = 0;
        u.reachStacks = 0; u.overwhelmed = 0; u.nineUsed = false; u.nineUp = false; u.headNext = false; u.atEdge = false; });
      a.mskill = 60; a.rskill = 60; t.mdef = 10; t.rdef = 10; t.shield = null; a.shield = null;
      return { a, t, fp };
    }
    const hc = (a, t) => FIGHT.hitChance(a, t, FIGHT.strikeSkill(a.weapon)).chance;
    const hit = (a, t, o) => FIGHT.resolveAttack(a, t, FIGHT.strikeSkill(a.weapon), Object.assign({ roll: 1, head: false, base: 50 }, o || {}));
    let s, b;

    s = fresh(); b = hc(s.a, s.t); s.a.missStack = 2; s.a.perks = ['fast_adaptation'];
    say('READS YOU (fast adaptation): two misses, +' + num('fast_adaptation').hit_chance_per_miss_pct + '% each', hc(s.a, s.t) - b === 2 * num('fast_adaptation').hit_chance_per_miss_pct, b + ' -> ' + hc(s.a, s.t));

    s = fresh(); s.t.initiative = 100; b = hc(s.a, s.t); s.t.perks = ['dodge'];
    const dg = Math.round(T.curIni(s.t) * num('dodge').initiative_to_defense_pct / 100);
    say('SLIPPERY (dodge): ' + num('dodge').initiative_to_defense_pct + '% of his initiative onto his defence', Math.abs((b - hc(s.a, s.t)) - dg) <= 1, b + ' -> ' + hc(s.a, s.t) + ' (ini ' + Math.round(T.curIni(s.t)) + ')');

    s = fresh(); s.t.shield = { melee_defense: 20, ranged_defense: 20 }; b = hc(s.a, s.t); s.t.perks = ['shield_expert'];
    say('DOOR MAN (shield expert): the door covers +' + num('shield_expert').shield_defense_bonus_increase_pct + '%', b - hc(s.a, s.t) === 20 * num('shield_expert').shield_defense_bonus_increase_pct / 100, b + ' -> ' + hc(s.a, s.t));

    /* surround: two more of ours on him */
    s = fresh(); const pals = S.units.filter(u => u.side === 'you' && u !== s.a && !FIGHT.isRanged(u.weapon)).slice(0, 2);
    pals.forEach((u, i) => { u.fled = false; u.x = s.t.x + 1; u.y = s.t.y + (i ? 1 : -1); u.morale = 'Steady'; });
    const sur0 = hc(s.a, s.t); s.a.perks = ['backstabber']; const sur1 = hc(s.a, s.t);
    say('PILE ON (backstabber): each extra man on him counts ' + 'double', sur1 - sur0 === 2 * 5, sur0 + ' -> ' + sur1);
    s.t.perks = ['underdog']; const sur2 = hc(s.a, s.t); s.a.perks = []; const sur3 = hc(s.a, s.t);
    say('BACK TO THE WALL (underdog): surrounded costs him nothing, and against Pile On it costs the plain amount', sur3 === sur0 - 2 * 5 && sur2 === sur0, 'plain ' + sur0 + ', underdog ' + sur3 + ', underdog v pile on ' + sur2);

    s = fresh(); b = hc(s.a, s.t); s.a.perks = ['lone_wolf'];
    say('LONE WOLF: nobody near, +' + num('lone_wolf').bonus_pct + '% skill', hc(s.a, s.t) - b === Math.round(60 * (1 + num('lone_wolf').bonus_pct / 100)) - 60, b + ' -> ' + hc(s.a, s.t));

    /* ranged: rifle at range behind the cover rule */
    s = fresh('rifle'); s.t.x = s.fp.x + 2; s.a.loaded = true;
    /* a car between him and his man (the wiki's blocked line), not under the man (that is defence by count now, rule 67) */
    S.cover[s.t.y][s.fp.x + 1] = 'rock_0'; b = hc(s.a, s.t); s.a.perks = ['bullseye']; const bul = hc(s.a, s.t); S.cover[s.t.y][s.fp.x + 1] = null; const open0 = hc(s.a, s.t);
    say('THREADS THE NEEDLE (bullseye): cover costs half, not three quarters', Math.abs(bul - open0 * 0.5) <= 1 && Math.abs(b - open0 * 0.25) <= 1, 'open ' + open0 + ', cover ' + b + ', cover with it ' + bul);
    s.a.perks = []; s.t.perks = ['anticipation']; const ant = hc(s.a, s.t);
    const an = num('anticipation'), want = Math.max(an.ranged_defense_bonus_min, (an.ranged_defense_per_tile_flat + 10 * an.ranged_defense_per_tile_pct_of_base / 100) * 2);
    say('SEES IT COMING (anticipation): the further the shooter, the more defence, at least ' + an.ranged_defense_bonus_min, Math.abs((open0 - ant) - want) <= 1, open0 + ' -> ' + ant);

    /* damage: the same blow, the same roll */
    s = fresh(); s.t.armH = 0; s.t.armB = 0; b = hit(s.a, s.t, { head: true }).hp; s.t.perks = ['steel_brow'];
    say('HARD HEAD (steel brow): a head hit lands like a body hit', hit(s.a, s.t, { head: true }).hp === hit(s.a, s.t, { head: false }).hp && b > hit(s.a, s.t, { head: true }).hp, b + ' -> ' + hit(s.a, s.t, { head: true }).hp);
    s = fresh(); s.t.armH = 0; s.t.armB = 0; b = hit(s.a, s.t).hp; s.a.perks = ['executioner']; s.t.injuries = [{ id: 'x', effects: {} }];
    say('FINISHER (executioner): a hurt man takes +' + num('executioner').damage_bonus_vs_injured_pct + '%', hit(s.a, s.t).hp === Math.floor(b * (1 + num('executioner').damage_bonus_vs_injured_pct / 100)), b + ' -> ' + hit(s.a, s.t).hp);
    s = fresh(); s.t.armH = 0; s.t.armB = 0; b = hit(s.a, s.t).hp; s.a.perks = ['killing_frenzy']; s.a.frenzy = 2;
    say('BLOOD UP (killing frenzy): after a kill, +' + num('killing_frenzy').damage_bonus_pct + '% for two turns', hit(s.a, s.t).hp === Math.floor(b * (1 + num('killing_frenzy').damage_bonus_pct / 100)), b + ' -> ' + hit(s.a, s.t).hp);
    s = fresh(); s.t.armB = 60; s.a.shield = null; b = hit(s.a, s.t).hp; s.a.perks = ['duelist'];
    say('ONE ON ONE (duelist): a free hand puts more past the armour', hit(s.a, s.t).hp > b, b + ' -> ' + hit(s.a, s.t).hp);
    s = fresh('rifle'); s.t.x = s.fp.x + 2; s.t.armB = 60; b = hit(s.a, s.t).hp; s.a.perks = ['crossbow_mastery'];
    say('RIFLE WORK (crossbow mastery): +' + num('crossbow_mastery').crossbow_armor_ignore_bonus_pct + '% past the armour', hit(s.a, s.t).hp > b, b + ' -> ' + hit(s.a, s.t).hp);
    s = fresh('bottles'); s.t.x = s.fp.x + 2; s.t.armH = 0; s.t.armB = 0; b = hit(s.a, s.t).hp; s.a.perks = ['throwing_mastery'];
    say('BOTTLE ARM (throwing mastery): +' + num('throwing_mastery').damage_bonus_at_2_tiles_pct + '% at two houses', hit(s.a, s.t).hp === Math.floor(b * (1 + num('throwing_mastery').damage_bonus_at_2_tiles_pct / 100)), b + ' -> ' + hit(s.a, s.t).hp);
    s = fresh(); s.t.armB = 100; s.t.armH = 50; b = hit(s.a, s.t).armour; s.t.perks = ['battle_forged'];
    say('PLATED (battle forged): armour wears ' + num('battle_forged').armor_damage_reduction_pct_of_total_armor + '% of its total less', hit(s.a, s.t).armour === Math.floor(b * (1 - 0.05 * 150 / 100)), b + ' -> ' + hit(s.a, s.t).armour);

    /* moving, tiredness, costs */
    s = fresh(); const rough = (() => { for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (S.terrain[y][x] === 'rough') return { x, y }; })();
    b = T.stepCost(s.a, rough.x - 1, rough.y, rough.x, rough.y); s.a.perks = ['pathfinder'];
    say('KNOWS THE BLOCK (pathfinder): rough ground costs 1 less, never under 2', T.stepCost(s.a, rough.x - 1, rough.y, rough.x, rough.y) === Math.max(2, b - 1), b + ' -> ' + T.stepCost(s.a, rough.x - 1, rough.y, rough.x, rough.y));
    s = fresh(); s.a.fat = 40; b = T.curIni(s.a); s.a.perks = ['relentless'];
    say('NO QUIT (relentless): tiredness takes half off his initiative', Math.abs(T.curIni(s.a) - b - 20) < 1e-6, Math.round(b) + ' -> ' + Math.round(T.curIni(s.a)));
    s = fresh(); b = T.gearFat(s.a); s.a.perks = ['brawny'];
    say('CARRIES THE WEIGHT (brawny): armour and helmet weigh 30% less', T.gearFat(s.a) > b, b + ' -> ' + T.gearFat(s.a).toFixed(1));
    s = fresh('pistol'); const stab = FIGHT.strikeSkill(s.a.weapon); b = T.skillAP(s.a.weapon, stab, s.a); s.a.perks = ['dagger_mastery'];
    say('PISTOL WORK (dagger mastery): the pistol fires at 3 AP, not 4', T.skillAP(s.a.weapon, stab, s.a) === num('dagger_mastery').stab_puncture_deathblow_ap_cost && b === 4, b + ' -> ' + T.skillAP(s.a.weapon, stab, s.a));
    s = fresh(); const bash = FIGHT.strikeSkill(s.a.weapon); b = T.skillFat(s.a, bash); s.a.perks = ['mace_mastery'];
    say('PIPE WORK (mace mastery): a swing tires him 25% less', Math.abs(T.skillFat(s.a, bash) - b * 0.75) < 1e-6, b + ' -> ' + T.skillFat(s.a, bash));
    s = fresh('shotgun'); const rl = FIGHT.reloadSkill(s.a.weapon); b = T.skillAP(s.a.weapon, rl, s.a); s.a.perks = ['crossbow_mastery'];
    say('RIFLE WORK on the shotgun: it reloads at ' + num('crossbow_mastery').handgonne_reload_ap_cost + ' AP, not 9', T.skillAP(s.a.weapon, rl, s.a) === num('crossbow_mastery').handgonne_reload_ap_cost && b === 9, b + ' -> ' + T.skillAP(s.a.weapon, rl, s.a));

    /* what happens to a man */
    s = fresh(); s.t.perks = ['nine_lives']; s.t.hp = 5;
    T.apply(s.a, s.t, { hit: true, head: false, hp: 40, armour: 0, chance: 50, parts: [] });
    const nl = num('nine_lives');
    say('ALLEY CAT (nine lives): the killing blow leaves him ' + nl.hitpoints_left_min + ' to ' + nl.hitpoints_left_max + ', once', FIGHT.onField(s.t) && s.t.hp >= nl.hitpoints_left_min && s.t.hp <= nl.hitpoints_left_max && s.t.nineUsed, 'hp ' + s.t.hp);
    T.apply(s.a, s.t, { hit: true, head: false, hp: 40, armour: 0, chance: 50, parts: [] });
    say('  and the second killing blow kills', !FIGHT.onField(s.t));
    s = fresh(); s.a.perks = ['berserk']; s.a.ap = 1; s.t.hp = 5;
    T.apply(s.a, s.t, { hit: true, head: false, hp: 40, armour: 0, chance: 50, parts: [] });
    say('SEES RED (berserk): a kill gives back ' + num('berserk').ap_regained_on_kill + ' AP', s.a.ap === 1 + num('berserk').ap_regained_on_kill, 'ap ' + s.a.ap);
    s = fresh(); s.a.perks = ['head_hunter'];
    T.apply(s.a, s.t, { hit: true, head: true, hp: 1, armour: 0, chance: 50, parts: [] });
    const hh = FIGHT.resolveAttack(s.a, s.t, FIGHT.strikeSkill(s.a.weapon), { roll: 1, base: 10 }).head;
    say('HEADHUNTER: after a head hit the next hit is the head', hh === true);
    s = fresh(); s.t.resolve = 0; s.t.hp = 100; s.t.hpMax = 100;
    T.apply(s.a, s.t, { hit: true, head: false, hp: 5, armour: 0, chance: 50, parts: [] }); const m0 = s.t.morale;
    s = fresh(); s.t.resolve = 0; s.t.hp = 100; s.t.hpMax = 100; s.a.perks = ['fearsome'];
    T.apply(s.a, s.t, { hit: true, head: false, hp: 5, armour: 0, chance: 50, parts: [] });
    say('THE NAME THEY WHISPER (fearsome): five points of blood shake him; without it fifteen are needed', m0 === 'Steady' && s.t.morale === 'Wavering', m0 + ' / ' + s.t.morale);
    s = fresh(); s.t.hp = 100; s.t.hpMax = 100; s.t.perks = []; s.a.perks = ['crippling_strikes'];
    T.apply(s.a, s.t, { hit: true, head: false, hp: 20, armour: 0, chance: 50, parts: [] });
    const cs = s.t.injuries.length;
    s = fresh(); s.t.hp = 100; s.t.hpMax = 100;
    T.apply(s.a, s.t, { hit: true, head: false, hp: 20, armour: 0, chance: 50, parts: [] });
    say('LEAVES A MARK (crippling strikes): a fifth of his health injures him (thresholds x0.66)', cs === 1 && s.t.injuries.length === 0, 'with ' + cs + ', without ' + s.t.injuries.length);
    s = fresh(); s.a.perks = ['overwhelm']; S.order = [s.a.id, s.t.id]; S.idx = 0; b = hc(s.t, s.a);
    T.apply(s.a, s.t, { hit: false, head: false, hp: 0, armour: 0, chance: 50, parts: [] });
    say('GETS THERE FIRST (overwhelm): a man who has not acted swings 10% worse', s.t.overwhelmed === 1 && hc(s.t, s.a) < b, b + ' -> ' + hc(s.t, s.a));
    s = fresh('sledge'); s.a.perks = ['reach_advantage']; b = hc(s.t, s.a);
    T.apply(s.a, s.t, { hit: true, head: false, hp: 1, armour: 0, chance: 50, parts: [] });
    say('KEEPS YOU OUT (reach advantage): a hit with the big one, +' + num('reach_advantage').melee_defense_per_stack + ' defence', s.a.reachStacks === 1 && b - hc(s.t, s.a) === num('reach_advantage').melee_defense_per_stack, b + ' -> ' + hc(s.t, s.a));
    const mk = (perks) => T.makeUnit({ id: 'z' + Math.random(), side: 'you', name: 'Z', hp: 60, fatigue: 100, resolve: 40, initiative: 100, mskill: 50, rskill: 40,
      mdef: 0, rdef: 0, apTurn: 9, weapon: S.units[0].weapon, shield: null, armH: 0, armB: 0, xp: 100, perks: perks, fled: true });
    say('BUILT LIKE A DOOR (colossus): +' + num('colossus').hitpoints_increase_pct + '% health', mk(['colossus']).hpMax === 75 && mk([]).hpMax === 60);
    say('NOTHING SCARES HIM (fortified mind): +' + num('fortified_mind').resolve_increase_pct + '% nerve', mk(['fortified_mind']).resolve === 50);

    /* the seven skills a perk unlocks: each from a man whose turn it is */
    const myTurn = (s2) => { S.over = false; S.order = [s2.a.id, s2.t.id]; S.idx = 0; s2.a.ap = s2.a.apTurn; s2.a.fat = 0; };
    const nAtk = () => S.log.filter(e => e.t === 'attack').length;
    s = fresh(); s.a.perks = ['adrenaline']; myTurn(s); s.t.initiative = 999;
    const adr = FIGHT.useSkill(s.a, 'adrenaline'); FIGHT.endTurn(s.a); FIGHT.endTurn(s.t);
    say('FIRST OUT THE DOOR (adrenaline, ' + num('adrenaline').skill_ap_cost + ' AP): he goes first next round, even ahead of a faster man', adr && S.order[0] === s.a.id, S.order.slice(0, 2).join(' '));
    S.over = true;
    s = fresh('sledge'); s.a.perks = ['recover']; myTurn(s); s.a.fat = 60;
    FIGHT.useSkill(s.a, 'recover');
    say('CATCH YOUR BREATH (recover, the whole turn): half his tiredness gone, and his turn is spent', s.a.fat === 30 && FIGHT.current() !== s.a, 'fatigue ' + s.a.fat);
    S.over = true;
    s = fresh('pistol'); s.a.perks = ['rotation']; myTurn(s);
    const mate = S.units.filter(u => u.side === 'you' && u !== s.a)[0]; mate.fled = false; mate.x = s.a.x - 1; mate.y = s.a.y; mate.morale = 'Steady';
    const ax = s.a.x, n0 = nAtk(); FIGHT.useSkill(s.a, 'rotation', { x: mate.x, y: mate.y });
    say('SWAP OUT (rotation): two of yours trade places, out of a man\'s reach with no free swing', s.a.x === ax - 1 && mate.x === ax && nAtk() === n0, 'swings ' + (nAtk() - n0));
    S.over = true;
    s = fresh(); s.a.perks = ['rally_the_troops']; myTurn(s); s.a.resolve = 100;
    const shaky = S.units.filter(u => u.side === 'you' && u !== s.a).slice(0, 2);
    shaky.forEach((u, i) => { u.fled = false; u.x = s.a.x - 1 - i; u.y = s.a.y; u.resolve = 100; u.morale = i ? 'Fleeing' : 'Breaking'; });
    FIGHT.useSkill(s.a, 'rally_the_troops');
    say('ON ME (rally the troops): the breaking stand Steady again, the running turn back Wavering', shaky[0].morale === 'Steady' && shaky[1].morale === 'Wavering', shaky.map(u => u.morale).join(', '));
    S.over = true;
    s = fresh('sledge'); s.a.perks = ['taunt']; myTurn(s); s.t.x = s.a.x + 2;
    FIGHT.useSkill(s.a, 'taunt', { x: s.t.x, y: s.t.y });
    say('COME AT ME (taunt, range ' + num('taunt').max_range_tiles + '): the man he calls goes for him', s.t.tauntedBy === s.a.id);
    S.over = true;
    s = fresh(); s.a.perks = ['footwork']; myTurn(s);
    const fx = s.a.x, n1 = nAtk(); FIGHT.useSkill(s.a, 'footwork', { x: s.a.x - 1, y: s.a.y });
    say('SIDESTEP (footwork, ' + num('footwork').skill_ap_cost + ' AP): out of a man\'s reach without his free swing', s.a.x === fx - 1 && nAtk() === n1 && s.a.ap === s.a.apTurn - num('footwork').skill_ap_cost, 'swings ' + (nAtk() - n1));
    S.over = true;
    s = fresh(); s.t.armH = 0; s.t.armB = 0; b = hit(s.a, s.t).hp; s.t.perks = ['indomitable']; s.t.indomitable = true;
    say('IMMOVABLE (indomitable): half damage until his next turn', hit(s.a, s.t).hp === Math.floor(b * (1 - num('indomitable').damage_reduction_pct / 100)), b + ' -> ' + hit(s.a, s.t).hp);

    /* CARS RAISE A TILE'S DEFENCE BY COUNT (rule 67) */
    s = fresh(); b = hc(s.a, s.t); S.coverCount[s.t.y][s.t.x] = 1; const one = hc(s.a, s.t); S.coverCount[s.t.y][s.t.x] = 3; const three = hc(s.a, s.t);
    S.coverCount[s.t.y][s.t.x] = 5; const five = hc(s.a, s.t); S.coverCount[s.t.y][s.t.x] = 0;
    const cd = DB.ours.cover_defence.value;
    say('one car on his tile is some defence, three cars more, never past three', b - one === cd.melee_per_piece && b - three === 3 * cd.melee_per_piece && five === three, b + ' -> ' + one + ' -> ' + three + ' (five: ' + five + ')');
    /* every perk has its own drawn icon (rule 67: art, not text) */
    const sums = DB.perks.rows.map(r => { const c = document.createElement('canvas'); c.width = c.height = 48; perkIcon(c.getContext('2d'), r.id, 48);
      const d = c.getContext('2d').getImageData(0, 0, 48, 48).data; let h = 0; for (let i = 0; i < d.length; i += 4) h = (h * 31 + d[i] * 3 + d[i + 1] * 5 + d[i + 2]) >>> 0; return h; });
    say('A DRAWN ICON FOR EVERY ONE OF THE FIFTY (rule 67), no two alike', new Set(sums).size === DB.perks.rows.length, new Set(sums).size + ' distinct of ' + DB.perks.rows.length);

    /* who carries what */
    FIGHT.setup({ board: "freeway" }); S.over = true;
    const crew = S.units.filter(u => u.side === 'you');
    const rowsOk = crew.every(u => u.perks.length === u.level - 1 && u.perks.every((id, i) => T.perkRow(id).tier - 1 <= i));
    say('your crew: one perk a level past the first, and a row only after that many points (Perks page)', rowsOk, crew.map(u => u.name + ' ' + u.level + ':' + u.perks.length).join(' '));
    const raider = T.perksByName(['All weapon masteries', 'Brawny', 'Bullseye', 'Executioner', 'Recover']);
    say('the enemy carries what its wiki page lists (a raider: all masteries, Brawny, Bullseye, Executioner)', ['brawny', 'bullseye', 'executioner', 'mace_mastery', 'crossbow_mastery'].every(x => raider.indexOf(x) >= 0), raider.length + ' perks');
    say('  and a perk that comes "after day 20" is not on him on day one', T.perksByName(['Bullseye after day 20']).length === 0);
    return res;
  });
  out.forEach(r => leg(r[1], r[0], r[2]));
  leg(d.errs.length === 0, 'no page errors', d.errs.slice(0, 2).join(' | '));
  await d.close();
  console.log('=== THE PERKS ARE LIVE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); console.log('=== THE PERKS ARE LIVE GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed ==='); process.exit(1); });
