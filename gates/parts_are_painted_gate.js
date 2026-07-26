// BOHEMIA — EVERY PART IS ALREADY PAINTED, BY ITSELF (Paolo 7/26/26, LOCKED).
// FACTORY LAW: new law, new gate, same turn.
//
// "If you turned the arms on and off, what would the torso be doing already?
//  That's why I made the whole rig bro, so everything should already be painted
//  for their individual body parts first. That goes for clothing, that goes for
//  the skin."
//
// TWO HALVES, and the gate checks both:
//
//  1. HIS ART must stay whole per part. Turn any part off and what remains is
//     still a complete thing. Measured directly on BAKED: the torso is a solid
//     blob with no holes, and the arms sit ON TOP of painted torso rather than
//     in a bite cut out of it.
//
//  2. THE RENDERER must not undo that. No rule may read a part's NEIGHBOURS to
//     decide that part's appearance. Today buildFrame does exactly that -- it
//     recomputes every skin tone each frame from the combined deformed grid --
//     which is why the torso carries the arm's shadow and why 88% of the E/W
//     strobe is one pair of skin tones flipping. That code is NOT fixed yet
//     (Paolo's call on how, see the addendum), so this gate PINS it: the known
//     violation is recorded with its exact shape, and the gate fails if it grows
//     or if a second one appears. A pinned violation is a debt with a receipt,
//     not a pass.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_PARTS_ARE_PAINTED_7_26_26.md');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== PARTS ARE PAINTED GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
ok('the law is recorded', fs.existsSync(LAW));
if (f) done();
const src = fs.readFileSync(ALPHA, 'utf8');

/* ---- pull the painted body straight out of the alpha --------------------- */
function grab(t, name) {
  const m = new RegExp('(?:const|let|var)\\s+' + name + '\\s*=\\s*').exec(t);
  if (!m) return null;
  const i = t.indexOf('{', m.index + m[0].length); let d = 0;
  for (let k = i; k < t.length; k++) { if (t[k] === '{') d++; else if (t[k] === '}') { d--; if (!d) return t.slice(i, k + 1); } }
  return null;
}
let B = null;
try { B = JSON.parse(grab(src, 'BAKED')); } catch (e) { }
ok('the painted body is readable', !!(B && B.layers));
if (!B || !B.layers) done();

const CW = 56, CH = 56;
const TORSO = 4, ARMS = [5, 6];
const DIRS = Object.keys(B.layers);
ok('all eight facings are painted', DIRS.length === 8);

/* 1a. every part is non-empty on every facing -- "complete" starts with existing */
{
  let missing = [];
  for (const d of DIRS) for (let q = 1; q <= 12; q++) {
    const L = B.layers[d][q];
    if (!L || !L.length) missing.push(d + '/' + q);
  }
  ok('no part is empty on any facing' + (missing.length ? ' [' + missing.slice(0, 6).join(', ') + ']' : ''), !missing.length);
}

/* 1b. THE TORSO IS WHOLE UNDER THE ARMS. This is his question, checked literally:
   turn the arm off, is there still a torso there? A bite cut out of the torso
   where the arm sits would mean the art itself depends on the arm being drawn. */
{
  const bad = [];
  for (const d of DIRS) {
    const T = new Set(B.layers[d][TORSO] || []);
    if (!T.size) { bad.push(d + ' has no torso'); continue; }
    let minx = 1e9, maxx = -1, miny = 1e9, maxy = -1;
    for (const i of T) { const x = i % CW, y = (i / CW) | 0;
      if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y; }
    /* a hole = a gap strictly inside the torso's own extent on its own row */
    let holes = 0;
    for (let y = miny; y <= maxy; y++) {
      let rmin = 1e9, rmax = -1;
      for (let x = minx; x <= maxx; x++) if (T.has(y * CW + x)) { if (x < rmin) rmin = x; if (x > rmax) rmax = x; }
      if (rmax < 0) continue;
      for (let x = rmin; x <= rmax; x++) if (!T.has(y * CW + x)) holes++;
    }
    /* S/SE/SW legitimately carry a few interior gaps from his own painting; the
       PROFILES are the ones that matter here and they are solid. Recorded as
       measured, not waved through: E and W must be perfect, the rest may not
       get worse than what he painted today. */
    const cap = (d === 'E' || d === 'W') ? 0 : 8;
    if (holes > cap) bad.push(`${d}: ${holes} holes inside the torso (cap ${cap})`);
  }
  ok('the torso is a whole shape on every facing, and perfectly solid in profile' +
    (bad.length ? ' [' + bad.join('; ') + ']' : ''), !bad.length);
}

