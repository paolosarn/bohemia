# WHY THE SOUNDS SOUND LIKE 2006, AND WHAT FFX ACTUALLY DID
## Research record, SOUNDS lane, 7/29/26

Paolo, on batch SFX-01: *"okay its decent i appreciate it. it sounds like it was
made with some software from 2006 so if we could do better than that for all of
them. i want you to do big brain research on final fantasy 10's ui sound system.
by far my favorite ui sounds of all time. remember i love the idea of
apocolypictc horror final fantasy shit so remake all of these. they were mid at
best tbh but its the right direction."*

RULING: direction APPROVED (12 events, the moments are right, the judge surface
is right). The SOUNDS themselves are KILLED and remade. This is the research the
remake is built on.

---

## 1. HE DATED IT ALMOST EXACTLY, AND HE WAS BEING GENEROUS

The v1 engine is the **sfxr topology**: one oscillator (or noise) → one filter →
one amplitude envelope → out. DrPetter's sfxr shipped in **2007**, and jsfxr is
its JavaScript port. He said "software from 2006" about an engine that is
structurally a 2007 tool. That is not a vibe, it is the actual architecture.

Worse: the reference model for a convincing struck-object sound is **Risset's
bell, 1969**, which has **eleven partials, each with its own frequency ratio,
amplitude and duration**. v1 gives every partial ONE shared decay. The v1 engine
was behind a 1969 model, not a 2006 one.

## 2. THE FIVE THINGS THAT WERE MISSING (each is a measurable defect)

**A. ONE DECAY FOR THE WHOLE SOUND.** In a real struck body, high partials die
much faster than low ones. Risset's canonical bell table makes this explicit:
relative durations run **1.0, 0.9, 0.65, 0.55, 0.325, 0.35, 0.25, 0.2, 0.15,
0.1, 0.075** as the partials climb. The top partial decays **13x faster** than
the fundamental. A single shared envelope is the single loudest "synthetic" tell
there is: everything stops at once, which no physical object does.

**B. HARMONIC PARTIALS.** v1 detuned copies of one wave. Bells, glass, and metal
plates are **inharmonic** — that irregular spectrum is exactly what the ear reads
as "metallic". Risset's verified ratios: **0.56, 0.56, 0.92, 0.92, 1.19, 1.70,
2.00, 2.74, 3.00, 3.76, 4.07**.

**C. NO BEATING / WARBLE.** Real bells have "noticeable beating of partials,
caused by minor asymmetry of structure or material so that modal frequencies in
different vibration directions are slightly different." Risset models it by
pairing partials 1&2 and 3&4 with a **small offset in Hz, not in ratio** (+1 Hz,
+1.7 Hz), which produces a slow warble. v1 had none: dead still, therefore dead.

**D. NO TRANSIENT / BODY / TAIL SPLIT.** The industry structure for a
convincing impact is three layers: the **transient** (the snap, the first few
ms), the **body** (the tone), and the **tail** (the ring-out). The craft note
that matters: the transients of the layers must land on the *exact* same sample,
and the snap sits slightly louder than the body, or the result reads mushy. v1
was one layer doing all three jobs.

**E. NO SPACE, AND MONO.** See below. This is the FFX-specific part.

## 3. WHAT FFX'S HARDWARE ACTUALLY GAVE IT

FFX ran on the PS2's **SPU2**: 48 hardware ADPCM voices (24 per core) at 44.1 or
48 kHz, per-voice **ADSR envelopes**, pitch modulation, noise generation, and —
this is the important one — **built-in hardware reverb with seven modes: Room,
Studio Small, Studio Large, Hall, Space, Echo, Delay.**

So every FFX menu sound is: **a recorded resonant object** (ADPCM sample of a
real struck thing, not an oscillator) **played into a hardware Hall/Space
reverb.** That combination is the whole "expensive" quality. It is not a secret
technique. It is a real object in a real room.

And the detail that closes it: **FFX was the first Final Fantasy where the sound
effects went from MONO to STEREO**, specifically so they would sit in the
atmosphere. Uematsu has said the effects are key to the story. Every one of my 60
v1 candidates was **pan = 0, dead centre, mono**. On the exact axis FFX treated as
its upgrade, v1 shipped the thing FFX moved away from.

## 4. THE CONSTRAINT, AND HOW SPACE GETS BUILT ANYWAY

