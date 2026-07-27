LAB (09): 7/26 (g) — THE ZOMBOID PAGE IS DEAD AND THE RULING THAT KILLED IT IS THE MOST
USEFUL THING THIS LANE HAS PRODUCED. Paolo: "That was really bad and not fun."
KILLED, DELETED, GRAVEYARDED, gate row removed, no v2. Post-mortem:
records/BOHEMIA_ZOMBOID_LOOT_KILL_7_26_26.txt. The teardown and pattern note survive
marked DEAD at the top, because facts about another game's code stay facts.
THE LAW (laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md, LOCKED), his words:
"I kind of want Luc [loot] to be very simplified... I want it easier to loot... imagine
if that went by really quick instead of really slowly I might give a fuck about it...
State of decay has decent looting system in place... even if there were less items than
that... I really want the game to be minimalistic in that regard... maybe the item will
be resources but like the description it might tell you like what type of resource it is
to help you understand the amount... at the end of the day I would want the item be like
you found like three".
  1. LOOTING IS FAST. A container resolves in ONE ACTION, never an item-by-item queue.
  2. A FOUND THING IS A RESOURCE WITH A COUNT, not an object with a name. FOOD x3.
  3. THE DESCRIPTION CARRIES THE FLAVOUR and its job is to explain the amount. Flavour
     is read, never counted, never inventoried, never carried as separate objects.
  4. MINIMALISTIC IS THE BAR. FEWER kinds than State of Decay. When in doubt, cut one.
  5. CUSTOMISATION IS NOT LOOT VOLUME. Depth comes from the wardrobe and the rig.
  6. STATE OF DECAY (and SoD2) is the reference. PROJECT ZOMBOID IS AN ANTI-REFERENCE
     FOR LOOT PACE and may never again be cited to make our looting slower or finer.
[PENDING Paolo], all content and nobody invents it: the resource KINDS and how many, the
yield range per container kind, what a search costs in time, whether a container can be
searched twice, and whether searching is noisy.
WHAT SURVIVES FROM THE DEAD PAGE: exactly one recommendation, THE CONTAINER IS THE
CONTRACT — what you find is keyed on the district and the KIND of container, which our
tilespec dossiers already name. Everything about the time economy is dead for us.
THE LESSON, written into the post-mortem so it binds the next session: A REFERENCE IS
NOT NEUTRAL. Choosing which game to emulate is already a design decision. Emulating a
game whose pacing is the opposite of what Paolo has asked for produces a faithful,
gated, worthless artifact. Before the next emulation, state in ONE LINE what feel the
target game has and check it against his standing rulings; if it conflicts, the
emulation is dead before it is written. 245 green checks could not ask whether it was
fun — GREEN PROVES NON-VIOLATION AND NOTHING ELSE.
NOTHING WAS BUILT THIS TURN AFTER THE KILL, on purpose (STOP PRODUCING). The next lab
target is his to name, and the loot system itself belongs to the owning lane once he
rules the numbers.


LAB (09): 7/26 (e) — HE APPROVED ALL FOUR PORTED MECHANISMS AND RULED THE BIG ONE
WIDER IN THE SAME BREATH. "I like it all tbh all 3 and sleep understand sleep can be
hangout or eat too u know".
THE RULING (laws/BOHEMIA_ADDENDUM_THE_MOMENT_IS_ANY_SPENT_BLOCK_7_26_26.md, LOCKED):
the world resolves at ANY BLOCK OF TIME THE PLAYER SPENDS. Sleep is only the biggest
one. A hangout is one. A meal is one. Same mechanism, three sizes.
WHY IT IS A GOOD RULING, in his own logic: a hangout that moves the world is a REASON
to hang out, and eating becomes a decision instead of a menu. In a game about being
watched, every social act becomes a way to spend the only currency there is, and sleep
stops being the only button that does anything.
MECHANISM CHANGED THE SAME TURN, engine/bohemia_resolve.js: a resolver is now built
with a CALLER-DECLARED list of moments, each carrying a SIZE. A system declares WHICH
moments it answers; a system that declares nothing answers all of them (documented as a
real choice, not an oversight). Resolving an undeclared moment is a BUILD ERROR, so a
typo cannot invent a fourth kind of night. The moment reaches each step as its OWN
FROZEN ARGUMENT, never through the shared context, so zero coupling survived the
change. A meal moves less than a night because each system says so, not because the
module hardcoded a night.
THE MODULE STILL SHIPS NO MOMENT NAMES AND NO SIZES. The gate asserts that the
executable code contains no SLEEP/HANGOUT/EAT and no size literals: those are canon and
they are his. STILL [PENDING Paolo], all content: the moment table (which moments, how
long each spends), the action cost table, the ration limits, the faction standing ladder,
and reach in tiles. No lane fills any of them in.
VERDICT RECORDED: records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt — APPROVE on ration,
ceiling, reach + one contextual verb, and resolve. APPROVE unlocks volume, so the owning
lanes may now adopt without asking again, and the adoption items are FILED INTO THEIR
BACKLOG SECTIONS by that verdict:
  RUN item A  — one contextual verb + the declared reach (it REMOVES UI: the run has a
                talk trigger AND a door bump AND separate buttons today)
  WORLD item A — the resolve point, registering territory / who-noticed-you / the
                overnight feed / decay as steps at a spent block
  LIFE/SOCIAL item A — the ration for favours, posts and gifts (by COUNT, never money)
                and the standing ceiling for factions (a wall you pass by committing)
Each one carries its own [PENDING Paolo] for the numbers. THE LAB STILL DOES NOT WIRE
THEM IN — that is each lane's build item, because those lanes are editing those files.
Gate: gates/resolve_gate.js, 77 checks (was 59), all six mutations tested and each one
turns it red. Nothing here touches the alpha, so its build stamp is unchanged.

LAB (09): 7/26 (d) — THE FIRST PORT LANDED, ON HIS ORDER. He played LAB-03, said "all
these things worked", and asked "anything we can throw in the bohemia code right now?"
That is a port order, so laws/BOHEMIA_ADDENDUM_LAB_PORTS_ON_HIS_WORD_7_26_26.md now
governs it: the lab ports ONLY when he says so, ships MECHANISM ONLY in its own new
file, never wires itself into another lane's surface, and carries its provenance.
engine/bohemia_resolve.js — headless, zero dependencies, brand new file, so it cannot
collide with the lanes editing the alpha right now. Four mechanisms, all learned by
rebuilding Stardew from its own source:
  RESOLVE — ONE moment, a DECLARED phase order (WORLD/PLACES/PEOPLE/BOOKS/FEED), and no
  step able to read another step's report. Registration order decides nothing except
  ties inside a phase. A step that throws is reported BY NAME and the rest of the night
  still runs, because one broken system must never eat the player's night. This is the
  LAB-03 finding: three mechanics that share nothing but the rollover.
  RATION — a limit by COUNT per day and per week, with a bypass that overrides both and
  can carry a multiplier (the birthday shape). The gate proves there is no cost, price,
  gold or money term anywhere in the mechanism. This is the one I think matters most for
  us: a favour or a post limited by money stops mattering the moment the player is rich.
  CEILING — points cannot pass the CURRENT state's cap, and the ONLY thing that moves
  the cap is a state change. 500 favours cannot grind past a wall; you have to commit.
  Neglect is allowed to get more expensive as you get closer. This is the faction
  standing shape.
  REACH — one declared range, one facing rule, one predicate. Forgiveness is a number
  and it is small.
EVERY TABLE IS EMPTY, ON PURPOSE. No ration limits, no faction thresholds, no reach
number, no action costs for any real Bohemia system. Callers pass them in and the FIRST
DEFAULT IS A RULING, not code. The gate enforces it: the executable mechanism may not
name a single piece of Bohemia or Stardew content.
Gate: gates/resolve_gate.js, 59 checks, registered as LAB PORT. MUTATION-TESTED, which
is the only reason to believe it: breaking the ceiling clamp, leaking reports between
steps, or letting a thrown step kill the moment each turn exactly one check red.
NOT WIRED INTO ANYTHING. Adoption is the owning lane's build item: RUN wants the
contextual verb and the reach constant, WORLD wants the resolve point at SLEEP AND SAVE,
LIFE/SOCIAL wants the ration for favours and posts and the ceiling for faction standing.
Nothing about this port touches the alpha, so its build stamp is unchanged again.

LAB (09): 7/26 (c) — THE THREE MECHANICS NOW STAND IN A WORLD YOU WALK AROUND, WHICH
IS WHAT HE ASKED FOR. "pull up to the mini lake you can start fishing pull up on your
potential spouse. Do all of this pull up on your farm."
slices/lab/BOHEMIA_LAB_STARDEW_WORLD_7_26_26.html — one town, one clock, one purse:
your farmhouse with a bed, a 54-tile fenced plot behind it, the shop up the road, a
lake with a dock, and EMILY walking a real schedule across the map.
ONE ACTION BUTTON and the WORLD decides what it means: CAST facing water, USE TOOL
facing soil (the tool/seed/fertilizer chips only appear when you are standing on the
plot), TALK when you are within a tile of her, SLEEP at your bed, HOLD TO REEL once a
fish is on. The tile you are about to act on is outlined in yellow so the button is
never a mystery.
SLEEP IS THE ONLY INTEGRATION POINT between the three systems: crops advance or stall,
soil dries, her friendship decays if you did not say hello, the wedding counts down,
her schedule resets. Three mechanics, one clock, ZERO coupling. That architecture is
the thing worth copying, not an event bus.
THE FINDINGS, in records/lab/BOHEMIA_LAB_STARDEW_WORLD_NOTE_7_26_26.md: the walk
stopped being a feature and became a sentence structure (go there, do that) and should
never be judged on its own again; one contextual verb REMOVES UI instead of adding a
button per system, which is the shape a phone wants; reach/interaction slack should be
ONE declared constant, not three ad-hoc checks; and distance on the map is a bigger
tuning knob than any number inside a mechanic (the plot is 4 tiles from the door, the
dock is 30 across the map — a chore versus a trip, authored in tiles, enforced by
nothing).
Gate: 179 checks. The world half does not inspect state, it PLAYS: walks out the front
door to the plot with the real movement code, tills/seeds/waters by facing the soil,
walks the length of the map to the dock, casts, works the bar until the fish is landed
and paid, walks up to her and lands the bouquet, walks home, in through her own front
door, to the bed, sleeps, and asserts the crop advanced exactly one phase and the soil
dried. Four contexts are asserted too, including that an empty field offers nothing.
HIS MUSING IS RECORDED AND NOT ACTED ON: "in our world it's gonna most likely be like a
Hydro farm pool or something I don't know but yeah." Written down verbatim in the note,
treated as thinking out loud, NOT canon. No Bohemia growing system, pool or hydro farm
was invented. If he rules it, it becomes a CITY/WORLD backlog item with his words as
the source.
NEXT IN THIS LANE: he names a game and its mechanics. LAB-2 (Zomboid loot loop) is
still queued and now means containers + weight + search + degradation, in a world.

LAB (09): 7/26 (b) — PAOLO REJECTED THE FIRST EMULATION'S WHOLE PREMISE, AND HE WAS
RIGHT. "who said I wanted to test the walking like why did you just focus on like
movement like it was supposed to be like the actual game and all its mechanics... you
need to get the code online and implement it for the different game mechanics like
marriage and fishing in farming". TWO LAWS LANDED THE SAME TURN, both LOCKED:
  laws/BOHEMIA_ADDENDUM_LAB_IS_WHOLE_MECHANICS_7_26_26.md — a lab emulation is THREE
  OR MORE NAMED MECHANICS, each playable END TO END, built from the master's real
  source. Movement / camera / collision / lighting / transitions are PLUMBING and can
  never be a lab deliverable again; lab_gate fails any row that declares one. Speed is
  the point: he named the bar himself (people remake a game in an hour), so breadth
  first, depth only on request.
  laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md — "Bohemian movement is
  gonna be the world moves when you move where the world moves when you spend time
  taking an action". THE WORLD ADVANCES WHEN THE PLAYER SPENDS TIME ON AN ACTION. No
  continuous free walking in the overworld, ever; the beat is the QUANTISER, not a
  clock the world runs on by itself. The three-option fork LAB-01 had written up is
  CLOSED. Still his and still unwritten: the ACTION COST TABLE (what a step costs vs a
  swing vs a search). No lane invents that.
SHIPPED, the actual assignment: slices/lab/BOHEMIA_LAB_STARDEW_MECHANICS_7_26_26.html
— FISHING, FARMING and MARRIAGE, three tabs, one shared day, every loop closing.
  FISHING is the real bobber bar: a 96px bar in a 568px column, +8px per fishing level,
  gravity 0.25 down and 0.25 up while you hold, BOTH damped x0.6 while the fish is
  inside, progress +1/500 a tick in the bar and -3/1000 out. THE WHOLE FISHING SKILL
  TREE IS BAR HEIGHT — there is no other mechanical reward for levelling it.
  FARMING is Crop.newDay: a crop advances a day ONLY if the soil was watered at the
  rollover. Forgetting is NOT damage, the day just does not count. Wrong season
  outdoors is the only hard kill. Speed-Gro removes a % of TOTAL days at planting;
  retaining soil buys a CHANCE to skip the chore. Everything resolves at SLEEP.
  MARRIAGE is one integer: 250 a heart, talk +20 once a day, gifts RATIONED to 1 a day
  and 2 a week (birthday bypasses both AND pays x8), neglect -2 stranger / -8 dating /
  -20 spouse, and a HARD CAP at 8 hearts for anyone you have not dated
  (Utility.cs:2901 returns 8 for a datable NPC, so the clamp is 2249) — gifting cannot
  pass it, you have to accept the bouquet. Dating moves the ceiling to 10, marriage to
  14. THE MECHANIC GETS MORE EXPENSIVE AFTER YOU WIN IT.
