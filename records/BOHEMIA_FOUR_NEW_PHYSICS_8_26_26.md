# FOUR PHYSICS THIS RACK HAS NEVER HAD (8/26/26, SOUND lane)

> "we need more voices and different instruments sounds and shit. so yeah keep
> cooking"

A standing order, and this is the first batch answering it. **He said DIFFERENT**,
and with 582 melodic voices already in the rack the failure mode was never "too
few" — it is a 583rd that lands exactly on top of one of the 582 and adds a name
instead of a sound.

## THE QUESTION WAS NOT "WHAT INSTRUMENT IS MISSING". IT WAS "WHAT PHYSICS."

The rack was searched for the TECHNIQUE, not the name. What its own comments
already claim:

    FM 32 · waveshaping 23 · comb 24 · pluck 22 · formant 14 · additive 9
    PWM 9 · ring mod 6 · chant 6 · modal 5 · Shepard 4 · granular 3
    bitcrush 3 · talkbox 2 · Karplus 1 · FOF 1 · phase distortion 1 · vocoder 1

**SUPERSAW WAS RULED OUT ON THAT EVIDENCE.** `fatsaw`, `saw3v`, `detune` and
`unisonsplit` are already stacks of free-running detuned saws. A fifth would have
been a name.

## WHAT WAS GENUINELY ABSENT, AND IS NOW IN THE GAME

**`scanstring` — SCANNED SYNTHESIS** (Verplank, Shaw & Mathews, Interval
Research, 1998–99). A ring of 64 masses joined by springs is struck at note-on
and integrated at a slow rate while the whole ring is read out as one cycle at
the pitch. **The wavetable is not authored — it is computed by physics**, and it
keeps evolving as the string settles. Not granular (grains are independent; these
masses are coupled). Not modal (modes are fixed and summed; this spectrum
evolves). Not `wavemorph`, which crossfades two WaveShapers.

**`syncthorn` — HARD SYNC.** The word "sync" appears **zero times** across 582
voices. A slave saw is force-reset every time the master period wraps, so the
discontinuity marches through the waveform and the timbre screams while the pitch
does not move.

**`pafvox` — PHASE-ALIGNED FORMANT** (Puckette, 1995). The carrier is re-phased at
the start of every fundamental period and windowed by a raised cosine raised to a
power. Not `formantvox` (a saw through bandpass filters — subtractive). Not
`atriumvox` (FOF: a sum of independently decaying grains). Three ways to make a
vowel; the rack had two.

**`bowdrag` — STICK-SLIP FRICTION**, the Helmholtz motion of a bowed string. **The
oscillation is not made by an oscillator**: it emerges because the bow grabs the
string, drags it and loses it hundreds of times a second. Not `musicsaw`,
`wineglass`, `glassharp` or `ebow` — all four of those are a sine with an LFO on
it, which is what a bowed note sounds like from across a room and is not what a
bow does. **The first voice in this rack whose pitch is a consequence rather than
a setting.**

## `bowdrag` FAILED TWICE BEFORE IT WORKED, AND BOTH FAILURES ARE THE POINT

**First: zc 4 over a whole second.** It was creeping, not slipping. The string
velocity had been scaled by 0.002, so the relative velocity never changed sign
and the "friction" was a constant DC push. A friction model in which nothing ever
slips is a spring.

**Then it went silent above 440 Hz** (crossing ratio 0.15 at 660). A stiffer
string needs a harder press to be dragged as far, so the normal force has to scale
with frequency. Across 55–1200 Hz it now tracks at 0.89–0.98 of the ideal rate,
and the shortfall is *correct*: Helmholtz motion is a sawtooth with a fast
flyback, not a sine.

Neither would have been visible by reading the code.

## THE GATE THAT MAKES "MORE VOICES" MEAN SOMETHING

`gates/voice_variety_gate.py`. Every new voice must render at **every** pitch,
keep its timbre across the register, and — the real one — **not land on top of a
voice that already exists**.

