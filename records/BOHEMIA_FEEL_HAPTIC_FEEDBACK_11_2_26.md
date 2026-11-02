# FEEL: HAPTIC FEEDBACK (11/2/26, rule 309, ask line 302)

Paolo, passing on a playtester's note: "make sure it gives haptic feedback, that's super important... when people play
this on controllers, or vibrating on their phone... I don't even know how that shit works, but make sure there's code
for it." Built to last for the phone app a publisher ships about a year out, and live in the browser now.

## WHAT EXISTED BEFORE
- Nothing in the game a player can reach. The old COMBAT tab's dial demo (COMBAT_B64, the workshop only) called
  navigator.vibrate itself eleven times (kills, the dial, vital hits), with no setting and no iPhone or controller path.
- The fight he plays (slices/BOHEMIA_FIGHT.html) had no buzz at all; neither did the map, the town, or the phone.

## WHAT SHIPPED
- **engine/bohemia_haptics.js**: ONE call, `haptic(kind)`. Nothing else in the game knows how it is done.
  Backends, best available wins (for the phone in the hand), a controller added on top:
  1. NATIVE, the app's own haptics once wrapped: Capacitor's Haptics plugin is found by itself (impact
     LIGHT/MEDIUM/HEAVY, notification SUCCESS/WARNING/ERROR, selection). Any other wrapper calls
     `BOH_HAPTICS.setNative(fn)`. That is the iPhone's Taptic Engine with no change to the game.
  2. VIBRATE, `navigator.vibrate` (Android Chrome, Firefox Android).
  3. THE iPHONE SWITCH: iOS Safari has no vibrate. Since iOS 18 a `<input type="checkbox" switch>` plays the
     system tick when it flips; a hidden one inside a label is flipped and removed (the ios-haptics library's way,
     Ionic's proposed fix the same). Not documented by Apple, and no source says whether it needs a fresh touch, so
     it plays only on an iPhone or iPad with no vibrate and only inside a touch (the page's user activation, else the
     table's gesture window); a heavier kind is more ticks, never a longer one.
  4. A CONTROLLER: Gamepad `vibrationActuator.playEffect('dual-rumble')` (Chrome, Edge, Safari), or
     `hapticActuators[0].pulse` (Firefox). Plays alongside the phone.
  Nothing missing is ever an error: no backend, no table, a cross-origin frame, each is silence.
- **records/target/bb/haptics.json**: every kind (20) with its Android pattern, native style, iPhone ticks, pad
  rumble, priority, cooldown and REASON; the settings (light scale, minimum pulse, gap, gesture window); the BUZZ
  row's words; the sounds map. draft:true, every number a first attempt for TUNING. A modder edits it, or hands a
  whole table as `window.BOH_HAPTICS_TABLE` before boot.
- **WIRED WITH THE LEAST CODE**:
  - `window.playSFX`, the one dispatcher every game sound goes through, is wrapped FROM OUTSIDE by a property setter
    in the haptics file. Whoever assigns it (the sound wire, and ONE BEAT FOR EVERYTHING that re-wraps it) is wrapped
    with no edit in their code; only the outermost call is felt. The table's sounds map says which sound is which
    kind; a sound it does not name is not felt (every footstep, shot, swing and miss, the music and its beat, the room,
    doors, the bag, the save bell, experience).
  - The fight's `BOHEMIA_SFX` messages are felt with their facts (whose man went down, his dead or theirs, won or
    lost), including the bullets and deaths that play their own sounds and never reach playSFX; the playSFX that a
    message causes is not felt twice (`window.event` is that message while it is handled). A frame inside a frame (the
    town inside the map) is heard the same way.
  - Every frame of ours gets `window.haptic` and has its own `navigator.vibrate` routed through the one call as kind
    'raw', so the old COMBAT tab's eleven raw calls obey the setting too.
  - ONE LINE in COMBAT TWO's fight: `sfx('clear', { result: result })`, so the recap is felt as won, lost or withdrew.
  - One script tag in the alpha's head (cut into the demo).
- **THE SETTING**: BUZZ on the gear's card, after MOTION (the phone's SETTINGS app opens that card): FULL / LIGHT /
  OFF, on by default, saved in localStorage `boh.haptics`. LIGHT halves every pulse and motor and drops a native
  impact one step; a native notification plays as a light impact.

## WHAT YOU FEEL, AND WHEN
| moment | kind | Android (ms on, off, on) | app (native) | iPhone ticks |
|---|---|---|---|---|
| a button on the phone | tap | 10 | selection | 1 |
| you cannot do that | deny | 10, 50, 10 | impact LIGHT | 2 |
| your blow lands, on THE PUNCH's freeze | hit | 14 | impact LIGHT | 1 |
| one of yours takes a blow | hurt | 22 | impact MEDIUM | 1 |
| a vital hit, or one of theirs struck down | big_hit | 30 | impact HEAVY | 1 |
| one of theirs dies | kill | 26, 34, 44 | impact HEAVY | 2 |
| one of YOUR men struck down | struck_down | 40, 70, 40 | WARNING | 2 |
| one of YOUR men dies | man_lost | 60, 60, 60, 60, 100 | ERROR | 3 |
| the fight won / lost / withdrew (the recap opens) | won / lost / withdrew | 18, 70, 36 / 70, 70, 70, 70, 120 / 30, 70, 30 | SUCCESS / ERROR / WARNING | 2 / 3 / 2 |
| batteries come in (a job's pay) | paid | 12, 60, 24 | SUCCESS | 2 |
| a level up | level_up | 14, 50, 14, 50, 40 | SUCCESS | 3 |
| a perk / a boss's verb / the boss down | perk / verb / boss_down | 18 / 20, 60, 20, 60, 90 / 50, 50, 90 | MEDIUM / SUCCESS / HEAVY | 1 / 3 / 3 |
| his last round (the slide locks back) | empty | 10 | impact LIGHT | 1 |
| the phone in the game buzzes (a post) | phone | 12, 80, 12 (once in 6 s at most) | impact LIGHT | 2 |
| the dial's important shot | dial_shot | 34 | impact HEAVY | 1 |
The hit lands in the same instant as its sound and THE PUNCH's freeze (both at 0.45 of the blow's beat; the freeze
holds 0.1 to 0.24 of a beat, 50 to 120 ms), and at 14 ms it is over before the struck man moves again.

