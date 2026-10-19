#!/usr/bin/env node
// TUNING [the first kit is guns] 10/19 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 120(a); rule 117).
// Reads banks/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.json (tools/bohemia_tuning_the_first_kit_is_guns.js) and writes:
//   records/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.md   the page COMBAT cites: the draft gun rows beside Battle Brothers'
//                                                               first bows and crossbows, every number marked easier or not,
//                                                               the small cells, the ammo per fight, what cannot be tested yet
//   slices/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.html  the VOTE page (rule 88: a page, no sheet)
// Every number is DRAFT: THE GEAR IS NOT IN (rule 117(e)), and nothing in the game reads either file.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const B = J('banks/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.json');
const C = B.cells, get = (k, c, e, kit, s) => C[[k, c, e, kit, s].join('|')] || null;
const KITS = ['today', 'jobs', 'bb', 'draft', 'eye', 'once', 'nobutt', 'allguns'];
const KNAME = { today: 'PIPES (today)', jobs: 'TODAY\'S GUN ROWS', bb: 'BATTLE BROTHERS\' FIRST BOWS', draft: 'THE DRAFT GUNS', eye: 'draft, guns by the eye', once: 'draft, one shot a turn', nobutt: 'draft, no butt', allguns: 'all guns, no line' };
const COMPANIES = [1, 3, 6], COUNTS = [2, 3, 6], KINDS = ['humans', 'direwolf'];
const WHO = { humans: 'brigands', direwolf: 'dire wolves' };
const card = B.card, row = id => card.rows.filter(r => r.id === id)[0];
const PAIRS = [['draft_pistol', 'short_bow', 'PISTOL'], ['draft_rifle', 'light_crossbow', 'RIFLE'], ['draft_shotgun', 'handgonne', 'SHOTGUN']];
const avg = arr => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;
const cellsOf = (kit, s, f) => { const out = []; KINDS.forEach(k => COMPANIES.forEach(c => COUNTS.forEach(e => { const x = get(k, c, e, kit, s); if (x && (!f || f(k, c, e))) out.push(x); }))); return out; };
const small = (k, c, e) => c >= 3;   /* the cells a company of three or six meets: the Lone Wolf is reported apart */

/* ---------- each felt number of a draft row against its Battle Brothers row: easier, the same, harder ---------- */
function verdicts(d, b) {
  const v = [];
  const cmp = (name, ours, theirs, better) => {
    if (ours === null || ours === undefined) { v.push({ name, ours: '-', theirs: theirs === null ? '-' : theirs, mark: theirs === null ? 'the same (neither)' : 'HARDER: it cannot' }); return; }
    if (theirs === null || theirs === undefined) { v.push({ name, ours, theirs: '-', mark: 'EASIER (Battle Brothers cannot)' }); return; }
    const sgn = better === 'high' ? Math.sign(ours - theirs) : Math.sign(theirs - ours);
    v.push({ name, ours, theirs, mark: sgn > 0 ? 'EASIER' : sgn === 0 ? 'the same' : 'HARDER' });
  };
  ['average', 'born'].forEach(sh => [1, 2, 3, 4, 6].forEach(t => {
    const i = t - 1;
    cmp('hit at ' + t + ' tile' + (t > 1 ? 's' : '') + ' (' + (sh === 'average' ? 'average man' : 'born shooter') + ', a thug)', d.hit[sh + '|thug'][i], b.hit[sh + '|thug'][i], 'high');
  }));
  cmp('shots a turn', d.shots_a_turn, b.shots_a_turn, 'high');
  ['none', 'light', 'heavy'].forEach(a => cmp('hitpoints a hit, ' + a + ' armour', d.dmg[a].hp, b.dmg[a].hp, 'high'));
  ['none', 'light', 'heavy'].forEach(a => cmp('hits to drop a thug, ' + a + ' armour', d.to_drop[a], b.to_drop[a], 'low'));
  cmp('buttons to fire (a shot, a reload)', d.reload_ap ? 2 : 1, b.reload_ap ? 2 : 1, 'low');
  return v;
}
const VER = PAIRS.map(p => ({ gun: p[2], d: row(p[0]), b: row(p[1]), v: verdicts(row(p[0]), row(p[1])) }));
const harder = [].concat.apply([], VER.map(x => x.v.filter(y => /^HARDER/.test(y.mark)).map(y => x.gun + ': ' + y.name + ' (' + y.ours + ' against ' + y.theirs + ')')));

