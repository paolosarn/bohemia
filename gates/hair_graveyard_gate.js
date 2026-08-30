/* THE HAIR GRAVEYARD GATE (8/30/26) -- a dead shape does not come back under a new name.
 *
 * GRAVEYARD IS FINAL is one of the oldest laws in this repo: "dead things stay dead. No
 * remakes. Fresh cooks answer dead slots." It has had a registry since July
 * (gates/bohemia_graveyard.txt) and, until today, NOTHING READ IT. A law without a machine
 * gate is not enforced, and this one had been unenforced for six weeks.
 *
 * WHAT IT COST, 8/30, and it is why this file exists. Paolo asked for more haircuts. Seven
 * were cooked in one turn and every single one was a remake of a shape he has already
 * killed twice:
 *     RIDGE CREST / SPIKED CREST / WIDE CREST   = MOHAWK, LIBERTY SPIKES, HIGH TOP
 *     NAPE TAIL / TIED ROPES                    = PONYTAIL, BRAIDED TAIL
 *     WORK KNOT                                 = TOP KNOT
 *     DESERT COIL                               = LOW BUN
 * Half a turn went into rebuilding the crest and the tie so those styles would read from
 * every angle -- three attempts at the crest alone -- and the whole time the answer was one
 * grep away in a file written for exactly this. THE NAMES WERE NEW AND THE SHAPES WERE NOT.
 *
 * SO THE GATE CANNOT MATCH ON NAMES. A name is the one thing a fresh cook always changes.
 * In this generator a SHAPE IS A DIAL: `strip` is what makes a crest, `tie` is what makes a
 * ponytail, a top knot or a bun. Both dials exist to build shapes that are ALL in the
 * graveyard and NEITHER is used by anything canon, which makes them dead mechanisms, and
 * cooking with one is a remake however it is named.
 *
 * AND IT CHECKS ITS OWN CITATIONS, because a hard-coded list of dead names rots the moment
 * somebody edits the registry. Every shape named below must actually be found in the
 * graveyard file, and found with a permanent kill on it.
 *
 * REOPENING ONE IS HIS, NOT MINE. laws/BOHEMIA_ADDENDUM_A_KILL_CAN_BE_REOPENED_8_1_26.md
 * says a kill whose stated reason was a DEFECT may come back as a candidate once the defect
 * is fixed -- and that a SECOND kill is permanent. Every shape below has taken its second.
 * Raising this gate needs a dated ruling from Paolo newer than 8/2/26, written into
 * REBASELINE below, the same way the trenchcoat cap records his.
 *
 *   node gates/hair_graveyard_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const YARD = path.join(REPO, 'gates/bohemia_graveyard.txt');

/* REBASELINE: empty. No ruling from him reopens any of these. */
const REBASELINE = [];

/* A DEAD MECHANISM: the dial, every graveyarded shape it builds, and what he said. */
const DEAD = [
  { dial: 'strip', what: 'the crest (mohawk / liberty spikes / high top)',
    shapes: ['MOHAWK w3', 'LIBERTY SPIKES w3', 'HIGH TOP 2'],
    said: '"it\'s like a rectangle on someone\'s head" (8/2, third strike, closed)' },
  { dial: 'tie', what: 'the tied mass (ponytail / braided tail / top knot / low bun)',
    shapes: ['PONYTAIL w3', 'TOP KNOT w3', 'LOW BUN 2', 'BRAIDED TAIL'],
    said: '"all fucked up like there\'s no hair in between the top and then the ponytail" ' +
          '(8/1), all second kills on 8/2' },
];

let pass = 0, fail = 0;
const ok = (n, c, note) => { if (c) { pass++; console.log('  ok   ' + n + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + n + (note ? '   ' + note : '')); } };

console.log('\nTHE HAIR GRAVEYARD GATE');

const alpha = fs.readFileSync(ALPHA, 'utf8');
const yard = fs.readFileSync(YARD, 'utf8');