/* 1c. the arms sit ON a painted torso, they do not replace it */
{
  const bad = [];
  for (const d of ['E', 'W']) {
    const T = new Set(B.layers[d][TORSO] || []);
    for (const a of ARMS) {
      const A = B.layers[d][a] || [];
      let on = 0; for (const i of A) if (T.has(i)) on++;
      const pctOn = A.length ? on / A.length : 0;
      /* in profile the arm is almost entirely in front of the torso; if that
         drops, someone has carved the torso out from under it */
      if (pctOn < 0.6) bad.push(`${d}/part${a}: only ${on}/${A.length} arm pixels have torso underneath`);
    }
  }
  ok('in profile the arms lie ON TOP of a complete torso, never in a hole cut for them' +
    (bad.length ? ' [' + bad.join('; ') + ']' : ''), !bad.length);
}

/* ---- 2. THE RENDERER SIDE, PINNED ---------------------------------------- */
/* The shipped shading loop decides a body pixel's tone by looking at its four
   orthogonal NEIGHBOURS in the combined grid. That is the violation. It is
   pinned, not passed: exactly one such rule may exist, in one place, and the
   law file must still say it is open. */
{
  const nbRule = /const nb=\[bx\+1<CW\?grid\[i\+1\]:0,bx>0\?grid\[i-1\]:0,by\+1<CH\?grid\[i\+CW\]:0,by>0\?grid\[i-CW\]:0\]/g;
  const hits = (src.match(nbRule) || []).length;
  ok(`the neighbour-derived tone rule exists in exactly ONE place, pinned as known debt (found ${hits})`, hits === 1);

  const skyRule = /if\(shade===2\)\{ const by2=\(i\/CW\)\|0, up1=by2>0\?grid\[i-CW\]:0, up2=by2>1\?grid\[i-2\*CW\]:0; if\(!up1\|\|!up2\) shade=3; \}/;
  ok('the sky top-light rule is the only other neighbour-derived tone rule, and it is where it was', skyRule.test(src));

  /* nobody may add a THIRD one while this is open */
  const anyNeighbourTone = (src.match(/grid\[i-CW\]/g) || []).length;
  ok(`no new neighbour-reading tone rule has been added (grid[i-CW] reads: ${anyNeighbourTone}, pinned at 4)`, anyNeighbourTone <= 4);
}

/* ---- the record stays honest about being unfinished ---------------------- */
{
  const law = fs.readFileSync(LAW, 'utf8');
  ok('the law still records that the body carries NO painted colour (the real hole)',
    /carries no painted colour at all/i.test(law));
  ok('the law still leaves the fix as Paolo\'s call rather than declaring it solved',
    /his call which/i.test(law) && /He paints it/.test(law));
  ok('the law still carries the measurement, not just the claim', /4\.37 tone flips per frame/.test(law));
  ok('the law still names the shoulder-blend collision instead of hiding it',
    /SHOULDER BLEND/.test(law));
  /* THE NEGATIVE RESULTS ARE THE VALUABLE PART. Three lawful fixes were built
     and all three measured WORSE than the renderer they replaced. If that record
     is deleted, the next session rebuilds them. */
  ok('the law still records that all three renderer fixes were tried and were worse',
    /all three were worse/i.test(law) && /7,524/.test(law) && /6,735/.test(law) && /7,238/.test(law));
  ok('the law still records the deeper cause (part ownership oscillating, 58%)',
    /58%/.test(law) && /PART OWNERSHIP/.test(law));
  ok('the law still states nothing was shipped', /NOTHING WAS SHIPPED/.test(law));
  ok('the attempted patch is checked in so the failures can be re-run, not re-guessed',
    fs.existsSync(path.join(ROOT, 'tools', 'bohemia_parts_are_painted_patch.py')));
  /* ATTEMPT 4 ran after the arm hold gave the rule a stable boundary, and lost
     too. The rule is CLOSED for the renderer until the profile is repainted.
     Keeping this recorded is the only thing stopping a fifth rebuild. */
  ok('the law records attempt 4 (post arm-hold) and that it also measured worse',
    /ATTEMPT 4/.test(law) && /3,564/.test(law) && /THIS RULE IS NOW CLOSED/.test(law));
  ok('the law records the split that explains attempt 4 (shading -6%, ownership +25%)',
    /-6%/.test(law) && /\+25%/.test(law));
  ok('the law records where the remainder actually sits (pose steps vs holds)',
    /5\.13/.test(law) && /1\.84/.test(law));
  ok('the attempt-4 tool is checked in too', fs.existsSync(path.join(ROOT, 'tools', 'bohemia_own_shading_patch.py')));
}

done();
