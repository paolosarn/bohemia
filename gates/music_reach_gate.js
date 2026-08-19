// BOHEMIA MUSIC REACH GATE (8/4/26, SOUNDS lane)
//
// HIS TAGGING MUST REACH THE GAME.
//
// On 8/4 I found, by hand, that CITYMUS.phase was hardcoded to 'NIGHT'. The
// consequence: every song Paolo tagged OVERWORLD DAY or OVERWORLD DUSK/DAWN was
// unplayable in the run. Seven songs. One of them was THE MARKER ON THE DOOR --
// the only song in this project he has ever said he likes, tagged OVERWORLD DAY
// by his own hand, silent since the day he tagged it.
//
// Nothing caught it because nothing was ASKING. Every music gate checks that
// songs parse, that voices exist, that his verdicts are baked. None of them
// asked the one question that actually matters to him: CAN I HEAR IT?
//
// This gate asks it for every category at once, so the next one cannot hide.
//
// THE THREE WAYS A TAGGED SONG IS REACHABLE, and they are the only three:
//   1. OVERWORLD DAY / NIGHT / DUSK-DAWN -> the CITYMUS shuffle, but ONLY if
//      something can actually move CITYMUS.phase. A phase pinned to one value
//      makes the other pools dead, which is exactly what happened.
//   2. a category whose name is an MFACTIONS slot -> combat's encounter
//      rotation, via out.pools (Paolo 7/19: "it just enters the pool").
//   3. nothing else. Anything else is a tag with no player.
//
// GRAVEYARDED SONGS ARE NOT CHECKED. A song he thumbed DOWN is supposed to be
// unreachable; demanding a player for it would be demanding a corpse be heard.
const fs = require('fs'), path = require('path');
const ALPHA = path.join(__dirname, '../slices/BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
if (!fs.existsSync(ALPHA)) { console.log(`\n=== MUSIC REACH GATE: ${p} passed, ${f} failed ===`); process.exit(1); }
const src = fs.readFileSync(ALPHA, 'utf8');

// ---- his tags, his verdicts, the song list -------------------------------
const catBlock = /const CAT_DEFAULTS=\{([\s\S]*?)\};/.exec(src);
ok('CAT_DEFAULTS parses', !!catBlock);
const canonBlock = /const CANON_DEFAULTS=\{([\s\S]*?)\};/.exec(src);
ok('CANON_DEFAULTS parses', !!canonBlock);

const tags = {};   // song -> [categories]
if (catBlock) {
  for (const m of catBlock[1].matchAll(/'([^']+?)#\d+'\s*:\s*\[([^\]]*)\]/g)) {
    tags[m[1]] = [...m[2].matchAll(/'([^']+)'/g)].map(x => x[1]);
  }
}
const verdict = {};
if (canonBlock) {
  for (const m of canonBlock[1].matchAll(/'([^']+?)#\d+'\s*:\s*(-?\d+)/g)) verdict[m[1]] = +m[2];
}
const mloopsIdx = src.indexOf('const MLOOPS=[');
const mloops = new Set([...src.slice(mloopsIdx, src.indexOf('\n];', mloopsIdx))
  .matchAll(/\{n:'([^']+)'/g)].map(m => m[1]));
const mfIdx = src.indexOf('const MFACTIONS=[');
const factions = new Set([...src.slice(mfIdx, src.indexOf('\n];', mfIdx))
  .matchAll(/\{n:'([^']+)'/g)].map(m => m[1]));
ok('MLOOPS has songs', mloops.size > 50);
ok('MFACTIONS has slots', factions.size > 5);

// ---- 1. CAN THE OVERWORLD PHASE ACTUALLY MOVE? ---------------------------
// This is the check that would have caught the bug that started this file. A
// hardcoded phase is not a bug you can see by reading the pools; it is a bug in
// whether anything ever WRITES the phase.
// A MENTION IS NOT A USE, and this gate caught ITSELF breaking that law.
// The first version tested the raw source, and the raw source contains the
// COMMENT that describes the bug -- "whoever builds the clock sets
// CITYMUS.phase = 'DAY'|'DUSK'|'DAWN'|'NIGHT'". The regex matched the comment,
// so the check passed on the very build where the phase was pinned. It would
// have caught nothing, while reading like the thing that catches everything.
// Proved by mutation: deleting the real assignment left it green.
// Strip comments first, then ask.
const code = src
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/(^|[^:'"\\])\/\/[^\n]*/g, '$1 ');
const writesPhase = /CITYMUS\s*\.\s*phase\s*=\s*[A-Za-z_$]/.test(code);
ok('something can MOVE the overworld phase (a pinned phase makes whole pools dead, '
   + 'which is how 7 of his songs went unplayable)', writesPhase);
// and all four phases must be produceable, not just two
for (const ph of ['NIGHT', 'DAWN', 'DAY', 'DUSK']) {
  ok(`the phase setter can produce ${ph}`, new RegExp(`'${ph}'`).test(src));
}
// the phase windows must agree with the ambience day/night split, or the bed
// and the music disagree about whether it is dark
ok('the phase windows use the same 06:00/19:00 split as the ambience bed',
   /6\*60/.test(src) && /19\*60/.test(src));

// ---- 2. EVERY CANON TAG HAS A PLAYER -------------------------------------
// THE MENU WAIVER IS DEAD (8/19/26). It stood for fifteen days as "no menu music
// player exists; putting music on the front splash is a design decision (his),
// not a wiring fix" -- and going to wire it found something the waiver was
// standing in front of: `let CITYMUS_ON=false` in the city world. THE MUSIC
// SHIPPED OFF. You opened the link, tapped in, and the game was silent until you
// found a button in the city toolbar. 124 finished songs behind a toggle. The
// waiver was a hole in the wall of a house with no roof.
// MENUMUS now opens the game on a MENU song inside the tap gesture -- the one
// moment a browser will let audio start -- and hands over to the street shuffle
// on the phrase boundary. So MENU has a player, and there is nothing left to
// waive. The map stays EMPTY on purpose: an empty waiver list is the assertion
// that every category he has tagged can actually be heard.
const WAIVED = {};

// and the player has to still be there. A category with a player that got
// deleted in a rebase is the same silence with better paperwork -- which is
// exactly how the standalone notice went missing on 8/17.
ok('the menu opening exists (MENUMUS)', /const MENUMUS=\{/.test(src));
ok('the menu opening is armed by the tap that enters the game',
   /MENUMUS\.open\(\)/.test(src));
ok('the menu opening hands over to the street shuffle',
   /handOff\(\)[\s\S]{0,400}CITYMUS\.startShuffle\(\)/.test(src));
ok('the menu opening never plays a buried song',
   /candidates\(\)[\s\S]{0,700}MUS\.V\[n\+'#1'\]===0\)continue;/.test(src));
const OVERWORLD = ['OVERWORLD DAY', 'OVERWORLD NIGHT', 'OVERWORLD DUSK/DAWN'];
// THE THIRD WAY (8/19). There used to be exactly two ways a tagged song could
// reach a player -- the overworld shuffle and combat's faction pool -- and
// anything else was unreachable or waived. MENUMUS is the third: it is a real
// player, wired to a real gesture, proved above by the four checks that would
// go red if any part of it were deleted. So MENU is REACHABLE, not waived.
const MENU_PLAYER = /const MENUMUS=\{/.test(src) && /MENUMUS\.open\(\)/.test(src);

const unreachable = [];
const waivedSeen = {};
for (const song of Object.keys(tags)) {
  if (verdict[song] === 0) continue;                 // graveyarded: silence is correct
  if (!mloops.has(song)) continue;                   // not in the working list at all
  for (const cat of tags[song]) {
    if (OVERWORLD.includes(cat)) continue;           // the shuffle, checked above
    if (factions.has(cat)) continue;                 // combat's pool
    if (cat === 'MENU' && MENU_PLAYER) continue;     // the opening
    if (WAIVED[cat]) { (waivedSeen[cat] = waivedSeen[cat] || []).push(song); continue; }
    unreachable.push(`${song} -> ${cat}`);
  }
}
ok('every category he tagged has something that can play it: ' + (unreachable.length
     ? unreachable.slice(0, 6).join(' | ')
     : 'all reachable'),
   unreachable.length === 0);

// ---- 3. AND THE SONG HE ACTUALLY LIKES -----------------------------------
// Not sentiment. It is the single strongest signal in the whole music record and
// it was the one that broke, so it gets its own named check.
if (mloops.has('THE MARKER ON THE DOOR')) {
  ok('THE MARKER ON THE DOOR is still tagged and still canon (the only song he '
     + 'has ever said he likes)',
     verdict['THE MARKER ON THE DOOR'] === 2
     && (tags['THE MARKER ON THE DOOR'] || []).length > 0);
}

for (const cat in waivedSeen) {
  console.log(`  WAIVED: ${cat} (${waivedSeen[cat].length} canon song(s)) -- ${WAIVED[cat]}`);
}
console.log(`  ${Object.keys(tags).length} tagged songs swept, ${factions.size} faction pools, `
  + `${OVERWORLD.length} overworld phases`);
console.log(`\n=== MUSIC REACH GATE: ${p} passed, ${f} failed ===`);
process.exit(f ? 1 : 0);
