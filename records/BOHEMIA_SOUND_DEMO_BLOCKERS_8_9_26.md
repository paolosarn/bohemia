# SOUND LANE — DEMO BLOCKERS (8/9/26)

Per the demo dispatch: everything already in flight in THIS lane that needs
Paolo to finish it. Numbered, one line each, thumbable. Nothing here is a thing
a lane can decide for itself.

## STATUS 8/20/26

FOUR of the five are still live and all four are the same kind of thing: HIS EAR
on candidates already cooked and already in the MUSIC tab. Number five is closed
and the note under it explains why it was never really a blocker.

Nothing in this lane is waiting on a decision from him. Everything in this lane
is waiting on thumbs he may never spend, and per STALE UNJUDGED IS DEAD that
silence is itself an answer -- so nothing here blocks the demo shipping.

## THE BLOCKERS

1. **SQUIGGLE VOICES — 8 candidates, judge by ear.** MUSIC tab. Eight voices all
   saying the same line so the voice is what varies. Which are people in this
   game? *(thumbs, per voice)*
2. **THE FRESH DOORS — 10 candidates, judge by ear.** MUSIC tab. Ash drag + stone
   clack, cooked from the materials that beat the ten you killed. *(thumbs)*
3. **THE 4 ACOUSTIC SPACES.** Open desert / street / room / big hall. Shipped and
   live since 8/4, never thumbed. *(thumbs, or "leave it")*
4. **THE 9 BATCH-20 SONGS.** Cooked, shown, never ruled. *(thumbs)*
5. ~~**MENU MUSIC: does the front splash play?**~~ **CLOSED 8/19/26 — NOT A
   BLOCKER, AND IT SHOULD NEVER HAVE BEEN ONE.** This was written on 8/9, the
   same day EVERYTHING IS A THUMB landed, and it is exactly the shape that law
   killed: a design decision parked on his desk. Under that law it was mine, so
   it got decided and built.
   AND GOING TO BUILD IT FOUND WHAT THE BLOCKER WAS STANDING IN FRONT OF:
   `let CITYMUS_ON=false` in the city world. THE MUSIC SHIPPED OFF. You opened
   the link, tapped in, and the game was silent until you found a button in the
   city toolbar -- 124 finished songs behind a toggle. The menu question was a
   hole in the wall of a house with no roof.
   WHAT SHIPPED INSTEAD: the tap that enters the game turns the sound on (the
   one gesture a browser will let audio start on), opening on a MENU song and
   handing to the street shuffle on the phrase boundary. Three more MENU songs
   were cooked the same day because the live pool was ONE. Gate: the MENU waiver
   in music_reach_gate.js is DELETED and its waiver map is empty on purpose,
   which is now the assertion that every category he tagged can be heard.

## NOT BLOCKERS, ON PURPOSE

Things this lane can and did decide for itself, listed so nobody re-asks him:

- Which sound each footstep is, per ground — the tile already knows.
- Whether hit/kill quantise — combat already places them on the beat and
  re-quantising would push them OFF it.
- The strike count for time passing — his "amount of time that goes by" ruling
  settled it, and his 10 min / 1 hr / 6-12 hr numbers confirmed it unchanged.
- Whether voices get their own volume bus — no, the EFFECTS slider already owns
  them.

## WHAT IS ALREADY DONE IN THE MINIMUM DEMO SOUND SET

The dispatch names five. Four are live and one was blocked until his 8/9 message
reopened it:

| | status |
|---|---|
| footsteps by ground | **LIVE** — asphalt/gravel/dirt chosen by the tile |
| hit + kill on the beat | **LIVE** — combat places them on the beat itself |
| UI tap | **LIVE** |
| save chime | **LIVE** |
| doors | **COOKED 8/9, WAITING ON HIS EAR** — blocker #2 |

## WHAT LANDED SINCE, 8/19-8/20 (none of it needed him)

| | |
|---|---|
| the music is ON when you open the game | the tap that enters starts it; it used to ship OFF behind a button |
| the game opens on a MENU song | MENUMUS, handing to the streets on the phrase boundary |
| 3 new MENU songs | the live pool was ONE, so every open sounded the same |
| the streets let go during a fight | they used to take the score back 64 bars in, mid-combat |
| a fight is never scored by the scratch patch | combat drew CUSTOM, the blank studio slot, one time in fourteen |
| winning and dying play a STING | in the key of whatever song is running, on the next beat |
| the fight BUILDS as you kill | his 7/3 kill-layer system, five styles, which nothing had ever switched on |
| 8 graveyarded songs buried | one of them was playing in the streets at top weight |
| the instrument bridge fixed | 161 render failures to 0, and two retired voices caught walking back in |

## THINGS THAT NEED A LANE THAT IS NOT THIS ONE

Recorded here because they came out of sound work and would otherwise sit:

- **EAT and SLEEP costs do not reach the game.** His 8/7 numbers (snack 10 min,
  meal 1 hr, sleep 6-12 hr) versus the run's live table (`EAT: spends:null`,
  `SLEEP: spends:8`). Blocked on structure that does not exist: eating has no
  food types and sleep has no way to choose a length.
  Full writeup: `records/BOHEMIA_FLAG_TIME_COSTS_NOT_WIRED_8_9_26.md`
- **Squiggle voices need a dialogue runtime to speak through.** The engine and
  the judge exist; the demo row says "speaks per dialogue line through the
  dialogue runtime", which is the PEOPLE lane's scripted-scene work. Once a line
  is delivered with a speaker id, one call makes it talk.
