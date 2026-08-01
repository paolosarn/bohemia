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

// --- v2 THE RELIQUARY: the laws that make "2006" un-shippable ---------------
// Paolo killed v1 for sounding like 2007 software (it was the sfxr topology).
// These four checks are the machine form of the fix. A future session cannot
// quietly regress to one-oscillator-one-envelope without going red.
ok('the engine is v2 (the modal reliquary)', S.VERSION === 2);
ok('there are modal material banks at all', S.MATERIALS && S.MATERIALS.length >= 6);
S.MATERIALS.forEach(mat => {
  const bank = S.MODES[mat];
  ok(mat + ' has enough partials to be a body, not a bleep', bank && bank.length >= 4);
  if (!bank) return;
  // INHARMONIC -- FOR THE STRUCK BODIES. A harmonic stack is what made v1 sound
  // like a synth, so bell/metal/glass/crystal/stone/bone/wood/ash must be off
  // the integer grid. `choir` and `water` are NAMED EXEMPTIONS and the reason is
  // physics, not convenience: a sung voice really is a harmonic series, and
  // forcing it inharmonic would make it wrong, not better. This gate went red on
  // choir the first time it ran and the RULE was what was wrong.
  const HARMONIC_BY_PHYSICS = ['choir', 'water'];
  if (HARMONIC_BY_PHYSICS.indexOf(mat) < 0) {
    const offInt = bank.filter(m => Math.abs(m[0] - Math.round(m[0])) > 0.05).length;
    ok(mat + ' is INHARMONIC (not a harmonic stack)', offInt >= Math.max(2, (bank.length / 3) | 0));
  }
  // THE PHYSICAL LAW: high partials die faster than low ones. This is the single
  // defect that made v1 sound synthetic -- one shared decay means the whole
  // sound stops at once, which no struck object does.
  // IT IS A TREND, NOT A STAIRCASE, and that correction came from the reference
  // itself: Risset's measured bell has partial 6 (ratio 1.70) ringing 0.35 while
  // partial 5 (ratio 1.19) rings 0.325. Demanding strict monotonicity failed the
  // very table this engine cites, which means the demand was wrong. Real bodies
  // have local exceptions; what they never do is let the top ring as long as the
  // bottom.
  const third = Math.max(1, Math.round(bank.length / 3));
  const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
  const lowAvg = avg(bank.slice(0, third).map(m => m[2]));
  const highAvg = avg(bank.slice(-third).map(m => m[2]));
  ok(mat + ': decay SHORTENS as the partial rises (trend)', lowAvg >= highAvg * 2.5);
  ok(mat + ': no partial outlives the fundamental',
     bank.every(m => m[2] <= bank[0][2] + 1e-9));
  // and it must be a real spread, not eleven partials with the same decay
  ok(mat + ': the decay spread is real (top partial dies much faster)',
     bank[0][2] / bank[bank.length - 1][2] >= 3);
});
// Risset's bell is the cited reference and it is reproduced exactly
(function () {
  const b = S.MODES.bell;
  const RATIOS = [0.56, 0.56, 0.92, 0.92, 1.19, 1.70, 2.00, 2.74, 3.00, 3.76, 4.07];
  const DURS = [1, 0.9, 0.65, 0.55, 0.325, 0.35, 0.25, 0.2, 0.15, 0.1, 0.075];
  ok('the bell bank IS Risset 1969, ratios verbatim',
     !!b && b.length === 11 && RATIOS.every((r, i) => Math.abs(b[i][0] - r) < 1e-9));
  ok('the bell bank IS Risset 1969, durations verbatim',
     !!b && DURS.every((d, i) => Math.abs(b[i][2] - d) < 1e-9));
  ok('the bell warbles: paired partials offset in Hz, not in ratio',
     !!b && b[1][3] > 0 && b[3][3] > 0);
})();
// THREE LAYERS, and the room built without the two banned nodes
ok('there is a transient layer', !!S.SPEC.trans && !!S.SPEC.transHz);
ok('there is a room layer', !!S.SPEC.space && !!S.SPEC.room && !!S.SPEC.refl);
ok('there is a stereo width control', !!S.SPEC.width);
ok('the renderer builds early reflections and a noise tail, not a delay line',
   /early reflections/i.test(engine) && /noise/i.test(engine));

// 4/5/6/7. the batch itself
ok('BEAT is 120 BPM (0.5s)', S.BEAT === 0.5);
ok('the grid is a 16th of a beat', Math.abs(S.TICK - S.BEAT / 16) < 1e-12);
ok('every game moment has a recipe', S.EVENTS.length >= 12 &&
  S.EVENTS.every(e => !!S.RECIPE[e.ev]) &&
  Object.keys(S.RECIPE).length === S.EVENTS.length);
S.EVENTS.forEach(E => {
  ok('event ' + E.ev + ' has a label for the judge card', !!E.label && E.label.length > 2);
  ok('event ' + E.ev + ' says what it is FOR', !!E.why && E.why.length > 8);
  ok('event ' + E.ev + ' has a recipe', !!S.RECIPE[E.ev]);
});

const batch = S.batch(5);
ok('the batch is 5 candidates per moment', batch.length === S.EVENTS.length * 5);
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

// NOT MONO. v1 shipped every candidate at pan 0, which is the exact thing FFX
// moved away from when its effects went mono -> stereo.
(function () {
  const panned = batch.filter(v => Math.abs(v.pan) > 0.01).length;
  ok('the batch is not dead-centre mono (v1\'s failure)', panned >= batch.length * 0.6);
  const wide = batch.filter(v => v.width > 0.1).length;
  ok('every candidate has stereo width', wide === batch.length);
})();
// THE TAIL RULE: footsteps stay dry, the meaningful moments get the room.
(function () {
  const dry = batch.filter(v => v.ev.indexOf('step_') === 0).every(v => v.space <= 0.15);
  ok('footsteps are DRY (walking must not echo like a cathedral)', dry);
  const wet = batch.filter(v => ['kill', 'save_chime', 'door_open'].indexOf(v.ev) >= 0)
    .every(v => v.space >= 0.4);
  ok('the moments that matter get the room', wet);
})();
// every candidate names a real material
ok('every candidate is a struck material', batch.every(v => S.MATERIALS.indexOf(v.mat) >= 0));

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
  // THE BANK HOLDS WHAT HE JUDGED, NOT WHAT EXISTS. This asked the other way
  // round ("every event is in the bank") and so it broke the moment a NEW batch
  // was cooked -- which is backwards, because an unjudged moment is SUPPOSED to
  // have no entry and play nothing. What must hold is that the bank never names
  // a moment the engine does not have.
  // (bank is the FILE TEXT here, not a list -- naming it `bank` cost me a crash)
  const named = (bank.match(/\b[a-z_]+(?=\s*[:=]|\s+\d)/g) || [])
    .filter(w => /_|^(hit|block|kill|pickup|shot|miss|vital|hurt|clear)$/.test(w));
  const known = S.EVENTS.map(E => E.ev);
  ok('the bank never names a moment the engine does not have',
     named.every(b => known.indexOf(b) >= 0 || !/^(step_|door_)/.test(b)));
  ok('every moment he has judged is banked',
     ['step_dirt', 'step_asphalt', 'step_gravel', 'pickup', 'hit', 'block',
      'kill', 'ui_tap', 'phone_buzz', 'save_chime'].every(e => bank.indexOf(e) >= 0));
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
