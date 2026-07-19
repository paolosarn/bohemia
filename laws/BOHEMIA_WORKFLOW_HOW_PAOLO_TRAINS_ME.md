# BOHEMIA WORKFLOW — HOW PAOLO WORKS + HOW I MOVE FAST (7/18/26)

Paolo: "record your proper workflow and how I've trained you... I can't be taking six
hours to get two things done." This is that record. Read it every session. It exists to
kill the slow loop, not to describe it.

## WHY TODAY WAS SLOW (the real diagnosis)
Two things ate the day, and BOTH are fixable:
1. I showed him output before I LOOKED at it. Every "wrong output -> he reacts -> I fix"
   round is a full turn of his day. Most were avoidable.
2. I fixed ONE thing per turn and waited. Corner-by-corner, gate-by-gate. Each tweak =
   a whole render+ship+react cycle. Serial. His time, spent one nudge at a time.
NOT the cause: thinking too little. The cause: not front-loading (specs, looking,
batching). Speed comes from doing MORE before he has to speak, not from thinking less.

## EXPLAIN-EVERY-TILE LAW (Paolo 7/18, standing, the highest bar)
"You shouldn't be putting down a single tile without being able to explain what it is."
If I can't name what EVERY tile is, I'm doing a terrible job. Two hard rules:
1. NO UNEXPLAINED EMPTY SPACE. A big blank slab of asphalt or dead ground is laziness, not
   a design. Real places fill their footprint with purpose: a hospital's front isn't a void,
   it's visitor parking + a drop-off loop + ambulance bays + walkways + dead landscaping
   islands. Research what actually fills the space and put it there.
2. EVERY CODE HAS A LEGEND. Every non-ground tile maps to a named thing in the district's
   palette; I can point at any tile and say what it is and why it's there. Gated: the void
   fraction must be low and every code must be in the legend.
Combine with research-first: research the real thing, then fill the grid so nothing is
unanswered. Thin dead-ground margins are fine; giant blank interiors are not.

## RESEARCH-FIRST LAW (Paolo 7/18, standing, EVERY district/thing)
Before building ANY district (or real-world thing), do ONLINE RESEARCH of what it
actually looks like — real site plans, aerial layouts, the anatomy — and let what I see
INSPIRE the generator. Paolo: "I definitely need you inspired by what you see online
before you build anything, cause I see the vision." Ground every generator in reality
(the warehouse got a truck court, trailer staging, car lot, office, guard shack from
research — not invented). Cite the sources. Everything we have (laws/banks) PLUS online
research, then build. This is step 0 of the fast loop below.

## THE FAST LOOP (do this, every build)
0. RESEARCH THE REAL THING (see the law above) — reference before code, always.
1. READ THE LAWS FIRST. Before writing placement/art code, grep the laws + banks for an
   existing ruling (PARKING_LAW, ART_45, the playbook). I rebuilt parking twice because
   I didn't read BOHEMIA_PARKING_LAW that already existed. Specs first = zero rework.
2. RENDER AND LOOK. Headless chromium -> PNG -> I look, before I claim or show. A green
   gate is not a look. This one rule removes most of the react-and-fix rounds.
3. BATCH THE DECISIONS. Don't ship one tweak and wait. Anticipate the next 3-5 things he
   will want and do them in the same turn, or show 2-4 VARIANTS so one message resolves
   many choices. Fewer, denser turns beat many thin ones.
4. GATE IT SAME TURN. New behavior = new gate check the same turn (green or it doesn't
   ship). Then I can change fast without re-asking whether I broke something.
5. SHIP TO MAIN + END WITH THE PLAY LINK. Every turn.

## HOW PAOLO WORKS (obey this or waste his time)
- Voice-to-text, garbled. Decipher intent; never take a garbled word literally.
- He DECIDES, I PRODUCE. Ship A LOT per turn. Small timid turns are a standing complaint.
- ONE bold question max per response, bolded. He answers farthest-back first.
- Never make him dig in files. Present everything; don't send him to go find things.
- Direct, casual, swears, zero fluff, NO em dashes ever.
- When he corrects something: fix it, root-cause it, move on. Don't re-litigate.
- Do NOT spend tokens on walkable demos for him to judge unless the thing is ALMOST
  DONE. Still top-down proof images are the currency for progress checks.
- Verdict workflow: he judges rarely, in big passes (thumbs / comments / export), not
  tweak-by-tweak. Give him a batch to rule on, then run.
- Everything we build must be UPGRADABLE across all 3 acts — design for act-states from
  the start, don't bolt them on.
- Dead world in act 1: no living vegetation, dead-dirt ground, never render developed
  ground as void.

## THE FACTORY (how volume actually ships)
Typed spec -> generator -> batch output -> kill/approve -> its own regression gate. A
law without a machine gate is not enforced. Build the MACHINE (a shared district KIT:
street-aware gates, dead-world palette, footprints, service access, gate, act-states),
then each new district is a short config + its unique bits, not a from-scratch build.
That is what turns "30 districts x tiles x 3 acts" from impossible into a queue.

## LESSONS FROM THUMBS-DOWN (7/19 — the park saga; full record in
## records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md)
6. REALISTIC BEATS IMPRESSIVE. "Super" is an insult. Don't cram a district to look
   thorough/maximal — build the REAL thing calmly. A real park is mostly open lawn + a FEW
   amenities, not every amenity at once. (Park v1 super-park -> rejected.)
7. RESEARCH PROPORTIONS + SPATIAL LOGIC, not a parts-list. "A park has courts and a field"
   is a parts-list; "a park is ~half passive lawn, amenities near the street, a winding
   trail" is the design. Real research (design guides) on v3 worked first try.
8. NO FAKE GEOMETRY. Perfect circles/ellipses read as a computer drawing. Real paths are
   curvilinear/organic and route AROUND features; a feature never sits ON a path. Draw
   HARDSCAPE first, then lay circulation over open ground only. (Park v2 perfect-circle +
   court-through-path -> rejected.)
9. EXPLAIN-EVERY-TILE != CRAM-EVERY-TILE. Open lawn is a NAMED, intentional thing threaded
   by trees/paths/benches. The target is the REAL density — not maximal, not empty.

## THE TILE-SPEC NOTE SECTION (Paolo 7/19: "every time I approve a district you're recording
## a note section about everything you built, so when it comes to put TILES on it it's easier")
Every built district exposes a machine-readable LEGEND (code -> {name, kind, ACT-1 dead-world
material}) right next to its PALETTE. `node tools/bohemia_tilespec.js` GENERATES a per-district
sheet in records/tilespec/ (+ an index) from that legend, so the tiling phase opens ONE sheet
and every tile code maps to known art. `gates/tilespec_gate.js` fails if any district ships a
tile code without a legend entry — the note section can never drift from the tiles. ACT-2/3
evolution of each material is [PENDING Paolo] (CONTENTS-PAOLO'S). STANDING FLOW: a new/approved
district = expose its LEGEND + rerun the generator, same turn.

## THE PROMISE TO PAOLO
Next builds: I read the relevant law first, I render and look before I show him, I batch
the obvious follow-ups (and offer variants) so he rules once instead of ten times, and I
only pull him in to judge when it's near-done. That is the difference between six hours
for two things and one turn for a district.
