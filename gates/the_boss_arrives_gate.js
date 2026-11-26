#!/usr/bin/env node
/* BOHEMIA -- BOSSES gate, 11/26, rule 482 (Paolo 11/26: 'More cooking up cleaning up improving things we're already doing'; the
   coordinator's routine: 'make the first three he meets feel like bosses: the sign that leads to him, his entrance, his look, his fight's
   moment, what changes on the map when he falls'). THE POT, THE TAP and THE FILTER, each played for real in one new game on the demo
   upright (tools/bohemia_bosses_the_whole_ladder_11_26_26.js, LADDER_ONLY the three, the CPU unslowed), and read from what it saw:

     L1  the sign leads to him: the first time his sign is read the camera goes to his place, holds, comes back (go > hold > back), and
         only then is the card read out (__THE_SIGN_LEADS_TO_HIM__, slices/bohemia_bosses.js)
     E1  his entrance: the tape's lower third with HIS name and HIS title from his row, played once the fight is the thing on top
         (slices/bohemia_boss_entrance.js; measured 11/26: it had played unseen behind the map's zoom down)
     P1  his look: his name rides over his head on the glass
     M1  his moment: once, at half his blood, his own tip from his card; then his fall: struck through, DOWN, the tape stopped
     N1  nothing of it takes a tap (its layer is pointer-events none)
     W1  and he is still found by his sign, fought to LEAVE, and his map changes (the walk's S, F, M, E)
   Planted fails for each. One phone, about 6 minutes. */
'use strict';
const path = require('path'), fs = require('fs'), os = require('os'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const ROWS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/boss_act_one.json'), 'utf8')).bosses;
const THREE = ['THE POT', 'THE TAP', 'THE FILTER'];
console.log('\nTHE BOSS ARRIVES (rule 482): ' + THREE.join(', ') + ', played for real on the demo upright\n');
const out = fs.mkdtempSync(path.join(os.tmpdir(), 'bossarrives-'));
const r = cp.spawnSync('node', [path.join(ROOT, 'tools/bohemia_bosses_the_whole_ladder_11_26_26.js'), 'phone_portrait', out],
  { env: Object.assign({}, process.env, { LADDER_ONLY: THREE.join(','), LADDER_THROTTLE: '1' }), encoding: 'utf8', timeout: 1500000 });
let got = [];
try { got = fs.readFileSync(path.join(out, 'ladder.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l)).filter(x => THREE.indexOf(x.n) >= 0 && x.ok); } catch (e) {}
const L1 = (x) => x && x.leadCam === 'go>hold>back';
const E1 = (x, row) => x && x.entrance && x.entrance.entrance && x.entrance.entrance.name === row.boss.name && x.entrance.entrance.title === row.boss.title;
const P1 = (x) => x && x.entrance && x.entrance.plate && x.entrance.plate.on && x.entrance.plate.name === x.n;
/* his moment shows at half; a man killed (or run off) from above half in one blow has none, and says so (f). His fall is owed whenever the
   fight ends won, by AUTO or by the walk's checker (which ends a fight AUTO lost as won so the ladder goes on); a fight truly lost (no
   checker) shows no fall */
const M1 = (x, row) => { const E = x && x.entranceEnd; if (!x || !E) return false;
  const won = x.auto === 'won' || !!x.checker;
  if (!won) return !E.fall;
  if (!E.fall || E.fall.name !== row.boss.name) return false;
  return E.moment ? E.moment.tip === row.tip && /^entrance>moment>fall$/.test(x.shown || '') : x.shown === 'entrance>fall' && E.f > 0.5; };
const N1 = (x) => x && x.layer && x.layer.pe === 'none';
const W1 = (x) => x && x.ok.S && x.ok.F && x.ok.M && x.ok.E;
ok('the walk played the three', got.length === 3, got.map(x => x.n).join(', ') || (r.stdout || '').split('\n').slice(-4).join(' | '));
for (const n of THREE) {
  const x = got.filter(g => g.n === n)[0], row = ROWS.filter(b => b.n === n)[0];
  ok('L1 ' + n + ': his sign leads to his place (the camera goes, holds, comes back), then the card', L1(x), x && x.leadCam);
  ok('E1 ' + n + ': his entrance, his name and his title, once the fight is on top', E1(x, row), x && JSON.stringify(x.entrance && x.entrance.entrance));
  ok('P1 ' + n + ': his name rides over his head on the glass', P1(x), x && JSON.stringify(x.entrance && x.entrance.plate));
  ok('M1 ' + n + ': his moment at half with his own tip, then his fall' + (x && x.auto !== 'won' ? ' (AUTO lost him; the walk\'s checker won it, so his fall is owed)' : ''), M1(x, row), x && (x.shown + ' ' + JSON.stringify(x.entranceEnd && { moment: x.entranceEnd.moment, fall: x.entranceEnd.fall })));
  ok('N1 ' + n + ': none of it takes a tap', N1(x), x && JSON.stringify(x.layer));
  ok('W1 ' + n + ': still found by his sign, fought to LEAVE, his map changed, on the glass', W1(x), x && JSON.stringify(x.ok));
}
const x0 = got[0], row0 = ROWS.filter(b => b.n === (x0 && x0.n))[0] || ROWS[0];
const bad = (o) => Object.assign({}, x0 || {}, o);
ok('P2 planted: a sign that never led (go > back) turns L1 red', !L1(bad({ leadCam: 'go>back' })), 'go>back');
ok('P3 planted: an entrance with another man\'s name turns E1 red', !E1(bad({ entrance: { entrance: { name: 'SOMEBODY', title: row0.boss.title } } }), row0), 'SOMEBODY');
ok('P4 planted: a plate off the glass turns P1 red', !P1(bad({ entrance: { plate: { on: false, name: x0 && x0.n } } })), 'off');
ok('P5 planted: a won fight whose fall had no moment, though he was under half, turns M1 red', !M1(bad({ auto: 'won', shown: 'entrance>fall', entranceEnd: { f: 0.3, fall: { name: row0.boss.name } } }), row0), 'entrance>fall at 0.3');
ok('P7 planted: a truly lost fight (no checker) that showed his fall turns M1 red', !M1(bad({ auto: 'lost', checker: null, entranceEnd: { fall: { name: row0.boss.name } } }), row0), 'a fall on a lost fight');
ok('P8 planted: a won fight with no fall turns M1 red', !M1(bad({ auto: 'won', shown: 'entrance>moment', entranceEnd: { moment: { tip: row0.tip } } }), row0), 'no fall');
ok('P6 planted: a layer that takes taps turns N1 red', !N1(bad({ layer: { pe: 'auto' } })), 'auto');
try { fs.rmSync(out, { recursive: true, force: true }); } catch (e) {}
console.log('\nTHE BOSS ARRIVES: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
