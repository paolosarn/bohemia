/* ============================================================================
   BOND OUTLIVES GATE (9/13/26, QUESTS lane) -- VAMILY row [bond outlives],
   NAMING-SOMEBODY-FOR-GOOD-NEEDS-A-RECORD-THAT-OUTLIVES-A-DAY.

   THE ROW: "[company in asks] shipped and named its own limit: the cast record is
   keyed on quest and day, so a bond from an earlier day loses its cast when a new
   job is rung, and the person who became yours turns back into a role. Build the
   record that keeps the cast a bond was earned against, for good, computed-not-
   listed exactly the way the module already works (no roster, ever; the gate
   deletes the record and the person must stop being yours)."

   PAOLO 9/13, RULE 14(d): a card that promises something and does nothing is the
   worst bug in the game. A game that hands you a person and takes them back the
   next morning is that bug wearing a friendlier face.

   MEASURED ON THE WALKED SURFACE BEFORE THE FIX, through the real parser and the
   real runtime, driving the meter reader to its real COMPLETE ending:
       bonds { lineman: 15 },  cast lineman = P:city:18:14:2
       yours today     [ P:city:18:14:2 ]
       yours tomorrow  [ ]                  <- the person became a role again

   WHAT THIS GATE HOLDS:

   1. THE ROW'S OWN TEST, AND IT IS THE SPINE: DELETE THE RECORD AND THE PERSON
      MUST STOP BEING YOURS, IN THE SAME INSTANT. A module that kept a list of
      people would pass every other check here and fail this one.

   2. *** STILL NO ROSTER. *** What is kept is the CASTING the world already
      wrote (this role, in this quest, was played by this person), never a list of
      your people. Membership stays computed from bonds against that casting.

   3. ONLY WHAT A BOND WAS EARNED AGAINST. The fixer you merely met is not kept.
      Keeping the whole cast would be a list of everybody you ever stood near,
      which is a roster with extra steps.

   4. A ROLE IS NOT A PERSON. A bond whose role nobody was cast into keeps
      nothing, rather than remembering a role as if it were somebody.

   5. A LATER CASTING NEVER OVERWRITES AN EARLIER ONE. The person you became
      something to is the one who was standing there THEN.

   6. THE RECORD AND ITS LABEL COME FROM THE SAME ARTEFACT. The cast cache carries
      its own quest id, so the seam takes the id from THERE, not from DQ -- taking
      it from DQ could key a casting made for one quest to another job. That was a
      real bug in the first cut of the seam, found by driving it.

   7. AND IT SURVIVES A SAVE. A bond that outlives the day has to outlive a reload.
   ========================================================================== */
'use strict';
const path = require('path');
const fs   = require('fs');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};

global.window = global;
const K = require(path.join(ROOT, 'engine/bohemia_kept.js'));
const C = require(path.join(ROOT, 'engine/bohemia_company.js'));

const QID  = 'bq_meter_reader';
const WHO  = 'P:city:18:14:2';
const OTHER = 'P:city:8:7:19';
const BONDS = { lineman: 15 };
const CAST  = { lineman: { key: WHO }, fixer: { key: OTHER } };

/* ---- 3. ONLY WHAT A BOND WAS EARNED AGAINST ----------------------------- */
let kept = K.fresh();
let r = K.keep(kept, BONDS, CAST, QID);
ok('3a the casting behind the bond is kept',
   r.kept.length === 1 && r.kept[0].role === 'lineman' && r.kept[0].who === WHO);
ok('3b *** and the person you merely MET is not kept ***',
   K.count(kept) === 1 && JSON.stringify(kept.cast).indexOf(OTHER) < 0);

/* ---- 4. A ROLE IS NOT A PERSON ------------------------------------------ */
const uncast = K.keep(K.fresh(), { ghost: 5 }, {}, QID);
ok('4a a bond nobody was cast into keeps nothing',
   uncast.kept.length === 0 && uncast.refused.length === 1);
ok('4b and it says why, in words',
   /a role is not a person/.test(uncast.refused[0].why));
ok('4c a casting with no quest is refused',
   /no quest/.test(K.refuse({ role: 'x', who: WHO, bonded: true })));
ok('4d a casting with no bond is refused',
   /no bond was earned/.test(K.refuse({ quest: QID, role: 'x', who: WHO })));

/* ---- 5. A LATER CASTING NEVER OVERWRITES AN EARLIER ONE ----------------- */
const again = K.keep(kept, BONDS, { lineman: { key: 'P:city:99:99:9' } }, QID);
ok('5a running the same quest again does not replace who it was',
   again.kept.length === 0 && kept.cast[K.keyOf(QID, 'lineman')].who === WHO);
