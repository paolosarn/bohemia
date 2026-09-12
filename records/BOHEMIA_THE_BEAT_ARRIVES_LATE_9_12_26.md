# THE BEAT ARRIVES LATE (9/12/26, SOUNDS lane)
## [music owned] THE-MUSIC-ITSELF, round 3 — the sound card's gap, closed

> **HIS RULING (9/6, LOCKED).** *"Post-apocalyptic Final Fantasy X, especially
> that fantasy beach vibe, it was so good."*
> **HIS ANCHOR (9/7).** *FFX OST — Besaid Island*, the original, not the remaster.

The sound card measured one gap and this closes it. The law says, in its own words,
why the **original** is the one people mean:

> "The remaster changed it (shorter, a more synthetic beat that **starts sooner**,
> the bass line removed) and people noticed, which tells the lane **WHAT THEY
> LOVED: the patience, the bass under it, THE BEAT ARRIVING LATE.**"

Measured last round: the first transient landed at 0.04 seconds for 137 of 142
songs, and censused on the live library, **138 of 142 put the drum on beat one.**
The other four have no drum at all. Not one song had a late beat. The single trait
the law names as what people loved was the single trait we did not have.

### IT IS NOT A RE-COOK, WHICH IS THE ONLY REASON IT IS BUILDABLE

A song's kick array is **his content**, 138 times over, and re-cutting 138 songs to
taste is exactly what MECHANISM-MINE / CONTENTS-PAOLO'S forbids.

But **when the drums arrive was never in the song.** It is decided in `playStep`,
every step, by two `drumV` calls. So one rule in one place gives the whole shelf
the trait he named and touches no song's data at all.

**THE RULE.** For the first phrase after a song starts — 128 steps, 8 bars, 16
seconds at 120 BPM, the engine's own unit and the same one the street's rest and
the opening's handoff already use — the kick and the hat do not sound. The bass and
the melody do. Then the beat arrives.

### THE 120 BPM LAW IS UNTOUCHED, AND THAT IS LOAD-BEARING

The transport does not stop. The step counter does not pause. Nothing is
rescheduled. **Two `drumV` calls are skipped.** The clock is exactly what it was,
which is what the law is about, and the PULSE that covers the boot is a separate
buffer on the SFX bus that never sees this.

### EVERY EXCLUSION IS A RULING OR A MEASUREMENT, AND EVERY ONE IS PROVEN

| where | held? | why |
|---|---|---|
| the street, the room | **yes** | both reset `MUS.step` to 0 when they pick, so "the first phrase of a song" and "step under 128" are one sentence |
| **a fight** | **never** | danger is now (the 8/19 record), and COMBAT's first fight exists to **teach** the beat. One arriving 16 seconds late teaches nothing |
| the opening | never | it owns one phrase in total, so holding a phrase would silence its whole kit. Measured: it is also a no-op, because all four songs with an empty kick array are MENU songs |
| the MUSIC tab | never | he judges candidates there, and sixteen silent bars at the top of a candidate is an artefact, not a song. The studio's own play never sets `CITYMUS.on` |

**Both drums, one lever, on purpose.** The law says "the beat", and the kick and
the hat are both the kit. Holding one and letting the other play is a second
decision nobody ruled.

### MEASURED, ON THE REAL SURFACE AND IN THE DEMO

    ON THE STREET      first kit hit    held
      REDS                 16.00s        128 steps
      BLUES                16.00s        128 steps
      CARTEL               16.00s        128 steps
      SLOW CREEP           16.00s        128 steps
      REPO MAN             16.00s        128 steps
      THE VAULT            16.00s        128 steps

    MID-SONG (step 300+)    0.50s / 0.00s      0 held
    IN A FIGHT              0.00s              0 held
    IN THE OPENING          0.00s              0 held
    IN THE MUSIC TAB        0.00s              0 held

And in the demo, cut from the same file and checked separately rather than assumed:
the street 16.00s on four songs, a fight 0.00s.

### AND THE CARD'S OWN TERM HAD TO BE CORRECTED TO CHECK THIS

This is the part worth remembering. The card measured "the beat arriving late" as
**when the first transient lands**. That was good enough to *find* the gap, because
with a kick on step 0 the drum always **was** the first transient.

It is **not** good enough to confirm the repair. With the drums provably held for
128 steps, the first transient still read:

    REDS    0.06s        CARTEL     0.70s
    BLUES   0.04s        REPO MAN   1.38s

because **the bass note on step 0 is a transient too.** For a moment that reads
exactly like a fix that did not work.

> **A TERM THAT FOUND A GAP IS NOT AUTOMATICALLY A TERM THAT CAN CONFIRM ITS
> REPAIR.**

The kit is now counted at `drumV`'s own call site, which cannot be confused with
anything else, and the same songs read **16.00s** on the nose. The card and its
gate both carry the corrected term, and the gate asserts the card **cannot drift
back** to the version that could find the gap but not verify the fix.

### AND ONE MORE INSTRUMENT MISTAKE, THE SAME CLASS AS ALWAYS

