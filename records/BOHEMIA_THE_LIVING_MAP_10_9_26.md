# THE LIVING MAP: NOBODY STANDS ON ANYBODY, PRINTS FADE BY THE HOUR, THE GATE FILLS ON MARKET DAY
# LIFE + CITY, 10/9/26, row [the living map] (rule 78's jump list, top row)

## 1. MEASURED FIRST (the real valley, overmap 12345, his 14 seats)
- WORLD's parties already have purpose: **28 out** (14 patrols, 10 caravans, 4 crews), each sent by a seat
  with an agenda, and **all 28 move inside a day**. That half of the row was done.
- **In 58 of the day's 90 steps two or more parties stood on one cell: 99 stacks, up to three deep.**
  Caravans walking toward each other on one line; two patrols of one seat sharing a border. NOBODY STANDS ON
  ANYBODY (first votes 9/21) was broken on the map.
- The tracks ([tracks read], 9/12) were derived from the leg a party is on and **never faded**: they
  vanished the moment a party turned round and never aged while it walked.
- Market day is RUN TWO's trait (records/target/settlement_traits.json), rolled on the settlement screen
  per place by name and week. **The map did not know a market was on.**

## 2. BUILT: engine/bohemia_livingmap.js
- **step()** calls WORLD's advance one step and then settles who stands where: arrivals keep the cell they
  were sent to; anybody else whose cell is taken waits, or takes the free neighbour nearest its goal.
  Towns (a seat and the blocks round it) are exempt: a town holds everybody it sends and everybody who comes.
- **prints**: one per step off a town, with the hour it was made; full that hour, half at twelve, gone
  and pruned at **PRINT_HOURS = 24** (mine, draft, tuned:false -> TUNING; Battle Brothers says "fading
  with time" and gives no number, library 01_WORLDMAP). Transient and never saved (bounded, ~2,500 a day).
- **the clock stops them** (68a): zero hours moves nobody and ages nothing.
- **crowdAt()**: the tier's own business at the gate (BohemiaTowns.REACH: camp 1, town 2, fortress 3),
  swelled on market day and thinned by a raid or sickness by the trait's own **stock_mult**, the same
  number that fills the stalls; who is at the gate is what is on the shelves. Order-proof.
- **the roll is the settlement screen's own** (seedOf, rng, rollTraits, line for line).

## 3. ON THE MAP (slices/BOHEMIA_CITY_WORLD.html, tools/bohemia_city_livingmap_patch.py, idempotent)
1. module inlined after WORLD's parties module; 2. partiesAdvance's whole steps go through it (RUN's
carried fraction untouched; WORLD's step if the module is missing); 3. the [tracks read] drawing draws the
prints, fading by the hour, in the faction's own ink; 4. every home base draws its gate crowd (the cast,
each on its own beat); 5. **the settlement screen is handed the traits the map shows** through its own
`traits` seam (RUN TWO's design): the market he saw at the gate is the market he walks into. RUN TWO's
page is untouched. (Its own day counter, S.day, only counts scavenges; without this the map's day and
the screen's would disagree.)

## 4. THE GATE: gates/the_living_map_gate.js, suite THE LIVING MAP, 22/0
Real valley, 72 hours: every party moves every day, **0 hours end with two on one cell**; the clock
stopped moves nobody; prints 1 / 0.5 / 0 and pruned; **18,000 rolls of market day, the settlement
screen's own code lifted from its page beside ours, 0 differ** (5,537 market days); market day 2 -> 5 at a
town, raided 2 -> 1; order-proof over every pair at every tier; the page carries the module byte for byte
and calls it. MUTATION: WORLD's step alone stacks parties in 40 of 90 steps.

## 5. ON THE REAL ALPHA, driven by the phone driver
Map up by the pinch, one stop in (czoom 1.25): 16 game hours, **28 moved, 0 hours stacked, 1,214
prints**, 236 drawn on screen, 8 gate crowds drawn, 0 page errors.

## 6. THE COOK: A DAY ON THE MAP IN TWENTY SECONDS (VOTE tab)
slices/vote/LIFECITY_A_DAY_ON_THE_MAP_10_9.gif: the alpha's own canvas, a game half-hour a frame from
06:00 to 21:30, 32 frames, 19.8 s; the strip under each frame is the clock the game reported, the prints
drawn (0 -> 648) and the gates on market day (4). Recorder tools/bohemia_a_day_on_the_map_reel.js (refuses
if any frame stacks), stitcher tools/bohemia_a_day_on_the_map_reel.py. Frames are regenerated, not kept.

## 7. NOT MINE, FOUND ON THE WAY (identical on a clean main)
- faction_towns_gate and parties_move_gate throw on a missing '#daycardIn .dcgo' (the day card moved).
- inlined_fresh_gate: the resync tool refuses on engine/bohemia_followers.js's banner (its closing banner
  missing in the page).
