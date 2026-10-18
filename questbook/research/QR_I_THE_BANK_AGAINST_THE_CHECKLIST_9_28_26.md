# QR-I: HOW DO THE 42 BANK QUESTS SCORE ON THE CHECKLIST, AND WHICH ARE WORTH RE-CUTTING?

QUESTION: row [bank against checklist]. Run QR-G's 28-line CHECKLIST (questbook/research/QR_G_WHAT_THE_FLAWS_FORBID_ON_A_PHONE_9_27_26.md, section THE CHECKLIST) over every quest in quests/bq/*.bq: the 5 main quests (M01 to M05), the 7 Act 1 openings (A01 to A07), the 27 side quests (S01 to S27) and the 3 designs-to-play (D001, D002, D013). For each: which lines pass and fail, and whether it is worth RE-CUTTING under rule 35c (one main quest; contracts taken or left; declining is free; the fee locked before the yes) and under Paolo's 9/28 ruling (a contract is a Battle Brothers settlement-menu OFFER SCREEN plus a job on the map and, if it comes to a fight, the fight board).

STATUS: draft:true, research only, nothing built (rule 35). Author: QUESTS lane, writer I, round two (9/28). The .bq files were read in full and were NOT edited.
FOLDED 10/9 (QR-AL): QR-U's the sharpens of rules 3, 7 and 14, at the end of THE RULE FOR THE BUILDERS, each marked "(folded 10/9 from QR-U)" in place.

## THE ANSWER IN ONE PARAGRAPH

No bank quest passes the checklist. The best scores 26 of 28 (M03 THE RIDGE), the worst 20 (S02 THE SAME CRATE TWICE), and the mean is 22.8. But the failures are not spread out: three lines carry most of the damage, and all three are failures of the .bq FORMAT, not of the writing. Line 2 fails in all 42 because every file opens with `@DO show_objective`, an objective banner (`Q023.X4`). Line 11 fails in 39 because stage 10 starts the quest before any yes exists, and because 31 of them route the player's "no" into a FAIL stage, 12 of them with a standing or bond penalty and 4 more with a guilt line (`Q084.X5`, `Q131.X7`). Line 28 fails in 37 because the bank writes 92 distinct persistent flags and not one is read by any other file or by the engine: three are read by a gate inside their own file, the other 89 are written into the dark (`Q123.X1`, `Q131.X2`, `Q130.X10`). The writing, on the other hand, is often the best thing in the repo: the bank passes line 20 (every choice writes a different ledger line) in all 42 files, line 24 (the kindest ending needs no boss verb) in all 42, and line 14 (the point is spoken, never an item text) in all 42. So the bank is a mine of scenes, facts and people wearing the wrong clothes. The verdicts: 14 RE-CUT AS CONTRACT, 11 RE-CUT AS EVENT, 12 MAIN BEAT, 5 RETIRE AS BANK ONLY. Under the 9/28 settlement ruling, the survivors are the quests that have a client who can stand in a hall, a fee that can be said before the truth, and a job that happens somewhere else on the map; the one-room dilemmas (a census, a triage, a deed, a strike) survive only as events or not at all, and the Marco, Dubai and wedding quests only as main beats. Eight re-cuts are filed with this page (QD-I01 to QD-I08).

## HOW THE SCORE WAS MADE

