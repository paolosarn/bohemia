# VAMILY -- THE ONE WORD (Paolo 9/4/26, LOCKED)
# "Make the key word vamily for all of the jobs u assign to it ever in the
# history itll search if it has a job assigned for its role and yeah."
# Rebuilt 9/4 (later the same day) as the FULL-GAME queue for every lane,
# from records/BOHEMIA_WHAT_EVERY_CHAT_DOES_FOR_THE_REST_OF_THE_GAME_9_4_26.md

## HOW IT WORKS
0. THE CENTRAL CHAT (9/4): Paolo talks ONLY to the coordinator, THE MANAGER.
   EVERYTHING HE SAYS BECOMES A LINE HERE BEFORE THE REPLY ENDS. No exceptions.
   Word vomit procedure: for each thing, is there a line already? If yes, grow it
   with his words. If not, make one now for the right chat, tab named. Every other chat
   gets one word, VAMILY, and no discussion. A lane that needs a ruling writes
   [PENDING Paolo] in its handoff block; the coordinator carries it to him.
1. Paolo types **VAMILY**. That is the whole instruction. HE NEVER TYPES ANYTHING
   ELSE IN A LANE CHAT. No lane word, no customising, ever (Paolo 9/4).
2. The chat works out its ROLE by itself: if it already has one, it keeps it;
   if it is fresh, it takes the first UNCLAIMED lane from THE LANES below and
   claims it. He never assigns a role by hand.
3. Find your lane below. Take the **first line marked OPEN**. If the job has
   a `BB-` name its full text is that row in BOHEMIA_BACKLOG.md; otherwise
   the one-line brief here plus the lane section in the 9/4 plan record IS
   the job.
4. Change the line to `CLAIMED <date> <session>` and commit BEFORE building.
5. When it is in the walked surface AND the demo (re-cut it), change the
   line to `SHIPPED <date> <commit>` and commit. That is the history.
6. Then the next OPEN one, or stop and say so.
7. EVERY LANE SECTION CARRIES A MODE (9/4). MODE: BUILD is the above. MODE:
   RESEARCH means DO NOT IMPLEMENT: take the first OPEN question, do one research
   day in the BB-study shape (both aisles, one finding that challenges us,
   measured against our repo, a record, test lines tagged draft:true in a bank
   file never in the game, and a ROUTED section), mark the question SHIPPED
   with the record's path. Big swings; a day that only confirms us has failed.
   A section marked PARKED is not claimed by anybody until he reopens it.
Only the coordinator adds jobs. Lanes change the status word and nothing
else. STANDING DUTIES, every turn, every lane: VAMILY first; play it on the
real surface before calling it shipped and re-cut the demo; his bugs beat
your queue; run your lane's gates, never ship red; 120 BPM friendly for
everything; rewrite your handoff block before you end.

## THE SIXTEEN CHATS (his list, 9/4). Every one has a queue below. He types VAMILY, nothing else.
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
    QUESTS           -> PARKED by Paolo 9/4; no chat, nothing claimed until he reopens it

## WORLD  (02. the economy, the map, the towns)
MODE: BUILD
STATE: the purse ledger and payout pipe are built and called; the three price tables are EMPTY and electricity and clout have never moved; nothing drains; the map is 35 districts with 18 factions placed. Unverified: whether the faction world's territory AI drives anything visible on the walked surface.
- OPEN  BB-BATTERIES-ARE-THE-MONEY  (with BB-THE-LETTER-IS-ONE, one job)
- OPEN  BB-THE-LETTER-IS-ONE
- OPEN  BB-FOUR-VERBS-THREE-CURRENCIES
- OPEN  BB-THE-NIGHT-EATS-POWER
- OPEN  FACTION-TOWNS -- every faction has a seat that is its market, buildings and quests; FORTRESS / TOWN / CAMP derived from act1_power, draft:true; who sits where is his (9/4 law)
- OPEN  BB-TURF
- OPEN  BB-ROADS-ARE-FAST
- OPEN  BB-THE-RUNG-PAYS
- OPEN  BB-COALITION

