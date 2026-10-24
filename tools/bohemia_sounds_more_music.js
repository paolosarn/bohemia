#!/usr/bin/env node
/* BOHEMIA -- MORE MUSIC, MADE IN HIS SONGS' OWN MACHINE, WITH THE MACHINE PARTY PLAYING ALONG
   (SOUNDS, 10/24/26, row [more music, on the one beat], part two).

   RULE 158(d), PAOLO 10/24: 'a big thing is we need more music'. SOUNDS makes more songs in his songs' own machine
   (rule 119) and in the vibe of his OVERWORLD NIGHT category and REPO MAN THE MACHINE PARTY; a new song waits in the VOTE
   tab until he says it joins (rule 122(d)).

   A SONG HERE IS ONE ROW in the shape of his MLOOPS rows, a sibling of one of his OVERWORLD NIGHT songs, the way his
   night songs were made (REPO MAN, SLOW BLEED, THE VAULT and THE PIT BOSS IS GONE are one family that differs in three to
   five fields). DESIGNS below names the parent and the two to five fields that change, and for every changed field the
   CANON song it is taken from; 'make' refuses a value that canon song does not hold, so a new song can only be built from
   values he already said yes to. No voice, no kit and no form is new: his engine (MUS.playStep, synthV, drumV, his
   SONG_ARR form and SONG_ROOT moves) plays the row, pushed into MLOOPS in the page's memory and popped, never on disk.
   His engine draws the tune from the name's length, the root and the scale, so a new name over a new scale is a new tune.

   THE MACHINE PARTY PLAYS ALONG (his YES, 10/19): engine/bohemia_machine_party.js with REPO MAN's own machine, number
   for number (the train coupling on his kick, the old clock on his hat, four to the bar in D, steel every other bar, the
   motor), the motor moved into the new song's key (machine.motor.transpose), in the concrete hall on the worn tape.

     node tools/bohemia_sounds_more_music.js make            writes slices/vote/songs/<slug>.json for every design
     node tools/bohemia_sounds_more_music.js record <slug>   renders the song (A: the machine party, hall and tape) and
                                                             his two canon songs beside it, the way the map plays them
     node tools/bohemia_sounds_more_music.js pages           writes each song's card page (A new, B his parent, C his
                                                             second song, STOP) and the card into the song's file

   Nothing in the alpha changes on disk (the song lock proves it). Gate: gates/more_music_gate.js.
*/
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const SONGS = path.join(ROOT, 'slices', 'vote', 'songs');
const HISD = path.join(SONGS, 'his_night_songs');        /* his canon songs as the map plays them, recorded once, shared */
const MADE = '10/24';

/* the eight fields a row can carry that make a song; n and acc are its name and its colour in the MUSIC tab */
const NIGHT = ['REPO MAN', 'GHOST IN THE GRID', 'SLOW BLEED', 'SATELLITE PRAYER', 'SLOW CREEP', 'CAMPFIRE CONFESSION', 'THE VAULT', 'THE PIT BOSS IS GONE', 'THE ORGAN IN THE DROWNED CHAPEL'];

/* THE DESIGNS. parent: an OVERWORLD NIGHT song. second: another of his songs for the card's C (rule 119(c)).
   set: field -> [value, canon song it is taken from, why]. Everything not in set is the parent's, as it is. */
