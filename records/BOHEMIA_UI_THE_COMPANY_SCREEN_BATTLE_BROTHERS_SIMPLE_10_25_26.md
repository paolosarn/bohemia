# UI 10/25: THE COMPANY SCREEN, BATTLE BROTHERS SIMPLE, CARRYING A DISMISS BUTTON (rules 172 and 171)

Row [the company screen, Battle Brothers simple] carrying [a dismiss button]. IN THE GAME, no card (rule 127). The screen
is slices/BOHEMIA_ROSTER_SCREEN.html (RUN TWO's until rule 172(e) moved it here: one lane, one screen), dressed by
slices/bohemia_ui_materials.js (ROSTER_CSS). It opens from CREW on the map's bar, CREW in a town, the spoils' LEVEL UP,
and C or I on a computer, through engine/bohemia_crew_door.js (untouched).

## HIS WORDS
'find screenshots of how Battle Brothers' company menu works, because they really simplify how easy it can look... you're
over complicating it, it's really hard to navigate your equipment, the levelling up... and then we need to improve upon
that... you're in deficit.' And: 'there's not a dismiss button, bro, what if I want to dismiss people.'

## HOW BATTLE BROTHERS DID IT (rule 33)
The sandbox reaches neither the wiki nor Steam. The layout is the coordinator's recall in
records/BOHEMIA_PAOLO_THE_COMPANY_SCREEN_AS_SIMPLE_AS_BATTLE_BROTHERS_10_25_26.md, marked unverified; GROK ASK 41 (its
screenshots) has NOT landed in reference/library/grok at the end of this round (the GROK_ASK_41 there is the 10/24 injuries
ask, a different numbering). What this round built from: one man at a time; his paper doll with the slots around it and two
bag slots; his numbers as icon, number, bar; the stash beside him with filter tabs and a sort; right-click equips, the old
piece back to the stash, a hover compares before the click; a level waiting shows a plus, three attributes with their rolls
then one perk; the formation is the roster along the bottom. On dismissing, the one line the library holds is the wiki's
Mood page (reference/library/grok/wiki/CORE_WIKITEXT.md): 'dismissed men without compensation' is one of the common moods
that sink the rest of the company. When Grok's page lands, anything it contradicts is corrected here and in the screen.

## MEASURED FIRST (the 10/25 screen, before any change; tools/bohemia_ui_company_screen_count.js, commit 3493e132)
One counter for before and after, opening the screen the way the game does (the crew door, the origin's company) on the
STRANGER'S STATE: six men (YOU, DESI, RAUL, TINA, BOOKIE, OSO), BOOKIE with level 2 waiting, a stash of ten (three body
armours holding 30, 65 and 110). A thing on the screen is a word, a picture, or an empty box a person reads or presses.

| | the 10/25 screen | this round |
|---|---|---|
| phone, things when it opens | 132 | 98 |
| phone, things with the third man picked | 169 | 121 |
| phone, how tall the page runs | 1.93 to 2.3 screens | 1 screen |
| computer, things open / third man | 132 / 169 | 98 / 121 |
| computer, page | 1.24 to 1.58 screens | 1 screen |
| the stranger's first four steps (open, third man, best armour, his level), phone | 10 taps and 2 scrolls | 9 taps, 0 scrolls |
| same, computer | 10 clicks | 8 clicks (a hover compares, a right-click equips) |
| dismiss the fifth man | impossible (no button) | 3 taps (him, DISMISS, YES) |

Why the old one was hard: the line stood up as two columns of nine 48-point rows (432 points) so his page started under it
and needed a scroll; the bag drew all 36 slots, 26 of them empty boxes, at the bottom of the page; the bag's tiles showed a
glyph and the last word of the name, no number, so the best armour could only be found by opening his slot's picker; the
level-up was a grid of eight long buttons plus a PICK A PERK opener; every slot printed the item's name and its numbers.

## WHAT IS ON THE SCREEN NOW
- THE ROSTER STRIP: the line itself, FRONT and BACK, nine places a row, every man his face (PORTRAIT's fresh portrait, 44
  points inside his cell) with his first name; an EMPTY place is narrower and takes what is left, so nine places sit across
  390 with every man a full thumb (the 10/18 reason the line stood up); drag a face to move him; a man with a level waiting
  wears Battle Brothers' plus; the laid-up stand in a row of their own with their days on their face.
- TAP A MAN AND THE SCREEN IS HIM: his name, trade, level, wage (RUN TWO's [money teaches] from main: a hire's night is his food and his pay) and XP on two lines, his trait and his one line; DISMISS
  on the right. His 3D body in the middle (it idles, a tap turns him) with Battle Brothers' slots around it: HEAD, MAIN
  HAND, BODY on one side; ACCESSORY, OFF HAND, AMMO on the other; his two BAG slots under him. Each slot shows its piece's
  icon and its one number (a gun its reach in tiles, armour what it holds); the name is in its label and in the line.
- HIS NUMBERS: eight icons (UI's stat icons) and eight numbers printed on the receipt, stars beside them; a tap on one says
  its name and what it does. While a level waits on him THE NUMBERS ARE THE LEVEL-UP: the same eight chips with what each
  rolled in green and its name small under it; three taps, RAISE THEM; the PERK tab opens itself beside him and one tap
  takes the perk (its words are on the button). His plus goes.
- THE STASH BESIDE HIM (under him on a phone upright): STASH n/36 (more with RUN TWO's cart, BohemiaCamp.stashSlots(), carried
  in from main this round), the tabs ALL, WEAPONS, ARMOUR, SORT (PERK whenever a point waits, each level its three then its
  perk, Battle Brothers' order), and only the pieces there are, each with its one number, GREEN when it beats what he wears in that slot, red
  when it is worse. ONE TAP SHOWS THE COMPARISON: the slot it would go in lights with the difference signed (+80), and the
  line says it ('PLATE CARRIER holds 110 weight 11 / BOOKIE'S BODY: work jacket holds 30 +80 TAP IT AGAIN TO PUT IT ON').
  THE SECOND TAP PUTS IT ON, his old one back in the stash (two hands as before: a long gun sends the shield to the stash).
  Tap his slot and the stash is cut to what fits it with TAKE OFF first; tap the slot again and it comes off.
- THE ONE LINE between him and the stash (under the stash on a wide screen) says what happened, or the comparison. It is a
  fixed three lines tall: MEASURED, when it grew from one line to three under a resting mouse it pushed the stash down and the
  piece slid out from under the pointer, so a drag from the stash missed (ROSTER SCREEN's drag leg caught it). Nothing pops up.
- AMBER MEANS DO THIS: the PERK tab (a point waiting) and RAISE THEM are lit amber; the tab you are on is pressed in, never
  amber, so two ambers never compete.
- BETTER THAN BATTLE BROTHERS ON A PHONE (rule 172(b)): nothing behind hover (the first tap is the hover), the comparison is
  ON the slot it lands in as well as in words, every piece's number is on its tile before any tap, the level-up needs no
  tab, a swipe across him is the next man, and the whole company is on one screen with no scroll. THE COMPUTER keeps Battle
  Brothers' own: the comparison under the mouse, right-click equips, right-click on a worn slot takes it off, Tab and D the
  next man, A the one before, Escape takes back the last tap (the dismiss question, the comparison, the cut stash) before
  it closes the screen, C and I close it.
- A PHONE ON ITS SIDE, A TABLET, A COMPUTER: Battle Brothers' shape, him on the left, the stash on the right, the line along
  the bottom; on a computer his body at two render pixels a point.

## DISMISS (rule 171)
- One button, DISMISS, on every man but YOU (the third votes: the main character never dies, and never leaves). A tap asks
  once: 'LET DESI GO?' YES / KEEP HIM, and the line says what will happen ('DESI takes his pay and walks. His rifle, padded
  vest, rag hood come back to the stash. His wage stops.').
- YES: his gear goes to the stash (what does not fit in the 36 walks off on him, and the line says so); he leaves the strip,
  the formation (every index past his moves down one) and the fight's hand-over (bohemia.company.v1 and its line);
  he goes into the map's walked list, bohemia.walked.v1, as {name, look, hired, dismissed: true, day}. That list is the one
  the game already reads for a man who walked when the bill went unpaid, so with no new key: the NIGHTLY BILL counts one man
  fewer (the map's crewCount), the FIGHT'S DOOR leaves him out (the alpha's nfOpts), the ENEMY'S SIZING counts one fewer
  (BohemiaJobKinds.roster), and the MAP'S MARKER stops walking him beside YOU (mapCrewLooks reads names and looks there).
  THE PHONE'S FEED says it ('@thecrew: DESI is out. You let him go. Left his gear.', draft:true), and the map's day log.
- OURS, NOT BATTLE BROTHERS': no compensation to choose and nobody sulks, because this company has no mood yet; the
  batteries are the money and a man let go takes his pay with him. If a mood lands, the wiki's line above is the rule to
  take.
- THE MAP'S BILL, FIXED BY NAME (RUN's file, one function, NOTE on RUN's board): crewWhoWalks picked who walks by COUNT (the
  newest hire not counted gone, then the company from the back), so a man let go from the middle would have been walked a
  second time later and counted off the crew twice. It now picks by name: the newest hire not gone, then the company from
  the back not gone; walked, let go, taken and dead are all gone; YOU never. Proven over five short nights in a row.

## WHAT LEFT THE SCREEN (rule 172(c): less, not more)
The stood-up line (432 points) and its header sentence; the bag's 26 empty boxes; the picker inside his page; the item
names and numbers printed across every slot; the eight stat names on the plain numbers (a tap says the name); the PICK A
PERK opener; the two-column level-up buttons; the separate 'YOUR BAG' sentence; the SORT THE BAG bar (SORT is a tab).

## GATES (rule 13: the pre-push pass, by name)
NEW, in the suite: THE COMPANY SCREEN, BATTLE BROTHERS SIMPLE 52/0 with --plant (gates/the_company_screen_battle_brothers_simple_gate.js),
phone and computer, the stranger's path with real taps, the counts against the 10/25 screen and this round's budget
(105 open, 130 with a man picked), the dismiss read back through the map's own crewCount and crewWhoWalks and the alpha's
own nfOpts (read out of their files), the feed, YOU without a button, KEEP HIM, the swipe, Tab, Escape; four planted
defects caught (a one-tap equip, a dismiss that writes no walked line, DISMISS on YOU, the 36 empty slots back).
RE-AIMED, each keeping what it protects (the picker became the stash beside him; four slots became six around him and two
bag slots; an empty place in the line is a drop spot, not a tap; the gun's long words moved from the slot to the line):
ROSTER SCREEN 15/0, CLIMBING 17/0, THE CREW SCREEN READS THE STASH 23/0, THE GUNS ON THE CREW SCREEN 7/0, THE SCREENS PAST
THE PHONE 36/0, THE CREW SCREEN AT FOURTEEN 21/0 (its control was a git object a shallow clone cannot hold, red on main for
that alone; now a planted line of nine fixed places that must run off the glass), THE ROSTER AND THE POSTS LOOK 27/1,
TWO HANDS 9/0, THE SPOILS 27/0 (the perk on the PERK tab beside him, the looted piece by two taps), THE UI BELONGS TO THE
WORLD 35/1 (the stash's full well; its one red is the fight's AUTO on tin, the same on main).
UNCHANGED AND GREEN: SETTLEMENT SCREEN 74/0, THE MAP'S KEYS 11/0, WHO YOU HIRE FIGHTS 21/0, THE TOWN AND THE HIRE 11/0,
EQUIP FROM THE STASH 7/0, THE WALK-UP 8/0, DEMO BUILD 25/0 and the cut --check exact (BUILD 10/25q), ROSTER HURT 13/0, THE BAG SORTS 9/0, THE STARS SIT WITH THE WORDS 8/0, ONE MAN ONE LOOK 8/0, NO FACE
FROM A BODY 23/0, THE HIRE SHOWS THE WHOLE MAN 10/0, THE TRAIT BEFORE YOU HIRE 12/0, THE STAT ICONS 5/0.

## RED, NOT MINE (the same on main before me, run on a clean worktree of origin/main)
THE ROSTER AND THE POSTS LOOK's posts leg (the hall's hire card name 3.18 to 1 in the sun); THE FACE IS HIS OWN FACE 17/1 (a
board client, NELLIS GATE); NO TWO PEOPLE ALIKE 22/1 (the crew screen's hired-face leg finds no hire on the line on main
too); CLIMBING 16/1 (a stat rolled +1 against a two-star column, the engine's roll, the same on main); THE TEN CHANGES, THE
UI'S PART 17/5 (map and fight legs, the same on main); EVERYBODY IDLES 40/1 (the fight's enemies without idles).

## WEAK, SAID
- Grok ask 41's screenshots have not landed: the layout is recall. Corrected when they do.
- ACCESSORY takes nothing: MEASURED, no item of that kind exists in the valley (the market, the spoils and the fight deal
  weapons, shields, heads and bodies). The slot keeps Battle Brothers' shape and says so when tapped. AMMO shows what his gun
  holds going in, not an item.
- The plain numbers are icons; a stranger taps one to learn its name (the level-up shows the names).
- A perk is one tap with no take-back, as before.
- A front or back row of nine men (only possible past ten in a fight) shrinks every face a little under 44.
- He walks off the map's marker; there is no walk-off in the town yet.

[bb Battle Brothers keeps one man, his doll, his numbers and the stash on one screen, compares before the click and puts a
piece on with one; ours does the same on a phone with the comparison on the slot itself, every piece's number on its tile,
the level-up in his numbers, a swipe between men, and a dismiss that every system in the game hears.]
[analog horror: the stash is a row of salvage tags, the good ones inked green and the bad ones red like a pawn shop's
markdowns; letting a man go is a cut-off notice in red ink, one confirm, and the feed posts it like a missing-person flyer.]