/* ---------- the ammo per fight: what a gunman fires, routine and tough ---------- */
function shots(kit, s, f) {
  const xs = cellsOf(kit, s, f).filter(x => x.shots_a_gunman_fires_a_fight);
  if (!xs.length) return null;
  return { mean: Math.round(10 * xs.reduce((a, x) => a + x.shots_a_gunman_fires_a_fight.mean, 0) / xs.length) / 10,
    p90: Math.max.apply(null, xs.map(x => x.shots_a_gunman_fires_a_fight.p90)), max: Math.max.apply(null, xs.map(x => x.shots_a_gunman_fires_a_fight.max)),
    dry: Object.keys(xs[0].dry_in_100_at_a_load_of).reduce((o, n) => { o[n] = avg(xs.map(x => x.dry_in_100_at_a_load_of[n])); return o; }, {}),
    dryWorst: Object.keys(xs[0].dry_in_100_at_a_load_of).reduce((o, n) => { o[n] = Math.max.apply(null, xs.map(x => x.dry_in_100_at_a_load_of[n])); return o; }, {}) };
}
const routine = (k, c, e) => c >= 3 && e <= c;     /* the fight he should win: no more of them than of you */
const tough = (k, c, e) => c >= 3 && e > c;
const AMMO = { routine: shots('draft', 'start', routine), tough: shots('draft', 'start', tough), all: shots('draft', 'start', small) };
const LOADS = Object.keys(AMMO.routine.dry).map(Number);
const pickLoad = LOADS.filter(n => AMMO.routine.dryWorst[n] <= 10)[0] || LOADS[LOADS.length - 1];

/* ---------- the cells named in the text (never one average, rule 117(e)) ---------- */
const w33 = k => (get('humans', 3, 3, k, 'start') || {}).won_in_100, w66 = k => (get('humans', 6, 6, k, 'start') || {}).won_in_100;
const lone = (kit, s, e) => { const x = get('humans', 1, e, kit, s); return x ? x.won_in_100 : null; };
const ORIG = J('records/target/bb/origins.json').origins, CREW = J('records/target/bb/ours.json').crew.value;
const jobOf = i => CREW[i % CREW.length].jobs.filter(j => j !== 'car_door')[0];
const noGun = ORIG.filter(o => !o.men.some((m, i) => ['rifle', 'shotgun', 'bottles'].indexOf(jobOf(i)) >= 0));

/* ---------- the record ---------- */
const md = [];
const P = s => md.push(s);
P('# TUNING [the first kit is guns]: the starting guns\' numbers, easier than Battle Brothers\' first bows and crossbows (10/19)');
P('');
P('RESEARCH ONLY (rule 38g). DRAFT: THE GEAR IS NOT IN (rule 117(e)). Nothing in the game reads this page or its bank. Handed to COMBAT [guns from the first fight].');
P('');
P('## Why');
P('');
P('Paolo 10/18 (rule 120(a)): "I wanna start off with the guns too... the guns were supposed to be the main way this is gonna be solved", and "so fucking hard" (rule 117: easier than Battle Brothers). '
  + 'The row: the starting guns\' numbers (hit chance at one, two and three tiles, damage against no armour, light and heavy, ammo per fight), easier than Battle Brothers\' first crossbows and bows, across the grid\'s small cells, beside Battle Brothers\' own. '
  + '(records/BOHEMIA_PAOLO_THE_COMBAT_IS_STILL_ASS_GUNS_FIRST_THE_AURA_AND_THE_FACE_IS_THE_BODYS_10_18_26.md)');
P('');
P('## The finding that proves us wrong (two of them)');
P('');
P('1. **' + noGun.length + ' OF ' + ORIG.length + ' ORIGINS WALK INTO THEIR FIRST FIGHT WITH NO GUN THAT FIRES.** The map hands the fight each man\'s background and level and nothing else (slices/BOHEMIA_DEMO.html picks(): company = men.map(background, level)); '
  + 'the fight then dresses him by his PLACE IN THE LINE (ours.crew): the first six places are pipe, pipe, sledge, pipe, pistol, sledge, and the pistol rides the Dagger (a one-tile stab). The first gun that fires is the SEVENTH man (the rifle). '
  + 'Only THE BLOCK WATCH (12 men) fields one. THE HUNTERS start with two pipes and a sledge. And in THE CREW THAT IS LEFT, A NEW CREW and UP FROM HENDERSON the third man is Battle Brothers\' own RANGED companion (ranged skill 48 to 52, the best eye of the three), and his place in the line hands him a SLEDGE. '
  + 'This is why he has never started with guns, whatever any row said.');
