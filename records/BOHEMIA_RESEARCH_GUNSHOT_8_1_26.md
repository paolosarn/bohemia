# BOHEMIA RESEARCH — WHAT A GUNSHOT ACTUALLY IS (8/1/26, SOUNDS lane)

Paolo, 8/1: "do big brain online research if you need to then execute."

## WHY THIS EXISTS

The 7/30 batch was twelve game moments and not one of them was a gun. Combat is
a shooting game. Its gunshot was `sndShot(){ tone(180,0.08,0.10,'sawtooth');
tone(90,0.10,0.08,'sine'); }` — two oscillators, which is the exact 2007 sfxr
topology he already rejected once by name ("it sounds like it was made with some
software from 2006"). So the loudest, most-repeated sound in the game was the
one thing that had never been cooked properly.

## 1. A GUNSHOT IS FOUR SOUNDS, NOT ONE

The forensic-acoustics literature separates a gunshot into three source
components plus the environment, and this decomposition is the whole design:

**MUZZLE BLAST.** The rapid decompression of propellant gas produces a shock
front propagating outward — loud, and **low-frequency**. Chamber pressure can
exceed 50,000 psi in a high-powered rifle. Barrel length shapes it: longer
barrels release gas more gradually and slightly reduce peak intensity, shorter
barrels amplify it.

**BALLISTIC CRACK.** If the bullet is supersonic (above ~1,125 ft/s at sea
level) it makes its own shock wave, **separate from the muzzle blast** and much
sharper. Intensity scales with velocity; a more streamlined projectile gives a
more defined signature.

**MECHANICAL ACTION.** Firing pin, action cycling, bolt or slide impact.
Quieter than the other two, but it is the part that makes a gun sound like a
*machine* rather than an explosion.

**ENVIRONMENT.** Reflections and reverberation off whatever you are standing in.

## 2. THE GAME-AUDIO LAYER STACK SAYS THE SAME THING

Working weapon sound design splits a shot into: **transient** (the first crack
that tells the ear when the weapon fired), **body** (the weight, set by weapon
size and recording distance), **sub/LFE** (low end for power), **mechanical**
(the details), and **tail** (room, alley, canyon, interior reflection).

And the mix rule that matters for us, stated plainly in the FPS-design writing:

> In a game, the player may need a clear transient and reliable feedback more
> than a cinematic tail.

## 3. THE CONVERGENCE THAT DECIDED THE RECIPES

That last line is the same ruling **Paolo's own thumbs already made** on 7/30.
The inference recorded in `records/BOHEMIA_SFX_VERDICT_7_30_26.txt` was that
within every event, the survivors were BRIGHTER, SHORTER, HARDER-DRIVEN and MORE
ARTICULATED — "he wants sounds that CUT and STOP."

The research and his taste independently arrive at: **transient over tail.**
That is not a coincidence to note and move past, it is the strongest signal in
this document, and it is why every one of the five new recipes is short and
front-loaded instead of cinematic.

## 4. THE MATERIAL CHOICE IS HIS, NOT CONVENTION'S

A gunshot is conventionally a metallic crack. His 7/30 verdict, by material:

| material | up/total | |
|---|---|---|
| ash | 10/10 | |
| bell | 10/10 | |
| stone | 5/5 | |
| crystal | 8/10 | |
| metal | **3/15** | both dead doors were metal |
| wood | **0/5** | |

Struck mineral went 33 UP / 2 DOWN. Metal and wood went 3 UP / 17 DOWN. Metal is
the material he killed hardest and it is the conventional answer for a gun.

**So the gun is built from ASH and STONE.** Concussion and dust rather than a
Hollywood receiver clank — which is also what a post-collapse valley should
sound like, so the taste evidence and the fiction agree. This is the inference
being used the way it was recorded to be used: to predict what dies *before* he
has to sit and listen to it.

## 5. HOW EACH COMPONENT MAPS ONTO THE EXISTING ENGINE

Nothing new was built. `BOH_SFX` v2 already had a layer for every component,
which is itself the argument that the modal rebuild was the right call:

| gunshot component | existing engine field |
|---|---|
| muzzle blast (low, broadband) | low `hz` + heavy `grit` at low `gritHz` |
| blast pressure falling | **`slide` negative** — the pitch drop as gas pressure decays |
| ballistic crack | `trans` + high `transHz` |
| mechanical action | **`hits[]`** — the same field gravel already used for multiple strikes |
| environment | `space` / `room` / `refl` / `dark` |
| propellant saturation | `drive` |

## 6. THE FIVE MOMENTS COOKED

| event | material | why |
|---|---|---|
| `shot` | ash | the gun. everything else in a fight is judged against it |
| `miss` | ash, almost no body | a miss is air, not impact |
| `vital` | crystal | the bright wrong one. worse than a hit, not yet a kill |
| `hurt` | ash, darkest | return fire landing on YOU, the only bad-news sound in the game |
| `clear` | bell | the one moment in a fight allowed a real tail |

`clear` gets bell because bell went 10/10 with him and is what SAVED is built
from. Resolution should sound like resolution.

## 7. WHAT THE MEASUREMENT CAUGHT

Rendered at neutral makeup gain, **the gun came out at 0.340 peak — quieter than
a door shutting (0.450) and quieter than picking something up (0.390).** The
most-repeated sound in a fight was near the bottom of the mix. Makeup gains were
then set from the measured medians to place all five deliberately, and the
resulting relationships (`shot > hit`, `shot > miss`, `vital > hit`,
`hurt > hit`) are now locked in `gates/sfx_render_gate.py` and proved to fail
when inverted.

## SOURCES

- [Gunshot Audio: Muzzle Blast, Shock Waves, and Health Impact — Biology Insights](https://biologyinsights.com/gunshot-audio-muzzle-blast-shock-waves-and-health-impact/)
- [Procedural Synthesis of Gunshot Sounds Based on Physically Motivated Models — Springer](https://link.springer.com/chapter/10.1007/978-3-319-53088-8_4)
- [Modal Synthesis of Weapon Sounds — Mengual, Moffat & Reiss, AES 61st Conf: Audio for Games, 2016 (QMUL C4DM)](http://eecs.qmul.ac.uk/~josh/documents/2016/mengual%20moffat%20reiss%20-%202016.pdf)
- [Deciphering Gunshot Recordings — Maher & Shaw, AES (Montana State)](https://www.montana.edu/rmaher/publications/maher_aesconf_0608_1-8.pdf)
- [A Shot in the Dark: The Acoustics of Gunfire — Scientific American](https://blogs.scientificamerican.com/cocktail-party-physics/a-shot-in-the-dark-the-acoustics-of-gunfire/)
- [How to Sound Design FPS Gunshot Sound Effects, with Mark Kilborn — Pro Sound Effects](https://blog.prosoundeffects.com/how-to-sound-design-first-person-shooter-gunshot-sound-effects-with-mark-kilborn)
- [How to design a weapon sound for video games — Splice](https://splice.com/blog/design-weapon-sound-video-games/)
- [How procedural audio brings sounds to life in video games — Splice](https://splice.com/blog/procedural-audio-video-games/)
- [The Ultimate Guide to Designing Period Gun Sound Effects Pt. II — tbirdsound](https://www.tbirdsound.com/post/gun-sound-design)
- [Ballistic acoustics — Acoustics.org](https://acoustics.org/tag/ballistic-acoustics/)

Prior research this builds on: `records/BOHEMIA_RESEARCH_FFX_UI_SOUND_7_29_26.md`
Verdict this infers from: `records/BOHEMIA_SFX_VERDICT_7_30_26.txt`
