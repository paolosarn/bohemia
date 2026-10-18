source: Grok, unverified, written 2026-10-17
FAILED FILTER (EYES 10/18 eyes-opus-10-18c. A WRONG NUMBER THAT BREAKS THE 120 BPM LAW: 'common values give 16th, 8th, quarter, half, whole notes at about 160-180 bpm' is false. The length table's two note families are 4/4 at 90 bpm (10, 20, 40, 80, 160) and at 75 bpm (12, 24, 48, 96, 192), counted at the length counter's 120 Hz on NTSC (nesdev APU Length Counter names 75 bpm; Furnace's NES table: 80 = 667 ms, a quarter at 90). Its advice, 'schedule the note stop time from the same table, do not free-form the duration', puts our notes off the 120 BPM grid: a quarter at 120 is 60 counts and a half is 120, and 120 is not in the table. Not cited. Its counterpoint and worklet paragraphs are sound and are covered by Grok 186 and 190. records/BOHEMIA_EYES_THE_GROK_PAGES_STAMPED_MUSIC_FIRST_10_18_26.md)
# LENGTH COUNTERPOINT WORKLET

## PAOLO SAID IN THIS CHAT

Paolo said more deep not surface level research. He wants better 120 BPM 8-bit songs that play on HTML without the crushed-sand sound so Claude can make stronger tracks for the light game engine.

## MY PROPOSAL

Length counter. The NES length table maps a 5-bit index to fixed counts. Common values give 16th, 8th, quarter, half, whole notes at ~160-180 bpm. Writing the high timer register reloads the count and restarts the envelope and phase. Halt bit freezes the count. In Web Audio schedule the note stop time from the same table. Do not free-form the duration. The fixed lengths keep the grid tight. A note that ends on the table value does not leave a tail that muddies the next hit.

Three-voice counterpoint. Prefer contrary or oblique motion. Avoid parallel fifths and octaves between any pair. Start and end phrases on a perfect interval (unison, fifth, octave). Keep adjacent voices at least a third apart. Bass moves slower. Lead takes the faster steps. The middle voice fills. In the JSON schema each pattern already has only three voices. Claude checks the last note of each voice against the next before it writes the order. The rules stop the voices from collapsing into one thick chord that becomes sand.

Sample-accurate worklet. An AudioWorkletProcessor process() runs every 128 samples on the audio thread. Post register writes or note events from the main thread with a timestamp. The worklet applies them at the exact sample. Duty sequences and LFSR steps advance inside the process loop. This is heavier than OscillatorNode but keeps the edges raw. Use it for the final music thread. The main thread only sends the order list. No blocking work inside process().

### COOK

One note that ends on a length-table quarter. One three-voice pattern that moves contrary and ends on a fifth. One AudioWorklet that steps a 25% duty and a short LFSR inside process(). Lock these against the earlier sheets. The art coordinator can cook them. The main character is still downed, never dead. Square house tiles stay. Nothing glows. Analog horror is the light the stillness and the parts that do not fit, decided at the source.