P('2. **HANDING OUT GUNS ON TODAY\'S ROWS MAKES THE FIRST FIGHT HARDER, NOT EASIER.** Three of yours against three brigands (' + B.fights_per_cell + ' fights, our start): the pipes win ' + w33('today') + ' in 100; '
  + 'the same men holding today\'s gun rows (the Light Crossbow, the Dagger, the Handgonne) win ' + w33('jobs') + '; holding Battle Brothers\' first bows and crossbows ' + w33('bb') + '. Six against six: ' + w66('today') + ', ' + w66('jobs') + ', ' + w66('bb') + '. '
  + 'Three reasons, all Battle Brothers\' own rules: a crossbow fires once a turn and a Handgonne once every other turn (the reload), where a pipe swings twice; a gun holds no ring (rule 103), so the one man on the line is swarmed; '
  + 'and a gun cannot fire at a man beside him (rule 83), so a shooter reached is a man with nothing to do (' + (get('humans', 3, 3, 'nobutt', 'start') || {}).gun_turns_with_a_foe_beside_him_in_100 + ' in 100 of a gunman\'s turns start with a foe beside him, 3 v 3). Battle Brothers makes bows a support weapon on purpose. '
  + 'A gun start built on its rows is the first fight he already hates, harder.');
P('');
P('## Both angles');
P('');
P('- **THE BEST GAME (Battle Brothers, the wiki rows in records/target/bb/weapons.json and rules.json):** hit chance = ranged skill minus ranged defence, plus the skill\'s base, plus a fixed amount per tile past the first (Hit Chance page: "At distance = 1 (adjacent), hit chance is unmodified"); '
  + 'Quick Shot (bows) +0 and -4 a tile, 4 AP; Aimed Shot +10 and -2, 7 AP; Shoot Bolt (crossbows) +15 and -3, 3 AP then Reload 4 AP; Fire Handgonne +10 and -10, 3 AP then Reload 9 AP (a whole turn); throwing +20 and -10 a tile past two, 5 uses. '
  + 'A man caught in melee with a bow swaps to a sidearm from his bag. Ammunition is a STOCK, not a price: a quiver holds 10, refilled after the battle from the company\'s points (records/BOHEMIA_TUNING_AMMO_A_BULLET_COSTS_ONE_AND_BB_MAKES_IT_A_STOCK_NOT_A_PRICE_10_10_26.md).');
P('- **THE REAL WORLD:** the RAND Corporation\'s study of New York police shootings, 1998 to 2006 (Rostker et al., 2008): officers hit 18 shots in 100 in gunfights where the other man fired back, 30 in 100 when he did not, 37 in 100 at seven yards or closer and 23 past it. '
  + 'A combat tile is a house (rule 21, 9/4); a house is roughly 10 to 15 m across (draft, no law gives the metre), so two tiles is about 25 m and three about 40 m, three to five times the police\'s close range. '
  + 'At two houses a real pistol under fire lands about 20 in 100; a rifle is flat out to hundreds of metres; buckshot opens about an inch a yard, a man-sized circle at two houses and wider than a man at three. '
  + 'THE SHAPE is real (pistol short and steep, rifle long and flat, shotgun close and brutal, buckshot weak on plate); THE NUMBERS are not: real pistol accuracy at two houses would be a fifth of Battle Brothers\' bow. That trade is his and he made it (rule 117(d)).');
P('');
P('## THE DRAFT GUN ROWS (for COMBAT; DRAFT; in memory only)');
P('');
P('| | PISTOL | RIFLE | SHOTGUN |');
P('|---|---|---|---|');
const D = B.draft_rows;
P('| reach (tiles) | ' + ['pistol', 'rifle', 'shotgun'].map(k => D[k].range_min + ' to ' + D[k].range_max).join(' | ') + ' |');
P('| AP a shot (of 9) / shots a turn | ' + ['pistol', 'rifle', 'shotgun'].map(k => D[k].skills[0].ap + ' / ' + Math.floor(9 / D[k].skills[0].ap)).join(' | ') + ' |');
P('| reload button | none: the reload is inside the shot | none | none |');
P('| hit: base, per tile past the first | ' + ['pistol', 'rifle', 'shotgun'].map(k => '+' + D[k].base_bonus + ', ' + D[k].per_tile).join(' | ') + ' |');
P('| damage, to armour, past armour | ' + ['pistol', 'rifle', 'shotgun'].map(k => D[k].damage_min + '-' + D[k].damage_max + ', ' + D[k].armor_damage_pct + '%, ' + D[k].armor_ignore_pct + '%').join(' | ') + ' |');
P('| the line of fire | ' + ['pistol', 'rifle', 'shotgun'].map(k => D[k].ignores_line_of_fire ? 'ignored (the spread)' : 'Battle Brothers\' (-75% through a man or a car)').join(' | ') + ' |');
P('| at one tile | the butt: Battle Brothers\' Wooden Stick (15-25, his melee skill) | the same | the same |');
P('| beside (Battle Brothers) | Short Bow | Light Crossbow | Handgonne |');
P('| why | ' + ['pistol', 'rifle', 'shotgun'].map(k => D[k].why).join(' | ') + ' |');
P('');
P('THE REACH AND THE BUTT ARE HIS: rule 83 (Paolo 10/10): "melee weapons work on one tile away, all guns 2+ minimum... the pistol is a two-tile gun, or a club at one." The draft gives all three guns the club at one. '
  + 'The 9/22 page\'s reaches ("pistol reaches 1, rifle 2, scope 3", laws/BOHEMIA_ADDENDUM_THE_FIGHT_IS_BATTLE_BROTHERS_QUICKER_9_22_26.md) read as maxima collide with rule 83\'s floor (a pistol could never fire, a rifle only at exactly two); newest date wins, so the draft takes rule 83 as the floor and keeps Battle Brothers\' maxima (the crossbow\'s 6 for the rifle) and the handgun\'s real shortness (3). The scope has no row yet.');