## QUESTS  (first word "quests")
MODE: PARKED -- Paolo 9/4: "no quest chat yet... I need aesthetic supervision on experiencing it." Nothing below is claimed until he reopens it.
- OPEN  MAIN-QUEST-SPINE -- Act 1 main quest as .bq stubs from laws/BOHEMIA_STORY_MASTER_7_18_26.md; not one main-quest file exists; the single largest hole in the game
- OPEN  BB-THE-JOB-PAYS  (after WORLD's first job lands)
- OPEN  BB-INSIDE-A-DAY
- OPEN  BB-TERRITORY-FLAG  (after WORLD BB-TURF)
- OPEN  THE-FOLD-IN-THE-RUNTIME -- the gen 1 to gen 2 handoff as quest runtime: what carries, what the heir inherits, the beat itself; canon is his, the machine is ours
- OPEN  DESIGNS-TO-BQ -- convert prose designs 001, 002, 013 to playable .bq; the designs are done, only the machine layer is missing
- OPEN  BB-ASK-FOR-MORE
- OPEN  DIRECT-COVERS-QUESTS -- the DIRECT tab edits quest stages, not only cutscene beats (8/12 law)
- OPEN  ACT-2-OPENING -- needs Paolo: who dies next; write the scene the moment he rules

## SOUNDS  (08.)
MODE: BUILD
STATE: 65 approved sounds, 185 variants; the walked city can produce 14, all reactions; the ambience bed is built and fed only by a message the city never sends; music phase stuck on NIGHT. Unverified: where the music engine module lives (not in engine/).
- OPEN  BB-THE-CITY-SENDS-WHERE
- OPEN  BB-THE-DAY-SONG-PLAYS
- OPEN  BB-THE-BED-IS-THE-PLACE
- OPEN  BB-A-LIT-BLOCK-HUMS
- OPEN  THE-OTHER-51 -- give every approved sound a caller on the walked surface; 51 of 65 have none; no new cooks

## LIFE + CITY  (03. the city-builder tab and the aerial view; the buildings, the housing, the century)
MODE: BUILD
STATE: build verbs and a picker EXIST in the aerial tab (engine/bohemia_cityedit.js, cityTapPlot). NOT built: nothing produces (produce() has one caller and it is a gate), nothing houses anybody, building is free, the builder is not reachable from the walked surface or the demo, no century record exists. Unverified: whether the aerial build panel works on a real phone (a backlog row says its touch path once crashed).
- OPEN  BUILDER-ON-A-PHONE -- prove the aerial build panel works by touch on a real iPhone, or fix it; the backlog says it crashed once and nobody re-checked
- OPEN  PRODUCTION-TICK -- on the wake beat, walk every placed building and call produce(); today produce() has one caller and it is a gate
- OPEN  BUILD-COSTS-ITS-PRICE -- CE.build debits PRICES; building is free today and the 8/15 law says the pipe must be exercised
- OPEN  BUILDER-WHERE-HE-WALKS -- the build verbs and panel reach the walked surface and the demo; today they live only in the aerial tab
- OPEN  HOUSING -- residents per plot, capacity, a population number that moves; the other half of the 7/26 economy law, zero built
- OPEN  CENTURY-RECORD -- persist per-act build totals so act 3's city can differ; mechanism ours, every number his
- OPEN  THE-FEED-STREAM -- one event stream the city-screen feed reads: the deed ledger first (exists), then faction/territory events, then ambient life posts; with PEOPLE
- OPEN  THE-AERIAL-VIEW-IS-THE-COMBAT-FLOOR -- with COMBAT: the zoomed-out city render is what the fight stands on (9/4 tile law 3b); expose it as a drawable layer COMBAT can centre on a block
- OPEN  POPULATION-DEFAULT -- dispatch item 5, "dead is not the default"; the number is his, the mechanism (a default that is not zero) is ours
- OPEN  A-BUILDING-YOU-PLACED-SHOWS-UP-ON-FOOT -- what you build in the aerial view is standing there when you walk to it; INTERIOR = EXTERIOR holds

## COMBAT  (04.)
MODE: BUILD
STATE: RF4 on the beat, 53 bosses wired, the key ledger leaves, a 23-perk tree saved, the companion measured, the door from the city works (gate 26/0). NOT built: the indoor entry, loot leaving, FEAR_ON is false with its perk shipped, armour all zero, the house-scale board. Unverified: gate colours (the suite cannot finish in budget).
- OPEN  BB-A-TILE-IS-A-HOUSE
- OPEN  BB-NERVE-ON
- OPEN  THE-INDOOR-FIGHT -- the door from the city works (gate 26/0); the indoor entry is the missing half (day-14 row)
- OPEN  BB-LOOT-LEAVES  (with BB-KEYS-LAND and BB-THE-FIGHT-KNOWS-THE-DAY, one pipe)
- OPEN  BB-GUNS-CLOSE
- OPEN  BB-PICKUP
- OPEN  BB-THE-FIGHT-EATS-TAPE
- OPEN  BB-THE-ROUT
- OPEN  BB-SAVE-BEFORE-THE-BELL
- OPEN  ARMOUR-AND-MORALE -- armour as a layer (the field is on every body and all zero) and morale past the nerve roll; no damage number moves
- OPEN  SIXTY -- the seven bosses to reach 60 and which of the 53 grants unlock a real verb; needs Paolo, cannot start first
- OPEN  RF4-SPEC-DIFF -- close the 68-item RF4 teardown spec's diff column (from LAB)
- OPEN  RF4-SPEC-DIFF -- close the 68-item Rogue Fable 4 teardown's diff column against the decoded fight (COMBAT_B64), one line per item: matches / differs / not built
- OPEN  BB-SPEC -- the Battle Brothers study's 23 records folded into one spec of the same shape as the RF4 one, so COMBAT and WORLD have one reference document per named game

## RUN  (01. the walked surface)
MODE: BUILD
STATE: the door opens on the played surface, the demo build exists (re-cut 9/1), the save is hardened and carries day/clock/position/quest/purse; road interrupts fire only on map travel. NOT built: the people inside the save, a title or stop-and-return, an ending that is not bed. Unverified: the demo re-cut is byte-current with the city file.
- OPEN  BB-THE-PEOPLE-RIDE-THE-SAVE
- OPEN  BB-THE-GATE-WALKS-THE-PEOPLE
- OPEN  ROAD-INTERRUPTS-ON-FOOT -- roadInterrupt has one caller inside MODE==='city'; it never fires on the walked street
- OPEN  BB-WHAT-YOU-OWE
- OPEN  BB-THE-SHADOW-OF-WHAT-YOU-DID
- OPEN  BB-THE-TIME-NOT-THE-TAPS
- OPEN  BB-HOME-SCREEN-IS-THE-SAVE
- OPEN  STOP-AND-COME-BACK -- a title / resume surface; nothing exists (record item H)
- OPEN  AN-ENDING-THAT-IS-NOT-BED -- the demo's last thirty seconds is the only ending in code (record item G)
- OPEN  BB-THIS-WEEK

## ANIMATION  (14.)
MODE: BUILD
STATE: 63 named clips; the walked PLAYER is animated (idle, four walk, four run, eight directions, on the beat); the NPC crowd is frozen sprites; no clip carries a verdict since the 7/26 reset; ten clips killed 7/2 with no replacement; last animation ship 8/18. Unverified: whether the ANIMATION tab still renders.
STANDING DUTY (9/4 law): every clip compared side by side to the best pixel walk/idle/hit cycles online before it is called done; REFERENCE CHECK documented.
- OPEN  THE-63-CLIP-AUDIT -- play every clip on the real surface, list what is broken and how, before any recook (his 8/25 order, untouched)
- OPEN  SHOW-HIM-THE-LIST -- needs Paolo: verdicts on the 63; no clip carries one since the 7/26 reset
- OPEN  ANIMATE-THE-CROWD -- the bake already sends walk frames for the city cast; the decoder keeps only idle, so every resident is a frozen sprite
- OPEN  RECOOK-WHAT-HE-KILLS
- OPEN  HURT-AND-DEATH -- killed 7/2 with no replacement; a game needs them; needs Paolo
- OPEN  LEAF-GATE-EVERY-RECOOK

## CHARACTER  (05.)
MODE: BUILD
STATE: the rig enforced by 137 assertions, the 56/112 pipeline, hair, faces, wardrobe and the face maker at the match cut all ship and persist. NOT done: the hair reference sheet in all eight facings (his 8/25 order), the round-7 look. This lane WIRES what COOK cooks.
- OPEN  WIRE-THE-REMAKE -- as ART batches pass DIRECTION, wire them into the picker and the wardrobe data; ART makes pixels, CHARACTER makes them worn
- OPEN  HAIR-REF-EIGHT-FACINGS -- his 8/25 order, still open
- OPEN  ROUND-7-LOOK -- needs Paolo
- OPEN  WARDROBE-VOLUME -- new garment shapes behind the structure law

## PEOPLE  (09.)
MODE: BUILD
STATE: talking on foot with nine verbs, a real witness memory, schedules and homes, 12 encounters firing on foot. NOT built: the player as a node in standing, the conversation chain in the demo file (236 nodes mute), outfits near spawn, any family event. Unverified: whether the talking portrait reaches a live NPC card.
- OPEN  BB-STANDING-PLAYER
- OPEN  TALK-REACHES-THE-DEMO -- 236 @TALK nodes and 504 @SAY lines are parsed and mute in the demo file
- OPEN  OUTFITS-AT-SPAWN -- zero of 34 people within six cells wear one
- OPEN  BB-WHAT-YOU-WERE
- OPEN  FAMILY-EVENTS -- something writes a child, a marriage, an ageing into family.tree; selectHeir has zero callers
- OPEN  BB-OBLIGATION-BURN
- OPEN  BB-THE-SHADOW
- OPEN  SUCCESSION-BEAT -- needs Paolo: who you can marry, what an heir inherits
- OPEN  A-COMPANION-ON-FOOT -- needs Paolo: ROSA is a draft he has not ruled on

## FACTIONS  (10.)
MODE: BUILD
STATE: 18 factions in the graph (14 selectable plus four more), every one with act1_power and act3_power, wrapped writes protecting canon. NOT built: the player is not a node; zero of 34 people near spawn wear an outfit; nobody holds ground; the non-selectable factions have no verified presence on the map.
- OPEN  FACTION-SEATS -- every selectable faction has a seat placed on its generated district, and the seat is where its town grows (with WORLD FACTION-TOWNS); moving a seat is his
- OPEN  THE-OTHER-FOUR -- the four non-selectable factions: do they exist anywhere a player can meet them? measure, then place a presence or write [PENDING Paolo]
- OPEN  COLOUR-AUDIT -- every faction's colour is coordinated, saturated and nobody else's (COLOUR IS TERRITORY); the gate holds contradictions, this row fixes them
- OPEN  TOWN-TIERS-ARE-HIS -- needs Paolo: the draft tiers off act1_power ship; he moves any faction he likes; with WORLD FACTION-TOWNS
- OPEN  NAME-THE-CIRCUIT-OWNER -- needs Paolo (who holds what)
- OPEN  BB-COALITION  (with WORLD)
- OPEN  BB-UNPAID-TURNS-PREDATORY

## WORDS  (12.)
MODE: RESEARCH -- Paolo 9/4: "keep doing big brain online research... don't implement anything. Just test and write down. Big swings." Subject: HOW PEOPLE TALK, banked for the day quests open. Test lines go to banks/BOHEMIA_WORDS_TEST_LINES.md, draft:true.
STATE: 2,442 authored lines, a voice card and a voice gate, 27 quest scenes measured against 617 films; the language cap (8/26) stands. This lane does not implement; it researches how people talk and writes test lines to a bank.
- OPEN  Q1  Two people, three lines each, and you can tell them apart with the names removed. What the best-written games do with vocabulary, rhythm and the thing a person never says. Measure our 504 NPC lines for it.
- OPEN  Q2  How a person talks when they are lying, scared, or exhausted, in TEXT with no voice actor. The real science of speech under stress (hesitation, repair, shortened sentences) and which games get it onto the page.
- OPEN  Q3  How a crowd talks without repeating itself. The best ambient-bark systems ever built: how many lines, how they are chosen, how they avoid the third repeat. Against our roadside director's twelve.
- OPEN  Q4  Speech on a beat. At 120 BPM how many words fit one beat, two, four; how the best rhythm-aware games pace a line; what a line that lands ON the beat does that one that drifts does not.
- OPEN  Q5  Refusal. How the best games let a character NOT answer, change the subject, or lie by omission, and how the player still learns something. Against our asking module's eighteen blocks.
- OPEN  Q6  Talking across a power gap. Sociolinguistics of address: how a boss talks to a hand, a stranger to a fortress, a camp kid to anyone. Test lines for one exchange at each gap.
- OPEN  Q7  The second conversation. How speech changes when a person REMEMBERS you (our memory organ already tracks it). What the best games do with a returning player, and what they do wrong.
- OPEN  Q8  Grief speech. The cold open kills the sister. How real people talk in the first hour, the first day, the first month, and which games wrote it honestly. Test lines for the grief dinner.
- OPEN  Q9  What a former trade sounds like. A dealer, a lineman, a laundry chief, a pit boss: the vocabulary and metaphors a job leaves in a mouth (day 8's background as identity). Test lines for six trades.
- OPEN  Q10 Threats that de-escalate and threats that escalate. What real negotiators and the best-written standoffs do with a sentence, for the gambit orders (day 3).
- OPEN  Q11 What the face can carry so the words do not have to. At 64 px with mouth, blink and brow, which emotions read without a word, and how games with a talking portrait split the load between face and text.
- OPEN  Q12 Names and nicknames. How people in a collapsed city name each other and places (real post-disaster naming, gang and crew naming), and what that does for a player learning who is who.
- OPEN  Q13 Rumour. How true and false news moves through a small world by speech alone, in the real record and in the best games, for the man-who-lives-tells-people axis (day 12).
- OPEN  Q14 The one-word answer.
- OPEN  Q15 How a feed talks. The city screen scrolls posts about what you did and what the world did. What real small-community feeds and the best in-game feeds sound like, and how to keep an auto-generated post from reading like a press release. Test posts for five deeds and five world events. When the best games let a character answer in one word and why it lands. Test lines: twenty one-word answers, each a different person.
- OPEN  BB-THE-SMALL-MOMENT  (build, held until the lane returns to MODE: BUILD)
- OPEN  BB-STILL-SAYS-IT  (build, held)
- OPEN  BB-RESPONSIVE  (build, held)
- OPEN  SECOND-VOICE-PASS  (build, held)

## UI  (11.)
MODE: BUILD
STATE: HUD, phone, pad, day card exist. NOT built: any settings or pause screen, any onboarding, the city-screen feed. Unverified: the round-7 look, which is his to thumb.
- OPEN  THE-FEED-ON-THE-CITY-SCREEN -- in CITY mode a phone screen on the UI scrolls a social feed: your finished quests, what the world did, auto-generated life; reads the deed ledger; on the beat (9/4 law)
- OPEN  BB-ONE-NUMBER
- OPEN  SETTINGS-AND-PAUSE -- volume, mute, quit, save; nothing exists
- OPEN  FIRST-RUN-TEACHING -- the pad, the phone, DROP IN; nothing exists; measure with the cold hand
- OPEN  BB-WHY
- OPEN  BB-FORETOLD
- OPEN  ROUND-7-LOOK -- needs Paolo

## DIRECTION  (06. the Art Director. Decides the look, judges every cook. Does not cook.)
MODE: BUILD
STATE: a visual constitution exists (records/target, target_match_gate); no style card for the runway exists yet; the VOTE tab now shows what each candidate was matched against (MATCHED TO, 9/5).
- SHIPPED 9/5 55c0147  REFERENCE-BESIDE-EVERY-CANDIDATE -- every judge sheet (VOTE, look sheets, district renders) shows the reference the cook was compared against, side by side; DIRECTION judges the comparison before VOTE (9/4 compare law)
- OPEN  THE-REFERENCE-LIBRARY -- one folder per asset kind (district, building, garment, haircut, face, walk cycle, prop, combat ground, UI) holding the best real and pixel references online, each with a one-line note of the structural rule it teaches (windows in a wall plane, a door on the ground); COOK and DIRECTION read from it; nothing from it enters the design vocabulary (8/28)
- OPEN  REFERENCE-INDEX -- an index file the reference_check_gate can resolve a REFERENCE CHECK against, so a cook that names a reference names a real one
- OPEN  RUNWAY-REFERENCE -- the Balenciaga and Rick Owens silhouette library at the level of shape (shoulder, drape, hem, boot), for DIRECTION's style card; no third house until he names it
- OPEN  PIXEL-CITY-BUILDER-REFERENCE -- the best pixel city-builder districts online, annotated for what a block, a street and a lot look like at our tile size, for the faction-towns and combat-ground work
- OPEN  FIRST-HOUR-REFERENCE -- the first ten minutes of the best games ever made, written up as beats, for the cold hand and the onboarding work (day 14)
- OPEN  THE-STYLE-CARD -- the runway in pixel terms: palette, value bands, silhouette rules, what a Balenciaga shoulder and a Rick Owens drape ARE at 56 and 112 px, for the 45-degree corpus (laws/BOHEMIA_ADDENDUM_THE_RUNWAY_AND_ART_AT_ALL_TIMES_9_4_26.md)
- OPEN  STYLE-CARD-GATE -- fails any cook outside the card's palette and bands, same shape as target_match_gate
- OPEN  JUDGE-EVERY-ART-BATCH -- standing: nothing from ART reaches VOTE without passing the card

## COOK  (16. the Production Artist. Environment, character and prop art to DIRECTION's bible. Never idles; the last line is permanent.)
MODE: BUILD
STATE: 49 districts registered through the kit, 71 dossiers, about 20 map-only districts nobody draws, 19 authored codes never placed, 35 outer garments, 24 canon haircuts. NOT done: anything to the runway card (there is no card yet), the combat ground, the fortress buildings.
STANDING DUTY (9/4 law): EVERY COOK CARRIES A REFERENCE CHECK. Compare it side by side to real work of its kind online before calling it done; document what it was compared to, which structural rules were taken, what changed. Structure from reference, style from us. No shots in the dark.
- OPEN  WARDROBE-REMAKE -- every garment to the card, NEW SHAPES ONLY (structure law), graveyard stays dead, 10% coat cap stands, colour stays territory; batches through the existing kill/approve pipeline
- OPEN  HAIR-TO-THE-CARD -- every haircut to the card; all eight facings; the hair, hairline, graveyard and leaf gates hold
- OPEN  COMBAT-GROUND-TILES -- the combat floor tile at 1.5 to 2 sprite-widths, on the 45-degree corpus: house, yard, street, lot, cover that reads; a house with a backyard spans 1x2 (9/4 tile law 3d)
- OPEN  FORTRESS-BUILDINGS -- the buildings a faction fortress needs that nobody has drawn, in tier order (FACTION-TOWNS)
- OPEN  MAP-ONLY-DISTRICTS -- about 20 places the overmap names and nothing draws; audit, then build or cut
- OPEN  STRIP-FAMILY-RULING -- needs Paolo: cut or build the strip / casino / resort family
- OPEN  THE-19-CODES -- authored legend codes never placed
- OPEN  BOXCAR-ORDER
- OPEN  LANDMARK-RE-PROBE
- OPEN  COOK-THE-NEXT-THING-THE-CARD-ASKS-FOR -- permanent; this line is never marked shipped

## ECONOMY  (13.)
MODE: RESEARCH -- the game's identity is "the most realistic economic crash simulator, but fun", and the builder half is a quarter built. Research only; every finding becomes a WORLD job later. No game he has not named enters the design; bring back mechanics in plain words.
STATE: the game's identity is the most realistic economic crash simulator, but fun; the builder half is a quarter built and nothing drains. This lane does not implement; every finding becomes a WORLD or LIFE + CITY job.
- OPEN  Q1  The first thirty days after a currency dies. What actually happened to prices, wages and shops in Argentina 2001, Zimbabwe 2008, Venezuela, Lebanon 2019. Which of it a player would feel in a first hour.
- OPEN  Q2  How money comes back. How a good becomes money when the money is gone (POW-camp cigarettes, prison mackerel, detergent, phone credit) and what makes it fail. Test the battery against every failure.
- OPEN  Q3  What people rebuild first. Cuba's Special Period, post-Katrina New Orleans, Detroit, post-Soviet towns: the real order of rebuilding, for the century rule's sequence.
- OPEN  Q4  Placing a building that feels good in the first hour. What the best builder games ever made do in the first ten minutes of building, and what makes a placed building feel like it did something.
- OPEN  Q5  An economy with no numbers on screen. How the best games show scarcity, price and wealth without a spreadsheet. Against our one-number rule.
- OPEN  Q6  Who runs a casino when the money is gone. The back of house as an economy: laundry, kitchens, boilers, the deep dry stores (day 8). What a fortress actually produces.
- OPEN  Q7  Water. Lake Mead, the real constraint on Las Vegas. What a valley of a few thousand people actually needs and where it comes from when the pumps stop.
- OPEN  Q8  Electricity as money in the real world. Microgrids, battery economics, Nevada solar, what a AA is really worth in energy. Denominations for the battery.
- OPEN  Q9  Credit without courts. Rotating savings circles, hawala, tabs at a bar: how debt works when nobody can sue, for the obligations motor (day 7).
- OPEN  Q10 The market day. How real periodic markets work (who comes, from how far, how often) and what the best games do with a trading trip, for the faction towns.
- OPEN  Q11 Inflation as a feeling. What runaway prices do to behaviour (spend today, hoard, barter) and how a game could make a player feel it in a week of play without a single chart.
- OPEN  Q12 Housing. How people actually house themselves after a collapse (squatting, doubling up, who gets the good buildings) for the other half of the economy law.

## DYNASTY  (15.)
MODE: RESEARCH -- Gen 1 Animal, the fold, Gen 3 Angel, the heir: not started on any surface and never owned. Research only; findings become PEOPLE, QUESTS and RUN jobs when those open. Canon (who marries whom, who the Angel is) stays his; the lane brings shapes.
STATE: Gen 1 Animal, the fold, Gen 3 Angel: nothing on any player surface; selectHeir exists with zero callers; nothing ever writes a child. This lane does not implement; findings become PEOPLE, RUN and (when reopened) QUESTS jobs. Canon stays his.
- OPEN  Q1  Playing as an animal. What the best games ever made do when you are not human: what you can do, what you cannot, what the player feels, and where it gets boring. For Gen 1.
- OPEN  Q2  A coyote in Las Vegas. The real ethology of urban coyotes (range, diet, how they read people, how they die) as the animal generation's actual life.
- OPEN  Q3  What carries across a generation. In the best games with inheritance, what the heir keeps, what they lose, and which of it the player actually cares about. Against our fold maths (selectHeir exists, unused).
- OPEN  Q4  The third-generation curse. How real family businesses and dynasties survive or die by the third generation, and what a game could take from it for Gen 3.
- OPEN  Q5  Growing old on screen. How the best games show a character ageing in a way that changes play, not only the portrait.
- OPEN  Q6  The time skip. How to jump ten years and make the player feel it; what the best games do at a cut like ours (the match cut at the table).
- OPEN  Q7  A partner and a child without a chore. How the best games handle a companion becoming family and a child arriving, and where it turns into babysitting.
- OPEN  Q8  Remembering a life you did not play. How the second generation remembers the first: what the game shows the heir about the parent, and what real second generations actually keep.
- OPEN  Q9  A place across a hundred years. Real succession of a town (what stays, what is renamed, what is forgotten) for the century rule and for Act 3's city.
- OPEN  Q10 The transcendent last act. Not the lore, the SHAPE: how the best games handle a final act where the rules change (a new kind of body, a new kind of power) without breaking the game that came before. For the Angel.
- OPEN  Q11 Death that is not the end. How games without permadeath and without a run still make a death matter across generations (the wounds that carry, day 4's scar).
- OPEN  Q12 The heir's first hour. When the fold happens, what the first ten minutes of the next life must do so the player does not feel they lost everything.

## SHARED (any chat with nothing open in its own lane)
MODE: BUILD
- OPEN  BB-COLD-HAND
- OPEN  BB-A-GATE-CAN-SAY-OWED
- OPEN  VAMILY-GATE
- OPEN  REFERENCE-CHECK-GATE -- sweeps every cook tool for a REFERENCE CHECK: block, the way reusefirst_gate sweeps for REUSE CHECK (9/4 compare law)
- OPEN  BB-LOOPLESS
- OPEN  BB-THE-ACT-IS-A-STATE

## HISTORY
(nothing shipped yet -- 9/4/26. Every SHIPPED line above is the history.)
