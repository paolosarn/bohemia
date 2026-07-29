// BOHEMIA SFX GATE (7/29/26) — the SFX factory's laws, held in code.
//
// This is the fast half. gates/sfx_render_gate.py is the other half and it
// measures actual audio in a real browser; this one holds the things that are
// true of the SPEC, the GENERATOR and the SHIPPED SURFACE, and it holds them in
// about a second so nobody is tempted to skip it.
//
// WHAT IT HOLDS
//   1. ONE CANONICAL BODY: engine/bohemia_sfx.js is what the alpha actually
//      carries, byte for byte (ENGINE SYNC LAW's own gate proves uniqueness of
//      the module; this proves the alpha is not carrying a stale copy).
//   2. SCREECH LAW inside the SFX code: no createDelay, no createConvolver.
//      Nothing feeds back, nothing rings by loop. (7/8 incident.)
//   3. ONE AUDIOCONTEXT, THE PARENT'S: the SFX code never constructs one. A
//      second audio engine is banned by the SOUNDS lane intent, and iOS stops
//      making sound entirely after a handful of contexts.
//   4. 120 BPM LAW / EVERY DURATION IS A NOTE: BEAT is 0.5s, the grid is a
//      16th of a beat, and every one of the 60 candidates lands on it —
//      attack, hold, decay, the pitch jump and every extra hit.
//   5. THE SPEC IS THE ONLY VOCABULARY: every candidate carries every SPEC
//      field and invents none. A parameter that is not in the table cannot
//      reach a sound.
//   6. THE GENERATOR IS DETERMINISTIC: cook twice, same 60 vectors. A verdict
//      is worthless if candidate 3 is a different sound tomorrow.
//   7. CANDIDATE 0 IS THE PLAIN READING of every recipe, un-jittered, so "none
//      of these" can never mean "you never played me the straight one".
//   8. MECHANISM-MINE / CONTENTS-PAOLO'S: the bank is EMPTY, in the engine and
//      in the shipped alpha, and play() on an unbanked event is silent. Any
//      line that ever lands in the bank file must name the verdict file it
//      came from.
//   9. THE JUDGE SURFACE IS REALLY IN THE MUSIC TAB and really has the verdict
//      workflow on it: thumbs, a note per sound, a comment box at the bottom,
//      SUN MODE, and an export that is .txt (Paolo 7/4: iOS blanks .json on a
//      chat share).
const fs = require('fs'), path = require('path');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };

const ROOT = path.join(__dirname, '..');
const ENGINE = path.join(ROOT, 'engine/bohemia_sfx.js');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const BANK = path.join(ROOT, 'banks/BOHEMIA_SFX_BANK_7_29_26.txt');

ok('the engine body exists', fs.existsSync(ENGINE));
ok('the ONE alpha exists', fs.existsSync(ALPHA));
if (!fs.existsSync(ENGINE) || !fs.existsSync(ALPHA)) {
  console.log(`\n=== SFX GATE: ${p} passed, ${f} failed ===`);
  process.exit(1);
}
const engine = fs.readFileSync(ENGINE, 'utf8');
const alpha = fs.readFileSync(ALPHA, 'utf8');
const S = require(ENGINE);

// 1. one canonical body, and it is the one that shipped
ok('the alpha carries the SFX mount', alpha.indexOf('BOHEMIA SFX FACTORY MOUNT') >= 0);
ok('the alpha carries engine/bohemia_sfx.js VERBATIM (no stale inline copy)',
   alpha.indexOf(engine) >= 0);

// isolate the SFX code out of the alpha for the law sweeps, so the music
// studio's own voices are not on trial here
const mi = alpha.indexOf('<!-- BOHEMIA SFX FACTORY MOUNT');
const mj = alpha.indexOf('<!-- /BOHEMIA SFX FACTORY MOUNT');
const mount = (mi >= 0 && mj > mi) ? alpha.slice(mi, mj) : '';
ok('the mount block is findable as one piece', mount.length > 1000);

