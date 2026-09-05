# WHAT EVERY CHAT DOES FOR THE REST OF THE GAME
# (coordinator, 9/4/26, on Paolo's order: "big brain research on what every
# chat needs to be doing for the rest of the game at all times... help me do
# everything at a click of a button... Know what u know and know what u dont.")
# Method: eight read-only readers, one per lane, sent in parallel with the
# same brief (last real ship, what exists verified by grep, what a finished
# game still needs, top jobs, dormant?, could-not-verify), plus one reader
# scoring the twenty pillars of the locked design. Every claim below is
# either a reader's grep, my own measurement today, or marked as unverified.

## 1. THE SCORECARD: TWENTY PILLARS OF THE FINISHED GAME
Status is what a PLAYER can reach, not what a document says.
```
 1 the cold open, the sibling, the vista        BUILT     four Act 1 scenes, 68 beats, in the demo
 2 one full day, wake to reckoning              BUILT     the day loop, gated
 3 the phone and jobs                           BUILT
 4 27 side quests playable                      PARTLY    all 27 in the demo file; the demo mounts 5; none pays
 5 MAIN story, act 1                            PARTLY    four scenes and NO main-quest .bq file at all
 6 act 2                                        PAPER     zero act2 in any playable file
 7 act 3 and the gen-3 Angel ending             PAPER     zero
 8 the handoff, gen 1 to gen 2                  PAPER     selectHeir exists with ZERO callers; nothing ever writes a child
 9 the perk tree across the fold                PARTLY    23 perks BUILT inside the fight, saved; nothing outside reads them
10 the boss ladder, 60 bosses                   PARTLY    53 WIRED inside the fight; 2 of 53 grants name a verb the engine owns
11 RF4 combat on the beat                       PARTLY    built; the free-movement budget row still open
12 the companion                                BUILT     in the fight, measured 0% to 60% on eight-man rooms
13 a fight entered from the city                BUILT     the door is the fight, gate 26/0; the INDOOR half is missing
14 the city-builder: build it, it produces      NOT STARTED (playably)  build verbs + UI exist in the aerial tab only;
                                                          produce() has one caller and it is a gate; you cannot build where he walks
15 factions hold ground where he walks          PARTLY    the owner map is the lights; nobody holds ground
16 the economy circulates (pay, buy, drain)     PARTLY    pipe built and called; tables empty; nothing drains
17 a save that survives                         BUILT     second-best-built thing in the repo; the people are outside it
18 the sound bed                                PARTLY    14 of 65 sounds reachable, all reactions; no bed
19 the demo as its own link                     BUILT     slices/BOHEMIA_DEMO.html, re-cut 9/1
20 gen 1, the ANIMAL, playable at all           NOT STARTED  every "animal" hit is wildlife
```
**BUILT 7. PARTLY 8. PAPER 3. NOT STARTED 2.** Every BUILT pillar is
Act 1 of Gen 2, the human. **Gen 1 Animal, the fold to Gen 3, Act 2 and
Act 3 have no presence on any surface a player can reach.** Against a
hundred-hour three-generation game, what exists is one act of one life.
Two corrections to the reader's table, from my own runs today: row 16 was
scored BUILT off a status banner that says "GET PAID is live"; I ran it and
it pays 0/0/0. Rows 10 and 12 were scored low off a grep that cannot see
the base64 fight; the decoded fight has 53 bosses and the companion wired.

## 2. THE TWO HOLES NOBODY OWNS
- **THE DYNASTY SPINE.** Act 2, Act 3, the fold, the heir, the Angel: all
  paper, and **no chat has ever been responsible for them.** The QUESTS lane
  has no handoff block and no lane-authored ship since 8/21. The 27 quests
  are all side quests; there is not one main-quest file. This is the
  biggest hole in the game and it has no owner.
- **THE CITY-BUILDER.** His only economy law says buildings house people or
  produce one of three things, and that is the whole builder. Today: no
  building produces anything, nothing houses anybody, building costs
  nothing, and you cannot build from the surface he walks. About a quarter
  exists (placement verbs and a picker, in a tab the demo does not carry).

## 3. WHAT EVERY CHAT DOES AT ALL TIMES (the standing duties)
Real studios run a few things every sprint regardless of the feature:
test every feature the sprint it lands, triage bugs on a cadence, playtest
every sprint, never delay playing it until it "looks good". Ours, as law:
1. **VAMILY FIRST.** Claim the top OPEN line for your lane, build it, ship
   it, mark it. Then the next.
