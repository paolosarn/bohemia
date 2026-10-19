# THE GUNS HEARD: THE FIRST FIGHT'S GUNS FROM REAL GUNS (SOUNDS, 10/19/26, row [the guns heard])

Rule 120 (Paolo 10/18, LOCKED): 'I wanna start off with the guns too... the guns were supposed to be the main way this is
gonna be solved.' The coordinator, opening this round: 'the guns now come first: the gun sounds he hears in the first fight,
from real recordings, analog horror, on the beat.'

## WHAT THE FIGHT PLAYED BEFORE (measured, not guessed)

- Every gun posted one event, 'shot' (slices/BOHEMIA_FIGHT.html, SND: `(ranged ? SND.shot : SND.swing)()`), and the alpha
  drew it from six engine renders: his approved shot.3 and the five shot_more siblings (8/16b).
- MEASURED in a real Chromium render of the engine (tools/bohemia_guns_heard_now.js, slices/vote/guns_heard/now_measured.json,
  the loudest 100 ms): shot.3 is -8.5 dB; the five siblings are -31.7 to -33.8 dB. FIVE SHOTS IN SIX ARE ABOUT 25 dB UNDER
  THE ONE HE APPROVED: on a phone, most gunshots in a fight were close to silent. The same holds for hurt (hurt.2 -11 dB,
  hurt_more -34.6 to -37.4 dB). The 8/16b siblings were meant to be volume (more takes of the same moment) and came out a
  different, much quieter sound. Not fixed here: the guns below replace 'shot' on his YES; hurt is named for the next round.
