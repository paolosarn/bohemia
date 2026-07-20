# BOHEMIA — HOW TO BUILD A DISTRICT (the method, and how the self-instructions get made)

Paolo 7/19: "make instructions for even how you make instructions for yourself... you called
it the district kit at one point... make sure we're learning things together."

This is the read-this-BEFORE-you-build-a-district doc. It is the instructions for making the
instructions. It sits on top of two other docs: the per-district DOSSIERS (records/tilespec/)
and the tiling brief (laws/BOHEMIA_TILING_PHASE_INSTRUCTIONS.md). Together they are the full
self-instruction stack — build -> record -> tile — and every layer is machine-gated.

## THE MACHINE: THE DISTRICT KIT (engine/bohemia_district_kit.js)
Every district is built ON the kit — the shared machine, so a new district is a short config +
its unique bits, never from scratch. What the kit gives you:
- `grid(seed,w,h)` -> the drawing surface + chainable primitives: set/get/rect/hbar/vbar/
  frame/disc, plus `rnd`. `M(m)` converts meters->tiles (TILE=0.75 m, SZ=128 tiles/cell).
- STREET-AWARE: `streetEdges(neigh)`, `primaryStreet`, `rotateCW`, `scanGates`, `pedGate`, and
  `rotateToStreet(canonicalGrid, streets, opts) -> {g, primary, gates}`. You BUILD canonical
  (car entrance at the SOUTH edge); the kit rotates it onto the real street + adds pedestrian
  gates on corner side streets.
- DRIVABLE: `driveReachFromStreet(g, driveCode)` (a car reaches the network from the curb),
  `driveNetworkOk`, `driveTouchesEdge`, `stallsReachable`.
- STRUCTURE: `footprints(g, isBody)`, `connectedFrom`, `ground(x,y,sun)` (dead-dirt).
- TAXONOMY: `category(type)`, `CATEGORIES`, `inCategory` (77 types -> 8 categories).
- EXPLAIN-EVERY-TILE: `legendOk(g,palette)`, `voidFraction(g)`, `largestBlob(g,isBlank)`.
- LAYERING: `KIND_LAYER`, `tileLayer(entry) -> {layer, solid, enter}`.
- REGISTRY + acts: `register/get/types`, `act(res, a, rules)`.
Gate for the machine itself: `gates/district_kit_gate.js`.

