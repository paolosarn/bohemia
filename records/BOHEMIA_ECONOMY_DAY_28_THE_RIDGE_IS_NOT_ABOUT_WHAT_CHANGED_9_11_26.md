# ECONOMY ROUND 28 -- Q28 [ridge worth]
# THE RIDGE IS NOT ABOUT WHAT CHANGED. IT IS ABOUT WHAT DIDN'T.
# And we have TWO records of the hundred years that disagree about whether the
# city is allowed to get worse.

MODE: RESEARCH. NOTHING WAS IMPLEMENTED. This file and the bank lines are the
whole deliverable. Every finding becomes a WORLD, LIFE + CITY or RUN job later,
and only the coordinator puts it on the board.

THE ROW, VERBATIM:
  Q28 What a hundred-year view is worth: the title screen is now the ridge
  looking down at the city your family built. Research what real people say when
  they look at a place they built or lost over a lifetime (oral histories of
  rebuilt cities, of returning after decades), and what the best games have put
  in a single recurring view so a player feels the years. Deliver what the ridge
  should SHOW changing, in what order, act by act.

---------------------------------------------------------------------------
## 1. WHAT I MEASURED IN OUR OWN CODE FIRST
---------------------------------------------------------------------------

**THE RIDGE IS WORDS WITH NO ART, AND THE SCENE SAYS SO OUT LOUD.** The burial
on the ridge is written and shipped as a scene; its own note reads "NO RIDGE ART
EXISTS YET and that is named out loud rather than hidden". His 7/19 law is
unusually specific about what it is for: "the first full-scope reveal of the whole
valley... the first time you ever see Bohemia's beauty, you see it through tears,
over a fresh grave. The city's beauty is bound to loss from the first frame."

**WE HAVE TWO RECORDS OF THE CENTURY AND THEY DISAGREE ABOUT DECLINE.**

The FOLD, in engine/bohemia_engine.js Generations. I ran three centuries:

    a century of BUILDING        -> invest 9  builds tier 3  texture modern
    one good gen then NEGLECT    -> invest 9  builds tier 3  texture modern
    a gen that actively LOSES it -> invest 0  builds tier 3  texture apocalypse

Three things fall out of that, and the middle one is the finding:

  1. `builds` is a HARD RATCHET. It is written `Math.max(inh.builds[t]||0, e.tier)`,
     so a choice that says tier 0 leaves a tier 3 standing. Measured: it did.
  2. `invest` and `economyCapacity` are `+=`, so a NEGATIVE amount really does pull
     them back down, and districtTexture really does fall from modern to apocalypse
     when it does. DECLINE IS REPRESENTABLE. Nothing in the game ever authors a
     negative, which is a different problem and a much cheaper one.
  3. **NEGLECT DOES NOTHING AT ALL.** One good generation followed by a century of
     silence leaves invest at 9 and the texture at modern. Nothing weathers.
     YOU CAN LOSE THE VALLEY IN THIS GAME BUT YOU CANNOT LET IT GO, and letting it
     go is how every real place I read about actually went.

And districtTexture is the whole visual vocabulary of a hundred years:

    invest <= 0  -> 'apocalypse'
    invest <  5  -> 'recovering'
    else         -> 'modern'

THREE STRINGS, READ OFF ONE NUMBER, FOR THE ENTIRE CENTURY.

**AND THEN THE OTHER RECORD, WHICH IS THE RIGHT ONE AND NOBODY IS LOOKING AT IT.**

engine/bohemia_century.js exists. ACT_MIN 1, ACT_MAX 3, and I ran it:

    act 1 (lived)       | built 3 | pulled down 0 | NET  3 | housing 0
    act 2 (lived)       | built 0 | pulled down 2 | NET -2 | housing 0
    act 3 (not reached) | built 0 | pulled down 0 | NET  0 | housing 0

**NET GOES NEGATIVE.** The century ledger can say the city got smaller. It counts
per act, it knows which acts were actually lived, and setAct refuses to go
backwards because, in its own words, "a century that can run in reverse is not a
memory."