const DESIGNS = [
  { name: 'THE METER READER', parent: 'REPO MAN', second: 'SLOW BLEED',
    story: 'the man who still comes round to read the meter on houses that have had no power for a year',
    set: {
      'inst.l': ['brokenkeys', 'PAWNSHOP PSALM', 'the pawnshop\'s piano with keys that stick and die: REPO MAN\'s cold piano, after somebody pawned it'],
      'am': ['dreadbed', 'THE PIT BOSS IS GONE', 'the dread bed his PIT BOSS hums under beat one, in place of the dead satellite'],
      'acc': ['#b09048', 'PAWNSHOP PSALM', 'its colour in the MUSIC tab, the lead\'s song\'s'] } },
  { name: 'THE SUBSTATION HUMS ALONE', parent: 'GHOST IN THE GRID', second: 'REPO MAN',
    story: 'a power substation nobody works at any more, still humming in the dark, the wires crackling',
    set: {
      'inst.l': ['cracklewire', 'WHAT THE SLOT MACHINE REMEMBERS', 'a wire that crackles as it sings, in place of the signal fading'],
      'am': ['vacancyhum', 'THE LAST BROADCAST CORRODES', 'the empty building\'s hum under beat one'],
      'kit.h': ['sizzle', 'THE HYMN THE STATIC ATE', 'the sizzling hat, live current, on his GHOST\'s own hat steps'],
      'acc': ['#c85a3a', 'WHAT THE SLOT MACHINE REMEMBERS', 'its colour in the MUSIC tab, the lead\'s song\'s'] } },
  { name: 'THE LOBBY PIANO STILL PLAYS', parent: 'SLOW BLEED', second: 'THE VAULT',
    story: 'a hotel lobby with the water up to the carpet, and the player piano in the corner still going',
    set: {
      'inst.l': ['drownedpiano', 'THE SENDING', 'the drowned piano, in place of the rust lead'],
      'inst.b': ['undertowbass', 'THE SENDING', 'the undertow under it, in place of the grid'],
      'kit.h': ['ride', 'THE SENDING', 'a ride for the hat, the lobby\'s brass'],
      'acc': ['#5a7a8a', 'THE SENDING', 'its colour in the MUSIC tab, the lead\'s song\'s'] } },
  { name: 'THE CASHIER\'S CAGE', parent: 'THE VAULT', second: 'THE PIT BOSS IS GONE',
    story: 'the casino cashier\'s cage behind its bars, a machine still counting money that is worth nothing',
    set: {
      'inst.l': ['rotviola', 'THE LAST DEALER FOLDS', 'the rotting viola from his casino song, in place of the dusk organ (A GASP IN THE VAULT\'s paper lung was tried first and measured 34 dB under the mix on a phone, his VAULT\'s tune 17: buried, so it went)'],
      'am': ['chapelbreath', 'A GASP IN THE VAULT', 'a held breath under beat one, in place of the ledger bell'],
      'mel': ['call', 'REPO MAN', 'his REPO MAN\'s call and answer, in place of the long notes'],
      'acc': ['#8a3a4a', 'THE LAST DEALER FOLDS', 'its colour in the MUSIC tab, the lead\'s song\'s'] } },
  { name: 'THE MALL AFTER CLOSING', parent: 'THE ORGAN IN THE DROWNED CHAPEL', second: 'GHOST IN THE GRID',
    story: 'the mall at night with the lights off, and the voice in the ceiling still announcing the floors',
    set: {
      'inst.l': ['atriumvox', 'THE VOICE THAT STILL ANNOUNCES FLOORS', 'the voice in the atrium\'s ceiling, in place of the hollow vowel'],
      'am': ['deadsat', 'REPO MAN', 'his REPO MAN\'s dead satellite under beat one, in place of the dread bed'],
      'kick': [[0, 10], 'SLOW CREEP', 'his SLOW CREEP\'s kick: one, and the and of three'],
      'acc': ['#6a7f8e', 'THE VOICE THAT STILL ANNOUNCES FLOORS', 'its colour in the MUSIC tab, the lead\'s song\'s'] } },
  { name: 'THE LAST BUS TO HENDERSON', parent: 'SLOW CREEP', second: 'SATELLITE PRAYER',
    story: 'a bus stop on Boulder Highway at two in the morning, waiting on a bus that stopped running a year ago',
    set: {
      'inst.l': ['ghostflute', 'WHERE THE PROCESSION DROWNED', 'the ghost flute, in place of the rust lead'],
      'inst.b': ['abyssbass', 'WHERE THE PROCESSION DROWNED', 'the abyss bass under it, in place of the night pad'],
      'acc': ['#5a6a72', 'WHERE THE PROCESSION DROWNED', 'its colour in the MUSIC tab, the lead\'s song\'s'] } }
];

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const idOf = s => slug(s).replace(/_/g, '-');
const md5 = b => crypto.createHash('md5').update(b).digest('hex');
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* his rows, read from the alpha on disk (never written): MLOOPS and the canon marks */
function hisRows() {
  const s = fs.readFileSync(ALPHA, 'utf8');
  const a = s.indexOf('const MLOOPS=[');
  let i = a + 'const MLOOPS='.length, d = 0, j = i;
  for (; j < s.length; j++) { const c = s[j]; if (c === '[') d++; else if (c === ']') { d--; if (d === 0) break; } }
  const rows = (0, eval)(s.slice(i, j + 1).replace(/\/\*[\s\S]*?\*\//g, ''));
  const k = s.indexOf('const CANON_DEFAULTS='), cd = s.slice(k, s.indexOf('\n', k));
  const canon = new Set(); cd.replace(/'([^']+)#1':2/g, (m, n) => { canon.add(n); return m; });
  return { rows, canon };
}
const getF = (row, f) => f.split('.').reduce((o, k) => (o == null ? undefined : o[k]), row);
function setF(row, f, v) { const ks = f.split('.'); let o = row; ks.slice(0, -1).forEach(k => { o[k] = Object.assign({}, o[k]); o = o[k]; }); o[ks[ks.length - 1]] = JSON.parse(JSON.stringify(v)); }
const FIELDS = r => { const out = []; Object.keys(r).forEach(k => { if (k === 'n') return; if (r[k] && typeof r[k] === 'object' && !Array.isArray(r[k])) Object.keys(r[k]).forEach(k2 => out.push(k + '.' + k2)); else out.push(k); }); return out; };

/* the machine: REPO MAN's own, number for number, the motor moved into this song's key */
function machineFor(row) {
  const rm = JSON.parse(fs.readFileSync(path.join(SONGS, 'repo_man_the_machine_party.json'), 'utf8'));
  const m = JSON.parse(JSON.stringify(rm.machine));
  const tr = ((((row.root - 41) % 12) + 18) % 12) - 6;      /* his REPO MAN is on G (root 41); inside six semitones */
  m.motor.transpose = tr;
  m.motor.is = m.motor.is.replace('whining on G3', 'whining in this song\'s key (' + (tr >= 0 ? '+' : '') + tr + ' semitones from REPO MAN\'s G3)');
  m.from = 'slices/vote/songs/repo_man_the_machine_party.json (his YES 10/19, sounds-repo-man-the-machine-party-10-19), every number but the motor\'s key';
  return m;
}

function make() {
  const { rows, canon } = hisRows();
  const tunes = rows.map(r => [r.n.length, r.root, JSON.stringify(r.scale), r.mel || 'seed8'].join('|'));
  const made = [];
  for (const D of DESIGNS) {
    const P = rows.find(r => r.n === D.parent);
    if (!P || !canon.has(D.parent) || NIGHT.indexOf(D.parent) < 0) throw new Error(D.name + ': parent is not a canon OVERWORLD NIGHT song');
    if (!rows.find(r => r.n === D.second) || !canon.has(D.second)) throw new Error(D.name + ': second is not canon');
    const row = JSON.parse(JSON.stringify(P)); row.n = D.name;
    const prov = {}, changed = [];
    for (const f of Object.keys(D.set)) {
      const [v, from, why] = D.set[f], src = rows.find(r => r.n === from);
      if (!src || !canon.has(from)) throw new Error(D.name + ' ' + f + ': ' + from + ' is not a canon song');
      if (!deq(getF(src, f), v)) throw new Error(D.name + ' ' + f + ': ' + from + ' does not hold ' + JSON.stringify(v));
      if (deq(getF(P, f), v)) throw new Error(D.name + ' ' + f + ': the parent already has it');
      setF(row, f, v); prov[f] = [from, why]; if (f !== 'acc') changed.push(f);
    }
    if (changed.length < 2 || changed.length > 5) throw new Error(D.name + ': ' + changed.length + ' fields changed, his siblings differ in 2 to 5');
    FIELDS(row).forEach(f => { if (!prov[f]) prov[f] = [D.parent, 'his row, as it is']; });
    const tune = [row.n.length, row.root, JSON.stringify(row.scale), row.mel || 'seed8'].join('|');
    const twin = rows.filter((r, i) => tunes[i] === tune).map(r => r.n);
    if (twin.length) throw new Error(D.name + ': his engine would draw the same tune as ' + twin.join(', '));
    if (rows.find(r => r.n === D.name)) throw new Error(D.name + ': the name is taken');
    const id = idOf(D.name), file = path.join(SONGS, slug(D.name) + '.json');
    const old = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
    const song = {
      _readme: 'MORE MUSIC (SOUNDS 10/24/26, row [more music, on the one beat], rule 158(d); Paolo 10/24: \'a big thing is we need more music\'). One row in the shape of his MLOOPS rows, his ' + D.parent + '\'s own row with ' + changed.length + ' fields changed, each taken from one of his canon songs (provenance), played by his own engine with REPO MAN THE MACHINE PARTY\'s machine playing along (engine/bohemia_machine_party.js, the kit in slices/vote/songs/machine_party_kit/). Made by tools/bohemia_sounds_more_music.js; gate gates/more_music_gate.js. Never in MLOOPS on disk, never in the fence or CAT_DEFAULTS, until his YES (rule 122(d)).',
      id, name: D.name, made: MADE, lane: 'sounds', draft: true,
      parent: D.parent, beside: [D.parent, D.second], story: D.story,
      changed, row, provenance: prov,
      analog_horror_at_the_source: [
        'the tune is his engine\'s, drawn from the name, on ' + getF(row, 'inst.l') + ' (' + prov['inst.l'][0] + ')' + (changed.indexOf('inst.l') >= 0 ? '' : ', his'),
        'under every bar ' + getF(row, 'inst.b') + ', and on beat one of the core ' + (row.am || '(no accent voice)') + ': the rooms the song is set in, from his own voices',
        'the beat arrives late (no drums for the first eight bars on the map, his 9/12 rule) and his strip sections leave only the kick and the bass',
        'the machine is REPO MAN THE MACHINE PARTY\'s, real recordings of real machines (a train coupling, an electromechanical clock, steel, a washing machine\'s motor in the song\'s key), in one concrete hall on a worn tape: the wear is in what plays, no noise is added (NO SAND)'],
      machine: machineFor(row),
      takes: { A: { hall: true, tape: true } },
      card: old.card || null
    };
    fs.writeFileSync(file, JSON.stringify(song, null, 1) + '\n');
    made.push(D.name + ' (' + D.parent + ': ' + changed.join(', ') + ')');
  }
  console.log('made ' + made.length + ':\n  ' + made.join('\n  '));
}

/* ---------- record ---------- */
async function record(which) {
  const H = require(path.join(ROOT, 'tools', 'bohemia_sounds_his_machine.js'));
  const MPR = require(path.join(ROOT, 'tools', 'bohemia_sounds_machine_party_record.js'));
  const BARS = 32;
  const list = DESIGNS.filter(D => !which || slug(D.name) === which || idOf(D.name) === which);
  if (!list.length) throw new Error('no design ' + which);
  fs.mkdirSync(HISD, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'more_music_'));
  const { b, p, errs } = await H.openAlpha();
  await MPR.prepare(p);
  const measure = raws => JSON.parse(execFileSync('python3', ['-I', path.join(ROOT, 'tools', 'bohemia_sounds_his_machine_measure.py')].concat(raws), { encoding: 'utf8', maxBuffer: 64 << 20 }));
  const render = async (song, mode, only) => {
    const r = await MPR.pass(p, song, mode, BARS, true, only);
    if (r.err) throw new Error(song.name + ' ' + mode + ' ' + only + ': ' + r.err);
    const raw = path.join(tmp, slug(song.name || song.remakes) + '_' + mode + '_' + (only || 'full') + '.raw');
    fs.writeFileSync(raw, Buffer.from(r.b64, 'base64')); delete r.b64; r.raw = raw; return r;
  };
  const toMp3 = (raw, out, gdb) => {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', '44100', '-ac', '1', '-i', raw, '-af', 'volume=' + Math.pow(10, gdb / 20).toFixed(4), '-c:a', 'libmp3lame', '-b:a', '96k', out]);
    const d = out + '.dec.raw'; const dd = path.join(tmp, path.basename(d));
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', out, '-f', 's16le', '-ac', '1', '-ar', '44100', dd]); return dd;
  };
  /* his songs: at the engine's own level, gain 0 dB, recorded ONCE each and shared by every card. ONCE, MEASURED: his
     voices carry their own noise, so two renders of one song are two different files (his REPO MAN came out 7e1c86 and
     then 5da75e); a second card re-recording it would leave the first card's numbers about a file that is gone. So the
     first recording is kept with its numbers (his_night_songs/measured.json) and every later card reads it. */
  const HISM = path.join(HISD, 'measured.json');
  const his = fs.existsSync(HISM) ? JSON.parse(fs.readFileSync(HISM, 'utf8')) : {};
  const hisTake = async name => {
    const f = path.join(HISD, 'his_' + slug(name) + '.mp3');
    if (his[name] && fs.existsSync(f) && md5(fs.readFileSync(f)) === his[name].mp3_md5 && his[name].tune) return his[name];
    const r = await render({ remakes: name, name }, 'his', null), t = await render({ remakes: name, name }, 'his', 'tune');
    const [m, mt] = measure([r.raw, t.raw]);
    const dec = toMp3(r.raw, f, 0);
    his[name] = { file: path.relative(ROOT, f), mp3_md5: md5(fs.readFileSync(f)), bytes: fs.statSync(f).size, clipped_samples: r.clipped, render: m, heard: measure([dec])[0],
      tune: { phone_rms_db: mt.phone_rms_db, tune_on_a_phone_vs_the_mix_db: +(mt.phone_rms_db - m.phone_rms_db).toFixed(2) } };
    fs.writeFileSync(HISM, JSON.stringify(his, null, 1) + '\n');
    return his[name];
  };
  for (const D of list) {
    const t0 = Date.now();
    const SONGF = path.join(SONGS, slug(D.name) + '.json'), DIR = path.join(SONGS, slug(D.name));
    const song = JSON.parse(fs.readFileSync(SONGF, 'utf8'));
    fs.mkdirSync(DIR, { recursive: true });
    const shim = { name: song.name, row: song.row, machine: song.machine, takes: song.takes, remakes: song.parent };
    const full = await render(shim, 'A', null), tune = await render(shim, 'A', 'tune'), beat = await render(shim, 'A', 'beat');
    const whole = await MPR.pass(p, shim, 'A', 64, false, null);
    const P = await hisTake(song.parent), S2 = await hisTake(song.second || song.beside[1]);
    const [mf, mt, mb] = measure([full.raw, tune.raw, beat.raw]);
    /* THE LEVEL: the new song set to its parent's loudness through a phone's speaker (the louder take always sounds better) */
    let g = P.render.phone_rms_db - mf.phone_rms_db;
    if (mf.peak * Math.pow(10, g / 20) > 0.89) g = 20 * Math.log10(0.89 / mf.peak);
    g = +g.toFixed(2);
    const OUT = path.join(DIR, 'song.mp3');
    const dec = toMp3(full.raw, OUT, g), heard = measure([dec])[0];
    const kinds = {}; whole.mlog.forEach(x => { kinds[x[0]] = (kinds[x[0]] || 0) + 1; });
    const out = { id: song.id, name: song.name, parent: song.parent, beside: song.beside, row_md5: H.rowMd5(song.row), machine_md5: H.rowMd5(song.machine),
      tool: 'tools/bohemia_sounds_more_music.js', engine: 'engine/bohemia_machine_party.js', made: song.made, bars_recorded: BARS, page_errors: errs.length,
      song: { take: 'A', file: path.relative(ROOT, OUT), bytes: fs.statSync(OUT).size, mp3_md5: md5(fs.readFileSync(OUT)), gain_db: g, clipped_samples: full.clipped,
        schedule_64_bars: Object.assign(H.summarise(whole), { tune_semis: undefined }), machine_64_bars: kinds, form: whole.form,
        audio: Object.assign({}, heard, {
          tune_on_a_phone_vs_the_mix_db: +(mt.phone_rms_db - mf.phone_rms_db).toFixed(2),
          beat_on_a_phone_vs_the_mix_db: +(mb.phone_rms_db - mf.phone_rms_db).toFixed(2),
          beat_on_a_phone_db: +(mb.phone_rms_db + g).toFixed(2), tune_on_a_phone_db: +(mt.phone_rms_db + g).toFixed(2) }) },
      his: [P, S2].map((h, i) => ({ name: i ? (song.second || song.beside[1]) : song.parent, file: h.file, bytes: h.bytes, mp3_md5: h.mp3_md5, clipped_samples: h.clipped_samples, audio: h.heard,
        tune_on_a_phone_vs_the_mix_db: h.tune.tune_on_a_phone_vs_the_mix_db })),
      phone_rms_new_vs_parent_db: +(heard.phone_rms_db - P.heard.phone_rms_db).toFixed(2) };
    fs.writeFileSync(path.join(DIR, 'measured.json'), JSON.stringify(out, null, 1) + '\n');
    console.log(D.name + ' in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s: gain ' + g + ' dB, phone ' + heard.phone_rms_db + ' vs his ' + P.heard.phone_rms_db + ', tune vs mix ' + out.song.audio.tune_on_a_phone_vs_the_mix_db + ' (his ' + out.his[0].tune_on_a_phone_vs_the_mix_db + '), beat on a phone ' + out.song.audio.beat_on_a_phone_db + ', peak ' + heard.peak_db + ', clipped ' + full.clipped + ', machine ' + JSON.stringify(kinds));
  }
  await b.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}

