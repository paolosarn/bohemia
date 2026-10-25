#!/usr/bin/env node
/* ============================================================================
   BOHEMIA -- MORE MUSIC GATE, NOW THE BURIAL (SOUNDS; built 10/24/26 for row [more music, on the one beat]; re-aimed
   10/25/26 by rule 166(a), row [every song its own song]).

   PAOLO 10/25: 'it's the same one for like seven songs bro and they use the same instruments... seven of the same songs
   with like one slightly thing different'. Rule 166(a): the six night songs of 10/24 (each one of his songs with two or
   three values changed, REPO MAN's machine under all six, the tune 12 to 21 dB under the mix) are dead: graveyard with a
   post-mortem, their VOTE cards down; a song made by changing a few values of another song never comes back under a new
   name. Post-mortem: graveyard/POSTMORTEM_THE_SIX_NIGHT_SONGS_10_24_26.txt.

   What this gate held on 10/24 (the six built only from values he had said yes to) is exactly what made them clones, so
   it holds the burial instead. For each of the six:
     NO CARD       not in the registry's items (a vote on one would stay, as history: none was ever cast)
     NO PAGE       no card page and no song file under slices/ (nothing the site publishes)
     NEVER WIRED   no row of it in the alpha or the demo (n:'NAME'), and its name a tombstone in gates/bohemia_graveyard.txt
     THE RECORD    its files and its page in graveyard/the_six_night_songs_10_24_26/, the song lock's line pointed there
                   (so the file cannot change quietly), the post-mortem naming it
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const G = 'graveyard/the_six_night_songs_10_24_26';
const SIX = [['THE METER READER', 'the_meter_reader'], ['THE SUBSTATION HUMS ALONE', 'the_substation_hums_alone'],
  ['THE LOBBY PIANO STILL PLAYS', 'the_lobby_piano_still_plays'], ["THE CASHIER'S CAGE", 'the_cashier_s_cage'],
  ['THE MALL AFTER CLOSING', 'the_mall_after_closing'], ['THE LAST BUS TO HENDERSON', 'the_last_bus_to_henderson']];
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && x !== '' ? '  [' + x + ']' : '')); };
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const REG = JSON.parse(read('records/target/BOHEMIA_VOTE_REGISTRY.json'));
const LOCK = JSON.parse(read('records/BOHEMIA_SONG_LOCK.json'));
const ALPHA = read('slices/BOHEMIA_ALPHA_0_9.html'), DEMO = read('slices/BOHEMIA_DEMO.html');
const TOMBS = read('gates/bohemia_graveyard.txt'), PM = read('graveyard/POSTMORTEM_THE_SIX_NIGHT_SONGS_10_24_26.txt');
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

for (const [name, sl] of SIX) {
  const id = 'sounds-' + sl.replace(/_/g, '-') + '-10-24', page = 'BOHEMIA_' + sl.toUpperCase() + '_10_24_26.html';
  console.log('-- ' + name);
  ok('NO CARD: not in the registry', !REG.items.some(x => x.id === id), id);
  ok('NO PAGE: no card page, no song file under slices/', !fs.existsSync(path.join(ROOT, 'slices', page)) && !fs.existsSync(path.join(ROOT, 'slices/vote/songs', sl + '.json')) && !fs.existsSync(path.join(ROOT, 'slices/vote/songs', sl)));
  const row = new RegExp("n:\\s*['\"]" + esc(name).replace("'", "\\\\?'") + "['\"]");
  ok('NEVER WIRED: no row of it in the alpha or the demo', !row.test(ALPHA) && !row.test(DEMO));
  ok('a tombstone in the graveyard registry', TOMBS.split('\n').some(l => l.includes(name.split("'")[0]) && /GRAVEYARD FINAL/.test(l) && /166\(a\)/.test(l)));
  const files = [G + '/' + sl + '.json', G + '/' + page, G + '/' + sl];
  ok('THE RECORD: its file, its page and its recordings in the graveyard', files.every(f => fs.existsSync(path.join(ROOT, f))), files.filter(f => !fs.existsSync(path.join(ROOT, f))).join(', '));
  const ln = (LOCK.new_songs || []).find(x => x.file === G + '/' + sl + '.json');
  ok('the song lock\'s line kept and pointed there, BURIED in its why', !!ln && /BURIED 10\/25/.test(ln.why || ''));
  ok('the post-mortem names it', PM.includes(name));
}
console.log('MORE MUSIC (THE BURIAL): ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
