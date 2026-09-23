# THE THREE ACTS AT ONCE: SCHOOL, ROUND ONE
# DYNASTY lane, board row [three at once] / THE-THREE-ACTS-AT-ONCE-SCHOOL-ROUND-ONE
# 9/23/26 · MODE: SCHOOL (record, no code) · rule 31, Paolo 9/23
#
# "Play all three at the same time and flip through them... see the progress in the
#  future from your past action... the city is built like shit because you're not
#  making enough of an impact in your earlier act... I think this is what the game
#  needed."
#
# Round zero is the coordinator's first swing (records/BOHEMIA_DYNASTY_SCHOOL_THE_
# THREE_ACTS_AT_ONCE_ROUND_ZERO_9_23_26.md). The row says start from it and CORRECT
# it. This round corrects four things in it, prices the cost on the real surface,
# closes its four holes, and brings the half it was missing: the real world.
#
# ONLY OCARINA OF TIME IS A REFERENCE (his name, this lane only, rule 31). Every
# other game below is RESEARCH, the way WORDS and EYES run a school round. Nothing
# here adds a reference game to any department.

================================================================================
## 0. THE HEADLINE, MEASURED, AND IT REVERSES ROUND ZERO'S BIGGEST RULE
================================================================================
Round zero's rule 6 says: "THE COST IS REAL. Every flippable era is a whole map
kept alive. Dishonored built one level... Our valley is 9,216 cells, three times.
That is the first thing DYNASTY's school must price with PLUMBER."

Priced, on the alpha, through the one driver:

    the whole valley as data .................... 820,025 bytes
    the number it is all rebuilt from ........... 10 digits  (seed 2691674296)
    the player's own changes to it (EDITS) ...... 3 entries, 29 bytes
    rebuilding the entire 96 x 96 valley ........ 44, 54, 64 ms   (three seeds)
    the same, on the phone profile (4x CPU) ..... 170, 214, 239 ms
    a beat at 120 BPM ........................... 500 ms

**THE WHOLE VALLEY COMES BACK FROM ONE NUMBER IN LESS THAN ONE BEAT, ON A PHONE.**

So the cost round zero feared is not our cost. Dishonored built ONE two-era level
because their eras were HAND-BUILT LEVELS; every era was an art budget. Ours is a
function of a seed. We do not keep three valleys alive. We keep one seed, three
small ledgers, and one valley in memory: the one he is looking at.

And the save box is not close to full either, measured rather than quoted:

    everything the game saves on the phone today ... 46,601 bytes, 13 keys
    what the box actually accepted before refusing .. 5,177,344 bytes
    headroom ....................................... 111x
    three acts at today's size ..................... 139,803 bytes = 2.7% of the box

THE COST IS REAL, IT IS JUST SOMEWHERE ELSE, AND ROUND ZERO POINTED AT THE WRONG
THING. It is not bytes. It is (a) the seconds the rest of the boot takes after the
overmap (RUN measured 113.7 s of work behind the loading screen on a 4x CPU: the
overmap is 0.2 s of that, so the school question is WHICH OF THAT 113 s IS PER-ACT
and which is shared), and (b) the player, which is section 5.

================================================================================
## 1. THE PERMANENT FRAMEWORK, AND WE ALREADY BUILT IT BY ACCIDENT
================================================================================
The single most useful thing in this round, and it comes from the real world
rather than from a game.

REAL WORLD. Cities are path-dependent and the persistence is measured, not
folklore. Street-network design of construction from 2000-2013 still correlates
with the road stock that was there in 1975; relative sprawl rankings between
cities barely move across decades; Roman grids and 20th-century American grids
persist for the same reason (a grid jointly optimises access and sellable land);
Broadway runs diagonally across Manhattan's grid because it follows the
Wickquasgeck Trail, a footpath that predates the Dutch. WHAT PERSISTS ACROSS A
CENTURY IS NOT BUILDINGS. IT IS LINES: streets, parcels, easements, the utility
corridors, who owns what.

