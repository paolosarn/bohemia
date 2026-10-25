# COMBAT 10/25: THE PC PLAYTEST, THE FIGHT'S PART (rule 164, items 12 to 17 and 26)

Paolo 10/24 evening, on his PC: "I'm playing this on my PC and I'm so fucking impressed, we've come such a long way, but I
have a lot of feedback." The fight's items, in the coordinator's order: (1) the AUTO colour before the first tap; (2) who is
on his team; (3) house heights that mean something; (4) switch weapons from two bag slots; (5) the fight's UI better than
Battle Brothers', mobile first. Gate: THE PC PLAYTEST: THE FIGHT (gates/the_pc_playtest_the_fight_gate.js). Tab: COMBAT.

## 1. THE AUTO COLOUR BEFORE ANYTHING (item 12)
His words: "before I can even press anything... I should know the colour of the Auto button."

MEASURED FIRST: every fight the demo's door opens starts on the formation (deploy), and the odds read never ran there: 40
looks over 11 s on a six-against-six suburb fight, 0 runs, no colour. The read waited out the formation, the open's 4.5
beats and his first turn (and never ran at all when their side moved first), then played its 24 runs 6 ms a frame.

BUILT: the same copy of the rules (the fight-data and fight-rules scripts, unchanged) plays its runs in a Web Worker, off the
frames. The read is posted the moment the fight is dealt, before the board bakes; on the formation it reads the line as it
stands (the key is where his men stand: a man moved is a new read); the open waits for the first full read (12 runs), never
more than ODDS_WAIT_MS 1.5 s, so the colour is on the tin the frame the board comes up. The glow (a clean win nearly
certain) shows on the formation too, and a tap on it plays the fight out at the top pace from the line he set. When their
side moves first the read still runs (no read yet). No worker on the phone (or FIGHT_OPTS.oddsWorker false): the frames'
6 ms slices, now also on the formation and the open, the tin repainted the frame the read lands. The real die is never
touched (the worker has its own).

NUMBERS: six against six on this box, the read posted 780 to 930 ms before the board came up and full 69 ms before it;
12 runs 450 ms on the main thread (the worker spends the same off it). One against five reads red at the first frame
(alpha 0.62), three against one glows green at the first frame.

## 2. WHO IS ON MY TEAM (item 17)
His words: "it's hard to tell who's on my team." His 10/2 words (rule 67): "health and armour bars above the people is cool."

MEASURED FIRST: bars were drawn only over the man acting or the man picked (67(a), Battle Brothers' habit from the research,
not his words), so on the board nothing told his men from theirs but where they stood; the turn strip's faces carried a
frame 4% of the face wide (1.4 points), unreadable.

