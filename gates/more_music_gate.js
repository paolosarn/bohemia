#!/usr/bin/env node
/* ============================================================================
   BOHEMIA -- MORE MUSIC GATE (SOUNDS, 10/24/26, row [more music, on the one beat], part two)

   RULE 158(d), PAOLO 10/24: 'a big thing is we need more music'. SOUNDS makes more songs in his songs' own machine
   (rule 119) in the vibe of his OVERWORLD NIGHT category and REPO MAN THE MACHINE PARTY; a new song waits in the VOTE
   tab until he says it joins (rule 122(d)); no other song ever plays before his yes (rule 122).

   For every song tools/bohemia_sounds_more_music.js designs:
     HIS MACHINE   the row is one OVERWORLD NIGHT song's own row (the parent, canon) with 2 to 5 fields changed, and every
                   changed field is deep equal to the canon song its provenance names; every other field is the parent's;
                   its tune (name length, root, scale, melody kind) is none of his 128 tunes
     THE PARTY     the machine is REPO MAN THE MACHINE PARTY's, number for number, the motor moved into the song's key
                   (inside six semitones of his G); the main take in the hall on the tape
     120 BPM       recorded on his engine's own sixteenth (0.125 s), his 64-bar form (ARR) and key moves (RT)
     THE A/B       the song set to its parent's loudness through a phone (inside 0.5 dB), not clipped, its tune not
                   buried (no more than 3 dB under its parent's, or above -25 dB); the parent and a second song of his recorded beside it, the files the
                   numbers were taken from (md5)
     NEVER WIRED   not in MLOOPS on disk, not in CAT_DEFAULTS, no song row or song key of it in the alpha or the demo
     LOCKED        a line in the song lock's new_songs with the file's hash and ON PURPOSE
     VOTE          the card in the song's file says EYES AND EARS' line is owed, no dash, on a page that exists and plays
                   the three files; in the registry with a sha
   And the gate bites: a planted wrong value, a planted sixth change and a planted wired song each fail.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.dirname(__dirname);
const MM = require(path.join(ROOT, 'tools', 'bohemia_sounds_more_music.js'));
const H = require(path.join(ROOT, 'tools', 'bohemia_sounds_his_machine.js'));
const SONGS = path.join(ROOT, 'slices', 'vote', 'songs');
const md5 = b => crypto.createHash('md5').update(b).digest('hex');
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && x !== '' ? '  [' + x + ']' : '')); };

const { rows, canon } = MM.hisRows();
const ALPHA = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'), 'utf8');
const DEMO = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_DEMO.html'), 'utf8');
const CATD = (() => { const k = ALPHA.indexOf('const CAT_DEFAULTS='); return ALPHA.slice(k, ALPHA.indexOf('};', k)); })();
const LOCK = JSON.parse(fs.readFileSync(path.join(ROOT, 'records', 'BOHEMIA_SONG_LOCK.json'), 'utf8'));
const REG = JSON.parse(fs.readFileSync(path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
const RM = JSON.parse(fs.readFileSync(path.join(SONGS, 'repo_man_the_machine_party.json'), 'utf8'));
const tuneOf = r => [r.n.length, r.root, JSON.stringify(r.scale), r.mel || 'seed8'].join('|');
const TUNES = new Set(rows.map(tuneOf));

/* the row rule, as a function, so the gate can plant bad rows into it and watch it fail */
function rowRule(song) {
  const P = rows.find(r => r.n === song.parent), why = [];
  if (!P || !canon.has(song.parent) || MM.NIGHT.indexOf(song.parent) < 0) return ['the parent is not a canon OVERWORLD NIGHT song'];
  const fields = new Set(MM.FIELDS(P).concat(MM.FIELDS(song.row)));
  const diff = [...fields].filter(f => f !== 'acc' && !deq(MM.getF(P, f), MM.getF(song.row, f)));
  if (!deq(diff.slice().sort(), song.changed.slice().sort())) why.push('changed says ' + song.changed.join(',') + ' but the row differs in ' + diff.join(','));
  if (diff.length < 2 || diff.length > 5) why.push(diff.length + ' fields changed');
  diff.concat(['acc']).forEach(f => {
    const pv = song.provenance[f]; if (!pv) { why.push(f + ' has no provenance'); return; }
    const src = rows.find(r => r.n === pv[0]);
    if (!src || !canon.has(pv[0]) || !deq(MM.getF(src, f), MM.getF(song.row, f))) why.push(f + ' is not ' + pv[0] + '\'s');
  });
  return why;
}
function wiredRule(name, alpha, demo, catd) {
  const why = [];
  if (rows.some(r => r.n === name)) why.push('in MLOOPS');
  if (catd.indexOf("'" + name + "#") >= 0) why.push('in CAT_DEFAULTS');
  /* a song is wired where a song is named: a row (n:'NAME') or a song key ('NAME#1'); a name may be prose elsewhere
     (THE METER READER is also his side quest S01's name, and that is a quest, not a song playing) */
  const sung = s => s.indexOf("n:'" + name + "'") >= 0 || s.indexOf("'" + name + "#") >= 0 || s.indexOf('"' + name + '#') >= 0;
  if (sung(alpha)) why.push('a song in the alpha');
  if (sung(demo)) why.push('a song in the demo');
  return why;
}