P('');
P('Class "firearm" for all three: a gun holds no ring (rule 103), its damage pierces. The rows carry their own distance numbers (per_tile, base_bonus); the live fight cannot read them today (hitChance() takes a ranged weapon\'s distance numbers from its CLASS and ignores the row\'s skill), so the bench splices one line in its memory copy: '
  + '`' + B.splice + '`. That line is part of what COMBAT gets: a gun\'s numbers belong on its row, where MODS can edit them (rule 22).');
P('');
P('## THE CARD: each gun beside Battle Brothers\' first bow or crossbow, every felt number marked');
P('');
P('Computed by the live fight\'s own hitChance() and resolveAttack() on a flat lit board, every damage value and both hit spots walked (25 in 100 head, 1.5 times), so exact, not sampled; hits to drop a 55-hitpoint thug sampled 2,000 times with the armour wearing down. '
  + 'The average starting man: ranged skill ' + card.average_ranged_skill + ' (the middle of every first man of the fifteen origins). The born shooter: 55.5 (the Hunter). Battle Brothers\' Veteran, no lever; our start adds 5 to your roll and takes 5 from theirs.');
P('');
VER.forEach(x => {
  P('### ' + x.gun + ' (draft) beside ' + x.b.name);
  P('');
  P('| felt number | ' + x.gun + ' | ' + x.b.name + ' | |');
  P('|---|---|---|---|');
  x.v.forEach(y => P('| ' + y.name + ' | ' + y.ours + ' | ' + y.theirs + ' | ' + y.mark + ' |'));
  P('');
});
P('Against a raider (defence 5) and a dire wolf (defence 10, its hide 30 and 30) every hit chance above is 5 and 10 lower for both columns alike; the full lines are in the bank (card.rows[].hit).');
P('');
P(harder.length ? '**HARDER THAN BATTLE BROTHERS, NAMED (rule 117(d): a design page that sets a number harder without his word is a NO):** ' + harder.join('; ') + '. All four are one thing, the handgun\'s real shortness (3 houses, about 40 m); at every distance the pistol can fire, it is easier.'
  : '**No felt number of the three draft guns is harder than its Battle Brothers row.**');
P('');
P('Also on the card (Battle Brothers\' melee, for scale): the Bludgeon (our pipe) lands ' + row('bludgeon').hit['average|thug'][0] + ' in 100 at one tile for a man of melee skill 55 and does ' + row('bludgeon').dmg.none.hp + ' a hit to a bare man, twice a turn: '
  + 'the draft rifle, twice a turn at ' + row('draft_rifle').hit['average|thug'][1] + ' and ' + row('draft_rifle').dmg.none.hp + ', out-hits it from two houses away. That is the whole point of rule 120(a): the gun beats the pipe.');
P('');
P('## THE SMALL CELLS: who wins (won in 100, our start; Battle Brothers\' Veteran in brackets)');
P('');
P('The live fight, AUTO on both sides, ' + B.fights_per_cell + ' seeded fights a cell (fight k plays seed 9000+k in every kit and setting). Early stage (day 1), the brigands dressed by the fight\'s own early tier. The company is the origins\' own men (1 = THE LONE WOLF\'s hedge knight, 3 = A NEW CREW, 6 = the line\'s first six). '
  + 'THE SLOTS: three men = the main man on the line (pipe and car door, the only ring) + a rifle + a pistol (COMBAT\'s row: "a pistol and a rifle at the least"); six = two on the line + two rifles + a pistol + a shotgun; one = a rifle.');
