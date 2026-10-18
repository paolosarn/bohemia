// BOHEMIA THE LONG INJURY -- WHAT A STRUCK-DOWN MAN CARRIES (10/9/26, PEOPLE lane, VAMILY [the long injury])
//
// laws/BOHEMIA_LAW_THE_FIGHT_GETS_DEEP_TUNING_AND_MODS_9_27_26.md, Paolo's own
// words: "Only a 20% chance your character can die, but if they get struck
// down, a debilitating injury. When a person is STRUCK DOWN in a fight: 20%
// they die... 80% they live with a DEBILITATING INJURY that takes them out
// of fights for 30 to 40 game days and leaves a permanent mark (a scar, a
// limp, a lost eye, a stat that never comes back)." The row's own split
// (VAMILY.md row [long injury]): "the injury is a person's fact (this
// lane), the odds are TUNING's rows, the fight's trigger is COMBAT's." THE
// ODDS ARE ALREADY REAL AND SOURCED (records/target/bb/ours.json's
// struck_down_death_chance 0.2, veteran_death_chance 0.1,
// struck_down_laid_up_days [30, 40], all cited to the locked law or THE
// THIRD VOTES); nothing to add there. THE FIGHT'S TRIGGER IS COMBAT'S OWN
// CLAIMED ROW (VAMILY.md [struck down], combat-nfnki9), which names the
// same card this module builds ("the roster shows the injury as one pain
// line... the penalty by body part") as part of its own scope -- so this
// module is built as the shared FACT COMBAT's UI can read from, not a
// second, divergent copy of the same content.
//
// THIS LANE'S OWN JOB: given a man lived (COMBAT's roll said so), what is
// TRUE about him now. Every piece of that truth is read off
// records/target/bb/injuries.json's own real "permanent" rows (11 of them:
// Brain Damage, Broken Elbow Joint, Broken Knee, Partly Collapsed Lung,
// Maimed Foot, Missing Ear, Missing Eye, Missing Finger, Missing Nose,
// Traumatized, Weakened Heart), never invented: "a scar, a limp, a lost
// eye" IS that list, word for word a match to what Paolo named. The pain
// line is the mark's own real flavor text's first sentence; the body-part
// penalty is the mark's own real effects_text, both already written by the
// wiki transcription, not authored fresh here.
//
// A CANON NOTE, NAMED NOT HIDDEN: engine/bohemia_down.js (9/12, PEOPLE,
// [down not dead]) promises "nothing on a person you keep is forever" and
// builds three injuries that all heal. The 9/27 law above is NEWER and
// explicitly LOCKS a permanent mark for a man struck down IN A FIGHT
// specifically ("a stat that never comes back"); NEWEST DATE WINS
// (CLAUDE.md's Truth Hierarchy) means this module's permanent mark is the
// correct read for that case, and bohemia_down.js's own three generic
// buckets (knocked/leg/hand) are superseded for it, though that module is
// untouched here -- it may still be the right shape for injuries that do
// NOT come from being struck down in a fight, and retiring or folding it is
// a bigger call than this round's row asks for.
'use strict';
(function (root) {
  var HASREQ = typeof module !== 'undefined' && module.exports;
  var fs = HASREQ ? require('fs') : null;
  var path = HASREQ ? require('path') : null;

  function hash32(s) {
    s = String(s);
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    h ^= h >>> 16; h = Math.imul(h, 2246822507) >>> 0;
    h ^= h >>> 13; h = Math.imul(h, 3266489909) >>> 0;
    h ^= h >>> 16;
    return h >>> 0;
  }
  function unit(s) { return hash32(s) / 4294967296; }
  function rollInt(min, max, key) { return min + Math.round(unit(key) * (max - min)); }

  // THE REAL RANGE: records/target/bb/ours.json's own struck_down_laid_up_days,
  // cited to the locked law. Kept here as a constant pointed at that real
  // source (checked byte for byte by the gate), never a second number to drift.
  var LAID_UP_DAYS_MIN = 30;
  var LAID_UP_DAYS_MAX = 40;

  // THE REAL MARKS: loaded live off injuries.json in Node (the gate's own
  // copy is the proof they match); the browser build inlines the same 11
  // rows verbatim so the live game needs no extra fetch for a fixed list
  // this short, the same reasoning bohemia_goodbros.js's CANDIDATES used.
  var PERMANENT_MARKS = HASREQ
    ? JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'records/target/bb/injuries.json'), 'utf8'))
      .rows.filter(function (r) { return r.kind === 'permanent'; })
    : [
      { id: 'brain_damage', name: 'Brain Damage', effects_text: ['+15% Resolve', '−25% Experience Gain', '−25% Initiative'], flavor: "A hard hit to the head shook some things up and didn't exactly benefit this character's cognitive skills. On the bright side, he may now be just too stupid to realize when it's time to run." },
      { id: 'broken_elbow_joint', name: 'Broken Elbow Joint', effects_text: ['−20% Melee Skill', '−20% Ranged Skill', '−30% Melee Defense', 'Is always content with being in reserve'], flavor: 'A broken elbow that never fully healed hinders all movement of the arm and severely reduces combat effectiveness.' },
      { id: 'broken_knee', name: 'Broken Knee', effects_text: ['−40% Melee Defense', '−40% Ranged Defense', '−40% Initiative', 'Is always content with being in reserve'], flavor: 'This character took something to the knee, and it never fully healed. Lunging forward or dodging can be painful, and it lacks any grace.' },
      { id: 'partly_collapsed_lung', name: 'Partly Collapsed Lung', effects_text: ['−40% Max Fatigue', 'Is always content with being in reserve'], flavor: 'A part of the lung has died, making it very hard for this character to catch breath.' },
      { id: 'maimed_foot', name: 'Maimed Foot', effects_text: ['1 Additional Action Point per tile moved', '−20% Initiative', 'Is always content with being in reserve'], flavor: "An injury to the foot has never fully healed, making it hard to win any dancing competitions or otherwise move around quickly." },
      { id: 'missing_ear', name: 'Missing Ear', effects_text: ['−10% Initiative'], flavor: "Luckily, a missing ear isn't that much of a hindrance for this character. But it does look gross." },
      { id: 'missing_eye', name: 'Missing Eye', effects_text: ['−50% Ranged Skill', '−2 Vision'], flavor: 'A missing eye makes it difficult to judge distance properly, and limits the field of view.' },
      { id: 'missing_finger', name: 'Missing Finger', effects_text: ['−5% Melee Skill', '−5% Ranged Skill'], flavor: 'A missing finger makes it harder to firmly grab a weapon or shield, but it also makes for a good story.' },
      { id: 'missing_nose', name: 'Missing Nose', effects_text: ['−10% Max Fatigue'], flavor: 'A gaping hole is all that is left of the nose, making this character hard to look at.' },
      { id: 'traumatized', name: 'Traumatized', effects_text: ['−40% Resolve', '−30% Initiative', 'Is always content with being in reserve'], flavor: 'This character has been to the other side. Faced with his own mortality, the experience of dying and coming back has left him a broken man.' },
      { id: 'weakened_heart', name: 'Weakened Heart', effects_text: ['−30% Hitpoints', 'Is always content with being in reserve'], flavor: 'Past injuries left this character with a weakened heart, severely lowering his constitution.' }
    ];

  function byId(id) { for (var i = 0; i < PERMANENT_MARKS.length; i++) if (PERMANENT_MARKS[i].id === id) return PERMANENT_MARKS[i]; return null; }

  function rollDays(key) { return rollInt(LAID_UP_DAYS_MIN, LAID_UP_DAYS_MAX, key + '|days'); }
  function rollMarkId(key) { var i = Math.floor(unit(key + '|mark') * PERMANENT_MARKS.length); return PERMANENT_MARKS[i].id; }

  // ONE PAIN LINE: the mark's own real flavor text, its first sentence only
  // (most are already one sentence; a couple run two, and the row asks for
  // ONE line, so the first is kept and the rest dropped, nothing reworded).
  function painLine(markId) {
    var m = byId(markId); if (!m) return null;
    var dot = m.flavor.indexOf('. ');
    return dot === -1 ? m.flavor : m.flavor.slice(0, dot + 1);
  }

  // WHAT HE CANNOT DO: the mark's own real effects_text, joined plain --
  // these are the wiki's own numbers (records/target/bb/injuries.json),
  // never retyped or rounded differently here.
  function bodyPartPenalty(markId) {
    var m = byId(markId); if (!m) return null;
    return m.effects_text.join(', ');
  }

  // THE FULL FACT: everything the card in the row needs, built from one
  // deterministic key (the same man, the same key, the same fact every
  // time, the same rule the heir and the goodbros rolls already use).
  function injuryFact(key) {
    var markId = rollMarkId(key), m = byId(markId);
    return {
      days: rollDays(key),
      markId: markId,
      markName: m.name,
      painLine: painLine(markId),
      bodyPartPenalty: bodyPartPenalty(markId)
    };
  }

  // HE HEALS ON THE ROAD: one real day passing takes one day off the LAID-UP
  // clock; the permanent mark (its name, its pain line, its penalty) is
  // exactly that, permanent, and never clears even once days reaches 0 --
  // "laid up" ends, "marked" does not, matching the law's own "a stat that
  // never comes back." A pure step function; whichever lane owns the city's
  // real day-tick calls it once a day (named in the review file, not wired
  // here -- a day clock is a different file's system).
  function healDay(fact) {
    if (!fact) return fact;
    return { days: Math.max(0, fact.days - 1), markId: fact.markId, markName: fact.markName, painLine: fact.painLine, bodyPartPenalty: fact.bodyPartPenalty };
  }

  var API = {
    LAID_UP_DAYS_MIN: LAID_UP_DAYS_MIN, LAID_UP_DAYS_MAX: LAID_UP_DAYS_MAX,
    PERMANENT_MARKS: PERMANENT_MARKS, byId: byId,
    rollDays: rollDays, rollMarkId: rollMarkId,
    painLine: painLine, bodyPartPenalty: bodyPartPenalty,
    injuryFact: injuryFact, healDay: healDay
  };
  if (HASREQ) module.exports = API;
  root.BohemiaLongInjury = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
