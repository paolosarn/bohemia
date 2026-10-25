# ONE HUD EVERYWHERE, AND THE STAT ICONS READ AT A GLANCE (UI, 10/25/26, ui-one-hud)

Rows: UI [one HUD everywhere] (rule 190) and UI [the stat icons read at a glance] (rule 189), both FIRST on the board, in
that order. Built into the game, no card (rule 127). Paolo's records: records/BOHEMIA_PAOLO_ONE_HUD_ON_THE_MAP_AND_IN_THE_TOWN_10_25_26.md,
records/BOHEMIA_PAOLO_THE_RANGED_DEFENCE_ICON_10_25_26.md.

## His words

- "why does the UI at the top of the screen on the city map have to be different than the settlement UI... why do things have
  to change locations... why can't the crew on the map be the same as the crew in the settlement... why is there not something
  cohesive?"
- "the icon for ranged defence has to look so much better... it literally just looks like a shield, and another shield for melee"

## PART ONE: ONE HUD

### Measured before (the demo at e195afc8, the one driver, 390 x 844 and 1440 x 900)

| screen | what was across the top | height (phone / computer) |
|---|---|---|
| the map | DAY with the sun dial, the crew (his face, 3/20, a tick a man), the gear, NOTES; the batteries on glass and where you are | 108 / 60 |
| the town | its own row: the town's name, '290 BATTERIES' in words, a CREW plate, LEAVE; another font, another order | 61 / 61 |
| the fight | nothing (the 10/22 round took the fight's strip off the top) | 0 / 0 |

Three screens, three tops. Rule 24 (his first votes, 9/21: one game mode, same buttons every second) and the overworld law's
'one HUD across map/street/fight' had no gate since 9/22, so each screen drew its own.

### What is in the game now

ONE BAR, BUILT BY ONE FUNCTION FROM ONE SET OF FACTS (slices/bohemia_ui_materials.js, the ONE HUD block: hudBuild, hudParts):

- THE MAP: the bar as it was, in the map's own top.
- THE TOWN: the town opens over the map (its frame lives in the map's page), so it is laid UNDER THE MAP'S OWN BAR AND PHONE,
  the same elements, not copies: the town's frame starts where the bar ends, the phone stands over the town exactly where it
  stands on the map. The bar's place says the town's name and its batteries are the purse the town is spending (read from the
  town's own label, so a buy shows at once). The town's own top row is gone. CREW is the bar's crew tag (in a town it presses
  the town's own CREW, so the town re-reads its bag when the company closes). LEAVE is the town's own button, moved (never
  cloned) to the bottom-right corner, the big-action corner the map's speed pad keeps; it rides above a building's sheet while
  one is open, so it is never under it.
- THE FIGHT: the fight is its own frame over the map, so the SAME FUNCTION builds the same bar in the fight's own top (#top,
  which the 10/22 round had emptied) and paints it every half second from the MAP's parts (the same HTML the map's bar lays).
  The fight measures its board under it by itself (its hudEdges reads #top). The gear opens the game's settings over the fight;
  CREW opens the same company screen; NOTES opens the notes in the map's own look and saves into the same notes, marked as
  written in the fight, and both NOTES count it.
- What the map's page gave the bar by inheritance (bold, 10 points, .4 tracking, the warm ink, the 1.4 line) the bar now says
  itself, so the copy in the fight is the same to the pixel. Found by the gate: the NOTES word was bold on the map and regular
  in the fight, and the place's line was 15.4 points on the map and 14.3 in the fight.
- A screen ADDS its own things below or beside (the fight's turn row and skills at the bottom, the town's LEAVE in the corner);
  it never moves or redraws the bar.

### The phone in the fight: decided, said

The coordinator's line lists the phone among the shared pieces. His own vote (9/23, the second votes, LOCKED): THE PHONE IS IN
THE CITY VIEW ONLY. And measured: on his phone the phone is 156 x 185 points at the top right, exactly where the enemies stand
at the start of a fight. So the phone stands in ONE place on the map and in the town (the same element), and stays off the
fight's glass; it is never anywhere else. The gate holds both halves. If he wants it in the fight, it is one line.

### Measured after (gates/one_hud_everywhere_gate.js, in the suite as ONE HUD EVERYWHERE, 60/0)

- Every piece (the bar, DAY, the crew, the gear, NOTES, the glass, the place) in the same rectangle on the map, in the town and
  in the fight: identical to a tenth of a point on the phone (bar 0,0,390,108) and on the computer (0,0,1440,60).
- The same picture: each piece cut from the glass's screenshot, the map's against the town's and the fight's: 0.00 percent of
  pixels apart for every piece on both profiles (the place's words compared too in the fight; left out in the town, where the
  place is the town).
- The same facts (DAY 1, 3/20, 290, the place), nothing of any screen over the bar, the fight's TOPH = the bar's bottom (108 /
  60), the phone at 227,127 on the map and the town and not on the fight's glass, LEAVE at the corner and taking him home, CREW
  opening the same roster screen over the whole glass from all three, the gear and NOTES working in the fight.
- Four plants bite: the fight's gear moved six points, the fight's gear redrawn (38 percent), the town's own row back, the phone
  moved in the town.
- THE BAR'S COST TO THE FIGHT, MEASURED AND HELD: in the game the board is 66 percent of the glass upright (TOPH 108) and 77
  percent on a computer (TOPH 60); the gate holds a floor of half. COMBAT's own 'two thirds of the glass' leg (THE REBUILT FIGHT
  PLAYS) measures the BENCH fight, which has no map: the bar is the game's, so a fight opened on its own keeps its old top and
  that leg reads as before (it read 66 upright and 50 on its side while the bench briefly wore a bar of dashes; fixed by building
  the bar only where the map is). The bottom bar is where COMBAT can win room back (NOTE on its board).

## PART TWO: THE STAT ICONS

### Research first (rule 189(b))

- BATTLE BROTHERS (rule 33): its man's page lists the eight attributes beside their numbers in the lower left of the character
  screen (the library's wiki, reference/library/grok/wiki/pages/0160_Attributes.txt: Hitpoints, Fatigue, Resolve, Initiative,
  Melee Skill, Ranged Skill, Melee Defense, Ranged Defense), each with its own icon file (Melee_defense.png, Ranged_defense.png
  and the rest, 24 and 23 uses across the library). Its cover mechanic, 'line of fire blocked', has its own icon of A SHIELD WITH
  AN ARROW (the Combat Mechanics page, found through the web search below). So Battle Brothers itself draws defence against
  missiles as a shield variant: the very trap he named. The pictures themselves could not be fetched (the wiki's host is refused
  by this box's proxy); the file names and the cover icon's description are what was read.
- THE GENRE, A STUDY ONLY (rule 6: no game is named and nothing is copied): icon libraries draw EVASION as a figure stepping
  aside with motion lines, DEFLECTION grouped with barriers and interception, and the advice every icon pack repeats is that a
  small icon is read by its SILHOUETTE first and its colour second. A community proposal for one strategy game marked evasion
  with a different FRAME SHAPE from armour, for the same reason: the shape is what the eye separates first.
- THE REAL WORLD: being hard to hit from far, with guns, is COVER and CONCEALMENT: sandbags, a low wall, a man ducked behind it.
  Close in, a blow is BLOCKED: a shield.

### The finding that proves us wrong

Our 10/25 ranged defence was the melee shield's own polygon, shot through, in drab: one outline, two colours (measured
intersection over union 1.00). Battle Brothers does the same thing in spirit (two shields), so copying the reference harder
would not have fixed it. AND the stranger's-glance test this gate also runs does NOT catch the old pair (0 of 960 glances
mistaken, because their colours sit 18 delta E apart and a nearest match uses colour): a measure of 'can a machine name it'
passes the exact defect he complained about. So the gate's first rule is the OUTLINE: one outline is one icon, whatever the
colour.