BUILT: every man on the field wears his bars over his head (armour, then health), as wide as the man, three points tall, on a
rim: GOLD (#d9a85a) for his with green health, RUST (#b8452f) for theirs with red; the man acting and the man picked a rim
brighter. Nothing on the ground (rule 46f: no ovals, no discs, no outline, his 10/17 NO on the coloured outline). The faces
in the turn strip and the bar's big face wear a band across the foot and a frame (7%) in the same gold or rust, so the
strip reads mine-theirs-mine at a glance. Read off the drawn pixels on a phone and a computer: 6/6 his, 6/6 theirs, the
strip 9/9. THE REBUILT FIGHT PLAYS' bars leg re-aimed (bars over every man on the field).

## 3. HEIGHTS THAT MEAN SOMETHING YOU CAN SEE (item 14)
His words: "one-story versus two-story or even a three-story building, I don't know how that helps me and it's hard to tell
visually."

MEASURED FIRST: on every board a house was a wall (no path, no sight) except about one a block, a roof you could stand on, and
that roof was drawn exactly like the walls beside it; every roof was the same one level whatever its storeys (the fight read
Battle Brothers' height_levels [0, 1, 2, 3] and used only 0 and 1), and a shot from below lost nothing. Tapping a wall said
'Too far for the AP left.' Some 'high' tiles (the scrub, wash and shore mounds, the freeway block, the casino floor) have no
rise drawn at all: COOK TWO's to draw, noted below.

THE STOREYS, measured on COMBAT TWO's block art (a face is its height x cos45 at 42.9 px a metre): ranch houses and the motel
3 m (one storey), the strip store 6.2 m, the school 5.8 m, the ruin's flat-roof blocks 5.5 m (two), the works' warehouse 11 m
(three). ours.roof_storeys holds the table (seven blocks, their roof tiles over one storey), the roof kinds (which blocks'
high ground is a building), works.0's 1,4 as bare ground, and how far up a tile a man on each level stands.

BUILT, Battle Brothers' rules from the library, unchanged numbers: a roof deals at its storeys ('height2', 'height3' in the
ground table's hills row); level() reads them (1 to 3). So from higher up: +10% to hit anyone lower (Combat Mechanics); a shot
or a blow from below loses 10% a level (the Hit Chance page: '-10% per level difference'; it was melee only, flat), so a man
three storeys up is 30% harder to hit from the street; guns reach one tile further a level and he sees one tile further a
level (already per level, now 2 and 3 exist); no club reaches across two levels or more, and two levels break the zone of
control (both already in the rules, now they happen); climbing costs one AP a level.

SHOWN: a ladder leans on the face of every building you can climb, one a roof, wood rails and a rung about a metre, as long as
the face is tall (12 px for a house, 43 px for the warehouse at the phone's open); none on a wall, none on bare ground. A man on
a roof stands on its plane (0.2, 0.45, 0.8 of a tile up) with one up-chevron a level beside his bars in his side's colour. A tap
on a roof says 'Roof, 3 storeys up: +10% to hit anyone lower, guns reach 3 tiles farther, sees 3 tiles farther, no club reaches
him from the street.'; the walk's tag says ROOF 3 UP; the aim says 'From 3 up: +10%, reach +3.' and 'He is 3 up: -30%.'; a tap
on a wall says 'A wall. No way up: climb a roof with a ladder.' His man taking a roof two up or more: 'TINA is 3 storeys up.'

NOT DONE / FOR COOK TWO: the rise tiles with no art (the scrub, scrubroad, wash and shore blocks' one tile, the freeway
overpass block's road, the casino floor's two, works.0's 1,4, the landfill heaps drawn a row lower than their tiles) need the
rise drawn; until then they read as flat ground and the tap names them 'High ground, 1 up'.

## 4. SWITCH WEAPONS FROM THE BAG (item 15)
His words: "you can't switch weapon... Battle Brothers has two slots to bring shit into combat... it takes up stamina."

MEASURED FIRST: a man held one weapon all fight (the throwing enemies' sidearm aside); the hand-over had no bag; the library's
rules for it were not in our data. Battle Brothers, from the library: two bag slots (Bags and Belts: two more); swapping an
item in battle costs 4 AP (the patch notes, bb_all/1415: 'every additional swap has the normal cost of 4AP'); Quick Hands makes
the first swap a turn free; an item in the bag weighs half its fatigue on the man's maximum (rules
fatigue.bag_items_penalty_multiplier 0.5; Bags and Belts: none, except a two-hander). A swap costs no fatigue in Battle
Brothers: what 'takes up stamina' is the bag's weight. Both rows added: rules ap.swap_item 4, ap.bag_slots 2.

BUILT: the crew screen's two slots ride in as gear.bag (item ids, RUN TWO's hand-over, row [the PC playtest: the town's part]);
a handed bag wins, an empty one is empty; with none handed a man carries ours.bag's kit (draft, tuned false): a pistol man the
pipe, everybody else a pistol (guns lead, rule 120). FIGHT.swap: the 4 AP (or Quick Hands' free one), his hands' weapon into
the bag with its rounds kept, the bag's into his hands with its own; his job, his club at one and his strike square follow;
a two-hander puts the car door on his back, a one-hander brings it back. The bag weighs on his wind (FIGHT.bagFat). On the
bar: a square for each bag item, its weapon's glyph under a strap with swap arrows, the swap's AP on it (FREE with Quick
Hands), 46 points; a tap: 'TINA swaps the rifle for the pistol from the bag. 4 AP.'; too few: 'Not enough AP: a swap costs 4,
TINA has 1.' The gun in his hands on the board is the new one (the rig's gun sheet follows the weapon). On AUTO, an empty gun
he cannot reload this turn (out of breath; a swap costs none) is swapped for a loaded one in the bag.

## 5. THE FIGHT'S UI BETTER THAN BATTLE BROTHERS', MOBILE FIRST (item 16, and item 1's keys in the fight)
His words: "if Battle Brothers went to mobile... this is one thing that holds them back."

MEASURED FIRST: the fight had no keyboard at all, and on a computer every walk and every blow took two clicks (the phone's
one tap to see, one to do), where Battle Brothers shows on hover and does on one click; the lines said 'Tap' on a PC.

BUILT: HOVER TO SEE, CLICK TO DO on a computer (a fine pointer): the mouse over a tile is the first tap (the walk, its AP, its
tag, what standing there does), over a man in reach the aim (the chance, what one blow takes); one click does it; nothing is
spent, rolled or taught by a hover. The phone keeps one tap to see, one to do. BATTLE BROTHERS' FIGHT KEYS, key for key from
the library's Tactical Map Keyboard Shortcuts: W A S D and the arrows pan; Space or End waits; Enter or F ends the turn (on the
formation, starts the fight); R ends the round (twice, as there is no dialog); 1 to 9 the squares of the skill row; Alt shows
or hides the bars; Shift centres on the man acting; Page Up and Page Down zoom; C or I opens his card; Esc lets go of a pick.
The shell may hand keys on with BOHEMIA_FIGHT_KEY while its own window has the focus. On a computer the lines say click and
the first fight's lessons say point to see, click to do. The rest of the look is UI's row ([the PC playtest: the UI's part]).

## AFTER THE FIRST PUSHES (same round)
- IN THE DEMO'S OWN DOOR the colour was NOT on the tin at the reveal: 3 runs done, 6 by 2.5 s later, though one run of that
  fight is 23 to 54 ms of work. The cause: the demo keeps the fight frame hidden behind the clouds while it loads, and a
  hidden frame's timers are held to about one a second; the worker paused between runs on a timer. It now asks for its next
  run through a MessageChannel (never held); measured through nfOpen: at the reveal 21 runs done, the tin red (0.318). The
  refining runs after the first twelve still rest on a timer (a third of a core), so a phone with few cores keeps its frames.
- THE BOARD IS HANDED OVER ONLY ONCE THE COLOUR IS READ (bakeBoard waits on the read, capped at 1.5 s), and a fight started
  again (AGAIN, the shell's restart with its own options) is dealt behind the loading screen like the first, so the glass
  never answers a tap on a fight it has not shown (a test that tapped FIGHT in that gap re-opened the formation over it).
- RUN TWO's slots carry weapons AND shields (its NOTE, 893b766c): a car door in the bag straps on for 4 AP (Quick Hands is
  never free for a shield), never beside a two-hander ('The sledge takes both hands: no car door with it.'); the arm's old
  shield goes back into the slot.
- THE END MESSAGE SAYS WHAT EACH HAND HOLDS: spoils.looks[i].held {main, off, bag} (item ids; a car door on his back counts
  as the off hand); a kit bag (the stand-in when nothing was handed) is reported as none, never his.
- PART (6), THE ROSTER SCALES THE ENEMY: WORLD fce1fc7a (the map's party math counts every man he has); the fight fights the
  party it is handed. PART (7), the glitches and the organic board: open.
- [what each hand holds shows]: OPEN. No Blender on this box and no shield model in the bank (only stop_sign.glb): NOTE on
  COOK's board (the car door, the crash-bar shield, the sign as models) and on ANIMATION's (the shield arm through the rig on
  its one-hand clips, its own offer). The fight already says which: u.shield, u.shieldBack, and the end message's held.off.
- THE DEMO DOOR, ROBUST: on this four-core box with the demo shell drawing the map beside it, a read could be 10 runs at
  the reveal. A fight's FIRST read now puts the colour on at 8 runs (the tin is bare, so nothing flickers; ODDS_FIRST) and
  refines to 24; later reads still move the colour only at 12; the reveal may wait up to 3 s (ODDS_WAIT_MS).
- THE BRAIN'S HEIGHT STAYS FLAT: AUTO scored a roof by its level (10 a level, double for a shooter), so a three-storey roof
  was worth 60 and pulled shooters past their own front (THE REBUILT FIGHT PLAYS: backline 19% against 7%, men alone 23%
  against 20%). The library's bonus for higher ground is flat (+10 however many levels), so heightGain is too; the extra
  reach a level shows by itself in who he can hit.
- THE STAND-OFF UNDER A TALL ROOF: the flat score was not the whole story. Replicated THE REBUILT FIGHT PLAYS' AUTO battery
  offline (the same ten kinds, seeds 31 to 40): the overrun was one fight, the culdesac board (91 of 102 shooter turns past
  the front), stuck to round 41: NENA, one throw left, on a two-storey roof; the last thug beside her in the street, unable
  to swing across two levels (the library's rule), waiting there for ever, because the brain's hunting map counted the street
  beside her as 'next to her'. huntField now lets a club count a tile as beside a foe only where it can swing from it (one
  level of height at most); he hunts the men he can hit. Measured offline: backline 102/559 (18%) -> 11/429 (3%), alone
  55/242 (23%) -> 27/180 (15%), every fight ends (culdesac 10 rounds). Switching parts off showed the bag and the storeys each
  move these few-fight numbers a lot on their own (chaotic dice, not a rule): without the bag 7% and 15%.
- [eyes: tap again, nothing] (EYES 10/25 round 2, new 15): RETREAT armed for 8 beats while its line 'Tap again.' stayed up, so
  the tap it asked for after reading only armed it again (63 s with nobody moving). askUp(): an arm lives as long as its ask
  is on the glass (the line leaves when the turn passes or another takes its place); the R key's ask the same.
