# THE BULLET LANDS: THE OTHER HALF OF THE GUN, IN THE GAME (SOUNDS, 10/24/26, row [the bullet lands])

Rule 120 (Paolo 10/18, LOCKED): 'the guns were supposed to be the main way this is gonna be solved.' Rule 126(c): every hit,
kill and fall in the fight is heard. Rule 127 (Paolo 10/23): no votes needed, he meets it in his next fight. The coordinator,
opening the round: 'every shot is heard landing (the hit in flesh, in armour, in cover, the miss that cracks past or kicks dust,
the ricochet, the man going down), per gun (pistol, rifle, shotgun, the machine gun's sweep), from real material, analog horror,
no sand; fired by the fight's own events.'

BUILD 10/24a - THE BULLET LANDS (58c786a9). Gate: gates/bullet_lands_gate.js, 14/0.

## WHAT THE FIGHT PLAYED BEFORE (measured through the game's own output chain, 10/24)

- Five shots in six were shot_more: -41.8 dB after the chain (the loudest 100 ms), close to nothing on a phone; one in six was
  his shot.3 at -9.9.
- A MISS was silent (no approved take for 'miss'). A HEAD HIT ('vital') was silent.
- The nine real guns of [the guns heard] (10/19) sat in a VOTE card and were never in a fight.

## THE REAL MATERIAL

THE CRACK IS A REAL BULLET. The Free Firearm Sound Library's far and mid microphones stand IN FRONT of the shooter, downrange
(its Master Sheet: 'far distance, front of shooter'). A rifle bullet outruns its own sound, so each of those mics hears the
bullet's supersonic crack first and the gun's report 12 to 33 ms later (measured on 12 tracks: the 1917, the Mosin, the Tikka,
the AR-15, the AK-47; the floor between the two 40 to 73 dB down). Thirteen cracks are cut out whole, from the crack to 1.5 ms
before the report arrives: the real sound of a bullet going past a man's head, recorded by a microphone, with no gun in it.
The machine gun's sweep is three of them on 16ths.

The machine gun itself: three real short full-auto bursts (AK-47, PPSh, Carl Gustav M45), every round lifted out at its own
onset and laid again on the grid: the AK's 600 a minute onto 16ths, the two sub-machine guns' thousand onto 32nds. Near mic for
yours, mid and far for theirs.

Everything else from ESC-50 clips whose Freesound authors released them CC0 (tools/bohemia_from_a_recording.py refuses any other
licence): the meat is a close clap (therabidfrog), the wet is bare feet in a shower cabin (RutgerMuller), the body under it a
large wood door knocked (aroth4), the plate an alarm clock's twin bell struck once (AngryAdam) over the steel between two train
wagons (felix.blume), the bone a knuckle on hard wood quickened (RutgerMuller), cover a wooden door knocked (ragamuffin),
asphalt under a heel (Ryding), gravel (Ryding, MentalSanityOff), glass (C_Rogers, ngruber), a car the wagons' steel and the
glass. The ricochet: the bell's strike, then a bluebottle fly (jamesrodavidson) quickened 8.5 times falling to 5.5 times over
a third of a second: its wings' 180 Hz becomes a 1.5 kHz whine that drops to 1 kHz as it goes by and away (measured: 1464 to
1076 Hz), a recording on varispeed, the Doppler of a passing thing; never an oscillator. The man going down: a knee (a heavy
step on a factory floor), the body (a door's slam quickened into the low mids a phone can play, and a clap slowed to a
meat-on-dirt slap), his gear (the wagons' steel, small), the dirt, then the last breath out (xavimuse) a beat after he lands;
struck down alive, a frightened breath in (Adam_N).

All banked as FLAC with their licence lines: reference/library/sound_bank/ffsl_cc0/ (13 cracks, 6 bursts, LICENCES.json with
the mic of each) and reference/library/sound_bank/esc50_cc0/ (15 new clips, LICENCES.md).

## THE CHAIN (tools/bohemia_bullet_lands.py; the guns' own stages, REUSE-FIRST)

The layers summed > the street canyon as wide as the Strip (an echo every 16th; the impact at 20 m) > the camcorder's automatic
gain held to +6 dB for a landing (measured: at the guns' +24 and at +12 the street's first echo stood 2 dB under the hit itself
and every landing read twice; +12 kept for a man going down, where the quiet after him is the point) > tape > the VHS band
100 Hz to 10 kHz > one cut (1.5 beats, a fall 4 beats), a 16th's fade > one loudness per voice. A fixed window caught a second,
louder clap inside the shotgun's pellets and put its peak 100 ms late: every event now stops 4 ms before the next thing its
clip does. pedalboard's limiter adds its own make-up gain (it lifted every landing 4.8 dB over its mark): never used after the
level is set.

ONE SPRITE: slices/fight_heard/lands.mp3, 104 takes of 26 voices, 92 s, 735 KB at 64 kbps (five takes where it is heard most,
three where it is rare, never one twice running). manifest.json carries every layer of every take.

## THE LEVELS, THROUGH THE GAME'S OWN COMPRESSOR AND BRICKWALL (tools/bohemia_bullet_lands_level.js)

A real gunshot is a spike (its loudest 5 ms 12 dB over its loudest 100 ms); the old shot.3 a wall (6 dB). So one number on the
file says nothing: MUS.audio's compressor (-14 dB, 6:1, 2 ms) and brickwall (-5 dB, 20:1, 1 ms) bend every sound differently
(+14 dB on the rifle's flesh came out +11; on its crack, +3.6). Every voice is rendered through those two nodes in Chromium
and halved to its mark, never past the gain where the chain's own output would peak over -1 dBFS (the brickwall's 1 ms attack
lets the first millisecond through). The marks, after the chain: the guns -20 (the shotgun's near mic; the other eight keep
their relations), a hit in a man -16.5 to -18 near (about -20 heard over there), cover -19, the dirt -21, the crack -24.2
(capped by its peak: a 15 ms spike has little 100 ms energy and all the snap), a man down -13. slices/fight_heard/index.json
is all the game reads beside the sprite. The guns ride +12.2 dB. The old fight through the same chain: hit.2 -20.3, hit.4
-13.5, his hurt.2 -14.4. MEASURED: a landing 50 ms after its own shot is not ducked by it (-15.7 alone, -15.7 after the shot):
the shot's street echo comes a 16th later.

## THE PLAYER (engine/bohemia_bullet_lands.js) AND HOW THE FIGHT REACHES IT

The fight already posts BOHEMIA_SFX (slices/BOHEMIA_FIGHT.html, SND): shot, hit, vital, miss, hurt, kill, went_down, swing_air,
melee_hit, mag_home. The shell's one line that hands it to playSFX now asks the player first (tools/bohemia_bullet_lands_patch.py,
idempotent): what it plays stands the old sound down, the rest goes on untouched.

