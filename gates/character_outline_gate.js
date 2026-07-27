// BOHEMIA — CHARACTER OUTLINE GATE (7/27/26). FACTORY LAW: new law, new gate.
//
// Paolo 7/27: "I want there to be a one pixel one black pixel border around the
// whole character, just wrap around no matter what direction they're facing."
//
// The border is easy to write and easy to silently ruin. Three ways it dies:
//   1. Something composites AFTER it and covers it. That exact bug made the limb
//      separation line worthless for a whole session while the code looked fine.
//   2. The paint loop reads px live instead of a snapshot, so each new black
//      pixel seeds the next one and a 1px border creeps to a 2-3px smear.
//   3. It writes the occupancy grid, and every character silently gets 2px
//      fatter for collision -- against OCCUPANCY LAW, and invisible on screen.
// This gate pins all three, plus the scope bug that cost a round.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_CHARACTER_OUTLINE_7_27_26.md');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const TOOL = path.join(ROOT, 'tools', 'bohemia_character_outline_patch.py');
const SHEET = path.join(ROOT, 'records', 'outline', 'CHARACTER_OUTLINE_7_27_26.png');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== CHARACTER OUTLINE GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the law is recorded', fs.existsSync(LAW));
ok('the alpha exists', fs.existsSync(ALPHA));
ok('the patch tool is kept', fs.existsSync(TOOL));
ok('the proof sheet he can look at exists', fs.existsSync(SHEET));
if (f) done();
const law = fs.readFileSync(LAW, 'utf8');
const src = fs.readFileSync(ALPHA, 'utf8');
const tool = fs.readFileSync(TOOL, 'utf8');

/* ---- the flag ---------------------------------------------------------- */
ok('CHAR_OUTLINE is declared exactly once', (src.match(/const CHAR_OUTLINE/g) || []).length === 1);
ok('the outline is ON', /const CHAR_OUTLINE\s*=\s*\{\s*on:\s*true/.test(src));
ok('the colour is a flag, not a literal buried in the loop',
  /const CHAR_OUTLINE\s*=\s*\{[^}]*color:\s*\[0,\s*0,\s*0\]/.test(src));

/* ---- SCOPE. The flag lived next to RIGID for one build; RIGID is inside the
   SKINNER_API closure and buildFrame is outside it, so every frame threw
   ReferenceError and the alpha never booted -- presenting as a test timeout. -- */
const iSkin = src.indexOf('const SKINNER_API=(function(){');
const iRigid = src.indexOf('const RIGID = { on: true };');
const iFlag = src.indexOf('const CHAR_OUTLINE');
const iFn = src.indexOf('function buildFrame(d,clip,ph){');
ok('the anchors are all found', iSkin > 0 && iRigid > 0 && iFlag > 0 && iFn > 0);
ok('CHAR_OUTLINE is NOT declared back in the skinner closure next to RIGID',
  Math.abs(iFlag - iRigid) > 400);
ok("CHAR_OUTLINE is declared in buildFrame's own scope, immediately above it",
  iFlag < iFn && (iFn - iFlag) < 700);
ok('the scope bug is written down so nobody re-does it',
  /RIGID.*INSIDE the\s*`?SKINNER_API`? closure|INSIDE the\s+`SKINNER_API`\s+closure/s.test(law));
ok('the general rule is recorded: a load-time hang is a page error, capture pageerror first',
  /Capture `pageerror` FIRST/.test(law));

/* ---- the pass itself --------------------------------------------------- */
const m = src.match(/if\(CHAR_OUTLINE\.on\)\{[\s\S]*?\n  \}/);
ok('the outline pass is present in buildFrame', !!m);
if (!m) done();
const pass = m[0];

ok('SNAPSHOT FIRST: a frozen solid map is built before anything is painted',
  /const solid=new Uint8Array\(CW\*CH\)/.test(pass));
ok('the neighbour test reads the SNAPSHOT, never px -- or the border grows on itself',
  /solid\[i\+1\]/.test(pass) && /solid\[i-1\]/.test(pass) &&
  /solid\[i\+CW\]/.test(pass) && /solid\[i-CW\]/.test(pass) &&
  !/px\[i\+1\]/.test(pass) && !/px\[i-CW\]/.test(pass));
ok('it only ever writes cells that were EMPTY (his painted art is untouchable)',
  /if\(solid\[i\]\)continue;/.test(pass));
ok('COLOUR ONLY: the pass never writes the occupancy grid',
  !/grid\[/.test(pass));
ok('it is orthogonal 4-neighbour, not diagonal (diagonals make fat corners)',
  !/i\+CW\+1|i-CW-1|i\+CW-1|i-CW\+1/.test(pass));

/* ---- ORDER. Last pass or it gets covered. ------------------------------ */
const iFloater = src.indexOf('FINAL FLOATER CULL');
const iSep = src.indexOf('_SEPMAP');
const iPass = src.indexOf('if(CHAR_OUTLINE.on){');
const iRet = src.indexOf('  return {px,CW,CH};');
ok('the outline runs AFTER the final floater cull, so it never outlines a dead speck',
  iFloater > 0 && iPass > iFloater);
ok('the outline runs AFTER the limb separation line, so nothing composites over it',
  iSep > 0 && iPass > iSep);
ok('the outline is the LAST thing before the frame is returned',
  iRet > iPass && (iRet - iPass) < 900);

/* ---- the tool ---------------------------------------------------------- */
ok('the patch tool anchors the flag on buildFrame, not on RIGID',
  /FLAG_ANCHOR = 'function buildFrame/.test(tool));
ok('the patch tool documents the REUSE CHECK (it cooks no art)',
  /REUSE CHECK/.test(tool));

/* ---- the measured record ----------------------------------------------- */
ok('the law carries the 192-frame differential measurement',
  /192 frames/.test(law) && /25,628/.test(law));
ok('the law pins the three zeros that make it a border and not a smear',
  /double-thick \/ non-black outline pixels \| \*\*0\*\*/.test(law) &&
  /silhouette cells missing an outline \| \*\*0\*\*/.test(law) &&
  /painted \(Paolo's\) pixels changed \| \*\*0\*\*/.test(law));
ok('the law states the grid is untouched so occupancy still sees the true silhouette',
  /occupancy `grid` stays 0/.test(law));
ok('the law separates this from the constitution\'s banned art-bank KEYLINE',
  /keyline/i.test(law) && /\*\*This is not\s*that\.\*\*/.test(law));
ok('the honest caveat is on the record, not hidden: black on a black coat reads quietly',
  /head, hands and\s*\*\*boots\*\*|head, hands and\s+boots/.test(law));
ok('the colour alternative is flagged as HIS call, not decided for him',
  /\[PENDING, Paolo's call\]/.test(law));

done();
