#!/usr/bin/env node
/* NO TWO MEN SHARE A NAME (FIXES item 10, VAMILY rule 351(b), ask line 362; Paolo 11/3: 'I think three of them are named the same
   thing in my company'). engine/bohemia_unique_name.js.
   Legs:
   1. *** 200 HIRES INTO ONE COMPANY, NO TWO NAMES ALIKE ***: the names engine's own rolls forced onto seven seeds (so most collide),
      and 200 men who all arrive as 'A STRANGER' (the post before the names engine loads): every name in the company is its own.
   2. A NEW MAN NEVER TAKES YOUR NAME OR A LIVING MAN'S; A DEAD MAN'S NAME IS FREE AGAIN.
   3. *** A SAVE WITH TWINS IS FIXED ON LOAD ***: the first keeps the name, every later twin is renamed, his face (look) and hire id
      his own, his shared record copied to his new name; the same man in both lists keeps one name; nothing changes on a clean save.
   4. THE HIRE LOCK (engine/bohemia_hire_lock.js, read by the shell, the town and the crew screen) names a taken man with a new
      surname and mends twins at load; THE WIRES: the engines load before it everywhere, the post shows the final name.
   Run: node gates/no_two_men_share_a_name_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const ok = (what, c, why) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const store = {};
global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
global.window = global;
global.BohemiaNames = require(path.join(ROOT, 'engine/bohemia_names.js'));
const U = require(path.join(ROOT, 'engine/bohemia_unique_name.js'));
const K = U.key;

/* 1 */
let taken = {}, seen = [];
for (let i = 0; i < 200; i++) { const base = BohemiaNames.roll('post:gate:' + (i % 7), { sex: 'm' }).full; const n = U.unique(base, taken, { seed: 'h' + i, sex: 'm' }); taken[K(n)] = 1; seen.push(n); }
const dupA = seen.length - new Set(seen.map(K)).size;
taken = {}; const strangers = [];
for (let i = 0; i < 200; i++) { const n = U.unique('A STRANGER', taken, { seed: 's' + i }); taken[K(n)] = 1; strangers.push(n); }
const dupB = strangers.length - new Set(strangers.map(K)).size;
ok('*** 200 HIRES INTO ONE COMPANY, NO TWO NAMES ALIKE *** (seven seeds rolled for 200 men; and 200 who arrive as A STRANGER)', dupA === 0 && dupB === 0 && seen.length === 200,
  dupA + ' and ' + dupB + ' twins; e.g. ' + seen.slice(0, 3).concat(seen.slice(7, 9)).join(', ') + ' | ' + strangers.slice(0, 3).join(', '));
ok('  a renamed man keeps his first name (another surname first, a number only when the surnames run dry); A STRANGER and YOU are no first names, they get a whole name',
  seen.every((n, i) => n.split(' ')[0] === BohemiaNames.roll('post:gate:' + (i % 7), { sex: 'm' }).full.split(' ')[0]) && strangers.slice(1).every(n => !/^A /.test(n)), strangers.slice(1, 4).join(', '));

/* 2 */
store['bohemia.main.v1'] = JSON.stringify({ name: 'DESI MORA', look: 'you' });
store['bohemia.company.v1'] = JSON.stringify([{ name: 'RAUL SOTO', look: 'cast_poncho' }, { name: 'LUIS ORTIZ', look: 'cast_apron', dead: true }]);
store['bohemia.hired.v1'] = JSON.stringify([]);
const t2 = U.taken();
const a = U.unique('DESI MORA', t2, { seed: 'x' }), b = U.unique('RAUL SOTO', t2, { seed: 'y' }), c = U.unique('LUIS ORTIZ', t2, { seed: 'z' });
ok('a new man never takes YOUR name or a living man\'s; a dead man\'s name is free again', K(a) !== 'DESI MORA' && K(b) !== 'RAUL SOTO' && c === 'LUIS ORTIZ', a + ', ' + b + ', ' + c);

