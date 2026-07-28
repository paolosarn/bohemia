WORLD MODEL (02): 7/28 (b) LATEST — HE RULED "HIGH SCHOOL", AND IT IS THE TEST CASE FOR
THE WHOLE REVAMP. engine/bohemia_school.js rebuilt + its icon rebaked the same turn.

HE WAS RIGHT THAT IT HAD TO SAY. A high school is not a bigger middle school, it is a
DIFFERENT BUILDING PROGRAMME, and the old module was a generic K-12 that had a PLAYGROUND
in it — an elementary-school object, simply wrong. Removed.

THE LANDMARK IS THE STADIUM (law: EVERY DISTRICT IS ITS OWN LANDMARK, 7/28). An obround
running track with the football field inside it, raked bleachers down BOTH sidelines, a
press box and four light towers. Nothing else in the valley makes that shape and it
survives shrinking to one tile, which is the two-zoom test. What else makes it a HIGH
school specifically: the STUDENT LOT with the cars still in their stalls (high schoolers
drive — the clearest programmatic tell there is), tennis courts, portable classrooms, the
marquee at the kerb, and a gym in school colours.

A RUNNING TRACK IS AN OBROUND, NOT AN ELLIPSE. Drawn as an ellipse first and the
rectangular field punched straight out through the bends — an ellipse narrows everywhere,
a real track holds full width down the whole straight, and the infield fits inside a track
for exactly that reason and no other. Found by rendering it and looking.

THE COLOUR FIX, MEASURED, AND THIS IS THE REAL RESULT OF THE TURN:
  school icon BEFORE:  3 hue families, 17.2% chromatic
  school icon AFTER:   9 hue families, 70.6% chromatic
  Pocket City 2 ref:  12 hue families, 87.5% chromatic
  our set median:      3 hue families (unchanged — only school was rebuilt)
Maroon roofs, teal gym, rust track, dead green field, blue-green courts, metal bleachers,
gold marquee — every one faded into the dead world's value bands, none of them merged into
each other. "Faded" is not the same instruction as "brown": a faded maroon is still maroon.
The school colours being the last real colour on a dead campus is also true of the real
ones. THIS IS THE PATTERN THE OTHER 35 SHOULD FOLLOW once he approves it.

A CONTAINER REWIND ATE AN HOUR AND IS WORTH KNOWING ABOUT: this session's local checkout
silently rewound to a commit from before the town/ballpark work, so four engine modules
looked DELETED and the tools regenerated against a stale tree (23 icons instead of 27, 39
districts instead of 45). Nothing was actually lost — every commit was already on
origin/main. The fix is `git fetch && git reset --hard origin/main`, then re-apply. IF
YOUR WORKING TREE LOOKS LIKE IT LOST WORK, CHECK origin/main BEFORE BELIEVING IT.
Also: tools/bohemia_district_grid_dump.js has now had its hard-coded session scratch path
regress TWICE through rebases, and its module list lost the four landmark districts the
same way. Both re-fixed, with a comment saying so — a district missing from that list
silently stops having its icon baked, so the icon law goes quiet instead of red.

=== WHAT COMES AFTER ===
BLOCKED ON PAOLO:
  1. JUDGE THE HIGH SCHOOL. It is the test case; if the hook + colour treatment is right,
     the same pattern rolls out to the other 35 from the theme sheet.
  2. How long since the collapse — still sets the damage level of all 45 at once.
DO NOT: roll the colour fix across all 36 before he judges this one. That is the four-
versions-in-a-day failure that STOP PRODUCING exists to prevent.

WORLD MODEL (02): 7/28 LATEST — HE RULED: EVERY DISTRICT IS ITS OWN LANDMARK, AND
ACT ONE ONLY. LAW: laws/BOHEMIA_ADDENDUM_EVERY_DISTRICT_IS_A_LANDMARK_7_28_26.md
Deliverable: records/BOHEMIA_DISTRICT_THEME_SHEET_7_28_26.md (36 hooks, one per type)

"each grid each district should feel like its own landmark... I need you to do a lot
better and fun, unique district themes for the types that you need diverse and fun. I
only want to act one right now so I don't want you worrying about act two"

Said in answer to the three research terms. His ruling goes FURTHER than the research
did: the term-3 finding was that we have Lynch's paths and districts but zero nodes and
zero landmarks. He is saying a landmark is not a feature you add to a district — being
one IS the district's job. If a cell can be swapped for another and nobody notices, it
failed.

FOUR THINGS ARE NOW LAW:
  1. EVERY DISTRICT CELL IS ITS OWN LANDMARK. Not some. Every one. The test: could a
     player describe this cell in five words and be understood.
  2. THE POCKET CITY 2 BAR — he named the game and said "you gotta be able to rock with
     that". Its own reviews name the standard exactly: "everything looks unique enough
     to know what it is at a glance." Same standard the squint test gives from the other
     side (~70% of a design's impact is silhouette).
  3. DIVERSE AND FUN ARE ACCEPTANCE CRITERIA, not polish. Our 36 types are 36 correct,
     interchangeable arrangements of buildings and pavement. Accurate and boring.
  4. ACT ONE ONLY. Every lane stops designing acts 2 and 3 — the triptych is canon but
     PARKED. This KILLS my own open question about act 2 being re-occupation (the Tower
     of David model) and it kills the act-2/3 material tables that sit [PENDING Paolo] on
     every district dossier. Do not surface them. Do not ask again this session.

THE REFERENCE IMAGE NEVER ARRIVED. He said "I uploaded what buildings in Pocket City 2
look like" and nothing landed on my side — checked the uploads path and the filesystem.
NOTHING WAS INVENTED TO FILL THE GAP: the bar is recorded from his words plus published
description of the game, and the image is still owed. "Rock with that" is a visual
standard and I have not seen the picture.

DELIVERED THIS TURN, NOTHING BUILT: a hook for all 36 registered types, each made of ONE
SILHOUETTE + ONE FROZEN EVENT + ONE THING YOU CAN ONLY DO HERE. Generic districts fail
because they have a programme (a school has classrooms) and no hook (a school where the
buses never came). Highlights: the waterpark's empty pools and slides to nowhere (he
called it "so fucking terrible" and it has the strongest silhouette available anywhere);
the farm as a quarter-mile CENTRE PIVOT over dead alfalfa, which is his own correction
("this is nevada nevada is in a dessert so") and factually how Nevada farms; golf as the
hard dead-green-against-live-desert boundary; the trailer park's TOWED-AWAY PADS, which
is Vegas's real foreclosure story; and the firestation's open bay doors over empty bays.
THE FIVE I PROPOSED FIRST ARE ALL SHAPE CHANGES, NOT ART CHANGES, so all five can be
built and gated before a single tile exists.

A GATE IS OWED and does not exist: the squint test — render each district icon at one
tile, threshold to black, require the silhouettes to be mutually distinguishable. Two
districts with the same black shape ARE the same district at map zoom.

=== WHAT COMES AFTER ===
BLOCKED ON PAOLO:
  1. THE POCKET CITY 2 IMAGE (owed — re-send).
  2. Which of the five hooks to build first, or all five.
  3. School: HIGH SCHOOL OR MIDDLE SCHOOL. He is right that it has to say, and it
     changes the massing.
  4. How long since the collapse — still sets the damage level of all 45 at once.
DO NOT: design act 2 or act 3 anything. Do not rebuild districts off the bulk verdict
without him naming which. Do not invent the Pocket City reference from memory.

CITY (03): 7/28 (f) LATEST — THE SKINS LANDED, THE MERGE BROKE THE RUN, AND ANOTHER
SESSION'S GATE CAUGHT MY STALE WAIVER. Final number on the block: THE CBB TILESET IS
17% OF DRAWS, DOWN FROM 83% THIS MORNING.
TWO SESSIONS HIT THE SAME BUG FROM OPPOSITE ENDS TODAY. The other one read my
measurement (tools/bohemia_run_art_source_audit.js), built gates/banks_used_gate.js off
it, and correctly did NOT pick his house art - a fourth version of the house renderer to
win a materials argument is exactly what STOP PRODUCING names. This session had been
told "do what you have to do next", so it did the skinning. Both were right; the halves
met in a rebase.
THREE THINGS TO CARRY:
1. THE REBASE BROKE THE RUN AND THE GATES CAUGHT IT IN SECONDS. Their front-path block
   and my house-skin block landed in the same region. Resolving the conflict kept both
   bodies but SWALLOWED pathSet()'s closing brace, so the entire run page failed to
   parse. run_gate and banks_used_gate both went red immediately. A conflict resolution
   that looks right is not one that is right - run the gates on the merge, always.
2. I WROTE A DUPLICATE GATE AND DELETED IT. gates/bankused_gate.js was mine, for the
   same law, at the same hour. Theirs is better (a named WAIVER TABLE, and it keeps
   DOOR_IMGS and DOOR_IMG apart - two banks one letter apart, and conflating them
   reports the live bank as dead). ENGINE SYNC LAW: one canonical body. Theirs is canon.
   WORTH KNOWING FOR ANY PARALLEL SESSION: check what just landed on main before
   building a gate for a bug you both just heard about.
3. THEIR GATE MADE ME DELETE THEIR OWN WAIVER. It fails with "delete it if not" the
   moment a waived bank starts drawing. The house skins draw now - 491 draws in its own
   sweep - so the waiver went. That is a good gate: it does not just catch the debt, it
   refuses to let the excuse outlive it.
WHY THE NUMBER FELL FURTHER THAN MY OWN 30%: their front-path change (concrete goes
somewhere now instead of being sprinkled across every lot) removed a pile of target-set
slabs at the same time.
STILL OPEN AND NOT WAIVED, because it is a LOOK call and not an unused bank: the four
roof HIP tiles are still the target set's orange against his shingle roof. Backlog 0S.
His options: tint them, cook four corner variants of his roofs, or leave it.

ART (06): 7/28 LATEST — ALL 42 TILES RE-COOKED (HE APPROVED IT), AND "NAME THE TAB"
IS NOW LAW.
Paolo, on the one-tile proof: "I checked it to do the other 41 mark it approved."
APPROVE unlocks volume, so all 42 shipped as a NEW bank
(banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt). The 7/26 bank is untouched and
still byte-locked - superseded, never overwritten. Verdict:
records/BOHEMIA_PIXEL_CRAFT_VERDICT_7_28_26.txt
  orphan pixels 73.58% -> 0.06%   |  colours in one tile 1610 -> 8
  single-use colours 28.6% -> 0%  |  colour regions/1000px 814 -> 75
ONE PALETTE PER MATERIAL FAMILY: six ramps of 5-7 steps, pooled only from the tiles that
ARE that material. Every asphalt tile in the valley is now literally the same seven
colours. That is the direct fix for the render contract's section 6 palette clause.
THREE MISTAKES CAUGHT BEFORE HE SAW THEM, all recorded in the tool: (1) authoring 17
tiles from nothing DELETED HIS DRAWING - sidewalks came back clean and EMPTY where his
originals had cracks and weeds; authoring is now only the 3 asphalt tiles he actually
looked at, everything else takes the craft operation and keeps his composition. (2) ramps
derived from CONTENT not material gave stucco three near-blacks and a 143-luminance
chasm, and put a GREEN step in terracotta. (3) per-channel stretching clipped to pure
black, which is a keyline the taste rules ban.
THE GATE FAILED MY WORK AND THE GATE WAS WRONG. LAW 7 was checked by demanding each
tile's brightness gradient point upper-left; it failed the re-cook at 29%. Ground tiles
scored 3/16 (a flat floor has no facing surface) and it failed structure tiles that were
RIGHT - wall_under_eave reads brighter downward because it IS the course in the eave's
shadow. Now checked by PAIRS: wall_end_l > wall_end_r, roof_hipBL > roof_hipBR,
roof_hipTL > roof_hipTR, wall_0 > wall_under_eave, roof_ridge > roof_slope. Proof this
was not special pleading: the OLD frozen set failed the old check just as badly (37%).
PROVEN ON THE REAL FRAME (amendment C): the frozen reassembly rebuilt with ONLY the tile
images swapped, same map, same renderer, real browser canvas.
records/target/RECOOK_FRAME_AB.png
NEW LAW, NAME THE TAB (Paolo 7/28, LOCKED): "I need you to always tell me what tab I can
find this shit in." Every reply names the TAB - RUN/CHARACTER/CLOTHES/ANIMATION/RIG/
COMBAT/MUSIC/CITY/MAP/SLICE/LIFE - never a file path, never "the judge page", and says
NOT IN A TAB YET in those exact words when it is in none. In CLAUDE.md's reply contract
and the doctrine's JUDGE THIS clause. gates/name_the_tab_gate.py (19 checks, registered)
has TEETH: every judging surface in slices/ must be reachable from the LIFE hub, because
you cannot name a tab for a thing that is not in one. It immediately caught
BOHEMIA_SUBURB_JUDGE_7_18_26.html, linked from nowhere for ten days - resolved as DEAD
under UNJUDGED-IS-DEAD rather than resurrected onto his hub.
WHERE THINGS ARE, in his language: the judge page is the FIRST CARD OF THE LIFE TAB. The
42 re-cooked tiles are NOT IN A TAB YET - built, measured, proven, invisible in game.
[PENDING Paolo] WIRE THE NEW TILES INTO THE CITY AND RUN TABS. Asked, not answered. That
crosses into two lanes that were shipping live all night, so it waits for his word AND a
clear lane - do not walk into their files mid-flight, that is how 7/26 got duplicated.
ALSO PENDING from earlier: what colour is rebuilt Vegas; cars 2x3 vs re-cook shorter.
CITY (03): 7/28 (e) LATEST — HIS 30 APPROVED HOUSE SKINS ARE ON THE HOUSES. THE CBB
TILESET WENT FROM 83% OF THE BLOCK TO 30%.
He did not pick from my three options, he said "do what you have to do next", so I took
option 1 (skin the stack, keep the massing) after checking option 3 was blocked: the
WORLD lane's own record says READ THIS BEFORE BUILDING ANY GROUND, the tile set covers
ONE residential street, and growing it is the ART lane's item. Ground is cross-lane and
freshly rejected. Houses are mine.
WHAT SHIPPED, tools/bohemia_run_houseskin_patch.py: only the FIELD tiles wear his skins
- the flat middle of a wall (wall_0/1/2), the straight roof run (roof_slope/eave/ridge)
and the open yard (yard_0/1/2). EVERY tile that carries SHAPE keeps the target set:
wall_base, wall_under_eave, wall_end_l/r, wall_window, wall_boarded, roof_hipTL/TR/BL/BR,
the whole garage, every road/kerb/concrete/walk tile. Massing kept, materials returned.
ONE SKIN PER HOUSE, seeded off the footprint (his own one_wall_per_community law applied
where it obviously belongs); yard seeded per BLOCK, matching what the CITY tab already
does with the same bank.
MEASURED, out on the block: 83% CBB tileset -> 30%. Yard skins 53%, border walls 17%.
I LOOKED AT IT THREE TIMES AND CHANGED MY MIND TWICE, which is the part worth keeping:
  v1  skinned roof_slope only -> the roof came out in STRIPES, his tile then the target's
      orange corrugated then his again. Worse than either alone.
  v2  dropped the roof entirely -> the whole roof went uniform ORANGE, because that
      orange IS the target set's roof. Leaving more of the CBB art on screen was never
      the answer.
  v3  skinned the whole straight run and kept only the HIPS -> uniform shingle roof from
      his bank, no orange, no stripes. Shipped.
  VERIFY ON THE REAL SURFACE is why this landed right; the first version would have
  shipped green and looked worse.
NEW GATE: gates/bankused_gate.js — AN APPROVED BANK THAT IS LOADED AND NEVER DRAWN IS
THE SAME AS NOT HAVING IT. It boots the real run, patches drawImage, draws frames
inside, outside, in front of a house and at a door, and counts DRAWS PER BANK. Zero
draws fails. This exact failure happened TWICE IN ONE DAY in one file (the 13 border
walls, the 30 house skins) and the build script's own check only ever asserted the banks
were PRESENT. Present-and-unused passed every gate in this repo.
FOUND AND NOT FAILED ON, stated in the gate: the run carries an OLDER static door array
DOOR_IMG reachable only through doorPick(), and doorPick() is referenced exactly once -
its own definition. Dead code from the lifted art block, superseded by the animated door
bank. Somebody should delete it.
WHAT COMES AFTER: the interior is still 35% CBB tileset, and the same skin trick has
nowhere to go there because the interior pool is already wired and already his. The real
next thing is not mine: the tile set covers ONE residential street and 44 of 45 districts
have no ground art at all. Until ART grows a tile family per district type, every look
verdict comes back the same. That is the blocker, it is named in the WORLD lane's record
too, and no amount of CITY work moves it.

CITY (03): 7/28 (d) LATEST — THE BORDER WALLS ARE APPROVED, AND I MEASURED WHY THE
REST STILL LOOKS BAD.
"walls are there now doing good im happy it still looks like shit so much of the game
but whatever"
VERDICT RECORDED: records/BOHEMIA_SUBURB_BORDER_WALL_VERDICT_7_28_26.txt. His 13 keys
are APPROVED and live in both renderers. NOTES ARE RULINGS - nobody re-thumbs or
re-cooks them. Approval settles the wall CLASS; it does NOT license a fresh batch of
wall candidates (the 7/17 post-mortem already said the pack vein is dry for
perimeter-grade walls).
THE OTHER HALF, MEASURED not guessed - tools/bohemia_run_art_source_audit.js patches
drawImage before the run boots, tags every image by the BANK it came from, and counts:
  OUT ON THE BLOCK, 330 draws:  83% THE CBB TARGET TILESET · 17% his border walls
  INSIDE THE HOUSE, 288 draws:  63% Great-Sweep interior pool · 35% CBB tileset
CBB is HIS OWN VERDICT on the target screen: could be better. He never said that art was
good, he said it was good enough to unfreeze production. Then the entire walked world
got built out of it. "so much of the game looks like shit" is an accurate description of
a world that is 83% could-be-better by area. The 17% that is not CBB is the one thing he
just said he liked.
AND THE SAME BUG AS THE WALL, ONE LAYER UP: ROOF_IMG / WALL_IMG / YARD_IMG - his THIRTY
house skins, all thumbed UP 7/21 - appear EXACTLY ONCE each in the built run: their own
definition. Decoded on load, NEVER DRAWN. The builder even asserts the banks are
PRESENT and nothing checks they are USED. Loaded-and-unused passed every gate in this
repo, for the walls until today and for the house skins right now.
DELIBERATELY NOT FIXED TONIGHT, and the reasoning is in the record: the houses go
through a designed PROJECTION (the building stack picks different tiles for base course,
eave shadow, left/right corner, garage mouth so a house reads as a mass). His house
skins are flat 44x44 textures with no corner or eave variants. Dropping them in
wholesale gives back his materials and TAKES AWAY the massing - and he had just, for the
first time all day, said something looked good. That trade is a director's call, not
mine at 3am. Three options are laid out for him in
records/BOHEMIA_RUN_ART_SOURCE_AUDIT_7_28_26.md (skin the stack / his skins flat / leave
the houses and fix the ground). None of them cooks anything: all three are his own
approved art finally being drawn.
WORLD MODEL (02): 7/27 (h) LATEST — THE BULK VERDICT CAME BACK 32 DOWN, AND MY OWN
JUDGE PAGE HAD ITS THUMB ON THE SCALE. NOTHING WAS REBUILT. READ THIS BEFORE BUILDING
ANY GROUND: records/BOHEMIA_BULK_VERDICT_ANALYSIS_7_27_26.md
Raw verdict: records/BOHEMIA_VERDICT_BULK_DISTRICTS_7_27_26.txt

10 up / 32 down / 3 unjudged of 45. "it was mostly all bad." "nothing here was perfect
all need work fr."

NOTHING IS BEING REBUILT OFF IT, and that is the correct turn, not a dodge. STOP
PRODUCING: a bulk rejection says the BAR is not met; it is not a work order for 32
rebuilds, and the turn after it names the blocker instead of shipping version two of
everything.

THEY ARE REWORK, NOT KILLS — his own words are "needs work" / "could be better" /
"needs more" / "all need work". NOTHING WENT TO THE GRAVEYARD. Getting this wrong
would have deleted most of the valley and GRAVEYARD IS FINAL, so it is stated
explicitly rather than assumed.

MY OWN TOOL BIASED THE VERDICT, and it is a law break I have to own. The bulk judge
rendered every district's plot as FLAT PALETTE COLOURS, one per tile code. That is a
schematic, not what the game draws. VERIFY ON THE REAL SURFACE (7/18) says art is
judged ONLY on the surface he sees and that a side-door probe IS A LIE — and I built
one, put 45 districts in it, and asked him to judge them, one message after shipping
it. The split this forces:
  - THE ICONS ARE REAL ART on the real render path. Every icon complaint is valid,
    no caveat, and mine to answer.
  - THE LAYOUT COMPLAINTS ARE VALID — a schematic shows layout truthfully, and
    parking / scale / what-is-where is most of what he called out.
  - "LOOKS LIKE SHIT" ON A COLOUR GRID is a fair reaction to a colour grid, and is
    not yet a verdict on how that district will look in the game.

THE ONE THING BLOCKING ALL OF IT, and it is NOT in this lane: the tile set covers ONE
RESIDENTIAL STREET, and the CITY tab does not use the tile set at all. 44 of the 45
districts have no ground art anywhere. Until a tile family exists per district type,
every look verdict on a district returns the same answer no matter how many times the
ground is redrawn. That is the ART lane's own item 1. Redrawing layouts will not move
it, and this lane must not pretend otherwise by shipping more ground.

WHAT IS REAL AND MINE, waiting on his sequencing call:
  (a) LAYOUT, no new art needed: commercial + ballpark parking (walkable-land, and
      ballpark is one he APPROVED), library scale ("the worlds biggest library wtf"),
      farm growing row crops in the Mojave ("this is nevada nevada is in a dessert"),
      interchange + rail + airfield readability, waterpark.
  (b) ICONS, real art: firestation + campus bugged, storage bad, solar wants more
      panels, commercial wants loving, courthouse wants a bigger building, cemetery
      has none at all.
  (c) HIS CALL, never invented: is the school a high school or a middle school; and
      he noted he never asked for the town district.

THE 10 THAT PASSED: suburb, apartment, town, commercial, industrial, storage, solar,
medical, cemetery, ballpark — all but suburb and apartment with "needs work" attached.
Approval unlocks volume; NO VARIANTS WERE TAKEN, because "nothing here was perfect" is
not a mandate to make more of anything.

=== WHAT COMES AFTER ===
DO NOT: start rebuilding districts off this verdict without him naming which and in
what order. That is the exact failure STOP PRODUCING was written for.
BLOCKED ON PAOLO:
  0. WHAT DO I FIX FIRST — the layout problems, or the icons? (Or neither, until the
     tile set lands.) He has not sequenced it.
  1. THE MOMENT TABLE, still the single answer that switches on the day, the economy,
     faction beats and the encounter director at once.
  2. School: high school or middle school.
  3. THE AIRFIELD ICON composition.
  4. QUEST PLACEMENT VERDICTS.