2. **PLAY IT BEFORE YOU CALL IT SHIPPED.** On the real surface, on a phone
   if you can, and RE-CUT THE DEMO. A grep is not a ship (VERIFY ON THE
   REAL SURFACE, 7/18). Run the cold hand on your own surface once per
   ship: press the loudest thing, never read, see if the game advances.
3. **HIS BUGS BEAT YOUR QUEUE.** Anything he files for your lane goes
   first. Fix the root cause, move on.
4. **YOUR GATES, EVERY SHIP.** The full suite cannot finish inside its
   budget any more (LAB, 8/31), so run your own lane's gates and the ones
   your change touches. Never ship red. Never argue with a green.
5. **ON THE BEAT.** 120 BPM friendly for everything (9/4). If it cannot say
   which beat it happens on, it is not done.
6. **REWRITE YOUR HANDOFF BLOCK** before you end, and mark your VAMILY line.
   A chat that ends without both has not ended.

## 4. THE LANES, WHERE EACH ONE STANDS, AND ITS QUEUE FOR THE REST OF THE GAME
(last real ship; dormant?; then the queue. BB rows keep their names; new
jobs get a one-line brief here and in VAMILY.md.)

### RUN (the walked surface). Last ship 8/31. Dormant 5 days.
Exists: the door opens on the played surface; the demo build; the hardened
save; the day loop; road interrupts (built, gated, and ONLY fire during map
travel, never on foot). Queue: the people into the save; the save gate over
them; road interrupts on foot; the reckoning names who you let down; the
day spends itself instead of your thumb; the home-screen ask sized on
purpose; a title / stop-and-return surface (nothing exists); an ending that
is not going to bed; dispatch item 5, the population default (his number).

### WORLD / CITY (economy, map, districts, builder). Last ship 8/28, economy 8/21. Dormant.
Exists: a complete purse ledger; the payout pipe, called; a 35-district
overmap; build verbs and a build panel in the aerial tab; 18 factions.
Queue: batteries are the money + the three tables of ones (one job); the
four drains; the night eats power; A DAILY PRODUCTION TICK that walks
placed buildings and calls produce() on the wake beat (nothing does today);
BUILD COSTS ITS PRICE (build is free today); the builder reachable from the
walked surface and in the demo; HOUSING, residents per plot, a population
number that moves (the other half of his only economy law, zero built);
territory held by factions using the lights; roads faster than rubble; the
century record so act 3's city can differ (mechanism ours, numbers his).

### COMBAT. Last ship 8/31. Dormant 5 days.
Exists: RF4 on the beat; 53 bosses wired from his ladder; the key ledger
(the one thing that leaves); a 23-perk tree saved to disk; the companion,
measured; the door from the city (gate 26/0). Queue: a tile is a house
(dial); flip FEAR_ON, the perk exists; the INDOOR fight entry (the missing
half of the door); loot leaves the arena and keys land somewhere that reads
them; guns bad in close; go back and pick her up; the fight knows the hour
and the heat; the rout, and letting them go; save on purpose at the bell;
armour as a layer (the field exists, all zero) and morale; the seven
bosses to reach sixty and which grants are real (his).

### CHARACTER (body, hair, face, clothes). Last ship 8/31. Not dormant.
Exists: the rig, enforced by 137 assertions; the 56/112 pipeline; hair,
faces, wardrobe, the face maker at the match cut. Queue: the hair reference
sheet in all eight facings (his 8/25 order, open); the round-7 look
verdict (his); then wardrobe volume behind the structure law.

### ANIMATION. NEW LANE, first word "animation". Last animation ship 8/18. DORMANT 18 DAYS.
He was right. Exists: 63 named clips; the walked PLAYER is animated (idle,
four walk, four run frames, eight directions, frame index on the beat).
Missing: THE NPC CROWD IS NOT ANIMATED, every resident is a frozen sprite
(the bake already sends walk frames; the cast decoder throws them away);
NO CLIP CARRIES A VERDICT (the 7/26 reset voided every thumb); ten clips
killed 7/2 with no replacement, including hurt and death. Queue: the
63-clip audit on the real surface (his 8/25 order, untouched); show him
the list, take verdicts (his); animate the crowd (wiring); recook what he
kills; re-add hurt and death (his call, killed 7/2); the leaf gate on every
recook. This is a week of work that cannot ride inside a hair turn, which
is why it is its own chat.

