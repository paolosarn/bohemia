#!/usr/bin/env node
/* THE PROOF THE DESIGN PAGE CITES (MODS lane, 10/10/26). Runs the reference merge
   against the real bb data and states, with a failing exit, the five promises of
   the mods-folder design. Not in the suite: this is research (rule 38g/78), a
   proof that the design holds, not a gate on anyone's code. */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { merge, loadBase } = require('./bohemia_mods_merge_reference.js');
const ROOT = path.join(__dirname, '..');
const EX = path.join(__dirname, 'mods_reference', 'example_mods');
let pass = 0, fail = 0;
const ok = (n, c, x) => { if (c) { pass++; console.log('  PASS ' + n); } else { fail++; console.log('  FAIL ' + n + (x ? ' -- ' + x : '')); } };
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'mods-'));
function copyMods(dst, names) { for (const n of names) fs.cpSync(path.join(EX, n), path.join(dst, n), { recursive: true }); }

console.log('THE MODS FOLDER DESIGN, PROVED ON THE REAL DATA');
/* 1 a missing or empty mods folder leaves the data byte for byte the same */
const empty = tmp();
ok('1a an empty mods folder changes nothing', !merge(empty).changed);
ok('1b a mods folder that does not exist changes nothing', !merge(path.join(empty, 'nope')).changed);
/* 2 a mod that is wrong in every way changes nothing and says why, by name */
const bad = tmp(); fs.mkdirSync(path.join(bad, 'broken')); fs.cpSync(path.join(EX, 'broken'), path.join(bad, 'broken'), { recursive: true });
fs.rmSync(path.join(bad, 'broken', 'perks.json'));      /* leave only valid-JSON wrong values */
const rb = merge(bad);
ok('2a a mod with only wrong values changes nothing', !rb.changed);
ok('2b it names a bad value, an unknown field, a short new row', ['wants number', 'no row in the base', 'NEW row needs'].every(s => rb.log.some(l => l[1].includes(s))));
/* 3 a good mod changes exactly what it says */
const g = tmp(); copyMods(g, ['knife-harder']);
const rg = merge(g), base = loadBase();
const knife = rg.data['weapons.json'].rows.find(r => r.id === 'knife');
ok('3a the knife reads 20 to 30', knife.damage_min === 20 && knife.damage_max === 30);
const others = rg.data['weapons.json'].rows.filter(r => r.id !== 'knife').length === base['weapons.json'].rows.length - 1;
ok('3b every other weapon is untouched', others && JSON.stringify(rg.data['weapons.json'].rows.filter(r => r.id !== 'knife')) === JSON.stringify(base['weapons.json'].rows.filter(r => r.id !== 'knife')));
ok('3c no other data file moved', Object.keys(base).filter(f => f !== 'weapons.json').every(f => JSON.stringify(rg.data[f]) === JSON.stringify(base[f])));
/* 4 a mod can add a row */
const a = tmp(); copyMods(a, ['new-sword']);
const ra = merge(a);
ok('4 a new sword adds exactly one weapon', ra.data['weapons.json'].rows.length === base['weapons.json'].rows.length + 1 && ra.data['weapons.json'].rows.some(r => r.id === 'moon-blade'));
/* 5 order and conflict: two mods, the later wins, and it is said out loud */
const o = tmp(); copyMods(o, ['knife-harder']);
fs.mkdirSync(path.join(o, 'knife-harder-still'));
fs.writeFileSync(path.join(o, 'knife-harder-still', 'manifest.json'), JSON.stringify({ id: 'knife-harder-still', name: 'Still', version: '1', schema: 1, loadAfter: ['knife-harder'] }));
fs.writeFileSync(path.join(o, 'knife-harder-still', 'weapons.json'), JSON.stringify({ rows: { knife: { damage_min: 25 } } }));
const ro = merge(o);
ok('5a the mod that loads later wins', ro.data['weapons.json'].rows.find(r => r.id === 'knife').damage_min === 25);
ok('5b the conflict is named', ro.log.some(l => l[1].startsWith('CONFLICT')));
/* 7 the draft ranges WARN and never block: a knife at minus 5 loads, with a warning; a knife at 20 does not warn */
const { ranges } = require('./bohemia_mods_ranges_draft.js');
const neg = tmp(); fs.mkdirSync(path.join(neg, 'neg'));
fs.writeFileSync(path.join(neg, 'neg', 'manifest.json'), JSON.stringify({ id: 'neg', name: 'Neg', version: '1', schema: 1 }));
fs.writeFileSync(path.join(neg, 'neg', 'weapons.json'), JSON.stringify({ rows: { knife: { damage_min: -5, damage_max: 999 } } }));
const rn = merge(neg, { ranges });
ok('7a a knife at minus 5 and 999 gets warnings', rn.log.filter(l => l[0] === 'warn' && l[1].includes('outside every base row')).length >= 2 && rn.log.some(l => l[1].includes('ever negative')));
ok('7b ...and still loads (a warning is not a block)', rn.data['weapons.json'].rows.find(r => r.id === 'knife').damage_min === -5);
ok('7c a knife at 20 to 30 gets no range warning', !merge(g, { ranges }).log.some(l => l[1].includes('outside every base row')));
ok('7d without ranges there is no range warning at all', !merge(neg).log.some(l => l[1].includes('outside every base row')));
/* 8 the id policy: a new row's id starts with '<modid>:'. Warn, never block; no base id uses the colon */
const base0 = loadBase();
const colonIds = []; for (const [f, j] of Object.entries(base0)) for (const v of Object.values(j)) if (Array.isArray(v)) for (const r of v) if (r && typeof r.id === 'string' && r.id.includes(':')) colonIds.push(f + ':' + r.id);
ok('8a no base id contains a colon, so the colon is free as a namespace (' + colonIds.length + ' found)', colonIds.length === 0);
const oddIds = []; for (const [f, j] of Object.entries(base0)) for (const v of Object.values(j)) if (Array.isArray(v)) for (const r of v) if (r && typeof r.id === 'string' && !/^[a-z0-9_]+$/.test(r.id)) oddIds.push(f + ':' + r.id);
ok('8e every base id is lowercase letters, digits and underscore (' + oddIds.length + ' are not)', oddIds.length === 0);
const nm = tmp(); copyMods(nm, ['new-sword']);
ok('8b a bare new id warns when the policy is on', merge(nm, { namespace: true }).log.some(l => l[0] === 'warn' && l[1].includes('should start with "new-sword:"')));
const nm2 = tmp(); copyMods(nm2, ['new-sword']);
const wpath = path.join(nm2, 'new-sword', 'weapons.json'); const wj = JSON.parse(fs.readFileSync(wpath, 'utf8'));
wj.rows = { 'new-sword:moon-blade': wj.rows['moon-blade'] }; fs.writeFileSync(wpath, JSON.stringify(wj));
const rnm = merge(nm2, { namespace: true });
ok('8c a prefixed id is silent and added', !rnm.log.some(l => l[1].includes('should start with')) && rnm.data['weapons.json'].rows.some(r => r.id === 'new-sword:moon-blade'));
ok('8d with the policy off there is no id warning, and a bare id still loads', !merge(nm).log.some(l => l[1].includes('should start with')) && merge(nm).data['weapons.json'].rows.some(r => r.id === 'moon-blade'));
/* 9 the five worked mods a stranger can copy each do exactly what the README says, with no fault and no warning */
const each = ['enemy-pack', 'poorer-start', 'fair-wages', 'sharper-mastery', 'new-helm'];
const run1 = n => { const d = tmp(); copyMods(d, [n]); return merge(d, { ranges, namespace: true }); };
const clean = r => !r.log.some(l => l[0] === 'bad' || l[0] === 'warn');
const b9 = loadBase();
const r1 = run1('enemy-pack'), r2 = run1('poorer-start'), r3 = run1('fair-wages'), r4 = run1('sharper-mastery'), r5 = run1('new-helm');
ok('9a all five example mods load with no fault and no warning', [r1, r2, r3, r4, r5].every(clean), [r1, r2, r3, r4, r5].map(r => r.log.filter(l => l[0] !== 'ok').map(l => l[1]).join(' / ')).join(' | '));
const sw = r1.data['enemies.json'].rows.find(r => r.id === 'enemy-pack:swamp_thug');
ok('9b enemy-pack adds one enemy, ten hit points tougher than the poacher it copies', !!sw && sw.hp === b9['enemies.json'].rows.find(r => r.id === 'brigand_poacher').hp + 10 && r1.data['enemies.json'].rows.length === b9['enemies.json'].rows.length + 1);
const o2 = r2.data['origins.json'].origins.find(r => r.id === 'rebuild'), o0 = b9['origins.json'].origins.find(r => r.id === 'rebuild');
ok('9c poorer-start changes only batteries.full', o2.batteries.full === 200 && o2.batteries.thin === o0.batteries.thin && o2.batteries.bare === o0.batteries.bare);
ok('9d fair-wages changes one wage and nothing else', r3.data['backgrounds.json'].rows.find(r => r.id === 'adventurous_noble').daily_wage === 20 && JSON.stringify(r3.data['backgrounds.json'].rows.filter(r => r.id !== 'adventurous_noble')) === JSON.stringify(b9['backgrounds.json'].rows.filter(r => r.id !== 'adventurous_noble')));
const p4 = r4.data['perks.json'].rows.find(r => r.id === 'mace_mastery').numbers, p0 = b9['perks.json'].rows.find(r => r.id === 'mace_mastery').numbers;
ok('9e sharper-mastery changes one perk number and keeps the others', p4.fatigue_reduction_pct === 30 && p4.stun_chance_pct === p0.stun_chance_pct && p4.stun_chance_increase_pct === p0.stun_chance_increase_pct);
ok('9f new-helm adds one head piece to the head table', r5.data['armor.json'].head.length === b9['armor.json'].head.length + 1 && r5.data['armor.json'].head.some(r => r.id === 'new-helm:salvage_helm'));
const wage99 = tmp(); fs.cpSync(path.join(EX, 'fair-wages'), path.join(wage99, 'fair-wages'), { recursive: true });
fs.writeFileSync(path.join(wage99, 'fair-wages', 'backgrounds.json'), JSON.stringify({ rows: { adventurous_noble: { daily_wage: 99 } } }));
ok('9g a wage of 99 warns (outside 0 to 35) and still loads', merge(wage99, { ranges }).log.some(l => l[0] === 'warn' && l[1].includes('outside every base row')) && merge(wage99, { ranges }).data['backgrounds.json'].rows.find(r => r.id === 'adventurous_noble').daily_wage === 99);
/* 6 no play surface asks for a mods folder: nothing in the game loads one (his 9/30 NAH) */
const surfaces = ['slices/BOHEMIA_DEMO.html', 'slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_FIGHT.html', 'slices/BOHEMIA_CITY_WORLD.html'];
const asks = surfaces.filter(f => /fetch\(\s*['"`][^'"`]*\bmods\//.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
ok('6 no play surface fetches a mods folder (' + surfaces.length + ' checked)', asks.length === 0, asks.join(', '));
console.log('  ' + pass + ' passed / ' + fail + ' failed');
process.exit(fail ? 1 : 0);