## WHICH PHONES AND CONTROLLERS GET WHAT
| where | today in the browser | in the app (wrapped) |
|---|---|---|
| Android phone, Chrome / Firefox | every kind, its own pattern (vibrate) | native haptics (Capacitor) |
| iPhone / iPad, Safari, iOS 18+ | the system tick, 1 to 3 ticks a kind, only inside a touch (taps, a hit on his own move) | the Taptic Engine, every kind (Capacitor) |
| iPhone before iOS 18 | nothing (no API), never an error | the Taptic Engine |
| a computer | nothing from the computer itself | - |
| a controller (Xbox, PlayStation, Switch Pro, on Chrome / Edge / Safari / Firefox) | rumble on every kind, on top of the phone | the same, where the wrapper's browser has the Gamepad API |

## THE PROBE (tools/bohemia_feel_haptics_probe.js, records/target/FEEL_HAPTICS_PROBE.json)
The demo with this change cut into it (stamped DEMO - BUILD 11/3j - YOU FEEL IT before its rebase onto main's 11/3u; it ships as 11/3v) at the phone's profile (390 x 844, touch), every frame's
navigator.vibrate and one plugged-in controller stubbed to record. Backends seen: vibrate yes, one pad, native no
(not wrapped), iPhone switch no (Chromium). Played like a player: the phone's PLAY twice, CREW and its DONE; the first
town (Anarchists), a look around, four people tapped, a job's pay credited; a road crew (the toll crew) on AUTO to the
recap (won); then the phone's SETTINGS app and BUZZ tapped FULL -> LIGHT -> OFF -> FULL. Zero page errors.

| phase | seconds | felt | a minute | what | vibrate calls | ms buzzing | share of the time buzzing | pad rumbles | dropped |
|---|---|---|---|---|---|---|---|---|---|
| the map (the phone's buttons) | 16 | 5 | 19 | tap 3, deny 2 | 5 | 70 | 0.44% | 5 | 0 |
| the town (Anarchists) | 28 | 2 | 4.4 | tap 1, paid 1 | 2 | 46 | 0.17% | 2 | 0 |
| the fight (AUTO, to the recap) | 31 | 8 | 15.7 | hit 3, big_hit 2, kill 2, won 1 | 8 | 296 | 0.97% | 8 | 0 |
| all three | 74 | 15 | 12.2 | | 15 | 412 | 0.56% | 15 | 0 |

- The fight sent 31 sounds; 8 were felt (every landing, both kills, the win); 23 were not (shots, misses, swings,
  the high ground, the magazine): the trigger is heard, the landing is felt.
- No frame buzzed past the one call (raw_frames 0).
- THE SETTING on the demo: the row reads BUZZ after MOTION; each tap saved (`{"on":true,"strength":"light"}`, then
  off, then full); with OFF a tap and a kill reached no motor and no pad; LIGHT played the warning as 20, 70, 20
  (FULL is 40, 70, 40).
- FOUND ON THE WAY (for SOUNDS / UI 2): the phone's PLAY/PAUSE answers with the refusal sound (ui_deny), because the
  shell reads a button with class 'off' as refused, so it is felt as two small ticks. The buzz follows the sound, so
  fixing the sound's reading fixes both.
- This road fight was short (three of theirs). A long fight lands more blows; each kind's cooldown (hit 110 ms) and
  the busy rule keep two blows a sixteenth apart as two buzzes, never a smear. The gate holds the fight under one a
  second.

## WHAT IS LEFT
- A REAL PHONE (EYES): Android Chrome on a hit; the iPhone tick on a tap. Unverified on a real iPhone: whether the
  switch tick plays when the hit arrives from the fight's frame a fraction of a second after his touch.
- THE APP WRAPPER (a year out, the publisher): add `@capacitor/haptics` and the game's haptics become the Taptic
  Engine with no game change; if the wrapper is not Capacitor, it calls `BOH_HAPTICS.setNative(fn)` with
  `{kind, native, light, scale}`.
- THE DIAL: `dial_shot` waits in the table; the fight he plays has the dial set aside until he calls it.
- TUNING owns the numbers (the table is draft). The gate: YOU FEEL IT (gates/you_feel_it_gate.js --plant).

## SOURCES
- Apple Human Interface Guidelines, Playing haptics: https://developer.apple.com/design/human-interface-guidelines/playing-haptics
- Android, Haptics design principles: https://developer.android.com/develop/ui/views/haptics/haptics-principles
- ios-haptics (the switch trick): https://npmjs.com/package/ios-haptics ; Ionic's issue: https://github.com/ionic-team/ionic-framework/issues/29942 ; WebKit bug 266066
