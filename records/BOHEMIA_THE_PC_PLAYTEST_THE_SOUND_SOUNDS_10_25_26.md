# THE PC PLAYTEST, THE SOUND'S PART (SOUNDS 10/25/26, row [the PC playtest: the sound's part], rule 164 items 19, 20, 23)

His words, on his PC, 10/24 (records/BOHEMIA_PAOLO_THE_PC_PLAYTEST_AND_THE_TWENTY_DOLLARS_10_24_26.md):
- 19: "they just kept running and running and overlapping each other, and even when I left the city I was still hearing them."
- 20: "they're getting repetitive, not that different from each other."
- 23: the song after a battle, "so bad, so terrible": it becomes one of his songs (rule 122).

Ships as BUILD 10/25b - THE SQUIGGLE STOPS, TWENTY MORE VOICES, HIS SONG AFTER THE FIGHT (0e0144c0 sources, ffe6b04f the cut,
b0190795 the darker tape top). No card (rule 127): he hears it the next time somebody talks and the next time he wins.

## MEASURED BEFORE (tools/bohemia_sounds_pc_playtest_measure.js on the demo of BUILD 10/24t)
- A town opened from the map (Anarchists), five people tapped: 7 lines, a keeper's line ran **9.38 s**, the lines 3.8 to 6.8 s.
  Seven lines drew **two** of the six voices. On the PC profile the same: 9 lines, three voices, longest 6.75 s.
- The shell's one voice (speakLine) did cut its own last line. But the town's walkers muttered through THEIR OWN player on
  the town's own audio context (slices/bohemia_busy_heard.js): nothing kept a mutter off a keeper, the greeter or another
  mutter's answer. And the map hides the town's frame on LEAVE without unloading it: the town's draw loop stops, so nothing
  ever told its voices; a line the shell was saying for a man in the town had no idea where it came from; the town's own
  sound (engine/bohemia_settlement_heard.js) looked once a second.
- Every voice was ONE woman (LJ Speech) moved by Praat into his six of 8/11, every one between 168 and 252 Hz.
- After a road fight on AUTO (seeded): the fight played SATELLITE PRAYER (his), and the instant it ended the shell played
  STING 'win', a synth figure on the rack's 'glasshope' voice (root, fifth, octave, twelfth, "rising, and it keeps rising",
  8/19). That, 'loss' (the 'subboom'), and the job's figures on the way home (PAYSTING 'paid' on the coldpiano, QUESTSTING
  'done' on the bell) are the only music after a battle that is not one of his songs.

