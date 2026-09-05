# EYES AND EARS -- E4 [audio tells]: EVERY APPROVED SOUND, RENDERED AND MEASURED
## 9/5/26, lane 17 (eyes-5vql33). MODE: RESEARCH, plus this lane's own instruments.

E4 asked: how is game audio judged (loudness standards, clipping, phase, noise floor, the
tells of a weak sound effect), render all 65 approved sounds and measure them, and list
which are weak against the best of their kind.

**All 65 events and all 185 approved picks are rendered and measured.** Numbers:
`records/BOHEMIA_EYES_EARS_MEASURED_9_5_26.json`. Weak list:
`records/BOHEMIA_EYES_EARS_WEAK_LIST_9_5_26.json`. Instrument: `tools/bohemia_eyes_ears.js`.

---

## AISLE ONE: HOW THE INDUSTRY JUDGES A GAME'S AUDIO

- **ASWG-R001** (the Audio Special Working Group recommendation Sony adopted for
  PlayStation) is the closest thing games have to a loudness law: **-23 LUFS integrated
  for home titles, -18 LUFS for PORTABLE**, a permitted band of -25 to -20, **true peak no
  higher than -1 dBTP**, and a **loudness range of no more than 20 LU**. Portable is our
  number, because this game is played on a phone.
- **ITU-R BS.1770-4 / EBU R128** is the measurement itself: K-weighted (a high shelf and a
  38 Hz high-pass that approximate the ear), 400 ms blocks at 75% overlap, an absolute gate
  at -70 LUFS and a relative gate 10 LU below the ungated mean. Anything calling itself
  "loudness" that is not this is an RMS meter with ambitions.
- **TRUE PEAK, not sample peak.** A signal can read -0.2 dBFS and still clip a converter
  between samples, which is why broadcast asks for -1 dBTP measured on an oversampled
  signal rather than on the samples themselves.
- **The tells of a weak effect**, from the sound-design side: a transient that does not cut
  through (layers flammed a few milliseconds apart smear it and "the sound feels weak"), no
  body (no low-mid weight under the snap), no tail (nothing to place it in a room), phase
  cancellation between layers that hollows out 200-500 Hz, and repetition without variation.
  The standard structure is the one this repo's own factory already names in its header:
  **transient, body, tail**.

## AISLE TWO: WHAT MAKES A SOUND WEAK ON THE DEVICE WE ACTUALLY SHIP ON

A phone speaker is a 10-15 mm driver with almost nothing below 500 Hz. Everything the
mixing world says about weight and sub energy is true and IRRELEVANT to a sound the player
only ever hears through that speaker: energy below 500 Hz is not quiet on a phone, it is
GONE. So this lane measures a band split as well as a loudness, and the question is not
"does it have low end" but "what is left of it when the low end is removed".

---

## WHAT OUR SOUNDS MEASURE (185 approved picks, 65 events, rendered through the real
## factory into an OfflineAudioContext at 48k stereo)

### THE GOOD NEWS, AND IT IS REAL
- **Zero clipped samples across all 185.**
- **Zero sounds over -1 dBTP.** The hottest true peak in the whole approved set is
  **-4.44 dBTP**. The factory's headroom discipline is holding.
- **No phase problem anywhere**: the lowest stereo correlation is +0.28, nothing negative,
  so nothing collapses or hollows out when a phone sums it to mono.
- **DC offset is effectively zero everywhere.**

### THE NUMBERS THAT MATTER
| measure | across the approved set |
|---|---|
| RMS | -59.7 to -11.1 dBFS, median -25.0 -- **a 48 dB spread** |
| LUFS (where measurable) | -27.3 to -10.3, median -21.2 |
| true peak | -36.6 to **-4.44 dBTP**, none over -1 |
| length | 0.02 s to 2.53 s, median 0.18 s |
| crest factor | 3.7 to 25.0 dB, median 11.5 |
| attack | 0.4 ms to 687 ms, median 2.0 ms |
| stereo correlation | 0.28 to 1.00, **median 1.00** |