Teardown, every number with its file:line:
records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_TEARDOWN_7_26_26.txt
Patterns + what Bohemia should actually take (10 named patterns, 7 recommendations,
4 do-not-ports): records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_PATTERN_NOTE_7_26_26.md
The two that matter most for us, and neither is about farming: RATION DO NOT PRICE
(limit a favour/post/bribe by COUNT per week, not by money, or a rich player switches
it off) and THE CEILING THAT ONLY MOVES ON A COMMITMENT (faction standing should have
a wall you cannot grind through — you get past it by taking a side, not by doing more
jobs).
TWO REAL PORTING BUGS FOUND BY MEASURING ON THE REAL SURFACE, both now gated: (1) the
else that re-rolls a resting fish's target must also run when the target is -1, or the
fish keeps its last velocity, parks on the floor and every fish above difficulty 30
becomes uncatchable (pike 0/12 -> 12/12 after the fix); (2) copying the master's -32
sprite-origin offset into a page with no sprites made the DRAWN bar and the TESTED bar
32 units apart, so the picture lied about whether you were winning. Measured catch
rates now: carp 12/12, pike 12/12, catfish 10/12, octopus 0/12 at level 0 and 4/12 at
level 10 — the skill tree, measured.
Gate: gates/lab_gate.js, 112 checks, registered as REFERENCE LAB. It PLAYS all three
loops (lands a fish by working the bar, grows a parsnip to harvest, walks a villager
from stranger to married) and holds all six clauses of the amended law.
LAB-01 (the walk) is SUPERSEDED, not deleted: its pattern note now opens with the
ruling, its gate row is marked superseded and exempted from the three-mechanic rule so
nobody reads it as a template, and its checks stay green so it cannot rot.
NEXT IN THIS LANE: Paolo names a game and a set of mechanics. Backlog LAB-2 (Zomboid
loot loop) is still queued and now means containers + weight + search + degradation,
not one of them.
FLEET CONDITION, FLAGGED NOT FIXED (coordinator's file, not mine): this handoff is over
1,100 lines against a ~500-line DIET LAW cap. Trimming it means rewriting eight other
lanes' entries in a file they are all appending to right now, which is the boundary the
parallel-sessions rule says to stop at. Raising it here instead of crossing it.

LAB (09): 7/26 — THE LANE'S FIRST EMULATION IS PLAYABLE: STARDEW'S TOWN WALK, REBUILT
FROM THE MASTER'S OWN SOURCE. Backlog LAB-1, all three deliverables, nothing ported.
Page: slices/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_7_26_26.html (standalone, labeled
REFERENCE, placeholder art, touches no engine module / no bank / no alpha, and the
gate sweeps BOTH directions so nothing shipped links back to it either).
HOW THE NUMBERS WERE GOT, because this is the part that makes the lane worth having:
the decompiled 1.5.6 source was read directly, not remembered. 37 constants, every one
carrying the file:line it came off, in
records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_FEEL_LEDGER_7_26_26.txt. The five that matter:
  - walk 2 / run 5, times movementMultiplier 0.066, times elapsed ms. At 60fps that is
    2.20 and 5.50 px per tick = 2.06 and 5.16 TILES PER SECOND. And options.autoRun
    defaults ON, so the RUN BUTTON WALKS YOU: fast is the default gait.
  - ZERO ACCELERATION anywhere. Frame one is full speed. Measured, not assumed.
  - the collision box is 48x32 AT THE FEET (3/4 tile wide, half a tile tall), not the
    sprite. That is why a tiny town feels roomy.
  - THE CASCADE, which is what "soft collision" actually is: full step, else HALF step,
    else — if only one direction is held — split the leading box into quarters, and if
    exactly one quarter is blocked, SLIDE SIDEWAYS at speed*ms/64. That third rule is
    why nobody has ever snagged a door frame in Stardew.
  - diagonals are 0.7 per axis (flat 0.7, not 1/sqrt2), so the diagonal is not a shortcut.
Also emulated and measured: doors fire off the NEXT-position box (you walk into them,
you never press anything), the 0.02/tick fade is 50 ticks each way and the CLOCK IS
PAUSED for it (a doorway is free), 7000ms = 10 game minutes so a day is 14 real minutes,
the dusk curve steps to 0.30 at 6pm and 0.75 at 8pm and caps at 0.93 (never black), and
night is PURE YELLOW SUBTRACTED — which is the entire reason Stardew nights read blue,
nobody painted a night palette. One scheduled NPC: time key, A*, axis-by-axis at a RAW
2px/tick (villagers never got the player's ms-scaling, so you always out-pace the town),
then a 6-12s idle with a 600ms breath.
THE PAGE HAS A/B CHIPS ON PURPOSE: HALF-STEP, CORNER SLIP, DIAG 0.7 and a deliberately
non-Stardew ACCEL 250ms, plus TRUE 4x ZOOM. Turning one off is how you feel what it was
doing for you. That is the lane's whole thesis and it is now a thing you can hold.
WHAT IT SAYS ABOUT US, measured against the shipped run: our overworld walk teleports a
WHOLE TILE every 110ms (9.1 tiles/s, faster than Stardew's run) with a 220ms hitch
before hold-repeat, no diagonals, and it collides with the whole cell. Big discrete
jumps at a high rate with a hitch is most of why the overworld reads stiff — that is not
an art problem. 9 port candidates are ranked in
records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_PATTERN_NOTE_7_26_26.md, cheapest first
(interpolate the cell across the beat; kill the hitch; a feet box; the half-step + slip;
diagonals; doors as collision; a free clock; night as a subtracted channel; schedule not
AI) and 4 do-not-ports are named (interiors bigger than their buildings, 20 tiles of
screen, the frame-rate-dependent NPC speed, any of the art).
[PENDING Paolo], the one real fork and it is canon: 120 BPM / I-MOVE-YOU-MOVE and
OCCUPANCY (one body per cell) cannot coexist with a continuous sub-pixel walk in one
surface. Three options are written out in the note — (1) keep the beat and interpolate
the picture across it, (2) two modes with a snap into turn-based for fights, (3) free
walking everywhere, which retires I-MOVE-YOU-MOVE for the overworld. Option 1 breaks no
law and is by far the cheapest; the lane did NOT pick.
Gate: gates/lab_gate.js, 83 checks, registered in the suite as REFERENCE LAB. It holds
all four clauses of the lab law, and the movement half MEASURES through window.LAB — the
same frame loop the thumb drives, never a second copy of the maths (mutation-checked:
forcing DIAG_FACTOR to 1.0 moves the measurement from 92.4 to 132.0).
NOTE FOR THE FLEET: this lane deliberately did NOT touch the alpha, and that includes
the build stamp — the alpha did not change this turn, so stamping it would have been a
lie. A lab ship is reached by its own reference link, never as "the build".
NOTE, READ THE 7/26 (b) ENTRY ABOVE FIRST: this walk study was REJECTED by Paolo and
the lane's assignment changed. Kept as the record of what was measured, never as a
template.

WORLD MODEL (02): 7/26 (h) — THE AIRFIELDS. 94 cells (40 airport, 54 airbase), the last
big flat thing. engine/bohemia_airfield.js builds both from one generator because a
commercial field and a military one are the same anatomy with different buildings on it.
THE HARD PART, and why it needed a new rung in the world model: a runway is 3 km long and
a cell is 96 m, so a field is a BLOB of cells with ONE runway across all of them, and a
per-cell generator physically cannot draw that. bohemia_world.js now computes
clusterBoundsOf (the connected same-type blob, cached) and hands every cell of a field
the same bounds; the runway is laid in valley coordinates against them, so it arrives in
the next cell exactly where it left the last. Seams measure 1.00. The anatomy is a
FRACTION of the field, not fixed offsets — the first version left half the airbase as
bare dirt and the gate caught it — so a big field gets two parallel runways and a small
one becomes a general-aviation strip out of the same code. Act-1 dead: the aircraft never
left, they are on the stands with the doors open. Gate: AIRFIELD (20 checks, including
constitution conformance). VALLEY: 94.6% -> 95.6% generated.
HONEST NOTE: the field reads as clean bands from above. It is correct and continuous but
it wants dressing (drifted sand, cracked pavement, blast staining) before anyone would
call it finished. Written into the backlog rather than quietly left.

WORLD MODEL (02): 7/26 (g) — THE VALLEY IS WALKABLE ON A PHONE. Found while wiring
streaming: the plot cache was a plain object that only ever grew. A plot is ~190 KB, so
walking the valley climbed toward ~1.8 GB and the phone would have died long before the
far side — the exact clause the mobile render contract flags and nothing was checking.
FIXED: the cache is a bounded LRU (64 cells, ~12 MB) and eviction is free because the
world is deterministic (an evicted cell regenerates byte-identical, asserted). NEW:
w.stream(gx,gy,{radius}) warms the ring around a position and no-ops when the hot set
has not moved, and the walk surface streams BEFORE it steps, so the cell you walk into
was built while you were still in the last one. MEASURED on the real walk: 162 steps,
median 0.004 ms, and the two steps that actually cross a boundary cost 0.03 and 0.01 ms.
HONEST RESIDUAL, written into the gate header not hidden: the first touch of a fresh
cell still costs ~30-40 ms, once per cell entered, off the crossing. Getting that off
the critical path is a SURFACE job (idle callback or worker in the run/city frame loop),
not a world-model one. Gate: STREAMING (15 checks).

WORLD MODEL (02): 7/26 (f) — THE GROUND NOW OBEYS THE CONSTITUTION. The freeze lifted
when Paolo ruled the target CBB, which made the promise this lane wrote during it come
due: the five surfaces (arterial, freeway, desert, mountain, water) shipped flagged
PROVISIONAL SKIN, and they are provisional no longer. Every palette entry was measured
against records/target/BOHEMIA_VISUAL_CONSTITUTION.json and 5 of 64 were outside their
layer's value band: road paint, crosswalks, stop bars and the lake's mineral ring, all
too bright. Toned into band, which is also more true (act-1 paint is filthy, not clean
white). A CONSTITUTION CONFORMANCE section now lives in both roadcell_gate (41 checks)
and terrain_gate (62 checks), reading the constitution at run time, so this can never
drift back. The PROVISIONAL SKIN flags are replaced with the conformance record in all
five modules and their dossiers. STILL [PENDING Paolo]: act-2 and act-3 materials for
these families (the ACT TRIPTYCH rule) — that is content, not mine to invent.

=== BOHEMIA HANDOFF (DIETED 7/26/26 — the pointer, never the pile) ===
FILENAME LAW: this file is always named 00_START_HERE_NEXT_SESSION.md, lives at
repo root, sorts first, and is REWRITTEN at the end of every working session.
There is only ever ONE.

DIET LAW (coordinator, Paolo-ordered 7/25): this file stays UNDER ~500 LINES.
Sessions append their entry at the TOP of the LANE STATUS section and TRIM the
oldest entries into laws/BOHEMIA_STATE_OF_PLAY (append, dated) when the cap
nears. The full pre-diet pile (4,387 lines, every entry 7/17-7/25) is preserved
verbatim at archive/BOHEMIA_HANDOFF_PILE_THRU_7_25_26.md and in git history.
Nothing was deleted; it was relocated.

READ ORDER: CLAUDE.md -> this file -> laws/BOHEMIA_COORDINATOR_ARCHITECTURE_MAP.md
(the whole machine: engine spine, the B64 embed/resync chains, gates, lanes) ->
BOHEMIA_CANON_INDEX.md -> your own lane's brief in laws/.

=============================================================================
## HOT LOCKED RULINGS (newest first — read before building anything)
=============================================================================
- LANE COLLISION, 7/26, RECORDED NOT SMOOTHED OVER: the ART lane and the RUN
  lane independently built the same thing in the same hour - the run drawing its
  block from the frozen tileset. RUN landed first (a098a5a) and theirs is
  better. ART THREW ITS VERSION AWAY rather than force-merging two renderers.
  What ART kept was the one thing RUN missed and it was the big one: every tile
  was being drawn at CELL-1, so the page background showed through two edges of
  every cell - THAT is the black grid in every screenshot of this game, all day.
  Not an outline anybody drew; a gap nobody closed. Now S=CELL and gated both
  ways. Record: records/BOHEMIA_ART_LANE_COLLISION_7_26_26.md. THE PROCESS HOLE:
  checking main before you start does not help when the other lane lands
  mid-turn. Logged as discovered work, not designed here.
- THE TARGET SCREEN IS VERDICTED **CBB** (Paolo 7/26: "Could be better"). Per
  the verdict pipeline that is SHIPS + FROZEN + NEVER SPAWNS VARIANTS.
  ** DO NOT MAKE ANOTHER TARGET SCREEN. ** The tile-reassembled frame
  (records/target/REASSEMBLED.png) and the 42-tile starter set are BYTE-LOCKED
  in records/target/BOHEMIA_VISUAL_CONSTITUTION.json; changing either needs a
  NEW RULING from Paolo, not a new render, and gates/target_match_gate.py fails
  the build on the md5. All further look work happens in the ACT-1 TILESET
  against this target.
  ** BOTH FREEZES ARE LIFTED. ** (1) New visual cooking is open again in every
  lane - the price is that every cook passes the PROXY GATES (palette ceiling,
  per-layer value bands, no keyline, no dither, one light direction, hashable
  edge-seam contracts) and every new art bank REGISTERS itself in
  target_match_gate.py's BANKS list. (2) QUEST ASKS ARE UNFROZEN - law 4 said
  "until the visual bar is set" and it is set; the two parked LIFE-hub quest
  cards are live again. The freeze check in target_screen_gate.py now flips off
  the constitution's own status, so the law and the gate move together instead
  of needing someone to remember.
  WHAT A MACHINE WILL NEVER JUDGE: whether art LOOKS right. Amendment B is
  explicit - the gestalt is always a human side-by-side verdict, Paolo's, and a
  literal image-diff gate is banned as gameable and false.
  Verdict record: records/BOHEMIA_TARGET_SCREEN_VERDICT_7_26_26.txt
- NAME IT OR DON'T DRAW IT (Paolo 7/26, LOCKED, new law):
  laws/BOHEMIA_ADDENDUM_NAME_IT_OR_DONT_DRAW_IT_7_26_26.md. "every time you make
  something you have to be able to describe what it is. It's so upsetting to me
  just hallucinate bullshit." Nothing goes on screen without a NAME, a plain
  sentence, and a SOURCE, and the naming is a REQUIRED PARAMETER of the drawing
  call - the build dies if the drawn count ever exceeds the named count. Two
  objects may not stand on the same ground (build failure, not a review note).
  Every door has a path to it and is a real opening, never a picture of a door.
  A crossing spans kerb to kerb with its bars across traffic. INVENTED
  DECORATION IS DELETED ON SIGHT (a fake chain-link, a fake power line and a
  nameless band all died the day this landed). And the standing answer to "your
  stuff looks worse than my approved stuff" is DRAW LESS.
- NO RADIATION IN BOHEMIA (Paolo 7/26, LOCKED, LORE not art): "there's no
  radiation problems in Bohemia". Post-ECONOMIC apocalypse - no meltdown, no
  fallout. Radiation trefoils, hazmat chevrons and biohazard marks are BANNED
  from every surface, including on assets that are otherwise approved art. The
  banned faces are registered by bank+index and using one kills the build.
- THE TARGET SCREEN IS RULED (Paolo 7/26): "Front base is the only one I'm
  concerned with and even then it looks like hallucinated AI slop. We made a
  rule that all cars are 2 x 3 tiles. Yeah the roofs are all fucked up not put
  on correctly yeah." THE FRONT FACE IS THE DIRECTION. The iso block and the
  cutaway are GRAVEYARDED and their renderers are DELETED - do not re-pitch iso
  for the WALKABLE level (the city-builder district view stays iso, different
  surface). CARS ARE 2x3 TILES, read from engine/bohemia_prop_scale.js at draw
  time by any tool that draws one. NO SHEAR EVER: a roof sits square over its
  own footprint; v1 slid it a tile and a half sideways off the walls. Both are
  gated. The LOOK itself is still unapproved - rev 2 is waiting on one tap.
  Post-mortem + full reasoning: records/BOHEMIA_TARGET_SCREEN_RULING_7_26_26.md.
- TARGET SCREENS ARE UP AND EVERYTHING WAITS ON THE PICK (7/26, ART lane).
  Three candidate target screens are live in alpha -> LIFE -> **PICK THE TARGET
  SCREEN** (first card), each SIDE BY SIDE with a real screenshot of the shipped
  run. A = the grid we have, standing up. B = true 2:1 iso (the city-builder look
  at street level). C = B with the house you are in cut open. Until Paolo picks,
  the art-first reset's freeze on new visual cooking outside the ART lane STAYS
  ON, and QUEST ASKS STAY FROZEN (law 4 is now machine-enforced: the LIFE hub's
  two quest cards are marked PARKED and target_screen_gate fails if either goes
  back to asking). Record: records/BOHEMIA_TARGET_SCREENS_7_26_26.md.
- WORLD BEFORE QUESTS (Paolo 7/26, LOCKED): laws/BOHEMIA_ADDENDUM_WORLD_BEFORE_
  QUESTS_7_26_26.md. "We are not ready to worry about quest right now we need to
  actually build a fucking world." The WORLD lane does NOT touch quests: not
  placement, not casting, not the bridge. Its quest items are PARKED in the
  backlog until Paolo reopens them. Build ground. (QUESTS lane still writes
  quests; that is its charter. What died is WORLD spending turns on quest
  plumbing.)
- SURFACE CELL LAW (7/26, machine-gated): a road is REAL GROUND but NOT a district.
  It registers in the world model's SURFACEGEN, never DISTGEN, so no faction,
  economy district or quest address can ever resolve to a street, and the loop's
  district count is unchanged by adding one. Gate: ROAD CELLS.
- APPROVED-ASSETS-FIRST (Paolo 7/26, LOCKED, hardens REUSE-FIRST):
  laws/BOHEMIA_ADDENDUM_APPROVED_ASSETS_FIRST_7_26_26.md. "If they're gonna
  create any sort of thing they have to be heavily inspired by the assets that
  I approved of or try to actually use them." THE APPROVED CORPUS IS THE SOURCE.
  Two traps this already caught in the CITY lane the same day: (a) painting flat
  hex fills counts as cooking pixels, and the reuse gate could not see it because
  it only swept *_factory/*_cook - it now sweeps anything that DRAWS; (b) "use
  the assets" does NOT mean the raw TP_TILES cut corpus embedded in the CITY app.
  That is the PRE-VERDICT judging surface (the TILES button) and sampling it put
  purple + neon + live grass in a dead house. Build from what he JUDGED: the
  all-30-UP house skins, the harmonized street pools, the Great Sweep's 1,927 UPs.
- QUEST STUDY LAW (Paolo 7/26, LOCKED, in CLAUDE.md): the 240-file questbook
  (3,672 citable findings from 152 dissected quests) was being ignored in favor
  of summary bullets. Now every canon .bq CITES the corpus laws it is built on,
  machine-verified verbatim by QUEST STUDY gate against
  records/BOHEMIA_QUESTBOOK_LAW_INDEX.json. Query the index before writing a
  quest; never write from memory of the vibe.
  laws/BOHEMIA_ADDENDUM_QUEST_STUDY_LAW_7_26_26.md.
- ONE VALLEY (7/26, WORLD lane, machine-locked): the MAP tab renders the SAME
  valley the phone runs. It sat on seed 1337 for months while the game boots the
  text seed 'bohemia'; the map Paolo explored was never the map his quests were
  cast into. Pinned to the engine's own hashSeed('bohemia') in
  tools/bohemia_map_tab.py, asserted in gates/map_tab_gate.js. Never hand-type a
  seed number into a surface again.
- SHADOWS ARE A SEPARATE LAYER (Paolo 7/26, LOCKED -- the law is
  laws/BOHEMIA_ADDENDUM_SHADOWS_ARE_SEPARATE_7_26_26.md, written by another
  session the same hour; CHARACTER found the mechanism under it:
  records/BOHEMIA_BAKED_LIGHT_MECHANISM_7_26_26.txt). The clothing factory bakes
  lighting into the cloth: bshade() picks lit/mid/shadow from the REST
  silhouette AT COOK TIME and freezes it, and every garment ramp is literally
  {dk,mid,lt} -- three lighting steps, no material. 7 of the 9 shipped garments
  carry it. So a sleeve's lit edge rotates WITH the sleeve and the shadow that
  meant "underside" ends up on top. The body never had this bug: its shading is
  computed per frame from the deformed grid -- that asymmetry IS the bug.
  GATED this turn (the law's point 5, assigned to CHARACTER):
  gates/shading_separation_gate.js is a RATCHET -- baked light may go down,
  never up, and the grandfathered bank stays per the law's point 4.
  NEXT BUILD, fully specified in the record: move bshade to render time on the
  DEFORMED silhouette, cook emits form+material only. Complication named, not
  papered over: patc() entangles PATTERN with shade, so pattern needs its own
  channel first or the relight eats the plaid.
- THE RIG IS LAW (Paolo 7/26, LOCKED --
  laws/BOHEMIA_ADDENDUM_RIG_IS_LAW_7_26_26.md). The rig tool's painted body IS
  the character, everywhere, for animation and customization both. The alpha had
  DRIFTED to a second body (20 painted parts, 65 pixels, different pose -- the
  neck smaller in all 8 directions), so every character verdict he ever gave was
  taken against art he never painted, and the dead woman-rig arc was derived
  from the wrong body too. FIXED: the rig's body copied in verbatim. GATED:
  gates/rig_is_law_gate.js -- byte-identical forever, exactly one body in the
  alpha, no body inside any other embedded surface. The hole that allowed it:
  ENGINE SYNC only covers BOH_* modules and BAKED is not one. Anything derived
  from the body must now name which body it read.
- (superseded, kept for the trail) THE GAME WAS NOT DRAWING THE RIG-TOOL BODY:
  records/BOHEMIA_RIG_NOT_REFERENCED_7_26_26.txt). The alpha holds TWO painted
  bodies -- BAKED, and the BAKED inside RIG_B64 that the RIG tab draws -- and
  they differ in 20 painted parts, 65 pixels, plus the pose. The neck is smaller
  in the game in ALL EIGHT directions. He has been judging animation against a
  body he did not paint. NOTHING WAS OVERWRITTEN: which copy is canon is his
  call (RIG LAW). The moment he says, sync both and add the gate -- BAKED was
  never covered by ENGINE SYNC because it is not a BOH_* module, and that hole
  is how two bodies lived in one file. Check: tools/bohemia_rig_sync_audit.js
- HIS AUTHORED LAYERING IS THE LAW AGAIN (Paolo 7/26, fixed:
  records/BOHEMIA_AUTHORED_LAYERING_7_26_26.txt). handOrder() was recomputing
  the draw order EVERY FRAME on the six non-N/S facings and flipping it 100-164
  times per facing across ~48 clips -- an arm jumping behind/in front of the
  torso between frames, which on E/W repaints a band of torso. That was the
  "tweak out". Both deadband GUESSES retired; the two rules a clip DECLARES
  (gun-unit, _handsBack) survive. E went 150 flips -> 2. Never add another
  per-frame depth guess on top of his layerOverride.
- EAST IS A PLANK, AND IT IS ART NOT CODE (Paolo 7/26, measured:
  records/BOHEMIA_EAST_PROFILE_FINDING_7_26_26.txt). Painted torso is 8px wide
  on East vs 13px on South; both arms live inside that footprint. No renderer
  change fixes it. STEP ZERO of the animation redo is repainting the profile
  body with real depth -- Paolo's hand or his explicit go-ahead for candidates
  (RIG LAW: never reshape his regions). Do not polish East before that.
- DO NOT LEAD WITH METRICS HE CANNOT SEE (7/26, learned the hard way): the weld
  fix removed 61% of invented pixels and changed the picture by 4 pixels a
  frame. He said "literally no difference" and he was right. Measure the
  EXPERIENCE (pixel diff at 1x on the dressed body), not just the defect count.
- THE ANIMATIONS ARE REJECTED, ALL OF THEM (Paolo 7/26, LOCKED --
  laws/BOHEMIA_ADDENDUM_ANIMATION_REJECTED_7_26_26.md). No clip carries an
  approval any more. The rig RESAMPLES limb pixels every frame, which on pixel
  art IS morphing, and four passes then invented pixels to hide the damage.
  MEASURED: 72.8% of frames had pixels nobody painted, 34,636 of them, 84% in
  the arms -- and the ONLY clean parts were the head and face, the two the HEAD
  RIGID STAMP LAW protects. That is the diagnosis in one line.
  SHIPPED 7/26: the JOINT WELD and the MIN HAND SLIVER are dead -> 61% of the
  invented pixels gone (34,636 -> 13,444), silhouette unchanged, A/B chip in the
  character box. NOT A FULL FIX and the record says so. RIG FIRST, CLIPS SECOND:
  redoing 60 clips on a resampling renderer just makes 60 morphing clips.
  NEXT: a quantised angle atlas (or painted frames) so limbs stop being
  resampled at all. Two zero-invention shortcuts were built, measured at exactly
  0, and REJECTED on the render for shredding the silhouette -- do not re-pitch
  ONE-SOURCE-ONE-PIXEL or PIXEL CONSERVATION.
- CHARACTER BOX = SHUFFLE ANIM (Paolo 7/26, his ask): the preview plays any
  clip, skeleton off, with the body sliders right underneath. Bodies get judged
  THROUGH THE ANIMATIONS now, never off an idle pose.
- SHADE MAP BEFORE SHIPPING A BODY CHANGE (7/26, learned the hard way twice):
  strays/holes/part-loss/frame-edge sweeps were all green while Paolo watched
  the arms turn into stripes. Dump WHICH PIXEL IS OUTLINE vs SKIN -- that is
  what a person actually sees. THE CHOPPED CHECKS in bodyvar_gate.js lock it.
- THE ONE RIG NOW HAS SLIDERS (shipped 7/26, CHARACTER lane). The female rig is
  GRAVEYARDED and gone from the code; a body is Paolo's painted rig + HEIGHT /
  BELLY / ARMS. Neutral is byte-identical canon. Nobody re-pitches a second
  authored body. Record: records/BOHEMIA_BODYVAR_SLIDERS_7_26_26.txt.
- NO PULL REQUESTS, EVER + ONE GATE PASS PER SHIP (Paolo 7/25, LOCKED, in
  CLAUDE.md ship flow). Push main directly, run the full suite once per ship.
  (Also: the stale PR badges #10-#20 on the reused character/sound branch name
  are 7/17-7/18 relics — ignore them, never click them.)
- THE FEMALE RIG IS DEAD — ONE RIG + VARIATION SLIDERS (Paolo 7/25, LOCKED):
  laws/BOHEMIA_ADDENDUM_ONE_RIG_VARIATIONS_7_25_26.md. Read it before touching
  bodies. The woman-rig v1-v4 arc is superseded by this ruling.
- V-NECK TEES GRAVEYARDED (Paolo verdict 7/25, screenshot: "delete these
  terrible"). Graveyard is final.
- HERO BEAT: beat 1 is canon for EVERY song (7/24 ruling). The ||1 default is
  intentional; never "fix" it.
- TERRITORY-AI PACING (7/24, LOCKED): advanceRound stays RARE and QUEST-GATED,
  never a tick/heartbeat. Written into engine/bohemia_loop.js.
- TLDR LAW for the coordinator (7/25): every coordinator reply to Paolo ends
  with a plain-English TLDR; assume zero coding knowledge.

=============================================================================
## LANE STATUS (as of the 7/26 diet — details in the archived pile + git log)
=============================================================================
CHARACTER (04) 7/26 NEWEST — THE ARMS NOW HOLD THEIR POSE, AND IT IS THE FIRST
THING THAT ACTUALLY REDUCED THE MORPHING. Composited tone flips on naked E+W:
6,481 -> 3,314, **49% removed**; the parts-trading-pixels half 3,810 -> 1,484
(61%). Thirteen attempts got here, twelve of them negative and all recorded.

THE CHAIN OF FINDINGS, in the order they landed today:
 1. RENDER LIKE THE RIG — the alpha had three passes his rig never had (joint
    weld, EVERY PIXEL LANDS forward-splat, FAR-ARM DARKENING). All retired.
    Invented pixels 33,400 -> 18,284 (45%). Picture UNMOVED.
 2. PARTS ARE PAINTED (his ruling) — the body's tone was recomputed every frame
    from the COMBINED deformed grid, so the torso wore the arm's shadow. Fixed
    three ways; ALL THREE MEASURED WORSE (7,524 / 6,735 / 7,238 vs 6,266).
    Nothing shipped. The failures proved the shading was only 42% of it.
 3. OWN CANVAS (his ruling: "so the arm and the torso don't share pixels") —
    skin() sampled every part into one shared screen with a claim buffer, so the
    TORSO'S OWN SHAPE depended on where the arm stood. Now each part is sampled
    alone and composited after. Picture unmoved (6,537 -> 6,481) BUT it made each
    part measurable alone, which found the real defect:
        torso 0.38  thigh-L 0.31  thigh-R 0.29  arm-L 1.02  arm-R 1.98
    own-shape flicker per frame at the SAME pixel area. Torso and legs hold
    still; the arms do not. In profile an arm is a ~3px strip and a 3px strip
    cannot be inverse-sampled through continuous rotation without churning.
 4. THE ARMS HOLD THEIR POSE — the fix. Five earlier angle-snap attempts all
    measured WORSE because bucketing with NO MEMORY oscillates at bucket edges
    and each oscillation is a whole-shape change. With HYSTERESIS (resolve the
    buckets across the whole clip, stay put unless the angle moves >2 buckets)
    it cannot oscillate: 2.96 -> 0.88 arm flicker (70%), ~4.6 distinct arm poses
    per 24-frame clip instead of 9.9. That is how pixel art animation is made
    and it is the 120 BPM LAW applied to the arms.
  laws  BOHEMIA_ADDENDUM_RENDER_LIKE_THE_RIG_7_26_26.md
        BOHEMIA_ADDENDUM_PARTS_ARE_PAINTED_7_26_26.md   (all 3 failures kept)
        BOHEMIA_ADDENDUM_OWN_CANVAS_7_26_26.md
        BOHEMIA_ADDENDUM_ARMS_HOLD_THEIR_POSE_7_26_26.md
  gates render_like_the_rig(23) parts_are_painted(18) own_canvas(17) arm_hold(21)
        Each one also PINS the negative results — a deleted failure gets rebuilt.
  tools bohemia_render_like_the_rig_patch.py, bohemia_parts_are_painted_patch.py,
        bohemia_own_canvas_patch.py, bohemia_arm_hold_patch.py (all idempotent),
        bohemia_profile_morph_audit.js (the whole evidence chain, re-runnable)

NEXT IN THIS LANE, in this order and for a measured reason:
 1. RE-TRY THE PER-PART SHADING FIX. It failed three times because it was a
    correct rule applied to a churning boundary. The boundary holds still now,
    and 55% of the remaining 3,314 flips are a cell owned by the SAME limb all
    three frames — that is shading, not ownership. Worth exactly one more
    measured attempt; if it is worse again, stop and say so.
 2. THE HANDS, not yet measured under the hold. They ride the arm chain and may
    already be fixed by it.
 3. [PENDING Paolo] THE PROFILE REPAINT. Holding the pose manages the symptom; it
    does not widen a 3px arm. His hand or his go-ahead on candidates.
 4. [PENDING Paolo] Whether the far-arm depth read comes back as a real separate
    light layer (it was retired with FAR-ARM DARKENING).
DO NOT: ship another animation look-change unasked, or lead a reply with a green
gate. He rejected three rounds today before any of this worked.

CHARACTER (04) 7/26 EARLIER — I FOUND THE E/W MORPHING AND IT IS NOT WHERE
ANYONE HAS BEEN LOOKING. Paolo, third rejection: "The east and west animations
are still dog shit when it comes to morph pixels underneath the arms and the
back leg in the back arm. All the pieces are made how they should be made
bullshit look at the rig." So I decoded RIG_B64 and diffed his rig's draw loop
against the alpha's skinner. THREE render passes the alpha invented and his rig
never had: JOINT WELD (retired earlier today), EVERY PIXEL LANDS (a forward
splat into "the nearest free cell" — in profile, wherever the arm/torso overlap
left a gap that frame), and FAR-ARM DARKENING (repaint the far arm at 62%, set
on E and W ONLY, mask read off the deformed grid per frame). Both survivors are
now retired behind SKINNER_API.RIGFAITH.on, so the A/B is re-runnable.
Measured, 102 clips x 8 facings x 24 phases: invented pixels 33,400 -> 18,284
(45%), E+W 7,879 -> 3,356 (57%), arm-L on E+W 2,984 -> 1,118.

AND IT DID NOT FIX WHAT HE IS WATCHING. On the COMPOSITED frame the strobe (a
cell that changes and changes straight back across three frames) went 4.65 ->
4.74 per frame. Nothing. Recorded that way on purpose. Then I found it: NAKED
is worse than dressed (5.39 vs 4.74), so it is the BODY not the clothing; it
concentrates on rows 22-25 and 31, the arm-over-torso band; and every strobing
tone pair is a pair of SKIN RAMP tones, 88% of them one pair — base skin <->
the dark anatomy line. THE BODY IS NOT DRAWN FROM PAINTED PIXELS AT ALL.
buildFrame recomputes its tone every frame off the DEFORMED grid: a dark
ANATOMY LINE where an orthogonal neighbour is empty or a different limb GROUP,
plus a SKY TOP-LIGHT where the two cells above are empty. In profile the arm
sits inside an 8px torso, so a one-pixel swing reclassifies whole runs between
skin and line, and back the next frame. That is his own SHADOWS ARE SEPARATE
ruling being broken by the BODY, not just the garments it was written about.

RULED OUT, both measured, both null: pose quantization (joints snapped to 1/2px
and 1px — no effect) and the rigid limb stamp (exact rest bone length + angle
snapped to 48/32/24/16/12/8 steps — only 4.76 -> 3.32 even at 45deg steps,
which would wreck the poses).

CANDIDATE FIX, MEASURED, DELIBERATELY NOT SHIPPED: bind the anatomy line to the
REST pixel and carry it through the same inverse sample the art rides, so the
line travels WITH the limb. 4.36 -> 2.02 line flips per frame (54%). Halves the
dominant defect, does NOT cure it. NOT shipped because STOP PRODUCING applies —
this is the fourth renderer attempt against the same complaint and he has
rejected three. It needs his go, not a green number.
  law    : laws/BOHEMIA_ADDENDUM_RENDER_LIKE_THE_RIG_7_26_26.md
  gate   : gates/render_like_the_rig_gate.js (23 checks; ratchets the audit AND
           locks the honest text so nobody keeps the 57% and deletes the "it did
           not move")
  tools  : tools/bohemia_render_like_the_rig_patch.py (idempotent),
           tools/bohemia_profile_morph_audit.js (the whole evidence chain)
  record : records/BOHEMIA_PROFILE_MORPH_AUDIT_7_26_26.txt
NEXT SESSION IN THIS LANE: do not ship another animation look-change unasked.
The two things that need Paolo: (1) go/no-go on the rest-bound anatomy line,
(2) the profile repaint — E/W body is 8px of torso with both arms inside it,
still [PENDING Paolo] for his hand or his go-ahead on candidates.

CITY (03) 7/26 LATEST — THE INTERIOR WAS KILLED, AND THE SWEEP IS FINALLY
USABLE. Paolo on the first interiors: "Dogshit." KILL recorded
(INTERIOR_SHELL_v1_7_26_26 in the graveyard, post-mortem in
records/BOHEMIA_INTERIOR_KILL_AND_THE_SWEEP_CROSSING_7_26_26.md). The diagnosis
is EMPTY ROOMS: the shell is lawful approved art but it is five textures and no
furniture, so a room is a box with a wall texture. The mechanism (walk into a
wall, plate === footprint, walk out the door) was never the problem and stays.
FIXED THIS TURN, both compliance not art (which is what the freeze allows):
(1) THE DOOR LAW - interior doors were a flat 1x1 gold stamp, the exact failure
that law names. They now draw the APPROVED 7/13 animated door bank verbatim,
88x176, ONE WIDE TWO TALL, standing on their cell and rising into the one above,
in their own pass after the walls. Same bank + same 88x176 assertion the RUN
lane already makes.
(2) THE MOBILE RENDER CONTRACT - the interior camera used a fractional cell
size; non-integer scale is BANNED. Integer cell, rounded origin.
interiors_gate 22 -> 40 checks.
THE BIG ONE, AND IT IS PARKED ON PURPOSE: tools/bohemia_interior_pool_factory.py
crosses Paolo's Great Sweep (2,604 judged, 1,927 UP) to the actual HD masters by
(pack, idx) - ALL 87 SWEPT PACKS RESOLVE, ZERO UNRESOLVED. First time his
verdicts are machine-usable. Emits banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt:
UP-ONLY, 465 tiles bucketed by room function (floors/walls/doors/windows/
furniture/tools/container/clutter/debris/light/plant/dirtfloor), each with its
draw scale from the sweep's own BIG/SMALL flags. Bodies + gore excluded (UP, but
a story he places). NOT WIRED INTO THE GAME: the ART-FIRST RESET freezes new
looks outside the ART lane and TILESETS-ARE-SETS says a look is judged as one
assembled scene. It is filed as the day-one ingredient for ART item 2, the
master act-1 tileset. The moment the target screen is picked, the furniture is
sitting there.
RUN (01) 7/26 LATEST — DOORS + MUSIC. Paolo: "doors are always two tiles tall,

RUN (01) 7/26 LATEST — THE BLOCK NOW LOOKS LIKE THE TARGET. Paolo's CBB verdict
froze the target screen and lifted the freeze, so the run stopped drawing coloured
squares: the whole block is laid from the FROZEN 42-tile starter set
(banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt) in the target frame's own
language — cracked asphalt with kerbs and gutters, weedy walk, tan stucco faces
with windows and boarded windows, a real hip roof (eave/slope/ridge/four hips),
garage openings that land on their OWN driveway whichever side it is. Consumed,
never re-rendered: tools/build_run_slice.js refuses to build if the bank's md5
has moved off the constitution, so the frozen thing stays frozen.
CORRECTION ON RECORD, so nobody repeats it: this lane had been telling Paolo the
biggest visual gap was going THREE-QUARTER. The target he actually picked is
TOP-DOWN. That premise was wrong and the ledger row is retired.
NEXT IN THIS LANE: interiors to the target. Outside speaks the constitution now,
inside is still flat role-tinted plates, and CITY already delivered the
ingredient and left it unwired for exactly this
(banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt, 465 swept-UP tiles by room function).

RUN (01) 7/26 — SAVE/LOAD + DEATH IS A RELOAD. Built to Paolo's two save
rulings the same day, to their own words: ONE portable versioned blob (the
engine's own save via BohemiaLoop.captureSave PLUS the run's surface state, in a
versioned envelope), all three kinds coexisting (SLEEP AND SAVE at home, SAVE NOW
anytime, quiet autosave on every threshold/talk/fight), an EXPORT SAVE CODE that
imports onto a fresh device with no server, old envelope versions MIGRATE FORWARD
and are never rejected, and NO device preference inside the blob (the music
toggle deliberately stays out — the law says prefs never travel). Losing a fight
LOADS THE CLOSEST PREVIOUS SAVE, never a reset, and the quest keeps its progress.
Menu is the ☰ in the objective bar. run_gate now 93 assertions incl. the full
round trip (save -> really move -> load -> diff), export/import on a FRESH page,
an older-version migrate, junk refused, and the death reload. Ledger 16/24.
WHERE THE SAVE LIVES: one localStorage key holding the last 6 complete blobs. If
WORLD later folds CITYSAVE in, it becomes another field of the SAME envelope —
the law's "no private side-channel" rule. The cleaner long-term home is a field
on the engine's own save schema (a version bump + migration), which is a shared-
substrate change and is flagged to WORLD rather than taken here.

RUN (01) 7/26 — DOORS + MUSIC. Paolo: "doors are always two tiles tall,
two by one... we already made a lot of doors with even animations where it opens,
you can't find that anywhere in the fucking files." He was right again: the bank
(banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt, 30 clips, 9 frames, 2 beats, queue
CLOSED 30/30) had existed since 7/13 and NOTHING consumed it, while every surface
drew a flat 1x1 still. Now law: laws/BOHEMIA_ADDENDUM_DOOR_LAW_TWO_TILES_TALL_
7_26_26.md — a door is 1 wide x 2 tall, it opens, a shut one BLOCKS you, and you
are through only at frame >= 5 (the 7/13 integration contract's own rule). The
builder refuses any frame that is not 88x176. Music too: the run asks the alpha's
own MUS/CITYMUS synth to score the walk (one AudioContext, in the parent, no
second music engine). Ledger now 14/23.
STANDING ORDER from the door law: before a surface draws a THING the game already
has, it opens banks/ first. REUSE-FIRST only ever swept COOKING tools; it never
asked whether a RENDERING surface went looking. That hole is what cost two weeks
of wrong-size frozen doors.
ART (08) 7/26 — SELF-AUDIT vs the SHADOWS-ARE-SEPARATE ruling that landed
mid-turn: the new act-triptych cook is CLEAN (no tile carries directional
light). ONE DEBT LOGGED, deliberately not fixed: the frozen act-1 tile
`wall_under_eave` bakes its eave shadow into its own pixels, which under the new
law belongs at render time - but clause 4 says approved assets are not re-cooked
wholesale and the set is byte-locked by the CBB, so it moves to the runtime
light pass THE MOMENT THAT TILE IS TOUCHED FOR ANY OTHER REASON. Also recorded:
a top-to-bottom luminance ramp CANNOT detect baked shadows (the garage tiles
trip it at -83 and are innocent - a bay is dark for being a hole), so that check
ships as a ratchet on NEW cooks only and is never pointed at anything it would
falsely accuse.

ART (08) 7/26 — ITEM 2 DELIVERED: THE ACT TRIPTYCH DERIVES. Per amendment A
(era-READY, NOT era-complete) it is proven on THREE families, one per render
layer - yard/wall/roof - and deliberately stops there; filler SHARES the
treatment and nobody paints 126 tiles.
THE FINDING WORTH CARRYING: amendment A assumes assets are structured with
overlay layers so acts derive cheaply. OURS ARE NOT - the approved corpus has
its cracks, dust and weeds painted straight into the pixels, with no clean
source underneath. So the overlay layer had to be RECOVERED from the art rather
than authored: blur the tile hard (that is the surface before thirty years
happened to it), take every pixel darker than that estimate as the decay mask,
then heal toward clean by 55% for act 2 and 90% for act 3. Weeds need their own
term because they are LIGHTER and GREENER than what they grow out of and a
darkness mask cannot see them. No per-tile hand work anywhere in the treatment.
The gate is now ACT-AWARE and the exemptions are declared, not assumed: act-1
value bands and DEAD DARK GLASS are ACT 1 rules and do not bind later acts (a
repaired wall IS brighter - that is the point); nothing else is relaxed, and
radiation + volcanic iconography stay banned in EVERY act because those are lore
not weathering. Each act must measure cleaner than the one before it, so a copy
with a new name fails the build.
HONESTLY NOT DONE, AND WHY: act 3 reads as act 1 with the dirt turned down. A
rebuilt building is REPAINTED, and what colour rebuilt Vegas is painted is CANON
- so is whether act 3 gains content (planters, signage, lit windows). Both are
[PENDING Paolo], not guessed. MECHANISM-MINE / CONTENTS-PAOLO'S.
Also retired this turn: backlog ART-3 (re-cook vehicles to iso) is DEAD work, not
done work - it only existed if candidate B or C won, and both are graveyarded.

ART (08) 7/26 — LANE ITEM 1 IS CLOSED. Target verdicted CBB. The constitution
exists and is in force, the target is frozen and byte-locked, the fleet-wide
visual freeze and the quest-ask freeze are both lifted, and the target-match
gate (215 checks) now holds every registered art bank to the six proxies
amendment B allows a machine to hold. NEXT IN THIS LANE: backlog item 2, the
MASTER ACT-1 TILESET - the 42-tile starter set is the seed of it; what remains
is the ACT TRIPTYCH (act1-dead / act2-recovering / act3-rebuilt derived from the
act-1 base, per amendment A: born era-READY, not era-complete) and indexing the
corpus onto the 64-colour ramp. Item 3 (re-cook vehicles to iso) is DEAD - iso
lost. Still PENDING Paolo: the car art measures ~2 wide x >4 long at true pixel
scale against a locked 2x3 footprint, so either the art gets re-cooked shorter
or the footprint becomes 2x5.

ART (08) 7/26 REV 4 — THE TARGET IS NO LONGER A PAINTING. Amendment C (the
ANTI-BIOSHOCK rule) was run for the first time and the mockup FAILED it: cut on
the contract's own 38px grid, the painted plate is 262 UNIQUE tiles for 264
cells. Every cell had its own random pool pick, its own flip and its own
row-by-row gradient, so nothing repeated - a world built that way needs a unique
tile per cell of the whole valley. THE MOCKUP LIED, exactly as the rule predicts.
FIX: banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt, a real bounded NAMED 38-tile
set plus 11 sprites plus cast-shadow DATA; the frame is re-laid from nothing but
those tiles and rendered on a REAL browser canvas (offscreen 1x, integer blit,
smoothing off - the render contract's pipeline rule, now proven rather than
asserted). The first reassembly looked worse and the four causes were specific,
not vague: (1) no wall corner tiles, so every building ran off the edge of the
world as one band; (2) a hip roof laid as flat stripes - a trapezoid is not a
grid of squares, so it needed four hip-corner tiles with the outside of the
diagonal TRANSPARENT; (3) no cast shadows, because a shadow cannot live in a
ground tile (unique tile per building per hour) - they now ship as DATA drawn at
RUNTIME, and this was the biggest single loss; (4) no gaps between buildings.
All four fixed; delta from the painting is 34/255 and essentially all of it is
the dirt+vignette post passes that belong to the renderer. THE TILE-REASSEMBLED
FRAME IS NOW THE TARGET (amendment C says so in as many words) and the judge page
leads with it - his one tap applies to the tiled frame, not the painting.
Gate: 1,074 checks, including a hard 96-tile ceiling so no future "target" can be
a painting again. Record: records/BOHEMIA_REASSEMBLY_TEST_7_26_26.md.

ART (08) 7/26 REV 3 — HE MARKED UP THE SHOT AND EVERY CIRCLE IS ANSWERED.
The band at the bottom he could not name was an invented "perimeter wall seen
from behind"; it is deleted, along with the invented chain-link fence and the
invented overhead wire. The frame now ends on the sidewalk you stand on. The
radioactive barrel is a plain rusted drum, and radiation/hazard iconography is
banned by LORE everywhere (registered by bank+index; using one kills the build).
The crossing spans kerb to kerb with its bars across traffic and lines up with
the walk that feeds it. The front door shares a column with its own front walk.
The garage door is a real opening with a lit header, a dark bay, a floor and the
driveway running into it. The lamps are lamp[3], the SLIM post, a full tile
taller and not one pixel wider. Objects can no longer overlap - the build fails.
THE LAW BEHIND IT ALL: NAME IT OR DON'T DRAW IT. The manifest
(records/target/BOHEMIA_TARGET_MANIFEST.txt) ships with the render, is printed
on the judge page, and the drawn-vs-named counter makes an anonymous placement
impossible. That counter immediately caught four props the first hand-written
manifest had silently missed. Gate: 483 checks. STILL UNJUDGED: the look.

ART (08) 7/26 REV 2 — THE PICK IS IN AND THE TWO NAMED DEFECTS ARE FIXED AT THE
ROOT. Paolo picked THE FRONT FACE, killed the other two, and called the winner
slop with two specifics. (a) CARS: v1 dropped them at their painted pixel size,
about 1x2, because no art tool had ever been told the vehicle law existed. Now
car_footprint() parses engine/bohemia_prop_scale.js at render time, fails loudly
if the law moves, fills exactly 3x2 cells, and turns each car along the surface
it is parked on. (b) ROOFS: v1 used a cavalier shear that offset the TOP face
right by 0.34 cells per cell of height while drawing the front face unsheared -
two projections in one sprite, putting a 4.2-cell house's roof 54px (a tile and
a half) sideways off its own walls. SHEAR is now 0 and gated at 0; roofs are
real hip forms (foreshortened trapezoid, sun-caught ridge, hip ends in the
roof's OWN material at another value, fascia board, eave shadow down the wall).
Judge is now ONE TAP. Gate: 91 checks. B and C renderers DELETED, not disabled.

ART (08) 7/26 — THE LANE'S FIRST DELIVERABLE (superseded by rev 2 above). Three hand-assembled target screens of the walkable street level at its
best, composed like posters, each paired with a real screenshot of what ships
today so the comparison is a fact and not a claim:
  A THE FRONT FACE — the run's own square grid, but every building STANDS UP:
    pitched sky-lit roof, readable wall, windows with sills, a 2-tile door with
    the room visible through it. Cheapest; only one side of a street can ever
    show a face.
  B THE ISO BLOCK — true 2:1 dimetric, the district-view projection he already
    said he likes, at walking distance. Lit side, shaded side, dressed roofs,
    BOTH sides of a street wear a face. New renderer + diamond grid.
  C THE CUTAWAY — B, but the building you walk into loses its two near walls:
    the room, its floor and its contents are on screen while you are in it.
    Most renderer work; sells INTERIOR-MATCHES-EXTERIOR harder than a door can.
EVERY PIXEL OF MATERIAL IS APPROVED ART (house skins 30/30 UP, harmonized street
pools, street props, desert pools, the BLESSED lamp bank, mounted signs, the
85/15 perimeter wall). The body is not drawn at all — tools/bohemia_char_export.js
drives the SHIPPED alpha in a real browser and bakes it through the game's own
buildFrame()/frameToRGBA(). Only two things are new, both documented in the
factory's REUSE CHECK: 2-CELL DOOR OPENINGS (cut from the approved leaf's own
pixels, because the corpus only has a whole door inside ONE tile) and BUILDING
MASSING/SHADING/SHADOWS (geometry only — the district heroes were killed, so no
approved volume bank exists; every face is filled with an approved tile).
NEW GATE, same turn: gates/target_screen_gate.py (63 checks, registered in the
suite). It holds the PROPORTION CANON as arithmetic on the factory's own
constants (cell 0.75m, human 1.75m, door = 2 cells, a body clears 68-90% of its
own doorway), three tones ordered sky>front>away with >=1.6 contrast, NO black
keyline, no warm night glow on act-1 windows, iPhone-portrait frames, every
declared bank really opened, the judge page reachable from inside the alpha, and
law 4's quest-ask freeze on the LIFE hub. The TARGET-MATCH half turns on the
moment he picks.
DISCOVERED AND WRITTEN INTO THE BACKLOG (ART-3): the approved car wrecks were
cooked near-top-down and read WRONG in true iso. That cost is visible in the B
and C screens on purpose. If B or C wins, the vehicle family gets re-cooked to
the picked projection; if A wins, the bank is already correct.
HONEST LIMIT: these are POSTERS, not the engine rendering. That is what a target
render is for, but nobody should read them as "the game already looks like this."
Nothing shipped into the run, the city or any district this turn.
ALSO SHIPPED THE SAME TURN, because amendment D landed on main mid-session and
made it STEP ZERO: laws/BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md — frame, tile
px, integer zoom, portrait viewport, proportion canon, ONE light direction, the
three value bands, no-keyline, no-dither, the offscreen-1x + integer-blit
pipeline rule, and the ~224MB memory constraint. Every number is asserted
against the factory's own constants, so the doc and the code cannot drift. TWO
CLAUSES ARE HONESTLY UNMET AND THE DOC SAYS SO: the 64-colour master ramp is
DERIVED from the approved art but the corpus is continuous-tone (59,377 colours
across the plates) so indexing lands with the act-1 tileset and is held by a
ratchet ceiling meanwhile; and live canvas memory is NOT instrumented, so the
gate does not pretend to check it. Order note for whoever reads the law: the
contract was written FROM the screens, not before them.
ONE FINDING HANDED TO ANOTHER LANE, NOT TOUCHED: the CITY tab
(slices/BOHEMIA_CITY_CURRENT.html) never sets imageSmoothingEnabled at all, so
its world art has been drawn BILINEAR-FILTERED on a pixel-art game, worst on 3x
phones. The run slice sets it false; the city never did. That file is the CITY
lane's and that lane is mid-flight, so target_screen_gate prints it as a loud
KNOWN GAP every run and backlog CITY -1 carries the one-line fix. The exemption
must be deleted in the same commit that fixes it.
NEXT IN THIS LANE (blocked on the pick): write the pick into the spec, graveyard
the losers with a post-mortem, turn target-matching on, lift the freeze, then the
MASTER ACT-1 TILESET built to the target and judged as ONE assembled scene with
the act1/act2/act3 triptych in spec.

RUN (01) — RULED 7/26, READ THIS BEFORE ANY RUN WORK:
laws/BOHEMIA_ADDENDUM_THE_RUN_IS_THE_INTEGRATION_LANE_7_26_26.md. Paolo played
the first run and the verdict was that it did not use the game we spent six weeks
building ("it didn't use anything that we've done"). He is right: the player was
an orange dot. THE LANE'S JOB IS NOW INTEGRATION, NOT FEATURES. The run's quest
is disposable scaffolding whose only job is to route him past whatever was just
wired in — never surface it for a verdict, never spend a turn writing it.
SAME TURN, FIRST FIX: the run now wears the REAL CHARACTER. New cast bridge
(alpha runSendCast -> BOHEMIA_RUN_CAST), same bus the CITY tab already rode: the
parent bakes the real rig + wardrobe + face, 8 directions, 4-frame walk cycle,
and every body on the block (you, the neighbours, the quest NPC) is a real
Bohemia body with the real face in the dialogue portrait. Painter-sorted by depth.
THE SCOREBOARD (this is the answer to "what do I do with this"): every run ship
quotes records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md, enforced by
gates/integration_gate.js — a row may NOT be marked INTEGRATED without a machine
probe proving the wiring is in the shipped run.
NEXT: the overworld look is the loudest gap (Paolo 7/26: "it's kind of looking
like shit the whole overworld") but its OWNERSHIP moved the same day to the
ART-FIRST RESET (laws/BOHEMIA_ADDENDUM_ART_FIRST_RESET_7_26_26.md): the ART lane
produces TARGET SCREENS, Paolo picks one, and until then no lane cooks new
visuals. INTEGRATION OF ALREADY-APPROVED ASSETS EXPLICITLY CONTINUES, which is
this lane's whole job. So: keep pulling approved banks into the run, and the
moment a target screen is picked, move the run's world render toward it by
adopting the CITY tab's human-mode renderer instead of growing a second one.
Then the real valley, district art, day cycle + light.

RUN (01) — the loop itself, shipped earlier the same day: THE FIRST CONNECTED RUN.
New RUN tab in the alpha (first tab, preloads itself), one thumb: wake up inside
your own house -> out the front door -> the lineman on the street gives you a
throwaway errand -> follow it down his street -> resolve it quiet or LOUD -> a
LOUD resolution hands off to the REAL combat frame and comes back with
dead/spared/fled -> walk home -> the phone posts it with real CLOUT and
followers. Files: slices/BOHEMIA_RUN_SLICE_7_26_26.html (dev source, edit this)
-> tools/build_run_slice.js -> slices/BOHEMIA_RUN_CURRENT.html (generated, never
edit). Gate: gates/run_gate.js (80 assertions, both forks + inside the real
alpha). Record: records/BOHEMIA_THE_FIRST_CONNECTED_RUN_7_26_26.txt.
NOTE FOR EVERY LANE: the alpha now relays BOHEMIA_RUN_ENCOUNTER / _NEED_CAST /
_MUSIC and answers BOHEMIA_RUN_COMBAT_END / _CAST / _MUSIC_STATE
(runEncounterIn / runSendCast / RUNFIGHT / showTabPanel in the alpha shell).
Do not repurpose those names.

CITY (03) 7/26 — INTERIORS EVERYWHERE. You can now WALK INTO BUILDINGS in the
alpha's CITY tab (DROP IN, then walk into a wall whose dossier declares an
interior; walk out the door to come back). Three things landed:
(1) A LOCKED LAW WAS BEING BROKEN: bohemia_floorplan.js padded any footprint too
small for its zone's room grammar, so 343 buildings valley-wide were BIGGER
inside than out (storage unit rows 3x108 -> 10x108, farm strips, trailers, a
watertreat plant). world_gate's dim check passed because it sampled a coordinate
window and stopped at 200 buildings. Now 0 of 67,034 clamped, and world_gate
sweeps every married district type BY NAME across four seeds.
(2) Interiors reach everywhere: the 219 bespoke/landmark-cell buildings (casino,
resort, strip, airport, campus, prison...) answer interior() through the same
dispatch; the missing `leisure` zone exists; the interior door is cut on the side
the exterior actually opens on instead of always south.
(3) FOUND, NOT FIXED: COMMERCIAL WAS NEVER MARRIED. It never binds K, so the
registration behind `typeof K` was silently swallowed and the walked city still
renders commercial from LEGACY PREFAB STAMPS with nothing enterable. Binding K is
one line and it turns walkable_gate RED — on a single W or N street the plaza
builds only ONE store strip and parking fills the rest (drive 61% vs content 30%),
which is the [PENDING Paolo] "mid-block form" its own NOTES already flag. So the
binding is REVERTED, the numbers are written into the module's own head, and it is
backlog CITY-1: fix the mid-block form, THEN bind.
New tools/bohemia_city_module_resync.py re-syncs every engine module inlined in
CITY_B64 (the embedding tools were all one-shot, so engine fixes never reached the
app); it also caught district_kit a revision behind.
PAOLO CORRECTED THIS MID-TURN and he was right: the first interiors were painted
flat colours while the approved art sat unused ("half of the file size of bohemia
is the graphic assets and you're not using a single one of them"). Interiors are
now built from the pools he JUDGED: hwall / hwindow / hboarded / hdoor (the
all-30-UP house-skin cook) and the harmonized 'side' concrete. The interior is
made of the same material as the exterior. A second wrong turn is recorded too:
reaching into TP_TILES (the raw 9,127-tile PRE-VERDICT cut corpus) put purple and
neon in a dead house - never sample that for shipped art, it is the judging
surface. ROOT CAUSE FIXED: reusefirst_gate only swept *_factory/*_cook, so a
*_patch that paints pixels was invisible to it; it now sweeps any tool that
draws, and the six older drawing patches carry accurate REUSE CHECK blocks.
NEW GATE: interiors_gate.js (35 checks, registered). NEXT in this lane: CITY-1
interior props from the Great Sweep, then commercial, then garage/crypt interiors still render as ROOMS in the
alpha (the engine dispatches decks and vault halls correctly, the app does not
yet), then interior dressing off the dossiers.

WORLD MODEL (02): the big one landed — THE QUEST SYSTEM IS RESCUED ONTO MAIN.
9 playable canon quests (S01-S09) + quest runtime + casting bridge live in the
phone; quests actually move the factions (world bridge); the live phone runs
the REAL world (was a fake); MAP app render fixed. CANON QUESTS gate registered
and green. NEXT flagged: the run itself (see connected-run below).
RUN tab in the alpha (first tab, preloads itself). One loop, one thumb: wake up
inside your own house -> out the real front door -> the lineman on the street
gives you S01 THE METER READER (real canon .bq) -> follow the skimmed line 57
tiles down his street to the fixer -> resolve it quiet / in daylight / LOUD ->
a LOUD resolution hands off into the REAL combat frame and comes back with
dead/spared/fled -> walk home -> your phone posts it with the real CLOUT weight
and followers. Stitching only, no new systems. New gate: run_gate.js (69
assertions) plays the whole run in a real browser, both forks, AND again inside
the real alpha through the real combat bridge. Full record + the two [PENDING
Paolo] calls: records/BOHEMIA_THE_FIRST_CONNECTED_RUN_7_26_26.txt.
Files: slices/BOHEMIA_RUN_SLICE_7_26_26.html (dev source, edit this) ->
tools/build_run_slice.js -> slices/BOHEMIA_RUN_CURRENT.html (generated, never
edit). Hold-to-walk on the d-pad; the block is 128 tiles and tapping per step
was data entry, not a game.
NOTE FOR EVERY LANE: the alpha now relays BOHEMIA_RUN_ENCOUNTER ->
startEncounter -> BOHEMIA_RUN_COMBAT_END (runEncounterIn / RUNFIGHT /
showTabPanel in the alpha shell). Do not repurpose those names.


WORLD MODEL (02): 7/26 (e) — THE PLAYER IS ON THE GAME'S CLOCK. RUN's second engine
request delivered: Loop.makeWalkSurface(ctx,{gx,gy}) + ctx.walk. A real player actor in
a real loop scheduler, in VALLEY TILE space, whose passability is read straight off the
world model's tile rung, so the block wall, the median and the bedrock block him because
they exist and not because somebody kept a collision list. It is a SECOND scheduler on
purpose: ctx.scheduler is overmap-CELL space, a body walking a street is tile space, and
one scheduler cannot hold both without silently changing what every existing actor's
coordinates mean. Same module, same 120 BPM turn contract, same actor shape.
API: where() / commit(dx,dy) (returns moved, blocked, turn, and the CROSSING) /
routeTo(x,y) / follow(path) / teleport. Gate CROSSING now 22 checks and walks the real
thing: boot the loop, stand in a suburb, route across the street, follow it 162 steps,
one world turn per step, two boundaries crossed, ending in the district the route
promised — and the cell-space scheduler proven untouched. NON-COOK, freeze-clean.
RUN's ledger priorities 2 and its backlog item 3 are both unblocked now.

WORLD MODEL (02): 7/26 (d) — YOU CAN WALK OUT OF YOUR BLOCK NOW. Engine support the
RUN lane filed (ledger priority 2, "the run's block becomes a real cell of the
generated valley so walking off it lands in a real neighbouring district"). The world
model could address a CELL and a PLOT and had no way to say "the tile at valley
position X,Y", so every surface moved a body inside one plot and stopped at the edge.
NEW RUNG on bohemia_world.js: tile(gx,gy) / solidAt / step (reports the CROSSING: which
cell and which district you just entered) / walk / route (bounded breadth-first over
real non-solid ground, lazy per cell). Valley is 12,288 x 12,288 tiles addressable.
IT CAUGHT A REAL DEFECT ON ITS FIRST RUN: the arterial's tract wall ran unbroken along
both sides, so the city was sealed out of its own streets and no route existed from any
district to any other. Streets now cut an access break and pave an apron to the walk
wherever a district fronts them, centred to meet the district's own gate. Gate: CROSSING
(12 checks) walks district -> street -> district on four real sandwiches out of the live
valley. NON-COOK, so freeze-clean.

WORLD MODEL (02) — FREEZE COMPLIANCE NOTE (read with the entry below): the five new
surfaces (arterial, freeway, desert, mountain, water) were built in the same hours the
ART-FIRST RESET landed. They are STRUCTURE, not approved art: what ground exists, what
blocks, what you walk on, where the passes are. Every one is flagged PROVISIONAL SKIN in
its own module and dossier, and NONE of them is surfaced to Paolo for an art verdict.
When the ART lane's target screen is picked, these five get re-skinned to it. The ACT
TRIPTYCH gap (act-2 / act-3 materials) is recorded in each dossier as [PENDING Paolo].

WORLD MODEL (02): 7/26 (c) — THE GROUND IS BUILT. Two ships, same day, same ruling
("build a fucking world"). FIRST the roads: engine/bohemia_arterial.js (2,434 cells,
real Clark County cross-section, median opening to a yellow turn bay, detached walks,
curb ramps the gate forced into existence, crosswalks, signal masts, block walls
wall-to-wall so a street JOINS the districts either side) + engine/bohemia_freeway.js
(952 cells, eight lanes between barrier and sound wall, the traffic still stopped in
them, a real OVERHEAD overpass deck on piers where a street crosses). THEN the terrain:
engine/bohemia_terrain_noise.js (one valley-wide field, sampled in GLOBAL coordinates)
+ desert (620: self-spaced creosote on desert pavement, dry rills, OHV tracks, illegal
dumping, and the GHOST PLAT — a graded subdivision nobody ever built, on ~18% of lots)
+ mountain (927: ridge-and-ravine limestone, solid rock with walkable ravines as the
only passes, alluvial fans grading into the valley) + water (74: the reservoir in
DRAWDOWN — bathtub ring, exposed lakebed, a launch ramp stopping in mid-air).
THE VALLEY WENT 40% -> 95% GENERATED. All of it SURFACE cells, never districts (law).
Gates: ROAD CELLS (39) + TERRAIN (60), both green, both caught real defects first
(crosswalks dying at the gutter; mountain cells with no mountain in them). The MAP tab
can now FIND the mountains, the desert and the lake. Dossiers written for all five.
EARLIER 7/26 (a): quest placement candidates + the ONE VALLEY seed fix. Per the
ruling that judge page stays live in the LIFE tab, unjudged, and is NOT
re-surfaced at him.
NEXT IN THIS LANE (backlog WORLD-1 a-d): the airfield kit (airbase 54 + airport 40)
is the biggest thing still flat; then rail 90 + interchange 16 (network tiles, same
machinery as the roads); then the small landmark set (campus/town/speedway/ballpark/
convention/datafort/prison/dam/basin/reservoir). The Strip, the resorts and the
casinos stay RESERVED for Paolo's hand and are never auto-generated. After that, the
APPROVED ambient encounter director. Quests stay parked.

QUESTS (01) 7/26 — TWELVE MORE PLAYABLE QUESTS SHIPPED (S10-S21). The playable
corpus went 9 -> 21. Census, flash flood, triage, deed, dog on the landing,
marquee strike, pirate radio, hybrid seed, the crew problem, the blackout
birth, counterfeit charge tokens, the man who walked back in. All twelve are
live in the phone (same bytes the gate proves) and judged from inside the
alpha: LIFE tab -> THE 12 NEW CANON QUESTS. The canon-quests gate got HARDER
the same turn: no phantom endings, >=2 clout tags, >=1 silence option, no dead
objectives, unique ids — five checks the original nine also pass, nothing
grandfathered. 426/426 on 21 files; full suite green. Verified on the real
surface: a headless browser played all twelve to real endings, zero page
errors. The judge tool is now BATCHED per unjudged-is-dead (the 7/25 page for
S01-S09 stays byte-identical as the record; the fresh page carries only what he
has never seen). Record: laws/BOHEMIA_ADDENDUM_TWELVE_MORE_CANON_QUESTS_7_26_26.md.
THEN, same day, Paolo caught the real hole: the 150-quest study corpus was never
opened. Fixed at the root -- the questbook is now MACHINE-READABLE (3,672 citable
findings), every one of the 21 quests cites what it was actually built from, and
the QUEST STUDY gate checks the citations verbatim. Two ports the corpus had
queued by name are now real mechanics: the lie you must ARRANGE (S16) and
persuasion via the target's own surfaced doubt (S19).
NEXT in this lane: Act-1 main-quest beats as .bq chains (start by querying the
index), which first needs the cross-quest chain support the backlog names.
NOTE for WORLD: the placement factory now has 12 more quests to address.

LIFE + CITY (03): WALK-THIS-GAME redirect fully shipped — (1) SLICE walk
surface dressed to FINISHED, (2) neighbors homed+scheduled on the block,
(3) 4-lot big buildings + landmark zoom. Zoom-build: the city builder IS a
zoom of the one iso view (Paolo 7/25). 15 district heroes on the map.

COMBAT (04) 7/26 - v82: HE COULDN'T FEEL THE FREEZE AND HE WAS RIGHT TWICE.
Law AMENDED IN PLACE: laws/BOHEMIA_ADDENDUM_THE_QUANTIZED_FREEZE_7_26_26.md.
Paolo: "I didn't notice time stopping for a whole second or whatever." TWO
SEPARATE DEFECTS, both mine, both real, both now measured.
(1) THE KILL FREEZE WAS WIRED TO THE WRONG TIER. startKillshot() is only ever
called after sndKill(), so every contact in the cinematic is a KILL by
construction - and v81 handed it the WEAPON tier (0.125s for a pistol).
freeze('kill'), the whole beat and the headline of the feature, only fired from
finishHim (manually executing a downed man) and from the bullet that kills YOU.
NEITHER IS WHAT HE DOES WHEN HE SHOOTS SOMEBODY. So the thing he was told to go
feel was 4x too short AND buried inside a cinematic already running 0.55-2.8s of
its own slow motion. Fixed: a kill fires KILL (one beat), the last man fires LAST
(two). The weapon now colours the SHAKE, not the duration.
(2) THE FREEZE STOPPED THE SIM, NOT THE PICTURE. Measured: 27% of the screen was
STILL CHANGING every 90ms during a freeze, against 30% while running. Cause: V67
ONE CLOCK doing its job too well - _bpmClock is fed from the AUDIO clock every
frame BEFORE the freeze applies, and it drives the bob, the floor pulse, the kick
pulse and the dial. The sim froze and the whole screen kept breathing on the
beat. Fixed: the VISUAL beat clock is PINNED for the freeze; the AUDIO is
deliberately untouched (the song must play through the stop) and the visual clock
snaps back onto the true audio position on release.
THE CLEAN MEASUREMENT (three earlier probes were BAD and were thrown out, not read
generously: getImageData reported "still" while the game was running, and a
screenshot hash called 473 changed pixels out of 329,160 a MOVING frame; a
screenshot pair also straddles the end of a 0.5s freeze, which made one run look
WORSE after a fix that helped). Isolating it with a long hold during a LIVE
killshot: RUNNING 120ms apart = 43.67% of the screen changed; FROZEN 300ms apart =
0.06%. The picture holds dead still.
*** THE REAL LESSON, and it is about the GATE: section 17 asserted the kill tier
IS one beat and NEVER asserted that a kill FIRES it. A CORRECT TABLE THAT NOTHING
REACHES IS WORTH ZERO, and the gate would have passed that bug forever while
printing twenty green lines about note values. It now tests the PATH. Same shape
as v75 (song density measured per pattern, called per bar) and v81 (impact
measured in frames, called weight): every one a correct value with a broken
connection to reality, and EVERY ONE CAUGHT BY PAOLO PLAYING IT, NOT BY THE
GATE. ***
Gate: 339 checks green.

COMBAT (04) 7/26 - v81: THE QUANTIZED FREEZE. Law:
laws/BOHEMIA_ADDENDUM_THE_QUANTIZED_FREEZE_7_26_26.md.
Paolo: "Lets freeze the game for that snappy satisfying feelings then." GO on
item 1 of the juice research. Shipped same turn.
THE LAW: EVERY FREEZE IN BOHEMIA IS A NOTE VALUE, derived from BEAT=60/BPM and
never typed - 1/16 graze (0.125s), 1/8 hit (0.250s), 1/4 KILL (0.500s, ONE WHOLE
BEAT), 1/2 LAST MAN (1.000s, the room holds). A KILLSHOT IS A REST IN THE MUSIC:
the world stops for a beat, the song runs through it, everything drops back in on
the grid.
AND I FOUND A REAL BUG DOING IT. The old hit-stop counted FRAMES (2/3/4/6/7/10/14
across seven call sites), so it was BOTH arbitrary AND FRAMERATE-DEPENDENT: 10
frames is 167ms at 60Hz and 83ms at 120Hz. EVERY IMPACT IN THE GAME HAS BEEN
RUNNING AT HALF WEIGHT ON A 120Hz PHONE and nothing in the code said so. Paolo
has been judging feel on that.
Vlambeer's canonical 0.2s is right for any game NOT on a clock and wrong for this
one; the gate now explicitly REJECTS it along with all seven old frame counts.
THE SHAKE decays INSIDE the freeze: direction from the shot vector, duration ==
the freeze duration (so it can never smear into the next beat), squared decay,
scaled by weight (5.5 kill / 3.2 hit / 1.8 graze), applied on the CAMERA
transform so nothing in the world moves relative to anything else.
ONE function arms a freeze and it takes a NAMED TIER, never a duration, so a bare
number cannot reappear at a call site. JUICE.F still kills the whole thing for
A/B. A fresh fight clears freeze + shake. THE LAST MAN's long hold is decided
BEFORE the body resolves (checkClearSoon) so it lands on the kill that ENDS the
fight, not the one after.
PULLED BACK FROM MY OWN RESEARCH ON PURPOSE: the doc proposed a FULL BAR (2.0s)
on the last man. Shipped a 1/2 note. Two seconds of frozen world is too long on a
phone; one constant (TIERS.last) if he wants the bar.
Gate: section 17 EXECUTES every tier and - importantly - asserts the invariant
REJECTS the OLD values (an invariant that would also have passed the thing it
replaced is decoration). Also asserts a note value means a REAL subdivision
(1/1..1/32), not "any integer fraction", because the loose version let 1/60 of a
bar through - which is exactly how a frame counter passes for music. 335 checks
green. Proof: slices/BOHEMIA_QUANTIZED_FREEZE_PROOF_7_26_26.png plus the live
read: KILL freeze 0.500s -> 0.221s left at 250ms -> 0 at 650ms, shake cleared,
and THE AUDIO CLOCK ADVANCED 679ms OVER 650ms OF WALL TIME WHILE THE WORLD WAS
FROZEN. The world stopped and the song did not. 0 console errors.
THE LESSON, now written into the law: TWO of the last three additions were correct
systems ruined by an unexamined UNIT (v75 measured song density per pattern and
called it per bar, wrong by 4x; this measured impact in frames, wrong by 2x on
half the phones). A NUMBER WITHOUT A UNIT IS NOT A NUMBER. Both gates now DERIVE
their unit from the clock instead of typing it.

COMBAT (04) 7/26 - RESEARCH PART TWO (no code shipped; he asked for research).
records/BOHEMIA_COMBAT_RESEARCH_JUICE_VERTICALITY_COMPANIONS_7_26_26.md.
Paolo: "the music is the best it has sounded with the rhythm base of the game so
far... I want more juice. I want this to be juicy and fun and just like wow." He
named four things: JUICE, COMPANIONS, TWO/THREE STOREY COMBAT WITH STAIRS, and AN
ARENA MAP TO TEST AI AND FEEL. All four researched. NOTHING BUILT.
THE MERGED PICK-LIST (both research docs, ONE order, so the next session does not
face two competing lists):
  1 THE PROVING GROUND (greybox arena)      low-med   he asked for it by name
  2 THE JUICE PASS, QUANTIZED               low       the "just like wow"
  3 ENEMY INTENT ON BY DEFAULT              low       ITB + StS are built on it
  4 SHOVE AS A REAL PUSH                    med       becomes defenestration
  5 AI ARCHETYPES W/ RHYTHMIC SIGNATURES    med       reading an enemy = reading a rhythm
  6 COMPANIONS ON STANCES                   med       foundation already RULED
  7 TWO/THREE STOREY COMBAT                 high      tile spec speaks it, combat does not
  8 TURN CLOCK = THE SONG'S FORM            high      would make the game unlike anything
THE KEY FINDINGS:
- VLAMBEER'S ~30 JUICE TECHNIQUES, but the 0.2s "sleep" is an ARBITRARY duration
  and would desync the 120 BPM clock. THE RULE FOR BOHEMIA: every juice duration
  is a NOTE VALUE (1/16 graze, 1/8 hit, 1/4 killshot, 1 bar last-man-down). Then
  the freeze IS the clock and a killshot is a REST IN THE MUSIC. No other game
  can do this. Also PERMANENCE (Vlambeer rates it top-tier and it is nearly free):
  casings, scars, blood stay, so the arena reads as a record of the fight.
- VERTICALITY: XCOM 2's lesson is ACCESS (roofs always within one dash; its
  predecessor's trap-slopes are the warning). TACTICAL BREACH WIZARDS' lesson is
  the better one - height is not a stat bonus, it is A KILL YOU SET UP
  (defenestration). That marries SHOVE-as-push to floors. AND THE LAYERING LAW +
  INTERIOR-MATCHES-EXTERIOR ALREADY SPEAK MULTI-STOREY; only combat does not.
- COMPANIONS: the research is unanimous and slightly surprising - CONFIGURABLE
  BEATS CLEVER (Dragon Age Origins is the named best because you pre-program
  them), MICROMANAGEMENT is the killer, and the BOND beats the stats. So:
  STANCES, not orders (HOLD / PUSH / COVER ME / GET OUT), set once, one tap,
  never per-turn, and the ally acts ON THE BEAT like everything else. WHO they
  are is [PENDING Paolo] - contents his.
- AI: archetype-specific utility FUNCTIONS beat weight tweaks (a berserker whose
  aggression rises as health drops). Bohemia version: every archetype gets a
  RHYTHMIC SIGNATURE (downbeat / offbeat / every other bar / reactive) so reading
  an enemy is reading a rhythm.
- THE ARENA is a standard named practice (GREYBOX) and it is the highest-leverage
  item because it makes every other item JUDGEABLE instead of arguable. One
  block-built arena: two-storey block + stairs + ledge, hard and soft cover, a
  long lane, a tight room, an open middle, plus dials for archetype/count and a
  per-effect juice toggle so any one can be A/B'd alone (the PULSE-button
  discipline, applied to feel).
LOGGED, EXPLICITLY NOT TOUCHED (his instruction: "mark it down... I don't even
want you to continue that"): the PULSE VOICES sound "elementary school hi-hat
metronome shit". They borrow each song's own kit by design (v75) - which
succeeded at sounding like the record and FAILED at sounding like a fight. The
fix when he wants it is a DEDICATED COMBAT PERCUSSION BANK (casings on concrete,
boot on gravel, a door slam as the backbeat, a distant generator) - that is a
COOK, so it needs his ear and a REUSE CHECK against banks/ first. CONTENTS HIS.

COMBAT (04) 7/26 - v80: SOFT THE WHOLE FIGHT + THE MASTER MAKES ROOM, plus
THE BIG-BRAIN RESEARCH he asked for. Law:
laws/BOHEMIA_ADDENDUM_THE_PULSE_JOINS_THE_LADDER_7_26_26.md (amended in place).
Paolo: "the music is the best it's ever been. Just work a little bit on
volumizing, and for the pulse mode just forget about it going hard at five kills,
cause by the end of my combat encounters it was like a lot of volume fighting
each other. So maybe just the pulse mode is soft the whole time starting at zero
kills." BOTH RULINGS APPLIED.
(1) NO TOP RUNG. HARD_AT is Infinity; AUTO resolves SOFT at every count forever.
His 7/3 rungs at 2 and 4 carry the climb. HARD stays reachable by forcing it so
he can hear what he retired. Button: AUTO -> HARD -> OFF (SOFT left the cycle
because AUTO *is* soft - three distinct states, no redundant one).
(2) "VOLUME FIGHTING EACH OTHER" WAS REAL AND MEASURABLE. Counted off his own
song table: the ladder schedules 16.2 voices/bar at 0 down, 24.2 at 2, 41.8 at 4.
2.6x by the end of a fight, ~+4.1dB of pile-up into ONE master gain that never
moved, in front of a limiter at -14dB/6:1 - and a clamped limiter ducks every
voice at once, which is exactly what he heard. Same failure class as v70, but
whole-mix instead of one voice.
THE FIX IS WHAT A MIX ENGINEER DOES: the master TRIMS as his rungs arrive
(1.00 / 0.82 / 0.68), ramped 120ms so nothing clicks, reset to full on a fresh
fight. Net +0.8dB across a whole fight instead of +4.1dB, so it grows in
INSTRUMENTS not in level. MASTER GAIN ONLY - not one note, voice or pattern
(song_lock_gate proves it from the other side, 20/20 every run).
Gate: section 16 rewritten - executes the no-escalation rule at 8 counts,
re-measures the pile-up off his songs, asserts the trim absorbs it WITHOUT
over-correcting (the climb must still be audible), and asserts the reset.
316 checks green. Proof: real surface, live AudioParam read as men go down:
0.800 -> 0.657 (rung 1) -> 0.545 (rung 2), never escalated to hard, fresh fight
back to 0.799, 0 console errors.

*** RESEARCH DELIVERED (he asked for "big brain research" on turn-based grid
combat): records/BOHEMIA_COMBAT_RESEARCH_TURN_BASED_GRID_7_26_26.md. Six games:
Into the Breach, Slay the Spire, XCOM 2, Crypt of the NecroDancer, Divinity OS2,
plus the game-feel literature. NOTHING BUILT. Seven ideas, ranked, sourced.
THE THREE HEADLINES:
 1. QUANTIZED HITSTOP - freeze the world for a NOTE VALUE (1/16 graze, 1/8 hit,
    1/4 beat on a killshot). The literature says 0.05-0.2s scaled to hit strength;
    Bohemia is the one game where that freeze can BE the clock instead of
    breaking it. Cheap, no rules change, biggest feel-per-hour.
 2. ENEMY INTENT ON BY DEFAULT - ITB and StS are both built on perfect
    information ("a puzzle game wrapped in a strategy game"). Bohemia HAS it, as
    a perk (FORESIGHT), OFF by default. Cheap; the info already exists in the AI.
 3. THE TURN CLOCK AND THE SONG'S FORM - ITB fights are FIVE TURNS then the
    enemies retreat; killing is one of four verbs. In a 120 BPM game a fixed turn
    count is a fixed number of bars, so THE TURNS COULD BE THE SONG'S SECTIONS
    (turn 1 = A ... turn 5 = D). That reaches his 0:48 payoff EVERY fight without
    persisting anything and without costing him the NEW ENCOUNTER song change -
    the thing he rejected at v76, solved from the other end. Expensive, real
    rules change, HIS call.
ALSO: NecroDancer's designer landed on ~100% timing leeway because "the challenge
comes from the fast tactical combat itself" - a direct warning that my 55ms/110ms
windows may have made TIMING the difficulty instead of the pleasure. And XCOM's
lesson is that Bohemia already SOLVED the 95%-miss problem with the dial (skill,
not dice) - so never add a hidden roll on top of a good press; that should become
a law. Depth work after that: SHOVE as a real one-tile PUSH with collision
damage (ITB's best verb is displacement, not damage) and ENVIRONMENT (elevation,
destructible cover, Vegas surfaces) which is still the thinnest part of the
fight. ALL [PENDING Paolo]. ***

COMBAT (04) 7/26 - v79: THE PULSE JOINS THE LADDER (Paolo's design). Law:
laws/BOHEMIA_ADDENDUM_THE_PULSE_JOINS_THE_LADDER_7_26_26.md.
Paolo: "pulse starting off on soft so essentially zero kills, then the old system
we had kicks off at two kills, then it upgrades the beat at four kills, then
maybe it goes to hard on five kills." LOCKED, shipped same turn.
THIS IS HIS ANSWER TO HIS OWN EARLIER QUESTION about the balance between his 2/4
rungs and the pulse. The pulse was a PARALLEL system competing with his ladder;
now it is the same ladder's FLOOR and CEILING:
  0 kills PULSE SOFT | 2 his RUNG 1 hats | 4 his RUNG 2 bass | 5 PULSE HARD
His two 7/3 rungs sit INSIDE it, unedited, on their own voices.
KEYS OFF _sk, not a raw kill count, so there is exactly ONE definition of
intensity: V71's downed/crawling/broken/fleeing count, and v74's GROOVE chain
counts (a full chain floors at 6 -> HARD with NOBODY down; a broken chain stays
SOFT). The top rung is earned by bodies OR by playing in the pocket, never by
nothing.
Button: AUTO (default) -> SOFT -> HARD -> OFF. Manual still wins so he can A/B;
OFF is still an honest bare creeper.
Gate: section 16 EXECUTES the ladder at 0/1/2/3/4/5/9 down, asserts HARD_AT is a
named constant, pulls the GROOVE core out to prove rhythm alone reaches the top,
and asserts his 7/3 rungs are byte-present and unmoved - 310 checks green. Proof:
slices/BOHEMIA_PULSE_LADDER_PROOF_7_26_26.png (men downed one at a time in a live
fight, the ladder stepping exactly on his numbers, 0 console errors).

*** [PENDING Paolo] THE OVERWORLD DRIVER. He asked "what do you think" about the
2/4 progression applying CALMLY outside combat. ANSWERED IN THE LAW, NOT BUILT.
My recommendation: LIGHT = TERRITORY (already LOCKED canon) + CLUSTERED POWER -
rung 1 crossing into lit owned blocks, rung 2 deep inside a grid, calm again in
the dark. Three reasons: needs no new lore, is already visible on screen, and
carries the same cargo as two men down without violence. THE "CALMLY" HALF IS
MECHANISM AND MINE: outside combat a rung enters ON A SECTION BOUNDARY and fades
in over one bar (his form turns every 4 bars / 8s), so it sounds COMPOSED rather
than triggered, and it leaves the same way.
SMALL PRINT: the overworld runs a DIFFERENT player (parent MUS + CITYMUS) from
the combat demo - same songs and voices, different sequencer - so the driver has
to be posted from the world into the parent. Real work, ordinary work. Nothing
ships until he rules. ***

COMBAT (04) 7/26 - v78: NEW ENCOUNTER = NEW SONG. I REVERTED MY OWN v76.
Law AMENDED IN PLACE: laws/BOHEMIA_ADDENDUM_THE_SONGS_PLAY_OUT_7_26_26.md.
Paolo: "the only thing I don't like that you try to implement was that when I
pressed new encounter this song doesn't change like that's so fucking retarded
bro." RULED. OUT. NEW ENCOUNTER pulls the next song from the bag every time.
WHY I GOT IT WRONG (the part worth keeping): his "30 or 40 second loop" report
was true and the cause was real (every encounter reset the 2:08 form to bar 0, so
the FULL section at 0:48 was unreachable). The DIAGNOSIS was right; I reached for
the wrong LEVER. Persisting the song across encounters fixed the form at the
direct cost of the thing the button exists to do. A button that visibly does
nothing is worse than a section he has not heard yet.
THE RULE THIS LEAVES BEHIND, and it generalises past music: when a fix trades
something the player feels IMMEDIATELY for something they would only feel LATER,
it is a BET, and it is HIS bet to place. One line to him before building it would
have got a one-word no and saved the whole detour.
DELETED OUTRIGHT, not parked: SONG_PASS / songPlayedOut / rollSongIfDone are gone
from the build. A force flag wired through a function that no longer decides
anything is dead logic pretending to be a feature.
SURVIVES (plain bug, not what he rejected): the song used to be pulled from the
bag TWICE an encounter, burning the shuffle at double speed and skipping songs he
never heard. One pull now. Also survives: the pulse yielding, the corrected
2.17/2.33 measurement, the song lock.
THE COST, ON THE RECORD: combat hears roughly the first 40s of a song again. The
2:08 form still exists and the overworld still plays it whole. If combat is ever
to reach the payoff the answer must NOT cost him the button - HIS call, not mine
to try again.
Gate: section 15 rewritten to hold the REVERSAL (301 checks green) and to record
the cost so nobody rediscovers it. Proof:
slices/BOHEMIA_NEW_ENCOUNTER_SONG_PROOF_7_26_26.png plus the real surface: five
NEW ENCOUNTER presses, five different songs (SLOW BLEED, SATELLITE PRAYER, GHOST
IN THE GRID, THE ORGAN IN THE DROWNED CHAPEL, REPO MAN), each on its own beat one.

COMBAT (04) 7/26 - v77: HIS SONGS ARE CANON, AND THE MACHINE CHECKS IT. Law:
laws/BOHEMIA_ADDENDUM_HIS_SONGS_ARE_CANON_7_26_26.md. NEW LAW + NEW GATE.
Paolo, after v76: "you're not editing any of the actual songs right... I don't
want you touching the actual songs themselves, bro."
He is right to ask, and "I promise I didn't" is not an answer a machine can
check. gates/song_lock_gate.js (20 checks, registered in the fleet suite as SONG
LOCK) byte-hashes every canon music body against records/BOHEMIA_SONG_LOCK.json:
OVERWORLD_SONGS, MLOOPS, MFACTIONS, SONG_ARR/SONG_ROOT, synthV, drumV, the 7/3
2-and-4 rungs, the klay styles. IF A HASH MOVES AND THE MANIFEST DOES NOT, THE
BUILD FAILS. It is NOT a ban on new music (the music lane's whole job): changing
a song means running --write and saying WHY, which puts it in the diff instead of
inside a 32MB base64 blob. Deliberately NOT locked: the fight pulse, the shuffle
timing, the metronome, the UI - mechanism, mine, supposed to move.
PROVEN BY TAMPERING, not asserted: SLOW CREEP's kick was edited from its canon
[0,10] to a four-on-the-floor [0,4,8,12] and the gate failed the build with the
expected/found md5 and both options in plain English. Tamper reverted, alpha
verified clean against git.
AND THE RECORD FOR v75+v76: ZERO bytes of any song changed. Every music body
hashes identical from 70e2061 (before the music work) to the shipped build.
This is MECHANISM-MINE / CONTENTS-PAOLO'S applied to audio, the same shape as RIG
LAW's sacrosanct painted regions and the byte-locked visual constitution.

COMBAT (04) 7/26 - v76: THE SONGS PLAY OUT + THE PULSE YIELDS. Law:
laws/BOHEMIA_ADDENDUM_THE_SONGS_PLAY_OUT_7_26_26.md.
v75 THE FIGHT PULSE is APPROVED BY EAR (Paolo: "Wow, I felt that. I really like
that... it works. It really did.").
FIRST, A CORRECTION I OWED HIM: v75 told him his creepers average 0.54 kicks and
0.58 hats a bar. The real numbers are 2.17 and 2.33. The gate divided each
pattern by 4, treating a 16-step pattern as four bars; it is ONE bar (stepDur
0.125s x16 = 2.0s = four beats at 120). Wrong by 4x, and it was printed in his
settings panel. Corrected in the panel, the law and the gate, and the gate now
DERIVES bars-per-pattern from stepDur so the unit can never drift from the clock
again. The corrected count exposed the sharper half: PLACEMENT. Not one of the
six songs kicks on beat 2, only THE PIT BOSS ever kicks on beat 4, and 2 of the
13 kicks land off the beat entirely. There was nothing EVEN in there to lock to.
HIS SONGS ARE NOT 30-SECOND LOOPS. His own 7/3 TWO MINUTE LAW made them 64-bar,
2:08 arrangements whose FULL section D lands at 0:48 and doubles at 1:36. But
every NEW ENCOUNTER threw the form back to bar 0 (pickRandomFaction re-anchored,
and the song was pulled from the bag TWICE an encounter). A fight shorter than 48
seconds never heard a single D, so what played on repeat was A B B A C: the first
forty seconds. His "30 or 40 second loop" was an accurate measurement of what the
game actually played him.
THE FIX IS WHAT THE OVERWORLD ALREADY DID: CITYMUS waits for a full 1024-step
pass then shuffles. Combat was the only place doing it wrong. Now songPlayedOut()
+ rollSongIfDone() hand over the next track when the form is FINISHED; an
encounter joins the song in progress. V71 IS NOT REVERSED (its fix was the BAG,
which stands); the swap FREQUENCY was the incidental part eating his
arrangements. V67 ONE CLOCK intact: a REAL song change still re-anchors beat one.
An explicit SHUFFLE tap still forces a song.
THE PULSE YIELDS. Measured, the floor was doubling REAL hits: across his six
creepers it landed on a kick the song already played 11 times and on its own hat
14 times, plus its clap sat exactly on the 2-kill rung's clap. The doubled kick
on step 0 is the same limiter bug v70 and v71 each had to kill. A floor FILLS
WHAT IS NOT PLAYED, so it now fires only where his song is silent and drops its
backbeat while the rung is clapping. Still lays 2.2 kicks and 5.7 hats a bar into
the gaps. His arrangement and his 7/3 ladder are canon; the floor is what moves.
RECORDED, NOT FIXED (deliberate): the OVERWORLD kill ladder is a DEAD PATH.
MUS.layers starts at 0 and the only thing in the build that ever assigns it is
the studio's preview buttons, so the four melody-klay creepers can NEVER bloom
out there. The driver is lore and [PENDING Paolo].
[PENDING Paolo] THE TASTE CALL: he wants nothing good hidden behind kills AND the
4-kill payoff where "the whole song would actually play". Four ways to reconcile
were put to him (rungs carry energy not melody / kills fast-forward the form /
un-gate entirely / drive it from the world). NO RUNG WAS MOVED and NO klay layer
was un-gated. The 2 and 4 rungs are his 7/3 LOCKED law.
Gate: section 15 EXECUTES the form table, the play-out predicate and the duplicate
count against his real songs - 303 checks green. Proof:
slices/BOHEMIA_SONGS_PLAY_OUT_PROOF_7_26_26.png plus the real surface: five
NEW ENCOUNTERs back to back, RESTARTED=false on every one, and wound to bar 23
the FULL section D at 0:48 is reachable through an encounter change.

COMBAT (04) 7/26 - v75: THE FIGHT PULSE. NO NEW MECHANICS. Law:
laws/BOHEMIA_ADDENDUM_THE_FIGHT_PULSE_7_26_26.md.
Paolo stopped the lane: "the music, I'm not really feeling the rhythm in this
shit... it's decent, but not enough to slap more mechanics on the timing unless we
can make the music and the action button work better together." So: nothing new on
the timing this turn. One job, the music and the button.
THE MEASUREMENT INSTEAD OF A SIXTH CLOCK FIX (v67-v71 were five correct,
verified clock fixes he could not feel): his own OVERWORLD_SONGS table, counted -
the encounter creepers average 0.54 KICKS and 0.58 HATS PER BAR, all six
half-time, every lead an ambient voice. Four-on-the-floor is 4 and 8. He was
trying to lock onto a pulse THAT IS NOT IN THE RECORDING. No clock work could
ever have rescued that. THE LESSON, and the law part: when a fix is correct and
he still cannot feel it, MEASURE THE THING THE FIX WAS SUPPOSED TO SERVE.
HIS SONGS ARE UNTOUCHED (V63 is his own ruling, the 13 tracks are canon). They
get a FLOOR under them, combat only, dead when the fight ends: kick on all four
beats, hats on the eighths, a backbeat on 2 and 4, played in THE SONG'S OWN KIT
voices and mixed UNDER his song, thickening +15% per GROOVE chain level so the
button feeds the music back.
AND THE BUTTON FINALLY PLAYS INTO THE TRACK: the count was tone(415,'square') -
a UI beep living outside the music, which is a big share of why five correct
clock fixes felt like nothing. sndBeat is now the song's own hat; beat one is its
kick+hat.
ONE TAP TO JUDGE IT: PULSE: HARD / SOFT / OFF, sitting beside MUSIC: ON in the
FACTION (floor + music) group with its own plain-English line. OFF is the bare
creeper byte-for-byte, so the A/B is honest and the verdict is his ear.
Gate: section 14 RE-MEASURES his song table every run (so no future session can
delete the floor on the theory the songs got denser) and EXECUTES the pulse core -
287 checks green. Proof: slices/BOHEMIA_FIGHT_PULSE_PROOF_7_26_26.png plus the
real-surface count in a live fight: 23.5 drum voices a bar with PULSE HARD against
7.8 with it OFF, and the button cycling hard->soft->off->hard on the real surface.
STILL FROZEN, waiting on his ruling: the whole v74 groove chain and every next
timing swing. A SECOND rejection of the rhythm direction ENDS the direction for
the session (STOP PRODUCING law); it does not earn a sixth attempt.

COMBAT (04) 7/26 - v74: TWO BIG SWINGS TOWARD A RHYTHM GAME. Law + the research
+ what is still open: laws/BOHEMIA_ADDENDUM_THE_GROOVE_CHAIN_7_26_26.md.
RESEARCH: Rogue Fable IV ("skill matters more than stats", "you should be in a
state of near constant motion") + Crypt of the NecroDancer's GROOVE CHAIN
(on-beat actions compound, a missed beat OR a hit resets, indicator hot at max).
THE DIAGNOSIS: v69 graded every press and then did NOTHING with the grade. A
grade with no stake is a scoreboard, not a mechanic. And v73's free movement was
permitted, not rewarded.
(1) THE GROOVE CHAIN: x1 -> x2 at 2 on-beat actions -> x3 at 5 -> x4 at 9,
breaks on an off-beat press or on taking a hit (announced, never silent). It buys
CAPABILITY: the dial window opens 10% per level (+30% at x4), and the music
ladder takes the higher of bodies-down and the chain, so THE SONG CLIMBS ON
RHYTHM ALONE before anybody is dead. Reads on the timing strip, hot orange at max.
(2) ON-BEAT MOVEMENT IS FREE: a stamina move whose press lands PERFECT refunds
its pip. In the pocket you can move all turn; sloppy and the bar drains. The
reward for rhythm is MOBILITY.
Both key off the SAME graded press -- one definition of on-the-beat in the fight.
Gate: section 13 EXECUTES the chain and the refund (276 checks green). Proof:
slices/BOHEMIA_GROOVE_PROOF_7_26_26.png (a PERFECT move at +19ms refunded its pip
and opened the chain; an EARLY move wiped it).
NEXT SWINGS, in order, in the addendum: rhythm AS difficulty (the 52 patterns are
curve shapes, not note values), the enemy telegraph as a beat countdown you can
dance out of, and ENVIRONMENT (RF4 leans on terrain/clouds/traps; Bohemia has
pillars and one grenade -- the thinnest part of the fight).

COMBAT (04) 7/26 - v73: STAMINA MOVEMENT IS FREE *AND* SAFE. Law (amended):
laws/BOHEMIA_ADDENDUM_STAMINA_NEVER_COSTS_A_TURN_7_26_26.md.
Paolo: "when I press shift it's almost like a run... I get free movement and I
CAN'T GET SHOT AT that turn. That's what Rogue Fable IV does. I can use up all my
action stamina points in my turn and it doesn't end my turn, meaning I DON'T GET
SHOT after I run to a location."
v72 stopped sprint ending the turn and LEFT THE RETURN FIRE IN (mobExposeFire).
From the player's chair, eating a volley the moment you arrive IS being shot for
moving, so it landed as no fix at all. ALL THREE mobExposeFire CALLS ARE GONE:
sprint (1 pip), dash (2 pips, breaks locks), vault (1 pip) cost stamina AND
NOTHING ELSE. Spend all three pips crossing the board; nobody shoots. The cost is
ARRIVING WITH NOTHING LEFT while their two-turn red line keeps ticking.
The one real ACTION (pop and shoot) still ends the turn and still eats the volley
-- that is the only thing that should ever cost a turn.
mobExposeFire() stays in the code for a future NON-stamina verb with ZERO callers,
and the gate asserts the caller count stays at zero so nobody re-adds a crack.
Proof on the real build: three sprints in ONE turn, pips 3->2->1->0, HP 100/100
the whole way, fourth refused for no stamina
(slices/BOHEMIA_FREE_MOVEMENT_PROOF_7_26_26.png). 263 gate checks green.
STANDING CHECK for any future combat verb: does it spend stamina? Then it may not
end the turn AND may not draw return fire. Either one means it is broken.

COMBAT (04) 7/26 - v72: STAMINA NEVER COSTS A TURN. Law:
laws/BOHEMIA_ADDENDUM_STAMINA_NEVER_COSTS_A_TURN_7_26_26.md. Paolo: "the way the
strategy is gonna work in this game, it's gonna be fun -- like when you sprint
and use stamina points, it doesn't consume a turn, bro." THIS WAS ALREADY HIS
LAW AND THE CODE SAID SO: the STAM_MAX line has read "stamina actions DON'T end
your turn" since V54, and suppress/dash/vault all honoured it. SPRINT never did,
and MY v67 made it worse -- charged a pip AND still ended the turn, the worst of
both, a verb nobody would press. Sprint now ends nothing; what separates it from
dash is PRICE and RISK (1 pip + the FULL exposure crack, vs 2 pips + half +
breaks their locks). Proof on the real build: two sprints inside ONE turn, pips
3->2->1, no turn boundary between them
(slices/BOHEMIA_SPRINT_FREE_PROOF_7_26_26.png).
Also: rings down another 50% (a sixteenth of where they started; he has approved
the shape and motion three times now, only the alpha moves).
STANDING CHECK now in the gate: if a combat verb spends stamina, it may not end
the turn. 260 green.

COMBAT (04) 7/26 - v71: EVERYTHING ON BEAT + THE TWO BUGS HE CAUGHT. Law:
laws/BOHEMIA_ADDENDUM_EVERYTHING_ON_BEAT_AND_THE_DOWNED_7_26_26.md.
(1) HIS ANSWER TO MY QUESTION: "Everything on beat even the Enemies whatever
they're doing." The demo's one event scheduler moved from the HALF beat to the
BEAT, which put all 13 existing call sites (return volley, cracks, hurt flash,
blast) on the grid at once, plus the enemy verbs. Nothing waits over one beat.
(2) THE DOWNED ARE KILLS, FOR THE MUSIC -- SUPERSEDES the V53 code note that
"a pistol shot that only DOWNS a man must not bump the music". His words: "if I
didn't shoot them they typically would be dead... that's part of a kill,
intensify the song... I hate to see that you're not recognizing them." The
ladder now counts dead + downed + broken + fleeing, the same set aliveEnemies()
uses to end the fight.
(3) THE HERO DRUM DOUBLING IS DEAD ("I'm not feeling it"). Beat one is still
canon for every song (7/24) but it is announced by the 808 at 3x ALONE.
(4) RINGS at 12.5% (75% down, then another 50%). He approved the shape/motion.
(5) ALL THE OVERWORLD MUSIC. He was right and it was embarrassing: combat
carried a HAND-COPIED array of SIX night songs while the app holds THIRTEEN he
tagged OVERWORLD (10 night + 1 day + 2 dusk/dawn, baked in CAT_DEFAULTS). The
music bus had shipped his FACTION pools to combat since 7/19 and never shipped
the overworld ones. Now it does; the encounter walks a SHUFFLE BAG (every song
before any repeat) and the readout names the song + counts the bag down. Proof:
slices/BOHEMIA_OVERWORLD_BAG_PROOF_7_26_26.png shows THE ORGAN IN THE DROWNED
CHAPEL -> THE WIND LEARNS WORDS -> SATELLITE PRAYER, 12/11/10 left in the bag --
songs combat could never reach before.
STANDING LESSON, same as the doors: when a surface needs content the game
already has, it CONSUMES THE APPROVED CORPUS. A hand-copied subset inside one
surface is how a 13-song pool becomes 2 songs and nothing notices for a week.
Gate: combat_lab_gate section 11 executes the beat scheduler across a whole beat
and the shuffle bag over 13 draws. 260 green.

COMBAT (04) 7/26 - v70: TWO PAOLO RULINGS, both applied exactly.
(1) "turn the opacity down by 75% so they're barely visible but like still
there" -- the v69 approach ring and its snap flash keep exactly 25% of their
alpha. He APPROVED the rings themselves ("I fucked with that, that was a good
addition"), so the shape/motion is canon now; only the alpha moved.
(2) "should it be like three times as loud. Just the voice" -- he was right
TWICE. (a) 2x amplitude is +6dB, and a doubling of PERCEIVED loudness takes
about +10dB, so the v63 hero bass read as roughly 1.5x and never as double. 3x
is +9.5dB, the number that actually sounds twice as loud. (b) THE REAL REASON HE
COULD NOT HEAR IT: the master limiter (-14dB, 6:1) was being slammed by the
DOUBLED KICK + SUB BOOM that fire on step 0, at the exact instant the hero bass
note starts -- so the limiter ducked the note it was announcing. Raising the
bass alone would have been partly squashed away. The drums keep their double but
now run through their own 0.55 gain, so JUST THE VOICE gets louder, which is
literally what he asked for.
Gate: combat_lab_gate section 10 (251 green). Proof:
slices/BOHEMIA_RING_QUARTER_PROOF_7_26_26.png.
NEXT EDITION, recommended to him and awaiting his word: THE WHOLE FIGHT ON THE
GRID (backlog COMBAT 1u) -- the return volley, deaths, steps and camera hits all
resolve on beats and each gets its own percussion voice, so the fight BECOMES the
drum track instead of noise over it. That is the single change that turns "a game
with music" into a rhythm game. Then rhythm-as-difficulty (1v).

COMBAT (04) 7/26 - v69: MAKE THE BEAT PERCEIVABLE. Paolo after v68: "I couldn't
really tell a difference... how can we do better to make this feel like a rhythm
game?" The v68 math was right and gated; NOTHING let him perceive it. THE LESSON,
now a standing rule (laws/BOHEMIA_ADDENDUM_WHAT_MAKES_IT_A_RHYTHM_GAME_7_26_26.md):
a player cannot feel a fix he cannot perceive, so any timing/feel work ships with
its PERCEPTION in the same turn. A gate proves non-violation, never feel.
FOUR PILLARS, all shipped: (1) ANTICIPATION - an approach ring collapses onto the
dial across each beat and snaps at the hit, hero beat fatter/brighter/from further
out. (2) JUDGMENT - every PRESS graded PERFECT/GOOD/EARLY/LATE with the real ms on
a PERSISTENT strip (the verdict flash is overwritten by the hit result within the
beat, so the first version of this would never have been read) + a running PERFECT
count. We grade the press, not the granted shot, or the permission gate would
print PERFECT forever. (3) AUTHORSHIP - an on-beat press stabs a note in the
song's own key (root+fifth+octave on PERFECT). (4) CALIBRATION - a SYNC button
runs the standard tap-along (8 clicks, MEDIAN, refuses noisy taps) and stores a
per-device clock offset; phone latency is 40-300ms and uncalibrated that alone
can make a correct build feel like nothing.
STILL MISSING, in order (in the addendum + backlog): rhythm AS difficulty (the 52
patterns are curve shapes, not note values), the whole fight on the grid (volley,
deaths, steps, camera), a count-in bar, and [PENDING Paolo] whether the POP should
be beat-gated too (it would neutralise his ON THE ONE streak reward).
Gate: combat_lab_gate section 9 EXECUTES the grader (ms + bands + nearest-beat
wrap) and the calibrator (median, noise refusal, first-two-taps discarded). 247
green. Proof: slices/BOHEMIA_RHYTHM_PROOF_7_26_26.png ("LATE +158ms" on the
strip). Tool: tools/bohemia_combat_rhythm_patch.py.

COMBAT (04) 7/26 - v68: 120 BPM GAMEPLAY COMES FIRST (Paolo's law, recorded:
laws/BOHEMIA_ADDENDUM_120BPM_FIRST_AND_THE_PERMISSION_PRESS_7_26_26.md).
He played v67 and it still did not feel like the hero beat. He was right and I
had fixed the wrong cycle. v67 fixed the game CLOCK and the ENEMY COVER cycle;
the DIAL's own cycle is a different function (beatsForCycle) and it snapped to
EVEN beats. Even is not a BAR: a 6- or 10-beat cycle puts the perfect shot on
beat one, then beat three, forever. MEASURED: 59 of 135 pattern x difficulty
combinations (44%) could never land the kill moment on a downbeat, and holding
greed could knock an aligned pattern off the bar mid-fight. Now every dial cycle
is a whole number of BARS (135/135), and the per-pattern PHASE table was
RE-SOLVED against the new cycles by running the shipped engine (worst distance
from dead centre at beat one: 16.3% -> 5.2%; average 4.3% -> 1.7%; 49 of 52
patterns improved, none worsened).
THE PERMISSION PRESS, his second sentence made mechanical: a press is a REQUEST
to act on the correct beat, not an action. Press within 0.24 beats after a beat
and you were ON it (fires at once); press earlier and the shot is HELD and
granted ON the beat (worst case ~380ms), with the needle read at that instant.
The button says ON THE BEAT while it holds. Proof:
slices/BOHEMIA_BEAT_PERMISSION_PROOF_7_26_26.png.
[PENDING Paolo] the POP is deliberately NOT gated: the shipped ON THE ONE streak
(V57/V58, his ruling) rewards popping on beat one and quantizing the pop would
hand that reward out for free. If he wants the pop gated, the streak needs a
redesign the same turn.
FOUND: the dial engine block is stamped "do not edit; edit
engine/bohemia_engine.master.js then re-stamp" and THAT FILE DOES NOT EXIST in
the repo, nor does a stamper. The stamped copy is the only copy. Edits go
through tools/bohemia_combat_beatlaw_patch.py until a master is restored.
Gate: combat_lab_gate section 8 EXECUTES the shipped engine over every pattern x
difficulty (whole-bar assertion + needle-on-centre-at-beat-one assertion) and
runs the permission quantizer. 234 checks green.

COMBAT (04) 7/26 - v67: THE FOUR THINGS PAOLO CALLED OUT PLAYING IT.
(1) THE DIAL WAS NOT ON BEAT ONE AND COULD NOT BE. The sweep read `_bpmClock`, a
per-animation-frame counter started at page load; the music reads the
AudioContext and restarts its 16-step bar at step 0 on every song/faction
change. Two clocks, no shared origin, drifting. The AUDIO IS THE CLOCK now
(`_seq.t0` + `audioMs()`, output-latency compensated so it matches the EAR), and
cover cycles are WHOLE BARS (a 6-beat cycle can never start on a downbeat in
4/4; packages 2 and 3 were running one). Package 2 slowed 6->8 and package 3
quickened 6->4 as a side effect: [PENDING Paolo] if that rebalance is wrong.
(2) SUPPRESS DID NOTHING because the pin was `performance.now()+2200` -- a 2.2
SECOND wall-clock timer in a TURN-BASED game, so it expired while he was still
deciding. And a pinned man was dropped from the target pool, so suppressing
DELETED his own shots. Now: turn-based (XCOM contract), breaks the red lines
they were holding, pinned men STAY targetable with a 35% wider dial window,
they wear a PINNED tag, the action button counts them ("ENGAGE · 6 PINNED"),
1-turn cooldown.
(3) SPRINT WAS FREE. Costs 1 pip now -- and the turn-end refill no longer hands
the pip straight back (it is the reward for a turn you spent nothing on),
because a cost you cannot see in the pips is not a cost.
(4) SPRINT AND DASH BOTH ARMED THE SAME RING AND NEITHER DISARMED THE OTHER, so
an armed sprint could sit through a dash and fire on the next tap ("it
automatically moves for me"). Mutually exclusive now, auto-disarmed at turn end,
and the RING SAYS which move the next tap performs. SPRINT = 2 tiles, 1 pip,
ENDS YOUR TURN. DASH = 2 tiles, 2 pips, turn KEEPS going.
Tool: python3 tools/bohemia_combat_feel_patch.py (idempotent, anchor-asserted).
Gate: combat_lab_gate section 7 EXECUTES the clock math, the bar alignment, the
turn-based pin and the arm exclusivity (227 checks green). Verified on the real
surface by driving the actual buttons in the shipped alpha: suppress 3->2 pips
and the button reads PINNED, still pinned 7 real seconds later, sprint spends a
pip, arming dash disarms sprint. Headless has no audio device, so the CLOCK fix
is proven by executed math and code, NOT by ear -- Paolo's ear is the verdict.

COMBAT (04): v66 — THE RUN HANDOFF IS HARDENED AND THE RUN LANE CAN CALL IT
NOW. A quest step hands off with `startEncounter({questId, stepId, objective,
mercy, playerHP, roster, onEnd})` and gets back one settled outcome
(win/loss/aborted + dead/spared/fled/alive + fates + the quest context echoed).
Full contract: laws/BOHEMIA_ADDENDUM_RUN_HANDOFF_CONTRACT_7_26_26.md.
What landed: a HANDOFF CORE block inside COMBAT_B64 that owns the whole bus
(so the gate EXECUTES it instead of string-matching it), a declared LEAK LIST
that provably clean-slates every fight, cold handoff with the combat tab never
opened (frame built on demand + warmed at app open), a READY queue so an early
encounter is never dropped, abort, loud BOHEMIA_COMBAT_ERROR, and no demo
splash on a quest handoff. Verified on the real surface (headless Chromium on
the shipped alpha): 5 back-to-back cold handoffs, zero console errors,
slices/BOHEMIA_RUN_HANDOFF_PROOF_7_26_26.png.
THE BIG CATCH: the cold handoff took 12.9 SECONDS. A render-blocking
cross-origin Google Fonts link in the demo head was holding combat's entire
boot. Now non-blocking: 12,910ms -> 14ms. THE ALPHA SHELL STILL HAS THE SAME
LINK (backlog COMBAT 3, left alone for lane discipline; one line, whole-game
boot payoff, RUN lane's call).
REVERTED SAME DAY, on Paolo's report ("none of the enemies have clothing and
it's not the original player character"): the combat frame PRE-WARM is gone.
Building the frame at app open also pre-BAKES the player's sprites, so any part
of his look that restores late would be baked stale and the fight would wear
it. Gate now asserts the pre-warm stays dead. NOT REPRODUCED on a clean profile
or a save-and-restore profile, on either build (before or after v66), so the
cause may well be elsewhere: the ONE RIG / body-slider rewrite (3a7d9d9, 453
lines through the character+rig code) landed about an hour before he looked and
is the stronger suspect. NEXT SESSION IN THIS LANE: do not add combat features.
Find out whether the wrong character shows on the CHARACTER tab too (that would
make it the rig rewrite, not the combat bake) and fix the real cause.
Maintainer tool: python3 tools/bohemia_combat_handoff_patch.py (idempotent,
anchor-asserted). combat_lab_gate 208 checks green; v65 ramps intact.

CHARACTER/SOUND (05): 7/26 -- ONE RIG + VARIATION SLIDERS BUILT AND SHIPPED
(backlog CHARACTER-1). The whole female rig is deleted and graveyarded (gate,
tool, data, picker); rigSkel KEPT per the addendum. G.bodyVar {height, belly,
arms} is live on the CHARACTER tab, persists with the look, and rebuilds all 8
facings + every animation on drag. SECOND PASS same day, on his eyes: SHUFFLE
ANIM button on the preview box (+ skeleton off there), and four real "chopped"
defects he spotted and I had not -- thin arms collapsing to a stripe, the
minimum-width floor sliding the whole limb, the belly dial fattening the arms,
and the arms jumping to full thickness under the shoulder cap (the cape). All
four machine-locked; charpreview_gate.js added. engine/bohemia_bodyvar.js + inline (sync-
canon registered), gates/bodyvar_gate.js 37/37, and a real-browser capture
harness that sweeps the FULL clip set at every dial extreme (5,712 frames per
config; zero strays, zero shaves). Found and fixed ON THE REAL SURFACE: the
flank contract, the armpit bridge, the arm anchor, plus a FINAL FLOATER CULL in
buildFrame that now protects every garment ever made. MEASURED LIMIT worth
knowing: "taller" is capped by the 56px sprite frame at +5%, not by taste --
Paolo's painted body already fills the frame. DIAL RANGES ARE HIS CALL and are
waiting in the judge sheets. Earlier same day: marathon cook waves 1-3 (music
batch 20 = 9 faction-pool songs, wardrobe volume 29 items + 3 new shapes; music
batches 18/19 before that). That mega-verdict stack is still pending Paolo.

QUEST/LORE (01): its island content is rescued to main. The branch
claude/quest-log-access-ufcu1u still exists with its full separate history
(169 unique commits) — kept for reference until a session confirms nothing
else needs porting, then it can be retired to the archive. Per the
coordinator's plan this lane is chartered to be REBORN AS THE RUN LANE
(laws/BOHEMIA_COORDINATOR_PROMPT_LIBRARY_7_25_26.md, Prompt 2).

CONNECTED-RUN (branch claude/connected-run): the run-lane start exists — 2
additive commits (BOHEMIA_RUN_CURRENT.html base + S01 + Playwright harness
green). Unmerged, additive-only, waiting for its session to continue.

TASTE ENGINE: laws/BOHEMIA_PAOLO_TASTE_CANON.md + tools/bohemia_taste_filter.py
landed on main, validated both directions against Paolo's own past verdicts.
Factories pre-filter batches against his recorded NEVERs before he sees them.
The filter KILLS, it never APPROVES — that line never moves.

COORDINATOR (07): read-only across lanes. Produced the architecture map, the
findings (quest-rescue plan since executed, collision watch), the prompt
library, and this diet. REPO CLEANUP: DONE, both phases (7/26). The full
pre-slim history (every commit 7/16-7/26, all branches) lives permanently in
paolosarn/bohemia-vault, byte-verified before the rewrite; main is a SLIM
GENESIS of the identical tree. Procedure + keep-it-slim rules:
laws/BOHEMIA_ADDENDUM_REPO_DIET_7_25_26.md. Future slims repeat the same
archive-first procedure; the coordinator watches repo weight on check-ins.

=============================================================================
## PENDING PAOLO (the shelf — never decide these for him)
=============================================================================
- **THE TARGET SCREEN PICK (7/26, ART lane) — THE BLOCKING ONE.** alpha -> LIFE
  -> PICK THE TARGET SCREEN. Three candidates, each beside the build he plays.
  He picks ONE and it becomes the visual constitution. Nothing new gets drawn
  fleet-wide until he does.
- THE 12 NEW CANON QUESTS (S10-S21): **PARKED** by the art-first reset's law 4
  (QUEST ASKS FROZEN). Still reachable in the LIFE tab as the record; nobody
  surfaces it at him until the target screen is picked.
- THE MEGA VERDICT (FRESH items only, per the UNJUDGED-IS-DEAD ruling 7/26):
  the marathon waves Paolo has never seen — music batch 20, wardrobe volume,
  plus whatever lanes stack next. STALE unjudged banks are presumed dismissed,
  never re-surfaced (laws/BOHEMIA_ADDENDUM_UNJUDGED_IS_DEAD_7_26_26.md).
- QUEST PLACEMENT PICKS: **PARKED** by law 4 (QUEST ASKS FROZEN), same as above.
- FACTION TERRITORY SHAPE (discovered 7/26): every faction sits on a suburb tract
  and holds exactly 1 cell, because bases are an even stride across the district
  list. Whether a faction's ground should match its trade is HIS call; the
  mechanism is a small change to bootFactions the moment he rules.
- One-rig VARIATION SLIDERS: scope/next step after the 7/25 ruling.
- THE RUN's two calls, after he plays it (record has the full reasoning):
  (a) the lineman/fixer placements on the block, (b) whether a LOUD resolution
  should always draw a fight, and who shows up.
- WHICH ANIMATIONS ARE "THE COUPLE THAT ARE SOLID"? Naming them gives the
  rebuild its reference poses instead of starting from zero.
- DELETE the current clips now, or keep them running as unapproved placeholders
  until the replacement lands? (Assumed the latter; one word changes it.)
- BODY SLIDER RANGES (built 7/26, judge sheets in records/bodyvar/): how far
  each dial should go, what "and stuff" covers beyond height/belly/arms, and
  whether dials are per-NPC-random, player-chosen, or both. Nothing was wired
  to randomise NPC bodies -- that is his call, not mechanism.
- WHETHER "TALLER" IS ENOUGH: +5% is everything the 56px sprite frame allows.
  Going bigger needs a ruling (a taller frame, or re-centring canon).
- Combat grammar graduation batch (stacked per Prompt 4) when surfaced.
- Older shelf items live in the archived pile under their original sections.

=============================================================================
## NEXT UP (the standing plan)
=============================================================================
1. THE RUN: DONE and shipped 7/26 (above). Next in the lane: the phone-feel
   pass on real-device viewports, then widening the run past one block.
2. PLAYTEST: the run is the first thing Paolo can actually PLAY rather than
   thumb. His notes on it are first-class verdicts (SPIRIT loop).
3. Then: mega verdict sitting, then volume on whatever he approves.
=== END — keep this file under ~500 lines; the pile is the archive, not here ===