## THE METHOD (in order) — build a district AND its self-instructions in one turn
1. **RESEARCH FIRST.** Online-research the REAL thing before building. Take its PROPORTIONS +
   spatial logic, not a parts-list. (Park lesson: "a park is ~half open lawn", not "a park has
   courts+field+playground".)
2. **BUILD CANONICAL-SOUTH on the kit.** Author the layout with the car entrance at the SOUTH
   edge, using kit primitives. EXPLAIN-EVERY-TILE: no blank slabs; every tile is a named legend
   item; research what fills the space and put it there. Dead-world act 1 (no living vegetation).
3. **STREET-AWARE + DRIVABLE.** Call `K.rotateToStreet(...)` to spin the entrance onto the real
   street + add pedestrian gates on corner side streets. Make the drivable surface EXPLICIT (a
   drive code) and reachable from the curb in EVERY placement (each single edge + corners).
4. **RECORD THE DOSSIER (the self-instructions).** Right next to the PALETTE expose:
   - `LEGEND`: code -> {name, kind, act1 material, + layer/solid/enter where they differ from
     the kind default}. Layer = ground/structure/overhead/prop/portal; solid = does it block;
     enter = the interior it opens.
   - `NOTES`: {summary, reference[], layout[], circulation, layering, decisions[]}.
5. **RENDER AND LOOK.** Headless chromium -> PNG -> LOOK at the pixels before showing/shipping.
   A green gate is not a look. Fix what looks wrong; re-render.
6. **GATE IT.** Write `gates/<name>_gate.js`: anatomy present; street-aware + drivable across 6
   configs (S/N/E/W + two corners); legend-complete + low void; registered + categorized;
   dossier + layering complete; deterministic. Register it in `gates/bohemia_gates.py`.
7. **WIRE IT.** One line in `engine/bohemia_world.js` DISTGEN (`type -> {mod, foot, zone}`); add
   the module to the DISTRICTS lists in `tools/bohemia_tilespec.js` + `gates/tilespec_gate.js`;
   regenerate the dossiers: `node tools/bohemia_tilespec.js`.
8. **INTERIORS.** Every enterable structure opens an interior via `plot.building(i).interior()`
   — a special generator (garage) or the room floorplan. INTERIOR===EXTERIOR LAW: the interior
   floor plate is ALWAYS exactly the footprint w x h (each deck too). Gate: world_gate.js.
9. **SHIP.** Gates green -> commit -> merge main (same turn, no asking) -> push -> end with the
   play link.

## HOW THE SELF-INSTRUCTIONS GET MADE (the meta)
- The DOSSIER (step 4) is GENERATED into records/tilespec/ by `tools/bohemia_tilespec.js` — you
  don't hand-write the sheet, you expose NOTES+LEGEND and the generator writes it, so it can't
  drift. `tilespec_gate.js` fails if any district's dossier/legend/layering is incomplete.
- The TILING brief (laws/BOHEMIA_TILING_PHASE_INSTRUCTIONS.md) is the standing read-this-when-
  you-tile doc; the dossiers feed it.
- THIS doc is the read-this-when-you-BUILD doc. build-instructions (this) + per-district
  dossiers + tiling-instructions = the full self-instruction stack, all gated.

## THE LAWS THAT APPLY (all machine-gated — see CLAUDE.md for the full list)
Street-aware/drivable · Explain-every-tile · District dossier + Layering · Interior===exterior ·
Dead-world act 1 · 45-degree art · Verify on the real surface · Purple reservation · Map law
(Claude plumbs, Paolo places canon) · Mechanism-mine / Contents-Paolo's (leave his canon empty:
names, act-2/3 evolution, faction ownership, what spawns).

## THE TEMPLATE (a new district module)
```
(function(root){
  var K = require('./bohemia_district_kit.js') || root.BohemiaDistrictKit; var M=K.M;
  function buildCanonical(seed){ var G=K.grid(seed), g=G.g, W=G.W, H=G.H;
    /* draw the layout, car entrance at SOUTH; EXPLAIN-EVERY-TILE; dead-world */ return g; }
  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:isSoft});
    return {g:res.g, W:res.g[0].length, H:res.g.length, streets:streets, gates:res.gates,
            footprints:K.footprints(res.g,isBuilding)}; }
  function driveConnected(res){ return K.driveReachFromStreet(res.g, DRIVECODE) > 0.85; }
  var PALETTE={/* code->hex, no purple */};
  var LEGEND ={/* code->{name,kind,act1, layer?,solid?,enter?} */};
  var NOTES  ={ summary, reference:[], layout:[], circulation, layering, decisions:[] };
  K.register('<type>', {generate, body:isBuilding, category:'<cat>', palette:PALETTE, legend:LEGEND, notes:NOTES});
  var API={generate, driveConnected, footprints:function(r){return r.footprints;}, palette:PALETTE, legend:LEGEND, notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.Bohemia<Type>=API;
})(...);
```
Then: gate + one DISTGEN line + tilespec lists + regenerate + render + ship.

## WE LEARN TOGETHER (why this doc exists)
Every Paolo ruling becomes a law + a gate the SAME turn, and the method compounds:
- park "super-park" -> LAWN-DOMINANT gate; perfect-circle -> curvilinear + draw-order.
- "drivable, corner or standalone?" -> STREET-AWARE/DRIVABLE law + rotateToStreet.
- "record what's happening in the district" -> the DOSSIER (NOTES+LEGEND).
- "the layering / what it looks like inside" -> LAYERING + tileLayer + world.plot APIs.
- "interior must match the exterior w x h" -> INTERIOR===EXTERIOR law + world_gate check.
- "instructions for when you tile" -> the tiling brief.
- "instructions for how you make instructions" -> THIS playbook.
Read this first, follow the method, and the next district ships correct and self-documented.
