/* ============================================================================
   BOHEMIA -- THE CAST A BOND WAS EARNED AGAINST, KEPT FOR GOOD
   (9/13/26, QUESTS lane. VAMILY row [bond outlives].)

   THE ROW: "[company in asks] shipped and named its own limit: the cast record
   is keyed on quest and day, so a bond from an earlier day loses its cast when a
   new job is rung, and the person who became yours turns back into a role."

   That limit is this lane's own, written into the seam by the round that hit it:
   "Naming somebody for good needs a record that outlives a day, and that is
   somebody's row to build, not a thing to invent in a seam." This is that row.

   PAOLO 9/13, RULE 14(d): a card that promises something and does nothing is the
   worst bug in the game. A game that hands you a person and quietly takes them
   back the next morning is the same bug wearing a friendlier face.

   ------------------------------------------------------------------------
   MEASURED ON THE WALKED SURFACE BEFORE A LINE OF THIS WAS WRITTEN
   ------------------------------------------------------------------------
   The meter reader run to its real COMPLETE ending through the real runtime:
       bonds earned      { lineman: 15 }
       cast              lineman = P:city:18:14:2,  fixer = P:city:8:7:19
       yours, today      [ P:city:18:14:2 / bond ]
       yours, tomorrow   [ ]
   The bond survives. WHO THE LINEMAN WAS does not. One slot, keyed on quest and
   day, overwritten the moment the next job is rung.

   ------------------------------------------------------------------------
   *** STILL NO ROSTER, AND THAT IS THE WHOLE DISCIPLINE OF THIS FEATURE. ***
   ------------------------------------------------------------------------
   [company in asks] holds that membership is COMPUTED from records that already
   exist, every call, and its gate's spine is that DELETING THE RECORD DELETES
   THE MEMBER IN THE SAME INSTANT. The obvious way to fix a decaying cast is to
   start keeping a list of your people -- and that is the wrong half, because a
   list is a thing somebody has to maintain and the moment it exists it can
   disagree with the world.

   So this keeps NO LIST OF PEOPLE. It keeps THE CASTING, which is an artefact
   the world already wrote at the moment the bond was earned: this role, in this
   quest, was played by this person. Membership is still computed, from bonds
   against that casting, exactly as before. Delete the casting and the member is
   gone in the same instant -- and the gate proves it by deleting it.

   WHAT IT REFUSES, each for a reason:
   - A ROLE NOBODY BONDED WITH IS NOT KEPT. You met the fixer; you did not become
     anything to them. Keeping the whole cast would be a list of everybody you
     ever stood near, which is a roster with extra steps.
   - A BOND WITH NOBODY CAST INTO IT KEEPS NOTHING. A role is not a person, and
     an uncast role must never be remembered as one.
   - A LATER CASTING NEVER OVERWRITES AN EARLIER ONE. The person you became
     something to is the person who was standing there THEN. If the same quest is
     run again and casts somebody else, that is a second person, not a correction.
   ========================================================================== */
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  function fresh() { return { cast: {} }; }

  /* THE KEY IS THE ROLE INSIDE THE QUEST, because that is what a bond is keyed
     on too. Two quests can both have a "neighbor" and they are two people. */
  function keyOf(questId, role) { return String(questId || '') + ' ' + String(role); }

  /* refuse(one) -- why a casting is not kept. */
  function refuse(one) {
    if (!one || typeof one !== 'object') return 'not a casting';
    if (!one.quest) return 'no quest, so the role has no owner';
    if (!one.role)  return 'no role';
    if (!one.who)   return 'a role is not a person: nobody was cast into it';
    if (!one.bonded) return 'no bond was earned with them, so they are not yours to keep';
    return null;
  }

  /* keep(kept, bonds, cast, questId) -- record the casting behind every bond
     this quest earned. Returns what it kept and what it refused, so a seam can
     never quietly keep nothing. */
  function keep(kept, bonds, cast, questId) {
    var K = kept || fresh();
    K.cast = K.cast || {};
    var got = [], no = [], role;
    var B = bonds || {}, C = cast || {};
    for (role in B) {
      if (!Object.prototype.hasOwnProperty.call(B, role)) continue;
      var c = C[role];
      var one = { quest: questId, role: role, bonded: true,
                  who: (c && (c.who || c.key || c.id)) || null };
      var why = refuse(one);
      if (why) { no.push({ role: role, why: why }); continue; }
      var k = keyOf(questId, role);
      /* A LATER CASTING NEVER OVERWRITES AN EARLIER ONE. */
      if (Object.prototype.hasOwnProperty.call(K.cast, k)) {
        no.push({ role: role,
          why: 'already kept: the person you became something to is the one who was there then' });
        continue;
      }
      K.cast[k] = { who: one.who, role: role, quest: String(questId) };
      got.push({ role: role, who: one.who });
    }
    return { kept: got, refused: no };
  }

  /* castFor(kept, bonds, questId) -- the role->person map for a quest's bonds,
     rebuilt from what was kept. This is the shape bohemia_company.js already
     reads, so nothing downstream has to learn a new one. */
  function castFor(kept, bonds, questId) {
    var out = {}, role;
    if (!kept || !kept.cast) return out;
    var B = bonds || {};
    for (role in B) {
      if (!Object.prototype.hasOwnProperty.call(B, role)) continue;
      var r = kept.cast[keyOf(questId, role)];
      if (r && r.who) out[role] = { who: r.who, key: r.who, role: role };
    }
    return out;
  }

  /* everyCast(kept) -- every casting kept, across every quest, in the same
     shape. This is what makes a bond outlive the day it was earned: the seam can
     hand the company module the whole history rather than today's one slot. */
  function everyCast(kept) {
    var out = {}, k;
    if (!kept || !kept.cast) return out;
    for (k in kept.cast) {
      if (!Object.prototype.hasOwnProperty.call(kept.cast, k)) continue;
      var r = kept.cast[k];
      if (r && r.who && !out[r.role]) out[r.role] = { who: r.who, key: r.who, role: r.role };
    }
    return out;
  }

  function count(kept) {
    return (kept && kept.cast) ? Object.keys(kept.cast).length : 0;
  }

  /* forget(kept, questId, role) -- THE SPINE, AND THE GATE USES IT. Deleting the
     record must delete the member in the same instant. It exists so that can be
     proved, not because anything in the game calls it. */
  function forget(kept, questId, role) {
    if (!kept || !kept.cast) return false;
    var k = keyOf(questId, role);
    if (!Object.prototype.hasOwnProperty.call(kept.cast, k)) return false;
    delete kept.cast[k];
    return true;
  }

  function serialize(kept) { return JSON.stringify((kept && kept.cast) || {}); }
  function restore(text) {
    var K = fresh();
    try {
      var o = JSON.parse(text || '{}');
      if (o && typeof o === 'object') K.cast = o;
    } catch (_e) {}
    return K;
  }

  var API = { fresh: fresh, refuse: refuse, keep: keep, castFor: castFor,
              everyCast: everyCast, count: count, forget: forget,
              serialize: serialize, restore: restore, keyOf: keyOf };
  if (HASREQ) module.exports = API; else root.BohemiaKept = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
