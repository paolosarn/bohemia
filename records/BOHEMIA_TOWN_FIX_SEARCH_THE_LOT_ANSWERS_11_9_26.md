# TOWN FIX: SEARCH THE LOT ANSWERS, AND THE FLOATING SIGNS COME OFF (11/9/26)

VAMILY rule 438 (a NEW RULING on 434), ask lines 523 and 524. BUILD 11/9a - SEARCH THE LOT ANSWERS.

His words, 11/8: "I clicked the scavenge button and then I pressed search the lot, it says it'll take four hours, I press it and
nothing happens. I definitely did not need them floating city labels, your shit was fucked already."

## WHAT WAS WRONG, MEASURED BEFORE ANYTHING WAS CHANGED

The coordinator measured one town on the demo and the minigame opened. So the job was to find the path he was on. A browser on a
phone shape (390 x 844), the demo, a NEW GAME, a real finger on the lot in EVERY place on the map (14), then on 'Search the lot':

| place | the map cell under it | the lot held | the button |
|---|---|---|---|
| Anarchists | apartment | 6 | live |
| Blues | park | 0 | GREY, a press did nothing |
| Caravans | truckstop | 0 | GREY |
| Cartel | storage | 0 | GREY |
| Church | school | 0 | GREY |
| Colorful, Custom, Homeless, Reds, Trades | apartment, suburb, trailer, downtown, industrial | 6 | live, until one lot anywhere was searched out |
| Mob | resort | 0 | GREY |
| Network | radio | 0 | GREY |
| Remnants | prison | 0 | GREY |
| Volunteers | school | 0 | GREY |

THREE CAUSES, ONE SYMPTOM ("it says four hours, I press it, nothing happens"):

1. **8 of 14 places had a dead lot from the first second.** The town screen counted the lot as the district of the map cell the town
   stands on, and WORLD's scavenge engine searches 19 districts; a park, a school, a truck stop, storage, a resort, the radio station
   and a prison are not among them. So the lot held zero and `act(..., l.left===0 && !dead)` drew the button disabled: 45% opacity,
   still reading 'Search the lot, 4 hours', and a press on a disabled button is silence. The valley is new every game, so which towns
   were dead changed every game; the coordinator's town happened to be live.
2. **Every place shared ONE count.** One ledger was made the first time the town screen opened, and every place used block 0 of it
   (the map hands the place's block as [x, y], never as cells, so the fallback block 0 was taken every time). Searching one town's
   six things greyed every town's lot for the rest of the game.
3. **The reason never reached the glass.** When the lot was empty the line under YOU's face should have said 'Nothing left on this
   lot', but a town's trait line takes that spot the first time ('Nobody out here today. Sick, or scared of it. More for me.' or
   'Everybody's at the market. Nobody's watching the lot.'), so the screen said, in effect, go ahead, and the button did nothing.

And on the paths that did work: the press put a blank brown screen on the glass until the game's page had loaded and the block's
board had baked (2 s on this box, several times that on a phone), with only a small dot.

Paths checked and NOT his bug (named so nobody re-checks them blind): the alpha's frame chain (alpha -> city frame -> town frame ->
game frame: relative srcs resolve in slices/ on both surfaces; measured, the alpha opened the game in 4 s); the service worker
(slices/sw.js asks the network for every .html and .js, no-store or no-cache, so a cached old page is only served offline).

## WHAT CHANGED

`slices/BOHEMIA_SETTLEMENT_SCREEN.html`, marked `__SEARCH_THE_LOT_ANSWERS__`:
- **Each place has its own lot** (keyed by its own name; your camp by where it stands). One town never empties another.
- **The town's junk lot is junk ground** whatever the map cell under the town is: a district the engine does not search counts as
  commercial, so every lot holds its six.
- **The button is never grey.** Empty, it reads 'nothing left' on its face and a press has YOU say 'Nothing left on this lot. You took
  it all.' at once.
- **Something on the glass the same frame as the press:** a cover in the town's own page (the SCAVENGE plate, the town's name, a
  pulse), measured 2 to 3 ms after the click, under the game's frame; then the game's page shows its plate and LEAVE while the board
  bakes (`slices/BOHEMIA_SCAVENGE.html`), and a LEAVE before the board comes spends nothing.
