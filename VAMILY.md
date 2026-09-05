# VAMILY -- THE MEETING HALL (Paolo 9/4/26, LOCKED)
# "the chats should have a place like a meeting hall in the files, a job board,
# a center of a room where they start off and pick up their jobs... why should I
# be passing them any information other than saying VAMILY."
# THIS FILE IS THAT ROOM. THE RULES LIVE HERE, NOT IN ANY CHAT'S MEMORY.

## READ THIS FRONT PAGE EVERY SINGLE TIME YOU HEAR THE WORD VAMILY
Not once. Every time. Rules change on this page and nowhere else, so a chat that
remembers last week's rules is wrong. Paolo never pastes anything; he types the
one word, and this page is the briefing.

0. VAMILY is a keyword. It has nothing to do with families or dynasties. It means:
   read this page, find your section below, do your job from it.
1. Paolo talks ONLY to the coordinator (00 MASTER COORDINATOR, the manager). Every
   other chat gets the one word and nothing else. Never ask him anything. A ruling
   you need goes in your handoff block in 00_START_HERE_NEXT_SESSION.md as
   [PENDING Paolo]; the coordinator carries it to him.
2. FIND YOUR SECTION by this chat's number and name (the list is right below). A
   fresh chat with no name takes the first line marked UNCLAIMED, writes CLAIMED on
   it, commits, and that is its role for life.
3. READ YOUR SECTION'S MODE AND STATE LINES FIRST. STATE says what is built, what
   is not, and what nobody has checked, so you know what you do not know.
4. Every job carries a TWO-WORD label in [brackets], for him. The name after it is
   the job. A BB- name's full text is that row in BOHEMIA_BACKLOG.md; any other
   job's one-line brief here IS the job.
5. IF YOU ALREADY HOLD A CLAIMED JOB, VAMILY MEANS CONTINUE IT, from where your
   handoff block says you stopped. A job takes as many rounds as it takes; nobody
   expects one round. Otherwise take the FIRST line marked OPEN in your section,
   change it to CLAIMED <date> <session>, commit and push BEFORE you start.
6. MODE: BUILD means build it, prove it on the real surface (the walked city and
   the demo, on a phone if you can), re-cut the demo, run your lane's gates, then
   change the line to SHIPPED <date> <commit> and push. Mark SHIPPED only when the
   job's own ship test is met; a half-done job marked SHIPPED is worse than an open
   one, never rush to close a line.
   MODE: RESEARCH means DO NOT IMPLEMENT: one research day on the question, both
   angles (the best games ever made, and the real world), one finding that proves
   us wrong, measured against our repo, a written record, test material tagged
   draft:true in a bank file never in the game, a ROUTED section; mark SHIPPED
   with the record path.
   MODE: PARKED means nobody touches it until Paolo reopens it.
7. Every mechanic is 120 BPM friendly or it is not done. A row is not shipped
   until it is in the walked surface AND the demo.
8. STANDING DUTIES, every round: VAMILY first; play it before you call it shipped;
   his bugs beat your queue; run your gates, never ship red; rewrite your handoff
   block before you end.
9. END EVERY ROUND by replying to him with the two-word label and one short line:
   "continuing, about N of M" or "shipped" or "queue empty".
10. Only the coordinator adds jobs here (one exception: EYES AND EARS may add a
    single [eyes: two words] bounce-back line on a defect it found in a SHIPPED
    item). Lanes change status words and nothing else. The SHIPPED lines are the
    history.
Full law: laws/BOHEMIA_ADDENDUM_THE_VAMILY_WORD_9_4_26.md and
laws/BOHEMIA_ADDENDUM_THE_CENTRAL_CHAT_9_4_26.md

## THE NINETEEN CHATS (his list, 9/4, plus two blind spots found 9/4). Every one has a queue below. He types VAMILY, nothing else.
A chat finds its own section by its number and name. A FRESH chat with no name
takes the first line marked UNCLAIMED, writes CLAIMED, commits, and that is its
role. Every section carries MODE and a STATE line (what is built, what is not,
what nobody has verified) so the chat knows what it does not know.
 01 THE RUN          -> RUN
 02 WORLD MODEL      -> WORLD
 03 LIFE + CITY      -> LIFE + CITY
 04 COMBAT           -> COMBAT
 05 CHARACTER        -> CHARACTER
 06 ART DIRECTION    -> DIRECTION   (the Art Director)
 07 REFERENCE LAB    -> RETIRED by Paolo 9/4. Its library jobs went to DIRECTION, its spec jobs to COMBAT.
 08 SOUNDS           -> SOUNDS
 09 PEOPLE           -> PEOPLE
 10 FACTIONS         -> FACTIONS
 11 UI               -> UI
 12 WORDS            -> WORDS       (research)
 13 ECONOMY          -> ECONOMY     (research)
 14 ANIMATION        -> ANIMATION
 15 DYNASTY          -> DYNASTY     (research)
 16 ART COOK         -> COOK        (the Production Artist)
 17 EYES AND EARS    -> EYES AND EARS  (his double: checks every shipped visual and sound)
 18 RELEASE          -> RELEASE     (UNCLAIMED: the demo as a product; performance, the cut, playtest rounds, telemetry)
 19 GATEKEEPER       -> GATEKEEPER  (UNCLAIMED: the checking machine itself; the suite, dead gates, the OWED checker)
    QUESTS           -> PARKED by Paolo 9/4; no chat, nothing claimed until he reopens it

