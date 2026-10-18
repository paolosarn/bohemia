source: Grok, unverified, written 2026-10-17

# SWEEP FREQ GAIN

## PAOLO SAID IN THIS CHAT

Paolo said more deep not surface level research. He wants better 120 BPM 8-bit songs that play on HTML without the crushed-sand sound so Claude can make stronger tracks for the light game engine.

## MY PROPOSAL

Sweep unit. NES pulses have a hardware sweep. It shifts the 11-bit timer right by a count, adds or subtracts, and writes the new period on a clock. Negate on pulse 1 uses ones' complement (extra -1). Negate on pulse 2 uses two's complement. If the target exceeds $7FF the channel silences. If the timer is under 8 it silences. In Web Audio a short exponential or linear ramp on frequency can stand in for a one-shot sweep. Do not leave it running forever. A rising or falling phrase of 4-8 notes is enough. The silence on extreme periods is part of the limit. Stay inside the usable range.

Frequency from timer. NTSC CPU is 1.789773 MHz. Pulse frequency is CPU / (16 * (t + 1)). Triangle is half that for the same t. Precompute a table of the nearest integer t for each MIDI note. High notes have more cents of error. Use the table. Do not calculate on the fly every note. The quantization is the hardware. In Web Audio set the oscillator to the exact Hz the table maps to. The small tuning errors are the authentic grit, not sand.

Gain staging. Sum the channels dry. Pulse pair through one nonlinear curve. Triangle and noise through another. Then a master gain at 0.3-0.5 so three or four voices do not clip. No compressor. No limiter. No reverb. Each voice has its own gain node set to the 16-step level. The mix stays readable. The dry sum is the analog. Parts that do not fit, but the notes stay clear.

### COOK

One pulse with a 6-step rising sweep that silences at the top. One note table that maps MIDI to the nearest NES timer then to Hz. One dry mix of two pulses and triangle with master gain at 0.4. Lock these against the earlier sheets. The art coordinator can cook them. The main character is still downed, never dead. Square house tiles stay. Nothing glows. Analog horror is the light the stillness and the parts that do not fit, decided at the source.