- **A game that cannot open never leaves him in silence:** the page missing, the page not answering in 15 s, or the board not coming
  gives the four hours back, runs the plain search (one roll, four hours, the same as before the minigame) and YOU says 'The block
  would not come up, so I looked the quick way.' and what was found.
- **A leftover game frame never blocks a press** (it used to answer 'already open' and do nothing).
- The board the game bakes in the top page is let go when the game's page goes, never left running.
- Read only: `BohemiaSettlement.lot()` (its key, left, total, the dead, why not, open).

**The floating signs (11/8c, f7f07e42) are off.** The block `__EVERY_DOOR_HAS_A_SIGN__` and its three hooks are gone; the town screen
is byte for byte what it was before 11/8c except for this round's lot fix. Its gate is in `graveyard/every_door_has_a_sign_11_9_26/`
with `graveyard/POSTMORTEM_EVERY_DOOR_HAS_A_SIGN_11_9_26.txt`. A building says what it is in its own sheet when he taps it. Its VOTE
card is consumed with his words as the verdict (down).

## THE GATE: SEARCH THE LOT ANSWERS (`gates/search_the_lot_answers_gate.js`)

On the ALPHA and the DEMO, phone upright and on its side, real fingers through the whole frame chain:
P every place's lot live with its six on a fresh game; A1 the cover in the page under 50 ms after the click and on the glass's
middle from the top page; A2 the game on the block's board, LEAVE answers with YOU's line; A3 a second press opens it again; A4 a
searched-out lot says so on the button and in YOU's mouth, and the next town's lot is still whole; A5 a body on the lot searched at
once, then the game; A6 a slow page (5 s planted): the cover on the glass at once and at 3 s; A7 PLANTED the game's page missing
(404): the gate's own game check goes red with the line 'the game's page did not load', and the press still answered (the cover, then
YOU's fallback line, the four hours spent once); S a saved game: the link again, CONTINUE, a town, the press opens the game.

RESULTS on the merged tree (main 1c7c9b10 + this): 64 of 64. The demo upright 16/0, the demo on its side 16/0, the alpha upright
16/0, the alpha on its side 16/0. Every place on the map 14 of 14 live (upright, both surfaces); the cover 1 to 5 ms after the click;
the game up on the block in 1.9 to 3.3 s on this box; the planted missing page caught red with its line on all four, and the press
still answered with YOU's fallback line; the saved game in by CONTINUE on the demo and by the door's BEGIN on the alpha (the alpha
over a save opens on its door, not the title). Before the rebase the same gate ran 63/1 on the old base: the one red was this gate's
own way into a saved alpha (it waited for a CONTINUE the alpha does not show), fixed in the gate.
Also green: THE SETTLEMENT SCREEN 75/0, SCAVENGE ON THE DIAL 27/0, SCAVENGE 39/0, DEMO BUILD 25/0, HANDOFF 10/0. Under load (two
phone runs at once) the settlement gate flickered once on the hall's hire and once on the posts' count, legs this round does not
touch; solo it is 75/0.

EYES (1c7c9b10, 11/8) found the district half of this on its own walk an hour before this lane and fixed it in one line; this round
keeps that and adds the per-place count, the never-grey button, the cover and the fallback (EYES' own note: 'TOWN FIX keeps the
other half: an emptied lot must still answer at once').

Also re-aimed: the town screen's own gate (SETTLEMENT SCREEN) asserted the old grey button twice ('picked clean, shut'); both legs
now assert the button stays live and YOU says the lot is picked clean. 75/0.

## NOT DONE, NAMED

- The lot's count is not in the save: a reloaded game starts every lot full again (it always did; the ledger lived only in the town
  frame). The save is RUN's; a line for RUN if he ever notices.
- There is no once-a-day rule on the lot (the coordinator's example 'already searched today'): no ruling exists, the lot's own six is
  the limit, and 'Nothing left on this lot' is the line.
- On a real phone the board bakes in several seconds; the plate and LEAVE are on the glass the whole time, but the bake itself is
  the fight's dealer (COMBAT TWO / PLUMBER) and was not made faster here.

[bb] Battle Brothers' town never shows a button you can press that does nothing: a building you cannot use is not lit, and one you
can always answers with its screen. Ours: the lot always answers, with the game or with a line.
Analog horror line: the cover is the game's own dead-institution plate, SCAVENGE on paper over the dark, the pulse a battery light.