### What is in the game now (tools/bohemia_ui_stat_icons.py, seeded; slices/stat_icons/)

- RANGED DEFENCE IS COVER: a low wall of sandbags (pale sun-bleached burlap, act one's faded palette), a drab helmet ducked
  behind it, two brass rounds streaking over him, the streaks thinning behind them. Wide and low where every other icon is
  tall or round. Lit by the kit's one sun, inked, on its hard shadow, like the other seven.
- MELEE DEFENCE KEEPS THE SHIELD, the close-in block (his ruling). Tried as a riot shield (tall and narrow, our world's own
  close-in block): at 18 pixels it read as a dark phone, worse in a game with a phone; dropped.
- The other six unchanged: heart, lungs, taped fist, brass bolt, machete, scope reticle.
- Shown where they were: the crew screen's numbers (24 points), the hire's and the fight's drawer (18 points); the fight's
  'Ranged skill / defence' row now wears the reticle and the cover.

### Measured after (gates/the_stat_icons_read_at_a_glance_gate.py, in the suite as THE STAT ICONS READ AT A GLANCE, 7/0)

At 72 and 54 real pixels (his phone, 24 and 18 points) and 18 (a computer at 1x), nearest and smooth:
- no pair mistakable: one outline (0.85+) or close outlines (0.60+) with colours under 30 delta E apart; the nearest outlines
  left are the heart and the shield at 0.689 (54 px), 50 delta E apart (red against steel), named below as WEAK.
- the two defences' outlines overlap 0.487 (was 1.00).
- a stranger's glance (moved a pixel, a tenth bigger or smaller, softened, in the sun or the dark) names each icon from its
  picture alone: 40 glances each at three sizes, 0 mistaken.
- planted: the 10/25 shot-through shield is caught (outline 1.00); a twin in its place is caught by the glance (120 mistaken).
- THE STAT ICONS (the earlier gate) still 5/0: eight lit solids, seeded, on the crew screen at 24 points, on the fight's drawer.

## Weak, said

- The heart and the steel shield share a 'blob with a point at the bottom' outline at 0.67 to 0.69; their colours keep them
  apart (red against steel). If EYES' eye says they collide, the shield's outline is the one to change (not to a riot shield).
- The ranged-defence icon's two rounds are a pixel thick at 18 px; the read at that size is the wall and the helmet.
- Battle Brothers' own eight pictures were not seen (proxy); the research is its file names, its cover icon's description and
  the genre's rule of silhouette first.
- The company screen opened from the fight changes the stash and the line for the next fight, not the fight already running
  (the fight reads the company at its start). That is Battle Brothers' own rule (no company screen in a fight); his rule 190(b)
  asked for the door from all three.

## Proof run (rule 13)

Pre-push pass on the merged tree (main at eefda7f9 + this): ONE HUD EVERYWHERE 60/0, THE STAT ICONS READ AT A GLANCE 7/0, THE
STAT ICONS 5/0, THE DAYS ONCE 59/0 (re-aimed), THE SIX ON THE BAR, THE WAGON AND THE SIX, DEMO BUILD 25/0, the cut --check exact.
Also green on this change: THE MAP'S KEYS 11/0, SETTINGS IN OUR MATERIALS 15/0, THE NOTES BUTTON 22/0, THE FIGHT'S BAR IS STUDIO
MADE 15/0, WHEN THE PHONE TURNS 14/0, THE FORMATION IS KEPT 23/0 (alone; 22/1 only under three parallel browsers), WHAT THE CREW
CAN'T SEE 7/0, NOBODY ON ANYBODY 14/0, EVERY JOB KIND 37/0, THE JOBS' PART 31/0, THE PHONE'S BOARD 18/0, THE REGION HAS ITS
CITIES 5/0, THE ROSTER SCALES THE ENEMY 6/0, SETTLEMENT SCREEN 74/0, THE COMPANY SCREEN 48/0, THE SCREENS PAST THE PHONE 36/0.
RED, NOT MINE (each the same on a clean worktree of main): THE TOP MENU BAR 13/2, THE MAP'S BAR 6/1 (the pad's plates), SETTINGS
AND PAUSE 17/1 (QUIT), THE NOTES SECTION 27/1 (the plate read as a box-shadow the kit replaced), THE TEN CHANGES 17/5, THE LITTLE
THINGS IN THE FIGHT 6/1 (the AP reason), THE UI BELONGS TO THE WORLD 35/1 (AUTO on tin), THE HIT CHANCE LOOK 24/1 (C covers the
speed button), THE LOOP PLAYS ON THE MAP 3/2 (the board's contract, L4 and L5); THE REBUILT FIGHT PLAYS 150/5 alone (night frames,
pauses, night lift, the bank's frames, the perk brains: the bench fight, which this change no longer touches).

## Where it lives

- slices/bohemia_ui_materials.js: the ONE HUD block (hudBuild, hudParts, hudTown, hudInTown, hudFight, the fight's notes box),
  TOPBAR_CSS's host rules, the kit's rules for any host; tbPaint paints from hudParts.
- tools/bohemia_ui_stat_icons.py (cover(), the 10/25 shield_shot kept as the gate's plant), slices/stat_icons/*.png,
  records/target/UI_THE_STAT_ICONS_10_25_26.png (the eight beside their names).
- gates/one_hud_everywhere_gate.js, gates/the_stat_icons_read_at_a_glance_gate.py; gates/the_days_once_gate.js re-aimed (the
  fight's own strip never across the top; the board under the one bar, TOPH its bottom; the plant puts the round back up top).
- RUN's map, RUN TWO's town and COMBAT's fight files are untouched (ONE SYSTEM, ONE SESSION): the materials file dresses all
  three by itself, the same way the 10/22 bar did.

## For RUN, RUN TWO and COMBAT (NOTEs on their boards)

- RUN (the map): the bar and the phone are the shared HUD now; nothing of the map may sit in the bar's rectangle or move it.
  A new standing control goes below the bar or in the bottom-right corner, never into a second top row. The town's frame is
  laid under the bar by the materials file (html.bm-town, --bm-hud-h); if loopFrame's frame style changes, keep it fixed and
  full-size and the rule still lays it.
- RUN TWO (the towns): your #bar is hidden when the map's bar is over the town (html.bm-in-hud); keep #pname and #bat
  written, the bar reads the town's name and purse from them; LEAVE lives in #bmcorner at the bottom right, its handler yours.
  Standalone, the town keeps its own top row.
- COMBAT (the fight): #top is the one bar's host (class bmhost); the turn row, the skills and END TURN stay at the bottom; do
  not put anything back into #top; hudEdges already reads it, so the board stays under the bar.

## [bb interface]

Battle Brothers keeps one world bar in one place and one man's page with eight stat pictures; its two defences are both shields.
Ours keeps one bar in one place across the map, the town and the fight, and draws defence from far as cover, so the two
defences are two shapes.

## [better than bb] (rule 80)

The same bar in the fight, with NOTES and the company one tap away, measured to the pixel against the map's; and a ranged
defence a stranger reads as 'hard to hit from far' without hovering for a tooltip.

## Analog horror line

The bar is the same corrugated board taped to the top of every screen, like a clipboard you cannot put down; the ranged defence
is a man behind bleached sandbags while two rounds go over his helmet.

## Sources (the web search, 10/25)

- Battle Brothers Wiki, Combat Mechanics (the cover icon, a shield with an arrow): https://battlebrothers.fandom.com/wiki/Combat_Mechanics
- Battle Brothers Wiki, Attributes: https://battlebrothers.fandom.com/wiki/Attributes
- Game icons, evasion (a figure stepping aside): https://www.shadcn.io/icon/game-icons-evasion
- Arcen forums, unit icon suggestion (evasion as a different frame shape): https://forums.arcengames.com/ai-war-ii-interface/suggestion-on-unit-icons/
- Icon packs on silhouette-first readability: https://forums.unrealengine.com/t/marcel-iulian-serban-500-warden-guardian-protection-shield-defense-ability-icons/2745964
