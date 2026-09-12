# THE RULER WAS THE BROKEN THING (9/12/26, LIFE + CITY lane)
## VAMILY row `[lab reds]` THREE-CITY-ART-CHECKS-ARE-RED-ON-MAIN

**combat_lab_gate.js: 929 pass / 3 fail -> 932 pass / 0 fail.**
**Not one byte of the game changed. All three fixes are in the gate.**

The row said: "Fix or honestly retire each, with the number." Three fixed, none
retired, and none of the three was a defect in the city art it was pointed at.

---

## THE THREE, AND WHAT WAS ACTUALLY WRONG WITH EACH

### 1. THE RUNG TABLE — a gate outranking a locked ruling

    FAIL ...on HIS 7/3 rungs and nobody else's: 4 kills and 2 kills, counted down
    asserted:  /TIERS:\[\[4,4\],\[2,2\],\[0,0\]\]/.test(alpha)
    measured:  grep -c "TIERS:" slices/BOHEMIA_ALPHA_0_9.html  ->  0

The table is not missing, it is **superseded**, and by Paolo himself.

> **Paolo 8/26, LOCKED:** "overworld calmness lvl 1 then an enemy trying to hurt
> you or someone is talking to you is lvl 2 then you either kill 2 enemies or
> theresa whole bunch of people close together talking type shit for lvl 3"

Two things that ruling changed: the top of the ladder moved from FOUR kills to
**TWO**, and kills stopped being the only input. The alpha carries exactly that —
`LAYERS:[0,0,2,4]`, `level()` returning 3 on `kills>=2 || crowdNear` and 2 on
`threat || talkingTo`, with `setThreat` / `talking` / `crowd` as the front doors
and `window.INTENSITY` as the name, because KILLMUS got too narrow.

So the leg was standing there demanding that his newer ruling be reverted. **A
GATE MUST NEVER OUTRANK A RULING** — and the failure is sharper than usual,
because the leg *directly above it in the same file* is a twenty-line note about
this exact failure mode, written after it happened in the 8/20 RUN lane. The
ruler had the lesson written on it and broke the same way anyway.

RE-POINTED onto the 8/26 rungs. MECHANISM-MINE / CONTENTS-PAOLO'S is why the leg
still exists at all: the ladder is mechanism, the rungs are his, and a gate is
the only thing stopping somebody re-tuning them.

### 2. THE DOUBLE-YELLOW MEDIAN — a check that matched a comment

Clause by clause on main:

    the dead colour rgba(184,160,40) is never drawn   TRUE
    the hand-painted x.fillRect(medX...) is never drawn   TRUE
    demo contains "V94 THE HAND-PAINTED MARKINGS ARE GONE"   FALSE

The invariant held perfectly. The leg was red because of a **comment marker** —
and the note two lines above that clause says, in as many words, *"a check that
matches a comment is not a check."* Somebody tidied the v94 banner and the leg
fell over. Grepped the whole tree: that sentence now lives in exactly one file,
the gate asserting it.

Replaced the marker with the thing it was standing in for. The median stopped
being a hand-painted stripe because it came **back as approved tile art**, so the
leg now checks the art is there: `"median"` is a real PNG in the street bank and
`streetKindAt` hands the centre lane to it. That cannot be satisfied by writing a
sentence.

### 3. THE QUARTER TURNS — the bytes of a set instead of the rule it obeys

    asserted:  demo.includes('const ST_SPIN={road:1,walk:1,lot:1};')
    on main:   const ST_SPIN={road:1,walk:1,lot:1,yard:1};   ... ST_SPIN.slab=1;

`yard` and `slab` are **flat ground**. A yard and an indoor slab have no facing,
so spinning them is free repeat-killing — the exact thing this leg exists to
encourage. The leg went red for the work going right, which is the same shape as
failure 1.

The invariant was never the byte string. It is: isotropic kinds spin, directional
kinds never do, because the kerb lip and the gutter shadow have to keep facing the
road (v94 measured which way). So the set is now **built and read** — the
declaration plus every later `ST_SPIN.x=` assignment — and every directional kind
`streetKindAt` can return is checked against it by name:
`median, lane, gutterL, gutterR, kerbL, kerbR, house`.

---

## IT STILL BITES — FIVE MUTATIONS, RUN, NOT ASSERTED

A gate that cannot fail is worse than none, so every rewritten leg was mutated on
disk and the gate re-run.

| # | mutation | expected | result |
|---|---|---|---|
| 1 | top rung back to `kills>=4` (revert his 8/26 ruling) | RED | **931/1, leg 1** |
| 2 | median PNG removed from the street bank | RED | **931/1, leg 2** |
| 3 | `kerbL:1` added to the ST_SPIN declaration | RED | **931/1, leg 3, names kerbL** |
| 4 | `ST_SPIN.median=1` added as a later assignment | RED | **931/1, leg 3, names median** |
| 5 | `dirt:1` added — a genuinely flat new surface | **GREEN** | **932/0** |

Mutation 4 is the one the old byte-literal check could never have caught: a
directional tile spun by a line written somewhere else in the file. Mutation 5 is
the proof the fix did not just re-freeze today's bytes under a new name — add a
sixth flat surface and it stays green.

---

## THE STANDING NOTE

**A GATE THAT GOES RED FOR THE WORK GOING RIGHT IS NOT A STRICT GATE, IT IS A
BROKEN ONE.** All three reds were the ruler, and two of the three fired *because
the product improved*: his ladder got better rungs, and the floor got two more
flat surfaces to spin. Every one of them pinned an artefact — a table, a comment,
a byte string — where it should have pinned the rule the artefact expressed. The
tell is uniform and cheap to check: **when a leg goes red, read what it asserts
against the newest ruling BEFORE you read it against the code.** A stale table is
not a regression, and the gate's own file already carried the lesson twice.

FIX THE RULER, NEVER THE TARGET. This round the ruler was the only thing there
was to fix.

---

    gates/combat_lab_gate.js   929 pass / 3 fail  ->  932 pass / 0 fail
    slices/BOHEMIA_ALPHA_0_9.html      unchanged
    slices/BOHEMIA_CITY_WORLD.html     unchanged