## WORLD  (02. the economy, the map, the towns)
MODE: BUILD
STATE: the purse ledger and payout pipe are built and called; PAYOUT and PRICES carry his 8/15 ONE denominated in his 9/4 BATTERY, every value tagged and untuned, so a day's work pays one battery and a bag of rice costs one on the walked surface and in the demo (9/5); PRODUCTION is still empty because produce() has zero callers; ELECTRICITY now moves both ways and CLOUT still has never moved; the only drain is shopping; the map is 35 districts with 18 factions placed. Unverified: whether the faction world's territory AI drives anything visible on the walked surface.
- SHIPPED 9/5 ce39270  [battery money]  BB-BATTERIES-ARE-THE-MONEY  (with BB-THE-LETTER-IS-ONE, one job)
- SHIPPED 9/5 ce39270  [prices one]  BB-THE-LETTER-IS-ONE  (shipped inside [battery money]; the queue marks them one job)
- OPEN  [living costs]  BB-FOUR-VERBS-THREE-CURRENCIES
- OPEN  [lights bill]  BB-THE-NIGHT-EATS-POWER
- OPEN  [faction towns]  FACTION-TOWNS -- every faction has a seat that is its market, buildings and quests; FORTRESS / TOWN / CAMP derived from act1_power, draft:true; who sits where is his (9/4 law)
- OPEN  [held ground]  BB-TURF
- OPEN  [faster roads]  BB-ROADS-ARE-FAST
- OPEN  [rung unlocks]  BB-THE-RUNG-PAYS
- OPEN  [enemies unite]  BB-COALITION

