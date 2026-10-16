# THE CITY SENDS WHERE (9/5/26, SOUNDS lane)

VAMILY line 1 for this lane: **[background sound] BB-THE-CITY-SENDS-WHERE**, and
the row that rides it, **[daytime music] BB-THE-DAY-SONG-PLAYS**. They are one
wire, because `musicPhase()` is called from exactly one place and that place is
the handler for the message the walked city never sent.

## MEASURED FIRST, ON THE REAL SURFACE, BEFORE ANYTHING WAS TOUCHED

A headless run that clicked through the splash, waited for the walked city, and
walked for twenty-five seconds:

    __AMB.seen        0        the shell had never heard from the walked surface
    __AMB.kind        null     the ambience bed had never chosen a bed
    __musicPhase()    NIGHT    while the city's own clock said 06:00
    __sfxSpace()      STREET   nailed there
    __timePassStats   0 rows   the hour chime had never struck
    runFrame src      (none)   the ONE sender never even loads

And the positive control, posting the same message by hand from the parent:

    __AMB.seen  -> a timestamp      __musicPhase() -> DAY
    __AMB.kind  -> 'air_day'        __sfxSpace()   -> OPEN

**Nothing was broken.** The handler is one branch and it sets `LISTENER.inside`
(occlusion), `AMB.where` (the ambience bed), `musicPhase` (the day/night music
pool) and `timePass` (the hour chime) in a single line, and all four moved the
instant a message arrived. The sender was in the other building:
`BOHEMIA_RUN_CURRENT.html` has posted `BOHEMIA_WHERE` every four seconds since
8/1, the 8/14 migration moved the walked surface into `BOHEMIA_CITY_WORLD.html`,
and the city's only two hits for that string are **filenames inside comments**.

A MIGRATION LIST IS A DELETION LIST FOR EVERYTHING NOT ON IT. Same shape as the
stranded faction world on day 6. Nothing crashed, no gate went red, and four
finished systems sat dark for three weeks.

## THE DAY SONG WAS NOT A SECOND JOB

`CITYMUS.phase` ships hardcoded `'NIGHT'` and `musicPhase(d)` is the only
assignment to it in the build. So the walked city was permanently night, and
**THE MARKER ON THE DOOR** -- tagged OVERWORLD DAY by his own hand, the one song
in this project he has said he likes -- was undrawable there.

The alpha's own 8/4 block already found and fixed this once, for the run slice,
and the migration undid it. Its backlog row says how to check it and the
instruction is why the gate looks the way it does:

> VERIFY BY OBSERVED PHASE, NOT BY READING THE CODE.

So the gate never reads a line of source to decide anything. It moves the city's
own clock with the city's own `advance()` and reads the phase back off the shell:

    06:00 -> DAWN      13:00 -> DAY       air_day
    08:00 -> DAY       18:00 -> DUSK
                       22:30 -> NIGHT     air_night

## WHAT THE MESSAGE SAYS, AND WHERE EVERY FIELD CAME FROM

Every value is the city's own answer. Nothing new was invented.

    inside   !!INSIDE          the city's interior state, set by its own inEnter
    night    isNight()         the city's own 19:00-06:00 rule
    min      T.min             the city's clock, the one the HUD prints
    space    ROOM / HALL       the run's `cells>=140` floor rule, ported verbatim
             STREET / OPEN     __surfaceOf, the city's own footstep classifier

**And the crossing is instant.** The run learned this on 8/14 and wrote it down:
a four-second tick is right for a slow ambience bed and wrong for occlusion,
which is a yes/no about the wall you just walked through, and wrong for the air
of a room, because `AMB` arms its bed on the crossing itself. So the four places
the city changes `INSIDE` -- the door in, the door out, zooming out of the walk,
and waking at your own door -- report the moment they run.

## THE BUG UNDERNEATH IT: EVERY STEP IN THE VALLEY WAS THE DIRT ONE

The `space` field decides STREET or OPEN by asking `__surfaceOf` whether there is
a road within one cell. So the first thing the gate did was fail on it.