P('');
KINDS.forEach(k => {
  P('### Against ' + WHO[k]);
  P('');
  P('| yours v theirs | ' + KITS.map(x => KNAME[x]).join(' | ') + ' |');
  P('|---|' + KITS.map(() => '---').join('|') + '|');
  COMPANIES.forEach(c => COUNTS.forEach(e => P('| ' + c + ' v ' + e + ' | ' + KITS.map(kit => { const a = get(k, c, e, kit, 'start'), b = get(k, c, e, kit, 'bb'); return a ? a.won_in_100 + ' (' + (b ? b.won_in_100 : '-') + ')' : '-'; }).join(' | ') + ' |')));
  P('');
});
P('### What each lever is worth, cell by cell (our start; never one average, rule 117(e))');
P('');
P('THE FIGHTS HE SHOULD WIN (no more of them than of you, and the two of wolves): won in 100 / your men struck down a fight / guns\' share of the killing in 100 / minutes on AUTO.');
P('');
const RC = [['humans', 3, 2], ['humans', 3, 3], ['humans', 6, 2], ['humans', 6, 3], ['humans', 6, 6], ['direwolf', 3, 2], ['direwolf', 6, 2], ['direwolf', 6, 3]];
P('| kit | ' + RC.map(r => r[1] + ' v ' + r[2] + ' ' + (r[0] === 'humans' ? 'people' : 'wolves')).join(' | ') + ' |');
P('|---|' + RC.map(() => '---').join('|') + '|');
KITS.forEach(k => P('| ' + KNAME[k] + ' | ' + RC.map(r => { const x = get(r[0], r[1], r[2], k, 'start'); return x ? x.won_in_100 + ' / ' + x.your_men_struck_down_per_fight + ' / ' + (x.guns_share_of_the_killing_in_100 === null ? '-' : x.guns_share_of_the_killing_in_100) + ' / ' + x.minutes_on_auto : '-'; }).join(' | ') + ' |'));
P('');
P('A gunman\'s turns that start with a foe beside him (in 100), 3 v 3 people: ' + KITS.filter(k => k !== 'today').map(k => { const x = get('humans', 3, 3, k, 'start'); return KNAME[k] + ' ' + (x ? x.gun_turns_with_a_foe_beside_him_in_100 : '-'); }).join(', ') + '.');
P('');
const we = (k, c, e, kit) => (get(k, c, e, kit, 'start') || {}).won_in_100;
P('By the eye (the rifle to the best shot, the main man on the line), cell by cell against the draft by place: 3 v 3 people ' + we('humans', 3, 3, 'eye') + ' against ' + we('humans', 3, 3, 'draft') + '; 3 v 2 wolves ' + we('direwolf', 3, 2, 'eye') + ' against ' + we('direwolf', 3, 2, 'draft')
  + '; 6 v 6 people ' + we('humans', 6, 6, 'eye') + ' against ' + we('humans', 6, 6, 'draft') + '; 6 v 3 wolves ' + we('direwolf', 6, 3, 'eye') + ' against ' + we('direwolf', 6, 3, 'draft') + '. It helps the crews of three (the New Crew\'s ranged companion gets the rifle) and costs at six, where it moves a brawler off the line for a miner: the best eye takes the rifle, the best fighter keeps the line.');
P('');
P('Read down, 3 v 3 people and 6 v 6 people: today\'s gun rows ' + w33('jobs') + ' and ' + w66('jobs') + '; the draft at the crossbow\'s pace ' + w33('once') + ' and ' + w66('once') + '; firing twice a turn ' + w33('draft') + ' and ' + w66('draft')
  + '; without the butt ' + w33('nobutt') + ' and ' + w66('nobutt') + '; nobody on the line ' + w33('allguns') + ' and ' + w66('allguns') + '; the pipes ' + w33('today') + ' and ' + w66('today') + '. The rate is the big lever; the butt matters most to the smallest crews and the lone man; the line matters at every size.');
