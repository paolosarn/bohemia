source: Grok, unverified, written 2026-10-17
PASSED FILTER (EYES 10/18 eyes-opus-10-18c. GAMES: none named. NUMBERS CHECKED: the coefficient sin(n pi d)/(n pi) is right, and at 25 percent only every fourth harmonic is nulled, so the other even ones stay, as the page says. ERRATUM THAT MATTERS: a worklet that makes 'the raw edges the hardware had' at the browser's 44.1 or 48 kHz WILL alias, which is the sand; the 2A03 runs at 1.79 MHz and its own output filter removes it, so a worklet must step at the chip's rate and average down (what emulators do) or band-limit its edges, else use the PeriodicWave of 188, which is band-limited already. The order list is how tracker songs are made, a proposal. records/BOHEMIA_EYES_THE_GROK_PAGES_STAMPED_MUSIC_FIRST_10_18_26.md)
# DUTY COEFF NESTED WORKLET

## PAOLO SAID IN THIS CHAT

Paolo said more deep not surface level research. He wants better 120 BPM 8-bit songs that play on HTML without the crushed-sand sound so Claude can make stronger tracks for the light game engine.

## MY PROPOSAL

Duty coefficients. For a pulse of duty d the sine terms are (sin(n * pi * d) / (n * pi)). For 25% (d=0.25) the even harmonics are not fully nulled the way 50% is. Build the PeriodicWave imag array with the first 8-12 terms only. Set real to zeros. This matches the thin reedy NES pulse without letting infinite harmonics alias into sand. 12.5% is thinner. 50% is hollow. Switch the wave object mid-phrase for the duty change.

Nested loops and order lists. Short patterns (4 or 8 bars) live in a list. An order list says which pattern plays next and how many times. Nested means one loop lives inside another. This is how NES tracks varied without new data. A basic idea restates, then a departure pattern, then back. Claude outputs the patterns as note arrays and the order as a small list. The loop seam stays clean because the patterns already end on the start chord.

AudioWorklet for authenticity. Pure OscillatorNode squares are band-limited by the browser. Real 2A03 is not. An AudioWorklet that steps a duty sequence and LFSR at chip rates, then mixes through the nonlinear DAC curves, produces the raw edges the hardware had. Register writes land on the sample. This is heavier than simple oscillators but still light for a game. Use it only for the music thread. The main thread stays free. The dry raw character is the analog, not the sand.

### COOK

One PeriodicWave from the 25% sine coefficients with 8 harmonics. One order list of three 8-bar patterns that nest. One AudioWorklet that mixes two pulses and triangle through the nonlinear curve. Lock these against the earlier sheets. The art coordinator can cook them. The main character is still downed, never dead. Square house tiles stay. Nothing glows. Analog horror is the light the stillness and the parts that do not fit, decided at the source.
