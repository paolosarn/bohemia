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

## BUILD 11/28b - THE BEST SPOT ON THE MAP (plan A, rule 492(b): 'the map shows where a place can go... the better spots read at
## a glance... his crew's best man says which one he would pick and why'). VOTE card home-base-the-best-spot-on-the-map-11-28 (a clip).
- WHAT: when he looks for ground, up to six of the best plantable blocks within twelve get a mark ON THE MAP (a tin plate on a pole
  standing on the block, one to three gold bars by how good it is against the others); his best man's face stands on the one he would
  pick (BETTER's own block, the same function). A real tap on a mark: the panel says what it gives in a few words ('Water and a road.',
  'Raiders near.', 'Quiet.'), its four marks are that block's, WALK THERE walks there; on his pick: 'That one. Water and a road. Quiet.'
- NEVER CROWDED, NEVER HIDDEN: two marks never within two blocks; on the glass a mark within a thumb (50 x 58 px) of a better one steps
  back (zoomed out the blocks are a few pixels) and comes back when he zooms in; a mark never stands under the panel, the phone or the top
  bar; his pick is never under the panel: when it would be, the panel goes to the far side of the glass (sideways) or below or above the
  pick (upright), for as long as he looks. Measured first: sideways the panel beside the phone stood over the middle of the map, where he
  and his pick are (A3 red sideways before the move).
- WHERE IT LIVES: engine/bohemia_home.js spots(list, n) and gives(g) (pure; best() is now spots()'s first, one ranking for BETTER and
  the marks); home_base.json flow.lines.pick / spot and flow.gives (draft); the map's __HOME_BASE__ block: homeCandidates(x, y) (the one
  measured list, BETTER and the spots both read it, cached while he stands on the block: 17 to 21 ms a new block), homeSpots(),
  homeScreenOf(x, y) (the map's own btwAt: its iso and the offset its last frame drew at; null on the street), homeGo([x, y]);
  slices/bohemia_your_place.js the marks (#ypmarks, placed each frame they are up) and avoidPick. No new block or hook in the page.
- WHAT IS NOT IN IT YET (realism first, rule 492(b)'s full list, the next small build): scrap and food near a block, whose streets
  they are (the turf), how often raiders pass (the parties' tracks), how far the towns and the jobs are. The marks rank by the four the
  grade already measures (water, power, a road, danger).
- PROOF: YOUR PLACE IS EASY 24/0 upright and 24/0 sideways (engine 9/0: A1, A2, P3; demo A3, A4, P4 added); YOUR PLACE, PLANTED (BETTER
  now through spots) re-run, see the commit; PATCH LAYERS 10/0.

## BUILD 11/28d - THE WAY BACK TO YOUR PLACE (plan H; the stranger's moment 12: the way back was three taps, none of them said).
VOTE card home-base-the-way-back-11-28 (a clip: --card the-way-back).
- WHAT: once planted and the first build booked, whenever he is on the map more than a block from his place, one YOUR PLACE button (48 px,
  gold, a little flag, no face and no words: nothing to read) beside the phone; a tap walks his crew home by the map's own door (travelTo
  his block, townTap opens it) and his place opens. At his door it is not there (the map's own tap on his place opens it).
- FOUND AND FIXED ON THE WAY: 'It goes up tonight.' was said the first time he came in after a build booked from outside (the clip's set
  up showed it). Now it is said only after the first build booked on that same visit (entryBooked at the door), once.
- WHERE: engine step() 'home' (c.away from the map's homeFlowFacts, more than one block from the planted block); the module's isPill()
  (a step with no words and one button stands alone beside the phone: LATER's YOUR PLACE and this one); home_base.json flow.buttons.home.
  The phone's record page still has no door after planting (the band is UI FIVE's phone; asked of nobody this round).
- PROOF: YOUR PLACE IS EASY 26/0 upright and 26/0 sideways (H1 engine, H2 on the demo: quiet at his door, the button away, a tap home,
  nothing said again inside).

## WHAT IS NOT DONE (the plan's next builds, in order)
A2 the rest of what a spot gives (scrap, food, whose streets, raid tracks, distance to towns and jobs) on the marks and in the words. D one number for a trip (the line no longer gives a straight-line
count, so the walk's own 'SETTING OUT: N BLOCKS' is the only number now). E is done here (PLANT HERE on arrival). F half done (GO IN by
one tap, 'tap an empty lot'); the empty lots breathing once is not. G the first desk short (three and MORE). H YOUR PLACE in the band
once planted (and the record's door).

[bb Battle Brothers says what a town has on the map itself and never makes you read a page for it; ours now says the next step by a
face where the thumb is, and the map's marks are next]
[analog horror: the face that tells you where to live is the same face that will tell you who died; it says it once, plainly, and goes]
