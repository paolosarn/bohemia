# NOTHING POPS, EVERY VOICE CLEAR OF THE PHONE, THE TOOLTIPS (UI round 4, 11/2/26, BUILD 11/3zw - NOTHING POPS)

Asks 322 (every pop-up transitions, nothing pops, and the phone never covers the box where a person talks) and 312 (the tooltips:
a long press on anything says what it is, in plain words, Battle Brothers' hover text) in records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md;
rule 324 and rule 316's tooltip note. His words, 11/2, playing and loving the updates: "just keep in mind all your pop-ups have to
transition... I'm seeing the phone covers up the UI box where people are talking, where we can talk to them." And earlier: "Battle
Brothers... text bubbles... text pop-ups kind of how we do, and we still need to work on our tooltip [stuff] for real."

All measured on the baked demo, his phone upright (390 x 844, 3x) and sideways (844 x 390), phone on the right and on the left, real
touches (CDP touch for the holds). The map page's frame recorder did not report (the map's own frame loop); its two cards' rows read
  the layer's own log and their code; every other row is the recorder's presence on each drawn frame. Proof pictures: records/target/ui_nothing_pops/ (1 upright voices, 2 sideways voices, 3 tooltips).
The gate: gates/nothing_pops_voices_clear_gate.js (NOTHING POPS, VOICES CLEAR, TOOLTIPS, in the suite).

## WHAT SHIPPED
One new file, UI's: slices/bohemia_ui_nothing_pops.js (BohemiaPops), loaded once in the shell's head (one line in the alpha, cut into
the demo), arming every page of the game from the top the way MOTION's layer does (the shell, the map, the town, the crew screen, the
fight, the end screen). Nobody's code was rewritten: each page's pop-ups are named in one table by their own ids, and the file watches
them come and go. One new data file for WORDS: records/target/ui/BOHEMIA_TIPS.json (every line draft:true).

### 1. NOTHING POPS (ask 322, first half)
- IN: the tin grows out of the finger that opened it (the tap's point is the grow's origin), overshoots, lands. Drawn ON TWOS: three
  held poses on the music's own grid (BOHEMIA_BEAT, six holds a beat, the grid MOTION's morphs use): 55% / 90% / 104% then rest,
  250 ms at 120 BPM (measured 213 to 290 ms; the first hold runs to the next mark of the grid). A full-glass card's dim fades while its
  plate grows. A piece inside a screen (LET HIM GO?, the level-up, the injury card) unrolls in place from its top edge.
