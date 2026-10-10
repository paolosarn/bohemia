// BOHEMIA THE KEEPERS -- THE MAN WHO WALKS WITH A BEAST (10/10/26, PEOPLE lane, VAMILY [keepers])
//
// Rule 42 round three (records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_THREE_
// THE_SEVENTEEN_9_29_26.md, section 2, "THE KEEPERS"): "People use animals
// as weapons and tools, and a faction that does is a faction others fear."
// Six REAL crafts, each one a real human practice today or across history,
// never invented: war dogs (police and military dog lines), hunting birds
// (falconry, a living Nevada craft), camel cavalry (two thousand years
// real, the desert's own), horse raiders (Nevada's mustangers), the hyena
// men (Nigeria's real hyena handlers) and bee-keepers as siege (a real
// medieval tactic, hives thrown over a wall).
//
// THE ROW'S OWN SPLIT: "the beast-keeper as a background and a faction...
// With FACTIONS (the keeper faction's roster) and COMBAT (the beast slot on
// the board)." This module builds PEOPLE's own exclusive piece: "a HANDLER
// can be hired with his animal as a company slot" and "the automated
// companion may be an animal" -- the background data and the SHAPE of that
// slot, not the faction roster (FACTIONS') or the fight's board rules
// (COMBAT's).
//
// MEASURED BEFORE BUILDING: slices/BOHEMIA_CITY_WORLD.html's own companion
// state, CT_WALKS_WITH, is just a person's id from the city's own
// population (checked directly: `CT_WALKS_WITH = hit.id;`). There is NO
// shape anywhere in this codebase for a companion that is not a person, so
// "the automated companion may be an animal" is a genuinely new capability,
// not a re-skin of something that already exists -- this module proposes
// the real shape (companionSlot()) rather than quietly forcing an animal
// into a person-shaped record.
//
// NO PRICE IS BUILT, ON PURPOSE: the research round's own economic note is
// qualitative, not a number ("a live capture -- a handler's dog or camel --
// is worth a season's pay"), and rule 63d forbids inventing a number no
// source gives. Pricing a handler hire honestly waits for a real source
// (TUNING's table, or Grok asked directly), named here, not faked.
'use strict';
(function (root) {
  var HASREQ = typeof module !== 'undefined' && module.exports;

  // SIX REAL CRAFTS, each citation copied verbatim from the research round
  // that found it (records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_THREE_THE_
  // SEVENTEEN_9_29_26.md, section 2), never reworded. `animal` is the
  // craft's own real animal, or null where the craft's "beast" is a thrown
  // weapon rather than a living companion (bee-keepers): a hive cannot walk
  // beside you, and this module refuses to force one into the companion
  // slot where it honestly does not fit.
  var CRAFTS = [
    { id: 'war_dogs', name: 'War Dogs', animal: 'dog',
      citation: "the noble houses' wardogs; police and military dog lines exist by the thousand" },
    { id: 'hunting_birds', name: 'Hunting Birds', animal: 'eagle',
      citation: "falconry is a living craft in Nevada; Haast's eagle on a glove is a boss's pet" },
    { id: 'camel_cavalry', name: 'Camel Cavalry', animal: 'camel',
      citation: "real for two thousand years, the desert's own" },
    { id: 'horse_raiders', name: 'Horse Raiders', animal: 'horse',
      citation: "Nevada's mustangers" },
    { id: 'hyena_men', name: 'The Hyena Men', animal: 'hyena',
      citation: "Nigeria's hyena handlers are real: chained hyenas as street performers and guards" },
    { id: 'bee_keepers', name: 'Bee-Keepers', animal: null,
      citation: 'hives thrown over walls is a medieval tactic and a real one' }
  ];

  function byId(id) { for (var i = 0; i < CRAFTS.length; i++) if (CRAFTS[i].id === id) return CRAFTS[i]; return null; }

  // THE SLOT SHAPE: what the city's companion state would need to carry for
  // "the automated companion may be an animal" to be true. kind:'animal'
  // marks it as the new case CT_WALKS_WITH's own code has never handled
  // (it only ever carries a person's id today); species and craft are real,
  // sourced names. A craft with no living animal (bee-keepers) is refused,
  // never forced into a shape that would lie about what it is.
  function companionSlot(craftId) {
    var c = byId(craftId);
    if (!c || !c.animal) return null;
    return { kind: 'animal', species: c.animal, craft: c.name, craftId: c.id };
  }

  var API = {
    CRAFTS: CRAFTS, byId: byId,
    companionSlot: companionSlot
  };
  if (HASREQ) module.exports = API;
  root.BohemiaKeepers = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