CITY (03): 7/28 (c) LATEST — HE PLAYS THE RUN. I HAD BEEN FIXING THE CITY TAB ALL DAY.
"i went on the run and the suburb border walls are not changed its still the house tiles
dumbass"
HE WAS RIGHT THREE TIMES IN A ROW AND I KEPT MEASURING A SURFACE HE WAS NOT LOOKING AT.
THE RUN IS A SEPARATE RENDERER with its own tile vocabulary. In it:
    if(c===4) return 'wall_base';        /* perimeter wall top */
and its own bodyTile() lays that SAME 'wall_base' as the bottom course of a HOUSE:
    if(a.kind==='wall'){ if(a.off===0) return 'wall_base'; ... }
So in the run the suburb border wall and the house wall were LITERALLY THE SAME TILE.
"ur using some bullshit that u made for a house wall as the subrub wall" was not an
approximation of the bug. It was the bug, stated exactly, twice, while I fixed CITY_B64.
His 13 approved border walls had never existed in the run at all - the builder lifts
DOOR_B64 / ROOF_IMG / YARD_IMG / WALL_IMG off the walk surface and the perimeter pool was
never among them.
FIXED, tools/bohemia_run_perimeterwall_patch.py: tools/build_run_slice.js now inlines
the 13 tan tiles from banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt as PERIM_B64 (same
way it already inlines the approved animated doors) and REFUSES TO BUILD if the bank is
missing or short. Code 4 draws from that pool, seeded PER PLOT (the 4x4 overmap group)
per his one_wall_per_community law, in both the main pass and the see-through pass.
GATE: gates/wallclass_gate.js covers BOTH RENDERERS now (20 checks). It asserts the run
carries and decodes all 13, has its own perimeter draw path, and that groundTile(4,...)
NO LONGER RETURNS 'wall_base'. Gating one surface and declaring the law held is exactly
how this went wrong.
THE LESSON FOR EVERY LANE, THE BIG ONE OF THE DAY: ASK WHICH SURFACE HE IS ON BEFORE
FIXING ANYTHING. The alpha has the CITY tab AND the RUN tab and they share almost no
render code. Three consecutive turns of correct diagnosis, correct fix, green gates and
a shipped build - all on the wrong renderer. A fix nobody can see is not a fix, and a
gate that only covers your surface is how you get to say "fixed" three times in a row
while he is looking at the same broken thing.

CITY (03): 7/28 (b) LATEST — NINE OF HIS THIRTEEN APPROVED SUBURB BORDER WALLS HAD
NEVER BEEN DRAWN IN THIS GAME, AND THE FOUR THAT HAD WERE BREAKING HIS OWN WRITTEN LAW.
"BRO IN THE FILES THERE IS LIKE SO MANY APPROVED SUBURBA BORDER WALLS ... SEARCH THE
SYSTEM FOR THAT SHIT"
I SEARCHED THE SYSTEM. Two files decide this and BOTH were being ignored:
  banks/BOHEMIA_WALL_PICKS_7_14_26.txt (also inside BOHEMIA_GRAPHICS_VERDICTS_MASTER,
  which calls itself "the act-1 art authority") - W26-W37 passed, 32 killed, with his
  direction attached: "85% of Vegas walls are desert yellow tan brick vibes - create tan
  versions, keep originals". Batch 2 (7/17) added WB4 out of 48. THIRTEEN approved
  suburb border walls out of 61 candidates judged.
  banks/BOHEMIA_REAL_VEGAS_VERDICTS_R2_7_14_26.txt has a `paolo_laws` block, VERBATIM:
  "one_wall_per_community": "each plot = ONE wall design (seeded per plot); variety
  BETWEEN plots; per-cell wall shuffle BANNED".
THE GAME PICKED THE WALL TILE WITH `OM.hash2(gx,gy,404)&3`. TWO violations in one
expression: the PER-CELL SHUFFLE his law names and bans, AND the `&3` capped the roll at
four (saTex does arr[variant % arr.length]) so only 4 of 13 could ever be selected.
NINE OF HIS THIRTEEN HAD NEVER APPEARED.
FIXED, tools/bohemia_city_onewall_patch.py: seeded per PLOT (the 4x4 overmap group that
makes one 128x128 BohemiaSuburb grid, the same key its layout comes from), saTex mods by
the real pool length. MEASURED across the whole valley: 11,193 wall cells, 77
communities, ZERO plots mixing designs, all 13 designs in use.
GATE: gates/wallclass_gate.js sweeps the WHOLE valley and proves both halves on top of
the class / height / bank-bytes checks.
THE CLASS OF MISS, THREE TIMES IN ONE DAY - AND THE REAL DELIVERABLE OF THIS TURN.
His rulings are NOT only in /laws. They are inside the BANKS, in fields nothing read:
a bank's own `law` field said "wall height min 2 tiles" for ten days while the wall lay
flat; a `paolo_laws` block said "per-cell wall shuffle BANNED" while the game shuffled
per cell; the same expression hid nine walls. /laws has BOHEMIA_CANON_INDEX and a pile
of gates. The BANKS had NOTHING, and a rule inside a 2MB JSON blob is invisible to a
human AND to every gate, so it may as well not exist.
  tools/bohemia_bank_law_index.py sweeps every bank and record for law / paolo_law(s) /
  ruling / paolo_direction / status at any JSON depth and writes
  records/BOHEMIA_BANK_LAW_INDEX.md - 35 rulings across 24 files, ONE readable page.
  gates/banklaw_gate.py (registered) fails if the index is stale, so a new bank cannot
  land a ruling that never reaches the page, and byte-checks five rulings verified by
  hand this turn.
