/* ============================================================================
   BOSS LADDER GATE (8/7/26, LAB lane)

   HE FOUND A BUG BY EYE THAT NOTHING IN THIS REPO COULD SEE, AND THIS IS THE
   MACHINE FOR IT.

   Paolo, 8/7, reading the ladder:
       "THE STRIPPER / THE WRECKER / THE TOLL -- these are the exact same bro"

   He was right. Strip a building for materials, take a building down, clear a
   blocked road: THREE BOSSES, ONE VERB. It sat there for four days across two
   passes and a 131-check gate, because every check asked whether the ladder was
   well-FORMED (count matches, entries run 1..N, additions are marked) and not one
   asked whether two entries were THE SAME THING.

   THE RULE THIS HOLDS:
       ONE BOSS = ONE LOCK = ONE THING THAT WAS IMPOSSIBLE AND NOW IS NOT.
       NO TWO BOSSES MAY OPEN THE SAME LOCK.

   WHY A LOCK AND NOT A POWER. The collapse happened because bosses were generated
   from NOUNS -- water, fuel, salvage, demolition, passage -- and owning a noun does
   not make a distinct power. Three nouns produced one verb. A LOCK is stated as an
   impossibility ("a sealed building is a wall you cannot pass"), and two
   impossibilities are much harder to accidentally make identical than two nouns.

   WHAT IT CANNOT DO, STATED UP FRONT. It cannot read two English sentences and
   decide they mean the same thing -- that is the subject-blind prose problem this
   lane already proved unbuildable (records/BOHEMIA_CANON_CONSTANTS.md). What it CAN
   do is force every boss to declare a lock, hold those declarations distinct as
   strings, and catch the specific shapes the failure took: a duplicated KEY VERB,
   a lock written as a bare noun, and the three merged names coming back.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LADDER = 'records/BOHEMIA_THE_BOSS_LADDER_v5_8_7_26.md';
const RULINGS = 'records/BOHEMIA_HIS_BOSS_RULINGS_8_7_26.md';

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('BOSS LADDER GATE — one boss, one lock, and no two bosses open the same');
console.log('                   door. The bug he found by eye, machine-held.');
console.log('='.repeat(74));

ok('A1 the live ladder exists', fs.existsSync(path.join(ROOT, LADDER)));
ok('A2 his rulings are recorded verbatim in their own file', fs.existsSync(path.join(ROOT, RULINGS)));
if (!fs.existsSync(path.join(ROOT, LADDER))) process.exit(1);
const lad = fs.readFileSync(path.join(ROOT, LADDER), 'utf8');
const rul = fs.existsSync(path.join(ROOT, RULINGS)) ? fs.readFileSync(path.join(ROOT, RULINGS), 'utf8') : '';
const flat = lad.replace(/\s+/g, ' ');

/* ---- parse the three act tables: | # | BOSS | HOLDS | LOCK | KEY | ---------- */
const rows = [];
lad.split('\n').forEach(line => {
  const m = line.match(/^\|\s*(\d+)\s*\|\s*\*\*([^*]+)\*\*\s*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/);
  if (m) rows.push({ n: +m[1], boss: m[2].trim(), holds: m[3].trim(), lock: m[4].trim(),
                     key: m[5].replace(/\*+/g, '').trim(),       /* WHAT BESTING GRANTS */
                     kind: m[6].trim() });
});
ok('B1 every boss row parses with all four fields (' + rows.length + ' bosses)', rows.length >= 15);
ok('B2 the numbers run 1..N with no gaps or duplicates',
   rows.map(r => r.n).every((n, i) => n === i + 1));
ok('B3 no boss is missing its LOCK or its KEY',
   rows.every(r => r.lock.length > 8 && r.key.length > 8));

/* ---- THE CHECK THAT WOULD HAVE CAUGHT HIM ------------------------------- */
const norm = s => s.toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
const dupLocks = [], seenLock = new Map();
rows.forEach(r => {
  const k = norm(r.lock);
  if (seenLock.has(k)) dupLocks.push(seenLock.get(k) + ' / ' + r.boss);
  else seenLock.set(k, r.boss);
});
ok('C1 NO TWO BOSSES DECLARE THE SAME LOCK' + (dupLocks.length ? ' -> ' + dupLocks.join('; ') : ''),
   dupLocks.length === 0);

