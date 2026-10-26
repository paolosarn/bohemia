#!/usr/bin/env node
/* AN EARLY RETREAT GETS OUT (COMBAT [an early retreat gets out], rule 256, Paolo 10/26: 'if I retreat immediately at the beginning
   of the battle, most of the time I should be able to escape... things that can traverse farther than a human should start back a
   couple tiles... in Battle Brothers every time I retreated I watched my people run tile to tile and they always made it, they got
   that head start'; records/BOHEMIA_COMBAT_THE_LINEUP_AND_AN_EARLY_RETREAT_10_26_26.md).
   MEASURED BEFORE (1,000 rolled fights, RETREAT the moment his first man is up): 82.0% of his men out, every man out in 499 fights;
   13.9% of his men within a turn's run of an edge at the bell; a man of theirs closed and struck in melee on his own first turn in
   186 fights (beasts 144 of 200).
   Legs (tools/bohemia_combat_early_retreat.js on the live fight's rules: 1,000 fights, his company of 3, 6 or 12, the five road
   factions with beasts among them, two to ten of them, days 1 to 90, every district's board):
   E1 95 in 100 or more of his men out;
   E2 every man of his within a turn's run (his AP over a flat step) of an edge at the bell;
   E3 no man of theirs closes and strikes in melee on his own first turn (the wiki's 'cannot close to melee distance within 1
      round'; a fast kind starts back by its extra run);
   E4 against beasts, 95 in 100 or more of his men out;
   E5 nothing broke.
   Run: node gates/an_early_retreat_gets_out_gate.js [--n 1000] */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const n = Number(process.argv[process.argv.indexOf('--n') + 1]) || 1000;
const T = require(path.join(ROOT, 'tools/bohemia_combat_early_retreat.js')).measure(n);
const pct = (a, b) => (100 * a / Math.max(1, b)).toFixed(1) + '%';
leg(T.outShare >= 0.95, '*** E1 AN EARLY RETREAT GETS HIS MEN OUT: 95 IN 100 OR MORE *** (rule 256(a))', T.out + ' of ' + T.men + ' (' + pct(T.out, T.men) + '), every man out in ' + T.allOut + ' of ' + T.fights);
leg(T.inReach === T.men, '*** E2 HIS LINE STANDS WITHIN A TURN\'S RUN OF HIS EDGE *** (rule 256(b))', T.inReach + ' of ' + T.men);
leg(T.firstBlow === 0, '*** E3 NOBODY CLOSES TO MELEE ON HIS FIRST TURN, THE FAST ONES START BACK *** (rule 256(a); rules.json deployment)', 'a blow in ' + T.firstBlow + ' fights; shots on a first turn in ' + (T.firstHit - T.firstBlow) + ' (allowed: the gap is for melee)');
const B = T.byKind.beasts || { out: 0, men: 1 };
leg(B.out / B.men >= 0.95, '*** E4 AGAINST BEASTS TOO *** (rule 256(a): \'things that can traverse farther than a human\')', B.out + ' of ' + B.men + ' (' + pct(B.out, B.men) + ')');
leg(T.broke === 0, 'E5 nothing broke', T.broke + ' broke' + (T.broke ? ': ' + JSON.stringify(T.worst.filter(w => w.broke).slice(0, 2)) : ''));
console.log('=== AN EARLY RETREAT GETS OUT GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
