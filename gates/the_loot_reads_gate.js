#!/usr/bin/env node
/* ============================================================================
   GATE: THE LOOT READS (FIGHT SCREEN THREE 11/26; VAMILY rule 482: 'cleaning up, improving things we're already doing'; the end screen
   on its side). Measured on the demo on its side: a 34 point picture in a 45 point tile squeezed a piece's name to nothing (the axe, the
   flail) or sliced it at the tile's floor ('door' half gone); a worn piece's bar ran through its name in every shape.
   The end screen opened on its own (tools/bohemia_fight_screen_the_loot_tiles.js, the screen's own SAMPLE), at five phone shapes:
     L1  every piece's tile: its name whole (inside the tile, never sliced), its picture inside, the worn bar never over the name, the
         picture never over the name
     L2  no picture squashed: each keeps its own shape (a square icon square, the pack's tall pipe tall)
     errors  no page error
     planted: __THE_LOOT_READS__'s rules taken out (LOOT_PLANT): L1 red
   Run: node gates/the_loot_reads_gate.js      (under a minute)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const run = (env) => { const out = fs.mkdtempSync(path.join(os.tmpdir(), 'loot-'));
  spawnSync('node', [path.join(ROOT, 'tools/bohemia_fight_screen_the_loot_tiles.js'), out], { env: Object.assign({}, process.env, env || {}), stdio: 'ignore', timeout: 240000 });
  let T = null; try { T = JSON.parse(fs.readFileSync(path.join(out, 'loot_tiles.json'), 'utf8')); } catch (e) {} try { fs.rmSync(out, { recursive: true, force: true }); } catch (e) {} return T; };
const tiles = (T) => T ? Object.keys(T.shapes).map(k => [k, T.shapes[k]]) : [];
const l1 = (T) => !!T && tiles(T).length === 5 && tiles(T).every(([, L]) => L.length > 0 && L.every(t => t.nameWhole && t.picIn && !t.barOver && !t.picOverName));
const l2 = (T) => !!T && tiles(T).every(([, L]) => L.every(t => !t.squashed));
const say = (T) => tiles(T).map(([k, L]) => k + ': ' + L.map(t => t.name + ' ' + (t.pic || []).join('x') + (t.nameWhole ? '' : ' NAME CUT') + (t.barOver ? ' BAR OVER' : '') + (t.picOverName ? ' PIC OVER' : '') + (t.squashed ? ' SQUASHED' : '')).join(', ')).join(' | ');
const T = run();
if (!T) { check(false, 'ran', 'the end screen did not open'); console.log('\nTHE LOOT READS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(1); }
check(l1(T), 'L1', 'every piece reads: ' + say(T));
check(l2(T), 'L2', 'no picture squashed: ' + say(T));
check(!(T.errs || []).length, 'errors', (T.errs || []).length + ' page errors');
const P = run({ LOOT_PLANT: '1' });
check(!!P && !l1(P), 'planted', 'the loot\'s rules taken out: L1 reads ' + (P ? say(P).slice(0, 400) : 'nothing') + ' (red)');
console.log('\nTHE LOOT READS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0);
