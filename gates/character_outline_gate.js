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
/* SIGNATURE-AGNOSTIC. buildFrame took a 4th parameter (_noOutline) when the
   border moved to display size; anchoring on the exact old signature missed and
   silently failed two assertions that were about SCOPE, not about arity. */
const iFn = src.indexOf('function buildFrame(d,clip,ph');
ok('the anchors are all found', iSkin > 0 && iRigid > 0 && iFlag > 0 && iFn > 0);
ok('CHAR_OUTLINE is NOT declared back in the skinner closure next to RIGID',
  Math.abs(iFlag - iRigid) > 400);
/* The REAL boundary, not a distance proxy: the skinner closure ends at its export
   statement. The flag must be declared AFTER that (so it is outside the closure)
   and BEFORE buildFrame (so buildFrame can see it). A byte-distance check broke the
   moment a comment block was added above the flag -- it was measuring formatting,
   not scope. */
const iClose = src.indexOf('return { Skinner, REFINE_STATS,');
ok('the skinner closure export is found', iClose > 0);
ok("CHAR_OUTLINE is declared OUTSIDE the skinner closure and BEFORE buildFrame",
  iFlag > iClose && iFlag < iFn);
ok('the scope bug is written down so nobody re-does it',
  /RIGID.*INSIDE the\s*`?SKINNER_API`? closure|INSIDE the\s+`SKINNER_API`\s+closure/s.test(law));
ok('the general rule is recorded: a load-time hang is a page error, capture pageerror first',
  /Capture `pageerror` FIRST/.test(law));

/* ---- the pass itself --------------------------------------------------- */
/* THE PASS IS A FUNCTION NOW, so it can run at 56 or at 112 -- that is the whole
   fix for "the black border has to be thinner, like half as thin" (it was drawn at
   56 and then DOUBLED by the Scale2x that takes the frame to 112). Not one line of
   its logic changed, so every assertion below about its CONTENT still runs, against
   applyCharOutline instead of against an inline block. */
const m = src.match(/function applyCharOutline\(px,CW,CH\)\{[\s\S]*?\n  return px;\n\}/);
ok('the outline pass exists and is callable at any frame size', !!m);
if (!m) done();
const pass = m[0];

ok('SNAPSHOT FIRST: a frozen solid map is built before anything is painted',
  /const solid=new Uint8Array\(CW\*CH\)/.test(pass));
/* THE BORDER PASS reads the SNAPSHOT, never px, or it grows on itself. Scoped to
   the border loop specifically: the VOID-CLOSING loop below it MUST read px,
   because its whole job is to inspect the FINISHED sprite (outline included) and
   close a cell ringed by it. Two loops, two correct rules. */
const border = pass.slice(0, pass.indexOf('CLOSE 1PX VOIDS') >= 0 ? pass.indexOf('CLOSE 1PX VOIDS') : pass.length);
ok('the border test reads the SNAPSHOT, never px -- or the border grows on itself',
  /solid\[i\+1\]/.test(border) && /solid\[i-1\]/.test(border) &&
  /solid\[i\+CW\]/.test(border) && /solid\[i-CW\]/.test(border) &&
  !/px\[i\+1\]/.test(border) && !/px\[i-CW\]/.test(border));
ok('the void-closing loop reads the FINISHED sprite, which is the only way it can work',
  /CLOSE 1PX VOIDS/.test(pass) && /if\(px\[i\+1\]&&px\[i-1\]&&px\[i\+CW\]&&px\[i-CW\]\)/.test(pass));
ok('the void close cannot eat an armpit: one empty neighbour and the cell is left alone',
  /armpits, crotch gaps and\s*\n?\s*every intentional concavity are untouched/.test(pass) || /concavity are untouched/.test(pass));
ok('it only ever writes cells that were EMPTY (his painted art is untouchable)',
  /if\(solid\[i\]\)continue;/.test(pass));
ok('COLOUR ONLY: the pass never writes the occupancy grid',
  !/grid\[/.test(pass));
ok('it is orthogonal 4-neighbour, not diagonal (diagonals make fat corners)',
  !/i\+CW\+1|i-CW-1|i\+CW-1|i-CW\+1/.test(pass));

/* ---- ORDER. Last pass or it gets covered. ------------------------------ */
const iFloater = src.indexOf('FINAL FLOATER CULL');
const iSep = src.indexOf('_SEPMAP');
/* the CALL is what must come last inside buildFrame; the definition can live
   anywhere. `if(CHAR_OUTLINE.on && !_noOutline)` is that call site. */
const iPass = src.indexOf('if(CHAR_OUTLINE.on');
/* FIND THE RETURN, DO NOT SPELL IT (8/20). This was `indexOf('  return
   {px,CW,CH};')` -- an exact literal, two leading spaces and all -- so when
   buildFrame started returning `{px,CW,CH,grid}` (additive, documented, another
   lane's work, and correct) indexOf came back -1 and a true clause reported
   false. Same shape as the four CRAFT LAW clauses that went red at the 4X hair
   refactor: the ruler was reading characters, not behaviour. Match the RETURN,
   whatever it carries. */
const mRet = src.slice(iPass).match(/\n\s*return\s*\{[^{}]*\};/);
const iRet = mRet ? iPass + mRet.index : -1;
ok('the outline runs AFTER the final floater cull, so it never outlines a dead speck',
  iFloater > 0 && iPass > iFloater);
ok('the outline runs AFTER the limb separation line, so nothing composites over it',
  iSep > 0 && iPass > iSep);
/* AND THE CLAUSE IS THE INVARIANT, NOT A BYTE BUDGET. It used to be
   `(iRet - iPass) < 2200` -- a distance, which passes for any 2,199 bytes of
   whatever, including a compositing pass that would draw straight over the
   border. What "LAST thing" actually means is that NOTHING EXECUTES between the
   outline call and the return. So strip the comments and check there is nothing
   left. A doc block may grow to any length; a statement may not appear at all. */
const between = iRet > iPass
  ? src.slice(src.indexOf('\n', iPass), iRet)
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').trim()
  : 'THE RETURN WAS NOT FOUND';
ok('the outline is the LAST thing before the frame is returned -- nothing '
  + 'executes after it' + (between ? ' (found: ' + between.slice(0, 90) + ')' : ''),
  iRet > iPass && between === '');

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

/* THE .5 PIXEL ANSWER AND ITS NEGATIVE RESULT (Paolo 7/27: "are you able to make
   it .5 pixel border. it just a little too thick"). */
ok('the alpha records why half a pixel is impossible',
  /A half pixel cannot exist on a pixel grid/.test(src));
ok('the outerOnly negative result is pinned, with its number',
  /BYTE-IDENTICAL output/.test(src) && /12,170 outline pixels either way/.test(src));
ok('the dead outerOnly knob was REMOVED, not shipped doing nothing',
  !/outerOnly:/.test(src));

done();