P('');
if (B.search) {
  P('### The search that chose the rate (' + B.search.fights_per_cell + ' fights a cell, our start, brigands)');
  P('');
  P('| cell and variant | won in 100 | struck down a fight | guns\' share |');
  P('|---|---|---|---|');
  Object.keys(B.search.rows).sort().forEach(k => { const r = B.search.rows[k]; P('| ' + k.split('|')[0] + ': ' + r.name + ' | ' + r.won_in_100 + ' | ' + r.your_men_struck_down_per_fight + ' | ' + r.guns_share_of_the_killing_in_100 + ' |'); });
  P('');
  P('Starting the band across the street (8 tiles between the fronts, not 5) bought nothing; more damage bought some; the RATE bought the most for the fewest numbers moved, so the pick moves one number per gun (the AP of a shot) and keeps every damage a step off Battle Brothers\'.');
  P('');
}
P('### THE LONE WOLF (one man), measured apart');
P('');
P('Against 2 brigands, our start: his pipe wins ' + lone('today', 'start', 2) + ' in 100; the draft rifle ' + lone('draft', 'start', 2) + '; Battle Brothers\' crossbow ' + lone('bb', 'start', 2) + '. Against 3: ' + lone('today', 'start', 3) + ', ' + lone('draft', 'start', 3) + ', ' + lone('bb', 'start', 3) + '. '
  + 'His hedge knight rolls a ranged skill of 32 to 42; a gun is only as good as the man\'s eye, and one man has no line to stand behind. Battle Brothers\' answer is the bag: the Lone Wolf carries his sword and a second weapon and swaps (an AP cost, free with Quick Hands). '
  + 'Until the fight has a bag, the Lone Wolf is the one origin where a gun in his hand loses him the first fight; give him the gun as the second weapon, never the only one.');
P('');
P('## THE AMMO PER FIGHT (the draft guns, our start, the cells of three and six)');
P('');
P('A gunman fires ' + AMMO.routine.mean + ' shots in a routine fight (no more of them than of you; the worst cell\'s 90th fight ' + AMMO.routine.p90 + ', the most ever ' + AMMO.routine.max + ') and ' + AMMO.tough.mean + ' in a tough one (more of them; 90th ' + AMMO.tough.p90 + ', most ' + AMMO.tough.max + ').');
P('');
P('| shots carried into the fight | ' + LOADS.join(' | ') + ' |');
P('|---|' + LOADS.map(() => '---').join('|') + '|');
P('| routine fights a man runs dry, in 100 (the average cell / the worst cell) | ' + LOADS.map(n => AMMO.routine.dry[n] + ' / ' + AMMO.routine.dryWorst[n]).join(' | ') + ' |');
P('| tough fights a man runs dry, in 100 | ' + LOADS.map(n => AMMO.tough.dry[n] + ' / ' + AMMO.tough.dryWorst[n]).join(' | ') + ' |');
P('');
P('**THE PROPOSAL: ' + pickLoad + ' shots a gunman carries into a fight** (the smallest load with no routine cell running dry more than 10 fights in 100), refilled after the fight from the company\'s stock the way Battle Brothers refills a quiver (one stock, one point a shot, never a price at the trigger). '
  + 'Battle Brothers\' quiver is 10 and its bow fires twice a turn, so this is its own load, a step easier. A routine fight never runs a man dry (rule 117(c): he feels he is doing it well); a tough one can, and then the butt is what he has (his 9/29: "if you have no ammo you gotta do what you gotta do"). '
  + 'The stock and its price are ECONOMY [the first bullets]; the start kit by Battle Brothers\' Resources table is 20 / 40 / 80 points (low / medium / high), which at ' + pickLoad + ' a man is ' + [20, 40, 80].map(p => Math.round(10 * p / pickLoad) / 10).join(' / ') + ' gunman-fights of refills.');
P('');
P('## WHAT CANNOT BE TESTED YET, AND WHY');
P('');
P('1. THE BUTT AND THE ROW\'S OWN DISTANCE NUMBERS ARE TWO BENCH SPLICES (in memory, named in the bank). The live fight has neither: a gun at one tile does nothing and a gun\'s distance numbers come from its class. The draft rows only play as measured once COMBAT builds both.');
P('2. THE DIAL IS NOT PLAYED (rule 63a and the 9/22 amendment): AUTO takes every shot as a routine one. The important shot\'s dial owns every number over one; this page sets the routine shot.');
P('3. THE BEASTS: the fight has no animal; the dire wolves carry their wiki bite in memory (tools/bohemia_tuning_the_whole_grid.js, 0630_Direwolf Bite).');
P('4. THE GEAR IS NOT IN: one shotgun, one pistol, one rifle; no better gun to climb to. Every number DRAFT.');
P('5. AUTO PLAYS BOTH SIDES: a player who keeps his shooters behind the line and picks targets wins more; the comparison between kits is fair, the absolute number is a floor.');
P('6. THE MEN ARE NOT SHOOTERS: the fifteen origins\' first men average a ranged skill of ' + card.average_ranged_skill + ' (melee backgrounds: militia, brawlers, miners); a born shooter (55.5) lands ' + (row('draft_rifle').hit['born|thug'][1] - row('draft_rifle').hit['average|thug'][1]) + ' more in 100 with the rifle. A guns-first start that keeps melee men gets melee men\'s aim.');
P('');
P('## ROUTED');
P('');
P('- COMBAT [guns from the first fight]: (a) the three draft rows above, with the one-line read of per_tile and base_bonus off the row; (b) THE BUTT: at one tile a gun strikes as a club (one press, Battle Brothers\' bag-and-swap simplified); (c) THE KIT BY THE MAN, not by the seventh place: the first man keeps the pipe and the car door (the only ring); in a crew of three the best eye takes the rifle and the next the pistol (measured above: it lifts the New Crew, whose ranged companion is third); in a crew of six the best fighters keep the line and the best eyes among the rest take the guns; '
  + '(d) the load of ' + pickLoad + ' a gunman a fight, shown under the finger as shots left (rule 120(b)); (e) the Lone Wolf keeps his blade until the fight has a bag.');
