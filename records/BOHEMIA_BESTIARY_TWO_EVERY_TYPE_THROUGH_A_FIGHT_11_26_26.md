# BESTIARY 2: EVERY TYPE THROUGH A FIGHT, AND THE BIGGEST PACK ON A SLOWED PHONE -- 11/26/26
BUILD 11/26z - THE BEAST THAT BEAT YOU. VOTE card bestiary2-the-beast-that-beat-you-11-26.
VAMILY rules 480(b)(c)(d) (Paolo 11/26: 'Lets turn up full sweep. But improve on what we already have. And make sure fps is never
choppy for nothing'), 482 (Paolo 11/26: 'More cooking up cleaning up improving things we're already doing'), 461(c) as amended
(no tool that waits for a tap), 441 (the page he plays, a phone both ways), 454(a) and 465 (no person's line written or
rewritten: the words touched here are the fight's labels for a party and two verbs that agree with them). The round BESTIARY wrote
in its handoff: no new beasts; each enemy type already built through a fight on the phone, its look reads, its moves work, its drops
land, no bug; the biggest pack holding its frames on a slowed phone; ask rows for what is not this lane's.

## WHAT WAS CHECKED (rule 480(b): this lane's pieces already in the game, every one)
EVERY KIND A BAND DEALS, 80 of them (bohemia_enemies.json mix and heads, ours.json enemy_tiers mix and heads): BESTIARY's 25, and
55 this lane's check (THE BESTIARY FLOOR F9, BESTIARY's rows only) had never fielded: FACTIONS' and BEASTS 2's 28 rows (the House,
the watch, the keepers, the water people, their heads, the living animals, BEASTS 2's lab beasts) and the 27 the wiki's rows field
(the road crew's eight, the beasts' four, the ghost, the machines' three, the kids' four, the heavies' four, the dogs' three).

THE RULES HALF (tools/bohemia_bestiary_every_type.js, the fight's own scripts in node; gate EVERY TYPE THROUGH A FIGHT):
| leg | what | result |
|---|---|---|
| E1 its look | fielded, its own picture (a man on the rig, the file on disk; a beast on its own sheet, never the dire wolf the drawing falls back to), named, armed | 80 of 80 |
| E2 its moves | its band's fights and alone against a crew of six on AUTO: it acts, every fight ends, nothing throws; a brain's own thing shows | 80 of 80; the 16 with a thing of their own all show it (the siren, the call, the riposte, the turn, the bond, the darts, the smoke and fire pots, the back door, the acid, the trample, the horn's scream, the martyr, the flings) |
| E3 its drops | a man's weapon reaches the end screen; ten fights' rolls through the end screen's own loot rules | 48 of 53 kinds of men can leave a piece; 5 never do (below) |
| E4 the count | every dealt kind checked | 80 of 80 |
| E5 its words | the fight names every party (the wipe card) | 28 of 37 before this round, 37 of 37 now |

THE PAGE HALF (gates/the_bestiary_every_type_fight.js, the real page on a phone): every kind's band through the one door every
encounter uses (the page's own dealer asked which of 120 encounters carries it), fielded and pictured, the held-finger card read,
the move watched on AUTO at his fastest speed (FIGHT, AUTO and speed tapped on the phone's own buttons), the win through the fight's
own showOver (the real word home with its spoils), the end screen's WHAT THEY LEFT read and LOOT ALL tapped, LEAVE tapped, home on
the map; a beast's kill on the map in its picture and one tap: meat into the food, a roll of hides into the bag.
| surface | kinds | home | page errors | his own move seen | drops |
|---|---|---|---|---|---|
| the demo, upright (390 x 844) | 80 of 80 | 80 | 0 | 11 of 11 BESTIARY movers (the siren on a second pass: the first lost four fights to the watch before he wound up) | 27 beasts: kill, picture, food 6, hides 1; men: LOOT ALL took 1 to 20 pieces; one first-day kids' band left nothing (below) |
| the demo, sideways (844 x 390) | 80 of 80 | 80 | 0 | not watched (the rules are the same) | the same; five kills' pictures read late (the sheet loads the first time the map draws it, within 0.3 s), all there on a second pass |
| the alpha, upright | 80 of 80 | 80 | 0 | not watched | the same; the first-day kids' band again left nothing |
| the alpha, sideways | 80 of 80 | 80 | 0 | not watched | the same |

## FOUND AND FIXED (this lane's)
1. NINE BEAST PARTIES HAD NO NAME IN THE FIGHT. The fight's THEY_ARE (the wipe card's first and last line) named 28 of the 37
   factions a band deals; the dire wolves, the cave hyenas, the short-faced bear, the ground sloth, the sabre-tooth, the American
   lions, the ancient bison, the Ice Age horses and the feral dogs fell back to the road crew. A crew wiped by a ground sloth read:
   'The road crew keep the field. ... Somebody drags you to the nearest town. The road crew have your men and your gear.' NOW each has
   its words (draft:true), and the card agrees with one beast: 'A ground sloth keeps the field. ... A ground sloth has your men and
   your gear.' (nine parties are one animal: the mountain lion, the bull, the cheetah, the jaguar, the long-horned bison and the
   mammoth, and now the bear, the sloth and the sabre-tooth; 'A bull keep the field' was already wrong before this round). Played on
   the page: a crew wiped by a ground sloth, before and after (records/target/BESTIARY_TWO_THE_BEAST_THAT_BEAT_YOU_11_26.jpg).
2. THE ROAD CREW GETS ITS FACES BACK (rule 482(c)): three sheets BESTIARY took from the road crew's pools for stand-ins on 11/17 and
   CHARACTER has since replaced (handoffs/BESTIARY.md, CHARACTER's notes of 11/20 and 11/21) were worn by nobody: person_mob_2 goes
   back to the raiders (6 sheets a band, was 5), person_volunteers_1 and _2 to the poachers (5, was 3). Measured on the live rules:
   30 seeded bands field all of them.
3. THE HORN, THE BRUISER AND THE BATTERY MAN HAD NO ACT WEIGHTS (ours.json act_weights.by_kind): every other kind of the kids, the
   heavies and the machines rises and falls with its faction by act (the kids 1.5, 1, 0.5; the heavies 0.5, 1, 1.5; the machines 1,
   1.5, 2), these three stood at the default 1, 1, 1, so THE BESTIARY (COMBAT's gate on the roster) was red on main since 11/14 and on
   no list. They now follow their faction (TUNING may move all of them); the roster file refreshed. THE BESTIARY 9/1 -> 10/0.
4. THIS LANE'S OWN CHECK PINNED EVERY FIGHT'S PAGE. gates/the_bestiary_floor_fight.js (F9) took a Playwright handle on #fightFrame
   every 250 ms; a handle pins its node, and a pinned iframe keeps its whole page after the game lets it go: the renderer reached
   7.9 GB after 18 fights and died (both the first sweeps crashed, 'Target crashed'). Now the fight on the glass is found by its
   address and its frameElement's id, and every handle is let go at once; the new sweep the same.

## NOT THIS LANE'S: ASK ROWS
- 742 FIGHT SCREEN 3: the five kinds of men whose only weapon never drops (the kids' bolas, the keepers' throwing axes, the
  slinger's sling): engine/bohemia_spoils.js reads a thrown bundle with no wear as wrecked and a sling with no count as spent.
- 743 COMBAT FOUR: a held finger on any beast says TEETH and 'it bites, and it bites again' (the bison's sweep, the goat's headbutt,
  the bull's gore, the sloth's uproot, the ghost's touch).
- 744 PLUMBER 8 (MOTION's file): the page grows about 340 MB a fight (the same fight ten times: 1.36 GB -> 5.5 GB, the JS heap,
  the documents and the canvases on the glass flat); counted by who made them, the morph's pictures (bohemia_motion.js picOf) keep
  about 20 megapixels a fight alive off the glass.
- 745 COMBAT FOUR with PLUMBER 8: the biggest pack's numbers (below).
- 746 CHARACTER TWO: five stand-ins left; the heavies' young in the road crew raiders' sheets; THE HAIR MATCH REGRESSION red on main
  and on no list.

## THE BIGGEST PACK ON A SLOWED PHONE (rule 480(c)(d))
The biggest band the dealer makes: a band is asked at most 13 (party_math.json) and the block watch's count_scale is 1.3, so 17
men; the biggest pack of animals is 13 coyotes. tools/bohemia_bestiary_biggest_pack_frames.js: the demo at 390 x 844, the map up, the
CPU slowed 4x, the band through the one door, FIGHT and AUTO tapped on the phone, AUTO for 45 to 60 s (his three men five times as hard
to drop), the win, the end screen, LOOT ALL, LEAVE, the map; every frame of the page counted, a mark at each step, a CPU profile.
| the fight on AUTO (frames a second, 15 s at a time) | this box's canvas (software) | 
|---|---|
| the block watch, 17 men (the siren went once) | 8.6, 10.9, 8.3, 7.4 |
| the same fight with 2 men | 5.7, 6.5, 5.7 |
| 13 coyotes | 5.5, 6.4, 10.2 |
| the casino's 5 (the spotter called 3 times) | 10.3, 8.4, 7.9 |
THE PACK'S SIZE IS NOT WHAT MAKES IT CHOPPY: seventeen men read no worse than two. No BESTIARY move's drawing (drawCalled, the fire,
the smoke, the siren) is in the top 40 of any profile; the time is the board's drawing (canvas save 5 to 10 s and drawImage 4 to 9 s
of 47 to 62 s, (program) 14 to 29 s) and checkVisibility (1.5 to 2.4 s). THE FREEZES: the fight's first frame 2.3 to 4.5 s, 1.2 to 1.6
s as AUTO starts, the end screen 1.5 to 2.3 s after LOOT ALL ((program), with the fight still drawing behind it). The GPU switch read
worse on this box (drawImage 20 s), as PLUMBER 8's frame walk found (a software GPU). NOTHING IN THIS LANE'S DRAWING TO CUT; row 745
carries the numbers to COMBAT FOUR and PLUMBER 8, beside rows 731 and 732.
THE MEMORY (row 744): the sweeps' renderer reached 7.9 GB on the first run (this lane's own handles, fixed); with the handles let go it
still grew about 300 MB a kind. The same road fight ten times: 1,355 -> 2,020 -> 2,729 -> 3,146 -> 3,514 -> 3,904 -> 4,225 -> 4,571
-> 4,865 -> 5,162 -> 5,504 MB, the JS heap 82 -> 118 MB and flat, documents 14 -> 18 and flat, the glass's canvases 33 -> 36. A
critical memory pressure gave back 0.5 GB of 2.2. Every canvas any page made, counted alive by who made it: the shell's (the demo's own
document) 24 -> 46 -> 64 -> 85 megapixels over four fights, all of it the morph's picOf (diveUp, diveUpPrep, turnIn, stopPic, the
clouds), held off the glass.

## GATES
- EVERY TYPE THROUGH A FIGHT (new, in the suite): E1 to E5 above; PLANTED: the coyote drawn as the dire wolf, the bowman's sheets off
  the rig, the siren's brain without its siren, the sloth's words gone: each red. 7/0 (5 legs and 2 plant lines), 255 s.
- THE BESTIARY FLOOR: 13/0 --plant --no-browser; F9's browser half (gates/the_bestiary_floor_fight.js) re-checked on the spotter (fielded in his own
  sheet, the call and the call landing seen, home) after its handles were let go. THE BESTIARY 10/0 (was 9/1 on main).
- Also run for this diff: EVERY FACE BREATHES 15/0, MORE RARE HIRES 14/0, ONE MAN ONE LOOK 8/0, THE FACE IS HIS OWN FACE 18/0, THE FACE
  SHOWS THE WOUND 32/0, THE NEW ENEMIES 12/0, THE RETINUE 29/0, THE PACKERS MERGE 4/0, EACH ORIGIN ITS OWN 19/0, THE LOSS IS UNDERSTOOD
  15/0, THE FOURTEEN EYES FOUND F530 5/0; THE HAIR MATCH REGRESSION 12/1 the same red on main before this change (row 746). Full suite:
  PLUMBER's line on the front page.

[bb Battle Brothers keeps every enemy on one rule: you read what it will do from the first look, and when it beats you the screen says who did]
[analog horror: the crew is down in the dark and the card says it plainly: a ground sloth keeps the field]
