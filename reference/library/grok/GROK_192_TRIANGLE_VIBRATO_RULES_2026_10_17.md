source: Grok, unverified, written 2026-10-17
PASSED FILTER (EYES 10/18 eyes-opus-10-18c. GAMES: none named. NUMBERS CHECKED: the triangle has no volume, sounds one octave below a pulse on the same timer, and a high DMC level ($4011) quiets the triangle and the noise through the nonlinear mixer (nesdev APU Triangle, Mixer). ERRATUM: in Web Audio a constant offset does not fade anything, the sum is linear; it only works through the nonlinear curve of Grok 194. FIT: 'bass under 55, lead 60-84' are MIDI note numbers, our song engine counts semitones up from 110 Hz (noteHz), so convert before using them; 4-7 Hz and 5-15 cents are proposals. records/BOHEMIA_EYES_THE_GROK_PAGES_STAMPED_MUSIC_FIRST_10_18_26.md)
# TRIANGLE VIBRATO RULES

## PAOLO SAID IN THIS CHAT

Paolo said more deep not surface level research. He wants better 120 BPM 8-bit songs that play on HTML without the crushed-sand sound so Claude can make stronger tracks for the light game engine.

## MY PROPOSAL

Triangle channel. NES triangle has no volume control. The 4-bit space builds the waveform itself, so it is full on or silent. Frequency is one octave lower than the same timer on a pulse. To fade it, games wrote the DMC counter ($4011). High DMC lowers triangle and noise volume. In Web Audio keep the triangle at fixed gain. Fade by mixing a constant offset or by silencing the channel cleanly with a short ramp. Do not try to volume-modulate the oscillator directly. The fixed full level is part of the dry stiffness.

Vibrato. A low-frequency sine or triangle (4-7 Hz) connects to the carrier frequency or detune. Depth of 5-15 cents or a few Hz. Start it after the attack so the note locks first. In Web Audio an OscillatorNode LFO into a GainNode into the main oscillator.frequency. Keep the LFO itself dry. No reverb. The slow wobble fits the analog parts that do not quite sit still.

Generative rules for Claude. Motif first: a 3-6 note cell. Every pattern derives from it. Vary repeats by duty, octave, or one added note. Voice independence: contrary or oblique motion. Register lock: bass under 55, lead 60-84. Phrase ends on the start chord or a clear cadence. Order list of 4-8 bar patterns. Output only JSON of patterns and order. No free prose notes. The constraints force the clear dry sound.

### COOK

One triangle bass at fixed gain that silences with a 15 ms ramp. One pulse with 6 Hz vibrato of 8 cents that starts after the attack. One Claude JSON of three patterns that share one motif and end on the same chord. Lock these against the earlier sheets. The art coordinator can cook them. The main character is still downed, never dead. Square house tiles stay. Nothing glows. Analog horror is the light the stillness and the parts that do not fit, decided at the source.
