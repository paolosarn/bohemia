# THE HANDOFF WAS SIXTY-ONE LINES (8/27/26)

Found while rebasing this lane's work onto main. Not looked for.

    b8959d20   00_START_HERE_NEXT_SESSION.md    72,322 lines
    de670a11   00_START_HERE_NEXT_SESSION.md         61 lines

One commit. 99.9% of the file gone.

## WHAT ACTUALLY HAPPENED

The WORDS lane shipped a good piece of work (the interface strings harvest) and
wrote its handoff entry by REPLACING the whole file with that entry instead of
prepending it. Their entry is fine. The write is what did the damage: it deleted
the live state of every other lane in the fleet.

Gone in that one write: FACTIONS, UI, SOUND, WORLD, CHARACTER, RUN, PEOPLE,
COMBAT, CITY, LAB and the COORDINATOR, back through 8/2. Twelve lanes' worth of
where-we-are, what-is-in-flight, and what-is-pending-Paolo.

CLAUDE.md: "GIT IS THE MEMORY." It was, and that is the only reason this is a
repair and not a loss. The content came straight back out of b8959d20.

## WHAT WAS RESTORED

    b8959d20's full file underneath, byte for byte
    the WORDS 8/27 (b) entry kept on top, where they put it
    the older WORDS 8/27 (a) entry demoted from LATEST so there is exactly one
    this lane's 8/27 (b) entry prepended in its own place

Nothing of theirs was dropped. The file is 72,480 lines and all twelve lanes are
in it.

## THE PART THAT MATTERS MORE THAN THE REPAIR

**`handoff_gate.js` ALREADY HAD A CLAIM FOR THIS AND IT PASSED.**

    4. it still leads with a lane head, so it has not been truncated to nothing

That claim was written on 8/2 for exactly this failure mode. It passed on the
sixty-one-line wreckage, because the wreckage still led with a lane head. Its
own lane's head.

A check that only asks "is there anything here" cannot tell a handoff from a
fragment of one. The claim was not wrong about what it wanted; it was wrong
about what it measured, and nothing in the suite noticed the difference for
twenty-five days.

This is the same shape as most of this session's other findings: **the
instrument was the broken part, not the game.** A gate can be present, named
correctly, documented correctly, and still be decoration.

## THE CLAIM THAT REPLACES IT

    5. THE WHOLE FLEET IS STILL IN IT

Lane heads are `NAME (slug-xxxxxx): 8/27 ...`. The set of slugs is the fleet as
this file knows it. Compare against HEAD: a lane may be ADDED, and an entry may
be demoted, rewritten or cut right down. A lane that was in here at HEAD and is
gone now is somebody's memory deleted, and the gate names it.

Plus the blunt one, because a lane can survive as a one-line stub while its
history is gone: the file must still hold at least 80% of HEAD's bytes. This
file only ever grows.

### THE MATCHER HAD TO BE TIGHTENED BEFORE IT COULD BE BELIEVED

Its first cut accepted any parenthesised lowercase token after a capitalised
word and reported 31 lanes. Among them: `a`, `d`, `c`, `b`, `03`, `7`,
`unchanged`. All prose. A list that is mostly noise cannot tell you a real name
went missing, and it would have gone red on any turn that reworded a sentence.
Requiring a hyphenated slug followed by a date gives the twelve real ones:

    character-0lurbs  city-1eztay  combat-nfnki9  coordinator-checkin-1y6dtv
    factions-ovkjpf   lab-e2r7sv   people-7h9sfy  run-eak241
    sound-xk7pjp      ui-kmqmrf    words-8dqrnq   world-9lfjtf

### AND IT CATCHES IT AT THE COMMIT, WHICH IS THE ONLY MOMENT IT CAN

Once a truncation lands, the truncated file becomes the baseline and the loss is
invisible to every diff-based test forever after. That is not a weakness to
paper over. It is the reason this has to be a pre-push gate and not an audit.

## MUTATIONS

    A  replay de670a11 exactly (the file replaced by one lane's entry)
       RED, 2 legs, naming all eleven lost lanes
    B  every lane head kept, all history under them cut
       RED on the bytes leg (a stub fleet is not a fleet)
    C  delete exactly one lane, leave everything else intact
       RED, naming world-9lfjtf
    restored                                        7 passed, 0 failed

## THE RULE, SAID PLAINLY FOR THE NEXT LANE

**This file is the fleet's, not your lane's. Every session PREPENDS its entry
and demotes the previous one from LATEST. Nobody ever writes it whole.**
