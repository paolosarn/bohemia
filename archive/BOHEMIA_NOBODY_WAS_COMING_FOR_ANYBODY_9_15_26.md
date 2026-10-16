# NOBODY WAS COMING FOR ANYBODY
FACTIONS lane · THE FIVE MINUTES (rule 14), round nine · 9/15/26

## THE ONE LINE
The valley has fourteen outfits, four of them at blood with each other, and **not
one party in it was going anywhere to take anything.** Fourteen caravans and
fourteen patrols, zero crews, every day, for as long as anyone has been looking.
Not because the world is peaceful: because the list of who is out there is built
one beat before anybody can be asked who is at war, and then frozen for the day.

## FIRST, THE THING I WAS TOLD TO CHECK, AND IT HAD NOT HAPPENED
My own handoff said: when **rule 16, THE STEP IS A HOUSE** lands, re-measure the map
stops, because every layer this lane draws is sized off the tile and the marker
floor in the relations gate is a pixel count. Measured before assuming:

    on foot        tile 18      human   city renderer 0   sky 0
    one zoom out   tile 13.09   city    city renderer 1   sky 0
    two zooms out  tile 3.74    city    city renderer 0   sky 1

Identical to the last round, `FN` still 128, and `LOT_FINE` is not in the city file
at all. The lattice shipped in the generator; the render scale has not moved. So
there was nothing to re-measure, and it cost one run to know that instead of
guessing.

## A NUMBER I PUBLISHED TWICE WITHOUT MEASURING IT
I wrote *"at that stop a phone shows about a third of the valley"* into a gate
comment and two records. It was an inference. My one attempt at the real number
passed `window.__lastOx` as the camera origin — **a name I made up** — got 34.7%
visible *on foot*, correctly binned it as absurd, and then **I went on quoting the
guess anyway.**

Measured properly, with the origin the renderer itself computes:

| stop | cells framed | share | seats framed |
|---|---|---|---|
| the city stop | 4,660 of 9,216 | **50.6%** | 10 of 14 |
| the widest | 9,216 of 9,216 | **100%** | 14 of 14 |

It is **half**, not a third. The seat count cross-checks exactly against the
relations gate's own independent reading of 10 of 14.

**And the correction matters more than the arithmetic.** I had written *"there is no
longer any view that shows the whole territory at once."* That is wrong. **The
widest stop frames every one of the 9,216 cells and all fourteen seats. The camera
is already right.** What is missing is that the city renderer does not run there, so
the one view that could show who holds the valley draws a placeholder sky instead.
"The view does not exist" would have sent somebody building one that is already
there.

*(The on-foot row of that measurement is dropped, not reported: `renderHuman` uses
its own camera, so projecting the walked world through the city camera measures
nothing.)*

## THE CREWS
His three agendas are a caravan carrying, a patrol holding a border, and **a crew
going to take something**. The valley had two of them.

A crew is the **first** thing a seat tries to send, and only when `hostilesOf()`
finds somebody at blood. Asked directly, the graph is not peaceful at all:

    Caravans <-> Cartel    -45
    Remnants <-> Cartel    -80

Four hostile pairs, and the Cartel's own seat, asked the way the sender asks, sees
both of them. So the data was there and the parties were not. The difference was
one frame:

    the list the game was holding     14 patrol, 14 caravan,  0 crew
    the same function, rebuilt        14 patrol, 10 caravan,  4 crew

Same seats, same day number, same module. **Dropping the cache and letting the
game's own function rebuild it produced the crews.**

The party list is keyed on the seed and the day. Built before the between module
can answer, every seat at blood falls through to a caravan, and **the key cannot
tell a real peace from an unanswered question**, so the harmless valley is kept for
the whole day.

## THE FIX IS THE CAPABILITY THAT FAILED, NOT A PROXY FOR IT
It does not test whether a module object exists — it asks whether anybody can be
asked about anybody. If nothing answers, the answer is returned but **not kept**, and
the next frame tries again. Nothing about the parties themselves changes, and no
design decision is touched.

    Caravans -> Cartel
    Cartel   -> Remnants
    Cartel   -> Caravans
    Remnants -> Cartel

## AND IT HAD QUIETLY COST THIS LANE A THIRD OF ITS OWN FEATURE
`[tracks read]` names the agenda on the ground: *"a crew came through here."* With no
crew in the world, that sentence could never be produced. Driven after the fix, the
ground reader at a crew's own cell answers **`Caravans / crew`** — a thing the game
has never been able to say.

## WHAT IT DID TO SOMEBODY ELSE'S GATE
`parties_move` **38/1 -> 39/0**, on its own claim that all three agendas are out
there. That red has been sitting in the suite naming a real absence and reading
like a content gap.

## GATES
`faction_towns` gains four driven claims: a crew exists, all three agendas are out
there, **the ground says it**, and the list is not frozen before the war is knowable.
All four pass.

    clean origin/main   258 s   207 passed, 1 failed
    this tree           325 s   211 passed, 1 failed

The one failure is **P27, and it is inherited**: identical claim, identical result on
a clean origin/main worktree, arriving from somebody else's change since the last
round. It cannot be this one: the party list reaches only the day advance, the map
track layer and the ground reader, and `partiesNear()` — the one function that takes
the player's position — **has no callers at all**, so parties cannot touch who
follows you. Named, not swept.

`faction_between` holds at 182/1 after the number corrections (the one red is still
QUESTS' main-quest gap). `parties_move` 39/0.

## AND ONE MORE INSTRUMENT LESSON, WHICH IS NOT A SMALL ONE
Four runs of this gate came back as **a single line with no summary**, on my tree and
on clean main alike, and I nearly filed "this lane's own gate dies before it
finishes". It finishes perfectly. `done()` ends with `process.exit()`, and node can
drop buffered stdout on exit **when the output is redirected to a file** rather than a
terminal. Every run I piped to `tail` printed the summary; every run I redirected to
a file lost it.

**A GATE THAT PRINTS NOTHING MAY HAVE PRINTED EVERYTHING.** Every lane redirects gate
output to files, so this is not mine alone.

## RULE 14, OBSERVED
No demo cut, no alpha touched, no build stamp.

## [PENDING Paolo] — NOTHING NEW

## THE THING TO CARRY FORWARD
**A CACHE KEY THAT CANNOT TELL "NO" FROM "NOT YET" WILL FREEZE THE WRONG ANSWER AND
NEVER LOOK AGAIN.** Seed plus day is a perfectly good key for the question *what is
the valley doing today*. It is no key at all for *was anybody home to ask*. The
valley read as peaceful for rounds and every number about it was correct.
