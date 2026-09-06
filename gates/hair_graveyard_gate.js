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

/* ---- 3b. HIS THIRTEEN 8/20 KILLS ARE DEAD IN THE BUILD, BY NAME --------------------
   THE GATE ABOVE MATCHES ON MECHANISMS BECAUSE A FRESH COOK ALWAYS CHANGES THE NAME.
   That is right, and it left the plainest case unguarded: the SAME name, still canon.
   All thirteen of Paolo's hair round 4 kills shipped as st:'canon' for SIXTEEN DAYS
   after he killed them -- 13 of the 24 canon haircuts, in the crowd, in the face maker,
   on the family. Nothing noticed, and the reason is check 4 below. (9/5.) */
const ROUND4 = ['SUN CROP', 'DUSK SHAG', 'ASH SWEEP', 'SALT CROWN', 'BUZZ CUT', 'CROP',
                'SLICK BACK', 'BOWL CUT', 'FRINGE', 'SHOULDER LENGTH', 'LONG LOOSE',
                'WOLF CUT', 'GREY WISPS'];
const aliveAgain = ROUND4.filter(n =>
  alpha.indexOf("{n:'" + n + "',st:'canon',layer:'hair'") >= 0);
const missing = ROUND4.filter(n =>
  alpha.indexOf("{n:'" + n + "',st:'dead',layer:'hair'") < 0);
ok('*** none of his thirteen 8/20 kills is shipping as canon ***', aliveAgain.length === 0,
   aliveAgain.length ? '(BACK IN CANON: ' + aliveAgain.join(', ') + ')'
     : '(13 of 13 checked; records/BOHEMIA_VERDICT_HAIR_ROUND4_8_20_26.txt)');
ok('and all thirteen are still in the build as tombstones, not deleted', missing.length === 0,
   missing.length ? '(no dead row found for: ' + missing.join(', ') + ')' : '');
/* AND NOBODY IS STILL WEARING ONE. The draw path is GARMENTS.find(x => x.n === nm) --
   it resolves by NAME and never looks at `st` -- so an authored look pointing at a
   corpse renders the corpse. Nineteen did, on 9/5: three of the family cast, eleven
   faction looks and the whole six-person city cast. */
const wearing = ROUND4.filter(n => alpha.indexOf("worn:{hair:'" + n + "'") >= 0);
ok('*** and nobody in the game is still wearing one ***', wearing.length === 0,
   wearing.length ? '(still worn: ' + wearing.join(', ') + ' -- the draw path resolves by ' +
     'NAME and ignores st, so these render)' : '(19 authored looks repointed 9/5)');

/* ---- 4. A TOKEN THAT MATCHES NOTHING IS GUARDING NOTHING ---------------------------
   *** THIS IS THE BUG THAT COST SIXTEEN DAYS, AND IT IS THE ONLY CHECK THAT FINDS IT. ***
   The registry spelled all thirteen `n:'HAIR - SUN CROP'` -- the JUDGING TOOL'S DISPLAY
   NAME, which is what the verdict export prints. The build has always said
   `n:'SUN CROP'`. So bohemia_graveyard_gate.py swept the whole tree for a string that
   HAS NEVER EXISTED IN THIS CODEBASE, found nothing, and reported the dead as staying
   dead. It was green, it was thorough, and it was measuring a typo. Same family as the
   8/25 headwear gate that passed seventeen hats drawing zero pixels.
   A REGISTRY ENTRY IS A SEARCH STRING. If it matches nothing in the build, it is a
   comment wearing a gate's name, and the fix is to say so out loud the day it is
   written rather than sixteen days later. */
const orphans = [];
for (const line of yard.split('\n')) {
  const t = line.split('|')[0].trim();
  if (!/^n:'.+'$/.test(t)) continue;
  if (!/hair|haircut/i.test(line)) continue;       /* this gate's remit is hair */
  if (line.trim().startsWith('#')) continue;       /* reopened candidate, not a tombstone */
  if (alpha.indexOf(t) < 0) orphans.push(t);
}
ok('*** every hair tombstone names a string the build actually contains ***',
   orphans.length === 0,
   orphans.length ? '(matches NOTHING in the build, so it guards nothing: ' +
     orphans.join(', ') + ')' : '(every hair token in the registry resolves)');

/* ---- 5. AND THE REBASELINE IS HIS TO WRITE, NOT MINE -------------------------------- */
ok('nothing has been quietly reopened', REBASELINE.length === 0,
   REBASELINE.length ? '(reopened: ' + REBASELINE.join(', ') + ' -- needs a dated ruling)' : '');

console.log('\nTHE HAIR GRAVEYARD GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
