# THE DERIVE: SCHOOL, ROUND TWO
# DYNASTY lane, board row [the derive] / THE-FUTURE-IS-THE-PAST'S-REPORT-CARD
# 9/24/26 · MODE: SCHOOL (design in plain words, gate NAMED, no code) · rule 31
#
# The row asks for four things: how act 2 and act 3 are COMPUTED from the earlier
# acts' ledgers on every flip; how the future's own deeds are laid back on top;
# the MACHINE GATE; and then the rows for WORLD and LIFE+CITY.
# Round one (records/BOHEMIA_DYNASTY_SCHOOL_THE_THREE_ACTS_AT_ONCE_ROUND_ONE_9_23_26.md)
# also owed one measurement it would not fake: breaking the boot into per-act and
# shared. That is section 1, and it changes the answer.

================================================================================
## 0. THE HEADLINE: THE FLIP'S PRICE IS THE WARDROBE, NOT THE WORLD
================================================================================
Round one measured that the valley is free: 820,025 bytes of data that come back
from a ten-digit seed in 170 to 239 ms on the phone profile, inside one beat. It
said out loud that the rest of the boot was unmeasured and that nobody should
quote "a flip is one beat" until somebody broke it down.

Broken down, with Chrome's own sampling profiler over a full reload:

    the whole boot, page load to the pad working ....... 18,691 ms
    building people's bodies (buildFrame, inclusive) ...  8,512 ms   46%
    realizing world cells (realizeCell and its family) .  2,331 ms   12%
    the valley itself (buildOvermap) ...................     ~60 ms   0.3%

**BUILDING BODIES IS FORTY-SIX PERCENT OF THE BOOT AND THE VALLEY IS A THIRD OF
ONE PERCENT.** Counted with a wrapper armed BEFORE the page (the trap this fleet
has written down twice: a counter attached after boot has missed every call that
matters):

    buildFrame called ......................... 1,431 times
    buildFrame cache hits ......................  308
    people on the street ......................   61
    DISTINCT LOOKS AMONG THEM .................    8
    distinct faces ............................    8
    the baked cast ............................    9 bodies

So the boot bakes about 159 frames per body to dress a crowd of sixty-one out of
NINE bodies and EIGHT looks. The expensive thing is not the crowd. IT IS THE
CATALOGUE THE CROWD IS DRESSED FROM.

**AND THAT IS THE WHOLE ANSWER TO PER-ACT VERSUS SHARED.** A catalogue is shared
by definition. Three acts do not need three catalogues; they need three casts
drawn from one. The repo already works this way: `lookKey()` is clothes plus
tints plus skin plus face, and the frame cache is keyed on it, so two people in
the same clothes share one bake and always have.

THE RULE FOR THE FLIP, and it is a budget, not a preference:
**AN ACT MAY CHANGE WHAT A BODY WEARS. IT MAY NOT CHANGE WHAT A BODY IS.**
New garments in the shared catalogue cost their own frames once, and after that
every act wears them free. A new rig, a new body size or a new frame count per
act costs the whole 8.5 seconds again, per act, and that is the one thing in this
design that can actually make a flip feel like a loading screen.

================================================================================
## 1. WHAT IS PER-ACT AND WHAT IS SHARED (the table round one owed)
================================================================================

    SHARED, BUILT ONCE, NEVER REBUILT ON A FLIP
      the seed .................... 10 digits
      the layout, the lines ....... 4,459 bytes: the freeway, the arterials, the
                                    Strip, the reservoirs, the water treatment,
                                    the pump station, the jail, the courthouse,
                                    the radio station, the quarry, the springs
      the body catalogue .......... 8,512 ms of frames, 9 bodies today
      the garment catalogue ....... rides in the same bake
      the fonts, the sounds, the UI

    PER ACT, REBUILT ON A FLIP
      the valley's fill ........... ~60 ms, from the shared seed and layout
      the cells actually on screen  a slice of the 2,331 ms, only what he can see
      who is standing there ....... a cast drawn from the shared catalogue
      that act's own ledgers ...... the seven live fields in section 2

