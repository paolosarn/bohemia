# A FACTION SONG NEEDS A FIGHT (9/15/26, SOUNDS lane)
## [music owned] — the open question from last round, answered by watching the value

Last round this lane found the street playing a **faction** song right after the handover
— VOLUNTEERS on one run, MOB on the next — and **wrote it down instead of guessing**,
because `CITYMUS.candidates()` can only ever return `MLOOPS` entries, so the street could
not have picked either one. This is the answer.

---

## HOW IT WAS FOUND: WATCH THE VALUE, NOT THE CODE

`MUS.cur` was given a property setter that logs **every write with its call site**. That
is the only honest way to name a writer: reading the code finds candidates, watching the
value finds the culprit. Cold boot of the alpha, 45 seconds, **four writes**:

    0.3s  ->  MENU — THE POWER STILL ON SOMEWHERE   menu=1 city=0    the opening
   22.1s  ->  SLOW CREEP                            menu=0 city=1    the street picks
   22.4s  ->  VOLUNTEERS                            menu=0 city=1    one single line
   22.4s  ->  ANARCHISTS                            menu=0 city=1    the same line

…and 45 seconds in, the street was **still playing ANARCHISTS**.

> **THE STREET PICKED A CREEPER AND WAS OVERRULED TWICE IN 0.3 SECONDS.**

His **7/7 OVERWORLD PLAYLIST LAW** says the overworld plays the creepers. So a player
walking an empty street was hearing a gang's theme.

---

## THE WRITER, AND THE COMMENT ABOVE IT DESCRIBES THE EXACT BUG

The combat iframe posts `bohemiaFactionPicked`. The note sitting directly above the
handler, written 8/19, says it in its own words:

> *"the combat iframe is WARMED seconds after entry and reports a faction from its
> rotation **WITH NO FIGHT IN PROGRESS**, which used to reassign whatever was playing."*

And the guard written for it is:

    if(window.MENUMUS&&MENUMUS.on)return;

**That only covers the opening.** It worked for weeks — because the warm-up happened to
land inside the opening's phrase.

### AND IT STOPPED WORKING BECAUSE OF THIS LANE'S OWN FIX

The round before, this lane fixed the opening to hand over on the **audio clock**,
because it used to never hand over at all on a boot that stutters. So the opening now
finishes at about **16.7 s** and the warm-up arrives at about **22 s** — the guard passes,
and the warm-up takes the street.

> **A GUARD THAT NAMES ONE MOMENT INSTEAD OF THE CONDITION HOLDS ONLY WHILE THE TIMING
> HAPPENS TO AGREE WITH IT.**

The condition was never "the opening is playing." The comment says it plainly: *with no
fight in progress.* Nobody ever wrote that down as code.

---

## THE FIX IS THE CONDITION THE COMMENT ALREADY NAMED, AND IT IS NARROW

The warm-up is ignored **only when the street owns the music and no fight is on.** A
faction song may still take the music the instant a fight owns it, by any path, so
nothing about combat changes and no legitimate pick is dropped.

Untouched: the opening guard (still true, still cheap), the scratch-patch guard,
`FIGHTMUS.realFaction`, and the MUSIC tab's own PLAY — he is driving there, and combat
honours his exact slot.

### PROVED, SAME INSTRUMENT, SAME ROUTE

    BEFORE   4 writes, ending on ANARCHISTS — a faction song, on an empty street
    AFTER    2 writes — the opening, then the street's own REPO MAN
             and still REPO MAN 45 seconds later

---

## WHY THIS ONE WAS INVISIBLE, AND WHAT IT SAYS ABOUT THE LAST TWO ROUNDS

It could not be seen until the handover worked. Before that fix the opening never let go,
so the guard was always true and the bug could never fire in a harness. **Fixing one thing
made a second, older thing visible** — and the same fix is what moved the timing that
exposed it.

That is the third defect in three rounds that was hiding behind a broken checker or a
broken predecessor:

1. the rest gate had been red on main for days, and its red was **true**;
2. the opening never handed over, so the street's music never started;
3. the street's song was being overruled by a screen with no fight in it.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new sound, no new event,
no new number. One condition, on one message.

    python3 gates/bohemia_gates.py --only "FIGHT MUSIC"

Build 9/15 - A FACTION SONG NEEDS A FIGHT.
