# HOME BASE, 11/10/26: WHAT YOU BUILD PAYS (BUILD 11/10n; VAMILY rule 443(f), rules 343, 441; EYES rows 549 and 553)

The coordinator's routine: what he can BUILD in his place and why it matters (rule 343: it changes because of him), each build whole
(its cost in batteries and goods, what it gives the company, how it looks standing there, who works it), the bosses' prizes standing
there, and EYES rows 549 and 553 if FIXES has not.

## MEASURED FIRST (main 0f4592d0, the demo, phone upright, a new game)
- ROW 549: 1,293 blocks grade as plantable; only 182 can be stood on (a suburb block is not walkable: the crew stands on the street);
  1,173 have ground he can stand on beside them. GO THERE pointed at blocks and parked him beside them for ever.
- ROW 553: already FIXED by FIXES (11/10k, the road says it is the road). Not touched.
- THE BUILDS (engine/bohemia_lotbuild.js, eight at 1 battery and 1 day): the garden, the tank, the pump and the shed each paid one
  'resources' a day, a purse currency no screen shows, while their lines said '+1 food/day', '+1 water/day', '+1 tape/day'; only the
  solar panel's battery reached the top bar; the stall's clout and the roof's family were the ledger's. Nothing cost goods. Nobody
  worked anything. The pieces stand, drawn from the pack (slices/settlement/lot/), small in the BUILD corner of the camp picture.

## WHAT CHANGED
- ROW 549 (slices/BOHEMIA_CITY_WORLD.html __WHAT_HE_BUILDS__): he plants the best block he stands on OR beside him (homeChoose: the
  block and its eight neighbours; a real settlement fronts its street); the phone says THE BLOCK <side>. BETTER / GO THERE search out to
  twelve for a plantable block with ground he can stand on beside it, and walk him to that street (homeWalkBeside), so it never parks
  him beside a block he can never take, and rarely points nowhere.
- EACH BUILD WHOLE at his place (records/target/bb/home_base.json builds, every number TUNING's):
  COST: lotbuild's one battery PLUS its goods out of the company's supplies (bohemia.supplies.v1, the top bar's counts): wall 2 tape,
  tank 2, shed 3, pump 3, garden 1, solar 4, stall 2, roof 4; a row short of its goods is greyed and says what it needs.
  GIVES, EACH MORNING IT STANDS, INTO THE SUPPLIES: tank, pump, garden +1 food (food and water are one count, rule 209), shed +1 tape;
  the solar's battery and the stall's clout stay lotbuild's; a feed post says what the place put by.
  WHO WORKS IT: each person who lives there, in the order they came, works the next standing build that makes something, and a worked
  build gives one more (a hand on the solar panel cleans it for a battery more, at the stall trades for food); the desk says who works
  what ('ROSA (GARDEN), THE ORTIZ FAMILY (TANK)') and what the place gives a day ('+4 food a day').
  A ROOF FINISHED BRINGS A FAMILY to live there (a resident, why 'roof', from a list of family names), who works the next build.
- THE BOSSES' PRIZES stand on the plan in gold and pay back a night on the bill (11/9d), as before.

## THE GATE: gates/home_base_gate.js (YOUR PLACE, PLANTED): engine 22/0, upright 64/0, sideways 62/0
Re-aimed: D3 (standing on a road beside good ground now plants that block: the fix, so the 'off' leg stands on ground with nothing
plantable on it or beside it). New: D12 (row 549) BETTER points at a street he can stand on beside a plantable block, and from there
PLANT HERE works; planted: the same test aimed at a plantable block he cannot stand on (the old target) is red. D13 the rows say their
battery, goods and gives; the garden's tape comes out of the supplies; with no tape every build is greyed; the morning puts food into the
supplies; a resident works one and it gives more; planted: the morning hook taken out gives nothing; a roof brings a family.

## SAID PLAINLY
- The pieces stand small in the BUILD corner of the camp picture (the pack's own sprites, LIFE+CITY's drawBuilt). Making a build read
  big where it stands is his place's own look, still owed (the cameras wait on his vote, or the plan made art, golden piece first).
- Found on the way, named for FIXES: a second tap where BUILD stood lands on the sheet's first row once the sheet is up (in the card's
  second picture my test's second tap put up a WALL). One tap is fine; an impatient double tap builds a wall.
- Not run this round: the whole suite; the pre-push pass is below.

## THE VOTE CARD
home-base-what-you-build-pays-11-10 (STAND-IN for the pieces' look): planting the block beside his street, the desk with each build's
battery, tape and gives and who works what, the top bar after two mornings (food 21 -> 29, tape 40 -> 29).

[bb Battle Brothers' town buildings cost crowns and sell you things; ours cost tape and give you food, and the people who live there work them.]
[analog horror: the garden comes up whether anyone eats it; the family under the new roof waters it at night.]