WITH WHAT THE FIGHT SAYS TODAY (ev alone) it listens: whose turn it is (BOHEMIA_FIGHT_TURN), whether the last thing heard was a
shot or a swing (a miss within 1.4 s of a shot is a bullet's; after a swing it stays the swing's), and the gun each side
carries most, read once off the fight's roster when the board comes up (BOHEMIA_COMBAT_STARTED, through nfFight, the door RUN's
code already uses). A blade, a pipe, a fist, a footstep: never touched. His 'that was you' (hurt) always plays on top of the
bullet landing in his man.

WITH WHAT COMBAT CAN ADD (the NOTE on its board): gun, side, hp, armour, head, cover. Then it is exact: armour that stopped it
(the plate, and one in four off stone or steel whines away), through the plate (the plate and the flesh), the head (the bone),
cover by what it is made of (car_* steel and glass; pump, trailer, dumpster, slot_bank steel; shed, fence, dock, table wood;
walls, rocks, rubble, jersey, steps, pillars stone), the crack past one of HIS men (their rifle or machine gun missing), the
dirt at his feet (their pistol), the spray (a shotgun), the dirt over there (his own miss), the machine gun's own burst, the
real reload for the gun that named itself.

Over there (on their side of the board) is 4 dB down and its top gone above 5.2 kHz, the air. Twelve landings ring at once at
most. The sprites (1.4 MB with the guns) load 25 s after the music first runs, or the moment a fight comes up: never before
the door; until they are in, the fight plays exactly what it played before.

## THE COUNT-UP (TUNING's change 6, 'a win is a moment'; UI posts the moment)

BULLET.countUp(from, to), or postMessage({ type: 'BOHEMIA_COUNT_UP', from, to }): the battery number counting up is an
electromechanical counter, so each step is one real tick of an old Soviet electromechanical clock (the Yantar, ST303, the
machine party's own hat), one a 16th on the song's own grid (the step MUS books next), 24 at most (3 s); the number lands as
a battery dropped into a steel crate with the alarm clock's bell over it, on the beat after the last tick. Down (a lost fight,
'what it cost'): the same ticks a little softer and a dull drop, no bell. It answers BOHEMIA_COUNT_UP_PLAN { ticks, startMs,
stepMs, landMs } so the number can move with the ticks. Heard when UI posts it (NOTE on UI's board; UI is mid-row on
[the ten changes: the UI's part]).

## MEASURED IN THE GAME (gates/bullet_lands_gate.js, 14/0)

The demo, his phone's door, a road fight through the map's own door on AUTO, seed 7: the fight posted 8 shots, 12 misses (most
after a swing), 4 hits, 2 kills; the sprites were in before the first shot; 8 of 8 shots played as real guns; 9 landings
(flesh, the dirt, the fall); the turn and the roster reached the player (his crew: pistols; the toll crew: no guns);
0 dropped; nothing threw. The bare-page legs prove the exact path (every field) and the guessed path (ev alone), the levels
within 0.75 dB through the chain and none over -1 dBFS, no take twice running, the count-up on the song's beat.
Beside it: THE FIGHT DRIVES THE MUSIC 10/0, ONE SONG ONLY 16/0, the demo build gate green. The guns heard 32/1: its leg 'carry
none until his YES' re-aimed to rule 127; its 30-second card leg is red on a clean main too (32/1 measured there before this
change), not this row's. first fight 5/6 on a clean main and here alike (the dead day card, RUN's).

## NOTES LEFT (VAMILY)

- COMBAT: post the fields with the event (sfx(ev, ctx)): gun, side, hp, armour, head, cover; the bow and the bottle still post
  'shot', send gun null for them. Until then the shell guesses well; with them it is exact.
- UI: the count-up's door and its plan.
- RUN: the demo cut was this lane's for this one change.

## ANALOG HORROR LINE (rule 20, section 9)

The worst sound in a firefight is not the gun, it is the snap a few inches from your head that you only hear because it missed.
Here that snap is a real bullet on a real microphone, cut out before the gun's own bang could reach it, the street throwing it
back on the grid; the camcorder lifts the quiet after a man goes down until his last breath is the loudest thing on the tape.

## [bb ...] SCHOOL LINE

Battle Brothers tells you where every shot went by sound before you read the log: a thud in a man, a clang on a helmet, a
crack past, a body hitting the ground, each its own. Ours does the same from real recordings, and adds the one Battle Brothers
cannot: a miss on your man is heard as the bullet's own crack past his ear, a miss of yours as dirt kicked up over there.