## WHAT CHANGED
1. ONE FLOOR FOR EVERY VOICE (engine/bohemia_voice_recorded.js, shared on the top window, same origin):
   - ONE AT A TIME: a line for HIM (the shell's player, make({lead:true}): keepers, the greeter, the crew, the map's people)
     cuts whatever is talking in any frame; a BACKGROUND line (every other player: the walkers' mutters) is said only into
     silence (400 ms after the last line ends) and refused, never queued. RUN TWO's module needed no edit: its player is a
     background player by default and its handles go on the floor from the engine.
   - SHORT: a line for him keeps its first 12 letters, cut at a word (a mutter 7), with the sag or a question's rise on the
     words it keeps. Measured at 18 first: still 3.8 to 4.1 s with the word gaps and the sag, so 12. The drop and double rates
     doubled (0.045, 0.04) so a short line is still a little wrong (0.40 wrong things a line over 57 lines).
   - GONE WHEN YOU LEAVE: every line knows the frame that asked for it (speakLine now passes the message's source); the top
     looks every 100 ms and a line whose frame is hidden (on itself or any frame around it), detached or closed fades in
     15 ms; a frame already hidden says nothing. The town's own sound goes to zero in 30 ms the moment its frame hides
     (HUSH after ALL, a MutationObserver on its frame plus a 250 ms look, was one second), the bed, the doors, the jobs and
     the mutters with it, and comes back when it shows.
   - A render (an OfflineAudioContext: a gate, a judge page) never takes or waits for the floor.
2. TWENTY MORE VOICES, EACH A REAL PERSON (tools/bohemia_squiggle_more_voices.py): AudioMNIST (Becker et al. 2018, MIT
   licence, github.com/soerenab/AudioMNIST; the one multi-speaker set this box reaches, huggingface, openslr, festvox and
   zenodo refused), twenty of its sixty speakers picked by measure for spread (pitch 84 to 246 Hz) and by where they are from:
   fourteen men (Germany, one of them 61; Italy; South Africa; South Korea; Spain; Chennai; Egypt; China; Delhi; Syria twice;
   Brazil) and six women (a Tamil woman from Chennai, Denmark, China, France, Germany twice). Their own voices, never
   'Change gender'. 859 syllables aligned by PocketSphinx from the ten digits (60 ms of silence padded either side: without
   it the first consonant of two, four, five and three was lost in 9 of 10), each letter the nearest sound the digits hold,
   two takes a letter; re-timed by PSOLA to his letter slot, the lane's tape and room, a tilt and a band top of his own,
   one loudness; a second sprite slices/voice_heard/squiggle_more.mp3 (230 s, 1,349 KB) that loads after the first, so
   the first voices come exactly when they did. A person is one of the 26 by his own id (seeded, the same every time); a man
   the people mix knows is a man (sex 'm' or a beard) speaks as one of the fourteen men; his six are still themselves.
   A real voice keeps its own register: two semitones either side of the speaker's own (a low man stays a low man).
3. THE SONG AFTER THE BATTLE IS ONE OF HIS (tools/bohemia_sounds_the_song_after_the_battle_block.js, after the song fence):
   STING 'win' and 'loss' never play their synth figure (kept in STING.FIG); on the top of the next bar another of his songs
   (CITYMUS.pick through the fence, never the one that played the fight) takes the transport from its first bar on the same
   beat grid; while the fight's frame or the end screen is up, and 12 s after, the job's synth figures (paid, done, missed,
   taken) are held silent.

## MEASURED AFTER, ON THE DEMO (gates/the_pc_playtest_the_sound_gate.js, leg 5, BUILD 10/25b)
- The town: 8 lines, **0** overlapping pairs, longest **3.2 s with its breath** (was 9.38), lines 0.16 to 3.2 s; voices
  cand-7, am-46 (a low German man, 84 Hz), am-27 (an Italian man): three different people in one town, two of them real men.
- Leaving: nothing he heard in the town was still heard after LEAVE; the one line after it was the map's own upkeep line
  ('New blood eats too...'), said by the map 437 ms after he came back, not the town.
- The fight: won; the synth win **not played**; 1,095 ms after the end SLOW BLEED took the transport from REPO MAN on the top
  of a bar; every song after the fight in his set.
- Bare page, nested as the demo nests its frames: a mutter refused while one talks; the shell's line for a town man cut 4 ms
  after the map frame hid, the town's mutter 82 ms after; the town's HUSH 1 -> 0 -> 1.

## THE TWENTY, MEASURED APART, AND WHAT THAT DOES NOT SAY
From the sprites themselves, the median pair: **pitch 5.45 semitones apart against the six's 2.58 (2.11x)**; the long-term
spectrum below every band's top (250 to 4,500 Hz) **3.94 dB against 4.54 (0.87x)**. FOUND: by spectrum alone the twenty sat
CLOSER together than the six at first (6.74 against 8.67 over the whole band), because the six differ mostly by the colour
his 8/11 voices gave them (a tilt, a band top) and a real person through the same tape as nineteen others reads as one radio;
each real voice now has its own tilt and top. The gate does NOT measure a real throat, an accent or the timing of a real mouth:
twenty people against one woman moved.

## A CLICK THE RULER FOUND IN THE NEW VOICES, AND THE FIX
The six's own click ruler (gates/the_squiggle_creepier_gate.js) on the twenty: 1 click in 57 lines (25.6 dB over its
neighbours, a click is 20). Not in the sprite (no jump above 9 kHz anywhere in it); a take played ALONE at rate 0.74 clicked 3
times, at rate 1 never. It is the browser's own resampler: these recordings' consonants are mostly the digits' fricatives (s,
z, f, th, v), bright to the top of the band, and when the game slows a syllable (the sag at a line's end, a calm mood: rates
near 0.7) the linear resampler mirrors that brightness past 13 kHz. The real voices' band top is now 4.2, 4.7 or 5.2 kHz
(darker than the six's 5.2 to 7.2): **0 clicks in 114 lines**, the worst frame 16 dB (a real consonant). The level through the
game's chain -22.9 dB against the mark -22, the loudest peak -7.3 dBFS.

## GATES
- THE PC PLAYTEST, THE SOUND (new, registered): 15/0 (bare 10/0 plus the demo's 5).
- THE SQUIGGLE, CREEPIER 16/0 (re-aimed: its player is the game's lead voice, a line is its first twelve letters, the routing
  regex takes the source argument, the greeter may be a real voice). SETTLEMENT HEARD 21/0, THE BUSY TOWN TALKS 20/0 (RUN TWO's,
  untouched), THE SETTLEMENT IS BUSY 10/0, THE FIGHT DRIVES THE MUSIC 10/0, THE ONE BEAT 12/0 (11/1 once while four lanes'
  checkers and this round's cut ran at once; 12/0 alone), SONG LOCK 31/0, DEMO BUILD 25/0, SQUIGGLE VOICE 41/0, VOICE MOOD
  19/0, VOICE VARIETY 3/0, VOICE SURFACES 27/0, VOICE AUDIBLE 2/0.
- RED, NOT THIS ROW'S: ONE SONG ONLY O8 'REPO MAN PLAYS AS THE MACHINE PARTY: 0 machine hits in four seconds', red the same on a
  clean checkout of main (15/1); its second leg flickers.

## WHAT IS STILL OPEN, SAID
- The decoded voices on a phone: the first sprite 22 MB as before, the second about 42 MB more (230 s at 48 kHz), loaded after.
- A woman the people mix does not mark ('sex': null on 81 of 152 people) may get a man's voice and a man a woman's: the mix
  knows men by 'm' or a beard and nobody as a woman. When CHARACTER marks women, the floor reads it with no change here.
- The answer in a walker's mutter is refused when the first line trails a breath (the floor's quiet is longer than the
  module's gap after a breath): fewer answers, never two at once.
