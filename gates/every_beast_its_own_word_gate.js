#!/usr/bin/env node
/* EVERY BEAST ITS OWN WORD (COMBAT FOUR 11/26, ask row 743, FOUND BY BESTIARY 2: 'A HELD FINGER ON ANY BEAST SAYS TEETH ... IT BITES, AND IT
   BITES AGAIN': the bison's and the horse's sweep, the goat's headbutt, the bull's gore, the sloth's uproot and the ghost's touch all 'bit').
   The fight's own rules, headless (tools/bohemia_fight_headless.js), every racial attack row in records/target/bb/beast_attacks.json read
   through FIGHT.wlineOf, the word the held finger's card and the man's sheet print:
     W1 A BITE IS TEETH: every attack that bites (its id or name says bite or gorge) reads TEETH with the class's line
     W2 NOTHING ELSE BITES: every other attack reads a word that is not TEETH and no line that says it bites
     W3 EVERY BEAST AND THE GHOST: each enemy in beast_attacks.json by_enemy gets a word for every attack it has (none empty)
     W4 HIS FISTS: the fists his empty-gunned man fights with (rule 478) read FISTS, never TEETH
     W5 ANOTHER CLASS AS BEFORE: a pistol's and a club's card word is their class row's own
     planted: the table taken off (every racial attack TEETH and 'it bites' again) is caught
   Run: node gates/every_beast_its_own_word_gate.js */
'use strict';
const path = require('path'), fs = require('fs'), ROOT = path.join(__dirname, '..');
const HL = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const check = (ok, name, detail) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + detail); };
const store = () => { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; };
const BA = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/beast_attacks.json'), 'utf8'));
function read(F) {
  const out = BA.rows.map(r => { const L = F.wlineOf(Object.assign({}, r)); return { id: r.id, name: r.name, word: L.name, line: L.line || '', hands: L.hands }; });
  return out;
}
const bites = r => /bite|gorge/i.test(r.id + ' ' + r.name);
(function main() {
  const E = HL.engine({ extra: { localStorage: store() } }), F = E.FIGHT;
  const R = read(F);
  const b = R.filter(bites), nb = R.filter(r => !bites(r));
  const w1 = b.filter(r => r.word !== 'TEETH' || !/bites/i.test(r.line));
  check(b.length > 0 && !w1.length, 'W1', 'A BITE IS TEETH: ' + b.length + ' biting attacks, ' + (b.length - w1.length) + ' read TEETH with the line' + (w1.length ? ' (WRONG: ' + w1.map(r => r.id + '=' + r.word).join(', ') + ')' : ''));
  const w2 = nb.filter(r => r.word === 'TEETH' || /bite/i.test(r.line) || /bite/i.test(r.hands || ''));
  const words = {}; nb.forEach(r => { (words[r.word] = words[r.word] || []).push(r.name); });
  check(nb.length > 0 && !w2.length, 'W2', 'NOTHING ELSE BITES: ' + nb.length + ' other attacks; ' + Object.entries(words).map(([k, v]) => k + ' (' + v.slice(0, 3).join(', ') + (v.length > 3 ? ' +' + (v.length - 3) : '') + ')').join('; ') + (w2.length ? '; STILL BITING: ' + w2.map(r => r.id).join(', ') : ''));
  const byE = BA.by_enemy || {}, ids = Object.keys(byE), miss = [];
  ids.forEach(e => { const list = [].concat(byE[e] || []).map(x => typeof x === 'string' ? x : (x && (x.id || x.attack))).filter(Boolean);
    list.forEach(a => { const row = BA.rows.find(r => r.id === a); const L = row ? F.wlineOf(Object.assign({}, row)) : null; if (!L || !L.name) miss.push(e + ':' + a); }); });
  check(ids.length > 0 && !miss.length, 'W3', 'EVERY BEAST AND THE GHOST: ' + ids.length + ' enemies with racial attacks, every attack a word' + (miss.length ? ' (NONE FOR ' + miss.slice(0, 4).join(', ') + ')' : ''));
  const fistsRow = BA.rows.find(r => r.id === 'hand_to_hand_attack_5'), fists = F.wlineOf(Object.assign({}, fistsRow, { id: 'fists', name: 'Fists', fists: true }));
  check(fists.name === 'FISTS', 'W4', 'HIS FISTS: his empty-gunned man\'s fists read ' + fists.name);
  const pistol = F.wlineOf({ id: 'snub_revolver', name: 'Snub Revolver', class: 'dagger' }), club = F.wlineOf({ id: 'bludgeon', name: 'Bludgeon', class: 'mace' });
  const WL = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/weapon_lines.json'), 'utf8')).rows;
  check(pistol.name === WL.dagger.name && club.name === WL.mace.name && pistol.line === WL.dagger.line, 'W5', 'ANOTHER CLASS AS BEFORE: a pistol reads ' + pistol.name + ', a club ' + club.name + ' (their class rows\' own)');
  /* plant: the table taken off */
  const P = HL.engine({ patch: rules => rules.replace("if (!b || !Array.isArray(L.by_attack)) return L;", 'if (true) return L;'), extra: { localStorage: store() } });
  const PR = read(P.FIGHT).filter(r => !bites(r) && (r.word === 'TEETH' || /bite/i.test(r.line)));
  check(PR.length > 0, 'W2p', 'planted: the table taken off, ' + PR.length + ' non-biting attacks read TEETH and \'it bites\' again (caught)');
  console.log('EVERY BEAST ITS OWN WORD: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
