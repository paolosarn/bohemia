// BOHEMIA — RENDER LIKE THE RIG GATE (7/26/26). FACTORY LAW: new law, new gate,
// same turn.
//
// Paolo 7/26: "The east and west animations are still dog shit when it comes to
// morph pixels underneath the arms and the back leg in the back arm. All the
// pieces are made how they should be made bullshit look at the rig."
//
// THE RULE THIS LOCKS: the alpha may not carry a render pass that his rig does
// not have unless that pass justifies itself in measured pixels. Three had crept
// in -- JOINT WELD, EVERY PIXEL LANDS, FAR-ARM DARKENING -- and between them they
// were fabricating 45% of the on-screen pixels nobody painted. All three are
// retired. This gate stops them coming back, and ratchets the committed audit so
// the numbers cannot quietly regress either.
//
// It also locks the HONEST part of the record. The retirements did NOT fix what
// he is watching (4.65 -> 4.74 strobing pixels per frame, i.e. nothing), and the
// audit says so in its own text. A future edit that deletes that admission and
// leaves only the flattering 57% fails this gate on purpose.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_RENDER_LIKE_THE_RIG_7_26_26.md');
const REPORT = path.join(ROOT, 'records', 'BOHEMIA_PROFILE_MORPH_AUDIT_7_26_26.txt');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== RENDER LIKE THE RIG GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
ok('the law is recorded', fs.existsSync(LAW));
ok('the patch tool is checked in (a change nobody can re-apply is not a change)',
  fs.existsSync(path.join(ROOT, 'tools', 'bohemia_render_like_the_rig_patch.py')));
ok('the audit tool is checked in (a claim nobody can re-run is not a claim)',
  fs.existsSync(path.join(ROOT, 'tools', 'bohemia_profile_morph_audit.js')));
ok('the measured evidence is committed', fs.existsSync(REPORT));
if (f) done();
const src = fs.readFileSync(ALPHA, 'utf8');
const rep = fs.readFileSync(REPORT, 'utf8');

/* ---- the flag exists and is ON ------------------------------------------ */
ok('RIGFAITH is declared', /const RIGFAITH\s*=\s*\{\s*on:\s*true\s*\}/.test(src));
ok('RIGFAITH is exported on SKINNER_API, like RIGID (the composite path runs outside the skinner closure)',
  /return \{ Skinner, REFINE_STATS, RIGID, RIGFAITH,/.test(src));

/* ---- the three passes his rig does not have, all retired ----------------- */
ok('JOINT WELD stays retired', /if \(!RIGID\.on\) for \(const bn of this\.candFor\(p\)\)/.test(src));
ok('EVERY PIXEL LANDS is retired (his rig has no forward-splat)',
  /if \(!RIGFAITH\.on\) for \(const ri of this\.pixList\[p\]\)/.test(src));
ok('FAR-ARM DARKENING is retired (his rig does not darken the far arm; it was E/W only)',
  /const farArmParts=\(!SKINNER_API\.RIGFAITH\.on&&DEPTH\[d\]&&DEPTH\[d\]\.farArm\)\?/.test(src));

/* the retirements must be REASONED IN PLACE, not silently switched off -- the
   next person to read this code has to learn why without leaving the file */
ok('the forward-splat retirement says why, at the code', /no forward-splat/.test(src));
ok('the far-arm retirement says why, at the code', /the back leg in the back arm/.test(src));

/* ---- nothing may reintroduce a fourth pass unguarded --------------------- */
const skin = /skin\(pose\) \{[\s\S]*?\n  \}\n/.exec(src);
ok('the skinner body is locatable', !!skin);
if (skin) {
  /* skin() gets exactly ONE unguarded stamping pass: the primary inverse sample,
     which IS his rig's pass. Everything the alpha added on top must sit behind a
     retirement flag. A fourth pass appearing unguarded fails here. */
  const all = (skin[0].match(/for \(const (?:bn|ri) of this\.(?:candFor|pixList)/g) || []).length;
  const guarded = (skin[0].match(/if \(!RIG(?:ID|FAITH)\.on\) for \(const (?:bn|ri) of this\.(?:candFor|pixList)/g) || []).length;
  ok(`skin() has exactly one unguarded stamping pass -- the rig's own inverse sample (${all - guarded} unguarded, ${guarded} retired)`,
    all - guarded === 1);
  ok('both alpha-invented stamping passes are the retired ones', guarded === 2);
}

/* ---- the ratchet: the measured numbers may improve, never regress -------- */
const num = (re) => { const m = re.exec(rep); return m ? parseFloat(m[1].replace(/,/g, '')) : NaN; };
const totalAfter = num(/TOTAL\s*\|\s*[\d,]+\s*->\s*([\d,]+)/);
const ewAfter = num(/E\+W specifically:\s*[\d,]+\s*->\s*([\d,]+)/);
ok(`invented pixels across all facings stay at or below 18,284 (measured ${totalAfter})`,
  isFinite(totalAfter) && totalAfter <= 18284);
ok(`invented pixels on E+W stay at or below 3,356 (measured ${ewAfter})`,
  isFinite(ewAfter) && ewAfter <= 3356);

/* ---- the record stays honest -------------------------------------------- */
ok('the audit still reports the composited strobe, not just the flattering count',
  /strobing pixels per frame/.test(rep));
ok('the audit still states the retirements did NOT move what he sees',
  /READ THIS HONESTLY/.test(rep) && /barely move/.test(rep));
ok('the audit still names the real cause (the anatomy line re-derived per frame)',
  /base skin -> anatomy line/.test(rep) || /ANATOMY LINE/.test(rep));
ok('the audit still labels the candidate fix as unshipped, not as a cure',
  /NOT A CURE/.test(rep) && /not shipped/.test(rep));
ok('the audit states its own scope instead of silently trimming clips',
  /Nothing else is trimmed/.test(rep));

/* ---- the rig stays the authority ---------------------------------------- */
ok('the body is still installed FROM the rig (rig is law, unchanged by this turn)',
  /function rebuildFromRig\(\)/.test(src));

done();
