# HOME BASE 6 -- YOUR PLACE IS EASY: THE FLOW ON THE GLASS, SAID BY A FACE (11/27/26): BUILD 11/27zzc, VAMILY rule 492(a), plan C and B

PAOLO 11/27 (rule 492): 'the settlement stuff on my phone was so freaking confusing... I thought it'd be more intuitive and easy to
navigate and like understand where the best settlement for my place to be is.' Then, told it still worked the old way: 'Okay so build
the easy shit man wtf' (ask row 786, rule 492 amended: the top of the studio). The plan is HOME BASE 5's stranger's walk,
records/BOHEMIA_HOME_BASE_YOUR_PLACE_WALKED_AS_A_STRANGER_11_27_26.md, A to H; this build is C and B together, the coordinator's order.

## MEASURED BEFORE (the stranger's walk, twelve unclear moments)
The whole flow lived on the in-game phone's 100 px YOUR PLACE page: 8 px letters, 18 px buttons (16 sideways), opened by a 26 px PLANT
in the phone's band; nothing said what PLANT was, nothing said 'plant it' when he got there, nothing said 'go in', nothing said 'tap an
empty lot'. DANGER's full squares meant bad while the other three's meant good.

## WHAT IS BUILT
On the map's glass, beside the phone (its bottoms level with the phone's, under the thumb; above it only when the room beside it is too
narrow), his crew's best man (the highest level, then the most experience, never him, never the dead) says the ONE next thing, his face
drawn and his mouth moving on the beat, the words coming as he says them, in his letters at 20 px; the button for that thing is right
there, gold, 48 px tall; a second button (LATER, CLOSE, NOT YET) is tin. Every moment:

| when | he says | buttons |
|---|---|---|
| day 1, a town, a fight, camp | nothing | none |
| day 2 on the map | We need a place of our own. | LOOK FOR GROUND / LATER |
| after LATER | (no face) | one YOUR PLACE button, 48 px |
| good ground | Good ground. Plant it here. + the four marks | PLANT HERE / CLOSE |
| ground that cannot be planted | This is the road. Go north-west. (the true reason, the way) + the marks | WALK THERE / CLOSE |
| nothing good near | Nothing good near. Walk on. | CLOSE |
| walking there | Walking. I'll say when. | none |
| there | This is it. Plant it. | PLANT HERE / CLOSE |
| PLANT HERE | Are you sure? This is permanent. (his own words) | PLANT HERE / NOT YET |
| planted | Ours now. Go in and build. | GO IN (the map's own door) |
| inside his place, once the arrival card is gone | Tap an empty lot to build. | none |
| a sheet open | nothing (the sheet is his to read) | none |
| the first build bought, the desk closed | It goes up tonight. | none, once |
| after | nothing, for good | none |

THE FOUR MARKS (plan A's first piece, on the panel): WATER, POWER, ROAD, SAFE, each a picture and three pips, MORE LIT IS BETTER on all
four (DANGER read the other way and confused; SAFE is 3 minus the grade's danger). From the map's own probe, nothing made up.
ONE FACE AT A TIME: the panel steps aside the instant the map's own voice, a road card, the hint plate, the settings card or the door
is up (a MutationObserver on the voice and the hint plate, not the quarter-second tick: measured 1 sample of overlap before it), and
comes back after. It never covers the map's own line at its foot (#packline): it stands above it when they would meet.
THE PHONE KEEPS THE RECORD: the band's PLANT is gone; the YOUR PLACE page has no buttons: unplanted 'NO PLACE YET / Your crew shows you
good ground on the map.' and what waits for a place; planted its name, the day, the night's bill, who lives there, the prizes, what
stands. (The page had no door after planting before this build either; plan H puts YOUR PLACE back in the band once planted.)

## WHERE IT LIVES (rule 495: one owner each, no new patch block in a big page)
- engine/bohemia_home.js `step(c)` (pure: which step, its line, its buttons, from what the map knows and what he pressed) and
  `bestMan(men)`; the gate reads the same function.
- records/target/bb/home_base.json `flow` (lines, the short reasons, the button words, the mark words; draft:true) and `words`
  (page_none_title, page_none; the dead plant_title / plant_yes / plant_no / not_here taken out: nothing read them any more).
- slices/BOHEMIA_CITY_WORLD.html, inside HOME BASE's own __HOME_BASE__ block: `homeFlowFacts()` (on the map with nothing over it,
  inside his place, a sheet or the arrival card over it, walking, his own builds booked, a gift's lot not counted) and `homeGoIn()`
  (travelTo his block, so townTap opens it beside it and walks him there from further), on BohemiaHomeMap as flowFacts and goIn; one
  `<script src="bohemia_your_place.js">` after the block. THE PATCH LAYERS ONLY GO DOWN: no block, no hook line added.
- slices/bohemia_your_place.js (new, the map's frame): only draws, times and presses. window.BohemiaYourPlace, read hook
  window.__YOUR_PLACE.
- slices/bohemia_phone.js, HOME BASE's __HOME_BASE__ lines only: the band's PLANT (markup, its style, its press, its toggle) out; the
  page is the record.
- tools/bohemia_your_place_glass.js: the one place the gates and the card read and press the glass.

## PROOF (pre-push pass; full suite unmeasured since PLUMBER 8's line)
- YOUR PLACE IS EASY (new, gates/your_place_is_easy_gate.js): engine 6/0; on the demo upright 18/0 and sideways 18/0 (Y1 to Y8 and P2,
  a stranger's whole walk by real taps: offer, LATER, YOUR PLACE, bad ground, WALK THERE, the walk, there, are you sure, planted, GO IN,
  inside, the lot, the desk, a wall bought, 'It goes up tonight.', quiet; one face at a time with the map's voice).
- YOUR PLACE, PLANTED (gates/home_base_gate.js, D1 to D5 and D14's record re-aimed at the glass): upright 149/1, sideways 146/1. THE ONE
  RED IS NOT THIS BUILD'S: D22 SELLING IT is red on main cf958d37f too, the same line (measured in a clean worktree): the stall at his
  place reads 'They need it here: 1 more at this price' (its need card on), so the sale goes in as a hungry town's and a hungry town
  never asks where the sausage came from (engine/bohemia_grinder.js line 99, rule 469(c)); the leg's own town is now short of food.
  Ask row 787, HOME BASE's next round.
- The VOTE card home-base-your-place-is-easy-11-27 PLAYS THE FLOW: records/target/home_base/your_place_is_easy.mp4 (65 s, 0.77 MB,
  upright then sideways, a gold ring where each finger went), tools/bohemia_home_base_your_place_is_easy_card_11_27_26.js --only
  <profile> once each way.

## WHAT IS NOT DONE (the plan's next builds, in order)
A the spots MARKED ON THE MAP (stronger where better; scrap, food, whose streets, raid tracks, distance to towns and jobs; a tap on one
says what it gives and costs; his best man names his pick and why). D one number for a trip (the line no longer gives a straight-line
count, so the walk's own 'SETTING OUT: N BLOCKS' is the only number now). E is done here (PLANT HERE on arrival). F half done (GO IN by
one tap, 'tap an empty lot'); the empty lots breathing once is not. G the first desk short (three and MORE). H YOUR PLACE in the band
once planted (and the record's door).

[bb Battle Brothers says what a town has on the map itself and never makes you read a page for it; ours now says the next step by a
face where the thumb is, and the map's marks are next]
[analog horror: the face that tells you where to live is the same face that will tell you who died; it says it once, plainly, and goes]
