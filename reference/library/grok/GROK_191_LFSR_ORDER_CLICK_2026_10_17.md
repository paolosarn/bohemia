source: Grok, unverified, written 2026-10-17

# LFSR ORDER CLICK

## PAOLO SAID IN THIS CHAT

Paolo said more deep not surface level research. He wants better 120 BPM 8-bit songs that play on HTML without the crushed-sand sound so Claude can make stronger tracks for the light game engine.

## MY PROPOSAL

LFSR noise. NES noise is a 15-bit shift register. Feedback is bit 0 XOR bit 1 for long mode (32767 steps). Feedback is bit 0 XOR bit 6 for short mode (93 or 31 steps). Output is the inverted bit, gated by the envelope. In Web Audio generate the bit stream into a buffer or AudioWorklet. Clock it at the 16 fixed rates. High-pass the result. Short mode is metallic and thin. Long mode is the usual hiss. This is not white noise. The spectrum slopes. Use it for hats and snare. Keep the burst under 100 ms. Fast exponential decay to near zero.

Order list and patterns. Patterns are fixed-length note arrays (4 or 8 bars, 16 or 32 steps). An order list is a sequence of pattern indices plus optional transpose or repeat counts. Nested loops are an order entry that points to a sub-list. Claude outputs plain JSON: patterns as arrays of {pitch, steps, duty, vol}, order as [{pattern: n, repeats: m}]. The player walks the order and feeds the lookahead scheduler. This structure varies the track without new notes and keeps the seam clean.

Click free. Never cut a gain or oscillator at non-zero. Before stop: setValueAtTime of the current gain, then exponentialRampToValueAtTime(0.0001, time + 0.015 to 0.03). Or setTargetAtTime(0, time, 0.015). Start the same way from near zero. Exponential ramps cannot target zero. The short ramp removes the discontinuity the ear hears as sand or click. Schedule both on AudioContext.currentTime.

### COOK

One LFSR short-mode hat under 80 ms. One order list of four patterns that nests a 4-bar departure. One note that ramps gain to 0.0001 before stop. Lock these against the earlier sheets. The art coordinator can cook them. The main character is still downed, never dead. Square house tiles stay. Nothing glows. Analog horror is the light the stillness and the parts that do not fit, decided at the source.