OUR REPO, MEASURED, AND IT ALREADY HAS THAT SPLIT:

    om.layout   the skeleton .......... 4,459 bytes
                (the freeway, the arterials, the Strip, the reservoirs, the water
                 treatment, the pump station, the jail, the courthouse, the city
                 hall, the radio station, the data fort, the quarry, the springs)
    om.tiles    the 9,216 filled cells .. 815,376 bytes
    fixed by the skeleton .............. 5,542 of 9,216 cells  (60%)
    procedural fill .................... 40%
    same seed, same valley, every time .. true

**THE VALLEY'S PERMANENT FRAMEWORK IS 4.5 KB.** It was split out as its own
function (`layoutFromSeed` / `skeleton`) long before anybody said the word
"three acts", for map reasons, and it is exactly the line the real research draws.

THE DESIGN THIS POINTS AT, for round two: THE THREE ACTS SHARE ONE LAYOUT AND
RE-DERIVE THEIR OWN FILL. Act 3's Las Vegas is the same freeway, the same
arterials, the same reservoir, the same courthouse; what stands on the lots is
different. That is what a real city does across thirty years, and it is what our
code already does across two function calls.

================================================================================
## 2. THREE CORRECTIONS TO ROUND ZERO'S GAMES SECTION
================================================================================

**(a) DARK CHRONICLE'S LESSON IS ABOUT PEOPLE, NOT ABOUT A REPORT CARD.**
Round zero drew "the future is a report card you can walk in". Checked: you zip
back and forth at will through Time Gates, and the restoration requirements are
not only buildings. Recruiting a GARDENER and placing him in the past is what
makes a particular tree spirit exist a hundred years on. THE FUTURE'S CONTENTS
ARE KEYED TO WHO YOU PUT IN THE PAST. That matters more to us than any of it,
because our ledger is already people: who lived, who owed, who vouched, who held
a block. We do not need to invent the derive's inputs. We have them.

**(b) THE FLIP IS A PLACE MORE OFTEN THAN ROUND ZERO SAYS.** Round zero's rule 1
("in the hand when it is fun, a walk when the designers needed to slow you") is
soft. Sorted by world size, the pattern is sharper and it is a warning:

    Day of the Tentacle   button flip, three eras at once ...... ONE MANSION
    Titanfall 2           button flip, mid-fight ............... ONE LEVEL
    Dishonored 2          hand device, a live window ........... ONE LEVEL
    Oracle of Ages        item flip, anywhere .................. one Zelda map
    Ocarina of Time       a place (the pedestal) ............... one map, two ages
    Dark Chronicle        a place (Time Gates), big world ...... the future is
                                                                 areas to restore
    Chrono Trigger        no flip at all, gates and travel ..... many big eras

THE FREE BUTTON FLIP HAS ONLY EVER SHIPPED IN SMALL, PUZZLE-SHAPED ERAS. Every
time the world got big, the flip became a place, or went away.

**(c) ROUND ZERO ROUTED A HOLE TO A RECORD PAOLO VOIDED.** Its hole 3 asks "what
does the Animal (act 1) DO that seeds a city?" and points at DYNASTY Q1, "what
you can do with no hands". Paolo corrected that on 9/7 and this lane's own board
carries the correction: Animal / Human / Angel are ERAS (the anarchy decade, the
world clawing back, the cyberpunk healing), NEVER CREATURES, and "what you can do
with no hands is void for the player". Q1 cannot answer hole 3. Answered properly
in section 4.

================================================================================
## 3. THE FINDING THAT PROVES US WRONG (rule 6 asks for one; this is it)
================================================================================
**NOBODY HAS SHIPPED WHAT HE JUST ASKED FOR, AND THE REASON IS NOT TECHNICAL.**