## QUESTS  (first word "quests")
MODE: PARKED -- Paolo 9/4: "no quest chat yet... I need aesthetic supervision on experiencing it." Nothing below is claimed until he reopens it.
- OPEN  [main story]  MAIN-QUEST-SPINE -- Act 1 main quest as .bq stubs from laws/BOHEMIA_STORY_MASTER_7_18_26.md; not one main-quest file exists; the single largest hole in the game
- OPEN  [jobs pay]  BB-THE-JOB-PAYS  (after WORLD's first job lands)
- OPEN  [distance shown]  BB-INSIDE-A-DAY
- OPEN  [map moves]  BB-TERRITORY-FLAG  (after WORLD BB-TURF)
- OPEN  [generation handoff]  THE-FOLD-IN-THE-RUNTIME -- the gen 1 to gen 2 handoff as quest runtime: what carries, what the heir inherits, the beat itself; canon is his, the machine is ours
- OPEN  [designs playable]  DESIGNS-TO-BQ -- convert prose designs 001, 002, 013 to playable .bq; the designs are done, only the machine layer is missing
- OPEN  [haggling works]  BB-ASK-FOR-MORE
- OPEN  [edit quests]  DIRECT-COVERS-QUESTS -- the DIRECT tab edits quest stages, not only cutscene beats (8/12 law)
- OPEN  [act two]  ACT-2-OPENING -- needs Paolo: who dies next; write the scene the moment he rules

## SOUNDS  (08.)
MODE: BUILD
STATE: 65 approved sounds, 185 variants; the walked city can produce 14, all reactions; the ambience bed is built and fed only by a message the city never sends; music phase stuck on NIGHT. Unverified: where the music engine module lives (not in engine/).
- OPEN  [background sound]  BB-THE-CITY-SENDS-WHERE
- OPEN  [daytime music]  BB-THE-DAY-SONG-PLAYS
- OPEN  [district sound]  BB-THE-BED-IS-THE-PLACE
- OPEN  [power hums]  BB-A-LIT-BLOCK-HUMS
- OPEN  [unused sounds]  THE-OTHER-51
- OPEN  [music owned]  THE-MUSIC-ITSELF -- the 200-plus songs in the alpha, their pools and phases, the one he likes: this lane owns the MUSIC too, not only the sounds; a queue of what the valley's music still needs, judged in the MUSIC tab -- give every approved sound a caller on the walked surface; 51 of 65 have none; no new cooks

## LIFE + CITY  (03. the city-builder tab and the aerial view; the buildings, the housing, the century)
MODE: BUILD
STATE: build verbs and a picker EXIST in the aerial tab (engine/bohemia_cityedit.js, cityTapPlot). NOT built: nothing produces (produce() has one caller and it is a gate), nothing houses anybody, building is free, the builder is not reachable from the walked surface or the demo, no century record exists. Unverified: whether the aerial build panel works on a real phone (a backlog row says its touch path once crashed).
- SHIPPED 9/5 93a0c3f  [builder works]  BUILDER-ON-A-PHONE -- prove the aerial build panel works by touch on a real iPhone, or fix it; the backlog says it crashed once and nobody re-checked
- CLAIMED 9/5 city-1eztay  [buildings produce]  PRODUCTION-TICK -- on the wake beat, walk every placed building and call produce(); today produce() has one caller and it is a gate
- OPEN  [building costs]  BUILD-COSTS-ITS-PRICE -- CE.build debits PRICES; building is free today and the 8/15 law says the pipe must be exercised
- OPEN  [builder reachable]  BUILDER-WHERE-HE-WALKS -- the build verbs and panel reach the walked surface and the demo; today they live only in the aerial tab
- OPEN  [people housed]  HOUSING -- residents per plot, capacity, a population number that moves; the other half of the 7/26 economy law, zero built
- OPEN  [century memory]  CENTURY-RECORD -- persist per-act build totals so act 3's city can differ; mechanism ours, every number his
- OPEN  [feed posts]  THE-FEED-STREAM -- one event stream the city-screen feed reads: the deed ledger first (exists), then faction/territory events, then ambient life posts; with PEOPLE
- OPEN  [combat floor]  THE-AERIAL-VIEW-IS-THE-COMBAT-FLOOR -- with COMBAT: the zoomed-out city render is what the fight stands on (9/4 tile law 3b); expose it as a drawable layer COMBAT can centre on a block
- OPEN  [more people]  POPULATION-DEFAULT -- dispatch item 5, "dead is not the default"; the number is his, the mechanism (a default that is not zero) is ours
- OPEN  [buildings appear]  A-BUILDING-YOU-PLACED-SHOWS-UP-ON-FOOT -- what you build in the aerial view is standing there when you walk to it; INTERIOR = EXTERIOR holds

## COMBAT  (04.)
MODE: BUILD
STATE: RF4 on the beat, 53 bosses wired, the key ledger leaves, a 23-perk tree saved, the companion measured, the door from the city works (gate 26/0). NOT built: the indoor entry, loot leaving, FEAR_ON is false with its perk shipped, armour all zero, the house-scale board. Unverified: gate colours (the suite cannot finish in budget).
- CLAIMED 9/5 session_01C6Fn6dDgMUy725zJqieinK  [house tiles]  BB-A-TILE-IS-A-HOUSE
- OPEN  [fights end]  BB-NERVE-ON
- OPEN  [indoor fights]  THE-INDOOR-FIGHT -- the door from the city works (gate 26/0); the indoor entry is the missing half (day-14 row)
- OPEN  [loot kept]  BB-LOOT-LEAVES  (with BB-KEYS-LAND and BB-THE-FIGHT-KNOWS-THE-DAY, one pipe)
- OPEN  [guns close]  BB-GUNS-CLOSE
- OPEN  [rescue her]  BB-PICKUP
- OPEN  [plates cost]  BB-THE-FIGHT-EATS-TAPE
- OPEN  [enemies flee]  BB-THE-ROUT
- OPEN  [prefight save]  BB-SAVE-BEFORE-THE-BELL
- OPEN  [armour morale]  ARMOUR-AND-MORALE -- armour as a layer (the field is on every body and all zero) and morale past the nerve roll; no damage number moves
- OPEN  [what lives]  CREATURES -- dispatch item 8: enemies, loot and danger BY PLACE (some blocks are deadly at night, some never). The bestiary research exists (records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md) and nobody owns the creatures themselves: what they are, where they live, what they drop. With PEOPLE (encounters) and WORLD (place). WHICH creatures is his where it is canon.
- OPEN  [sixty bosses]  SIXTY -- the seven bosses to reach 60 and which of the 53 grants unlock a real verb; needs Paolo, cannot start first
- OPEN  [RF4 checklist]  RF4-SPEC-DIFF -- close the 68-item RF4 teardown spec's diff column (from LAB)
- OPEN  [BB checklist]  BB-SPEC -- the Battle Brothers study's 23 records folded into one spec of the same shape as the RF4 one, so COMBAT and WORLD have one reference document per named game

## RUN  (01. the walked surface)
MODE: BUILD
STATE: the door opens on the played surface, the demo build exists (re-cut 9/4), the save is hardened and carries day/clock/position/quest/purse AND THE PEOPLE (minds/known/met/belong/deedweight, shipped 9/4 -- export, import, restore, rollback and wipe all cover them); road interrupts fire only on map travel. NOT built: a title or stop-and-return, an ending that is not bed. Unverified: nobody has walked the five through save_iphone_gate's hostile browser -- that is the next row.
- SHIPPED 9/4 df04973  [people saved]  BB-THE-PEOPLE-RIDE-THE-SAVE
- CLAIMED 9/5 run-eak241  [save checked]  BB-THE-GATE-WALKS-THE-PEOPLE
- OPEN  [street encounters]  ROAD-INTERRUPTS-ON-FOOT -- roadInterrupt has one caller inside MODE==='city'; it never fires on the walked street
- OPEN  [debts named]  BB-WHAT-YOU-OWE
- OPEN  [drains shown]  BB-THE-SHADOW-OF-WHAT-YOU-DID
- OPEN  [auto walk]  BB-THE-TIME-NOT-THE-TAPS
- OPEN  [home screen]  BB-HOME-SCREEN-IS-THE-SAVE
- OPEN  [title screen]  STOP-AND-COME-BACK -- a title / resume surface; nothing exists (record item H)
- OPEN  [real ending]  AN-ENDING-THAT-IS-NOT-BED -- the demo's last thirty seconds is the only ending in code (record item G)
- OPEN  [weekly goal]  BB-THIS-WEEK

## ANIMATION  (14.)
MODE: BUILD
STATE: 63 named clips; the walked PLAYER is animated (idle, four walk, four run, eight directions, on the beat); the NPC crowd is frozen sprites; no clip carries a verdict since the 7/26 reset; ten clips killed 7/2 with no replacement; last animation ship 8/18. Unverified: whether the ANIMATION tab still renders.
STANDING DUTY (9/4 law): every clip compared side by side to the best pixel walk/idle/hit cycles online before it is called done; REFERENCE CHECK documented.
- OPEN  [clip audit]  THE-63-CLIP-AUDIT -- play every clip on the real surface, list what is broken and how, before any recook (his 8/25 order, untouched)
- OPEN  [your verdicts]  SHOW-HIM-THE-LIST -- needs Paolo: verdicts on the 63; no clip carries one since the 7/26 reset
- OPEN  [crowd moves]  ANIMATE-THE-CROWD -- the bake already sends walk frames for the city cast; the decoder keeps only idle, so every resident is a frozen sprite
- OPEN  [clips redone]  RECOOK-WHAT-HE-KILLS
- OPEN  [hurt death]  HURT-AND-DEATH -- killed 7/2 with no replacement; a game needs them; needs Paolo
- OPEN  [clips checked]  LEAF-GATE-EVERY-RECOOK

## CHARACTER  (05.)
MODE: BUILD
STATE: the rig enforced by 137 assertions, the 56/112 pipeline, hair, faces, wardrobe and the face maker at the match cut all ship and persist. NOT done: the hair reference sheet in all eight facings (his 8/25 order), the round-7 look. This lane WIRES what COOK cooks.
- CLAIMED 9/5 character-0lurbs  [clothes wired]  WIRE-THE-REMAKE -- as ART batches pass DIRECTION, wire them into the picker and the wardrobe data; ART makes pixels, CHARACTER makes them worn
- OPEN  [hair sheet]  HAIR-REF-EIGHT-FACINGS -- his 8/25 order, still open
- OPEN  [look verdict]  ROUND-7-LOOK -- needs Paolo
- OPEN  [more clothes]  WARDROBE-VOLUME -- new garment shapes behind the structure law

## PEOPLE  (09.)
MODE: BUILD
STATE: talking on foot with nine verbs, a real witness memory, schedules and homes, 12 encounters firing on foot. NOT built: the player as a node in standing, the conversation chain in the demo file (236 nodes mute), outfits near spawn, any family event. Unverified: whether the talking portrait reaches a live NPC card.
- SHIPPED 9/5 3aa7fa1  [your reputation]  BB-STANDING-PLAYER
- SHIPPED 9/5 35e44ba  [gate red]  PEOPLE-GATE-RED -- gates/people_gate.js runs 148 passed, 10 failed as of 9/4 (measured by the coordinator; it reads engine/, tools/ and slices/, none of which the coordinator touches, so this predates today). His bugs beat your queue: fix or explain the ten before taking anything else.
- OPEN  [demo talks]  TALK-REACHES-THE-DEMO -- 236 @TALK nodes and 504 @SAY lines are parsed and mute in the demo file
- OPEN  [outfits nearby]  OUTFITS-AT-SPAWN -- zero of 34 people within six cells wear one
- OPEN  [former jobs]  BB-WHAT-YOU-WERE
- OPEN  [family events]  FAMILY-EVENTS -- something writes a child, a marriage, an ageing into family.tree; selectHeir has zero callers
- OPEN  [neglect costs]  BB-OBLIGATION-BURN
- OPEN  [enemies remember]  BB-THE-SHADOW
- OPEN  [heir moment]  SUCCESSION-BEAT -- needs Paolo: who you can marry, what an heir inherits
- OPEN  [walking companion]  A-COMPANION-ON-FOOT -- needs Paolo: ROSA is a draft he has not ruled on

## FACTIONS  (10.)
MODE: BUILD
STATE: 18 factions in the graph (14 selectable plus four more), every one with act1_power and act3_power, wrapped writes protecting canon. NOT built: the player is not a node; zero of 34 people near spawn wear an outfit; nobody holds ground; the non-selectable factions have no verified presence on the map.
- OPEN  [faction homes]  FACTION-SEATS -- every selectable faction has a seat placed on its generated district, and the seat is where its town grows (with WORLD FACTION-TOWNS); moving a seat is his
- OPEN  [hidden factions]  THE-OTHER-FOUR -- the four non-selectable factions: do they exist anywhere a player can meet them? measure, then place a presence or write [PENDING Paolo]
- OPEN  [colours fixed]  COLOUR-AUDIT -- every faction's colour is coordinated, saturated and nobody else's (COLOUR IS TERRITORY); the gate holds contradictions, this row fixes them
- OPEN  [town sizes]  TOWN-TIERS-ARE-HIS -- needs Paolo: the draft tiers off act1_power ship; he moves any faction he likes; with WORLD FACTION-TOWNS
- OPEN  [light owners]  NAME-THE-CIRCUIT-OWNER -- needs Paolo (who holds what)
- OPEN  [enemies unite]  BB-COALITION  (with WORLD)
- OPEN  [broke raiders]  BB-UNPAID-TURNS-PREDATORY

## WORDS  (12.)
MODE: RESEARCH -- Paolo 9/4: "keep doing big brain online research... don't implement anything. Just test and write down. Big swings." Subject: HOW PEOPLE TALK, banked for the day quests open. Test lines go to banks/BOHEMIA_WORDS_TEST_LINES.md, draft:true.
STATE: 2,442 authored lines, a voice card and a voice gate, 27 quest scenes measured against 617 films; the language cap (8/26) stands. This lane does not implement; it researches how people talk and writes test lines to a bank.
- SHIPPED 9/4 records/BOHEMIA_WORDS_Q1_TELL_THEM_APART_9_4_26.md  [telling apart]  Q1  Two people, three lines each, and you can tell them apart with the names removed. What the best-written games do with vocabulary, rhythm and the thing a person never says. Measure our 504 NPC lines for it.
- SHIPPED 9/4 records/BOHEMIA_WORDS_Q2_SPEECH_UNDER_STRESS_9_4_26.md  [stressed speech]  Q2  How a person talks when they are lying, scared, or exhausted, in TEXT with no voice actor. The real science of speech under stress (hesitation, repair, shortened sentences) and which games get it onto the page.
- SHIPPED 9/4 records/BOHEMIA_WORDS_Q3_HOW_A_CROWD_TALKS_9_4_26.md  [crowd talk]  Q3  How a crowd talks without repeating itself. The best ambient-bark systems ever built: how many lines, how they are chosen, how they avoid the third repeat. Against our roadside director's twelve.
- SHIPPED 9/4 records/BOHEMIA_WORDS_Q4_SPEECH_ON_A_BEAT_9_4_26.md  [beat speech]  Q4  Speech on a beat. At 120 BPM how many words fit one beat, two, four; how the best rhythm-aware games pace a line; what a line that lands ON the beat does that one that drifts does not.
- OPEN  [refusing answers]  Q5  Refusal. How the best games let a character NOT answer, change the subject, or lie by omission, and how the player still learns something. Against our asking module's eighteen blocks.
- OPEN  [power talk]  Q6  Talking across a power gap. Sociolinguistics of address: how a boss talks to a hand, a stranger to a fortress, a camp kid to anyone. Test lines for one exchange at each gap.
- OPEN  [second meeting]  Q7  The second conversation. How speech changes when a person REMEMBERS you (our memory organ already tracks it). What the best games do with a returning player, and what they do wrong.
- OPEN  [grief talk]  Q8  Grief speech. The cold open kills the sister. How real people talk in the first hour, the first day, the first month, and which games wrote it honestly. Test lines for the grief dinner.
- OPEN  [trade talk]  Q9  What a former trade sounds like. A dealer, a lineman, a laundry chief, a pit boss: the vocabulary and metaphors a job leaves in a mouth (day 8's background as identity). Test lines for six trades.
- OPEN  [threat talk]  Q10 Threats that de-escalate and threats that escalate. What real negotiators and the best-written standoffs do with a sentence, for the gambit orders (day 3).
- OPEN  [face carries]  Q11 What the face can carry so the words do not have to. At 64 px with mouth, blink and brow, which emotions read without a word, and how games with a talking portrait split the load between face and text.
- OPEN  [naming people]  Q12 Names and nicknames. How people in a collapsed city name each other and places (real post-disaster naming, gang and crew naming), and what that does for a player learning who is who.
- OPEN  [rumours spread]  Q13 Rumour. How true and false news moves through a small world by speech alone, in the real record and in the best games, for the man-who-lives-tells-people axis (day 12).
- OPEN  [one-word answers]  Q14 The one-word answer.
- OPEN  [feed voice]  Q15 How a feed talks. The city screen scrolls posts about what you did and what the world did. What real small-community feeds and the best in-game feeds sound like, and how to keep an auto-generated post from reading like a press release. Test posts for five deeds and five world events. When the best games let a character answer in one word and why it lands. Test lines: twenty one-word answers, each a different person.
- OPEN  [small moments]  BB-THE-SMALL-MOMENT  (build, held until the lane returns to MODE: BUILD)
- OPEN  [trade slang]  BB-STILL-SAYS-IT  (build, held)
- OPEN  [reputation lines]  BB-RESPONSIVE  (build, held)
- OPEN  [voice pass]  SECOND-VOICE-PASS  (build, held)

## UI  (11.)
MODE: BUILD
STATE: HUD, phone, pad, day card exist. NOT built: any settings or pause screen, any onboarding, the city-screen feed. Unverified: the round-7 look, which is his to thumb.
- OPEN  [city feed]  THE-FEED-ON-THE-CITY-SCREEN -- in CITY mode a phone screen on the UI scrolls a social feed: your finished quests, what the world did, auto-generated life; reads the deed ledger; on the beat (9/4 law)
- OPEN  [one number]  BB-ONE-NUMBER
- OPEN  [settings pause]  SETTINGS-AND-PAUSE -- volume, mute, quit, save; nothing exists
- OPEN  [first teaching]  FIRST-RUN-TEACHING -- the pad, the phone, DROP IN; nothing exists; measure with the cold hand
- OPEN  [phone readable]  ACCESSIBLE-ON-A-PHONE -- text size, tap targets, colour-blind safety on faction colours, motion; the Game Accessibility Guidelines basic tier that the sound and colour rules already cite, applied to the whole surface
- OPEN  [reactions explained]  BB-WHY
- OPEN  [crisis warning]  BB-FORETOLD
- OPEN  [look verdict]  ROUND-7-LOOK -- needs Paolo

## DIRECTION  (06. the Art Director. Decides the look, judges every cook. Does not cook.)
MODE: BUILD
STATE: a visual constitution exists (records/target, target_match_gate); no style card for the runway exists yet; nothing judges a cook's comparison against reference yet.
- SHIPPED 9/5 09c83ba  REFERENCE-BESIDE-EVERY-CANDIDATE -- every judge sheet (VOTE, look sheets, district renders) shows the reference the cook was compared against, side by side; DIRECTION judges the comparison before VOTE (9/4 compare law)
- SHIPPED 9/5 191fd5d  [reference library]  THE-REFERENCE-LIBRARY (reference/library/, 9 kinds, 31 entries, machine-parseable for REFERENCE-INDEX) -- one folder per asset kind (district, building, garment, haircut, face, walk cycle, prop, combat ground, UI) holding the best real and pixel references online, each with a one-line note of the structural rule it teaches (windows in a wall plane, a door on the ground); COOK and DIRECTION read from it; nothing from it enters the design vocabulary (8/28)
- SHIPPED 9/5 b416bc6  [reference index]  REFERENCE-INDEX (derived by tools/bohemia_reference_index.py; 31 refs, hard-fails on malformed entries) -- an index file the reference_check_gate can resolve a REFERENCE CHECK against, so a cook that names a reference names a real one
- SHIPPED 9/5 32338e1  [runway shapes]  RUNWAY-REFERENCE (reference/library/runway/, 13 shapes: shoulder x3, drape x3, hem x3, leg-and-boot x3, the two whole-figure poles) -- the Balenciaga and Rick Owens silhouette library at the level of shape (shoulder, drape, hem, boot), for DIRECTION's style card; no third house until he names it
- OPEN  [builder references]  PIXEL-CITY-BUILDER-REFERENCE -- the best pixel city-builder districts online, annotated for what a block, a street and a lot look like at our tile size, for the faction-towns and combat-ground work
- OPEN  [opening references]  FIRST-HOUR-REFERENCE -- the first ten minutes of the best games ever made, written up as beats, for the cold hand and the onboarding work (day 14)
- OPEN  [style card]  THE-STYLE-CARD -- the runway in pixel terms: palette, value bands, silhouette rules, what a Balenciaga shoulder and a Rick Owens drape ARE at 56 and 112 px, for the 45-degree corpus (laws/BOHEMIA_ADDENDUM_THE_RUNWAY_AND_ART_AT_ALL_TIMES_9_4_26.md)
- OPEN  [style checker]  STYLE-CARD-GATE -- fails any cook outside the card's palette and bands, same shape as target_match_gate
- OPEN  [batch judging]  JUDGE-EVERY-ART-BATCH -- standing: nothing from ART reaches VOTE without passing the card

## COOK  (16. the Production Artist. Environment, character and prop art to DIRECTION's bible. Never idles; the last line is permanent.)
MODE: BUILD
STATE: 49 districts registered through the kit, 71 dossiers, about 20 map-only districts nobody draws, 19 authored codes never placed, 35 outer garments, 24 canon haircuts. NOT done: anything to the runway card (there is no card yet), the combat ground, the fortress buildings.
STANDING DUTY (9/4 law): EVERY COOK CARRIES A REFERENCE CHECK. Compare it side by side to real work of its kind online before calling it done; document what it was compared to, which structural rules were taken, what changed. Structure from reference, style from us. No shots in the dark.
- OPEN  [runway clothes]  WARDROBE-REMAKE -- every garment to the card, NEW SHAPES ONLY (structure law), graveyard stays dead, 10% coat cap stands, colour stays territory; batches through the existing kill/approve pipeline
- OPEN  [runway hair]  HAIR-TO-THE-CARD -- every haircut to the card; all eight facings; the hair, hairline, graveyard and leaf gates hold
- OPEN  [combat ground]  COMBAT-GROUND-TILES -- the combat floor tile at 1.5 to 2 sprite-widths, on the 45-degree corpus: house, yard, street, lot, cover that reads; a house with a backyard spans 1x2 (9/4 tile law 3d)
- OPEN  [fortress buildings]  FORTRESS-BUILDINGS -- the buildings a faction fortress needs that nobody has drawn, in tier order (FACTION-TOWNS)
- OPEN  [missing districts]  MAP-ONLY-DISTRICTS -- about 20 places the overmap names and nothing draws; audit, then build or cut
- OPEN  [strip ruling]  STRIP-FAMILY-RULING -- needs Paolo: cut or build the strip / casino / resort family
- OPEN  [unplaced tiles]  THE-19-CODES -- authored legend codes never placed
- OPEN  [boxcar order]  BOXCAR-ORDER
- OPEN  [landmark check]  LANDMARK-RE-PROBE
- OPEN  [keep cooking]  COOK-THE-NEXT-THING-THE-CARD-ASKS-FOR -- permanent; this line is never marked shipped

## ECONOMY  (13.)
MODE: RESEARCH -- the game's identity is "the most realistic economic crash simulator, but fun", and the builder half is a quarter built. Research only; every finding becomes a WORLD job later. No game he has not named enters the design; bring back mechanics in plain words.
STATE: the game's identity is the most realistic economic crash simulator, but fun; the builder half is a quarter built and nothing drains. This lane does not implement; every finding becomes a WORLD or LIFE + CITY job.
- SHIPPED 9/5/26  records/BOHEMIA_ECONOMY_DAY_1_THE_PRICE_IS_NOT_THE_STORY_9_5_26.md  [money dies]  Q1  The first thirty days after a currency dies. What actually happened to prices, wages and shops in Argentina 2001, Zimbabwe 2008, Venezuela, Lebanon 2019. Which of it a player would feel in a first hour.
- SHIPPED 9/5/26  records/BOHEMIA_ECONOMY_DAY_2_THE_MONEY_IS_THE_CHARGE_9_5_26.md  [money returns]  Q2  How money comes back. How a good becomes money when the money is gone (POW-camp cigarettes, prison mackerel, detergent, phone credit) and what makes it fail. Test the battery against every failure.
- SHIPPED 9/5/26  records/BOHEMIA_ECONOMY_DAY_3_NOBODY_REBUILDS_A_BUILDING_FIRST_9_5_26.md  [rebuild order]  Q3  What people rebuild first. Cuba's Special Period, post-Katrina New Orleans, Detroit, post-Soviet towns: the real order of rebuilding, for the century rule's sequence.
- CLAIMED 9/5/26 economy-knxaeh  [first building]  Q4  Placing a building that feels good in the first hour. What the best builder games ever made do in the first ten minutes of building, and what makes a placed building feel like it did something.
- OPEN  [numberless economy]  Q5  An economy with no numbers on screen. How the best games show scarcity, price and wealth without a spreadsheet. Against our one-number rule.
- OPEN  [casino backstage]  Q6  Who runs a casino when the money is gone. The back of house as an economy: laundry, kitchens, boilers, the deep dry stores (day 8). What a fortress actually produces.
- OPEN  [water supply]  Q7  Water. Lake Mead, the real constraint on Las Vegas. What a valley of a few thousand people actually needs and where it comes from when the pumps stop.
- OPEN  [battery value]  Q8  Electricity as money in the real world. Microgrids, battery economics, Nevada solar, what a AA is really worth in energy. Denominations for the battery.
- OPEN  [trust credit]  Q9  Credit without courts. Rotating savings circles, hawala, tabs at a bar: how debt works when nobody can sue, for the obligations motor (day 7).
- OPEN  [market day]  Q10 The market day. How real periodic markets work (who comes, from how far, how often) and what the best games do with a trading trip, for the faction towns.
- OPEN  [inflation feeling]  Q11 Inflation as a feeling. What runaway prices do to behaviour (spend today, hoard, barter) and how a game could make a player feel it in a week of play without a single chart.
- OPEN  [who's housed]  Q12 Housing. How people actually house themselves after a collapse (squatting, doubling up, who gets the good buildings) for the other half of the economy law.

## DYNASTY  (15.)
MODE: RESEARCH -- Gen 1 Animal, the fold, Gen 3 Angel, the heir: not started on any surface and never owned. Research only; findings become PEOPLE, QUESTS and RUN jobs when those open. Canon (who marries whom, who the Angel is) stays his; the lane brings shapes.
STATE: Gen 1 Animal, the fold, Gen 3 Angel: nothing on any player surface; selectHeir exists with zero callers; nothing ever writes a child. This lane does not implement; findings become PEOPLE, RUN and (when reopened) QUESTS jobs. Canon stays his. MEASURED 9/5 by Q1 and worse than the line above: THE FOLD IS GENERATION-BLIND -- `gen` is compared twice in the whole fold block and both are bookkeeping, so gen 1 folds the same standings, territory, builds and economyCapacity as gen 2, and an animal has none of those, so running gen 1 through the fold as written hands gen 2 a block of zeroes, which is a RUN. selectHeir also cannot do the animal-to-human handoff at all: it picks a child, else a sibling's child, else null. THE WORD ANIMAL APPEARS IN THE DYNASTY ENGINE EXACTLY ONCE AND IT IS IN A COMMENT. There is no smell mechanic anywhere (olfact 0) and no four-legged renderer anywhere. The wildlife module is excellent and the coyote is its only reacts:false row. MEASURED 9/5 by Q2: WE SHIPPED BOTH HALVES OF THE COYOTE'S LIFE AND NEVER NOTICED THEY WERE THE SAME ANIMAL -- the wildlife module's lone dawn coyote (flock [1,1], reacts:false) is a TRANSIENT and the packs module's spaced family with a den (size [2,6], spacing 140, notice 40) is a RESIDENT, which is the real ethological split (measured mean range ~9 km2 held versus ~59 km2 homeless), and nothing in the game says the lone one is trying to become the group. A territory is never inherited, it is waited for; the pair bond ends only at death (236 coyotes, six years, zero cheating); and the number one killer of an urban coyote is a car, which our Vegas does not have, so gen 1's danger is people. AND Q1's claim that no four-legged renderer exists was FALSE and is corrected in place: draw_beast makes a 16x16 three-frame coyote shared with the dogs. What is missing is a coyote at the PLAYER's scale with facings.
- SHIPPED 9/5 records/BOHEMIA_DYNASTY_DAY_1_WHAT_YOU_CAN_DO_WITH_NO_HANDS_9_5_26.md  [animal play]  Q1  Playing as an animal. What the best games ever made do when you are not human: what you can do, what you cannot, what the player feels, and where it gets boring. For Gen 1.
- SHIPPED 9/5 records/BOHEMIA_DYNASTY_DAY_2_A_COYOTE_IN_LAS_VEGAS_9_5_26.md  [coyote life]  Q2  A coyote in Las Vegas. The real ethology of urban coyotes (range, diet, how they read people, how they die) as the animal generation's actual life.
- OPEN  [heir keeps]  Q3  What carries across a generation. In the best games with inheritance, what the heir keeps, what they lose, and which of it the player actually cares about. Against our fold maths (selectHeir exists, unused).
- OPEN  [third generation]  Q4  The third-generation curse. How real family businesses and dynasties survive or die by the third generation, and what a game could take from it for Gen 3.
- OPEN  [growing old]  Q5  Growing old on screen. How the best games show a character ageing in a way that changes play, not only the portrait.
- OPEN  [time skip]  Q6  The time skip. How to jump ten years and make the player feel it; what the best games do at a cut like ours (the match cut at the table).
- OPEN  [family arrives]  Q7  A partner and a child without a chore. How the best games handle a companion becoming family and a child arriving, and where it turns into babysitting.
- OPEN  [inherited memory]  Q8  Remembering a life you did not play. How the second generation remembers the first: what the game shows the heir about the parent, and what real second generations actually keep.
- OPEN  [century town]  Q9  A place across a hundred years. Real succession of a town (what stays, what is renamed, what is forgotten) for the century rule and for Act 3's city.
- OPEN  [final act]  Q10 The transcendent last act. Not the lore, the SHAPE: how the best games handle a final act where the rules change (a new kind of body, a new kind of power) without breaking the game that came before. For the Angel.
- OPEN  [lasting death]  Q11 Death that is not the end. How games without permadeath and without a run still make a death matter across generations (the wounds that carry, day 4's scar).
- OPEN  [heir's hour]  Q12 The heir's first hour. When the fold happens, what the first ten minutes of the next life must do so the player does not feel they lost everything.

## EYES AND EARS  (17. his second pair of eyes and ears. Checks that every shipped visual and sound is correct and not weak. Never decides taste; that is DIRECTION.)
MODE: RESEARCH, turning to a STANDING DUTY once the checklists exist. THIS LANE MAY BUILD ITS OWN CHECKING INSTRUMENTS (screenshot passes, audio measurement, tools/ and gates/ that only check); it never writes game code. Paolo 9/4 asked how long until it is worth having: useful for visuals after E3, for sound after E4, decent after about eight rounds, so the queue is ordered fastest-to-useful.
STATE: nothing exists. No screenshot pass, no golden images, no audio measurement, no glitch checklist. Today the only pair of eyes and ears on shipped art and sound is Paolo. The 9/4 compare law and the runway law give this lane its bar; the 7/18 VERIFY ON THE REAL SURFACE law is its religion.
- OPEN  [first pictures]  E0  FIRST ROUND, BEFORE ANY RESEARCH: take a real screenshot of every tab of the alpha and the demo at iPhone size with the Chromium that is installed here, save them in one folder with a one-line note under each saying what looks wrong to you, commit it, and tell him where to look. He must SEE something on round one (Paolo 9/4: "I hope it's not a massive let down"). Then E3 builds the machine that does this every ship.
- OPEN  [screenshot diffs]  E3  How studios catch visual regressions by machine: golden images, screenshot diffing, per-tab captures at phone size. Design the pass for every tab of the alpha and the demo, on every ship, with Chromium (it is installed here).
- OPEN  [audio tells]  E4  How game audio is judged: loudness standards, clipping, phase, noise floor, the tells of a weak sound effect. Render all 65 approved sounds and measure them; list which are weak against the best sounds of their kind.
- OPEN  [glitch list]  E2  A glitch taxonomy for OUR game: floating windows, wall gaps, wrong draw order, sprites clipping through walls, text overflowing a card, a frame popping, a seam between tiles. One line each: what it looks like and how to find it on a screenshot.
- OPEN  [pixel tells]  E1  How the best pixel art is judged: the objective tells of bad pixel art (banding, pillow shading, jaggies, orphan pixels, inconsistent light direction, mixed resolutions). Build a checklist a machine can partly run against our 45-degree corpus.
- OPEN  [walk tells]  E6  What makes a walk or idle cycle read wrong: foot sliding, popping, off-beat timing, a limb that snaps. A checklist, then run it on the 63 clips.
- OPEN  [reference score]  E7  A scoring sheet for the compare-to-the-world law: given a cook and its reference side by side, ten yes/no questions a machine or a fresh chat can answer, so a comparison is a measurement not an opinion.
- OPEN  [missing sound]  E5  What we are missing against the best-sounding games: occlusion, reverb by space, distance colour, the bed (day 22), stings. A gap list with a two-word verdict each.
- OPEN  [first minute]  E8  What a human art reviewer does in the first sixty seconds with a new asset, and what a human audio reviewer does in the first ten seconds with a new sound. Turn both into the order this lane checks things in.
- OPEN  [every ship]  E9  STANDING DUTY, once E1 to E8 exist: on every SHIPPED line from any lane that touches pixels or sound, run the pass on the real surface, write a one-page verdict record with the screenshots and measurements, and post the two-word verdict to the coordinator; on a defect, write ONE [eyes: two words] line into that lane's section (the only exception to "only the coordinator adds jobs").

## RELEASE  (18. GET THE DEMO INTO PEOPLE'S HANDS. In plain words: this chat's whole job is that a real friend is playing the demo on their phone this week, and that what they did comes back to us. It does not wait for the game to be finished. It ships what exists, watches, and reports.)
MODE: BUILD
STATE: slices/BOHEMIA_DEMO.html exists (4.6 MB, re-cut 9/1) and a closed playtest protocol was written 8/11 (records/BOHEMIA_CLOSED_PLAYTEST_PROTOCOL_8_11_26.md). Nobody has ever put it in a stranger's hands. NOT owned by anybody until now: performance (dispatch item 7, never picked up), whether the demo is byte-current with the city, any way to see what a friend did in their session, and running the friend rounds. Unverified: load time and frame rate on a real iPhone today.
THE RULE FOR THIS LANE (Paolo 9/5: "I do want to get a demo into people's hands immediately though but there's so much to do"): the demo is never held for more content. What exists today is the demo. Every round of this lane ends with a link that works on a phone and a written note of what the last friend did.
- OPEN  [hands now]  HANDS-NOW -- FIRST, before anything below: take the demo as it is today, open it on a real phone, walk it once end to end, fix only what stops a stranger from getting to the first fight, and hand the link to ONE friend this round. Write down what they did in a record. Do not add content. Do not wait for any other lane. (Paolo 9/5)
- OPEN  [phone speed]  PERFORMANCE -- measure the demo on a real phone: time to first play, frame rate walking, frame rate in a fight, battery in ten minutes, the 4.6 MB load; set a budget for each and a gate that holds it (dispatch item 7, unowned since 8/25)
- OPEN  [demo current]  DEMO-IS-CURRENT -- prove the demo cut carries the same city file as the workshop on every ship, by hash, in a gate; today it is re-cut by hand
- OPEN  [friend telemetry]  WHAT-A-FRIEND-DID -- a way to see a friend's session without watching over their shoulder: taps, screens reached, minutes, where they stopped; written to something we can read; no accounts, no tracking beyond the demo
- OPEN  [cold hand]  BB-COLD-HAND  (moved from SHARED: the test that presses the loudest thing and never reads, on every demo screen)
- OPEN  [friend round]  FRIEND-ROUND-ONE -- run the 8/11 protocol for real with three friends, collect what they said and what the telemetry showed, and turn every finding into a job on this board through the coordinator
- OPEN  [install path]  ADD-TO-HOME -- the home-screen install is the save (day 21); make the path a friend actually takes work first time, on iOS and Android, and measure it

## GATEKEEPER  (19. THE CHECKER OF THE CHECKERS. In plain words: every rule in this game is enforced by a small test program called a gate. There are about 230 of them. This chat keeps THOSE running, fast, honest and complete. It does not touch game files. It does not clean game code. It does not build features. It builds and repairs the tests that catch everybody else. The plumber of all plumbers is close: it fixes the pipes that the other chats' water runs through, and nothing else. Name not final; Paolo picks.)
MODE: BUILD
STATE: ~230 gates; the full suite cannot finish in its time budget (LAB, 8/31); 82 gates never ran last attempt; gate colours are per-lane guesses. A law without a machine gate is not enforced, so this chat is what makes every other rule real.
WHAT THIS CHAT MAY TOUCH: gates/ and the two pile files it is told to archive (the handoff and the backlog), verbatim moves only. WHAT IT MAY NOT TOUCH: engine/, slices/, tools/, laws/, any art. A red gate it finds in another lane's work becomes ONE line in that lane's section, never a fix by this chat.
- OPEN  [suite runs]  SUITE-FINISHES -- make the full suite finish inside its budget again: measure every gate's time, split the slow ones, retire dead ones (with a record), run in parallel; the target is one command, green or red, in under ten minutes
- OPEN  [dead gates]  GATE-CENSUS -- every gate names what law it enforces and what would make it red; a gate that cannot say either is retired to archive/ with a record
- OPEN  [handoff cut]  HANDOFF-CUT -- the handoff file is 5.2 MB, 79,379 lines, ~1.3 MILLION tokens, and every session is told to read it first; only 14 lane blocks are live (61 KB). gates/handoff_gate.js forbids shrinking it by more than 20% in one write (written after an accidental truncation). Amend that gate so a DELIBERATE archive passes: when archive/handoffs/HANDOFF_ARCHIVE_<date>.md holds every byte removed, the bulk check is satisfied. Then replace 00_START_HERE_NEXT_SESSION.md with archive/handoffs/HANDOFF_SLIM_READY_9_4_26.md (already prepared: the newest block per lane, the gate's own lane definition). The coordinator cannot touch gates; whoever takes this lands a 98% cut in one commit. Also add to the front of the slim file: "older blocks live in archive/handoffs/". (Paolo 9/4: "I don't want a bunch of tokens being used just for the uplifting of this work structure.")
- OPEN  [backlog archive]  BACKLOG-ARCHIVE -- BOHEMIA_BACKLOG.md is 10,716 lines, ~193K tokens. Move every row marked done, dead, or superseded into records/backlog/ARCHIVE_<date>.md verbatim, keep the live rows, and add a one-line pointer. Same shape as the handoff cut; do it after.
- OPEN  [owed checker]  BB-A-GATE-CAN-SAY-OWED
- OPEN  [board checker]  VAMILY-GATE
- OPEN  [reference checker]  REFERENCE-CHECK-GATE -- sweeps every cook tool for a REFERENCE CHECK: block, the way reusefirst_gate sweeps for REUSE CHECK (9/4 compare law)

## SHARED (any chat with nothing open in its own lane)
MODE: BUILD
- OPEN  [loop wired]  BB-LOOPLESS
- OPEN  [acts real]  BB-THE-ACT-IS-A-STATE


## HISTORY
(nothing shipped yet -- 9/4/26. Every SHIPPED line above is the history.)