- OUT: a COPY of the pop-up as it stood (every style read off the real one inside the same task, before the glass is painted) shrinks
  away over two holds (125 to 200 ms measured), so the real one is gone at once and nothing waits on the motion: a tap lands where it
  always did. A pop-up that holds a page (the end screen's frame) leaves its plate, the page's own ground, instead.
- A tap during any of it finishes it in that frame (MOTION's stop cord). The MOTION setting (FULL / LESS, the phone's own
  reduce-motion by default) makes all of it a two-hold fade in place.
- A page that redraws a pop-up (takes it out and puts the same one back in one go: the road card's next line, the crew screen's card
  on every draw) is not a pop-up opening: nothing moves.

THE TABLE: every pop-up, before and after. The probe reads each pop-up's presence (on the glass x its opacity x its scale) on every
frame the browser draws; POPS = the first drawn frame is already whole (open) or the next frame has nothing (close).
| pop-up | page | before (opens / closes) | after |
|---|---|---|---|
| the road's mouth card, the side quests' givers (#roadcard) | map | appended whole / removed (by its code: appendChild, remove) | grows from the finger 226 ms (the layer's own log); a copy shrinks; its next line replaces it with no move |
| the meet card (#meetcard) | map | appended whole / removed | grows 281 ms; a copy shrinks 125 ms |
| the old town talk (#cttalk), the day card, the notes | map | display in one frame | grows; a copy shrinks |
| the fight's veteran (#vet) | fight | POPS / POPS (measured [1 1 1], [0 0 0]) | drops from the top 247 ms; a copy shrinks 184 ms (measured [0.25 0.25 0.81 1], [g g g]) |
| the weapon card on a held man (#drawer) | fight | POPS / POPS | grows from the finger 213 ms (measured [0.25 0.25 0.25 0.81]); a copy shrinks 163 ms |
| the fight's end card (#over) | fight | POPS ([1 1 1]) | the dim fades, the plate grows 212 ms ([0.09 0.09 0.57 1]) |
| the end screen (#spoilsdoor) | shell | POPS ([1 1 1]) | grows 262 ms ([0.25 0.25 0.92 1]); leaving, its plate fades |
| the settings card (#setwrap) | shell | POPS / POPS (measured [1 1 1], [0 0 0]) | grows 286 ms ([0.09 0.09 0.09 1]); a copy shrinks 139 ms |
| the kills card on a long press (#bkt-card, VOICES') | map, fight, camp, end | its own fade in; gone in ONE frame ([0 0 0]) | its own fade in, kept; a copy shrinks 157 to 202 ms |
| LET HIM GO? and the level-up (crew screen) | crew | drawn in place in one frame | unroll from their top edge in three holds |
| the injury card (.injc) | fight, crew, end | drawn in place in one frame | unrolls in three holds |
| the tooltip (new) | every page | - | grows 221 to 290 ms; a copy shrinks 136 to 179 ms |
| the phone's apps (PLAY, CREW, RELATIONS, NOTES, SETTINGS pages) | shell | already strike in (UI TWO's bphIn, measured [0.43 ... 0.79 1]) | unchanged |
| the town's sheet (the person you talk to in a building) | town | already slides (transition .25 s) | unchanged |
| the hints plate beside the phone (UI 3's) | shell | already rises in three holds | unchanged |
| the town grows, the crew screen, the camp, the fight's clouds | all | MOTION's morphs | unchanged |

### 2. THE PHONE NEVER COVERS A VOICE (ask 322, second half)
Every box a person speaks from (the road's mouth card and the side quests' givers, the meet card, the fight's veteran, the kills card,
the tooltip, the town's warning, the old town talk) is measured against the phone's rectangle (BOH_PHONE_RECT, UI TWO's one answer, in
that page's own pixels) the moment it shows and every quarter second after; a box that overlaps it moves the shortest way clear (up,
down, or across), 8 points off the phone, by the CSS 'translate' property alone (the page's own transform and layout untouched); a box
too tall for the room left is capped to it and scrolls. Never measured mid-grow (its scale is in its rectangle).

MEASURED (square points of the box under the phone; the phone 124 x 276 upright, 112 x 248 sideways):
| box | upright, phone right | upright, phone left | sideways, phone left | sideways, phone right |
|---|---|---|---|---|
| the road card, BEFORE | 5,955 (KEEP WALKING under the phone, the phone on top at its middle) | - | 0 | 0 |
| the road card, AFTER | 0 (moved up 60 pt) | 0 (up 60) | 0 | 0 |
| the meet card, AFTER | 0 (up 3 to 15 as its men are drawn) | 0 | 0 | 0 |
| the kills card held low by the phone, BEFORE | 7,860 | - | - | - |
| the kills card, AFTER | 0 (up 97) | 0 | 0 | 0 (moved across, 594 -> 481) |
| the tooltip on the phone's own app, AFTER | 0 | 0 | 0 | 0 |
| the fight's veteran | 0 | 0 | 0 | 0 |
- The road card's last choice still takes a tap where it now stands (measured: the tap moved the card on to its next line).
- SEEN, LEFT AS DESIGNED: UI 3's hints plate rises OUT of the phone over three holds; mid-rise, sideways with the phone on the left, its
  bottom crossed the phone's top by 16 pt (1,830 sq pt) for those holds; at rest it is clear (0) in all four layouts.

### 3. THE TOOLTIPS (ask 312)
A finger held still 480 ms (just after the kills card's 450, so a held man keeps VOICES' card and the fight's weapon card) on anything
that has a line shows a small card: the name in his casing at 10 px, one plain line printed on the receipt at 10 px (the JUST THE FONT
system: words at 10 or 20 css px, no glow, no round corner), over the finger, 16 pt off every edge, clear of the phone, transitioned
like every pop-up. The next touch anywhere puts it away. THE LIFT THAT ENDS A HOLD IS NOT ALSO A PRESS: a button's lift and click are
kept from it, its lift left alone (PLAY's slider lets go there; PLAY has no tooltip, its hold is its slider) (measured: a hold on the
phone's RELATIONS showed its line and the app stayed shut; before, the hold opened the app); on a
town's picture the lift becomes the town's own cancel (measured: THE BOARD said its line and nothing opened; a plain tap after opened
it); on the fight's ground the fight's own word for 'a hold that showed a card is not a tap' is set (measured: nobody moved). A mouse
resting 650 ms does the same on a computer (Battle Brothers' hover).
WHAT HAS A LINE (the fight and the crew screen first, then the shops and the bar):
- THE CREW SCREEN: every stat (WORDS' records/target/bb/stat_help.json, written for this and owed to UI: now wired; measured: HITPOINTS
  'How much damage you can take before you go down.'), every perk (WORDS' plain lines, perk_translation.json 'skin'), every trait
  (traits.json 'says'), every item (its own numbers read plainly; measured: A QUILTED HARD HAT 'Stops 40 damage before he bleeds. Weighs
  1: the heavier, the sooner he tires.').
- THE FIGHT: the bare ground (the tile's row in WORLD's ground table: OPEN GROUND, IN THE WAY, A DOOR); a man and a building keep the
  fight's own hold cards (the weapon card, the height line); the phone's fight buttons (SPEED, AUTO, RETREAT, WAIT, END TURN) and his
  skills on the phone (a perk's skill reads the perk's line).
- THE TOWN: every building (THE HALL, THE BOARD, THE STALL, THE BAR, THE SMITH, THE ARMOURER, THE BARBER, THE CLINIC, SCAVENGE, BUILD);
  a shop's items (their own numbers, wherever an item's icon carries its id).
- THE BAR: the day, the crew, where you are, the settings, batteries, nights of food, food, water, tape, medicine, rounds.
- THE PHONE: CREW, RELATIONS, NOTES, SETTINGS, PLAY / PAUSE, CAMP, LEAVE.
- ANY LANE: data-tip="the line" (and data-tip-head="THE NAME") on any element gives it a tooltip; a button whose own label is a key in
  the file's 'labels' gets that line.
New lines: records/target/ui/BOHEMIA_TIPS.json, every one draft:true for WORDS (42 lines).


### 4. THE FEED, ONE POST AT A TIME (rule 329, ask lines 327 and 339, sent in mid-round)
Paolo 11/2: 'there's two tweets that go out that you can see... just make it one, and they should only stick around for as long as it
would take to read them.' BEFORE: the phone's face printed the city's two newest posts, standing until the next one came. AFTER
(slices/bohemia_phone.js stripPaint, UI's): ONE post, the newest, stepping in on the beat as before; it stays 1.2 s plus 0.25 s a word
(handle and words; a phone reader near 230 words a minute), rounded up to whole beats (a ten-word post: 3.7 s -> 4.0 s at 120 BPM),
then sinks out of the strip in two holds; the next post steps in when it comes; a tap on the strip still opens everything posted.

## CHECKS
- NEW: NOTHING POPS, VOICES CLEAR, TOOLTIPS (gates/nothing_pops_voices_clear_gate.js): 38 ok, 0 failed on the final tree (BUILD 11/3zw),
  upright with the phone right, sideways with the phone left, and the planted layer-off run (the road card back under the phone, 5,955).
- THE PHONE (the_phone_gate.js, every profile) on the final tree: 256 passed, 3 failed, no page error. The 3: 'RELOAD is big' on three
  profiles, where the fight's phone carries only STRIKE (strike 102x50 / 92x45 / 128x63, no RELOAD: the man in that fight carries a
  melee weapon since main's armory round); nothing of this round draws or moves the fight's buttons. CAUGHT BY IT AND FIXED THIS ROUND:
  the tooltip's hold swallowed the lift on PLAY, so WORLD's hold-PLAY speed slider never let go ('slid one notch up and let go' red);
  the tooltip now keeps only the click from a button (the lift is left alone) and PLAY, whose hold is its slider, has no tooltip.
- Baseline on main (this tree's alpha and demo restored to main's) against mine, the gates that touch these boxes:
  MEET BEFORE YOU FIGHT 13/2 on main, 13/2 mine (M6, M10, the same two); SETTINGS AND PAUSE 17/1 on main, 17/1 mine (QUIT's door, the
  same one); THE UI MORPHS (phone) 18/7 on main (the phone's town fold, the camp, the fight's fold, M9), 18/7 mine with 0 page errors (one run of
  mine under three browsers at once showed 2 drawImage page errors; run alone it did not come back, and nothing of mine draws outside a try);
  THE SURVIVOR'S WORD 6/0; NO ORPHAN SCRIPT 4/1 (bohemia_loading_screen.js, red on main, not mine). Page errors in every probe drive: 0.

## LEFT
- WORDS: the 42 new lines are drafts; the perks, traits and stats are WORDS' own lines, unchanged.
- The fight's statuses (bleeding, dazed) have no icon on the glass yet to hold; when COMBAT draws them, data-tip on each does it.
- A shop shelf's goods that are not items (the stall's trade goods) say nothing yet: one data-tip each in the stall's row.
- The map's towns on the map picture (a held finger on a town on the map) say nothing yet.
- MOTION's own list: the meet card's entrance was on it (rule 229(a)); this round's grow is the house's piece-size move, MOTION can
  replace it with a morph any time (the row in POPS is the one place to take it out).

[bb Battle Brothers' tooltips: hover anything (a perk, a stat, an item, a tile, a status) and a dark box with the name and one or two
lines appears beside the pointer, never over the thing itself; on our phone the hover is a held finger, and the box keeps off the phone.]
[analog horror: every pop-up is a tin plate a child cut out by hand, shot on twos; it grows out of your finger like a puppet on a
stick and leaves as a cut-out copy, never a clean digital fade.]