Put section 2(b) beside section 0. The memory objection is dead: we can hold three
eras for 2.7% of a phone's save box and rebuild any of them inside a beat. But no
shipped game gives a player three LARGE, SIMULTANEOUSLY OPEN, LIVED-IN eras, and
the reason is not that nobody could afford the RAM. Day of the Tentacle kept three
eras open by making each one a single room's worth of puzzle. Dark Chronicle kept
a big world by making the future a place you go to CHECK, not a life you lead.

THE REAL WORLD SAYS WHY. Switch cost is measured and it behaves badly for exactly
our case: it scales with how DISSIMILAR the two tasks are, it is higher when you
switch INTO the more demanding one, and practice does not make it cheaper -- it
only lowers how deeply you attend. Our three acts are maximally dissimilar ON
PURPOSE (the verbs change between them; that is the whole point of three eras).
So our flip is the most expensive kind of switch there is, and it will not get
cheaper the longer he plays.

**SO THE RISK IN RULE 31 IS NOT THE MACHINE, IT IS THREE SETS OF OBLIGATIONS.**
A hundred hours with rent due, a debt clock and a block to hold, times three, all
live, is three jobs. That is the thing to design against, and it is the one thing
round zero does not mention anywhere.

WHAT THE RESEARCH SAYS TO DO ABOUT IT, and it is not "fewer eras":
- The switch literature's own named cost is "remembering where you got to in the
  task you are returning to." SO THE FLIP MUST RESUME, NEVER RESTART: he comes
  back standing where he stood, mid-sentence, with the same thing owed.
- Day of the Tentacle's answer to three-at-once is THREE SHORT LISTS, one per era,
  always visible. Three lives is unholdable; three next-things is easy. Our phone
  already scrolls a feed (Paolo 9/4) and already holds the bookkeeping (rule 19a).
- A default for round two, his to knock down: ALL THREE ARE PLAYABLE, BUT ONE AT A
  TIME CARRIES THE LIVE CLOCK. He can walk and change any act; the thing that is
  counting down against him is in the act he is standing in. That keeps his
  sentence exactly and refuses to hand him three jobs.

================================================================================
## 4. THE FOUR HOLES, CLOSED
================================================================================

### HOLE 1: WHAT IS THE FLOOR OF A DO-NOTHING FUTURE?
Round zero answers from Dark Chronicle. The real world answers better, and it
answers in our own systems' language.

DETROIT, MEASURED: by 2012, 40 of 139 square miles were vacant -- a third of the
city's land. Around 100,000 vacant lots, with nearly 20,000 more properties
demolished between 2014 and 2020. And the city's response is the part that matters
to us: PLANNED SHRINKAGE. Concentrate services on the neighbourhoods that still
work, let services to the failing ones wind down, pull the footprint in, so the
infrastructure bill matches the people left. Downtown works. Corktown and Midtown
build. Everything between is lots and green.

**SO A DO-NOTHING ACT 3 IS NOT AN EMPTY MAP AND NOT A PUNISHMENT SCREEN. IT IS:**
the same streets and the same lot lines (section 1), a third of the lots bare,
green where houses were, the power pulled back to the corridors that still pay,
a small live core, and people living in all of it. Every one of those is a thing
our engine already draws: the layout is the streets, CLUSTERED POWER is already
the law that decides which corridors are lit, and the grid already answers dark
or live per cell.

THE FLOOR WRITES ITSELF OUT OF WHAT WE HAVE, AND IT IS A PLACE WITH JOBS IN IT.
And it is the tutorial Paolo asked for: the ruin is what teaches him that act 1
matters.

### HOLE 2: DOES TIME RUN IN AN ACT HE IS NOT IN?
Research: frozen, everywhere. Day of the Tentacle frozen. Ocarina frozen. Nobody
runs a second era in the background, and none of those games had a bill to pay.

