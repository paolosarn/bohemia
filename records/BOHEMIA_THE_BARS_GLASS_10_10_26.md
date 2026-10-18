# THE BAR'S GLASS (SOUNDS, 10/10)

Row [the soundscape] (rule 80a). Its own FIRST list names "the clinic's door and cough,
the bar's murmur and glass, the barber's clippers, the board's paper, the stall's cans,
the posts' crowd." The murmur and the crowd are both a crowd of voices, and this lane's
whole palette is struck, resonant and particle material, never a faked voice -- the
standing gap every bar row in this lane has named since round one of
[the settlement's sounds]. The glass has no voice in it at all, so it builds.

## The build

canOnWood's own construction, a second time, for a second material:

- `objectSetDown(ctx, { surface: 'boards' })` -- the counter's own contact. Zero new
  ground math; this is the same call canOnWood already makes for the stall's counter.
- `struckMetal(ctx, { what: 'glass', f0: 650, secs: 1.2 })` -- the material's own ring.
  Zero new DSP code; one new entry in the STRIKE table struckMetal already reads from.

The two buffers sum, 0.65 wood to 0.6 glass, the same ratio shape canOnWood uses for its
own two materials (0.7 wood to 0.55 tin).

## Why one partial

Glass is not metal, but `struckMetal()` never cared: it is a generic struck-resonator
engine (a half-sine force pulse, a bank of decaying modes, saturate, fade), and a
drinking glass is just another material with its own real numbers.

A struck tumbler's well-known "singing" character is ONE clear pitch, not a chord --
unlike the bell's founder-tuned minor third or the pipe's clangy inharmonic bar series.
So `glass` is the one entry in the table with a single partial (`ratios: [1.0]`), and
the gate's own claim checks that count the same way it already checks the bell carries
8 modes and the pipe 5: a claim that only asks "loud enough" cannot tell a chord from a
tone, so the count itself is the claim.

Numbers, stated as engineering estimates on their face (the same discipline the
footstep's slab-on-grade correction already set): f0 = 650 Hz (a bar tumbler's struck
tone commonly falls in the few-hundred-Hz range; this is the middle of that range, not
a measured glass) and damp = 0.05%, set below the pipe's own 0.08% (the lowest figure
already in the table), because glass loses less energy per cycle than bronze or steel
-- it is why a glass harmonica works at all. hit = 0.0004 s, shorter than the pipe's
0.0007 s, because glass is the stiffer contact of the two.

## The mistake, caught before it shipped

The first claim written said the glass, damped lower than the pipe, would RING LONGER.
The gate's own measurement said otherwise: the glass rings 0.98 s against the pipe's
2.03 s.

The reason is on the table's own face: tail time is `1 / (pi * f0 * damp)`, so pitch
and damping both decide it. The pipe's 196 Hz fundamental times its 0.08% damping gives
a smaller product than the glass's 650 Hz times its lower 0.05% -- the glass pays its
lower-loss advantage back in cycles per second. A real bar glass's clink really is
brief, and the honest reason is its pitch, not a hidden loss this table never gave it.

The claim and its comment were rewritten to the true relationship (`G.longestTail <
P.longestTail && G.f0 > P.f0`) rather than left to assert the thing that sounded right
and happened to be wrong, the same discipline this lane has applied to its own prior
mistakes (the footstep's glass-jar reverb, the deck and flip's loss factor, dog_far's
approval status).

## What stays unbuilt, said plainly

The bar's murmur (a crowd of low conversation under the whole screen) and the posts'
crowd (the same kind of sound at the hiring posts) are both named in this row's own
list and both stay unbuilt: they are vocal-sounding moments, and this lane's whole
palette is struck, resonant and particle material. A weak fake would be worse than the
gap, the same ruling this lane has made every round a voice has come up.

## Gates

`gates/cooked_sounds_gate.js`: four new claims (the two materials summed; the single
partial; the true tail relationship against the pipe; the beat and the fade), 224/0
(was 218/0). All four correctly go red under `--mutate`, the falsifier replacing
`H.barGlassDown` directly (the same closure-trap fix every reused wrapper in this file
already carries, since `barGlassDown` calls `objectSetDown` and `struckMetal` by
closure, never through `H`).

## VOTE

`sounds-the-bars-glass-10-10`, draft:true, on
`slices/BOHEMIA_THE_BARS_GLASS_10_10_26.html` (the glass against the bare wood contact
alone, for comparison -- the same two-card shape every judge page in this lane uses).
Unjudged = silent: not wired live.