**AND THE ACT-BY-ACT LOOK IS ALREADY AN EMPTY TABLE WITH THE RIGHT FIELD IN IT.**

    TIERS = {}
    tierOf(rec, act) -> { reason:'NO_RULING', table:'TIERS',
                          about:"what a poor city and a rebuilt city are is
                                 Paolo's ruling" }

and the comment above it says a row would be
`{act, need:{built:N, housed:N}, look:'...'}`.

The row I was given asks what the ridge should show act by act. THE TABLE FOR
THAT ANSWER IS ALREADY WRITTEN, ALREADY NAMED `look`, AND ALREADY EMPTY BY LAW.

**THE ACT IS TWO-VALUED ON THE SURFACE HE WALKS. MEASURED THIS ROUND, NOT QUOTED:**

    slices/BOHEMIA_CITY_WORLD.html   act1 963 times   act2 ZERO   act3 38
    slices/BOHEMIA_ALPHA_0_9.html    act1  14 times   act2 ZERO   act3 ZERO

Nearly every `act1` is a material description on a tile, which is the dossier law
doing its job. The only two places that read a STORY act are:

    var act = (opts.act === 3) ? 3 : 1;
    var p   = (act === 3) ? f.act3_power : f.act1_power;

There is no act2_power. Fifty act1_power, forty-three act3_power, zero act2. SO
THE ROW ASKS FOR THREE ACTS AND THE CITY CAN ONLY SAY 1 OR 3. Hold that thought,
because section 3 makes it uncomfortable.

**AND THE CENTURY LEDGER IS NOT IN THE GAME HE OPENS.** Eight references in the
walked city, ZERO in the alpha. The one module that can describe a hundred years
is not loaded on the link he plays.

**HOUSING CAP IS EMPTY, SO THE PEOPLE COLUMN READS ZERO BY LAW.**
capacityOf('house') = 0, 'shop' = 0, 'apartment' = 0, 'trailer' = 0. The century
ledger records `people` at the moment of the build on purpose -- "what the family
built is what it built under the rules of the day" -- and the rule of the day is
that a house holds nobody.

**WHAT A RIDGE COULD ACTUALLY SEE TONIGHT, MEASURED ACROSS FIVE SEEDS:**

    seed 1  1690 circuits  400 lit  23.7%
    seed 2  1637 circuits  424 lit  25.9%
    seed 3  1601 circuits  473 lit  29.5%
    seed 4  1664 circuits  381 lit  22.9%
    seed 5  1592 circuits  394 lit  24.7%

**THREE QUARTERS OF THE VALLEY IS DARK, ON EVERY SEED, RIGHT NOW.** That picture
is already true, already built, costs no new art, and nobody has ever shown it to
him. And it is the money: a circuit goes dark when the holder cannot pay the
night's battery. The ridge at night is a reading of who can still afford to be
lit.

---------------------------------------------------------------------------
## 2. THE FINDING THAT PROVES US WRONG
---------------------------------------------------------------------------

The row says "what the ridge should SHOW CHANGING", and the instinct under that,
mine included, is that more change makes more feeling. Pile up a century of
difference and the player will feel the century.

**THE RETURN LITERATURE SAYS THE OPPOSITE, AND IT SAYS IT IN ONE SENTENCE: THE
PLACE DIDN'T CHANGE NEARLY AS MUCH AS THE PERSON DID.**

What people who go back after decades report is the strange doubling of standing
somewhere they know perfectly and feeling like a stranger in it. What they name,
over and over, is not the new thing. It is the CONSTANT: the old tree on the
corner, the outline of the main street, the shape of the hill. Trees come up
constantly, because a tree is the one thing that is unmistakably the same thing
and unmistakably bigger. Places also read SMALLER than remembered, which is the
same effect from the other side.

**SO THE YEARS ARE NOT CARRIED BY THE DIFFERENCE. THEY ARE CARRIED BY A CONSTANT
STANDING NEXT TO A DIFFERENCE.** A ridge where everything has changed does not
read as your valley a century on. It reads as a different valley. The anchor is
the mechanism, and we already have the right anchor for free: our street plan is
seed-fixed, so the valley's outline cannot drift.

**AND THERE IS A NAME FOR THE EXACT EMOTION THIS VIEW IS FOR.** Glenn Albrecht
coined SOLASTALGIA in 2003 for the distress of your home changing around you
while you are still in it -- his own gloss is "the homesickness you have when you
are still at home". It is built from solace and desolation. It is NOT nostalgia,
and the difference is the whole design: nostalgia needs you to have left, and
solastalgia needs you to still be standing there. The ridge is a place you come
back to without ever having left the valley. That is the feeling, and it has a
literature.

---------------------------------------------------------------------------
## 3. THE SECOND FINDING, AND IT IS THE UNCOMFORTABLE ONE
---------------------------------------------------------------------------

Tulane ran an oral history project after Katrina, around 350 interviews with
people who had evacuated and come back. The most notable thing the researchers
found held across all of them:

**PEOPLE COULD NOT NARRATE THEIR LIVES AS A CONTINUUM. ONLY BEFORE AND AFTER.**

A hundred years does not feel like three acts to the person who lived it. It
feels like two, with a line through the middle. Our code has exactly two act
values and no act 2, and I am not going to pretend that is a good thing, because
it is a hole. But the row asks what the ridge should show ACT BY ACT and the
honest research answer is that the middle act is the hardest one to make anybody
feel, and that is not only our bug, it is a property of how people hold a long
disaster in their heads.

**AND THE NUMBERS ON RETURN ARE THE SHAPE ACT THREE SHOULD HAVE.** New Orleans
was about 484,000 before the storm and about 230,000 a year after. Twenty years
later it is around 351,000: STILL ONLY ABOUT 80% OF WHAT IT WAS. The return
curve is two-phase everywhere it has been measured -- the first 80% of people
come back fast and the last 20% takes forever or never happens. Whole
neighbourhoods rebuilt and stayed empty of the lives that were in them.

And the housing finding lands straight on our own empty table: the single most
effective thing for getting people to come back is repairing the housing stock,
because people will not return without somewhere to live.

**SO THE TRUE ACT THREE IS NOT A TRIUMPH. IT IS A REBUILT SKYLINE OVER A THINNER
CITY.** The lights come back, then the buildings, then the people, and the people
do not all come.

---------------------------------------------------------------------------
## 4. WHAT THE RIDGE SHOULD SHOW, IN ORDER, ACT BY ACT
---------------------------------------------------------------------------

The row wants an order. Here it is, and every rung lands on something already
built or already named.

**RUNG 0, AND IT RUNS THROUGH ALL THREE ACTS: THE THING THAT DOES NOT CHANGE.**
The ridge itself, the outline of the valley, and the street plan. Ours is
seed-fixed, which is the right answer already. Nothing about the anchor may drift
between acts, because the anchor is what makes the differences legible. Pick one
more small constant that survives all three acts -- a single silhouette on the
skyline -- and never touch it. That is the tree.

**ACT ONE: THE LIGHT.** The valley at night, about a quarter of it lit. Measured
at 22.9% to 29.5% across five seeds, already true, and it reads from any distance
with no new art: dark ground, a few bright veins. And it is the money, exactly:
a circuit goes dark when the holder cannot pay the battery. NOTHING NEW HAS TO BE
BUILT FOR THIS, ONLY SHOWN. It is also the fastest-moving of the three, which is
why it goes first.

**ACT TWO: THE COUNT.** What your family put up, and what came down. The century
ledger already returns per act built / pulled down / net, and net already goes
negative -- I ran it at -2. THIS IS THE ONLY ACT THAT CAN SHOW LOSS AND IT IS
THE ONE THE GAME CANNOT CURRENTLY NAME. That is not a coincidence worth being
comfortable about. If act 2 never becomes a value the city can read, the middle
of a hundred-year game has no picture and the ridge goes straight from ruin to
rebuilt, which is the before-and-after shape the research says people already
default to and which a game about a century should be fighting.

**ACT THREE: WHO IS IN IT.** Housing, and how much of it is occupied. The column
is already in the century ledger and it reads zero because capacityOf returns
zero for everything. One ruled number -- how many people a house holds -- turns
the ledger's `housed` field on, and then the ridge can do the only thing a
hundred-year view is actually for: show that the lights came back, and the
buildings came back, and the city is still thinner than it was.

**AND THE ORDER IS THE FINDING, NOT A PREFERENCE.** Light, then buildings, then
people. That is the real speed of recovery in every case I read: power and
services first, structures next, population last and incomplete. Running the
ridge in that order means each act shows the thing that is actually moving in it,
and act three's gap between a full skyline and a half-full city IS the hundred
years.

**ONE MORE RULE, FROM THE GAMES SIDE, IN PLAIN WORDS.** The reason a vista works
at all is that it is a RECEIPT: you are not looking at it for new information,
you are looking at it to see ground you covered. So everything on our ridge has
to be a thing the player DID, not a thing the world did to him. The lit circuits
are ones he paid for. The buildings are ones he placed. The people are ones his
houses hold. A ridge that shows weather is scenery; a ridge that shows your own
receipts is a hundred years.

---------------------------------------------------------------------------
## 5. ROUTED
---------------------------------------------------------------------------

Nothing here is a job until the coordinator makes it one.

  -> RUN / LIFE + CITY   THE RIDGE AT NIGHT, ACT ONE, COSTS NO NEW ART. Three
                         quarters of the valley is already dark on every seed and
                         nothing has ever shown it. This is the cheapest real
                         thing in the round.
  -> WORLD               TWO RECORDS OF THE CENTURY THAT DISAGREE. The fold's
                         `builds` is a Math.max ratchet and neglect does nothing;
                         bohemia_century.js counts demolitions and goes negative.
                         One of them should be the century and it should be the
                         one that can lose.
  -> WORLD               THE CENTURY LEDGER IS NOT IN THE ALPHA. Eight references
                         in the walked city, zero in the link he plays.
  -> LIFE + CITY         NOTHING WEATHERS. A century of neglect leaves the texture
                         at 'modern'. Decline is representable (invest is +=);
                         nothing authors it.
  -> PLUMBER / WORLD     act2 appears ZERO times on both surfaces, and the only
                         story-act switch is (act===3)?3:1. This is already on the
                         board as BB-THE-ACT-IS-A-STATE and round 28 is another
                         lane arriving at it from the ridge.
  -> [PENDING Paolo] (28) WHAT DOES A POOR CITY AND A REBUILT CITY LOOK LIKE?
                         bohemia_century.js has an empty TIERS table with a `look`
                         field and asks him this question in those words.
  -> [PENDING Paolo] (29) HOW MANY PEOPLE DOES A HOUSE HOLD? The housing CAP is
                         empty, so the ridge cannot say who lives there, and act
                         three is the people.

---------------------------------------------------------------------------
## 6. WHAT IS NOT HERE, ON PURPOSE
---------------------------------------------------------------------------

I did not fill TIERS, did not pick a housing capacity, did not choose the
landmark, and did not write a ridge scene. Three of those are rulings and the
fourth is somebody else's lane.

I did not name a reference game for the vista. The mechanic is in plain words in
section 4 and it stays that way, because the ridge's own inspiration is already
named in his 7/19 law and it belongs to that law, not to me.

And I did not go looking for a pretty quotation from a returnee. What I have is
the finding the interviewers reported across 350 conversations, which is worth
more than one good line and is harder to argue with.

---------------------------------------------------------------------------
## 7. THE GATE NOTE
---------------------------------------------------------------------------

Every gate in this lane's subset went green, and the round found that the game
carries two contradictory records of its own century and that the act the ridge
is supposed to change across does not exist as a value.

These gates check that a part does what it says. Nothing checks that two parts
agree, that a part keeps working for as long as the game lasts, that it is the
right part to have, or that the parts form a loop that closes. Rounds 16 through
28, same sentence. This round is the clearest case of the FIRST clause the study
has produced: the fold and the century ledger both pass their own gates, and they
answer the same question two different ways.

---------------------------------------------------------------------------
## 8. SOURCES
---------------------------------------------------------------------------

Solastalgia, Glenn Albrecht (2003, published 2005/2007):
  https://en.wikipedia.org/wiki/Solastalgia
  https://journals.sagepub.com/doi/10.1080/10398560701701288
Post-Katrina New Orleans: population, return, and the Tulane oral histories:
  https://www.nationalgeographic.com/culture/article/hurricane-katrina-anniversary-new-orleans-rebuilding
  https://archive.oah.org/special-issues/katrina/Otte.html
  https://www.ssrc.org/publications/left-to-chance-hurricane-katrina-and-the-story-of-two-new-orleans-neighborhoods/
  https://www.enterprisecommunity.org/story/20-years-later-hurricane-katrina-leaves-lasting-imprint-city-and-region
Returning after decades, and what people name when they do:
  https://cowboyandhisbooks.substack.com/p/you-cant-go-home-again-nostalgia
  https://www.quora.com/People-that-moved-back-to-their-hometown-after-many-years-of-living-elsewhere-what-are-some-things-that-you-only-then-noticed
Reconstruction speed against population return, and the two-phase return curve:
  https://www.gfdrr.org/sites/default/files/publication/Building%20Back%20Better.pdf
  https://www.huduser.gov/portal/pdredge/pdr-edge-featd-article-111819.html
  https://arxiv.org/pdf/2201.05253
What a vista is for, in game terms:
  https://medium.com/nyc-design/function-of-vistas-and-views-in-game-design-5bd069cfc05f
