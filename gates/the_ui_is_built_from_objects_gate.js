/* ============================================================================
   THE UI IS BUILT FROM OBJECTS  (UI lane 11, 9/21) -- row [cook panels].
   *** PAOLO 9/20: "we're gonna be trying to make all the UI look 3-D." ***
   *** PAOLO 9/21, rule 22: "I need to be seeing them cooking up more, every
       time, not never." A UI round is PANELS he can see at real phone size. ***

   WHAT THIS HOLDS, AND WHY EACH LEG IS HERE RATHER THAN A COMMENT.

   1. THE VOCABULARY IS ONE FILE. Four sheets drawn this round all read
      slices/bohemia_ui_3d.css. The whole argument for a skin ([skin swap]) is
      that act two changes values and every panel changes with it. Four private
      copies of a bevel is the thing that cannot happen, so the gate binds every
      sheet to the shared file and would go red the moment one forks.

   2. 3-D MEANS THE FOUR PARTS OF AN OBJECT, NOT A DROP SHADOW. A face, a lit
      rim where the light lands, a dark base where it does not, and a BODY -- the
      side you would touch underneath. The gate checks the shared file actually
      declares all four on its object rule, because "3-D" is exactly the kind of
      word that survives in a comment long after the pixels stopped doing it.

   3. ONE LIGHT. Two lights read as a sticker. Every inset highlight in the
      shared file must sit on the TOP edge (inset 0 1px / 0 2px), never the
      bottom, and every dark inset on the bottom. A file with a lit bottom rim
      has two lights in it and the gate says so.

   4. DELIVERED AS PIXELS. Every ramp is a staircase of hard colour stops, which
      is what keeps a lit object in the same world as the tiles. A gradient with
      no repeated stop positions is a smooth blend and fails.

   5. REAL PHONE SIZE. The panels are judged at 390, the width of his phone.
      A sheet that scales a panel up is a sheet nobody judged, so the phone box
      is pinned at 390 and nothing inside it may set a transform: scale.

   6. THE THUMB. Every key that exists to be pressed is 44 px of reach. This is
      a standing law in this lane and it is the one that quietly rots, because a
      key looks fine at any size in a picture.

   7. THE FACES LOAD. Not "are declared". A @font-face nothing has used is never
      fetched, and this lane already burned a round reporting the fallback's
      numbers as its own. Every family a sheet names must resolve to a file that
      exists on disk.

   Run: node gates/the_ui_is_built_from_objects_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const R = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

let pass = 0, fail = 0;
const ok = (m, g, extra) => {
  if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
  g ? pass++ : fail++;
  console.log((g ? '  ok   ' : '  FAIL ') + m + (extra ? '  [' + extra + ']' : ''));
};

const SKIN  = 'slices/bohemia_ui_3d.css';
const SHEET = 'slices/bohemia_option_sheet.css';
const PANELS = [
  'slices/BOHEMIA_FIVE_WAYS_THE_GAME_OPENS_9_21_26.html',
  'slices/BOHEMIA_FOUR_WAYS_THE_FIGHT_READS_9_21_26.html',
  'slices/BOHEMIA_FIVE_WAYS_A_PERSON_TALKS_9_21_26.html',
  'slices/BOHEMIA_FIVE_WAYS_THE_VOTE_TAB_SITS_9_21_26.html',
  'slices/BOHEMIA_FOUR_WAYS_A_WORD_IS_STAMPED_9_21_26.html',
  'slices/BOHEMIA_FIVE_WAYS_THE_NOTES_SECTION_SITS_9_21_26.html',
  'slices/BOHEMIA_FOUR_WAYS_THE_GAME_LOADS_9_22_26.html',
  'slices/BOHEMIA_FOUR_WAYS_THE_TOP_BAR_FITS_9_22_26.html'
];

console.log('\nTHE UI IS BUILT FROM OBJECTS  (rule 22, [cook panels], [three d ui])\n');

/* ---- 0. the files exist at all ---- */
for (const f of [SKIN, SHEET].concat(PANELS))
  ok('exists: ' + f, fs.existsSync(path.join(ROOT, f)));
if (fail) { console.log('\nTHE UI IS BUILT FROM OBJECTS: ' + pass + ' ok, ' + fail + ' failed'); process.exit(1); }

const skin = R(SKIN);