/* 3 */
store['bohemia.main.v1'] = JSON.stringify({ name: 'YOU', look: 'you' });
store['bohemia.company.v1'] = JSON.stringify([{ name: 'YOU', main: true, look: 'you' }, { name: 'TOMAS REYES', look: 'cast_longcoat' }, { name: 'RAUL SOTO', look: 'cast_poncho' }]);
store['bohemia.hired.v1'] = JSON.stringify([{ name: 'TOMAS REYES', look: 'cast_skirt', hid: 'h1' }, { name: 'TOMAS REYES', look: 'cast_widebrim', hid: 'h2' }, { name: 'RAUL SOTO', look: 'cast_poncho' }, { name: 'YOU', look: 'cast_cape', hid: 'h3' }, { name: 'TOMAS REYES II', look: 'cast_satchel', hid: 'h4' }]);
store['bohemia.climb.v1'] = JSON.stringify({ 'TOMAS REYES': { level: 3, xp: 900 } });
const fixed = U.fixSaved();
const co = JSON.parse(store['bohemia.company.v1']), hd = JSON.parse(store['bohemia.hired.v1']), cl = JSON.parse(store['bohemia.climb.v1']);
const alive = co.concat(hd.filter(h => !co.some(m => m.look === h.look)));
const names3 = alive.map(m => K(m.name));
ok('*** A SAVE WITH THREE TOMAS REYES, A TOMAS REYES II AND A HIRE NAMED YOU IS FIXED ON LOAD ***: one name each, the first keeps it', new Set(names3).size === names3.length && co[1].name === 'TOMAS REYES' && fixed.length === 4 && !names3.some(n => /^TOMAS REYES /.test(n)),
  alive.map(m => m.name + ' (' + m.look + ')').join(', '));
ok('  every renamed man keeps his face and his hire id; the same man in both lists keeps one name (RAUL SOTO)', hd[0].look === 'cast_skirt' && hd[0].hid === 'h1' && hd[1].look === 'cast_widebrim' && hd[2].name === 'RAUL SOTO' && co[0].name === 'YOU' && co[0].main && !/^YOU /.test(hd[3].name), hd[3].name);
ok('  the shared record is copied to each new name', fixed.filter(r => r.from === 'TOMAS REYES').every(r => cl[r.to] && cl[r.to].level === 3) && cl['TOMAS REYES'].level === 3, fixed.map(r => r.from + ' -> ' + r.to).join(', '));
ok('  a clean save is left as it was', U.fixSaved().length === 0);

/* 4: the hire lock itself, as the town and the crew screen load it */
global.BohemiaUniqueName = U;
store['bohemia.company.v1'] = JSON.stringify([{ name: 'YOU', main: true, look: 'you' }, { name: 'TOMAS REYES', look: 'cast_longcoat' }]);
store['bohemia.hired.v1'] = JSON.stringify([{ name: 'JOE BRANDT', look: 'cast_pack', hid: 'j1' }, { name: 'JOE BRANDT', look: 'cast_bedroll', hid: 'j2' }]);
store['bohemia.climb.v1'] = JSON.stringify({});
require(path.join(ROOT, 'engine/bohemia_hire_lock.js')); const HLk = global.BohemiaHireLock;
const hd4 = JSON.parse(store['bohemia.hired.v1']), n4 = HLk.uniqueName('TOMAS REYES'), n5 = HLk.uniqueName('Joe Brandt');
ok('*** THE HIRE LOCK: a man the post named TOMAS REYES is hired under a new surname, never TOMAS REYES II; the old save\'s two JOE BRANDT are two names at load ***',
  /^TOMAS /.test(n4) && U.stem(n4) !== 'TOMAS REYES' && U.stem(n5) !== 'JOE BRANDT' && hd4[0].name === 'JOE BRANDT' && U.stem(hd4[1].name) !== 'JOE BRANDT', n4 + ', ' + n5 + ' | ' + hd4.map(h => h.name).join(', '));
/* 5 */
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const ST = rd('slices/BOHEMIA_SETTLEMENT_SCREEN.html'), A = rd('slices/BOHEMIA_ALPHA_0_9.html'), D = rd('slices/BOHEMIA_DEMO.html');
const HL = rd('engine/bohemia_hire_lock.js'), RS = rd('slices/BOHEMIA_ROSTER_SCREEN.html');
const before = (src) => { const u = src.indexOf('<script src="../engine/bohemia_unique_name.js"></script>'), h = src.indexOf('<script src="../engine/bohemia_hire_lock.js"></script>'), n = src.indexOf('<script src="../engine/bohemia_names.js"></script>');
  return u >= 0 && h > u && n >= 0 && n < h; };
const wires = {
  'the hire lock names a taken man through the engine (a new surname, never a number)': /U\.unique\(name, taken/.test(HL) && /U\.fixSaved\(\)/.test(HL) && /bohemia\.main\.v1/.test(HL),
  'the names engine and this engine load before the hire lock (the shell, the demo, the town, the crew screen)': [A, D, ST, RS].every(before),
  'the post names every man against the company and the post': /BohemiaUniqueName\.unique\(r\.name, postTaken/.test(ST) && /postTaken = BohemiaHireLock\.names\(\)/.test(ST),
  'the hire is named by the hire lock before he is written': /name:\(window\.BohemiaHireLock \? BohemiaHireLock\.uniqueName\(r\.name\)/.test(ST)
};
const off = Object.keys(wires).filter(k => !wires[k]);
ok('THE WIRES', !off.length, off.join(' | ') || Object.keys(wires).length + ' wires');
console.log('=== NO TWO MEN SHARE A NAME: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
