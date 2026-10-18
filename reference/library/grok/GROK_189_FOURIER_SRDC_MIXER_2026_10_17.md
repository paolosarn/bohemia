source: Grok, unverified, written 2026-10-17
PASSED FILTER (EYES 10/18 eyes-opus-10-18c. GAMES: none named. NUMBERS CHECKED: the mixer formula is exact (nesdev APU Mixer: pulse_out = 95.88 / (8128 / (p1 + p2) + 100); the other group 159.79 with 8227, 12241, 22638, inputs 0-15, DMC 0-127, a group of all zeros set to zero); the harmonic size sin(n pi d)/n is right. ERRATUM: 'real parts stay zero for odd functions' is wrong for any duty but 50 percent, a 25 percent pulse is not an odd function; sine terms alone give the right harmonic sizes (it sounds the same on a held note) but not the pulse's shape. SRDC and the sentence are standard phrase forms, no number to source. records/BOHEMIA_EYES_THE_GROK_PAGES_STAMPED_MUSIC_FIRST_10_18_26.md)
# FOURIER SRDC MIXER

## PAOLO SAID IN THIS CHAT

Paolo said more. He wants deeper research so Claude can make better 120 BPM 8-bit songs that play on HTML without the crushed-sand sound for the light game engine.

## MY PROPOSAL

Fourier for duties. A pulse wave of duty d has sine coefficients proportional to sin(n * pi * d) / n. For NES: 12.5% (d=0.125), 25% (d=0.25), 50% (d=0.5), 75% (d=0.75). Build a PeriodicWave with the first 8-16 odd or relevant harmonics only. Low harmonic count keeps the edges from aliasing into sand. Real parts stay zero for odd functions. This gives the exact reedy or hollow tone the hardware used.

Sentence and SRDC. A sentence has a short basic idea stated twice (presentation), then material that departs and cadences (continuation). SRDC is Statement, Restatement (identical or near), Departure, Conclusion. Use 4 or 8 bars. The restatement can change duty or octave. Departure can be an arpeggio or channel share. This structure loops clean and stays memorable under three voices. Claude can output note arrays that follow it.

Nonlinear mixer. NES pulses sum through one nonlinear path, triangle-noise-DMC through another. Approximate with pulse_out = 95.88 / (8128 / (p1 + p2) + 100) and a similar form for the others. In Web Audio apply a soft gain curve or lookup after summing the channels. Two full pulses are quieter than twice one. This subtle compression keeps the mix from getting harsh and sandy when voices pile. Stay dry. No extra effects.

### COOK

One PeriodicWave built from the 25% duty sine coefficients. One 8-bar SRDC loop at 120 BPM. One soft nonlinear mix of two pulses over triangle. Lock these against the earlier sheets. The art coordinator can cook them. The main character is still downed, never dead. Square house tiles stay. Nothing glows. Analog horror is the light the stillness and the parts that do not fit, decided at the source.
