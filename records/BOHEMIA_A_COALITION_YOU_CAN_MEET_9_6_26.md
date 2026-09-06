# A COALITION YOU CAN MEET
FACTIONS lane · VAMILY row `[enemies unite]` BB-COALITION, the half joint with WORLD · 9/6/26
WORLD's half: `records/BOHEMIA_THE_WORLD_GETS_ORGANISED_9_6_26.md` (shipped aace2d9)

## THE ONE LINE
WORLD built the coalition and the card that names it. **Measured after it landed:
`formed()` had exactly one caller in the whole game, and it was that card.** So
the valley could tell you two outfits had stopped fighting each other because of
you, and then every one of their members treated you exactly as before.

## THE ROW'S OWN SENTENCE
> *"The enemies who were spending their strength on each other **point all of it
> at you**."*

Pointing it at you has to be something you **meet**, not a line on a screen. That
is this half.

## WHAT WAS ACTUALLY WRONG
`ctAgainstMe(p)` — the organ that decides whether a body watches you, keeps near
you, refuses to deal with you or stands in your way — reads exactly two facts:

1. **their outfit versus yours** (`ctRelToMine`)
2. **their own opinion of you** (`ctOpinionOf`, the deed ledger)

Neither one knows what a coalition is. So a Remnant who has never personally seen
you, whose outfit has no feud with yours, stayed perfectly neutral while the
STANDING card said *AGAINST YOU — Cartel + Remnants*.

## WHAT SHIPPED
`bohemia_against.js` gains a **third reason**: their outfit joined a quarrel that
was not theirs. `read({rel, rung, coalition})`, the worst of the three wins, and
the coalition only gets to explain itself when it **is** the reason — if their
outfit already hated you that hard on its own, telling you they joined somebody
else's quarrel is the wrong story about the person in front of you.

**The level is copied off the ally, never invented.** Somebody who joined a war is
at war with you; somebody who joined a grudge has a grudge. No fourth level was
added, and a coalition of people who merely dislike you cannot manufacture a war.

Its words, tagged draft like every attempt:

> **THEY STOPPED FIGHTING EACH OTHER, AND IT IS ABOUT YOU**
> *THEIR OUTFIT HAS JOINED A QUARREL THAT WAS NOT THEIRS*
> *THEY HAVE TAKEN SOMEBODY ELSE'S SIDE AGAINST YOU*

At `hostile` that earns the signs the organ already ships: **they watch you, they
keep near you, and they will not deal with you.**

## DRIVEN ON THE WALKED SURFACE
    clean run                    Cartel reads: nothing
    earn two enemies who
      also hate each other       Cartel + Remnants forms
    a Cartel member now reads    hostile / joined
    a Remnants member now reads  hostile / joined
    a Church member reads        nothing          (no collateral)
    make peace with the Cartel   Remnants back to nothing

Derived, never stored — so there is no dissolution rule to forget, which is
WORLD's design and this half inherits it.

## THE FAULT THAT COST THE MOST
The first cut read the ally's level from `ctRelToMine`. That is **outfit versus
outfit**, and a player with no outfit of their own has no ripples at all — so it
came back `null` for both members and the whole thing quietly did nothing **while
the pair really had formed**. The measurement said `formed: ["Cartel+Remnants"]`
and `readCartel: "nothing"` in the same breath.

A coalition forms off `rungStandings()` — the deed ledger — so that is where the
level has to come from, put through `BohemiaStanding.rungFor` rather than a second
ladder written here.

**And the first version of the gate claim about that fault was a grep.** It went
red on its own string arithmetic while the behaviour was correct. A grep proves
the code exists; **three separate faults this session passed greps while the thing
did nothing.** It is a behavioural claim now: the same street run that produced
`hostile/joined` had no outfit and no ripple to read, which is precisely the state
the broken version returned nothing in.

## GATES
`coalition_gate` 38/0, up from 28 — extended, not duplicated. Ten new claims: the
organ ignores a coalition it is not handed (zero-regression), a member who has
never seen you is against you, the level is copied and a cold coalition cannot
manufacture a war, it only explains itself when it is the reason, it names who
brought them in, and the full street pass — silent, formed, both members, no
collateral, peace dissolves it.

Green alongside: faction between, turf, faction towns, demo build, alpha loads.

## [PENDING Paolo] — NOTHING NEW
WORLD already carries the two that belong to this row: **who allies with whom and
when** (`COALITIONS` is the one-line door and ships empty), and **what a coalition
should do beyond pointing the same strength at you**. This half did the part that
was not a design question: making what already formed something you can walk into.