So a flip is: swap the ledgers, re-derive the fill, re-pick the cast, redraw what
is on screen. NONE OF THAT IS THE 8.5 SECONDS. The 8.5 seconds is the catalogue,
and the catalogue does not move.

================================================================================
## 2. THE DERIVE'S FIELD LIST, AND SIX OF THE THIRTEEN ARE NOT IN THE GAME
================================================================================
The field list is not this lane's opinion. It is the CARRY table that already
ships inside the game (13 fields, each with the reason it says what it says,
5 ruled and 8 unruled). Rule 31's derive is that list run ON EVERY FLIP instead
of once at a handoff.

ASKED OF THE RUNNING ALPHA, not read off a file, because "it exists in the repo"
and "it answers on the glass" are different facts:

    LIVE ON THE SURFACE HE PLAYS (7)
      standings ......... the standing web answers
      deeds ............. the city's minds answer
      territory ......... the turf grid answers
      builds ............ the world's edit list answers
      economyCapacity ... the housing report answers
      family ............ the family tree is saved on the phone
      debt .............. the purse answers

    NOT ON THE SURFACE HE PLAYS (6)
      invest, karma, virtues, wounds, blindSpot, recordedKnown

The six are not hiding under other names. Swept for every spelling: in the whole
walked city their only real appearances are the CARRY table that names them, a
list in the heir module literally called NOT_MINE that says it does not touch
them, and one gate that BANS karma as a stat gate ("NO STAT GATES. NO KARMA").

AND THE HALF OF THE FOLD THAT READS TWELVE OF THEM IS NOT IN THE GAME EITHER.
`foldGeneration` -- the ledger fold -- exists only inside the RETIRED slice. The
walked city carries the composer (`BohemiaFold`) and the memory fold (`ctFold`)
and not the ledger fold. `selectHeir` is not there either.

**SO THE DERIVE DOES NOT NEED THE OLD FOLD REVIVED. IT NEEDS A READER THAT ASKS
THE SEVEN LIVE SYSTEMS DIRECTLY.** That is a smaller job than it looked, and it
is the difference between a round-two design and a round-two wish.

THE SIX ARE NOT A BLOCKER AND MUST NOT BECOME ONE (rule 12: a dependency is a
premise). The derive ships reading seven fields and SAYS SO for the other six,
the same way the strike module answers NOT KNOWN rather than converting silence
into a verdict. A field with no source produces no change in the future, and the
derive names which field was silent rather than pretending it contributed zero.

================================================================================
## 3. HANDS VERSUS WORLD, FIELD BY FIELD (the design, in plain words)
================================================================================
Paolo's law: the past rewrites the world, never the hands, and what he did in the
future is its own ledger laid back on top.

THE TEST THAT SORTS EVERY FIELD, and it is one sentence:
**THE WORLD IS WHAT HE FINDS. THE HANDS ARE WHAT HE DID SINCE HE GOT THERE.**
Re-deriving an act changes what he FINDS there. It never touches what he DID.

    FIELD              WORLD (re-derived)         HANDS (never re-derived)
    standings          the opinion he inherits    what this act's people saw him do
    deeds              what was RETOLD down       the deeds he did in this act
    territory          who holds what on arrival  blocks he took in this act
    builds             what is standing on        what he put up in this act
                       arrival
    economyCapacity    the city's condition       --
    family             the tree                   --
    debt               --                         each act owes its own

Four notes, each of them a real decision rather than a restatement:

**(a) STANDING IS A FLOOR, NOT A VALUE.** The derive sets where an act's people
START on him; his own deeds in that act move it from there. Otherwise a flip
would erase every relationship he built in that act, which is the loss players
never forgive.

**(b) DEEDS SPLIT BY WHO DID THEM, NOT BY WHEN.** An act's own ledger is stamped
with the act it happened in. The derive lays the earlier acts' RETOLD deeds down
as inherited history and then replays this act's own ledger on top, untouched.
That is literally Paolo's "laid back on top", and the machinery exists: the
memory fold already keeps only the deeds somebody retold, and the standing web
already tells a father's deed from a son's by an `inherited` mark.