/* ---- 1. THE CITATIONS RESOLVE. A dead list nobody can check is a comment. ---------- */
for (const d of DEAD) {
  const missing = d.shapes.filter(s => yard.indexOf(s) < 0);
  ok('the graveyard really holds the shapes ' + d.dial + ' builds', missing.length === 0,
     '(' + d.shapes.join(', ') + (missing.length ? '; NOT IN THE REGISTRY: ' + missing.join(', ') : '') + ')');
  /* AND THEY ARE STANDING TOMBSTONES, NOT REOPENED CANDIDATES -- and the first version of
     this check read the WORDING ("permanent", "second kill", "closed") and went red on
     BRAIDED TAIL, which is dead as dead gets. Its verdict was "looks like dog shit": a
     first kill that names NO DEFECT, so the reopening addendum never applied to it and
     nobody ever wrote "permanent" beside it. THE FILE'S OWN CONVENTION IS THE ANSWER and
     it is not prose: a reopened entry is COMMENTED OUT with a #, a live tombstone is not.
     I invented a wording rule for a file that already had a real one -- the same shape as
     every broken ruler this month, reading what I expected instead of what is there. */
  const soft = d.shapes.filter(s => {
    const i = yard.indexOf(s);
    const line = yard.slice(yard.lastIndexOf('\n', i) + 1, yard.indexOf('\n', i));
    return /^\s*#/.test(line); });
  ok('and every one of them is a standing tombstone, not a reopened candidate',
     soft.length === 0,
     soft.length ? '(reopened, so it is a candidate again: ' + soft.join(', ') + ')' : '');
}

/* ---- 2. NO CANON HAIRCUT CARRIES A DEAD DIAL ---------------------------------------
   This is the whole gate. It reads the canon garment rows out of the build, pulls each
   one's genHair options, and refuses any style built on a dead mechanism -- whatever it
   is called. It would have gone red on the first of the seven, before a single pixel of
   the crest rebuild was written. */
const rows = [...alpha.matchAll(/\{n:'([^']+)',st:'canon',layer:'hair'[\s\S]{0,1200}?(?=\n)/g)];
ok('the build still has a canon haircut list to read', rows.length >= 10,
   '(' + rows.length + ' canon haircuts)');

const offenders = [];
for (const m of rows) {
  const name = m[1], body = m[0];
  for (const d of DEAD) {
    if (REBASELINE.indexOf(name) >= 0) continue;
    const re = new RegExp('\\b' + d.dial + '\\s*:\\s*[^,}\\s]');
    if (re.test(body)) offenders.push(name + ' uses ' + d.dial + ' = ' + d.what);
  }
}
ok('*** no canon haircut is a remake of a graveyarded shape ***', offenders.length === 0,
   offenders.length ? '\n         ' + offenders.join('\n         ') +
     '\n         GRAVEYARD IS FINAL. Fresh cooks answer dead slots -- a new NAME on a dead' +
     '\n         SHAPE is the remake the law forbids. Cook a silhouette he has not killed.'
   : '(' + rows.length + ' checked against ' + DEAD.length + ' dead mechanisms)');

/* ---- 3. THE DEAD MECHANISMS ARE NAMED WHERE A COOK WILL SEE THEM -------------------
   The registry is 1,300 lines and the hair block sits in the middle of it, which is how
   seven remakes got cooked by somebody who had read the file before. The generator itself
   has to say so at the dial. */
for (const d of DEAD) {
  const at = alpha.indexOf('opt.' + d.dial) >= 0 || alpha.indexOf('var ' + d.dial + '=') >= 0;
  ok('the generator warns at the ' + d.dial + ' dial itself', !at || /GRAVEYARD/.test(alpha),
     '(' + d.what + ')');
}

/* ---- 4. AND THE REBASELINE IS HIS TO WRITE, NOT MINE -------------------------------- */
ok('nothing has been quietly reopened', REBASELINE.length === 0,
   REBASELINE.length ? '(reopened: ' + REBASELINE.join(', ') + ' -- needs a dated ruling)' : '');

console.log('\nTHE HAIR GRAVEYARD GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