The exclusion test for the opening reported **REDS excluded and BLUES held** — two
different answers to one question, on the same build, in the same loop. That is
never the rule misbehaving; it is the page editing the probe's setup.

`MENUMUS`'s own watchdog sets `on = false` the instant `MUS.playing` is false, and
`MUS.playing` is always false in an offline render. So the probe set the flag, the
page cleared it between the two songs, and the second song measured the street's
behaviour while claiming to measure the opening's. The watchdog is stopped and the
flag is pinned before every render now, in the probe **and** in the gate.

### AND IT TURNED UP A GATE OF MINE THAT WAS ACCUSING THE WRONG THING

Running the lane, SFX WIRED went **1054 passed, 1 FAILED**:

    WALKING MADE NO SOUND. Peak on the master bus was 0.0042.

Checked against plain `origin/main` in a clean worktree first: **green there,
1055/0.** So it was mine. The obvious suspect was the 9/11 rest ducking a bus the
feet might sit on — measured, and **wrong**: footsteps land on `__SFXBUS` at gain 1
and still render during a rest.

The real cause: **that check connects its analyser to `MUS.MAST` — the MUSIC
master — and calls the result "walking".** Footsteps never touch it. So the late
beat made the music quieter for a phrase, exactly as intended, and the gate
reported that the player's feet were silent.

> **A CHECK THAT WATCHES THE WRONG BUS IS NOT A WEAK CHECK, IT IS A LIAR: it
> accuses the thing it is not looking at.**

And the music is genuinely fine with the kit held — measured against itself:

| song | with drums | kit held | rms left |
|---|---|---|---|
| REDS | rms 0.056, pk 0.36 | rms 0.026, pk 0.16 | 47% |
| SLOW CREEP | rms 0.066, pk 0.38 | rms 0.052, pk 0.19 | 80% |
| THE VAULT | rms 0.065, pk 0.38 | rms 0.054, pk 0.23 | 83% |
| HYMN FOR RUNNING WATER | rms 0.029, pk 0.25 | rms 0.026, pk 0.08 | 88% |

Half to nine tenths of the level, carried by the bass and the melody. That is the
law's own description of the intro, not near-silence.

**FIXING IT TOOK THREE GOES AND THE MUTATION IS WHY.**

1. Moved the meter to `__SFXBUS`, where footsteps really land. Better, and
   **still wrong**: that bus carries *every* effect. Mutation-tested by silencing
   the feet outright — **the gate still read healthy and did not bite.** A bus
   that carries more than its subject cannot answer a question about its subject.
2. So the footstep bus itself is now reachable: `window.__STEPBUS`, exposed the
   same way `__SFXBUS`, `__AMB` and `__PULSE` already are, and for the same
   reason. It carries footsteps and nothing else.
3. **And the 0.02 floor went too.** It was tuned while the meter sat on the music
   bus, so it was never testing feet; pointed at the real subject the honest
   reading is 0.0195, a hair under a number inherited from a different question.
   **A DETECTOR WITH A FIXED THRESHOLD MEASURES ITS THRESHOLD**, and re-tuning the
   constant would only move the lie. The absolute claim now says only what an
   absolute claim can carry, and the weight sits on the **control that was already
   in the file**: the same bus, a moment earlier, on the same build.

MUTATION PROVED, finally: the step bus at zero gain reads **0.0000** and fails
three claims. Before the fix, the same mutation passed 1057/0.

(And the first attempt at that gate edit killed the run outright — I quoted an
expression in **backticks** inside a JS template literal and closed it. Same class
as backticks in a shell heredoc, which this lane did once before.)

### AND THE SHIP REFUSED ITSELF ONCE, CORRECTLY

The push guard stopped the first attempt: **the footstep bus was missing from the
alpha.** I had made that one change as a **direct edit** instead of putting it in
an idempotent tool, so the rebase's rebuild — main's copy plus this lane's tools —
had nothing to re-apply it with, and dropped it.

**A CHANGE THAT IS NOT IN A TOOL CANNOT SURVIVE A REBASE**, and on a main that
moves every few minutes that is not a theoretical risk.

It is in the tool now. And putting it there exposed a second thing: the tool's
idempotence was **one mark guarding two changes**, so with the drum hold present
and the footstep bus missing it declared itself done and repaired nothing. Now it
repairs per change. That is the third time this lane has had to learn that an
"already installed, nothing to do" branch is a place bugs hide.

### WHAT THIS CHANGES FOR HIM

Walk the street and a song now opens on its melody and its bass, with the drums
arriving sixteen seconds in, on the phrase — which together with the rest built on
9/11 means the street goes: sixteen seconds of the block you are standing on, then
a song with no drums, then the beat. That is the shape his anchor is famous for,
and it is on all 142 songs without one of them being re-cut.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new song, no new
tag, no new event, and no new number — the phrase is the engine's own unit, shared
with the rest and the handoff.

    python3 gates/bohemia_gates.py --only "SOUND CARD"

Build 9/12ab - THE BEAT ARRIVES LATE.