### AND THE MEASUREMENT NOBODY EXPECTED
**128 of the 185 approved sounds are shorter than 400 ms**, which is one loudness block --
so the broadcast instrument cannot measure most of our library at all. That is not a fault
in our sounds; it is why the industry measures a game's MIX in LUFS and its individual
assets in peak and RMS. Any future "our sounds are at -18 LUFS" claim about single effects
is measuring something that does not exist.

## THE WEAK LIST, BY MEASUREMENT
| flag | events | what it means |
|---|---|---|
| **more than half the energy under 500 Hz** | 22 | on his phone, more than half the sound is gone. Worst: heartbeat (92%), air_night (88%), power_on (83%) |
| **dead centre** (correlation > 0.995, footsteps excluded) | 32 of 65 | the factory's own header says FFX moved its effects off mono and that this one builds space as SOURCES. Half the library is mono anyway |
| **a spike with nothing behind it** (crest > 20 dB) | 12 | all snap, no body: boots_go, chip_more, come_up, cover_more, hit_more, hurt_more, lungs_burn, parts_pass, shot_more, stone_bite, will_goes, wood_more -- **nine of the twelve are the `_more` sibling sounds** |
| **squashed** (crest < 6 dB) | 5 | demolish, door_drag, generator, phone_buzz, vital_deep: nothing sticks out |
| **shorter than 50 ms** | 7 | a click, with no room for transient, body and tail |
| **inaudible on a phone** (median RMS under -45 dBFS) | 4 | lungs_burn (-59.7), sign_alive (-55.3), come_up (-49.6), boots_go (-47.8). The quietest approved sound is **48 dB under the loudest**; on a phone at arm's length these are silence |

**THE PATTERN UNDERNEATH IT:** the flags land overwhelmingly on the `_more` SIBLING sounds
-- the extra variants cooked to feed moments he had already approved. The parent sounds
measure well. The siblings are quieter, thinner, more centred and more spiky than the
sounds they were cooked to stand beside, which is exactly what "variation" should not mean.

---

## THE ONE THAT CHALLENGES US, AND IT IS ABOUT THE INSTRUMENT, NOT THE SOUNDS

The obvious next question -- **which of the 65 approved sounds does the walked game ever
actually ask for?** -- cannot be answered by reading the code, and this round proved it the
expensive way. A text search said 50 events are never called. A better search said 56. **Both
are wrong**: the footstep caller builds its event name by concatenation (`'step_' + surface`)
and three call sites pass a variable, so a name assembled at run time is invisible to every
grep ever written.

So a live probe was built (`tools/bohemia_eyes_ears_live.js`): it wraps `BOH_SFX.render`
itself -- the one hook no caller can route around -- walks the city, and counts. Its first
run reported **80 step messages posted by the city, a picture that moved 34.3%, and zero
sounds rendered**. That looks like a headline. **IT IS NOT REPORTED AS ONE**, because the
same run also reported the parent's music engine had no AudioContext, and a clean run
proves the context IS running immediately after the splash tap. A zero measured while the
audio engine was down says something about the harness, not about the game. E3 taught this
lane that lesson at its own expense five hours ago; the tool ships with the probe, the
counter and the proof-of-movement in it, and the finding waits for a harness that can show
audio was alive for the whole walk.

## ROUTED
- **SOUNDS**: the `_more` siblings are the weak half of the library by measurement (12
  spikes, most of the dead-centre set, three of the four inaudible ones). The weak list
  names every event.
- **SOUNDS / UI**: 22 events lose more than half their energy below 500 Hz, which a phone
  speaker cannot reproduce. That is a mix decision, not a taste one.
- **EYES AND EARS (this lane)**: finish the live probe so "which sounds does the game
  actually play" is a measurement (that is E5's question and it now has an instrument
  waiting), then E2 [glitch list].

## SOURCES
- ASWG-R001, average loudness and peak levels of audio content (Sony/ASWG):
  gameaudiopodcast.com/ASWG-R001.pdf
- ITU-R BS.1770-4 / EBU R128 loudness measurement (K-weighting, gating)
- Layering, transient smear and the transient/body/tail structure: sfxengine.com impact and
  door-slam guides; hyperbits.com on thin layers and phase cancellation in 200-500 Hz
- The factory's own research trail: records/BOHEMIA_RESEARCH_FFX_UI_SOUND_7_29_26.md
