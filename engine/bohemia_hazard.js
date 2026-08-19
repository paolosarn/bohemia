// BOHEMIA HAZARD — THE FLOOR CAN DO SOMETHING TO YOU. (8/18/26, WORLD lane.)
//
// PAOLO 8/17, LOCKED: "THE WORLD HAS TO FEEL MORE ALIVE."
// laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md §5 routes that order HERE, not to
// combat, and says why in one sentence: "None of that is combat code — it is TILE
// TYPES with combat-readable properties, which is WORLD's system." And §5's closing
// line is the whole design brief: A ROOM ONLY FEELS ALIVE IF THE FLOOR CAN DO
// SOMETHING TO YOU. His two demands (more movement, a livelier world) are ONE demand:
// movement only matters when the geometry MEANS something.
//
// ============================================================================
// THE THING THIS MODULE REFUSES TO DO, AND IT IS THE WHOLE DESIGN
// ============================================================================
// It does not invent a single hazard, and it does not place one. THE VALLEY IS
// ALREADY FULL OF THEM. Sixty-two district generators have been authoring real
// Mojave ground for weeks — drained pools, quarry benches, talus aprons, leachate
// ponds, crusted settling ponds, scrap heaps, standing pit water — each with a
// name and a written act-1 material. Nobody ever told the game that any of it was
// DANGEROUS. So this module is a READING of ground that already exists, not a new
// layer of content on top of it.
//
// That is the difference between this and a hazard table: a table is A VALUE PASSED
// BY HAND WHERE A VALUE COULD BE DERIVED (the recurring house bug, sighted eight
// times and counting). Every membership below is produced by a RULE run against the
// district's own LEGEND, so the day somebody authors a new drained pool in a new
// district, it is lethal ground that afternoon with no edit here. The gate proves
// that by mutating a legend and watching the class follow.
//
// ============================================================================
// THE FIVE CLASSES ARE HIS, VERBATIM, AND SO ARE THE NUMBERS
// ============================================================================
//   KILLS      pits — an enemy knocked or charging in dies outright.
//   AMPLIFIES  unstable ground — +50% physical damage taken.
//   DISABLES   liquids switch OFF sprinting and movement abilities.
//   FAVOURS    cursed floor heals undead.
//   DENIES     standing on a body prevents its resurrection.
// Nothing here is a sixth class, a re-balanced multiplier or a renamed effect.
//
// ============================================================================
// FORCED ENTRY KILLS. DELIBERATE ENTRY DOES NOT. THIS IS THE LOAD-BEARING RULE
// ============================================================================
// His corpus says "an enemy KNOCKED or CHARGING in dies outright" — both of those
// are entries the body did not choose. That single clause dissolves the question I
// spent an hour on, which was how deep a drop has to be before it kills. WRONG
// QUESTION. The question is whether you land under control. A person climbs down
// into a drained pool every day of the week and walks back out; a person thrown
// head-first into the same empty concrete shell does not. So depth stops being the
// test and CONSENT becomes the test, which is both more real and more playable:
//   - walking in yourself:  nothing happens (yet — any pain would be damage, and
//                           NO DAMAGE BEFORE THE DIAL means that stays unbuilt)
//   - knocked / charged in: dead, outright, on the environmental channel
// §2.4 of the law authorises exactly this and fences it: pits, falls and hazards
// kill outright, NO WEAPON EVER DOES. An environmental kill is not damage — it is a
// positional payoff on a separate channel — which is why it does not touch the dial.
// The reason it is worth having at all is his document's, not mine: it keeps a
// bad-item run solvable, and a roguelite cannot do without that property.
//
// ============================================================================
// WHAT IS EMPTY, AND WHY EACH EMPTY THING IS EMPTY
// ============================================================================
// MECHANISM-MINE / CONTENTS-PAOLO'S. Three tables ship with nothing in them:
//   DIALS      how common each class is. His words in the backlog: "how common each
//              is = his dials." Note what this does NOT mean: the classes are not
//              waiting on him to exist. They are populated from ground already in
//              the world, so the feature is live today; the dial is the multiplier
//              that would ADD hazards beyond what the valley already contains, and
//              that is the number I am not allowed to invent.
//   FAVOURS    no faction in act one is healed by a floor, because act one has no
//              undead and ACT ONE ONLY (7/28) forbids me designing the ones that
//              might. The class is DEFINED so combat can read it and so the day he
//              rules what a cursed floor favours, it is one entry, not a system.
//   DENIES     this one is empty for a different reason and the difference matters:
//              it is not a tile at all. "Standing on a body prevents resurrection"
//              is a predicate over OCCUPANCY — who is on the cell — not over ground.
//              It ships as deniesOn(), which answers from a body, and no legend
//              sweep will ever populate it because no legend could.
//
// ============================================================================
// SOURCES
// ============================================================================
// laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md §2.4, §4 machine 6, §5, §6
// records/rf4/BOHEMIA_RF4_DANGER_SCHOOL_MASTER.md (his own 83-screen capture)
// engine/bohemia_district_kit.js — the registry every membership is derived from
(function (root) {
  'use strict';

  var HASREQ = (typeof module !== 'undefined' && module.exports);
  var NO_RULING = 'NO_RULING';

  /* ── THE FIVE CLASSES ────────────────────────────────────────────────────────
     Each carries HIS effect and the line of his corpus it came from. `floor:true`
     means the class is a property of GROUND and can be derived from a legend;
     `floor:false` means it is a property of a BODY and never appears in a sweep. */
  var CLASSES = {
    KILLS: {
      verb: 'kills',
      floor: true,
      says: 'pits — an enemy knocked or charging in dies outright',
      effect: { outright: true, channel: 'environmental', onlyOn: 'forced-entry' },
      /* the fence from §2.4: no weapon may ever route damage through this channel */
      weaponsMayUse: false
    },
    AMPLIFIES: {
      verb: 'amplifies',
      floor: true,
      says: 'unstable ground — +50% physical damage taken, and the tip is two-part: '
          + 'avoid standing on it while LEADING ENEMIES ONTO IT',
      effect: { physicalTakenMult: 1.5 },
      /* THE SAME TILE MEANS THE OPPOSITE DEPENDING ON WHO IS STANDING THERE. That is
         his tip, and it is the reason this class is worth more than a damage number:
         it is the only ground in the game you want your enemy on and yourself off. */
      symmetric: true
    },
    DISABLES: {
      verb: 'disables',
      floor: true,
      says: 'liquids switch OFF sprinting and movement abilities',
      /* WHY THIS IS THE STRONGEST OF THE THREE, IN OUR GAME SPECIFICALLY: the RF4
         lift makes a free-movement budget the headline system (§2.1, "the single
         highest-value item in the whole corpus"). Water is the one ground that turns
         it off. So a puddle is a wall against the best thing you own, without a
         single point of damage and without blocking a step. */
      effect: { sprint: false, movementAbilities: false }
    },
    FAVOURS: {
      verb: 'favours them',
      floor: true,
      says: 'cursed floor heals undead — terrain reading becomes mandatory, not optional',
      effect: { heals: 'undead' },
      /* EMPTY IN ACT ONE, ON PURPOSE. See the header. */
      actOne: false
    },
    DENIES: {
      verb: 'denies',
      floor: false,
      says: 'standing on a body prevents its resurrection; the floor stays contested '
          + 'after the kill',
      effect: { blocks: 'resurrection' },
      actOne: false
    }
  };

  /* ── THE DIALS ARE HIS ────────────────────────────────────────────────────── */
  var DIALS = {};                       /* how common each class is — Paolo's call */
  function dialFor(cls) {
    return Object.prototype.hasOwnProperty.call(DIALS, cls) ? DIALS[cls] : NO_RULING;
  }

  /* ── TWO STRUCTURAL LAWS THAT OUTRANK EVERY RULE ─────────────────────────────
     Both were learned by running the rules against all 62 real legends and reading
     what came back, which is the only way any of this was ever going to be right.

     (1) A FLOOR HAZARD MUST BE FLOOR. A body cannot be knocked into something that
         already blocks it, cannot stand in a puddle rendered as a wall, and cannot
         lose its footing on a prop it can never reach. So a hazard tile must be
         non-solid and must not be a portal (a portal is a door — going through one
         is the intent, not an accident). This veto caught FIVE false positives at
         once, including `intake:2 building (intake pump house)` being called a pit.

     (2) A RULE ADMITS ON THE NAME AND MAY ONLY VETO ON THE MATERIAL. The name is
         what the tile IS; the act-1 material is prose about how it looks, and prose
         mentions things the tile is not. Two false positives proved it: `rail:4
         cess` is the crew WALKWAY — the one good footing out there — and it was
         admitted because its description says "beside the ballast"; `railyard:3
         dead brush` was admitted because its description says "in the ballast".
         Both were the checker failing to tell A MENTION FROM A USE, which is the
         house's oldest bug and was fixed at the ruler, not at the targets.

     ── THE RULES ───────────────────────────────────────────────────────────────
     `any` admits (on the name), `not` vetoes (on name + material), and the veto
     runs first so a near-miss can never sneak in.

     THE VETOES ARE NOT DEFENSIVE PADDING, THEY ARE THE INTERESTING PART. Every one
     of them is a real collision found in the 62 legends: a speedway PIT ROAD is a
     road, a golf DRY WATER HAZARD is a hazard in the golf sense and 300 mm deep, a
     WASH BAY is a building. A classifier that cannot tell a name from a thing is
     the broken one. */
  var RULES = [
    {
      cls: 'KILLS',
      why: 'A HARD-BOTTOMED VOID WITH A RIM. Concrete or rock under it, a lip around '
         + 'it, and nothing to grab on the way down. Consent is the test, not depth: '
         + 'you climb into one, you do not get thrown into one.',
      any: [
        /\bdrained\b[^.]{0,30}\bpool\b/i,          /* the pool shell, plaster cracked */
        /\bsplash pool\b/i,
        /\b(aeration|filter)\b[^.]{0,20}\bbasin\b/i,   /* a treatment cell, walls high */
        /\bbench (lip|crest)\b/i,                  /* the top of a quarry cut face */
        /\bcrusted pond centre\b/i,                /* a crust that will not hold you */
        /\bshaft\b/i,                              /* down to the tunnel */
        /\bsewer tunnel mouth\b/i
      ],
      not: [
        /\bpit road\b/i,                           /* speedway: a road named "pit" */
        /\bdry water hazard\b/i,                   /* golf: a pond bed, ankle deep */
        /\bwash bay\b/i,                           /* truckstop: a building */
        /\bdome shell\b/i                          /* gypsum 7 means TWO things — below */
      ]
    },
    {
      cls: 'DISABLES',
      why: 'STANDING LIQUID YOU CAN WALK INTO. Not a drained shell, not a dry basin — '
         + 'water actually in it, deep enough to drag a foot and shallow enough to '
         + 'cross. It is the one ground that switches off the movement budget.',
      any: [
        /\bpit water\b/i,                          /* quarry + gypsum, sulfate blue */
        /\bleachate pond\b/i,                      /* landfill, black scum */
        /\bpond water\b/i,                         /* reclaim, still and green */
        /\bstanding water\b/i,                     /* pumpstation, a gland let go */
        /\bcoolant leak\b/i,                       /* datafort, dyed glycol */
        /\bshallow water\b/i,                      /* the drowned bed */
        /\blake water\b/i
      ],
      not: [
        /\bopen water\b/i,                         /* not crossable — see UNCLASSIFIED */
        /\b(dry|drained|dead|empty)\b/i            /* a dry basin is not a liquid */
      ]
    },
    {
      cls: 'AMPLIFIES',
      why: 'FOOTING YOU CANNOT SET. Loose, shifting or piled ground: you cannot brace, '
         + 'so you cannot absorb, so everything physical lands harder. And per his tip '
         + 'that cuts BOTH ways, which is why it is worth more than a multiplier.',
      any: [
        /\btalus\b|\bscree\b/i,                    /* mountain: "slow going", his words */
        /\brubble\b|\bdebris\b/i,                  /* freeway, interchange, stadium */
        /\bscrap\b/i,                              /* boneyard, rail: heaped steel */
        /\bcrusted sludge\b|\bscum\b/i,            /* watertreat: dried, then not */
        /\bballast\b/i,                            /* rail: graded rock, the worst */
        /\briprap\b/i                              /* grouted rock at a culvert lip */
      ],
      not: [
        /\bcrusted pond centre\b/i,                /* that one KILLS, and KILLS wins */
        /\bcess\b/i                                /* rail: the crew walkway — the one
                                                      piece of GOOD footing out there,
                                                      and it exists precisely because
                                                      ballast is bad footing */
      ]
    }
  ];

  /* A FLOOR HAZARD MUST BE FLOOR, AND "FLOOR" IS THE KIT'S OWN ANSWER: not solid, and
     on a layer a body actually stands on (ground, or a prop it can stand in).

     THIS RULE WENT OUT AND CAME BACK, AND THE ROUND TRIP IS THE POINT. The first version
     said exactly this. Six tiles passed it and came back walk:false when the RUNNING PAGE
     was asked -- `storage:3 debris / tumbleweed` among them -- so I tightened it to
     layer==='ground' and wrote down the lesson "a prop is an object on the ground, not the
     ground". THAT WAS THE WRONG LESSON. The kit models prop solidity PER TILE and defaults
     it to TRUE, so every solid:false in a legend is a district author deliberately saying a
     body may stand there; the walked surface was discarding all 48 of those declarations in
     one line that never looked at the flag. MEASURED: 4,327 of 4,327 such cells across 40
     real district cells disagreed with the model, and 0 of 4,327 after the fix.
     I had two systems contradicting each other and I believed the one in front of me
     instead of asking which was lying. Full finding + the gate that now compares them, tile
     by tile: records/BOHEMIA_THE_SURFACE_IGNORED_THE_MODEL_8_18_26.md, gates/occupancy_gate.js */
  function standable(kit, entry) {
    var K = kit || root.BohemiaDistrictKit ||
            (HASREQ ? require('./bohemia_district_kit.js') : null);
    if (!K || typeof K.tileLayer !== 'function') return true;
    var ly = K.tileLayer(entry);
    if (!ly) return true;
    if (ly.solid) return false;
    return ly.layer === 'ground' || ly.layer === 'prop';
  }

  /* ── DELIBERATE NON-MEMBERS ──────────────────────────────────────────────────
     Written down because a classifier's refusals are as much a claim as its picks,
     and an unrecorded refusal is indistinguishable from an oversight. */
  var UNCLASSIFIED = [
    { tile: 'open water (water:0)',
      why: 'Deep, not crossable on foot. DISABLES is for ground you can stand in; a '
         + 'body cannot stand in this at all, so it is a boundary, not a hazard.' },
    { tile: 'dry water hazard (golf:8), dead pond (park:9), dry fountain basin '
          + '(cityhall:8), dry basin (courthouse:8), dead fountain / pond (cemetery:9)',
      why: 'Ornamental basins, a step down at most. Neither a void nor a liquid. '
         + 'Calling every dry hollow a pit is how a hazard system stops meaning '
         + 'anything the moment the player notices.' },
    { tile: 'bench lip / dome shell (gypsum:7)',
      why: 'THE CODE MEANS TWO DIFFERENT THINGS — the crest of a working bench (a '
         + 'lethal edge) and the shell of a storage dome (a roof). ONE CODE CANNOT '
         + 'CARRY TWO OCCUPANCIES, so it is vetoed rather than guessed at, and the '
         + 'fix is in the gypsum generator: split the code. Filed, not papered over.' },
    { tile: 'cable trench (arsenal:13, battery:13, substation:13)',
      why: 'Covered. The material says so in all three. An uncovered one would be a '
         + 'textbook pit, and if that variant is ever authored it classifies itself.' },
    { tile: 'exposed lakebed (water:3, intake:4)',
      why: 'Cracked hard silt, walked on for a reason — this is the ground the '
         + 'drawdown gave back, and the whole point of it is that you can walk out '
         + 'onto it. Real Lake Mead bathtub-ring ground is firm, not sucking mud.' }
  ];

  function nameOf(L) { return String(L && L.name || ''); }
  function bothOf(L) { return nameOf(L) + ' :: ' + String(L && L.act1 || ''); }
  function ruleHits(rule, L) {
    var i, name = nameOf(L), both = bothOf(L);
    for (i = 0; i < rule.not.length; i++) if (rule.not[i].test(both)) return false;
    for (i = 0; i < rule.any.length; i++) if (rule.any[i].test(name)) return true;
    return false;
  }

  /* classOf: the one question everything else asks. Returns a class name or null.
     RULE ORDER IS PRECEDENCE and it is declared, not incidental: KILLS outranks
     DISABLES outranks AMPLIFIES, so a crusted pond that is both a trap and bad
     footing is a trap. A cell can never carry two classes. */
  function classOf(legendEntry, kit) {
    if (!standable(kit, legendEntry)) return null;
    for (var i = 0; i < RULES.length; i++) {
      if (ruleHits(RULES[i], legendEntry)) return RULES[i].cls;
    }
    return null;
  }
  function ruleFor(cls) {
    for (var i = 0; i < RULES.length; i++) if (RULES[i].cls === cls) return RULES[i];
    return null;
  }

  /* classify: one district's legend -> { code: class }. */
  function classify(legend, kit) {
    var out = {};
    if (!legend) return out;
    for (var code in legend) {
      if (!Object.prototype.hasOwnProperty.call(legend, code)) continue;
      var c = classOf(legend[code], kit);
      if (c) out[code] = c;
    }
    return out;
  }

  /* sweep: the whole valley, DERIVED FROM THE REGISTRY, never from a list kept here.
     Pass the district kit (node) or let it find the browser global. */
  function sweep(kit) {
    var K = kit || root.BohemiaDistrictKit ||
            (HASREQ ? require('./bohemia_district_kit.js') : null);
    if (!K || typeof K.types !== 'function') return {};
    var out = {}, types = K.types();
    for (var i = 0; i < types.length; i++) {
      var spec = K.get(types[i]);
      if (!spec || !spec.legend) continue;
      var hits = classify(spec.legend, K);
      for (var _k in hits) { out[types[i]] = hits; break; }
    }
    return out;
  }

  /* ── WHAT THE FLOOR DOES TO A BODY ──────────────────────────────────────────
     Three answers, each a pure function of the class and the situation. No state,
     no timers, no RNG: a hazard that behaves differently on two identical steps is
     a hazard nobody can learn, and PUBLISHED DETERMINISTIC AI (§2.3) is already law
     for the enemies standing on it. */

  /* enters: 'walked' (you chose it) | 'knocked' | 'charged' (you did not).
     Returns true only for the entries his corpus names. */
  function killsOnEntry(cls, entry) {
    if (cls !== 'KILLS') return false;
    return entry === 'knocked' || entry === 'charged';
  }

  /* the multiplier a body standing on this ground takes physical damage by. */
  function physicalTakenMult(cls) {
    return (cls === 'AMPLIFIES') ? CLASSES.AMPLIFIES.effect.physicalTakenMult : 1;
  }

  /* can this body sprint / use a movement ability from this ground. */
  function canSprint(cls) { return cls !== 'DISABLES'; }

  /* DENIES is occupancy, not ground: a body underfoot cannot come back up.
     Empty of contents in act one (nothing resurrects yet) but the mechanism is here
     so the moment something does, the floor already contests it. */
  function deniesOn(cell) {
    return !!(cell && cell.body && cell.body.dead && cell.standingOn === true);
  }

  var API = {
    CLASSES: CLASSES, RULES: RULES, DIALS: DIALS, UNCLASSIFIED: UNCLASSIFIED,
    NO_RULING: NO_RULING,
    classOf: classOf, classify: classify, sweep: sweep, ruleFor: ruleFor,
    dialFor: dialFor,
    killsOnEntry: killsOnEntry, physicalTakenMult: physicalTakenMult,
    canSprint: canSprint, deniesOn: deniesOn
  };
  if (HASREQ) module.exports = API;
  root.BohemiaHazard = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