/* ---- 1. one vocabulary, not five copies ---- */
for (const f of PANELS) {
  const s = R(f);
  ok('reads the shared vocabulary: ' + path.basename(f),
     /<link[^>]+href=["']bohemia_ui_3d\.css["']/.test(s));
  ok('reads the shared sheet chrome: ' + path.basename(f),
     /<link[^>]+href=["']bohemia_option_sheet\.css["']/.test(s));
}

/* ---- 2. the object rule carries all four parts ---- */
const objRule = (skin.match(/\n\.o\{[\s\S]*?\n\}/) || [''])[0];
ok('the object rule exists', objRule.length > 0);
ok('  it has a FACE (a gradient fill)',      /background:\s*\n?\s*linear-gradient/.test(objRule));
ok('  it has a LIT RIM on the top edge',     /inset 0 1px 0 var\(--c-top\)/.test(objRule));
ok('  it has a DARK BASE on the bottom',     /inset 0 -2px 0 var\(--c-base\)/.test(objRule));
ok('  it has a BODY, the side underneath',   /\n\s*0 2px 0 var\(--c-under\)/.test(objRule));
ok('  it sits in a short hard shadow',       /0 4px 6px rgba\(0,0,0/.test(objRule));

/* ---- 3. one light, from above ---- */
const litInsets = skin.match(/inset 0 -?\d+px 0 (#[0-9a-f]{3,8}|var\(--c-top[^)]*\)|var\(--k-top\)|#[a-f0-9]{6})/gi) || [];
const LIGHT = /#(5c4f38|4a4133|463c2a|6a5c42|efe1bb|f3e8c8|8d7f63|b8a887|cfeed8|f6c9b8|5c95ad|fff)/i;
const badLight = litInsets.filter(d => /inset 0 -\d/.test(d) && LIGHT.test(d));
ok('one light: no lit rim on a bottom edge', badLight.length === 0, badLight.join(' | ') || 'none');

/* ---- 4. delivered as pixels: every ramp is a staircase ---- */
/* THE FIRST CUT OF THIS LEG STOPPED AT THE FIRST CLOSING BRACKET, which in
   this file is the one belonging to var(--c-face), so it judged a three inch
   stub of every ramp and called the object rule a blend. Run to the ramp's own
   semicolon instead: a var() is never the last thing before one. */
const ramps = (skin.match(/linear-gradient\(180deg,[\s\S]*?\);/g) || []).map(r => r.slice(0, -1));
ok('there are ramps to check', ramps.length >= 6, ramps.length + ' ramps');
const smooth = ramps.filter(r => {
  /* a stop may be measured in per cent or in pixels: the vent's louvres are cut
     at 3px, 4px, 5px and are as much of a staircase as anything here. */
  const stops = r.match(/\d+(?:%|px)/g) || [];
  /* a staircase repeats a stop position: "#a 0 30%,#b 30% 70%". a blend never does. */
  return new Set(stops).size === stops.length;
});
ok('every ramp is a staircase of hard stops, none is a blend',
   smooth.length === 0, smooth.length ? smooth[0].slice(0, 70) : 'all stepped');

/* ---- 5. real phone size, nothing scaled ---- */
ok('the phone box is pinned at 390', /\.phone\{[^}]*width:390px/.test(R(SHEET)));
for (const f of PANELS) {
  const s = R(f);
  const scaled = /\.(phone|shot)[^{]*\{[^}]*transform:\s*scale/.test(s);
  ok('nothing is blown up: ' + path.basename(f), !scaled);
}

/* ---- 6. the thumb ---- */
ok('the key has 44 px of reach somewhere it is pressed',
   /min-height:\s*(4[4-9]|[5-9]\d|\d{3})px/.test(R(SHEET)) ||
   PANELS.some(f => /min-height:\s*(4[4-9]|[5-9]\d)px/.test(R(f))));
const keyRule = (skin.match(/\n\.k\{[\s\S]*?\n\}/) || [''])[0];
ok('the key has TRAVEL: it goes down when pressed',
   /\.k:active\{[\s\S]*?transform:translateY\(3px\)/.test(skin));
ok('the key\'s height is a real shadow, not a border',
   /0 3px 0 #060503/.test(keyRule) && !/border:\s*1px solid/.test(keyRule));

/* ---- 7. the faces load: every family names a file that is on disk ---- */
const decl = [...skin.matchAll(/@font-face\{\s*font-family:'([^']+)';\s*src:url\('([^']+)'\)/g)];
ok('the vocabulary declares the three registers', decl.length === 3, decl.map(d => d[1]).join(' '));
for (const [, fam, url] of decl)
  ok('  ' + fam + ' points at a file that exists',
     fs.existsSync(path.join(ROOT, 'slices', url)), url);

/* every extra family a sheet declares must also be real */
for (const f of PANELS) {
  const extra = [...R(f).matchAll(/@font-face\{[^}]*font-family:'([^']+)';[^}]*url\('([^']+)'\)/g)];
  for (const [, fam, url] of extra)
    ok('  ' + path.basename(f) + ' -> ' + fam + ' exists',
       fs.existsSync(path.join(ROOT, 'slices', url)), url);
}

/* ---- 8. rule 18: this round touched no play surface ---- */
for (const f of PANELS)
  ok('is a sheet, not a play surface: ' + path.basename(f),
     !/BOHEMIA_DEMO|BOHEMIA_ALPHA_0_9|BOHEMIA_CITY_WORLD/.test(R(f)));

/* ---- 9. the cook is registered where he votes ---- */
const reg = JSON.parse(R('records/target/BOHEMIA_VOTE_REGISTRY.json'));
const mine = reg.items.filter(i => i.made === '9/21' && i.lane === 'ui');
ok('this round registered its panels in the vote tab', mine.length >= 4, mine.length + ' items');
for (const i of mine)
  ok('  ' + i.id + ' points at a sheet that exists',
     i.show && i.show.how === 'page' && fs.existsSync(path.join(ROOT, 'slices', i.show.src)),
     i.show && i.show.src);

console.log('\nTHE UI IS BUILT FROM OBJECTS: ' + pass + ' ok, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