/* THE SONG LOCK: every new song is a new_songs line with its file's hash and why, ON PURPOSE (gates/song_lock_gate.js);
   written for every song that has its card, so it cannot change after he hears it without this line changing too */
function lock() {
  const LF = path.join(ROOT, 'records', 'BOHEMIA_SONG_LOCK.json');
  const L = JSON.parse(fs.readFileSync(LF, 'utf8')); L.new_songs = L.new_songs || [];
  const did = [];
  for (const D of DESIGNS) {
    const sf = path.join(SONGS, slug(D.name) + '.json'); if (!fs.existsSync(sf)) continue;
    const song = JSON.parse(fs.readFileSync(sf, 'utf8')); if (!song.card) continue;
    const file = path.relative(ROOT, sf), line = {
      id: song.id, file, md5: md5(fs.readFileSync(sf)), made: '10/24/26', lane: 'sounds',
      why: 'ADDED ON PURPOSE (SOUNDS 10/24, row [more music, on the one beat], rule 158(d); Paolo 10/24: \'a big thing is we need more music\'): a new night song in his songs\' own machine (rule 119), his ' + song.parent + '\'s row with ' + song.changed.join(', ') + ' taken from his canon songs, REPO MAN THE MACHINE PARTY\'s machine playing along, 120 BPM. A new song beside his, none of his touched; never wired until his YES (rule 122(d)). In VOTE as ' + song.card.id + '; if it changes after he hears it, this hash changes in the same commit with a reason.' };
    const i = L.new_songs.findIndex(x => x.file === file);
    if (i >= 0) L.new_songs[i] = line; else L.new_songs.push(line);
    did.push(song.id);
  }
  fs.writeFileSync(LF, JSON.stringify(L, null, 2) + '\n');
  console.log('locked ' + did.length + ': ' + did.join(', '));
}

module.exports = { DESIGNS, hisRows, slug, idOf, getF, FIELDS, NIGHT };
if (require.main === module) {
  const cmd = process.argv[2];
  if (cmd === 'make') make();
  else if (cmd === 'record') record(process.argv[3]).catch(e => { console.error(e); process.exit(1); });
  else if (cmd === 'pages') require(path.join(ROOT, 'tools', 'bohemia_sounds_more_music_pages.js')).pages(DESIGNS);
  else if (cmd === 'lock') lock();
  else { console.log('make | record [slug] | pages'); process.exit(2); }
}