1. Every one of the 42 files was read whole: header, citations, stages, roles and every @TALK node. A mechanical pass then counted, per file, the stages, the ungated options per node, the giver's opening (lines and words), the factions wired, the TRAP options, the flags written and whether any file or engine script reads them. That pass is the source of every number below.
2. A line PASSES when the file, as written, does what the line asks. A line that cannot apply (line 18 for a quest that plants nothing, line 12 for a main beat) counts as a pass, and the table says so where it matters. Main beats read line 11 as "can the beat be walked past and wait" (the QR-H reading).
3. Some lines were read strictly and some kindly, and the reading is stated. STRICT: line 2 (an objective banner is a popup); line 13 (the giver's first node: at most three @SAY lines AND at most 60 words); line 19 (three or more factions wired in one quest is a fail); line 28 (a flag nobody reads is not covered by any play-forward test). KIND: line 12 passes if at least one in-job refusal of the giver's ugly ask ends COMPLETE with a price; line 1 passes if the fail state is a visible world state named in the file (a dark block, dry taps), even though no file says WHERE the player meets it; line 26 passes on a warm beat and no gore, and the analog horror "one wrong detail" is scored separately below (only S01 has one).
4. The 9/28 ruling amends rule 20 for contracts: the offer screen in the settlement menu is allowed. Line 2 is scored against the bank's objective banners and journal toasts, which the ruling does not allow.

## THE TABLE

Columns: quest, what it is, passes/28, worst failures (checklist line, with the X ids that line cites), verdict. Verdicts: CONTRACT (re-cut as a settlement offer screen plus a job), EVENT (re-cut as a road or settlement event: a face, two or three choices), MAIN BEAT (belongs on the one main road), RETIRE (bank only).

| quest | what it is | passes | worst failures | verdict |
|---|---|---|---|---|
| M01 THE NIGHT THEY CAME | the raid, the tutorial, the lost sibling | 23 | 19 (at second zero: `Q065.X2`, `Q051.X1`), 23 (the tutorial IS a fight: `Q017.X1`), 11, 28 | MAIN BEAT (keep content, drop the timing: the aftermath opening QD-F01 already does) |
| M02 THE DINNER AFTER | the grief dinner | 25 | 9 (two completes), 2, 28 | MAIN BEAT |
| M03 THE RIDGE | the burial, the first vista, the menu | 26 | 2, 28 (`act1_ridge_done` read by nothing) | MAIN BEAT |
| M04 WHAT THE NEIGHBOUR ASKS | the founding conversation | 24 | 11 (the no writes `refused_the_founding` as a FAIL: `Q084.X5`), 13 (71 words: `Q074.X5`) | MAIN BEAT |
| M05 SOMETHING IS COMING DOWN THE ROAD | the door to the procedural climax | 25 | 13 (63 words), 2, 28 | MAIN BEAT |
| A01 THE KILLING SUMMER | two blocks, one standpipe | 24 | 27 (the claim is wrong again: `Q148.X3`), 11, 28 | RETIRE (premise taken by QD-E02 and QD-D01) |
| A02 THE ELDER'S ACCIDENT | the Dubai seed, the locked box | 22 | 17 (the secret strand's first plant in an optional ask: `Q104.X3`, `Q125.X5`), 18 (`has_the_box` lands nowhere: `Q121.X1`, `Q096.X1`) | MAIN BEAT |
| A03 THE FACTION THAT DIED | an ally wiped; refugees | 23 | 27, 26 (no warm beat: `Q041.X3`), 11 | MAIN BEAT (a faction dying is a world event, his locked element) |
| A04 THE WEDDING THAT BURNED | the perimeter on the wedding night | 23 | 9 (two completes: `Q087.X4`), 27, 11 | MAIN BEAT (the partner is reserved identity) |
| A05 THE DRY TAPS | the pump station is held | 23 | 13 (61 words), 27, 11 | CONTRACT (retake a held station) |
| A06 THE FIRST HARVEST | the store is short by one person's carry | 25 | 11, 2, 28 | EVENT (a camp event: the store is short) |
| A07 THE TWO FAMILIES | two calm claims, one fence | 22 | 27, 18 (plants heirs' distrust, lands nowhere), 26 | RETIRE (no canon line behind it, by its own header) |
| D001 MOTHS AROUND THE LAST LIGHT | the lantern keeper | 23 | 15 (the key clue is a hum you hear: `Q141.X3`), 18, 11 | EVENT (the lit storefront on a night road) |
| D002 THE HOUSE HAS GONE BUST | a broker's frame-up of two crews | 23 | 16 (five ungated options: `Q060.X4`), 18, 11 | CONTRACT |
| D013 LONG WALK HOME | carry a body home from the ruin | 23 | 16, 18 (`a_tended_grave` lands nowhere), 11 | CONTRACT (a retrieval that pays little) |
| S01 THE METER READER | find the skim on the feed | 22 | 17 (brushes the secret in optional content), 13 (4 lines), 11 (a guilt line on the no) | CONTRACT (overlaps QD-D01; not re-cut this round) |
| S02 THE SAME CRATE TWICE | deliver a crate; a second buyer | 20 | 21 (the double-cross pays more standing: `Q130.X9`, `Q121.X2`), 12 (setting it down is a FAIL: `Q131.X7`), 3 ("by dark": `Q095.X1`) | CONTRACT |
| S03 ONE MORE SET | the busker's dying cell | 25 | 15 (the sag is heard), 11 | EVENT (a settlement event, the warm one) |
| S04 WHAT CRIES IN THE DEEP | the haunt is a person | 21 | 21 (the kill pays more than the rescue), 27 (monster-is-a-person: `Q148.X3`), 17 | CONTRACT |
| S05 THE STANDING BOUNTY | the board that never empties | 21 | 21 (double pay for the uglier name), 12, 11 (the no is told it starves the block: `Q084.X5`) | CONTRACT (re-cut: QD-I07) |
| S06 BEHIND THE FENCE | Marco's daughter revealed | 22 | 5 (needs S09 and a wall milestone: `Q112.X5`), 7 (`wall_down` is set by nothing: `Q071.X2`), 17 | MAIN BEAT |
| S07 SAY IT BACK | carry a dying woman's forgiveness | 22 | 22 (the kind ending is seen by nobody: `Q131.X2`, `Q146.X1`), 13 (84 words), 12 | EVENT |
| S08 THE TOLL ROAD | a medicine caravan at a checkpoint | 24 | 3 ("third day sitting", no map clock), 13, 11 | CONTRACT (overlaps QD-B04; not re-cut this round) |
| S09 THE BACK DOOR | Marco's boundary, before the wall | 23 | 9, 3 ("before dark"), 12 | MAIN BEAT |
| S10 THE COUNT THAT DOES NOT ADD | the census that feeds and lists | 23 | 17, 26, 11 | RETIRE (premise taken by QD-A03 THE METER BOOK) |
| S11 SIXTY SECONDS OF RAIN | the flash flood from a blue sky | 21 | 4 (asking her to be sure spends the clock: `Q142.X3`), 3, 15 | EVENT (re-cut: QD-I04) |
| S12 THE LAST GOOD DOCTOR | one course, two patients | 23 | 18 (`owes_the_cartel`, price later, never collected), 26, 11 | EVENT |
| S13 THE PAPER THAT SAYS SO | a deed against eleven years | 21 | 21 (the eviction pays the most standing), 13 (92 words), 16 | RETIRE (premise taken by QD-C04) |
| S14 WHAT THE DOG KNOWS | a stairwell held by a grieving dog | 25 | 11, 2, 28 | CONTRACT (re-cut: QD-I03) |
| S15 THE LIGHTS GO OUT AT NINE | a crew strike on the marquee | 21 | 21 (the bribe pays the most), 13, 16 | CONTRACT |
| S16 THE VOICE AT THREE | a pirate bulletin on a dead band | 22 | 25 (she asks for nothing: `Q133.X2`), 3, 11 | MAIN BEAT (re-cut: QD-I08) |
| S17 THE SEED THAT DOES NOT COME BACK | hybrid sacks against a saved line | 21 | 4 (the planting window closes during talk), 3 (a hidden window: `Q129.X5`), 18 | CONTRACT (re-cut: QD-I06) |
| S18 THE PATCH UNDER THE COLLAR | the best welder's hidden patch | 23 | 13 (84 words), 26, 11 | EVENT (a company event) |
| S19 THE MIDWIFE'S HOUR | one hour of fuel: lamps or boiler | 23 | 3 ("the next hour"), 13, 11 | EVENT |
| S20 THE NAME ON THE COUNTERFEIT | hollow battery tokens | 22 | 21 (selling the forger pays the most: `Q130.X9`), 13, 26 | CONTRACT (re-cut: QD-I05) |
| S21 THE ONE WHO CAME BACK | a man walks in from outside | 22 | 25, 21 (the squeeze pays the most), 13 | EVENT |
| S22 THE COLD ROOM | the running cooler that does not cool | 22 | 19 (three factions: `Q081.X4`), 3 ("by two o'clock"), 13 | CONTRACT (re-cut: QD-I01) |
| S23 DEAD POOL | the third intake under the lake | 23 | 19, 13, 11, and a CANON CONFLICT (canon: Lake Mead is healthy) | RETIRE |
| S24 FIFTY-FIVE GALLONS A FOOT | the green lawn is greywater | 22 | 25 (she tells you to do nothing), 19, 13 | EVENT (a tavern rumour that leads to a door) |
| S25 THE PRESSURE GOES BACKWARD | backsiphonage makes nine houses sick | 23 | 19, 13, 11 | CONTRACT (re-cut: QD-I02) |
| S26 WHAT THE COLD DID NOT KILL | sealed insulin that is not spoiled | 24 | 19, 11 (a TRAP "no" is a FAIL with a bond penalty) | EVENT |
| S27 THE FIFTY YEAR SIGNATURE | the light is a 2016 contract | 22 | 19, 13, 26 | MAIN BEAT (it explains the shape of the lit map) |

TALLY: 14 RE-CUT AS CONTRACT (A05, D002, D013, S01, S02, S04, S05, S08, S14, S15, S17, S20, S22, S25). 11 RE-CUT AS EVENT (A06, D001, S03, S07, S11, S12, S18, S19, S21, S24, S26). 12 MAIN BEAT (M01 to M05, A02, A03, A04, S06, S09, S16, S27). 5 RETIRE AS BANK ONLY (A01, A07, S10, S13, S23). Scores: 20 (1 quest), 21 (6), 22 (12), 23 (13), 24 (4), 25 (5), 26 (1).

LINE FAILURE COUNTS across the 42: line 2: 42. Line 11: 39. Line 28: 37. Line 13: 19. Line 26: 12. Line 18: 10. Line 3: 8. Lines 19, 21, 27: 7 each. Line 9: 5. Line 17: 5. Lines 12, 15, 16: 4 each. Line 25: 3. Line 4: 2. Lines 5, 7, 22, 23: 1 each. Lines 1, 6, 8, 10, 14, 20, 24: 0.

## THE FINDINGS

### F1. The three worst failures are the format's, so no rewrite of a line fixes them.

Lines 2, 11 and 28 account for 118 of the 219 failures (54%). All three come from how a .bq file is built, not from what its people say.

- LINE 2, THE BANNER (42 of 42). Every stage begins `@DO show_objective`, and every file declares @OBJ lines such as "Find why the block browns out". That is an objective marker by another name. `Q023.X4` names what bolted-on markers do (they remove the thrill without fixing the problem), and `Q114.N1` gives the port: a quest's entry is a visible oddity in the world, never a UI element. The 9/28 ruling allows ONE screen, the offer screen in the settlement menu; it does not allow a running objective banner after the yes.
- LINE 11, THE QUEST WITH NO YES (39 of 42). Stage 10 is the quest's first state, and it fires `show_objective 10` when the player meets the giver, so the quest is in the journal before the player has agreed to anything. Then the player's "no" (a decline, a walk-away, a "leave it") is routed to a FAIL stage in 31 files. Twelve of those FAIL stages carry a bond or faction penalty reachable from the offer's own refusal line (S07, S10, S13, S14, S15, S16, S20, S21, S23, S24, S26, S27). Four more say something that shames the no: S01 "I'll go ask somebody else's kid to do it", S04 "Then you're no use to me", S05 "Your block runs a week shorter on medicine, then", S08 "It's nobody's problem until it's everybody's". This is the refusal family QR-G ranked ninth: `Q084.X5` (refusing is punished with deletion), `Q131.X7` (refusal has no dignity path), `Q134.X10` (the only true refusal leaks out of the fiction). Rule 35c says the opposite: nobody remembers a no. Only three files get this right, and all three are main beats that do not route a refusal to FAIL (M02, M03, M05).
- LINE 28, THE FLAGS NOBODY READS (37 of 42). The bank writes 92 distinct flags. A search of every other .bq file, the engine, the slices and the records finds zero readers for 91 of them; the 92nd (`chose`) only matches because it is a common word in engine code. Three are read by a gate inside their own file (`went_back_first`, `she_is_moving`, `sat_with_him`). Even the main chain does not read itself: M02 does not check `act1_open_done`, M04 does not check `act1_ridge_done`. That makes every "the fold reads this later" comment in the bank a promise with no reader. `Q123.X1` (the quest corrupts saves) and `Q040.X3` (fragile multi-stage state) are the checklist's ids for untested state; `Q131.X2` (no one ever finds out) and `Q130.X10` (the town has no memory organ) are what a write-only flag feels like from the player's side.

The consequence for the builders is simple: a re-cut must replace the container, not polish the lines. The eight re-cuts below keep people, facts and choices, and throw away the stage-10 start, the @OBJ banners and the FAIL-on-no.

### F2. The bank prices loudness, and the loud cruel ending pays the most.

38 of the 42 files fork on VOLUME: every ending carries a CLOUT tag (#quiet, #notable, #risky, #reckless), and the bank's README says a reckless finish earns about 14 times the followers of a quiet one, because the feed's follower math reads the tag. The design intent was a thesis ("the feed rewards loud; the things that matter are quiet"). The library's reading is harsher. `Q130.X9` is the exact shape: the payment curve rewards feeding the fear, so the economy editorializes. `Q121.X2` and `Q125.X4` show a score settling a moral question for the player, and `Q125.P17` is the argument for our no-karma-bar law. Seven files go further and pay the crueller branch MORE standing than the kind one (line 21): S02 (double-cross, +12 against +10), S04 (the kill +8 against the rescue +6), S05 (the debtor's name +9 against the raider +5, and "double" medicine in the fiction), S13 (the eviction, +12, the highest), S15 (the bribe, +12), S20 (selling the forger, +15 and a finder's cut), S21 (the gate squeeze, +10). The fix is already in the library: `Q148.W1` (the fee locks before the truth, so no later choice is about the coin) and `Q149.P3` (conscience is never the difficulty slider). Every contract re-cut below pays the same fee whichever way the job ends, and moves standing only through what people SAY in the world.

A second cost of the loudness fork: in 24 files the quiet ending's log line says, in some form, that nobody saw it ("Nobody knows it was me", "Nobody else ever knew", "Nobody up top ever knew"). The kind act is designed to leave no trace, which is `Q131.X7` (the strongest choice most players make is invisible) turned into a rule. Only S07 fails line 22 outright, because the others change a visible thing (a lit block, a cold room), but the pattern is a warning for re-cuts: the quiet ending still needs a tell (QR-G rule SILF).

### F3. The bank's twists are one twist, told over and over.

The Act 1 openings were written to one rule ("THE ASK IS A CLAIM, AND A CLAIM IS CHECKED BY GOING TO THE THING"), and it produces the same reveal every time: the claim is wrong. A01 (right about the pressure, wrong about why), A02 (not a fall), A03 (somebody let them through), A04 (sure and wrong), A05 (not broken, held), A07 (one of them lies). The side quests repeat a second reveal: the monster, the thief, the forger or the owner turns out to be a sympathetic person (S04, S14, S20, S24, S25, S26). Counting every file whose job turns out to be something other than what the giver said, 19 of the 37 non-main files are built on a reversal (A01, A02, A03, A04, A05, A07, D002, S01, S02, S04, S06, S14, S20, S22, S23, S24, S25, S26, S27). The library names this exactly: `Q148.X3` (across dozens of contracts the monster-is-somebody twist becomes the expected shape and late contracts telegraph their sympathy beats), `Q148.P4` (generated contracts default to EXACTLY WHAT IT SAYS; the twist goes to a strict minority), `Q082.P9` (if every truth is provisional, the player stops investing), `Q032.P9` (one great twist beats three cheap ones), `Q066.X1` (repetition turns the story into a vending machine). The bank also carries 47 options tagged TRAP, many of them a curious question that costs (S01 "Whose current is it?", S10 "Who reads it after you?", S11 "You've been wrong before"). `Q004.P2` asks for ONE obvious-good trap, not a trap in most scenes. For the re-cuts: most contracts are plain; each re-cut below keeps at most one twist and says which.

### F4. The givers talk too much for an offer screen.

Line 13 fails in 19 files. The house style gives the giver three @SAY lines, which passes the line count, but the lines grew: the median opening is 59 words and the longest is 92 (S13 THE PAPER THAT SAYS SO). S01 gained a fourth line when its analog horror detail was added (9/21). `Q074.X5` (it assumes you will read a lot), `Q111.X6` (the payoff arrives as walls of text) and `Q068.X3` (lore-dump in big talky chunks) are the checklist's ids. The 9/28 offer screen makes this sharper: a Battle Brothers contract is the client's portrait and a few lines, then the pay. The re-cuts put the offer at 2 to 4 short lines (under 45 words), and move the rest of each giver's best writing into the job itself, where the player meets it on the grid.

### F5. The bank predates three rules, and they show.

- NOTHING FORCED, NOTHING IN THE FIRST SECOND (rule 32a). M01 opens at second zero on the raid and makes the tutorial a fight (lines 19 and 23: `Q065.X2`, `Q051.X1`, `Q017.X1`). The round-one record already flagged it; QD-F01 keeps the night and opens on its aftermath.
- CLOCKS. Eight files carry a deadline counted in hours and never shown on the map: S02 "by dark", S08 "third day sitting here", S09 "before dark", S11 "twenty minutes", S16 "two nights behind you", S17 the planting window, S19 "the next hour", S22 "by two o'clock". Line 3 asks for map days, said aloud and visible at the place (`Q095.X1`, `Q106.X5`, `Q119.X3`). Two of them let talking spend the clock without the first line saying so (line 4, `Q142.X3`): S11's "You've been wrong before" ends the quest in a drowning, and S17's FAIL line reads "the planting window closed while everyone was still being reasonable at each other". The library's fix is `Q142.P5` (our beat clock already makes a conversation clock-free unless a quest declares otherwise) and `Q011.P12` (make timed windows generous and legible).
- THREE FACTIONS IN ONE JOB. The last six side quests (S22 to S27) each wire three factions into one scene, which is line 19 (`Q081.X4`, a frame that needs a lot of names fast). A contract on a settlement screen has one client.

### F6. What the bank does well, and should keep.

Lines 1, 6, 8, 10, 14, 20 and 24 fail nowhere. Concretely: every file keeps its job to one leg and one or two places (`Q148.W10`, the contract as the best-scoped container); no exit needs a consumable; no failure costs more than the leg; every choice writes a different line; no ending is behind a boss verb or a stat (the .bq parser bans stat gates, which is the fix `Q123.X2` and `Q120.X1` ask for). The best files are also the most real. S22 (hard water turns cooler pads to stone while the pump runs), S25 (a pressure drop turns every hose in a barrel into an inlet), S26 (unopened insulin survives the valley's heat for months) and S27 (the dam's power split by a 2016 contract that runs to 2067) are each built on one true, checkable fact, which is the realism-first rule working exactly as intended. `Q018.W1` (knowledge is the upgrade), `Q019.W1` (deduction is the gameplay) and `Q008.W4` (a quest gated behind a life skill) are what these files already do. The writing lanes should mine these four first.

### F7. Three canon and overlap conflicts the builders should know about.

- S23 DEAD POOL is built on the lake dropping below dead pool. Canon (the brief, 9/27): Lake Mead is healthy and water is held by SHARE. The file's fact is true of the real world and wrong for ours. RETIRE, unless PEOPLE or WORLD want the third intake as a piece of the share's machinery with the lake full.
- S26 and QD-C02 (round one) touch the same medicine from opposite sides: S26 says unopened insulin does not need a fridge in the valley's shade; QD-C02's stolen cold box keeps insulin cold for a boy. They agree if C02's vial is an OPENED one (opened insulin keeps about a month at room temperature). WORDS should keep them consistent: the cold box is for the vial in use.
- Five bank premises are already on the round-one shelf in another shape: A01 (QD-E02, QD-D01), S10 (QD-A03), S13 (QD-C04), S08 (QD-B04), S01 (QD-D01). The round-two rule is "do not duplicate a premise", so the re-cuts below avoid all five.

### F8. Which bank quests survive the SETTLEMENT SHAPE, and which only work as main beats (the 9/28 ruling).

Paolo's 9/28 words: quests "aren't gonna be like traditional quest", they are the "settlement menu contract pop-up screen". Battle Brothers' own shape (reference/library/battle_brothers/08_CONTRACTS_EVENTS.md) is a client with a portrait in a settlement's hall, a pay offer, a negotiation (ask for more, ask for an advance), accept or decline, then the job on the map. A bank quest survives that shape when it has four things:

1. A CLIENT: somebody with a reason and the means to pay, who can stand in a building and say it in a few lines.
2. A JOB AWAY FROM THE HALL: a place on the map, or a block of the city cut as the fight board, where the work happens (retrieve, repair, find, escort, clear, investigate).
3. A FEE THAT CAN BE SAID BEFORE THE TRUTH (`Q148.W1`): the job has to be describable honestly without the reveal.
4. A REPORT BACK: the job ends at the hall (or a place the client names), where the fee is paid whatever moral branch the player chose, so the choice stays about the people, not the coin (`Q148.W9`, the client's closure is outcome-invariant).

SURVIVE AS CONTRACTS (14): A05 (retake a held pump station: Battle Brothers' "clear a camp"), D002 (a broker's job that is a frame-up: the "help the peasants" contract that is something else), D013 (retrieve a body: a low-paying retrieval), S01 (find the tap on the feed: investigate), S02 (deliver a crate: the package with a third party on the road), S04 (end the crying in the tunnel: the hunt), S05 (the standing bounty: the hall's patrol and bounty work), S08 (get medicine past a checkpoint: escort), S14 (clear a stairwell), S15 (settle a crew's pay: a negotiation job at another building), S17 (bring seed for a farm), S20 (find where hollow tokens start), S22 (repair a cooled room), S25 (find what is making nine houses sick).

SURVIVE ONLY AS EVENTS (11): the ones that are a face and a dilemma in one spot, with no job away from it and often no client who pays. A06, D001, S03, S07, S11, S12, S18, S19, S21, S24, S26. Some of these fit the settlement menu as a SITUATION rather than a contract (S03 in the tavern, S12 and S26 in the clinic, S24 as a tavern rumour, which is how Battle Brothers' tavern rumours work, one line each); the rest are road events (S11, D001, S21) or company events (A06, S18).

ONLY MAIN BEATS (12): M01 to M05 are the main line. A02 (the Dubai seed), A03 (a faction dies), A04 (the wedding) are Paolo's locked Act 1 elements with reserved identity inside them; a contract screen would sell his canon for batteries. S06 and S09 are Marco, the founding neighbour, whose daughter is a locked reveal (7/23). S16 (the voice on the dead band) is the whisper broadcast's first hand, which QR-H puts on the main road. S27 (the fifty-year signature) explains why the lit map has the shape it has, which is main-quest knowledge, and its date (2067) falls between Act 1 and Act 2, which makes it a natural plant for the flip.

RETIRE (5): A01, A07, S10, S13, S23, for the overlap and canon reasons in F7 and the table.

The one-room dilemmas deserve a sentence of their own. S10 (census), S12 (triage), S13 (deed), S15 (strike), S19 (fuel), S26 (insulin) and S27 (the chart) are some of the strongest scenes in the bank, and none of them is a job: the whole quest is a decision in one room. The settlement screen cannot carry them as contracts without inventing a fake errand in front of the decision, which is `Q083.X1` (the fetch-chain in a trenchcoat) and `Q079.X1` (a fetch quest with great writing taped to it). They go to events, or, when the decision is thesis-level, to main beats (`Q104.X3`: theme in optional content is the library's most expensive flaw).

### F9. Bank-wide notes for the other lanes.

- ANALOG HORROR. Only S01 carries a designed "one wrong detail" (the meter box someone still chalks every month, added 9/21). The other 41 have none. Every re-cut below adds one.
- RULE 36 (THE FIGHT GETS DEEP). No bank file knows the struck-down rule (20% dead, else 30 to 40 days injured). The bank's violent endings ("put them down", "went through him") cost nothing to the company. The re-cuts that can lead to a fight say so and price it in company members, which is the honest price `Q139.P2` asks a refusal and a fight to carry.
- THE THREE ACTS AT ONCE. No bank quest reads another act, because the flip (9/23) came later; they pass line 5 trivially. The flags they wrote for "the next generation" (`has_the_box`, `a_tended_grave`, `blood_for_light`, `owes_the_cartel`) are line 18 failures: a plant with no landing (`Q121.X1`, `Q022.X2`).

## THE RULE FOR THE BUILDERS

Numbered, each testable against a re-cut or a new contract.

1. NO BANK FILE SHIPS AS IS. Every bank quest scores 26 or less. A builder who reuses one re-cuts it into a design with the shelf header, "RE-CUT FROM: quests/bq/<file>", and a line saying what was cut and why.
2. THE YES COMES FIRST. A contract has no state until the player taps accept on the offer screen. No stage, no objective, no flag, no journal line exists before that tap. Test: decline the offer and diff the save; the diff is empty.
3. THE NO WRITES NOTHING AND SAYS NOTHING HURT. The decline button on the offer screen closes the screen. The client's last spoken line on a decline is flat ("Suit yourself." "Another time."), never a guilt line. Test: grep every decline line against the four bank guilt lines in F1.
4. THE FEE IS ON THE SCREEN, IN BATTERIES, BEFORE THE TRUTH (`Q148.W1`), and it does not depend on which moral branch the player took, as long as the job is done and reported. The one smaller number allowed is the PRICED REFUSAL (checklist line 12, `Q139.P2`), and it is also said on the screen before the yes. Standing moves only through what a person says in the world. Test: every COMPLETE ending of a contract pays the full fee, and the refusal ending pays the smaller number the screen named.
5. THE CRUELLER BRANCH NEVER PAYS MORE. Not in batteries, not in standing, not in followers. If the feed's follower math reads a CLOUT tag, it must not reward the cruel ending over the kind one (`Q130.X9`). Test: for every contract, max(standing) is not on the cruellest ending.
6. THE OFFER IS 2 TO 4 LINES AND UNDER 45 WORDS. The giver's best lines move into the job. Test: word count of the offer screen text.
7. EVERY FLAG HAS A READER. A persistent flag is written only if a named place, person, feed post or other act reads it, and the design names the reader. Test: for each set_flag, grep a reader; zero readers is a gate failure (this is what the bank's 89 write-only flags would have caught).
8. NO BANNER AFTER THE YES. After accept, the job is carried by the map (the marked place is a place, not a waypoint arrow), the person, and the fight board. No objective line, no "quest failed" toast (`Q023.X4`, `Q114.N1`).
9. CLOCKS COUNT MAP DAYS, SAID ON THE SCREEN, VISIBLE AT THE PLACE. An hour-scale emergency is a road EVENT resolved in one screen, never a contract with a hidden timer. Test: every deadline in a contract is an integer of map days on the offer screen.
10. ONE CLIENT, ONE NEW FACTION AT MOST. Test: a contract wires at most two factions, the client's and one other.
11. PLAIN BY DEFAULT, ONE TWIST AT MOST, AND NOT "THE CLAIM WAS WRONG" OR "THE MONSTER WAS A PERSON" MORE THAN ONE TIME IN FIVE (`Q148.P4`, `Q148.X3`). Test: tag each contract PLAIN or its twist class; count the classes across the shelf.
12. THE QUIET ENDING STILL HAS A TELL. A kind act nobody saw is still visible as a changed place or a person's later line (`Q131.X2`, `Q146.X1`). Test: every ending names one thing in the world that changed.
13. A FIGHT IN A CONTRACT OBEYS RULE 36. If a choice can lead to a fight, the design says so and names the price in company members; no kindest ending needs the fight (line 23 and 24).
14. ONE-ROOM DILEMMAS ARE NOT CONTRACTS. If the whole quest is a decision in one place, it is an event or a main beat. Test: a contract names a job place that is not the hall.

SHARPENED (folded 10/9 from QR-U):
- Rule 3 (the no says nothing hurt): draft haggle lines in the right register, "That's the top. Take it or don't."
  (`Q236.P2`).
- Rule 7 (every flag has a reader): a whodunit that breaks is worse than none; progression robust and machine-tested
  (`Q160.P3`).
- Rule 14 (one-room dilemmas are not contracts): the ledger in one room (`Q181.W10`), save one and lose the other
  (`Q226.P1`), mercy and honesty owed to one ghost (`Q176.W1`) belong to road events and main beats. A builder porting
  one into a contract first gives it a job place that is not the hall.

## WHAT TO AVOID (the bank's own flaws, by id)

The quest that starts before the yes, and the no that is a FAIL (`Q084.X5`, `Q131.X7`, `Q134.X10`, `Q103.X1`). The objective banner (`Q023.X4`). The write-only flag (`Q123.X1`, `Q040.X3`, `Q131.X2`, `Q130.X10`). The loud cruel ending that pays the most (`Q130.X9`, `Q121.X2`, `Q125.X4`). The same twist twice (`Q148.X3`, `Q066.X1`). The long opening speech (`Q074.X5`, `Q111.X6`, `Q068.X3`). The clock in hours that the map never shows (`Q095.X1`, `Q106.X5`, `Q119.X3`, `Q142.X3`). Three factions in one room (`Q081.X4`, `Q065.X2`). The plant that lands nowhere (`Q121.X1`, `Q096.X1`, `Q022.X2`). The fetch errand bolted in front of a decision (`Q083.X1`, `Q079.X1`). The raid in the first second (`Q051.X1`, `Q017.X1`). The quiet kindness nobody ever sees (`Q146.X1`).

## OPEN (what the library could not answer)

1. THE HAGGLE. Battle Brothers lets the client withdraw and relations dip when the player pushes too hard. Rule 35c says a no is free. Is a pushed haggle a no? The round-one record suggests keeping the withdrawal and dropping the dip (QR-E OPEN 1). The library has no study of a negotiation screen; `Q148.W1` only says the fee must lock before the truth. The re-cuts use: three asks for more, the third one withdraws the offer for this visit, nothing is written, and the offer returns on the next visit to the settlement. PEOPLE and ECONOMY tune it.
2. THE CLOUT FOLLOWER MATH. F2 shows the feed pays loud endings about 14 times more followers. Whether the feed should keep the loud-quiet contrast (as the bank's thesis wants) or stop paying for cruelty (as `Q130.X9` wants) is partly a design identity question; this page's default (rule 5) is that the follower math may reward LOUD but never CRUEL, and the two are separate tags.
3. THE EVENTS INSIDE A SETTLEMENT. Battle Brothers puts rumours in the tavern and healing in the temple. Several bank events (S03, S12, S24, S26) fit a settlement building better than the road. Whether a settlement building may open a person-with-a-choice screen that is not a contract is a UI call (RUN and UI), not a library one.
4. THE BANK'S CANON FACTIONS. The bank wires factions (REDS, BLUES, COLORFUL, MOB, ANARCHISTS) whose current canon standing this lane did not verify. The re-cuts name factions by role (the crew, the co-op, the clinic) and leave the names to PEOPLE and FACTIONS.

## THE EIGHT RE-CUTS FILED WITH THIS PAGE

- questbook/designs/act1/QD_I01_THE_PADS_TURNED_TO_STONE.md: contract, from S22 THE COLD ROOM.
- questbook/designs/act1/QD_I02_THE_HOSE_IN_THE_BARREL.md: contract, from S25 THE PRESSURE GOES BACKWARD.
- questbook/designs/act1/QD_I03_THE_LANDING_THE_DOG_HOLDS.md: contract, from S14 WHAT THE DOG KNOWS.
- questbook/designs/act1/QD_I04_BLUE_SKY_OVER_THE_WASH.md: road event, from S11 SIXTY SECONDS OF RAIN.
- questbook/designs/act2/QD_I05_THE_TOKENS_THAT_READ_FULL.md: contract, from S20 THE NAME ON THE COUNTERFEIT.
- questbook/designs/act2/QD_I06_THE_SACKS_THAT_DO_NOT_BREED.md: contract, from S17 THE SEED THAT DOES NOT COME BACK.
- questbook/designs/act2/QD_I07_THE_NAME_AT_THE_BOTTOM_OF_THE_LEDGER.md: contract, from S05 THE STANDING BOUNTY.
- questbook/designs/act2/QD_I08_THE_VOICE_AT_THREE.md: main beat, from S16 THE VOICE AT THREE.