for (const D of MM.DESIGNS) {
  const slug = MM.slug(D.name), sf = path.join(SONGS, slug + '.json');
  console.log(D.name);
  if (!fs.existsSync(sf)) { ok('the song file is there', false, path.relative(ROOT, sf)); continue; }
  const song = JSON.parse(fs.readFileSync(sf, 'utf8'));
  const P = rows.find(r => r.n === song.parent);
  /* HIS MACHINE */
  const rr = rowRule(song);
  ok('HIS MACHINE: ' + song.parent + '\'s row with ' + song.changed.length + ' fields changed (' + song.changed.join(', ') + '), each one a canon song\'s', rr.length === 0, rr.join('; ') || song.changed.map(f => song.provenance[f][0]).join(', '));
  ok('  the row\'s name is the song\'s, and its tune is none of his ' + rows.length + ' tunes', song.row.n === song.name && !TUNES.has(tuneOf(song.row)), tuneOf(song.row));
  ok('  the second song beside it is his and canon', song.beside[0] === song.parent && canon.has(song.beside[1]) && song.beside[1] !== song.parent, song.beside.join(' + '));
  /* THE PARTY */
  const m = JSON.parse(JSON.stringify(song.machine)), want = ((((song.row.root - 41) % 12) + 18) % 12) - 6;
  const tr = m.motor.transpose; delete m.motor.transpose; delete m.motor.is; delete m.from;
  const r0 = JSON.parse(JSON.stringify(RM.machine)); delete r0.motor.is;
  ok('THE PARTY: REPO MAN THE MACHINE PARTY\'s machine, number for number, the motor in this key (' + (tr >= 0 ? '+' : '') + tr + ')', deq(m, r0) && tr === want && Math.abs(tr) <= 6);
  ok('  the main take is in the hall on the tape', !!(song.takes && song.takes.A && song.takes.A.hall && song.takes.A.tape));
  /* 120 BPM and THE A/B */
  const mf = path.join(SONGS, slug, 'measured.json');
  if (!fs.existsSync(mf)) { ok('recorded (measured.json)', false); continue; }
  const M = JSON.parse(fs.readFileSync(mf, 'utf8'));
  ok('  the takes are of this row and this machine (measured.json\'s hashes)', M.row_md5 === H.rowMd5(song.row) && M.machine_md5 === H.rowMd5(song.machine));
  const f = M.song.form || {};
  ok('120 BPM: his engine\'s sixteenth (0.125 s), his 64-bar form and key moves', f.sd === 0.125 && f.arr && f.arr.length === 16 && f.rt && f.rt.length === 16, f.sd + ' s, ' + (f.arr || []).join(''));
  const sm = M.song, hp = M.his[0], h2 = M.his[1];
  const files = [sm].concat(M.his).every(x => fs.existsSync(path.join(ROOT, x.file)) && md5(fs.readFileSync(path.join(ROOT, x.file))) === x.mp3_md5 && x.clipped_samples === 0);
  ok('THE A/B: the new song, his ' + song.parent + ' and his ' + song.beside[1] + ', the files the numbers came from, none clipped', files && hp.name === song.parent && h2.name === song.beside[1], [sm, hp, h2].map(x => path.basename(x.file)).join(' '));
  ok('  as loud as his ' + song.parent + ' through a phone (inside 0.5 dB)', Math.abs(M.phone_rms_new_vs_parent_db) <= 0.5, M.phone_rms_new_vs_parent_db + ' dB');
  /* NOT BURIED: no more than 3 dB deeper under the mix than its parent's tune, or no deeper than -25 dB (his GHOST IN THE
     GRID's tune sits at -24.7, the deepest of his night tunes that still reads as a tune). Measured first: A GASP IN THE
     VAULT's paper lung put THE CASHIER'S CAGE's tune 34 dB under (his VAULT 17), so the lead was changed. */
  const tn = sm.audio.tune_on_a_phone_vs_the_mix_db, tp = hp.tune_on_a_phone_vs_the_mix_db;
  ok('  its tune not buried on a phone (no more than 3 dB under his ' + song.parent + '\'s, or above -25 dB)', tn >= tp - 3 || tn >= -25, tn + ' vs his ' + tp + ' dB');
  ok('  the machine played: the press, the clock, the party, the steel, the motor', ['press', 'relay', 'party', 'clank', 'motor'].every(k => (sm.machine_64_bars[k] || 0) > 0), JSON.stringify(sm.machine_64_bars));
  /* NEVER WIRED */
  const w = wiredRule(song.name, ALPHA, DEMO, CATD);
  ok('NEVER WIRED: not in MLOOPS, not in CAT_DEFAULTS, no song row or song key of it in the alpha or the demo', w.length === 0, w.join(', '));
  /* LOCKED */
  const ns = (LOCK.new_songs || []).find(x => x.file === path.relative(ROOT, sf));
  ok('LOCKED: a new_songs line with this file\'s hash, ON PURPOSE', !!ns && ns.md5 === md5(fs.readFileSync(sf)) && /ON PURPOSE/.test(ns.why || ''), ns ? ns.md5 : 'no line');
  /* VOTE */
  const c = song.card;
  ok('VOTE: the card says EYES AND EARS\' line is owed, and has no dash', !!c && c.why.indexOf('EYES AND EARS\' line is owed') >= 0 && !/—|–/.test(c.title + c.why + c.options.join('')), c ? c.id : 'no card');
  const pg = c && path.join(ROOT, 'slices', c.show.src), html = pg && fs.existsSync(pg) ? fs.readFileSync(pg, 'utf8') : '';
  const rel = x => path.relative(path.join(ROOT, 'slices'), path.join(ROOT, x)).split(path.sep).join('/');
  ok('  its page is there and plays the three files', !!html && [sm, hp, h2].every(x => html.indexOf(rel(x.file)) >= 0), c && c.show.src);
  const it = REG.items.find(i => i.id === (c && c.id));
  ok('  in the registry with a sha, the page its show', !!it && !!it.sha && it.kind === 'song' && it.show && it.show.src === c.show.src, it ? it.sha : 'not registered');
}

/* THE GATE BITES */
console.log('the gate bites');
const one = JSON.parse(fs.readFileSync(path.join(SONGS, MM.slug(MM.DESIGNS[0].name) + '.json'), 'utf8'));
const bad1 = JSON.parse(JSON.stringify(one)); bad1.row.inst.l = 'nosuchvoice';
ok('a planted value no canon song holds fails', rowRule(bad1).length > 0);
const bad2 = JSON.parse(JSON.stringify(one)); ['root', 'wave', 'swing', 'feel'].forEach((k, i) => { bad2.row[k] = [40, 'square', 0.3, 'drive'][i]; });
ok('a planted pile of changes fails', rowRule(bad2).length > 0);
ok('a planted wired song fails', wiredRule(one.name, ALPHA + " {n:'" + one.name + "'}", DEMO, CATD).length > 0 && wiredRule(one.name, ALPHA, DEMO, CATD + "'" + one.name + "#1':['OVERWORLD NIGHT']").length > 0);

console.log('\nMORE MUSIC: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