P('- PEOPLE + RUN: the origins\' first men are melee backgrounds (average ranged ' + card.average_ranged_skill + '); a guns-first origin wants at least one man who can shoot (a Hunter, a Poacher, a Witch Hunter) in its first three.');
P('- ECONOMY [the first bullets]: the load (' + pickLoad + ' a man a fight), the refill after the fight from one stock, Battle Brothers\' start kit 20 / 40 / 80.');
P('- UI (rule 120(b)): the hit chance under the finger now changes by the house: the draft pistol drops ' + (-D.pistol.per_tile) + ' a house, the rifle ' + (-D.rifle.per_tile) + ', the shotgun ' + (-D.shotgun.per_tile) + '; that is the line that tells him his weapon is wrong for the shot.');
P('- COMBAT (found on the bench, not a gun): a fight that NEVER ENDS. Six of yours with pipes against two dire wolves, our start, seed 9168: both sides hold their line at full health for 7,500 rounds and nobody steps in (the crew\'s AUTO holds until contact, the wolves never come). 1 fight in 200 of that cell, at Battle Brothers\' Veteran too. A player would move; AUTO and a careful player who waits for the charge never get one.');
P('- TUNING (next): [the whole grid] (the bench is running on the game as it plays); the draft guns go across it as a kit once COMBAT lands them.');
P('');
P('Bank: banks/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.json (draft:true; the card, every cell, the search). Tools: tools/bohemia_tuning_the_first_kit_is_guns.js (the bench), tools/bohemia_tuning_the_first_kit_is_guns_page.js (this page).');
P('');
P('[bb Battle Brothers keeps the bow a support weapon by the reload and the quiver; a rifle with no crank, two shots a turn and ten in the bag is how the gun becomes the main way, and the quiver\'s refill is how bullets stay scarce without a price at the trigger.]');
P('[analog horror: the butt is the sound of a gun that is empty; named for SOUNDS (the dry click before the swing), not moved.]');
fs.writeFileSync(path.join(ROOT, 'records/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.md'), md.join('\n') + '\n');

