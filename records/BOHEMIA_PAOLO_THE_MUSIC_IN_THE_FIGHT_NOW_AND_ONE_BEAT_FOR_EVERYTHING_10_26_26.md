# PAOLO 10/26: THE MUSIC IN THE FIGHT NOW, AND ONE BEAT FOR EVERYTHING (LOCKED, rule 221)

## HIS WORDS (verbatim, voice to text)
"Bro, when does the music get implemented in the compound? I'm tired of it like not everything not being on the same BPM for real
like not sounding good as shit."
('compound' is 'combat'.)

## WHERE IT STANDS (measured)
- SOUNDS (rule 207) has not yet put the thirteen songs in the fight: it re-renders all thirteen with the bigger gap first
  ('restarting song batch A on fixed code; renders still running', 01:38). It shipped the VOTE cards playing (5529390f).
- EYES (line 87): in three fights their turn played level 1 and his turn level 2, never 3: the fight's turn messages reach the
  shell's intensity one step low.
- EYES (line 47): AUTO's hits, swings and shots land on the song's quarter beats about 100 ms LATE (75 ms window), and only
  loosely on the beat itself; by hand not measured. A 100 ms lag is what an uncorrected audio output delay sounds like.

## THE RULING (rule 221)
(a) THE MUSIC GOES IN THE FIGHT NOW, THEN GETS BETTER: SOUNDS wires the thirteen into the fight with the renders it already has
    (the map 1, their turn 2, his turn 3, the turn messages read right), and ships it at once; the re-rendered bigger gap
    (207(b)) replaces the files after, with no wait between. Better now, never 'when it's perfect' (rule 178).
(b) ONE BEAT FOR EVERYTHING: one 120 BPM clock, the audio clock, drives the music, every effect (shots, swings, steps, hits,
    reloads, the UI's ticks), every action's moment in the fight and the animations' keys, on the map, in the town and in the fight.
    The clock is corrected for the device's output delay (the audio context's own output latency), so what he HEARS lands on the
    beat, not 100 ms behind it.
(c) THE GATE: in rolled fights and by hand, phone and computer profiles: every action's sound starts within 20 ms of a beat (or its
    eighth) as heard after the output delay; the fight plays level 3 on his turn and 2 on theirs; the map plays 1; a song plays
    from the fight's first frame.
(d) SOUNDS [the music in the fight now] FIRST, then [one beat for everything]; COMBAT NOTE (the actions schedule on SOUNDS' one
    clock); line 143 on his list; EYES listens in three fights and measures the lag.