WE DO, AND THAT IS THE WHOLE DIFFERENCE. Bohemia has rent, a debt clock and a
valley running out of goods. If an unattended act keeps ticking, he is losing a
life he cannot see. If it ticks only when he is away, leaving is a punishment and
he will stop flipping. If it never ticks, LEAVING THE ERA IS HOW YOU DODGE RENT,
and that is an exploit that eats the economy.

THE ANSWER THE RESEARCH AND OUR OWN LAWS AGREE ON: **EACH ACT KEEPS ITS OWN
CLOCK AND EVERY CLOCK IS FROZEN EXCEPT THE ONE HE IS STANDING IN.** The flip is
not a time machine for the bill. And the dodge closes itself, because rent in an
act is owed against that act's clock, so no amount of flipping advances it. What
makes act 3 CHANGE is not time passing in act 3. It is act 1's ledger changing.
That is his own sentence: the future moves because of what you did, not because
you waited.

### HOLE 3: WHAT DOES ACT 1 DO THAT SEEDS A CITY?
(Round zero's route is void; see 2(c). Answering from the eras as Paolo defined
them on 9/7 and from what the repo already records.)

ACT 1 IS THE ANARCHY DECADE. What a person does in a collapse that a city still
carries thirty years later is not heroism, it is the four things a shrinking city
keeps records of: WHO GOT THE POWER BACK ON, WHO HELD A BLOCK, WHO IS OWED, AND
WHAT GOT BUILT OR BURNED. Every one already exists as a ledger in this repo:

    the deed ledger and standing ..... who did what, and who still says so
    territory (turf) ................. who held which block
    the purse and the debt ........... who is owed
    the builds and the grid .......... what stands, and what is lit

Those four ARE the seed of act 3's city, and they need no new system to be
written. THE FOLD ALREADY NAMED THEM: engine/bohemia_fold.js composes the two
folds this repo turned out to have (the engine's ledger fold -- standings,
territory, builds, capacity, invest, karma, family -- and the city's memory fold,
which keeps only the deeds somebody RETOLD). Rule 31's derive is that same field
list run ON EVERY FLIP instead of once at a handoff. That is round two's row
[the derive] and it starts from a list that is already written down.

### HOLE 4: THREE LEDGERS, ONE SAVE
Not a storage problem: 46,601 bytes used against 5,177,344 accepted, 111x
headroom, three acts at 2.7% (section 0).

IT IS A SHAPE PROBLEM, AND THE SHAPE IS ALREADY HALF RIGHT. The save today is 13
keys, and the two biggest are `bohemia_city_save.a` and `.b` at 15,586 and 15,585
bytes -- a double-buffered pair, so a save interrupted halfway never destroys the
last good one. Three acts must not become six of those.

THE SHAPE FOR ROUND TWO: ONE SAVE, ONE SEED, THREE ACT SLOTS, ONE A/B PAIR OVER
THE WHOLE THING. The seed and the layout are written once and shared (4.5 KB, the
permanent framework). Each act slot holds only its own ledgers and its own EDITS
(today: 29 bytes of edits, 9,389 of minds, 2,995 of deed weights). Nothing stores
a valley, because a valley is a function of the seed. AND THE HANDS ARE THEIR OWN
SLOT: what he carries and what he has done IN an act survives a re-derive, which
is rule 31's "his own ledger laid back on top" and round zero's rule 4.

================================================================================
## 5. WHAT THE PLAYERS ACTUALLY REMEMBER (the row asks; short, because it is)
================================================================================
Across every game in section 2(b), what people quote back is never the flip and
never the system. It is ONE OBJECT THAT SURVIVED THE GAP: the bean you planted as
a child standing as a grown plant; the medical chart that became the flag that
became the disguise; the gardener you recruited being the reason a tree exists a
century later. The flip is plumbing. THE PAY-OFF IS A THING STANDING WHERE YOU
LEFT IT, AND IT HAS TO BE A THING, NOT A NUMBER. Round zero's rule 2 is right and
it is the rule most likely to be lost when the derive gets built, because a
derive naturally produces statistics.

