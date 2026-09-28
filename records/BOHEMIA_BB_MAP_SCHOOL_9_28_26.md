# THE MAP IS HOW YOU TRAVEL: THE SCHOOL, AND THE FIRST CUT (RUN, 9/28/26)

VAMILY `[bb map]` (rule 33, CLAIMED 9/28 run-eak241) with `[no city walk]` folded in
as its first deliverable (rule 38b). Library read first (rule 33j):
`reference/library/battle_brothers/01_WORLDMAP.md` (TRAVEL, TIME AND COST, TRACKS,
SCOUTING) and `10_UI_AND_FEEL.md` (THE MAP HUD, THE FEEL).

> **PAOLO 9/24:** *"the valley is crossed on a map the Battle Brothers way: a party
> marker, tap where to go, time passes, roads faster than dirt."*
> **PAOLO 9/28 (rule 38):** *"your character moving tile to tile throughout the city,
> it's not gonna be like that anymore, that has to change immediately."*

## 1. HOW BATTLE BROTHERS' MAP WORKS ON A MOUSE (volume 01, recall-tagged there)

- ONE marker for the whole company. Click a point or a settlement; the company walks
  there in real time, pausable, with a 2x speed. Right-click cancels (volume 10).
- Speed by terrain: roads fastest, then plains, forest and hills slower, swamp
  slowest; mountains impassable. Night slows travel and shortens sight.
- A day passes as you travel, and every day costs: wages, food, tools, medicine.
  The clock is the price of distance. That is the whole economy of the map.
- Parties with their own business (patrols, caravans, raiders) move whether you look
  or not, leave tracks by kind, and are named by size when in sight.
- Arrival at a settlement opens the SETTLEMENT SCREEN (volume 10): the town as one
  painted view, buildings as things you click. Never a walked street.

## 2. WHAT BREAKS ON A THUMB

| On a mouse | On a phone | What we do |
|---|---|---|
| hover names a party | there is no hover | the name rides the tracks line under him when he crosses them (already built by WORLD, `tracksHere`) |
| right-click cancels | there is no right-click | **a second tap stops the journey** |
| click a pixel-exact point | a thumb is ~44 px wide | **a tap on a roof snaps to the nearest block he could stand on, within two blocks**; past that it says "No road that way." |
| 2x speed button | one more button on a 390 px screen | not built: the route is walked on the 120 BPM beat, about 2 blocks a second, which already crosses 27 blocks in 13.5 s |
| long travel is fine at a desk | **dead time is a put-down on a phone** | **the road fills it**: every travelled block hands the road director its minutes, and a road party met him 5 s into the first journey measured |

## 3. WHAT WE ALREADY HAD, MEASURED ON THE GLASS BEFORE ANYTHING WAS WRITTEN

The row names nine things. **Seven already existed on the far view**, which is why
the build is small and why it reuses instead of rebuilding (REUSE-FIRST):

| The row's thing | On the far view before this round |
|---|---|
| one party marker | **yes**: a pin drawn last so nothing covers him |
| tap a place, the party travels | **NO**: a tap selected a builder plot (`CB.sel` [27,35]); the demo strips the builder, so the tap answered nothing. He moved 0 cells. |
| the clock runs while travelling | **half**: each pad press cost a typed 10 minutes |
| roads faster than dirt | **NO** on the map (flat 10); **yes** on the street since 9/5 (`PAVED_SPEED.factor` 0.5) |
| other groups on the map | **yes**: 28 parties (14 patrols, 10 caravans, 4 crews), 3 within 14 blocks |
| tracks | **yes**: fading trails, brightest at the head |
| places | **yes**: town rings |
| the phone on the map only (rule 32c) | **yes**: the drawn phone, 132 x 286 |
| arrival | the seam landed him on the block's street. **Rule 37b killed that**: arrival is a settlement screen |

## 4. WHAT SHIPPED THIS ROUND

1. **A tap on the map is where you are going.** The route is found over the blocks he
   could stand on, using only the eight moves the pad has, and walked on the beat
   through the same step function a press uses, so every block pays its clock, fires
   the road and moves the valley's parties. Measured: 27 blocks, 13.5 s, arrived.
2. **Roads faster than dirt, from the street's own numbers.** A block of the map is
   FN = 128 street cells; rough going is 128 x 0.084 = **10.75 min**, a road is half
   that, **5.38 min**. Freeway, arterial, strip, beltway and interchange are road;
   rail and dry wash are rough. The old typed 10 was almost exactly the rough number,
   which is why nobody noticed the road was not cheaper.
3. **The route is drawn ahead of him and shortens as he walks** (rule 33g: BB draws a
   still line; ours is the live remainder). A dot per block, a thin ring at the end,
   under the pin, thin not filled (THE FIGHT VERDICT round 12's rim rule).
4. **A fight ends the journey at the one door every fight comes through.** Found on the
   glass: the first journey met a road party (a dead casino security bot) 5 s in, and
   the route was still set under the fight, so the marker would have kept walking
   away from the fight he was in.
5. **THE DEMO OPENS ON THE MAP** (rule 38c). The walk pad and DROP IN are stripped from
   the demo; a spread on the demo's map stops at the closest zoom instead of dropping
   him onto a walked street. The alpha keeps the street until `[no city walk]`
   excavates it (rule 18g).

## 5. THE FIRST FIGHT, FINALLY

The oldest line on THE STRANGER'S LIST is "STILL NO FIGHT IN FIVE MINUTES". The
first journey measured on the demo **met a fight five seconds after the tap**. That is
LOADING, TRAVEL, THE FIGHT, three of rule 38c's five, in the order he named.

## 6. WHAT IS NOT BUILT, SAID PLAINLY

- **ARRIVAL IS A LINE, NOT A PLACE.** Rule 37b makes arrival the settlement screen;
  that is `[settlement screen]`, the next row of this lane. Until it lands a journey
  ends with "Arrived: N blocks crossed." and the map.
- **THE FIRST PERSON** stood at his door on the street. With no street in the demo, the
  person has to be in the settlement screen. Named, not built.
- **The companion is not on the marker yet.** One pin, him.
- **The map's pixel count** (rule 38a) is DIRECTION `[bb density]`'s number; this cut
  draws the same map at the same density it had.
- **Night does not slow travel yet**; volume 01 says it should. Numbers go to TUNING.

## 7. WHAT MOVES HERE THAT BB'S PICTURE DOES NOT (rule 33g)

BB's map is a painting with a token sliding on it. Here: the route is a live
remainder that eats itself block by block; the tracks fade along their length so the
bright end is where a party IS; the road can stop you with a body that walks up and
starts a fight on the tile you were crossing; and the clock you spend is the same
clock the valley's own parties spend, so the world you arrive at moved while you
walked. Under the bible, the next thing to move is the settlement screen: lights,
people, weather, a place that is alive when you get there.