/* THE KEY VERB. The failure was three DIFFERENT locks resolving to one verb, so
   the lock strings alone would not have caught it. The verb is the first word of
   the key, which is where a duplicate power actually shows. */
const STOP = new Set(['a', 'an', 'the', 'you', 'your', 'so', 'and', 'it', 'that']);
const verbOf = s => norm(s).split(' ').find(w => w && !STOP.has(w)) || '';
const dupVerbs = [], seenVerb = new Map();
rows.forEach(r => {
  const v = verbOf(r.key);
  if (seenVerb.has(v)) dupVerbs.push(v + ': ' + seenVerb.get(v) + ' / ' + r.boss);
  else seenVerb.set(v, r.boss);
});
ok('C2 NO TWO BOSSES OPEN WITH THE SAME KEY VERB — the exact shape of the ' +
   'strip/wreck/toll collapse' + (dupVerbs.length ? ' -> ' + dupVerbs.join('; ') : ''),
   dupVerbs.length === 0);

/* A LOCK MUST BE AN IMPOSSIBILITY, NOT A NOUN. This is the rule that stops the
   generator that caused the bug: "salvage" is a noun and three people can own it,
   "a sealed building is a wall you cannot pass" is a state of the world and it is
   much harder to write twice by accident. */
const IMPOSSIBLE = /\b(cannot|can not|can't|never|no |nobody|nothing|is zero|too (big|heavy|far)|only|dies|permanent|capped|belongs to|scenery|temporary|ends your|guarantees)\b/i;
const nouny = rows.filter(r => !IMPOSSIBLE.test(r.lock));
ok('C3 every LOCK is stated as an IMPOSSIBILITY rather than a noun somebody owns' +
   (nouny.length ? ' -> ' + nouny.map(r => r.boss).join(',') : ''),
   nouny.length === 0);

/* ---- THE MERGE AND THE KILLS STAY DEAD ---------------------------------- */
const DEAD = ['THE WRECKER', 'THE TOLL', 'THE CHANNEL', 'THE JUDGE', 'THE BROKER'];
const resurrected = DEAD.filter(d => rows.some(r => r.boss.toUpperCase() === d));
ok('D1 none of the five killed bosses is back on the ladder' +
   (resurrected.length ? ' -> ' + resurrected.join(',') : ''),
   resurrected.length === 0);
ok('D2 and each of the five is accounted for by name with a reason',
   DEAD.every(d => new RegExp(d.replace(/ /g, '\\s+') + '[\\s\\S]{0,400}?(KILLED|folded)', 'i').test(lad)));
/* D3's TARGET RENAMED. He redefined THE STRIPPER into demolition, so it is THE CHARGE now.
   The check follows the ruling: the merge must still be stated AS a merge, and the rename
   must be stated as a rename rather than looking like a sixth kill. */
ok('D3 the merge is stated as a merge, and the rename as a rename',
   /folded into the breaching boss/i.test(flat) && /Same verb/i.test(flat) &&
   /THE STRIPPER IS GONE AS A NAME\*?\*?, not as a boss/i.test(flat));

/* ---- HIS RULINGS ACTUALLY LANDED, NOT JUST GOT FILED ------------------- */
const bossAt = n => (rows.find(r => r.n === n) || {}).boss;
const actOf = name => {
  const i = lad.indexOf('**' + name + '**');
  const a1 = lad.indexOf('## ACT 1'), a2 = lad.indexOf('## ACT 2'), a3 = lad.indexOf('## ACT 3');
  return i > a3 ? 3 : i > a2 ? 2 : i > a1 ? 1 : 0;
};
ok('E1 THE CLIMB moved to ACT 1 on his ruling', actOf('THE CLIMB') === 1);
ok('E2 THE SOIL is the FIRST boss of ACT 2 on his ruling ("pls")',
   actOf('THE SOIL') === 2 &&
   rows.filter(r => actOf(r.boss) === 2).sort((a, b) => a.n - b.n)[0].boss === 'THE SOIL');
ok('E3 HABITABLE is DEFINED in one concrete sentence, because he asked what it meant',
   /population cap is ZERO/i.test(flat) && /settler will accept a bed/i.test(flat));
ok('E4 THE DRAIN\'s lock is the filth itself, not the word habitable',
   /filth/i.test((rows.find(r => r.boss === 'THE DRAIN') || {}).lock || ''));
ok('E5 THE VOICE is still built around THE PHONE and people arriving',
   /phone calls people IN/i.test((rows.find(r => r.boss === 'THE VOICE') || {}).key || ''));
ok('E6 and THE VOICE is marked NOT APPROVED, because he said he was not saying he liked it',
   /explicitly did NOT approve/i.test(flat));
ok('E7 THE SUMMON is recorded as HIS invention with clout-as-mana flagged PENDING',
   /final fantasy summon/i.test(rul) && /CLOUT IS THE MANA/i.test(rul) &&
   /\[PENDING Paolo\]/.test(rul));
/* E8 MOVED WITH THE RULING. In v2 the summon was THE BOOK's only grant; in v3 it is
   specifically the SPARE route, and killing THE BOOK voids every debt instead. The
   check follows the ruling rather than pinning the old one. */
/* THE BOOK IS NOW THE CREDITOR. Paolo: "HOW DOES A BOOK DICTATE THIS" -- a ledger is
   paper, so the holder was wrong. The summon survives, on a person who is owed. */
ok('E8 the summon lives on THE CREDITOR, not on a book',
   !rows.some(r => r.boss === 'THE BOOK') &&
   /call a debt in/i.test((rows.find(r => r.boss === 'THE CREDITOR') || {}).key || ''));

/* ---- THE RESEARCH CORRECTION IS KEPT, BECAUSE IT IS LOAD-BEARING -------- */
ok('F1 it records that Valheim\'s forsaken powers are BUFFS and not keys',
   /PASSIVE BUFFS, NOT KEYS/i.test(flat));
ok('F2 and that what really gates Valheim is the biome MATERIALS he already killed',
   /material vibes/i.test(flat));
/* ON `flat`, NOT `lad`. This failed because the doc hard-wraps and the phrase landed as
   "IT IS\nMETROID'S" -- prose does not respect line endings and a check on prose must not
   either. Same lesson lab_gate.js's A24 learned the hard way; every prose assertion below
   now runs on the whitespace-collapsed text. */
ok('F3 and names the genre this ladder is actually copying',
   /IT IS METROID/i.test(flat) && /lock-and-key/i.test(flat));
ok('F4 the sources are cited, so the claims are checkable',
   /valheim\.fandom\.com\/wiki\/Forsaken_power/.test(lad) &&
   /fallout\.fandom\.com\/wiki\/Recruitment_radio_beacon/.test(lad));

/* ---- STILL HIS ---------------------------------------------------------- */
ok('G1 no damage number, no cost, no dial anywhere on the ladder',
   !/\b\d+\s*(hp|damage|dmg|seconds?|clout)\b/i.test(lad));
ok('G2 it says the count is not a target and more is allowed',
   /not because \d+ is a target/i.test(flat));
ok('G3 it keeps the names as HANDLES and reserves who these people are to him',
   /handles for a mechanism/i.test(flat) && /CONTENTS-PAOLO'S/.test(lad));
ok('G4 v1 is preserved as history rather than overwritten',
   /stays? as the history/i.test(flat) && /byte-identical/i.test(flat));

/* ==========================================================================
   PART H (v3) — BESTING IS NOT KILLING, AND THE TWO ROUTES MUST DIFFER.

   Paolo 8/7: "its the emphasis that killing or defeating peacfully that boss
   unlocks a way to build the game in whatever direction customize or better
   equipment". Two rulings: every boss is sparable, and the grant is a DIRECTION
   rather than a single door -- which means gear and customization count, and v2's
   all-world-verb grants were too narrow.

   THE FAILURE THIS GUARDS: a spare route that is just the kill route reworded.
   If sparing gives you the same capability, the choice is fake and the ladder is
   back to one grant per boss wearing two names -- the same disease as
   strip/wreck/toll, one level up.
   ========================================================================== */
/* H1 NO LONGER ASKS FOR TWO ROUTES. The spare column is gone on his ruling, so the only
   thing every boss must still declare is WHAT BESTING IT GRANTS. */
ok('H1 every boss declares what besting it grants',
   rows.every(r => r.key.length > 8));

/* H2/H3 ARE RETIRED BECAUSE HE KILLED WHAT THEY GUARDED. They held the SPARE column
   distinct from the KILL column. Paolo 8/7: "I DONT WANT TO FOCUS TOO MUCH ON THE SPARE
   YOU GAIN THE PERSON SHIT BECAUSE ITS SLOP BUT". A GATE MUST NEVER OUTRANK A RULING, so
   the column is gone and these two retire with it. What replaces them is narrower and
   matches what he actually said: the peaceful route STILL EXISTS -- he never said it did
   not -- it is simply no longer a per-boss column. */
ok('H2 the SPARE column is GONE from the tables, because he called it slop',
   rows.every(r => r.spare === undefined) && !/SPARE → YOU GAIN THE PERSON/.test(lad));
ok('H3 but the peaceful route is still recorded as existing, kept short on purpose',
   /every boss can be bested without killing them/i.test(flat) &&
   /KEPT SHORT ON PURPOSE/i.test(lad));

/* THIN added 8/7: he asked for a big POOL to cut from, so I flag my own weak
   candidates rather than making him find them. It is a legal kind but it is NOT counted
   toward the four-kinds-really-used check below. */
const KINDS = ['WORLD', 'GEAR', 'LOOK', 'PEOPLE', 'THIN'];
const REAL_KINDS = ['WORLD', 'GEAR', 'LOOK', 'PEOPLE'];
const badKind = rows.filter(r => KINDS.indexOf(r.kind) < 0);
ok('H4 every boss declares one of the four grant KINDS' +
   (badKind.length ? ' -> ' + badKind.map(r => r.boss + ':' + r.kind).join(',') : ''),
   badKind.length === 0);
const counts = {};
KINDS.forEach(k => counts[k] = rows.filter(r => r.kind === k).length);
ok('H5 ALL FOUR REAL KINDS ARE USED, because he named gear and customization as the ' +
   'missing ones (' + KINDS.map(k => k + ' ' + counts[k]).join(', ') + ')',
   REAL_KINDS.every(k => counts[k] >= 3));
ok('H6 GEAR front-loads to act 1 and PEOPLE back-loads to act 3, so the acts really ' +
   'do escalate',
   rows.filter(r => r.kind === 'GEAR' && actOf(r.boss) === 1).length >=
   rows.filter(r => r.kind === 'GEAR' && actOf(r.boss) === 3).length &&
   rows.filter(r => r.kind === 'PEOPLE' && actOf(r.boss) === 3).length >=
   rows.filter(r => r.kind === 'PEOPLE' && actOf(r.boss) === 1).length);

/* H7 AND H8 ARE RETIRED WITH THE COLUMN THEY GUARDED. They asserted the kill-vs-spare
   BALANCE ("the kill route is not the strong route by default"), which only means something
   while the spare route is a co-equal reward tree. He called that slop. H3 above holds the
   part that survives -- the peaceful route still exists, kept short. A GATE MUST NEVER
   OUTRANK A RULING, so these retire rather than forcing the doc to keep arguing a closed
   case. */
ok('H9 NO MORALITY METER — the choice is economic, not a karma bar',
   /NOT COPYING: a morality meter/i.test(flat) && !/karma (bar|meter|points)/i.test(
     flat.replace(/no karma bar/i, '')));
ok('H10 the kill/spare research is cited so the "spare pays better" claim is checkable',
   /sifu\.fandom\.com/.test(lad) && /Mercy_?Rewarded|MercyRewarded/i.test(lad));
ok('H11 the summon is a person ARRIVING, which is what he invented',
   /somebody arrives/i.test((rows.find(r => r.boss === 'THE CREDITOR') || {}).key || ''));
ok('H12 he asked for MORE again, so the count went UP from 41 (' + rows.length + ')',
   rows.length > 41);
ok('H13 and it declares itself a POOL TO CUT FROM rather than a shipping list, with my own ' +
   'weak ones flagged THIN (' + counts.THIN + ')',
   /POOL TO CUT FROM, NOT A SHIPPING LIST/i.test(lad) && counts.THIN >= 1);

/* ==========================================================================
   PART J (v4) — HIS FOUR STRUCTURAL RULINGS, AND THE LESSON FROM THE FIVE KILLS.
   ========================================================================== */
ok('J1 ACT 3 IS SLIGHTLY FUTURISTIC AND NOT JUST RECOVERY, on his Night City ruling',
   /EARLY NIGHT CITY/i.test(lad) && /slightly futuristic/i.test(flat));
ok('J2 and it records WHY Night City is the right reference: the rebuild WAS the takeover',
   /THE REBUILD \*?WAS\*? THE TAKEOVER/i.test(flat) &&
   /supplying the rebuild is how they came to own it/i.test(flat));
ok('J3 the futurism arrives WITH AN OWNER, so it is a bill and not a reward',
   /owner attached/i.test(flat) || /name on the invoice/i.test(flat));
/* THE BOOT DROPS OUT OF THE SPINE because he killed it ("THATS BULLSHIT LMAO") and he was
   right. THE WING replaces it at the far end, so the spine still spans all three acts. */
ok('J4 TRANSPORT is a spine through all three acts, because he said it was thin',
   /IS NOW A SPINE/i.test(flat) &&
   ['THE SPOKE','THE CART','THE ROAD','THE ENGINE','THE RAIL','THE LIFT','THE WING']
     .every(b => rows.some(r => r.boss === b)));
ok('J5 and the research reason transport is not a luxury tier is stated',
   /cannot have metallurgy without transport/i.test(flat));
ok('J6 FOOD IS FIRST in act 2, because that is what the rebuilding research says',
   (rows.filter(r => actOf(r.boss) === 2).sort((a, b) => a.n - b.n)[0] || {}).boss === 'THE SOIL' &&
   /it does not start with technology, it starts with FOOD/i.test(flat));
/* J7 REVERSED ON HIS RULING. It used to assert the shoe finding was recorded as a LOCK.
   He called it bullshit and he was right: I generalised PU-midsole hydrolysis into "every
   shoe", which does not follow (most sneakers are EVA, leather welts last decades). So the
   check now asserts the CORRECTION is on the record and THE BOOT is really gone -- a gate
   that kept demanding the overclaim would be outranking the ruling. */
ok('J7 the shoe OVERCLAIM is corrected on the record and THE BOOT is dead',
   !rows.some(r => r.boss === 'THE BOOT') &&
   /I OVERSTATED THE SHOE FINDING/i.test(flat) &&
   /most sneakers use EVA foam/i.test(flat) &&
   /survives as world texture/i.test(flat));
ok('J8 the gun finding is recorded and pipe weapons landed in ACT 1 as he guessed',
   actOf('THE MACHINIST') === 1 && /trivially/i.test(flat) &&
   /What is genuinely hard is AMMUNITION/i.test(flat));
ok('J9 every boss he re-acted actually moved: PLATE+MIDWIFE act1, BONES+ENGINE act2',
   actOf('THE PLATE') === 1 && actOf('THE MIDWIFE') === 1 &&
   actOf('THE BONES') === 2 && actOf('THE ENGINE') === 2);
ok('J10 THE ENGINE closes act 2, since he said end of act 2',
   (rows.filter(r => actOf(r.boss) === 2).sort((a, b) => b.n - a.n)[0] || {}).boss === 'THE ENGINE');
ok('J11 the five he was CONFUSED by are dead, and his words are on the record',
   ['THE WATCH', 'THE ARCHITECT', 'THE SIGN', 'THE STILL', 'THE FIXER']
     .every(b => !rows.some(r => r.boss === b)) && /DELETE THIS IS ASS/i.test(lad));
ok('J12 ★ AND THE LESSON IS WRITTEN DOWN: four died because the LOCK was invented to ' +
   'justify a boss I wanted',
   /the LOCK was invented to justify a boss I wanted/i.test(flat) &&
   /If you cannot name the wall without inventing it, there is no boss/i.test(flat));
ok('J13 THE SCHOOL now has a real mechanical stake, because he said he could not see one',
   /your heir starts at zero/i.test(lad));
ok('J14 HE RULED IT: improvised demolition charges, NOT radiological, and no rad mechanic ' +
   'enters through this door',
   /improvised demolition charges/i.test(flat) && /Not radiological/i.test(flat) &&
   /no rad mechanic enters the game through this door/i.test(flat));

console.log('-'.repeat(74));
console.log('  ' + rows.length + ' bosses · ' + seenLock.size + ' distinct locks · ' +
            seenVerb.size + ' distinct grant verbs · ' + DEAD.length + ' dead');
console.log('  KINDS: ' + KINDS.map(k => k + ' ' + counts[k]).join('  ') +
            '   ACTS: ' + [1,2,3].map(a => 'act' + a + ' ' +
            rows.filter(r => actOf(r.boss) === a).length).join('  '));
console.log('='.repeat(74));
console.log('  BOSS LADDER GATE: ' + pass + ' pass / ' + fail + ' fail');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