// 2. SCREECH LAW
for (const [name, src] of [['engine', engine], ['the shipped mount', mount]]) {
  ok('SCREECH: no createDelay in ' + name, !/createDelay\s*\(/.test(src));
  ok('SCREECH: no createConvolver in ' + name, !/createConvolver\s*\(/.test(src));
}

// 3. ONE AUDIOCONTEXT, THE PARENT'S
ok('the engine never constructs an AudioContext',
   !/new\s+(window\.)?(webkit)?AudioContext/i.test(engine));
ok('the judge surface never constructs an AudioContext',
   !/new\s+(window\.)?(webkit)?AudioContext/i.test(mount));
ok('the judge surface takes the studio\'s context (MUS.AC) and master bus (MUS.MAST)',
   /MUS\.AC/.test(mount) && /MUS\.MAST/.test(mount));

// 4/5/6/7. the batch itself
ok('BEAT is 120 BPM (0.5s)', S.BEAT === 0.5);
ok('the grid is a 16th of a beat', Math.abs(S.TICK - S.BEAT / 16) < 1e-12);
ok('12 game moments', S.EVENTS.length === 12);
S.EVENTS.forEach(E => {
  ok('event ' + E.ev + ' has a label for the judge card', !!E.label && E.label.length > 2);
  ok('event ' + E.ev + ' says what it is FOR', !!E.why && E.why.length > 8);
  ok('event ' + E.ev + ' has a recipe', !!S.RECIPE[E.ev]);
});

const batch = S.batch(5);
ok('the batch is 60 candidates', batch.length === 60);
const ids = new Set(batch.map(v => v.id));
ok('every candidate id is unique', ids.size === batch.length);

let offGrid = 0, badField = 0, invalid = 0;
batch.forEach(v => {
  const errs = S.validate(v);
  if (errs.length) { invalid++; if (invalid <= 3) console.log('     ' + v.id + ': ' + errs.join('; ')); }
  errs.forEach(e => { if (/grid/.test(e)) offGrid++; });
  S.FIELDS.forEach(k => { if (v[k] == null) badField++; });
  // 5. nothing outside the spec table reaches a sound
  Object.keys(v).forEach(k => {
    if (S.FIELDS.indexOf(k) < 0 && ['ev', 'id', 'hits'].indexOf(k) < 0) badField++;
  });
});
ok('every candidate validates against the typed spec', invalid === 0);
ok('EVERY DURATION IS A NOTE: nothing off the 16th grid', offGrid === 0);
ok('no candidate invents a parameter outside the SPEC table', badField === 0);

// 6. determinism of the generator
const again = S.batch(5);
let drift = 0;
for (let i = 0; i < batch.length; i++) if (S.serialize(batch[i]) !== S.serialize(again[i])) drift++;
ok('the generator is deterministic (cook twice, same 60 vectors)', drift === 0);

// 7. candidate 0 is the recipe, straight
let plain = 0;
S.EVENTS.forEach(E => {
  const c0 = S.cook(E.ev, 5)[0], base = S.sanitize(Object.assign({}, S.RECIPE[E.ev].base, { ev: E.ev }));
  if (S.serialize(c0) !== S.serialize(base)) plain++;
});
ok('candidate 1 of every event is the recipe un-jittered', plain === 0);

// 8. MECHANISM-MINE: the bank is empty until he rules
ok('the engine ships with an EMPTY bank', Object.keys(S.BANK).length === 0);
ok('play() on an unbanked event is silent', S.play('hit', null, null) === null);
ok('the shipped alpha ships an empty bank too', /var BANK = \{\};/.test(mount));
ok('the bank file exists', fs.existsSync(BANK));
if (fs.existsSync(BANK)) {
  const bank = fs.readFileSync(BANK, 'utf8');
  const table = bank.split('--- THE TABLE ---')[1] || '';
  const rows = table.split('--- THE 12 EVENTS')[0].split('\n')
    .map(x => x.trim()).filter(x => x && !x.startsWith('#') && !x.startsWith('('));
  ok('every banked sound names the verdict file it came from',
     rows.every(r => /VERDICT|verdict/.test(r)));
  ok('the bank knows all 12 events', S.EVENTS.every(E => bank.indexOf(E.ev) >= 0));
}

// 9. the judge surface, and the verdict workflow on it
ok('the judge surface mounts into the MUSIC tab', /getElementById\('p-music'\)/.test(mount));
ok('it survives the studio rebuilding its panel', /MUS\.build\s*=\s*function/.test(mount));
ok('THUMBS UP and THUMBS DOWN per candidate', /sfxUp/.test(mount) && /sfxDn/.test(mount));
ok('a NOTE per candidate (per-item comments)', /class=\s*'sfxN'|className\s*=\s*'sfxN'/.test(mount));
ok('a comment box at the bottom, always', /sfxNote/.test(mount) && /textarea/.test(mount));
ok('SUN MODE for daylight', /sun/.test(mount) && /#sfxWrap\.sun/.test(mount));
ok('an EXPORT button', /EXPORT SFX/.test(mount));
ok('the export is .txt, never .json (Paolo 7/4: iOS blanks .json on a share)',
   /bohemia_sfx\.txt/.test(mount) && !/bohemia_sfx\.json/.test(mount));
ok('an approved candidate exports its VECTOR, so it can be banked exactly',
   /serialize/.test(mount));

console.log(`\n=== SFX GATE: ${p} passed, ${f} failed ===`);
process.exit(f ? 1 : 0);