**(c) DEBT DOES NOT CROSS, AND THE FOLD'S OWN RULING NEEDS AMENDING FOR THIS.**
The CARRY table rules that debt DIES at a fold, with the right real-world reason:
a child is not personally liable for a parent's unsecured debts, the claim is
against the estate, and an insolvent estate means the creditor loses. **But there
is no fold in the three-acts-at-once model.** Nobody dies and hands over; three
people are alive at once. So debt is not "dying", it is simply PER ACT: each of
the three owes his own, and what crosses is not the bill but THE PEOPLE HE OWED,
still standing there. The table already says that in its own last sentence ("you
inherit less and you inherit the people he owed"); rule 31 just means it applies
continuously rather than at one moment.

**(d) KARMA AND VIRTUES STAY OFF.** Six fields have no live source, and two of
them are a moral score. One gate in this repo already bans karma as a gate.
Reviving them for the derive would put a number where the design wants a thing
standing in a street. Round one's closing rule holds: every field in the derive
should be able to finish the sentence "and then he walks up to it."

================================================================================
## 4. THE CONTRADICTION THAT KILLS THIS DESIGN, AND WHY IT CANNOT HAPPEN HERE
================================================================================
THE GUT-PUNCH, and it is the reason to write a round two at all:

He builds a shop in act 3 on a lot. He flips to act 1 and does something that
re-derives act 3. **What if the lot is not there any more?** His hands point at a
place the world no longer has. Every game with a rewritable past has to answer
this, and most of them answer it by never letting the past REMOVE anything (Dark
Chronicle's requirements only ever add).

OUR ANSWER IS STRUCTURAL AND IT IS ROUND ONE'S FINDING DOING WORK:
**THE LINES ARE SHARED AND ARE NOT AN OUTPUT OF THE DERIVE.** The layout -- the
streets, the lot lines, the freeway, the reservoirs -- is built once from the
seed and is the same object in all three acts. The derive changes what STANDS on
lots and who owns them. It never changes where the lots are.

So a lot that exists in act 1 exists in act 3, always. His shop's address is
always an address. The worst the derive can do is change what is next door, who
owns the block and whether the street is lit, and all three of those are exactly
the "report card" he asked for.

AND IT IS WHAT REAL CITIES DO. Path dependence is measured: street-network design
of construction from 2000-2013 still tracks the road stock of 1975; Roman and
American grids outlive everything built on them; Broadway follows a footpath
older than the city. THE LINES PERSIST, THE FILL DOES NOT. The design and the
real world agree, and so does the engine, which split those two apart years
before anybody said "three acts".

================================================================================
## 5. THE MACHINE GATE, NAMED (the row asks for the name, not the code)
================================================================================
**gates/three_acts_gate.js**, in the suite as **THREE ACTS**. Eight legs, and the
row's own sentence is legs 2 and 3.

    1  THE FLOOR IS PLAYABLE. With an EMPTY act-1 ledger, act 3 still has
       streets, people and some lit cells. A do-nothing future is a worse place,
       never an empty one, and never a punishment screen.
       (Today's valley is 358 lit cells of 9,216, 3.9%, measured by FACTIONS. The
       leg asserts "more than zero and fewer than today", not a tuned number.)
    2  ONE ROW CHANGES THE FUTURE. Add ONE act-1 ledger row, re-derive, and a
       NAMED act-3 fact changes. The leg names which fact, so it cannot pass on
       noise.
    3  THE HANDS SURVIVE. Write N act-3 deeds, change an act-1 row, re-derive,
       and all N are still there and still readable as his.
    4  THE LINES DO NOT MOVE. The layout is byte-identical across all three acts
       and across a re-derive. This is the leg that makes section 4 true rather
       than hoped.
    5  THE SAME LEDGERS GIVE THE SAME FUTURE. Derive twice, compare. A future
       that wobbles on its own is not a report card.
    6  A SILENT FIELD IS NAMED, NOT ZEROED. With a field that has no live source,
       the derive reports that field as UNREAD rather than contributing nothing
       quietly. (The strike module's three answers, same rule.)
    7  A FLIP DOES NOT REBAKE THE CATALOGUE. Count frame builds across a flip:
       it may not rise except by the new garments an act introduces. This is
       section 0 turned into a machine, and it is the leg that keeps a flip off
       the loading screen.
    8  A FLIP LANDS INSIDE A BEAT on the phone profile, measured end to end, not
       just the valley.

    MUTATIONS THAT MUST BITE (a gate that cannot catch its own author is
    decoration):
      - skip the "laid back on top" step ............ leg 3 red
      - let the derive rewrite the layout ........... leg 4 red
      - make an unread field contribute zero ........ leg 6 red
      - rebuild the catalogue on flip ............... leg 7 red
      - return an empty act 3 for an empty ledger ... leg 1 red

================================================================================
## 6. WHAT THIS ROUND DID NOT MEASURE, SAID PLAINLY
================================================================================
- **The 18.7 seconds is this container, not a phone.** Round one measured the
  valley at both speeds; this round profiled the boot unthrottled only, because
  the sampling profiler over a throttled reload is a much longer run. The SHARE
  of the boot that is body baking (46%) is the number that matters here and a
  share is far more stable across machines than a total. Nobody should quote
  18.7 s as a phone number.
- **The profile is of a RELOAD**, so the HTTP cache is warm. That is the same
  thing the driver's own warm-up option already says about second loads. A cold
  first load is bigger and the share is roughly the same.
- **Six fields were probed by the names this lane guessed.** A null from a
  guessed name is not proof of absence, so the runtime probe was checked against
  a text sweep of the whole walked city for every spelling. Both agree. It is
  still two instruments, not a proof.
- **No flip exists to measure.** Legs 7 and 8 describe a flip nobody has built.
  They are written now so the row that builds it has a bar to clear rather than
  a bar written afterwards to fit what it did.

================================================================================
## 7. ROUTED (the row asks for the rows for WORLD and LIFE+CITY; these are
##          proposals for the coordinator, who is the only one who adds rows)
================================================================================
- **WORLD, proposed [one layout]**: the layout is built once from the seed and is
  the SAME OBJECT in all three acts. It is not an output of the derive and no act
  may write to it. Everything an act changes is fill and ownership. Gate leg 4
  above is the check.
- **WORLD, proposed [the report card]**: the reader that asks the seven live
  systems for an act's ledgers, and NAMES the six that are silent rather than
  zeroing them. This replaces reviving the retired ledger fold.
- **LIFE+CITY, proposed [the ruin]**: what a do-nothing act 3 looks like on the
  glass, built from Detroit's real shape (round one, section 4): same streets,
  about a third of the lots bare, green where houses were, power pulled back to
  the corridors that still pay, a small live core, people in all of it. Every one
  of those is something this lane already draws.
- **CHARACTER and COOK**: an act changes what a body WEARS, never what a body IS
  (section 0). New garments are cheap forever; a new rig or a new frame count per
  act costs the whole body bake again, per act. That is a budget, not taste.
- **PLUMBER**: leg 7 is yours in spirit -- a flip that rebakes the catalogue is a
  performance regression that will look like a design problem. The armed-before-
  the-page counter used here is reusable.
- **DYNASTY, next**: [the flip], which round one already put a requirement on --
  the flip RESUMES, never restarts. Both school rounds are done after this one.
- **COORDINATOR**: the CARRY table's `debt: dies` ruling needs the amendment in
  3(c). It is not wrong; it is written for a fold, and rule 31 removed the fold.

================================================================================
## 8. SOURCES
================================================================================
Measurements: taken on the alpha through the one driver (rule 14g), this round --
Chrome's sampling profiler over a reload, a frame-build counter armed before the
page, and a runtime probe of the thirteen carry fields. The 358 lit cells of
9,216 are FACTIONS' measurement, cited not re-taken.
Research, none of it a reference game (rule 31 names only Ocarina of Time):
- https://www.pnas.org/doi/10.1073/pnas.1905232116   (street-network path dependence)
- https://en.wikipedia.org/wiki/Grid_plan
- https://darkcloud.fandom.com/wiki/Georama
- https://nextcity.org/urbanist-news/with-a-population-in-free-fall-detroit-turns-to-planned-shrinkage