**THE RACK SETS ITS OWN BAR.** Rather than inventing a threshold, the gate
measures how far apart the 578 existing renderable voices are from each other and
requires a new voice to sit at least as far from its nearest neighbour as a
typical existing pair. Nobody gets to pick the number that decides whether their
own batch passed.

    the rack's median nearest-neighbour distance   0.0936

    bowdrag     nearest overpasslight   0.0960
    pafvox      nearest hoover          0.1052
    scanstring  nearest sawlead         0.1143
    syncthorn   nearest anvil           0.1296

## AND IT FAILED MY OWN BATCH TWICE. I FIXED THE VOICES, NOT THE GATE.

**First run:** `pafvox` sat 0.0077 from `printer`; `syncthorn` 0.0109 from
`ringmod`, against a bar of 0.0412. Both under.

That was half a real finding. My descriptor had four axes — attack, crest,
spread, brightness — and **all four are static facts about the whole note**. A
swept sync, a gliding formant and a settling string are all about *change*, and
nothing was looking at change. So two evolution axes went in, applied identically
to all 582 existing voices so the bar rises with them if the old rack also
evolves. Bar 0.0412 → 0.0935; my two went 0.0374 and 0.0358.

**Still under.** At that point adding a third pair of axes would have been
Goodharting my own gate, so I stopped touching the ruler and made the voices
genuinely more distinctive — each in the direction of its own technique, not in
the direction of the metric:

- `syncthorn`'s sweep goes **up and back** across 1×–8.5×. A sync sweep that only
  climbs reads as a bright lead, which is exactly why it measured next to `saw3`.
- `pafvox`'s formant is parked **between harmonics** and its **bandwidth moves
  against its centre** — two independent motions from one carrier, which is the
  thing PAF has and a filter sweep does not.

Both cleared honestly. `syncthorn` ended up the *most* distinctive voice in the
batch.

## MUTATIONS

    a "new" voice that is secretly a copy   -> "nearest existing voice is
    (scanstring routed to sawlead)             sawlead at 0.0000" RED
    bowdrag's force stops scaling with      -> "KEEPS ITS TIMBRE across the
    pitch (the bug I actually shipped)         register ... spread 0.48" RED

The first is the whole reason the gate exists: distance **0.0000** to the voice it
was copied from. The second is the development bug reproduced and caught.

## TWO THINGS FOUND ON THE WAY THAT HAD NOTHING TO DO WITH VOICES

**1. FOUR OF HIS CANON VERDICTS WERE NEVER IN THE GAME.** Cross-checking all 106
CANON rulings in his export against `CANON_DEFAULTS`: 102 present, **4 missing** —
MENU — THE POWER STILL ON SOMEWHERE, THE VOICE THAT STILL ANNOUNCES FLOORS, THE
LAST BROADCAST CORRODES, THE BELLS DISAGREE. His thumbs on the most recent batch
never reached the table the game reads. Applied.

**2. `NEW_VIBES` WAS STALE, AND IT MATTERS TWICE.** It still badged seven batch-24
songs — three of which he KILLED — and it is *also* the list `voice_audible_gate`
walks. A stale one means the NEW badge lies to him **and** the newest voices are
the only ones nobody is checking. Pointed at this batch, which is what its own
comment says it is for.

**And I invented a drum that does not exist.** `kit.h:'shaker'` — the real name is
`shakerh`, and that song's hat would have been silently nothing. `music_gate`
caught it, but a batch tool that can invent an instrument name should refuse
itself before a gate has to, so batch 25 now checks every instrument it names has
a body. **That checker was wrong on its first run too** — it looked only for
`kind==='x'` and flagged `clickh`, which is a real hat kept as an unquoted drum
table key. It uses the game's own resolution rule now.

## WHERE TO HEAR IT

**MUSIC tab.** The four are badged NEW: THE STRING THAT KEEPS MOVING,
A NOTE THAT CLIMBS WITHOUT RISING, SOMETHING IN THE PIPE IS SHAPING WORDS,
THE BOW WILL NOT LET GO. The names are an attempt and they ship; he edits what he
hates.