/* ---------- the VOTE page: the three guns and who wins, one look ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const band = w => w === null || w === undefined ? '' : w >= 70 ? 'g' : w >= 40 ? 'a' : 'r';
const h = [];
h.push('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">');
h.push('<title>THE FIRST GUNS</title>');
h.push('<style>:root{--bg:#f4efe4;--ink:#1b1711;--line:#8a7d66;--g:#bfd8a8;--a:#f0d79a;--r:#e7a593}'
  + 'body{margin:0;padding:16px;background:var(--bg);color:var(--ink);font:15px/1.4 Georgia,serif}h1{font-size:20px;margin:0 0 6px}h2{font-size:16px;margin:18px 0 6px}'
  + 'p,li{max-width:72ch}.guns{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}.gun{border:1px solid var(--line);background:#fff;padding:10px}'
  + '.gun b{font-size:16px}.gun .n{font-size:28px;line-height:1}.gun .bb{color:#6d6455;font-size:13px}.wrap{overflow-x:auto}'
  + 'table{border-collapse:collapse;font-size:13px}th,td{border:1px solid var(--line);padding:4px 5px;text-align:center}td,tr:first-child th{white-space:nowrap}th{background:#e8dfcd;font-weight:normal}'
  + 'td.g{background:var(--g)}td.a{background:var(--a)}td.r{background:var(--r)}.key span{display:inline-block;padding:2px 6px;margin-right:4px;border:1px solid var(--line);font-size:12px}.k{font-size:11px;color:#5b5244;overflow-wrap:anywhere}</style></head><body>');
h.push('<h1>THE FIRST GUNS</h1>');
h.push('<p>TUNING, research only. Three starting guns, each beside the Battle Brothers bow or crossbow it replaces. A tile is a house. <b>DRAFT: nothing in the game uses these yet.</b></p>');
h.push('<p><b>Why your start never had guns:</b> ' + noGun.length + ' of ' + ORIG.length + ' starts hand out guns only from the seventh man up, so every small crew walks in with pipes.</p>');
h.push('<div class="guns">');
VER.forEach(x => {
  const hd = x.d.hit['average|thug'], hb = x.b.hit['average|thug'];
  h.push('<div class="gun"><b>' + x.gun + '</b><div>hits ' + (hd[1] === null ? '-' : hd[1]) + ' in 100 at 2 houses, ' + (hd[2] === null ? 'can\'t reach 3' : hd[2] + ' at 3') + '</div>'
    + '<div class="bb">' + esc(x.b.name) + ': ' + (hb[1] === null ? 'can\'t reach 2' : hb[1] + ' at 2') + ', ' + (hb[2] === null ? 'can\'t reach 3' : hb[2] + ' at 3') + '</div>'
    + '<div>' + x.d.shots_a_turn + ' shots a turn <span class="bb">(' + esc(x.b.name) + ': ' + x.b.shots_a_turn + ')</span></div>'
    + '<div>' + x.d.to_drop.none + ' hits to drop a bare bandit <span class="bb">(' + x.b.to_drop.none + ')</span></div></div>');
});
h.push('</div>');
h.push('<p>Every gun fires twice a turn, the way a pipe swings twice. Up close, the gun is a club. A man carries <b>' + pickLoad + ' shots</b> a fight and gets them back after.</p>');
h.push('<h2>Who wins the first fights (in 100)</h2>');
h.push('<p class="key"><span style="background:var(--g)">70+ you mostly win</span><span style="background:var(--a)">40 to 69 a coin toss</span><span style="background:var(--r)">under 40 you mostly lose</span></p>');
const SHOW = ['today', 'jobs', 'bb', 'draft'], SN = { today: 'pipes, today', jobs: 'today\'s gun numbers', bb: 'Battle Brothers\' bows', draft: 'the new guns' };
KINDS.forEach(k => {
  /* the phone's columns: the lone man against two (his against three and six are all but zero, on the record), then three and six */
  const CC = [[1, 2]].concat([3, 6].reduce((a, c) => a.concat(COUNTS.map(e => [c, e])), []));
  h.push('<p><b>Against ' + WHO[k] + '</b></p><div class="wrap"><table><tr><th>yours v theirs</th>' + CC.map(p => '<th>' + p[0] + 'v' + p[1] + '</th>').join('') + '</tr>');
  SHOW.forEach(kit => h.push('<tr><th>' + esc(SN[kit]) + '</th>' + CC.map(p => { const x = get(k, p[0], p[1], kit, 'start'); const w = x ? x.won_in_100 : null; return '<td class="' + band(w) + '">' + (w === null ? '-' : w) + '</td>'; }).join('') + '</tr>'));
  h.push('</table></div>');
});
h.push('<p>Six of yours against six bandits: pipes win <b>' + w66('today') + '</b>, today\'s gun numbers <b>' + w66('jobs') + '</b>, Battle Brothers\' bows <b>' + w66('bb') + '</b>, the new guns <b>' + w66('draft') + '</b>, and the guns do <b>' + (get('humans', 6, 6, 'draft', 'start') || {}).guns_share_of_the_killing_in_100 + ' in 100</b> of the killing.</p>');
h.push('<p>The one start a gun doesn\'t fix: the Lone Wolf. His knight can\'t shoot, so he keeps his blade.</p>');
h.push('<p class="k">The method, every number beside Battle Brothers\' and the ammo table: records/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.md. ' + Object.keys(C).length + ' cells, ' + B.fights_per_cell + ' fights each, the computer playing both sides. draft:true.</p>');
h.push('</body></html>');
fs.writeFileSync(path.join(ROOT, 'slices/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.html'), h.join('\n') + '\n');
console.log('3v3 / 6v6 people won (start): ' + KITS.map(k => k + ' ' + w33(k) + '/' + w66(k)).join(', ') + ' | load ' + pickLoad + ' | harder: ' + (harder.length ? harder.join('; ') : 'none'));
console.log('wrote records/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.md and slices/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.html');