ok('5b and it says why', /already kept/.test((again.refused[0] || {}).why || ''));

/* ---- 2 + the row's headline: THE BOND OUTLIVES THE DAY ------------------ */
/* today: the company module sees the person through today's cast */
const today = C.yours({ bonds: BONDS, cast: CAST, witnesses: [], housed: null });
ok('1a with today\'s cast the person is yours', today.length === 1 && today[0].who === WHO);

/* tomorrow, WITHOUT the fix: a new job is rung and the cast slot is empty */
const tomorrowRaw = C.yours({ bonds: BONDS, cast: {}, witnesses: [], housed: null });
ok('1b *** and this is the bug the row names: with an empty cast they are gone ***',
   tomorrowRaw.length === 0);

/* tomorrow, WITH the fix: the kept casting answers instead */
const tomorrow = C.yours({ bonds: BONDS, cast: K.everyCast(kept), witnesses: [], housed: null });
ok('1c *** THE ROW: a new job is rung and they are STILL yours ***',
   tomorrow.length === 1 && tomorrow[0].who === WHO);
ok('1d and they are yours BECAUSE OF THE BOND, not a new kind of membership',
   tomorrow[0].from === 'bond');

/* ---- 1. THE SPINE: DELETE THE RECORD, THE MEMBER GOES ------------------- */
ok('2a the record can be deleted', K.forget(kept, QID, 'lineman') === true);
const afterForget = C.yours({ bonds: BONDS, cast: K.everyCast(kept), witnesses: [], housed: null });
ok('2b *** DELETING THE RECORD DELETES THE MEMBER IN THE SAME INSTANT ***',
   afterForget.length === 0);
ok('2c and the bond itself is untouched -- what was lost is WHO, not THAT',
   BONDS.lineman === 15);
ok('2d forgetting something that was never kept is honest about it',
   K.forget(kept, QID, 'lineman') === false);

/* ---- 2. NO ROSTER, READ OUT OF THE SOURCE ------------------------------- */
const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_kept.js'), 'utf8');
const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
ok('6a the module holds no array of people',
   !/\bmembers\b|\broster\b|\bcompany\s*=/.test(code));
ok('6b it keeps castings, keyed by quest and role, not by person',
   /keyOf\(questId, role\)/.test(code));
ok('6c and it never invents a person from a role',
   /a role is not a person/.test(src));

/* ---- 7. IT SURVIVES A SAVE --------------------------------------------- */
const kept2 = K.fresh();
K.keep(kept2, BONDS, CAST, QID);
const reloaded = K.restore(K.serialize(kept2));
const afterReload = C.yours({ bonds: BONDS, cast: K.everyCast(reloaded), witnesses: [], housed: null });
ok('7a a kept casting survives a save and a reload',
   afterReload.length === 1 && afterReload[0].who === WHO);
ok('7b a corrupt save does not throw, it just remembers nobody',
   K.count(K.restore('not json at all')) === 0);

/* ---- 5 again: two quests can have the same role name -------------------- */
const twoQuests = K.fresh();
K.keep(twoQuests, { neighbor: 10 }, { neighbor: { key: 'P:a' } }, 'q_one');
K.keep(twoQuests, { neighbor: 10 }, { neighbor: { key: 'P:b' } }, 'q_two');
ok('5c two quests with the same role name are two people', K.count(twoQuests) === 2);
ok('5d and each quest gets its own person back',
   K.castFor(twoQuests, { neighbor: 1 }, 'q_one').neighbor.who === 'P:a' &&
   K.castFor(twoQuests, { neighbor: 1 }, 'q_two').neighbor.who === 'P:b');

/* ---- 6. THE SEAM TAKES THE ID FROM THE SAME RECORD AS THE CAST ---------- */
const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
const cityCode = CITY.replace(/\/\*[\s\S]*?\*\//g, '');
ok('8a the module is carried by the walked city', /BohemiaKept/.test(cityCode));
ok('8b *** the quest id comes from the cast record itself, not from DQ ***',
   /\(dc&&dc\.q\)\|\|/.test(cityCode));
ok('8c the casting is kept where the quest RESOLVES, which is the last instant'
   + ' it still exists', /state\.done\) ctKeepCast\(\)/.test(cityCode));
ok('8d and the company snapshot reads the kept castings',
   /BohemiaKept\.everyCast\(CT_KEPT\)/.test(cityCode));
ok('8e today\'s cast still wins for a role being played right now',
   /merged\[ck\]=dc\.cast\[ck\]/.test(cityCode));

console.log('BOND OUTLIVES GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
