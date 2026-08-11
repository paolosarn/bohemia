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
const LADDER = 'records/BOHEMIA_THE_BOSS_LADDER_v2_8_7_26.md';
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
  const m = line.match(/^\|\s*(\d+)\s*\|\s*\*\*([^*]+)\*\*\s*\|([^|]*)\|([^|]*)\|([^|]*)\|/);
  if (m) rows.push({ n: +m[1], boss: m[2].trim(), holds: m[3].trim(),
                     lock: m[4].trim(), key: m[5].trim() });
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
const IMPOSSIBLE = /\b(cannot|can not|can't|no |nobody|nothing|is zero|too (big|heavy|far)|only|dies|permanent|capped|belongs to|scenery|temporary|ends your)\b/i;
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
ok('D3 the merge is stated as a merge, not a quiet deletion',
   /folded into THE STRIPPER/i.test(lad) && /Same verb/i.test(lad));

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
   /population cap is ZERO/i.test(lad) && /settler will accept a bed/i.test(lad));
ok('E4 THE DRAIN\'s lock is the filth itself, not the word habitable',
   /filth/i.test((rows.find(r => r.boss === 'THE DRAIN') || {}).lock || ''));
ok('E5 THE VOICE is rebuilt around THE PHONE and people ARRIVING, not broadcasting',
   /phone/i.test((rows.find(r => r.boss === 'THE VOICE') || {}).key || '') &&
   !/broadcast/i.test((rows.find(r => r.boss === 'THE VOICE') || {}).key || ''));
ok('E6 and THE VOICE is marked NOT APPROVED, because he said he was not saying he liked it',
   /explicitly did NOT approve/i.test(flat));
ok('E7 THE SUMMON is recorded as HIS invention with clout-as-mana flagged PENDING',
   /final fantasy summon/i.test(rul) && /CLOUT IS THE MANA/i.test(rul) &&
   /\[PENDING Paolo\]/.test(rul));
ok('E8 THE BOOK\'s key is a person ARRIVING, which is what a summon is',
   /ARRIVES/i.test((rows.find(r => r.boss === 'THE BOOK') || {}).key || ''));

/* ---- THE RESEARCH CORRECTION IS KEPT, BECAUSE IT IS LOAD-BEARING -------- */
ok('F1 it records that Valheim\'s forsaken powers are BUFFS and not keys',
   /PASSIVE BUFFS, NOT KEYS/i.test(lad));
ok('F2 and that what really gates Valheim is the biome MATERIALS he already killed',
   /material vibes/i.test(lad));
ok('F3 and names the genre this ladder is actually copying',
   /IT IS METROID/i.test(lad) && /lock-and-key/i.test(lad));
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
   /stays as the history/i.test(flat) && /byte-identical/i.test(lad));

console.log('-'.repeat(74));
console.log('  ' + rows.length + ' bosses · ' + seenLock.size + ' distinct locks · ' +
            seenVerb.size + ' distinct key verbs · ' + DEAD.length + ' dead');
console.log('='.repeat(74));
console.log('  BOSS LADDER GATE: ' + pass + ' pass / ' + fail + ' fail');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
