#!/usr/bin/env node
/* ============================================================================
   GATE: THE PRESS IS SAID (FIGHT SCREEN 4, 11/28/26; VAMILY rule 482: 'the new guns and drones on the fight screen reading clear and
   punchy'; ARMORY 3's guns, rule 489).
   MEASURED BEFORE (tools/bohemia_fight_screen_the_aim_line.js on main fdb51eb33): a Guard Carbine's aim line said '55% to hit... 30 left'
   though one tap fires three rounds, each a try ten points down; the Box SMG's four the same; the Belt-Fed's sweep across three houses
   read 'The blast strikes 3 of theirs'; on its side the strip held two lines and a shotgun's, a belt's, a rocket's third line was cut.
   The shipped fight page at phone size, his man handed each piece, theirs stood where its shot reaches, a finger on the man aimed at:
     A1  THE BURST: the carbine says '3 rounds a tap' and three tries, the first his chance and each next the recoil down (ours.json
         armory_fire.burst.recoil_per_round), and '3 a tap' on its rounds; the SMG four of each
     A2  THE BELT: '6 rounds a tap, 2 tries a house' and 'The belt walks across 3 houses: 3 of theirs' (the fight's own count of theirs in it)
     A3  THE ROCKET: 'The rocket takes the house and the 8 round it: 3 of theirs'
     A4  THE REST AS THEY WERE: the shotgun's 'The blast strikes 2 of theirs.'; a semi-auto's one chance and 'N left.', no 'a tap'
     A5  ON THE GLASS: every aim line, upright and on its side, shown, on the glass, nothing cut, nothing under 11 points
     errors  no page error
     planted: the shapes file's aim words taken out (AIM_PLANT): A1 and A2 red
   Run: node gates/the_press_is_said_gate.js      (about 6 min, one browser at a time)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const REC = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8')).armory_fire.value.burst.recoil_per_round;
const run = (way, env) => { const out = fs.mkdtempSync(path.join(os.tmpdir(), 'aim-'));
  spawnSync('node', [path.join(ROOT, 'tools/bohemia_fight_screen_the_aim_line.js'), way, out], { env: Object.assign({}, process.env, env || {}), stdio: 'ignore', timeout: 400000 });
  let T = null; try { T = JSON.parse(fs.readFileSync(path.join(out, 'aim_line.json'), 'utf8')); } catch (e) {} try { fs.rmSync(out, { recursive: true, force: true }); } catch (e) {} return T; };
const lines = (T, k) => (T && T.scenes[k] && T.scenes[k].say && T.scenes[k].say.lines) || [];
const nums = (s) => (String(s).match(/(\d+)%/g) || []).map(x => parseInt(x, 10));
/* the tries on a burst's first line: n of them, each the one before less the recoil (never under the floor: they only ever fall) */
const tries = (l, n) => { const m = /each a try: (.*) to hit|tries a house: (.*) to hit/.exec(l || ''); if (!m) return null; const t = nums(m[1] || m[2]);
  return t.length === n && t.slice(1).every((x, i) => x === t[i] - REC || (x > t[i] - REC && x <= t[i])) ? t : null; };   /* each the one before less the recoil, or held at the floor */
const a1 = (T) => { const B = lines(T, 'burst'), S = lines(T, 'smg');
  return /^3 rounds a tap, each a try: /.test(B[0] || '') && !!tries(B[0], 3) && /, 3 a tap\.$/.test(B[B.length - 1] || '') && /^4 rounds a tap, each a try: /.test(S[0] || '') && !!tries(S[0], 4) && /, 4 a tap\.$/.test(S[S.length - 1] || ''); };
const a2 = (T) => { const L = lines(T, 'belt'), f = T && T.scenes.belt && T.scenes.belt.foes; return /^6 rounds a tap, 2 tries a house: /.test(L[0] || '') && !!tries(L[0], 2) && L.indexOf('The belt walks across 3 houses: ' + f + ' of theirs.') >= 0 && f === 3; };
const a3 = (T) => { const L = lines(T, 'rocket'), f = T && T.scenes.rocket && T.scenes.rocket.foes; return L.indexOf('The rocket takes the house and the 8 round it: ' + f + ' of theirs.') >= 0 && f === 3; };
const a4 = (T) => { const C = lines(T, 'cone'), P = lines(T, 'plain'); return C.indexOf('The blast strikes 2 of theirs.') >= 0 && /^\d+% to hit\. A hit: /.test(P[0] || '') && /^\d+ left\.$/.test(P[P.length - 1] || '') && !P.some(l => /a tap/.test(l)); };
const a5 = (T) => !!T && Object.keys(T.scenes).length === 6 && Object.keys(T.scenes).every(k => { const s = T.scenes[k].say; return s && s.shown && s.onGlass && !s.cut && s.smallest >= 11; });
const W = [['upright', run('upright')], ['sideways', run('sideways')]];
const both = (fn) => W.every(([, T]) => { try { return !!T && fn(T); } catch (e) { return false; } });
const say = (k) => W.map(([w, T]) => w + ' ' + JSON.stringify(lines(T, k))).join(' | ');
check(both(a1), 'A1', 'the burst (recoil ' + REC + ' a round): carbine ' + say('burst') + '; SMG ' + say('smg'));
check(both(a2), 'A2', 'the belt: ' + say('belt'));
check(both(a3), 'A3', 'the rocket: ' + say('rocket'));
check(both(a4), 'A4', 'the rest as they were: shotgun ' + say('cone') + '; semi-auto ' + say('plain'));
check(both(a5), 'A5', 'on the glass: ' + W.map(([w, T]) => w + ' ' + (T ? Object.keys(T.scenes).map(k => { const s = T.scenes[k].say || {}; return k + (s.shown ? '' : ' NOT SHOWN') + (s.onGlass ? '' : ' OFF') + (s.cut ? ' CUT' : '') + ' ' + s.smallest + 'pt ' + (s.box || []).join('x'); }).join(', ') : 'did not run')).join(' | '));
check(both(T => Object.keys(T.scenes).every(k => !(T.scenes[k].errs || []).length && !T.scenes[k].err)), 'errors', W.map(([w, T]) => w + ' ' + (T ? Object.keys(T.scenes).map(k => (T.scenes[k].errs || []).length + (T.scenes[k].err ? 'E' : '')).join('/') : '-')).join(' | ') + ' page errors a scene');
const PL = run('upright', { AIM_PLANT: '1' });
check(!!PL && !a1(PL) && !a2(PL), 'planted', 'the aim words taken out: the carbine says ' + JSON.stringify(lines(PL, 'burst')) + ', the belt ' + JSON.stringify(lines(PL, 'belt')) + ' (A1, A2 red)');
console.log('\nTHE PRESS IS SAID: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
