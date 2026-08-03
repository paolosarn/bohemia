CHARACTER (0lurbs): 8/2 (m) LATEST — HAIR IS 23 CANON. THE SIDE VIEWS ARE THE OPEN
WORK. READ THE MEASUREMENTS BELOW BEFORE TOUCHING genHair; I WASTED TWO BUILDS
GUESSING AT CAUSES I COULD HAVE MEASURED IN ONE COMMAND.

=== WHERE HAIR STANDS ===
23 canon styles, 0 pending candidates (he judged everything). Board shows ALL EIGHT
facings, 184 head shots. Export ends a ROUND: notes + thumbs clear, sheet archived,
file named _R<n>.txt.

HIS STANDING VERDICT ON THE SIDES, 8/2, still open:
  "you really aren't doing it from a good eastern west angle ... I know it's a
   first pass, but I wasn't impressed ... keep going you're not close."
Then after two more builds: "You doing better needs more work please continue."
IT IS BETTER, IT IS NOT DONE. Do not treat the sides as finished.

=== THE FOUR THINGS THAT WERE ACTUALLY WRONG (all found by MEASURING) ===
1. HAIR WAS GLUED TO THE SKULL OUTLINE. Every row clamped to span(y), which IS the
   skull, so hair was a skin-tight cap with no silhouette of its own on any facing.
   Research: in a side profile HAIR DRAPES WITHOUT FOLLOWING THE SHAPE OF THE HEAD.
   Fixed: the mass projects past the skull, piling at the BACK, held off the FACE,
   keyed to the face centroid.
2. A PATTERN DID NOT ROTATE WITH THE VIEW. Cornrows run front-to-back over the
   scalp: from the front you look ACROSS them (vertical stripes), from the SIDE you
   look ALONG them (horizontal bands). The phase was on X for all eight facings.
   Same bug's other face: a mohawk is a blade on the midline -- thickness from the
   front, LENGTH from the side. It was narrowed on every facing, so in profile the
   whole haircut collapsed to 1-2px. Fixed: phase on Y in profile; a strip in
   profile draws a CREST spanning the skull, ABOVE hTop (background rows, so put()
   accepts them -- widening it ACROSS the skull measured WORSE because put() refuses
   face pixels on a non-back facing).
3. A PARTING WAS A HOLE. The texture SKIPPED, so raw LIT skin showed between rows --
   max contrast, read as a comb. Fixed: a parting is the wearer's own skin TAKEN
   DOWN (scalp in a groove), which also honours his "not just straight the skin
   tone" ruling.
4. THE SIDE OF THE HEAD WAS BALD. sideBot stops the mass halfway down the skull so
   it cannot run over the eyes on a FRONT view. BACK was exempted on 8/1; PROFILE
   never was. MEASURED: facing E, CORNROWS occupied ROWS 5-6 AND NOTHING ELSE.
   I had publicly called this a "contrast problem" the build before, from a
   thumbnail. It was not. Fixed: profile joins back at full-skull coverage.

=== THE PROCESS LESSON, and it cost two builds today ===
TWICE I named a cause by eye from a thumbnail and was wrong both times. Reading the
actual pixels took ONE command and gave a different answer each time. Before
naming a cause in genHair, dump the pixel grid for that facing. There is a probe
pattern in the session scratchpad; it is ten lines.

=== KNOWN AND OPEN ===
- Cornrows in TRUE PROFILE: coverage is fixed, but whether the bands READ at 56px
  on a near-black ramp is UNJUDGED. He has not seen the 8/2m build yet.
- The strip-in-profile crest is new and unjudged.
- Clause 6 fade UNLOCK mechanism: [PENDING, HIS CALL] -- a fade is a luxury
  (laws/BOHEMIA_ADDENDUM_A_HAIRCUT_IS_A_LUXURY_8_1_26.md). Do not invent the economy.
- Names of the 23 styles: PARKED by him explicitly. Do not raise it.
- cough / whistle / search: frozen, two rejections each.

=== GATES THAT WENT RED AT HIM, SIX TIMES TODAY ===
hair_gate twice (batch size when he killed 13; board count when he approved 7),
craft_law_gate three times (pinned style name, empty candidate queue, pinned the
BROKEN centring and later the BROKEN half-fix), dress_gate once (counted a canon
token inside a COMMENT).
A GATE THAT PINS AN IMPLEMENTATION WILL DEFEND ITS BUGS. Pin BEHAVIOUR.
A gate that goes red because he exercised a verdict is the gate being wrong.

=== SHIP HYGIENE, learned the hard way ===
- `node gate.js | tail -1` in an && chain gives you TAIL's exit status. I pushed a
  red gate twice before switching to `node gate.js >/dev/null 2>&1 || exit 1`.
- The local checkout silently rolled back to a stale commit FOUR times today. If a
  file you know you wrote is missing: `git fetch origin main && git reset --hard
  origin/main` before believing it.
- main moves every ~10 minutes. Rebuild-on-main + replay beats rebasing the alpha.


LAB (lab-e2r7sv): 8/3 (b) LATEST -- HE RULED ALL THREE, AND THE GRIME ANSWER IS
"IT IS A PIPELINE STAGE, NOT A MILESTONE".

=== RULING 1: THE GRIME PASS IS APPROVED. "SURE" ===
And he attached the question that mattered: "BUT WE HAVE SO MANY GRAPHICS ASSETS TO ADD.
DO WE DO THIS BEFORE WE THE DEMO ND THE END?" He was right to smell a trap. If the grime
is a HAND-PAINTED pass it can only ever be done at the end AND it has to be redone from
scratch every single time an asset lands -- hundreds of times, permanently out of date in
between. THE ANSWER IS NEITHER OF HIS TWO DATES: it is a BAKE-TIME PIPELINE STAGE. Build
it once and every asset added from that day forward is grimed automatically, adding 500
more tiles costs zero grime work, nothing waits on anything, and the demo gets grime
because everything does. laws/BOHEMIA_ADDENDUM_NO_PAINT_8_3_26.md clause 2 + NEW CLAUSE 2A.
THREE REQUIREMENTS, all mechanism: it COMPOSITES AT BAKE and never writes to banks/ (his
pixels stay sacrosanct, and a wrong strength is a one-line change not a re-cook); it is
ONE DIAL so he judges strength once by looking at the WORLD not a tile (the number is
still [PENDING Paolo]); and it is INDIFFERENT TO OBJECT BOUNDARIES, because a grime system
that respects where one asset stops has reproduced the exact problem it exists to solve.
*** THE ART LANE BUILDS IT, NOT THIS ONE. *** It is a texture-pipeline stage, that lane
owns the pipeline and is actively in it. And it does not run until he lifts the freeze --
an approved grime pass is not an approved art batch.

=== RULING 2: YOU CAN KILL A WITNESS TO STOP A STORY SPREADING ===
"ABSOLUTELY ANYTHING U THINK U CAN AND SHOULD DO IS IMPORTANT." Rule 5 of
records/BOHEMIA_RESEARCH_STORIES_SPREAD_8_3_26.md is APPROVED. Two halves, both written
down: the MECHANIC is in and no lane may soften it into "scared into silence" (the weight
is that the option is real), AND it is a grant of JUDGEMENT on mechanism, not a blank
cheque on the content he reserved -- it does not repeal NO DAMAGE BEFORE THE DIAL. Three
constraints I hold: there is a WINDOW (until the district unloads, Dwarf Fortress's own
trigger), the witness must be FINDABLE (otherwise it is cruelty without agency), and it
MUST COST (killing them is its own event with its own witnesses, so murdering your way
out can make it worse -- free, no special case).

=== RULING 3: AN HEIR DOES NOT INHERIT THE WALKED MAP. "NO THEN" ===
R11 is RULED and came OFF the still-his list the same turn. The heir gets the family's
places (house, camp sites, whatever the city was built into) and re-walks the rest.
Reason: fast travel unlocks by having walked (R9), so a revealed valley means nobody ever
walks again -- and re-darkening makes gen 2 and 3 feel like GOING BACK OUT, not resuming
a save.

=== GATED (mutation-tested in both directions, seven mutations, all caught) ===
no_paint_gate.js 50 checks (+E1..E8: his approval verbatim, HIS QUESTION quoted not
paraphrased away, the pipeline-stage answer, the trap it avoids, and all three
requirements). rulings_gate.js 63 checks (+E1..E11 on the rumour research and the witness
mechanic, +B4/B4b/B4c on R11, +C4b). The answered index is at 23 questions / 59 triggers.
NEW CHECK WORTH KEEPING: C4b asserts the index headings are numbered 1..N with no
duplicates -- I duplicated 18/19/20 inserting three rows mid-file, and a duplicate number
in a REGISTRY makes every citation to it ambiguous forever.

=== MY OWN MESS, OWNED ===
Last ship I committed CONFLICT MARKERS into this handoff. A python resolver asserted at
its LAST line (the marker check), so the file was never written -- and I ran git add and
rebase --continue anyway. Fixed and force-pushed the same turn. THE RULE: a resolver that
throws must never be followed by a blind `git add`. Also the local working dir has rolled
back to an old commit THREE times this session; every time, verify the work exists on
origin/main FIRST, then hard-sync. Nothing has been lost.

=== NOT DONE / THE QUEUE ===
1. THE WITNESS + STORY-SPREAD PLUMBING is now APPROVED work and it is the top item. The
   object model (a rumour is a THING, not a number), witness sensing on all NPCs (R20),
   spread on district unload, degrees = fidelity not severity, and the kill-the-vector
   window. Numbers stay his.
2. R30 "let's look into it" -- the legacy-roguelite family. Transcription was garbled and
   I am NOT guessing a title. R29 (Rogue Fable) is NOT live permission; killed 8/1.
3. Canon-contradiction auditing across the indexed files.
4. Did not touch #buildstamp again: laws/records/gates only, nothing new on the surface.
RUN (run-eak241): 8/3 (g) LATEST -- SIDE DOORS IN THE SUBURB HE SPAWNS IN.
Ship: BUILD 8/3g. Tab: RUN. READ laws/BOHEMIA_LAW_MEASURE_THE_THING_HE_NAMED_8_3_26.md
clause 1b before you write another coverage gate.

"id dint see the side door" -- THIRD TIME, and he was right all three times.
I fixed the geometry (8/3a). I fixed the draw order (8/3a). I wired his 7/10 edge-on art
into the KIT branch and measured "commercial 22/22, farm 10/10" and called it done (8/3d).
HE SPAWNS IN THE SUBURB. The suburb is a COMPLETELY SEPARATE branch of the cell realizer
(m.sub, its own 7/27 front-door rule) and the east/west pass only touched m.kit. So the
one district he walks around in had ZERO side doors while the gate swept a 96x96 valley,
found plenty in districts he has never visited, and went green.
A MEASUREMENT NOT TAKEN WHERE HE IS STANDING IS NOT A MEASUREMENT OF WHAT HE SEES.
That is now clause 1b of the law, and gates/ewdoor_gate.js asserts side doors exist IN
THE SPAWN DISTRICT BY NAME, first, before any valley-wide number.
FIX: the same rule ported into the suburb branch in the suburb's own codes (2 house,
6 garage, 9 upper, and canStand = 0 dead-ground / 1 road / 3 driveway / 10 sidewalk).
The 7/27 FRONT door rule is UNTOUCHED; this only adds the sides, which had nothing.
AFTER: 42 side doors in the spawn cell alone, up from 0. Rendered, looked at, and the
screenshot shows the stone doorway sliver two tiles tall on a house's west wall with the
player standing beside it on the dirt.
GATE: E/W DOOR 7/0 (was 6, the new one is the spawn-district assertion).
STILL HIS TO JUDGE: the sliver is dark and narrow. The WIDTH is one number (JAMB_PX=7)
and the bank says so itself: "7px was approved for the demo doors ONLY -- these are
CANDIDATES; widths adjustable per doorway when judged."

COMBAT (combat-nfnki9): 8/3 (a) LATEST -- DIFFICULTY NEVER TOUCHED THE ENEMY, AND
RUN IS ONE BUTTON ON THE THUMB. Shipped to main as 4f5b9b4, BUILD 8/3f.

=== HE ASKED WHY THE FIGHT IS EASY. I MEASURED IT INSTEAD OF GUESSING ===
"I am really concerned how easy this game could be unless I throw 8+ enemies at a
player... I don't know if it's because I'm not easy difficulty or if it's because of
the rule that pretty much you're always guaranteed to get the first shot always."
He named two suspects. BOTH ARE REAL, and there is a third he did not guess.
  1. YOU DO ALWAYS SHOOT FIRST. Confirmed: startPhase 'cover', enemiesActedBeforeYou 0,
     every time. NOT CHANGED -- who moves first is a design ruling, not a plumbing bug.
     [PENDING Paolo] and it is on the ask list.
  2. *** THE DIFFICULTY SETTING DID NOT TOUCH THE ENEMY AT ALL. *** Twenty turns of
     standing still, eight foes: EASY killed me in 6 turns at 16.7 HP/turn, BOHEMIAN
     killed me in 6 turns at 16.7 HP/turn. IDENTICAL. G.pkgDiff only ever fed THE DIAL,
     so every difficulty meant one thing -- how hard is it for YOU to shoot -- and
     nothing ever made THEM better. That is why more bodies was the only lever that
     ever worked. Now scales distAccuracy, the one number every enemy shot runs through.
     THREAT_BY_PKG 1.00/1.12/1.26/1.42/1.60, EASY left exactly where it was.
     IT DIVIDES THE MISS, NOT THE HIT, and I only know that because I measured the
     first cut: multiplying the hit chance ran V.HARD and BOHEMIAN both into the 0.99
     clamp -- two identical tiers, the exact bug being fixed, moved up two notches, and
     it would have shipped green. Expected hits per volley now 3.65/3.93/4.21/4.43/4.60,
     long range .379 -> .611, point blank barely moves (.970 -> .981).
     NOT a damage multiplier (no-multipliers ruling) and it does NOT touch the dial
     (v98: the killshot allowance must never be wired to difficulty). The gate counts
     threatMult's call sites to keep it that way.
  3. 4.4% OF EVERY MAN SPAWNED INSIDE SOMETHING SOLID -- 40 in cars, 30 in cover blocks
     across 200 arenas and 1,600 bodies. setupEnemies never asked whether anything was
     there; the OCCUPANCY LAW's one gap. Now spirals out to the nearest free cell,
     never onto the player, runs after the deck holders. Measured after: 0, 0, 0%.

=== RUN IS ONE BUTTON (v122) ===
"removing the dash and vault button definitely I never use them... I'd rather
incorporate them in a standardized run button next to the actual action in movement
buttons actually on screen." He never used them because they sat at the TOP of the
screen while the thing they do happens at the BOTTOM, on the ring, with his thumb.
DASH did not even act on its own -- it ARMED, then made him travel back down.
RUN reads what is down the line he taps: cover out there -> all the way to it, 2 pips
(his number); low cover on you -> over it (that is VAULT, no button, no refusal);
nothing out there -> one tile, 1 pip (the 8/1 sprint ruling). Keeps DASH's real payload
(free, no turn end, breaks their red lines). GRENADE joins it in the cluster.
doDash/doDashMove/doVault NOT deleted -- he said remove the BUTTONS. SPRINT stays; he
did not name it.
MEASURED 200 spawns x 8 directions: 86 to cover, 91 one-tile, 23 refused, 0 short,
0 console errors. Low pillar adjacent gets vaulted; tall one refused with ALREADY ON IT.
TWO BUGS THE REAL SURFACE CAUGHT THAT READING THE CODE DID NOT:
  * the buttons at left:-56px COVERED the W, NW and SW direction pips -- two of his
    eight directions. Moved to -100px, re-measured, zero overlaps.
  * RUN WALKED ME INSIDE A WALL. A tall pillar one tile away gives stop=0, the no-move
    fallback pushed one tile FORWARD, and the first cut spent pips before checking.
    An OCCUPANCY LAW break shipped by a convenience. Every check now precedes the spend.

=== GATE ===
combat_lab_gate 628 -> 643, fourteen new, ALL NEGATIVE-TESTED (they fail on an unpatched
alpha). combat_runs_smoke green. FOUR existing checks migrated with the supersession
named: two pinned the literal old distAccuracy line, the V54 toolkit check now names the
four buttons that exist (RUN greys out in aim like the rest of the toolkit), and the
enemy-facing cover-call count 3 -> 4 because runBreakLocks carries its level.
FULL SUITE run on the real merge. 11 gates red -- RIG CHECK, PARTS PAINTED, BODY
VARIATION, LIFE, DRESS, POPULATION, MEMORY, DEVIATION, WALL CLASS, CANVAS SCALE,
INTERIORS -- and ALL ELEVEN VERIFIED to fail identically on pristine origin/main with
none of my changes present. Other lanes' reds, not inherited silently.

=== DEPLOY, HONESTLY ===
Pushed to main at 4f5b9b4. The Pages build for that SHA was IN PROGRESS at last check
and the Actions API then served a frozen snapshot for 15 minutes, so I could NOT confirm
it concluded. Outbound fetch to github.io is blocked from this container. The stamp to
look for is BUILD 8/3f. If a later SHA carries it, that is the run to wait on.

=== WHAT IS PENDING PAOLO ===
  1. THE FIVE DIFFICULTY NUMBERS: 1.00/1.12/1.26/1.42/1.60. Mechanism mine, numbers his.
  2. SHOULD ENEMIES EVER SHOOT FIRST? He was right that he always gets the opening turn.
  3. THE GRENADE MINI-GAME. He said "potentially" -- not a ruling, so not built.

=== STILL OPEN IN THIS LANE (his T4 list, not yet built) ===
  * HP AS PORTRAIT DAMAGE STATES: a visual change on the bottom-right face per 10% lost.
  * STAMINA AS FLUID: he named Warcraft/Diablo globes. Research + incorporate into the
    action area.
  * Swapping in the new character models/hairstyles/clothing -- ANOTHER SESSION'S SYSTEM.
    Needs a handoff, not a raid (ONE SYSTEM, ONE SESSION).
  * The two-storey rebuild's other half: standing ON the deck, the lot should recede.
    Needs a renderer reorder (the lot draws at four points, some after the deck).
  * Jumping off the deck -- a verb he named, never ruled on.
  * A third distinct death fall and a purpose-cut execution beat
    (records/BOHEMIA_COMBAT_ANIM_REQUESTS_3_8_1_26.txt).

RECORDS: records/BOHEMIA_COMBAT_WHY_IT_IS_EASY_MEASURED_8_3_26.md
         records/BOHEMIA_COMBAT_RUN_IS_ONE_BUTTON_8_3_26.md
TOOLS (replay in order after any rebase, both idempotent):
         tools/bohemia_combat_occupancy_and_threat_patch.py   (v121)
         tools/bohemia_combat_run_button_patch.py             (v122)

LAB (lab-e2r7sv): 8/3 (a) LATEST -- MACHINE PARTY IS A NAMED VISUAL REFERENCE NOW,
AND THIRTY RULINGS HE ALREADY GAVE ARE FINALLY ON DISK.

=== HE ASKED FOR THE MACHINE PARTY LOOK (records/BOHEMIA_RESEARCH_MACHINE_PARTY_8_3_26.md) ===
"I really want my game to look more like that very good." Four rounds of research.
THE THING THAT HAD TO BE SAID FIRST: Machine Party is low-poly 3D built in Blender and
Bohemia is pixel art at 45 degrees, so the geometry is not available. Six of the eight
findings are resolution-independent anyway, and one of them is the answer to the freeze:
  * NO PAINT. Klubnika's own rule -- every object designed by a fictional engineer who
    did not care how it looked. Sharp angles, bare minimum, brutalism as the reference.
  * THE GRIME IS ONE PASS OVER EVERYTHING, AFTER THE FACT. He painted dirty leaks into
    every corner of every texture in Buckshot Roulette and it "blends the entire thing
    together rather than having different objects." He does not even UV unwrap properly
    and nobody notices, because the grunge covers it. THAT IS THE ANSWER TO "THE WORLD
    DOES NOT LOOK CONSISTENT" -- it is not a higher bar per tile, it is one pass across
    the whole bank.
  * FIVE-COLOUR WARM-DEAD RAMP, NO COOL COLOUR. Dark is the default, lit is the exception.
    Which is CLUSTERED POWER + LIGHT = TERRITORY already in law and not yet in the render.
  * STEPPED, HELD ANIMATION reading as stop-motion. We already own the grid for it: 120 BPM.
  * THE MENACE IS IN WHAT THE OBJECT IS FOR. An emotionless machine with no failsafe.
    Corroborates TRAUMATIC NOT GORY from a second direction.
NOT TRANSFERABLE: the geometry, the camera, computed lighting, fog. And ONE DELIBERATE
DIVERGENCE: he let a gameplay-critical item go hard to read to protect the mood; we take
his palette discipline and REFUSE that trade, because SUN MODE exists.
HONEST LIMIT: every primary page 403'd through the proxy (Steam, his own site, all four
interviews, lospec, every review). It is DOC_ONLY, the quotes are close paraphrase, and
I never saw the game move. Said so at length in the record.

=== LAW: laws/BOHEMIA_ADDENDUM_NO_PAINT_8_3_26.md, 7 clauses, LOCKED ===
It does NOT lift the art freeze and it authorises no pixel. It contains ZERO hex colour
values on purpose -- the palette is his and always was. Gate: gates/no_paint_gate.js,
42 checks, and its load-bearing one is the DERIVATIVE sweep: any file that cites this law
and then defines a palette off it, or declares the freeze over, fails the build. A named
reference plus a written brief is exactly the document shape that reads like a green light
for the art lane, and it is the opposite of one.

=== THE DEBT I CLEARED (records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md) ===
He answered 12 questions plus 5 follow-ups on 8/1-8/2 saying "Don't do anything yet I'm
still answering your questions" -- and I kept obeying that AFTER he finished, so thirty
rulings lived only in a context window for two days. "Don't do anything" meant don't
build. It never meant don't write it down. All thirty are on disk now. The big ones:
  R3  rest is a VISIBLE FAST-FORWARD, never a fade to black (and R4: events interrupt it)
  R7  sleeping / chilling / hanging out are ONE thing with ONE set of benefits
  R8  ONE UNIVERSAL CLOCK ("Are you stupid?")
  R9  fast travel unlocks by HAVING WALKED the district
  R10 encumbrance is a SLOWDOWN, never a wall (rides the action-cost shape for free)
  R12 NO SAVE SCUMMING: checks are BINARY, you can or you cannot. R13: faction is a valid key
  R14/R15/R16 main quests unrefusable; side quests give VARIATIONS not rejection; clear off the phone
  R17 the mercy/brutality ledger is SILENT -- record it, show nobody, decide later
  R20/R21 witness plumbing on ALL NPCs, and STORIES SPREAD LIKE A PLAGUE with NPC memory
  R24 GEAR STORED AT THE FAMILY HOUSE CARRIES across generations
  R25 no inherited perks, a boosted start instead. R26: the camp upgrades across acts
  R28 the whole dynasty layer derives from REALISM -- "what realistically happens 40 years after"
TWO APPARENT CONTRADICTIONS RESOLVED IN WRITING so nobody "fixes" them: ONE CLOCK, TWO
METERS (the camp meter is a meter, not a clock), and "how does neglect bite without
upkeep" -> IT DOESN'T, YOU JUST STILL HAVE THE SHITTY CAMP.
Gate: gates/rulings_gate.js, 50 checks, incl. two STRUCTURAL sweeps -- no percentage
social check anywhere, and no morality value drawn for the player.

=== THE BUG I WROTE AND CAUGHT (ninth instance) ===
rulings_gate's first draft matched any `karma: 0` and instantly red-flagged
engine/bohemia_engine.js -- which is the dynasty save's SILENT karma counter feeding the
monument form, i.e. exactly what R17 ASKS FOR. Another lane's correct work, nearly failed
by my gate, the same way ten_years_cold_gate falsely failed bohemia_purse.js. A check that
hunts a WORD instead of a THING. The ban is DISPLAY only. Every pattern in both new gates
was mutation-tested in both directions.

=== 25 NEW SETTLED ROWS ===
records/BOHEMIA_ANSWERED_QUESTIONS_INDEX.md is at 49 settled questions (was 24). Ask him
about the clock, fast travel, encumbrance, save scumming, refusing a quest, a morality
meter, inherited perks, neglect, or whether to go 3D, and answered_gate.py fails the build.

=== NOT DONE / THE QUEUE ===
1. R21 IS THE TOP LAB ITEM: research how games model rumour spread + NPC memory. He asked
   for it explicitly ("do some online research on how games have previously done that").
   FNV's two-counter reputation and RDR2's witness system are already studied and both
   feed straight in.
2. R30 "let's look into it" -- the legacy-roguelite family. The transcription was garbled
   and I am NOT guessing at a title. R29 (Rogue Fable) is NOT live permission: that
   direction was KILLED 8/1 and GRAVEYARD IS FINAL.
3. Canon-contradiction auditing across the 275 indexed files. Two real ones found so far
   (upkeep vs no-economy, both places). No verdict needed to keep going.
4. DID NOT TOUCH #buildstamp. This ship is laws/records/gates only -- nothing to look at,
   and the alpha is the ART/RUN lanes' file today. Bumping it would tell him there is
   something new on the surface when there is not.

PEOPLE (7h9sfy): 8/2 (f) LATEST — *** EVERY GATE IN THIS LANE IS GREEN ABOUT A PAGE THE
ALPHA NEVER SHOWS. READ THIS BEFORE YOU BUILD ANYTHING HERE. ***
Record: records/BOHEMIA_HE_WAS_NEVER_ON_MY_SURFACE_8_2_26.md

He said "I couldn't find them". Two things came out of that. One is what he asked for
and it is fixed. The other is why he found nobody, and it is worse than what he noticed.

=== 1. THE RUN TAB OPENED IN THE CITY BUILDER (FIXED) ===
"can you make sure when I press the run tab it just starts me off where I should start
off exactly where I should and not in city mode. I'd rather start off in human mode."
MEASURED FIRST, before touching anything: visible panel p-city, MODE='city', HUD read
CITY MODE, player at hx=0,hy=0 - never placed at all in a 12288x12288 world.
Calling the app's own swapMode() at boot was NOT ENOUGH: it came up human and flipped
straight back. Logging every message the frame receives gave
["BOHEMIA_CITY_PLAYER","BOHEMIA_CITY_PLAYER","BOHEMIA_GOTO_CELL"] and GOTO_CELL's
handler ended in an unconditional MODE='city'. THAT LINE WAS RIGHT WHEN IT WAS WRITTEN -
Paolo 7/28 "I want that reflected when I'm in the city menu", back when RUN and CITY were
two separate tabs - and wrong now that THE RUN TAB IS THE CITY FRAME, because the alpha
fires cityGoToRunCell() on city-tab open. His ruling was about the MARKER, never the mode.
NOW: HUMAN MODE, SUBURB, ON FOOT, at (6205,6271). City view still one tap away, zoom seam
still reaches it. swapMode already lands him on a road (NO DISTRICT IS A PRISON, 8/1) and
already uses WORKING_DISTRICT, so nothing was reimplemented.
tools/bohemia_human_start.py · gate human_start_gate.js, 9 claims. Mutations: the original
city boot fails 5 of 9; keeping the boot fix but letting GOTO_CELL flip it back fails 3.

=== 2. *** THE ONE THAT MATTERS: THIS LANE HAS BEEN BUILDING ON A HIDDEN PAGE. *** ===
The alpha routes the RUN tab to the CITY panel:
    PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p
#p-run (BOHEMIA_RUN_CURRENT.html) is display:none THE WHOLE TIME. The alpha's own source
says so in a comment. And that file is where ALL of this lane lives: the identity card,
the one contextual button, asking a name, the name over their head, and the neighbour I
put outside his front door.
COUNTED IN THE CITY FRAME, the surface he actually taps:
    references to the population module ... 16
    "TALK TO" .......................... 0
    identity card / ask a name ......... 0
So there are people walking around on his surface and NO WAY TO SPEAK TO ANY OF THEM.

*** THIS IS OUR OWN LAW CATCHING US. *** VERIFY ON THE REAL SURFACE (7/18): "art is
verified ONLY on the surface Paolo sees - a side-door probe is a lie." Every gate this
lane owns opens BOHEMIA_RUN_CURRENT.html DIRECTLY, AS A FILE. All 152 of them are green
about a page the alpha never shows. They were not lying about the code; they were
answering a question about the wrong door.
IF YOU WRITE A GATE IN THIS LANE, DRIVE THE ALPHA AND TAP THE TAB. human_start_gate.js is
the pattern.

WHAT IT WOULD TAKE: porting the conversation surface - the one verb, the dialogue sheet,
the card, the ask, the name over the head, the porch neighbour - onto the city frame. The
population module is ALREADY SHARED, so the people are already the same people; what is
missing is the talking. [PENDING PAOLO: it is the CITY lane's file and about a day of
work. Do not move it unasked.]

ART (f3eu53): 8/2 (LATEST) — THE BRICK THROUGH THE MIDDLE OF THE GATE, AND ALL 18 LIVE.

=== HE RULED TWICE IN ONE DAY (records/BOHEMIA_VERDICT_PERIMETER_8_2_26.txt) ===
ROUND 1: all 13 of his own 7/14 border walls DOWN (swap settled, they are out of the
payload). Of my 18: 11 up, 7 down, all three gate cards down while SAYING the gate
looks decent. "Looks like it's glitching out."
ROUND 2, with a circled screenshot: "to be Frank, I liked all of them. I'm just very
confused ... why is there a middle brick part of it". TWO RULINGS: all 18 are live, and
the brick band is a real bug.

=== BUG 1: THE 44px STAMP (round 1) ===
One face tile per design, repeated forever, so the single crack baked into it landed on
EVERY cell in the same place. A hard mark on a perfect grid reads as a rendering fault.
THE METRIC WAS BLIND: kept averaged edge 18.31, killed 15.98 — nearly identical, both
deep in tolerance. A density ruler cannot see STRUCTURE and cannot see what a tile does
when the wall is fifty of them long. Why those seven: coursed materials (slump,
split-face) outrank the stamp; FLAT ones (stucco, precast) have nothing else to look at.
FIX: 8 face + 8 base variants per design shuffled by a 2D cell hash, one face in four
allowed damage, and stucco finally gets the "over block" half of "stucco over block".

=== BUG 2: THE BRICK THROUGH THE GATE (round 2, and he was right) ===
Every gate overlay leaves its TOP ROWS transparent so the wall's coping shows through
above the opening — correct, that is the lintel. But the perimeter is TWO CELLS THICK
where it runs east-west and the same overlay was drawn on BOTH, so the lower one's
transparent band showed a course of brick across the gate's waist, plus two thresholds
and two head shadows. A tall opening is a TOP and a BOTTOM, never one piece twice —
the same split the garage bay has always used. 24 overlays now (2 kinds x 3 vertical x
4 horizontal); the pickets run through the cell join as ONE leaf.

=== WHAT THE RULER LEARNED, TWICE ===
The new "no second threshold" check first flagged every OPEN top piece, because an open
gate is SUPPOSED to brighten downward: that is the ground beyond receding into daylight.
A threshold is not a LEVEL, it is a STEP. Measuring the jump instead of the level tells
them apart. A checker that cannot tell a feature from a defect is the broken one.
Also: a judging surface that arranges art in a way the game never produces is not a
judging surface. My round-1 gate card stacked the barred leaf over the open mouth in one
strip and collected three thumbs down for a defect I invented.

=== GATED ===
gates/perimeter_gate.py, 106 checks. Holds both bugs as regressions: every design is a
POOL not a tile, most faces carry no damage, the flat materials carry ghost coursing, a
lower gate course has NO transparent coping band, a top course has NO second threshold,
and the run picks its vertical piece from its neighbours.

=== MACHINE PARTY RESEARCH (8/3), HIS ASK ===
records/BOHEMIA_REFERENCE_MACHINE_PARTY_8_3_26.md. Mike Klubnika + GDeavid, out 30 July
2026, Very Positive. THE ONE FINDING THAT MATTERS TO THIS LANE, in Klubnika's own words
about texturing Buckshot Roulette: he "added dirty and grimy leaks to every corner, which
BLENDS EVERYTHING TOGETHER rather than having different objects."
That is a direct answer to Paolo's own 7/31 complaint, "two different games in one frame."
Bohemia textures every tile INDEPENDENTLY to a density target - each individually correct,
nothing crossing a seam. Klubnika lays ONE filth pass over everything, indifferent to
object boundaries, and it is the dirt rather than the palette that makes a room read as
one place. Three perfectly textured surfaces that share nothing are three assets.
SECOND FINDING, and it confirms this lane's ruler from the other side: he PHOTOGRAPHS his
own textures (mainly electronics) and urban-explores real factories. Photographic surfaces
are uncorrelated at the finest scale, which is exactly why the cook needed a per-pixel
independent term to reach his bought tiles' edge 18.4 at all. Paolo loving Klubnika and
Paolo buying that tile library are the same taste pointing at the same physical property.
ALL OF IT IS [PENDING PAOLO]. Nothing was built off it.

=== THE QUEUE ===
0. THE GRIME PASS, if he wants it: one dirt layer that crosses tile boundaries instead of
   per-tile perfection. Would be the biggest single change to how the block reads. DO NOT
   BUILD UNASKED - it touches every surface in the game.
1. HIS BOUGHT YARD HAS THE SAME REPEAT PROBLEM, same frame as the wall
   (records/target/PERIMETER_WALL_LIVE.png): only 5 dirt tiles across the whole yard and
   each carries a big starburst weed, so a weed lands on nearly every cell. His pixels
   are his — PLACEMENT is clause 4 and 5 tiles is too few for the biggest surface on the
   block. NOT SURFACED TO HIM UNASKED.
2. Features on ground ~5.5% vs his 7.0%; his cracks still crisper.
3. Art cell 44 -> 88 px. Would fix (2) outright.
4. Gated and estate communities render with the block art for the first time.

=== STILL RED ON MAIN, STILL NOT MINE ===
LIFE / DRESS / POPULATION / MEMORY / DEVIATION — zero agents simmed. PARTS PAINTED +
BODY VARIATION are CHARACTER's. BOTTOM-LEFT + CANVAS SCALE verified failing on clean main.

--------------------------------------------------------------------------------

SFX (sound-xk7pjp): 8/2 (o) LATEST - THE THREE SILENT FAMILIES NOW MAKE A SOUND.
Build 8/2o. Tabs: RUN (pickup, phone buzz) and COMBAT (block).

He thumbed 8 sounds UP on 7/30 that NOTHING IN THE GAME COULD PLAY. pickup (5),
phone_buzz (2) and block (1) had no call site anywhere, for a week, while this
lane's own law is APPROVED-BUT-UNUSED IS A DEFECT. All three have a real moment
now and none of the moments was invented for the sound:
  BLOCK       the shot your cover ATE. Combat has always rolled every incoming
              round against your cover and scored a cover save; it already drew
              a spark. It just never made a noise. Rate-guarded to one per
              volley, and it sits on the FIRST line of fxCoverSave, ahead of the
              JUICE.R return, so a visual toggle can never mute it.
  PICKUP      the one thing the room is holding, under your feet, offered as EAT
              WHAT YOU FOUND. *** THE ONE JUDGEMENT CALL IN THIS SHIP: there is
              no inventory anywhere in the run or the loop engine, so this is
              the closest real take-the-thing action rather than a literal bag.
              If Paolo says no, delete the one sfx('pickup') line. ***
  PHONE BUZZ  a post landing on your feed when the phone comes out. Guarded on
              feed.length: a buzz announcing an empty feed is a lie he can hear.

TWO GATE ASSERTIONS OF MINE WERE WRONG AND WERE FIXED, NOT WORKED AROUND:
1. sfx_wired_gate asserted combat must NEVER wire a block, on my own 7/31 claim
   that "this demo has no block mechanic". False. The cover roll was always
   there. A guess of mine hardened into law would have kept his sound silent
   forever. FIX THE RULER, NOT THE TARGET.
2. music_gate demanded NEW_VIBES be non-empty. That broke the first time Paolo
   caught up and judged everything in one day: after the last verdict the honest
   value IS empty. It now allows empty and instead checks the thing that
   actually matters, that no cooked song is hidden from him.

*** AND CHECK 2 IMMEDIATELY FOUND NINE REAL SONGS IN THAT STATE. *** Batch 20
cooked them, they carry his categories so he has seen them, he has never thumbed
them either way, and they stopped being badged NEW the moment batch 21 replaced
NEW_VIBES. They are NAMED in music_gate as a closed waiver (nothing new may join
them) and they are in front of him to rule on. They were NOT buried: nine songs
is his call, not a gate fix.

MUSIC, same turn: batch 23 was judged 0 of 2 and both are graveyarded. The
PITCH-STABILITY theory it was built on is DEAD and recorded as dead. That is two
of my theories killed in one day, and the honest lesson in the graveyard is to
stop reverse-engineering his silent kills and start from the one sentence he
actually wrote. NEW_VIBES is empty. Two song slots stay open on purpose.
RUN (run-eak241): 8/3 (d) LATEST -- EAST AND WEST FACING DOORS, THE ONES HE MADE 7/10.
Ship: BUILD 8/3d. Tab: RUN.

"I never saw your eastern west facing doors, bro what's up with that?" HE WAS RIGHT AND
I CLOSED HIS TICKET WRONG. On 8/2 I measured banks/BOHEMIA_DOOR_EW_BANK, found 7px of
paint at the west/east edge of each 44x44 tile, concluded they were door JAMBS for the
tile next door, shipped them as a bleed into the neighbouring cell (which he HAD asked
for separately on 8/2, in those words) and ticked the E/W door item off.
THE PIXELS WERE MEASURED RIGHT. THE JOB WAS READ WRONG. I never rendered the tiles and
looked, which settles it in thirty seconds: the first tile is a BROWN DOOR LEAF, SWUNG
OPEN, SEEN EDGE-ON. The rest are stone doorway arches, also edge-on. They are doors on
walls that face east/west, drawn the only way a fixed 3/4 camera can draw one.
THE GAP THAT LEFT (24-agent sweep, confirmed):
    324 house cells approach from the SOUTH ->  81 doors
    368 approach from the EAST
    336 approach from the WEST              ->   0 doors
Side approaches outnumber south 2.2 to 1 and every one was blank wall. The 8/3c door
pass only reads the cell BELOW, so it did nothing for them either.
FIX: same rule as the south door (ground a person can stand on, one per contiguous
VERTICAL run, topmost tile takes it), flagged as c.doorW/c.doorE, drawn by ewDoorPass as
an OVERLAY on the mass edge -- NOT a third facade face, because c.face tests the cell
below in all three places it is set and that is CORRECT for this camera (you do not see
a side face in 3/4). That is exactly why his art is a 7px sliver.
ZERO NEW BYTES: reuses the JAMB_WI/JAMB_EI arrays already embedded for the 8/2 bleed.
Same 368 strips, same bank, two jobs.
COVERAGE: commercial 11/22 -> 22/22, farm 10/10. Overall 39% -> 54%. EVERY DOOR floor
raised 35 -> 50. GATES: E/W DOOR 6/0 (side doors flagged, counted by massHasDoor so the
wall beside them SEALS, none unreachable, and they DRAW on the real canvas), EVERY DOOR
5/0. Rendered and looked at before shipping.
SUBURB IS THE WHOLE REMAINING RESIDUAL: 34 of 42 masses, all on the suburb's OWN path
(m.sub), whose rule only puts a door where the house meets DRIVEWAY or STREET. Houses
whose frontage is dead-ground backyard get none. A back door onto a walkable yard IS
reachable. THAT IS THE NEXT MOVE.

RUN (run-eak241): 8/3 (c) LATEST -- BUILDINGS HAVE DOORS NOW, AND A DOOR IS THE WAY IN.
Ship: BUILD 8/3c. Tab: RUN. LAW: laws/BOHEMIA_LAW_MEASURE_THE_THING_HE_NAMED_8_3_26.md
(he asked for laws every other session must follow; that file is it, READ IT).

"WY IS IT WHEN IM IN THE OUTSIDE OF A BUILDING I CAN ENTER IT FROM JUST WALKING TO ANY
WALL." The 8/2 pass shipped the SAFE HALF (a mass WITH a door can only be entered through
it; a mass with NO door left alone so nothing seals shut). Measured on the real surface:
    suburb  42 masses / 8 doors   commercial 22 / 0   farm 10 / 0
    TOTAL   74 masses, 8 with a door, 66 WITH NO DOOR = the rule covered 11%
The blocker was never the rule. BUILDINGS HAD NO DOORS. The generic kit path never
placed one, on purpose (7/27: "the portals are the doors") -- which only holds if every
mass has a portal, and most do not.
FIX, and it is the suburb's own rule with the suburb-specific codes taken out:
  A DOOR GOES WHERE AN ENTERABLE BUILDING MEETS GROUND A PERSON CAN STAND ON, one per
  contiguous run of that frontage, and nowhere else.
Never hashed. Read off the plot the generator already made, so every door is reachable
BY CONSTRUCTION. entry.enter gates which masses qualify, so a FENCE never gets a front
door (fences live on the same branch -- that is why wallH=2 is there).
AFTER: 74 masses, 29 with a door. farm 10/10, commercial 11/22, suburb unchanged 8/42.
89% permeable -> 61%.
SUBURB IS THE RESIDUAL AND IT IS THE NEXT MOVE: its own rule only puts a door where the
house meets DRIVEWAY or STREET, so 34 of 42 masses whose frontage is dead-ground backyard
get none. A back door onto a walkable yard IS reachable. Extending that needs mass
knowledge at generation time, so it was not bolted on late in a long session.
GATE: gates/everydoor_gate.js (EVERY DOOR), a RATCHET on real coverage measured in a
browser. Floor 35% (reading 39%), was 11%. Also asserts a minimum mass count so coverage
can never be won by DELETING buildings. Prints the permeable residual every run.
No lockouts: DOORWAY 5/0, FRONT DOOR 4/0, STEP INSIDE 8/0, DOOR JAMB 15/0.

WATCH OUT, IT COST ME AN HOUR: this container's checkout was silently REWOUND to an older
main (a0e51e8) mid-session while my commits sat safely on origin/main. Markers vanished
from the blob, gate files "disappeared". If something you shipped seems to have evaporated,
check `git rev-parse HEAD` against `git rev-parse origin/main` BEFORE believing it.

RUN (run-eak241): 8/3 (b) -- AND THE ONE THING I STOPPED ON.
NOT SHIPPED, ON PURPOSE: the interior surfaces. Read
records/BOHEMIA_THE_INTERIOR_ART_EXISTS_8_3_26.md before touching interiors.

TWO OF HIS LIST ITEMS WERE NEVER BLOCKED. "why is the inside of the house using
concrete tiles" and "the interior walls are the same as the exterior walls" were
both carried as [BLOCKED: no interior art in any bank]. Measured:
banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt holds 48 floors, 48 walls, 16 windows and
24 dirt floors at 48x48, bucketed by room function on 7/26 out of his PURCHASED HD
repo. 0 of them reach the alpha. They DO ship -- into slices/BOHEMIA_RUN_CURRENT.html,
with roomFloor()/ROLE_FLOOR/propAt written and gated -- but ONE WORLD TAB (8/2) says
the RUN tab shows the CITY FRAME, so the work was done once in a window he never
opens. Seventh approved-but-unused this month.
WHAT THE CITY FRAME DRAWS: inFloorPool() returns 'side' for every role but six, and
'side' IS the harmonized outdoor STREET SIDEWALK pool -- so a living room, a kitchen,
two bedrooms and a bathroom all render on cracked outdoor sidewalk with weeds in it.
Walls are 'hwall', the exterior stucco, deliberately.
THE MECHANISM IS BUILT AND WORKS: tools/bohemia_city_interior_surfaces_patch.py.
One floor per room, one wall material per building (the first cut rolled per CELL and
came out a patchwork of brick/chainlink/scrap -- caught only by rendering and looking),
plain floor for any role nobody wrote a rule for, and every tile CROPPED to 44x44 so it
blits 1:1 (48->44 is a 0.917 resample the MOBILE RENDER CONTRACT bans). 163 of his
tiles measured drawing in one real interior frame.
I STOPPED THERE. Version 2 renders a coherent room and it reads as an INDUSTRIAL
BUNKER, not a suburban Vegas house. That may be right for a dead world; it may be
badly wrong for the house he spawns beside. Not mine to rule (MECHANISM-MINE /
CONTENTS-PAOLO'S), and the 8/2 diagnosis wrote the warning in advance: "changing
sidewalk concrete to dungeon cobblestone is a different wrong answer."
THE PATCH IS NOT APPLIED TO THE ALPHA. Tool committed, finding recorded, build clean.
[PENDING PAOLO] WHICH OF HIS OWN PACKS IS A VEGAS HOUSE MADE OF INSIDE? The pack
names and counts are listed at the bottom of the record. When he rules: run the tool,
narrow IN_ROLE_FLOOR and the wall bucket to what he named, render, LOOK, gate it.
DO NOT re-cook interior art -- 465 of his tiles already exist. DO NOT guess the look;
it was guessed once and stopped.

RUN (run-eak241): 8/3 (b) LATEST -- YOU WALK THROUGH THE DOORWAY, NOT INTO IT.
Ship: BUILD 8/3b. Tab: RUN (walk up to a house and go in).

Paolo: "WHY WHEN I ENTER A HOUSE I CANT GO LEFT AND RIGHT."
The 8/2 record closed this as "there is no missing left/right", measured by
FLOOD-FILLING inPassable from the landing cell. That flood fill is honest and still
true, and it is the WRONG INSTRUMENT: it says which cells are reachable in principle
and never presses a direction. Drive the real stepOnce in a real browser and:
    you land on            the DOOR cell itself, every time
    works there            N, NE, NW
    BLOCKED there          E, SE, S, SW, W
    turn left/right on landing   0 of 6 houses
    ... one cell further in      6 of 6 houses
He is standing IN THE OPENING with a jamb either side. Not a movement bug, not a
camera bug -- both were investigated first and both are fine (at HC=44 renderInside
takes the FOLLOW branch, and three steps changed 70.2% of the screen; the 8/2 camera
theory does not apply at the shipped default zoom).
FIX: entry steps ONE cell inward off the door along that edge's inward normal, if
walkable. One cell deliberately, not "until you can turn" -- a one-wide hall is real
architecture. The door is one step back, so leaving is unchanged.
GATE: gates/stepinside_gate.js (STEP INSIDE) PRESSES the directions instead of
inferring them. 8/0.
NOT FIXED, do not mistake it: the working district has only 6 door cells in the whole
thing (records/BOHEMIA_BUILDINGS_HAVE_NO_DOORS_8_2_26.md). Every house you CAN enter
now behaves; there are not many.

THE SAME MISTAKE THREE TIMES IN ONE DAY, all three now recorded:
  a counted drawImage is not a visible door   (the side door)
  a page that loads is not a world that runs  (the suburb kit binding)
  a reachable cell is not a pressed direction (this one)
When he says a button does nothing, PRESS THE BUTTON.

RUN (run-eak241): 8/3 (a) LATEST -- THE SIDE DOOR YOU CAN SEE, D1 ACROSS ALL 36
DISTRICTS, AND A BUG THAT WOULD HAVE SHIPPED A SUBURB THAT DOES NOT LOAD.
Ship: BUILD 8/3a - THE SIDE DOOR YOU CAN SEE + NEVER ON THE SIDEWALK. Tab: RUN.

WHAT LANDED
- THE DOOR STICKS OUT (Paolo 8/2), CORRECTED after "id dint see the side door".
  His jamb art is painted on the EDGE of its own 44px tile (W = opaque cols 0..6,
  E = cols 37..43, measured on all 184 doors, zero variation). v1 had TWO bugs:
  it shifted the tile a whole CELL (paint lands on the neighbour's FAR edge, 37px
  of blank wall from the door), and facadePass walks gx ascending so the cell to
  the door's right buried the east jamb every time. Now: offset by the STRIP width
  (7px scaled C/44), and jambs queue and flush at the END of each ROW.
  doorjamb_gate no longer counts drawImage calls -- it renders with and without the
  jambs and DIFFS the 7px band either side, plus a control band two cells out that
  must NOT change. Verified by eye at 6x on the real canvas.
  WIDTH IS STILL HIS TO JUDGE. It is one number, JAMB_PX.
- D1 SWEPT THE WHOLE REGISTRY. layWalks() was PRIVATE inside bohemia_suburb.js --
  that address, not any design decision, is why "never on the sidewalk" was true in
  1 district of 40. Promoted to the kit with streetCodes/canPlaceMass/D1_EXEMPT.
  PROVED IT MOVES NOTHING: 36 suburb blocks, 589,824 cells, identical md5.
  A public street is DECLARED (street:true), never guessed -- the suburb's road has
  it, its driveway apron deliberately does not, which is what keeps 1,928 legal
  garage-to-apron touches legal. gates/d1_kerb_gate.js sweeps 36 non-exempt
  districts: 0 mass on the kerb, 0 bare frontage, 46 green.
  RATCHET: six districts (library 23514, courthouse 14382, cityhall 13266,
  commercial 834, downtown 108, chapel 60) write mass over their own walk code and
  always have. All six are ONE legend code doing double duty -- the public walk AND
  the plinth the building stands on, their own act1 text saying both. Ceilings can
  only go DOWN, list is CLOSED (gate fails on a 7th or on any raise).
  [PENDING PAOLO] one word -- SIDEWALK or PLINTH -- clears all six.
- THE SUBURB NEVER HAD THE KIT. The D1 fix was the first line in that module's
  history to reach for the kit at generate time, and it took 32 GATES RED AT ONCE
  while the alpha still booted with ZERO page errors. The CITY blob inlines the
  suburb at line 2950 and the kit at 3335 -- the ONE district of 39 that loads
  BEFORE the kit, so its load-time capture of K froze as undefined forever.
  Measured in the running app: BohemiaDistrictKit.types() = 35 districts and
  'suburb' is NOT one of them; K.register('suburb') has never run in the CITY app.
  The 7/26 comment above that binding says making it register was the whole point.
  FIX: K() resolves at CALL time. Registration behaviour deliberately UNCHANGED --
  newly registering Paolo's spawn district is a measured change, not a side effect.
  GATE: gates/city_kit_binding_gate.js. A BLOB THAT PARSES IS NOT A BLOB THAT RUNS.
- FIVE DERIVED FILES INLINE THE ENGINE and all five staled at once: the phone slice,
  the run slice, the MAP tab embed, the quest judge page, the integration probe's
  slice. Rebuilt. A derived artifact is not derived until you re-derive it.
- FOUR GATES SWALLOWED A MISSING RUN TAB (`if (t) t.click()`), the exact bug
  one_world_tab_gate bans. All four throw now. 103/3 -> 108/0.

SUITE STATE, MEASURED NOT GUESSED: 10 red, and ALL TEN are identically red on
8e193ba (main at session start). RIG CHECK 141/2 (MUSIC lane tools) · PARTS PAINTED
21/1 · BODY VARIATION 40/1 · LIFE 21/3 · DRESS 42/1 · POPULATION 5/3 · MEMORY 7/2 ·
DEVIATION crash · WALL CLASS 22/2 · INTERIORS 39/1.
LIFE + DRESS + POPULATION + MEMORY ARE ONE BUG: all four trace to "0 agents simmed";
DRESS and MEMORY only fail because there is nobody to dress or to witness. Whoever
takes the LIFE lane fixes agent spawn and watches three go green behind it.
THE CROWD is FLAKY not broken: three runs on untouched main gave 16/0, 16/0, 15/1.
Method + numbers: records/BOHEMIA_SUITE_BASELINE_8_3_26.md (git worktree at the sha
you branched from, run the red gate there -- same counts means it was not you).

STILL OPEN ON PAOLO'S LIST (RUN lane)
- windows consistent with what is outside (one-world interiors step 6)
- interior wall + floor materials: BLOCKED, no interior wall/floor art in any bank
- one-world interiors steps 2-6
- 33 districts still have NO sidewalk to build off. The primitive exists for them
  now; each district's lane opts in with a legend row + palette row + street:true,
  then re-runs walkable_gate and its drive-network gate. A BLANKET road->walk carve
  is BANNED: measured, it drops trailer driveNetworkReach 0.9773 -> 0.4256.
- LAYOUT, not plumbing (MAP LAW): mall ring road on top of both anchors (4,344
  kerb cells), trailer lot stride sits on its own entrance spine (1,984).
- [PENDING PAOLO] is a private aisle / truck court / parking field "a street a
  person walks beside"? 23,256 storage cells + 8,070 industrial + 7,968 solar +
  6,452 stadium + 3,432 campus + 2,568 ballpark + 2,448 landfill ride on it.
- "cant go left/right inside a house" MEASURED as a camera problem, not movement
  (records/BOHEMIA_INTERIOR_MOVEMENT_MEASURED_8_2_26.md). renderInside FITS the
  plate to the phone below a zoom threshold, so the body moves and the screen does
  not. At HC=44 a 13x12 house already falls through to the follow branch -- NEEDS
  RE-MEASURING ON THE REAL SURFACE before anyone changes that camera.

BATCH 23 SHIPPED THE SAME TURN (BUILD 8/2l): two fresh songs answer the two slots
batch 22's kills opened. Tab: MUSIC, they carry the NEW badge.
  NOBODY LOCKS UP ANYMORE     lead SPLINTERBELL  a bell whose overtones sit at
                              SEMITONES instead of physics ratios, so every note is
                              a chord of itself and always in tune with the song.
  WHAT THE METER STILL READS  lead ONEBREATH     the pitch never moves and the
                              ENVELOPE is the instrument: a singer running out of
                              air, sagging, catching a breath, giving out.
Both leads ARTICULATE on purpose. That is the pitch-stability hypothesis being put
on the board where he can kill it: if these two die too, the reading is wrong and
the graveyard says so.

MUSIC (sound-xk7pjp): 8/2 (k) LATEST - BATCH 22 JUDGED, AND HE SAID HE LIKED ONE.
Ship: BUILD 8/2k - THE MARKER ON THE DOOR IS CANON. Tab: MUSIC.

HE WROTE A SENTENCE, which he has not done once in this whole session:
  "The marker on the door at full intensity is now one of my new favorite songs
   that you've made great job"
Every other music verdict this run has been a silent thumb with no words. That
line is recorded VERBATIM in three places a future cook will actually look: the
graveyard entry, the embedded BOHEMIA_MUSIC_REPO block in the alpha, and the
note field of records/BOHEMIA_SONG_LOCK.json. Do not paraphrase it away.

THE SHEET
  A BELL FOR NOBODY'S SHIFT   DOWN    (lead saltpsalm)
  THE MARKER ON THE DOOR      CANON   (lead brokenrosary) -> OVERWORLD DAY
  COUNTING WHAT IS LEFT       DOWN    (lead tollhouse)
Batch 21 + 22 together: 3 survived, 4 died. MLOOPS is 132 songs.

WHAT IS IN THE MACHINE NOW
- tools/bohemia_music_verdicts_8_2b.py bakes it: canon to 2, downs to 0 AND
  OUT of MLOOPS (graveyard final means out of the working list; the graveyard
  gate counts a name still in MLOOPS as a live reference). MLOOPS is rebuilt
  from PARSED ENTRIES, never regex-surgery, because a stray comma makes an
  array hole twice today. music_gate.js EVALs the literal and counts holes.
- tools/bohemia_music_batch22.py had the two dead song literals DELETED, not
  commented out. A cook tool that can still emit a buried song is a remake
  waiting for a re-run. The three VOICES stay in the rack: song-dead-not-voices
  (7/20) keeps saltpsalm and tollhouse legal for future fashions.
- SONG LOCK re-locked ON PURPOSE, reason in the note.

THE HYPOTHESIS FOR WHOEVER COOKS MUSIC NEXT, and it is labelled as one
He gives no kill reasons, so none are invented. The observable split across all
seven judged songs: every survivor ARTICULATES a stable pitch you can follow;
every casualty is built on instability (no oscillator at all, a flutter slowing
to a stop, an interval sliding to unison, a sideband that moves with register).
That is the 7/18 kill reason restated - the melody must LEAD under the dread.
IT IS A CORRELATION ON SEVEN SONGS. This session already killed one of my own
theories (semitone adjacency) when a survivor and a casualty turned out to share
the same count, so say in your tool docstring which theory you built on.
NOT A HYPOTHESIS: brokenrosary at FULL INTENSITY is a thing he likes, in his own
words. That is the only positive target in the whole music record. Start there.

TWO DEAD SLOTS ARE OPEN and his standing law is that fresh cooks answer them.
NO REMAKES.

SOUND EFFECTS, same session, already shipped and green: the SFX are audible on
his phone (first-gesture unlock + navigator.audioSession='playback' for the ring
switch), combat hits/kills/shots are wired, footsteps are on their own quiet bus
at his ruled level, neighbours attenuate by distance with pan, ambience only
plays while the RUN tab is open, and window.setSFXVolume() is the single hook a
settings slider will drive - which is the part he actually asked for. Still
unwired for lack of a moment: pickup, block, phone_buzz.

STAMP SHAPE, inherited from the PEOPLE lane's note below and obeyed here: run_gate
wants LETTERS after the date, never a digit. 8/2k is legal, 8/2b2 is not.

PEOPLE (7h9sfy): 8/2 (e) LATEST — SOMEBODY TO ACTUALLY TALK TO. He asked for it in
these words: "can you just have one extra NPC chilling outside the spawn in the suburb
that I can just talk to and test out your mechanics?"
Record: records/BOHEMIA_SOMEBODY_TO_TALK_TO_8_2_26.md

DONE: walk out the front door and he is TWO TILES away. The button reads TALK TO THE
KEEPER. Tap it, ask his name, leave, and his name is over his head.

=== WHY HE HAD TO ASK, WHICH IS A MEASUREMENT AND NOT AN EXCUSE ===
The sim's roam() sends every idle body to a RANDOM TILE ANYWHERE ON A 128x128 BLOCK, so
the nearest person standing outdoors was routinely 99 TILES from the front door, and
often there was nobody in sight at all. Everything this lane has built - the one button,
the card, asking a name, the name over their head - was reachable only after a long walk
and a lot of luck. Measured both ways: fixture removed 99 tiles, fixture in 2 tiles.

=== HE IS A REAL RESIDENT, NOT A PROP ===
A prop would test nothing. Real seat in a real house, built by the agents module's own
makeAgent, so he resolves to an ordinary person: real trade, real household seat, real
card, a name you have to ask for. ONE flag is special: porch:true = walk to one spot and
stay there instead of roaming.
HE IS INSIDE MASS EDITS like everybody else - joins the roster BEFORE the person-facts
pass, so Paolo's 7/29 law reaches him. Verified: with the everyone-indoors rule he goes
indoors.

=== THREE OF HIS OWN LOCKED RULINGS SAID NO TO MY FIRST VERSION ===
Each caught by a gate, each a real break.
1. FIVE FAMILIES. A free seat in the nearest EMPTY house made him a household of one, so
   the block held five families instead of the four he ruled on 8/1 - and one of them was
   a man living alone, which is not what "four families" means in English.
   FIXED: he joins an EXISTING household. Four families hold at 3/3/3/2.
2. HE SURVIVED THE DIAL AT ZERO. Added unconditionally he was still standing there at
   dial 0, so the ghost valley was not a ghost valley and the bottom of his slider was a
   lie. FIXED: only added if the block already has residents. Dial 0 -> 0 bodies.
3. *** HE PLUGGED A WALKWAY, and this is the one to keep. *** A body that never moves
   PERMANENTLY REMOVES A CELL (occupancy law: one body per cell), so parking him on a
   driveway is not a decoration, it is a wall. At 15:00 three bodies sat stacked at
   (4,28)(4,29)(4,30) all wanting home, TWO OF THEM ORDINARY RESIDENTS QUEUED BEHIND HIM,
   and run_people_gate went red on "every body is indoors after the edit" - not because
   the edit missed anybody but because they could not walk.
   FIXED: he stands on OPEN GROUND. Most walkable neighbours wins, nearest breaks the
   tie, under four open sides is a corridor and not a place to loiter.
AND A FOURTH THING THE SURFACE SAID NO TO: placed adjacent to your own door, the one
contextual button prefers THE DOOR YOU ARE STANDING AT over the person beside you, so it
read GO INSIDE and the conversation was unreachable. He stands 2-5 tiles out.

IF YOU MOVE HIM, KEEP ALL FOUR: existing household, only when the block is populated,
open ground, and not adjacent to the player's own door.

=== AND A NOTE FOR EVERY LANE: THE BUILD STAMP HAS A SHAPE ===
run_gate checks /BUILD \d{1,2}\/\d{1,2}[a-z]*\s*[·-]\s*\S/ - date, then LETTERS only.
Main was carrying "BUILD 8/2b1", and a DIGIT after the date fails that pattern, so THE
RUN was red on main for it. I hit the same thing with 8/2b2 and fixed it to 8/2bc, which
turns THE RUN green again. If you are past 'z', go 'aa', 'ab' - never a number.

=== GATE ===
C4c nearest body on the street is 2 tiles away, not across the block.
C4d and he is standing on open ground, not plugging a walkway.
Mutations: no NPC -> C4c red at 99 tiles. Porch flag ignored so he roams -> C4c red at
99 tiles.
PEOPLE 150 -> 152. RUN PEOPLE 45, recovered from 43/2.

CITY (1eztay): 8/2 (an) LATEST — HOW BIG THE MAP IS, ANSWERED WITH A FLOOR, AND
THE ONE LINK WAS DEAD ON MAIN AGAIN (fixed, and it was also the dead COMBAT tab).

HOW BIG, on his ask ("before you cut anything"). Measured on the canon seed:
  96x96 districts · 9.22 km a side · 84.9 km2 · 151 million walkable cells
  built 37.0 km2 (43.6%) · roads 32.9 · desert 5.7 · rock+water 9.3 · ON FOOT 75.7
  Skyrim ~37 km2 · Fallout New Vegas ~16.5 km2
So the BUILT HALF ALONE is about all of Skyrim, and the walkable land is ~4.6 New
Vegases. Walking, read out of the shipped city frame (BEAT=500, one cell a beat,
0.75 m a cell = 1.5 m/s; run = two cells a beat): 1 h 42 m to walk one side,
2 h 25 m corner to corner. THE HONEST HALF IS IN THE RECORD: ours are GENERATED
km2, Skyrim's are hand-placed. Size was never the problem, FILLING is, and cutting
the map would make the true problem smaller without making it better.
Record: records/BOHEMIA_HOW_BIG_IS_THE_MAP_8_2_26.md

AND IT HAS A FLOOR NOW. valley_scale_gate pinned the per-CELL scale and nothing
pinned HOW MUCH LAND or HOW MUCH OF IT IS BUILT -- a lane could have turned built
districts back into desert with every gate in the repo green. gates/mapsize_gate.js
(suite: MAP SIZE, 13 claims) holds it. Shrinking to 64x64 fails 7 of 13 by name.

THE ONE LINK WAS DEAD ON MAIN, SECOND TIME TODAY. `<div id="front">` was never
closed before `<div id="app">`, so the whole game parsed as a CHILD of the splash;
the splash hides itself and takes everything with it. Black rectangle.
AND IT WAS THE COMBAT LANE'S URGENT ITEM TOO. 874cfe7 bisected a dead combat tab
to a CITY-lane commit and handed it over rather than raid the blob. They were
right, and it was not combat's bug: EVERY panel was 0x0. Same probe, same viewport:
    pristine main   combat 0x0      #app 0x0     parent front
    after the fix   combat 430x846  #app 430x900 parent BODY
Also relabelled the splash gate THE ONE LINK (two different gates were both called
FRONT DOOR, so "FRONT DOOR failed" named neither).

EARLIER THIS SESSION: DROP IN lands you on a street in the CITY FRAME (the surface
he actually plays -- the run slice is invisible), worst case 9,432 tiles -> 3; the
CITY tab deletion's own wreckage cleaned up (two more gates it broke, my sweep was
a BLOCKLIST and got spelled around twice); and the swallowed tab click banned in 18
files, which then caught two gates other lanes wrote AFTER the rule.

NOT MINE TO DECIDE, AND ONE OF THEM IS PARKED
- THE POPULATION NUMBER is PARKED BY PAOLO ("just worry about the coding and
  plumbing for now") - DO NOT RAISE IT. Recorded as plumbing debt in backlog 0AO.
- THE RUN SLICE: SHOW / MERGE / RETIRE. Real, tested, and invisible. Still open.

ART (f3eu53): 8/2 (f) LATEST — HIS VERDICT IS IN. THE WALL STOPPED GLITCHING.

PEOPLE (factions): 8/2 (e) LATEST — SIXTEEN FACTION DOSSIERS. HIS TOP BACKLOG ITEM,
CLOSED, AND THE ONE MECHANIC THIS LANE ALREADY BUILT NOW READS FIFTEEN DIFFERENT WAYS.
Record: records/BOHEMIA_FACTION_DOSSIERS_8_2_26.md + records/factions/ (16 files + index)
TAB: LIFE, top card, "THE FACTION DOSSIERS". Awaiting his thumbs.

=== HIS ORDER, AND WHY IT IS SIXTEEN AND NOT SEVEN ===
Paolo 7/31 lore sitting: "WE NEED TO REALLY FLESH THE FACTIONS OUT FR MAKE ALL OF THEM
AWESOME AND INTERESTING." He said ALL, so it is the whole canon roster rather than the
coordinator's shortlist: 13 selectable + the Karen community + the Amalgamation + the
four social forces as one card. CUSTOM HAS NO DOSSIER ON PURPOSE - canon says the
player's faction emerges from three generations of his own action, so writing it would
be writing his character for him. The gate asserts the absence AND a recorded reason.

=== EVERY CARD IS TWO BLOCKS, AND THE SPLIT IS THE DESIGN ===
GREY = already canon, no thumb, READ OUT OF engine/BOHEMIA_faction_graph.json at
generate time (align, act1/act3 power, relations, the graph's own note). Never typed by
hand, so a dossier cannot drift off canon, and the gate re-checks every line of it.
GOLD = my proposal, his thumb. He can see exactly what he is judging.

=== THE ROW THIS LANE ADDED, AND IT IS THE POINT ===
The ask-a-name machine shipped 7/31 off his ruling. Every dossier now answers WHAT
HAPPENS WHEN YOU ASK A STRANGER OF THIS FACTION THEIR NAME, and no two are the same:
  CARTEL   they know YOURS before you ask, you never get theirs (the mechanic backwards)
  NETWORK  freely given, unprompted, warmly, first meeting - AND THAT IS THE TELL
  TRADES   you get a job, not a name ("Sparks", "Water"); hire them twice and the real
           one arrives unprompted - earned with WORK instead of words
  KARENS   they ask your name AND WRITE IT DOWN. Being asked is the threat
  HOMELESS they do not ask your name, they ask WHERE YOU SLEEP
  ANARCHISTS a chosen name instantly, the birth name never - asking for the "real" one
           is the insult, and the game should let the player make that mistake once
Fifteen readings of one mechanic, zero new code. That is the difference between a list
of factions and a system.

=== THE COLOUR FINDING, MEASURED, AND IT ANSWERS A SEVEN-DAY-OLD PARKING ===
The 7/21 dress pass ruled six faction looks and PARKED the rest, in its own words,
because "real color collisions turned up between them in review". Nobody ever went back.
Measured with the ENGINE'S OWN distance function and its OWN 95-unit family tolerance
(read out of bohemia_dress.js so it cannot drift):
  THE MUTED CORPUS CANNOT CARRY 13 DISTINGUISHABLE FACTION COLOURS. Every dark muted
  candidate collides with the Cartel's oxblood - olive drab 39, field green 47, steel
  78, khaki 80. Moss green collides with the Mob's mustard at 86.
So the proposal is TWO colours, not seven: VOLUNTEERS bone white (a medic must read at
distance under stress - and white is the hardest thing to keep clean in a dust valley,
so a clean Volunteer is announcing they have water to spare) and BLUES cobalt. Eleven
factions read by SILHOUETTE instead, which is STRUCTURE-NOT-COLOR (7/19) doing exactly
the job that law exists for. REMNANTS get no colour because EVERYONE in America wears
olive surplus; what civilians cannot get is WEBBING.
AND ONE FINDING THAT IS HIS, PRINTED EVERY RUN AND NEVER FAILED ON: the Caravans' tan
sits 76 units from the Church's gold, inside his own tolerance, and both are family
mode, so on a body nothing separates them. Failing a build on his own ruling is not the
gate's job. (Caravans/Mob at 59 is fine - the Mob is stripe mode.)
HIS SIX RULINGS ARE CARRIED VERBATIM AND CARRY NO THUMB. NOTES ARE RULINGS: the gate
fails if a ruled faction is re-proposed for a thumb.

=== THE BOUNDARY GOT A MACHINE, NOT A PROMISE ===
BUILD THE WORLD (7/31) turned faction machinery, quests and the economy OFF the same day
this order landed. They do not conflict - that ruling bans MACHINERY ("no standing
ledger, no territory model, no faction beats"), this order asks for LORE. But STOP
PRODUCING (7/26) says finding a legal way to ship a frozen thing IS the violation, so:
no new engine faction module (still empty, subset-checked against the ratchet), no .bq
file, nothing in questbook/ or quests/ opened, factory writes to exactly two places.
THE GREPS LOOK FOR USES, NEVER MENTIONS - Paolo 8/1, a checker that cannot tell a
mention from a use is the broken one. My first version of that check failed on its own
docstring and I fixed the ruler, not the target.
TWO CARDS CARRY NO HOOKS AND SAY SO ON THE CARD: the AMALGAMATION (the act-1 names for
the haunting are PENDING PAOLO in the 7/24 ghost lock - a hook would be inventing the
vocabulary of the game's central mystery) and the SOCIAL FORCES (his to place).
MARCO: THE RULING MOVED WHILE I WAS BUILDING. I wrote against "name only"; four hours
later he re-stated Marco clean and it is canon ("hardcore realist and neighborly. Happy
to help"). My gate hard-coded the old state, which is A GATE OUTRANKING A RULING (8/1),
so it now READS THE LIVE ADDENDUM and enforces the part that is STILL open - HIS FACTION.
No dossier claims him, and the dead "king of the hobos" reading cannot come back.

=== GATE: FACTION DOSSIERS, 659 CLAIMS, AND IT SELF-TESTS ===
Every selectable faction covered; every row answered and not thin; the canon graph
reproduced exactly; approved wardrobe only (128 garment names checked by NAME and by
LAYER against the 240-item bank); no purple anywhere; every proposed colour clearing the
tolerance; the frozen machinery not grown; the sheet reachable from the LIFE hub with
thumbs, SUN MODE, comments and .txt export.
SIX PLANTED MISTAKES RUN EVERY TIME, ALL SIX CAUGHT: a purple proposal, an invented
garment, a colour colliding with a ruled one, a ruling re-proposed for a thumb, an
emptied row, and a card shipping two hooks instead of three. That proves the checker
works rather than that the repo is clean today (the 8/2 fence-orphan lesson).
AND THE FACTORY REFUSES TO GENERATE rather than emit a lie: an unknown garment or one
filed under the wrong layer stops the run with the reason. It already caught one -
BLANKET SHOULDER ROLL is gear, not back.

=== VERIFIED ON THE REAL SURFACE ===
Real browser 390x844, through the real door: splash tapped, LIFE tab opened, top card is
THE FACTION DOSSIERS. 16 cards, a card opens to 25 rendered blocks, a thumb moves the
tally, SUN MODE flips to daylight, ZERO console errors. Stamp: BUILD 8/2y.

=== AND A RED THAT IS NOT MINE, NAMED RATHER THAN WALKED PAST ===
FOUR OF THIS LANE'S GATES ARE RED ON MAIN: LIFE, DRESS, POPULATION, MEMORY. I ran the
full suite, saw them, and did the 8/2 check - a clean worktree at origin/main with NONE
of my changes fails BYTE-IDENTICALLY (LIFE 21/3 "0 agents simmed", DRESS 42/1, POPULATION
5/3, MEMORY 7/2), and so does every commit the shallow clone can reach, 45+ back. Not a
regression from today and not mine.
THE CAUSE, MEASURED: agentsForPlot on seed 12345 returns 0, 6, 3, 1, 1, 0 residents for
the first six qualifying plots. THAT IS THE DEAD WORLD WORKING, not a bug - our own
population research says ~150 of 177 residential neighbourhoods hold ZERO people. life_gate
asserts agents.length > 0 on the FIRST plot its scan lands on, 14,10, which rolls empty.
THE CLAIM CONTRADICTS CANON THIS LANE SHIPPED, and which plot it lands on is a scan
artefact - the exact coin-flip-wearing-a-claim's-name shape as the C5 walker on 8/2.
DRESS and MEMORY are downstream of the same empty block.
I DID NOT FIX IT, ON PURPOSE. Fixing it means editing four gates' CLAIMS, which is only
legitimate because the claims disagree with shipped canon, and a change of that shape
needs its own turn where the reasoning IS the deliverable. Editing gates to go green is
the pre-named forbidden shortcut and it does not stop being one because I think I am
right. Filed as P-F with the measurement and the shape of the fix (assert the
DISTRIBUTION across plots, never one plot). NEXT PEOPLE TURN SHOULD TAKE IT.
THE OTHER 25 REDS ARE THE ENVIRONMENT, NOT CODE: ModuleNotFoundError for numpy/PIL. Every
art/image gate in the suite dies on import. TOOLS RUN's only failure is the same thing -
its 262 tools and 218 gates all PARSED, including the two I added.

=== WHAT THE NEXT PEOPLE SESSION SHOULD KNOW ===
1. THE DOSSIERS ARE UNJUDGED. Do not re-surface them and do not build a second version
   of anything on this sheet (STOP PRODUCING). If "verdicts in": approve unlocks the
   FACTION_VETERAN_KIT + FACTION_LOOK fills, which is a table edit and not a new system.
2. THE DRESS SOCKETS ARE STILL EMPTY AND STAY EMPTY until he thumbs. FACTION_VETERAN_KIT
   and the unruled half of FACTION_LOOK in engine/bohemia_dress.js are where approved
   dossiers land. Nothing was written into them.
3. NAMED MECHANISM GAP, FLAGGED NOT FAKED: the ROOKIE half of dress-code-by-rank nudges
   an outfit until half the body reads the faction colour. Six factions here have no
   colour, so the rookie rule has nothing to act on. A second rookie mode (a forbidden
   list rather than a colour) is a small change - do NOT build it without a ruling.
4. THE LANE'S QUEUE BELOW IS OTHERWISE UNCHANGED: dialogue v1 still BLOCKED ON WORDS,
   the faction standing ledger still DEAD BY RULING, the companion layer still blocked.

PEOPLE (7h9sfy): 8/2 (d) LATEST — A NAME YOU EARNED IS A NAME YOU SEE, and THE FRONT
DOOR BROKE A SECOND TIME (fixed, and the failure mode is gone now).
Records: records/BOHEMIA_A_NAME_YOU_EARNED_IS_A_NAME_YOU_SEE_8_2_26.md

=== WHAT HE RULED (records/BOHEMIA_VERDICT_PERIMETER_8_2_26.txt) ===
"The gate assembly stuff actually looks decent. I'm just confused. I like the middle
 part of the wall. It's kind of confusing. Looks like it's glitching out."
ALL 13 of his own 7/14 border walls: THUMBS DOWN. The swap is SETTLED, not pending -
they are out of the run entirely and the post-mortem is in the graveyard file.
MY 18: 11 up, 7 down. All three gate cards down, while SAYING the gate looks decent.

=== ROOT CAUSE, AND THE METRIC WAS BLIND TO IT ===
First thing I checked was the numbers: UP averaged edge 18.31 / grain 61.2%, DOWN 15.98
/ 59.1%. Nearly identical, both deep in tolerance. THE STYLE TARGET HAD NOTHING TO SAY
ABOUT WHY HE REJECTED SEVEN. Worth keeping: a density ruler measures whether a tile is
as rich as his purchased art. It cannot see STRUCTURE and it cannot see how a tile
behaves when the wall is fifty of them long. Then I looked, which should have been first.
*** ONE HERO FEATURE STAMPED AT EXACTLY 44px PITCH. *** One face tile per design,
repeated down the whole block, so the single crack baked into it landed on EVERY cell in
the same place forever. A hard mark on a perfect grid reads as a rendering fault. His
ground library never showed this because the run shuffles fifteen of his tiles per cell -
pitch fifteen, invisible. The wall's pitch was one.
WHY THOSE SEVEN: slump and split-face have strong block coursing and the coursing
OUTRANKS the stamp. Stucco and precast are flat fields where the stamp is the only
structure there is - all three stucco colourways died, both flat precasts died.
THE FIX (structural, not a dial): 8 face + 8 base variants per design, shuffled by a 2D
hash of the cell, no visible period at all; one face in four is allowed damage (a wall is
not a road); and stucco finally gets the "over block" half of "stucco over block" - ghost
coursing at the block cook's own 11x22 module.

=== THE GATE: HE LIKED IT AND THUMBED IT DOWN, AND MY CARD IS WHY ===
To fit both kinds in one strip I put the STEEL LEAF on the coping row over the OPEN MOUTH
on the row below - one opening, barred on top, empty underneath. The game never does that
(the kind is seeded per plot). The card invented the defect.
LESSON, TWICE ON ONE PAGE: a judging surface that arranges art in a way the game never
produces is not a judging surface. It manufactures verdicts about things that do not exist.

=== WHAT SHIPPED ===
LIVE   the 11 he approved, re-cooked, stamp gone.
JUDGE  the 7 he killed, re-cooked with the fix, labelled "you downed this", in the LIFE
       tab. They do NOT quietly reappear in the game.
DEAD   his 13, out of the payload. NOT registered as graveyard tokens on purpose: the
       keys are "W26".."W37"/"WB4", short generic strings with 120 legitimate historical
       mentions, and registering them would make the record illegal and train the next
       session to ignore that gate. The enforcement that matters is machine-held instead -
       perimeter_gate asserts those bytes never reach the run.

=== GATED ===
gates/perimeter_gate.py, 67 checks. New this round: every design is a POOL not a tile,
most faces carry no damage, the flat materials carry ghost coursing, the 11 he approved
ship and the 7 he killed do not, his dead pool is out of the run, and a gate strip shows
ONE kind.

=== THE QUEUE ===
1. HIS BOUGHT YARD HAS THE SAME REPEAT PROBLEM, and it is in the same frame as the wall
   (records/target/PERIMETER_WALL_LIVE.png): only 5 dirt tiles shuffle across the whole
   yard and each carries a big starburst weed, so a weed lands on nearly every cell. His
   pixels are his - do not touch them - but PLACEMENT is clause 4 and 5 tiles is too few
   for the largest surface on the block. NOT SURFACED TO HIM UNASKED.
2. Features on ground ~5.5% vs his 7.0%; his cracks still crisper.
3. Art cell 44 -> 88 px. Would fix (2) outright.
4. Gated and estate communities render with the block art for the first time - nobody has
   ever looked at one.

=== STILL RED ON MAIN, STILL NOT MINE ===
LIFE / DRESS / POPULATION / MEMORY / DEVIATION - zero agents simmed. PARTS PAINTED +
BODY VARIATION are CHARACTER's. BOTTOM-LEFT + CANVAS SCALE verified failing on clean main.

--------------------------------------------------------------------------------

ART (f3eu53): 8/2 (ah) LATEST — THE COMMUNITY WALL AND ITS GATE. THE BLOCK IS DONE.

PEOPLE (7h9sfy): 8/2 (c) LATEST — REPAIRING A DISTRICT TURNED EVERY NEIGHBOUR YOU HAD
MET INTO SOMEBODY ELSE, AND LEFT THEIR NAME ON.
Record: records/BOHEMIA_A_PERSON_IS_KEYED_TO_WHERE_THEY_LIVE_8_2_26.md

=== TWO OF HIS LOCKED RULINGS MEET AT ONE LINE, AND IT BROKE BOTH ===
7/31: "once you ask their name, if you see them again, then they would be named."
8/1:  "when you fully repair a district ... more people will want to move in and live
       in the recovered ruins."
Together they promise: repair your street, more neighbours arrive, and the ones you
already know are still the people you knew. It did the opposite.

THE BUG: bohemia_agents builds a block's roster by walking the houses and SKIPPING the
abandoned ones. So a person's position in that array is not a fact about them, it is a
fact about how many of their neighbours happen to be home. bohemia_population derived
every person's character from that position. Occupancy goes up, one more house is lived
in, everybody after it shifts. Measured on cell (3,5): 2 residents before the repair, 4
after, and ZERO of the 2 originals survived. H12-1 and H12-2 swapped personalities with
each other outright.

*** WHY IT IS THE WORST VERSION OF THIS BUG: the NAME was safe the whole time. ***
bohemia_people keys names to the seat, which is stable. So the effect on the surface is
not a neighbour vanishing, which he would notice. It is the name he earned by walking up
and asking, still printed on the card, with a different person behind it. He would spend
act one repairing his street exactly as he described and everybody he ever asked would
quietly be replaced.

=== THE FIX: A PERSON IS KEYED TO WHERE THEY LIVE, NEVER TO THEIR PLACE IN A LIST ===
The seat - which house, which place in that household - is already written into every
agent id by the agents module, and bohemia_people already parses it. Population just
stopped ignoring it.
  engine/bohemia_population.js  seatNumberOf() + peopleForAgents keys on the seat
  engine/bohemia_agents.js      v.homeIndex DELETED. It was the same bug in miniature:
                                added 8/1 so a commuter's identity would travel with
                                them, except what travelled was a ROSTER POSITION. The
                                visitor is a copy of the home agent, so the seat travels
                                for free.
  gates/people_gate.js          J2 and J4 asserted the OLD design, so they were
                                defending the bug. Now they check the seat, and find a
                                person BY seat rather than by position.
ONE-TIME RESHUFFLE, DELIBERATE: changing the key changes who is who, once. Legal because
nothing about any individual is approved yet (KNOWN_AT_START and LINES ship empty, no
verdict names a person), and the alternative is a world that reshuffles every time the
dial moves.

=== GATE: PART K, and three mutations ===
K1 268 people across 93 blocks ALL have a seat, 0 fell back to a list position (counted,
   not trusted)  K2 the encoding cannot collide  K3 a district really does fill up
K4 the people you already knew are still themselves  K5 newcomers are NEW people, not
   the old ones renumbered  K6 and it holds going DOWN as well as up
   key on array position again -> K4 red (0 unchanged, 2 became somebody else), K6 red
   seat encoding too tight     -> K1 red (66 seatless), K2 red
   visitor keyed off where they stand -> J4 red

=== AND A GATE THAT WAS DECIDING BY LUCK (worth more than the fix) ===
C5 "you can walk up to a scheduled body" went red on this change. The nearest person out
on the street is routinely A HUNDRED TILES AWAY. The old walker locked onto one of three
candidates, walked at them, and gave up the instant they stepped indoors.
MEASURED ON BOTH SIDES OF THE CHANGE: the SAME three people were outdoors, at the SAME
distances. Nothing moved and nobody vanished. All that changed was when one of them went
in for the morning, and that flipped the gate green to red.
It now re-targets every step, the way a player does. THE MUTATION RUNS WERE REPEATED
AFTERWARDS to prove the new walker had not simply made the gate easier - it still goes
red on all three. The dead single-target walker was deleted rather than left around for
somebody to reach for.
LESSON FOR ANY LANE: if your gate chases a moving target across a hundred tiles, it is a
coin flip wearing a claim's name.

=== THE DEPLOY: A PUSH CAN GET NO BUILD AT ALL, AND HERE IS WHAT THAT COSTS ===
MEASURED, not guessed. My 8/2 (b) push (ad53f27) landed on main at 06:53 and GitHub Pages
NEVER CREATED A RUN FOR IT - it is simply absent from the Actions list, with an eight-hour
gap either side. Pages itself was fine: the next lane's pushes at 14:52 and 15:10 built
and succeeded normally.
WHY IT IS SURVIVABLE, and this is the part worth knowing: Pages deploys THE CURRENT STATE
OF MAIN, not a diff. So a skipped build heals itself the moment anybody else pushes - my
front-door fix went live at 14:52 riding on another lane's build. The real cost is a
window where your fix is on main and NOT on the phone, and nothing tells you.
SO: after pushing, check the Actions list for YOUR sha. If it is missing, your work is not
live yet even though main is correct, and it will go live with the next lane's push.
AND YOU CANNOT CHECK THE LIVE BYTES FROM INSIDE A SESSION: the container's proxy 403s the
CONNECT tunnel to github.io. The build stamp on the splash is the only way Paolo can tell
which build he is on, which is exactly why that law exists.

=== THE LANE'S QUEUE (BOHEMIA_BACKLOG.md, ## PEOPLE) ===
P-A(1) THEIR DAY row .... CLOSED.  P-A(2) ask-a-name ... SHIPPED 7/31.
0.  dialogue v1 ....... BLOCKED ON WORDS. The runtime exists and plays .bq end to end;
                        LINES ships empty and the words are his.
2.  faction ledger .... DEAD BY RULING.
3.  companion layer ... waits on combat extraction + a roster that is [PENDING Paolo].
1c. the valley census is numbers, not identities. THE CITY HALF IS ALREADY FINE
    (measured 8/2: homesIn appends rather than reshuffles, so city-plane people survive
    the dial at 2/4/8/16 unchanged). What is left of 1c is genuinely the companion
    layer's shape, so it is blocked with item 3, not open.

=== PARKED BY PAOLO, DO NOT RAISE ===
Who you already know at the first frame: "don't worry at all about that right now."
The population slider NUMBERS: "just worry about the coding and plumbing for now."

PEOPLE (7h9sfy): 8/2 (b) LATEST — *** THE ONE LINK WAS DEAD ON MAIN AND NOBODY KNEW. ***
READ THIS FIRST, EVERY LANE. It is not a PEOPLE thing, I just happened to run the full
suite and check whether the red was mine.

THE RUN gate went red. It fails identically on clean origin/main with none of my changes
and passes on the commit before, so it arrived with 5a42b42 ("THE RUN OPENS WHERE WE ARE
WORKING"). ONE </div> WAS DROPPED - the one that closes the front splash. <div id="app">
then parsed as a CHILD of <div id="front">. The splash handler does what it always did:
    front.style.display='none';  app.style.display='flex';
but a child of a display:none parent is not rendered whatever its own display says.
Measured on the real surface at 390x844: #app parent = front, box 0x0, ZERO client
rects, ZERO tabs. *** PAOLO TAPS THE LINK, TAPS THE SCREEN, AND GETS A BLACK RECTANGLE.
*** Every lane's work for those hours was shipping into a build nobody could open.

FIXED: the </div> is restored. #app parent is BODY, 390x844, tabs on screen, run_gate
back to 126/0.

AND GATED, because the ONE-LINK LAW is one of the oldest locked laws here and NOTHING
GATED THE DOOR ITSELF: gates/front_door_gate.js (suite: FRONT DOOR, 8 claims). run_gate
did catch it, but as a 30-second Playwright timeout saying "element is not visible" -
a symptom three screens deep in a 126-claim test that says nothing about a missing tag.
The new gate says the cause in one line ("4 <div> open vs 3 </div> close between them")
in about a millisecond, then walks through the real door in a real browser and checks
the app has a real box and the tabs are on screen. Self-tests with the exact 8/2 edit.
Mutation: reintroducing the real break fails 5 of its 8 claims.

THE LESSON FOR EVERY LANE: when the suite goes red, CHECK WHETHER IT IS YOURS before
assuming it is somebody else's known-red. Two minutes with a worktree at origin/main
answered it, and the answer was that the game had been unopenable for hours.

PEOPLE (7h9sfy): 8/2 LATEST — THE WORKERS AT THEIR JOB SITES WERE OUTSIDE PAOLO'S OWN
MASS-EDIT LAW, AND MY FIX FOR IT SHIPPED A WORSE BUG FOR ONE COMMIT.
Record: records/BOHEMIA_WORKERS_INSIDE_THE_MASS_EDIT_8_2_26.md

=== THE THREE BUGS, IN THE ORDER THEY WERE FOUND ===
1. Paolo 7/29, LOCKED: editing the people means ADDING A RULE, and the rule reaches
   everybody. The commuting workers this lane shipped on 8/1 were concatenated into the
   sim AFTER the person-facts pass, so they had no entry in RUN_PEOPLE at all, so no
   bulk edit could ever touch them. Measured on the real surface: 0 records for 22
   bodies standing in the clinic.
2. peopleForAgents derived every record from the cell the body is STANDING on. A
   commuter does not live where they stand, so the neighbour whose name you asked in
   your own street was a different human being at work.
3. *** THE ONE WORTH READING. *** Moving the concat up meant the patch tool stopped
   emitting its PEOPLE:JOIN fence. A FENCE THE TOOL STOPS EMITTING IS NOT A FENCE THAT
   GOES AWAY: the text stays applied in the file and the tool no longer knows how to
   undo it, so BOTH copies of the concat ran. Every workplace carried 44 bodies for 22
   identities - everyone standing next to a copy of himself - and on a non-residential
   cell the leftover clamp threw away the very bodies that had just been given records.
   IT WAS LIVE FOR ONE COMMIT WITH EVERY GATE GREEN.

=== WHAT ANY LANE WITH A MARKER-FENCED PATCH TOOL SHOULD TAKE FROM THIS ===
A BLOCK IS ONLY REALLY DELETED WHEN THE TOOL STILL KNOWS HOW TO UNDO IT. Deleting the
row from BLOCKS orphans its applied text in the file forever. The JOIN row is kept as a
strip-only entry: anchor and insert are the same line, the patch is a no-op, and the
only work it does is eat the corpse.
AND: the surface check only ever looked at the cell the game OPENS on, which is
residential and has no commuters, so it was structurally incapable of seeing any of
this. If your gate checks one place, it is checking one place.

=== TWO GATE CLAIMS WERE WRONG, NOT THE CODE ===
F5 asserted the OLD arrangement (JOIN opens after their block) - which was the bug, so
the gate was defending it. F4 flagged the bare WORDS "RUN PERSON FACTS", so writing a
COMMENT that says where another lane's block begins turned it red while nothing was
wrong. Paolo 8/1: a checker that cannot tell a mention from a use is the broken one, and
you fix the ruler, never the target. Both rewritten to check uses.

=== THE FIX ===
engine/bohemia_agents.js      workersForPlot stamps v.homeIndex - a visitor's seat in
                              their OWN roster travels with them next to fromCell
engine/bohemia_population.js  peopleForAgents derives a visitor from (fromCell,
                              homeIndex), never from the cell they stand on
tools/bohemia_people_identity_patch.py
                              the concat lives inside PEOPLE:WORKERS, which closes
                              BEFORE the other lane's block; JOIN kept as strip-only

=== PROOF (mutation-tested, not green-on-first-try) ===
PEOPLE 130 -> 139, RUN PEOPLE 45 held. Four mutations, all caught:
  visitor derived from the standing cell ....... J4 red
  visitor gets no record ...................... J3, J4 red
  concat after the person-facts pass (bug 1) .. D11a red, 0/22 records
  concat twice (bug 3) ........................ D11a red 22/44, D11b red, F5 red

=== AND BUG 3 IS NOW GATED FLEET-WIDE, NOT JUST FIXED FOR ME ===
gates/fence_orphan_gate.py (suite name FENCE ORPHAN, 9 claims). Half a dozen lanes edit
each other's surfaces through marker-fenced patch tools and every one of them has this
failure available to it. The gate sweeps every marker block in slices/ and engine/:
  1. NO ORPHAN - a tool that writes a fence necessarily contains its marker text, so a
     marker no tool anywhere mentions is a block nothing can remove. 24 fences, 0
     orphans today; mine was the only one.
  2. EVERY FENCE IS A PAIR - restore() matches open..close non-greedily, so a missing
     closer makes it eat past its own end (the 8/1 bug, 29 lines of another lane's
     code deleted silently).
  3. NO BLOCK IS APPLIED TWICE.
It SELF-TESTS with three synthetic probes, so it proves the checker works rather than
that the repo happens to be clean today. Mutations on the real tree, all caught:
recreating the exact orphan that shipped, applying a fence twice, deleting a closer.

=== WHERE PAOLO CAN SEE IT: THE RUN TAB ===
Walk to a workplace next door. The people in it are your own neighbours, one each.

=== THE LANE'S QUEUE (BOHEMIA_BACKLOG.md, ## PEOPLE) ===
P-A(1) THEIR DAY row .... CLOSED. Row gone, waiver list empty, gate asserts both.
P-A(2) ask-a-name ....... SHIPPED 7/31.
0.     dialogue v1 ...... BLOCKED ON WORDS. The runtime already exists and plays .bq
                          end to end; LINES ships empty and the words are his.
2.     faction ledger ... DEAD BY RULING. build_the_world_gate.py enforces it.
3.     companion layer .. waits on combat extraction + a roster that is [PENDING Paolo].
1c.    the valley census is numbers, not identities. That is the shape item 3 needs and
       it is the lane's largest unblocked mechanism.

=== PARKED BY PAOLO, DO NOT RAISE ===
Who you already know at the first frame (KNOWN_AT_START stays empty): "don't worry at
all about that right now". Ask-everybody IS the whole mechanic until he raises it.
The population slider NUMBERS: "just worry about the coding and plumbing for now."

ART (f3eu53): 8/2 (d) LATEST — THE OPENINGS. THE LAST OLD ART ON THE HOUSE IS GONE.

=== WHAT WAS LEFT ===
The house was finished yesterday and this morning. What was still flat was the thing
that RINGS the whole community and is therefore in almost every frame - the suburb
border wall - and the hole you walk out through, which the renderer drew as a plain
slab of ground concrete. 54 wall tiles (6 materials x 3 colourways x 3 forms) + 8 gate
overlays. That is the last target-set surface on the block.

*** THE PART PAOLO HAS TO JUDGE, SAID PLAINLY ***
The wall that was there is HIS - 61 candidates judged down to 13 across 7/14 and 7/17.
This replaces it in the live build on a MEASUREMENT, not a preference:
    HIS 7/14 WALLS   edge  5.76   grain 20.0%
    HIS BOUGHT TILES edge 18.36   grain 61.1%   (tolerance floor 14.27 / 54.8)
    THE NEW WALL     edge 17.44   grain 61.2%
A third of the local contrast of the ground it stands on - the same measured gap that
replaced the 7/21 house skins, and the same thing he described himself on 7/31 looking
at the yard: two different games in one frame. HIS POOL IS NOT DELETED and is still
loaded by the builder, sitting directly above the new one with the reason next to it.
Swapping which line draws is one line. Anchor: records/target/PERIMETER_VS_HIS.png.

=== THREE BUGS THAT WERE LIVE, NONE VISIBLE IN A CONTACT SHEET ===
1. WB4 WAS BEING SMEARED, AND IT IS THE ONE HE KEPT OUT OF 48. It is stored as a
   792x264 TILING PREVIEW (the true 44x44 upscaled 3x, repeated 6x2) so it could be
   judged as a run of wall. drawPerim does drawImage(im,X,Y,44,44) - the whole sheet
   crushed into ONE cell. One community in thirteen wore a grey smear. Recovery is
   EXACT (pure integer upscale) and the rescue REFUSES rather than guess, which it did
   when the caller's first attempt picked scale 6 instead of 3.
2. A TWO-CELL-THICK WALL DREW TWO WALLS. Every cell drew its own coping. Third form:
   if the cell NORTH is also wall, this one is the FACE below the coping.
3. GATED COMMUNITIES HAD NO BLOCK ART AT ALL. isSuburbCell() was CELLNAME==='suburb',
   but engine/bohemia_suburb.js says in its own words "Three district types share this
   generator - suburb, gated, estate". So every gated/estate community fell through to
   genericTile(): no bought ground, no house skins, no window openings, no wall. And
   code 5 - the gate assembly - exists ONLY on those districts, so the gate mouth could
   never draw ANYWHERE in the game. Found by walking to one, 42 cells out.

=== THE MISTAKE WORTH KEEPING ===
MEASURE THE FINISHED TILE, NOT THE FIELD IT STARTED FROM. cook_to_target redraws until
the FIELD is inside tolerance; the architecture added afterwards changes the number
(the cap ADDS contrast, the capless base LOSES it). Four base tiles shipped below his
edge floor while their fields had passed - smooth art getting through on a measurement
of something else. Same shape as the light bug: cap brightened v*1.30 then pillar
brightened the same pixels v*1.34 and the coping came out pure 255 white. A multiply
has no ceiling. Light is a BLEND TOWARD THE SKY now.

=== GATED ===
gates/perimeter_gate.py, 55 checks, registered as PERIMETER. Ruler is his own bought
art, re-derived every run. Holds all three bugs as regressions plus the anatomy: the
cap is the sky-lit lightest band, it oversails and casts, the base carries NO second
coping, the pillar is proud AND casting (brightness alone drew a stripe), every module
divides 44, the gate overlays are transparent where the wall belongs, the wall draws
BEFORE the hole is punched, his 13 walls are still loaded, WB4 is rescued.

VERIFIED ON THE REAL SURFACE: tools/bohemia_perimeter_shot.js walks to the wall and to
a gate. records/target/PERIMETER_WALL_LIVE.png (home block) and PERIMETER_GATE_LIVE.png
(estate cell 8,35).

=== AND IT IS IN A TAB (NAME THE TAB, 7/28) ===
slices/BOHEMIA_PERIMETER_JUDGE_8_2_26.html, carded on the LIFE hub. HIS 13 on top under
"what is being replaced", the 18 new designs under them, the gate assembly at the
bottom - every strip drawn the way the game draws it (coping row, face row, pillars
along the run). Thumbs, per-item notes, SUN MODE, export .txt. A PNG in records/ is not
a tab and a thing he cannot reach does not exist to him. name_the_tab_gate: 14 judging
surfaces, all reachable from LIFE.

=== THE QUEUE ===
1. Features: ground ~5.5% vs his 7.0%. Weeds and manholes read right; his CRACKS are
   still crisper - my grain washes them. Craft gap, not a knob.
2. His bought yard tiles band. "I'll let you know when I have issues with the banding
   until then" - LEAVE IT. Never touch his pixels.
3. Art cell 44 -> 88 px. Would fix (1) outright: a finer crack needs sub-pixel room it
   does not have at 44.
4. NOW REACHABLE, AND IT WAS NOT BEFORE: gated and estate communities render with the
   block art for the first time. Nobody has ever LOOKED at one. Worth a pass.

=== STILL RED ON MAIN, STILL NOT MINE ===
LIFE / DRESS / POPULATION / MEMORY / DEVIATION - ZERO AGENTS SIMMED, the block has no
people in the sim. Bisected eight commits back. CITY PEOPLE is GREEN so the DRAW is fine
and the SIM is empty. WORLD/LIFE lane's. PARTS PAINTED + BODY VARIATION are CHARACTER's.

--------------------------------------------------------------------------------

ART (f3eu53): 8/2 (d) — THE OPENINGS. THE LAST OLD ART ON THE HOUSE IS GONE.
Window, boarded window and garage bay were flat tan target-set tiles sitting in a
textured wall. They are ALPHA OVERLAYS, not whole tiles: the run picks ONE wall skin per
house out of fifteen, so a baked window locks to one of them and fourteen houses in
fifteen show a window in the wrong stucco. Drawn on top of whatever skin the house wears
it matches for free, forever, including for skins cooked later.
REVEAL / HEAD / SILL that oversails / DEAD GLASS with one sky reflection / GRIME running
down / MUNTIN. Boarded: plywood at an angle with visible nails. Garage: the roll-up
coiled in its header, a dark bay, concrete apron with the oil still on it.

ART (f3eu53): 8/2 (c) LATEST — THE WHOLE WALL FIELD IS TEXTURED NOW, NOT THREE-FIFTHS
OF IT. Queue item 2, most of the way.

=== WHAT WALKING OUT THE DOOR SHOWED ===
The roof and yard were textured and the house body still carried WIDE FLAT TAN BANDS.
The under-eave course and both corner columns were still target-set, sitting directly
against the new textured wall - the same "two different games in one frame" the yard had
on 7/31, moved up onto the house.

=== WHY THOSE THREE WERE SAFE TO SKIN AND THE OTHERS ARE NOT ===
wall_under_eave, wall_end_l and wall_end_r are NOT shape. They are THE SAME WALL IN
DIFFERENT LIGHT - the eave's shadow, the sunlit corner, the shaded corner. So they take
the same skin with a TONAL SHIFT (0.74 / 1.12 / 0.86, one light from the upper left,
exactly how every cooked tile is lit). The shift was always what carried the
information; the flat tan was only ever being flat.
*** STILL TARGET-SET, DELIBERATELY: wall_window, wall_boarded and the garage carry
OPENINGS. Skinning those would PAINT THE WINDOW SHUT. They need real art in this style,
which is a cook and not a wiring change. That is the next job and it is the last old art
on the house. ***

Relighting is cached per (tile, multiplier) - the block draws thousands of these a
frame, so a naive per-cell canvas would have been a real cost.

=== STATE ===
run_gate 126/126, wallclass 24/24, three-tile wall 7/7, bought_beats_painted 16/16,
banks_used 26/26, texture_match 24/24.
records/target/STREET_TEXTURED.png re-shot: the block reads as one material world now.

=== THE QUEUE ===
1. WINDOW / BOARDED / GARAGE DOOR, cooked in the approved texture style. Last old art on
   the house, and the only thing left that reads as flat tan in the shot.
2. Perimeter wall and gate mouth (separate from the house body).
3. Features: ground surfaces ~5.5% vs his 7.0%. Weeds and manholes are there and read
   right; his CRACKS are still crisper - my grain washes them. Craft gap, not a knob.
4. His bought yard tiles band. "I'll let you know when I have issues with the banding
   until then" - LEAVE IT. Never touch his pixels.
5. Art cell 44 -> 88 px. Would fix (3) outright: a finer crack needs sub-pixel room it
   does not have at 44.

=== STILL RED ON MAIN, STILL NOT MINE ===
LIFE / DRESS / POPULATION / MEMORY / DEVIATION - ZERO AGENTS SIMMED, the block has no
people in the sim. Bisected eight commits back. CITY PEOPLE is GREEN, so the DRAW is
fine and the SIM is empty. WORLD/LIFE lane's. PARTS PAINTED + BODY VARIATION are the
CHARACTER lane's.

PEOPLE (7h9sfy): 8/1 (i) LATEST — HE INTRODUCED THE REPAIR-A-DISTRICT GAME MODE, and the
socket for it is built. Law + the holes I pulled:
laws/BOHEMIA_ADDENDUM_REPAIR_A_DISTRICT_8_1_26.md

HIS DIRECTION (not yet locked - he said "I'll be introducing" and "let's just say"):
"when you fully repair a district kind of like Stardew Valley - get rid of all the junk cars
and make sure the electricity is on, solar panels everywhere ... then more people will want
to move in and live in the recovered ruins ... maybe towards the middle end of act one."

WHY IT MATTERS MORE THAN IT SOUNDS: the third clause makes POPULATION A CONSEQUENCE OF PLAY.
Every other lever in this game is a number a designer types. This one the player EARNS. It
is also the first concrete statement of a payoff loop the coordinator called the single
largest undesigned system in the game (BIG MISSING item 2, the city-builder half).

GROUNDED, AND HE IS RIGHT: studies of 63 post-disaster infrastructure recoveries find
returning population is contingent on electricity, potable water and sanitation, and that
those systems are interdependent. People come back when the lights and taps work. Japan
post-2011 repopulated fastest where infrastructure landed first.

=== THE HOLES I PULLED, all in the law, none smoothed over ===
1. WATER IS MISSING FROM HIS LIST AND IT IS AS BIG AS POWER. He named junk cars, electricity,
   solar. The research puts water and sanitation level with power, and the GDD already calls
   water "THE survival event" (cholera, Intake 3, the reclaim plant). A district with power
   and no water should not repopulate.
2. WHERE DO THE NEW PEOPLE COME FROM? The valley holds ~1,100. Fifty arriving from off-map is
   GROWTH; fifty leaving another district is a ZERO-SUM TUG OF WAR. Different games. The
   zero-sum one is more interesting and costs nothing extra - but it is his call.
3. CAN IT GO BACKWARDS? If a faction cuts the power, do they leave? A ratchet is simpler; a
   reversible one gives raiders something worth doing.
4. WHAT STOPS IT BEING A CHORE? Stardew works on small bundles with immediate visible reward.
   "Clear every junk car" is a flat list. PARTIAL CREDIT may be the difference between Stardew
   and homework - though "fully repair" may already answer it as all-or-nothing.
5. IT COLLIDES WITH THE ZONE MAP. If repair adds people, does a repaired no-man's-land become
   a cluster, and does food carrying capacity still cap it?

=== WHAT WAS BUILT (mechanism only) ===
PER-DISTRICT DIALS on top of the global one:
    cellDial(x,y) / setCellDial(x,y,v) / dialAt(x,y) / clearCellDials()
One cell can now be fuller than its neighbours, which is the entire mechanical requirement
of his idea. MEASURED: repairing one cell took it 3 -> 10 people while the cell next door
stayed exactly where it was. The global dial still wins at zero, so a ghost valley stays a
ghost valley however much you repaired.
REPAIR_WORTH SHIPS EMPTY AND STAYS EMPTY. What counts as repaired, and what each repair is
worth in people, is HIS table. No session may decide ten junk cars are worth thirty people.
NOT BUILT, DELIBERATELY: repair tracking, junk-car counters, completion state, UI. That is
the city-builder half and it needs his design first. This is the socket, nothing more.

=== GATE: part I, 9 claims, 130 total ===
I4 repairing brings people in. I5 THE NEIGHBOUR IS UNTOUCHED. I6 a ghost valley stays one.
I7 clearing repairs restores exactly. I1 his table stays empty.
A GATE WEAKNESS I FOUND BY MUTATING: I5 first compared against an EMPTY neighbour, so a
repair that leaked everywhere still multiplied zero by eight and got zero - the mutation
walked straight past it. A control that cannot move is not a control. It now requires a
neighbour that also has people, and the leak mutation fails it 4 -> 13.

=== WHAT COMES AFTER ===
1. HIS ANSWERS to holes 1-5 above, whenever he wants. Hole 1 (water) is the one that changes
   the most if left wrong.
2. PARKED BY HIM: thin-vs-clustered distribution. DO NOT re-raise.
3. Unchanged: visitors escape mass edits; JOB_DISTRICTS is four entries.
4. PARKED, DO NOT ASK: who he already knows. FACTIONS ARE OFF.

--------------------------------------------------------------------------------

ART (f3eu53): 8/2 (b) LATEST — WEEDS, MANHOLES, AND THE CRACK NETWORK STOPPED LOOKING
LIKE A DIAGRAM. Queue item 1 closed as far as it honestly goes.

=== HIS WEEDS, MEASURED AND LOOKED AT BEFORE DRAWING ANY ===
Rendered his tiles at 190px. A clump is a RADIAL ROSETTE: blades fanning from a DARK
CORE where it meets the ground, 1-2px, varying length, slightly curved, tips catching
light, growing OUT OF a crack. Half of it is straw, not green - this is a desert city
thirty years on and a uniformly green clump lies about the climate.
*** AND THE DISTRIBUTION IS THE OTHER HALF OF IT. Measured on his 34 concrete tiles:
23 HAVE ESSENTIALLY NO WEED, a handful carry 2-3%, and TWO are 30% overgrown mats.
Weeds on every tile would be as wrong as weeds on none. Mine now rolls 62% nothing /
26% one clump / 6% two / 6% overgrown. ***

=== FEATURES NEEDED A COLOUR LAYER, WHICH THEY DID NOT HAVE ===
Every feature until now worked in LUMINANCE, which is right for damage - a crack is the
material, darker. It is WRONG for a weed: dimming stucco never produces chlorophyll. So
vegetation and hardware paint into a `tint` layer and override.

=== HARDWARE: A MANHOLE IS A HEAVY DARK DISC, NOT A GREY CIRCLE ===
The first pass drew mid-grey with faint ribs and read as a smudge. What makes it read at
44px: DARKER than the road, a recessed seating ring, and a coarse cast pattern -
concentric rings crossed by radial spokes, plus a pick hole and a lit north-west lip.

=== THE ONE THAT MATTERED MOST, AND THE METRIC ARGUED AGAINST IT ===
Beside his tiles, my plate network read as a VORONOI DIAGRAM: dead straight cell walls,
evenly sized cells, constant crack width. His crazing WANDERS, forks, and opens and
closes along a single crack. Fixed by warping the sample point through a periodic noise
field before the plate test (bends every boundary, keeps the topology, still closes,
still wraps) and by varying width along the crack.
*** ALSO: a dead road is crazed EDGE TO EDGE. Ground materials now get a full-tile
network UNDERNEATH the discrete events. Cracking as a purely local event is what a
two-year-old car park looks like, not a road thirty years after the money stopped. ***
AND THE METRIC WENT DOWN WHEN I DID IT (ground median 5.8% -> 5.5%). That is the metric
being wrong, not the art: a full-tile crack raises the tile's own standard deviation, so
the 2-sd threshold rises with it and fewer pixels clear a moving bar. THE ART GOT MORE
LIKE HIS AND THE NUMBER GOT WORSE. Shipped on the look. (Edge did rise, 16.9 -> 18.4,
against his 18.4 - that one agrees.)

=== WHERE IT ACTUALLY STANDS, NOT ROUNDED UP ===
  features, ground surfaces   mine ~5.5-5.8% median   HIS 7.0%
  edge                        18.38                   18.36
  seam worst                  1.16                    (gate limit 1.25)
The weeds are now near-indistinguishable from his in character. His CRACKS are still
crisper and darker than mine - my grain washes them slightly - and his plate cells are
tighter. That is the remaining gap and it is a craft gap, not a knob.
records/target/FEATURE_COMPARE.png is his six beside mine at 190px.
records/target/VEG_HARDWARE.png is the vegetation and hardware set.

=== STATE ===
banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt  114 tiles / 38 materials, ALL APPROVED, CANON
texture_match 24/24, run_gate 126/126, banks_used 26/26, banklaw 8/8.

=== THE QUEUE ===
1. (this) Features - as far as it goes without a crack model finer than the grain.
2. House UPPER floor band, perimeter wall, gate mouth, garage mouth still target-set.
3. His bought yard tiles band. "I'll let you know when I have issues with the banding
   until then" - LEAVE IT. Never touch his pixels.
4. Art cell 44 -> 88 px, "thats down the line". NOTE: this would fix the crack-vs-grain
   problem above outright, because a finer crack needs sub-pixel room it does not have
   at 44.

=== STILL RED ON MAIN, STILL NOT MINE ===
LIFE / DRESS / POPULATION / MEMORY / DEVIATION - all report ZERO AGENTS SIMMED, the
block has no people in the sim. Bisected eight commits back. CITY PEOPLE is GREEN, so
the DRAW is fine and the SIM is empty. WORLD/LIFE lane's. PARTS PAINTED + BODY VARIATION
are the CHARACTER lane's.
PEOPLE (7h9sfy): 8/1 (h) LATEST — FOUR FAMILIES IN THE STARTING NEIGHBOURHOOD, and this
one he CAN see. Record: records/BOHEMIA_FOUR_FAMILIES_8_1_26.md

HIS RULING: "in my starting neighborhood I want there to be four families." EXACTLY four.

WHY IT WAS NOT ALREADY POSSIBLE: the starting block had a FLOOR of six households expressed
as a RATE (6/homes). A rate is a per-house coin flip - it lands NEAR a number, never ON it,
and on the shipping seed it produced FIVE. WHEN HE NAMES A COUNT, THE COUNT IS THE LAW, so
agentsForBlock gained `households: N` - pick exactly N houses, deterministically.

THREE DECISIONS INSIDE IT:
1. WHICH four: spread across the block, not clumped. Four in a row is a terrace; four down
   the street is a neighbourhood. Deterministic from the block seed - same four forever.
2. A FAMILY IS MORE THAN ONE PERSON. The household roll returns 1 about 30% of the time and
   the first build came out two couples and two people living alone. The named-count path
   floors household size at 2. ONLY that path - everywhere else a household of one is still
   a household of one, because most survivors are alone and that is the honest picture.
3. THE DIAL WINS EVEN OVER A NAMED COUNT. Two rulings met: "four families" and "the slider
   can go all the way from ZERO to a maximum". At dial 0 the ghost valley has to include his
   own street. So the COUNT is dialled like a rate: 4 at dial 1, 2 at 0.5, none at 0, 8 at 2.
   THE GATE CAUGHT THIS - E11 went red the moment the count bypassed the dial. A gate doing
   its job on a design conflict, not a typo.

MEASURED ON THE REAL RUN:
    4 FAMILIES, 10 people - H1 (2), H5 (3), H10 (3), H15 (2), 3 outside right now

AND A FIX TO THIS LANE'S OWN TOOL, forced by this work: the 8/1 guard cannot tell OUR OWN
OLD TEXT from another lane's, so it refused every legitimate edit to our own blocks.
    python3 tools/bohemia_people_identity_patch.py --allow WORKERS
An intentional rewrite is now a deliberate act somebody TYPES; a silent deletion stays
impossible. Verified the other lane's 29-line block survived the migration.

GATE: part H, 6 claims, 121 total, on the real run. Mutation-proved twice (rate floor gives
five and fails H1/H3; a one-person family fails H2).
VERIFIED: PEOPLE 121/0, RUN 126/0, RUN PEOPLE 45/0.

=== WHAT COMES AFTER ===
1. PARKED BY HIM: the thin-vs-clustered distribution question ("we'll deal with this down
   the pipeline"). DO NOT re-raise it.
2. The population slider plumbing is done and dialled; ACT_DIAL still ships empty.
3. Unchanged: visitors escape mass edits; JOB_DISTRICTS is four entries.
4. PARKED, DO NOT ASK: who he already knows. FACTIONS ARE OFF.

--------------------------------------------------------------------------------

ART (f3eu53): 8/2 LATEST — THE LOGO IS GOLD. I BUILT IT BACKWARDS FIRST AND HE CAUGHT IT.

Paolo 8/2, with a zoomed screenshot of the gold letter: "I told you use this color and
you didn't what the fuck"

=== READ THE SENTENCE PROPERLY, IT IS THE WHOLE LESSON ===
  "If you can put the coloring of the [Sign] painter exactly as the Punk stencil is
   just be concerned with the coloring"
I parsed: SIGN PAINTER shape + STENCIL colour, and shipped a WHITE stencil wordmark.
He meant: THE PUNK STENCIL STAYS EXACTLY AS IT IS; THE SIGN PAINTER'S COLOURING IS WHAT
GETS APPLIED. Gold onto the stencil. His reading is the one the sentence supports.
*** BOTH READINGS WERE GRAMMATICALLY AVAILABLE, WHICH IS PRECISELY WHY IT SHOULD HAVE
BEEN ASKED. One word would have cost nothing; assuming cost him a wrong front screen. ***

=== SHIPPED ===
Logo 11 = LOGO 3 UNCHANGED (dark wall, F_STENCIL cut-plate letterforms with bridges,
uneven coverage, overspray halo, runs) wearing LOGO 5's GOLD. It is the alpha front
screen. records/target/FRONT_SCREEN.png is the real 390px phone shot.

THE GOLD IS SAMPLED OFF HIS SCREENSHOT, not re-derived - guessing twice was not an
option:
    his letter body       rgb(202, 173, 101)  #CAAD65
    his lit stroke top    rgb(224, 196, 119)  #E0C477
    my shipped mean ink   rgb(205, 174, 101)
Three points on one channel, which is the JPEG of a photographed phone screen.

=== A GUARD THAT WAS RIGHT AND MIS-CALIBRATED ===
The front-screen patch REFUSED the legitimate re-patch because the gold PNG compressed
4 KB smaller than the white one. Correct instinct, wrong number: that guard exists to
catch the alpha being TRUNCATED (this file has gone to zero bytes once) and not to catch
a payload swap. It is 2% now.

=== STILL OPEN, AND STILL NOT MINE ===
MAIN IS RED ON SEVEN GATES. Five are one failure wearing five names - LIFE, DRESS,
POPULATION, MEMORY, DEVIATION all report ZERO AGENTS SIMMED. The block has no people in
the sim. Bisected eight commits back on main: red at every one. CITY PEOPLE is GREEN
(10 on screen in a real browser), so the DRAW is fine and the SIM is empty. Flagged for
the WORLD/LIFE lane. PARTS PAINTED + BODY VARIATION are the CHARACTER lane's.

=== THE QUEUE, UNCHANGED ===
1. Features at half his density (median 4.9% vs his 7.0%). Plate-network cracks are
   right, the COUNT is low. Next: more events per tile + VEGETATION through a crack and
   HARDWARE (manhole, drain, vent).
2. House upper floor band, perimeter wall, gate mouth, garage mouth still target-set.
3. His bought yard tiles band. "I'll let you know when I have issues with the banding
   until then" - LEAVE IT.
4. Art cell 44 -> 88 px, "thats down the line".

ART (f3eu53): 8/1 (g) LATEST — HE CHOSE THE LOGO AND IT IS THE FRONT SCREEN NOW.

Paolo 8/1, with logos 3 and 5 side by side: "If you can put the coloring of the [Sign]
painter exactly as the Punk stencil is just be concerned with the coloring I would be
very happy. Do that properly slide it into the homepage the first thing I see every time
I open up the alpha, please"

=== SHIPPED ===
Logo 11 = SIGN PAINTER letterforms + PUNK STENCIL palette. It is the alpha FRONT SCREEN.
records/target/FRONT_SCREEN.png is the real 390px phone shot.
records/BOHEMIA_VERDICT_LOGO_8_1_26.txt is the verdict, verbatim.

ONLY THE COLOUR MOVED, because that is what he asked ("just be concerned with the
coloring"). Kept: the brush letterforms, the board and its double frame, the
signwriter's drop shadow, the tracking. Taken from 3: the dark grainy wall, off-white
spray ink, uneven coverage, overspray halo, runs. Gone: the gold and the brown board.
The gold is the prettiest thing in the ten and it is not what he asked for.

MY PICK (1, DEAD MARQUEE) IS SUPERSEDED. His call ends it; my reasoning stays on file
only so nobody re-litigates it.

=== THE SPLASH WAS SHOWING UNJUDGED ART ===
renderWordmark() drew a live GLYPH-table wordmark - italic, sheared, fault-slipped - and
nobody ever thumbed it. His logo wins on that alone. The old renderer stays in the file
because other surfaces call it.

=== TWO THINGS THE NUMBERS COULD NOT SEE ===
1. The first wiring letterboxed a 400x130 logo in the old 640x170 canvas at integer
   scale 1: SMALL, adrift in dead canvas. The canvas takes the artwork's size now, CSS
   lays out the logo itself, image-rendering:pixelated keeps it crisp.
2. The patch REFUSED on its first run: '<div id="front">' matches twice in the alpha,
   once as markup and once inside a comment. That refusal was correct - a two-match
   anchor in a 34 MB single-file build is how the wrong thing gets rewritten, and this
   file has been truncated to zero bytes once already.

=== GATE ===
gates/logo_gate.py, 24 checks, registered as LOGO. Holds: the letterforms must actually
differ (checked on raw GLYPH BITMAPS, so one wordmark under ten filters cannot pass), no
logo may run off its own frame, and the bytes on the splash must BE the judged bytes,
blitted with smoothing off.

*** FLAG FOR THE WORLD/LIFE AND CHARACTER LANES (found 8/2 by the ART lane, NOT MINE) ***
MAIN IS RED ON SEVEN GATES AND FIVE OF THEM ARE ONE FAILURE WEARING FIVE NAMES:
  LIFE, DRESS, POPULATION, MEMORY, DEVIATION  -> all report ZERO AGENTS SIMMED.
  "plot 14,10 is populated (0 agents)" / "most homes are abandoned shells (0 of 19
  lived-in)" / "11:00 - the block lives (0 out working/scavenging)".
  THE BLOCK HAS NO PEOPLE IN THE SIM. Earlier in this same session LIFE was green at
  24/24 with 6 agents simmed, so this is a regression, not a known gap.
  Bisected back EIGHT commits on main (ad3ed1c, 6e18f40, b047034, 87c6a2f, 35843c1,
  476b643, ae3eed2) - red at every one, so it predates all of them and is older than
  this window. Not the ART lane's: my diff is banks/, tools/, gates/logo_gate.py,
  records/ and the alpha splash, and LIFE fails identically with my commit absent.
  CITY PEOPLE is GREEN (10 people on screen in a real browser), so the DRAW is fine and
  it is the SIM that is empty - which is why it is worth someone's morning.
PARTS PAINTED and BODY VARIATION are the CHARACTER lane's, also pre-existing.

=== THE QUEUE, UNCHANGED AND STILL HIS ===
1. FEATURES AT HALF HIS DENSITY (median 4.9% vs 7.0%, 17/114 vs 42/54). Plate-network
   cracks are right, the COUNT is low. Next: more events per tile, plus VEGETATION
   through a crack and HARDWARE (manhole, drain, vent) - the two things his pack has
   that mine does not.
2. House UPPER floor band, perimeter wall, gate mouth, garage mouth still target-set.
3. His bought yard tiles band. "I'll let you know when I have issues with the banding
   until then" - LEAVE IT. Never touch his pixels.
4. Art cell 44 -> 88 px, "thats down the line".

PEOPLE (7h9sfy): 8/1 (g) LATEST — HE ASKED FOR THE NPC COUNTS AND THEY OVERTURNED MY OWN
CONCLUSION. Research: records/BOHEMIA_NPC_COUNTS_IN_REAL_GAMES_8_1_26.md
NOTHING SHIPPED TO THE GAME THIS TURN, ON PURPOSE - see the last section.

=== THE COUNTS ===
  Fallout: New Vegas     ~373-380 named NPCs
  Fallout 4              500+ (Bethesda's own figure)
  Skyrim                 ~979-1,001
  Red Dead Redemption 2  ~1,000+
  BOHEMIA, derived 8/1   1,113
Our scale-model arithmetic landed on Skyrim's number WITHOUT EVER LOOKING AT IT. Real Vegas
census data shrunk 1:78 and cut to 3% survivors, versus what shipped games actually contain
- two independent roads, same answer. The total is validated.

=== AND THE PART THAT MATTERS MORE: DENSITY, NOT TOTAL ===
  SKYRIM   ~1,000 NPCs over ~37 km2 = ~27 per km2
  BOHEMIA   1,047 people over 21 km2 = ~49 per km2
WE ARE ALREADY TWICE AS DENSE AS SKYRIM PER KM2 AND IT STILL READS AS DEAD. The total was
never the problem. Measured distribution of our 1,047:
     276 residential cells hold NOBODY
     180 hold 1-2
     129 hold 3-5
      42 hold 6-10
       1 holds 11+   <- THE BIGGEST SETTLEMENT IN THE ENTIRE VALLEY IS TWELVE PEOPLE
Skyrim puts 50-70 inside Whiterun, a space you cross in two minutes, and leaves whole
mountains empty. You FEEL a thousand because you meet sixty at once. We smeared the same
number over 352 blocks at three each, and three people on a 96 m block is invisible.

*** THIS IS PAOLO'S OWN 7/29 RULING NOT BEING FOLLOWED. *** He ruled "clusters AND no man's
lands AND random spread". What runs is almost pure random spread - the clustering is so weak
that the largest cluster in Las Vegas is a dozen people. Fixing it means changing the zone
map's numbers, which are HIS, so it was not done unilaterally. THE QUESTION IS IN HIS ASK.

=== WHY HE SAW NOTHING FROM THE POPULATION SHIP, AND IT IS MY FAULT ===
The run applies a FLOOR of 6 households to the PLAYER'S OWN CELL and only that cell (7/29,
"your own block always has neighbours"). His block held 16 people before the change and
holds 16 after. THE ONE BLOCK HE PLAYS ON IS PINNED BY CONSTRUCTION AND CANNOT SHOW A
VALLEY-WIDE POPULATION CHANGE. Measured after the ship: his block 16 people / 6 outside,
one north 0, one south 0. The code DID deploy (later Pages runs green, commit on main).
I shipped something invisible from where he stands and then told him to go look at it.
LESSON FOR THIS LANE: before telling him to look, check the thing is visible FROM HIS
BLOCK. The floor makes his cell a special case and it will hide any population work.

=== WHAT COMES AFTER, in order ===
1. HIS CALL, and it is now a clean either/or backed by measurement:
   A THIN AND EVERYWHERE (today) - two or three people every other block, nowhere empty,
     nowhere a town.
   B CLUSTERED HARD (Skyrim's way, and his own ruling) - 20-30 real settlements of 40-60
     people each, long stretches of genuinely dead city between.
   B is what makes a thousand people FEEL like a thousand. It needs the zone map's head
   counts changed, which are his.
2. If B: the change is the zone map's HEADS constants, not the total. The total is right.
3. Unchanged and still open: visitors escape mass edits; JOB_DISTRICTS is four entries.
4. PARKED, DO NOT ASK: who he already knows. FACTIONS ARE OFF.

--------------------------------------------------------------------------------

LAB (e2r7sv): 8/1 (c) LATEST — HE KILLED THE RF4 DIRECTION. IT NEVER SHIPPED. NO V2.

Paolo: "The answer is no I don't like the direction that you took this turn."
The commit was DROPPED before it reached main, so there is nothing to un-ship. Page and
records deleted. Graveyarded with a post-mortem:
records/BOHEMIA_RF4_DIRECTION_KILL_8_1_26.md

*** WHAT I DID WRONG, AND IT IS THE ONLY PART WORTH READING: HE ASKED ME TO MEASURE A
GAME AND I CAME BACK ASKING HIM TO ADOPT ONE. *** "Rogue fable 4 all of it" is a
research instruction. I built a page whose closing question was "should a Bohemia stat be
a mini-game -- and if yes, which three?" That is importing a reference, not measuring
one, and it puts him in the position of approving another studio's design instead of
designing his own.
SECOND THING: the reply was mostly about MY OWN PLUMBING -- a new gate tier, three bugs
in my own checks, a repo incident. All true, none of it what he asked for. The STOP
PRODUCING law already says green gates never lead a reply, and I let machinery be the
story again.

THE RULE OUT OF IT, for every lane: *** A REFERENCE IS FOR UNDERSTANDING, NOT FOR
IMPORTING. *** When he names a game, the deliverable is what that game does and why it
works -- never a request that Bohemia become it. The moment a research turn ends with
"shall we adopt this", it stopped being research.

ALSO DEAD AS A PROPOSAL, now machine-enforced: "a Bohemia stat should be a mini-game
rather than a number you accumulate." He said NO. It is row 12 of
records/BOHEMIA_ANSWERED_QUESTIONS_INDEX.md (25 settled questions now) and
gates/answered_gate.py FAILS THE BUILD if any session asks it again. Do not re-frame it.

NO V2. No second Rogue Fable page, no salvaged version, no same-findings-different-
framing. Under STOP PRODUCING, finding a legal way to ship a rejected thing IS the
violation.

ART (f3eu53): 8/1 (f) LATEST — TEN LOGOS, TEN ALPHABETS. AWAITING HIS PICK; THE ONE HE
CHOOSES GOES ON THE HOME SCREEN.

Paolo 8/1: "cook me up 10 new Bohemia logos that try to capture the feeling of the game
... different fonts different styles I don't wanna see the same font in the same style
10 different times ... the one that you choose I will put on the home screen"

=== THE BRIEF HAS A CHEAP READ AND IT WAS REFUSED ===
One wordmark under ten filters would satisfy the word "logo" and fail the actual ask.
It is STRUCTURE-NOT-COLOUR (7/19) pointed at type: a recolour is never progress. So the
LETTERFORMS are authored ten times - different widths, weights, stroke contrast,
terminals and counters, hand-set as bitmaps. gates/logo_gate.py checks this on the raw
GLYPH BITMAPS rather than the finished pictures, so a filter-farm can never pass it.

=== THE TEN, AND WHAT EACH CLAIMS ABOUT THE GAME ===
 1 DEAD MARQUEE     bulb sign, 12% lit and CLUSTERED because that is the power law.
 2 GOOGIE ATOMIC    wide sheared chrome + starburst. What Vegas PROMISED.
 3 PUNK STENCIL     sprayed through a cut plate, with overspray and a run. Babypunk.
 4 RANSOM ZINE      EVERY LETTER FROM A DIFFERENT ALPHABET on torn scraps. Scarcity as
                    a typeface, and the most honest logo here about the world.
 5 SIGN PAINTER     gold leaf on a framed board, lifting after 30 years.
 6 BRUTALIST STAMP  struck into concrete, lit lip upper-left, shadow lower-right.
 7 SCRATCHED        hairline gouged into rusted steel with a burr thrown up.
 8 DESERT DECO      tall gilded condensed, deco rules and a fan. The showgirl half.
 9 BOARDWALK        whitewash across weathered planks, paint skipping the board gaps.
10 AMALGAMATION     modular, on a visible lattice, nodes at every turn - the ENEMY's
                    language, and it refuses their purple, which is the argument.

*** MY PICK: 1, DEAD MARQUEE. *** It states the premise instead of decorating it: the
sign is still standing and almost none of it is lit. The 12% clustered-power law does
the work, so it is CANON rather than a mood, and bulbs stay legible at phone size when
fine detail does not. His call, not mine.

=== THE BUG THAT ALMOST SHIPPED ===
The first render hand-picked a scale per logo and FOUR OF TEN RAN OFF THE CANVAS: the
marquee, the scratched plate, the boardwalk and the Amalgamation all lost their final A,
and the Amalgamation lost its B as well. Invisible in every number, obvious the instant
the sheet was looked at. Auto-fit now picks the biggest WHOLE-pixel scale that fits (a
fractional scale would resample pixel letterforms), and the gate fails any logo with ink
on its outer columns.

=== STATE ===
banks/BOHEMIA_LOGO_CANDIDATES_8_1_26.txt   10 logos, status PENDING PAOLO
records/target/LOGO_SHEET.png              all ten, 2x, for judging
records/target/logos/LOGO_01..10.png       each at full size
gates/logo_gate.py                         16 checks, registered as LOGO

=== THE QUEUE HE ASKED ME TO KEEP ===
1. FEATURES ARE STILL HALF HIS DENSITY (median 4.9% vs his 7.0%, 17/114 vs 42/54). The
   plate-network crack model is right; the COUNT is low. Next pass raises events per
   tile and adds the two things his pack has and mine does not: VEGETATION pushing
   through a crack (his weed clumps are the most characterful thing in his library) and
   HARDWARE (a manhole, a drain, a vent).
2. House UPPER floor band, perimeter wall, gate mouth, garage mouth still target-set.
3. HIS bought yard tiles band at their borders. Paolo 8/1: "I'll let you know when I
   have issues with the banding until then" - LEAVE IT. Never touch his pixels; if he
   reopens it the fix is placement, dropping edge-scored tiles from the yard pool.
4. Doubling the art cell 44 -> 88 px ("thats down the line").
PEOPLE (7h9sfy): 8/1 (f) LATEST — THE POPULATION QUESTION IS ANSWERED: ~1,113 PEOPLE IN
THE WHOLE VALLEY, derived from the scale model the way Paolo said to derive it. The world
now holds that many. Full derivation + sources:
records/BOHEMIA_HOW_MANY_PEOPLE_ANSWERED_8_1_26.md
Reproduce any time: `node tools/bohemia_scale_model.js` (runs against the LIVE map, so the
number can never drift from the world it describes).

=== HIS METHOD, AND IT WAS THE RIGHT ONE ===
"if we know the scale model of our Las Vegas compared to real Las Vegas ... it was just the
full amount of people living in Vegas in 2040, 2050 - millions of people right - but then
you get the scale model of it and now it's not millions of people, and then on top of it
now we have an apocalypse."

  THE MAP        48x48 cells x 96 m = 21.23 km2, 12,260 dwellings actually drawn
  THE SCALE      1:78 by housing (12,260 of Clark County's 958,705 units)
                 1:66 by area     (21.2 km2 of the valley's 540 sq mi)
                 THEY AGREE WITHIN 16% - two measures from completely different things
                 landing together is what says the map is a real model, not a doodle
  STEP 1         2050 Vegas ~2.9 M (UNLV CBER: 3 M in 2055) / 78.2 = 37,085 PEOPLE
                 millions became tens of thousands from the scale model alone
  STEP 2         GDD's ~3% survive -> 1,113 PEOPLE IN THE WHOLE VALLEY
  STEP 3         506 occupied homes of 12,260 = 4.1% occupancy, 1.8 per residential cell

=== THE ANSWER TO THE QUESTION THIS LANE HAS BEEN ASKING FOR THREE TURNS ===
WALKING ONE BLOCK FROM HOME YOU SHOULD USUALLY SEE NOBODY. SOMETIMES ONE. IN A CLUSTER, A
DOZEN. The emptiness is not a bug - it is what a thousand survivors in a hundred-thousand-
person shell looks like, and his 7/29 zone map (clusters AND no man's lands AND spread) is
exactly the right shape to hang it on.

=== IT GRADED BOTH LIVE NUMBERS, AND BOTH WERE WRONG ===
  flat placeholder 0.30   8,282 people   7.4x TOO MANY
  zone map at dial 1         60 people   19x TOO FEW
  the scale model         1,113 people   <- the answer
Opposite directions, which is why neither ever felt right.

=== WHAT CHANGED ===
OCCUPIED_RATE 0.30 -> 0.038, full derivation written AT the constant. That value's own
comment called it a placeholder [PENDING Paolo]; this replaces it with arithmetic off his
GDD and public data, which is not overruling anything. Measured: 1,047 valley-wide, 6%
under target (occupancy is a per-house hash roll, so it lands near, not on).
DIAL_MAX 4 -> 32, because the zone-map path needs ~19x to reach the truth and a slider that
cannot reach the right answer is a broken slider.
THE ZONE MAP ITSELF WAS NOT TOUCHED. Its SHAPE is his ruling and it is right; only its head
counts are low and those are his. The widened dial lets his slider reach the truth without
anybody editing that ruling.

=== GATE: people_gate part G, 9 claims, 115 total ===
G3 the two scales must agree (the foundation). G6 THE SIM MUST HOLD WHAT THE ARITHMETIC
SAYS within 25% (the teeth). G7 the rate cannot go back to a round guess. G9 the slider must
still reach the answer. Mutation-proved twice.
ALSO FIXED: D4/D5 hard-coded cell 20,3 and went red the moment the population dropped 8x.
They SEARCH for a staffed job site now - the claim was always "job sites are staffed", never
"that cell specifically".

=== WHAT COMES AFTER, in order ===
1. HIS VERDICT ON THE FEEL. The arithmetic is honest; whether 1,113 feels right when he
   walks it is a verdict, not a calculation. If he wants a busier valley the lever is ONE
   number now and the derivation says exactly what he would be trading away.
2. THE ZONE MAP'S HEAD COUNTS are ~19x low against this. His ruling, his numbers - but the
   arithmetic to fix them is now written down and reproducible.
3. VISITORS ESCAPE MASS EDITS (unchanged): a worker at a job site is not in RUN_PEOPLE. Fix
   is a unique person id for visitors threaded through peopleForAgents/conditionAgents.
4. JOB_DISTRICTS is four entries; a FARM employs nobody. WORLD's call.
5. PARKED, DO NOT ASK: who he already knows. FACTIONS ARE OFF.

--------------------------------------------------------------------------------

ART (f3eu53): 8/1 (e) LATEST — THE HERO FEATURES. He told me to leave the banding and
keep going, so I closed the gap this lane has carried as named debt since the first
batch: his tiles have EVENTS, mine were even texture.

=== MEASURED HIS PACK FIRST ===
"Feature" = share of a tile that is a strong LOCALIZED deviation from its own body
(|v - median| > 2 sd): a manhole, a weed clump, a long crack.
    HIS   54 tiles   median 7.0%   78% of them clear 6%
    MINE  114 tiles  median 4.1%    9 of 114 cleared 6%
His pack is not mostly-plain with the occasional event. NEARLY EVERY TILE HAS SOMETHING.

=== THE FIRST ATTEMPT WAS WRONG AND THE NUMBERS COULDN'T SEE IT ===
I added cracks as a RANDOM WALK with a per-step angle jitter. Amplitude went up, the
metric moved a little, every gate stayed green - and laid beside his tiles at 200px the
result was WORMS AND RINGS. Meandering squiggles and perfect doughnut spalls that read
as doodles drawn ON the surface instead of damage IN it.
*** HIS CRACKS ARE STRUCTURAL. They form a connected polygonal network that breaks the
surface into PLATES and meets at junctions, because that is what concrete does when it
crazes. No amount of extra amplitude fixes a wrong model. ***
Rebuilt as a PLATE DECOMPOSITION: scatter seeds, mark every pixel nearly equidistant
from its two nearest ones, and that set IS the plate boundary - segments come out
straight-ish, meet at real junctions, and close. Distances WRAP, so the network
continues across the tile edge instead of stopping at it.
The spall was the same error smaller: a ring stamped at a fixed radius reads as a
doughnut, so the radius wanders now. And the exposed substrate was lifted 12-30, which
made every spall a white blob the eye went straight to; it is 3-11 now.

=== THE FACTORY ENFORCES ITS OWN GATE NOW ===
A bad seam is not a tuning miss you can dial out - it is a BAD SEED (a crack network
that happens to run along the boundary), and the fix is to draw a different tile. The
cook measures seam_ratio itself and RE-SEEDS above 1.18 rather than leaving it for the
gate to catch. Seam scoring is also folded into the best-so-far, so a near-miss never
beats a clean tile.
Also caught by the band, not by eye: mobile-home siding measured 79% grain against his
77.5 ceiling because it was drawing INDUSTRIAL R-panel ribs. A mobile home wears vinyl
or thin aluminium - a much softer profile. Structure amplitude is per-material now.

=== STATE ===
banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt  114 tiles / 38 materials, ALL APPROVED, CANON
  114/114 in band. features median 4.9%, 17/114 above 6% (was 4.1% / 9).
  STILL SHORT OF HIS 7.0% / 78%, said plainly rather than rounded up.
gates/texture_match_gate.py 24 checks   banks_used 26/26   alpha loads 20/20
records/target/FEATURE_COMPARE.png  his six beside mine at 200px, which is the only
  view that caught the worms in the first place.

=== WHAT COMES NEXT, IN ORDER ===
1. FEATURES ARE STILL HALF HIS DENSITY. The plate network is right; the count is low.
   Next pass raises events per tile and adds the two his pack has that mine does not:
   VEGETATION pushing through a crack (his weed clumps are the single most characterful
   thing in his pack) and hardware (a manhole, a drain, a vent).
2. The house UPPER floor band, perimeter wall, gate mouth and garage mouth still wear
   target-set art.
3. HIS bought yard tiles band at their borders. He said 8/1: "I'll let you know when I
   have issues with the banding until then" - so LEAVE IT. Do not touch his pixels; if
   he reopens it, the fix is placement (drop the edge-scored tiles from the yard pool).
4. Doubling the art cell 44 -> 88 px ("thats down the line").

PEOPLE (7h9sfy): 8/1 (e) LATEST — THE FENCES ARE RE-CUT. The patch tool runs clean
again, round-trips byte-identically, and CANNOT eat another lane's code. Nothing in the
game changed.

=== WHAT THIS FIXED (the item my own last handoff called item zero) ===
tools/bohemia_people_identity_patch.py had one fence (PEOPLE:WORKERS) spanning another
lane's 29-line RUN PERSON FACTS block, so every re-run DELETED their code. Last turn I
shipped a guard that made it REFUSE instead of delete - safe, but the tool could no longer
run at all. This turn re-cuts the fences properly:
    PEOPLE:WORKERS  now closes at `var _agents = ...`, BEFORE their block
    <their RUN PERSON FACTS block, untouched, verbatim>
    PEOPLE:JOIN     opens after it and carries the residential guard + the concat
THE BUG THAT BEAT ME LAST TIME, named so nobody repeats it: B_JOIN's closing marker sat
BEFORE its own anchor line, so restoring the fence re-emitted the anchor and it resolved
twice. A fence must ENCLOSE the anchor it re-emits. Fixed and asserted.

SUCCESS CRITERION WAS A DIFF, NOT AN EYEBALL: three consecutive runs exit 0, the
round-trip diff is ZERO lines, and their block is still in the file.

=== GATE: people_gate part F, 6 claims, 106 total ===
F1/F2 the guard exists AND compares against the block's own insert text rather than
sniffing for banner comments (the first version of that guard flagged this tool's own
headers - a checker that cannot tell a mention from a use is the broken one, 8/1 law).
F4 NO FENCE SPANS ANOTHER LANE'S BLOCK - the invariant, checked statically against the
committed slice. F5 the specific shape: WORKERS closes before their block, JOIN opens
after. F6 their conditioning code is still there.
IT IS A STATIC CHECK ON PURPOSE: this gate must never RUN the tool, because the tool
writes files. Mutation-proved: putting the fences back the old way fails F4 and F5.

VERIFIED: PEOPLE 106/0, RUN 126/0, RUN PEOPLE 45/0.

=== WHAT COMES AFTER, in order ===
1. HIS ANSWER, still the one that unblocks the population work: walking one block from
   home, how many people should be on that street - nobody, a couple, or a dozen? Three
   candidate explanations are written up in
   records/BOHEMIA_HOW_MANY_PEOPLE_CONTRADICTION_8_1_26.md.
2. THE POPULATION SLIDER is plumbed and waiting (8/1 c). BohemiaPopulation.setDial(v),
   0..4, default 1. ACT_DIAL ships empty - which number each act wants is his.
3. VISITORS ESCAPE MASS EDITS. A worker standing at a job site is not in RUN_PEOPLE, so a
   bulk edit does not reach them - a real conflict with his 7/29 mass-edit condition. The
   fix is a unique person id for visitors (fromCell is already on them) threaded through
   peopleForAgents/conditionAgents. Both gates must be watched while doing it.
4. JOB_DISTRICTS is four entries; a FARM employs nobody. Valley-wide behaviour, WORLD's.
5. PARKED, DO NOT ASK: who he already knows. FACTIONS ARE OFF.

--------------------------------------------------------------------------------

LAB (e2r7sv): 8/1 LATEST — 12 QUESTIONS FOR PAOLO, EACH ONE CHECKED AGAINST CANON
FIRST. He asked for them: "Ask me big brain reference lab questions you need from me like
even the nitty gritty niche details of gameplay".

records/BOHEMIA_LAB_QUESTIONS_FOR_PAOLO_8_1_26.md — 12 questions in three tiers, each
carrying the search that PROVES it is not already ruled. Answerable in a word, in any
order, whenever. Nothing in it blocks a turn.
*** AND THE GATE I BUILT YESTERDAY VALIDATED THE LIST. *** gates/answered_gate.py sweeps
records/ for question-shaped text against the 23 settled rulings, this file is inside
that sweep, and it came back 13/0. The machine that exists because I asked him two
settled questions is now the thing that certifies a question list before he sees it. That
is the loop closing, and it is reusable by any lane that wants to ask him anything.

THE FOUR THAT CHANGE WHAT GETS BUILT (not just how):
  Q1 CAN YOU BE ATTACKED WHILE CAMPED? Never said anywhere. The whole mobile camp rests
     on it: safe = a save room, raidable = "should I stop here" becomes the best decision
     in the survival system.
  Q2 IS THE CROSSING INTERRUPTIBLE? 12,288 steps and nothing says whether anything can
     happen during them. Uninterruptible = the map is a menu.
  Q3 WHEN A GENERATION CHANGES, WHAT DOES THE HEIR KEEP? Canon says heirs inherit the
     choice log; it never says whether they inherit the CLOTHES (the progression),
     the standing, the companions or the gear. Biggest unknown in the dynasty spine.
  Q4 DOES THE CITY RUN ON THE SAME CLOCK AS THE RUN? One clock or two.

TWO REFERENCE GAPS WORTH KNOWING ABOUT EVEN IF HE NEVER ANSWERS:
  ROGUE FABLE IV is the most-cited reference in this repo (GDD, groove chain, camp law)
  and the lab HAS NEVER MEASURED IT. Strange hole.
  ROGUE LEGACY — the game that invented the dynasty roguelite, heirs inheriting traits
  and gold — appears NOWHERE in design canon. Closest existing thing to Bohemia's spine.

DELIBERATELY NOT ASKED: the camp law's ten open clauses, the action clock's denomination
and ceiling, the building catalog, the zone naming, how neglect bites without upkeep, the
gore overlays, non-combatants, how a body's state is shown. All already flagged
[PENDING Paolo] in their own laws. Repeating them would be noise.

NOTE ON THE REPO: my local checkout had fallen behind to an old commit while the remote
had all my work. Verified every file was present on origin/main before resetting onto it.
If that happens to you, CHECK THE REMOTE BEFORE ASSUMING ANYTHING WAS LOST.
PEOPLE (7h9sfy): 8/1 (d) LATEST — THE LANDMINE IS DISARMED. My own patch tool was
SILENTLY DELETING ANOTHER LANE'S CODE on every re-run. It now refuses instead. Nothing in
the game changed; the run slice on main is untouched and still 45/0.

=== WHAT WAS ACTUALLY WRONG (worse than the "tool drift" I wrote up last turn) ===
tools/bohemia_people_identity_patch.py fences its edits with PEOPLE:<name> markers and
RESTORES each fenced region before re-applying. Another lane anchored its RUN PERSON FACTS
block (29 lines: peopleForAgents + conditionAgents + rulesVersion) on a line INSIDE the
PEOPLE:WORKERS fence. So the marker pair came to span code that was not mine, and a re-run
DELETED IT - taking RUN_PEOPLE with it, which is exactly why run_people_gate went 45/0 ->
34/5 and why I could not reproduce the committed file. A tool that exists to make
cross-lane edits SAFE was doing the precise opposite, quietly.

=== WHAT SHIPPED: THE GUARD ===
restore() now takes the text the block is about to insert and refuses, loudly, if ANY
substantial line inside the fence is not in it. Exit 1, nothing written, names the line.
THE TEST IS EXACT, NOT A HEURISTIC - and that matters, because the first version of this
guard looked for banner comments and flagged THIS FILE'S OWN block headers. A checker that
cannot tell a mention from a use is the broken one (8/1 law). Second version compares
against the actual insert text and is right.
IT IMMEDIATELY FOUND A SECOND SWALLOWED FENCE I did not know about (PEOPLE:RUNTIME), which
is the whole argument for having it.

=== WHAT IS LEFT, AND IT IS SMALL AND PRECISE ===
The tool currently REFUSES TO RUN. That is the correct state - it is safe and loud instead
of destructive and quiet - but this lane cannot patch the run surface again until the
fences are re-cut. THE MIGRATION IS ONE EDIT TO THE COMMITTED SLICE:
  PEOPLE:WORKERS must END at `var _agents = BohemiaAgents.agentsForBlock(...)`, because the
  other lane's RUN PERSON FACTS block anchors immediately after that line. The residential
  guard + the workersForPlot concat move into a SECOND fence (PEOPLE:JOIN) placed AFTER
  their block, anchored on `SIM = BohemiaAgents.makeSim(`. B_SIM/A_JOIN/B_JOIN for exactly
  this are already written in the tool.
  I ATTEMPTED THE MIGRATION AND BACKED IT OUT: my rebuild left the JOIN anchor resolving
  twice (the B_JOIN text ends with the anchor line, so a careless splice duplicates it).
  The tool caught that too and refused. Do it with `diff` against the committed slice as
  the success criterion - ZERO diff lines - not by eye.

=== WHY IT WAS NOT FORCED THROUGH ===
Running out of room to verify a destructive edit to another lane's file is exactly when the
7/30 lesson applies (hand-resolving this same file ate a megabyte of somebody's work). The
guard is the part that makes everyone safer and it shipped; the re-cut is a fifteen-minute
job for a session with room to diff it properly.

=== EVERYTHING ELSE FROM TODAY STILL STANDS ===
The population dial (8/1 c), the workers arriving, the name-asking, the identity layer. The
open question is still his: walking one block from home, how many people should be on that
street.

--------------------------------------------------------------------------------

CHARACTER (0lurbs): 8/1 (r) LATEST — HAIR WAVE 2 SHIPPED AND JUDGED WELL. CORNROWS
IS HALF-FIXED AND I STOPPED AFTER THREE ATTEMPTS. THE MEASUREMENT IS BELOW — DO NOT
GUESS AT IT AGAIN.

=== THE ONE THING TO PICK UP FIRST ===
Paolo 8/1: "The cornrows is not one pixel of skin two pixels of hair what's wrong
with you?" He is right. I claimed it fixed WITHOUT MEASURING THE FRONT VIEW.

MEASURED, facing S, CORNROWS, H=hair pixel / s=skin showing through:
    row  5   sHHsHHss          1 skin : 2 hair   CORRECT
    row  6   sHHsHHsHHs        1 skin : 2 hair   CORRECT
    row  7   sHHsHHsHHsHs      1 skin : 2 hair   CORRECT
    row  8   sHssssssssHs      ONE pixel. no ratio at all.
    row  9   sHssssssssHs      ONE pixel.
    row 10   sHssssssssHs      ONE pixel.

ROOT CAUSE, located exactly: genHair has TWO drawing paths. Above frontLine the
main mass loop runs and applies `tex` (the 2:1 rule). Below frontLine, on a FRONT
facing, control passes to the two-curtain branch:

    if(front&&y>frontLine){ ... for(xl=mn;xl<fs[0]+w;xl++) put(...); ... continue; }

That branch draws SOLID and never touches `tex` at all, and its width
w = max(1, round(span*0.22)) resolves to ~1px on a 12px head. So more than half
the visible cornrow from the front is a bare line with no rows in it.

MY THIRD ATTEMPT MADE IT WORSE and is NOT in the repo: I added a skip-function to
both curtains with a 3px floor, and the RIGHT curtain vanished entirely (the base
index I passed to the skip test was wrong). Reverted. Do not re-apply that shape.
The branch needs REWRITING so both paths share one texture function, not patching.

BACK view is already correct (sHHsHHsHH...). Only the front curtains are wrong.

=== WHAT SHIPPED AND IS GOOD ===
HAIR WAVE 2 (8/1k) -- his verdict on it: "OK, very good a lot better the hair".
  Backs now cover the whole skull (sideBot=hBot on back facings) + a nape taper.
  The bug: sideF was applied on EVERY facing, so from behind -- where there is no
  face to avoid -- the mass stopped at 62% of head height and left scalp bare.
  Also: deterministic edge wobble (no straight lines), strip centring (Math.round
  breaks .5 UPWARD and put every mohawk one pixel right, forever), long styles
  peek from the front.
13 KEEP / 13 KILL, all 13 kills in the graveyard with his words as post-mortems,
  killed in the FACTORY TOOL's payload too or a re-run resurrects them.
THE CROWD + ONE ID ONE WHOLE PERSON (8/1c): twelve citizens, 12/12 distinct heads.
FACING (8/1j): curDir was written in ONE place (the CLOTHES preview), so every
  garment rendered front-facing everywhere. Coats opened down his spine.
A SHOE HAS A HEEL (8/1q): genShoes read no direction; 18/18 identical -> 0/18.
THE EAR IS GONE (8/1p): the ONLY edit ever made to his painted rig, authorised in
  his words "Delete them yourself". 10 pixels, pins moved in the same commit.

=== HIS RULINGS THIS SESSION, ALL IN LAW ===
laws/BOHEMIA_LAW_HOW_HAIR_AND_SHAPE_WORK_8_1_26.md  (gate: craft_law_gate.js, 28)
  Seven craft rules in his words. Clause 4 was AMENDED the same day: 2 hair : 1
  skin, superseding "just one pixel". BOTH wordings are on the page with the
  reason it moved -- 4a is the audit trail, do not tidy it away.
laws/BOHEMIA_ADDENDUM_A_HAIRCUT_IS_A_LUXURY_8_1_26.md
  Grooming is an ECONOMY. A fade needs clippers, power, and somebody to re-cut it
  every three weeks. A sharp fade is a RECEIPT, not a look. Unlock mechanism is
  [PENDING, HIS CALL] -- do not invent it.
records/HAIR_VERDICTS_WAVE1_8_1_26.txt   full verdict sheet + per-style quotes.

=== MISTAKES OF MINE WORTH NOT REPEATING ===
- I told him the identical heads needed NEW ART. False: NPCFactory had varied skin
  and hair since 7/2 and I was bypassing it. Zero new art was needed.
- I told him NO clothing generator was facing-aware. False: 12 of 13 were. My grep
  pattern was broken (d==='N' never matches dir==='N').
- I changed the hair texture from %3 to %2 on an over-reading of "just one pixel".
  The original was ALREADY RIGHT. He had to spend a turn correcting my regression.
- I said cornrows was fixed without rendering the front view.
  ALL FOUR ARE THE SAME FAILURE: claiming instead of checking.
- RIG CHECK caught four of my own citations naming things I never used.

=== [PENDING, PAOLO'S CALL] ===
1. The gameplay unlock for a fade (he said "maybe we can lock that behind some
   gameplay mechanics"). Clause 6 of the craft law is UNBUILT and gated as unbuilt.
2. Hair wave 3 -- only after he judges wave 2's rebuilt backs.
3. Names of the 13 surviving styles: PARKED by him explicitly. Do not raise it.
4. cough / whistle / search: frozen, two rejections each.

=== NOTE ON THIS SESSION'S ENVIRONMENT ===
The local checkout silently rolled back to a stale commit FOUR times. Work was
safe on the remote every time. If files you know you wrote are missing:
`git fetch origin main && git reset --hard origin/main` before believing anything.

ART (f3eu53): 8/1 (d) LATEST — HE CIRCLED THE TILE BORDERS AND HE WAS RIGHT. TWO REAL
BUGS, BOTH MINE, BOTH NOW GATED.

Paolo 8/1, with a screenshot of the yard and two horizontal bands circled in yellow:
"keep in mind with the textures. I don't want the borders of the tiles to look like that
you know I want it to be more seamless. I want [of] course to always be able to tell that
[there are] tiles in [those] squares, but the border is very important. The border speaks
a lot so just fix some of the borders."

=== MEASURED FIRST. HE WAS SEEING A REAL DEFECT, NOT A TASTE ===
Seam discontinuity, mean |luminance step| ACROSS the tile boundary relative to the
interior:
    MY tiles      vertical 1.67x   horizontal 1.25x
    HIS BOUGHT    vertical 0.62x   horizontal 0.77x
His seams are QUIETER than his own interiors, because his library is seam-processed.
Mine were nearly 3x that. Two causes, both mine:

1. NON-PERIODIC TERMS. The cook baked a LINEAR light gradient (bright upper-left, dark
   lower-right) and a grime band confined to the bottom 28% of the tile. Neither wraps,
   so every tile ended bright at its top edge and dark at its bottom edge and the grid
   stacked a dark-against-light step at EVERY horizontal boundary. Exactly the two bands
   he circled. Replaced with COSINE variation, periodic by construction.
   A baked per-tile light direction is wrong on its own terms anyway: every tile lit
   identically IS the grid, drawn in shading. Scene lighting belongs to the renderer.

2. MODULE PERIODS THAT DO NOT DIVIDE 44. 44 = 1,2,4,11,22,44 and nothing else. Five
   materials were cutting mid-pattern at every edge: shingle tabs at 15, ribs at 7,
   brick 6x15, ashlar courses at 15, fence planks at 9. All snapped to divisors, chosen
   to stay physically honest at 1px = 1.705cm: an 11px brick is 18.8cm (real modular is
   19.4), an 11px plank is a real 1x8 board, a 4px course is 6.8cm.
   Two intermediate values were rejected by MEASUREMENT, not by eye: a 4px rib divides
   44 cleanly but flips light-dark every 2px and measured 95-98% grain -- a wall of
   static, not siding. 11px is real wide-rib R-panel, which is what industrial siding
   and mobile homes actually use.

=== THE TEST HAD TO BE THE RIGHT TEST ===
"The seam is quiet" is the WRONG check: a block wall SHOULD have a mortar joint at the
boundary. That is the material, and an absolute threshold fails every structured tile.
The gate asks instead: IS THE SEAM WORSE THAN THE HARSHEST LINE THE MATERIAL ALREADY
HAS? If not, the boundary is indistinguishable from the pattern's own rhythm - which is
precisely what he asked for: still legible as tiles, no visible border.
    MINE now  0.86 / 0.84 (worst 1.06)      HIS  0.25 / 0.40
gates/texture_match_gate.py, 24 checks. Sabotage-tested by reintroducing his exact bug
(a non-periodic vertical gradient): the gate fails it at v2.55.
PROOF BY EYE: records/target/TEXTURE_SEAM_3x3.png - twelve materials laid 3x3. The bond,
courses, ribs and planks flow continuously across every boundary.

=== STATE ===
banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt  114 tiles / 38 materials, ALL APPROVED, CANON
The houses wear them (RUN tab). records/target/STREET_TEXTURED.png re-shot after the fix.
texture_match 24/24, banks_used 26/26, taste 27/27, reusefirst 85/85, alpha loads 20/20.

=== STILL DEBT ===
- HIS bought tiles also band in the yard, and I CANNOT fix those: VERBATIM OR NOT AT ALL.
  If that banding bothers him it is a PLACEMENT fix (drop the tiles whose content carries
  an edge-aligned score line out of the yard pool), never a repaint. Not done yet.
- House UPPER floor band, perimeter wall, gate mouth, garage mouth still target-set.
- His tiles carry BIG FEATURES (a manhole, a weed clump, a long crack); mine are
  consistent texture. Same material family, not yet the same pack.
PEOPLE (7h9sfy): 8/1 (c) LATEST — THE POPULATION DIAL. Plumbing for the slider he said
he is going to make. Record: records/BOHEMIA_POPULATION_DIAL_8_1_26.md

HIS WORDS: "do some coding plumbing right now till I make a population slider ... extremely
important as we go throughout the three acts ... extremely easy to control ... the slider
can go all the way from zero to a maximum."

ONE NUMBER. Everything that asks how many people live somewhere multiplies by it.
    0    A GHOST VALLEY - nobody, anywhere. A real zero or the bottom of his slider is a lie.
    1    exactly what the world does today. THE DEFAULT, so nothing moved.
    4    DIAL_MAX, the fullest it is allowed to get.
    dial 0 -> 0 people | 0.5 -> 1,037 | 1 -> 2,147 | 2 -> 4,310 | 4 -> 7,026 (sampled 1/9 of cells)

THE ONE DESIGN DECISION: THE DIAL SAYS HOW MANY, NEVER WHERE. His 7/29 ruling is that the
valley is clusters AND no man's lands - a SHAPE, not a number. Turning it down THINS the
same valley and never relocates anybody; cells alive low are a strict subset of cells alive
high. Gated.

IT REACHES BOTH PATHS - the zone map inside occupiedRateFor AND the agents module's own
placeholder - because "zero means nobody" has to be true whichever way a caller got its rate.
That also closes half of the three-way contradiction found earlier today: the number is now
changeable in ONE place.

FOR WHOEVER BUILDS THE SLIDER: call BohemiaPopulation.setDial(v) and rebuild the block.
That is the whole API. dial() / setDial() / applyDial() / DIAL_MIN / DIAL_MAX.

ACT_DIAL SHIPS EMPTY and dialForAct() returns null. He said the slider matters across the
three acts; WHICH number each act wants is his. people_gate fails if a row lands unruled.

GATE: people_gate.js part E, 11 claims, 100 total. Includes the REAL RUN emptying when the
dial goes to zero, because a dial nothing consumes is a decoration. Two mutations proved
red-able: zero quietly stopping meaning zero, and placeholder act numbers in his table.

STILL HIS, UNCHANGED BY THIS: which answer is right. Walking one block from home, how many
people should be on that street.

--------------------------------------------------------------------------------

ART (f3eu53): 8/1 (c) LATEST — ALL 90 APPROVED, HIS COLOUR RULING APPLIED, AND THE
TEXTURES ARE NOW ON THE HOUSES. 114 tiles / 38 materials.

Paolo 8/1: "I approve of them all! Dont be scared to have a little more variety in
color! Great job"

=== HIS COLOUR RULING CORRECTED A REAL MISTAKE OF MINE ===
The style target measured his tiles at MEAN saturation 0.189, and this cook read that
MEAN AS A CEILING: capped every base at 0.30 and pulled everything to one desert
neutral. Measured per tile, his shipping ground art actually runs 0.058 to 0.501 --
a 9x spread -- and the cook was huddling at the bottom of a band that was itself far
tighter than his library. THE TOLERANCE IS NOW DERIVED FROM HIS OBSERVED SPREAD, not
from numbers I picked that felt about right.

*** AND THE SPLIT THAT MATTERS, because a derived band nearly undid the whole thing:
COLOUR is a spread to REPRODUCE -> saturation takes his FULL observed range.
DETAIL DENSITY is a floor to HOLD -> deriving from his absolute minimum put the edge
floor at 7.05, which is exactly where the REJECTED house skins (9.4) and CMU wall (7.1)
measured. A derived band that readmits the art it was built to keep out is worse than
no band. Edge and grain now take a 25th-PERCENTILE floor: still his real art, never his
softest outlier used as a licence. Edge floor 14.27. ***

New colourways per his ruling: sage, desert rose, blue-grey, butter yellow stucco;
slate barrel tile; weathered green shingle; ribbed garage door; chalked white trim.
Plus PER-VARIANT hue/chroma jitter, so a material's three variants are three colourways
instead of three noise seeds of one colour. A street of identical stucco is not a street.

=== WIRED. THE HOUSES WEAR THEM NOW (RUN TAB, walk out the front door) ===
tools/build_run_slice.js + slices/BOHEMIA_RUN_SLICE_7_26_26.html: the wall and roof
FIELD draws from the 8/1 approved texture set instead of the 7/21 painted skins. Both
sets are his, so this is newest-date-wins on a MEASURED difference: the 7/21 skins
average 81 colours per tile at edge 9.4; his own bought ground art measures 1443 at
edge 20.9. The 7/21 skins are exactly what made the houses read as flat mush directly
above his rich bought asphalt.

*** THE THING THE NUMBERS COULD NOT SEE, caught by walking out the door and LOOKING:
the first wiring left roof HIPS and wall_base on the target set. That was fine while
the field wore the tonally-close 7/21 skins; against a dark weathered shingle the
target set's BRIGHT ORANGE CORRUGATED hip read as a garish stripe down every house --
VISIBLY WORSE THAN BEFORE THE WIRING, with every gate green either way. Hips and
wall_base are skinned now. records/target/STREET_TEXTURED.png is the after. ***

=== A TEST THAT COLLIDED WITH HIS RULING, AND HOW IT WAS RESOLVED ===
The PINK negative test (from the salmon bug) fired on the desert-rose stucco added
BECAUSE he asked for colour variety. Banning a hue outright was wrong and so was
deleting the test. Materials now DECLARE an intentional colourway (rosy=True) and the
gate exempts only declared ones; an undeclared pink still fails. Sabotage-tested: a
pinked undeclared tile trips it.

=== STATE ===
banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt  114 tiles / 38 materials, ALL APPROVED, CANON
gates/texture_match_gate.py             22 checks
records/BOHEMIA_VERDICT_TEXTURE_MATCH_8_1_26.txt  both verdicts, verbatim
run_gate 126/126, bought_beats_painted 16/16, wallclass 19/19, houseart 24/24

=== STILL DEBT ===
- The house UPPER floor / interior band is still flat target-set tan in the shot. Next.
- Perimeter wall, gate mouth and garage mouth still target-set.
- His tiles carry BIG FEATURES (a manhole, a weed clump, a long crack); mine are
  consistent texture. That is the gap between "same material family" and "same pack".
- Doubling the art cell 44 -> 88 px ("thats down the line").

ART (f3eu53): 8/1 (b) LATEST — HE APPROVED ALL 36 ("fucking fantastic"), SO THE VOLUME
IS SPENT: 90 TILES ACROSS 30 MATERIALS, AND THE 18 BLOCKED ART FORMS ARE UNBLOCKED.

=== THE VERDICT (records/BOHEMIA_VERDICT_TEXTURE_MATCH_8_1_26.txt) ===
Paolo 8/1, verbatim: "Holy shit so fucking good I'm so proud of you. That's awesome. I
approved thumbs up. It's looking so good so realistic this might be the most impressive
thing you have done for me this whole fucking ... The graphics tiles that you made are
fucking fantastic thank you"
ALL 36 OF BATCH 1, THUMBS UP. First art this lane has landed after three straight kills.

=== WHY IT LANDED, AND IT WAS NEVER THE SHAPES ===
                        colours/tile   edge   grain    sat
    HIS BOUGHT concrete        1443    20.9   64.7%   0.274
    my recooked tileset         417     8.7   24.4%   0.323
    my house skins               81     9.4   26.2%   0.383
    my CMU wall                   4     7.1   14.4%   0.082
HIS ART IS ROUGH AND GREY. PAINTED ART HERE WAS SMOOTH AND TOO COLOURFUL. ~2.5x his
local contrast, ~2.7x his grain, at ~60% of his saturation. A different ORDER OF DETAIL,
which no choice of colours fixes. Every earlier post-mortem blamed the house shapes.

=== APPROVAL UNLOCKS VOLUME, SPENT THE SAME TURN ===
banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt is now 90 tiles / 30 materials, 90/90 inside the
band measured off his purchases. The 18 filed ART forms were blocked because nobody
could state "the look" in terms a cook could aim at; records/BOHEMIA_STYLE_TARGET_8_1_26
.json now states it in numbers off his own tiles. Covered this turn:
  TF-ART-001 CMU block      TF-ART-009 brick (running + painted over)
  TF-ART-002 corrugated     TF-ART-010 rail ballast
  TF-ART-003 lot asphalt    TF-ART-011 freeway asphalt
  TF-ART-005 dead turf      TF-ART-012 tar-and-gravel roof
  TF-ART-006 pool basin     TF-ART-013 mobile home ribbed siding
  TF-ART-007 civic ashlar   TF-ART-014 dead furrowed crop field
  TF-ART-008 storefront     TF-ART-015 landfill cover cap
plus tilt-up concrete, rusted steel, weathered wood fence, tar paper, grey stucco, red
adobe, and the twelve he approved.

=== VERDICTS DO NOT BLUR (gated) ===
Re-running the cook silently relabelled his 36 approved tiles and 54 brand-new ones with
one status. Fixed: EVERY TILE CARRIES ITS OWN VERDICT, the approved material set is
named so it cannot drift, and the gate asserts exactly 36 tiles claim his approval.
A bank that calls 90 tiles canon because 36 siblings were thumbed up is how unjudged art
walks into the game.

=== TWO THINGS CAUGHT BY LOOKING AT THE VOLUME BATCH ===
GREEN TURF   a green playing field in a dead desert city is a lie about the premise.
             Dead Bermuda is STRAW. Base moved decisively red-over-green.
LIT GLASS    the storefront came out a PALE grid. Act-1 has dead-dark glazing and 12%
             power. Darkened -- then the first fix went too far: pitch-black glass
             against bright aluminium put the tile's luminance SPREAD at 78 against his
             20-42. WIDENING THE TOLERANCE TO LET MY OWN ART THROUGH WOULD HAVE BEEN
             MARKING MY OWN HOMEWORK, so the art moved instead, not the ruler.

=== STILL WEAK, SAID AT THE MOMENT OF SUCCESS ===
His tiles carry BIG FEATURES that break the field: a manhole, a weed clump, a long
crack. Mine are consistent texture at the right density. That is the distance between
"same material family" and "same pack", and it is the next cook.

=== PENDING PAOLO ===
- 54 NEW TILES ARE UNJUDGED (everything past the 12 approved materials). Thumbs on
  records/target/TEXTURE_MATCH_CONTACT.png.
- WIRING: the approved textures are cooked but the run still dresses house body,
  perimeter wall, gate mouth, garage and upper floor with the OLD smooth art. That is
  the next execution and it is what he will actually SEE.
- Doubling the art cell 44 -> 88 px ("thats down the line").
- Houses: the SHAPE work can reopen now. The texture finding is the reason - the shapes
  were never what was wrong.
PEOPLE (7h9sfy): 8/1 (b) LATEST — I WENT LOOKING FOR THE EMPTY ROADS AND FOUND
SOMETHING BIGGER: THE VALLEY HOLDS SIXTY PEOPLE. Nothing in the game changed; this is
a measurement and a [PENDING Paolo]. Full write-up:
records/BOHEMIA_HOW_MANY_PEOPLE_CONTRADICTION_8_1_26.md

*** I ALSO HAVE TO CORRECT MY OWN LAST TURN. *** The "8,282 residents / 2,306 workers"
I reported hours ago counted a population THE GAME DOES NOT HAVE - they came from the
agents module's flat 0.30 placeholder, not from the zone map the run actually uses. The
worker feature is real and unaffected (the run passes its own rate); the valley-wide
NUMBERS were wrong and are corrected below.

=== THE MEASUREMENT (same valley, seed 7, three live sources of truth) ===
  flat OCCUPIED_RATE=0.30 placeholder  -> 8,282 residents, 36% of cells
  Paolo's ZONE MAP (7/29, his ruling)  ->    60 PEOPLE IN THE WHOLE VALLEY, 1% of cells
  GDD v5 (~3% of 2.3M survive)         -> ~69,000 people
Sixty, eight thousand, sixty-nine thousand. On cell 39,22 the two rates differ SIXTYFOLD.

=== WHY NOBODY SAW IT ===
The run is on the zone map and does not FEEL empty, because it applies a 6-household
FLOOR to the player's own cell only. Measured on the real surface:
    39,23 the player's block  13 people   (that is the floor)
    39,22 one block north      0 people
    39,24 one block south      0 people
Walk one street over and the neighbourhood is dead. Every other consumer (gates, city
tab, this lane's own numbers) calls agentsForPlot with no rate and gets 0.30, so the run
and everything reasoning about the run describe two different cities.

=== WHAT I DID NOT DO ===
I made the zone map the default inside agentsForPlot, measured it, and BACKED IT OUT. It
makes everything agree - on 60 people in a city, which contradicts his own GDD by three
orders of magnitude. Making every consumer agree on a suspected-wrong number spreads the
bug instead of containing it, and choosing between two live rulings is not a mechanism
call. The disagreement is documented AT THE CALL SITE so the next reader cannot miss it.

=== AND IT KILLS THIS LANE'S OWN QUEUED NEXT ITEM ===
"Put travellers on the empty roads" was queued last turn. A cell is 96m x 96m
(valley_scale_gate), so a three-cell commute is under 300m - about four minutes' walk.
Rendering commuters mid-journey would be INVENTING traffic, not showing it. The roads
being empty is not the bug. The population number is.

*** IF YOU EDIT AN ENGINE MODULE, RUN `node tools/build_run_slice.js`. ***
The builder inlines every engine module into slices/BOHEMIA_RUN_CURRENT.html, so a
one-line COMMENT in engine/*.js makes the committed run stale and run_gate says so
("regenerating changes nothing" -> 125/1). Caught before pushing. The builder alone is
safe; it is the PATCH TOOL below that is not.

*** A DEFECT IN THIS LANE'S OWN PATCH TOOL — FIX THIS FIRST. ***
tools/bohemia_people_identity_patch.py is supposed to be safely re-runnable on top of
whatever main has. IT IS NOT, ANY MORE. Main's run slice passes RUN PEOPLE 45/0; run the
tool on it and the same gate goes 34/5. The tool's restore-then-reapply no longer
reproduces what is committed, because other lanes have edited the slice around its
markers. NOTHING WAS SHIPPED THROUGH IT THIS TURN - main's slice was taken verbatim and
this turn ships only a comment, a record and the handoff.
WHAT THE 5 FAILURES ARE, because they are a REAL conflict and not just tool drift:
run_people_gate's count() is SIM.agents.length while facts() is RUN_PEOPLE, and the
visiting workers this lane added are in the first and not the second - so "one person
record per agent" breaks, and worse, VISITORS ESCAPE MASS EDITS, which is a direct
conflict with Paolo's 7/29 mass-edit condition. Visitors cannot simply be added to
RUN_PEOPLE either: it keys by agent.id and H1-1 exists on every block, so a visitor
collides with the local resident of the same id.
THE FIX IS A UNIQUE PERSON ID FOR VISITORS (their home cell is already on them as
fromCell), threaded through peopleForAgents/conditionAgents. It needs doing carefully
with both gates watched, and it was NOT attempted on a thin context.

=== THE SHIPPED SUITE'S TWO REDS, PROVED INHERITED ===
PARTS PAINTED  "no part is empty on any facing [NE/2, NW/2]"  21 pass / 1 fail
BODY VARIATION the frame cache hashes the dials                40 pass / 1 fail
Both come back BYTE-IDENTICAL on origin/main (8dd19d8) with this lane's work removed, so
neither is this lane's. They are the CHARACTER lane's rig/body work, in flight today.
Flagged by owner, not fixed here.

=== FLEET-WIDE, NOT THIS LANE: THE BROWSER GATES FLAKE UNDER SUITE LOAD ===
THREE separate real-browser gates went red exactly once each inside the full suite today
and passed standalone immediately after, repeatedly:
    SFX WIRED     red in suite -> 150/0 standalone, twice
    ANSWERED FOR  red in suite -> 11/0 standalone, twice
    THE RUN       red in suite -> 126/0 standalone, THREE times
The suite run that failed THE RUN took 1245s against a normal ~760s, so the machine was
heavily loaded. These gates drive real Chromium and real audio and they are timing out,
not finding defects. NOBODY SHOULD CHASE A GHOST: if one of these is red once, run it
alone before believing it. Somebody should give the browser gates a retry-once or a
serialised slot - any lane can take it, it is not cook work. Reported rather than quietly
re-run until green, because "I ran it again and it passed" only means something if it is
said out loud.

=== WHAT COMES AFTER, in order ===
1. HIS ANSWER, in one sentence: walking one block from home, how many people should be
   on that street - nobody, a couple, or a dozen? Three ways out are written up in the
   record (zone constants too low / the GDD's 3% is stale / everyone is indoors in the
   Mojave heat). ONE of them is right and it is his call, not a mechanism call.
2. Whichever way he rules, the FIX IS ONE PLACE: agentsForPlot's rate, plus deleting the
   run's home-cell floor if the answer is "the valley really is that empty".
3. Still true from earlier today: JOB_DISTRICTS is four entries (a FARM employs nobody),
   and squatting outside housing is [PENDING Paolo].
4. PARKED, DO NOT ASK: who he already knows (KNOWN_AT_START). FACTIONS ARE OFF.

--------------------------------------------------------------------------------

RUN (eak241): 8/1 LATEST — HE CAN HEAR HIS STEPS, THE STREET IS HIS AGAIN, AND
"INSIDE" IS NOW A FACT ABOUT THE CELL INSTEAD OF A STATE OF THE PLAYER.

Paolo 8/1, four rulings, all four answered:
  1. "I don't hear sound at all... even when I take steps I don't hear no sound"
  2. "all the street tiles you have to change back to how they were when I like
     them, not when you" (he wrote records/BOHEMIA_WHERE_THE_GOOD_STREET_PIXELS_ARE)
  3. "freeways and railyards do not get sidewalks"
  4. "you can take a shot at interior rebuilds, do big brain online research"

=== SHIPPED ===
FOOTSTEPS. His 7/30 bank had 38 judged sounds including step_dirt/asphalt/gravel,
  five approved variants each. The CITY frame -- the surface he actually walks --
  asked for ZERO of them. 'step_asphalt' appeared 0 times in the renderer. Now the
  city posts a footfall with the surface read off the tile dossier, the shell plays
  his approved variant, ONE AudioContext (the parent's). Measured on a real browser:
  64 -> 133 audio nodes while walking. gates/footstep_gate.js, 14 checks.
STREET TILES. Measured on the surface he plays, before the fix:
      pool     his bank      what the city drew      byte-identical
      street   18 @ 44x44    6 @ 16x16               0
      side     36 @ 44x44    6 @ 16x16               0
  Not ONE tile he approved was on screen -- under a comment that NAMED his bank.
  A citation that is a lie. gates/street_source_gate.js compares BYTES, never a
  citation, and checks the 44x44 size because the re-cook is how it drifted.
  His weather_rarity ruling (88/12) now travels WITH the tiles, at pick time.
ONE WORLD INTERIORS, STEP 1 OF 6. Spec written from research BEFORE any code:
  records/BOHEMIA_ONE_WORLD_INTERIORS_SPEC_7_31_26.md. Project Zomboid keeps
  interiors on the SAME grid -- inside/outside is a DETECTION, not a mode -- and
  flood fill over connected roofed tiles is the standard reveal.
  engine/bohemia_rooms.js  4-connected flood fill; every cell gets room (0 =
    outdoors) and roof. FOUR-connected, never eight: two houses touching at a
    corner are two buildings, and welding them makes every roof on a block vanish
    at once. NOTHING renders differently yet, by design.
  engine/bohemia_world.js  tileInfo() now carries room/roof/inside; the plot
    answers roomAt()/insideAt(). What counts as indoors comes from the district's
    OWN building list unioned with its dossier legend, never a hardcoded code.
  gates/rooms_gate.js  23 checks including a REAL BROWSER half.

=== THE NEXT SESSION IN THIS LANE PICKS UP AT STEP 2 ===
The spec's build order, each step green on its own:
  2. stamp the floorplan INTO the world grid  <-- NEXT
  3. one movement predicate; delete passInt
  4. roof-by-room reveal on the overhead layer
  5. delete mode/enter()/leave()/fp so the old path cannot return as a fallback
  6. room-driven materials + windows that see the world
THE TRAP, PROVEN TWICE THIS SESSION: the RUN tab opens the CITY blob. Two render
fixes landed in the run slice and were INVISIBLE to him ("ALL THE FIXES I NEEDED
TO SEE ARE NOT THERE"). Steps 3, 4 and 6 are RENDER-side and must land in the city
blob via a patch tool (it is base64) or they do not exist.

=== WHAT IS HONESTLY STILL OPEN ===
HIS PIXEL-QUALITY COMPLAINT ("WHY IS THE PIXEL QUALITY NOT AT FULL BRO WTF") is
  STILL UNEXPLAINED. I guessed once, shipped a devicePixelRatio "fix" that was a
  PLACEBO -- the CITY lane had already solved it on 7/27 with image-rendering:
  pixelated, so my change produced identical output at 9x the memory and broke a
  locked contract. Reverted, tool deleted. DO NOT GUESS A THIRD TIME. Measure on
  the city canvas first.
D1 (no building mass on a public sidewalk) is true in 1 of 48 districts. 5,195
  mass cells still sit on streets: mall 1566, industrial 1455, trailer 498, farm
  438, battery 360, medical 288, +5 more. Suburb is fixed and gated. The registry-
  wide gate needs layWalks promoted to a kit primitive; his freeway/railyard
  exemption (ruling 3 above) is recorded and unblocks it.
bohemia_mall.js:55 runs a drive lane THROUGH both anchor stores (38 cells inside
  the west anchor after another lane's rebuild). Rerouting is layout design =
  MAP LAW, so it is [PENDING] the owning lane or Paolo.
12 of the 17 BUILT WORLD LAW clauses are still NOT ENFORCED (the law file names
  which, honestly, in its GATE column).

=== PROOF ===
ALL GATES GREEN (885s, full suite, uncontaminated) on the twice-rebased tree.
Both new gates sabotage-tested: an 8-connected fill fails the corner fixture, a
leaked predicate fails the open-ground sweep, and stripping the rooms module from
the built surface fails all four browser checks.

=== A PROCESS NOTE WORTH KEEPING ===
Three lanes pushed to main during this session's gate runs, and the alpha's 32MB
base64 CITY_B64 CANNOT be merged by git -- both sides rewrite the whole line.
The resolution that works: take MAIN's blob, then RE-APPLY your own city changes
by re-running your patch tools. That only works if every city patch tool is
IDEMPOTENT and refuses to write when its expected source text is missing. Write
them that way. It saved this ship twice.

ART (f3eu53): 8/1 LATEST — I FINALLY MEASURED WHY MY ART LOOKS WRONG NEXT TO HIS, AND
IT WAS NEVER THE SHAPES. Paolo 8/1: "make as much pixel art that I approve of for
everything we need in the game as possible INSPIRED BY THE GRAPHIC ASSETS THAT I BOUGHT
TRYING TO REPLICATE THE EXACT LOOK I don't know what's so difficult"

*** READ THE TABLE. IT EXPLAINS THREE REJECTED BATCHES. ***
                            colours/tile   edge   grain    sat
    HIS BOUGHT concrete            1443    20.9   64.7%   0.274
    my recooked tileset             417     8.7   24.4%   0.323
    my house skins (he UP'd)         81     9.4   26.2%   0.383
    my CMU wall                       4     7.1   14.4%   0.082
    my perimeter wall              1222     7.0   23.2%   0.466

HIS ART IS ROUGH AND GREY. MINE WAS SMOOTH AND TOO COLOURFUL. He carries ~2.5x the local
contrast and ~2.7x the grain density at ~60% of the saturation. That is not a palette
disagreement, it is a different ORDER OF DETAIL, and NO CHOICE OF COLOURS CLOSES IT. A
13-colour flat ramp cannot sit beside a 1,300-colour photographic texture and read as one
game. Every house rejection was blamed on shapes. The shapes were not the problem.
  edge  = mean |luminance delta| between horizontally adjacent pixels
  grain = % of adjacent pairs differing by more than 8 luminance

=== SHIPPED (NOT IN A TAB YET - a bank, a gate and a contact sheet) ===
tools/bohemia_style_target.py       derives THE LOOK off the concrete + street packs he
  BOUGHT and that already ship. Cooks nothing. -> records/BOHEMIA_STYLE_TARGET_8_1_26.json
  TARGET: 1260 colours, edge 18.4, grain 61%, sat 0.19, lum 83 sd 27.
tools/bohemia_texture_match_cook.py 36 tiles / 12 materials, all for surfaces HIS LIBRARY
  DOES NOT COVER (house walls and roofs - he owns none, proven 7/31). Material body +
  real structure + 4-octave fbm + per-pixel speck + wear + one light from upper left.
  Every tile is MEASURED AFTER DRAWING and redrawn until it lands inside his band; a cook
  that cannot hit it fails loudly instead of shipping something smooth.
  -> banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt  (status PENDING PAOLO)
  -> records/target/TEXTURE_MATCH_CONTACT.png  HIS TILES ON THE TOP ROW, MINE UNDER THEM
  RESULT: 36/36 in tolerance. MINE 1646 colours, edge 18.6, grain 72.7%, sat 0.242.
gates/texture_match_gate.py         16 checks, registered as TEXTURE MATCH. The ruler is
  HIS OWN TILES, RE-DERIVED EVERY RUN so it can never drift off his library.

=== THREE DIALS, AND THE FIRST VERSION ONLY HAD ONE ===
grain (how much of the tile changes), edge (how hard it changes between touching pixels),
and base VALUE (the material itself). Chasing grain alone pinned edge at 12 against his
18.4 and everything came out soft. The fix for edge was a PER-PIXEL UNCORRELATED term:
fbm is bilinear-smoothed so neighbours correlate, and a photographic texture is
essentially independent at the finest scale.

=== TWO FAILURES CAUGHT BY LOOKING, NOW PERMANENT NEGATIVE TESTS IN THE GATE ===
PINK  capping saturation at constant VALUE turns a dark red into SALMON. The first run
      made pink stucco and a pink terracotta roof. Desaturation must HOLD LUMINANCE so
      clay goes brown, not pale. Two base colours were also just too red and were fixed
      (ochre adobe; dark weathered terracotta).
MUSH  at this grain the material's own structure was being BURIED - fields of noise that
      hit every number and told you nothing about what you were looking at. Structure
      amplitude doubled. Gate threshold was first set at 12 when real tiles measure
      37-82, i.e. a check that could never fail; tightened to 25.
Both sabotage-tested: a pinked tile and a structureless tile both trip the gate.

=== WHAT IS HONESTLY STILL WEAK ===
His tiles have BIG FEATURES that break the field - a manhole, a weed clump, a long crack.
Mine are consistent texture at the right density. That is the next step and it is the
difference between "same material family" and "same pack".

=== ALSO THIS SESSION ===
- His bought dirt now dresses the YARD (7/31 c section below). His concrete pack is a
  desert RANGE, not one texture; split by saturation, brown half to yard, pale half to
  sidewalk. No pixel changed. Debt 6 -> 5 surfaces.
- The bought-tile CONDITIONER was built and killed by him on sight: it enforced an
  "act-1 no pure black" law THAT DOES NOT EXIST. Graveyarded. THE TELL: it condemned
  1,410 of his 1,506 tiles. When a rule condemns 94% of what the man bought, THE RULE IS
  WRONG, NOT THE LIBRARY.
- He owns NO house wall and NO house roof in 2,525 purchased tiles. That is why these
  surfaces are painted, and it is his law's clause 5 named debt, not laziness.

=== PENDING PAOLO ===
- THE 36 TILES ARE UNJUDGED. Thumbs on records/target/TEXTURE_MATCH_CONTACT.png.
- A suburban wall/roof pack is still the highest-leverage purchase for this lane.
- Doubling the art cell 44 -> 88 px ("thats down the line").
- Houses: the SHAPE work is still dead this session. The texture finding above is the
  reason to reopen it, because the shapes were never what was wrong.

CHARACTER (0lurbs): 8/1 (c) LATEST — THE CROWD + ONE ID, ONE WHOLE PERSON.
THE POPULATION REACHES THE SCREEN, AND LOOKING AT IT FOUND THREE BUGS EVERY GREEN
GATE HAD MISSED. THE THIRD ONE WAS A FALSE CLAIM I MADE ABOUT THE CODEBASE.

Paolo: "Awesome looking good. WE HAVE 11 months of forward motion work we need to
complete. Do what you have to do next and know what comes after do big brain online
research if you need to then execute."

=== THE GAP, MEASURED BEFORE BUILDING ===
The lane owned one painted rig, six body dials, 221 approved garments, 102 clips --
and NOTHING that turned them into a POPULATION. No seed, no per-agent body, no
per-agent outfit. A city shipping 296 lives was shipping 296 copies of the same man.
Every ingredient existed; the recipe did not.

=== WHAT SHIPPED ===
BOH_PERSONLOOK (engine/bohemia_personlook.js, inlined in the ONE alpha): a pure
function, id -> {body: six dial values, worn: an outfit}. Deterministic by
CONSTRUCTION (FNV-1a + murmur3 finalizer, salted per field, no Math.random anywhere)
so an NPC looks the same when you walk away and come back and across a save. A soft
bell, not a flat roll -- most people near the middle, a few not. The crowd range is
NARROWER than the editor range on purpose: the sliders exist so HE can push a body to
an extreme; a street should read as ordinary people, not a carnival. It holds NO
garment names -- reads the canon pool live, so anything he kills leaves the streets
automatically. Does not touch skin tone (his ruling), does not touch the rig (ONE
RIG 7/25), carries no sex term (FAT IS FAT 7/29).

THE CROWD BOARD (CHARACTER tab, under the wardrobe): twelve citizens drawn THROUGH
drawChar -- the real path, cache and all -- by installing each person's dials and
outfit and handing his own look straight back in a finally block. NEW CROWD walks to
the next twelve. AUTO-SPIN turns all of them. Still, not animated: twelve animated
bodies would churn 12 x 24 cache buckets a frame on his phone to answer a still-frame
question. NEVER buildFrame -- that is the side door SHUFFLE FIT fell through.

=== TWO BUGS THE BOARD FOUND THAT NOTHING ELSE DID ===
(1) THE DIALS WERE CORRELATED. Two of the first twelve came out with BYTE-IDENTICAL
bodies. Plain FNV-1a ends on (h ^ lastByte) * prime, and the low bits of a product
depend only on the low bits of its inputs -- ids differing only in the last character
cluster down there, and % 100000 reads almost entirely low bits. Real ids are
SEQUENTIAL (npc-0, npc-1 ...), the exact worst case. 64 sequential ids, distinct
values per dial: BEFORE height 31 belly 29 arms 24 shoulders 27 armLen 24 hips 17;
AFTER 59 / 64 / 60 / 59 / 63 / 60. 2000 sequential ids now give 2000 distinct bodies.
WHY THE GATE MISSED IT: it read "200 people give 188 distinct bodies" the whole time,
because distinct-as-a-TUPLE hides a dial that barely moves -- six dials only have to
disagree in ONE place. It now measures EVERY DIAL SEPARATELY on SEQUENTIAL ids.

(2) THE ENGINE SYNC CHECK WAS A PREFIX CHECK. It compared the first 400 characters,
which is the module's header comment. The hash fix landed at the BOTTOM of the file,
the alpha kept the old broken copy, and the check stayed green. A prefix comparison
is not a comparison. Now all 6,974 bytes, and tools/bohemia_personlook_sync.py owns
the inline so it is never a hand edit again.


=== THE THIRD BUG WAS MINE: A FALSE CLAIM, REPEATED IN FOUR PLACES ===
BOH_PERSONLOOK's header said "Nothing in the repo varies a person's appearance --
no seed, no per-agent body, no per-agent outfit." That went into the module, the
gate header, the commit message and the write-up. IT IS FALSE. NPCFactory has been
in engine/bohemia_engine.js since 7/2/26: seeded, deterministic, wired into the RUN
and the SLICE and the RANDOM CITIZEN button, and it varies SKIN TONE (his 9 locked
ramps) and HAIR COLOUR. Measured on 8 ids: 6 distinct skin tones, 5 distinct hair
colours. It has worked the whole time.

THE REAL GAP was two halves of one person, keyed by two different ids:
  NPCFactory      skin + hair; cannot vary body (predates the dials) or clothes
                  (reads only PD.layers, one option per slot)
  BOH_PERSONLOOK  body + clothes; does not touch skin or hair
Nothing ever handed them the SAME id, so no caller assembled a whole person.

AND THE FALSE CLAIM COST SOMETHING REAL. Because the board used only PERSONLOOK,
its twelve citizens shared one skin tone and one hair colour, and I wrote that up
to Paolo as "a CONTENT gap -- fixing it means cooking new art, which is your call."
It was not a content gap. It was me bypassing a working system, and it was one
green light away from spending his judgement on art nobody needed. WITHDRAWN.

THE FIX: the crowd asks NPC_FACTORY for the SAME id it asks PERSONLOOK for. One id,
one whole person. No new mechanism for skin or hair -- ENGINE SYNC LAW, the module
that already owns those fields keeps owning them. ZERO NEW ART. The board went from
one head shared by twelve to 12/12 DISTINCT HEADS.

WHY NO GATE CAUGHT IT: the crowd gate hashed the WHOLE SPRITE and read 12/12
distinct, because bodies and clothes differ enough to mask a region that never
changes at all. It now hashes the HEAD REGION SEPARATELY. A metric that averages
over the whole sprite cannot see a constant sub-region.

STILL TRUE, and it is a nice-to-have not a blocker: one painted haircut SHAPE and
one painted face SHAPE exist, so citizens differ in colour and complexion, not in
silhouette. More haircut shapes would help. It must not be sold to him as the thing
standing between this and a city, because that was the mistake.

=== GATES ===
PERSON LOOK (gates/personlook_gate.js, 19) — the function.
THE CROWD (gates/crowd_gate.js, 16) — the PIXELS, in a real browser: twelve canvases,
none blank, none identical, redraw byte-identical, NEW CROWD brings strangers, and his
own look + his own canvas come back untouched.
Both registered in the suite. Full suite green on a tree built from current main.

=== NOTE ON THE CROWD GATE'S OWN FIRST TWO RUNS ===
It failed itself twice on "it NEVER calls buildFrame" -- because the renderer's HEADER
COMMENT says "Never buildFrame". First fix stripped comments and STILL failed: the
captured block started mid-comment, so there was no opening slash-star for the
stripper to find. A comment stripper is only correct on a whole comment. Same family
as the person-look gate failing three checks against its own header. Documenting a
rule is not breaking it.

=== [PENDING, PAOLO'S CALL] ===
1. Do the twelve read as HIS people, or as one man in twelve coats?
2. Are the bodies too varied, not varied enough, or right?
3. Wear odds as shipped: outer 45%, head 30%, neck 22%, waist 18%, back 16%,
   hands 14%, gear 12%, face 10%. One line in the module, free to change.
4. EVERY CITIZEN HAS THE SAME FACE AND THE SAME HAIRCUT, and it is a CONTENT gap,
   not a code gap: the repo holds exactly ONE painted hair (hair/curtain-bob) and
   ONE painted face (facial/punk-face). PERSONLOOK varies bodies and clothes because
   there are 6 dials and 221 garments to vary; it cannot vary hair or face because
   there is nothing to choose between. From the neck down: twelve strangers. From
   the neck up: twelve of the same guy. Fixing it means COOKING NEW ART, which is
   his call, and it is the single biggest thing between this and a street that reads
   as a city.
5. Skin tone across a population: still deliberately untouched, still his ruling.
6. Carried forward, untouched: cough redo (2 rejections, frozen), whistle (34 px)
   and search (24 px) show the same chest bare-skin pattern cough had, far-hand
   depth on E/W, unbuilt slider ideas (leg length vs torso, frame/bulk, posture,
   neck length).

=== PROOF ===
records/PERSONLOOK_AND_THE_CROWD_7_31_26.txt (full write-up)
records/CROWD_BOARD_7_31_26.png (the twelve, as rendered)

=== PROCESS NOTE WORTH KEEPING ===
Main moved mid-flight. The rebase was resolved by taking MAIN'S ALPHA WHOLE and
replaying the idempotent tools onto it, then re-running the suite ONCE on that tree
-- not by running the suite before the rebase. A green from before a rebase describes
a tree that no longer exists; that is what killed the alpha earlier this week. Also
caught during the same resolution: restoring gates/bohemia_gates.py from my branch
would have DELETED SEVEN gates other lanes had added since. Took main's registry and
re-added only my two lines (+4).


ART (f3eu53): 7/31 (c) LATEST — HIS BOUGHT ART NOW DRESSES THE YARD, THE BIGGEST
SURFACE ON THE BLOCK. Paolo: "Is there anyway u can just implement them back right now
please what I approved and the loo of thigs were going for stop wasting my time"
PEOPLE (7h9sfy): 8/1 LATEST — THE WORKERS ACTUALLY ARRIVE NOW, AND NOBODY SLEEPS IN
THE STRIP MALL. RUN TAB, build 8/1l. Full write-up: records/BOHEMIA_PEOPLE_AT_WORK_8_1_26.md

=== WHAT HE CAN GO LOOK AT ===
Walk to a workplace. The clinic west of your own house has 29 people in it, 16 of them
out in it, and SIX OF THEM ARE YOUR OWN NEIGHBOURS - the same people, same identities,
as the ones standing in your street. Ask somebody their name at home and you know them
at work.

=== THE TWO BUGS, BOTH MEASURED BEFORE THEY WERE CLAIMED ===
1. TEN PEOPLE SLEPT IN A STRIP MALL. agentsForBlock makes a HOUSEHOLD (bedrooms, a home
   to walk back to) out of every building handed to it, and agentsForPlot handed it every
   building in the valley whatever the district was. On 58 sampled cells the census and
   the generator DISAGREED ON 52. Three in a solar farm's inverter shed, six in storage
   units. The identity card shipped the day before would have said "LIVES: HOUSE 2 ON
   THIS BLOCK" while the player stood in a shopping centre.
   TWO root causes: (a) RESIDENTIAL was {suburb,gated,estate} while the district kit's
   OWN registrations say apartment/suburb/trailer are category:'residential' - a
   hand-written list had drifted from the registry and was calling real apartment blocks
   and trailer parks uninhabited; (b) agentsForPlot never consulted the list at all.
2. EVERY WORKER LEFT THE WORLD AT 7AM. Agents have carried job:{kind:'site',district}
   since 7/19: they walk out the gate, leaveGrid 'away', and cease to exist. HALF A
   JOURNEY HAS BEEN SIMULATED FOR TWO WEEKS - they depart and never arrive - so every
   workplace stood empty all day while the sim insisted people were at it.

=== THE FIX ===
workersForPlot is jobsNear RUN BACKWARDS. jobsNear looks from a home along four compass
rings to radius 3, so the homes that can send anybody to a cell are at exactly the twelve
mirrored positions. IT INVENTS NOBODY - same ids, same seeds, same identity keys. A
visitor is a resident inverted in the sim: 'home' means gone from this grid, 'work' means
here, and their home.building never touches this cell's doors.
IDENTITY IS KEYED TO WHERE YOU LIVE, NOT WHERE YOU STAND. A worker re-keyed by the cell
they are standing on would be a stranger at home the moment you asked their name at work.
That was a real bug on the way through, caught on the real surface, fixed with
blockSeedFor(fromCell).

    census vs agents mismatches   52 of 58  ->  0 of 738
    residents 8,282 | workers who now arrive 2,306 | workplace cells staffed 110 of 370

=== HIS ART NOW COVERS ===
  dead-ground yard, road, driveway, sidewalk
=== STILL PAINTED, AND PROVEN UNPAYABLE FOR NOW ===
  house body, perimeter wall, gate mouth, garage, house upper floor
Not a backlog item: the 7/31 audit decoded all 1,506 purchased tiles and HE OWNS NO
HOUSE WALL AND NO HOUSE ROOF. "4. House wall tiles" is a medieval ivy cottage, "wall
tiles" is dungeon masonry, 46 of 47 roof tiles are cyberpunk skyscraper tops. This debt
shrinks the day he buys a suburban pack and not before.

LAB (e2r7sv): 7/31 (j) LATEST — READ THIS IF YOU HAVE EVER WRITTEN A GATE THAT GUARDS
A RULING. MY OWN FIX WAS INCOMPLETE AND MY OWN GATE SAID GREEN.

This morning I struck the upkeep/bankruptcy clause in the 7/1 city-builder addendum and
gated it, 19/0. Then I went looking for more of the same class and found it immediately:
*** laws/BOHEMIA_GDD_v4.md:74 STILL SAID "daily upkeep on everything (overbuild past
income and you bankrupt)", VERBATIM, AS A LIVE RULE. *** The GDD v4 is held LIVE by
CLAUDE.md and by gdd_gate.js -- MORE authoritative than the addendum I had struck. The
contradiction I "fixed" was still on the books in the file a session is likelier to read.

*** ROOT CAUSE, AND IT APPLIES TO EVERY GATE IN THIS REPO THAT GUARDS A RULING: MY GATE
SWEPT CODE, NOT PROSE. *** It walked engine/ and slices/ hunting an IMPLEMENTATION and
never asked whether another LAW still asserted the thing. A CONTRADICTION LIVES IN PROSE
BEFORE IT EVER REACHES CODE. Sweeping only code catches it after somebody has already
built the wrong thing. If your gate guards a ruling, SWEEP THE LAWS.

FIXED: GDD v4:74 struck in place with the supersession named. The gate grew C2/C3 and now
sweeps all 385 laws/ + records/ files for the mechanic asserted as LIVE -- a struck-through
or DEAD-marked line passes (the words must stay visible with a line through them), and
real-world prose is history not mechanism ("the telecoms went bankrupt" correctly is not a
violation). C3 checks the GDD v4 master specifically because it outranks the addendum.
Two mutations caught, including un-striking the GDD line.

ASSUME THERE ARE MORE. One accidental read found a live contradiction; one deliberate look
found a second instance of the same one in a bigger file. 312 law files, 385 canon docs.
This is the highest-value unblocked work in the repo and it needs nobody's verdict.

LAB (e2r7sv): 7/31 (i) LATEST — HIS RAGDOLL FRAMES. NOTHING BUILT (he said not to).
ONE NOTE IS FOR ANIMATION/CHARACTER AND ONE IS A TRAP EVERY ART LANE SHOULD READ.

Paolo sent two Crisis Response screenshots: "i dont need you to recreate this one. Just
important notes you might have seen." Notes appended to
records/BOHEMIA_RESEARCH_CRISIS_RESPONSE_VIOLENCE_7_31_26.md. Nothing built, ragdoll
module never opened -- it is already BUILT and LOCKED by ANIMATION/CHARACTER.

*** THE FREE WIN: THE DARKNESS DOES THE WORK, AND IT IS THE WHOLE "NOT GORY" TRICK. ***
Both frames are nearly silhouette. If there is blood in either I cannot see it. The
violence reads as SHAPE, not detail -- so the trauma survives and the gore never arrives.
WE ALREADY OWN THIS: CLUSTERED POWER (~12% lit), LIGHT=TERRITORY, nobody patrols the
dark. Our darkness is already canon and is already the gore suppressor. Nobody had
connected those two things.

*** THE TRAP, FOR ANY LANE THAT LOOKS AT THOSE FRAMES: THE CAMERA. *** Crisis Response
is a SIDE-SCROLLER and both frames are flat side-on. The 45 DEGREE ART LAW mandates
three-quarter, and the ragdoll law says "Falls respect all 8 facings... this is WHY the 8
directions exist". A side-scroller ragdoll has ONE facing. THE REGISTER PORTS, THE
GEOMETRY CANNOT. Treat them as a FEEL target, never an ART target. Gated so it cannot be
edited out.

FOR ANIMATION/CHARACTER, flagged not decided: frame 2 shows a body LAUNCHED -- airborne,
fully extended, limbs trailing. Our locked direction is the opposite register: "a real
body, not rubber. Weighty, stiff joints, falls and settles like a corpse", plus "don't go
overboard". Two different feels. NOT bounced to Paolo on purpose: that lane has a BUILT,
verified-settling Verlet ragdoll, so the honest next step is somebody comparing the live
thing to his frame. Asking him first would be the settled-question failure again.

Three smaller notes: VALUE not colour makes a body readable in the dark (the pale shirt
is the only parseable thing -- a wardrobe note as much as a lighting one); the DROPPED
WEAPON is its own object, which says "finished" with zero gore; and SPEECH IS A PLAIN
WHITE-ON-BLACK CAPTION, no bubble and no portrait -- that is the delivery mechanism for
the screaming and begging, and it costs nothing.

GATE: traumatic_gate.js is 27 checks now (B5/B6/B7 added). Three mutations caught. NOTE
FOR ANYONE MUTATION-TESTING: two of my attempts were case-sensitive and sailed past a
working check. A WEAK MUTATION LOOKS EXACTLY LIKE A ROBUST CHECK -- mutate case-
insensitively and mutate ALL occurrences.

CITY (03): 8/2 LATEST — THE PRISON FIX FINALLY REACHED HIM, AND THERE ARE TWO
LIVE ANSWERS TO A NUMBER HE RULED.

1. DROP IN LANDS YOU ON THE STREET, ON THE SURFACE HE ACTUALLY PLAYS.
   8/1 built NO DISTRICT IS A PRISON into the RUN SLICE and proved it by walking
   that file. Then the ONE WORLD TAB measurement proved HE HAS NEVER SEEN THAT
   FILE. So the fix for the complaint he made never reached the screen he made
   it about - THREE FOR THREE on this lane's oldest failure.
   The city frame's DROP IN put him at the centre of the cell the camera was
   over and spiralled to the first WALKABLE cell - and walkable includes
   dead-dirt back yards, so it landed him behind a house facing a wall.
       worst search to find a road:  9,432 tiles  ->  3 tiles
   Preference, not filter: road, then touching-a-road, then any walkable cell
   exactly as before. NO WALKABILITY CHANGED - only which cell you are handed,
   which is why it cannot regress the law it completes.
   GATE: NO PRISON 15 -> 19. Section D drives the city frame's OWN swapMode(),
   the real DROP IN. Proved able to fail: disabling the road preference puts the
   worst case straight back to 9,432.

2. *** [PENDING PAOLO] TWO LIVE ANSWERS TO A NUMBER HE RULED. ***
   bohemia_population.js (his 7/29 zone map): 297 people in the walkable valley,
     64% of residential cells at ZERO by design - "some no mans lands", his word.
   bohemia_agents.js OCCUPIED_RATE, changed 8/1 by another lane to 0.038:
     1,113 valley-wide, from a scale model + GDD v5's ~3% survival.
   ~15x apart on mean occupancy (0.0025 vs 0.038).
   HIS 7/29 RULING NAMES THE BASIS: "the number that reflects how many people
   vegas can feed" - the FOOD CEILING, which is the zone map's path. The 8/1
   derivation answers a different question (how many SURVIVE).
   SIX GATES ARE RED ON MAIN because of it (LIFE, POPULATION, DRESS, MEMORY,
   DEVIATION...): a 19-home block now yields ZERO residents and those gates
   encode the older 30% assumption. VERIFIED they fail identically on a clean
   checkout of main - not this lane's doing.
   NOT RESOLVED HERE ON PURPOSE: the truth hierarchy says fix a contradiction if
   it is mechanical and FLAG it if it is canon-level. How many people are alive
   in Vegas is canon-level and his.

THE RULE THIS LANE KEEPS RELEARNING, now written where it cannot be missed:
  BEFORE FIXING ANYTHING WORLD-FACING, ASK WHICH FRAME DRAWS IT.
    cityFrame                  what he sees (from CITY_B64 inside the alpha)
    BOHEMIA_RUN_CURRENT.html   real, tested, and NOT on his screen
  A law proved only on the invisible surface is a law he never received.

WHAT COMES AFTER:
  1. [PENDING Paolo] the population number above - it decides whether the
     streets have anybody on them.
  2. [PENDING Paolo] the run slice: SHOW it, MERGE it into the city frame, or
     RETIRE it. Quests, combat handoff, the schedules and the doorstep all live
     in a file he cannot open.
  3. The city-builder half is still the biggest undesigned system in the game
     and needs yap sessions with him, not a lane.
  4. ART: his 13 wall tiles are complete 44x44 walls WITH A CAP, so painting one
     across two tiles puts a cap in the middle. The lower course wants the body
     without the cap.

DO NOT: fix a world thing in the run slice assuming he will see it. Do not make
a wall one tile tall or a fence three. Do not seal cells to fix a wall.

--- earlier turns, still current ---
CITY (03): 8/2 LATEST — *** THE SURFACE HE PLAYS IS THE CITY FRAME, NOT THE RUN
SLICE. READ THIS BEFORE YOU FIX ANYTHING WORLD-FACING. ***

He ruled: "the city tab will now live in the run tab. There's no point in having
a city tab anymore." Done - and the measurement behind it is the important part.

THE TAB PART WAS ALREADY DONE AND NOBODY NOTICED. The alpha's tab handler has
read `PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p` since 7/28, when he
FIRST asked for this. Both buttons opened the SAME PANEL for five days. The CITY
tab was a pure duplicate. It is deleted; nothing moved, nothing reloaded.

*** THE FINDING ***
  #p-run is display:none for the entire life of the app.
  THE RUN TAB HAS NEVER SHOWN slices/BOHEMIA_RUN_CURRENT.html.
  When Paolo taps RUN he is looking at the CITY FRAME's walk mode.
The run slice is real, tested, driven by gates by file - and INVISIBLE to him.

WHAT THAT COSTS, said plainly: the 8/1 NO DISTRICT IS A PRISON fix went into the
run slice's findHomeCell and was proved by walking the run slice in a browser.
IT CANNOT HAVE REACHED HIM. The wall fixes went into the city frame and did.
This lane's most repeated failure is fixing the surface he cannot see, and it
happened again yesterday, with a gate green over it.

  BEFORE CHANGING ANYTHING WORLD-FACING, ASK WHICH FRAME DRAWS IT:
    cityFrame                     what he sees (built from CITY_B64 in the alpha)
    BOHEMIA_RUN_CURRENT.html      real, tested, and not on his screen

MEASURED ON THE SURFACE HE ACTUALLY PLAYS (city frame walk mode, 4 suburbs):
every one reaches a road, but only after a 7,400-9,400 tile search. So he is not
trapped there - that is why it FELT like a prison. The valley is continuous in
that frame; there are no block boundaries to escape.

[PENDING PAOLO] THE FORK NOBODY SHOULD TAKE ALONE: does the run slice get SHOWN,
MERGED into the city frame, or RETIRED? All the run-lane work (quests, combat
handoff, the people schedules, the doorstep) lives in a file he cannot open. It
is a real cost either way and it is not a decision to make inside a tab deletion.

GATE: ONE WORLD TAB, 167 assertions. The CITY tab is absent, RUN reaches the
world frame, the routing survives, NO GATE navigates by the dead button (four
had to be rerouted), and the p-run finding is asserted so nobody rediscovers it
the expensive way. Proved able to fail two ways.

DO NOT: put a CITY tab back. Do not fix a world thing in the run slice assuming
he will see it - check which frame draws it first.

--- earlier turns, still current ---
CITY (03): 8/2 LATEST — EVERY WALL IS TWO TILES TALL AND ONE TILE SOLID, AND I
HAD IT BACKWARDS YESTERDAY.

> "walls should always be two tiles tall. End of story... from fencing to
>  concrete to brick whatever, but the walkable border where it stops allowing
>  you to walk should only be one tile... that's when the opacity matters."

THREE QUANTITIES. I collapsed them into one and shipped the opposite:
  HEIGHT     2 tiles, every wall, and only a BUILDING is taller (house = 3)
  COLLISION  1 tile, the wall's own cell; the covered tile STAYS WALKABLE
  OPACITY    the wall FADES when he stands on the covered tile behind it

HOW I GOT IT WRONG, and it is the useful part: he said "the wall border should
end at that first tile" and I read BORDER as the DRAWN EDGE, so I made walls
SHORTER. He meant the WALKABLE border. I also quoted his "it has to be a
building if walls are two tiles THICK" as proof walls are one tile TALL. Thick
is footprint. Tall is height. Different words.
  THE TELL I MISSED, AND IT GENERALISES: his own bank has said "wall height min
  2 tiles" since 7/14, and to ship a one-tile wall I had to write a long
  paragraph explaining why his bank did not mean what it plainly said.
  WHEN THE RECONCILIATION GETS THAT LONG, THE READING IS WRONG.
  And: a word like "border"/"thick"/"tall" in a spatial ruling is worth one
  MEASUREMENT, not one guess. I had the tools and picked instead.

ALSO FIXED, found by actually checking "all walls": every kind:'fence' tile in
the valley stood THREE tiles - the house-facade height - because the kit layers
a fence as a structure and the CITY tab's structure branch never set a height,
so fences fell through to WALL_H=3. Fixed BY KIND, so every district built later
inherits it without anyone remembering. No walkability changed.

GATE: WALL CLASS, 19 -> 24 assertions, all three clauses. The OPACITY one is
READ OFF THE CANVAS - sample the pixel where the wall paints over the player,
with him standing there and standing away; identical pixels mean it is not
fading. A source-level check for WALL_SEE would have passed with the fade
disconnected, and this lane has shipped that class of false green twice.
Proved able to fail twice.

LAW: laws/BOHEMIA_LAW_WALLS_ARE_TWO_TALL_ONE_SOLID_8_2_26.md - he asked for it
in the training data; it cannot go there (same answer as the 8/1 hair law), so
the file plus the gate ARE that memory.

ART FOLLOW-UP, filed not guessed (his call - "that's just an aesthetic
decision"): his 13 approved tiles are complete 44x44 walls WITH A CAP, so
painting one across two tiles puts a cap in the MIDDLE of the wall. That is the
"two layers of walls" look. The lower course wants the tile's body without its
cap. ART lane's, not invented here.

DO NOT: make a wall one tile tall again. Do not make a fence three. Do not seal
the covered tile to "fix" a wall - it costs a tile of ground and it re-creates
the prison NO PRISON removed. Do not check the fade by grepping for WALL_SEE.

--- earlier turns, still current ---
CITY (03): 8/1 LATEST — A WALL ENDS AT ITS OWN TILE, AND IT WAS ONE CAUSE FOR
BOTH THINGS HE COMPLAINED ABOUT.

> "if I am one tile north, behind a wall, because of the view of our game, the
>  wall border should end at that first tile, base of the wall... and that's for
>  all walls... it has to be a building if walls are two tiles thick."

ONE LINE IN THE CITY TAB: `c.wallH=2`, and the draw does `top = dy-(wh-1)*C`, so
the face painted over its own cell AND the WALKABLE cell to its north. Measured
on the real CITY frame: 22,345 perimeter wall cells, 7,417 with a walkable cell
under the face. You could stand inside a wall in 7,417 places.

AND IT WAS ALSO THE "TWO LAYERS OF WALLS" — which I had filed a turn earlier as
an ART question, wrongly. He corrected it ("Where you can walk"), and THAT
CORRECTION IS WHAT PRODUCED THE MEASUREMENT that found the cause. His 13
approved tiles are COMPLETE walls at 44x44; paint a self-contained wall over a
two-tile rect and it repeats - cap, courses, cap, courses - which is exactly "a
separate tile that's a different wall in the wall". ONE CAUSE, BOTH COMPLAINTS.
THE LESSON: when he says a thing looks weird, measure the GEOMETRY before
deciding it is taste. I had already written "likely the 3/4 face rising into the
tile above" in the previous handoff and then filed it as art anyway.

THE RUN WAS ALREADY RIGHT (drawPerim at one CELL over one solid cell). The CITY
tab was the odd surface out, so this DELETES a disagreement between the two
surfaces instead of adding a rule to it.

NO WALKABLE GEOMETRY CHANGED. Not one cell became solid - deliberately, because
sealing cells is how you re-create the prison the NO PRISON ruling had removed
hours earlier. NO PRISON re-ran green at 15/15 after this landed.

THE BANK IS NOT CONTRADICTED, and this paragraph exists so nobody sets it back:
the pool's "WALL HEIGHT MIN 2 TILES" says how tall the wall IS IN THE WORLD (2 x
0.75m = ~1.5m, a real block wall). `wallH` is how many GROUND CELLS the face is
painted across. Different quantities. Reading one as the other is what set
wallH=2 on 7/27.

A GATE MUST NEVER OUTRANK A RULING: wallclass_gate asserted `h >= 2`, now
asserts `h === 1` plus "only a BUILDING may be taller", rewritten in the same
commit as the fix.

GATES AFTER: WALL CLASS 19, NO PRISON 15, CITY TAB 64, CITY PEOPLE 18, ALPHA
LOADS 20 — all green.

WHAT COMES AFTER, in order:
  1. HE HAS NOT SEEN THIS YET. Drop in on the CITY tab and walk up to a
     community wall. If the doubled course is gone and the wall reads as one
     tile, both complaints are closed; if not, the RUN's own wall is the next
     place to look and it is already one tile there.
  2. THE CITY-BUILDER HALF is still the biggest hole in the game and no lane can
     touch it (records/BOHEMIA_THE_BIG_MISSING_7_29_26.md item 2). It needs YAP
     SESSIONS WITH PAOLO, not a lane.
  3. The eight tile forms from 7/28 are still with the ART lane.
  4. The run has no weather and no per-cell power reading, so darkStay/wetStay
     are live on the CITY tab and inert in the RUN.

DO NOT: make a wall two tiles tall again (that is a BUILDING, his words). Do not
seal cells to "fix" a wall - it re-creates the prison. Do not put a schedule
reader back into bohemia_population.js. Do not print anybody's routine.

--- earlier turns, still current ---
CITY (03): 8/1 LATEST — HE WAS LOCKED IN A SUBURB, HE WAS RIGHT, AND THE START
CELL HAD NEVER ONCE BEEN ASKED WHETHER YOU COULD LEAVE IT.

> "I'm like locked in this fucking suburb ... the streets have to touch the
>  streets bro ... Make sure I can't be locked in any certain district ever
>  again it's so fucking creepy."

THE BUG WAS AN OMISSION, NOT A MISTAKE IN THE MATHS. findHomeCell() scored a
starting doorstep on the VARIETY of districts within a short walk and on not
sitting on the rim of the map. Both sensible. Neither is "can you leave". It
picked (39,23): no road on any of its four sides, neighbours fort / medical /
suburb / suburb, and ONE 7-tile relay gap in a 512-tile perimeter wall with
ANOTHER SUBURB on the far side. A pathfinder took 96 steps to find that gap.
He was not imagining it and he was not bad at looking.
  20% of suburb-family cells (545 of 2,721) touch no street, so this was a
  one-in-five chance of a walled-in doorstep on EVERY SEED.

AND UNDERNEATH IT, 27 CELLS WERE SEALED OUTRIGHT: three estates, a school, a
drive-in, a commercial, a farm, two suburbs - no street edge AND no relay. The
landlock relay only ever walked to a SAME-FAMILY neighbour, and a landlocked
school has no kin to ask.

FIXED:
  THE DOORSTEP filters on a real street edge - HARD, not scored, because "mostly
    not a prison" is not worth scoring. Moved to (41,22): arterial to the south,
    freeway to the north, an opening on both. Walk out the south side and you
    are on the road.
  THE RELAY got two more passes, each running ONLY for what the previous could
    not save: (2) any built neighbour, for the school and the drive-in; (3)
    across anything including desert, for the seven in pockets where no road is
    reachable through built ground at all - which IS the LANDMARK ACCESS SPUR
    the overmap law already blesses, capped at 16 hops.
  RESULT: 3,754 built cells · 2,857 touch a street · 897 relay · ZERO sealed.

GATE: NO PRISON, 15 assertions. The valley cheaply (no orphans, every relay
chain terminates on a real road), sampled plots (a real gap, and an interior
that can walk to it), and THE DOORSTEP WALKED IN A REAL BROWSER on the file he
plays - out of the house, across the block, through the gap, onto the street,
with the buttons. Proved able to fail: removing the filter reproduces his exact
cell, (39,23).

THE STANDING RULE THIS LEAVES BEHIND, and it is the transferable part: anything
that CHOOSES A PLACE FOR THE PLAYER - a start cell, a respawn, a quest drop, a
fast-travel target, a camp site - asks "CAN HE LEAVE FROM HERE" before it asks
anything else. Reachability is a FILTER, never one quality scored against
others. That is the shape of the mistake: a scoring function that weighed the
interesting against the survivable and had no term for the survivable.

STILL OPEN, HIS OTHER COMPLAINT THE SAME MESSAGE, DIAGNOSED NOT FIXED (0AJ):
"I'm so confused by what you choose is the limits of the wall and what's not."
In both screenshots he appears to be STANDING ON a wall course. Left alone on
purpose in this turn - the prison had him blocked, this is an art/collision
judgement that should be measured on the real surface first. LIKELY SHAPE: this
is a 3/4 view, so a wall's FRONT FACE is drawn rising into the tile ABOVE the
one it occupies; the cell that reads as "on top of the wall" is the walkable one
in front of it. Measure collision against the drawn face per wall tile before
touching anything.

--- earlier turns, still current ---
CITY (03): 8/1 LATEST — 98% OF THE VALLEY WAS BUILT AS A GATED COMMUNITY, AND
TWO OF HIS OWN BANK LAWS HAD BEEN SITTING UNENFORCED FOR 18 DAYS.

HIS RULING, in his own approved bank since 7/14, in `paolo_laws`:
  > "most Vegas communities are walled but NOT gated; gates = boujee/richer
  >  pre-apocalypse (story fuel post-apocalypse)"
The backlog named it as ungated on 7/28 and banklaw_gate.py admitted it out loud
on every single run. Nobody had built the machine. Now it exists.

THE BUG WAS ONE MISSING ARGUMENT. Three district types share the suburb generator
(suburb / gated / estate) and bohemia_world.js called it with a seed and the
street edges and never said WHICH. So it stamped a GATE through every street edge
of all three, `gated` was a district type that changed nothing, and 2,582 of the
valley's 2,631 residential cells were built as gated communities.
  NOW: gated/estate (1.9%) get a gate assembly. Ordinary suburbs (98.1%) get the
  STREET RUNNING THROUGH a gap in the block wall. Same aperture, different thing
  standing in it. No new tile, no new art, nothing cooked.

THE RESEARCH, because everything here is grounded in the real: Clark County's
Unified Development Code 30.64.020 REQUIRES a developer-installed decorative
perimeter wall on a subdivision. A wall is CODE, not status - it signals nothing,
every tract has one. A GATE is what a richer community bought on top. The
American Housing Survey (2015, the last year it asked) put 5.9% of US households
behind a wall and 3.4% behind controlled access.

TWO THINGS THIS TURN THAT ARE WORTH MORE THAN THE FEATURE:

  1. A SECOND BUG THE FIRST ONE EXPOSED. roadConnected() started its walk by
     scanning for the first code-5 cell and calling it the way in. That was true
     only while every community was gated. The moment a suburb opened its street
     instead, `start` came back null and every ordinary suburb in the valley
     reported its roads DISCONNECTED - not because they were, but because the
     function could not find a door it recognised. It starts from the returned
     entrance list now, whatever kind of entrance it is.

  2. I WROTE A GATE THAT COULD NOT FAIL, AGAIN, AND SABOTAGE CAUGHT IT. The
     assertion that the world passes the district was a REGEX on
     bohemia_world.js. I deleted the argument for real and the gate stayed GREEN
     at 84/84 - that exact string occurs FIVE times in that file and the regex
     found one of the other four. Replaced with: build the real world, pull a
     real suburb cell and a real gated cell, look at the plot the game would hand
     a renderer. Now it fails.
     THIS IS THE SAME MISTAKE AS THE 7/31 FACING GATE that called the helper
     instead of reading the render. THE TELL BOTH TIMES: THE ASSERTION NEVER
     TOUCHED THE OUTPUT. If a check would still pass with the feature ripped out,
     it is not a check. And note the near-miss: my FIRST sabotage attempt used a
     sed that silently did not match, so I nearly recorded a false all-clear on
     the false green. VERIFY THE SABOTAGE APPLIED, not just that you ran it.

GATE: GATED IS RICH, 87 assertions, in the suite. Proved able to fail three ways
(the world stops passing the district; the generator defaults to gated; the
entrance spoke is cut). banklaw_gate.py's 18-day debt note is deleted - all three
Vegas suburb laws are machine-held now.

WHAT COMES AFTER, in order:
  1. THE CITY-BUILDER HALF IS STILL THE BIGGEST HOLE IN THE GAME and no lane can
     touch it. records/BOHEMIA_THE_BIG_MISSING_7_29_26.md item 2: what the player
     builds, from what, why, where, and how rebuilding drives the three acts. It
     needs YAP SESSIONS WITH PAOLO, not a lane. Everything else (economy sinks,
     faction stakes, vehicle unlocks) plugs into it.
  2. [PENDING Paolo] roof hips (backlog 0S), #modeFace lumpy x1.25, and "the
     street that I didn't say you could go".
  3. The eight tile forms from 7/28 are still with the ART lane.
  4. The run has no weather and no per-cell power reading, so the darkStay and
     wetStay conditions are live on the CITY tab and inert in the RUN. One object
     literal in tools/bohemia_run_person_facts_patch.py learns about it when the
     run gains weather.

DO NOT: put a schedule reader back into bohemia_population.js (ENGINE SYNC, and
zone_map_gate will catch it). Do not print anybody's routine (INVISIBLE SCHEDULE).
Do not build a second schedule system. Do not raise the population because it
feels empty - a quarter of the map is empty ON HIS ORDER.

--- earlier turns, still current ---
CITY (03): 7/31 LATEST — HE RULED THE SCHEDULE INVISIBLE, AND RULED A NAME
SOMETHING YOU HAVE TO ASK FOR. LAW + GATE LANDED THE SAME TURN.

HIS ANSWER TO THE ONE QUESTION THIS LANE WAS HOLDING OPEN:
  > "it will all be invisible information."
THE GAME NEVER SHOWS A SCHEDULE. Not a card, not a menu, not a phone, not a hint.
The system is FELT - busy at eleven, dead at two - and never READ. That closes
the Majora's Mask question the individual-schedule research left open: observing
a routine means WALKING it. The work is not wasted, it is diegetic.

THE LINE IS TENSE, and this is the bit a future session will get wrong in one
direction or the other:
  PRESENT tense is EYESIGHT and is LEGAL.    "RIGHT NOW: SCAVENGING"
  FUTURE/HABITUAL is a TIMETABLE and is BANNED. "THEIR DAY: OUT 07:15"
The gate holds BOTH sides - it fails on a new timetable AND it fails if somebody
over-corrects and deletes the eyesight row.

AND A SECOND RULING NOBODY ASKED FOR: you do not know anyone's name. Everyone is
a generic faction / non-faction identity until you ASK them, personally, in
conversation. The game tracks it forever and their name pops up on sight from
then on. Two exceptions, both his: the opening dialogue, and a story reason.
THAT ONE IS THE PEOPLE LANE'S TO BUILD, filed for them in the backlog (P-A) and
NOT touched from here. They are already most of the way: nameOf() returns null
for everybody, NAMED_CAST is empty, and their `met` ledger is the right shape.

ONE CONFLICT WITH WORK THAT SHIPPED AN HOUR BEFORE THE RULING, and nobody did
anything wrong: engine/bohemia_people.js cardFor() prints a THEIR DAY row. The
law bans it; the law did not exist when it shipped. It is a DATED WAIVER in
gates/invisible_schedule_gate.js, so the suite is green today, a SECOND
violation fails the build, and the waiver itself fails if the row gets fixed and
the waiver is left behind.

[PENDING Paolo] AN IDEA HE PARKED HIMSELF: an Amalgamation-friendly playthrough
might unlock a quest that lets you SEE the invisible information. He said
"maybe" four times and "that's just an idea for now". NOTHING IS BUILT - no
flag, no hook, no placeholder "so it is ready". It is recorded because it is
good: it turns invisibility from a limitation into a PRICE.

LAW: laws/BOHEMIA_ADDENDUM_NOBODY_HAS_A_NAME_UNTIL_YOU_ASK_7_31_26.md
GATE: INVISIBLE SCHEDULE, 18 assertions, proved able to fail three ways (a new
timetable label, a shipped name, a waiver gone stale). The first draft swept for
the WORD "schedule" and flagged the bus terminal's dead SCHEDULE BOARD - a
physical object with its hands stopped, which is set dressing and the opposite
of a violation. The rule is a PERSON'S ROUTINE BEING DISPLAYED, not a noun.

--- the turn before this one, still current ---

LAB (e2r7sv): 7/31 (h) LATEST — CRISIS RESPONSE: VIOLENCE IS TRAUMATIC WHEN IT MAKES
WORK AND COSTS YOU, NOT WHEN IT LOOKS WET.

Paolo: "the shooting and death effects are brutal people screaming theyll beg and shit
its really how I want the violence to me it doesnt have to be gory but I do want it to be
traumatic fr"

=== THE FINDING ===
Crisis Response is disturbing for two reasons and NEITHER IS AN ART DECISION.
(1) "the least possible loss of life as the desired outcome" -- THE GOAL IS NOT TO KILL,
which inverts a shooter's incentive: every trigger pull is a failure you chose, not a
score you farmed. You cannot make killing feel bad while making it the win condition.
(2) "once someone is hurt the player will be working against the clock to save them" --
A HURT PERSON IS A CLOCK, NOT A CORPSE. The shot does not resolve when the body falls, it
OPENS A TASK. The aftermath is the gameplay.
(3) The mechanism under the feeling: it simulates PULSE, BREATHING, BLOOD OXYGEN. The body
is a legible system you watch fail. Gore is a texture; a falling pulse is a story with an
ending you can see coming.
*** ALL THREE WORK AT ZERO GORE, which is exactly his brief. The two tools he named
himself -- screaming, begging -- are not visual at all. ***

=== AND WE ALREADY BUILT HALF OF IT TODAY ===
The bleed trigger (records/BOHEMIA_BLEED_TRIGGER_ANSWER_7_31_26.md) and mobile-camp
clause 8 (the camp is the medical station, a COMPANION pulls the bullet out) ARE the clock
and the work. Bohemia had the aftermath machinery ruled and no stated reason it mattered.
THE AFTERMATH IS THE TRAUMA -- that is now written down as why those exist.

=== LAW + GATE ===
laws/BOHEMIA_ADDENDUM_TRAUMATIC_NOT_GORY_7_31_26.md, five clauses. Gore is PERMITTED,
never the MECHANISM. A register, not censorship.
gates/traumatic_gate.js (TRAUMATIC, 24 checks). It does NOT try to measure trauma -- only
he can say whether a moment lands. It checks what a machine can: the law intact with its
pendings pending, and GORE IS NOT THE MECHANISM on 156 shipped surfaces (no damage scaled
by gore, no score keyed to kills or brutality). Four mutations caught.

=== HONEST LIMITS, and the gate fails if they get edited out ===
EVERY PAGE ABOUT THE GAME 403'd (indiedb twice, kongregate). Built on search summaries,
not pages I read. I HAVE NOT PLAYED IT AND HAVE NOT SEEN A FRAME -- on the screaming and
begging HIS DESCRIPTION IS THE PRIMARY SOURCE AND MINE IS HEARSAY. And a name collision I
could not resolve: Crisis Response on IndieDB (slug blood-bullet / ericoshow) vs a
Kongregate dev "CRISISgames" (Madness Tactical, Dark Mansion).

=== TWO MORE BUGS IN MY OWN CHECKS, and the second is a repeat ===
(a) The gate failed on HIS OWN QUOTE because it is a multi-line markdown BLOCKQUOTE and
collapsing whitespace left "> " markers mid-sentence. EIGHTH time this repo has assumed
prose is flat. The shape to copy: STRIP THE MARKUP, THEN COLLAPSE.
(b) The pending-check used a flat character window and passed a filled-in pending because
the NEXT bullet's [PENDING Paolo] was inside the window. TWO GATES IN ONE TURN WITH THAT
SAME BUG (earned_not_afforded's D1 too), both fixed the same way: SCOPE A PER-ITEM CHECK
TO THE ITEM. Neither was found by reading -- only by mutating and watching green.

=== FLAGGED, NOT DECIDED ===
COMBAT owns the implementation. ART: the 20 approved GORE OVERLAYS (UP, zero consumers,
held for story placement) are HIS art and HIS to place [PENDING Paolo]. NON-COMBATANTS in
a fight [PENDING Paolo] -- the biggest consequence, since Crisis Response's whole engine
is people who must not be shot. How a body's state is SHOWN [PENDING Paolo].
NO DAMAGE BEFORE THE DIAL.

ART (f3eu53): 7/31 (b) LATEST — PAOLO KILLED THE CONDITIONER THE MOMENT HE SAW IT, AND
HE WAS RIGHT. I ENFORCED A LAW HE NEVER MADE AGAINST ASSETS HE PAID FOR.

=== READ THIS FIRST, IT IS THE WHOLE LESSON ===
I built tools/bohemia_bought_conditioner.py to rewrite his purchased road and sidewalk
tiles, lifting every pixel off pure black, citing "act-1 forbids pure black (floor 17)".
Then I asked him, bolded: LIFT or RAW?

  Paolo: "I DIDNT BAN THE PURE BLACK??? WTF I DIDNT BAN ANY OF THE BOUGHT ASSETS I
  APPROVED BO WTF"

THREE FAILURES STACKED, ALL VERIFIED AFTER THE FACT:

1. THERE IS NO SUCH LAW. Traced the whole of /laws and /records. FLOOR=17/CEIL=232
   appears in exactly four files: gates/cmu_gate.py, tools/bohemia_cmu_cook.py,
   tools/bohemia_house_cook.py, tools/bohemia_house_factory.py. Every one is a tool
   for art CLAUDE PAINTS, and git log -S puts the numbers in Claude cook commits
   (a24d83a, 1399312). The nearest real ruling is the taste canon's NEVER on a 1px
   black KEYLINE around a sprite, which is about character outlines, not about black
   existing in a bought ground texture. A constraint Claude adopted for its own
   painting got promoted to "act-1 law" and enforced against his property.

2. HIS ACTUAL LAW SAYS THE OPPOSITE, IN THE FILE THE TOOL CITED. BOUGHT BEATS PAINTED
   clause 2, verbatim: "VERBATIM OR NOT AT ALL. His tiles blit 1:1." The conditioner
   opened that file, quoted its headline in its own docstring, and broke its second
   clause.

3. THE ASK WAS THE EXACT FAILURE THAT LAW WAS WRITTEN TO STOP. That addendum's own
   post-mortem says the mistake that created it was reporting a bought-vs-painted
   choice "as a QUESTION -- keep the painted one or swap to yours? -- as if his two
   rules were in tension and he had to break the tie", and that "a preference he has
   already paid money to express does not need re-confirming." I did that again, six
   days later, citing the law by name in the same message.

*** THE TELL, AND IT IS GENERALISABLE: the tool measured 1,410 of his 1,506 purchased
tiles as "illegal". WHEN A RULE CONDEMNS 94% OF WHAT THE MAN BOUGHT, THE RULE IS WRONG,
NOT THE LIBRARY. That number was printed, read, and treated as a finding about his art
instead of a refutation of the premise. The identical shape had been caught an hour
earlier in the same session (an alpha bug made it read 4 of 1506 legal, absurd enough
to indict the ruler) and was missed the second time only because 94% is less absurd
than 99.7%. ***

=== KILLED ===
tools/bohemia_bought_conditioner.py, banks/BOHEMIA_BOUGHT_CONDITIONED_7_31_26.txt and
records/target/BOUGHT_CONDITIONED.png are DELETED and tombstoned in
gates/bohemia_graveyard.txt with the full post-mortem. NO V2. His tiles ship exactly as
purchased.

=== THE GATE NOW ENFORCES HIS LAW INSTEAD OF MINE ===
gates/bought_first_gate.py, 22 checks, registered as BOUGHT-FIRST (COOKS):
  - VERBATIM: every tile the run draws as his must be BYTE-IDENTICAL to the bank.
    Nothing in the repo checked this, which is precisely why a tool that rewrote his
    pixels could be built, registered and run green.
  - the conditioner can never return under any name, in tools/gates/engine/banks/slices
  - its kill stays on the record in his own words
  - NO TOOL THAT READS A PURCHASED LIBRARY MAY ASSERT A NO-PURE-BLACK LAW. This check
    caught tools/bohemia_bought_audit.py on its first run, still carrying the same
    false claim, and it was fixed rather than exempted.
  - and the original check: every cook tool's REUSE CHECK must name the PURCHASED
    shelf, or say why nothing bought applies
Claude's own painted cooks keep their floor and ceiling. That is Claude constraining
Claude, which is all it ever legitimately was.

=== WHAT SURVIVES, AND IT IS THE PART THAT MATTERED ===
records/BOHEMIA_BOUGHT_AUDIT_7_31_26.md, now purely a SUBJECT-MATTER audit with no
grading of his purchases. All 1,506 purchased tiles decoded and looked at:
  - "4. House wall tiles" (27) is a MEDIEVAL IVY COTTAGE
  - "wall tiles" (41), "2. Wall tiles (1)" (15) are DUNGEON MASONRY
  - "3. Wall panels and details" (28) is SCI-FI CONTROL PANELS
  - "Rooftop and building tops" (46) is CYBERPUNK SKYSCRAPER TOPS, helipads and neon
HE OWNS NO HOUSE WALL AND NO HOUSE ROOF. One pitched roof tile in 47. He owns ground,
street, concrete, path and water, and those are already drawn by the RUN lane. So
painted house art is not competing with a purchase; it is NAMED DEBT under clause 5,
and it shrinks the day he buys a suburban pack.
Sheets: records/target/BOUGHT_WALLS.png, BOUGHT_ROOFS.png.
Also corrected: I had annotated the CMU cook (TF-ART-001) as a bought-first violation
on the strength of a pack NAME. He owns no concrete block wall. The cook stands.

=== NO ART COOKED, AND NO BUILD STAMP BUMP ===
Three house rejections this session; STOP PRODUCING closes the feature. Nothing in the
alpha changed, so bumping the stamp would be the "I didn't see nothing new" failure
inverted.

=== PENDING PAOLO ===
- Doubling the art cell 44 -> 88 px ("thats down the line").
- What colour is rebuilt Vegas.
- Houses: dead for this session under STOP PRODUCING. Needs him to reopen it.
- A suburban wall/roof asset pack is the single highest-leverage purchase for the ART
  lane. He owns 2,525 tiles and not one of them is a house.

CITY (03): 7/31 LATEST — THE RUN EMPTIES AT MIDDAY TOO, AND THE BLOCKER THAT
STOPPED IT WAS A MIS-READ OF MY OWN LANE BOUNDARY.

THE MOST USEFUL THING IN THIS SECTION, first, because it is a thinking error and
those repeat: LAST TURN I FILED THIS WORK AS BLOCKED ON ANOTHER LANE'S FILE AND
IT WAS NOT BLOCKED AT ALL. I wrote that the run could only get the heat condition
if bohemia_agents.js (WORLD's) grew an opts.personFor hook, specified it to the
line, and stopped. But that hook would have supplied `kind` and `shift` - which
are WHEN and WHAT KIND, agents.js's half, and nothing here ever wanted them. What
the run was missing is WHICH PLACE UNDER A CONDITION, which is THIS module's half,
and a caller can apply its own half to its own agents. WORLD's file did not change
by one character.
  I ASKED "WHOSE FILE IS THIS LINE IN" WHEN THE QUESTION WAS "WHOSE HALF IS THIS
  BEHAVIOUR". A boundary drawn around files blocks work that a boundary drawn
  around responsibilities lets through cleanly. Before filing anything as blocked
  on another lane, say out loud which BEHAVIOUR you need and who owns THAT.

WHAT SHIPPED: the run's people now have a day, not just a head-count. Measured in
a real browser on the real run file, bodies outdoors on your block:
    08:00  5    10:00  9    11:00 10    12:00  5    13:00  4
    14:00  3    15:00  3    17:00  8    20:00  4
The street fills to ten, empties to three through the Mojave afternoon, and
refills to eight. The CITY tab already did this; now both surfaces hold one day.

HOW, in four pieces, all in bohemia_population.js (mine):
  shiftEdges        the personal morning, SEPARATE from the conditions. An EDGE
                    may legitimately put somebody out early; a CONDITION never
                    may. Folded together, that law could not be proved - split,
                    the gate checks both.
  conditionSchedule cuts a day at every condition edge, asks placeFor once per
                    segment. The day still tiles [0,1440) exactly once.
  conditionAgents   applies both to agents agents.js built, ALWAYS to the
                    original schedule. Conditioning the last result slid every
                    morning edge 30 minutes earlier on every bulk edit - caught
                    by the gate's own edit-then-unedit round trip.
  personFields(ns)  a namespace, because the CITY tab indexes people per
                    neighbourhood (0..23) and the RUN per cell (0..95); the
                    ranges overlap and two different people shared one id.

IT IS NOT A DRAW-TIME LIE. The sim re-reads agent.sched every tick, so at 13:00
these bodies path to their own doors and go inside. Hiding them in the draw was
named as a wrong answer before it was avoided, and it stays named.

A FORK KILLED THE SAME TURN IT WAS BORN: a three-line "where is this person at
minute M" helper went into bohemia_population.js and zone_map_gate caught it as a
reimplementation of the agent sim. It was RIGHT to catch it. The helper lives in
the gate now, where a reader that does not reuse the code it checks is the point.
Do not put a schedule reader back in that file.

GATE: RUN PEOPLE, 45 assertions, in the suite. Proved able to fail before it was
believed - conditionSchedule stubbed to a passthrough turns 6 of them red.
It is the FIRST gate in this lane that opens slices/BOHEMIA_RUN_CURRENT.html.
That matters: zone map proves the module, CITY PEOPLE proves the CITY tab, MASS
EDIT proves an edit lands, and none of them looked at the surface Paolo plays.

WHAT COMES AFTER, in order:
  1. THE DRAW CAN ONLY BE READ FROM WHERE YOU STAND. The run's viewport is about
     four tiles either side of you, so from your own doorway the honest painted
     count is usually ZERO and "fewer bodies painted at midday" is noise. The day
     shape is carried by the sim's own outAgents (the exact list the draw
     iterates) and the render check is the one that works from any vantage:
     nobody the sim put indoors is still painted. If a body-count-on-screen
     assertion is ever wanted, the gate has to WALK the player to people first.
  2. THE RUN HAS NO WEATHER AND NO PER-CELL POWER READING. ctx ships {} - a clear
     unpowered day, which is 88% of the valley by the CLUSTERED POWER law. The
     darkStay and wetStay conditions are therefore live in the CITY tab and inert
     in the run. One object literal in the run patch learns about it when the run
     gains weather.
  3. TWO GATES ARE RED ON MAIN AND NEITHER IS THIS LANE'S: RIG CHECK (the
     headshot ragdoll patch cites joint `waC`, which is not really used) and BODY
     VARIATION (the frame cache DOES hash the dials - a comment grew between
     `frameLookHash` and `G.bodyVar` and pushed it past the assertion's 400-char
     window). Both arrived with the CHARACTER lane's 7/31 headshot commit and both
     are in their files. Left alone on purpose: ONE SYSTEM, ONE SESSION.
  4. The eight tile forms from 7/28 are still with the ART lane. Nothing here
     blocks them.
  5. [PENDING Paolo] does the game ever SHOW a schedule? Majora's Mask ships the
     Bombers' Notebook because a routine nobody can observe is wasted work.

DO NOT: build a second schedule system. Do not put a schedule reader back in
bohemia_population.js. Do not raise the population because it "feels empty" - a
quarter of the map is empty ON HIS ORDER and the gate will catch you. Do not let
conditions push anybody OUT.

PEOPLE (7h9sfy): 7/31 LATEST — THE NEIGHBOURS ARE PEOPLE NOW. First session of this
lane. RUN TAB, build 7/31t.

=== WHAT HE CAN GO LOOK AT, IN THE RUN TAB ===
Walk out your front door and up to anybody on the block. The one button now reads
TALK TO THE SCAVENGER (or WORKER / KEEPER / WATCH) instead of HANG OUT (1 HOUR).
Tap it: their own face, and six lines about them — where they live, what they do,
what they are doing RIGHT NOW, the hours of their day, and whether you have met
before. Walk away, come back tomorrow, load a save: same person, and they
remember you. Proof shot through the real alpha with the real cast:
slices/BOHEMIA_PEOPLE_CARD_ALPHA_7_31_26.png
HANG OUT IS NOT GONE. It moved INSIDE the conversation ("Hang out for an hour"),
still one verb, still costs the hour. You just know who you spent it with now.

=== THE ONE DECISION WAITING ON HIM ===
DO THE NEIGHBOURS GET NAMES? The card says NOT NAMED YET on purpose. NAMED_CAST
and LINES ship EMPTY and the gate fails if either gains a row; there is NO
procedural name generator and the gate sweeps the module for a name bank, because
bohemia_agents.js:24 has said since 7/19 that "character names are Paolo's" and
nothing repealed it. Three answers are all legal: (a) he writes a named cast,
(b) they stay role-and-house forever (which is a real design, not a hole — you
know the scavenger from house 16 without knowing her name), (c) he rules that
procedural names are allowed and this lane builds the generator. UNTIL HE PICKS,
NOTHING HERE MOVES. Do not pick for him.

=== WHY ITEM 1 AND NOT ITEM 0 (do not rebuild the dialogue system) ===
PEOPLE 0 is "THE DIALOGUE SYSTEM v1" and it was ALREADY BUILT. REUSE-FIRST found
it before anything got cooked: engine/bohemia_quest_runtime.js plus the run's own
TALK sheet already play .bq conversations end to end (speaker, portrait, says,
choices, silences, noverbs), and run_gate has proved S01 playable on both forks
since 7/26. The runtime was never missing. What was missing is that the sheet only
ever opened for the ONE quest speaker. Backlog item 0 is annotated accordingly.
WHAT IS ACTUALLY LEFT ON ITEM 0: nothing this lane may build alone, because a
non-quest conversation needs WORDS and the words are his.

=== THE DESIGN, and the one decision worth inheriting ===
    an AGENT is a BODY.      Where it stands, what it is doing this minute.
    a  PERSON is an IDENTITY. Who that is, forever.
IDENTITY IS DERIVED, NEVER STORED. The run's applyBlob() throws every agent away
on a save load and rebuilds them from the seed, so an identity hung on an agent
object dies on every load. The same three numbers the body comes from
(blockSeed, house, slot) resolve to the same person on any device, on any load.
Persistence with nothing persisted. That is why the meeting ledger is keyed by a
derived key and not by an agent.
engine/bohemia_people.js. Full write-up: records/BOHEMIA_PEOPLE_IDENTITY_7_31_26.md

=== TWO REAL BUGS THE GATE CAUGHT, BOTH MEASURED ===
1. HALF OF PAOLO'S TOWNSFOLK BODIES HAVE NEVER BEEN ON SCREEN. The alpha bakes
   RUN_LOOKS=6 and the run drew each body with looks[agent.seed % 6]. Measured
   over 528 bodies on 40 generated blocks: that expression returns 0, 2 or 4 and
   NEVER 1, 3 or 5. Root cause is a JavaScript trap, not a typo — bohemia_agents
   .hash ends in `(h*2654435761)>>>0`, a float64 multiply landing near 1.1e19,
   past 2^53, so the low ~11 bits are rounded away and every seed is a multiple
   of 512. Dead low bits means `% smallNumber` is dead.
   I DID NOT FIX THAT HASH, deliberately: it also decides which houses are
   occupied, household sizes and every schedule in the valley, so changing it
   reshuffles the population and breaks "same cell = same people" for every save
   that exists. Fixed at the modulus instead (mix32, Math.imul, exact 32-bit).
   All six of his bodies appear now. Gate B9 keeps the ORIGINAL measurement
   red-able so nobody can put the raw seed back quietly.
2. MINE, and only the real-browser half could see it: identity was keyed to the
   world SEED — which is literally 7 for the whole valley — instead of the block
   seed. House 3's second resident would have been the same person in every cell
   there is, with a ledger that "remembered" strangers. Gate C4b.

=== GATE ===
gates/people_gate.js, registered as PEOPLE, 63 checks. A (12) his tables empty and
load-bearing, no name bank, the hole VISIBLE not hidden. B (23) identity derived
and stable across independent builds and sim rebuilds; the ledger round-trips
through JSON. C (28) THE REAL RUN at 390x844: out the real front door, chase a
real body across the block on the real arrows, tap the real button, read the card,
sample the portrait's PIXELS, walk away, come back remembered, export the save,
load it on a fresh page, still remembered.
EIGHT MUTATIONS, ALL CAUGHT (a gate green first try has not been tested): a
placeholder name; a placeholder line; a name bank; the raw seed put back; the NAME
row quietly hiding the empty table; the ledger no longer surviving JSON; identity
keyed to the valley; the body drawn from the raw seed. Two are caught ONLY by the
browser half.

=== TWO REDS I INHERITED AND DID NOT TOUCH (proved, not assumed) ===
The full suite came back 3 red. ONE WAS MINE and is fixed: REUSE FIRST swept this
lane's patch tool (correctly — the code it injects calls drawImage) and it now
carries a truthful REUSE CHECK: it cooks zero pixels and draws only the alpha's
already-baked cast and the run's existing sheet.
THE OTHER TWO ARE THE CHARACTER LANE'S, and I proved it the way the 7/30 note
says to — by running them on origin/main where they came back BYTE-IDENTICAL:
  RIG CHECK      bohemia_headshot_ragdoll_exemption_patch.py: claimed joint waC
                 is really used                        (161 pass / 1 fail, both trees)
  BODY VARIATION the frame cache hashes the dials       (20 pass / 1 fail, both trees)
Both arrived with "THE HEADSHOT WAS FROZEN BEFORE IT COULD FALL". A third lane
(ec08dcd) flagged the same two independently. Flagged by owner, NOT fixed here:
a red you did not cause never gets fixed by editing another lane's system to make
your own suite green.

=== I ALSO CLEANED UP A HANDOFF THAT SHIPPED WITH CONFLICT MARKERS ===
This file was on main with a live <<<<<<< / ======= / >>>>>>> in it (LAB's section
against RUN's). BOTH sides were kept verbatim — they are different lanes' sections
and this file is append-only, so "keep both" loses nobody's text and needed no
judgement call. Nothing was chosen between and nothing was dropped.

=== BOUNDARY, STATED PLAINLY ===
The run surface is the RUN lane's file. Every edit to it is reproduced by
tools/bohemia_people_identity_patch.py, which is idempotent AND fully reversible —
proved byte-for-byte both directions. So a rebase is
`git checkout origin/main -- slices/BOHEMIA_RUN_SLICE_7_26_26.html` then re-run the
tool, never a hand merge. That is exactly how this session landed on top of the
SOUNDS lane's footsteps commit, and it lost none of their bytes (RUN GATE 126/126
after).

=== WHAT COMES AFTER, in order ===
1. HIS NAMES ANSWER (above). One word unblocks the whole lane.
2. PEOPLE 2, THE FACTION STANDING LEDGER. NOT BLOCKED, and bigger than it looks:
   engine/bohemia_engine.js already carries a full Factions system (STANDING
   -100..100, rungs HOSTILE/COLD/NEUTRAL/WARM/FWU, territory, quota AI). It is not
   wired to the player at all. The work is a PLAYER standing ledger against it,
   shipped empty like the purse — no action-to-standing table until he rules one.
   REUSE-FIRST: read that module before writing a line.
3. PEOPLE 3, the companion social layer, still waits on the combat extraction.
4. Flagged, NOT claimed — for CHARACTER: the six portraits are six colourways of
   ONE face (the baker renders the same spec and varies tints + hat). Six people
   look like one person in different jackets. Not this lane's system.
5. Flagged for whoever owns the valley: a person is per BLOCK. Nobody follows you
   between cells, and bohemia_population.js is still numbers rather than
   identities. That is the shape the companion layer will need.

STANDING FOR THIS LANE: MECHANISM-MINE AT ITS PUREST. Every named character,
faction disposition and line of dialogue is his. Tables ship empty and gated;
procedural identity fills below the named tier and NEVER invents a name. Derive
looks from CHARACTER's rig, never new bodies. Quest text stays the questbook's.
This lane builds the MOUTH, not the words.

--------------------------------------------------------------------------------

LAB (e2r7sv): 7/31 (g) LATEST — I FOUND TWO LIVE LAWS CONTRADICTING EACH OTHER.
BUILDINGS ARE EARNED, NOT AFFORDED.

Paolo: "VALHEIM PROJECT ZOMBOID FALLOUT NEW VEGAS WITH POCKET CITY 2 ONTOP OF IT".
Pocket City 2 was ALREADY LOCKED as the city-builder base on 7/1/26 -- he was naming the
whole stack. Going to READ that addendum before building anything is what found the bug.

=== THE BUG, AND WHY IT MATTERS TO EVERY LANE ===
The 7/1 city-builder law required "Daily upkeep on everything... Overbuilding past your
income bankrupts you." His 7/31 TEN YEARS COLD law bans economic gameplay as a CATEGORY.
Two live canon files disagreeing is a BUG by CLAUDE.md, not a judgement call.
RESOLVED newest-wins: laws/BOHEMIA_ADDENDUM_EARNED_NOT_AFFORDED_7_31_26.md. Upkeep,
income and bankruptcy are DEAD and struck through IN PLACE in the 7/1 file, so a reader
who opens only that one cannot act on a dead clause. Everything else there stands.
*** IF YOU ARE ABOUT TO BUILD FROM A LAW, CHECK ITS DATE AGAINST THE NEWER ONES FIRST. ***

=== THE REPLACEMENT, GROUNDED NOT INVENTED ===
BUILDINGS ARE EARNED, NOT AFFORDED. In Pocket City 2 buildings unlock by levelling,
quests, City Competitions, Hard/Expert difficulty and new biomes, and there are no
microtransactions -- money exists and IS NOT THE GATE ON PROGRESSION. Our own 7/1
addendum already said this and buried it under the upkeep clause.
AND THE STACK IS ONE LOOP, not four systems: Pocket City 2 also tracks a "Relation rating
with institutions and citizens", the SAME AXIS as New Vegas standing that LAB-09 modelled.
You do things -> you earn standing and capability -> the city grows -> the grown city
makes you worth more to deal with. Valheim = the only rising curve. Zomboid = the dead
utilities. New Vegas = the currency. Pocket City 2 = the unlock gate.

=== GATE ===
gates/earned_not_afforded_gate.js (EARNED NOT AFFORDED, 19 checks, 156 surfaces swept).
Four mutations caught. TWO BUGS IN MY OWN CHECKS, both fixed with the reason written into
the source: prose matched against hard-wrapped text (SEVENTH time -- prose is now
whitespace-collapsed once for the whole file), and a pending-check whose regex matched the
entire document so every pending passed regardless. The second was found ONLY by mutating
a pending and watching the gate stay green. A CHECK YOU HAVE NOT SEEN FAIL IS NOT A CHECK.

=== THE ONE REAL HOLE THIS OPENS (his call) ===
WITHOUT UPKEEP, HOW DOES NEGLECT BITE? "Everything can genuinely be rubble" is locked and
now needs a mechanism that is not money -- decay over time, or standing lost with the
people living there. Also still his: what each act's buildings cost in effort/quests/
standing (a cost TABLE is canon), the building catalog, the zone naming.

LAB (e2r7sv): 7/31 (f) LATEST — READ THIS BEFORE YOU ASK HIM ANYTHING.
I ASKED HIM TWO QUESTIONS HIS OWN LAWS ALREADY ANSWERED, IN TWO CONSECUTIVE TURNS.
THERE IS NOW A GATE THAT FAILS THE BUILD FOR THAT.

=== WHAT HAPPENED ===
Paolo: "BROTHER FOR BOHEMIA ITS NOT A ONE LIFE RUN IVE ANSWERED THIS LIKE 50 TIMESS!!!!!"
Turn 1 I asked whether a dead utility "disappears or gets an owner" -- settled by
CLUSTERED POWER (the lit ~12% is OWNED) and LIGHT=TERRITORY. Turn 2 I asked what happens
to standing "when the run ends" -- BOHEMIA IS NOT A ONE-LIFE RUN. IT IS A DYNASTY: three
generations (Animal/Human/Angel) across ~100 years, dynasty saves spanning all three,
heirs inheriting the choice log, companions do not die. Settled in FIVE law files before
he had to say it again.
The autonomy doctrine already requires a JUDGE THIS list every turn. NOTHING IN THE
MACHINE CHECKED WHETHER THE QUESTIONS ON IT WERE REAL. That was the hole.

=== THE MACHINE THAT CLOSES IT ===
records/BOHEMIA_ANSWERED_QUESTIONS_INDEX.md — 18 settled questions, each with the ruling
that settles it and a one-line answer. MECHANISM-MINE/CONTENTS-PAOLO'S: no lane decides
what is settled, every row cites HIS ruling, and a row without a citation is not a row.
gates/answered_gate.py (ANSWERED, 13 checks, 146 files swept) — reads the index, proves
every row cites a file that EXISTS, and sweeps this handoff + the backlog + records/ for
QUESTION-SHAPED text. A session asking a settled question FAILS THE BUILD.
laws/BOHEMIA_ADDENDUM_NEVER_ASK_A_SETTLED_QUESTION_7_31_26.md — clause 1 is the dynasty
ruling; clause 2 extends NOTES ARE RULINGS from his words to his LAWS; clause 3 makes
adding a row a same-turn obligation whenever he rules something.

*** IF YOU ARE ABOUT TO ASK HIM SOMETHING, SEARCH THAT INDEX FIRST. ***

=== TWO THINGS WORTH YOUR TIME REGARDLESS OF LANE ===
1. IT CAUGHT THE OFFENDING LINE IN THIS HANDOFF ON ITS FIRST RUN. Then its own first
   draft made the repo's SIXTH word-versus-thing mistake -- it grepped for the phrase
   and failed on my paragraph EXPLAINING the withdrawal. A gate written to fix a
   discipline failure, making the exact class of error it was written about. Both are
   recorded in the gate's source. MATCH THE STRUCTURE, NEVER THE MENTION.
2. ADD A ROW THE TURN HE RULES SOMETHING. The index is only as good as the habit, and
   the gate can only enforce what is in it.

LAB (e2r7sv): 7/31 (e) LATEST — I BUILT THE PREQUEL, HE CORRECTED ME, AND THE ANSWER
IS THAT THE CURRENCY IS STANDING. (Four earlier 7/31 LAB sections below.)

=== WHAT I GOT WRONG, FIRST, BECAUSE IT IS THE USEFUL PART ===
Paolo: "IM CONFUSED BY YOUR QUESTION THE WHOLE POINT OF THE GAME IS THAT IT STARTS TEN
YEARS AFTER THE ECONOMIC CRASH BRO WTF... I DONT WANT IN THE GAME U GOTTA BE DEALING
WITH SOME WEIRD ECONOMIC GAMEPLAY THE WHOLE WORLD IS BASED ON THE UTILITY DYING
EVERYWHERE"
LAB-08 simulated the crash HAPPENING in a game that opens ten years after it ended.
Every number was real and sourced and NONE OF IT MATTERED -- the player was not there.
Then I ended the turn asking whether a dead utility should "disappear or get an owner",
A QUESTION HIS OWN CANON HAD ANSWERED TWICE (CLUSTERED POWER: the lit 12% is OWNED;
LIGHT=TERRITORY). I had read those as atmosphere; they are the infrastructure ruling and
they were already complete.
*** THE RULE TO TAKE OUT OF THIS, and it is cheap: BEFORE RESEARCHING A SYSTEM, NAME
THE YEAR THE PLAYER IS STANDING IN. One sentence at the top of the work kills two of the
three root causes. The repo's own word for the setting is POST-economic-apocalypse, in
CLAUDE.md's first paragraph, and I read it as "economic apocalypse" and built the
apocalypse. ***
AND THE THIRD ROOT CAUSE, worth every lane's attention: 491 GREEN CHECKS SAID NOTHING.
Every one verified the page did what its record said; none could ask whether the page
should exist. That is the STOP PRODUCING law's warning holding exactly true.

=== LAW + KILL ===
laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md, three clauses: (1) the crash is
BACKSTORY, nothing simulates it happening; (2) NO ECONOMIC GAMEPLAY as a CATEGORY;
(3) the utility is DEAD EVERYWHERE already, not a timer.
*** PLUS A BOUNDARY PARAGRAPH EVERY LANE SHOULD READ: what is banned is A PRICE THAT
MOVES BY ITSELF, not a price that EXISTS. My gate's first version FAILED
engine/bohemia_purse.js -- another lane's brand-new module whose PRICES table ships
empty and [PENDING Paolo], which is MECHANISM-MINE/CONTENTS-PAOLO'S done right. I would
have accused a sibling lane of breaking a law it was obeying. A TAG IS FINE, A MARKET IS
NOT. ***
KILLED: the crash page, deleted + graveyarded + post-mortem
(records/BOHEMIA_THE_CRASH_KILL_7_31_26.md). Its two records survive marked DEAD
(Zomboid precedent). NO V2. Its one CONFIRMED finding -- a dead utility has an OWNER --
is load-bearing in the law that killed it.

=== SHIPPED INSTEAD: LAB-09 (NOT IN A TAB, a lab reference surface) ===
slices/lab/BOHEMIA_LAB_TEN_YEARS_COLD_7_31_26.html
*** TEN YEARS COLD, MONEY IS NOT THE CURRENCY. STANDING IS. *** New Vegas works because
FAME AND INFAMY ARE TWO SEPARATE COUNTERS THAT NEVER CANCEL -- which is why it has words
no other game has (WILD CHILD, DARK HERO, SOFT-HEARTED DEVIL). ONE SLIDER IS A STAT, TWO
COUNTERS IS A PERSON. Proved in play: one repeated deed walks your title through three
names while neither number ever falls.
THE CITY-BUILDER HALF, which is what he was pointing at: *** YOU DO NOT BUILD TO GET
RICH, YOU BUILD TO BECOME SOMEBODY THEY HAVE TO DEAL WITH. *** With money banned a
building cannot pay you, so it makes you worth dealing with, compounding across the acts
under the CENTURY RULE. The builder is not a mode bolted onto an RPG, it IS how you earn
standing. Valheim's comfort gets a second job: standing WEIGHT.
THIRD: their thresholds are per-faction and unequal -- Brotherhood accepts at 3, Legion
idolises at 100. That is how a small faction matters WITHOUT being buffed. And the hard
gate: fame >=90 AND infamy <4, so YOU CANNOT BUY YOUR WAY OUT OF A BAD NAME WITH GOOD
DEEDS.
SOURCED, better than a number: xNVSE/NVSE GameData.h:6 + :228 -- `class TESReputation;`
and `tList<TESReputation> reputationList;`. Real open-source C++ proving reputation is a
FIRST-CLASS GAME DATA LIST, not a quest variable. The SHAPE is sourced even though the
values are [DOC].

=== GATES ===
lab_gate.js: new row, 19 live checks (Y0-Y18) + 4 forbidden-CATEGORY checks (Z1-Z4).
486 checks, 0 fail. LAB-08's row removed; crashDidNotReopenLoot KEPT because the
forbidden-feature pattern is the most reusable thing that dead row produced.
NEW: gates/ten_years_cold_gate.js (TEN YEARS COLD, 26 checks). Its Part C SWEEPS ALL 156
SHIPPED SURFACES for the banned category, because a banned CATEGORY needs a sweep and
not a paragraph. Six mutations caught.
FOUR FALSE POSITIVES FIXED IN MY OWN CHECKS THIS TURN. The pattern is now named five
times in this repo: A CHECK THAT HUNTS A WORD INSTEAD OF A THING. One of them failed
another lane's correct module. If you write a gate, match the STRUCTURE.

=== BOUNDARY ===
A PEOPLE LANE WAS REGISTERED ON MAIN THIS TURN owning dialogue, NPC identity, FACTION
STANDING and companion social. STANDING IS THEIRS. This page is a reference surface,
touches none of their code, claims nothing, and the pattern note names them. FLAGGED,
not handed over. No economy on the page by law; THREE CURRENCIES untouched.

=== WAITING ON HIM ===
1. Is STANDING the thing you spend, and BUILDING how you earn it? Two counters that
   never cancel, rather than one slider?
2. *** THIS SLOT USED TO HOLD A QUESTION I HAD NO BUSINESS ASKING. *** I asked "in a
   roguelite, what happens to standing when the run ends" and he answered "BROTHER FOR
   BOHEMIA ITS NOT A ONE LIFE RUN IVE ANSWERED THIS LIKE 50 TIMESS". It is a DYNASTY --
   three generations (Animal/Human/Angel) across ~100 years, dynasty saves spanning all
   three, heirs inheriting the choice log, and companions do not die. Settled in FIVE
   law files. So standing CARRIES; the open design question is only HOW an heir
   inherits it, and that is PEOPLE's lane now, not a question for him.
   THE MACHINE THAT STOPS THIS: records/BOHEMIA_ANSWERED_QUESTIONS_INDEX.md +
   gates/answered_gate.py (ANSWERED). It sweeps this file, the backlog and records/
   for question-shaped text and FAILS THE BUILD if a session asks something canon has
   already ruled. It caught this very line on its first run. If you are about to ask
   him something, search that index first.
3. Is EARN-YOUR-MULTIPLIER the shape for weapons? (LAB-07)
4. The three bleed rules; the camp dial playtest; the ten open camp clauses; the action
   clock's denomination and ceiling.
NEXT WORTH STUDYING (flagged, not claimed): New Vegas's endgame territory
redistribution -- who ends up owning the dam -- the most relevant NV mechanic to a
100-year city-builder.

LAB (e2r7sv): 7/31 (d) LATEST — THE MODERN ECONOMIC CRASH, FUSED. AND THE FINDING IS
THAT OUR POWER LAW AND OUR ECONOMIC COLLAPSE ARE THE SAME LAW.
(Three earlier 7/31 LAB sections below: Valheim weapon types, the CDDA action clock, and
the ruling that made its shape law.)

=== HE COMMISSIONED IT IN FOUR WORDS ===
Paolo 7/31: "modern economic crash valheim project zomboid cook it up"

=== THE FINDING ===
*** BOTH GAMES MODEL A UTILITY *VANISHING* ON A TIMER. REALITY MODELS IT GETTING AN
*OWNER*. *** Zomboid flips the power off on day 14 and that is the end of the story: the
grid is a boolean that flips once and never flips back. What actually happened in Lebanon
is that the state grid fell to about FOUR HOURS A DAY and private generator cartels sold
you the other SIX AND A HALF, by the AMPERE, for OVER $100 A MONTH -- priced in hard
currency while wages were in the money that was busy dying. The utility was not deleted.
It was privatised at gunpoint. A boolean is not a decision; an owner is.
*** AND WE ALREADY HALF-HAVE IT. CLUSTERED POWER (12% lit, OWNED, the network eerily
perfect) and LIGHT=TERRITORY were written as ATMOSPHERE. Lebanon is the evidence that
they are ECONOMICS. THE CLAIM THIS ROW MAKES, and it is worth arguing with: Bohemia's
power law and Bohemia's economic collapse are ONE LAW and we have been treating them as
two. ***

SECOND FINDING: every curve in a collapse falls on a clock you do not control; the only
one that rises is the one you built with your hands. That is Valheim's comfort, and it is
why the fusion he named actually fuses.
THIRD FINDING, and no game models it: THE FREEZE. Games model being broke as an empty
wallet. Reality's is worse -- the money is RIGHT THERE, yours, on a screen with your name
on it, and you may have 60 euros of it today. Measured: under Lebanon's ~$400/month cap a
20,000 balance takes 50 MONTHS to extract, by which time it is worth 1.7%. YOU CANNOT WIN
THE RACE.

=== SHIPPED ===
PAGE (NOT IN A TAB — lab reference surface; clause 3 forbids the alpha from linking it):
slices/lab/BOHEMIA_LAB_THE_CRASH_7_31_26.html — the money dies / the freeze / the grid
dies / the cartel / comfort, all five playable.
8 SOURCED numbers (7 from a real apocalypse_SandboxVars.lua: WaterShut/ElecShut = 2, both
modifiers = 14, plus DayLength/Zombies/StartMonth; and the one Valheim line we already
own). Everything else [DOC] and tagged: Lebanon (peg 1507.5 held 22 years -> official
89,500 on 15 Feb 2024, >98% gone, bank assets $217bn -> $104bn, ~$400/mo cap, 4h state
power, 5A / 6.5h / $100+), Greece 2015 (60 EUR/day per card), Argentina 2001 (250
pesos/week), and the hyperinflation record as DOUBLING TIME (Weimar 3.7 days, Zimbabwe
24.7 hours, Hungary 1946 fifteen hours). That last translation is a HUD lesson: a
percentage past a few thousand means nothing to a human, "prices double every fifteen
hours" is instantly horrifying.
Records: records/lab/BOHEMIA_LAB_THE_CRASH_TEARDOWN_7_31_26.txt + ..._PATTERN_NOTE_...md
(ten failed source probes listed by URL, so "no source" is checkable).

=== WHAT I DID NOT BUILD, AND IT IS THE MOST IMPORTANT LINE HERE ===
ZOMBOID'S LOOT. He said "project zomboid" and the lazy reading is to go back to the
containers. Two loot emulations died in two days, and under STOP PRODUCING finding a legal
way to ship a killed feature IS the violation. So the row took the one thing Zomboid has
that is not loot and is world-class: the utility shutoff timer.
*** AND THE BAN IS NOW MACHINE-ENFORCED. New checks C1/C1b/C2 prove the row did not
quietly reopen loot -- matched as a STRUCTURE (container tables, roll counts, per-item
search time), NEVER a mention, because the record is REQUIRED to discuss loot in order to
ban it. Everything else in lab_gate tests what a page DOES; this is the first check that
tests what it was FORBIDDEN to do. Without one, the STOP PRODUCING law had no machine
behind it at all. Worth copying into other lanes' gates. ***

=== REUSE-FIRST, APPLIED TO FINDINGS ===
The Valheim comfort numbers were read out of our own LAB-05 teardown, not re-researched,
including which are SOURCED and which are DOC. And I read
records/BOHEMIA_ECONOMIC_APOCALYPSE_SCOPE_RESEARCH_7_28_26.md FIRST: it already owns the
MACRO half (72-hour shelf, letters of credit, trade routes), so this page is deliberately
the DAILY-LIFE half. They do not overlap and cannot rot against each other.

=== GATE ===
lab_gate.js: new row, 25 live checks (X0-X24) + 3 forbidden-feature checks, learned the CR
block. 491 checks, 0 fail. EIGHT mutations caught, including LOOT REOPENED.
ONE REAL BUG THE GATE CAUGHT IN MY OWN MATHS: the devaluation curve was fitted over 60
months of 30 days = 1,800 days and then queried at day 1,825, overshooting the real
Feb-2024 rate by 6%. Refitted per-day. A calendar approximation inside a curve you then
query with real dates is a bug, not rounding. Also fixed two things only a screenshot
shows: the watermark sat on a card heading, and Lebanon's "400/month" clipped off the
right edge.

=== BOUNDARY ===
THE ECONOMY IS NOT THIS LANE'S SYSTEM. WORLD is building the purse right now. This page
touches no economy code, adds no price and no currency, and the THREE CURRENCIES law
stands untouched -- resources, electricity, clout, no fourth thing (an "exchange rate"
would be a fourth currency wearing a hat). FLAGGED FOR WORLD, not handed to it.

=== WAITING ON HIM ===
1. Should the collapse be falling curves you cannot touch plus exactly ONE rising curve
   that is whatever you built? And: when a utility dies, does it DISAPPEAR or get an
   OWNER you have to deal with?
2. Is EARN-YOUR-MULTIPLIER the shape for weapons? (LAB-07)
3. The three bleed rules (sharp-or-shot-never-blunt / only-what-got-past-your-clothes /
   most-hits-don't).
4. The camp dial playtest, the ten open camp clauses, and the action clock's denomination
   and ceiling number.

RUN (eak241): 7/31 LATEST — READ laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md FIRST.
It is his 7/31 rant taken apart into 19 LOCKED clauses with a GATE column that is
allowed to say NOT ENFORCED. That file is the handoff for this work.

THE ONE FACT THAT COST THE MOST TIME, AND WILL COST YOURS IF YOU MISS IT:
  var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;
THE RUN TAB OPENS THE CITY PANEL. Deliberate, his 7/25 one-view ruling, and the
alpha says so in a comment right there. He has NEVER opened
slices/BOHEMIA_RUN_SLICE_7_26_26.html. A rendering fix that lands only in the run
slice is invisible to him. CHECK WHICH FRAME THE TAB LOADS BEFORE FIXING ANYTHING
VISUAL. I did not, and shipped two "fixes" he could not see.

REAL AND ON HIS SCREEN (both live in bohemia_suburb.js, which the CITY embeds):
  - driveways exactly 4x5, garage-aligned (supersedes his own "2 wide" the same day)
  - NO BUILDING ON THE SIDEWALK in the suburb: the walk is laid BEFORE the houses,
    so home() cannot claim the land. Order IS the enforcement. Reverting the order
    puts 456 masses back on the kerb across 24 blocks.
  - both held by gates/suburb_street_gate.js (13 checks)

REAL BUT RUN-SLICE ONLY, SO HE CANNOT SEE IT (marked that way in the law, not
counted as a win): the door drawn 1:1, the device-resolution canvas, the zoom.

TWO THINGS I GOT WRONG AND CORRECTED IN-SESSION, both worth reading:
  1. I "fixed" the city's canvas to a device-pixel buffer as the answer to his
     pixel complaint. canvas_scale_gate went red and its HEADER held the
     measurement I was about to redo wrong: the CITY lane solved this on 7/27 with
     cv.style.imageRendering='pixelated' while walking, so the phone's 3x upscale
     is already NEAREST. My change was a placebo -- same 132 physical pixels either
     way, 9x the memory, broke a locked contract. REVERTED, tool deleted.
     A RED GATE FROM ANOTHER LANE IS EVIDENCE, NOT AN OBSTACLE. Read its header.
  2. HIS PIXEL-QUALITY COMPLAINT IS THEREFORE STILL OPEN AND UNEXPLAINED. Every
     obvious mechanical cause is ruled out. DO NOT GUESS A THIRD TIME -- ask him
     which screen and what zoom, or get a screenshot with a known stamp.

D1 IS TRUE IN 1 OF 48 DISTRICTS. Measured: 5,195 building cells still sit on public
streets (mall 1566, industrial 1455, trailer 498, farm 438, battery 360, medical
288, +5 more), and 36 of 48 districts have no sidewalk concept at all. layWalks is
PRIVATE to bohemia_suburb.js and sidewalk_gate never touches K.types(). Full table,
root cause and fix order are in the law file.
  VERIFIED BY HAND: bohemia_mall.js:55 draws a drive lane THROUGH both anchor
  stores -- 59 street cells inside the west anchor. NOT FIXED: the building spans
  x=2..126 so the only free columns are the plot edges, and rerouting the ring is
  designing a layout, which MAP LAW forbids. Exact lines are in the law.

[PENDING Paolo, blocks the registry-wide D1 gate]: does D1 inherit WALKABLE-LAND's
vehicular-venue exemption? A railyard with a sidewalk is silly, but that is his call.
[PENDING Paolo]: the interior rebuild (A1/A3/A4) is ONE architectural item --
mode='int' swaps the player onto a separate grid, and six of his complaints are
downstream of it. Biggest remaining item. He was asked; he has not answered yet.

LAB (e2r7sv): 7/31 (c) LATEST — VALHEIM'S WEAPON TYPES, AND THEY ANSWER THE HOLE THE
COMBAT AUDIT FOUND. (Two earlier 7/31 LAB sections below: the CDDA action clock, and
the ruling that made its shape law.)

=== HE COMMISSIONED IT BY NAME ===
Paolo 7/31: "look at the weapon types in valheim. valheim does weapon types really good
so i like that. valheim i think is a top 5 game of all time the most we can suck from it
the better."

=== THE FINDING, AND IT IS BIGGER THAN A WEAPON LIST ===
VALHEIM'S WEAPON SYSTEM IS A DAMAGE-MULTIPLIER SYSTEM WEARING A WEAPON LIST AS A
COSTUME. Almost nothing good about it is the damage printed on the weapon. It is FOUR
MULTIPLIERS YOU EARN -- know what you are fighting (up to 2x), stand behind it (3x,
knives 10x), time a block (2x), have used the thing before (raises your floor) -- and
the weapon's real job is deciding WHICH of the four you can reach.

*** AND IT LANDS EXACTLY ON THE HOLE HIS OWN AUDIT FOUND. His north star
(laws/BOHEMIA_ADDENDUM_WHAT_COMBAT_IS_FOR_7_27_26.md): "deal the most damage and take
the least amount of damage by positioning and abilities and deeper understanding of
mechanics." His audit (records/BOHEMIA_COMBAT_AUDIT_AGAINST_THE_NORTH_STAR_7_27_26.md),
in capitals: "DEAL THE MOST DAMAGE BY POSITIONING -- NOT IMPLEMENTED AT ALL" and of the
seven ability verbs, "None of them increases your damage." HALF HIS SENTENCE HAS NO CODE
BEHIND IT. Valheim's four multipliers are that missing half one for one. He did not ask
me to solve that; it is just what was at the bottom of the thing he pointed at. ***

=== SHIPPED ===
PAGE (NOT IN A TAB -- a lab reference surface; lab_gate clause 3 forbids the alpha from
ever linking it): slices/lab/BOHEMIA_LAB_VALHEIM_WEAPONS_7_31_26.html
Five mechanics end to end: damage types / resistances / backstab / parry / weapon skill,
built as a TURN-BASED GRID because that is Bohemia's language. A real-time Unity clone
would prove nothing about whether the idea survives the translation, which is the only
question that matters.
SIX IDEAS WORTH STEALING, ranked in the pattern note: (1) resistance applied PER DAMAGE
TYPE, then armour on the total -- so a split-damage weapon gets partial credit and
"wrong weapon" is a TAX, not a WALL. Most portable idea in the document. (2) The
matchups are PHYSICAL INTUITIONS (bones don't care about a hole; you cannot stab a
puddle), so the table is learnable and you can guess a new enemy right. (3) SKILL RAISES
YOUR FLOOR -- their ceiling is finished at level 75, so the last quarter of mastery buys
only CONSISTENCY. Mastery means you stop getting robbed. (4) One number can be a whole
playstyle (knife 10x). (5) Your DEFENCE choice sets your OFFENCE ceiling, and there are
two roads to the same 2x -- grind the 40%-of-health stagger limit, or parry once.
(6) NOBODY IS WEAK TO SLASH: the default weapon has no matchup to exploit, so the
generalist is never optimal and never wrong. A deliberately flat generalist is a
kindness.
MODEL, NOT A MEASUREMENT. Valheim is a compiled Unity DLL. Three numbers are genuinely
SOURCED from real open-source C#: ValheimPlus/GameClasses/Skills.cs:101-122 (the real
SkillType enum, which means A WEAPON TYPE IS A SKILL rather than a stat block) and
Player.cs:376 (`item?.m_shared.m_skillType` -- the one field the entire system hangs
off). Everything else is [DOC] and tagged. The teardown lists all NINE failed source
probes by URL, so "no source" is checkable rather than asserted.
RECORDS: records/lab/BOHEMIA_LAB_VALHEIM_WEAPONS_TEARDOWN_7_31_26.txt and
..._PATTERN_NOTE_7_31_26.md.

=== TWO REAL BUGS THE MACHINE CAUGHT IN MY OWN WORK ===
Both fixed with the reason written into the source, because the reason is the lesson.
1. Runtime bodies were hand-listed WITHOUT their resistance table, so resolveHit read
   enemy.mods[t] off undefined and ANY ATTACK WOULD HAVE THROWN. The live half caught it
   before it was ever committed. That is the entire argument for driving the page's own
   functions instead of a second copy of the maths.
2. The proof screenshot backstabbed the seeker, and a x10 knife DELETED it (165 into 110
   hp) -- so the proof shot of the backstab mechanic contained no backstabbed creature.
   Only visible by looking at the rendered pixels. Target is the troll now.
Also capped the grid cell at 44px after measuring the board eating 52% of the phone.

=== GATE ===
lab_gate.js: new row, 31 live checks (W0-W30), learned the VW constant block. 413
checks, 0 fail. Eight mutations caught: resistance ignored, backstab from anywhere,
armour flattened, stagger removed, parry made a freebie, skill ceiling uncapped, all
skills levelling together, somebody made weak to slash.

=== BOUNDARY, STATED PLAINLY ===
COMBAT IS NOT THIS LANE'S SYSTEM. Under the parallel-sessions law this page touches no
combat code, no engine module and no bank, and it claims nothing. The findings are
FLAGGED for the COMBAT lane, not handed to it. NOTHING PORTED. NO DAMAGE BEFORE THE
DIAL -- there is not one Bohemia damage number on that page. Bohemia's weapon types,
resistance table and positional damage term are all [PENDING Paolo] and all three are
COMBAT's to build.

=== WAITING ON HIM ===
1. Is EARN-YOUR-MULTIPLIER the shape? (a new weapon changes which multipliers you can
   reach, instead of a ladder where a new gun prints a bigger number)
2. The three bleed rules (sharp-or-shot-never-blunt / only-what-got-past-your-clothes /
   most-hits-don't).
3. The camp dial playtest, and the ten open camp clauses.
4. The action clock's denomination and ceiling number.

*** MAIN IS RED ON TWO GATES AND NEITHER IS COMBAT'S (flagged 7/31) ***
Proved by running both against a clean origin/main WORKTREE with none of my
commits in it -- byte-identical failures, so this is not "it works on my branch":
  RIG CHECK      161 passed / 1 failed
                 > bohemia_headshot_ragdoll_exemption_patch.py: claimed joint
                   waC is really used
                 (commit b440d1b's own tool, failing that lane's own new gate)
  BODY VARIATION 20 passed / 1 failed
                 > the frame cache hashes the dials (a slider drag can never
                   draw a stale frame)
Neither file is one this lane touches; my commits touch the combat gate, the
combat patch tool, the alpha's COMBAT_B64, the handoff, the tile board and
TF-CMB-003. Combat gate 538/0 and the alpha-loads gate 20/0 both green.
ANIM/CHARACTER LANES: these are yours and they are red on main right now.

COMBAT (04) 7/31 - THE CARS. And the reason he had to shout for them.

*** PAOLO: "I DIDNT SEE ANY CARS BRO WTF IS WRONG WITH YOU!" ***
He was right and this one is entirely on me. On 7/29 he said "we have hella cars
on file that are aproved. and when u slide a car in it should be 2 tiles by 3
tiles so yeah." THAT IS A RULING WITH A SIZE IN IT. I deferred it once for turn
budget, deferred it again, and then ASKED HIM A QUESTION ABOUT IT instead of
building it. The doctrine is explicit: anything he says that is not go/status is
a RULING TO RECORD, NEVER A DISCUSSION TO HAVE. I turned his ruling into a
discussion. Do not do this.

*** v103 THE CARS, AND THE SHOPPING CHECK CAME BACK A CLEAN HIT ***
banks/BOHEMIA_STREET_PROP_POOLS_7_18_26.txt pool `car_wreck`, 20 items,
provenance "HD_TILE_REPO part2 / 10. Abandoned cars (top-down, the V11 bake
family)". RENDERED ALL 20 AND LOOKED AT THEM before writing a line: real top-down
abandoned cars, sedans + a pickup + a cop car, every one sun-bleached and
rust-blotched and chalky -- exactly the Mojave failure mode TF-CMB-003 spent a
page describing (they BAKE, they do not rot). *** NOTHING COOKED. TF-CMB-003 IS
NOW CLOSED BY REUSE and board row 52 with it. ***
HIS SIZE RULING IS THE FOOTPRINT: 2 tiles by 3, as CAR_W/CAR_L constants. The art
is ~44x96 (1 x 2.2 tiles), so it is fitted into the 2x3 box BY HEIGHT and centred
-- undistorted rather than fattened to fill it. A real car does not fill its
stall edge to edge either.

*** THE ENGINEERING: I HAD THE PLAN WRONG LAST TURN AND THE RIGHT ONE IS FREE ***
I wrote that this needed rectangle maths in about five cover functions because
pillars are circles. Wrong.
*** A CAR IS SIX PILLAR CELLS THAT SHARE AN ID, WITH ONE SPRITE DRAWN OVER
THEM. *** Every cover function, the vault rule, the dash-path block, the AI
cover-seek and the occupancy check ALREADY understand a cell. So a car gets for
free: rectangle blocking (six cells IS a rectangle), and cover along its LENGTH
(a line crossing it meets several cells) which is the thing a car has and a block
does not. And the asymmetry rides the tall/low flag that already existed:
  ENGINE + CABIN cells TALL -> hidden to the chest, cannot vault
  BOOT cells         LOW   -> hidden to the waist, CAN vault
*** ONE OBJECT WITH TWO COVER VALUES, which no block can do, and it needed no new
geometry, no rectangle intersection code, nothing for a later patch to get subtly
wrong. ***
MEASURED LIVE over 40 rolls: 40/40 arenas have cars, 1-3 each, both arena kinds,
6 cells per car, footprint exactly "2 x 3", 4 tall cells + 2 low.
PLACEMENT (MAP LAW: he placed the canon, the dice place the instance): street =
parked along the roadway squared to the kerb; warehouse = at the staging end
where a vehicle could have driven in. Never on the player, never overlapping, and
scatterCars runs BEFORE the deck so the existing slab filter evicts a car parked
under a storey.
TOOL: tools/bohemia_combat_cars_patch.py | GATE section 37 | COMBAT GATE 530 -> 538

STAMP NOTE (second time in two turns): I set 7/30c while main was already on
7/31k -- the date had rolled in another lane and I went backwards again. Landed
on 7/31m (l reads as a 1 on a phone). READ MAIN'S STAMP BEFORE SETTING YOURS.

WORLD (9lfjtf): 7/31 — THE SCHOOL IS APPROVED, THE VALLEY GOT ITS EDGES, AND THE ECONOMY
NOW HAS A PURSE. Paolo: "WE HAVE 11 months of forward motion work we need to complete. Do
what you have to do next and know what comes after."

=== WHAT I DID NEXT, AND WHY THAT ===
records/BOHEMIA_THE_BIG_MISSING_7_29_26.md ranks the organs the game does not have. #1 is
THE GAME DAY (wake -> quest -> travel -> resolve -> GET PAID -> spend -> sleep) and it is
blocked on #3, THE ECONOMY, which that doc assigns to WORLD. So the highest-leverage thing
this lane could build is the one that unblocks another lane's #1. That is what I built.

engine/bohemia_purse.js — the PLAYER's three currencies and the ledger that proves them.
What already existed and was NOT rebuilt: bohemia_economy.js is a SETTLEMENT scarcity sim
(stock, decay, hyperbolic price), bohemia_loop.js already has the ruled clout/follower
math, and world_resolve already advances the settlement a day per spent moment. The hole
between them was the PLAYER: no purse, nothing credits, nothing debits, nothing spendable.

THE DESIGN, and the one decision worth inheriting: BALANCES ARE A SUM OF THE LEDGER, NEVER
A FIELD. There is no setter. Every movement declares its KIND (source / drain / convert /
transfer — the faucet-and-drain vocabulary from Daniel Cook's value-chain method) and
carries a REASON and a REF. That distinction is not decoration: the literature is
unanimous that economies die of faucet pressure, and that a SOFT sink (value moved to
another holder) does not fight inflation while a HARD sink (value destroyed) does. A bare
counter cannot tell them apart. Purse.flow() can, on day one, instead of being
reconstructed from a save file at month nine. Balances can never go negative; a refused
debit writes nothing; convert is ATOMIC so currency is never burned silently.

THE TABLES SHIP EMPTY AND THE GATE KEEPS THEM THAT WAY. PAYOUT, PRICES and PRODUCTION are
pure canon. Empty table -> NO_RULING, never zero, because silence is honest and zero is a
number nobody ruled. gates/purse_gate.js (26 claims) fails if any of the three gains a
row. Negative-tested: adding one PAYOUT row turns it red on two claims. The realistic
failure here is not malice, it is a future session adding "a sensible default so the loop
can be tested" and that placeholder becoming canon by shipping.

=== A CONTRADICTION I FOUND AND FIXED, worth knowing about ===
THE BIG MISSING said "Three currencies LOCKED (medicine / electricity / resources)".
MEDICINE IS NOT ONE OF THEM. The law
(laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md, Paolo 7/26, LOCKED, with his
own words in it) says RESOURCES / ELECTRICITY / CLOUT. Corrected in place. It was
load-bearing: it would have sent whoever built the economy after a currency that does not
exist, and clout — which DOES have ruled math already (CLOUT_WEIGHTS, 7/21) — would have
been left out of the purse entirely.

=== WHAT COMES AFTER, in order, so the next session does not have to re-derive it ===
1. **PAOLO'S NUMBERS.** The pipe is finished and it carries nothing. ONE yap session
   filling PAYOUT (what a quest outcome pays in the three currencies) closes the game-day
   loop, because the RUN lane's #1 is waiting on exactly this. This is now the single
   highest-value thing he can give the project, and it is a conversation, not a build.
   PRICES and PRODUCTION can follow later; PAYOUT alone unblocks the day.
2. **RUN LANE, ONE WIRE.** Purse.payQuest(purse, ev, day) already takes the loop's outcome
   event shape verbatim ({questId, outcome, tags}). bohemia_loop.js is your file, not mine,
   so I did not edit it — one call in the outcome sink and quests pay the moment (1) lands.
3. **THE FACTION GAME** (BIG MISSING #4, also OWNER: WORLD). Same shape as this: a standing
   ledger + a territory model, mechanism shipped empty and gated, because who does what to
   whom is [HIS DESIGN]. LIGHT=TERRITORY is a render law still waiting for a territory
   SYSTEM to mean anything. This is the next build in this lane and it does not need him
   to start.
4. Then the WORLD half of #6 (who exists in the valley — procedural below the named level).

DELIBERATELY NOT DONE: PRODUCTION is not wired into the resolver. Buildings producing per
day is the CITY-BUILDER half, which BIG MISSING #2 calls the single largest undesigned
system in the game and marks [HIS DESIGN]. Wiring it would be me designing his half. The
API is there; the pipe stays unconnected until he designs the loop.

=== ALSO SHIPPED THIS SESSION ===
- THE SCHOOL IS APPROVED: "Thumbs up i approve its like 89% lets move on"
  (records/BOHEMIA_SCHOOL_VERDICT_7_31_26.txt). Tennis courts killed by his 7/30 ruling,
  the auto shop took the ground, every building got a roof and a door.
- THE EAVE PASS: every building mass in all 46 districts now gets a bright edge where its
  roof meets the sky. It is a RENDER rule (K.buildingEdges + K.lighten, drawn by
  bohemia_valleymap.js and by the judge tool from the same answer), NOT baked tiles —
  baking it converts 9-60% of every building's tiles, which shrinks every FOOTPRINT, and
  INTERIOR-MATCHES-EXTERIOR says an interior is always exactly its footprint. The batch
  that looked like the job would have silently shrunk every interior in the valley.
  gates/legibility_gate.js, 11 claims, negative-tested.
- THREE GATES EARLIER IN THE DAY: TOOLS RUN (every tool actually parses — it found a
  second broken tool on main on its first run), SQUINT, HUE.

STANDING FOR THIS LANE: ACT ONE ONLY. Every district cell is its own landmark. Do not cook
art here (ART cooks from forms only). Resolver AND purse tables stay empty until he rules
numbers. Never auto-generate strip/resort/casino/luxor/sphere/strat/highroller/sign.

CHARACTER (0lurbs): 7/31 LATEST — CLIPS ARE A-Z NOW, THE COUGH HAND REACHES THE
MOUTH, AND HEADSHOT IS STILL OPEN. Main at db24121.

=== HIS STANDING ORDER, 7/30, OBEY IT EVERYWHERE ===
"I need you from now on in the ui to order them alphabetically i cant find what u
need me to find man." ANY list he has to SCAN is alphabetical, forever. Done: the
ANIMATION clip buttons (102, opens at 'air-guitar') and the CANON CLOSET inside
each category (221 garments). NOT sorted, on purpose: FACING and KNOCK are a
COMPASS (S SE E NE N NW W SW) and alphabetising them destroys the rotation; the
category headings read top-to-bottom like a body. The DATA never reorders --
CLIPS keeps authoring order because export/ANIMBEATS key off it, only the VIEW
sorts via a copy. Tool: tools/bohemia_ui_alphabetical_patch.py.
WHY IT MATTERS MORE THAN IT SOUNDS: the whole verdict loop depends on him FINDING
what you asked him to judge. 102 buttons in authoring order = he cannot, and
STALE UNJUDGED IS DEAD.

=== THE OTHER STANDING ORDER, 7/30 ===
"we gotta COOK ... 11 months of motion not bitching and complaining." He was
right that the lane was doing process work instead of shipping. Cook first,
report second, and never lead a reply with green gates.

=== SHIPPED THIS SESSION ===
- THE STATUES MOVE: 9 clips raised off sub-pixel amplitude. pray and winded
  rendered ZERO changed pixels (0.2px and 0.6px on a 56px sprite). Measured over
  8 facings: winded 954->3824, scratch-back 666->3538, cower 1404->3566,
  cough 2251->4301, pray 206->767. Gate: MOTION VISIBLE.
- THE COUGH HAND: he circled NE/E/SW, "the hand layer is fucked up". The hand
  landed at y18-20 while the face ends at y16, so it sat on the chest as a bare
  skin patch with its forearm buried in the torso. Fixed in the POSE (IK lift
  4->8), NOT with a layer rule -- he retired dynamic hand depth TWICE (7/2, 7/26).
  Chest bare-skin 45 -> 12 px; idle and walk are 0.
- ALPHA LOADS gate: the alpha must open in a browser with zero page errors and
  all three big blobs present AND full size. Built after main shipped a DEAD
  alpha for ~12 min (a merge ate RIG_B64 + COMBAT_B64 + BAKED).
- RIG CHECK gate: 22 rig-touching tools now cite the joints/parts they built on,
  re-derived from source; no second anatomy can exist beside BAKED.
- Whole-pixel canvas scaling (he could not see it -- recorded as a lesson, see
  BACKLOG 1b: a MEASURED defect is not automatically a FELT one).

=== OPEN, AND HE IS WAITING ON IT ===
1. HEADSHOT + HEADSHOT-2 ARE BROKEN (his words) AND I COULD NOT FIX THEM
   HONESTLY. What I measured: hsPose keeps ONE global ragdoll and restarts it on
   every direction change, and the ANIMATION tab renders all 8 facings at once --
       hsReset calls, 8-up grid (24 renders): 8    one direction (24 renders): 0
   I built the per-direction state swap for it. It moved head-drop travel from
   12px to 13px over 1.2s, and the body demonstrably FALLS in both builds, so
   that is NOT the visible defect. REVERTED rather than shipped as a fix that
   fixes nothing. The reset thrash is real and worth fixing eventually; the thing
   he is actually looking at is still unexplained.
   ASKED HIM: does it not fall at all, or does it fall wrong? Wait for that
   answer before touching the ragdoll -- do not guess a third time.
   NOTE: 'ragdoll' and 'death' are GRAVEYARDED (never re-add). headshot and
   headshot-2 are NOT -- they are live clips, so fixing them is legal.
2. WHISTLE (34) and SEARCH (24) measure the same chest bare-skin pattern cough
   had. DELIBERATELY NOT TOUCHED (back-limb law wrong-turn #5: "a fix that is
   *good* is not thereby *general*"). A hand at the mouth may be correct for
   whistling. Surfaced to him for a ruling.
3. [PENDING Paolo] far-hand depth on E/W (far 153.2 vs near 153.8, no depth cue).
4. [PENDING Paolo] unbuilt slider ideas: leg length vs torso, frame/bulk,
   posture, neck length.
   BORDER TONE IS CLOSED: it stays black, he answered it the first time and got
   annoyed being asked again. Do not re-ask.

=== HOW THIS LANE SHIPS NOW (learned the hard way today) ===
NEVER hand-resolve an alpha conflict. Take main's alpha WHOLE
(git checkout --ours), re-run the idempotent patch tools, re-stamp, run
ALPHA LOADS, push. Every tool in this lane is idempotent and refuses to write
unless its edit resolves exactly once. A pre-rebase green does NOT transfer: if
main moved, the tree you are pushing is one no gate has ever seen.
DEPLOY VERIFY CAVEAT: from this environment github.io is proxy-blocked AND the
GitHub actions listing comes back CACHED (asked per_page=3, got 30, byte-identical
every call). db24121 is git-verified as the tip of main with the right stamp, but
the Pages run could not be confirmed from here. Do not claim "live" off that API.

--------------------------------------------------------------------------------

LAB (e2r7sv): 7/31 (b) LATEST — HE APPROVED THE ACTION CLOCK'S SHAPE, SO IT IS LAW
AND GATED; AND THE BLEED TRIGGER IS ANSWERED OFF REAL CODE.

=== THE RULING ===
Paolo 7/31 on the CDDA page: "And sure the time cost shit sounds good." Under NOTES
ARE RULINGS that IS the verdict, so it is canon the same turn:
laws/BOHEMIA_ADDENDUM_THE_ACTION_COST_SHAPE_7_31_26.md. Six clauses: an action's cost
is FIXED; denominated FINER than the clock; CONDITION is the divisor, never a second
cost; the divisor has a HARD FLOOR so the conversion has a HARD CEILING (a bad day can
never become an infinite one); THRESHOLDS NOT SLOPES, under the line is free; and THE
TWO CLOCKS STAY TWO (camp law clause 17), written down as a CHOICE so no future lane
"fixes" it into one.
STILL HIS, and the gate proves nobody filled them in: the DENOMINATION (the BEAT is
the obvious candidate since everything already quantises to 120 BPM — NO LANE PICKS
IT), the CEILING NUMBER (Cataclysm's is 4x), and the ACTION LIST AND COSTS.

=== THE GATE, AND THE BUG IT FOUND IN ITSELF ===
gates/action_cost_shape_gate.js, registered as ACTION COST SHAPE, 31 checks.
Part A holds the law (clauses matched by CLAIM not by number, so a renumbering cannot
silently drop one). Part B is the one that earns its keep: THIS LAW READS LIKE
PERMISSION TO GO BUILD A COST TABLE AND IT IS NOT, so it sweeps engine/ for a table
STRUCTURE — never a mention, because tripping on a mention is now on this repo's
record three times (lab_gate A10, A12, A24). Part C drives the lab page LIVE and makes
every clause prove itself in a real browser, so the law is evidence and not opinion.
Six mutations caught. THE SIXTH FOUND A REAL BUG IN MY OWN GATE: B3 hunts a LINK from
a shipped surface, shipped surfaces are HTML, and my walker only collected .js — so it
passed a planted link. Fixed, and the reason is written into the source. A gate that
goes green first try has not been tested.

=== THE BLEED ANSWER (his direct question) ===
records/BOHEMIA_BLEED_TRIGGER_ANSWER_7_31_26.md
BLEEDING IS A PROPERTY OF THE WEAPON THAT HIT YOU, NOT OF HOW MUCH HEALTH YOU LOST.
Off real code — monster.cpp:2445-2447: `if( du.type == damage_bullet ||
du.type->edged ) make_bleed( source, 1_minutes * rng( 0, adjusted_damage ) );`
Four things fall out. The trigger is the damage TYPE (bullet, or cut/stab flagged
`edged`; bash pointedly is NOT, so blunt force never bleeds). Severity is what got
PAST ARMOUR (creature.cpp:1552) — which makes a jacket a medical decision in a game
whose progression IS clothing. The roll STARTS AT ZERO, so most grazes cost nothing.
And it is per body part (`main_parts_only`). Their ladder: 40 intensities, five bands,
Minor to Heavy Arterial.
Grounded in real trauma medicine: blunt trauma kills by breaking things inside you,
penetrating trauma kills by opening vessels. That is why "was it sharp" is the first
question and why a tourniquet is useless on a crush injury.
MY RECOMMENDATION, three rules, shape not numbers: SHARP OR SHOT NEVER BLUNT / ONLY
WHAT GOT PAST YOUR CLOTHES / MOST HITS DON'T. The third one is also the answer to his
older 7/27 question — you do NOT have to prevent blood loss after every fight — and it
is what keeps his own camp clause 6 true, that a player who ignores the camp can still
play.
HONEST LIMIT: monster.cpp:2445 is the MONSTER side of the hit, the path I read end to
end. The player side routes through their JSON on-hit effects, which I did not trace.

=== WHERE THE LAB LANE IS ===
NOTHING BUILT, NO DAMAGE BEFORE THE DIAL. Waiting on him for: the bleed recommendation
(yes/no), the denomination, the ceiling number, the action list, the camp dial
playtest, and the ten open camp clauses. LOOT IS A CLOSED SUBJECT (two kills).

LAB (e2r7sv): 7/31 LATEST — WHAT AN ACTION COSTS, ANSWERED OFF REAL C++, AND A GATE
BUG THAT WAS PUNISHING HONEST NOTES.

=== WHY THIS EXISTED TO DO ===
Paolo's 7/28 correction is clause 17 of laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md:
"time will pass just by taking actions in this game and you really need to understand
that sort of clock." He was right, and the moment he ruled it the repo had a hole —
NOTHING COULD SAY WHAT ONE ACTION COSTS. Clause 4 of the time law reserves the cost
TABLE to him ("no lane invents an action-cost table"), so writing costs was illegal.
The legal move was to go get the best engineered answer that exists and hand him the
SHAPE. Cataclysm: DDA was ranked #1 of nine for exactly this in
records/lab/BOHEMIA_LAB_RESEARCH_CANDIDATES_7_26_26.md, filed BEFORE it was needed.

=== SHIPPED, FULL SUITE GREEN ===
PAGE (NOT IN A TAB — a lab reference surface, and by lab_gate clause 3 it may NEVER
be linked from the alpha): slices/lab/BOHEMIA_LAB_CDDA_ACTION_COST_7_31_26.html
Five mechanics playable end to end: action cost / condition / travel / errands /
sleep debt. A real EMULATION, not a model — the game is open source, so all 34
constants were read off real lines of its C++ this session.

FINDING 1, better than a table of minutes: AN ACTION'S COST IS FIXED, IN "MOVES"
(calendar.h:289 — 100 moves = 1 turn = 1 second). YOUR CONDITION CONVERTS MOVES INTO
TIME. AND IT CAN NEVER EXCEED 4x, BECAUSE SPEED HAS A FLOOR (character.cpp:7652,
their comment verbatim: "Speed cannot be less than 25% of base speed"). The table
stays one stable number per action; the FELT cost moves with how wrecked you are; a
bad day can never become an infinite one. The floor is the part to steal first.

FINDING 2, straight onto our tile clock: A STEP IS AN ACTION, PRICED IN THE SAME
CURRENCY (character.cpp:6022 run_cost(100,false); :6103 caps bonuses so a step can
never cost LESS than 100). Their walking and doing are ONE clock. Ours are TWO on
purpose (clause 17: the buff burns on steps, the day burns on every action). That
divergence is now CHOSEN, not unexamined. Their WORST step is 4.00 s; our AVERAGE
step is 3.52 s (clause 16) — coincidence, but a useful one to feel.

SMALLER PATTERNS worth having: THRESHOLDS NOT SLOPES (weight free under your cap,
:7613; thirst free to 40, :7620) so a penalty arrives as a decision, not a drip; a
skill that halves BAD ground only (Parkour, :6096); TRAVEL = BASE + RATE (20 min +
dist x 10, mission_companion.cpp:1358); an ERRAND IS A DECLARED BLOCK paid rate x
hours (1/4/10/20 h at 3/4/5); and SLEEP DEBT'S FIRST RUNG IS TWO WHOLE DAYS
(character.h:247) — one rough night is free, which agrees with his own clause 6 that
ignoring the camp must stay playable.

RECORDS: records/lab/BOHEMIA_LAB_CDDA_TEARDOWN_7_31_26.txt (all 34 constants with a
file:line printed from the fetched source, plus every omission named by line so the
gap is countable) and records/lab/BOHEMIA_LAB_CDDA_PATTERN_NOTE_7_31_26.md.

=== TWO THINGS I GOT WRONG, BOTH RECORDED IN PLACE ===
1. FOUR OF MY FIRST-DRAFT CITATIONS WERE WRONG by a few lines, written from memory
   before the files were fetched (MOVES_PER_TURN 288->289; BASE_SPEED pointed at a
   call site instead of creature.cpp:189 where the value is set; SHORT_MIN 7545->7547;
   LONG_MIN a bare "1_hours"->character.cpp:2378). All corrected against the real
   files and OWNED at the top of the teardown. A number you did not print from the
   file is a guess wearing a citation — the 7/18 verify-on-the-real-surface law again.
2. A REAL GATE BUG, THIRD OF ITS KIND: lab_gate's A24 (the no-port-claims check) was
   failing the DENIAL that every honest note is required to write ("Nothing here is
   wired into the engine"). Same class as A10 (cited engine paths) and A12 (the toast
   "no recipe, no item"). Fixed properly: collapse whitespace, then scope the negation
   to the SENTENCE. THE PART WORTH READING: my first two fixes both passed a PLANTED
   REAL CLAIM ("I wired it into the engine this afternoon"), because per-line failed on
   hard-wrapped prose and a flat 90-char window caught a "never" from the sentence
   before. Only mutating in BOTH directions found that. A gate tested one way is half
   tested.

=== GATE ===
gates/lab_gate.js: new CDDA row, 28 live checks (D0-D27), and it learned .cpp/.h
citations — its first C++ master. 332 checks, 0 fail. Six mutations caught: floor
removed, cost drifting with pain, travel divided by speed, early errand collect, first
sleep rung moved to one day, thirst turned into a slope. Screenshotted on the real
390x844 surface, top and bottom.

=== WHERE THE LAB LANE ACTUALLY IS ===
NOTHING PORTED. Under laws/BOHEMIA_ADDENDUM_LAB_PORTS_ON_HIS_WORD_7_26_26.md a lab
finding moves into the game only when he says so.
BLOCKED ON PAOLO, and deliberately not producing around it (STOP PRODUCING law):
  1. THE ONE QUESTION FOR THIS PAGE: is the SHAPE right — a fixed cost in a fine
     currency, your condition as the divisor, and a hard cap on how bad the divisor
     can get? If yes, the numbers are a short conversation. If no, the table was
     never the problem.
  2. HIS PLAYTEST OF slices/lab/BOHEMIA_LAB_MOBILE_CAMP_DIAL_7_27_26.html. 31 dials,
     each with its law clause. Everything downstream of the camp waits on the feel.
  3. THE MOBILE-CAMP PENDINGS, none of which any lane may invent: (a) the pool's
     name, (c) supply costs, (d) whether max HP moves (MAX_HP_MOVES defaults OFF
     because "idk" is not a ruling), (e) exact stamina numbers, (f) carry limit,
     (g) the camp item list, (i) per-button time costs, (k) shelters per act,
     (l) meal buff size, (m) blood-loss policy (options written and a recommendation
     made in records/BOHEMIA_BLOOD_LOSS_OPTIONS_7_27_26.md — option 2, ONLY SERIOUS).
  4. THE ACTION COST TABLE itself, clause 4. This page exists to make that a feel
     question instead of a spreadsheet question.
HELD, not formed (tile forms): H5 the supply pool's searched-container state (blocked
on clause (a), and loot is a CLOSED lab subject after two kills); H6 friendly shelter
looks (blocked on clause (k), and it is WORLD's district content — LAB flags, does
not claim).
LOOT IS CLOSED. Two loot emulations died in two days (Zomboid house, A Dark Room
scavenge). No third one, by the STOP PRODUCING law. The graveyard gate keeps both
pages from coming back.

MAIN IS BADLY RED AND IT IS NOT THE SOUND LANE — SOMEBODY OWNS THIS.
Seven gates fail on main. FIVE of them are a live regression in the PEOPLE
system and I proved every one on a detached worktree at clean origin/main
(c31a4bd) with ZERO sound work in the tree:
  LIFE        21 pass / 3 fail  "0 agents simmed", "most homes are abandoned
              shells (0 of 19 lived-in)"
  POPULATION  5 pass / 3 fail   "die-off dial flows through the census
              (full 33 >= default 0 > empty 0)", offline/online disagreement
  MEMORY      7 pass / 2 fail   "0 sightings"
  DEVIATION   fails
  DRESS       42 pass / 1 fail
Plus the two long-standing CHARACTER ones (PARTS PAINTED, BODY VARIATION).
The shape of it: the offline census plane is producing ZERO people. The RUN's
own SIM still makes agents (measured 6-7 outdoors this session), so it is the
world-model/census path that broke, not the run. Whoever owns LIFE/POPULATION
should take this first -- it is bigger than anything in my lane.

MUSIC (xk7pjp): 8/2 (c) LATEST — BATCH 22, THREE SONGS ANSWERING THE THREE DEAD
SLOTS. And a theory I tested and threw away, which is the part worth reading.

  A BELL FOR NOBODYS SHIFT  41 [0,2,5,7,10]  half   [0,6]       lead SALTPSALM
  THE MARKER ON THE DOOR    48 [0,2,4,7,9]   normal [0,4,8,11]  lead BROKENROSARY
  COUNTING WHAT IS LEFT     55 [0,3,7,10]    drive  [0,3,8,12]  lead TOLLHOUSE

THE THEORY THAT DIED. After batch 21 I inferred the casualties failed because
their leads could not hold a line, and refined it to a mechanism: the melody
engine picks scale degrees BY HASH, so a scale with adjacent semitones should
throw random rubs and read as texture. Measured across all 131 scaled songs:
    NOBODY CASHES OUT        LIVED  2 semitone-adjacent pairs
    THE HOUSE ALWAYS REMEMBERS DIED 2   <- identical count to a survivor
    canon corpus mean 1.19, only 28% at zero
A SURVIVOR AND A CASUALTY SHARE THE COUNT, so the rule is dead. Recorded because
the tempting move was to build the batch on a tidy rule and present it as
insight. DO NOT REBUILD ON IT.

WHAT BATCH 22 IS ACTUALLY BUILT ON: the laws, plus the ONE real signal in the
data -- both songs he kept have leads that SUSTAIN a clear pitch for the length
of a note. All three new leads sustain. Not because a theory says so, because
the two things he actually kept do.

THREE NEWBORN TOPOLOGIES (none among the 607, none of batch 21's four):
  brokenrosary  RHYTHM INSIDE ONE NOTE -- the same pitch re-struck within its
                own duration, gaps stretching, each strike quieter and duller.
                Everything else in the rack is one attack per note.
  saltpsalm     AN INTERVAL THAT RESOLVES WHILE IT SOUNDS -- two voices open a
                fifth apart and glide together into unison across the note.
                subharmglide glides a pitch; this glides the DISTANCE to zero.
  tollhouse     RING MOD AT A FIXED HZ OFFSET, not a ratio, so low notes beat
                slowly and high notes go clangorous. One rule, a different
                instrument at each end of the keyboard.

MEASURED AS AUDIO in the real alpha: brokenrosary 0.202, saltpsalm 0.309,
tollhouse 0.337 peak, all three fully silent well before 4s (screech law on the
waveform). Zero page errors.

APPEND-ONLY PROVEN by diffing every entry: 131 -> 134, three added, none
removed, ZERO existing songs edited. Song lock re-locked with the reason.

BUILD STAMP: 8/2an - THREE MORE SONGS TO JUDGE (MUSIC TAB).
NEXT: his thumbs on these three.

MUSIC (xk7pjp): 8/2 (b) LATEST — BATCH 21 JUDGED, 2 OF 4 LIVE, AND THE LESSON IS
THE VALUABLE PART.

  NOBODY CASHES OUT            CANON  lead lastrites  (undertone stack)
  TITHE FOR THE EMPTY PEWS     CANON  lead tithebell  (differential decay)
  THE HOUSE ALWAYS REMEMBERS   DOWN   lead ossuary LIVES
  THE LAST LIGHT ON THE STRIP  DOWN   lead dyingfilament LIVES
  WHAT THE PIT BOSS BURIED     DOWN   (batch 19, judged same sitting)

THE LESSON, and it is mine to carry: THE TWO MOST STRUCTURALLY NOVEL LEADS IN
THE BATCH ARE THE TWO THAT DIED. Both survivors hold a pitch you can follow and
resolve. Both casualties are built on instability -- ossuary has NO OSCILLATOR
and therefore no steady pitch to sing, and dyingfilament's whole idea is a
flutter slowing to a stop, which is motion rather than melody. The canon's
oldest kill reason is that the melody must LEAD under the dread and pure texture
reads as unfinished (7/18 graveyard).
  SO: NOVELTY OF MECHANISM IS NOT A SUBSTITUTE FOR A SINGABLE LINE. I picked
  four topologies first and asked whether they could carry a tune second. Next
  cook: BUILD THE LINE FIRST, then find the voice that can hold it. The variety
  law asks for new topologies, not for topologies that cannot sing.
  (Labelled INFERENCE. He gave no kill reasons and none were invented for him.)

SONG-DEAD-NOT-VOICES HELD: ossuary and dyingfilament stay in the rack, legal for
new fashions. Neither has had a second one, and both are genuinely useful as
TEXTURE or accent voices even though they failed as leads.

BAKED THIS TURN, verified on a FRESH DEVICE with zero localStorage: 3 downs at 0
in CANON_DEFAULTS (excluded from every pool), 2 canon at 2, his 38 CATEGORY
assignments into CAT_DEFAULTS.
  AND A BUG FIXED: his HERO BEAT ruling had NOWHERE TO LIVE BUT LOCALSTORAGE.
  MUS.load() read d.hero and there was no baked table, unlike CANON_DEFAULTS and
  CAT_DEFAULTS which exist for exactly that reason. A cleared cache or a second
  device threw the ruling away silently. HERO_DEFAULTS now exists and the save
  only overrides it. Same class as the SFX judge-surface bug on 8/1: HIS
  VERDICTS ARE A REPO FILE, NOT A COOKIE. Confirmed: CAMPFIRE CONFESSION#1 still
  reads beat 4 on a device that has never saved anything.

SONG LOCK re-locked ON PURPOSE twice today, both documented in the lock note:
adding songs, then baking verdicts. Song BODIES untouched both times -- proven
by diffing every entry (130 -> 134, four added, none removed, zero edited).

BUILD STAMP: 8/2ak - YOUR VERDICTS ARE BAKED (MUSIC TAB).
NEXT: three dead slots want fresh cooks, LINE FIRST. Not started -- he did not
ask for another batch and STOP PRODUCING says do not answer a verdict with
unrequested volume.

MUSIC (xk7pjp): 8/2 — BATCH 21. FOUR SONGS, FOUR NEWBORN TOPOLOGIES.

He fired the cook spell verbatim. Horror FFX, melodic under dread, new voices,
no shared scale/feel/kick, screech law, graveyard final, embedded repo updated,
gate green, ship same turn.

  THE HOUSE ALWAYS REMEMBERS   45 [0,1,5,6,10]   half   [0,10]      lead OSSUARY
  NOBODY CASHES OUT            50 [0,2,3,6,7,9]  normal [0,6,8,14]  lead LASTRITES
  TITHE FOR THE EMPTY PEWS     38 [0,3,5,8,11]   half   [0,4,8,12]  lead TITHEBELL
  THE LAST LIGHT ON THE STRIP  53 [0,1,3,7,8,11] drive  [0,7,11]    lead DYINGFILAMENT

THE RACK ALREADY HELD 607 VOICES, so a new NAME on an old skeleton would have
been worth nothing. Each of these four is a different MECHANISM:
  ossuary        NO OSCILLATOR. A noise burst through four parallel bandpasses
                 at the free-free bar ratios 1 : 2.76 : 5.40 : 8.93. The pitch
                 lives in the FILTERS; the source is air.
  lastrites      BUILT DOWNWARD. Undertone stack f, f/2, f/3, f/5 -- the
                 harmonic series inverted, each division on its own drift so
                 they beat against each other.
  tithebell      DIFFERENTIAL DECAY. Odd partials die 6x faster than even, so
                 the TIMBRE moves with no filter and no modulator: strikes
                 clangorous, arrives pure.
  dyingfilament  A TREMOLO WHOSE RATE IS ENVELOPED TO A STOP. Modulation-rate
                 envelope, not amplitude envelope. The light going out.

VERIFIED AS AUDIO, not as structure: each rendered offline in the real alpha --
ossuary 0.259, lastrites 0.293, tithebell 0.339, dyingfilament 0.166 peak, and
ALL FOUR fully silent well before 4s, which is the SCREECH LAW proved on the
waveform rather than by grepping for createDelay.
  OSSUARY NEEDED 24x MAKEUP. Four bandpasses at Q 16-37 threw away nearly all
  the energy: it first rendered at 0.0101 against 0.29-0.34 for its batch-mates.
  The filters ARE the instrument, so the fix is gain after them, never a wider Q.

THE BUG WORTH INHERITING — A STRAY COMMA IS A HOLE IN THE SONG LIST. My tool's
idempotent removal took the block but left the comma it had injected, so the
next re-run wrote `},\n,\n{` and JS turned that into an EMPTY SLOT. MLOOPS[130]
was `undefined` and everything that maps over songs died on `undefined.n`.
  IT WAS INVISIBLE THREE WAYS: the file reads fine by eye, a grep for ',,' never
  matches because a NEWLINE sits between them, and the song COUNT still looks
  right. Only asking the parsed array found it.
  gates/music_gate.js now EVALS the literal and fails on any hole (16 checks,
  proved by putting the comma back). Reading the text is what let it in.

BUILD STAMP: 8/2af - FOUR NEW SONGS, FOUR NEW VOICES (MUSIC TAB).
NEXT: his thumbs. NEW_VIBES is these four; downs go to the graveyard with a
post-mortem and stay dead.

SOUNDS (xk7pjp): 8/2 (d) LATEST — YOU CAN HEAR THE PEOPLE ON YOUR BLOCK.

HIS STEER: "I'm not too concerned right now about the volume of fucking steps,
bro. I just needed you to make sure you're coding that properly into any sort of
menu volume slider." The slider hook is done and correct; stop polishing
footstep levels and move.

THE HOLE THIS CLOSES: every sound in the game happened AT the player. The valley
has people walking around it and not one made a noise, so a full block read
exactly like an empty one.

RESEARCH: the horror/game-audio writing is blunt -- the player should hear
something BEFORE seeing it, and from the sound alone know roughly where it is
and how far. Distance: a point source follows the INVERSE law, amplitude ~1/r,
about -6 dB per doubling, and inverse is the recommended default. Linear rolloff
is for ambient zones and UI; used here it makes everything sound equally close
until it abruptly is not. Pan is the crude correct tool for top-down 2D.

BUILT: the run reports the NEAREST neighbour who moved within 7 tiles, at most
one every 260ms (a crowd is not a machine gun). The parent plays HIS OWN
approved footstep at that position: gain 1/(1+0.55r), pan from the x offset,
hard cutoff below 0.06 because a sound too quiet to place is noise, not
information. NO NEW SOUND WAS COOKED -- approval unlocks volume and this is
volume.
  IT ROUTES PAST THE PLAYER'S FOOTSTEP BUS ON PURPOSE. That bus is 0.12 because
  HIS OWN steps fire constantly; a neighbour's is rare and is INFORMATION.
  Stacking both made it 0.0095, which is a number, not a sound.
  MEASURED: neighbour at 3 tiles = 0.102 on the SFX bus, at 30 tiles = silence,
  kill = 0.598 for scale.
  IT TOUCHES NO OTHER LANE'S CODE: the run already tracks agent positions in
  updateFaces(), but reading its private state would couple this to their
  internals, so this keeps its own last-seen map.

GATE: SFX WIRED 246 checks, deterministic -- it stands ONE neighbour at a known
distance and moves him one tile, rather than hoping the sim walks somebody past.
  THE LESSON THAT COST ME A ROUND: my first distance check was "is the near peak
  bigger than the far peak". Footstep candidates vary ~10% between picks, so
  with attenuation DELETED ENTIRELY that check still passed 246/246. A
  comparison is not a measurement. It now demands the RATIO the inverse law
  predicts (<0.75) and the sabotage goes red at 85%.

BUILD STAMP: 8/2ad - YOU CAN HEAR THE PEOPLE NOW (RUN TAB).

SOUNDS (xk7pjp): 8/2 (c) LATEST — I WAS WRONG ABOUT THE BYPASS, AND THE REAL BUG
WAS WORSE. Read this before trusting any measurement taken on MUS.MAST.

CORRECTION FIRST: last turn I told him "footsteps bypass the volume knob, they
still measure 0.29 when muted." THAT WAS WRONG. Footsteps route through the SFX
master correctly and setSFXVolume(0) silences them to 0.000. What I had actually
measured was the CITY MUSIC starting when you walk -- MUS.MAST carries the song,
so anything metered there is polluted by it, and MUS.stop() tears the analyser
tap down so "stop the music first" does not save you either.
  THE FIX FOR THAT WHOLE CLASS: METER THE SFX BUS, NOT THE MASTER. Music never
  passes through window.__SFXBUS, so a reading there is effects-only and
  music-proof by construction. Every mix check in the gate now taps it.

THE REAL BUG IT UNCOVERED, AND IT WAS HIS RULING BEING DROPPED: another session
built "footsteps A LOT A LOT quieter" (8/1) as stepSfx() + STEP_BUS at 0.12,
hanging off a BOHEMIA_STEP message. THE RUN NEVER POSTS BOHEMIA_STEP. Measured
live: stepSfx called ZERO times across a full walk while playSFX handled every
single footstep. So that ruling was dead code for a day and footsteps were still
playing at full level, with two sessions each assuming it had shipped.
  APPLIED NOW on the path that actually runs: playSFX sends step_* through a
  0.12 sub-bus -> SFXBUS -> master. His vectors are untouched; the verdict is on
  the SOUND, never on how loud the game plays it.
  MEASURED: footstep 0.032 vs kill 0.598 on the SFX bus. 19x down, about -25 dB.
  And setSFXVolume(0) still silences it, so the knob reaches it.

GATE: SFX WIRED 238 checks. The new ones are PROVED to fail -- putting STEP_GAIN
back to 1.0 reproduces exactly the state that shipped yesterday and turns it red
("FOOTSTEPS ARE NOT A LOT A LOT QUIETER: step 0.2659 vs kill 0.5983, 44.4%").
That regression cannot happen quietly a third time.

DEAD CODE LEFT ALONE ON PURPOSE: the other lane's stepSfx()/STEP_BUS still
exists and still never fires. It is theirs, it is harmless, and ripping it out
mid-flight is how you break somebody else's next turn. Flagged, not touched.

LESSON WORTH THE WHOLE TURN: I reported a defect that did not exist because I
measured on a bus carrying something else, and the measurement error HID a real
defect sitting right next to it. When a number surprises you, check what else is
on the wire before you write it up as a finding.

BUILD STAMP: 8/2q - FOOTSTEPS ACTUALLY QUIET NOW (RUN TAB).

SOUNDS (xk7pjp): 8/2 (b) LATEST — ONE VOLUME KNOB, and one honest gap.

HIS RULING: "when we have a menu and it's gonna have Settings and then we can
change the volume of all sound effects or whatever so yeah just keep that in
mind." Also confirmed the doubled-footstep worry was nothing: "I just hear a
single one."

SHIPPED: every sound effect now routes through ONE node, SFXBUS -> MUS.MAST, and
the entire settings hook is window.setSFXVolume(0..1) / getSFXVolume(), persisted
in localStorage. When the menu exists it calls that and nothing else. It does NOT
re-mix anything: the ambience bus keeps its 0.4 and simply feeds the master
instead of bypassing it, so every level he judged sits exactly where it was.
MEASURED: kill at volume 1 peaks 0.479, at 0.5 peaks 0.239 (exactly half), at 0
peaks 0.000.

THE GAP, STATED PLAINLY BECAUSE IT IS NOT FIXED: FOOTSTEPS STILL BYPASS THE
MASTER. With SFX volume at 0, walking still measured 0.29. Another session built
STEP_BUS on 8/1 off his "A LOT A LOT quieter" ruling and it connects straight to
MUS.MAST. I patched that one line to prefer window.__SFXBUS and then made the
master eagerly on unlock so creation order could not lose the race, and it STILL
bypasses -- so my model of that code is wrong somewhere and I stopped rather than
keep guessing at another lane's system with no budget left.
  NEXT SESSION: find where footsteps actually reach the destination. Do not
  assume it is the STEP_BUS.connect line I patched; something else is carrying
  them. Then gate it: assert that with setSFXVolume(0) a WALK measures silence.
  That gate does not exist yet, which is why this shipped with the hole visible
  instead of hidden.

VERIFIED THIS TURN: SFX WIRED 230, SFX FACTORY 160, ALPHA LOADS 20 (zero page
errors), RUN 126. The FULL suite was NOT run on this final tree -- the session
ran out of room. Two reds (PARTS PAINTED, BODY VARIATION) were proven
pre-existing on clean origin/main earlier today and are the CHARACTER lane's.

BUILD STAMP: 8/2k - ONE VOLUME KNOB FOR ALL SFX (SETTINGS-READY).

SOUNDS (xk7pjp): 8/2 LATEST — THE VALLEY MAKES NOISE. 100/100 judged, 55 banked,
world tone WIRED. Nothing in this lane is waiting on him.

HIS FRAMING RULING, and it binds how this lane TALKS: "you don't need to think
too deeply philosophically about it. You know it's probably gonna be one of the
many ambient noises that's OK. I wish you kind of just frame it and explain it
like that." He is right and I had oversold the ambience as the thing that tells
you the time of day. IT IS BAD AT THAT -- a sound a minute apart is a poor clock
and the music already carries time of day. It is ONE OF THE AMBIENT NOISES. It
makes the valley feel occupied by nothing. Say what a thing is, say when it
fires, move on.

WIRED NOW: indoors -> air_inside; outdoors -> air_night before 06:00 or from
19:00, else air_day. Random 40-95s gap (MY default, taste only, one word changes
it). Own bus at 0.4 of judged level. ONLY while the RUN tab is open.

THE BUG WORTH INHERITING: "is the run on screen" took three tries.
  1. offsetParent is null under ANY position:fixed ancestor even when the
     element is plainly visible. Silenced the ambience everywhere.
  2. #p-run is display:none PERMANENTLY -- the RUN tab shows the p-city panel
     (PANEL = t.dataset.p==='run' ? 'city' : t.dataset.p). Measuring its box
     was measuring the wrong element.
  3. RIGHT ANSWER: ask the app its own question. The tab carrying class 'on'.
  AND: message recency is NOT a visibility test. A hidden iframe keeps its
  timers, so the run kept reporting from the MUSIC tab and ambience would have
  played over him judging sounds.

STILL UNWIRED, FOR LACK OF A MOMENT, NOT A SOUND: pickup (no loot event; LOOT IS
CLOSED by another lane), block (combat has no block mechanic), phone_buzz (no
feed moment). STILL SILENT ON PURPOSE, zero approved: door_open, door_shut, miss,
vital, clear.

NEXT FOR THIS LANE (nothing is blocked on him):
  1. The ambience gap is a guess. If he plays and it feels wrong, it is one
     number in tools/bohemia_sfx_wire_patch.py.
  2. A DOOR, only on his word. Evidence says NOT metal and NOT wood.
  3. miss/vital/clear died 5/5 once. The rule their deaths bought: combat is
     LOW, ash-or-stone, DRIVEN HARD, SHORT. Do not re-cook unasked.
  4. INDOORS COULD CHANGE HIS FOOTSTEPS instead of only adding a sound. I raised
     it, he did not rule, so it was NOT built. Ask before building.

BUILD STAMP: 8/2f - THE VALLEY MAKES NOISE NOW (RUN TAB).

SOUNDS (xk7pjp): 8/1 (c) LATEST — THE WORLD TONE. 15 candidates to judge, and
the valley stops being silent.

THE HOLE: every sound shipped so far is a thing HE does -- a step, a shot, a
save. Nothing told him where he was standing or what time it was. The valley made
no sound at all.

RESEARCH: records/BOHEMIA_RESEARCH_AMBIENCE_8_1_26.md, 8 sources. A game ambience
is FOUR layers (bed / spot / foley / threat) and the conventional bed is stereo
LOOPS. Two things killed that approach here:
  1. The literature's own warning: a uniform loop is what breaks immersion; real
     ambience carries randomised one-shots.
  2. THE SCREECH LAW. No delay, no convolver, nothing that can ring -- a
     conventional looping bed with a reverb send is not even available to us.
THE FINDING THAT DECIDED IT: "Silence is not a sound you can't add; it is a sound
you choose to remove. In horror, tension comes not from what you add but from
what you take away." That is ALREADY this engine's header doctrine, written
before the research existed.
  SO: the world tone is NOT a wall of wind. It is the SPOT layer with the bed
  left almost empty -- one rare event, minutes apart, silence doing the work.
  And that solves the engineering for free: a randomised one-shot is exactly
  what BOH_SFX already makes, so there is NO new synthesis, NO loop to
  recognise, and the SCREECH LAW is held by construction because there is no
  feedback path to audit.

  air_day     stone, high and thin   midday, too hot to be outside
  air_night   choir, low and wide    THIS ONE IS THE HORROR: a room far bigger
                                     than the one he is standing in
  air_inside  wood, close and dry    small, and you can HEAR that it is small
  choir is used exactly once, for the night. The contrast between air_night
  (huge) and air_inside (small) is the point: a door should change the size of
  the world.

COOKED TO JUDGE, NOT AT BED LEVEL. All three land ~0.20 peak, level with a UI
tap, because he has to hear a thing to thumb it. What level ambience sits at
UNDER the game is a wiring decision AFTER his verdict. The ladder now asserts
shot and kill dwarf all three, so the room can never come up over the game.

IT PLUGS INTO STATE THAT ALREADY EXISTS: the run has a real day clock,
dayFrac(turn) over DAY_TURNS with the turn counter in the save, already driving
NPC schedules (Mojave midday shelter, dusk sitting). Inside/outside is
mode==='ext', already used by the footstep classifier. The old handoff said
ambience was blocked on RUN 0d's daycycle -- IT IS NOT BLOCKED ANY MORE, the
daycycle shipped.

GATES: SFX RENDER 874 checks over 100 candidates. One candidate (air_night.0)
rendered at 0.118, under the judgeable floor, and the band check caught it before
he ever saw it -- the family was lifted so its whole jitter range stays hearable.

NEXT: his thumbs on the 15. Then wiring, which is where the real design question
is and it is HIS: how often does the valley speak? Minutes apart is the research
answer, but the exact rhythm of emptiness is a taste ruling, not a number I pick.

BUILD STAMP: 8/1z - THE WORLD TONE: 15 TO JUDGE (MUSIC TAB).

SOUNDS (xk7pjp): 8/1 (b) LATEST — I THREW HIS THUMBS AWAY AND ASKED HIM TO JUDGE
AGAIN. Read this before touching any judge surface in this repo.

HIS WORDS: "I already made verdicts in a previous chat... I can't be judging shit
and then you pretend that I didn't so yeah you gotta fix that and then everything
that I approve like it should be collapsible you know like I shouldn't be having
a scroll for five fucking minutes every time for the music whether it's a song or
a sound effect"

THE BUG: the SFX judge surface stored his verdicts ONLY in the phone's
localStorage. Nothing in the repo. So a new deploy, a cleared cache or a second
device wiped 60 judged sounds, and when the batch grew 12 -> 17 moments his
export came back reading "--" (never judged) for everything he had already
decided. He had to look at his own finished work being asked for again.

THE FIX, AND IT IS THE GENERAL LESSON: HIS VERDICTS ARE A REPO FILE, NOT A
COOKIE. tools/bohemia_sfx_factory.py now parses every
records/BOHEMIA_SFX_VERDICT_*.txt at build time and bakes the UP/DOWN table into
the shipped surface as SETTLED. localStorage holds only CHANGES on top of that,
so the worst a wiped phone can do is fall back to what he already decided. 85
verdicts bake in today. The factory REFUSES TO BUILD if it finds no committed
verdicts, because a surface that asks him to re-judge everything is worse than
no surface.
  ANY FUTURE JUDGE SURFACE IN THIS REPO MUST DO THIS. The verdict .txt in
  records/ is the truth; the browser is a cache. If you build a judge board and
  its state lives in localStorage only, you have built this bug again.

AND IT FOLDS NOW (both halves of what he asked):
  SOUNDS: every moment is a collapsible card. A moment he has finished judging
    opens CLOSED with a green "DECIDED · n UP" line. Only unjudged moments open.
    COLLAPSE ALL / EXPAND ALL / ONLY UNJUDGED in the bar, plus an explicit
    "NOTHING LEFT TO JUDGE" state so the filter never hands him a blank page.
    Measured in a real browser: 17 cards, all DECIDED, 85/85, surface 1527px ->
    358px with the filter on.
  SONGS: he named songs explicitly, so foldSongs() runs AFTER MUS.build and
    turns each section heading the studio already writes into a toggle for the
    rows under it, closed by default, remembered in localStorage. It does NOT
    touch the studio's code and no-ops if the list is not shaped as expected.
    Measured: 144 song rows -> 13 visible.

HIS 8/1 COMBAT VERDICT: 2 UP of 25. shot.3 and hurt.2, both now banked (40 total)
and WIRED into combat -- sndShot and sndReturn join sndHit and sndKill, so the
gun and the hit you take are his sounds now. miss/vital/clear were wiped 5/5 and
are graveyarded with the post-mortem.
  THE INFERENCE THAT COST ME A BATCH: I carried the 7/30 MATERIAL table into
  combat as if a material score were context-free. It is not. vital was CRYSTAL
  (8/10 on 7/30) and died 5/5; clear was BELL (10/10 on 7/30, and SAVED is built
  from it) and died 5/5. miss was ash and still died -- the only ash that was
  high and undriven. THE RULE: combat is LOW, ASH-OR-STONE, DRIVEN HARD, SHORT.
  A verdict is about a sound IN A PLACE, never a material in the abstract.
  DO NOT re-cook miss/vital/clear unasked. One rejection is not two, and the turn
  they died in was a turn about the surface being wrong.

GATES: SFX WIRED now 190 checks. The new families are PROVED to fail -- blanking
SETTLED reproduces exactly the bug he reported and turns the gate red.
  ALSO FIXED: the gate read UP/DOWN from the 7/30 file ONLY and hardcoded "38
  approvals", so his 8/1 thumbs read as "he never approved that" the moment they
  were banked. It now unions every verdict file and derives the count. Same class
  of bug as the one it was written to catch.
  AND: the door-silence check kept tripping because the studio starts playing on
  its own sometimes; it now stops the song before measuring, so the floor is a
  real 0.0000 instead of a bar of music.

BUILD STAMP: 8/1s - YOUR THUMBS STICK + EVERYTHING FOLDS (MUSIC TAB).

SOUNDS (xk7pjp): 8/1 LATEST — THE COMBAT VOICE. 25 NEW CANDIDATES WAITING ON HIS
THUMBS, in the MUSIC tab. Sound is confirmed WORKING on his phone ("Its green!").

THE HOLE NOBODY HAD NAMED: the 7/30 batch was twelve moments and NOT ONE OF THEM
WAS A GUN. Combat is a shooting game whose gunshot was still
sndShot(){ tone(180,...); tone(90,...); } -- two oscillators, the exact 2007 sfxr
topology he rejected by name. The loudest, most-repeated sound in the game was
the one thing never cooked properly. Five new moments answer it:
  shot   THE GUN. everything else in a fight is judged against it
  miss   it went past. air, not impact
  vital  the bright wrong one. worse than a hit, not yet a kill
  hurt   return fire lands on YOU. the only bad-news sound in the game
  clear  the fight ends and the room goes quiet

RESEARCH: records/BOHEMIA_RESEARCH_GUNSHOT_8_1_26.md, 10 cited sources. A gunshot
is FOUR sounds -- muzzle blast (low, broadband, and it FALLS in pitch as gas
pressure decays), ballistic crack (a separate, much sharper shock), mechanical
action (pin/bolt/slide), and the room. Every one of those already had a field in
BOH_SFX v2, which is the strongest argument yet that the modal rebuild was right:
slide negative IS the pressure drop, hits[] IS the action cycling, trans IS the
crack. NOTHING NEW WAS BUILT IN THE ENGINE.
  THE CONVERGENCE WORTH REMEMBERING: the FPS-design literature says "in a game
  the player needs a clear TRANSIENT and reliable feedback more than a cinematic
  tail." That is his own 7/30 verdict restated as an engineering rule -- brighter,
  shorter, harder-driven, "sounds that CUT and STOP." Research and his taste
  arrived at the same place independently. Every recipe is front-loaded because
  of it.

MATERIALS CAME FROM HIS THUMBS, NOT FROM CONVENTION. A gunshot is conventionally
a metal crack. Metal is what he killed hardest (3/15; both dead doors were metal
and wood; ash 10/10, bell 10/10, stone 5/5). So the gun is ASH AND STONE:
concussion and dust, not a Hollywood receiver clank -- which is also what a
post-collapse valley should sound like. This is the inference from his verdict
being used the way it was recorded to be used: predicting what dies BEFORE he has
to listen to it.

WHAT THE MEASUREMENT CAUGHT, and it is the good part: rendered at neutral makeup
THE GUN CAME OUT AT 0.340 PEAK -- QUIETER THAN A DOOR SHUTTING (0.450) AND
QUIETER THAN PICKING SOMETHING UP (0.390). The most-repeated sound in a fight sat
near the bottom of the mix and nothing would have caught it by ear in a browser.
Makeup gains were set from the measured medians, and the ladder now reads
shot .600 / kill .598 / vital .560 / hurt .550 / hit .524 ... miss .300 / steps
.27 / ui_tap .210. Eight new ladder relationships are locked in
gates/sfx_render_gate.py and PROVED to fail when the gun is turned back down.

NOT WIRED YET, AND THAT IS THE CORRECT ORDER: these 25 are unjudged, so they are
not in the bank and playSFX returns null for them. Combat still plays its old
placeholder beeps for shot/miss/vital/return/win. WIRE THEM ONLY AFTER HE JUDGES
-- wiring first would make combat SILENT, which is worse than a beep. His HIT and
KILL are already live in combat from 7/31.

GATES: SFX RENDER now 1176 checks over 85 candidates (was 843 over 60). SFX
FACTORY 151. Fingerprints re-recorded for all 85.
  A LESSON: four checks broke purely because "12" and "60" were written down in
  three files. Both gates now DERIVE the roster from the engine, and the sfx gate
  no longer asserts "every event is in the bank" -- that was backwards and broke
  the moment a new batch existed, because an unjudged moment is SUPPOSED to have
  no bank entry. A magic number in a gate is a gate that breaks on growth.

NEXT FOR THIS LANE, in order:
  1. HIS VERDICTS on the 25. Then bank them and wire sndShot/sndMiss/sndVital/
     sndReturn/sndWin, which is a five-line change to tools/
     bohemia_combat_sfx_patch.py -- the call sites are already single functions.
  2. BLOCK still has no mechanic to attach to. PENDING his word.
  3. pickup has no loot event to fire from, and LOOT IS CLOSED by another lane.
  4. AMBIENT BEDS still wait on RUN 0d's daycycle.

BUILD STAMP: 8/1h - THE COMBAT VOICE: 25 NEW SOUNDS TO JUDGE (MUSIC TAB).

SOUNDS (xk7pjp): 7/31 (b) LATEST — HE SAID IT AGAIN: "I did not hear any of the
walking sound effects." SECOND REPORT OF SILENCE. Plus: combat now plays his HIT
and KILL.

WHAT I FOUND THE SECOND TIME (the first fix was real but not sufficient):
NOTHING CLAIMED THE PLAYBACK AUDIO SESSION. On an iPhone a page that makes sound
only through WebAudio is muted by the PHYSICAL RING/SILENT SWITCH on the side of
the phone. No error, no warning, nothing in the page to see -- a muted iPhone and
a broken wire look identical from here, which is why I burned two turns guessing.
Safari 16.4+ exposes navigator.audioSession.type='playback' to opt out of it, and
it must be set BEFORE the context starts because it decides the category the
context is born into. It is now set, guarded, on every unlock.
  THIS IS A HYPOTHESIS I COULD NOT PROVE FROM HERE. Chromium on Linux has no
  ring/silent switch, so no gate in this repo can reproduce it. If he STILL
  hears nothing after 7/31w, the audio session was not the cause and the next
  suspect is the phone itself (a hard refresh to re-bootstrap the service
  worker, or headphones/Bluetooth routing). DO NOT ship a third blind fix --
  read the status line first, see below.

STOP GUESSING AT HIS PHONE: there is now a SOUND readout at the top of the MUSIC
tab. It reports the three things that each cause silence on their own -- whether
the audio engine ever STARTED (and its state), whether the silent-switch opt-out
took, and how many sounds have actually rendered. Green when audio is running,
red when not, and it says in words that a red box after tapping the screen means
the phone and not the game. Ask him to read that box before touching any code.

COMBAT PLAYS HIS SOUNDS NOW (his explicit ask). The demo already had a sound
layer, so this is small: sndHit() and sndKill() are single functions called from
26+ sites, and rewriting the TWO FUNCTIONS puts his sound on every hit and every
kill without touching one call site or moving any timing. tools/
bohemia_combat_sfx_patch.py. The old oscillator beeps survive ONLY as a fallback
for the demo opened standalone.
  NOT RE-QUANTISED, deliberately: most of those calls already sit inside
  onBeat()/onOffbeat(), so asking playSFX to schedule them onto the next
  downbeat as well would double-quantise and drag them late.
  BLOCK IS NOT WIRED and that is the correct state. He approved one BLOCK sound
  but THIS DEMO HAS NO BLOCK: `blocked` in there means a pillar is in your path,
  and sndReturn() is you TAKING return fire, which is the opposite. The nearest
  real candidate is cover absorbing a shot. Picking one and calling it a block
  invents a mechanic to justify a sound. PENDING HIS WORD.
  Combat is a srcdoc iframe with an AudioContext of its OWN (pre-existing,
  violates ONE AUDIOCONTEXT, not this lane's to rip out). His sounds do not play
  on it -- combat posts the event and the parent renders it. Combat also posts
  BOHEMIA_GESTURE now, because a whole fight can be played without one touch
  ever reaching the parent's document.

GATE: 150 checks, and the two new families are PROVED to fail -- reverting the
opt-out and putting combat's beep back in front of his sound each produce a red.
  A LESSON, AGAIN: my first version of the silent-switch check was
  `'audioSession' in src`, which a rename to audioSessionXX satisfies just as
  happily. It could not fail, so it was worth nothing, and I only caught it
  because I ran the negative test. A check you have not watched fail is a guess
  wearing a gate's clothes. That is now three separate times this lane has
  shipped a check that could not fail.

BUILD STAMP: 8/1a - COMBAT GETS YOUR HIT AND KILL (COMBAT TAB).

SOUNDS (xk7pjp): 7/31 LATEST — "I didnt hear ur sounds in the game." HE WAS
RIGHT AND MY GATE WAS WRONG. Read this before touching any gate that claims a
surface works.

WHAT THE OLD GATE DID: it proved the run ASKED for a footstep, then called
MUS.audio() itself to start the audio, and launched Chromium with
--autoplay-policy=no-user-gesture-required. It manufactured the exact condition
that was broken and then reported 130 green checks. It never measured one sample
of sound and it never checked that the postMessage actually crossed. This is the
VERIFY-ON-THE-REAL-SURFACE law's "side-door probe is a lie", and it cost him a
build.

THE ACTUAL BUG: an AudioContext may only be STARTED inside a real user gesture.
The only path to MUS.audio() was inside playSFX, and the only gesture that could
reach it was a tap on a button/.tab/.opt. THE SPLASH IS <div id="front">, so the
first thing he ever touches matched nothing. Land in the RUN tab, walk, and every
footstep arrives by postMessage with no gesture behind it. On iOS that context is
born suspended and resume() from a message handler is refused for the session.
Silent forever, with every "is it wired" check green.

THE FIX: unlock on the first interaction of ANY kind anywhere in the parent
(pointerdown/touchend/mousedown/click/keydown, capture, plus visibilitychange),
before anything needs to make noise. And because a touch inside the run iframe
never reaches the parent's document, the run now posts BOHEMIA_GESTURE on its own
pointerdown so the parent can start audio while the browser may still count it as
gestured.

THE GATE NOW MEASURES AIR. No autoplay override, real taps only (pointer events
on the real nav buttons, never a call to move(), which is the side door around
the input path), an AnalyserNode on MUS.MAST, and pass/fail on actual samples.
140 checks. PROVED IT CATCHES THE BUG: run against the shipped build it fails 4,
including "ONE REAL TAP ON THE SPLASH STARTED NO AUDIOCONTEXT". A gate that has
never failed on the real defect is a guess.
  IT ALSO HOLDS AUDIBILITY, not just presence: it measures the bed RIGHT BEFORE
  the walk and requires the footsteps to rise out of it. "It played" and "he can
  hear it" are different claims and only the second one is his.
  TWO OF MY OWN MEASUREMENT BUGS, worth knowing: the first door check read the
  footsteps' decay tails as door noise (0.2044), and the first probe read
  window.MUS, which is undefined because MUS is a lexical global not a window
  property, so it silently measured nothing and reported a peak of 0. A meter
  that fails to attach reports silence, which looks exactly like a real failure.
  The gate now fails if the analyser never attached rather than trusting a zero.

STILL OPEN, NOT CHASED (not this lane): MUS.playing came back True on one gate
run and False on the next with no change in between, so something starts the song
nondeterministically. Flagging only.

BUILD STAMP: 7/31v - THE SOUNDS ACTUALLY COME OUT NOW (RUN TAB).

MAIN IS RED AND IT IS NOT THE SOUND LANE -- READ THIS FIRST, CHARACTER LANE.
BODY VARIATION (gates/bodyvar_gate.js) fails on clean origin/main with ZERO sound
work in the tree; I proved it in a detached worktree at origin/main before
shipping. The failing check is:
    ok('the frame cache hashes the dials ...',
       /frameLookHash[\s\S]{0,400}G\.bodyVar/.test(src));
THE CODE IS FINE. G.bodyVar is still in the hash. What happened is that fc48087
("SHUFFLE FIT was a cache key") added a seven-line comment INSIDE frameLookHash,
which pushed G.bodyVar from 400 characters away to 535. The gate matches on a
fixed BYTE WINDOW, so a comment broke it. The fix is one number, or better, match
inside the function body instead of within N characters of the name -- a
proximity regex is a gate that any explanatory comment can knock over, which is
the opposite of what a gate is for. I did NOT touch it: bodyvar_gate.js is the
CHARACTER lane's file and ONE SYSTEM ONE SESSION says stay out. It is the only
red in 175 gates.

SOUNDS (xk7pjp): 7/30 (a) LATEST — HIS 38 SOUNDS ARE IN THE GAME. He judged all
60, the 22 dead are graveyarded, and WALKING NOW MAKES HIS FOOTSTEPS.

HIS VERDICT (records/BOHEMIA_SFX_VERDICT_7_30_26.txt): 38 UP / 22 DOWN, 60/60
judged. "HERE THEY ARE I JUDGED THEM. SEND THE THUMBS DOWN TO THE GRAVYARD."
  step_dirt 5/5   step_asphalt 5/5   step_gravel 5/5   pickup 5/5
  kill 5/5        save_chime 5/5     ui_tap 3/5        phone_buzz 2/5
  hit 2/5         block 1/5          door_open 0/5     door_shut 0/5

VERIFIED, NOT TRANSCRIBED. Every vector in his export is exactly what
BOH_SFX.cook(event,5) produces (7 candidates x 24 fields checked, zero
mismatches), so an approved sound is addressed as (event, index) and what plays
is byte-for-byte what he heard. Never hand-copy those numbers.

WHAT HIS THUMBS SAY (INFERENCE, labelled as such -- he thumbed, he did not
theorise):
  MATERIAL DECIDED IT. ash 10/10, bell 10/10, stone 5/5, crystal 8/10 versus
  metal 3/15 and wood 0/5. The only two events wiped out entirely are the METAL
  door and the WOOD door. Struck mineral 33 UP / 2 DOWN; metal and wood 3 UP /
  17 DOWN.
  WITHIN AN EVENT: survivors are BRIGHTER, SHORTER, HARDER-DRIVEN and MORE
  ARTICULATED. He wants sounds that CUT and STOP.
  USE THIS. It is the closest thing to a stated taste ruling this lane has, and
  it predicts what will die before he has to listen to it.

WHAT FIRES IN THE GAME RIGHT NOW (exact, not aspirational):
  FOOTSTEPS on every committed step, THE GROUND PICKING THE SOUND from the run's
    own tile classifier. He approved FIVE per surface, so the game plays one of
    his five and never the same one twice running -- a single approved footstep
    at walking pace is a machine gun, which is what "approve unlocks volume"
    was always for.
  SAVED on every autosave.
  UI TAP on the alpha's own buttons, tabs and options.
  window.playSFX(event, when) is the one entry point; when="beat" schedules onto
    the real song's next downbeat.
BUILT AND BANKED BUT NOT YET TRIGGERED: pickup, hit, block, phone_buzz. Their
  sounds are approved and playable this second; what they lack is a moment. Loot
  has no pick-up event in the run, and hit/block live on the COMBAT iframe, which
  is another lane's surface. THAT IS THE NEXT WIRING JOB and it needs a word with
  that lane, not a new sound.

DOORS ARE SILENT ON PURPOSE. Zero approved. Do NOT wire a door to a rejected
sound and do NOT cook a third door batch -- STOP PRODUCING, and doors have died
twice. When he greenlights one: the evidence says DO NOT build it from metal or
wood again. Both dead door attempts were exactly the two materials that scored
3/20. That is a documented dead end now, not an untried idea.

GATES: SFX WIRED (gates/sfx_wired_gate.py) 130 checks -- the bank holds only what
he thumbed UP, nothing he killed, no door, real variation kept, and it WALKS THE
PLAYER IN THE REAL ALPHA and counts (12 steps, 12 footsteps, all his). Proved
able to fail by promoting a killed sound and adding a door.
  A LESSON WORTH KEEPING: that gate first ran 70 checks because the verdict
  record held the tally but not the per-candidate UP/DOWN table, so its main
  check passed VACUOUSLY. Writing the table took it to 130. A gate that cannot
  find its evidence does not fail, it goes quiet -- always print the count and
  ask whether it is the count you expected.
  ALSO: this tool's first docstring claimed six things were wired when two were.
  Fixed before shipping. A tool that overstates itself is a lie the next session
  inherits.
  AND ONE MORE, found landing this on 7/31: ALL THREE sound tools cut their old
  block out on the marker but left behind the newline the injection had put
  after it, so every "idempotent" re-run grew the alpha by one blank line. It
  had piled up TWENTY of them. Nothing broke, no gate cared, and the claim
  "regenerating changes nothing" was quietly false the whole time. Fixed in all
  three, then PROVED by running the full set twice and diffing the md5s. If a
  tool says it is idempotent, run it twice and compare bytes -- do not take the
  word for it.

BUILD STAMP: 7/31m - YOUR 38 SOUNDS ARE IN THE GAME (RUN TAB). (Note: two
lanes both shipped a "7/31d" today. Letters are colliding because nothing
allocates them; if that keeps happening it needs a gate.) (Cooked 7/30,
landed 7/31 behind 51 commits of other lanes; rebased, not hand-merged -- the
alpha was taken from origin/main verbatim and the three sound tools re-run.)

NEXT FOR THIS LANE, in order:
  1. TRIGGER THE REST: pickup, hit, block, phone_buzz. hit/block need the COMBAT
     lane's surface to post BOHEMIA_SFX (one line each, on contact and on block)
     -- coordinate, do not reach in. pickup needs a loot event to exist at all.
  2. AMBIENT BEDS (item 2) still waits on RUN 0d's daycycle.
  3. A DOOR, only on his word.
  4. VARIANTS: he approved 5 footsteps per surface. If he wants more depth, the
     factory can cook a second variation round from the APPROVED vectors rather
     than from scratch -- that is what approval unlocks and it is cheap.

WORLD (9lfjtf): 7/30 — THREE GATES SHIPPED, AND I INDEPENDENTLY DIAGNOSED THE DEAD
ALPHA THEN THREW MY OWN FIX AWAY BECAUSE SOUNDS GOT THERE FIRST AND GOT IT RIGHTER.
Read the CHARACTER and SOUNDS sections below for the incident itself; this is only
what the WORLD lane adds on top.

=== SHIPPED (6582eed, full suite ALL GREEN 586s) ===
Three laws that had no machine behind them now have one. All three RATCHET: floors
set from what is already true, named debt may only shrink, new work cannot add.
  - TOOLS RUN (gates/tools_run_gate.py) — every tools/*.py and *.js PARSES, every
    gate parses, and the hero bank is REPRODUCIBLE byte-for-byte from its factory
    (snapshot, re-run, compare, restore). The hole I proved by falling in it: on
    7/28 I shipped the hero factory to main WITH A PYTHON SYNTAX ERROR and all ~130
    gates went green, because nothing in the suite ever EXECUTES that tool. On its
    first run it found a SECOND broken tool that was not mine —
    tools/bohemia_skin_above_hand_and_throat_patch.py, unterminated string, could
    not execute at all. Syntax fixed, content untouched. Now 186 tools, 164 gates.
  - SQUINT (gates/squint_gate.py) — EVERY DISTRICT IS ITS OWN LANDMARK (Paolo 7/28)
    had no gate. 16x16 silhouettes, TOP HALF ONLY (the full icon is mostly the
    shared ground plate; the top half separates 38% better). 13 twin pairs declared
    as debt, worst is storage/warehouse at 0.8% different.
  - HUE (gates/hue_gate.py) — locks the Pocket City colour measurement so nothing
    slides back to mud. Set median 3 families / 37.2% chromatic; best is the school
    at 9. Deliberately does NOT chase the reference's 88%: a dead Vegas should not
    look like a living sunny city.

=== THE COLLISION, RECORDED HONESTLY ===
I hit the dead alpha independently while rebasing: 21 gates red across four lanes,
traced it to `Unexpected token '<'`, restored the three blocks byte-exact from the
parent, re-landed the rig-tool pixelated fix, wrote a gate (alpha_parses_gate.js,
9 of 11 claims fire on the broken tree) and a post-mortem. Then I fetched and found
ccb0d68 + bc68090 already on main doing the same job, with a BETTER root cause than
mine: I had inferred an ad-hoc line-position stamp edit; SOUNDS proved it was a
rebase conflict resolution across 161 commits. I dropped ALL of it — restore, gate,
post-mortem. Two gates for one law is noise, and a wrong root cause in records/ is
worse than no record. Nothing of mine on that incident is in the repo.

ONE THING STILL WORTH SOMEBODY'S TIME (not urgent, flagged not claimed): the
alpha-loads gate floors RIG_B64/COMBAT_B64 on LENGTH. A blob that is long but
corrupt still passes. Decoding them and asserting they are whole HTML documents is
a two-line upgrade whenever that lane next touches it.

=== THE WALL CLASS RED, AND WHY IT IS ALREADY SOLVED ===
My post-rebase suite came back "1 GATE(S) FAILED: WALL CLASS". It passed 19/0
standalone and 3-for-3 under deliberate parallel load — a contention flake, from
fixed waitForTimeout waits. That is the same finding 5826514 shipped the pid lock
for. The lock is the right fix and it is in. Do not chase WALL CLASS.

=== WHERE THE WORLD LANE ACTUALLY IS (8/2/26, late) ===
FIVE DISTRICTS APPROVED, and they are the standard everything else is measured
against: HIGH SCHOOL 89% (7/31), COMMERCIAL 85%, MALL 85% (8/1), DOWNTOWN 85%,
LIBRARY 85% (8/2, "hella yeah"). "Approved for now" is an APPROVAL, not a snag
list — do NOT reopen them on your own initiative, that is the STOP PRODUCING
failure.

STOPPED, SECOND REJECTION: CITY HALL, COURTHOUSE, TERMINAL, CHAPEL. Scored twice
and stopped under the STOP PRODUCING law. The 8/2 split scores were
  city hall 50/50 · courthouse 50/50 · terminal 50/50 · chapel 65/50 (walking/icon)
DO NOT BUILD A THIRD VERSION OF THESE FOUR. The law is explicit and the numbers say
a third guess would not land either.

WHAT THE SPLIT SCORES TAUGHT, and it is the most useful thing this session produced:
  EVERY ICON IS EXACTLY 50, across four completely different buildings. Four
  subjects landing on one number is a verdict on the SYSTEM that draws them, not on
  the subjects. These were the FIRST split scores ever taken -- the five approvals
  (school 89, commercial/mall/downtown/library 85) were single numbers from before
  "for the walking and icon" existed, so their icons may never have been at 85
  either. There is no evidence any icon in this game has been above 50.
  DENSITY MOVES THE WALKING: chapel +35 on an orchard, two walled memorial courts
  and a parish hall. REMOVING A DEFECT DOES NOT: city hall and courthouse moved +0
  on the tarp-roof and floating-door fix, which was a real repair of real bugs.
  The lesson: finding what he pointed at is not the same as knowing what he wants.
Full record: records/BOHEMIA_VERDICT_SPLIT_SCORES_8_2_26.txt

BLOCKING THE WHOLE ICON SIDE [PENDING Paolo]: are the icons wrong in STYLE (the
look itself -- lighting, palette, the 3D-baked approach) or in DETAIL (approach is
fine, buildings too plain)? Those are opposite fixes and guessing costs a round
each time. Four rounds spent.

SAFE TO CONTINUE (walking is the half that responds): the other downtown block
types -- downtown_arts, downtown_civic, downtown_lot -- on a district type he
approved at 85, using density, which is the lever that demonstrably moves walking.

Full write-up: records/BOHEMIA_FOUR_CIVICS_RESEARCH_8_2_26.md

THREE RULES THIS ROUND PRODUCED, all now in gates:
  1. A NUMBER TAKEN FROM THE REAL BUILDING IS A FACT THE MACHINE CAN HOLD; a
     number invented on the day is decoration. (33 trees, 16 bays, 7 kerb
     points, 100 racks — all counted, all sourced.)
  2. RENAMING EMPTINESS NEVER FIXES IT. The chapel's monoblock moved from
     "sidewalk" to "gravel" and nothing improved. The gate checks the 30% cap
     directly now, and the plot got an orchard, a parish hall and two courts.
  3. AN OVERHEAD IS DRAWN AFTER THE GROUND IT SHADES, AND MASKED TO IT. Laid
     straight over the grid it ERASES the building under it (it cut the
     courthouse rotunda in half); drawn before the plaza it gets erased itself
     (the city hall's 160-ft mast vanished). Both written into the modules.

NEXT UP IN THIS LANE: the other downtown block types the 8/1 research doc
proposes — downtown_arts (the real 18-block Arts District of 1930s storefronts
and warehouses), downtown_civic, downtown_lot. Downtown is several districts
wide by his own ruling and only ONE block type exists. After that, keep walking
the ratchets down (the named debt lists below).

PROPOSED, NOT BUILT, [PENDING Paolo]: the DRIVE-THRU WEDDING CHAPEL — the Tunnel
of Love, a canopy you drive under with a walk-up window, several small chapels
and a gazebo on one lot. The most Las Vegas building type there is and nothing
in the valley has it. Not built because `chapel` is defined in canon as a church,
and redefining a district type is a contents decision.

THE RATCHETED DEBTS (named lists that may only shrink, all in the suite):
  monoblock 31/36 · stub write-ups 60/75 · disconnected drive networks 20/22
  hairline lanes 4/4 · silhouette twins 9/13 · greenwashed tiles fixed (27)

BLOCKED ON PAOLO: HOW LONG SINCE THE COLLAPSE. Still unanswered, still sets the
damage level for all 45 districts. Nothing about weathering can be authored
until he rules it.

STANDING FOR THIS LANE: ACT ONE ONLY (7/28). BUILD THE WORLD (7/31) — quests,
factions and the economy are OFF and their footprint may only shrink. Every
district cell is its own landmark. Do not cook art here — the ART lane cooks
from forms only. Resolver and purse tables stay EMPTY until he rules numbers.
No names, signage text, mascots or brand words anywhere. Never auto-generate
strip/resort/casino/luxor/sphere/strat/highroller/sign, the Fremont casino core
included: Paolo's hand by law.

CHARACTER (0lurbs): 7/30 LATEST — I CAUSED THE DEAD ALPHA BELOW, AND I BUILT THE
GATE THAT MAKES IT UNREPEATABLE. The one red the SOUNDS lane left me is now GREEN.
Read their section next; it is accurate and I am not softening any of it.

=== WHAT I OWED THEM, PAID ===
SOUNDS was right on every point. Their handoff says CANVAS SCALE was red on main
for one check -- "the RIG preview composites NEAREST-NEIGHBOUR" -- because my
commit deleted RIG_B64 instead of replacing it with the patched one, and that the
restore neither caused nor worsened it. Correct, and they were right not to touch
my tab's blob. RIG_B64 is now regenerated with image-rendering:pixelated inside
its <style>. CANVAS SCALE: 29 passed, 0 failed. 165 of 165.

All 13 character surfaces now land on exact whole-number scales:
    charCv x3 · portraitCv x2 · cloBig x3 · cloCv x1 · g8_0..7 x1 · rig cv x1
Fractional canvases 19 -> 4. The 4 left are combat/city and belong to those lanes.

=== THE GATE THAT COMES OUT OF THE EMERGENCY ===
SOUNDS wrote: "a page-error probe ... takes 10 seconds and would have caught this
before it ever reached him." That is now a gate, not a suggestion.

gates/alpha_loads_gate.js (wired into the suite, ~5s, ALPHA LOADS 20/0):
  - the alpha loads in a real browser with ZERO page errors, and BAKED / drawChar
    / MUS exist at runtime with all 8 facings present
  - RIG_B64, COMBAT_B64 and BAKED are present AND still full size -- a floor on
    each, because a TRUNCATED blob is a silent art loss that never throws
  - exactly ONE buildstamp div, and no loose HTML tag at the start of a line in
    any script body (that is the exact signature of what I shipped)
  - no conflict markers (keeps the 7/29 regression dead too)
Law: laws/BOHEMIA_ADDENDUM_THE_ALPHA_MUST_LOAD_7_30_26.md

WHY IT IS DELIBERATELY CHEAP: the full suite is ~590s, and that is precisely why
it got skipped under time pressure. A guard you skip is not a guard. Run this one
before every push; it is affordable enough that there is never a reason not to.

THE PROCESS FAILURE, NAMED SO IT IS NOT REPEATED: my full suite HAD run green --
BEFORE the rebase. Main moved 161 commits and I did not re-run, because the
earlier green still felt like it counted. It did not. A green from before a
rebase describes a tree that no longer exists. The 7/29 conflict-marker pre-push
guard passed truthfully here; this merge left no markers, it deleted a megabyte
instead. A guard that checks one signature of a bad merge says nothing about the
others.

I FOLLOWED THEIR RULE THIS TIME. Their "NEVER RESOLVE AN ALPHA CONFLICT BY HAND"
is now how this lane ships: `git checkout --ours slices/BOHEMIA_ALPHA_0_9.html`
(take main's alpha whole), re-run the idempotent patch tool, re-set the stamp,
run ALPHA LOADS, push. This ship did exactly that and lost nobody's bytes.
NOTE FOR WHOEVER IS NEXT: the RUN lane landed the restore (ccb0d68) while my
suite was running, so the BAKED on main is THEIRS, not my splice. Mine was
byte-identical from 7bf83a1~1 but it is theirs that shipped. Credit where due.

=== CHARACTER LANE STATE ===
SHIPPED AND GREEN (this session): the 1px black outline on all 8 facings; the
neck as its own skin TONE (not a shadow) + throat rows, E/W one row shorter per
his ruling; his curtain-bob hair applied verbatim; his chin/neck rig edit applied;
A LONG SLEEVE STOPS AT THE HAND (0 arm cells render bare skin on E/W/S);
CLOTHES FOLLOW THE BODY; shoulder share + rigid arm; the SHOULDERS / ARM LENGTH /
HIPS dials with legs tied to the arms dial; whole-pixel canvas scaling.

[PENDING, PAOLO'S CALL] -- do not decide these:
  1. Border tone: pure black / dark brown 38,30,26 / softer brown 58,46,40 / none
     (anchors: records/outline/BORDER_TONE_CHOICES_7_27_26.png)
  2. Far-hand depth on E/W: far reads 153.2 vs near 153.8, so there is no depth
     cue at all. Either a separate shading layer (SHADOWS ARE SEPARATE, 7/26) or
     do not draw the far hand in profile. Not my call.
  3. Unbuilt slider proposals he has not ruled on: LEG LENGTH vs TORSO,
     FRAME/BULK, POSTURE, NECK LENGTH.

ANSWERED HONESTLY, NOT QUIETLY DROPPED: he asked for a 0.5px border. It is
impossible -- the pixel grid plus the RENDER PIXEL gate forbid half-pixel draws.
The `outerOnly` alternative was measured byte-identical (12,170 pixels either
way, 0% less black), so the dead code was removed instead of shipped as a fake
improvement.

RULINGS RECORDED THIS SESSION: FAT IS FAT -- no sex-aware fat distribution, and
the gate blocks `bust` / `fatDistribution` / `gynoid` as identifiers. A woman
reads through "slightly skinnier arms, shorter" plus narrow shoulders. NO female
rig, ever.

TILE FORMS FILED (art lane cooks from these, I cooked nothing):
  TF-CHAR-001 contact shadow (row 7, HIGH) · TF-CHAR-002 stage ground (row 8,
  HIGH) · TF-CHAR-003 footfall dust (row 12, MED) · TF-CHAR-004 portrait
  backdrop (row 13, LOW)

--------------------------------------------------------------------------------

SOUNDS (xk7pjp): 7/30 LATEST — TWO THINGS. (1) I RESTORED THE RIG, THE COMBAT TAB
AND PAOLO'S PAINTED BODY: main was shipping a DEAD alpha for ~12 minutes. (2) THE
RUN IS ON THE SONG'S CLOCK (SOUNDS item 1 done). The 60 remade sounds are still
unjudged and that is still the only thing blocking this lane.

=== THE EMERGENCY, FIRST, BECAUSE IT WILL HAPPEN AGAIN ===
Commit 7bf83a1 (CHARACTER lane, "EVERY CHARACTER SURFACE LANDS ON WHOLE PIXELS")
landed on main having DELETED three lines of the alpha and left a stray
build-stamp <div> where they were -- inside a <script>:
    const RIG_B64=...      127,857 bytes   THE ENTIRE RIG TAB
    const COMBAT_B64=...  1,109,816 bytes  THE ENTIRE COMBAT TAB
    const BAKED={...}        30,339 bytes  PAOLO'S HAND-PAINTED RIG DATA
An HTML div inside a script is a syntax error, so the whole block failed to parse:
"Unexpected token '<'" on load, no BAKED, no MUS, EVERY TAB DEAD. And it deployed
-- the Pages run for that main concluded SUCCESS at 16:45, so the live link was
broken for him until the restore at 16:58.
RESTORED verbatim from 7bf83a1~1, asserting none of it was already present so
nothing of theirs could be clobbered. Their canvas-sizing work is untouched.
VERIFIED AFTER: zero page errors, RIG IS LAW 12/12, COMBAT 513/513, THE RUN
126/126, SFX 135/135, SFX RENDER 843/843, RUN BEAT 22/22.

THE RULE THAT COMES OUT OF IT, and this lane made the same class of mistake TWICE
today before catching it: **NEVER RESOLVE AN ALPHA CONFLICT BY HAND.** The alpha
is 33 MB of single-line data blobs; a conflict in it cannot be read by eye, and a
regex-spliced resolution silently ate content both times. The safe move, every
time:
    git checkout origin/main -- slices/BOHEMIA_ALPHA_0_9.html
    <re-run your patch tool(s)>          # they are idempotent, that is the point
    <re-set the build stamp>
That reproduces your change deterministically on top of whatever main has, and it
cannot lose anybody else's bytes. A page-error probe (open the alpha in a real
browser, listen for `pageerror`) takes 10 seconds and would have caught this
before it ever reached him.

FOR THE CHARACTER LANE, THE PART I DID **NOT** FIX: CANVAS SCALE is red on main,
one check -- "the RIG preview composites NEAREST-NEIGHBOUR". That check is YOURS,
added in 7bf83a1, and the content it demands never landed: the commit deleted
RIG_B64 rather than replacing it with the fixed one. I restored the PRE-EXISTING
rig, which does not carry your image-rendering change, so your check still fails.
  I MEASURED WHETHER I CAUSED IT: ran your gate on your own broken main --
  28 passed, 1 failed. On the restored tree -- 28 passed, 1 failed. IDENTICAL.
  You shipped that gate red; the restore neither caused nor worsened it.
  I did not fix it because it is a CSS property inside your tab's base64 blob and
  that is your content, not a merge artifact. Regenerate RIG_B64 with the
  image-rendering fix and it goes green. 164 of 165 gates are green on main now.

=== SOUNDS ITEM 1: THE RUN IS ON THE SONG'S CLOCK ===
THE HOLE: the walk's beat was the literal `var BEAT=500` and nothing about tempo,
beat index or transport crossed the parent->run postMessage vocabulary, while
COMBAT got full song data and a HERO BEAT. The run and the music agreed only
because both numbers were typed the same. Two clocks that had not drifted yet.
  PARENT (tools/bohemia_run_beat_patch.py): the studio already schedules every
    16th on the AudioContext clock, so on each beat it posts BOHEMIA_RUN_BEAT with
    the beat index, BPM, ms-per-beat and how many ms from now that beat lands.
  RUN: an RB receiver phase-locks and exposes msPerBeat/beatNow/phase/
    msToNextBeat. The door animation and the slide read the live tempo. A SILENT
    RUN IS UNCHANGED: RB reports 500 ms and 120 BPM when nothing plays.
  GATE: gates/run_beat_gate.py (RUN BEAT), 22 checks driving the real alpha with
    the real studio playing. Proved able to fail by reintroducing the timebase
    bug: red on the lock AND the phase rate, restored.

THREE REAL BUGS THIS ROUND, none visible outside a real browser:
  1. performance.now() IS PER-CONTEXT. An iframe's time origin is when the iframe
     was created, so a parent timestamp runs ahead of the child's clock by however
     long the page had been up -- it measured the run 22 beats off. The message
     carries a DELTA now, true in anybody's clock.
  2. MY IDEMPOTENT REMOVAL CUT ONE LINE SHORT and left an orphaned `})();` in its
     own <script>. The block parsed fine in isolation; only opening the page
     caught it. Marker-bounded now: a wrapper you insert is a wrapper you delete
     whole.
  3. I PATCHED A GENERATED FILE. slices/BOHEMIA_RUN_CURRENT.html is built by
     tools/build_run_slice.js and says "never edit this file directly";
     gates/run_gate.js caught it via "regenerating changes nothing". The patch
     edits the dev source and runs the builder now.

=== STATE ===
BUILD STAMP: 7/29l - THE RUN RUNS ON THE SONG (RUN TAB).
  (Letters are contended -- three other lanes shipped 7/29g through 7/29k the same
   day, and one of them reused a letter. CHECK THE STAMP IN THE FILE before you
   pick, and never assume your letter is free.)

WHAT IS PENDING PAOLO:
  1. THE 60 REMADE SOUNDS — MUSIC tab. Still the only thing blocking this lane.
  2. (fleet) what colour rebuilt Vegas is, in his words (open since 7/27)
  3. (fleet) cars 2x3 vs the re-cook's shorter read (open since 7/28)

NEXT FOR THIS LANE:
  - IF VERDICTS ARE IN: approve -> bank the vector, cook its variant set (3-4
    alternations per footstep), and wire the approved events to real steps, which
    is now possible because the beat clock exists.
  - IF NOT: item 2 (ambient beds) still waits on RUN 0d's daycycle. There is no
    third sound batch. He rejected once and I remade once; STOP PRODUCING says a
    second rejection ends the feature for the session.

READ BEFORE YOU RUN THE GATES: a fresh container has no image stack, and this
session hit that TWICE (the container reset mid-session). Nine pixel-reading
gates need it: pip install -r gates/requirements.txt. bohemia_gates.py prints a
banner naming them before the first gate if either library is missing.

READ AFTER YOU PUSH: GitHub Pages can silently skip a push. If no
"pages build and deployment" run appears within a few minutes, push an EMPTY
commit to main -- that produces a correctly-labelled run in about two minutes.
This container cannot reach paolosarn.github.io (403 from the network policy), so
the Actions API is the only deploy check available.

--------------------------------------------------------------------------------
SOUNDS (xk7pjp): 7/29 (j) LATEST — THE RUN IS ON THE SONG'S CLOCK (backlog item 1
DONE), and the 60 remade sounds are still waiting on his thumbs.

ITEM 1 SHIPPED: THE RUN HAD NO BEAT. The walk's beat was the literal `var
BEAT=500` and nothing about tempo, beat index or transport ever crossed the
parent->run postMessage vocabulary, while COMBAT got full song data and a HERO
BEAT. The run and the music agreed only because both numbers were typed the
same. That is two clocks that have not drifted yet, not the 120 BPM LAW.
  PARENT (tools/bohemia_run_beat_patch.py): the studio already schedules every
    16th on the AudioContext clock, so on each beat boundary it posts
    BOHEMIA_RUN_BEAT with the beat index, BPM, ms-per-beat, and how many
    milliseconds from now that beat lands.
  RUN: a small RB receiver phase-locks and exposes msPerBeat/beatNow/phase/
    msToNextBeat. The door animation and the slide read the live tempo instead
    of a literal. SILENT RUN IS UNCHANGED: RB reports 500 ms and 120 BPM when
    nothing is playing, so a quiet run behaves exactly as before.
  GATE: gates/run_beat_gate.py, registered as RUN BEAT, 22 checks in a real
    browser with the real studio playing. Proved able to fail by reintroducing
    the timebase bug: went red on the lock AND on the phase rate, restored.

TWO REAL BUGS THIS ROUND, both caught only by driving a real browser:
  1. performance.now() IS PER-CONTEXT. An iframe's time origin is when the
     iframe was created, so a timestamp taken in the parent is ahead of the
     child's clock by however long the page had been up -- it measured the run
     22 beats away from the studio. The message carries a DELTA now ("this beat
     lands in N ms"), which is true in anybody's clock.
  2. MY OWN IDEMPOTENT REMOVAL CUT ONE LINE SHORT and left an orphaned `})();`
     inside its own <script> tag, throwing "Unexpected token '}'" on every page
     load. Invisible to a syntax check of the block (it parsed fine alone) and
     invisible to grep. The injection is marker-bounded now: a wrapper you
     insert is a wrapper you delete whole.

NEXT FOR THIS LANE: item 2 (ambient beds) still waits on RUN 0d's daycycle. The
real next move is HIS VERDICT on the 60 sounds -- approve unlocks the variant
sets and the wiring of actual footsteps to actual steps, which is now possible
because the clock exists. DO NOT cook a third batch.

--------------------------------------------------------------------------------
SOUNDS (xk7pjp): 7/29 (h) — THE SOUNDS ARE REMADE. HE SAID v1 SOUNDED

--------------------------------------------------------------------------------
ANOTHER LANE'S SECTION, CARRIED FORWARD UNTOUCHED.
--------------------------------------------------------------------------------

[CANVAS SCALE: FLAGGED RED BY THIS LANE, THEN FIXED BY ANOTHER LANE'S ALPHA RESTORE
 BEFORE THIS COMMIT LANDED. Re-measured on the rebased tree: 29 passed, 0 failed.
 Leaving the note because the METHOD is the reusable part and the next inherited red
 will want it: gates/canvas_scale_gate.js was failing one assertion (the rig preview
 compositing bilinear instead of nearest-neighbour). Rather than assume it was not
 mine, I checked out 7bf83a1 DETACHED and ran the gate there, where it failed HARDER
 (the audit could not reach the real surfaces at all, which was the dead alpha). That
 proved the red predated this lane's commit and belonged to the CHARACTER lane. A red
 you did not cause still has to be PROVED inherited, on the tree where it started, and
 flagged by owner. It never gets fixed by editing another lane's system to make your
 own suite green.]

*** ONE SUITE AT A TIME, AND NOW THE MACHINE ENFORCES IT (7/30, RUN lane) ***
  I ran two gate suites on one tree at the same time. They reported "ALL GATES GREEN"
  and "10 GATE(S) FAILED" within minutes of each other, on identical trees, and I
  shipped on the green one. Both verdicts were garbage: run_gate REGENERATES the run
  slice in place and current_slice_gate regenerates the slice, both drive real
  Chromium, so a second suite reads half-written files and starves the first of CPU.
  Every one of those 10 "failures" came back green when re-run alone (front door 3 for
  3). A GATE SUITE WHOSE ANSWER DEPENDS ON WHAT ELSE IS RUNNING IS NOT A GATE SUITE.
  gates/bohemia_gates.py now takes a pid lock and REFUSES to start while another suite
  is live; stale locks self-clear by checking the pid, so a killed run never wedges the
  repo. Proved all three ways (blocks a live owner, clears a dead one, releases on
  exit). If you see "REFUSING TO RUN", that is the fix working, not a bug.
  THE TELL FOR ANY SESSION: if you are about to launch a suite while one is in flight,
  you are about to generate a number you cannot trust. Wait for it.

RUN (eak241): 7/31 LATEST — HIS TWO STREET RULINGS ARE IN AND LOCKED.

  "New rule all drive ways [2] tiles wide not three and Im upset your sururbs
   dont have a 1 grid sidewalk next to the streets whata wrong with you bro"
  (with a screenshot: a yellow line traced down the road edge, a circle round a
  fat driveway)

DRIVEWAYS: DVW was 4 and measured 3 or 4 on the real surface depending on
clipping. Now exactly 2 wide x 3 long, verified as BLOBS across 5 seeds and 32
blocks -- no other shape exists.

THE SIDEWALK IS THE ONE TO READ, because it is a whole class of bug. The RUN's
renderer ALREADY drew a kerb band: groundTile() asked "is this ground next to a
road?" and laid the approved walk_kerb tile. Measured on the real surface, all
709 ground-touching-road cells came back walk_kerb. On the one screen anybody
looked at, it was done.
It was a costume. bohemia_suburb.js had codes 0,1,2,3,4,5,6,9 and none of them
was a sidewalk. So the CITY drew none (different renderer, same world), the
tilespec dossier had no row for the tiling phase, the world model reported no
walk surface, and NO GATE COULD EVER FAIL because there was nothing to check.
  A FEATURE THAT LIVES INSIDE ONE RENDERER'S IF-STATEMENT IS NOT IN THE GAME.
Code 10 now, laid by the generator in a final pass after homes and driveways, so
the walk breaks where an apron crosses it. The run's inference trick is DELETED
on purpose: as a fallback it would re-fake the walk the moment the generator
regressed, which is exactly how this hid.

TWO GATES CAUGHT ME MID-FIX, both correctly:
  1. I first used code 7. suburb_modular_gate went red on "no vegetation
     anywhere" -- 7 is the retired TREE code, 8 is POOL, and the dead-world law
     forbids both. A code that no longer appears in output is not a free code.
  2. Then population_gate went red on OFFLINE/ONLINE AGREEMENT: bohemia_agents.js
     has its own hardcoded passability whitelist (0,1,3,5) and nothing added 10,
     so the neighbours could not cross their own kerb. A SIDEWALK THE SIM TREATS
     AS A WALL is the most obvious way this feature can be wrong and my first
     gate did not check it. It does now.
  ANY NEW GROUND CODE must be re-declared in every hardcoded whitelist that
  decides what a body may stand on. Grep before you assume.

gates/suburb_street_gate.js (12 checks) checks the WORLD MODEL, never the
renderer, so it would have caught the original bug. Proven able to fail three
ways before being trusted. Law: laws/BOHEMIA_ADDENDUM_KERB_AND_DRIVEWAY_7_31_26.md
Measured after: 35 px of walk between asphalt and yard = exactly one tile.
Shipped 4fad0dd, stamp 7/31c.

NOTE FOR THE NEXT SESSION ON MAIN VELOCITY: this ship took four rebases because
main moved every few minutes while an 11-minute suite ran. The last one was
verified TARGETED (both lanes' gates on the merged tree, all green) rather than
by a fourth full pass, and the commit says so. If you hit the same treadmill,
say which you did -- do not imply a full pass you did not run.

RUN (eak241): 7/30 LATEST — EVERYTHING THIS LANE BUILT IS ON MAIN AND GREEN, AND THE
LANE IS PARKED ON ONE DECISION. Read this section before touching the run.

WHAT LANDED (all shipped, all gated):
  - THE BUILDING STACK, rebuilt. He said the garages looked like "sideways U's" and he
    was right. Doors now only ever sit on the SOUTH face (the only face a 3/4 top-down
    projection can draw), walls are 4 courses under a 3-course roof cap measured off the
    frozen target frame, garage bays are max 3 wide at the driveway end of a south run.
  - OCCLUSION. Standing under a canopy/deck fades it to 0.35. My FIRST cut faded whatever
    sat north of him, which ghosted him standing in his own front yard — he is IN FRONT
    of that wall. Restricted to the overhead layer plus the doorway leaf.
  - OFF MEANS SILENT (law, 7/27). MUS.stop() cut the scheduler but not the master gain,
    so booked notes kept playing after the button said off.
  - THE D-PAD IS NOT TEXT. iOS raised copy/paste on every direction press. The run is the
    ONE tab loaded by iframe src (the other three are base64 blobs), so the 7/27 guard and
    its gate both skipped it. Guard is in the DEV SOURCE — the generated file gets erased.
  - FRONT PATHS instead of concrete confetti: a real BFS path from the door to the street.
  - ONE VEGAS. The run and the city were literally two different valleys (hashSeed
    ('bohemia')=2691674296 vs a hardcoded 2026). Same seed now, plus a run->city position
    bridge and a CHOSEN home cell [39,23] instead of the map rim.
  - THE BANKS-USED GATE (from his "are you drifting off?" — laws/BOHEMIA_ADDENDUM_
    NEVER_DRIFT_7_28_26.md). Approved-but-unused art is a DEFECT, waivers must be named,
    ticketed, and asserted honest in both directions.
  - PAPERWORK, no pixels cooked: 9 tile forms, the UI catalogue, 45 currency icon options
    and his three combined picks (laws/BOHEMIA_ADDENDUM_COMBINED_CURRENCY_ICONS_7_28_26).

*** [DONE 7/31, HIS RULING] THE DISTRICTS ARE FULL SIZE. Paolo 7/30: "The districts
should have always been full size bro." TILE_FINE/SLOT_FINE 32 -> 128. A cell is now
128x128 = 16,384 walkable cells = 96m a side; the valley reads 5.73 mi across instead
of 1.43. Every district generator, walkable-land, landlocked and the kit took it with
ZERO changes -- they were already parameterised, the constant was just wrong.
  bohemia_world.js no longer keeps its own `var T = 128`; it reads OM.TILE_FINE, so
  there is ONE number. gates/valley_scale_gate.js (14 checks) reads the size OUT OF
  THE LAW FILE rather than a value typed into the gate, and fails if any engine module
  outside the overmap assigns a scale constant a literal.
  THE CITY TAB NEEDED MORE THAN THE CONSTANT and this is the transferable part: a
  canon block is 128x128, so when a cell was 32 the renderer glued a 4x4 GROUP of
  cells into one block and each cell drew its own 32x32 window (`tx>>2`, `(tx&3)*FN`).
  At 128 that asks for a 512-wide block and windows to offset 384 in a 128-row array:
  undefined, every suburb and kit district. Byte-marrying the blob to canon WITHOUT
  fixing that would have turned the gate GREEN ON A BROKEN CITY, which is worse than
  the red. Fix is not "4 -> 1" but `const GRP = Math.max(1, Math.round(128/FN))`:
  4 at the old scale (arithmetically identical to what shipped), 1 now, right at any
  future scale. tools/bohemia_city_scale_patch.py, exact strings never a regex sweep
  of `>>2`/`&3` (ordinary bit math elsewhere), refuses to write if any expected text
  is missing, idempotent. Six slices carrying an embedded overmap rebuilt.
  Shipped dbd6c90, full suite ALL GREEN 661s, stamp 7/31a. Below is the finding that
  led here, kept because the ROOT CAUSE (two sources of truth for one number) is the
  lesson, not the number. ***

THE FINDING THAT UNBLOCKED IT — records/BOHEMIA_DISTRICT_SCALE_FINDING_7_28_26.md.
He asked why the districts feel small. They WERE small, by 16x, and his own law said so.
  RUN   engine/bohemia_world.js   `var T = 128`     128x128 = 96m x 96m   valley 5.73 mi
  CITY  engine/bohemia_overmap.js `TILE_FINE=32`     32x32  = 24m x 24m   valley 1.43 mi
laws/BOHEMIA_ADDENDUM_VALLEY_SCALE_LAW_7_6_26.md is LOCKED, is titled "revokes the 24m
SLOT SCALE LAW of 7/5", says 128, and its own checklist marks the relock DONE. The file
still reads 32 and its header still cites the revoked law by name.
ROOT CAUSE, and it is the transferable part: TWO SOURCES OF TRUTH FOR ONE NUMBER. The run
hardcodes 128 and never reads the overmap, so it has been right by coincidence rather than
by obeying the law, and nothing in the repo compared them. Same shape as the ONE MAP seed
bug fixed the same week in the same module.
I DID NOT FLIP IT UNASKED. FN appears 4,812 times in the city renderer, 48 generators fill the
cell, and WALKABLE-LAND would fire loudly the moment a lot becomes a neighbourhood. That
was a fleet-wide change on his word, not mine. [ANSWERED 7/30: yes. DONE, see above.]
HE SAID YES, AND THIS IS WHAT IT TOOK: set TILE_FINE = SLOT_FINE = 128, delete the stale 7/5 header comment,
re-run every district gate, and ADD THE MISSING GATE that asserts the run's TILE_PER_CELL
and the overmap's TILE_FINE are the same number. Without that gate this silently rots again.

ALSO PENDING PAOLO (nothing here blocks the fleet): district floors (de-border the desert
tiles / shop another bank / dress by structure); walk feel GRID/SLIDE/HYBRID/FREE has been
live and unjudged since 7/26; what eating costs in time; the moment table + per-unit rates
(backlog A2, and it blocks everything downstream of the resolver); reach in tiles.

WHAT I'D DO NEXT WITHOUT A WORD FROM HIM: backlog RUN item 1, the PHONE-FEEL PASS — real
device-shaped viewports, hold-to-walk tuning, tap target sizes. It needs no verdict and no
art. DISTRICT ART is the biggest visible gap in the ledger but it sits behind both pending
items above, so starting it now would be building on a number that may change by 4x.

DO NOT: edit slices/BOHEMIA_RUN_CURRENT.html. It is GENERATED. The dev source is
slices/BOHEMIA_RUN_SLICE_7_26_26.html and the builder overwrites everything else.
DO NOT: run the full suite while files are still being edited — the run gate asserts
"rebuilding changes nothing" and you will invalidate your own pass. I did this to myself.

CITY (03): 7/29 LATEST — THE WALK SURFACE HAS PEOPLE IN IT NOW. This was the lane's #1
item (ER, the engine reality audit) and it is also his 7/29 ruling made real, so it was
the one obvious thing to do on "go".

THE FINDING, measured before touching anything: human mode had the best render
architecture in the repo — chunk LRU, canvas pool sized against the measured iOS floor,
genuinely seamless streaming — and ZERO people. Not few. Zero. No BohemiaAgents, no body
drawing of any kind; the only movers were cars and planes.

MEASURED ON THE REAL SURFACE, real browser, real tab, real splash dismissed:
  standing in a CLUSTER        9 people on screen
  standing in a NO MAN'S LAND  0 people on screen

engine/bohemia_population.js is his zone map as a SHARED module, deliberately not a patch
inside one renderer. The RUN and the CITY tab share almost no drawing code and this lane
has already been burned once by fixing the surface he does not play. If each invented its
own idea of who lives where, the same neighbourhood would be a ghost town in one and a
settlement in the other.

IT FEEDS THE EXISTING SIM RATHER THAN FORKING IT, and this is the part worth copying.
bohemia_agents.js (WORLD's module) ALREADY holds a two-plane census and ALREADY takes a
per-call `occupiedRate` — whose own source comment calls the flat 0.30 "a PLACEHOLDER...
[PENDING Paolo]". His 7/29 ruling answered that pending item. So the new module supplies
that rate per neighbourhood (cluster 0.115, spread/loner 0.005, empty 0.000) and adds no
second census. No edit to another lane's file, ENGINE SYNC intact. BEFORE BUILDING A
PARALLEL ANYTHING, CHECK WHETHER THE EXISTING MODULE ALREADY TAKES THE OPTION YOU NEED.

THREE THINGS FOUND BY LOOKING AT THE SCREEN, not by reading code:
  1. A cluster scattered evenly over its 128x128 subdivision put exactly ONE person in
     view — indistinguishable from a loner. A phone shows ~17 cells across at walk zoom,
     so the radius is 8 now and 3-5 neighbours are visible at once. You still never see
     all 13 and you should not: you hear a settlement before you see it.
  2. My first standable test was homegrown (`!solid && !face`) and put residents ON
     ROOFTOPS. Fixed to the frame's OWN `walk` flag, the exact predicate move() uses. IF
     A PERSON CAN STAND WHERE THE PLAYER CANNOT WALK, THE TEST IS WRONG, NOT THE WORLD.
  3. Placement is CACHED per neighbourhood and the player MOVES, so a standable test that
     consulted hx/hy would bake a stale answer into the cache. Occupancy is enforced at
     DRAW time instead, and the gate proves it by stepping him onto a resident and
     watching the count drop by exactly one.

TWO NEW GATES, and note the name check: gates/population_gate.js ALREADY EXISTED (LIFE
session, 7/19, two-plane sim). Mine are gates/zone_map_gate.js (56 assertions, node) and
gates/city_people_gate.js (14, real browser). Both proved able to FAIL before being
trusted — sabotaging the module produced 1,232 desert ghosts and killed the no man's land.

ZERO PIXELS COOKED. Every body is the character he already built, tinted: the canon
"enemies are tints of me" mechanism (7/3), the same one the RUN's townsfolk already use.

NOBODY MOVES YET, ON PURPOSE. Schedules live in bohemia_agents.js and duplicating them
here would fork the simulation. This draws PRESENCE, which is exactly what "how busy the
city feels" asks for.

WHAT COMES AFTER, in order: (1) wire the real schedules through the same module so the
clusters wake up, work and come home — the agent module already has them, it just needs
the zone map's rate; (2) the RUN consumes the SAME module so both surfaces describe one
city (it is already importable, nothing to design); (3) the eight tile forms from 7/28
are still waiting on the ART lane and nothing here blocks them.

BLOCKED ON PAOLO: nothing new.

DO NOT: add movement inside the city frame. That forks WORLD's sim. Do not raise the
population because "it feels empty" — a quarter of the map is empty ON HIS ORDER and the
gate will catch you.

SOUNDS (xk7pjp): 7/29 (h) LATEST — THE SOUNDS ARE REMADE. HE SAID v1 SOUNDEDLIKE 2006 SOFTWARE AND HE WAS RIGHT TO THE YEAR. MUSIC TAB, TOP OF THE PANEL.

HIS RULING on batch SFX-01: "okay its decent i appreciate it. it sounds like it
was made with some software from 2006 so if we could do better than that for all
of them. i want you to do big brain research on final fantasy 10's ui sound
system. by far my favorite ui sounds of all time. remember i love the idea of
apocolypictc horror final fantasy shit so remake all of these. they were mid at
best tbh but its the right direction."
  DIRECTION APPROVED (the 12 moments, the judge surface, the factory law).
  SOUNDS KILLED and remade. Graveyard 2026-07-29 with the full post-mortem.

HE DATED IT ALMOST EXACTLY. v1 was the sfxr topology -- one source, one filter,
one envelope -- and sfxr shipped in 2007. It was also behind RISSET'S BELL of
1969, which already gave each of eleven partials its OWN duration. Research with
sources: records/BOHEMIA_RESEARCH_FFX_UI_SOUND_7_29_26.md

WHAT THE RESEARCH FOUND, and what v2 does about it:
  - FFX played RECORDED RESONANT OBJECTS into the PS2 SPU2's HARDWARE REVERB
    (Room/Studio/Hall/Space), and FFX was the FIRST Final Fantasy to move its
    sound effects off MONO. v1 was synthetic, dry, and pan 0 on all 60 -- the
    exact axis FFX treated as its upgrade.
  - v2 is MODAL: every sound is a struck material with 8-16 INHARMONIC partials,
    each with its OWN decay, and the decay SHORTENS as the partial rises. That
    one property is the loudest "synthetic" tell there is; nothing physical
    stops all at once.
  - WARBLE: paired partials offset by a few Hz beat slowly, the way a real bell
    does from material asymmetry.
  - THREE LAYERS: transient (the snap), body (the modal bank), tail (the room),
    transients sample-aligned, snap slightly hotter than the body.
  - THE ROOM IS BUILT AS SOURCES, NEVER PROCESSORS, because the SCREECH LAW bans
    createDelay and createConvolver: early reflections are the body re-struck at
    scheduled offsets, and the late tail is filtered noise under an exponential
    decay -- which is what a late reverb tail physically IS (the velvet-noise
    result, inverted). Nothing can ring or feed back.
  - STEREO for real: partials radiate in different directions, reflections pan
    opposite.

THE MATERIALS (the apocalyptic-horror FF direction, applied):
  ash -> footsteps, dirt and gravel      stone -> asphalt, wet concrete
  metal -> doors, blocks, the phone      wood  -> the door shutting
  crystal -> UI tap and pickup           bell  -> the kill and the save (Risset)
  and bone for impacts. THE TAIL RULE: only sounds that MEAN something get the
  room. Footsteps stay dry and close, or walking turns the game into a
  cathedral. That contrast is the horror.

THE BANK IS STILL EMPTY AND MUST STAY EMPTY. Nothing is chosen. play() on an
unbanked event is silent on purpose.

WHAT THE MACHINE CAUGHT THIS ROUND (v2), all of it real:
  1. THE OUTPUT GAIN WAS DRIVING INTO THE SATURATOR, pinning HIT/BLOCK/KILL/
     PHONE at exactly 1.000. Same class of bug as v1's crush placement: a
     WaveShaper clamps past +-1, so a hotter input does not get louder, it pins.
     The saturator SHAPES, the gain LEVELS, in that order.
  2. MY DURATION MATHS WAS WRONG. beatsOf() ADDED the room to the body, but the
     room is triggered at the same instant as the strike -- so every roomy sound
     was reported about twice as long as it is. The gate then called five bells
     "a click" for being audible over a third of a length that never existed.
     A duration this engine reports is one the game schedules against.
  3. THE SATURATOR'S 2x OVERSAMPLING CARRIES STATE, and across the ~120 offline
     contexts a gate run creates, one candidate rendered 1.8% differently the
     second time while measuring 0.0001% in isolation. It is memoryless now: a
     judged sound cannot depend on how many sounds were rendered before it.
  4. THE STEREO SPREAD WAS A LEFT-TO-RIGHT RAMP, which put partial 0 -- the
     loudest in every bank -- hard on one side and collapsed several candidates
     back to near-mono. Partials now radiate in alternating, widening directions.

AND TWO PLACES WHERE MY OWN NEW GATE WAS WRONG, corrected against the reference
rather than around it:
  - "per-partial decay must fall monotonically" FAILED RISSET'S OWN TABLE
    (partial 6 rings 0.35 against partial 5's 0.325). Real bodies have local
    exceptions; what they never do is let the top ring as long as the bottom. It
    is a trend check now.
  - "every bank must be inharmonic" failed `choir`, and a sung voice really IS a
    harmonic series. choir and water are named exemptions, for physics.

GATES (both extended, both proved able to fail, then restored):
  SFX FACTORY  gates/sfx_gate.js — 135 checks. Now also: engine is v2, every
    material bank inharmonic (with the two physics exemptions named), per-partial
    decay trend, no partial outliving the fundamental, Risset's bell reproduced
    VERBATIM, three layers present, the batch not dead-centre mono, footsteps dry
    and the big moments roomy. Proof of teeth: flattened a bank back to one
    shared decay -- the exact v1 defect -- and watched it go red by name.
  SFX RENDER   gates/sfx_render_gate.py — 843 checks, now in STEREO. Each of the
    60 renders makes a sound, does not clip, is silent 60 ms past its own length,
    is not a click, has real stereo width, sits in the judgeable loudness band,
    and has not drifted from its recorded fingerprint. Determinism is measured
    RELATIVE to each sound's own peak (0.2%, -54 dB), because an absolute bar was
    measuring voice count rather than correctness.

[RESOLVED 7/30 — tileform_gate is GREEN on main, 8167 passed / 0 failed. The gate was
taught that acts beyond 1 are legal when the form says why (e0dc1a5), and the three
RUN icon forms declared acts [1,2,3] against the act-one law (8bb1588). Leaving the
original flag below because the SECOND paragraph of it is the reusable lesson: a lane
that is not the owning lane should not edit another lane's forms to make its own suite
green — it should prove the red is inherited and say so, which is exactly what happened.]

FOR THE RUN LANE, NOT MINE TO FIX: **TILE FORM is RED on main right now**, and it
was red before this ship. TF-RUN-008_resources_icon, TF-RUN-009_energy_icon and
TF-RUN-010_clout_icon all declare `acts [1,2,3]` while the act-1 law requires
[1] unless a Paolo ruling is cited. Proved pre-existing by checking out clean
origin/main and running gates/tileform_gate.py there: same three failures, none
of those files in this lane's diff. Whether those icons are act-1-only or
all-acts is the RUN lane's content call and a session that is not that lane
should not be editing their forms to make its own suite green. 162 of 163 gates
were green on this tree; that one is the exception and it is inherited.

BUILD STAMP: 7/29i - SOUNDS REMADE: STRUCK MATERIALS (MUSIC TAB).
  (7/29g was the combat lane's, same afternoon. Check the stamp before you pick
   a letter; three lanes shipped on 7/29.)

READ THIS AFTER YOU PUSH (cost this session 25 minutes of watching nothing).
GITHUB PAGES CAN SILENTLY SKIP YOUR PUSH. An earlier push today produced NO
"pages build and deployment" run at all, while three other lanes pushed in the
same window and theirs all built. The only run after it was labelled with the
PARENT commit, so there was nothing to point at proving the live site carried the
work -- and BUILD STAMP + DEPLOY VERIFY (7/20) says pushing main is not shipping
until a run whose sha CONTAINS your content concludes SUCCESS.
  THE FIX, worked in one shot: push an EMPTY commit to main. Fresh run, correctly
  labelled, success in about two minutes. If no run appears within a few minutes
  of your push, nudge it; do not sit and watch.
  ALSO: this container cannot reach paolosarn.github.io at all (403 from the
  network policy), so curl-ing the live page to read its stamp is not available.
  The Actions API is the only deploy check you have.

READ THIS BEFORE YOU RUN THE GATES. A FRESH CONTAINER HAS NO IMAGE STACK. Eight
pixel-reading gates need Pillow + numpy and without them report ModuleNotFoundError
at the END of a 700-second suite, which reads exactly like eight real failures:
    pip install -r gates/requirements.txt
bohemia_gates.py now prints a loud banner BEFORE the first gate if either is
missing. Pass/fail semantics unchanged: a gate that cannot run still FAILS.

WHAT IS PENDING PAOLO:
  1. the 60 REMADE sounds — MUSIC tab. Nothing downstream moves without it.
  2. (fleet, open since 7/27) what colour rebuilt Vegas is, in his words
  3. (fleet, open since 7/28) cars 2x3 vs the re-cook's shorter read

NEXT UNBLOCKED WORK FOR THIS LANE, in order:
  - IF VERDICTS ARE IN: process them (approve -> bank the vector + cook its
    variant set, 3-4 alternations per footstep so a walk does not machine-gun one
    sample; kill -> graveyard + post-mortem), then wire the approved events.
  - IF NOT: SOUNDS item 1, THE RUN HAS NO BEAT. The walk's BEAT=500 is a
    hardcoded constant and no tempo or beat index crosses the postMessage
    vocabulary, while combat gets full song data + HERO BEAT. This lane owns the
    plumbing, RUN consumes it. Prerequisite for footsteps landing on the grid,
    and it needs no verdict.
  - A THIRD BATCH IS NOT THE MOVE. He has rejected once and remade once; STOP
    PRODUCING says a second rejection ends the feature for the session. If v2
    misses, the honest turn is to say so and stop, not to cook v3.

NOTE FOR THE OTHER LANES: this touched the MUSIC tab and engine/bohemia_sfx.js
only. It did not touch a single song, voice or note of the music studio, and it
added no second audio engine. If your lane wants a sound, call
BOH_SFX.play(event, AC, dest) — silent until Paolo has ruled on that event, and
that is correct behaviour, not a bug.

--------------------------------------------------------------------------------
EVERYTHING BELOW IS THE OTHER LANES' LIVE STATE, CARRIED FORWARD UNTOUCHED.
--------------------------------------------------------------------------------

*** MAIN IS RED AND IT IS NOT COMBAT'S BREAK (flagged 7/29 by the combat lane) ***
gates/tileform_gate.py (new, built by another lane the same day the form law asked
for it) fails 3 of 67 forms on origin/main ITSELF, at commit 31a4d9b:
  TF-RUN-008 / 009 / 010 (the currency icons): "caption acts must be [1] (act-1
  law) unless a Paolo ruling is cited; got [1, 2, 3]"
COMBAT'S EIGHT TF-CMB FORMS PASS. Verified the failure reproduces on origin/main
with none of this lane's commits, so this lane pushed its own green work rather
than blocking on somebody else's red.
NOT FIXED BY ME ON PURPOSE: acts [1,2,3] may well be CORRECT canon -- a currency
icon plausibly exists in all three acts -- in which case the FORM needs to cite
the ruling, or the GATE is too strict. Either way that is a canon call inside
another lane's work and guessing at it is exactly what MECHANISM-MINE/
CONTENTS-PAOLO'S forbids. RUN/ART lane: this is yours, and it is currently
turning every lane's suite red.

*** THE DEAD ALPHA: I FOUND IT INDEPENDENTLY, ANOTHER LANE FIXED IT FIRST, AND
*** WHAT SURVIVES FROM MY SIDE IS THE GATE. ***
Hit it while rebasing: commit 7bf83a1 had replaced THREE LINES of the alpha --
RIG_B64, COMBAT_B64 and BAKED -- with A DUPLICATE COPY OF THE BUILDSTAMP DIV.
1.27 MB gone, shipped to main, and every line that USES those blobs still sitting
there, so the live build had a combat tab and a rig tab pointing at nothing.
The fingerprint was the second stamp div sitting exactly where the blobs had
been, which is what a stamp edit matching the wrong span leaves behind.
I repaired it locally (verbatim restore from 1399312, stray div deleted, line
counts matched to the last good alpha) and by the time I pushed, ANOTHER LANE HAD
ALREADY REPAIRED MAIN PROPERLY and shipped 7/30a with a newer RIG_B64 carrying
their real pixel-snapping work. THEIRS IS BETTER AND THEIRS WON: my repair
commits are superseded and my one-line rig CSS patch is DELETED, exactly as its
own docstring said it should be if that lane shipped their own fix.
*** WHAT DOES SURVIVE, AND IS THE POINT: THE GATE DID NOT REPORT THIS, IT
CRASHED ON IT. *** The COMBAT_B64 match was null and m[1] threw a stack trace,
which reads like a broken GATE rather than a broken BUILD. combat_lab_gate
section 0 now:
  - every blob (CITY/COMBAT/PREFAB/RIG) declared EXACTLY ONCE, plus BAKED
  - EXACTLY ONE buildstamp div, because a second one is this bug's fingerprint
  - a plain STOP message and exit(1) instead of a stack trace when the demo is gone
PROVEN against main's real broken alpha before it was fixed: it fails cleanly and
names the loss. That complements the other lane's new ALPHA-MUST-LOAD gate rather
than duplicating it -- theirs proves the page boots, mine names WHICH blob went
and refuses to pretend the rest of the run means anything without it.

COMBAT (04) 7/29 (c) - THE NEEDLE IS HIS BODY. (Paolo: "whats up. whats next.")
Built the thing I deferred last turn rather than asking a second time.

*** v102 THE DIAL IS A PICTURE OF THE TRUTH ***
Paolo: "i want their cover animation to be tied to where there deadshot dial
lands perfectly in the center. so that killshot they better be out of cover. and
when its in miss territory they are under cover."
The dial was an abstraction sitting ON TOP of the fight: the needle swept, you
pressed, a number decided, and the man was on his own timer. Now the needle IS
how exposed he is, so you stop reading a gauge and start reading a man.
*** HE IS OUT EXACTLY WHEN THE RETICLE GOES GREEN *** -- not an approximation
picked to feel right, the SAME expression that has driven the green reticle since
the dial shipped. Measured live: |angle| 0 and 0.055 (inside the 0.061 kill zone)
-> exposure 1.0; 0.175 (halfway to the 0.289 hit edge) -> 0.5; 0.433 (past it)
-> 0.0.
NOTHING WAS ANIMATED: rise112 is already baked (the body coming UP OUT OF THE
CROUCH, already used when a man gets off the deck). The needle INDEXES its 4
frames. Touches no rig, no clip, no BAKED pose, no bank -- clear of the animation
revamp in another session.
ONLY THE MAN UNDER THE DIAL ("i still like how they animate already"): verified
a second covered man's frame is identical at both ends of the sweep and his
_expo is never even set.
IT IS A READ, NOT A RULE CHANGE: verified e.gcov is unchanged across the whole
sweep, so cover/damage/exposure/AI resolve exactly as before.
THE BODY LAGS THE NEEDLE ON PURPOSE (EXPO_FOLLOW): the sweep is fast and
reverses, so mirroring it frame-for-frame would make him vibrate. A man reacting
to your aim is half a beat behind it.
TOOL: tools/bohemia_combat_dial_cover_patch.py | GATE section 36

*** I BROKE THE ENTIRE DEMO AND THE GATE DID NOT NOTICE. READ THIS. ***
The first version of v102 anchored on this line:
    if(!isChain){G._chainN=1;G._poppedOut=false;}
and inserted AFTER it. That line is the FIRST HALF OF AN IF/ELSE. The insert
orphaned the else and the whole combat demo stopped parsing -- G undefined,
nothing ran, black tab.
*** AND ALL 500+ STRING CHECKS STILL PASSED, because a string check cannot tell
the difference between valid code and rubble. *** The anchor was UNIQUE and the
anchor was WRONG, which is the exact lesson this lane already had written down
and did not apply.
SO THE GATE NOW PARSES THE DEMO. combat_lab_gate.js runs node --check over every
<script> body in COMBAT_B64. Cheapest possible catch for the most expensive class
of mistake this lane makes, and it should have existed 100 patches ago.
COMBAT GATE: 513 -> 524 (section 36 + the parse checks).

*** AND I CORRECTED MY OWN CHECK THE SAME TURN ***
I wrote a check claiming "ONE EXPRESSION, NOT TWO" and it failed, and IT WAS
RIGHT TO. There have always been TWO different multipliers here:
   fgv = what the BANDS DRAW      (difficulty, steady aim, kill streak)
   fg  = what the SHOT RESOLVES ON (all that PLUS the on-the-one bonus + groove)
That is a DESIGNED difference, not drift, and it stays. What v102 actually fixed
is that the BAND expression was an inline const the pose would have had to copy;
it is dialFgv() now, defined once, shared. Check and tool docstring both
corrected to the true claim.
ALSO RE-POINTED: the NORTH STAR AUDIT PIN ("no positional term multiplies the
player's damage or hit window") read the old inline const. It follows the
expression into dialFgv(). Invariant unchanged; it is the most important pin in
this file and it must never be allowed to quietly stop looking at anything.

STAMP NOTE: set 7/29i first, which is BEFORE another lane's 7/29k -- the letters
are a sequence and I went backwards. Then 7/29L, which the run gate rejects
(the law's shape is lowercase). Landed on 7/29m, skipping l on purpose because a
lowercase l reads as a 1 on a phone.

STILL NOT BUILT, and it is the only thing left from his last message:
*** CARS, 2 TILES BY 3 (his ruling). *** Design is written:
records/BOHEMIA_COMBAT_NEXT_TWO_DIAL_COVER_AND_CARS_7_29_26.md
First MULTI-TILE cover in the game, which is a different object: blocks a LENGTH
not a point, and the engine end hides you to the chest while the boot end hides
you to the waist -- one object, two cover values, which no block can do. The work
is that pillars are CIRCLES and a car is a RECTANGLE (about five cover/collision
functions need rectangle maths). DO THE SHOPPING CHECK FIRST: car_wreck x20 is in
STREET_PROP_POOLS but that bank is "corpus art, no new canon" and is NOT in the
approved index -- render the 20 at 2x3 and LOOK before deciding it is an art ask
at all. His 2x3 ruling must also be amended into TF-CMB-003.

COMBAT (04) 7/29 (b) - FOUR RULINGS BUILT, TWO MORE ANSWERED, TWO DELIBERATELY NOT
BUILT. Paolo sent four calls, then three more mid-turn.

*** v98 THE DARK SHRINKS THE RANGE (he approved the pitch: "i really like this
nice research lets do it") ***
NOT an accuracy penalty. A symmetric penalty changes no decision and just makes
the fight longer = the tally mistake. IT IS ONE NUMBER, and that is the elegance:
every range read in this fight already runs through distT, so shrinking the far
end moves MY dial (distPkg), THEIR hit chance (distAccuracy) AND the range
words+colour at once. *** POINT BLANK IS EXACTLY, PROVABLY UNTOUCHED: distT
subtracts PT_BLANK before dividing, so it is 0 for any d<=PT_BLANK whatever the
far end is. His 7/27 point-blank ruling gets LOUDER after dark instead of taxed.
*** Measured: a man 15 tiles out reads MID RANGE / their acc 0.67 at morning,
LONG RANGE / 0.52 at dusk, LONG RANGE / 0.37 at night. NIGHT_RANGE is a dial.

*** v98 THE ALLOWANCE IS A PERK, NOT A DIFFICULTY ***
Paolo: "the kilshot how many u get before its incredibly difficult is on a slider
unrelated to difficulty but to perks you get in the game."
v95's CHAIN_ALLOWANCE_BY_DIFF is DELETED. It comes from G.chainSkill only, and
the settings control now reads KILLSHOTS (PERK). *** THIS IS WHY MECHANISM-MINE/
CONTENTS-PAOLO'S EXISTS: the table shipped EMPTY, so his correction deleted a
WIRE and changed no gameplay. Five invented numbers would have silently
rebalanced the fight. *** The old v95 gate check was rewritten to record that.

*** v99 YOU CAN THROW A GRENADE (Paolo: "grenade first") ***
The only grenade in the game was thrown AT you. Now both directions.
*** THEY GET THE SAME TWO BEATS YOU DO. *** A man in the blast STEPS OFF THE TILE
and loses the stone he was tucked behind. That is what makes it a POSITIONING
tool instead of free damage: it FLUSHES people out of cover, pushes a shooter off
an angle, and still kills whoever cannot clear it. Costs a pip AND ends the turn
into the volley, like popping out to shoot. 2 per fight (dial). A grenade kill is
NOT a killshot: no dial cinematic, no chain -- the chain is the reward for the
DIAL, which is what keeps the allowance meaning something. Yours draws AMBER,
theirs stays RED.

*** v100 THE WAREHOUSE (Paolo: "for arena lets start off with a warehouse or
something. think about all the shit you will need to hide behind") ***
After "u have like a 4th grade level of understanding when i say arenas fr",
which was fair: what I had was a scatter of blocks, and A SCATTER HAS NO
THROUGH-LINES, so it can never make one plan better than another at any density.
A warehouse is ONE IDEA REPEATED: racking in long rows, which makes AISLES.
  ACROSS the racking you are SAFE (tall, no vault, no line)
  ALONG the aisle you are NAKED (a corridor, no lateral cover)
So the fight becomes WHICH AISLE DO I COMMIT TO AND WHERE DO I CROSS.
  RACKING tall | CROSS AISLES = the only way to change aisle = the kill zones |
  PALLETS low+vaultable IN the aisles = the only reason an aisle is survivable |
  STEEL COLUMNS on the bay grid | THE STAGING FLOOR left EMPTY on purpose (the
  shortest way across is the one with nothing on it) | THE MEZZANINE, always
  present indoors -- the FIRST TIME the v90 cross-level cover rule has paid for
  itself, because height means seeing down the rows.
MEASURED THEN TUNED: aisle 2 gave ONE-tile aisles and averaged 128 blocks (max
186) -- a corridor you cannot fight in. Aisle 3-4 gives 2-3 tile aisles, avg 100.
Rolls 50/50 with the street; the seed reproduces which kind you got.
Floor = approved concrete slab. The arena button says WAREHOUSE #nnnnn, because
an arena you cannot NAME is a field with rocks on it.

*** v101 HIT IN THE CHEST, NOT THE FEET (his reported bug) ***
Paolo: "when people are on a second story you just have the location of them
wrong when it comes to getting shot... its like their feet."
ROOT CAUSE: drawHuman blits the sprite 84px ABOVE the point it is handed, so
EVERY position in this file is a man's FEET and every ring drawn at it is on the
floor rather than on him. Always wrong; merely survivable on one floor. On a
second storey his feet are a whole storey below his body. MASS_DY=-42 is half of
drawHuman's OWN offset, so it is derived not eyeballed. Body marks moved (cover
arc, blade telegraph); GROUND marks deliberately did not (blood pool, brass).
AND THE DRIP CARRIES ITS LEVEL -- a man bleeding on the mezzanine was dripping
onto the ground floor.

*** v101 THE APPROVED STREET BANK (Paolo: "i really like the street please use
approved streets though but its looking so good") ***
The roadway was the starter set's RESIDENTIAL road while the markings came from
STREET_POOLS_HARMONIZED. Now the whole roadway is the STREET BLOCKS row of the
approved index (REAL_VEGAS R2, already wired in CITY): pools.street x8 +
pools.side x8. Road and markings finally cut from the SAME source, so they match
by construction instead of by a measurement I had to take, and 8 x the v96
quarter-turns is 32 faces instead of 12. The starter set keeps the kerb, gutter
and lot (the pieces the street bank does not carry, and whose orientation v94
measured).

GATE: combat 486 -> 513. ELEVEN older checks asserted superseded text and were
RE-POINTED AT THEIR INVARIANT, never relaxed. One of v95's checks was superseded
BY A RULING (the only legitimate way a check dies) and was rewritten to assert
what v95 got right. AND ONE OF MY OWN NEW CHECKS MATCHED A COMMENT AGAIN --
v98's comment names the dead table to explain why it is dead. Second time this
turn. The rule is now written into both: assert the DECLARATION, not the word.

*** NOT BUILT, ON PURPOSE, WITH THE DESIGN WRITTEN OUT ***
records/BOHEMIA_COMBAT_NEXT_TWO_DIAL_COVER_AND_CARS_7_29_26.md
Five things shipped this turn that he has not seen. Adding two more untested
features to that pile is the pile-up STOP PRODUCING exists to prevent.
  1. THE COVER POSE FOLLOWS THE DIAL ("so that killshot they better be out of
     cover"). Best idea in the message and nearly free: G.angle, the zone widths
     and the tuck/peek frames ALL already exist. It makes the dial a PICTURE OF
     THE TRUTH instead of a gauge drawn over the fight -- you stop reading a
     needle and start reading a man. It SELECTS existing poses, touches no rig,
     no clip, no BAKED pose, so it stays clear of the animation revamp.
  2. CARS. *** HIS RULING: A CAR IS 2 TILES BY 3 TILES. *** That is the first
     MULTI-TILE cover in the game, which is a genuinely different object: it
     blocks a LENGTH not a point, and the engine end hides you to the chest while
     the boot end hides you to the waist -- one object, two cover values, which
     no block can do. The work is that pillars are CIRCLES and a car is a
     RECTANGLE, so about five cover/collision functions need rectangle maths.
     DO THE SHOPPING CHECK FIRST: car_wreck x20 exists in STREET_PROP_POOLS but
     that bank is "corpus art, no new canon" and is NOT in the approved index --
     render the 20 at 2x3 and LOOK before deciding this is an art ask at all.
     His 2x3 ruling must also be amended into TF-CMB-003.

ART (f3eu53): 7/29 (e) LATEST (see the 7/29 c-d-e sections below) — PAOLO RULED "A". THE MASTER PALETTE IS DEAD, AND THE
TILES HE APPROVED ON 7/28 ARE FINALLY IN THE GAME.

THE RULING: asked A or B on the LIFE-tab judge card, he said **"A"** — the 7/28
re-cook (orange roofs, 150 colours). B, the 39-colour master palette, is KILLED.
Verdict: records/BOHEMIA_PALETTE_VERDICT_7_29_26.txt. Graveyard + post-mortem:
gates/bohemia_graveyard.txt, 2026-07-29.

THE THING THAT MATTERED MORE THAN THE RULING. Executing it exposed a debt owed since
7/28: he approved the re-cook that day, and **it was never wired in.** The run had
been shipping the FROZEN 7/26 set this whole time (version ..._ACT1_v1, md5
f470e7cb). The tiles he approved, and has now picked TWICE, had never once been on
his screen inside the actual run. NOTES ARE RULINGS says build it into the real
thing the same turn. Nobody did, and nothing in the machine noticed. THAT is the
class of miss worth guarding against — an approval that lands in a bank and stops.

WIRED NOW, AND WHY THAT WAS LEGAL. The starter tileset is byte-locked by
records/target/BOHEMIA_VISUAL_CONSTITUTION.json (target screen verdicted CBB 7/26;
CBB ships frozen). The constitution's OWN note names the one thing that moves it:
"changing either of these requires a NEW RULING FROM PAOLO, not a new render."
There are two — 7/28 "mark it approved", 7/29 "A" — and NEWEST DATE WINS is the
truth hierarchy, not a loophole. The constitution now points at the re-cook and
carries his words verbatim in a `ruling` field. tools/build_run_slice.js TS_PATH
moved with it. **The frozen FRAME did not move**; he verdicted that picture and it
is still the picture.
  -> This is the ONLY legitimate reason a baseline ever moves: a human ruling,
     quoted and dated. Never because the code was easier to change than the gate.

VERIFIED ON THE REAL SURFACE, not asserted: tools/bohemia_street_shot.js walks OUT
the front door (BFS over the interior's own pass grid, last step pressed ON THE
BEAT because walking into a shut door spends the press opening it) and shoots the
street — because the INTERIOR does not use the street tiles at all, so a bedroom
screenshot proves nothing about a tileset swap. records/target/STREET_NOW.png.
target_match_gate then validated 266 checks against the NEW set: the re-cook obeys
the constitution's proxies, it did not just replace them.

WHAT DIED WITH B: the bank, the designer, the applier, the A/B composer, the proof
harness, and gates/master_palette_gate.py (its own docstring said "if Paolo kills
it, this gate goes with it" — a gate guarding a corpse is rot). Unregistered from
the suite. GRAVEYARD IS FINAL: no remake, no "one more pass at cohesion", no
reviving the value-skeleton set under a new date.

WHAT SURVIVED B, because it is measurement and not art (records/BOHEMIA_MASTER_
PALETTE_7_29_26.md) and it is true of ANY future set:
  - 39.2% of approved structure pixels sit under luminance 48. Holes (doorways,
    glass, eave shadow) are their own MATERIAL, not a dark value of the wall.
  - The corpus's real per-band spreads are 106 / 93 / 110 wide, not the 52/54/52 I
    invented. "Where the corpus has it" means the SPREAD as well as the mean.
  - Measured per-family saturation: asphalt 0.20, concrete 0.35, desert 0.52,
    stucco 0.51, terracotta 0.81, deck 0.39.
  - Value carries greyscale separation; SATURATION carries the material read.

THE LESSON, and it is the third time it has been written down: **I invented a number
in a place where the set he already approved was sitting right there waiting to be
measured.** And the numbers on B were REAL — greyscale separation 6.5 -> 13.3, 150
colours -> 39, zero orphan pixels, 53 machine checks — and it lost anyway, because
what he is choosing is what the game LOOKS like and a metric is not a look. I also
wrote a FOURTH version of the applier; STOP PRODUCING names that as the tell you
already failed, and I wrote it anyway.

THE OTHER MISS WORTH COPYING: he asked "WHERE DO I SEE?" and the answer was nowhere
— I had shipped an A/B image into the chat and called that showing him. The judge
card was then built into the LIFE tab, and its FIRST version rendered two blank
rectangles (it fetch()ed the banks; Chromium blocks fetch on file://). Caught only
by driving the page in a real browser. A file that exists is not a page that works.
That card is now off the hub (answered same day; the hub is a to-do list for his
thumb, not an archive) with a named exemption in gates/name_the_tab_gate.py.

BUILD STAMP: 7/29b - YOUR TILES ARE IN THE GAME (RUN TAB). ALL GATES GREEN (462s).

WHAT IS PENDING PAOLO — none of it decidable by a session:
  1. what colour rebuilt Vegas is, in his words (open since 7/27)
  2. cars 2x3 vs the re-cook's shorter read (open since 7/28)
  3. TF-ART-017's parapet_corner duplicates TF-ART-012's parapet cap — coordinator
  4. a verifier added board row 97 in the reserved 90-99 range; may collide with the
     rows 28-37 this lane added

NEXT UNBLOCKED WORK FOR THIS LANE: the palette question is settled and the approved
set is live, which UNLOCKS VOLUME. The eighteen filled forms (records/tileforms/
TF-ART-001..018) cook against the re-cook's colours now, top of the board first.
Do NOT cook a variant of anything B touched.

--------------------------------------------------------------------------------
7/29 (c) — BOTTOM-LEFT BUTTONS UNSTACKED (CITY TAB)

Paolo, screenshot, three buttons ringed in yellow: "Fix this in the ui pls."
BUFFET ON / PLACE / TILES were on top of the hint text, running under the nav ring,
and clipping off the left edge.

SAME BUG THE TOP BAR HAD ON 7/25. Four things share that corner and every one was
absolute-positioned with its own hardcoded offset, so none knew the others existed:
#note bottom:58px (and it WRAPS, so it grows up into them), the toolbar bottom:70px
max-width:62vw, #bikebtn bottom:14px, #nav 180x180 at right:6px. Twelve pixels of
clearance against a multi-line text block, and 62vw = 242px on a 390px phone while
the ring starts at x=204. Neither number is wrong alone; they are wrong because
nothing measured them against each other.

FIX: one bottom-left flex COLUMN (#blstack), right-bounded at 196px so it can never
reach the ring, children laid out bottom-up with a gap and their offsets neutralized.
The layout does the arithmetic now. tools/bohemia_city_bottomleft_patch.py, idempotent.
It RE-ADOPTS its children every 600ms on purpose: these chips are created and
re-created by different systems, so claiming them once at boot would quietly stop
working the day one is rebuilt — which is how the offsets drifted apart to begin with.

NEW GATE: gates/bottomleft_gate.py, registered as BOTTOM-LEFT. Measures real
rectangles in a real browser at 390px (you cannot read overlap out of a stylesheet
when four systems position four elements). Holds: every chip fully on screen, no chip
on another, no chip under the ring, and all still VISIBLE so "fixed by hiding it"
fails. 21 checks. PROVED IT CAN FAIL: put the old offsets back, watched it go red on
exactly the collision in his shot (TILES on the hint text), restored.

NOTE FOR THE CITY LANE: this touched CITY-tab chrome from the ART lane because he
asked directly. CSS/DOM reflow only — no game logic, no city verbs, no art.

--------------------------------------------------------------------------------
7/29 (d) — THE BUFFET/PLACE/TILES BUTTONS ARE DEAD (CITY TAB)

Paolo, an hour after the layout fix: "I dont want those button anymore." Killed.
tools/bohemia_city_killbuffet_patch.py, idempotent. Graveyard 2026-07-29.

KILLED, NOT HIDDEN: the bar is never built and any leftover from a stale build is
torn out on sight, so there is no invisible tap target in that corner and no
off-screen node paying for layout.

THE SYSTEM BEHIND THEM IS NOW PERMANENTLY DORMANT, which is why the kill is safe:
TP already defaults to { on:false, scatter:false } and those three chips were the
ONLY way to flip either flag. With them gone the buffet cannot happen to his screen.
TP's internals were deliberately NOT ripped out - gates/city_tab_gate.js asserts that
scatter default, and that check should keep holding a real object rather than pass
because the object vanished.

READ THIS BEFORE YOU WRITE YOUR NEXT GATE. I wrote gates/bottomleft_gate.py that
morning demanding those three chips EXIST and not overlap. One message later they
were gone and the gate had to assert the exact opposite within the hour. The layout
fix was still worth having (the column protects the hint and the bike chip, which
stay), but the GATE was pointed at the wrong thing:
  -> a gate that names specific CONTENT ("these three chips exist") is betting on a
     product decision, and he is entitled to change his mind at any time.
  -> a gate that names an INVARIANT ("nothing in this corner overlaps anything else
     in it") survives him changing it.
The flipped gate is written that way now: it proves the buttons are absent and both
flags off, then measures whatever chrome is ACTUALLY down there. 9 checks. PROVED IT
CAN FAIL: resurrected the buttons, watched it go red, restored.

BUILD STAMP: 7/29d - BUFFET/PLACE/TILES BUTTONS GONE (CITY TAB). ALL GATES GREEN (667s).

--------------------------------------------------------------------------------
COMBAT (04) 7/29 - THE FIGHT STANDS ON THE REAL STREET, AND YOU CAN PUSH PAST
YOUR KILLSHOTS. (Paolo: "lets continue working on combat please", then a
five-part message mid-turn.)

*** v95 THE KILLSHOT ALLOWANCE, AND A CORRECTION I OWED HIM ***
Paolo: "i didnt notice my rule where whatever how many killshots u have after it
becomes extremely hard implemented i didnt see that."
He was right it was not built. I WAS WRONG ABOUT WHY, and the 7/27 thinking doc
(records/BOHEMIA_COMBAT_THE_KILLSHOT_ALLOWANCE_7_27_26.md) now carries the
correction at the top:
  I SAID "the chain is UNLIMITED, you shoot until you miss." FALSE - enterAim
  stopped it DEAD: if(G._chainN>wpnCap()) -> 'CHAIN SPENT', turn over. A WALL.
  I SAID "there is no per-turn shot counter anywhere in the file." FALSE -
  G._chainN has existed since v17, the read has printed "SHOT 1/2" the whole
  time, and there is a settings button KILLSHOTS/TURN cycling G.chainSkill 1-8.
  HOW: I searched for the mechanic by its ABSENCE instead of by its NAME. It was
  90% built. The missing 10% was the only part he cared about.
SO THE BUILD IS SMALL, WHICH IS WHY IT IS RIGHT: one wall came down.
  * allowance = his own KILLSHOTS/TURN dial (default 2), capped by the weapon
  * past it the shot STILL HAPPENS, at V.HARD then BOHEMIAN ("extremely hard" is
    his word, so it is extreme immediately)
  * THE RAMP IS A FLOOR: pkgDiff = max(rangeDial, rampDial). Point blank still
    pulls easier exactly as he ruled 7/27 but can never cancel the ramp, so
    closing the distance is HOW YOU AFFORD the extra shot
  * CONTENTS-PAOLO'S: CHAIN_ALLOWANCE_BY_DIFF ships [null x5]. When he names five
    numbers they go in and nothing else moves.
  * THE WEAPON CEILING IS STILL A WALL and is not ramped (physics, not
    difficulty): pistol 8, smg 2, shotgun 2, rifle 1. Pistol is the chain weapon.
  * THE READ SAYS IT, because "i didnt see that" IS the complaint: the headline
    flips to PUSHING in red, both reads say SHOT 3 OF 2 - PAST YOUR ALLOWANCE.
  TOOL: tools/bohemia_combat_killshot_allowance_patch.py | GATE section 31

*** v94/96/97 THE FIGHT STANDS ON THE APPROVED STREET (the 7/28 wiring debt) ***
Combat was THE LAST SURFACE STILL INVENTING ITS OWN GROUND: a coordinate hash, a
tone jitter, a flat rgb() per cell, plus a hand-drawn double-yellow median and
lane dashes at hardcoded world coords. It now blits the tileset Paolo approved
7/28 and picked AGAIN 7/29 - the one the RUN ships, byte-locked in the
constitution - plus the approved median/lane_div from STREET_POOLS_HARMONIZED.
*** AND IT KILLS THE ORANGE AT THE ROOT. *** The hand-painted median composited
to luminance 113 across a solid full-height bar drawn AFTER the vignette meant to
dim it. The approved median tile peaks at 94-101 on a handful of dashed pixels,
because HIS OWN markings_30yr_law was applied when it was cooked. v84C could only
FADE the object; now the object is GONE, and the gate forbids that colour being
drawn by this file at any alpha.
MEASURED BEFORE MIXING TWO BANKS (not assumed): recook road vs pool median = 2.6
luminance apart, saturation 0.14-0.16 vs 0.13-0.16. They sit together.
EVERY ROTATION MEASURED OFF THE PIXELS, none guessed: the kerb lip is a bright
band on the BOTTOM edge (146.4 vs walk_0's 117.2), the gutter shadow is on the
TOP edge (49.5 vs 61.4), the markings run HORIZONTAL (row var 4.6 vs col 2.1).
All are authored for an EW road; this street runs NS, so they turn.
TWO BUGS I FOUND BY LOOKING AT THE RENDER, BOTH MINE:
  v96 THE SIDEWALK NEVER ENDED - 'walk' was returned for every cell past the kerb
    FOREVER, so the fight happened on an infinite concrete sidewalk covering two
    thirds of the screen. Two tiles now, then the lot.
  v97 *** I BROKE PAOLO'S OWN DOMINANCE LAW. *** v96 let the per-cell hash pick
    freely from a 6-tile lot pool -> a CHECKERBOARD. The street bank carries, in
    his words: desert_dominance_law, dominant 0.85, accents "one tile per
    region", BANNED "per-cell random shuffle", source "Paolo 7/14: too much
    diversity with the desert tiles". PER-CELL RANDOM SHUFFLE IS THE ONE THING
    THE LAW NAMES AS BANNED AND IT IS EXACTLY WHAT I WROTE - and I had quoted
    that same bank's markings laws into a record the day before without applying
    the law three lines above them. Now: one hash per 4x4 region, dominant or a
    single accent, never a mix. Concrete left the pool (a slab scattered through
    dirt is a BUILT thing placed by nobody = MAP LAW).
  THIRD PASS ON THIS GROUND. If it is still wrong the next turn SAYS I STOPPED
  rather than shipping a v98 of the same surface (STOP PRODUCING).
  TOOLS: bohemia_combat_street_tiles / _street_edges / _lot_dominance _patch.py
  GATE section 30. Combat gate 469 -> 486 checks. EIGHT older checks asserted the
  superseded code and were RE-POINTED AT THEIR INVARIANT, never relaxed; two of
  my own new checks were bugs (one matched a COMMENT quoting the dead colour).

*** ANSWERED, NOT BUILT ***
records/BOHEMIA_COMBAT_ANSWERS_NIGHT_GRENADES_ARENAS_7_29_26.md
  NIGHT ACCURACY - he asked if darkness should hurt everyone's accuracy. MY
    ANSWER IS NO: a symmetric penalty changes no decision, which is the tally
    mistake again. THE VERSION THAT IS A MECHANIC: darkness shrinks RANGE, not
    accuracy - multiply the distance term in distPkg. Far shots get much worse,
    point blank is untouched, so HIS OWN point-blank ruling gets LOUDER after
    dark. And it turns LIGHT=TERRITORY into a tactical map: lit = hittable from
    across the lot, dark = they have to come to you. One multiplier, no new
    system. The size of it is [PENDING Paolo].
  GRENADES - *** YOU CANNOT THROW ANYTHING. *** The only grenade in the game is
    thrown AT you (grenadeTurn: one per encounter, 2-beat fuse, move off the tile
    or eat it). Molotovs do not exist at all. Already built and reusable: the
    fused object, the pulsing danger tile with the count, the blast ring, the
    "you moved so you dodged" resolution, and the approved fire loops that have
    no consumer. Missing: a target picker, blast damage applied to ENEMIES (today
    it only measures YOUR distance), and what a throw costs.
    RECOMMEND THE MOLOTOV FIRST: fire that STAYS is area denial, which is a
    positioning mechanic (north star), and it consumes an approved bank.
  ARENAS - "u have like a 4th grade level of understanding when i say arenas fr".
    Taken at face value. What I built is a scatter of blocks on a field with no
    place, no purpose and nothing that says Las Vegas. An arena is a PLACE whose
    SHAPE makes one plan better than another. *** I AM NOT BUILDING A FOURTH
    VERSION ON A GUESS *** - it is question 1 to him.
  COMPANIONS + SNEAKING - recorded as the lane's next direction, not started.
    Sneaking is the bigger change: today every fight opens with both sides fully
    aware and placed, the flattest possible opening. Companions: the occupancy law
    and the 120 grid already carry a second friendly body; the open question is
    whether it takes its own turn or acts on yours [PENDING Paolo]. Both are
    downstream of the arena answer.

COORDINATOR (07), 7/28 EVENING — PAOLO'S OWN PROGRESS LEDGER + THE ACCELERATORS

PAOLO'S NUMBERS, recorded verbatim as ruling-class state (records/BOHEMIA_PAOLO_
PROGRESS_LEDGER_7_28_26.md): combat 40, rig 59, music 30, clothing 25, world 15,
animations 15, quests 10 ("even though we havent made a single one yet" — text
is not a playable quest to him), NPCs 5, items 5, SOUND EFFECTS 0. Calibrate
against HIS numbers, not lane optimism. The named holes are the zeroes and fives.

ON HIS ACCELERATOR ASK, researched + routed two frictionless force multipliers
(records/BOHEMIA_RESEARCH_FRICTIONLESS_ACCELERATORS_7_28_26.md):
1. THE SFX FACTORY (CHARACTER lane, item SFX): procedural synthesis on the
   alpha's own Web Audio stack (sfxr/jsfxr lineage — a sound is ~20 synth
   parameters, no files, no asset weight). Batches per game event, ONE judge
   page; a 60-sound batch is one two-second-per-item Paolo sitting — the
   cheapest verdict pipeline in the game, against his only 0%.
2. PLAYTEST TELEMETRY (RUN 0e + SHARED reader): the run logs positions/verbs/
   fights/deaths/where-he-quit locally and exports it like the save blob; any
   chat pastes it into a reader for a path heatmap + plain-English digest.
   His playtests become the fleet's highest-truth input with zero writing
   from him. Research consensus: where-he-quit beats any survey.

Earlier 7/28 (still live): ENGINE REALITY MAP (laws/BOHEMIA_ENGINE_REALITY_MAP_
7_28_26.md, in the GO read order) + three rulings recorded (REAL combat on the
walk = extraction never rewrite; VEGAS WEATHER 3 states rain-monthly; the TILE
FORM law + board, 54 forms filed by 7 lanes day one).

--------------------------------------------------------------------------------
COORDINATOR (07), 7/29 — THE SOUNDS LANE EXISTS (Paolo: "i should just make a
didicated sounds chat"). Doctrine lane words now include "sounds" (also
answers to "sound"/"music"); lane intent added (§6); BOHEMIA_BACKLOG.md has a
## SOUNDS section whose item 0 is the GREENLIT SFX FACTORY, then run-beat
plumbing, then ambient beds. AUDIO MOVED OUT OF CHARACTER (one system one
session): the character chat is bodies/clothing/animation only now — if it has
in-flight audio work it finishes nothing new and hands off via the handoff.
Paolo opens the new chat with the single word "sounds" and it goes.
--------------------------------------------------------------------------------
7/29 (e) — HOUSE 01, BUILT TO A REAL PERSON (LIFE TAB, awaiting his thumb)

Paolo: "i think we need to make like 16 houses i approve of that will go in the
suburb slots... lets make a single house realistic to human sizing please."
This is candidate 1 of 16. NOT APPROVED. LIFE tab, top card, green border.

THE FINDING, AND IT MATTERS MORE THAN THE HOUSE. CELL_M = 0.75 m and the art cell is
44 px, so 1 px = 1.705 cm. The THREE-TILE WALL law gives a 3-cell facade and the DOOR
LAW gives a 2-cell door:
    plate  3 x 0.75 = 2.25 m   (real: 2.44 m)
    door   2 x 0.75 = 1.50 m   (real: 2.03 m)
The player sprite measures 102 px = 1.74 m. **The door is 24 cm SHORTER than the
character.** He cannot walk through his own front door standing up.
And a third tile does not save it: real door-to-plate is 2.03/2.44 = 0.83, whole
tiles only offer 2/3 = 0.67 or 3/4 = 0.75. YOU CANNOT BUILD A HUMAN-PROPORTIONED
FACADE OUT OF WHOLE 0.75 m TILES. So a house is AUTHORED AS ONE IMAGE at true scale;
only its FOOTPRINT snaps to cells so it drops in a suburb slot. The other fifteen
inherit that decision.

DIMENSIONS, ALL REAL (web-confirmed: 36x80 in door and 16x7 ft garage are the
residential standards; ranch plans average 1500-1700 sq ft):
  footprint 15.0 x 9.0 m (20 x 12 cells, 1453 sq ft) / plate 8 ft / door 36x80 in /
  garage 16x7 ft / window 4x4 ft, sill 3 ft / eave 24 in / pitch 4:12

REUSE: every colour sampled from banks/..._RECOOK_7_28_26.txt, the set he approved
and chose again. 13 colours total. The house cannot drift from its own street.

THREE ART ERRORS, ALL CAUGHT BY LOOKING AT IT, NONE BY A GATE:
  1. drew the roof at full PLAN depth (528 px) so the house was 79% roof and the
     roof read as a second wall. Cropped the house he ACTUALLY approved out of the
     re-cook frame: its roof is ~2 cells against a ~4 cell facade. Now 120 px.
  2. shaded with continuous gradients -> 426 colours of smooth airbrush. Now flat
     ramp steps only: 13 colours.
  3. sampled the roof family by frequency, got #fdfdf8 (luminance 252 — the
     sun-caught ridge glint), and filled an entire hip PLANE with it. ramp_from now
     refuses anything over the act-1 ceiling: a highlight is not a material.
  Also: hips drawn by x-position gave vertical stripes, not a hip. Real 45 diagonals
  now. And barrel tile streaks run DOWN the slope, not across it.

NEW GATE: gates/human_scale_gate.py, registered as HUMAN SCALE. Holds the ONE
invariant all sixteen inherit — A PERSON FITS THROUGH THE DOOR — plus the art
agreeing with its own metre table and with the engine's CELL_M, and no white/black.
11 checks. PROVED IT CAN FAIL: set the door to the tile grid's 1.50 m and it refused
it, "-24 cm of headroom".

The judge card renders from an INLINED image, not fetch() — the palette card shipped
blank rectangles that way earlier today. Verified by clicking through from LIFE in a
real browser: image painted, vote registers, zero horizontal overflow at 390px.

[PENDING PAOLO] he also said "im concerned we may have to double the art size of the
tiles they looking a little low quality but thats down the line." NOT ACTED ON — he
scoped it as later. Doubling the art cell 44 -> 88 px is a whole-corpus decision.

BUILD STAMP: 7/29e. ALL GATES GREEN (632s).

--------------------------------------------------------------------------------
7/29 (f) — HOUSE 01 KILLED. SHAPE STUDY IN THE LIFE TAB.

PAOLO, VERBATIM: "so this could be a fucking trailer home bro. a trailer home with
a grage? its ass lowkey. if you tride to made a trailer home it would have a garage
and the roof would be more ugly. so if its a trailer home its 75% done. i need you
to care about house shapes and shit bro. like fr. thats my verdict fo house 01"

HOUSE 01 IS DEAD. Graveyard 2026-07-29, verdict in
records/BOHEMIA_HOUSE_01_VERDICT_7_29_26.txt. Bank, judge page and sheet deleted.

HE IS RIGHT AND THE DIAGNOSIS IS EXACT. I measured everything and shaped nothing.
Every dimension was real and machine-checked and I still built a 15 x 9 m BAR with a
flat unbroken front and one continuous roof plane, which IS a trailer silhouette,
then bolted a garage on it, which a trailer does not have. The research convicts
every choice: mobile homes read as such at 2:12-3:12 with ~6 in eaves, site-built is
4:12+ with 12-16 in; and of every suburban type the ONLY one with no massing break
is the hip ranch with the garage absorbed into the main volume. That is exactly what
I drew, with the shallowest roof available.

THE REAL FAILURE IS ORDER OF OPERATIONS: I got the door right to the millimetre
before deciding what the building WAS. **Human sizing is a CONSTRAINT. Shape is the
DESIGN, and it comes first.**

AND THE THING EVERY FUTURE SESSION SHOULD TAKE FROM THIS: gates/human_scale_gate.py
was GREEN the entire time that house was a trailer. Eleven checks, all passing, on a
building he called ass. A green gate is evidence about the thing it measures and
evidence about NOTHING ELSE. Nothing in the machine had an opinion about shape,
because I had only ever taught it to care about measurements.

NOW IN THE LIFE TAB (top card, green): a 7-shape MASSING STUDY, silhouette only, no
detail to hide behind, all at true scale with the real player sprite. #1 is a real
single-wide and #2 is house 01, both on the sheet so the mistake is visible rather
than described. He picks which shapes go in the sixteen (multi-select).
  tools/bohemia_house_massing.py -> records/target/HOUSE_MASSING.png

NEW GATE: gates/house_shape_gate.py, registered as HOUSE SHAPE. The shape law, three
numbers from the research not from my taste: >=2 masses, >=4:12 pitch, >=12 in eave,
and nothing over 3.5:1 (a single-wide is 4.9:1). It carries TRAILER and HIP as its
own PERMANENT NEGATIVE TEST — the gate fails if it ever accepts the two shapes he
rejected, so the proof-it-can-fail lives inside the gate instead of in a throwaway
script. 8 checks. 5 legal shapes: L-RANCH, SNOUT, CROSS-GABLE, TWO-STORY, SPLIT.

WHAT SURVIVED THE KILL: the scale work and gates/human_scale_gate.py. 1 px = 1.705
cm, the sprite is 1.74 m, and the tile grid's 2-cell door is 1.50 m — 24 cm SHORTER
than the character. True of every future house and untouched by this verdict.

DO NOT COOK A HOUSE UNTIL HE PICKS SHAPES. He rejected once; STOP PRODUCING says a
second rejection ends the feature for the session. The next cook starts from his
picks, not from another guess.

[PENDING PAOLO] doubling the art cell 44 -> 88 px ("thats down the line").

BUILD STAMP: 7/29h (bumped past the RIG lane's 7/29g, which landed mid-rebase).

ALL MY GATES GREEN. **MAIN IS RED AND IT IS NOT MINE**, said plainly rather than
buried: gates/tileform_gate.py fails 3 of 8167 checks on TF-RUN-008/009/010 (the
currency icons, commit 31a4d9b, RUN lane) -- "caption acts must be [1] (act-1 law)
unless a Paolo ruling is cited; got [1, 2, 3]". VERIFIED PRE-EXISTING: checked out
clean origin/main in a throwaway worktree with none of my changes and got the
identical 3 failures. Not fixed here on purpose -- which ACTS a form targets is that
lane's content decision, and ONE SYSTEM ONE SESSION says I do not quietly edit
another lane's forms. **RUN lane: either drop those captions to act 1 or cite the
Paolo ruling that lets them span three acts.**

THE LANDMINE I NEARLY STEPPED ON, recorded because the WORLD lane armed a warning
about it and it saved me: slices/BOHEMIA_LIFE_CURRENT.html is now GENERATED by
tools/bohemia_life_hub.py. My hand-edit to the hub would have been silently wiped
the next time anyone regenerated. The dead HOUSE 01 card was removed and the SHAPE
card added IN THE GENERATOR; the artifact is just its output.

--------------------------------------------------------------------------------
7/29 (g) — TF-ART-001 COOKED: THE CMU BLOCK FAMILY (4 tiles). NOT IN A TAB YET.

He asked "whats up. whats next." Answer: houses are BLOCKED on his shape tap, so the
lane popped its top unblocked item — the first of the eighteen filed tile requests.

WHAT IT FIXES, from the form: every non-residential building in the valley wears the
same pale suburban stucco as the houses, so a jail, a warehouse and a family home are
the same material. Twenty-odd industrial/civic/service districts are CMU in real
Clark County and all render in house stucco today.

4 tiles: cmu_wall (plain running-bond), cmu_cap (bond beam + cast cap), cmu_pilaster,
cmu_vent (the pierced screen block that is everywhere in 60s-80s Vegas).
tools/bohemia_cmu_cook.py -> banks/BOHEMIA_CMU_BLOCK_7_29_26.txt

THE BOND IS DESIGNED FIRST, WHICH IS THE HOUSE 01 LESSON APPLIED. A real CMU is
8x16 in with a 3/8 joint = 12 px course, 24 px block, and NEITHER divides 44. So:
course 11 px (7.4 in, 4 per cell exact), block 22 px (14.8 in, 2 per cell exact).
Both within 8% of the real unit, both dividing the cell, so the wall runs any length
and height with no seam. Exact-real would have bought 0.6 in and a visible break
every four courses.

THREE THINGS I GOT WRONG AND FIXED BY LOOKING:
 1. first cook came out TAN-BROWN. The approved concrete family is warm — it belongs
    to a residential street — and a warm jail is the exact bug the form was filed
    against. Now each sampled colour keeps its VALUE and gives up its warmth, with a
    faint cool cast. Documented transform of approved colour, not a new palette.
 2. that cooling drove the darkest step to luminance 3 — PURE BLACK, act-1 law break,
    measured not guessed (the vent holes came out #010308). Floor clamped at 20 on
    the RESULT so no amount of cooling can go under.
 3. efflorescence streaks STAMPED. Laid up 6x3 the same pale streak landed in the
    same column of every cell. Thinning them just made them cluster. The truth: ONE
    tile repeated will always stamp whatever is in it, and a full-height streak is
    the most stampable mark there is. Streaks are OUT of the base tile; they belong
    on a variant, the way the corpus already carries road_0/1/2.

AND MY OWN SEAM TEST WAS WRONG BEFORE THE ART WAS. Comparing column 0 to column 43
assumes a wall repeats identically edge to edge, which running bond must not — the
lit top arris is SUPPOSED to sit above the next mortar line. A test demanding that
would fail correct art and pass graph paper. The gate now lays the tile 2x2 and
checks the pattern continues, and separately asserts the bond is RUNNING not STACK.

NEW GATE: gates/cmu_gate.py, registered as CMU BLOCK. 12 checks. Also REGISTERED THE
BANK with gates/target_match_gate.py's BANKS list, per the art-first reset's price —
a bank graded only by its own gate is grading its own homework. 279 constitution
checks pass on it.

BUILD STAMP unchanged (nothing he can see moved; the tiles are NOT IN A TAB YET).
ALL GATES GREEN (623s).

STILL BLOCKED ON HIM: the house shape picks (LIFE tab, top card). No house until then.
17 tile forms left in the queue after this one.

--------------------------------------------------------------------------------
7/29 (h) — HOUSES STOPPED. AND THE 30 APPROVED HOUSE SKINS I NEVER USED.

PAOLO, VERBATIM: "Im not gonna lie all of these looked just horrible tbh"

ALL SEVEN SHAPES KILLED. Graveyard 2026-07-29. Verdict:
records/BOHEMIA_HOUSE_SHAPES_VERDICT_7_29_26.txt.

**THIS WAS THE SECOND HOUSE REJECTION OF THE DAY, SO HOUSES ARE FINISHED FOR THIS
SESSION.** laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md. No third attempt, no
revised study, no rebuilding it "properly" — finding a legal way to ship anyway IS
the violation the law names. The next house work starts from a ruling of his.

THE FINDING, AND IT IS THE ONE THING BLOCKING EVERYTHING:

  banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt
  status CANON — Paolo verdict 7/21/26, ALL 30 UP

THIRTY PIECES OF HOUSE ART HE APPROVED EIGHT DAYS AGO: 6 shingle roofs, 2 gravel,
6 barrel-tile (terracotta / desert brown / gray brown), 4 plain stucco walls, 3 with
windows, 3 boarded, 3 with doors, 3 yards. They are GOOD — real shingle courses,
barrel pans, settlement cracks, plank shadows on the boards, stiles and rails on the
doors. Everything my two attempts lacked.

**I DREW HOUSES FROM SCRATCH TWICE WHILE THESE SAT IN THE BANK.** REUSE-FIRST broken
outright (Paolo 7/22: "check out the approved assets first before cooking").

AND THE SUBTLE PART EVERY FUTURE SESSION SHOULD READ: house 01 DID carry a reuse
check. It opened the approved street bank and sampled COLOURS from it. Sampling a
colour off approved art is NOT using approved art, and I let the cheap reading
satisfy a law that meant the expensive one. A REUSE CHECK THAT OPENS A BANK FOR ITS
PALETTE AND THEN DRAWS EVERY PIXEL ITSELF IS A REUSE CHECK IN NAME ONLY. The
reusefirst gate cannot currently tell those two apart.

STANDING QUESTION FOR PAOLO, his alone: should the sixteen houses be BUILT OUT OF HIS
THIRTY APPROVED SKINS rather than drawn new? Nothing house-shaped moves until he says.

WHAT SURVIVED: gates/house_shape_gate.py — its numbers (>=2 masses, >=4:12 pitch,
>=12 in eave, nothing over 3.5:1) came from research, not from the rejected drawings,
and would still refuse a trailer. tools/bohemia_house_massing.py survives ONLY as
that gate's spec table and is marked dead-as-art at the top of the file; its rendered
sheet and judge page are deleted.

STILL LIVE AND UNBLOCKED: 17 more filed tile forms after TF-ART-001 (the CMU block
family, shipped 7/29g and NOT IN A TAB YET).

--------------------------------------------------------------------------------
COORDINATOR (07), 7/29 — THE BIG MISSING (Paolo: "11 months of forward motion,
what are we BIG missing"). records/BOHEMIA_THE_BIG_MISSING_7_29_26.md is the
answer of record: (1) the GAME DAY loop has never run end to end (RUN's next
milestone — integration, not features), (2) the CITY-BUILDER half is lore not
gameplay [HIS DESIGN — the biggest undesigned system, yap-session agenda],
(3) the economy doesn't run (WORLD: ledger/payout mechanism ships empty),
(4) no faction system (WORLD: standing/territory skeleton ships empty),
(5) companions ruled/zero built (sequenced behind combat extraction),
(6) NPCs are bodies not people + no dialogue system, (7) the iOS save-eviction
landmine + unruled ship vehicle (RUN: cloud blob; ruling ~month 8),
(8) vehicle ladder locked/unbuilt. Plus an 11-month straw milestone map,
dates pending his blessing. Lanes: read it before inventing your next big
item — if your lane owns a listed organ, IT outranks lane-local wants.
--------------------------------------------------------------------------------
7/30 (c) — HOUSE 02: DRAWN THE WAY ISOMETRIC GAMES ACTUALLY DRAW HOUSES. LIFE TAB.

Paolo overrode the stop: "BRO WE NEED TO GET 1 house shape done bro do big brain
online research and execute WHEN IN DOUBT HOW TO OTHER ISOMETRIC PIXEL GAMES MAKES
HOUSES COPY THEM TO START OFF HOLY SHIT". His call, so houses resumed.

THE RESEARCH FOUND THE ACTUAL MISTAKE, AND IT WAS BIGGER THAN SHAPE. Both dead
houses were FLAT ELEVATIONS — the building seen face-on, one wall, like a
side-scroller. That is not what an isometric game draws:
  - "isometric projection ROTATES THE BUILDING 45 DEGREES, revealing THE ROOF AND
    MULTIPLE WALLS AT THE SAME TIME" [slynyrd pixelblog 41]
  - every diagonal is 2:1 — two pixels across per one down, 26.565 deg, technically
    dimetric. It is the only ratio that gives a clean staircase with no
    anti-aliasing. [the-pixel.art, pixnote]
  - method: floor plan on the iso grid, EXTRUDE WALLS UP, then roof; three visible
    faces each holding a flat value, because "depth comes from contrast in light
    where sharp angles meet" [tuts+, pixel parmesan]

THE GRID FALLS OUT OF THE CORPUS CELL WITH NO FUDGING: 44 px cell -> a 44x22 diamond,
exactly 2:1, one-cell cube stands 22 px, 1 m of height = 29.3 px.

TWO MASSES, BECAUSE MY OWN GATE SAID SO. The first iso draw was one box with a long
gable and read as a barn — the trailer failure again in a new projection.
house_shape_gate would have refused it. It is now an L: main bar (ridge along X) plus
a wing projecting streetward with its own gable END, garage on the bar's other face.
1302 sq ft, 5:12 pitch, 18 in eave.

REUSE, FIXED PROPERLY: every colour comes from banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_
7_21_26.txt (CANON, all 30 UP 7/21) and gates/iso_house_gate.py VERIFIES IT — every
colour in the output must exist in his bank. That is the check house 01 would have
failed: it carried a reuse check, sampled a few colours off a street tile, and drew
every pixel itself. A reuse check the machine cannot verify is a sentence.

NEW GATE: gates/iso_house_gate.py, registered as ISO HOUSE. 10 checks.

THREE BUGS FIXED BY LOOKING: windows drawn after the wing FLOATED ON THE ROOF (an
opening belongs to its mass and must be painted with it); a window placed 8.42 m
along a 7.5 m wall hung in space off the corner (iso will happily draw an opening
past the end of its own wall — check against the MASS, not the canvas); and the roof
at 6:12 over 9 m depth read as a barn because in iso the roof plane ALSO spans the
depth on screen.

*** AND A REAL SELF-INFLICTED SCARE, RECORDED SO NOBODY REPEATS IT ***
1. I ran `git stash -u`, then `cd` into a throwaway worktree, then `git stash pop`
   THERE. The pop landed in the worktree, which I then force-removed. All
   uncommitted work gone; the stash was dropped by the successful pop and fsck
   times out on this repo. REBUILT FROM SCRATCH rather than doing object
   archaeology, which was faster and deterministic. NEVER pop a stash from inside
   another worktree.
2. Worse: a one-liner `open(p,'w').write(s.replace(m.group(0), ...))` where the
   regex missed. **Python opens and TRUNCATES the file before evaluating the
   argument**, so the AttributeError left slices/BOHEMIA_ALPHA_0_9.html at ZERO
   BYTES. That is what "the CITY frame never loaded" and "the alpha has no LIFE tab"
   actually meant — I nearly chased a phantom rendering bug. Restored with
   `git checkout --`. The stamp helper now READS, CHECKS, and only then writes, with
   a size assert. Any future in-place edit of a big shipped file must do the same.
   (The stamp regex missed because another lane had rolled the date to 7/30.)

BUILD STAMP: 7/30c. ALL GATES GREEN (622s).

--------------------------------------------------------------------------------
7/30 (e) — HOUSE 02 TURNED SOUTH. Paolo: "Perfect now imagine instead of it facing
southwest it was facing south!!"

"Perfect" is a ruling on the STYLE (isometric solid, L massing, his approved skins).
The ask is the ORIENTATION. Both facings are on the LIFE tab card now.

THE HOUSE WAS NOT REDRAWN, WHICH IS THE WHOLE POINT OF HAVING BUILT IT AS A SOLID.
Same masses, same metres, same colours, same roof geometry; only the projection and
which faces are visible changed. tools/bohemia_iso_house.py takes BOH_FACING=south |
southwest and both projections live in the single P() function.
  SOUTH-WEST: the classic iso diamond, sx=(cx-cy)*22, two walls meeting at a corner.
  SOUTH:      front squared to the screen, sx=cx*44, sy=cy*11 - z. Depth still
              foreshortened 2:1 so a cube still reads as a cube and heights are
              identical between the two.

SAID PLAINLY TO HIM RATHER THAN BURIED: SOUTH COSTS SOMETHING. Squaring the front to
the screen removes the corner where two walls meet, and that corner was carrying most
of the depth read. It also puts 7.5 m of roof nearly overhead, so the main roof
becomes a big band. It is still what he asked for and it matches how the street
already renders, so it ships and he rules.

THREE THINGS THE SOUTH VIEW NEEDED THAT THE DIAMOND DID NOT:
  - side walls are EDGE-ON and must not be drawn at all (a zero-width sliver of the
    wrong value down the corner).
  - a sliver of the FAR slope above the ridge, or the ridge is just where one flat
    colour stops and the roof reads as a second wall.
  - real shingle courses plus a hard fascia line. The roof is the biggest single
    shape in this projection, so faint texture reads as a slab.

STILL HONEST WEAKNESSES on the south version, not hidden: the main roof band is tall
relative to the wall (inherent to seeing 7.5 m of roof from overhead), the main
bar's left window is partly behind the wing roof, and there is a thin stray edge line
at the far right.

BUILD STAMP: 7/30e. ALL GATES GREEN (642s). ISO HOUSE gate 10/10.

--------------------------------------------------------------------------------
COORDINATOR (07), 7/29 — BIG-MISSING WORK ASSIGNED (Paolo: "IM SURE SOME CHATS
YOU CAN ASSIGN THIS WORK TOO"). Assignments now IN the backlogs: RUN 00 = THE
GAME DAY (the lane milestone — make the organs circulate; stub ledger flagged
as stub until WORLD EC lands) + RUN 00b = durable save vs the iOS eviction
landmine. WORLD EC = the economy skeleton (ledger/payout/prices, tables ship
EMPTY, everything unruled reads NO_RULING). COMBAT already carries companions
behind the extraction. ONE NEW LANE REGISTERED: "people" (also answers
"npcs"/"factions") — dialogue system v1, NPC identity, faction standing
ledger, companion social layer; queue seeded, intent in doctrine §6. The
city-builder half gets NO lane until Paolo's design talk (records/BOHEMIA_
THE_BIG_MISSING_7_29_26.md item 2). Paolo opens the new chat with one word:
"people".
--------------------------------------------------------------------------------
7/31 (h) — HOUSE 02 SOUTH APPROVED. THE HOUSE FACTORY SHIPPED: 16 HOUSES. LIFE TAB.

PAOLO, VERBATIM: "THE SOUTH LOOKS SO FUCKING GOOD BRO!!! NICEE!!!!" — APPROVE on
house 02, south facing. Approval unlocks volume, and he asked for a big swing.

THE SWING: HOUSE 02 WAS NEVER A DRAWING. It is a solid built from parameters, which
is why it turned from south-west to south without a redraw. The same property means
it can be VARIED. So it became the factory the FACTORY LAW asks for — typed spec,
generator, batch output, one judge page, its own gate:
  tools/bohemia_house_factory.py -> banks/BOHEMIA_HOUSE_SET_16_7_31_26.txt
  slices/BOHEMIA_HOUSES16_JUDGE_7_31_26.html   (LIFE tab, top card)
  gates/house_factory_gate.py   registered as HOUSE FACTORY, 69 checks

SIXTEEN HOUSES, 854 to 1774 sq ft, all south facing, 14 DISTINCT MASSINGS: L-ranch,
mirrored L, snout, cross-gable, two-storey, split-level, double gable, deep ranch,
stepped split, big cross-gable. STRUCTURE-NOT-COLOUR is respected and MACHINE-HELD:
the gate fails if fewer than 14 distinct massings, so a recolour can never do the
work shape should.

REUSE, VERIFIED PER HOUSE: every colour of all sixteen comes from
banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt (30 skins, CANON, all UP 7/21). The
gate checks every pixel of every house against that bank rather than trusting the
docstring — the check house 01 would have failed.

THE JUDGE PAGE IS A BULK SURFACE: 16 cards, thumb each, or ALL UP / ALL DOWN and fix
the exceptions, notes box, .txt export naming KEEP / KILL / UNJUDGED. Verified by
clicking through from LIFE in a real browser at 390px: 16 cards, 16 images painted,
single thumb works, ALL UP works, zero horizontal overflow.

WHAT IS STILL HIS: which of the sixteen live. UNJUDGED IS DEAD applies — bulk silence
is a verdict, so anything he does not thumb dies rather than lingering.

BUILD STAMP: 7/31h. ALL GATES GREEN (954s).

--------------------------------------------------------------------------------
7/31 — ALL SIXTEEN HOUSES KILLED. THE BATCH IS DEAD; HOUSE 02 SOUTH IS NOT.

PAOLO: "BRO ON ALL OF THEM YOU HAVE DOORS MESHING IN WITH WINDOWS ALSO YOUR TWO
STORY HOUSES LOOK LIKE SHIT TRY AGAIN!" then "ALL OF THEM THUMBS DONW".

ALL 16 KILLED. Graveyard 2026-07-31. Verdict:
records/BOHEMIA_16_HOUSES_VERDICT_7_31_26.txt. Bank, judge page and contact sheet
deleted; card pulled from the LIFE hub GENERATOR.

**HOUSE 02 SOUTH IS STILL APPROVED** (banks/BOHEMIA_HOUSE_02_ISO_7_29_26.txt). He
approved that one alone and has not withdrawn it. What died is the SET built off it.

BOTH DEFECTS WERE REAL AND BOTH WERE MINE:
 1. The front door was placed at one offset and the windows by a SEPARATE loop, and
    nothing ever compared them. I had a bounds check for a window running past the
    END of its wall and NO check at all for a window running into another opening.
    Two independent placers on one wall collide eventually; here it was every time.
 2. A "two-storey" was a 5.3 m plate with one row of windows near the floor and a
    blank wall above. That is a warehouse. I raised a number and called it a storey
    instead of building one — a floor line and a second row of openings.

BOTH WERE FIXED IN THE GENERATOR BEFORE HIS SECOND MESSAGE LANDED. THAT DOES NOT
RESURRECT THE SET. He thumbed all sixteen down; re-showing a repaired batch is the
exact "legal way to ship anyway" STOP PRODUCING names as the violation. DO NOT
regenerate and re-surface the sixteen.

THE LESSON, AND IT IS ABOUT VOLUME: I looked at sixteen houses as a CONTACT SHEET at
330 px wide, where a door merging into a window is invisible and a blank upper storey
is invisible. Everything I verified was about the MACHINERY — sixteen cards, sixteen
images painted, thumbs work, no overflow — and NOTHING about the art. The one house
he approved got looked at closely, four times, at full size. The sixteen never did
once. **A FACTORY MULTIPLIES WHATEVER YOU DID NOT CHECK.**

NOW MACHINE-HELD (gates/house_factory_gate.py, 122 checks): no two openings on a
wall may overlap, and any mass over 4 m of plate must carry two window rows. The
generator now REPORTS the openings it actually claimed so the gate checks reality
rather than a promise. PROVED BOTH CAN FAIL: replayed the exact defects and watched
it go red naming each one.

[PENDING PAOLO] the process question: one house at a time at full size, or batches?
Batch-of-sixteen just failed, and it failed on things a single full-size look catches.

[FLAG, not mine] another lane locked BOUGHT BEATS PAINTED 7/31 ("if i bought it i
prefer it! Thats for all textures bro!!!"). House 02 and the factory use his APPROVED
PAINTED skins. If he owns house textures, that ruling likely governs houses too.
=== THE HONEST TRADE, stated because it is a real cost ===
Cells holding people went 834 -> 731 (36% -> 32%). That is the LIE being removed: farm,
storage, downtown and resort had fake residents and now have nobody. Commercial went the
other way, 683 fake residents -> 2,049 real workers.

=== GATE ===
people_gate.js part D, 11 claims, driven on the REAL run through the run's own loadCell
(added as __RUN.gotoCell so a gate can see the other 2,303 cells, not just the one the
game opens on). 90 claims total. Two mutations proved red-able: families back in the
strip mall, and workers not arriving.

=== THE SUITE WENT ALL GREEN ON THE SHIPPED TREE ===
Every gate green, 759s, on the exact tree that was pushed. The two long-running reds
(RIG CHECK, BODY VARIATION) were fixed by their own lanes while this work was in
flight - they were never this lane's. Kept below because the FLAKE note still matters.
ANSWERED FOR and SFX WIRED both went red ONCE each under full-suite load today and both
pass standalone (11/0 and 150/0, run twice each). They are heavy real-browser gates
sharing a machine with the whole suite. If you see either red once, run it alone before
believing it.

=== THE REDS AS THEY STOOD MID-FLIGHT (history, all resolved) ===
RIG CHECK      bohemia_combat_carfix_clip_aim_patch.py (COMBAT) + bohemia_headshot_
               ragdoll_exemption_patch.py (CHARACTER). Not this lane's files.
BODY VARIATION the frame cache hashes the dials (CHARACTER). 20 pass / 1 fail.
ANSWERED FOR   A FLAKE. Passes 11/0 standalone, twice, right after the suite said
               otherwise - same shape as the SFX WIRED flake earlier today. Both are
               heavy real-browser gates sharing a machine with the whole suite. If you
               see either red once, run it alone before believing it. Said out loud
               rather than quietly re-run until green.

=== WHAT COMES AFTER, in order ===
1. THE ROADS ARE EMPTY. 568 arterial + 228 freeway cells = 35% of the valley and there is
   not one person on any of them. Nobody in Bohemia is ever BETWEEN places. That is the
   next people-shaped hole and it is bigger than this one.
2. JOB_DISTRICTS IS FOUR ENTRIES (commercial/industrial/medical/solar). A FARM is
   obviously a workplace and the GDD treats farms as the food system, but adding one
   changes where every existing resident commutes - a valley-wide behaviour change owned
   by WORLD. FLAGGED, NOT TAKEN.
3. Squatting outside housing is [PENDING Paolo]. Post-collapse people really do occupy
   commercial buildings, but as squatters or a compound, never a nuclear family with
   bedrooms. The mechanism now says "no residents here"; whether a strip mall holds a
   squat is his canon and the table is empty.
4. WHO HE ALREADY KNOWS IS PARKED BY PAOLO (8/1): "Don't worry about that right now don't
   worry at all about that right now." KNOWN_AT_START stays empty. DO NOT ASK AGAIN.
5. FACTIONS ARE OFF (BUILD THE WORLD, 7/31). This lane's item 2 is dead by ruling.

RESEARCH THAT SHAPED IT: in subsistence economies ~80% of labour is subsistence
agriculture and work is home-based; separation of home and workplace is an INDUSTRIAL
phenomenon. So the right move was never to invent a workforce per district - it was to
render the small number of commuters the sim already had.

--------------------------------------------------------------------------------


--------------------------------------------------------------------------------
COORDINATOR (07), 7/31 NIGHT — LORE SITTING, FOUR RULINGS (laws/BOHEMIA_
ADDENDUM_LORE_SITTING_7_31_26.md): (1) CITY-BUILDER FEELS LIKE POCKET CITY 2,
post-apocalyptic skin — the feel contract for the missing half is RULED; the
loop (what taps cost, what the currencies buy, act tiers) continues in lore
sittings. (2) MORE CORPSES/SKELETONS — the dead become world language at real
density; WORLD files the tile forms (skeleton/mummified-husk props + decals;
look mix [PENDING his one-word pick]); corpse-collection + DECAL mechanics
already canon, reuse. (3) MARCO — first named-cast entry (neighbor + "king
hobo"; "custom faction" garbled, confirm question with Paolo, build nothing
past the name until answered). (4) THE MOB runs with the caravans — named
contender for the guarantor seat; Mob-vs-Cartel relation [PENDING]. Canon
index regenerated.

--------------------------------------------------------------------------------
COORDINATOR (07), 7/31 NIGHT (b) — MARCO CORRECTED + FACTIONS ORDERED. Paolo:
"MARCO IS NOT THE KING OF HOBOS LMAO" — the lore-sitting addendum's Marco
entry is corrected to NAME ONLY; every other word of that sentence is
unresolved garble, ask never fill. AND his order: "WE NEED TO REALLY FLESH
THE FACTIONS OUT FR MAKE ALL OF THEM AWESOME AND INTERESTING" — PEOPLE lane
item 00: THE FACTION DOSSIERS, one per faction + the Mob's caravan role,
district-theme-sheet pattern (researched proposals, one judge sheet, his
thumbs decide). He opens it with the word "factions" (routes to the PEOPLE
lane).

--------------------------------------------------------------------------------
COORDINATOR (07), 7/31 NIGHT (c) — TWO MORE RULINGS, lore sitting addendum
updated in place: MARCO IS CANON ("Marco hardcore realist and neighborly.
Happy to help." — personality locked, faction/home/look/role still his,
nothing invented). THE DEAD ARE A REALISTIC MIX ("ofc i want a realistic mix
of skeletons and husks" — skeletons in the open, mummified husks in sealed
places, DECAL layer for fresh kills; placement follows the desert's real
logic). WORLD's dead-props tile forms are UNBLOCKED; PEOPLE lane's named
cast has its first real entry.
