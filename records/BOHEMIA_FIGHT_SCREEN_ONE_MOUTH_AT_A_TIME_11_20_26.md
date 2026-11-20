# FIGHT SCREEN THREE: ONE MOUTH AT A TIME (the walk, first second to end screen) -- 11/20/26
BUILD 11/20e - ONE MOUTH AT A TIME. Rules 461 (the whole enchilada: 'walk the whole fight on a phone upright and on its side, first second to
end screen, and fix every ugly or unclear thing you find, the screen as a whole before any one card'), 449(b), 450(a), 441, 454(a).
Ask rows 616 (the screen reworked whole) and 621 (the cards). THIS CHAT IS FIGHT SCREEN THREE (FIGHT SCREEN TWO stopped at its weekly limit;
it left no pushed branch).

## THE WALK (tools/bohemia_fight_screen_the_walk.js, new)
The real page (the demo and the alpha), a phone upright (390 x 844) and on its side (844 x 390), started the way he starts it (title, NEW GAME,
BEGIN, GO), a crew met through the map's own card, ENGAGE with a finger, then: stills at 0.3, 1, 2, 3.5 and 5 seconds; FIGHT pressed; his first
turn; a finger on a lit square twice (a step); AUTO at 2x with a still every 2.5 seconds to the end; the end screen; LEAVE; the map again. At
every still the glass is READ: every card of the fight's glass that is up, its box, off the glass or not, words cut or not, and every pair of
them lying on each other; the phone's card (his or theirs, and whose name).
  node tools/bohemia_fight_screen_the_walk.js <alpha|demo> <upright|sideways> <outdir> [road|beasts]   (BEFORE=1: this lane's files as HEAD has them)

## WHAT THE WALK FOUND ON MAIN 64ab8c77 (four surfaces: demo upright road, demo sideways road, alpha upright beasts, alpha sideways road)
1. TWO PEOPLE TALKING AT ONCE, ONE CARD ON THE OTHER (3 of 4 walks; on his first turn): the veteran's lesson (pale receipt paper) and a crew's
   shout (dark glass) were both up at the top left, the shout over the lesson, and the lesson's words showed past the shout's edge ('...gain. He',
   'walk'). THE CAUSE: the shout waited for the lesson (tickCall), the lesson never waited for the shout (teach()).
2. A TILE'S LINE STOOD THE WHOLE FIGHT (4 of 4): 'High ground, 1 up: +10% to hit for each storey down, guns reach 1 tile farther...' (four
   lines of receipt over the middle of the board), 'Orange stripes: their reach. Rough ground: slow.', 'Roof, 2 storeys up...', said at his first
   step, stood through every round of AUTO (6 and 7 rounds) and under the end screen. 'They are breaking. SPARE THEM, or RUN THEM DOWN.' stood
   under the end screen on the alpha. 'N AP left, a step costs 3. Turn over.' stood three rounds of AUTO, its OUT OF ACTION POINTS plate with it.
   THE CAUSE: an aim's line carried its turn (UI.sayTurn) and the director took it down when the turn passed; a tile's line (walkPreview, the far
   walk) and the spent line were said with no turn, so nothing ever took them down; the spent plate was cleared only on a turn he controls.
3. THEIR MAN ON HIS CARD BEFORE THE FIGHT (4 of 4): in the lineup the turn's first man is one of theirs, and the phone's card wore him: 'RAIDER
   LV 6' (a WOLF on the beasts walks) over FIGHT, his STRIKE square and 'No skills on this man yet. A level brings a perk.', as if he were one
   of his to set. THE CAUSE: the card shows FIGHT.current(), and before FIGHT nobody's turn has begun.
4. TWO MATERIALS FOR ONE THING (the handoff's item 1): the lesson was pale receipt paper beside the why line and the shout on dark glass.
5. THE GROUND SAID TWICE on the card that opens a fight: 'THE GROUND: THE FREEWAY · FREEWAY'.
6. SEEN AND LEFT, NOT THIS LANE'S (routed below): the gun's weak rings are marked '-7' and '-12' on the board with no unit (WEAPONS'
   range card, rule 187(c)); the end screen's receipt (RUN FIVE's, rule 404 'at final') shows only its last line, a dashed rule, from behind
   the end screen's header; THE FIRST FIGHT TEACHES 7/3, THE FIGHT BY HAND, QUICKER 18/2 and THE LOSS IS UNDERSTOOD 14/1 are red on main
   without this build (each run once with this lane's files as HEAD has them: the same reds).

## WHAT CHANGED (slices/BOHEMIA_FIGHT.html, slices/bohemia_fight_opener.js)
- __ONE_MOUTH_AT_A_TIME__ (teach()): one person talks at a time; a lesson is about this moment and takes the floor, the shout is cut and its
  voice with it. The shout already waited for the lesson and the why line.
- __THE_STRIP_KEEPS_ITS_TURN__ (sayForTurn): a tile's line, the far walk's line and the spent line belong to the turn they were said in, as an
  aim does; the director takes them down when the turn passes; AUTO pressed takes a tile's line down; the fight's end clears the strip (the
  recap's handing to the end screen); OUT OF ACTION POINTS goes when the turn is no longer his.
- __HIS_MAN_IN_THE_LINEUP__ (hud()): in the lineup the phone's card is the man he is placing (UI.dsel), else his own lead (YOU first); the strike
  square's picture and RELOAD follow the man shown. From FIGHT on nothing changed: their turn shows their man in red, his his in gold.
- __ONE_BOARD_FOR_EVERY_MOUTH__ (css; mouthLook()): A MOUTH IS BOARD, A PRINT IS PAPER. Whoever talks on the glass (the why line, the crew's
  shout, the veteran's lesson) talks from the house's dark board, the man's sheet's and the opening card's own (UI's kit 'board' at 0.6 under
  html[data-kit], #2a2016 without it): his face a photograph in a paper frame pinned on it (the sheet's frame), a strip down its edge gold for
  his men and red for theirs (the family's ::before), his name in the casing, his words light ink. What the GAME prints (the strip's line, the
  aim, the end's numbers) stays UI's receipt (KIT_RULES 'what it says is printed'). The lesson left the receipt.
- The card that opens a fight (bohemia_fight_opener.js dress): the district goes from the ground line when the kind already names it.
NO LINE WAS WRITTEN OR REWRITTEN (rule 454(a)). No board, hand-over or AUTO of COMBAT THREE's was touched. No file of UI's was edited.

## THE GATE'S TOOL CORRECTED (tools/bohemia_fight_screen_the_phone_card.js)
It read 'a man of theirs' card' in the lineup, which was defect 3 itself. It now puts a man of theirs on the card the way a finger on him does
(UI.pend.target, the door its own plate loop already used), before the card and before his sheet. THE MAN'S CARD ON THE PHONE 9/0 on it.

## ON THE PAGE (rule 441), the final build line after the rebase onto 3c129cc9 (and again onto cab0b16a, COOK SIX's stadium: nothing of the fight's glass)
RESULT, four walks, each played first second to end screen to the map again by a finger: the demo upright (a road crew, 6 rounds), the demo on
its side (a pack, 9 rounds), the alpha upright (a pack, 5 rounds), the alpha on its side (a road crew, 6 rounds). Two cards on each other: 0 on
all four (was 3 of 4). A tile's line or 'Turn over.' standing on AUTO or under the end screen: 0 on all four (was 4 of 4). The phone's card in
the lineup: HIS 'YOU *' on all four (was THEIR RAIDER or WOLF on all four). A mouth's words cut: 0. Home on the map after LEAVE: 4 of 4. Page
errors: 0. The lesson, the shout and the why line on the dark board with a pinned face and a gold edge (red for theirs), both ways.
Before and after: records/target/FIGHT_SCREEN_ONE_MOUTH_AT_A_TIME_11_20.webp (the demo upright at 2: the lineup, his first turn, AUTO rounds
later; on its side, his first turn).

## GATES (each run alone or four at a time)
THE WHY LINE 20/0; THE CREW'S COMMENTARY 10/0; NOTHING POPS, VOICES CLEAR 38/0; THE MAN'S CARD ON THE PHONE 9/0 (its tool corrected);
THE MAN'S SHEET 7/0; THE CARD THAT OPENS A FIGHT 8/0; EVERY SHOT IS FELT 11/0; THE FACE SHOWS UNDER THE HELMET 10/0; EVERY PANEL CLOSES 14/0;
ICONS, NOT NUMBERS, IN THE FIGHT 8/0; LANGUAGE 107/0; DEMO BUILD 25/0; NOTHING POPS UP 23/0.
NAMED, NOT MINE (red on main without this build, the same legs): THE FIRST FIGHT TEACHES 7/3 (the first aim's veteran 'null', the first empty
gun, the first time cover matters); THE FIGHT BY HAND, QUICKER 18/2 (a walk that drew a free swing has no BACK; the skip lesson); THE LOSS IS
UNDERSTOOD 14/1 (the down do not talk). Pre-push pass green on the rest; the full suite unmeasured since PLUMBER's line.

## THE LIBRARY PAGE (the handoff's item 2): reference/library/rogue_fable_4/01_THE_FIGHT_SCREEN_AND_THE_CARD.md
Rogue Fable IV's screen and card, sourced (45 citations) from search results that quote its store page, its patch notes and its players; the
store pages themselves were refused by this session's network, so NO SCREENSHOT WAS LOOKED AT and every size it could not source says NOT
FOUND. Its five structural rules for a fight screen on a phone: danger drawn on the tiles, not in text; a held finger on an enemy opens its
card (attacks and damage, defence, movement first, then its reach lit); the last hit's size drawn on the bar itself (last turn's damage in red
on the HP bar); a state is one coloured letter over the head, and popups that fire together merge into one; build for the narrow screen first
and give every hover a touch version. CHECKED AGAINST OURS: the reach on the tiles, the card by a finger on the face and one popup per moment
we have; THE LAST HIT ON THE BAR we do not (the phone's card and the strip's bars show what is left, not what was just lost): a candidate for
this lane, not built. Battle Brothers checked: the after-battle screen is two tabs, Statistics and Loot (ours is one screen, RUN's).

## ROUTED
- WEAPONS (the range card, rule 187(c)): the weak ring's '-7' / '-12' on the board has no unit; a stranger cannot read it as 'to hit'.
- RUN FIVE (the end screen's receipt, rule 404): rolled up, it shows only its last line, the dashed rule under the men, from behind the header
  at the top right (both ways); a tap unrolls it, nothing says so.
- COMBAT THREE: the three reds above are in gates that read the fight's lessons, the free swing's BACK and the down-don't-talk legs.
[bb Battle Brothers puts one man's words in one place at a time; ours put two at once, and now says one]
[analog horror: a security monitor's caption box that only ever holds one speaker, the last one cut mid-word when the next one keys in]
