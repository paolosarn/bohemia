# BOHEMIA FAILURE TRAINING — every thumbs-down, its root cause, the lesson, the guardrail
# (Paolo 7/19/26: "Record and train yourself on all failures that I thumbs down.")

This is the durable record of REJECTED work so I stop repeating it. GRAVEYARD IS FINAL:
dead approaches stay dead. Each entry = what I made, Paolo's verdict (verbatim where I have
it), the ROOT CAUSE, the LESSON, and the MACHINE GUARDRAIL that now prevents recurrence
(a lesson without a gate is not enforced). Read this before building any district or art.

================================================================================
## TONIGHT'S FAILURES (the park saga, 7/19) — the freshest, deepest lessons
================================================================================

### FAIL 1 — PARK v1, the "SUPER PARK" (token: PARKFAIL-SUPERPARK)
WHAT I MADE: a park cell crammed with EVERY amenity at once — baseball diamond + soccer
field + 3 hard courts + skate park + fenced dog run + community garden + playground +
plaza + pond + picnic grove — all fighting for space in one 96m cell.
PAOLO, VERBATIM: "I'm not a big fan of the super park that you made it's a lot going on and
it doesn't look realistic. Try to make a park more realistic and not try to like have like
a super park."
ROOT CAUSE: I equated EXPLAIN-EVERY-TILE with CRAM-EVERY-TILE. I researched "what amenities
exist in parks" and dumped the whole parts-list into one cell to look impressive/thorough.
LESSON: REALISTIC BEATS IMPRESSIVE, always. "Super" is an insult from Paolo. A real park of
this size has a FEW things and a lot of open space. Don't show off by maxing density.
GUARDRAIL: park_gate.js LAWN-DOMINANT check (open lawn must be >55% of the cell) — the
generator physically cannot regress to a super-park and pass.

### FAIL 2 — PARK v2, the "PERFECT CIRCLE" (token: PARKFAIL-CIRCLE)
WHAT I MADE: the calm rebuild, but the walking loop was a mathematically perfect circle
(an ellipse ring), and the basketball court overlapped and "punched through" that ring.
PAOLO, VERBATIM: "I don't like that perfect circle and the basketball court like breaking
through the perfect circle. I don't like that. It's not realistic do online research. Find
out what a park looks like, create me a good custom grid of the park."
ROOT CAUSE: (a) geometric primitives (a drawn circle) read as a COMPUTER DRAWING, not a
place. (b) I drew the path FIRST then stamped the court over it, so the court visibly
severed the path — draw order created an impossible overlap.
LESSON: NO FAKE GEOMETRY. Real park paths are CURVILINEAR/organic and route AROUND features;
a feature never sits ON a path. And RESEARCH FIRST for real — I only did real research
(design guides) on v3, and it immediately worked.
GUARDRAIL: v3+ draws AMENITIES FIRST, then lays a Catmull-Rom WINDING trail only over open
ground, so the trail flows around every feature and no court can break through it.

### THE THROUGH-LINE (the meta-lesson that would have saved all three rounds)
- RESEARCH THE REAL THING'S PROPORTIONS + SPATIAL LOGIC, not just its parts-list. "A park
  has courts and a field and a playground" is a parts-list; "a 9-acre park is ~half open
  passive lawn with a few amenities near the street and a winding trail" is the real design.
- EXPLAIN-EVERY-TILE and DON'T-CRAM are NOT in tension: open lawn is a NAMED, intentional
  thing (it IS the park), threaded by trees/paths/benches so it reads as designed, not blank.
  The right answer is the REAL density, not maximum and not empty.
- Draw order encodes reality: hardscape/buildings first, circulation routed around them.

================================================================================
## PRIOR FAILURES ALREADY RECORDED (index — full post-mortems where noted)
================================================================================
- SUBURB "you added more streets wtf": I added streets to fill dead corners. Paolo wanted
  the corners to stay dead-yard, not more road. LESSON: never add road to squeeze fill; a
  rigid footprint that can't fill a corner leaves the corner as (named) dead yard. In
  laws/BOHEMIA_PLACEMENT_PLAYBOOK_7_18_26.md.
- SUBURB central cul-de-sac court: REJECTED for THE BLOCK packed grid (left a dead hole,
  fewer homes). GRAVEYARD FINAL (gates/bohemia_graveyard.txt).
- COMMERCIAL empty apron + garage ("you shouldn't be putting down a single tile without
  being able to explain what it is"): birthed the EXPLAIN-EVERY-TILE LAW + kit helpers
  legendOk/voidFraction/largestBlob. Root cause: unnamed placeholder space.
- COMMERCIAL corner stores too small / top-left street not connecting: fixed to 2x-size
  corner stores + punched-through curb cuts. In the placement playbook.
- CLOTHING batch 1 (flat body-traced, no detail): all DOWN -> graveyard. LESSON: the corpus
  is PAINTED, not flat-filled. records/BOHEMIA_CLOTHING_GRAVEYARD.txt.
- HATS batch 1 (DUST/COAL BEANIE, SALVAGE/RUST CAP, OXBLOOD/OLIVE HEADWRAP): DOWN, shallow
  floating caps that ignored the durag hat line + competed with Paolo's durag. GRAVEYARD.
- TRAFFIC SIGNALS v2/v3 ("looks like dog shit in comparison"): the corpus is PAINTED not
  filled; birthed the 45-DEGREE ART LAW. Full saga in the handoff.
- MUSIC kills (SUNKEN VESPERS, UNDERTOW, VIA PURIFICO, HYMN IN THE FLOOD, THE DROWNED CHOIR,
  WHAT THE GLASS REMEMBERS): GRAVEYARD FINAL, fresh cooks answer the slots.

THE PATTERN ACROSS ALL OF THEM: I fail when I optimize for IMPRESSIVE/THOROUGH/MAXIMAL
instead of for the REAL thing done calmly and correctly, and when I skip reading the
existing law / doing real research first. Fix both and the react-and-fix rounds vanish.
