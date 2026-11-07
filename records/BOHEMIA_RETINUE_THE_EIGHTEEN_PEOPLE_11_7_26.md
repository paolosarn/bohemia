# RETINUE -- THE EIGHTEEN PEOPLE, MET IN TOWN, BY YOUR FIRE (11/7/26)

Rule 425(c) (Paolo 11/7: 'more of the jobs I've been asking you for months... I'm just concerned you don't have it all
recorded'), ask line 206 (Paolo 10/26: 'do research on all the people in Battle Brothers who can join your camp and what
they do to help you, the basic camp support, the retinue support'), rules 151(d), 270, 56. BUILD 11/7r - THE RETINUE:
EIGHTEEN PEOPLE, MET IN TOWN. BUILT, NOT YET SEEN (rule 179). Gate: gates/the_retinue_gate.js (in the suite as THE RETINUE).

## What he gets (the demo, his phone)

- **In every town's hall**, under the men for hire, three of the eighteen stand as people: their own face (PORTRAIT's
  fresh head of their own look), their name and what they are, what they do on one line, and a 44 px TAKE ON button with
  the price, the hall's own row (rule 402 amended: a row a person, never a half-screen card). A tap on a face or a name
  opens the rest of them in place: their whole body (the same person, one to one), who they were before the dollar died,
  and their own words, said out of their mouth. The same three all week at that town, new ones the next week, every town
  its own hand (Battle Brothers' posts change the same way).
- **No name, no place by the fire.** With no CLOUT every TAKE ON is shut (Battle Brothers' five slots at 250, 750, 1,400,
  2,250 and 3,350 renown). With a place, a tap takes them on: their price once, never a wage (rule 56), the map told
  (campSync), the line heard ('Earl takes the high spot. Nothing gets close without him saying so.').
- **At the camp** each follower with you stands by his own piece as himself, turned to the fire (the cook at her pot,
  the scavenger by her bags, the blacksmith at his anvil). A tap on one opens WHO TRAVELS WITH YOU: all eighteen as tiles,
  each his face, what he is and his own 44 px button (the price, LET GO when he is with you, NOT YET when his work waits on
  another screen), the ones with you first and gold-edged; the one tapped is picked and his line stands under the tiles
  ('MET IN CHURCH' when he was met in a town). One glass upright and on its side (the first try, a row each, ran 167 px over
  upright and 415 on its side; measured with the cut's own fitter).
- **One id, one whole person**: a follower with you is dealt to nobody's street (the town crowds never wear his face).

## The eighteen (records/target/bb/retinue.json, a modder's file)

| | who | was | does | live? |
|---|---|---|---|---|
| Cook | Graciela Ochoa | twenty-two years on a Fremont Street buffet's night line | food x0.85, +1 hp an hour | yes |
| Scout | Danny Nguyen | a cab driver, nineteen years | a block costs 15% less time | yes |
| Lookout | Earl Pruitt | a casino's eye in the sky, forty screens | +1 block down a street, x1.25 open, camp warned 2 sooner | yes |
| Paymaster | Hector Salas | counted a downtown casino's cage | wages x0.85, every other follower 15% off | yes |
| Blacksmith | Walt Hensley | a body shop on Boulder Highway | mending x1.2, tape x0.8 | yes |
| Surgeon | Alan Cho | an ER doctor at the county hospital | a fresh wound a day shorter | yes |
| Agent | Ines Baptiste | a temp agency's phone bank | every town's jobs from anywhere | SHUT: RUN TWO and UI TWO |
| Alchemist | Felix Amari | an all-night Strip pharmacist | a quarter of crafts free | SHUT: no crafting |
| Bounty Hunter | Marcus Bell | a bail bondsman's skip tracer | more champions, 30-75 a head | SHUT: WORLD and COMBAT |
| Brigand | Rusty Kogan | sold what he heard on a police scanner | caravans on your map | SHUT: RUN |
| Cartographer | Ken Takeda | a transit planner with the bus maps | 10-40 for a place found | SHUT: RUN (the map that fills in) |
| Drill Sergeant | Darnell Price | a high-school football coach | XP x1.2, 0.02 less a level | yes |
| Minstrel | Chuy Morales | a wedding DJ with one speaker left | renown x1.15 | yes |
| Negotiator | Gary Lund | sold cars on Boulder Highway | a good word fades x0.85, a grudge mends x1.15 | **yes, NEW this round** |
| Quartermaster | Tony Arce | a warehouse night manager | +50 tape, +50 meds, +100 rounds room | SHUT: ECONOMY (no caps yet) |
| Recruiter | Yolanda Reyes | a casino floor manager | hire x0.9, 2-4 more at every post | yes |
| Scavenger | Dot Kowalski | walks the field after, a bag in each hand | tape off broken armour, rounds back | yes |
| Trader | Memo Gallardo | the swap meet's king | one more trade good where made | SHUT: ECONOMY (rule 425(b) is building trade goods now) |

Eleven of eighteen work (ten before this round; the Negotiator opened). Each look is a person of the valley
(engine/bohemia_people_mix.js) with the five faces (rest, A, E, O, M) and a body in eight turns, none of the company's
eleven, no two alike; the four women of the mix are the cook, the agent, the recruiter and the scavenger.

## THE FINDING THAT PROVED US WRONG (measured, the round's first)

The town's hall has offered **CAMP STAFF** since 10/1 ('Take the cook on, 200 batteries, once'), from
engine/bohemia_followers.js. On the live map it took the 200 and **nobody joined**: the screen posted act 'hire', which only
the retired loop page (slices/BOHEMIA_LOOP.html) reads, and the map hands the screen `hired:{}` on every visit, so the same
cook was offered again next time and the map's batteries were synced down. Two gates held that broken path as green
(settlement_screen_gate 'the hall hires the one who asked' counted a local flag; the_hire_price_is_the_formula_gate's
staff leg checked the button against the debit). Both are re-aimed in this commit to the real retinue: he is in
BohemiaCamp's retinue and the map's campSync, his price taken once.

## The data line (MODS)

- records/target/bb/retinue.json: eighteen rows, every field described in the file (`fields`), `met_per_place` (3).
- engine/bohemia_camp.js keeps the same rows as its starting copy between `__RETINUE_ROWS__` marks
  (`node tools/bohemia_retinue_bake.js` writes it, `--check` compares) and reads the file again at load, so a modder's
  edit is the game's after a reload. Proven by R4: every row renamed and 77 dearer in a served file, and the town's cards
  said so.
- LIVE, MORE, NUMS, WORD and READY are built from the rows (the shapes the map, the hall, the spoils and the renown already
  read); BohemiaCamp.row, rows, price, inTown, meet, looks are new.

## Measured

- THE RETINUE gate 29/0 (R1 to R9 plus planted controls; R9 drives the baked demo: Church's hall, a real tap, the map's own
  retinue and batteries); `--plant` (every face nobody's) exits 1 with R5 and R6 red.
- On the demo (390 x 844, BUILD 11/7r): the hall at Mob, Remnants, Caravans and Anarchists showed three each with fresh
  faces; the hall sheet fits one glass (over 0 px at the densest step; it was 33 px over with the first, taller rows, fixed
  by the dense steps); a real tap on Earl took 250 and the map's CT_FOLLOWERS read lookout; Graciela 200, the same.
- Re-aimed: settlement_screen_gate 75/0 on the merged tree; the hire price gate 10/0; ECONOMY's trade goods carried 26/0.
- The camp gate's C4 (a real tap takes the scout on at camp) passes on this build. Reds on main as well as here, not this
  lane's: the camp gate C2 C5 C6 C7, money teaches 'the money ran', one company O3, no two people alike (the crew screen),
  the roster's contrast legs, the camp is his own K7 (the compass). The rare man at the post failed once under a doubled
  load and passed alone (10/0).

## What is not done

- The seven shut followers each wait on another lane's system (named in the file's `shut`): the agent's town card, the
  crafting the alchemist needs, the champions and their heads, the caravans out of sight, the map that fills in, the
  counts' caps, the trade goods. The hook for each: read `BohemiaCamp.has(id)` / `mult` / `plus` with his number, then
  set his row's `shut` to null and `reads` to your screen.
- PORTRAIT: the four women's faces (person_woman_0..3) have no wound patches (records/target/portrait/wounds/<look>.json
  404s once, quietly); the men's do.
- The followers stand still at camp (their standing render); ANIMATION's camp acts would give each his work (the cook
  stirring, the smith hammering).
- Battle Brothers' unlock conditions for some followers (not every one is for hire from the start) are not modelled; every
  working follower can be met from the first town.

[bb Battle Brothers: the retinue is hired in a town from the Retinue screen, five places opened by renown, each follower a
one-time price and one lasting effect outside the fight; ours keeps all of that and puts a person with a face behind it.]
[analog horror: Earl's dark screens still show him something some nights; Rusty's scanner still talks when nobody is left
to be talking; Dot does not look at the faces.]