- The PISTOL rides Battle Brothers' dagger row, which the fight does not count as ranged, so a pistol shot played the sword's
  whoosh (swing_air). A reload played nothing. A bow and a bottle (throwing) post 'shot', a gunshot (named for COMBAT; not
  this row's: a bow and a bottle are not guns).

## THE RECORDINGS

THE FREE FIREARM SOUND LIBRARY (Still North Media: Ben Jaszczak and a team of audio students, Kickstarter 2013-14),
CC0 1.0 (its LICENSE), mirrored whole on GitHub at github.com/buddingmonkey/FreeFirearmsSFXLibrary. This container reaches
GitHub and nothing else that hosts sound (freesound, opengameart, archive.org, wikimedia, zenodo: refused, measured 10/19).
22 real guns on a real range at 192 kHz 24-bit, every track named in its Master Sheet (gun, calibre, action, mic: near,
mid, far, behind). Three other leads were read and set aside: ShotSpotter's Pittsburgh live-fire data (CC BY 4.0, real
handguns in a real city, but 12 kHz sensors 45 m and more away: a far-gunfire find for the map's night, not a fight); the
Cataclysm DDA CC-Sounds pack (one recordist's real rifle and reloads under CC BY 4.0, the rest soundbible rips); AssaultCube
('I didn't keep track of my exact sources').

| the game's gun | Battle Brothers row | the real guns |
|---|---|---|
| PISTOL ('a cheap handgun... armor barely feels it') | dagger | 1911 .45, Walther PPQ 9mm, Smith & Wesson 642 .38 revolver |
| SHOTGUN ('one huge hit point-blank, then a slow reload') | firearm (handgonne) | Winchester Model 12, Benelli Nova, Charles Daly pump, 12 gauge |
| RIFLE ('hits from across the street') | crossbow | Mosin Nagant 7.62x54, Springfield 1917 .30-06, Tikka T3 .30-06 |

YOURS (the man who fired is yours) is the library's NEAR mic; THEIRS is its MID mic, further off. Each is LAYERED with the
same gun's FAR mic: measured, the near mic's tail is 40 to 55 dB under its shot within 100 ms (dry), the far mic holds the
range's real outdoor tail 30 to 35 dB under for a quarter second (the Model 12's far track even carries a natural reflection
near an 8th of a beat). Five takes per voice (an odd count against 4/4, never the same take twice in a row), across the
three guns. The reloads are the guns' own motion tracks (mag in, slide, shell in, pump back, pump forward, bolt up, back,
forward, down). 66 windows are banked as FLAC (reference/library/sound_bank/ffsl_cc0/, 5.7 MB, LICENCES.json and .md).

## THE CHAIN (tools/bohemia_guns_heard.py; every stage a real operation on a recording, never a generator)

1. CUT: 0.30 s before the onset to 2.0 s after, mono, 192 kHz to 44.1 kHz; near (or mid) plus far, each levelled by its
   first 20 ms (the far 6 dB under for yours, level for theirs).
2. THE STREET: a modelled canyon as wide as the Strip, 42.9 m facade to facade, so the shot comes back every 125 ms, A 16TH
   AT 120 BPM (a flutter echo: the street's width is what puts the gun on the grid). Fourteen bounces, each keeping 0.55 of
   its pressure, spreading as r0/r (the camera 10 m off for yours, 30 m for theirs, so their echo stands higher, as distance
   does), one more pole of darkness each bounce (3.6 kHz), smeared over the facade's depth (fixed taps at 3, 6 and 11 ms).
   The first try was two clean slaps at a 16th and an 8th with silence between: measured, three copies of the shot 3 to 8 dB
   apart, which reads as three shots, and digital zero between them; thrown out the same hour. A ray-traced
   pyroomacoustics canyon was tried next and came out too sparse to read as a street.
3. THE CAMCORDER: the machine that heard it, a consumer camcorder's automatic gain (2 ms attack, 500 ms release, up to
   +24 dB in the quiet): it slams down on the blast and the street breathes back over one beat (measured: the gain is
   8 to 16 dB higher one beat after the crack). This is found footage of gunfire, decided at the source, not a filter on a
   clean shot.
4. TAPE: the head bump (+2.5 dB at 110 Hz), tanh saturation at 1.8 (rule 8: the blast rounds off, never clips), wow
   0.25 percent at 0.9 Hz and flutter 0.08 percent at 5.3 Hz (rule 5: 0.15 to 0.6 percent).
5. THE MACHINE'S BAND, AFTER THE TAPE: VHS linear audio, 100 Hz to 10 kHz, a 2nd-order high-pass and a 4th-order low-pass
   (measured: with the band before the tape a pump's clack had 6 percent of its energy above 10 kHz; the lane's FR.lp is
   pedalboard's one-pole, 6 dB an octave, too soft for a gun's crack: named here, not changed in the shared tool).
6. THE DROP-OUT: take three of every A voice dives in its tail (36 ms, 14 dB, the top below 3.5 kHz kept, never zero;
   rule 6: a dive, not a cut). The frame is ordinary and one thing in it is wrong.
7. TWO BEATS: every shot is exactly 1.000 s, the last 16th a fade, so every shot ends on a beat.
8. ONE LOUDNESS PER GUN, NEVER SQUASHED: every take of a voice is set to the same loudness (the rms of its loudest 100 ms),
   chosen by the quietest take that still peaks under -1 dBFS, so the limiter never flattens a shot to make it fit. The
   SHOTGUN at the top (-23.4 dB), the RIFLE 1 dB under, the PISTOL 3 under; THEIRS 5 under YOURS; a reload 12 under.
C, THE CLEAN RECORDING: the same two real mics, the same two beats, the same loudness; no street, no camcorder, no tape.

THE RELOAD ON THE GRID: the motions laid on 16ths, never stretched or pitched: the PISTOL's mag on the beat, its slide an
8th later; the SHOTGUN's shell on the beat, the pump back on the 8th, forward on the next 16th; the RIFLE's bolt up on the
beat, back a 16th later, forward on the 8th after, down on the next beat.

## MEASURED (gates/guns_heard_gate.js, 33/0; mutated three ways, red every time: their rifle 2 dB too loud and the fight
## carrying the file, 30/2; the fight loaded before the buttons' sounds, 31/1; the fight's own bang not stood down, 32/1)

Decoded: nothing over -1.51 dBFS; every take of a voice within 0.11 dB of the others; every shot -87 dB or quieter at two
beats (no click); A at most 0.15 percent of its energy above 10 kHz; in every A take the canyon claps back a 16th after the
crack at least 20.6 dB over the gap before it; A's tail stands at least 12.3 dB higher against its crack than C's (the
camcorder); every drop-out dives 8 to 12 dB with its top going 22 to 34 dB, never to zero; theirs 5 dB under yours.
The page, his way (390 x 844, the VOTE tab's 62vh frame, a 1.6 Mbps phone network, real speed): a gun 161 ms after a tap
three seconds in; C 46 ms after its tap; a reload 753 ms after its tap; the real fight loaded in 19.9 s, ONCE (no tap
reloads it); in its first thirty seconds the fight's own guns are heard through the new sounds, yours and theirs, and the
rifle's reload, and the fight's own bang stands down (never a gun heard twice); every button 44 px on a 390 px screen;
nothing throws.

## THE CARD (VOTE, sounds-the-guns-heard-10-19)

slices/BOHEMIA_THE_GUNS_HEARD_10_19_26.html: the real fight (slices/BOHEMIA_FIGHT.html, untouched) from its own camera,
playing itself on AUTO with a company of six guns (two of each, the crew's own people and armour, RUN TWO's gear hand-over)
against four thugs and two marksmen with crossbows (seed 19: all three guns, their rifle and a reload in its first twenty
seconds); PISTOL, SHOTGUN, RIFLE fire your gun at once; THEIR SHOT, RELOAD; A the street on tape, B what plays now, C clean.
Everything plays through the alpha's own output chain (its compressor and brickwall, the same numbers). B is the alpha's
own pools (APPROVED and SIBLINGS, read out of the alpha by the tool into slices/vote/guns_heard/fight_now.json) rendered by
engine/bohemia_sfx.js with the alpha's vary. The hit, the miss and the fall are what the game plays, in every option.
The player for the game: engine/bohemia_guns_heard.js (BOH_GUNS_HEARD: gunOf, fire, reload, never the same take twice,
2 percent rate and 1 dB level wobble per shot).

## THE SWAP (CUE 7.7, on his YES; this lane changed no fight byte, no alpha byte, no demo)

COMBAT's three lines in the fight's sound block (a gun posts 'gun_<gun>_<yours|theirs>' instead of 'shot' or the whoosh,
a reload posts 'reload_<gun>') and the alpha's playSFX handing those to GUNS on the SFX bus, the 'bar_glass' shape; RUN's
cut (rule 93). FOR COMBAT: the bow and the bottle still post a gunshot; FOR THE NEXT ROUND OF THIS LANE: hurt_more sits
about 25 dB under hurt.2, the same defect as shot_more.

## ANALOG HORROR LINE (rule 20, section 9)

A gun in Bohemia is heard the way a found tape heard it: the crack too loud for the machine, rounded off; the street
clapping back on the grid; the camcorder pulling the empty block back up after the shot, so the silence after a gunshot is
the loudest thing in the frame. Nothing jumps; the machine just keeps recording.

## [bb ...] SCHOOL LINE

Battle Brothers gives each firearm and crossbow its own fire sound and a separate, audible reload; the reload is a turn's
cost the player hears. Ours: every gun its own real gun, the reload heard on the grid, and you hear whose gun it was.
