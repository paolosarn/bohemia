#!/usr/bin/env node
/* BOHEMIA -- BOSSES gate, 11/27, rule 493(c) (Paolo 11/27: 'I have five combat people [that] were absolute killers and there's no more
   challenges, nothing else to do'; the routine: 'the hard places a strong company goes looking for: the bosses and their lairs, found by
   a sign, built for a strong crew (bosses 10 and up sized for five killers at their best), each guarding a prize only the hard thing
   gives... Battle Brothers' legendary places as the model'). Records: records/BOHEMIA_BOSSES_THE_HARD_PLACES_11_27_26.md.

     D1  every boss from the 10th to the 18th has a lair: seven guards of his own people (every kind a real row of the bestiary), one of
         them a champion, so about eleven stand round him (Battle Brothers' two to one against a company of five), and a hoard that grows
         up the ladder (300 to 540 batteries)
     F1  THE PLATE, played for real (found by his sign, the nine before him fallen the quick way): his fight stands him, his crew and
         his lair's seven (11 men)
     H1  his fall pays his hoard once, through the purse's own credit, and his card says it ('HIS WAGON'S STRONGBOX: +300 BATTERIES')
   Planted fails for each. One phone, the fight on AUTO at the fight's own 4x, under ten minutes, run in the foreground. */
'use strict';
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const ROWS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/boss_act_one.json'), 'utf8')).bosses;
const KINDS = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/enemies.json'), 'utf8')).rows.map(r => r.id));
const HARD = ROWS.slice(9, 18);
const D1 = (rows) => { let last = 0; return rows.length === 9 && rows.every(b => { const L = b.lair; if (!L || !Array.isArray(L.guards)) return false;
  const n = L.guards.reduce((t, g) => t + (g.count | 0), 0), champ = L.guards.some(g => /_champion$/.test(g.kind)), real = L.guards.every(g => KINDS.has(g.kind));
  const grows = (L.haul | 0) > last; last = L.haul | 0; return n === 7 && champ && real && grows && 1 + (b.crew || []).length + n >= 10; }); };
console.log('\nTHE HARD PLACES (rule 493(c))\n');
ok('D1 bosses 10 to 18 each have a lair: seven of his own a tier up, a champion among them, about eleven round him, a hoard growing up the ladder',
   D1(HARD), HARD.map(b => b.n + ' ' + (1 + (b.crew || []).length + (b.lair ? b.lair.guards.reduce((t, g) => t + g.count, 0) : 0)) + ' men, ' + (b.lair ? b.lair.haul : 0)).join('; '));
const pl = JSON.parse(JSON.stringify(HARD)); pl[2].lair.guards = pl[2].lair.guards.filter(g => !/_champion$/.test(g.kind)).concat([{ kind: 'brigand_thug', count: 1 }]);
ok('P1 planted: a lair with no champion turns D1 red', !D1(pl), pl[2].n);
const out = fs.mkdtempSync(path.join(os.tmpdir(), 'hardplaces-'));
cp.spawnSync('node', [path.join(ROOT, 'tools/bohemia_bosses_the_whole_ladder_11_26_26.js'), 'phone_portrait', out],
  { env: Object.assign({}, process.env, { LADDER_ONLY: 'THE PLATE', LADDER_THROTTLE: '1', LADDER_SPEED: '4' }), encoding: 'utf8', timeout: 540000 });
let x = null; try { x = fs.readFileSync(path.join(out, 'ladder.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l)).filter(r => r.n === 'THE PLATE' && r.ok)[0]; } catch (e) {}
const row = ROWS.filter(b => b.n === 'THE PLATE')[0], want = 1 + row.crew.length + row.lair.guards.reduce((t, g) => t + g.count, 0);
const F1 = (q) => !!q && q.ok.S && q.board && q.them0 === want;
const H1 = (q) => !!q && !!q.lair && q.lair.paid === row.lair.haul && typeof q.cardText === 'string' && q.cardText.indexOf('+' + row.lair.haul + ' BATTERIES') >= 0;   /* his card's own words as he reads them */
ok('F1 THE PLATE, played for real: his fight stands ' + want + ' (him, his crew, his lair)', F1(x), x ? x.them0 + ' of theirs, found ' + x.ok.S : 'not walked');
ok('P2 planted: a fight with his old four turns F1 red', !F1(x && Object.assign({}, x, { them0: 4 })), '4');
ok('H1 his fall pays his hoard once and his card says it', H1(x), x ? JSON.stringify({ lair: x.lair, card: (x.cardText || '').slice(-90) }) : 'not walked');
ok('P3 planted: a hoard never paid turns H1 red', !H1(x && Object.assign({}, x, { lair: { paid: 0 } })), 'unpaid');
try { fs.rmSync(out, { recursive: true, force: true }); } catch (e) {}
console.log('\nTHE HARD PLACES: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