BEFORE TOUCHING ANY ART PATH: READ records/BOHEMIA_BANK_LAW_INDEX.md.
STILL UNGATED, NAMED OUT LOUD: `gates_touch_streets` ("entrances must align with the
adjacent street network; entrance segment = suburb road type") and `gated_is_rich`
("most Vegas communities are walled but NOT gated; gates = boujee/richer") are
generator-level rules with no machine of their own. Somebody should build them.

ART (05): 7/27 LATEST — I WENT TO SCHOOL AND THE HOMEWORK CAME BACK ABOUT US:
OUR ART IS NOT PIXEL ART, AND IT IS MEASURABLE.
Paolo: "learn the skillset of actualy pixel shit pixel assets and yeah go to school for
me for a couple turns and learn some laws brother." So I did, wrote the laws down with
their sources, then pointed them at our own banks.
THE SENTENCE THAT EXPLAINS EVERY REJECTION SINCE 7/26, from the literature on why
machine-made pixel art looks wrong: "AI learned what pixel art looks like, but never
learned what pixel art IS... they generate a normal image in a pixel-ish style and
shrink it down, which leaves you with blurry edges, stray colors." Paolo said
"hallucinated AI slop" on 7/26 from his eyes alone. He was textbook correct and I spent
that whole day fixing the symptoms he pointed at one at a time - the door, the garage,
the barrel, the lamp - while the disease went unnamed.
THE NUMBERS, on our own FROZEN act-1 starter set: 73.6% ORPHAN PIXELS on average (a
pixel touching nothing of its own colour - the craft calls these "responsible for the
image looking noisy and confusing"), 99.6% on concrete_0, up to 1610 COLOURS in one
44x44 tile, 814 colour regions per 1000px, and only 14 of 38 tiles agree with our OWN
upper-left key. Every pixel of our roads and sidewalks is a lone speck of a unique
colour. The one thing we pass clean: block size 1 everywhere, authored at the real cell.
Picture: records/target/PIXEL_CRAFT_PROOF.png (tile on top, its orphan pixels in red
underneath - real pixel art is nearly black down there, ours is nearly solid red).
LAWS: laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md - 12 laws, every one carrying its source,
mine marked [DERIVED]. The most useful sentence found all night, from Slynyrd:
"in pixel art, uniformity takes priority over realism" - which retroactively justifies
the whole proportion canon.
GATE: gates/pixel_craft_gate.py, 14 checks, registered. tools/bohemia_pixel_craft_audit.py
measures six laws a machine can honestly measure. It says in its own comment the two
things it will NEVER do: overrule a verdict, or judge whether art looks good
(amendment B stands - the gestalt is Paolo's forever).
NOT RE-COOKED, ON PURPOSE. The set is byte-locked by his CBB verdict, STOP PRODUCING is
in force, and "finding a legal way to ship anyway IS the violation." Frozen set gets a
ratchet against its own baseline; the real craft thresholds bind every bank registered
from here on. Re-cooking the starter set is the ONE question this turn asks him.
RESEARCH HONESTY, and the gate enforces it: this environment's network policy 403s every
direct page fetch, so the laws are built from search summaries of the primary sources,
not from reading them end to end. PIXEL LOGIC (Michael Azzi) is the standard book on this
and I could not open it - buying it is BOHEMIA_BACKLOG ART -1c, not something to fake.
NEXT: everything else in this lane sits DOWNSTREAM of the re-cook question. Growing the
tile set to a family per district type just makes more of the thing he keeps rejecting.
Do not start it before he rules.

WORLD MODEL (02): 7/27 (g) LATEST — HE RULED, AND THEN ASKED FOR A PLACE TO RULE FROM.

THE RULING, recorded the same turn under NOTES ARE RULINGS:
records/BOHEMIA_VERDICT_TOWN_BALLPARK_7_27_26.txt. Paolo on the town and the ballpark
and both their icons: "that decent ... its decent i like it its decent". APPROVED
(decent) — all four. Read it honestly: a pass, not a rave. Not a KILL, not a CBB,
nobody builds a v2 off it, and approval unlocks variants for both (not taken — the
order below came in the same breath and the order comes first).

THE ORDER: "is there anyway i can comment and judge all ur work in bulk and
individually". That is a complaint about the VERDICT SURFACE, and it was fair. The
judge pages were one-subject and scattered, nothing put a district's GROUND next to
its ICON, nothing could clear forty items in one gesture, and most were reachable only
if you already knew the filename. A verdict cost him a hunt per item — which is
exactly how STALE UNJUDGED IS DEAD eats a lane's work.

SHIPPED: slices/BOHEMIA_BULK_JUDGE_7_27_26.html (tools/bohemia_bulk_judge.py).
All 45 districts, one row each: THE PLOT YOU WALK beside THE CITY ICON, because they
are supposed to read as the same place (his own 7/24 "damn near the same") and that is
only judgeable when they are next to each other. Per row: thumbs + a comment box. Per
category: ALL UP / ALL DOWN. Global: ALL UP / ALL DOWN / CLEAR, a live up/down/left
counter, and NEEDS A LOOK which hides everything already judged so a second pass shows
only what is left. SUN MODE, global comment box, EXPORT .txt (never .json).
AND IT IS REACHABLE — a card at the top of the LIFE hub. An unlinked judge page is the
same bug as no judge page; that is the whole complaint.

COOKS NOTHING (REUSE-FIRST): the plates render from the EXISTING district grid dump
(the same canonical generate() output the game walks) and the icons are read verbatim
out of the EXISTING hero bank. It is a viewer over two things that already shipped.

FOUND WHILE DOING IT: tools/bohemia_district_grid_dump.js never listed SUBURB or
SUBSTATION, two real DISTGEN types — so every consumer of that dump has been blind to
the single most common district in the valley. Added. (gated + estate legitimately
share the suburb generator, so one plate covers all three.)

VERIFIED ON THE REAL SURFACE, not by reading the code: booted the LIFE hub at 390x844,
tapped the card, landed on the page, 72 plates loaded, then exercised bulk ALL UP,
NEEDS A LOOK, CLEAR, an individual thumb, toggling that same thumb back off, a per-row
comment and EXPORT — and read the exported .txt back to confirm the comment rode it.
Zero console errors.

=== WHAT COMES AFTER ===
BLOCKED ON PAOLO — 1 is unchanged and still the biggest unlock by a distance:
  1. THE MOMENT TABLE. The one answer that switches on the day clock, the economy,
     faction beats AND the encounter director at once. All four wired and empty.
  2. THE AIRFIELD ICON composition (drop the runway, show terminal + one big plane?).
  3. QUEST PLACEMENT VERDICTS — 21 quests still land on 13 cells.
  4. ACT-2 / ACT-3 materials, and whether terrain gets a city icon at all.
NEW AND WORTH DOING NEXT, off his own complaint: there is still NO JUMP-TO-DISTRICT in
the builder, so finding a specific cell (town is X12 Y88) means panning a 96x96 map by
hand. He was asked whether he wants one; if he says yes it is small and it kills the
last "go find it" in this lane.
UNBLOCKED AND NEXT: the last 44 buildable landmark cells — basin 8, convention 6,
datafort 6, prison 4, dam 4, reservoir 3, reclaim 2, plus eleven single-cell landmarks.
Same method, two at a time, each with its icon the same turn.
ICON DEBT: 18 of the 45 plated districts still owe an icon — and now he can SEE which,
because the bulk judge prints NO ICON YET in the slot where the icon should be.

CITY (03): 7/28 (a) LATEST — THE SUBURB WALL HE PICKED WAS LYING ON THE FLOOR, AT A
QUARTER OF ITS RESOLUTION. "i literally spent hours 2 weeks ago planning the best walls
for the suburb walls and ur using some bullshit that u made for a house wall as the
subrub wall ... look in the poject files"
I LOOKED IN THE PROJECT FILES AND THEY BACK HIM UP.
  laws/BOHEMIA_ADDENDUM_WALL_TAXONOMY_7_17_26.md - "the walls of suburb communities,
  different than like building wall". TWO classes that NEVER share a pool.
  banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt - 13 keys, and its OWN law field says
  "WALL HEIGHT MIN 2 TILES".
  records/BOHEMIA_WALL_PICKS_BATCH2_VERDICTS_7_17_26.txt - batch 2 was 48 candidates and
  exactly ONE survived; batch 1 took 12. That is the hours: 61 judged, 13 kept.
THE POOL WAS ALREADY WIRED (the 7/21 patch) and the suburb wall has never actually been
drawn with house-wall art. TWO OTHER THINGS WERE WRONG and together they are exactly why
it read as a house wall:
  1. IT WAS ONE FLAT CELL. Code 4 was `{c.s, c.walk:false}` with no face, so the baker
     drew it lying on the ground. Its bank has said MIN 2 TILES since 7/14 and NOTHING
     EVER CHECKED. Then 7/27 gave house facades three tiles of height - so the only
     thing standing up in a suburb was the HOUSE wall.
  2. HIS ART WAS RESAMPLED TWICE. The 7/21 wiring shrank every 44x44 approved tile to
     16x16 with a LANCZOS filter to match the old TPX=16; the 7/26 pixel fix then moved
     TPX to 22, so those already-blurred tiles got blown back up x1.375. Two resamples,
     one smoothing, on the one asset he hand-picked out of 61.
FIXED, tools/bohemia_city_wallstands_patch.py: code 4 joins the facade pass with its OWN
pool and OWN height - `perimeter`, never hwall, TWO tiles (the bank's minimum, and
correctly SHORTER than the 3-tile house wall; a Vegas block wall is ~6ft, a house eave
~10ft). The 13 tan tiles are re-embedded at native 44x44 - the bank's own bytes - which
against the zoom ladder [11,22,44,88] is exactly x0.25/x0.5/x1/x2. Wall height became a
per-cell property (c.wallH), because "how tall is this wall" always belonged to the wall.
GATE: gates/wallclass_gate.js, registered. Finds a REAL perimeter cell in a REAL suburb
and asserts the CLASS (perimeter pool, never a building pool), the HEIGHT (>=2 and less
than the house wall), that all 13 keys are embedded, and that the embedded bytes ARE THE
BANK'S BYTES so a future shrink cannot slip through.
THE LESSON, and it is the one worth carrying: this law had a bank, a law file AND two
verdict records, and it still drifted for ten days, because nothing in the machine read
any of them. When he says "look in the project files" the answer is almost always there
and almost always has no gate on it. Before touching any art path, read its bank's own
`law` field - the perimeter bank stated its own height rule and that rule was the bug.

CITY (03): 7/27 (e) LATEST — THE RUN GETS COMBAT'S MOVEMENT UI: YOUR FACE, EIGHT
DIRECTIONS, AND THE WHOLE SCREEN BACK.
"on the run should be using the same movement ui s the combat shit ... dont present me
nothing until i see the portrait and the 8 cardinal directions button ... where its the
arrows taking up half the screen is dog shit man"
WHAT WAS THERE: a #ctl bar welded to the bottom - a full-width 52px action button and
four 74x52 arrows under it. The part that actually hurt is that the bar was a flex
SIBLING of the stage, not an overlay: it did not float over the world, it SHRANK the
canvas. Measured, 390x844 viewport: the run's world canvas was 390x602. He was playing
the game in what the buttons left over. It is 390x795 now.
THE ANSWER WAS ALREADY IN THE REPO TWICE, exactly as he said: COMBAT's buildMoveRing
(8 round buttons on angles -90/-45/0/45/90/135/180/-135 at radius 66 around the fire
button) and the CITY tab's #nav (that ring grown up: eight 42px buttons around an 80px
circle holding the player's portrait; its own comment says "mirrors combat's corner
portrait"). This is that cluster, third surface. NOT a new design.
EIGHT, not four: the run's movement already SPOKE 8 - dirOf() has always returned
SE/NE/SW/NW and DIRS8 was sitting right there; only the BUTTONS were four. A diagonal is
refused when both orthogonal neighbours are solid, so you cannot squeeze between two
building corners into a sealed yard. Turning diagonals on means owning that rule.
bu/bd/bl/br KEEP their ids so run_gate.js keeps tapping the same buttons; its whole
end-to-end walk still proves the run (120 checks green).
THE PORTRAIT is CAST.portraits.you, the baked player face the parent alpha already sends
over the cast bridge and the dialogue sheet already draws for speakers. Nothing
generated. VERIFIED IN THE ALPHA, not standalone (standalone has no cast): 4096/4096
opaque pixels in the centre canvas with the RUN tab open in the real build.
GATE: gates/navcluster_gate.js, registered. It requires the portrait to be REALLY DRAWN
- it reads the pixels and fails an empty canvas, because "dont present me nothing until
i see the portrait" is not satisfied by an element that exists and draws nothing. It
also measures the canvas share of the viewport (>=85%), asserts #ctl cannot come back,
and asserts COMBAT and CITY still have the clusters this was copied from.
NOTE FOR WHOEVER TOUCHES THE RUN NEXT: the run's interior camera is off-centre - the
house is drawn low-right with a big void above it. That is PRE-EXISTING, confirmed by
screenshotting the previous build side by side; my change did not cause it and I did not
fix it. It is worth fixing.
EDIT THE SOURCE, NOT THE BUILD: slices/BOHEMIA_RUN_SLICE_7_26_26.html is the source and
slices/BOHEMIA_RUN_CURRENT.html is generated by `node tools/build_run_slice.js`. The
gate now checks that the built page carries what the source says, so editing one without
rebuilding fails loudly instead of silently shipping the old UI.

WORLD MODEL (02): 7/27 (f) LATEST — THE TOWN AND THE BALLPARK. Two more landmark
types built as real kit districts, each with its city builder icon the same turn.
Valley 97.0% -> 97.2%. Gate LANDMARKS 52 -> 107 checks.
Full record: records/BOHEMIA_TOWN_AND_BALLPARK_7_27_26.md

THE TOWN IS A BLOCK, NOT A MAIN STREET. The first version of it had every correct PART
— one wide main street, angle parking, a wall of attached false-front storefronts, a
boardwalk, back alleys, houses, a water tower — and it was a BARCODE. Five full-height
stripes running unbroken from the top of the plot to the bottom, all in the same brown.
Found by rendering it to a PNG and looking at it, which is the only way that class of
defect is ever found. THE LESSON GENERALISES: a town's structure is not its main street,
it is its BLOCK, and a block is what you get when CROSS STREETS cut the row. A main
street with no junction is a corridor. Three cross streets, unit widths that vary so no
two neighbours match, anchors on corners. Also fixed, all render-only: everything was
one brown (it separates by MATERIAL now — masonry warm, timber houses grey, dirt pale);
the boardwalk was invisible; and the fallen town sign spanned the whole carriageway and
sealed the town in half, stranding 34% of the drive network north of it. It fell, it did
not become a wall.

THE BALLPARK IS A WEDGE, NOT A RING. A stadium is a closed ring around a rectangle; a
ballpark is a quarter circle opening away from ONE corner. Get that wrong and this
district is the stadium district with a different name, so the gate measures it rather
than asserting it (the field's centre of mass must sit well up-plot of home plate).
THE COORDINATE SYSTEM IS THE WHOLE DESIGN, and it is the reusable idea here: not x and
y but `a` (how far ALONG a foul line you are) and `q` (how DEEP into foul territory).
Both are the 45-degree rotation of (dx,dy), and once you have them the bowl is three
bands of depth — foul dirt, seats, concourse — that wrap behind the plate and run down
both lines on their own. The first version used RADIUS from home plate and it could not
work: a ring behind the plate is a ring, so the seating came out as two disconnected
side wings with a hole where the backstop belongs. Depth is q down the lines and RADIUS
behind the plate, and the two agree exactly where a = 0, so it is straight along the
baselines and CURVES round the backstop; pure q gave a pointed chevron, a grey arrowhead.

FOUR REAL BUGS, every one found by measuring or by looking:
  1. G.rect takes (x0, y0, x1, y1) and I was passing (x0, x1, y0, y1). SYSTEMATIC,
     across both new districts. The town's back alleys never drew and its houses were
     mis-shaped; the ballpark's dugouts and bullpens never drew at all.
  2. The bullpens were axis-aligned rectangles drawn straight THROUGH the lot ring,
     which severed the parking from the entrance (driveReach 0.76 against a 0.85 bar)
     and merged them into the grandstand blob — 2 footprints where there should be 5.
     Dugouts and bullpens live in FOUL TERRITORY parallel to the baselines, which is
     only expressible in (a, q).
  3. Foul territory was laid as one solid dirt apron and the whole park read as a brown
     blob. It is grass now; only the circle round home plate and the strip in front of
     the stands are skinned, which is what a real park is.
  4. The lot was a barcode as well — stripes every sixth row edge to edge. Blocks with
     cross aisles and a clear entrance drive now.
Final: driveReach 1.00 on all six orientations, 5 footprints, content 49% vs pavement 46%.

THE ICONS, both shipped with their ground per the 7/27 icon law. THE BALLPARK'S IS
DRAWN FROM BEHIND HOME PLATE and that is not a stylistic choice: put the plate at the
front and the grandstand stands between the viewer and the entire park. Home at the back
corner means the foul lines run along the two ground axes — so the infield square
renders as a true DIAMOND in the 45-degree view for free, the real geometry rather than
a drawn shape. Two iterations after that, both by baking and looking: the bowl wrapped
270 degrees and read as a closed ring, i.e. as the STADIUM icon (200 degrees now,
stopping short of each foul line, the same reason the walkable stands stop down the
lines); and the outfield wall was as tall as the stands, so wall + bowl read as one ring
(a low fence now, which is what an outfield wall is).

WIRED, not just built: both are real DISTGEN districts (town -> residential, ballpark ->
leisure), so they carry territory, economy, spawn tiers and quest addresses like any
other. Tilespec dossiers, CITY IN_ZONE (the zone-patch tool is general and idempotent
now instead of hard-coded to two names), phone slice, map tab, placement judge, current
slice and run slice all rebuilt. ALSO FIXED: bohemia_district_grid_dump.js had its
scratch path hard-coded to a DEAD SESSION's private directory — the same defect already
fixed in the hero factory yesterday. Portable now. Worth a sweep across tools/.

=== WHAT COMES AFTER ===
BLOCKED ON PAOLO, in the order they unblock the most — UNCHANGED, and 1 and 2 are the
same two answers as the last three turns:
  1. THE MOMENT TABLE. Still the single answer that switches on the day, the economy,
     faction beats AND the encounter director at once. Everything is wired and empty.
     RUN declared SLEEP=8 / HANGOUT=1 / EAT unpriced on its side.
  2. THE AIRFIELD ICON composition (drop the runway, show the terminal and one big plane?).
  3. QUEST PLACEMENT VERDICTS — 21 quests still land on 13 cells.
  4. ACT-2 / ACT-3 materials, and whether terrain gets a city icon at all.
UNBLOCKED AND NEXT: the last 44 buildable landmark cells — basin 8, convention 6,
datafort 6, prison 4, dam 4, reservoir 3, reclaim 2, plus eleven single-cell landmarks
(granary, fort, springs, radio, minigp, arsenal, gypsum, pumpstation, intake, quarry).
Same method, two at a time, each with its icon the same turn.
ICON DEBT: 22 of 48 registered types (gate ICON prints it every run; town and ballpark
arrived WITH icons, so the two new types added none of it).
DO NOT: touch quests beyond READING where they already resolve (WORLD-BEFORE-QUESTS,
narrowed 7/27 for pins only); auto-generate strip/resort/casino/luxor/sphere/strat/
highroller/sign; or wire faction beats to anything without an explicit beat predicate.

CITY (03): 7/27 (d) LATEST — THREE TILES TALL, AND THE WALL GETS OUT OF YOUR WAY
WHEN IT IS HIDING YOU. His ruling, now law:
laws/BOHEMIA_ADDENDUM_THREE_TILE_WALL_7_27_26.md
"every wall supporting a door should be three tiles tall you know that's what I'm
trying to tell you like this game needs to focus on like working on an opacity filter
for when I'm in front of a wall or something you know like not good enough by any
means"
TWO ASKS, ONE MECHANISM, WHICH IS WHY THEY ARRIVED IN ONE BREATH. A wall only gets
height by LEAVING THE BAKED CHUNK: three tiles tall means drawing into the two cells
above, which belong to other rows and sometimes to other chunks. And the opacity depends
on where he is standing THIS FRAME, which a bake by definition cannot know. So facades
left the bake and became a live pass. Anyone who tries to do either of these in the
chunk baker will fail; that is why they are one law.
THE DRAW ORDER IS THE FEATURE: baked ground+roofs -> facades BEHIND him at full opacity
(so a building he stands south of covers its own roof) -> the player -> facades IN FRONT
of him last, dropped to 35% only where they overlap his sprite. Only that wall, only
while it covers him.
THE THREE TILES: door = wall on top + the DOOR filling the bottom two (DOOR LAW, the
real ~2m-door-in-a-3m-wall proportion). window/boarded = wall, the opening in the
MIDDLE, wall at the base - a window belongs up the wall, not lying on the ground where
it used to be. plain = wall three times.
THE TALL DOOR IS NOT STRETCHED. The approved door tile is 16x16 and the slot is one
cell by two, which as a single draw is an aspect change - exactly what the MOBILE
RENDER CONTRACT bans and render_pixel_gate measures. It is DERIVED ONCE into a cached
16x32 canvas and blitted 1:1 forever after. One stretch, in a cache, never in a frame.
A law does not get to break another law to implement itself.
GATE: gates/wallheight_gate.js patches drawImage before boot and renders TWO real
frames - one with him behind a door, one walked clear of every facade - and reads back
destination size AND ALPHA, which a normal draw audit cannot see. It asserts the fade
FIRES in the first and DOES NOT FIRE in the second, because only checking that it turns
on would pass a filter that never turns off.
NO PIXEL WAS COOKED. Every tile is his own 7/21 house verdict, all 30 UP. "Not good
enough by any means" was said about the RESULT; the result is taller and see-through
now, and the materials are unchanged and still his to rule on.
LOOKED AT IT ON THE REAL SURFACE before shipping (VERIFY ON THE REAL SURFACE, 7/18):
the wall reads as a tan stucco band with windows in it under the roof mass, and standing
at a front door you can see yourself straight through the wall.

ART (04): 7/27 LATEST — WE FINALLY WEIGHED THE GAME, AND THE WEIGHT IS NOT
WHERE THE LAW WAS LOOKING.
The mobile render contract I wrote on 7/26 had exactly one clause marked UNMET in my
own handwriting: memory. "NOT YET INSTRUMENTED. No session has measured live canvas
bytes on a real device." The next ART item is multiplying the tile set from one
residential street to a family per district type - the thing that SPENDS that budget.
You measure the budget before you multiply the spender. So this went AHEAD of the tile
set, deliberately; that reordering is stated plainly rather than dressed up as the
plan, and it was the right unattended job: this lane's own logged debt, no other lane's
files, no behaviour changed. It reads.
THE INSTRUMENT, tools/bohemia_canvas_memory_probe.js: drives the three shipped surfaces
in a real browser at iPhone portrait and counts what the tab actually holds - every
canvas at w*h*4 in EVERY FRAME (the alpha's heaviest modules are iframes; a main-frame
count reports the biggest thing in the game as weighing nothing), every decoded image at
natural size, and the JS heap over CDP after a FORCED COLLECTION (otherwise a leak and
an uncollected nursery look identical). WeakRef-tracked, so a cache that works reads as
a number that stops climbing.
THE CLAUSE HOLDS: 480 steps across the valley grew the picture by 0.0 MB. The WORLD
lane's bounded plot LRU does exactly what it was built to do.
WHAT IT FOUND INSTEAD: the ALPHA holds 2604 LIVE CANVASES once every tab is open (2217
in the shell, 188 mapFrame, 193 runFrame, ~21KB each - which is precisely why nobody
noticed) plus ~46MB of JS heap at load, because the art arrives as base64 and lives as
JS pixel arrays, never as an image or a canvas. ~98MB resident = 44% of the 224MB iOS
floor. Real headroom today; both are the kind of thing that goes fine-to-fatal in one
feature. HANDED OVER, NOT TOUCHED (one system, one session): BOHEMIA_BACKLOG CHARACTER
1c. Note the neighbour: the CITY lane's canvas_scale_audit measures how canvases are
DISPLAYED; this measures how many EXIST. Different sweeps, no overlap.
GATE: gates/canvas_memory_gate.py, 31 checks, registered. Ratchets 120MB resident /
75MB pixels / 2MB streaming growth, and it fails if the contract ever goes back to
claiming it is uninstrumented or a number loses its desktop caveat. It says in its own
comment what it does NOT do: it reads a recorded measurement rather than launching a
browser, because a 3-minute probe inside the suite every lane runs on every ship is a
tax that gets a gate deleted. Staleness hard-fails on ONE hash - the starter tile set's,
the thing this clause warns will multiply.
FOUR GREEN LIES KILLED ON THE WAY, all of which would have passed: (1) 480 arrow keys
pressed into a bedroom wall, "memory did not grow"; (2) eleven tab clicks that all hit
the TAP TO ENTER splash, whole build "0.8 MB"; (3) greedy door-steering that only worked
on the floorplan that existed that hour (now BFS over the interior's own pass grid);
(4) the last step never landing because walking into a shut door opens it and returns
without moving - doors animate on the beat, so the probe now presses on the beat. The
record carries proof the walk reached the street and every tab opened; no proof, no pass.
LIMIT, and it travels with every number: headless desktop Chromium, NOT an iPhone. Pixel
arithmetic transfers, the heap and the compositor's copies do not. It proves the SHAPE
of the curve, which is what kills a phone. A real-device number still needs a real device.
NOTHING TO JUDGE - no art was cooked, no pixel changed. Records:
records/BOHEMIA_MEMORY_MEASURED_7_27_26.md + records/target/BOHEMIA_CANVAS_MEMORY.json.
NEXT IN THIS LANE, in order: (1) grow the tile set past one residential street - a
family per district type, all sharing the act treatment (the AoE model), re-running the
probe when it lands because that is the hash the gate hard-fails on; (2) the CITY tab
still does not use the tile set, so the map view and the street view will drift apart
until it does. Both are heavy cooking and STOP PRODUCING is in force - nothing gets
surfaced for judgement unasked.

CITY (03): 7/27 (c) LATEST — "THE DOOR SUCK" WAS A DICE ROLL, AND THE PLOT ALREADY
KNEW WHERE THE DOOR WENT. Full diagnosis, with every number:
records/BOHEMIA_SUBURB_DIAGNOSIS_7_27_26.md
He gave ONE instruction inside a pile of rejections - "you really should be using the
suburb district" - so I answered that instruction and touched nothing he rejected.
THE PLUMBING IS FINE, which had to be checked first. The suburb district IS used at
full canon scale: a 4x4 group of overmap cells maps to one 128x128 BohemiaSuburb grid,
sliced 1:1, no downsampling. A real cell reads back 554 dead-ground / 268 house / 96
road / 80 garage / 14 upper / 12 driveway. The generator's plot is intact. Worth
knowing for the feel: ONE overmap cell is 1/16th of a neighborhood, 24m across, so a
drop-in puts you inside about two houses' worth of a plot authored as a whole walled
subdivision.
FIXED - THE DOOR WAS A PER-TILE HASH. Every exposed house tile rolled its facade: 60%
wall, 20% window, 10% boarded, 10% DOOR. Measured on 24 real suburb cells: 727 exposed
fronts, 62 doors, one every twelve tiles, down every wall on every side, and 643 of
those fronts face a dead-dirt backyard with NO PATH TO THEM. A house does not have six
front doors. The generator marks its driveway apron (3) and its street (1) in its own
legend and nobody asked it. The door now goes where the house meets one of those, one
per approach (a driveway run is 3-4 wide, only the leftmost tile takes it). After, same
24 cells: 17 doors, 17 reachable, 0 on dirt. The generic-district path had the same roll
and it was worse - those dossiers already declare doors as PORTAL tiles you step
through, so a painted door there is a door that LIES; it paints none now. NO PIXEL WAS
COOKED: it places Paolo's own 7/21-approved tiles correctly. Gate: frontdoor_gate.js,
measured on the running surface. city_tab_gate's old byte-lock on the hash string was
replaced with a lock on the property that matters.
NOT FIXED ON PURPOSE - HE REJECTED THESE AND A REJECTION ENDS THE THING (STOP PRODUCING
rule 3). (a) The red-brick read is his OWN approved art - I checked whether hroof had
been mis-wired with wall textures and it has NOT; it holds exactly the 14 he thumbed UP
(roof_shingle_0-5, roof_gravel_6-7, roof_stile_21-26). A seamless tile has no ridge, no
slope, no shadow, which is why a roof reads as wallpaper, but the material is his.
(b) The facade is drawn ONE tile tall while DOOR LAW says two - the interiors obey it
and interiors_gate byte-locks it, the exteriors do not, so inside and outside disagree
about the same law. (c) 54% of a suburb cell is dead-dirt yard drawn as one flat noise.
All three are BOHEMIA_BACKLOG CITY 0F, pending him.
THE ONE THING TO ASK HIM: 17 doors over 24 cells means most homes are entered through
the GARAGE (whose own dossier says it has a door into the house), because that is where
the plot's walkable approach goes. Real for a Vegas tract house - or he wants a front
door on every home. Do not decide it.
FOR THE WORLD LANE (not touched, ONE SYSTEM ONE SESSION): 4 cells of 7,649 are SEALED,
you can drop in and never walk out - 88,1 solar, 92,8 estate, 92,39 suburb, 5,53 gypsum.
Belongs with landlocked_gate.js. BOHEMIA_BACKLOG CITY 0G.

CITY (03): 7/27 (b) LATEST — "I CAN'T GET OUTSIDE THE SUBURB" AND "I'M TRYING TO
COPY AND PASTE THE ARROW OF MOVE" ARE THE SAME BUG, AND IT WAS THE PHONE.
He played on his phone and said both in one message. Movement here is press-and-HOLD
on an arrow button. iOS Safari's default answer to a long press on text is the
selection magnifier and the Copy / Look Up / Search callout. The entire 33MB alpha
contained ZERO occurrences of -webkit-touch-callout, and the shell's reset stopped at
-webkit-tap-highlight-color and never set user-select at all. Holding the d-pad opened
the OS menu instead of walking. He was fighting the operating system for every step.
MEASURED, which clears the level design of the charge he made: every suburb sample sits
16-50 steps from a different district, and 7,645 of 7,649 built cells can be walked out
of (4 sealed cells remain, filed). He was not trapped by the map. He was trapped by the
button.
FIXED, tools/bohemia_touch_guard_patch.py: shell reset gets user-select:none +
-webkit-touch-callout:none with selection given BACK to input/textarea (copy/paste is
correct in a text field and wrong on a d-pad); city, combat and rig frames each get the
callout suppressed. Deliberately NOT touch-action:none at shell level - the character
and clothes panels are real scrolling lists.
GATE: gates/touch_guard_gate.js, registered. It says out loud which half it can
measure: Chromium does not implement -webkit-touch-callout (drops it from computed
style AND strips it from cssText), so the callout is asserted in SOURCE on the
universal selector while user-select is MEASURED in a real browser on the tab bar, the
walk d-pad and the DROP IN button, plus proof text fields still paste.
ALSO FIXED, AND IT WAS MY OWN: the render ratchet was FLAKY. render_pixel_gate swung
3.4% -> 12.4% on an unchanged tree because the --walk sample still contained the frames
rendered BEFORE the drop-in, i.e. the city-builder overview, whose iso projection is
fractional by design and is approved. The audit now zeroes its counters once the player
is on foot, so it measures ONE surface. On that surface, after the 7/27a screen-filter
fix: fractional 0.0%, non-integer 0.0%, squashed 0.0%, smoothed 0.0% across 7,874 real
draws. Ceilings re-based to 0.5% each and `smoothed` is now gated too, which was
impossible while the overview polluted the sample.
RECORDED, NOT ACTIONED - STOP PRODUCING IS IN FORCE. In the same message he rejected
the HOUSES, the DOORS and the GARAGE, and asked whether the house is even built from
the approved target art. NOBODY makes a v2 of any of those until he asks. His one
actual direction was "you really should be using the suburb district"; the walked world
already reads BohemiaSuburb's own legend (realizeCell's m.sub path), so the gap is
between the suburb dossier and what renders - DIAGNOSE before touching a pixel. That,
plus "the street that I didn't say you could go" (a MAP LAW complaint needing him to
point at which street) and "the phone system isn't in here, doesn't progress as I walk",
are BOHEMIA_BACKLOG CITY 0B / 0C / 0D, all blocked on him.

CITY (03): 7/27 (a) LATEST — THE PHONE WAS BLURRING THE ENTIRE WORLD ON THE WAY
TO THE SCREEN, AND NOTHING IN THE MACHINE COULD SEE IT.
Yesterday's fix made the world blit 1:1 INSIDE the canvas (TPX 16 -> 22, whole-pixel
camera). Correct, measured, shipped. The browser then undid it, one step later, where
no instrument was looking: #cv in the city frame never set image-rendering, so it took
the default `auto` = SMOOTH, and the finished 378-wide backing store was BILINEAR
UPSCALED x3 onto the phone's glass on every single frame. Not one tile in this game has
ever reached Paolo's eye at the sharpness it was painted at. Reading render code could
never have found it: the game finishes drawing correctly and the damage happens
afterwards, in the compositor.
Second defect on the same element: the stage box measures 764.61 CSS px tall while
clientHeight rounds to 765, so the whole world was ALSO squeezed x0.9995 - invisible as
a squash, a guaranteed resample of every row, and enough to deny the compositor a clean
integer scale even after the filter was fixed.
FIXED, tools/bohemia_city_screenfilter_patch.py:
  fit()    sizes the CSS box in explicit px to equal the backing store. Ratio exactly 1,
           so the phone's remaining job is a pure integer x3.
  render() sets the filter PER MODE. Walked world -> pixelated (it is pixel art at 22px
           per cell; 3 device pixels per art pixel, sharp). Builder overview -> `auto`,
           LEFT ALONE: those draws are 13:1 minifications of district heroes where
           nearest samples 1 pixel in 13 and aliases into noise, and it is a surface
           Paolo already likes. The city frame has zero fillText, so no label got
           chunkier.
THE INSTRUMENT, because this class of bug is only ever found by measuring:
tools/bohemia_canvas_scale_audit.js boots the real alpha at iPhone-portrait DPR 3, walks
every tab, and reads each canvas's CSS box and GLASS scale against its backing store.
The glass number is the one that matters - a CSS ratio of x0.5 looks clean until you
remember the phone is 3x and it is really x1.5.
GATE: gates/canvas_scale_gate.js, registered in the suite (slow, ~53s). It locks the
city canvas BOTH DIRECTIONS - box === backing, walked world nearest, AND overview still
smooth - so a later "fix all the canvases" sweep cannot wreck the surface he likes.
HANDED OVER, NOT TOUCHED: the same sweep measured the CHARACTER lane and every one of
its surfaces is displayed at a fractional scale - charCv x3.2035 (the big one), the
clothes previews, the 8-frame anim gallery at x0.766 (dropping ~23% of every row on the
gallery the anims are JUDGED from), and the rig frame's canvas, the only canvas in the
game with no image-rendering at all. Numbers and fixes are written into BOHEMIA_BACKLOG
under CHARACTER item 1b. ONE SYSTEM ONE SESSION: the gate prints them every run and
deliberately does not fail on them.
ALSO FIXED (mechanical, cross-lane): gates/run_gate.js asserted /BUILD 7\/26/ - a
hardcoded DATE, so it passed all of 7/26 and then failed every session on 7/27 for no
reason but the calendar. It now checks the SHAPE the ship law asks for (date-letter +
headline).
STILL PENDING PAOLO, do not decide it for him: #modeFace, the 64x64 player portrait in
the 80x80 nav button, is a lumpy x1.25 - with nearest, some pixels of a FACE are one
screen pixel wide and some are two. Every fix changes what that button looks like.
Options are in BOHEMIA_BACKLOG CITY item 0c.

LAB (09): 7/28 (p) LATEST — CLAUSE 17: THE STEP CLOCK IS NOT THE DAY CLOCK, AND HE HAD TO
CORRECT ME FOR BLURRING THEM. READ THIS BEFORE SIZING ANY BUFF IN THIS GAME.
Paolo: "I'm glad you have that math, but that's just if you were walking now you have to
understand a lot of things in this game. Will take up time and time will pass just by taking
actions in this game and you really need to understand that sort of clock when you think
about how long you get lifted up for your camp and shit. Its just just the amount of steps
the buff makes you feel good for"
WHAT I GOT WRONG: clause 16's arithmetic is right, and he said so. What I did with it was
not. I wrote "9,216 steps = 9 hours of walking" and let that stand as if it described how
much of the player's DAY the buff covers. It does not. It describes a player who does nothing
but walk, AND NO SUCH PLAYER EXISTS IN THIS GAME — the day is eaten by looting, talking,
fighting, camping, treating a wound, sleeping.
THE TWO CLOCKS, FORMALLY SEPARATE (laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md cl. 17):
  THE BUFF burns on STEPS. Not time, not actions, not standing still, not sleeping.
  THE DAY  burns on EVERY ACTION, walking included. It only moves when you act.
THE CONSEQUENCE THAT MATTERS FOR SIZING: a rest worth 9,216 steps is NOT "most of a day".
Spend the afternoon in a motel and the evening at a companion's place and the day rolls over
while the buff barely moves. A SINGLE REST CAN SPAN SEVERAL IN-GAME DAYS. That makes the camp
buff STRONGER in practice than its step number looks, and it is what to hold in mind when he
sets the final numbers. It also makes clause 2 LOAD-BEARING rather than elegant: a buff that
burned on time would punish a player for playing the game.
FORBIDDEN FROM NOW ON, ANY LANE: presenting a step count as a duration of PLAY without the
"if you only walked" caveat; sizing a buff by asking "how much of a day is this" (unknowable
at design time — size it in STEPS and in crossings, his unit); any buff that ticks on the
clock instead of on steps.
ON THE PAGE: the crossing line now says "12 h IF YOU DID NOTHING BUT WALK"; the buff reads
"8,516 STEPS LEFT ... STEPS ONLY — actions cost the day, never the buff" and no longer
converts itself to hours; the HUD splits the day into TIME WALKING vs TIME DOING THINGS
(a real playthrough reads "0h 41m walking · 12h 30m doing things" with the buff still at
69%); and a deliberately UNNAMED "SPEND AN HOUR ON SOMETHING" button eats an hour of day and
zero buff, so the gap is playable instead of described.
GATE: gates/camp_dial_gate.js, 138 checks, new C-series. Mutation-tested: making the buff
tick on time reds C2 and C6 plus three more. The alpha was not touched.

LAB (09): 7/27 (o) LATEST — THE LAST OPEN NUMBER IS CALLED, AND HERE IS WHAT COMES NEXT.
Paolo: "Do what you think is best. Do what you have to do next and know what comes after."
THE CALL (mine, under his delegation, reversible by one word): **75% IS THE DRESSED CAMP.**
A bare tent is 60% of a Vegas crossing, each thing you carried and set down adds 5%, and the
full kit of three brings it to exactly 75% = 9,216 steps = his number. Reasons, third being
decisive: (1) otherwise comfort is decoration, and comfort is the mechanism he said he was in
love with; (2) it makes clause 1 mean something — the camp is mobile so "what did I carry" is
supposed to be a decision, and it only is if the kit earns the crossing; (3) IT PROTECTS HIS
OWN TARGET AT THE TOP OF THE RANGE — he aimed at "you must stop once to cross the city", and
if 75% were the BARE camp then a dressed one would reach 90% and nearly cross, weakening the
exact thing he aimed at. Now even the best camp in the game is 3,072 steps short. Gate S5-S8
pin all of it. Recorded in the law under "CALLED ON HIS DELEGATION".

WHAT COMES NEXT, IN ORDER, AND WHAT EACH ONE WAITS ON:
1. HIS PLAYTEST OF THE CAMP DIAL. Nothing else can move the camp forward — the mechanisms
   are built and gate-locked, and the remaining numbers are all feel calls. This is the only
   item with nothing blocking it on my side.
2. THE PORT, WHEN HE SAYS PORT. laws/BOHEMIA_ADDENDUM_LAB_PORTS_ON_HIS_WORD_7_26_26.md: the
   camp mechanism goes to engine/ as its own module with its own gate, tables EMPTY, and the
   OWNING lane wires it (LIFE/SOCIAL for the camp itself, WORLD for the act shelter density).
   An approve on a reference is not an order to build the real system. DO NOT PRE-EMPT THIS.
3. THE CONTENT HE STILL OWNS, and none of it is invented: the pool's name and whether it is
   literally one number (clause a); what each camp action costs in supply (c); whether max
   health moves at all (d); the exact stamina numbers (e); the real camp item list (g) — the
   five on the page are placeholders and say so; how many friendly shelters per act and what
   they are called (k); the meal buff's size (l); and the BLOOD-LOSS POLICY (m), where my
   recommendation is option 2 and it is written up in
   records/BOHEMIA_BLOOD_LOSS_OPTIONS_7_27_26.md.
4. THE LAB'S NEXT TARGET, only if he names one. The research dossier
   (records/lab/BOHEMIA_LAB_RESEARCH_CANDIDATES_7_26_26.md) ranks CATACLYSM: DDA faction
   camps #1 because it is the only open-source game that answers the ACTION COST table, which
   is still [PENDING] from the TIME IS SPENT BY ACTIONS law. LOOT IS A CLOSED SUBJECT — two
   kills, no third attempt, per laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md.

LAB (09): 7/27 (n) LATEST — THE SCALE IS SETTLED. ACROSS VEGAS IS 12,288 STEPS AND ONE
REST IS 75% OF IT. Paolo asked "how many steps would it take in our scale of game to walk
across Vegas" and ruled in the same line: "you need one rest to walk across 75% of Las
Vegas." laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md clause 16.
THE NUMBERS, ALL FROM OUR OWN FILES — if you need the valley's scale, take it from here and
do not re-derive it:
  96 cells across      engine/bohemia_overmap.js:20  OVER_N=96
  128 tiles per cell   engine/bohemia_world.js:613   var T = 128
  0.75 m per tile      engine/bohemia_overmap.js:20  CELL_M, the SLOT SCALE LAW
  = 12,288 STEPS ACROSS THE VALLEY (cross-checked: laws/BOHEMIA_GDD_v5.md:37 says the fine
    layer is 12288x12288), = 9,216 m = 9.2 km
  = a step is 3.52 SECONDS and a crossing is 12 HOURS, because clause 3 says a day is
    across AND back (86,400 / 24,576)
  = HIS REST IS 9,216 STEPS = 6.9 km = 9 HOURS OF WALKING
AND THE DESIGN LANDS EXACTLY WHERE HE AIMED IT: you cannot quite cross Las Vegas on one
rest. You are 3,072 steps short and you have to stop once. The gate proves both halves
(S8: a bare rest falls exactly 3,072 short; S9: a slept camp makes it).
THE UNIT CHANGED AND THAT IS THE DURABLE PART: a rest is a PERCENT OF A CROSSING
(REST_PCT, default 75), never an absolute tile count, so it survives a rescale of the map.
A MISTAKE I OWNED IN THE LAW RATHER THAN PATCHING QUIETLY: the earlier dial page had
REST_TILES capped at 120 and TILE_MINUTES at 18 — both calibrated to that page's toy test
map, and 18 min/step is 300x too slow at real scale. Clause 16 records it as what it was.
The clock dial is now SEC_PER_100_STEPS = 352 so 3.52 stays exact with whole-number dials.
GATE: gates/camp_dial_gate.js, 127 checks. Mutation-tested: an 80-cell valley reds six
checks, quietly moving his 75 to 50 reds five.
[PENDING Paolo] and it is the ONLY thing still open about the rest number: IS 75% THE BARE
CAMP OR A DRESSED ONE? The page treats it as bare and adds comfort on top (three things =
90%). One dial apart, and nobody picks it for him.
The alpha was not touched, so the build stamp did not change.

LAB (09): 7/27 (m) LATEST — THE CAMP LAW GAINED FIVE MORE CLAUSES: TIME, THE ACT CURVE,
COMBINED BUFFS, AND HIS BLOOD-LOSS QUESTION ANSWERED.
laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md now has an AMENDED THE SAME DAY section
with clauses 11-15, his words verbatim. READ IT BEFORE ANY SURVIVAL, TIME, ACT-PACING OR
COMPANION WORK.
  * 11. SETTING UP CAMP COSTS TIME. That cost is what makes camping a decision.
  * 12. EVERY CAMP BUTTON SPENDS IN-GAME TIME, "REASONABLE AMOUNTS". SO THERE ARE TWO
    CLOCKS NOW AND THEY ARE NOT THE SAME ONE: buff duration burns in TILES (clause 2),
    camp actions move the WORLD'S CLOCK. Standing still still burns neither. Do not
    collapse these two into one timer.
  * 13. THE ACT SCARCITY CURVE — the FIRST ruled mechanical difference between the three
    acts. ACT 1: almost no friendly shelter, one homie's house you have to HOOF IT to, so
    the mobile camp is needed most. ACT 2: a little more. ACT 3: hotels and hangouts where
    you can just hang out. The camp is an ACT-1 tool that BECOMES OPTIONAL, and the curve
    is SHELTER DENSITY, not a nerf. WORLD/CITY lanes: this means friendly locations are an
    act-scaled content axis, and the same three camp verbs must work inside them.
  * 14. THE CAMP BUFF AND THE EATING BUFF COMBINE — eating is its own stacking buff in the
    shape Valheim's food had, but out of the ONE POOL, measured in TILES, tiny magnitudes.
  * 15. HE ASKED ME A QUESTION: "if we get shot in combat do we always need to prevent
    blood loss? like after every dungeon or raider or enemy faction area we clear". He is
    naming the CHORE RISK. Answered in writing with all three options playable:
    records/BOHEMIA_BLOOD_LOSS_OPTIONS_7_27_26.md. 0 ALWAYS / 1 SELF-LIMITING / 2 ONLY
    SERIOUS. MY RECOMMENDATION IS 2, because his own clause 6 says ignoring the camp must
    stay playable and a mandatory bleed makes it compulsory through the back door. STILL
    [PENDING Paolo] — nobody picks it for him, including the COMBAT lane.
  * AND HE PARKED THE NUMBERS HIMSELF: "IM NOT SURE HOW MANY TILES YOU WALK OR HOW MUCH
    INGAME TIME PASSES BEFORE THE BUFFS RUN OUT THOUGH WELL WORK MORE ON THAT!" No tile
    count and no time cost may harden into a default while that sentence stands.
ON THE PAGE: a clock in the HUD (day + hour), setup and every action moving it, an ACT dial
that changes shelter density live (1 -> 3 -> 6 places), hotels and a homie's house you walk
INTO for free comfort and no setup, the meal buff stacking with the camp buff and both
burning in tiles, BLEED_POLICY switchable while you play. The walking clock is DERIVED FROM
HIS OWN SCALE RULING and shows its working: across the map and back is a day, so 80 tiles x
18 min = 24 h, and TILE_MINUTES is a dial. 13 new dials, 31 total, each carrying its clause.
GATE: gates/camp_dial_gate.js, 112 checks (was 75), mutation-tested three ways — free setup,
a non-stacking meal, and policy 2 letting ordinary bleeds through each red exactly the right
check. The alpha was not touched, so the build stamp did not change.

LAB (09): 7/27 (l) LATEST — HE APPROVED THE VALHEIM CAMP AND REWROTE IT IN THE SAME
BREATH. BOHEMIA'S SURVIVAL SYSTEM IS NOW RULED. "awesome so i am in love with the mobile
camp idea... i liked this valheim shit alot."
LAW: laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md (LOCKED, 10 clauses, his words
verbatim). VERDICT: records/BOHEMIA_LAB_VALHEIM_VERDICT_7_27_26.txt. READ THE LAW BEFORE
TOUCHING ANY SURVIVAL, FOOD, STAMINA OR COMPANION WORK. The short form:
  * THE CAMP IS MOBILE — carried and set down, never a fixed base.
  * THE TIMER IS TILES MOVED, NOT SECONDS. "it would be on a timer it would be set for how
    many tiles you move and shit." A buff may NOT burn while the player stands still. This
    is the mate to TIME IS SPENT BY ACTIONS and the biggest departure from Valheim.
  * ONE CLUMPED POOL. NO FOOD ITEMS, NO FOOD CRAFTING, NO RECIPES. "water, food, and build
    shit are clumped into one category essentially... loot in the world would add to that."
    This also settles the shape of loot-law clause (a): very few kinds, and this one is a
    clump rather than a shopping list.
  * THE REWARD IS HEALTH REGEN, STAMINA REGEN, MORE STAMINA POINTS.
  * THE NUMBERS ARE TINY — ROGUE FABLE IV REGISTER. "plus 1 or 2 or 3 stamina points type
    shit." Valheim's 25 -> 148 health is explicitly OUT and no Bohemia system may inherit
    it. If a survival number in this repo is bigger than about 20, it is wrong.
  * IGNORING THE CAMP STAYS PLAYABLE — "if people dont want to give a fuck about that its
    okay too." Weaker, never blocked. Nothing survival may become mandatory.
  * THE CAMP IS THE MEDICAL STATION: bandage, gauze, and A COMPANION PULLS A BULLET OUT OF
    YOU. That is the FIRST RULED MECHANICAL JOB A COMPANION HAS — CHARACTER/COMBAT lanes
    should know it exists.
  * CHILL, and SLEEP as a separate bigger option. COMFORT approved, ported to tiles.
PLAYABLE IN HIS RULESET: slices/lab/BOHEMIA_LAB_MOBILE_CAMP_DIAL_7_27_26.html — walk in
tiles, set the camp down anywhere, dress it from what you carried, chill or sleep, eat out
of the one pool, take a test wound and get patched (nothing on the page deals damage: NO
DAMAGE BEFORE THE DIAL). He said twice he is unsure about two things ("idk about how it
impacts hp points", "im not super sure on the food crafting system"), so EVERY VALUE HE DID
NOT SET IS A DIAL — 18 of them on their own tab, each carrying the law clause it answers
and why it exists. MAX_HP_MOVES defaults to OFF, because "idk" is not a ruling.
GATE: gates/camp_dial_gate.js, 75 checks, registered in the suite as CAMP DIAL. It asserts
the law on the real surface: standing still for 20,000 frames burns ZERO tiles of buff; one
pool with no food table anywhere; the stamina bonus cannot be dialled past +3; a bullet
cannot be dug out alone and CAN be with a companion; 120 tiles walked having never camped
leaves you unblocked; and every pending value must be reachable as a dial, because a default
he never saw is an invented ruling.
STILL [PENDING Paolo], addendum clauses (a)-(g): the pool's name and whether it is literally
one number; tiles per rest and per comfort level; what each camp action costs; whether max
health moves at all; the exact stamina numbers; what limits how much camp you can carry; and
the real camp item list (the five on the page are placeholders and say so).
NOTHING WAS PORTED. An approve on a reference is not an order to build the real system, and
the alpha was not touched, so the build stamp did not change.

LAB (09): 7/27 (k) LATEST — VALHEIM'S COMFORT LOOP, AND THE MACHINE LEARNED WHAT A
"MODEL" IS. He commissioned this one by name: "Next emulation, whole mechanics: VALHEIM'S
COMFORT LOOP... I play it and then rule Bohemia's survival system off the feel, not off a
document." slices/lab/BOHEMIA_LAB_VALHEIM_COMFORT_7_27_26.html
THE THREE MECHANICS HE NAMED, playable in one small world (meadow camp, forest to forage
in, freezing mountain with a cairn at the top):
  FOOD    three slots; each adds max health AND max stamina for tens of minutes; the bonus
          SHRINKS as the food burns so your ceiling sags instead of an alarm going off; the
          fourth food is refused; top-up only below half. An empty stomach is 25 health —
          weak, alive, never fatal. That is his clause (1) exactly.
  RESTED  20 s standing at the fire UNDER A ROOF, then +50% health regen and +100% stamina
          regen. It travels with you, and it re-grants free while you are in your own camp.
  COMFORT the one worth stealing: comfort = 1 + the HIGHEST item in each CATEGORY within
          10 m, and that number IS how many minutes Rested lasts (480 s + 60 s per level).
          A rug is a minute. A SECOND rug is nothing, because only the best item per
          category counts — which is what makes a room want variety instead of ten rugs.
          The HUD reads "comfort 9 = 16 min rested" while you place furniture.
THE FIRST **MODEL** ROW IN THE LAB, AND IT IS A NEW KIND OF DELIVERABLE. Valheim ships a
compiled Unity DLL. Every decompiled-source repo probed came back 404 (all four are listed
in the teardown) and the wikis are 403 at this environment's network gateway. So the
numbers are DOCUMENTED, not read off a line — EXCEPT two that are real source, lifted from
ValheimPlus's Harmony patches which name the vanilla values they overwrite: the 10 m
comfort radius (BuildingConfiguration.cs:9) and the 60 s per comfort level
(PlayerConfiguration.cs:11). The mod source also names the real API surface —
SE_Rested.m_TTLPerComfortLevel, SE_Rested.GetNearbyComfortPieces, Player.EatFood,
SharedData.m_food / m_foodStamina / m_foodBurnTime.
GATE CLAUSE 7 (new, gates/lab_gate.js): a row may declare kind:'MODEL', and then the rules
CHANGE rather than relax — EVERY constant must be tagged [SOURCED file:line] or [DOC ...]
or declared ours, at least one must be genuinely SOURCED so the row is not pure hearsay,
the page must say NOT A MEASUREMENT on its own face, and the record must list what was
tried and failed. An untagged number fails the build exactly like a missing citation.
A model is a legal deliverable; a model pretending to be a measurement is not. 83 new
checks, 262 total, all driven through the page's own tick() so a 24-minute buff is verified
in milliseconds.
TWO DEFECTS FOUND BY LOOKING, WHICH IS THE LESSON FROM THE TWO KILLS BEFORE THIS:
(1) THE MOUNTAIN WAS NOT ACTUALLY DANGEROUS — 5 tiles of cold crossed in 8 seconds, 8 of
25 health, so the buffs did not matter, so the page failed the one thing he asked it to
test. The world was rescaled (48 rows, 1.6 tiles/s) so the cold round trip costs ~29
health: EMPTY you reach the cairn and the mountain kills you on the way down; FED you
barely notice. The gate measures both outcomes.
(2) Rested re-granted every frame at your own fire — correct behaviour — but announced
itself every frame and buried the screen in toasts. Now it announces the transition only.
Also fixed on the surface, not in the code: the camp did not read as a camp (translucent
blob roof, anonymous tan squares, the fire hidden under the player). It is now a lit
shelter with posts, a glowing hearth, furniture labelled by CATEGORY, and the 10 m circle
drawn — because the radius is the mechanic.
[PENDING Paolo], and it is the whole point: DOES A CAMP THAT MAKES YOU STRONGER BELONG IN
BOHEMIA? Behind it, also his: our comfort CATEGORIES, how long our rest ritual takes,
whether food raises a ceiling or fills a meter, and whether we have a hunger axis at all
(Valheim has none and is stronger for it). NOTHING WAS PORTED — the lab ports on his word.
Teardown: records/lab/BOHEMIA_LAB_VALHEIM_TEARDOWN_7_27_26.txt (every number tagged).
Patterns: records/lab/BOHEMIA_LAB_VALHEIM_PATTERN_NOTE_7_27_26.md
NOTE FOR THE FLEET: the alpha was not touched, so the build stamp was not changed.

LAB (09): 7/27 (j) LATEST — THE SECOND LOOT PAGE IS DEAD AND LOOT IS A CLOSED SUBJECT.
Paolo: "That was really bad so bad so bad." slices/lab/BOHEMIA_LAB_DARKROOM_SCAVENGE_7_26_26.html is DEAD
is DELETED, graveyarded, and its registry row plus all 44 live checks are gone from
gates/lab_gate.js. SECOND loot emulation killed in two days, so under
laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md LOOT IS ENDED as a lab subject: no v3, no
third reference game, nobody re-pitches a loot page unless Paolo names it himself.
POST-MORTEM, READ IT BEFORE BUILDING ANYTHING IN THIS LANE:
records/BOHEMIA_DARKROOM_LOOT_KILL_7_27_26.txt. Three causes.
(1) I PRODUCED SOMETHING HE DID NOT ASK FOR. His message asked for RESEARCH. The only
thing in it pointing at a build was "we can try it again except it could be faster. You
could try it something else" — a shrug, not a commission. The research alone was the turn.
(2) I ANSWERED "TOO SLOW" BY DELETING THE ACT. Zomboid died for being item-by-item, so I
took the far opposite end of the axis and shipped a paragraph and one button in a modal.
He said State of Decay is decent AS A LOOTING EXPERIENCE; the experience is the part I
removed. Two taps in a menu is not a fast search, it is no search.
(3) IT LOOKED LIKE NOTHING — grey squares with letters — while the fleet-wide look problem
is the exact reason he cannot approve anything. "PLACEHOLDER ART" being a legal label does
not make a thing judgeable.
AND THE PART THAT MATTERS MOST FOR THE NEXT SESSION: 264 green checks, two mutation tests
and a verified deploy proved the port was FAITHFUL and not one of them could ask whether
he wanted it. After the Zomboid kill I added a FEEL-STATEMENT step to catch exactly this.
I ran it. It PASSED — because it checks the reference against his RULINGS, never against
what he actually wants. A procedure I invented cleared me. Do not trust a self-authored
check as evidence he will like something.
WHAT SURVIVES: records/lab/BOHEMIA_LAB_RESEARCH_CANDIDATES_7_26_26.md, because he ASKED
for it and the reusable half is not about loot — it is which games have obtainable source
(A Dark Room and Cataclysm DDA verified by fetching; Rebuild 3, State of Decay 2 and
Persona 5 are documentation only) and the EMULATION-vs-MODEL split, where a MODEL needs a
new gate row type before one is legal to ship. The teardown and pattern note survive
marked DEAD at the top. laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md is
UNCHANGED — he ruled it, this kill touches none of it, and its four content questions
(resource KINDS and how many, yield range per container kind, what a search costs in time,
re-search / noise) are still the only real blocker.
THIS LANE IS NOW WAITING. It builds nothing until he names a subject. The gate suite is
green with the row removed.

LAB (09): 7/26 (b)-(h), COMPRESSED — the full record is in git and in BOHEMIA_BACKLOG's
LAB section; this is the state a new session needs. (Compressed on purpose: the handoff
is over its DIET LAW cap and this lane can only legally shrink its own entries.)
- THE LANE'S ASSIGNMENT WAS REJECTED AND REWRITTEN ON 7/26. Paolo: "who said I wanted to
  test the walking... it was supposed to be like the actual game and all its mechanics".
  laws/BOHEMIA_ADDENDUM_LAB_IS_WHOLE_MECHANICS_7_26_26.md: an emulation is 3+ NAMED
  MECHANICS playable end to end, from the real source. Movement/camera/collision/lighting
  are plumbing and can NEVER be a deliverable; the gate fails a row that declares one.
- HE RULED BOHEMIA'S MOVEMENT in the same breath:
  laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md — the world moves when you
  spend time taking an action. Then widened it: "sleep can be hangout or eat too u know"
  (laws/BOHEMIA_ADDENDUM_THE_MOMENT_IS_ANY_SPENT_BLOCK_7_26_26.md) — the resolve moment
  is ANY spent block, and a moment has a SIZE.
- LAB-03 SHIPPED AND HE PLAYED IT: slices/lab/BOHEMIA_LAB_STARDEW_WORLD_7_26_26.html,
  fishing + farming + marriage standing in one walkable town, one contextual verb, one
  resolve point at sleep. "Awesome! All these things worked. Very good!"
- THE FIRST PORT LANDED ON HIS ORDER: engine/bohemia_resolve.js (RESOLVE / RATION /
  CEILING / REACH), headless, zero deps, EVERY TABLE EMPTY because the contents are his.
  Gate: gates/resolve_gate.js, 77 checks. NOT WIRED INTO ANY SURFACE — adoption is filed
  as item A in RUN, WORLD and LIFE/SOCIAL.
  Verdict: records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt
- THE ZOMBOID LOOT PAGE IS DEAD. "That was really bad and not fun." Deleted,
  graveyarded, gate row removed, NO V2. Post-mortem:
  records/BOHEMIA_ZOMBOID_LOOT_KILL_7_26_26.txt. The ruling that replaced it is the
  valuable thing: laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md (LOCKED).
- LAB-01 (the town-walk) is SUPERSEDED not deleted, kept green, and its note opens by
  saying so. Never use it as a template.
- STILL [PENDING Paolo] and nobody invents them: the MOMENT table (which moments, how
  long each spends), the ACTION COST table, RATION limits, the FACTION STANDING ladder,
  REACH in tiles, and the LOOT content (resource KINDS and how many, yield range per
  container kind, what a search costs in time, re-search / noise). Also the one canon
  fork from LAB-01: 120 BPM + OCCUPANCY versus a continuous sub-pixel walk — three
  options are written out in the town-walk note and the lane did not pick.

WORLD MODEL (02): 7/27 (a)-(e), COMPRESSED — the full record is in git and in
BOHEMIA_BACKLOG's WORLD section; this is what a new session needs. (Compressed on
purpose: the handoff is far over its DIET LAW cap and a lane may only legally shrink
its OWN entries. records/ carries the long form of every line below.)
- (e) CAMPUS 16 cells + SPEEDWAY 12, real kit districts, gate LANDMARKS, icons the same
  turn. THE CAMPUS IS ITS QUAD (the gate requires the quad to BEAT the pavement, or it
  is a business estate wearing the word) and THE SPEEDWAY IS ITS OVAL (the gate floods
  the track and requires it to come back round; grandstand on the front stretch ONLY;
  vehicular:true, the walkable-land law's own exception). Four bugs the gates caught,
  all of which looked fine rendered — lots not touching the ring road (reach 0.54),
  an apron inset one tile from the plot edge (reach 0.00), five light towers placed
  entirely off the grid, and THE TUNNEL THAT SKIPPED THE FENCE and sealed the oval (39%
  reachable, with no way to the track, infield or garages at all).
- (d) THE ENCOUNTER DIRECTOR, engine/bohemia_encounters.js, on his "Approve all" of the
  act-1 roster. 12 tokens, each with the VERB that makes it different. 70/20/10 by a
  DEFICIT CHOOSER where THE CLASS IS NOT NEGOTIABLE (the first build substituted and
  came out 40/42/18; if the story wants an ambient beat and none is free, NOTHING
  happens). Storyteller budget, ~90s floor, rare is sacred, no repeat-spam, NO GLOBAL
  SPAWNS EVER (held by construction — there is no fallback table), and NO BACKGROUND
  TICKING: the module owns no clock at all and is PULLED through the resolver socket.
  Gate ENCOUNTERS, 46. NOT LIVE until the moment table lands and somebody rules the
  district spawn table. Neither is guessed.
- (c) TWO ORDERS, both shipped. THE ONE MAP (his order): the phone's map app drew a
  SCHEMATIC and now renders the real generated valley cell for cell out of the shared
  engine/bohemia_valleymap.js, which the city-builder MAP tab reads from too, with quest
  pins grouped by cell on top. Gate ONE MAP, 37. It uncovered four real defects: the
  PHONE WAS RUNNING A WORLD MODEL WITH NINE GENERATORS MISSING (rail, both freeways, the
  interchange, both airfields and all three terrains resolved to nothing on the phone
  only); four independent valley renderers with copy-pasted tone tables and three
  different seeds; dead wm.hubs/wm.routes reads; and the player blip standing at tile
  128,128 on a 96-cell valley, permanently off the canvas.
  THE WORLD'S HALF OF THE RESOLVER (his order): engine/bohemia_world_resolve.js, four
  systems subscribing to declared moments — day, economy, faction, encounters. Never
  hardcoded (proved by source AND by behaviour: a resolver whose moments are named
  QWERTYUIOP works identically), all tables EMPTY with each system reporting NO_RULING
  by name, and the size of the moment as the only dial. The 7/24 pacing ruling is not
  overridden: the faction step cannot fire without a caller-supplied beat predicate, so
  a spent meal can never quietly become a war. Gate WORLD RESOLVE, 39.
- (b) THE ICON LAW landed off his ruling and found a hole 44 types deep: the district
  hero system had a factory, a bank, a judge page and two gates, and NOTHING CHECKED
  WHETHER A TYPE HAD ONE. Gate ICON is a RATCHET — new work cannot add debt, the named
  debt list may only shrink, and an icon must be REAL ART (the PNG is inflated, its row
  filters undone, and the pixels measured, so a coloured square cannot pass).
  AND THE ONE I STOPPED ON: airport + airbase heroes are written, correct, and
  deliberately OUT of the roster. The aeroplane geometry is fine (verified alone on a
  bare plate); the problem is that every other hero's signature is a BUILDING, which
  survives shrinking, and an airfield's is an AIRCRAFT, which does not. Four attempts
  are written up in the factory so nobody re-walks them. It is a COMPOSITION RULING and
  it is Paolo's.
- (a) THE MAINLINE (engine/bohemia_rail.js, 90 cells, gate RAIL) — not built out of the
  road vocabulary at all: ballast prism, sleepers, gauge-spaced rails, cess, ditch, a
  maintenance road on ONE side, ROW fence, wayside signals, and sidings keyed on the
  CELL COORDINATE so a loop runs 1.5 km instead of flickering every 96 m. THE LINE IS
  ONE LINE: world.js's continuityLinks looks THROUGH a crossing surface and the freeway
  lays rail under its deck, so three two-cell freeway crossings no longer sever the
  valley's only railway into three pieces.
  THE STACK (engine/bohemia_interchange.js, 16 cells, gate INTERCHANGE) — NO PER-CELL
  BUFFER ANYWHERE; every tile is a pure function of valley position, and the module
  exports solve() so the gate can PROVE it rather than infer it from seams. That caught
  the infield noise being keyed on the cell seed, i.e. sixteen cells quietly solving
  different ground.
  AND A DEFECT IN MY OWN LAST SHIP, found only by rendering the freeway and looking:
  926 OF THE VALLEY'S 952 FREEWAY CELLS WERE DRAWING AS FOUR-WAY JUNCTIONS, because an
  interstate is laid TWO CELLS WIDE and the module read "any freeway neighbour" as its
  axis — so the PARALLEL CARRIAGEWAY looked like a crossing and 10% of the map rendered
  as tan embankment squares. Every road gate asked whether you could DRIVE THROUGH the
  cell, and you could; nothing asked what SHAPE it was. Gated now (crossroads under 5%).

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
CHARACTER (04) 7/28 NEWEST — NECK TONE IS PER-FACING NOW.
Paolo: "Make the neck one tile less facing east and west... towards the chin."
In profile there is far less throat between jaw and collar than head-on, so two
rows reached up into the chin. NECK_TONE.throatRowsByDir = {E:1, W:1}; every other
facing keeps 2. Verified by differencing the toned and untoned build and listing
which rows ACTUALLY change: S rows 14+15, SE 14+15, E row 15 only, W row 15 only.
A zero count is honoured rather than underflowing the top bound into the whole
face, so the dial can turn the throat off per facing without a surprise.
Gate: neck_tone_gate.js 43 -> 48.

NOTE FOR THE NEXT SESSION ON SHIP COST: main moved FIVE times during this one
ship, every time from another lane, and each move forces a rebase + a full ~520s
gate re-run. Every conflict was the BUILD STAMP and nothing else. If that keeps
up, the stamp is worth making a generated one-liner rather than a hand-edited
line in the alpha, so parallel lanes stop colliding on it.

--- previous ---
CHARACTER (04) 7/28 LATEST — THE "TWO HANDS" WAS THE JACKET ALL ALONG, AND THE
NECK TONE WAS LANDING ON CLOTH. BOTH FIXED, BOTH VERIFIED ON THE RENDER.

He said it a third time: "the neck is not a different color and the skin above the
hand isnt fixed bro". He was right both times. Neither was what I had assumed.

1 THE WHITE BLOCK ABOVE THE HAND = THE JACKET PAINTING A SECOND HAND.
  Found by rendering the SAME frame bare and dressed and differencing it:
    y32 x28  part 6 (arm)   body 191,175,166   dressed 224,211,203  <- GARMENT
    y33 x28  part 6 (arm)   body 191,175,166   dressed 224,211,203  <- GARMENT
    y34 x28  part 6 (arm)   body 191,175,166   dressed 191,175,166     body
    y35 x28  part 8 (hand)  body 191,175,166   dressed 191,175,166     body
  The real hand starts at y35. Every garment ramp carries the SK_DEF skin stops so
  the art can show a wrist/hand opening; when the arm bone deforms they land ABOVE
  the hand and read as a second hand stuck on the sleeve. THE RULE NOW: a garment
  may not paint a SKIN tone onto an ARM cell. It is the mirror of HAND_PARTS, which
  already refuses to let an arm-bone garment pixel paint a hand.
  NOT geometry, NOT depth order, NOT the outline, NOT dressBackLimb. All four were
  ruled out by measurement first; see the two diagnosis records.

2 THE NECK TONE COULD NEVER HAVE SHOWN. Neck cells showing SKIN with his
  cowl-hoodie: S 0/8, SE 0/10, E 0/9, W 0/9, N 6/12. On every facing he looks at,
  part 3 is 100% cloth. The skin he means -- jaw down to collar -- is the bottom of
  the FACE part. The tone now also takes the lowest rows of visible face skin,
  found from the art each frame (follows the head bob, follows any neckline).
  Measured on E: throat is now 20.9 units off the face, was 2.

TWO SELF-INFLICTED BUGS ON THE WAY, both caught by LOOKING at the render, both
gated so they cannot return:
  a. ORDER. The arm fix was anchored BEFORE the garment composite (4769 vs 4877),
     so the garment repainted the cells one pass later. It measured as a total
     no-op while the code read perfectly correct.
  b. THE SHARED DARK ENTRY. skinRampFor()[0] is 28,22,24 -- and that exact colour
     is ALSO in the jacket, pants and shoes ramps. Including it in the is-it-skin
     test matched every dark sleeve pixel, and the first build repainted WHOLE
     SLEEVES as bare skin, far worse than the bug. Both passes now start at index 1.
  THE LESSON, and it is the third time this session: a colour-membership test
  cannot tell body from garment, because they share entries. Render it and look.

CORRECTION ON THE RECORD: the earlier "far arm 66.4% bare skin on E" figure is
UNSAFE and must not be cited -- it used exactly the membership test described in
(b). records/BOHEMIA_WHITE_FOREARM_AND_INVISIBLE_NECK_7_27_26.md carries the
correction.

Gates: neck_tone_gate.js 30 -> 43 (pins the order and the shared-dark-entry).
Records: records/BOHEMIA_TWO_SETS_OF_HANDS_DIAGNOSIS_7_27_26.md,
records/BOHEMIA_WHITE_FOREARM_AND_INVISIBLE_NECK_7_27_26.md
Proof: records/hands/FIXED_ARM_AND_THROAT_7_27_26.png

STILL HIS CALL, all measured, none blocking each other:
 - BORDER TONE: pure black / dark brown 38,30,26 / softer brown 58,46,40 / none.
   He called 1px "too thick"; half a pixel is impossible on a pixel grid and the
   outerOnly trick was proven a byte-identical no-op, so the only lever is colour.
   records/outline/BORDER_TONE_CHOICES_7_27_26.png
 - FAR HAND DEPTH on E/W: far 153.2 vs near 153.8 out of 255 -- no depth cue at
   all. Shade is banned inside the sprite by his own 7/26 rule, so it is either a
   separate shading layer or not drawing the far hand in profile.
 - ARM AND BELLY SLIDERS still look wrong to him; both measure INSIDE the canon
   invented-pixel baseline, so it is art direction, not a resampler bug.
 - PROFILE REPAINT (~48% of E/W torso rows are 1-2px) and the TALL BODY.

--- previous ---
CHARACTER (04) 7/27 NEWEST — HE REJECTED THE HANDS FIX. IT IS DIAGNOSED, NOT
RE-ATTEMPTED, AND THE DECISION IS HIS.

1 "TWO SETS OF HANDS" — I MADE IT WORSE, AND SAID SO. My earlier fix pulled the
  far hand out of DRESS THE BACK LIMB. That turned a sleeve-coloured hand
  (luminance 42, invisible on a near-black coat) into BARE SKIN (153 on that same
  42 coat). I converted a hidden hand into a second bright blob. He caught it in
  one build.
  RULED OUT BY MEASUREMENT, not reasoning: depth order (his authored layering IS
  obeyed - near hand 13px, far hand 2px at rest); a floating hand (0 disembodied
  frames in 24); a hand with no arm (0 frames).
  WHAT IT IS: far hand 153.2, near hand 153.8 on E - a difference of 0.5 out of
  255 - both against a 42 coat, for 19 of every 24 frames. Two identical pale
  blobs with NO depth cue. Not geometry. A missing depth cue.
  NOT FIXED, DELIBERATELY. All three routes need his ruling: occlusion is already
  applied (and more would override RIG LAW), shade is BANNED by his own 7/26
  "shadows are a separate layer", and not drawing the far hand in profile is a
  design call. STOP PRODUCING: no third attempt.
  Record: records/BOHEMIA_TWO_SETS_OF_HANDS_DIAGNOSIS_7_27_26.md
  Proof: records/hands/HANDS_ZOOM_7_27_26.png (18x, exactly what ships)
  [PENDING, Paolo's call] separate shading layer, or no far hand on E/W?

2 HIS CURTAIN BOB APPLIED, byte for byte from his paste (E 30->37, N 72->70,
  NE 72->70, S 50->40, SE 50->43; W/NW/SW still mirrored, ramp untouched). The
  applier REFUSES a ramp change, a layer-box change, or unknown directions rather
  than letting a repaint become a silent retint.
  records/rig/CURTAIN_BOB_7_27_26.json + tools/bohemia_apply_curtain_bob_7_27.py

3 NECK IS ITS OWN SKIN TONE (his ask). Part 3, verified by geometry not by a
  comment. A TONE, not a shadow: fixed per facing, fixed per frame, his own hue
  scaled so no new colour is cooked.
  THE BUG THE MEASUREMENT CAUGHT: the pass runs AFTER garments composite, so the
  first version tinted his HOODIE COLLAR (25.1 -> 23.1 dressed). Now skin-only.
  HONEST HEADLINE: with his current outfit the collar and the hair cover the neck
  almost completely, so this is nearly INVISIBLE dressed. It shows on the bare
  body and on any lower neckline.

4 ".5 PIXEL BORDER?" — NO, and the negative result is pinned. A half pixel cannot
  exist on a pixel grid, and RENDER PIXEL gates half-pixel draws shut on purpose
  (fractional drawing is what makes pixel art go soft on a phone). TRIED: an
  outerOnly mode skipping interior notches. Over 96 frames it was BYTE-IDENTICAL,
  12,170 outline pixels either way, 0% less black - no empty cell beside this body
  is enclosed, so it was ALREADY outer-only. The code was REMOVED rather than
  shipped as a knob that does nothing. The only real lever is COLOUR: pure black
  on pale ground is maximum contrast and contrast is what reads as thick.
  Four choices rendered: records/outline/BORDER_TONE_CHOICES_7_27_26.png
  [PENDING, Paolo's call] CHAR_OUTLINE.color is one line.

Gates: character_outline_gate.js now 33 (its scope check is the real closure
boundary, not a byte distance - the old proxy broke the moment a comment was added
above the flag). NEW neck_tone_gate.js (30), registered.

--- previous ---
CHARACTER (04) 7/27 LATEST — HE ASKED FOR A BLACK OUTLINE AND CAUGHT A BUG I MADE.
Two things this turn, both from one message of his with a screenshot.

1 ONE BLACK PIXEL AROUND THE WHOLE CHARACTER (his words, LOCKED). A 1px black
  border wraps the finished silhouette on all 8 facings, every frame. It is the
  LAST pass in buildFrame — after the body, garments, back-limb dressing, the
  separation line and the floater cull — because anything drawn after it covers
  it, which is the exact bug that made the separation line worthless for a whole
  session. Computed from a frozen SNAPSHOT so it cannot grow on itself into a
  2-3px smear. Colour only: the occupancy grid stays 0 under it, so collision and
  every measurement tool still see the true silhouette.
  MEASURED, 192 frames built twice and differenced (and re-run after the rebase
  onto the world lane's 10 commits, identical): 25,628 outline pixels, 0
  double-thick, 0 gaps in the wrap, 0 of his painted pixels changed. Verified on
  the REAL SURFACE, the live character menu.
  Law: laws/BOHEMIA_ADDENDUM_CHARACTER_OUTLINE_7_27_26.md
  Gate: gates/character_outline_gate.js (29), registered.
  Proof: records/outline/CHARACTER_OUTLINE_7_27_26.png
  [PENDING, Paolo's call] PURE BLACK vs THE CONSTITUTION'S DARKEST GROUND VALUE.
  His coat is nearly black, so the border reads loudest at the head, hands and
  boots and against pale ground, and quietly across the coat. CHAR_OUTLINE.color
  is one line. Do not decide this for him.

2 "TWO SETS OF HANDS" ON E/W — he was right and it was MY pass. DRESS THE BACK
  LIMB was dressing the far HAND. That hand has a 13-pixel painted footprint,
  exactly the same size as the near hand, so it laid a second hand-sized garment
  cluster right beside the real one. The pass exists because the back ARM arrived
  naked; the hand was never part of that. Pairs are now [[6,5]]/[[5,6]] and it
  paints 0 of those 13 cells. The arm fix survives: E far arm 41.0%, W 46.6%.
  SECOND TIME this pass has been over-extended to a part that did not have the
  defect (legs first, hands now). In the law as a pattern: a fix that is good is
  not thereby general. Scope to what was measured broken; re-measure on widening.

THE PROCESS BUG WORTH MORE THAN EITHER FIX. The outline flag was first declared
next to RIGID. RIGID is INSIDE the SKINNER_API closure; buildFrame is OUTSIDE it.
Every frame threw ReferenceError, the alpha never booted, and the symptom
presented as a PLAYWRIGHT TIMEOUT — which sends you debugging the harness for as
long as you are willing to be fooled. RIGFAITH had already cost a round to the
same boundary. RULE, now in the law: a load-time hang in the alpha is a page
error until proven otherwise. Capture pageerror BEFORE you touch the test.

STILL HIS CALL, unchanged and blocking real work:
 - THE ARM AND BELLY SLIDERS still look wrong to him (said again 7/27). Measured,
   both are INSIDE the canon invented-pixel baseline; only height+1 is out (962
   vs 133). So his complaint is about how they LOOK, not about invention, and
   the fix is art direction, not a resampler tweak. Needs him.
 - PROFILE REPAINT: ~48% of E/W torso rows are 1-2px. RIG LAW forbids me
   narrowing his arms. Needs him.
 - TALL BODY: authored builds vs row-repeat vs capping the dial at shorter-only.

--- previous ---
CHARACTER (04) 7/26 FINAL — MORPHING IS FIXED. THE REST IS ART, AND IT IS HIS.
Nineteen measured attempts got here; the negatives are all recorded and gated so
nobody rebuilds them. WHAT SHIPPED AND STUCK:
 1 RENDER LIKE THE RIG — three passes his rig never had (joint weld, forward
   splat, far-arm darkening), all retired. Invented pixels 33,400 -> 18,284.
 2 OWN CANVAS (his ruling) — parts are sampled ALONE then composited, so a part's
   shape can no longer depend on where its neighbour stands.
 3 KEY THE EXTREMES — a clip is ~8 drawn poses; every hand-reversal is a key and
   each frame snaps to its NEAREST key. **ZERO morph pixels during holds on all 6
   proof clips**, and 89% of the arm swing kept. THE RULE NEVER TO WRITE AGAIN:
   "stay put unless you moved more than X" LAGS and clips every extreme — it cost
   walk 100% of its hand travel and he caught it in seconds by eye.
 4 DRESS THE BACK LIMB — in profile both arms SHARE 49 of 83 rest pixels and a
   shared pixel binds to ONE bone, so the sleeve rode the near arm and the far arm
   rendered BARE SKIN (11% dressed on E). It now gets its own bound copy: 42-48%.
 5 LIMB SEPARATION IS A LAYER — the body drew the line correctly and THE CLOTHING
   PAINTED OVER IT (~70% destroyed). The line now runs AFTER the clothing, in the
   garment's own ramp, arms AND legs. Dressed separation 22% -> 50-66%.
 6 SKIN USES HIS PALETTE ONLY — the "tan clay" he circled (120,108,102) was MY
   invention: the ramp map held garment ramps only, so skin fell through to a
   derive step. Fixed three ways (seed his skin ramp, bound the step both ends,
   skip skin entirely). Bare body now renders 100% his own tones.

TWO THINGS ARE MEASURED, PROVEN, AND BLOCKED ON PAOLO. Do not attempt either:
 A THE PROFILE REPAINT. The front-arm > TORSO > back-arm stack he asked for
   ALREADY SHIPS on every angled facing, and the torso has ZERO holes. But ~48% of
   visible torso rows in E/W are 1-2px wide (median 3px, vs 7px on SE). A 1px
   strip cannot read as a torso. There is NO renderer fix left. RIG LAW forbids
   narrowing his arms to make room — I offered that and it was wrong of me.
 B THE TALL BODY. Only ONE HALF OF ONE DIAL is broken: height+1 invents 962 px
   against a canon baseline of 133 (7x). height-1 is 8, belly and arms are inside
   baseline, because they TRANSLATE whole rows while height STRETCHES bone length.
   Options in the law: swap between authored builds (recommended), row-repeat, or
   cap the dial at zero. All cost his art or half his dial.

  laws  RENDER_LIKE_THE_RIG / PARTS_ARE_PAINTED / OWN_CANVAS / FROZEN_POSES /
        BACK_LIMB_CLOTHING / LIMB_SEPARATION / ONLY_TALLER_BREAKS (all 7_26_26)
  gates render_like_the_rig(23) parts_are_painted(22) own_canvas(17) arm_hold(23)
        frozen_poses(29) back_limb(19) limb_separation(36) only_taller_breaks(10)
        reply_contract(15). Every one also PINS its negative results.
  tools all patches idempotent; bohemia_zero_morph_proof.js regenerates the
        before/after sheets in records/zeromorph/ that he can actually look at.

REPLY CONTRACT CHANGED 7/26 (his ruling, gated): the ask and the TLDR are the LAST
two blocks on screen, every turn. He reads bottom-up; anything he scrolls for does
not exist.
DO NOT: ship an animation look-change unasked, lead a reply with a green gate, or
touch his painted regions (RIG LAW). He rejected several rounds today before any
of this landed.

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
RUN (01) 7/28 LATEST — ONE VEGAS. THE RUN AND THE CITY WERE TWO DIFFERENT CITIES.
Paolo: "I still wanna start off in a suburb that you choose the location for in
Vegas and I want that reflected when I'm in the city menu... I just want you to
incorporate all of these things together." HE WAS NOT ASKING FOR A FEATURE, HE
WAS DESCRIBING TWO WORLDS. Measured on both surfaces at once: the game builds
buildRealWorldMap('bohemia') -> hashSeed -> overmap seed 2691674296; the city
builder had `let seed=2026` hardcoded. So overmap cell 12,4 was the SUBURB the
run spawns him in and ARTERIAL in the builder. Nothing could ever be "reflected
in the city menu" because the city menu was not the same place. THAT IS THE ONE
MAP LAW (7/27, LOCKED) BROKEN IN A THIRD PLACE - and that law's own write-up
names the previous instance (the MAP tab on seed 1337 while the game booted
'bohemia'). The MAP tab was fixed; THE CITY BUILDER WAS NEVER CHECKED.
SHIPPED: (1) ONE SEED, tools/bohemia_one_seed_patch.py - the builder takes the
seed from the game's own hash of its own seed text, inlined verbatim from the
engine so a copy-paste cannot drift it again. (2) THE CITY OPENS WHERE YOU ARE,
tools/bohemia_run_city_sync_patch.py - the only run->shell traffic was the
SPRITE (citySendPlayer), never position, so the city opened on the Strip every
time; the run now posts BOHEMIA_RUN_WHERE from loadCell (boot AND every edge
crossing), the shell remembers it, the city camera goes there. Header reads
SUBURB. (3) A HOME THAT WAS CHOSEN - "first suburb in scan order" is
deterministic and is ALSO ALWAYS the cell nearest the top-left corner, the rim,
which is why half the city screen was the blue outside the map. Scored now by
how many DIFFERENT KINDS OF PLACE are within a short walk minus a map-edge
penalty: cell 39,23, 23 district types within 6 cells, zero edge.
THREE BUGS I CAUSED AND CAUGHT FIRST: the scoring loop called WORLD.tile(),
which REALIZES a 128x128 district, 169x per candidate - minutes of boot on his
phone; WORLD.at() is the overmap rung and boot is 1087ms. window.__RUN_SENT is
declared at the BOTTOM of the run while bridgePost is hoisted, so the first
boot-time caller took the whole script down - a gate affordance must never break
the game it watches. And one probe of mine called the bridge broken when the
frame was merely hidden.
TWO GATES THAT ONLY PASSED BECAUSE OF WHICH CITY WAS LOADED, both fixed, neither
a game defect: banks_used_gate (mine) called his 13 border walls never-drawn -
they draw 207x, it was sampling five spots by the front door twenty tiles from
the wall; wallheight_gate (city lane's) could not find a wall to measure because
it took the FIRST suburb in scan order - the identical rim bug as the spawn.
THE OLD SEED WAS HIDING FRAGILITY IN TWO SEPARATE GATES.
NOT REVERSED, RECORDED: another session wired the RUN tab to open the CITY panel
today, on his own instruction ("Can you put the city in the run tab?") -
`PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p`. THAT is why he is looking
at the city's UI and why travel zooms out. [PENDING PAOLO] whether tapping RUN
should give the run or the city; two of his asks are in tension and only he can
reconcile them. Record: records/BOHEMIA_ONE_VEGAS_7_28_26.md

RUN (01) 7/28 — PRESENCE IS NOT USE. Paolo: "You're completely not
checking out the rest of the whole project catalog for assets that are approved
that you should work with... are you drifting off?" YES. I rebuilt the run's
entire house stack that day out of wall_base / wall_under_eave / roof_slope /
garage_top - the CBB tileset, HIS OWN VERDICT ON WHICH WAS COULD BE BETTER - and
never once opened banks/ to see what he had already approved. No new pixels were
cooked so REUSE-FIRST held; the SHOPPING LAW did not. WHY IT HAPPENED TWICE: the
approved-assets-first law says approved-but-unused is a defect and its own text
marks the enforcement machine "queued". QUEUED IS NOT ENFORCED. His 13 border
walls were loaded-and-unused until 7/28; his 30 house skins are loaded-and-unused
right now. The builder ASSERTS the banks are PRESENT and nothing asserted they
were USED, so present-and-unused passed every gate in the repo, twice.
gates/banks_used_gate.js closes it: boots the real run, patches drawImage, tags
every approved bank, draws frames inside the house and at five real standing
places on the block, counts draws per bank. Zero draws = defect. IT FOUND MORE
THAN THE AUDIT DID: the skins are 21 images in the build, not 30, across THREE
arrays (ROOF_IMG 14 / WALL_IMG 4 / YARD_IMG 3), and DOOR_IMG vs DOOR_IMGS are
DIFFERENT BANKS ONE LETTER APART - DOOR_IMGS (90) is the approved animated bank
and it draws, DOOR_IMG (9) is the pre-7/26 flat art it superseded, so a probe
reading the wrong one reports the LIVE door bank as dead. WAIVERS ARE DEBTS, NOT
DECORATION: two, named and ticketed (0P house skins BLOCKED ON HIS PICK, 0Q the
superseded door art), each asserted honest in BOTH directions - fails if the bank
stops being loaded (stale) AND fails if it starts drawing (delete it). Any other
loaded-and-unused bank is an instant fail. NOT DONE ON PURPOSE: I did not pick
his house art for him. Three versions of the house renderer had already shipped
that day; a fourth to win a materials argument on his behalf is the exact failure
STOP PRODUCING names. HIS PICK IS PENDING: skin-the-stack / flat / ground-first,
written up in records/BOHEMIA_RUN_ART_SOURCE_AUDIT_7_28_26.md.

RUN (01) 7/26  — DOORS + MUSIC. Paolo: "doors are always two tiles tall,

RUN (01) 7/27 LATEST — CONCRETE HAS TO BE GOING SOMEWHERE. Paolo: "i dont know
why theres so many sidewalk cement things spread around on the floor when it
should be like wtf". The yards ran th(gx,gy,7)===0 -> a sidewalk tile and
th(gx,gy,11)===0 -> dirt, which sprinkled single slabs of poured concrete at
random across every lot on the block. A SIDEWALK IS NOT A TEXTURE, IT IS A ROUTE
- from somewhere to somewhere - and a slab in the middle of a gravel yard with
nothing on either end of it is litter. Concrete on open ground now happens for
exactly one reason: it is a FRONT PATH from a door to whatever pavement the world
already put there (road, driveway, the block gate). AND IT BENDS: poured straight
south it only got out for TEN of the block's twenty-three doors, because the other
thirteen face the back of the house in front of them, and a path that dead-ends
into a wall is the same litter wearing a different hat - so it takes the shortest
real route across its own yard, and nothing reachable within PATH_MAX means that
door gets no path and none is drawn. 23 of 23 have one now. The random dirt
speckle went with it; yard_0/1/2 already carry the variation. GATE:
strayConcrete===0 (every poured tile on open ground is the kerb band, a driveway
the world placed, or a path that arrived) plus pathCells>0 && pathDoors>0.
run_gate.js 125. Record: records/BOHEMIA_RUN_BUILDING_STACK_7_27_26.md

RUN (01) 7/27 — OFF MEANS SILENT. Paolo: "when im in the run i press the
music button off and the music still plays ass hole". He was right and the gate
was passing. MUS.stop() cleared the step SCHEDULER and set playing=false, and
that is all it ever did. The scheduler books notes AHEAD of real time and every
one it books is a real WebAudio node with its own envelope scheduled to sound at
an absolute future time - killing the scheduler stops new notes being QUEUED and
does not touch a single note already in the graph, so a pad or a horn with a long
release goes right on sounding after the button says OFF. THE OLD GATE ASSERTED
THE FLAG (musicOff===false && musicOn===true) AND BOTH WERE TRUE THE WHOLE TIME;
the flags were never the problem, they were the reason nobody caught it. FIX:
everything routes through one master gain, so stop() ramps MAST.gain to 0 over
60ms (ducks instead of clicking) and start() ramps it back to 0.8, and
CITYMUS.stopShuffle() now calls MUS.stop() UNCONDITIONALLY - it was guarded by
if(MUS.playing), so any desync of that one flag left OFF pressed and the audio
running with nothing willing to stop it. NEW LAW:
laws/BOHEMIA_ADDENDUM_OFF_MEANS_SILENT_7_27_26.md - a control that says OFF makes
the THING stop, not the flag that describes it, and its gate asserts the EFFECT
in both directions (a control that can never come back on is the same bug wearing
the other hat). PROVEN, not attested: ran the new assertion against the pre-fix
code and got playing:false, timer:false, GAIN:0.8. THE TRAP THAT HID IT: MUS is a
top-level `const`, so it is in global LEXICAL scope and NOT on window - any probe
written as window.MUS && MUS.MAST reports null forever and passes on nothing.
Reference it bare. (CITYMUS is fine, it is explicitly exported.) run_gate.js 123.

RUN (01) 7/27 — THE BLOCK IS BUILDINGS NOW. Paolo: "it still looks like
dog shit u tried to make garages like sideways u's and its very bad man also
every wall that hosts a door should be at the least three wall tiles tall and we
gotta fix what it looks like when im underneath a wall with an opcacity filter or
something man its still bad". THREE DEFECTS, ONE ROOT CAUSE: the run was painting
a three-quarter view's SOUTH-FACING art onto every side of a mass, and handing
every leftover cell to the roof. I looked at the render before touching anything
and it said something worse than the three complaints - a house was one unbroken
slab of terracotta twelve rows deep with a doorway floating in the middle of it.
THE MEASUREMENT THAT SETTLED IT: I opened the frozen target frame and measured
it. Every building in it is FOUR courses of wall under a THREE course roof cap,
and the next building's wall starts right behind it. The whole frame is that
rhythm repeating. So the run reads a mass in BANDS off its own south edge -
4 wall, 3 roof, 4 wall, 3 roof - and the LAST band of a column is SHRUNK to fit
rather than allowed to run on (a leftover handed to the roof is the six-course
orange field; a leftover handed to the wall is a course of stucco standing on
nothing). THE DOOR: the front is the SOUTH FACE, always, because it is the only
wall this projection draws - doors were landing on north and west edges because
this valley's driveways come in from the west. THE GARAGE: the sideways U was a
seven-tile VERTICAL stripe of a tile whose art is the bottom half of a bay seen
head-on. A bay is now south-facing, at most 3 wide, 2 tall, at the end of its run
the driveway actually comes from; the rest of the garage front is wall. ALSO
FIXED WITHOUT BEING ASKED: a hip tile is "the slope cuts in and above the cut
there is nothing", so laying it on bare canvas punched a BLACK NOTCH into the top
corner of every roof in the game - the ground goes down under every building tile
now and the cut shows the yard through it. THE SEE-THROUGH: my first cut faded
whatever sat north of the player, which GHOSTED him every time he stood in his
own front yard with the house behind him - he is IN FRONT of that wall and
belongs opaque. Now exactly two things fade, at the 35% the city lane's
THREE-TILE WALL addendum fixed for the whole game: an OVERHEAD-layer tile (the
dossier law's own pass-under layer) and your own doorway's leaf when you stand in
it. GATE: run_gate.js is 120 (was 109). window.__RUN.look() reports what the
renderer would actually lay on every cell of the real block and
window.__RUN.occluders() what is drawn see-through over the player; the ghosting
is gated in BOTH directions, same reason the city lane does it. NO PIXEL COOKED -
every tile is the frozen 42-tile starter set. Record:
records/BOHEMIA_RUN_BUILDING_STACK_7_27_26.md

RUN (01) 7/27 — THE VALLEY IS REAL. The run's block used to be a
standalone BohemiaSuburb.generate() with nothing on any side of it: walk to the
edge and you hit nothing, forever. It now READS THE VALLEY the rest of the game
runs on, one 128-tile cell at a time, off the world model's own tile rung
(WORLD.tile) - same seed, same overmap, same generators. Walking off an edge
really loads the neighbouring district and says which one.
WHY IT WAS CHEAP: a suburb cell out of the real valley emits EXACTLY the codes
the local generator did (0 yard, 1 road, 2 house, 3 driveway, 4 wall, 5 gate,
6 garage, 9 upper), so footprints, doors, interiors and the whole dressed look
worked unchanged. Home is found, not typed: the first suburb cell in scan order
(MAP LAW - derived, so it survives a regeneration).
ALSO: WHAT BLOCKS YOU IS NOW THE WORLD'S ANSWER (tile.solid), not the run's own
list of walkable suburb codes. That list was a second copy of a rule the world
already owned and it said nothing at all about the other twenty districts.
HONEST GAP, and it is the lane's new top item: the other districts are WALKABLE
but wear a MATERIAL pass, not district art - laid from the constitution's tiles
using the WORLD'S OWN tile names (asphalt roadway, curb + gutter, dirt shoulder,
sidewalk, gravel access road, solar panel). Nothing yet reads as a solar farm or
an arterial specifically. Ledger 21/27, run_gate 109.

RUN (01) 7/27 — THE SENTENCE THE GAME SPEAKS. Paolo, after the lab:
"walk somewhere, ONE contextual action button that changes by what you're
standing at, act, spend time, the world resolves." Adopted whole. Every verb in
the run now goes through the PORTED, approved engine/bohemia_resolve.js:
 - REACH is ONE declared number (1 tile) with a facing, replacing three
   assumptions. The number is not invented: it is the radius the run's own talk
   trigger already used.
 - ONE BUTTON. It becomes talk / enter / use / sleep / hang out from what is in
   reach of where you stand and what you face. WHAT YOU ARE STANDING AT BEATS
   WHAT YOU COULD DO ANYWHERE (standing in the doorway offers the doorway, not
   the bed), or the one button stops being contextual and becomes a preference.
 - MOMENTS ARE HIS SIZES: SLEEP spends 8, HANGOUT spends 1, EAT is declared with
   NO spend because he never priced it and an action-cost table is canon
   (TIME IS SPENT BY ACTIONS sec 4). The button says so out loud.
 - Spending time RESOLVES THE WORLD: declared steps in declared phase order
   (block-clock -> doors -> neighbours -> journal), a thrown step can never eat
   the time you spent. A night advances 480 world minutes and SAVES.
 - You now WAKE IN THE BEDROOM, not in your own doorway - required once the
   button became contextual, or SLEEP was unreachable.
WALK FEEL, as something to PLAY not read (he re-opened the pattern note's fork):
GRID / SLIDE / HYBRID / FREE, switchable mid-walk from the ☰ menu, each really
different (measured: GRID offset 0, SLIDE interpolates, FREE moves sub-cell).
FREE's own button says it costs a law, since TIME IS SPENT BY ACTIONS called it
dead on arrival - his feel decides, not mine. In every mode the world still
advances one step per CELL ENTERED, so nothing slides around a held-breath world.
run_gate 93 -> 105. Ledger 20/27.
TWO GATE BUGS FOUND AND FIXED while proving it: the gate's blind tap sequences
desynced the moment a step was refused (they now re-plan from the live position
and never route through a door), and its sections shared one file:// localStorage
so the save suite's blobs were still there when the alpha booted.

RUN (01) 7/26 — INSIDE IS DRESSED. CITY's UP-only interior pool
(banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt, 465 Great-Sweep tiles bucketed by room
function) was built and deliberately left unwired for a surface with rooms. This
is that surface, so it is wired: a room gets ONE floor chosen by its own function
(dirt in a garage, tile in a wet room, concrete in a hall), its props come from
its role's own buckets and nowhere else, and props are DECORATION - passability
is untouched, so a dressed room never turns into a maze.
ONE JUDGEMENT CALL WORTH KNOWING: the pool's 48 WALL variants are a broad corpus
(blue tile, brick, planks, curtains) and picking one per cell turned a room into
a patchwork quilt. Interior walls now use the CONSTITUTION's own wall tile - a
stucco house has stucco walls inside too. The pool does floors and things, which
is what it is good at. HONEST GAP: a few pool floors (a pink tile, a blue tile)
are louder than the target's palette. That is Paolo's eye to rule, not a gate's.
Ledger 18/25.

RUN (01) 7/26 — THE BLOCK LOOKS LIKE THE TARGET. Paolo's CBB verdict
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

COMBAT (04) 7/27 - v93: YOU CAN SEE WHO IS UNDER THE DECK + THE KILLSHOT
ALLOWANCE (thinking only, nothing built, on his explicit ask).
--- THE FIX ---
Paolo: "there has to be like the [opacity] thing where I could see who's
underneath the stairs."
REPRODUCED, AND IT WAS THE OPPOSITE OF HIDDEN: a living man parked on the lot under
a deck tile was drawn ON TOP OF the storey above him. Every body paints in ONE pass
at ONE depth, so a man underneath a platform and a man standing on it were
pixel-identical. *** THE PICTURE ACTIVELY LIED ABOUT WHICH FLOOR ANYONE WAS ON,
WHICH IS WORSE THAN OCCLUSION -- occlusion at least tells you something is in
front. ***
THE X-RAY, which is what every top-down game with a roof does (Diablo, BG3,
Fallout, Zelda): a body on the lot with a storey over its head draws as a GHOST,
washed cold blue-grey at 0.42 alpha. SOLID = on the deck. GHOST = underneath. One
rule for every body, enemies and the player alike, and the read line also says
UNDER THE DECK for the case the level words could not cover.
REUSE: rides drawHumanWashed, the tint path the stun/firing/peeking/wounded reads
already use. No new draw path.
NOT DONE, AND THE FILE SAYS SO: the honest fix is a three-pass depth sort (ground
bodies, deck, deck bodies). drawField's body pass is ONE 180-line loop that also
owns wounds, weapon reads, target rings, beg lines, elite glints and health bars --
splitting it by level is a large risky reorder of the most-touched function in the
file AND WOULD STILL NEED THE X-RAY, because a man perfectly hidden under a roof is
a man you cannot make a decision about. If it is ever split, the ghost stays right.
GATE: section 29, 462 -> 469 checks, including that a ghost is a READ and not a
rule change (under the deck alters nothing about cover, damage or exposure).
TOOL: tools/bohemia_combat_under_the_deck_patch.py

--- THE THINKING (he said "look at the code and think about it for a turn") ---
records/BOHEMIA_COMBAT_THE_KILLSHOT_ALLOWANCE_7_27_26.md
HIS IDEA: the difficulty setting becomes HOW MANY KILLSHOTS YOU GET PER TURN before
the dial ramps up; perks/cards raise that number.
WHAT THE CODE DOES TODAY, and both halves matter:
  * THE CHAIN IS UNLIMITED. afterKill() re-enters aim on every landed killshot,
    forever, until you miss. The turn ends when you FAIL and only when you fail.
  * THE DIFFICULTY SETTING IS A CEILING, NOT A FLOOR. distPkg = round(distT*userPkg)
    is ZERO at point blank on EVERY setting including Bohemian. The shot number
    influences nothing at all. And there is NO per-turn shot counter in the file.
MY READ: *** BUILD IT. *** Strongest idea to come through this lane. It creates a
decision that does not exist (stop, or take the harder dial) -- it is THE BANK from
the 7/27 research, but better, because the stake is THE TURN ITSELF and it needs no
new currency. It makes "difficulty" sayable in one sentence ("EASY means you are
good for two kills a turn"), which is the bar SUPPRESS has failed three times. It
gives progression ONE clean number to grant. And it answers "how long is a turn",
which today has no shape.
*** THREE RULINGS NEEDED BEFORE A LINE IS WRITTEN: ***
1 IT COLLIDES WITH THE RANGE RULE. Point blank already forces EASY on any setting,
  so naively the ramp would not exist for anyone who closes -- which he ruled
  yesterday is the correct way to play. FLOOR (pkgDiff = max(range,ramp)) or
  REPLACE? RECOMMEND FLOOR: closing becomes how you AFFORD the extra shot, which
  knits the new idea into yesterday's rule instead of overwriting it.
2 THE ALLOWANCE PER SETTING. Contents are his (MECHANISM-MINE/CONTENTS-PAOLO'S).
3 THE RAMP SHAPE: +1 tier per shot or accelerating, and does it cap at BOHEMIAN.
CAUTION: "guaranteed" is a promise the dial cannot keep -- even EASY needs you to
press in the band. GUARANTEE THE DIAL, NOT THE KILL: say "2 EASY SHOTS", never
"2 guaranteed kills". A broken promise is worse than no promise.
BUILD ORDER when he rules: the per-turn counter and the ramp FIRST (that is the
mechanic), the read SECOND -- the dial must SAY "SHOT 3 OF 2 - V.HARD" or the whole
thing is invisible, which is the mistake this lane has made three times running.

COMBAT (04) 7/27 - v92: THERE WAS NEVER A STAIRCASE, ONLY A DECAL. Paolo: "You
have stairs right now looking like dog shit... do a big brain online research.
Have some references and do what you're supposed to."
WHAT WAS THERE: three faint stripes painted on the TOP FACE of a deck tile, one
whole storey above the lot. *** THE STAIRS NEVER TOUCHED THE GROUND. *** Nothing in
the picture joined the two floors. I drew a TEXTURE where a piece of ARCHITECTURE
was needed, and the structural problem was worse than the palette one.
THE RESEARCH, and the decal had NONE of the three rules:
  1. THREE SHADES PER STEP -- bright top face, dark side face.
     (Pixel Parmesan, Fundamentals of Isometric Pixel Art)
  2. HEIGHT LINES ARE PERFECTLY VERTICAL -- the riser is the only thing in a
     top-down frame that says "this is tall". (SLYNYRD, Pixelblog 41)
  3. DRAW BACK TO FRONT so near steps occlude far ones. The occlusion IS the depth
     cue; without it a stack of bands is a barcode.
  Also: Pixelation "Stairs in top down perspective", M. Bitzos on 2D top-down
  stairs, Zelda ALTTP as the classic top-down elevation vocabulary.
  Agrees with what this lane already learned on the deck face: VALUE CONTRAST IS
  THE HEIGHT CUE.
SHIPPED: a five-step run, bright treads and near-black risers, spanning the full
storey from the lot to the deck plate, drawn top-step-first, narrowing with
distance, throwing a shadow at its foot. The chevron lifted off the steps.
TWO BUGS CAUGHT BY LOOKING AT IT, NOT BY READING IT:
(a) FOUR ORIENTATIONS, ONE BROKEN. Marching away up-screen, every riser is taller
than the gap to the next step and the whole run collapsed into a dark smear --
invisible in exactly one of four cases. FIXED AT THE SOURCE rather than
special-cased: the entrance is now GENERATED on the deck's near edge, so the run
always descends toward the viewer. One orientation, one that reads.
(b) A STOREY IS A STOREY WHICHEVER FLOOR YOU ARE ON. The rise was measured relative
to your feet, so standing on the deck it computed to ZERO and the way DOWN was
invisible -- the button said DOWN and the picture said nothing.
*** THE IDEMPOTENCY TRAP, AND IT WILL BITE AGAIN: I edited v90's tool to move the
stair placement and NOTHING HAPPENED. v90 is already shipped on main, so its tool
correctly skips an already-patched tree -- the edit silently left the old code in
the build and only the gate caught it. A CHANGE TO ALREADY-SHIPPED CODE BELONGS IN
THE NEW PATCH AS A MIGRATION, never as an edit to the old tool. ***
REUSE CHECK, RECORDED AND GATED: banks/ was searched and 19 approved stair tiles DO
exist (Stairs+ladders+railings n=6 part1, Stairs and lifts n=12 part3, Staircases
and elevation n=1 part4). NOT USED: the run must span DECK_H, computed at runtime
from the live camera zoom, and a fixed raster tile cannot stretch between two
screen heights that change. Cooked as vector geometry in the exact language the
deck and pillars already speak. FILED as the replacement for when the combat
surface goes tiled.
TWO OLDER GATE CHECKS re-pointed, not deleted. One of them ASSERTED THE DECAL and
passed happily while the thing it described was what he called dog shit -- a check
can describe a broken thing perfectly.
GATE: combat_lab_gate.js section 28, 450 -> 462 checks.
TOOL: tools/bohemia_combat_staircase_patch.py

COMBAT (04) 7/27 - RESEARCH: HOW GRID TACTICS HANDLE LEVELS. On his ask, and he
said "just do research", so NOTHING WAS BUILT.
records/BOHEMIA_COMBAT_RESEARCH_LEVELS_IN_GRID_TACTICS_7_27_26.md
*** HEADLINE: ALMOST EVERY TACTICS GAME PAYS FOR HEIGHT WITH A STAT BONUS, WHICH
HIS NO-MULTIPLIERS RULING CLOSES -- AND THE ONE FAMOUS GAME THAT DOES NOT IS THE
ONE BOHEMIA ALREADY RESEMBLES. ***
  XCOM 2:        +20 aim, flat, and explicitly NO defensive bonus.   ruled out
  Divinity OS2:  bonus damage AND extra range.                        ruled out
  FF Tactics:    shifts hit rate; height also gates MOVEMENT (Jump).  ruled out
  Jagged All. 2: TWO LEVELS ONLY, ground and roof. Pays in SIGHT LINES, not
                 numbers. <-- exactly what v90 shipped, arrived at independently.
JA2 IS THE CLOSEST RELATIVE and its two-level cap is a deliberate, shipped,
well-regarded choice rather than a shortcut. "One deck, not a building" has a real
precedent behind it.
THE CONFIRMATION WORTH KNOWING: XCOM's FLANKING rule is "a unit not benefiting
from any kind of cover is flanked." *** BOHEMIA'S CROSS-LEVEL RULE IS XCOM'S
FLANKING RULE TURNED VERTICAL. *** We already have the mechanism XCOM built its
entire positioning game on, and we got there without the stat bonus.
THE COST THE LITERATURE NAMES, WHICH THIS LANE ALREADY PAID TWICE IN ONE TURN:
verticality is fundamentally a READABILITY problem. Most maps cap at THREE floor
planes because players cannot process more, and designers "forget about the third
dimension because it's difficult to represent in 2D." Both bit us: v90's storey
face read as a lighter PATCH OF GROUND, and v90b's way up appeared 0 times in 8
arenas. Bohemia is at two planes; a third is available, a fourth is past where the
literature says players cope ON A DESKTOP IN 3D WITH A FREE CAMERA. On a phone in
top-down the honest ceiling is lower.
FOUR IDEAS, ALL [PENDING Paolo], NOTHING BUILT, ranked by whether they change a
decision (the rule the tally kill left behind):
  1 VERTICAL REACH PER WEAPON -- FFT writes vertical tolerance into range (3v2).
    A shotgun should not reach a roof the way a rifle does. Bohemia already has
    per-weapon lethality gates and muzzles, so the table exists. Makes the climb a
    LOADOUT decision too, and it is reachability, never damage.
  2 THE ANGLE GRADIENT -- XCOM scales a partial flank bonus from 44deg to 10deg.
    THE ONE ITEM THAT CLOSES THE AUDIT'S OPEN FINDING (at a given range no
    direction is better than any other). Must be expressed as ODDS, not damage:
    the shot pulls an easier needle pattern nearer a true flank, exactly the way
    point blank already does.
  3 A THIRD STOREY -- cheap now that levels exist and the render is relative.
  4 ROOF-EDGE COVER -- the deck is currently a killing floor with no cover in
    EITHER direction. JA2's roofs have parapets and prone. Most likely of the four
    to change how the deck actually plays: it would make the high ground a place
    you can HOLD, not just shoot from once.
NOT RECOMMENDED ON THE EVIDENCE: any height damage or accuracy bonus. Ruled out by
him, and the DOS2 critique shows what happens if you do it anyway -- the bonus
lands in the same slot as crit and an entire skill tree goes redundant.

COMBAT (04) 7/27 - v91: THE STAIRS ANNOUNCE THEMSELVES. Paolo: "I couldn't find
the stairs bro or whatever you had out what the fuck are you talking about?"
REPRODUCED, eight arenas, loaded and shuffled exactly the way he plays them:
    arenas with a deck:                 8 of 8
    whose stair tile was ON SCREEN:     8 of 8
    that ever showed the STAIRS button: 0 of 8      *** ZERO ***
v90b gated the button on stairNear(), which is 1.6 tiles. The stairs spawn 3-6
tiles out. So the ONLY thing in the game that ever said "there is a way up"
required him to walk several tiles first, under fire, toward a thing he had no
reason to believe existed. And v90b's OWN DOCSTRING contains the sentence "a
mechanic nobody can see is not a mechanic yet." I wrote the lesson into the patch
and then shipped a door that is invisible until you are standing on it.
*** THE RULE THIS LEAVES: A FEATURE MUST BE DISCOVERABLE FROM THE FIRST FRAME OF
THE FIGHT. If the only affordance appears once you are already at the thing, the
feature does not exist. Before shipping any new verb, LOAD THE GAME AND COUNT HOW
MANY TIMES ITS CONTROL IS ON SCREEN. ***
WHAT SHIPPED:
(a) THE BUTTON IS ALWAYS THERE when the arena has a deck, dimmed, reading
"STAIRS 4 N" -- distance plus real 8-way compass bearing off the stair tile.
Adjacent it lights and reads "UP - 1 STA"; on the deck, "DOWN - 1 STA". On a
phone the BUTTON is the reliable channel: it cannot be zoomed out of, panned off
the screen, or mistaken for scenery. The field marker is the confirm, not the ad.
(b) A TAP FROM ACROSS THE LOT POINTS instead of no-opping -- that is what a dimmed
button owes you.
(c) A BEAT-PULSING CHEVRON over the stair tile, sized in RING UNITS so it survives
the auto-frame zooming out to fit eight men, drawn AFTER the deck so the thing
that shows you the way up cannot be painted over by the way up.
(d) THE FIGHT SAYS IT HAS A STOREY, once, at the top, and every SHUFFLE says
whether the arena it just rolled has a way up or is a flat lot.
AFTER: 6 of 6 deck arenas show the button; the 2 flat lots correctly do not.
*** WHAT DID NOT CHANGE, AND MUST NOT: you still WALK there, it still costs a
stamina pip, it is still the only way up. Advertising a position is not giving it
away -- the walk under fire IS the price of the high ground, and that price is the
whole decision. ***
AND THE GATE HAD TO BE CORRECTED, NOT RELAXED: v90's own check asserted the button
"only exists when you can actually use it, on the same terms SHOVE does" -- and
THAT RULE IS THE BUG. SHOVE is a verb against a man already in your face; STAIRS is
a verb against a PLACE ACROSS THE LOT. Copying one's affordance rule onto the other
is exactly what made it unfindable. The check now asserts the invariant that
actually matters: usable only from arm's reach, visible always.
GATE: combat_lab_gate.js section 27, 441 -> 450 checks.
TOOL: tools/bohemia_combat_stairs_visible_patch.py

COMBAT (04) 7/27 - v90 + v90b: TWO-STOREY ARENAS. On his ruling: "Two-story
arenas yes." Asked for by name twice before that.
*** THE ONE RULE, AND IT IS THE WHOLE FEATURE: ACROSS LEVELS, GROUND COVER DOES
NOT COUNT, FOR EITHER OF YOU. *** From the deck you shoot men who thought they
were behind stone; from up there you are behind nothing yourself. Physically true,
one condition in one function, and the SAME SHAPE as the point-blank trade he
ruled on -- better odds to kill, worse odds to live.
IT OBEYS BOTH HIS RULINGS: no damage multiplier (KILL_DMG untouched, and gated as
untouched), and it is the FIRST thing in this game that changes what you DELIVER
by moving, which is the exact gap the north-star audit named.
MEASURED, arena #70368 (6-tile deck, 2 men on it, 15 ground cover):
    from the ground   cover working against you: 0   clean lines on you: 7
    from the deck     cover working against you: 1   clean lines on you: 6
(a) THE DECK is world-anchored tiles like the pillars, so worldShift already
carried it and every coordinate function already understood it. Rolled by the
ARENA SEED -- including WHETHER there is one (72%), so "flat lot or high ground"
is itself a difference between arenas.
(b) STAIRS: the closest deck tile to you, so there is always a way up you can walk
to rather than a puzzle about the entrance. ONE STAMINA, NO TURN (Paolo 7/26
LOCKED; his own words this session, "sprinting and not losing a turn can help
that"). Taking the high ground is priced like closing the distance.
(c) A BLADE CANNOT REACH A FLOOR ABOVE IT. Not a balance number, an arm.
(d) LEVELS DRAW RELATIVE TO YOU: the deck floats above the lot from the ground and
becomes the floor under your feet once you climb it, lot dropping away. ONE SCENE.
(e) THE READ says HIGH GROUND / HE IS ABOVE YOU plus the loud part -- that every
piece of stone on the lot just stopped counting.
*** TWO ANCHOR BUGS I CAUGHT MYSELF IN ONE TURN, SAME ROOT CAUSE, WORTH LEARNING
FROM: *** v1 anchored the deck placement on "updateGeomCover(); renderBoard();"
which is UNIQUE -- and sits inside doSuppress(), so deck placement ran inside the
SUPPRESS verb. v2 anchored on "G.e.push(e); } }" whose "} }" closes the LOOP *and*
the FUNCTION, so the block landed OUTSIDE the builder as module-level dead code
that ran once at load with G.deck undefined. BOTH passed their count asserts.
*** ANCHOR UNIQUENESS IS NOT ANCHOR CORRECTNESS. Check the BRACE DEPTH and check
WHICH FUNCTION the line is actually in. *** Both were caught by probing the live
game (deck generated fine, 0 men on it), never by reading the diff.
AND THE FIRST RENDER FAILED THE EYE: the storey face was #3e372c and the whole
deck read as a lighter PATCH OF GROUND rather than a thing with a height. VALUE
CONTRAST IS THE HEIGHT CUE -- the face is near-black against the lot now, with a
harder ground shadow and a bright lip.
FIVE OLDER GATE CHECKS string-matched the two-arg myCoverAgainst signature. Every
one re-pointed at the invariant it was protecting, never relaxed.
*** WHAT THIS IS NOT: ONE DECK, NOT A BUILDING. No rooms, no interiors, no roof,
no third floor, no ladders, no vaulting off the edge. Each of those is separate and
each is [PENDING Paolo]. This is the smallest thing that makes "two storeys" a real
decision, shipped so it gets judged BEFORE anything is stacked on top of it. ***
GATE: combat_lab_gate.js section 26, 423 -> 441 checks.
TOOLS: tools/bohemia_combat_two_storey_patch.py (the rule + the world),
       tools/bohemia_combat_two_storey_ui_patch.py (the deck, the stairs, the read)

COMBAT (04) 7/27 - v89: THE GENERATOR ONLY EVER MADE ONE ARENA, AND v88 SHIPPED
DICE FOR IT. Paolo: "I dont see new arenas shit was boring if u did anything."
He is right twice and the measurement is brutal. Six v88 arenas back to back:
  pieces 6,5,7,7,6,7   mean spread 6.50,5.79,5.91,5.99,6.43,6.70
One count range. ONE radius -- r=0.55 for every piece ever placed since the demo
shipped. One placement rule. That is ONE ARENA WITH THE DOTS MOVED, and no seed
can shuffle variety that does not exist. v88 gave him a notebook for a generator
with a single brick in it and then asked him to go find keepers.
AFTER: pieces 6,4,13,15,11,13, radius 0.45-1.15, with runs.
*** THE LESSON, AND IT IS THE ONE WORTH KEEPING: A SHUFFLE IS ONLY AS GOOD AS THE
THING IT SHUFFLES. Before shipping a re-roll, MEASURE THE SPREAD OF WHAT IT ROLLS.
If two rolls are not visibly different in a table, they will not be different on
his phone either. ***
WHAT SHIPPED:
(a) DENSITY IS A REAL RANGE: 2-15 pieces, not 5-7. Five-to-seven is a rounding
error the eye cannot see.
(b) COVER HAS A SIZE. The cover maths ALREADY scaled off P.r in every place it is
used (myCoverAgainst, realCoverPillar, segNear, the dash-path block), so nothing
needed rewriting. The number was simply never allowed to vary.
(c) PIECES CLUSTER INTO RUNS -- a share place adjacent to an existing piece, so
WALLS and CORNERS emerge from the same circle maths that already ships. A wall is
three pillars in a row, and every cover function already understands three pillars
in a row: no new geometry, no new collision, no new cover rule. This is the first
time the ground has ever argued for approaching from a particular SIDE, which is
the gap the north-star audit named.
(d) "I DONT SEE" WAS ALSO LITERAL. The ARENA button rendered blank until the first
tap, because updArenaBtn only ever ran inside the click handler -- one control in a
row of eleven, saying nothing about what it was for. It labels itself on startup.
MAP LAW HELD: density, size and clustering are PARAMETERS. No layout authored, no
arena named. The seed decides what the vocabulary says; which arenas are canon is
still only his call.
AND THE GATE CAUGHT ME: three older checks string-matched the OLD generator, and
one of them matched a COMMENT ("cover sits ON a tile"). A comment was never the
invariant. All three are rewritten to assert the rounding itself on BOTH placement
paths, which is strictly stronger than what they tested before. Never relax a check
to make a change pass -- re-point it at the thing it was actually protecting.
*** WHAT THIS IS STILL NOT: barrels on a flat lot. He originally asked for "combat
that could take place across two stories where their stairs" and "an actual arena
map". VERTICALITY AND ROOMS ARE A DIFFERENT, BIGGER BUILD and are [PENDING Paolo].
Do not pretend cover variety answered that ask. ***
GATE: combat_lab_gate.js section 25, 413 -> 423 checks.
TOOL: tools/bohemia_combat_arena_vocabulary_patch.py

COMBAT (04) 7/27 - v88: THE PROVING GROUND, AND TWO RULINGS THAT NARROW THE WHOLE
LANE. Paolo: "u want to get into point blank range and sprinting and not losing a
turn can help that. i mean when it comes to shooting theres not a lot of ways to
increase damage other than hit the killshot. just fun position and yeah. maybe its
time to add a shuffable arena map fr and add companions maybe?"
*** RULING 1, LOCKED: NO DAMAGE MULTIPLIERS. *** Position does not make the number
bigger, it makes the killshot LANDABLE. Flank-damage, elevation-damage, angle
bonuses: all dead before anyone builds one. Gated (KILL_DMG stays flat).
*** RULING 2: POINT BLANK IS THE OFFENSIVE PLAY -- AND IT WAS ALREADY BUILT, JUST
INVISIBLE. *** distPkg drops the needle to the EASIEST tier in the game at point
blank on ANY difficulty; distAccuracy takes their hit chance on you 0.37 -> 0.97.
A complete, shipped risk/reward that no player has ever been shown either half of.
MY 7/27 AUDIT CALLED THIS "the wrong way for tension" AND HE CORRECTED ME: it IS
the tension. The audit is corrected in place with his ruling quoted.
WHAT SHIPPED:
(a) SEEDED ARENAS. BohemiaArena.withDice() runs the whole encounter build --
cover, spawns, looks, weapons -- on a deterministic PRNG, then hands Math.random
STRAIGHT BACK (gated, including when the generator throws; a proving ground that
quietly made the whole game deterministic would be a worse bug than the one it
fixes). One number reproduces one exact fight forever.
MAP LAW HELD: the generator is WRAPPED, not rewritten. Claude authored no layout.
This is the MAP LAW hook made literal -- I hand him the dice and the notebook, HE
says which arena numbers are canon. An arena without a seed is random mush you
cannot even talk about, let alone keep.
(b) SHUFFLE. One button, ARENA #4417. Re-rolls cover and spawns WITHOUT touching
HP or streak, so a dozen arenas cost a dozen seconds instead of a fight each. It
writes the seed into the comment box (COPY already sits beside it) and reads a
number back out of that same box to REPLAY an arena. Zero new UI.
(c) THE RANGE READ, under the dial, always on, computed from THE SAME expressions
the fight runs so it can never drift out of step:
    at  3 tiles: POINT BLANK · his dial: EASY   · he hits you 97%
    at 15 tiles: MID RANGE   · his dial: NORMAL · he hits you 67%
    at 30 tiles: LONG RANGE  · his dial: V.HARD · he hits you 37%
*** THE BUG THE CLICK TEST CAUGHT, AND WHY CLICK TESTS EARN THEIR KEEP: *** the
button wrote the seed OUT into the comment box and then read that box on the way
back IN, so it locked itself to the first arena and SHUFFLE only ever shuffled
once. Three taps, one arena. No amount of reading the code would have shown it;
tapping the button three times showed it instantly. The box is now a REQUEST only
when PAOLO put the number there, never when I did. Gated.
NOT BUILT: COMPANIONS. He said "maybe?", and it carries a dozen unruled decisions
-- who they are, what they cost, whether they can die, whether you order them or
they act on stances. Building one on spec while he is asking a question is what
STOP PRODUCING forbids. The arena is what they get tested IN, so it came first
either way. [PENDING Paolo]
GATE: combat_lab_gate.js section 24, 399 -> 413 checks.
TOOL: tools/bohemia_combat_proving_ground_patch.py

COMBAT (04) 7/27 - *** THE COMBAT NORTH STAR, LOCKED, AND THE AUDIT AGAINST IT.
READ THIS BEFORE PROPOSING ANYTHING FOR COMBAT, EVER. ***
Paolo, asked what actually makes a fight fun for him, verbatim:
  "the strategy choice to deal the most damage and take the least amount of damage
   by positioning and abilities and deeper understanding of mechanics. gameplay.
   feeling snappy and violent and human and fun."
LAW: laws/BOHEMIA_ADDENDUM_WHAT_COMBAT_IS_FOR_7_27_26.md
THE TEST EVERY COMBAT ITEM NOW PASSES OR DIES: does it change how much damage I
DEAL or TAKE, through POSITION, SPEND, or KNOWLEDGE? If no, it is not a combat
feature. It may still be worth doing -- feedback, art, sound, readability all
matter -- but it never leads a combat pick-list. (He said the word "gameplay" on
its own for a reason: the turn before, he killed a presentation idea.)
AUDIT OF THE SHIPPING DEMO, real numbers out of COMBAT_B64:
records/BOHEMIA_COMBAT_AUDIT_AGAINST_THE_NORTH_STAR_7_27_26.md
  TAKE LESS DAMAGE BY POSITION -- IMPLEMENTED, STRONGLY, BUT BINARY. myCoverAgainst
  is a predicate every incoming-fire path FILTERS on, so an enemy you have cover
  against is REMOVED FROM THE VOLLEY ENTIRELY. 0% or 100%, never a modifier. Range
  is a real curve on top: distAccuracy = 0.97 - distT*0.60, so 0.97 at point blank,
  0.67 at 15 tiles, 0.37 at 26+. A 2.6x swing.
  DEAL MORE DAMAGE BY POSITION -- *** ABSENT. *** KILL_DMG=100, flat, applied
  through armor, from anywhere on the map. There is NO positional term anywhere in
  the player's damage path: no flank, no angle, no point-blank lethality, no
  elevation, no exposure bonus. The dial's band widths (fgv) scale on difficulty,
  steady aim and kill streak and NEVER on where you stand. Range touches only which
  needle PATTERN you get (distPkg) -- an execution effect, not a damage one -- and
  it points the wrong way for tension, because the safest place to stand is also
  the easiest place to shoot from.
  ABILITIES -- 7 verbs on 3 pips (STAM_MAX=3, +1 only if you spent none, no turn
  cost per Paolo 7/26 LOCKED). A real, well-shaped spend economy. But sort them by
  effect and move/dash/vault/sprint/suppress/shove are ALL DEFENSIVE; only the
  grenade touches output. NOTHING CAN BE SPENT TO HIT HARDER.
  UNDERSTANDING -- the strongest leg and the quietest. Per-enemy patterns pulled by
  range and difficulty, band widths that widen with steady and streak, per-weapon
  lethality gates, cover geometry that must both block AND sit near the man,
  readable enemy fire cycles. Real skill ceiling, mostly unlabelled. That is a
  LEGIBILITY problem, not a missing mechanic -- same shape as the SUPPRESS
  complaint he has now made three times.
*** THE ONE ASYMMETRY, AND IT IS THE WHOLE FINDING: POSITION CONTROLS WHAT YOU
SUFFER AND NOTHING ABOUT WHAT YOU DELIVER. *** So moving reads as defensive
housekeeping rather than offence, and the ground never argues for attacking from a
particular place, because no place is better to attack from. Optimal play today is
get behind stone, get far away, press well.
WHAT SHAPE THE ANSWER TAKES IS [PENDING Paolo] AND NOTHING IS PRE-SELECTED.
Flanking, elevation, point-blank lethality, exposure windows and angle-of-fire are
each a DIFFERENT GAME. MECHANISM-MINE / CONTENTS-PAOLO'S applies: do not pick one
for him, do not build one on spec.
GATE: combat_lab_gate.js section 23, 390 -> 399 checks. It does NOT gate a feature.
It PINS THE AUDIT TO THE LIVE CODE -- the damage constant, the accuracy curve, the
distance bands, the binary cover predicate, the stamina ceiling, and the headline
finding that no positional term multiplies player damage. Change the model and the
gate fails, which forces this note and the audit back into line the same turn. It
is a machine that will tell us the day this stops being true.

COMBAT (04) 7/27 - *** THE TALLY IS DEAD. KILLED AT THE PITCH, NEVER BUILT. ***
Paolo: "this was terrible i hated this this was not a gameplay mechanic this is
more data to be proud of no one gives a fuck."
He is right, and his sentence is the entire diagnosis. A TALLY CHANGES NO DECISION
THE PLAYER MAKES. It happens after the outcome is already fixed. It is a
presentation layer wearing a mechanic's clothes, and it was pitched in answer to
"make combat more fun".
ROOT CAUSE, and it is a repeat: the research doc had six items. FIVE were
mechanics (the bank, enemy intent, the beat counter, the district remembers, the
kill cam earning its length). ONE was pure presentation. I put that one at #1,
because the Balatro research was the most impressive thing I read that day -- not
because it changed what anyone DOES. The 7/20 queued-actions grammar kill says the
same thing in the graveyard already: "research ranks candidates, only PLAY
decides." Second time.
AND I HALF-KNEW: my own reply one turn earlier said the tally "only works if the
number costs something" and that the receipt payout is decorative (the source
literally says "real XP numbers PENDING Paolo"). I found the hole, hedged, and
kept the item at #1 anyway. A pitch with a hole in it is a dead pitch -- say so
and drop it, never ship it with a caveat attached.
*** THE LANE RULE THIS LEAVES, APPLY IT BEFORE ANYTHING GOES ON A LIST: IF IT DOES
NOT CHANGE A DECISION THE PLAYER MAKES, IT IS NOT A MECHANIC. *** Anything after
the outcome is locked -- tally, grade, summary, stat, badge, receipt -- is
FEEDBACK. Bohemia already has more feedback than it uses. Feedback is never the
answer to "make combat more fun" and it never leads a pick-list again.
GRAVEYARD: gates/bohemia_graveyard.txt ("THE PAYOUT IS A DRUM FILL").
POST-MORTEM: records/BOHEMIA_TALLY_KILL_7_27_26.txt.
NOT DEAD: the existing receipt (fine as what it is, untouched, not the problem),
and research items 2-6, which were never judged and still stand.
STOP PRODUCING: scoring presentation is ENDED as a subject for this session.
Nothing was built and nothing gets built. No v2, no "what if it were shorter".

COMBAT (04) 7/27 - v87: THE ORANGE WAS THE STREAK GLOW. SIXTH REPORT, AND THE
REASON FIVE REPRODUCTIONS FOUND NOTHING IS THE MOST USEFUL THING IN THIS FILE:
*** EVERY PROBE I EVER WROTE KILLS ONE MAN. PAOLO PLAYS WHOLE ENCOUNTERS. ***
CHAIN ESCALATION only draws at killStreak>=2. It is a FULL-SCREEN rgba(255,60,40)
radial wash, brightest at the screen EDGE -- which is exactly where the dial sits,
which is why he called it "the orange part of the dead shot dial" all week while I
kept measuring the dial's own arcs and correctly finding them faded to zero. He
was pointing at the right pixels and naming the nearest landmark.
MEASURED at a 3-streak, by recording the colour stop the game actually asks for:
    +  875ms  ks.t=0.871  freeze=0     rgba(255,60,40) alpha=0.199
    + 2284ms  ks.t=0.969  freeze=HELD  rgba(255,60,40) alpha=0.190
1.4 seconds of wall time, 0.009 of fade, because (1-p) rides ks.t and the hit-stop
pins ks.t. IN PIXELS, freeze frame, mean of the outer 12% of the screen:
    before  rgb(70.8, 53.1, 42.4)  380 warm px
    after   rgb(25.7, 24.8, 31.0)    0 warm px
THE LAW: laws/BOHEMIA_ADDENDUM_THE_PAUSE_IS_EMPTY_7_27_26.md. While the world is
frozen, NOTHING DECORATIVE DRAWS -- not dimmed, ABSENT. And the corollary that
cost a week: A PINNED CLOCK DOES NOT STOP A DRAWING, IT WELDS IT ON AT ITS
BRIGHTEST. Four effects in this codebase were the same bug: the floor pulse (v84),
the gold chip (v85), the white punch (v86) and the streak glow (v87, his).
WHAT SHIPPED: (a) the glow blooms and leaves -- one beat, wall clock, never during
a stop. (b) _df, the one alpha owning the ENTIRE dial, is 0 while frozen; safe
because the demo already resets globalAlpha to 1 before drawKillshotWorld ("dial
fade never touches the killshot world"), so bullet/blood/bodies are untouched.
(c) WHAT'S ON SCREEN v2 -- v1 could never have found this: fills only, a 2% size
floor, and a gradient fill stringifies to "[object CanvasGradient]", a string with
no colour in it. Now watches strokes and gradient colour stops and keeps anything
WARM at any size.
*** TWO HARNESS RULES, BOTH EARNED THE HARD WAY ***
1. REPRODUCE AT THE STATE HE PLAYS IN, not the cheapest state that runs. A
   one-kill harness cannot see a streak effect. If the report says "by the end of
   my encounters", the harness must get to the end of an encounter.
2. THRESHOLDS HIDE BUGS. Five pixel scans came back clean because they tested
   r>100, and rgba(255,60,40) at alpha 0.19 over this floor composites to about
   rgb(72,31,24). The wash was in every screenshot I ever took. My filter deleted it.
GATE: combat_lab_gate.js section 22, 381 -> 390 checks.
TOOL: tools/bohemia_combat_pause_is_empty_patch.py

*** ANIMATION IS NOT THIS LANE'S (Paolo 7/27): "right now in my other chats, I'm
in the middle of revamping the animations so don't worry too much about it." ONE
SYSTEM, ONE SESSION. Do not touch a clip, a death sequence or the rig from the
combat lane until he says otherwise. v85's headshot work is DONE and hands off. ***

COMBAT (04) 7/27 - RESEARCH: THE ADDICTIVE SAUCE, on his ask.
records/BOHEMIA_COMBAT_RESEARCH_THE_ADDICTIVE_SAUCE_7_27_26.md
HEADLINE: BOHEMIA IS A CASINO GAME THAT DOES NOT YET PAY OUT LIKE ONE. Balatro's
addiction engine is not the poker, it is THE TALLY -- the score assembling itself
one element at a time, pitch and speed climbing into a crescendo. Bohemia already
owns every part of that (the casino receipt, the wager, gold chips as flying
currency, the kill streak, the graded press) and spends none of them, AND it has
the one thing Balatro has to fake with a pitch ramp: a 120 BPM grid. A payout that
lands each element on a sixteenth in the faction's own scale IS a drum fill.
RANKED PICK-LIST, ALL [PENDING Paolo]: 1 the payout is a drum fill, 2 THE BANK
(push-your-luck staked on the wager he already invented -- what a bust costs is
his call), 3 enemy intent on by default (Into the Breach: every death is your own
fault), 4 the optional beat counter (Hi-Fi Rush's documented accessibility
answer), 5 the district remembers, 6 the kill cam earns its length from the stake.
THE WARNING EVERY SOURCE AGREES ON: layered rewards must not compete for the same
second. He said it himself about audio on 7/26 ("a lot of volume fighting each
other"); v87 proves the identical failure existed visually.

COMBAT (04) 7/27 - v86: THE REST OF THE JUICE PASS, AND EVERY DURATION IS NOW A
NOTE. Built while Paolo slept, on "do what you have to do next and know what comes
after." Chosen because it is the lane's top item that needs NO verdict from him:
backlog 1e, his own pick-list, marked "no" for thumbs, standing word "I want more
juice. I want this to be juicy and fun and just like wow."
AUDITING FIRST (REUSE-FIRST) TURNED THREE OF FIVE ITEMS INTO BUGS.
(a) THE SHOT FLASH WAS FRAME-COUNTED. flash-=0.08 PER FRAME = 208ms at 60Hz and
104ms on his 120Hz phone. That is not a duration, it is a refresh rate, and it is
the SAME defect class as the frame-counted hit-stop v81 killed, sitting untouched
in a second place nobody thought to check.
(b) THE KILLSHOT PUNCH WAS A FRACTION OF ks.dur. 1-p*3 and 1-p*4 meant the same
white ran 0.167s behind a clean kill and 0.375s behind a sharp one -- same event,
duration decided by whichever cinematic the shuffle rolled.
(c) AND THE ZERO WAS WRONG TWICE, both caught by the probe instead of by Paolo.
Keyed to ks.t, the hit-stop PINNED it: 633ms of white behind a sharp kill. Keyed to
G._ksAt, it never drew AT ALL, because the HELD BREATH runs first and
driveKillshotCamera early-returns through the whole of it, so the effect expired
before its own code was reached. The honest zero is G._ksGo, stamped on the first
frame the cinematic actually draws. MEASURED AFTER: clean 91ms, sharp 115ms.
(d) RECOIL now comes home ON the next sixteenth (was dt*4.5 = 0.222s, which lands
between a sixteenth and an eighth). Measured 1 -> 0 in 130ms.
(e) THE HELD BREATH was 0.12s against a sixteenth of 0.125s. 4% off the grid, in
the one system whose entire premise is the 120 BPM law.
(f) PERMANENCE: brass is FLOOR STATE by AF v3, except the cap was 14, so the
fifteenth casing silently deleted the first and the ground stopped accumulating
within seconds of a real firefight. Now 96, still bounded, still cleared on a fresh
fight.
(g) THE IMPACT THROWS ALONG THE SHOT. Twelve particles at k/12*6.28 is a perfect
circle, the one shape a real impact never makes, and it threw away the only thing a
burst exists to carry: where it came from. Now x1.30 down-range, x0.45 behind.
NOT SHIPPED, ON PURPOSE: THE CAMERA THAT LEADS THE SHOT. Everything above is a
defect with a right answer. Camera lead is a FEEL decision with a dozen right
answers, and inventing one while he is asleep is exactly what STOP PRODUCING
forbids. It stays on his pick-list, unbuilt, waiting for him.
LAW: laws/BOHEMIA_ADDENDUM_EVERY_DURATION_IS_A_NOTE_7_27_26.md -- a visual
duration is a NOTE VALUE in SECONDS from ONE NAMED TABLE (JUICEMS). Banned: a
per-frame decrement, a fraction of something else's length, and a number NEAR a
note. And the CLOCK is part of the duration: pick it by what the effect reacts to,
then check that nothing pauses, precedes or rescales it between event and draw.
GATE: combat_lab_gate.js section 21, 368 -> 381 checks. It EXECUTES the freeze core
plus JUICEMS and asserts every value passes BohemiaFreeze.isNote.
TOOL: tools/bohemia_combat_juice_grid_patch.py

COMBAT (04) 7/27 - v85: BOTH BOXES NAMED IN A CAPTURED FRAME, BOTH DELETED, AND
THE HEADSHOT ANIMATION HE ASKED FOR THREE TIMES TURNED OUT TO BE THE SAME LINE.
Paolo, the FIFTH time: "Brown box still their kill shot orange box doesnt fade away
bro." Five reports, five shipped fixes, five misses. So this turn produced a
REPRODUCTION before it produced a patch, and that is now law.
THE INSTRUMENT THAT FINALLY WORKED (scratchpad/spot.js): hook fillRect + drawImage +
arc/fill + arc/stroke (THE DIAL IS DRAWN WITH STROKES - every fill-only probe I built
was structurally blind to it), convert every draw to SCREEN space through
ctx.getTransform() (raw arguments are meaningless inside a 3x camera; that filter is
what threw the brown box out of my own report), let the cinematic RUN untouched, and
dump everything landing on the body at the frozen frame. One run, both answers:
    THE BROWN BOX   fillRect rgba(70,60,50,0.984)  @197,272  42x50
    THE ORANGE ONE  arcFill  rgba(255,200,70,0.55) @197,237  9x9 + glow + trails
(a) THE BROWN BOX was drawKillshotWorld's LEGACY_PRE_REVAMP stand-in body. Its alpha
is 1-ip*0.8 and ip is 0 at contact, so it was never translucent at the moment that
matters - a SOLID slab - and the freeze holds ks.t still, so it stayed solid for the
entire pause. DELETED.
(b) AND THAT IS THE HEADSHOT ANSWER. Its own comment has said so since 7/3/26: "still
drops/fades ON TOP of the real sprite death playing underneath ... delete at cleanup."
HEADSHOT 1 + HEADSHOT 2 were never missing. L.death is a 12-frame clip with three
rolled variants, stepped contact-timed off _deadAt, playing correctly every kill,
under a placeholder square. One deletion, two complaints.
(c) THE ORANGE ONE was the JUICE.T gold payout chip. It spawns AT contact - the same
instant the freeze starts - and flies on p.t, which rides dt, which is 0 while frozen.
So the payout hung on the corpse, gold and glowing, for the whole pause. "Doesn't fade
away" was literally correct. It no longer draws during a freeze: the stop belongs to
the kill, the reward comes after it.
(d) THE STOP IS A STILL, INCLUDING THE BODY, AND THE PAUSE IS PAID BACK. visNow() pins
the body's clock to the instant the freeze began. Pinning alone was half a fix: _deadAt
is raw wall time, so the clip SNAPPED forward the moment the world moved - measured
frame 0 held, then straight to 4 of 12, i.e. the drop he paused FOR is the part that
got skipped. Every body timestamp now advances by exactly the frozen duration on
release. Measured after: ALIVE 0 [1 1 1 1 held] release 1 2 3 3 4 5 6 7 8 8 9 10 11.
THE GENERAL BUG CLASS, and three of this session's five bugs are it: dt=0 freezes the
SIMULATION, not anything driven by performance.now() and not anything whose APPEARANCE
is a pure function of a pinned value. A pinned clock does not stop a drawing, it
FREEZES it at whatever value it had, which is usually the brightest one. When you pin
a clock, audit everything that reads it.
LAW: laws/BOHEMIA_ADDENDUM_REPRODUCE_BEFORE_YOU_FIX_7_27_26.md - for any defect Paolo
reports VISUALLY, the first deliverable is a REPRODUCTION, not a fix; a second report
of the same symptom ends the guessing immediately and the next turn buys the
instrument. Also: a LEGACY_PRE_REVAMP marker with a Paolo date on it is a BUG WITH A
DEADLINE, not a comment, and it is the FIRST suspect in its neighbourhood.
GATE: combat_lab_gate.js section 20, 359 -> 368 checks.
TOOL: tools/bohemia_combat_brownbox_kill_patch.py
STILL UNJUDGED AND THAT IS THE ASK: he has never actually SEEN the death clips, so
the fall itself has never been judged. Do NOT cook a new one before he looks at the
one that was already there.

COMBAT (04) 7/27 - v84: I BUILT THE INSTRUMENT AND IT NAMED BOTH OF THEM.
Paolo, a third time: "the brown box is absolutely still there and the dead shot
dial orange part is still there like what's wrong with you bro."
THE BREAKTHROUGH WAS A HARNESS BUG, NOT A CODE BUG: my probe kept FREEZING the
game in order to photograph it, which stopped the very cinematic it was measuring
(dt=0 halts ks.t). Letting the killshot RUN and screenshotting every 60ms showed
the frame instantly.
(1) THE BROWN BOX IS A REGRESSION I CAUSED. JUICE.B FLOOR PULSE fills the WHOLE
canvas with the faction ACCENT once a beat, and EVERY accent is an orange-brown
(#d07a2a #b8642a #caa05a #d8a23a #caa83a). v82 pinned _bpmPhase to stop the screen
breathing during a freeze - and pb is a function of that phase, so the wash WELDED
ON at whatever brightness it had, at MAXIMUM if the kill landed just after a
downbeat, for the entire pause. FIXED: the pulse does not draw while frozen. The
pulse is the metronome made visible; a pulsing ground during a dead stop is a
contradiction.
(2) THE ORANGE WAS NEVER THE DIAL. Named by the INSTRUMENT, not by me:
    x10  fill rgba(184,160,40,0.55)  2x2670  (3.1% of screen)
That is the ROAD'S DOUBLE-YELLOW MEDIAN, drawn ten times per pause as a
full-height gold stripe. THAT is why fading the dial TWICE changed nothing he
could see - I was fading the wrong object, twice. It survives because drawFloor
lays base + pulse + VIGNETTE and then drawField paints the markings ON TOP of the
vignette, so the one pass meant to dim the scene runs before the brightest thing
in it. FIXED: the markings and lane dashes fade with the shot. Verified by the
instrument itself: rgba(184,160,40,0) at the pause.
(3) *** THE INSTRUMENT: "WHAT'S ON SCREEN?" *** A settings button. Arm it, get a
kill, and at the freeze the game records EVERY draw covering >2% of the canvas
(colour, size, kind), collapses duplicates, sorts BIGGEST FIRST, and writes the
list into the COMMENT BOX - which already has a COPY button beside it. One tap and
he sends me the answer. Off by default, costs nothing when off, only writes text.
THIS EXISTS BECAUSE THREE TURNS WERE BURNED GUESSING AT A SCREENSHOT. It never
costs three turns again.
A REAL BUG IN MY OWN REPORTER, caught by the gate: the sort parsed the percentage
back out of the label string, and 'rgba(184,...' has an earlier paren than the
percentage does - so it was sorting on 184. Fixed at the root (pct kept as a
number), not by loosening the assertion.
Gate: section 19 EXECUTES the reporter (threshold, dedupe, sort, disarm) and
asserts the vignette-before-markings ordering that let the stripe survive.
359 checks green.

COMBAT (04) 7/27 - *** I STOPPED. THREE WRONG FIXES IN A ROW. *** Post-mortem +
the research he asked for: records/BOHEMIA_COMBAT_POSTMORTEM_AND_RESEARCH_3_7_27_26.md
Paolo: "That brown box is absolutely still there... I didn't even see you do
anything or change anything... the orange shit from the dead shot dial is still
there by the time the game pauses."
THE DEPLOY IS NOT THE EXCUSE: run 8dcb1247 concluded SUCCESS at 03:34 and main
contains it. HE WAS PLAYING MY CODE. It just did not fix his problem.
ROOT CAUSE, ONE THING: I NEVER REPRODUCED THE FRAME. v81/v82/v83 were all
reasoning about code I could not watch running - the kill cinematic will not drive
headless (fireNow returns early unless the needle is dead-centre; startKillshot
directly leaves ks.t at 0). So I sampled a colour from his screenshot, grep'd for
the nearest match, found two blocks the source itself labelled LEGACY_PRE_REVAMP,
and concluded because it FIT THE STORY. They were dead code and deleting them was
harmless. THEY WERE NOT HIS BROWN BOX.
WHAT THE CANVAS HOOK DID PROVE (wrapping CanvasRenderingContext2D.prototype,
133,811 draws captured during a killshot):
  x108  fillRect  rgba(184,160,40,..)  2x2670  on cv   <-- THE ORANGE HE MEANS
Those are DIAL ELEMENTS DRAWN OUTSIDE THE _df ALPHA BLOCK, which is exactly why
tightening _df changed nothing he could see. FIRST HARD EVIDENCE IN THREE
ATTEMPTS - but NOT SHIPPED, because one lead after three misses is still a guess.
THE BLOCKER, and it is the only thing that matters next: I need to SEE the frame.
Two options, neither built, HIS CALL: (1) a DEBUG CAPTURE in the build that names
every draw covering >2% of the screen during the freeze and prints it in the
combat log - he taps once, sends the text, the guessing ends permanently for this
and every future "what is that thing"; (2) make the killshot drivable headlessly
with a test hook so this class of bug is reproducible forever.
*** THE PROCESS FIX, now a rule for this lane: FOR ANY DEFECT PAOLO REPORTS
VISUALLY, THE FIRST DELIVERABLE IS A REPRODUCTION, NOT A FIX. If I cannot
reproduce it I say so THAT TURN and build the instrument instead of the patch. A
fix for something I cannot reproduce is a guess, and a guess shipped as a fix is
a lie. Three times today I shipped a green gate against a defect he could still
see; the gate was never wrong, it was answering a question I chose, and I kept
choosing the wrong question. ***
HE HAS NOW NAMED THESE TWICE AND THEY ARE STILL NOT STARTED:
  - HEADSHOT 1 and HEADSHOT 2 animations (specific, named - NOT a category to
    design). A COOK under LEAF-PIXEL + RIG law. Next after the box is real-fixed.
  - SUPPRESS: THIRD time he has said it is confusing. Research says XCOM's version
    confuses XCOM players too ("suppression's tactical value isn't self-evident").
    The fix is NOT more mechanics, it is a LEGIBLE PROMISE the player can hold in
    one sentence, shown ON THE MAN and not in a readout. [PENDING Paolo] what that
    promise is - he has asked three times, so he wants a RULE, not another tweak.
RESEARCH DELIVERED (Hades, XCOM suppression, reward schedules): the Hades
consensus is that the feel is RESPONSIVENESS, not content - every hit gives
DISTINCT feedback (a graze, a vital and a kill should be three different events,
not one event at three sizes), enemy intent lives in the ANIMATION not a UI
element, and the camera's job is to keep the arena readable (which Bohemia's kill
camera is currently doing the OPPOSITE of). On reward: variable-ratio is the most
powerful schedule and it is ALSO the slot-machine trap - in a game about what that
machinery did to Las Vegas, building it into combat would be the game arguing
against itself; put the variance in the SITUATION, never in whether a correct
input worked. The groove chain and kill ladder currently pay out only in MUSIC and
nothing the player KEEPS - what that converts into is his call, it is content.

COMBAT (04) 7/26 - v83: THE BROWN BOX WAS DEAD CODE FROM BEFORE THE SPRITES.
Paolo sent a SCREENSHOT: "there's a brown square that covers everything in... and
as that bullet's travelling the dead shot dial can like fade away, so by the time
there's that pause the dead shot dial is not there, cause it kind of looks like
shit." BOTH FIXED, both found by LOOKING (his screen, then the real surface).
(1) THE BROWN BOX. Sampled his screenshot: the quad is #6c503b, a warm mid-brown.
NOT the pillar khaki (#6e604a), NOT the faction floor (all near-black). Searching
the demo for that colour landed on two blocks BOTH LABELLED LEGACY_PRE_REVAMP in
the source - placeholder bodies from before the game had real sprites: a 6S x 7S
brown torso rect + a 4S head square, drawn via px(). S is min(W,H)/90, so ~26x30px
on a phone - and the killshot runs them through the BOARD ZOOM (up to 3.6x) AND
the kill camera, landing as a slab well over 100px across, right where the camera
is pointed. DELETED, not hidden. A missing sprite now draws NOTHING and LOGS it,
because a missing body is a bug to find, not a box to paint over the frame. That
is NAME IT OR DON'T DRAW IT applied literally: a nameless brown slab standing in
for a human being is exactly what the law forbids.
(2) THE DIAL WAS STILL 74% VISIBLE AT IMPACT. A dial fade already existed (7/3):
a flat 350ms from G._ksAt. But the bullet's contact time is dur * travelFrac, and
a SHARP shot at the minimum 0.5s dur contacts at 90ms -- so the dial was at 0.74
in the exact frame he screenshotted. It now fades across the BULLET'S OWN TRAVEL
TIME, derived from the same two numbers the bullet uses (ks.dur and the style's
travel fraction), so it reaches ZERO at contact and can never drift out of step
with the shot it covers. Worst case across every style x duration the game can
roll: 0.00 at impact.
Gate: section 18 EXECUTES both fade curves at every style and duration and proves
the OLD one left the instrument on screen (that is the assertion that matters -
it fails if someone reverts to a flat timer). 346 checks green.
*** RECORDED, NOT BUILT: he also said "this would also be a great time to start
the headshot fall animation and whatever category of animation we put towards
people getting shot." That is an ANIMATION CATEGORY - a cook, and ART lane
territory (LEAF-PIXEL LAW, RIG LAW, the 45 DEGREE LAW). Backlog item. Not
started; it needs a spec of the categories and his eye, not a guess. ***

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

COORDINATOR (07): read-only across lanes. 7/28 LATEST — THE ENGINE REALITY MAP
SHIPPED: laws/BOHEMIA_ENGINE_REALITY_MAP_7_28_26.md. Paolo ordered engine
foresight "not your numbers and hallucinated guesses"; two independent
read-only auditors swept the run, the alpha (decoded COMBAT_B64 + CITY_B64),
and engine/, every claim file:line-cited and measured. EVERY SESSION CHECKS IT
BEFORE ASSUMING ANY ENGINE CAPABILITY (now in the GO procedure read order,
doctrine §2.1). The ten true gaps are ranked in it; the fixes are routed into
the backlog as ER items (RUN 0d: run ignores the streaming engine + 2 save
bugs + daycycle unwired; WORLD ER: stair/z-level engine half + phantom desert
residents; COMBAT ER: BohemiaMelee has no engine module and no resync tool —
the wall in front of allies/ambient/seamless; CITY ER: zero people on the
human-mode walk; SHARED 4-5: FPS gauge + sync-net widening). One stale law
corrected in place: the run-handoff contract's "warmed frame / 14ms" claim
(warming was reverted 7/26; correction block added to that addendum).
7/28 LATER, THREE RULINGS OFF THE MAP, all recorded same turn: (1) REAL
COMBAT ON THE WALK — "in the exact whole coding how we built it" =
extraction never rewrite, byte-identical dial, faster-tab-swap dead as a
goal (laws/BOHEMIA_ADDENDUM_REAL_COMBAT_ON_THE_WALK_7_28_26.md, COMBAT ER
amended). (2) VEGAS WEATHER — yes, three states only (sunny default /
cloudy / rain ~once a month, an event), NOT diverse, dead foliage is the
baseline not a weather effect (laws/BOHEMIA_ADDENDUM_VEGAS_WEATHER_
7_28_26.md, WORLD ER(c)). (3) THE FULL TILE REQUEST FORM — his order;
BOHEMIA_TILE_REQUESTS.md expanded to the master board: 9 OPEN rows (6 HIGH
incl. seamless desert ground, dead foliage set, weather overlays) + 4 HELD
rows blocked on named picks (hook pick, school word, recipe verdict,
upgrade roster). Every row sourced from recorded rulings, nothing invented.
7/28 LATEST: THE FORM LAW. Paolo ordered "the world's best tile request
form" he can paste into every chat — BOHEMIA_TILE_REQUEST_FORM.md (repo
root) is the template + law: one form per tile, sections A-J
(why/where/when/how, the machine-readable CAPTION that ships with the tile —
his "invisible text" of best time/location/never-beside — real-Vegas
grounding, the anti-reference, acceptance tests incl. measured seams and 3x3
tiled proof). Worked example at the bar: records/tileforms/TF-RUN-001_
desert_ground.md. Board rows now require a filled form; ART cooks from
forms only. Gate routed: SHARED 6 (tileform_gate + caption ingest).
WHEN PAOLO PASTES THE ORDER INTO YOUR CHAT: walk your lane's surfaces,
list every uncovered tile need, fill one form each into records/tileforms/
(TF-<LANE>-<NNN>), row each on the board. Do not cook.
Earlier: the architecture map, the findings (quest-rescue plan since
executed, collision watch), the prompt library, and this diet. REPO CLEANUP: DONE, both phases (7/26). The full
pre-slim history (every commit 7/16-7/26, all branches) lives permanently in
paolosarn/bohemia-vault, byte-verified before the rewrite; main is a SLIM
GENESIS of the identical tree. Procedure + keep-it-slim rules:
laws/BOHEMIA_ADDENDUM_REPO_DIET_7_25_26.md. Future slims repeat the same
archive-first procedure; the coordinator watches repo weight on check-ins.

=============================================================================
## PENDING PAOLO (the shelf — never decide these for him)
=============================================================================
- (OPTIONAL, no longer asked of him — 7/28 amendment) pack uploads remain
  welcome any time but AI authors the tiles under the quality harness.
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
