# THE HUNDRED-HOUR GAME LEVELLED YOU UP IN SILENCE (8/30/26, SOUND lane)

**Paolo 8/26, LOCKED:** *"IT IS A FULL GAME THAT WILL TAKE YOU 100 HOURS TO
COMPLETE BRO. LEVELING UP LEVELS AND GIVES YOU EXPERIENCE FOR EXPERIENCE TREE
CYBER PUNK ELDERSCROLL PERK AND BONUS SHIT. WILL ALSO GO HAND IN HAND WITH
ABILITIES AND THE 60 MINI BOSSES IN THE GAME THAT GIVE YOU A NEW WAY TO INTERACT
WITH BOHEMIA."*

## MEASURED: THE SPINE OF THAT SENTENCE MADE NO SOUND AT ALL

    tools/bohemia_combat_the_tree_patch.py         sfx/sting references: 0
    tools/bohemia_combat_the_mini_bosses_patch.py  sfx/sting references: 0

The tree is the piece five days of combat work were waiting for. The ladder is
fifty-three named men who each hand you a **new verb**. Between them they are
the entire progression of a hundred-hour game — you earn experience, you cross a
level, you spend a point, a perk comes on, a boss goes down and gives you a way
to interact with Bohemia you did not have. Every one of those was silent.

## SEVEN MOMENTS, THIRTY-FIVE SOUNDS, FIVE WIRED THE SAME TURN

    xp_lands    treeEarn(n)               wired
    level_up    the V189 level crossing   wired
    perk_taken  treeBuy(id)               wired
    key_taken   keyWin(id)                wired
    held_back   the already-hold branch   wired
    boss_here   -- no single call site, reason written
    boss_falls  -- no single call site, reason written

A cook without a caller is a candidate on a judging sheet, not a shipped sound.
This lane wrote that rule after shipping six callerless moments on 8/20, so the
wires land in the same turn as the recipes.

## THE PALETTE AND THE SUBJECT AGREED, WHICH IS THE BEST SIGN NEITHER IS FORCED

His 8/28 ruling retired wood, stone, ash and bone; metal was already dead. What
is left is **bell, choir, crystal, glass, water**.

That ruling was made about a rack whose centre of gravity was dry gritty desert
matter — ash under a boot, bone under a pipe. **Progression is the one subject
that never wanted dry matter.** Levelling up is a ring. A perk coming on is a
ring. A man's key passing to you is a bell. The constraint and the subject
arrived at the same answer independently.

## TWO THINGS I HAD WRONG, BOTH CAUGHT BY LOOKING AT THE REAL BUILD

**1. A patch tool is not the build.** I wrote that a level-up "is not even an
event yet", read straight off the tree's patch tool. Decoding `COMBAT_B64`
showed the shipped module is four versions newer: **V189 already added the
crossing**, with the comment *"a level is a MOMENT, not a number that quietly
ticks over"*, and already puts a line on screen. The moment existed; it had no
sound. A patch tool tells you what a thing looked like the day it was written.
The wire got smaller and invents nothing.

**2. Seven moments does not close the diversity red, and I only learned that by
running it.** The gate said "35 more non-instrument candidates" so I cooked 35.
It moved 58.1% → 55.6% and asked for 25 more. Its `fresh` list is
`[r for r in rows if r['synth'] != 'modal']` — **modal is excluded from the
denominator entirely**, because modal *is* the stale baseline he complained
about. Five of the seven are modal, so 25 of the 35 were never going to count.

**Nothing was changed to chase that number.** A level-up is a bell and a bell is
modal. Turning these into friction to move a percentage would be picking the
method to satisfy a gate instead of the physics, which is exactly what killed
batch 25. What the red actually needs is five more moments that genuinely want
friction, and progression is not where those live. Reported, not padded.

## AND THE GATE CAUGHT A REAL RECIPE FAULT

All five `xp_lands` candidates rendered at peak 0.144, under the judgeable band.
I had written it to be "nearly nothing" because it fires on every body — but
**he cannot thumb what he cannot hear**, and a candidate too quiet to judge is
not a restrained sound, it is a wasted slot. Quiet is a mix decision and belongs
in the mix, not in a candidate he is being asked to rule on. Raised, along with
one `held_back` variant.

## STATUS

    SFX RENDER 635 candidates, silent on time, identical twice   0 FAILED
    SFX WIRED · SFX SHUFFLE · SFX ENVELOPE · SOUND MESSAGE       GREEN
    SILENT PLAY · SILENT MOMENTS · GRAVEYARD · ALPHA LOADS       GREEN
    MATERIAL COOKED 11/0
    SFX DIVERSITY  still red: 55.6%, needs 5 more friction-shaped moments

**Tab: MUSIC.** Thirty-five new candidates on the judge board, five per moment,
none of them canon. Nothing plays in the game until he thumbs it.