### QUESTS. NO CHAT ON RECORD. No lane ship since 8/21. DORMANT.
Exists: 27 playable side quests; a real parser; four Act 1 scenes; 53 prose
designs; the questbook. Missing: THE MAIN QUEST. Not one .bq file. Act 2
and 3 are documents. The demo's five days each mount a side quest. Queue:
main-quest spine as .bq stubs for Act 1 (the single largest hole in the
game); the generational fold as quest runtime; jobs say what they pay; a
job says how far it is; haggling; the ten territory quests move ground;
Act 2's opening (who dies next is his); the highest-value prose designs
converted to .bq; the DIRECT tab covering quest stages.
Note: the "170 quest file with dialogue" he refers to is NOT in the repo.
What exists is 53 prose designs and 152 studied outside quests. Either it
lives somewhere else or it is the 53 plus the questbook. His to say.

### PEOPLE. Last ship 9/1. Not dormant.
Exists: talking on the walked surface, nine verbs; a real witness memory;
NPCs with schedules and homes; 12 encounters, now firing on foot; 18
factions. Missing: THE DYNASTY IS A DATA SHAPE, NOT A MECHANIC (selectHeir
has zero callers; nothing writes a child; no marriage, birth, ageing or
succession); the player is not a node in the standing graph; the @TALK
conversation chain is parsed and MUTE in the demo file (236 nodes, 504
lines); zero of 34 people near spawn wear an outfit. Queue: the player
into the standing graph; the conversation chain into the demo cut;
affiliated people at spawn; family events that write the tree; former
trade per person; marriage and succession (his); one recruitable companion
outside the fight (ROSA is a draft he has not ruled on).

### FACTIONS. Last ship 8/31. Dormant-ish.
Queue: the circuit owner named (his); territory as ground held (with
WORLD); the coalition mechanic for escalation (graph edit, who allies is
his); the roving outfit when income is cut.

### WORDS. Last ship 8/30. Active, paused by the 8/26 cap.
Queue: the small moment; people still say what they used to be; responsive
lines off what you are known for; a second voice pass on the 27 scenes.

### UI. Last ship 8/31. Not dormant.
Exists: the HUD, the phone, the pad. Missing: NO SETTINGS OR PAUSE SCREEN
(volume, mute, quit, save) and NO ONBOARDING of the pad, phone or DROP IN.
Queue: one number in a fight (defend it); a settings/pause panel; a first-run
teaching beat; the why, when the world reacts; the round-7 look (his).

### SOUND. Last ship 8/31. Not dormant.
Queue: the WHERE heartbeat (one message, four systems); the day song plays;
per-district bed; a lit block hums; callers for the other 51 approved sounds.

### ART. Last ship 8/31. Not dormant.
Exists: 49 districts through the kit; 71 dossiers. Missing: about 20
map-only districts the overmap names and nothing draws (airbase, dam,
prison, granary, the strip family...); 19 authored legend codes never
placed. Queue: the map-only audit; cut-or-build on the strip/casino/resort
family (his); close the 19 codes; boxcar order; landmark re-probe.

### LAB. Absorbed. Reopen or retire is his call. Its RF4 spec (68 items) goes to COMBAT.

## 5. THE TWO CHATS HE NEEDS TO OPEN
1. **QUESTS.** It has jobs, it owns the biggest hole, and there is no chat
   on record for it. First word "quests", then VAMILY.
2. **ANIMATION.** New lane. First word "animation", then VAMILY.
Everything else is a chat he already has.

## 6. KNOW WHAT I DO NOT KNOW
- Every status is a source read plus a gate's own claim. Nobody in this
  audit ran the game on a phone. This repo has twice documented a source
  read disagreeing with the real surface.
- The scorecard reader was blind to the base64 fight and trusted a stale
  banner; I corrected three rows from my own runs and left the rest.
- The COMBAT reader said the fight is unreachable from the city; I grepped
  the door and ran its gate (26/0) and it is reachable. The INDOOR half is
  the real gap.
- The "170 quest file" is not in the repo.
- Whether the CITY tab's build panel works on a real phone (a backlog row
  says the touch path crashed there once).
- Whether the demo re-cut on 9/1 is byte-current with today's city file.
- The ~20 map-only districts is a diff of kit names against dossier names,
  not a map run.
- Gate colours across the suite: it can no longer finish inside its budget,
  and 82 gates were never run in the last full attempt.