The SCREECH LAW (7/8, it physically hit his ears) bans `createDelay` and
`createConvolver` in this build. **Nothing may feed back and nothing may ring by
loop.** So FFX's hardware reverb cannot be copied as a processor.

It can be **synthesized as a source**, which is legal by construction because
every piece is finite and decays to zero:

- **EARLY REFLECTIONS** = the same struck body re-triggered at scheduled
  millisecond offsets at falling gain, panned across the field. No delay line, no
  feedback: they are just more finite voices scheduled ahead of time.
- **THE LATE TAIL** = a filtered noise burst under an exponential decay envelope.
  This is the velvet-noise result standing on its head: the late reverberation
  tail *resembles noise with an exponential decay envelope*, and velvet-noise
  reverb works precisely because a sparse/filtered noise sequence with the right
  decay profile IS a late reverb. If a noise sequence convolved in is a reverb
  tail, a noise sequence **generated** with the same envelope is the same tail
  without the convolver.

Result: a hall, with no delay node, no convolver, and nothing that can ring.

## 5. THE DIRECTION HE NAMED: APOCALYPTIC HORROR FINAL FANTASY

Locked and already in the music laws ("post-apocalyptic Final Fantasy horror:
ruined grandeur, dead chapel choirs, bells in empty casinos, but MELODIC and
emotive under the dread"). Applied to UI, that means every sound is **a small
ritual object struck in a big dead room**:

| material | what it is in Bohemia |
|---|---|
| crystal | the cursor, the pickup. a shard, not a bleep |
| bell | the save, the kill. a chapel bell nobody rings any more |
| stone | doors, heavy steps. wet concrete in a dead building |
| dead metal | blocks, the phone. rebar, a struck car panel |
| bone / wood | impacts. dry, close, no ring |
| grit / ash | footsteps. dust, no tone at all |

The rule that keeps it from being a bell festival: **only the sounds that mean
something get a tail.** Footsteps are dry and close. A kill, a save, a door into
a building get the room. That contrast IS the horror: the small sounds are
intimate and the big ones tell you how empty the building is.

---

## WHAT THE REMAKE MUST DO, AS A CHECKLIST THE MACHINE CAN HOLD

1. modal bank per material, **inharmonic ratios**, minimum 8 partials
2. **per-partial decay**, and it must SHORTEN as frequency rises (the physical law)
3. **paired partials offset in Hz** for beating/warble
4. **three layers**: transient, body, tail, transients sample-aligned
5. **synthesized space**: scheduled early reflections + noise-tail, no delay, no convolver
6. **stereo**: partials and reflections spread across the field, never pan 0 mono
7. only meaningful events get a long tail; footsteps stay dry and short

Sources:
- [Additive synthesis: Risset's bell, MSP/UCSD](http://msp.ucsd.edu/techniques/v0.11/book-html/node71.html)
- [Risset bell partial table, verified implementation](https://gist.github.com/arkadyan/5937242)
- [Efficient Modeling and Synthesis of Bell-like Sounds, DAFx-02](https://www.dafx.de/papers/DAFX02_Karjalainen_Valimaki_Esquef_bell-like_sounds.pdf)
- [Synthesizing Bells, Sound On Sound](https://www.soundonsound.com/techniques/synthesizing-bells)
- [Sound Processing Unit (SPU) specifications, psx-spx](https://psx-spx.consoledev.net/soundprocessingunitspu/)
- [SPU2 Is More Than Just Sound, PCSX2](https://pcsx2.net/blog/2010/spu2-is-more-than-just-sound/)
- [PlayStation 2 technical specifications](https://ultimatepopculture.fandom.com/wiki/PlayStation_2_technical_specifications)
- [Music of Final Fantasy X (mono to stereo sound effects)](https://en.wikipedia.org/wiki/Music_of_Final_Fantasy_X)
- [Reverberation Modeling Using Velvet Noise, AES](https://www.aes.org/e-lib/download.cfm?ID=13941)
- [Late-Reverberation Synthesis Using Interleaved Velvet-Noise Sequences, IEEE](https://ieeexplore.ieee.org/document/9360485/)
- [Best Practices for Game UI Sounds (transient/body/tail layering)](https://sfxengine.com/blog/best-practices-for-game-ui-sounds)
- [Mastering the Sound Effects Click (transient alignment)](https://sfxengine.com/blog/sound-effects-click)