ONE LINE FOR THE BUILD ROWS: every field in the derive should be able to finish
the sentence "and then he walks up to it." A block that is his is a block with his
mark on the wall. A pump he lit is a lit pump. A man he ruined is a man standing
there ruined, or a lot where the man's shop used to be.

================================================================================
## 6. WHAT THIS ROUND DID NOT MEASURE, SAID PLAINLY
================================================================================
- **The 113 seconds.** The overmap is 0.2 s of a boot that RUN measured at 113.7 s
  of work on a 4x CPU. This round did NOT break that boot down, so "a flip costs
  one beat" is TRUE OF THE VALLEY and UNPROVEN OF THE WHOLE WORLD. Chunk art,
  population, the power grid and the cast bake all sit inside that number and some
  of it is per-act. NOBODY SHOULD QUOTE "a flip is 200 ms" UNTIL THAT BREAKDOWN
  EXISTS. It is the first measurement of round two and it is the honest version of
  "price it with PLUMBER".
- **No test material is banked this round.** Rule 6 asks for draft:true material in
  a bank file where a round produces content. This round produced findings and
  measurements, not lines or names; [three names] is the row that banks words.
- The switch-cost research is about tasks in a lab and in clinics, not about
  players. It is the right shape of warning, not a number we can put in a gate.

================================================================================
## 7. ROUTED
================================================================================
- **DYNASTY [the derive]** (school round two, this lane, next): break the 113 s
  boot into per-act and shared, with PLUMBER; write the derive's field list from
  the fold's existing one; define hands-versus-world field by field; name the
  machine gate (change one act-1 row, flip, prove act 3 changed AND act 3's own
  deeds survived).
- **DYNASTY [the flip]**: the flip RESUMES, never restarts (section 3). That is a
  requirement on the row, not a nicety.
- **PLUMBER**: the boot breakdown above is the measurement this lane needs and
  cannot take alone. Also: three act slots must not become three double-buffered
  save pairs (section 4, hole 4).
- **WORLD and LIFE+CITY**: the three acts SHARE ONE LAYOUT (4,459 bytes) and
  re-derive their own fill. The streets, the reservoirs, the courthouse and the
  power corridors are the same in all three ages; what stands on the lots is not.
- **FACTIONS, PEOPLE, ECONOMY**: your four ledgers (standing and deeds, turf, the
  debt, the builds and the grid) ARE act 3's seed. Nothing new is asked of you
  this round; knowing they are the input should decide arguments later.
- **UI**: three short lists, one per act, always reachable on the phone, is the
  answer to three lives (section 3). Not three HUDs.
- **COORDINATOR**: round zero's rule 6 is superseded by section 0 and its hole 3
  route is void (2c). Everything else in round zero stands and most of it is good.

================================================================================
## 8. SOURCES
================================================================================
Measurements: taken on the alpha through the one driver (rule 14g), this round.
Research, none of it a reference game (rule 31 names only Ocarina of Time):
- https://www.gamespot.com/reviews/dark-cloud-2-review/1900-2911113/
- https://darkcloud.fandom.com/wiki/Georama
- https://en.wikipedia.org/wiki/Day_of_the_Tentacle
- https://en.wikipedia.org/wiki/Effect_and_Cause
- https://kotaku.com/what-made-dishonored-2s-time-travel-level-so-good-1819596566
- https://www.pnas.org/doi/10.1073/pnas.1905232116   (street-network path dependence)
- https://en.wikipedia.org/wiki/Grid_plan
- https://transportgeography.org/contents/chapter8/transportation-urban-form/
- https://nextcity.org/urbanist-news/with-a-population-in-free-fall-detroit-turns-to-planned-shrinkage
- https://communityprogress.org/blog/urban-prairies-shrinking-cities/
- https://www.apa.org/topics/research/multitasking   (switch cost)
- https://www.sciencedirect.com/science/article/pii/S1532046423000709
