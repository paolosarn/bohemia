source: Grok, unverified, written 2026-10-17
PASSED FILTER (EYES 10/18 eyes-opus-10-18c. GAMES: none named. NUMBERS CHECKED: in 4-step mode envelopes and the triangle's linear counter clock at about 240 Hz, lengths and sweeps at about 120 Hz; 5-step mode at about 192 and 96 Hz; writing $4017 resets the sequence (nesdev APU Frame Counter). FIT NOTE: the mixer formula takes channel LEVELS 0 to 15 (a pulse pair 0 to 30), not a signed -1 to 1 signal, so the curve must map the summed signal onto 0-30 and a high-pass must follow it to take out the offset, as the hardware's 90 Hz filter does; WaveShaperNode's 2x oversample is real. The note schema is a proposal. records/BOHEMIA_EYES_THE_GROK_PAGES_STAMPED_MUSIC_FIRST_10_18_26.md)
# FRAME SCHEMA SHAPER

## PAOLO SAID IN THIS CHAT

Paolo said more deep not surface level research. He wants better 120 BPM 8-bit songs that play on HTML without the crushed-sand sound so Claude can make stronger tracks for the light game engine.

## MY PROPOSAL

Frame counter. NES 4-step mode clocks envelopes and the triangle linear counter at ~240 Hz. Length counters and sweeps clock at ~120 Hz. 5-step mode is slower and uneven (~192 Hz envelopes). Writing $4017 resets the sequence. In Web Audio the lookahead scheduler can post the envelope steps at the same rates. Do not use a free ADSR. Use the 16 linear steps that reload on the loop flag. The fixed clock rate is the stiffness. Notes start and decay on the hardware beat, not on a soft curve.

Note schema for Claude. Patterns are arrays of fixed length (16 or 32 steps). Each step is an object or null: {pitch: "C4", duty: 1, vol: 12, steps: 2}. Order is an array of {pattern: 0, repeats: 2, transpose: 0}. Noise steps use a rate index 0-15 and mode 0 or 1. Claude outputs only this JSON. The player expands the order into a timeline and feeds the lookahead scheduler. No free-form notes. The schema forces the three-voice limit and the clean seam.

Waveshaper for the mix. Build a Float32Array curve that approximates the NES nonlinear sum. Map input -1 to 1 through the pulse formula pulse_out = 95.88 / (8128 / (p1 + p2) + 100) scaled into the curve. Apply a WaveShaperNode after the dry sum of the pulse pair. Do the same for the triangle-noise path. Oversample at 2x if aliasing appears. This soft compression keeps stacked voices from turning harsh. The curve is the hardware. No extra effects after it.

### COOK

One envelope that steps at the 240 Hz quarter-frame rate. One JSON pattern of 16 steps and an order of three entries. One WaveShaperNode curve that softens the sum of two pulses. Lock these against the earlier sheets. The art coordinator can cook them. The main character is still downed, never dead. Square house tiles stay. Nothing glows. Analog horror is the light the stillness and the parts that do not fit, decided at the source.
