# WEAPONS: EVERY WEAPON SHOWS, AND SIX MORE ONE-HANDERS (rule 424, ask lines 489 and 490; 11/7/26)

His words, 11/7: "some two handed weapons aren't showing up... we need more one-handed weapons, I feel like there's not enough
one-handed weapons." (He first said one-handers and shields were missing in the hands, then took it back.) Rule 424: (a) every
weapon shows in the hand on the map's crew, in the fight and on the crew screen, every one of the weapons list, held by a gate
over the whole list; (b) more one-handed weapons, real ones a man finds in a dead Bohemia, the count first, then the new ones
through the golden-piece recipe (rule 408(b)). A new lane, WEAPONS, COOK's family.

## THE ANSWER, FIRST

- THE TWO-HANDERS HE SAW EMPTY: TWELVE ROWS, ONE ROOT CAUSE, FIXED. The fight finds a melee weapon's picture by its row, else by
  its class (slices/rig_melee/rig_melee.json). For a two-handed row the class table (two_by_class) named only hammer, axe, mace,
  polearm and spear. No two-handed blade, chain or cleaver picture existed anywhere, so these swung from empty fists:
  the five two-handed swords (rhomphaia, warbrand, longsword, greatsword, executioner's sword), the three two-handed flails
  (two-handed wooden flail, two-handed flail, berserk chain) and the four two-handed cleavers (two-handed saif, rusty warblade,
  crypt cleaver, two-handed scimitar). Every smith's shelf rolls from the whole list by price, so they were sold to him.
  NOW each of the three classes has its own two-handed model: the GIFT-SHOP CLAYMORE (sword), the TOW CHAIN (flail), the DITCH
  BLADE (cleaver). In the fight's own frames, before and after: records/target/weapons_every_weapon_shows/proof/.
- THE CREW SCREEN DREW A GUN OR NOTHING. Its own block said so ("what the fight does not draw yet this does not draw either"),
  and the fight has drawn melee weapons and shields since 10/25. Every pipe, sledge, blade, bow and car door: an empty-handed man
  on his card. NOW the card draws what the fight draws, from the fight's own sheets.
- THE MAP: NOT DONE, MEASURED. The map's men walk from their own walk sheets and hold nothing, for any row. It needs its own
  render (below); it is the next round, first.
- MORE ONE-HANDERS: SIX, each its own model, each a real thing. 84 one-handed rows and 23 real one-handed objects in a fist before;
  90 and 29 now (rule 424(c): the sledge swung in one fist no longer counts, it was a two-hander's picture).
- A LATENT BUG FOUND AND FIXED ON THE WAY: rerunning the armory tool (the file a modder runs) silently put all fifteen of COOK's
  own models back on their family pictures (the crowbar drawn as the pipe again), took their rows off COOK's own entries in the
  models manifest, and undid TUNING's prices. A rerun now only adds.

## THE COUNT (rule 424(b): the count first)

| | before | now |
|---|---|---|
| weapon rows | 145 | 151 |
| one-handed rows | 84 (77 not guns) | 90 (83 not guns) |
| two-handed rows | 61 | 61 |
| real one-handed objects in a fist (rule 424(c): real objects only, the guns each its own) | 23 | 29 |
| two-handed rows with no picture | 12 | 0 |
| one picture held one-handed by some rows and two-handed by others (424(c)'s cheap route) | 2 (the pipe, the sledge) | 0 |
| rows of the valley's own (armory) | 19 | 25 |

Before: 24 one-handed pictures in a fist, and one of them, the SLEDGE, was a two-hander's picture swung in one fist (the
one-handed picks and war hammer), so 23 real objects: the pipe, the club, the bat, the machete, the hatchet, the cleaver, the
chain, the rebar spear, the bottles (the Battle Brothers families' stand-ins), the armory's thirteen melee pieces, and the
pistol, the snub revolver and the zip gun. Now 29: the sledge gone from one hand (below), the six new ones in. In a shop the
player tells weapons apart by name: a Battle Brothers row wears its class word (BLADE, PIPE, AXE...).

## NO CHEAP ROUTE (rule 424(c), ask line 515, added by the coordinator mid-round: 'you have like a one-handed variation, a
## two-handed variation, and I think that's a pretty cheap escape route')

MEASURED over the index: two pictures were held one-handed by some rows and two-handed by others, one object at two sizes:
- THE PIPE: every one-handed mace, and the five two-handed maces (two-handed spiked mace, two-handed mace, flanged mace,
  polemace, goedendag) swung in both fists.
- THE SLEDGE: every two-handed hammer, and the pickaxe, the military pick and the war hammer swung in ONE fist.
FOLDED, each to the real thing it is (tools/bohemia_weapons_every_weapon_shows_11_7_26.py fold; no new picture needed): the pipe
is one-handed only; the sledgehammer two-handed only, and a two-handed mace is the sledgehammer (in a dead city the two-handed
blunt weapon is the sledge); a one-handed hammer or pick is the framing hammer, a real one-handed hammer. The pairs that stay are
real pairs of objects, each drawn as itself: the hatchet and the fire axe, the framing hammer and the sledge, the chain and the
tow chain, the machete and the gift-shop claymore, the cleaver and the ditch blade, the rebar spear and the pole hook. The
gate's D5 holds it (no picture held both ways), D6 plants a two-handed mace back on the pipe and catches it.

## THE SIX NEW ONE-HANDERS (armory round 3, records/target/bb/armory.json)

Each sits BETWEEN two Battle Brothers rows of its own family (ARMORY's rule: the mean of A and B, fought with A's skills), and is
carried by the enemies whose wiki gear holds its row A (every second such man), so it drops as loot by tier.

| weapon | family | between | damage | vs armour | price | who carries it | the real thing |
|---|---|---|---|---|---|---|---|
| tire iron | mace | bludgeon, nomad mace | 25-35 | 85% | 10 | thugs, caravan hands, militia | a car kit's L-shaped lug wrench, 17 in, the 19 mm socket |
| golf club | mace | wooden stick, bludgeon | 20-30 | 65% | 6 | peasants, citizens, the indebted | a seven iron, 37 in, a 3 in head; the valley has the golf course on the map |
| Bowie knife | sword | short sword, saif | 35-40 | 70% | 35 | raiders, caravan guards, militia veterans | a 10 in clip-point blade, 15 in overall, off a sporting-goods wall |
| pipe wrench | hammer | military pick, warhammer | 25-40 | 215% | 160 | raiders, footmen | an 18 in iron pipe wrench, 2.4 kg, off a plumber's truck |
| tomahawk | axe | hatchet, hand axe | 30-45 | 115% | 56 | thugs, militia | a 19 in sporting-goods tomahawk, a 3.5 in bearded edge |
| slot machine handle | mace | claw club, cudgel | 25-40 | 85% | 20 | nobody yet (a find) | the pull arm off a slot machine, about 14 in, a 2 in red ball |

Their lines (draft:true, WORDS may better them): "The L-bar out of a dead car's trunk. One hand. Lug nuts and kneecaps." /
"A seven iron off a golf course nobody waters. Long, light, and it rings a helmet." / "Ten inches of clip-point steel off a
sporting-goods wall. Fast, and it comes back at them." / "Eighteen inches of red iron off a plumber's truck. Plate folds under
it." / "A sporting-goods tomahawk, the price tag still on the haft. It splits a car door." / "The arm off a one-armed bandit,
the red ball still on it. Pull it on a man."

## THE RECIPE (408(b), DIRECTION's common recipe, step by step; and why the card is a STAND-IN)

1. ONE AT A TIME: the weapon kind's golden piece is COOK's pistol, still a STAND-IN (rule 421(c), handoffs/COOK.md). F4 and F5
   of DIRECTION's gate leg forbid a second golden weapon waiting and any MADE FROM before his pass. So these nine are made by the
   recipe that already ships weapons (COOK's every-weapon recipe: one glb at real size through the kit, ANIMATION's render in
   YOU's hands, every man borrowing YOU's pictures), and the VOTE card is marked STAND-IN: it shows that they SHOW, it asks
   nothing about the look. When the pistol passes, these are remade from its frozen recipe.
2. THE BAR BESIDE IT: the thug (body_thug_S, the bar sheet's man) is the twin; YOU is the ruler in every proof frame.
3. THE REAL THING FIRST: the sizes in the table above, built at real size (the Bowie knife drawn 1.15 over so its blade is more
   than a hairline at 57 px a metre, the box cutter's way).
4. ONE SOURCE: each a glb (reference/models/bohemia/item_<name>.glb), COOK's every-item kit, five palette materials at most
   (the claymore and the ditch blade were six on the first build and were cut to five), the odd thing on each (the lug nut
   stuck in the socket, dead grass in the club's grooves, the orange lanyard, the thread tape, the price tag, the masking tape,
   the gift shop's hang tag, the rusted links, the tool room's yellow band).
5. THE LOOP: one look pass side-on before any render (records/target/cook_every_weapon/alone_<name>/side.png): all nine read as
   what they are; nothing re-cut.
6. THE MACHINE CHECKS: THE THING IN HIS HAND 24/0 (quick legs), EVERY WEAPON SHOWS (below), every item has a model, purity.
7. ON ITS REAL SURFACE: the shipped fight at 390 x 844 at 3x, eight facings and the blow (the proof).
8 and 9 are DIRECTION's eye and his vote: owed (STAND-IN).

## IN HIS HANDS (COOK's pipeline, imported, tools/bohemia_weapons_every_weapon_shows_11_7_26.py)

- YOU rebuilt in this container in 35 s (COMBAT `bodies you`, the melee tool's `pose`, the Stand frame), bpy 4.2 in a python3.11
  venv. 15 renders (six one-handers on m6 and s6, three two-handers on t5) in about 12 minutes on four workers.
- Packed: you_props_m6.webp (2048 x 235, 1,053 cells), you_props_s6.webp (2048 x 175, 799), you_props_t5.webp (2048 x 431, 542);
  all under rule 173's 2048 x 1024. The index: by_row for the six, two_by_class sword/flail/cleaver for the families.
- The shop shelf wears each new piece's own render (slices/market_icons/own_<row>.png); the bag's 22-cell icon is cut by hand
  in the armory's style (slices/bohemia_ui_materials.js; COOK found the model cut read worse at 22 cells).

## THE GATE: EVERY WEAPON SHOWS (gates/every_weapon_shows_gate.js, in the suite)

- D the data: every row and every shield names a picture by the fight's own lookups, and YOU's sheets hold it on the standing
  key of its hold. ON MAIN BEFORE THIS ROUND: RED, the twelve by name. NOW green.
- F the demo's own road fight (the game's one door): two of his men of two looks; every row and every shield (on a pipe) handed
  to each; the fight's own draw (blitMan) watched call by call on its canvas; the row's thing must be DRAWN (a cell of that prop
  off a props sheet, or a gun's sheet) in at least 3 of 8 facings.
- C the demo's own crew screen (opened from the map the way the bar opens it): the card's own functions, every row and every
  shield, 3 of 8 turns; and on the glass a man handed the golf club stands with it painted in his fists.
- PLANTED FAILS: the sword's two-handed picture taken out (the five swords go red in D, F and C); the tire iron's row and its
  class's fallback taken out (the tire iron goes red).
- M the map: counted, not judged (0 men with a weapon in hand); the leg lands with the map's render.

## THE PISTOL, 'TOO TINY' (rule 426(c), ask line 494; his vote on COOK's pistol card; BUILD 11/7o)

The coordinator's reading: a weapon in the hand reads at its real size against the man (a pistol is about a forearm's length from
the grip to the muzzle's end). MEASURED on the shipped sheets, every thing on its standing key, the longest of its eight facings,
against its model's real length on the rig's ruler (98 px to 1.72 m, 57 px a metre):
- every melee thing, shield, bow and long gun was already drawn at 82 to 141 per cent of real (the hanging cords and whips 68 to
  89: a cord hangs, it is never held straight; the shields over 1.3: a car door is a big thing);
- THE THREE HANDGUNS WERE NOT: the fist hides the grip. The pistol (the 1911, 0.216 m, 12.4 px real) showed at most 10.4 px in his
  low ready; a forearm is 14.3 px (0.146 of a man's height). The snub revolver showed 4.3 of its real 7.9, the zip gun 11.0.
FIXED: the three are built 1.35 over real about the grip (the origin, where his hand holds them), by their own builders (COOK's
golden pistol tool and six guns tool, imported, nothing of theirs edited: tools/bohemia_weapons_every_weapon_shows_11_7_26.py
grow-model, grow-render, grow-pack), and re-rendered in YOU's hands in all four of a gun's picture systems (the fight's grid, the
held clips, the idles, the shield arm), the golden pistol's own low ready kept. NOW the pistol shows 15.5 px in the low ready (17 in
the carry), the snub 8.3, the zip gun 18; the four long guns and every other gun's cells untouched (the merge checked: by_row, the
models, the shift tables the same). The manifest (reference/models/bohemia/items.json) carries the new hashes and why.
records/target/weapons_every_weapon_shows/the_pistol_a_forearm_long.webp: BEFORE and NOW on YOU in the eight facings.
THE GATE HOLDS IT (EVERY WEAPON SHOWS, R legs): in the demo's own fight, every row's thing as drawn is at least 0.85 of its real
length (a hanging thing 0.6), and every PISTOL row at least a forearm; planted: the pistol put back to the old class pistol (its
true size, what main drew) goes red, the pipe beside it does not.
Not a golden PASS: the pistol stays COOK's STAND-IN golden piece; its size is now his rule's, its look still waits on DIRECTION.

## THE MAP, THE NEXT ROUND (measured, not built)

The map draws his crew from their own walk sheets (slices/rig_mix and RIG_CAST, 68 x 130 frames: still, breathe, six walk keys,
eight turns) and the idles' map set; no weapon is in any of them. Laying the fight's pictures on them does not work: the fight's
things are rendered on the fight's held poses (the low ready, the carry), the map's men swing their arms on a walk. The way that
works is rig_march's (ANIMATION's, the healing and mending on the march): each family's thing rendered in YOU's fist on the map
walk's six keys and the map idle, through the towns tool's pose, then laid on every crew man moved by his feet. That is the
next round, first. Battle Brothers' own world map shows a figure, not his kit; his rule asks for more than Battle Brothers did.

## CHECKS RUN

Run one at a time on the rebased tree (main at 8106d196), never the whole suite (rule 13: pre-push pass; full suite unmeasured
since 8106d196):
- EVERY WEAPON SHOWS (new) 15/0 (after the pistol): D 6/0 (with 424(c)), R 3/0 (the size legs: every weapon at its real size standing, the pistol a forearm, planted), and before it 10/0: D 4/0, the demo's road fight F 2/0 (170 rows and shields, two looks, every one drawn in 3 of 8 facings or more; the planted sword reds exactly the five), the demo's crew screen C 3/0, no page error.
- THE THING IN HIS HAND --quick 24/0 (S, P, H legs: YOU's new layers on every key, touching his fist, swung; the planted faults bite).
- every item has a model 322/0.
- THE CREW FIGURE HOLDS HIS GUN (amended for rule 424: a melee man holds his thing now): H1, H2 and the planted leg green on the
  phone and the computer; F1 (the computer: the crew screen's fatigue against the fight's) RED, and red on main for the same reason
  this gate's own fight leg was first: the demo's crew starts on its town's ground, and A TOWN IS ALWAYS A DOOR (rule 381) holds a
  road crew off it, so roadContactFight returns false and no fight opens. Routed (below); not this lane's code.
- THE MARKET IN THE PACK'S ART 7/1: the one red is COOK's w_pistol card (the golden pistol's), not touched here.
- REFERENCE CHECK 514/2 and REUSE-FIRST: the reds are older tools already red on main; both new tools carry the blocks.
- Proof (the shipped fight, both modes, nine weapons): AFTER each weapon's own prop drawn 402 to 424 times a run, BEFORE 0 for the
  three families (empty hands) and the family picture for the six; 0 page errors in 18 runs (records/target/weapons_every_weapon_shows/proof_log.txt).

## ROUTED

- ANIMATION: the map's held thing (the next round is WEAPONS', but the pose is ANIMATION's towns tool; one line if it should be
  theirs).
- WORDS: the six lines are draft:true.
- RUN SEVEN / CAMP (rule 381, A TOWN IS ALWAYS A DOOR): every gate that opens a road fight from the demo's first screen with
  roadContactFight (THE THING IN HIS HAND's W3, THE CREW FIGURE HOLDS HIS GUN's F1, GEAR THROUGH THE SAVE) now gets false, because
  the crew starts on its town's ground; a helper in the one driver that starts a road fight off the town would put them all back.
- TUNING: the six prices are the mean of their two rows (the armory's rule); the pipe wrench at 160 sits with the warhammer's
  band because its blow is that band's; TUNING moves it if a plumber's wrench should cost less.

[bb Battle Brothers draws every weapon its own sprite in the man's hand on every screen; ours now does in the fight and on the
crew card, and the map is next.]
[analog horror: a golf club off a course nobody waters, dead grass still in the grooves; a gift-shop sword off a castle that is not one.]
