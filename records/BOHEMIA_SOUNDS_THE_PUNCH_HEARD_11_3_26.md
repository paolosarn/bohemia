# THE PUNCH HEARD (SOUNDS 11/3/26, ask line 266, BUILD 11/3s - EVERY HIT HAS A SOUND, a52f7da4)

Paolo 11/2: 'nothing feels punchy yet, satisfying punchy, not from the music to the combat to the walking around the city to
the camp.' COMBAT shipped the punch's pictures (11/2: the freeze, the white, the knock, the kick, the thud). This round makes
every one of those moments, and every new thing the other lanes shipped, make a real sound.

## 1. MEASURED FIRST: what played, on the real demo at phone size

Instrument: `tools/bohemia_sounds_every_event_heard.js` (drives `tools/bohemia_drive_the_demo.js`, phone portrait). It arms
every frame before any script: every audio source that STARTS is logged with the event the shell was answering, so a silent
event is an ask with no start, and a synth is an oscillator start. Then a map trip (three taps), the phone's real buttons by
finger (RELATIONS twice, HEAL twice), and a fight through the game's own door (`nfOpen`) on AUTO to its end. The final output
(the node that feeds the speakers) is metered every 90 ms. Reports: `records/target/BOHEMIA_SOUNDS_EVERY_EVENT_HEARD.json`
(the walk) and `..._FORCED.json` (each new hook's own message posted over the music, for what the walk did not meet).

| event | before (main, 938555f2) | after (this build) |
|---|---|---|
| a gun fires, by kind | real (BULLET, 18 of 18) | unchanged |
| a bullet lands / head / kill | real (BULLET, DEATH) | unchanged |
| a gun misses | real (BULLET) | unchanged |
| **a blow misses (pipe, blade, fist)** | **SILENT** (3 of 11 misses) | real: a foot thrown aside on gravel |
| **the swing's air** | synth (BOH_SFX oscillators) | real: a breath out quickened, a gust's top |
| **a blow lands (melee_hit)** | synth | real: blunt (body, skin, mass) or blade (a saw's stroke quickened, skin, wet) |
| **a blow on one of his (hurt)** | synth only | real blow + his breath knocked out, his ruled 'that was you' still on top |
| **reload** | synth (the fight never named the gun) | real: that gun's own reload ([the guns heard], BULLET), 6 of 6 |
| **struck down by a blow** | synth | real: a knee on concrete, the body, a frightened breath in |
| **the body lands (COMBAT's thud)** | no event at all | real, on the fall's last key: a door's slam slowed, gravel |
| **the high ground** | **SILENT** (4 of 4) | real: a ladder's creak, a boot on concrete |
| a man's step in a fight | the fight's own beep | **UNCHANGED ON PURPOSE**: his DOWN on REAL SHOES IN THE FIGHT (10/18) stands |
| **the robot: step, joint, hit, fall** | no machine sound (a man's sounds) | real: steel foot + relay, a vacuum motor glided like a joint, struck steel, the motor dying + the coupling slam |
| **the road stops you** | no event at all | real: a church clock bell struck once at half speed, a deck key |
| **a boss is marked** | no event at all | real: a civil-defence siren's wind-up at half speed, far, in a hall, the bell under it |
| **they come** | no event at all | real: two knocks, one a beat, something breathing |
| **camp made / camp broken (hours roll)** | no event at all | real: the fire catching / the fire dying, gravel kicked over it, a clock's ticks run fast |
| **the phone: press, page opens, page closes** | **SILENT** (no sound at all) | Crashbox: a mouse button and a gear tooth; a gear train and a plucked rubber band; the gears slowing and a latch |
| the fight won (clear) | the win's count-up (real, BULLET) | unchanged |


## 2. WHAT WAS MADE

`slices/fight_punch/punch.mp3` (one sprite, 37 s, 292 KB, mono 64 kbps), `manifest.json` (every take and its sources),
`index.json` (every voice's gain). 20 voices, 1 to 3 takes each (never the same take twice in a row, each play a hair faster or
slower, louder or softer). Made by `tools/bohemia_sounds_the_punch.py`, which IMPORTS the stages of
`tools/bohemia_from_a_recording.py` (window, speed, high-pass, tape, low-pass, the modelled room, the limiter): REUSE-FIRST,
the same chain every real-recorded sound in this game goes through. The only thing in it that is not a microphone is the
phone's rubber band: a Karplus-Strong string (a physical model of a plucked string, its pitch falling as a slack band's does),
under a real click. No noise beds, no oscillators.

THE PUNCH IS A TRANSIENT: every take is cut at its own attack (the strongest 10 ms onset, or a door's slam rather than its
latch). Measured on the sprite: every fight voice reaches its peak inside 25 ms of its start except `down` (the knee first,
the body 140 ms later, by design).

### The sources (all CC0 at the source, frozen in `tools/bohemia_from_a_recording_sources.json`, the clips in `reference/library/sound_bank/esc50_cc0/`)
Through ESC-50 (github.com/karolpiczak/ESC-50, the one sound host this box reaches); only clips whose Freesound author released
them CC0 (the tool refuses anything else). Before the game ships, re-pull the originals by their Freesound ids.
- Large wood door knocking, aroth4 (freesound 133889); Door open and close close mic, E-Audio (118624)
- Clap.mp3, therabidfrog (76408, three takes); Footsteps_Carpet, mlsulli (234855); Wet footsteps in a shower cabin, RutgerMuller (51147)
- WoodSaw1, Pingel (9886); Breath Human Sci, cidchili (54961); 3_Breath sport, mariiao2 (238492); Frightened Breathing, nickrave (112557)
- winter wind 01a, klangfabrik (117504); Footsteps on gravel (Fotsteg pa grus), Ryding (94344)
- Footsteps in a factory hall on wood and concrete, RutgerMuller (155858); CrDr_005 (a door creak), tec studios (107120)
- On a train in Argentina, between two wagons, felix.blume (165845, two takes); Old electromechanical clock 'Yantar', ST303 (171041)
- Vacuum cleaner, MrAuralization (231551); Wind-up clock with twin bell alarm, AngryAdam (131943); Glass break, ngruber (204777)
- Church Clock Strikes 12, JarredGibb (219044); civildefense.wav, guitarguy1985 (54084); Werewolf breathing, kd_jack (261464)
- Fire Crackling 01, kingsrow (181563); mouse click, davidkyoku (152895); clock_tick_close, life_interconnected (62849)
Every voice's exact list: `slices/fight_punch/manifest.json`.

### His votes this round obeyed (each one checked against the registry before shipping)
- REAL SHOES IN THE FIGHT (10/18): DOWN. A first cut gave a man's fight step a real asphalt step; `fight_steps_gate` caught
  it ('the fight keeps its own step until his YES'), it was taken out, and only a MACHINE's step is new.
- A CAN ON THE COUNTER (10/5): DOWN. A first cut used soda cans in the robot's hit and the phone; every can is out.
- THE TAPE IS SLIPPING (9/23): DOWN. A first cut stopped the road sting's tape; the glide is out.
- 'this wood glass bottle sound effect shit has got to stop': the blunt blow leads with the BODY (a carpet step slowed, a clap),
  the wood knock 7 dB under it for its mass only.
- 'ambience very, very low', 'nothing loud on the map': every map and phone sound is set under the map's music (section 4).

## 3. THE WIRING (every edit the one line where an event asks for its sound)

`tools/bohemia_sounds_the_punch_patch.py` (idempotent):
- ALPHA: `__THE_PUNCH_HEARD__` block, `engine/bohemia_punch_heard.js` inlined verbatim + glue (`window.PUNCH`, the effects bus
  `__sfxOut`, so the one beat's 16th and his mix hold; the sprite loads 6 s after the music first runs or when a fight comes up).
  The BOHEMIA_SFX line: DEATH first (unchanged), then PUNCH, then BULLET, then playSFX. Until the sprite is in, PUNCH claims
  nothing and every event plays what it played before.
- FIGHT (the sound block, rule 54b, and its callers): `SND.metal(u)` (a machine's step), `SND.swing(u)`, `SND.blow(u, t)` (a blow
  says it was a blow, blunt or blade by SND.death's own rule, and whether it struck steel), `SND.thud(u, at, B)` on COMBAT's
  `thudAt` call (the body's sound on the fall's last key, the same moment the glass kicks), a machine's fall says so, the reload
  says which gun (`{ gun: u.job }`: BULLET's real reloads were never asked for by name).
- MAP: WORLD's `btwStart` (camp made, camp broken, they come), the road card, `bohemia_his_map.js` readSign (the boss found):
  one `postMessage` each.
- PHONE: `appPress`, `pageOpen` (first page only), `pageClose` (only when a page was open).

## 4. AFTER, MEASURED (the same instrument, the cut demo of this build, phone portrait)

THE WALK (a fight on AUTO to its end, 36 s, 55 asks; the phone pressed by finger): **0 silent events** (before: melee misses
and the high ground silent, the phone silent). Every ask started a recording: shot 16/16, hit 6/6, vital 3/3, kill 3/3 (DEATH),
gun misses 7/7 (BULLET), blow misses 6/6, swing 6/6, reload 5/5 (the gun's own), high ground 3/3, body landing 3/3, phone
press, open and close 1/1 each. No oscillator started for any fight event (before: swing, reload, hurt, struck down).

THE LEVELS, the final output metered every 90 ms (the loudest 100 ms; peak in dBFS, over 0 is a clip):
| where | the music alone | with a sound | peak |
|---|---|---|---|
| the fight | -9.0 dB | -9.1 dB | -1.3 dBFS |
| the phone | -17.1 dB | -21.5 dB | -6.7 dBFS |
| the map | -19.1 dB | (the walk met no map event) | -7.2 dBFS |
**Nothing clips (highest peak -1.3 dBFS) and in a real fight no moment with a sound is louder than the fight's own music.**

FORCED (each new hook's own message, posted from the frame that posts it, over the map's music, which was at -23.0 dB; the
column is the music and the sound together):
| sound | loudest | vs the music alone | peak |
|---|---|---|---|
| camp made | -24.0 | -1.0 | -15.5 |
| camp broken | -24.0 | -1.0 | -14.5 |
| they come | -23.4 | -0.4 | -12.6 |
| the road stops you | -22.9 | +0.1 | -11.4 |
| a boss is marked | -22.4 | +0.6 | -11.8 |
| a robot's step | -24.2 | -1.2 | -10.8 |
| a robot's swing (servo + air) | -22.1 | +0.9 | -7.5 |
| a blow on a robot / a man | -13.8 | +9.2 | -1.9 |
| a robot goes down | -16.2 | +6.8 | -7.7 |
The map's sounds sit at the music's level (the sum of the two is within 1 dB of the music alone): heard, never over it. The
fight's blows read +7 to +9 over the MAP's quiet music because they were posted on the map; in a fight they play under the
fight's music at -9 (the walk above).

Every voice's gain is measured, not set by ear (`tools/bohemia_sounds_the_punch_level.js`, the bullets' own chain and ruler):
the blows at -14 to -16 (a bullet in a man is -16.5 to -18, a man going down -13 to -14), the swing -22, the scuff -23, the
robot's step -22 and servo -25, the map -25 to -28, the phone -29 to -30. Every peak after the chain is under -1.5 dBFS.

## 5. GATES (the ones that read a line this change touched, run once at the end; every red re-run on clean main 938555f2)
GREEN: BULLET LANDS 14/0, DEATH SOUNDS 13 of 14 (its last leg, 'the demo boots', was cut by my own 400 s timeout, not failed),
COMBAT SOUND 6/0, ANALOG HORROR SOUND 11/0, COOKED SOUNDS 240/0, EVERY FIGHT HANDS HIM BACK 10/0, FOOTSTEP 24/0, PICKUP 9/0,
SETTLEMENT HEARD 21/0, THE RELOAD IS LOUD 17/0, TRAVEL STEPS 31/0, THE MOMENTS BETWEEN 7/0, VERDICT FROZEN 6/0, DEMO BUILD 25/0,
THE VOTE CARDS PLAY 16/0. THE PHONE (after the rebase onto main 448adc5c, run alone): 256/2, both legs 'RELOAD is big' (the
button's size, UI's), every press, page open and page close leg green with this round's three phone hooks in.
THE SAME ON MAIN (pre-existing, not this round's): COMBAT ENTRY 0/1 and ONE ENGINE 0/1 (both 'page.click: Timeout'), DEMO SOUND
10/3 (the morning, the phone's old tick, the fight's music hand-over), FIGHT STEPS 33/1 (the floor table vs shore and works
pictures), EVERY SOUND IS REACHABLE 19/4, SFX DIVERSITY 39/1, PAGES PUBLISH 16/2. SFX WIRED 1052/4 here against 1050/6 on main.
FIGHT STEPS caught this round's one real mistake (a man's real step against his DOWN) and it was taken out before shipping.

## 6. WHAT HE DOES WITH IT
VOTE tab: THE PUNCH HEARD (every sound alone, tap again for another take, at the game's level). In the game: any fight (blows,
misses, reloads, falls); the phone's buttons; camp on the map away from a town. Rows to come: the robot is heard the moment
ROBOT's machines take the field (none were on the demo's first boards); a man's fight step waits for his word.
