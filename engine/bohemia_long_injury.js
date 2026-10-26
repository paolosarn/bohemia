// BOHEMIA THE LONG INJURY -- WHAT A STRUCK-DOWN MAN CARRIES (10/9/26, PEOPLE lane, VAMILY [the long injury])
//
// *** AMENDED 10/26 (CAMP [struck down, he still fights], VAMILY rule 234, Paolo 10/26: 'if they fail in combat but they
// survive to still be in my crew, their health will just be at one, and when you heal them they go back up. They're still
// active. I don't know why you have it so they can't participate in combat anymore, that's why I restarted hella runs...
// they should just have that debuff'; records/BOHEMIA_PAOLO_STRUCK_DOWN_HE_STILL_FIGHTS_AND_HIS_FACE_SHOWS_IT_10_26_26.md).
// The quote below ('takes them out of fights for 30 to 40 game days') was the coordinator's reading of his 'a debilitating
// injury', never his words, and it benched a crew for a month after one bad first fight. NOTHING HERE BENCHES ANYBODY NOW.
// A man struck down who lives wakes at one hitpoint, in the crew, and can be picked for the next fight. What he carries is a
// DEBUFF in two parts, both Battle Brothers' own numbers off records/target/bb/injuries.json:
//   THE MARK, for life: the permanent injury's own effects (the wiki's eleven), on him in every fight from the day he wakes;
//   THE FRESH WOUND, for 6 to 8 of our days (rule 264(h): his 30 to 40 were Battle Brothers' days; one of ours holds about
//   five of theirs): the temporary injury the mark grew out of (records/target/bb/condition.json
//   struck_down_fresh, one wiki row per mark), its whole penalty the day he wakes, falling in a straight line to nothing on
//   the last of his days. 'days' below is how long the fresh wound lasts; it never keeps him out of a fight.
// freshNow() is the wound as it stands today, already scaled, in the shape the fight's injMult reads; penalties() is the
// list the crew card draws as icons (rule 224, 234(d)); look() is what his portrait and thumb show (rule 234(c), PORTRAIT).
// The old reading's words and gates are kept below as history.
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
// struck_down_laid_up_days [30, 40] (6 to 8 of ours from rule 264(h)), all cited to the locked law or THE
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
  // From 10/26 (rule 234) they are the days THE FRESH WOUND lasts; the old
  // names stay so nothing that reads them breaks. From 10/26 too (rule
  // 264(h), TUNING's struck.fresh.days) they are OUR days, 6 to 8: his 30 to
  // 40 were Battle Brothers' month, and one of our days holds about five of
  // theirs, so the same fights' worth is 6 to 8 of ours.
  var LAID_UP_DAYS_MIN = 6;
  var LAID_UP_DAYS_MAX = 8;
  var FRESH_DAYS_MIN = LAID_UP_DAYS_MIN, FRESH_DAYS_MAX = LAID_UP_DAYS_MAX;

  // THE REAL MARKS: loaded live off injuries.json in Node (the gate's own
  // copy is the proof they match); the browser build inlines the same 11
  // rows verbatim so the live game needs no extra fetch for a fixed list
  // this short, the same reasoning bohemia_goodbros.js's CANDIDATES used.
  var PERMANENT_MARKS = HASREQ
    ? JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'records/target/bb/injuries.json'), 'utf8'))
      .rows.filter(function (r) { return r.kind === 'permanent'; })
    : [
      { id: "brain_damage", name: "Brain Damage", effects: {"resolve_pct": 15, "experience_gain_pct": -25, "initiative_pct": -25}, effects_text: ["+15% Resolve", "−25% Experience Gain", "−25% Initiative"], flavor: "A hard hit to the head shook some things up and didn't exactly benefit this character's cognitive skills. On the bright side, he may now be just too stupid to realize when it's time to run." },
      { id: "broken_elbow_joint", name: "Broken Elbow Joint", effects: {"melee_skill_pct": -20, "ranged_skill_pct": -20, "melee_defense_pct": -30, "content_in_reserve": true}, effects_text: ["−20% Melee Skill", "−20% Ranged Skill", "−30% Melee Defense", "Is always content with being in reserve"], flavor: "A broken elbow that never fully healed hinders all movement of the arm and severely reduces combat effectiveness." },
      { id: "broken_knee", name: "Broken Knee", effects: {"melee_defense_pct": -40, "ranged_defense_pct": -40, "initiative_pct": -40, "content_in_reserve": true}, effects_text: ["−40% Melee Defense", "−40% Ranged Defense", "−40% Initiative", "Is always content with being in reserve"], flavor: "This character took something to the knee, and it never fully healed. Lunging forward or dodging can be painful, and it lacks any grace." },
      { id: "partly_collapsed_lung", name: "Partly Collapsed Lung", effects: {"max_fatigue_pct": -40, "content_in_reserve": true}, effects_text: ["−40% Max Fatigue", "Is always content with being in reserve"], flavor: "A part of the lung has died, making it very hard for this character to catch breath." },
      { id: "maimed_foot", name: "Maimed Foot", effects: {"extra_ap_per_tile_moved": 1, "initiative_pct": -20, "content_in_reserve": true}, effects_text: ["1 Additional Action Point per tile moved", "−20% Initiative", "Is always content with being in reserve"], flavor: "An injury to the foot has never fully healed, making it hard to win any dancing competitions or otherwise move around quickly." },
      { id: "missing_ear", name: "Missing Ear", effects: {"initiative_pct": -10}, effects_text: ["−10% Initiative"], flavor: "Luckily, a missing ear isn't that much of a hindrance for this character. But it does look gross." },
      { id: "missing_eye", name: "Missing Eye", effects: {"ranged_skill_pct": -50, "vision": -2}, effects_text: ["−50% Ranged Skill", "−2 Vision"], flavor: "A missing eye makes it difficult to judge distance properly, and limits the field of view." },
      { id: "missing_finger", name: "Missing Finger", effects: {"melee_skill_pct": -5, "ranged_skill_pct": -5}, effects_text: ["−5% Melee Skill", "−5% Ranged Skill"], flavor: "A missing finger makes it harder to firmly grab a weapon or shield, but it also makes for a good story." },
      { id: "missing_nose", name: "Missing Nose", effects: {"max_fatigue_pct": -10}, effects_text: ["−10% Max Fatigue"], flavor: "A gaping hole is all that is left of the nose, making this character hard to look at." },
      { id: "traumatized", name: "Traumatized", effects: {"resolve_pct": -40, "initiative_pct": -30, "content_in_reserve": true}, effects_text: ["−40% Resolve", "−30% Initiative", "Is always content with being in reserve"], flavor: "This character has been to the other side. Faced with his own mortality, the experience of dying and coming back has left him a broken man." },
      { id: "weakened_heart", name: "Weakened Heart", effects: {"hitpoints_pct": -30, "content_in_reserve": true}, effects_text: ["−30% Hitpoints", "Is always content with being in reserve"], flavor: "Past injuries left this character with a weakened heart, severely lowering his constitution." }
    ];

  // THE FRESH WOUND (rule 234(b), CAMP 10/26): for each mark, the wiki's
  // temporary injury of the same part it is the never-healed form of
  // (records/target/bb/condition.json struck_down_fresh, a default for
  // TUNING's table; Traumatized has none, the wiki gives it no flesh wound).
  // Node reads the two files; the browser inlines the same rows, and the gate
  // checks the copy against both, byte for byte.
  var FRESH = HASREQ
    ? (function () {
      var c = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'records/target/bb/condition.json'), 'utf8'));
      var rows = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'records/target/bb/injuries.json'), 'utf8')).rows, o = {};
      var m = c.struck_down_fresh.value;
      Object.keys(m).forEach(function (k) { var r = m[k].wound ? rows.filter(function (x) { return x.id === m[k].wound; })[0] : null;
        o[k] = r ? { id: r.id, name: r.name, effects: r.effects, effects_text: r.effects_text } : null; });
      return o;
    })()
    : {
      "brain_damage": { id: "severe_concussion", name: "Severe Concussion", effects: {"melee_skill_pct": -50, "ranged_skill_pct": -50, "melee_defense_pct": -50, "ranged_defense_pct": -50, "initiative_pct": -50, "vision": -2}, effects_text: ["−50% Melee Skill", "−50% Ranged Skill", "−50% Melee Defense", "−50% Ranged Defense", "−50% Initiative", "−2 Vision"] },
      "broken_elbow_joint": { id: "fractured_elbow", name: "Fractured Elbow", effects: {"melee_defense_pct": -25}, effects_text: ["−25% Melee Defense"] },
      "broken_knee": { id: "injured_knee_cap", name: "Injured Knee Cap", effects: {"extra_ap_per_tile_moved": 2, "initiative_pct": -40}, effects_text: ["2 Additional Action Point per tile moved", "−40% Initiative"] },
      "partly_collapsed_lung": { id: "pierced_lung", name: "Pierced Lung", effects: {"max_fatigue_pct": -60}, effects_text: ["−60% Max Fatigue"] },
      "maimed_foot": { id: "cut_achilles_tendon", name: "Cut Achilles Tendon", effects: {"extra_ap_per_tile_moved": 2, "initiative_pct": -30}, effects_text: ["2 Additional Action Point per tile moved", "−30% Initiative"] },
      "missing_ear": { id: "ripped_ear", name: "Ripped Ear", effects: {"initiative_pct": -15}, effects_text: ["−15% Initiative"] },
      "missing_eye": { id: "grazed_eye_socket", name: "Grazed Eye Socket", effects: {"ranged_skill_pct": -50, "vision": -2}, effects_text: ["−50% Ranged Skill", "−2 Vision"] },
      "missing_finger": { id: "crushed_finger", name: "Crushed Finger", effects: {"melee_skill_pct": -5, "ranged_skill_pct": -5}, effects_text: ["−5% Melee Skill", "−5% Ranged Skill"] },
      "missing_nose": { id: "split_nose", name: "Split Nose", effects: {"fatigue_recovery_per_turn": -5}, effects_text: ["−5 Fatigue recovery per turn"] },
      "traumatized": null,
      "weakened_heart": { id: "pierced_chest", name: "Pierced Chest", effects: {"max_fatigue_pct": -20}, effects_text: ["−20% Max Fatigue"] }
    };
  // the share of the fresh wound's penalty the day he wakes (condition.json struck_down_fresh_full_share)
  var FRESH_FULL_SHARE = 1;

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

  // ---- THE DEBUFF, NEVER THE BENCH (rule 234, CAMP 10/26) ----
  // the fresh wound a mark grew out of (null: none, or no such mark)
  function freshOf(markId) { return Object.prototype.hasOwnProperty.call(FRESH, markId) ? FRESH[markId] : null; }
  // how much of the fresh wound is left: all of it the day he wakes (left === of), nothing when its days are done
  function freshShare(left, of) {
    of = +of || 0; if (!(of > 0)) return 0;
    left = Math.max(0, Math.min(of, +left || 0));
    return FRESH_FULL_SHARE * left / of;
  }
  // a row's effects times the share, each a whole number of its own unit (a percent, an action point, a tile of vision),
  // rounded away from nothing at a half; the flags (content_in_reserve) are not penalties and do not scale
  function scaled(effects, share) {
    var o = {};
    for (var k in effects) {
      var v = effects[k]; if (typeof v !== 'number') continue;
      var n = v * share; n = n < 0 ? -Math.round(-n) : Math.round(n);
      if (n !== 0) o[k] = n;
    }
    return o;
  }
  // THE FRESH WOUND AS IT STANDS TODAY, in the shape the fight's injMult and its move cost read (an injury with effects);
  // null when it has closed or the mark has none
  function freshNow(markId, left, of) {
    var w = freshOf(markId), s = freshShare(left, of);
    if (!w || !(s > 0)) return null;
    var e = scaled(w.effects, s);
    if (!Object.keys(e).length) return null;
    return { id: 'fresh:' + w.id, name: w.name, kind: 'fresh', of: markId, share: Math.round(s * 100) / 100, effects: e };
  }
  // WHAT IT TAKES OFF HIM, for the crew card's icons (rule 224, 234(d)): one line per stat, the marks for life and the
  // fresh wound today, a percent or a flat number, always the wiki's own key with the _pct taken off
  function penalties(marks, wound) {
    var out = [];
    var add = function (effects, from, id, name) {
      for (var k in effects) { var v = effects[k]; if (typeof v !== 'number' || v === 0) continue;
        var pct = /_pct$/.test(k); out.push({ stat: pct ? k.replace(/_pct$/, '') : k, value: v, unit: pct ? '%' : '', from: from, id: id, name: name }); }
    };
    (marks || []).forEach(function (k) { var m = byId(k && k.id || k); if (m && m.effects) add(m.effects, 'mark', m.id, m.name); });
    var f = wound ? freshNow(wound.mark, wound.left, wound.of) : null;
    if (f) add(f.effects, 'fresh', f.id, f.name);
    return out;
  }
  // WHAT HIS FACE SHOWS (rule 234(c), for PORTRAIT): every mark he carries for life, and the fresh wound's stage: BLOOD
  // (blood and a band-aid) while more than half of it is left, BANDAGE (the band-aid alone) until it closes, then nothing
  function look(marks, wound) {
    var s = wound ? freshShare(wound.left, wound.of) : 0;
    return { marks: (marks || []).map(function (k) { return k && k.id || k; }).filter(function (k) { return !!byId(k); }),
      fresh: s > 0.5 ? 'blood' : s > 0 ? 'bandage' : null, share: Math.round(s * 100) / 100, wound: wound && wound.mark ? wound.mark : null };
  }

  var API = {
    LAID_UP_DAYS_MIN: LAID_UP_DAYS_MIN, LAID_UP_DAYS_MAX: LAID_UP_DAYS_MAX,
    FRESH_DAYS_MIN: FRESH_DAYS_MIN, FRESH_DAYS_MAX: FRESH_DAYS_MAX, FRESH: FRESH, FRESH_FULL_SHARE: FRESH_FULL_SHARE,
    PERMANENT_MARKS: PERMANENT_MARKS, byId: byId,
    rollDays: rollDays, rollMarkId: rollMarkId,
    painLine: painLine, bodyPartPenalty: bodyPartPenalty,
    injuryFact: injuryFact, healDay: healDay,
    freshOf: freshOf, freshShare: freshShare, freshNow: freshNow, penalties: penalties, look: look
  };
  if (HASREQ) module.exports = API;
  root.BohemiaLongInjury = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
