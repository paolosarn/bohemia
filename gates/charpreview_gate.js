// BOHEMIA CHARACTER PREVIEW GATE (7/26/26). FACTORY LAW: new machinery ships
// with its own regression gate, same turn.
//
// Paolo 7/26/26: "in the character menu I would like to see a shuffle Animation
// button in the bottom right or something of the actual box that shows the
// character in the character menu just so I can see it."
//
// The preview box used to be a hardcoded idle loop. This locks the transport
// that replaced it, and locks WHY it matters: the body sliders sit two inches
// under that box, and the addendum's lesson 7 (the one that killed the woman
// rig) is that a body is judged THROUGH THE ANIMATIONS, never off an idle pose.
// If this button ever silently reverts, slider verdicts go back to being taken
// on a standing statue.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
if (f) { console.log(`\n=== CHARACTER PREVIEW GATE: ${p} passed, ${f} failed ===`); process.exit(1); }
const src = fs.readFileSync(ALPHA, 'utf8');

// the box itself
ok('the preview canvas sits in a positioned stage (so the button can be INSIDE the box)',
  /id="charStage"[^>]*position:relative/.test(src));
ok('the SHUFFLE ANIM button exists and is pinned to the bottom RIGHT of the box (his words)',
  /id="charShuf"[\s\S]{0,240}position:absolute[\s\S]{0,120}right:/.test(src)
  && /id="charShuf"[\s\S]{0,240}bottom:/.test(src)
  && /SHUFFLE ANIM/.test(src));
ok('the current clip is named on screen, bottom left', /id="charClipLbl"[\s\S]{0,240}position:absolute[\s\S]{0,120}left:/.test(src));
ok('the button is inside the stage, not floating in the panel',
  src.indexOf('id="charShuf"') > src.indexOf('id="charStage"') &&
  src.indexOf('id="charShuf"') < src.indexOf('id="portraitCv"'));

// the transport
ok('charShuffle() exists', /function charShuffle\(\)/.test(src));
ok('the shuffle draws from the REAL clip table, not a hand-typed list', /CLIPS\.filter\(c=>!TERMINAL\[c\]/.test(src));
ok('TERMINAL clips are excluded (a shuffle must never leave a corpse on the character screen)',
  /CLIPS\.filter\(c=>!TERMINAL\[c\]&&c!==G\.charClip\)/.test(src));
ok('it never re-picks the clip already playing', /c!==G\.charClip/.test(src));
ok('tapping the clip name resets to idle', /function charClipReset\(\)/.test(src) && /charClipLbl'\);if\(l\)l\.onclick=charClipReset/.test(src));
ok('both controls are actually wired to the DOM', /charShuf'\);if\(b\)b\.onclick=charShuffle/.test(src));

// the loop
ok('the character-tab loop plays G.charClip, not a hardcoded idle',
  /charOn\)\{[\s\S]{0,900}G\.charClip\|\|'idle'[\s\S]{0,700}drawChar\(document\.getElementById\('charCv'\),G\.dir,_cc,ph\)/.test(src));
ok('the preview runs on its own clock, so shuffling restarts the clip cleanly',
  /G\.charT0\|\|G\.t0/.test(src) && /charT0:0/.test(src));
ok('the clip beat count comes from ANIMBEATS (120 BPM LAW), never a fixed duration',
  /const _cb=ANIMBEATS\[_cc\]\|\|2/.test(src));
ok('the old hardcoded idle draw is gone', src.indexOf("drawChar(document.getElementById('charCv'),G.dir,'idle',ph)") < 0);

ok('the character box draws WITHOUT the rig skeleton (it is a body preview, not a rig view)',
  /const _sk=G\.showSkel;G\.showSkel=false;[\s\S]{0,200}drawChar\(document\.getElementById\('charCv'\)[\s\S]{0,60}G\.showSkel=_sk/.test(src));
ok('the ANIMATION tab keeps its SHOW SKELETON toggle (the rig work still needs it)', /id="skelToggle"/.test(src));

// the reason it exists
ok('the body sliders are on the same screen as the preview (judge through the animations)',
  src.indexOf('BODY_VAR_ROW') >= 0 && src.indexOf('id="charSlots"') >= 0);

console.log(`\n=== CHARACTER PREVIEW GATE: ${p} passed, ${f} failed ===`);
process.exit(f ? 1 : 0);