**MEASURED, 81x81 cells around the spawn: 6,561 of 6,561 classified `dirt`, and
6,561 of 6,561 had an EMPTY name.** `__surfaceOf` reads `c.name || c.tile`. A
city cell has neither field -- it carries `g` (a colour), `s`, `walk`, `q`,
`ecode`, `artPool`, `gArtPool`, `gArtVariant`, `gTint`, `face`, `wallH`, `enter`.
Every regex under that line has been matching an empty string since it landed,
and every step on every road, sidewalk and yard has played `step_dirt`.

**The comment on top of it says the opposite, in detail.** It explains that the
rules were ported from `sfxGround` "not reinvented", that "the road test runs
before the concrete test because a drivable surface is asphalt whatever the tile
happens to be called", and that this is what makes "the road sound like asphalt
and the yard sound like dirt". Every word is true about the rules and none of it
was ever reached. Fourth time this month a correct comment has stood over code
that could not run.

**Why it survived: the fallback is a real sound.** `return 'dirt'` is an approved
footstep, so the game never went silent, nothing threw, no gate went red, and the
only symptom was a valley that sounded like one enormous field.

The fix asks the field the city actually fills in. `gArtPool` is set by the tile
pass off the district legend's KIND and NAME -- the two things the dossier law
says a legend is for -- and every routing is that block's own sentence about the
tile, quoted, not a new opinion:

    street   drive + marking                              -> asphalt
    side     walk + gate + kerb + the concrete list        -> concrete
    hyard    the yard, and the default for plain ground    -> dirt (unchanged)
    tf_ls    "an arterial's parkway strip IS Vegas xeriscape"      -> gravel
    tf_rip   "talus is the rock the wash's armor is made of"       -> gravel
    tf_be*   "the freeway's graded shoulder slope IS the berm"     -> gravel
    tf_iv*   "plain jointed concrete"                              -> concrete
    tf_bk    the channel bank's poured slope                       -> concrete
    tf_*     field soil, furrows, cracked silt, the lake's ring    -> dirt

Result around the spawn, same 6,561 cells:

    before   dirt 6561
    after    dirt 5043   asphalt 1014   concrete 433   gravel 71

Four of his approved footstep surfaces are reachable where one was. The old name
rules stay underneath, unchanged -- they are the answer for anything that does
carry a name, and deleting a rule because it is currently unreachable is how the
migration stranded this one in the first place.

## THE GATE, AND THE MUTATIONS THAT PROVED IT

`gates/city_where_gate.py`, 23 claims, every one measured on the real surface.

    A  delete the four-second heartbeat        -> RED x5  (heard, beat, bed, chime, phase)
    B  inside:false and space nailed to STREET -> RED x3  (indoors, room, inside air)
    C  the reported clock frozen at 03:00      -> RED x5  (phase, and the whole day walk)
    D  the ground classifier put back          -> RED x5  (road, STREET, and the ground survey)
       restored                                   23 passed, 0 FAILED

**One instrument mistake, mine, and it is the same shape as all of them.** The
first cut ran the clock walk BEFORE the place claims. That walk crosses NIGHTFALL
at 22:00, which ends the day and wakes you somewhere else at 06:00 -- so every
claim after it was describing a world the earlier claims did not measure, and
mutation B reported the night bed for a body that was supposed to be indoors at
midday. The place claims run first now, on the world the page booted into.
A MEASUREMENT TAKEN AFTER YOU CHANGED THE WORLD IS ABOUT THE NEW WORLD.

## WHAT HE WOULD NOTICE

Stand still on the walked surface. The valley makes a sound now -- the air he
gave a perfect sweep to, fifteen of fifteen -- instead of dead silence. Walk into
a building and the air changes to the room as you cross the threshold, not a
minute and a half later. Walk to the middle of the day and the music can reach
the day pool for the first time since 8/14. Walk from a lawn onto the road and
your own footsteps change.

Tab: **RUN** (the walked city). Nothing to judge -- no new sound was cooked.
